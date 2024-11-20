// Copyright © Aptos Foundation
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @typescript-eslint/naming-convention */

import { Deserializer } from "../../bcs/deserializer";
import { Serializable, Serializer } from "../../bcs/serializer";
import { AccountAddress } from "../../core";
import { RawTransaction } from "./rawTransaction";

/**
 * Representation of a Raw Transaction that can serialized and deserialized
 */
export class MultiAgentTransaction extends Serializable {
  public rawTransaction: RawTransaction;

  public feePayerAddress?: AccountAddress | undefined;

  public secondarySignerAddresses: AccountAddress[];

  /**
   * SimpleTransaction represents a simple transaction type of a single signer that
   * can be submitted to Aptos chain for execution.
   *
   * SimpleTransaction metadata contains the Raw Transaction and an optional
   * sponsor Account Address to pay the gas fees.
   *
   * @param rawTransaction The Raw Tranasaction
   * @param feePayerAddress The sponsor Account Address
   */
  constructor(
    rawTransaction: RawTransaction,
    secondarySignerAddresses: AccountAddress[],
    feePayerAddress?: AccountAddress,
  ) {
    super();
    this.rawTransaction = rawTransaction;
    this.feePayerAddress = feePayerAddress;
    this.secondarySignerAddresses = secondarySignerAddresses;
  }

  serialize(serializer: Serializer): void {
    this.rawTransaction.serialize(serializer);

    serializer.serializeVector<AccountAddress>(this.secondarySignerAddresses);

    if (this.feePayerAddress === undefined) {
      serializer.serializeBool(false);
    } else {
      serializer.serializeBool(true);
      this.feePayerAddress.serialize(serializer);
    }
  }

  static deserialize(deserializer: Deserializer): MultiAgentTransaction {
    const rawTransaction = RawTransaction.deserialize(deserializer);

    const secondarySignerAddresses = deserializer.deserializeVector(AccountAddress);

    const feepayerPresent = deserializer.deserializeBool();
    let feePayerAddress;
    if (feepayerPresent) {
      feePayerAddress = AccountAddress.deserialize(deserializer);
    }

    return new MultiAgentTransaction(rawTransaction, secondarySignerAddresses, feePayerAddress);
  }
}
