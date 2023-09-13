import { base } from "@okxweb3/crypto-lib";
import {NetWork} from "./const";
import {decodeAddress, encodeAddress, private2Public} from "./address";

export function getNewAddress(seed: string, ss58Format: NetWork) {
    const publicKey = private2Public(base.fromHex(seed))
    return encodeAddress(publicKey, ss58Format)
}
export function validateAddress(encoded: string, ss58Format: NetWork): boolean {
    try {
        decodeAddress(encoded, ss58Format)
        return true
    } catch (e) {
        return false
    }
}

export * from "./const"
export * from "./tx"
export * from "./types"