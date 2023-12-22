import {TxBuilder} from './txBuilder';
import {Action, KeyType, PackedTransaction} from './types';
import {base, signUtil} from "@okxweb3/crypto-lib"
import {
    buyRamAction,
    CommonParam,
    CreateAccountParam,
    delegateAction,
    eosioTokenAbi,
    eosioAbi,
    NewAccountAction,
    transferAction,
    TransferParam, toAssetString,
} from './action';
import {
    digestFromSerializedData, publicKeyToLegacyString,
    publicKeyToString,
    signatureToElliptic,
    stringToPrivateKey,
    stringToSignature,
} from './numeric';
import {hexToUint8Array} from "./serialize";
import {inflate} from "pako";

export function checkName(name: string): boolean {
    const regex = new RegExp(/^[.1-5a-z]{0,12}[.1-5a-j]?$/);
    return regex.test(name)
}

export function getNewAddress(creator: string,
                              newAccount: string,
                              newAccountActivePrivateKeyBase58: string,
                              ram: number,
                              net: number,
                              cpu: number,
                              transfer: boolean,
                              precision: number,
                              symbol: string,
                              common: CommonParam): string {
    if (!checkName(creator)) {
        throw new Error('invalid creator name');
    }

    if (!checkName(newAccount)) {
        throw new Error('invalid newAccount name');
    }

    const privateKey = stringToPrivateKey(newAccountActivePrivateKeyBase58)
    const publicKey = signUtil.secp256k1.publicKeyCreate(privateKey.data, true)

    return createAccount({
        creator: creator,
        newAccount: newAccount,
        pubKey: publicKeyToString({
            type: KeyType.k1,
            data: publicKey,
        }),
        buyRam: {
            payer: creator,
            receiver: newAccount,
            quantity: toAssetString(ram, precision, symbol),
        },
        delegate: {
            from: creator,
            receiver: newAccount,
            stakeNet: toAssetString(net, precision, symbol),
            stakeCPU: toAssetString(cpu, precision, symbol),
            transfer: transfer
        },
        common: common
    })
}

/*
account - including single account and contract (send or receive action)
permissions - each account contains several roles, grant action/transaction, each role associated a permissions list
authorities - threshold  1    - threshold value to satisfy authorization
                  accounts weights  - list of account@permission levels and weights
                  keys weights - list of public keys and weights
                  waits  - list of time waits and weights

Authority Factors (three kinds):
                  Actor's account name and permission level
                  Actor's public key
                  Time wait
 */
// NewAccountTransaction creates a new account
// newaccount, buyram, delegatebw: refer to creat_account, buy_ram, delegate_bw actions
export function createAccount(param: CreateAccountParam) {
    const actions: Action[] = [
        NewAccountAction(param.creator, param.newAccount, param.pubKey),
        delegateAction(param.delegate),
        buyRamAction(param.buyRam),
    ];
    const abiMap = new Map<string, string>();
    abiMap.set('eosio', eosioAbi);
    return buildTransaction(param.common, actions, abiMap)
}


export function transfer(param: TransferParam) {
    if (!checkName(param.from)) {
        throw new Error('invalid from name');
    }

    if (!checkName(param.to)) {
        throw new Error('invalid to name');
    }

    const actions: Action[] = [
        transferAction(param),
    ];
    const abiMap = new Map<string, string>();
    // abiMap.set('eosio.token', eosioTokenAbi);
    if (param.contract) {
        abiMap.set(param.contract, eosioTokenAbi);
    } else {
        abiMap.set('eosio.token', eosioTokenAbi);
    }
    return buildTransaction(param.common, actions, abiMap)
}

function buildTransaction(param: CommonParam, actions: Action[], abiMap: Map<string, string>) {
    const builder = new TxBuilder(param.chainId!);
    const config = {
        privateKeys: param.privateKey!,
        compression: param.compression,
        refBlockNumber: param.refBlockNumber,
        refBlockId: param.refBlockId,
        refBlockTimestamp: param.refBlockTimestamp,
        expireSeconds: param.expireSeconds,
    };
    const transaction = {
        actions: actions,
    };
    const t = builder.build(transaction, config, abiMap);
    return JSON.stringify(t)
}

export function signMessage(chainId: string, privateKey: string, serializedTransaction: string, serializedContextFreeData?: string) {
    const builder = new TxBuilder(chainId);
    const serializedTransactionRaw = base.fromHex(serializedTransaction)
    const serializedContextFreeDataRaw = serializedContextFreeData ? base.fromHex(serializedContextFreeData) : undefined
    return builder.sign([privateKey], serializedTransactionRaw, serializedContextFreeDataRaw)[0]
}

export function verifySignature(chainId: string, signature: string, serializedTransaction: string, serializedContextFreeData?: string): string {
    const key = stringToSignature(signature)
    const serializedTransactionRaw = base.fromHex(serializedTransaction)
    const serializedContextFreeDataRaw = serializedContextFreeData ? base.fromHex(serializedContextFreeData) : undefined
    const digest = digestFromSerializedData(chainId, serializedTransactionRaw, serializedContextFreeDataRaw);
    const e = signatureToElliptic(key.data)
    const publicKey = signUtil.secp256k1.recover(e.signatureBytes, e.recoveryParam, digest, true);
    if (!publicKey) {
        throw new Error("recover publicKey error")
    }
    return publicKeyToLegacyString({type: KeyType.k1, data: publicKey})
}

export function getTxId(tx: PackedTransaction): string {
    let serializedTransaction;
    if (tx.compression) {
        serializedTransaction = inflate(hexToUint8Array(tx.packed_trx));
    } else {
        serializedTransaction = hexToUint8Array(tx.packed_trx);
    }

    return base.toHex(base.sha256(Buffer.from(serializedTransaction)));
}
