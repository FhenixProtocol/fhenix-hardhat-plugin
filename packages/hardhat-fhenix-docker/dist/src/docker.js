"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stopLocalFhenix = exports.runLocalFhenixSeparateProcess = exports.isRunningContainer = void 0;
const child_process_1 = require("child_process");
const const_1 = require("./const");
const isRunningContainer = (name) => {
    let stdout = "";
    try {
        stdout = (0, child_process_1.execSync)(`docker ps -a --format '{"name": "{{ .Names }}", "ports": "{{ .Ports }}", "image": "{{ .Image }}"}'`).toString();
    }
    catch (error) {
        return false;
    }
    try {
        const [existingLocalfhenix] = stdout
            .split("\n")
            .map((line) => {
            try {
                return JSON.parse(line);
            }
            catch (error) {
                return {}; // avoid null pointer exception on container.name
            }
        })
            .filter((container) => container.name === name);
        return !!existingLocalfhenix;
    }
    catch (e) {
        return false;
    }
};
exports.isRunningContainer = isRunningContainer;
const runLocalFhenixSeparateProcess = async (port, ws, faucet, image) => {
    const commandToRun = `docker run --rm -p ${port}:8547 -p ${ws}:8548 -p ${faucet}:3000 --name ${const_1.LOCALFHENIX_CONTAINER_NAME} ${image}`;
    // [ 'inherit', 'pipe', 'inherit']
    (0, child_process_1.spawn)("/usr/bin/env", commandToRun.split(" "), { stdio: "ignore" });
};
exports.runLocalFhenixSeparateProcess = runLocalFhenixSeparateProcess;
const stopLocalFhenix = () => {
    try {
        (0, child_process_1.execSync)(`docker rm -f ${const_1.LOCALFHENIX_CONTAINER_NAME}`);
    }
    catch (error) {
        if (!error?.message?.includes("No such container")) {
            console.error(`error: ${error}`);
        }
    }
};
exports.stopLocalFhenix = stopLocalFhenix;
//# sourceMappingURL=docker.js.map