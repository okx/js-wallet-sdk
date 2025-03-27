import {
    BaseWallet, CalcTxHashParams,
    DerivePriKeyParams,
    GenPrivateKeyError,
    GetDerivedPathParam,
    NewAddressParams,
    NotImplementedError,
    SignCommonMsgParams,
    SignTxParams,
    SignType,
    ValidAddressParams, ValidPrivateKeyData, ValidPrivateKeyParams
} from "@okxweb3/coin-base";
import {
    Account,
    Asset, decodeAddressToMuxedAccount,
    encodeMuxedAccount,
    encodeMuxedAccountToAddress,
    Keypair,
    Memo, Operation,
    StrKey,
    TransactionBuilder
} from "./stellar_base";
import {base, signUtil} from "@okxweb3/crypto-lib";
import {convertWithDecimals} from "./utils";

export type StellarTxParam = {
    type: "transfer" | "changeTrust",
    source: string,
    sequence: string,
    operations?: [],
    fee: string;
    memo?: string;
    asset?: {
        assetName: string,
        issuer: string,
        amount: string,
    }
    toAddress?: string,
    amount?: string,
    decimals: number,
    createAccount?: {
        accountAddress: string,
        startingBalance: string,
    }
    networkPassphrase?: string;
    // preconditions:
    timebounds?: {
        minTime?: Date | number | string;
        maxTime?: Date | number | string;
    };
    ledgerbounds?: {
        minLedger?: number;
        maxLedger?: number;
    };
    minAccountSequence?: string;
    minAccountSequenceAge?: number;
    minAccountSequenceLedgerGap?: number;
    extraSigners?: string[];
}

export type MuxedAddressParam = {
    address: string,
    id: string,
}

export class StellarWallet extends BaseWallet {
    //https://github.com/Lobstrco/stellar-protocol/blob/8cfe955ad6ecf4ce8763ee702eddd5fec882bc92/ecosystem/sep-0005.md?plain=1#L53
    async getDerivedPath(param: GetDerivedPathParam): Promise<any> {
        return `m/44'/148'/${param.index}'`;
    }

    async getRandomPrivateKey(): Promise<any> {
        try {
            let pri = signUtil.ed25519.ed25519_getRandomPrivateKey(false, "hex");
            return Promise.resolve(StrKey.encodeEd25519SecretSeed(base.fromHex(pri)))
        } catch (e) {
            return Promise.reject(GenPrivateKeyError);
        }
    }

    async getDerivedPrivateKey(param: DerivePriKeyParams): Promise<any> {
        try {
            const key = await signUtil.ed25519.ed25519_getDerivedPrivateKey(param.mnemonic, param.hdPath, false, "hex")
            return Promise.resolve(StrKey.encodeEd25519SecretSeed(base.fromHex(key)));
        } catch (e) {
            return Promise.reject(GenPrivateKeyError);
        }
    }

    validPrivateKey(param: ValidPrivateKeyParams): Promise<any> {
        let isValid;
        try {
            let k = Keypair.fromSecret(param.privateKey);
            let rawKey = k.rawSecretKey();
            if (rawKey.every(byte => byte === 0)) {
                isValid = false
            } else {
                isValid = true
            }
        } catch (e) {
            isValid = false
        }
        const data: ValidPrivateKeyData = {
            isValid: isValid,
            privateKey: param.privateKey
        };
        return Promise.resolve(data);
    }

    getNewAddress(param: NewAddressParams): Promise<any> {
        let k = Keypair.fromSecret(param.privateKey);
        let rawKey = k.rawSecretKey();
        if (rawKey.every(byte => byte === 0)) {
            throw new Error("invalid key")
        }
        return Promise.resolve({
            address: k.publicKey(),
            publicKey: base.toHex(k.rawPublicKey()),
        });
    }

    getMuxedAddress(param: MuxedAddressParam): Promise<any> {
        if (!param.address) {
            throw new Error('Missing address');
        }
        let muxedAcc = encodeMuxedAccount(param.address, param.id);
        return Promise.resolve(encodeMuxedAccountToAddress(muxedAcc));
    }

    //https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0043.md
    signMessage(param: SignTxParams): Promise<string> {
        return Promise.reject(NotImplementedError);
    }

    calcTxHash(param: CalcTxHashParams): Promise<string> {
        const tx = TransactionBuilder.fromXDR(param.data.tx, param.data.networkPassphrase)
        return Promise.resolve(base.toHex(tx.hash()));
    }

    signTransaction(param: SignTxParams): Promise<any> {
        const txParam = param.data as StellarTxParam
        let timebounds = txParam.timebounds ? txParam.timebounds : {minTime: 0, maxTime: 0};

        const transactionBuilder = new TransactionBuilder(new Account(txParam.source, txParam.sequence), {
            fee: txParam.fee,
            timebounds: timebounds,
            ledgerbounds: txParam.ledgerbounds,
            minAccountSequence: txParam.minAccountSequence,
            minAccountSequenceAge: txParam.minAccountSequenceAge,
            minAccountSequenceLedgerGap: txParam.minAccountSequenceLedgerGap,
            extraSigners: txParam.extraSigners,
            memo: txParam.memo ? Memo.text(txParam.memo) : Memo.none(),
            networkPassphrase: txParam.networkPassphrase,
        })
        if (!txParam.decimals) {
            throw new Error("missing decimals");
        }
        if (txParam.type === "transfer") {
            if (!txParam.toAddress) {
                throw new Error("missing toAddress");
            }
            let op;
            if (txParam.asset) {
                const asset = new Asset(txParam.asset.assetName, txParam.asset.issuer);
                op = Operation.payment({
                    destination: txParam.toAddress,
                    asset: asset,
                    amount: convertWithDecimals(txParam.asset.amount, txParam.decimals),
                });
            } else {
                if (!txParam.amount) {
                    throw new Error("missing amount");
                }
                op = Operation.payment({
                    destination: txParam.toAddress,
                    asset: Asset.native(),
                    amount: convertWithDecimals(txParam.amount, txParam.decimals),
                });
            }
            transactionBuilder.addOperation(op)
        } else if (txParam.type === "changeTrust") {
            if (!txParam.asset) {
                throw new Error("missing asset");
            }
            const asset = new Asset(txParam.asset.assetName, txParam.asset.issuer);
            //创建trustline
            let op = Operation.changeTrust({
                asset: asset,
                limit: convertWithDecimals(txParam.asset.amount, txParam.decimals),
            });
            transactionBuilder.addOperation(op)
        } else {
            throw new Error("invalid tx type")
        }
        let transaction = transactionBuilder.build();
        if (param.privateKey) {
            let kp = Keypair.fromSecret(param.privateKey);
            transaction.sign(kp);
        }
        return Promise.resolve(transaction.toXDR());
    }

    async signCommonMsg(params: SignCommonMsgParams): Promise<any> {
        let k = Keypair.fromSecret(params.privateKey);
        return super.signCommonMsg({
            privateKey: params.privateKey,
            privateKeyHex: base.toHex(k.rawSecretKey()),
            message: params.message,
            signType: SignType.ED25519
        })
    }

    validAddress(param: ValidAddressParams): Promise<any> {
        let isValid;
        try {
            StrKey.decodeEd25519PublicKey(param.address);
            isValid = true;
        } catch (e) {
            try {
                decodeAddressToMuxedAccount(param.address);
                isValid = true;
            } catch (e) {
                isValid = false;
            }
        }
        return Promise.resolve({
            isValid: isValid,
            address: param.address,
        });
    }
}