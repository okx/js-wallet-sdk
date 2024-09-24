import * as bitcoin from "./bitcoinjs-lib";
import {base, signUtil} from "@okxweb3/crypto-lib";
import * as taproot from "./taproot";
import * as bcrypto from "./bitcoinjs-lib/crypto";
import {
    getAddressType,
    private2public,
    privateKeyFromWIF,
    sign,
    wif2Public
} from "./txBuild";
import {countAdjustedVsize} from "./sigcost";

const schnorr = signUtil.schnorr.secp256k1.schnorr

export type InscriptionRefundFeeData = {
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

export type InscriptionRefundFeeRequest = {
    inputs: PrevOutput[]
    feeRate: number
    // revealFeeRate: number
    inscriptionRefundFeeDataList: InscriptionRefundFeeData[]
    // revealOutValue: number
    changeAddress: string
    minChangeValue?: number
    shareData?: string
    masterPublicKey?: string
    chainCode?: string
    commitTx?: string
    signatureList?: string[]
    middleAddress?: string
    maxAmountOfInput?: number
}

export type InscribeTxs = {
    commitTx: string
    revealTxs: string[]
    commitTxFee: number
    revealTxFees: number[]
    commitAddrs: string[]
}

export type TxOut = {
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


export class InscriptionRefundFeeTool {
    network: bitcoin.Network = bitcoin.networks.bitcoin;
    inscriptionTxCtxDataList: InscriptionTxCtxData[] = [];
    refundFeeTx: bitcoin.Transaction = new bitcoin.Transaction();
    commitTxPrevOutputFetcher: number[] = [];
    revealTxPrevOutputFetcher: number[] = [];
    mustTxFee: number = 0;
    // mustRevealTxFees: number[] = [];
    commitAddrs: string[] = [];
    merkleRoot = new Uint8Array();

    static newInscriptionRefundFeeTool(network: bitcoin.Network, request: InscriptionRefundFeeRequest) {
        const tool = new InscriptionRefundFeeTool();
        tool.network = network;

        const minChangeValue = request.minChangeValue || defaultMinChangeValue;
        // if (!request.middleAddress) {
        //     throw new Error("need check middle address")
        // }
        if (request.inputs && request.inputs.length > 600) {
            throw new Error("invalid amount of inputs");
        }
        let amountOfInputs = 100;
        if (request.maxAmountOfInput) {
            amountOfInputs = request.maxAmountOfInput;
        }
        if (amountOfInputs > request.inputs.length) {
            amountOfInputs = request.inputs.length
        }
        // TODO: use commitTx first input privateKey
        const privateKey = request.inputs[0].privateKey;
        request.inscriptionRefundFeeDataList.forEach(inscriptionData => {
            tool.inscriptionTxCtxDataList.push(createInscriptionTxCtxData(network, inscriptionData, privateKey));
        });

        if (request.middleAddress && request.middleAddress != tool.inscriptionTxCtxDataList[0].commitTxAddress) {
            throw new Error("invalid middle address")
        } else {
            tool.commitAddrs = [tool.inscriptionTxCtxDataList[0].commitTxAddress]
        }
        tool.merkleRoot = tool.inscriptionTxCtxDataList[0].hash;
        const insufficient = tool.buildrRefundFeeTx(network, request.inputs.slice(0, amountOfInputs), request.changeAddress, 0, request.feeRate, minChangeValue);
        if (insufficient) {
            return tool;
        }
        tool.signRefundFeeTx(request.inputs.slice(0, amountOfInputs));
        return tool;
    }

    buildrRefundFeeTx(network: bitcoin.Network, prevOutputList: PrevOutput[], changeAddress: string, totalRevealPrevOutputValue: number, commitFeeRate: number, minChangeValue: number): boolean {
        let totalSenderAmount = 0;
        const tx = new bitcoin.Transaction();
        tx.version = defaultTxVersion;

        prevOutputList.forEach(prevOutput => {
            const hash = base.reverseBuffer(base.fromHex(prevOutput.txId));
            tx.addInput(hash, prevOutput.vOut, defaultSequenceNum);
            this.commitTxPrevOutputFetcher.push(prevOutput.amount);
            totalSenderAmount += prevOutput.amount;
        });
        const changePkScript = bitcoin.address.toOutputScript(changeAddress, network);
        tx.addOutput(changePkScript, 0);
        const txForEstimate = tx.clone();
        signTx(txForEstimate, prevOutputList, this.network);
        const vsize = countAdjustedVsize(txForEstimate, prevOutputList.map(a => a.address), network)
        const fee = Math.floor(vsize * commitFeeRate);
        const changeAmount = totalSenderAmount - totalRevealPrevOutputValue - fee;
        if (changeAmount >= minChangeValue) {
            tx.outs[tx.outs.length - 1].value = changeAmount;
        } else {
            if (tx.outs.length <= 1) {
                throw new Error("change amount < min change amount")
            }
            tx.outs = tx.outs.slice(0, tx.outs.length - 1);
            txForEstimate.outs = txForEstimate.outs.slice(0, txForEstimate.outs.length - 1);
            const vsizeWithoutChange = countAdjustedVsize(txForEstimate, prevOutputList.map(a => a.address), network)
            const feeWithoutChange = Math.floor(vsizeWithoutChange * commitFeeRate);
            if (totalSenderAmount - totalRevealPrevOutputValue - feeWithoutChange < 0) {
                this.mustTxFee = fee;
                return true;
            }
        }
        this.refundFeeTx = tx;
        return false;
    }

    signRefundFeeTx(inputs: PrevOutput[]) {
        signTx(this.refundFeeTx, inputs, this.network, this.merkleRoot);
    }

    calculateFee() {
        let refundFeeTxFee = 0;
        this.refundFeeTx.ins.forEach((_, i) => {
            refundFeeTxFee += this.commitTxPrevOutputFetcher[i];
        });
        this.refundFeeTx.outs.forEach(out => {
            refundFeeTxFee -= out.value;
        });
        return {
            refundFeeTxFee,
        };
    }
}

function signTx(tx: bitcoin.Transaction, refundFeeTxPrevOutputList: PrevOutput[], network: bitcoin.Network, merkleRoot = new Uint8Array()) {
    tx.ins.forEach((input, i) => {
        const addressType = getAddressType(refundFeeTxPrevOutputList[i].address, network);
        const privateKey = base.fromHex(privateKeyFromWIF(refundFeeTxPrevOutputList[i].privateKey, network));
        const privateKeyHex = base.toHex(privateKey);
        const publicKey = private2public(privateKeyHex);
        // refund fee, only taproot
        if (addressType === 'segwit_taproot') {
            const prevOutScripts = refundFeeTxPrevOutputList.map(o => bitcoin.address.toOutputScript(o.address, network));
            const values = refundFeeTxPrevOutputList.map(o => o.amount);
            const hash = tx.hashForWitnessV1(i, prevOutScripts, values, bitcoin.Transaction.SIGHASH_DEFAULT);
            const tweakedPrivKey = taproot.taprootTweakPrivKey(privateKey, merkleRoot);
            const signature = Buffer.from(schnorr.sign(hash, tweakedPrivKey, base.randomBytes(32)));
            input.witness = [Buffer.from(signature)];
        } else if (addressType === 'legacy') {
            const prevScript = bitcoin.address.toOutputScript(refundFeeTxPrevOutputList[i].address, network);
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
            const value = refundFeeTxPrevOutputList[i].amount;
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

export function createInscriptionTxCtxData(network: bitcoin.Network, inscriptionData: InscriptionRefundFeeData, privateKeyWif: string): InscriptionTxCtxData {
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

export function inscribeRefundFee(network: bitcoin.Network, request: InscriptionRefundFeeRequest) {
    const tool = InscriptionRefundFeeTool.newInscriptionRefundFeeTool(network, request);
    if (tool.mustTxFee > 0) {
        return {
            refundFeeTx: "",
            mustTxFee: tool.mustTxFee,
        };
    }

    return {
        refundFeeTx: tool.refundFeeTx.toHex(),
        ...tool.calculateFee(),
        middleAddresses: tool.commitAddrs
    };
}



