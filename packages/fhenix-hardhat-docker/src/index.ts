import chalk from "chalk";
import { subtask, task, types } from "hardhat/config";
import os from "os";

import {
  FHENIX_DEFAULT_IMAGE,
  FHENIX_DEFAULT_IMAGE_ARM,
  LOCALFHENIX_CONTAINER_NAME,
  SUBTASK_FHENIX_DOCKER_CLEAN_DEPLOYMENTS,
  SUBTASK_FHENIX_DOCKER_PULL,
  TASK_FHENIX_DOCKER_START,
  TASK_FHENIX_DOCKER_STOP,
} from "./const";
import {
  isContainerRunning,
  pullDockerContainer,
  runLocalFhenixSeparateProcess,
  stopLocalFhenix,
} from "./docker";
import { cleanDeployments } from "./env";

task(TASK_FHENIX_DOCKER_STOP, "Stops a LocalFhenix node").setAction(
  async () => {
    stopLocalFhenix();
    console.info(chalk.green("Successfully shut down LocalFhenix"));
  },
);

subtask(SUBTASK_FHENIX_DOCKER_PULL, "Pulls the latest LocalFhenix image")
  .addOptionalParam("image", "Specified docker image to pull", undefined)
  .setAction(async ({ image }: { image: string }) => {
    pullDockerContainer(image);
  });

subtask(SUBTASK_FHENIX_DOCKER_CLEAN_DEPLOYMENTS, "Cleans existing contract deployments")
  .setAction(async () => {
    cleanDeployments();
  });

// Main task of the plugin. It starts the server and listens for requests.
task(TASK_FHENIX_DOCKER_START, "Starts a LocalFhenix node")
  .addOptionalParam(
    "rpc",
    "RPC port to listen on - default: 42069",
    42069,
    types.int,
  )
  .addOptionalParam(
    "ws",
    "Websocket port to listen on - default: 42070",
    42070,
    types.int,
  )
  .addOptionalParam(
    "faucet",
    "Faucet port to listen on - default: 42000",
    42000,
    types.int,
  )
  .addOptionalParam("image", `Fhenix image to use`, undefined, types.string)
  // .addOptionalParam('log', 'Log filter level (error, warn, info, debug) - default: info', undefined, types.string)
  .addOptionalParam("clean", `Clean previous deployments`, false, types.boolean)
  .setAction(
    async (
      {
        rpc,
        ws,
        faucet,
        image,
        clean,
      }: // log,
      {
        rpc: number;
        ws: number;
        faucet: number;
        image: string;
        clean: boolean;
        // log: string;
      },
      { run },
    ) => {
      if (isContainerRunning(LOCALFHENIX_CONTAINER_NAME)) {
        console.log(chalk.yellow(`LocalFhenix container is already running`));
        return;
      }

      if (os.arch() === "arm64") {
        image = image || FHENIX_DEFAULT_IMAGE_ARM;
      } else {
        image = image || FHENIX_DEFAULT_IMAGE;
      }

      await run(SUBTASK_FHENIX_DOCKER_PULL, { image });

      await runLocalFhenixSeparateProcess(rpc, ws, faucet, image);
      console.info(
        chalk.green(`Started LocalFhenix successfully at 127.0.0.1:${rpc}`),
      );

      if (clean) {
        await run(SUBTASK_FHENIX_DOCKER_CLEAN_DEPLOYMENTS);
      }
    },
  );
