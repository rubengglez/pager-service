const ServiceIdStub = require("../../../../src/pager-service/tests/stubs/ServiceIdStub");
const CreateIncidentCommandHandler = require("../../../../src/pager-service/application/Create/CreateIncidentCommandHandler");
const IdStub = require("../../../../src/pager-service/tests/stubs/IdStub");
const TimerIdStub = require("../../../../src/pager-service/tests/stubs/TimerIdStub");
const TargetsCollectionStub = require("../../../../src/pager-service/tests/stubs/TargetsCollectionStub");
const TargetsStub = require("../../../../src/pager-service/tests/stubs/TargetsStub");
const CreateIncidentCommand = require("../../../../src/pager-service/application/Create/CreateIncidentCommand");
const Notificator = require("../../../../src/pager-service/application/Notificator");
const Incident = require("../../../../src/pager-service/domain/Incident");
const IncidentStub = require("../../../../src/pager-service/tests/stubs/IncidentStub");
const IncidentNotExistsException = require("../../../../src/pager-service/domain/IncidentNotExistsException");

describe("CreateIncidentCommandHandler", () => {
    let handler
    let incidentRepository
    let ulidProvider
    let escalationPolicyProvider
    let timerProvider
    let smsProvider
    let emailProvider

    beforeEach( () => {
        incidentRepository = {
            findByServiceId: jest.fn(),
            save: jest.fn()
        }
        ulidProvider = {
            new: jest.fn()
        }
        escalationPolicyProvider = {
            findByServiceId: jest.fn()
        }
        timerProvider = {
            createTimeout: jest.fn()
        }
        emailProvider = {
            send: jest.fn()
        }
        smsProvider = {
            send: jest.fn()
        }
        const notificator = new Notificator(emailProvider, smsProvider)
        handler = new CreateIncidentCommandHandler(
            incidentRepository,
            ulidProvider,
            escalationPolicyProvider,
            notificator,
            timerProvider
        )
    })

    test("it should create an incident, notify first level target and set an ack timeout when no active incident for the service", async () => {
        const serviceId = ServiceIdStub.random()
        const id = IdStub.random()
        const timerId = TimerIdStub.random()
        const targetsOne = TargetsStub.random()
        const targetsTwo = TargetsStub.random()
        const targetsCollection = TargetsCollectionStub.with(
            targetsOne,
            targetsTwo,
        )
        const incident = Incident.create(
            id,
            serviceId,
            timerId,
            TargetsCollectionStub.with(targetsTwo)
        )
        ulidProvider.new
            .mockReturnValueOnce(id.value())
            .mockReturnValueOnce(timerId.value())
        escalationPolicyProvider.findByServiceId.mockResolvedValue(targetsCollection)
        incidentRepository.findByServiceId.mockImplementation(() => {
            throw new IncidentNotExistsException()
        });

        const command = new CreateIncidentCommand(serviceId.value())
        await handler.execute(command)
        expect(escalationPolicyProvider.findByServiceId).toHaveBeenCalledWith(serviceId);
        expect(incidentRepository.save).toHaveBeenCalledWith(incident)
        expect(smsProvider.send).toHaveBeenCalledWith(id, targetsOne.phoneNumbers())
        expect(emailProvider.send).toHaveBeenCalledWith(id, targetsOne.emails())
        expect(timerProvider.createTimeout).toHaveBeenCalledWith(timerId, Incident.AckTimeoutInMinutes)
    })

    test("when there is already an incident for the service, it should NOT create another one and no one should be notified", async () => {
        const serviceId = ServiceIdStub.random()
        const incident = IncidentStub.random()
        incidentRepository.findByServiceId.mockResolvedValue(incident)

        const command = new CreateIncidentCommand(serviceId.value())
        await handler.execute(command)
        expect(escalationPolicyProvider.findByServiceId).not.toHaveBeenCalled();
        expect(incidentRepository.save).not.toHaveBeenCalled()
        expect(smsProvider.send).not.toHaveBeenCalled()
        expect(emailProvider.send).not.toHaveBeenCalled()
        expect(timerProvider.createTimeout).not.toHaveBeenCalled()
    })
})