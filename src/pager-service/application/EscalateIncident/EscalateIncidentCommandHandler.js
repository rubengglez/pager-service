const TimerId = require("../../domain/TimerId");
const IncidentNotExistsException = require("../../domain/IncidentNotExistsException");
const Incident = require("../../domain/Incident");

class EscalateIncidentCommandHandler {
    #repository
    #ulidProvider
    #notificator
    #timerProvider

    constructor(
        incidentRepository,
        ulidProvider,
        notificator,
        timerProvider,
    ) {
        this.#repository = incidentRepository
        this.#ulidProvider = ulidProvider
        this.#notificator = notificator
        this.#timerProvider = timerProvider
    }

    async execute(escalateIncidentCommand) {
        const timerId = new TimerId(escalateIncidentCommand.timerId())

        try {
            await this.#escalateIncident(timerId)
        } catch (error) {
            if (error instanceof IncidentNotExistsException) {
                return
            }
            throw error
        }
    }

    async #escalateIncident(timerId) {
        const incident = await this.#repository.findByTimerId(timerId)
        const newTimerId = new TimerId(this.#ulidProvider.new())
        const targets = incident.dropFirstTargets()
        incident.updateTimerId(newTimerId)
        await this.#repository.save(incident)
        this.#notificator.notify(incident.id(), targets)
        this.#timerProvider.createTimeout(newTimerId, Incident.AckTimeoutInMinutes)
    }
}

module.exports = EscalateIncidentCommandHandler