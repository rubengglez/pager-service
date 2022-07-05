expect.extend({
    toMatchIncident(received, expected) {
        const expectedResult = expect.objectContaining({
            id: expected.id().value(),
            serviceId: expected.serviceId().value(),
            timerId: expected.timerId().value(),
        })

        const plainReceived = {
            id: received.id().value(),
            serviceId: received.serviceId().value(),
            timerId: received.timerId().value(),
        }

        const convertToPlainTargets = (targets) => ({
            emails: targets.emails(),
            phoneNumbers: targets.phoneNumbers(),
        })

        const targetsReceived = received.targets().map(convertToPlainTargets)
        const targetsExpected = expected.targets().map(convertToPlainTargets)

        const pass = this.equals(plainReceived, expectedResult);
        const targetsCollectionPass = this.equals(targetsReceived, expect.arrayContaining(targetsExpected))

        if (pass && targetsCollectionPass) {
            return {
                message: () =>
                    `Expected: ${this.utils.printExpected(expectedResult)}\nReceived: ${this.utils.printReceived(plainReceived)}`,
                pass: true,
            };
        }

        return {
            message: () =>
                `Expected: ${this.utils.printExpected(expectedResult)}\nReceived: ${this.utils.printReceived(
                    received,
                )}\n\n${this.utils.diff(expectedResult, plainReceived)}`,
            pass: false,
        };
    },
});