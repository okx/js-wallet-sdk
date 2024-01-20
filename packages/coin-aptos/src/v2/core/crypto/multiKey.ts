import { Hex } from "../hex";
import { HexInput } from "../../types";
import { Deserializer } from "../../bcs/deserializer";
import { Serializer } from "../../bcs/serializer";
import { AnyPublicKey } from "./anyPublicKey";
import { AnySignature } from "./anySignature";
import { PublicKey } from "./asymmetricCrypto";

export class MultiKey extends PublicKey {
  /**
   * List of any public keys
   */
  public readonly publicKeys: AnyPublicKey[];

  /**
   * The minimum number of valid signatures required, for the number of public keys specified
   */
  public readonly signaturesRequired: number;

  constructor(args: { publicKeys: PublicKey[]; signaturesRequired: number }) {
    super();
    const { publicKeys, signaturesRequired } = args;

    // Validate number of public keys is greater than signature required
    if (signaturesRequired < 1) {
      throw new Error("The number of required signatures needs to be greater then 0");
    }

    // Validate number of public keys is greater than signature required
    if (publicKeys.length < signaturesRequired) {
      throw new Error(
        `Provided ${publicKeys.length} public keys is smaller than the ${signaturesRequired} required signatures`,
      );
    }

    const keys: AnyPublicKey[] = [];
    publicKeys.forEach((publicKey) => {
      if (publicKey instanceof AnyPublicKey) {
        keys.push(publicKey);
      } else {
        // if public key is instance of a legacy authentication key, i.e
        // Legacy Ed25519, convert it into AnyPublicKey
        keys.push(new AnyPublicKey(publicKey));
      }
    });

    this.publicKeys = keys;
    this.signaturesRequired = signaturesRequired;
  }

  toUint8Array(): Uint8Array {
    return this.bcsToBytes();
  }

  /**
   * Create a bitmap that holds the mapping from the original public keys
   * to the signatures passed in
   *
   * @param args.bits array of the index mapping to the matching public keys
   * @returns Uint8array bit map
   */
  createBitmap(args: { bits: number[] }): Uint8Array {
    const { bits } = args;
    // Bits are read from left to right. e.g. 0b10000000 represents the first bit is set in one byte.
    // The decimal value of 0b10000000 is 128.
    const firstBitInByte = 128;
    const bitmap = new Uint8Array([0, 0, 0, 0]);

    // Check if duplicates exist in bits
    const dupCheckSet = new Set();

    bits.forEach((bit: number, idx: number) => {
      if (idx + 1 > this.publicKeys.length) {
        throw new Error(`Signature index ${idx + 1} is out of public keys range, ${this.publicKeys.length}.`);
      }

      if (dupCheckSet.has(bit)) {
        throw new Error(`Duplicate bit ${bit} detected.`);
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

  /**
   * Hex string representation the multi key bytes
   *
   * @returns string
   */
  toString(): string {
    return Hex.fromHexInput(this.toUint8Array()).toString();
  }

  // TODO
  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
  verifySignature(args: { message: HexInput; signature: AnySignature }): boolean {
    throw new Error("not implemented");
  }

  serialize(serializer: Serializer): void {
    serializer.serializeVector(this.publicKeys);
    serializer.serializeU8(this.signaturesRequired);
  }

  static deserialize(deserializer: Deserializer): MultiKey {
    const keys = deserializer.deserializeVector(AnyPublicKey);
    const signaturesRequired = deserializer.deserializeU8();

    return new MultiKey({ publicKeys: keys, signaturesRequired });
  }
}
