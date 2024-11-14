# Fhenix Hardhat Network Plugin [![NPM Package][npm-badge]][npm] [![Github Actions][gha-badge]][gha] [![License: MIT][license-badge]][license]

[npm]: https://www.npmjs.org/package/fhenix-hardhat-network
[npm-badge]: https://img.shields.io/npm/v/fhenix-hardhat-plugin.svg
[gha]: https://github.com/fhenixprotocol/fhenix-hardhat-plugin/actions
[gha-badge]: https://github.com/fhenixprotocol/fhenix-hardhat-plugin/actions/workflows/test.yml/badge.svg
[license]: https://opensource.org/licenses/MIT
[license-badge]: https://img.shields.io/badge/License-MIT-blue.svg

Fhenix Hardhat Network makes the built-in Hardhat network compatible with Fhenix.

By importing the `fhenix-hardhat-network` plugin in `hardhat.config.ts`, you can use simulated FHE operations on the Hardhat Network.

These do not perform the full FHE computations, and are meant to serve as development tools to verify contract logic.
This plugin is still in its experimental phase.

### Features

Enhances the following actions:
* `pnpm hardhat run ...`
* `pnpm hardhat node`
* `pnpm hardhat test`

with a hook that injects the mock FHE operations to the reserved address for the FHE Operations precompile.
