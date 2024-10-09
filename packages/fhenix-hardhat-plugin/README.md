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

- **Faucet Integration:** Enables developers to easily obtain funds for testing purposes through a simple API call to a local faucet.
- **Permit Management:** Simplifies the process of creating and storing permit signatures required for transactions, reducing the complexity of interacting with contracts that require permissions.
- **Contract Security Checks:** Checks for Fhenix-related potential vulnerabilities in your contracts.

If you want to see a full example in action, check out our [Hardhat Example Template](https://github.com/FhenixProtocol/fhenix-hardhat-example)!

## Installation

To use FhenixJS in your Hardhat project, first install the plugin via npm (or your favorite package manager):

```sh
pnpm install fhenix-hardhat-plugin
```

## Setup

After installation, import the plugin in your Hardhat configuration file (e.g., `hardhat.config.js`):

```javascript
require("fhenix-hardhat-plugin");
```

or if you are using TypeScript, in your `hardhat.config.ts`:

```typescript
import "fhenix-hardhat-plugin";
```

## Configuration

### Using FhenixJS from Hardhat Runtime Environment

After importing `fhenix-hardhat-plugin` hardhat will automatically extend the Hardhat Runtime Environment (HRE) with a `fhenixjs` object, providing access to Fhenix-specific functionality:

- Use the `fhenixjs` object directly to encrypt, unseal or manage permits.
- **`getFunds(address: string)`**: Request funds from the local faucet for the specified address.
- **`createPermit(contractAddress: string, provider?: SupportedProvider)`**: Create and store a permit for interacting with a contract.

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

## Support

For issues, suggestions, or contributions, please open an issue or pull request in the GitHub [repository](https://github.com/FhenixProtocol/fhenix-hardhat-plugin/).
