/**
 * MIT License
 *
 * Copyright (c) 2021 Sean James Han
 * https://raw.githubusercontent.com/0xs34n/starknet.js/develop/LICENSE
 * */

import { BigNumberish } from '../../utils/num';
import { Signature } from '../lib';

export type Calldata = string[];

export type Overrides = {
  maxFee?: BigNumberish;
  nonce?: BigNumberish;
  signature?: Signature;
  parseRequest: Boolean;
};
