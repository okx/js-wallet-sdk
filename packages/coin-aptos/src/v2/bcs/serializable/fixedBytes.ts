// Copyright © Aptos Foundation
// SPDX-License-Identifier: Apache-2.0

import { Serializer, Serializable } from "../serializer";
import { Deserializer } from "../deserializer";
import { HexInput } from "../../types";
import { Hex } from "../../core/hex";
import { TransactionArgument } from "../../transactions/instances/transactionArgument";

/**
 *  This class exists to represent a contiguous sequence of already serialized BCS-bytes.
 *
 *  It differs from most other Serializable classes in that its internal byte buffer is serialized to BCS
 *  bytes exactly as-is, without prepending the length of the bytes.
 *
 *  If you want to write your own serialization function and pass the bytes as a transaction argument,
 *  you should use this class.
 *
 *  This class is also more generally used to represent type-agnostic BCS bytes as a vector<u8>.
 *
 *  An example of this is the bytes resulting from entry function arguments that have been serialized
 *  for an entry function.
 *
 *  @example
 *  const yourCustomSerializedBytes = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
 *  const fixedBytes = new FixedBytes(yourCustomSerializedBytes);
 *  const payload = await generateTransactionPayload({
 *    function: "0xbeefcafe::your_module::your_function_that_requires_custom_serialization",
 *    functionArguments: [yourCustomBytes],
 *  });
 *
 *  For example, if you store each of the 32 bytes for an address as a U8 in a MoveVector<U8>, when you
 *  serialize that MoveVector<U8>, it will be serialized to 33 bytes. If you solely want to pass around
 *  the 32 bytes as a Serializable class that *does not* prepend the length to the BCS-serialized representation,
 *  use this class.
 *
 * @params value: HexInput representing a sequence of Uint8 bytes
 * @returns a Serializable FixedBytes instance, which when serialized, does not prepend the length of the bytes
 * @see EntryFunctionBytes
 */
export class FixedBytes extends Serializable implements TransactionArgument {
  public value: Uint8Array;

  constructor(value: HexInput) {
    super();
    this.value = Hex.fromHexInput(value).toUint8Array();
  }

  serialize(serializer: Serializer): void {
    serializer.serializeFixedBytes(this.value);
  }

  serializeForEntryFunction(serializer: Serializer): void {
    serializer.serialize(this);
  }

  serializeForScriptFunction(serializer: Serializer): void {
    serializer.serialize(this);
  }

  static deserialize(deserializer: Deserializer, length: number): FixedBytes {
    const bytes = deserializer.deserializeFixedBytes(length);
    return new FixedBytes(bytes);
  }
}
