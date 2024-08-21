import { Serializable } from "../../bcs";
import { HexInput } from "../../types";
import { AuthenticationKey } from "../authenticationKey";
import { Hex } from "../hex";
import { Signature } from "./signature";

/**
 * Arguments for verifying a signature
 */
export interface VerifySignatureArgs {
  message: HexInput;
  signature: Signature;
}

/**
 * An abstract representation of a public key.
 *
 * Provides a common interface for verifying any signature.
 */
export abstract class PublicKey extends Serializable {
  /**
   * Verifies that the private key associated with this public key signed the message with the given signature.
   * @param args.message The message that was signed
   * @param args.signature The signature to verify
   */
  abstract verifySignature(args: VerifySignatureArgs): boolean;

  /**
   * Get the raw public key bytes
   */
  abstract toUint8Array(): Uint8Array;

  /**
   * Get the public key as a hex string with a 0x prefix e.g. 0x123456...
   */
  toString(): string {
    const bytes = this.toUint8Array();
    return Hex.fromHexInput(bytes).toString();
  }
}

/**
 * An abstract representation of an account public key.
 *
 * Provides a common interface for deriving an authentication key.
 */
export abstract class AccountPublicKey extends PublicKey {
  /**
   * Get the authentication key associated with this public key
   */
  abstract authKey(): AuthenticationKey;
}
