import {sha256} from "@noble/hashes/sha256";
import {Buffer} from "buffer";
import { base, bip32, bip39, signUtil } from "../src";
import { randomBytes } from '../src/base';


describe("crypto", () => {
  test("base", async () => {
    const bytes = randomBytes(32);
    const hex =  base.toHex(bytes);
    const bytes2 =  base.fromHex(hex);
    if (bytes.equals(bytes2)) {
      console.info(hex);
    }

    console.info(base.toHex(bytes))
    console.info(base.toHex(Array.of(...bytes)))
    console.info(base.toHex(Uint8Array.of(...bytes)))

    const base64String = base.toBase64(bytes);
    const bytes3 = base.fromBase64(base64String);
    if (bytes.equals(bytes3)) {
      console.info(base64String);
    }

    console.info(base.toBase64(bytes))
    console.info(base.toBase64(Array.of(...bytes)))
    console.info(base.toBase64(Uint8Array.of(...bytes)))

    const base58String = base.toBase58(bytes);
    const bytes4 = base.fromBase58(base58String);
    if (bytes.equals(bytes4)) {
      console.info(base58String);
    }

    console.info(base.toBase58(bytes))
    console.info(base.toBase58(Array.of(...bytes)))
    console.info(base.toBase58(Uint8Array.of(...bytes)))

    const base58CheckString = base.toBase58Check(bytes);
    const bytes5 = base.fromBase58Check(base58CheckString);
    if (bytes.equals(bytes5)) {
      console.info(base58CheckString);
    }

    console.info(base.toBase58Check(bytes))
    console.info(base.toBase58Check(Array.of(...bytes)))
    console.info(base.toBase58Check(Uint8Array.of(...bytes)))

    // encode the data into 5 bits and then encode. When decoding, decode data into 8 bits
    const bech32String = base.bech32.encode("prefix", base.bech32.toWords(bytes));
    const bech32Data = base.bech32.decode(bech32String);
    if (bytes.equals(Buffer.from(base.bech32.fromWords(bech32Data.words)))) {
      console.info(bech32String, bech32Data);
    }

    const b = base.toBech32("prefix", bytes);
    const [c, d] = base.fromBech32(b);
    if (bytes.equals(d)) {
      console.info(b, c, d);
    }

    console.info(base.toBech32("prefix", bytes))
    console.info(base.toBech32("prefix", Array.of(...bytes)))
    console.info(base.toBech32("prefix", Uint8Array.of(...bytes)))

    const k = base.toUtf8("abc")
    console.info(k);
  });

  test("bip39", async () => {
    const mnemonic = bip39.generateMnemonic(160);
    console.info(mnemonic);

    const result = bip39.validateMnemonic(mnemonic);
    console.info(result);

    const seed = bip39.mnemonicToSeedSync(mnemonic);
    console.info(base.toHex(seed));

    const i = bip32.fromSeed(seed);
    console.info(base.toHex(i.publicKey));
    console.info(base.toHex(i.privateKey!));

    console.info((await bip39.mnemonicToSeed('basket actual')).toString('hex'))
  });

  test("ed25519", async () => {
    // The first 32 bytes of the signature are the private key and the following 32 bits are the public key
    const str = "40819a6788c3fc0a299a1a9302a5638becf7ee3235328f04212ac0d7b7f3749a288a2265542d8d5bf05d4fc046fa818a8e1022c250de244617ab45ed82f886eb";
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
  });

  test("secp256k1", async () => {
    const secretKey = Buffer.from(base.fromHex("40819a6788c3fc0a299a1a9302a5638becf7ee3235328f04212ac0d7b7f3749a288a2265542d8d5bf05d4fc046fa818a8e1022c250de244617ab45ed82f886eb"))
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
    const s = signUtil.secp256k1.sign(Buffer.from(msgHash), secretKey)!
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
  });

  test("bip32", async () => {
    let node: bip32.BIP32Interface = bip32.fromSeed(base.fromHex("000102030405060708090a0b0c0d0e0f"));
    console.info("node1-publicKey: ", base.toHex(node.publicKey));
    console.info("node1-privateKey: ", base.toHex(node.privateKey!));
    console.info("node1-chainCode: ", base.toHex(node.chainCode));

    let node2: bip32.BIP32Interface = bip32.fromBase58("xprvA41z7zogVVwxVSgdKUHDy1SKmdb533PjDz7J6N6mV6uS3ze1ai8FHa8kmHScGpWmj4WggLyQjgPie1rFSruoUihUZREPSL39UNdE3BBDu76");
    console.info("node2-publicKey: ", base.toHex(node2.publicKey));
    console.info("node2-privateKey: ", base.toHex(node2.privateKey!));
    console.info("node2-chainCode: ", base.toHex(node2.chainCode));

    let child: bip32.BIP32Interface = node.derivePath("m/0'/1/2'/2/1000000000");
    console.info(base.toHex(child.publicKey));
    console.info(base.toHex(child.privateKey!));
    console.info(child.toBase58());
    console.info(child.toWIF());
    console.info(child.index);
    console.info(base.toHex(child.identifier));
    console.info(base.toHex(child.fingerprint));
  });

  test("md5", async () => {
    const ret = base.md5.encode("hello world")
    console.info(ret);
  });

  test("aes", async () => {
    const key = "hello world";
    const plain = "aes test plain";
    const md5Key = base.md5.encode(key)
    const cipher = base.aes.encrypt(plain, md5Key)
    const ret = base.aes.decrypt(cipher, md5Key);
    expect(ret).toEqual(plain)
  });

  test("rsa", async () => {
    const keyPair = base.rsa.genKeyPair(1024)
    console.info(keyPair)

    const plain = "1232efsfsdgdfgrgretreopkgorekgldfgkldfklkgdfklgkfdlglfdklgkdflkgldfklgkdfkgfdklgkfldkglsierejfsdjndjsafjs1232efsfsdgdfgrgretreopkgorekgldfgkldfklkgdfklgkfdlglfdklgkdflkgldfklgkdfkgfdklgkfldkglsierejfsdjndjsafjs";
    const cipher = base.rsa.encodeAny(plain, keyPair.publicKey)
    const ret = base.rsa.decodeAny(cipher, keyPair.privateKey)
    expect(ret).toEqual(plain)
  });

  test("rsa2", async () => {
    const privateKey = 'MIICXAIBAAKBgQCn8Xu5xyZDsbrP/MuPMDy3OJi2TQuMXIu6GAvfRWFg9jGX+Wg+tfQJHA+z/Sje1kCZcZblFQk13iQzq0B+90iSST53Bdp1T8FN/uJKvb+dFWTLzF5A9s4z1UksUwqoRHZu4UBhDVUHZKLIboqQO1ydqciR2RDo3NZkLGNUer8DCwIDAQABAoGBAJ5aAZFACAJYOI8YC0+t6fHQeZ2as8LbGByVw8v3/UORn11umy5WHg3g2aWalMjYN/z2r5K87PxPws69MIkG3PMUIpyjfn5LaX7+e3Rjelks0DqSx4vLcANigQg7+3nKzgS2Y0ACZSG9xvy/gECeHhK+sdSFZWJZ4DJ1hE8gzGMhAkEA+fV0zPudDdQp6jiBGjwJl5rlB2R5biLwztKDlcSuPDT2MZlOO1bbG1ZsenJIJIqaHGHtF6JjF7vCNqw0b3F/iQJBAKwAlMK/EgRMiANrRwutamo0OYex6GYT0pZsihQVLOvUIwDNSPfWM+Wi2a9z7ZWFU77Ulp+im1lDxwwdzC5aVPMCQBGsk3ezCuXhbJ1NJYPPXvZDU5J0PknVWqWlKPy8DX3gWNAlAO0dNRz3vW/jCMrcqgz7t6IGL2+MLS1ke8itg9ECQCilToIi4uAPMckVDcntpgsI4lt1qESPBKG1bn/GbUIhdFAZMtgWT1dBv41dqNQ/mIWs+RcqNunGQYBUfk6p3A8CQDgdHSyTrTLuv9uy97/rFdRFd4poaWSKbdNBqnbjz/xaerNiX1yXt1lZAp3tsQY6AX8Q7BeVhyms4YGEcxTHh/8='
    const publicKey = 'MIGJAoGBAKfxe7nHJkOxus/8y48wPLc4mLZNC4xci7oYC99FYWD2MZf5aD619AkcD7P9KN7WQJlxluUVCTXeJDOrQH73SJJJPncF2nVPwU3+4kq9v50VZMvMXkD2zjPVSSxTCqhEdm7hQGENVQdkoshuipA7XJ2pyJHZEOjc1mQsY1R6vwMLAgMBAAE='
    const plain = "1232efsfsdgdfgrgretreopkgorekgldfgkldfklkgdfklgkfdlglfdklgkdflkgldfklgkdfkgfdklgkfldkglsierejfsdjndjsafjs1232efsfsdgdfgrgretreopkgorekgldfgkldfklkgdfklgkfdlglfdklgkdflkgldfklgkdfkgfdklgkfldkglsierejfsdjndjsafjs";
    const cipher = base.rsa.encodeAny(plain, publicKey)
    console.info(cipher)

    const ret = base.rsa.decodeAny("QrimFihcMxnEUZx/eAMGTVHnz4CbMKeARki9cR7T67hQTmaQiv7vajutgorlwXQYOUyEX2JgVpJNL8OeAxE6ASojAEYLhMxPj85A2VNINy85mF/VwB3JhJ1kDj/k8dy73P5iPIEPN0z9J6cFZDv2nFDHsCAaLrUJvM9pSzcf/zUPR6sW/bjN1HwtSt3Ofc/Z2GkJZnpITGx8/df9QsjyrF/BsCJ1SxvQFdWkKe4vTj9PFuiQi3MjNOH/2XoPmOeduGc5AAzquYusMXm5vV0gss5IN2oMbGOwKPgqUSAy2kMZRwZO+tTzPXtk1zkcauoNeYIhqnx/NE1JCwwQ30DhIA==", privateKey)
    expect(ret).toEqual(plain)
  });
});
