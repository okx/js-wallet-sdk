/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 Blockstack Inc.
 * https://github.com/hirosystems/stacks.js/blob/main/LICENSE
 * */

import { base } from '@okxweb3/crypto-lib';

type NodeCryptoCreateHash = typeof import('crypto').createHash;

export interface Sha2Hash {
  digest(data: Uint8Array, algorithm?: 'sha256' | 'sha512'): Promise<Uint8Array>;
}

export class NodeCryptoSha2Hash {
  createHash: NodeCryptoCreateHash;

  constructor(createHash: NodeCryptoCreateHash) {
    this.createHash = createHash;
  }

  async digest(data: Uint8Array, algorithm = 'sha256'): Promise<Uint8Array> {
    try {
      const result = this.createHash(algorithm).update(data).digest();
      return Promise.resolve(result);
    } catch (error) {
      console.log(error);
      console.log(
        `Error performing ${algorithm} digest with Node.js 'crypto.createHash', falling back to JS implementation.`
      );
      return Promise.resolve(algorithm === 'sha256' ? hashSha256Sync(data) : hashSha512Sync(data));
    }
  }
}

export function hashSha256Sync(data: Uint8Array) {
  return base.sha256(data);
}

export function hashSha512Sync(data: Uint8Array) {
  return base.sha512(data);
}
