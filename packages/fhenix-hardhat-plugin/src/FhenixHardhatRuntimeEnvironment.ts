import axios from "axios";
import {
  FhenixClient,
  getPermit,
  InstanceParams,
  SupportedProvider,
} from "fhenixjs";
import { HardhatRuntimeEnvironment } from "hardhat/types";

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
    let superArgs: InstanceParams = {
      ignoreErrors: true,
      provider: new MockProvider(),
    };
    if (hre?.network !== undefined && hre.network.provider) {
      superArgs = {
        ignoreErrors: true,
        provider: hre.network.provider,
      };
    }

    super(superArgs);
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
