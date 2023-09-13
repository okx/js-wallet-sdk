/**
 * The following methods are based on `bitcoinjs`, thanks for their work
 * https://github.com/bitcoinjs/bitcoinjs-lib
 */
import { KeyValue, SighashType } from '../../interfaces';
import { InputTypes } from '../../typeFields';

export function decode(keyVal: KeyValue): SighashType {
  if (keyVal.key[0] !== InputTypes.SIGHASH_TYPE) {
    throw new Error(
      'Decode Error: could not decode sighashType with key 0x' +
        keyVal.key.toString('hex'),
    );
  }
  return keyVal.value.readUInt32LE(0);
}

export function encode(data: SighashType): KeyValue {
  const key = Buffer.from([InputTypes.SIGHASH_TYPE]);
  const value = Buffer.allocUnsafe(4);
  value.writeUInt32LE(data, 0);
  return {
    key,
    value,
  };
}

export const expected = 'number';
export function check(data: any): data is SighashType {
  return typeof data === 'number';
}

export function canAdd(currentData: any, newData: any): boolean {
  return !!currentData && !!newData && currentData.sighashType === undefined;
}
