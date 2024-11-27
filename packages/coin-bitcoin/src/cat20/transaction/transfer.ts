import {
    btc,
    CHANGE_MIN_POSTAGE,
    GuardContract,
    OpenMinterTokenInfo, Postage,
    SupportedNetwork,
    TokenContract,
    CatTransferParams
} from "../common";
import {int2ByteString, toByteString,} from 'scrypt-ts';
import {
    EcKeyService,
    feeUtxoParse,
    tokenInfoParse,
    TokenTx,
    validatePrevTx,
    getTokenContractP2TR,
    resetTx,
    toP2tr,
    toStateScript,
    toTokenAddress,
    toTxOutpoint,
    tokenUtxoParse,
    getDummyEcKey, getFee,
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

export async function estimateFee(param: SignTxParams) {
    (param.data as CatTransferParams).estimateFee = true
    return await transfer(param)
}

export async function transfer(param: SignTxParams) {
    const txParams: CatTransferParams = param.data

    const ecKey = !txParams.estimateFee
        ? new EcKeyService({privateKey: param.privateKey})
        : getDummyEcKey()


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
    if (feeUtxos.length > 1){
        ({feeUtxo, mergeTx} = mergeFee(ecKey, feeUtxos, txParams.feeRate))
    }

    let tokens = tokenUtxoParse(txParams.tokens)

    const commitResult = createGuardContract(
        ecKey,
        feeUtxo,
        txParams.feeRate,
        tokens,
        tokenP2TR,
        txParams.changeAddress,
    );

    if (commitResult === null) {
        return null;
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

    let {vsize} = await calcVsizeTransfer(
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


    const satoshiChangeOutputIndex = changeTokenState === null ? 2 : 3;

    let satoshiChangeAmount = revealTx.inputAmount - vsize * txParams.feeRate - Postage.TOKEN_POSTAGE - (changeTokenState === null ? 0 : Postage.TOKEN_POSTAGE);
    let fee = vsize * txParams.feeRate

    if (satoshiChangeAmount <= CHANGE_MIN_POSTAGE) {
        // throw new Error('Insufficient satoshis balance!');

        satoshiChangeAmount = 0
        revealTx.removeOutput(satoshiChangeOutputIndex)
        const {vsize: newVsize, fee: newFee}  = await calcVsizeTransfer(
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
        vsize = newVsize
        fee = newFee
    } else {
        // update change amount
        revealTx.outputs[satoshiChangeOutputIndex].satoshis = satoshiChangeAmount;
    }

    if (txParams.estimateFee) {
        if (mergeTx) {
            return {
                mergeTx:  getFee(mergeTx),
                commitTx: getFee(commitTx),
                revealTx: fee
            }
        }
        return {
            commitTx: getFee(commitTx),
            revealTx: fee
        }
    }

    let changeInfo = null;
    if (satoshiChangeAmount > BigInt(0)) {
        changeInfo = {
            script: toByteString(satoshiChangeScript.toHex()),
            satoshis: int2ByteString(BigInt(satoshiChangeAmount), BigInt(8)),
        } as ChangeInfo ;

    }

    const txCtxs = getTxCtxMulti(
        revealTx,
        tokens.map((_, i) => i).concat([tokens.length]),
        [
            ...new Array(tokens.length).fill(Buffer.from(tokenTapScript, 'hex')),
            Buffer.from(guardTapScript, 'hex'),
        ],
    );

    for (let i = 0; i < tokens.length; i++) {
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
    ecKey.signTx(revealTx);
    if (mergeTx) {
        return {
            mergeTx: mergeTx.uncheckedSerialize(),
            commitTx: commitTx.uncheckedSerialize(),
            revealTx: revealTx.uncheckedSerialize(),
        }
    }
    return {
        commitTx: commitTx.uncheckedSerialize(),
        revealTx: revealTx.uncheckedSerialize(),
    }
}

export const calcVsizeTransfer = async (
    tokens: TokenContract[],
    guardContract: GuardContract,
    revealTx: btc.Transaction,
    guardInfo: GuardInfo,
    tokenTxs: Array<{
        prevTx: btc.Transaction;
        prevPrevTx: btc.Transaction;
        prevTokenInputIndex: number;
    }>,
    tokenTapScript: string,
    guardTapScript: string,
    newState: ProtocolState,
    receiverTokenState: CAT20State,
    changeTokenState: null | CAT20State,
    satoshisChangeScript: btc.Script,
    minterP2TR: string,
) => {
    // create fake key for signature, but the last input (fee utxo)'s script needs to be updated to the fake key for this calculation
    const fakeEcKey = getDummyEcKey()
    const fakeFeeScript = btc.Script.fromAddress(fakeEcKey.getAddress())
    const feeUtxoIndex = revealTx.inputs.length - 1
    const originalFeeScript = revealTx.inputs[feeUtxoIndex].output.script
    revealTx.inputs[feeUtxoIndex].output.setScript(fakeFeeScript)

    const txCtxs = getTxCtxMulti(
        revealTx,
        tokens.map((_, i) => i).concat([tokens.length]),
        [
            ...new Array(tokens.length).fill(Buffer.from(tokenTapScript, 'hex')),
            Buffer.from(guardTapScript, 'hex'),
        ],
    );

    const guardInputIndex = tokens.length;

    const changeInfo: ChangeInfo = {
        script: satoshisChangeScript.toHex(),
        satoshis: int2ByteString(0n, 8n),
    };
    for (let i = 0; i < tokens.length; i++) {
        await unlockToken(
            fakeEcKey,
            tokens[i],
            i,
            tokenTxs[i].prevTx,
            tokenTxs[i].prevTokenInputIndex,
            tokenTxs[i].prevPrevTx,
            guardInfo,
            revealTx,
            minterP2TR,
            txCtxs[i],
            false,
        );
    }

    await unlockGuard(
        guardContract,
        guardInfo,
        guardInputIndex,
        newState,
        revealTx,
        receiverTokenState,
        changeTokenState,
        changeInfo,
        txCtxs[guardInputIndex],
        false,
    );

    fakeEcKey.signTx(revealTx);

    const vsize = revealTx.vsize;
    const fee = getFee(revealTx)
    resetTx(revealTx);

    // reset the script to original
    revealTx.inputs[feeUtxoIndex].output.setScript(originalFeeScript)
    return {vsize, fee};
};
