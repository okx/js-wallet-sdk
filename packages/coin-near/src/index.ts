import {PublicKey} from './keypair';
import {base, signUtil} from "@okxweb3/crypto-lib"
import {SignTxError} from "@okxweb3/coin-base";

export * from "./transaction"
export * from "./NearWallet"

export function getAddress(seedHex: string) {
    let ok = checkPrivateKey(seedHex);
    if (!ok) {
        throw new Error("invalid key");
    }
    let pri = seedHex;
    if (seedHex.startsWith("0x") || seedHex.startsWith("0X")) {
        pri = seedHex.substring(2);
    }
    // const publicKey = signUtil.ed25519.publicKeyCreate(base.fromHex(seedHex))
    const publicKey = signUtil.ed25519.publicKeyCreate(base.fromHex(pri))
    return base.toHex(publicKey)
}

export function checkPrivateKey(seedHex: string) {
    if (!seedHex) {
        throw new Error("invalid key");
    }
    let pri = "";
    if (seedHex.startsWith("0x") || seedHex.startsWith("0X")) {
        pri = seedHex.substring(2)
        if (!base.isHexString("0x" + pri)) {
            throw new Error("invalid key");
        }
        if (seedHex.length != 130 && seedHex.length != 66) {
            throw new Error("invalid key");
        }
    } else {
        if (!base.isHexString("0x" + seedHex)) {
            throw new Error("invalid key");
        }
        if (seedHex.length != 128 && seedHex.length != 64) {
            throw new Error("invalid key");
        }
        pri = seedHex;
    }
    const buf = base.fromHex(pri);
    if (buf.length != 64 && buf.length != 32 || buf.every(byte=>byte===0)) {
        throw new Error("invalid key");
    }
    return true
}

export function getPubkey(seedHex: string) {
    checkPrivateKey(seedHex);
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
