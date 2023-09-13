import * as elliptic from "../elliptic"
const ec = new elliptic.ec('secp256k1')
import { toHex } from '../base';

import BN from "bn.js"

export type SignatureWithRecovery = {
    signature: Uint8Array
    recovery: number
}

export function  sign (message: Buffer, seckey: Buffer | Uint8Array, canonical: boolean = true): SignatureWithRecovery {
    const sig = ec.sign(Array.from(message), Buffer.from(seckey), { canonical: canonical })
    return { signature: sig.toBytes(), recovery: sig.recoveryParam }
}

export function getV(message: Buffer, r: string, s: string, pubkey: Buffer, canonical: boolean = true): number {
    const p = loadPublicKey(pubkey)
    if(p == null) {
        throw new Error('pubkey error');
    }
    const point = ec.keyPair({ pub: { x: p.x, y: p.y } }).getPublic()
    return ec.getKeyRecoveryParam(message, {r: r, s: s}, point, canonical)
}

export function verify(message: Buffer | Uint8Array, signature: Buffer | Uint8Array, recovery: number, publicKey: Buffer | Uint8Array): boolean {
    const r = recover(signature, recovery, message, true)
    if(r == null) {
        return false;
    }
    const p = publicKeyConvert(publicKey, true)
    if(p == null) {
        return false;
    }
    return r.equals(p)
}

export function verifyWithNoRecovery(message: Buffer | Uint8Array, signature: Buffer | Uint8Array, publicKey: Buffer | Uint8Array): boolean {
    const p = loadPublicKey(publicKey)
    if(p == null) {
        throw new Error('pubkey error');
    }
    const kp = ec.keyPair({ pub: { x: p.x, y: p.y } })
    const sigObj = { r: toHex(signature.slice(0, 32)), s: toHex(signature.slice(32, 64)) }
    return kp.verify(message, sigObj)
}

export function recover (sig: Buffer | Uint8Array, recid: number, msg32: Buffer | Uint8Array, compress: boolean) {
    const sigObj = { r: Array.from(sig.slice(0, 32)), s: Array.from(sig.slice(32, 64)) }

    const sigr = new BN(sigObj.r)
    const sigs = new BN(sigObj.s)
    if (sigr.cmp(ec.curve.n) >= 0 || sigs.cmp(ec.curve.n) >= 0) return null

    if (sigr.isZero() || sigs.isZero()) return null

    // Can throw `throw new Error('Unable to find sencond key candinate');`
    let point
    try {
        point = ec.recoverPubKey(Array.from(msg32), sigObj, recid, null)
    } catch (err) {
        return null
    }
    return Buffer.from(point.encode(null, compress))
}

export function loadPublicKey (pubKey: Buffer | Uint8Array) {
    const pk = Buffer.from(pubKey)
    // length should be validated in interface
    const first = pk[0]
    switch (first) {
        case 0x02:
        case 0x03:
            if (pk.length !== 33) return null
            return loadCompressedPublicKey(first, pk.subarray(1, 33))
        case 0x04:
        case 0x06:
        case 0x07:
            if (pk.length !== 65) return null
            return loadUncompressedPublicKey(first, pk.subarray(1, 33), pk.subarray(33, 65))
        default:
            return null
    }
}

export function privateKeyVerify (seckey: Buffer | Uint8Array) {
    const bn = new BN(Array.from(seckey))
    return bn.cmp(ec.curve.n) < 0 && !bn.isZero()
}

export function  publicKeyVerify (pubkey: Buffer | Uint8Array) {
    const pair = loadPublicKey(pubkey)
    return pair !== null
}

export function  publicKeyCreate (seckey: Buffer | Uint8Array, compress: boolean) {
    const point = ec.keyFromPrivate(Array.from(seckey), "bytes").getPublic()
    return Buffer.from(point.encode(null, compress))
}

export function publicKeyConvert (pubkey: Buffer | Uint8Array, compress: boolean) {
    const p = loadPublicKey(pubkey)
    if(p == null) {
        return null
    }
    const point = ec.keyPair({ pub: { x: p.x, y: p.y } }).getPublic()
    return Buffer.from(point.encode(null, compress))
}

export function loadCompressedPublicKey (first: number, xbuf: Buffer | Uint8Array): {x: BN, y: BN} | null {
    let x = new BN(Array.from(xbuf))

    // overflow
    if (x.cmp(ec.curve.p) >= 0) return null
    const xx = x.toRed(ec.curve.red)

    // compute corresponding Y
    let y = xx.redSqr().redIMul(xx).redIAdd(ec.curve.b).redSqrt()
    if ((first === 0x03) !== y.isOdd()) y = y.redNeg()

    return {x: xx, y: y}
}

export function loadUncompressedPublicKey (first: number, xbuf: Buffer | Uint8Array, ybuf: Buffer | Uint8Array): {x: BN, y: BN} | null {
    let x = new BN(Array.from(xbuf))
    let y = new BN(Array.from(ybuf))

    // overflow
    if (x.cmp(ec.curve.p) >= 0 || y.cmp(ec.curve.p) >= 0) return null

    const xx = x.toRed(ec.curve.red)
    const yy = y.toRed(ec.curve.red)

    // is odd flag
    if ((first === 0x06 || first === 0x07) && yy.isOdd() !== (first === 0x07)) return null

    // x*x*x + b = y*y
    const x3 = xx.redSqr().redIMul(xx)
    if (!yy.redSqr().redISub(x3.redIAdd(ec.curve.b)).isZero()) return null

    return {x: xx, y: yy}
}