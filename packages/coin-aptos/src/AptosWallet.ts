import {
    CalcTxHashParams,
    DerivePriKeyParams,
    GetDerivedPathParam,
    NewAddressData,
    NewAddressParams,
    SignTxParams,
    SignMessageByPayloadParams,
    ValidAddressData,
    ValidAddressParams,
    ValidSignedTransactionParams,
    BaseWallet,
    CalcTxHashError,
    GenPrivateKeyError,
    NewAddressError,
    SignTxError,
    validSignedTransactionError,
    ed25519_getDerivedPrivateKey,
    ed25519_getRandomPrivateKey,
    jsonStringifyUniform, SignMsgError
} from '@okxweb3/coin-base';
import {base} from '@okxweb3/crypto-lib';
import {
    AptosAccount,
    HexString,
    burnCoin,
    claimNFTTokenPayload,
    createRawTransaction,
    createRawTransactionByABI,
    generateBCSSimulateTransaction,
    generateBCSTransaction,
    mintCoin,
    offerNFTTokenPayload,
    offerNFTTokenPayloadObject,
    registerCoin,
    transferCoin,
    transferPayload,
} from './index';
import * as client from './client'

export type AptosParam = {
    type: "transfer" | "tokenTransfer" | "tokenMint" | "tokenBurn" | "tokenRegister" | "dapp" | "simulate" | "offerNft" | "offerNftObject" | "claimNft" | "offerNft_simulate" | "claimNft_simulate"
    base: AptosBasePram,
    data: any
}

export type AptosTransferParam = {
    recipientAddress: string,
    amount: string,
}

export type AptosTokenMintParam = {
    tyArg: string,
    recipientAddress: string,
    amount: string,
}

export type AptosTokenBurnParam = {
    tyArg: string,
    amount: string,
}

export type AptosTokenRegisterParam = {
    tyArg: string,
}

export type AptosTokenTransferParam = {
    tyArg: string,
    recipientAddress: string,
    amount: string,
}

export type AptosCustomParam = {
    abi: string,
    data: string,
}

export type AptosOfferNFTParam = {
    receiver: string,
    creator: string,
    collectionName: string,
    tokenName: string,
    version: string
    amount: string
}
export type AptosOfferNFTObjectParam = {
    nftObject: string,
    receiver: string,
    amount: string
}

export type AptosClaimNFTParam = {
    sender: string,
    creator: string,
    collectionName: string,
    tokenName: string,
    version: string
}

export type AptosBasePram = {
    sender?: string,
    sequenceNumber: string,
    chainId: number,
    maxGasAmount: string,
    gasUnitPrice: string,
    expirationTimestampSecs: string
}
export type SignMessagePayload = {
    address?: boolean; // Should we include the address of the account in the message
    application?: boolean; // Should we include the domain of the dApp
    chainId?: boolean; // Should we include the current chain id the wallet is connected to
    message: string; // The message to be signed and displayed to the user
    nonce: string; // A nonce the dApp should generate
}

export type SignMessageByPayloadResponse = {
    address?: string;
    application?: string;
    chainId?: number;
    fullMessage: string; // The message that was generated to sign
    message: string; // The message passed in by the user
    nonce: string,
    prefix: string, // Should always be APTOS
    signature: string; // The signed full message
    bitmap?: Uint8Array; // a 4-byte (32 bits) bit-vector of length N
}

export class AptosWallet extends BaseWallet {
    async getDerivedPath(param: GetDerivedPathParam): Promise<any> {
        return `m/44'/637'/${param.index}'/0'/0'`;
    }

    async getRandomPrivateKey(): Promise<any> {
        try {
            return Promise.resolve("0x" + ed25519_getRandomPrivateKey(false, "hex"))
        } catch (e) {
            return Promise.reject(GenPrivateKeyError);
        }
    }

    async getDerivedPrivateKey(param: DerivePriKeyParams): Promise<any> {
        try {
            const key = await ed25519_getDerivedPrivateKey(param, false, "hex")
            return Promise.resolve("0x" + key);
        } catch (e) {
            return Promise.reject(GenPrivateKeyError);
        }
    }

