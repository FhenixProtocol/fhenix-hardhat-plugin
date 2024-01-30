"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line no-implicit-dependencies
const chai_1 = require("chai");
const FhenixHardhatRuntimeEnvironment_1 = require("../src/FhenixHardhatRuntimeEnvironment");
const helpers_1 = require("./helpers");
describe("Test Fhenix Plugin", function () {
    describe("Test Runtime with default project", function () {
        (0, helpers_1.useEnvironment)("hardhat-project");
        it("checks that loading fhenixjs on non-fhe chain doesn't crash", function () {
            chai_1.assert.instanceOf(this.hre.fhenixjs.utils, FhenixHardhatRuntimeEnvironment_1.FhenixHardhatRuntimeEnvironment);
        });
        it("checks that methods are injected on non-fhe chain", function () {
            chai_1.assert.equal(this.hre.fhenixjs.utils.sayHello(), "hello");
        });
        it("checks that client doesn't work on a non-fhe chain", async function () {
            let err;
            try {
                err = await this.hre.fhenixjs.client.encrypt_uint8(1);
            }
            catch (e) {
                // @ts-ignore
                err = e;
            }
            (0, chai_1.expect)(err).to.be.an("error");
            (0, chai_1.expect)(err.toString()).to.include("initializing fhenixjs");
        });
    });
    describe("Hardhat Runtime Environment extension for localfhenix", function () {
        (0, helpers_1.useEnvironment)("localfhenix");
        // todo: add a test that mocks the fhenixjs client and checks that the plugin works
        it("checks that we can load fhenixjs on localfhenix", function () {
            chai_1.assert.instanceOf(this.hre.fhenixjs.utils, FhenixHardhatRuntimeEnvironment_1.FhenixHardhatRuntimeEnvironment);
        });
        it("checks that fhenixjs methods get injected on localfhenix", function () {
            chai_1.assert.equal(this.hre.fhenixjs.utils.sayHello(), "hello");
        });
    });
});
describe("Unit tests examples", function () {
    describe("FhenixHardhatRuntimeEnvironment", function () {
        describe("sayHello", function () {
            it("Should say hello", async function () {
                const field = new FhenixHardhatRuntimeEnvironment_1.FhenixHardhatRuntimeEnvironment({});
                chai_1.assert.equal(field.sayHello(), "hello");
            });
        });
    });
});
//# sourceMappingURL=project.test.js.map