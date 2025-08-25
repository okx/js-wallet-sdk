// Copyright © Aptos Foundation
// SPDX-License-Identifier: Apache-2.0
import { Network } from "../utils/apiEndpoints";
import { OrderBy, TokenStandard } from "./indexer";

export * from "./indexer";
export { CallArgument } from "@aptos-labs/script-composer-pack";


export enum MimeType {
  /**
   * JSON representation, used for transaction submission and accept type JSON output
   */
  JSON = "application/json",
  /**
   * BCS representation, used for accept type BCS output
   */
  BCS = "application/x-bcs",
  /**
   * BCS representation, used for transaction submission in BCS input
   */
  BCS_SIGNED_TRANSACTION = "application/x.aptos.signed_transaction+bcs",
}

/**
 * Hex data as input to a function
 */
export type HexInput = string | Uint8Array;

/**
 * TypeTag enum as they are represented in Rust
 * {@link https://github.com/aptos-labs/aptos-core/blob/main/third_party/move/move-core/types/src/language_storage.rs#L27}
 */
export enum TypeTagVariants {
  Bool = 0,
  U8 = 1,
  U64 = 2,
  U128 = 3,
  Address = 4,
  Signer = 5,
  Vector = 6,
  Struct = 7,
  U16 = 8,
  U32 = 9,
  U256 = 10,
  Reference = 254, // This is specifically a placeholder and does not represent a real type
  Generic = 255, // This is specifically a placeholder and does not represent a real type
}

/**
 * Script transaction arguments enum as they are represented in Rust
 * {@link https://github.com/aptos-labs/aptos-core/blob/main/third_party/move/move-core/types/src/transaction_argument.rs#L11}
 */
export enum ScriptTransactionArgumentVariants {
  U8 = 0,
  U64 = 1,
  U128 = 2,
  Address = 3,
  U8Vector = 4,
  Bool = 5,
  U16 = 6,
  U32 = 7,
  U256 = 8,
  Serialized = 9,
}

/**
 * Transaction payload enum as they are represented in Rust
 * {@link https://github.com/aptos-labs/aptos-core/blob/main/types/src/transaction/mod.rs#L478}
 */
export enum TransactionPayloadVariants {
  Script = 0,
  EntryFunction = 2,
  Multisig = 3,
}

/**
 * Transaction variants enum as they are represented in Rust
 * {@link https://github.com/aptos-labs/aptos-core/blob/main/types/src/transaction/mod.rs#L440}
 */
export enum TransactionVariants {
  MultiAgentTransaction = 0,
  FeePayerTransaction = 1,
}

/**
 * Transaction Authenticator enum as they are represented in Rust
 * {@link https://github.com/aptos-labs/aptos-core/blob/main/types/src/transaction/authenticator.rs#L44}
 */
export enum TransactionAuthenticatorVariant {
  Ed25519 = 0,
  MultiEd25519 = 1,
  MultiAgent = 2,
  FeePayer = 3,
  SingleSender = 4,
}

/**
 * Variants of account authenticators used in transactions.
 * {@link https://github.com/aptos-labs/aptos-core/blob/main/types/src/transaction/authenticator.rs#L414}
 */
export enum AccountAuthenticatorVariant {
  Ed25519 = 0,
  MultiEd25519 = 1,
  SingleKey = 2,
  MultiKey = 3,
  NoAccountAuthenticator = 4,
  Abstraction = 5,
}

/**
 * Variants of private keys that can comply with the AIP-80 standard.
 * {@link https://github.com/aptos-foundation/AIPs/blob/main/aips/aip-80.md}
 */
export enum PrivateKeyVariants {
  Ed25519 = "ed25519",
  Secp256k1 = "secp256k1",
}

export enum AnyPublicKeyVariant {
  Ed25519 = 0,
  Secp256k1 = 1,
  Keyless = 3,
  FederatedKeyless = 4,
}

export enum AnySignatureVariant {
  Ed25519 = 0,
  Secp256k1 = 1,
  Keyless = 3,
}

/**
 * BCS types
 */
export type Uint8 = number;
export type Uint16 = number;
export type Uint32 = number;
export type Uint64 = bigint;
export type Uint128 = bigint;
export type Uint256 = bigint;
export type AnyNumber = number | bigint;

export type AptosSettings = {
  readonly network?: Network;

  readonly moveModule?: string;

};

