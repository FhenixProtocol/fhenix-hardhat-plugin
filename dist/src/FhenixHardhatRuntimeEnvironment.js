"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FhenixHardhatRuntimeEnvironment = void 0;
const axios_1 = __importDefault(require("axios"));
const fhenixjs_1 = require("fhenixjs");
const ethers_1 = require("ethers");
class FhenixHardhatRuntimeEnvironment {
    constructor(hre, config = {
        rpcPort: 8545,
        wsPort: 8548,
        faucetPort: 3000,
    }) {
        this.config = config;
        this.config.rpcPort = this.config.rpcPort ?? 8545;
        this.config.wsPort = this.config.wsPort ?? 8548;
        this.config.faucetPort = this.config.faucetPort ?? 3000;
        if (hre?.network !== undefined && hre.network.provider) {
            this.provider = hre.network.provider;
            console.log(`provider: ${JSON.stringify(this.provider)}`);
            this.client = new fhenixjs_1.FhenixClient({
                ignoreErrors: false,
                provider: hre.network.provider,
            });
        }
        else {
            this.client = new fhenixjs_1.FhenixClient({
                ignoreErrors: false,
                provider: new ethers_1.ethers.JsonRpcProvider(`http://localhost:${this.config.rpcPort}`),
            });
        }
    }
    async getFunds(address) {
        const response = await axios_1.default.get(`http://localhost:${this.config.faucetPort}/faucet?address=${address}`);
        if (response.status !== 200) {
            throw new Error(`Failed to get funds from faucet: ${response.status}: ${response.statusText}`);
        }
        if (!response.data?.message?.includes("ETH successfully sent to address")) {
            throw new Error(`Failed to get funds from faucet: ${JSON.stringify(response.data)}`);
        }
    }
    async createPermit(contractAddress) {
        if (this.provider === undefined) {
            throw new Error("error getting ethers provider from hardhat runtime environment");
        }
        const permit = await (0, fhenixjs_1.getPermit)(contractAddress, this.provider);
        this.client.storePermit(permit);
        return permit;
    }
    sayHello() {
        return "hello";
    }
}
exports.FhenixHardhatRuntimeEnvironment = FhenixHardhatRuntimeEnvironment;
//# sourceMappingURL=FhenixHardhatRuntimeEnvironment.js.map