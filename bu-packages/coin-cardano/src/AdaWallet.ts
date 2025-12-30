import {
    BaseWallet,
    buildCommonSignMsg,
    jsonStringifyUniform,
    SignCommonMsgParams,
    ValidPrivateKeyData,
    ValidPrivateKeyParams
} from "@okxweb3/coin-base";
import {
    CalcTxHashParams,
    DerivePriKeyParams,
    GetDerivedPathParam,
    NewAddressData,
    NewAddressParams,
    SignTxParams,
    ValidAddressData,
    ValidAddressParams,
    base,
} from "@okxweb3/coin-base";
import {
    CalcTxHashError,
    GenPrivateKeyError,
    NewAddressError,
    SignTxError,
} from "@okxweb3/coin-base";
import {signUtil} from "@okxweb3/crypto-lib";
import {
    getNewAddress,
    pubKeyFromPrivateKey,
    getDerivedPrivateKey,
    checkPrivateKey,
    bech32AddressToHexAddress
} from "./account";
import {
    calcTxHash,
    transfer,
    calcMinAda,
    MultiAssetData,
    TxData,
    calcMinFee,
    signTx,
    TxInput,
    getFilteredUtxos,
    getBalance,
    getTxFee,
    getNetworkId
} from "./transaction";
import {signData} from "./message";

export class AdaWallet extends BaseWallet {
    async getDerivedPath(param: GetDerivedPathParam): Promise<any> {
        return `m/1852'/1815'/${param.index}'/0/0`;
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
        let isValid: boolean
        try {
            isValid = await checkPrivateKey(param.privateKey);
        } catch (e){
            isValid = false
        }
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
                return await signTx(data.tx!, data.privateKey || param.privateKey)
            }
            return await transfer(data, param.privateKey);
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async calcTxHash(param: CalcTxHashParams): Promise<string> {
        try {
            return await calcTxHash(param.data);
        } catch (e) {
            return Promise.reject(e);
        }
    }

    static async minAda(address: string, multiAsset?: MultiAssetData): Promise<string> {
        try {
            return await calcMinAda(address, multiAsset);
        } catch (e) {
            return Promise.reject(e);
        }
    }

    static async minFee(param: SignTxParams): Promise<string> {
        try {
            const data: TxData = param.data;
            return await calcMinFee(data);
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async signMessage(param: SignTxParams): Promise<any> {
        try {
            return await signData(param.data.address, param.data.message, param.data.privateKey || param.privateKey);
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async signCommonMsg(param: SignCommonMsgParams): Promise<any> {
        try {
            let data;
            const addr = await this.getNewAddress({privateKey:param.privateKey});
            if(param.message.text){
                data = param.message.text;
            } else {
               data = buildCommonSignMsg(addr.publicKey, param.message.walletId);
            }
            let hash = base.magicHash(data);
            return Promise.resolve(jsonStringifyUniform(await signData(addr.address, base.toHex(hash), param.privateKey)));
        } catch (e) {
            return Promise.reject(SignTxError);
        }
    }

    getFilteredUtxos = (txInputs: TxInput[], filterCbor?: string) => {
        return getFilteredUtxos(txInputs, filterCbor)
    }

    getBalance = (txInputs: TxInput[], filterCbor?: string) => {
        return getBalance(txInputs)
    }

    getNetworkId = (txCbor: string) =>  {
        return getNetworkId(txCbor)
    }

    getTxFee = (txCbor: string) =>  {
        return getTxFee(txCbor)
    }

    bech32AddressToHexAddress(address: string) {
        return bech32AddressToHexAddress(address)
    }
}
