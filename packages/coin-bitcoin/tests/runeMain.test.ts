import {
    BtcWallet,
    BtcXrcTypes, dogeCoin,
    extractPsbtTransaction,
    networks, psbtDecode,
    psbtSign,
    psbtSignImpl,
    RuneTestWallet,
    TBtcWallet
} from "../src"
import {buildRuneMainMintData, fromVarInt, toVarInt, toVarIntV2} from "../src/rune"
import {SignTxParams} from "@okxweb3/coin-base";
import {base, signUtil} from '@okxweb3/crypto-lib';
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
                    txId: "ec5d3b90d3e3d80b0604902b383cdd5f41c3d4c89d6391e7afb93f94b1b110f8",
                    vOut: 0,
                    amount: 546,
                    address: "bc1pq9cztnve7mcs6xnq3sn556v86ys5pevms8ef6saywqcvhxppgdnspn8msm",
                    data: [{"id": "840289:2103", "amount": "299999"}]
                },
                {
                    txId: "e28740172d21f206582928931c796792e8e5234acfe6273d8de847f522f0131f",
                    vOut: 3,
                    amount: 340102,
                    address: "bc1pq9cztnve7mcs6xnq3sn556v86ys5pevms8ef6saywqcvhxppgdnspn8msm"
                }
            ],
            outputs: [
                { // rune send output
                    address: "bc1pq9cztnve7mcs6xnq3sn556v86ys5pevms8ef6saywqcvhxppgdnspn8msm",
                    amount: 546,
                    data: {"id": "840289:2103", "amount": "219999"}
                },
                { // rune send output
                    address: "bc1pq9cztnve7mcs6xnq3sn556v86ys5pevms8ef6saywqcvhxppgdnspn8msm",
                    amount: 546,
                    data: {"id": "840289:2103", "amount": "80000"}
                },
            ],
            address: "bc1pq9cztnve7mcs6xnq3sn556v86ys5pevms8ef6saywqcvhxppgdnspn8msm",
            feePerB: 16,
            runeData: {
                "etching": null,
                "useDefaultOutput" : false,
                "defaultOutput": 0,
                "burn": false
            }
        };
        let signParams: SignTxParams = {
            privateKey: "KwdkfXMV2wxDVDMPPuFZsio3NeCskAUd4N2U4PriTgpj2MqAGmmc",
            data: runeTxParams
        };
        let fee = await wallet.estimateFee(signParams)
        expect(fee).toEqual(4528)
        let tx = await wallet.signTransaction(signParams);
        // console.info(tx)
        const partial = /^02000000000102f810b1b1943fb9afe791639dc8d4c3415fdd3c382b9004060bd8e3d3903b5dec0000000000ffffffff1f13f022f547e88d3d27e6cf4a23e5e89267791c9328295806f2212d174087e20300000000ffffffff042202000000000000225120017025cd99f6f10d1a608c274a6987d12140e59b81f29d43a47030cb982143672202000000000000225120017025cd99f6f10d1a608c274a6987d12140e59b81f29d43a47030cb982143670000000000000000136a5d1000e1a433b710dfb60d00000080f10401b41c050000000000225120017025cd99f6f10d1a608c274a6987d12140e59b81f29d43a47030cb982143670140.*/
        expect(tx).toMatch(partial)
    });

    test("segwit_taproot mint rune", async () => {
        let wallet = new BtcWallet()
        // let wallet = new TBtcWallet()
        let runeTxParams= {
            type: BtcXrcTypes.RUNEMAIN,
            inputs: [
                {
                    txId: "5fd5e4e73b8e26397cb1b8447ad238ea68da51ff6bd3a7c4774ff6a86ab18be4",
                    vOut: 2,
                    amount: 350482,
                    address: "bc1pq9cztnve7mcs6xnq3sn556v86ys5pevms8ef6saywqcvhxppgdnspn8msm",
                    data: [{"id": "840289:2103", "amount": "299.999"}]
                }
            ],
            outputs: [
                { // rune send output
                    address: "bc1pq9cztnve7mcs6xnq3sn556v86ys5pevms8ef6saywqcvhxppgdnspn8msm",
                    amount: 546,
                    data:{"id": "840289:2103", "amount": "299.999"}
                },
            ],
            address: "bc1pq9cztnve7mcs6xnq3sn556v86ys5pevms8ef6saywqcvhxppgdnspn8msm",
            feePerB: 16,
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
        expect(fee).toEqual(2896)
        let tx = await wallet.signTransaction(signParams);
        // console.info(Transaction.fromHex(tx).getId());
        console.info(tx)
        const partial = /^02000000000101e48bb16aa8f64f77c4a7d36bff51da68ea38d27a44b8b17c39268e3be7e4d55f0200000000ffffffff032202000000000000225120017025cd99f6f10d1a608c274a6987d12140e59b81f29d43a47030cb982143670000000000000000126a5d0f14e1a43314b71000e1a433b7100100a04b050000000000225120017025cd99f6f10d1a608c274a6987d12140e59b81f29d43a47030cb982143670140.*/
        expect(tx).toMatch(partial)
    });

    test("segwit_taproot mul mint rune", async () => {
        let wallet = new BtcWallet()
        let runeTxParams= {
            type: BtcXrcTypes.RUNEMAIN,
            inputs: [
                {
                    txId: "2119d092a07a254bc67aa27a21fa634523b185d2cc28a69dc079f30c579d93db",
                    vOut: 2,
                    amount: 347040,
                    address: "bc1pq9cztnve7mcs6xnq3sn556v86ys5pevms8ef6saywqcvhxppgdnspn8msm",
                    data: [{"id": "840289:2103", "amount": "299.999"}]
                }
            ],
            outputs: [
                { // rune send output
                    address: "bc1pq9cztnve7mcs6xnq3sn556v86ys5pevms8ef6saywqcvhxppgdnspn8msm",
                    amount: 600,
                    data:  {"id": "840289:2103", "amount": "299.999"}
                },
            ],
            address: "bc1pq9cztnve7mcs6xnq3sn556v86ys5pevms8ef6saywqcvhxppgdnspn8msm",
            feePerB: 16,
            runeData: {
                "etching": null,
                "useDefaultOutput" : false,
                "defaultOutput": 0,
                "burn": false,
                "mint": true,
                "mintNum" : 2
            }
        };
        let signParams: SignTxParams = {
            privateKey: "KwdkfXMV2wxDVDMPPuFZsio3NeCskAUd4N2U4PriTgpj2MqAGmmc",
            data: runeTxParams
        };
        let fee = await wallet.estimateFee(signParams)
        // console.log(fee)
        expect(fee).toEqual(   [ 3584, 2208 ])
        let tx = await wallet.signTransaction(signParams);
        // console.info(Transaction.fromHex(tx).getId());
        console.info(tx)
        const partial = /^02000000000101db939d570cf379c09da628ccd285b1234563fa217aa27ac64b257aa092d019210200000000ffffffff045802000000000000225120017025cd99f6f10d1a608c274a6987d12140e59b81f29d43a47030cb98214367c20a000000000000225120017025cd99f6f10d1a608c274a6987d12140e59b81f29d43a47030cb982143670000000000000000126a5d0f14e1a43314b71000e1a433b71001008630050000000000225120017025cd99f6f10d1a608c274a6987d12140e59b81f29d43a47030cb982143670140.*/
        expect(tx[0]).toMatch(partial)
        const partial2 = /^020000000001011f13f022f547e88d3d27e6cf4a23e5e89267791c9328295806f2212d174087e20100000000ffffffff022202000000000000225120017025cd99f6f10d1a608c274a6987d12140e59b81f29d43a47030cb982143670000000000000000126a5d0f14e1a43314b71000e1a433b71001000140.*/
        expect(tx[1]).toMatch(partial2)
    });

    test("serial mint rune", async () => {
        let wallet = new BtcWallet()
        let runeTxParams= {
            type: BtcXrcTypes.RUNEMAIN,
            inputs: [
                {
                    txId: "c22c21e19f6162b98bf61e7cb9fa49e5edb8027e041ac805b4d96161d3ec2bb4",
                    vOut: 2,
                    amount: 628943,
                    address: "bc1pq9cztnve7mcs6xnq3sn556v86ys5pevms8ef6saywqcvhxppgdnspn8msm",
                    data: [{"id": "840289:2103", "amount": "299.999"}]
                }
            ],
            outputs: [
                { // rune send output
                    address: "bc1pq9cztnve7mcs6xnq3sn556v86ys5pevms8ef6saywqcvhxppgdnspn8msm",
                    amount: 546,
                    data:  {"id": "840289:2103", "amount": "299.999"}
                },
            ],
            address: "bc1pq9cztnve7mcs6xnq3sn556v86ys5pevms8ef6saywqcvhxppgdnspn8msm",
            feePerB: 10,
            runeData: {
                "serialMint" : true,
                "mint": true,
                "mintNum" :5
            }
        };
        let signParams: SignTxParams = {
            privateKey: "KwdkfXMV2wxDVDMPPuFZsio3NeCskAUd4N2U4PriTgpj2MqAGmmc",
            data: runeTxParams
        };
        let fee = await wallet.estimateFee(signParams)
        // console.log(fee)
        expect(fee).toEqual(     [ 1730, 1300, 1300, 1300, 1300 ])
        let tx = await wallet.signTransaction(signParams);
        // console.info(tx)
        const partial = /^02000000000101b42becd36161d9b405c81a047e02b8ede549fab97c1ef68bb962619fe1212cc20200000000ffffffff037216000000000000225120017025cd99f6f10d1a608c274a6987d12140e59b81f29d43a47030cb9821436700000000000000000a6a5d0714e1a43314b7109b7b090000000000225120017025cd99f6f10d1a608c274a6987d12140e59b81f29d43a47030cb982143670140.*/
        expect(tx[0]).toMatch(partial)
        const partial2 = /^02000000000101757fb2398cf0673ca0b3cfdee548d2c7c14ab7b8941760b1a6a891bee77e21b60000000000ffffffff022202000000000000225120017025cd99f6f10d1a608c274a6987d12140e59b81f29d43a47030cb9821436700000000000000000a6a5d0714e1a43314b7100140.*/
        expect(tx[4]).toMatch(partial2)
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
        console.log(toVarIntV2(BigInt(840289)));
        console.log(toVarIntV2(BigInt(80000)));

        console.log(toVarIntV2(BigInt(1234)));
        expect(toVarIntV2(BigInt(1234))).toEqual( new Uint8Array([0xd2,0x09]))
        console.log(toVarIntV2(BigInt(837557)));
        expect(toVarIntV2(BigInt(837557))).toEqual( new Uint8Array([0xb5,0x8f,0x33]))
        console.log(toVarIntV2(BigInt(10001000100010001000100010001000)));
        expect(toVarIntV2(BigInt(10001000100010001000100010001000))).toEqual(
            new Uint8Array([0x80,0x80,0x80,0x80,0x80,0x80,0x80,0xfa,0xed,0x99,0x8e,0xcb,0xaf,0xc7,0x1f]))
    })

    test("rune split tools psbt", async () => {
        let wallet = new BtcWallet()
        let runeTxParams= {
            type: BtcXrcTypes.PSBT_RUNEMAIN,
            inputs: [
                {
                    txId: "d03ac72f106c5b20f093a0de7682da4dcef89f20a8a88a88f4fdc2e66e0161b9",
                    vOut: 1,
                    amount: 546,
                    address: "bc1pq9cztnve7mcs6xnq3sn556v86ys5pevms8ef6saywqcvhxppgdnspn8msm",
                },
                {
                    txId: "d03ac72f106c5b20f093a0de7682da4dcef89f20a8a88a88f4fdc2e66e0161b9",
                    vOut: 3,
                    amount: 335028,
                    address: "bc1pq9cztnve7mcs6xnq3sn556v86ys5pevms8ef6saywqcvhxppgdnspn8msm"
                }
            ],
            outputs: [
                { // rune send output
                    address: "bc1pq9cztnve7mcs6xnq3sn556v86ys5pevms8ef6saywqcvhxppgdnspn8msm",
                    amount: 546,
                },
                { // rune send output
                    address: "bc1pq9cztnve7mcs6xnq3sn556v86ys5pevms8ef6saywqcvhxppgdnspn8msm",
                    amount: 546,
                },
            ],
            address: "bc1pq9cztnve7mcs6xnq3sn556v86ys5pevms8ef6saywqcvhxppgdnspn8msm",
            feePerB: 16,
            runeData: {
                "edicts": [
                    {id:2103,block:840289,output:0,amount:"4"},
                    {id:2103,block:840289,output:4,amount:"3"},
                ],
                "useDefaultOutput" : false,
                "defaultOutput": 0,
            }
        };
        let signParams: SignTxParams = {
            privateKey: "KwdkfXMV2wxDVDMPPuFZsio3NeCskAUd4N2U4PriTgpj2MqAGmmc",
            data: runeTxParams
        };
        const opReturnScript = buildRuneMainMintData(
            false, [
                {id:  2103,block:840289, output: 0, amount: "4",},
                {id:  2103,block:840289, output: 4, amount: "3",}
            ],false,0,false,0)
        expect(opReturnScript.toString('hex')).toEqual('6a5d0c00e1a433b710040000000304')
        // console.log(opReturnScript.toString('hex'))

        let res = await wallet.signTransaction(signParams)
        let curPsbt = res[0]
        let curChangeAmount = res[1]
        expect(curPsbt).toEqual("70736274ff0100f50200000002b961016ee6c2fdf4888aa8a8209ff8ce4dda8276dea093f0205b6c102fc73ad00100000000ffffffffb961016ee6c2fdf4888aa8a8209ff8ce4dda8276dea093f0205b6c102fc73ad00300000000ffffffff042202000000000000225120017025cd99f6f10d1a608c274a6987d12140e59b81f29d43a47030cb982143672202000000000000225120017025cd99f6f10d1a608c274a6987d12140e59b81f29d43a47030cb9821436700000000000000000f6a5d0c00e1a433b7100400000003042209050000000000225120017025cd99f6f10d1a608c274a6987d12140e59b81f29d43a47030cb98214367000000000001012b2202000000000000225120017025cd99f6f10d1a608c274a6987d12140e59b81f29d43a47030cb982143670001012bb41c050000000000225120017025cd99f6f10d1a608c274a6987d12140e59b81f29d43a47030cb982143670000000000")
        expect(curChangeAmount).toEqual(330018)

        let signed = psbtSign(base.toBase64(base.fromHex(curPsbt)),signParams.privateKey,wallet.network())
        // console.log(signed)

        const tx = extractPsbtTransaction(base.toHex(base.fromBase64(signed)), wallet.network() )
        const partial = /^02000000000102b961016ee6c2fdf4888aa8a8209ff8ce4dda8276dea093f0205b6c102fc73ad00100000000ffffffffb961016ee6c2fdf4888aa8a8209ff8ce4dda8276dea093f0205b6c102fc73ad00300000000ffffffff042202000000000000225120017025cd99f6f10d1a608c274a6987d12140e59b81f29d43a47030cb982143672202000000000000225120017025cd99f6f10d1a608c274a6987d12140e59b81f29d43a47030cb9821436700000000000000000f6a5d0c00e1a433b7100400000003042209050000000000225120017025cd99f6f10d1a608c274a6987d12140e59b81f29d43a47030cb982143670140.*/
        expect(tx).toMatch(partial)
    });
})
