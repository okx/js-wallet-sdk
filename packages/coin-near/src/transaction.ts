/**
 * The following methods are based on `near-api-js`, thanks for their work
 * https://github.com/near/near-api-js/tree/master/packages/transactions/src
 */
import { KeyType, PublicKey } from './keypair';
import { Assignable, Enum } from './enums';
import { serialize, deserialize } from 'borsh';
import { base, signUtil, BN } from '@okxweb3/crypto-lib';
import { base_encode } from './serialize';
import {MessagePayload} from "./nearlib";

export class FunctionCallPermission extends Assignable {
  allowance?: BN;
  receiverId: string;
  methodNames: string[];
}

export class FullAccessPermission extends Assignable {}

export class AccessKeyPermission extends Enum {
  functionCall: FunctionCallPermission;
  fullAccess: FullAccessPermission;
}

export class AccessKey extends Assignable {
  nonce: number;
  permission: AccessKeyPermission;
}

export class IAction extends Assignable {}

export class CreateAccount extends IAction {}
export class DeployContract extends IAction { code: Uint8Array; }
export class FunctionCall extends IAction { methodName: string; args: Uint8Array; gas: BN; deposit: BN; }
export class Transfer extends IAction { deposit: BN; }
export class Stake extends IAction { stake: BN; publicKey: PublicKey; }
export class AddKey extends IAction { publicKey: PublicKey; accessKey: AccessKey; }
export class DeleteKey extends IAction { publicKey: PublicKey; }
export class DeleteAccount extends IAction { beneficiaryId: string; }

export function createAccount(): Action {
  return new Action({createAccount: new CreateAccount({}) });
}

export function deployContract(code: Uint8Array): Action {
  return new Action({ deployContract: new DeployContract({code}) });
}

export function stringifyJsonOrBytes(args: any): Buffer {
  const isUint8Array = args.byteLength !== undefined && args.byteLength === args.length;
  const serializedArgs = isUint8Array ? args : Buffer.from(JSON.stringify(args));
  return serializedArgs;
}

/**
 * Constructs {@link Action} instance representing contract method call.
 *
 * @param methodName the name of the method to call
 * @param args arguments to pass to method. Can be either plain JS object which gets serialized as JSON automatically
 *  or `Uint8Array` instance which represents bytes passed as is.
 * @param gas max amount of gas that method call can use
 * @param deposit amount of NEAR (in yoctoNEAR) to send together with the call
 * @param stringify Convert input arguments into bytes array.
 * @param jsContract  Is contract from JS SDK, skips stringification of arguments.
 */
export function functionCall(methodName: string, args: Uint8Array | object,  gas: BN = new BN(0), deposit: BN = new BN(0), stringify = stringifyJsonOrBytes, jsContract = false): Action {
  if(jsContract){
    return new Action({ functionCall: new FunctionCall({ methodName, args, gas, deposit }) });
  }
  return new Action({ functionCall: new FunctionCall({ methodName, args: stringify(args), gas, deposit }) });
}

export function transfer(deposit: BN): Action {
  return new Action({transfer: new Transfer({ deposit }) });
}

export function stake(stake: BN, publicKey: PublicKey): Action {
  return new Action({stake: new Stake({ stake, publicKey }) });
}

export function addKey(publicKey: PublicKey, accessKey: AccessKey): Action {
  return new Action({addKey: new AddKey({ publicKey, accessKey}) });
}

export function deleteKey(publicKey: PublicKey): Action {
  return new Action({deleteKey: new DeleteKey({ publicKey }) });
}

export function deleteAccount(beneficiaryId: string): Action {
  return new Action({deleteAccount: new DeleteAccount({ beneficiaryId }) });
}

/*
NEAR uses a human-readable account system where the public identifier is the name you create.
FunctionCall access keys adds a layer of protection from malicious Apps:
  Requires user's approval per transaction
  Limits excessive Gas fees

An application with a full access key has the ability to:
Freely utilize all of your tokens
Create new accounts funded and managed by your account
Delete accounts
Make Contract Calls with no Gas limit
Deploy Contracts onto the account (each account can have one contract deployed onto it at a time)
Full access to your NEAR tokens with the ability to stake them or transfer them without secondary approval
Create additional keys
Delete keys
 */
export class Transaction extends Assignable {
  // signerId (account ID of the transaction originator)
  signerId: string;
  // signerPublicKey
  publicKey: PublicKey;
  // nonceForPublicKey (each time a key is used the nonce value should be incremented by 1)
  nonce: number;
  // receiverId (account ID of the transaction recipient)
  receiverId: string;
  // An Action is a composable unit of operation that, together with zero or more other Actions, defines a sensible Transaction.
  // There are currently 8 supported Action types
  actions: Action[];
  // blockHash (a current block hash (within 24hrs) to prove the transaction was recently created)
  blockHash: Uint8Array;

  encode(): Uint8Array {
    return serialize(SCHEMA, this);
  }

  static decode(bytes: Buffer): Transaction {
    return deserialize(SCHEMA, Transaction, bytes);
  }
}

export class Action extends Enum {
  createAccount: CreateAccount;
  deployContract: DeployContract;
  functionCall: FunctionCall;
  transfer: Transfer;
  stake: Stake;
  addKey: AddKey;
  deleteKey: DeleteKey;
  deleteAccount: DeleteAccount;
}

export class Signature extends Assignable {
  keyType: KeyType;
  data: Uint8Array;
}

export class SignedTransaction extends Assignable {
  transaction: Transaction;
  signature: Signature;

