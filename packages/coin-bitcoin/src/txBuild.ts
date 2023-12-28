import * as bitcoin from "./bitcoinjs-lib";
import {Network, Transaction} from "./bitcoinjs-lib";
import {base, signUtil, typeforce} from "@okxweb3/crypto-lib"
import {utxoInput, utxoOutput, utxoTx} from "./type";
import * as wif from "./wif"
import {Base58CheckResult, Bech32Result, fromBase58Check, fromBech32} from './bitcoinjs-lib/address';
import * as bcrypto from './bitcoinjs-lib/crypto';
import * as taproot from "./taproot";
import * as bscript from './bitcoinjs-lib/script';
import {OPS} from './bitcoinjs-lib/ops';
import {Stack} from "./bitcoinjs-lib/payments";

const schnorr = signUtil.schnorr.secp256k1.schnorr

export const Array = typeforce.Array;

export type AddressType = "legacy" | "segwit_native" | "segwit_nested" | "segwit_taproot"

export function privateKeyFromWIF(
    wifString: string,
    network?: bitcoin.Network | bitcoin.Network[],
): string {
    const decoded = wif.decode(wifString);
    const version = decoded.version;

    // list of networks?
    if (Array(network)) {
        network = (network as bitcoin.Network[])
            .filter((x: bitcoin.Network) => {
                return version === x.wif;
            })
            .pop() as bitcoin.Network;

        if (!network) throw new Error('Unknown network version');

        // otherwise, assume a network object (or default to bitcoin)
    } else {
        network = network || bitcoin.networks.bitcoin;

        if (version !== (network as bitcoin.Network).wif)
            throw new Error('Invalid network version');
    }

    return base.toHex(decoded.privateKey)
}

export function private2public(privateKey: string) {
    return signUtil.secp256k1.publicKeyCreate(base.fromHex(privateKey), true)
}

export function sign(hash: Buffer, privateKey: string) {
    const {signature} = signUtil.secp256k1.sign(hash, base.fromHex(privateKey))
    return Buffer.from(signature)
}

export function wif2Public(wif: string, network?: bitcoin.Network | bitcoin.Network[]) {
    const privateKey = privateKeyFromWIF(wif, network)
    return private2public(privateKey)
}

export function private2Wif(privateKey: Buffer, network?: bitcoin.Network): string {
    network = network || bitcoin.networks.bitcoin;
    return wif.encode(network.wif, privateKey, true);
}

export class TxBuild {

    tx = new bitcoin.Transaction();
    network: bitcoin.Network = bitcoin.networks.bitcoin;

    inputs: Input[];
    outputs: Output[];
    bitcoinCash: boolean
    hardware: boolean

    constructor(version?: number, network?: bitcoin.Network, bitcoinCash?: boolean, hardware?: boolean) {
        if (version) {
            this.tx.version = version;
        } else {
            this.tx.version = 2;
        }
        if (network) {
            this.network = network;
        }
        this.inputs = [];
        this.outputs = [];
        this.bitcoinCash = bitcoinCash || false
        this.hardware = hardware || false
    }

    addInput(txId: string, index: number, privateKey: string, address: string, script?: string, value?: number, publicKey?: string, sequence?: number): void {
        this.inputs.push({
            txId: txId,
            index: index,
            privateKey: privateKey,
            address: address,
            script: script,
            value: value,
            publicKey: publicKey,
            sequence: sequence
        });
    }

    addOutput(address: string, value: number, omniScript?: string): void {
        this.outputs.push({
            address: address, value: value, omniScript: omniScript
        });
    }

