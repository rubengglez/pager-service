const InvalidType = require("../../shared/domain/InvalidType");
const EmptyTargets = require("./EmptyTargets");

class TargetsCollection {
    #list

    constructor(targetsList) {
        if (!Array.isArray(targetsList)) {
            throw new InvalidType(`expected an Array, given ${typeof targetsList}`);
        }
        this.#list = targetsList
    }

    first() {
        return this.#list[0] ?? new EmptyTargets()
    }

    forgetFirst() {
        this.#list.shift()
        return new TargetsCollection(this.#list)
    }

    map(callback) {
        return this.#list.map(callback)
    }
}

module.exports = TargetsCollection