    checkPrivateKey(privateKey: string) {
        // Either a 32-bit seed or a full 64-bit private key
        const keyBytes = base.fromHex(privateKey)
        return keyBytes.length == 32 || keyBytes.length == 64;
    }

    GetTransactionHash(txHex: string) {
        const bcsBytes = base.fromHex(txHex)
        const prefix = base.sha3_256(Buffer.from("APTOS::Transaction"))
        const message = Buffer.concat([Buffer.from(prefix), Buffer.of(0x0), Buffer.from(bcsBytes)])
        const txHash = base.sha3_256(message);
        return base.toHex(txHash, true);
    }

    getNewAddress(param: NewAddressParams): Promise<any> {
        try {
            if (!this.checkPrivateKey(param.privateKey)) {
                return Promise.reject(NewAddressError);
            }
            const account = AptosAccount.fromPrivateKey(HexString.ensure(param.privateKey))
            let address = account.address().hex()
            if (param.addressType && param.addressType === "short") {
                address = account.address().toShortString()
            }

            let data: NewAddressData = {
                address: address || "",
                publicKey: account.pubKey().hex()
            };
            return Promise.resolve(data);
        } catch (e) {
            return Promise.reject(NewAddressError);
        }
    }

    signTransaction(param: SignTxParams): Promise<any> {
        try {
            const account = AptosAccount.fromPrivateKey(HexString.ensure(param.privateKey))
            const ap = param.data as AptosParam

            let sender = account.address()
            if (ap.base.sender) {
                sender = HexString.ensure(ap.base.sender)
            }

            const tp = ap.type
            let tx: Uint8Array
            switch (tp) {
                case "transfer": {
                    const baseParam = ap.base
                    const data = ap.data as AptosTransferParam
                    const payload = transferPayload(data.recipientAddress, BigInt(data.amount))
                    const rawTxn = createRawTransaction(sender, payload, BigInt(baseParam.sequenceNumber), baseParam.chainId, BigInt(baseParam.maxGasAmount), BigInt(baseParam.gasUnitPrice), BigInt(baseParam.expirationTimestampSecs))
                    tx = generateBCSTransaction(account, rawTxn);
                    break
                }
                case "tokenTransfer": {
                    const baseParam = ap.base
                    const data = ap.data as AptosTokenTransferParam
                    const payload = transferCoin(data.tyArg, data.recipientAddress, BigInt(data.amount))
                    const rawTxn = createRawTransaction(sender, payload, BigInt(baseParam.sequenceNumber), baseParam.chainId, BigInt(baseParam.maxGasAmount), BigInt(baseParam.gasUnitPrice), BigInt(baseParam.expirationTimestampSecs))
                    tx = generateBCSTransaction(account, rawTxn);
                    break
                }
                case "tokenMint": {
                    const baseParam = ap.base
                    const data = ap.data as AptosTokenMintParam
                    const payload = mintCoin(data.tyArg, data.recipientAddress, BigInt(data.amount))
                    const rawTxn = createRawTransaction(sender, payload, BigInt(baseParam.sequenceNumber), baseParam.chainId, BigInt(baseParam.maxGasAmount), BigInt(baseParam.gasUnitPrice), BigInt(baseParam.expirationTimestampSecs))
                    tx = generateBCSTransaction(account, rawTxn);
                    break
                }
                case "tokenBurn": {
                    const baseParam = ap.base
                    const data = ap.data as AptosTokenBurnParam
                    const payload = burnCoin(data.tyArg, BigInt(data.amount))
                    const rawTxn = createRawTransaction(sender, payload, BigInt(baseParam.sequenceNumber), baseParam.chainId, BigInt(baseParam.maxGasAmount), BigInt(baseParam.gasUnitPrice), BigInt(baseParam.expirationTimestampSecs))
                    tx = generateBCSTransaction(account, rawTxn);
                    break
                }
                case "tokenRegister": {
                    const baseParam = ap.base
                    const data = ap.data as AptosTokenRegisterParam
                    const payload = registerCoin(data.tyArg)
                    const rawTxn = createRawTransaction(sender, payload, BigInt(baseParam.sequenceNumber), baseParam.chainId, BigInt(baseParam.maxGasAmount), BigInt(baseParam.gasUnitPrice), BigInt(baseParam.expirationTimestampSecs))
                    tx = generateBCSTransaction(account, rawTxn);
                    break
                }
                case "dapp": {
                    const baseParam = ap.base
                    const data = ap.data as AptosCustomParam
                    const rawTxn = createRawTransactionByABI(sender, BigInt(baseParam.sequenceNumber), baseParam.chainId, BigInt(baseParam.maxGasAmount),
                        BigInt(baseParam.gasUnitPrice), BigInt(baseParam.expirationTimestampSecs), data.data, data.abi)
                    tx = generateBCSTransaction(account, rawTxn);
                    break
                }
                case "simulate": {
                    const baseParam = ap.base
                    const data = ap.data as AptosCustomParam
                    const rawTxn = createRawTransactionByABI(sender, BigInt(baseParam.sequenceNumber), baseParam.chainId, BigInt(baseParam.maxGasAmount),
                        BigInt(baseParam.gasUnitPrice), BigInt(baseParam.expirationTimestampSecs), data.data, data.abi)
                    tx = generateBCSSimulateTransaction(account, rawTxn);
                    break
                }
                case "offerNftObject": {
                    const baseParam = ap.base
                    const data = ap.data as AptosOfferNFTObjectParam
                    const payload = offerNFTTokenPayloadObject(HexString.ensure(data.nftObject), HexString.ensure(data.receiver), BigInt(data.amount))
                    const rawTxn = createRawTransaction(sender, payload, BigInt(baseParam.sequenceNumber), baseParam.chainId, BigInt(baseParam.maxGasAmount), BigInt(baseParam.gasUnitPrice), BigInt(baseParam.expirationTimestampSecs))
                    tx = generateBCSTransaction(account, rawTxn);
                    break
                }
                case "offerNft": {
                    const baseParam = ap.base
                    const data = ap.data as AptosOfferNFTParam
                    const payload = offerNFTTokenPayload(HexString.ensure(data.receiver), HexString.ensure(data.creator), data.collectionName, data.tokenName, BigInt(data.version), BigInt(data.amount))
                    const rawTxn = createRawTransaction(sender, payload, BigInt(baseParam.sequenceNumber), baseParam.chainId, BigInt(baseParam.maxGasAmount), BigInt(baseParam.gasUnitPrice), BigInt(baseParam.expirationTimestampSecs))
                    tx = generateBCSTransaction(account, rawTxn);
                    break
                }
                case "claimNft": {
                    const baseParam = ap.base
                    const data = ap.data as AptosClaimNFTParam
                    const payload = claimNFTTokenPayload(HexString.ensure(data.sender), HexString.ensure(data.creator), data.collectionName, data.tokenName, BigInt(data.version))
                    const rawTxn = createRawTransaction(sender, payload, BigInt(baseParam.sequenceNumber), baseParam.chainId, BigInt(baseParam.maxGasAmount), BigInt(baseParam.gasUnitPrice), BigInt(baseParam.expirationTimestampSecs))
                    tx = generateBCSTransaction(account, rawTxn);
                    break
                }
                case "offerNft_simulate": {
                    const baseParam = ap.base
                    const data = ap.data as AptosOfferNFTParam
                    const payload = offerNFTTokenPayload(HexString.ensure(data.receiver), HexString.ensure(data.creator), data.collectionName, data.tokenName, BigInt(data.version), BigInt(data.amount))
                    const rawTxn = createRawTransaction(sender, payload, BigInt(baseParam.sequenceNumber), baseParam.chainId, BigInt(baseParam.maxGasAmount), BigInt(baseParam.gasUnitPrice), BigInt(baseParam.expirationTimestampSecs))
                    tx = generateBCSSimulateTransaction(account, rawTxn);
                    break
                }
                case "claimNft_simulate": {
                    const baseParam = ap.base
                    const data = ap.data as AptosClaimNFTParam
                    const payload = claimNFTTokenPayload(HexString.ensure(data.sender), HexString.ensure(data.creator), data.collectionName, data.tokenName, BigInt(data.version))
                    const rawTxn = createRawTransaction(sender, payload, BigInt(baseParam.sequenceNumber), baseParam.chainId, BigInt(baseParam.maxGasAmount), BigInt(baseParam.gasUnitPrice), BigInt(baseParam.expirationTimestampSecs))
                    tx = generateBCSSimulateTransaction(account, rawTxn);
                    break
                }
                default:
                    return Promise.reject(SignTxError);
            }
            return Promise.resolve(base.toHex(tx));
        } catch (e) {
            return Promise.reject(SignTxError);
        }
    }

