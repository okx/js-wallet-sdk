import {
    CalcTxHashParams,
    GetDerivedPathParam,
    NewAddressData,
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
    CalcTxHashError,
    NewAddressError,
    SignMsgError,
    SignTxError,
    GetMpcTransactionError,
    GetMpcRawTransactionError,
    GetHardwareRawTransactionError,
    GetHardwareSignedTransactionError,
    GetHardWareMessageHashError,
    validSignedTransactionError,
    jsonStringifyUniform, ValidPrivateKeyData, ValidPrivateKeyParams, SignCommonMsgParams, buildCommonSignMsg, SignType
} from '@okxweb3/coin-base';
import {base} from '@okxweb3/crypto-lib';
import * as tron from "./index";


export type TrxSignParam = {
    type: "transfer" | "assetTransfer" | "tokenTransfer"
    data: tron.TransferTransactionParams | tron.AssetTransferTransactionParams | tron.TokenTransferTransactionParams
}

function checkPrivateKey(privateKey: string): boolean {
    if (!base.validateHexString(privateKey)){
        return false;
    }
    const keyBytes = base.fromHex(privateKey.toLowerCase());
    return keyBytes.length == 32 && !keyBytes.every(byte=>byte ===0);
}

export class TrxWallet extends BaseWallet {
    async getDerivedPath(param: GetDerivedPathParam): Promise<any> {
        return `m/44'/195'/0'/0/${param.index}`;
    }

    static toHexAddress(address: string): string {
        return tron.toHexAddress(address);
    }

    static toBase58Address(hexAddress: string): string {
        const data = base.fromHex(hexAddress);
        return base.toBase58Check(data);
    }

    async getNewAddress(param: NewAddressParams): Promise<any> {
        try {
            if (!checkPrivateKey(param.privateKey)) {
                return Promise.reject(NewAddressError)
            }
            let pri = param.privateKey;
            if (param.privateKey.startsWith("0x")) {
                pri = base.stripHexPrefix(param.privateKey);
            }
            if (param.privateKey.startsWith("0X")) {
                pri = param.privateKey.substring(2)
            }
            // const privateKey = base.stripHexPrefix(param.privateKey);
            const privateKey = pri;
            const publicKey = tron.getPubKeyFromPriKey(base.fromHex(privateKey))
            let address = tron.addressFromPrivate(privateKey);
            let data: NewAddressData = {
                address: address,
                publicKey: base.toHex(publicKey)
            };
            return Promise.resolve(data);
        } catch (e) {
            return Promise.reject(NewAddressError);
        }
    }

    async validPrivateKey(param: ValidPrivateKeyParams): Promise<any> {
        let isValid = checkPrivateKey(param.privateKey)
        const data: ValidPrivateKeyData = {
            isValid: isValid,
            privateKey: param.privateKey
        };
        return Promise.resolve(data);
    }

    async validAddress(param: ValidAddressParams): Promise<any> {
        let address = param.address;
        let isValid = false;
        try {
            isValid = tron.validateAddress(address);
        } catch (e) {
        }
        return Promise.resolve({
            isValid: isValid,
            address: address
        });
    }

    async signTransaction(param: SignTxParams): Promise<any> {
        try {
            let privateKey = param.privateKey;
            let txParams = param.data as TrxSignParam;

            if (txParams.type === "transfer") {
                const data = txParams.data as tron.TransferTransactionParams
                const tx = tron.transfer(data, privateKey)
                return Promise.resolve(tx)
            } else if (txParams.type === "assetTransfer") {
                const data = txParams.data as tron.AssetTransferTransactionParams
                const tx = tron.assetTransfer(data, privateKey)
                return Promise.resolve(tx)
            } else if (txParams.type === "tokenTransfer") {
                const data = txParams.data as tron.TokenTransferTransactionParams
                const tx = tron.tokenTransfer(data, privateKey)
                return Promise.resolve(tx)
            } else {
                return Promise.reject(SignTxError);
            }
        } catch (e) {
        }
        return Promise.reject(SignTxError);
    }

    // async signCommonMsg(params: SignCommonMsgParams): Promise<any> {
    //     return super.signCommonMsg({privateKey:params.privateKey, message:params.message, signType:SignType.Secp256k1})
    // }

