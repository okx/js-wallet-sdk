// Copyright © Aptos Foundation
// SPDX-License-Identifier: Apache-2.0

/**
 * This file handles the transaction creation lifecycle.
 * It holds different operations to generate a transaction payload, a raw transaction,
 * and a signed transaction that can be simulated, signed and submitted to chain.
 */
import {sha3_256 as sha3Hash} from "@noble/hashes/sha3";
import { AptosConfig } from "../../api/aptosConfig";
import {AccountAddress, AccountAddressInput, Hex, PublicKey} from "../../core";
import {Account} from "../../core/account";
import {AnyPublicKey} from "../../core/crypto/anyPublicKey";
import {AnySignature} from "../../core/crypto/anySignature";
import {Ed25519PublicKey, Ed25519Signature} from "../../core/crypto/ed25519";
import {Secp256k1PublicKey, Secp256k1Signature} from "../../core/crypto/secp256k1";
import {
    DEFAULT_MAX_GAS_AMOUNT,
    DEFAULT_TXN_EXP_SEC_FROM_NOW,
    RAW_TRANSACTION_SALT,
    RAW_TRANSACTION_WITH_DATA_SALT,
} from "../../utils/const";
import {
    AccountAuthenticator,
    AccountAuthenticatorEd25519,
    AccountAuthenticatorMultiKey,
    AccountAuthenticatorSingleKey,
} from "../authenticator/account";
import {
    TransactionAuthenticatorEd25519,
    TransactionAuthenticatorFeePayer,
    TransactionAuthenticatorMultiAgent,
    TransactionAuthenticatorSingleSender,
} from "../authenticator/transaction";
import {
    ChainId,
    EntryFunction,
    FeePayerRawTransaction,
    MultiAgentRawTransaction,
    MultiSig,
    MultiSigTransactionPayload,
    RawTransaction,
    Script,
    TransactionPayloadEntryFunction,
    TransactionPayloadMultiSig,
    TransactionPayloadScript,
} from "../instances";
import {SignedTransaction} from "../instances/signedTransaction";
import {
    AnyRawTransaction,
    AnyTransactionPayloadInstance,
    AnyRawTransactionInstance,
    EntryFunctionArgumentTypes,
    EntryFunctionABI,
    InputGenerateMultiAgentRawTransactionArgs,
    InputGenerateRawTransactionArgs,
    InputGenerateSingleSignerRawTransactionArgs,
    SimpleTransaction,
    InputGenerateTransactionOptions,
    MultiAgentTransaction,
    InputScriptData,
    InputSimulateTransactionData,
    InputGenerateTransactionPayloadData,
    InputEntryFunctionData,
    InputMultiSigData,
    InputMultiSigDataWithRemoteABI,
    InputEntryFunctionDataWithRemoteABI,
    InputGenerateTransactionPayloadDataWithRemoteABI,
    InputSubmitTransactionData,
} from "../types";
import {convertArgument, fetchEntryFunctionAbi, standardizeTypeTags} from "./remoteAbi";
import {memoizeAsync} from "../../utils/memoize";
import {SigningScheme} from "../../types";
import {getFunctionParts, isScriptDataInput} from "./helpers";

/**
 * We are defining function signatures, each with its specific input and output.
 * These are the possible function signature for our `generateTransactionPayload` function.
 * When we call our `generateTransactionPayload` function with the relevant type properties,
 * Typescript can infer the return type based on the appropriate function overload.
 */
export async function generateTransactionPayload(args: InputScriptData): Promise<TransactionPayloadScript>;
export async function generateTransactionPayload(
    args: InputEntryFunctionDataWithRemoteABI,
): Promise<TransactionPayloadEntryFunction>;
export async function generateTransactionPayload(
    args: InputMultiSigDataWithRemoteABI,
): Promise<TransactionPayloadMultiSig>;

/**
 * Builds a transaction payload based on the data argument and returns
 * a transaction payload - TransactionPayloadScript | TransactionPayloadMultiSig | TransactionPayloadEntryFunction
 *
 * This uses the RemoteABI by default, and the remote ABI can be skipped by using generateTransactionPayloadWithABI
 *
 * @param args.data GenerateTransactionPayloadData
 *
 * @return TransactionPayload
 */
