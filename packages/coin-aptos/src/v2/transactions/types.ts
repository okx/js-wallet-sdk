// Copyright © Aptos Foundation
// SPDX-License-Identifier: Apache-2.0

import { AptosConfig } from "../api/aptosConfig";
import { MoveOption, MoveString, MoveVector } from "../bcs/serializable/moveStructs";
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
import { AnyNumber, HexInput, MoveFunctionGenericTypeParam, MoveFunctionId } from "../types";
import { TypeTag } from "./typeTag";
import { AccountAuthenticator } from "./authenticator/account";
import { SimpleTransaction } from "./instances/simpleTransaction";
import { MultiAgentTransaction } from "./instances/multiAgentTransaction";

/**
 * Entry function arguments to be used when building a raw transaction using remote ABI
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
 * Entry function arguments to be used when building a raw transaction using BCS serialized arguments
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
 * Script function arguments to be used when building a raw transaction using BCS serialized arguments
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
    | MoveVector<U8>
    | MoveString
    | FixedBytes;

/**
 * Type that holds all raw transaction instances Aptos SDK supports
 */
export type AnyRawTransactionInstance = RawTransaction | MultiAgentRawTransaction | FeePayerRawTransaction;

// TRANSACTION GENERATION TYPES //

/**
 * Optional options to set when generating a transaction
 */
export type InputGenerateTransactionOptions = {
    maxGasAmount?: number;
    gasUnitPrice?: number;
    expireTimestamp?: number;
    accountSequenceNumber?: AnyNumber;
    chainId?: number;
};

/**
 * The generated transaction payload type that was produces from `generateTransactionPayload()` function.
 */
export type AnyTransactionPayloadInstance =
    | TransactionPayloadEntryFunction
    | TransactionPayloadScript
    | TransactionPayloadMultiSig;

/**
 * Unified type for the data needed to generate a transaction payload of types:
 * Entry Function | Script | Multi Sig
 */
export type InputGenerateTransactionPayloadData = InputEntryFunctionData | InputScriptData | InputMultiSigData;

export type InputGenerateTransactionPayloadDataWithRemoteABI =
    | InputScriptData
    | InputEntryFunctionDataWithRemoteABI
    | InputMultiSigDataWithRemoteABI;

/**
 * The data needed to generate an Entry Function payload
 */
export type InputEntryFunctionData = {
    function: MoveFunctionId;
    typeArguments?: Array<TypeTag | string>;
    functionArguments: Array<EntryFunctionArgumentTypes | SimpleEntryFunctionArgumentTypes>;
    abi?: EntryFunctionABI;
};

export type InputGenerateTransactionPayloadDataWithABI = InputEntryFunctionDataWithABI | InputMultiSigDataWithABI;

export type InputEntryFunctionDataWithABI = Omit<InputEntryFunctionData, "abi"> & {
    abi: EntryFunctionABI;
};

export type InputMultiSigDataWithABI = {
    multisigAddress: AccountAddressInput;
} & InputEntryFunctionDataWithABI;

export type InputEntryFunctionDataWithRemoteABI = InputEntryFunctionData & { aptosConfig: AptosConfig };
/**
 * The data needed to generate a Multi Sig payload
 */
export type InputMultiSigData = {
    multisigAddress: AccountAddressInput;
} & InputEntryFunctionData;

/**
 * The data needed to generate a Multi Sig payload
 */
export type InputMultiSigDataWithRemoteABI = {
    multisigAddress: AccountAddressInput;
} & InputEntryFunctionDataWithRemoteABI;

/**
 * The data needed to generate a Script payload
 */
export type InputScriptData = {
    bytecode: HexInput;
    typeArguments?: Array<TypeTag>;
    functionArguments: Array<ScriptFunctionArgumentTypes>;
};

/**
 * The data needed to generate a View Function payload
 */
export type InputViewFunctionData = {
    function: MoveFunctionId;
    typeArguments?: Array<TypeTag | string>;
    functionArguments?: Array<EntryFunctionArgumentTypes | SimpleEntryFunctionArgumentTypes>;
    abi?: ViewFunctionABI;
};

/**
 * Data needed to generate a view function payload and fetch the remote ABI
 */
