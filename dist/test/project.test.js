"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line no-implicit-dependencies
const chai_1 = require("chai");
const FhenixHardhatRuntimeEnvironment_1 = require("../src/FhenixHardhatRuntimeEnvironment");
const helpers_1 = require("./helpers");
describe("Integration tests examples", function () {
    describe("Hardhat Runtime Environment extension", function () {
        (0, helpers_1.useEnvironment)("hardhat-project");
        it("Should add the example field", function () {
            chai_1.assert.instanceOf(this.hre.fhenixjs.utils, FhenixHardhatRuntimeEnvironment_1.FhenixHardhatRuntimeEnvironment);
        });
        it("The example field should say hello", function () {
            chai_1.assert.equal(this.hre.fhenixjs.utils.sayHello(), "hello");
        });
    });
    describe("Hardhat Runtime Environment extension for localfhenix", function () {
        (0, helpers_1.useEnvironment)("localfhenix");
        it("Should add the example field", function () {
            chai_1.assert.instanceOf(this.hre.fhenixjs.utils, FhenixHardhatRuntimeEnvironment_1.FhenixHardhatRuntimeEnvironment);
        });
        it("The example field should say hello", function () {
            chai_1.assert.equal(this.hre.fhenixjs.utils.sayHello(), "hello");
        });
    });
    // describe("HardhatConfig extension", function () {
    //   useEnvironment("hardhat-project");
    //   it("Should add the newPath to the config", function () {
    //     assert.equal(
    //       this.hre.config.paths.newPath,
    //       path.join(process.cwd(), "asd"),
    //     );
    //   });
    // });
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