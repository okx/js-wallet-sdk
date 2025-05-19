import {HexString} from './hex_string';
import {AptosAccount} from './aptos_account';

import {
    ABIBuilderConfig,
    BCS,
    buildRawTransactionByABI,
    TransactionBuilder,
    TransactionBuilderEd25519,
    TxnBuilderTypes,
} from './transaction_builder';
import {
    SignedTransaction,
    StructTag,
    TransactionAuthenticatorEd25519,
    TransactionPayload,
} from './transaction_builder/aptos_types';
import {AnyNumber, Deserializer, Uint32, Uint64, Uint8} from './transaction_builder/bcs';
import {MoveModuleBytecode} from './transaction_builder/move_types';
import {base, signUtil} from '@okxweb3/crypto-lib';
import {
    Account,
    AccountAddress,
    AccountAddressInput,
    AnyRawTransaction,
    AptosConfig,
    Ed25519Account,
    EntryFunctionABI,
    generateSignedTransactionForSimulation,
    generateTransactionPayload,
    getFunctionParts,
    Network,
    PublicKey,
    Serializer,
    SignedTransaction as SignedTransactionV2,
    Transaction,
    TransactionPayload as TransactionPayloadV2,
    TransactionPayloadEntryFunction,
    TransactionPayloadMultiSig,
    TransactionPayloadScript,
    TypeTagAddress,
    TypeTagU64
} from "./v2";
import {buildRawTransaction} from "./v2/internal/transactionSubmission";

declare const TextEncoder: any;

/**
 * transfers Aptos Coins from signer to receiver
 *
 * @param account AptosAccount object of the signing account
 * @param recipientAddress
 * @param amount amount of aptos coins to be transferred
 * @param sequenceNumber
 * @param chainId chain id
 * @param maxGasAmount gas limit
 * @param gasUnitPrice gas price
 * @param expirationTimestampSecs
 * @returns transaction hash
 */
export function transfer(
    account: AptosAccount,
    recipientAddress: string | HexString,
    amount: AnyNumber,
    sequenceNumber: Uint64,
    chainId: Uint8,
    maxGasAmount: Uint64,
    gasUnitPrice: Uint64,
    expirationTimestampSecs: Uint64
): Uint8Array {
    const payload = transferPayload(recipientAddress, amount)
    const rawTxn = createRawTransaction(account.address(), payload, sequenceNumber, chainId, maxGasAmount, gasUnitPrice, expirationTimestampSecs)
    return generateBCSTransaction(account, rawTxn);
}

export function createRawTransaction(sender: HexString,
                                     payload: TransactionPayload,
                                     sequenceNumber: Uint64,
                                     chainId: Uint8,
                                     maxGasAmount: Uint64,
                                     gasUnitPrice: Uint64,
                                     expirationTimestampSecs: Uint64) {

    return new TxnBuilderTypes.RawTransaction(
        TxnBuilderTypes.AccountAddress.fromHex(sender),
        sequenceNumber,
        payload,
        maxGasAmount,
        gasUnitPrice,
        expirationTimestampSecs,
        new TxnBuilderTypes.ChainId(chainId),
    );
}

export function signTransactionV2(senderAccount: Ed25519Account, rawTxn: AnyRawTransaction) {
    const senderSignature = senderAccount.signTransactionWithAuthenticator(rawTxn)
    if (rawTxn.secondarySignerAddresses || rawTxn.feePayerAddress) {
        return {
            rawTxn: rawTxn.bcsToHex().toString(),
            accAuthenticator: senderSignature.bcsToHex().toString(),
        }
    }
    let signedTx = new SignedTransactionV2(rawTxn.rawTransaction, senderSignature);
    let buffer = new Serializer();
    signedTx.serialize(buffer)
    return base.toHex(buffer.toUint8Array());
}

