import {EcKeyService, getDummySignature} from "../utils";
import {btc, GuardContract, Postage, TokenContract,} from "../common";
import {
    callToBufferList,
    getDummySigner,
    getDummyUTXO,
    getGuardsP2TR,
    getTokenContractP2TR, scaleConfig, toP2tr,
    toStateScript,
    verifyContract
} from "../utils";
import {
    CAT20,
    CAT20State,
    ChangeInfo,
    emptyTokenAmountArray,
    emptyTokenArray,
    getBackTraceInfo,
    GuardInfo,
    GuardProto,
    MAX_TOKEN_OUTPUT,
    PreTxStatesInfo,
    ProtocolState,
    TokenUnlockArgs,
    TransferGuard
} from "@cat-protocol/cat-smartcontracts";
import {
    fill,
    int2ByteString,
    MethodCallOptions,
    PubKey,
    toByteString,
    UTXO,
} from 'scrypt-ts';

// transfer
export function createGuardContract(
    ecKey: EcKeyService,
    feeutxo: UTXO,
    feeRate: number,
    tokens: TokenContract[],
    tokenP2TR: string,
    changeAddress: btc.Address,
) {
    const {p2tr: guardP2TR, tapScript: guardTapScript} = getGuardsP2TR();

    const protocolState = ProtocolState.getEmptyState();
    const realState = GuardProto.createEmptyState();
    realState.tokenScript = tokenP2TR;

    for (let i = 0; i < tokens.length; i++) {
        realState.inputTokenAmountArray[i] = tokens[i].state.data.amount;
    }

    protocolState.updateDataList(0, GuardProto.toByteString(realState));

    const commitTx = new btc.Transaction()
        .from(feeutxo)
        .addOutput(
            new btc.Transaction.Output({
                satoshis: 0,
                script: toStateScript(protocolState),
            }),
        )
        .addOutput(
            new btc.Transaction.Output({
                satoshis: Postage.GUARD_POSTAGE,
                script: guardP2TR,
            }),
        )
        .feePerByte(feeRate)
        .change(changeAddress);

    if (commitTx.getChangeOutput() === null) {
        throw new Error('Insufficient satoshis balance!');
    }
    commitTx.outputs[2].satoshis -= 1;

    if (ecKey.hasPrivateKey()) {
        ecKey.signTx(commitTx);
    }

    const contact: GuardContract = {
        utxo: {
            txId: commitTx.id,
            outputIndex: 1,
            script: commitTx.outputs[1].script.toHex(),
            satoshis: commitTx.outputs[1].satoshis,
        },
        state: {
            protocolState,
            data: realState,
        },
    };

    return {
        commitTx,
        contact,
        guardTapScript,
    };
}


export async function unlockToken(
    ecKey: EcKeyService,
    tokenContract: TokenContract,
    tokenInputIndex: number,
    prevTokenTx: btc.Transaction,
    preTokenInputIndex: number,
    prevPrevTokenTx: btc.Transaction,
    guardInfo: GuardInfo,
    revealTx: btc.Transaction,
    minterP2TR: string,
    txCtx: any,
    verify: boolean,
    signature?: string,
    contractSpend?: boolean,
    contractInputIndex?: number,
) {
    const {cblock: cblockToken, contract: token} = getTokenContractP2TR(minterP2TR);

    const {shPreimage, prevoutsCtx, spentScripts, sighash} = txCtx;

    let tokenUnlockArgs: TokenUnlockArgs = {
        isUserSpend: false,
        userPubKeyPrefix: toByteString(''),
        userPubKey: PubKey(ecKey.getXOnlyPublicKey()),
        userSig: getDummySignature(),
        contractInputIndex: BigInt(contractInputIndex || 0),
    };

    if (!contractSpend) {
        let sig: btc.crypto.Signature;
        if (ecKey.hasPrivateKey()) {
            sig = btc.crypto.Schnorr.sign(
                ecKey.getTokenPrivateKey(),
                sighash.hash,
            );
        } else {
            sig = btc.crypto.Signature.fromString(signature);
        }
        const pubkeyX = ecKey.getXOnlyPublicKey();
        const pubKeyPrefix = ecKey.getPubKeyPrefix();
        tokenUnlockArgs = {
            isUserSpend: true,
            userPubKeyPrefix: pubKeyPrefix,
            userPubKey: PubKey(pubkeyX),
            userSig: sig.toString('hex'),
            contractInputIndex: 0n,
        };
    }

    const backtraceInfo = getBackTraceInfo(
        prevTokenTx,
        prevPrevTokenTx,
        preTokenInputIndex,
    );

    const {
        state: {protocolState, data: preState},
    } = tokenContract;

    await token.connect(getDummySigner());
    const preTxState: PreTxStatesInfo = {
        statesHashRoot: protocolState.hashRoot,
        txoStateHashes: protocolState.stateHashList,
    };

    const tokenCall = await token.methods.unlock(
        tokenUnlockArgs,
        preState,
        preTxState,
        guardInfo,
        backtraceInfo,
        shPreimage,
        prevoutsCtx,
        spentScripts,
        {
            fromUTXO: getDummyUTXO(),
            verify: false,
            exec: false,
        } as MethodCallOptions<CAT20>,
    );

    const witnesses = [
        ...callToBufferList(tokenCall),
        // taproot script + cblock
        token.lockingScript.toBuffer(),
        Buffer.from(cblockToken, 'hex'),
    ];
    revealTx.inputs[tokenInputIndex].witnesses = witnesses;

    if (verify) {
        const res = verifyContract(
            tokenContract.utxo,
            revealTx,
            tokenInputIndex,
            witnesses,
        );
        if (typeof res === 'string') {
            throw new Error(`unlocking token contract at input ${tokenInputIndex} failed! ${res}`);
        }
        return true;
    }

    return true;
}


