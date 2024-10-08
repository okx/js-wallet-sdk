import {cloneObject, SignTxParams} from "@okxweb3/coin-base";
import {BtcWallet} from "./BtcWallet";
import * as bitcoin from "../index"
import {networks, signBtc, utxoTx} from "../index"

export const ErrCodeLessAtomicalAmt     = 2011400;
export const ErrCodeAtomicalChangeFail  = 2011401;
export const ErrCodeVoutDust            = 2011402;
export const ErrCodeCommon              = 2011403;
export const ErrCodeUnknownAsset        = 2011404;
export const ErrCodeMul                 = 2011420;
export  const  ErrCodeSemiColorOuput    = 2011405
export const ErrCodeAtomicalNotFullyAllocated = 2011406;
export const ErrCodeInvalidInputAsset   = 2011407;

export class AtomicalWallet extends BtcWallet {

    convert2AtomicalTx(paramData: any): utxoTx {
        const clonedParamData = cloneObject(paramData)
        const atomicalInputMap = new Map<string, number>();
        const atomicalTypeMap = new Map<string, string>();
        const atomicalSendMap = new Map<string, number>();

        let txOutput = []

        const feePerB = clonedParamData.feePerB || 10; 
        const dustSize = clonedParamData.dustSize || 546

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
                    let atomicalAmount: number = Number(data["amount"])

                    if (atomicalId == null || atomicalAmount == null  || atomicalIdType == null) {
                        continue
                    }
                    if (atomicalIdType != "FT" && atomicalIdType != "NFT" ){
                        continue
                    }
                    if (atomicalAmount > input.amount){
                        throw new Error(JSON.stringify({ errCode:ErrCodeInvalidInputAsset }))
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
                throw new Error(JSON.stringify({ errCode:ErrCodeMul }))
            }
     
        }


        // Calculate the total asset output value for the 'output' field
        // and construct the 'output' field for the UTXO (Unspent Transaction Output).
        let outputs = clonedParamData.outputs;
        let notFullyAllocated = 0
        for (const output of outputs) {
            let dataArray = output.data;
            if (dataArray != null && dataArray instanceof Array) {
                for (const data of dataArray) {
                    let atomicalId: string = data["atomicalId"];
                    let atomicalAmount: number = Number(data["amount"]);
                    // let atomicalAmount: number = output.amount;
                    let atomicalIdType :string = data["type"];

                    if (atomicalIdType == "FT" && atomicalAmount != output.amount && atomicalAmount > dustSize){
                        throw new Error(JSON.stringify({ errCode:ErrCodeSemiColorOuput }))
                    }

                    if (atomicalId == null || atomicalAmount == null  || atomicalIdType == null) {
                        continue
                    }
                    if (atomicalIdType != "FT" && atomicalIdType != "NFT" ){
                        continue
                    }
                    if (atomicalIdType == "FT" && atomicalAmount != output.amount){
                        notFullyAllocated +=1 ;
                        if( notFullyAllocated == 2){
                            throw new Error(JSON.stringify({ errCode:ErrCodeSemiColorOuput }))
                        }
                    }

                    if (atomicalTypeMap.get(atomicalId) != atomicalIdType){
                        throw new Error(JSON.stringify({ errCode:ErrCodeUnknownAsset }))
                    }

                    let beforeAmount = atomicalSendMap.get(atomicalId);
                    if (beforeAmount == null) {
                        atomicalSendMap.set(atomicalId, atomicalAmount);
                    } else {
                        atomicalSendMap.set(atomicalId, beforeAmount + atomicalAmount);
                        // Avoid trying to bind the same NFT to multiple outputs 
                        if (atomicalIdType == "NFT"){ 
                            throw new Error(JSON.stringify({ errCode:ErrCodeMul }))
                        }
                    }
                }
            }
            if (Object.keys(atomicalSendMap).length > 1){ 
                throw new Error(JSON.stringify({ errCode:ErrCodeMul }))
            }
            txOutput.push({
                amount:output.amount,
                address:output.address,
            })
        }

        for (const atomicalId of atomicalInputMap.keys()) {
            let inputAmount = atomicalInputMap.get(atomicalId);
            let sendAmount = atomicalSendMap.get(atomicalId);

            if(inputAmount != sendAmount) {
                throw new Error(JSON.stringify({
                    errCode:ErrCodeAtomicalNotFullyAllocated,
                    date:{
                        atomicalId:atomicalId,
                        inputAmount:inputAmount,
                        sendAmount:sendAmount
                    }
                }))
            }
        }

        // check all output dustSize
        for (const [index, curUtxo] of txOutput.entries()){
            if (curUtxo.amount < dustSize){
                throw new Error(JSON.stringify({ errCode:ErrCodeVoutDust , vOut:index }))
            }
        }

        return {
            inputs: clonedParamData.inputs,
            outputs: txOutput as [],
            address: clonedParamData.address,
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
