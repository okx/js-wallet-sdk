import {SignTxParams} from "@okxweb3/coin-base";
import {
    callToBufferList,
    EcKeyService,
    feeUtxoParse,
    getDummySigner,
    getDummyUTXO,
    getOpenMinterContractP2TR,
    minterParse,
    outpoint2ByteString,
    resetTx,
    scaleConfig,
    tokenInfoParse,
    toStateScript,
    verifyContract
} from "../utils";
import {
    btc,
    OpenMinterTokenInfo,
    Postage,
    SupportedNetwork,
    TokenPrevTx,
    UtxoInput,
    isOpenMinter,
    MinterType
} from "../common";
import {
    CAT20Proto,
    CAT20State,
    ChangeInfo,
    getBackTraceInfo,
    getTxCtx,
    OpenMinter,
    OpenMinterProto,
    OpenMinterState,
    OpenMinterV2,
    OpenMinterV2State,
    PreTxStatesInfo,
    ProtocolState
} from "@cat-protocol/cat-smartcontracts";
import {
    int2ByteString,
    MethodCallOptions,
    toByteString
} from "scrypt-ts";
import{ createOpenMinterState, getPremineAddress, getRemainSupply } from "./functions"

export type CatMintParams = {
    tokenMetadata: string
    feeInputs: UtxoInput[]
    feeRate: number,
    minterContract: string,
    mintAmount: string,
    mintPrevTx: TokenPrevTx,
    newMinter: number,
    verifyScript?: boolean,
}
const MINTER_INPUT_INDEX = 0; // always the first input