export async function unlockGuard(
    guardContract: GuardContract,
    guardInfo: GuardInfo,
    guardInputIndex: number,
    newState: ProtocolState,
    revealTx: btc.Transaction,
    receiverTokenState: CAT20State,
    changeTokenState: null | CAT20State,
    changeInfo: ChangeInfo | null,
    txCtx: any,
    verify: boolean,
) {
    // amount check run verify

    const {shPreimage, prevoutsCtx, spentScripts} = txCtx;
    const outputArray = emptyTokenArray();
    const tokenAmountArray = emptyTokenAmountArray();
    const tokenOutputIndexArray = fill(false, MAX_TOKEN_OUTPUT);
    outputArray[0] = receiverTokenState.ownerAddr;
    tokenAmountArray[0] = receiverTokenState.amount;
    tokenOutputIndexArray[0] = true;

    if (changeTokenState) {
        outputArray[1] = changeTokenState.ownerAddr;
        tokenAmountArray[1] = changeTokenState.amount;
        tokenOutputIndexArray[1] = true;
    }

    const satoshiChangeOutputIndex = changeTokenState === null ? 1 : 2;

    const {cblock: transferCblock, contract: transferGuard} = getGuardsP2TR();

    await transferGuard.connect(getDummySigner());

    const outpointSatoshiArray = emptyTokenArray();
    if (changeInfo != null) {
        outpointSatoshiArray[satoshiChangeOutputIndex] = changeInfo.satoshis;
        outputArray[satoshiChangeOutputIndex] = changeInfo.script;
        tokenOutputIndexArray[satoshiChangeOutputIndex] = false;
    }

    const transferGuardCall = await transferGuard.methods.transfer(
        newState.stateHashList,
        outputArray,
        tokenAmountArray,
        tokenOutputIndexArray,
        outpointSatoshiArray,
        int2ByteString(BigInt(Postage.TOKEN_POSTAGE), 8n),
        guardContract.state.data,
        guardInfo.tx,
        shPreimage,
        prevoutsCtx,
        spentScripts,
        {
            fromUTXO: getDummyUTXO(),
            verify: false,
            exec: false,
        } as MethodCallOptions<TransferGuard>,
    );
    const witnesses = [
        ...callToBufferList(transferGuardCall),
        // taproot script + cblock
        transferGuard.lockingScript.toBuffer(),
        Buffer.from(transferCblock, 'hex'),
    ];
    revealTx.inputs[guardInputIndex].witnesses = witnesses;

    if (verify) {
        const res = verifyContract(
            guardContract.utxo,
            revealTx,
            guardInputIndex,
            witnesses,
        );
        if (typeof res === 'string') {
            throw new Error(`unlocking guard contract failed! ${res}`);
        }
        return true;
    }
    return true;
}


