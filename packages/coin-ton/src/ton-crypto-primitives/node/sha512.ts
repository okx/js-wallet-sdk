/**
 * Copyright (c) Whales Corp. 
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import crypto from 'crypto';

export async function sha512(source: Buffer | string): Promise<Buffer> {
    return crypto.createHash('sha512').update(source).digest();
}