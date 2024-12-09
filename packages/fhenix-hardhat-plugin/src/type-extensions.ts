import { FhenixClient, fhenixsdk } from "fhenixjs";
import "hardhat/types/config";
import "hardhat/types/runtime";

import { FhenixHardhatRuntimeEnvironment } from "./FhenixHardhatRuntimeEnvironment";
import { InitParams } from "fhenixjs/lib/types/sdk/v2/sdk.store";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

type PermitV2AccessRequirementsParams =
  | {
      contracts?: never[];
      projects: string[];
    }
  | {
      contracts: string[];
      projects?: never[];
    };

type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

type FhenixsdkInitWithHHSignerParams = Expand<
  Omit<InitParams, "provider" | "signer" | "contracts" | "projects"> & {
    signer: SignerWithAddress;
    ignoreErrors?: boolean;
  }
> &
  PermitV2AccessRequirementsParams;

declare module "hardhat/types/runtime" {
  // Fhenix extension to the Hardhat Runtime Environment.
  // This new field will be available in tasks' actions, scripts, and tests.
  export interface HardhatRuntimeEnvironment {
    fhenixjs: FhenixClient & FhenixHardhatRuntimeEnvironment;
    fhenixsdk: typeof fhenixsdk & {
      /**
       * Initialize (or re-initialize) the fhenixsdk with an ethers hardhat SignerWithAddress
       */
      initializeWithHHSigner: (
        params: FhenixsdkInitWithHHSignerParams,
      ) => Promise<void>;
    };
  }
}
