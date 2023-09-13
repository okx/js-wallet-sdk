/** Action with data in structured form */
export interface Action {
  // receiver account to whom the action is intended (encoded 13-char account name)
  account: string;
  // the name of the action (encoded 13-char action name)
  name: string;
  // list of actor:permission authorizations
  authorization: Authorization[];
  // action data to send (bytes)
  data: any;
  hex_data?: string;
}

// Permissions control what EOSIO accounts can do and how actions are authorized
// The active permission is typically used for voting, transferring funds, and other account operations.
export interface Authorization {
  actor: string;
  permission: string;
}

export interface ResourcePayer {
  payer: string;
  max_net_bytes: number;
  max_cpu_us: number;
  max_memory_bytes: number;
}

// A transaction instance consists of a transaction header and the list of action instances and transaction extensions that make the actual transaction.
export interface Transaction {
  // header related
  // the time the transaction must be confirmed by before it expires time_point_sec
  expiration?: string;
  // lower 16 bits of a block number in the last 2^16 blocks uint16_t
  ref_block_num?: number;
  // lower 32 bits of block id referred by `ref_block_num'  uint32_t
  ref_block_prefix?: number;
  // upper limit on total network bandwidth billed (in 64-bit words) unsigned_int
  max_net_usage_words?: number;
  // upper limit on total CPU time billed (in milliseconds)  uint8_t
  max_cpu_usage_ms?: number;
  // number of seconds to delay transaction for unsigned_int
  delay_sec?: number;

  // list of context-free actions if any
  context_free_actions?: Action[];
  // context-free action data to send if any
  context_free_data?: Uint8Array[];
  // list of action instances
  actions: Action[];
  // extends fields to support additional features
  transaction_extensions?: [number, string][];
}

/** Optional transact configuration object */
export interface TransactConfig {
  // private key list, refer to public key list from `get_required_keys` RPC call
  privateKeys: string[];
  compression: boolean;
  // referenced blocks, most recent non-reversible block
  refBlockNumber: number;
  refBlockId: string;
  refBlockTimestamp: string;
  // valid timestamp
  expireSeconds: number;
  // if provided, regard as a part of transaction_extensions
  resource_payer?: ResourcePayer;
}

/** Structured format for abis */
export interface Abi {
  version: string;
  types: { new_type_name: string, type: string }[];
  structs: { name: string, base: string, fields: { name: string, type: string }[] }[];
  actions: { name: string, type: string, ricardian_contract: string }[];
  tables: { name: string, type: string, index_type: string, key_names: string[], key_types: string[] }[];
  ricardian_clauses: { id: string, body: string }[];
  error_messages: { error_code: number, error_msg: string }[];
  abi_extensions: { tag: number, value: string }[];
  variants?: { name: string, types: string[] }[];
  action_results?: { name: string, result_type: string }[],
  kv_tables?: { [key: string]: { type: string, primary_index: { name: string, type: string }, secondary_indices: { [key: string]: { type: string }}[] } }[],
}

export interface TransactionHeader {
  expiration: string;
  ref_block_num: number;
  ref_block_prefix: number;
}

/** Action with data in serialized hex form */
export interface SerializedAction {
  account: string;
  name: string;
  authorization: Authorization[];
  data: string;
}

/** Key types this library supports */
export enum KeyType {
  k1 = 0,
  r1 = 1,
  wa = 2,
}

/** Public key data size, excluding type field */
export const publicKeyDataSize = 33;

/** Private key data size, excluding type field */
export const privateKeyDataSize = 32;

/** Signature data size, excluding type field */
export const signatureDataSize = 65;

/** Public key, private key, or signature in binary form */
export interface Key {
  type: KeyType;
  data: Uint8Array;
}

export interface PackedTransaction {
  // Array of strings (Signature)  -  array of signatures required to authorize transaction
  // eg: SIG_K1_KV2kiMYdhdyRgzQavH8ToCygZFjL9GGQLuFxG7Y1hCYgXSMYbsy1zsQz1cLxZ9pcJCpNveSbdnFL44FpunD5J2Gmk5nF2T
  signatures: string[];
  // boolean - Compression used, usually false
  compression: boolean;
  // packed_context_free_data - string json to hex
  packed_context_free_data: string;
  // string Transaction object json to hex
  packed_trx: string;
}

/** Used to calculate TAPoS fields in transactions */
export interface BlockTaposInfo {
  block_num: number;
  id: string;
  timestamp: string;
}