/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 Blockstack Inc.
 * https://github.com/hirosystems/stacks.js/blob/main/LICENSE
 * */

import { base,secp256k1 } from '@okxweb3/crypto-lib';
const signSync = secp256k1.signSync
const utils = secp256k1.utils;
import {
  bigIntToBytes,
  bytesToHex,
  bytesToUtf8,
  concatBytes,
  FailedDecryptionError,
  hexToBigInt,
  hexToBytes,
  parseRecoverableSignatureVrs,
  signatureRsvToVrs,
  utf8ToBytes,
} from '../common';
import { getPublicKeyFromPrivate } from './keys';
import { encodeMessage, hashMessage } from './messageSignature';
import { hashSha256Sync, hashSha512Sync } from './sha2Hash';
import { getAesCbcOutputLength, getBase64OutputLength } from './utils';

/**
 * To use secp256k1.signSync set utils.hmacSha256Sync to a function using noble-hashes
 * secp256k1.signSync is the counter part of secp256k1.sign (async version)
 * secp256k1.signSync is used within signECDSA in this file
 * secp256k1.signSync is used to maintain the semantics of signECDSA while migrating from elliptic lib
 * utils.hmacSha256Sync docs: https://github.com/paulmillr/noble-secp256k1 readme file
 */
utils.hmacSha256Sync = (key: Uint8Array, ...msgs: Uint8Array[]) => {
  const h = base.hmac.create(base.sha256, key);
  msgs.forEach(msg => h.update(msg));
  return h.digest();
};

/**
 * Controls how the encrypted data bytes will be encoded as a string in the JSON payload.
 * Options:
 *    `hex` -- the legacy default, file size increase 100% (2x).
 *    `base64` -- file size increased ~33%.
 * @ignore
 */
export type CipherTextEncoding = 'hex' | 'base64';

/**
 * @ignore
 */
export type CipherObject = {
  iv: string;
  ephemeralPK: string;
  cipherText: string;
  /** If undefined then hex encoding is used for the `cipherText` string. */
  cipherTextEncoding?: CipherTextEncoding;
  mac: string;
  wasString: boolean;
};

/**
 * @ignore
 */
export type SignedCipherObject = {
  /** Hex encoded DER signature (up to 144 chars) */
  signature: string;
  /** Hex encoded public key (66 char length) */
  publicKey: string;
  /** The stringified json of a `CipherObject` */
  cipherText: string;
};

/**
 * @ignore
 */
export enum InvalidPublicKeyReason {
  InvalidFormat = 'InvalidFormat',
  IsNotPoint = 'IsNotPoint',
}

/**
 * @ignore
 */
export function hmacSha256(key: Uint8Array, content: Uint8Array): Uint8Array {
  return base.hmac(base.sha256, key, content);
}

/**
 * @ignore
 */
function equalsConstTime(a: Uint8Array, b: Uint8Array) {
  if (a.length !== b.length) {
    return false;
  }
  let res = 0;
  for (let i = 0; i < a.length; i++) {
    res |= a[i] ^ b[i];
  }
  return res === 0;
}

/**
 * @ignore
 */
function sharedSecretToKeys(sharedSecret: Uint8Array): {
  encryptionKey: Uint8Array;
  hmacKey: Uint8Array;
} {
  // generate mac and encryption key from shared secret
  const hashedSecret = hashSha512Sync(sharedSecret);
  return {
    encryptionKey: hashedSecret.slice(0, 32),
    hmacKey: hashedSecret.slice(32),
  };
}

/**
 * @ignore
 */
function allHexChars(maybe: string): boolean {
  return maybe.match(/^[0-9a-f]+$/i) !== null;
}

/**
 * @ignore
 */
function isValidPublicKey(pub: string): {
  result: boolean;
  reason: string | null;
  reason_data: string | null;
} {
  const invalidFormat = {
    result: false,
    reason_data: 'Invalid public key format',
    reason: InvalidPublicKeyReason.InvalidFormat,
  };
  const invalidPoint = {
    result: false,
    reason_data: 'Public key is not a point',
    reason: InvalidPublicKeyReason.IsNotPoint,
  };
  if (pub.length !== 66 && pub.length !== 130) return invalidFormat;

  const firstByte = pub.slice(0, 2);

  // uncompressed public key
  if (pub.length === 130 && firstByte !== '04') return invalidFormat;

  // compressed public key
  if (pub.length === 66 && firstByte !== '02' && firstByte !== '03') return invalidFormat;

  if (!allHexChars(pub)) return invalidFormat;

  try {
    // Converts public key to Point
    const point = secp256k1.Point.fromHex(pub);

    // Verify point on curve is valid if it conforms to equation
    // Validate the public key
    // Throws: Point is not on elliptic curve if point is not on curve
    point.assertValidity();

    // Validation passed
    return {
      result: true,
      reason_data: null,
      reason: null,
    };
  } catch (e) {
    return invalidPoint;
  }
}

