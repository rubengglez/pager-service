class DeleteIncidentByIdCommand {
    #id

    constructor(rawId) {
        this.#id = rawId
    }

    id() {
        return this.#id
    }
}

module.exports = DeleteIncidentByIdCommand