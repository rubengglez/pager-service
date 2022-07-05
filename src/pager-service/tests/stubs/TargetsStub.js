const Targets = require("../../domain/Targets");
const { faker } = require('@faker-js/faker');

class TargetsStub {
    static random() {
        return new Targets(
            [faker.internet.email()],
            [faker.phone.number()]
        )
    }
}

module.exports = TargetsStub