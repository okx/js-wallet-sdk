import * as jsrsasign from "jsrsasign"
import BigInteger = jsrsasign.BigInteger;
import { fromHex, toHex } from './hex';
import { fromBase64 } from './base64';

// encode plain(utf-8) publicKey (base64)
export function encode(plain: string, rsaKey: jsrsasign.RSAKey) {
  let cipher = jsrsasign.KJUR.crypto.Cipher.encrypt(plain, rsaKey, 'RSA');
  return fromHex(cipher);
}

// decode cipher(hex) privateKey(base64)
export function decode(cipherHex: string, rsaKey: jsrsasign.RSAKey): string {
  return jsrsasign.KJUR.crypto.Cipher.decrypt(cipherHex, rsaKey, 'RSA')
}

export function encodeAny(plain: string, publicKey: string): string {
  const rsaKey = loadRsaKeyFromPkcs1(publicKey)
  // @ts-ignore
  const keySize = Math.floor((rsaKey.n.bitLength() + 7) / 8)
  const srcSize = plain.length
  let offSet = 0;
  const once = keySize - 11

  const bufferList = []
  while (true) {
    if(offSet + once >= srcSize) {
      // encrypt one part
      const bytesOnce = encode(plain.slice(offSet), rsaKey);
      bufferList.push(bytesOnce)
      break;
    }
    const bytesOnce = encode(plain.slice(offSet, offSet + once), rsaKey);
    bufferList.push(bytesOnce)
    offSet += once;
  }
  return jsrsasign.hextob64(toHex(Buffer.concat(bufferList)))
}

export function decodeAny(cipher: string, privateKey: string): string {
  const a = jsrsasign.RSAKey.getHexValueArrayOfChildrenFromHex(jsrsasign.b64tohex(privateKey));
  const rsaKey = new jsrsasign.RSAKey
  // @ts-ignore
  rsaKey.setPrivateEx(a[1],a[2],a[3],a[4],a[5],a[6],a[7],a[8]);
// @ts-ignore
  const keySize = Math.floor((rsaKey.n.bitLength() + 7) / 8)
  const cipherByes = fromBase64(cipher)
  const srcSize = cipherByes.length
  let offSet = 0;
  const bufferList = []
  while (true) {
    if(offSet + keySize >= srcSize) {
      // decrypt one part
      const once = decode(toHex(cipherByes.slice(offSet)), rsaKey);
      bufferList.push(once)
      break;
    }
    const once = decode(toHex(cipherByes.slice(offSet, offSet + keySize)), rsaKey);
    bufferList.push(once)
    offSet += keySize;
  }
  return bufferList.join("")
}

// get key pair (pkcs#1 base64)
export function genKeyPair(keyBit: number) {
    let key = jsrsasign.KEYUTIL.generateKeypair('RSA', keyBit);
    let privateKey = jsrsasign.KEYUTIL.getPEM(key.prvKeyObj, 'PKCS1PRV');
    let publicKey = jsrsasign.KEYUTIL.getPEM(key.pubKeyObj);
    const pkcs1PubKey = covertPublicKeyFromPkcs8ToPkcs1(unwrapPEM(publicKey, true))
    return {privateKey: unwrapPEM(privateKey, false), publicKey: pkcs1PubKey};
}

// convert publicKey (base64) from pkcs#8 to pkcs#1
export function covertPublicKeyFromPkcs8ToPkix(b64: string) {
  let rsaKey = jsrsasign.KEYUTIL.getKey(wrapPEM(b64, true)) as jsrsasign.RSAKey;
  const first_sequence = new jsrsasign.KJUR.asn1.DERSequence({
    array: [
      new jsrsasign.KJUR.asn1.DERObjectIdentifier({ oid: "1.2.840.113549.1.1.1" }),
      new jsrsasign.KJUR.asn1.DERNull(),
    ],
  })

  const second_sequence = new jsrsasign.KJUR.asn1.DERSequence({
    array: [
      // @ts-ignore
      new jsrsasign.KJUR.asn1.DERInteger({ bigint: rsaKey.n }),
      // @ts-ignore
      new jsrsasign.KJUR.asn1.DERInteger({ int: rsaKey.e }),
    ],
  });
  const bit_string = new jsrsasign.KJUR.asn1.DERBitString({
    // @ts-ignore
    hex: "00" + second_sequence.getEncodedHex(),
  });
  const seq = new jsrsasign.KJUR.asn1.DERSequence({
    // @ts-ignore
    array: [first_sequence, bit_string],
  });
  // @ts-ignore
  return jsrsasign.hextob64(seq.getEncodedHex());
}

