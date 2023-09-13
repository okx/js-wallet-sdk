/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 Blockstack Inc.
 * https://github.com/hirosystems/stacks.js/blob/main/LICENSE
 * */

import {BN} from "@okxweb3/crypto-lib"
export type IntegerType = number | string | bigint | Uint8Array | BN;

export function intToBytes(value: IntegerType, signed: boolean, byteLength: number): Uint8Array {
  return bigIntToBytes(intToBigInt(value, signed), byteLength);
}

export function intToBigInt(value: IntegerType, signed: boolean): bigint {
  let parsedValue = value;

  if (typeof parsedValue === 'number') {
    if (!Number.isInteger(parsedValue)) {
      throw new RangeError(`Invalid value. Values of type 'number' must be an integer.`);
    }
    return BigInt(parsedValue);
  }
  if (typeof parsedValue === 'string') {
    // If hex string then convert to bytes then fall through to the bytes condition
    if (parsedValue.toLowerCase().startsWith('0x')) {
      // Trim '0x' hex-prefix
      let hex = parsedValue.slice(2);

      // Allow odd-length strings like `0xf` -- some libs output these, or even just `0x${num.toString(16)}`
      hex = hex.padStart(hex.length + (hex.length % 2), '0');

      parsedValue = hexToBytes(hex);
    } else {
      try {
        return BigInt(parsedValue);
      } catch (error) {
        if (error instanceof SyntaxError) {
          throw new RangeError(`Invalid value. String integer '${parsedValue}' is not finite.`);
        }
      }
    }
  }
  if (typeof parsedValue === 'bigint') {
    return parsedValue;
  }
  if (parsedValue instanceof Uint8Array) {
    if (signed) {
      // Allow byte arrays smaller than 128-bits to be passed.
      // This allows positive signed ints like `0x08` (8) or negative signed
      // ints like `0xf8` (-8) to be passed without having to pad to 16 bytes.
      const bn = fromTwos(
        BigInt(`0x${bytesToHex(parsedValue)}`),
        BigInt(parsedValue.byteLength * 8)
      );
      return BigInt(bn.toString());
    } else {
      return BigInt(`0x${bytesToHex(parsedValue)}`);
    }
  }
  // After removing bn.js library provide backward compatibility for users passing bn.js instance
  // For backward compatibility with bn.js check if it's a bn.js instance
  if (
    parsedValue != null &&
    typeof parsedValue === 'object' &&
    parsedValue.constructor.name === 'BN'
  ) {
    return BigInt(parsedValue.toString());
  }
  throw new TypeError(
    `Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.`
  );
}

export function with0x(value: string): string {
  return value.startsWith('0x') ? value : `0x${value}`;
}

/**
 * Converts hex input string to bigint
 * @param hex - hex input string without 0x prefix and in big endian format
 * @example "6c7cde4d702830c1db34ef7c19e2776f59107afef39084776fc88bc78dbb9656"
 * @ignore
 */
export function hexToBigInt(hex: string): bigint {
  if (typeof hex !== 'string')
    throw new TypeError(`hexToBigInt: expected string, got ${typeof hex}`);
  // Big Endian
  return BigInt(`0x${hex}`);
}

/**
 * Converts IntegerType to hex string
 * @ignore
 */
export function intToHex(integer: IntegerType, lengthBytes = 8): string {
  const value = typeof integer === 'bigint' ? integer : intToBigInt(integer, false);
  return value.toString(16).padStart(lengthBytes * 2, '0');
}

/**
 * Converts hex string to integer
 * @ignore
 */
export function hexToInt(hex: string): number {
  return parseInt(hex, 16);
}

/**
 * Converts bigint to byte array
 * @param value bigint value to be converted
 * @param length byte array optional length
 * @return {Uint8Array} byte array
 */
export function bigIntToBytes(value: bigint, length: number = 16): Uint8Array {
  const hex = intToHex(value, length);
  return hexToBytes(hex);
}

/**
 * Converts from signed number to two's complement
 * MIN_VALUE = -(1 << (width - 1))
 * MAX_VALUE =  (1 << (width - 1)) - 1
 * @ignore
 */
export function toTwos(value: bigint, width: bigint): bigint {
  if (
    value < -(BigInt(1) << (width - BigInt(1))) ||
    (BigInt(1) << (width - BigInt(1))) - BigInt(1) < value
  ) {
    throw `Unable to represent integer in width: ${width}`;
  }
  if (value >= BigInt(0)) {
    return BigInt(value);
  }
  return value + (BigInt(1) << width);
}

/**
 * Returns nth bit (right-to-left, zero-indexed)
 */
function nthBit(value: bigint, n: bigint) {
  return value & (BigInt(1) << n);
}

/**
 * Converts from two's complement to signed number
 * @ignore
 */
export function fromTwos(value: bigint, width: bigint) {
  if (nthBit(value, width - BigInt(1))) {
    return value - (BigInt(1) << width);
  }
  return value;
}

