// Copyright © Aptos Foundation
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @typescript-eslint/naming-convention */

import { Deserializer } from "../../bcs/deserializer";
import { Serializable, Serializer } from "../../bcs/serializer";
import { EntryFunctionBytes } from "../../bcs/serializable/entryFunctionBytes";
import { Bool, U128, U16, U256, U32, U64, U8 } from "../../bcs/serializable/movePrimitives";
import {MoveVector, Serialized} from "../../bcs/serializable/moveStructs";
import { AccountAddress } from "../../core";
import { Identifier } from "./identifier";
import { ModuleId } from "./moduleId";
import type { EntryFunctionArgument, ScriptFunctionArgument, TransactionArgument } from "./transactionArgument";
import { MoveModuleId, ScriptTransactionArgumentVariants, TransactionPayloadVariants } from "../../types";
import { TypeTag } from "../typeTag";

/**
 * Deserialize a Script Transaction Argument.
 * This function retrieves and deserializes various types of script transaction arguments based on the provided deserializer.
 *
 * @param deserializer - The deserializer used to read the script transaction argument.
 * @returns The deserialized script transaction argument.
 * @throws Error if the variant index is unknown.
 * @group Implementation
 * @category Transactions
 */
export function deserializeFromScriptArgument(deserializer: Deserializer): TransactionArgument {
  // index enum variant
  const index = deserializer.deserializeUleb128AsU32();
  switch (index) {
    case ScriptTransactionArgumentVariants.U8:
      return U8.deserialize(deserializer);
    case ScriptTransactionArgumentVariants.U64:
      return U64.deserialize(deserializer);
    case ScriptTransactionArgumentVariants.U128:
      return U128.deserialize(deserializer);
    case ScriptTransactionArgumentVariants.Address:
      return AccountAddress.deserialize(deserializer);
    case ScriptTransactionArgumentVariants.U8Vector:
      return MoveVector.deserialize(deserializer, U8);
    case ScriptTransactionArgumentVariants.Bool:
      return Bool.deserialize(deserializer);
    case ScriptTransactionArgumentVariants.U16:
      return U16.deserialize(deserializer);
    case ScriptTransactionArgumentVariants.U32:
      return U32.deserialize(deserializer);
    case ScriptTransactionArgumentVariants.U256:
      return U256.deserialize(deserializer);
    case ScriptTransactionArgumentVariants.Serialized:
      return Serialized.deserialize(deserializer);
    default:
      throw new Error(`Unknown variant index for ScriptTransactionArgument: ${index}`);
  }
}

/**
 * Represents a supported Transaction Payload that can be serialized and deserialized.
 *
 * This class serves as a base for different types of transaction payloads, allowing for
 * their serialization into a format suitable for transmission and deserialization back
 * into their original form.
 * @group Implementation
 * @category Transactions
 */
export abstract class TransactionPayload extends Serializable {
  /**
   * Serialize a Transaction Payload
   * @group Implementation
   * @category Transactions
   */
  abstract serialize(serializer: Serializer): void;

  /**
   * Deserialize a Transaction Payload
   * @group Implementation
   * @category Transactions
   */

  /**
   * Deserializes a multisig transaction payload from the provided deserializer.
   * This function enables the reconstruction of a MultiSigTransactionPayload object from its serialized form.
   *
   * @param deserializer - The deserializer instance used to read the serialized data.
   * @group Implementation
   * @category Transactions
   */
  static deserialize(deserializer: Deserializer): TransactionPayload {
    // index enum variant
    const index = deserializer.deserializeUleb128AsU32();
    switch (index) {
      case TransactionPayloadVariants.Script:
        return TransactionPayloadScript.load(deserializer);
      case TransactionPayloadVariants.EntryFunction:
        return TransactionPayloadEntryFunction.load(deserializer);
      case TransactionPayloadVariants.Multisig:
        return TransactionPayloadMultiSig.load(deserializer);
      default:
        throw new Error(`Unknown variant index for TransactionPayload: ${index}`);
    }
  }
}

/**
 * Represents a transaction payload script that can be serialized and deserialized.
 *
 * This class encapsulates a script that defines the logic for a transaction payload.
 *
 * @extends TransactionPayload
 * @group Implementation
 * @category Transactions
 */
export class TransactionPayloadScript extends TransactionPayload {
  public readonly script: Script;

