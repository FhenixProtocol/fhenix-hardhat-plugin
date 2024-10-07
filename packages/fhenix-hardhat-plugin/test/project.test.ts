// tslint:disable-next-line no-implicit-dependencies
import { assert, expect } from "chai";
import { EncryptedUint8 } from "fhenixjs";

import {
  TASK_FHENIX_CHECK_EXPOSED_ENCRYPTED_VARS,
  TASK_FHENIX_USE_FAUCET,
} from "../src/const";
import { FhenixHardhatRuntimeEnvironment } from "../src/FhenixHardhatRuntimeEnvironment";

import { useEnvironment } from "./helpers";

describe("Test Fhenix Plugin", function () {
  describe("Test Runtime with default project", function () {
    useEnvironment("hardhat-project");

    it("checks that loading fhenixjs on non-fhe chain doesn't crash", function () {
      assert.instanceOf(this.hre.fhenixjs, FhenixHardhatRuntimeEnvironment);
    });

    it("checks that methods are injected on non-fhe chain", function () {
      assert.equal(this.hre.fhenixjs.sayHello(), "hello");
    });

    it("checks that client works on hardhat with transparent operation", async function () {
      expect(this.hre.fhenixjs.network).to.be.equal("hardhat");
      const fakeEnc = await this.hre.fhenixjs.encrypt_uint8(1);
      expect(fakeEnc).to.be.an("object");
      expect(fakeEnc).to.have.property("data");
      expect(fakeEnc).to.have.property("securityZone");
    });
  });

  describe("Hardhat Runtime Environment extension for localfhenix", function () {
    useEnvironment("localfhenix");
    // todo: add a test that mocks the fhenixjs client and checks that the plugin works

    it("checks that we can load fhenixjs on localfhenix", function () {
      assert.instanceOf(this.hre.fhenixjs, FhenixHardhatRuntimeEnvironment);
    });

    it("checks that fhenixjs methods get injected on localfhenix", function () {
      assert.equal(this.hre.fhenixjs.sayHello(), "hello");
    });
  });

  describe("Test Faucet command", async function () {
    useEnvironment("localfhenix");
    // todo: add a test that mocks the fhenixjs client and checks that the plugin works

    it("checks that the faucet works", async function () {
      await this.hre.run(TASK_FHENIX_USE_FAUCET);
    });
  });

  describe("Test CheckExposedEncryptedVars command", async function () {
    useEnvironment("localfhenix");
    // todo: add a test that mocks the fhenixjs client and checks that the plugin works

    it("checks that the check-exposed-encrypted-vars works", async function () {
      await this.hre.run(TASK_FHENIX_CHECK_EXPOSED_ENCRYPTED_VARS);
    });
  });
});

describe("Unit tests examples", function () {
  describe("FhenixHardhatRuntimeEnvironment", function () {
    describe("sayHello", function () {
      it("Should say hello", async function () {
        const field = new FhenixHardhatRuntimeEnvironment({} as any, {} as any);
        assert.equal(field.sayHello(), "hello");
      });
    });
  });
});
