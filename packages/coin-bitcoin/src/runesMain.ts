import * as bitcoin from "./bitcoinjs-lib";
import {base, signUtil} from "@okxweb3/crypto-lib";
import * as taproot from "./taproot";
import * as bcrypto from "./bitcoinjs-lib/crypto";
import {vectorSize} from "./bitcoinjs-lib/transaction";
import {getAddressType, private2public, privateKeyFromWIF, sign, wif2Public} from "./txBuild";
import * as bscript from './bitcoinjs-lib/script';
import {countAdjustedVsize} from "./sigcost";
import {commitment, Flag, Tag} from "./rune-main/runestones";
import {encodeLEB128} from "./rune-main/leb128";
import {base26Encode} from "./rune-main/base26";
import {getSpacersVal, removeSpacers} from "./rune-main/spacers";
import {Etching, RuneData} from "./type";
import {BtcXrcTypes} from "./common";
import {InscriptionData, TxOut} from "./inscribe";

const schnorr = signUtil.schnorr.secp256k1.schnorr

export type PrevOutput = {
    txId: string
    vOut: number
    amount: number
    address: string
    privateKey: string
    publicKey?: string
}

export type RunesMainInscriptionRequest = {
    type: BtcXrcTypes,
    commitTxPrevOutputList: PrevOutput[]
    commitFeeRate: number
    revealFeeRate: number
    runeData: RuneData,
    revealOutValue: number
    changeAddress: string
    minChangeValue?: number
    shareData?: string
    masterPublicKey?: string
    chainCode?: string
    commitTx?: string
    signatureList?: string[]
}

export type RunesMainInscribeTxs = {
    commitTx: string
    revealTxs: string[]
    commitTxFee: number
    revealTxFees: number[]
    commitAddrs: string[]
}

type RunesMainInscriptionTxCtxData = {
    privateKey: Buffer
    inscriptionScript: Buffer
    commitTxAddress: string
    commitTxAddressPkScript: Buffer
    witness: Buffer[]
    hash: Buffer
    revealTxPrevOutput: TxOut
    revealPkScript: Buffer
    runeOpReturnData?: Buffer,
}


const defaultTxVersion = 2;
const defaultSequenceNum = 0xfffffffd;
const defaultRevealOutValue = 546;
const defaultMinChangeValue = 546;

const maxStandardTxWeight = 4000000 / 10;

export class RunesMainInscriptionTool {
    network: bitcoin.Network = bitcoin.networks.bitcoin;
    inscriptionTxCtxDataList: RunesMainInscriptionTxCtxData[] = [];
    revealTxs: bitcoin.Transaction[] = [];
    commitTx: bitcoin.Transaction = new bitcoin.Transaction();
    commitTxPrevOutputFetcher: number[] = [];
    revealTxPrevOutputFetcher: number[] = [];
    mustCommitTxFee: number = 0;
    mustRevealTxFees: number[] = [];
    commitAddrs: string[] = [];

    static newInscriptionTool(network: bitcoin.Network, request: RunesMainInscriptionRequest) {
        const tool = new RunesMainInscriptionTool();
        tool.network = network;

        const revealOutValue = request.revealOutValue || defaultRevealOutValue;
        const minChangeValue = request.minChangeValue || defaultMinChangeValue;
        const useDefaultOutput = request.runeData.useDefaultOutput || false;
        const defaultOutput = request.runeData.defaultOutput || 0;

        // TODO: use commitTx first input privateKey
        const privateKey = request.commitTxPrevOutputList[0].privateKey;
        //todo
        if (!request.runeData.etching || !request.runeData.revealAddr) {
            throw new Error("etching is null")
        }
        if (!checkEtching(request.runeData.etching)) {
            throw new Error("invalid etching parameter")
        }
        let etching: Etching = request.runeData.etching;
        let runeCommitment = commitment(etching.rune);
        let runeOpReturnData = buildRuneMainDeployData(etching, useDefaultOutput, defaultOutput);
        if (request.runeData.etching.contentType && request.runeData.etching.body) {
            tool.inscriptionTxCtxDataList.push(createInscriptionTxCtxData(network,
                {
                    contentType: request.runeData.etching.contentType,
                    body: request.runeData.etching.body,
                    revealAddr: request.runeData.revealAddr
                }, privateKey, runeCommitment));
        } else {
            tool.inscriptionTxCtxDataList.push(createCommitmentScript(network, privateKey, request.runeData.revealAddr, runeCommitment));
        }
        const totalRevealPrevOutputValue = tool.buildEmptyRevealTx(network, revealOutValue, request.revealFeeRate, runeOpReturnData);
        const insufficient = tool.buildCommitTx(network, request.commitTxPrevOutputList, request.changeAddress,
            totalRevealPrevOutputValue, request.commitFeeRate, minChangeValue);
        if (insufficient) {
            return tool;
        }
        tool.signCommitTx(request.commitTxPrevOutputList);
        tool.completeRevealTx();

        return tool;
    }

