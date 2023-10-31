/**
 * The following methods are based on `metamask/eth-sig-util`, thanks for their work
 * https://github.com/MetaMask/eth-sig-util
 * Copyright (c) 2020 MetaMask
 * Distributed under the ISC software license, see the accompanying
 * file LICENSE or https://opensource.org/license/isc-license-txt/.
 */

import {
  bufferToHex, isHexString,
  keccak, keccak256, numberToBuffer,
} from '../ethereumjs-util';

import {
  legacyToBuffer
} from './index';

import {abi,base} from '@okxweb3/crypto-lib'
import {is, pattern, Struct, string} from "superstruct";
/**
 * This is the message format used for `V1` of `signTypedData`.
 */
export type TypedDataV1 = TypedDataV1Field[];
declare const TextEncoder: any;

// '0'.charCodeAt(0) === 48
const HEX_MINIMUM_NUMBER_CHARACTER = 48;

// '9'.charCodeAt(0) === 57
const HEX_MAXIMUM_NUMBER_CHARACTER = 58;
const HEX_CHARACTER_OFFSET = 87;

export type Hex = `0x${string}`;
const NUMBER_REGEX = /^u?int(?<length>[0-9]*)?$/u;

const BUFFER_WIDTH = 32;

export const StrictHexStruct = pattern(string(), /^0x[0-9a-f]+$/iu) as Struct<
    Hex,
    null
    >;

/**
 * This represents a single field in a `V1` `signTypedData` message.
 *
 * @property name - The name of the field.
 * @property type - The type of a field (must be a supported Solidity type).
 * @property value - The value of the field.
 */
export interface TypedDataV1Field {
  name: string;
  type: string;
  value: any;
}

/**
 * Represents the version of `signTypedData` being used.
 *
 * V1 is based upon [an early version of EIP-712](https://github.com/ethereum/EIPs/pull/712/commits/21abe254fe0452d8583d5b132b1d7be87c0439ca)
 * that lacked some later security improvements, and should generally be neglected in favor of
 * later versions.
 *
 * V3 is based on EIP-712, except that arrays and recursive data structures are not supported.
 *
 * V4 is based on EIP-712, and includes full support of arrays and recursive data structures.
 */
export enum SignTypedDataVersion {
  V1 = 'V1',
  V3 = 'V3',
  V4 = 'V4',
}

export interface MessageTypeProperty {
  name: string;
  type: string;
}

export interface MessageTypes {
  EIP712Domain: MessageTypeProperty[];
  [additionalProperties: string]: MessageTypeProperty[];
}

export type Bytes = bigint | number | string | Uint8Array;

export function assert(condition: any, errorMsg: string) {
  if(!condition) {
    throw new Error(errorMsg)
  }

}
/**
 * Convert a `number` to a `Uint8Array`.
 *
 * @param value - The number to convert to bytes.
 * @returns The bytes as `Uint8Array`.
 * @throws If the number is not a safe integer.
 */
export function numberToBytes(value: number): Uint8Array {
  assert(typeof value === 'number', 'Value must be a number.');
  assert(value >= 0, 'Value must be a non-negative number.');
  assert(
      Number.isSafeInteger(value),
      'Value is not a safe integer. Use `bigIntToBytes` instead.',
  );

  const hexadecimal = value.toString(16);
  return hexToBytes(hexadecimal);
}

/**
 * Convert a `string` to a UTF-8 encoded `Uint8Array`.
 *
 * @param value - The string to convert to bytes.
 * @returns The bytes as `Uint8Array`.
 */
export function stringToBytes(value: string): Uint8Array {
  assert(typeof value === 'string', 'Value must be a string.');

  return new TextEncoder().encode(value);
}

/**
 * Check if a value is a `Uint8Array`.
 *
 * @param value - The value to check.
 * @returns Whether the value is a `Uint8Array`.
 */
export function isBytes(value: unknown): value is Uint8Array {
  return value instanceof Uint8Array;
}

