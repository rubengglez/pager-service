const ServiceId = require("../../domain/ServiceId");

class DeleteIncidentForServiceCommandHandler {
    #repository

    constructor(incidentRepository) {
        this.#repository = incidentRepository
    }

    async execute(deleteIncidentForServiceCommand) {
        const serviceId = new ServiceId(deleteIncidentForServiceCommand.serviceId())
        await this.#repository.deleteByServiceId(serviceId)
    }
}

module.exports = DeleteIncidentForServiceCommandHandler