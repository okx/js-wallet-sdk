import { HexInput } from "../../types";
import { PublicKey } from "./publicKey";
import { Signature } from "./signature";

/**
 * An abstract representation of a private key.
 * It is associated to a signature scheme and provides signing capabilities.
 */
export interface PrivateKey {
  /**
   * Sign the given message with the private key.
   * @param message in HexInput format
   */
  sign(message: HexInput): Signature;

  /**
   * Derive the public key associated with the private key
   */
  publicKey(): PublicKey;

  /**
   * Get the private key in bytes (Uint8Array).
   */
  toUint8Array(): Uint8Array;
}
