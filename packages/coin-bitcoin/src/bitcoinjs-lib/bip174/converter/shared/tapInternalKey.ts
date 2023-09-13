/**
 * The following methods are based on `bitcoinjs`, thanks for their work
 * https://github.com/bitcoinjs/bitcoinjs-lib
 */
import { KeyValue, TapInternalKey } from '../../interfaces';

export function makeConverter(
  TYPE_BYTE: number,
): {
  decode: (keyVal: KeyValue) => TapInternalKey;
  encode: (data: TapInternalKey) => KeyValue;
  check: (data: any) => data is TapInternalKey;
  expected: string;
  canAdd: (currentData: any, newData: any) => boolean;
} {
  function decode(keyVal: KeyValue): TapInternalKey {
    if (keyVal.key[0] !== TYPE_BYTE || keyVal.key.length !== 1) {
      throw new Error(
        'Decode Error: could not decode tapInternalKey with key 0x' +
          keyVal.key.toString('hex'),
      );
    }
    if (keyVal.value.length !== 32) {
      throw new Error(
        'Decode Error: tapInternalKey not a 32-byte x-only pubkey',
      );
    }
    return keyVal.value;
  }

  function encode(value: TapInternalKey): KeyValue {
    const key = Buffer.from([TYPE_BYTE]);
    return { key, value };
  }

  const expected = 'Buffer';
  function check(data: any): data is TapInternalKey {
    return Buffer.isBuffer(data) && data.length === 32;
  }

  function canAdd(currentData: any, newData: any): boolean {
    return (
      !!currentData && !!newData && currentData.tapInternalKey === undefined
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
