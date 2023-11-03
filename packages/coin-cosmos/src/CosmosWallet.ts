import {
  CalcTxHashParams,
  GetDerivedPathParam,
  NewAddressData,
  NewAddressParams,
  SignTxParams,
  ValidAddressData,
  ValidAddressParams,
  GetAddressParams,
  MpcRawTransactionParam,
  MpcTransactionParam,
  ValidSignedTransactionParams,
  MpcMessageParam,
  BaseWallet,
  CalcTxHashError,
  NewAddressError,
  SignMsgError,
  SignTxError,
  GetMpcRawTransactionError,
  GetMpcTransactionError,
  validSignedTransactionError,
  jsonStringifyUniform
} from '@okxweb3/coin-base';
import { base } from '@okxweb3/crypto-lib';
import {
  AminoConverters,
  amount2Coin,
  amount2Coins,
  amount2StdFee,
  GammAminoConverters,
  GammRegistry,
  GeneratedType,
  getNewAddress,
  Height,
  private2Public,
  sendIBCToken,
  sendToken,
  SignWithSignDoc,
  signWithStdSignDoc,
  validateAddress,
  addressFromPublic,
  getMPCTransaction,
  validSignedTransaction,
  getMPCSignedMessage,
} from './index';

export interface CosmosTransferParam {
  fromAddress: string
  toAddress: string
  demon: string
  amount: number
}

export interface CosmosIbcTransferParam extends CosmosTransferParam{
  sourcePort: string
  sourceChannel: string
  ibcTimeoutHeight?: Height
  ibcTimeoutTimestamp?: number
}

export type CosmosSignParam = {
  type: "transfer" | "ibcTransfer"
  chainId: string
  sequence: number
  accountNumber: number
  feeDemon: string
  feeAmount: number
  gasLimit: number
  memo: string
  timeoutHeight?: number
  data: any
  publicKey?: string
}

export interface SignMessageData {
  type: "amino" | "signDoc"
  data: string
}

export abstract class CosmosWallet extends BaseWallet {
  abstract supportEthSign(): boolean
  abstract getPrefix(): string
  abstract getSlip44CoinType(): number
  abstract getAminoConverters(): AminoConverters | undefined
  abstract getExtraTypes(): ReadonlyArray<[string, GeneratedType]> | undefined
  abstract pubKeyUrl(): string | undefined

  async getDerivedPath(param: GetDerivedPathParam): Promise<any> {
    return `m/44'/${this.getSlip44CoinType()}'/0'/0/${param.index}`;
  }

  async getNewAddress(param: NewAddressParams): Promise<any> {
    try {
      const privateKey = base.fromHex(param.privateKey)
      const ethSign = this.supportEthSign()
      const publicKey = private2Public(privateKey, !ethSign)
      const address = getNewAddress(privateKey, this.getPrefix(), ethSign)
      const data: NewAddressData = {
        address: address,
        publicKey: base.toHex(publicKey)
      };
      return Promise.resolve(data);
    } catch (e) {
      return Promise.reject(NewAddressError);
    }
  }

  async validAddress(param: ValidAddressParams): Promise<any> {
    const data: ValidAddressData = {
      isValid: validateAddress(param.address, this.getPrefix()),
      address: param.address
    };
    return Promise.resolve(data);
  }

  async signTransaction(param: SignTxParams): Promise<any> {
    try {
      const ethSign = this.supportEthSign()
      const pubKeyUrl = this.pubKeyUrl();
      const privateKey = (param.privateKey && base.fromHex(param.privateKey)) as Buffer
      const common = param.data as CosmosSignParam

      if(common.type === "transfer") {
        const transfer = common.data as CosmosTransferParam
        const amount = amount2Coins(transfer.demon, transfer.amount)
        const fee = amount2StdFee(common.feeDemon, common.feeAmount, common.gasLimit)
        const result = await sendToken(
          privateKey,
          common.chainId,
          common.sequence,
          common.accountNumber,
          transfer.fromAddress,
          transfer.toAddress,
          amount,
          fee,
          common.timeoutHeight,
          common.memo,
          ethSign,
          common.publicKey, pubKeyUrl)
        return Promise.resolve(result);
      } else if(common.type === "ibcTransfer") {
        const transfer = common.data as CosmosIbcTransferParam
        const amount = amount2Coin(transfer.demon, transfer.amount)
        const fee = amount2StdFee(common.feeDemon, common.feeAmount, common.gasLimit)
        const result = await sendIBCToken(
          privateKey,
          common.chainId,
          common.sequence,
          common.accountNumber,
          transfer.fromAddress,
          transfer.toAddress,
          amount,
          transfer.sourcePort,
          transfer.sourceChannel,
          fee,
          common.timeoutHeight,
          transfer.ibcTimeoutHeight,
          transfer.ibcTimeoutTimestamp,
          common.memo,
          ethSign,
          common.publicKey, pubKeyUrl)
        return Promise.resolve(result);
      }
    } catch (e) {
    }
    return Promise.reject(SignTxError);
  }

