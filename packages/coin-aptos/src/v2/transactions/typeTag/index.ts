// Copyright © Aptos Foundation
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import { Deserializer } from "../../bcs/deserializer";
import { Serializable, Serializer } from "../../bcs/serializer";
import { AccountAddress } from "../../core";
import { Identifier } from "../instances/identifier";
import { TypeTagVariants } from "../../types";

export abstract class TypeTag extends Serializable {
  abstract serialize(serializer: Serializer): void;

  static deserialize(deserializer: Deserializer): TypeTag {
    const index = deserializer.deserializeUleb128AsU32();
    switch (index) {
      case TypeTagVariants.Bool:
        return TypeTagBool.load(deserializer);
      case TypeTagVariants.U8:
        return TypeTagU8.load(deserializer);
      case TypeTagVariants.U64:
        return TypeTagU64.load(deserializer);
      case TypeTagVariants.U128:
        return TypeTagU128.load(deserializer);
      case TypeTagVariants.Address:
        return TypeTagAddress.load(deserializer);
      case TypeTagVariants.Signer:
        return TypeTagSigner.load(deserializer);
      case TypeTagVariants.Vector:
        return TypeTagVector.load(deserializer);
      case TypeTagVariants.Struct:
        return TypeTagStruct.load(deserializer);
      case TypeTagVariants.U16:
        return TypeTagU16.load(deserializer);
      case TypeTagVariants.U32:
        return TypeTagU32.load(deserializer);
      case TypeTagVariants.U256:
        return TypeTagU256.load(deserializer);
      case TypeTagVariants.Generic:
        // This is only used for ABI representation, and cannot actually be used as a type.
        return TypeTagGeneric.load(deserializer);
      default:
        throw new Error(`Unknown variant index for TypeTag: ${index}`);
    }
  }

  abstract toString(): string;

  isBool(): this is TypeTagBool {
    return this instanceof TypeTagBool;
  }

  isAddress(): this is TypeTagAddress {
    return this instanceof TypeTagAddress;
  }

  isGeneric(): this is TypeTagGeneric {
    return this instanceof TypeTagGeneric;
  }

  isSigner(): this is TypeTagSigner {
    return this instanceof TypeTagSigner;
  }

  isVector(): this is TypeTagVector {
    return this instanceof TypeTagVector;
  }

  isStruct(): this is TypeTagStruct {
    return this instanceof TypeTagStruct;
  }

  isU8(): this is TypeTagU8 {
    return this instanceof TypeTagU8;
  }

  isU16(): this is TypeTagU16 {
    return this instanceof TypeTagU16;
  }

  isU32(): this is TypeTagU32 {
    return this instanceof TypeTagU32;
  }

  isU64(): this is TypeTagU64 {
    return this instanceof TypeTagU64;
  }

  isU128(): this is TypeTagU128 {
    return this instanceof TypeTagU128;
  }

  isU256(): this is TypeTagU256 {
    return this instanceof TypeTagU256;
  }
}

export class TypeTagBool extends TypeTag {
  toString(): string {
    return "bool";
  }

  serialize(serializer: Serializer): void {
    serializer.serializeU32AsUleb128(TypeTagVariants.Bool);
  }

  static load(_deserializer: Deserializer): TypeTagBool {
    return new TypeTagBool();
  }
}

export class TypeTagU8 extends TypeTag {
  toString(): string {
    return "u8";
  }

  serialize(serializer: Serializer): void {
    serializer.serializeU32AsUleb128(TypeTagVariants.U8);
  }

  static load(_deserializer: Deserializer): TypeTagU8 {
    return new TypeTagU8();
  }
}

export class TypeTagU16 extends TypeTag {
  toString(): string {
    return "u16";
  }

  serialize(serializer: Serializer): void {
    serializer.serializeU32AsUleb128(TypeTagVariants.U16);
  }

  static load(_deserializer: Deserializer): TypeTagU16 {
    return new TypeTagU16();
  }
}

export class TypeTagU32 extends TypeTag {
  toString(): string {
    return "u32";
  }

  serialize(serializer: Serializer): void {
    serializer.serializeU32AsUleb128(TypeTagVariants.U32);
  }

  static load(_deserializer: Deserializer): TypeTagU32 {
    return new TypeTagU32();
  }
}

export class TypeTagU64 extends TypeTag {
  toString(): string {
    return "u64";
  }

  serialize(serializer: Serializer): void {
    serializer.serializeU32AsUleb128(TypeTagVariants.U64);
  }

  static load(_deserializer: Deserializer): TypeTagU64 {
    return new TypeTagU64();
  }
}

export class TypeTagU128 extends TypeTag {
  toString(): string {
    return "u128";
  }

  serialize(serializer: Serializer): void {
    serializer.serializeU32AsUleb128(TypeTagVariants.U128);
  }

  static load(_deserializer: Deserializer): TypeTagU128 {
    return new TypeTagU128();
  }
}

export class TypeTagU256 extends TypeTag {
  toString(): string {
    return "u256";
  }

  serialize(serializer: Serializer): void {
    serializer.serializeU32AsUleb128(TypeTagVariants.U256);
  }

  static load(_deserializer: Deserializer): TypeTagU256 {
    return new TypeTagU256();
  }
}

export class TypeTagAddress extends TypeTag {
  toString(): string {
    return "address";
  }

  serialize(serializer: Serializer): void {
    serializer.serializeU32AsUleb128(TypeTagVariants.Address);
  }