    build(hashArray?: string[]): string {
        const eckeys: string[] = [];
        for (const input of this.inputs) {
            const hash = base.reverseBuffer(Buffer.from(input.txId, "hex"));
            this.tx.addInput(hash, input.index, input.sequence);
            if (input.privateKey) {
                eckeys.push(privateKeyFromWIF(input.privateKey, this.network));
            } else {
                eckeys.push("");
            }
        }

        for (const output of this.outputs) {
            if (output.omniScript) {
                this.tx.addOutput(base.fromHex(output.omniScript), 0);
            } else {
                // redemption script (public key hash)
                // nested segwit     OP_HASH160 + PubKeyHash(0x20+20 bytes public key) + OP_EQUAL
                // native segwit     OP_0 + PubKeyHash(0x20+20 bytes public key)
                // legacy            OP_DUP + OP_HASH160 + PubKeyHash(0x20+20 bytes public key) + OP_EQUALVERIFY + OP_CHECKSIG
                const outputScript = bitcoin.address.toOutputScript(output.address, this.network);
                this.tx.addOutput(outputScript, output.value);
            }
        }

        // hardware wallet no need to calculate signature script
        if (this.hardware) {
            return this.tx.toHex();
        }

        for (let i = 0; i < eckeys.length; i++) {
            const eckey = eckeys[i];
            let ecPub: Buffer | undefined;
            if (eckey) {
                ecPub = private2public(eckey)
            } else {
                if (!this.hardware) {
                    ecPub = base.fromHex(this.inputs[i].publicKey!)
                }
            }

            let hash: Buffer
            let hashType = bitcoin.Transaction.SIGHASH_ALL
            if (this.bitcoinCash) {
                const script = bitcoin.payments.p2pkh({pubkey: ecPub}).output as Buffer;
                hashType = bitcoin.Transaction.SIGHASH_ALL | bitcoin.Transaction.SIGHASH_BITCOINCASHBIP143
                const value = this.inputs[i].value || 0
                hash = this.tx.hashForCashSignature(i, script, value, hashType)

                let signature: Buffer
                if (hashArray) {
                    hashArray.push(base.toHex(hash));
                    signature = Buffer.alloc(64, 0);
                } else {
                    signature = sign(hash, eckey)
                }
                const payment = bitcoin.payments.p2pkh({
                    output: script,
                    pubkey: ecPub,
                    signature: bitcoin.script.signature.encode(signature, hashType)
                });
                if (payment.input) {
                    this.tx.ins[i].script = payment.input;
                }
            } else {
                const addressType = getAddressType(this.inputs[i].address, this.network);
                if (addressType === "legacy") {
                    const script = bitcoin.payments.p2pkh({pubkey: ecPub}).output as Buffer;
                    hash = this.tx.hashForSignature(i, script, hashType)

                    let signature: Buffer
                    if (hashArray) {
                        hashArray.push(base.toHex(hash));
                        signature = Buffer.alloc(64, 0);
                    } else {
                        signature = sign(hash, eckey)
                    }
                    const payment = bitcoin.payments.p2pkh({
                        output: script,
                        pubkey: ecPub,
                        signature: bitcoin.script.signature.encode(signature, hashType)
                    });
                    if (payment.input) {
                        this.tx.ins[i].script = payment.input;
                    }
                } else if (addressType === "segwit_taproot") {
                    const prevOutScripts = this.inputs.map(o => bitcoin.address.toOutputScript(o.address, this.network));
                    const values = this.inputs.map(o => o.value!);
                    hash = this.tx.hashForWitnessV1(i, prevOutScripts, values, bitcoin.Transaction.SIGHASH_DEFAULT);
                    let signature: Buffer
                    if (hashArray) {
                        hashArray.push(base.toHex(hash));
                        signature = Buffer.alloc(64, 0);
                    } else {
                        const tweakedPrivKey = taproot.taprootTweakPrivKey(base.fromHex(eckey));
                        signature = Buffer.from(schnorr.sign(hash, tweakedPrivKey, base.randomBytes(32)));
                    }
                    this.tx.ins[i].witness = [Buffer.from(signature)];
                } else {
                    const pubHash = bcrypto.hash160(ecPub!);
                    const prevOutScript = Buffer.of(0x19, 0x76, 0xa9, 0x14, ...pubHash, 0x88, 0xac)
                    const value = this.inputs[i].value || 0
                    hash = this.tx.hashForWitness(i, prevOutScript, value, hashType)

                    let signature: Buffer
                    if (hashArray) {
                        hashArray.push(base.toHex(hash));
                        signature = Buffer.alloc(64, 0);
                    } else {
                        signature = sign(hash, eckey)
                    }

                    // segwit: setting witness(signature + pubkey)
                    this.tx.ins[i].witness = []
                    this.tx.ins[i].witness.push(bitcoin.script.signature.encode(signature, hashType))
                    this.tx.ins[i].witness.push(ecPub!)

                    const redeemScript = Buffer.of(0x16, 0, 20, ...pubHash)
                    if (addressType !== "segwit_native") {
                        // compatible address, need to set redemption script
                        this.tx.ins[i].script = redeemScript
                    }
                }
            }
        }
        return this.tx.toHex();
    }

}

