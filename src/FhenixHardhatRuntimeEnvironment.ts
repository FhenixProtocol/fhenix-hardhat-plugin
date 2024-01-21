import { WebSocketProvider } from "ethers";
import { FhenixClient } from "fhenixjs";

export class FhenixHardhatRuntimeEnvironment {
  public readonly fhenixjs: Promise<FhenixClient>;

  public constructor(
    public rpcPort: number = 8545,
    public wsPort: number = 8548,
    public faucetPort: number = 3000,
  ) {
    this.fhenixjs = FhenixClient.Create({
      provider: new WebSocketProvider(`http://localhost:${this.wsPort}`),
    });
  }

  public async getFunds(addres: string) {
    const response = await fetch(
      `http://localhost:${this.faucetPort}/faucet?address=${addres}`,
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
