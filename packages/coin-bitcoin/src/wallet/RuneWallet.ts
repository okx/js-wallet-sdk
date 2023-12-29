import {cloneObject, SignTxParams} from "@okxweb3/coin-base";
import {BtcWallet} from "./BtcWallet";
import * as bitcoin from "../index"
import {buildRuneData} from "../rune";
import {
    networks,
    signBtc,
    utxoTx,
} from "../index";
import {base} from "@okxweb3/crypto-lib";

export class RuneWallet extends BtcWallet {
    convert2RuneTx(paramData: any): utxoTx {
        const clonedParamData = cloneObject(paramData)
        const runeDataInput = clonedParamData.runeData

        const typedEdicts: bitcoin.Edict[] = []
        for (const edict of runeDataInput.edicts) {
            const typedEdict: bitcoin.Edict = {
                // parseInt('0x' + Number(220).toString(16),16) => 220
                id: parseInt('0x' + edict.id),
                amount: edict.amount,
                output: edict.output,
            }
            typedEdicts.push(typedEdict)
        }

        return {
            inputs: clonedParamData.inputs,
            outputs: clonedParamData.outputs,
            address: clonedParamData.address,
            feePerB: clonedParamData.feePerB,
            runeData: {
                edicts: typedEdicts
            },
        }
    }

    async signTransaction(param: SignTxParams): Promise<any> {
        const network = this.network()
        let txHex = null;
        try {
            const privateKey = param.privateKey;
            if (!param.data.runeData) {
                return Promise.reject("missing runeData");
            }
            const runeTx = this.convert2RuneTx(param.data);

            const opReturnOutput = this.getOpReturnOutput(network, runeTx.runeData!);
            runeTx.outputs.push(opReturnOutput as never)

            txHex = signBtc(runeTx, privateKey, network);
            return Promise.resolve(txHex);
        } catch (e) {
            return Promise.reject(e);
        }
    }

    private getOpReturnOutput(network: bitcoin.Network, runeData: bitcoin.RuneData) {
        let isMainnet = false;
        if (networks.bitcoin === network) {
            isMainnet = true;
        }
        const opReturnScript = buildRuneData(isMainnet, runeData.edicts);
        const opReturnOutput = {address: '', amount: 0, omniScript: base.toHex(opReturnScript)};
        return opReturnOutput;
    }

    async estimateFee(param: SignTxParams): Promise<number> {
        try {
            if (!param.data.runeData) {
                return Promise.reject("missing runeData");
            }
            const runeTx = this.convert2RuneTx(param.data);
            const opReturnOutput = this.getOpReturnOutput(this.network(), runeTx.runeData!);
            runeTx.outputs.push(opReturnOutput as never)

            const fee = bitcoin.estimateBtcFee(runeTx, this.network());
            return Promise.resolve(fee);
        } catch (e) {
            return Promise.reject(e);
        }
    }
}

export class RuneTestWallet extends RuneWallet {
    network() {
        return bitcoin.networks.testnet;
    }
}
