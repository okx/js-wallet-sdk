import * as elliptic from "../elliptic";
import {concatBytes, hmacSHA512, randomBytes, sha256, toBase58, toHex} from "../base";
import BN from "bn.js";
import {mnemonicToSeed} from "../bip39";
const ed25519 = new elliptic.eddsa('ed25519');
const curve = ed25519.curve

export function ed25519MulBase(scalar: Uint8Array) {
    const G = ed25519.curve.g;
    return ed25519.encodePoint(G.mul(elliptic.utils.intFromLE(scalar)))
}

export function sign(message: Uint8Array | Buffer, secretKey: Uint8Array | Buffer): Uint8Array {
    let pk = secretKey
    if (pk.length == 64) {
        pk = pk.slice(0, 32)
    }

    const key = ed25519.keyFromSecret(Array.from(pk));
    const signature = key.sign(Array.from(message)).toBytes();
    return Uint8Array.from(signature)
}

// note: publicKey and signature need be converted to an array
export function verify(message: Uint8Array | Buffer, signature: Uint8Array | Buffer, publicKey: Uint8Array | Buffer): boolean {
    const key = ed25519.keyFromPublic(Array.from(publicKey));
    return key.verify(Array.from(message), Array.from(signature))
}

export function publicKeyCreate(secretKey: Uint8Array | Buffer): Uint8Array {
    let pk = secretKey
    if (pk.length == 64) {
        pk = pk.slice(0, 32)
    }

    const key = ed25519.keyFromSecret(Array.from(pk));
    return Uint8Array.from(key.getPublic())
}

export function publicKeyVerify(pubkey: Uint8Array | Buffer) {
    const point = ed25519.decodePoint(Array.from(pubkey))
    return curve.validate(point)
}

export function privateKeyVerify(seckey: Uint8Array | Buffer) {
    const bn = new BN(Array.from(seckey))
    return bn.cmp(curve.n) < 0 && !bn.isZero()
}

// 32bytes
export function fromSeed(seed: Uint8Array | Buffer): { publicKey: Uint8Array, secretKey: Uint8Array } {
    const key = ed25519.keyFromSecret(Array.from(seed));
    const pk = Uint8Array.from(key.getPublic())
    return {publicKey: pk, secretKey: concatBytes(seed, pk)}
}

// 64bytes private key + public key
export function fromSecret(secretKey: Uint8Array | Buffer): { publicKey: Uint8Array, secretKey: Uint8Array } {
    const privateKey = secretKey.slice(0, 32)
    const key = ed25519.keyFromSecret(Array.from(privateKey));
    return {publicKey: Uint8Array.from(key.getPublic()), secretKey: Uint8Array.from(privateKey)}
}


export function ed25519SignTest(privateKey: Buffer) {
    const msgHash = sha256("ed25519-test");
    const publicKey = publicKeyCreate(privateKey)
    const signature = sign(msgHash, privateKey);
    return verify(msgHash, signature, publicKey);
}


/**
 * ed25519 Gets random private key
 *
 * @param concatPub - whether to add 32bytes public key (e.g. solana private key is 64bytes)
 * @param encode - private key encoding format, supporting hex and base58. For example, solana requires a base58 encoded private key
 * @returns string - Private key
 */
export function ed25519_getRandomPrivateKey(concatPub: boolean, encode: "hex" | "base58"): string {
    while (true) {
        const randBytes = randomBytes(32)
        if (privateKeyVerify(randBytes)) {
            if (ed25519SignTest(randBytes)) {
                const publicKey = publicKeyCreate(randBytes)
                const privateKey: Uint8Array = concatPub ? concatBytes(randBytes, publicKey) : randBytes
                return encode === "base58" ? toBase58(privateKey) : toHex(privateKey)
            }
        }
    }
}


const pathRegex = new RegExp("^m(\\/[0-9]+')+$")
const replaceDerive = (val: string): string => val.replace("'", '')
const HARDENED_OFFSET = 0x80000000

type Keys = {
    key: Buffer;
    chainCode: Buffer;
};

function getMasterKeyFromSeed(seed: Buffer) {
    const I = hmacSHA512("ed25519 seed", seed);
    const IL = I.slice(0, 32);
    const IR = I.slice(32);
    return {
        key: IL,
        chainCode: IR,
    };
}

function CKDPriv({key, chainCode}: Keys, index: number): Keys {
    const indexBuffer = Buffer.allocUnsafe(4);
    indexBuffer.writeUInt32BE(index, 0);

    const data = Buffer.concat([Buffer.alloc(1, 0), key, indexBuffer]);
    const I = hmacSHA512(chainCode, data)
    const IL = I.slice(0, 32);
    const IR = I.slice(32);
    return {
        key: IL,
        chainCode: IR,
    };
}

export const isValidPath = (path: string): boolean => {
    if (!pathRegex.test(path)) {
        return false;
    }
    return !path
        .split('/')
        .slice(1)
        .map(replaceDerive)
        .some(isNaN as any /* ts T_T*/);
};

function derivePath(path: string, seed: Buffer, offset = HARDENED_OFFSET): Keys {
    if (!isValidPath(path)) {
        throw new Error('Invalid derivation path');
    }

    const {key, chainCode} = getMasterKeyFromSeed(seed);
    const segments = path
        .split('/')
        .slice(1)
        .map(replaceDerive)
        .map(el => parseInt(el, 10));

    return segments.reduce(
        (parentKeys, segment) => CKDPriv(parentKeys, segment + offset),
        {key, chainCode},
    );
}

export type DerivePriKeyParams = {
    mnemonic: string;
    hdPath: string;
};

/**
 * ed25519 Gets the derived private key
 *
 * @param param mnemonic mnemonic hdPath derived address (bip39)
 * @param concatPub - whether to add 32bytes public key (e.g. solana private key is 64bytes)
 * @param encode - private key encoding format, supporting hex and base58. For example, solana requires a base58 encoded private key
 * @returns string - Private key
 */
export async function ed25519_getDerivedPrivateKey(mnemonic: string, hdPath: string, concatPub: boolean, encode: 'hex' | 'base58'): Promise<string> {
    const seed = await mnemonicToSeed(mnemonic);
    const derivedSeed = derivePath(hdPath, seed).key;
    const publicKey = publicKeyCreate(derivedSeed);
    const privateKey = concatPub ? concatBytes(derivedSeed, publicKey) : derivedSeed;
    return encode === 'base58' ? Promise.resolve(toBase58(privateKey)) : Promise.resolve(toHex(privateKey));
}