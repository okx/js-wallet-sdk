import {Psbt} from "./bitcoinjs-lib/psbt";
import { base, signUtil } from '@okxweb3/crypto-lib';
import { getAddressType, privateKeyFromWIF, sign, wif2Public } from './txBuild';
import { Network, networks, payments, Transaction } from './bitcoinjs-lib';
import * as taproot from "./taproot";
import {isTaprootInput} from "./bitcoinjs-lib/psbt/bip371";
import { utxoInput, utxoOutput, utxoTx } from './type';
import { toOutputScript } from './bitcoinjs-lib/address';
import { PsbtInputExtended, PsbtOutputExtended } from './bitcoinjs-lib/psbt';

const schnorr = signUtil.schnorr.secp256k1.schnorr

export function buildPsbt(tx: utxoTx, network?: Network) {
    const psbt = new Psbt( { network: network });
    tx.inputs.forEach((input: utxoInput) => {
        const outputScript = toOutputScript(input.address!, network);
        let inputData: PsbtInputExtended = {
            hash: input.txId,
            index: input.vOut,
            witnessUtxo: { script: outputScript, value: input.amount },
        };

        const addressType = getAddressType(input.address!, network || networks.bitcoin);
        if(input.bip32Derivation) {
            if (addressType === 'segwit_taproot') {
                inputData.tapBip32Derivation = input.bip32Derivation!.map((derivation: any) => {
                    let pubBuf = base.fromHex(derivation.pubkey)
                    if(pubBuf.length != 32) {
                        pubBuf = pubBuf.slice(1)
                    }
                    return {
                        masterFingerprint: base.fromHex(derivation.masterFingerprint) ,
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
                        masterFingerprint: base.fromHex(derivation.masterFingerprint) ,
                        pubkey: base.fromHex(derivation.pubkey),
                        path: derivation.path,
                    }
                })
            }
        }

        if (addressType === 'legacy') {
            inputData.nonWitnessUtxo = base.fromHex(input.nonWitnessUtxo!);
        } else if (addressType === 'segwit_taproot') {
            let pubKey = base.fromHex(input.publicKey!);
            if (pubKey.length === 33) {
                pubKey = pubKey.slice(1);
            }
            inputData.tapInternalKey = pubKey;
        } else if (addressType === 'segwit_nested') {
            inputData.redeemScript = payments.p2wpkh({
                pubkey: Buffer.from(input.publicKey!, 'hex'),
                network,
            }).output!
        }
        psbt.addInput(inputData);
    });
    tx.outputs.forEach((output: utxoOutput) => {
        if(output.omniScript) {
            psbt.addOutput({ script: base.fromHex(output.omniScript), value: 0 });
        } else {
            let outputData: PsbtOutputExtended = { address: output.address, value: output.amount };
            if (output.bip32Derivation) {
                outputData.bip32Derivation = output.bip32Derivation!.map((derivation: any) => {
                    return {
                        masterFingerprint: base.fromHex(derivation.masterFingerprint) ,
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

export function psbtSign(psbtBase64: string, privateKey: string, network: Network) {
    const psbt = Psbt.fromBase64(psbtBase64, { network });
    psbtSignImpl(psbt, privateKey, network)
    return psbt.toBase64();
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
        Transaction.SIGHASH_SINGLE|Transaction.SIGHASH_ANYONECANPAY,
        Transaction.SIGHASH_ALL,
        Transaction.SIGHASH_DEFAULT
    ];

    for (let i = 0; i < psbt.inputCount; i++) {
        if (isTaprootInput(psbt.data.inputs[i])) {
            signer.publicKey = Buffer.from(taproot.taprootTweakPubkey(wif2Public(privateKey, network).slice(1))[0]);
        } else {
            signer.publicKey = wif2Public(privateKey, network);
        }
        try {
            psbt.signInput(i, signer, allowedSighashTypes);
        } catch (e) {}
    }
}

export function extractPsbtTransaction(txHex: string, network?: Network) {
    const psbt = Psbt.fromHex(txHex, { network });
    let extractedTransaction
    try {
        extractedTransaction = psbt.finalizeAllInputs().extractTransaction()
    } catch (e){
        extractedTransaction = psbt.extractTransaction()
    }
    return extractedTransaction.toHex();
}
