import {VenomWalletV3, WalletContractV3R2} from "../ton";
import {base, signUtil} from "@okxweb3/crypto-lib";
import {Contract, external, internal, SendMode, storeMessage} from "../ton-core";
import {Address, beginCell, Cell, storeMessageRelaxed, toNano} from "../ton-core";
import {WalletContractV4} from "../ton/wallets/WalletContractV4";
import {TonTransferParams} from "./types";
import {parseAddress} from "./address";
import {generateQueryId} from "./index";
import {TRANSFER_TIMEOUT_SEC} from "./constant";

export type TxData = {
    type: string
    to: string
    amount: string
    seqno: number
    toIsInit: boolean
    decimal: number
    memo?: string
    globalId?: number
    sendMode?: number
    expireAt?: number
    publicKey?: string
};

export type JettonTxData = {
    type: string
    to: string
    fromJettonAccount: string // jetton wallet address
    amount: string
    decimal: number
    seqno: number
    toIsInit: boolean // destination address init or not
    memo?: string // comment
    messageAttachedTons?: string // message fee,
    invokeNotificationFee?: string // notify fee, 0.000000001
    sendMode?: number
    expireAt?: number
    queryId?: string
    publicKey?: string
};

export function transfer(txData: TxData, seed: string) {
    var secretK: Uint8Array;
    var publicK: Uint8Array;
    if (seed) {
        const {
            secretKey, publicKey
        } = signUtil.ed25519.fromSeed(base.fromHex(seed));
        secretK = secretKey;
        publicK = publicKey;
    } else {
        publicK = base.fromHex(txData.publicKey!)
    }

    // const wallet = WalletContractV3R2.create({ workchain: 0, publicKey: Buffer.from(publicKey) });
    const wallet = WalletContractV4.create({workchain: 0, publicKey: Buffer.from(publicK)});
    const messages = [internal({
        to: txData.to,
        value: BigInt(txData.amount),
        // bounce: txData.toIsInit,
        bounce: false, // depend on the design of PM
        body: txData.memo
    })];
    const signedMessage = wallet.createTransfer({
        seqno: txData.seqno,
        messages,
        secretKey: seed ? Buffer.from(secretK!) : Buffer.alloc(0),
        sendMode: txData.sendMode,
        timeout: txData.expireAt
    });

    return {
        boc: base.toBase64(signedMessage.toBoc()),
    };
}

export function venomTransfer(txData: TxData, seed: string) {
    const {secretKey, publicKey} = signUtil.ed25519.fromSeed(base.fromHex(seed));
    const wallet = VenomWalletV3.create({workchain: 0, publicKey: Buffer.from(publicKey)});
    const messages = [internal({
        to: txData.to,
        value: BigInt(txData.amount),
        bounce: txData.toIsInit,
        body: txData.memo
    })];
    const signedMessage = wallet.createTransfer({
        seqno: txData.seqno,
        messages, secretKey: Buffer.from(secretKey),
        globalId: txData.globalId!,
        sendMode: txData.sendMode,
        timeout: txData.expireAt,
    });

    return {
        id: base.toBase64(signedMessage.hash()),
        body: base.toBase64(signedMessage.toBoc()),
    };
}

