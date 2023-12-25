import {base, signUtil} from "@okxweb3/crypto-lib"
import { privateKeyFromWIF } from './txBuild';
import { Network } from './bitcoinjs-lib';

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

function magicHash(message: string, messagePrefix?: string) {
  const messagePrefixBuffer = messagePrefix ? Buffer.from(messagePrefix,"utf8") : MAGIC_BYTES;
  const prefix1 = varintBufNum(messagePrefixBuffer.length);
  const messageBuffer = Buffer.from(message);
  const prefix2 = varintBufNum(messageBuffer.length);
  const buf = Buffer.concat([prefix1, messagePrefixBuffer, prefix2, messageBuffer]);
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
  const { signature, recovery} = signUtil.secp256k1.sign(Buffer.from(hash), privateKey)
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

export function verifyWithAddress(address: string, message: string, sig: string, messagePrefix?: string): boolean {
  const hash = magicHash(message, messagePrefix);
  const sigBytes = base.fromBase64(sig);
  const flagByte = sigBytes[0] - 27;
  const rs = sigBytes.slice(1);
  const r = flagByte & 3;
  const segwitType= !(flagByte & 8)
      ? null
      : !(flagByte & 4)
          ? SEGWIT_TYPES.P2SH_P2WPKH
          : SEGWIT_TYPES.P2WPKH;
  const compressed = !!(flagByte & 12);
  const publicKey = signUtil.secp256k1.recover(rs, r, Buffer.from(hash), compressed);
  if (publicKey == null) {
    return false;
  }
  const publicKeyHash = Buffer.from(base.hash160(publicKey));

  let actual: Buffer, expected:Buffer;
  if (segwitType) {
    if (segwitType === SEGWIT_TYPES.P2SH_P2WPKH) {
      actual = segwitRedeemHash(publicKeyHash);
      expected = base.fromBase58Check(address).slice(1);
    } else {
      actual = publicKeyHash;
      expected = decodeBech32(address);
    }
  } else {
    try {
      expected = decodeBech32(address);
      return bufferEquals(publicKeyHash,expected);
    }catch (e) {
      const redeemHash = segwitRedeemHash(publicKeyHash);
      const except = base.fromBase58Check(address).slice(1);
      return bufferEquals(publicKeyHash,except) || bufferEquals(redeemHash,except);
    }
  }
  return bufferEquals(actual,expected);
}

const SEGWIT_TYPES = {
  P2WPKH: 'p2wpkh',
  P2SH_P2WPKH: 'p2sh(p2wpkh)'
}

function decodeBech32 (address: string) {
  const result = base.bech32.decode(address)
  const data = base.bech32.fromWords(result.words.slice(1))
  return Buffer.from(data)
}

function segwitRedeemHash (publicKeyHash:Buffer) {
  const redeemScript = Buffer.concat([
    Buffer.from('0014', 'hex'),
    publicKeyHash
  ])
  return Buffer.from(base.hash160(redeemScript))
}

function bufferEquals(a: Buffer,b: Buffer) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers');
  }

  if (a === b) {
    return true;
  }

  if (typeof a.equals === 'function') {
    return a.equals(b);
  }

  if (a.length !== b.length) {
    return false;
  }

  for (var i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }

  return true;
}
