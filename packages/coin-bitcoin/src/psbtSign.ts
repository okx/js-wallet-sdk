import {Psbt} from "./bitcoinjs-lib/psbt";
import {base, signUtil} from '@okxweb3/crypto-lib';
import {getAddressType, privateKeyFromWIF, sign, signBtc, wif2Public} from './txBuild';
import {Network, networks, payments, Transaction, address} from './bitcoinjs-lib';
import * as taproot from "./taproot";
import {isTaprootInput, toXOnly} from "./bitcoinjs-lib/psbt/bip371";
import {utxoInput, utxoOutput, utxoTx, BuyingData, ListingData, toSignInput} from './type';
import {toOutputScript} from './bitcoinjs-lib/address';
import {PsbtInputExtended, PsbtOutputExtended} from './bitcoinjs-lib/psbt';
import {reverseBuffer} from "./bitcoinjs-lib/bufferutils";
import {Output} from "./bitcoinjs-lib/transaction";
import {isP2SHScript, isP2TR} from "./bitcoinjs-lib/psbt/psbtutils";
import {number} from "./bitcoinjs-lib/script";

const schnorr = signUtil.schnorr.secp256k1.schnorr

export function buildPsbt(tx: utxoTx, network?: Network) {
    const psbt = new Psbt({network});
    tx.inputs.forEach((input: utxoInput) => {
        const outputScript = toOutputScript(input.address!, network);
        let inputData: PsbtInputExtended = {
            hash: input.txId,
            index: input.vOut,
            witnessUtxo: {script: outputScript, value: input.amount},
        };

        const addressType = getAddressType(input.address!, network || networks.bitcoin);
        if (input.bip32Derivation) {
            if (addressType === 'segwit_taproot') {
                inputData.tapBip32Derivation = input.bip32Derivation!.map((derivation: any) => {
                    let pubBuf = base.fromHex(derivation.pubkey)
                    if (pubBuf.length != 32) {
                        pubBuf = pubBuf.slice(1)
                    }
                    return {
                        masterFingerprint: base.fromHex(derivation.masterFingerprint),
                        pubkey: pubBuf,
                        path: derivation.path,
                        leafHashes: derivation.leafHashes.map((leaf: any) => {
                            return Buffer.from(leaf, 'hex')
                        }),
                    }
                })
            } else {
                inputData.bip32Derivation = input.bip32Derivation!.map((derivation: any) => {
                    return {
                        masterFingerprint: base.fromHex(derivation.masterFingerprint),
                        pubkey: base.fromHex(derivation.pubkey),
                        path: derivation.path,
                    }
                })
            }
        }

        if (addressType === 'legacy') {
            inputData.nonWitnessUtxo = base.fromHex(input.nonWitnessUtxo!);
        } else if (addressType === 'segwit_taproot') {
            if (input.publicKey) {
                inputData.tapInternalKey = toXOnly(base.fromHex(input.publicKey));
            }
        } else if (addressType === 'segwit_nested') {
            inputData.redeemScript = payments.p2wpkh({
                pubkey: Buffer.from(input.publicKey!, 'hex'),
                network,
            }).output!
        }

        if (input.sighashType) {
            inputData.sighashType = input.sighashType;
        }

        psbt.addInput(inputData);
    });
    tx.outputs.forEach((output: utxoOutput) => {
        if (output.omniScript) {
            psbt.addOutput({script: base.fromHex(output.omniScript), value: 0});
        } else {
            let outputData: PsbtOutputExtended = {address: output.address, value: output.amount};
            if (output.bip32Derivation) {
                outputData.bip32Derivation = output.bip32Derivation!.map((derivation: any) => {
                    return {
                        masterFingerprint: base.fromHex(derivation.masterFingerprint),
                        pubkey: base.fromHex(derivation.pubkey),
                        path: derivation.path,
                    }
                })
            }
            psbt.addOutput(outputData);
        }
    });
    return psbt.toHex();
}

export function psbtSign(psbtBase64: string, privateKey: string, network?: Network) {
    const psbt = Psbt.fromBase64(psbtBase64, {network});
    psbtSignImpl(psbt, privateKey, network)
    return psbt.toBase64();
}

