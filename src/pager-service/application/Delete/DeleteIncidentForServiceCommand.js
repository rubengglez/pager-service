class DeleteIncidentForServiceCommand {
    #serviceId

    constructor(serviceId) {
        this.#serviceId = serviceId
    }

    serviceId() {
        return this.#serviceId
    }
}

module.exports = DeleteIncidentForServiceCommand