    buildEmptyRevealTx(network: bitcoin.Network, revealOutValue: number, revealFeeRate: number, opReturnData?: Buffer) {
        let totalPrevOutputValue = 0;
        const revealTxs: bitcoin.Transaction[] = [];
        const mustRevealTxFees: number[] = [];
        const commitAddrs: string[] = [];
        this.inscriptionTxCtxDataList.forEach((inscriptionTxCtxData, i) => {
            const tx = new bitcoin.Transaction();
            tx.version = defaultTxVersion;

            tx.addInput(Buffer.alloc(32), i, defaultSequenceNum);
            if (opReturnData) {
                tx.addOutput(opReturnData, 0);
            }
            tx.addOutput(inscriptionTxCtxData.revealPkScript, revealOutValue);

            const emptySignature = Buffer.alloc(64);
            const emptyControlBlockWitness = Buffer.alloc(33);
            const txWitness: Buffer[] = [];
            txWitness.push(emptySignature);
            txWitness.push(inscriptionTxCtxData.inscriptionScript);
            txWitness.push(emptyControlBlockWitness);
            const fee = Math.floor((tx.byteLength() + Math.floor((vectorSize(txWitness) + 2 + 3) / 4)) * revealFeeRate);

            const prevOutputValue = revealOutValue + fee;
            inscriptionTxCtxData.revealTxPrevOutput = {
                pkScript: inscriptionTxCtxData.commitTxAddressPkScript,
                value: prevOutputValue,
            };

            totalPrevOutputValue += prevOutputValue;
            revealTxs.push(tx);
            mustRevealTxFees.push(fee);
            commitAddrs.push(inscriptionTxCtxData.commitTxAddress);
        });

        this.revealTxs = revealTxs;
        this.mustRevealTxFees = mustRevealTxFees;
        this.commitAddrs = commitAddrs;

        return totalPrevOutputValue;
    }

    buildCommitTx(network: bitcoin.Network, commitTxPrevOutputList: PrevOutput[], changeAddress: string, totalRevealPrevOutputValue: number,
                  commitFeeRate: number, minChangeValue: number): boolean {
        let totalSenderAmount = 0;

        const tx = new bitcoin.Transaction();
        tx.version = defaultTxVersion;

        commitTxPrevOutputList.forEach(commitTxPrevOutput => {
            const hash = base.reverseBuffer(base.fromHex(commitTxPrevOutput.txId));
            tx.addInput(hash, commitTxPrevOutput.vOut, defaultSequenceNum);
            this.commitTxPrevOutputFetcher.push(commitTxPrevOutput.amount);
            totalSenderAmount += commitTxPrevOutput.amount;
        });
        this.inscriptionTxCtxDataList.forEach(inscriptionTxCtxData => {
            tx.addOutput(inscriptionTxCtxData.revealTxPrevOutput.pkScript, inscriptionTxCtxData.revealTxPrevOutput.value);
        });

        const changePkScript = bitcoin.address.toOutputScript(changeAddress, network);
        tx.addOutput(changePkScript, 0);

        const txForEstimate = tx.clone();
        signTx(txForEstimate, commitTxPrevOutputList, this.network);

        const vsize = countAdjustedVsize(txForEstimate, commitTxPrevOutputList.map(a => a.address), network)
        const fee = Math.floor(vsize * commitFeeRate);
        const changeAmount = totalSenderAmount - totalRevealPrevOutputValue - fee;
        if (changeAmount >= minChangeValue) {
            tx.outs[tx.outs.length - 1].value = changeAmount;
        } else {
            tx.outs = tx.outs.slice(0, tx.outs.length - 1);
            txForEstimate.outs = txForEstimate.outs.slice(0, txForEstimate.outs.length - 1);
            const vsizeWithoutChange = countAdjustedVsize(txForEstimate, commitTxPrevOutputList.map(a => a.address), network)
            const feeWithoutChange = Math.floor(vsizeWithoutChange * commitFeeRate);
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
        this.revealTxs.forEach((revealTx, i) => {
            revealTx.ins[0].hash = this.commitTx.getHash();

            const prevOutScripts = [this.inscriptionTxCtxDataList[i].revealTxPrevOutput.pkScript];
            const values = [this.inscriptionTxCtxDataList[i].revealTxPrevOutput.value];

            this.revealTxPrevOutputFetcher.push(this.inscriptionTxCtxDataList[i].revealTxPrevOutput.value);

            const hash = revealTx.hashForWitnessV1(0, prevOutScripts, values, bitcoin.Transaction.SIGHASH_DEFAULT, this.inscriptionTxCtxDataList[i].hash);
            const signature = Buffer.from(schnorr.sign(hash, this.inscriptionTxCtxDataList[i].privateKey, base.randomBytes(32)));
            revealTx.ins[0].witness = [Buffer.from(signature), ...this.inscriptionTxCtxDataList[i].witness];

            // check tx max tx wight
            const revealWeight = revealTx.weight()
            if (revealWeight > maxStandardTxWeight) {
                throw new Error(`reveal(index ${i}) transaction weight greater than ${maxStandardTxWeight} (MAX_STANDARD_TX_WEIGHT): ${revealWeight}`);
            }
        });
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
            revealTxFee += this.revealTxPrevOutputFetcher[i];
            revealTxFee -= revealTx.outs[0].value;
            revealTxFees.push(revealTxFee);
        });

