import { SignTxError, SignTxParams } from '@okxweb3/coin-base';
import { EthWallet } from '@okxweb3/coin-ethereum';
import {
  closestPackableTransactionAmount,
  closestPackableTransactionFee,
  zksyncChangePubkey,
  zksyncTransfer,
} from './index';
import {BigNumber} from "@ethersproject/bignumber";


export class ZksyncWallet extends EthWallet {
  async signTransaction(param: SignTxParams): Promise<any> {
    try {
      let result;
      const data: ZksyncSignParam = param.data
      const closeFees = getCloseFeeBylocal(data.fees);
      if (!BigNumber.from(closeFees).eq(BigNumber.from(data.fees))) {
        let rejectParam = {
          code: '402',
          reason: 'Fee is not packable',
          closeFees_number: BigNumber.from(closeFees)
        }
        return Promise.resolve(rejectParam);
      }
      if (data.type === 'transfer') {
        if (
          data.from == null ||
          data.to == null ||
          data.nonce == null ||
          data.accountId == null ||
          data.fees == null ||
          data.tokenId == null ||
          data.tokenSymbol == null
        ) {
          return Promise.reject(SignTxError);
        }
        const closeAmount = getCloseAmountsByLocal(data.amounts);

        if (!BigNumber.from(closeAmount).eq(BigNumber.from(data.amounts))) {
          let rejectParam = {
            code: '401',
            reason: 'Amount is not packable',
            closeAmount_number: BigNumber.from(closeAmount),
          };
          return Promise.resolve(rejectParam);
        }
        result = zksyncTransfer(
          param.privateKey,
          data.from,
          data.to,
          data.accountId,
          data.tokenId,
          data.tokenSymbol,
          data.amounts,
          data.fees,
          data.decimals,
          data.nonce,
        );
      } else if (data.type === 'changePubkey') {
        if (
          data.from == null ||
          data.nonce == null ||
          data.accountId == null ||
          data.fees == null
        ) {
          return Promise.reject(SignTxError);
        }

        result = zksyncChangePubkey(
          param.privateKey,
          data.from,
          data.nonce,
          data.accountId,
          data.fees,
          data.tokenId,
        );
      } else {
        return Promise.reject(SignTxError);
      }

      // @ts-ignore
      return Promise.resolve(result);
    } catch (e) {
      return Promise.reject(SignTxError);
    }
  }
  static async getCloseAmounts(amounts: string) {
    return getCloseAmountsByLocal(amounts);
  }
  static async getCloseFee(fees: string) {
    return getCloseFeeBylocal(fees);
  }
}

export type ZksyncTransactionType = 'transfer' | 'changePubkey';
export type ZksyncSignParam = {
  type: ZksyncTransactionType;
  from: string;
  to: string;
  accountId: number;
  tokenId: number;
  tokenSymbol: string;
  amounts: string;
  fees: string;
  decimals: number;
  nonce: number;
};

// @ts-ignore
function getCloseAmountsByLocal(amounts: string) {
  const originAmounts = BigNumber.from(amounts)
  const closeAmounts=closestPackableTransactionAmount(amounts)
  if (closeAmounts.gt(originAmounts)) {
    throw new Error('closeAmounts greater than origin');
  }
  return closeAmounts.toString();
}

function getCloseFeeBylocal(fees: string): string{
  const originFees = BigNumber.from(fees)
  const closeFees=closestPackableTransactionAmount(fees)
  if (closeFees.gt(originFees)) {
    throw new Error('closeFees greater than origin');
  }
  return closeFees.toString();
}
