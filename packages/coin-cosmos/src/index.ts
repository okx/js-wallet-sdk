import {base, Long, signUtil} from "@okxweb3/crypto-lib";
import {Coin} from "./types/cosmos/base/v1beta1/coin";
import {GeneratedType, registerExtraTypes, registry} from './registry';
import {GammAminoConverters, GammRegistry} from "./osmosis"

import {doSign, makeSignBytes, makeSignDoc, signTx} from './tx';

import {Height, MsgTransfer} from './types/ibc/applications/transfer/v1/tx';
import {EncodeObject, encodeSecp256k1Signature, StdFee} from './encoding';
import {AminoConverter, AminoConverters, AminoMsg, AminoTypes} from './amino/aminotypes';
import {createDefaultAminoConverters} from './amino/aminoRegistry';

import * as amino from "./amino/signDoc"
import {AuthInfo, SignDoc, TxRaw} from './types/cosmos/tx/v1beta1/tx';
import {PubKey} from './types/cosmos/crypto/secp256k1/keys';

export function public2Address(publicKey: Uint8Array, useEthSecp256k1: boolean): Uint8Array {
    return useEthSecp256k1 ? base.keccak(publicKey.slice(1)).slice(-20) : base.hash160(publicKey)
}

export function private2Public(privateKey: Uint8Array, compress: boolean): Uint8Array {
    return signUtil.secp256k1.publicKeyCreate(privateKey, compress)
}

export function private2Address(privateKey: Uint8Array, prefix: string, useEthSecp256k1: boolean): string {
    const publicKey = private2Public(privateKey, !useEthSecp256k1)
    const address = public2Address(publicKey, useEthSecp256k1)
    return base.toBech32(prefix, address);
}

export function getNewAddress(privkey: Uint8Array, prefix = "cosmos", useEthSecp256k1?: boolean) {
    return private2Address(privkey, prefix, useEthSecp256k1 || false)
}

export function addressFromPublic(publicKeyHex: string, prefix: string = "cosmos", useEthSecp256k1: boolean = false): string {
    let address;
    let publicKey = base.fromHex(publicKeyHex);
    if (useEthSecp256k1) {
        if (publicKey.length !== 65) {
            const pk = signUtil.secp256k1.publicKeyConvert(publicKey, false);
            publicKey = Buffer.from(pk!);
        }
        address = public2Address(publicKey, true);
    } else {
        if (publicKey.length !== 33) {
        publicKey = signUtil.secp256k1.publicKeyConvert(publicKey, true)!;
        }
        address = public2Address(publicKey, false);
    }
    return base.toBech32(prefix, address);
}

export function validateAddress(address: string, prefix = "cosmos") {
    try {
        const [a, b] = base.fromBech32(address)
        return a === prefix && b.length > 0;
    } catch (e) {
        return false
    }
}

export async function sendToken(
    privateKey: Uint8Array,
    chainId: string,
    sequence: number,
    accountNumber: number,
    senderAddress: string,
    recipientAddress: string,
    amount: Coin[],
    fee: StdFee,
    timeoutHeight?: number,
    memo?: string,
    useEthSecp256k1?: boolean,
    publicKey?: string,
    pubKeyUrl?: string): Promise<any> {
    const sendMsg: EncodeObject = {
        typeUrl: "/cosmos.bank.v1beta1.MsgSend",
        value: {
            fromAddress: senderAddress,
            toAddress: recipientAddress,
            amount: [...amount],
        },
    }
    const result = await signTx([sendMsg], fee, memo, Long.fromNumber(timeoutHeight || 0), {
        accountNumber: accountNumber,
        sequence: sequence,
        chainId: chainId,
        privateKey: privateKey,
        useEthSecp256k1: useEthSecp256k1 || false,
        publicKey: publicKey,
        pubKeyUrl: pubKeyUrl,
    });
    if (!privateKey) {
        return result;
    }
    return Promise.resolve(base.toBase64(result))
}

export async function sendIBCToken(
    privateKey: Uint8Array,
    chainId: string,
    sequence: number,
    accountNumber: number,
    senderAddress: string,
    recipientAddress: string,
    amount: Coin,
    sourcePort: string,
    sourceChannel: string,
    fee: StdFee,
    timeoutHeight?: number,
    ibcTimeoutHeight?: Height,
    /** timeout in seconds */
    ibcTimeoutTimestamp?: number,
    memo?: string,
    useEthSecp256k1?: boolean,
    publicKey?: string,
    pubKeyUrl?: string): Promise<string> {
    const timeoutTimestampNanoseconds = ibcTimeoutTimestamp
        ? Long.fromNumber(ibcTimeoutTimestamp).multiply(1_000_000_000)
        : undefined;
    const transferMsg: EncodeObject = {
        typeUrl: "/ibc.applications.transfer.v1.MsgTransfer",
        value: MsgTransfer.fromPartial({
            sourcePort: sourcePort,
            sourceChannel: sourceChannel,
            sender: senderAddress,
            receiver: recipientAddress,
            token: amount,
            timeoutHeight: ibcTimeoutHeight,
            timeoutTimestamp: timeoutTimestampNanoseconds,
        }),
    };
    const result = await signTx([transferMsg], fee, memo, Long.fromNumber(timeoutHeight || 0), {
        accountNumber: accountNumber,
        sequence: sequence,
        chainId: chainId,
        privateKey: privateKey,
        useEthSecp256k1: useEthSecp256k1 || false,
        publicKey: publicKey,
        pubKeyUrl: pubKeyUrl,
    });
    if (!privateKey) {
        return result;
    }
    return Promise.resolve(base.toBase64(result))
}

