import { base, signUtil } from "@okxweb3/crypto-lib";
import { decodeAddress } from "./lib/address";

type TransactionInput = {
    previousOutpoint: Outpoint
    signatureScript: string
    sequence: number
    sigOpCount: number
};

type Outpoint = {
    transactionId: string
    index: number
};

type TransactionOutput = {
    amount: number
    scriptPublicKey: ScriptPublicKey
};

type ScriptPublicKey = {
    version: number
    scriptPublicKey: string
};

export type Input = {
    txId: string
    vOut: number
    address: string
    amount: number
};

export type Output = {
    address: string
    amount: number
};

export type TxData = {
    inputs: Input[]
    outputs: Output[]
    address: string // change address
    fee: number // input count * 10000
    dustSize?: number // min output amount
};

const TransactionSigningHashKey = Buffer.from("TransactionSigningHash");
const TransactionIDKey = Buffer.from("TransactionID");
const PersonalMessageSigningHashKey = Buffer.from("PersonalMessageSigningHash");

export function transfer(txData: TxData, privateKey: string) {
    const transaction = Transaction.fromTxData(txData).sign(privateKey)
    return {
        tx: transaction.getMessage(),
        txId: transaction.getTxId(),
    };
}

export function signMessage(message: string, privateKey: string) {
    const hash = base.blake2(Buffer.from(message),256, PersonalMessageSigningHashKey);
    const signature = signUtil.schnorr.secp256k1.schnorr.sign(hash, base.toHex(base.fromHex(privateKey)));
    return base.toHex(signature);
}

export class Transaction {
    version: number = 0;
    inputs: TransactionInput[] = [];
    outputs: TransactionOutput[] = [];
    lockTime: number = 0;
    subnetworkId: string = "0000000000000000000000000000000000000000";

    utxos: { pkScript: Buffer, amount: number }[] = [];

    static fromTxData(txData: TxData) {
        return new Transaction(txData);
    }

    constructor(txData: TxData) {
        let totalInput = 0;
        txData.inputs.forEach(input => {
            this.inputs.push({
                previousOutpoint: {
                    transactionId: input.txId,
                    index: input.vOut,
                },
                signatureScript: "",
                sequence: 0,
                sigOpCount: 1,
            });

            this.utxos.push({
                pkScript: payToAddrScript(input.address),
                amount: input.amount,
            });

            totalInput += input.amount;
        });

        let totalOutput = 0;
        txData.outputs.forEach(output => {
            this.outputs.push({
                scriptPublicKey: {
                    version: 0,
                    scriptPublicKey: base.toHex(payToAddrScript(output.address)),
                },
                amount: output.amount,
            });

            totalOutput += output.amount;
        });

        const changeAmount = totalInput - totalOutput - txData.fee;
        if (changeAmount >= (txData.dustSize || 546)) {
            this.outputs.push({
                scriptPublicKey: {
                    version: 0,
                    scriptPublicKey: base.toHex(payToAddrScript(txData.address)),
                },
                amount: changeAmount,
            });
        }
    }

    sign(privateKey: string) {
        this.inputs.forEach((input, i) => {
            const sigHash = calculateSigHash(this, SIGHASH_ALL, i, {});
            const signature = signUtil.schnorr.secp256k1.schnorr.sign(sigHash, base.toHex(base.fromHex(privateKey)));
            input.signatureScript = base.toHex(Buffer.concat([Buffer.from([0x41]), signature, Buffer.from([SIGHASH_ALL])]));
        });
        return this;
    }

    getMessage() {
        return JSON.stringify({
            transaction: {
                version: this.version,
                inputs: this.inputs,
                outputs: this.outputs,
                lockTime: this.lockTime,
                subnetworkId: this.subnetworkId,
            },
            allowOrphan: false,
        });
    }

