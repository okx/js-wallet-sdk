// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {btc} from '../common';
import {CatAddressType,} from '../common';
import {hash160} from 'scrypt-ts';
import {toXOnly} from "./utils";

export class EcKeyService {
    private readonly privateKey: btc.PrivateKey;
    private readonly publicKey: btc.PublicKey;
    private readonly addressType: CatAddressType;

    constructor(
        opts: {
            privateKey?: string,
            publicKey?: string,
            addressType?: CatAddressType,
        }
    ) {
        this.addressType = opts.addressType || CatAddressType.P2TR;
        if (!opts.privateKey && !opts.publicKey) {
            throw new Error('Either privateKey or publicKey must be provided');
        }
        this.privateKey = opts.privateKey ? btc.PrivateKey.fromWIF(opts.privateKey) : undefined
        this.publicKey = opts.privateKey ? this.privateKey.toPublicKey() : btc.PublicKey.fromString(opts.publicKey);
    }

    hasPrivateKey(): boolean {
        return this.privateKey !== undefined;
    }


    getWif(): string {
        return this.getPrivateKey().toWIF();
    }

    getPrivateKey(): btc.PrivateKey {
        return this.privateKey
    }

    getAddressType(): CatAddressType {
        return this.addressType || CatAddressType.P2TR;
    };

    getP2TRAddress(): btc.Address {
        return this.getPublicKey().toAddress(null, btc.Address.PayToTaproot);
    }

    getAddress(): btc.Address {
        return this.getP2TRAddress();
    }

    getXOnlyPublicKey(): string {
        const pubkey = this.getTokenPublicKey();
        return toXOnly(pubkey.toBuffer()).toString('hex');
    }

    getTweakedPrivateKey(): btc.PrivateKey {
        const {tweakedPrivKey} = this.getPrivateKey().createTapTweak();
        return btc.PrivateKey.fromBuffer(tweakedPrivKey);
    }
    getPublicKey(): btc.PublicKey {
        return this.publicKey
    }

    getTokenPublicKey(): btc.PublicKey {
        const addressType = this.getAddressType();

        if (addressType === CatAddressType.P2TR) {
            const { tweakedPubKey } = this.publicKey.createTapTweak();
            return btc.PublicKey.fromBuffer(tweakedPubKey);
        }
        return this.publicKey
    }


    getPubKeyPrefix(): string {
        const addressType = this.getAddressType();
        if (addressType === CatAddressType.P2TR) {
            return '';
        } else if (addressType === CatAddressType.P2WPKH) {
            const pubkey = this.getTokenPublicKey();
            return pubkey.toString().slice(0, 2);
        }
        return ''
    }

    getTokenAddress(): string {
        const addressType = this.getAddressType();

        if (addressType === CatAddressType.P2TR) {
            const xpubkey = this.getXOnlyPublicKey();
            return hash160(xpubkey);
        } else if (addressType === CatAddressType.P2WPKH) {
            const pubkey = this.getTokenPublicKey();
            return hash160(pubkey.toString());
        } else {
            throw new Error(`Unsupported address type: ${addressType}`);
        }
    }

    getTaprootPrivateKey(): btc.PrivateKey {
        return this.getTweakedPrivateKey();
    }

    getTokenPrivateKey(): btc.PrivateKey {
        const addressType = this.getAddressType();

        if (addressType === CatAddressType.P2TR) {
            return this.getTaprootPrivateKey();
        } else if (addressType === CatAddressType.P2WPKH) {
            return this.getPrivateKey();
        } else {
            throw new Error(`Unsupported address type: ${addressType}`);
        }
    }

    signTx(tx: btc.Transaction) {
        if (!this.hasPrivateKey()) {
            throw new Error('No private key provided');
        }
        // unlock fee inputs

        const privateKey = this.getPrivateKey();
        const hashData = btc.crypto.Hash.sha256ripemd160(
            privateKey.publicKey.toBuffer(),
        );

        for (let i = 0; i < tx.inputs.length; i++) {
            const input = tx.inputs[i];

            if (input.output.script.isWitnessPublicKeyHashOut()) {
                const signatures = input.getSignatures(
                    tx,
                    privateKey,
                    i,
                    undefined,
                    hashData,
                    undefined,
                    undefined,
                );
                if (signatures.length === 0) {
                    throw new Error('Could not sign input');
                }

                tx.applySignature(signatures[0]);
            } else if (input.output.script.isTaproot() && !input.hasWitnesses()) {
                const signatures = input.getSignatures(
                    tx,
                    privateKey,
                    i,
                    btc.crypto.Signature.SIGHASH_ALL,
                    hashData,
                    undefined,
                    undefined,
                );
                if (signatures.length === 0) {
                    throw new Error('Could not sign input');
                }
                tx.applySignature(signatures[0]);
            }
        }
    }
}
