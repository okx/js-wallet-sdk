import {
    BaseWallet,
    GetDerivedPathParam,
    NewAddressParams,
    ValidAddressParams,
    SignTxParams,
    SignTxError,
    CalcTxHashParams,
    CalcTxHashError
} from "@okxweb3/coin-base";
import {
    addressFromPrvKey,
    pubKeyFromPrvKey,
    validateAddress
} from "./address";
import { transfer, signMessage, calcTxHash } from "./transaction";

export class KaspaWallet extends BaseWallet {
    async getDerivedPath(param: GetDerivedPathParam): Promise<any> {
        return `m/44'/111111'/0'/0/${param.index}`;
    }

    async getNewAddress(param: NewAddressParams): Promise<any> {
        return Promise.resolve({
            address: addressFromPrvKey(param.privateKey),
            publicKey: pubKeyFromPrvKey(param.privateKey),
        });
    }

    async validAddress(param: ValidAddressParams): Promise<any> {
        return Promise.resolve({
            isValid: validateAddress(param.address),
            address: param.address,
        });
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
