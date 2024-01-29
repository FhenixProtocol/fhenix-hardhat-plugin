import { extendEnvironment } from "hardhat/config";
import { lazyObject } from "hardhat/plugins";

import { FhenixHardhatRuntimeEnvironment } from "./FhenixHardhatRuntimeEnvironment";
// This import is needed to let the TypeScript compiler know that it should include your type
// extensions in your npm package's types file.
import "./type-extensions";

extendEnvironment((hre) => {
  hre.fhenixjs = lazyObject(() => {
    const fhenixjs = require('fhenixjs');
    // const { ethWeb3Provider, zkWeb3Provider } = createProviders(hre.config.networks, hre.network);
    //   return new FhenixHardhatRuntimeEnvironment(hre);
    const env = new FhenixHardhatRuntimeEnvironment(hre);
    return {
      ...fhenixjs,
      utils: env,
      client: env.client,
    }
  }) 
});
