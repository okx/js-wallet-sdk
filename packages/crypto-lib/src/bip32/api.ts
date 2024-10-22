import { ec } from "../elliptic"
const secp256k1 = new ec("secp256k1")
const curve = secp256k1.curve
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2011-2018 bitcoinjs-lib contributors
 * */
// Hack, we can not use bn.js@5, while elliptic uses bn.js@4
// See https://github.com/indutny/elliptic/issues/191#issuecomment-569888758
const BN = require("bn.js/lib/bn")

function loadCompressedPublicKey (first: number, xbuf: Uint8Array) {
    let x = new BN(xbuf)

    // overflow
    if (x.cmp(curve.p) >= 0) return null
    x = x.toRed(curve.red)

    // compute corresponding Y
    let y = x.redSqr().redIMul(x).redIAdd(curve.b).redSqrt()
    if ((first === 0x03) !== y.isOdd()) y = y.redNeg()

    // x*x*x + b = y*y
    const x3 = x.redSqr().redIMul(x)
    if (!y.redSqr().redISub(x3.redIAdd(curve.b)).isZero()) return null

    return secp256k1.keyPair({ pub: { x: x, y: y } })
}

function loadUncompressedPublicKey (first: number, xbuf: Uint8Array, ybuf: Uint8Array) {
    let x = new BN(xbuf)
    let y = new BN(ybuf)

    // overflow
    if (x.cmp(curve.p) >= 0 || y.cmp(curve.p) >= 0) return null

    x = x.toRed(curve.red)
    y = y.toRed(curve.red)

    // is odd flag
    if ((first === 0x06 || first === 0x07) && y.isOdd() !== (first === 0x07)) return null

    // x*x*x + b = y*y
    const x3 = x.redSqr().redIMul(x)
    if (!y.redSqr().redISub(x3.redIAdd(curve.b)).isZero()) return null

    return secp256k1.keyPair({ pub: { x: x, y: y } })
}

function loadPublicKey (pubkey: Uint8Array) {
    // length should be validated in interface
    const first = pubkey[0]
    switch (first) {
        case 0x02:
        case 0x03:
            if (pubkey.length !== 33) return null
            return loadCompressedPublicKey(first, pubkey.subarray(1, 33))
        case 0x04:
        case 0x06:
        case 0x07:
            if (pubkey.length !== 65) return null
            return loadUncompressedPublicKey(first, pubkey.subarray(1, 33), pubkey.subarray(33, 65))
        default:
            return null
    }
}

