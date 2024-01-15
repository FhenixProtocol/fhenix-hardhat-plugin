"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("hardhat/config");
const FhenixHardhatRuntimeEnvironment_1 = require("./FhenixHardhatRuntimeEnvironment");
// This import is needed to let the TypeScript compiler know that it should include your type
// extensions in your npm package's types file.
require("./type-extensions");
// extendConfig(
//   (config: HardhatConfig, userConfig: Readonly<HardhatUserConfig>) => {
//     // We apply our default config here. Any other kind of config resolution
//     // or normalization should be placed here.
//     //
//     // `config` is the resolved config, which will be used during runtime and
//     // you should modify.
//     // `userConfig` is the config as provided by the user. You should not modify
//     // it.
//     //
//     // If you extended the `HardhatConfig` type, you need to make sure that
//     // executing this function ensures that the `config` object is in a valid
//     // state for its type, including its extensions. For example, you may
//     // need to apply a default value, like in this example.
//     const userPath = userConfig.paths?.newPath;
//     let newPath: string;
//     if (userPath === undefined) {
//       newPath = path.join(config.paths.root, "newPath");
//     } else {
//       if (path.isAbsolute(userPath)) {
//         newPath = userPath;
//       } else {
//         // We resolve relative paths starting from the project's root.
//         // Please keep this convention to avoid confusion.
//         newPath = path.normalize(path.join(config.paths.root, userPath));
//       }
//     }
//     config.paths.newPath = newPath;
//   },
// );
(0, config_1.extendEnvironment)((hre) => {
    hre.fhenix = new FhenixHardhatRuntimeEnvironment_1.FhenixHardhatRuntimeEnvironment();
});
//# sourceMappingURL=index.js.map