// compatible with unisat
export function signPsbt(psbtHex: string, privateKey: string, network?: Network, autoFinalized?: boolean, signInputs?: toSignInput[]) {
    const psbt = Psbt.fromHex(psbtHex, {network});
    psbtSignImplForUniSat(psbt, privateKey, network, autoFinalized, signInputs)
    return psbt.toHex();
}

export function psbtSignImplForUniSat(psbt: Psbt, privateKey: string, network?: Network, autoFinalized?: boolean, signInputs?: toSignInput[]) {
    network = network || networks.bitcoin
    const privKeyHex = privateKeyFromWIF(privateKey, network);
    const signInputMap = new Map<number, toSignInput>();
    if (signInputs != undefined) {
        signInputs.map(e => {
            signInputMap.set(e.index, e);
        });
    }
    const signer = {
        psbtIndex: 0,
        needTweak: true,
        tweakHash: Buffer.alloc(0),
        toSignInputsMap: signInputMap,
        publicKey: Buffer.alloc(0),
        sign(hash: Buffer): Buffer {
            return sign(hash, privKeyHex);
        },
        signSchnorr(hash: Buffer): Buffer {
            let tweakedPrivKey = taproot.taprootTweakPrivKey(base.fromHex(privKeyHex));
            // todo disableTweakSigner
            if (this.toSignInputsMap?.has(this.psbtIndex)) {
                if (this.toSignInputsMap.get(this.psbtIndex)?.disableTweakSigner) {
                    // tweakedPrivKey = base.fromHex(privKeyHex);
                    return Buffer.from(schnorr.sign(hash, privKeyHex, base.randomBytes(32)));
                }
            }
            if (!this.needTweak) {
                return Buffer.from(schnorr.sign(hash, privKeyHex, base.randomBytes(32)));
            }
            if (this.needTweak && this.tweakHash.length > 0) {
                tweakedPrivKey = taproot.taprootTweakPrivKey(base.fromHex(privKeyHex), this.tweakHash);
            }
            return Buffer.from(schnorr.sign(hash, tweakedPrivKey, base.randomBytes(32)));
        },
    };

    let allowedSighashTypes = [
        Transaction.SIGHASH_SINGLE | Transaction.SIGHASH_ANYONECANPAY,
        Transaction.SIGHASH_ALL,
        Transaction.SIGHASH_DEFAULT
    ];

    for (let i = 0; i < psbt.inputCount; i++) {
        if (signInputMap?.size > 0 && !signInputMap?.has(i)) {
            continue;
        }
        signer.psbtIndex = i;
        const input = psbt.data.inputs[i];
        if (isTaprootInput(input)) {
            signer.needTweak = true;
            signer.publicKey = Buffer.from(taproot.taprootTweakPubkey(toXOnly(wif2Public(privateKey, network)))[0]);
            // todo disableTweakSigner
            if (signInputMap?.has(i)) {
                if (signInputMap?.get(i)?.disableTweakSigner) {
                    // signer.publicKey = toXOnly(wif2Public(privateKey, network));
                    signer.publicKey = wif2Public(privateKey, network);
                    signer.needTweak = false;
                }
            }
            if (input.tapLeafScript != undefined) {
                if (input.tapLeafScript?.length > 0) {
                    input.tapLeafScript.map(e => {
                        if (e.controlBlock && e.script) {
                            signer.publicKey = wif2Public(privateKey, network);
                            signer.needTweak = false;
                        }
                    });
                }
            }
            if (input.tapMerkleRoot) {
                signer.needTweak = true;
                signer.tweakHash = input.tapMerkleRoot;
                signer.publicKey = Buffer.from(taproot.taprootTweakPubkey(toXOnly(wif2Public(privateKey, network)), input.tapMerkleRoot)[0]);
            }
        } else {
            signer.publicKey = wif2Public(privateKey, network);
        }
        try {
            if (signInputMap?.has(i)) {
                const sighashTypes = signInputMap?.get(i)?.sighashTypes;
                if (sighashTypes != undefined) {
                    allowedSighashTypes = sighashTypes;
                }
            }
            psbt.signInput(i, signer, allowedSighashTypes);
            if (autoFinalized != undefined && !autoFinalized) {
                continue;
            }
            psbt.finalizeInput(i)
        } catch (e) {
            console.info(e)
        }
    }
}


