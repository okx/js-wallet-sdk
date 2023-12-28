import {
    BaseWallet,
    CalcTxHashError,
    CalcTxHashParams,
    cloneObject,
    convert2Number,
    DerivePathError,
    DerivePriKeyParams,
    EstimateFeeError,
    GenPrivateKeyError,
    GetAddressParams,
    GetDerivedPathParam,
    GetHardwareRawTransactionError,
    GetMpcRawTransactionError,
    GetMpcTransactionError,
    jsonStringifyUniform,
    MpcMessageParam,
    MpcRawTransactionData,
    MpcRawTransactionParam,
    MpcTransactionParam,
    NewAddressData,
    NewAddressError,
    NewAddressParams,
    secp256k1SignTest,
    segwitType,
    SignMsgError,
    SignTxError,
    SignTxParams,
    TypedMessage,
    ValidAddressData,
    ValidAddressParams,
    ValidPrivateKeyData,
    ValidPrivateKeyParams,
    validSignedTransactionError,
    ValidSignedTransactionParams,
    VerifyMessageParams
} from '@okxweb3/coin-base';
import {base, bip32, bip39} from '@okxweb3/crypto-lib';
import * as bitcoin from "../index"


export const BITCOIN_MESSAGE_ECDSA = 0
export const BITCOIN_MESSAGE_BIP0322_SIMPLE = 1

export class BtcWallet extends BaseWallet {

    network() {
        return bitcoin.networks.bitcoin
    }

    async getDerivedPath(param: GetDerivedPathParam): Promise<any> {
        if (!param.segwitType) {
            // normal address
            return `m/44'/0'/0'/0/${param.index}`;
        }

        if (param.segwitType == segwitType.SEGWIT_NESTED) {
            return `m/84'/0'/0'/0/${param.index}`;
        } else if (param.segwitType == segwitType.SEGWIT_NESTED_49) {
            return `m/49'/0'/0'/0/${param.index}`;
        } else if (param.segwitType == segwitType.SEGWIT_NATIVE) {
            return `m/84'/0'/0'/0/${param.index}`;
        } else if (param.segwitType == segwitType.SEGWIT_TAPROOT) {
            return `m/86'/0'/0'/0/${param.index}`
        } else {
            return Promise.reject(DerivePathError);
        }
    }

    async validPrivateKey(param: ValidPrivateKeyParams) {
        let isValid: boolean
        try {
            const {version} = bitcoin.wif.decode(param.privateKey)
            isValid = (version === this.network().wif)
        } catch (e) {
            isValid = false
        }
        const data: ValidPrivateKeyData = {
            isValid: isValid,
            privateKey: param.privateKey
        };
        return Promise.resolve(data)
    }

    // SegWit, a compatibility upgrade to the Bitcoin protocol, separates signature data from Bitcoin transactions.
    async getNewAddress(param: NewAddressParams): Promise<any> {
        try {
            let network = this.network();
            let privateKey = param.privateKey;
            // addressType = "Legacy" | "segwit_native" | "segwit_p2sh"
            const addressType = param.addressType || "Legacy"
            const publicKey = bitcoin.wif2Public(privateKey, network);
            let address: string | undefined
            if (addressType === "Legacy") {
                // legacy address: start with `1`,  encoded to base58
                const result = bitcoin.payments.p2pkh({pubkey: publicKey, network});
                address = result.address
            } else if (addressType === "segwit_native") {
                // native segwit address: start with `bc1`, encoded to bech32
                const result = bitcoin.payments.p2wpkh({pubkey: publicKey, network});
                address = result.address
            } else if (addressType === "segwit_nested") {
                // nested segwit address: using p2sh, start with `3`, encoded to base58
                const result = bitcoin.payments.p2sh({
                    redeem: bitcoin.payments.p2wpkh({pubkey: publicKey, network}),
                });
                address = result.address
            } else if (addressType === "segwit_taproot") {
                // taproot address, encoded in bech32m
                const result = bitcoin.payments.p2tr({internalPubkey: publicKey.slice(1), network});
                address = result.address
            }

            let data: NewAddressData = {
                address: address || "",
                publicKey: base.toHex(addressType === "segwit_taproot" ? publicKey.slice(1) : publicKey),
                compressedPublicKey: base.toHex(publicKey),
            };
            return Promise.resolve(data);
        } catch (e) {
            return Promise.reject(NewAddressError);
        }
    }

