import {Account} from "./account";

export * from './signer'
export * from './types'
export * from './utils/hash'
export * from './account'


/**
 * Utils
 */
export * as constants from './constants';
export * as encode from './utils/encode';
export * as hash from './utils/hash';
export * as json from './utils/json';
export * as num from './utils/num';
export * as transaction from './utils/transaction';
export * as stark from './utils/stark';
export * as ec from './utils/ec';
export * as merkle from './utils/merkle';
export * as uint256 from './utils/uint256';
export * as shortString from './utils/shortString';
export * as typedData from './utils/typedData';
export * from './utils/address';
export * from './utils/calldata';
export * from "./StarknetWallet"
/**
 * Deprecated
 */
/* eslint-disable import/first */
import * as num from './utils/num';

/** @deprecated prefer the 'num' naming */
export const number = num;


import * as ec from './utils/ec';
import * as hash from './utils/hash';
import {accountClassHash, ProxyAccountClassHash, StarknetChainId} from "./constants";
import {BigNumberish} from "./utils/num";
import * as json from './utils/json';
import {addAddressPadding} from "./utils/address";
import {base, signUtil, BN} from '@okxweb3/crypto-lib'
import {TypedData} from "./utils/typedData";
import {Signature} from "./types";
import {starkCurve} from "./utils/ec";
import {CallData} from "./utils/calldata";
import {addHexPrefix} from "./utils/encode";

export function CalculateContractAddressFromHash(starkPub: string): string {
    const constructorCallData = {
        implementation: accountClassHash,
        selector: hash.getSelectorFromName("initialize"),
        calldata: CallData.compile({signer: starkPub, guardian: "0"}),
    }

    const contractAddress = hash.calculateContractAddressFromHash(
        starkPub,
        ProxyAccountClassHash,
        CallData.compile(constructorCallData),
        0
    );

    return addAddressPadding(contractAddress);
}

export async function CreateSignedDeployAccountTx(nonce: BigNumberish, maxFee: BigNumberish, chainId: StarknetChainId, privateKey: string) {
    const starkPub = ec.starkCurve.getStarkKey(privateKey);
    const contractAddress = CalculateContractAddressFromHash(starkPub);

    const AAaccount = new Account(contractAddress, addHexPrefix(privateKey));
    const constructorCallData = {
        implementation: accountClassHash,
        selector: hash.getSelectorFromName("initialize"),
        calldata: CallData.compile({signer: starkPub, guardian: "0"}),
    }
    const callDate = CallData.compile(constructorCallData);
    const tx = await AAaccount.deployAccount(
        {
            addressSalt: starkPub,
            classHash: ProxyAccountClassHash,
            constructorCalldata: callDate,
            contractAddress: contractAddress
        }, {nonce, maxFee, chainId});

    return {txId: tx.txId, signature: json.stringify(tx.signature)};
}

export async function CreateTransferTx(contractAddress: string, from: string, to: string, amount: BigNumberish, nonce: BigNumberish, maxFee: BigNumberish, chainId: StarknetChainId, privateKey: string) {
    const AAaccount = new Account(from, addHexPrefix(privateKey));
    const tx = await AAaccount.execute({
        contractAddress: contractAddress,
        entrypoint: "transfer",
        calldata: [to, amount, 0]
    }, undefined, {
        nonce: nonce,
        maxFee: maxFee,
        chainId: chainId,
    });
    return {txId: tx.txId, signature: json.stringify(tx.signature)};
}

export async function CreateContractCall(contractAddress: string, from: string, functionName: string, callData: string[], nonce: BigNumberish, maxFee: BigNumberish, chainId: StarknetChainId, privateKey: string) {
    const AAaccount = new Account(from, addHexPrefix(privateKey));
    if (!callData) {
        callData = [];
    }
    const tx = await AAaccount.execute({
        contractAddress: contractAddress,
        entrypoint: functionName,
        calldata: callData
    }, undefined, {
        nonce: nonce,
        maxFee: maxFee,
        chainId: chainId,
    });
    return {txId: tx.txId, signature: json.stringify(tx.signature)};
}

export type CallV2 = {
    contractAddress?: string,
    contract_address?:string,
    entrypoint?: string,
    entry_point?:string,
    calldata: string[]
}

export async function CreateMultiContractCall(from: string, calls: CallV2[], nonce: BigNumberish, maxFee: BigNumberish, chainId: StarknetChainId, privateKey: string) {
    const AAaccount = new Account(from, addHexPrefix(privateKey));
    let arr = calls.map(item => ({
        contractAddress: item.contract_address? item.contract_address:item.contractAddress!,
        entrypoint:item.entry_point? item.entry_point:item.entrypoint!,
        calldata: item.calldata,
    }))
    const tx = await AAaccount.execute(arr, undefined, {
        nonce: nonce,
        maxFee: maxFee,
        chainId: chainId,
    });
    return {txId: tx.txId, signature: json.stringify(tx.signature)};
}

export async function signMessageWithTypeData(typedData: TypedData, privateKey: string) {
    const publicKey = signUtil.schnorr.stark.getPublicKey(privateKey);
    const starkPub = ec.starkCurve.getStarkKey(privateKey);
    const address = CalculateContractAddressFromHash(starkPub);
    let account = new Account(address, addHexPrefix(privateKey));

    let sig = await account.signMessage(typedData);
    let hash = await account.hashMessage(typedData);

    return {signature: sig, hash: hash, publicKey: publicKey};
}

export async function signMessage(message: string, privateKey: string) {
    const publicKey = signUtil.schnorr.stark.getPublicKey(privateKey);
    const sig = starkCurve.sign(message, privateKey);

    return {signature: sig, hash: message, publicKey: publicKey};
}

type Hex = Uint8Array | string;

export function verifyMessage(signature: Signature | Hex, msgHash: Hex, publicKey: Hex) {
    //@ts-ignore
    return signUtil.schnorr.stark.verify(signature, msgHash, publicKey);
}

export async function GetRandomPrivateKey() {
    while (true) {
        const randBytes = base.randomBytes(32)
        if (privateKeyVerify(randBytes)) {
            if (testSign(randBytes.toString('hex'))) {
                return `0x${signUtil.schnorr.bytesToHex(randBytes)}`
            }
        }
    }
}

export function testSign(privateKey: string) {
    const msg = "7465dd6b1bbffdb05442eb17f5ca38ad1aa78a6f56bf4415bdee219114a47a1";
    const signature = ec.starkCurve.sign(msg, privateKey);
    const pub = signUtil.schnorr.stark.getPublicKey(privateKey);
    return ec.starkCurve.verify(signature, msg, pub)
}

function privateKeyVerify(seckey: Buffer) {
    const bn = new BN(Array.from(seckey))
    const n = new BN(ec.starkCurve.CURVE.n.toString())
    return bn.cmp(n) < 0 && !bn.isZero()
}

const CURVE_ORDER = BigInt(
    '3618502788666131213697322783095070105526743751716087489154079457884512865583'
);

export function modPrivateKey(privateKey: string): string {
    let key: string;
    if (!privateKey.startsWith("0x") && !privateKey.startsWith('0X')) {
        key = `0x${privateKey}`; // Remove the "0x" prefix
    } else {
        key = privateKey;
    }

    const pk = BigInt(key.toLowerCase());
    const priKey = pk % CURVE_ORDER;

    return "0x" + priKey.toString(16);
}