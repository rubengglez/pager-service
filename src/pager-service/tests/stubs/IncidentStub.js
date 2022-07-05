const Incident = require("../../domain/Incident");
const TimerIdStub = require("./TimerIdStub");
const ServiceIdStub = require("./ServiceIdStub");
const IdStub = require("./IdStub");
const TargetsCollectionStub = require("./TargetsCollectionStub");

class IncidentStub {
    static random() {
        return new Incident(
            IdStub.random(),
            ServiceIdStub.random(),
            TimerIdStub.random(),
            TargetsCollectionStub.with()
        )
    }
}

module.exports = TimerIdStub