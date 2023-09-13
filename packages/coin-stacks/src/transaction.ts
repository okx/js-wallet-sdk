import {
    AddressHashMode,
    AnchorMode,
    bufferCVFromString,
    ClarityVersion,
    createAssetInfo,
    createLPList,
    createSingleSigSpendingCondition,
    createStacksPrivateKey,
    createStandardAuth,
    createStandardPrincipal, deserializeCV,
    FungibleConditionCode,
    getPublicKey, hexToBuff,
    makeContractCall, makeContractDeploy,
    makeStandardFungiblePostCondition, noneCV, postConditionFromString,
    PostConditionMode, principalCV, serializeCV, serializePayload, SignedContractCallOptions,
    someCV,
    StacksTransaction,
    standardPrincipalCV,
    TransactionSigner,
    TransactionVersion,
    uintCV,
    addHex
} from './transactions';
import {
    createContractCallPayload,
    createSmartContractPayload,
    createTokenTransferPayload
} from './transactions/payload';
import {bytesToHex} from './common';
import {StacksMainnet} from './network';
import {stack, getDelegateOptions, poxAddressToTuple} from "./stacking";
import {deserialize} from "./transactions/cl";

export function transfer(secretKey: string, to: string, amount: number, memo: string, nonce: number, fee: number, anchorMode?: number) {
    const transactionVersion = TransactionVersion.Mainnet;
    const address = to;
    const recipient = createStandardPrincipal(address);
    const recipientCV = standardPrincipalCV(address);
    const payload = createTokenTransferPayload(recipientCV, amount, memo);
    const addressHashMode = AddressHashMode.SerializeP2PKH;
    const privateKey = createStacksPrivateKey(secretKey)
    const pubKey = bytesToHex(getPublicKey(privateKey).data);
    const spendingCondition = createSingleSigSpendingCondition(addressHashMode, pubKey, nonce, fee);
    const authorization = createStandardAuth(spendingCondition);
    // const postCondition = createSTXPostCondition(recipient, FungibleConditionCode.GreaterEqual, 0);
    const postConditions = createLPList([]);
    const transaction = new StacksTransaction(
        transactionVersion,
        authorization,
        payload,
        postConditions,
        undefined,
        anchorMode
    );
    const signer = new TransactionSigner(transaction);
    signer.signOrigin(createStacksPrivateKey(secretKey));
    transaction.verifyOrigin();
    const txId = addHex(transaction.txid());
    const serialized = transaction.serialize();
    const txSerializedHexString = bytesToHex(serialized);
    return {txId, txSerializedHexString}
}

//stack
export async function stacks(privateKey: string, address: string, poxAddress: string, amountMicroStx: bigint, cycles: number,
                             burnBlockHeight: number, contract: string, fee: number, nonce: number) {
    const network = new StacksMainnet();

    const stackingResults = await stack({
        contract,
        amountMicroStx,
        poxAddress,
        cycles,
        privateKey,
        burnBlockHeight,
        fee,
        nonce
    });
    return stackingResults
}

export async function tokenTransfer(secretKey: string, from: string, to: string, memo: string, amount: number, contract: string, contractName: string, tokenName: string, functionName: string, nonce: number, fee: number) {
    const stacksTransaction = await makeContractCall({
        anchorMode: AnchorMode.Any,
        contractAddress: contract,
        contractName: contractName,
        fee: fee,
        functionArgs: [uintCV(amount), standardPrincipalCV(from), standardPrincipalCV(to), someCV(bufferCVFromString(memo))],
        functionName: functionName,
        nonce: nonce,
        postConditionMode: PostConditionMode.Deny,
        postConditions: [makeStandardFungiblePostCondition(from, FungibleConditionCode.Equal, amount, createAssetInfo(contract, contractName, tokenName))],
        senderKey: secretKey,
        network: new StacksMainnet(),
    });
    const txId = addHex(stacksTransaction.txid());
    const txSerializedHexString = bytesToHex(stacksTransaction.serialize());
    return {txId, txSerializedHexString};
}

export async function allowContractCaller(secretKey: string, caller: string, contract: string, contractName: string, functionName: string, untilBurnBlockHeight: number, nonce: number, fee: number) {
    const stacksTransaction = await makeContractCall({
        anchorMode: AnchorMode.Any,
        contractAddress: contract,
        contractName: contractName,
        fee: fee,
        functionArgs: [principalCV(caller), untilBurnBlockHeight ? someCV(uintCV(untilBurnBlockHeight)) : noneCV()],
        functionName: functionName,
        nonce: nonce,
        senderKey: secretKey,
        network: new StacksMainnet(),
    });

    const txId = addHex(stacksTransaction.txid());
    const txSerializedHexString = bytesToHex(stacksTransaction.serialize());
    return {txId, txSerializedHexString};
}

interface GenerateUnsignedTxArgs<TxPayload> {
    txData: TxPayload;
    fee: number;
    nonce: number;
}

export interface TxBase {
    postConditionMode?: PostConditionMode;
    postConditions?: string[];
    anchorMode?: AnchorMode;
}

export interface ContractCallBase extends TxBase {
    contractAddress: string;
    contractName: string;
    functionName: string;
    functionArgs: string[];
}

interface ContractCallPayload extends ContractCallBase {
    functionArgs: string[];
    sponsored?: boolean;
}

export interface ContractDeployPayload extends TxBase {
    contractName: string;
    codeBody: string;
    sponsored?: boolean;
}

export type GenerateUnsignedContractCallTxArgs = GenerateUnsignedTxArgs<ContractCallPayload>;
export type GenerateUnsignedContractDeployTxArgs = GenerateUnsignedTxArgs<ContractDeployPayload>;


