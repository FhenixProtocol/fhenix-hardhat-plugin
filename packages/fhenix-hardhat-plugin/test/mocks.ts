import { ethers, AbiCoder } from "ethers";
import { AbstractProvider, AbstractSigner } from "fhenixjs";

export const getNetworkPublicKeySig = "0x1b1b484e"; // cast sig "getNetworkPublicKey(int32)"

const MockMnemonics = [
  "grant rice replace explain federal release fix clever romance raise often wild taxi quarter soccer fiber love must tape steak together observe swap guitar", // account a
  "jelly shadow frog dirt dragon use armed praise universe win jungle close inmate rain oil canvas beauty pioneer chef soccer icon dizzy thunder meadow", // account b
  "chair love bleak wonder skirt permit say assist aunt credit roast size obtain minute throw sand usual age smart exact enough room shadow charge", // account c
];
export const BobWallet = ethers.Wallet.fromPhrase(MockMnemonics[1]);
export const AdaWallet = ethers.Wallet.fromPhrase(MockMnemonics[2]);

export const fromHexString = (hexString: string): Uint8Array => {
  const arr = hexString.replace(/^(0x)/, "").match(/.{1,2}/g);
  if (!arr) return new Uint8Array();
  return Uint8Array.from(arr.map((byte) => parseInt(byte, 16)));
};

export class MockSigner implements AbstractSigner {
  wallet: ethers.HDNodeWallet;

  constructor(wallet: ethers.HDNodeWallet) {
    this.wallet = wallet;
  }

  signTypedData = async (domain: any, types: any, value: any): Promise<any> => {
    return await this.wallet.signTypedData(domain, types, value);
  };

  getAddress = async (): Promise<string> => {
    return this.wallet.getAddress();
  };
}

export class MockProvider implements AbstractProvider {
  publicKey: string;
  wallet: ethers.HDNodeWallet;
  chainId: string;

  constructor(pk: string, wallet?: ethers.HDNodeWallet, chainId?: string) {
    this.publicKey = pk;
    this.wallet = wallet ?? ethers.Wallet.fromPhrase(MockMnemonics[0]);
    this.chainId = chainId || "0x10";
  }

  async getChainId(): Promise<string> {
    return `${this.chainId}`;
  }

  async call(tx: { to: string; data: string }): Promise<string> {
    if (tx.data.startsWith(getNetworkPublicKeySig)) {
      // Simulate an eth_call operation
      if (typeof this.publicKey === "string") {
        const abiCoder = new AbiCoder();
        const buff = fromHexString(this.publicKey);
        return abiCoder.encode(["bytes"], [buff]);
      }
      return this.publicKey;
    }

    throw new Error(
      `MockProvider :: call :: not-implemented for fn: ${JSON.stringify(
        tx,
        undefined,
        2,
      )}`,
    );
  }

  async send(method: string, params: unknown[] | undefined): Promise<string> {
    if (method === "eth_chainId") {
      return this.chainId;
    }

    if (method === "eth_call") {
      const { to, data } = (params?.[0] ?? {
        to: "undefined",
        data: "undefined",
      }) as { to: string; data: string };
      return this.call({ to, data });
    }

    throw new Error(
      `MockProvider :: send :: Method not implemented: ${method}`,
    );
  }

  async getSigner(): Promise<MockSigner> {
    return new MockSigner(this.wallet);
  }
}
