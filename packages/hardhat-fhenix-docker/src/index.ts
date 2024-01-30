import chalk from "chalk";
import { task, types } from "hardhat/config";

import {
  FHENIX_DEFAULT_IMAGE,
  LOCALFHENIX_CONTAINER_NAME,
  TASK_FHENIX_DOCKER_STOP,
  TASK_FHENIX_NODE,
} from "./const";
import {
  isRunningContainer,
  runLocalFhenixSeparateProcess,
  stopLocalFhenix,
} from "./docker";

task(TASK_FHENIX_DOCKER_STOP, "Stops a localfhenix node").setAction(
  async () => {
    stopLocalFhenix();
    console.info(chalk.green(`Successfully shut down LocalFhenix`));
  },
);

// Main task of the plugin. It starts the server and listens for requests.
task(TASK_FHENIX_NODE, "Starts a localfhenix node")
  .addOptionalParam(
    "port",
    "Port to listen on - default: 42069",
    42069,
    types.int,
  )
  .addOptionalParam(
    "ws",
    "Websocket Port to listen on - default: 42070",
    42070,
    types.int,
  )
  .addOptionalParam(
    "faucet",
    "Faucet Port to listen on - default: 42000",
    42000,
    types.int,
  )
  .addOptionalParam(
    "image",
    "Fhenix image to use - default: ghcr.io/fhenixprotocol/localfhenix:v0.1.0-beta2",
    FHENIX_DEFAULT_IMAGE,
    types.string,
  )
  // .addOptionalParam('log', 'Log filter level (error, warn, info, debug) - default: info', undefined, types.string)
  .setAction(
    async (
      {
        port,
        ws,
        faucet,
        image,
      }: // log,
      {
        port: number;
        ws: number;
        faucet: number;
        image: string;
        // log: string;
      },
      { run },
    ) => {
      if (isRunningContainer(LOCALFHENIX_CONTAINER_NAME)) {
        console.log(chalk.yellow(`localfhenix container is already running`));
        return;
      }

      await runLocalFhenixSeparateProcess(port, ws, faucet, image);
      console.info(
        chalk.green(`Started LocalFhenix successfully at 127.0.0.1:${port}`),
      );
    },
  );