export enum TransactionTypes {
    ContractCall = 'contract_call',
    ContractDeploy = 'smart_contract',
    STXTransfer = 'token_transfer',
}

export async function makeContractCallTx(args: GenerateUnsignedContractCallTxArgs, senderKey: string) {
    const {txData, nonce, fee} = args;
    const {
        contractName,
        contractAddress,
        functionName,
        functionArgs,
        sponsored,
        postConditionMode,
        postConditions,
        anchorMode,
    } = txData;
    const fnArgs = functionArgs.map(arg => deserializeCV(hexToBuff(arg)));
    const options: SignedContractCallOptions = {
        senderKey: senderKey,
        contractName,
        contractAddress,
        functionName,
        anchorMode: anchorMode ?? AnchorMode.Any,
        functionArgs: fnArgs,
        nonce: nonce,
        fee: fee,
        postConditionMode: postConditionMode,
        postConditions: postConditions?.map(postConditionFromString),
        sponsored
    };
    const tx = await makeContractCall(options);
    const txId = addHex(tx.txid());
    const txSerializedHexString = bytesToHex(tx.serialize());
    return {txId, txSerializedHexString};
}

export async function ContractDeployTx(args: GenerateUnsignedContractDeployTxArgs, senderKey: string) {
    const {txData, nonce, fee} = args;
    const {contractName, codeBody, postConditions, postConditionMode, anchorMode} = txData;
    const options = {
        senderKey: senderKey,
        contractName,
        codeBody,
        nonce: nonce,
        fee: fee,
        anchorMode: anchorMode ?? AnchorMode.Any,
        postConditionMode: postConditionMode,
        postConditions: postConditions?.map(postConditionFromString),
    };

    const tx = await makeContractDeploy(options);
    const txId = addHex(tx.txid());
    const txSerializedHexString = bytesToHex(tx.serialize());
    return {txId, txSerializedHexString};
}

export async function delegateStx(secretKey: string, contract: string, contractName: string, functionName: string, delegateTo: string, poxAddress: string, amountMicroStx: number, untilBurnBlockHeight: number, nonce: number, fee: number) {
    const txOptions = getDelegateOptions(contract, contractName, functionName, amountMicroStx, delegateTo, untilBurnBlockHeight, poxAddress);
    const stacksTransaction = await makeContractCall({...txOptions, senderKey: secretKey, nonce, fee});
    const txId = addHex(stacksTransaction.txid());
    const txSerializedHexString = bytesToHex(stacksTransaction.serialize());
    return {txId, txSerializedHexString};
}

export async function revokeDelegateStx(secretKey: string, contract: string, contractName: string, functionName: string, nonce: number, fee: number) {
    const stacksTransaction = await makeContractCall({
        anchorMode: AnchorMode.Any,
        contractAddress: contract,
        contractName: contractName,
        fee: fee,
        functionArgs: [],
        functionName: functionName,
        nonce: nonce,
        senderKey: secretKey,
        network: new StacksMainnet(),
    });
    const txId = addHex(stacksTransaction.txid());
    const txSerializedHexString = bytesToHex(stacksTransaction.serialize());
    return {txId, txSerializedHexString};
}


export function getTransferPayload(to: string, amount: number, memo: string) {
    const address = to;
    const recipientCV = standardPrincipalCV(address);
    const payload = createTokenTransferPayload(recipientCV, amount, memo);

    const s = serializePayload(payload);
    return bytesToHex(s);
}

export function getTokenTransferPayload(from: string, to: string, memo: string, amount: number, contract: string, contractName: string, functionName: string) {
    const payload = createContractCallPayload(
        contract,
        contractName,
        functionName,
        [uintCV(amount), standardPrincipalCV(from), standardPrincipalCV(to), someCV(bufferCVFromString(memo))]
    );
    const s = serializePayload(payload);
    return bytesToHex(s);
}

export function getAllowContractCallerPayload(caller: string, contract: string, contractName: string, functionName: string, untilBurnBlockHeight: number) {
    const payload = createContractCallPayload(
        contract,
        contractName,
        functionName,
        [principalCV(caller), untilBurnBlockHeight ? someCV(uintCV(untilBurnBlockHeight)) : noneCV()],
    );
    const s = serializePayload(payload);
    return bytesToHex(s);
}

export function getDelegateStxPayload(contract: string, contractName: string, functionName: string, delegateTo: string, poxAddress: string, amountMicroStx: number, untilBurnBlockHeight: number) {
    const address = poxAddress ? someCV(poxAddressToTuple(poxAddress)) : noneCV();

    const functionArgs = [
        uintCV(amountMicroStx),
        principalCV(delegateTo),
        untilBurnBlockHeight ? someCV(uintCV(untilBurnBlockHeight)) : noneCV(),
        address
    ]

    const payload = createContractCallPayload(
        contract,
        contractName,
        functionName,
        functionArgs
    )
    const s = serializePayload(payload);
    return bytesToHex(s);
}

export function getRevokeDelegateStxPayload(contract: string, contractName: string, functionName: string) {
    const payload = createContractCallPayload(
        contract,
        contractName,
        functionName,
        []
    )
    const s = serializePayload(payload);
    return bytesToHex(s);
}

export function getContractCallPayload(contract: string, contractName: string, functionName: string, functionArgs: string[]) {
    const fnArgs = functionArgs.map(arg => deserializeCV(hexToBuff(arg)));
    const payload = createContractCallPayload(
        contract,
        contractName,
        functionName,
        fnArgs
    )
    const s = serializePayload(payload);
    return bytesToHex(s);
}

export function getDeployPayload(contractName: string, codeBody: string) {
    const payload = createSmartContractPayload(
        contractName,
        codeBody,
        ClarityVersion.Clarity2,
);
    const s = serializePayload(payload);
    return bytesToHex(s);
}