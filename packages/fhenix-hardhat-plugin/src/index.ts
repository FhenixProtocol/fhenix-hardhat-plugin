import { extendConfig, extendEnvironment } from "hardhat/config";
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