interface Input {
    txId: string;
    index: number;
    script?: string
    privateKey: string
    value?: number
    address: string
    publicKey?: string
    sequence?: number
}

interface Output {
    address: string;
    value: number
    omniScript?: string
}

export function signBtc(utxoTx: utxoTx, privateKey: string, network?: bitcoin.Network, hashArray?: string[], hardware?: boolean, changeOnly?: boolean) {
    const inputs = utxoTx.inputs;
    const outputs = utxoTx.outputs;
    const changeAddress = utxoTx.address;
    const feePerB = utxoTx.feePerB || 10;
    const dustSize = utxoTx.dustSize || 546
    network = network || bitcoin.networks.bitcoin;
    if (utxoTx.memo) {
        let buf = base.isHexString(utxoTx.memo) ? base.fromHex(utxoTx.memo) : Buffer.from(base.toUtf8(utxoTx.memo))
        if (buf.length > 80) {
            throw  new Error('data after op_return is  too long');
        }
    }
    // calculate transaction size
    let fakePrivateKey = privateKey;
    if (!fakePrivateKey) {
        fakePrivateKey = private2Wif(base.fromHex("853fd8960ff34838208d662ecd3b9f8cf413e13e0f74f95e554f8089f5058db0"), network);
    }

    if (changeOnly) {
        let {
            inputAmount,
            outputAmount,
            virtualSize
        } = calculateTxSize(inputs, outputs, changeAddress, fakePrivateKey, network, dustSize, false, utxoTx.memo, utxoTx.memoPos);
        return (inputAmount - outputAmount - virtualSize * feePerB).toString();
    }

    let {
        inputAmount,
        outputAmount,
        virtualSize
    } = calculateTxSize(inputs, outputs, changeAddress, fakePrivateKey, network, dustSize, false, utxoTx.memo, utxoTx.memoPos);
    let changeAmount = inputAmount - outputAmount - virtualSize * feePerB;

    // sign process
    let txBuild = new TxBuild(2, network, false, hardware);
    for (let i = 0; i < inputs.length; i++) {
        let input = inputs[i] as utxoInput;
        const inputPrivKey = input.privateKey || privateKey;
        const inputAddress = input.address || changeAddress;
        txBuild.addInput(input.txId, input.vOut, inputPrivKey, inputAddress, input.reedScript, input.amount, input.publicKey, input.sequence);
    }
    if (utxoTx.memo && utxoTx.memoPos == 0) {
        txBuild.addOutput('', 0, base.toHex(bscript.compile(([OPS.OP_RETURN] as Stack).concat(base.isHexString(utxoTx.memo) ? base.fromHex(utxoTx.memo) : Buffer.from(base.toUtf8(utxoTx.memo))))))
    }
    for (let i = 0; i < outputs.length; i++) {
        let output = outputs[i] as utxoOutput;
        txBuild.addOutput(output.address, output.amount, output.omniScript);
        if (utxoTx.memo && utxoTx.memoPos && txBuild.outputs.length == utxoTx.memoPos) {
            txBuild.addOutput('', 0, base.toHex(bscript.compile(([OPS.OP_RETURN] as Stack).concat(base.isHexString(utxoTx.memo) ? base.fromHex(utxoTx.memo) : Buffer.from(base.toUtf8(utxoTx.memo))))))
        }
    }
    if (changeAmount > dustSize) {
        txBuild.addOutput(changeAddress, changeAmount);
        if (utxoTx.memo && utxoTx.memoPos && txBuild.outputs.length == utxoTx.memoPos) {
            txBuild.addOutput('', 0, base.toHex(bscript.compile(([OPS.OP_RETURN] as Stack).concat(base.isHexString(utxoTx.memo) ? base.fromHex(utxoTx.memo) : Buffer.from(base.toUtf8(utxoTx.memo))))))
        }
    }
    if (utxoTx.memo && (utxoTx.memoPos == undefined || utxoTx.memoPos < 0 || utxoTx.memoPos > txBuild.outputs.length)) {
        txBuild.addOutput('', 0, base.toHex(bscript.compile(([OPS.OP_RETURN] as Stack).concat(base.isHexString(utxoTx.memo) ? base.fromHex(utxoTx.memo) : Buffer.from(base.toUtf8(utxoTx.memo))))))
    }
    return txBuild.build(hashArray);
}

