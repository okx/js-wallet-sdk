import {base, signUtil} from "@okxweb3/crypto-lib"
import {
    TxData,
    TransactionFactory,
    AccessListEIP2930TxData,
    FeeMarketEIP1559TxData,
    privateToPublic,
    publicToAddress,
    isValidAddress,
    toChecksumAddress,
    ecdsaSign,
    makeSignature,
    recoverFromSignature
} from "./sdk";
import {MessageTypes, hashMessage} from "./message"
import { padWithZeroes } from './sdk/eth-sig-util';

export function getNewAddress(privateKeyHex: string) {
    const privateKey = base.fromHex(privateKeyHex)
    const publicKey = privateToPublic(privateKey)
    const address = publicToAddress(publicKey)
    return  {
        address:  base.toHex(address, true),
        publicKey: base.toHex(publicKey, true)
    }
}

export function validAddress(address: string) {
    let checksumAddress = '';
    const isValid = isValidAddress(address);
    checksumAddress = toChecksumAddress(address);

    return {
        isValid: isValid,
        address: checksumAddress
    }
}

export function signTransaction(privateKeyHex: string, txData: TxData | AccessListEIP2930TxData | FeeMarketEIP1559TxData) {
    const tx = TransactionFactory.fromTxData(txData);
    if (!privateKeyHex) {
        return {
            raw: base.toHex(Buffer.from(JSON.stringify(txData))),
            hash: base.toHex(tx.getMessageToSign(true)),
            serializeRaw: base.toHex(tx.serialize()),
        };
    }
    const privateKey = base.fromHex(privateKeyHex)
    const signedTx = tx.sign(privateKey)
    return base.toHex(signedTx.serialize(), true);
}

export function signMessage(messageType: MessageTypes, message: string, privateKey: Buffer) : string {
    const msgHash = hashMessage(messageType, message)
    if (!privateKey) {
        return msgHash
    }
    const {v, r, s} = ecdsaSign(base.fromHex(msgHash), privateKey)
    return makeSignature(v, r, s)
}

export function verifyMessage(messageType: MessageTypes, message: string, signature: Buffer) : Buffer {
    const msgHash = hashMessage(messageType, message)
    const [r, s, v] = [
        signature.slice(0, 32),
        signature.slice(32, 64),
        signature[64],
    ];
    return recoverFromSignature(base.fromHex(msgHash), v , r , s)
}

export function getMPCTransaction(raw: string, sig: string, publicKey: string) {
    let tx = TransactionFactory.fromTxData(JSON.parse(base.fromHex(raw).toString()));
    const msgHash = tx.getMessageToSign(true);
    const signature = base.fromHex(sig);
    const r = signature.slice(0, 32);
    const s = signature.slice(32, 64);
    const v = signUtil.secp256k1.getV(msgHash, base.toHex(r), base.toHex(s), base.fromHex(publicKey));
    tx = tx.processSignature(v + 27, r, s);
    return base.toHex(tx.serialize(), true);
}

export function getMPCSignedMessage(hash: string, sig: string, publicKey: string) {
    const signature = base.fromHex(sig);
    const r = signature.slice(0, 32);
    const s = signature.slice(32, 64);
    const v = signUtil.secp256k1.getV(base.fromHex(hash), base.toHex(r), base.toHex(s), base.fromHex(publicKey)) + 27;
    return makeSignature(v, r, s);
}

export function getSignedTransaction(raw: string, r: string, s: string, v: string) {
    let tx = TransactionFactory.fromSerializedData(base.fromHex(raw));
    tx = tx.processSignatureWithRawV(parseInt(v, 16), base.fromHex(r), base.fromHex(s));
    return base.toHex(tx.serialize(), true);
}

export function getSignHash(raw: string) {
    let tx = TransactionFactory.fromSerializedData(base.fromHex(raw));
    return base.toHex(tx.getMessageToSign(true));
}

export function validSignedTransaction(tx: string, chainId?: number, publicKey?: string) {
    const signedTx = TransactionFactory.fromSerializedData(base.fromHex(tx), chainId);
    const msgHash = signedTx.getMessageToSign(true)
    const rStr = padWithZeroes(base.toHex(signedTx.r!.toArrayLike(Buffer)), 64)
    const sStr = padWithZeroes(base.toHex(signedTx.s!.toArrayLike(Buffer)), 64)
    const rs = base.fromHex(rStr.concat(sStr))
    if(publicKey && !signUtil.secp256k1.verifyWithNoRecovery(msgHash, rs, base.fromHex(publicKey))) {
        return new Error("signature error")
    }
    return signedTx;
}