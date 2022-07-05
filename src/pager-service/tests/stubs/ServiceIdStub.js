const ULID = require('ulid')
const ServiceId = require("../../domain/ServiceId");

class ServiceIdStub {
    static random() {
        return new ServiceId(ULID.ulid())
    }
}

module.exports = ServiceIdStub