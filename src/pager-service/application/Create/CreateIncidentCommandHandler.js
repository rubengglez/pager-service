const ServiceId = require("../../domain/ServiceId");
const Incident = require("../../domain/Incident");
const TimerId = require("../../domain/TimerId");
const Id = require("../../domain/Id");
const IncidentNotExistsException = require("../../domain/IncidentNotExistsException");

class CreateIncidentCommandHandler {
    #escalationPolicyProvider
    #repository
    #ulidProvider
    #notificator
    #timerProvider

    constructor(
        incidentRepository,
        ulidProvider,
        escalationPolicyProvider,
        notificator,
        timerProvider,
    ) {
        this.#repository = incidentRepository
        this.#ulidProvider = ulidProvider
        this.#escalationPolicyProvider = escalationPolicyProvider
        this.#notificator = notificator
        this.#timerProvider = timerProvider
    }

    async execute(createIncidentCommand) {
        const serviceId = new ServiceId(createIncidentCommand.serviceId())

        if (await this.#isThereAnActiveIncidentForTheService(serviceId)) {
            return
        }

        const targetsCollection = await this.#escalationPolicyProvider.findByServiceId(serviceId)
        const targets = targetsCollection.first()
        const id = new Id(this.#ulidProvider.new())
        const timerId = new TimerId(this.#ulidProvider.new())
        const incident = Incident.create(
            id,
            serviceId,
            timerId,
            targetsCollection.forgetFirst()
        )
        await this.#repository.save(incident)
        this.#notificator.notify(id, targets)
        this.#timerProvider.createTimeout(timerId, Incident.AckTimeoutInMinutes)
    }

    async #isThereAnActiveIncidentForTheService(serviceId) {
        try {
            await this.#repository.findByServiceId(serviceId)
            return true
        } catch (error) {
            if (error instanceof IncidentNotExistsException) {
                return false
            }
            throw error
        }
    }
}

module.exports = CreateIncidentCommandHandler