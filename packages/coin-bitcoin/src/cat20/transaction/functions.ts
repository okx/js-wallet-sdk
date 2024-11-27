import {EcKeyService} from "../utils";
import {btc, GuardContract, MinterType, OpenMinterTokenInfo, Postage, TokenContract, TokenMetadata,} from "../common";
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
    MAX_TOKEN_OUTPUT, OpenMinter, OpenMinterProto, OpenMinterState, OpenMinterV2, OpenMinterV2Proto, OpenMinterV2State,
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
    PubKeyHash, Ripemd160, Sig,
    SmartContract,
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
        userSig: btc.crypto.Signature.fromString('E907831F80848D1069A5371B402410364BDF1C5F8307B0084C55F1CE2DCA821525F66A4A85EA8B71E482A74F382D2CE5EBEEE8FDB2172F477DF4900D310536C0').toString('hex'),
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
    changeInfo: ChangeInfo,
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
    outpointSatoshiArray[satoshiChangeOutputIndex] = changeInfo.satoshis;
    outputArray[satoshiChangeOutputIndex] = changeInfo.script;
    tokenOutputIndexArray[satoshiChangeOutputIndex] = false;

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

export async function unlockGuardMulti(
    guardContract: GuardContract,
    guardInfo: GuardInfo,
    guardInputIndex: number,
    newState: ProtocolState,
    revealTx: btc.Transaction,
    tokenStates: CAT20State[],
    tokenIndexes: number[],
    txCtx: any,
    verify: boolean,
) {
    // amount check run verify
    const outputsLengthNoOpReturn = revealTx.outputs.length - 1;

    const {shPreimage, prevoutsCtx, spentScripts} = txCtx;
    const outputArray = emptyTokenArray();
    const tokenAmountArray = emptyTokenAmountArray();
    const tokenOutputIndexArray = fill(false, MAX_TOKEN_OUTPUT);
    const outpointSatoshiArray = emptyTokenArray();

    tokenStates.map((tokenState, i) => {
        const index = tokenIndexes[i]
        outputArray[index] = tokenState.ownerAddr;
        tokenAmountArray[index] = tokenState.amount;
        tokenOutputIndexArray[index] = true;
    })

    let nonTokenIndexes = Array.from({length: outputsLengthNoOpReturn}, (_, i) => i).filter(e => !tokenIndexes.includes(e))
    nonTokenIndexes.map((index,) => {
        if (index >= outputsLengthNoOpReturn) {
            return
        }

        const output = revealTx.outputs[index + 1]
        outpointSatoshiArray[index] = int2ByteString(BigInt(output.satoshis), 8n)
        outputArray[index] = toByteString(output.script.toHex())
    })

    const {cblock: transferCblock, contract: transferGuard} = getGuardsP2TR();

    await transferGuard.connect(getDummySigner());

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
            throw new Error(`unlocking guard contract at input ${guardInputIndex} failed! ${res}`);
        }
        return true;
    }
    return true;
}

// mint
export function createOpenMinterState(
    mintAmount: bigint,
    isPriemined: boolean,
    remainingSupply: bigint,
    metadata: TokenMetadata,
    newMinter: number,
): {
    splitAmountList: bigint[];
    minterStates: OpenMinterState[];
} {
    const scaledInfo = scaleConfig(metadata.info as OpenMinterTokenInfo);

    const premine = !isPriemined ? scaledInfo.premine : 0n;
    const limit = scaledInfo.limit;
    let splitAmountList = OpenMinterProto.getSplitAmountList(
        premine + remainingSupply,
        mintAmount,
        limit,
        newMinter,
    );

    if (metadata.info.minterMd5 == MinterType.OPEN_MINTER_V2) {
        splitAmountList = OpenMinterV2Proto.getSplitAmountList(
            remainingSupply,
            isPriemined,
            scaledInfo.premine,
        );
        // if newMinter = 1
        if (newMinter == 1) {
            splitAmountList[0] += splitAmountList[1]
            splitAmountList[1] = 0n
        }
    }
    const tokenP2TR = toP2tr(metadata.tokenAddr);

    const minterStates: Array<OpenMinterState> = [];
    for (let i = 0; i < splitAmountList.length; i++) {
        const amount = splitAmountList[i];
        if (amount > 0n) {
            const minterState = OpenMinterProto.create(tokenP2TR, true, amount);
            minterStates.push(minterState);
        }
    }

    return {splitAmountList, minterStates};
}

export function pickOpenMinterStateField<T>(
    state: OpenMinterState | OpenMinterV2State,
    key: string,
): T | undefined {
    if (Object.prototype.hasOwnProperty.call(state, key)) {
        return (state as any)[key];
    }
    return undefined;
}

export function getRemainSupply(
    state: OpenMinterState | OpenMinterV2State,
    minterMd5: string,
) {
    if (minterMd5 === MinterType.OPEN_MINTER_V1) {
        return pickOpenMinterStateField<bigint>(state, 'remainingSupply');
    } else if (minterMd5 === MinterType.OPEN_MINTER_V2) {
        return pickOpenMinterStateField<bigint>(state, 'remainingSupplyCount');

    }
}

export function getPremineAddress(minterTx: string) {
    try {
        const tx = new btc.Transaction(minterTx);
        const witnesses: Buffer[] = tx.inputs[0].getWitnesses();
        const lockingScript = witnesses[witnesses.length - 2];
        try {
            const minter = OpenMinterV2.fromLockingScript(
                lockingScript.toString('hex'),
            ) as OpenMinterV2;
            return minter.premineAddr;
        } catch (e) {
        }
        const minter = OpenMinter.fromLockingScript(
            lockingScript.toString('hex'),
        ) as OpenMinter;
        return minter.premineAddr;
    } catch (error) {
        throw error;
    }
}


