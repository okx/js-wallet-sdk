import {
    BaseWallet,
    DerivePriKeyParams,
    ed25519_getRandomPrivateKey,
    ed25519_getDerivedPrivateKey,
    GenPrivateKeyError,
    NewAddressParams,
    NewAddressData,
    NewAddressError,
    ValidAddressParams,
    ValidAddressData,
    SignTxParams,
    SignTxError, GetDerivedPathParam,
} from "@okxweb3/coin-base";
import {
    getAddressBySeed,
    getPubKeyBySeed,
    getVenomAddressBySeed,
    validateAddress,
} from "./address";
import { TxData, transfer, venomTransfer } from "./transaction";

export class TonWallet extends BaseWallet {

    async getDerivedPath(param: GetDerivedPathParam): Promise<any> {
        return `m/44'/605'/0'/0'/${param.index}'`;
    }
    async getRandomPrivateKey(): Promise<any> {
        try {
            return Promise.resolve(ed25519_getRandomPrivateKey(false, "hex"));
        } catch (e) {
            return Promise.reject(GenPrivateKeyError);
        }
    }

    async getDerivedPrivateKey(param: DerivePriKeyParams): Promise<any> {
        try {
            return Promise.resolve(ed25519_getDerivedPrivateKey(param, false, "hex"));
        } catch (e) {
            return Promise.reject(GenPrivateKeyError);
        }
    }

    async getNewAddress(param: NewAddressParams): Promise<any> {
        try {
            const data: NewAddressData = {
                address: getAddressBySeed(param.privateKey),
                publicKey: getPubKeyBySeed(param.privateKey),
            };
            return Promise.resolve(data);
        } catch (e) {
            return Promise.reject(NewAddressError);
        }
    }

    async validAddress(param: ValidAddressParams): Promise<any> {
        const data: ValidAddressData = {
            isValid: validateAddress(param.address),
            address: param.address,
        };
        return Promise.resolve(data);
    }

    async signTransaction(param: SignTxParams): Promise<any> {
        try {
            return transfer(param.data as TxData, param.privateKey);
        } catch (e) {
            return Promise.reject(SignTxError);
        }
    }
}

export class VenomWallet extends TonWallet {
    async getNewAddress(param: NewAddressParams): Promise<any> {
        try {
            const data: NewAddressData = {
                address: getVenomAddressBySeed(param.privateKey),
                publicKey: getPubKeyBySeed(param.privateKey),
            };
            return Promise.resolve(data);
        } catch (e) {
            return Promise.reject(NewAddressError);
        }
    }

    async signTransaction(param: SignTxParams): Promise<any> {
        try {
            return venomTransfer(param.data as TxData, param.privateKey);
        } catch (e) {
            return Promise.reject(SignTxError);
        }
    }
}