  async signMessage(param: SignTxParams): Promise<string> {
    try {
      const ethSign = this.supportEthSign()
      let privateKey;
      if (param.privateKey) {
        privateKey = base.fromHex(param.privateKey);
      }
      const message = param.data as SignMessageData
      if (message.type == "amino") {
        const result = await signWithStdSignDoc(privateKey as Buffer, message.data, ethSign)
        return Promise.resolve(result);
      } else {
        const result = await SignWithSignDoc(privateKey as Buffer, message.data, ethSign)
        return Promise.resolve(result);
      }
    } catch (e) {
      return Promise.reject(SignMsgError);
    }
  }

  getAddressByPublicKey(param: GetAddressParams): Promise<string> {
    return Promise.resolve(addressFromPublic(param.publicKey, this.getPrefix(), this.supportEthSign()));
  }

  async getMPCRawTransaction(param: MpcRawTransactionParam): Promise<any> {
    try {
      const mpcRaw = await this.signTransaction(param as SignTxParams);
      return Promise.resolve({
        raw: mpcRaw.doc,
        hash: mpcRaw.hash,
      });
    } catch (e) {
      return Promise.reject(GetMpcRawTransactionError);
    }
  }

  async getMPCTransaction(param: MpcTransactionParam): Promise<string> {
    try {
      const ethSign = this.supportEthSign();
      const signedTx = getMPCTransaction(param.raw, param.sigs as string, param.publicKey!, ethSign);
      return Promise.resolve(signedTx);
    } catch (e) {
      return Promise.reject(GetMpcTransactionError);
    }
  }

  async getMPCRawMessage(param: MpcRawTransactionParam): Promise<any> {
    try {
      const msgHash = await this.signMessage(param as SignTxParams);
      return Promise.resolve({ hash: msgHash });
    } catch (e) {
      return Promise.reject(GetMpcRawTransactionError);
    }
  }

  async getMPCSignedMessage(param: MpcMessageParam): Promise<any> {
    try {
      const ethSign = this.supportEthSign()
      return Promise.resolve(getMPCSignedMessage(param.hash, param.sigs as string, param.publicKey!, ethSign));
    } catch (e) {
      return Promise.reject(GetMpcTransactionError);
    }
  }

  async calcTxHash(param: CalcTxHashParams): Promise<string> {
    try {
      const signedTx = base.fromBase64(param.data as string);
      const txHash = base.toHex(base.sha256(signedTx)).toUpperCase();
      return Promise.resolve(txHash);
    } catch (e) {
      return Promise.reject(CalcTxHashError);
    }
  }

  async validSignedTransaction(param: ValidSignedTransactionParams): Promise<any> {
    try {
      const skipCheckSign = param.data ? param.data.skipCheckSign : undefined
      const ret = validSignedTransaction(param.tx, param.data.chainId, param.data.accountNumber, this.supportEthSign(), skipCheckSign || false)
      return Promise.resolve(jsonStringifyUniform(ret))
    } catch (e) {
      return Promise.reject(validSignedTransactionError);
    }
  }
}

export class AtomWallet extends CosmosWallet {
  getPrefix(): string {
    return 'cosmos';
  }

  supportEthSign(): boolean {
    return false;
  }

  getAminoConverters(): AminoConverters | undefined {
    return undefined;
  }

  getExtraTypes(): ReadonlyArray<[string, GeneratedType]> | undefined {
    return undefined;
  }

  getSlip44CoinType(): number {
    return 118;
  }

  pubKeyUrl(): string | undefined {
    return undefined;
  }
}

export class OsmoWallet extends CosmosWallet {
  getPrefix(): string {
    return 'osmo';
  }

