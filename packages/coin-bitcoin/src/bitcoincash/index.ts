import { hash160 } from '../bitcoinjs-lib/crypto';
import * as cashAddrJs from "./cashaddr"
import * as  payments from '../bitcoinjs-lib/payments';
import { Network } from '../bitcoinjs-lib';

export function GetBitcashAddressByHash(prefix: string, type: string, hash: Uint8Array) {
    return cashAddrJs.encode(prefix, type, hash)
}

export function GetBitcashAddressByPublicKey(prefix: string, type: string, publicKey: Uint8Array) {
  const hash = hash160(Buffer.from(publicKey))
  return GetBitcashAddressByHash(prefix, type, hash)
}

export function GetBitcashP2PkHAddressByPublicKey(publicKey: Uint8Array) {
  const hash = hash160(Buffer.from(publicKey))
  return GetBitcashAddressByHash("bitcoincash", "P2PKH", hash)
}

export function ValidateBitcashP2PkHAddress(address: string) {
  try {
    if(address.indexOf(":") === -1) {
      address = "bitcoincash:" + address;
    }
    const {prefix, type, hash} = cashAddrJs.decode(address)
    return type === "P2PKH" && hash.length === 20
  } catch (e) {
    return false;
  }
}

export function isCashAddress(address: string) {
  try {
    if(address.startsWith("bitcoincash:")) {
      return true
    }
    address = "bitcoincash:" + address;
    cashAddrJs.decode(address)
    return true
  } catch (e) {
    return false;
  }
}

export function convert2LegacyAddress(address: string, network: Network) {
  if(address.indexOf(":") === -1) {
    address = "bitcoincash:" + address;
  }
  const {type, hash} = cashAddrJs.decode(address)
  if(type == "P2PKH") {
    const result = payments.p2pkh({ hash: Buffer.from(hash), network });
    return result.address!
  } else if(type == "P2SH") {
    const result = payments.p2sh({ hash: Buffer.from(hash), network });
    return result.address!
  } else {
    throw new Error("convert2LegacyAddress error")
  }
}
