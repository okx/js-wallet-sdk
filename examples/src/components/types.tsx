import {BaseWallet} from "@okxweb3/coin-base";
import {BtcWallet, TBtcWallet} from "@okxweb3/coin-bitcoin";

export type BitcoinWallets = BtcWallet | TBtcWallet
export type utxoInput = {
    txId: string
    vOut: number
    amount: string
    address?: string
}

export type utxoOutput = {
    address: string
    amount: string
}

export interface BtcTxData {
    inputs: utxoInput[]
    outputs: utxoOutput[]
    address: string
    feePerB: string
}
export interface EvmTxData {
    to: string;
    value: string;
    nonce: string;
    chainId: string;
    gasLimit: string;
    gasPrice?: string;
    maxPriorityFeePerGas?: string,
    maxFeePerGas?: string
    data?: string;
    token?: string;
    contractAddress?: string;
}

export type TonTxData = {
    type: string
    to: string
    amount: string
    seqno: number
    toIsInit: boolean
    decimal: number
    memo?: string
    globalId?: number
    sendMode?: number
    expireAt?: number
    publicKey?: string
};
export type TonJettonTxData = {
    type: string
    to: string
    fromJettonAccount: string // jetton wallet address
    amount: string
    decimal: number
    seqno: number
    toIsInit: boolean // destination address init or not
    memo?: string // comment
    messageAttachedTons?: string // message fee,
    invokeNotificationFee?: string // notify fee, 0.000000001
    sendMode?: number
    expireAt?: number
    queryId?: string
    publicKey?: string
}
export interface TransactionFormProps {
    privateKey: string
    wallet: BaseWallet
}
