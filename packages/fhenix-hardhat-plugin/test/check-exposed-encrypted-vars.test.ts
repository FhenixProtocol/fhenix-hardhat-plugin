// tslint:disable-next-line no-implicit-dependencies
import { expect } from "chai";

import { useEnvironment } from "./helpers";
import { detectExposures, printExposedContracts } from "../src/exposed";

export default function ansiRegex({ onlyFirst = false } = {}) {
  const ST = "(?:\\u0007|\\u001B\\u005C|\\u009C)";
  const pattern = [
    `[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?${ST})`,
    "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))",
  ].join("|");

  return new RegExp(pattern, onlyFirst ? undefined : "g");
}

describe("Test CheckExposedEncryptedVars command", async function () {
  describe("Test with Hardhat runtime (artifacts added)", function () {
    useEnvironment("hardhat-project");

    it.only("checks that the check-exposed-encrypted-vars works", async function () {
      const test = await detectExposures(this.hre);

      const output = printExposedContracts(test);
      const stripped = output.replace(ansiRegex(), "");
      const splitLines = stripped.split("\n");
      const expectedLines = [
        "",
        "  contracts/ExposureTest.sol:ExposureTest",
        "",
        "    publicEuint32() exposes 1 encrypted variables:",
        "      pos-0 - euint32",
        "",
        "    test_namedStructOutput() exposes 1 encrypted variables:",
        "      outputStruct - struct ExposureTest.OutputStruct",
        "        c - euint32",
        "        d - ebool",
        "        e - eaddress[]",
        "",
        "    test_publicGetterOfPrivateVar() exposes 1 encrypted variables:",
        "      pos-0 - euint32",
        "",
        "    test_structOutput() exposes 1 encrypted variables:",
        "      pos-0 - struct ExposureTest.OutputStruct",
        "        c - euint32",
        "        d - ebool",
        "        e - eaddress[]",
        "",
        "    test_tupleOutput() exposes 3 encrypted variables:",
        "      a - euint32",
        "      b - euint32",
        "      c - euint32",
        "",
        "",
      ];

      for (let i = 0; i < splitLines.length; i++) {
        const split = splitLines[i];
        const expected = i < expectedLines.length ? expectedLines[i] : "";
        expect(expected).to.eq(split, `Line ${i} expected to match`);
      }
    });
  });
});
