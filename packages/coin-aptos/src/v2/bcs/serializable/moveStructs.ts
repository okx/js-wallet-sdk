// Copyright © Aptos Foundation
// SPDX-License-Identifier: Apache-2.0

import { Bool, U128, U16, U256, U32, U64, U8 } from "./movePrimitives";
import { Serializable, Serializer } from "../serializer";
import { Deserializable, Deserializer } from "../deserializer";
import { AnyNumber, HexInput, ScriptTransactionArgumentVariants } from "../../types";
import { EntryFunctionArgument, TransactionArgument } from "../../transactions/instances/transactionArgument";
import {Hex} from "../../core/hex";
declare const TextEncoder: any;

/**
 * This class is the Aptos Typescript SDK representation of a Move `vector<T>`,
 * where `T` represents either a primitive type (`bool`, `u8`, `u64`, ...)
 * or a BCS-serializable struct itself.
 *
 * It is a BCS-serializable, array-like type that contains an array of values of type `T`,
 * where `T` is a class that implements `Serializable`.
 *
 * The purpose of this class is to facilitate easy construction of BCS-serializable
 * Move `vector<T>` types.
 *
 * @example
 * // in Move: `vector<u8> [1, 2, 3, 4];`
 * const vecOfU8s = new MoveVector<U8>([new U8(1), new U8(2), new U8(3), new U8(4)]);
 * // in Move: `std::bcs::to_bytes(vector<u8> [1, 2, 3, 4]);`
 * const bcsBytes = vecOfU8s.toUint8Array();
 *
 * // vector<vector<u8>> [ vector<u8> [1], vector<u8> [1, 2, 3, 4], vector<u8> [5, 6, 7, 8] ];
 * const vecOfVecs = new MoveVector<MoveVector<U8>>([
 *   new MoveVector<U8>([new U8(1)]),
 *   MoveVector.U8([1, 2, 3, 4]),
 *   MoveVector.U8([5, 6, 7, 8]),
 * ]);
 *
 * // vector<Option<u8>> [ std::option::some<u8>(1), std::option::some<u8>(2) ];
 * const vecOfOptionU8s = new MoveVector<MoveOption<U8>>([
 *    MoveOption.U8(1),
 *    MoveOption.U8(2),
 * ]);
 *
 * // vector<MoveString> [ std::string::utf8(b"hello"), std::string::utf8(b"world") ];
 * const vecOfStrings = new MoveVector([new MoveString("hello"), new MoveString("world")]);
 * const vecOfStrings2 = MoveVector.MoveString(["hello", "world"]);
 *
 * @param values an Array<T> of values where T is a class that implements Serializable
 * @returns a `MoveVector<T>` with the values `values`
 * @group Implementation
 * @category BCS
 */