/**
 * Convert a byte-like value to a `Uint8Array`. The value can be a `Uint8Array`,
 * a `bigint`, a `number`, or a `string`.
 *
 * This will attempt to guess the type of the value based on its type and
 * contents. For more control over the conversion, use the more specific
 * conversion functions, such as {@link hexToBytes} or {@link stringToBytes}.
 *
 * If the value is a `string`, and it is prefixed with `0x`, it will be
 * interpreted as a hexadecimal string. Otherwise, it will be interpreted as a
 * UTF-8 string. To convert a hexadecimal string to bytes without interpreting
 * it as a UTF-8 string, use {@link hexToBytes} instead.
 *
 * If the value is a `bigint`, it is assumed to be unsigned. To convert a signed
 * `bigint` to bytes, use {@link signedBigIntToBytes} instead.
 *
 * If the value is a `Uint8Array`, it will be returned as-is.
 *
 * @param value - The value to convert to bytes.
 * @returns The bytes as `Uint8Array`.
 */
export function valueToBytes(value: Bytes): Uint8Array {
  if (typeof value === 'bigint') {
    return bigIntToBytes(value);
  }

  if (typeof value === 'number') {
    return numberToBytes(value);
  }

  if (typeof value === 'string') {
    if (value.startsWith('0x')) {
      return hexToBytes(value);
    }

    return stringToBytes(value);
  }

  if (isBytes(value)) {
    return value;
  }

  throw new TypeError(`Unsupported value type: "${typeof value}".`);
}

/**
 * Concatenate multiple byte-like values into a single `Uint8Array`. The values
 * can be `Uint8Array`, `bigint`, `number`, or `string`. This uses
 * {@link valueToBytes} under the hood to convert each value to bytes. Refer to
 * the documentation of that function for more information.
 *
 * @param values - The values to concatenate.
 * @returns The concatenated bytes as `Uint8Array`.
 */
export function concatBytes(values: Bytes[]): Uint8Array {
  const normalizedValues = new Array(values.length);
  let byteLength = 0;

  for (let i = 0; i < values.length; i++) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const value = valueToBytes(values[i]!);

    normalizedValues[i] = value;
    byteLength += value.length;
  }

  const bytes = new Uint8Array(byteLength);
  for (let i = 0, offset = 0; i < normalizedValues.length; i++) {
    // While we could simply spread the values into an array and use
    // `Uint8Array.from`, that is a lot slower than using `Uint8Array.set`.
    bytes.set(normalizedValues[i], offset);
    offset += normalizedValues[i].length;
  }

  return bytes;
}

/**
 * Assert that a value is a valid hex string.
 *
 * @param value - The value to check.
 * @throws If the value is not a valid hex string.
 */
export function assertIsHexString(value: unknown): asserts value is string {
  // @ts-ignore
  assert(isHexString(value), 'Value must be a hexadecimal string.');
}

/**
 * Strictly check if a string is a valid hex string. A valid hex string must
 * start with the "0x"-prefix.
 *
 * @param value - The value to check.
 * @returns Whether the value is a valid hex string.
 */
export function isStrictHexString(value: unknown): value is Hex {
  return is(value, StrictHexStruct);
}

/**
 * Convert a hexadecimal string to a `Uint8Array`. The string can optionally be
 * prefixed with `0x`. It accepts even and odd length strings.
 *
 * If the value is "0x", an empty `Uint8Array` is returned.
 *
 * @param value - The hexadecimal string to convert to bytes.
 * @returns The bytes as `Uint8Array`.
 */
export function hexToBytes(value: string): Uint8Array {
  // "0x" is often used as empty byte array.
  if (value?.toLowerCase?.() === '0x') {
    return new Uint8Array();
  }

  assertIsHexString(value);

  // Remove the `0x` prefix if it exists, and pad the string to have an even
  // number of characters.
  const strippedValue = remove0x(value).toLowerCase();
  const normalizedValue =
      strippedValue.length % 2 === 0 ? strippedValue : `0${strippedValue}`;
  const bytes = new Uint8Array(normalizedValue.length / 2);

  for (let i = 0; i < bytes.length; i++) {
    // While this is not the prettiest way to convert a hexadecimal string to a
    // `Uint8Array`, it is a lot faster than using `parseInt` to convert each
    // character.
    const c1 = normalizedValue.charCodeAt(i * 2);
    const c2 = normalizedValue.charCodeAt(i * 2 + 1);
    const n1 =
        c1 -
        (c1 < HEX_MAXIMUM_NUMBER_CHARACTER
            ? HEX_MINIMUM_NUMBER_CHARACTER
            : HEX_CHARACTER_OFFSET);
    const n2 =
        c2 -
        (c2 < HEX_MAXIMUM_NUMBER_CHARACTER
            ? HEX_MINIMUM_NUMBER_CHARACTER
            : HEX_CHARACTER_OFFSET);

    bytes[i] = n1 * 16 + n2;
  }

  return bytes;
}

