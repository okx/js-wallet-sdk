import {RuneTestWallet} from "../src"
import {buildRuneData, fromVarInt, toVarInt} from "../src/rune"
import {SignTxParams} from "@okxweb3/coin-base";


describe('rune test', () => {

    test('rune transfer OP_RETURN test', () => {
        const opReturnScript = buildRuneData(false, [{id: 0x2aa16001b, output: 0, amount: 1000}])
        expect(opReturnScript.toString('hex')).toEqual('6a0952554e455f544553540900a9cfd6ff1b866800')
    })

    // https://testnet.runealpha.xyz/txs/9edf897ad90b15b681d0c466d9e4f83c32a60fae21ee1f90313280b86a10dd89
    test("segwit_taproot transfer rune", async () => {
        let wallet = new RuneTestWallet()
        let runeTxParams = {
            inputs: [
                // rune token info
                {
                    txId: "4f8a6cc528669278dc33e4d824bb047121505a5e2cc53d1a51e3575c60564b73",
                    vOut: 0,
                    amount: 546,
                    address: "tb1pnxu8mvv63dujgydwt0l5s0ly8lmgmef3355x4t7s2n568k5cryxqfk78kq",
                    data: [{"id": "26e4140001", "amount": 500}] // maybe many rune token
                },
                // gas fee utxo
                {
                    txId: "4f8a6cc528669278dc33e4d824bb047121505a5e2cc53d1a51e3575c60564b73",
                    vOut: 2,
                    amount: 97570,
                    address: "tb1pnxu8mvv63dujgydwt0l5s0ly8lmgmef3355x4t7s2n568k5cryxqfk78kq"
                },
            ],
            outputs: [
                { // rune send output
                    address: "tb1q05w9mglkhylwjcntp3n3x3jaf0yrx0n7463u2h",
                    amount: 546,
                    data: {"id": "26e4140001", "amount": 100} // one output allow only one rune token
                }
            ],
            address: "tb1pnxu8mvv63dujgydwt0l5s0ly8lmgmef3355x4t7s2n568k5cryxqfk78kq",
            feePerB: 10,
            runeData: {
                "etching": null,
                "burn": false
            }
        };

        let signParams: SignTxParams = {
            privateKey: "cNtoPYke9Dhqoa463AujyLzeas8pa6S15BG1xDSRnVmcwbS9w7rS",
            data: runeTxParams
        };
        let tx = await wallet.signTransaction(signParams);
        console.info(tx)
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
    })

})
