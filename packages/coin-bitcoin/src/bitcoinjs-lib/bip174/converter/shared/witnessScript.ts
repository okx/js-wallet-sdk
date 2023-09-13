/**
 * The following methods are based on `bitcoinjs`, thanks for their work
 * https://github.com/bitcoinjs/bitcoinjs-lib
 */
import { KeyValue, WitnessScript } from '../../interfaces';

export function makeConverter(
  TYPE_BYTE: number,
): {
  decode: (keyVal: KeyValue) => WitnessScript;
  encode: (data: WitnessScript) => KeyValue;
  check: (data: any) => data is WitnessScript;
  expected: string;
  canAdd: (currentData: any, newData: any) => boolean;
} {
  function decode(keyVal: KeyValue): WitnessScript {
    if (keyVal.key[0] !== TYPE_BYTE) {
      throw new Error(
        'Decode Error: could not decode witnessScript with key 0x' +
          keyVal.key.toString('hex'),
      );
    }
    return keyVal.value;
  }

  function encode(data: WitnessScript): KeyValue {
    const key = Buffer.from([TYPE_BYTE]);
    return {
      key,
      value: data,
    };
  }

  const expected = 'Buffer';
  function check(data: any): data is WitnessScript {
    return Buffer.isBuffer(data);
  }

  function canAdd(currentData: any, newData: any): boolean {
    return (
      !!currentData && !!newData && currentData.witnessScript === undefined
    );
  }

  return {
    decode,
    encode,
    check,
    expected,
    canAdd,
  };
}
