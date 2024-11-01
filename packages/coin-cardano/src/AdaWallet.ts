import {BaseWallet, ValidPrivateKeyData, ValidPrivateKeyParams} from "@okxweb3/coin-base";
import {
    CalcTxHashParams,
    DerivePriKeyParams,
    GetDerivedPathParam,
    NewAddressData,
    NewAddressParams,
    SignTxParams,
    ValidAddressData,
    ValidAddressParams,
} from "@okxweb3/coin-base";
import {
    CalcTxHashError,
    GenPrivateKeyError,
    NewAddressError,
    SignTxError,
} from "@okxweb3/coin-base";
import { base,signUtil } from "@okxweb3/crypto-lib";
import {getNewAddress, pubKeyFromPrivateKey, getDerivedPrivateKey, checkPrivateKey} from "./account";
import { calcTxHash, transfer, minAda, MultiAssetData, TxData, minFee, signTx, signData } from "./transaction";

export class AdaWallet extends BaseWallet {
    async getDerivedPath(param: GetDerivedPathParam): Promise<any> {
        return `m/1852'/1815'/0'/0/${param.index}`;
    }

    async getRandomPrivateKey(): Promise<any> {
        try {
            return Promise.resolve(signUtil.ed25519.ed25519_getRandomPrivateKey(false, "hex"))
        } catch (e) {
            return Promise.reject(GenPrivateKeyError);
        }
    }

    async getDerivedPrivateKey(param: DerivePriKeyParams): Promise<any> {
        try {
            const key = await getDerivedPrivateKey(param.mnemonic, param.hdPath);
            return Promise.resolve(key);
        } catch (e) {
            return Promise.reject(GenPrivateKeyError);
        }
    }

    async getNewAddress(param: NewAddressParams): Promise<any> {
        try {
            const address = await getNewAddress(param.privateKey)
            let data: NewAddressData = {
                address: address,
                publicKey: await pubKeyFromPrivateKey(param.privateKey)
            };
            return Promise.resolve(data);
        } catch (e) {
            return Promise.reject(NewAddressError)
        }
    }

    async validPrivateKey(param: ValidPrivateKeyParams): Promise<any> {
        let isValid = await checkPrivateKey(param.privateKey);
        const data: ValidPrivateKeyData = {
            isValid: isValid,
            privateKey: param.privateKey
        };
        return Promise.resolve(data);
    }


    async validAddress(param: ValidAddressParams): Promise<any> {
        let isValid: boolean;
        try {
            const [hrp, data] = base.fromBech32(param.address, false);
            isValid = hrp === "addr" && data.length > 0;
        } catch (e) {
            isValid = false;
        }

        let data: ValidAddressData = {
            isValid: isValid,
            address: param.address,
        };
        return Promise.resolve(data);
    }

    async signTransaction(param: SignTxParams): Promise<any> {
        try {
            const data: TxData = param.data;
            if (data.type === "rawTx") {
                return signTx(data.tx!, data.privateKey || param.privateKey)
            }
            return transfer(data);
        } catch (e) {
            return Promise.reject(SignTxError);
        }
    }

    async calcTxHash(param: CalcTxHashParams): Promise<string> {
        try {
            return calcTxHash(param.data);
        } catch (e) {
            return Promise.reject(CalcTxHashError);
        }
    }

    static async minAda(address: string, multiAsset?: MultiAssetData): Promise<string> {
        try {
            return minAda(address, multiAsset);
        } catch (e) {
            return Promise.reject(SignTxError);
        }
    }

    static async minFee(param: SignTxParams): Promise<string> {
        try {
            const data: TxData = param.data;
            return minFee(data);
        } catch (e) {
            return Promise.reject(SignTxError);
        }
    }

    async signMessage(param: SignTxParams): Promise<any> {
        try {
            return signData(param.data.address, param.data.message, param.data.privateKey || param.privateKey);
        } catch (e) {
            return Promise.reject(SignTxError);
        }
    }
}
