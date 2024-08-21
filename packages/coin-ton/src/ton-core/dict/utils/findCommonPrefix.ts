/**
 * Copyright (c) Whales Corp. 
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export function findCommonPrefix(src: string[], startPos = 0) {

    // Corner cases
    if (src.length === 0) {
        return '';
    }

    let r = src[0].slice(startPos);

    for (let i = 1; i < src.length; i++) {
        const s = src[i];
        while (s.indexOf(r, startPos) !== startPos) {
            r = r.substring(0, r.length - 1);

            if (r === '') {
                return r;
            }
        }
    }

    return r;
}