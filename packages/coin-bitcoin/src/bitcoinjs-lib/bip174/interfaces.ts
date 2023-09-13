/**
 * The following methods are based on `bitcoinjs`, thanks for their work
 * https://github.com/bitcoinjs/bitcoinjs-lib
 */
// This function should throw if the scriptSig or scriptWitness section for
// any input is not empty. And it should throw if the transaction is segwit
// format. As per the BIP.
export type TransactionFromBuffer = (buffer: Buffer) => Transaction;
// This is a light wrapper that will give the information needed for parsing
// and modifying the Transaction internally.
// This library will have no logical understanding of the Transaction format,
// and it must be provided via the below interface
export interface Transaction {
  // Self explanatory
  getInputOutputCounts(): { inputCount: number; outputCount: number };
  // This function should check the arg for the correct info needed to add an
  // input. For example in Bitcoin it would need the hash, index, and sequence.
  // This function will modify the internal state of the transaction.
  addInput(objectArg: any): void;
  // Same as addInput. But with adding an output. For Bitcoin scriptPubkey
  // and value are all that should be needed.
  addOutput(objectArg: any): void;
  // This is primarily used when serializing the PSBT to a binary.
  // You can implement caching behind the scenes if needed and clear the cache
  // when addInput or addOutput are called.
  toBuffer(): Buffer;
}

export interface KeyValue {
  key: Buffer;
  value: Buffer;
}

export interface PsbtGlobal extends PsbtGlobalUpdate {
  unsignedTx: Transaction;
  unknownKeyVals?: KeyValue[];
}

export interface PsbtGlobalUpdate {
  globalXpub?: GlobalXpub[];
}

export interface PsbtInput extends PsbtInputUpdate {
  unknownKeyVals?: KeyValue[];
}

export interface PsbtInputUpdate {
  partialSig?: PartialSig[];
  nonWitnessUtxo?: NonWitnessUtxo;
  witnessUtxo?: WitnessUtxo;
  sighashType?: SighashType;
  redeemScript?: RedeemScript;
  witnessScript?: WitnessScript;
  bip32Derivation?: Bip32Derivation[];
  finalScriptSig?: FinalScriptSig;
  finalScriptWitness?: FinalScriptWitness;
  porCommitment?: PorCommitment;
  tapKeySig?: TapKeySig;
  tapScriptSig?: TapScriptSig[];
  tapLeafScript?: TapLeafScript[];
  tapBip32Derivation?: TapBip32Derivation[];
  tapInternalKey?: TapInternalKey;
  tapMerkleRoot?: TapMerkleRoot;
}

export interface PsbtInputExtended extends PsbtInput {
  [index: string]: any;
}

export interface PsbtOutput extends PsbtOutputUpdate {
  unknownKeyVals?: KeyValue[];
}

export interface PsbtOutputUpdate {
  redeemScript?: RedeemScript;
  witnessScript?: WitnessScript;
  bip32Derivation?: Bip32Derivation[];
  tapBip32Derivation?: TapBip32Derivation[];
  tapTree?: TapTree;
  tapInternalKey?: TapInternalKey;
}

export interface PsbtOutputExtended extends PsbtOutput {
  [index: string]: any;
}

export interface GlobalXpub {
  extendedPubkey: Buffer;
  masterFingerprint: Buffer;
  path: string;
}

export interface PartialSig {
  pubkey: Buffer;
  signature: Buffer;
}

export interface Bip32Derivation {
  masterFingerprint: Buffer;
  pubkey: Buffer;
  path: string;
}

export interface WitnessUtxo {
  script: Buffer;
  value: number;
}

export type NonWitnessUtxo = Buffer;

export type SighashType = number;

export type RedeemScript = Buffer;

export type WitnessScript = Buffer;

export type FinalScriptSig = Buffer;

export type FinalScriptWitness = Buffer;

export type PorCommitment = string;

export type TapKeySig = Buffer;

export interface TapScriptSig extends PartialSig {
  leafHash: Buffer;
}

interface TapScript {
  leafVersion: number;
  script: Buffer;
}

export type ControlBlock = Buffer;

export interface TapLeafScript extends TapScript {
  controlBlock: ControlBlock;
}

export interface TapBip32Derivation extends Bip32Derivation {
  leafHashes: Buffer[];
}

export type TapInternalKey = Buffer;

export type TapMerkleRoot = Buffer;

export interface TapLeaf extends TapScript {
  depth: number;
}

export interface TapTree {
  leaves: TapLeaf[];
}

export type TransactionIOCountGetter = (
  txBuffer: Buffer,
) => {
  inputCount: number;
  outputCount: number;
};

export interface TransactionInput {
  hash: string | Buffer;
  index: number;
  sequence?: number;
}

export type TransactionInputAdder = (
  input: TransactionInput,
  txBuffer: Buffer,
) => Buffer;

export interface TransactionOutput {
  script: Buffer;
  value: number;
}

export type TransactionOutputAdder = (
  output: TransactionOutput,
  txBuffer: Buffer,
) => Buffer;

export type TransactionVersionSetter = (
  version: number,
  txBuffer: Buffer,
) => Buffer;

export type TransactionLocktimeSetter = (
  locktime: number,
  txBuffer: Buffer,
) => Buffer;
