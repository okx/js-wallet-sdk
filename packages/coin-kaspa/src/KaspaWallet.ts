import {
    BaseWallet,
    GetDerivedPathParam,
    NewAddressParams,
    ValidAddressParams,
    SignTxParams,
    NotImplementedError,
} from "@okxweb3/coin-base";
import { Address } from "@kaspa/core-lib";

export class KaspaWallet extends BaseWallet {
    async getDerivedPath(param: GetDerivedPathParam): Promise<any> {
        return `m/44'/111111'/0'/0/${param.index}`;
    }

    async getNewAddress(param: NewAddressParams): Promise<any> {
        return Promise.reject(NotImplementedError)
    }

    async validAddress(param: ValidAddressParams): Promise<any> {
        // @ts-ignore
        return Promise.resolve(Address.isValid(param.address, "kaspa"));
    }

    async signTransaction(param: SignTxParams): Promise<any> {
        return Promise.reject(NotImplementedError)
    }
}
