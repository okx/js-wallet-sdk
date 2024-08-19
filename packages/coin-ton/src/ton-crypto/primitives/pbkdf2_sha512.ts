/**
 * Copyright (c) Whales Corp. 
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { pbkdf2_sha512 as internal } from '../../ton-crypto-primitives/node';
// import { pbkdf2_sha512 as internal } from '../../ton-crypto-primitives/browser';

export function pbkdf2_sha512(key: string | Buffer, salt: string | Buffer, iterations: number, keyLen: number): Promise<Buffer> {
    return internal(key, salt, iterations, keyLen);
}