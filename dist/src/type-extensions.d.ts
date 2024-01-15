import "hardhat/types/config";
import "hardhat/types/runtime";
import { FhenixHardhatRuntimeEnvironment } from "./FhenixHardhatRuntimeEnvironment";
declare module "hardhat/types/runtime" {
    interface HardhatRuntimeEnvironment {
        fhenix: FhenixHardhatRuntimeEnvironment;
    }
}
//# sourceMappingURL=type-extensions.d.ts.map