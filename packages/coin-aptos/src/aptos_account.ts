import { HexString, MaybeHexString } from "./hex_string";
import { MoveTypes } from "./transaction_builder";
import { base, signUtil } from '@okxweb3/crypto-lib';

export interface AptosAccountObject {
  address?: string;
  publicKeyHex?: MoveTypes.HexEncodedBytes;
  privateKeyHex: MoveTypes.HexEncodedBytes;
}

/**
 * Class for creating and managing Aptos account
 */
export class AptosAccount {
  /**
   * A private key and public key, associated with the given account
   */
  private readonly publicKey: Uint8Array
  private readonly privateKey: Uint8Array

  /**
   * Address associated with the given account
   */
  private readonly accountAddress: HexString;

  // Generate an account from the private key
  static fromPrivateKey(privateKey: HexString): AptosAccount {
    return new AptosAccount(privateKey.toUint8Array());
  }

  /**
   * Creates new account instance. Constructor allows passing in an address,
   * to handle account key rotation, where auth_key != public_key
   * @param privateKeyBytes  Private key from which account key pair will be generated.
   * If not specified, new key pair is going to be created.
   * If not specified, a new one will be generated from public key
   */
  constructor(privateKeyBytes: Uint8Array) {
    this.privateKey = privateKeyBytes
    this.publicKey = signUtil.ed25519.publicKeyCreate(privateKeyBytes)
    this.accountAddress = HexString.ensure(this.authKey().hex());
  }

  /**
   * This is the key by which Aptos account is referenced.
   * It is the 32-byte of the SHA-3 256 cryptographic hash
   * of the public key(s) concatenated with a signature scheme identifier byte
   * @returns Address associated with the given account
   */
  address(): HexString {
    return this.accountAddress;
  }

  /**
   * This key enables account owners to rotate their private key(s)
   * associated with the account without changing the address that hosts their account.
   * See here for more info: {@link https://aptos.dev/basics/basics-accounts#single-signer-authentication}
   * @returns Authentication key for the associated account
   */
  authKey(): HexString {
      const hash = base.sha3_256.create();
      hash.update(Buffer.from(this.publicKey));
      hash.update("\x00");
      return new HexString(base.toHex(hash.digest()))
  }

  /**
   * This key is generated with Ed25519 scheme.
   * Public key is used to check a signature of transaction, signed by given account
   * @returns The public key for the associated account
   */
  pubKey(): HexString {
    return HexString.ensure(base.toHex(this.publicKey));
  }

  /**
   * Signs specified `buffer` with account's private key
   * @param buffer A buffer to sign
   * @returns A signature HexString
   */
  signBuffer(buffer: Buffer): HexString {
    const signature = signUtil.ed25519.sign(buffer, this.privateKey);
    return HexString.ensure(base.toHex(signature).slice(0, 128));
  }

  /**
   * Signs specified `hexString` with account's private key
   * @param hexString A regular string or HexString to sign
   * @returns A signature HexString
   */
  signHexString(hexString: MaybeHexString): HexString {
    const toSign = HexString.ensure(hexString).toBuffer();
    return this.signBuffer(toSign);
  }

  /**
   * Derives account address, public key and private key
   * @returns AptosAccountObject instance.
   * @example An example of the returned AptosAccountObject object
   * ```
   * {
   *    address: "0xe8012714cd17606cee7188a2a365eef3fe760be598750678c8c5954eb548a591",
   *    publicKeyHex: "0xf56d8524faf79fbc0f48c13aeed3b0ce5dd376b4db93b8130a107c0a5e04ba04",
   *    privateKeyHex: `0x009c9f7c992a06cfafe916f125d8adb7a395fca243e264a8e56a4b3e6accf940
   *      d2b11e9ece3049ce60e3c7b4a1c58aebfa9298e29a30a58a67f1998646135204`
   * }
   * ```
   */
  toPrivateKeyObject(): AptosAccountObject {
    return {
      address: this.address().hex(),
      publicKeyHex: this.pubKey().hex(),
      privateKeyHex: HexString.fromUint8Array(this.privateKey.slice(0, 32)).hex(),
    };
  }
}
