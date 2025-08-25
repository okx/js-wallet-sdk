// Copyright © Aptos Foundation
// SPDX-License-Identifier: Apache-2.0

import { bytesToHex, hexToBytes } from "@noble/hashes/utils";
import { ParsingError, ParsingResult } from "../core/common";
import { HexInput } from "../types";

/**
 * Provides reasons for parsing failures related to hexadecimal values.
 * @group Implementation
 * @category Serialization
 */
export enum HexInvalidReason {
  TOO_SHORT = "too_short",
  INVALID_LENGTH = "invalid_length",
  INVALID_HEX_CHARS = "invalid_hex_chars",
}

/**
 * NOTE: Do not use this class when working with account addresses; use AccountAddress instead.
 * When accepting hex data as input to a function, prefer to accept HexInput and
 *
 * A helper class for working with hex data. Hex data, when represented as a string,
 * generally looks like this, for example: 0xaabbcc, 45cd32, etc.
 *
 * then use the static helper methods of this class to convert it into the desired
 * format. This enables the greatest flexibility for the developer.
 *
 * Example usage:
 * ```typescript
 * getTransactionByHash(txnHash: HexInput): Promise<Transaction> {
 *   const txnHashString = Hex.fromHexInput(txnHash).toString();
 *   return await getTransactionByHashInner(txnHashString);
 * }
 * ```
 * This call to `Hex.fromHexInput().toString()` converts the HexInput to a hex string
 * with a leading 0x prefix, regardless of what the input format was.
 *
 * Other ways to chain the functions together:
 * - `Hex.fromHexString({ hexInput: "0x1f" }).toUint8Array()`
 * - `new Hex([1, 3]).toStringWithoutPrefix()`
 * @group Implementation
 * @category Serialization
 */
export class Hex {
  private readonly data: Uint8Array;

  /**
   * Create a new Hex instance from a Uint8Array.
   *
   * @param data - The Uint8Array containing the data to initialize the Hex instance.
   * @group Implementation
   * @category Serialization
   */
  constructor(data: Uint8Array) {
    this.data = data;
  }

  // ===
  // Methods for representing an instance of Hex as other types.
  // ===

  /**
   * Get the inner hex data as a Uint8Array. The inner data is already a Uint8Array, so no conversion takes place.
   *
   * @returns Hex data as Uint8Array
   * @group Implementation
   * @category Serialization
   */
  toUint8Array(): Uint8Array {
    return this.data;
  }

  /**
   * Get the hex data as a string without the 0x prefix.
   *
   * @returns Hex string without 0x prefix
   * @group Implementation
   * @category Serialization
   */
  toStringWithoutPrefix(): string {
    return bytesToHex(this.data);
  }

  /**
   * Get the hex data as a string with the 0x prefix.
   *
   * @returns Hex string with 0x prefix
   * @group Implementation
   * @category Serialization
   */
  toString(): string {
    return `0x${this.toStringWithoutPrefix()}`;
  }

  // ===
  // Methods for creating an instance of Hex from other types.
  // ===

  /**
   * Converts a hex string into a Hex instance, allowing for both prefixed and non-prefixed formats.
   *
   * @param str - A hex string, with or without the 0x prefix.
   *
   * @throws ParsingError - If the hex string is too short, has an odd number of characters, or contains invalid hex characters.
   *
   * @returns Hex - The resulting Hex instance created from the provided string.
   * @group Implementation
   * @category Serialization
   */
  static fromHexString(str: string): Hex {
    let input = str;

    if (input.startsWith("0x")) {
      input = input.slice(2);
    }

    if (input.length === 0) {
      throw new ParsingError(
          "Hex string is too short, must be at least 1 char long, excluding the optional leading 0x.",
          HexInvalidReason.TOO_SHORT,
      );
    }

    if (input.length % 2 !== 0) {
      throw new ParsingError("Hex string must be an even number of hex characters.", HexInvalidReason.INVALID_LENGTH);
    }

    try {
      return new Hex(hexToBytes(input));
    } catch (error: any) {
      throw new ParsingError(
          `Hex string contains invalid hex characters: ${error?.message}`,
          HexInvalidReason.INVALID_HEX_CHARS,
      );
    }
  }

