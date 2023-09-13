/**
 * The following methods are based on `bitcoinjs`, thanks for their work
 * https://github.com/bitcoinjs/bitcoinjs-lib
 */
import { KeyValue, Transaction } from '../../interfaces';
import { GlobalTypes } from '../../typeFields';

export function encode(data: Transaction): KeyValue {
  return {
    key: Buffer.from([GlobalTypes.UNSIGNED_TX]),
    value: data.toBuffer(),
  };
}
