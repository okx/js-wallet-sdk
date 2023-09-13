/**
 * MIT License
 *
 * Copyright (c) 2018 Jude Nelson
 *
 * https://github.com/stacks-network/c32check/blob/master/LICENSE
 * */

declare const TextDecoder: any;

import { hexToBytes } from '../common';

export const c32 = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
const hex = '0123456789abcdef';

/**
 * Encode a hex string as a c32 string.  Note that the hex string is assumed
 * to be big-endian (and the resulting c32 string will be as well).
 * @param {string} inputHex - the input to encode
 * @param {number} minLength - the minimum length of the c32 string
 * @returns {string} the c32check-encoded representation of the data, as a string
 */
export function c32encode(inputHex: string, minLength?: number): string {
  // must be hex
  if (!inputHex.match(/^[0-9a-fA-F]*$/)) {
    throw new Error('Not a hex-encoded string');
  }

  if (inputHex.length % 2 !== 0) {
    inputHex = `0${inputHex}`;
  }

  inputHex = inputHex.toLowerCase();

  let res = [];
  let carry = 0;
  for (let i = inputHex.length - 1; i >= 0; i--) {
    if (carry < 4) {
      const currentCode = hex.indexOf(inputHex[i]) >> carry;
      let nextCode = 0;
      if (i !== 0) {
        nextCode = hex.indexOf(inputHex[i - 1]);
      }
      // carry = 0, nextBits is 1, carry = 1, nextBits is 2
      const nextBits = 1 + carry;
      const nextLowBits = nextCode % (1 << nextBits) << (5 - nextBits);
      const curC32Digit = c32[currentCode + nextLowBits];
      carry = nextBits;
      res.unshift(curC32Digit);
    } else {
      carry = 0;
    }
  }

  let C32leadingZeros = 0;
  for (let i = 0; i < res.length; i++) {
    if (res[i] !== '0') {
      break;
    } else {
      C32leadingZeros++;
    }
  }

  res = res.slice(C32leadingZeros);

  const zeroPrefix = new TextDecoder().decode(hexToBytes(inputHex)).match(/^\u0000*/);
  const numLeadingZeroBytesInHex = zeroPrefix ? zeroPrefix[0].length : 0;

  for (let i = 0; i < numLeadingZeroBytesInHex; i++) {
    res.unshift(c32[0]);
  }

  if (minLength) {
    const count = minLength - res.length;
    for (let i = 0; i < count; i++) {
      res.unshift(c32[0]);
    }
  }

  return res.join('');
}

/*
 * Normalize a c32 string
 * @param {string} c32input - the c32-encoded input string
 * @returns {string} the canonical representation of the c32 input string
 */
export function c32normalize(c32input: string): string {
  // must be upper-case
  // replace all O's with 0's
  // replace all I's and L's with 1's
  return c32input.toUpperCase().replace(/O/g, '0').replace(/L|I/g, '1');
}

/*
 * Decode a c32 string back into a hex string.  Note that the c32 input
 * string is assumed to be big-endian (and the resulting hex string will
 * be as well).
 * @param {string} c32input - the c32-encoded input to decode
 * @param {number} minLength - the minimum length of the output hex string (in bytes)
 * @returns {string} the hex-encoded representation of the data, as a string
 */
export function c32decode(c32input: string, minLength?: number): string {
  c32input = c32normalize(c32input);

  // must result in a c32 string
  if (!c32input.match(`^[${c32}]*$`)) {
    throw new Error('Not a c32-encoded string');
  }

  const zeroPrefix = c32input.match(`^${c32[0]}*`);
  const numLeadingZeroBytes = zeroPrefix ? zeroPrefix[0].length : 0;

  let res = [];
  let carry = 0;
  let carryBits = 0;
  for (let i = c32input.length - 1; i >= 0; i--) {
    if (carryBits === 4) {
      res.unshift(hex[carry]);
      carryBits = 0;
      carry = 0;
    }
    const currentCode = c32.indexOf(c32input[i]) << carryBits;
    const currentValue = currentCode + carry;
    const currentHexDigit = hex[currentValue % 16];
    carryBits += 1;
    carry = currentValue >> 4;
    if (carry > 1 << carryBits) {
      throw new Error('Panic error in decoding.');
    }
    res.unshift(currentHexDigit);
  }
  // one last carry
  res.unshift(hex[carry]);

  if (res.length % 2 === 1) {
    res.unshift('0');
  }

  let hexLeadingZeros = 0;
  for (let i = 0; i < res.length; i++) {
    if (res[i] !== '0') {
      break;
    } else {
      hexLeadingZeros++;
    }
  }

  res = res.slice(hexLeadingZeros - (hexLeadingZeros % 2));

  let hexStr = res.join('');
  for (let i = 0; i < numLeadingZeroBytes; i++) {
    hexStr = `00${hexStr}`;
  }

  if (minLength) {
    const count = minLength * 2 - hexStr.length;
    for (let i = 0; i < count; i += 2) {
      hexStr = `00${hexStr}`;
    }
  }

  return hexStr;
}
