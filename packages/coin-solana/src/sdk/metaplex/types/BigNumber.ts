/**
 * The following methods are based on `types`, thanks for their work
 * https://github.com/metaplex-foundation/js/tree/main/packages/js/src/types
 */
import type { Buffer } from 'buffer';
import { BN } from '@okxweb3/crypto-lib';
import type { Opaque, Option } from '../utils';

export type BigNumber = Opaque<BN, 'BigNumber'>;
export type BigNumberValues =
  | number
  | string
  | number[]
  | Uint8Array
  | Buffer
  | BN;

export const toBigNumber = (
  value: BigNumberValues,
  endian?: BN.Endianness
): BigNumber => {
  return new BN(value, endian) as BigNumber;
};

export const toOptionBigNumber = (
  value: Option<BigNumberValues>
): Option<BigNumber> => {
  return value === null ? null : toBigNumber(value);
};

export const isBigNumber = (value: any): value is BigNumber => {
  return value?.__opaque__ === 'BigNumber';
};
