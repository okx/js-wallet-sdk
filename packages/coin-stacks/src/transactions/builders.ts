/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 Blockstack Inc.
 * https://github.com/hirosystems/stacks.js/blob/main/LICENSE
 * */

import { bytesToHex, hexToBytes, IntegerType, intToBigInt } from '../common';
import {
  StacksNetwork,
  StacksMainnet,
  StacksNetworkName,
  StacksTestnet,
} from '../network';
import { c32address } from '../c32check';
import {
  Authorization,
  createMultiSigSpendingCondition,
  createSingleSigSpendingCondition,
  createSponsoredAuth,
  createStandardAuth,
  SpendingCondition,
  MultiSigSpendingCondition,
} from './authorization';
import { ClarityValue, deserializeCV, NoneCV, PrincipalCV, serializeCV } from './clarity';
import {
  AddressHashMode,
  AddressVersion,
  AnchorMode,
  FungibleConditionCode,
  NonFungibleConditionCode,
  PayloadType,
  PostConditionMode,
  SingleSigHashMode,
  TransactionVersion,
  TxRejectedReason,
  RECOVERABLE_ECDSA_SIG_LENGTH_BYTES,
  StacksMessageType,
  ClarityVersion,
  AnchorModeName,
} from './constants';
import { ClarityAbi, validateContractCall } from './contract-abi';
import { NoEstimateAvailableError } from './errors';
import {
  createStacksPrivateKey,
  createStacksPublicKey,
  getPublicKey,
  pubKeyfromPrivKey,
  publicKeyFromBytes,
  publicKeyToAddress,
  publicKeyToString,
} from './keys';
import {
  createContractCallPayload,
  createSmartContractPayload,
  createTokenTransferPayload,
  Payload,
  serializePayload,
} from './payload';
import {
  createFungiblePostCondition,
  createNonFungiblePostCondition,
  createSTXPostCondition,
} from './postcondition';
import {
  AssetInfo,
  createContractPrincipal,
  createStandardPrincipal,
  FungiblePostCondition,
  NonFungiblePostCondition,
  PostCondition,
  STXPostCondition,
} from './postcondition-types';
import { TransactionSigner } from './signer';
import { StacksTransaction } from './transaction';
import { createLPList } from './types';
import { cvToHex, omit, parseReadOnlyResponse, validateTxId } from './utils';

export type SerializationRejection = {
  error: string;
  reason: TxRejectedReason.Serialization;
  reason_data: {
    message: string;
  };
  txid: string;
};

export type DeserializationRejection = {
  error: string;
  reason: TxRejectedReason.Deserialization;
  reason_data: {
    message: string;
  };
  txid: string;
};

export type SignatureValidationRejection = {
  error: string;
  reason: TxRejectedReason.SignatureValidation;
  reason_data: {
    message: string;
  };
  txid: string;
};

export type BadNonceRejection = {
  error: string;
  reason: TxRejectedReason.BadNonce;
  reason_data: {
    expected: number;
    actual: number;
    is_origin: boolean;
    principal: boolean;
  };
  txid: string;
};

export type FeeTooLowRejection = {
  error: string;
  reason: TxRejectedReason.FeeTooLow;
  reason_data: {
    expected: number;
    actual: number;
  };
  txid: string;
};

export type NotEnoughFundsRejection = {
  error: string;
  reason: TxRejectedReason.NotEnoughFunds;
  reason_data: {
    expected: string;
    actual: string;
  };
  txid: string;
};

export type NoSuchContractRejection = {
  error: string;
  reason: TxRejectedReason.NoSuchContract;
  reason_data?: undefined;
  txid: string;
};

export type NoSuchPublicFunctionRejection = {
  error: string;
  reason: TxRejectedReason.NoSuchPublicFunction;
  reason_data?: undefined;
  txid: string;
};

export type BadFunctionArgumentRejection = {
  error: string;
  reason: TxRejectedReason.BadFunctionArgument;
  reason_data: {
    message: string;
  };
  txid: string;
};

export type ContractAlreadyExistsRejection = {
  error: string;
  reason: TxRejectedReason.ContractAlreadyExists;
  reason_data: {
    contract_identifier: string;
  };
  txid: string;
};