export function jettonTransfer(txData: JettonTxData, seed: string) {
    var secretK: Uint8Array;
    var publicK: Uint8Array;
    if (seed) {
        const {
            secretKey, publicKey
        } = signUtil.ed25519.fromSeed(base.fromHex(seed));
        secretK = secretKey;
        publicK = publicKey;
    } else {
        publicK = base.fromHex(txData.publicKey!)
    }
    // const {secretKey, publicKey} = signUtil.ed25519.fromSeed(base.fromHex(seed));
    // const wallet = WalletContractV3R2.create({workchain: 0, publicKey: Buffer.from(publicKey)});
    const wallet = WalletContractV4.create({workchain: 0, publicKey: Buffer.from(publicK)});
    const responseAddr = wallet.address
    const toAddr = Address.parse(txData.to)
    const fromJettonWallet = Address.parse(txData.fromJettonAccount)
    // todo support other decimal
    if (txData.decimal < 0) {
        throw new Error("invalid decimal");
    }
    const jettonAmount = BigInt(txData.amount);
    if (jettonAmount < 0) {
        throw new Error("invalid amount");
    }
    const queryId = txData.queryId ? BigInt(txData.queryId) : generateQueryId();
    let transferPayload: Cell
    const messageBuild = beginCell()
        .storeUint(0x0f8a7ea5, 32) // opcode for jetton transfer
        // .storeUint(0, 64) // query id
        .storeUint(queryId, 64) // query id
        // .storeCoins(toNano(txData.amount)) // jetton amount, amount * 10^9
        .storeCoins(BigInt(txData.amount)) // jetton amount, amount * 10^9
        .storeAddress(toAddr)
        .storeAddress(responseAddr) // response destination
        .storeBit(false) // no custom payload
        .storeCoins(BigInt(txData.invokeNotificationFee || "1")) // forward fee, amount of TON

    if (txData.memo) {
        const forwardPayload = beginCell()
            .storeUint(0, 32) // 0 opcode means we have a comment
            .storeStringTail(txData.memo)
            .endCell();

        transferPayload = messageBuild.storeBit(true) // we store forwardPayload as a reference
            .storeRef(forwardPayload)
            .endCell();
    } else {
        transferPayload = messageBuild.storeBit(false).endCell();
    }

    const internalMessage = [internal({
        to: fromJettonWallet,
        // value: toNano(txData.messageAttachedTons || "0.05"),
        value: BigInt(txData.messageAttachedTons || "50000000"), // message fee, amount of TON
        body: transferPayload,
        // bounce: txData.toIsInit,
        bounce: false, // depend on the design of PM
    })];

    const signedMessage = wallet.createTransfer({
        seqno: txData.seqno,
        messages: internalMessage,
        secretKey: seed ? Buffer.from(secretK!) : Buffer.alloc(0),
        sendMode: txData.sendMode,
        timeout: txData.expireAt
    });

    return {
        boc: base.toBase64(signedMessage.toBoc()),
    };
}

export async function signMultiTransaction(
    privateKey: string,
    messages: TonTransferParams[],
    seqno: number,
    expireAt?: number,
    workchain?: number,
    publicKey?: string,
) {
    if (!expireAt) {
        expireAt = Math.round(Date.now() / 1000) + TRANSFER_TIMEOUT_SEC;
    }

    const preparedMessages = messages.map((message) => {
        const {
            amount, toAddress, stateInit, isBase64Payload,
        } = message;
        let {payload} = message;

        if (isBase64Payload && typeof payload === 'string') {
            payload = Cell.fromBase64(payload);
        } else if (typeof payload === 'string') {
            try {
                payload = Cell.fromBase64(payload);
            } catch (e) {

            }
        }

        const init = stateInit ? {
            code: stateInit.refs[0],
            data: stateInit.refs[1],
        } : undefined;

        return internal({
            value: amount,
            to: toAddress,
            body: payload as Cell | string | undefined, // TODO Fix Uint8Array type
            bounce: parseAddress(toAddress).isBounceable,
            init,
        });
    });
    var secretK: Uint8Array;
    var publicK: Uint8Array;
    if (privateKey) {
        const {secretKey, publicKey} = signUtil.ed25519.fromSeed(base.fromHex(privateKey));
        secretK = secretKey;
        publicK = publicKey;
    } else {
        publicK = base.fromHex(publicKey!)
    }
    const wallet = WalletContractV4.create({workchain: workchain == 1 ? 1 : 0, publicKey: Buffer.from(publicK)});
    const transaction = wallet.createTransfer({
        seqno,
        secretKey: privateKey ? Buffer.from(secretK!) : Buffer.alloc(0),
        messages: preparedMessages,
        sendMode: SendMode.PAY_GAS_SEPARATELY + SendMode.IGNORE_ERRORS,
        timeout: expireAt,
    });
    const tx = transaction.toBoc().toString("base64");
    const externalMessage = toExternalMessage(wallet, seqno, transaction);
    const externalMsg = externalMessage.toBoc().toString('base64');
    return {seqno: seqno, transaction: tx, externalMessage: externalMsg};
}

function toExternalMessage(
    contract: Contract,
    seqno: number,
    body: Cell,
) {
    return beginCell()
        .storeWritable(
            storeMessage(
                external({
                    to: contract.address,
                    init: seqno === 0 ? contract.init : undefined,
                    body,
                }),
            ),
        )
        .endCell();
}