/**
 * Add the `0x`-prefix to a hexadecimal string. If the string already has the
 * prefix, it is returned as-is.
 *
 * @param hexadecimal - The hexadecimal string to add the prefix to.
 * @returns The prefixed hexadecimal string.
 */
export function add0x(hexadecimal: string): Hex {
  if (hexadecimal.startsWith('0x')) {
    return hexadecimal as Hex;
  }

  if (hexadecimal.startsWith('0X')) {
    return `0x${hexadecimal.substring(2)}`;
  }

  return `0x${hexadecimal}`;
}

/**
 * Remove the `0x`-prefix from a hexadecimal string. If the string doesn't have
 * the prefix, it is returned as-is.
 *
 * @param hexadecimal - The hexadecimal string to remove the prefix from.
 * @returns The un-prefixed hexadecimal string.
 */
export function remove0x(hexadecimal: string): string {
  if (hexadecimal.startsWith('0x') || hexadecimal.startsWith('0X')) {
    return hexadecimal.substring(2);
  }

  return hexadecimal;
}

/**
 * Convert a `bigint` to a `Uint8Array`.
 *
 * This assumes that the `bigint` is an unsigned integer. To convert a signed
 * `bigint` instead, use {@link signedBigIntToBytes}.
 *
 * @param value - The bigint to convert to bytes.
 * @returns The bytes as `Uint8Array`.
 */
export function bigIntToBytes(value: bigint): Uint8Array {
  assert(typeof value === 'bigint', 'Value must be a bigint.');
  assert(value >= BigInt(0), 'Value must be a non-negative bigint.');

  const hexadecimal = value.toString(16);
  return hexToBytes(hexadecimal);
}

/**
 * Add padding to a buffer. If the buffer is larger than `length`, this function won't do anything. If it's smaller, the
 * buffer will be padded to the specified length, with extra zeroes at the start.
 *
 * @param buffer - The buffer to add padding to.
 * @param length - The number of bytes to pad the buffer to.
 * @returns The padded buffer.
 */
export function padStart(
    buffer: Uint8Array,
    length = BUFFER_WIDTH,
): Uint8Array {
  const padding = new Uint8Array(Math.max(length - buffer.length, 0)).fill(
      0x00,
  );

  return concatBytes([padding, buffer]);
};

/**
 * Get the error stack from a value. If the value is an error, the error's stack
 * is returned. Otherwise, it returns `undefined`.
 *
 * @param error - The value to get an error stack from.
 * @returns The error stack, or `undefined` if the value is not an error.
 * @internal
 */
export const getErrorStack = (error?: unknown): string | undefined => {
  if (error instanceof Error) {
    return error.stack;
  }

  return undefined;
};

/**
 * Get the length of the specified type. If a length is not specified, if the
 * length is out of range (8 <= n <= 256), or if the length is not a multiple of
 * 8, this will throw an error.
 *
 * @param type - The type to get the length for.
 * @returns The bit length of the type.
 */
export const getLength = (type: string): number => {
  if (type === 'int' || type === 'uint') {
    return 256;
  }

  const match = type.match(NUMBER_REGEX);
  assert(
      match?.groups?.length,
      `Invalid number type. Expected a number type, but received "${type}".`,
  );

  // @ts-ignore
  const length = parseInt(match.groups.length, 10);
  assert(
      length >= 8 && length <= 256,
      `Invalid number length. Expected a number between 8 and 256, but received "${type}".`,
  );

  assert(
      length % 8 === 0,
      `Invalid number length. Expected a multiple of 8, but received "${type}".`,
  );

  return length;
};

