// Wallet-level identity primitives - PRD OLI-0002.
// DO NOT import from @okxweb3/coin-ethereum (or any @okxweb3/coin-<name> package).
// @okxweb3/coin-base is the root of the chain-package DAG; a back-edge here is a
// cycle. EIP-191 is reimplemented inline using base.keccak256 +
// signUtil.secp256k1.sign. See PRD OLI-0002 "Architectural constraints" (AC-19).

import { bip39, bip32, signUtil } from '@okxweb3/crypto-lib';
import { keccak256 } from './base/hash';
import { fromHex } from './base/hex';
import { isHexString } from './base/helper';
import { PassphraseNotSupportedError } from './error';

export const WALLET_IDENTITY_PATH = "m/2013'/5197400'/0'/0/0";

export interface WalletPubKeyItem {
    mnemonic: string;
    passphrase?: string;
    label?: string;
}

export interface WalletPubKeyResult {
    pubKey: string;
    label?: string;
}

export interface WalletSignItem {
    mnemonic: string;
    message: string;
    passphrase?: string;
    label?: string;
}

export interface WalletSignResult {
    signature: string;
    label?: string;
}

function resolveMessageBytes(message: string): Buffer {
    return isHexString(message)
        ? fromHex(message)
        : Buffer.from(message, 'utf8');
}

function eip191Digest(msgBytes: Buffer): Buffer {
    // EIP-191 prefix - the leading 0x19 is the EIP-191 version byte, mandated
    // by the standard and present in the reference (coin-ethereum
    // hashPersonalMessage: "Ethereum Signed Message:\n<len>").
    const prefix = Buffer.from(
        `\x19Ethereum Signed Message:\n${msgBytes.length}`,
        'utf8'
    );
    return keccak256(Buffer.concat([prefix, msgBytes]));
}

function encodeSignature(signature: Uint8Array, recovery: number): string {
    const r = Buffer.from(signature.slice(0, 32)).toString('hex');
    const s = Buffer.from(signature.slice(32, 64)).toString('hex');
    const v = ((recovery + 27) & 0xff).toString(16).padStart(2, '0');
    return '0x' + r + s + v;
}

async function derivePrivateKey(
    mnemonic: string,
    passphrase?: string
): Promise<Buffer> {
    // BIP-39 passphrases are not supported yet — Go and JS SDKs diverge on
    // NFKD normalization for non-ASCII passphrases, so cross-SDK byte-equality
    // cannot be guaranteed. Empty string and undefined are treated identically
    // (both mean "no passphrase").
    if (passphrase !== undefined && passphrase !== '') {
        return Promise.reject(PassphraseNotSupportedError);
    }
    const seed = await bip39.mnemonicToSeedV2(mnemonic, passphrase);
    const node = bip32.fromSeedV2(seed, WALLET_IDENTITY_PATH);
    if (!node.privateKey) {
        throw new Error('wallet-identity: derivation produced no private key');
    }
    return Buffer.from(node.privateKey);
}

export async function generateWalletPublicKey(
    mnemonic: string,
    passphrase?: string
): Promise<string> {
    const priv = await derivePrivateKey(mnemonic, passphrase);
    const pub = signUtil.secp256k1.publicKeyCreate(priv, false);
    return '0x' + Buffer.from(pub).toString('hex');
}

export async function signWalletMessage(
    mnemonic: string,
    message: string,
    passphrase?: string
): Promise<string> {
    const priv = await derivePrivateKey(mnemonic, passphrase);
    const msgBytes = resolveMessageBytes(message);
    const digest = eip191Digest(msgBytes);
    const { signature, recovery } = signUtil.secp256k1.sign(digest, priv, true);
    return encodeSignature(signature, recovery);
}

export async function generateWalletPublicKeys(
    items: WalletPubKeyItem[]
): Promise<WalletPubKeyResult[]> {
    const results: WalletPubKeyResult[] = [];
    for (const it of items) {
        const pubKey = await generateWalletPublicKey(
            it.mnemonic,
            it.passphrase
        );
        results.push(
            it.label !== undefined ? { pubKey, label: it.label } : { pubKey }
        );
    }
    return results;
}

export async function signWalletMessages(
    items: WalletSignItem[]
): Promise<WalletSignResult[]> {
    const results: WalletSignResult[] = [];
    for (const it of items) {
        const signature = await signWalletMessage(
            it.mnemonic,
            it.message,
            it.passphrase
        );
        results.push(
            it.label !== undefined
                ? { signature, label: it.label }
                : { signature }
        );
    }
    return results;
}
