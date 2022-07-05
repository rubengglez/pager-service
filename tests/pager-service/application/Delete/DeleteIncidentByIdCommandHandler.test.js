const IdStub = require("../../../../src/pager-service/tests/stubs/IdStub");
const DeleteIncidentByIdCommand = require("../../../../src/pager-service/application/Delete/DeleteIncidentByIdCommand");
const DeleteIncidentByIdCommandHandler = require("../../../../src/pager-service/application/Delete/DeleteIncidentByIdCommandHandler");

describe("DeleteIncidentByIdCommandHandler", () => {
    let handler
    let incidentRepository

    beforeEach( () => {
        incidentRepository = {
            deleteById: jest.fn()
        }
        handler = new DeleteIncidentByIdCommandHandler(
            incidentRepository,
        )
    })

    test("an incident should be deleted by id", async () => {
        const id = IdStub.random()

        const command = new DeleteIncidentByIdCommand(id.value())
        await handler.execute(command)
        expect(incidentRepository.deleteById).toHaveBeenCalledWith(id);
    })
})