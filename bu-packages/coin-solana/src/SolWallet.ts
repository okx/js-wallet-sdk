import {
    CalcTxHashParams,
    DerivePriKeyParams,
    GetDerivedPathParam,
    HardwareRawTransactionParam,
    NewAddressData,
    NewAddressParams,
    SignTxParams,
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
    ValidAddressError,
    validSignedTransactionError,
    InvalidPrivateKeyError,
    ValidPrivateKeyParams,
    ValidPrivateKeyData,
    SignCommonMsgParams,
    SignType,
    ValidAddressData,
} from '@okxweb3/coin-base';

type ValidAddressDataWithMsg = ValidAddressData & { msg: string };

import { base } from '@okxweb3/coin-base';
import { signUtil } from '@okxweb3/crypto-lib';
import { api, web3 } from './index';
import { ComputeBudgetProgram } from './lib/web3/programs/compute-budget';
import { TokenStandard } from './lib/metaplex';

export type TransactionType = 'transfer' | 'tokenTransfer' | 'mplTransfer';
export type SolSignParam = {
    type: TransactionType;
    payer: string;
    blockHash: string;
    from: string;
    to: string;
    amount?: number;
    mint?: string;
    createAssociatedAddress?: boolean;
    version?: number;
    tokenStandard?: number;
    token2022?: boolean;
    decimal?: number;
    computeUnitLimit?: number;
    computeUnitPrice?: number;
    needPriorityFee?: boolean;
};
export type deserializeMessagesParams = {
    data: any[];
};

export type SignTxParamsExtra = SignTxParams & {
    extra?: any;
};

type Extra = {
    encoding?: 'base58' | 'base64';
    retEncoding?: 'base58' | 'base64';
};
export type CalcTxHashParamsExtra = CalcTxHashParams & {
    extra?: Extra;
};

export class SolWallet extends BaseWallet {
    async getDerivedPath(param: GetDerivedPathParam): Promise<any> {
        return `m/44'/501'/${param.index}'/0'`;
    }

    async getRandomPrivateKey(): Promise<any> {
        try {
            return Promise.resolve(
                signUtil.ed25519.ed25519_getRandomPrivateKey(true, 'base58')
            );
        } catch (e) {
            return Promise.reject(GenPrivateKeyError);
        }
    }

    async getDerivedPrivateKey(param: DerivePriKeyParams): Promise<any> {
        try {
            const key = await signUtil.ed25519.ed25519_getDerivedPrivateKey(
                param.mnemonic,
                param.hdPath,
                true,
                'base58'
            );
            return Promise.resolve(key);
        } catch (e) {
            return Promise.reject(GenPrivateKeyError);
        }
    }

    checkPrivateKey(privateKey: string): boolean {
        const keyBytes = base.fromBase58(privateKey);
        return keyBytes.length == 64 && !keyBytes.every((byte) => byte === 0);
    }

    async getNewAddress(param: NewAddressParams): Promise<any> {
        try {
            if (!this.checkPrivateKey(param.privateKey)) {
                return Promise.reject(NewAddressError);
            }
            const address = api.getNewAddress(param.privateKey);
            let data: NewAddressData = {
                address: address,
                publicKey: base.toHex(base.fromBase58(address)),
            };
            return Promise.resolve(data);
        } catch (e) {
            return Promise.reject(NewAddressError);
        }
    }

    async validPrivateKey(param: ValidPrivateKeyParams): Promise<any> {
        let isValid;
        try {
            isValid = this.checkPrivateKey(param.privateKey);
        } catch (e) {
            isValid = false;
        }
        const data: ValidPrivateKeyData = {
            isValid: isValid,
            privateKey: param.privateKey,
        };
        return Promise.resolve(data);
    }

    async validAddress(param: ValidAddressParams): Promise<any> {
        let isValid: boolean;
        try {
            const array = base.fromBase58(param.address);
            isValid = array.length == 32;
        } catch (e) {
            isValid = false;
        }

        let msg = '';
        if (!isValid) {
            msg =
                'Solana address should match ^[1-9A-HJ-NP-Za-km-z]+$ (base58) and decode to 32 bytes';
        }

        let data: ValidAddressDataWithMsg = {
            isValid: isValid,
            address: param.address,
            msg,
        };
        return Promise.resolve(data);
    }

    async signCommonMsg(params: SignCommonMsgParams): Promise<any> {
        const buf = base.fromBase58(params.privateKey);
        return super.signCommonMsg({
            privateKey: params.privateKey,
            privateKeyHex: base.toHex(buf),
            message: params.message,
            signType: SignType.ED25519,
        });
    }

