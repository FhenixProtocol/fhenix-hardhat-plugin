import { HardhatRuntimeEnvironment } from "hardhat/types";

const detectInputPermission = (inputs: any[]): boolean => {
  let detected = false;
  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];
    if ("components" in input) {
      detected = detected || detectInputPermission(input.components);
    }
    if (!("internalType" in input)) continue;

    if (
      input.internalType === "struct Permission" ||
      input.internalType === "struct PermissionV2"
    ) {
      detected = true;
    }
  }
  return detected;
};

const protectedInternalTypes = [
  "euint8",
  "euint16",
  "euint32",
  "euint64",
  "euint128",
  "euint256",
  "ebool",
  "eaddress",
].flatMap((val) => [val, `${val}[]`]);

type ExposureItem = {
  name: string;
  type: string;
  position: number;
  children: ExposureItem[];
  count: number;
};
type FuncExposures = {
  func: any;
  exposures: ExposureItem[];
  count: number;
};
type ContractExposures = {
  contract: string;
  funcExposures: FuncExposures[];
  count: number;
};

const detectOutputVulnerability = (outputs: any[]): ExposureItem[] => {
  const exposureItems: ExposureItem[] = [];
  for (let i = 0; i < outputs.length; i++) {
    const output = outputs[i];
    if ("components" in output) {
      const nestedExposures = detectOutputVulnerability(output.components);
      if (nestedExposures.length > 0) {
        exposureItems.push({
          name: output.name,
          type: output.internalType,
          position: i,
          children: nestedExposures,
          count: nestedExposures.length,
        });
      }
    }
    if (!("internalType" in output)) continue;

    const internalType = output.internalType;
    if (protectedInternalTypes.includes(internalType)) {
      exposureItems.push({
        name: output.name,
        type: output.internalType,
        position: i,
        children: [],
        count: 1,
      });
    }
  }
  return exposureItems;
};

const detectFunctionExposure = (func: any): FuncExposures | undefined => {
  let hasPermission = false;

  if ("inputs" in func) {
    hasPermission = detectInputPermission(func.inputs);
  }

  if (!hasPermission && "outputs" in func) {
    const exposureItems = detectOutputVulnerability(func.outputs);
    if (exposureItems.length > 0)
      return {
        func,
        exposures: exposureItems,
        count: exposureItems.reduce((acc, item) => acc + item.count, 0),
      };
  }

  return undefined;
};

const detectContractExposure = (abi: any[]): FuncExposures[] => {
  const vulnerabilities: FuncExposures[] = [];
  for (let i = 0; i < abi.length; i++) {
    const abiItem = abi[i];
    if ("type" in abiItem && abiItem.type === "function") {
      const funcVulnerabilities = detectFunctionExposure(abiItem);
      if (funcVulnerabilities != null) {
        vulnerabilities.push(funcVulnerabilities);
      }
    }
  }
  return vulnerabilities;
};

export const detectExposures = async (
  hre: HardhatRuntimeEnvironment,
): Promise<ContractExposures[]> => {
  const names = await hre.artifacts.getAllFullyQualifiedNames();
  const contractExposures: ContractExposures[] = [];

  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    if (name.includes("@fhenixprotocol/contracts/")) continue;

    const artifact = await hre.artifacts.readArtifact(name);
    const funcExposures = detectContractExposure(artifact.abi);
    if (funcExposures.length > 0) {
      contractExposures.push({
        contract: name,
        funcExposures: funcExposures,
        count: funcExposures.reduce((acc, item) => acc + item.count, 0),
      });
    }
  }

  return contractExposures;
};