  /**
   * Initializes a multi-sig account transaction with the provided payload.
   *
   * @param script - The payload of the multi-sig transaction. This can only be an EntryFunction for now, but Script might be
   * supported in the future.
   * @group Implementation
   * @category Transactions
   */
  constructor(script: Script) {
    super();
    this.script = script;
  }

  /**
   * Serializes the transaction payload, enabling future support for multiple types of inner transaction payloads.
   *
   * @param serializer - The serializer instance used to serialize the transaction data.
   * @group Implementation
   * @category Transactions
   */
  serialize(serializer: Serializer): void {
    serializer.serializeU32AsUleb128(TransactionPayloadVariants.Script);
    this.script.serialize(serializer);
  }

  /**
   * Loads a MultiSig transaction payload from the provided deserializer.
   * This function helps in reconstructing a MultiSig transaction payload from its serialized form.
   *
   * @param deserializer - The deserializer used to read the serialized data.
   * @group Implementation
   * @category Transactions
   */
  static load(deserializer: Deserializer): TransactionPayloadScript {
    const script = Script.deserialize(deserializer);
    return new TransactionPayloadScript(script);
  }
}

/**
 * Represents a transaction payload entry function that can be serialized and deserialized.
 *
 * @extends TransactionPayload
 * @group Implementation
 * @category Transactions
 */
export class TransactionPayloadEntryFunction extends TransactionPayload {
  public readonly entryFunction: EntryFunction;

  constructor(entryFunction: EntryFunction) {
    super();
    this.entryFunction = entryFunction;
  }

  serialize(serializer: Serializer): void {
    serializer.serializeU32AsUleb128(TransactionPayloadVariants.EntryFunction);
    this.entryFunction.serialize(serializer);
  }

  static load(deserializer: Deserializer): TransactionPayloadEntryFunction {
    const entryFunction = EntryFunction.deserialize(deserializer);
    return new TransactionPayloadEntryFunction(entryFunction);
  }
}

/**
 * Represents a multi-signature transaction payload that can be serialized and deserialized.
 * @group Implementation
 * @category Transactions
 */
export class TransactionPayloadMultiSig extends TransactionPayload {
  public readonly multiSig: MultiSig;

  constructor(multiSig: MultiSig) {
    super();
    this.multiSig = multiSig;
  }

  serialize(serializer: Serializer): void {
    serializer.serializeU32AsUleb128(TransactionPayloadVariants.Multisig);
    this.multiSig.serialize(serializer);
  }

  static load(deserializer: Deserializer): TransactionPayloadMultiSig {
    const value = MultiSig.deserialize(deserializer);
    return new TransactionPayloadMultiSig(value);
  }
}

/**
 * Represents an entry function that can be serialized and deserialized.
 * This class encapsulates the details required to invoke a function within a module,
 * including the module name, function name, type arguments, and function arguments.
 *
 * @param module_name - Fully qualified module name in the format "account_address::module_name" (e.g., "0x1::coin").
 * @param function_name - The name of the function (e.g., "transfer").
 * @param type_args - Type arguments required by the Move function.
 * @param args - Arguments to the Move function.
 * @group Implementation
 * @category Transactions
 */
export class EntryFunction {
  public readonly module_name: ModuleId;

  public readonly function_name: Identifier;

  public readonly type_args: Array<TypeTag>;

  public readonly args: Array<EntryFunctionArgument>;

  /**
   * Contains the payload to run a function within a module.
   * @param module_name Fully qualified module name in format "account_address::module_name" e.g. "0x1::coin"
   * @param function_name The function name. e.g "transfer"
   * @param type_args Type arguments that move function requires.
   *
   * @example
   * A coin transfer function has one type argument "CoinType".
   * ```
   * public entry fun transfer<CoinType>(from: &signer, to: address, amount: u64)
   * ```
   * @param args arguments to the move function.
   *
   * @example
   * A coin transfer function has three arguments "from", "to" and "amount".
   * ```
   * public entry fun transfer<CoinType>(from: &signer, to: address, amount: u64)
   * ```
   * @group Implementation
   * @category Transactions
   */
  constructor(
      module_name: ModuleId,
      function_name: Identifier,
      type_args: Array<TypeTag>,
      args: Array<EntryFunctionArgument>,
  ) {
    this.module_name = module_name;
    this.function_name = function_name;
    this.type_args = type_args;
    this.args = args;
  }

