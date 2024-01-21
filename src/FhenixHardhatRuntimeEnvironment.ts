import child_process from "child_process";
import { JsonRpcProvider } from "ethers";
import { FhenixClient } from "fhenixjs";
import util from "util";

const exec = util.promisify(child_process.exec);

const containers: string[] = [];

export class FhenixHardhatRuntimeEnvironment {
  public readonly ethers: JsonRpcProvider;
  public readonly fhenixjs: Promise<FhenixClient>;

  public constructor(
    public rpcPort: number = 8545,
    public wsPort: number = 8548,
    public faucetPort: number = 3000,
  ) {
    this.ethers = new JsonRpcProvider(`http://localhost:${this.rpcPort}`);
    this.fhenixjs = FhenixClient.Create({ provider: this.ethers });
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
