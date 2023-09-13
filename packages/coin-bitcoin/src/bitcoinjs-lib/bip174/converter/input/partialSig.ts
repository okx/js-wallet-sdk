/**
 * The following methods are based on `bitcoinjs`, thanks for their work
 * https://github.com/bitcoinjs/bitcoinjs-lib
 */
import { KeyValue, PartialSig } from '../../interfaces';
import { InputTypes } from '../../typeFields';

export function decode(keyVal: KeyValue): PartialSig {
  if (keyVal.key[0] !== InputTypes.PARTIAL_SIG) {
    throw new Error(
      'Decode Error: could not decode partialSig with key 0x' +
        keyVal.key.toString('hex'),
    );
  }
  if (
    !(keyVal.key.length === 34 || keyVal.key.length === 66) ||
    ![2, 3, 4].includes(keyVal.key[1])
  ) {
    throw new Error(
      'Decode Error: partialSig has invalid pubkey in key 0x' +
        keyVal.key.toString('hex'),
    );
  }
  const pubkey = keyVal.key.slice(1);
  return {
    pubkey,
    signature: keyVal.value,
  };
}

export function encode(pSig: PartialSig): KeyValue {
  const head = Buffer.from([InputTypes.PARTIAL_SIG]);
  return {
    key: Buffer.concat([head, pSig.pubkey]),
    value: pSig.signature,
  };
}

export const expected = '{ pubkey: Buffer; signature: Buffer; }';
export function check(data: any): data is PartialSig {
  return (
    Buffer.isBuffer(data.pubkey) &&
    Buffer.isBuffer(data.signature) &&
    [33, 65].includes(data.pubkey.length) &&
    [2, 3, 4].includes(data.pubkey[0]) &&
    isDerSigWithSighash(data.signature)
  );
}

function isDerSigWithSighash(buf: Buffer): boolean {
  if (!Buffer.isBuffer(buf) || buf.length < 9) return false;
  if (buf[0] !== 0x30) return false;
  if (buf.length !== buf[1] + 3) return false;
  if (buf[2] !== 0x02) return false;
  const rLen = buf[3];
  if (rLen > 33 || rLen < 1) return false;
  if (buf[3 + rLen + 1] !== 0x02) return false;
  const sLen = buf[3 + rLen + 2];
  if (sLen > 33 || sLen < 1) return false;
  if (buf.length !== 3 + rLen + 2 + sLen + 2) return false;
  return true;
}

export function canAddToArray(
  array: PartialSig[],
  item: PartialSig,
  dupeSet: Set<string>,
): boolean {
  const dupeString = item.pubkey.toString('hex');
  if (dupeSet.has(dupeString)) return false;
  dupeSet.add(dupeString);
  return array.filter(v => v.pubkey.equals(item.pubkey)).length === 0;
}
