/**
 * Copyright (c) Whales Corp. 
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import jsSHA from 'jssha';
import { hmac_sha512 as internal } from '../../ton-crypto-primitives/node';
// import { hmac_sha512 as internal } from '../../ton-crypto-primitives/browser';

export async function hmac_sha512_fallback(key: string | Buffer, data: string | Buffer): Promise<Buffer> {
    let keyBuffer: Buffer = typeof key === 'string' ? Buffer.from(key, 'utf-8') : key;
    let dataBuffer: Buffer = typeof data === 'string' ? Buffer.from(data, 'utf-8') : data;
    const shaObj = new jsSHA("SHA-512", "HEX", {
        hmacKey: { value: keyBuffer.toString('hex'), format: "HEX" },
    });
    shaObj.update(dataBuffer.toString('hex'));
    const hmac = shaObj.getHash("HEX");
    return Buffer.from(hmac, 'hex');
}

export function hmac_sha512(key: string | Buffer, data: string | Buffer): Promise<Buffer> {
    return internal(key, data);
}