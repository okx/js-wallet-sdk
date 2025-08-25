// Copyright © Aptos Foundation
// SPDX-License-Identifier: Apache-2.0

import {AccountAddress} from "../core";
import {MoveFunctionId, MoveStructId} from "../types";

/**
 * Sleep for the specified amount of time in milliseconds.
 * This function can be used to introduce delays in asynchronous operations.
 *
 * @param timeMs - The time in milliseconds to sleep.
 * @group Implementation
 * @category Utils
 */
export async function sleep(timeMs: number): Promise<null> {
  return new Promise((resolve) => {
    setTimeout(resolve, timeMs);
  });
}

/**
 * Get the error message from an unknown error.
 *
 * @param error The error to get the message from
 * @returns The error message
 * @group Implementation
 * @category Utils
 */
export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/**
 * @group Implementation
 * @category Utils
 */
export const nowInSeconds = () => Math.floor(Date.now() / 1000);

/**
 * Floors the given timestamp to the nearest whole hour.
 * This function is useful for normalizing timestamps to hourly intervals.
 *
 * @param timestampInSeconds - The timestamp in seconds to be floored.
 * @group Implementation
 * @category Utils
 */
export function floorToWholeHour(timestampInSeconds: number): number {
  const date = new Date(timestampInSeconds * 1000);
  // Reset minutes and seconds to zero
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return Math.floor(date.getTime() / 1000);
}

/**
 * Amount is represented in the smallest unit format on chain, this function converts
 * a human-readable amount format to the smallest unit format
 * @example
 * human-readable amount format: 500
 * on chain amount format when decimal is 8: 50000000000
 *
 * @param value The value in human-readable format
 * @param decimal The token decimal
 * @returns The value in the smallest units
 * @group Implementation
 * @category Utils
 */
export const convertAmountFromHumanReadableToOnChain = (value: number, decimal: number) => value * 10 ** decimal;

/**
 * Amount is represented in the smallest unit format on chain, this function converts
 * the smallest unit format to a human-readable amount format
 * @example
 * human-readable amount format: 500
 * on chain amount format when decimal is 8: 50000000000
 *
 * @param value The value in human-readable format
 * @param decimal The token decimal
 * @returns The value in the smallest units
 * @group Implementation
 * @category Utils
 */
export const convertAmountFromOnChainToHumanReadable = (value: number, decimal: number) => value / 10 ** decimal;

/**
 * Convert a hex string to an ascii string with the `0x` prefix.
 *
 * `0x6170746f735f636f696e` --> `aptos_coin`
 *
 * @param hex The hex string to convert (e.g. `0x6170746f735f636f696e`)
 * @returns The ascii string
 * @group Implementation
 * @category Utils
 */
const hexToAscii = (hex: string) => {
  let str = "";
  for (let n = 2; n < hex.length; n += 2) {
    str += String.fromCharCode(parseInt(hex.substring(n, n + 2), 16));
  }
  return str;
};

/**
 * Convert an encoded struct to a MoveStructId.
 *
 * @example
 * const structObj = {
 *   account_address: "0x1",
 *   module_name: "0x6170746f735f636f696e",
 *   struct_name: "0x4170746f73436f696e",
 * };
 * // structId is "0x1::aptos_coin::AptosCoin"
 * const structId = parseEncodedStruct(structObj);
 *
 * @param structObj The struct with account_address, module_name, and struct_name properties
 * @returns The MoveStructId
 * @group Implementation
 * @category Utils
 */
export const parseEncodedStruct = (structObj: {
  account_address: string;
  module_name: string;
  struct_name: string;
}): MoveStructId => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { account_address, module_name, struct_name } = structObj;
  const moduleName = hexToAscii(module_name);
  const structName = hexToAscii(struct_name);
  return `${account_address}::${moduleName}::${structName}`;
};

/**
 * Determines whether the given object is an encoded struct type with the following properties:
 * - account_address: string
 * - module_name: string
 * - struct_name: string
 *
 * @param structObj The object to check
 * @returns Whether the object is an encoded struct type
 * @group Implementation
 * @category Utils
 */
export const isEncodedStruct = (
    structObj: any,
): structObj is {
  account_address: string;
  module_name: string;
  struct_name: string;
} =>
    typeof structObj === "object" &&
    !Array.isArray(structObj) &&
    structObj !== null &&
    "account_address" in structObj &&
    "module_name" in structObj &&
    "struct_name" in structObj &&
    typeof structObj.account_address === "string" &&
    typeof structObj.module_name === "string" &&
    typeof structObj.struct_name === "string";

/**
 * Splits a function identifier into its constituent parts: module address, module name, and function name.
 * This function helps in validating and extracting details from a function identifier string.
 *
 * @param functionArg - The function identifier string in the format "moduleAddress::moduleName::functionName".
 * @returns An object containing the module address, module name, and function name.
 * @throws Error if the function identifier does not contain exactly three parts.
 * @group Implementation
 * @category Transactions
 */
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

/**
 * Validates the provided function information.
 *
 * @param functionInfo - The function information to validate.
 * @returns Whether the function information is valid.
 * @group Implementation
 * @category Utils
 */
export function isValidFunctionInfo(functionInfo: string): boolean {
  const parts = functionInfo.split("::");
  return parts.length === 3 && AccountAddress.isValid({ input: parts[0] }).valid;
}

/**
 * Truncates the provided wallet address at the middle with an ellipsis.
 *
 * @param address - The wallet address to truncate.
 * @param start - The number of characters to show at the beginning of the address.
 * @param end - The number of characters to show at the end of the address.
 * @returns The truncated address.
 * @group Implementation
 * @category Utils
 */
export function truncateAddress(address: string, start: number = 6, end: number = 5) {
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}