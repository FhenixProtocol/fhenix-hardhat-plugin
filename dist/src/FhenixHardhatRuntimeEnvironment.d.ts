import { FhenixClient, Permit } from "fhenixjs";
interface FhenixHardhatRuntimeEnvironmentConfig {
    rpcPort?: number;
    wsPort?: number;
    faucetPort?: number;
}
export declare class FhenixHardhatRuntimeEnvironment extends FhenixClient {
    private config;
    private readonly provider;
    constructor(config?: FhenixHardhatRuntimeEnvironmentConfig);
    static startLocalFhenix(config?: FhenixHardhatRuntimeEnvironmentConfig): Promise<void>;
    static isLocalFhenixRunning(config?: FhenixHardhatRuntimeEnvironmentConfig): boolean;
    getFunds(addres: string): Promise<void>;
    generatePermit(contract: string): Promise<Permit>;
    sayHello(): string;
}
export {};
//# sourceMappingURL=FhenixHardhatRuntimeEnvironment.d.ts.map