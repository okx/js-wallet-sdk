import {
    CalcTxHashParams,
    GetDerivedPathParam,
    NewAddressParams,
    SignTxParams,
    TypedMessage,
    ValidAddressParams,
    VerifyMessageParams,
    GetAddressParams,
    MpcRawTransactionParam,
    MpcTransactionParam,
    HardwareRawTransactionParam,
    ValidSignedTransactionParams,
    MpcMessageParam,
    BaseWallet,
    NewAddressError,
    SignTxError,
    GetMpcRawTransactionError,
    GetMpcTransactionError,
    GetHardwareRawTransactionError,
    GetHardwareSignedTransactionError,
    validSignedTransactionError,
    assertBufferLength,
    jsonStringifyUniform
} from '@okxweb3/coin-base';
import { abi, base, BigNumber } from '@okxweb3/crypto-lib';
import * as eth from './index';


export type EthEncryptedData = eth.sigUtil.EthEncryptedData

const TOKEN_TRANSFER_FUNCTION_SIGNATURE = '0xa9059cbb';

export type EthTxParams = {
    to: string,
    value: string,
    useValue?: boolean,

    nonce: string,

    contractAddress?: string
    gasPrice: string,
    gasLimit: string,

    data?: string;
    chainId: string;

    // Typed-Transaction features
    // 0: without chainId
    // 1：with chainId；
    // 2：EIP-1559 transaction
    type: number;

    // EIP-2930; Type 1 & EIP-1559; Type 2
    //   accessList?: AccessListish;

    // EIP-1559; Type 2
    maxPriorityFeePerGas: string;
    maxFeePerGas: string;
}

export class EthWallet extends BaseWallet {
    async getDerivedPath(param: GetDerivedPathParam): Promise<any> {
        return `m/44'/60'/0'/0/${param.index}`;
    }

    async getNewAddress(param: NewAddressParams): Promise<any> {
        try {
            const privateKey = base.fromHex(param.privateKey)
            assertBufferLength(privateKey, 32)
            return Promise.resolve(eth.getNewAddress(param.privateKey));
        } catch (e) {
        }
        return Promise.reject(NewAddressError)
    }

    async validAddress(param: ValidAddressParams): Promise<any> {
        return Promise.resolve(eth.validAddress(param.address));
    }

    convert2HexString(data: any): string {
        let n: BigNumber
        if(BigNumber.isBigNumber(data)) {
            n = data
        } else {
            // number or string
            n = new BigNumber(data)
        }
        return base.toBigIntHex(n)
    }

    convert2TxParam(data: any): EthTxParams {
        const param = {
            to: data.to,
            // default: value = 0
            value: this.convert2HexString(data.value || 0),
            nonce: this.convert2HexString(data.nonce),
            contractAddress: data.contractAddress,
            gasPrice: this.convert2HexString(data.gasPrice || 0),
            gasLimit: this.convert2HexString(data.gasLimit || 0),
            data: data.data,
            // default chainId: eth mainnet
            chainId: this.convert2HexString(data.chainId || 1),
            type: data.type || 0,
            maxPriorityFeePerGas: this.convert2HexString(data.maxPriorityFeePerGas || 0),
            maxFeePerGas: this.convert2HexString(data.maxFeePerGas || 0),
            useValue: data.useValue || false
        };
        return param as EthTxParams
    }

    async signTransaction(param: SignTxParams): Promise<any> {
        try {
            const privateKey = param.privateKey;
            if (privateKey) {
                assertBufferLength(base.fromHex(privateKey), 32)
            }

            const txParams = this.convert2TxParam(param.data);
            const chainId = txParams.chainId
            const nonce = txParams.nonce
            const type = txParams.type

            if (type === 0 || type === 1) {
                const gasPrice = txParams.gasPrice
                const tokenAddress = txParams.contractAddress;
                let toAddress = txParams.to;
                let value = txParams.value;
                let data: string | undefined;
                if (tokenAddress) {
                    data = TOKEN_TRANSFER_FUNCTION_SIGNATURE + Array.prototype.map
                        .call(abi.RawEncode(['address', 'uint256'], [toAddress, value],),
                            (x: number) => `00${x.toString(16)}`.slice(-2),
                        ).join('');
                    if(!txParams.useValue) {
                        value = '0x0';
                    }
                    toAddress = tokenAddress;
                } else {
                    data = txParams.data;
                }
                const txData =  {
                    nonce: nonce,
                    gasPrice: gasPrice,
                    gasLimit: txParams.gasLimit,
                    to: toAddress,
                    value: value,
                    data: data,
                    chainId: chainId,
                    type: type,
                };
                return Promise.resolve(eth.signTransaction(privateKey, txData))
            } else if (type === 2) {
                // EIP-1559 transaction fee
                const tokenAddress = txParams.contractAddress;
                let toAddress = txParams.to;
                let value = txParams.value;
                let data: string | undefined;
                if (tokenAddress) {
                    data = TOKEN_TRANSFER_FUNCTION_SIGNATURE + Array.prototype.map
                        .call(abi.RawEncode(['address', 'uint256'], [toAddress, value],),
                            (x: number) => `00${x.toString(16)}`.slice(-2),
                        ).join('');
                    value = '0x0';
                    toAddress = tokenAddress;
                } else {
                    data = txParams.data;
                }
                const txData = {
                    nonce: nonce,
                    gasLimit: txParams.gasLimit,
                    to: toAddress,
                    value: value,
                    data: data,
                    chainId: chainId,
                    type: type,
                    maxPriorityFeePerGas: txParams.maxPriorityFeePerGas,
                    maxFeePerGas: txParams.maxFeePerGas,
                };
                return Promise.resolve(eth.signTransaction(privateKey, txData))
            }
            return Promise.reject(SignTxError)
        } catch (e) {
            return Promise.reject(SignTxError)
        }
    }