export type PoisonMicroblocksDoNotConflictRejection = {
  error: string;
  reason: TxRejectedReason.PoisonMicroblocksDoNotConflict;
  reason_data?: undefined;
  txid: string;
};

export type PoisonMicroblockHasUnknownPubKeyHashRejection = {
  error: string;
  reason: TxRejectedReason.PoisonMicroblockHasUnknownPubKeyHash;
  reason_data?: undefined;
  txid: string;
};

export type PoisonMicroblockIsInvalidRejection = {
  error: string;
  reason: TxRejectedReason.PoisonMicroblockIsInvalid;
  reason_data?: undefined;
  txid: string;
};

export type BadAddressVersionByteRejection = {
  error: string;
  reason: TxRejectedReason.BadAddressVersionByte;
  reason_data?: undefined;
  txid: string;
};

export type NoCoinbaseViaMempoolRejection = {
  error: string;
  reason: TxRejectedReason.NoCoinbaseViaMempool;
  reason_data?: undefined;
  txid: string;
};

export type ServerFailureNoSuchChainTipRejection = {
  error: string;
  reason: TxRejectedReason.ServerFailureNoSuchChainTip;
  reason_data?: undefined;
  txid: string;
};

export type ServerFailureDatabaseRejection = {
  error: string;
  reason: TxRejectedReason.ServerFailureDatabase;
  reason_data: {
    message: string;
  };
  txid: string;
};

export type ServerFailureOtherRejection = {
  error: string;
  reason: TxRejectedReason.ServerFailureOther;
  reason_data: {
    message: string;
  };
  txid: string;
};

export type TxBroadcastResultOk = {
  txid: string;
  error?: undefined;
  reason?: undefined;
  reason_data?: undefined;
};

export type TxBroadcastResultRejected =
  | SerializationRejection
  | DeserializationRejection
  | SignatureValidationRejection
  | BadNonceRejection
  | FeeTooLowRejection
  | NotEnoughFundsRejection
  | NoSuchContractRejection
  | NoSuchPublicFunctionRejection
  | BadFunctionArgumentRejection
  | ContractAlreadyExistsRejection
  | PoisonMicroblocksDoNotConflictRejection
  | PoisonMicroblockHasUnknownPubKeyHashRejection
  | PoisonMicroblockIsInvalidRejection
  | BadAddressVersionByteRejection
  | NoCoinbaseViaMempoolRejection
  | ServerFailureNoSuchChainTipRejection
  | ServerFailureDatabaseRejection
  | ServerFailureOtherRejection;

export type TxBroadcastResult = TxBroadcastResultOk | TxBroadcastResultRejected;



function deriveNetwork(transaction: StacksTransaction) {
  switch (transaction.version) {
    case TransactionVersion.Mainnet:
      return new StacksMainnet();
    case TransactionVersion.Testnet:
      return new StacksTestnet();
  }
}

export interface MultiSigOptions {
  numSignatures: number;
  publicKeys: string[];
  signerKeys?: string[];
}

/**
 * STX token transfer transaction options
 */
export interface TokenTransferOptions {
  /** the address of the recipient of the token transfer */
  recipient: string | PrincipalCV;
  /** the amount to be transfered in microstacks */
  amount: IntegerType;
  /** the transaction fee in microstacks */
  fee?: IntegerType;
  /** the transaction nonce, which must be increased monotonically with each new transaction */
  nonce?: IntegerType;
  /** the network that the transaction will ultimately be broadcast to */
  network?: StacksNetworkName | StacksNetwork;
  /** the transaction anchorMode, which specifies whether it should be
   * included in an anchor block or a microblock */
  anchorMode: AnchorModeName | AnchorMode;
  /** an arbitrary string to include in the transaction, must be less than 34 bytes */
  memo?: string;
  /** the post condition mode, specifying whether or not post-conditions must fully cover all
   * transfered assets */
  postConditionMode?: PostConditionMode;
  /** a list of post conditions to add to the transaction */
  postConditions?: PostCondition[];
  /** set to true if another account is sponsoring the transaction (covering the transaction fee) */
  sponsored?: boolean;
}

export interface UnsignedTokenTransferOptions extends TokenTransferOptions {
  publicKey: string;
}

export interface SignedTokenTransferOptions extends TokenTransferOptions {
  senderKey: string;
}

