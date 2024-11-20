// Copyright © Aptos Foundation
// SPDX-License-Identifier: Apache-2.0

/**
 * This file handles the generation of the signing message.
 */
import { sha3_256 as sha3Hash } from "@noble/hashes/sha3";
import { RAW_TRANSACTION_SALT, RAW_TRANSACTION_WITH_DATA_SALT } from "../../utils/const";
import { FeePayerRawTransaction, MultiAgentRawTransaction } from "../instances";
import { AnyRawTransaction, AnyRawTransactionInstance } from "../types";
import { Serializable } from "../../bcs";

/**
 * Derive the raw transaction type - FeePayerRawTransaction or MultiAgentRawTransaction or RawTransaction
 *
 * @param transaction A aptos transaction type
 *
 * @returns FeePayerRawTransaction | MultiAgentRawTransaction | RawTransaction
 */
export function deriveTransactionType(transaction: AnyRawTransaction): AnyRawTransactionInstance {
  if (transaction.feePayerAddress) {
    return new FeePayerRawTransaction(
      transaction.rawTransaction,
      transaction.secondarySignerAddresses ?? [],
      transaction.feePayerAddress,
    );
  }
  if (transaction.secondarySignerAddresses) {
    return new MultiAgentRawTransaction(transaction.rawTransaction, transaction.secondarySignerAddresses);
  }

  return transaction.rawTransaction;
}

/**
 * Generates the 'signing message' form of a message to be signed.
 *
 * @param bytes The byte representation of the message to be signed and sent to the chain
 * @param domainSeparator A domain separator that starts with 'APTOS::'
 *
 * @returns The Uint8Array of the signing message
 */
export function generateSigningMessage(bytes: Uint8Array, domainSeparator: string): Uint8Array {
  const hash = sha3Hash.create();

  if (!domainSeparator.startsWith("APTOS::")) {
    throw new Error(`Domain separator needs to start with 'APTOS::'.  Provided - ${domainSeparator}`);
  }

  hash.update(domainSeparator);

  const prefix = hash.digest();

  const body = bytes;

  const mergedArray = new Uint8Array(prefix.length + body.length);
  mergedArray.set(prefix);
  mergedArray.set(body, prefix.length);

  return mergedArray;
}

/**
 * Generates the 'signing message' form of a serilizable value. It bcs serializes the value and uses the name of
 * its constructor as the domain separator.
 *
 * @param serializable An object that has a bcs serialized form
 *
 * @returns The Uint8Array of the signing message
 */
export function generateSigningMessageForSerializable(serializable: Serializable): Uint8Array {
  return generateSigningMessage(serializable.bcsToBytes(), `APTOS::${serializable.constructor.name}`);
}

/**
 * Generates the 'signing message' form of a transaction. It derives the type of transaction and
 * applies the appropriate domain separator based on if there is extra data such as a fee payer or
 * secondary signers.
 *
 * @param transaction A transaction that is to be signed
 *
 * @returns The Uint8Array of the signing message
 */
export function generateSigningMessageForTransaction(transaction: AnyRawTransaction): Uint8Array {
  const rawTxn = deriveTransactionType(transaction);
  if (transaction.feePayerAddress) {
    return generateSigningMessage(rawTxn.bcsToBytes(), RAW_TRANSACTION_WITH_DATA_SALT);
  }
  if (transaction.secondarySignerAddresses) {
    return generateSigningMessage(rawTxn.bcsToBytes(), RAW_TRANSACTION_WITH_DATA_SALT);
  }
  return generateSigningMessage(rawTxn.bcsToBytes(), RAW_TRANSACTION_SALT);
}
