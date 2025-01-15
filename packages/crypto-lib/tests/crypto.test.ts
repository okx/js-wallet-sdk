import {sha256} from "@noble/hashes/sha256";
import {Buffer} from "buffer";
import {base, bip32, bip39, signUtil} from "../src";
import {magicHash, randomBytes, toHex} from '../src/base';
import {secp256k1} from "../src/signutil";
import {publicKeyCreate} from "../src/signutil/ed25519";


describe("crypto", () => {

    test("magicHash", async () => {
        expect(toHex(magicHash("hello world"))).toEqual("0b6b6ce07bc55ee4aeba0098a5e5d2c8986cab228a54199723f9962316633733");
    })

    test("publicKeyCreate", async () => {
        const privateKey = "037f00373589c700a411382ae702e258b01f30a509a32be2b2c84fb54de4c1e5fd5fd86d7d7b8355492b1517a96a2fbb17e1a374b80a21559bdfee0dfbaa0b32";
        expect(base.toHex(publicKeyCreate(base.fromHex(privateKey)))).toEqual("fd5fd86d7d7b8355492b1517a96a2fbb17e1a374b80a21559bdfee0dfbaa0b32");
        const invalidPrivateKey = "037f00373589c700a411382ae702e258b01f30a509a32be2b2c84fb54de4c1e5fd5fd86d7d7b8355492b1517a96a2fbb17e1a374b80a21559bdfee0dfbaa0b36";
        expect(() => publicKeyCreate(base.fromHex(invalidPrivateKey))).toThrowError("invalid public key")
    });

    test("base", async () => {
        const bytes = randomBytes(32);
        const hex = base.toHex(bytes);
        const bytes2 = base.fromHex(hex);
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
        const str = "40819a6788c3fc0a299a1a9302a5638becf7ee3235328f04212ac0d7b7f3749a0bcf13c90b17be1a6fcb83818f338ef193a09c73a8d669cdeae92466f79317e8";
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
        if (r != null) {
            console.info(base.toHex(r))
        }

        // message: Buffer, r: string, s: string, publicKey: Buffer
        const vv = signUtil.secp256k1.getV(Buffer.from(msgHash), base.toHex(s.signature.slice(0, 32)), base.toHex(s.signature.slice(32)), publicKeyCompressed)
        console.info(vv);

        const bb = signUtil.secp256k1.verifyWithNoRecovery(msgHash, s.signature, publicKeyCompressed)
        console.info(bb);
    });

    test("publicKeyVerify test", async ()=> {
        const zeroUncompressed = Buffer.concat([Buffer.from([0x04]), Buffer.alloc(64)])
        expect(secp256k1.publicKeyVerify(zeroUncompressed)).toBe(false);

        const zeroCompressed = Buffer.concat([Buffer.from([0x02]), Buffer.alloc(32)])
        expect(secp256k1.publicKeyVerify(zeroCompressed)).toBe(false);

        // bip32.fromPublicKey(zeroCompressed,Buffer.alloc(32))
    })

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
});
