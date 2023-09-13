/**
 * The following methods are based on `polkadot-js`, thanks for their work
 * https://github.com/polkadot-js/common/tree/master/packages/util
 */
import {HexString} from "./types";

export const REGEX_HEX_PREFIXED = /^0x[\da-fA-F]+$/;
export const REGEX_HEX_NOPREFIX = /^[\da-fA-F]+$/;

const U8_TO_HEX = new Array<string>(256);
const U16_TO_HEX = new Array<string>(256 * 256);

const HEX_TO_U8: Record<string, number> = {};
const HEX_TO_U16: Record<string, number> = {};

for (let n = 0; n < 256; n++) {
    const hex = n.toString(16).padStart(2, '0');

    U8_TO_HEX[n] = hex;
    HEX_TO_U8[hex] = n;
}

for (let i = 0; i < 256; i++) {
    for (let j = 0; j < 256; j++) {
        const hex = U8_TO_HEX[i] + U8_TO_HEX[j];
        const n = (i << 8) | j;

        U16_TO_HEX[n] = hex;
        HEX_TO_U16[hex] = n;
    }
}

export { HEX_TO_U16, HEX_TO_U8, U16_TO_HEX, U8_TO_HEX };

export function hexStripPrefix (value?: string | null): string {
    if (!value || value === '0x') {
        return '';
    } else if (REGEX_HEX_PREFIXED.test(value)) {
        return value.substring(2);
    } else if (REGEX_HEX_NOPREFIX.test(value)) {
        return value;
    }

    throw new Error(`Expected hex value to convert, found '${value}'`);
}

export function hexToU8a (_value?: HexString | string | null, bitLength = -1): Uint8Array {
    if (!_value) {
        return new Uint8Array();
    }

    const value = hexStripPrefix(_value).toLowerCase();
    const valLength = value.length / 2;
    const endLength = Math.ceil(
        bitLength === -1
            ? valLength
            : bitLength / 8
    );
    const result = new Uint8Array(endLength);
    const offset = endLength > valLength
        ? endLength - valLength
        : 0;
    const dv = new DataView(result.buffer, offset);
    const mod = (endLength - offset) % 2;
    const length = endLength - offset - mod;

    for (let i = 0; i < length; i += 2) {
        const idx = i * 2;

        dv.setUint16(i, HEX_TO_U16[value.substring(idx, idx + 4)]);
    }

    if (mod) {
        dv.setUint8(length, HEX_TO_U8[value.substring(value.length - 2)]);
    }

    return result;
}