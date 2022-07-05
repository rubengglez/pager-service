const DeleteIncidentForServiceCommandHandler  = require("../../../../src/pager-service/application/Delete/DeleteIncidentForServiceCommandHandler")
const ServiceIdStub = require("../../../../src/pager-service/tests/stubs/ServiceIdStub");
const DeleteIncidentForServiceCommand = require("../../../../src/pager-service/application/Delete/DeleteIncidentForServiceCommand");

describe("DeleteIncidentForServiceCommandHandler", () => {
    let handler
    let incidentRepository

    beforeEach( () => {
        incidentRepository = {
            deleteByServiceId: jest.fn()
        }
        handler = new DeleteIncidentForServiceCommandHandler(
            incidentRepository,
        )
    })

    test("an incident should be deleted by serviceId", async () => {
        const serviceId = ServiceIdStub.random()

        const command = new DeleteIncidentForServiceCommand(serviceId.value())
        await handler.execute(command)
        expect(incidentRepository.deleteByServiceId).toHaveBeenCalledWith(serviceId);
    })
})