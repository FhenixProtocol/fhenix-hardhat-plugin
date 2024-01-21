import { FhenixClient } from "fhenixjs";
type FhenixHardhatRuntimeEnvironmentConfig = {
    rpcPort?: number;
    wsPort?: number;
    faucetPort?: number;
};
export declare class FhenixHardhatRuntimeEnvironment {
    config: FhenixHardhatRuntimeEnvironmentConfig;
    readonly fhenixjs: FhenixClient;
    constructor(config?: FhenixHardhatRuntimeEnvironmentConfig);
    getFunds(addres: string): Promise<void>;
    sayHello(): string;
}
export {};
//# sourceMappingURL=FhenixHardhatRuntimeEnvironment.d.ts.map