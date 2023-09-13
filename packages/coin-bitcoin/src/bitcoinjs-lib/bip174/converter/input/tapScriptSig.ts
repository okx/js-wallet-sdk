/**
 * The following methods are based on `bitcoinjs`, thanks for their work
 * https://github.com/bitcoinjs/bitcoinjs-lib
 */
import { KeyValue, TapScriptSig } from '../../interfaces';
import { InputTypes } from '../../typeFields';

export function decode(keyVal: KeyValue): TapScriptSig {
  if (keyVal.key[0] !== InputTypes.TAP_SCRIPT_SIG) {
    throw new Error(
      'Decode Error: could not decode tapScriptSig with key 0x' +
        keyVal.key.toString('hex'),
    );
  }
  if (keyVal.key.length !== 65) {
    throw new Error(
      'Decode Error: tapScriptSig has invalid key 0x' +
        keyVal.key.toString('hex'),
    );
  }
  if (keyVal.value.length !== 64 && keyVal.value.length !== 65) {
    throw new Error(
      'Decode Error: tapScriptSig has invalid signature in key 0x' +
        keyVal.key.toString('hex'),
    );
  }
  const pubkey = keyVal.key.slice(1, 33);
  const leafHash = keyVal.key.slice(33);
  return {
    pubkey,
    leafHash,
    signature: keyVal.value,
  };
}

export function encode(tSig: TapScriptSig): KeyValue {
  const head = Buffer.from([InputTypes.TAP_SCRIPT_SIG]);
  return {
    key: Buffer.concat([head, tSig.pubkey, tSig.leafHash]),
    value: tSig.signature,
  };
}

export const expected =
  '{ pubkey: Buffer; leafHash: Buffer; signature: Buffer; }';
export function check(data: any): data is TapScriptSig {
  return (
    Buffer.isBuffer(data.pubkey) &&
    Buffer.isBuffer(data.leafHash) &&
    Buffer.isBuffer(data.signature) &&
    data.pubkey.length === 32 &&
    data.leafHash.length === 32 &&
    (data.signature.length === 64 || data.signature.length === 65)
  );
}

export function canAddToArray(
  array: TapScriptSig[],
  item: TapScriptSig,
  dupeSet: Set<string>,
): boolean {
  const dupeString =
    item.pubkey.toString('hex') + item.leafHash.toString('hex');
  if (dupeSet.has(dupeString)) return false;
  dupeSet.add(dupeString);
  return (
    array.filter(
      v => v.pubkey.equals(item.pubkey) && v.leafHash.equals(item.leafHash),
    ).length === 0
  );
}
