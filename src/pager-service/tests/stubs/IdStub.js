const ULID = require('ulid')
const Id = require("../../domain/Id");

class IdStub {
    static random() {
        return new Id(ULID.ulid())
    }
}

module.exports = IdStub