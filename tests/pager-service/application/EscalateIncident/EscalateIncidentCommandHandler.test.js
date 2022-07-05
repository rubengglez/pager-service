const ServiceIdStub = require("../../../../src/pager-service/tests/stubs/ServiceIdStub");
const IdStub = require("../../../../src/pager-service/tests/stubs/IdStub");
const TimerIdStub = require("../../../../src/pager-service/tests/stubs/TimerIdStub");
const TargetsCollectionStub = require("../../../../src/pager-service/tests/stubs/TargetsCollectionStub");
const TargetsStub = require("../../../../src/pager-service/tests/stubs/TargetsStub");
const Notificator = require("../../../../src/pager-service/application/Notificator");
const Incident = require("../../../../src/pager-service/domain/Incident");
const IncidentNotExistsException = require("../../../../src/pager-service/domain/IncidentNotExistsException");
const EscalateIncidentCommandHandler = require("../../../../src/pager-service/application/EscalateIncident/EscalateIncidentCommandHandler");
const EscalateIncidentCommand = require("../../../../src/pager-service/application/EscalateIncident/EscalateIncidentCommand");
require('../../../../src/pager-service/tests/toMatchIncident')

describe("EscalateIncidentCommandHandler", () => {
    let handler
    let incidentRepository
    let ulidProvider
    let timerProvider
    let smsProvider
    let emailProvider

    beforeEach( () => {
        incidentRepository = {
            findByTimerId: jest.fn(),
            save: jest.fn()
        }
        ulidProvider = {
            new: jest.fn()
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
        handler = new EscalateIncidentCommandHandler(
            incidentRepository,
            ulidProvider,
            notificator,
            timerProvider
        )
    })

    test("when an incident does NOT exist for the timerId given, nothing should be done", async () => {
        const timerId = TimerIdStub.random()
        incidentRepository.findByTimerId.mockImplementation(() => {
            throw new IncidentNotExistsException()
        });

        const command = new EscalateIncidentCommand(timerId.value())
        await handler.execute(command)
        expect(incidentRepository.save).not.toHaveBeenCalled()
        expect(smsProvider.send).not.toHaveBeenCalled()
        expect(emailProvider.send).not.toHaveBeenCalled()
        expect(timerProvider.createTimeout).not.toHaveBeenCalled()
    })

    test("when an incident exists for the timerId given, incident should be notified to following targets", async () => {
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
            targetsCollection
        )
        const newTimerId = TimerIdStub.random()
        ulidProvider.new.mockReturnValueOnce(newTimerId.value())
        incidentRepository.findByTimerId.mockResolvedValue(incident)
        const updatedIncident = Incident.create(
           id,
           serviceId,
           newTimerId,
           TargetsCollectionStub.with(targetsTwo)
        )

        const command = new EscalateIncidentCommand(timerId.value())
        await handler.execute(command)
        expect(incident).toMatchIncident(updatedIncident)
        expect(incidentRepository.save).toHaveBeenCalledWith(updatedIncident)
        expect(smsProvider.send).toHaveBeenCalledWith(id, targetsOne.phoneNumbers())
        expect(emailProvider.send).toHaveBeenCalledWith(id, targetsOne.emails())
        expect(timerProvider.createTimeout).toHaveBeenCalledWith(newTimerId, Incident.AckTimeoutInMinutes)
    })
})