/**
 * The following methods are based on `polkadot-js`, thanks for their work
 * https://github.com/polkadot-js/common/tree/master/packages/util
 */
import {hasBuffer, HexString, MessageFn, ToBigInt, ToBn} from "./types";
import {REGEX_HEX_PREFIXED} from "./hex";

export function assert (condition: unknown, message: string | MessageFn): asserts condition {
    if (!condition) {
        throw new Error(
            isFunction(message)
                ? message()
                : message
        );
    }
}

export function isOn <T> (...fns: (keyof T)[]): (value?: unknown) => value is T {
    return (value?: unknown): value is T =>
        (isObject(value) || isFunction(value)) &&
        fns.every((f) => isFunction((value as T)[f]));
}

export function isOnObject <T> (...fns: (keyof T)[]): (value?: unknown) => value is T {
    return (value?: unknown): value is T =>
        isObject(value) &&
        fns.every((f) => isFunction((value as T)[f]));
}

export const isToBn = isOn<ToBn>('toBn');
export const isToBigInt = isOn<ToBigInt>('toBigInt');

interface ObjectIndexed {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [index: string]: any;
}

export function isObject <T extends ObjectIndexed = ObjectIndexed> (value?: unknown): value is T {
    return !!value && typeof value === 'object';
}

export function isFunction (value: unknown): value is Function {
    return typeof value === 'function';
}

export function isNumber (value: unknown): value is number {
    return typeof value === 'number';
}

export function isHex (value: unknown, bitLength = -1, ignoreLength?: boolean): value is HexString {
    return (
        typeof value === 'string' && (
            value === '0x' ||
            REGEX_HEX_PREFIXED.test(value)
        )
    ) && (
        bitLength === -1
            ? (ignoreLength || (value.length % 2 === 0))
            : (value.length === (2 + Math.ceil(bitLength / 4)))
    );
}

export function isBoolean (value: unknown): value is boolean {
    return typeof value === 'boolean';
}

export function isBigInt (value: unknown): value is bigint {
    return typeof value === 'bigint';
}

export function isBuffer (value: unknown): value is Buffer {
    // we do check a function first, since it is slightly faster than isBuffer itself
    return hasBuffer && isFunction(value && (value as Buffer).readDoubleLE) && Buffer.isBuffer(value);
}

export function isU8a (value?: unknown): value is Uint8Array {
    // here we defer the instanceof check which is actually slightly
    // slower than just checking the constrctor (direct instances)
    return (
        ((value && (value as Uint8Array).constructor) === Uint8Array) ||
        value instanceof Uint8Array
    );
}
