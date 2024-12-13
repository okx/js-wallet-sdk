/**
 * The following methods are based on `ethereumjs/util`, thanks for their work
 * https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/util
 * Distributed under the Mozilla Public License Version 2.0 software license, see the accompanying
 * file LICENSE or https://opensource.org/license/mpl-2-0/.
 */

import assert from 'assert'
import {base, signUtil} from '@okxweb3/crypto-lib'
import { keccak, keccakFromString, rlphash } from './hash'
import {assertIsHexString, assertIsBuffer} from './helpers'
import { BNLike, toType, TypeOutput } from './types'

/**
 * Checks if the address is a valid. Accepts checksummed addresses too.
 */
export const isValidAddress = function(hexAddress: string): boolean {
  assertIsHexString(hexAddress)
  return /^0x[0-9a-fA-F]{40}$/.test(hexAddress)
}

/**
 * Returns a checksummed address.
 *
 * If a eip1191ChainId is provided, the chainId will be included in the checksum calculation. This
 * has the effect of checksummed addresses for one chain having invalid checksums for others.
 * For more details see [EIP-1191](https://eips.ethereum.org/EIPS/eip-1191).
 *
 * WARNING: Checksums with and without the chainId will differ. As of 2019-06-26, the most commonly
 * used variation in Ethereum was without the chainId. This may change in the future.
 */
export const toChecksumAddress = function(hexAddress: string, eip1191ChainId?: BNLike): string {
  assertIsHexString(hexAddress)
  const address = base.stripHexPrefix(hexAddress).toLowerCase()

  let prefix = ''
  if (eip1191ChainId) {
    const chainId = toType(eip1191ChainId, TypeOutput.BN)
    prefix = chainId.toString() + '0x'
  }

  const hash = keccakFromString(prefix + address).toString('hex')
  let ret = '0x'

  for (let i = 0; i < address.length; i++) {
    if (parseInt(hash[i], 16) >= 8) {
      ret += address[i].toUpperCase()
    } else {
      ret += address[i]
    }
  }

  return ret
}

/**
 * Returns the ethereum address of a given public key.
 * Accepts "Ethereum public keys" and SEC1 encoded keys.
 * @param pubKey The two points of an uncompressed key, unless sanitize is enabled
 * @param sanitize Accept public keys in other formats
 */
export const pubToAddress = function(pubKey: Buffer, sanitize: boolean = false): Buffer {
  assertIsBuffer(pubKey)
  if (sanitize && pubKey.length !== 64) {
    const up = signUtil.secp256k1.publicKeyConvert(pubKey, false)
    pubKey = Buffer.from(up!.slice(1))
  }
  assert(pubKey.length === 64)
  // Only take the lower 160bits of the hash
  return keccak(pubKey).slice(-20)
}
export const publicToAddress = pubToAddress

/**
 * Returns the ethereum public key of a given private key.
 * @param privateKey A private key must be 256 bits wide
 */
export const privateToPublic = function(privateKey: Buffer): Buffer {
  assertIsBuffer(privateKey)
  // skip the type flag and use the X, Y points
  return signUtil.secp256k1.publicKeyCreate(privateKey, false).slice(1)
}
export const privateToPublicRaw = function(privateKey: Buffer): Buffer {
  assertIsBuffer(privateKey)
  // skip the type flag and use the X, Y points
  return signUtil.secp256k1.publicKeyCreate(privateKey, false)
}

/**
 * Returns the ethereum address of a given private key.
 * @param privateKey A private key must be 256 bits wide
 */
export const privateToAddress = function(privateKey: Buffer): Buffer {
  return publicToAddress(privateToPublic(privateKey))
}
