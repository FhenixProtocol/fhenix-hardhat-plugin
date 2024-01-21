import axios from "axios";
import { WebSocketProvider } from "ethers";
import { FhenixClient } from "fhenixjs";

type FhenixHardhatRuntimeEnvironmentConfig = {
  /// rpcPort defaults to 8545
  rpcPort?: number;
  /// wsPort defaults to 8548
  wsPort?: number;
  /// faucetPort defaults to 3000
  faucetPort?: number;
};

export class FhenixHardhatRuntimeEnvironment {
  public readonly fhenixjs: FhenixClient;

  public constructor(
    public config: FhenixHardhatRuntimeEnvironmentConfig = {
      rpcPort: 8545,
      wsPort: 8548,
      faucetPort: 3000,
    },
  ) {
    this.config.rpcPort = this.config.rpcPort ?? 8545;
    this.config.wsPort = this.config.wsPort ?? 8545;
    this.config.faucetPort = this.config.faucetPort ?? 8545;

    this.fhenixjs = new FhenixClient({
      provider: new WebSocketProvider(`ws://localhost:${this.config.wsPort}`),
    });
  }

  public async getFunds(addres: string) {
    const response = await axios.get(
      `http://localhost:${this.config.faucetPort}/faucet?address=${addres}`,
    );

    if (response.status !== 200) {
      throw new Error(
        `Failed to get funds from faucet: ${response.status}: ${response.statusText}`,
      );
    }

    if (!response.data?.message?.includes("ETH successfully sent to address")) {
      throw new Error(
        `Failed to get funds from faucet: ${JSON.stringify(response.data)}`,
      );
    }
  }

  public sayHello() {
    return "hello";
  }
}