/**
 *
 * Controls the number of results that are returned and the starting position of those results.
 * @param offset parameter specifies the starting position of the query result within the set of data. Default is 0.
 * @param limit specifies the maximum number of items or records to return in a query result. Default is 25.
 */
export interface PaginationArgs {
  offset?: AnyNumber;
  limit?: number;
}

export interface TokenStandardArg {
  tokenStandard?: TokenStandard;
}

export interface OrderByArg<T extends {}> {
  orderBy?: OrderBy<T>;
}

export interface WhereArg<T extends {}> {
  where?: T;
}

/**
 * QUERY TYPES
 */

/**
 * A configuration object we can pass with the request to the server.
 *
 * @param AUTH_TOKEN - an auth token to send with a faucet request
 * @param API_KEY - api key generated from developer portal {@link https://developers.aptoslabs.com/manage/api-keys}}
 * @param HEADERS - extra headers we want to send with the request
 * @param WITH_CREDENTIALS - whether to carry cookies. By default, it is set to true and cookies will be sent
 */
export type ClientConfig = {
  AUTH_TOKEN?: string;
  API_KEY?: string;
  HEADERS?: Record<string, string | number | boolean>;
  WITH_CREDENTIALS?: boolean;
};

export interface ClientRequest<Req> {
  url: string;
  method: "GET" | "POST";
  body?: Req;
  contentType?: string;
  params?: any;
  overrides?: ClientConfig;
  headers?: Record<string, any>;
}

export interface ClientResponse<Res> {
  status: number;
  statusText: string;
  data: Res;
  config?: any;
  request?: any;
  response?: any;
  headers?: any;
}

export interface Client {
  provider<Req, Res>(requestOptions: ClientRequest<Req>): Promise<ClientResponse<Res>>;
}

/**
 * The API request type
 *
 * @param url - the url to make the request to, i.e https://fullnode.aptoslabs.devnet.com/v1
 * @param method - the request method "GET" | "POST"
 * @param endpoint (optional) - the endpoint to make the request to, i.e transactions
 * @param body (optional) - the body of the request
 * @param contentType (optional) - the content type to set the `content-type` header to,
 * by default is set to `application/json`
 * @param params (optional) - query params to add to the request
 * @param originMethod (optional) - the local method the request came from
 * @param overrides (optional) - a `ClientConfig` object type to override request data
 */
export type AptosRequest = {
  url: string;
  method: "GET" | "POST";
  path?: string;
  body?: any;
  contentType?: string;
  acceptType?: string;
  params?: Record<string, string | AnyNumber | boolean | undefined>;
  originMethod?: string;
  overrides?: ClientConfig;
};

/**
 * Specifies ledger version of transactions. By default latest version will be used
 */
export type LedgerVersionArg = {
  ledgerVersion?: AnyNumber;
};

/**
 * RESPONSE TYPES
 */

/**
 * Type holding the outputs of the estimate gas API
 */
export type GasEstimation = {
  /**
   * The deprioritized estimate for the gas unit price
   */
  deprioritized_gas_estimate?: number;
  /**
   * The current estimate for the gas unit price
   */
  gas_estimate: number;
  /**
   * The prioritized estimate for the gas unit price
   */
  prioritized_gas_estimate?: number;
};

export type MoveResource = {
  type: MoveStructId;
  data: {};
};

export type AccountData = {
  sequence_number: string;
  authentication_key: string;
};

export type MoveModuleBytecode = {
  bytecode: string;
  abi?: MoveModule;
};

/**
 * TRANSACTION TYPES
 */

export enum TransactionResponseType {
  Pending = "pending_transaction",
  User = "user_transaction",
  Genesis = "genesis_transaction",
  BlockMetadata = "block_metadata_transaction",
  StateCheckpoint = "state_checkpoint_transaction",
}

export type TransactionResponse = PendingTransactionResponse | CommittedTransactionResponse;
export type CommittedTransactionResponse =
    | UserTransactionResponse
    | GenesisTransactionResponse
    | BlockMetadataTransactionResponse
    | StateCheckpointTransactionResponse;

export function isPendingTransactionResponse(response: TransactionResponse): response is PendingTransactionResponse {
  return response.type === TransactionResponseType.Pending;
}

export function isUserTransactionResponse(response: TransactionResponse): response is UserTransactionResponse {
  return response.type === TransactionResponseType.User;
}

export function isGenesisTransactionResponse(response: TransactionResponse): response is GenesisTransactionResponse {
  return response.type === TransactionResponseType.Genesis;
}

