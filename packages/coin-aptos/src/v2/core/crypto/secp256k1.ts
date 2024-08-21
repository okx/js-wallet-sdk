// Copyright © Aptos Foundation
// SPDX-License-Identifier: Apache-2.0

import { sha3_256 } from "@noble/hashes/sha3";
import { secp256k1 } from "@noble/curves/secp256k1";
import { HDKey } from "@scure/bip32";
import { Serializable, Deserializer, Serializer } from "../../bcs";
import { Hex } from "../hex";
import { HexInput } from "../../types";
import { isValidBIP44Path, mnemonicToSeed } from "./hdKey";
import { PrivateKey } from "./privateKey";
import { PublicKey, VerifySignatureArgs } from "./publicKey";
import { Signature } from "./signature";
import { convertSigningMessage } from "./utils";

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

  // region PublicKey
  /**
   * Verifies a Secp256k1 signature against the public key
   *
   * Note signatures are validated to be canonical as a malleability check
   */
  verifySignature(args: VerifySignatureArgs): boolean {
    const { message, signature } = args;
    if (!(signature instanceof Secp256k1Signature)) {
      return false;
    }
    const messageToVerify = convertSigningMessage(message);
    const messageBytes = Hex.fromHexInput(messageToVerify).toUint8Array();
    const messageSha3Bytes = sha3_256(messageBytes);
    const signatureBytes = signature.toUint8Array();
    return secp256k1.verify(signatureBytes, messageSha3Bytes, this.key.toUint8Array(), { lowS: true });
  }

  toUint8Array(): Uint8Array {
    return this.key.toUint8Array();
  }

  // endregion

  // region Serializable

  serialize(serializer: Serializer): void {
    serializer.serializeBytes(this.key.toUint8Array());
  }

  static deserialize(deserializer: Deserializer): Secp256k1PublicKey {
    const bytes = deserializer.deserializeBytes();
    return new Secp256k1PublicKey(bytes);
  }

  // endregion

  /**
   * @deprecated use `instanceof Secp256k1PublicKey` instead
   * @param publicKey
   */
  static isPublicKey(publicKey: PublicKey): publicKey is Secp256k1PublicKey {
    return publicKey instanceof Secp256k1PublicKey;
  }
}

/**
 * A Secp256k1 ecdsa private key
 */
export class Secp256k1PrivateKey extends Serializable implements PrivateKey {
  /**
   * Length of Secp256k1 ecdsa private key
   */
  static readonly LENGTH: number = 32;

  /**
   * The private key bytes
   * @private
   */
  private readonly key: Hex;

  // region Constructors

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
   * Generate a new random private key.
   *
   * @returns Secp256k1PrivateKey
   */
  static generate(): Secp256k1PrivateKey {
    const hexInput = secp256k1.utils.randomPrivateKey();
    return new Secp256k1PrivateKey(hexInput);
  }

  /**
   * Derives a private key from a mnemonic seed phrase.
   *
   * @param path the BIP44 path
   * @param mnemonics the mnemonic seed phrase
   *
   * @returns The generated key
   */
  static fromDerivationPath(path: string, mnemonics: string): Secp256k1PrivateKey {
    if (!isValidBIP44Path(path)) {
      throw new Error(`Invalid derivation path ${path}`);
    }
    return Secp256k1PrivateKey.fromDerivationPathInner(path, mnemonicToSeed(mnemonics));
  }

  /**
   * A private inner function so we can separate from the main fromDerivationPath() method
   * to add tests to verify we create the keys correctly.
   *
   * @param path the BIP44 path
   * @param seed the seed phrase created by the mnemonics
   *
   * @returns The generated key
   */
  private static fromDerivationPathInner(path: string, seed: Uint8Array): Secp256k1PrivateKey {
    const { privateKey } = HDKey.fromMasterSeed(seed).derive(path);
    // library returns privateKey as Uint8Array | null
    if (privateKey === null) {
      throw new Error("Invalid key");
    }

    return new Secp256k1PrivateKey(privateKey);
  }

  // endregion

  // region PrivateKey

  /**
   * Sign the given message with the private key.
   *
   * Note: signatures are canonical, and non-malleable
   *
   * @param message a message as a string or Uint8Array
   * @returns Signature
   */
  sign(message: HexInput): Secp256k1Signature {
    const messageToSign = convertSigningMessage(message);
    const messageBytes = Hex.fromHexInput(messageToSign);
    const messageHashBytes = sha3_256(messageBytes.toUint8Array());
    const signature = secp256k1.sign(messageHashBytes, this.key.toUint8Array(), { lowS: true });
    return new Secp256k1Signature(signature.toCompactRawBytes());
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

  // endregion

  // region Serializable

  serialize(serializer: Serializer): void {
    serializer.serializeBytes(this.toUint8Array());
  }

  static deserialize(deserializer: Deserializer): Secp256k1PrivateKey {
    const bytes = deserializer.deserializeBytes();
    return new Secp256k1PrivateKey(bytes);
  }

  // endregion

  /**
   * @deprecated use `instanceof Secp256k1PrivateKey` instead
   */
  static isPrivateKey(privateKey: PrivateKey): privateKey is Secp256k1PrivateKey {
    return privateKey instanceof Secp256k1PrivateKey;
  }
}

/**
 * A signature of a message signed using a Secp256k1 ecdsa private key
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

  // region Constructors

  /**
   * Create a new Signature instance from a Uint8Array or String.
   *
   * @param hexInput A HexInput (string or Uint8Array)
   */
  constructor(hexInput: HexInput) {
    super();
    const data = Hex.fromHexInput(hexInput);
    if (data.toUint8Array().length !== Secp256k1Signature.LENGTH) {
      throw new Error(
        `Signature length should be ${Secp256k1Signature.LENGTH}, received ${data.toUint8Array().length}`,
      );
    }
    this.data = data;
  }

  // endregion

  // region Signature

  toUint8Array(): Uint8Array {
    return this.data.toUint8Array();
  }

  // endregion

  // region Serializable

  serialize(serializer: Serializer): void {
    serializer.serializeBytes(this.data.toUint8Array());
  }

  static deserialize(deserializer: Deserializer): Secp256k1Signature {
    const hex = deserializer.deserializeBytes();
    return new Secp256k1Signature(hex);
  }

  // endregion
}
