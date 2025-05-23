// Copyright © Aptos Foundation
// SPDX-License-Identifier: Apache-2.0

import { AptosConfig } from "../api/aptosConfig";
import {MoveOption, MoveString, MoveVector, Serialized} from "../bcs/serializable/moveStructs";
import { Bool, U128, U16, U256, U32, U64, U8 } from "../bcs/serializable/movePrimitives";
import { FixedBytes } from "../bcs/serializable/fixedBytes";
import { AccountAddress, AccountAddressInput } from "../core";
import { PublicKey } from "../core/crypto";
import {
    MultiAgentRawTransaction,
    FeePayerRawTransaction,
    RawTransaction,
    TransactionPayloadEntryFunction,
    TransactionPayloadMultiSig,
    TransactionPayloadScript,
} from "./instances";
import {AnyNumber, HexInput, MoveFunctionGenericTypeParam, MoveFunctionId, MoveStructId, MoveValue} from "../types";
import { TypeTag } from "./typeTag";
import { AccountAuthenticator } from "./authenticator/account";
import { SimpleTransaction } from "./instances/simpleTransaction";
import { MultiAgentTransaction } from "./instances/multiAgentTransaction";

/**
 * Entry function arguments for building a raw transaction using remote ABI, supporting various data types including primitives and arrays.
 * @group Implementation
 * @category Transactions
 */
export type SimpleEntryFunctionArgumentTypes =
    | boolean
    | number
    | bigint
    | string
    | null // To support optional empty
    | undefined // To support optional empty
    | Uint8Array
    | ArrayBuffer
    | Array<SimpleEntryFunctionArgumentTypes | EntryFunctionArgumentTypes>;

/**
 * Entry function arguments for building a raw transaction using BCS serialized arguments.
 * @group Implementation
 * @category Transactions
 */
export type EntryFunctionArgumentTypes =
    | Bool
    | U8
    | U16
    | U32
    | U64
    | U128
    | U256
    | AccountAddress
    | MoveVector<EntryFunctionArgumentTypes>
    | MoveOption<EntryFunctionArgumentTypes>
    | MoveString
    | FixedBytes;

/**
 * Script function arguments for building raw transactions using BCS serialized arguments.
 * @group Implementation
 * @category Transactions
 */
export type ScriptFunctionArgumentTypes =
    | Bool
    | U8
    | U16
    | U32
    | U64
    | U128
    | U256
    | AccountAddress
    | MoveVector<ScriptFunctionArgumentTypes>
    | MoveString
    | FixedBytes
    | Serialized;

/**
 * Inputs for Entry functions, view functions, and scripts, which can be a string representation of various types including
 * primitive types, vectors, and structured types.
 *
 *  *
 * This can be a string version of the type argument such as:
 * - u8
 * - u16
 * - u32
 * - u64
 * - u128
 * - u256
 * - bool
 * - address
 * - signer
 * - vector<Type>
 * - address::module::struct
 * - address::module::struct<Type1, Type2>
 * @group Implementation
 * @category Transactions
 */
export type TypeArgument = TypeTag | string;

/**
 * Holds all return interfaces for generating different transaction types.
 * @group Implementation
 * @category Transactions
 */
export type AnyRawTransactionInstance = RawTransaction | MultiAgentRawTransaction | FeePayerRawTransaction;

// TRANSACTION GENERATION TYPES //

/**
 * Optional options to set when generating a transaction, including a maximum gas amount.
 * @group Implementation
 * @category Transactions
 */
export type InputGenerateTransactionOptions = {
    maxGasAmount?: number;
    gasUnitPrice?: number;
    expireTimestamp?: number;
    accountSequenceNumber?: AnyNumber;
    chainId?: number;
};

/**
 * The transaction payload type generated from the `generateTransactionPayload()` function, which can be an entry function,
 * script, or multi-signature payload.
 * @group Implementation
 * @category Transactions
 */
export type AnyTransactionPayloadInstance =
    | TransactionPayloadEntryFunction
    | TransactionPayloadScript
    | TransactionPayloadMultiSig;

/**
 * The data needed to generate a transaction payload for Entry Function, Script, or Multi Sig types.
 * @group Implementation
 * @category Transactions
 */
export type InputGenerateTransactionPayloadData = InputEntryFunctionData | InputScriptData | InputMultiSigData;

/**
 * The payload for generating a transaction, which can be either script data, entry function data with remote ABI, or
 * multi-signature data.
 * @group Implementation
 * @category Transactions
 */
export type InputGenerateTransactionPayloadDataWithRemoteABI =
    | InputScriptData
    | InputEntryFunctionDataWithRemoteABI
    | InputMultiSigDataWithRemoteABI;

/**
 * The data needed to generate an Entry Function payload.
 * @group Implementation
 * @category Transactions
 */
export type InputEntryFunctionData = {
    function: MoveFunctionId;
    typeArguments?: Array<TypeArgument>;
    functionArguments: Array<EntryFunctionArgumentTypes | SimpleEntryFunctionArgumentTypes>;
    abi?: EntryFunctionABI;
};

