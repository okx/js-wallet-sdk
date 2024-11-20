// Copyright © Aptos Foundation
// SPDX-License-Identifier: Apache-2.0

import { AccountAddressInput } from "../../core";
import { generateTransaction } from "../../internal/transactionSubmission";
import { InputGenerateTransactionPayloadData, InputGenerateTransactionOptions } from "../../transactions";
import { MultiAgentTransaction } from "../../transactions/instances/multiAgentTransaction";
import { SimpleTransaction } from "../../transactions/instances/simpleTransaction";
import { AptosConfig } from "../aptosConfig";

/**
 * A class to handle all `Build` transaction operations
 */
export class Build {
  readonly config: AptosConfig;

  constructor(config: AptosConfig) {
    this.config = config;
  }

  /**
   * Build a simple transaction
   *
   * @param args.sender The sender account address
   * @param args.data The transaction data
   * @param args.options optional. Optional transaction configurations
   * @param args.withFeePayer optional. Whether there is a fee payer for the transaction
   *
   * @returns SimpleTransaction
   */
  async simple(args: {
    sender: AccountAddressInput;
    data: InputGenerateTransactionPayloadData;
    options?: InputGenerateTransactionOptions;
    withFeePayer?: boolean;
  }): Promise<SimpleTransaction> {
    return generateTransaction({ aptosConfig: this.config, ...args });
  }

  /**
   * Build a multi agent transaction
   *
   * @param args.sender The sender account address
   * @param args.data The transaction data
   * @param args.secondarySignerAddresses An array of the secondary signers account addresses
   * @param args.options optional. Optional transaction configurations
   * @param args.withFeePayer optional. Whether there is a fee payer for the transaction
   *
   * @returns MultiAgentTransaction
   */
  async multiAgent(args: {
    sender: AccountAddressInput;
    data: InputGenerateTransactionPayloadData;
    secondarySignerAddresses: AccountAddressInput[];
    options?: InputGenerateTransactionOptions;
    withFeePayer?: boolean;
  }): Promise<MultiAgentTransaction> {
    return generateTransaction({ aptosConfig: this.config, ...args });
  }
}
