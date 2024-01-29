import { task, types, subtask } from 'hardhat/config';
// import { TASK_NODE_CREATE_SERVER } from 'hardhat/builtin-tasks/task-names';
import {
  TASK_FHENIX_NODE, TASK_FHENIX_DOCKER_STOP,
} from "./const";
import { isRunningContainer, runLocalFhenixSeparateProcess, stopLocalFhenix } from "./docker";

task(TASK_FHENIX_DOCKER_STOP, 'Stops a localfhenix node').setAction(async () => {
  stopLocalFhenix();
});

// Main task of the plugin. It starts the server and listens for requests.
task(TASK_FHENIX_NODE, 'Starts a localfhenix node')
  .addOptionalParam('port', 'Port to listen on - default: 8545', 8545, types.int)
  .addOptionalParam('ws', 'Websocket Port to listen on - default: 8548', 8548, types.int)
  .addOptionalParam('faucet', 'Faucet Port to listen on - default: 3000', 3000, types.int)
  // .addOptionalParam('log', 'Log filter level (error, warn, info, debug) - default: info', undefined, types.string)
  .setAction(
    async (
      {
        port,
        ws,
        faucet,
        // log,
      }: {
        port: number;
        ws: number;
        faucet: number;
        // log: string;
      },
      { run },
    ) => {
      // const commandArgs = constructCommandArgs({
      //   port,
      //   log,
      //   logFilePath,
      //   cache,
      //   cacheDir,
      //   resetCache,
      //   showCalls,
      //   showStorageLogs,
      //   showVmDetails,
      //   showGasDetails,
      //   resolveHashes,
      //   devUseLocalContracts,
      //   fork,
      //   forkBlockNumber,
      //   replayTx,
      // });
      
      
      if (isRunningContainer('localfhenix')) {
        console.log(`localfhenix container is already running`);
        return;
      }
      
      await runLocalFhenixSeparateProcess(port, ws, faucet);
      
    },
  );
