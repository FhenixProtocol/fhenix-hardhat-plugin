import chalk from "chalk";
import { execSync, spawnSync } from "child_process";

import { LOCALFHENIX_CONTAINER_NAME } from "./const";

interface Container {
  name: string;
  ports: string;
  image: string;
}

export const isDockerInstalled = (): boolean => {
  let stdout = "";
  try {
    stdout = execSync(`docker -v`).toString();
    return !!stdout;
  } catch (error) {
    return false;
  }
};

export const doesImageExist = (image: string): boolean => {
  if (image.split(":").length !== 2) {
    return false;
  }

  const [containerName, containerTag] = image.split(":");

  let stdout = "";
  try {
    stdout = execSync(`docker images`).toString();
    return !!stdout
      .split("\n")
      .find(
        (line) => line.includes(containerName) && line.includes(containerTag),
      );
  } catch (error) {
    return false;
  }
};

export const pullDockerContainer = (image: string) => {
  if (doesImageExist(image)) {
    return;
  }

  console.info(chalk.green(`Downloading docker image ${image}...`));

  try {
    const commandToRun = `docker pull ${image}`;
    execSync(commandToRun);
    console.info(chalk.green("done!"));
    // spawn("/usr/bin/env", commandToRun.split(" "));
  } catch (error) {
    return false;
  }
};

export const isContainerRunning = (name: string): boolean => {
  let stdout = "";
  try {
    // Using spawnSync because Windows doesn't like it when we use parentheses with execSync
    stdout = spawnSync("docker", [
      "ps",
      "-a",
      "--format",
      '{"name": "{{ .Names }}", "ports": "{{ .Ports }}", "image": "{{ .Image }}"}',
    ]).stdout?.toString();
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
  execSync(
    `docker run -d --rm -p "${rpc}":8547 -p "${ws}":8548 -p "${faucet}":3000 --name "${LOCALFHENIX_CONTAINER_NAME}" "${image}"`,
  );
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
