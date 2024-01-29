import { FhenixClient } from "fhenixjs";
import { TASK_NODE_SERVER_READY } from "hardhat/builtin-tasks/task-names";
import { extendConfig, extendEnvironment, subtask } from "hardhat/config";
import { lazyObject } from "hardhat/plugins";

import { FhenixHardhatRuntimeEnvironment } from "./FhenixHardhatRuntimeEnvironment";
// This import is needed to let the TypeScript compiler know that it should include your type
// extensions in your npm package's types file.
import "./type-extensions";

extendEnvironment((hre) => {
  hre.fhenixjs = lazyObject(() => {
    const fhenixjs = require("fhenixjs");

    const env = new FhenixHardhatRuntimeEnvironment(hre);
    return {
      ...fhenixjs,
      utils: env,
      client: env.client,
    };
  });
});

extendConfig((config, userConfig) => {
  config.networks.localfhenix = {
    gas: "auto",
    gasMultiplier: 1.2,
    gasPrice: "auto",
    timeout: 10_000,
    httpHeaders: {},
    url: "http://127.0.0.1:42069",
    accounts: {
      mnemonic:
        "demand hotel mass rally sphere tiger measure sick spoon evoke fashion comfort",
      path: "m/44'/60'/0'/0",
      initialIndex: 0,
      count: 20,
      passphrase: "",
    },
  };
});

subtask(TASK_NODE_SERVER_READY).setAction(
  async ({ address, port, provider, server }, hre, runSuper) => {
    await runSuper();

    console.log("HELLO FROM INIT CLIENT AFTER PROIVDER");

    // initialize the client only after we have a provider
    hre.fhenixjs.client = new FhenixClient({
      ignoreErrors: true,
      provider,
    });

    return;
  },
);