export interface UnsignedMultiSigTokenTransferOptions extends TokenTransferOptions {
  numSignatures: number;
  publicKeys: string[];
}

export interface SignedMultiSigTokenTransferOptions extends TokenTransferOptions {
  numSignatures: number;
  publicKeys: string[];
  signerKeys: string[];
}

/**
 * Contract deploy transaction options
 */
export interface BaseContractDeployOptions {
  clarityVersion?: ClarityVersion;
  contractName: string;
  /** the Clarity code to be deployed */
  codeBody: string;
  /** transaction fee in microstacks */
  fee?: IntegerType;
  /** the transaction nonce, which must be increased monotonically with each new transaction */
  nonce?: IntegerType;
  /** the network that the transaction will ultimately be broadcast to */
  network?: StacksNetworkName | StacksNetwork;
  /** the transaction anchorMode, which specifies whether it should be
   * included in an anchor block or a microblock */
  anchorMode: AnchorModeName | AnchorMode;
  /** the post condition mode, specifying whether or not post-conditions must fully cover all
   * transfered assets */
  postConditionMode?: PostConditionMode;
  /** a list of post conditions to add to the transaction */
  postConditions?: PostCondition[];
  /** set to true if another account is sponsoring the transaction (covering the transaction fee) */
  sponsored?: boolean;
}

export interface ContractDeployOptions extends BaseContractDeployOptions {
  /** a hex string of the private key of the transaction sender */
  senderKey: string;
}

export interface UnsignedContractDeployOptions extends BaseContractDeployOptions {
  /** a hex string of the public key of the transaction sender */
  publicKey: string;
}

/**
 * Contract function call transaction options
 */
export interface ContractCallOptions {
  /** the Stacks address of the contract */
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: ClarityValue[];
  /** transaction fee in microstacks */
  fee?: IntegerType;
  feeEstimateApiUrl?: string;
  /** the transaction nonce, which must be increased monotonically with each new transaction */
  nonce?: IntegerType;
  /** the Stacks blockchain network that will ultimately be used to broadcast this transaction */
  network?: StacksNetworkName | StacksNetwork;
  /** the transaction anchorMode, which specifies whether it should be
   * included in an anchor block or a microblock */
  anchorMode: AnchorModeName | AnchorMode;
  /** the post condition mode, specifying whether or not post-conditions must fully cover all
   * transfered assets */
  postConditionMode?: PostConditionMode;
  /** a list of post conditions to add to the transaction */
  postConditions?: PostCondition[];
  /** set to true to validate that the supplied function args match those specified in
   * the published contract */
  validateWithAbi?: boolean | ClarityAbi;
  /** set to true if another account is sponsoring the transaction (covering the transaction fee) */
  sponsored?: boolean;
}

export interface UnsignedContractCallOptions extends ContractCallOptions {
  publicKey: string;
}

export interface SignedContractCallOptions extends ContractCallOptions {
  senderKey: string;
}

export interface UnsignedMultiSigContractCallOptions extends ContractCallOptions {
  numSignatures: number;
  publicKeys: string[];
}

export interface SignedMultiSigContractCallOptions extends ContractCallOptions {
  numSignatures: number;
  publicKeys: string[];
  signerKeys: string[];
}

/**
 * Generates an unsigned Clarity smart contract function call transaction
 *
 * @param {UnsignedContractCallOptions | UnsignedMultiSigContractCallOptions} txOptions - an options object for the contract call
 *
 * @returns {Promise<StacksTransaction>}
 */
