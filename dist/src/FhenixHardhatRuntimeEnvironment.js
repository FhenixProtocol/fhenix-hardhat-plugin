"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FhenixHardhatRuntimeEnvironment = void 0;
const axios_1 = __importDefault(require("axios"));
const child_process_1 = __importDefault(require("child_process"));
const ethers_1 = require("ethers");
const fhenixjs_1 = require("fhenixjs");
const package_json_1 = require("../package.json");
class FhenixHardhatRuntimeEnvironment {
    constructor(config = {
        rpcPort: 8545,
        wsPort: 8548,
        faucetPort: 3000,
    }) {
        this.config = config;
        this.config.rpcPort = this.config.rpcPort ?? 8545;
        this.config.wsPort = this.config.wsPort ?? 8548;
        this.config.faucetPort = this.config.faucetPort ?? 3000;
        this.fhenixjs = new fhenixjs_1.FhenixClient({
            provider: new ethers_1.JsonRpcProvider(`http://localhost:${this.config.rpcPort}`),
        });
        this.ready = new Promise((resolve, reject) => {
            let stdout;
            try {
                stdout = child_process_1.default
                    .execSync(`docker ps -a --format '{"name": "{{ .Names }}", "ports": "{{ .Ports }}", "image": "{{ .Image }}"}'`)
                    .toString();
            }
            catch (error) {
                return reject(error);
            }
            const [existingLocalfhenix] = stdout
                .split("\n")
                .map((line) => JSON.parse(line))
                .filter((container) => container.name === "localfhenix");
            const run = () => {
                try {
                    child_process_1.default.execSync(`docker rm -f localfhenix`);
                    child_process_1.default.execSync(`docker run -d --rm -p "${this.config.rpcPort}":8547 -p "${this.config.wsPort}":8548 -p "${this.config.faucetPort}":3000 --name localfhenix "${package_json_1.config.image}"`);
                }
                catch (error) {
                    return reject(error);
                }
            };
            if (!existingLocalfhenix) {
                run();
                return resolve();
            }
            if (existingLocalfhenix.image !== package_json_1.config.image) {
                run();
                return resolve();
            }
            const portMappings = Array.from(existingLocalfhenix.ports.matchAll(/0\.0\.0\.0:\d+->\d+\/tcp/g)).map((match) => match[0]);
            if (portMappings.length !== 3) {
                run();
                return resolve();
            }
            if (!portMappings.includes(`0.0.0.0:${this.config.faucetPort}->3000/tcp`)) {
                run();
                return resolve();
            }
            if (!portMappings.includes(`0.0.0.0:${this.config.rpcPort}->8547/tcp`)) {
                run();
                return resolve();
            }
            if (!portMappings.includes(`0.0.0.0:${this.config.wsPort}->8548/tcp`)) {
                run();
                return resolve();
            }
            resolve();
        });
    }
    async getFunds(addres) {
        const response = await axios_1.default.get(`http://localhost:${this.config.faucetPort}/faucet?address=${addres}`);
        if (response.status !== 200) {
            throw new Error(`Failed to get funds from faucet: ${response.status}: ${response.statusText}`);
        }
        if (!response.data?.message?.includes("ETH successfully sent to address")) {
            throw new Error(`Failed to get funds from faucet: ${JSON.stringify(response.data)}`);
        }
    }
    sayHello() {
        return "hello";
    }
}
exports.FhenixHardhatRuntimeEnvironment = FhenixHardhatRuntimeEnvironment;
//# sourceMappingURL=FhenixHardhatRuntimeEnvironment.js.map