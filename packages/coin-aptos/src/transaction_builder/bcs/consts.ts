/***
 *   Copyright © Aptos Foundation
 *SPDX-License-Identifier: Apache-2.0
 *
 * https://raw.githubusercontent.com/aptos-labs/aptos-core/097ea73b4a78c0166f22a269f27e514dc895afb4/ecosystem/typescript/sdk/LICENSE
 *
 * */

import { Uint128, Uint16, Uint32, Uint64, Uint8 } from "./types";

// Upper bound values for uint8, uint16, uint64 and uint128
export const MAX_U8_NUMBER: Uint8 = 2 ** 8 - 1;
export const MAX_U16_NUMBER: Uint16 = 2 ** 16 - 1;
export const MAX_U32_NUMBER: Uint32 = 2 ** 32 - 1;
export const MAX_U64_BIG_INT: Uint64 = BigInt(2 ** 64) - 1n;
export const MAX_U128_BIG_INT: Uint128 = BigInt(2 ** 128) - 1n;