export function psbtSignImpl(psbt: Psbt, privateKey: string, network?: Network) {
    network = network || networks.bitcoin
    const privKeyHex = privateKeyFromWIF(privateKey, network);
    const signer = {
        publicKey: Buffer.alloc(0),
        sign(hash: Buffer): Buffer {
            return sign(hash, privKeyHex);
        },
        signSchnorr(hash: Buffer): Buffer {
            const tweakedPrivKey = taproot.taprootTweakPrivKey(base.fromHex(privKeyHex));
            return Buffer.from(schnorr.sign(hash, tweakedPrivKey, base.randomBytes(32)));
        },
    };

    const allowedSighashTypes = [
        Transaction.SIGHASH_SINGLE | Transaction.SIGHASH_ANYONECANPAY,
        Transaction.SIGHASH_ALL | Transaction.SIGHASH_ANYONECANPAY,
        Transaction.SIGHASH_ALL,
        Transaction.SIGHASH_DEFAULT
    ];

    for (let i = 0; i < psbt.inputCount; i++) {
        if (isTaprootInput(psbt.data.inputs[i])) {
            signer.publicKey = Buffer.from(taproot.taprootTweakPubkey(toXOnly(wif2Public(privateKey, network)))[0]);
        } else {
            signer.publicKey = wif2Public(privateKey, network);
        }
        try {
            psbt.signInput(i, signer, allowedSighashTypes);
        } catch (e) {
        }
    }
}

export function extractPsbtTransaction(txHex: string, network?: Network) {
    const psbt = Psbt.fromHex(txHex, {network});
    let extractedTransaction
    try {
        extractedTransaction = psbt.finalizeAllInputs().extractTransaction()
    } catch (e) {
        extractedTransaction = psbt.extractTransaction()
        console.log(e)
    }
    return extractedTransaction.toHex();
}

export function generateUnsignedListingPsbt(listingData: ListingData, network?: Network, publicKey?: string) {
    const script = address.toOutputScript(listingData.nftAddress!, network);
    if ((isP2SHScript(script) || isP2TR(script)) && !publicKey) {
        throw new Error("Missing publicKey");
    }

    // @ts-ignore
    const tx: utxoTx = {
        inputs: [],
        outputs: [],
    };

    // The p2pkh address requires two placeholder lines
    let placeholderAddress = "bc1pcyj5mt2q4t4py8jnur8vpxvxxchke4pzy7tdr9yvj3u3kdfgrj6sw3rzmr";
    if (network === networks.testnet) {
        placeholderAddress = "tb1pcyj5mt2q4t4py8jnur8vpxvxxchke4pzy7tdr9yvj3u3kdfgrj6see4dpv";
    }
    tx.inputs.push(
        {
            txId: "0".repeat(64),
            vOut: 0,
            amount: 0,
            address: placeholderAddress,
        } as never,
        {
            txId: "0".repeat(64),
            vOut: 1,
            amount: 0,
            address: placeholderAddress,
        } as never
    );

    tx.outputs.push(
        {
            address: placeholderAddress,
            amount: 0,
        } as never,
        {
            address: placeholderAddress,
            amount: 0,
        } as never
    );


    tx.inputs.push({
        txId: listingData.nftUtxo.txHash,
        vOut: listingData.nftUtxo.vout,
        address: listingData.nftAddress,
        amount: listingData.nftUtxo.coinAmount,
        publicKey: publicKey,
        nonWitnessUtxo: listingData.nftUtxo.rawTransation,
        sighashType: Transaction.SIGHASH_SINGLE | Transaction.SIGHASH_ANYONECANPAY,
    } as never);

    tx.outputs.push({
        address: listingData.receiveBtcAddress,
        amount: listingData.price,
    } as never);

    const psbtHex = buildPsbt(tx, network);
    return base.toBase64(base.fromHex(psbtHex));
}

export function generateSignedListingPsbt(listingData: ListingData, privateKey: string, network?: Network) {
    const publicKey = base.toHex(wif2Public(privateKey, network));
    return psbtSign(generateUnsignedListingPsbt(listingData, network, publicKey), privateKey, network);
}

const SELLER_INDEX = 2;
const DUMMY_AMOUNT = 600;
const DUST_OUTPUT_LIMIT = 546;

