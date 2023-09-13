/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 Blockstack Inc.
 * https://github.com/hirosystems/stacks.js/blob/main/LICENSE
 * */

import { base } from '@okxweb3/crypto-lib';

export function hashRipemd160(data: Uint8Array) {
  return base.ripemd160(data);
}
