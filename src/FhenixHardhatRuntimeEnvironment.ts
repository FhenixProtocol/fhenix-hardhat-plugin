import axios from "axios";
import child_process from "child_process";
import { FhenixClient, getPermit  } from "fhenixjs";
import { HardhatRuntimeEnvironment, EthereumProvider } from "hardhat/types";
import { FHENIX_IMAGE } from "./consts";
import { ethers } from "ethers";

interface FhenixHardhatRuntimeEnvironmentConfig {
  /// rpcPort defaults to 8545
  rpcPort?: number;
  /// wsPort defaults to 8548
  wsPort?: number;
  /// faucetPort defaults to 3000
  faucetPort?: number;
}

interface Container {
  name: string;
  ports: string;
  image: string;
}

export class FhenixHardhatRuntimeEnvironment {
  /// fhenixjs is a FhenixClient connected to the localfhenix docker container
  /// it has an easy to use API for encrypting inputs and decrypting outputs
  public readonly client: FhenixClient;
  /// ready is a promise that resolves when the localfhenix docker container is ready
  public readonly provider: EthereumProvider | undefined;
  
  public constructor(
    hre: HardhatRuntimeEnvironment,
    public config: FhenixHardhatRuntimeEnvironmentConfig = {
      rpcPort: 8545,
      wsPort: 8548,
      faucetPort: 3000,
    },
  ) {
    this.config.rpcPort = this.config.rpcPort ?? 8545;
    this.config.wsPort = this.config.wsPort ?? 8548;
    this.config.faucetPort = this.config.faucetPort ?? 3000;
    
    if (hre?.network !== undefined && hre.network.provider) {

      this.provider = hre.network.provider;
      console.log(`provider: ${JSON.stringify(this.provider)}`);

      this.client = new FhenixClient({
        ignoreErrors: false,
        provider: hre.network.provider,
      });
    } else {
      this.client = new FhenixClient({
        ignoreErrors: false,
        provider: new ethers.JsonRpcProvider(`http://localhost:${this.config.rpcPort}`),
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

  public async createPermit(contractAddress: string) {
    if (this.provider === undefined) {
      throw new Error("error getting ethers provider from hardhat runtime environment");
    }
    
    const permit = await getPermit(contractAddress, this.provider!);
    this.client.storePermit(permit);
    return permit;
  }
  
  public sayHello() {
    return "hello";
  }
}