  supportEthSign(): boolean {
    return false;
  }

  getAminoConverters(): AminoConverters | undefined {
    return GammAminoConverters;
  }

  getExtraTypes(): ReadonlyArray<[string, GeneratedType]> | undefined {
    return GammRegistry;
  }

  getSlip44CoinType(): number {
    return 118;
  }

  pubKeyUrl(): string | undefined {
    return undefined;
  }
}

export class EvmosWallet extends CosmosWallet {
  getPrefix(): string {
    return 'evmos';
  }

  // evmos use ethermint
  supportEthSign(): boolean {
    return true;
  }

  getAminoConverters(): AminoConverters | undefined {
    return undefined;
  }

  getExtraTypes(): ReadonlyArray<[string, GeneratedType]> | undefined {
    return undefined;
  }

  getSlip44CoinType(): number {
    return 60;
  }

  pubKeyUrl(): string | undefined {
    return undefined;
  }
}

export class AxelarWallet extends CosmosWallet {
  getPrefix(): string {
    return 'axelar';
  }

  supportEthSign(): boolean {
    return false;
  }

  getAminoConverters(): AminoConverters | undefined {
    return undefined;
  }

  getExtraTypes(): ReadonlyArray<[string, GeneratedType]> | undefined {
    return undefined;
  }

  getSlip44CoinType(): number {
    return 118;
  }

  pubKeyUrl(): string | undefined {
    return undefined;
  }
}

export class CronosWallet extends CosmosWallet {
  getPrefix(): string {
    return 'cro';
  }

  supportEthSign(): boolean {
    return false;
  }

  getAminoConverters(): AminoConverters | undefined {
    return undefined;
  }

  getExtraTypes(): ReadonlyArray<[string, GeneratedType]> | undefined {
    return undefined;
  }

  getSlip44CoinType(): number {
    return 394;
  }

  pubKeyUrl(): string | undefined {
    return undefined;
  }
}

export class IrisWallet extends CosmosWallet {
  getPrefix(): string {
    return 'iaa';
  }

  supportEthSign(): boolean {
    return false;
  }

  getAminoConverters(): AminoConverters | undefined {
    return undefined;
  }

  getExtraTypes(): ReadonlyArray<[string, GeneratedType]> | undefined {
    return undefined;
  }

  getSlip44CoinType(): number {
    return 118;
  }

  pubKeyUrl(): string | undefined {
    return undefined;
  }
}

export class JunoWallet extends CosmosWallet {
  getPrefix(): string {
    return 'juno';
  }

  supportEthSign(): boolean {
    return false;
  }

  getAminoConverters(): AminoConverters | undefined {
    return undefined;
  }

  getExtraTypes(): ReadonlyArray<[string, GeneratedType]> | undefined {
    return undefined;
  }

  getSlip44CoinType(): number {
    return 118;
  }

  pubKeyUrl(): string | undefined {
    return undefined;
  }
}

export class KavaWallet extends CosmosWallet {
  getPrefix(): string {
    return 'kava';
  }

  supportEthSign(): boolean {
    return false;
  }

  getAminoConverters(): AminoConverters | undefined {
    return undefined;
  }

  getExtraTypes(): ReadonlyArray<[string, GeneratedType]> | undefined {
    return undefined;
  }

  getSlip44CoinType(): number {
    return 459;
  }

  pubKeyUrl(): string | undefined {
    return undefined;
  }
}

export class KujiraWallet extends CosmosWallet {
  getPrefix(): string {
    return 'kujira';
  }

  supportEthSign(): boolean {
    return false;
  }

  getAminoConverters(): AminoConverters | undefined {
    return undefined;
  }

  getExtraTypes(): ReadonlyArray<[string, GeneratedType]> | undefined {
    return undefined;
  }

  getSlip44CoinType(): number {
    return 118;
  }

  pubKeyUrl(): string | undefined {
    return undefined;
  }
}

export class SecretWallet extends CosmosWallet {
  getPrefix(): string {
    return 'secret';
  }

  supportEthSign(): boolean {
    return false;
  }

  getAminoConverters(): AminoConverters | undefined {
    return undefined;
  }

  getExtraTypes(): ReadonlyArray<[string, GeneratedType]> | undefined {
    return undefined;
  }

  getSlip44CoinType(): number {
    return 529;
  }

