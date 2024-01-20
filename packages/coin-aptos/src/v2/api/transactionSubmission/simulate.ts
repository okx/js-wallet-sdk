// Copyright © Aptos Foundation
// SPDX-License-Identifier: Apache-2.0

import { PublicKey } from "../../core";
import { simulateTransaction } from "../../internal/transactionSubmission";
import { AnyRawTransaction, InputSimulateTransactionOptions } from "../../transactions";
import { UserTransactionResponse } from "../../types";
import { AptosConfig } from "../aptosConfig";
import { ValidateFeePayerDataOnSimulation } from "./helpers";

/**
 * A class to handle all `Simulate` transaction operations
 */
export class Simulate {
  readonly config: AptosConfig;

  constructor(config: AptosConfig) {
    this.config = config;
  }

  /**
   * Simulate a simple transaction
   *
   * @param args.signerPublicKey The signer public key
   * @param args.transaction An instance of a raw transaction
   * @param args.options optional. Optional transaction configurations
   * @param args.feePayerPublicKey optional. The fee payer public key if it is a fee payer transaction
   *
   * @returns Array<UserTransactionResponse>
   */
  @ValidateFeePayerDataOnSimulation
  async simple(args: {
    signerPublicKey: PublicKey;
    transaction: AnyRawTransaction;
    feePayerPublicKey?: PublicKey;
    options?: InputSimulateTransactionOptions;
  }): Promise<Array<UserTransactionResponse>> {
    return simulateTransaction({ aptosConfig: this.config, ...args });
  }

  /**
   * Simulate a multi agent transaction
   *
   * @param args.signerPublicKey The signer public key
   * @param args.transaction An instance of a raw transaction
   * @param args.secondarySignersPublicKeys An array of the secondary signers public keys
   * @param args.options optional. Optional transaction configurations
   * @param args.feePayerPublicKey optional. The fee payer public key if it is a fee payer transaction
   *
   * @returns Array<UserTransactionResponse>
   */
  @ValidateFeePayerDataOnSimulation
  async multiAgent(args: {
    signerPublicKey: PublicKey;
    transaction: AnyRawTransaction;
    secondarySignersPublicKeys: Array<PublicKey>;
    feePayerPublicKey?: PublicKey;
    options?: InputSimulateTransactionOptions;
  }): Promise<Array<UserTransactionResponse>> {
    return simulateTransaction({ aptosConfig: this.config, ...args });
  }
}
