import * as bitcoin from "./bitcoinjs-lib";
import {base, signUtil} from "@okxweb3/crypto-lib";
import * as taproot from "./taproot";
import * as bcrypto from "./bitcoinjs-lib/crypto";
import {vectorSize} from "./bitcoinjs-lib/transaction";
import {
    getAddressType,
    private2Wif,
    private2public,
    privateKeyFromWIF,
    sign,
    wif2Public
} from "./txBuild";
import {secp256k1SignTest} from "@okxweb3/coin-base";
import {isP2PKH, isP2SHScript, isP2TR} from "./bitcoinjs-lib/psbt/psbtutils";

const schnorr = signUtil.schnorr.secp256k1.schnorr

export type InscriptionData = {
    contentType: string
    body: string | Buffer
    revealAddr: string
}

export type PrevOutput = {
    txId: string
    vOut: number
    amount: number
    address: string
    privateKey: string
    publicKey?: string
}

export type InscriptionRequest = {
    commitTxPrevOutputList: PrevOutput[]
    commitFeeRate: number
    revealFeeRate: number
    inscriptionDataList: InscriptionData[]
    revealOutValue: number
    changeAddress: string
    minChangeValue?: number
}

export type InscribeTxs = {
    commitTx: string
    revealTxs: string[]
    commitTxFee: number
    revealTxFees: number[]
    commitAddrs: string[]
}

type TxOut = {
    pkScript: Buffer
    value: number
}

type InscriptionTxCtxData = {
    privateKey: Buffer
    inscriptionScript: Buffer
    commitTxAddress: string
    commitTxAddressPkScript: Buffer
    witness: Buffer[]
    hash: Buffer
    revealTxPrevOutput: TxOut
    revealPkScript: Buffer
}


const defaultTxVersion = 2;
const defaultSequenceNum = 0xfffffffd;
const defaultRevealOutValue = 546;
const defaultMinChangeValue = 546;

const maxStandardTxWeight = 4000000 / 10;

export class InscriptionTool {
    network: bitcoin.Network = bitcoin.networks.bitcoin;
    inscriptionTxCtxDataList: InscriptionTxCtxData[] = [];
    revealTxs: bitcoin.Transaction[] = [];
    commitTx: bitcoin.Transaction = new bitcoin.Transaction();
    commitTxPrevOutputFetcher: number[] = [];
    revealTxPrevOutputFetcher: number[] = [];
    mustCommitTxFee: number = 0;
    mustRevealTxFees: number[] = [];
    commitAddrs: string[] = [];

    static newInscriptionTool(network: bitcoin.Network, request: InscriptionRequest) {
        const tool = new InscriptionTool();
        tool.network = network;

        const revealOutValue = request.revealOutValue || defaultRevealOutValue;
        const minChangeValue = request.minChangeValue || defaultMinChangeValue;

        // TODO: use commitTx first input privateKey
        const privateKey = request.commitTxPrevOutputList[0].privateKey;
        request.inscriptionDataList.forEach(inscriptionData => {
            tool.inscriptionTxCtxDataList.push(createInscriptionTxCtxData(network, inscriptionData, privateKey));
        });

        const totalRevealPrevOutputValue = tool.buildEmptyRevealTx(network, revealOutValue, request.revealFeeRate);
        const insufficient = tool.buildCommitTx(network, request.commitTxPrevOutputList, request.changeAddress, totalRevealPrevOutputValue, request.commitFeeRate, minChangeValue);
        if (insufficient) {
            return tool;
        }
        tool.signCommitTx(request.commitTxPrevOutputList);
        tool.completeRevealTx();

        return tool;
    }

