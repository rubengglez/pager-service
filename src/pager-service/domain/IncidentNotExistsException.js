class IncidentNotExistsException extends Error {
    constructor() {
        super('An incident was not found');
        this.name = 'IncidentNotExistsException'
    }
}

module.exports = IncidentNotExistsException