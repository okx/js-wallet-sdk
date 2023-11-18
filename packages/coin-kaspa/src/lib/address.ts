import { validate } from "./validation";
import { convert as convertBits } from "./convertBits";
import * as base32 from "./base32";
import { base } from "@okxweb3/crypto-lib";

export function encodePubKeyAddress(pubKey: string, prefix: string) {
  const eight0 = [0,0,0,0,0,0,0,0];
  const prefixData = prefixToArray(prefix).concat([0]);
  const versionByte = 0;

  const pubKeyArray = Array.prototype.slice.call(base.fromHex(pubKey), 0);
  const payloadData = convertBits(new Uint8Array([versionByte].concat(pubKeyArray)), 8, 5, false);
  const checksumData = new Uint8Array(prefixData.length + payloadData.length + eight0.length);
  checksumData.set(prefixData);
  checksumData.set(payloadData, prefixData.length);
  checksumData.set(eight0, prefixData.length + payloadData.length);
  const polymodData = checksumToArray(polymod(checksumData));

  const payload = new Uint8Array(payloadData.length + polymodData.length);
  payload.set(payloadData);
  payload.set(polymodData, payloadData.length);

  return 'kaspa:' + base32.encode(payload);
}

export function decodeAddress(address: string) {
  validate(hasSingleCase(address), 'Mixed case');
  address = address.toLowerCase();

  const pieces = address.split(':');
  validate(pieces.length === 2, 'Invalid format: ' + address);

  const prefix = pieces[0];
  validate(prefix === 'kaspa', 'Invalid prefix: ' + address);
  const encodedPayload = pieces[1];
  const payload = base32.decode(encodedPayload);
  validate(validChecksum(prefix, payload), 'Invalid checksum: ' + address);

  const convertedBits = convertBits(payload.slice(0, -8), 5, 8, true);
  const versionByte = convertedBits[0];
  const hashOrPublicKey = convertedBits.slice(1);

  if (versionByte === 1) {
    validate(264 === hashOrPublicKey.length * 8, 'Invalid hash size: ' + address);
  } else {
    validate(256 === hashOrPublicKey.length * 8, 'Invalid hash size: ' + address);
  }

  const type = getType(versionByte);

  return {
    payload: Buffer.from(hashOrPublicKey),
    prefix,
    type,
  };
}

function hasSingleCase(string: string) {
  return string === string.toLowerCase() || string === string.toUpperCase();
}

function prefixToArray(prefix: string) {
  const result = [];
  for (let i = 0; i < prefix.length; i++) {
    result.push(prefix.charCodeAt(i) & 31);
  }
  return result;
}

function checksumToArray(checksum: number) {
  const result = [];
  for (let i = 0; i < 8; ++i) {
    result.push(checksum & 31);
    checksum /= 32;
  }
  return result.reverse();
}

function validChecksum(prefix: string, payload: Uint8Array) {
  const prefixData = prefixToArray(prefix);
  const data = new Uint8Array(prefix.length + 1 + payload.length);
  data.set(prefixData);
  data.set([0], prefixData.length)
  data.set(payload, prefixData.length + 1);

  return polymod(data) === 0;
}

function getType(versionByte: number) {
  switch (versionByte & 120) {
    case 0:
      return 'pubkey';
    case 8:
      return 'scripthash';
    default:
      throw new Error('Invalid address type in version byte:' + versionByte);
  }
}

const GENERATOR1 = [0x98, 0x79, 0xf3, 0xae, 0x1e];
const GENERATOR2 = [0xf2bc8e61, 0xb76d99e2, 0x3e5fb3c4, 0x2eabe2a8, 0x4f43e470];

function polymod(data: Uint8Array) {
  // Treat c as 8 bits + 32 bits
  var c0 = 0, c1 = 1, C = 0;
  for (var j = 0; j < data.length; j++) {
    // Set C to c shifted by 35
    C = c0 >>> 3;
    // 0x[07]ffffffff
    c0 &= 0x07;
    // Shift as a whole number
    c0 <<= 5;
    c0 |= c1 >>> 27;
    // 0xffffffff >>> 5
    c1 &= 0x07ffffff;
    c1 <<= 5;
    // xor the last 5 bits
    c1 ^= data[j];
    for (var i = 0; i < GENERATOR1.length; ++i) {
      if (C & (1 << i)) {
        c0 ^= GENERATOR1[i];
        c1 ^= GENERATOR2[i];
      }
    }
  }
  c1 ^= 1;
  // Negative numbers -> large positive numbers
  if (c1 < 0) {
    c1 ^= 1 << 31;
    c1 += (1 << 30) * 2;
  }
  // Unless bitwise operations are used,
  // numbers are consisting of 52 bits, except
  // the sign bit. The result is max 40 bits,
  // so it fits perfectly in one number!
  return c0 * (1 << 30) * 4 + c1;
}