  encode(): Uint8Array {
    return serialize(SCHEMA, this);
  }

  static decode(bytes: Buffer): SignedTransaction {
    return deserialize(SCHEMA, SignedTransaction, bytes);
  }
}

export const SCHEMA = new Map<Function, any>([
    [MessagePayload, {
        kind: 'struct', fields: [
            ['tag', 'u32'],
            ['message', 'string'],
            ['nonce', [32]],
            ['recipient', 'string'],
            ['callbackUrl', {kind:'option',type:'string'}]
        ]
    }],
  [Signature, {kind: 'struct', fields: [
      ['keyType', 'u8'],
      ['data', [64]]
    ]}],
  [SignedTransaction, {kind: 'struct', fields: [
      ['transaction', Transaction],
      ['signature', Signature]
    ]}],
  [Transaction, { kind: 'struct', fields: [
      ['signerId', 'string'],
      ['publicKey', PublicKey],
      ['nonce', 'u64'],
      ['receiverId', 'string'],
      ['blockHash', [32]],
      ['actions', [Action]]
    ]}],
  [PublicKey, { kind: 'struct', fields: [
      ['keyType', 'u8'],
      ['data', [32]]
    ]}],
  [AccessKey, { kind: 'struct', fields: [
      ['nonce', 'u64'],
      ['permission', AccessKeyPermission],
    ]}],
  [AccessKeyPermission, {kind: 'enum', field: 'enum', values: [
      ['functionCall', FunctionCallPermission],
      ['fullAccess', FullAccessPermission],
    ]}],
  [FunctionCallPermission, {kind: 'struct', fields: [
      ['allowance', {kind: 'option', type: 'u128'}],
      ['receiverId', 'string'],
      ['methodNames', ['string']],
    ]}],
  [FullAccessPermission, {kind: 'struct', fields: []}],
  [Action, {kind: 'enum', field: 'enum', values: [
      ['createAccount', CreateAccount],
      ['deployContract', DeployContract],
      ['functionCall', FunctionCall],
      ['transfer', Transfer],
      ['stake', Stake],
      ['addKey', AddKey],
      ['deleteKey', DeleteKey],
      ['deleteAccount', DeleteAccount],
    ]}],
  [CreateAccount, { kind: 'struct', fields: [] }],
  [DeployContract, { kind: 'struct', fields: [
      ['code', ['u8']]
    ]}],
  [FunctionCall, { kind: 'struct', fields: [
      ['methodName', 'string'],
      ['args', ['u8']],
      ['gas', 'u64'],
      ['deposit', 'u128']
    ]}],
  [Transfer, { kind: 'struct', fields: [
      ['deposit', 'u128']
    ]}],
  [Stake, { kind: 'struct', fields: [
      ['stake', 'u128'],
      ['publicKey', PublicKey]
    ]}],
  [AddKey, { kind: 'struct', fields: [
      ['publicKey', PublicKey],
      ['accessKey', AccessKey]
    ]}],
  [DeleteKey, { kind: 'struct', fields: [
      ['publicKey', PublicKey]
    ]}],
  [DeleteAccount, { kind: 'struct', fields: [
      ['beneficiaryId', 'string']
    ]}],
]);

export function createTransaction(signerId: string, publicKey: PublicKey, receiverId: string, nonce: number, actions: Action[], blockHash: Uint8Array): Transaction {
  return new Transaction({ signerId, publicKey, nonce, receiverId, actions, blockHash });
}

/**
 * Signs a given transaction from an account with given keys, applied to the given network
 * @param transaction The Transaction object to sign
 * @param privateKeyHex
 */
async function signTransactionObject(transaction: Transaction, privateKeyHex: string): Promise<[Uint8Array, SignedTransaction]> {
  const message = serialize(SCHEMA, transaction)
  const hash = base.sha256(message)
  const privateKey = base.fromHex(privateKeyHex)
  const s = signUtil.ed25519.sign(hash, privateKey)
  const signedTx = new SignedTransaction({
    transaction,
    signature: new Signature({ keyType: KeyType.ED25519, data: s })
  });
  return [hash, signedTx];
}

export async function signTransaction(transaction: Transaction, privateKeyHex: string): Promise<[Uint8Array, SignedTransaction]>;
export async function signTransaction(receiverId: string, nonce: number, actions: Action[], blockHash: Uint8Array, privateKeyHex: string,accountId: string): Promise<[Uint8Array, SignedTransaction]>;
export async function signTransaction(...args: any[]): Promise<[Uint8Array, SignedTransaction]> {
  if (args[0].constructor === Transaction) {
    const [ transaction, privateKeyHex] = args;
    return signTransactionObject(transaction, privateKeyHex);
  } else {
    const [ receiverId, nonce, actions, blockHash, privateKeyHex, accountId ] = args;
    const p = signUtil.ed25519.publicKeyCreate(base.fromHex(privateKeyHex))
    const publicKey = PublicKey.from(base_encode(p))
    const transaction = createTransaction(accountId, publicKey, receiverId, nonce, actions, blockHash);
    return signTransactionObject(transaction, privateKeyHex);
  }
}

export function fullAccessKey(): AccessKey {
  return new AccessKey({ nonce: 0, permission: new AccessKeyPermission({fullAccess: new FullAccessPermission({})}) });
}

export function functionCallAccessKey(receiverId: string, methodNames: string[], allowance?: BN): AccessKey {
  return new AccessKey({ nonce: 0, permission: new AccessKeyPermission({functionCall: new FunctionCallPermission({receiverId, allowance, methodNames})})});
}