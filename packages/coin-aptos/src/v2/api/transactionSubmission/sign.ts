// Copyright © Aptos Foundation
// SPDX-License-Identifier: Apache-2.0

import { Account } from "../../account";
import { signTransaction } from "../../internal/transactionSubmission";
import { AccountAuthenticator, AnyRawTransaction } from "../../transactions";
import { AptosConfig } from "../aptosConfig";

/**
 * A class to handle all `Sign` transaction operations
 */
export class Sign {
  readonly config: AptosConfig;

  constructor(config: AptosConfig) {
    this.config = config;
  }

  // eslint-disable-next-line class-methods-use-this
  transaction(args: { signer: Account; transaction: AnyRawTransaction }): AccountAuthenticator {
    return signTransaction({
      ...args,
    });
  }

  // eslint-disable-next-line class-methods-use-this
  transactionAsFeePayer(args: { signer: Account; transaction: AnyRawTransaction }): AccountAuthenticator {
    const { signer, transaction } = args;

    // if transaction doesnt hold a "feePayerAddress" prop it means
    // this is not a fee payer transaction
    if (!transaction.feePayerAddress) {
      throw new Error(`Transaction ${transaction} is not a Fee Payer transaction`);
    }

    // Set the feePayerAddress to the signer account address
    transaction.feePayerAddress = signer.accountAddress;

    return signTransaction({
      signer,
      transaction,
    });
  }
}
