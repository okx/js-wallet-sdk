/**
 * The following methods are based on `ethereumjs/util`, thanks for their work
 * https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/util
 * Distributed under the Mozilla Public License Version 2.0 software license, see the accompanying
 * file LICENSE or https://opensource.org/license/mpl-2-0/.
 */

import {BN} from '@okxweb3/crypto-lib'
import {base} from "@okxweb3/crypto-lib";
import { intToBuffer, padToEven, isHexString } from './util'
import { PrefixedHexString, TransformableToArray, TransformableToBuffer } from './types'
import { assertIsBuffer, assertIsArray, assertIsHexString, assertIsBytes } from './helpers'
import {
  hexToBytes as nobleH2B,
  bytesToHex as _bytesToUnprefixedHex,
} from 'ethereum-cryptography/utils.js'
import {BIGINT_0} from "./constants";

export const bytesToUnprefixedHex = _bytesToUnprefixedHex

/**
 * Returns a buffer filled with 0s.
 * @param bytes the number of bytes the buffer should be
 */
export const zeros = function(bytes: number): Buffer {
  return Buffer.allocUnsafe(bytes).fill(0)
}

/**
 * Pads a `Buffer` with zeros till it has `length` bytes.
 * Truncates the beginning or end of input if its length exceeds `length`.
 * @param msg the value to pad (Buffer)
 * @param length the number of bytes the output should be
 * @param right whether to start padding form the left or right
 * @return (Buffer)
 */
const setLength = function(msg: Buffer, length: number, right: boolean) {
  const buf = zeros(length)
  if (right) {
    if (msg.length < length) {
      msg.copy(buf)
      return buf
    }
    return msg.slice(0, length)
  } else {
    if (msg.length < length) {
      msg.copy(buf, length - msg.length)
      return buf
    }
    return msg.slice(-length)
  }
}

/**
 * Pads a `Uint8Array` with zeros till it has `length` bytes.
 * Truncates the beginning or end of input if its length exceeds `length`.
 * @param {Uint8Array} msg the value to pad
 * @param {number} length the number of bytes the output should be
 * @param {boolean} right whether to start padding form the left or right
 * @return {Uint8Array}
 */
const setLengthU8A = (msg: Uint8Array, length: number, right: boolean): Uint8Array => {
  if (right) {
    if (msg.length < length) {
      return new Uint8Array([...msg, ...new Uint8Array(length - msg.length)])
    }
    return msg.subarray(0, length)
  } else {
    if (msg.length < length) {
      return new Uint8Array([...new Uint8Array(length - msg.length), ...msg])
    }
    return msg.subarray(-length)
  }
}

/**
 * Left Pads a `Buffer` with leading zeros till it has `length` bytes.
 * Or it truncates the beginning if it exceeds.
 * @param msg the value to pad (Buffer)
 * @param length the number of bytes the output should be
 * @return (Buffer)
 */
export const setLengthLeft = function(msg: Buffer, length: number) {
  assertIsBuffer(msg)
  return setLength(msg, length, false)
}

/**
 * Trims leading zeros from a `Buffer`, `String` or `Number[]`.
 * @param a (Buffer|Array|String)
 * @return (Buffer|Array|String)
 */
export const stripZeros = function(a: any): Buffer | Uint8Array | number[] | string {
  let first = a[0]
  while (a.length > 0 && first.toString() === '0') {
    a = a.slice(1)
    first = a[0]
  }
  return a
}

/**
 * Trims leading zeros from a `Buffer`.
 * @param a (Buffer)
 * @return (Buffer)
 */
export const unpadBuffer = function(a: Buffer): Buffer {
  assertIsBuffer(a)
  return stripZeros(a) as Buffer
}

/**
 * Trims leading zeros from an `Array` (of numbers).
 * @param a (number[])
 * @return (number[])
 */
export const unpadArray = function(a: number[]): number[] {
  assertIsArray(a)
  return stripZeros(a) as number[]
}

export type ToBufferInputTypes =
  | PrefixedHexString
  | number
  | BN
  | Buffer
  | Uint8Array
  | number[]
  | TransformableToArray
  | TransformableToBuffer
  | null
  | undefined

/**
 * Attempts to turn a value into a `Buffer`.
 * Inputs supported: `Buffer`, `String`, `Number`, null/undefined, `BN` and other objects with a `toArray()` or `toBuffer()` method.
 * @param v the value
 */
export const toBuffer = function(v: ToBufferInputTypes): Buffer {
  if (v === null || v === undefined) {
    return Buffer.allocUnsafe(0)
  }

  if (Buffer.isBuffer(v)) {
    return Buffer.from(v)
  }

  if (Array.isArray(v) || v instanceof Uint8Array) {
    return Buffer.from(v as Uint8Array)
  }

  if (typeof v === 'string') {
    if (!isHexString(v)) {
      throw new Error(
        `Cannot convert string to buffer. toBuffer only supports 0x-prefixed hex strings and this string was given: ${v}`
      )
    }
    return Buffer.from(padToEven(base.stripHexPrefix(v)), 'hex')
  }

  if (typeof v === 'number') {
    return intToBuffer(v)
  }

  if (BN.isBN(v)) {
    return v.toArrayLike(Buffer)
  }

  if (v.toArray) {
    // converts a BN to a Buffer
    return Buffer.from(v.toArray())
  }

  if (v.toBuffer) {
    return Buffer.from(v.toBuffer())
  }

  throw new Error('invalid type')
}

