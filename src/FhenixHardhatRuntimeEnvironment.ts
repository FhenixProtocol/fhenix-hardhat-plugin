// import util from "util";
var Docker = require("dockerode");
// export const exec = util.promisify(require("child_process").exec);

const IMAGE = "ghcr.io/fhenixprotocol/fhenix-node-dev:v0.0.7-standalone";

const containers: Promise<any>[] = [];

export class FhenixHardhatRuntimeEnvironment {
  private container: Promise<any>;
  private docker;

  public constructor() {
    console.log("Starting LocalFhenix...");

    this.docker = new Docker({ socketPath: "/var/run/docker.sock" });

    // this.docker.pull(IMAGE, (err: any, stream: any) => {
    // if (err) {
    //   throw err;
    // }

    // const onFinished = async (err: any, output: any) => {
    //   if (err != null) {
    //     throw err;
    //   }

    this.container = this.docker
      .createContainer({
        Image: IMAGE,
        name: `localfhenix-${Date.now()}`,
        // AttachStdin: false,
        // AttachStdout: true,
        // AttachStderr: true,
        // Tty: true,
        ExposedPorts: { "8547/tcp": {}, "8548/tcp": {}, "3000/tcp": {} },
        HostConfig: {
          // PortBindings: {
          //   "8547/tcp": [{ HostPort: "8545" }],
          //   "8548/tcp": [{ HostPort: "8548" }],
          //   "3000/tcp": [{ HostPort: "3000" }],
          // },
        },
      })
      .then((container: any) => {
        return container.start().then(() => {
          return container;
        });
      });

    containers.push(this.container);

    //   };
    //   const onProgress = (event: any) => {
    //     console.log("here2");
    //   };

    //   this.docker.modem.followProgress(stream, onFinished, onProgress);
    // });
  }

  public sayHello() {
    return "hello";
  }
}

//import child_process module
const child_process = require("child_process");
// Sleep for 5 seconds

function exitHandler() {
  console.log("exitHandler()...");
  console.log(containers);
  for (const containerPromise of containers) {
    let wait = true;
    containerPromise
      .then((container: any) => {
        console.log(`Stopping ${JSON.stringify(container)}...`);
        return container.remove({ force: true });
      })
      .then(() => {
        wait = false;
      });

    while (wait) {
      console.log("containerPromise", containerPromise);
      child_process.execSync("sleep 0.5");
    }
  }
}

process.on("exit", exitHandler);
process.on("SIGINT", exitHandler);
process.on("SIGUSR1", exitHandler);
process.on("SIGUSR2", exitHandler);
process.on("uncaughtException", exitHandler);
process.on("SIGTERM", exitHandler);
