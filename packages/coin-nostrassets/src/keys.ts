/**
 * Author:https://github.com/nbd-wtf/nostr-tools
 * */
import {
    base, secp256k1
} from "@okxweb3/crypto-lib";

export function generatePrivateKey(): string {
    return base.toHex(secp256k1.utils.randomPrivateKey(),false)
}

export function getPublicKey(privateKey: string): string {
    return base.toHex(secp256k1.schnorr.getPublicKey(base.stripHexPrefix(privateKey)),false)
}
