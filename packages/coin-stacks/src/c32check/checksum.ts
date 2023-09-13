/**
 * MIT License
 *
 * Copyright (c) 2018 Jude Nelson
 *
 * https://github.com/stacks-network/c32check/blob/master/LICENSE
 * */
import { base } from '@okxweb3/crypto-lib';
import { bytesToHex, hexToBytes } from '../common';
import { c32, c32decode, c32encode, c32normalize } from './encoding';

/**
 * Get the c32check checksum of a hex-encoded string
 * @param {string} dataHex - the hex string
 * @returns {string} the c32 checksum, as a bin-encoded string
 */
function c32checksum(dataHex: string): string {
  const dataHash = base.sha256(base.sha256(hexToBytes(dataHex)));
  const checksum = bytesToHex(dataHash.slice(0, 4));
  return checksum;
}

/**
 * Encode a hex string as a c32check string.  This is a lot like how
 * base58check works in Bitcoin-land, but this algorithm uses the
 * z-base-32 alphabet instead of the base58 alphabet.  The algorithm
 * is as follows:
 * * calculate the c32checksum of version + data
 * * c32encode version + data + c32checksum
 * @param {number} version - the version string (between 0 and 31)
 * @param {string} data - the data to encode
 * @returns {string} the c32check representation
 */
export function c32checkEncode(version: number, data: string): string {
  if (version < 0 || version >= 32) {
    throw new Error('Invalid version (must be between 0 and 31)');
  }
  if (!data.match(/^[0-9a-fA-F]*$/)) {
    throw new Error('Invalid data (not a hex string)');
  }

  data = data.toLowerCase();
  if (data.length % 2 !== 0) {
    data = `0${data}`;
  }

  let versionHex = version.toString(16);
  if (versionHex.length === 1) {
    versionHex = `0${versionHex}`;
  }

  const checksumHex = c32checksum(`${versionHex}${data}`);
  const c32str = c32encode(`${data}${checksumHex}`);
  return `${c32[version]}${c32str}`;
}

/*
 * Decode a c32check string back into its version and data payload.  This is
 * a lot like how base58check works in Bitcoin-land, but this algorithm uses
 * the z-base-32 alphabet instead of the base58 alphabet.  The algorithm
 * is as follows:
 * * extract the version, data, and checksum
 * * verify the checksum matches c32checksum(version + data)
 * * return data
 * @param {string} c32data - the c32check-encoded string
 * @returns {array} [version (number), data (string)].  The returned data
 * will be a hex string.  Throws an exception if the checksum does not match.
 */
export function c32checkDecode(c32data: string): [number, string] {
  c32data = c32normalize(c32data);
  const dataHex = c32decode(c32data.slice(1));
  const versionChar = c32data[0];
  const version = c32.indexOf(versionChar);
  const checksum = dataHex.slice(-8);

  let versionHex = version.toString(16);
  if (versionHex.length === 1) {
    versionHex = `0${versionHex}`;
  }

  if (c32checksum(`${versionHex}${dataHex.substring(0, dataHex.length - 8)}`) !== checksum) {
    throw new Error('Invalid c32check string: checksum mismatch');
  }

  return [version, dataHex.substring(0, dataHex.length - 8)];
}
