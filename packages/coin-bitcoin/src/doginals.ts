import * as bitcoin from "./bitcoinjs-lib";
import {base} from "@okxweb3/crypto-lib";
import * as bcrypto from "./bitcoinjs-lib/crypto";
import {
    getAddressType,
    private2public,
    privateKeyFromWIF,
    sign,
    wif2Public
} from "./txBuild";
import {BufferWriter} from "./bitcoinjs-lib";
import {OPS} from "./bitcoinjs-lib/ops";
import * as payments from "./bitcoinjs-lib/payments";
import {InscriptionData, PrevOutput, TxOut} from "./inscribe";
import {varuint} from "./bitcoinjs-lib/bufferutils";


export const CHANGE_OUTPUT_MAX_SIZE = 20 + 4 + 34 + 4;

const defaultTxVersion = 2;
const defaultSequenceNum = 0xfffffffd;
const defaultRevealOutValue = 100000;
const defaultMinChangeValue = 100000;

const MAX_CHUNK_LEN = 240
const MAX_PAYLOAD_LEN = 1500

export type DogInscriptionRequest = {
    commitTxPrevOutputList: PrevOutput[]
    commitFeeRate: number
    revealFeeRate: number
    inscriptionData: InscriptionData
    revealOutValue: number
    changeAddress: string
    minChangeValue?: number
}

type DogInscriptionTxCtxData = {
    privateKey: Buffer
    inscriptionScript?: Buffer
    redeemScript?: Buffer
    commitTxAddress?: string
    commitTxAddressPkScript?: Buffer
    hash?: Buffer
    revealTxPrevOutput?: TxOut
    revealPkScript?: Buffer
}

export type  Chunk = {
    buf: Buffer
    len: number
    opcodenum: number
}

function numberToChunk(n: number): Chunk {
    return {
        // @ts-ignore
        buf: n <= 16 ? undefined : n < 128 ? Buffer.from([n]) : Buffer.from([n % 256, n / 256]),
        len: n <= 16 ? 0 : n < 128 ? 1 : 2,
        opcodenum: n == 0 ? 0 : n <= 16 ? 80 + n : n < 128 ? 1 : 2
    }
}

export function bufferToBuffer(b: Buffer): Buffer {
    let c = bufferToChunk(b)
    let size = varuint.encodingLength(c.opcodenum)
    var opcodenum = c.opcodenum;
    if (c.buf) {
        if (opcodenum === OPS.OP_PUSHDATA1) {
            size += varuint.encodingLength(c.len)
        } else if (opcodenum === OPS.OP_PUSHDATA2) {
            size += varuint.encodingLength(c.len)
        } else if (opcodenum === OPS.OP_PUSHDATA4) {
            size += varuint.encodingLength(c.len)
        }
        size += c.buf.length
    }
    let bw = BufferWriter.withCapacity(size);
    bw.writeUInt8(c.opcodenum);
    if (c.buf) {
        if (opcodenum < OPS.OP_PUSHDATA1) {
            bw.writeSlice(c.buf);
        } else if (opcodenum === OPS.OP_PUSHDATA1) {
            bw.writeUInt8(c.len);
            bw.writeSlice(c.buf);
        } else if (opcodenum === OPS.OP_PUSHDATA2) {
            bw.writeUInt64(c.len);
            bw.writeSlice(c.buf);
        } else if (opcodenum === OPS.OP_PUSHDATA4) {
            bw.writeUInt32(c.len);
            bw.writeSlice(c.buf);
        }
    }
    return bw.end();
}

export function bufferToChunk(b: Buffer): Chunk {
    return {
        // @ts-ignore
        buf: b.length ? b : undefined,
        len: b.length,
        opcodenum: b.length <= 75 ? b.length : b.length <= 255 ? 76 : 77
    }
}

function opcodeToChunk(op: number): Chunk {
    // @ts-ignore
    return {opcodenum: op}
}

export class DogScript {
    chunks: Chunk[] = []

