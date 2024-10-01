import chalk from "chalk";
import { TASK_TEST } from "hardhat/builtin-tasks/task-names";
import { task } from "hardhat/config";
import { HARDHAT_NETWORK_NAME } from "hardhat/plugins";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import MockFheOps from "../artifacts/@fhenixprotocol/contracts/utils/debug/MockFheOps.sol/MockFheOps.json";

task(
  TASK_TEST,
  "Deploy fhenix mock contracts on hardhat network test",
).setAction(async ({}, hre: HardhatRuntimeEnvironment, runSuper) => {
  if (hre.network.name === HARDHAT_NETWORK_NAME) {
    await hre.run("compile");

    await hre.network.provider.send("hardhat_setCode", [
      "0x0000000000000000000000000000000000000080",
      MockFheOps.deployedBytecode,
    ]);

    console.info(
      "Successfully deployed Fhenix mock contracts (solc 0.8.20) on hardhat network",
    );
  }

  return runSuper();
});