export function createRawTransactionV2(sender: HexString, payload: TransactionPayloadV2,
                                       sequenceNumber: Uint64, chainId: Uint8, maxGasAmount: Uint64, gasUnitPrice: Uint64, expirationTimestampSecs: Uint64,
                                       withFeePayer?: boolean, secondarySignerAddresses?: AccountAddressInput[] | undefined) {
    var anyPay;
    if (payload instanceof TransactionPayloadEntryFunction) {
        anyPay = payload as TransactionPayloadEntryFunction
    } else if (payload instanceof TransactionPayloadScript) {
        anyPay = payload as TransactionPayloadScript
    } else {
        anyPay = payload as TransactionPayloadMultiSig
    }
    if (secondarySignerAddresses) {
        return buildRawTransaction({
            aptosConfig: new AptosConfig(),
            data: { //does not use
                function: `0::0::0`,
                functionArguments: [],
            },
            sender: AccountAddress.fromString(sender.hex()),
            secondarySignerAddresses: secondarySignerAddresses,
            options: {
                maxGasAmount: Number(maxGasAmount),
                gasUnitPrice: Number(gasUnitPrice),
                expireTimestamp: Number(expirationTimestampSecs),
                accountSequenceNumber: sequenceNumber,
                chainId: chainId,
            }, withFeePayer: withFeePayer
        }, anyPay)
    } else {
        return buildRawTransaction({
            aptosConfig: new AptosConfig(),
            data: { //does not use
                function: `0::0::0`,
                functionArguments: [],
            },
            sender: AccountAddress.fromString(sender.hex()),
            options: {
                maxGasAmount: Number(maxGasAmount),
                gasUnitPrice: Number(gasUnitPrice),
                expireTimestamp: Number(expirationTimestampSecs),
                accountSequenceNumber: sequenceNumber,
                chainId: chainId,
            }, withFeePayer: withFeePayer
        }, anyPay)
    }
}

export function simulateTransaction(account: AptosAccount,
                                    payload: TransactionPayload,
                                    sequenceNumber: Uint64,
                                    chainId: Uint8,
                                    maxGasAmount: Uint64,
                                    gasUnitPrice: Uint64,
                                    expirationTimestampSecs: Uint64) {
    const rawTransaction = createRawTransaction(account.address(), payload, sequenceNumber, chainId, maxGasAmount, gasUnitPrice, expirationTimestampSecs)
    return generateBCSSimulateTransaction(account, rawTransaction)
}

export const APTOS_COIN = "0x1::aptos_coin::AptosCoin";
const coinTransferAbi: EntryFunctionABI = {
    typeParameters: [],
    parameters: [new TypeTagAddress(), new TypeTagU64()],
};

// Move models must expose script functions for initializing and manipulating resources. The script can then be called from a transaction.
export async function transferPayloadV2(recipientAddress: string, amount: AnyNumber) {
    let config = new AptosConfig();
    return generateTransactionPayload({
        aptosConfig: config,
        function: "0x1::aptos_account::transfer",
        functionArguments: [AccountAddress.fromString(recipientAddress), amount as Uint32],
        abi: coinTransferAbi,
    })
}

// Move models must expose script functions for initializing and manipulating resources. The script can then be called from a transaction.
export function transferPayload(recipientAddress: string | HexString, amount: AnyNumber) {
    return new TxnBuilderTypes.TransactionPayloadEntryFunction(
        TxnBuilderTypes.EntryFunction.natural(
            '0x1::aptos_account',
            'transfer',
            [],
            [BCS.bcsToBytes(TxnBuilderTypes.AccountAddress.fromHex(recipientAddress)), BCS.bcsSerializeUint64(amount),
            ],
        ),
    );
}

// Move models must expose script functions for initializing and manipulating resources. The script can then be called from a transaction.
export function migrateToFaStorePayload(typeArg:string) {
    const token = new TxnBuilderTypes.TypeTagStruct(
        TxnBuilderTypes.StructTag.fromString(typeArg),
    );
    return new TxnBuilderTypes.TransactionPayloadEntryFunction(
        TxnBuilderTypes.EntryFunction.natural(
            '0x1::coin',
            'migrate_to_fungible_store',
            [token],
            [],
        ),
    );
}