/**
 * This is the message format used for `signTypeData`, for all versions
 * except `V1`.
 *
 * @template T - The custom types used by this message.
 * @property types - The custom types used by this message.
 * @property primaryType - The type of the message.
 * @property domain - Signing domain metadata. The signing domain is the intended context for the
 * signature (e.g. the dapp, protocol, etc. that it's intended for). This data is used to
 * construct the domain seperator of the message.
 * @property domain.name - The name of the signing domain.
 * @property domain.version - The current major version of the signing domain.
 * @property domain.chainId - The chain ID of the signing domain.
 * @property domain.verifyingContract - The address of the contract that can verify the signature.
 * @property domain.salt - A disambiguating salt for the protocol.
 * @property message - The message to be signed.
 */
export interface TypedMessage<T extends MessageTypes> {
  types: T;
  primaryType: keyof T;
  domain: {
    name?: string;
    version?: string;
    chainId?: number;
    verifyingContract?: string;
    salt?: ArrayBuffer;
  };
  message: Record<string, unknown>;
}

export const TYPED_MESSAGE_SCHEMA = {
  type: 'object',
  properties: {
    types: {
      type: 'object',
      additionalProperties: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            type: { type: 'string', enum: getSolidityTypes() },
          },
          required: ['name', 'type'],
        },
      },
    },
    primaryType: { type: 'string' },
    domain: { type: 'object' },
    message: { type: 'object' },
  },
  required: ['types', 'primaryType', 'domain', 'message'],
};

/**
 * Get a list of all Solidity types.
 *
 * @returns A list of all Solidity types.
 */
function getSolidityTypes() {
  const types = ['bool', 'address', 'string', 'bytes'];
  const ints = Array.from(new Array(32)).map(
      (_, index) => `int${(index + 1) * 8}`,
  );
  const uints = Array.from(new Array(32)).map(
      (_, index) => `uint${(index + 1) * 8}`,
  );
  const bytes = Array.from(new Array(32)).map(
      (_, index) => `bytes${index + 1}`,
  );

  return [...types, ...ints, ...uints, ...bytes];
}

/**
 * Validate that the given value is a valid version string.
 *
 * @param version - The version value to validate.
 * @param allowedVersions - A list of allowed versions. If omitted, all versions are assumed to be
 * allowed.
 */
function validateVersion(
    version: SignTypedDataVersion,
    allowedVersions?: SignTypedDataVersion[],
) {
  if (!Object.keys(SignTypedDataVersion).includes(version)) {
    throw new Error(`Invalid version: '${version}'`);
  } else if (allowedVersions && !allowedVersions.includes(version)) {
    throw new Error(
        `SignTypedDataVersion not allowed: '${version}'. Allowed versions are: ${allowedVersions.join(
            ', ',
        )}`,
    );
  }
}

/**
 * Parse an address string to a `Uint8Array`. The behaviour of this is quite
 * strange, in that it does not parse the address as hexadecimal string, nor as
 * UTF-8. It does some weird stuff with the string and char codes, and then
 * returns the result as a `Uint8Array`.
 *
 * This is based on the old `ethereumjs-abi` implementation, which essentially
 * calls `new BN(address, 10)` on the address string, the equivalent of calling
 * `parseInt(address, 10)` in JavaScript. This is not a valid way to parse an
 * address and would result in `NaN` in plain JavaScript, but it is the
 * behaviour of the old implementation, and so we must preserve it for backwards
 * compatibility.
 *
 * @param address - The address to parse.
 * @returns The parsed address.
 */
function reallyStrangeAddressToBytes(address: string): Uint8Array {
  let addressValue = BigInt(0);

  for (let i = 0; i < address.length; i++) {
    const character = BigInt(address.charCodeAt(i) - 48);
    addressValue *= BigInt(10);

    // 'a'
    if (character >= 49) {
      addressValue += character - BigInt(49) + BigInt(0xa);

      // 'A'
    } else if (character >= 17) {
      addressValue += character - BigInt(17) + BigInt(0xa);

      // '0' - '9'
    } else {
      addressValue += character;
    }
  }

  return padStart(bigIntToBytes(addressValue), 20);
}

