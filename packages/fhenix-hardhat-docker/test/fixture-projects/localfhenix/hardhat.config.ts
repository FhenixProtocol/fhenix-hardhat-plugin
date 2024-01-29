// We load the plugin here.
import { HardhatUserConfig } from "hardhat/types";

import '../../../src/index';

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  defaultNetwork: "localfhenix",
  networks: {
    localfhenix: {
      url: "http://localhost:8545",
    },
  },
  paths: {
    // newPath: "asd",
  },
};

export default config;
