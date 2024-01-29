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
        const fhenixjs = require('fhenixjs');
        // const { ethWeb3Provider, zkWeb3Provider } = createProviders(hre.config.networks, hre.network);
        //   return new FhenixHardhatRuntimeEnvironment(hre);
        const env = new FhenixHardhatRuntimeEnvironment_1.FhenixHardhatRuntimeEnvironment(hre);
        return {
            ...fhenixjs,
            utils: env,
            client: env.client,
        };
    });
});
//# sourceMappingURL=index.js.map