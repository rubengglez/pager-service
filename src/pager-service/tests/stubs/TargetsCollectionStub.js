
const TargetsCollection = require("../../domain/TargetsCollection");

class TargetsCollectionStub {
    static with(...targets) {
        return new TargetsCollection(targets)
    }
}

module.exports = TargetsCollectionStub