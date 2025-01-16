import {sha256} from "@noble/hashes/sha256";
import {Buffer} from "buffer";
import {base, bip32, bip39, signUtil} from "../src";
import {fromHex, magicHash, randomBytes, toHex} from '../src/base';
import {secp256k1} from "../src/signutil";
import {publicKeyCreate} from "../src/signutil/ed25519";
import {
    intToBuffer,
    intToHex,
    zeros,
    setLengthLeft,
    setLengthRight,
    unpadBuffer,
    unpadArray,
    unpadHexString, validateNoLeadingZeroes
} from "../src/abi/bytes";
import {assertIsString} from "../src/abi/helpers";
import {SoliditySHA3} from "../src/abi";
import {fromAscii, getKeys, toAscii} from "../src/abi/internal";
import {getLength} from "../src/abi/rlp";
import {bitLen, equalBytes} from "../src/signutil/schnorr/abstract/utils";

describe("abi test", ()=>{
    test("bytes test", async ()=>{
        expect(intToHex(123456)).toEqual("0x1e240")
        expect(toHex(intToBuffer(123456))).toEqual("01e240")
        expect(toHex(zeros(2))).toEqual("0000")
        expect(setLengthLeft(base.fromHex("0x1234"),1)).toEqual(new Buffer([0x34]))
        expect(setLengthRight(base.fromHex("0x1234"),1)).toEqual(new Buffer([0x12]))
        expect(unpadBuffer(base.fromHex("0x01234"))).toEqual(new Buffer([0x01,0x23]))
        expect(unpadArray([0,1,2,3,4,5,6])).toEqual([ 1, 2, 3, 4, 5, 6 ])
        expect(unpadHexString("0x01234")).toEqual("0x1234")
    })
    test("helper test", async ()=>{
        assertIsString("1234");
        expect(base.toHex(SoliditySHA3(['uint256'], [1234]))).toEqual("17fa14b0d73aa6a26d6b8720c1c84b50984f5c188ee1c113d2361e430f1b6764");
        expect(getKeys([{a: '1', b: '2'}, {a: '3', b: '4'}], 'a')).toEqual([ '1', '3' ])
        expect(toAscii("0x1234")).toEqual("4");
        expect(fromAscii("1234")).toEqual("0x31323334");
        expect(getLength("1234")).toEqual(4)
        validateNoLeadingZeroes({"123":new Buffer([0x1234])})
    })
})

