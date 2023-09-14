# Installation
This is a base package on which all currencies depend. You need to install this library.

```shell
npm install @okxweb3/crypto-lib
```

## Provides
We provide common functions about bip32, bip39, ecdsa, ed25519, etc.

#### bip32 method
```typescript
let node: bip32.BIP32Interface = bip32.fromSeed(base.fromHex("000102030405060708090a0b0c0d0e0f"));
console.info("publicKey: ", base.toHex(node.publicKey));
console.info("privateKey: ", base.toHex(node.privateKey!));
console.info("chainCode: ", base.toHex(node.chainCode));
```

#### bip39 generate private key and public key, sign message,
```typescript
const mnemonic = bip39.generateMnemonic()
const masterSeed = await bip39.mnemonicToSeed(mnemonic)
const rootKey = bip32.fromSeed(masterSeed)
const childKey =  rootKey.derivePath("m/44'/0'/0'/0/0")
const items = []
items.push(mnemonic)
items.push(base.toHex(rootKey.privateKey!))
items.push(base.toHex(childKey.privateKey!) )

const pk = childKey.privateKey!
const pb1 =  signUtil.secp256k1.publicKeyCreate(pk, true)
items.push(base.toHex(pb1))

const pb2 = signUtil.ed25519.publicKeyCreate(pk)
items.push(base.toHex(pb2))

const msg = base.randomBytes(32)
items.push(base.toHex(msg))

// recovery + r + s
const s1 = signUtil.secp256k1.sign(msg, pk, true)
items.push(base.toHex(base.concatBytes(Uint8Array.of(s1.recovery + 27), s1.signature)))

const s2 = signUtil.ed25519.sign(msg, pk)
items.push(base.toHex(s2))
```

#### common hash and format methods
```typescript
const msg = base.randomBytes(32)
const s1 = base.toHex(base.sha256(msg))
const s2 = base.toHex(base.sha512(msg))
const s3 = base.toBase58(msg)
const s4 = base.toBase58Check(msg)
const s5 = base.toBase64(msg)
const s6 = base.toBech32("prefix", msg)
const s7 = base.toHex(base.hash160(msg))
const s8 = base.toHex(base.keccak256(msg))
const s9 = base.toHex(base.hmacSHA256("key", msg))
```

#### ed25519 common sign method
```typescript
const str = "f339d78368680b2fa1c7c0e67c6c40ab0da01ce21ceb1cbbdb707ae7920eff68d84e93f864287b8be1b3d6c5363b6b0dc0140fbbfadcc4c3cb15eae5da901926";
const secretKey = base.fromHex(str);

const p = signUtil.ed25519.publicKeyCreate(secretKey)
console.info(base.toHex(p));

const v = signUtil.ed25519.publicKeyVerify(p)
console.info(v);

const f1 = signUtil.ed25519.fromSeed(secretKey.slice(0, 32))
const f2 = signUtil.ed25519.fromSecret(secretKey)
console.info(f1, f2);

const msgHash = sha256("abc")
const signature2 = signUtil.ed25519.sign(msgHash, base.fromHex(str.substring(0, 64)))
const r2 = signUtil.ed25519.verify(msgHash, signature2, p)
console.info(base.toHex(signature2), r2);
```

#### ecdsa common sign method
```typescript
const secretKey = Buffer.from(base.fromHex("5dfce364a4e9020d1bc187c9c14060e1a2f8815b3b0ceb40f45e7e39eb122103"))
const v = signUtil.secp256k1.privateKeyVerify(secretKey)
console.info(v);

const publicKeyCompressed = signUtil.secp256k1.publicKeyCreate(secretKey, true)
const publicKeyUnCompressed = signUtil.secp256k1.publicKeyCreate(secretKey, false)
console.info(base.toHex(publicKeyCompressed), base.toHex(publicKeyUnCompressed));

const v1 = signUtil.secp256k1.publicKeyVerify(publicKeyCompressed)
const v2 = signUtil.secp256k1.publicKeyVerify(publicKeyCompressed)
console.info(v1, v2);

const k1 = signUtil.secp256k1.loadPublicKey(publicKeyCompressed)!
console.info(base.toHex(k1.x.toArray()), base.toHex(k1.y.toArray()));

const k2 = signUtil.secp256k1.loadPublicKey(publicKeyUnCompressed)!
console.info(base.toHex(k2.x.toArray()), base.toHex(k2.y.toArray()));

const c = signUtil.secp256k1.publicKeyConvert(publicKeyUnCompressed, true)!
console.info(base.toHex(c));

const msgHash = base.sha256("abc");
const s = signUtil.secp256k1.sign(Buffer.from(msgHash), secretKey)
console.info(base.toHex(s.signature), s.recovery);

const r = signUtil.secp256k1.recover(Buffer.from(s.signature), s.recovery, Buffer.from(msgHash), true)
if(r != null) {
    console.info(base.toHex(r))
}

// message: Buffer, r: string, s: string, publicKey: Buffer
const vv = signUtil.secp256k1.getV(Buffer.from(msgHash), base.toHex(s.signature.slice(0,32)), base.toHex(s.signature.slice(32)), publicKeyCompressed)
console.info(vv);

const bb = signUtil.secp256k1.verifyWithNoRecovery(msgHash, s.signature, publicKeyCompressed)
console.info(bb);
```

## License

Current package is [MIT](<https://github.com/okx/js-wallet-sdk/blob/main/LICENSE>) licensed.
