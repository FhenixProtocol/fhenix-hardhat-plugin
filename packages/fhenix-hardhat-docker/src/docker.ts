import { spawn, execSync } from "child_process";
import { FHENIX_IMAGE } from "./const";
// import chalk from 'chalk';

interface Container {
  name: string;
  ports: string;
  image: string;
}

export const isRunningContainer = (name: string) => {
  let stdout = "";
  try {
    stdout = execSync(
        `docker ps -a --format '{"name": "{{ .Names }}", "ports": "{{ .Ports }}", "image": "{{ .Image }}"}'`,
      )
      .toString();
  } catch (error) {
    return false;
  }
  
  try {
    const [existingLocalfhenix]: Container[] = stdout
      .split("\n")
      .map((line) => {
        try {
          return JSON.parse(line);
        } catch (error) {
          return {}; // avoid null pointer exception on container.name
        }
      })
      .filter((container: Container) => container.name === name);
    return !!existingLocalfhenix;
  } catch (e) {
    return false;
  }
}

export const runLocalFhenixSeparateProcess = async (port: number, ws: number, faucet: number) => {
  const commandToRun = `docker run --rm -p ${port}:8547 -p ${ws}:8548 -p ${faucet}:3000 --name localfhenix ${FHENIX_IMAGE}`;

  // console.info(chalk.green(`Starting the JSON-RPC server at 127.0.0.1:${port}`));
  console.info(`Starting the JSON-RPC server at 127.0.0.1:${port} / ${ws}, ${faucet}`);

  // const stdioConfig = ['ignore', 'ignore', 'ignore'];
  console.log(`command: ${commandToRun.split(' ')}`);
  spawn("/usr/bin/env", commandToRun.split(' '), { stdio: [ 'inherit', 'pipe', 'inherit'] });
  //execSync(`${commandToRun} ${args}`);
}

export const stopLocalFhenix = () => {
  try {
    execSync(`docker rm -f localfhenix`);
  } catch (error) {
    if (!(error as Error)?.message?.includes("No such container")) {
      console.error(`error: ${error}`);
    }
  }
}
