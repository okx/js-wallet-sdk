import { VenomWalletV3, WalletContractV3R2 } from "./ton";
import { base, signUtil } from "@okxweb3/crypto-lib";
import { internal, SendMode } from "./ton-core";

export type TxData = {
    to: string
    amount: string
    seqno: number
    toIsInit: boolean
    memo?: string
    globalId?: number
    sendMode?: number
};

export function transfer(txData: TxData, seed: string) {
    const { secretKey, publicKey } = signUtil.ed25519.fromSeed(base.fromHex(seed));
    const wallet = WalletContractV3R2.create({ workchain: 0, publicKey: Buffer.from(publicKey) });
    const messages = [internal({
        to: txData.to,
        value: BigInt(txData.amount),
        bounce: txData.toIsInit,
        body: txData.memo
    })];
    const signedMessage = wallet.createTransfer({
        seqno: txData.seqno,
        messages, secretKey: Buffer.from(secretKey),
        sendMode: txData.sendMode,
    });

    return {
        boc: base.toBase64(signedMessage.toBoc()),
    };
}

export function venomTransfer(txData: TxData, seed: string) {
    const { secretKey, publicKey } = signUtil.ed25519.fromSeed(base.fromHex(seed));
    const wallet = VenomWalletV3.create({ workchain: 0, publicKey: Buffer.from(publicKey) });
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
    });

    return {
        id: base.toBase64(signedMessage.hash()),
        body: base.toBase64(signedMessage.toBoc()),
    };
}
