/**
 * The following methods are based on `bitcoinjs`, thanks for their work
 * https://github.com/bitcoinjs/bitcoinjs-lib
 */
import { KeyValue, TapMerkleRoot } from '../../interfaces';
import { InputTypes } from '../../typeFields';

export function decode(keyVal: KeyValue): TapMerkleRoot {
  if (keyVal.key[0] !== InputTypes.TAP_MERKLE_ROOT || keyVal.key.length !== 1) {
    throw new Error(
      'Decode Error: could not decode tapMerkleRoot with key 0x' +
        keyVal.key.toString('hex'),
    );
  }
  if (!check(keyVal.value)) {
    throw new Error('Decode Error: tapMerkleRoot not a 32-byte hash');
  }
  return keyVal.value;
}

export function encode(value: TapMerkleRoot): KeyValue {
  const key = Buffer.from([InputTypes.TAP_MERKLE_ROOT]);
  return { key, value };
}

export const expected = 'Buffer';
export function check(data: any): data is TapMerkleRoot {
  return Buffer.isBuffer(data) && data.length === 32;
}

export function canAdd(currentData: any, newData: any): boolean {
  return !!currentData && !!newData && currentData.tapMerkleRoot === undefined;
}
