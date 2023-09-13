/**
 * The following methods are based on `bitcoinjs`, thanks for their work
 * https://github.com/bitcoinjs/bitcoinjs-lib
 */
import { KeyValue, RedeemScript } from '../../interfaces';

export function makeConverter(
  TYPE_BYTE: number,
): {
  decode: (keyVal: KeyValue) => RedeemScript;
  encode: (data: RedeemScript) => KeyValue;
  check: (data: any) => data is RedeemScript;
  expected: string;
  canAdd: (currentData: any, newData: any) => boolean;
} {
  function decode(keyVal: KeyValue): RedeemScript {
    if (keyVal.key[0] !== TYPE_BYTE) {
      throw new Error(
        'Decode Error: could not decode redeemScript with key 0x' +
          keyVal.key.toString('hex'),
      );
    }
    return keyVal.value;
  }

  function encode(data: RedeemScript): KeyValue {
    const key = Buffer.from([TYPE_BYTE]);
    return {
      key,
      value: data,
    };
  }

  const expected = 'Buffer';
  function check(data: any): data is RedeemScript {
    return Buffer.isBuffer(data);
  }

  function canAdd(currentData: any, newData: any): boolean {
    return !!currentData && !!newData && currentData.redeemScript === undefined;
  }
  return {
    decode,
    encode,
    check,
    expected,
    canAdd,
  };
}
