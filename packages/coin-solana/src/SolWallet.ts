import {
    CalcTxHashParams,
    DerivePriKeyParams,
    GetDerivedPathParam,
    HardwareRawTransactionParam,
    NewAddressData,
    NewAddressParams,
    SignTxParams,
    ValidAddressData,
    ValidAddressParams,
    ValidSignedTransactionParams,
    BaseWallet,
    jsonStringifyUniform,
    CalcTxHashError,
    GenPrivateKeyError,
    GetHardwareRawTransactionError,
    GetHardwareSignedTransactionError,
    NewAddressError,
    SignTxError,
    validSignedTransactionError,
    ValidPrivateKeyParams,
    ValidPrivateKeyData,
    SignCommonMsgParams,
    buildCommonSignMsg,
    SignType,
} from '@okxweb3/coin-base';
import {base,signUtil} from '@okxweb3/crypto-lib';
import {api, web3} from "./index";
import {ComputeBudgetProgram} from "./sdk/web3/programs/compute-budget";
import {TokenStandard} from "./sdk/metaplex";
import {getSerializedMplTransaction, getSerializedTokenTransferVersionedTransaction} from "./api";

export type TransactionType = "transfer" | "tokenTransfer" | "mplTransfer"
export type SolSignParam = {
    type: TransactionType
    payer: string
    blockHash: string
    from: string
    to: string
    amount?: number
    mint?: string
    createAssociatedAddress?: boolean
    version?: number
    tokenStandard?: number
    token2022?: boolean
    decimal?: number
    computeUnitLimit?: number
    computeUnitPrice?: number
    needPriorityFee?: boolean
}
export type deserializeMessagesParams = {
    data: any[];
};

export class SolWallet extends BaseWallet {
    async getDerivedPath(param: GetDerivedPathParam): Promise<any> {
        return `m/44'/501'/${param.index}'/0'`
    }

    async getRandomPrivateKey(): Promise<any> {
        try {
            return Promise.resolve(signUtil.ed25519.ed25519_getRandomPrivateKey(true, "base58"))
        } catch (e) {
            return Promise.reject(GenPrivateKeyError);
        }
    }

    async getDerivedPrivateKey(param: DerivePriKeyParams): Promise<any> {
        try {
            const key = await signUtil.ed25519.ed25519_getDerivedPrivateKey(param.mnemonic,param.hdPath, true, "base58")
            return Promise.resolve(key);
        } catch (e) {
            return Promise.reject(GenPrivateKeyError);
        }
    }

    checkPrivateKey(privateKey: string): boolean {
        const keyBytes = base.fromBase58(privateKey)
        return keyBytes.length == 64;
    }

    async getNewAddress(param: NewAddressParams): Promise<any> {
        try {
            if (!this.checkPrivateKey(param.privateKey)) {
                return Promise.reject(NewAddressError)
            }
            const address = api.getNewAddress(param.privateKey)
            let data: NewAddressData = {
                address: address,
                publicKey: base.toHex(base.fromBase58(address))
            };
            return Promise.resolve(data);
        } catch (e) {
            return Promise.reject(NewAddressError)
        }
    }

    async validPrivateKey(param: ValidPrivateKeyParams): Promise<any> {
        let isValid = this.checkPrivateKey(param.privateKey)
        const data: ValidPrivateKeyData = {
            isValid: isValid,
            privateKey: param.privateKey
        };
        return Promise.resolve(data);
    }

    async validAddress(param: ValidAddressParams): Promise<any> {
        let isValid: boolean;
        try {
            const array = base.fromBase58(param.address);
            isValid = (array.length == 32)
        } catch (e) {
            isValid = false;
        }

        let data: ValidAddressData = {
            isValid: isValid,
            address: param.address,
        };
        return Promise.resolve(data);
    }


    async signCommonMsg(params: SignCommonMsgParams): Promise<any> {
        let addr = await this.getNewAddress({privateKey:params.privateKey});
        if(addr.publicKey.startsWith("0x")) {
            addr.publicKey = addr.publicKey.substring(2);
        }
        let data = buildCommonSignMsg(addr.publicKey, params.message.walletId);
        const buf = base.fromBase58(params.privateKey)
        return super.signCommonMsg({privateKey:base.toHex(buf), message:data, signType:SignType.ED25519})
    }

