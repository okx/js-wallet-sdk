/**
 * Author:https://github.com/nbd-wtf/nostr-tools
 * */

import {
    base, secp256k1
} from "@okxweb3/crypto-lib";

// warning!!! If you want to run these two test case `encrypt`, you need to enable the next line of code.
// import * as crypto from "crypto";

// @ts-ignore
if (typeof crypto !== 'undefined' && !crypto.subtle && crypto.webcrypto) {
    // @ts-ignore
    crypto.subtle = crypto.webcrypto.subtle
}


export const nostrHdp = 'npub';

export const nsec = 'nsec';

export function npubEncode(hex: string): string {
    return encodeBytes('npub', hex)
}

export function nsecFromPrvKey(hex: string): string {
    return encodeBytes('nsec', hex)
}


function encodeBytes(prefix: string, hex: string): string {
    return base.toBech32(prefix, base.fromHex(hex))
}

export function decodeBytes(prefix: string, data: string): string {
    try {
        const [c, d] = base.fromBech32(data);
        if (prefix !== c) {
            throw 'invalid data'
        }
        return base.toHex(d, false)
    } catch (e) {
        console.log(e)
        throw e
    }
}


export async function encrypt(privkey: string, pubkey: string, text: string): Promise<string> {
    // @ts-ignore
    if (crypto == undefined) {
        throw new Error('crypto is null')
    }
    const key = secp256k1.getSharedSecret(decodeBytes('nsec', privkey), '02' + base.stripHexPrefix(pubkey))
    const normalizedKey = getNormalizedX(key)

    let iv = Uint8Array.from(base.randomBytes(16))
    let plaintext = base.toUtf8(text)
    // @ts-ignore
    let cryptoKey = await crypto.subtle.importKey('raw', normalizedKey, {name: 'AES-CBC'}, false, ['encrypt'])
    // @ts-ignore
    let ciphertext = await crypto.subtle.encrypt({name: 'AES-CBC', iv}, cryptoKey, plaintext)
    let ctb64 = base.toBase64(new Uint8Array(ciphertext))
    let ivb64 = base.toBase64(new Uint8Array(iv.buffer))

    return `${ctb64}?iv=${ivb64}`
}

export async function decrypt(privkey: string, pubkey: string, data: string): Promise<string> {
    let [ctb64, ivb64] = data.split('?iv=')
    let key = secp256k1.getSharedSecret(decodeBytes('nsec', privkey), '02' + base.stripHexPrefix(pubkey))
    let normalizedKey = getNormalizedX(key)
    // @ts-ignore
    let cryptoKey = await crypto.subtle.importKey('raw', normalizedKey, {name: 'AES-CBC'}, false, ['decrypt'])
    let ciphertext = base.fromBase64(ctb64)
    let iv = base.fromBase64(ivb64)
    // @ts-ignore
    let plaintext = await crypto.subtle.decrypt({name: 'AES-CBC', iv}, cryptoKey, ciphertext)
    let text = base.fromUtf8(plaintext)
    return text
}


function getNormalizedX(key: Uint8Array): Uint8Array {
    return key.slice(1, 33)
}