export function generateUnsignedBuyingPsbt(buyingData: BuyingData, network?: Network, publicKey?: string) {
    const tx: utxoTx = {
        inputs: [],
        outputs: [],
        address: buyingData.paymentAndChangeAddress,
        feePerB: buyingData.feeRate,
    };

    buyingData.dummyUtxos.forEach(dummyUtxo => {
        tx.inputs.push({
            txId: dummyUtxo.txHash,
            vOut: dummyUtxo.vout,
            address: buyingData.paymentAndChangeAddress,
            amount: dummyUtxo.coinAmount,
            publicKey: publicKey,
            nonWitnessUtxo: dummyUtxo.rawTransation,
        } as never);
    });

    tx.outputs.push({
        address: buyingData.paymentAndChangeAddress,
        amount: buyingData.dummyUtxos.reduce((sum, dummyUtxo) => sum + dummyUtxo.coinAmount, 0),
    } as never);

    const nftOutputs: Output[] = [];
    buyingData.sellerPsbts.forEach(sellerPsbt => {
        const psbt = Psbt.fromBase64(sellerPsbt, {network});
        const nftInput = (psbt.data.globalMap.unsignedTx as any).tx.ins[SELLER_INDEX];
        nftOutputs.push((psbt.data.globalMap.unsignedTx as any).tx.outs[SELLER_INDEX]);
        let nftUtxo = psbt.data.inputs[SELLER_INDEX].witnessUtxo;
        if (!nftUtxo) {
            nftUtxo = Transaction.fromBuffer(psbt.data.inputs[SELLER_INDEX].nonWitnessUtxo!).outs[nftInput.index];
        }

        tx.inputs.push({
            txId: base.toHex(reverseBuffer(nftInput.hash)),
            vOut: nftInput.index,
            address: address.fromOutputScript(nftUtxo.script, network),
            amount: nftUtxo.value,
            sighashType: Transaction.SIGHASH_SINGLE | Transaction.SIGHASH_ANYONECANPAY,
        } as never);

        tx.outputs.push({
            address: buyingData.receiveNftAddress,
            amount: nftUtxo.value,
        } as never);
    });

    nftOutputs.forEach(nftOutput => {
        tx.outputs.push({
            address: address.fromOutputScript(nftOutput.script, network),
            amount: nftOutput.value,
        } as never);
    });

    buyingData.paymentUtxos.forEach(paymentUtxo => {
        tx.inputs.push({
            txId: paymentUtxo.txHash,
            vOut: paymentUtxo.vout,
            address: buyingData.paymentAndChangeAddress,
            amount: paymentUtxo.coinAmount,
            publicKey: publicKey,
            nonWitnessUtxo: paymentUtxo.rawTransation,
        } as never);
    });

    buyingData.dummyUtxos.forEach(() => {
        tx.outputs.push({
            address: buyingData.paymentAndChangeAddress,
            amount: DUMMY_AMOUNT,
        } as never);
    });

    const changeAmount = parseInt(signBtc(tx, "", network, undefined, false, true));
    if (changeAmount >= DUST_OUTPUT_LIMIT) {
        tx.outputs.push({
            address: buyingData.paymentAndChangeAddress,
            amount: changeAmount,
        } as never);
    }

    return base.toBase64(base.fromHex(buildPsbt(tx, network)));
}

export function mergeSignedBuyingPsbt(signedBuyingPsbt: string, signedListingPsbts: string[]) {
    const buyerSignedPsbt = Psbt.fromBase64(signedBuyingPsbt);

    const nftIndex = signedListingPsbts.length + 1;
    signedListingPsbts.forEach((signedListingPsbt, i) => {
        const sellerSignedPsbt = Psbt.fromBase64(signedListingPsbt);
        (buyerSignedPsbt.data.globalMap.unsignedTx as any).tx.ins[nftIndex + i]
            = (sellerSignedPsbt.data.globalMap.unsignedTx as any).tx.ins[SELLER_INDEX];

        buyerSignedPsbt.data.inputs[nftIndex + i]
            = sellerSignedPsbt.data.inputs[SELLER_INDEX];
    });

    return buyerSignedPsbt;
}

export function generateSignedBuyingTx(buyingData: BuyingData, privateKey: string, network?: Network) {
    const publicKey = base.toHex(wif2Public(privateKey, network));
    const signedBuyingPsbt = psbtSign(generateUnsignedBuyingPsbt(buyingData, network, publicKey), privateKey, network);
    return extractPsbtTransaction(mergeSignedBuyingPsbt(signedBuyingPsbt, buyingData.sellerPsbts).toHex(), network);
}