export function registerCoin(tyArg: string) {
    const token = new TxnBuilderTypes.TypeTagStruct(
        TxnBuilderTypes.StructTag.fromString(tyArg),
    );

    return new TxnBuilderTypes.TransactionPayloadEntryFunction(
        TxnBuilderTypes.EntryFunction.natural("0x1::managed_coin", "register", [token], []),
    );
}

// The owner account can mint MoonCoin by calling 0x1::managed_coin::mint.
export function mintCoin(tyArg: string, receiverAddress: string, amount: AnyNumber) {
    const token = new TxnBuilderTypes.TypeTagStruct(
        TxnBuilderTypes.StructTag.fromString(tyArg),
    );

    return new TxnBuilderTypes.TransactionPayloadEntryFunction(
        TxnBuilderTypes.EntryFunction.natural(
            "0x1::managed_coin",
            "mint",
            [token],
            [BCS.bcsToBytes(TxnBuilderTypes.AccountAddress.fromHex(receiverAddress)), BCS.bcsSerializeUint64(amount)],
        ),
    );
}

export function burnCoin(tyArg: string, amount: AnyNumber) {
    const token = new TxnBuilderTypes.TypeTagStruct(
        TxnBuilderTypes.StructTag.fromString(tyArg),
    );

    return new TxnBuilderTypes.TransactionPayloadEntryFunction(
        TxnBuilderTypes.EntryFunction.natural(
            "0x1::managed_coin",
            "burn",
            [token],
            [BCS.bcsSerializeUint64(amount)],
        ),
    );
}

export function transferCoin(tyArg: string, receiverAddress: string, amount: AnyNumber) {
    const token = new TxnBuilderTypes.TypeTagStruct(
        TxnBuilderTypes.StructTag.fromString(tyArg),
    );

    return new TxnBuilderTypes.TransactionPayloadEntryFunction(
        TxnBuilderTypes.EntryFunction.natural(
            "0x1::coin",
            "transfer",
            [token],
            [BCS.bcsToBytes(TxnBuilderTypes.AccountAddress.fromHex(receiverAddress)), BCS.bcsSerializeUint64(amount)],
        ),
    );
}

export function transferCoinV2(tyArg: string, receiverAddress: string, amount: AnyNumber) {
    const token = new TxnBuilderTypes.TypeTagStruct(
        TxnBuilderTypes.StructTag.fromString(tyArg),
    );

    return new TxnBuilderTypes.TransactionPayloadEntryFunction(
        TxnBuilderTypes.EntryFunction.natural(
            "0x1::aptos_account",
            "transfer_coins",
            [token],
            [BCS.bcsToBytes(TxnBuilderTypes.AccountAddress.fromHex(receiverAddress)), BCS.bcsSerializeUint64(amount)],
        ),
    );
}


// NFT
// A name, the name of the asset, which must be unique within a collection
// A description, the description of the asset
// A URL, a non-descript pointer off-chain to more information about the asset could be media such as an image or video or more metadata
// A supply, the total number of units of this NFT, many NFTs have only a single supply while those that have more than one are referred to as editions
// The token related data are stored at both creator’s account and owner’s account.
/*
Resource stored at creator’s address:
Collections	--
Maintains a table called collection_data, which maps the collection name to the CollectionData. It also stores all the TokenData that this creator creates.
CollectionData --
Store the collection metadata. The supply is the number of tokens created for the current collection. maxium is the upper bound of tokens in this collection.
CollectionMutabilityConfig --
Specify which field is mutable.
TokenData	--
The main struct for holding the token metadata. Properties is a where user can add their own properties that are not defined in the token data. User can mint more tokens based on the TokenData and they share the same TokenData.
TokenMutabilityConfig	--
Control which fields are mutable.
TokenDataId	--
An id used for representing and querying TokenData on-chain. This id mainly contains 3 fields including creator address, collection name and token name.
Royalty	--
Specify the denominator and numerator for calculating the royalty fee. It also has payee account address for depositing the Royalty.
PropertyValue	--
Contains both value of a property and type of property.

Resource stored at owner’s address:
TokenStore	--
The main struct for storing the token owned by this address. It maps TokenId to the actual token.
Token	--
amount is the number of tokens.
TokenId	--
TokenDataId points to the metadata of this token. The property_version represents a token with mutated PropertyMap from default_properties in the TokenData.
 */