    async signMessage(param: SignTxParams): Promise<string> {
        try {
            const message = base.stripHexPrefix(param.data.message);
            const signedMsg = tron.signMessage(param.data.type, message, param.privateKey, true);
            return Promise.resolve(signedMsg);
        } catch (e) {
        }
        return Promise.reject(SignMsgError);
    }

    static signRawTransaction(param: SignTxParams): Promise<string> {
        try {
            const message = base.stripHexPrefix(param.data.message);
            const signedMsg = tron.signMessage2(message, param.privateKey);
            return Promise.resolve(signedMsg);
        } catch (e) {
        }
        return Promise.reject(SignMsgError);
    }

    async verifyMessage(param: VerifyMessageParams): Promise<boolean> {
        let signature = param.signature;
        let message = param.data as TypedMessage;
        let address = param.address || "";
        return await this.ecRecover(message, signature).then((recoveredAddress) => {
            return new Promise(
                function (resolve, rejected) {
                    resolve(address.toLowerCase() === recoveredAddress.toLowerCase());
                }
            );
        });
    }

    async ecRecover(message: TypedMessage, signature: string): Promise<string> {
        let address = tron.verifySignature(message.message, signature);
        return Promise.resolve(address || "");
    }

    getAddressByPublicKey(param: GetAddressParams): Promise<string> {
        return Promise.resolve(tron.addressFromPublic(param.publicKey));
    }

    async getMPCRawTransaction(param: MpcRawTransactionParam): Promise<any> {
        try {
            return this.signTransaction(param as SignTxParams);
        } catch (e) {
            return Promise.reject(GetMpcRawTransactionError);
        }
    }

    async getMPCTransaction(param: MpcTransactionParam): Promise<string> {
        try {
            const signedTx = tron.getMPCTransaction(param.raw, param.sigs as string, param.publicKey!);
            return Promise.resolve(signedTx);
        } catch (e) {
            return Promise.reject(GetMpcTransactionError);
        }
    }

    async getMPCRawMessage(param: MpcRawTransactionParam): Promise<any> {
        try {
            const msgHash = tron.getUnsignedMessage(param.data.type, param.data.message, true);
            return Promise.resolve({hash: msgHash});
        } catch (e) {
            return Promise.reject(GetMpcRawTransactionError);
        }
    }

    async getMPCSignedMessage(param: MpcMessageParam): Promise<any> {
        try {
            return Promise.resolve(tron.getMPCSignedMessage(param.hash, param.sigs as string, param.publicKey!, param.type! as any, param.message));
        } catch (e) {
            return Promise.reject(GetMpcTransactionError);
        }
    }

    async calcTxHash(param: CalcTxHashParams): Promise<string> {
        try {
            if (typeof param.data === "string") {
                return Promise.resolve(tron.getTxIdBySignedTx(param.data));
            } else {
                const tx = await this.signTransaction(param as SignTxParams);
                return Promise.resolve(tx.hash);
            }
        } catch (e) {
            return Promise.reject(CalcTxHashError);
        }
    }

    async getHardWareRawTransaction(param: SignTxParams): Promise<any> {
        try {
            return this.signTransaction(param);
        } catch (e) {
            return Promise.reject(GetHardwareRawTransactionError);
        }
    }

    async getHardWareSignedTransaction(param: HardwareRawTransactionParam): Promise<any> {
        try {
            const signedTx = tron.getHardwareTransaction(param.raw, param.sig!);
            return Promise.resolve(signedTx);
        } catch (e) {
            return Promise.reject(GetHardwareSignedTransactionError);
        }
    }

    async getHardWareMessageHash(param: SignTxParams): Promise<any> {
        try {
            const message = base.stripHexPrefix(param.data.message);
            const signedMsg = tron.getUnsignedMessage(param.data.type, message, true);
            return Promise.resolve(signedMsg);
        } catch (e) {
        }
        return Promise.reject(GetHardWareMessageHashError);
    }

    async validSignedTransaction(param: ValidSignedTransactionParams): Promise<any> {
        try {
            const publicKey = param.data ? param.data.publicKey : undefined
            const ret = tron.validSignedTransaction(param.tx, publicKey)
            return Promise.resolve(jsonStringifyUniform(ret));
        } catch (e) {
            return Promise.reject(validSignedTransactionError);
        }
    }
}