export async function generateTransactionPayload(
    args: InputGenerateTransactionPayloadDataWithRemoteABI,
): Promise<AnyTransactionPayloadInstance> {
    if (isScriptDataInput(args)) {
        return generateTransactionPayloadScript(args);
    }

    const {moduleAddress, moduleName, functionName} = getFunctionParts(args.function);

    // We fetch the entry function ABI, and then pretend that we already had the ABI
    const functionAbi = await memoizeAsync(
        async () => fetchEntryFunctionAbi(moduleAddress, moduleName, functionName, args.aptosConfig),
        `entry-function-${args.aptosConfig.network}-${moduleAddress}-${moduleName}-${functionName}`,
        1000 * 60 * 5, // 5 minutes
    )();

    return generateTransactionPayloadWithABI(args, functionAbi);
}

export function generateTransactionPayloadWithABI(
    args: InputEntryFunctionData,
    functionAbi: EntryFunctionABI,
): TransactionPayloadEntryFunction;
export function generateTransactionPayloadWithABI(
    args: InputMultiSigData,
    functionAbi: EntryFunctionABI,
): TransactionPayloadMultiSig;
export function generateTransactionPayloadWithABI(
    args: InputGenerateTransactionPayloadData,
    functionAbi: EntryFunctionABI,
): AnyTransactionPayloadInstance {
    if (isScriptDataInput(args)) {
        return generateTransactionPayloadScript(args);
    }

    const {moduleAddress, moduleName, functionName} = getFunctionParts(args.function);

    // Ensure that all type arguments are typed properly
    const typeArguments = standardizeTypeTags(args.typeArguments);

    // Check the type argument count against the ABI
    if (typeArguments.length !== functionAbi.typeParameters.length) {
        throw new Error(
            `Type argument count mismatch, expected ${functionAbi.typeParameters.length}, received ${typeArguments.length}`,
        );
    }

    // Check all BCS types, and convert any non-BCS types
    const functionArguments: Array<EntryFunctionArgumentTypes> = args.functionArguments.map((arg, i) =>
        convertArgument(args.function, functionAbi, arg, i, typeArguments),
    );

    // Check that all arguments are accounted for
    if (functionArguments.length !== functionAbi.parameters.length) {
        throw new Error(
            // eslint-disable-next-line max-len
            `Too few arguments for '${moduleAddress}::${moduleName}::${functionName}', expected ${functionAbi.parameters.length} but got ${functionArguments.length}`,
        );
    }

    // Generate entry function payload
    const entryFunctionPayload = EntryFunction.build(
        `${moduleAddress}::${moduleName}`,
        functionName,
        typeArguments,
        functionArguments,
    );

    // Send it as multi sig if it's a multisig payload
    if ("multisigAddress" in args) {
        const multisigAddress = AccountAddress.from(args.multisigAddress);
        return new TransactionPayloadMultiSig(
            new MultiSig(multisigAddress, new MultiSigTransactionPayload(entryFunctionPayload)),
        );
    }

    // Otherwise send as an entry function
    return new TransactionPayloadEntryFunction(entryFunctionPayload);
}

function generateTransactionPayloadScript(args: InputScriptData) {
    return new TransactionPayloadScript(
        new Script(Hex.fromHexInput(args.bytecode).toUint8Array(), args.typeArguments ?? [], args.functionArguments),
    );
}

/**
 * Generates a raw transaction
 *
 * @param args.aptosConfig AptosConfig
 * @param args.sender The transaction's sender account address as a hex input
 * @param args.payload The transaction payload - can create by using generateTransactionPayload()
 *
 * @returns RawTransaction
 */
export async function generateRawTransaction(args: {
    aptosConfig: AptosConfig;
    sender: AccountAddressInput;
    payload: AnyTransactionPayloadInstance;
    options?: InputGenerateTransactionOptions;
    chain_id?: number;
}): Promise<RawTransaction> {
    const {aptosConfig, sender, payload, options, chain_id} = args;
    let getSequenceNumber: any;
    getSequenceNumber = options?.accountSequenceNumber;
    let getGasUnitPrice: any;
    getGasUnitPrice = options?.gasUnitPrice;
    let getChainId: any;
    getChainId = chain_id;
    const [{sequence_number: sequenceNumber}, {chain_id: chainId}, {gas_estimate: gasEstimate}] = await Promise.all(
        [getSequenceNumber, getChainId, getGasUnitPrice],
    );

    const {maxGasAmount, gasUnitPrice, expireTimestamp} = {
        maxGasAmount: options?.maxGasAmount ? BigInt(options.maxGasAmount) : BigInt(DEFAULT_MAX_GAS_AMOUNT),
        gasUnitPrice: BigInt(gasEstimate),
        expireTimestamp: BigInt(Math.floor(Date.now() / 1000) + DEFAULT_TXN_EXP_SEC_FROM_NOW),
        ...options,
    };

    return new RawTransaction(
        AccountAddress.from(sender),
        BigInt(sequenceNumber),
        payload,
        BigInt(maxGasAmount),
        BigInt(gasUnitPrice),
        BigInt(expireTimestamp),
        new ChainId(chainId),
    );
}

