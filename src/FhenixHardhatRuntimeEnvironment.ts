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
  public readonly fhenixjs: Promise<FhenixClient>;

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

    this.fhenixjs = FhenixClient.Create({
      provider: new WebSocketProvider(`http://localhost:${this.config.wsPort}`),
    });
  }

  public async getFunds(addres: string) {
    const response = await fetch(
      `http://localhost:${this.config.faucetPort}/faucet?address=${addres}`,
    );

    if (response.status !== 200) {
      throw new Error(
        `Failed to get funds from faucet: ${response.status}: ${response.statusText}`,
      );
    }

    if (
      !(await response.json())?.message?.includes(
        "ETH successfully sent to address",
      ) === null
    ) {
      throw new Error(
        `Failed to get funds from faucet: ${await response.text()}`,
      );
    }
  }

  public sayHello() {
    return "hello";
  }
}
