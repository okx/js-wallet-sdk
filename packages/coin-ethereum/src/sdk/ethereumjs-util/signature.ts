/**
 * The following methods are based on `ethereumjs/util`, thanks for their work
 * https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/util
 * Distributed under the Mozilla Public License Version 2.0 software license, see the accompanying
 * file LICENSE or https://opensource.org/license/mpl-2-0/.
 */

import { keccak } from './hash'
import { assertIsBuffer } from './helpers'
import {base, BN, signUtil} from "@okxweb3/crypto-lib";
import {toType, TypeOutput} from "./types";
import {Buffer} from "buffer";
import {addHexPrefix, fromSigned, setLengthLeft, toUnsigned} from "./bytes";
import {padWithZeroes} from "../eth-sig-util";
import {intToHex} from "./util";
/**
 * Returns the keccak-256 hash of `message`, prefixed with the header used by the `eth_sign` RPC call.
 * The output of this function can be fed into `ecsign` to produce the same signature as the `eth_sign`
 * call for a given `message`, or fed to `ecrecover` along with a signature to recover the public key
 * used to produce the signature.
 */
export const hashPersonalMessage = function(message: Buffer): Buffer {
  assertIsBuffer(message)
  const prefix = Buffer.from(
    `\x19Ethereum Signed Message:\n${message.length.toString()}`,
    'utf-8'
  )
  return keccak(Buffer.concat([prefix, message]))
}

export function isValidSigRecovery(recovery: number | BN): boolean {
  const rec = new BN(recovery)
  return rec.eqn(0) || rec.eqn(1)
}

export function calculateSigRecovery(v: number, chainId?: number): BN {
  const vBN = toType(v, TypeOutput.BN)
  if (!chainId) {
    return vBN.subn(27)
  }
  const chainIdBN = toType(chainId, TypeOutput.BN)
  return vBN.sub(chainIdBN.muln(2).addn(35))
}

export function makeSignature(v: number, r: Buffer, s: Buffer): string {
  const rSig = fromSigned(r);
  const sSig = fromSigned(s);
  const vSig = v;
  const rStr = padWithZeroes(toUnsigned(rSig).toString('hex'), 64);
  const sStr = padWithZeroes(toUnsigned(sSig).toString('hex'), 64);
  const vStr = base.stripHexPrefix(intToHex(vSig));
  return addHexPrefix(rStr.concat(sStr, vStr));
}

export function ecdsaSign(msgHash: Buffer, privateKey: Buffer, chainId?: number): {v: number, r: Buffer, s: Buffer} {
  const {signature, recovery} = signUtil.secp256k1.sign(msgHash, privateKey) // { signature, recid: recovery }

  const r = Buffer.from(signature.slice(0, 32))
  const s = Buffer.from(signature.slice(32, 64))

  if (chainId && !Number.isSafeInteger(chainId)) {
    throw new Error(
        'The provided number is greater than MAX_SAFE_INTEGER (please use an alternative input type)'
    )
  }
  const v = chainId ? recovery + (chainId * 2 + 35) : recovery + 27
  return {v, r, s}
}

export function recoverFromSignature(
    msgHash: Buffer,
    v: number,
    r: Buffer,
    s: Buffer,
    chainId?: number
): Buffer {
  const signature = Buffer.concat([setLengthLeft(r, 32), setLengthLeft(s, 32)], 64)
  const recovery = calculateSigRecovery(v, chainId)
  if (!isValidSigRecovery(recovery)) {
    throw new Error('Invalid signature v value')
  }
  const senderPubKey = signUtil.secp256k1.recover(signature, recovery.toNumber(), msgHash, false)
  if(senderPubKey == null) {
    throw new Error('ecdsaRecover error')
  }

  const ret = signUtil.secp256k1.publicKeyConvert(senderPubKey, false)
  if(ret == null) {
    throw new Error('publicKeyConvert error')
  }
  return ret.slice(1)
}