function serializeVectorBool(vecBool: boolean[]) {
    const serializer = new BCS.Serializer();
    serializer.serializeU32AsUleb128(vecBool.length);
    vecBool.forEach((el) => {
        serializer.serializeBool(el);
    });
    return serializer.getBytes();
}

// first NFT
// Creating your own token collection.
// Creating a token of our favorite cat.
// Giving that token to someone else.
// The on-chain lazy mint token through mutation.
export function createNFTCollectionPayload(name: string, description: string, uri: string) {
    const NUMBER_MAX: number = 9007199254740991;
    return new TxnBuilderTypes.TransactionPayloadEntryFunction(
        TxnBuilderTypes.EntryFunction.natural(
            "0x3::token",
            "create_collection_script",
            [],
            [
                BCS.bcsSerializeStr(name),
                BCS.bcsSerializeStr(description),
                BCS.bcsSerializeStr(uri),
                BCS.bcsSerializeUint64(NUMBER_MAX),
                serializeVectorBool([false, false, false]),
            ],
        ),
    );
}

export function createNFTTokenPayload(account: AptosAccount,
                                      collection_name: string,
                                      name: string,
                                      description: string,
                                      supply: number | bigint,
                                      uri: string) {
    const NUMBER_MAX: number = 9007199254740991;

    // Serializes empty arrays
    const serializer = new BCS.Serializer();
    serializer.serializeU32AsUleb128(0);

    return new TxnBuilderTypes.TransactionPayloadEntryFunction(
        TxnBuilderTypes.EntryFunction.natural(
            "0x3::token",
            "create_token_script",
            [],
            [
                BCS.bcsSerializeStr(collection_name),
                BCS.bcsSerializeStr(name),
                BCS.bcsSerializeStr(description),
                BCS.bcsSerializeUint64(supply),
                BCS.bcsSerializeUint64(NUMBER_MAX),
                BCS.bcsSerializeStr(uri),
                BCS.bcsToBytes(TxnBuilderTypes.AccountAddress.fromHex(account.address())),
                BCS.bcsSerializeUint64(0),
                BCS.bcsSerializeUint64(0),
                serializeVectorBool([false, false, false, false, false]),
                serializer.getBytes(),
                serializer.getBytes(),
                serializer.getBytes(),
            ],
        ),
    );
}

// The sender must first register that a token is available for the recipient to claim, the recipient must then claim this token.
export function offerNFTTokenPayload(receiver: HexString,
                                     creator: HexString,
                                     collection_name: string,
                                     token_name: string,
                                     version: bigint,
                                     amount: bigint) {
    return new TxnBuilderTypes.TransactionPayloadEntryFunction(
        TxnBuilderTypes.EntryFunction.natural(
            "0x3::token_transfers",
            "offer_script",
            [],
            [
                BCS.bcsToBytes(TxnBuilderTypes.AccountAddress.fromHex(receiver.hex())),
                BCS.bcsToBytes(TxnBuilderTypes.AccountAddress.fromHex(creator.hex())),
                BCS.bcsSerializeStr(collection_name),
                BCS.bcsSerializeStr(token_name),
                BCS.bcsSerializeUint64(version),
                BCS.bcsSerializeUint64(amount),
            ],
        ),
    );
}

