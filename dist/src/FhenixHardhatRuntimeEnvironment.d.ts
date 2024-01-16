import { JsonRpcProvider } from "ethers";
import { FhenixClient } from "fhenixjs";
export declare class FhenixHardhatRuntimeEnvironment {
    readonly dockerName: string;
    readonly rpcPort: number;
    readonly wsPort: number;
    readonly faucetPort: number;
    readonly ethers: JsonRpcProvider;
    readonly fhenixjs: Promise<FhenixClient>;
    constructor();
    getFunds(addres: string): Promise<void>;
    destroy(): Promise<void>;
    sayHello(): string;
}
//# sourceMappingURL=FhenixHardhatRuntimeEnvironment.d.ts.map