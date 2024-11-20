// Copyright © Aptos Foundation
// SPDX-License-Identifier: Apache-2.0

import {AptosConfig} from "./aptosConfig";
/*import {
    getGasPriceEstimation,
    getTransactionByHash,
    getTransactionByVersion,
    getTransactions,
    isTransactionPending,
    waitForTransaction,
} from "../internal/transaction";*/
import {
    AnyNumber,
    CommittedTransactionResponse,
    GasEstimation,
    HexInput,
    PaginationArgs,
    PendingTransactionResponse,
    TransactionResponse,
    WaitForTransactionOptions,
} from "../types";
import {
    getSigningMessage,
    publicPackageTransaction,
    rotateAuthKey,
    signAndSubmitTransaction,
    signTransaction,
} from "../internal/transactionSubmission";
import {
    AccountAuthenticator,
    AnyRawTransaction,
    InputGenerateTransactionOptions,
    InputGenerateTransactionPayloadData,
} from "../transactions";
import {AccountAddressInput, PrivateKey} from "../core";
import {Account} from "../account";
import {Build} from "./transactionSubmission/build";
import {Simulate} from "./transactionSubmission/simulate";
import {Submit} from "./transactionSubmission/submit";
// import { TransactionManagement } from "./transactionSubmission/management";
import {SimpleTransaction} from "../transactions/instances/simpleTransaction";

export class Transaction {
    readonly config: AptosConfig;

    readonly build: Build;

    readonly simulate: Simulate;

    readonly submit: Submit;

    // readonly batch: TransactionManagement;

    constructor(config: AptosConfig) {
        this.config = config;
        this.build = new Build(this.config);
        this.simulate = new Simulate(this.config);
        this.submit = new Submit(this.config);
        // this.batch = new TransactionManagement(this.config);
    }

    /**
     * Queries on-chain transactions. This function will not return pending
     * transactions. For that, use `getTransactionsByHash`.
     *
     * @example
     * const transactions = await aptos.getTransactions()
     *
     * @param args.options.offset The number transaction to start with
     * @param args.options.limit Number of results to return
     *
     * @returns Array of on-chain transactions
     */
    /*async getTransactions(args?: { options?: PaginationArgs }): Promise<TransactionResponse[]> {
        return getTransactions({
            aptosConfig: this.config,
            ...args,
        });
    }*/

    /**
     * Queries on-chain transaction by version. This function will not return pending transactions.
     *
     * @example
     * const transaction = await aptos.getTransactions({ledgerVersion:1})
     *
     * @param args.ledgerVersion - Transaction version is an unsigned 64-bit number.
     * @returns On-chain transaction. Only on-chain transactions have versions, so this
     * function cannot be used to query pending transactions.
     */
    /*async getTransactionByVersion(args: { ledgerVersion: AnyNumber }): Promise<TransactionResponse> {
        return getTransactionByVersion({
            aptosConfig: this.config,
            ...args,
        });
    }*/

    /**
     * Queries on-chain transaction by transaction hash. This function will return pending transactions.
     *
     * @example
     * const transaction = await aptos.getTransactionByHash({transactionHash:"0x123"})
     *
     * @param args.transactionHash - Transaction hash should be hex-encoded bytes string with 0x prefix.
     * @returns Transaction from mempool (pending) or on-chain (committed) transaction
     */
    /*async getTransactionByHash(args: { transactionHash: HexInput }): Promise<TransactionResponse> {
        return getTransactionByHash({
            aptosConfig: this.config,
            ...args,
        });
    }*/

    /**
     * Defines if specified transaction is currently in pending state
     *
     * To create a transaction hash:
     *
     * 1. Create a hash message from the bytes: "Aptos::Transaction" bytes + the BCS-serialized Transaction bytes.
     * 2. Apply hash algorithm SHA3-256 to the hash message bytes.
     * 3. Hex-encode the hash bytes with 0x prefix.
     *
     * @example
     * const isPendingTransaction = await aptos.isPendingTransaction({transactionHash:"0x123"})
     *
     * @param args.transactionHash A hash of transaction
     * @returns `true` if transaction is in pending state and `false` otherwise
     */
    /*async isPendingTransaction(args: { transactionHash: HexInput }): Promise<boolean> {
        return isTransactionPending({
            aptosConfig: this.config,
            ...args,
        });
    }*/

    /**
     * Waits for a transaction to move past the pending state.
     *
     * There are 4 cases.
     * 1. Transaction is successfully processed and committed to the chain.
     *    - The function will resolve with the transaction response from the API.
     * 2. Transaction is rejected for some reason, and is therefore not committed to the blockchain.
     *    - The function will throw an AptosApiError with an HTTP status code indicating some problem with the request.
     * 3. Transaction is committed but execution failed, meaning no changes were
     *    written to the blockchain state.
     *    - If `checkSuccess` is true, the function will throw a FailedTransactionError
     *      If `checkSuccess` is false, the function will resolve with the transaction response where the `success` field is false.
     * 4. Transaction does not move past the pending state within `args.options.timeoutSecs` seconds.
     *    - The function will throw a WaitForTransactionError
     *
     * @example
     * const transaction = await aptos.waitForTransaction({transactionHash:"0x123"})
     *
     * @param args.transactionHash The hash of a transaction previously submitted to the blockchain.
     * @param args.options.timeoutSecs Timeout in seconds. Defaults to 20 seconds.
     * @param args.options.checkSuccess A boolean which controls whether the function will error if the transaction failed.
     *   Defaults to true.  See case 3 above.
     * @returns The transaction on-chain.  See above for more details.
     */
    /*async waitForTransaction(args: {
        transactionHash: HexInput;
        options?: WaitForTransactionOptions;
    }): Promise<CommittedTransactionResponse> {
        return waitForTransaction({
            aptosConfig: this.config,
            ...args,
        });
    }*/