export function isBlockMetadataTransactionResponse(
    response: TransactionResponse,
): response is BlockMetadataTransactionResponse {
  return response.type === TransactionResponseType.BlockMetadata;
}

export function isStateCheckpointTransactionResponse(
    response: TransactionResponse,
): response is StateCheckpointTransactionResponse {
  return response.type === TransactionResponseType.StateCheckpoint;
}

export type PendingTransactionResponse = {
  type: TransactionResponseType.Pending;
  hash: string;
  sender: string;
  sequence_number: string;
  max_gas_amount: string;
  gas_unit_price: string;
  expiration_timestamp_secs: string;
  payload: TransactionPayloadResponse;
  signature?: TransactionSignature;
};

export type UserTransactionResponse = {
  type: TransactionResponseType.User;
  version: string;
  hash: string;
  state_change_hash: string;
  event_root_hash: string;
  state_checkpoint_hash?: string;
  gas_used: string;
  /**
   * Whether the transaction was successful
   */
  success: boolean;
  /**
   * The VM status of the transaction, can tell useful information in a failure
   */
  vm_status: string;
  accumulator_root_hash: string;
  /**
   * Final state of resources changed by the transaction
   */
  changes: Array<WriteSetChange>;
  sender: string;
  sequence_number: string;
  max_gas_amount: string;
  gas_unit_price: string;
  expiration_timestamp_secs: string;
  payload: TransactionPayloadResponse;
  signature?: TransactionSignature;
  /**
   * Events generated by the transaction
   */
  events: Array<Event>;
  timestamp: string;
};

export type GenesisTransactionResponse = {
  type: TransactionResponseType.Genesis;
  version: string;
  hash: string;
  state_change_hash: string;
  event_root_hash: string;
  state_checkpoint_hash?: string;
  gas_used: string;
  /**
   * Whether the transaction was successful
   */
  success: boolean;
  /**
   * The VM status of the transaction, can tell useful information in a failure
   */
  vm_status: string;
  accumulator_root_hash: string;
  /**
   * Final state of resources changed by the transaction
   */
  changes: Array<WriteSetChange>;
  payload: GenesisPayload;
  /**
   * Events emitted during genesis
   */
  events: Array<Event>;
};

export type BlockMetadataTransactionResponse = {
  type: TransactionResponseType.BlockMetadata;
  version: string;
  hash: string;
  state_change_hash: string;
  event_root_hash: string;
  state_checkpoint_hash?: string;
  gas_used: string;
  /**
   * Whether the transaction was successful
   */
  success: boolean;
  /**
   * The VM status of the transaction, can tell useful information in a failure
   */
  vm_status: string;
  accumulator_root_hash: string;
  /**
   * Final state of resources changed by the transaction
   */
  changes: Array<WriteSetChange>;
  id: string;
  epoch: string;
  round: string;
  /**
   * The events emitted at the block creation
   */
  events: Array<Event>;
  /**
   * Previous block votes
   */
  previous_block_votes_bitvec: Array<number>;
  proposer: string;
  /**
   * The indices of the proposers who failed to propose
   */
  failed_proposer_indices: Array<number>;
  timestamp: string;
};

export type StateCheckpointTransactionResponse = {
  type: TransactionResponseType.StateCheckpoint;
  version: string;
  hash: string;
  state_change_hash: string;
  event_root_hash: string;
  state_checkpoint_hash?: string;
  gas_used: string;
  /**
   * Whether the transaction was successful
   */
  success: boolean;
  /**
   * The VM status of the transaction, can tell useful information in a failure
   */
  vm_status: string;
  accumulator_root_hash: string;
  /**
   * Final state of resources changed by the transaction
   */
  changes: Array<WriteSetChange>;
  timestamp: string;
};

/**
 * WRITESET CHANGE TYPES
 */

export type WriteSetChange =
    | WriteSetChangeDeleteModule
    | WriteSetChangeDeleteResource
    | WriteSetChangeDeleteTableItem
    | WriteSetChangeWriteModule
    | WriteSetChangeWriteResource
    | WriteSetChangeWriteTableItem;

export type WriteSetChangeDeleteModule = {
  type: string;
  address: string;
  /**
   * State key hash
   */
  state_key_hash: string;
  module: MoveModuleId;
};

export type WriteSetChangeDeleteResource = {
  type: string;
  address: string;
  state_key_hash: string;
  resource: string;
};