export async function mint(param: SignTxParams) {
    const ecKey = new EcKeyService({privateKey: param.privateKey});

    const txParams: CatMintParams = param.data

    let metadata = tokenInfoParse(txParams.tokenMetadata, SupportedNetwork.fractalMainnet);

    const address = ecKey.getAddress();
    const tokenReceiver = ecKey.getTokenAddress();

    const tokenInfo = metadata.info as OpenMinterTokenInfo;
    const scaledInfo = scaleConfig(tokenInfo);

    const tokenP2TR = btc.Script.fromAddress(metadata.tokenAddr).toHex();
    const genesisId = outpoint2ByteString(metadata.tokenId);

    const feeUtxos = feeUtxoParse(ecKey, param.data.feeInputs)

    const {
        utxo: minterUtxo,
        state: { protocolState, data: preState },
    } = minterParse(
        txParams.minterContract,
        metadata,
        txParams.mintPrevTx.prevTx
    );

    let amount = BigInt(0)
    try {
        amount = BigInt(txParams.mintAmount);
    } catch (error) {
        throw new Error(`Invalid token amount:  ${txParams.mintAmount}`);
    }
    const remainingSupply = getRemainSupply(preState, scaledInfo.minterMd5);
    if (remainingSupply === undefined) {
        return new Error('Get remaining supply failed');
    }

    if (isOpenMinter(metadata.info.minterMd5)) {
        if (preState.isPremined && amount > scaledInfo.limit) {
            console.error('The number of minted tokens exceeds the limit!');
            return;
        }

        const limit = scaledInfo.limit;

        if (!preState.isPremined && scaledInfo.premine > 0n) {
            if (typeof amount === 'bigint') {
                if (amount !== scaledInfo.premine) {
                    throw new Error(
                        `First mint amount should equal to premine ${scaledInfo.premine}`,
                    );
                }
            } else {
                amount = scaledInfo.premine;
            }
        } else {
            amount = amount || limit;
            if (
                metadata.info.minterMd5 === MinterType.OPEN_MINTER_V1 &&
                remainingSupply < amount
            ) {
                throw new Error(`Remaining supply ${remainingSupply} is not enough to mint ${amount}`);

            } else if (
                tokenInfo.minterMd5 == MinterType.OPEN_MINTER_V2 &&
                amount != limit
            ) {
                throw new Error(`V2 minters can only mint at the exactly amount of limit (${limit}) at once`);
            }
        }
    }

    const newState = ProtocolState.getEmptyState();
    const { splitAmountList, minterStates } = createOpenMinterState(
        amount,
        preState.isPremined,
        remainingSupply,
        metadata,
        txParams.newMinter,
    );

    for (let i = 0; i < minterStates.length; i++) {
        const minterState = minterStates[i];
        newState.updateDataList(i, OpenMinterProto.toByteString(minterState));
    }

    const tokenState = CAT20Proto.create(amount, tokenReceiver);

    newState.updateDataList(
        minterStates.length,
        CAT20Proto.toByteString(tokenState),
    );

    let premineAddress =
        !preState.isPremined && scaledInfo.premine > 0n
            ? ecKey.getTokenAddress()
            : scaledInfo.premine === 0n
                ? ''
                : null;

    if (premineAddress === null) {
        premineAddress = getPremineAddress(
            txParams.mintPrevTx.prevTx
        );
    }

    const {
        tapScript: minterTapScript,
        cblock: cblockToken,
        contract: minter,
    } = getOpenMinterContractP2TR(
        genesisId,
        scaledInfo.max,
        scaledInfo.premine,
        scaledInfo.limit,
        premineAddress,
        tokenInfo.minterMd5,
    );

    const changeScript = btc.Script.fromAddress(address);

    const revealTx = new btc.Transaction()
        .from([minterUtxo, ...feeUtxos])
        .addOutput(
            new btc.Transaction.Output({
                satoshis: 0,
                script: toStateScript(newState),
            }),
        );

    for (let i = 0; i < splitAmountList.length; i++) {
        if (splitAmountList[i] > 0n) {
            revealTx.addOutput(
                new btc.Transaction.Output({
                    script: new btc.Script(minterUtxo.script),
                    satoshis: Postage.MINTER_POSTAGE,
                }),
            );
        }
    }

    revealTx
        .addOutput(
            new btc.Transaction.Output({
                satoshis: Postage.TOKEN_POSTAGE,
                script: tokenP2TR,
            }),
        )
        .addOutput(
            new btc.Transaction.Output({
                satoshis: 0,
                script: changeScript,
            }),
        )
        .feePerByte(txParams.feeRate);


    const commitTx = new btc.Transaction(txParams.mintPrevTx.prevTx);

    const prevPrevTxId =
        commitTx.inputs[MINTER_INPUT_INDEX].prevTxId.toString('hex');

    const prevPrevTx = new btc.Transaction(txParams.mintPrevTx.prevPrevTx);

    if (prevPrevTxId !== prevPrevTx.id) {
        return new Error('prevPrevTxId does not match');
    }

    const backtraceInfo = getBackTraceInfo(
        commitTx,
        prevPrevTx,
        MINTER_INPUT_INDEX,
    );

    await minter.connect(getDummySigner());

    const preTxState: PreTxStatesInfo = {
        statesHashRoot: protocolState.hashRoot,
        txoStateHashes: protocolState.stateHashList,
    };

    const vsize: number = await calcVsize(
        ecKey,
        minter as OpenMinter,
        newState,
        tokenState,
        splitAmountList,
        preTxState,
        preState,
        minterTapScript,
        MINTER_INPUT_INDEX,
        revealTx,
        changeScript,
        backtraceInfo,
        cblockToken,
    );

    const changeAmount =
        revealTx.inputAmount -
        vsize * txParams.feeRate -
        Postage.MINTER_POSTAGE * txParams.newMinter -
        Postage.TOKEN_POSTAGE;

    if (changeAmount < 546) {
        const message = 'Insufficient satoshis balance!';
        return new Error(message);
    }

    // update change amount
    const changeOutputIndex = revealTx.outputs.length - 1;
    revealTx.outputs[changeOutputIndex].satoshis = changeAmount;

    const { shPreimage, prevoutsCtx, spentScripts, sighash } = getTxCtx(
        revealTx,
        MINTER_INPUT_INDEX,
        Buffer.from(minterTapScript, 'hex'),
    );

    const changeInfo: ChangeInfo = {
        script: toByteString(changeScript.toHex()),
        satoshis: int2ByteString(BigInt(changeAmount), 8n),
    };

    const sig = btc.crypto.Schnorr.sign(
        ecKey.getTokenPrivateKey(),
        sighash.hash,
    );

    const minterCall = await minter.methods.mint(
        newState.stateHashList,
        tokenState,
        splitAmountList,
        ecKey.getPubKeyPrefix(),
        ecKey.getXOnlyPublicKey(),
        () => sig.toString('hex'),
        int2ByteString(BigInt(Postage.MINTER_POSTAGE), 8n),
        int2ByteString(BigInt(Postage.TOKEN_POSTAGE), 8n),
        preState,
        preTxState,
        backtraceInfo,
        shPreimage,
        prevoutsCtx,
        spentScripts,
        changeInfo,
        {
            fromUTXO: getDummyUTXO(),
            verify: false,
            exec: false,
        } as MethodCallOptions<OpenMinter>,
    );
    const witnesses = [
        ...callToBufferList(minterCall),
        minter.lockingScript.toBuffer(),
        Buffer.from(cblockToken, 'hex'),
    ];
    revealTx.inputs[MINTER_INPUT_INDEX].witnesses = witnesses;

    if (txParams.verifyScript) {
        const res = verifyContract(
            minterUtxo,
            revealTx,
            MINTER_INPUT_INDEX,
            witnesses,
        );
        if (typeof res === 'string') {
            console.log('unlocking minter failed:', res);
            return new Error('unlocking minter failed');
        }
    }

    ecKey.signTx(revealTx);
    console.log(revealTx.id)
    console.log(revealTx.getFee())
    return revealTx.uncheckedSerialize()
}
const calcVsize = async (
    ecKey: EcKeyService,
    minter: OpenMinter | OpenMinterV2,
    newState: ProtocolState,
    tokenMint: CAT20State,
    splitAmountList: Array<bigint>,
    preTxState: PreTxStatesInfo,
    preState: OpenMinterState | OpenMinterV2State,
    minterTapScript: string,
    inputIndex: number,
    revealTx: btc.Transaction,
    changeScript: btc.Script,
    backtraceInfo: any,
    cblockMinter: string,
) => {
    const { shPreimage, prevoutsCtx, spentScripts, sighash } = getTxCtx(
        revealTx,
        inputIndex,
        Buffer.from(minterTapScript, 'hex'),
    );

    const changeInfo: ChangeInfo = {
        script: toByteString(changeScript.toHex()),
        satoshis: int2ByteString(BigInt(0n), 8n),
    };
    const sig = btc.crypto.Schnorr.sign(
        ecKey.getTokenPrivateKey(),
        sighash.hash,
    );
    const minterCall = await minter.methods.mint(
        newState.stateHashList,
        tokenMint,
        splitAmountList,
        ecKey.getPubKeyPrefix(),
        ecKey.getXOnlyPublicKey(),
        () => sig.toString('hex'),
        int2ByteString(BigInt(Postage.MINTER_POSTAGE), 8n),
        int2ByteString(BigInt(Postage.TOKEN_POSTAGE), 8n),
        preState,
        preTxState,
        backtraceInfo,
        shPreimage,
        prevoutsCtx,
        spentScripts,
        changeInfo,
        {
            fromUTXO: getDummyUTXO(),
            verify: false,
            exec: false,
        } as MethodCallOptions<OpenMinter>,
    );
    const witnesses = [
        ...callToBufferList(minterCall),
        minter.lockingScript.toBuffer(),
        Buffer.from(cblockMinter, 'hex'),
    ];
    revealTx.inputs[inputIndex].witnesses = witnesses;
    ecKey.signTx(revealTx);
    const vsize = revealTx.vsize;
    resetTx(revealTx);
    return vsize;
};