    getTxId() {
        const hashWriter = new HashWriter();
        hashWriter.writeUInt16LE(this.version);
        hashWriter.writeUInt64LE(this.inputs.length);
        this.inputs.forEach(input => {
           hashWriter.writeHash(base.fromHex(input.previousOutpoint.transactionId));
           hashWriter.writeUInt32LE(input.previousOutpoint.index);
           hashWriter.writeVarBytes(Buffer.alloc(0));
           hashWriter.writeUInt64LE(input.sequence);
        });
        hashWriter.writeUInt64LE(this.outputs.length);
        this.outputs.forEach(output => {
            hashWriter.writeUInt64LE(output.amount);
            hashWriter.writeUInt16LE(output.scriptPublicKey.version);
            hashWriter.writeVarBytes(base.fromHex(output.scriptPublicKey.scriptPublicKey));
        });
        hashWriter.writeUInt64LE(this.lockTime);
        hashWriter.writeHash(base.fromHex(this.subnetworkId));
        hashWriter.writeUInt64LE(0);
        hashWriter.writeVarBytes(Buffer.alloc(0));

        return base.toHex(base.blake2(hashWriter.toBuffer(),256, TransactionIDKey));
    }
}

function payToAddrScript(address: string) {
    const { payload } = decodeAddress(address);
    return Buffer.concat([Buffer.from([0x20]), payload, Buffer.from([0xac])], 34);
}

const SIGHASH_ALL = 0b00000001;
const SIGHASH_NONE = 0b00000010;
const SIGHASH_SINGLE = 0b00000100;
const SIGHASH_ANYONECANPAY = 0b10000000;
const SIGHASH_MASK = 0b00000111;

function isSigHashNone(hashType: number) {
    return (hashType & SIGHASH_MASK) === SIGHASH_NONE;
}

function isSigHashSingle(hashType: number) {
    return (hashType & SIGHASH_MASK) === SIGHASH_SINGLE;
}

function isSigHashAnyoneCanPay(hashType: number) {
    return (hashType & SIGHASH_ANYONECANPAY) === SIGHASH_ANYONECANPAY;
}

function calculateSigHash(transaction: Transaction, hashType: number, inputIndex: number, reusedValues = {}) {
    const hashWriter = new HashWriter();

    hashWriter.writeUInt16LE(transaction.version)
    hashWriter.writeHash(getPreviousOutputsHash(transaction, hashType, reusedValues));
    hashWriter.writeHash(getSequencesHash(transaction, hashType, reusedValues));
    hashWriter.writeHash(getSigOpCountsHash(transaction, hashType, reusedValues));

    const input = transaction.inputs[inputIndex];
    const utxo = transaction.utxos[inputIndex];
    hashOutpoint(hashWriter, input);
    hashWriter.writeUInt16LE(0); // TODO: USE REAL SCRIPT VERSION
    hashWriter.writeVarBytes(utxo.pkScript);
    hashWriter.writeUInt64LE(utxo.amount);
    hashWriter.writeUInt64LE(input.sequence);
    hashWriter.writeUInt8(1); // sigOpCount
    hashWriter.writeHash(getOutputsHash(transaction, inputIndex, hashType, reusedValues));
    hashWriter.writeUInt64LE(transaction.lockTime);
    hashWriter.writeHash(zeroSubnetworkID()); // TODO: USE REAL SUBNETWORK ID
    hashWriter.writeUInt64LE(0); // TODO: USE REAL GAS
    hashWriter.writeHash(zeroHash()); // TODO: USE REAL PAYLOAD HASH
    hashWriter.writeUInt8(hashType);

    return hashWriter.finalize();
}

function zeroHash() {
    return Buffer.alloc(32);
}

function zeroSubnetworkID() {
    return Buffer.alloc(20);
}

function getPreviousOutputsHash(transaction: Transaction, hashType: number, reusedValues: any) {
    if (isSigHashAnyoneCanPay(hashType)) {
        return zeroHash();
    }

    if (!reusedValues.previousOutputsHash) {
        const hashWriter = new HashWriter();
        transaction.inputs.forEach(input => hashOutpoint(hashWriter, input));
        reusedValues.previousOutputsHash = hashWriter.finalize();
    }

    return reusedValues.previousOutputsHash;
}