export type WriteSetChangeDeleteTableItem = {
  type: string;
  state_key_hash: string;
  handle: string;
  key: string;
  data?: DeletedTableData;
};

export type WriteSetChangeWriteModule = {
  type: string;
  address: string;
  state_key_hash: string;
  data: MoveModuleBytecode;
};

export type WriteSetChangeWriteResource = {
  type: string;
  address: string;
  state_key_hash: string;
  data: MoveResource;
};

export type WriteSetChangeWriteTableItem = {
  type: string;
  state_key_hash: string;
  handle: string;
  key: string;
  value: string;
  data?: DecodedTableData;
};

export type DecodedTableData = {
  /**
   * Key of table in JSON
   */
  key: any;
  /**
   * Type of key
   */
  key_type: string;
  /**
   * Value of table in JSON
   */
  value: any;
  /**
   * Type of value
   */
  value_type: string;
};

/**
 * Deleted table data
 */
export type DeletedTableData = {
  /**
   * Deleted key
   */
  key: any;
  /**
   * Deleted key type
   */
  key_type: string;
};

export type TransactionPayloadResponse = EntryFunctionPayloadResponse | ScriptPayloadResponse | MultisigPayloadResponse;

export type EntryFunctionPayloadResponse = {
  type: string;
  function: MoveFunctionId;
  /**
   * Type arguments of the function
   */
  type_arguments: Array<string>;
  /**
   * Arguments of the function
   */
  arguments: Array<any>;
};

export type ScriptPayloadResponse = {
  type: string;
  code: MoveScriptBytecode;
  /**
   * Type arguments of the function
   */
  type_arguments: Array<string>;
  /**
   * Arguments of the function
   */
  arguments: Array<any>;
};

export type MultisigPayloadResponse = {
  type: string;
  multisig_address: string;
  transaction_payload?: EntryFunctionPayloadResponse;
};

export type GenesisPayload = {
  type: string;
  write_set: WriteSet;
};

/**
 * Move script bytecode
 */
export type MoveScriptBytecode = {
  bytecode: string;
  abi?: MoveFunction;
};

/**
 * These are the JSON representations of transaction signatures returned from the node API.
 */
export type TransactionSignature =
    | TransactionEd25519Signature
    | TransactionSecp256k1Signature
    | TransactionMultiEd25519Signature
    | TransactionMultiAgentSignature
    | TransactionFeePayerSignature;

export function isEd25519Signature(signature: TransactionSignature): signature is TransactionFeePayerSignature {
  return "signature" in signature && signature.signature === "ed25519_signature";
}

export function isSecp256k1Signature(signature: TransactionSignature): signature is TransactionFeePayerSignature {
  return "signature" in signature && signature.signature === "secp256k1_ecdsa_signature";
}

export function isMultiAgentSignature(signature: TransactionSignature): signature is TransactionMultiAgentSignature {
  return signature.type === "multi_agent_signature";
}

export function isFeePayerSignature(signature: TransactionSignature): signature is TransactionFeePayerSignature {
  return signature.type === "fee_payer_signature";
}

export function isMultiEd25519Signature(
    signature: TransactionSignature,
): signature is TransactionMultiEd25519Signature {
  return signature.type === "multi_ed25519_signature";
}

export type TransactionEd25519Signature = {
  type: string;
  public_key: string;
  signature: "ed25519_signature";
};

export type TransactionSecp256k1Signature = {
  type: string;
  public_key: string;
  signature: "secp256k1_ecdsa_signature";
};

export type TransactionMultiEd25519Signature = {
  type: "multi_ed25519_signature";
  /**
   * The public keys for the Ed25519 signature
   */
  public_keys: Array<string>;
  /**
   * Signature associated with the public keys in the same order
   */
  signatures: Array<string>;
  /**
   * The number of signatures required for a successful transaction
   */
  threshold: number;
  bitmap: string;
};

export type TransactionMultiAgentSignature = {
  type: "multi_agent_signature";
  sender: AccountSignature;
  /**
   * The other involved parties' addresses
   */
  secondary_signer_addresses: Array<string>;
  /**
   * The associated signatures, in the same order as the secondary addresses
   */
  secondary_signers: Array<AccountSignature>;
};

export type TransactionFeePayerSignature = {
  type: "fee_payer_signature";
  sender: AccountSignature;
  /**
   * The other involved parties' addresses
   */
  secondary_signer_addresses: Array<string>;
  /**
   * The associated signatures, in the same order as the secondary addresses
   */
  secondary_signers: Array<AccountSignature>;
  fee_payer_address: string;
  fee_payer_signer: AccountSignature;
};

