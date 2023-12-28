import {base, signUtil} from "@okxweb3/crypto-lib"
import {privateKeyFromWIF} from './txBuild';
import {Network} from './bitcoinjs-lib';

const MAGIC_BYTES = Buffer.from('Bitcoin Signed Message:\n');

function varintBufNum(n: number) {
    let buf;
    if (n < 253) {
        buf = Buffer.alloc(1);
        buf.writeUInt8(n, 0);
    } else if (n < 0x10000) {
        buf = Buffer.alloc(1 + 2);
        buf.writeUInt8(253, 0);
        buf.writeUInt16LE(n, 1);
    } else if (n < 0x100000000) {
        buf = Buffer.alloc(1 + 4);
        buf.writeUInt8(254, 0);
        buf.writeUInt32LE(n, 1);
    } else {
        buf = Buffer.alloc(1 + 8);
        buf.writeUInt8(255, 0);
        buf.writeInt32LE(n & -1, 1);
        buf.writeUInt32LE(Math.floor(n / 0x100000000), 5);
    }
    return buf;
}

function magicHash(message: string) {
    const prefix1 = varintBufNum(MAGIC_BYTES.length);
    const messageBuffer = Buffer.from(message);
    const prefix2 = varintBufNum(messageBuffer.length);
    const buf = Buffer.concat([prefix1, MAGIC_BYTES, prefix2, messageBuffer]);
    return base.doubleSha256(buf);
}

function toCompact(i: number, signature: Uint8Array, compressed: boolean) {
    if (!(i === 0 || i === 1 || i === 2 || i === 3)) {
        throw new Error('i must be equal to 0, 1, 2, or 3');
    }

    let val = i + 27 + 4;
    if (!compressed) {
        val = val - 4;
    }
    return Buffer.concat([Uint8Array.of(val), Uint8Array.from(signature)]);
};

export function sign(wifPrivate: string, message: string, network?: Network | Network[]): string {
    const hash = magicHash(message);
    if (!wifPrivate) {
        return base.toHex(hash);
    }
    const privateKey = base.fromHex(privateKeyFromWIF(wifPrivate, network));
    const {signature, recovery} = signUtil.secp256k1.sign(Buffer.from(hash), privateKey)
    return base.toBase64(toCompact(recovery, signature, true))
}

export function verify(publicKey: string, message: string, sig: string): boolean {
    const hash = magicHash(message);
    const sigBytes = base.fromBase64(sig);
    const v = sigBytes[0] - 27 - 4;
    const rs = sigBytes.slice(1);
    return signUtil.secp256k1.verify(Buffer.from(hash), rs, v, base.fromHex(publicKey));
}

export function getMPCSignedMessage(hash: string, sig: string, publicKey: string) {
    const signature = base.fromHex(sig);
    const r = signature.slice(0, 32);
    const s = signature.slice(32, 64);
    const recovery = signUtil.secp256k1.getV(base.fromHex(hash), base.toHex(r), base.toHex(s), base.fromHex(publicKey));

    return base.toBase64(toCompact(recovery, signature, true));
}
