import { JsonRpcProvider } from "ethers";
import { FhenixClient } from "fhenixjs";
export declare class FhenixHardhatRuntimeEnvironment {
    rpcPort: number;
    wsPort: number;
    faucetPort: number;
    readonly ethers: JsonRpcProvider;
    readonly fhenixjs: Promise<FhenixClient>;
    constructor(rpcPort?: number, wsPort?: number, faucetPort?: number);
    getFunds(addres: string): Promise<void>;
    sayHello(): string;
}
//# sourceMappingURL=FhenixHardhatRuntimeEnvironment.d.ts.map