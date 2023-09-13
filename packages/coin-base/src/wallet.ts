import {NotImplementedError, GenPrivateKeyError} from "./error";
import {
    DerivePriKeyParams,
    GetDerivedPathParam,
    NewAddressParams,
    SignTxParams,
    TypedMessage,
    ValidAddressParams,
    ValidPrivateKeyParams,
    VerifyMessageParams,
    GetAddressParams,
    MpcRawTransactionParam,
    MpcTransactionParam,
    HardwareRawTransactionParam,
    CalcTxHashParams,
    GetRawTransactionParams,
    ValidSignedTransactionParams, MpcMessageParam,
} from './common';
import {bip39, bip32, base, signUtil} from "@okxweb3/crypto-lib";

export function secp256k1SignTest(privateKey: Buffer) {
    const msgHash = base.sha256("secp256k1-test");
    const publicKey = signUtil.secp256k1.publicKeyCreate(privateKey, false)
    const {signature, recovery} = signUtil.secp256k1.sign(Buffer.from(msgHash), privateKey);
    return signUtil.secp256k1.verify(msgHash, signature, recovery, publicKey);
}

abstract class BaseWallet {
    // secp256k1 curve uses the default implementation, ed25519 curve, you need to use the basic/ed25519 implementation.
    getRandomPrivateKey(): Promise<any> {
        try {
            while (true) {
                const privateKey = base.randomBytes(32)
                if(secp256k1SignTest(privateKey)) {
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
                if(childKey.privateKey) {
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

    validSignedTransaction(param: ValidSignedTransactionParams): Promise<any>  {
        return Promise.reject(NotImplementedError)
    }

    estimateFee(param: SignTxParams): Promise<number> {
        return Promise.reject(NotImplementedError)
    }
}

export {BaseWallet}
