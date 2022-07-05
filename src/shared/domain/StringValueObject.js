const InvalidType = require("./InvalidType");

class StringValueObject {
    #value

    constructor(value) {
        if (typeof value !== 'string') {
            throw new InvalidType(`Expected a string value, but given ${typeof value}`)
        }
        this.#value = value
    }

    value() {
        return this.#value
    }
}

module.exports = StringValueObject