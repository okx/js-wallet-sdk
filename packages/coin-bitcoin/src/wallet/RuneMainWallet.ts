import {cloneObject, SignTxError, SignTxParams} from "@okxweb3/coin-base";
import {BtcWallet} from "./BtcWallet";
import * as bitcoin from "../index"
import {
    BtcXrcTypes,
    buildPsbt,
    calculateTxSize,
    ErrCodeLessAtomicalAmt,
    networks,
    psbtSign,
    RuneData,
    signBtc,Transaction,
    utxoTx
} from "../index"
import {buildRuneMainMintData, buildRuneMainMintOp} from "../rune";
import {base} from "@okxweb3/crypto-lib";
import {runesMainInscribe, RunesMainInscriptionRequest} from "../runesMain";

export const ErrCodeLessRunesMainAmt     = 2010300
export const ErrCodeOpreturnExceeds       = 2010301;
export const ErrCodeRuneIdNotStandard= 2010302;

export const ErrCodeMultipleRuneId= 2010303;
export class RuneMainWallet extends BtcWallet {

    convert2RuneTx(paramData: any): utxoTx {
        const clonedParamData = cloneObject(paramData)

        // Prevent setting usedefaultOutput but lacking defaultOutput
        if (clonedParamData.runeData.useDefaultOutput == true && clonedParamData.runeData.defaultOutput == undefined) {
            clonedParamData.runeData.defaultOutput = 0
        }

        // Prevent setting usedefaultOutput but lacking defaultOutput
        if (clonedParamData.runeData.mint == true && clonedParamData.runeData.mintNum == undefined) {
            clonedParamData.runeData.mintNUm = 1
        }


        // Detects that the type of amount in data is converted to bigint
        for(let input of clonedParamData.inputs) {
            let dataArray = input.data;
            if (dataArray != null && dataArray instanceof Array) {
                for (let data of dataArray) {
                    if(typeof data["amount"] === "string") {
                        if (clonedParamData.runeData.mint) {
                            data["amount"] = BigInt(1)
                        }else{
                            data["amount"] = BigInt(data["amount"]);
                        }
                    }
                }
            }
        }

        for(let output of clonedParamData.outputs) {
            let dataArray = output.data;
            if (dataArray != null && dataArray instanceof Array) {
                for (let data of dataArray) {
                    if(typeof data["amount"] === "string") {
                        if (clonedParamData.runeData.mint) {
                            data["amount"] = BigInt(1)
                        }else{
                            data["amount"] = BigInt(data["amount"]);
                        }
                    }
                }
            }
        }

        // cal rune token input all amount
        let inputs = clonedParamData.inputs;
        const runeInputMap = new Map<string, bigint>();
        for (const input of inputs) {
            let dataArray = input.data;
            if (dataArray != null && dataArray instanceof Array) {
                for (const data of dataArray) {
                    let runeId: string = data["id"];
                    let runeAmount = BigInt(1)
                    if (!clonedParamData.runeData.mint) {
                        runeAmount = BigInt(data["amount"]);
                    }
                    // let runeAmount: bigint = BigInt(data["amount"]);
                    if (runeId == null || runeAmount == null) {
                        continue
                    }

                    // If rune id is filled in, it must be combined with the encoding of version 0.17, that is, use: split
                    if (runeId.split(":").length <= 1){
                        throw new Error(JSON.stringify({ errCode:ErrCodeRuneIdNotStandard, date:{ runeId:runeId } }))
                    }

                    let beforeAmount = runeInputMap.get(runeId);
                    if (beforeAmount == null) {
                        runeInputMap.set(runeId, runeAmount);
                    } else {
                        runeInputMap.set(runeId, (BigInt(beforeAmount) + BigInt(runeAmount)));
                    }
                }
            }
        }
        // To avoid the sorting problem of multiple runes assets in version 0.17,
        // multiple runes assets are prohibited from participating in the transfer.
        if( runeInputMap.size > 1 ){
            throw new Error(JSON.stringify({ errCode:ErrCodeMultipleRuneId, date:{ runeInputMapSize: runeInputMap.size } }))
        }

        // cal rune output amount
        let outputs = clonedParamData.outputs;
        const runeSendMap = new Map<string, bigint>();
        for (const output of outputs) {
            let data = output.data;
            if (data != null) {
                let runeId: string = data["id"];
                let runeAmount = BigInt(1)
                if (!clonedParamData.runeData.mint) {
                    runeAmount = BigInt(data["amount"]);
                }
                if (runeId == null || runeAmount == null) {
                    continue
                }
                let beforeAmount = runeSendMap.get(runeId);
                if (beforeAmount == null) {
                    runeSendMap.set(runeId, runeAmount);
                } else {
                    runeSendMap.set(runeId, (BigInt(beforeAmount) + BigInt(runeAmount)));
                }
            }
        }

        let isRuneChange = false;
        for (const id of runeInputMap.keys()) {
            let inputAmount = runeInputMap.get(id);
            let sendAmount = runeSendMap.get(id);
            // If the funds are imbalanced and the user has not set useDefault Output,
            // a supplementary transaction will be made for the user to prevent fund loss
            if ((inputAmount != null && sendAmount != null && inputAmount > sendAmount) || (inputAmount != null && sendAmount == null)) {
                if (clonedParamData.runeData.useDefaultOutput == false){
                    isRuneChange = true
                }
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

                let runeAmount = BigInt(1)
                if (!clonedParamData.runeData.mint) {
                    runeAmount = BigInt(data["amount"]);
                }
                if (runeId == null || runeAmount == null) {
                    continue
                }
                const typedEdict: bitcoin.Edict = {
                    block:parseInt(runeId.split(":")[0]),
                    id:parseInt(runeId.split(":")[1]),
                    amount: BigInt(runeAmount),
                    output: outputIndex,
                }
                typedEdicts.push(typedEdict)
            }
            output.data = null
            updateOutputs.push(output)
            outputIndex++;
        }

        if( clonedParamData.runeData.useDefaultOutput == true && clonedParamData.runeData.defaultOutput > updateOutputs.length-1 ){
            throw new Error(JSON.stringify({
                errCode:ErrCodeLessRunesMainAmt,
                date:{
                    defaultOutput:clonedParamData.runeData.defaultOutput,
                    ouputLenth:updateOutputs.length
                }
            }))
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
                burn: clonedParamData.runeData!.burn,
                defaultOutput : clonedParamData.runeData!.defaultOutput,
                mint: clonedParamData.runeData!.mint,
                mintNum: clonedParamData.runeData!.mintNum,
            },
        }
    }

    getMockMinRuneTx(paramData:any,curRuneInfo:any): utxoTx {
        const clonedParamData = cloneObject(paramData)
        const typedEdicts: bitcoin.Edict[] = []
        // console.log(curRuneInfo)
        const typedEdict: bitcoin.Edict = {
            block:parseInt(curRuneInfo.id.split(":")[0]),
            id:parseInt(curRuneInfo.id.split(":")[1]),
            amount: BigInt(1),
            output: 0,
        }
        typedEdicts.push(typedEdict)
        return {
            // @ts-ignore
            inputs: [{
                txId:clonedParamData.inputs[0].txId,
                vOut:0,
                amount : 600,
                data:[curRuneInfo]
            }],
            // @ts-ignore
            outputs: [{
                address:clonedParamData.address,
                amount:546,
                data:curRuneInfo
            }],
            address: clonedParamData.address,
            feePerB: clonedParamData.feePerB,
            // RuneData : clonedParamData.runeData,
            runeData: {
                edicts: typedEdicts,
                etching: clonedParamData.runeData!.etching,
                burn: clonedParamData.runeData!.burn,
                defaultOutput : clonedParamData.runeData!.defaultOutput,
                mint: clonedParamData.runeData!.mint,
                mintNum: clonedParamData.runeData!.mintNum,
            },
        }
    }
    getMinRuneTx(paramData:any,curRuneInfo:any,curInput:any,curOutput:any): utxoTx {
        const clonedParamData = cloneObject(paramData)
        return {
            // @ts-ignore
            inputs: [curInput],
            // @ts-ignore
            outputs: [curOutput],
            address: clonedParamData.address,
            feePerB: clonedParamData.feePerB,
            RuneData : clonedParamData.runeData,
        }
    }
    async signTransaction(param: SignTxParams): Promise<any> {
        const network = this.network()
        let txHex = null;

        if(param.data.runeData.etching){
            try {
                return Promise.resolve(runesMainInscribe(network, param.data as RunesMainInscriptionRequest));
            } catch (e) {
                return Promise.reject(SignTxError);
            }
        } else if (param.data.runeData.mintNum == undefined || param.data.runeData.mintNum <= 1){
            try {
                const privateKey = param.privateKey;
                if (!param.data.runeData) {
                    return Promise.reject("missing runeData");
                }
                const runeTx = this.convert2RuneTx(param.data);
                const  opReturnOutput = this.getRuneMainOpReturnOutput(network, runeTx.runeData!);
                runeTx.outputs.push(opReturnOutput as never)
                txHex = signBtc(runeTx, privateKey, network);
                return Promise.resolve(txHex);
            } catch (e) {
                return Promise.reject(e);
            }
        }
        else if (param.data.runeData.mint && !param.data.runeData.serialMint) {
            try {
                let txHexs = []
                const privateKey = param.privateKey;
                if (!param.data.runeData) {
                    return Promise.reject("missing runeData");
                }
                let mintData = {
                    id: param.data.outputs[0].data.id,
                    amount: param.data.outputs[0].data.amount,
                    mintNum: param.data.runeData.mintNum,
                }

                // First of all, you need to estimate the approximate minimum fee of Mint.
                let baseMintTx = this.getMockMinRuneTx(param.data, mintData)
                const opMintReturnOutput = this.getRuneMainOpReturnOutput(network, baseMintTx.runeData!);
                baseMintTx.outputs.push(opMintReturnOutput as never)
                txHex = signBtc(baseMintTx, privateKey, network);
                // console.log(txHex)
                const baseMintfee = bitcoin.estimateBtcFee(baseMintTx, this.network()) + 546;

                // Continue to generate split transactions for batch Mint
                const runeTx = this.convert2RuneTx(param.data);
                let batchMintStatNum = runeTx.outputs.length
                for (let i = 0; i < mintData.mintNum - 1; i++) {
                    runeTx.outputs.push({
                        address: param.data.address,
                        amount: baseMintfee,
                    } as never)
                }
                const opReturnOutput = this.getRuneMainOpReturnOutput(network, runeTx.runeData!);
                runeTx.outputs.push(opReturnOutput as never)

                // Sign the split transaction and get the transaction hash
                txHex = signBtc(runeTx, privateKey, network);
                const parentTxId = Transaction.fromHex(txHex).getId();
                txHexs.push(txHex)

                // Generate the structure of the sub-Mint transaction and sign it
                for (let i = 0; i < mintData.mintNum - 1; i++) {
                    let curInput = {
                        txId: parentTxId,
                        vOut: batchMintStatNum,
                        address: param.data.address,
                        amount: baseMintfee,
                        data: [mintData]
                    }
                    let curOutput = {
                        address: param.data.address,
                        amount: 546
                    }
                    batchMintStatNum += 1
                    let curSubTx = this.getMinRuneTx(param.data, mintData, curInput, curOutput)
                    curSubTx.outputs.push(opReturnOutput as never)

                    let curSubTxHex = signBtc(curSubTx, privateKey, network);
                    // let curMintfee = bitcoin.estimateBtcFee(curSubTx, this.network());
                    // console.log(curMintfee)

                    txHexs.push(curSubTxHex)
                }
                return Promise.resolve(txHexs);
            } catch (e) {
                return Promise.reject(e);
            }
        }else {
            try {
                let txHexs = []
                const privateKey = param.privateKey;
                if (!param.data.runeData) {
                    return Promise.reject("missing runeData");
                }
                let mintData = {
                    id: param.data.outputs[0].data.id,
                    amount: 1,
                    mintNum: param.data.runeData.mintNum,
                }
                let baseMintTx = this.getMockMinRuneTx(param.data, mintData)
                const opMintReturnOutput = buildRuneMainMintOp(mintData.id,false,0,true);
                baseMintTx.outputs.push(opMintReturnOutput as never)
                const baseMintfee = bitcoin.estimateBtcFee(baseMintTx, this.network()) ;
                let curAmount =  (mintData.mintNum-1) * baseMintfee + 546

                const runeTx = this.convert2RuneTxSerialMint(param.data,curAmount);
                runeTx.outputs.push(opMintReturnOutput as never)

                txHex = signBtc(runeTx, privateKey, network);
                let parentTxId = Transaction.fromHex(txHex).getId();
                txHexs.push(txHex)

                for (let i = 1; i < mintData.mintNum ; i++) {
                    let curInput = {
                        txId: parentTxId,
                        vOut: 0,
                        address: param.data.address,
                        amount: curAmount
                    }
                    curAmount  = curAmount - baseMintfee
                    let curOutput = {
                        address: param.data.address,
                        amount: curAmount
                    }
                    let curSubTx = this.getMinRuneTx(param.data, mintData, curInput, curOutput)
                    curSubTx.outputs.push(opMintReturnOutput as never)

                    let curSubTxHex = signBtc(curSubTx, privateKey, network);
                    parentTxId = Transaction.fromHex(curSubTxHex).getId();
                    txHexs.push(curSubTxHex)
                }
                return  txHexs
            }
            catch (e) {
                return Promise.reject(e);
            }
        }
    }

    private getRuneMainOpReturnOutput(network: bitcoin.Network, runeData: bitcoin.RuneData) {
        let isMainnet = false;
        if (networks.bitcoin === network) {
            isMainnet = true;
        }
        if (runeData.useDefaultOutput == undefined ){
            runeData.useDefaultOutput = false;
        }
        if (runeData.defaultOutput == undefined ){
            runeData.defaultOutput = 0;
        }
        if (runeData.mint == undefined){
            runeData.mint = false
        }
        if (runeData.mintNum == undefined){
            runeData.mintNum = 0
        }

        const opReturnScript = buildRuneMainMintData(
            // @ts-ignore
            isMainnet, runeData.edicts,runeData.useDefaultOutput,runeData.defaultOutput,runeData.mint,runeData.mintNum);
        return  {address: '', amount: 0, omniScript: base.toHex(opReturnScript)};
    }

    async estimateFee(param: SignTxParams): Promise<any> {
        try {
            const network = this.network()
            if (!param.data.runeData) {
                return Promise.reject("missing runeData");
            }
            const runeTx = this.convert2RuneTx(param.data);
            const opReturnOutput = this.getRuneMainOpReturnOutput(this.network(), runeTx.runeData!);
            runeTx.outputs.push(opReturnOutput as never)

            let mintData = {
                id : param.data.outputs[0].data.id,
                amount : param.data.outputs[0].data.amount,
                mintNum : param.data.runeData.mintNum,
            }

            let batchMintStatNum = runeTx.outputs.length
            for (let i = 0; i<mintData.mintNum-1; i++){
                runeTx.outputs.push({
                    address:param.data.address,
                    amount:8000,
                } as never)
            }
            const fee = bitcoin.estimateBtcFee(runeTx, this.network());

            if (param.data.runeData.mintNum == undefined || param.data.runeData.mintNum <= 1) {
                return Promise.resolve(fee);
            }
            else if (param.data.runeData.mint && !param.data.runeData.serialMint){
                let fees = []
                fees.push(fee)

                let mintData = {
                    id : param.data.outputs[0].data.id,
                    amount : param.data.outputs[0].data.amount,
                    mintNum : param.data.runeData.mintNum,
                }

                // First of all, you need to estimate the approximate minimum fee of Mint.
                let baseMintTx =  this.getMockMinRuneTx(param.data,mintData)
                const  opMintReturnOutput = this.getRuneMainOpReturnOutput(this.network(), baseMintTx.runeData!);
                baseMintTx.outputs.push(opMintReturnOutput as never)

                const baseMintfee = bitcoin.estimateBtcFee(baseMintTx, this.network());

                for (let i=0;i<param.data.runeData.mintNum -1; i++ ){
                    fees.push(baseMintfee)
                }
                return Promise.resolve(fees);
            }
            else if  (param.data.runeData.mint && param.data.runeData.serialMint){
                let fees = []
                if (!param.data.runeData) {
                    return Promise.reject("missing runeData");
                }
                let mintData = {
                    id: param.data.outputs[0].data.id,
                    amount: 1,
                    mintNum: param.data.runeData.mintNum,
                }
                let baseMintTx = this.getMockMinRuneTx(param.data, mintData)
                const opMintReturnOutput = buildRuneMainMintOp(mintData.id,false,0,true);
                baseMintTx.outputs.push(opMintReturnOutput as never)
                const baseMintfee = bitcoin.estimateBtcFee(baseMintTx, this.network()) ;
                let curAmount =  (mintData.mintNum-1) * baseMintfee + 546

                const runeTx = this.convert2RuneTxSerialMint(param.data,curAmount);
                runeTx.outputs.push(opMintReturnOutput as never)
                let fee = bitcoin.estimateBtcFee(runeTx,network)
                fees.push(fee)
                for (let i = 1; i < mintData.mintNum ; i++) {
                    fees.push(baseMintfee)
                }
                return Promise.resolve(fees);
            }
        } catch (e) {
            return Promise.reject(e);
        }
    }

    convert2RuneTxSerialMint(paramData: any,outputAmount: number): utxoTx {
        const clonedParamData = cloneObject(paramData)

        let curOutputs = [{
            address:clonedParamData.address,
            amount:outputAmount
        }]
        return {
            inputs: clonedParamData.inputs,
            // @ts-ignore
            outputs: curOutputs,
            address: clonedParamData.address,
            feePerB: clonedParamData.feePerB,
            runeData: {
                edicts: clonedParamData.runeData!.edicts,
                etching: clonedParamData.runeData!.etching,
                burn: clonedParamData.runeData!.burn,
                defaultOutput : clonedParamData.runeData!.defaultOutput,
                mint: clonedParamData.runeData!.mint,
                mintNum: clonedParamData.runeData!.mintNum,
            },
        }
    }
    convert2RuneTxPsbt(paramData: any): utxoTx {
        const clonedParamData = cloneObject(paramData)

        return {
            inputs: clonedParamData.inputs,
            // @ts-ignore
            outputs: clonedParamData.outputs,
            address: clonedParamData.address,
            feePerB: clonedParamData.feePerB,
            runeData: {
                edicts: clonedParamData.runeData.edicts,
                etching: clonedParamData.runeData!.etching,
                burn: clonedParamData.runeData!.burn,
                defaultOutput : clonedParamData.runeData!.defaultOutput,
                mint: clonedParamData.runeData!.mint,
                mintNum: clonedParamData.runeData!.mintNum,
            },
        }
    }


    async buildPsbt(param: SignTxParams): Promise<any> {
        const network = this.network()
        let txHex = null;
        try {
            const privateKey = param.privateKey;
            if (!param.data.runeData) {
                return Promise.reject("missing runeData");
            }
            const runeTx = this.convert2RuneTxPsbt(param.data);

            // @ts-ignore
            const opReturnOutput = this.getRuneMainOpReturnOutput(network, runeTx.runeData);
            runeTx.outputs.push(opReturnOutput as never)
            let fakeAddr = "KwdkfXMV2wxDVDMPPuFZsio3NeCskAUd4N2U4PriTgpj2MqAGmmc"
            if (runeTx.dustSize == undefined){
                runeTx.dustSize = 546
            }
            let {
                inputAmount,
                outputAmount,
                virtualSize
            } = calculateTxSize(runeTx.inputs,runeTx.outputs,runeTx.address,fakeAddr,network,runeTx.dustSize)
            // @ts-ignore
            let changeAmount = inputAmount - outputAmount - Math.ceil(virtualSize * runeTx.feePerB);

            if (changeAmount > runeTx.dustSize) {
                runeTx.outputs.push({ address:runeTx.address,amount:changeAmount} as never)
            }
            // 546 ,500

            const txHex = buildPsbt(runeTx,network)
            const res = [txHex,changeAmount]
                // txHex = signBtc(runeTx, privateKey, network);
            return Promise.resolve(res);
        } catch (e) {
            return Promise.reject(e);
        }
    }
}

export class RuneMainTestWallet extends RuneMainWallet {
    network() {
        return bitcoin.networks.testnet;
    }
}
