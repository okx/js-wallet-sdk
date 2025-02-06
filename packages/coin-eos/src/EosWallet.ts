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
    assertBufferLength, ValidPrivateKeyParams, ValidPrivateKeyData, SignCommonMsgParams, buildCommonSignMsg, SignType
} from '@okxweb3/coin-base';
import {base, signUtil} from '@okxweb3/crypto-lib';
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
    transfer, signSerializedTransaction,
} from "./index";

export class EosWallet extends BaseWallet {
    getAmountString(amount: string | number, precision?: number, symbol?: string) {
        // return toAssetString(Number(amount), 4, 'EOS');
        precision = precision == null || undefined ? 4 : precision
        symbol = symbol == null || undefined ? 'EOS' : symbol
        return toAssetString(Number(amount), precision, symbol);
    }

    getTokenAmountString(amount: string | number, precision: number, symbol: string) {
        return toAssetString(Number(amount), precision, symbol);
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

    async validPrivateKey(param: ValidPrivateKeyParams): Promise<any> {
        let isValid;
        try {
           const privateKey = stringToPrivateKey(param.privateKey);
            isValid = privateKey.data.length == privateKeyDataSize && !privateKey.data.every(byte=>byte===0);
        } catch (e) {
            isValid = false
        }
        const data: ValidPrivateKeyData = {
            isValid: isValid,
            privateKey: param.privateKey
        };
        return Promise.resolve(data);
    }


    validAddress(param: ValidAddressParams): Promise<any> {
        throw new Error('Method not implemented.');
    }

    async signCommonMsg(params: SignCommonMsgParams): Promise<any> {
        let data;
        const privateKey = stringToPrivateKey(params.privateKey);
        const publicKey = signUtil.secp256k1.publicKeyCreate(privateKey.data, true);
        let publicKeyHex = base.toHex(publicKey);
        let sig = await super.signCommonMsg({privateKey:base.toHex(privateKey.data),publicKey:publicKeyHex, message:params.message, signType:SignType.Secp256k1});
        return Promise.resolve(`${sig},${publicKeyHex}`)
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
            } else if (type === 2) {
                let privateKeys: string[] = [];
                if (param.data.requiredKeys) {
                    for (let i = 0; i < param.data.requiredKeys.length; i++) {
                        privateKeys.push(param.privateKey);
                    }
                }
                if (privateKeys.length == 0) {
                    privateKeys.push(param.privateKey);
                }
                const signatures = signSerializedTransaction(param.data.chainId, privateKeys, param.data.serializedTransaction);
                return Promise.resolve({
                    signatures: signatures,
                    serializedTransaction: param.data.serializedTransaction
                });
            } else { // transfer
                const transferParam: TransferParam = {
                    from: param.data.from,
                    to: param.data.to,
                    amount: this.getAmountString(param.data.amount, param.data.precision, param.data.symbol),
                    memo: param.data.memo,
                    contract: param.data.contract,
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
    getAmountString(amount: string | number, precision?: number, symbol?: string) {
        // return toAssetString(Number(amount), 8, 'WAX');
        precision = precision == null || undefined ? 8 : precision
        symbol = symbol == null || undefined ? 'WAX' : symbol
        return toAssetString(Number(amount), precision, symbol);
    }

    async getDerivedPath(param: GetDerivedPathParam): Promise<any> {
        return `m/44'/14001'/0'/0/${param.index}`;
    }
}
