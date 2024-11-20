// Copyright © Aptos Foundation
// SPDX-License-Identifier: Apache-2.0

import { Deserializer, Serializer } from "../../bcs";
import { SigningScheme as AuthenticationKeyScheme } from "../../types";
import { AuthenticationKey } from "../authenticationKey";
import { Ed25519PublicKey, Ed25519Signature } from "./ed25519";
import { AccountPublicKey, VerifySignatureArgs } from "./publicKey";
import { Signature } from "./signature";

/**
 * Represents the public key of a K-of-N Ed25519 multi-sig transaction.
 */
export class MultiEd25519PublicKey extends AccountPublicKey {
  /**
   * Maximum number of public keys supported
   */
  static readonly MAX_KEYS = 32;

  /**
   * Minimum number of public keys needed
   */
  static readonly MIN_KEYS = 2;

  /**
   * Minimum threshold for the number of valid signatures required
   */
  static readonly MIN_THRESHOLD = 1;

  /**
   * List of Ed25519 public keys for this LegacyMultiEd25519PublicKey
   */
  public readonly publicKeys: Ed25519PublicKey[];

  /**
   * The minimum number of valid signatures required, for the number of public keys specified
   */
  public readonly threshold: number;

  /**
   * Public key for a K-of-N multi-sig transaction. A K-of-N multi-sig transaction means that for such a
   * transaction to be executed, at least K out of the N authorized signers have signed the transaction
   * and passed the check conducted by the chain.
   *
   * @see {@link
   * https://aptos.dev/integration/creating-a-signed-transaction/ | Creating a Signed Transaction}
   *
   * @param args.publicKeys A list of public keys
   * @param args.threshold At least "threshold" signatures must be valid
   */
  constructor(args: { publicKeys: Ed25519PublicKey[]; threshold: number }) {
    super();
    const { publicKeys, threshold } = args;

    // Validate number of public keys
    if (publicKeys.length > MultiEd25519PublicKey.MAX_KEYS || publicKeys.length < MultiEd25519PublicKey.MIN_KEYS) {
      throw new Error(
        `Must have between ${MultiEd25519PublicKey.MIN_KEYS} and ` +
          `${MultiEd25519PublicKey.MAX_KEYS} public keys, inclusive`,
      );
    }

    // Validate threshold: must be between 1 and the number of public keys, inclusive
    if (threshold < MultiEd25519PublicKey.MIN_THRESHOLD || threshold > publicKeys.length) {
      throw new Error(
        `Threshold must be between ${MultiEd25519PublicKey.MIN_THRESHOLD} and ${publicKeys.length}, inclusive`,
      );
    }

    this.publicKeys = publicKeys;
    this.threshold = threshold;
  }

  // region AccountPublicKey

  verifySignature(args: VerifySignatureArgs): boolean {
    const { message, signature } = args;
    if (!(signature instanceof MultiEd25519Signature)) {
      return false;
    }

    const indices: number[] = [];
    for (let i = 0; i < 4; i += 1) {
      for (let j = 0; j < 8; j += 1) {
        // eslint-disable-next-line no-bitwise
        const bitIsSet = (signature.bitmap[i] & (1 << (7 - j))) !== 0;
        if (bitIsSet) {
          const index = i * 8 + j;
          indices.push(index);
        }
      }
    }

    if (indices.length !== signature.signatures.length) {
      throw new Error("Bitmap and signatures length mismatch");
    }

    if (indices.length < this.threshold) {
      throw new Error("Not enough signatures");
    }

    for (let i = 0; i < indices.length; i += 1) {
      const publicKey = this.publicKeys[indices[i]];
      if (!publicKey.verifySignature({ message, signature: signature.signatures[i] })) {
        return false;
      }
    }
    return true;
  }

  authKey(): AuthenticationKey {
    return AuthenticationKey.fromSchemeAndBytes({
      scheme: AuthenticationKeyScheme.MultiEd25519,
      input: this.toUint8Array(),
    });
  }

  /**
   * Converts a PublicKeys into Uint8Array (bytes) with: bytes = p1_bytes | ... | pn_bytes | threshold
   */
  toUint8Array(): Uint8Array {
    const bytes = new Uint8Array(this.publicKeys.length * Ed25519PublicKey.LENGTH + 1);
    this.publicKeys.forEach((k: Ed25519PublicKey, i: number) => {
      bytes.set(k.toUint8Array(), i * Ed25519PublicKey.LENGTH);
    });

    bytes[this.publicKeys.length * Ed25519PublicKey.LENGTH] = this.threshold;

    return bytes;
  }

  // endregion

  // region Serializable

  serialize(serializer: Serializer): void {
    serializer.serializeBytes(this.toUint8Array());
  }

  static deserialize(deserializer: Deserializer): MultiEd25519PublicKey {
    const bytes = deserializer.deserializeBytes();
    const threshold = bytes[bytes.length - 1];

    const keys: Ed25519PublicKey[] = [];

    for (let i = 0; i < bytes.length - 1; i += Ed25519PublicKey.LENGTH) {
      const begin = i;
      keys.push(new Ed25519PublicKey(bytes.subarray(begin, begin + Ed25519PublicKey.LENGTH)));
    }
    return new MultiEd25519PublicKey({ publicKeys: keys, threshold });
  }

  // endregion
}