/**
 * The payload for generating a transaction, which can be either an entry function or a multi-signature transaction.
 * @group Implementation
 * @category Transactions
 */
export type InputGenerateTransactionPayloadDataWithABI = InputEntryFunctionDataWithABI | InputMultiSigDataWithABI;

/**
 * The input data for an entry function, including its associated ABI.
 * @group Implementation
 * @category Transactions
 */
export type InputEntryFunctionDataWithABI = Omit<InputEntryFunctionData, "abi"> & {
    abi: EntryFunctionABI;
};

/**
 * The data needed to generate a Multi Sig payload, including the multisig address.
 * @group Implementation
 * @category Transactions
 */
export type InputMultiSigDataWithABI = {
    multisigAddress: AccountAddressInput;
} & InputEntryFunctionDataWithABI;

/**
 * Combines input function data with Aptos configuration for remote ABI interactions.
 * @group Implementation
 * @category Transactions
 */
export type InputEntryFunctionDataWithRemoteABI = InputEntryFunctionData & { aptosConfig: AptosConfig };

/**
 * The data needed to generate a batched function payload
 */
export type InputBatchedFunctionData = {
    function: MoveFunctionId;
    typeArguments?: Array<TypeArgument>;
    functionArguments: Array<EntryFunctionArgumentTypes | SimpleEntryFunctionArgumentTypes>;
};

/**
 * The data needed to generate a Multi Sig payload
 * @group Implementation
 * @category Transactions
 */
export type InputMultiSigData = {
    multisigAddress: AccountAddressInput;
} & InputEntryFunctionData;

/**
 * The data needed to generate a Multi Sig payload, including the multisig address.
 * @group Implementation
 * @category Transactions
 */
export type InputMultiSigDataWithRemoteABI = {
    multisigAddress: AccountAddressInput;
} & InputEntryFunctionDataWithRemoteABI;

/**
 * The data needed to generate a Script payload.
 * @group Implementation
 * @category Transactions
 */
export type InputScriptData = {
    bytecode: HexInput;
    typeArguments?: Array<TypeArgument>;
    functionArguments: Array<ScriptFunctionArgumentTypes>;
};

/**
 * The data needed to generate a View Function payload.
 * @group Implementation
 * @category Transactions
 */
export type InputViewFunctionData = {
    function: MoveFunctionId;
    typeArguments?: Array<TypeArgument>;
    functionArguments?: Array<EntryFunctionArgumentTypes | SimpleEntryFunctionArgumentTypes>;
    abi?: ViewFunctionABI;
};

/**
 * The data needed to generate a View Function payload in JSON format.
 * @group Implementation
 * @category Transactions
 */
export type InputViewFunctionJsonData = {
    function: MoveFunctionId;
    typeArguments?: Array<MoveStructId>;
    functionArguments?: Array<MoveValue>;
};

/**
 * The payload sent to the fullnode for a JSON view request.
 * @group Implementation
 * @category Transactions
 */
export type ViewFunctionJsonPayload = {
    function: MoveFunctionId;
    typeArguments: Array<MoveStructId>;
    functionArguments: Array<MoveValue>;
};

/**
 * Data required to create a view function payload and retrieve the remote ABI, including Aptos configuration.
 * @group Implementation
 * @category Transactions
 */
export type InputViewFunctionDataWithRemoteABI = InputViewFunctionData & { aptosConfig: AptosConfig };

/**
 * Data needed to generate a view function, including the fetched ABI.
 * @group Implementation
 * @category Transactions
 */
export type InputViewFunctionDataWithABI = InputViewFunctionData & { abi: ViewFunctionABI };

/**
 * Data needed for a generic function ABI, applicable to both view and entry functions.
 * @group Implementation
 * @category Transactions
 */
export type FunctionABI = {
    typeParameters: Array<MoveFunctionGenericTypeParam>;
    parameters: Array<TypeTag>;
};

/**
 * Interface for an Entry function's ABI, enabling type checking and input conversion for ABI-based transaction submissions.
 * @group Implementation
 * @category Transactions
 */
export type EntryFunctionABI = FunctionABI & {
    signers?: number;
};

/**
 * Interface for a view function's ABI, providing type checking and input conversion for ABI-based transaction submissions.
 * @group Implementation
 * @category Transactions
 */
export type ViewFunctionABI = FunctionABI & {
    returnTypes: Array<TypeTag>;
};

/**
 * Arguments for generating a single signer raw transaction, used in the transaction builder flow.
 *
 * @param aptosConfig - Configuration settings for Aptos.
 * @param sender - The address of the sender.
 * @param payload - The transaction payload.
 * @param options - Optional transaction generation options.
 * @param feePayerAddress - Optional address of the fee payer.
 * @group Implementation
 * @category Transactions
 */
export interface InputGenerateSingleSignerRawTransactionArgs {
    aptosConfig: AptosConfig;
    sender: AccountAddressInput;
    payload: AnyTransactionPayloadInstance;
    options?: InputGenerateTransactionOptions;
    feePayerAddress?: AccountAddressInput;
}

