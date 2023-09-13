/**
 * The following methods are based on `ethereumjs/util`, thanks for their work
 * https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/util
 * Distributed under the Mozilla Public License Version 2.0 software license, see the accompanying
 * file LICENSE or https://opensource.org/license/mpl-2-0/.
 */

import * as rlp from './rlp'
import { toBuffer, setLengthLeft } from './bytes'
import { assertIsString, assertIsBuffer, assertIsArray, assertIsHexString } from './helpers'
import { base } from '@okxweb3/crypto-lib'
import {Buffer} from "buffer";

export const keccak = base.keccak

/**
 * Creates Keccak-256 hash of the input, alias for keccak(a, 256).
 * @param a The input data (Buffer)
 */
export const keccak256 = function(a: Buffer | Uint8Array): Buffer {
  return keccak(a, 256)
}

/**
 * Creates Keccak hash of a utf-8 string input
 * @param a The input data (String)
 * @param bits (number = 256) The Keccak width
 */
export const keccakFromString = function(a: string, bits: number = 256) {
  assertIsString(a)
  const buf = Buffer.from(a, 'utf8')
  return keccak(buf, bits)
}

/**
 * Creates SHA-3 hash of the RLP encoded version of the input.
 * @param a The input data
 */
export const rlphash = function(a: rlp.Input): Buffer {
  return keccak(rlp.encode(a))
}
