import {
    btc,
    CHANGE_MIN_POSTAGE,
    Postage,
    SupportedNetwork,
    CatTransferParams, SignData
} from "../common";
import {int2ByteString, toByteString,} from 'scrypt-ts';
import {
    EcKeyService,
    feeUtxoParse,
    tokenInfoParse,
    TokenTx,
    validatePrevTx,
    getTokenContractP2TR,
    toP2tr,
    toStateScript,
    toTokenAddress,
    toTxOutpoint,
    tokenUtxoParse,
} from "../utils";
import {
    CAT20Proto,
    CAT20State,
    ChangeInfo,
    getTxCtxMulti,
    getTxHeaderCheck,
    GuardInfo,
    MAX_INPUT,
    ProtocolState
} from "@cat-protocol/cat-smartcontracts";
import {createGuardContract, unlockGuard, unlockToken} from "./functions";
import {mergeFee} from "./merge";
import {SignTxParams} from "@okxweb3/coin-base";
import {calcVsizeTransfer} from "./transfer";

async function buildData(param: SignTxParams) {
    const txParams: CatTransferParams = param.data

    const ecKey = new EcKeyService({
        publicKey: txParams.publicKey,
    });

    let metadata = tokenInfoParse(txParams.tokenMetadata, SupportedNetwork.fractalMainnet);
    const minterP2TR = toP2tr(metadata.minterAddr);
    const {p2tr: tokenP2TR, tapScript: tokenTapScript} = getTokenContractP2TR(minterP2TR);
    let verifyScript = txParams.verifyScript || false;

    // address and cat-amount
    let receiver: btc.Address;
    let amount: bigint;
    try {
        receiver = btc.Address.fromString(txParams.toAddress);
    } catch (error) {
        throw new Error(`Invalid receiver address: ${txParams.toAddress}`);
    }

    if (receiver.type !== 'taproot') {
        throw new Error(`Invalid address type: ${receiver.type}`);
    }

    try {
        amount = BigInt(txParams.tokenAmount);
    } catch (error) {
        throw new Error(`Invalid token amount:  ${txParams.tokenAmount}`);
    }

    if (amount <= 0n) {
        throw new Error('Invalid token amount');
    }

    const feeUtxos = feeUtxoParse(ecKey, param.data.feeInputs)
    let feeUtxo = feeUtxos[0]

    let mergeTx: btc.Transaction
    if (feeUtxos.length > 1) {
        ({feeUtxo, mergeTx} = mergeFee(ecKey, feeUtxos, txParams.feeRate))
    }

    let tokens = tokenUtxoParse(txParams.tokens);

    const commitResult = createGuardContract(
        ecKey,
        feeUtxo,
        txParams.feeRate,
        tokens,
        tokenP2TR,
        txParams.changeAddress,
    );

    if (commitResult === null) {
        throw new Error('commit fail')
    }
    const {commitTx, contact: guardContract, guardTapScript} = commitResult;

    const newState = ProtocolState.getEmptyState();

    const receiverTokenState = CAT20Proto.create(amount, toTokenAddress(receiver),);

    newState.updateDataList(0, CAT20Proto.toByteString(receiverTokenState));

    const tokenInputAmount = tokens.reduce((acc, t) => acc + t.state.data.amount, 0n,);

    const changeTokenInputAmount = tokenInputAmount - amount;

    let changeTokenState: null | CAT20State = null;

    if (changeTokenInputAmount > 0n) {
        const tokenChangeAddress = ecKey.getTokenAddress();
        changeTokenState = CAT20Proto.create(
            changeTokenInputAmount,
            tokenChangeAddress,
        );
        newState.updateDataList(1, CAT20Proto.toByteString(changeTokenState));
    }

    const newFeeUtxo = {
        txId: commitTx.id,
        outputIndex: 2,
        script: commitTx.outputs[2].script.toHex(),
        satoshis: commitTx.outputs[2].satoshis,
    }

    const inputUtxos = [
        ...tokens.map((t) => t.utxo),
        guardContract.utxo,
        newFeeUtxo,
    ];

    if (inputUtxos.length > MAX_INPUT) {
        throw new Error('Too many inputs, max 4 token inputs');
    }

    const revealTx = new btc.Transaction()
        .from(inputUtxos)
        .addOutput(
            new btc.Transaction.Output({
                satoshis: 0,
                script: toStateScript(newState),
            }),
        )
        .addOutput(
            new btc.Transaction.Output({
                satoshis: Postage.TOKEN_POSTAGE,
                script: tokenP2TR,
            }),
        )
        .feePerByte(txParams.feeRate);

    if (changeTokenState) {
        revealTx.addOutput(
            new btc.Transaction.Output({
                satoshis: Postage.TOKEN_POSTAGE,
                script: tokenP2TR,
            }),
        );
    }

    const satoshiChangeScript = btc.Script.fromAddress(txParams.changeAddress);
    revealTx.addOutput(
        new btc.Transaction.Output({
            satoshis: 0,
            script: satoshiChangeScript,
        }),
    );

    let tokenTxs: TokenTx[] = []
    if (txParams.tokenPrevTxs.length !== tokens.length) {
        throw new Error('Invalid tokenPrevTxs length');
    }

    for (let i = 0; i < tokens.length; i++) {
        const prevTx = txParams.tokenPrevTxs[i].prevTx;
        const prevPrevTx = txParams.tokenPrevTxs[i].prevPrevTx;
        const res = validatePrevTx(metadata, prevTx, prevPrevTx, SupportedNetwork.fractalMainnet)
        if (res === null) {
            throw new Error('prevTx does not match prevPrevTx');
        }
        tokenTxs.push(res)
    }

    const guardCommitTxHeader = getTxHeaderCheck(
        commitTx,
        guardContract.utxo.outputIndex,
    );

    const guardInputIndex = tokens.length;
    const guardInfo: GuardInfo = {
        outputIndex: toTxOutpoint(
            guardContract.utxo.txId,
            guardContract.utxo.outputIndex,
        ).outputIndex,
        inputIndexVal: BigInt(guardInputIndex),
        tx: guardCommitTxHeader.tx,
        guardState: guardContract.state.data,
    };

    const vsize = await calcVsizeTransfer(
        tokens,
        guardContract,
        revealTx,
        guardInfo,
        tokenTxs,
        tokenTapScript,
        guardTapScript,
        newState,
        receiverTokenState,
        changeTokenState,
        satoshiChangeScript,
        minterP2TR,
    );

    const satoshiChangeAmount = revealTx.inputAmount - vsize * txParams.feeRate - Postage.TOKEN_POSTAGE - (changeTokenState === null ? 0 : Postage.TOKEN_POSTAGE);

    if (satoshiChangeAmount <= CHANGE_MIN_POSTAGE) {
        throw new Error('Insufficient satoshis balance!');
    }

    const satoshiChangeOutputIndex = changeTokenState === null ? 2 : 3;

    // update change amount
    revealTx.outputs[satoshiChangeOutputIndex].satoshis = satoshiChangeAmount;

    console.log(guardTapScript)
    const txCtxs = getTxCtxMulti(
        revealTx,
        tokens.map((_, i) => i).concat([tokens.length]),
        [
            ...new Array(tokens.length).fill(Buffer.from(tokenTapScript, 'hex')),
            Buffer.from(guardTapScript, 'hex'),
        ],
    );

    const changeInfo: ChangeInfo = {
        script: toByteString(satoshiChangeScript.toHex()),
        satoshis: int2ByteString(BigInt(satoshiChangeAmount), 8n),
    };

    const commitFeeInputIndex = 0
    const revealFeeInputIndex = revealTx.inputs.length - 1

    return {
        txParams,
        ecKey,
        tokens,
        tokenTxs,
        guardInfo,
        minterP2TR,
        verifyScript,
        guardContract,
        guardInputIndex,
        newState,
        receiverTokenState,
        changeTokenState,
        changeInfo,
        mergeTx,
        commitTx,
        revealTx,
        txCtxs,
        commitFeeInputIndex,
        revealFeeInputIndex,
    }

}
export async function buildSighashes(param: SignTxParams) {
    const {
        mergeTx, commitTx, revealTx, txCtxs, commitFeeInputIndex, revealFeeInputIndex,
    } = await buildData(param)

    function getSigHashSchnorrNonTapScript(
        transaction: btc.Transaction,
        inputIndex = 0,
        sigHashType = 0x00
    ): Buffer {
        const execdata = {
            annexPresent: false,
            annexInit: true,
        }

        return btc.Transaction.SighashSchnorr.sighash(
            transaction,
            sigHashType,
            inputIndex,
            2,
            execdata
        )
    }

    console.log(revealTx.uncheckedSerialize())
    const sighashes: SignData = {
        merge: mergeTx ?
            mergeTx.inputs.map((_: any, i: number) => {
                return getSigHashSchnorrNonTapScript(mergeTx, i).toString('hex');
            }) : [],
        commit: [getSigHashSchnorrNonTapScript(commitTx, commitFeeInputIndex).toString('hex')],
        reveal: [
            ...txCtxs.slice(0, txCtxs.length - 1).map((txCtx, i) => {
                return txCtx.sighash.hash.toString('hex')
            }),
            getSigHashSchnorrNonTapScript(revealTx, revealFeeInputIndex).toString('hex')]
    }
    return sighashes
}
export async function buildTxWithSig(param: SignTxParams){
    const {
        txParams, ecKey, tokens, tokenTxs, guardInfo,
        minterP2TR, verifyScript, guardContract, guardInputIndex,
        newState, receiverTokenState, changeTokenState,
        changeInfo, mergeTx, commitTx, revealTx,
        txCtxs, commitFeeInputIndex, revealFeeInputIndex,
    } = await buildData(param)

    const signData = txParams.signData
    if (!signData) {
        throw new Error('No signData')
    }

    if (signData.commit.length != commitTx.inputs.length) {
        throw new Error('Wrong number of commit signatures')
    }

    for (let i = 0; i < tokens.length; i++) {
        const signature = txParams.signData ? txParams.signData.reveal[i] : undefined
        // ignore changeInfo when transfer token
        const res = await unlockToken(
            ecKey,
            tokens[i],
            i,
            tokenTxs[i].prevTx,
            tokenTxs[i].prevTokenInputIndex,
            tokenTxs[i].prevPrevTx,
            guardInfo,
            revealTx,
            minterP2TR,
            txCtxs[i],
            verifyScript,
            signature
        );

        if (!res) {
            return null;
        }
    }
    const res = await unlockGuard(
        guardContract,
        guardInfo,
        guardInputIndex,
        newState,
        revealTx,
        receiverTokenState,
        changeTokenState,
        changeInfo,
        txCtxs[guardInputIndex],
        verifyScript,
    );

    if (!res) {
        return null;
    }

    // console.log({
    //     txid: {
    //         merge: mergeTx ? mergeTx.id : '',
    //         commit: commitTx.id,
    //         reveal: revealTx.id,
    //     },
    //     fees: {
    //         merge: mergeTx ? mergeTx.getFee() : 0,
    //         commit: commitTx.getFee(),
    //         reveal: revealTx.getFee(),
    //     }
    // });

    if (mergeTx) {
        if (signData.merge.length != mergeTx.inputs.length) {
            throw new Error('Wrong number of merge signatures')
        }
        for (let i = 0; i < mergeTx.inputs.length ; i++) {
            const sig = {
                signature: btc.crypto.Signature.fromString(Buffer.from(signData.merge[i], 'hex')),
                inputIndex: i
            }
            if (!mergeTx.inputs[i].isValidSignature(mergeTx, sig)) {
                throw new Error(`merge tx input ${i}'s signature is invalid`)
            }
            mergeTx.applySignature(sig)
        }
    }
    if (signData.commit.length != commitTx.inputs.length) {
        throw new Error('Wrong number of commit signatures')
    }

    const commitSig = {
        signature: btc.crypto.Signature.fromBuffer(Buffer.from(signData.commit[0], 'hex')),
        inputIndex: commitFeeInputIndex
    }
    if (!commitTx.inputs[commitFeeInputIndex].isValidSignature(commitTx, commitSig)) {
        throw new Error(`commit tx input ${commitFeeInputIndex}'s signature is invalid`)
    }
    commitTx.applySignature(commitSig)

    const revealSig = {
        signature: btc.crypto.Signature.fromBuffer(Buffer.from(signData.reveal[tokens.length], 'hex')),
        inputIndex: revealFeeInputIndex
    }
    if (!revealTx.inputs[revealFeeInputIndex].isValidSignature(revealTx, revealSig)) {
        throw new Error(`reveal tx input ${revealFeeInputIndex}'s signature is invalid`)
    }
    revealTx.applySignature(revealSig)
    return {
        mergeTx: mergeTx ? mergeTx.uncheckedSerialize() : null,
        commitTx: commitTx.uncheckedSerialize(),
        revealTx: revealTx.uncheckedSerialize(),
    }
}