  pubKeyUrl(): string | undefined {
    return undefined;
  }
}

export class StargazeWallet extends CosmosWallet {
  getPrefix(): string {
    return 'stars';
  }

  supportEthSign(): boolean {
    return false;
  }

  getAminoConverters(): AminoConverters | undefined {
    return undefined;
  }

  getExtraTypes(): ReadonlyArray<[string, GeneratedType]> | undefined {
    return undefined;
  }

  getSlip44CoinType(): number {
    return 118;
  }

  pubKeyUrl(): string | undefined {
    return undefined;
  }
}

export class TerraWallet extends CosmosWallet {
  getPrefix(): string {
    return 'terra';
  }

  supportEthSign(): boolean {
    return false;
  }

  getAminoConverters(): AminoConverters | undefined {
    return undefined;
  }

  getExtraTypes(): ReadonlyArray<[string, GeneratedType]> | undefined {
    return undefined;
  }

  getSlip44CoinType(): number {
    return 330;
  }

  pubKeyUrl(): string | undefined {
    return undefined;
  }
}

export class SeiWallet extends CosmosWallet {
  getPrefix(): string {
    return 'sei';
  }

  supportEthSign(): boolean {
    return false;
  }

  getAminoConverters(): AminoConverters | undefined {
    return undefined;
  }

  getExtraTypes(): ReadonlyArray<[string, GeneratedType]> | undefined {
    return undefined;
  }

  getSlip44CoinType(): number {
    return 118;
  }

  pubKeyUrl(): string | undefined {
    return undefined;
  }
}

export class DydxWallet extends CosmosWallet {
  getPrefix(): string {
    return 'dydx';
  }

  supportEthSign(): boolean {
    return false;
  }

  getAminoConverters(): AminoConverters | undefined {
    return undefined;
  }

  getExtraTypes(): ReadonlyArray<[string, GeneratedType]> | undefined {
    return undefined;
  }

  getSlip44CoinType(): number {
    return 118;
  }

  pubKeyUrl(): string | undefined {
    return undefined;
  }
}

export class InjectiveWallet extends CosmosWallet {
  getPrefix(): string {
    return 'inj';
  }

  supportEthSign(): boolean {
    return true;
  }

  getAminoConverters(): AminoConverters | undefined {
    return undefined;
  }

  getExtraTypes(): ReadonlyArray<[string, GeneratedType]> | undefined {
    return undefined;
  }

  getSlip44CoinType(): number {
    return 60;
  }

  pubKeyUrl(): string | undefined {
    return "/injective.crypto.v1beta1.ethsecp256k1.PubKey";
  }
}

export class CelestiaWallet extends CosmosWallet {
  getPrefix(): string {
    return 'celestia';
  }

  supportEthSign(): boolean {
    return false;
  }

  getAminoConverters(): AminoConverters | undefined {
    return undefined;
  }

  getExtraTypes(): ReadonlyArray<[string, GeneratedType]> | undefined {
    return undefined;
  }

  getSlip44CoinType(): number {
    return 118;
  }

  pubKeyUrl(): string | undefined {
    return undefined;
  }
}

export class DydxWallet extends CosmosWallet {
  getPrefix(): string {
    return 'dydx';
  }

  supportEthSign(): boolean {
    return false;
  }

  getAminoConverters(): AminoConverters | undefined {
    return undefined;
  }

  getExtraTypes(): ReadonlyArray<[string, GeneratedType]> | undefined {
    return undefined;
  }

  getSlip44CoinType(): number {
    return 118;
  }
}

export class InjectiveWallet extends CosmosWallet {
  getPrefix(): string {
    return 'inj';
  }

  supportEthSign(): boolean {
    return true;
  }

  getAminoConverters(): AminoConverters | undefined {
    return undefined;
  }

  getExtraTypes(): ReadonlyArray<[string, GeneratedType]> | undefined {
    return undefined;
  }

  getSlip44CoinType(): number {
    return 60;
  }
}

export class CelestiaWallet extends CosmosWallet {
  getPrefix(): string {
    return 'celestia';
  }

  supportEthSign(): boolean {
    return false;
  }

  getAminoConverters(): AminoConverters | undefined {
    return undefined;
  }

  getExtraTypes(): ReadonlyArray<[string, GeneratedType]> | undefined {
    return undefined;
  }

  getSlip44CoinType(): number {
    return 118;
  }
}
