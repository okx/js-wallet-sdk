import {
    EstimateFeeError,
    GetDerivedPathParam,
    GetHardwareRawTransactionError,
    GetMpcRawTransactionError,
    GetMpcTransactionError,
    MpcRawTransactionData,
    MpcTransactionParam,
    SignTxError,
    SignTxParams
} from "@okxweb3/coin-base";
import {BtcWallet, convert2UtxoTx} from "./BtcWallet";

import * as bitcoin from "../index"


export class BsvWallet extends BtcWallet {
    async getDerivedPath(param: GetDerivedPathParam): Promise<any> {
        return `m/44'/236'/0'/0/${param.index}`;
    }

    async signTransaction(param: SignTxParams): Promise<any> {
        let txHex = null;
        try {
            const privateKey = param.privateKey;
            const utxoTx = convert2UtxoTx(param.data);
            txHex = bitcoin.signBch(utxoTx, privateKey, this.network());
            return Promise.resolve(txHex);
        } catch (e) {
            return Promise.reject(SignTxError);
        }
    }

    async estimateFee(param: SignTxParams): Promise<number> {
        try {
            const utxoTx = convert2UtxoTx(param.data);
            const fee = bitcoin.estimateBchFee(utxoTx, this.network());
            return Promise.resolve(fee);
        } catch (e) {
            return Promise.reject(EstimateFeeError);
        }
    }

    getMPCRawTransaction(param: SignTxParams): Promise<any> {
        try {
            const utxoTx = convert2UtxoTx(param.data);
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
            const hex = bitcoin.signBch(utxoTx, "", this.network(), undefined, true);
            return Promise.resolve(hex);
        } catch (e) {
            return Promise.reject(GetHardwareRawTransactionError);
        }
    }
}

