"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FhenixHardhatRuntimeEnvironment = void 0;
const child_process_1 = __importDefault(require("child_process"));
const ethers_1 = require("ethers");
const fs_1 = __importDefault(require("fs"));
const util_1 = __importDefault(require("util"));
const IMAGE = JSON.parse(fs_1.default.readFileSync(__dirname + "/../package.json", {
    encoding: "utf-8",
})).config.image;
const exec = util_1.default.promisify(child_process_1.default.exec);
const containers = [];
class FhenixHardhatRuntimeEnvironment {
    constructor() {
        this.name = `localfhenix-${Date.now()}`;
        // TODO check if ports are available
        this.rpcPort = randomBetween(1025, 65536);
        this.wsPort = randomBetween(1025, 65536);
        this.faucetPort = randomBetween(1025, 65536);
        child_process_1.default.execSync(`docker run -d --rm -p "${this.rpcPort}":8547 -p "${this.wsPort}":8548 -p "${this.faucetPort}":3000 --name "${this.name}" "${IMAGE}"`);
        // Add the container to the list of containers to be removed when the process exits
        containers.push(this.name);
        this.ethers = new ethers_1.ethers.providers.WebSocketProvider(`http://localhost:${this.wsPort}`);
    }
    async getFunds(addres) {
        const response = await fetch(`http://localhost:${this.faucetPort}/faucet?address=${addres}`);
        if (response.status !== 200) {
            throw new Error(`Failed to get funds from faucet: ${response.status}: ${response.statusText}`);
        }
        if (!(await response.json())?.message?.includes("ETH successfully sent to address") === null) {
            throw new Error(`Failed to get funds from faucet: ${await response.text()}`);
        }
    }
    async destroy() {
        await exec(`docker rm -f "${this.name}"`);
    }
    sayHello() {
        return "hello";
    }
}
exports.FhenixHardhatRuntimeEnvironment = FhenixHardhatRuntimeEnvironment;
function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
// exitHandler makes sure that all containers are removed when the process exits
// exitHandler blocks, so that the process won't exit before the containers are removed
// note: `docker rm -f` gracefully skips non-existing containers
function exitHandler() {
    child_process_1.default.execSync(`docker rm -f ${containers.map((name) => `"${name}"`).join(" ")}`);
}
process.on("exit", exitHandler);
process.on("SIGINT", exitHandler);
process.on("SIGUSR1", exitHandler);
process.on("SIGUSR2", exitHandler);
process.on("uncaughtException", exitHandler);
process.on("SIGTERM", exitHandler);
//# sourceMappingURL=FhenixHardhatRuntimeEnvironment.js.map