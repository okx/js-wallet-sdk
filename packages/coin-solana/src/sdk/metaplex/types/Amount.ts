/**
 * The following methods are based on `types`, thanks for their work
 * https://github.com/metaplex-foundation/js/tree/main/packages/js/src/types
 */
import {BigNumber, BigNumberValues, toBigNumber} from './BigNumber';

export type Amount<T extends Currency = Currency> = {
  basisPoints: BigNumber;
  currency: T;
};

export type Currency = {
  symbol: string;
  decimals: number;
  namespace?: 'spl-token';
};

export type SplTokenCurrency = {
  symbol: string;
  decimals: number;
  namespace: 'spl-token';
};
export type SplTokenAmount = Amount<SplTokenCurrency>;

export const token = (
  amount: BigNumberValues,
  decimals = 0,
  symbol = 'Token'
): SplTokenAmount => {
  if (typeof amount !== 'number') {
    amount = toBigNumber(amount).toNumber();
  }

  return {
    basisPoints: toBigNumber(amount * Math.pow(10, decimals)),
    currency: {
      symbol,
      decimals,
      namespace: 'spl-token',
    },
  };
};