    async signTransaction(param: SignTxParams): Promise<any> {
        try {
            const data: SolSignParam = param.data;
            const rawTransaction = api.createRawTransaction(
                data.payer,
                data.blockHash
            );
            if (data.computeUnitLimit && data.computeUnitPrice) {
                const modifyComputeUnits =
                    ComputeBudgetProgram.setComputeUnitLimit({
                        units: data.computeUnitLimit, // default: 200000 =0.2 * 10^6
                    });

                const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice(
                    {
                        microLamports: data.computeUnitPrice, // 1 = 1*10-6 lamport default: 0
                    }
                );
                rawTransaction.add(modifyComputeUnits).add(addPriorityFee);
            }
            const fromValidation = await this.validAddress({
                address: data.from,
            });
            const toValidation = await this.validAddress({ address: data.to });
            if (data.type === 'transfer') {
                if (!fromValidation.isValid || !toValidation.isValid) {
                    return Promise.reject(ValidAddressError);
                }
                if (data.amount == null) {
                    return Promise.reject(SignTxError);
                }

                if (data.version === 0) {
                    return api.signTransferVersionedTransaction(
                        param.data,
                        param.privateKey
                    );
                }
                await api.appendTransferInstruction(
                    rawTransaction,
                    data.from,
                    data.to,
                    data.amount
                );
            } else if (data.type === 'tokenTransfer') {
                if (!fromValidation.isValid || !toValidation.isValid) {
                    return Promise.reject(ValidAddressError);
                }
                if (
                    data.amount == null ||
                    data.mint == null ||
                    data.createAssociatedAddress == null
                ) {
                    return Promise.reject(SignTxError);
                }

                if (data.version === 0) {
                    return api.signTokenTransferVersionedTransaction(
                        param.data,
                        param.privateKey
                    );
                }
                await api.appendTokenTransferInstruction(
                    rawTransaction,
                    data.from,
                    data.to,
                    data.mint,
                    data.amount,
                    data.createAssociatedAddress,
                    data.token2022,
                    data.decimal
                );
            } else if (data.type === 'mplTransfer') {
                if (!fromValidation.isValid || !toValidation.isValid) {
                    return Promise.reject(ValidAddressError);
                }
                if (data.mint == null) {
                    return Promise.reject(SignTxError);
                }

                const tokenStandard: TokenStandard =
                    data.tokenStandard ?? TokenStandard.ProgrammableNonFungible;
                return await api.signMplTransaction(
                    data.payer,
                    data.from,
                    data.to,
                    data.mint,
                    data.blockHash,
                    param.privateKey,
                    tokenStandard,
                    data.computeUnitLimit,
                    data.computeUnitPrice
                );
            } else {
                return Promise.reject(SignTxError);
            }
            if (!param.privateKey) {
                return Promise.resolve(
                    base.toHex(
                        rawTransaction.serialize({ verifySignatures: false })
                    )
                );
            }
            const result = await api.signTransaction(
                rawTransaction,
                param.privateKey
            );
            return Promise.resolve(result);
        } catch (e) {
            return Promise.reject(SignTxError);
        }
    }

    async signMessage(param: SignTxParamsExtra): Promise<string> {
        if (!param.privateKey) {
            return Promise.reject(`${InvalidPrivateKeyError}: cannot be empty`);
        }

        let isValidPK = false;
        try {
            isValidPK = this.checkPrivateKey(param.privateKey);
        } catch (e) {
            return Promise.reject(
                `${InvalidPrivateKeyError}: not a valid bs58 string`
            );
        }

        if (!isValidPK) {
            return Promise.reject(
                `${InvalidPrivateKeyError}: not valid bytes length`
            );
        }

        try {
            const message: string = param.data;
            const data = await api.signMessage(
                message,
                param.privateKey,
                param.extra
            );
            return Promise.resolve(data);
        } catch (e: unknown) {
            const errorMessage = e instanceof Error ? e.message : String(e);
            return Promise.reject(errorMessage);
        }
    }

    async deserializeMessages(param: deserializeMessagesParams): Promise<any> {
        try {
            const data = await api.deserializeMessages(param.data);
            return Promise.resolve(data);
        } catch (e) {
            return Promise.reject('deserializeMessages error');
        }
    }

