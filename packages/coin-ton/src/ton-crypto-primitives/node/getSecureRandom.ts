/**
 * Copyright (c) Whales Corp. 
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import crypto from 'crypto';

export function getSecureRandomBytes(size: number): Buffer {
    return crypto.randomBytes(size);
}

export function getSecureRandomWords(size: number): Uint16Array {
    let res = new Uint16Array(size);
    crypto.randomFillSync(res);
    return res;
}