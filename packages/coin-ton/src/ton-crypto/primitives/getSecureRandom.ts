/**
 * Copyright (c) Whales Corp. 
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
    getSecureRandomBytes as internalBytes,
    getSecureRandomWords as internalWords
} from '../../ton-crypto-primitives/node';
// } from '../../ton-crypto-primitives/browser';

export async function getSecureRandomBytes(size: number): Promise<Buffer> {
    return internalBytes(size);
}

export async function getSecureRandomWords(size: number): Promise<Uint16Array> {
    return getSecureRandomWords(size);
}

export async function getSecureRandomNumber(min: number, max: number) {

    let range = max - min;
    var bitsNeeded = Math.ceil(Math.log2(range));
    if (bitsNeeded > 53) {
        throw new Error('Range is too large');
    }
    var bytesNeeded = Math.ceil(bitsNeeded / 8);
    var mask = Math.pow(2, bitsNeeded) - 1;

    while (true) {
        let res = await getSecureRandomBytes(bitsNeeded);
        let power = (bytesNeeded - 1) * 8;
        let numberValue = 0;
        for (var i = 0; i < bytesNeeded; i++) {
            numberValue += res[i] * Math.pow(2, power);
            power -= 8;
        }
        numberValue = numberValue & mask; // Truncate
        if (numberValue >= range) {
            continue;
        }
        return min + numberValue;
    }
}