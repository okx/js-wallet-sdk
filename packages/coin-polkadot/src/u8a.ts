/**
 * The following methods are based on `polkadot-js`, thanks for their work
 * https://github.com/polkadot-js/common/tree/master/packages/util
 */
import {base, BN} from "@okxweb3/crypto-lib";
import {BL_16, BL_32, BN_ONE, BN_TWO, MAX_U16, MAX_U32, MAX_U8} from "./const";
import {HexString, U8aLike} from "./types";
import {assert, isBuffer, isHex, isU8a} from "./is";
import {hexToU8a} from "./hex";
import {stringToU8a} from "./string";
import {bnToBn, bnToU8a} from "./bn";

export function u8aConcat (...list: U8aLike[]): Uint8Array {
    const u8as = new Array<Uint8Array>(list.length);
    let length = 0;

    for (let i = 0; i < list.length; i++) {
        u8as[i] = u8aToU8a(list[i]);
        length += u8as[i].length;
    }

    return u8aConcatStrict(u8as, length);
}

export function u8aToU8a (value?: U8aLike | null): Uint8Array {
    return isU8a(value)
        ? value
        : isHex(value)
            ? hexToU8a(value)
            : isBuffer(value) || Array.isArray(value)
                ? new Uint8Array(value)
                : stringToU8a(value);
}

export function compactToU8a (value: BN | bigint | number): Uint8Array {
    const bn = bnToBn(value);

    if (bn.lte(MAX_U8)) {
        return new Uint8Array([bn.toNumber() << 2]);
    } else if (bn.lte(MAX_U16)) {
        return bnToU8a(bn.shln(2).iadd(BN_ONE), BL_16);
    } else if (bn.lte(MAX_U32)) {
        return bnToU8a(bn.shln(2).iadd(BN_TWO), BL_32);
    }

    const u8a = bnToU8a(bn);
    let length = u8a.length;

    // adjust to the minimum number of bytes
    while (u8a[length - 1] === 0) {
        length--;
    }

    assert(length >= 4, 'Invalid length, previous checks match anything less than 2^30');

    return u8aConcatStrict([
        // subtract 4 as minimum (also catered for in decoding)
        new Uint8Array([((length - 4) << 2) + 0b11]),
        u8a.subarray(0, length)
    ]);
}

export function u8aConcatStrict (u8as: Uint8Array[], length = 0): Uint8Array {
    let offset = 0;

    if (!length) {
        for (let i = 0; i < u8as.length; i++) {
            length += u8as[i].length;
        }
    }

    const result = new Uint8Array(length);

    for (let i = 0; i < u8as.length; i++) {
        result.set(u8as[i], offset);
        offset += u8as[i].length;
    }

    return result;
}

export function blake2AsU8a (data: HexString | Uint8Array | string, bitLength: 64 | 128 | 256 | 384 | 512 = 256, key?: Uint8Array | null): Uint8Array {
    const byteLength = Math.ceil(bitLength / 8);
    const u8a = u8aToU8a(data);
    return base.blake2b(u8a, { dkLen: byteLength, key: key || undefined });
}