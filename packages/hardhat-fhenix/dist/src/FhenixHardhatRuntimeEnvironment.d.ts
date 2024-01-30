import { FhenixClient, SupportedProvider } from "fhenixjs";
import { EthereumProvider, HardhatRuntimeEnvironment } from "hardhat/types";
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
    createPermit(contractAddress: string, provider?: SupportedProvider): Promise<import("fhenixjs").Permit>;
    sayHello(): string;
}
export declare class MockProvider {
    send(method: string, params: any[] | Record<string, any>): Promise<any>;
    getSigner(): Promise<any>;
}
export {};
//# sourceMappingURL=FhenixHardhatRuntimeEnvironment.d.ts.map