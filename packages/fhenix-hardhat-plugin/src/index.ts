import chalk from "chalk";
import { HDNodeWallet, TypedDataField, Wallet } from "ethers";
import { TASK_COMPILE_SOLIDITY_EMIT_ARTIFACTS } from "hardhat/builtin-tasks/task-names";
import { extendConfig, extendEnvironment, task, types } from "hardhat/config";
import { lazyObject } from "hardhat/plugins";
import {
  HardhatRuntimeEnvironment,
  HttpNetworkConfig,
  HttpNetworkHDAccountsConfig,
} from "hardhat/types";

import { getFunds } from "./common";
import {
  TASK_FHENIX_CHECK_EXPOSED_ENCRYPTED_VARS,
  TASK_FHENIX_USE_FAUCET,
} from "./const";
import {
  detectExposures,
  printExposedContracts,
  printExposureSummary,
  printExposureCheckIntro,
  printNoExposureSummary,
} from "./exposed";
import { FhenixHardhatRuntimeEnvironment } from "./FhenixHardhatRuntimeEnvironment";
import "./type-extensions";
import { fhenixsdk } from "fhenixjs";
import "./typechain-sealed-struct-override";

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

  hre.fhenixsdk = lazyObject(() => ({
    ...fhenixsdk,
    initializeWithHHSigner: async ({ signer, ...params }) =>
      hre.fhenixsdk.initialize({
        provider: {
          call: async (...args) => {
            try {
              return signer.provider.call(...args);
            } catch (e) {
              throw new Error(
                `fhenixsdk initializeWithHHSigner :: call :: ${e}`,
              );
            }
          },
          getChainId: async () =>
            (await signer.provider.getNetwork()).chainId.toString(),
        },
        signer: {
          signTypedData: async (domain, types, value) =>
            signer.signTypedData(
              domain,
              types as Record<string, TypedDataField[]>,
              value,
            ),
          getAddress: async () => signer.getAddress(),
        },
        ...params,
      }),
  }));
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
    "http://localhost:3000",
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

/**
 * Detects whether any contracts are exposing encrypted variables
 *
 * The following contract code would expose raw encrypted values:
 *
 * ```solidity
 * mapping(address => euint8) public encBalances;
 * function getBalance(address) public view returns (euint8)
 * ```
 *
 * A malicious contracts can call `VulnerableContract.encBalances(user)` or `VulnerableContract.getBalance(user)` to
 * get the users raw `euint8` balance. The malicious contract can then `decrypt` that value to expose it.
 */
export const checkExposedEncryptedVars = async (
  hre: HardhatRuntimeEnvironment,
) => {
  printExposureCheckIntro();

  const contractExposures = await detectExposures(hre);

  if (contractExposures.length === 0) {
    printNoExposureSummary();
  } else {
    console.log(printExposedContracts(contractExposures));
    printExposureSummary(contractExposures);
  }
};

task(
  TASK_FHENIX_CHECK_EXPOSED_ENCRYPTED_VARS,
  "Check contracts for exposed encrypted vars (euint8-256, ebool, eaddress)",
).setAction(async ({}, hre) => {
  await checkExposedEncryptedVars(hre);
});

task(
  TASK_COMPILE_SOLIDITY_EMIT_ARTIFACTS,
  "Check FHE enabled contracts for exposed encrypted vars (euint8-256, ebool, eaddress)",
).setAction(async ({}, hre: HardhatRuntimeEnvironment, runSuper) => {
  const compileSuperRes = await runSuper();
  await checkExposedEncryptedVars(hre);
  return compileSuperRes;
});
