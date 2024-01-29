import { FhenixClient } from "fhenixjs";
import { HardhatRuntimeEnvironment, EthereumProvider } from "hardhat/types";
interface FhenixHardhatRuntimeEnvironmentConfig {
    rpcPort?: number;
    wsPort?: number;
    faucetPort?: number;
}
export declare class FhenixHardhatRuntimeEnvironment {
    config: FhenixHardhatRuntimeEnvironmentConfig;
    readonly client: FhenixClient;
    readonly provider: EthereumProvider | undefined;
    constructor(hre: HardhatRuntimeEnvironment, config?: FhenixHardhatRuntimeEnvironmentConfig);
    getFunds(address: string): Promise<void>;
    createPermit(contractAddress: string): Promise<import("fhenixjs").Permit>;
    sayHello(): string;
}
export {};
//# sourceMappingURL=FhenixHardhatRuntimeEnvironment.d.ts.map