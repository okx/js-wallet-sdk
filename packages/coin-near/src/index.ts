import { PublicKey } from './keypair';
import { base, signUtil } from "@okxweb3/crypto-lib"

export * from "./transaction"

export function getAddress(seedHex: string) {
   const publicKey = signUtil.ed25519.publicKeyCreate(base.fromHex(seedHex))
  return base.toHex(publicKey)
}

export function validateAddress(address: string) {
  return address.length >= 2 && address.length <= 64 && checkName(address)
}

export function checkName(name: string): boolean {
  const regex = new RegExp("^(([a-z\\d]+[\\-_])*[a-z\\d]+\\.)*([a-z\\d]+[\\-_])*[a-z\\d]+$");
  return regex.test(name)
}

export function publicKeyFromSeed(seedHex: string) {
  const publicKey = signUtil.ed25519.publicKeyCreate(base.fromHex(seedHex))
  return PublicKey.fromRaw(publicKey)
}