  /**
   * Build an EntryFunction payload from raw primitive values.
   *
   * @param module_id - Fully qualified module name in the format "AccountAddress::module_id", e.g., "0x1::coin".
   * @param function_name - The name of the function to be called.
   * @param type_args - Type arguments that the Move function requires.
   * @param args - Arguments to the Move function.
   *
   * @example
   * A coin transfer function has one type argument "CoinType".
   * ```
   * public(script) fun transfer<CoinType>(from: &signer, to: address, amount: u64)
   * ```
   *
   * A coin transfer function has three arguments "from", "to", and "amount".
   * ```
   * public(script) fun transfer<CoinType>(from: &signer, to: address, amount: u64)
   * ```
   *
   * @returns EntryFunction
   * @group Implementation
   * @category Transactions
   */
  static build(
      module_id: MoveModuleId,
      function_name: string,
      type_args: Array<TypeTag>,
      args: Array<EntryFunctionArgument>,
  ): EntryFunction {
    return new EntryFunction(ModuleId.fromStr(module_id), new Identifier(function_name), type_args, args);
  }

  serialize(serializer: Serializer): void {
    this.module_name.serialize(serializer);
    this.function_name.serialize(serializer);
    serializer.serializeVector<TypeTag>(this.type_args);
    serializer.serializeU32AsUleb128(this.args.length);
    this.args.forEach((item: EntryFunctionArgument) => {
      item.serializeForEntryFunction(serializer);
    });
  }

  /**
   * Deserializes an entry function payload with the arguments represented as EntryFunctionBytes instances.
   * @see EntryFunctionBytes
   *
   * NOTE: When you deserialize an EntryFunction payload with this method, the entry function
   * arguments are populated into the deserialized instance as type-agnostic, raw fixed bytes
   * in the form of the EntryFunctionBytes class.
   *
   * In order to correctly deserialize these arguments as their actual type representations, you
   * must know the types of the arguments beforehand and deserialize them yourself individually.
   *
   * One way you could achieve this is by using the ABIs for an entry function and deserializing each
   * argument as its given, corresponding type.
   *
   * @param deserializer
   * @returns A deserialized EntryFunction payload for a transaction.
   *
   * @group Implementation
   * @category Transactions
   */
  static deserialize(deserializer: Deserializer): EntryFunction {
    const module_name = ModuleId.deserialize(deserializer);
    const function_name = Identifier.deserialize(deserializer);
    const type_args = deserializer.deserializeVector(TypeTag);

    const length = deserializer.deserializeUleb128AsU32();
    const args: Array<EntryFunctionArgument> = new Array<EntryFunctionBytes>();

    for (let i = 0; i < length; i += 1) {
      const fixedBytesLength = deserializer.deserializeUleb128AsU32();
      const fixedBytes = EntryFunctionBytes.deserialize(deserializer, fixedBytesLength);
      args.push(fixedBytes);
    }

    return new EntryFunction(module_name, function_name, type_args, args);
  }
}

/**
 * Represents a Script that can be serialized and deserialized.
 * Scripts contain the Move bytecode payload that can be submitted to the Aptos chain for execution.
 * @group Implementation
 * @category Transactions
 */
export class Script {
  /**
   * The move module bytecode
   * @group Implementation
   * @category Transactions
   */
  public readonly bytecode: Uint8Array;

  /**
   * The type arguments that the bytecode function requires.
   * @group Implementation
   * @category Transactions
   */
  public readonly type_args: Array<TypeTag>;

  /**
   * The arguments that the bytecode function requires.
   * @group Implementation
   * @category Transactions
   */
  public readonly args: Array<ScriptFunctionArgument>;

  /**
   * Scripts contain the Move bytecodes payload that can be submitted to Aptos chain for execution.
   *
   * @param bytecode The move module bytecode
   * @param type_args The type arguments that the bytecode function requires.
   *
   * @example
   * A coin transfer function has one type argument "CoinType".
   * ```
   * public(script) fun transfer<CoinType>(from: &signer, to: address, amount: u64)
   * ```
   * @param args The arguments that the bytecode function requires.
   *
   * @example
   * A coin transfer function has three arguments "from", "to" and "amount".
   * ```
   * public(script) fun transfer<CoinType>(from: &signer, to: address, amount: u64)
   * ```
   * @group Implementation
   * @category Transactions
   */
  constructor(bytecode: Uint8Array, type_args: Array<TypeTag>, args: Array<ScriptFunctionArgument>) {
    this.bytecode = bytecode;
    this.type_args = type_args;
    this.args = args;
  }

