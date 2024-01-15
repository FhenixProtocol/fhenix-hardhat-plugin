import { ethers } from "ethers";
export declare class FhenixHardhatRuntimeEnvironment {
    readonly name: string;
    readonly rpcPort: number;
    readonly wsPort: number;
    readonly faucetPort: number;
    readonly ethers: ethers.providers.JsonRpcProvider;
    constructor();
    getFunds(addres: string): Promise<void>;
    destroy(): Promise<void>;
    sayHello(): string;
}
//# sourceMappingURL=FhenixHardhatRuntimeEnvironment.d.ts.map