// append `MsgExecuteContract` to messages, need to associate `typeurl` with `extraTypes`
export async function sendMessages(
    privateKey: Uint8Array,
    chainId: string,
    sequence: number,
    accountNumber: number,
    messages: EncodeObject[],
    fee: StdFee,
    extraTypes?: ReadonlyArray<[string, GeneratedType]>,
    timeoutHeight?: number,
    memo?: string,
    useEthSecp256k1?: boolean,
    pubKeyUrl?: string): Promise<string> {
    registerExtraTypes(extraTypes)
    const result = await signTx(messages, fee, memo, Long.fromNumber(timeoutHeight || 0), {
        accountNumber: accountNumber,
        sequence: sequence,
        chainId: chainId,
        privateKey: privateKey,
        useEthSecp256k1: useEthSecp256k1 || false,
        pubKeyUrl: pubKeyUrl
    })
    return Promise.resolve(base.toBase64(result))
}

export interface AminoMsgData {
    chain_id: string
    account_number: string,
    sequence: string,
    fee: StdFee
    msgs: AminoMsg[]
    memo: string
}

export interface SignDocMessage {
    body: string;
    authInfo: string;
    chainId: string;
    accountNumber: string;
}

export async function SignWithSignDocForINJ(privateKey: Uint8Array, message: string, useEthSecp256k1: boolean) {
    const m: SignDocMessage = JSON.parse(message)
    const signDoc = makeSignDoc(base.fromHex(m.body), base.fromHex(m.authInfo), m.chainId, parseInt(m.accountNumber));
    if (!privateKey) {
        const signDocBytes = makeSignBytes(signDoc);
        const messageHash = useEthSecp256k1 ? base.keccak256(signDocBytes) : base.sha256(signDocBytes);
        return Promise.resolve(base.toHex(messageHash));
    }
    const publicKey = private2Public(privateKey, true)
    const signDocBytes = makeSignBytes(signDoc);
    const messageHash = useEthSecp256k1 ? base.keccak256(signDocBytes) : base.sha256(signDocBytes);
    const {signature} = signUtil.secp256k1.sign(Buffer.from(messageHash), privateKey)
    return Promise.resolve(encodeSecp256k1Signature(publicKey, signature, false))
}

export async function signWithStdSignDocForINJ(privateKey: Uint8Array, message: string, useEthSecp256k1: boolean) {
    const m: amino.StdSignDoc = JSON.parse(message)
    const signDocBytes = amino.serializeSignDoc(m)
    const messageHash = useEthSecp256k1 ? base.keccak256(signDocBytes) : base.sha256(signDocBytes);
    if (!privateKey) {
        return Promise.resolve(base.toHex(messageHash));
    }
    const {signature} = signUtil.secp256k1.sign(Buffer.from(messageHash), privateKey)
    const publicKey = private2Public(privateKey, true)
    return Promise.resolve(encodeSecp256k1Signature(publicKey, signature, false))
}

export async function SignWithSignDoc(privateKey: Uint8Array, message: string, useEthSecp256k1: boolean) {
    const m: SignDocMessage = JSON.parse(message)
    const signDoc = makeSignDoc(base.fromHex(m.body), base.fromHex(m.authInfo), m.chainId, parseInt(m.accountNumber));
    if (!privateKey) {
        const signDocBytes = makeSignBytes(signDoc);
        const messageHash = useEthSecp256k1 ? base.keccak256(signDocBytes) : base.sha256(signDocBytes);
        return Promise.resolve(base.toHex(messageHash));
    }
    const publicKey = private2Public(privateKey, true)
    const signature = await doSign(signDoc, publicKey, privateKey, useEthSecp256k1);
    return Promise.resolve(signature)
}

export async function signWithStdSignDoc(privateKey: Uint8Array, message: string, useEthSecp256k1: boolean) {
    const m: amino.StdSignDoc = JSON.parse(message)
    const signDocBytes = amino.serializeSignDoc(m)
    const messageHash = useEthSecp256k1 ? base.keccak256(signDocBytes) : base.sha256(signDocBytes);
    if (!privateKey) {
        return Promise.resolve(base.toHex(messageHash));
    }
    const {signature, recovery} = signUtil.secp256k1.sign(Buffer.from(messageHash), privateKey)

    const publicKey = private2Public(privateKey, true)
    if (useEthSecp256k1) {
        const l = [Uint8Array.from(signature), Uint8Array.of(recovery)]
        const signatureR1 = Buffer.concat(l);
        return Promise.resolve(encodeSecp256k1Signature(publicKey, signatureR1, true))
    } else {
        return Promise.resolve(encodeSecp256k1Signature(publicKey, signature, false))
    }
}

