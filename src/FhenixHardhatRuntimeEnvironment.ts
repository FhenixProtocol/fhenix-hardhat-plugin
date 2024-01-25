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

export class FhenixHardhatRuntimeEnvironment {
  public readonly fhenixjs: FhenixClient;
  public readonly ready: Promise<void>;

  public constructor(
    public config: FhenixHardhatRuntimeEnvironmentConfig = {
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

    this.ready = new Promise((resolve, reject) => {
      let stdout: string;

      try {
        stdout = child_process
          .execSync(
            `docker ps -a --format '{"name": "{{ .Names }}", "ports": "{{ .Ports }}", "image": "{{ .Image }}"}'`,
          )
          .toString();
      } catch (error) {
        return reject(error);
      }

      const [existingLocalfhenix]: Container[] = stdout
        .split("\n")
        .map((line) => JSON.parse(line))
        .filter((container: Container) => container.name === "localfhenix");

      const run = () => {
        try {
          child_process.execSync(`docker rm -f localfhenix`);
          child_process.execSync(
            `docker run -d --rm -p "${this.config.rpcPort}":8547 -p "${this.config.wsPort}":8548 -p "${this.config.faucetPort}":3000 --name localfhenix "${packageConfig.image}"`,
          );
        } catch (error) {
          return reject(error);
        }
      };

      if (!existingLocalfhenix) {
        run();
        return resolve();
      }

      if (existingLocalfhenix.image !== packageConfig.image) {
        run();
        return resolve();
      }

      const portMappings = Array.from(
        existingLocalfhenix.ports.matchAll(/0\.0\.0\.0:\d+->\d+\/tcp/g),
      ).map((match) => match[0]);

      if (portMappings.length !== 3) {
        run();
        return resolve();
      }

      if (
        !portMappings.includes(`0.0.0.0:${this.config.faucetPort}->3000/tcp`)
      ) {
        run();
        return resolve();
      }

      if (!portMappings.includes(`0.0.0.0:${this.config.rpcPort}->8547/tcp`)) {
        run();
        return resolve();
      }

      if (!portMappings.includes(`0.0.0.0:${this.config.wsPort}->8548/tcp`)) {
        run();
        return resolve();
      }

      resolve();
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
