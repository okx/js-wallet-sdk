import {Buffer} from "buffer";
import {base, signUtil, BN} from "@okxweb3/crypto-lib";
import {BN_ZERO} from "./const";
import {address2Public} from "./address";
import {compactToU8a} from "./u8a";

// input structure
export interface TxStruct {
    ModuleMethod: string,
    Version: string,
    From: string,
    To: string,
    Amount: BN,
    Nonce: BN,
    Tip: BN,
    BlockHeight: BN,
    BlockHash: string,
    GenesisHash: string,
    SpecVersion: number,
    TxVersion: number,
    KeepAlive?: string,
    EraHeight?: BN
}

// unsigned structure
export interface UnSignedTx {
    Method: Uint8Array,
    Era: Uint8Array,
    Nonce: Uint8Array,
    Tip: Uint8Array,
    SpecVersion: Uint8Array,
    GenesisHash: Uint8Array,
    BlockHash: Uint8Array,
    TxVersion: Uint8Array,
}

// transaction type
export enum TxType {
    Transfer,
    TransferAll
}

// construct transaction and signed, return signature hex
export function SignTx(tx: TxStruct, txType: TxType, privateKey: string): string {
    const unSignedTx = UnSignedTxFromTxStruct(tx, txType)
    const message = UnSignedTxToString(unSignedTx)

    const payload = base.fromHex(message)
    const pk = base.fromHex(privateKey)

    const signature = signUtil.ed25519.sign(payload, pk)

    const bufferList = []
    const version = base.fromHex(tx.Version)
    bufferList.push(version)
    bufferList.push(Buffer.from([0x00]))
    const from = address2Public(tx.From)
    bufferList.push(Buffer.from(from))
    bufferList.push(Buffer.from([0x00])) //sign type 00:ed25519  01:sr25519  02:ecdsa
    bufferList.push(Buffer.from(signature))
    bufferList.push(Buffer.from(unSignedTx.Era))
    bufferList.push(Buffer.from(unSignedTx.Nonce))
    bufferList.push(Buffer.from(unSignedTx.Tip))
    bufferList.push(Buffer.from(unSignedTx.Method))
    const signed = Buffer.concat(bufferList)
    const lengthBytes = compactToU8a(signed.length)
    return base.toHex(Buffer.concat([lengthBytes, signed]), true)
}

// construct unsigned transaction
export function UnSignedTxFromTxStruct(tx: TxStruct, txType: TxType): UnSignedTx {
    let method: Uint8Array
    if(txType == TxType.Transfer) {
        method = BalanceTransfer(tx.ModuleMethod, tx.To, tx.Amount)
    } else if(txType == TxType.TransferAll) {
        method = BalanceTransferAll(tx.ModuleMethod, tx.To, tx.KeepAlive)
    } else {
        throw Error("unknown tx type")
    }
    const era = GetEra(tx.BlockHeight, tx.EraHeight)

    const nonce = []
    if(tx.Nonce.eq(BN_ZERO)) {
        nonce.push(0x00)
    } else {
        nonce.push(...compactToU8a(tx.Nonce))
    }

    const tip = []
    if(tx.Tip.eq(BN_ZERO)) {
        tip.push(0x00)
    } else {
        tip.push(...compactToU8a(tx.Tip))
    }

    const specVersion = Buffer.allocUnsafe(4);
    specVersion.writeUInt32LE(tx.SpecVersion)

    const txVersion = Buffer.allocUnsafe(4)
    txVersion.writeUInt32LE(tx.TxVersion)

    const genesis = base.fromHex(tx.GenesisHash)
    const block = base.fromHex(tx.BlockHash)
    return {
        Method: method,
        Era: era,
        Nonce: Uint8Array.from(nonce),
        Tip: Uint8Array.from(tip),
        SpecVersion: specVersion,
        GenesisHash: genesis,
        BlockHash: block,
        TxVersion: txVersion,
    }
}

// serialize unsigned structure
function UnSignedTxToString(unSignedTx: UnSignedTx): string {
    const bufferList = []
    bufferList.push(unSignedTx.Method)
    bufferList.push(unSignedTx.Era)
    bufferList.push(unSignedTx.Nonce)
    bufferList.push(unSignedTx.Tip)
    bufferList.push(unSignedTx.SpecVersion)
    bufferList.push(unSignedTx.TxVersion)
    bufferList.push(unSignedTx.GenesisHash)
    bufferList.push(unSignedTx.BlockHash)
    return base.toHex(Buffer.concat(bufferList))
}

// calculate era
export function GetEra(height: BN, calPeriod?: BN): Uint8Array {
    calPeriod = calPeriod || new BN(64)
    const phase = height.mod(calPeriod)
    const encoded = new BN(5).add(phase.shln(4))
    const bytes = encoded.toArray('le', 2)
    return Uint8Array.from(bytes)
}

// transfer: balances-transfer  balances-transfer_keep_alive
export function BalanceTransfer(method: string, to: string, amount: BN): Uint8Array {
    const publicKey = address2Public(to)
    const amountU8 = compactToU8a(amount)
    const ret = base.fromHex(method)
    const bufferList = [ret]
    bufferList.push(Buffer.from([0x00]))
    bufferList.push(Buffer.from(publicKey))
    bufferList.push(Buffer.from(amountU8))
    return Buffer.concat(bufferList)
}

// transfer all:  balances-transfer_all
// false: keepAlive 00
export function BalanceTransferAll(method: string, to: string, keepAlive?: string) : Uint8Array {
    keepAlive = keepAlive || "00"  // destroy account
    const publicKey = address2Public(to)
    const ret = base.fromHex(method)
    const bufferList = [ret]
    bufferList.push(Buffer.from([0x00]))
    bufferList.push(Buffer.from(publicKey))
    bufferList.push(base.fromHex(keepAlive))
    return Buffer.concat(bufferList)
}