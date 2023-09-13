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

export const MAX_UINT64 = new BN('ffffffffffffffff', 16)
