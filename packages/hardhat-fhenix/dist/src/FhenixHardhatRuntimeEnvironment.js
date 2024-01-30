"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockProvider = exports.FhenixHardhatRuntimeEnvironment = void 0;
const axios_1 = __importDefault(require("axios"));
const fhenixjs_1 = require("fhenixjs");
class FhenixHardhatRuntimeEnvironment {
    constructor(hre, config = {
        rpcPort: 8545,
        wsPort: 8548,
        faucetPort: 42000,
    }) {
        this.config = config;
        this.config.rpcPort = this.config.rpcPort ?? 8545;
        this.config.wsPort = this.config.wsPort ?? 8548;
        this.config.faucetPort = this.config.faucetPort ?? 42000;
        // if we already have a provider here we can initialize the client
        if (hre?.network !== undefined && hre.network.provider) {
            this.provider = hre.network.provider;
            this.client = new fhenixjs_1.FhenixClient({
                ignoreErrors: true,
                provider: hre.network.provider,
            });
        }
        else {
            // this is fake - if we don't have a provider we can't initialize the client - not sure if this ever happens except for tests
            this.client = new fhenixjs_1.FhenixClient({
                ignoreErrors: true,
                provider: new MockProvider(),
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
    async createPermit(contractAddress, provider) {
        if (!provider && this.provider === undefined) {
            throw new Error("no provider provided");
        }
        const permit = await (0, fhenixjs_1.getPermit)(contractAddress, provider || this.provider);
        this.client.storePermit(permit);
        return permit;
    }
    sayHello() {
        return "hello";
    }
}
exports.FhenixHardhatRuntimeEnvironment = FhenixHardhatRuntimeEnvironment;
class MockProvider {
    async send(method, params) {
        return new Promise((resolve, reject) => {
            reject("provider not initialized");
        });
    }
    async getSigner() {
        return new Promise((resolve, reject) => {
            reject("provider not initialized");
        });
    }
}
exports.MockProvider = MockProvider;
//# sourceMappingURL=FhenixHardhatRuntimeEnvironment.js.map