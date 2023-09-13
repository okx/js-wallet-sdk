import {
  arrayToHex,
  Contract,
  createAbiTypes,
  createInitialTypes,
  createTransactionExtensionTypes,
  createTransactionTypes,
  getType,
  getTypesFromAbi,
  SerialBuffer,
  serializeAction,
  supportedAbiVersion,
  transactionHeader,
  Type,
} from './serialize';

import {
  Abi,
  Action, Key,
  KeyType,
  PackedTransaction,
  ResourcePayer,
  SerializedAction,
  TransactConfig,
  Transaction,
} from './types';
import { base64ToBinary, digestFromSerializedData, signatureToString, stringToPrivateKey } from './numeric';

import { elliptic } from '@okxweb3/crypto-lib';
import { deflate } from 'pako';

const ec = new elliptic.ec('secp256k1')

export class TxBuilder {
  /** Converts abi files between binary and structured form (`abi.abi.json`) */
  public abiTypes: Map<string, Type>;

  /** Converts transactions between binary and structured form (`transaction.abi.json`) */
  public transactionTypes: Map<string, Type>;

  public chainId: string
  /**
   * * `rpc`: Issues RPC calls
   * * `authorityProvider`: Get public keys needed to meet authorities in a transaction
   * * `abiProvider`: Supplies ABIs in raw form (binary)
   * * `signatureProvider`: Signs transactions
   * * `chainId`: Identifies chain
   * * `textEncoder`: `TextEncoder` instance to use. Pass in `null` if running in a browser
   * * `textDecoder`: `TextDecoder` instance to use. Pass in `null` if running in a browser
   * @param chainId
   */
  constructor(chainId: string) {
    this.chainId = chainId;
    this.abiTypes = getTypesFromAbi(createAbiTypes());
    this.transactionTypes = getTypesFromAbi(createTransactionTypes());
  }

  /** Get abis needed by a transaction */
  public getTransactionAbiMap(transaction: Transaction, abiMap: Map<string, string>): Map<string, Abi> {
    const actions = (transaction.context_free_actions || []).concat(transaction.actions);
    const accounts: string[] = actions.map((action: Action): string => action.account);
    const uniqueAccounts: Set<string> = new Set(accounts);
    const destMap = new Map<string, Abi>()
    uniqueAccounts.forEach(acc =>{
      const abiStr = abiMap.get(acc)
      if(abiStr) {
        const abiU8 = base64ToBinary(abiStr);
        destMap.set(acc, this.rawAbiToJson(abiU8))
      }
    })
    return destMap
  }

  // Order of adding to transaction_extension is transaction_extension id ascending
  public serializeTransactionExtensions(transaction: Transaction, resource_payer?: ResourcePayer): [number, string][] {
    let transaction_extensions: [number, string][] = [];
    if (resource_payer) {
      const extensionBuffer = new SerialBuffer();
      const types = getTypesFromAbi(createTransactionExtensionTypes());
      types.get('resource_payer')!.serialize(extensionBuffer, resource_payer);
      transaction_extensions = [...transaction_extensions, [1, arrayToHex(extensionBuffer.asUint8Array())]];
    }
    return transaction_extensions;
  };

  /** Convert actions to hex */
  public serializeActions(actions: Action[], abiMap: Map<string, Abi>): SerializedAction[] {
    const actionArray = []
    for (const {account, name, authorization, data} of actions) {
      const abi = abiMap.get(account)
      if(abi) {
        const contract = this.getContract(abi)
        const sa = serializeAction(contract, account, name, authorization, data)
        actionArray.push(sa);
      }
    }
    return actionArray
  }

  /** Get data needed to serialize actions in a contract */
  public getContract(abi: Abi): Contract {
    const types = getTypesFromAbi(createInitialTypes(), abi);
    const actions = new Map<string, Type>();
    for (const { name, type } of abi.actions) {
      actions.set(name, getType(types, type));
    }
    return { types, actions };
  }

  /** Decodes an abi as Uint8Array into json. */
  public rawAbiToJson(rawAbi: Uint8Array): Abi {
    const buffer = new SerialBuffer(rawAbi);
    if (!supportedAbiVersion(buffer.getString())) {
      throw new Error('Unsupported abi version');
    }
    buffer.restartRead();
    return this.abiTypes.get('abi_def')!.deserialize(buffer);
  }

  /** Convert a transaction to binary */
  public serializeTransaction(transaction: Transaction): Uint8Array {
    const buffer = new SerialBuffer();
    this.serialize(buffer, 'transaction', {
      max_net_usage_words: 0,
      max_cpu_usage_ms: 0,
      delay_sec: 0,
      context_free_actions: [],
      transaction_extensions: [],
      ...transaction,
    });
    return buffer.asUint8Array();
  }

