import { FhenixClient } from "fhenixjs";
interface FhenixHardhatRuntimeEnvironmentConfig {
    rpcPort?: number;
    wsPort?: number;
    faucetPort?: number;
}
export declare class FhenixHardhatRuntimeEnvironment extends FhenixClient {
    private config;
    constructor(config?: FhenixHardhatRuntimeEnvironmentConfig);
    static startLocalFhenix(config?: FhenixHardhatRuntimeEnvironmentConfig): Promise<void>;
    static isLocalFhenixRunning(config?: FhenixHardhatRuntimeEnvironmentConfig): boolean;
    getFunds(addres: string): Promise<void>;
    sayHello(): string;
}
export {};
//# sourceMappingURL=FhenixHardhatRuntimeEnvironment.d.ts.map