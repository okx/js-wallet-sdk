// Copyright © Aptos Foundation
// SPDX-License-Identifier: Apache-2.0

/**
 * This file handles the transaction creation lifecycle.
 * It holds different operations to generate a transaction payload, a raw transaction,
 * and a signed transaction that can be simulated, signed and submitted to chain.
 */
import { sha3_256 as sha3Hash } from "@noble/hashes/sha3";
import { AptosConfig } from "../../api/aptosConfig";
import { AccountAddress, AccountAddressInput, Hex, PublicKey } from "../../core";
import { AnyPublicKey, AnySignature, Secp256k1PublicKey, Secp256k1Signature } from "../../core/crypto";
import { Ed25519PublicKey, Ed25519Signature } from "../../core/crypto/ed25519";
// import { getInfo } from "../../internal/account";
// import { getLedgerInfo } from "../../internal/general";
// import { getGasPriceEstimation } from "../../internal/transaction";
import { NetworkToChainId } from "../../utils/apiEndpoints";
import { DEFAULT_MAX_GAS_AMOUNT, DEFAULT_TXN_EXP_SEC_FROM_NOW } from "../../utils/const";
import { normalizeBundle } from "../../utils/normalizeBundle";
import {
    AccountAuthenticator,
    AccountAuthenticatorEd25519,
    AccountAuthenticatorSingleKey,
} from "../authenticator/account";
import {
    TransactionAuthenticator,
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
import { SignedTransaction } from "../instances/signedTransaction";
import {
    AnyRawTransaction,
    AnyTransactionPayloadInstance,
    EntryFunctionArgumentTypes,
    InputGenerateMultiAgentRawTransactionArgs,
    InputGenerateRawTransactionArgs,
    InputGenerateSingleSignerRawTransactionArgs,
    InputGenerateTransactionOptions,
    InputScriptData,
    InputSimulateTransactionData,
    InputMultiSigDataWithRemoteABI,
    InputEntryFunctionDataWithRemoteABI,
    InputGenerateTransactionPayloadDataWithRemoteABI,
    InputSubmitTransactionData,
    InputGenerateTransactionPayloadDataWithABI,
    InputEntryFunctionDataWithABI,
    InputMultiSigDataWithABI,
    InputViewFunctionDataWithRemoteABI,
    InputViewFunctionDataWithABI,
    FunctionABI,
} from "../types";
import { convertArgument, fetchEntryFunctionAbi, /*fetchViewFunctionAbi,*/ standardizeTypeTags } from "./remoteAbi";
import { memoizeAsync } from "../../utils/memoize";
import { getFunctionParts, isScriptDataInput } from "./helpers";
import { SimpleTransaction } from "../instances/simpleTransaction";
import { MultiAgentTransaction } from "../instances/multiAgentTransaction";

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
    const { moduleAddress, moduleName, functionName } = getFunctionParts(args.function);

    const functionAbi = await fetchAbi({
        key: "entry-function",
        moduleAddress,
        moduleName,
        functionName,
        aptosConfig: args.aptosConfig,
        abi: args.abi,
        fetch: fetchEntryFunctionAbi,
    });

    // Fill in the ABI
    return generateTransactionPayloadWithABI({ ...args, abi: functionAbi });
}

