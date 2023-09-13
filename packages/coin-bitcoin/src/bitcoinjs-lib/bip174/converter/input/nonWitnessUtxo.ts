/**
 * The following methods are based on `bitcoinjs`, thanks for their work
 * https://github.com/bitcoinjs/bitcoinjs-lib
 */
import { KeyValue, NonWitnessUtxo } from '../../interfaces';
import { InputTypes } from '../../typeFields';

export function decode(keyVal: KeyValue): NonWitnessUtxo {
  if (keyVal.key[0] !== InputTypes.NON_WITNESS_UTXO) {
    throw new Error(
      'Decode Error: could not decode nonWitnessUtxo with key 0x' +
        keyVal.key.toString('hex'),
    );
  }
  return keyVal.value;
}

export function encode(data: NonWitnessUtxo): KeyValue {
  return {
    key: Buffer.from([InputTypes.NON_WITNESS_UTXO]),
    value: data,
  };
}

export const expected = 'Buffer';
export function check(data: any): data is NonWitnessUtxo {
  return Buffer.isBuffer(data);
}

export function canAdd(currentData: any, newData: any): boolean {
  return !!currentData && !!newData && currentData.nonWitnessUtxo === undefined;
}