// The following methods are based on `@noble/hashes` implementation
// https://github.com/paulmillr/noble-hashes
// Copyright (c) 2022 Paul Miller (https://paulmillr.com)
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the “Software”), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
const hexes = Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, '0'));

/**
 * Converts bytes to the equivalent hex string
 * @example
 * ```
 * bytesToHex(Uint8Array.from([0xde, 0xad, 0xbe, 0xef])) // 'deadbeef'
 * ```
 */
export function bytesToHex(uint8a: Uint8Array): string {
  // pre-caching improves the speed 6x
  if (!(uint8a instanceof Uint8Array)) throw new Error('Uint8Array expected');
  let hex = '';
  for (const u of uint8a) {
    hex += hexes[u];
  }
  return hex;
}

/**
 * Converts a hex string to the equivalent bytes
 * @example
 * ```
 * hexToBytes('deadbeef') // Uint8Array(4) [ 222, 173, 190, 239 ]
 * ```
 */
export function hexToBytes(hex: string): Uint8Array {
  if (typeof hex !== 'string') {
    throw new TypeError(`hexToBytes: expected string, got ${typeof hex}`);
  }
  const paddedHex = hex.length % 2 ? `0${hex}` : hex; // left pad with a zero if odd length
  const array = new Uint8Array(paddedHex.length / 2);
  for (let i = 0; i < array.length; i++) {
    const j = i * 2;
    const hexByte = paddedHex.slice(j, j + 2);
    const byte = Number.parseInt(hexByte, 16);
    if (Number.isNaN(byte) || byte < 0) throw new Error('Invalid byte sequence');
    array[i] = byte;
  }
  return array;
}

declare const TextEncoder: any;
declare const TextDecoder: any;

/**
 * Converts a UTF-8 string to the equivalent bytes
 * @example
 * ```
 * utf8ToBytes('stacks Ӿ'); // Uint8Array(9) [ 115, 116, 97, 99, 107, 115, 32, 211, 190 ];
 * ```
 */
export function utf8ToBytes(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

/**
 * Converts bytes to the equivalent UTF-8 string
 * @example
 * ```
 * bytesToUtf8(Uint8Array.from([115, 116, 97, 99, 107, 115, 32, 211, 190])); // 'stacks Ӿ'
 * ```
 */
export function bytesToUtf8(arr: Uint8Array): string {
  return new TextDecoder().decode(arr);
}

/**
 * Converts an ASCII string to the equivalent bytes
 * @example
 * ```
 * asciiToBytes('stacks $'); // Uint8Array(8) [ 115, 116, 97, 99, 107, 115, 32, 36 ]
 * ```
 */
export function asciiToBytes(str: string) {
  const byteArray = [];
  for (let i = 0; i < str.length; i++) {
    byteArray.push(str.charCodeAt(i) & 0xff); // ignore second bytes of UTF-16 character
  }
  return new Uint8Array(byteArray);
}

/**
 * Converts bytes to the equivalent ASCII string
 * @example
 * ```
 * bytesToAscii(Uint8Array.from([115, 116, 97, 99, 107, 115, 32, 36])); // 'stacks $'
 * ```
 */
export function bytesToAscii(arr: Uint8Array) {
  return String.fromCharCode.apply(null, arr as any as number[]);
}

function isNotOctet(octet: number) {
  return !Number.isInteger(octet) || octet < 0 || octet > 255;
}

/** @ignore */
export function octetsToBytes(numbers: number[]) {
  if (numbers.some(isNotOctet)) throw new Error('Some values are invalid bytes.');
  return new Uint8Array(numbers);
}

/** @ignore */
export function toBytes(data: Uint8Array | string): Uint8Array {
  if (typeof data === 'string') return utf8ToBytes(data);
  if (data instanceof Uint8Array) return data;
  throw new TypeError(`Expected input type is (Uint8Array | string) but got (${typeof data})`);
}

/**
 * Concats Uint8Array-s into one; like `Buffer.concat([buf1, buf2])`
 * @example concatBytes(buf1, buf2)
 * @ignore
 */
export function concatBytes(...arrays: Uint8Array[]): Uint8Array {
  if (!arrays.every(a => a instanceof Uint8Array)) throw new Error('Uint8Array list expected');
  if (arrays.length === 1) return arrays[0];
  const length = arrays.reduce((a, arr) => a + arr.length, 0);
  const result = new Uint8Array(length);
  for (let i = 0, pad = 0; i < arrays.length; i++) {
    const arr = arrays[i];
    result.set(arr, pad);
    pad += arr.length;
  }
  return result;
}

/** @ignore */
export function concatArray(elements: (Uint8Array | number[] | number)[]) {
  return concatBytes(
    ...elements.map(e => {
      if (typeof e === 'number') return octetsToBytes([e]);
      if (e instanceof Array) return octetsToBytes(e);
      return e;
    })
  );
}

/**
 * Better `instanceof` check for types in different environments
 * @ignore
 */
export function isInstance(object: any, type: any) {
  return object instanceof type || object?.constructor?.name?.toLowerCase() === type.name;
}