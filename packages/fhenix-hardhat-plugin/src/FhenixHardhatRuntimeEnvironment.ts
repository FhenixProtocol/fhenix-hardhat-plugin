import axios from "axios";
import { FhenixClient, SupportedProvider, getPermit } from "fhenixjs";
import { EthereumProvider, HardhatRuntimeEnvironment } from "hardhat/types";

interface FhenixHardhatRuntimeEnvironmentConfig {
  rpcPort: number;
  wsPort: number;
  faucetPort: number;
}

export class FhenixHardhatRuntimeEnvironment extends FhenixClient {
  // TODO remove config
  // move the faucet to a task on the example repo
  // there's no good way to discover the faucet port from here

  public constructor(
    public hre: HardhatRuntimeEnvironment,
    public config: FhenixHardhatRuntimeEnvironmentConfig,
  ) {
    super({
      ignoreErrors: true,
      provider: hre.network.provider,
    });

    if (hre?.network !== undefined && hre.network.provider) {
      super({
        ignoreErrors: true,
        provider: hre.network.provider,
      });
    } else {
      // mock
      // if we don't have a provider we can't initialize the client
      // not sure if this ever happens except for tests
      super({
        ignoreErrors: true,
        provider: new MockProvider(),
      });
    }
  }

  public async getFunds(address: string) {
    const response = await axios.get(
      `http://localhost:${this.config.faucetPort}/faucet?address=${address}`,
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

  public async createPermit(
    contractAddress: string,
    provider?: SupportedProvider,
  ) {
    if (!provider && this.provider === undefined) {
      throw new Error("no provider provided");
    }

    const permit = await getPermit(contractAddress, provider || this.provider!);
    this.storePermit(permit);
    return permit;
  }

  public sayHello() {
    return "hello";
  }
}

export class MockProvider {
  public async send(
    method: string,
    params: any[] | Record<string, any>,
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      reject("provider not initialized");
    });
  }

  public async getSigner(): Promise<any> {
    return new Promise((resolve, reject) => {
      reject("provider not initialized");
    });
  }
}