/**
 * Parse a string, number, or bigint value into a `Uint8Array`.
 *
 * @param type - The type of the value.
 * @param value - The value to parse.
 * @returns The parsed value.
 */
function parseNumber(type: string, value: string | number | bigint) {
  assert(
      value !== null,
      `Unable to encode value: Invalid number. Expected a valid number value, but received "${value}".`,
  );

  const bigIntValue = BigInt(value);

  const length = getLength(type);
  const maxValue = BigInt(2) ** BigInt(length) - BigInt(1);

  // Note that this is not accurate, since the actual maximum value for unsigned
  // integers is `2 ^ (length - 1) - 1`, but this is required for backwards
  // compatibility with the old implementation.
  assert(
      bigIntValue >= -maxValue && bigIntValue <= maxValue,
      `Unable to encode value: Number "${value}" is out of range for type "${type}".`,
  );

  return bigIntValue;
}

/**
 * Encode a single field.
 *
 * @param types - All type definitions.
 * @param name - The name of the field to encode.
 * @param type - The type of the field being encoded.
 * @param value - The value to encode.
 * @param version - The EIP-712 version the encoding should comply with.
 * @returns Encoded representation of the field.
 */
function encodeField(
    types: Record<string, MessageTypeProperty[]>,
    name: string,
    type: string,
    value: any,
    version: SignTypedDataVersion.V3 | SignTypedDataVersion.V4,
): [type: string, value: any] {
  validateVersion(version, [SignTypedDataVersion.V3, SignTypedDataVersion.V4]);

  if (types[type] !== undefined) {
    return [
      'bytes32',
      version === SignTypedDataVersion.V4 && value == null // eslint-disable-line no-eq-null
          ? '0x0000000000000000000000000000000000000000000000000000000000000000'
          : keccak(encodeData(type, value, types, version)),
    ];
  }

  // `function` is supported in `@metamask/abi-utils`, but not allowed by
  // EIP-712, so we throw an error here.
  if (type === 'function') {
    throw new Error('Unsupported or invalid type: "function"');
  }

  if (value === undefined) {
    throw new Error(`missing value for field ${name} of type ${type}`);
  }

  if (type === 'address') {
    if (typeof value === 'number') {
      return ['address', padStart(numberToBytes(value), 20)];
    } else if (isStrictHexString(value)) {
      return ['address', add0x(value)];
    } else if (typeof value === 'string') {
      return ['address', reallyStrangeAddressToBytes(value).subarray(0, 20)];
    }
  }

  if (type === 'bool') {
    return ['bool', Boolean(value)];
  }

  if (type === 'bytes') {
    if (typeof value === 'number') {
      value = numberToBytes(value);
    } else if (isStrictHexString(value)) {
      value = hexToBytes(value);
    } else if (typeof value === 'string') {
      value = stringToBytes(value);
    }
    return ['bytes32', keccak(value)];
  }

  if (type.startsWith('bytes') && type !== 'bytes' && !type.includes('[')) {
    if (typeof value === 'number') {
      if (value < 0) {
        return ['bytes32', new Uint8Array(32)];
      }

      return ['bytes32', bigIntToBytes(BigInt(value))];
    } else if (isStrictHexString(value)) {
      return ['bytes32', hexToBytes(value)];
    }

    return ['bytes32', value];
  }

  if (type.startsWith('int') && !type.includes('[')) {
    const bigIntValue = parseNumber(type, value);
    if (bigIntValue >= BigInt(0)) {
      return ['uint256', bigIntValue];
    }

    return ['int256', bigIntValue];
  }

  if (type === 'string') {
    if (typeof value === 'number') {
      value = numberToBytes(value);
    } else {
      value = stringToBytes(value ?? '');
    }
    return ['bytes32', keccak(value)];
  }


  if (type.endsWith(']')) {
    if (version === SignTypedDataVersion.V3) {
      throw new Error(
          'Arrays are unimplemented in encodeData; use V4 extension',
      );
    }
    const parsedType = type.slice(0, type.lastIndexOf('['));
    const typeValuePairs = value.map((item: any) =>
        encodeField(types, name, parsedType, item, version),
    );
    // @ts-ignore
    const k = typeValuePairs.map(([t]) => t)
    // @ts-ignore
    const v = typeValuePairs.map(([, v]) => v)
    return ['bytes32', keccak(abi.RawEncode(k,v))];
  }
  return [type, value];
}

