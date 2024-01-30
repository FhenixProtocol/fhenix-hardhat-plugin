"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const config_1 = require("hardhat/config");
const const_1 = require("./const");
const docker_1 = require("./docker");
(0, config_1.task)(const_1.TASK_FHENIX_DOCKER_STOP, "Stops a localfhenix node").setAction(async () => {
    (0, docker_1.stopLocalFhenix)();
    console.info(chalk_1.default.green(`Successfully shut down LocalFhenix`));
});
// Main task of the plugin. It starts the server and listens for requests.
(0, config_1.task)(const_1.TASK_FHENIX_NODE, "Starts a localfhenix node")
    .addOptionalParam("port", "Port to listen on - default: 42069", 42069, config_1.types.int)
    .addOptionalParam("ws", "Websocket Port to listen on - default: 42070", 42070, config_1.types.int)
    .addOptionalParam("faucet", "Faucet Port to listen on - default: 42000", 42000, config_1.types.int)
    .addOptionalParam("image", "Fhenix image to use - default: ghcr.io/fhenixprotocol/localfhenix:v0.1.0-beta2", const_1.FHENIX_DEFAULT_IMAGE, config_1.types.string)
    // .addOptionalParam('log', 'Log filter level (error, warn, info, debug) - default: info', undefined, types.string)
    .setAction(async ({ port, ws, faucet, image, }, { run }) => {
    if ((0, docker_1.isRunningContainer)(const_1.LOCALFHENIX_CONTAINER_NAME)) {
        console.log(chalk_1.default.yellow(`localfhenix container is already running`));
        return;
    }
    await (0, docker_1.runLocalFhenixSeparateProcess)(port, ws, faucet, image);
    console.info(chalk_1.default.green(`Started LocalFhenix successfully at 127.0.0.1:${port}`));
});
//# sourceMappingURL=index.js.map