  serialize(serializer: Serializer): void {
    serializer.serializeBytes(this.bytecode);
    serializer.serializeVector<TypeTag>(this.type_args);
    serializer.serializeU32AsUleb128(this.args.length);
    this.args.forEach((item: ScriptFunctionArgument) => {
      item.serializeForScriptFunction(serializer);
    });
  }

  static deserialize(deserializer: Deserializer): Script {
    const bytecode = deserializer.deserializeBytes();
    const type_args = deserializer.deserializeVector(TypeTag);
    const length = deserializer.deserializeUleb128AsU32();
    const args = new Array<ScriptFunctionArgument>();
    for (let i = 0; i < length; i += 1) {
      // Note that we deserialize directly to the Move value, not its Script argument representation.
      // We are abstracting away the Script argument representation because knowing about it is
      // functionally useless.
      const scriptArgument = deserializeFromScriptArgument(deserializer);
      args.push(scriptArgument);
    }
    return new Script(bytecode, type_args, args);
  }
}

/**
 * Represents a MultiSig account that can be serialized and deserialized.
 *
 * This class encapsulates the functionality to manage multi-signature transactions, including the address of the
 * multi-sig account and the associated transaction payload.
 * @group Implementation
 * @category Transactions
 */
export class MultiSig {
  public readonly multisig_address: AccountAddress;

  public readonly transaction_payload?: MultiSigTransactionPayload;

  /**
   * Contains the payload to run a multi-sig account transaction.
   *
   * @param multisig_address The multi-sig account address the transaction will be executed as.
   *
   * @param transaction_payload The payload of the multi-sig transaction. This is optional when executing a multi-sig
   *  transaction whose payload is already stored on chain.
   * @group Implementation
   * @category Transactions
   */
  constructor(multisig_address: AccountAddress, transaction_payload?: MultiSigTransactionPayload) {
    this.multisig_address = multisig_address;
    this.transaction_payload = transaction_payload;
  }

  serialize(serializer: Serializer): void {
    this.multisig_address.serialize(serializer);
    // Options are encoded with an extra u8 field before the value - 0x0 is none and 0x1 is present.
    // We use serializeBool below to create this prefix value.
    if (this.transaction_payload === undefined) {
      serializer.serializeBool(false);
    } else {
      serializer.serializeBool(true);
      this.transaction_payload.serialize(serializer);
    }
  }

  static deserialize(deserializer: Deserializer): MultiSig {
    const multisig_address = AccountAddress.deserialize(deserializer);
    const payloadPresent = deserializer.deserializeBool();
    let transaction_payload;
    if (payloadPresent) {
      transaction_payload = MultiSigTransactionPayload.deserialize(deserializer);
    }
    return new MultiSig(multisig_address, transaction_payload);
  }
}

/**
 * Represents a multi-signature transaction payload that can be serialized and deserialized.
 * This class is designed to encapsulate the transaction payload for multi-sig account transactions
 * as defined in the `multisig_account.move` module. Future enhancements may allow support for script
 * payloads as the `multisig_account.move` module evolves.
 * @group Implementation
 * @category Transactions
 */
export class MultiSigTransactionPayload extends Serializable {
  public readonly transaction_payload: EntryFunction;

  /**
   * Contains the payload to run a multi-sig account transaction.
   *
   * @param transaction_payload The payload of the multi-sig transaction.
   * This can only be EntryFunction for now but,
   * Script might be supported in the future.
   * @group Implementation
   * @category Transactions
   */
  constructor(transaction_payload: EntryFunction) {
    super();
    this.transaction_payload = transaction_payload;
  }

  serialize(serializer: Serializer): void {
    /**
     * We can support multiple types of inner transaction payload in the future.
     * For now, it's only EntryFunction but if we support more types,
     * we need to serialize with the right enum values here
     * @group Implementation
     * @category Transactions
     */
    serializer.serializeU32AsUleb128(0);
    this.transaction_payload.serialize(serializer);
  }

  static deserialize(deserializer: Deserializer): MultiSigTransactionPayload {
    // TODO: Support other types of payload beside EntryFunction.
    // This is the enum value indicating which type of payload the multisig tx contains.
    deserializer.deserializeUleb128AsU32();
    return new MultiSigTransactionPayload(EntryFunction.deserialize(deserializer));
  }
}