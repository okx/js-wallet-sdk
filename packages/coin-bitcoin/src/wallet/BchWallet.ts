import {
    EstimateFeeError,
    GetAddressParams,
    GetDerivedPathParam,
    GetHardwareRawTransactionError,
    GetMpcRawTransactionError,
    GetMpcTransactionError,
    MpcRawTransactionData,
    MpcTransactionParam,
    NewAddressData,
    NewAddressError,
    NewAddressParams,
    SignTxError,
    SignTxParams,
    ValidAddressData,
    ValidAddressParams
} from "@okxweb3/coin-base";
import {base} from "@okxweb3/crypto-lib";
import {BtcWallet, convert2UtxoTx} from "./BtcWallet";

import * as bitcoin from "../index"

export class BchWallet extends BtcWallet {
    async getDerivedPath(param: GetDerivedPathParam): Promise<any> {
        return `m/44'/145'/0'/0/${param.index}`;
    }

    async getNewAddress(param: NewAddressParams): Promise<any> {
        try {
            let network = this.network();
            let privateKey = param.privateKey;
            const publicKey = bitcoin.wif2Public(privateKey, network);

            const address = bitcoin.GetBitcashP2PkHAddressByPublicKey(publicKey)
            const addressWithoutPrefix = address.replace("bitcoincash:", "")

            let data: NewAddressData = {
                address: addressWithoutPrefix || "",
                publicKey: base.toHex(publicKey)
            };
            return Promise.resolve(data);
        } catch (e) {
            return Promise.reject(NewAddressError);
        }
    }

    async validAddress(param: ValidAddressParams): Promise<any> {
        let isValid = false;
        try {
            let network = this.network();
            let outputScript = bitcoin.address.toOutputScript(param.address, network);
            if (outputScript) {
                isValid = true;
            }
        } catch (e) {
        }

        if (!isValid) {
            isValid = bitcoin.ValidateBitcashP2PkHAddress(param.address)
        }

        let data: ValidAddressData = {
            isValid: isValid,
            address: param.address
        };
        return Promise.resolve(data);
    }

    async signTransaction(param: SignTxParams): Promise<any> {
        let txHex = null;
        try {
            const privateKey = param.privateKey;
            const utxoTx = convert2UtxoTx(param.data);

            // convert to legacy address for compatibility
            utxoTx.outputs.forEach((it: any) => {
                if (bitcoin.isCashAddress(it.address)) {
                    it.address = bitcoin.convert2LegacyAddress(it.address, this.network())
                }
            })

            if (bitcoin.isCashAddress(utxoTx.address)) {
                utxoTx.address = bitcoin.convert2LegacyAddress(utxoTx.address, this.network())
            }

            txHex = bitcoin.signBch(utxoTx, privateKey, this.network());
            return Promise.resolve(txHex);
        } catch (e) {
            return Promise.reject(SignTxError);
        }
    }

    async estimateFee(param: SignTxParams): Promise<number> {
        try {
            const utxoTx = convert2UtxoTx(param.data);
            // convert to legacy address for compatibility
            utxoTx.outputs.forEach((it: any) => {
                if (bitcoin.isCashAddress(it.address)) {
                    it.address = bitcoin.convert2LegacyAddress(it.address, this.network())
                }
            })

            if (bitcoin.isCashAddress(utxoTx.address)) {
                utxoTx.address = bitcoin.convert2LegacyAddress(utxoTx.address, this.network())
            }

            const fee = bitcoin.estimateBchFee(utxoTx, this.network());
            return Promise.resolve(fee);
        } catch (e) {
            return Promise.reject(EstimateFeeError);
        }
    }

    getMPCRawTransaction(param: SignTxParams): Promise<any> {
        try {
            const utxoTx = convert2UtxoTx(param.data);

            // convert to legacy address for compatibility
            utxoTx.outputs.forEach((it: any) => {
                if (bitcoin.isCashAddress(it.address)) {
                    it.address = bitcoin.convert2LegacyAddress(it.address, this.network())
                }
            })

            if (bitcoin.isCashAddress(utxoTx.address)) {
                utxoTx.address = bitcoin.convert2LegacyAddress(utxoTx.address, this.network())
            }
            const hash: string[] = []
            const hex = bitcoin.signBch(utxoTx, "", this.network(), hash);
            const data: MpcRawTransactionData = {
                raw: hex,
                hash: hash
            };
            return Promise.resolve(data);
        } catch (e) {
            return Promise.reject(GetMpcRawTransactionError);
        }
    }

    getAddressByPublicKey(param: GetAddressParams): Promise<string> {
        const publicKey = base.fromHex(param.publicKey);
        const address = bitcoin.GetBitcashP2PkHAddressByPublicKey(publicKey)
        return Promise.resolve(address.replace("bitcoincash:", ""));
    }

    getMPCTransaction(param: MpcTransactionParam): Promise<any> {
        try {
            const hex = bitcoin.getMPCTransaction(param.raw, param.sigs as string[], true);
            return Promise.resolve(hex);
        } catch (e) {
            return Promise.reject(GetMpcTransactionError);
        }
    }

    getHardWareRawTransaction(param: SignTxParams): Promise<any> {
        try {
            const utxoTx = convert2UtxoTx(param.data);

            // convert to legacy address for compatibility
            utxoTx.outputs.forEach((it: any) => {
                if (bitcoin.isCashAddress(it.address)) {
                    it.address = bitcoin.convert2LegacyAddress(it.address, this.network())
                }
            })

            if (bitcoin.isCashAddress(utxoTx.address)) {
                utxoTx.address = bitcoin.convert2LegacyAddress(utxoTx.address, this.network())
            }
            const hex = bitcoin.signBch(utxoTx, "", this.network(), undefined, true);
            return Promise.resolve(hex);
        } catch (e) {
            return Promise.reject(GetHardwareRawTransactionError);
        }
    }
}
