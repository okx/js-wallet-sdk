/**
 * MIT License
 *
 * Copyright (c) 2018 Jude Nelson
 *
 * https://github.com/stacks-network/c32check/blob/master/LICENSE
 * */
import { c32checkEncode, c32checkDecode } from './checksum';
import * as base58check from './base58check';
import { bytesToHex } from '../common';

export const versions = {
  mainnet: {
    p2pkh: 22, // 'P'
    p2sh: 20, // 'M'
  },
  testnet: {
    p2pkh: 26, // 'T'
    p2sh: 21, // 'N'
  },
};

// address conversion : bitcoin to stacks
const ADDR_BITCOIN_TO_STACKS: Record<number, number> = {};
ADDR_BITCOIN_TO_STACKS[0] = versions.mainnet.p2pkh;
ADDR_BITCOIN_TO_STACKS[5] = versions.mainnet.p2sh;
ADDR_BITCOIN_TO_STACKS[111] = versions.testnet.p2pkh;
ADDR_BITCOIN_TO_STACKS[196] = versions.testnet.p2sh;

// address conversion : stacks to bitcoin
const ADDR_STACKS_TO_BITCOIN: Record<number, number> = {};
ADDR_STACKS_TO_BITCOIN[versions.mainnet.p2pkh] = 0;
ADDR_STACKS_TO_BITCOIN[versions.mainnet.p2sh] = 5;
ADDR_STACKS_TO_BITCOIN[versions.testnet.p2pkh] = 111;
ADDR_STACKS_TO_BITCOIN[versions.testnet.p2sh] = 196;

/**
 * Make a c32check address with the given version and hash160
 * The only difference between a c32check string and c32 address
 * is that the letter 'S' is pre-pended.
 * @param {number} version - the address version number
 * @param {string} hash160hex - the hash160 to encode (must be a hash160)
 * @returns {string} the address
 */
export function c32address(version: number, hash160hex: string): string {
  if (!hash160hex.match(/^[0-9a-fA-F]{40}$/)) {
    throw new Error('Invalid argument: not a hash160 hex string');
  }

  const c32string = c32checkEncode(version, hash160hex);
  return `S${c32string}`;
}

/**
 * Decode a c32 address into its version and hash160
 * @param {string} c32addr - the c32check-encoded address
 * @returns {[number, string]} a tuple with the version and hash160
 */
export function c32addressDecode(c32addr: string): [number, string] {
  if (c32addr.length <= 5) {
    throw new Error('Invalid c32 address: invalid length');
  }
  if (c32addr[0] != 'S') {
    throw new Error('Invalid c32 address: must start with "S"');
  }
  return c32checkDecode(c32addr.slice(1));
}

/*
 * Convert a base58check address to a c32check address.
 * Try to convert the version number if one is not given.
 * @param {string} b58check - the base58check encoded address
 * @param {number} version - the version number, if not inferred from the address
 * @returns {string} the c32 address with the given version number (or the
 *   semantically-equivalent c32 version number, if not given)
 */
export function b58ToC32(b58check: string, version: number = -1): string {
  const addrInfo = base58check.decode(b58check);
  const hash160String = bytesToHex(addrInfo.data);
  const addrVersion = parseInt(bytesToHex(addrInfo.prefix), 16);
  let stacksVersion;

  if (version < 0) {
    stacksVersion = addrVersion;
    if (ADDR_BITCOIN_TO_STACKS[addrVersion] !== undefined) {
      stacksVersion = ADDR_BITCOIN_TO_STACKS[addrVersion];
    }
  } else {
    stacksVersion = version;
  }

  return c32address(stacksVersion, hash160String);
}

/*
 * Convert a c32check address to a base58check address.
 * @param {string} c32string - the c32check address
 * @param {number} version - the version number, if not inferred from the address
 * @returns {string} the base58 address with the given version number (or the
 *    semantically-equivalent bitcoin version number, if not given)
 */
export function c32ToB58(c32string: string, version: number = -1): string {
  const addrInfo = c32addressDecode(c32string);
  const stacksVersion = addrInfo[0];
  const hash160String = addrInfo[1];
  let bitcoinVersion;

  if (version < 0) {
    bitcoinVersion = stacksVersion;
    if (ADDR_STACKS_TO_BITCOIN[stacksVersion] !== undefined) {
      bitcoinVersion = ADDR_STACKS_TO_BITCOIN[stacksVersion];
    }
  } else {
    bitcoinVersion = version;
  }

  let prefix = bitcoinVersion.toString(16);
  if (prefix.length === 1) {
    prefix = `0${prefix}`;
  }

  return base58check.encode(hash160String, prefix);
}
