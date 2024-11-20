// Copyright © Aptos Foundation
// SPDX-License-Identifier: Apache-2.0

import {
  EntryFunctionArgumentTypes,
  InputGenerateTransactionPayloadData,
  InputGenerateTransactionPayloadDataWithRemoteABI,
  InputScriptData,
  SimpleEntryFunctionArgumentTypes,
} from "../types";
import { Bool, FixedBytes, MoveOption, MoveString, MoveVector, U128, U16, U256, U32, U64, U8 } from "../../bcs";
import { AccountAddress } from "../../core";
import { MoveFunction, MoveFunctionId } from "../../types";

export function isBool(arg: SimpleEntryFunctionArgumentTypes): arg is boolean {
  return typeof arg === "boolean";
}

export function isString(arg: any): arg is string {
  return typeof arg === "string";
}

export function isNumber(arg: SimpleEntryFunctionArgumentTypes): arg is number {
  return typeof arg === "number";
}

export function isLargeNumber(arg: SimpleEntryFunctionArgumentTypes): arg is number | bigint | string {
  return typeof arg === "number" || typeof arg === "bigint" || typeof arg === "string";
}

export function isNull(arg: SimpleEntryFunctionArgumentTypes): arg is null | undefined {
  return arg === null || arg === undefined;
}

export function isEncodedEntryFunctionArgument(
  arg: EntryFunctionArgumentTypes | SimpleEntryFunctionArgumentTypes,
): arg is EntryFunctionArgumentTypes {
  return (
    isBcsBool(arg) ||
    isBcsU8(arg) ||
    isBcsU16(arg) ||
    isBcsU32(arg) ||
    isBcsU64(arg) ||
    isBcsU128(arg) ||
    isBcsU256(arg) ||
    isBcsAddress(arg) ||
    isBcsString(arg) ||
    isBcsFixedBytes(arg) ||
    arg instanceof MoveVector ||
    arg instanceof MoveOption
  );
}

export function isBcsBool(arg: EntryFunctionArgumentTypes | SimpleEntryFunctionArgumentTypes): arg is Bool {
  return arg instanceof Bool;
}

export function isBcsAddress(
  arg: EntryFunctionArgumentTypes | SimpleEntryFunctionArgumentTypes,
): arg is AccountAddress {
  return arg instanceof AccountAddress;
}

export function isBcsString(arg: EntryFunctionArgumentTypes | SimpleEntryFunctionArgumentTypes): arg is MoveString {
  return arg instanceof MoveString;
}

export function isBcsFixedBytes(arg: EntryFunctionArgumentTypes | SimpleEntryFunctionArgumentTypes): arg is FixedBytes {
  return arg instanceof FixedBytes;
}

export function isBcsU8(arg: EntryFunctionArgumentTypes | SimpleEntryFunctionArgumentTypes): arg is U8 {
  return arg instanceof U8;
}

export function isBcsU16(arg: EntryFunctionArgumentTypes | SimpleEntryFunctionArgumentTypes): arg is U16 {
  return arg instanceof U16;
}

export function isBcsU32(arg: EntryFunctionArgumentTypes | SimpleEntryFunctionArgumentTypes): arg is U32 {
  return arg instanceof U32;
}

export function isBcsU64(arg: EntryFunctionArgumentTypes | SimpleEntryFunctionArgumentTypes): arg is U64 {
  return arg instanceof U64;
}

export function isBcsU128(arg: EntryFunctionArgumentTypes | SimpleEntryFunctionArgumentTypes): arg is U128 {
  return arg instanceof U128;
}

export function isBcsU256(arg: EntryFunctionArgumentTypes | SimpleEntryFunctionArgumentTypes): arg is U256 {
  return arg instanceof U256;
}

export function isScriptDataInput(
  arg: InputGenerateTransactionPayloadDataWithRemoteABI | InputGenerateTransactionPayloadData,
): arg is InputScriptData {
  return "bytecode" in arg;
}

export function throwTypeMismatch(expectedType: string, position: number) {
  throw new Error(`Type mismatch for argument ${position}, expected '${expectedType}'`);
}

/**
 * Finds first non-signer arg.
 *
 * A function is often defined with a `signer` or `&signer` arguments at the start, which are filled in
 * by signatures, and not by the caller.
 * @param functionAbi
 */
export function findFirstNonSignerArg(functionAbi: MoveFunction): number {
  const index = functionAbi.params.findIndex((param) => param !== "signer" && param !== "&signer");
  if (index < 0) {
    return functionAbi.params.length;
  }
  return index;
}

export function getFunctionParts(functionArg: MoveFunctionId) {
  const funcNameParts = functionArg.split("::");
  if (funcNameParts.length !== 3) {
    throw new Error(`Invalid function ${functionArg}`);
  }
  const moduleAddress = funcNameParts[0];
  const moduleName = funcNameParts[1];
  const functionName = funcNameParts[2];
  return { moduleAddress, moduleName, functionName };
}
