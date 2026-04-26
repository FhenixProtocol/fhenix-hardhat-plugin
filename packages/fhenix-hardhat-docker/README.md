# Fhenix-Hardhat-Docker Plugin [![NPM Package][npm-badge]][npm] [![Github Actions][gha-badge]][gha] [![License: MIT][license-badge]][license]

[npm]: https://www.npmjs.org/package/fhenix-hardhat-docker
[npm-badge]: https://img.shields.io/npm/v/fhenix-hardhat-plugin.svg
[gha]: https://github.com/fhenixprotocol/fhenix-hardhat-plugin/actions
[gha-badge]: https://github.com/fhenixprotocol/fhenix-hardhat-plugin/actions/workflows/test.yml/badge.svg
[license]: https://opensource.org/licenses/MIT
[license-badge]: https://img.shields.io/badge/License-MIT-blue.svg

## Usage

- **`localfhenix:start`** To start a local dev environment using docker. By default, the instance will listen for rpc connections on port `42069`
- **`localfhenix:stop`** Stops the docker container

To start the container:

```sh
pnpm hardhat localfhenix:start
```

By default, `localfhenix:start` removes stale `deployments/localfhenix` artifacts before starting the container. To keep existing local deployments, pass `--clean false`.

If starting the instance was successful, you should see the message: `Started LocalFhenix successfully at 127.0.0.1:42069`.

To stop the running container:

```sh
pnpm hardhat localfhenix:stop
```

Which will result in `Successfully shut down LocalFhenix`
