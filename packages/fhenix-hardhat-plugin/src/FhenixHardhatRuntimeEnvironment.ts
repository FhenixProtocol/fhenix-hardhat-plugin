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
    console.log(
      `network: ${JSON.stringify(this.network)}, isHardhat?: ${this.isHardhat}`,
    );
  }

  public async encrypt_uint8(
    value: number,
    securityZone?: number | undefined,
  ): Promise<EncryptedUint8> {
    if (this.isHardhat) {
      const data = bigintToUint8Array(BigInt(value));

      return {
        data,
        securityZone: securityZone || 0,
      };
    } else {
      return super.encrypt_uint8(value, securityZone);
    }
  }

  public async encrypt_uint16(
    value: number,
    securityZone?: number | undefined,
  ): Promise<EncryptedUint16> {
    if (this.isHardhat) {
      const data = bigintToUint8Array(BigInt(value));

      return {
        data,
        securityZone: securityZone || 0,
      };
    } else {
      return super.encrypt_uint16(value, securityZone);
    }
  }

  public async encrypt_uint32(
    value: number,
    securityZone?: number | undefined,
  ): Promise<EncryptedUint32> {
    if (this.isHardhat) {
      const data = bigintToUint8Array(BigInt(value));

      return {
        data,
        securityZone: securityZone || 0,
      };
    } else {
      return super.encrypt_uint32(value, securityZone);
    }
  }

  public async encrypt_uint64(
    value: string | bigint,
    securityZone?: number | undefined,
  ): Promise<EncryptedUint64> {
    if (this.isHardhat) {
      const data = bigintToUint8Array(BigInt(value));

      return {
        data,
        securityZone: securityZone || 0,
      };
    } else {
      return super.encrypt_uint64(value, securityZone);
    }
  }

  public async encrypt_uint128(
    value: string | bigint,
    securityZone?: number | undefined,
  ): Promise<EncryptedUint128> {
    if (this.isHardhat) {
      const data = bigintToUint8Array(BigInt(value));

      return {
        data,
        securityZone: securityZone || 0,
      };
    } else {
      return super.encrypt_uint128(value, securityZone);
    }
  }

  public async encrypt_uint256(
    value: string | bigint,
    securityZone?: number | undefined,
  ): Promise<EncryptedUint256> {
    if (this.isHardhat) {
      const data = bigintToUint8Array(BigInt(value));

      return {
        data,
        securityZone: securityZone || 0,
      };
    } else {
      return super.encrypt_uint256(value, securityZone);
    }
  }

  public async encrypt_bool(
    value: boolean,
    securityZone?: number | undefined,
  ): Promise<EncryptedBool> {
    if (this.isHardhat) {
      if (value) {
        const data = bigintToUint8Array(BigInt(1));

        return {
          data,
          securityZone: securityZone || 0,
        };
      } else {
        const data = bigintToUint8Array(BigInt(0));

        return {
          data,
          securityZone: securityZone || 0,
        };
      }
    } else {
      return super.encrypt_bool(value, securityZone);
    }
  }

  public unseal(
    contractAddress: string,
    ciphertext: string,
    account: string,
  ): bigint {
    if (this.isHardhat) {
      return uint8ArrayToBigint(ciphertext);
    } else {
      return super.unseal(contractAddress, ciphertext, account);
    }
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

function uint8ArrayToBigint(uint8ArrayStr: string): bigint {
  const byteArray = new Uint8Array(
    uint8ArrayStr.split("").map((c) => c.charCodeAt(0)),
  );

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
