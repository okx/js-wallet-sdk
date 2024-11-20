// @ts-ignore
import {
    BaseWallet,
    CalcTxHashError,
    CalcTxHashParams,
    DerivePriKeyParams,
    ed25519_getDerivedPrivateKey,
    ed25519_getRandomPrivateKey,
    GenPrivateKeyError,
    GetDerivedPathParam,
    jsonStringifyUniform,
    NewAddressData,
    NewAddressError,
    NewAddressParams,
    SignMsgError,
    SignTxError,
    SignTxParams,
    ValidAddressData,
    ValidAddressParams,
    validSignedTransactionError,
    ValidSignedTransactionParams,
    ValidPrivateKeyParams,
    ValidPrivateKeyData
} from "@okxweb3/coin-base";
import {base} from '@okxweb3/crypto-lib';
import {
    AptosAccount,
    burnCoin,
    claimNFTTokenPayload,
    createRawTransaction,
    createRawTransactionByABI,
    generateBCSSimulateTransaction,
    generateBCSTransaction,
    HexString,
    mintCoin,
    offerNFTTokenPayload,
    offerNFTTokenPayloadObject,
    registerCoin,
    transferCoin,
    transferPayload,
} from './index';
import * as client from './client'
import {
    Account,
    AccountAddress,
    AptosConfig,
    Deserializer,
    Ed25519PrivateKey, FungibleAsset, generateSignedTransaction, generateSignedTransactionForSimulation,
    RawTransaction,
    SimpleTransaction,
    Transaction
} from "./v2";
import {Network} from "./v2/utils/apiEndpoints";
import {signTransaction} from "./v2/internal/transactionSubmission";
import {TransactionPayload, TransactionPayloadEntryFunction} from "./transaction_builder/aptos_types";
import { Deserializer as DeserializerBcs } from "./transaction_builder/bcs";

