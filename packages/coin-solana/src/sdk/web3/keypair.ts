/**
 * The following methods are based on `solana-web3.js`, thanks for their work
 * https://github.com/solana-labs/solana-web3.js/tree/master/packages/library-legacy/src
 */

import {PublicKey} from './publickey';
import {signUtil} from "@okxweb3/crypto-lib";

declare const TextEncoder: any;

/**
 * Keypair signer interface
 */
export interface Signer {
  publicKey: PublicKey;
  secretKey: Uint8Array;
}

/**
 * Ed25519 Keypair
 */
export interface Ed25519Keypair {
  publicKey: Uint8Array;
  secretKey: Uint8Array;
}

/**
 * An account keypair used for signing transactions.
 */
export class Keypair {
  private _keypair: Ed25519Keypair;

  /**
   * Create a new keypair instance.
   * Generate random keypair if no {@link Ed25519Keypair} is provided.
   *
   * @param keypair ed25519 keypair
   */
  constructor(keypair: Ed25519Keypair) {
    this._keypair = keypair;
  }

  /**
   * Create a keypair from a raw secret key byte array.
   *
   * This method should only be used to recreate a keypair from a previously
   * generated secret key. Generating keypairs from a random seed should be done
   * with the {@link Keypair.fromSeed} method.
   *
   * @throws error if the provided secret key is invalid and validation is not skipped.
   *
   * @param secretKey secret key byte array
   * @param options: skip secret key validation
   */
  static fromSecretKey(
    secretKey: Uint8Array,
    options?: {skipValidation?: boolean},
  ): Keypair {
    if (!options || !options.skipValidation) {
      const encoder = new TextEncoder();
      const signData = encoder.encode('@solana/web3.js-validation-v1');
      const signature = signUtil.ed25519.sign(signData, secretKey)
      const publicKey = signUtil.ed25519.publicKeyCreate(secretKey)
      if (!signUtil.ed25519.verify(signData, signature, publicKey)) {
        throw new Error('provided secretKey is invalid');
      }
    }
    const publicKey = signUtil.ed25519.publicKeyCreate(secretKey)
    return new Keypair({publicKey: publicKey,  secretKey: secretKey});
  }

  /**
   * The public key for this keypair
   */
  get publicKey(): PublicKey {
    return new PublicKey(this._keypair.publicKey);
  }

  /**
   * The raw secret key for this keypair
   */
  get secretKey(): Uint8Array {
    return this._keypair.secretKey;
  }
}