export async function makeUnsignedContractCall(
  txOptions: UnsignedContractCallOptions | UnsignedMultiSigContractCallOptions
): Promise<StacksTransaction> {
  const defaultOptions = {
    fee: BigInt(0),
    nonce: BigInt(0),
    network: new StacksMainnet(),
    postConditionMode: PostConditionMode.Deny,
    sponsored: false,
  };

  const options = Object.assign(defaultOptions, txOptions);

  const payload = createContractCallPayload(
    options.contractAddress,
    options.contractName,
    options.functionName,
    options.functionArgs
  );


  let spendingCondition: SpendingCondition | null = null;
  let authorization: Authorization | null = null;

  if ('publicKey' in options) {
    // single-sig
    spendingCondition = createSingleSigSpendingCondition(
      AddressHashMode.SerializeP2PKH,
      options.publicKey,
      options.nonce,
      options.fee
    );
  } else {
    // multi-sig
    spendingCondition = createMultiSigSpendingCondition(
      AddressHashMode.SerializeP2SH,
      options.numSignatures,
      options.publicKeys,
      options.nonce,
      options.fee
    );
  }

  if (options.sponsored) {
    authorization = createSponsoredAuth(spendingCondition);
  } else {
    authorization = createStandardAuth(spendingCondition);
  }

  const network = StacksNetwork.fromNameOrNetwork(options.network);

  const postConditions: PostCondition[] = [];
  if (options.postConditions && options.postConditions.length > 0) {
    options.postConditions.forEach(postCondition => {
      postConditions.push(postCondition);
    });
  }

  const lpPostConditions = createLPList(postConditions);
  const transaction = new StacksTransaction(
    network.version,
    authorization,
    payload,
    lpPostConditions,
    options.postConditionMode,
    options.anchorMode,
    network.chainId
  );


  return transaction;
}

/**
 * Generates a Clarity smart contract function call transaction
 *
 * @param {SignedContractCallOptions | SignedMultiSigContractCallOptions} txOptions - an options object for the contract function call
 *
 * Returns a signed Stacks smart contract function call transaction.
 *
 * @return {StacksTransaction}
 */
export async function makeContractCall(
  txOptions: SignedContractCallOptions | SignedMultiSigContractCallOptions
): Promise<StacksTransaction> {
  if ('senderKey' in txOptions) {
    const publicKey = publicKeyToString(getPublicKey(createStacksPrivateKey(txOptions.senderKey)));
    const options = omit(txOptions, 'senderKey');
    const transaction = await makeUnsignedContractCall({ publicKey, ...options });

    const privKey = createStacksPrivateKey(txOptions.senderKey);
    const signer = new TransactionSigner(transaction);
    signer.signOrigin(privKey);

    return transaction;
  } else {
    const options = omit(txOptions, 'signerKeys');
    const transaction = await makeUnsignedContractCall(options);

    const signer = new TransactionSigner(transaction);
    let pubKeys = txOptions.publicKeys;
    for (const key of txOptions.signerKeys) {
      const pubKey = pubKeyfromPrivKey(key);
      pubKeys = pubKeys.filter(pk => pk !== bytesToHex(pubKey.data));
      signer.signOrigin(createStacksPrivateKey(key));
    }

    for (const key of pubKeys) {
      signer.appendOrigin(publicKeyFromBytes(hexToBytes(key)));
    }

    return transaction;
  }
}

/**
 * Generates a STX post condition with a standard principal
 *
 * Returns a STX post condition object
 *
 * @param address - the c32check address
 * @param conditionCode - the condition code
 * @param amount - the amount of STX tokens (denoted in micro-STX)
 */
export function makeStandardSTXPostCondition(
  address: string,
  conditionCode: FungibleConditionCode,
  amount: IntegerType
): STXPostCondition {
  return createSTXPostCondition(createStandardPrincipal(address), conditionCode, amount);
}

/**
 * Generates a STX post condition with a contract principal
 *
 * Returns a STX post condition object
 *
 * @param address - the c32check address of the contract
 * @param contractName - the name of the contract
 * @param conditionCode - the condition code
 * @param amount - the amount of STX tokens (denoted in micro-STX)
 *
 * @return {STXPostCondition}
 */
export function makeContractSTXPostCondition(
  address: string,
  contractName: string,
  conditionCode: FungibleConditionCode,
  amount: IntegerType
): STXPostCondition {
  return createSTXPostCondition(
    createContractPrincipal(address, contractName),
    conditionCode,
    amount
  );
}

/**
 * Generates a fungible token post condition with a standard principal
 *
 * Returns a fungible token post condition object
 *
 * @param address - the c32check address
 * @param conditionCode - the condition code
 * @param amount - the amount of fungible tokens (in their respective base unit)
 * @param assetInfo - asset info describing the fungible token
 */
