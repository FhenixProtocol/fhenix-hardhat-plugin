"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FhenixHardhatRuntimeEnvironment = void 0;
const axios_1 = __importDefault(require("axios"));
const ethers_1 = require("ethers");
const fhenixjs_1 = require("fhenixjs");
class FhenixHardhatRuntimeEnvironment {
    constructor(config = {
        rpcPort: 8545,
        wsPort: 8548,
        faucetPort: 3000,
    }) {
        this.config = config;
        this.config.rpcPort = this.config.rpcPort ?? 8545;
        this.config.wsPort = this.config.wsPort ?? 8545;
        this.config.faucetPort = this.config.faucetPort ?? 8545;
        this.fhenixjs = new fhenixjs_1.FhenixClient({
            provider: new ethers_1.WebSocketProvider(`ws://localhost:${this.config.wsPort}`),
        });
    }
    async getFunds(addres) {
        const response = await axios_1.default.get(`http://localhost:${this.config.faucetPort}/faucet?address=${addres}`);
        if (response.status !== 200) {
            throw new Error(`Failed to get funds from faucet: ${response.status}: ${response.statusText}`);
        }
        if (!(response.data?.message?.includes("ETH successfully sent to address") ===
            null)) {
            throw new Error(`Failed to get funds from faucet: ${await response.data}`);
        }
    }
    sayHello() {
        return "hello";
    }
}
exports.FhenixHardhatRuntimeEnvironment = FhenixHardhatRuntimeEnvironment;
//# sourceMappingURL=FhenixHardhatRuntimeEnvironment.js.map