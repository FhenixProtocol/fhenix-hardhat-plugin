# Fhenix Hardhat Plugin [![NPM Package][npm-badge]][npm] [![Github Actions][gha-badge]][gha] [![License: MIT][license-badge]][license]

[npm]: https://www.npmjs.org/package/fhenix-hardhat-plugin
[npm-badge]: https://img.shields.io/npm/v/fhenix-hardhat-plugin.svg
[gha]: https://github.com/fhenixprotocol/fhenix-hardhat-plugin/actions
[gha-badge]: https://github.com/fhenixprotocol/fhenix-hardhat-plugin/actions/workflows/test.yml/badge.svg
[license]: https://opensource.org/licenses/MIT
[license-badge]: https://img.shields.io/badge/License-MIT-blue.svg

Fhenix Hardhat Plugin is designed to extend your Hardhat environment with additional capabilities focused on Fhenix. It integrates seamlessly with your Hardhat projects to provide a local Fhenix environment, including customized network configuration and utilities for managing funds and permits within your blockchain applications.

See also [fhenix-hardhat-docker](https://www.npmjs.com/package/fhenix-hardhat-docker) and [fhenix-hardhat-network](https://www.npmjs.com/package/fhenix-hardhat-network/) for the full experience of Fhenix-compatible extensions.

## Features

- **Local Fhenix Environment:** Automatically sets up a local Fhenix network configuration within Hardhat, allowing for easy deployment and interaction with Fhenix contracts.
- **Faucet Integration:** Enables developers to easily obtain funds for testing purposes through a simple API call to a local faucet.
- **Permit Management:** Simplifies the process of creating and storing permit signatures required for transactions, reducing the complexity of interacting with contracts that require permissions.
- **Contract Security Checks:** Checks for Fhenix-related potential vulnerabilities in your contracts.
- **Hardhat Network Enhancements:** Adds support for simulated FHE operations in the built-in Hardhat network.

If you want to see a full example in action, check out our [Hardhat Example Template](https://github.com/FhenixProtocol/fhenix-hardhat-example)!

## Installation

To use FhenixJS in your Hardhat project, first install the plugin via npm (or your favorite package manager):

```sh
pnpm install fhenix-hardhat-plugin
```

If you wish to run your own local dev environment, please install the [fhenix-hardhat-docker](https://github.com/fhenixprotocol/fhenix-hardhat-docker) plugin as well.

```sh
pnpm install fhenix-hardhat-docker
```

Or, if you use then built-in Hardhat network:

```sh
pnpm install fhenix-hardhat-network
```

## Setup

After installation, import the plugin in your Hardhat configuration file (e.g., `hardhat.config.js`):

```javascript
require("fhenix-hardhat-plugin");
// if using the docker plugin
require("fhenix-hardhat-docker");
// if using the network plugin
require("fhenix-hardhat-docker");
```

or if you are using TypeScript, in your `hardhat.config.ts`:

```typescript
import "fhenix-hardhat-plugin";
// if using the docker plugin
import "fhenix-hardhat-docker";
// if using the network plugin
import "fhenix-hardhat-network";
```

## Configuration

### Network Configuration

The plugin automatically adds a `localfhenix` network configuration to your Hardhat project. This configuration is designed for local development and includes settings such as gas estimates, accounts, and the local network URL.

To target this network, simply add `--network localfhenix` to your hardhat commands, or set it as the default.

Alternatively, to use the build-in hardhat network, either do nothing if you're running the in-process network, or
add `--network localhost` to your hardhat commands if you're running the standalone network via `pnpm hardhat node`, just as you would without the fhenix-hardhat-network plugin.

### Using FhenixJS from Hardhat Runtime Environment

After importing `fhenix-hardhat-plugin` hardhat will automatically extend the Hardhat Runtime Environment (HRE) with a `fhenixjs` object, providing access to Fhenix-specific functionality:

- Use the `fhenixjs` object directly to encrypt, unseal or manage permits.
- **`getFunds(address: string)`**: Request funds from the local faucet for the specified address.
- **`createPermit(contractAddress: string, provider?: SupportedProvider)`**: Create and store a permit for interacting with a contract.

## Usage

### Local Dev Environment

To set up a localfhenix instance, simply import `fhenix-hardhat-docker`. This will add two new hardhat tasks:

- **`localfhenix:start`** To start a local dev environment using docker. By default, the instance will listen for rpc connections on port `42069`
- **`localfhenix:stop`** Stops the docker container

To start the container:

```sh
pnpm hardhat localfhenix:start
```

If starting the instance was successful, you should see the message: `Started LocalFhenix successfully at 127.0.0.1:42069`.

To stop the running container:

```sh
pnpm hardhat localfhenix:stop
```

Which will result in `Successfully shut down LocalFhenix`

### Requesting Funds

To request funds from the local faucet for an address, use the `getFunds` method:

```javascript
await hre.fhenixjs.getFunds("your_wallet_address");
```

Or use the `usefaucet` task. Omitting the address will send to the first account in the configured wallet:

```sh
pnpm hardhat run task:fhenix:usefaucet [--address <address>]
```
Or you can specify the account number if you want to specify more than one account for the mnemonic specified
```sh
pnpm task:fhenix:usefaucet --account <number>
```
If you're not using localfhenix, you have to specify the faucet url yourself:
```sh
pnpm task:fhenix:usefaucet --url <faucet-url>
```

### Encryption

```javascript
const encyrptedAmount = await fhenixjs.encrypt_uint32(15);
```

### Creating a Permit

To create a permit for a contract, use the `createPermit` method:

```javascript
const permit = await hre.fhenixjs.createPermit("contract_address");
```

See [FhenixJs](https://github.com/FhenixProtocol/fhenix.js) documentation for more on using the `fhenixjs` object.


## Troubleshooting

### `Transaction reverted: function returned an unexpected amount of data` on `FHE.randEuint*`

Calls like `FHE.randEuint8()` / `FHE.randEuint32()` can revert with this provider error on the in-process Hardhat network or a standalone `hardhat node` when the LocalFhenix / FHEVM mock stack is not the version the Solidity library expects (see [#22](https://github.com/FhenixProtocol/fhenix-hardhat-plugin/issues/22)).

Checklist:

1. Prefer `pnpm localfhenix:start` (or the current LocalFhenix task in this repo) over a bare `hardhat` / `hardhat node` network for contracts that use encrypted randomness.
2. Align `@fhevm/solidity` / `fhenixjs` / plugin versions with the versions documented for your release (mismatched precompile ABIs commonly surface as “unexpected amount of data”).
3. Clear stale deployment artifacts before redeploying (`deployments/` / cache) so the mock network is not serving an old bytecode shape.
4. Reproduce with a minimal contract that only calls `FHE.randEuint8()`; if that still fails after a clean LocalFhenix boot, open an issue with plugin + `@fhevm/solidity` + `fhenixjs` versions and whether you used LocalFhenix or plain Hardhat.

## Support

For issues, suggestions, or contributions, please open an issue or pull request in the GitHub [repository](https://github.com/FhenixProtocol/fhenix-hardhat-plugin/).
