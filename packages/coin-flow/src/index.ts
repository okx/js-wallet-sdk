export * from "./account"
export * from "./enode"
export * from "./http"
export * from "./model"
export * from "./signature"
export * from "./tx"

import { base, signUtil } from "@okxweb3/crypto-lib"
export function validateAddress(address: string) {
   return base.isHexString(address, 8)
}

export function private2Public(privateHex: string): string {
   const pk = signUtil.p256.publicKeyCreate(base.fromHex(privateHex), false)
   return base.toHex(pk.slice(1))
}
