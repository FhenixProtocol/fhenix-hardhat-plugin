import child_process from "child_process";
import { JsonRpcProvider } from "ethers";
import { FhenixClient } from "fhenixjs";
import util from "util";

import { config } from "../package.json";

const exec = util.promisify(child_process.exec);

const containers: string[] = [];

export class FhenixHardhatRuntimeEnvironment {
  public readonly dockerName: string;

  public readonly rpcPort: number;
  public readonly wsPort: number;
  public readonly faucetPort: number;

  public readonly ethers: JsonRpcProvider;
  public readonly fhenixjs: Promise<FhenixClient>;

  public constructor() {
    this.dockerName = `localfhenix-${Date.now()}`;

    // TODO check if ports are available
    this.rpcPort = randomBetween(1025, 65536);
    this.wsPort = randomBetween(1025, 65536);
    this.faucetPort = randomBetween(1025, 65536);

    child_process.execSync(
      `docker run -d --rm -p "${this.rpcPort}":8547 -p "${this.wsPort}":8548 -p "${this.faucetPort}":3000 --name "${this.dockerName}" "${config.image}"`,
    );

    // Add the container to the list of containers to be removed when the process exits
    containers.push(this.dockerName);

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

  public async destroy() {
    await exec(`docker rm -f "${this.dockerName}"`);
  }

  public sayHello() {
    return "hello";
  }
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}

// exitHandler makes sure that all containers are removed when the process exits
// exitHandler blocks, so that the process won't exit before the containers are removed
// note: `docker rm -f` gracefully skips non-existing containers
function exitHandler() {
  if (containers.length === 0) {
    return;
  }

  child_process.execSync(
    `docker rm -f ${containers.map((name) => `"${name}"`).join(" ")}`,
  );
}

process.on("exit", exitHandler);
process.on("SIGINT", exitHandler);
process.on("SIGUSR1", exitHandler);
process.on("SIGUSR2", exitHandler);
process.on("uncaughtException", exitHandler);
process.on("SIGTERM", exitHandler);