  /** Convert `value` to binary form. `type` must be a built-in abi type or in `transaction.abi.json`. */
  public serialize(buffer: SerialBuffer, type: string, value: any): void {
    this.transactionTypes.get(type)!.serialize(buffer, value);
  }

  /** Serialize context-free data */
  public serializeContextFreeData(contextFreeData?: Uint8Array[]): Uint8Array | undefined {
    if (!contextFreeData || !contextFreeData.length) {
       return undefined;
    }
    const buffer = new SerialBuffer();
    buffer.pushVaruint32(contextFreeData.length);
    for (const data of contextFreeData) {
      buffer.pushBytes(data);
    }
    return buffer.asUint8Array();
  }


  /** Deflate a serialized object */
  public deflateSerializedArray(serializedArray: Uint8Array): Uint8Array {
    return deflate(serializedArray, { level: 9 });
  }

  /**
   * Create and optionally broadcast a transaction.
   *
   * Named Parameters:
   * `sign`: sign this transaction?
   * `compression`: compress this transaction?
   * `readOnlyTrx`: read only transaction?
   * `returnFailureTraces`: return failure traces? (only available for read only transactions currently)
   *
   * If both `blocksBehind` and `expireSeconds` are present,
   * then fetch the block which is `blocksBehind` behind head block,
   * use it as a reference for TAPoS, and expire the transaction `expireSeconds` after that block's time.
   *
   * If both `useLastIrreversible` and `expireSeconds` are present,
   * then fetch the last irreversible block, use it as a reference for TAPoS,
   * and expire the transaction `expireSeconds` after that block's time.
   * param abiMap - (account,abi) call `get_raw_abi` get query result for base64 encoded
   */
  public build(transaction: Transaction, config: TransactConfig, abiMap: Map<string, string>): PackedTransaction
  {
    const refBlockInfo = {block_num: config.refBlockNumber, id: config.refBlockId, timestamp: config.refBlockTimestamp}
    const header = transactionHeader(refBlockInfo, config.expireSeconds);
    transaction.expiration = header.expiration
    transaction.ref_block_num = header.ref_block_num
    transaction.ref_block_prefix = header.ref_block_prefix

    // fetch abi, for serializing
    const transactionAbiMap = this.getTransactionAbiMap(transaction, abiMap);
    transaction.transaction_extensions = this.serializeTransactionExtensions(transaction, config.resource_payer)
    transaction.context_free_actions = this.serializeActions(transaction.context_free_actions || [], transactionAbiMap)
    transaction.actions = this.serializeActions(transaction.actions, transactionAbiMap)

    const serializedTransaction = this.serializeTransaction(transaction);
    const serializedContextFreeData = this.serializeContextFreeData(transaction.context_free_data);

    // fetch signature
    const signatures = this.sign(config.privateKeys, serializedTransaction, serializedContextFreeData);

    if(config.compression) {
      // process compression
      const compressedSerializedTransaction = this.deflateSerializedArray(serializedTransaction);
      const compressedSerializedContextFreeData =
        this.deflateSerializedArray(serializedContextFreeData || new Uint8Array(0));
      return {
        signatures: signatures,
        compression: true,
        packed_context_free_data: arrayToHex(compressedSerializedContextFreeData || new Uint8Array(0)),
        packed_trx: arrayToHex(compressedSerializedTransaction || new Uint8Array(0))
      }
    } else {
      return {
        signatures: signatures,
        compression: false,
        packed_context_free_data: arrayToHex(serializedContextFreeData || new Uint8Array(0)),
        packed_trx: arrayToHex(serializedTransaction || new Uint8Array(0))
      }
    }
  }

  /** Sign a transaction */
  public sign(privateKeys: string[], serializedTransaction: Uint8Array, serializedContextFreeData?: Uint8Array): string[] {
    const digest = digestFromSerializedData(this.chainId, serializedTransaction, serializedContextFreeData);
    const signatures = [];
    for (const key of privateKeys) {
      const privateKey = stringToPrivateKey(key).data

      // special logic
      const isCanonical = (sigData: Uint8Array): boolean =>
        !(sigData[1] & 0x80) && !(sigData[1] === 0 && !(sigData[2] & 0x80))
        && !(sigData[33] & 0x80) && !(sigData[33] === 0 && !(sigData[34] & 0x80));

      let tries = 0;
      let signature: Key;
      do {
        const rawSign = ec.sign(Array.from(digest), Buffer.from(privateKey), {canonical: true, pers: [++tries]})
        let eosioRecoveryParam = rawSign.recoveryParam + 27;
        if (rawSign.recoveryParam <= 3) {
          eosioRecoveryParam += 4;
        }
        const d = new Uint8Array([eosioRecoveryParam].concat(...rawSign.toBytes()));
        signature = {type: KeyType.k1, data: d};
      } while (!isCanonical(signature.data));

      const result = signatureToString(signature)
      signatures.push(result);
    }
    return signatures;
  }
}