export class MoveVector<T extends Serializable & EntryFunctionArgument>
    extends Serializable
    implements TransactionArgument
{
  public values: Array<T>;

  /**
   * Initializes a new instance of the class with an optional value.
   * This constructor sets up the internal vector based on the provided value.
   *
   * @param values - The initial value to be stored in the vector, or null to initialize an empty vector.
   * @group Implementation
   * @category BCS
   */
  constructor(values: Array<T>) {
    super();
    this.values = values;
  }

  /**
   * Serializes the current instance into a byte sequence suitable for entry functions.
   * This allows the data to be properly formatted for transmission or storage.
   *
   * @param serializer - The serializer instance used to serialize the byte sequence.
   * @group Implementation
   * @category BCS
   */
  serializeForEntryFunction(serializer: Serializer): void {
    const bcsBytes = this.bcsToBytes();
    serializer.serializeBytes(bcsBytes);
  }

  /**
   * NOTE: This function will only work when the inner values in the `MoveVector` are `U8`s.
   * @param serializer
   * @group Implementation
   * @category BCS
   */

  /**
   * Serialize the string as a fixed byte string without the length prefix for use in a script function.
   * @param serializer - The serializer used to convert the byte vector into a format suitable for a script function.
   * @group Implementation
   * @category BCS
   */
  serializeForScriptFunction(serializer: Serializer): void {
    // This checks if the type of a non-empty vector is of type other than U8.  If so, we use the Serialized
    // transaction argument type to serialize the argument.
    if (this.values[0] !== undefined && !(this.values[0] instanceof U8)) {
      const serialized = new Serialized(this.bcsToBytes());
      serialized.serializeForScriptFunction(serializer);
      return;
    }
    serializer.serializeU32AsUleb128(ScriptTransactionArgumentVariants.U8Vector);
    serializer.serialize(this);
  }

  /**
   * Factory method to generate a MoveVector<U8> from a `number` or `undefined`.
   *
   * This method allows you to create a MoveVector that encapsulates a U8 value, enabling you to handle optional U8 values
   * effectively.
   *
   * @param values - The values used to fill the MoveVector. If `values` is undefined or null, the resulting MoveVector's
   * `.isSome()` method will return false.
   * @returns A MoveVector<U8> with an inner value `value`.
   *
   * @example
   * ```typescript
   * const v = MoveVector.U8([1, 2, 3, 4]);
   * ```
   * @group Implementation
   * @category BCS
   */
  static U8(values: Array<number> | HexInput): MoveVector<U8> {
    let numbers: Array<number>;

    if (Array.isArray(values) && values.length === 0) {
      // Handle empty array, since it won't have a "first value"
      numbers = [];
    } else if (Array.isArray(values) && typeof values[0] === "number") {
      numbers = values;
    } else if (typeof values === "string") {
      const hex = Hex.fromHexInput(values);
      numbers = Array.from(hex.toUint8Array());
    } else if (values instanceof Uint8Array) {
      numbers = Array.from(values);
    } else {
      throw new Error("Invalid input type, must be an number[], Uint8Array, or hex string");
    }

    return new MoveVector<U8>(numbers.map((v) => new U8(v)));
  }

  /**
   * Factory method to generate a MoveOption<U16> from a `number` or `null`.
   *
   * This method allows you to create a MoveVector that can either hold a U16 value or be empty.
   *
   * @param values - The value used to fill the MoveVector. If `value` is null or undefined, the resulting MoveVector's
   * `.isSome()` method will return false.
   * @returns A MoveVector<U16> with an inner value `value`.
   * @example
   * ```typescript
   * const v = MoveVector.U16([1, 2, 3, 4]);
   * ```
   * @group Implementation
   * @category BCS

   */
  static U16(values: Array<number>): MoveVector<U16> {
    return new MoveVector<U16>(values.map((v) => new U16(v)));
  }

  /**
   * Factory method to generate a MoveVector<U32> from a `number` or `null`.
   *
   * This method allows you to create a MoveVector that can either hold a U32 value or be empty.
   *
   * @param values - The value used to fill the MoveVector. If `value` is null or undefined,
   * the resulting MoveVector's .isSome() method will return false.
   * @returns A MoveVector<U32> with an inner value `value`.
   *
   * @example
   * ```
   * const v = MoveVector.U32([1, 2, 3, 4]);
   * ```
   * @group Implementation
   * @category BCS

   */
  static U32(values: Array<number>): MoveVector<U32> {
    return new MoveVector<U32>(values.map((v) => new U32(v)));
  }

  /**
   * Factory method to generate a MoveVector<U64> from a number, bigint, or null/undefined.
   * This allows for the creation of an optional U64 value that can be checked for presence.
   *
   * @param values - The value used to fill the MoveVector. If `value` is undefined or null, the resulting MoveVector's
   * `.isSome()` method will return false.
   * @returns A MoveVector<U64> with an inner value `value`.
   *
   * @example
   * ```typescript
   * const v = MoveVector.U64([1, 2, 3, 4]);
   * ```
   * @group Implementation
   * @category BCS
   */
  static U64(values: Array<AnyNumber>): MoveVector<U64> {
    return new MoveVector<U64>(values.map((v) => new U64(v)));
  }

  /**
   * Factory method to generate a MoveVector<U128> from a number, bigint, or undefined.
   *
   * @param values - The value used to fill the MoveVector. If `value` is undefined, the resulting MoveVector's `.isSome()`
   * method will return false.
   * @returns A MoveVector<U128> with an inner value `value`.
   *
   * @example
   * ```typescript
   * const v = MoveVector.U128([1, 2, 3, 4]);
   * ```
   * @group Implementation
   * @category BCS
   */
  static U128(values: Array<AnyNumber>): MoveVector<U128> {
    return new MoveVector<U128>(values.map((v) => new U128(v)));
  }

  /**
   * Factory method to generate a MoveVector<U256> from a number, bigint, or null/undefined.
   * This allows for the creation of an optional U256 value, enabling checks for presence or absence of a value.
   *
   * @param values - The value used to fill the MoveVector. If `value` is undefined or null,
   *                the resulting MoveVector's .isSome() method will return false.
   * @returns A MoveVector<U256> with an inner value `value`.
   *
   * @example
   * ```typescript
   * const v = MoveVector.U256([1, 2, 3, 4]);
   * ```
   * @group Implementation
   * @category BCS
   */
  static U256(values: Array<AnyNumber>): MoveVector<U256> {
    return new MoveVector<U256>(values.map((v) => new U256(v)));
  }

  /**
   * Factory method to generate a MoveVector<Bool> from a `boolean` or `undefined`.
   * This method allows you to create an optional boolean value that can be used in various contexts where a boolean may or may
   * not be present.
   *
   * @param values - The value used to fill the MoveVector. If `value` is undefined, the resulting MoveVector's .isSome() method
   * will return false.
   * @returns A MoveVector<Bool> with an inner value `value`.
   *
   * @example
   *    * const v = MoveVector.Bool([true, false, true, false]);
   * @group Implementation
   * @category BCS
   */
  static Bool(values: Array<boolean>): MoveVector<Bool> {
    return new MoveVector<Bool>(values.map((v) => new Bool(v)));
  }

  /**
   * Factory method to generate a MoveVector<MoveString> from a `string` or `undefined`.
   * This function creates a MoveVector that encapsulates a MoveString if the provided value is not null or undefined.
   *
   * @param values - The value used to fill the MoveVector. If `value` is undefined, the resulting MoveVector's .isSome() method
   * will return false.
   * @returns A MoveVector<MoveString> with an inner value `value`.
   *
   * @example
   * const v = MoveVector.MoveString(["hello", "world"]);
   * @group Implementation
   * @category BCS
   */
  static MoveString(values: Array<string>): MoveVector<MoveString> {
    return new MoveVector<MoveString>(values.map((v) => new MoveString(v)));
  }

  /**
   * Serializes the current object using the provided serializer.
   * This function will serialize the value if it is present.
   *
   * @param serializer - The serializer instance used to perform the serialization.
   * @group Implementation
   * @category BCS
   */
  serialize(serializer: Serializer): void;
  serialize(serializer: Serializer): void {
    serializer.serializeVector(this.values);
  }

  /**
   * Deserialize a MoveVector of type T, specifically where T is a Serializable and Deserializable type.
   *
   * NOTE: This only works with a depth of one. Generics will not work.
   *
   * NOTE: This will not work with types that aren't of the Serializable class.
   *
   * If you're looking for a more flexible deserialization function, you can use the deserializeVector function
   * in the Deserializer class.
   *
   * @example
   * const vec = MoveVector.deserialize(deserializer, U64);
   * @param deserializer the Deserializer instance to use, with bytes loaded into it already.
   * @param cls the class to typecast the input values to, must be a Serializable and Deserializable type.
   * @returns a MoveVector of the corresponding class T
   *
   * @group Implementation
   * @category BCS
   */
  static deserialize<T extends Serializable & EntryFunctionArgument>(
      deserializer: Deserializer,
      cls: Deserializable<T>,
  ): MoveVector<T> {
    const length = deserializer.deserializeUleb128AsU32();
    const values = new Array<T>();
    for (let i = 0; i < length; i += 1) {
      values.push(cls.deserialize(deserializer));
    }
    return new MoveVector(values);
  }
}

