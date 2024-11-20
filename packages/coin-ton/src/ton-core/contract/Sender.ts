/**
 * Copyright (c) Whales Corp. 
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Address } from "../address/Address";
import { Cell } from "../boc/Cell";
import { SendMode } from "../types/SendMode";
import { StateInit } from "../types/StateInit";
import { Maybe } from "../utils/maybe";

export type SenderArguments = {
    value: bigint,
    to: Address,
    sendMode?: Maybe<SendMode>,
    bounce?: Maybe<boolean>,
    init?: Maybe<StateInit>,
    body?: Maybe<Cell>
}

export interface Sender {
    readonly address?: Address;
    send(args: SenderArguments): Promise<void>;
}