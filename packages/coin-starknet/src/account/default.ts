/**
 * MIT License
 *
 * Copyright (c) 2021 Sean James Han
 * https://raw.githubusercontent.com/0xs34n/starknet.js/develop/LICENSE
 * */
import {UDC, ZERO} from '../constants';
import {Signer, SignerInterface} from '../signer';
import {
    Abi,
    AllowArray,
    Call,
    CairoVersion,
    DeclareContractPayload,
    DeclareContractTransaction,
    DeployAccountContractPayload,
    Details,
    InvocationsDetails,
    InvocationsSignerDetails,
    Signature,
    TransactionType,
    UniversalDeployerContractPayload,
} from '../types';
import {extractContractHashes, isSierra} from '../utils/contract';
import {starkCurve} from '../utils/ec';
import {
    calculateContractAddressFromHash,
    feeTransactionVersion,
    transactionVersion,
    transactionVersion_2,
} from '../utils/hash';
import {toBigInt, toCairoBool, toHex, bigNumberishArrayToDecimalStringArray} from '../utils/num';
import {parseContract} from '../utils/provider';
import {
    randomAddress,
    signatureToDecimalArray
} from '../utils/stark';
import {getExecuteCalldata} from '../utils/transaction';
import {AccountInterface} from './interface';
import {TypedData, getMessageHash} from '../utils/typedData';
import {CallData} from "../utils/calldata";

export class Account implements AccountInterface {
    public signer: SignerInterface;

    public address: string;

    public cairoVersion: CairoVersion;

    constructor(
        address: string,
        pkOrSigner: Uint8Array | string | SignerInterface,
        cairoVersion: CairoVersion = '0'
    ) {
        this.address = address.toLowerCase();
        this.signer =
            typeof pkOrSigner === 'string' || pkOrSigner instanceof Uint8Array
                ? new Signer(pkOrSigner)
                : pkOrSigner;
        this.cairoVersion = cairoVersion;
    }

    public async signMessage(typedData: TypedData): Promise<Signature> {
        return this.signer.signMessage(typedData, this.address);
    }

    public async declare(
        payload: DeclareContractPayload,
        transactionsDetail: InvocationsDetails
    ): Promise<any> {
        if (transactionsDetail.nonce === undefined || transactionsDetail.maxFee === undefined || transactionsDetail.chainId === undefined) {
            throw new Error('missing transaction parameter');
        }
        const declareContractPayload = extractContractHashes(payload);
        const details = {} as Details;

        details.nonce = toBigInt(transactionsDetail.nonce);
        details.maxFee = transactionsDetail.maxFee;
        details.chainId = transactionsDetail.chainId;
        details.version = !isSierra(payload.contract) ? transactionVersion : transactionVersion_2;
        const declareContractTransaction = await this.buildDeclareContractTransaction(declareContractPayload, {
            ...details,
            walletAddress: this.address,
            cairoVersion: this.cairoVersion, // This can be removed as declare doesn't depend on cairo version. Kept here because of the type mismatch
        });

        const {
            senderAddress,
            contractDefinition,
            signature,
            compiledClassHash
        }: DeclareContractTransaction = declareContractTransaction;
        if (!isSierra(contractDefinition)) {
            return {
                type: TransactionType.DECLARE,
                contract_class: contractDefinition,
                nonce: toHex(details.nonce),
                signature: signatureToDecimalArray(signature),
                sender_address: senderAddress,
                max_fee: toHex(details.maxFee || 0),
                version: '0x1',
            }
        } else {
            return {
                type: TransactionType.DECLARE,
                sender_address: senderAddress,
                compiled_class_hash: compiledClassHash,
                contract_class: contractDefinition,
                nonce: toHex(details.nonce),
                signature: signatureToDecimalArray(signature),
                max_fee: toHex(details.maxFee || 0),
                version: '0x2',
            }
        }
        throw new Error('RPC do not support Sierra Contracts yet');
    }

