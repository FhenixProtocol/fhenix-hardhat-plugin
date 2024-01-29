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
/// NOTE: startLocalFhenix() must be called once before starting to create FhenixHardhatRuntimeEnvironment instances
class FhenixHardhatRuntimeEnvironment extends fhenixjs_1.FhenixClient {
    constructor(config = {
        rpcPort: 8545,
        wsPort: 8548,
        faucetPort: 3000,
    }) {
        const provider = new ethers_1.JsonRpcProvider(`http://localhost:${config.rpcPort ?? 8545}`);
        super({ provider });
        this.config = config;
        this.provider = provider;
        this.config.rpcPort = config.rpcPort ?? 8545;
        this.config.wsPort = config.wsPort ?? 8548;
        this.config.faucetPort = config.faucetPort ?? 3000;
    }
    /// startLocalFhenix() must be called once before starting to create FhenixHardhatRuntimeEnvironment instances
    static async startLocalFhenix(config = {
        rpcPort: 8545,
        wsPort: 8548,
        faucetPort: 3000,
    }) {
        config.rpcPort = config.rpcPort ?? 8545;
        config.wsPort = config.wsPort ?? 8548;
        config.faucetPort = config.faucetPort ?? 3000;
        if (FhenixHardhatRuntimeEnvironment.isLocalFhenixRunning(config)) {
            return;
        }
        else {
            try {
                child_process_1.default.execSync(`docker rm -f localfhenix`);
            }
            catch (error) {
                if (!error?.message?.includes("No such container")) {
                    throw error;
                }
            }
            try {
                child_process_1.default.execSync(`docker run -d --rm -p "${config.rpcPort}":8547 -p "${config.wsPort}":8548 -p "${config.faucetPort}":3000 --name localfhenix "${package_json_1.config.image}"`);
            }
            catch (error) {
                throw error;
            }
        }
    }
    static isLocalFhenixRunning(config = {
        rpcPort: 8545,
        wsPort: 8548,
        faucetPort: 3000,
    }) {
        config.rpcPort = config.rpcPort ?? 8545;
        config.wsPort = config.wsPort ?? 8548;
        config.faucetPort = config.faucetPort ?? 3000;
        let stdout;
        try {
            stdout = child_process_1.default
                .execSync(`docker ps -a --format '{"name": "{{ .Names }}", "ports": "{{ .Ports }}", "image": "{{ .Image }}"}'`)
                .toString();
        }
        catch (error) {
            throw error;
        }
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
            .filter((container) => container.name === "localfhenix");
        if (!existingLocalfhenix) {
            return false;
        }
        if (existingLocalfhenix.image !== package_json_1.config.image) {
            return false;
        }
        const portMappings = Array.from(existingLocalfhenix.ports.matchAll(/0\.0\.0\.0:\d+->\d+\/tcp/g)).map((match) => match[0]);
        if (portMappings.length !== 3) {
            return false;
        }
        if (!portMappings.includes(`0.0.0.0:${config.faucetPort}->3000/tcp`)) {
            return false;
        }
        if (!portMappings.includes(`0.0.0.0:${config.rpcPort}->8547/tcp`)) {
            return false;
        }
        if (!portMappings.includes(`0.0.0.0:${config.wsPort}->8548/tcp`)) {
            return false;
        }
        return true;
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
    async generatePermit(contract) {
        const pemit = await (0, fhenixjs_1.generatePermit)(contract, this.provider);
        this.storePermit(pemit);
        return pemit;
    }
    /**
     * Encrypts a Uint8 value using the stored public key.
     * @param {number} value - The Uint8 value to encrypt.
     * @returns {EncryptedUint8} - The encrypted value serialized as EncryptedUint8. Use the .data property to access the Uint8Array.
     */
    async encrypt_uint8(value) {
        return this.encrypt(value, fhenixjs_1.EncryptionTypes.uint8);
    }
    /**
     * Encrypts a Uint16 value using the stored public key.
     * @param {number} value - The Uint16 value to encrypt.
     * @returns {EncryptedUint16} - The encrypted value serialized as EncryptedUint16. Use the .data property to access the Uint8Array.
     */
    async encrypt_uint16(value) {
        return this.encrypt(value, fhenixjs_1.EncryptionTypes.uint16);
    }
    /**
     * Encrypts a Uint32 value using the stored public key.
     * @param {number} value - The Uint32 value to encrypt.
     * @returns {EncryptedUint32} - The encrypted value serialized as EncryptedUint32. Use the .data property to access the Uint8Array.
     */
    async encrypt_uint32(value) {
        return this.encrypt(value, fhenixjs_1.EncryptionTypes.uint32);
    }
    sayHello() {
        return "hello";
    }
}
exports.FhenixHardhatRuntimeEnvironment = FhenixHardhatRuntimeEnvironment;
//# sourceMappingURL=FhenixHardhatRuntimeEnvironment.js.map