/**
 * The union of all single account signatures.
 */
export type AccountSignature =
    | TransactionEd25519Signature
    | TransactionSecp256k1Signature
    | TransactionMultiEd25519Signature;

export type WriteSet = ScriptWriteSet | DirectWriteSet;

export type ScriptWriteSet = {
  type: string;
  execute_as: string;
  script: ScriptPayloadResponse;
};

export type DirectWriteSet = {
  type: string;
  changes: Array<WriteSetChange>;
  events: Array<Event>;
};

export type EventGuid = {
  creation_number: string;
  account_address: string;
};

export type Event = {
  guid: EventGuid;
  sequence_number: string;
  type: string;
  /**
   * The JSON representation of the event
   */
  data: any;
};

/**
 * Map of Move types to local TypeScript types
 */
export type MoveUint8Type = number;
export type MoveUint16Type = number;
export type MoveUint32Type = number;
export type MoveUint64Type = string;
export type MoveUint128Type = string;
export type MoveUint256Type = string;
export type MoveAddressType = string;
export type MoveObjectType = string;
export type MoveOptionType = MoveType | null | undefined;
/**
 * This is the format for a fully qualified struct, resource, or entry function in Move.
 */
export type MoveStructId = `${string}::${string}::${string}`;
// These are the same, unfortunately, it reads really strangely to take a StructId for a Function and there wasn't a
// good middle ground name.
export type MoveFunctionId = MoveStructId;

// TODO: Add support for looking up ABI to add proper typing
export type MoveStructType = {};

export type MoveType =
    | boolean
    | string
    | MoveUint8Type
    | MoveUint16Type
    | MoveUint32Type
    | MoveUint64Type
    | MoveUint128Type
    | MoveUint256Type
    | MoveAddressType
    | MoveObjectType
    | MoveStructType
    | Array<MoveType>;

/**
 * Possible Move values acceptable by move functions (entry, view)
 *
 * Map of a Move value to the corresponding TypeScript value
 *
 * `Bool -> boolean`
 *
 * `u8, u16, u32 -> number`
 *
 * `u64, u128, u256 -> string`
 *
 * `String -> string`
 *
 * `Address -> 0x${string}`
 *
 * `Struct - 0x${string}::${string}::${string}`
 *
 * `Object -> 0x${string}`
 *
 * `Vector -> Array<MoveValue>`
 *
 * `Option -> MoveValue | null | undefined`
 */
export type MoveValue =
    | boolean
    | string
    | MoveUint8Type
    | MoveUint16Type
    | MoveUint32Type
    | MoveUint64Type
    | MoveUint128Type
    | MoveUint256Type
    | MoveAddressType
    | MoveObjectType
    | MoveStructId
    | MoveOptionType
    | Array<MoveValue>;

/**
 * Move module id is a string representation of Move module.
 * Module name is case-sensitive.
 */
export type MoveModuleId = `${string}::${string}`;

/**
 * Move function visibility
 */
export enum MoveFunctionVisibility {
  PRIVATE = "private",
  PUBLIC = "public",
  FRIEND = "friend",
}

/**
 * Move function ability
 */
export enum MoveAbility {
  STORE = "store",
  DROP = "drop",
  KEY = "key",
  COPY = "copy",
}

/**
 * Move abilities tied to the generic type param and associated with the function that uses it
 */
export type MoveFunctionGenericTypeParam = {
  constraints: Array<MoveAbility>;
};

/**
 * Move struct field
 */
export type MoveStructField = {
  name: string;
  type: string;
};

/**
 * A Move module
 */
export type MoveModule = {
  address: string;
  name: string;
  /**
   * Friends of the module
   */
  friends: Array<MoveModuleId>;
  /**
   * Public functions of the module
   */
  exposed_functions: Array<MoveFunction>;
  /**
   * Structs of the module
   */
  structs: Array<MoveStruct>;
};

/**
 * A move struct
 */
export type MoveStruct = {
  name: string;
  /**
   * Whether the struct is a native struct of Move
   */
  is_native: boolean;
  /**
   * Abilities associated with the struct
   */
  abilities: Array<MoveAbility>;
  /**
   * Generic types associated with the struct
   */
  generic_type_params: Array<MoveFunctionGenericTypeParam>;
  /**
   * Fields associated with the struct
   */
  fields: Array<MoveStructField>;
};

/**
 * Move function
 */
