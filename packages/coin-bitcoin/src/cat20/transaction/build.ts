import {btc, GuardContract, TokenPrevTx, SupportedNetwork,  TokenMetadata} from "../common";
import {FixedArray} from 'scrypt-ts';
import {
    EcKeyService, getDummyEcKey,
    getGuardsP2TR,
    getTokenContractP2TR,
    p2tr2Address,
    tokenInfoParse,
    tokenUtxoParse,
    toP2tr,
    toStateScript,
    toTokenAddress,
    toTxOutpoint,
    validatePrevTx
} from "../utils";
import {unlockGuardMulti, unlockToken} from "./functions";
import {
    CAT20Proto,
    CAT20State,
    getTxCtxMulti,
    getTxHeaderCheck,
    GuardInfo, GuardProto,
    MAX_INPUT, MAX_OUTPUT,
    ProtocolState
} from "@cat-protocol/cat-smartcontracts";
import * as btcSigner from '@scure/btc-signer';
import * as bitcoinjs from '../../bitcoinjs-lib'
import {toSignInput} from "../../type";

export enum UtxoType {
    FEE = "fee",
    GUARD = "guard",
    TOKEN = "token",
    MINTER = "minter",
    SELL = "sell",
    CONTRACT = "contract",
}

export type TokenParams =  {
    tokenUtxo: string
    tokenAmount: string
    tokenReceiver: string
    isContractSpend?: boolean
    contractInputIndex?: number,
}

export type GuardParams =  {
    inputTokenAmountArray: string[],
}

export type SellParams =  {

}

export type BuildInput = {
    txId: string
    vOut: number
    amount: number  // min unit: satoshi
    publicKey?: string
    address?: string
    utxoType: UtxoType
    script?: string
    tokenMetadataIndex?: number
    previousTxs?: TokenPrevTx
    contractParams?: string
    signature?: string,
}

export type BuildOutput = {
    amount: number  // min unit: satoshi
    address?: string
    script?: string
    utxoType: UtxoType
    tokenMetadataIndex?: number
    contractParams?: string
}

export interface BuildTxParams {
    tokenMetadatas: string[],
    inputs: BuildInput[],
    outputs: BuildOutput[],
    opReturn?: string,
    signedResults?: {
        signatures?: string[],
        contractUnlockWitnesses?: string[][],
    },
    verifyScript?: boolean,
}

export type MetadataInfo = {
    metadata: TokenMetadata,
    minterP2TR: string,
    tokenP2TR: string,
    tokenScript: string,
    tokenTapScript: string,
    tokenCblock: string,
    inputTokenAmountArray: FixedArray<bigint, typeof MAX_INPUT>
    tokenStates: CAT20State[]
    tokenIndexes: number[]
    guardContract?: GuardContract,
    guardInfo?: GuardInfo,
}

export type PsbtInfo = {
    toSign?: boolean,
    script?: string,
    cblock?: string,
}

export function getSignatures(psbtHex: string, toSignInputs: toSignInput[]) {
    const psbt = bitcoinjs.psbt.Psbt.fromHex(psbtHex);
    let signatures: string[] = Array.from({length: psbt.data.inputs.length}, () => '')

    toSignInputs.forEach(toSignInput=> {
        const inputIndex = toSignInput.index
        if (inputIndex >= psbt.data.inputs.length) {
            throw new Error(`inputIndex ${inputIndex} greater than psbt inputs length ${psbt.data.inputs.length}`)
        }
        const input =  psbt.data.inputs[inputIndex]
        if (input.tapLeafScript) { // tap script
            const tapScriptSig = input.tapScriptSig
            if(!Array.isArray(tapScriptSig) || tapScriptSig.length < 1) {
                throw new Error(`getTapScriptSigFromPSBT failed for input: ${inputIndex}`)
            }
            signatures[inputIndex] = tapScriptSig[0].signature.toString('hex');
        } else {
            const tapKeySig = psbt.data.inputs[inputIndex].tapKeySig
            if(!tapKeySig) {
                throw new Error(`getTapKeySigFromPSBT failed for input: ${inputIndex}`)
            }
            signatures[inputIndex] = tapKeySig.toString('hex');
        }
    })
    return signatures
}

