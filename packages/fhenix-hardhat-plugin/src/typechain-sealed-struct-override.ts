import { task } from "hardhat/config";
import fg from "fast-glob";
import fs from "fs-extra";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import chalk from "chalk";

/*

Purpose:

`fhenixsdk.unseal` is a strongly typed unseal function that uses the `utype`
field of `SealedBool`/`SealedUint`/`SealedAddress` to unseal data into the
appropriate unencrypted type - eg `SealedBool` -> `bool`.

This task runs after `typechain:generate-types` to replace the default SealedStruct
type with a narrowed struct with `utype` literals. This allows `fhenixsdk.unseal`
to correctly map SealedStructs to their unsealed type.

---------------

Replaces:

```
export type SealedUintStruct = { data: string; utype: BigNumberish };

export type SealedUintStructOutput = [data: string, utype: bigint] & {
  data: string;
  utype: bigint;
};
```

with:

```
export type SealedUintStruct = { data: string, utype: 0 | 1 | 2 | 3 | 4 | 5 };

export type SealedUintStructOutput = [data: string, utype: 0 | 1 | 2 | 3 | 4 | 5] & {
  data: string;
  utype: 0 | 1 | 2 | 3 | 4 | 5;
};
```

Along with similar replacements for:
- `SealedBool` (utype: 13)
- `SealedAddress` (utype: 12)

*/

task(
  "typechain:generate-types",
  "Overrides typechain `SealedStruct` types with `utype` literals, uses `outDir` of `typechain` config in hardhat config.",
).setAction(async ({}, hre: HardhatRuntimeEnvironment, runSuper) => {
  const typechainSuperRes = await runSuper();

  console.log("");
  const replaced: Record<string, string[]> = {};

  // Path to replace types in
  const typechainConfigOutDir =
    (hre.config as any)?.typechain?.outDir ?? "typechain-types";
  const typesPath = `${typechainConfigOutDir}/**/*.ts`;

  // Get files to replace
  const files = fg.sync(typesPath);

  // Iterate files making replacements, mark any replacements for display later
  for (const file of files) {
    let content = fs.readFileSync(file, "utf8");

    for (const replacement of replacements) {
      if (content.includes(existingDefinitions[replacement].trim())) {
        // Mark the file as having a replacement
        if (replaced[file] == null) replaced[file] = [replacement];
        else replaced[file].push(replacement);

        content = content.replace(
          existingDefinitions[replacement].trim(),
          updatedDefinitions[replacement].trim(),
        );
      }
    }

    fs.writeFileSync(file, content, "utf8");
  }

  // List executed replacements
  if (Object.keys(replaced).length > 0) {
    console.log(
      `${chalk.green(
        chalk.bold("fhenix-hardhat-plugin:ReplaceSealedStructTypes"),
      )} narrowing typechain SealedBool/Uint/Address types....`,
    );

    Object.entries(replaced).forEach(([file, replacedStructs]) => {
      // File display, `typescript-types/contracts/Counter.ts` -> `Counter.sol`
      const fileNameDisplay = file
        .split("/")
        .slice(-1)[0]
        .replace(".ts", ".sol");

      // Replaced structs
      const replacedStructsDisplay = replacedStructs
        .map((r) => `Sealed${r[0].toUpperCase()}${r.slice(1)}`)
        .join(" / ");

      console.log(
        `  - ${chalk.bold(fileNameDisplay)}: <${replacedStructsDisplay}>`,
      );
      console.log("");
    });
  }

  return typechainSuperRes;
});

// CONFIG

// Sealed Bool

const existingSealedBoolDefinition = `
export type SealedBoolStruct = { data: string; utype: BigNumberish };

export type SealedBoolStructOutput = [data: string, utype: bigint] & {
  data: string;
  utype: bigint;
};
`;

const updatedSealedBoolDefinition = `
export type SealedBoolStruct = { data: string, utype: 13 };

export type SealedBoolStructOutput = [data: string, utype: 13] & {
  data: string;
  utype: 13;
};
`;

// Sealed Uint

const existingSealedUintDefinition = `
export type SealedUintStruct = { data: string; utype: BigNumberish };

export type SealedUintStructOutput = [data: string, utype: bigint] & {
  data: string;
  utype: bigint;
};
`;

const updatedSealedUintDefinition = `
export type SealedUintStruct = { data: string, utype: 0 | 1 | 2 | 3 | 4 | 5 };

export type SealedUintStructOutput = [data: string, utype: 0 | 1 | 2 | 3 | 4 | 5] & {
  data: string;
  utype: 0 | 1 | 2 | 3 | 4 | 5;
};
`;

// Sealed Address

const existingSealedAddressDefinition = `
export type SealedAddressStruct = { data: string; utype: BigNumberish };

export type SealedAddressStructOutput = [data: string, utype: bigint] & {
  data: string;
  utype: bigint;
};
`;

const updatedSealedAddressDefinition = `
export type SealedAddressStruct = { data: string, utype: 12 };

export type SealedAddressStructOutput = [data: string, utype: 12] & {
  data: string;
  utype: 12;
};
`;

const replacements = ["bool", "uint", "address"] as const;
type Replacement = typeof replacements[number];

const existingDefinitions: Record<Replacement, string> = {
  bool: existingSealedBoolDefinition,
  uint: existingSealedUintDefinition,
  address: existingSealedAddressDefinition,
};

const updatedDefinitions: Record<Replacement, string> = {
  bool: updatedSealedBoolDefinition,
  uint: updatedSealedUintDefinition,
  address: updatedSealedAddressDefinition,
};