export function offerNFTTokenPayloadObject(nftObject: HexString,
                                           receiver: HexString,
                                           amount: bigint) {
    return new TxnBuilderTypes.TransactionPayloadEntryFunction(
        TxnBuilderTypes.EntryFunction.natural(
            "0x1::object",
            "transfer",
            [StructTag.fromString("0x1::object::ObjectCore")],
            [
                BCS.bcsToBytes(TxnBuilderTypes.AccountAddress.fromHex(nftObject.hex())),
                BCS.bcsToBytes(TxnBuilderTypes.AccountAddress.fromHex(receiver.hex())),
                BCS.bcsSerializeUint64(amount),
            ],
        ),
    );
}

export function claimNFTTokenPayload(sender: HexString,
                                     creator: HexString,
                                     collection_name: string,
                                     token_name: string,
                                     version: bigint) {
    return new TxnBuilderTypes.TransactionPayloadEntryFunction(
        TxnBuilderTypes.EntryFunction.natural(
            "0x3::token_transfers",
            "claim_script",
            [],
            [
                BCS.bcsToBytes(TxnBuilderTypes.AccountAddress.fromHex(sender.hex())),
                BCS.bcsToBytes(TxnBuilderTypes.AccountAddress.fromHex(creator.hex())),
                BCS.bcsSerializeStr(collection_name),
                BCS.bcsSerializeStr(token_name),
                BCS.bcsSerializeUint64(version),
            ],
        ),
    );
}

/** Generates a signed transaction that can be submitted to the chain for execution. */
export function generateBCSTransaction(
    accountFrom: AptosAccount,
    rawTxn: TxnBuilderTypes.RawTransaction
): Uint8Array {
    const txnBuilder = new TransactionBuilderEd25519(
        (signingMessage: TxnBuilderTypes.SigningMessage) => {
            const sigHexStr = accountFrom.signBuffer(Buffer.from(signingMessage));
            return new TxnBuilderTypes.Ed25519Signature(sigHexStr.toUint8Array());
        },
        accountFrom.pubKey().toUint8Array()
    );
    return txnBuilder.sign(rawTxn);
}

export function generateBCSTransactionV2(
    accountFrom: AptosAccount,
    rawTxn: TxnBuilderTypes.RawTransaction
): Uint8Array {
    const txnBuilder = new TransactionBuilderEd25519(
        (signingMessage: TxnBuilderTypes.SigningMessage) => {
            const sigHexStr = accountFrom.signBuffer(Buffer.from(signingMessage));
            return new TxnBuilderTypes.Ed25519Signature(sigHexStr.toUint8Array());
        },
        accountFrom.pubKey().toUint8Array()
    );
    return txnBuilder.sign(rawTxn);
}


/** Generates a signed transaction that can be submitted to the chain for execution. */
export function generateBCSSimulateTransaction(
    accountFrom: AptosAccount,
    rawTxn: TxnBuilderTypes.RawTransaction
): Uint8Array {
    const txnBuilder = new TransactionBuilderEd25519(
        (signingMessage: TxnBuilderTypes.SigningMessage) => {
            const signature = new Uint8Array(64)
            return new TxnBuilderTypes.Ed25519Signature(signature);
        },
        accountFrom.pubKey().toUint8Array()
    );
    return txnBuilder.sign(rawTxn);
}

export function generateBCSSimulateTransactionWithPublicKey(
    publicKey: Uint8Array,
    rawTxn: TxnBuilderTypes.RawTransaction
): Uint8Array {
    const txnBuilder = new TransactionBuilderEd25519(
        (signingMessage: TxnBuilderTypes.SigningMessage) => {
            const signature = new Uint8Array(64)
            return new TxnBuilderTypes.Ed25519Signature(signature);
        },
        publicKey
    );
    return txnBuilder.sign(rawTxn);
}