    public async execute(
        calls: AllowArray<Call>,
        abis: Abi[] | undefined = undefined,
        transactionsDetail: InvocationsDetails
    ): Promise<any> {
        if (transactionsDetail.nonce === undefined || transactionsDetail.maxFee === undefined || transactionsDetail.chainId === undefined) {
            throw new Error('missing transaction parameter');
        }
        const transactions = Array.isArray(calls) ? calls : [calls];
        const nonce = toBigInt(transactionsDetail.nonce);
        const maxFee = transactionsDetail.maxFee;
        const version = toBigInt(transactionVersion);
        const chainId = transactionsDetail.chainId;

        // const cairoVersion = transactionsDetail.cairoVersion ?? '0';

        const signerDetails: InvocationsSignerDetails = {
            walletAddress: this.address,
            nonce,
            maxFee,
            version,
            chainId,
            cairoVersion: this.cairoVersion,
        };

        const sig = await this.signer.signTransaction(transactions, signerDetails, abis);

        const calldata = getExecuteCalldata(transactions, this.cairoVersion);
        return {
            txId: sig.hash,
            signature: {
                type: TransactionType.INVOKE,
                sender_address: this.address,
                calldata:  CallData.compile(calldata ?? []),
                max_fee: toHex(maxFee || 0),
                signature: signatureToDecimalArray(sig.signature),
                version: '0x1',
                nonce: toHex(nonce)
            },
        }
    }

    public async deploy(
        payload: UniversalDeployerContractPayload | UniversalDeployerContractPayload[],
        details: InvocationsDetails
    ): Promise<any> {
        const params = [].concat(payload as []).map((it) => {
            const {
                classHash,
                salt,
                unique = true,
                constructorCalldata = [],
            } = it as UniversalDeployerContractPayload;

            const compiledConstructorCallData = CallData.compile(constructorCalldata);
            const deploySalt = salt ?? randomAddress();

            return {
                call: {
                    contractAddress: UDC.ADDRESS,
                    entrypoint: UDC.ENTRYPOINT,
                    calldata: [
                        classHash,
                        deploySalt,
                        toCairoBool(unique),
                        compiledConstructorCallData.length,
                        ...compiledConstructorCallData,
                    ],
                },
                address: calculateContractAddressFromHash(
                    unique ? starkCurve.pedersen(this.address, deploySalt) : deploySalt,
                    classHash,
                    compiledConstructorCallData,
                    unique ? UDC.ADDRESS : 0
                ),
            };
        });

        const calls = params.map((it) => it.call);
        const addresses = params.map((it) => it.address);

        return await this.execute(calls, undefined, details);
    }

    public async deployAccount(
        {
            classHash,
            constructorCalldata = [],
            addressSalt = 0,
            contractAddress: providedContractAddress,
        }: DeployAccountContractPayload,
        transactionsDetail: InvocationsDetails
    ): Promise<any> {
        if (transactionsDetail.maxFee === undefined || transactionsDetail.chainId === undefined) {
            throw new Error('missing transaction parameter');
        }

        const version = toBigInt(transactionVersion);
        const nonce = ZERO; // DEPLOY_ACCOUNT transaction will have a nonce zero as it is the first transaction in the account
        const chainId = transactionsDetail.chainId;
        const compiledCalldata = CallData.compile(constructorCalldata);

        const contractAddress =
            providedContractAddress ??
            calculateContractAddressFromHash(addressSalt, classHash, compiledCalldata, 0);

        const maxFee = transactionsDetail.maxFee;

        const sig = await this.signer.signDeployAccountTransaction({
            classHash,
            constructorCalldata,
            contractAddress,
            addressSalt,
            chainId,
            maxFee,
            version,
            nonce,
        });

        return {
            txId: sig.hash,
            signature: {
                type: TransactionType.DEPLOY_ACCOUNT,
                contract_address_salt: addressSalt,
                constructor_calldata: CallData.compile(constructorCalldata ?? []),
                class_hash: toHex(classHash),
                max_fee: toHex(maxFee || 0),
                version: toHex(version || 0),
                nonce: toHex(nonce),
                signature: signatureToDecimalArray(sig.signature)
            }
        }
    }

    async buildDeclareContractTransaction(
        payload: DeclareContractPayload,
        {nonce, chainId, version, walletAddress, maxFee}: InvocationsSignerDetails
    ): Promise<DeclareContractTransaction> {
        const {classHash, contract, compiledClassHash} = extractContractHashes(payload);
        const contractDefinition = parseContract(contract);
        const signature = await this.signer.signDeclareTransaction({
            classHash,
            compiledClassHash,
            senderAddress: walletAddress,
            chainId,
            maxFee,
            version,
            nonce,
        });
        return {
            senderAddress: walletAddress,
            signature,
            contractDefinition,
            compiledClassHash,
        };
    }

    public async hashMessage(typedData: TypedData): Promise<string> {
        return getMessageHash(typedData, this.address);
    }
}