    async signTransaction(param: SignTxParams): Promise<any> {
        try {
            const data: SolSignParam = param.data
            const rawTransaction = api.createRawTransaction(data.payer, data.blockHash);
            if (data.computeUnitLimit && data.computeUnitPrice) {
                const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
                    units: data.computeUnitLimit // default: 200000 =0.2 * 10^6
                });

                const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
                    microLamports: data.computeUnitPrice // 1 = 1*10-6 lamport default: 0
                });
                rawTransaction.add(modifyComputeUnits).add(addPriorityFee);
            }
            if (data.type === "transfer") {
                if (data.from == null || data.to == null || data.amount == null) {
                    return Promise.reject(SignTxError);
                }
                if (data.version === 0) {
                    return api.signTransferVersionedTransaction(param.data, param.privateKey);
                }
                await api.appendTransferInstruction(rawTransaction, data.from, data.to, data.amount)
            } else if (data.type === "tokenTransfer") {
                if (data.from == null || data.to == null || data.mint == null || data.amount == null || data.createAssociatedAddress == null) {
                    return Promise.reject(SignTxError);
                }
                if (data.version === 0) {
                    return api.signTokenTransferVersionedTransaction(param.data, param.privateKey);
                }
                await api.appendTokenTransferInstruction(rawTransaction, data.from, data.to, data.mint, data.amount, data.createAssociatedAddress, data.token2022, data.decimal);
            } else if (data.type === "mplTransfer") {
                if (data.from == null || data.to == null || data.mint == null) {
                    return Promise.reject(SignTxError);
                }
                const tokenStandard: TokenStandard = data.tokenStandard ?? TokenStandard.ProgrammableNonFungible
                return await api.signMplTransaction(data.payer, data.from, data.to, data.mint, data.blockHash, param.privateKey, tokenStandard, data.computeUnitLimit, data.computeUnitPrice);
            } else {
                return Promise.reject(SignTxError);
            }
            if (!param.privateKey) {
                return Promise.resolve(base.toHex(rawTransaction.serialize({verifySignatures: false})));
            }
            const result = await api.signTransaction(rawTransaction, param.privateKey)
            return Promise.resolve(result);
        } catch (e) {
            return Promise.reject(SignTxError);
        }
    }

    async signMessage(param: SignTxParams): Promise<string> {
        try {
            const message: string = param.data
            const data = await api.signMessage(message, param.privateKey)
            return Promise.resolve(data);
        } catch (e) {
            return Promise.reject(SignTxError);
        }
    }


    async deserializeMessages(param: deserializeMessagesParams): Promise<any> {
        try {
            const data = await api.deserializeMessages(param.data)
            return Promise.resolve(data);
        } catch (e) {
            return Promise.reject("deserializeMessages error");
        }
    }

    async getSerializedTransaction(param: SignTxParams): Promise<any> {
        try {
            const data: SolSignParam = param.data
            const rawTransaction = api.createRawTransaction(data.payer, data.blockHash);
            if (data.needPriorityFee && data.computeUnitLimit && data.computeUnitPrice) {
                const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
                    units: data.computeUnitLimit // default: 200000 =0.2 * 10^6
                });

                const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
                    microLamports: data.computeUnitPrice // 1 = 1*10-6 lamport default: 0
                });
                rawTransaction.add(modifyComputeUnits).add(addPriorityFee);
            }
            if (data.type === "transfer") {
                if (data.from == null || data.to == null || data.amount == null) {
                    return Promise.reject(SignTxError);
                }
                if (data.version === 0) {
                    return api.getSerializedTransferVersionedTransaction(param.data, param.privateKey);
                }
                await api.appendTransferInstruction(rawTransaction, data.from, data.to, data.amount)
            } else if (data.type === "tokenTransfer") {
                if (data.from == null || data.to == null || data.mint == null || data.amount == null || data.createAssociatedAddress == null) {
                    return Promise.reject(SignTxError);
                }
                if (data.version === 0) {
                    return api.getSerializedTokenTransferVersionedTransaction(param.data, param.privateKey);
                }
                await api.appendTokenTransferInstruction(rawTransaction, data.from, data.to, data.mint, data.amount, data.createAssociatedAddress, data.token2022, data.decimal);
            } else if (data.type === "mplTransfer") {
                if (data.from == null || data.to == null || data.mint == null) {
                    return Promise.reject(SignTxError);
                }
                const tokenStandard: TokenStandard = data.tokenStandard ?? TokenStandard.ProgrammableNonFungible
                if (data.needPriorityFee) {
                    return await api.getSerializedMplTransaction(data.payer, data.from, data.to, data.mint, data.blockHash, param.privateKey, tokenStandard, data.computeUnitLimit, data.computeUnitPrice);
                }
                return await api.getSerializedMplTransaction(data.payer, data.from, data.to, data.mint, data.blockHash, param.privateKey, tokenStandard);
            } else {
                return Promise.reject(SignTxError);
            }
            const result = base.toBase58(rawTransaction.serialize({
                requireAllSignatures: false,
                verifySignatures: false
            }));
            return Promise.resolve(result);
        } catch (e) {
            return Promise.reject(SignTxError);
        }
    }

    async calcTxHash(param: CalcTxHashParams): Promise<string> {
        try {
            const signedTx = base.fromBase58(param.data as string);
            let transaction;
            try {
                transaction = web3.Transaction.from(signedTx);
            } catch (e) {
                transaction = web3.VersionedTransaction.deserialize(signedTx);
            }
            if (transaction.signature == null) {
                return Promise.reject(CalcTxHashError);
            }
            return Promise.resolve(base.toBase58(transaction.signature));
        } catch (e) {
            return Promise.reject(CalcTxHashError);
        }
    }

    async getHardWareRawTransaction(param: SignTxParams): Promise<any> {
        try {
            return this.signTransaction(param);
        } catch (e) {
            return Promise.reject(GetHardwareRawTransactionError);
        }
    }

    async getHardWareSignedTransaction(param: HardwareRawTransactionParam): Promise<any> {
        try {
            const signedTx = api.getHardwareTransaction(param.raw, param.pubKey!, param.sig!);
            return Promise.resolve(signedTx);
        } catch (e) {
            return Promise.reject(GetHardwareSignedTransactionError);
        }
    }

    async validSignedTransaction(param: ValidSignedTransactionParams): Promise<any> {
        try {
            const version = param.data ? param.data.version : undefined
            const skipCheckSign = param.data ? param.data.skipCheckSign : undefined
            const ret = api.validSignedTransaction(param.tx, version || false, skipCheckSign || false)
            return Promise.resolve(jsonStringifyUniform(ret));
        } catch (e) {
            return Promise.reject(validSignedTransactionError);
        }
    }
}
