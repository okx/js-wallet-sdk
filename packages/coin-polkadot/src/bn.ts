/**
 * The following methods are based on `polkadot-js`, thanks for their work
 * https://github.com/polkadot-js/common/tree/master/packages/util
 */
import {BN} from "@okxweb3/crypto-lib";
import {hexStripPrefix} from "./hex";
import {HexString, NumberOptions, ToBigInt, ToBn, ToBnOptions} from "./types";
import {isBigInt, isBoolean, isHex, isNumber, isToBigInt, isToBn} from "./is";
import {objectSpread} from "./object";

export function bnToBn <ExtToBn extends ToBigInt | ToBn> (value?: HexString | ExtToBn | BN | bigint | string | number | null): BN {
    return value
        ? BN.isBN(value)
            ? value
            : isHex(value)
                ? hexToBn(value.toString())
                : isBigInt(value)
                    ? new BN(value.toString())
                    : isToBn(value)
                        ? value.toBn()
                        : isToBigInt(value)
                            ? new BN(value.toBigInt().toString())
                            : new BN(value)
        : new BN(0);
}

const DEFAULT_OPTS: NumberOptions = { bitLength: -1, isLe: true, isNegative: false };

export function bnToU8a <ExtToBn extends ToBn> (value?: ExtToBn | BN | bigint | number | null, arg1: number | NumberOptions = DEFAULT_OPTS, arg2?: boolean): Uint8Array {
    const { bitLength, isLe, isNegative }: NumberOptions = objectSpread(
        { bitLength: -1, isLe: true, isNegative: false },
        isNumber(arg1)
            ? { bitLength: arg1, isLe: arg2 }
            : arg1
    );

    const valueBn = bnToBn(value);
    const byteLength = bitLength === -1
        ? Math.ceil(valueBn.bitLength() / 8)
        : Math.ceil((bitLength || 0) / 8);

    if (!value) {
        return bitLength === -1
            ? new Uint8Array()
            : new Uint8Array(byteLength);
    }

    const output = new Uint8Array(byteLength);
    const bn = isNegative
        ? valueBn.toTwos(byteLength * 8)
        : valueBn;

    output.set(bn.toArray(isLe ? 'le' : 'be', byteLength), 0);

    return output;
}

function hexToBn (value?: string | null, options?: ToBnOptions): BN;
/** @deprecated Use hexToBn (value?: string | null, options?: ToBnOptions) */
function hexToBn (value?: string | null, options?: boolean): BN;
/** @deprecated Use hexToBn (value?: string | null, options?: ToBnOptions) */
function hexToBn (value?: string | null, options: ToBnOptions | boolean = {}): BN {
    if (!value || value === '0x') {
        return new BN(0);
    }

    // For hex, default to BE
    const { isLe, isNegative } = objectSpread<ToBnOptions>(
        { isLe: false, isNegative: false },
        isBoolean(options)
            ? { isLe: options }
            : options
    );
    const stripped = hexStripPrefix(value);
    const bn = new BN(stripped, 16, isLe ? 'le' : 'be');

    // fromTwos takes as parameter the number of bits, which is the hex length
    // multiplied by 4 (2 bytes being 8 bits)
    return isNegative
        ? bn.fromTwos(stripped.length * 4)
        : bn;
}