/**
 * Encodes an object by encoding and concatenating each of its members.
 *
 * @param primaryType - The root type.
 * @param data - The object to encode.
 * @param types - Type definitions for all types included in the message.
 * @param version - The EIP-712 version the encoding should comply with.
 * @returns An encoded representation of an object.
 */
function encodeData(
    primaryType: string,
    data: Record<string, unknown>,
    types: Record<string, MessageTypeProperty[]>,
    version: SignTypedDataVersion.V3 | SignTypedDataVersion.V4,
): Buffer {
  validateVersion(version, [SignTypedDataVersion.V3, SignTypedDataVersion.V4]);

  const encodedTypes = ['bytes32'];
  const encodedValues: unknown[] = [hashType(primaryType, types)];

  for (const field of types[primaryType]) {
    if (version === SignTypedDataVersion.V3 && data[field.name] === undefined) {
      continue;
    }
    const [type, value] = encodeField(
        types,
        field.name,
        field.type,
        data[field.name],
        version,
    );
    encodedTypes.push(type);
    encodedValues.push(value);
  }

  return abi.RawEncode(encodedTypes, encodedValues);
}

/**
 * Encodes the type of an object by encoding a comma delimited list of its members.
 *
 * @param primaryType - The root type to encode.
 * @param types - Type definitions for all types included in the message.
 * @returns An encoded representation of the primary type.
 */
function encodeType(
    primaryType: string,
    types: Record<string, MessageTypeProperty[]>,
): string {
  let result = '';
  const unsortedDeps = findTypeDependencies(primaryType, types);
  unsortedDeps.delete(primaryType);

  const deps = [primaryType, ...Array.from(unsortedDeps).sort()];
  for (const type of deps) {
    const children = types[type];
    if (!children) {
      throw new Error(`No type definition specified: ${type}`);
    }

    result += `${type}(${types[type]
        .map(({ name, type: t }) => `${t} ${name}`)
        .join(',')})`;
  }

  return result;
}

/**
 * Finds all types within a type definition object.
 *
 * @param primaryType - The root type.
 * @param types - Type definitions for all types included in the message.
 * @param results - The current set of accumulated types.
 * @returns The set of all types found in the type definition.
 */
function findTypeDependencies(
    primaryType: string,
    types: Record<string, MessageTypeProperty[]>,
    results: Set<string> = new Set(),
): Set<string> {
  [primaryType] = primaryType.match(/^\w*/u)!;
  if (results.has(primaryType) || types[primaryType] === undefined) {
    return results;
  }

  results.add(primaryType);

  for (const field of types[primaryType]) {
    findTypeDependencies(field.type, types, results);
  }
  return results;
}

/**
 * Hashes an object.
 *
 * @param primaryType - The root type.
 * @param data - The object to hash.
 * @param types - Type definitions for all types included in the message.
 * @param version - The EIP-712 version the encoding should comply with.
 * @returns The hash of the object.
 */
function hashStruct(
    primaryType: string,
    data: Record<string, unknown>,
    types: Record<string, MessageTypeProperty[]>,
    version: SignTypedDataVersion.V3 | SignTypedDataVersion.V4,
): Buffer {
  validateVersion(version, [SignTypedDataVersion.V3, SignTypedDataVersion.V4]);

  return keccak(encodeData(primaryType, data, types, version));
}

/**
 * Hashes the type of an object.
 *
 * @param primaryType - The root type to hash.
 * @param types - Type definitions for all types included in the message.
 * @returns The hash of the object type.
 */
function hashType(
    primaryType: string,
    types: Record<string, MessageTypeProperty[]>,
): Buffer {
  return keccak(Buffer.from(encodeType(primaryType, types)));
}

