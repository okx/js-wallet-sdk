import {GenPrivateKeyError, NotImplementedError, SignCommonMsgError} from "./error";
import {
    CalcTxHashParams,
    DerivePriKeyParams,
    GetAddressParams,
    GetDerivedPathParam,
    GetRawTransactionParams,
    HardwareRawTransactionParam,
    MpcMessageParam,
    MpcRawTransactionParam,
    MpcTransactionParam,
    NewAddressParams,
    SignCommonMsgParams,
    SignTxParams,
    SignType,
    TypedMessage,
    ValidAddressParams,
    ValidPrivateKeyParams,
    ValidSignedTransactionParams,
    VerifyMessageParams,
} from './common';
import {base, bip32, bip39, BN, signUtil} from "@okxweb3/crypto-lib";
import {buildCommonSignMsg} from "./basic";

export function secp256k1SignTest(privateKey: Buffer) {
    const msgHash = base.sha256("secp256k1-test");
    const publicKey = signUtil.secp256k1.publicKeyCreate(privateKey, false)
    const {signature, recovery} = signUtil.secp256k1.sign(Buffer.from(msgHash), privateKey);
    return signUtil.secp256k1.verify(msgHash, signature, recovery, publicKey);
}


export function makeSignature(v: number, r: Buffer, s: Buffer): string {
    const rSig = fromSigned(r);
    const sSig = fromSigned(s);
    const vSig = v;
    const rStr = padWithZeroes(toUnsigned(rSig).toString('hex'), 64);
    const sStr = padWithZeroes(toUnsigned(sSig).toString('hex'), 64);
    const vStr = base.stripHexPrefix(intToHex(vSig));
    return vStr.concat(rStr, sStr);
}

export function intToHex(i: Number) {
    const hex = i.toString(16); // eslint-disable-line

    return `0x${hex}`;
}

export const toUnsigned = function (num: BN): Buffer {
    return Buffer.from(num.toTwos(256).toArray())
}

export function padWithZeroes(hexString: string, targetLength: number): string {
    if (hexString !== '' && !/^[a-f0-9]+$/iu.test(hexString)) {
        throw new Error(
            `Expected an unprefixed hex string. Received: ${hexString}`,
        );
    }

    if (targetLength < 0) {
        throw new Error(
            `Expected a non-negative integer target length. Received: ${targetLength}`,
        );
    }

    return String.prototype.padStart.call(hexString, targetLength, '0');
}

export const fromSigned = function (num: Buffer): BN {
    return new BN(num).fromTwos(256)
}

export function ecdsaSign(msgHash: Buffer, privateKey: Buffer, chainId?: number): { v: number, r: Buffer, s: Buffer } {
    const {signature, recovery} = signUtil.secp256k1.sign(msgHash, privateKey) // { signature, recid: recovery }

    const r = Buffer.from(signature.slice(0, 32))
    const s = Buffer.from(signature.slice(32, 64))

    if (chainId && !Number.isSafeInteger(chainId)) {
        throw new Error(
            'The provided number is greater than MAX_SAFE_INTEGER (please use an alternative input type)'
        )
    }
    const v = chainId ? recovery + (chainId * 2 + 35) : recovery + 27
    return {v, r, s}
}


abstract class BaseWallet {
    // secp256k1 curve uses the default implementation, ed25519 curve, you need to use the basic/ed25519 implementation.
    getRandomPrivateKey(): Promise<any> {
        try {
            while (true) {
                const privateKey = base.randomBytes(32)
                if (secp256k1SignTest(privateKey)) {
                    return Promise.resolve(base.toHex(privateKey, true));
                }
            }

        } catch (e) {
        }
        return Promise.reject(GenPrivateKeyError);
    }

    // secp256k1 curve uses the default implementation, ed25519 curve, you need to use the basic/ed25519 implementation.
    getDerivedPrivateKey(param: DerivePriKeyParams): Promise<any> {
        return bip39.mnemonicToSeed(param.mnemonic)
            .then((masterSeed: Buffer) => {
                let childKey = bip32.fromSeed(masterSeed).derivePath(param.hdPath)
                if (childKey.privateKey) {
                    let privateKey = base.toHex(childKey.privateKey);
                    return Promise.resolve("0x" + privateKey);
                } else {
                    return Promise.reject(GenPrivateKeyError);
                }
            }).catch((e) => {
                return Promise.reject(GenPrivateKeyError);
            });
    }

    // get new address by private key
    abstract getNewAddress(param: NewAddressParams): Promise<any>

    // validate address
    abstract validAddress(param: ValidAddressParams): Promise<any>

    // sign transaction
    abstract signTransaction(param: SignTxParams): Promise<any>

    // get bip44 path
    getDerivedPath(param: GetDerivedPathParam): Promise<any> {
        return Promise.reject(NotImplementedError);
    }

    // validate private key
    validPrivateKey(param: ValidPrivateKeyParams): Promise<any> {
        return Promise.reject(NotImplementedError);
    }

