import {Psbt, PsbtInputExtended, PsbtOutputExtended} from "./bitcoinjs-lib/psbt";
import {base, signUtil} from '@okxweb3/crypto-lib';
import {getAddressType, privateKeyFromWIF, sign, signBtc, wif2Public} from './txBuild';
import {address, Network, networks, payments, Transaction} from './bitcoinjs-lib';
import * as taproot from "./taproot";
import {isTaprootInput, toXOnly} from "./bitcoinjs-lib/psbt/bip371";
import {BuyingData, ListingData, signPsbtOptions, toSignInput, utxoInput, utxoOutput, utxoTx} from './type';
import {toOutputScript} from './bitcoinjs-lib/address';
import {reverseBuffer} from "./bitcoinjs-lib/bufferutils";
import {Output} from "./bitcoinjs-lib/transaction";
import {isP2SHScript, isP2TR} from "./bitcoinjs-lib/psbt/psbtutils";
import * as bscript from "./bitcoinjs-lib/script";
import {sha256} from "./bitcoinjs-lib/crypto";
import {range} from "./bitcoinjs-lib/bip174/converter/tools";
import {pbkdf2Sync, randomBytes} from "crypto";

const schnorr = signUtil.schnorr.secp256k1.schnorr
const defaultMaximumFeeRate = 5000

export function buildPsbt(tx: utxoTx, network?: Network, maximumFeeRate?: number) {
    const psbt = classicToPsbt(tx, network, maximumFeeRate);
    return psbt.toHex();
}

export function classicToPsbt(tx: utxoTx, network?: Network, maximumFeeRate?: number): Psbt {
    const psbt = new Psbt({network, maximumFeeRate: maximumFeeRate ? maximumFeeRate : defaultMaximumFeeRate});
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
    return psbt;
}

export function psbtSign(psbtBase64: string, privateKey: string, network?: Network, maximumFeeRate?: number) {
    const psbt = Psbt.fromBase64(psbtBase64, {
        network,
        maximumFeeRate: maximumFeeRate ? maximumFeeRate : defaultMaximumFeeRate
    });
    psbtSignImpl(psbt, privateKey, network)
    return psbt.toBase64();
}

export function psbtDecode(psbtBase64: string, network?: Network, maximumFeeRate?: number) {

    try {
        const psbt = Psbt.fromHex(psbtBase64, {
            network,
            maximumFeeRate: maximumFeeRate ? maximumFeeRate : defaultMaximumFeeRate
        });
        return psbt.txInputs ? psbt.txInputs.filter(a => !a.hash.equals(Buffer.alloc(32)))
            .map((a => {
                return {txId: base.toHex(base.reverseBuffer(a.hash)), vOut: a.index}
            })) : []
    } catch (e) {
        const psbt = Psbt.fromBase64(psbtBase64, {
            network,
            maximumFeeRate: maximumFeeRate ? maximumFeeRate : defaultMaximumFeeRate
        });
        return psbt.txInputs ? psbt.txInputs.filter(a => !a.hash.equals(Buffer.alloc(32)))
            .map((a => {
                return {txId: base.toHex(base.reverseBuffer(a.hash)), vOut: a.index}
            })) : []
    }
}

export function signPsbtWithKeyPathAndScriptPathBatch(psbtHexs: string[], privateKey: string, network?: Network, opts?: signPsbtOptions []) {
    if (psbtHexs == undefined || psbtHexs.length == 0) {
        return [];
    }
    let res: string[] = [];
    const optsSize = opts == undefined ? 0 : opts.length;
    let i: number = 0;
    for (i = 0; i < psbtHexs.length; i++) {
        let opt: signPsbtOptions = {};
        if (i < optsSize && opts) {
            opt = opts[i]
        }
        const signedPsbt = signPsbtWithKeyPathAndScriptPath(psbtHexs[i], privateKey, network, {
            autoFinalized: opt.autoFinalized,
            toSignInputs: opt.toSignInputs
        });
        res.push(signedPsbt);
    }
    return res
}

