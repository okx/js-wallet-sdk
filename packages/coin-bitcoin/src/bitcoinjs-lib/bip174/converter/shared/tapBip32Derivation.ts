/**
 * The following methods are based on `bitcoinjs`, thanks for their work
 * https://github.com/bitcoinjs/bitcoinjs-lib
 */
import { KeyValue, TapBip32Derivation } from '../../interfaces';
import * as varuint from '../varint';
import * as bip32Derivation from './bip32Derivation';

const isValidBIP340Key = (pubkey: Buffer): boolean => pubkey.length === 32;

export function makeConverter(
  TYPE_BYTE: number,
): {
  decode: (keyVal: KeyValue) => TapBip32Derivation;
  encode: (data: TapBip32Derivation) => KeyValue;
  check: (data: any) => data is TapBip32Derivation;
  expected: string;
  canAddToArray: (
    array: TapBip32Derivation[],
    item: TapBip32Derivation,
    dupeSet: Set<string>,
  ) => boolean;
} {
  const parent = bip32Derivation.makeConverter(TYPE_BYTE, isValidBIP340Key);
  function decode(keyVal: KeyValue): TapBip32Derivation {
    const nHashes = varuint.decode(keyVal.value);
    const nHashesLen = varuint.encodingLength(nHashes);
    const base = parent.decode({
      key: keyVal.key,
      value: keyVal.value.slice(nHashesLen + nHashes * 32),
    });
    const leafHashes: Buffer[] = new Array(nHashes);
    for (let i = 0, _offset = nHashesLen; i < nHashes; i++, _offset += 32) {
      leafHashes[i] = keyVal.value.slice(_offset, _offset + 32);
    }
    return { ...base, leafHashes };
  }

  function encode(data: TapBip32Derivation): KeyValue {
    const base = parent.encode(data);
    const nHashesLen = varuint.encodingLength(data.leafHashes.length);
    const nHashesBuf = Buffer.allocUnsafe(nHashesLen);
    varuint.encode(data.leafHashes.length, nHashesBuf);
    const value = Buffer.concat([nHashesBuf, ...data.leafHashes, base.value]);
    return { ...base, value };
  }

  const expected =
    '{ ' +
    'masterFingerprint: Buffer; ' +
    'pubkey: Buffer; ' +
    'path: string; ' +
    'leafHashes: Buffer[]; ' +
    '}';
  function check(data: any): data is TapBip32Derivation {
    return (
      Array.isArray(data.leafHashes) &&
      data.leafHashes.every(
        (leafHash: any) => Buffer.isBuffer(leafHash) && leafHash.length === 32,
      ) &&
      parent.check(data)
    );
  }

  return {
    decode,
    encode,
    check,
    expected,
    canAddToArray: parent.canAddToArray,
  };
}
