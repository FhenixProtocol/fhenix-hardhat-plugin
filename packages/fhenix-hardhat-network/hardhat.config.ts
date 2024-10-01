// We load the plugin here.
import { HardhatUserConfig } from "hardhat/types";
import "hardhat-dependency-compiler";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  defaultNetwork: "hardhat",
  paths: {},
  dependencyCompiler: {
    paths: ["@fhenixprotocol/contracts/utils/debug/MockFheOps.sol"],
  },
};

export default config;