    total(): number {
        if (this.chunks.length == 0) {
            return 0
        }
        const size = this.chunks
            .map(chunk => {
                let size = varuint.encodingLength(chunk.opcodenum)
                var opcodenum = chunk.opcodenum;
                if (chunk.buf) {
                    if (opcodenum < OPS.OP_PUSHDATA1) {
                    } else if (opcodenum === OPS.OP_PUSHDATA1) {
                        size += varuint.encodingLength(chunk.len)
                    } else if (opcodenum === OPS.OP_PUSHDATA2) {
                        size += varuint.encodingLength(chunk.len)
                    } else if (opcodenum === OPS.OP_PUSHDATA4) {
                        size += varuint.encodingLength(chunk.len)
                    }
                    size += chunk.buf.length
                }
                return size
            })
            .reduce((a, b) => a + b);
        return size
    }

    toBuffer(): Buffer {
        let total = this.total()
        let bw = BufferWriter.withCapacity(total);
        for (var i = 0; i < this.chunks.length; i++) {
            var chunk = this.chunks[i];
            var opcodenum = chunk.opcodenum;
            bw.writeUInt8(chunk.opcodenum);
            if (chunk.buf) {
                if (opcodenum < OPS.OP_PUSHDATA1) {
                    bw.writeSlice(chunk.buf);
                } else if (opcodenum === OPS.OP_PUSHDATA1) {
                    bw.writeUInt8(chunk.len);
                    bw.writeSlice(chunk.buf);
                } else if (opcodenum === OPS.OP_PUSHDATA2) {
                    bw.writeUInt64(chunk.len);
                    bw.writeSlice(chunk.buf);
                } else if (opcodenum === OPS.OP_PUSHDATA4) {
                    bw.writeUInt32(chunk.len);
                    bw.writeSlice(chunk.buf);
                }
            }
        }
        return bw.end();
    }
}

export class DogInscriptionTool {
    network: bitcoin.Network = bitcoin.networks.bitcoin;
    inscriptionTxCtxDataList: DogInscriptionTxCtxData[] = [];
    revealTxs: bitcoin.Transaction[] = [];
    commitTx: bitcoin.Transaction = new bitcoin.Transaction();
    commitTxPrevOutputFetcher: number[] = [];
    revealTxPrevOutputFetcher: number[] = [];
    mustCommitTxFee: number = 0;
    mustRevealTxFees: number[] = [];
    commitAddrs: string[] = [];
    fromAddr: string = '';
    revealAddr: string = '';

    static newDogInscriptionTool(network: bitcoin.Network, request: DogInscriptionRequest) {
        const tool = new DogInscriptionTool();
        tool.network = network;
        const revealOutValue = request.revealOutValue || defaultRevealOutValue;
        const minChangeValue = request.minChangeValue || defaultMinChangeValue;

        // TODO: use commitTx first input privateKey
        const privateKey = request.commitTxPrevOutputList[0].privateKey;
        tool.inscriptionTxCtxDataList = createInscriptionTxCtxData(network, request.inscriptionData, privateKey);
        tool.revealAddr = request.inscriptionData.revealAddr
        const privateKeyHex = base.toHex(base.fromHex(privateKeyFromWIF(privateKey, network)));
        const publicKey = private2public(privateKeyHex);
        tool.fromAddr = bitcoin.payments.p2pkh({pubkey: publicKey, network: network}).address!
        const totalRevealPrevOutputValue = tool.buildEmptyRevealTxs(network, revealOutValue, request.revealFeeRate);
        const insufficient = tool.buildCommitTx(network, request.commitTxPrevOutputList, request.changeAddress, totalRevealPrevOutputValue, revealOutValue, request.commitFeeRate, minChangeValue);
        if (insufficient) {
            return tool;
        }
        tool.signCommitTx(request.commitTxPrevOutputList);
        tool.completeRevealTx();

        return tool;
    }