export type MoveFunction = {
  name: string;
  visibility: MoveFunctionVisibility;
  /**
   * Whether the function can be called as an entry function directly in a transaction
   */
  is_entry: boolean;
  /**
   * Whether the function is a view function or not
   */
  is_view: boolean;
  /**
   * Generic type params associated with the Move function
   */
  generic_type_params: Array<MoveFunctionGenericTypeParam>;
  /**
   * Parameters associated with the move function
   */
  params: Array<string>;
  /**
   * Return type of the function
   */
  return: Array<string>;
};

export enum RoleType {
  VALIDATOR = "validator",
  FULL_NODE = "full_node",
}

export type LedgerInfo = {
  /**
   * Chain ID of the current chain
   */
  chain_id: number;
  epoch: string;
  ledger_version: string;
  oldest_ledger_version: string;
  ledger_timestamp: string;
  node_role: RoleType;
  oldest_block_height: string;
  block_height: string;
  /**
   * Git hash of the build of the API endpoint.  Can be used to determine the exact
   * software version used by the API endpoint.
   */
  git_hash?: string;
};

/**
 * A Block type
 */
export type Block = {
  block_height: string;
  block_hash: string;
  block_timestamp: string;
  first_version: string;
  last_version: string;
  /**
   * The transactions in the block in sequential order
   */
  transactions?: Array<TransactionResponse>;
};

/**
 * The data needed to generate a View Request payload
 */
export type InputViewRequestData = {
  function: MoveFunctionId;
  typeArguments?: Array<MoveStructId>;
  functionArguments?: Array<MoveValue>;
};

// REQUEST TYPES

/**
 * View request for the Move view function API
 *
 * `type MoveFunctionId = ${string}::${string}::${string}`;
 */
export type ViewRequest = {
  function: MoveFunctionId;
  /**
   * Type arguments of the function
   */
  typeArguments: Array<MoveStructId>;
  /**
   * Arguments of the function
   */
  functionArguments: Array<MoveValue>;
};

/**
 * Table Item request for the GetTableItem API
 */
export type TableItemRequest = {
  key_type: MoveValue;
  value_type: MoveValue;
  /**
   * The value of the table item's key
   */
  key: any;
};

/**
 * A list of Authentication Key schemes that are supported by Aptos.
 *
 * They are combinations of signing schemes and derive schemes.
 */
export type AuthenticationKeyScheme = SigningScheme | DeriveScheme;

export enum SigningScheme {
  /**
   * For Ed25519PublicKey
   */
  Ed25519 = 0,
  /**
   * For MultiEd25519PublicKey
   */
  MultiEd25519 = 1,
  /**
   * For SingleKey ecdsa
   */
  SingleKey = 2,

  MultiKey = 3,
}

export enum SigningSchemeInput {
  /**
   * For Ed25519PublicKey
   */
  Ed25519 = 0,
  /**
   * For Secp256k1Ecdsa
   */
  Secp256k1Ecdsa = 2,
}

/**
 * Scheme used for deriving account addresses from other data
 */
export enum DeriveScheme {
  /**
   * Derives an address using an AUID, used for objects
   */
  DeriveAuid = 251,
  /**
   * Derives an address from another object address
   */
  DeriveObjectAddressFromObject = 252,
  /**
   * Derives an address from a GUID, used for objects
   */
  DeriveObjectAddressFromGuid = 253,
  /**
   * Derives an address from seed bytes, used for named objects
   */
  DeriveObjectAddressFromSeed = 254,
  /**
   * Derives an address from seed bytes, used for resource accounts
   */
  DeriveResourceAccountAddress = 255,
}

/**
 * Option properties to pass for waitForTransaction() function
 */
export type WaitForTransactionOptions = {
  timeoutSecs?: number;
  checkSuccess?: boolean;
  waitForIndexer?: boolean;
};

/**
 * Input type to generate an account using Single Signer
 * Ed25519 or Legacy Ed25519
 */
export type GenerateAccountWithEd25519 = {
  scheme: SigningSchemeInput.Ed25519;
  legacy: boolean;
};

/**
 * Input type to generate an account using Single Signer
 * Secp256k1
 */
export type GenerateAccountWithSingleSignerSecp256k1Key = {
  scheme: SigningSchemeInput.Secp256k1Ecdsa;
  legacy?: false;
};

export type GenerateAccount = GenerateAccountWithEd25519 | GenerateAccountWithSingleSignerSecp256k1Key;