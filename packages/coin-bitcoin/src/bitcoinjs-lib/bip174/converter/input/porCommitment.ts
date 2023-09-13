/**
 * The following methods are based on `bitcoinjs`, thanks for their work
 * https://github.com/bitcoinjs/bitcoinjs-lib
 */
import { KeyValue, PorCommitment } from '../../interfaces';
import { InputTypes } from '../../typeFields';

export function decode(keyVal: KeyValue): PorCommitment {
  if (keyVal.key[0] !== InputTypes.POR_COMMITMENT) {
    throw new Error(
      'Decode Error: could not decode porCommitment with key 0x' +
        keyVal.key.toString('hex'),
    );
  }
  return keyVal.value.toString('utf8');
}

export function encode(data: PorCommitment): KeyValue {
  const key = Buffer.from([InputTypes.POR_COMMITMENT]);
  return {
    key,
    value: Buffer.from(data, 'utf8'),
  };
}

export const expected = 'string';
export function check(data: any): data is PorCommitment {
  return typeof data === 'string';
}

export function canAdd(currentData: any, newData: any): boolean {
  return !!currentData && !!newData && currentData.porCommitment === undefined;
}