    buildEmptyRevealTxs(network: bitcoin.Network, revealOutValue: number, revealFeeRate: number) {
        let totalPrevOutputValue = 0;
        const revealTxs: bitcoin.Transaction[] = [];
        const mustRevealTxFees: number[] = [];
        const commitAddrs: string[] = [];
        let left = 0;
        for (let i = this.inscriptionTxCtxDataList.length - 1; i > -1; i--) {
            let inscriptionTxCtxData = this.inscriptionTxCtxDataList[i]
            const tx = new bitcoin.Transaction();
            tx.version = defaultTxVersion;

            tx.addInput(Buffer.alloc(32), 0, defaultSequenceNum);
            tx.addInput(Buffer.alloc(32), 1, defaultSequenceNum);
            tx.addOutput(i != this.inscriptionTxCtxDataList.length - 1 ? inscriptionTxCtxData.commitTxAddressPkScript! : inscriptionTxCtxData.revealPkScript!, revealOutValue);

            const emptySignature = Buffer.alloc(72);

            let unlock = Buffer.concat([inscriptionTxCtxData.inscriptionScript!, bufferToBuffer(emptySignature), bufferToBuffer(inscriptionTxCtxData.redeemScript!)])
            // @ts-ignore
            tx.ins[0].script = unlock
            if (i != this.inscriptionTxCtxDataList.length - 1) {
                tx.addOutput(bitcoin.address.toOutputScript(this.fromAddr, network), left)
            }
            tx.ins[1].script = Buffer.alloc(106)
            const fee = Math.floor((tx.dogeByteLength() + CHANGE_OUTPUT_MAX_SIZE) * revealFeeRate);
            left += fee
            const prevOutputValue = fee;
            // @ts-ignore
            inscriptionTxCtxData.revealTxPrevOutput = {
                pkScript: inscriptionTxCtxData.commitTxAddressPkScript!,
                value: prevOutputValue,
            };
            totalPrevOutputValue += prevOutputValue;
            revealTxs.push(tx);
            mustRevealTxFees.push(fee);
            commitAddrs.push(inscriptionTxCtxData.commitTxAddress!);
        }
        for (let i = 0, j = revealTxs.length - 1; i < j; i++, j--) {
            [revealTxs[i], revealTxs[j]] = [revealTxs[j], revealTxs[i]];
            [mustRevealTxFees[i], mustRevealTxFees[j]] = [mustRevealTxFees[j], mustRevealTxFees[i]];
            [commitAddrs[i], commitAddrs[j]] = [commitAddrs[j], commitAddrs[i]];
        }
        this.revealTxs = revealTxs;
        this.mustRevealTxFees = mustRevealTxFees;
        this.commitAddrs = commitAddrs;
        totalPrevOutputValue += revealOutValue
        return totalPrevOutputValue;
    }

    buildCommitTx(network: bitcoin.Network, commitTxPrevOutputList: PrevOutput[], changeAddress: string, totalRevealPrevOutputValue: number, revealOutValue: number, commitFeeRate: number, minChangeValue: number): boolean {
        let totalSenderAmount = 0;

        const tx = new bitcoin.Transaction();
        tx.version = defaultTxVersion;

        commitTxPrevOutputList.forEach(commitTxPrevOutput => {
            const hash = base.reverseBuffer(base.fromHex(commitTxPrevOutput.txId));
            tx.addInput(hash, commitTxPrevOutput.vOut, defaultSequenceNum);
            this.commitTxPrevOutputFetcher.push(commitTxPrevOutput.amount);
            totalSenderAmount += commitTxPrevOutput.amount;
        });

        tx.addOutput(this.inscriptionTxCtxDataList[0].revealTxPrevOutput!.pkScript!, revealOutValue);
        tx.addOutput(bitcoin.address.toOutputScript(this.fromAddr, network), totalRevealPrevOutputValue)
        const changePkScript = bitcoin.address.toOutputScript(changeAddress, network);
        tx.addOutput(changePkScript, 0);

        const txForEstimate = tx.clone();
        signTx(txForEstimate, commitTxPrevOutputList, this.network);

        const fee = Math.floor((txForEstimate.dogeByteLength() + CHANGE_OUTPUT_MAX_SIZE) * commitFeeRate);
        const changeAmount = totalSenderAmount - totalRevealPrevOutputValue - fee;
        if (changeAmount >= minChangeValue) {
            tx.outs[tx.outs.length - 1].value = changeAmount;
        } else {
            tx.outs = tx.outs.slice(0, tx.outs.length - 1);
            txForEstimate.outs = txForEstimate.outs.slice(0, txForEstimate.outs.length - 1);
            const feeWithoutChange = Math.floor(txForEstimate.dogeByteLength() * commitFeeRate);
            if (totalSenderAmount - totalRevealPrevOutputValue - feeWithoutChange < 0) {
                this.mustCommitTxFee = fee;
                return true;
            }
        }

        this.commitTx = tx;
        return false;
    }

