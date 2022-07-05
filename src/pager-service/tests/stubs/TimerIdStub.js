const ULID = require('ulid')
const TimerId = require("../../domain/TimerId");

class TimerIdStub {
    static random() {
        return new TimerId(ULID.ulid())
    }
}

module.exports = TimerIdStub