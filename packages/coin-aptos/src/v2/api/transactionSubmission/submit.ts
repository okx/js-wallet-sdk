// Copyright © Aptos Foundation
// SPDX-License-Identifier: Apache-2.0

import {submitTransaction} from "../../internal/transactionSubmission";
import {AccountAuthenticator, AnyRawTransaction} from "../../transactions";
import {PendingTransactionResponse} from "../../types";
import {AptosConfig} from "../aptosConfig";
import {ValidateFeePayerDataOnSubmission} from "./helpers";

/**
 * A class to handle all `Submit` transaction operations
 */
export class Submit {
    readonly config: AptosConfig;

    constructor(config: AptosConfig) {
        this.config = config;
    }

    /**
     * Submit a simple transaction
     *
     * @param args.transaction An instance of a raw transaction
     * @param args.senderAuthenticator optional. The sender account authenticator
     * @param args.feePayerAuthenticator optional. The fee payer account authenticator if it is a fee payer transaction
     *
     * @returns PendingTransactionResponse
     */
    @ValidateFeePayerDataOnSubmission
    async simple(args: {
        transaction: AnyRawTransaction;
        senderAuthenticator: AccountAuthenticator;
        feePayerAuthenticator?: AccountAuthenticator;
    }): Promise<any> {
        return submitTransaction({aptosConfig: this.config, ...args});
    }

    /**
     * Submit a multi agent transaction
     *
     * @param args.transaction An instance of a raw transaction
     * @param args.senderAuthenticator optional. The sender account authenticator
     * @param args.additionalSignersAuthenticators An array of the secondary signers account authenticators
     * @param args.feePayerAuthenticator optional. The fee payer account authenticator if it is a fee payer transaction
     *
     * @returns PendingTransactionResponse
     */
    @ValidateFeePayerDataOnSubmission
    async multiAgent(args: {
        transaction: AnyRawTransaction;
        senderAuthenticator: AccountAuthenticator;
        additionalSignersAuthenticators: Array<AccountAuthenticator>;
        feePayerAuthenticator?: AccountAuthenticator;
    }): Promise<any> {
        return submitTransaction({aptosConfig: this.config, ...args});
    }
}
