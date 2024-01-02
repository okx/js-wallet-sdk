import {cloneObject, SignTxParams} from "@okxweb3/coin-base";
import {BtcWallet} from "./BtcWallet";
import * as bitcoin from "../index"
import {networks, signBtc, utxoTx} from "../index"
import {buildRuneData} from "../rune";
import {base} from "@okxweb3/crypto-lib";

export class RuneWallet extends BtcWallet {

    convert2RuneTx(paramData: any): utxoTx {
        const clonedParamData = cloneObject(paramData)

        // cal rune token input all amount
        let inputs = clonedParamData.inputs;
        const runeInputMap = new Map<string, number>();
        for (const input of inputs) {
            let dataArray = input.data;
            if (dataArray != null && dataArray instanceof Array) {
                for (const data of dataArray) {
                    let runeId: string = data["id"];
                    let runeAmount: number = data["amount"];
                    if (runeId == null || runeAmount == null) {
                        continue
                    }
                    let beforeAmount = runeInputMap.get(runeId);
                    if (beforeAmount == null) {
                        runeInputMap.set(runeId, runeAmount);
                    } else {
                        runeInputMap.set(runeId, beforeAmount + runeAmount);
                    }
                }
            }
        }

        // cal rune output amount
        let outputs = clonedParamData.outputs;
        const runeSendMap = new Map<string, number>();
        for (const output of outputs) {
            let data = output.data;
            if (data != null) {
                let runeId: string = data["id"];
                let runeAmount: number = data["amount"];
                if (runeId == null || runeAmount == null) {
                    continue
                }
                let beforeAmount = runeSendMap.get(runeId);
                if (beforeAmount == null) {
                    runeSendMap.set(runeId, runeAmount);
                } else {
                    runeSendMap.set(runeId, beforeAmount + runeAmount);
                }
            }
        }

        // where isChange ? if input > output yes, rune change put first output
        let isRuneChange = false;
        for (const id of runeInputMap.keys()) {
            let inputAmount = runeInputMap.get(id);
            let sendAmount = runeSendMap.get(id);
            if (inputAmount != null && sendAmount != null && inputAmount > sendAmount) {
                isRuneChange = true
            }
        }

        let outputIndex = 0;
        let updateOutputs = []
        if (isRuneChange) {
            // first output is rune change
            let runeChange = {
                address: clonedParamData.address,
                amount: 546
            }
            updateOutputs.push(runeChange)
            outputIndex++;
        }
        const typedEdicts: bitcoin.Edict[] = []
        for (const output of outputs) {
            let data = output.data;
            if (data != null) {
                let runeId: string = data["id"];
                let runeAmount: number = data["amount"];
                if (runeId == null || runeAmount == null) {
                    continue
                }
                const typedEdict: bitcoin.Edict = {
                    id: parseInt('0x' + runeId),
                    amount: runeAmount,
                    output: outputIndex,
                }
                typedEdicts.push(typedEdict)
            }
            output.data = null
            updateOutputs.push(output)
            outputIndex++;
        }

        return {
            inputs: clonedParamData.inputs,
            // @ts-ignore
            outputs: updateOutputs,
            address: clonedParamData.address,
            feePerB: clonedParamData.feePerB,
            runeData: {
                edicts: typedEdicts,
                etching: clonedParamData.runeData!.etching,
                burn: clonedParamData.runeData!.burn
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