    /**
     * Gives an estimate of the gas unit price required to get a
     * transaction on chain in a reasonable amount of time.
     * For more information {@link https://api.mainnet.aptoslabs.com/v1/spec#/operations/estimate_gas_price}
     *
     * @returns Object holding the outputs of the estimate gas API
     *
     * @example
     * const gasPrice = await aptos.waitForTransaction()
     */

    /*async getGasPriceEstimation(): Promise<GasEstimation> {
        return getGasPriceEstimation({
            aptosConfig: this.config,
        });
    }*/

    /**
     * Returns a signing message for a transaction.
     *
     * This allows a user to sign a transaction using their own preferred signing method, and
     * then submit it to the network.
     *
     * @example
     * const transaction = await aptos.transaction.build.simple({...})
     * const message = await aptos.getSigningMessage({transaction})
     *
     * @param args.transaction A raw transaction for signing elsewhere
     */
    // eslint-disable-next-line class-methods-use-this
    getSigningMessage(args: { transaction: AnyRawTransaction }): Uint8Array {
        return getSigningMessage(args);
    }

    /**
     * Generates a transaction to publish a move package to chain.
     *
     * To get the `metadataBytes` and `byteCode`, can compile using Aptos CLI with command
     * `aptos move compile --save-metadata ...`,
     * For more info {@link https://aptos.dev/tutorials/your-first-dapp/#step-4-publish-a-move-module}
     *
     * @example
     * const transaction = await aptos.publishPackageTransaction({
     *  account: alice,
     *  metadataBytes,
     *  moduleBytecode: [byteCode],
     * })
     *
     * @param args.account The publisher account
     * @param args.metadataBytes The package metadata bytes
     * @param args.moduleBytecode An array of the bytecode of each module in the package in compiler output order
     *
     * @returns A SimpleTransaction that can be simulated or submitted to chain
     */
    async publishPackageTransaction(args: {
        account: AccountAddressInput;
        metadataBytes: HexInput;
        moduleBytecode: Array<HexInput>;
        options?: InputGenerateTransactionOptions;
    }): Promise<SimpleTransaction> {
        return publicPackageTransaction({aptosConfig: this.config, ...args});
    }

    /**
     * Rotate an account's auth key. After rotation, only the new private key can be used to sign txns for
     * the account.
     * Note: Only legacy Ed25519 scheme is supported for now.
     * More info: {@link https://aptos.dev/guides/account-management/key-rotation/}
     *
     * @example
     * const response = await aptos.rotateAuthKey({
     *  fromAccount: alice,
     *  toNewPrivateKey: new ED25519PublicKey("0x123"),
     * })
     *
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
     * @example
     * const transaction = await aptos.transaction.build.simple({...})
     * const transaction = await aptos.transaction.sign({
     *  signer: alice,
     *  transaction
     * })
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
     * @example
     * const transaction = await aptos.transaction.build.simple({...})
     * const transaction = await aptos.transaction.signAsFeePayer({
     *  signer: alice,
     *  transaction
     * })
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

    // TRANSACTION SUBMISSION //

    /**
     * @deprecated Prefer to use `aptos.transaction.batch.forSingleAccount()`
     *
     * Batch transactions for a single account.
     *
     * This function uses a transaction worker that receives payloads to be processed
     * and submitted to chain.
     * Note that this process is best for submitting multiple transactions that
     * dont rely on each other, i.e batch funds, batch token mints, etc.
     *
     * If any worker failure, the functions throws an error.
     *
     * @param args.sender The sender account to sign and submit the transaction
     * @param args.data An array of transaction payloads
     * @param args.options optional. Transaction generation configurations (excluding accountSequenceNumber)
     *
     * @return void. Throws if any error
     */

    /*async batchTransactionsForSingleAccount(args: {
        sender: Account;
        data: InputGenerateTransactionPayloadData[];
        options?: Omit<InputGenerateTransactionOptions, "accountSequenceNumber">;
    }): Promise<void> {
        try {
            const { sender, data, options } = args;
            this.batch.forSingleAccount({ sender, data, options });
        } catch (error: any) {
            throw new Error(`failed to submit transactions with error: ${error}`);
        }
    }*/

    /**
     * Sign and submit a single signer transaction to chain
     *
     * @param args.signer The signer account to sign the transaction
     * @param args.transaction An instance of a RawTransaction, plus optional secondary/fee payer addresses
     *
     * @example
     * const transaction = await aptos.transaction.build.simple({...})
     * const transaction = await aptos.signAndSubmitTransaction({
     *  signer: alice,
     *  transaction
     * })
     *
     * @return PendingTransactionResponse
     */
    async signAndSubmitTransaction(args: {
        signer: Account;
        transaction: AnyRawTransaction;
    }): Promise<PendingTransactionResponse> {
        const {signer, transaction} = args;
        return signAndSubmitTransaction({
            aptosConfig: this.config,
            signer,
            transaction,
        });
    }
}
