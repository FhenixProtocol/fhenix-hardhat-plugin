import axios from "axios";
import { FhenixClient, SupportedProvider, getPermit } from "fhenixjs";
import { EthereumProvider, HardhatRuntimeEnvironment } from "hardhat/types";

interface FhenixHardhatRuntimeEnvironmentConfig {
  /// rpcPort defaults to 8545
  rpcPort?: number;
  /// wsPort defaults to 8548
  wsPort?: number;
  /// faucetPort defaults to 3000
  faucetPort?: number;
}

export class FhenixHardhatRuntimeEnvironment {
  /// fhenixjs is a FhenixClient connected to the localfhenix docker container
  /// it has an easy-to-use API for encrypting inputs and decrypting outputs
  public readonly client: FhenixClient;
  public readonly provider: EthereumProvider | undefined;

  public constructor(
    hre: HardhatRuntimeEnvironment,
    public config: FhenixHardhatRuntimeEnvironmentConfig = {
      rpcPort: 8545,
      wsPort: 8548,
      faucetPort: 42000,
    },
  ) {
    this.config.rpcPort = this.config.rpcPort ?? 8545;
    this.config.wsPort = this.config.wsPort ?? 8548;
    this.config.faucetPort = this.config.faucetPort ?? 42000;

    // if we already have a provider here we can initialize the client
    if (hre?.network !== undefined && hre.network.provider) {
      this.provider = hre.network.provider;
      this.client = new FhenixClient({
        ignoreErrors: true,
        provider: hre.network.provider,
      });
    } else {
      // this is fake - if we don't have a provider we can't initialize the client - not sure if this ever happens except for tests

      this.client = new FhenixClient({
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
    this.client.storePermit(permit);
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
