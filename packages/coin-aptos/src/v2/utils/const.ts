// Copyright © Aptos Foundation
// SPDX-License-Identifier: Apache-2.0

import {Network} from "./apiEndpoints";

export const DEFAULT_NETWORK = Network.MAINNET;

/**
 * The default max gas amount when none is given.
 *
 * This is the maximum number of gas units that will be used by a transaction before being rejected.
 *
 * Note that max gas amount varies based on the transaction.  A larger transaction will go over this
 * default gas amount, and the value will need to be changed for the specific transaction.
 */
export const DEFAULT_MAX_GAS_AMOUNT = 200000;

/**
 * The default transaction expiration seconds from now.
 *
 * This time is how long until the blockchain nodes will reject the transaction.
 *
 * Note that the transaction expiration time varies based on network connection and network load.  It may need to be
 * increased for the transaction to be processed.
 */
export const DEFAULT_TXN_EXP_SEC_FROM_NOW = 20;

/**
 * The default gas currency for the network.
 */
export const APTOS_COIN = "0x1::aptos_coin::AptosCoin";

export const RAW_TRANSACTION_SALT = "APTOS::RawTransaction";
export const RAW_TRANSACTION_WITH_DATA_SALT = "APTOS::RawTransactionWithData";