// load pkcs#1 key (base64)
function loadRsaKeyFromPkix(publicKeyB64: string) {
  const publicKey = jsrsasign.b64tohex(publicKeyB64)
  if (!jsrsasign.ASN1HEX.isASN1HEX(publicKey)) {
    throw new Error("keyHex is not ASN.1 hex string");
  }

  let ids = jsrsasign.ASN1HEX.getChildIdx(publicKey, 0);
  const second_sequence = jsrsasign.ASN1HEX.getV(publicKey, ids[1])

  const hex = second_sequence.substring(2)
  ids = jsrsasign.ASN1HEX.getChildIdx(hex, 0);

  const rsaKey = new jsrsasign.RSAKey
  const nHex = jsrsasign.ASN1HEX.getV(hex, ids[0])
  // @ts-ignore
  rsaKey.n = new BigInteger(nHex, 16);
  const eHex = jsrsasign.ASN1HEX.getV(hex, ids[1])
  // @ts-ignore
  rsaKey.e = parseInt(eHex, 16)
  // @ts-ignore
  rsaKey.isPublic = true
  // @ts-ignore
  rsaKey.isPrivate = false
  return rsaKey
}

// convert publicKey (base64) from pkcs#8 to pkcs#1
export function covertPublicKeyFromPkcs8ToPkcs1(b64: string) {
  let rsaKey = jsrsasign.KEYUTIL.getKey(wrapPEM(b64, true)) as jsrsasign.RSAKey;
  const seq = new jsrsasign.KJUR.asn1.DERSequence({
    array: [
      // @ts-ignore
      new jsrsasign.KJUR.asn1.DERInteger({ bigint: rsaKey.n }),
      // @ts-ignore
      new jsrsasign.KJUR.asn1.DERInteger({ int: rsaKey.e }),
    ],
  });
  // @ts-ignore
  return jsrsasign.hextob64(seq.getEncodedHex());
}

// load pkcs#1 key (base64)
function loadRsaKeyFromPkcs1(publicKeyB64: string) {
  const publicKey = jsrsasign.b64tohex(publicKeyB64)
  if (!jsrsasign.ASN1HEX.isASN1HEX(publicKey)) {
    throw new Error("keyHex is not ASN.1 hex string");
  }

  let ids = jsrsasign.ASN1HEX.getChildIdx(publicKey, 0);
  const rsaKey = new jsrsasign.RSAKey
  const nHex = jsrsasign.ASN1HEX.getV(publicKey, ids[0])
  // @ts-ignore
  rsaKey.n = new BigInteger(nHex, 16);
  const eHex = jsrsasign.ASN1HEX.getV(publicKey, ids[1])
  // @ts-ignore
  rsaKey.e = parseInt(eHex, 16)
  // @ts-ignore
  rsaKey.isPublic = true
  // @ts-ignore
  rsaKey.isPrivate = false
  return rsaKey
}

// from pem get key (base64)
export function unwrapPEM(pem: string, pub: boolean) {
  const header = pub ? "PUBLIC KEY" : "RSA PRIVATE KEY"
  return jsrsasign.hextob64(jsrsasign.pemtohex(pem, header))
}

// from key (base64) get pem
export function wrapPEM(b64: string, pub: boolean) {
  const header = pub ? "PUBLIC KEY" : "RSA PRIVATE KEY"
  return jsrsasign.hextopem(jsrsasign.b64tohex(b64), header)
}