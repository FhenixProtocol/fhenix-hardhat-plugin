import {
  EncryptedBool,
  EncryptedUint128,
  EncryptedUint16,
  EncryptedUint256,
  EncryptedUint32,
  EncryptedUint64,
  EncryptedUint8,
  FhenixClient,
  getPermit,
  InstanceParams,
  Permit,
  SupportedProvider,
} from "fhenixjs";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import { getFunds } from "./common";

interface FhenixHardhatRuntimeEnvironmentConfig {
  rpcPort: number;
  wsPort: number;
  faucetPort: number;
}

export class FhenixHardhatRuntimeEnvironment extends FhenixClient {
  // TODO remove config
  // move the faucet to a task on the example repo
  // there's no good way to discover the faucet port from here
  public network: string;
  public isHardhat: boolean;

  public constructor(
    public hre: HardhatRuntimeEnvironment,
    public config: FhenixHardhatRuntimeEnvironmentConfig,
  ) {
    const isHardhat = hre?.network?.config?.chainId === 31337;

    const superArgs: InstanceParams = {
      ignoreErrors: true,
      provider: new MockProvider(),
      skipPubKeyFetch: isHardhat,
    };
    if (hre?.network !== undefined && hre.network.provider) {
      superArgs.provider = hre.network.provider;
    }

    super(superArgs);

    this.network = hre?.network?.name;
    this.isHardhat = isHardhat;
  }

  private hardhatMockEncryptCurry = <
    T extends (value: any, securityZone?: number) => Promise<any>
  >(
    encryptFunction: T,
  ) => {
    return (async (
      value: Parameters<T>[0],
      securityZone?: number,
    ): Promise<ReturnType<T>> => {
      if (this.isHardhat) {
        return hardhatMockEncrypt(BigInt(value), securityZone) as ReturnType<T>;
      }
      return encryptFunction(value, securityZone);
    }) as T;
  };

  public encrypt_bool = this.hardhatMockEncryptCurry(super.encrypt_bool);
  public encrypt_uint8 = this.hardhatMockEncryptCurry(super.encrypt_uint8);
  public encrypt_uint16 = this.hardhatMockEncryptCurry(super.encrypt_uint16);
  public encrypt_uint32 = this.hardhatMockEncryptCurry(super.encrypt_uint32);
  public encrypt_uint64 = this.hardhatMockEncryptCurry(super.encrypt_uint64);
  public encrypt_uint128 = this.hardhatMockEncryptCurry(super.encrypt_uint128);
  public encrypt_uint256 = this.hardhatMockEncryptCurry(super.encrypt_uint256);
  public encrypt_address = this.hardhatMockEncryptCurry(super.encrypt_address);

  public unseal(
    contractAddress: string,
    ciphertext: string,
    account: string,
  ): bigint {
    if (this.isHardhat) return hardhatMockDecrypt(ciphertext);
    return super.unseal(contractAddress, ciphertext, account);
  }

  public async getFunds(address: string) {
    await getFunds(address, `http://localhost:${this.config.faucetPort}`);
  }

  public async createPermit(
    contractAddress: string,
    provider?: SupportedProvider,
  ): Promise<Permit | undefined> {
    if (!provider && this.provider === undefined) {
      throw new Error("no provider provided");
    }

    const permit = await getPermit(contractAddress, provider || this.provider!);
    return permit ?? undefined;
  }

  public sayHello() {
    return "hello";
  }
}

export class MockProvider {
  public async send(method: string, params: any[] | unknown): Promise<any> {
    return new Promise((resolve, reject) => {
      reject("provider not initialized");
    });
  }

  public async getSigner(): Promise<any> {
    return new Promise((resolve, reject) => {
      reject("provider not initialized");
    });
  }
}

function hardhatMockDecrypt(value: string): bigint {
  // Convert string into byte array
  const byteArray = new Uint8Array(value.split("").map((c) => c.charCodeAt(0)));

  let result = BigInt(0);
  for (const byteArrayItem of byteArray) {
    result = (result << BigInt(8)) + BigInt(byteArrayItem);
  }

  return result;
}

function bigintToUint8Array(bigNum: bigint): Uint8Array {
  const byteLength = 32;
  const byteArray = new Uint8Array(byteLength);

  // Create a BigInt mask for each byte
  const mask = BigInt(0xff);

  // Initialize an index to start from the end of the array
  for (let i = 0; i < byteLength; i++) {
    // Extract the last byte and assign it to the corresponding position in the array
    byteArray[byteLength - 1 - i] = Number(bigNum & mask);
    // Shift bigint right by 8 bits to process the next byte in the next iteration
    bigNum >>= BigInt(8);
  }

  return byteArray;
}

const hardhatMockEncrypt = (value: bigint, securityZone = 0) => ({
  data: bigintToUint8Array(BigInt(value)),
  securityZone: securityZone || 0,
});