        return {
            commitTxFee,
            revealTxFees,
        };
    }
}

export const uint128Max = (BigInt(1) << BigInt(128)) - BigInt(1);
export const uint64Max = (BigInt(1) << BigInt(64)) - BigInt(1);
const MAX_DIVISIBILITY = 38;
export const MAX_SPACERS = 0b00000111_11111111_11111111_11111111;

export function checkEtching(e: Etching): boolean {
    let premine = e.premine ? BigInt(e.premine) : BigInt(0);
    if (premine > uint128Max || premine < 0) {
        return false
    }
    if (e.terms) {
        let amount = e.terms.amount ? BigInt(e.terms.amount) : BigInt(0);
        let cap = e.terms.cap ? BigInt(e.terms.cap) : BigInt(0);
        if (amount < 0 || amount > uint128Max || cap < 0 || cap > uint128Max) {
            return false
        }
        if (amount * cap > uint128Max) {
            return false;
        }
        let supply = premine + amount * cap;
        if (supply > uint128Max) {
            return false
        }
        if (e.terms.height) {
            if (e.terms.height.start) {
                if (e.terms.height.start < 0 || e.terms.height.start > uint64Max) {
                    return false
                }
            }
            if (e.terms.height.end) {
                if (e.terms.height.end < 0 || e.terms.height.end > uint64Max) {
                    return false
                }
            }
        }
    }
    if (e.divisibility) {
        if (e.divisibility < 0 || e.divisibility > MAX_DIVISIBILITY) {
            return false
        }
    }
    if (typeof e.rune.value === "string") {
        let spacers = getSpacersVal(e.rune.value);
        if (spacers > MAX_SPACERS) {
            return false
        }
        let v = base26Encode(removeSpacers(e.rune.value));
        if (v > uint128Max) {
            return false;
        }
    }
    return true;
}

