import {networks, payments, privateKeyFromWIF, sign, wif2Public} from "../src"
import {buildRuneData, fromVarInt, toVarInt} from "../src/rune"
import {Psbt} from "../src/bitcoinjs-lib/psbt";
import * as taproot from "../src/taproot";
import {base, signUtil} from "@okxweb3/crypto-lib";

const network = networks.testnet
const schnorr = signUtil.schnorr.secp256k1.schnorr

describe('rune test', () => {

    test('rune transfer OP_RETURN test', () => {
        const opReturnScript = buildRuneData(false, [{id: 0x2aa16001b, output: 0, amount: 1000}])
        console.log("opReturnScript: ", opReturnScript.toString('hex'))
    })

    test("transfer rune", () => {
        let privateKey = "L22jGDH5pKE4WHb2m9r2MdiWTtGarDhTYRqMrntsjD5uCq5z9ahY";
        const pk = wif2Public(privateKey, networks.bitcoin);
        const {address} = payments.p2wpkh({pubkey: pk, network});
        expect(address).toEqual("tb1qx588yu0cnp6vu6xdrl7qpucd27w9nccqllpe3q")

        const signer = {
            publicKey: pk,
            sign(hash: Buffer): Buffer {
                return sign(hash, privateKeyFromWIF(privateKey, networks.bitcoin));
            },
            signSchnorr(hash: Buffer): Buffer {
                const tweakedPrivKey = taproot.taprootTweakPrivKey(base.fromHex(privateKeyFromWIF(privateKey, networks.bitcoin)));
                return Buffer.from(schnorr.sign(hash, tweakedPrivKey, base.randomBytes(32)));
            },
        };

        const psbt = new Psbt({network: network})
        // 1. Add Input
        psbt.addInput({
            hash: "c51c77557700af02fe47b8b1356be7dabd0da5f81006bcbc94f1c22bdff99317",
            index: 2,
            witnessUtxo: {
                script: Buffer.from("0014350e7271f89874ce68cd1ffc00f30d579c59e300", 'hex'),
                value: 53015,
            }
        })

        psbt.addOutput({address: address!, value: 52800,})
        // 2. Add Output OP_RETURN
        const opReturnScript = buildRuneData(false, [{id: 0x2aa16001b, output: 0, amount: 1000}])
        psbt.addOutput({script: opReturnScript, value: 0,})

        // 3. Sign Input
        psbt.signInput(0, signer)

        psbt.finalizeAllInputs()
        const txHex = psbt.extractTransaction().toHex();
        expect(txHex).toEqual("020000000001011793f9df2bc2f194bcbc0610f8a50dbddae76b35b1b847fe02af007755771cc50200000000ffffffff0240ce000000000000160014350e7271f89874ce68cd1ffc00f30d579c59e3000000000000000000156a0952554e455f544553540900a9cfd6ff1b86680002483045022100f82f9b7101267bd8fbb541db44e95dd51970f38371df27c38d087037fdbe697802206c71552b867009cfcc71cd4f389fa30de82248d780745c6181128a7372217d950121025eb6e43683242c20678f33666533eee8ad532b9cbafd6c6346be48954d71d40f00000000")
    })


    test("varint full", () => {
        const testVectors: [number, Uint8Array][] = [
            [0, new Uint8Array([0x00])],
            [1, new Uint8Array([0x01])],
            [127, new Uint8Array([0x7F])],
            [128, new Uint8Array([0x80, 0x00])],
            [255, new Uint8Array([0x80, 0x7F])],
            [256, new Uint8Array([0x81, 0x00])],
            [16383, new Uint8Array([0xFE, 0x7F])],
            [16384, new Uint8Array([0xFF, 0x00])],
            [16511, new Uint8Array([0xFF, 0x7F])],
            [65535, new Uint8Array([0x82, 0xFE, 0x7F])],
            [4294967296, new Uint8Array([0x8E, 0xFE, 0xFE, 0xFF, 0x00])], // 1 << 32 = 1 in javascript
        ]

        for (const [n, encoding] of testVectors) {
            const actual = toVarInt(BigInt(n))
            expect(actual).toEqual(encoding)
            const [decoded, length] = fromVarInt(encoding)
            expect(decoded).toEqual(BigInt(n))
            expect(length).toBe(encoding.length)
        }
    })

})
