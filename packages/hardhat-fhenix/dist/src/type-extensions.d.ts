import * as fhenixjs from "fhenixjs";
import "hardhat/types/config";
import "hardhat/types/runtime";
import { FhenixHardhatRuntimeEnvironment } from "./FhenixHardhatRuntimeEnvironment";
declare module "hardhat/types/runtime" {
    interface HardhatRuntimeEnvironment {
        fhenixjs: typeof fhenixjs & {
            client: fhenixjs.FhenixClient;
            utils: FhenixHardhatRuntimeEnvironment;
        };
    }
}
//# sourceMappingURL=type-extensions.d.ts.map