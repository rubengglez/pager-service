class EscalateIncidentCommand {
    #timerId

    constructor(rawTimerId) {
        this.#timerId = rawTimerId
    }

    timerId() {
        return this.#timerId
    }
}

module.exports = EscalateIncidentCommand