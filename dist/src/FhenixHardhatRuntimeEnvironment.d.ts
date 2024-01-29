import { EncryptedUint16, EncryptedUint32, EncryptedUint8, FhenixClient, Permit } from "fhenixjs";
interface FhenixHardhatRuntimeEnvironmentConfig {
    rpcPort?: number;
    wsPort?: number;
    faucetPort?: number;
}
export declare class FhenixHardhatRuntimeEnvironment extends FhenixClient {
    private config;
    private readonly provider;
    constructor(config?: FhenixHardhatRuntimeEnvironmentConfig);
    static startLocalFhenix(config?: FhenixHardhatRuntimeEnvironmentConfig): Promise<void>;
    static isLocalFhenixRunning(config?: FhenixHardhatRuntimeEnvironmentConfig): boolean;
    getFunds(addres: string): Promise<void>;
    generatePermit(contract: string): Promise<Permit>;
    /**
     * Encrypts a Uint8 value using the stored public key.
     * @param {number} value - The Uint8 value to encrypt.
     * @returns {EncryptedUint8} - The encrypted value serialized as EncryptedUint8. Use the .data property to access the Uint8Array.
     */
    encrypt_uint8(value: number): Promise<EncryptedUint8>;
    /**
     * Encrypts a Uint16 value using the stored public key.
     * @param {number} value - The Uint16 value to encrypt.
     * @returns {EncryptedUint16} - The encrypted value serialized as EncryptedUint16. Use the .data property to access the Uint8Array.
     */
    encrypt_uint16(value: number): Promise<EncryptedUint16>;
    /**
     * Encrypts a Uint32 value using the stored public key.
     * @param {number} value - The Uint32 value to encrypt.
     * @returns {EncryptedUint32} - The encrypted value serialized as EncryptedUint32. Use the .data property to access the Uint8Array.
     */
    encrypt_uint32(value: number): Promise<EncryptedUint32>;
    sayHello(): string;
}
export {};
//# sourceMappingURL=FhenixHardhatRuntimeEnvironment.d.ts.map