/**
 * Converts a `Buffer` into a `0x`-prefixed hex `String`.
 * @param buf `Buffer` object to convert
 */
export const bufferToHex = function(buf: Buffer): string {
  buf = toBuffer(buf)
  return '0x' + buf.toString('hex')
}

/**
 * Interprets a `Buffer` as a signed integer and returns a `BN`. Assumes 256-bit numbers.
 * @param num Signed integer value
 */
export const fromSigned = function(num: Buffer): BN {
  return new BN(num).fromTwos(256)
}

/**
 * Converts a `BN` to an unsigned integer and returns it as a `Buffer`. Assumes 256-bit numbers.
 * @param num
 */
export const toUnsigned = function(num: BN): Buffer {
  return Buffer.from(num.toTwos(256).toArray())
}

/**
 * Adds "0x" to a given `String` if it does not already start with "0x".
 */
export const addHexPrefix = function(str: string): string {
  if (typeof str !== 'string') {
    return str
  }

  return base.isHexPrefixed(str) ? str : '0x' + str
}

/**
 * Converts a {@link PrefixedHexString} to a {@link Uint8Array}
 * @param {PrefixedHexString} hex The 0x-prefixed hex string to convert
 * @returns {Uint8Array} The converted bytes
 * @throws If the input is not a valid 0x-prefixed hex string
 */
export const hexToBytes = (hex: string) => {
  if (!hex.startsWith('0x')) throw new Error('input string must be 0x prefixed')
  return nobleH2B(padToEven(base.stripHexPrefix(hex)))
}

export const bytesToHex = (bytes: Uint8Array): PrefixedHexString => {
  if (bytes === undefined || bytes.length === 0) return '0x'
  const unprefixedHex = bytesToUnprefixedHex(bytes)
  return ('0x' + unprefixedHex) as PrefixedHexString
}

/**
 * Trims leading zeros from a `Uint8Array`.
 * @param {Uint8Array} a
 * @return {Uint8Array}
 */
export const unpadBytes = (a: Uint8Array): Uint8Array => {
  assertIsBytes(a)
  return stripZeros(a) as Uint8Array
}

/**
 * This mirrors the functionality of the `ethereum-cryptography` export except
 * it skips the check to validate that every element of `arrays` is indeed a `uint8Array`
 * Can give small performance gains on large arrays
 * @param {Uint8Array[]} arrays an array of Uint8Arrays
 * @returns {Uint8Array} one Uint8Array with all the elements of the original set
 * works like `Buffer.concat`
 */
export const concatBytes = (...arrays: Uint8Array[]): Uint8Array => {
  if (arrays.length === 1) return arrays[0]
  const length = arrays.reduce((a, arr) => a + arr.length, 0)
  const result = new Uint8Array(length)
  for (let i = 0, pad = 0; i < arrays.length; i++) {
    const arr = arrays[i]
    result.set(arr, pad)
    pad += arr.length
  }
  return result
}

/**
 * Checks provided Uint8Array for leading zeroes and throws if found.
 *
 * Examples:
 *
 * Valid values: 0x1, 0x, 0x01, 0x1234
 * Invalid values: 0x0, 0x00, 0x001, 0x0001
 *
 * Note: This method is useful for validating that RLP encoded integers comply with the rule that all
 * integer values encoded to RLP must be in the most compact form and contain no leading zero bytes
 * @param values An object containing string keys and Uint8Array values
 * @throws if any provided value is found to have leading zero bytes
 */
export const validateNoLeadingZeroes = (values: { [key: string]: Uint8Array | Buffer | undefined }) => {
  for (const [k, v] of Object.entries(values)) {
    if (v !== undefined && v.length > 0 && v[0] === 0) {
      throw new Error(`${k} cannot have leading zeroes, received: ${bytesToHex(v)}`)
    }
  }
}

// BigInt cache for the numbers 0 - 256*256-1 (two-byte bytes)
const BIGINT_CACHE: bigint[] = []
for (let i = 0; i <= 256 * 256 - 1; i++) {
  BIGINT_CACHE[i] = BigInt(i)
}

/**
 * Converts a {@link Uint8Array} to a {@link bigint}
 * @param {Uint8Array} bytes the bytes to convert
 * @returns {bigint}
 */
export const bytesToBigInt = (bytes: Uint8Array, littleEndian = false): bigint => {
  if (littleEndian) {
    bytes.reverse()
  }
  const hex = bytesToHex(bytes)
  if (hex === '0x') {
    return BIGINT_0
  }
  if (hex.length === 4) {
    // If the byte length is 1 (this is faster than checking `bytes.length === 1`)
    return BIGINT_CACHE[bytes[0]]
  }
  if (hex.length === 6) {
    return BIGINT_CACHE[bytes[0] * 256 + bytes[1]]
  }
  return BigInt(hex)
}