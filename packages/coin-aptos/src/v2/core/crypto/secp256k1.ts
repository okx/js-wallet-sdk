// Copyright © Aptos Foundation
// SPDX-License-Identifier: Apache-2.0

import { sha3_256 } from "@noble/hashes/sha3";
// import { secp256k1 } from '@noble/curves/secp256k1';
import { secp256k1 } from '@okxweb3/crypto-lib';
import { PrivateKey, PublicKey, Signature } from "./asymmetricCrypto";
import { Deserializer, Serializer } from "../../bcs";
import { Hex } from "../hex";
import { HexInput } from "../../types";

/**
 * Represents the Secp256k1 ecdsa public key
 *
 * Secp256k1 authentication key is represented in the SDK as `AnyPublicKey`.
 */
export class Secp256k1PublicKey extends PublicKey {
  // Secp256k1 ecdsa public keys contain a prefix indicating compression and two 32-byte coordinates.
  static readonly LENGTH: number = 65;

  // Hex value of the public key
  private readonly key: Hex;

  /**
   * Create a new PublicKey instance from a Uint8Array or String.
   *
   * @param hexInput A HexInput (string or Uint8Array)
   */
  constructor(hexInput: HexInput) {
    super();

    const hex = Hex.fromHexInput(hexInput);
    if (hex.toUint8Array().length !== Secp256k1PublicKey.LENGTH) {
      throw new Error(`PublicKey length should be ${Secp256k1PublicKey.LENGTH}`);
    }
    this.key = hex;
  }

  /**
   * Get the public key in bytes (Uint8Array).
   *
   * @returns Uint8Array representation of the public key
   */
  toUint8Array(): Uint8Array {
    return this.key.toUint8Array();
  }

  /**
   * Get the public key as a hex string with the 0x prefix.
   *
   * @returns string representation of the public key
   */
  toString(): string {
    return this.key.toString();
  }

  /**
   * Verifies a signed data with a public key
   *
   * @param args.message message
   * @param args.signature The signature
   * @returns true if the signature is valid
   */
  verifySignature(args: { message: HexInput; signature: Secp256k1Signature }): boolean {
    const { message, signature } = args;
    const msgHex = Hex.fromHexInput(message).toUint8Array();
    const sha3Message = sha3_256(msgHex);
    const rawSignature = signature.toUint8Array();
    return secp256k1.verify(rawSignature, sha3Message, this.toUint8Array());
  }

  serialize(serializer: Serializer): void {
    serializer.serializeBytes(this.key.toUint8Array());
  }

  static deserialize(deserializer: Deserializer): Secp256k1PublicKey {
    const bytes = deserializer.deserializeBytes();
    return new Secp256k1PublicKey(bytes);
  }

  static load(deserializer: Deserializer): Secp256k1PublicKey {
    const bytes = deserializer.deserializeBytes();
    return new Secp256k1PublicKey(bytes);
  }

  static isPublicKey(publicKey: PublicKey): publicKey is Secp256k1PublicKey {
    return publicKey instanceof Secp256k1PublicKey;
  }
}

/**
 * A Secp256k1 ecdsa private key
 */
export class Secp256k1PrivateKey extends PrivateKey {
  /**
   * Length of Secp256k1 ecdsa private key
   */
  static readonly LENGTH: number = 32;

  /**
   * The private key bytes
   * @private
   */
  private readonly key: Hex;

  /**
   * Create a new PrivateKey instance from a Uint8Array or String.
   *
   * @param hexInput A HexInput (string or Uint8Array)
   */
  constructor(hexInput: HexInput) {
    super();

    const privateKeyHex = Hex.fromHexInput(hexInput);
    if (privateKeyHex.toUint8Array().length !== Secp256k1PrivateKey.LENGTH) {
      throw new Error(`PrivateKey length should be ${Secp256k1PrivateKey.LENGTH}`);
    }

    this.key = privateKeyHex;
  }

  /**
   * Get the private key in bytes (Uint8Array).
   *
   * @returns
   */
  toUint8Array(): Uint8Array {
    return this.key.toUint8Array();
  }

  /**
   * Get the private key as a hex string with the 0x prefix.
   *
   * @returns string representation of the private key
   */
  toString(): string {
    return this.key.toString();
  }

