// Copyright © Aptos Foundation
// SPDX-License-Identifier: Apache-2.0

import {AptosConfig} from "./aptosConfig";

import {
    TransactionResponse,
} from "../types";
import {
    rotateAuthKey,
    signTransaction,
} from "../internal/transactionSubmission";
import {
    AccountAuthenticator,
    AnyRawTransaction,

} from "../transactions";
import {Account, PrivateKey} from "../core";
import {Build} from "./transactionSubmission/build";
import {Simulate} from "./transactionSubmission/simulate";

export class Transaction {
    readonly config: AptosConfig;

    readonly build: Build;

    readonly simulate: Simulate;


    constructor(config: AptosConfig) {
        this.config = config;
        this.build = new Build(this.config);
        this.simulate = new Simulate(this.config);
    }

    /**
     * Rotate an account's auth key. After rotation, only the new private key can be used to sign txns for
     * the account.
     * Note: Only legacy Ed25519 scheme is supported for now.
     * More info: {@link https://aptos.dev/guides/account-management/key-rotation/}
     * @param args.fromAccount The account to rotate the auth key for
     * @param args.toNewPrivateKey The new private key to rotate to
     *
     * @returns PendingTransactionResponse
     */
    async rotateAuthKey(args: { fromAccount: Account; toNewPrivateKey: PrivateKey }): Promise<TransactionResponse> {
        return rotateAuthKey({aptosConfig: this.config, ...args});
    }

    /**
     * Sign a transaction that can later be submitted to chain
     *
     * @param args.signer The signer account
     * @param args.transaction A raw transaction to sign on
     *
     * @returns AccountAuthenticator
     */
    // eslint-disable-next-line class-methods-use-this
    sign(args: { signer: Account; transaction: AnyRawTransaction }): AccountAuthenticator {
        return signTransaction({
            ...args,
        });
    }

    /**
     * Sign a transaction as a fee payer that can later be submitted to chain
     *
     * @param args.signer The fee payer signer account
     * @param args.transaction A raw transaction to sign on
     *
     * @returns AccountAuthenticator
     */
    // eslint-disable-next-line class-methods-use-this
    signAsFeePayer(args: { signer: Account; transaction: AnyRawTransaction }): AccountAuthenticator {
        const {signer, transaction} = args;

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