/**
 * Represents a serialized data structure that encapsulates a byte array.
 * This class extends the Serializable class and provides methods for serialization
 * and deserialization of byte data, as well as converting to a MoveVector.
 *
 * @extends Serializable
 * @group Implementation
 * @category BCS
 */
export class Serialized extends Serializable implements TransactionArgument {
  public readonly value: Uint8Array;

  constructor(value: HexInput) {
    super();
    this.value = Hex.fromHexInput(value).toUint8Array();
  }

  serialize(serializer: Serializer): void {
    serializer.serializeBytes(this.value);
  }

  serializeForEntryFunction(serializer: Serializer): void {
    this.serialize(serializer);
  }

  serializeForScriptFunction(serializer: Serializer): void {
    serializer.serializeU32AsUleb128(ScriptTransactionArgumentVariants.Serialized);
    this.serialize(serializer);
  }

  static deserialize(deserializer: Deserializer): Serialized {
    return new Serialized(deserializer.deserializeBytes());
  }

  /**
   * Deserialize the bytecode into a MoveVector of the specified type.
   * This function allows you to convert serialized data into a usable MoveVector format.
   *
   * @param cls - The class type of the elements in the MoveVector.
   * @group Implementation
   * @category BCS
   */
  toMoveVector<T extends Serializable & EntryFunctionArgument>(cls: Deserializable<T>): MoveVector<T> {
    const deserializer = new Deserializer(this.bcsToBytes());
    deserializer.deserializeUleb128AsU32();
    const vec = deserializer.deserializeVector(cls);
    return new MoveVector(vec);
  }
}