  /**
   * Converts an instance of HexInput, which can be a string or a Uint8Array, into a Hex instance.
   * This function is useful for transforming hexadecimal representations into a structured Hex object for further manipulation.
   *
   * @param hexInput - A HexInput which can be a string or Uint8Array.
   * @returns A Hex instance created from the provided hexInput.
   * @group Implementation
   * @category Serialization
   */
  static fromHexInput(hexInput: HexInput): Hex {
    if (hexInput instanceof Buffer) return new Hex(new Uint8Array(hexInput));
    if (hexInput instanceof Uint8Array) return new Hex(hexInput);
    if (typeof hexInput === "string") return Hex.fromHexString(hexInput);
    throw new Error(`Invalid hex input type: ${typeof hexInput}`);
  }

  /**
   * Converts an instance of HexInput, which can be a string or a Uint8Array, into a Uint8Array.
   *
   * @param hexInput - A HexInput which can be a string or Uint8Array.
   * @returns A Uint8Array created from the provided hexInput.
   */
  static hexInputToUint8Array(hexInput: HexInput): Uint8Array {
    if (hexInput instanceof Uint8Array) return hexInput;
    return Hex.fromHexString(hexInput).toUint8Array();
  }

  /**
   * Converts a HexInput (string or Uint8Array) to a hex string with '0x' prefix.
   *
   * @param hexInput - The input to convert, either a hex string (with/without '0x' prefix) or Uint8Array
   * @returns A hex string with '0x' prefix (e.g., "0x1234")
   *
   * @example
   * ```typescript
   * Hex.hexInputToString("1234")        // returns "0x1234"
   * Hex.hexInputToString("0x1234")      // returns "0x1234"
   * Hex.hexInputToString(new Uint8Array([0x12, 0x34])) // returns "0x1234"
   * ```
   */
  static hexInputToString(hexInput: HexInput): string {
    return Hex.fromHexInput(hexInput).toString();
  }

  /**
   * Converts a HexInput (string or Uint8Array) to a hex string without '0x' prefix.
   *
   * @param hexInput - The input to convert, either a hex string (with/without '0x' prefix) or Uint8Array
   * @returns A hex string without '0x' prefix (e.g., "1234")
   *
   * @example
   * ```typescript
   * Hex.hexInputToStringWithoutPrefix("1234")        // returns "1234"
   * Hex.hexInputToStringWithoutPrefix("0x1234")      // returns "1234"
   * Hex.hexInputToStringWithoutPrefix(new Uint8Array([0x12, 0x34])) // returns "1234"
   * ```
   */
  static hexInputToStringWithoutPrefix(hexInput: HexInput): string {
    return Hex.fromHexInput(hexInput).toStringWithoutPrefix();
  }

  // ===
  // Methods for checking validity.
  // ===

  /**
   * Check if the provided string is a valid hexadecimal representation.
   *
   * @param str - A hex string representing byte data.
   *
   * @returns An object containing:
   *  - valid: A boolean indicating whether the string is valid.
   *  - invalidReason: The reason for invalidity if the string is not valid.
   *  - invalidReasonMessage: A message explaining why the string is invalid.
   * @group Implementation
   * @category Serialization
   */
  static isValid(str: string): ParsingResult<HexInvalidReason> {
    try {
      Hex.fromHexString(str);
      return { valid: true };
    } catch (error: any) {
      return {
        valid: false,
        invalidReason: error?.invalidReason,
        invalidReasonMessage: error?.message,
      };
    }
  }

  /**
   * Determine if two Hex instances are equal by comparing their underlying byte data.
   *
   * @param other The Hex instance to compare to.
   * @returns true if the Hex instances are equal, false if not.
   * @group Implementation
   * @category Serialization
   */
  equals(other: Hex): boolean {
    if (this.data.length !== other.data.length) return false;
    return this.data.every((value, index) => value === other.data[index]);
  }
}