export function verifySignatures(signatures: string[], toSignInputs: toSignInput[]) {
    return toSignInputs.every(toSignInput  => {
        const inputIndex = toSignInput.index
        if (inputIndex >= signatures.length) {
            throw new Error(`inputIndex ${inputIndex} greater than signatures length ${signatures.length}`)
        }
        const signature = signatures[inputIndex]
        if (!signature) {
            return false
        }

        return true
    })
}
export async function build(params: BuildTxParams) {
    const tx =  new btc.Transaction()
    let verifyScript = params.verifyScript || false;

    if (params.inputs.length <= 0  || params.inputs.length > MAX_INPUT) {
        throw new Error(`Max input number is ${MAX_INPUT}`)
    }

    if (params.outputs.length <= 0  || params.outputs.length > MAX_OUTPUT) {
        throw new Error(`Max output number is ${MAX_OUTPUT}`)
    }

    const newState = ProtocolState.getEmptyState();
    const tokenStates: CAT20State[]  = new Array(MAX_INPUT).fill(undefined)
    const tapScripts: string[] = []
    const txCtxIndexes: number[] = []


    // 1. parse token metadatas
    let metadatas = params.tokenMetadatas.map(m => {
        const metadata = tokenInfoParse(m, SupportedNetwork.fractalMainnet)
        const minterP2TR = toP2tr(metadata.minterAddr);
        const {p2tr: tokenP2TR, tapScript: tokenTapScript, cblock: tokenCblock, script: tokenScript} = getTokenContractP2TR(minterP2TR);

        const inputTokenAmountArray: FixedArray<bigint, typeof MAX_INPUT> = new Array(MAX_INPUT).fill(0n) as FixedArray<bigint, typeof MAX_INPUT>;
        const tokenStates: CAT20State[] = []
        const tokenIndexes: number[] = []

        return  {
            metadata,
            minterP2TR,
            tokenP2TR,
            tokenScript,
            tokenTapScript,
            tokenStates,
            tokenCblock,
            tokenIndexes,
            inputTokenAmountArray,
        } as MetadataInfo
    })

    const {p2tr: guardP2TR, tapScript: guardTapScript} = getGuardsP2TR();
    let psbtInfos: PsbtInfo[] = []

    // 2. for each input create script including token, guard, and sell
    const inputUtxos = params.inputs.map((input, i) => {
        let txInput = {
            txId: input.txId,
            outputIndex: input.vOut,
            script: input.script ?? '',
            satoshis: input.amount,
        }

        if (input.address) {
            txInput.script = txInput.script || btc.Script.fromAddress(input.address);
        }

        if (input.utxoType == UtxoType.FEE) {
            if (!input.publicKey && !input.address && !input.script) {
                throw new Error(`Fee input requires either script or address`)
            }
            if (!txInput.script) {
                const ecKey = new EcKeyService({publicKey: input.publicKey})
                txInput.script = btc.Script.fromAddress(ecKey.getAddress());
            }
            psbtInfos.push({
                toSign: true,
            })

        }
        else if (input.utxoType == UtxoType.TOKEN) {
            if (!input.contractParams) {
                throw new Error(`Token input ${i} requires contractParams`)
            }
            const tokenParams = JSON.parse(input.contractParams) as TokenParams

            const metadataIndex = input.tokenMetadataIndex
            if (metadataIndex === undefined) {
                throw new Error(`Token input ${i} requires tokenMetadataIndex`)
            }
            if (metadataIndex >= metadatas.length ) {
                throw new Error(`Token input ${i} tokenMetadataIndex ${metadataIndex} out of metadatas' range ${metadatas.length}`)
            }

            const {
                tokenP2TR,
                tokenTapScript,
                tokenCblock,
                tokenScript
            } = metadatas[metadataIndex]

            txInput.script = txInput.script || tokenP2TR
            psbtInfos.push({
                toSign: !tokenParams.isContractSpend,
                script: tokenScript,
                cblock: tokenCblock,
            })

            tapScripts.push(tokenTapScript)
            txCtxIndexes.push(i)

            if (!params.signedResults) {
                return txInput
            }

            const [token] = tokenUtxoParse(tokenParams.tokenUtxo)

            metadatas[metadataIndex].inputTokenAmountArray[i] = token.state.data.amount

        }
        else if (input.utxoType == UtxoType.GUARD) {
            txInput.script = txInput.script || guardP2TR
            psbtInfos.push({})

            tapScripts.push(guardTapScript)
            txCtxIndexes.push(i)

            if (!params.signedResults) {
                return txInput
            }

            const metadataIndex = input.tokenMetadataIndex
            if (metadataIndex === undefined) {
                throw new Error(`Token input ${i} requires tokenMetadataIndex`)
            }
            if (metadataIndex >= metadatas.length ) {
                throw new Error(`Token input ${i} tokenMetadataIndex ${metadataIndex} out of metadatas' range ${metadatas.length}`)
            }

            const {tokenP2TR, inputTokenAmountArray} = metadatas[metadataIndex]

            const guardContract = {
                utxo: txInput,
                state: {
                    protocolState: ProtocolState.getEmptyState(),
                    data: {
                        tokenScript: tokenP2TR,
                        inputTokenAmountArray: inputTokenAmountArray,
                    }
                }
            }

            if (input.previousTxs === undefined) {
                throw new Error(`Guard input ${i} requires previousTxs.prevTx`)
            }
            const commitTx = new btc.Transaction(input.previousTxs.prevTx)

            const guardCommitTxHeader = getTxHeaderCheck(
                commitTx,
                guardContract.utxo.outputIndex,
            );

            metadatas[metadataIndex].guardContract = guardContract
            metadatas[metadataIndex].guardInfo = {
                outputIndex: toTxOutpoint(
                    guardContract.utxo.txId,
                    guardContract.utxo.outputIndex,
                ).outputIndex,
                inputIndexVal: BigInt(i),
                tx: guardCommitTxHeader.tx,
                guardState: guardContract.state.data,
            }

        }
        else if (input.utxoType == UtxoType.MINTER) {
            throw new Error('Minter currently not supported')
        }
        else if (input.utxoType == UtxoType.SELL) {
            // todo
            throw new Error('Sell currently not supported')
        }
        else if (input.utxoType == UtxoType.CONTRACT) {
            if (!input.script) {
                throw new Error(`Contract input ${i} requires script`)
            }
        }
        return txInput
    })

    tx.from(inputUtxos)

    // 3. for each output create output script
    const outputs: btc.Transaction.Output[] = params.outputs.map((output, i) => {
        let txOutput = {
            script: output.script ?? '',
            satoshis: output.amount,
        }

        if (output.address) {
            txOutput.script = txOutput.script || btc.Script.fromAddress(output.address);
        }

        if (output.utxoType == UtxoType.FEE) {
            if (!output.address && !output.script) {
                throw new Error(`Fee output requires either script or address`)
            }

        }
        else if (output.utxoType == UtxoType.TOKEN) {
            if (!output.contractParams) {
                throw new Error(`Token output ${i} requires contractParams`)
            }
            const tokenParams = JSON.parse(output.contractParams) as TokenParams

            const metadataIndex = output.tokenMetadataIndex
            if (metadataIndex === undefined) {
                throw new Error(`Token output ${i} requires tokenMetadataIndex`)
            }
            if (metadataIndex >= metadatas.length ) {
                throw new Error(`Token output ${i} tokenMetadataIndex ${metadataIndex} out of metadatas' range ${metadatas.length}`)
            }

            const { metadata, tokenP2TR,tokenTapScript} = metadatas[metadataIndex]
            txOutput.script = tokenP2TR

            let amount: bigint;
            try {
                amount = BigInt(tokenParams.tokenAmount);
            } catch (error) {
                throw new Error(`Invalid token amount:  ${tokenParams.tokenAmount}`);
            }

            const tokenState = CAT20Proto.create(amount, toTokenAddress(tokenParams.tokenReceiver));
            tokenStates[i] = tokenState
            newState.updateDataList(i, CAT20Proto.toByteString(tokenState));
            metadatas[metadataIndex].tokenIndexes.push(i)
            metadatas[metadataIndex].tokenStates.push(tokenState)

        }
        else if (output.utxoType == UtxoType.GUARD) {
            txOutput.script = guardP2TR
            if (!output.contractParams) {
                throw new Error(`Token output ${i} requires contractParams`)
            }
            const guardParams = JSON.parse(output.contractParams) as GuardParams

            const metadataIndex = output.tokenMetadataIndex
            if (metadataIndex === undefined) {
                throw new Error(`Token output ${i} requires tokenMetadataIndex`)
            }
            if (metadataIndex >= metadatas.length ) {
                throw new Error(`Token output ${i} tokenMetadataIndex ${metadataIndex} out of metadatas' range ${metadatas.length}`)
            }
            const { tokenP2TR } = metadatas[metadataIndex]
            const guardState = GuardProto.createEmptyState();

            guardState.tokenScript = tokenP2TR;
            if (guardParams.inputTokenAmountArray.length !== MAX_INPUT) {
                throw new Error(`Guard output ${i} requires inputTokenAmountArray of length ${MAX_INPUT}`)
            }
            guardParams.inputTokenAmountArray.forEach((a, i) => {
                guardState.inputTokenAmountArray[i] = BigInt(a)
            })
            newState.updateDataList(0, GuardProto.toByteString(guardState));

        }
        else if (output.utxoType == UtxoType.MINTER) {
            throw new Error('Minter currently not supported')
        } else if (output.utxoType == UtxoType.SELL) {
            // todo
            throw new Error('Sell currently not supported')
        }
        else if (output.utxoType == UtxoType.CONTRACT) {
            if (!output.script) {
                throw new Error(`Contract output ${i} requires script`)
            }
        }

        return new btc.Transaction.Output(txOutput)
    })

    // 4. create op_return (keep track of state)
    if (params.opReturn) { // use user opReturn if provided
        tx.addOutput(
            new btc.Transaction.Output({
                satoshis: 0,
                script: new btc.Script(params.opReturn)
            }),
        )
    } else {
        tx.addOutput(
            new btc.Transaction.Output({
                satoshis: 0,
                script: toStateScript(newState),
            }),
        )
    }


    // 5. add other outputs
    outputs.map(o => tx.addOutput(o))

    // 6. get all txCtxs - this steps modifies the tx.nLocktime and should be done here
    // after all tx inputs and outputs are added and before being sent to sign
    const txCtxs = getTxCtxMulti(
        tx,
        txCtxIndexes,
        tapScripts.map(ts => Buffer.from(ts, 'hex'))
    )

    // 7. return psbt for signing
    if (!params.signedResults) {
        console.log('txid:', tx.id)
        // console.log('inputs:', tx.inputs.map((i:any) => i.output.script.toBuffer().toString('hex')))
        // console.log('outputs:', tx.outputs.map((o:any) => o.script.toBuffer().toString('hex')))

        const btcSignerTx = btcSigner.Transaction.fromRaw(tx.toBuffer(), { allowUnknownOutputs: true })
        const psbt = bitcoinjs.psbt.Psbt.fromBuffer(Buffer.from(btcSignerTx.toPSBT()))

        const toSignInputs: toSignInput[] = [];

        for (let i = 0; i < psbt.inputCount; i++) {
            const witnessUtxo = {
                value: tx.inputs[i].output.satoshis || 0n,
                script: tx.inputs[i].output.script.toBuffer() || btc.Script.empty(),
            }

            const psbtInfo = psbtInfos[i]
            if (psbtInfo.script && psbtInfo.cblock) {
                psbt.updateInput(i, {
                    witnessUtxo,
                    tapLeafScript: [{
                        leafVersion: 192,
                        script: Buffer.from(psbtInfo.script, 'hex'),
                        controlBlock: Buffer.from(psbtInfo.cblock, 'hex'),
                    }],
                });
            } else {
                psbt.updateInput(i, {
                    witnessUtxo,
                });

            }

            if (psbtInfo.toSign) {
                toSignInputs.push({
                    index: i,
                    sighashTypes: [0],
                })
            }
        }

        return {
            psbt: psbt.toHex(),
            toSignInputs,
        }
    }

    // 8. write signature in from signature list
    const signatures = params.signedResults.signatures
    const contractUnlockWitnesses = params.signedResults.contractUnlockWitnesses

    if (!signatures && !contractUnlockWitnesses) {
        throw new Error('signatures and/or contractUnlockWitnesses is required')
    }
    if (signatures && signatures.length !== params.inputs.length) {
        throw new Error(`signatures length ${signatures.length} does not match inputs length ${params.inputs.length}`)
    }
    if (contractUnlockWitnesses && contractUnlockWitnesses.length !== params.inputs.length) {
        throw new Error(`contractUnlockWitnesses length ${contractUnlockWitnesses.length} does not match inputs length ${params.inputs.length}`)
    }



    await Promise.all(params.inputs.map(async (input, i) => {
        if (input.utxoType == UtxoType.FEE) {
            if (!signatures || !signatures[i]) {
                throw new Error(`Fee input ${i} requires signature`)
            }

            tx.inputs[i].setWitnesses([
                Buffer.from(signatures[i], 'hex'),
            ]);

        }
        else if (input.utxoType == UtxoType.TOKEN) {
            const metadataIndex = input.tokenMetadataIndex
            if (metadataIndex === undefined) {
                throw new Error(`Token input ${i} requires tokenMetadataIndex`)
            }
            if (metadataIndex >= metadatas.length ) {
                throw new Error(`Token input ${i} tokenMetadataIndex ${metadataIndex} out of metadatas' range ${metadatas.length}`)
            }

            const { metadata, minterP2TR, guardInfo, tokenTapScript} = metadatas[metadataIndex]
            if (guardInfo === undefined){
                throw new Error (`Token ${i} has no matching guard`)
            }

            if (!input.previousTxs) {
                throw new Error (`Token ${i} requires previousTxs`)
            }

            if (!input.contractParams) {
                throw new Error(`Token input ${i} requires contractParams`)
            }

            const tokenParams = JSON.parse(input.contractParams) as TokenParams
            const [token] = tokenUtxoParse(tokenParams.tokenUtxo)
            const tokenTx = validatePrevTx(
                metadata,
                input.previousTxs.prevTx,
                input.previousTxs.prevPrevTx,
                SupportedNetwork.fractalMainnet
            )
            if (tokenTx === null) {
                throw new Error('prevTx does not match prevPrevTx');
            }
            let ecKey = getDummyEcKey()
            let signature = ''

            if (!tokenParams.isContractSpend){
                ecKey = new EcKeyService({publicKey: input.publicKey})
                if (!signatures || !signatures[i]) {
                    throw new Error(`Token input ${i} requires signature`)
                }
                signature = signatures[i]
            }

            const res = await unlockToken(
                ecKey,
                token,
                i,
                tokenTx.prevTx,
                tokenTx.prevTokenInputIndex,
                tokenTx.prevPrevTx,
                guardInfo,
                tx,
                minterP2TR,
                txCtxs[i],
                verifyScript,
                signature,
                tokenParams.isContractSpend,
                tokenParams.contractInputIndex,
            );
            if (!res) {
                throw new Error(`Building token input ${i} failed`)
            }
        }
        else if (input.utxoType == UtxoType.GUARD) {
            const metadataIndex = input.tokenMetadataIndex
            if (metadataIndex === undefined) {
                throw new Error(`Token input ${i} requires tokenMetadataIndex`)
            }
            if (metadataIndex >= metadatas.length ) {
                throw new Error(`Token input ${i} tokenMetadataIndex ${metadataIndex} out of metadatas' range ${metadatas.length}`)
            }
            const {guardContract, guardInfo, tokenIndexes, tokenStates} = metadatas[metadataIndex]
            if (guardInfo === undefined || guardContract == undefined){
                throw new Error (`Guard ${i} has no guardInfo`)
            }

            const res = await unlockGuardMulti(
                guardContract,
                guardInfo,
                i,
                newState,
                tx,
                tokenStates,
                tokenIndexes,
                txCtxs[i],
                verifyScript,
            );
            if (!res) {
                throw new Error(`Building guard input ${i} failed`)
            }

        }
        else if (input.utxoType == UtxoType.MINTER) {
            throw new Error('Minter currently not supported')
        } else if (input.utxoType == UtxoType.SELL) {
            // todo
            throw new Error('Sell currently not supported')
        }
        else if (input.utxoType == UtxoType.CONTRACT) {
            if (!contractUnlockWitnesses || !contractUnlockWitnesses[i]) {
                throw new Error(`Sell input ${i} requires contractUnlockWitnesses`)
            }
            tx.inputs[i].setWitnesses(contractUnlockWitnesses[i].map(w => Buffer.from(w, 'hex')))
        }
    }))


    // return tx
    return tx.uncheckedSerialize().toString('hex')

}