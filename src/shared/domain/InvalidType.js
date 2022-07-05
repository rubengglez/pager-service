class InvalidType extends Error {
    constructor(message) {
        super(message);
        this.name = 'InvalidType'
    }
}

module.exports = InvalidType