describe("signutil test", ()=>{
    test("abstract utils", async () => {
        expect(equalBytes(fromHex("0x1234"), fromHex("0x1234"))).toBe(true);
        expect(bitLen(BigInt(1234).valueOf())).toEqual(11);
    })
})

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
        expect(bytes).toEqual(bytes2)
        if (bytes.equals(bytes2)) {
            console.info(hex);
        }

        console.info(base.toHex(bytes))
        console.info(base.toHex(Array.of(...bytes)))
        console.info(base.toHex(Uint8Array.of(...bytes)))

        const base64String = base.toBase64(bytes);
        const bytes3 = base.fromBase64(base64String);
        expect(bytes).toEqual(new Buffer(bytes3))
        if (bytes.equals(bytes3)) {
            console.info(base64String);
        }

        console.info(base.toBase64(bytes))
        console.info(base.toBase64(Array.of(...bytes)))
        console.info(base.toBase64(Uint8Array.of(...bytes)))

        const base58String = base.toBase58(bytes);
        const bytes4 = base.fromBase58(base58String);
        expect(bytes).toEqual(new Buffer(bytes4))
        if (bytes.equals(bytes4)) {
            console.info(base58String);
        }

        console.info(base.toBase58(bytes))
        console.info(base.toBase58(Array.of(...bytes)))
        console.info(base.toBase58(Uint8Array.of(...bytes)))

        const base58CheckString = base.toBase58Check(bytes);
        const bytes5 = base.fromBase58Check(base58CheckString);
        expect(bytes).toEqual(bytes5)
        if (bytes.equals(bytes5)) {
            console.info(base58CheckString);
        }

        console.info(base.toBase58Check(bytes))
        console.info(base.toBase58Check(Array.of(...bytes)))
        console.info(base.toBase58Check(Uint8Array.of(...bytes)))

        // encode the data into 5 bits and then encode. When decoding, decode data into 8 bits
        const bech32String = base.bech32.encode("prefix", base.bech32.toWords(bytes));
        const bech32Data = base.bech32.decode(bech32String);
        expect(bytes).toEqual(Buffer.from(base.bech32.fromWords(bech32Data.words)));
        if (bytes.equals(Buffer.from(base.bech32.fromWords(bech32Data.words)))) {
            console.info(bech32String, bech32Data);
        }

        const b = base.toBech32("prefix", bytes);
        const [c, d] = base.fromBech32(b);
        expect(bytes).toEqual(d)
        if (bytes.equals(d)) {
            console.info(b, c, d);
        }

        console.info(base.toBech32("prefix", bytes))
        console.info(base.toBech32("prefix", Array.of(...bytes)))
        console.info(base.toBech32("prefix", Uint8Array.of(...bytes)))

        const k = base.toUtf8("abc")
        console.info(base.toHex(k));
        expect(base.toHex(k)).toEqual("616263")
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
        expect(base.toHex(p)).toEqual("0bcf13c90b17be1a6fcb83818f338ef193a09c73a8d669cdeae92466f79317e8")

        const v = signUtil.ed25519.publicKeyVerify(p)
        console.info(v);
        expect(v).toEqual(true)

        const f1 = signUtil.ed25519.fromSeed(secretKey.slice(0, 32))
        const f2 = signUtil.ed25519.fromSecret(secretKey)
        console.info(f1, f2);

        const msgHash = sha256("abc")
        const signature2 = signUtil.ed25519.sign(msgHash, base.fromHex(str.substring(0, 64)))
        const r2 = signUtil.ed25519.verify(msgHash, signature2, p)
        expect(r2).toEqual(true)
        expect(base.toHex(signature2)).toEqual("5e319ae722bc859a47fdecca44b36907692e9a8251c9a444c2371a76796eec69f92072204a14952be14a820dc7fb6d1f6cfb6909ea2fe3c8b42733f3f584790d")
    });

    test("secp256k1", async () => {
        const secretKey = Buffer.from(base.fromHex("40819a6788c3fc0a299a1a9302a5638becf7ee3235328f04212ac0d7b7f3749a288a2265542d8d5bf05d4fc046fa818a8e1022c250de244617ab45ed82f886eb"))
        const v = signUtil.secp256k1.privateKeyVerify(secretKey)
        expect(v).toEqual(false)

        const publicKeyCompressed = signUtil.secp256k1.publicKeyCreate(secretKey, true)
        const publicKeyUnCompressed = signUtil.secp256k1.publicKeyCreate(secretKey, false)
        expect(base.toHex(publicKeyCompressed)).toEqual("031bd7f1a4909d1e01ef7e8411965150710454ffdbc508306b8a963540a783151e")
        expect(base.toHex(publicKeyUnCompressed)).toEqual("041bd7f1a4909d1e01ef7e8411965150710454ffdbc508306b8a963540a783151e4c6d32c24af73aa1c6cdb13712cf7dafcf18b442d7e05e4eade72f0796947725")

        const v1 = signUtil.secp256k1.publicKeyVerify(publicKeyCompressed)
        const v2 = signUtil.secp256k1.publicKeyVerify(publicKeyCompressed)
        expect(v1).toEqual(true)
        expect(v2).toEqual(true)

        const k1 = signUtil.secp256k1.loadPublicKey(publicKeyCompressed)!
        expect(base.toHex(k1.x.toArray())).toEqual("1bd7f1a4909d1e01ef7e8411965150710454ffdbc508306b8a963540a783151e")
        expect(base.toHex(k1.y.toArray())).toEqual("4c6d32c24af73aa1c6cdb13712cf7dafcf18b442d7e05e4eade72f0796947725")

        const k2 = signUtil.secp256k1.loadPublicKey(publicKeyUnCompressed)!
        expect(base.toHex(k2.x.toArray())).toEqual("1bd7f1a4909d1e01ef7e8411965150710454ffdbc508306b8a963540a783151e")
        expect(base.toHex(k2.y.toArray())).toEqual("4c6d32c24af73aa1c6cdb13712cf7dafcf18b442d7e05e4eade72f0796947725")

        const c = signUtil.secp256k1.publicKeyConvert(publicKeyUnCompressed, true)!
        expect(base.toHex(c)).toEqual("031bd7f1a4909d1e01ef7e8411965150710454ffdbc508306b8a963540a783151e")

        const msgHash = base.sha256("abc");
        const s = signUtil.secp256k1.sign(Buffer.from(msgHash), secretKey)!
        expect(s.recovery).toEqual(1)
        expect(base.toHex(s.signature)).toEqual("e7b81c04c29a3b4c2aa79b30609225c9d00bc27d5c2d22eb2f3222e12705539c5b50d9fa948a2062386ce3d5a3698a89ac3308ea627c4b56ea75f24e1450cdf3")

        const r = signUtil.secp256k1.recover(Buffer.from(s.signature), s.recovery, Buffer.from(msgHash), true)
        if (r != null) {
            expect(base.toHex(r)).toEqual("031bd7f1a4909d1e01ef7e8411965150710454ffdbc508306b8a963540a783151e")
        }

        // message: Buffer, r: string, s: string, publicKey: Buffer
        const vv = signUtil.secp256k1.getV(Buffer.from(msgHash), base.toHex(s.signature.slice(0, 32)), base.toHex(s.signature.slice(32)), publicKeyCompressed)
        expect(vv).toEqual(1)
        const bb = signUtil.secp256k1.verifyWithNoRecovery(msgHash, s.signature, publicKeyCompressed)
        expect(bb).toEqual(true)
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
        expect(base.toHex(node.publicKey)).toEqual("0339a36013301597daef41fbe593a02cc513d0b55527ec2df1050e2e8ff49c85c2")
        expect(base.toHex(node.privateKey!)).toEqual("e8f32e723decf4051aefac8e2c93c9c5b214313817cdb01a1494b917c8436b35")
        expect(base.toHex(node.chainCode)).toEqual("873dff81c02f525623fd1fe5167eac3a55a049de3d314bb42ee227ffed37d508")

        let node2: bip32.BIP32Interface = bip32.fromBase58("xprvA41z7zogVVwxVSgdKUHDy1SKmdb533PjDz7J6N6mV6uS3ze1ai8FHa8kmHScGpWmj4WggLyQjgPie1rFSruoUihUZREPSL39UNdE3BBDu76");
        expect(base.toHex(node2.publicKey)).toEqual("022a471424da5e657499d1ff51cb43c47481a03b1e77f951fe64cec9f5a48f7011")
        expect(base.toHex(node2.privateKey!)).toEqual("471b76e389e528d6de6d816857e012c5455051cad6660850e58372a6c3e6e7c8")
        expect(base.toHex(node2.chainCode)).toEqual("c783e67b921d2beb8f6b389cc646d7263b4145701dadd2161548a8b078e65e9e")

        let child: bip32.BIP32Interface = node.derivePath("m/0'/1/2'/2/1000000000");
        expect(base.toHex(child.publicKey)).toEqual("022a471424da5e657499d1ff51cb43c47481a03b1e77f951fe64cec9f5a48f7011")
        expect(base.toHex(child.privateKey!)).toEqual("471b76e389e528d6de6d816857e012c5455051cad6660850e58372a6c3e6e7c8")
        expect(child.toBase58()).toEqual("xprvA41z7zogVVwxVSgdKUHDy1SKmdb533PjDz7J6N6mV6uS3ze1ai8FHa8kmHScGpWmj4WggLyQjgPie1rFSruoUihUZREPSL39UNdE3BBDu76")
        expect(child.toWIF()).toEqual("Kybw8izYevo5xMh1TK7aUr7jHFCxXS1zv8p3oqFz3o2zFbhRXHYs")

        expect(child.index).toEqual(1000000000)
        expect(base.toHex(child.identifier)).toEqual("d69aa102255fed74378278c7812701ea641fdf32")
        expect(base.toHex(child.fingerprint)).toEqual("d69aa102")
    });

    test("md5", async () => {
        const ret = base.md5.encode("hello world")
        expect(ret).toEqual("5eb63bbbe01eeed093cb22bb8f5acdc3")
    });
});
