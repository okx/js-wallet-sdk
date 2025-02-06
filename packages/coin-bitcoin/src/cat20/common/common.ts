import {TokenContract} from "./contract";


export type TokenPrevTx = {
    prevTx: string,
    prevPrevTx: string,
}

// transfer
export interface CatTransferParams
{
    tokenMetadata: string
    feeInputs: UtxoInput[]
    feeRate: number
    tokens: string
    changeAddress: string
    toAddress: string
    tokenAmount: string
    tokenPrevTxs: TokenPrevTx[]
    verifyScript?: boolean
    guard? : string
    publicKey?: string
    signData?: SignData
    estimateFee?: boolean
}

export type UtxoInput = {
    txId: string
    vOut: number
    amount: number  // min unit: satoshi
    address?: string
}

// sighashes to be signed or signatures after signing
export type SignData = {
    merge: string[],
    commit: string[],
    reveal: string[],
}