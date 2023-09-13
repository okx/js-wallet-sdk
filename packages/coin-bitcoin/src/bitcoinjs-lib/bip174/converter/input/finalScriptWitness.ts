/**
 * The following methods are based on `bitcoinjs`, thanks for their work
 * https://github.com/bitcoinjs/bitcoinjs-lib
 */
import { FinalScriptWitness, KeyValue } from '../../interfaces';
import { InputTypes } from '../../typeFields';

export function decode(keyVal: KeyValue): FinalScriptWitness {
  if (keyVal.key[0] !== InputTypes.FINAL_SCRIPTWITNESS) {
    throw new Error(
      'Decode Error: could not decode finalScriptWitness with key 0x' +
        keyVal.key.toString('hex'),
    );
  }
  return keyVal.value;
}

export function encode(data: FinalScriptWitness): KeyValue {
  const key = Buffer.from([InputTypes.FINAL_SCRIPTWITNESS]);
  return {
    key,
    value: data,
  };
}

export const expected = 'Buffer';
export function check(data: any): data is FinalScriptWitness {
  return Buffer.isBuffer(data);
}

export function canAdd(currentData: any, newData: any): boolean {
  return (
    !!currentData && !!newData && currentData.finalScriptWitness === undefined
  );
}
