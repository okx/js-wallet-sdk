/**
 * The following methods are based on `ethereumjs/util`, thanks for their work
 * https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/util
 * Distributed under the Mozilla Public License Version 2.0 software license, see the accompanying
 * file LICENSE or https://opensource.org/license/mpl-2-0/.
 */

const Buffer = require('buffer').Buffer
import {BN} from '@okxweb3/crypto-lib'

/**
 * The max integer that this VM can handle
 */
export const MAX_INTEGER: BN = new BN(
  'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
  16
)
/**
 * The max integer that the evm can handle (2^256-1)
 */
export const MAX_INTEGER_BI = BigInt(
    '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
)

export const MAX_UINT64 = new BN('ffffffffffffffff', 16)

/**
 * 2^64-1
 */
export const MAX_UINT64_BI = BigInt('0xffffffffffffffff')

/**
 * BigInt constants
 */

export const BIGINT_NEG1 = BigInt(-1)

export const BIGINT_0 = BigInt(0)
export const BIGINT_1 = BigInt(1)
export const BIGINT_2 = BigInt(2)
export const BIGINT_3 = BigInt(3)
export const BIGINT_7 = BigInt(7)
export const BIGINT_8 = BigInt(8)

export const BIGINT_27 = BigInt(27)
export const BIGINT_28 = BigInt(28)
export const BIGINT_31 = BigInt(31)
export const BIGINT_32 = BigInt(32)
export const BIGINT_64 = BigInt(64)

export const BIGINT_128 = BigInt(128)
export const BIGINT_255 = BigInt(255)
export const BIGINT_256 = BigInt(256)

export const BIGINT_96 = BigInt(96)
export const BIGINT_100 = BigInt(100)
export const BIGINT_160 = BigInt(160)
export const BIGINT_224 = BigInt(224)
export const BIGINT_2EXP96 = BigInt(79228162514264337593543950336)
export const BIGINT_2EXP160 = BigInt(1461501637330902918203684832716283019655932542976)
export const BIGINT_2EXP224 =
    BigInt(26959946667150639794667015087019630673637144422540572481103610249216)
export const BIGINT_2EXP256 = BIGINT_2 ** BIGINT_256