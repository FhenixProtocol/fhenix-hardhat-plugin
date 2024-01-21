"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FhenixHardhatRuntimeEnvironment = void 0;
const child_process_1 = __importDefault(require("child_process"));
const ethers_1 = require("ethers");
const fhenixjs_1 = require("fhenixjs");
const util_1 = __importDefault(require("util"));
const exec = util_1.default.promisify(child_process_1.default.exec);
const containers = [];
class FhenixHardhatRuntimeEnvironment {
    constructor(rpcPort = 8545, wsPort = 8548, faucetPort = 3000) {
        this.rpcPort = rpcPort;
        this.wsPort = wsPort;
        this.faucetPort = faucetPort;
        this.ethers = new ethers_1.JsonRpcProvider(`http://localhost:${this.rpcPort}`);
        this.fhenixjs = fhenixjs_1.FhenixClient.Create({ provider: this.ethers });
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
    sayHello() {
        return "hello";
    }
}
exports.FhenixHardhatRuntimeEnvironment = FhenixHardhatRuntimeEnvironment;
//# sourceMappingURL=FhenixHardhatRuntimeEnvironment.js.map