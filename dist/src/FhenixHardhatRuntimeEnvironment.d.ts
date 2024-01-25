import { FhenixClient } from "fhenixjs";
interface FhenixHardhatRuntimeEnvironmentConfig {
    rpcPort?: number;
    wsPort?: number;
    faucetPort?: number;
}
export declare class FhenixHardhatRuntimeEnvironment {
    config: FhenixHardhatRuntimeEnvironmentConfig;
    readonly fhenixjs: FhenixClient;
    readonly ready: Promise<void>;
    constructor(config?: FhenixHardhatRuntimeEnvironmentConfig);
    getFunds(addres: string): Promise<void>;
    sayHello(): string;
}
export {};
//# sourceMappingURL=FhenixHardhatRuntimeEnvironment.d.ts.map