export function signPsbtWithKeyPathAndScriptPath(psbtStr: string, privateKey: string, network?: Network, opts: signPsbtOptions = {}) {
    const psbt = getPsbtFromString(psbtStr, network)
    signPsbtWithKeyPathAndScriptPathImpl(psbt, privateKey, network, opts.autoFinalized, opts.toSignInputs)
    return psbt.toHex();
}

export function signPsbtWithKeyPathAndScriptPathImpl(psbt: Psbt, privateKey: string, network?: Network, autoFinalized?: boolean, signInputs?: toSignInput[]) {
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
            needDoubleTweak: false,
            tweakHash: Buffer.alloc(0),
            toSignInputsMap: signInputMap,
            publicKey: Buffer.alloc(0),
            sign(hash: Buffer): Buffer {
            return sign(hash, privKeyHex);
            },
            signSchnorr(hash: Buffer): Buffer {
            let tweakedPrivKey = taproot.taprootTweakPrivKey(base.fromHex(privKeyHex));
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
            if (this.needDoubleTweak && this.tweakHash.length > 0) {
                tweakedPrivKey = taproot.taprootTweakPrivKey(base.fromHex(privKeyHex)); //standard tweak
                tweakedPrivKey = taproot.taprootTweakPrivKey(tweakedPrivKey, this.tweakHash); //tweak again with merkle root
            }
            return Buffer.from(schnorr.sign(hash, tweakedPrivKey, base.randomBytes(32)));
            },
        };

    let allowedSighashTypes = [
            Transaction.SIGHASH_SINGLE | Transaction.SIGHASH_ANYONECANPAY,
            Transaction.SIGHASH_ALL,
            Transaction.SIGHASH_DEFAULT
    ];
    const getSigner  = ()=> {
        return {
            psbtIndex: 0,
            needTweak: true,
            needDoubleTweak: false,
            tweakHash: Buffer.alloc(0),
            toSignInputsMap: signInputMap,
            publicKey: Buffer.alloc(0),
            getPrivateKey() {
                let privKey =base.fromHex(privKeyHex)
                if (this.needTweak && !this.needDoubleTweak) {
                    privKey = Buffer.from(taproot.taprootTweakPrivKey(privKey, this.tweakHash))
                }
                if (this.needDoubleTweak && this.tweakHash.length > 0) {
                    privKey = Buffer.from(taproot.taprootTweakPrivKey(privKey)) // standard tweak
                    privKey = Buffer.from(taproot.taprootTweakPrivKey(privKey, this.tweakHash)) // tweak again with merkle root
                }

                return privKey

            },
            sign(hash: Buffer): Buffer {
                return sign(hash, this.getPrivateKey().toString('hex'));
            },
            signSchnorr(hash: Buffer): Buffer {
                return Buffer.from(schnorr.sign(hash, this.getPrivateKey(), base.randomBytes(32)));
            },
        };
    }

    const getAllowedSighashTypes = () => {
        return [
            Transaction.SIGHASH_SINGLE | Transaction.SIGHASH_ANYONECANPAY,
            Transaction.SIGHASH_ALL,
            Transaction.SIGHASH_DEFAULT
        ] as number[];
    }

    for (let i = 0; i < psbt.inputCount; i++) {
        if (signInputMap?.size > 0 && !signInputMap?.has(i)) {
            continue;
        }

        // set useTweakSigner, new psbt sign method (aligned with Unisat)
        if (signInputMap?.get(i)?.useTweakSigner !== undefined) {
            const input = psbt.data.inputs[i];

            let tapLeafHashToSign: Buffer | undefined;
            let forUseTweakSigner = getSigner()
            let allowedSighashTypes = getAllowedSighashTypes()

            forUseTweakSigner.psbtIndex = i;
            forUseTweakSigner.publicKey = wif2Public(privateKey, network);

            const signInput = signInputMap.get(i)!

            if (signInput.sighashTypes !== undefined) {
                allowedSighashTypes = signInput.sighashTypes;
            }

            // both taproot and non-taproot
            // @ts-ignore
            forUseTweakSigner.needTweak = signInput.useTweakSigner;
            if (forUseTweakSigner.needTweak && !input.tapMerkleRoot) {
                // standard single tweak
                forUseTweakSigner.publicKey = Buffer.from(taproot.taprootTweakPubkey(toXOnly(wif2Public(privateKey, network)), forUseTweakSigner.tweakHash)[0]);
            } else if (!forUseTweakSigner.needTweak && input.tapMerkleRoot) {
                // single tweak if user set useTweakSigner=false and tapMerkleRoot (key path spend using internal key)
                forUseTweakSigner.needTweak = true;
                forUseTweakSigner.tweakHash = input.tapMerkleRoot;                
                forUseTweakSigner.publicKey = Buffer.from(taproot.taprootTweakPubkey(toXOnly(wif2Public(privateKey, network)), forUseTweakSigner.tweakHash)[0]);
            } else if (forUseTweakSigner.needTweak && input.tapMerkleRoot) {
                // double tweak if user set useTweakSigner=true and tapMerkleRoot (key path spend using tweaked key)
                forUseTweakSigner.needDoubleTweak = true;
                forUseTweakSigner.tweakHash = input.tapMerkleRoot;
                const singleTweakedPublicKey = taproot.taprootTweakPubkey(toXOnly(wif2Public(privateKey, network)), forUseTweakSigner.tweakHash)[0];
                const doubleTweakedPublicKey = taproot.taprootTweakPubkey(singleTweakedPublicKey, input.tapMerkleRoot)[0];
                forUseTweakSigner.publicKey = Buffer.from(doubleTweakedPublicKey);
            }

            if (isTaprootInput(input)) {
                if (!input.tapInternalKey && !input.tapLeafScript) {  // don't need internal key if have leaf script
                    input.tapInternalKey = toXOnly(wif2Public(privateKey, network));
                }

                if (signInput.tapLeafHashToSign !== undefined) {
                    tapLeafHashToSign = Buffer.from(signInput.tapLeafHashToSign, 'hex');
                }
            }

            try {
                psbt.signInput(i, forUseTweakSigner, allowedSighashTypes, tapLeafHashToSign);
                if (autoFinalized != undefined && !autoFinalized) {
                    continue;
                }
                psbt.finalizeInput(i)
            } catch (e) {
                // todo handle err
                // console.info(e)
                throw e;
            }

        } else {
            // Didn't set useTweakSigner, old psbt sign method
            signer.psbtIndex = i;
            const input = psbt.data.inputs[i];
            if (isTaprootInput(input)) {

                if (!input.tapInternalKey) {
                    input.tapInternalKey = toXOnly(wif2Public(privateKey, network));
                }
                // default key path spend
                signer.needTweak = true;
                signer.publicKey = Buffer.from(taproot.taprootTweakPubkey(toXOnly(wif2Public(privateKey, network)))[0]);
                // if user set disableTweakSigner, we should use it.
                if (signInputMap?.has(i)) {
                    if (signInputMap?.get(i)?.disableTweakSigner) {
                        // signer.publicKey = toXOnly(wif2Public(privateKey, network));
                        signer.publicKey = wif2Public(privateKey, network);
                        signer.needTweak = false;
                    }
                }
                // script path spend
                if (input.tapLeafScript && input.tapLeafScript?.length > 0 && !input.tapMerkleRoot) {
                    input.tapLeafScript.map(e => {
                        if (e.controlBlock && e.script) {
                            signer.publicKey = wif2Public(privateKey, network);
                            signer.needTweak = false;
                        }
                    });
                } else if (input.tapMerkleRoot) {// script path utxo but key path spend
                    // default behavior
                    signer.needTweak = true;
                    signer.tweakHash = input.tapMerkleRoot;
                    signer.publicKey = Buffer.from(taproot.taprootTweakPubkey(toXOnly(wif2Public(privateKey, network)), input.tapMerkleRoot)[0]);
                    if (signInputMap?.get(i)?.disableTweakSigner === false) {
                        // if tweak signer is enabled, we should tweak the tweaked key by the merkle root
                        // (i.e. it gets double-tweaked, one standard tweak and one with the merkle root)
                        // this allows the user to script path and key path spend using addresses generated by the tweaked key
                        signer.needTweak = true;
                        signer.needDoubleTweak = true;
                        signer.tweakHash = input.tapMerkleRoot;
                        const singleTweakedPublicKey = taproot.taprootTweakPubkey(toXOnly(wif2Public(privateKey, network)))[0];
                        const doubleTweakedPublicKey = taproot.taprootTweakPubkey(singleTweakedPublicKey, input.tapMerkleRoot)[0];
                        signer.publicKey = Buffer.from(doubleTweakedPublicKey);
                    }
                }
            } else {
                signer.needTweak = false;
                signer.tweakHash = Buffer.alloc(0);
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
                // todo handle err
                // console.info(e)
                if (signInputMap?.size > 0 && signInputMap?.has(i)) {
                    throw e;
                }
            }
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
            const input = psbt.data.inputs[i];
            if (!input.tapInternalKey) {
                input.tapInternalKey = toXOnly(wif2Public(privateKey, network));
            }
            signer.publicKey = Buffer.from(taproot.taprootTweakPubkey(toXOnly(wif2Public(privateKey, network)))[0]);
        } else {
            signer.publicKey = wif2Public(privateKey, network);
        }
        try {
            psbt.signInput(i, signer, allowedSighashTypes);
        } catch (e) {
            // console.log(e)
        }
    }
}

