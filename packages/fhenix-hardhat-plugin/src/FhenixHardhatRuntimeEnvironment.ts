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

  public constructor(
    public hre: HardhatRuntimeEnvironment,
    public config: FhenixHardhatRuntimeEnvironmentConfig,
  ) {
    let superArgs: InstanceParams = {
      ignoreErrors: true,
      provider: new MockProvider(),
    };
    if (hre?.network !== undefined && hre.network.provider) {
      superArgs = {
        ignoreErrors: true,
        provider: hre.network.provider,
      };
    }

    super(superArgs);

    this.network = hre?.network?.name;
    console.log(`network: ${JSON.stringify(this.network)}`);
    if (hre?.network?.name === "hardhat") {
      return;
    }
  }

  // public useHardhatNetwork() {
  //   this.network = "hardhat";
  // }
  //
  // public useFhenix() {
  //   this.network = "fhenix";
  // }
  //
  public async encrypt_uint8(
    value: number,
    securityZone?: number | undefined,
  ): Promise<EncryptedUint8> {
    if (this.network === "hardhat") {
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
    if (this.network === "hardhat") {
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
    if (this.network === "hardhat") {
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
    if (this.network === "hardhat") {
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
    if (this.network === "hardhat") {
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
    if (this.network === "hardhat") {
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
    if (this.network === "hardhat") {
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

  public unseal(contractAddress: string, ciphertext: string): bigint {
    // console.log(`ct: ${ciphertext}`);
    if (this.network === "hardhat") {
      return BigInt(ciphertext);
    } else {
      return super.unseal(contractAddress, ciphertext);
    }
  }

  public async getFunds(address: string) {
    await getFunds(address, `http://localhost:${this.config.faucetPort}`);
  }

  public async createPermit(
    contractAddress: string,
    provider?: SupportedProvider,
  ) {
    if (!provider && this.provider === undefined) {
      throw new Error("no provider provided");
    }

    const permit = await getPermit(contractAddress, provider || this.provider!);

    if (!permit) {
      return;
    }

    this.storePermit(permit);
    return permit;
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
//
// function bigintToUint8Array(value: bigint): Uint8Array {
//   const hex = value.toString(16);
//   const len = Math.ceil(hex.length / 2);
//   const u8 = new Uint8Array(len);
//   for (let i = 0; i < len; i++) {
//     u8[len - i - 1] = parseInt(hex.substr(i * 2, 2), 16);
//   }
//   return u8;
// }

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
