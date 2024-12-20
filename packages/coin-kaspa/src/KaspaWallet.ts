import {
    BaseWallet,
    GetDerivedPathParam,
    NewAddressParams,
    ValidAddressParams,
    SignTxParams,
    SignTxError,
    CalcTxHashParams,
    CalcTxHashError, ValidPrivateKeyParams, ValidPrivateKeyData, SignCommonMsgParams, buildCommonSignMsg, SignType
} from "@okxweb3/coin-base";
import {
    addressFromPrvKey, checkPrvKey,
    pubKeyFromPrvKey,
    validateAddress
} from "./address";
import {transfer, signMessage, calcTxHash} from "./transaction";

export class KaspaWallet extends BaseWallet {
    async getDerivedPath(param: GetDerivedPathParam): Promise<any> {
        return `m/44'/111111'/0'/0/${param.index}`;
    }

    async getNewAddress(param: NewAddressParams): Promise<any> {
        return Promise.resolve({
            address: addressFromPrvKey(param.privateKey.toLowerCase()),
            publicKey: pubKeyFromPrvKey(param.privateKey.toLowerCase()),
        });
    }

    async validPrivateKey(param: ValidPrivateKeyParams): Promise<any> {
        let isValid = checkPrvKey(param.privateKey);
        const data: ValidPrivateKeyData = {
            isValid: isValid,
            privateKey: param.privateKey
        };
        return Promise.resolve(data);
    }

    async validAddress(param: ValidAddressParams): Promise<any> {
        return Promise.resolve({
            isValid: validateAddress(param.address),
            address: param.address,
        });
    }


    async signCommonMsg(params: SignCommonMsgParams): Promise<any> {
        let data;
        if(params.message.text){
            data = params.message.text;
        } else {
            let addr = await this.getNewAddress({privateKey:params.privateKey});
            if(addr.publicKey.startsWith("0x")) {
                addr.publicKey = addr.publicKey.substring(2);
            }
            data = buildCommonSignMsg(addr.publicKey, params.message.walletId);
        }
        return super.signCommonMsg({privateKey:params.privateKey, message:data, signType:SignType.Secp256k1})
    }
    async signTransaction(param: SignTxParams): Promise<any> {
        try {
            return Promise.resolve(transfer(param.data, param.privateKey));
        } catch (e) {
            return Promise.reject(SignTxError);
        }
    }

    async calcTxHash(param: CalcTxHashParams): Promise<any> {
        try {
            if (typeof param.data === "string") {
                return Promise.resolve(calcTxHash(JSON.parse(param.data).transaction));
            }
            return Promise.resolve(calcTxHash(param.data.transaction));
        } catch (e) {
            return Promise.reject(CalcTxHashError);
        }
    }

    async signMessage(param: SignTxParams): Promise<any> {
        try {
            return Promise.resolve(signMessage(param.data.message, param.privateKey));
        } catch (e) {
            return Promise.reject(SignTxError);
        }
    }
}