export function makeStandardFungiblePostCondition(
  address: string,
  conditionCode: FungibleConditionCode,
  amount: IntegerType,
  assetInfo: string | AssetInfo
): FungiblePostCondition {
  return createFungiblePostCondition(
    createStandardPrincipal(address),
    conditionCode,
    amount,
    assetInfo
  );
}

/**
 * Generates a fungible token post condition with a contract principal
 *
 * Returns a fungible token post condition object
 *
 * @param address - the c32check address
 * @param contractName - the name of the contract
 * @param conditionCode - the condition code
 * @param amount - the amount of fungible tokens (in their respective base unit)
 * @param assetInfo - asset info describing the fungible token
 */
export function makeContractFungiblePostCondition(
  address: string,
  contractName: string,
  conditionCode: FungibleConditionCode,
  amount: IntegerType,
  assetInfo: string | AssetInfo
): FungiblePostCondition {
  return createFungiblePostCondition(
    createContractPrincipal(address, contractName),
    conditionCode,
    amount,
    assetInfo
  );
}

/**
 * Generates a non-fungible token post condition with a standard principal
 *
 * Returns a non-fungible token post condition object
 *
 * @param {String} address - the c32check address
 * @param {FungibleConditionCode} conditionCode - the condition code
 * @param {AssetInfo} assetInfo - asset info describing the non-fungible token
 * @param {ClarityValue} assetId - asset identifier of the nft instance (typically a uint/buffer/string)
 *
 * @return {NonFungiblePostCondition}
 */
export function makeStandardNonFungiblePostCondition(
  address: string,
  conditionCode: NonFungibleConditionCode,
  assetInfo: string | AssetInfo,
  assetId: ClarityValue
): NonFungiblePostCondition {
  return createNonFungiblePostCondition(
    createStandardPrincipal(address),
    conditionCode,
    assetInfo,
    assetId
  );
}

/**
 * Generates a non-fungible token post condition with a contract principal
 *
 * Returns a non-fungible token post condition object
 *
 * @param {String} address - the c32check address
 * @param {String} contractName - the name of the contract
 * @param {FungibleConditionCode} conditionCode - the condition code
 * @param {AssetInfo} assetInfo - asset info describing the non-fungible token
 * @param {ClarityValue} assetId - asset identifier of the nft instance (typically a uint/buffer/string)
 *
 * @return {NonFungiblePostCondition}
 */
export function makeContractNonFungiblePostCondition(
  address: string,
  contractName: string,
  conditionCode: NonFungibleConditionCode,
  assetInfo: string | AssetInfo,
  assetId: ClarityValue
): NonFungiblePostCondition {
  return createNonFungiblePostCondition(
    createContractPrincipal(address, contractName),
    conditionCode,
    assetInfo,
    assetId
  );
}

/**
 * Read only function options
 *
 * @param {String} contractAddress - the c32check address of the contract
 * @param {String} contractName - the contract name
 * @param {String} functionName - name of the function to be called
 * @param {[ClarityValue]} functionArgs - an array of Clarity values as arguments to the function call
 * @param {StacksNetwork} network - the Stacks blockchain network this transaction is destined for
 * @param {String} senderAddress - the c32check address of the sender
 */

export interface ReadOnlyFunctionOptions {
  contractName: string;
  contractAddress: string;
  functionName: string;
  functionArgs: ClarityValue[];
  /** the network that the contract which contains the function is deployed to */
  network?: StacksNetworkName | StacksNetwork;
  /** address of the sender */
  senderAddress: string;
}

export interface GetContractMapEntryOptions {
  /** the contracts address */
  contractAddress: string;
  /** the contracts name */
  contractName: string;
  /** the map name */
  mapName: string;
  /** key to lookup in the map */
  mapKey: ClarityValue;
  /** the network that has the contract */
  network?: StacksNetworkName | StacksNetwork;
}

/**
 * Sponsored transaction options
 */
export interface SponsorOptionsOpts {
  /** the origin-signed transaction */
  transaction: StacksTransaction;
  /** the sponsor's private key */
  sponsorPrivateKey: string;
  /** the transaction fee amount to sponsor */
  fee?: IntegerType;
  /** the nonce of the sponsor account */
  sponsorNonce?: IntegerType;
  /** the hashmode of the sponsor's address */
  sponsorAddressHashmode?: AddressHashMode;
  /** the Stacks blockchain network that this transaction will ultimately be broadcast to */
  network?: StacksNetworkName | StacksNetwork;
}