/**
 * Represents the signature of a K-of-N Ed25519 multi-sig transaction.
 */
export class MultiEd25519Signature extends Signature {
  /**
   * Maximum number of Ed25519 signatures supported
   */
  static MAX_SIGNATURES_SUPPORTED = 32;

  /**
   * Number of bytes in the bitmap representing who signed the transaction (32-bits)
   */
  static BITMAP_LEN: number = 4;

  /**
   * The list of underlying Ed25519 signatures
   */
  public readonly signatures: Ed25519Signature[];

  /**
   * 32-bit Bitmap representing who signed the transaction
   *
   * This is represented where each public key can be masked to determine whether the message was signed by that key.
   */
  public readonly bitmap: Uint8Array;

  /**
   * Signature for a K-of-N multi-sig transaction.
   *
   * @see {@link
   * https://aptos.dev/integration/creating-a-signed-transaction/#multisignature-transactions | Creating a Signed Transaction}
   *
   * @param args.signatures A list of signatures
   * @param args.bitmap 4 bytes, at most 32 signatures are supported. If Nth bit value is `1`, the Nth
   * signature should be provided in `signatures`. Bits are read from left to right.
   * Alternatively, you can specify an array of bitmap positions.
   * Valid position should range between 0 and 31.
   * @see MultiEd25519Signature.createBitmap
   */
  constructor(args: { signatures: Ed25519Signature[]; bitmap: Uint8Array | number[] }) {
    super();
    const { signatures, bitmap } = args;

    if (signatures.length > MultiEd25519Signature.MAX_SIGNATURES_SUPPORTED) {
      throw new Error(
        `The number of signatures cannot be greater than ${MultiEd25519Signature.MAX_SIGNATURES_SUPPORTED}`,
      );
    }
    this.signatures = signatures;

    if (!(bitmap instanceof Uint8Array)) {
      this.bitmap = MultiEd25519Signature.createBitmap({ bits: bitmap });
    } else if (bitmap.length !== MultiEd25519Signature.BITMAP_LEN) {
      throw new Error(`"bitmap" length should be ${MultiEd25519Signature.BITMAP_LEN}`);
    } else {
      this.bitmap = bitmap;
    }
  }

  // region AccountSignature

  /**
   * Converts a MultiSignature into Uint8Array (bytes) with `bytes = s1_bytes | ... | sn_bytes | bitmap`
   */
  toUint8Array(): Uint8Array {
    const bytes = new Uint8Array(this.signatures.length * Ed25519Signature.LENGTH + MultiEd25519Signature.BITMAP_LEN);
    this.signatures.forEach((k: Ed25519Signature, i: number) => {
      bytes.set(k.toUint8Array(), i * Ed25519Signature.LENGTH);
    });

    bytes.set(this.bitmap, this.signatures.length * Ed25519Signature.LENGTH);

    return bytes;
  }

  // endregion

  // region Serializable

  serialize(serializer: Serializer): void {
    serializer.serializeBytes(this.toUint8Array());
  }

  static deserialize(deserializer: Deserializer): MultiEd25519Signature {
    const bytes = deserializer.deserializeBytes();
    const bitmap = bytes.subarray(bytes.length - 4);

    const signatures: Ed25519Signature[] = [];

    for (let i = 0; i < bytes.length - bitmap.length; i += Ed25519Signature.LENGTH) {
      const begin = i;
      signatures.push(new Ed25519Signature(bytes.subarray(begin, begin + Ed25519Signature.LENGTH)));
    }
    return new MultiEd25519Signature({ signatures, bitmap });
  }

  // endregion

  /**
   * Helper method to create a bitmap out of the specified bit positions
   * @param args.bits The bitmap positions that should be set. A position starts at index 0.
   * Valid position should range between 0 and 31.
   * @example
   * Here's an example of valid `bits`
   * ```
   * [0, 2, 31]
   * ```
   * `[0, 2, 31]` means the 1st, 3rd and 32nd bits should be set in the bitmap.
   * The result bitmap should be 0b1010000000000000000000000000001
   *
   * @returns bitmap that is 32bit long
   */
  static createBitmap(args: { bits: number[] }): Uint8Array {
    const { bits } = args;
    // Bits are read from left to right. e.g. 0b10000000 represents the first bit is set in one byte.
    // The decimal value of 0b10000000 is 128.
    const firstBitInByte = 128;
    const bitmap = new Uint8Array([0, 0, 0, 0]);

    // Check if duplicates exist in bits
    const dupCheckSet = new Set();

    bits.forEach((bit: number, index) => {
      if (bit >= MultiEd25519Signature.MAX_SIGNATURES_SUPPORTED) {
        throw new Error(`Cannot have a signature larger than ${MultiEd25519Signature.MAX_SIGNATURES_SUPPORTED - 1}.`);
      }

      if (dupCheckSet.has(bit)) {
        throw new Error("Duplicate bits detected.");
      }

      if (index > 0 && bit <= bits[index - 1]) {
        throw new Error("The bits need to be sorted in ascending order.");
      }

      dupCheckSet.add(bit);

      const byteOffset = Math.floor(bit / 8);

      let byte = bitmap[byteOffset];

      // eslint-disable-next-line no-bitwise
      byte |= firstBitInByte >> bit % 8;

      bitmap[byteOffset] = byte;
    });

    return bitmap;
  }
}