/**
 * Hex encodes a 32-byte bigint instance.
 * The result string is zero padded and always 64 characters in length.
 * @ignore
 */
export function getHexFromBN(bnInput: bigint): string {
  const hexOut = bnInput.toString(16);
  if (hexOut.length === 64) {
    return hexOut;
  } else if (hexOut.length < 64) {
    // pad with leading zeros
    // the padStart function would require node 9
    const padding = '0'.repeat(64 - hexOut.length);
    return `${padding}${hexOut}`;
  } else {
    throw new Error('Generated a > 32-byte BN for encryption. Failing.');
  }
}

/**
 * Converts to zero padded 32 bytes
 * @ignore
 */
export function getBytesFromBN(bnInput: bigint): Uint8Array {
  // todo: remove method?
  const result = bigIntToBytes(bnInput, 32);
  if (result.byteLength !== 32) {
    throw new Error('Failed to generate a 32-byte Uint8Array');
  }
  return result;
}

/**
 * Get details about the JSON envelope size overhead for ciphertext payloads.
 * @ignore
 */
export function getCipherObjectWrapper(opts: {
  wasString: boolean;
  cipherTextEncoding: CipherTextEncoding;
}): {
  /** The stringified JSON string of an empty `CipherObject`. */
  payloadShell: string;
  /** Total string length of all the `CipherObject` values that always have constant lengths. */
  payloadValuesLength: number;
} {
  // Placeholder structure of the ciphertext payload, used to determine the
  // stringified JSON overhead length.
  const shell: CipherObject = {
    iv: '',
    ephemeralPK: '',
    mac: '',
    cipherText: '',
    wasString: !!opts.wasString,
  };
  if (opts.cipherTextEncoding === 'base64') {
    shell.cipherTextEncoding = 'base64';
  }
  // Hex encoded 16 bytes.
  const ivLength = 32;
  // Hex encoded, compressed EC pubkey of 33 bytes.
  const ephemeralPKLength = 66;
  // Hex encoded 32 byte hmac-sha256.
  const macLength = 64;
  return {
    payloadValuesLength: ivLength + ephemeralPKLength + macLength,
    payloadShell: JSON.stringify(shell),
  };
}

/**
 * Get details about the JSON envelope size overhead for signed ciphertext payloads.
 * @param payloadShell - The JSON stringified empty `CipherObject`
 * @ignore
 */
export function getSignedCipherObjectWrapper(payloadShell: string): {
  /** The stringified JSON string of an empty `SignedCipherObject`. */
  signedPayloadValuesLength: number;
  /** Total string length of all the `SignedCipherObject` values
   * that always have constant lengths */
  signedPayloadShell: string;
} {
  // Placeholder structure of the signed ciphertext payload, used to determine the
  // stringified JSON overhead length.
  const shell: SignedCipherObject = {
    signature: '',
    publicKey: '',
    cipherText: payloadShell,
  };
  // Hex encoded DER signature, up to 72 byte length.
  const signatureLength = 144;
  // Hex encoded 33 byte public key.
  const publicKeyLength = 66;
  return {
    signedPayloadValuesLength: signatureLength + publicKeyLength,
    signedPayloadShell: JSON.stringify(shell),
  };
}

/**
 * Fast function that determines the final ASCII string byte length of the
 * JSON stringified ECIES encrypted payload.
 * @ignore
 */