    async validAddress(param: ValidAddressParams): Promise<any> {
        let isValid = false;
        let network = this.network();
        try {
            let outputScript = bitcoin.address.toOutputScript(param.address, network);
            if (outputScript) {
                isValid = true;
            }
        } catch (e) {
        }
        if (param.addressType) {
            isValid = param.addressType === bitcoin.getAddressType(param.address, network);
        }
        let data: ValidAddressData = {
            isValid: isValid,
            address: param.address
        };
        return Promise.resolve(data);
    }

    async signTransaction(param: SignTxParams): Promise<any> {
        const type = param.data.type || 0;
        if (type === 1) { // inscribe
            try {
                return Promise.resolve(bitcoin.inscribe(this.network(), param.data));
            } catch (e) {
                return Promise.reject(SignTxError);
            }
        } else if (type === 101) { // src20
            try {
                return Promise.resolve(bitcoin.srcInscribe(this.network(), param.data));
            } catch (e) {
                return Promise.reject(SignTxError);
            }
        } else if (type === 2) { // psbt
            try {
                return Promise.resolve(bitcoin.psbtSign(param.data.psbt, param.privateKey, this.network()));
            } catch (e) {
                return Promise.reject(SignTxError);
            }
        } else if (type === 3) { // psbt key-path and script-path spend
            try {
                return Promise.resolve(bitcoin.signPsbtWithKeyPathAndScriptPath(param.data.psbt, param.privateKey, this.network(), {
                    autoFinalized: param.data.autoFinalized,
                    toSignInputs: param.data.toSignInputs
                }));
            } catch (e) {
                return Promise.reject(SignTxError);
            }
        } else if (type === 4) { // batch of psbt key-path and script-path spend
            try {
                return Promise.resolve(bitcoin.signPsbtWithKeyPathAndScriptPathBatch(param.data.psbtHexs, param.privateKey, this.network(), param.data.options));
            } catch (e) {
                return Promise.reject(SignTxError);
            }
        } else {
            let txHex = null;
            try {
                const privateKey = param.privateKey;
                const utxoTx = convert2UtxoTx(param.data);
                txHex = bitcoin.signBtc(utxoTx, privateKey, this.network());
                return Promise.resolve(txHex);
            } catch (e) {
                return Promise.reject(SignTxError);
            }
        }
    }

    getRandomPrivateKey(): Promise<any> {
        try {
            let network = this.network();
            while (true) {
                const privateKey = base.randomBytes(32)
                if (secp256k1SignTest(privateKey)) {
                    const wif = bitcoin.private2Wif(privateKey, network);
                    return Promise.resolve(wif);
                }
            }
        } catch (e) {
            return Promise.reject(GenPrivateKeyError);
        }
    }

    getDerivedPrivateKey(param: DerivePriKeyParams): Promise<any> {
        let network = this.network();
        return bip39.mnemonicToSeed(param.mnemonic)
            .then(masterSeed => {
                let childKey = bip32.fromSeed(masterSeed).derivePath(param.hdPath);
                if (!childKey.privateKey) {
                    return Promise.reject(GenPrivateKeyError);
                }
                const wif = bitcoin.private2Wif(childKey.privateKey, network);
                return Promise.resolve(wif);
            }).catch((e) => {
                return Promise.reject(GenPrivateKeyError);
            });
    }

