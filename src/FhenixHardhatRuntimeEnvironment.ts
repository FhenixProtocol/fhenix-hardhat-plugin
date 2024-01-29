import axios from "axios";
import child_process from "child_process";
import { JsonRpcProvider } from "ethers";
import { FhenixClient } from "fhenixjs";

import { config as packageConfig } from "../package.json";

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

/// NOTE: startLocalFhenix() must be called once before starting to create FhenixHardhatRuntimeEnvironment instances
export class FhenixHardhatRuntimeEnvironment {
  /// fhenixjs is a FhenixClient connected to the localfhenix docker container
  /// it has an easy to use API for encrypting inputs and decrypting outputs
  public readonly fhenixjs: FhenixClient;

  public constructor(
    private config: FhenixHardhatRuntimeEnvironmentConfig = {
      rpcPort: 8545,
      wsPort: 8548,
      faucetPort: 3000,
    },
  ) {
    this.config.rpcPort = this.config.rpcPort ?? 8545;
    this.config.wsPort = this.config.wsPort ?? 8548;
    this.config.faucetPort = this.config.faucetPort ?? 3000;

    this.fhenixjs = new FhenixClient({
      provider: new JsonRpcProvider(`http://localhost:${this.config.rpcPort}`),
    });
  }

  /// startLocalFhenix() must be called once before starting to create FhenixHardhatRuntimeEnvironment instances
  public static async startLocalFhenix(
    config: FhenixHardhatRuntimeEnvironmentConfig = {
      rpcPort: 8545,
      wsPort: 8548,
      faucetPort: 3000,
    },
  ) {
    config.rpcPort = config.rpcPort ?? 8545;
    config.wsPort = config.wsPort ?? 8548;
    config.faucetPort = config.faucetPort ?? 3000;

    if (FhenixHardhatRuntimeEnvironment.isLocalFhenixRunning(config)) {
      return;
    } else {
      try {
        child_process.execSync(`docker rm -f localfhenix`);
      } catch (error) {
        if (!(error as Error)?.message?.includes("No such container")) {
          throw error;
        }
      }

      try {
        child_process.execSync(
          `docker run -d --rm -p "${config.rpcPort}":8547 -p "${config.wsPort}":8548 -p "${config.faucetPort}":3000 --name localfhenix "${packageConfig.image}"`,
        );
      } catch (error) {
        throw error;
      }
    }
  }

  public static isLocalFhenixRunning(
    config: FhenixHardhatRuntimeEnvironmentConfig = {
      rpcPort: 8545,
      wsPort: 8548,
      faucetPort: 3000,
    },
  ): boolean {
    config.rpcPort = config.rpcPort ?? 8545;
    config.wsPort = config.wsPort ?? 8548;
    config.faucetPort = config.faucetPort ?? 3000;

    let stdout: string;

    try {
      stdout = child_process
        .execSync(
          `docker ps -a --format '{"name": "{{ .Names }}", "ports": "{{ .Ports }}", "image": "{{ .Image }}"}'`,
        )
        .toString();
    } catch (error) {
      throw error;
    }

    const [existingLocalfhenix]: Container[] = stdout
      .split("\n")
      .map((line) => {
        try {
          return JSON.parse(line);
        } catch (error) {
          return {}; // avoid null pointer exception on container.name
        }
      })
      .filter((container: Container) => container.name === "localfhenix");

    if (!existingLocalfhenix) {
      return false;
    }

    if (existingLocalfhenix.image !== packageConfig.image) {
      return false;
    }

    const portMappings = Array.from(
      existingLocalfhenix.ports.matchAll(/0\.0\.0\.0:\d+->\d+\/tcp/g),
    ).map((match) => match[0]);

    if (portMappings.length !== 3) {
      return false;
    }

    if (!portMappings.includes(`0.0.0.0:${config.faucetPort}->3000/tcp`)) {
      return false;
    }

    if (!portMappings.includes(`0.0.0.0:${config.rpcPort}->8547/tcp`)) {
      return false;
    }

    if (!portMappings.includes(`0.0.0.0:${config.wsPort}->8548/tcp`)) {
      return false;
    }

    return true;
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