    signCommitTx(commitTxPrevOutputList: PrevOutput[]) {
        signTx(this.commitTx, commitTxPrevOutputList, this.network);
    }

    completeRevealTx() {
        for (let i = 0; i < this.revealTxs.length; i++) {
            let revealTx = this.revealTxs[i]
            revealTx.ins[0].hash = i == 0 ? this.commitTx.getHash() : this.revealTxs[i - 1].getHash();
            revealTx.ins[1].hash = i == 0 ? this.commitTx.getHash() : this.revealTxs[i - 1].getHash();

            this.revealTxPrevOutputFetcher.push(this.inscriptionTxCtxDataList[i].revealTxPrevOutput!.value);
            const prevOutScripts = this.inscriptionTxCtxDataList[i].redeemScript!;//相同
            const hash = revealTx.hashForSignature(0, prevOutScripts, bitcoin.Transaction.SIGHASH_ALL);
            const privateKeyHex = base.toHex(this.inscriptionTxCtxDataList[i].privateKey);
            const signature = sign(hash, privateKeyHex);
            let txsignature = bitcoin.script.signature.encode(signature, bitcoin.Transaction.SIGHASH_ALL)
            revealTx.ins[0].script = Buffer.concat([this.inscriptionTxCtxDataList[i].inscriptionScript!, bufferToBuffer(txsignature), bufferToBuffer(this.inscriptionTxCtxDataList[i].redeemScript!)])

            const prevScript = bitcoin.address.toOutputScript(this.fromAddr, this.network);
            const hash2 = revealTx.hashForSignature(1, prevScript, bitcoin.Transaction.SIGHASH_ALL)!;
            const signature2 = sign(hash2, privateKeyHex);
            const payment = bitcoin.payments.p2pkh({
                signature: bitcoin.script.signature.encode(signature2, bitcoin.Transaction.SIGHASH_ALL),
                pubkey: private2public(privateKeyHex),
            });
            revealTx.ins[1].script = payment.input!;
        }
    }

    calculateFee() {
        let commitTxFee = 0;
        this.commitTx.ins.forEach((_, i) => {
            commitTxFee += this.commitTxPrevOutputFetcher[i];
        });
        this.commitTx.outs.forEach(out => {
            commitTxFee -= out.value;
        });
        let revealTxFees: number[] = [];
        this.revealTxs.forEach((revealTx, i) => {
            let revealTxFee = 0;
            revealTxFee = this.revealTxPrevOutputFetcher[i];
            revealTxFees.push(revealTxFee);
        });

        return {
            commitTxFee,
            revealTxFees,
        };
    }
}

function signTx(tx: bitcoin.Transaction, commitTxPrevOutputList: PrevOutput[], network: bitcoin.Network,) {
    tx.ins.forEach((input, i) => {
        const addressType = getAddressType(commitTxPrevOutputList[i].address, network);
        const privateKey = base.fromHex(privateKeyFromWIF(commitTxPrevOutputList[i].privateKey, network));
        const privateKeyHex = base.toHex(privateKey);
        const publicKey = private2public(privateKeyHex);

        if (addressType === 'legacy') {
            const prevScript = bitcoin.address.toOutputScript(commitTxPrevOutputList[i].address, network);
            const hash = tx.hashForSignature(i, prevScript, bitcoin.Transaction.SIGHASH_ALL)!;
            const signature = sign(hash, privateKeyHex);
            const payment = bitcoin.payments.p2pkh({
                signature: bitcoin.script.signature.encode(signature, bitcoin.Transaction.SIGHASH_ALL),
                pubkey: publicKey,
            });

            input.script = payment.input!;

        } else {
            const pubKeyHash = bcrypto.hash160(publicKey);
            const prevOutScript = Buffer.of(0x19, 0x76, 0xa9, 0x14, ...pubKeyHash, 0x88, 0xac);
            const value = commitTxPrevOutputList[i].amount;
            const hash = tx.hashForWitness(i, prevOutScript, value, bitcoin.Transaction.SIGHASH_ALL);
            const signature = sign(hash, privateKeyHex);

            input.witness = [
                bitcoin.script.signature.encode(signature, bitcoin.Transaction.SIGHASH_ALL),
                publicKey,
            ];

            const redeemScript = Buffer.of(0x16, 0, 20, ...pubKeyHash);
            if (addressType === "segwit_nested") {
                input.script = redeemScript;
            }
        }
    });
}

