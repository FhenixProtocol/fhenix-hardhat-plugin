import "hardhat/types/config";
import "hardhat/types/runtime";
import * as fhenixjs from 'fhenixjs';
import { FhenixHardhatRuntimeEnvironment } from "./FhenixHardhatRuntimeEnvironment";
import { FhenixClient } from "fhenixjs";
declare module "hardhat/types/runtime" {
    interface HardhatRuntimeEnvironment {
        fhenixjs: typeof fhenixjs & {
            client: FhenixClient;
            utils: FhenixHardhatRuntimeEnvironment;
        };
    }
}
//# sourceMappingURL=type-extensions.d.ts.map