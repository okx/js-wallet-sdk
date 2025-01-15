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


function varintBufNum(n: number) {
    let buf;
    if (n < 253) {
        buf = Buffer.alloc(1);
        buf.writeUInt8(n, 0);
    } else if (n < 0x10000) {
        buf = Buffer.alloc(1 + 2);
        buf.writeUInt8(253, 0);
        buf.writeUInt16LE(n, 1);
    } else if (n < 0x100000000) {
        buf = Buffer.alloc(1 + 4);
        buf.writeUInt8(254, 0);
        buf.writeUInt32LE(n, 1);
    } else {
        buf = Buffer.alloc(1 + 8);
        buf.writeUInt8(255, 0);
        buf.writeInt32LE(n & -1, 1);
        buf.writeUInt32LE(Math.floor(n / 0x100000000), 5);
    }
    return buf;
}

const MAGIC_BYTES = Buffer.from('Bitcoin Signed Message:\n');


export function magicHash(message: string, messagePrefix?: string) {
    const messagePrefixBuffer = messagePrefix ? Buffer.from(messagePrefix,"utf8") : MAGIC_BYTES;
    const prefix1 = varintBufNum(messagePrefixBuffer.length);
    const messageBuffer = Buffer.from(message);
    const prefix2 = varintBufNum(messageBuffer.length);
    const buf = Buffer.concat([prefix1, messagePrefixBuffer, prefix2, messageBuffer]);
    return doubleSha256(buf);
}


export {sha256, sha512, ripemd160, sha3_256, sha3_512}