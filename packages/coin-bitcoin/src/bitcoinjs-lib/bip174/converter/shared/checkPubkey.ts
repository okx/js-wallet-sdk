/**
 * The following methods are based on `bitcoinjs`, thanks for their work
 * https://github.com/bitcoinjs/bitcoinjs-lib
 */
import { KeyValue } from '../../interfaces';

export function makeChecker(
  pubkeyTypes: number[],
): (keyVal: KeyValue) => Buffer | undefined {
  return checkPubkey;
  function checkPubkey(keyVal: KeyValue): Buffer | undefined {
    let pubkey: Buffer | undefined;
    if (pubkeyTypes.includes(keyVal.key[0])) {
      pubkey = keyVal.key.slice(1);
      if (
        !(pubkey.length === 33 || pubkey.length === 65) ||
        ![2, 3, 4].includes(pubkey[0])
      ) {
        throw new Error(
          'Format Error: invalid pubkey in key 0x' + keyVal.key.toString('hex'),
        );
      }
    }
    return pubkey;
  }
}