  /**
   * Sign the given message with the private key.
   *
   * @param message in HexInput format
   * @returns Signature
   */
  sign(message: HexInput): Secp256k1Signature {
    const msgHex = Hex.fromHexInput(message);
    const sha3Message = sha3_256(msgHex.toUint8Array());
    // const signature = secp256k1.sign(sha3Message, this.key.toUint8Array());
    // return new Secp256k1Signature(signature.toCompactRawBytes());
    const signature = secp256k1.signSync(sha3Message, this.key.toUint8Array());
    return new Secp256k1Signature(signature);
  }

  serialize(serializer: Serializer): void {
    serializer.serializeBytes(this.toUint8Array());
  }

  static deserialize(deserializer: Deserializer): Secp256k1PrivateKey {
    const bytes = deserializer.deserializeBytes();
    return new Secp256k1PrivateKey(bytes);
  }

  /**
   * Generate a new random private key.
   *
   * @returns Secp256k1PrivateKey
   */
  static generate(): Secp256k1PrivateKey {
    const hexInput = secp256k1.utils.randomPrivateKey();
    return new Secp256k1PrivateKey(hexInput);
  }

  /**
   * Derive the Secp256k1PublicKey from this private key.
   *
   * @returns Secp256k1PublicKey
   */
  publicKey(): Secp256k1PublicKey {
    const bytes = secp256k1.getPublicKey(this.key.toUint8Array(), false);
    return new Secp256k1PublicKey(bytes);
  }

  /**
   * Derives a private key from a mnemonic seed phrase.
   *
   * @param path the BIP44 path
   * @param mnemonics the mnemonic seed phrase
   *
   * @returns The generated key
   */
  // static fromDerivationPath(path: string, mnemonics: string): Secp256k1PrivateKey {
  //   if (!isValidBIP44Path(path)) {
  //     throw new Error(`Invalid derivation path ${path}`);
  //   }
  //   return Secp256k1PrivateKey.fromDerivationPathInner(path, mnemonicToSeed(mnemonics));
  // }

  /**
   * A private inner function so we can separate from the main fromDerivationPath() method
   * to add tests to verify we create the keys correctly.
   *
   * @param path the BIP44 path
   * @param seed the seed phrase created by the mnemonics
   *
   * @returns The generated key
   */
  // private static fromDerivationPathInner(path: string, seed: Uint8Array): Secp256k1PrivateKey {
  //   const { privateKey } = HDKey.fromMasterSeed(seed).derive(path);
  //   // library returns privateKey as Uint8Array | null
  //   if (privateKey === null) {
  //     throw new Error("Invalid key");
  //   }
  //
  //   return new Secp256k1PrivateKey(privateKey);
  // }

  static isPrivateKey(privateKey: PrivateKey): privateKey is Secp256k1PrivateKey {
    return privateKey instanceof Secp256k1PrivateKey;
  }
}

/**
 * A signature of a message signed using an Secp256k1 ecdsa private key
 */
export class Secp256k1Signature extends Signature {
  /**
   * Secp256k1 ecdsa signatures are 256-bit.
   */
  static readonly LENGTH = 64;

  /**
   * The signature bytes
   * @private
   */
  private readonly data: Hex;

  /**
   * Create a new Signature instance from a Uint8Array or String.
   *
   * @param hexInput A HexInput (string or Uint8Array)
   */
  constructor(hexInput: HexInput) {
    super();

    const hex = Hex.fromHexInput(hexInput);
    if (hex.toUint8Array().length !== Secp256k1Signature.LENGTH) {
      throw new Error(`Signature length should be ${Secp256k1Signature.LENGTH}, recieved ${hex.toUint8Array().length}`);
    }
    this.data = hex;
  }

  /**
   * Get the signature in bytes (Uint8Array).
   *
   * @returns Uint8Array representation of the signature
   */
  toUint8Array(): Uint8Array {
    return this.data.toUint8Array();
  }

  /**
   * Get the signature as a hex string with the 0x prefix.
   *
   * @returns string representation of the signature
   */
  toString(): string {
    return this.data.toString();
  }

  serialize(serializer: Serializer): void {
    serializer.serializeBytes(this.data.toUint8Array());
  }

  static deserialize(deserializer: Deserializer): Secp256k1Signature {
    const hex = deserializer.deserializeBytes();
    return new Secp256k1Signature(hex);
  }

  static load(deserializer: Deserializer): Secp256k1Signature {
    const bytes = deserializer.deserializeBytes();
    return new Secp256k1Signature(bytes);
  }

  static isSignature(signature: Signature): signature is Secp256k1Signature {
    return signature instanceof Secp256k1Signature;
  }
}
