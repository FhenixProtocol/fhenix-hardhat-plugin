"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FhenixHardhatRuntimeEnvironment = void 0;
const ethers_1 = require("ethers");
const fhenixjs_1 = require("fhenixjs");
class FhenixHardhatRuntimeEnvironment {
    constructor(rpcPort = 8545, wsPort = 8548, faucetPort = 3000) {
        this.rpcPort = rpcPort;
        this.wsPort = wsPort;
        this.faucetPort = faucetPort;
        this.fhenixjs = fhenixjs_1.FhenixClient.Create({
            provider: new ethers_1.WebSocketProvider(`http://localhost:${this.wsPort}`),
        });
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