import * as elliptic from "../elliptic";
import {concatBytes} from "../base";
import BN from "bn.js";
const ed25519 = new elliptic.eddsa('ed25519');
const curve = ed25519.curve

export function sign (message: Uint8Array | Buffer, secretKey: Uint8Array | Buffer): Uint8Array {
    let pk = secretKey
    if(pk.length == 64) {
        pk = pk.slice(0, 32)
    }

    const key = ed25519.keyFromSecret(Array.from(pk));
    const signature = key.sign(Array.from(message)).toBytes();
    return Uint8Array.from(signature)
}

// note: publicKey and signature need be converted to an array
export function verify(message: Uint8Array | Buffer, signature: Uint8Array | Buffer, publicKey: Uint8Array | Buffer): boolean {
    const key = ed25519.keyFromPublic(Array.from(publicKey));
    return key.verify(Array.from(message), Array.from(signature))
}

export function publicKeyCreate (secretKey: Uint8Array | Buffer): Uint8Array {
    let pk = secretKey
    if(pk.length == 64) {
        pk = pk.slice(0, 32)
    }

    const key = ed25519.keyFromSecret(Array.from(pk));
    return Uint8Array.from(key.getPublic())
}

export function publicKeyVerify (pubkey: Uint8Array | Buffer) {
    const point = ed25519.decodePoint(Array.from(pubkey))
    return curve.validate(point)
}

export function privateKeyVerify (seckey: Uint8Array | Buffer) {
    const bn = new BN(Array.from(seckey))
    return bn.cmp(curve.n) < 0 && !bn.isZero()
}

// 32bytes
export function fromSeed(seed: Uint8Array | Buffer): { publicKey: Uint8Array, secretKey: Uint8Array } {
    const key = ed25519.keyFromSecret(Array.from(seed));
    const pk = Uint8Array.from(key.getPublic())
    return { publicKey: pk, secretKey: concatBytes(seed, pk)}
}

// 64bytes private key + public key
export function fromSecret(secretKey: Uint8Array | Buffer): {publicKey: Uint8Array, secretKey: Uint8Array} {
    const privateKey = secretKey.slice(0,32)
    const key = ed25519.keyFromSecret(Array.from(privateKey));
    return {publicKey: Uint8Array.from(key.getPublic()), secretKey: Uint8Array.from(privateKey)}
}

