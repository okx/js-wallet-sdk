import { Serializable } from "../../bcs";
import { Hex } from "../hex";

/**
 * An abstract representation of a crypto signature,
 * associated to a specific signature scheme e.g. Ed25519 or Secp256k1
 *
 * This is the product of signing a message directly from a PrivateKey
 * and can be verified against a CryptoPublicKey.
 */
export abstract class Signature extends Serializable {
  /**
   * Get the raw signature bytes
   */
  abstract toUint8Array(): Uint8Array;

  /**
   * Get the signature as a hex string with a 0x prefix e.g. 0x123456...
   */
  toString(): string {
    const bytes = this.toUint8Array();
    return Hex.fromHexInput(bytes).toString();
  }
}

/**
 * An abstract representation of an account signature,
 * associated to a specific authentication scheme e.g. Ed25519 or SingleKey
 *
 * This is the product of signing a message through an account,
 * and can be verified against an AccountPublicKey.
 */
// export abstract class AccountSignature extends Serializable {
//   /**
//    * Get the raw signature bytes
//    */
//   abstract toUint8Array(): Uint8Array;
//
//   /**
//    * Get the signature as a hex string with a 0x prefix e.g. 0x123456...
//    */
//   toString(): string {
//     const bytes = this.toUint8Array();
//     return Hex.fromHexInput(bytes).toString();
//   }
// }
