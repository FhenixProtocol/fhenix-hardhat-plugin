import child_process from "child_process";
import fs from "fs";
import util from "util";
import { ethers } from "ethers";

const IMAGE = JSON.parse(
  fs.readFileSync(__dirname + "/../package.json", {
    encoding: "utf-8",
  }),
).config.image;

const exec = util.promisify(child_process.exec);

const containers: string[] = [];

export class FhenixHardhatRuntimeEnvironment {
  public readonly name: string;
  public readonly rpcPort: number;
  public readonly wsPort: number;
  public readonly faucetPort: number;
  public readonly ethers: ethers.providers.JsonRpcProvider;

  public constructor() {
    this.name = `localfhenix-${Date.now()}`;

    // TODO check if ports are available
    this.rpcPort = randomBetween(1025, 65536);
    this.wsPort = randomBetween(1025, 65536);
    this.faucetPort = randomBetween(1025, 65536);

    child_process.execSync(
      `docker run -d --rm -p "${this.rpcPort}":8547 -p "${this.wsPort}":8548 -p "${this.faucetPort}":3000 --name "${this.name}" "${IMAGE}"`,
    );

    // Add the container to the list of containers to be removed when the process exits
    containers.push(this.name);

    this.ethers = new ethers.providers.JsonRpcProvider(
      `http://localhost:${this.rpcPort}`,
    );
  }

  public async destroy() {
    await exec(`docker rm -f "${this.name}"`);
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