export function runesMainInscribe(network: bitcoin.Network, request: RunesMainInscriptionRequest) {
    const tool = RunesMainInscriptionTool.newInscriptionTool(network, request);
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

function signTx(tx: bitcoin.Transaction, commitTxPrevOutputList: PrevOutput[], network: bitcoin.Network) {
    tx.ins.forEach((input, i) => {
        const addressType = getAddressType(commitTxPrevOutputList[i].address, network);
        const privateKey = base.fromHex(privateKeyFromWIF(commitTxPrevOutputList[i].privateKey, network));
        const privateKeyHex = base.toHex(privateKey);
        const publicKey = private2public(privateKeyHex);

        if (addressType === 'segwit_taproot') {
            const prevOutScripts = commitTxPrevOutputList.map(o => bitcoin.address.toOutputScript(o.address, network));
            const values = commitTxPrevOutputList.map(o => o.amount);
            const hash = tx.hashForWitnessV1(i, prevOutScripts, values, bitcoin.Transaction.SIGHASH_DEFAULT);
            const tweakedPrivKey = taproot.taprootTweakPrivKey(privateKey);
            const signature = Buffer.from(schnorr.sign(hash, tweakedPrivKey, base.randomBytes(32)));

            input.witness = [Buffer.from(signature)];

        } else if (addressType === 'legacy') {
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

function createCommitmentScript(network: bitcoin.Network, privateKeyWif: string, revealAddr: string, commitment: Buffer): RunesMainInscriptionTxCtxData {
    const privateKey = base.fromHex(privateKeyFromWIF(privateKeyWif, network));
    const internalPubKey = wif2Public(privateKeyWif, network).slice(1);
    const inscriptionBuilder: bitcoin.payments.StackElement[] = [];
    inscriptionBuilder.push(internalPubKey);
    const ops = bitcoin.script.OPS;
    inscriptionBuilder.push(ops.OP_CHECKSIG);
    inscriptionBuilder.push(ops.OP_FALSE);
    inscriptionBuilder.push(ops.OP_IF);
    inscriptionBuilder.push(commitment);
    inscriptionBuilder.push(ops.OP_ENDIF);
    let inscriptionScript = bitcoin.script.compile(inscriptionBuilder);
    const scriptTree = {
        output: inscriptionScript,
    };

    const redeem = {
        output: inscriptionScript,
        redeemVersion: 0xc0,
    };

    const {output, witness, hash, address} = bitcoin.payments.p2tr({
        internalPubkey: internalPubKey,
        scriptTree,
        redeem,
        network,
    });
    return {
        privateKey,
        inscriptionScript,
        commitTxAddress: address!,//inscriptionAddress
        commitTxAddressPkScript: output!,//inscriptionPkScript
        witness: witness!,
        hash: hash!,
        revealTxPrevOutput: {
            pkScript: Buffer.alloc(0),
            value: 0,
        },
        revealPkScript: bitcoin.address.toOutputScript(revealAddr, network),
    };
}

function createInscriptionTxCtxData(network: bitcoin.Network, inscriptionData: InscriptionData, privateKeyWif: string,
                                    inscriptionAddData?: Buffer): RunesMainInscriptionTxCtxData {
    const privateKey = base.fromHex(privateKeyFromWIF(privateKeyWif, network));
    const internalPubKey = wif2Public(privateKeyWif, network).slice(1);

    const ops = bitcoin.script.OPS;

    const inscriptionBuilder: bitcoin.payments.StackElement[] = [];
    inscriptionBuilder.push(internalPubKey);
    inscriptionBuilder.push(ops.OP_CHECKSIG);
    //Ordinals script
    if (inscriptionAddData && inscriptionAddData.length > 0) {
        inscriptionBuilder.push(inscriptionAddData);
        inscriptionBuilder.push(ops.OP_DROP);
    }
    inscriptionBuilder.push(ops.OP_FALSE);
    inscriptionBuilder.push(ops.OP_IF);
    inscriptionBuilder.push(Buffer.from("ord"));
    inscriptionBuilder.push(ops.OP_DATA_1);
    inscriptionBuilder.push(ops.OP_DATA_1);
    inscriptionBuilder.push(Buffer.from(inscriptionData.contentType));
    inscriptionBuilder.push(ops.OP_0);
    const maxChunkSize = 520;
    let body = Buffer.from(inscriptionData.body);
    let bodySize = body.length;
    for (let i = 0; i < bodySize; i += maxChunkSize) {
        let end = i + maxChunkSize;
        if (end > bodySize) {
            end = bodySize;
        }
        inscriptionBuilder.push(body.slice(i, end));
    }
    inscriptionBuilder.push(ops.OP_ENDIF);
    const inscriptionScript = bitcoin.script.compile(inscriptionBuilder);
    const scriptTree = {
        output: inscriptionScript,
    };
    const redeem = {
        output: inscriptionScript,
        redeemVersion: 0xc0,
    };

    const {output, witness, hash, address} = bitcoin.payments.p2tr({
        internalPubkey: internalPubKey,
        scriptTree,
        redeem,
        network,
    });
    return {
        privateKey,
        inscriptionScript,
        commitTxAddress: address!,
        commitTxAddressPkScript: output!,
        witness: witness!,
        hash: hash!,
        revealTxPrevOutput: {
            pkScript: Buffer.alloc(0),
            value: 0,
        },
        revealPkScript: bitcoin.address.toOutputScript(inscriptionData.revealAddr, network),
    };
}

export function inscribe(network: bitcoin.Network, request: RunesMainInscriptionRequest) {
    const tool = RunesMainInscriptionTool.newInscriptionTool(network, request);
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

//todo 编码校验 和 rust实现对比
export function buildRuneMainDeployData(etching: Etching, useDefaultOutput: boolean, defaultOutput: number): Buffer {
    let msg = buildMessage(etching, useDefaultOutput, defaultOutput);
    let msgBuff = toBuffer(msg);
    const prefix = Buffer.from('6a5d', 'hex')  // OP_RETURN OP_13
    let pushNum;
    if (msgBuff.length < 0x4c) {
        pushNum = Buffer.alloc(1)
        pushNum.writeUint8(msgBuff.length)
    } else if (msgBuff.length < 0x100) {
        pushNum = Buffer.alloc(2)
        pushNum.writeUint8(0x4c)
        pushNum.writeUint8(msgBuff.length, 1)
    } else if (msgBuff.length < 0x10000) {
        pushNum = Buffer.alloc(3)
        pushNum.writeUint8(0x4d)
        pushNum.writeUint16LE(msgBuff.length, 1)
    } else if (msgBuff.length < 0x100000000) {
        pushNum = Buffer.alloc(5)
        pushNum.writeUint8(0x4e)
        pushNum.writeUint32LE(msgBuff.length, 1)
    } else {
        throw new Error("runestone too big!")
    }
    return bscript.compile(Buffer.concat([prefix, pushNum, msgBuff]))
}

function toBuffer(msg: Map<number, bigint[]>): Buffer {
    let buffArr: Buffer[] = []
    // Serialize fields.
    for (const [tag, vals] of msg) {
        for (const val of vals) {
            const tagBuff = Buffer.alloc(1)
            tagBuff.writeUInt8(tag)
            buffArr.push(tagBuff)
            buffArr.push(Buffer.from(encodeLEB128(val)))
        }
    }
    return Buffer.concat(buffArr)
}

function buildMessage(etching: Etching, useDefaultOutput: boolean, defaultOutput: number): Map<number, bigint[]> {
    let fields: Map<number, bigint[]> = new Map();
    let flags = 1;
    if (etching.terms) {
        let mask = 1 << Flag.Terms;
        flags |= mask
    }

    if (etching.turbo) {
        let mask = 1 << Flag.Turbo;
        flags |= mask
    }

    fields.set(Tag.Flags, [BigInt(flags)])

    let runeValue: bigint;
    if (typeof etching.rune.value === 'string') {
        runeValue = base26Encode(removeSpacers(etching.rune.value))
    } else {
        runeValue = etching.rune.value
    }
    fields.set(Tag.Rune, [BigInt(runeValue)])

    if (etching.divisibility) {
        fields.set(Tag.Divisibility, [BigInt(etching.divisibility)])
    }
    if (etching.spacers) {
        fields.set(Tag.Spacers, [BigInt(etching.spacers)])
    } else {
        let spacers;
        if (typeof etching.rune.value === "bigint") {
            spacers = 0
        } else {
            spacers = getSpacersVal(etching.rune.value)
        }
        if (spacers !== 0) {
            fields.set(Tag.Spacers, [BigInt(spacers)])
        }
    }

    if (etching.symbol) {
        fields.set(Tag.Symbol, [BigInt(etching.symbol.charCodeAt(0))])
    }

    if (etching.premine) {
        fields.set(Tag.Premine, [BigInt(etching.premine)])
    }
    if (etching.terms) {
        if (etching.terms.amount) {
            fields.set(Tag.Amount, [BigInt(etching.terms.amount)])
        }
        if (etching.terms.cap) {
            fields.set(Tag.Cap, [BigInt(etching.terms.cap)])
        }
        if (etching.terms.height) {
            const heightStart = etching.terms.height.start;
            if (heightStart) {
                fields.set(Tag.HeightStart, [BigInt(heightStart)])
            }
            const heightEnd = etching.terms.height.end;
            if (heightEnd) {
                fields.set(Tag.HeightEnd, [BigInt(heightEnd)])
            }
        }
        if (etching.terms.offset) {
            const offsetStart = etching.terms.offset.start;

            if (offsetStart) {
                fields.set(Tag.OffsetStart, [BigInt(offsetStart)])
            }
            const offsetEnd = etching.terms.offset.end;
            if (offsetEnd) {
                fields.set(Tag.OffsetEnd, [BigInt(offsetEnd)])
            }
        }
    }
    if (useDefaultOutput && defaultOutput) {
        fields.set(Tag.Pointer, [BigInt(defaultOutput)])
    }
    return fields
}