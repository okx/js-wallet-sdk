import {Ed25519Keypair} from "./cryptography/ed25519-keypair";

export * from './cryptography/ed25519-keypair';
export * from './cryptography/keypair';
export * from './cryptography/ed25519-publickey';
export * from './cryptography/publickey';
export * from './cryptography/signature';


export * from './signers/txn-data-serializers/type-tag-serializer';

export * from './signers/signer';
export * from './signers/raw-signer';
export * from './signers/types';

export * from './types';
export * from './utils/format';
export * from './utils/intent';

export * from './framework';

export * from './builder';

export {fromB64, toB64} from './bcs';

export {is, assert} from 'superstruct';


import {base} from '@okxweb3/crypto-lib';
import {Ed25519PublicKey} from "./cryptography/ed25519-publickey";
import {SIGNATURE_FLAG_TO_SCHEME, SIGNATURE_SCHEME_TO_FLAG, SignatureScheme} from "./cryptography/signature";
import {LEGACY_PRIVATE_KEY_SIZE, PRIVATE_KEY_SIZE} from "./cryptography/keypair";
import {SUI_PRIVATE_KEY_PREFIX} from "./SuiWallet";

export * from "./signers/raw-signer"
export * from "./signers/signer-with-provider"
export * from "./types"
export * from "./SuiWallet"

export function getAddressFromPrivate(privateKey: string) {
    if (!base.validateHexString(privateKey)) {
        throw new Error('invalid key');
    }
    const pk = base.fromHex(privateKey.toLowerCase())
    const kp = Ed25519Keypair.fromSeed(pk)
    return {address: kp.getPublicKey().toSuiAddress(), publicKey: base.toBase64(kp.getPublicKey().toBytes())}
}

export function getAddressFromPublic(publicKey: string) {
    const pk = base.fromBase64(publicKey)
    const p = new Ed25519PublicKey(pk)
    return p.toSuiAddress()
}

/**
 * This returns a Bech32 encoded string starting with `suiprivkey`,
 * encoding 33-byte `flag || bytes` for the given the 32-byte private
 * key and its signature scheme.
 */
export function encodeSuiPrivateKey(prv: string): string {
    if (prv == undefined || null || prv.length == 0) {
        throw new Error('Invalid bytes length');
    }
    if (prv.startsWith(SUI_PRIVATE_KEY_PREFIX)) {
        // check bech32 string
        const [prefix, words] = base.fromBech32(prv);
        if (prefix !== SUI_PRIVATE_KEY_PREFIX) {
            throw new Error('invalid private key prefix');
        }
        if (words[0] != 0x00) {
            throw new Error('invalid private key prefix');
        }
        if (words.length !== PRIVATE_KEY_SIZE + 1) {
            throw new Error('invalid key');
        }
        return prv
    }

    if (!base.validateHexString(prv)) {
        throw new Error('invalid key');
    }
    let bytes = base.fromHex(prv.toLowerCase())
    if (bytes.length !== PRIVATE_KEY_SIZE) {
        throw new Error('invalid key');
    }
    const privKeyBytes = new Uint8Array(bytes.length + 1);
    privKeyBytes.set([0x00]);
    privKeyBytes.set(bytes, 1);
    return base.toBech32(SUI_PRIVATE_KEY_PREFIX, privKeyBytes);
}


/**
 * This returns an ParsedKeypair object based by validating the
 * 33-byte Bech32 encoded string starting with `suiprivkey`, and
 * parse out the signature scheme and the private key in bytes.
 */
export function tryDecodeSuiPrivateKey(value: string): string {
    if (value == undefined || null || value.length == 0) {
        throw new Error('invalid private key prefix');
    }
    if (!value.startsWith(SUI_PRIVATE_KEY_PREFIX)) {
        // check hex string
        if (!base.validateHexString(value)) {
            throw new Error('invalid key');
        }
        const keyBytes = base.fromHex(value.toLowerCase())
        if (keyBytes.length !== PRIVATE_KEY_SIZE ) {
            throw new Error('invalid key');
        }
        return value
    }
    const [prefix, words] = base.fromBech32(value);
    if (prefix !== SUI_PRIVATE_KEY_PREFIX) {
        throw new Error('invalid private key prefix');
    }
    if (words[0] != 0x00) {
        throw new Error('invalid private key prefix');
    }
    if (words.length !== PRIVATE_KEY_SIZE + 1) {
        throw new Error('invalid key');
    }
    return base.toHex(words.slice(1),true)
}
