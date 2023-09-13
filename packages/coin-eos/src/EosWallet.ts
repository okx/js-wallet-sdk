import {
  CalcTxHashParams,
  DerivePriKeyParams,
  GetDerivedPathParam,
  NewAddressParams,
  SignTxParams,
  ValidAddressParams,
  CalcTxHashError,
  NewAddressError,
  SignTxError,
  BaseWallet,
  assertBufferLength
} from '@okxweb3/coin-base';
import { base, signUtil } from '@okxweb3/crypto-lib';
import {
  KeyType,
  TransferParam,
  CreateAccountParam,
  privateKeyDataSize,
  getTxId,
  toAssetString,
  createAccount,
  stringToPrivateKey,
  publicKeyToLegacyString,
  privateKeyToLegacyString,
  transfer,
} from "./index";

export class EosWallet extends BaseWallet {
  getAmountString(amount: string | number) {
    return toAssetString(Number(amount), 4, 'EOS');
  }

  async getRandomPrivateKey(): Promise<any> {
    return Promise.resolve(privateKeyToLegacyString({
      type: KeyType.k1,
      data: base.fromHex(await super.getRandomPrivateKey()),
    }));
  }

  async getDerivedPrivateKey(param: DerivePriKeyParams): Promise<any> {
    return Promise.resolve(privateKeyToLegacyString({
      type: KeyType.k1,
      data: base.fromHex(await super.getDerivedPrivateKey(param)),
    }));
  }

  async getDerivedPath(param: GetDerivedPathParam): Promise<any> {
    return `m/44'/194'/0'/0/${param.index}`;
  }

  async getNewAddress(param: NewAddressParams): Promise<any> {
    try {
      const privateKey = stringToPrivateKey(param.privateKey);
      assertBufferLength(privateKey.data, privateKeyDataSize);
      const publicKey = signUtil.secp256k1.publicKeyCreate(privateKey.data, true);
      return Promise.resolve({
        address: "",
        publicKey: publicKeyToLegacyString({
          type: KeyType.k1,
          data: publicKey,
        }),
      });
    } catch (e) {
    }
    return Promise.reject(NewAddressError);
  }

  validAddress(param: ValidAddressParams): Promise<any> {
    throw new Error('Method not implemented.');
  }

  async signTransaction(param: SignTxParams): Promise<any> {
    try {
      const type = param.data.type;
      if (type === 1) { // create account
        const createAccountParam: CreateAccountParam = {
          creator: param.data.creator,
          newAccount: param.data.newAccount,
          pubKey: param.data.pubKey,
          buyRam: {
            ...param.data.buyRam,
            quantity: this.getAmountString(param.data.buyRam.quantity),
          },
          delegate: {
            ...param.data.delegate,
            stakeNet: this.getAmountString(param.data.delegate.stakeNet),
            stakeCPU: this.getAmountString(param.data.delegate.stakeCPU),
          },
          common: {
            ...param.data.common,
            privateKey: [param.privateKey],
          },
        };

        return Promise.resolve(createAccount(createAccountParam));
      } else { // transfer
        const transferParam: TransferParam = {
          from: param.data.from,
          to: param.data.to,
          amount: this.getAmountString(param.data.amount),
          memo: param.data.memo,
          common: {
            ...param.data.common,
            privateKey: [param.privateKey],
          },
        };

        return Promise.resolve(transfer(transferParam));
      }
    } catch (e) {
      return Promise.reject(SignTxError);
    }
  }

  calcTxHash(param: CalcTxHashParams): Promise<string> {
    try {
      const tx = typeof param.data === "string" ? JSON.parse(param.data) : param.data;
      return Promise.resolve(getTxId(tx));
    } catch (e) {
      return Promise.reject(CalcTxHashError);
    }
  }
}

export class WaxWallet extends EosWallet {
  getAmountString(amount: number) {
    return toAssetString(amount, 8, 'WAX');
  }

  async getDerivedPath(param: GetDerivedPathParam): Promise<any> {
    return `m/44'/14001'/0'/0/${param.index}`;
  }
}
