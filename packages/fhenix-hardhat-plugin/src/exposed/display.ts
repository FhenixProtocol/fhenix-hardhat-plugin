import { Fragment } from "ethers";
import chalk from "chalk";
import { ExposureItem, FuncExposures, ContractExposures } from "./types";

const formatExposedItem = (item: ExposureItem): string => {
  const isLeaf = item.children == null || item.children.length === 0;
  const nameOrPosition = item.name === "" ? `pos-${item.position}` : item.name;
  const itemType = isLeaf ? chalk.red(chalk.bold(item.type)) : item.type;
  return `${nameOrPosition} - ${itemType}`;
};

const printExposedItem = (nesting: number, item: ExposureItem) => {
  let output = "";

  output += `      ${"  ".repeat(nesting)}${formatExposedItem(item)}`;
  output += "\n";

  if (item.children != null && item.children.length > 0) {
    for (let i = 0; i < item.children.length; i++) {
      output += printExposedItem(nesting + 1, item.children[i]);
    }
  }

  return output;
};

const printExposedFunction = (funcExposure: FuncExposures) => {
  let output = "";
  const fragment = Fragment.from(funcExposure.func);

  output += `    ${chalk.bold(fragment.format())} exposes ${
    funcExposure.exposures.length
  } encrypted variables:`;
  output += "\n";

  for (let k = 0; k < funcExposure.exposures.length; k++) {
    output += printExposedItem(0, funcExposure.exposures[k]);
  }

  output += "\n";
  return output;
};

const printExposedContract = (contractExposure: ContractExposures) => {
  let output = "";

  output += `  ${chalk.red(chalk.bold(contractExposure.contract))}`;
  output += "\n";
  output += "\n";

  for (let i = 0; i < contractExposure.funcExposures.length; i++) {
    output += printExposedFunction(contractExposure.funcExposures[i]);
  }

  return output;
};

export const printExposedContracts = (contracts: ContractExposures[]) => {
  let output = "";

  output += "\n";

  for (let i = 0; i < contracts.length; i++) {
    output += printExposedContract(contracts[i]);
  }

  return output;
};

export const printExposureSummary = (contracts: ContractExposures[]) => {
  const totalExposures = contracts.reduce((acc, item) => acc + item.count, 0);
  console.log(
    chalk.bold(
      chalk.red(
        `Detected ${totalExposures} exposed encrypted variables in ${contracts.length} contracts!\n`,
      ),
    ),
  );
};

export const printNoExposureSummary = () => {
  console.log(
    chalk.bold(
      chalk.green(
        "fhenix-hardhat-plugin:CheckExposedEncryptedData detected 0 exposed variables",
      ),
    ),
  );
};

export const printExposureCheckIntro = () => {
  console.log(
    chalk.bold("\nfhenix-hardhat-plugin"),
    "checking for exposed encrypted variables....",
  );
};
