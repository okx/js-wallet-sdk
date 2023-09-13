/**
 * The following methods are based on `bitcoinjs`, thanks for their work
 * https://github.com/bitcoinjs/bitcoinjs-lib
 */
import { FinalScriptSig, KeyValue } from '../../interfaces';
import { InputTypes } from '../../typeFields';

export function decode(keyVal: KeyValue): FinalScriptSig {
  if (keyVal.key[0] !== InputTypes.FINAL_SCRIPTSIG) {
    throw new Error(
      'Decode Error: could not decode finalScriptSig with key 0x' +
        keyVal.key.toString('hex'),
    );
  }
  return keyVal.value;
}

export function encode(data: FinalScriptSig): KeyValue {
  const key = Buffer.from([InputTypes.FINAL_SCRIPTSIG]);
  return {
    key,
    value: data,
  };
}

export const expected = 'Buffer';
export function check(data: any): data is FinalScriptSig {
  return Buffer.isBuffer(data);
}

export function canAdd(currentData: any, newData: any): boolean {
  return !!currentData && !!newData && currentData.finalScriptSig === undefined;
}
