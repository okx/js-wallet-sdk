import {DerivePriKeyParams} from "../common";
import {base, bip39, signUtil} from "@okxweb3/crypto-lib";

export function ed25519SignTest(privateKey: Buffer) {
    const msgHash = base.sha256("ed25519-test");
    const publicKey = signUtil.ed25519.publicKeyCreate(privateKey)
    const signature = signUtil.ed25519.sign(msgHash, privateKey);
    return signUtil.ed25519.verify(msgHash, signature, publicKey);
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
        const randBytes = base.randomBytes(32)
        if (signUtil.ed25519.privateKeyVerify(randBytes)) {
            if (ed25519SignTest(randBytes)) {
                const publicKey = signUtil.ed25519.publicKeyCreate(randBytes)
                const privateKey: Uint8Array = concatPub ? base.concatBytes(randBytes, publicKey) : randBytes
                return encode === "base58" ? base.toBase58(privateKey) : base.toHex(privateKey)
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
    const I = base.hmacSHA512("ed25519 seed", seed);
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
    const I = base.hmacSHA512(chainCode, data)
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

/**
 * ed25519 Gets the derived private key
 *
 * @param param mnemonic mnemonic hdPath derived address (bip39)
 * @param concatPub - whether to add 32bytes public key (e.g. solana private key is 64bytes)
 * @param encode - private key encoding format, supporting hex and base58. For example, solana requires a base58 encoded private key
 * @returns string - Private key
 */
export async function ed25519_getDerivedPrivateKey(param: DerivePriKeyParams, concatPub: boolean, encode: 'hex' | 'base58'): Promise<string> {
    const seed = await bip39.mnemonicToSeed(param.mnemonic);
    const derivedSeed = derivePath(param.hdPath, seed).key;
    const publicKey = signUtil.ed25519.publicKeyCreate(derivedSeed);
    const privateKey = concatPub ? base.concatBytes(derivedSeed, publicKey) : derivedSeed;
    return encode === 'base58' ? Promise.resolve(base.toBase58(privateKey)) : Promise.resolve(base.toHex(privateKey));
}