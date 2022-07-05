const TargetsCollection = require("../../../src/pager-service/domain/TargetsCollection")
const EmptyTargets = require("../../../src/pager-service/domain/EmptyTargets")
const TargetsStub = require("../../../src/pager-service/tests/stubs/TargetsStub");
const Targets = require("../../../src/pager-service/domain/Targets");

describe("given an empty targetsCollection is created" , () => {
    let collection

    beforeEach(() => {
        collection = new TargetsCollection([])
    })

    test("it should return an emptyTargets as first value", () => {
       expect(collection.first()).toBeInstanceOf(EmptyTargets)
    })

    describe("after forgetFirst", () => {
        beforeEach(() => {
            collection = collection.forgetFirst()
        })

        test("it should return an emptyTargets as first value", () => {
            expect(collection.first()).toBeInstanceOf(EmptyTargets)
        })
    })
})

describe("given targetsCollection is created with a list with one targets" , () => {
    let collection
    let targets

    beforeEach(() => {
        targets = TargetsStub.random()
        collection = new TargetsCollection([targets])
    })

    test("it should return targets as first value", () => {
        expect(collection.first()).toBeInstanceOf(Targets)
        expect(collection.first()).toBe(targets)
    })

    describe("after forgetFirst", () => {
        beforeEach(() => {
            collection = collection.forgetFirst()
        })

        test("it should return an emptyTargets as first value", () => {
            expect(collection.first()).toBeInstanceOf(EmptyTargets)
        })
    })
})

describe("given targetsCollection is created with a list with two targets" , () => {
    let collection
    let targetsOne
    let targetsTwo

    beforeEach(() => {
        targetsOne = TargetsStub.random()
        targetsTwo = TargetsStub.random()
        collection = new TargetsCollection([targetsOne, targetsTwo])
    })

    test("it should return targetsOne as first value", () => {
        expect(collection.first()).toBeInstanceOf(Targets)
        expect(collection.first()).toBe(targetsOne)
    })

    describe("after forgetFirst", () => {
        beforeEach(() => {
            collection = collection.forgetFirst()
        })

        test("it should return targetsTwo as first value", () => {
            expect(collection.first()).toBeInstanceOf(Targets)
            expect(collection.first()).toBe(targetsTwo)
        })

        describe("after forgetFirst", () => {
            beforeEach(() => {
                collection = collection.forgetFirst()
            })

            test("it should return an emptyTargets as first value", () => {
                expect(collection.first()).toBeInstanceOf(EmptyTargets)
            })
        })
    })
})