/**
 * We are defining function signatures, each with its specific input and output.
 * These are the possible function signature for our `generateTransaction` function.
 * When we call our `generateTransaction` function with the relevant type properties,
 * Typescript can infer the return type based on the appropriate function overload.
 */
export async function buildTransaction(args: InputGenerateSingleSignerRawTransactionArgs): Promise<SimpleTransaction>;
export async function buildTransaction(args: InputGenerateMultiAgentRawTransactionArgs): Promise<MultiAgentTransaction>;

/**
 * Generates a transaction based on the provided arguments
 *
 * Note: we can start with one function to support all different payload/transaction types,
 * and if to complex to use, we could have function for each type
 *
 * @param args.aptosConfig AptosConfig
 * @param args.sender The transaction's sender account address as a hex input
 * @param args.payload The transaction payload - can create by using generateTransactionPayload()
 * @param args.options optional. Transaction options object
 * @param args.secondarySignerAddresses optional. For when want to create a multi signers transaction
 * @param args.feePayerAddress optional. For when want to create a fee payer (aka sponsored) transaction
 *
 * @return An instance of a RawTransaction, plus optional secondary/fee payer addresses
 * ```
 * {
 *  rawTransaction: RawTransaction,
 *  secondarySignerAddresses? : Array<AccountAddress>,
 *  feePayerAddress?: AccountAddress
 * }
 * ```
 */
export async function buildTransaction(args: InputGenerateRawTransactionArgs): Promise<AnyRawTransaction> {
    const {aptosConfig, sender, payload, options} = args;
    // generate raw transaction
    const rawTxn = await generateRawTransaction({
        aptosConfig,
        sender,
        payload,
        options,
    });

    // if multi agent transaction
    if ("secondarySignerAddresses" in args) {
        const signers: Array<AccountAddress> =
            args.secondarySignerAddresses?.map((signer) => AccountAddress.from(signer)) ?? [];

        return {
            rawTransaction: rawTxn,
            secondarySignerAddresses: signers,
            feePayerAddress: args.feePayerAddress ? AccountAddress.from(args.feePayerAddress) : undefined,
        };
    }
    // return the raw transaction
    return {
        rawTransaction: rawTxn,
        feePayerAddress: args.feePayerAddress ? AccountAddress.from(args.feePayerAddress) : undefined,
    };
}

/**
 * Simulate a transaction before signing and submit to chain
 *
 * @param args.transaction A aptos transaction type to sign
 * @param args.signerPublicKey The signer public key
 * @param args.secondarySignersPublicKeys optional. The secondary signers public keys if multi signers transaction
 * @param args.feePayerPublicKey optional. The fee payer public key is a fee payer (aka sponsored) transaction
 * @param args.options optional. SimulateTransactionOptions
 *
 * @returns A signed serialized transaction that can be simulated
 */
