const Id = require("../../domain/Id");

class DeleteIncidentByIdCommandHandler {
    #repository

    constructor(incidentRepository) {
        this.#repository = incidentRepository
    }

    async execute(deleteIncidentByIdCommand) {
        const id = new Id(deleteIncidentByIdCommand.id())
        await this.#repository.deleteById(id)
    }
}

module.exports = DeleteIncidentByIdCommandHandler