export function getAddressType(address: string, network: bitcoin.Network): AddressType {
    let decodeBase58: Base58CheckResult | undefined;
    let decodeBech32: Bech32Result | undefined;
    try {
        decodeBase58 = fromBase58Check(address);
    } catch (e) {
    }

    if (decodeBase58) {
        if (decodeBase58.version === network.pubKeyHash)
            return "legacy"
        if (decodeBase58.version === network.scriptHash)
            return "segwit_nested"
    } else {
        try {
            decodeBech32 = fromBech32(address);
        } catch (e) {
        }

        if (decodeBech32) {
            if (decodeBech32.prefix !== network.bech32)
                throw new Error(address + ' has an invalid prefix');
            if (decodeBech32.version === 0) {
                return 'segwit_native'
            } else if (decodeBech32.version === 1) {
                return 'segwit_taproot'
            }
        }
    }
    return "legacy"
}

export function signBch(utxoTx: utxoTx, privateKey: string, network?: bitcoin.Network, hashArray?: string[], hardware?: boolean) {
    const inputs = utxoTx.inputs;
    const outputs = utxoTx.outputs;
    const changeAddress = utxoTx.address;
    const feePerB = utxoTx.feePerB || 10;
    const dustSize = utxoTx.dustSize || 546
    network = network || bitcoin.networks.bitcoin;

    // calculate transaction size
    let fakePrivateKey = privateKey;
    if (!fakePrivateKey) {
        fakePrivateKey = private2Wif(base.fromHex("853fd8960ff34838208d662ecd3b9f8cf413e13e0f74f95e554f8089f5058db0"), network);
    }

    let {inputAmount, outputAmount, virtualSize} = calculateBchTxSize(inputs, outputs, changeAddress, fakePrivateKey, network, dustSize);
    let changeAmount = inputAmount - outputAmount - virtualSize * feePerB;

    // sign process
    let txBuild = new TxBuild(2, network, true, hardware);
    for (let i = 0; i < inputs.length; i++) {
        let input = inputs[i] as utxoInput;
        txBuild.addInput(input.txId, input.vOut, privateKey, changeAddress, undefined, input.amount, input.publicKey, input.sequence);
    }
    for (let i = 0; i < outputs.length; i++) {
        let output = outputs[i] as utxoOutput;
        txBuild.addOutput(output.address, output.amount);
    }
    if (changeAmount > dustSize) {
        txBuild.addOutput(changeAddress, changeAmount);
    }
    return txBuild.build(hashArray);
}