module.exports = {
    contextRandomize () {
        return 0
    },

    privateKeyVerify (seckey: Uint8Array) {
        const bn = new BN(seckey)
        return bn.cmp(curve.n) < 0 && !bn.isZero()
    },

    privateKeyNegate (seckey: Uint8Array) {
        const bn = new BN(seckey)
        return Buffer.from(curve.n.sub(bn).umod(curve.n).toArray('be', 32))
    },

    privateKeyTweakAdd (seckey: Uint8Array, tweak: Uint8Array) {
        const bn = new BN(tweak)
        if (bn.cmp(curve.n) >= 0) return null

        bn.iadd(new BN(seckey))
        if (bn.cmp(curve.n) >= 0) bn.isub(curve.n)
        if (bn.isZero()) return null

        return Buffer.from(bn.toArray('be', 32))
    },

    privateKeyTweakMul (seckey: Uint8Array, tweak: Uint8Array) {
        let bn = new BN(tweak)
        if (bn.cmp(curve.n) >= 0 || bn.isZero()) return 1

        bn.imul(new BN(seckey))
        if (bn.cmp(curve.n) >= 0) bn = bn.umod(curve.n)

        return Buffer.from(bn.toArray('be', 32))
    },

    publicKeyVerify (pubkey: Uint8Array) {
        const pair = loadPublicKey(pubkey)
        if(pair == null) {
            return null
        }
        return pair.validate().result
    },

    publicKeyCreate (seckey: Uint8Array, compress: boolean) {
        const bn = new BN(seckey)
        if (bn.cmp(curve.n) >= 0 || bn.isZero()) return null

        const point = secp256k1.keyFromPrivate(seckey, null).getPublic()
        return Buffer.from(point.encode(null, compress))
    },

    publicKeyConvert (pubKey: Uint8Array, compress: boolean) {
        const pair = loadPublicKey(pubKey)
        const point = pair.getPublic()
        return Buffer.from(point.encode(null, compress))
    },

    publicKeyNegate (pubKey: Uint8Array, compress: boolean) {
        const pair = loadPublicKey(pubKey)
        if (pair === null) return 1

        const point = pair.getPublic()
        point.y = point.y.redNeg()
        return Buffer.from(point.encode(null, compress))
    },

    publicKeyCombine (pubKeys: Uint8Array[], compress: boolean) {
        const pairs = new Array(pubKeys.length)
        for (let i = 0; i < pubKeys.length; ++i) {
            pairs[i] = loadPublicKey(pubKeys[i])
            if (pairs[i] === null) return null
        }

        let point = pairs[0].getPublic()
        for (let i = 1; i < pairs.length; ++i) point = point.add(pairs[i].pub)
        if (point.isInfinity()) return null

        return Buffer.from(point.encode(null, compress))
    },

    publicKeyTweakAdd (pubKeys: Uint8Array, tweak: Uint8Array, compress: boolean) {
        const pair = loadPublicKey(pubKeys)
        if (pair === null) return null

        const t = new BN(tweak)
        if (t.cmp(curve.n) >= 0) return null

        const point = pair.getPublic().add(curve.g.mul(tweak))
        if (point.isInfinity()) return null

        return Buffer.from(point.encode(null, compress))
    },

    publicKeyTweakMul (pubkey: Uint8Array, tweak: Uint8Array, compress: boolean) {
        const pair = loadPublicKey(pubkey)
        if (pair === null) return null

        const t = new BN(tweak)
        if (t.cmp(curve.n) >= 0 || t.isZero()) return null

        const point = pair.getPublic().mul(tweak)
        return Buffer.from(point.encode(null, compress))
    },

    signatureNormalize (sig: Uint8Array) {
        const r = new BN(sig.subarray(0, 32))
        const s = new BN(sig.subarray(32, 64))
        if (r.cmp(curve.n) >= 0 || s.cmp(curve.n) >= 0) return null

        if (s.cmp(secp256k1.nh) === 1) {
            sig.set(curve.n.sub(s).toArrayLike(Uint8Array, 'be', 32), 32)
        }
        return 0
    },

    // Copied 1-to-1 from https://github.com/bitcoinjs/bip66/blob/master/index.js
    // Adapted for Uint8Array instead Buffer
    signatureExport (obj: any, sig: Uint8Array) {
        const sigR = sig.subarray(0, 32)
        const sigS = sig.subarray(32, 64)
        if (new BN(sigR).cmp(curve.n) >= 0) return 1
        if (new BN(sigS).cmp(curve.n) >= 0) return 1

        const { output } = obj

        // Prepare R
        let r = output.subarray(4, 4 + 33)
        r[0] = 0x00
        r.set(sigR, 1)

        let lenR = 33
        let posR = 0
        for (; lenR > 1 && r[posR] === 0x00 && !(r[posR + 1] & 0x80); --lenR, ++posR);

        r = r.subarray(posR)
        if (r[0] & 0x80) return 1
        if (lenR > 1 && (r[0] === 0x00) && !(r[1] & 0x80)) return 1

        // Prepare S
        let s = output.subarray(6 + 33, 6 + 33 + 33)
        s[0] = 0x00
        s.set(sigS, 1)

        let lenS = 33
        let posS = 0
        for (; lenS > 1 && s[posS] === 0x00 && !(s[posS + 1] & 0x80); --lenS, ++posS);

        s = s.subarray(posS)
        if (s[0] & 0x80) return 1
        if (lenS > 1 && (s[0] === 0x00) && !(s[1] & 0x80)) return 1

        // Set output length for return
        obj.outputlen = 6 + lenR + lenS

        // Output in specified format
        // 0x30 [total-length] 0x02 [R-length] [R] 0x02 [S-length] [S]
        output[0] = 0x30
        output[1] = obj.outputlen - 2
        output[2] = 0x02
        output[3] = r.length
        output.set(r, 4)
        output[4 + lenR] = 0x02
        output[5 + lenR] = s.length
        output.set(s, 6 + lenR)

        return 0
    },

    // Copied 1-to-1 from https://github.com/bitcoinjs/bip66/blob/master/index.js
    // Adapted for Uint8Array instead Buffer
    signatureImport (output: any, sig: Uint8Array) {
        if (sig.length < 8) return 1
        if (sig.length > 72) return 1
        if (sig[0] !== 0x30) return 1
        if (sig[1] !== sig.length - 2) return 1
        if (sig[2] !== 0x02) return 1

        const lenR = sig[3]
        if (lenR === 0) return 1
        if (5 + lenR >= sig.length) return 1
        if (sig[4 + lenR] !== 0x02) return 1

        const lenS = sig[5 + lenR]
        if (lenS === 0) return 1
        if ((6 + lenR + lenS) !== sig.length) return 1

        if (sig[4] & 0x80) return 1
        if (lenR > 1 && (sig[4] === 0x00) && !(sig[5] & 0x80)) return 1

        if (sig[lenR + 6] & 0x80) return 1
        if (lenS > 1 && (sig[lenR + 6] === 0x00) && !(sig[lenR + 7] & 0x80)) return 1

        let sigR = sig.subarray(4, 4 + lenR)
        if (sigR.length === 33 && sigR[0] === 0x00) sigR = sigR.subarray(1)
        if (sigR.length > 32) return 1

        let sigS = sig.subarray(6 + lenR)
        if (sigS.length === 33 && sigS[0] === 0x00) sigS = sigS.slice(1)
        if (sigS.length > 32) throw new Error('S length is too long')

        let r = new BN(sigR)
        if (r.cmp(curve.n) >= 0) r = new BN(0)

        let s = new BN(sig.subarray(6 + lenR))
        if (s.cmp(curve.n) >= 0) s = new BN(0)

        output.set(r.toArrayLike(Uint8Array, 'be', 32), 0)
        output.set(s.toArrayLike(Uint8Array, 'be', 32), 32)

        return 0
    },

    ecdsaSign (message: Uint8Array, seckey: Uint8Array) {
        const d = new BN(seckey)
        if (d.cmp(curve.n) >= 0 || d.isZero()) return null
        return secp256k1.sign(message, seckey, { canonical: true }).toBytes()
    },

    ecdsaVerify (sig: Uint8Array, msg32: Uint8Array, pubkey: Uint8Array) {
        const sigObj = { r: sig.subarray(0, 32), s: sig.subarray(32, 64) }

        const sigr = new BN(sigObj.r)
        const sigs = new BN(sigObj.s)
        if (sigr.cmp(curve.n) >= 0 || sigs.cmp(curve.n) >= 0) return 1
        if (sigs.cmp(secp256k1.nh) === 1 || sigr.isZero() || sigs.isZero()) return 3

        const pair = loadPublicKey(pubkey)
        if (pair === null) return 2

        const point = pair.getPublic()
        return secp256k1.verify(msg32, sigObj, point)
    },

    ecdsaRecover (sig: Uint8Array, recid: number, msg32: Uint8Array, compress: boolean) {
        const sigObj = { r: sig.slice(0, 32), s: sig.slice(32, 64) }

        const sigr = new BN(sigObj.r)
        const sigs = new BN(sigObj.s)
        if (sigr.cmp(curve.n) >= 0 || sigs.cmp(curve.n) >= 0) return 1

        if (sigr.isZero() || sigs.isZero()) return 2

        // Can throw `throw new Error('Unable to find sencond key candinate');`
        let point
        try {
            point = secp256k1.recoverPubKey(msg32, sigObj, recid, null)
        } catch (err) {
            return 2
        }
        return Buffer.from(point.encode(null, compress))
    },

    ecdh (output: any, pubKey: Uint8Array, seckey: Uint8Array, data: Uint8Array, hashfn: any, xbuf: Uint8Array, ybuf: Uint8Array) {
        const pair = loadPublicKey(pubKey)
        if (pair === null) return 1

        const scalar = new BN(seckey)
        if (scalar.cmp(curve.n) >= 0 || scalar.isZero()) return 2

        const point = pair.getPublic().mul(scalar)

        if (hashfn === undefined) {
            const data = point.encode(null, true)
            const sha256 = secp256k1.hash().update(data).digest()
            for (let i = 0; i < 32; ++i) output[i] = sha256[i]
        } else {
            if (!xbuf) xbuf = new Uint8Array(32)
            const x = point.getX().toArray('be', 32)
            for (let i = 0; i < 32; ++i) xbuf[i] = x[i]

            if (!ybuf) ybuf = new Uint8Array(32)
            const y = point.getY().toArray('be', 32)
            for (let i = 0; i < 32; ++i) ybuf[i] = y[i]

            const hash = hashfn(xbuf, ybuf, data)

            const isValid = hash instanceof Uint8Array && hash.length === output.length
            if (!isValid) return 2

            output.set(hash)
        }

        return 0
    }
}