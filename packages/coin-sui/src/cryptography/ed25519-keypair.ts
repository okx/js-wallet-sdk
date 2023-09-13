// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { Keypair } from './keypair';
import { Ed25519PublicKey } from './ed25519-publickey';
import { signUtil } from "@okxweb3/crypto-lib"
import {SignatureScheme} from "./signature";
declare const TextEncoder: any;

export const DEFAULT_ED25519_DERIVATION_PATH = "m/44'/784'/0'/0'/0'";

/**
 * Ed25519 Keypair data
 */
export interface Ed25519KeypairData {
  publicKey: Uint8Array;
  secretKey: Uint8Array;
}

/**
 * An Ed25519 Keypair used for signing transactions.
 */
export class Ed25519Keypair implements Keypair {
  private keypair: Ed25519KeypairData;

  /**
   * Create a new Ed25519 keypair instance.
   * Generate random keypair if no {@link Ed25519Keypair} is provided.
   *
   * @param keypair Ed25519 keypair
   */
  constructor(keypair: Ed25519KeypairData) {
      this.keypair = keypair;
  }

  /**
   * Get the key scheme of the keypair ED25519
   */
  getKeyScheme(): SignatureScheme {
    return 'ED25519';
  }

  /**
   * Create a Ed25519 keypair from a raw secret key byte array.
   *
   * This method should only be used to recreate a keypair from a previously
   * generated secret key.
   *
   * @throws error if the provided secret key is invalid and validation is not skipped.
   *
   * @param secretKey secret key byte array
   * @param options: skip secret key validation
   */
  static fromSecretKey(secretKey: Uint8Array, options?: { skipValidation?: boolean }): Ed25519Keypair {
    const secretKeyLength = secretKey.length;
    if (secretKeyLength != 64) {
      // Many users actually wanted to invoke fromSeed(seed: Uint8Array), especially when reading from keystore.
      if (secretKeyLength == 32) {
      throw new Error(
          'Wrong secretKey size. Expected 64 bytes, got 32. Similar function exists: fromSeed(seed: Uint8Array)'
      );
    }
      throw new Error(`Wrong secretKey size. Expected 64 bytes, got ${secretKeyLength}.`);
    }

    const obj = signUtil.ed25519.fromSecret(secretKey)
    if (!options || !options.skipValidation) {
      const encoder = new TextEncoder();
      const signData = encoder.encode('sui validation');
      const signature = signUtil.ed25519.sign(signData, obj.secretKey);
      if (!signUtil.ed25519.verify(signData, signature, obj.publicKey)) {
        throw new Error('provided secretKey is invalid');
      }
    }
    return new Ed25519Keypair(obj);
  }

  /**
   * Generate an Ed25519 keypair from a 32 byte seed.
   *
   * @param seed seed byte array
   */
  static fromSeed(seed: Uint8Array): Ed25519Keypair {
    const seedLength = seed.length;
    if (seedLength != 32) {
      throw new Error(`Wrong seed size. Expected 32 bytes, got ${seedLength}.`);
    }
    return new Ed25519Keypair( signUtil.ed25519.fromSeed(seed));
  }

  /**
   * The public key for this Ed25519 keypair
   */
  getPublicKey(): Ed25519PublicKey {
    return new Ed25519PublicKey(this.keypair.publicKey);
  }

  /**
   * Return the signature for the provided data using Ed25519.
   */
  signData(data: Uint8Array): Uint8Array {
    return signUtil.ed25519.sign(data, this.keypair.secretKey)
  }
  }