import * as fhenixjs from "fhenixjs";
import "hardhat/types/config";
import "hardhat/types/runtime";

import { FhenixHardhatRuntimeEnvironment } from "./FhenixHardhatRuntimeEnvironment";

declare module "hardhat/types/runtime" {
  // Fhenix extension to the Hardhat Runtime Environment.
  // This new field will be available in tasks' actions, scripts, and tests.
  export interface HardhatRuntimeEnvironment {
    fhenixjs: typeof fhenixjs & {
      client: fhenixjs.FhenixClient;
      utils: FhenixHardhatRuntimeEnvironment;
    };
  }
}
