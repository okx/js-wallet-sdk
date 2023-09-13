/**
 * The following methods are based on `polkadot-js`, thanks for their work
 * https://github.com/polkadot-js/common/tree/master/packages/util
 */
import {BN} from "@okxweb3/crypto-lib";

export type HexString = `0x${string}`;
export type AnyString = string | String;
export type U8aLike = HexString | number[] | Buffer | Uint8Array | AnyString;

export interface ToBn {
    toBn: () => BN;
}

export interface ToBigInt {
    toBigInt: () => bigint;
}

export interface NumberOptions extends ToBnOptions {
    /**
     * @description Limit to the specified bitLength, despite input length
     */
    bitLength?: number;
}

export type MessageFn = () => string;

export interface ToBnOptions {
    /**
     * @description Convert in LE format
     */
    isLe?: boolean;
    /**
     * @description Number is negative, apply two's complement
     */
    isNegative?: boolean;
}

export const hasBuffer = typeof Buffer !== 'undefined';