/**
 * Arguments for generating a multi-agent transaction, used in the `generateTransaction()` method of the transaction builder flow.
 *
 * @param aptosConfig - Configuration settings for Aptos.
 * @param sender - The address of the transaction sender.
 * @param payload - The transaction payload.
 * @param secondarySignerAddresses - List of secondary signer addresses.
 * @param options - Optional settings for transaction generation.
 * @param feePayerAddress - Optional address of the fee payer.
 * @group Implementation
 * @category Transactions
 */
export interface InputGenerateMultiAgentRawTransactionArgs {
    aptosConfig: AptosConfig;
    sender: AccountAddressInput;
    payload: AnyTransactionPayloadInstance;
    secondarySignerAddresses: AccountAddressInput[];
    options?: InputGenerateTransactionOptions;
    feePayerAddress?: AccountAddressInput;
}

/**
 * A unified type for generating various transaction types.
 * @group Implementation
 * @category Transactions
 */
export type InputGenerateRawTransactionArgs =
    | InputGenerateSingleSignerRawTransactionArgs
    | InputGenerateMultiAgentRawTransactionArgs;

/**
 * Unified type that holds all the return interfaces when generating different transaction types
 * @group Implementation
 * @category Transactions
 */
export type AnyRawTransaction = SimpleTransaction | MultiAgentTransaction;

// TRANSACTION SIMULATION TYPES //

/**
 * The data required to simulate a transaction, typically generated by `generateTransaction()`.
 * @group Implementation
 * @category Transactions
 */
export type InputSimulateTransactionData = {
    /**
     * The transaction to simulate, probably generated by `generateTransaction()`
     * @group Implementation
     * @category Transactions
     */
    transaction: AnyRawTransaction;
    /**
     * For a single signer transaction
     * @group Implementation
     * @category Transactions
     * This is optional and can be undefined to skip the public/auth key check during the transaction simulation.
     */
    signerPublicKey?: PublicKey;
    /**
     * For a fee payer or multi-agent transaction that requires additional signers in
     * @group Implementation
     * @category Transactions
     */
    secondarySignersPublicKeys?: Array<PublicKey | undefined>;
    /**
     * For a fee payer transaction (aka Sponsored Transaction)
     * @group Implementation
     * @category Transactions
     */
    feePayerPublicKey?: PublicKey;
    options?: InputSimulateTransactionOptions;
};

/**
 * Options for simulating a transaction input, including whether to estimate the gas unit price.
 * @group Implementation
 * @category Transactions
 */
export type InputSimulateTransactionOptions = {
    estimateGasUnitPrice?: boolean;
    estimateMaxGasAmount?: boolean;
    estimatePrioritizedGasUnitPrice?: boolean;
};

// USER INPUT TYPES //

/**
 * Holds user input data for generating a single signer transaction.
 *
 * @param sender - The address of the account sending the transaction.
 * @param data - The payload data for the transaction.
 * @param options - Optional transaction options.
 * @param withFeePayer - Indicates if the fee payer is included.
 * @param secondarySignerAddresses - Addresses for any secondary signers (not used in single signer transactions).
 * @group Implementation
 * @category Transactions
 */
export interface InputGenerateSingleSignerRawTransactionData {
    sender: AccountAddressInput;
    data: InputGenerateTransactionPayloadData;
    options?: InputGenerateTransactionOptions;
    withFeePayer?: boolean;
    secondarySignerAddresses?: undefined;
}

/**
 * Holds user data input for generating a multi-agent transaction.
 *
 * @param sender - The address of the primary sender.
 * @param data - The payload data for the transaction.
 * @param secondarySignerAddresses - An array of addresses for secondary signers.
 * @param options - Optional transaction options.
 * @param withFeePayer - Indicates if a fee payer is included.
 * @group Implementation
 * @category Transactions
 */
export interface InputGenerateMultiAgentRawTransactionData {
    sender: AccountAddressInput;
    data: InputGenerateTransactionPayloadData;
    secondarySignerAddresses: AccountAddressInput[];
    options?: InputGenerateTransactionOptions;
    withFeePayer?: boolean;
}

/**
 * Unified type holding user data input interfaces for generating various transaction types.
 * @group Implementation
 * @category Transactions
 */
export type InputGenerateTransactionData =
    | InputGenerateSingleSignerRawTransactionData
    | InputGenerateMultiAgentRawTransactionData;

/**
 * Holds user data input for submitting a transaction.
 *
 * @param transaction - The raw transaction data.
 * @param senderAuthenticator - The authenticator for the sender's account.
 * @param feePayerAuthenticator - Optional authenticator for the fee payer's account.
 * @param additionalSignersAuthenticators - Optional array of authenticators for additional signers.
 * @group Implementation
 * @category Transactions
 */
export interface InputSubmitTransactionData {
    transaction: AnyRawTransaction;
    senderAuthenticator: AccountAuthenticator;
    feePayerAuthenticator?: AccountAuthenticator;
    additionalSignersAuthenticators?: Array<AccountAuthenticator>;
}