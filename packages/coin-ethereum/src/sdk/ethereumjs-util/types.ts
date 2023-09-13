/**
 * The following methods are based on `ethereumjs/util`, thanks for their work
 * https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/util
 * Distributed under the Mozilla Public License Version 2.0 software license, see the accompanying
 * file LICENSE or https://opensource.org/license/mpl-2-0/.
 */

import {BN} from '@okxweb3/crypto-lib'
import { isHexString } from './util'
import { Address } from './address'
import { unpadBuffer, toBuffer, ToBufferInputTypes } from './bytes'

/*
 * A type that represents a BNLike input that can be converted to a BN.
 */
export type BNLike = BN | PrefixedHexString | number | Buffer

/*
 * A type that represents a BufferLike input that can be converted to a Buffer.
 */
export type BufferLike =
  | Buffer
  | Uint8Array
  | number[]
  | number
  | BN
  | TransformableToBuffer
  | PrefixedHexString

/*
 * A type that represents a `0x`-prefixed hex string.
 */
export type PrefixedHexString = string

/**
 * A type that represents an Address-like value.
 * To convert to address, use `new Address(toBuffer(value))`
 */
export type AddressLike = Address | Buffer | PrefixedHexString

/*
 * A type that represents an object that has a `toArray()` method.
 */
export interface TransformableToArray {
  toArray(): Uint8Array
  toBuffer?(): Buffer
}

/*
 * A type that represents an object that has a `toBuffer()` method.
 */
export interface TransformableToBuffer {
  toBuffer(): Buffer
  toArray?(): Uint8Array
}

/**
 * Convert BN to 0x-prefixed hex string.
 */
export function bnToHex(value: BN): PrefixedHexString {
  return `0x${value.toString(16)}`
}

/**
 * Checks provided Buffers for leading zeroes and throws if found.
 *
 * Examples:
 *
 * Valid values: 0x1, 0x, 0x01, 0x1234
 * Invalid values: 0x0, 0x00, 0x001, 0x0001
 *
 * Note: This method is useful for validating that RLP encoded integers comply with the rule that all
 * integer values encoded to RLP must be in the most compact form and contain no leading zero bytes
 * @param values An object containing string keys and Buffer values
 * @throws if any provided value is found to have leading zero bytes
 */
export const validateNoLeadingZeroes = function (values: { [key: string]: Buffer | undefined }) {
  for (const [k, v] of Object.entries(values)) {
    if (v !== undefined && v.length > 0 && v[0] === 0) {
      throw new Error(`${k} cannot have leading zeroes, received: ${v.toString('hex')}`)
    }
  }
}

/**
 * Convert value from BN to an unpadded Buffer
 * (useful for RLP transport)
 * @param value value to convert
 */
export function bnToUnpaddedBuffer(value: BN): Buffer {
  // Using `bn.toArrayLike(Buffer)` instead of `bn.toBuffer()`
  // for compatibility with browserify and similar tools
  return unpadBuffer(value.toArrayLike(Buffer))
}

/**
 * Convert value from BN to RLP (unpadded buffer)
 * @param value value to convert
 */
export function bnToRlp(value: BN): Buffer {
  // Using `bn.toArrayLike(Buffer)` instead of `bn.toBuffer()`
  // for compatibility with browserify and similar tools
  return unpadBuffer(value.toArrayLike(Buffer))
}

/**
 * Type output options
 */
export enum TypeOutput {
  Number,
  BN,
  Buffer,
  PrefixedHexString
}

export type TypeOutputReturnType = {
  [TypeOutput.Number]: number
  [TypeOutput.BN]: BN
  [TypeOutput.Buffer]: Buffer
  [TypeOutput.PrefixedHexString]: PrefixedHexString
}

/**
 * Convert an input to a specified type
 * @param input value to convert
 * @param outputType type to output
 */
export function toType<T extends TypeOutput>(
  input: ToBufferInputTypes,
  outputType: T
): TypeOutputReturnType[T] {
  if (typeof input === 'string' && !isHexString(input)) {
    throw new Error(`A string must be provided with a 0x-prefix, given: ${input}`)
  } else if (typeof input === 'number' && !Number.isSafeInteger(input)) {
    throw new Error(
      'The provided number is greater than MAX_SAFE_INTEGER (please use an alternative input type)'
    )
  }

  input = toBuffer(input)

  if (outputType === TypeOutput.Buffer) {
    return input as any
  } else if (outputType === TypeOutput.BN) {
    return new BN(input) as any
  } else if (outputType === TypeOutput.Number) {
    const bn = new BN(input)
    const max = new BN(Number.MAX_SAFE_INTEGER.toString())
    if (bn.gt(max)) {
      throw new Error(
        'The provided number is greater than MAX_SAFE_INTEGER (please use an alternative output type)'
      )
    }
    return bn.toNumber() as any
  } else {
    // outputType === TypeOutput.PrefixedHexString
    return `0x${input.toString('hex')}` as any
  }
}