  static load(_deserializer: Deserializer): TypeTagAddress {
    return new TypeTagAddress();
  }
}

export class TypeTagSigner extends TypeTag {
  toString(): string {
    return "signer";
  }

  serialize(serializer: Serializer): void {
    serializer.serializeU32AsUleb128(TypeTagVariants.Signer);
  }

  static load(_deserializer: Deserializer): TypeTagSigner {
    return new TypeTagSigner();
  }
}

export class TypeTagReference extends TypeTag {
  toString(): `&${string}` {
    return `&${this.value.toString()}`;
  }

  constructor(public readonly value: TypeTag) {
    super();
  }

  serialize(serializer: Serializer): void {
    serializer.serializeU32AsUleb128(TypeTagVariants.Reference);
  }

  static load(deserializer: Deserializer): TypeTagReference {
    const value = TypeTag.deserialize(deserializer);
    return new TypeTagReference(value);
  }
}

/**
 * Generics are used for type parameters in entry functions.  However,
 * they are not actually serialized into a real type, so they cannot be
 * used as a type directly.
 */
export class TypeTagGeneric extends TypeTag {
  toString(): `T${number}` {
    return `T${this.value}`;
  }

  constructor(public readonly value: number) {
    super();
    if (value < 0) throw new Error("Generic type parameter index cannot be negative");
  }

  serialize(serializer: Serializer): void {
    serializer.serializeU32AsUleb128(TypeTagVariants.Generic);
    serializer.serializeU32(this.value);
  }

  static load(deserializer: Deserializer): TypeTagGeneric {
    const value = deserializer.deserializeU32();
    return new TypeTagGeneric(value);
  }
}

export class TypeTagVector extends TypeTag {
  toString(): `vector<${string}>` {
    return `vector<${this.value.toString()}>`;
  }

  constructor(public readonly value: TypeTag) {
    super();
  }

  static u8(): TypeTagVector {
    return new TypeTagVector(new TypeTagU8());
  }

  serialize(serializer: Serializer): void {
    serializer.serializeU32AsUleb128(TypeTagVariants.Vector);
    this.value.serialize(serializer);
  }

  static load(deserializer: Deserializer): TypeTagVector {
    const value = TypeTag.deserialize(deserializer);
    return new TypeTagVector(value);
  }
}

export class TypeTagStruct extends TypeTag {
  toString(): `0x${string}::${string}::${string}` {
    // Collect type args and add it if there are any
    let typePredicate = "";
    if (this.value.typeArgs.length > 0) {
      typePredicate = `<${this.value.typeArgs.map((typeArg) => typeArg.toString()).join(", ")}>`;
    }

    return `${this.value.address.toString()}::${this.value.moduleName.identifier}::${
        this.value.name.identifier
    }${typePredicate}`;
  }

  constructor(public readonly value: StructTag) {
    super();
  }

  serialize(serializer: Serializer): void {
    serializer.serializeU32AsUleb128(TypeTagVariants.Struct);
    this.value.serialize(serializer);
  }

  static load(deserializer: Deserializer): TypeTagStruct {
    const value = StructTag.deserialize(deserializer);
    return new TypeTagStruct(value);
  }

  isTypeTag(address: AccountAddress, moduleName: string, structName: string): boolean {
    return (
        this.value.moduleName.identifier === moduleName &&
        this.value.name.identifier === structName &&
        this.value.address.equals(address)
    );
  }

  isString(): boolean {
    return this.isTypeTag(AccountAddress.ONE, "string", "String");
  }

  isOption(): boolean {
    return this.isTypeTag(AccountAddress.ONE, "option", "Option");
  }

  isObject(): boolean {
    return this.isTypeTag(AccountAddress.ONE, "object", "Object");
  }
}

export class StructTag extends Serializable {
  public readonly address: AccountAddress;

  public readonly moduleName: Identifier;

  public readonly name: Identifier;

  public readonly typeArgs: Array<TypeTag>;

  constructor(address: AccountAddress, module_name: Identifier, name: Identifier, type_args: Array<TypeTag>) {
    super();
    this.address = address;
    this.moduleName = module_name;
    this.name = name;
    this.typeArgs = type_args;
  }

  serialize(serializer: Serializer): void {
    serializer.serialize(this.address);
    serializer.serialize(this.moduleName);
    serializer.serialize(this.name);
    serializer.serializeVector(this.typeArgs);
  }

  static deserialize(deserializer: Deserializer): StructTag {
    const address = AccountAddress.deserialize(deserializer);
    const moduleName = Identifier.deserialize(deserializer);
    const name = Identifier.deserialize(deserializer);
    const typeArgs = deserializer.deserializeVector(TypeTag);
    return new StructTag(address, moduleName, name, typeArgs);
  }
}

export function aptosCoinStructTag(): StructTag {
  return new StructTag(AccountAddress.ONE, new Identifier("aptos_coin"), new Identifier("AptosCoin"), []);
}

export function stringStructTag(): StructTag {
  return new StructTag(AccountAddress.ONE, new Identifier("string"), new Identifier("String"), []);
}

export function optionStructTag(typeArg: TypeTag): StructTag {
  return new StructTag(AccountAddress.ONE, new Identifier("option"), new Identifier("Option"), [typeArg]);
}

export function objectStructTag(typeArg: TypeTag): StructTag {
  return new StructTag(AccountAddress.ONE, new Identifier("object"), new Identifier("Object"), [typeArg]);
}
