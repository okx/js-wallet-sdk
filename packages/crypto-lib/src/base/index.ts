export * from "./base58"
export * from "./base58Check"
export * from "./bech32"
export * from "./hex"
export * from "./base64"
export * from "./hash"
export * from "./hmac"
export * from "./utf8"
export * from './bignumber-plus'
export * from './precondtion'
export * as rlp from '../abi/rlp'
export * from './helper'
export * as md5 from "./md5"

export * from "@scure/base"
export * from "@noble/hashes/sha256"
export * from "@noble/hashes/hmac"
export * from "@noble/hashes/ripemd160"
export * from "@noble/hashes/sha512"
export * from "@noble/hashes/sha3"
export * from "@noble/hashes/blake2b"
export * from "@noble/hashes/blake2s"
export * from "@noble/hashes/pbkdf2"
export * from "@noble/hashes/scrypt"
export * from "@noble/hashes/blake3"

import * as utils from "@noble/hashes/utils";

const _randomBytes = require("randombytes")

export function reverseBuffer(buffer: Buffer): Buffer {
    if (buffer.length < 1) return buffer;
    let j = buffer.length - 1;
    let tmp = 0;
    for (let i = 0; i < buffer.length / 2; i++) {
        tmp = buffer[i];
        buffer[i] = buffer[j];
        buffer[j] = tmp;
        j--;
    }
    return buffer;
}

export function concatBytes(b1: Uint8Array | Buffer, b2: Uint8Array | Buffer): Uint8Array {
    return utils.concatBytes(Uint8Array.from(b1), Uint8Array.from(b2))
}

export function randomBytes(length: Number): Buffer {
    return _randomBytes(length)
}