/**
 * Estimates transaction byte length
 * Context:
 * 1) Multi-sig transaction byte length increases by adding signatures
 *    which causes the incorrect fee estimation because the fee value is set while creating unsigned transaction
 * 2) Single-sig transaction byte length remain same due to empty message signature which allocates the space for signature
 * @param {transaction} - StacksTransaction object to be estimated
 * @return {number} Estimated transaction byte length
 */
export function estimateTransactionByteLength(transaction: StacksTransaction): number {
  const hashMode = transaction.auth.spendingCondition.hashMode;
  // List of Multi-sig transaction hash modes
  const multiSigHashModes = [AddressHashMode.SerializeP2SH, AddressHashMode.SerializeP2WSH];

  // Check if its a Multi-sig transaction
  if (multiSigHashModes.includes(hashMode)) {
    const multiSigSpendingCondition: MultiSigSpendingCondition = transaction.auth
      .spendingCondition as MultiSigSpendingCondition;

    // Find number of existing signatures if the transaction is signed or partially signed
    const existingSignatures = multiSigSpendingCondition.fields.filter(
      field => field.contents.type === StacksMessageType.MessageSignature
    ).length; // existingSignatures will be 0 if its a unsigned transaction

    // Estimate total signature bytes size required for this multi-sig transaction
    // Formula: totalSignatureLength = (signaturesRequired - existingSignatures) * (SIG_LEN_BYTES + 1 byte of type of signature)
    const totalSignatureLength =
      (multiSigSpendingCondition.signaturesRequired - existingSignatures) *
      (RECOVERABLE_ECDSA_SIG_LENGTH_BYTES + 1);

    return transaction.serialize().byteLength + totalSignatureLength;
  } else {
    // Single-sig transaction
    // Signature space already allocated by empty message signature
    return transaction.serialize().byteLength;
  }
}


export async function makeUnsignedContractDeploy(
    txOptions: UnsignedContractDeployOptions
): Promise<StacksTransaction> {
  const defaultOptions = {
    fee: BigInt(0),
    nonce: BigInt(0),
    network: new StacksMainnet(),
    postConditionMode: PostConditionMode.Deny,
    sponsored: false,
    clarityVersion: ClarityVersion.Clarity2,
  };

  const options = Object.assign(defaultOptions, txOptions);

  const payload = createSmartContractPayload(
      options.contractName,
      options.codeBody,
      options.clarityVersion
  );

  const addressHashMode = AddressHashMode.SerializeP2PKH;
  const pubKey = createStacksPublicKey(options.publicKey);

  let authorization: Authorization | null = null;

  const spendingCondition = createSingleSigSpendingCondition(
      addressHashMode,
      publicKeyToString(pubKey),
      options.nonce,
      options.fee
  );

  if (options.sponsored) {
    authorization = createSponsoredAuth(spendingCondition);
  } else {
    authorization = createStandardAuth(spendingCondition);
  }

  const network = StacksNetwork.fromNameOrNetwork(options.network);

  const postConditions: PostCondition[] = [];
  if (options.postConditions && options.postConditions.length > 0) {
    options.postConditions.forEach(postCondition => {
      postConditions.push(postCondition);
    });
  }
  const lpPostConditions = createLPList(postConditions);

  const transaction = new StacksTransaction(
      network.version,
      authorization,
      payload,
      lpPostConditions,
      options.postConditionMode,
      options.anchorMode,
      network.chainId
  );

  return transaction;
}

export async function makeContractDeploy(
    txOptions: ContractDeployOptions
): Promise<StacksTransaction> {
  const privKey = createStacksPrivateKey(txOptions.senderKey);
  const stacksPublicKey = getPublicKey(privKey);
  const publicKey = publicKeyToString(stacksPublicKey);
  const unsignedTxOptions: UnsignedContractDeployOptions = { ...txOptions, publicKey };
  const transaction: StacksTransaction = await makeUnsignedContractDeploy(unsignedTxOptions);

  if (txOptions.senderKey) {
    const signer = new TransactionSigner(transaction);
    signer.signOrigin(privKey);
  }

  return transaction;
}