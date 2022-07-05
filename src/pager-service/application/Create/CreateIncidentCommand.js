class CreateIncidentCommand {
    #serviceId

    constructor(rawServiceId) {
        this.#serviceId = rawServiceId
    }

    serviceId() {
        return this.#serviceId
    }
}

module.exports = CreateIncidentCommand