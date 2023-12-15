import {
    CalcTxHashParams,
    DerivePriKeyParams,
    GetDerivedPathParam,
    NewAddressData,
    NewAddressParams,
    SignTxParams,
    ValidAddressData,
    ValidAddressParams,
    ValidPrivateKeyData,
    ValidPrivateKeyParams,
    GetAddressParams,
    MpcRawTransactionData,
    MpcRawTransactionParam,
    MpcTransactionParam,
    VerifyMessageParams,
    TypedMessage,
    ValidSignedTransactionParams,
    MpcMessageParam,
    BaseWallet,
    segwitType,
    secp256k1SignTest,
    cloneObject,
    convert2Number,
    jsonStringifyUniform,
    CalcTxHashError,
    DerivePathError,
    EstimateFeeError,
    GenPrivateKeyError,
    GetHardwareRawTransactionError,
    GetMpcRawTransactionError,
    GetMpcTransactionError,
    NewAddressError,
    SignMsgError,
    SignTxError,
    validSignedTransactionError
} from '@okxweb3/coin-base';
import {base, bip32, bip39} from '@okxweb3/crypto-lib';
import * as bitcoin from "./index"

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
        } else if (type === 11) {
            return Promise.resolve(bitcoin.inscribeForMPCUnsigned(param.data, this.network()));
        } else if (type === 12) {
            return Promise.resolve(bitcoin.inscribeForMPCSigned(param.data, this.network()));
        } else if (type === 2) { // psbt
            try {
                return Promise.resolve(bitcoin.psbtSign(param.data.psbt, param.privateKey, this.network()));
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

export class UsdtWallet extends BtcWallet {
    async signTransaction(param: SignTxParams): Promise<any> {
        let txHex = null;
        try {
            const privateKey = param.privateKey;
            const utxoTx = convert2UtxoTx(param.data);
            if (!utxoTx.omni) {
                return Promise.reject(SignTxError);
            }

            const coinType = number2Hex(utxoTx.omni.coinType || 31, 8)
            const amount = number2Hex(utxoTx.omni.amount, 16)

            // construct omni script, manually add output
            // OP_RETURN(0x6a) + length(0x14) + ASCII(‘omni’) + version + tx type + 0000001f(31 represents USDT) + 000000174876e800(usdt transfer amount)
            // OP_RETURN 6f6d6e69000000000000001f000000003b9aca00
            const script = "6a146f6d6e69" + "0000" + "0000" + coinType + amount
            const extraOutput = {address: "", amount: 0, omniScript: script}
            utxoTx.outputs.push(extraOutput as never)

            txHex = bitcoin.signBtc(utxoTx, privateKey, this.network());
            return Promise.resolve(txHex);
        } catch (e) {
            return Promise.reject(SignTxError);
        }
    }

    async estimateFee(param: SignTxParams): Promise<number> {
        try {
            const utxoTx = convert2UtxoTx(param.data);
            if (!utxoTx.omni) {
                return Promise.reject(EstimateFeeError);
            }

            const coinType = number2Hex(utxoTx.omni.coinType || 31, 8)
            const amount = number2Hex(utxoTx.omni.amount, 16)

            // construct omni script, manually add output
            // OP_RETURN(0x6a) + length(0x14) + ASCII(‘omni’) + version + tx type + 0000001f(31 represents USDT) + 000000174876e800(usdt transfer amount)
            // OP_RETURN 6f6d6e69000000000000001f000000003b9aca00
            const script = "6a146f6d6e69" + "0000" + "0000" + coinType + amount
            const extraOutput = {address: "", amount: 0, omniScript: script}
            utxoTx.outputs.push(extraOutput as never)

            const fee = bitcoin.estimateBtcFee(utxoTx, this.network());
            return Promise.resolve(fee);
        } catch (e) {
            return Promise.reject(EstimateFeeError);
        }
    }

    getHardWareRawTransaction(param: SignTxParams): Promise<any> {
        try {
            const type = param.data.type || 0;
            const utxoTx = convert2UtxoTx(param.data);
            if (!utxoTx.omni) {
                return Promise.reject(SignTxError);
            }

            const coinType = number2Hex(utxoTx.omni.coinType || 31, 8)
            const amount = number2Hex(utxoTx.omni.amount, 16)

            // construct omni script, manually add output
            // OP_RETURN(0x6a) + length(0x14) + ASCII(‘omni’) + version + tx type + 0000001f(31 represents USDT) + 000000174876e800(usdt transfer amount)
            // OP_RETURN 6f6d6e69000000000000001f000000003b9aca00
            const script = "6a146f6d6e69" + "0000" + "0000" + coinType + amount
            const extraOutput = {address: "", amount: 0, omniScript: script}
            utxoTx.outputs.push(extraOutput as never)

            let txHex: string
            if (type === 2) { // psbt
                const change = bitcoin.signBtc(utxoTx, "", this.network(), undefined, true, true);
                const changeUtxo = {
                    address: utxoTx.address,
                    amount: parseInt(change),
                    bip32Derivation: utxoTx.bip32Derivation
                } as bitcoin.utxoOutput
                utxoTx.outputs.push(changeUtxo as never)
                txHex = bitcoin.buildPsbt(utxoTx, this.network());
            } else {
                txHex = bitcoin.signBtc(utxoTx, "", this.network(), undefined, true);
            }
            return Promise.resolve(txHex);
        } catch (e) {
            return Promise.reject(GetHardwareRawTransactionError);
        }
    }
}

export class UsdtTestWallet extends UsdtWallet {
    network() {
        return bitcoin.networks.testnet;
    }
}

export const litecoin: bitcoin.Network = {
    messagePrefix: '\x19Litecoin Signed Message:\n',
    bech32: 'ltc',
    bip32: {
        public: 0x019da462,
        private: 0x019d9cfe,
    },
    pubKeyHash: 0x30,
    scriptHash: 0x32,
    wif: 0xb0,
};

export class LtcWallet extends BtcWallet {
    network() {
        return litecoin;
    }

    async getDerivedPath(param: GetDerivedPathParam): Promise<any> {
        if (!param.segwitType) {
            // normal address
            return `m/44'/2'/0'/0/${param.index}`;
        }

        if (param.segwitType == segwitType.SEGWIT_NESTED) {
            return `m/84'/2'/0'/0/${param.index}`;
        } else if (param.segwitType == segwitType.SEGWIT_NESTED_49) {
            return `m/49'/2'/0'/0/${param.index}`;
        } else if (param.segwitType == segwitType.SEGWIT_NATIVE) {
            return `m/84'/2'/0'/0/${param.index}`;
        } else {
            return Promise.reject(DerivePathError);
        }
    }
}

export class BchWallet extends BtcWallet {
    async getDerivedPath(param: GetDerivedPathParam): Promise<any> {
        return `m/44'/145'/0'/0/${param.index}`;
    }

    async getNewAddress(param: NewAddressParams): Promise<any> {
        try {
            let network = this.network();
            let privateKey = param.privateKey;
            const publicKey = bitcoin.wif2Public(privateKey, network);

            const address = bitcoin.GetBitcashP2PkHAddressByPublicKey(publicKey)
            const addressWithoutPrefix = address.replace("bitcoincash:", "")

            let data: NewAddressData = {
                address: addressWithoutPrefix || "",
                publicKey: base.toHex(publicKey)
            };
            return Promise.resolve(data);
        } catch (e) {
            return Promise.reject(NewAddressError);
        }
    }

    async validAddress(param: ValidAddressParams): Promise<any> {
        let isValid = false;
        try {
            let network = this.network();
            let outputScript = bitcoin.address.toOutputScript(param.address, network);
            if (outputScript) {
                isValid = true;
            }
        } catch (e) {
        }

        if (!isValid) {
            isValid = bitcoin.ValidateBitcashP2PkHAddress(param.address)
        }

        let data: ValidAddressData = {
            isValid: isValid,
            address: param.address
        };
        return Promise.resolve(data);
    }

    async signTransaction(param: SignTxParams): Promise<any> {
        let txHex = null;
        try {
            const privateKey = param.privateKey;
            const utxoTx = convert2UtxoTx(param.data);

            // convert to legacy address for compatibility
            utxoTx.outputs.forEach((it: any) => {
                if (bitcoin.isCashAddress(it.address)) {
                    it.address = bitcoin.convert2LegacyAddress(it.address, this.network())
                }
            })

            if (bitcoin.isCashAddress(utxoTx.address)) {
                utxoTx.address = bitcoin.convert2LegacyAddress(utxoTx.address, this.network())
            }

            txHex = bitcoin.signBch(utxoTx, privateKey, this.network());
            return Promise.resolve(txHex);
        } catch (e) {
            return Promise.reject(SignTxError);
        }
    }

    async estimateFee(param: SignTxParams): Promise<number> {
        try {
            const utxoTx = convert2UtxoTx(param.data);
            // convert to legacy address for compatibility
            utxoTx.outputs.forEach((it: any) => {
                if (bitcoin.isCashAddress(it.address)) {
                    it.address = bitcoin.convert2LegacyAddress(it.address, this.network())
                }
            })

            if (bitcoin.isCashAddress(utxoTx.address)) {
                utxoTx.address = bitcoin.convert2LegacyAddress(utxoTx.address, this.network())
            }

            const fee = bitcoin.estimateBchFee(utxoTx, this.network());
            return Promise.resolve(fee);
        } catch (e) {
            return Promise.reject(EstimateFeeError);
        }
    }

    getMPCRawTransaction(param: SignTxParams): Promise<any> {
        try {
            const utxoTx = convert2UtxoTx(param.data);

            // convert to legacy address for compatibility
            utxoTx.outputs.forEach((it: any) => {
                if (bitcoin.isCashAddress(it.address)) {
                    it.address = bitcoin.convert2LegacyAddress(it.address, this.network())
                }
            })

            if (bitcoin.isCashAddress(utxoTx.address)) {
                utxoTx.address = bitcoin.convert2LegacyAddress(utxoTx.address, this.network())
            }
            const hash: string[] = []
            const hex = bitcoin.signBch(utxoTx, "", this.network(), hash);
            const data: MpcRawTransactionData = {
                raw: hex,
                hash: hash
            };
            return Promise.resolve(data);
        } catch (e) {
            return Promise.reject(GetMpcRawTransactionError);
        }
    }

    getAddressByPublicKey(param: GetAddressParams): Promise<string> {
        const publicKey = base.fromHex(param.publicKey);
        const address = bitcoin.GetBitcashP2PkHAddressByPublicKey(publicKey)
        return Promise.resolve(address.replace("bitcoincash:", ""));
    }

    getMPCTransaction(param: MpcTransactionParam): Promise<any> {
        try {
            const hex = bitcoin.getMPCTransaction(param.raw, param.sigs as string[], true);
            return Promise.resolve(hex);
        } catch (e) {
            return Promise.reject(GetMpcTransactionError);
        }
    }

    getHardWareRawTransaction(param: SignTxParams): Promise<any> {
        try {
            const utxoTx = convert2UtxoTx(param.data);

            // convert to legacy address for compatibility
            utxoTx.outputs.forEach((it: any) => {
                if (bitcoin.isCashAddress(it.address)) {
                    it.address = bitcoin.convert2LegacyAddress(it.address, this.network())
                }
            })

            if (bitcoin.isCashAddress(utxoTx.address)) {
                utxoTx.address = bitcoin.convert2LegacyAddress(utxoTx.address, this.network())
            }
            const hex = bitcoin.signBch(utxoTx, "", this.network(), undefined, true);
            return Promise.resolve(hex);
        } catch (e) {
            return Promise.reject(GetHardwareRawTransactionError);
        }
    }
}

export class BsvWallet extends BtcWallet {
    async getDerivedPath(param: GetDerivedPathParam): Promise<any> {
        return `m/44'/236'/0'/0/${param.index}`;
    }

    async signTransaction(param: SignTxParams): Promise<any> {
        let txHex = null;
        try {
            const privateKey = param.privateKey;
            const utxoTx = convert2UtxoTx(param.data);
            txHex = bitcoin.signBch(utxoTx, privateKey, this.network());
            return Promise.resolve(txHex);
        } catch (e) {
            return Promise.reject(SignTxError);
        }
    }

    async estimateFee(param: SignTxParams): Promise<number> {
        try {
            const utxoTx = convert2UtxoTx(param.data);
            const fee = bitcoin.estimateBchFee(utxoTx, this.network());
            return Promise.resolve(fee);
        } catch (e) {
            return Promise.reject(EstimateFeeError);
        }
    }

    getMPCRawTransaction(param: SignTxParams): Promise<any> {
        try {
            const utxoTx = convert2UtxoTx(param.data);
            const hash: string[] = []
            const hex = bitcoin.signBch(utxoTx, "", this.network(), hash);
            const data: MpcRawTransactionData = {
                raw: hex,
                hash: hash
            };
            return Promise.resolve(data);
        } catch (e) {
            return Promise.reject(GetMpcRawTransactionError);
        }
    }

    getMPCTransaction(param: MpcTransactionParam): Promise<any> {
        try {
            const hex = bitcoin.getMPCTransaction(param.raw, param.sigs as string[], true);
            return Promise.resolve(hex);
        } catch (e) {
            return Promise.reject(GetMpcTransactionError);
        }
    }

    getHardWareRawTransaction(param: SignTxParams): Promise<any> {
        try {
            const utxoTx = convert2UtxoTx(param.data);
            const hex = bitcoin.signBch(utxoTx, "", this.network(), undefined, true);
            return Promise.resolve(hex);
        } catch (e) {
            return Promise.reject(GetHardwareRawTransactionError);
        }
    }
}

export const dogeCoin: bitcoin.Network = {
    messagePrefix: '\x18Dogecoin Signed Message:\n',
    // doge not support native segwit
    bech32: 'bc',
    bip32: {
        public: 49990397,
        private: 49988504,
    },
    pubKeyHash: 30,
    scriptHash: 22,
    wif: 158,
};

export class DogeWallet extends BtcWallet {
    network() {
        return dogeCoin
    }
}