export function eciesGetJsonStringLength(opts: {
  contentLength: number;
  wasString: boolean;
  sign: boolean;
  cipherTextEncoding: CipherTextEncoding;
}): number {
  const { payloadShell, payloadValuesLength } = getCipherObjectWrapper(opts);

  // Calculate the AES output length given the input length.
  const cipherTextLength = getAesCbcOutputLength(opts.contentLength);

  // Get the encoded string length of the cipherText.
  let encodedCipherTextLength: number;
  if (!opts.cipherTextEncoding || opts.cipherTextEncoding === 'hex') {
    encodedCipherTextLength = cipherTextLength * 2;
  } else if (opts.cipherTextEncoding === 'base64') {
    encodedCipherTextLength = getBase64OutputLength(cipherTextLength);
  } else {
    throw new Error(`Unexpected cipherTextEncoding "${opts.cipherTextEncoding}"`);
  }

  if (!opts.sign) {
    // Add the length of the JSON envelope, ciphertext length, and length of const values.
    return payloadShell.length + payloadValuesLength + encodedCipherTextLength;
  } else {
    // Get the signed version of the JSON envelope
    const { signedPayloadShell, signedPayloadValuesLength } =
      getSignedCipherObjectWrapper(payloadShell);
    // Add length of the JSON envelope, ciphertext length, and length of the const values.
    return (
      signedPayloadShell.length +
      signedPayloadValuesLength +
      payloadValuesLength +
      encodedCipherTextLength
    );
  }
}

/**
 * Sign content using ECDSA
 *
 * @param {string} privateKey - secp256k1 private key hex string
 * @param {string | Uint8Array} content - content to sign
 * @return {Object} contains:
 * signature - Hex encoded DER signature
 * public key - Hex encoded private string taken from privateKey
 * @ignore
 */
export function signECDSA(
  privateKey: string,
  content: string | Uint8Array
): {
  publicKey: string;
  signature: string;
} {
  const contentBytes = typeof content === 'string' ? utf8ToBytes(content) : content;
  const publicKey = getPublicKeyFromPrivate(privateKey);
  const contentHash = hashSha256Sync(contentBytes);
  const signature = signSync(contentHash, privateKey);

  return {
    signature: bytesToHex(signature),
    publicKey,
  };
}

/**
 * Verify content using ECDSA
 * @param {String | Uint8Array} content - Content to verify was signed
 * @param {String} publicKey - secp256k1 private key hex string
 * @param {String} signature - Hex encoded DER signature
 * @return {Boolean} returns true when signature matches publickey + content, false if not
 * @ignore
 */
export function verifyECDSA(
  content: string | Uint8Array,
  publicKey: string,
  signature: string
): boolean {
  const contentBytes = typeof content === 'string' ? utf8ToBytes(content) : content;
  const contentHash = hashSha256Sync(contentBytes);
  // verify() is strict: true by default. High-s signatures are rejected, which mirrors libsecp behavior
  // Set verify options to strict: false, to support the legacy stacks implementations
  // Reference: https://github.com/paulmillr/noble-secp256k1/releases/tag/1.4.0
  return secp256k1.verify(signature, contentHash, publicKey, { strict: false });
}

interface VerifyMessageSignatureArgs {
  signature: string;
  message: string | Uint8Array;
  publicKey: string;
}

/**
 * Verify message signature (VRS format) with recoverable public key
 * @deprecated The Clarity compatible {@link verifyMessageSignatureRsv} is preferred
 */
export function verifyMessageSignature({
  signature,
  message,
  publicKey,
}: VerifyMessageSignatureArgs): boolean {
  // todo: remove method and pull body to `verifyMessageSignatureRsv`
  const { r, s } = parseRecoverableSignatureVrs(signature);
  const sig = new secp256k1.Signature(hexToBigInt(r), hexToBigInt(s));
  const hashedMsg = typeof message === 'string' ? hashMessage(message) : message;
  // verify() is strict: true by default. High-s signatures are rejected, which mirrors libsecp behavior
  // Set verify options to strict: false, to support the legacy stacks implementations
  // Reference: https://github.com/paulmillr/noble-secp256k1/releases/tag/1.4.0
  const verificationResult = secp256k1.verify(sig, hashedMsg, publicKey, { strict: false });

  // Additional Check for Legacy Prefix ++++++++++++++++++++++++++++++++++++++++
  if (verificationResult || typeof message !== 'string') return verificationResult;

  const LEGACY_PREFIX = '\x18Stacks Message Signing:\n';
  const legacyHash = base.sha256(encodeMessage(message, LEGACY_PREFIX));
  return secp256k1.verify(sig, legacyHash, publicKey, { strict: false });
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
}

/**
 * Verifies a Clarity compatible signed message using a public key. The
 * `signature` option needs to be in RSV format.
 */
export function verifyMessageSignatureRsv({
  signature,
  message,
  publicKey,
}: VerifyMessageSignatureArgs): boolean {
  return verifyMessageSignature({
    signature: signatureRsvToVrs(signature),
    message,
    publicKey,
  });
}
