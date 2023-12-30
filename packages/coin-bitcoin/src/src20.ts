import * as bitcoin from "./bitcoinjs-lib";
import {base, signUtil} from "@okxweb3/crypto-lib";
import * as taproot from "./taproot";
import * as bcrypto from "./bitcoinjs-lib/crypto";
import {
    getAddressType,
    private2public,
    privateKeyFromWIF,
    sign
} from "./txBuild";
import {InscriptionData, PrevOutput, TxOut} from "./inscribe";
import {BufferWriter} from "./bitcoinjs-lib";

const schnorr = signUtil.schnorr.secp256k1.schnorr

export type SrcInscriptionRequest = {
    commitTxPrevOutputList: PrevOutput[]
    commitFeeRate: number
    inscriptionData: InscriptionData
    revealOutValue: number
    changeAddress: string
    minChangeValue?: number
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
const PART_LEN = 31;
const defaultSequenceNum = 0xfffffffd;
const defaultRevealOutValue = 7800;
const defaultMinChangeValue = 7800;

const maxStandardTxWeight = 4000000 / 10;

export class SrcInscriptionTool {
    network: bitcoin.Network = bitcoin.networks.bitcoin;
    revealTxs: bitcoin.Transaction[] = [];
    commitTx: bitcoin.Transaction = new bitcoin.Transaction();
    commitTxPrevOutputFetcher: number[] = [];
    revealTxPrevOutputFetcher: number[] = [];
    mustCommitTxFee: number = 0;
    mustRevealTxFees: number[] = [];
    commitAddrs: string[] = [];

    static newSrcInscriptionTool(network: bitcoin.Network, request: SrcInscriptionRequest) {
        const tool = new SrcInscriptionTool();
        tool.network = network;

        const revealOutValue = request.revealOutValue || defaultRevealOutValue;
        const minChangeValue = request.minChangeValue || defaultMinChangeValue;

        // TODO: use commitTx first input privateKey
        const insufficient = tool.buildCommitTx(network, request.inscriptionData, revealOutValue, request.commitTxPrevOutputList, request.changeAddress, request.commitFeeRate, minChangeValue);
        if (insufficient) {
            return tool;
        }
        tool.signCommitTx(request.commitTxPrevOutputList);
        return tool;
    }

    buildCommitTx(network: bitcoin.Network, inscriptionData: InscriptionData, revealOutValue: number, commitTxPrevOutputList: PrevOutput[], changeAddress: string, commitFeeRate: number, minChangeValue: number): boolean {
        let prefix = Buffer.from(inscriptionData.contentType)
        let body = Buffer.from(inscriptionData.body)
        while (body[body.length - 1] == 0) {
            body = body.slice(0, body.length - 1)
        }
        let l = 2 + prefix.length + body.length
        let total = l % 62 == 0 ? l : (l + 62 - l % 62)
        let bufferWriter = BufferWriter.withCapacity(total);
        bufferWriter.writeSlice(Buffer.from([(prefix.length + body.length) / 256, (prefix.length + body.length) % 256]))
        bufferWriter.writeSlice(prefix)
        bufferWriter.writeSlice(body)
        if (total > l) {
            bufferWriter.writeSlice(Buffer.alloc(total - l))
        }
        //"ba50757c612b8a539f7368cd0aa98f0e046333b83c38a292f71888b3b4e0e662b5e3a3dcf66f781b001069c3d9e07764e1aaa40de9df17b2460bc838a188676f309845e35580f4e0f4f94243049bfb69539c0ca2a109afbcf595e022651884e6befe3d88555c5ab83b1c40e0c0e375069c88d44a357d97d44e566e84"
        let data = bufferWriter.end()
        let buf = base.fromHex(xcp_rc4(commitTxPrevOutputList[0].txId, data.toString("hex")));
        let totalSenderAmount = 0;
        let totalRevealPrevOutputValue = 0;
        const tx = new bitcoin.Transaction();
        tx.version = defaultTxVersion;
        totalRevealPrevOutputValue += revealOutValue
        tx.addOutput(bitcoin.address.toOutputScript(inscriptionData.revealAddr, network), revealOutValue)
        while (buf.length) {
            let buf1 = buf.slice(0, Math.min(PART_LEN, buf.length))
            let first = buf1.toString("hex")
            if (first.length < 62) {
                first = first + '0'.repeat(62 - first.length)
            }
            buf = buf.slice(buf1.length)
            let buf2 = buf.slice(0, Math.min(PART_LEN, buf.length))
            let second = buf2.toString("hex")
            if (second.length < 62) {
                second = second + '0'.repeat(62 - second.length)
            }
            buf = buf.slice(buf1.length)
            const pubkeys = [
                '03' + first + '00',
                '02' + second + '00',
                '020202020202020202020202020202020202020202020202020202020202020202',
            ].map(hex => Buffer.from(hex, 'hex'));
            const payment = bitcoin.payments.p2ms({m: 1, pubkeys})
            tx.addOutput(payment.output!, revealOutValue)
            totalRevealPrevOutputValue += revealOutValue
        }
        commitTxPrevOutputList.forEach(commitTxPrevOutput => {
            const hash = base.reverseBuffer(base.fromHex(commitTxPrevOutput.txId));
            tx.addInput(hash, commitTxPrevOutput.vOut, defaultSequenceNum);
            this.commitTxPrevOutputFetcher.push(commitTxPrevOutput.amount);
            totalSenderAmount += commitTxPrevOutput.amount;
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

export function srcInscribe(network: bitcoin.Network, request: SrcInscriptionRequest) {
    const tool = SrcInscriptionTool.newSrcInscriptionTool(network, request);
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

// @ts-ignore
function rc4(key, str) {
    var s = [],
        j = 0,
        x,
        res = ''
    for (var i = 0; i < 256; i++) {
        s[i] = i
    }
    for (i = 0; i < 256; i++) {
        j = (j + s[i] + key.charCodeAt(i % key.length)) % 256
        x = s[i]
        s[i] = s[j]
        s[j] = x
    }
    i = 0
    j = 0
    for (var y = 0; y < str.length; y++) {
        i = (i + 1) % 256
        j = (j + s[i]) % 256
        x = s[i]
        s[i] = s[j]
        s[j] = x
        res += String.fromCharCode(str.charCodeAt(y) ^ s[(s[i] + s[j]) % 256])
    }
    return res
}

function hex2bin(hex: string) {
    var bytes = []
    var str
    for (var i = 0; i < hex.length - 1; i += 2) {
        var ch = parseInt(hex.substr(i, 2), 16)
        bytes.push(ch)
    }
    str = String.fromCharCode.apply(String, bytes)
    return str
}

function bin2hex(s: string) {
    // http://kevin.vanzonneveld.net
    var i, l, o = '', n
    s += ''
    for (i = 0, l = s.length; i < l; i++) {
        n = s.charCodeAt(i).toString(16)
        o += n.length < 2 ? '0' + n : n
    }
    return o
}

function xcp_rc4(key: string, datachunk: string) {
    return bin2hex(rc4(hex2bin(key), hex2bin(datachunk)))
}
