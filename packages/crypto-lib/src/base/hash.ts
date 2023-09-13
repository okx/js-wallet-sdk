import { sha256 } from '@noble/hashes/sha256'
import { sha512 } from '@noble/hashes/sha512'
import { ripemd160 } from '@noble/hashes/ripemd160'

import { keccak_224, keccak_256, keccak_384, keccak_512, sha3_256, sha3_512} from "@noble/hashes/sha3";
import {assertIsBuffer} from "../abi/util";
import {blake2b} from "@noble/hashes/blake2b";
import {Input} from "@noble/hashes/utils";

export function doubleSha256(data: Input): Uint8Array {
    const t = sha256(data)
    return sha256(t)
}

export function hash160(data: Input): Uint8Array {
    const t = sha256(data)
    return ripemd160(t)
}

export const keccak = function(a: Buffer | Uint8Array | number[], bits: number = 256): Buffer {
    const b = Buffer.from(a)
    switch (bits) {
        case 224: {
            return Buffer.from(keccak_224(b))
        }
        case 256: {
            return Buffer.from(keccak_256(b))
        }
        case 384: {
            return Buffer.from(keccak_384(b))
        }
        case 512: {
            return Buffer.from(keccak_512(b))
        }
        default: {
            throw new Error(`Invald algorithm: keccak${bits}`)
        }
    }
}

/**
 * Creates Keccak-256 hash of the input, alias for keccak(a, 256).
 * @param a The input data (Buffer)
 */
export const keccak256 = function(a: Buffer | Uint8Array | number[]): Buffer {
    return keccak(a)
}

export function blake2(data: Uint8Array, bitLength: number, key: Uint8Array | undefined): Uint8Array {
    const byteLength = Math.ceil(bitLength / 8);
    return blake2b(data, {dkLen: byteLength, key: key})
}

export {sha256, sha512, ripemd160, sha3_256, sha3_512}