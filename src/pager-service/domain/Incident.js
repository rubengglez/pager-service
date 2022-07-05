class Incident {
    #id
    #serviceId
    #timerId
    #targetsCollection

    static AckTimeoutInMinutes = 15

    static create(
        id,
        serviceId,
        timerId,
        targetsCollection,
    ) {
        return new Incident(id, serviceId, timerId, targetsCollection)
    }

    constructor(
        id,
        serviceId,
        timerId,
        targetsCollection,
    ) {
        this.#id = id
        this.#serviceId = serviceId
        this.#timerId = timerId
        this.#targetsCollection = targetsCollection
    }

    id() {
        return this.#id
    }

    dropFirstTargets() {
        const targets = this.#targetsCollection.first()
        this.#targetsCollection = this.#targetsCollection.forgetFirst()
        return targets
    }

    updateTimerId(timerId) {
        this.#timerId = timerId
    }

    serviceId() {
        return this.#serviceId
    }

    timerId() {
        return this.#timerId
    }

    targets() {
        return this.#targetsCollection
    }
}

module.exports = Incident