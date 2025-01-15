// tslint:disable-next-line no-implicit-dependencies
import { assert, expect } from "chai";

import {
  TASK_FHENIX_CHECK_EXPOSED_ENCRYPTED_VARS,
  TASK_FHENIX_USE_FAUCET,
} from "../src/const";
import { FhenixHardhatRuntimeEnvironment } from "../src/FhenixHardhatRuntimeEnvironment";

import { useEnvironment } from "./helpers";
import { createTfhePublicKey, Encryptable } from "fhenixjs";
import { BobWallet, MockProvider } from "./mocks";

const HARDHAT_NETWORK_ID = "31337";

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
      expect(this.hre.fhenixjs.isHardhat).to.be.equal(true);
      const fakeEnc = await this.hre.fhenixjs.encrypt_uint8(1);
      expect(fakeEnc).to.be.an("object");
      expect(fakeEnc).to.have.property("data");
      expect(fakeEnc).to.have.property("securityZone");
    });

    // V2

    it("checks that fhenixsdk is initialized in hre", function () {
      expect(this.hre.fhenixsdk != null).to.equal(true);
    });
    it("fhenixsdk can be initialized", async function () {
      const bobProvider = new MockProvider(
        "0xPublicKeyMock",
        BobWallet,
        HARDHAT_NETWORK_ID,
      );
      const bobSigner = await bobProvider.getSigner();

      // Should initialize correctly, but fhe public key for hardhat not set
      await this.hre.fhenixsdk.initialize({
        provider: bobProvider,
        signer: bobSigner,
        projects: ["TEST"],
      });
    });
    it("fhenixsdk.initializeWithHHSigner utility function", async function () {
      const [signer] = await this.hre.ethers.getSigners();
      await this.hre.fhenixsdk.initializeWithHHSigner({
        signer,
        projects: ["TEST"],
      });

      // Should create a permit
      const bobPermit = await this.hre.fhenixsdk.createPermit();
      expect(bobPermit).to.be.an("object");
    });
    it("fhenixsdk encrypt", function () {
      const fakeEncResult = this.hre.fhenixsdk.encrypt(Encryptable.uint8(5));
      expect(fakeEncResult.success).to.be.equal(true);
      if (!fakeEncResult.success) return;

      const fakeEnc = fakeEncResult.data;
      expect(fakeEnc).to.be.an("object");
      expect(fakeEnc).to.have.property("data");
      expect(fakeEnc).to.have.property("securityZone");
      expect(fakeEnc.securityZone).to.be.equal(0);
    });
    it("fhenixsdk permit management", async function () {
      // const bobProvider = new MockProvider(createTfhePublicKey, BobWallet);

      const bobProvider = new MockProvider(
        createTfhePublicKey(),
        BobWallet,
        HARDHAT_NETWORK_ID,
      );
      const bobSigner = await bobProvider.getSigner();

      // Should initialize correctly, but fhe public key for hardhat not set
      // Should create and return a permit as a Result object
      const bobPermitResult = await this.hre.fhenixsdk.initialize({
        provider: bobProvider,
        signer: bobSigner,
        projects: ["TEST"],
      });
      expect(bobPermitResult.success).to.equal(true);
      if (!bobPermitResult.success) return;

      const bobPermit = bobPermitResult.data;
      expect(bobPermit).to.be.an("object");
      if (bobPermit == null) return;

      // Active hash should match
      const activeHash = this.hre.fhenixsdk.getPermit()?.data?.getHash();
      expect(bobPermit.getHash()).to.be.equal(activeHash);
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

    // V2

    it("checks that fhenixsdk is initialized in hre", function () {
      expect(this.hre.fhenixsdk != null).to.equal(true);
    });
    it("fhenixsdk can be initialized", async function () {
      const bobProvider = new MockProvider(createTfhePublicKey(), BobWallet);
      const bobSigner = await bobProvider.getSigner();

      // Should initialize correctly, but fhe public key for hardhat not set
      await this.hre.fhenixsdk.initialize({
        provider: bobProvider,
        signer: bobSigner,
        projects: ["TEST"],
      });
    });
    it("fhenixsdk.initializeWithHHSigner utility function", async function () {
      const [signer] = await this.hre.ethers.getSigners();
      const permitResult = await this.hre.fhenixsdk.initializeWithHHSigner({
        signer,
        projects: ["TEST"],
      });

      // Initialization creates a permit
      expect(permitResult.data == null).to.equal(false);
      expect(permitResult.data).to.be.an("object");

      // Should create a permit
      const bobPermitResult = await this.hre.fhenixsdk.createPermit();
      expect(bobPermitResult.data == null).to.equal(false);
      expect(bobPermitResult.data).to.be.an("object");
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
