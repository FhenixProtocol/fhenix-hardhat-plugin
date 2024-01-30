"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("hardhat/config");
const plugins_1 = require("hardhat/plugins");
const FhenixHardhatRuntimeEnvironment_1 = require("./FhenixHardhatRuntimeEnvironment");
// This import is needed to let the TypeScript compiler know that it should include your type
// extensions in your npm package's types file.
require("./type-extensions");
(0, config_1.extendEnvironment)((hre) => {
    hre.fhenixjs = (0, plugins_1.lazyObject)(() => {
        const fhenixjs = require("fhenixjs");
        const env = new FhenixHardhatRuntimeEnvironment_1.FhenixHardhatRuntimeEnvironment(hre);
        return {
            ...fhenixjs,
            utils: env,
            client: env.client,
        };
    });
});
(0, config_1.extendConfig)((config, userConfig) => {
    config.networks.localfhenix = {
        gas: "auto",
        gasMultiplier: 1.2,
        gasPrice: "auto",
        timeout: 10000,
        httpHeaders: {},
        url: "http://127.0.0.1:42069",
        accounts: {
            mnemonic: "demand hotel mass rally sphere tiger measure sick spoon evoke fashion comfort",
            path: "m/44'/60'/0'/0",
            initialIndex: 0,
            count: 20,
            passphrase: "",
        },
    };
});
//# sourceMappingURL=index.js.map