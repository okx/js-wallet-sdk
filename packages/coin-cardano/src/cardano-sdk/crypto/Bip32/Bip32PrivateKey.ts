/* eslint-disable  no-bitwise */
import * as Bip32KeyDerivation from './Bip32KeyDerivation';
import { pbkdf2  } from '@noble/hashes/pbkdf2';
import { sha512 } from '@noble/hashes/sha512';

const SCALAR_INDEX = 0;
const SCALAR_SIZE = 32;
const PBKDF2_ITERATIONS = 4096;
const PBKDF2_KEY_SIZE = 96;

/**
 * clamp the scalar by:
 *
 *  1. clearing the 3 lower bits.
 *  2. clearing the three highest bits.
 *  3. setting the second-highest bit.
 *
 * @param scalar The clamped scalar.
 */
const clampScalar = (scalar: Buffer): Buffer => {
  scalar[0] &= 0b1111_1000;
  scalar[31] &= 0b0001_1111;
  scalar[31] |= 0b0100_0000;
  return scalar;
};

/**
 * Extract the scalar part (first 32 bytes) from the extended key.
 *
 * @param extendedKey The extended key.
 * @returns the scalar part of the extended key.
 */
const extendedScalar = (extendedKey: Uint8Array) => extendedKey.slice(SCALAR_INDEX, SCALAR_SIZE);

export const BIP32_ED25519_PRIVATE_KEY_LENGTH = 96;

/**
 * Bip32PrivateKey private key. This type of key have the ability to derive additional keys from them
 * following the BIP-32 derivation scheme variant called BIP32-Ed25519.
 *
 * @see <a href="https://input-output-hk.github.io/adrestia/static/Ed25519_BIP.pdf">
 *        BIP32-Ed25519: Hierarchical Deterministic Keys over a Non-linear Keyspace
 *      </a>
 */
export class Bip32PrivateKey {
  readonly #key: Uint8Array;

  /**
   * Initializes a new instance of the Bip32PrivateKey class.
   *
   * @param key The BIP-32 private key.
   */
  constructor(key: Uint8Array) {
    this.#key = key;
  }

  /**
   * Turns an initial entropy into a secure cryptographic master key.
   *
   * To generate a BIP32PrivateKey from a BIP39 recovery phrase it must be first converted to entropy following
   * the <a href="https://en.bitcoin.it/wiki/BIP_0039">BIP39 protocol</a>.
   *
   * The resulting extended Ed25519 secret key composed of:
   *   - 32 bytes: Ed25519 curve scalar from which few bits have been tweaked according to ED25519-BIP32
   *   - 32 bytes: Ed25519 binary blob used as IV for signing
   *
   * @param entropy Random stream of bytes generated from a BIP39 seed phrase.
   * @param password The second factor authentication password for the mnemonic phrase.
   * @returns The secret extended key.
   */
  static fromBip39Entropy(entropy: Buffer, password: string): Promise<Bip32PrivateKey> {
    return new Promise((resolve, reject) => {
      let xprv = pbkdf2(sha512, password, entropy, {c: PBKDF2_ITERATIONS, dkLen:PBKDF2_KEY_SIZE})
      xprv = clampScalar(Buffer.from(xprv));
      resolve(Bip32PrivateKey.fromBytes(xprv));
    });
  }

  /**
   * Initializes a new Bip32PrivateKey provided as a byte array.
   *
   * @param key The BIP-32 private key.
   */
  static fromBytes(key: Uint8Array) {
    if (key.length !== BIP32_ED25519_PRIVATE_KEY_LENGTH)
      throw new Error(
        `Key should be ${BIP32_ED25519_PRIVATE_KEY_LENGTH} bytes; however ${key.length} bytes were provided.`
      );
    return new Bip32PrivateKey(key);
  }

  /**
   * Initializes a new instance of the Bip32PrivateKey class from its key material provided as a hex string.
   *
   * @param key The key as a hex string.
   */
  static fromHex(key: string) {
    return Bip32PrivateKey.fromBytes(Buffer.from(key, 'hex'));
  }

  /**
   * Given a set of indices, this function computes the corresponding child extended key.
   *
   * # Security considerations
   *
   * hard derivation index cannot be soft derived with the public key.
   *
   * # Hard derivation vs Soft derivation
   *
   * If you pass an index below 0x80000000 then it is a soft derivation.
   * The advantage of soft derivation is that it is possible to derive the
   * public key too. I.e. derivation the private key with a soft derivation
   * index and then retrieving the associated public key is equivalent to
   * deriving the public key associated to the parent private key.
   *
   * Hard derivation index does not allow public key derivation.
   *
   * This is why deriving the private key should not fail while deriving
   * the public key may fail (if the derivation index is invalid).
   *
   * @param derivationIndices The derivation indices.
   * @returns The child BIP-32 key.
   */
  async derive(derivationIndices: number[]): Promise<Bip32PrivateKey> {
    let key = Buffer.from(this.#key);

    for (const index of derivationIndices) {
      key = Bip32KeyDerivation.derivePrivate(key, index);
    }

    return Bip32PrivateKey.fromBytes(key);
  }

  /** Gets the BIP-32 private key as a byte array. */
  bytes(): Uint8Array {
    return this.#key;
  }

  /** Gets the BIP-32 private key as a hex string. */
  hex(): string {
    return Buffer.from(this.#key).toString('hex');
  }
}
