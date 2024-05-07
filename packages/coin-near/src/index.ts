import {PublicKey} from './keypair';
import {base, signUtil} from "@okxweb3/crypto-lib"
import {SignTxError} from "@okxweb3/coin-base";

export * from "./transaction"
export * from "./NearWallet"

export function getAddress(seedHex: string) {
    const publicKey = signUtil.ed25519.publicKeyCreate(base.fromHex(seedHex))
    return base.toHex(publicKey)
}

export function getPubkey(seedHex: string) {
    const publicKey = signUtil.ed25519.publicKeyCreate(base.fromHex(seedHex))
    return "ed25519:" + base.toBase58(publicKey)
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

export function publicKeyFromBase58(pubkey: string) {
    const parts = pubkey.split(':');
    if (parts.length != 2 || parts[0] != 'ed25519') {
        throw SignTxError
    }
    return PublicKey.fromRaw(base.fromBase58(parts[1]))
}