    // sign message
    signMessage(param: SignTxParams): Promise<string> {
        return Promise.reject(NotImplementedError);
    }

    async signCommonMsg(params: SignCommonMsgParams): Promise<any> {
        if (!params.signType) {
            params.signType = SignType.Secp256k1;
        }
        let data;
        if (params.message.text) {
            data = params.message.text;
        } else {
            if (params.publicKey) {
                if (params.publicKey.startsWith("0x")) {
                    params.publicKey = params.publicKey.substring(2);
                }
                data = buildCommonSignMsg(params.publicKey, params.message.walletId);
            } else {
                let addr = await this.getNewAddress({
                    privateKey: params.privateKey,
                    addressType: params.addressType,
                    hrp: params.hrp,
                    version: params.version
                });
                if (addr.publicKey.startsWith("0x")) {
                    addr.publicKey = addr.publicKey.substring(2);
                }
                data = buildCommonSignMsg(addr.publicKey, params.message.walletId);
            }
        }
        let hash = base.magicHash(data);
        const privateKeyStr = params.privateKeyHex ? params.privateKeyHex : params.privateKey;
        const privateKey = base.fromHex(privateKeyStr);
        var sig;
        switch (params.signType) {
            case SignType.Secp256k1:
                const {v, r, s} = ecdsaSign(Buffer.from(hash), privateKey)
                return Promise.resolve(makeSignature(v, r, s));
            case SignType.ECDSA_P256:
                sig = signUtil.p256.sign(Buffer.from(hash), privateKey).signature
                return Promise.resolve(base.toHex(sig));
            case SignType.ED25519:
                sig = signUtil.ed25519.sign(hash, privateKey)
                return Promise.resolve(base.toHex(sig));
            case SignType.StarknetSignType:
                sig = signUtil.schnorr.stark.sign(hash, privateKey).toCompactRawBytes();
                return Promise.resolve(base.toHex(sig));
            case SignType.TezosSignType:
                return Promise.reject("not support");
        }
    }

    // verify message
    verifyMessage(param: VerifyMessageParams): Promise<boolean> {
        return Promise.reject(NotImplementedError);
    }

    // recover signature to public key
    ecRecover(message: TypedMessage, signature: string): Promise<string> {
        return Promise.reject(NotImplementedError);
    }

    // get address by public key
    getAddressByPublicKey(param: GetAddressParams): Promise<any> {
        return Promise.reject(NotImplementedError);
    }

    // get raw transaction for mpc
    getMPCRawTransaction(param: MpcRawTransactionParam): Promise<any> {
        return Promise.reject(NotImplementedError);
    }

    // get signed transaction for mpc
    getMPCTransaction(param: MpcTransactionParam): Promise<any> {
        return Promise.reject(NotImplementedError);
    }

    // get raw message for mpc
    getMPCRawMessage(param: MpcRawTransactionParam): Promise<any> {
        return Promise.reject(NotImplementedError);
    }

    // get signed message for mpc
    getMPCSignedMessage(param: MpcMessageParam): Promise<any> {
        return Promise.reject(NotImplementedError);
    }

    // get raw transaction for hardware
    getHardWareRawTransaction(param: SignTxParams): Promise<any> {
        return Promise.reject(NotImplementedError);
    }

    // get signed transaction for hardware
    getHardWareSignedTransaction(param: HardwareRawTransactionParam): Promise<any> {
        return Promise.reject(NotImplementedError);
    }

    // get message hash for hardware
    getHardWareMessageHash(param: SignTxParams): Promise<any> {
        return Promise.reject(NotImplementedError);
    }

    // get tx hash by raw transaction
    calcTxHash(param: CalcTxHashParams): Promise<string> {
        return Promise.reject(NotImplementedError);
    }

    getRawTransaction(param: GetRawTransactionParams): Promise<string> {
        return Promise.reject(NotImplementedError)
    }

    validSignedTransaction(param: ValidSignedTransactionParams): Promise<any> {
        return Promise.reject(NotImplementedError)
    }

    estimateFee(param: SignTxParams): Promise<number> {
        return Promise.reject(NotImplementedError)
    }
}

//just for test
class SimpleWallet extends BaseWallet {
    mockAddress: string | undefined;
    mockPublicKey: string | undefined;

    mockData(mockAddress: string, mockPublicKey: string) {
        this.mockAddress = mockAddress;
        this.mockPublicKey = mockPublicKey;
    }

    getNewAddress(param: NewAddressParams): Promise<any> {
        return Promise.resolve({address: this.mockAddress, publicKey: this.mockPublicKey});
    }

    validAddress(param: ValidAddressParams): Promise<any> {
        throw new Error("Method not implemented.");
    }

    signTransaction(param: SignTxParams): Promise<any> {
        throw new Error("Method not implemented.");
    }
}


export {BaseWallet, SimpleWallet}