export function generateSignedTransactionForSimulation(args: InputSimulateTransactionData): Uint8Array {
    const {signerPublicKey, transaction, secondarySignersPublicKeys, feePayerPublicKey} = args;

    const accountAuthenticator = getAuthenticatorForSimulation(signerPublicKey);

    // fee payer transaction
    if (transaction.feePayerAddress) {
        const transactionToSign = new FeePayerRawTransaction(
            transaction.rawTransaction,
            transaction.secondarySignerAddresses ?? [],
            transaction.feePayerAddress,
        );
        let secondaryAccountAuthenticators: Array<AccountAuthenticator> = [];
        if (secondarySignersPublicKeys) {
            secondaryAccountAuthenticators = secondarySignersPublicKeys.map((publicKey) =>
                getAuthenticatorForSimulation(publicKey),
            );
        }
        const feePayerAuthenticator = getAuthenticatorForSimulation(feePayerPublicKey!);

        const transactionAuthenticator = new TransactionAuthenticatorFeePayer(
            accountAuthenticator,
            transaction.secondarySignerAddresses ?? [],
            secondaryAccountAuthenticators,
            {
                address: transaction.feePayerAddress,
                authenticator: feePayerAuthenticator,
            },
        );
        return new SignedTransaction(transactionToSign.raw_txn, transactionAuthenticator).bcsToBytes();
    }

    // multi agent transaction
    if (transaction.secondarySignerAddresses) {
        const transactionToSign = new MultiAgentRawTransaction(
            transaction.rawTransaction,
            transaction.secondarySignerAddresses,
        );

        let secondaryAccountAuthenticators: Array<AccountAuthenticator> = [];

        secondaryAccountAuthenticators = secondarySignersPublicKeys!.map((publicKey) =>
            getAuthenticatorForSimulation(publicKey),
        );

        const transactionAuthenticator = new TransactionAuthenticatorMultiAgent(
            accountAuthenticator,
            transaction.secondarySignerAddresses,
            secondaryAccountAuthenticators,
        );

        return new SignedTransaction(transactionToSign.raw_txn, transactionAuthenticator).bcsToBytes();
    }

    // single signer raw transaction
    let transactionAuthenticator;
    if (accountAuthenticator instanceof AccountAuthenticatorEd25519) {
        transactionAuthenticator = new TransactionAuthenticatorEd25519(
            accountAuthenticator.public_key,
            accountAuthenticator.signature,
        );
    } else if (accountAuthenticator instanceof AccountAuthenticatorSingleKey) {
        transactionAuthenticator = new TransactionAuthenticatorSingleSender(accountAuthenticator);
    } else {
        throw new Error("Invalid public key");
    }
    return new SignedTransaction(transaction.rawTransaction, transactionAuthenticator).bcsToBytes();
}

export function getAuthenticatorForSimulation(publicKey: PublicKey) {
    // TODO add support for AnyMultiKey
    if (publicKey instanceof AnyPublicKey) {
        if (publicKey.publicKey instanceof Ed25519PublicKey) {
            return new AccountAuthenticatorSingleKey(publicKey, new AnySignature(new Ed25519Signature(new Uint8Array(64))));
        }
        if (publicKey.publicKey instanceof Secp256k1PublicKey) {
            return new AccountAuthenticatorSingleKey(publicKey, new AnySignature(new Secp256k1Signature(new Uint8Array(64))));
        }
    }

    // legacy code
    return new AccountAuthenticatorEd25519(
        new Ed25519PublicKey(publicKey.toUint8Array()),
        new Ed25519Signature(new Uint8Array(64)),
    );
}

/**
 * Sign a transaction that can later be submitted to chain
 *
 * @param args.signer The signer account to sign the transaction
 * @param args.transaction A aptos transaction type to sign
 *
 * @return The signer AccountAuthenticator
 */
export function sign(args: { signer: Account; transaction: AnyRawTransaction }): AccountAuthenticator {
    const {signer, transaction} = args;

    // get the signing message
    const message = generateSigningMessage(transaction);

    // account.signMessage
    const signerSignature = signer.sign(message);

    // return account authentication
    switch (signer.signingScheme) {
        case SigningScheme.Ed25519:
            return new AccountAuthenticatorEd25519(
                new Ed25519PublicKey(signer.publicKey.toUint8Array()),
                new Ed25519Signature(signerSignature.toUint8Array()),
            );
        case SigningScheme.SingleKey:
            if (!AnyPublicKey.isPublicKey(signer.publicKey)) {
                throw new Error(`Cannot sign transaction, public key does not match ${signer.signingScheme}`);
            }
            return new AccountAuthenticatorSingleKey(signer.publicKey, new AnySignature(signerSignature));
        // TODO support MultiEd25519
        default:
            throw new Error(`Cannot sign transaction, signing scheme ${signer.signingScheme} not supported`);
    }
}

/**
 * Prepare a transaction to be submitted to chain
 *
 * @param args.transaction A aptos transaction type
 * @param args.senderAuthenticator The account authenticator of the transaction sender
 * @param args.secondarySignerAuthenticators optional. For when the transaction is a multi signers transaction
 *
 * @returns A SignedTransaction
 */
