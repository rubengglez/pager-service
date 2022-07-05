class Notificator {
    #emailProvider
    #smsProvider

    constructor(emailProvider, smsProvider) {
        this.#emailProvider = emailProvider
        this.#smsProvider = smsProvider
    }

    notify(incidentId, targets) {
        this.#emailProvider.send(incidentId, targets.emails())
        this.#smsProvider.send(incidentId, targets.phoneNumbers())
    }
}

module.exports = Notificator