/**
 * Removes properties from a message object that are not defined per EIP-712.
 *
 * @param data - The typed message object.
 * @returns The typed message object with only allowed fields.
 */
function sanitizeData<T extends MessageTypes>(
    data: TypedMessage<T>,
): TypedMessage<T> {
  const sanitizedData: Partial<TypedMessage<T>> = {};
  for (const key in TYPED_MESSAGE_SCHEMA.properties) {
    // @ts-ignore
    if (data[key]) {
      // @ts-ignore
      sanitizedData[key] = data[key];
    }
  }
  if ('types' in sanitizedData) {
    // @ts-ignore
    sanitizedData.types = { EIP712Domain: [], ...sanitizedData.types };
  }
  return sanitizedData as Required<TypedMessage<T>>;
}

/**
 * Hash a typed message according to EIP-712. The returned message starts with the EIP-712 prefix,
 * which is "1901", followed by the hash of the domain separator, then the data (if any).
 * The result is hashed again and returned.
 *
 * This function does not sign the message. The resulting hash must still be signed to create an
 * EIP-712 signature.
 *
 * @param typedData - The typed message to hash.
 * @param version - The EIP-712 version the encoding should comply with.
 * @returns The hash of the typed message.
 */
function eip712Hash<T extends MessageTypes>(
    typedData: TypedMessage<T>,
    version: SignTypedDataVersion.V3 | SignTypedDataVersion.V4,
): Buffer {
  validateVersion(version, [SignTypedDataVersion.V3, SignTypedDataVersion.V4]);

  const sanitizedData = sanitizeData(typedData);
  const parts = [Buffer.from('1901', 'hex')];
  parts.push(
      hashStruct(
          'EIP712Domain',
          sanitizedData.domain,
          sanitizedData.types,
          version,
      ),
  );
  if (sanitizedData.primaryType !== 'EIP712Domain') {
    parts.push(
        hashStruct(
            // TODO: Validate that this is a string, so this type cast can be removed.
            sanitizedData.primaryType as string,
            sanitizedData.message,
            sanitizedData.types,
            version,
        ),
    );
  }
  return keccak(Buffer.concat(parts));
}

/**
 * A collection of utility functions used for signing typed data.
 */
export const TypedDataUtils = {
  encodeData,
  encodeType,
  hashType,
  eip712Hash,
};

/**
 * Generate the "V1" hash for the provided typed message.
 *
 * The hash will be generated in accordance with an earlier version of the EIP-712
 * specification. This hash is used in `signTypedData_v1`.
 *
 * @param typedData - The typed message.
 * @returns The '0x'-prefixed hex encoded hash representing the type of the provided message.
 */
export function typedSignatureHash(typedData: TypedDataV1Field[]): string {
  const hashBuffer = _typedSignatureHash(typedData);
  return bufferToHex(hashBuffer);
}

/**
 * Generate the "V1" hash for the provided typed message.
 *
 * The hash will be generated in accordance with an earlier version of the EIP-712
 * specification. This hash is used in `signTypedData_v1`.
 *
 * @param typedData - The typed message.
 * @returns The hash representing the type of the provided message.
 */
function _typedSignatureHash(typedData: TypedDataV1): Buffer {
  const error = new Error('Expect argument to be non-empty array');
  if (
      typeof typedData !== 'object' ||
      !('length' in typedData) ||
      !typedData.length
  ) {
    throw error;
  }

  const data = typedData.map(function (e) {
    if (e.type !== 'bytes') {
      return e.value;
    }

    return legacyToBuffer(e.value);
  });
  const types = typedData.map(function (e) {
    return e.type;
  });
  const schema = typedData.map(function (e) {
    if (!e.name) {
      throw error;
    }
    return `${e.type} ${e.name}`;
  });

  const temp1 = abi.ABI.solidityPack(new Array(typedData.length).fill('string'), schema)
  const temp2 = abi.ABI.solidityPack(types, data)
  const hash1 = keccak256(temp1)
  const hash2 = keccak256(temp2)

  const temp = abi.ABI.solidityPack(
      ['bytes32', 'bytes32'],
      [hash1, hash2],
  )
  return keccak256(temp)
}



