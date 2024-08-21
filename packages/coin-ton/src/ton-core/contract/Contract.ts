/**
 * Copyright (c) Whales Corp. 
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Address } from "../address/Address";
import { Cell } from "../boc/Cell";
import { StateInit } from "../types/StateInit";
import { Maybe } from "../utils/maybe";
import { ContractABI } from "./ContractABI";

export interface Contract {
    readonly address: Address;
    readonly init?: Maybe<StateInit>;
    readonly abi?: Maybe<ContractABI>;
}