    validAddress(param: ValidAddressParams): Promise<any> {
        let isValid: boolean
        try {
            if (param.address.match(/^0x[0-9A-Fa-f]{62,64}$/) || param.address.match(/^[0-9A-Fa-f]{64}$/)) {
                isValid = true
            } else {
                isValid = false
            }
        } catch (e) {
            isValid = false
        }

        let data: ValidAddressData = {
            isValid: isValid,
            address: param.address
        };
        return Promise.resolve(data);
    }

    async signMessage(param: SignTxParams): Promise<string> {
        try {
            const message: string = param.data
            let data = await client.signMessage(message, param.privateKey)
            if (data.startsWith("0x")) {
                data = data.substring(2)
            }
            return Promise.resolve(data);
        } catch (e) {
            return Promise.reject(SignTxError);
        }
    }

    /*
      export interface SignMessagePayload {
      address?: boolean; // Should we include the address of the account in the message
      application?: boolean; // Should we include the domain of the dApp
      chainId?: boolean; // Should we include the current chain id the wallet is connected to
      message: string; // The message to be signed and displayed to the user
      nonce: string; // A nonce the dApp should generate
    }
     */
    async signMessageByPayload(param: SignMessageByPayloadParams): Promise<any> {
        try {
            const messagePayload = param.data as SignMessagePayload
            const prefix = "APTOS"
            let addr: string | undefined
            let application: string | undefined
            let chainId: number | undefined;
            let fullMessage: string = prefix
            if (messagePayload?.address) {
                const account = new AptosAccount(base.fromHex(param.privateKey))
                addr = account.address().hex();
                fullMessage = fullMessage.concat("\naddress: ", addr)
            }
            if (messagePayload?.application) {
                application = 'dapp'
                fullMessage = fullMessage.concat("\napplication: ", application)
            }
            if (messagePayload.chainId) {
                chainId = 1;
                fullMessage = fullMessage.concat("\nchainId: ", chainId.toString())
            }
            fullMessage = fullMessage.concat("\nmessage: ", messagePayload.message)
            fullMessage = fullMessage.concat("\nnonce: ", messagePayload.nonce)
            let signature = await client.signMessage(fullMessage, param.privateKey)
            if (signature.startsWith("0x")) {
                signature = signature.substring(2)
            }
            let res: SignMessageByPayloadResponse = {
                address: addr,
                application: application,
                chainId: chainId,
                fullMessage: fullMessage,
                message: messagePayload.message,
                nonce: messagePayload.nonce,
                prefix: prefix,
                signature: signature
            }
            return Promise.resolve(res);
        } catch (e) {
            return Promise.reject(SignMsgError);
        }
    }

    async calcTxHash(param: CalcTxHashParams): Promise<string> {
        try {
            return Promise.resolve(this.GetTransactionHash(param.data));
        } catch (e) {
            return Promise.reject(CalcTxHashError);
        }
    }

    async validSignedTransaction(param: ValidSignedTransactionParams): Promise<any> {
        try {
            const skipCheckSign = param.data ? param.data.skipCheckSign : undefined
            const ret = client.validSignedTransaction(param.tx, skipCheckSign || false)
            return Promise.resolve(jsonStringifyUniform(ret))
        } catch (e) {
            return Promise.reject(validSignedTransactionError);
        }
    }
}
