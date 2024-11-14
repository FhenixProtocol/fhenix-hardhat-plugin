/* tslint:disable-next-line */
import "@nomicfoundation/hardhat-toolbox";
import { HardhatUserConfig } from "hardhat/types";

import "../../../src/index";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  defaultNetwork: "hardhat",
  paths: {
    // newPath: "asd",
  },
};

export default config;