export function generateTransactionPayloadWithABI(args: InputEntryFunctionDataWithABI): TransactionPayloadEntryFunction;
export function generateTransactionPayloadWithABI(args: InputMultiSigDataWithABI): TransactionPayloadMultiSig;
export function generateTransactionPayloadWithABI(
    args: InputGenerateTransactionPayloadDataWithABI,
): AnyTransactionPayloadInstance {
    const functionAbi = args.abi;
    const { moduleAddress, moduleName, functionName } = getFunctionParts(args.function);

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

// export async function generateViewFunctionPayload(args: InputViewFunctionDataWithRemoteABI): Promise<EntryFunction> {
//     const { moduleAddress, moduleName, functionName } = getFunctionParts(args.function);
//
//     const functionAbi = await fetchAbi({
//         key: "view-function",
//         moduleAddress,
//         moduleName,
//         functionName,
//         aptosConfig: args.aptosConfig,
//         abi: args.abi,
//         fetch: fetchViewFunctionAbi,
//     });
//
//     // Fill in the ABI
//     return generateViewFunctionPayloadWithABI({ abi: functionAbi, ...args });
// }

// export function generateViewFunctionPayloadWithABI(args: InputViewFunctionDataWithABI): EntryFunction {
//     const functionAbi = args.abi;
//     const { moduleAddress, moduleName, functionName } = getFunctionParts(args.function);
//
//     // Ensure that all type arguments are typed properly
//     const typeArguments = standardizeTypeTags(args.typeArguments);
//
//     // Check the type argument count against the ABI
//     if (typeArguments.length !== functionAbi.typeParameters.length) {
//         throw new Error(
//             `Type argument count mismatch, expected ${functionAbi.typeParameters.length}, received ${typeArguments.length}`,
//         );
//     }
//
//     // Check all BCS types, and convert any non-BCS types
//     const functionArguments: Array<EntryFunctionArgumentTypes> =
//         args?.functionArguments?.map((arg, i) => convertArgument(args.function, functionAbi, arg, i, typeArguments)) ?? [];
//
//     // Check that all arguments are accounted for
//     if (functionArguments.length !== functionAbi.parameters.length) {
//         throw new Error(
//             // eslint-disable-next-line max-len
//             `Too few arguments for '${moduleAddress}::${moduleName}::${functionName}', expected ${functionAbi.parameters.length} but got ${functionArguments.length}`,
//         );
//     }
//
//     // Generate entry function payload
//     return EntryFunction.build(`${moduleAddress}::${moduleName}`, functionName, typeArguments, functionArguments);
// }

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
    feePayerAddress?: AccountAddressInput;
}): Promise<RawTransaction> {
    const { aptosConfig, sender, payload, options, feePayerAddress } = args;

    /*const getChainId = async () => {
        if (NetworkToChainId[aptosConfig.network]) {
            return { chainId: NetworkToChainId[aptosConfig.network] };
        }
        const info = await getLedgerInfo({ aptosConfig });
        return { chainId: info.chain_id };
    };*/

   /* const getGasUnitPrice = async () => {
        if (options?.gasUnitPrice) {
            return { gasEstimate: options.gasUnitPrice };
        }
        const estimation = await getGasPriceEstimation({ aptosConfig });
        return { gasEstimate: estimation.gas_estimate };
    };*/

    /*const getSequenceNumberForAny = async () => {
        const getSequenceNumber = async () => {
            if (options?.accountSequenceNumber !== undefined) {
                return options.accountSequenceNumber;
            }

            return (await getInfo({ aptosConfig, accountAddress: sender })).sequence_number;
        };

        /!**
         * Check if is sponsored transaction to honor AIP-52
         * {@link https://github.com/aptos-foundation/AIPs/blob/main/aips/aip-52.md}
         *!/
        if (feePayerAddress && AccountAddress.from(feePayerAddress).equals(AccountAddress.ZERO)) {
            // Handle sponsored transaction generation with the option that
            // the main signer has not been created on chain
            try {
                // Check if main signer has been created on chain, if not assign sequence number 0
                return await getSequenceNumber();
            } catch (e: any) {
                return 0;
            }
        } else {
            return getSequenceNumber();
        }
    };*/
    /*const [{ chainId }, { gasEstimate }, sequenceNumber] = await Promise.all([
        getChainId(),
        getGasUnitPrice(),
        getSequenceNumberForAny(),
    ]);*/

    /*const { maxGasAmount, gasUnitPrice, expireTimestamp } = {
        maxGasAmount: options?.maxGasAmount ? BigInt(options.maxGasAmount) : BigInt(DEFAULT_MAX_GAS_AMOUNT),
        gasUnitPrice: options?.gasUnitPrice ?? BigInt(gasEstimate),
        expireTimestamp: options?.expireTimestamp ?? BigInt(Math.floor(Date.now() / 1000) + DEFAULT_TXN_EXP_SEC_FROM_NOW),
    };*/

    /*return new RawTransaction(
        AccountAddress.from(sender),
        BigInt(sequenceNumber),
        payload,
        BigInt(maxGasAmount),
        BigInt(gasUnitPrice),
        BigInt(expireTimestamp),
        new ChainId(chainId),
    );*/

    let getSequenceNumber: any;
    getSequenceNumber = options?.accountSequenceNumber;
    let getGasUnitPrice: any;
    getGasUnitPrice = options?.gasUnitPrice;
    let getChainId: any;
    getChainId = options?.chainId;

    const {maxGasAmount, gasUnitPrice, expireTimestamp, chainId} = {
        maxGasAmount: options?.maxGasAmount ? BigInt(options.maxGasAmount) : BigInt(DEFAULT_MAX_GAS_AMOUNT),
        gasUnitPrice: BigInt(options?.gasUnitPrice!),
        expireTimestamp: BigInt(Math.floor(Date.now() / 1000) + DEFAULT_TXN_EXP_SEC_FROM_NOW),
        ...options,
    };

    return new RawTransaction(
        AccountAddress.from(sender),
        BigInt(getSequenceNumber),
        payload,
        BigInt(maxGasAmount),
        BigInt(gasUnitPrice),
        BigInt(expireTimestamp),
        new ChainId(chainId!),
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
    const { aptosConfig, sender, payload, options, feePayerAddress } = args;
    // generate raw transaction
    const rawTxn = await generateRawTransaction({
        aptosConfig,
        sender,
        payload,
        options,
        feePayerAddress,
    });

    // if multi agent transaction
    if ("secondarySignerAddresses" in args) {
        const signers: Array<AccountAddress> =
            args.secondarySignerAddresses?.map((signer) => AccountAddress.from(signer)) ?? [];

        return new MultiAgentTransaction(
            rawTxn,
            signers,
            args.feePayerAddress ? AccountAddress.from(args.feePayerAddress) : undefined,
        );
    }
    // return the raw transaction
    return new SimpleTransaction(rawTxn, args.feePayerAddress ? AccountAddress.from(args.feePayerAddress) : undefined);
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
    const { signerPublicKey, transaction, secondarySignersPublicKeys, feePayerPublicKey } = args;

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
 * Prepare a transaction to be submitted to chain
 *
 * @param args.transaction A aptos transaction type
 * @param args.senderAuthenticator The account authenticator of the transaction sender
 * @param args.secondarySignerAuthenticators optional. For when the transaction is a multi signers transaction
 *
 * @returns A SignedTransaction
 */
export function generateSignedTransaction(args: InputSubmitTransactionData): Uint8Array {
    const { transaction, feePayerAuthenticator, additionalSignersAuthenticators } = args;
    const senderAuthenticator = normalizeBundle(AccountAuthenticator, args.senderAuthenticator);

    let txnAuthenticator: TransactionAuthenticator;
    if (transaction.feePayerAddress) {
        if (!feePayerAuthenticator) {
            throw new Error("Must provide a feePayerAuthenticator argument to generate a signed fee payer transaction");
        }
        txnAuthenticator = new TransactionAuthenticatorFeePayer(
            senderAuthenticator,
            transaction.secondarySignerAddresses ?? [],
            additionalSignersAuthenticators ?? [],
            {
                address: transaction.feePayerAddress,
                authenticator: feePayerAuthenticator,
            },
        );
    } else if (transaction.secondarySignerAddresses) {
        if (!additionalSignersAuthenticators) {
            throw new Error(
                "Must provide a additionalSignersAuthenticators argument to generate a signed multi agent transaction",
            );
        }
        txnAuthenticator = new TransactionAuthenticatorMultiAgent(
            senderAuthenticator,
            transaction.secondarySignerAddresses,
            additionalSignersAuthenticators,
        );
    } else if (senderAuthenticator instanceof AccountAuthenticatorEd25519) {
        txnAuthenticator = new TransactionAuthenticatorEd25519(
            senderAuthenticator.public_key,
            senderAuthenticator.signature,
        );
    } else {
        txnAuthenticator = new TransactionAuthenticatorSingleSender(senderAuthenticator);
    }

    return new SignedTransaction(transaction.rawTransaction, txnAuthenticator).bcsToBytes();
}

/**
 * Hashes the set of values with a SHA-3 256 hash
 * @param input array of UTF-8 strings or Uint8array byte arrays
 */
export function hashValues(input: (Uint8Array | string)[]): Uint8Array {
    const hash = sha3Hash.create();
    for (const item of input) {
        hash.update(item);
    }
    return hash.digest();
}

/**
 * The domain separated prefix for hashing transacitons
 */
const TRANSACTION_PREFIX = hashValues(["APTOS::Transaction"]);

/**
 * Generates a user transaction hash for the given transaction payload.  It must already have an authenticator
 * @param args InputSubmitTransactionData
 */
export function generateUserTransactionHash(args: InputSubmitTransactionData): string {
    const signedTransaction = generateSignedTransaction(args);

    // Transaction signature is defined as, the domain separated prefix based on struct (Transaction)
    // Then followed by the type of the transaction for the enum, UserTransaction is 0
    // Then followed by BCS encoded bytes of the signed transaction
    return new Hex(hashValues([TRANSACTION_PREFIX, new Uint8Array([0]), signedTransaction])).toString();
}

/**
 * Fetches and caches ABIs with allowing for pass-through on provided ABIs
 * @param key
 * @param moduleAddress
 * @param moduleName
 * @param functionName
 * @param aptosConfig
 * @param abi
 * @param fetch
 */
async function fetchAbi<T extends FunctionABI>({
                                                   key,
                                                   moduleAddress,
                                                   moduleName,
                                                   functionName,
                                                   aptosConfig,
                                                   abi,
                                                   fetch,
                                               }: {
    key: string;
    moduleAddress: string;
    moduleName: string;
    functionName: string;
    aptosConfig: AptosConfig;
    abi?: T;
    fetch: (moduleAddress: string, moduleName: string, functionName: string, aptosConfig: AptosConfig) => Promise<T>;
}): Promise<T> {
    if (abi !== undefined) {
        return abi;
    }

    // We fetch the entry function ABI, and then pretend that we already had the ABI
    return memoizeAsync(
        async () => fetch(moduleAddress, moduleName, functionName, aptosConfig),
        `${key}-${aptosConfig.network}-${moduleAddress}-${moduleName}-${functionName}`,
        1000 * 60 * 5, // 5 minutes
    )();
}