function getSequencesHash(transaction: Transaction, hashType: number, reusedValues: any) {
    if (isSigHashSingle(hashType) || isSigHashAnyoneCanPay(hashType) || isSigHashNone(hashType)) {
        return zeroHash();
    }

    if (!reusedValues.sequencesHash) {
        const hashWriter = new HashWriter();
        transaction.inputs.forEach(input => hashWriter.writeUInt64LE(input.sequence));
        reusedValues.sequencesHash = hashWriter.finalize();
    }

    return reusedValues.sequencesHash;
}

function getSigOpCountsHash(transaction: Transaction, hashType: number, reusedValues: any) {
    if (isSigHashAnyoneCanPay(hashType)) {
        return zeroHash();
    }

    if (!reusedValues.sigOpCountsHash) {
        const hashWriter = new HashWriter();
        transaction.inputs.forEach(_ => hashWriter.writeUInt8(1));
        reusedValues.sigOpCountsHash = hashWriter.finalize();
    }

    return reusedValues.sigOpCountsHash;
}

function getOutputsHash(transaction: Transaction, inputIndex: number, hashType: number, reusedValues: any) {
    if (isSigHashNone(hashType)) {
        return zeroHash();
    }

    // SigHashSingle: If the relevant output exists - return its hash, otherwise return zero-hash
    if (isSigHashSingle(hashType)) {
        if (inputIndex >= transaction.outputs.length) {
            return zeroHash();
        }

        const hashWriter = new HashWriter();
        return hashWriter.finalize();
    }

    if (!reusedValues.outputsHash) {
        const hashWriter = new HashWriter();
        transaction.outputs.forEach(output => hashTxOut(hashWriter, output));
        reusedValues.outputsHash = hashWriter.finalize();
    }

    return reusedValues.outputsHash;
}

function hashOutpoint(hashWriter: HashWriter, input: TransactionInput) {
    hashWriter.writeHash(base.fromHex(input.previousOutpoint.transactionId));
    hashWriter.writeUInt32LE(input.previousOutpoint.index);
}

function hashTxOut(hashWriter: HashWriter, output: TransactionOutput) {
    hashWriter.writeUInt64LE(output.amount);
    hashWriter.writeUInt16LE(0); // TODO: USE REAL SCRIPT VERSION
    hashWriter.writeVarBytes(base.fromHex(output.scriptPublicKey.scriptPublicKey));
}

class HashWriter {
    bufLen = 0;
    bufs: Buffer[] = [];

    toBuffer() {
        return this.concat();
    }

    concat() {
        return Buffer.concat(this.bufs, this.bufLen);
    }

    write(buf: Buffer) {
        this.bufs.push(buf);
        this.bufLen += buf.length;
        return this;
    }

    writeReverse(buf: Buffer) {
        this.bufs.push(buf.reverse());
        this.bufLen += buf.length;
        return this;
    }

    writeHash(hash: Buffer) {
        this.write(hash);
        return this;
    }

    writeVarBytes(buf: Buffer) {
        this.writeUInt64LE(buf.length);
        this.write(buf);
        return this;
    }

    writeUInt8(n: number) {
        const buf = Buffer.alloc(1);
        buf.writeUInt8(n);
        this.write(buf);
        return this;
    }

    writeUInt16LE(n: number) {
        const buf = Buffer.alloc(2);
        buf.writeUInt16LE(n);
        this.write(buf);
        return this;
    }

    writeUInt32LE(n: number) {
        const buf = Buffer.alloc(4);
        buf.writeUInt32LE(n, 0);
        this.write(buf);
        return this;
    }

    writeUInt64LE(n: number) {
        const buf = Buffer.alloc(8);
        buf.writeBigUInt64LE(BigInt(n));
        this.write(buf);
        return this;
    };

    finalize() {
        return base.blake2(this.toBuffer(),256, TransactionSigningHashKey);
    }
}