export function extractPsbtTransaction(txHex: string, network?: Network, maximumFeeRate?: number) {
    const psbt = Psbt.fromHex(txHex, {
        network,
        maximumFeeRate: maximumFeeRate ? maximumFeeRate : defaultMaximumFeeRate
    });
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


// note brc20-mpc not support taproot address
export function generateMPCUnsignedListingPSBT(psbtBase64: string, pubKeyHex: string, network?: Network) {
    const psbt = Psbt.fromBase64(psbtBase64, {network});
    const publicKey = base.fromHex(pubKeyHex);
    const sighashTypes: number[] = [Transaction.SIGHASH_SINGLE | Transaction.SIGHASH_ANYONECANPAY];
    let signHashList: string[] = [];
    for (let i = 0; i < psbt.inputCount; i++) {
        if (i != SELLER_INDEX) {
            continue;
        }
        const {hash, sighashType} = psbt.getHashAndSighashType(i, publicKey, sighashTypes);
        signHashList.push(base.toHex(hash))
    }
    return {
        psbtBase64: psbtBase64,
        signHashList: signHashList,
    }
}

export function generateMPCSignedListingPSBT(psbtBase64: string, pubKeyHex: string, signature: string, network?: Network) {
    const psbt = Psbt.fromBase64(psbtBase64, {network});
    const publicKey = base.fromHex(pubKeyHex);
    const partialSig = [
        {
            pubkey: publicKey,
            signature: bscript.signature.encode(base.fromHex(signature), Transaction.SIGHASH_SINGLE | Transaction.SIGHASH_ANYONECANPAY),
        },
    ];
    psbt.data.updateInput(SELLER_INDEX, {partialSig});
    return psbt.toBase64();
}

export function generateMPCUnsignedBuyingPSBT(psbtBase64: string, pubKeyHex: string, network?: Network, batchSize: number = 1,) {
    const psbt = Psbt.fromBase64(psbtBase64, {network});
    const publicKey = base.fromHex(pubKeyHex);
    const sighashTypes: number[] = [Transaction.SIGHASH_ALL];// no taproot address
    let signHashList: string[] = [];
    const sellerIndex = batchSize + 1
    for (let i = 0; i < psbt.inputCount; i++) {
        if (i >= sellerIndex && i < sellerIndex + batchSize) {
            continue;
        }
        const {hash, sighashType} = psbt.getHashAndSighashType(i, publicKey, sighashTypes);
        signHashList.push(base.toHex(hash))
    }
    return {
        psbtBase64: psbtBase64,
        signHashList: signHashList,
    }
}

export function generateMPCSignedBuyingTx(psbtBase64: string, pubKeyHex: string, signatureList: string[], network?: Network, batchSize: number = 1) {
    const psbt = Psbt.fromBase64(psbtBase64, {network});
    const publicKey = base.fromHex(pubKeyHex);
    const sellerIndex = batchSize + 1
    for (let i = 0; i < psbt.inputCount; i++) {
        if (i >= sellerIndex && i < sellerIndex + batchSize) {
            continue;
        }
        const partialSig = [
            {
                pubkey: publicKey,
                signature: bscript.signature.encode(base.fromHex(signatureList[i]), Transaction.SIGHASH_ALL),
            },
        ];
        psbt.data.updateInput(i, {partialSig});
    }
    return extractPsbtTransaction(psbt.toHex(), network);
}

export function generateMPCUnsignedPSBT(psbtStr: string, pubKeyHex: string, network?: Network) {
    const psbt = getPsbtFromString(psbtStr, network);
    const publicKey = base.fromHex(pubKeyHex);
    const allowedSighashTypes = [
        Transaction.SIGHASH_SINGLE | Transaction.SIGHASH_ANYONECANPAY,
        Transaction.SIGHASH_SINGLE | Transaction.SIGHASH_ANYONECANPAY,
        Transaction.SIGHASH_ALL | Transaction.SIGHASH_ANYONECANPAY,
        Transaction.SIGHASH_ALL,
        Transaction.SIGHASH_DEFAULT
    ];
    ;// no taproot address
    let signHashList: string[] = [];
    for (let i = 0; i < psbt.inputCount; i++) {
        try {
            const {hash, sighashType} = psbt.getHashAndSighashType(i, publicKey, allowedSighashTypes);
            signHashList.push(base.toHex(hash))
        } catch (e) {
            // todo handle err
            const s = getRandomHash();
            signHashList.push(s);
        }
    }
    const m = new Map<string, number>();

    signHashList.map((e, i) => {
        let count = m.get(e);
        count = count == undefined ? 0 : count
        if (count != undefined && count >= 1) {
            signHashList[i] = getRandomHash();
        }
        m.set(e, count + 1)
    });

    return {
        psbtStr: psbtStr,
        signHashList: signHashList,
    }
}

function getRandomHash() {
    const h = sha256(randomBytes(32))
    const s = base.toHex(h.slice(0, 28))
    return "ffffffff" + s;
}

export function generateMPCSignedPSBT(psbtStr: string, pubKeyHex: string, signatureList: string[], network?: Network) {
    const psbt = getPsbtFromString(psbtStr, network);
    const publicKey = base.fromHex(pubKeyHex);
    let sighashType: number = Transaction.SIGHASH_ALL;// no taproot address
    const res = generateMPCUnsignedPSBT(psbtStr, pubKeyHex, network);
    const signHashList = res.signHashList
    for (let i = 0; i < psbt.inputCount; i++) {
        if (signHashList[i].slice(0, 8) == "ffffffff") {
            continue;
        }
        if (psbt.data.inputs[i].sighashType != undefined) {
            sighashType = psbt.data.inputs[i].sighashType!
        }
        const partialSig = [
            {
                pubkey: publicKey,
                signature: bscript.signature.encode(base.fromHex(signatureList[i]), sighashType),
            },
        ];
        try {
            psbt.data.updateInput(i, {partialSig});
        } catch (e) {
            // todo handle err
        }
    }
    return psbt.toHex();
}

function getPsbtFromString(psbtStr: string, network?: Network) {
    let psbt: Psbt;
    if (base.isHexString("0x" + psbtStr)) {
        psbt = Psbt.fromHex(psbtStr, {network});
    } else {
        psbt = Psbt.fromBase64(psbtStr, {network})
    }
    return psbt;
}