    buildEmptyRevealTx(network: bitcoin.Network, revealOutValue: number, revealFeeRate: number) {
        let totalPrevOutputValue = 0;
        const revealTxs: bitcoin.Transaction[] = [];
        const mustRevealTxFees: number[] = [];
        const commitAddrs: string[] = [];
        this.inscriptionTxCtxDataList.forEach((inscriptionTxCtxData, i) => {
            const tx = new bitcoin.Transaction();
            tx.version = defaultTxVersion;

            tx.addInput(Buffer.alloc(32), i, defaultSequenceNum);
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

    buildCommitTx(network: bitcoin.Network, commitTxPrevOutputList: PrevOutput[], changeAddress: string, totalRevealPrevOutputValue: number, commitFeeRate: number, minChangeValue: number): boolean {
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

        const fee = Math.floor(txForEstimate.virtualSize() * commitFeeRate);
        const changeAmount = totalSenderAmount - totalRevealPrevOutputValue - fee;
        if (changeAmount >= minChangeValue) {
            tx.outs[tx.outs.length - 1].value = changeAmount;
        } else {
            tx.outs = tx.outs.slice(0, tx.outs.length - 1);
            txForEstimate.outs = txForEstimate.outs.slice(0, txForEstimate.outs.length - 1);
            const feeWithoutChange = Math.floor(txForEstimate.virtualSize() * commitFeeRate);
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

function createInscriptionTxCtxData(network: bitcoin.Network, inscriptionData: InscriptionData, privateKeyWif: string): InscriptionTxCtxData {
    const privateKey = base.fromHex(privateKeyFromWIF(privateKeyWif, network));
    const internalPubKey = wif2Public(privateKeyWif, network).slice(1);

    const ops = bitcoin.script.OPS;

    const inscriptionBuilder: bitcoin.payments.StackElement[] = [];
    inscriptionBuilder.push(internalPubKey);
    inscriptionBuilder.push(ops.OP_CHECKSIG);
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

export function inscribe(network: bitcoin.Network, request: InscriptionRequest) {
    const tool = InscriptionTool.newInscriptionTool(network, request);
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

export function inscribeForMPCUnsigned(request: InscriptionRequest, network: bitcoin.Network) {
    const privateKey = randPrvKey(network);

    const scriptCtxList: InscriptionTxCtxData[] = [];
    request.inscriptionDataList.forEach(inscriptionData => {
        scriptCtxList.push(createInscriptionTxCtxData(network, inscriptionData, privateKey));
    });

    // build reveal tx list
    let totalRevealInValue = 0;
    const revealOutValue = request.revealOutValue || defaultRevealOutValue
    const revealTxList: bitcoin.Transaction[] = [];
    scriptCtxList.forEach((ctx, i) => {
        const tx = new bitcoin.Transaction();
        tx.version = defaultTxVersion;
        tx.addInput(Buffer.alloc(32), i, defaultSequenceNum);
        tx.addOutput(ctx.revealPkScript, revealOutValue);
        revealTxList.push(tx);

        const emptySignature = Buffer.alloc(64);
        const emptyControlBlockWitness = Buffer.alloc(33);
        const txWitness: Buffer[] = [];
        txWitness.push(emptySignature);
        txWitness.push(ctx.inscriptionScript);
        txWitness.push(emptyControlBlockWitness);
        const revealFee = Math.floor((tx.byteLength() + Math.floor((vectorSize(txWitness) + 2 + 3) / 4)) * request.revealFeeRate);
        const revealInValue = revealOutValue + revealFee;
        ctx.revealTxPrevOutput = {
            pkScript: ctx.commitTxAddressPkScript,
            value: revealInValue,
        };
        totalRevealInValue += revealInValue;
    });

    // build commit tx
    let totalCommitInValue = 0;
    const commitTx = new bitcoin.Transaction();
    commitTx.version = defaultTxVersion;
    request.commitTxPrevOutputList.forEach(uxto => {
        commitTx.addInput(base.reverseBuffer(base.fromHex(uxto.txId)), uxto.vOut, defaultSequenceNum);

        totalCommitInValue += uxto.amount;
    });
    const commitAddrs: string[] = []
    scriptCtxList.forEach(ctx => {
        commitTx.addOutput(ctx.revealTxPrevOutput.pkScript, ctx.revealTxPrevOutput.value);
        commitAddrs.push(ctx.commitTxAddress)

    });
    const changePkScript = bitcoin.address.toOutputScript(request.changeAddress, network);
    commitTx.addOutput(changePkScript, 0);

    const estimateTx = commitTx.clone();
    signTx(estimateTx, request.commitTxPrevOutputList, network);

    const fee = Math.floor(estimateTx.virtualSize() * request.commitFeeRate);
    const changeValue = totalCommitInValue - totalRevealInValue - fee;
    if (changeValue >= (request.minChangeValue || defaultMinChangeValue)) {
        commitTx.outs[commitTx.outs.length - 1].value = changeValue;
    } else {
        commitTx.outs = commitTx.outs.slice(0, commitTx.outs.length - 1);
        estimateTx.outs = estimateTx.outs.slice(0, estimateTx.outs.length - 1);
        const feeWithoutChange = Math.floor(estimateTx.virtualSize() * request.commitFeeRate);
        if (totalCommitInValue - totalRevealInValue - feeWithoutChange < 0) {
            throw new Error("insufficient balance");
        }
    }

    // calculate commit tx sigHash
    const sigHashList = calculateSigHash(commitTx, request.commitTxPrevOutputList, network);

    // sign reveal tx
    // TODO commitTx计算txid，在legacy地址的情况下需要签名数据
    const commitTxHash = commitTx.getHash();
    revealTxList.forEach((revealTx, i) => {
        revealTx.ins[0].hash = commitTxHash;

        const prevOutScripts = [scriptCtxList[i].revealTxPrevOutput.pkScript];
        const values = [scriptCtxList[i].revealTxPrevOutput.value];

        const sigHash = revealTx.hashForWitnessV1(0, prevOutScripts, values, bitcoin.Transaction.SIGHASH_DEFAULT, scriptCtxList[i].hash);
        const signature = Buffer.from(schnorr.sign(sigHash, scriptCtxList[i].privateKey, base.randomBytes(32)));
        revealTx.ins[0].witness = [signature, ...scriptCtxList[i].witness];
    });
    let commitTxFee = 0;
    commitTx.ins.forEach((_, i) => {
        commitTxFee += request.commitTxPrevOutputList[i].amount;
    });
    commitTx.outs.forEach(out => {
        commitTxFee -= out.value;
    });
    let revealTxFees: number[] = [];
    revealTxList.forEach((revealTx, i) => {
        let revealTxFee = 0;
        revealTxFee += scriptCtxList[i].revealTxPrevOutput.value;
        revealTxFee -= revealTx.outs[0].value;
        revealTxFees.push(revealTxFee);
    });
    return {
        signHashList: sigHashList,
        commitTx: commitTx.toHex(),
        revealTxs: revealTxList.map(e => e.toHex()),
        commitTxFee: commitTxFee,
        revealTxFees: revealTxFees,
        commitAddrs: commitAddrs,
    };
}

export function inscribeForMPCSigned(txHex: string, signatures: string[]) {
    const tx = bitcoin.Transaction.fromHex(txHex);

    tx.ins.forEach((input, i) => {
        const signature = base.fromHex(signatures[i]);
        if (!input.witness) {
            input.script = bitcoin.payments.p2pkh({
                pubkey: bitcoin.payments.p2pkh({input: input.script}).pubkey,
                signature: bitcoin.script.signature.encode(signature, bitcoin.Transaction.SIGHASH_ALL),
            }).input!;
        } else {
            // replace signature
            input.witness[0] = bitcoin.script.signature.encode(signature, bitcoin.Transaction.SIGHASH_ALL);
        }
    });

    return tx.toHex();
}

function calculateSigHash(tx: bitcoin.Transaction, prevOutFetcher: PrevOutput[], network: bitcoin.Network) {
    const sigHashList: string[] = [];
    tx.ins.forEach((input, i) => {
        const publicKey = base.fromHex(prevOutFetcher[i].publicKey!);
        const pkScript = bitcoin.address.toOutputScript(prevOutFetcher[i].address, network);
        const placeholderSignature = Buffer.alloc(64, 0);

        let sigHash;
        if (isP2TR(pkScript)) {
            const prevOutScripts = prevOutFetcher.map(o => bitcoin.address.toOutputScript(o.address, network));
            const values = prevOutFetcher.map(o => o.amount);
            sigHash = tx.hashForWitnessV1(i, prevOutScripts, values, bitcoin.Transaction.SIGHASH_DEFAULT);
            input.witness = [placeholderSignature];
        } else if (isP2PKH(pkScript)) {
            const prevScript = bitcoin.address.toOutputScript(prevOutFetcher[i].address, network);
            sigHash = tx.hashForSignature(i, prevScript, bitcoin.Transaction.SIGHASH_ALL)!;
            input.script = bitcoin.payments.p2pkh({
                pubkey: publicKey,
                //signature: placeholderSignature,
                signature: bitcoin.script.signature.encode(placeholderSignature, bitcoin.Transaction.SIGHASH_ALL),
            }).input!;
        } else {
            const pubKeyHash = bcrypto.hash160(publicKey);
            const prevOutScript = Buffer.of(0x19, 0x76, 0xa9, 0x14, ...pubKeyHash, 0x88, 0xac);
            sigHash = tx.hashForWitness(i, prevOutScript, prevOutFetcher[i].amount, bitcoin.Transaction.SIGHASH_ALL);
            input.witness = bitcoin.payments.p2wpkh({
                pubkey: publicKey,
                signature: bitcoin.script.signature.encode(placeholderSignature, bitcoin.Transaction.SIGHASH_ALL),
            }).witness!;

            const redeemScript = Buffer.of(0x16, 0, 20, ...pubKeyHash);
            if (isP2SHScript(pkScript)) {
                input.script = redeemScript;
            }
        }

        sigHashList.push(base.toHex(sigHash))
    });

    return sigHashList;
}

function randPrvKey(network: bitcoin.Network) {
    while (true) {
        const privateKey = base.randomBytes(32);
        if (secp256k1SignTest(privateKey)) {
            return private2Wif(privateKey, network);
        }
    }
}
