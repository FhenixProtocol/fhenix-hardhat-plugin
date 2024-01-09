const child_process = require("child_process");

const IMAGE = "ghcr.io/fhenixprotocol/fhenix-node-dev:v0.0.9-standalone";

const containers: string[] = [];

export class FhenixHardhatRuntimeEnvironment {
  public readonly name: string;
  public readonly rpcPort: number;
  public readonly wsPort: number;
  public readonly faucetPort: number;

  public constructor() {
    this.name = `localfhenix-${Date.now()}`;

    // TODO check if ports are available
    this.rpcPort = randomBetween(1025, 65536);
    this.wsPort = randomBetween(1025, 65536);
    this.faucetPort = randomBetween(1025, 65536);

    child_process.execSync(
      `docker run -d --rm -p ${this.rpcPort}:8547 -p ${this.wsPort}:8548 -p ${this.faucetPort}:3000 --name "${this.name}" "${IMAGE}"`,
    );

    containers.push(this.name);
  }

  public sayHello() {
    return "hello";
  }
}

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

function exitHandler() {
  child_process.execSync(`docker rm -f ${containers.join(" ")}`);
}

process.on("exit", exitHandler);
process.on("SIGINT", exitHandler);
process.on("SIGUSR1", exitHandler);
process.on("SIGUSR2", exitHandler);
process.on("uncaughtException", exitHandler);
process.on("SIGTERM", exitHandler);