export async function sendAminoMessage(privateKey: Uint8Array,
                                       prefix: string,
                                       // json
                                       data: string,
                                       extraConverters?: AminoConverters,
                                       extraTypes?: ReadonlyArray<[string, GeneratedType]>,
                                       useEthSecp256k1?: boolean,
                                       pubKeyUrl?: string) {
    registerExtraTypes(extraTypes)
    const m: AminoMsgData = JSON.parse(data)
    let converters = createDefaultAminoConverters(prefix)
    if (extraConverters) {
        converters = {...converters, ...extraConverters}
    }
    const aminoTypes = new AminoTypes(converters)
    const messages = m.msgs.map(it => aminoTypes.fromAmino(it))
    const result = await signTx(messages, m.fee, m.memo, Long.fromNumber(0), {
        accountNumber: Number(m.account_number),
        sequence: Number(m.sequence),
        chainId: m.chain_id,
        privateKey: privateKey,
        useEthSecp256k1: useEthSecp256k1 || false,
        pubKeyUrl: pubKeyUrl
    })
    return Promise.resolve(base.toBase64(result))
}

export function amount2Coins(demon: string, amount: number): Coin[] {
    return [{denom: demon, amount: amount.toString()}]
}

export function amount2Coin(demon: string, amount: number): Coin {
    return {denom: demon, amount: amount.toString()}
}

export function amount2StdFee(demon: string, amount: number, gasLimit: number): StdFee {
    return {amount: amount2Coins(demon, amount), gas: gasLimit.toString()}
}

export function getMPCTransaction(raw: string, sig: string, publicKey: string, useEthSecp256k1?: boolean) {
    const signDoc = SignDoc.decode(base.fromHex(raw));
    if (useEthSecp256k1) {
        const messageHash = base.keccak256(makeSignBytes(signDoc));
        const signature = base.fromHex(sig);
        const r = signature.slice(0, 32);
        const s = signature.slice(32, 64);
        const v = signUtil.secp256k1.getV(messageHash, base.toHex(r), base.toHex(s), base.fromHex(publicKey));
        sig = base.toHex(Buffer.concat([Uint8Array.from(signature), Uint8Array.of(v)]));
    }
    const signature = encodeSecp256k1Signature(base.fromHex(publicKey), base.fromHex(sig), useEthSecp256k1!);
    const txRaw = TxRaw.fromPartial({
        bodyBytes: signDoc.bodyBytes,
        authInfoBytes: signDoc.authInfoBytes,
        signatures: [base.fromBase64(signature)],
    });
    return base.toBase64(TxRaw.encode(txRaw).finish());
}

export function getMPCSignedMessage(hash: string, sig: string, publicKey: string, useEthSecp256k1?: boolean) {
    if (useEthSecp256k1) {
        const signature = base.fromHex(sig);
        const r = signature.slice(0, 32);
        const s = signature.slice(32, 64);
        const v = signUtil.secp256k1.getV(base.fromHex(hash), base.toHex(r), base.toHex(s), base.fromHex(publicKey));
        sig = base.toHex(Buffer.concat([Uint8Array.from(signature), Uint8Array.of(v)]));
    }

    return encodeSecp256k1Signature(base.fromHex(publicKey), base.fromHex(sig), useEthSecp256k1!);
}

export function validSignedTransaction(tx: string, chainId: string, accountNumber: number, useEthSecp256k1: boolean, skipCheckSig: boolean) {
    const raw = TxRaw.decode(base.fromBase64(tx))
    const signDoc = makeSignDoc(raw.bodyBytes, raw.authInfoBytes, chainId, accountNumber);
    const signDocBytes = makeSignBytes(signDoc);
    const authInfo = AuthInfo.decode(raw.authInfoBytes)
    const publicKey = PubKey.decode(authInfo.signerInfos[0].publicKey!.value)
    const hash = useEthSecp256k1 ? base.keccak256(signDocBytes) : base.sha256(signDocBytes);
    let signature = raw.signatures[0]
    if (useEthSecp256k1) {
        signature = signature.slice(0, signature.length - 1)
    }
    if (!skipCheckSig && !signUtil.secp256k1.verifyWithNoRecovery(hash, signature, publicKey.key)) {
        throw Error("signature error")
    }

    const body = registry.decode({
        typeUrl: "/cosmos.tx.v1beta1.TxBody",
        value: raw.bodyBytes
    })

    return {
        body,
        authInfo,
        signatures: raw.signatures
    };
}

export {
    Coin,
    Height,
    EncodeObject,
    StdFee,
    GeneratedType,
    AminoConverters,
    AminoConverter,
    GammAminoConverters,
    GammRegistry
}
export * from "./CosmosWallet"

