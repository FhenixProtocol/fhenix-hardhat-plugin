// tslint:disable-next-line no-implicit-dependencies
import { assert } from "chai";

import { FhenixHardhatRuntimeEnvironment } from "../src/FhenixHardhatRuntimeEnvironment";

import { useEnvironment } from "./helpers";

describe("Integration tests examples", function () {
  describe("Hardhat Runtime Environment extension", function () {
    useEnvironment("hardhat-project");

    it("Should add the example field", function () {
      assert.instanceOf(this.hre.fhenixjs.utils, FhenixHardhatRuntimeEnvironment);
    });

    it("The example field should say hello", function () {
      assert.equal(this.hre.fhenixjs.utils.sayHello(), "hello");
    });
  });

  describe("Hardhat Runtime Environment extension for localfhenix", function () {
    useEnvironment("localfhenix");

    it("Should add the example field", function () {
      assert.instanceOf(this.hre.fhenixjs.utils, FhenixHardhatRuntimeEnvironment);
    });

    it("The example field should say hello", function () {
      assert.equal(this.hre.fhenixjs.utils.sayHello(), "hello");
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
        const field = new FhenixHardhatRuntimeEnvironment({} as any);
        assert.equal(field.sayHello(), "hello");
      });
    });
  });
});