/**
 * Represents a string value that can be serialized and deserialized.
 * This class extends the Serializable base class and provides methods
 * for serializing the string in different contexts, such as for entry
 * functions and script functions.
 *
 * @extends Serializable
 * @group Implementation
 * @category BCS
 */
export class MoveString extends Serializable implements TransactionArgument {
  public value: string;

  constructor(value: string) {
    super();
    this.value = value;
  }

  serialize(serializer: Serializer): void {
    serializer.serializeStr(this.value);
  }

  serializeForEntryFunction(serializer: Serializer): void {
    const bcsBytes = this.bcsToBytes();
    serializer.serializeBytes(bcsBytes);
  }

  serializeForScriptFunction(serializer: Serializer): void {
    // Serialize the string as a fixed byte string, i.e., without the length prefix
    const textEncoder = new TextEncoder();
    const fixedStringBytes = textEncoder.encode(this.value);
    // Put those bytes into a vector<u8> and serialize it as a script function argument
    const vectorU8 = MoveVector.U8(fixedStringBytes);
    vectorU8.serializeForScriptFunction(serializer);
  }

  static deserialize(deserializer: Deserializer): MoveString {
    return new MoveString(deserializer.deserializeStr());
  }
}

export class MoveOption<T extends Serializable & EntryFunctionArgument>
    extends Serializable
    implements EntryFunctionArgument
{
  private vec: MoveVector<T>;

  public readonly value?: T;

  constructor(value?: T | null) {
    super();
    if (typeof value !== "undefined" && value !== null) {
      this.vec = new MoveVector([value]);
    } else {
      this.vec = new MoveVector([]);
    }

    [this.value] = this.vec.values;
  }

  serializeForEntryFunction(serializer: Serializer): void {
    const bcsBytes = this.bcsToBytes();
    serializer.serializeBytes(bcsBytes);
  }

  /**
   * Retrieves the inner value of the MoveOption.
   *
   * This method is inspired by Rust's `Option<T>.unwrap()`, where attempting to unwrap a `None` value results in a panic.
   * This method will throw an error if the value is not present.
   *
   * @example
   * const option = new MoveOption<Bool>(new Bool(true));
   * const value = option.unwrap();  // Returns the Bool instance
   *
   * @throws {Error} Throws an error if the MoveOption does not contain a value.
   *
   * @returns {T} The contained value if present.
   * @group Implementation
   * @category BCS
   */
  unwrap(): T {
    if (!this.isSome()) {
      throw new Error("Called unwrap on a MoveOption with no value");
    } else {
      return this.vec.values[0];
    }
  }

  /**
   * Check if the MoveOption has a value.
   *
   * @returns {boolean} Returns true if there is exactly one value in the MoveOption.
   * @group Implementation
   * @category BCS
   */
  isSome(): boolean {
    return this.vec.values.length === 1;
  }

  serialize(serializer: Serializer): void {
    // serialize 0 or 1
    // if 1, serialize the value
    this.vec.serialize(serializer);
  }

  /**
   * Factory method to generate a MoveOption<U8> from a `number` or `undefined`.
   *
   * @example
   * MoveOption.U8(1).isSome() === true;
   * MoveOption.U8().isSome() === false;
   * MoveOption.U8(undefined).isSome() === false;
   * @param value the value used to fill the MoveOption. If `value` is undefined
   * the resulting MoveOption's .isSome() method will return false.
   * @returns a MoveOption<U8> with an inner value `value`
   * @group Implementation
   * @category BCS
   */
  static U8(value?: number | null): MoveOption<U8> {
    return new MoveOption<U8>(value !== null && value !== undefined ? new U8(value) : undefined);
  }

  /**
   * Factory method to generate a MoveOption<U16> from a `number` or `undefined`.
   *
   * @example
   * MoveOption.U16(1).isSome() === true;
   * MoveOption.U16().isSome() === false;
   * MoveOption.U16(undefined).isSome() === false;
   * @param value the value used to fill the MoveOption. If `value` is undefined
   * the resulting MoveOption's .isSome() method will return false.
   * @returns a MoveOption<U16> with an inner value `value`
   * @group Implementation
   * @category BCS
   */
  static U16(value?: number | null): MoveOption<U16> {
    return new MoveOption<U16>(value !== null && value !== undefined ? new U16(value) : undefined);
  }

  /**
   * Factory method to generate a MoveOption<U32> from a `number` or `undefined`.
   *
   * @example
   * MoveOption.U32(1).isSome() === true;
   * MoveOption.U32().isSome() === false;
   * MoveOption.U32(undefined).isSome() === false;
   * @param value the value used to fill the MoveOption. If `value` is undefined
   * the resulting MoveOption's .isSome() method will return false.
   * @returns a MoveOption<U32> with an inner value `value`
   * @group Implementation
   * @category BCS
   */
  static U32(value?: number | null): MoveOption<U32> {
    return new MoveOption<U32>(value !== null && value !== undefined ? new U32(value) : undefined);
  }

  /**
   * Factory method to generate a MoveOption<U64> from a `number` or a `bigint` or `undefined`.
   *
   * @example
   * MoveOption.U64(1).isSome() === true;
   * MoveOption.U64().isSome() === false;
   * MoveOption.U64(undefined).isSome() === false;
   * @param value the value used to fill the MoveOption. If `value` is undefined
   * the resulting MoveOption's .isSome() method will return false.
   * @returns a MoveOption<U64> with an inner value `value`
   * @group Implementation
   * @category BCS
   */
  static U64(value?: AnyNumber | null): MoveOption<U64> {
    return new MoveOption<U64>(value !== null && value !== undefined ? new U64(value) : undefined);
  }

  /**
   * Factory method to generate a MoveOption<U128> from a `number` or a `bigint` or `undefined`.
   *
   * @example
   * MoveOption.U128(1).isSome() === true;
   * MoveOption.U128().isSome() === false;
   * MoveOption.U128(undefined).isSome() === false;
   * @param value the value used to fill the MoveOption. If `value` is undefined
   * the resulting MoveOption's .isSome() method will return false.
   * @returns a MoveOption<U128> with an inner value `value`
   * @group Implementation
   * @category BCS
   */
  static U128(value?: AnyNumber | null): MoveOption<U128> {
    return new MoveOption<U128>(value !== null && value !== undefined ? new U128(value) : undefined);
  }

  /**
   * Factory method to generate a MoveOption<U256> from a `number` or a `bigint` or `undefined`.
   *
   * @example
   * MoveOption.U256(1).isSome() === true;
   * MoveOption.U256().isSome() === false;
   * MoveOption.U256(undefined).isSome() === false;
   * @param value the value used to fill the MoveOption. If `value` is undefined
   * the resulting MoveOption's .isSome() method will return false.
   * @returns a MoveOption<U256> with an inner value `value`
   * @group Implementation
   * @category BCS
   */
  static U256(value?: AnyNumber | null): MoveOption<U256> {
    return new MoveOption<U256>(value !== null && value !== undefined ? new U256(value) : undefined);
  }

  /**
   * Factory method to generate a MoveOption<Bool> from a `boolean` or `undefined`.
   *
   * @example
   * MoveOption.Bool(true).isSome() === true;
   * MoveOption.Bool().isSome() === false;
   * MoveOption.Bool(undefined).isSome() === false;
   * @param value the value used to fill the MoveOption. If `value` is undefined
   * the resulting MoveOption's .isSome() method will return false.
   * @returns a MoveOption<Bool> with an inner value `value`
   * @group Implementation
   * @category BCS
   */
  static Bool(value?: boolean | null): MoveOption<Bool> {
    return new MoveOption<Bool>(value !== null && value !== undefined ? new Bool(value) : undefined);
  }

  /**
   * Factory method to generate a MoveOption<MoveString> from a `string` or `undefined`.
   *
   * @example
   * MoveOption.MoveString("hello").isSome() === true;
   * MoveOption.MoveString("").isSome() === true;
   * MoveOption.MoveString().isSome() === false;
   * MoveOption.MoveString(undefined).isSome() === false;
   * @param value the value used to fill the MoveOption. If `value` is undefined
   * the resulting MoveOption's .isSome() method will return false.
   * @returns a MoveOption<MoveString> with an inner value `value`
   * @group Implementation
   * @category BCS
   */
  static MoveString(value?: string | null): MoveOption<MoveString> {
    return new MoveOption<MoveString>(value !== null && value !== undefined ? new MoveString(value) : undefined);
  }

  static deserialize<U extends Serializable & EntryFunctionArgument>(
      deserializer: Deserializer,
      cls: Deserializable<U>,
  ): MoveOption<U> {
    const vector = MoveVector.deserialize(deserializer, cls);
    return new MoveOption(vector.values[0]);
  }
}