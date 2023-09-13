import { SignTxError, SignTxParams } from '@okxweb3/coin-base';
import { EthWallet } from '@okxweb3/coin-ethereum';
import * as zkspace from './index';


export class ZkspaceWallet extends EthWallet {
  async signTransaction(param: SignTxParams): Promise<any> {
    try {
      let result: any;
      const data: ZkspaceSignParam = param.data;
      if (data.type === 'transfer') {
        if (data.from == null || data.to == null) {
          return Promise.reject(SignTxError);
        }
        result = zkspace.transfer(
          param.privateKey,
          data.from,
          data.nonce,
          data.accountId,
          data.chainId,
          data.to,
          data.tokenId,
          data.tokenSymbol,
          data.decimals,
          data.feeTokenId,
          data.feeTokenSymbol,
          data.feeDecimals,
          data.amounts,
          data.fee,
        );
      } else if (data.type === 'changePubkey') {
        if (data.from == null || data.nonce == null || data.accountId == null) {
          return Promise.reject(SignTxError);
        }
        result = zkspace.changePubkey(
          param.privateKey,
          data.from,
          data.nonce,
          data.accountId,
        );
      } else {
        return Promise.reject(SignTxError);
      }

      return Promise.resolve(result);
    } catch (e) {
      return Promise.reject(SignTxError);
    }
  }
}

export type ZkspaceTransactionType = 'transfer' | 'changePubkey';
export type ZkspaceSignParam = {
  type: ZkspaceTransactionType;
  accountId: number;
  nonce: number;
  from: string;
  chainId: number;
  to: string;
  tokenId: number;
  tokenSymbol: string;
  decimals: number;
  feeTokenId: number;
  feeTokenSymbol: string;
  feeDecimals: number;
  amounts: string;
  fee: string;
};