function calculateTxSize(inputs: [], outputs: [], changeAddress: string, privateKey: string, network: bitcoin.Network, dustSize: Number, hardware?: boolean, memo?: string, pos?: number) {

    let preTxBuild = new TxBuild(2, network, false, hardware);
    let inputAmount = 0;
    for (let i = 0; i < inputs.length; i++) {
        let input = inputs[i] as utxoInput;
        const inputPrivKey = input.privateKey || privateKey;
        const inputAddress = input.address || changeAddress;
        preTxBuild.addInput(input.txId, input.vOut, inputPrivKey, inputAddress, input.reedScript, input.amount, input.publicKey, input.sequence);
        inputAmount = inputAmount + (input.amount || 0);
    }
    if (memo && pos == 0) {
        preTxBuild.addOutput('', 0, base.toHex(bscript.compile(([OPS.OP_RETURN] as Stack).concat(base.isHexString(memo) ? base.fromHex(memo) : Buffer.from(base.toUtf8(memo))))))
    }
    let outputAmount = 0;
    for (let i = 0; i < outputs.length; i++) {
        let output = outputs[i] as utxoOutput;
        preTxBuild.addOutput(output.address, output.amount, output.omniScript);
        outputAmount = outputAmount + output.amount;
        if (memo && pos && preTxBuild.outputs.length == pos) {
            preTxBuild.addOutput('', 0, base.toHex(bscript.compile(([OPS.OP_RETURN] as Stack).concat(base.isHexString(memo) ? base.fromHex(memo) : Buffer.from(base.toUtf8(memo))))))
        }
    }
    // change
    if (inputAmount - outputAmount > dustSize) {
        preTxBuild.addOutput(changeAddress, inputAmount - outputAmount);
        if (memo && pos && preTxBuild.outputs.length == pos) {
            preTxBuild.addOutput('', 0, base.toHex(bscript.compile(([OPS.OP_RETURN] as Stack).concat(base.isHexString(memo) ? base.fromHex(memo) : Buffer.from(base.toUtf8(memo))))))
        }
    }
    if (memo && (pos == undefined || pos < 0 || pos > preTxBuild.outputs.length)) {
        preTxBuild.addOutput('', 0, base.toHex(bscript.compile(([OPS.OP_RETURN] as Stack).concat(base.isHexString(memo) ? base.fromHex(memo) : Buffer.from(base.toUtf8(memo))))))
    }
    let txHex = preTxBuild.build();
    const virtualSize = preTxBuild.tx.virtualSize();
    return {
        inputAmount,
        outputAmount,
        virtualSize,
        txHex
    };
}

function calculateBchTxSize(inputs: [], outputs: [], changeAddress: string, privateKey: string, network: bitcoin.Network, dustSize: number, hardware?: boolean) {
    let preTxBuild = new TxBuild(2, network, true, hardware);
    let inputAmount = 0;
    for (let i = 0; i < inputs.length; i++) {
        let input = inputs[i] as utxoInput;
        preTxBuild.addInput(input.txId, input.vOut, privateKey, changeAddress, undefined, input.amount, input.publicKey, input.sequence);
        inputAmount = inputAmount + (input.amount || 0);
    }
    let outputAmount = 0;
    for (let i = 0; i < outputs.length; i++) {
        let output = outputs[i] as utxoOutput;
        preTxBuild.addOutput(output.address, output.amount);
        outputAmount = outputAmount + output.amount;
    }
    // change
    if (inputAmount - outputAmount > dustSize) {
        preTxBuild.addOutput(changeAddress, inputAmount - outputAmount);
    }
    let txHex = preTxBuild.build();
    const virtualSize = preTxBuild.tx.virtualSize();
    return {
        inputAmount,
        outputAmount,
        virtualSize,
        txHex
    };
}

export function getMPCTransaction(raw: string, sigs: string[], bitcoinCash: boolean) {
    const transaction = Transaction.fromBuffer(base.fromHex(raw), false)

    for (let i = 0; i < transaction.ins.length; i++) {
        const input = transaction.ins[i]
        const signature = base.fromHex(sigs[i])

        let hashType = bitcoin.Transaction.SIGHASH_ALL
        if (bitcoinCash) {
            hashType = bitcoin.Transaction.SIGHASH_ALL | bitcoin.Transaction.SIGHASH_BITCOINCASHBIP143
            const payment = bitcoin.payments.p2pkh({
                input: input.script,
            });
            const paymentNew = bitcoin.payments.p2pkh({
                pubkey: payment.pubkey,
                signature: bitcoin.script.signature.encode(signature, hashType)
            });
            if (paymentNew.input) {
                input.script = paymentNew.input;
            }
        } else {
            let addressType: string;
            if (input.witness.length === 2) {
                addressType = "segwit_native";
            } else if (input.witness.length === 1) {
                addressType = "segwit_taproot";
            } else if (input.witness.length === 0) {
                addressType = "legacy";
            } else {
                throw Error("unknown witness length")
            }

            if (addressType === "legacy") {
                const payment = bitcoin.payments.p2pkh({
                    input: input.script,
                });

                const paymentNew = bitcoin.payments.p2pkh({
                    pubkey: payment.pubkey,
                    signature: bitcoin.script.signature.encode(signature, hashType)
                });
                if (paymentNew.input) {
                    input.script = paymentNew.input;
                }
            } else if (addressType === "segwit_taproot") {
                input.witness = [signature];
            } else {
                input.witness[0] = bitcoin.script.signature.encode(signature, hashType)
            }
        }
    }
    return transaction.toHex();
}

