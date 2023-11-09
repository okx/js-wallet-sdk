import { SignTxError, SignTxParams } from '@okxweb3/coin-base';
import { EthWallet } from '@okxweb3/coin-ethereum';
import {
  closestPackableTransactionAmount,
  closestPackableTransactionFee,
  zksyncChangePubkey,
  zksyncTransfer,
} from './index';


export class ZksyncWallet extends EthWallet {
  async signTransaction(param: SignTxParams): Promise<any> {
    try {
      let result;
      const data: ZksyncSignParam = param.data
      const fees_number=parseInt(data.fees)
      const closeFees_number = getCloseFeeBylocal(data.fees);
      if (closeFees_number != fees_number) {
        let rejectParam = {
          code: '402',
          reason: 'Fee is not packable',
          closeFees_number:closeFees_number
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
        const amounts_number = parseInt(data.amounts);
        const closeAmount_number = getCloseAmountsByLocal(data.amounts);
        if (closeAmount_number != amounts_number) {
          let rejectParam = {
            code: '401',
            reason: 'Amount is not packable',
            closeAmount_number: closeAmount_number,
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
  const originAmounts=parseInt(amounts)
  const hexString=closestPackableTransactionAmount(amounts)
  // @ts-ignore
  const closeAmounts = parseInt(hexString, 10);
  if (closeAmounts > originAmounts) {
    throw new Error('closeAmounts great than origin');
  }
  return closeAmounts;
}

function getCloseFeeBylocal(fees: string) {
  const originFee=parseInt(fees)
  const hexString=closestPackableTransactionFee(fees)
  // @ts-ignore
  const closeFee = parseInt(hexString, 10);
  if (closeFee > originFee) {
    throw new Error('closeFee great than origin');
  }
  return closeFee;
}