    getAddressByPublicKey(param: GetAddressParams): Promise<any> {
        try {
            const network = this.network();
            const publicKey = base.fromHex(param.publicKey);
            if (!param.addressType) {
                const addresses = [];
                addresses.push({
                    addressType: "Legacy",
                    address: bitcoin.payments.p2pkh({pubkey: publicKey, network}).address,
                });
                addresses.push({
                    addressType: "segwit_nested",
                    address: bitcoin.payments.p2sh({
                        redeem: bitcoin.payments.p2wpkh({pubkey: publicKey, network}),
                    }).address,
                });
                addresses.push({
                    addressType: "segwit_native",
                    address: bitcoin.payments.p2wpkh({pubkey: publicKey, network}).address,
                });
                return Promise.resolve(addresses);
            } else if (param.addressType === 'Legacy') {
                return Promise.resolve(bitcoin.payments.p2pkh({pubkey: publicKey, network}).address)
            } else if (param.addressType === 'segwit_nested') {
                return Promise.resolve(bitcoin.payments.p2sh({
                    redeem: bitcoin.payments.p2wpkh({pubkey: publicKey, network}),
                }).address)
            } else if (param.addressType === 'segwit_native') {
                return Promise.resolve(bitcoin.payments.p2wpkh({pubkey: publicKey, network}).address)
            } else if (param.addressType === 'segwit_taproot') {
                return Promise.resolve(bitcoin.payments.p2tr({internalPubkey: publicKey.slice(1), network}).address)
            }
        } catch (e) {
        }
        return Promise.reject(NewAddressError);
    }

    getMPCRawTransaction(param: MpcRawTransactionParam): Promise<any> {
        try {
            const utxoTx = convert2UtxoTx(param.data);
            const hash: string[] = [];
            const unsignedTx = bitcoin.signBtc(utxoTx, "", this.network(), hash);
            const data: MpcRawTransactionData = {
                raw: unsignedTx,
                hash: hash,
            };
            return Promise.resolve(data);
        } catch (e) {
            return Promise.reject(GetMpcRawTransactionError);
        }
    }

    getMPCTransaction(param: MpcTransactionParam): Promise<any> {
        try {
            const hex = bitcoin.getMPCTransaction(param.raw, param.sigs as string[], false);
            return Promise.resolve(hex);
        } catch (e) {
            return Promise.reject(GetMpcTransactionError);
        }
    }

    async getMPCRawMessage(param: MpcRawTransactionParam): Promise<any> {
        try {
            const msgHash = await this.signMessage(param as SignTxParams);
            return Promise.resolve({hash: msgHash});
        } catch (e) {
            return Promise.reject(GetMpcRawTransactionError);
        }
    }

    async getMPCSignedMessage(param: MpcMessageParam): Promise<any> {
        try {
            return Promise.resolve(bitcoin.message.getMPCSignedMessage(param.hash, param.sigs as string, param.publicKey!));
        } catch (e) {
            return Promise.reject(GetMpcTransactionError);
        }
    }

    getHardWareRawTransaction(param: SignTxParams): Promise<any> {
        try {
            const type = param.data.type || 0;
            const utxoTx = convert2UtxoTx(param.data);
            if (type === 2) { // psbt
                const change = bitcoin.signBtc(utxoTx, "", this.network(), undefined, true, true);
                const dustSize = utxoTx.dustSize || 546;
                if (parseInt(change) >= dustSize) {
                    const changeUtxo = {
                        address: utxoTx.address,
                        amount: parseInt(change),
                        bip32Derivation: utxoTx.bip32Derivation
                    } as bitcoin.utxoOutput
                    utxoTx.outputs.push(changeUtxo as never)
                }
                const hex = bitcoin.buildPsbt(utxoTx, this.network());
                return Promise.resolve(hex);
            } else {
                // no need private key for hardware wallet
                const hex = bitcoin.signBtc(utxoTx, "", this.network(), undefined, true);
                return Promise.resolve(hex);
            }
        } catch (e) {
            return Promise.reject(GetHardwareRawTransactionError);
        }
    }