    async signMessage(param: SignTxParams): Promise<string> {
        let privateKey;
        if (param.privateKey) {
            assertBufferLength(base.fromHex(param.privateKey), 32)
            privateKey = base.fromHex(param.privateKey)
        }
        const data = param.data as TypedMessage;
        const t = data.type as eth.MessageTypes
        const result = eth.signMessage(t, data.message, privateKey as Buffer);
        return Promise.resolve(result);
    }

    async verifyMessage(param: VerifyMessageParams): Promise<boolean> {
        const d = param.data as TypedMessage;
        const r = await this.ecRecover(d, param.signature)
        const address = param.address || '';
        return Promise.resolve(address.toLowerCase() === r.toLowerCase())
    }

    async ecRecover(message: TypedMessage, signature: string): Promise<string> {
        const t = message.type as eth.MessageTypes
        const publicKey = eth.verifyMessage(t, message.message, base.fromHex(signature))
        const address = base.toHex(eth.publicToAddress(publicKey), true)
        return Promise.resolve(address)
    }

    // publicKey base64 encode
    // data utf8 encode
    // version
    async encrypt(publicKey: string, data: string, version: string): Promise<EthEncryptedData> {
        return Promise.resolve(eth.sigUtil.encrypt({
            publicKey: publicKey,
            data: data,
            version: version,
        }))
    }

    // encryptedData: EthEncryptedData;
    // privateKey hex
    async decrypt(encryptedData: EthEncryptedData, privateKey: string): Promise<string> {
        return Promise.resolve(eth.sigUtil.decrypt({
            encryptedData: encryptedData as any,
            privateKey: base.stripHexPrefix(privateKey),
        }))
    }

    async getEncryptionPublicKey(privateKey: string): Promise<string> {
        return Promise.resolve(eth.sigUtil.getEncryptionPublicKey(base.stripHexPrefix(privateKey)))
    }

    getAddressByPublicKey(param: GetAddressParams): Promise<string> {
        return Promise.resolve(base.toHex(eth.publicToAddress(base.fromHex(param.publicKey), true), true));
    }

    async getMPCRawTransaction(param: MpcRawTransactionParam): Promise<any> {
        try {
            const mpcRaw = await this.signTransaction(param as SignTxParams);
            return Promise.resolve({
                raw: mpcRaw.raw,
                hash: mpcRaw.hash,
            });
        } catch (e) {
            return Promise.reject(GetMpcRawTransactionError);
        }
    }

    async getMPCTransaction(param: MpcTransactionParam): Promise<any> {
        try {
            const signedTx = eth.getMPCTransaction(param.raw, param.sigs as string, param.publicKey!);
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
            return Promise.resolve(eth.getMPCSignedMessage(param.hash, param.sigs as string, param.publicKey!));
        } catch (e) {
            return Promise.reject(GetMpcTransactionError);
        }
    }

    async getHardWareRawTransaction(param: SignTxParams): Promise<any> {
        try {
            const rawTx = await this.signTransaction(param as SignTxParams);
            return Promise.resolve(rawTx.serializeRaw);
        } catch (e) {
            return Promise.reject(GetHardwareRawTransactionError);
        }
    }

    // BTC does not need to implement this interface. Hardware wallets can directly generate and broadcast transactions.
    async getHardWareSignedTransaction(param: HardwareRawTransactionParam): Promise<any> {
        try {
            return eth.getSignedTransaction(param.raw, param.r!, param.s!, param.v!);
        } catch (e) {
            return Promise.reject(GetHardwareSignedTransactionError);
        }
    }

    async calcTxHash(param: CalcTxHashParams): Promise<string> {
        const serializedData = base.fromHex(param.data);
        const signedTx = eth.TransactionFactory.fromSerializedData(serializedData);
        return Promise.resolve(base.toHex(signedTx.hash(), true));
    }

    async validSignedTransaction(param: ValidSignedTransactionParams): Promise<any> {
        try {
            const chainId = param.data? param.data.chainId : undefined
            const publicKey = param.data? param.data.publicKey : undefined
            const ret = eth.validSignedTransaction(param.tx, chainId, publicKey)
            return Promise.resolve(jsonStringifyUniform(ret));
        }  catch (e) {
            return Promise.reject(validSignedTransactionError);
        }
    }
}
