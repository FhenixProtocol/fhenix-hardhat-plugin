/* tslint:disable-next-line */
import { expect } from "chai";
import { TASK_TEST } from "hardhat/builtin-tasks/task-names";

import { useEnvironment } from "./helpers";

describe("Fhenix Hardhat Network Plugin", function () {
  describe("Tests Hardhat Network Plugin Integration", function () {
    useEnvironment("hardhat");

    it("Should successfully start hardhat with Fhenix contracts", async function () {
      //
      const mockOperationsCodeBefore = await this.hre.network.provider.send(
        "eth_getCode",
        ["0x0000000000000000000000000000000000000080"],
      ); // we take the new Bytecode

      expect(mockOperationsCodeBefore).to.be.equal("0x");

      await this.hre.run(TASK_TEST);

      const mockOperationsCodeAfter = await this.hre.network.provider.send(
        "eth_getCode",
        ["0x0000000000000000000000000000000000000080"],
      ); // we take the new Bytecode

      expect(mockOperationsCodeAfter).to.not.be.equal("0x");
    });
  });
});
