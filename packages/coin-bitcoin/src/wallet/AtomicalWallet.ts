import {cloneObject, SignTxParams} from "@okxweb3/coin-base";
import {BtcWallet} from "./BtcWallet";
import * as bitcoin from "../index"
import {networks, signBtc, utxoTx} from "../index"

export class AtomicalWallet extends BtcWallet {

    convert2AtomicalTx(paramData: any): utxoTx {
        const clonedParamData = cloneObject(paramData)
        const atomicalInputMap = new Map<string, number>();
        const atomicalTypeMap = new Map<string, string>();
        const atomicalSendMap = new Map<string, number>();

        let txInput = []
        let txOutput = []

        const feePerB = clonedParamData.feeRate || 10; 
        const dustSize = clonedParamData.minChangeValue || 546

        // Calculate the total Atomical asset input value from the 'input' field
        // and construct the 'input' field for the UTXO (Unspent Transaction Output).
        // The atomicalInputMapList is used to check whether a complete transfer is achieved in the 'output'.
        let inputs = clonedParamData.inputs;
        for (const input of inputs) {
            let dataArray = input.data;

            if (dataArray != null && dataArray instanceof Array) {
                for (const data of dataArray) {
                    
                    let atomicalId: string = data["atomicalId"];
                    let atomicalIdType :string = data["type"];
                    let atomicalAmount: number = input.amount;

                    if (atomicalId == null || atomicalAmount == null  || atomicalIdType == null) {
                        continue
                    }
                    if (atomicalIdType != "FT" && atomicalIdType != "NFT" ){
                        continue
                    }

                    if (atomicalTypeMap.get(atomicalId) == null) {
                        atomicalTypeMap.set(atomicalId, atomicalIdType);
                    }

                    let beforeAmount = atomicalInputMap.get(atomicalId);
                    if (beforeAmount == null) {
                        atomicalInputMap.set(atomicalId, atomicalAmount);
                    } else {
                        atomicalInputMap.set(atomicalId, beforeAmount + atomicalAmount);
                    }
                }
            }

            if (Object.keys(atomicalInputMap).length > 1){ 
                throw new Error(JSON.stringify({ errCode:201 }))
            }

            txInput.push({
                txId:input.txId,
                vOut:input.vOut,
                amount:input.amount,
                address:input.address,
            })
        }


        // Calculate the total asset output value for the 'output' field
        // and construct the 'output' field for the UTXO (Unspent Transaction Output).
        // If there are assets that haven't been completely transferred,
        // they will be automatically transferred back in the last transaction of their respective asset transfers.
        let outputs = clonedParamData.outputs;
        for (const output of outputs) {
            let dataArray = output.data;
            if (dataArray != null && dataArray instanceof Array) {

                for (const data of dataArray) {
                    let atomicalId: string = data["atomicalId"];
                    let atomicalAmount: number = output.amount;
                    let atomicalIdType :string = data["type"];

                    if (atomicalId == null || atomicalAmount == null  || atomicalIdType == null) {
                        continue
                    }
                    if (atomicalIdType != "FT" && atomicalIdType != "NFT" ){
                        continue
                    }

                    if (atomicalTypeMap.get(atomicalId) != atomicalIdType){
                        throw new Error(JSON.stringify({ errCode:104 }))
                    }

                    let beforeAmount = atomicalSendMap.get(atomicalId);
                    if (beforeAmount == null) {
                        atomicalSendMap.set(atomicalId, atomicalAmount);
                    } else {
                        atomicalSendMap.set(atomicalId, beforeAmount + atomicalAmount);
                        // Avoid trying to bind the same NFT to multiple outputs 
                        if (atomicalIdType == "NFT"){ 
                            throw new Error(JSON.stringify({ errCode:201 }))
                        }
                    }
                }
            }
            if (Object.keys(atomicalSendMap).length > 1){ 
                throw new Error(JSON.stringify({ errCode:201 }))
            }
            txOutput.push({
                amount:output.amount,
                address:output.address,
            })
        }

        // where isChange ? if input > output yes, Atomical change put last output
        let isAtomicalChange = false;
        for (const atomicalId of atomicalInputMap.keys()) {
            let inputAmount = atomicalInputMap.get(atomicalId);
            let sendAmount = atomicalSendMap.get(atomicalId);

            if (atomicalTypeMap.get(atomicalId) == "FT"){

                // Disable signing if certain input assets lack corresponding outputs
                if (sendAmount == null) { 
                    throw new Error(JSON.stringify({ errCode:103 })) 
                }

                if (inputAmount != null && sendAmount != null && inputAmount > sendAmount) {
                    isAtomicalChange = true
                    let changeAmount = inputAmount - sendAmount
                    if (changeAmount < clonedParamData.minChangeValue){
                        throw new Error(JSON.stringify({ 
                            errCode:102,
                            vOut: txOutput.length
                        }))
                    }
                    // auto change
                    txOutput.push({
                        address:clonedParamData.changeAddress,
                        amount:changeAmount
                    })
                } else if (inputAmount != null && sendAmount != null && inputAmount < sendAmount){ 
                    throw new Error(JSON.stringify({ 
                        errCode:100,
                        date:{
                            atomicalId: atomicalId,
                            amount: inputAmount-sendAmount
                        }
                    }))
                }
            }else if (atomicalTypeMap.get(atomicalId) == "NFT"){
                // Disable signing if certain input assets lack corresponding outputs
                if (sendAmount == null) { 
                    throw new Error(JSON.stringify({ errCode:103 })) 
                }
            }
        }

        // check all output dustSize
        for (const [index, curUtxo] of txOutput.entries()){
            if (curUtxo.amount < dustSize){
                throw new Error(JSON.stringify({ errCode:102 , vOut:index }))
            }
        }

        return {
            inputs: txInput as [],
            outputs: txOutput as [],
            address: clonedParamData.changeAddress,
            feePerB: feePerB,
        }
    }

    async signTransaction(param: SignTxParams): Promise<any> {
        const network = this.network()
        let txHex = null;
        try {
            const privateKey = param.privateKey;
            const atomicalTx = this.convert2AtomicalTx(param.data);

            txHex = signBtc(atomicalTx, privateKey, network);
            return Promise.resolve(txHex);
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async estimateFee(param: SignTxParams): Promise<number> {
        try {
            const atomicalTx = this.convert2AtomicalTx(param.data);

            const fee = bitcoin.estimateBtcFee(atomicalTx, this.network());
            return Promise.resolve(fee);
        } catch (e) {
            return Promise.reject(e);
        }
    }
}

export class AtomicalTestWallet extends AtomicalWallet {
    network() {
        return bitcoin.networks.testnet;
    }
}
