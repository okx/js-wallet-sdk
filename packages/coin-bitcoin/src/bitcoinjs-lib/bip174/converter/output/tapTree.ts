/**
 * The following methods are based on `bitcoinjs`, thanks for their work
 * https://github.com/bitcoinjs/bitcoinjs-lib
 */
import { KeyValue, TapLeaf, TapTree } from '../../interfaces';
import { OutputTypes } from '../../typeFields';
import * as varuint from '../varint';

export function decode(keyVal: KeyValue): TapTree {
  if (keyVal.key[0] !== OutputTypes.TAP_TREE || keyVal.key.length !== 1) {
    throw new Error(
      'Decode Error: could not decode tapTree with key 0x' +
        keyVal.key.toString('hex'),
    );
  }
  let _offset = 0;
  const data: TapLeaf[] = [];
  while (_offset < keyVal.value.length) {
    const depth = keyVal.value[_offset++];
    const leafVersion = keyVal.value[_offset++];
    const scriptLen = varuint.decode(keyVal.value, _offset);
    _offset += varuint.encodingLength(scriptLen);
    data.push({
      depth,
      leafVersion,
      script: keyVal.value.slice(_offset, _offset + scriptLen),
    });
    _offset += scriptLen;
  }
  return { leaves: data };
}

export function encode(tree: TapTree): KeyValue {
  const key = Buffer.from([OutputTypes.TAP_TREE]);
  const bufs = ([] as Buffer[]).concat(
    ...tree.leaves.map(tapLeaf => [
      Buffer.of(tapLeaf.depth, tapLeaf.leafVersion),
      varuint.encode(tapLeaf.script.length),
      tapLeaf.script,
    ]),
  );
  return {
    key,
    value: Buffer.concat(bufs),
  };
}

export const expected =
  '{ leaves: [{ depth: number; leafVersion: number, script: Buffer; }] }';
export function check(data: any): data is TapTree {
  return (
    Array.isArray(data.leaves) &&
    data.leaves.every(
      (tapLeaf: any) =>
        tapLeaf.depth >= 0 &&
        tapLeaf.depth <= 128 &&
        (tapLeaf.leafVersion & 0xfe) === tapLeaf.leafVersion &&
        Buffer.isBuffer(tapLeaf.script),
    )
  );
}

export function canAdd(currentData: any, newData: any): boolean {
  return !!currentData && !!newData && currentData.tapTree === undefined;
}
