"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../../../src/index");
const config = {
    solidity: "0.8.20",
    defaultNetwork: "localfhenix",
    networks: {
        localfhenix: {
            url: "http://localhost:8545",
        },
    },
    paths: {
    // newPath: "asd",
    },
};
exports.default = config;
//# sourceMappingURL=hardhat.config.js.map