    async getSerializedTransaction(param: SignTxParams): Promise<any> {
        try {
            const data: SolSignParam = param.data;
            const rawTransaction = api.createRawTransaction(
                data.payer,
                data.blockHash
            );
            if (
                data.needPriorityFee &&
                data.computeUnitLimit &&
                data.computeUnitPrice
            ) {
                const modifyComputeUnits =
                    ComputeBudgetProgram.setComputeUnitLimit({
                        units: data.computeUnitLimit, // default: 200000 =0.2 * 10^6
                    });

                const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice(
                    {
                        microLamports: data.computeUnitPrice, // 1 = 1*10-6 lamport default: 0
                    }
                );
                rawTransaction.add(modifyComputeUnits).add(addPriorityFee);
            }

            const fromValidation = await this.validAddress({
                address: data.from,
            });
            const toValidation = await this.validAddress({ address: data.to });

            if (data.type === 'transfer') {
                if (!fromValidation.isValid || !toValidation.isValid) {
                    return Promise.reject(ValidAddressError);
                }
                if (data.amount == null) {
                    return Promise.reject(SignTxError);
                }

                if (data.version === 0) {
                    return api.getSerializedTransferVersionedTransaction(
                        param.data,
                        param.privateKey
                    );
                }
                await api.appendTransferInstruction(
                    rawTransaction,
                    data.from,
                    data.to,
                    data.amount
                );
            } else if (data.type === 'tokenTransfer') {
                if (!fromValidation.isValid || !toValidation.isValid) {
                    return Promise.reject(ValidAddressError);
                }
                if (
                    data.amount == null ||
                    data.mint == null ||
                    data.createAssociatedAddress == null
                ) {
                    return Promise.reject(SignTxError);
                }

                if (data.version === 0) {
                    return api.getSerializedTokenTransferVersionedTransaction(
                        param.data,
                        param.privateKey
                    );
                }
                await api.appendTokenTransferInstruction(
                    rawTransaction,
                    data.from,
                    data.to,
                    data.mint,
                    data.amount,
                    data.createAssociatedAddress,
                    data.token2022,
                    data.decimal
                );
            } else if (data.type === 'mplTransfer') {
                if (!fromValidation.isValid || !toValidation.isValid) {
                    return Promise.reject(ValidAddressError);
                }
                if (data.mint == null) {
                    return Promise.reject(SignTxError);
                }

                const tokenStandard: TokenStandard =
                    data.tokenStandard ?? TokenStandard.ProgrammableNonFungible;
                if (data.needPriorityFee) {
                    return await api.getSerializedMplTransaction(
                        data.payer,
                        data.from,
                        data.to,
                        data.mint,
                        data.blockHash,
                        param.privateKey,
                        tokenStandard,
                        data.computeUnitLimit,
                        data.computeUnitPrice
                    );
                }
                return await api.getSerializedMplTransaction(
                    data.payer,
                    data.from,
                    data.to,
                    data.mint,
                    data.blockHash,
                    param.privateKey,
                    tokenStandard
                );
            } else {
                return Promise.reject(SignTxError);
            }
            const result = base.toBase58(
                rawTransaction.serialize({
                    requireAllSignatures: false,
                    verifySignatures: false,
                })
            );
            return Promise.resolve(result);
        } catch (e) {
            return Promise.reject(SignTxError);
        }
    }

    async calcTxHash(param: CalcTxHashParamsExtra): Promise<string> {
        try {
            const encoding = param.extra?.encoding ?? 'base58';
            let signedTxBytes: Uint8Array;
            if (encoding === 'base58') {
                signedTxBytes = base.fromBase58(param.data as string);
            } else if (encoding === 'base64') {
                signedTxBytes = base.fromBase64(param.data as string);
            } else {
                return Promise.reject(
                    'invalid encoding, only base58 and base64 are supported'
                );
            }

            let transaction;
            try {
                transaction = web3.Transaction.from(signedTxBytes);
            } catch (e) {
                transaction =
                    web3.VersionedTransaction.deserialize(signedTxBytes);
            }
            if (transaction.signature == null) {
                return Promise.reject(CalcTxHashError);
            }

            const sigBytes = transaction.signature as Uint8Array;
            const retEncoding = param.extra?.retEncoding ?? 'base58';
            let result: string;
            if (retEncoding === 'base64') {
                result = base.toBase64(sigBytes);
            } else if (retEncoding === 'base58') {
                result = base.toBase58(sigBytes);
            } else {
                return Promise.reject(
                    'invalid retEncoding, only base58 and base64 are supported'
                );
            }
            return Promise.resolve(result);
        } catch (e) {
            return Promise.reject(CalcTxHashError);
        }
    }

    async getHardWareRawTransaction(param: SignTxParams): Promise<any> {
        try {
            return await this.signTransaction(param);
        } catch (e) {
            return Promise.reject(GetHardwareRawTransactionError);
        }
    }

    async getHardWareSignedTransaction(
        param: HardwareRawTransactionParam
    ): Promise<any> {
        try {
            const signedTx = await api.getHardwareTransaction(
                param.raw,
                param.pubKey!,
                param.sig!
            );
            return signedTx;
        } catch (e) {
            return Promise.reject(GetHardwareSignedTransactionError);
        }
    }

    async validSignedTransaction(
        param: ValidSignedTransactionParams
    ): Promise<any> {
        try {
            const version = param.data ? param.data.version : undefined;
            const skipCheckSign = param.data
                ? param.data.skipCheckSign
                : undefined;
            const ret = api.validSignedTransaction(
                param.tx,
                version || false,
                skipCheckSign || false
            );
            return Promise.resolve(jsonStringifyUniform(ret));
        } catch (e) {
            return Promise.reject(validSignedTransactionError);
        }
    }
}
