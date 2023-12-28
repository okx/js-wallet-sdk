import {signUtil} from "@okxweb3/crypto-lib";

const secp256k1 = signUtil.schnorr.secp256k1
const schnorr = secp256k1.schnorr
const ProjPoint = secp256k1.secp256k1.ProjectivePoint
const CURVE_ORDER = secp256k1.secp256k1.CURVE.n;

function tapTweak(a: Uint8Array, b: Uint8Array): bigint {
    const u = schnorr.utils;
    const t = u.taggedHash('TapTweak', a, b);
    const tn = u.bytesToNumberBE(t);
    if (tn >= CURVE_ORDER) throw new Error('tweak higher than curve order');
    return tn;
}

export function taprootTweakPrivKey(privKey: Uint8Array, merkleRoot = new Uint8Array()) {
    const u = schnorr.utils;
    const seckey0 = u.bytesToNumberBE(privKey); // seckey0 = int_from_bytes(seckey0)
    const P = ProjPoint.fromPrivateKey(seckey0); // P = point_mul(G, seckey0)
    // seckey = seckey0 if has_even_y(P) else SECP256K1_ORDER - seckey0
    const seckey = P.hasEvenY() ? seckey0 : u.mod(-seckey0, CURVE_ORDER);
    const xP = u.pointToBytes(P);
    // t = int_from_bytes(tagged_hash("TapTweak", bytes_from_int(x(P)) + h)); >= SECP256K1_ORDER check
    const t = tapTweak(xP, merkleRoot);
    // bytes_from_int((seckey + t) % SECP256K1_ORDER)
    return u.numberToBytesBE(u.mod(seckey + t, CURVE_ORDER), 32);
}

export function taprootTweakPubkey(pubKey: Uint8Array, h?: Uint8Array): [Uint8Array, number] {
    if (!h) h = new Uint8Array();
    const u = schnorr.utils;
    const t = tapTweak(pubKey, h); // t = int_from_bytes(tagged_hash("TapTweak", pubkey + h))
    const P = u.lift_x(u.bytesToNumberBE(pubKey)); // P = lift_x(int_from_bytes(pubkey))
    const Q = P.add(ProjPoint.fromPrivateKey(t)); // Q = point_add(P, point_mul(G, t))
    const parity = Q.hasEvenY() ? 0 : 1; // 0 if has_even_y(Q) else 1
    return [u.pointToBytes(Q), parity]; // bytes_from_int(x(Q))
}