export function generateSignedTransaction(args: InputSubmitTransactionData): Uint8Array {
    const {transaction, senderAuthenticator, feePayerAuthenticator, additionalSignersAuthenticators} = args;

    const transactionToSubmit = deriveTransactionType(transaction);

    if (
        (feePayerAuthenticator || additionalSignersAuthenticators) &&
        (transactionToSubmit instanceof MultiAgentRawTransaction || transactionToSubmit instanceof FeePayerRawTransaction)
    ) {
        return generateMultiSignersSignedTransaction(
            transactionToSubmit,
            senderAuthenticator,
            feePayerAuthenticator,
            additionalSignersAuthenticators,
        );
    }

    // submit single signer transaction

    // check what instance is accountAuthenticator
    if (senderAuthenticator instanceof AccountAuthenticatorEd25519 && transactionToSubmit instanceof RawTransaction) {
        const transactionAuthenticator = new TransactionAuthenticatorEd25519(
            senderAuthenticator.public_key,
            senderAuthenticator.signature,
        );
        return new SignedTransaction(transactionToSubmit, transactionAuthenticator).bcsToBytes();
    }

    if (
        (senderAuthenticator instanceof AccountAuthenticatorSingleKey ||
            senderAuthenticator instanceof AccountAuthenticatorMultiKey) &&
        transactionToSubmit instanceof RawTransaction
    ) {
        const transactionAuthenticator = new TransactionAuthenticatorSingleSender(senderAuthenticator);
        return new SignedTransaction(transactionToSubmit, transactionAuthenticator).bcsToBytes();
    }

    throw new Error(
        `Cannot generate a signed transaction, ${senderAuthenticator} is not a supported account authentication scheme`,
    );
}

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
 * Generate a multi signers signed transaction that can be submitted to chain
 *
 * @param transaction MultiAgentRawTransaction | FeePayerRawTransaction
 * @param senderAuthenticator The account authenticator of the transaction sender
 * @param secondarySignerAuthenticators The extra signers account Authenticators
 *
 * @returns A SignedTransaction
 */
export function generateMultiSignersSignedTransaction(
    transaction: MultiAgentRawTransaction | FeePayerRawTransaction,
    senderAuthenticator: AccountAuthenticator,
    feePayerAuthenticator?: AccountAuthenticator,
    additionalSignersAuthenticators?: Array<AccountAuthenticator>,
) {
    if (transaction instanceof FeePayerRawTransaction) {
        if (!feePayerAuthenticator) {
            throw new Error("Must provide a feePayerAuthenticator argument to generate a signed fee payer transaction");
        }
        const txAuthenticatorFeePayer = new TransactionAuthenticatorFeePayer(
            senderAuthenticator,
            transaction.secondary_signer_addresses,
            additionalSignersAuthenticators ?? [],
            {
                address: transaction.fee_payer_address,
                authenticator: feePayerAuthenticator,
            },
        );
        return new SignedTransaction(transaction.raw_txn, txAuthenticatorFeePayer).bcsToBytes();
    }
    if (transaction instanceof MultiAgentRawTransaction) {
        if (!additionalSignersAuthenticators) {
            throw new Error(
                "Must provide a additionalSignersAuthenticators argument to generate a signed multi agent transaction",
            );
        }
        const multiAgentAuthenticator = new TransactionAuthenticatorMultiAgent(
            senderAuthenticator,
            transaction.secondary_signer_addresses,
            additionalSignersAuthenticators ?? [],
        );
        return new SignedTransaction(transaction.raw_txn, multiAgentAuthenticator).bcsToBytes();
    }

    throw new Error(
        `Cannot prepare multi signers transaction to submission, ${typeof transaction} transaction is not supported`,
    );
}

export function generateSigningMessage(transaction: AnyRawTransaction): Uint8Array {
    const rawTxn = deriveTransactionType(transaction);
    const hash = sha3Hash.create();

    if (rawTxn instanceof RawTransaction) {
        hash.update(RAW_TRANSACTION_SALT);
    } else if (rawTxn instanceof MultiAgentRawTransaction) {
        hash.update(RAW_TRANSACTION_WITH_DATA_SALT);
    } else if (rawTxn instanceof FeePayerRawTransaction) {
        hash.update(RAW_TRANSACTION_WITH_DATA_SALT);
    } else {
        throw new Error(`Unknown transaction type to sign on: ${rawTxn}`);
    }

    const prefix = hash.digest();

    const body = rawTxn.bcsToBytes();

    const mergedArray = new Uint8Array(prefix.length + body.length);
    mergedArray.set(prefix);
    mergedArray.set(body, prefix.length);

    return mergedArray;
}
