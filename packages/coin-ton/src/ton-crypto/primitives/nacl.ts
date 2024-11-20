/**
 * Copyright (c) Whales Corp. 
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import nacl from 'tweetnacl';

export type KeyPair = {
    publicKey: Buffer;
    secretKey: Buffer;
}

export function keyPairFromSecretKey(secretKey: Buffer): KeyPair {
    let res = nacl.sign.keyPair.fromSecretKey(new Uint8Array(secretKey));

    return {
        publicKey: Buffer.from(res.publicKey),
        secretKey: Buffer.from(res.secretKey),
    }
}

export function keyPairFromSeed(secretKey: Buffer): KeyPair {
    let res = nacl.sign.keyPair.fromSeed(new Uint8Array(secretKey));

    return {
        publicKey: Buffer.from(res.publicKey),
        secretKey: Buffer.from(res.secretKey),
    }
}

export function sign(data: Buffer, secretKey: Buffer) {
    return Buffer.from(nacl.sign.detached(new Uint8Array(data), new Uint8Array(secretKey)));
}

export function signVerify(data: Buffer, signature: Buffer, publicKey: Buffer) {
    return nacl.sign.detached.verify(new Uint8Array(data), new Uint8Array(signature), new Uint8Array(publicKey));
}

export function sealBox(data: Buffer, nonce: Buffer, key: Buffer) {
    return Buffer.from(nacl.secretbox(data, nonce, key));
}

export function openBox(data: Buffer, nonce: Buffer, key: Buffer) {
    let res = nacl.secretbox.open(data, nonce, key);
    if (!res) {
        return null;
    }
    return Buffer.from(res);
}