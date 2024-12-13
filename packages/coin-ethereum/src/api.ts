import {base, signUtil} from "@okxweb3/crypto-lib"
import {
    AccessListEIP2930TxData,
    ecdsaSign,
    FeeMarketEIP1559TxData,
    isHexString,
    isValidAddress,
    makeSignature,
    privateToPublic, privateToPublicRaw,
    publicToAddress,
    recoverFromSignature,
    toChecksumAddress,
    TransactionFactory,
    TxData
} from "./sdk";
import {hashMessage, MessageTypes} from "./message"
import {padWithZeroes,} from './sdk/eth-sig-util';
import {signTypedMessage, TypedDataUtils, typedSignatureHash} from "eth-sig-util";


export function getNewAddress(privateKeyHex: string) {
    if (!validPrivateKey(privateKeyHex)) {
        throw new Error('invalid key');
    }
    const privateKey = base.fromHex(privateKeyHex)
    const publicKey = privateToPublicRaw(privateKey)
    const address = publicToAddress(publicKey.slice(1))
    return {
        address: base.toHex(address, true),
        publicKey: base.toHex(publicKey, true)
    }
}

export function validPrivateKey(privateKeyHex: string): boolean {
    if (!base.validateHexString(privateKeyHex)) {
        return false;
    }
    const privateKey = base.fromHex(privateKeyHex.toLowerCase())
    if (privateKey.length != 32) {
        return false;
    }
    return true;
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

export function signMessage(messageType: MessageTypes, message: string, privateKey?: Buffer): string {
    if (!privateKey) {
        return signMPCMessage(messageType, message)
    }

    if (messageType == MessageTypes.TYPE_DATA_V1) {
        return signTypedMessage(privateKey, {data: JSON.parse(message)}, "V1");
    } else if (messageType == MessageTypes.TYPE_DATA_V3) {
        return signTypedMessage(privateKey, {data: JSON.parse(message)}, "V3");
    } else if (messageType == MessageTypes.TYPE_DATA_V4) {
        return signTypedMessage(privateKey, {data: JSON.parse(message)}, "V4");
    }

    const msgHash = hashMessage(messageType, message)
    const {v, r, s} = ecdsaSign(base.fromHex(msgHash), privateKey)
    return makeSignature(v, r, s)
}

export function signMPCMessage(messageType: MessageTypes, message: string): string {
    if (messageType == MessageTypes.TYPE_DATA_V1) {
        return typedSignatureHash(JSON.parse(message));
    } else if (messageType == MessageTypes.TYPE_DATA_V3) {
        return base.toHex(TypedDataUtils.sign(JSON.parse(message), false));
    } else if (messageType == MessageTypes.TYPE_DATA_V4) {
        return base.toHex(TypedDataUtils.sign(JSON.parse(message)));
    }
    return hashMessage(messageType, message)
}

export function verifyMessage(messageType: MessageTypes, message: string, signature: Buffer): Buffer {
    const msgHash = hashMessage(messageType, message)
    const [r, s, v] = [
        signature.slice(0, 32),
        signature.slice(32, 64),
        signature[64],
    ];
    return recoverFromSignature(base.fromHex(msgHash), v, r, s)
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
    if (publicKey && !signUtil.secp256k1.verifyWithNoRecovery(msgHash, rs, base.fromHex(publicKey))) {
        return new Error("signature error")
    }
    return signedTx;
}