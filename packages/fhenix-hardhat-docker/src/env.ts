import chalk from "chalk";
import fs from 'fs';
import path from 'path';

export const cleanDeployments = (): void => {
  console.log(chalk.green("Cleaning deployments.."));

  // Get the current working directory (root of the project that imported this package)
  const cwd = process.cwd();
  const deploymentsPath = path.join(cwd, 'deployments');

  if (fs.existsSync(deploymentsPath)) {
    fs.rmSync(deploymentsPath, { recursive: true, force: true });
    console.log(chalk.green('Successfully cleaned deployments directory'));
  } else {
    console.log(chalk.yellow(`No deployments found in ${deploymentsPath}`));
  }
};