export function createRawTransactionByABI(
    sender: HexString,
    sequenceNumber: Uint64,
    chainId: Uint8,
    maxGasAmount: Uint64,
    gasUnitPrice: Uint64,
    expirationTimestampSecs: Uint64,
    callData: string,
    moduleAbi: string
) {
    const builderConfig: ABIBuilderConfig = {
        sender: sender,
        sequenceNumber: sequenceNumber,
        gasUnitPrice: gasUnitPrice,
        maxGasAmount: maxGasAmount,
        expSecFromNow: expirationTimestampSecs.toString(),
        chainId: chainId,
    }

    const data = JSON.parse(callData)
    const modules: MoveModuleBytecode[] = JSON.parse(moduleAbi)
    return buildRawTransactionByABI(
        modules,
        builderConfig,
        data.function,
        data.type_arguments || data.typeArguments,
        data.arguments || data.functionArguments
    );
}


export function createRawTransactionByABIV2(
    sender: Account,
    sequenceNumber: Uint64,
    chainId: Uint8,
    maxGasAmount: Uint64,
    gasUnitPrice: Uint64,
    expirationTimestampSecs: Uint64,
    callData: string,
    moduleAbi: string, withFeePayer?: boolean, secondarySignerAddresses?: AccountAddressInput[] | undefined
) {
    const dataP = JSON.parse(callData)
    const modules: MoveModuleBytecode[] = JSON.parse(moduleAbi)
    const {moduleAddress, moduleName, functionName} = getFunctionParts(dataP.function);
    let moduleAddressRaw = AccountAddress.fromString(moduleAddress)
    let moveModule = modules.find((item) => {
        if (moduleName == item.abi?.name) {
            if (moduleAddressRaw.equals(AccountAddress.fromString(item.abi.address))){
                let res = item.abi?.exposed_functions.find((func) => {
                    return functionName == func.name
                });
                if (res) {
                    return item;
                }
            }
        }
    });
    const aptosConfig = new AptosConfig({network: Network.CUSTOM, moveModule: JSON.stringify(moveModule)});
    const transaction = new Transaction(aptosConfig);
    if (secondarySignerAddresses) {
        return transaction.build.multiAgent({
            sender: sender.accountAddress,
            withFeePayer: withFeePayer,
            data: {
                function: dataP.function,
                typeArguments: dataP.tyArg || dataP.typeArguments || dataP.type_arguments,
                functionArguments: dataP.arguments || dataP.functionArguments,
            },
            secondarySignerAddresses: secondarySignerAddresses,
            options: {
                maxGasAmount: Number(maxGasAmount),
                gasUnitPrice: Number(gasUnitPrice),
                expireTimestamp: Number(expirationTimestampSecs),
                chainId: Number(chainId),
                accountSequenceNumber: Number(sequenceNumber),
            },
        }).then((multiAgentTx) => {
            const senderSignature = transaction.sign({signer: sender, transaction: multiAgentTx});
            return {
                rawTxn: multiAgentTx.bcsToHex().toString(), //
                accAuthenticator: senderSignature.bcsToHex().toString(),// sender 签名
            }
        })
    } else {
        const rawTxn = transaction.build.simple({
            sender: sender.accountAddress,
            withFeePayer: withFeePayer,
            data: {
                function: dataP.function,
                typeArguments: dataP.tyArg || dataP.typeArguments || dataP.type_arguments,
                functionArguments: dataP.arguments || dataP.functionArguments,
            },
            options: {
                maxGasAmount: Number(maxGasAmount),
                gasUnitPrice: Number(gasUnitPrice),
                expireTimestamp: Number(expirationTimestampSecs),
                chainId: Number(chainId),
                accountSequenceNumber: Number(sequenceNumber),
            },
        }).then(rawTx => {
            const senderSignature = transaction.sign({signer: sender, transaction: rawTx});
            let signedTx = new SignedTransactionV2(rawTx.rawTransaction, senderSignature);
            let buffer = new Serializer();
            signedTx.serialize(buffer)
            return base.toHex(buffer.toUint8Array());
        });
        return rawTxn;
    }
}