function createInscriptionTxCtxData(network: bitcoin.Network, inscriptionData: InscriptionData, privateKeyWif: string): DogInscriptionTxCtxData[] {
    const privateKey = base.fromHex(privateKeyFromWIF(privateKeyWif, network));
    const pubKey = wif2Public(privateKeyWif, network);

    const ops = bitcoin.script.OPS;
    let data: Buffer
    if (typeof inscriptionData.body == 'string') {
        data = Buffer.from(inscriptionData.body)
    } else {
        data = inscriptionData.body as Buffer
    }
    let parts: Buffer[] = []
    while (data.length) {
        let part = data.slice(0, Math.min(MAX_CHUNK_LEN, data.length))
        data = data.slice(part.length)
        parts.push(part);
    }

    let inscription: DogScript = new DogScript();
    inscription.chunks.push(bufferToChunk(Buffer.from('ord')))
    inscription.chunks.push(numberToChunk(parts.length))
    inscription.chunks.push(bufferToChunk(Buffer.from(inscriptionData.contentType)))
    parts.forEach((part, n) => {
        inscription.chunks.push(numberToChunk(parts.length - n - 1))
        inscription.chunks.push(bufferToChunk(part))
    })
    let ctxDatas: DogInscriptionTxCtxData[] = [];
    while (inscription.chunks.length) {
        let partial = new DogScript()
        if (ctxDatas.length == 0) {
            // @ts-ignore
            partial.chunks.push(inscription.chunks.shift())
        }
        while (partial.total() <= MAX_PAYLOAD_LEN && inscription.chunks.length) {
            // @ts-ignore
            partial.chunks.push(inscription.chunks.shift())
            // @ts-ignore
            partial.chunks.push(inscription.chunks.shift())
        }

        if (partial.total() > MAX_PAYLOAD_LEN) {
            // @ts-ignore
            inscription.chunks.unshift(partial.chunks.pop())
            // @ts-ignore
            inscription.chunks.unshift(partial.chunks.pop())
        }

        let lock = new DogScript()
        lock.chunks.push(bufferToChunk(pubKey))
        lock.chunks.push(opcodeToChunk(ops.OP_CHECKSIGVERIFY))
        partial.chunks.forEach(() => {
            lock.chunks.push(opcodeToChunk(ops.OP_DROP))
        })
        lock.chunks.push(opcodeToChunk(ops.OP_TRUE))
        let lockhash = base.ripemd160(base.sha256(lock.toBuffer()))
        let {output, address} = payments.p2sh({hash: Buffer.from(lockhash), network: network});
        let ctx: DogInscriptionTxCtxData = {
            privateKey: privateKey,
            inscriptionScript: partial.toBuffer(),
            redeemScript: lock.toBuffer(),
            commitTxAddress: address!,
            commitTxAddressPkScript: output,
            revealTxPrevOutput: {
                pkScript: Buffer.alloc(0),
                value: 100000,
            },
            revealPkScript: bitcoin.address.toOutputScript(inscriptionData.revealAddr, network),
        }
        ctxDatas.push(ctx)
    }
    return ctxDatas
}

export function dogInscribe(network: bitcoin.Network, request: DogInscriptionRequest) {
    const tool = DogInscriptionTool.newDogInscriptionTool(network, request);
    if (tool.mustCommitTxFee > 0) {
        return {
            commitTx: "",
            revealTxs: [],
            commitTxFee: tool.mustCommitTxFee,
            revealTxFees: tool.mustRevealTxFees,
            commitAddrs: tool.commitAddrs,
        };
    }

    return {
        commitTx: tool.commitTx.toHex(),
        revealTxs: tool.revealTxs.map(revealTx => revealTx.toHex()),
        ...tool.calculateFee(),
        commitAddrs: tool.commitAddrs,
    };
}