export type AptosParam = {
    type: "transfer" | "tokenTransfer" | "tokenMint" | "tokenBurn" | "tokenRegister" | "dapp" | "simulate" | "offerNft" |
        "offerNftObject" | "claimNft" | "offerNft_simulate" | "claimNft_simulate" | "simple_transaction" | "simulate_simple_transaction" |
        "fungible_asset_transfer" | "simulate_fungible_asset_transfer",
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
    type: number // deault data is object , 2 is hex string
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

export type AptosSimpleTransactionParam = {
    tyArg: Array<any>,
    function: `${string}::${string}::${string}`,
    functionArguments: Array<any>,
    recipientAddress: string,
    amount: string,
    moveModule: string,
    rawTransaction: string,
    feePayerAddress: string,
    withFeePayer: boolean,
    signAsFeePayer: boolean,
}

export type AptosFungibleTokenTransferParam = {
    recipientAddress: string,
    amount: string,
    fungibleAssetMetadataAddress: string
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
    dAppDomain?: string
    chainId?: boolean; // Should we include the current chain id the wallet is connected to
    chain_id?: number
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

export type SignMessageByPayloadParams = {
    privateKey: string;
    data: any;
};

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
    if (!base.validateHexString(privateKey)){
        return false;
    }
    // Either a 32-bit seed or a full 64-bit private key
    const keyBytes = base.fromHex(privateKey.toLowerCase())
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

    validPrivateKey(param: ValidPrivateKeyParams): Promise<any> {
        let isValid = this.checkPrivateKey(param.privateKey);
        const data: ValidPrivateKeyData = {
            isValid: isValid,
            privateKey: param.privateKey
        };
        return Promise.resolve(data);
    }

    signTransaction(param: SignTxParams): Promise<any> {
        try {
            const account = AptosAccount.fromPrivateKey(HexString.ensure(param.privateKey))
            const ap = param.data as AptosParam

            let sender = account.address()
            if (ap.base.sender) {
                sender = HexString.ensure(ap.base.sender)
            }
            // compatible v2
            const privateKey = HexString.ensure(param.privateKey).toString();

            const ed25519PrivateKey = new Ed25519PrivateKey(privateKey.slice(2, 66));
            const senderAccount = Account.fromPrivateKey({privateKey: ed25519PrivateKey});
            const senderAddress = senderAccount.accountAddress;

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
                    if (data.type == 2) {
                        const deserializer = new DeserializerBcs(base.fromHex(data.data));
                        const payload = TransactionPayload.deserialize(deserializer);

                        const rawTxn = createRawTransaction(
                            sender,
                            payload,
                            BigInt(baseParam.sequenceNumber),
                            baseParam.chainId,
                            BigInt(baseParam.maxGasAmount),
                            BigInt(baseParam.gasUnitPrice),
                            BigInt(baseParam.expirationTimestampSecs))
                        tx = generateBCSTransaction(account, rawTxn);
                    }else {
                        const rawTxn = createRawTransactionByABI(sender, BigInt(baseParam.sequenceNumber), baseParam.chainId, BigInt(baseParam.maxGasAmount),
                            BigInt(baseParam.gasUnitPrice), BigInt(baseParam.expirationTimestampSecs), data.data, data.abi)
                        tx = generateBCSTransaction(account, rawTxn);
                    }
                    break
                }
                case "simulate": {
                    const baseParam = ap.base
                    const data = ap.data as AptosCustomParam
                    if (data.type == 2) {
                        const deserializer = new DeserializerBcs(base.fromHex(data.data));
                        const payload = TransactionPayload.deserialize(deserializer);

                        const rawTxn = createRawTransaction(
                            sender,
                            payload,
                            BigInt(baseParam.sequenceNumber),
                            baseParam.chainId,
                            BigInt(baseParam.maxGasAmount),
                            BigInt(baseParam.gasUnitPrice),
                            BigInt(baseParam.expirationTimestampSecs))
                        tx = generateBCSSimulateTransaction(account, rawTxn);

                    }else {
                        const rawTxn = createRawTransactionByABI(sender, BigInt(baseParam.sequenceNumber), baseParam.chainId, BigInt(baseParam.maxGasAmount),
                            BigInt(baseParam.gasUnitPrice), BigInt(baseParam.expirationTimestampSecs), data.data, data.abi)
                        tx = generateBCSSimulateTransaction(account, rawTxn);
                    }

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
                case "simple_transaction": {
                    const baseParam = ap.base;
                    const data = ap.data as AptosSimpleTransactionParam;

                    const network = baseParam.chainId == 1 ? Network.MAINNET : Network.TESTNET;
                    const m = "{\"abi\":{\"address\":\"0x1\",\"name\":\"aptos_account\",\"friends\":[\"0x1::genesis\",\"0x1::resource_account\"],\"exposed_functions\":[{\"name\":\"assert_account_exists\",\"visibility\":\"public\",\"is_entry\":false,\"is_view\":false,\"generic_type_params\":[],\"params\":[\"address\"],\"return\":[]},{\"name\":\"assert_account_is_registered_for_apt\",\"visibility\":\"public\",\"is_entry\":false,\"is_view\":false,\"generic_type_params\":[],\"params\":[\"address\"],\"return\":[]},{\"name\":\"batch_transfer\",\"visibility\":\"public\",\"is_entry\":true,\"is_view\":false,\"generic_type_params\":[],\"params\":[\"&signer\",\"vector<address>\",\"vector<u64>\"],\"return\":[]},{\"name\":\"batch_transfer_coins\",\"visibility\":\"public\",\"is_entry\":true,\"is_view\":false,\"generic_type_params\":[{\"constraints\":[]}],\"params\":[\"&signer\",\"vector<address>\",\"vector<u64>\"],\"return\":[]},{\"name\":\"can_receive_direct_coin_transfers\",\"visibility\":\"public\",\"is_entry\":false,\"is_view\":true,\"generic_type_params\":[],\"params\":[\"address\"],\"return\":[\"bool\"]},{\"name\":\"create_account\",\"visibility\":\"public\",\"is_entry\":true,\"is_view\":false,\"generic_type_params\":[],\"params\":[\"address\"],\"return\":[]},{\"name\":\"deposit_coins\",\"visibility\":\"public\",\"is_entry\":false,\"is_view\":false,\"generic_type_params\":[{\"constraints\":[]}],\"params\":[\"address\",\"0x1::coin::Coin<T0>\"],\"return\":[]},{\"name\":\"set_allow_direct_coin_transfers\",\"visibility\":\"public\",\"is_entry\":true,\"is_view\":false,\"generic_type_params\":[],\"params\":[\"&signer\",\"bool\"],\"return\":[]},{\"name\":\"transfer\",\"visibility\":\"public\",\"is_entry\":true,\"is_view\":false,\"generic_type_params\":[],\"params\":[\"&signer\",\"address\",\"u64\"],\"return\":[]},{\"name\":\"transfer_coins\",\"visibility\":\"public\",\"is_entry\":true,\"is_view\":false,\"generic_type_params\":[{\"constraints\":[]}],\"params\":[\"&signer\",\"address\",\"u64\"],\"return\":[]}],\"structs\":[{\"name\":\"DirectCoinTransferConfigUpdatedEvent\",\"is_native\":false,\"abilities\":[\"drop\",\"store\"],\"generic_type_params\":[],\"fields\":[{\"name\":\"new_allow_direct_transfers\",\"type\":\"bool\"}]},{\"name\":\"DirectTransferConfig\",\"is_native\":false,\"abilities\":[\"key\"],\"generic_type_params\":[],\"fields\":[{\"name\":\"allow_arbitrary_coin_transfers\",\"type\":\"bool\"},{\"name\":\"update_coin_transfer_events\",\"type\":\"0x1::event::EventHandle<0x1::aptos_account::DirectCoinTransferConfigUpdatedEvent>\"}]}]}}"
                    const moveModule = data.moveModule == undefined ? m : data.moveModule;
                    const aptosConfig = new AptosConfig({network: network, moveModule: moveModule});
                    const transaction = new Transaction(aptosConfig);

                    if (data.signAsFeePayer) {
                        const rawTransactionHex = data.rawTransaction;
                        const deserializer = new Deserializer(base.fromHex(rawTransactionHex));
                        const rawTransaction = RawTransaction.deserialize(deserializer);
                        // const rawTx = {
                        //     rawTransaction: rawTransaction,
                        //     feePayerAddress: AccountAddress.ZERO,
                        //     secondarySignerAddresses: undefined
                        // };
                        const rawTx = new SimpleTransaction(rawTransaction, AccountAddress.ZERO);
                        // sponsor signs
                        const sponsorSignature = transaction.signAsFeePayer({
                            signer: senderAccount,
                            transaction: rawTx
                        });

                        const raw = {
                            rawTransaction: rawTx.rawTransaction.bcsToHex().toString(),
                            sponsorSignature: sponsorSignature.bcsToHex().toString(),
                        };
                        return Promise.resolve(raw);
                    }
                    const functionArguments = data.functionArguments === undefined ? [data.recipientAddress, data.amount] : data.functionArguments;
                    const res = transaction.build.simple({
                        sender: senderAddress,
                        withFeePayer: data.withFeePayer,
                        data: {
                            function: data.function,
                            typeArguments: data.tyArg,
                            functionArguments: functionArguments,
                        },
                        options: {
                            maxGasAmount: Number(baseParam.maxGasAmount),
                            gasUnitPrice: Number(baseParam.gasUnitPrice),
                            expireTimestamp: Number(baseParam.expirationTimestampSecs),
                            chainId: Number(baseParam.chainId),
                            accountSequenceNumber: Number(baseParam.sequenceNumber),
                        },
                    }).then(rawTx => {
                        const senderSignature = transaction.sign({signer: senderAccount, transaction: rawTx});
                        const raw = {
                            rawTransaction: rawTx.rawTransaction.bcsToHex().toString(),
                            senderSignature: senderSignature.bcsToHex().toString(),
                        };
                        return raw;
                    });
                    return res;
                }
                // todo
                // case "simulate_simple_transaction": {
                //     const baseParam = ap.base
                //     const data = ap.data as AptosClaimNFTParam
                //     const payload = claimNFTTokenPayload(HexString.ensure(data.sender), HexString.ensure(data.creator), data.collectionName, data.tokenName, BigInt(data.version))
                //     const rawTxn = createRawTransaction(sender, payload, BigInt(baseParam.sequenceNumber), baseParam.chainId, BigInt(baseParam.maxGasAmount), BigInt(baseParam.gasUnitPrice), BigInt(baseParam.expirationTimestampSecs))
                //     tx = generateBCSSimulateTransaction(account, rawTxn);
                //     break
                // }
                case "fungible_asset_transfer": {
                    const baseParam = ap.base
                    const data = ap.data as AptosFungibleTokenTransferParam
                    const aptosConfig = new AptosConfig({network: Network.MAINNET});
                    const fungibleAsset = new FungibleAsset(aptosConfig);
                    const metadataAddress = data.fungibleAssetMetadataAddress;
                    const amount = BigInt(data.amount);
                    // normal fungible asset transfer between primary stores
                    const res = fungibleAsset.transferFungibleAsset({
                        sender: senderAccount,
                        fungibleAssetMetadataAddress: AccountAddress.from(metadataAddress),
                        recipient: data.recipientAddress,
                        amount: amount,
                        options: {
                            maxGasAmount: Number(baseParam.maxGasAmount),
                            gasUnitPrice: Number(baseParam.gasUnitPrice),
                            expireTimestamp: Number(baseParam.expirationTimestampSecs),
                            chainId: Number(baseParam.chainId),
                            accountSequenceNumber: Number(baseParam.sequenceNumber),
                        },
                    }).then(transferFungibleAssetRawTransaction => {
                        const authenticator = signTransaction({
                            signer: senderAccount,
                            transaction: transferFungibleAssetRawTransaction
                        });
                        const signedTx = generateSignedTransaction({
                            transaction: transferFungibleAssetRawTransaction,
                            senderAuthenticator: authenticator,
                        });
                        return base.toHex(signedTx);
                    });
                    return res;
                    // break
                }
                case "simulate_fungible_asset_transfer": {
                    const baseParam = ap.base
                    const data = ap.data as AptosFungibleTokenTransferParam
                    const aptosConfig = new AptosConfig({network: Network.MAINNET});
                    const fungibleAsset = new FungibleAsset(aptosConfig);
                    const metadataAddress = data.fungibleAssetMetadataAddress;
                    const amount = BigInt(data.amount);
                    // normal fungible asset transfer between primary stores
                    const res = fungibleAsset.transferFungibleAsset({
                        sender: senderAccount,
                        fungibleAssetMetadataAddress: AccountAddress.from(metadataAddress),
                        recipient: data.recipientAddress,
                        amount: amount,
                        options: {
                            maxGasAmount: Number(baseParam.maxGasAmount),
                            gasUnitPrice: Number(baseParam.gasUnitPrice),
                            expireTimestamp: Number(baseParam.expirationTimestampSecs),
                            chainId: Number(baseParam.chainId),
                            accountSequenceNumber: Number(baseParam.sequenceNumber),
                        },
                    }).then(transferFungibleAssetRawTransaction => {
                        const signedTx = generateSignedTransactionForSimulation({
                            transaction: transferFungibleAssetRawTransaction,
                            signerPublicKey: senderAccount.publicKey,
                        });
                        return base.toHex(signedTx);
                    });
                    return res;
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
                application = messagePayload.dAppDomain == undefined ? "" : messagePayload.dAppDomain
                fullMessage = fullMessage.concat("\napplication: ", application)
            }
            if (messagePayload.chainId) {
                chainId = messagePayload.chain_id == undefined ? 0 : messagePayload.chain_id;
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