export type InputViewFunctionDataWithRemoteABI = InputViewFunctionData & { aptosConfig: AptosConfig };

/**
 * Data needed to generate a view function, with an already fetched ABI
 */
export type InputViewFunctionDataWithABI = InputViewFunctionData & { abi: ViewFunctionABI };

/**
 * Data need for a generic function ABI, both view and entry
 */
export type FunctionABI = {
    typeParameters: Array<MoveFunctionGenericTypeParam>;
    parameters: Array<TypeTag>;
};

/**
 * Interface of an Entry function's ABI.
 *
 * This is used to provide type checking and simple input conversion on ABI based transaction submission.
 */
export type EntryFunctionABI = FunctionABI & {
    signers?: number;
};

/**
 * Interface of an View function's ABI.
 *
 * This is used to provide type checking and simple input conversion on ABI based transaction submission.
 */
export type ViewFunctionABI = FunctionABI & {
    returnTypes: Array<TypeTag>;
};

/**
 * Interface of the arguments to generate a single signer transaction.
 * Used to provide to `generateTransaction()` method in the transaction builder flow
 */
export interface InputGenerateSingleSignerRawTransactionArgs {
    aptosConfig: AptosConfig;
    sender: AccountAddressInput;
    payload: AnyTransactionPayloadInstance;
    options?: InputGenerateTransactionOptions;
    feePayerAddress?: AccountAddressInput;
}

/**
 * Interface of the arguments to generate a multi-agent transaction.
 * Used to provide to `generateTransaction()` method in the transaction builder flow
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
 * Unified type that holds all the interfaces to generate different transaction types
 */
export type InputGenerateRawTransactionArgs =
    | InputGenerateSingleSignerRawTransactionArgs
    | InputGenerateMultiAgentRawTransactionArgs;

/**
 * Unified type that holds all the return interfaces when generating different transaction types
 */
export type AnyRawTransaction = SimpleTransaction | MultiAgentTransaction;

// TRANSACTION SIMULATION TYPES //

export type InputSimulateTransactionData = {
    /**
     * The transaction to simulate, probably generated by `generateTransaction()`
     */
    transaction: AnyRawTransaction;
    /**
     * For a single signer transaction
     */
    signerPublicKey: PublicKey;
    /**
     * For a fee payer or multi-agent transaction that requires additional signers in
     */
    secondarySignersPublicKeys?: Array<PublicKey>;
    /**
     * For a fee payer transaction (aka Sponsored Transaction)
     */
    feePayerPublicKey?: PublicKey;
    options?: InputSimulateTransactionOptions;
};

export type InputSimulateTransactionOptions = {
    estimateGasUnitPrice?: boolean;
    estimateMaxGasAmount?: boolean;
    estimatePrioritizedGasUnitPrice?: boolean;
};

// USER INPUT TYPES //

/**
 * Interface that holds the user data input when generating a single signer transaction
 */
export interface InputGenerateSingleSignerRawTransactionData {
    sender: AccountAddressInput;
    data: InputGenerateTransactionPayloadData;
    options?: InputGenerateTransactionOptions;
    withFeePayer?: boolean;
    secondarySignerAddresses?: undefined;
}

/**
 * Interface that holds the user data input when generating a multi-agent transaction
 */
export interface InputGenerateMultiAgentRawTransactionData {
    sender: AccountAddressInput;
    data: InputGenerateTransactionPayloadData;
    secondarySignerAddresses: AccountAddressInput[];
    options?: InputGenerateTransactionOptions;
    withFeePayer?: boolean;
}

/**
 * Unified type that holds all the user data input interfaces when generating different transaction types
 */
export type InputGenerateTransactionData =
    | InputGenerateSingleSignerRawTransactionData
    | InputGenerateMultiAgentRawTransactionData;

/**
 * Interface that holds the user data input when submitting a transaction
 */
export interface InputSubmitTransactionData {
    transaction: AnyRawTransaction;
    senderAuthenticator: AccountAuthenticator;
    feePayerAuthenticator?: AccountAuthenticator;
    additionalSignersAuthenticators?: Array<AccountAuthenticator>;
}
