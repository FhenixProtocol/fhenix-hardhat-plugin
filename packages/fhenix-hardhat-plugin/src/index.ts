import chalk from "chalk";
import { HDNodeWallet, Wallet } from "ethers";
import { extendConfig, extendEnvironment, task, types } from "hardhat/config";
import { lazyObject } from "hardhat/plugins";
import {
  HardhatNetworkHDAccountsConfig,
  HttpNetworkConfig,
  HttpNetworkHDAccountsConfig,
} from "hardhat/types";

import { getFunds } from "./common";
import { TASK_FHENIX_USE_FAUCET } from "./const";
import { FhenixHardhatRuntimeEnvironment } from "./FhenixHardhatRuntimeEnvironment";
import "./type-extensions";

// This import is needed to let the TypeScript compiler know that it should include your type
// extensions in your npm package's types file.

extendEnvironment((hre) => {
  hre.fhenixjs = lazyObject(() => {
    const fhenix = new FhenixHardhatRuntimeEnvironment(hre, {
      rpcPort: 42069,
      wsPort: 42070,
      faucetPort: 42000,
    });

    return fhenix;
  });
});

extendConfig((config, userConfig) => {
  if (userConfig.networks && userConfig.networks.localfhenix) {
    return;
  }

  config.networks.localfhenix = {
    gas: "auto",
    gasMultiplier: 1.2,
    gasPrice: "auto",
    timeout: 10_000,
    httpHeaders: {},
    url: "http://127.0.0.1:42069",
    accounts: {
      mnemonic:
        "demand hotel mass rally sphere tiger measure sick spoon evoke fashion comfort",
      path: "m/44'/60'/0'/0",
      initialIndex: 0,
      count: 20,
      accountsBalance: "10000000000000000000",
      // @ts-ignore
      passphrase: "",
    },
  };
});

// Main task of the plugin. It starts the server and listens for requests.
task(TASK_FHENIX_USE_FAUCET, "Fund an account from the faucet")
  .addOptionalParam("address", "Address to fund", undefined, types.string)
  .addOptionalParam("account", "account number to fund", 0, types.int)
  .addOptionalParam(
    "url",
    "Optional Faucet URL",
    "http://localhost:42000",
    types.string,
  )
  .setAction(
    async (
      {
        address,
        account,
        url,
      }: // log,
      {
        address: string;
        account: number;
        url: string;
      },
      { network },
    ) => {
      if (network.name !== "localfhenix" && !url) {
        console.info(
          chalk.yellow(
            `Programmatic faucet only supported for localfhenix. Please provide a faucet url, or use the public testnet faucet at https://faucet.fhenix.zone`,
          ),
        );
        return;
      }

      const networkConfig = network.config;

      let foundAddress = "";
      if (Object(networkConfig).hasOwnProperty("url")) {
        const x = networkConfig as HttpNetworkConfig;
        if (x.accounts === "remote") {
          console.log(
            chalk.yellow(`Remote network detected, cannot use faucet`),
          );
          return;
        } else if (Object(x.accounts).hasOwnProperty("mnemonic")) {
          const networkObject = x.accounts as HttpNetworkHDAccountsConfig;

          const mnemonic = networkObject.mnemonic;

          const path = `${networkObject.path || "m/44'/60'/0'/0"}/${
            account || networkObject.initialIndex || 0
          }`;

          const wallet = HDNodeWallet.fromPhrase(mnemonic, "", path);

          foundAddress = wallet.address;
        } else {
          const accounts = x.accounts as string[];
          const privateKey = accounts[account || 0];
          const wallet = new Wallet(privateKey);
          foundAddress = wallet.address;
        }
      }

      const myAddress = address || foundAddress;

      if (!myAddress) {
        console.info(chalk.red(`Failed to get address from hardhat`));
        return;
      }

      console.info(chalk.green(`Getting funds from faucet for ${myAddress}`));

      try {
        await getFunds(myAddress, url);
        console.info(chalk.green(`Success!`));
      } catch (e) {
        console.info(
          chalk.red(
            `failed to get funds from faucet @ ${url} for ${address}: ${e}`,
          ),
        );
      }
    },
  );
