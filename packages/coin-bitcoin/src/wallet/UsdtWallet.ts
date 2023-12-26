import {EstimateFeeError, GetHardwareRawTransactionError, SignTxError, SignTxParams} from "@okxweb3/coin-base";
import {BtcWallet, convert2UtxoTx, number2Hex} from "./BtcWallet";
import * as bitcoin from "../index"

export class UsdtWallet extends BtcWallet {
    async signTransaction(param: SignTxParams): Promise<any> {
        let txHex = null;
        try {
            const privateKey = param.privateKey;
            const utxoTx = convert2UtxoTx(param.data);
            if (!utxoTx.omni) {
                return Promise.reject(SignTxError);
            }

            const coinType = number2Hex(utxoTx.omni.coinType || 31, 8)
            const amount = number2Hex(utxoTx.omni.amount, 16)

            // construct omni script, manually add output
            // OP_RETURN(0x6a) + length(0x14) + ASCII(‘omni’) + version + tx type + 0000001f(31 represents USDT) + 000000174876e800(usdt transfer amount)
            // OP_RETURN 6f6d6e69000000000000001f000000003b9aca00
            const script = "6a146f6d6e69" + "0000" + "0000" + coinType + amount
            const extraOutput = {address: "", amount: 0, omniScript: script}
            utxoTx.outputs.push(extraOutput as never)

            txHex = bitcoin.signBtc(utxoTx, privateKey, this.network());
            return Promise.resolve(txHex);
        } catch (e) {
            return Promise.reject(SignTxError);
        }
    }

    async estimateFee(param: SignTxParams): Promise<number> {
        try {
            const utxoTx = convert2UtxoTx(param.data);
            if (!utxoTx.omni) {
                return Promise.reject(EstimateFeeError);
            }

            const coinType = number2Hex(utxoTx.omni.coinType || 31, 8)
            const amount = number2Hex(utxoTx.omni.amount, 16)

            // construct omni script, manually add output
            // OP_RETURN(0x6a) + length(0x14) + ASCII(‘omni’) + version + tx type + 0000001f(31 represents USDT) + 000000174876e800(usdt transfer amount)
            // OP_RETURN 6f6d6e69000000000000001f000000003b9aca00
            const script = "6a146f6d6e69" + "0000" + "0000" + coinType + amount
            const extraOutput = {address: "", amount: 0, omniScript: script}
            utxoTx.outputs.push(extraOutput as never)

            const fee = bitcoin.estimateBtcFee(utxoTx, this.network());
            return Promise.resolve(fee);
        } catch (e) {
            return Promise.reject(EstimateFeeError);
        }
    }

    getHardWareRawTransaction(param: SignTxParams): Promise<any> {
        try {
            const type = param.data.type || 0;
            const utxoTx = convert2UtxoTx(param.data);
            if (!utxoTx.omni) {
                return Promise.reject(SignTxError);
            }

            const coinType = number2Hex(utxoTx.omni.coinType || 31, 8)
            const amount = number2Hex(utxoTx.omni.amount, 16)

            // construct omni script, manually add output
            // OP_RETURN(0x6a) + length(0x14) + ASCII(‘omni’) + version + tx type + 0000001f(31 represents USDT) + 000000174876e800(usdt transfer amount)
            // OP_RETURN 6f6d6e69000000000000001f000000003b9aca00
            const script = "6a146f6d6e69" + "0000" + "0000" + coinType + amount
            const extraOutput = {address: "", amount: 0, omniScript: script}
            utxoTx.outputs.push(extraOutput as never)

            let txHex: string
            if (type === 2) { // psbt
                const change = bitcoin.signBtc(utxoTx, "", this.network(), undefined, true, true);
                const changeUtxo = {
                    address: utxoTx.address,
                    amount: parseInt(change),
                    bip32Derivation: utxoTx.bip32Derivation
                } as bitcoin.utxoOutput
                utxoTx.outputs.push(changeUtxo as never)
                txHex = bitcoin.buildPsbt(utxoTx, this.network());
            } else {
                txHex = bitcoin.signBtc(utxoTx, "", this.network(), undefined, true);
            }
            return Promise.resolve(txHex);
        } catch (e) {
            return Promise.reject(GetHardwareRawTransactionError);
        }
    }
}

export class UsdtTestWallet extends UsdtWallet {
    network() {
        return bitcoin.networks.testnet;
    }
}
