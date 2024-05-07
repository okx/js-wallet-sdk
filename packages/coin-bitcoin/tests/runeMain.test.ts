import {BtcWallet, BtcXrcTypes, RuneTestWallet, TBtcWallet} from "../src"
import {buildRuneMainMintData, fromVarInt, toVarInt, toVarIntV2} from "../src/rune"
import {SignTxParams} from "@okxweb3/coin-base";
import {Transaction} from "@okxweb3/coin-bitcoin";


describe('rune test', () => {

    test('rune transfer OP_RETURN test', () => {

        const opReturnScript = buildRuneMainMintData(
            false, [{id:  1234,block:837557, output: 0, amount: "1000",}],true,1,false,0)
        expect(opReturnScript.toString('hex')).toEqual('6a5d0b160100b58f33d209e80700')
        // console.log("0x",opReturnScript.toString('hex'))

        const opReturnScriptBigInt = buildRuneMainMintData(
            false, [{id:  44,block:2584327, output: 0, amount: "1000100010001000100010001000",}],true,1,true,1)
        expect(opReturnScriptBigInt.toString('hex')).toEqual('6a5d1d1487de9d01142c16010087de9d012ce884f8b1a5c4c4b1add48dda3300')
        // console.log("0x",opReturnScriptBigInt.toString('hex'))
    })

    test("segwit_taproot transfer rune", async () => {
        let wallet = new BtcWallet()
        let runeTxParams= {
            type: BtcXrcTypes.RUNEMAIN,
            inputs: [
                {
                    txId: "79b214e9743fbeca4ee753405a08a9daf5b0161b4c0daca74351d8f618ec3457",
                    vOut: 0,
                    amount: 546,
                    address: "bc1pq9cztnve7mcs6xnq3sn556v86ys5pevms8ef6saywqcvhxppgdnspn8msm",
                    data: [{"id": "837557:1234", "amount": "100000"}]
                },
                {
                    txId: "1f2270979662b85422d559b018d5f568c20227d7ae58b1219698c4b759748bc2",
                    vOut: 2,
                    amount: 437670,
                    address: "bc1pq9cztnve7mcs6xnq3sn556v86ys5pevms8ef6saywqcvhxppgdnspn8msm"
                }
            ],
            outputs: [
                { // rune send output
                    address: "bc1p2uaqj7prppg6zdkc58fyms9dsuwauhnhf8cvs2g0crh4ehr4p30q948g2h",
                    amount: 10000,
                    data: {"id": "837557:1234", "amount": "100000"}
                },
            ],
            address: "bc1pq9cztnve7mcs6xnq3sn556v86ys5pevms8ef6saywqcvhxppgdnspn8msm",
            feePerB: 12,
            runeData: {
                "etching": null,
                "useDefaultOutput" : false,
                "defaultOutput": 0,
                "burn": false
            }
        };
        // "mint": true,
        //     "mintNum":1
        let signParams: SignTxParams = {
            privateKey: "KwdkfXMV2wxDVDMPPuFZsio3NeCskAUd4N2U4PriTgpj2MqAGmmc",
            data: runeTxParams
        };
        let fee = await wallet.estimateFee(signParams)
        expect(fee).toEqual(2808)
        let tx = await wallet.signTransaction(signParams);
        console.info(Transaction.fromHex(tx).getId());
        console.info(tx)
        // const partial = /^02000000000102734b56605c57e3511a3dc52c5e5a50217104bb24d8e433dc78926628c56c8a4f0000000000ffffffff734b56605c57e3511a3dc52c5e5a50217104bb24d8e433dc78926628c56c8a4f0200000000ffffffff04220200000000000022512099b87db19a8b792411ae5bff483fe43ff68de5318d286aafd054e9a3da98190c22020000000000001600147d1c5da3f6b93ee9626b0c6713465d4bc8333e7e0000000000000000156a0952554e455f54455354090083ed9fceff016401567001000000000022512099b87db19a8b792411ae5bff483fe43ff68de5318d286aafd054e9a3da98190c0140[0-9a-fA-F]{260}00000000$/
        // expect(tx).toMatch(partial)
    });

    test("segwit_taproot mint rune", async () => {
        // let wallet = new BtcWallet()
        let wallet = new TBtcWallet()
        let runeTxParams= {
            type: BtcXrcTypes.RUNEMAIN,
            inputs: [
                {
                    txId: "ecf5fc66a81b096da5201da18ab5fd3fd31b48a31653f86f6dcfa29b8a2a0606",
                    vOut: 4,
                    amount: 1383332,
                    address: "tb1ppfc0mx9j3070zqleu257zt46ch2v9f9n9urkhlg7n7pswcmpqq0qt3pswx",
                    data: [{"id": "2584327:44", "amount": "420"}]
                }
            ],
            outputs: [
                { // rune send output
                    address: "tb1ppfc0mx9j3070zqleu257zt46ch2v9f9n9urkhlg7n7pswcmpqq0qt3pswx",
                    amount: 1000,
                    data: {"id": "2584327:44", "amount": "420"}
                },
            ],
            address: "tb1ppfc0mx9j3070zqleu257zt46ch2v9f9n9urkhlg7n7pswcmpqq0qt3pswx",
            feePerB: 2,
            runeData: {
                "etching": null,
                "useDefaultOutput" : false,
                "defaultOutput": 0,
                "burn": false,
                "mint": true,
                "mintNum" : 1
            }
        };
        let signParams: SignTxParams = {
            privateKey: "KwdkfXMV2wxDVDMPPuFZsio3NeCskAUd4N2U4PriTgpj2MqAGmmc",
            data: runeTxParams
        };
        let fee = await wallet.estimateFee(signParams)
        console.info(fee)
        expect(fee).toEqual(364)
        let tx = await wallet.signTransaction(signParams);
        // console.info(Transaction.fromHex(tx).getId());
        console.info(tx)
        // const partial = /^02000000000102734b56605c57e3511a3dc52c5e5a50217104bb24d8e433dc78926628c56c8a4f0000000000ffffffff734b56605c57e3511a3dc52c5e5a50217104bb24d8e433dc78926628c56c8a4f0200000000ffffffff04220200000000000022512099b87db19a8b792411ae5bff483fe43ff68de5318d286aafd054e9a3da98190c22020000000000001600147d1c5da3f6b93ee9626b0c6713465d4bc8333e7e0000000000000000156a0952554e455f54455354090083ed9fceff016401567001000000000022512099b87db19a8b792411ae5bff483fe43ff68de5318d286aafd054e9a3da98190c0140[0-9a-fA-F]{260}00000000$/
        // expect(tx).toMatch(partial)
    });

    test("segwit_taproot mul mint rune", async () => {
        let wallet = new TBtcWallet()
        let runeTxParams= {
            type: BtcXrcTypes.RUNEMAIN,
            inputs: [
                {
                    txId: "503879c50ba7b3e4c4731b3d9d3c42414c2eb73e976d92d9cc24fc613f0ed502",
                    vOut: 5,
                    amount: 1375616,
                    address: "tb1ppfc0mx9j3070zqleu257zt46ch2v9f9n9urkhlg7n7pswcmpqq0qt3pswx",
                    data: [{"id": "2584327:44", "amount": "420"}]
                }
            ],
            outputs: [
                { // rune send output
                    address: "tb1ppfc0mx9j3070zqleu257zt46ch2v9f9n9urkhlg7n7pswcmpqq0qt3pswx",
                    amount: 3000,
                    data: {"id": "2584327:44", "amount": "420"}
                },
            ],
            address: "tb1ppfc0mx9j3070zqleu257zt46ch2v9f9n9urkhlg7n7pswcmpqq0qt3pswx",
            feePerB: 2,
            runeData: {
                "etching": null,
                "useDefaultOutput" : false,
                "defaultOutput": 0,
                "burn": false,
                "mint": true,
                "mintNum" : 4
            }
        };
        // "mint": true,
        //     "mintNum":1
        let signParams: SignTxParams = {
            privateKey: "KwdkfXMV2wxDVDMPPuFZsio3NeCskAUd4N2U4PriTgpj2MqAGmmc",
            data: runeTxParams
        };
        let fee = await wallet.estimateFee(signParams)
        console.log(fee)
        expect(fee).toEqual(    [ 622, 278, 278, 278 ])
        let tx = await wallet.signTransaction(signParams);
        // console.info(Transaction.fromHex(tx).getId());
        console.info(tx)
        // const partial = /^0200000000010102d50e3f61fc24ccd9926d973eb72e4c41423c9d3d1b73c4e4b3a70bc57938500500000000ffffffff06b80b0000000000002251200a70fd98b28bfcf103f9e2a9e12ebac5d4c2a4b32f076bfd1e9f83076361001e38030000000000002251200a70fd98b28bfcf103f9e2a9e12ebac5d4c2a4b32f076bfd1e9f83076361001e38030000000000002251200a70fd98b28bfcf103f9e2a9e12ebac5d4c2a4b32f076bfd1e9f83076361001e38030000000000002251200a70fd98b28bfcf103f9e2a9e12ebac5d4c2a4b32f076bfd1e9f83076361001e0000000000000000136a5d101487de9d01142c0087de9d012ca40300b2e51400000000002251200a70fd98b28bfcf103f9e2a9e12ebac5d4c2a4b32f076bfd1e9f83076361001e0140[0-9a-fA-F]{128}00000000$/
        // expect(tx[0]).toMatch(partial)
    });

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
        //

        console.log(toVarIntV2(BigInt(1234)));
        expect(toVarIntV2(BigInt(1234))).toEqual( new Uint8Array([0xd2,0x09]))
        console.log(toVarIntV2(BigInt(837557)));
        expect(toVarIntV2(BigInt(837557))).toEqual( new Uint8Array([0xb5,0x8f,0x33]))
        console.log(toVarIntV2(BigInt(10001000100010001000100010001000)));
        expect(toVarIntV2(BigInt(10001000100010001000100010001000))).toEqual(
            new Uint8Array([0x80,0x80,0x80,0x80,0x80,0x80,0x80,0xfa,0xed,0x99,0x8e,0xcb,0xaf,0xc7,0x1f]))
    })

})
