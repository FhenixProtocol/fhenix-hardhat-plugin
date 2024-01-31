import { execSync, spawn } from "child_process";

import { LOCALFHENIX_CONTAINER_NAME } from "./const";

interface Container {
  name: string;
  ports: string;
  image: string;
}

export const isContainerRunning = (name: string) => {
  let stdout = "";
  try {
    stdout = execSync(
      `docker ps -a --format '{"name": "{{ .Names }}", "ports": "{{ .Ports }}", "image": "{{ .Image }}"}'`,
    ).toString();
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
};

export const runLocalFhenixSeparateProcess = async (
  rpc: number,
  ws: number,
  faucet: number,
  image: string,
) => {
  const commandToRun = `docker run --rm -p ${rpc}:8547 -p ${ws}:8548 -p ${faucet}:3000 --name ${LOCALFHENIX_CONTAINER_NAME} ${image}`;

  spawn("/usr/bin/env", commandToRun.split(" "), { stdio: "ignore" });
};

export const stopLocalFhenix = () => {
  try {
    execSync(`docker rm -f "${LOCALFHENIX_CONTAINER_NAME}"`);
  } catch (error) {
    if (!(error as Error)?.message?.includes("No such container")) {
      console.error(`error: ${error}`);
    }
  }
};
