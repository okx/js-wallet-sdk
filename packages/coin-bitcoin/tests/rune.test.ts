import {networks, payments, privateKeyFromWIF, sign, wif2Public, RuneTestWallet} from "../src"
import {buildRuneData, fromVarInt, toVarInt} from "../src/rune"
import {Psbt} from "../src/bitcoinjs-lib/psbt";
import * as taproot from "../src/taproot";
import {base, signUtil} from "@okxweb3/crypto-lib";
import {SignTxParams} from "@okxweb3/coin-base";

const network = networks.testnet
const schnorr = signUtil.schnorr.secp256k1.schnorr

describe('rune test', () => {

    test('rune transfer OP_RETURN test', () => {
        const opReturnScript = buildRuneData(false, [{id: 0x2aa16001b, output: 0, amount: 1000}])
        expect(opReturnScript.toString('hex')).toEqual('6a0952554e455f544553540900a9cfd6ff1b866800')
    })

    test("transfer rune legacy", async () => {
        const WIF = 'cUsEDaPqb1MqLabsYJeCJvZ734DdGfPhML2N7nr6RAqwdKiG8Mv9' // testnet
        const publicKey = wif2Public(WIF, network);
        const {address} = payments.p2wpkh({pubkey: publicKey, network});
        expect(address).toEqual("tb1qld79qrdvr8ljkl49ph8wxx275y45k0l3jwdzud")

        // modified from transfer: https://mempool.space/testnet/tx/b386056c2d4b92b12e342d57040bba0b56b1c4fae2ad1d196ceb6d548ffde920
        let wallet = new RuneTestWallet
        let runeTxParams = { 
            inputs: [ // at least 2 inputs for transfer: 1 rune input, 1 fee input
                {
                    txId: "02d83e40dd8bdbf9c50f09ca5141aebe338cc527cd9e5aa7f72c441224209dde",
                    vOut: 0,
                    amount: 546
                },
                {
                    txId: "48e2b6dc1e2200713574911f0e33ac2c833433a0b063933024c81cdb0c0aa416",
                    vOut: 1,
                    amount: 100000
                },
            ],
            outputs: [ // at least 1 output for transfer: 1 rune output
                {
                    address: "tb1pw3sxrcsqpgmddjfmtglc9murlsydjt5cqp29fpva44jz0g2pgjvsve8e4j",
                    amount: 546
                }
            ],
            // all remaining satoshi go to the change address below
            address: "tb1qld79qrdvr8ljkl49ph8wxx275y45k0l3jwdzud",
            feePerB: 131,
            runeData: { // in edicts, recommend to use output = 0 instead of 2, to prevent amount mismatch
                "edicts": [
                    {
                      "id": "26e4140001",
                      "amount": 1000,
                      "output": 0
                    }
                  ],
                "etching": null,
                "burn": false
            }
        };

        // expected OP_RETURN script: 6a 09 52 55 4e 45 5f 54 45 53 54 0a 00 83 ed 9f ce ff 01 86 68 00
        let signParams: SignTxParams = {
            privateKey: WIF,
            data: runeTxParams
        };

        const fee = await wallet.estimateFee(signParams)
        expect(fee).toEqual(32881)

        let tx = await wallet.signTransaction(signParams);
        expect(tx).toEqual('02000000000102de9d202412442cf7a75a9ecd27c58c33beae4151ca090fc5f9db8bdd403ed8020000000000ffffffff16a40a0cdb1cc824309363b0a03334832cac330e1f9174357100221edcb6e2480100000000ffffffff032202000000000000225120746061e2000a36d6c93b5a3f82ef83fc08d92e98005454859dad6427a14144990000000000000000166a0952554e455f544553540a0083ed9fceff01866800ac05010000000000160014fb7c500dac19ff2b7ea50dcee3195ea12b4b3ff1024730440220175e616b43ee2423714e2b6d04ba0af205227dc9b29e99f434175141a3ff416b022047dd412f79bd1e4f1128fc6b1a514a2dae1819bdc8f0e524cb842a626f547060012102ad268ae319c4dc271753072ddd690cb6fbe85c3782259daa0faff0919b86e2c4024830450221009475ebd9094776af49337b93ba522327341e772d1f8b8d170699321425346fc30220454f6facda188068e57c89a3fa81856bafce381adfd192128500f21254c684a7012102ad268ae319c4dc271753072ddd690cb6fbe85c3782259daa0faff0919b86e2c400000000')
    });

    test("transfer rune psbt", () => {
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
