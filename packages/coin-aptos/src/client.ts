import { HexString, MaybeHexString } from './hex_string';
import { AptosAccount } from './aptos_account';

import {
    TxnBuilderTypes,
    TransactionBuilderEd25519,
    BCS, buildRawTransactionByABI, ABIBuilderConfig, TransactionBuilder, fetchABI, TransactionBuilderABI,
} from './transaction_builder';
import {
    AccountAddress,
    ModuleId,
    RawTransaction,
    SignedTransaction, StructTag,
    TransactionAuthenticatorEd25519,
    TransactionPayload, TypeTag, TypeTagParser,
} from './transaction_builder/aptos_types';
import {AnyNumber, bcsToBytes, Deserializer, Uint64, Uint8} from './transaction_builder/bcs';
import {EntryFunctionId, MoveModuleBytecode, MoveType} from './transaction_builder/move_types';
import { base, signUtil } from '@okxweb3/crypto-lib';
import {ArgumentABI, EntryFunctionABI, TypeArgumentABI} from "./transaction_builder/aptos_types/abi";
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
  return  new TxnBuilderTypes.TransactionPayloadEntryFunction(
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
export function offerNFTTokenPayload( receiver: HexString,
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

export function offerNFTTokenPayloadObject( nftObject: HexString,
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

export function createRawTransactionByABI(sender: HexString,
                                     sequenceNumber: Uint64,
                                     chainId: Uint8,
                                     maxGasAmount: Uint64,
                                     gasUnitPrice: Uint64,
                                     expirationTimestampSecs: Uint64,
                                     callData: string,
                                     moduleAbi: string) {
  const builderConfig: ABIBuilderConfig =  {
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
    data.type_arguments,
    data.arguments
  );
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
  if(!skipCheckSig && !signUtil.ed25519.verify(hash, signature, publicKey)) {
    throw Error("signature error")
  }
  return transaction;
}