export function ValidSignedTransaction(signedTx: string, utxoInputs?: [], network?: Network) {
    const transaction = Transaction.fromBuffer(base.fromHex(signedTx), false)
    if (!utxoInputs) {
        return transaction;
    }

    for (let i = 0; i < transaction.ins.length; i++) {
        const input = transaction.ins[i]
        const utxo = utxoInputs[i] as Input

        let addressType: string;
        if (input.witness.length === 2) {
            addressType = "segwit_native";
        } else if (input.witness.length === 1) {
            addressType = "segwit_taproot";
        } else if (input.witness.length === 0) {
            addressType = "legacy";
        } else {
            throw Error("unknown witness length")
        }

        if (addressType === "legacy") {
            // legal
            const chunks = bscript.decompile(input.script)!
            const signature = chunks[0] as Buffer
            const pubKey = chunks[1] as Buffer
            const signatureData = bitcoin.script.signature.decode(signature);
            const prevOutScript = bitcoin.address.toOutputScript(utxo.address, network)
            const hash = transaction.hashForSignature(i, prevOutScript, signatureData.hashType)
            if (!signUtil.secp256k1.verifyWithNoRecovery(hash, signatureData.signature, pubKey)) {
                throw Error("signature error")
            }
        } else if (addressType === "segwit_native") {
            // nest && native
            const signature = input.witness[0]
            const pubKey = input.witness[1]
            const signatureData = bitcoin.script.signature.decode(signature);
            const prevOutScript = Buffer.of(0x19, 0x76, 0xa9, 0x14, ...bcrypto.hash160(pubKey), 0x88, 0xac)
            const hash = transaction.hashForWitness(i, prevOutScript, utxo.value!, signatureData.hashType)
            if (!signUtil.secp256k1.verifyWithNoRecovery(hash, signatureData.signature, pubKey)) {
                throw Error("signature error")
            }
        } else {
            // taproot
            const signature = input.witness[0]
            const prevOutScripts = utxoInputs.map(o => bitcoin.address.toOutputScript((o as Input).address, network));
            const values = utxoInputs.map(o => (o as Input).value!);
            const hash = transaction.hashForWitnessV1(i, prevOutScripts, values, bitcoin.Transaction.SIGHASH_DEFAULT);
            const tweakedPubKey = taproot.taprootTweakPubkey(base.fromHex(utxo.publicKey!).slice(1))[0];
            if (!schnorr.verify(base.toHex(signature), base.toHex(hash), base.toHex(tweakedPubKey))) {
                throw Error("signature error")
            }
        }
    }

    for (let in1 of transaction.ins) {
        in1.hash = base.reverseBuffer(in1.hash)
    }
    return transaction;
}

export function estimateBtcFee(utxoTx: utxoTx, network?: bitcoin.Network) {
    const inputs = utxoTx.inputs;
    const outputs = utxoTx.outputs;
    const feePerB = utxoTx.feePerB || 10;
    const dustSize = utxoTx.dustSize || 546
    network = network || bitcoin.networks.bitcoin;

    // calc tx size
    const fakePrivateKey = private2Wif(base.fromHex("853fd8960ff34838208d662ecd3b9f8cf413e13e0f74f95e554f8089f5058db0"), network);
    let {virtualSize} = calculateTxSize(inputs, outputs, utxoTx.address, fakePrivateKey, network, dustSize, false, utxoTx.memo);
    return virtualSize * feePerB;
}

export function estimateBchFee(utxoTx: utxoTx, network?: bitcoin.Network) {
    const inputs = utxoTx.inputs;
    const outputs = utxoTx.outputs;
    const feePerB = utxoTx.feePerB || 10;
    const dustSize = utxoTx.dustSize || 546
    network = network || bitcoin.networks.bitcoin;

    // calc tx size
    const fakePrivateKey = private2Wif(base.fromHex("853fd8960ff34838208d662ecd3b9f8cf413e13e0f74f95e554f8089f5058db0"), network);
    let {virtualSize} = calculateBchTxSize(inputs, outputs, utxoTx.address, fakePrivateKey, network, dustSize);
    return virtualSize * feePerB;
}

