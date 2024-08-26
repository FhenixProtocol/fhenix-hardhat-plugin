import chalk from "chalk";
import { TASK_TEST } from "hardhat/builtin-tasks/task-names";
import { task } from "hardhat/config";
import { HARDHAT_NETWORK_NAME } from "hardhat/plugins";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import MockFheOps from "../artifacts/contracts/MockFheOps.sol/MockFheOps.json";

task(
  TASK_TEST,
  "Deploy fhenix mock contracts on hardhat network test",
).setAction(async ({}, hre: HardhatRuntimeEnvironment, runSuper) => {
  if (hre.network.name === HARDHAT_NETWORK_NAME) {
    async function deployTokenFixture() {
      const mockFheCode = MockFheOps.deployedBytecode;

      await hre.network.provider.send("hardhat_setCode", [
        "0x0000000000000000000000000000000000000080",
        mockFheCode,
      ]);
    }

    await deployTokenFixture();

    console.info(
      chalk.green(
        "Successfully deployed Fhenix mock contracts (solc 0.8.20) on hardhat network",
      ),
    );
  }

  return runSuper();
});