    async calcTxHash(param: CalcTxHashParams): Promise<string> {
        try {
            return Promise.resolve(bitcoin.Transaction.fromHex(param.data as string).getId());
        } catch (e) {
            return Promise.reject(CalcTxHashError);
        }
    }

    signMessage(param: SignTxParams): Promise<string> {
        try {
            const typedMessage = param.data as TypedMessage;
            let signature;
            if (typedMessage.type === BITCOIN_MESSAGE_ECDSA) {
                signature = bitcoin.message.sign(param.privateKey, typedMessage.message, this.network());
            } else {
                signature = bitcoin.bip0322.signSimple(typedMessage.message, typedMessage.address!, param.privateKey, this.network());
            }
            return Promise.resolve(signature);
        } catch (e) {
            return Promise.reject(SignMsgError);
        }
    }

    async verifyMessage(param: VerifyMessageParams): Promise<boolean> {
        try {
            const typedMessage = param.data as TypedMessage;
            if (typedMessage.type === BITCOIN_MESSAGE_ECDSA) {
                const ret = bitcoin.message.verify(typedMessage.publicKey!, typedMessage.message, param.signature);
                return Promise.resolve(ret);
            } else {
                const ret = bitcoin.bip0322.verifySimple(typedMessage.message, typedMessage.address!, param.signature, typedMessage.publicKey!, this.network());
                return Promise.resolve(ret);
            }
        } catch (e) {
            return Promise.reject(SignMsgError);
        }
    }

    static async extractPsbtTransaction(txHex: string): Promise<string> {
        try {
            return Promise.resolve(bitcoin.extractPsbtTransaction(txHex));
        } catch (e) {
            return Promise.reject(SignMsgError);
        }
    }

    async validSignedTransaction(param: ValidSignedTransactionParams): Promise<any> {
        try {
            if (param.data) {
                param.data.forEach((o: any) => o.value = o.amount)
            }

            const tx = bitcoin.ValidSignedTransaction(param.tx, param.data, this.network());
            return Promise.resolve(jsonStringifyUniform(tx));
        } catch (e) {
            return Promise.reject(validSignedTransactionError);
        }
    }

    async estimateFee(param: SignTxParams): Promise<number> {
        try {
            const type = param.data.type || 0;
            if (type === 1) { // inscribe
                return Promise.reject(EstimateFeeError);
            } else if (type === 2) { // psbt
                return Promise.reject(EstimateFeeError);
            } else {
                const utxoTx = convert2UtxoTx(param.data);
                const fee = bitcoin.estimateBtcFee(utxoTx, this.network());
                return Promise.resolve(fee);
            }
        } catch (e) {
            return Promise.reject(EstimateFeeError);
        }
    }

    static async oneKeyBuildBtcTx(txData: bitcoin.utxoTx): Promise<any> {
        try {
            return Promise.resolve(bitcoin.oneKeyBuildBtcTx(txData));
        } catch (e) {
            return Promise.reject(SignTxError);
        }
    }
}

export class TBtcWallet extends BtcWallet {
    network() {
        return bitcoin.networks.testnet;
    }
}

export function number2Hex(n: number, length: number): string {
    let s = n.toString(16)
    const d = length - s.length
    if (d > 0) {
        for (let i = 0; i < d; i++) {
            s = "0" + s
        }
    }
    return s
}

export function convert2UtxoTx(utxoTx: any): bitcoin.utxoTx {
    const tx = cloneObject(utxoTx)
    tx.inputs.forEach((it: any) => {
        it.amount = convert2Number(it.amount)
    })

    tx.outputs.forEach((it: any) => {
        it.amount = convert2Number(it.amount)
    })

    if (tx.omni) {
        tx.omni.amount = convert2Number(tx.omni.amount)
    }

    if (utxoTx.dustSize) {
        tx.dustSize = convert2Number(utxoTx.dustSize)
    }
    return tx
}