export function createSimulateRawTransactionByABIV2(
    sender: AccountAddress,
    signerPublicKey: PublicKey,
    sequenceNumber: Uint64,
    chainId: Uint8,
    maxGasAmount: Uint64,
    gasUnitPrice: Uint64,
    expirationTimestampSecs: Uint64,
    callData: string,
    moduleAbi: string, withFeePayer?: boolean,
) {
    const dataP = JSON.parse(callData)
    const modules: MoveModuleBytecode[] = JSON.parse(moduleAbi)
    const { moduleAddress, moduleName, functionName } = getFunctionParts(dataP.function);
    let moduleAddressRaw = AccountAddress.fromString(moduleAddress)
    let moceModule = modules.find((item)=>{
        if(moduleName == item.abi?.name ) {
            if (moduleAddressRaw.equals(AccountAddress.fromString(item.abi.address))){
                let res = item.abi?.exposed_functions.find((func) => {
                    return functionName == func.name
                });
                if (res){
                    return item;
                }
            }
        }
    });
    const aptosConfig = new AptosConfig({network: Network.CUSTOM, moveModule: JSON.stringify(moceModule)});
    const transaction = new Transaction(aptosConfig);
    const rawTxn = transaction.build.simple({
        sender: sender,
        withFeePayer: withFeePayer,
        data: {
            function: dataP.function,
            typeArguments: dataP.tyArg || dataP.typeArguments || dataP.type_arguments,
            functionArguments: dataP.arguments || dataP.functionArguments,
        },
        options: {
            maxGasAmount: Number(maxGasAmount),
            gasUnitPrice: Number(gasUnitPrice),
            expireTimestamp: Number(expirationTimestampSecs),
            chainId: Number(chainId),
            accountSequenceNumber: Number(sequenceNumber),
        },
    }).then(rawTx => {
        const signedTx = generateSignedTransactionForSimulation({
            transaction: rawTx,
            signerPublicKey: signerPublicKey,
        });
        return base.toHex(signedTx);
    });
    return rawTxn;
}

export async function signMessage(message: string, privateKey: string): Promise<string> {
    const textEncoder = new TextEncoder();
    const signingMessage = Buffer.from(textEncoder.encode(message))
    const accountFrom = AptosAccount.fromPrivateKey(HexString.ensure(privateKey));
    const sigHexStr = accountFrom.signBuffer(signingMessage);
    return Promise.resolve(sigHexStr.hex())
}

export function validSignedTransaction(tx: string, skipCheckSig: boolean) {
    const transaction = SignedTransaction.deserialize(new Deserializer(base.fromHex(tx)));
    const auth = transaction.authenticator as TransactionAuthenticatorEd25519
    const publicKey = auth.public_key.value
    const signature = auth.signature.value
    const hash = TransactionBuilder.getSigningMessage(transaction.raw_txn)
    if (!skipCheckSig && !signUtil.ed25519.verify(hash, signature, publicKey)) {
        throw Error("signature error")
    }
    return transaction;
}

const PrivateKeyEd25519Prefix = "ed25519-priv-"
const PrivateKeySecp256k1Prefix = "secp256k1-priv-"
export function checkPrivateKey(privateKey:string):boolean {
    if(privateKey.startsWith(PrivateKeySecp256k1Prefix)){
        return false;
    }
    return base.validateHexString(stripPrivateKeyPrefix(privateKey));
}
export function stripPrivateKeyPrefix(privateKey:string):string{
    if(privateKey.startsWith(PrivateKeyEd25519Prefix)){
        return privateKey.replace(PrivateKeyEd25519Prefix, "")
    } else {
        return privateKey
    }
}