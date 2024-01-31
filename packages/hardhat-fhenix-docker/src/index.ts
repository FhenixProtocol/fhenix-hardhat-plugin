import chalk from "chalk";
import { task, types } from "hardhat/config";

import {
  FHENIX_DEFAULT_IMAGE,
  LOCALFHENIX_CONTAINER_NAME,
  TASK_FHENIX_DOCKER_STOP,
  TASK_FHENIX_DOCKER_START,
} from "./const";
import {
  isContainerRunning,
  runLocalFhenixSeparateProcess,
  stopLocalFhenix,
} from "./docker";

task(TASK_FHENIX_DOCKER_STOP, "Stops a LocalFhenix node").setAction(
  async () => {
    stopLocalFhenix();
    console.info(chalk.green("Successfully shut down LocalFhenix"));
  },
);

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
  .addOptionalParam(
    "image",
    `Fhenix image to use - default: ${FHENIX_DEFAULT_IMAGE}`,
    FHENIX_DEFAULT_IMAGE,
    types.string,
  )
  // .addOptionalParam('log', 'Log filter level (error, warn, info, debug) - default: info', undefined, types.string)
  .setAction(
    async (
      {
        rpc,
        ws,
        faucet,
        image,
      }: // log,
      {
        rpc: number;
        ws: number;
        faucet: number;
        image: string;
        // log: string;
      },
      { run },
    ) => {
      if (isContainerRunning(LOCALFHENIX_CONTAINER_NAME)) {
        console.log(chalk.yellow(`LocalFhenix container is already running`));
        return;
      }

      await runLocalFhenixSeparateProcess(rpc, ws, faucet, image);
      console.info(
        chalk.green(`Started LocalFhenix successfully at 127.0.0.1:${rpc}`),
      );
    },
  );
