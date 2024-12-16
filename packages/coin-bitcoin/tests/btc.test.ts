import * as bitcoin from '../src';
import {
    BtcWallet,
    convert2LegacyAddress,
    isCashAddress,
    networks,
    oneKeyBuildBtcTx,
    private2Wif,
    TBtcWallet,
    utxoTx,
    ValidateBitcashP2PkHAddress,
    ValidSignedTransaction,
    message,
    DogeWallet,
    LtcWallet, calculateTxSize
} from '../src';
import {Transaction,} from '../src/bitcoinjs-lib'

import {base} from "@okxweb3/crypto-lib";
import {SignTxParams, VerifyMessageParams} from "@okxweb3/coin-base";
import {countAdjustedVsize} from "../src/sigcost";
import {test} from "@jest/globals";
import assert from "assert";

describe("bitcoin", () => {

    test("validPrivateKey", async () => {
        const wallet = new BtcWallet();
        const res = await wallet.validPrivateKey({privateKey:"KwTqEP5swztao5UdMWpxaAGtvmvQFjYGe1UDyrsZxjkLX9KVpN36"});
        expect(res.isValid).toEqual(true);
    });

    test("signCommonMsg", async () => {
        let wallet = new BtcWallet();
        let sig = await wallet.signCommonMsg({privateKey:"0743bf0e3864122edff9f143006f0a0d61b16df3f676c8070dac1d0f42d78353", message:{walletId:"123456789"}});
        assert.strictEqual(sig,"1b87feb2cc194b8d41a9c6ff0dc0ddba952c7ba73936d3f0361d498341716c2b34426876ef21ad4f5f94482bafe72a418729737b9461303be9da2be849a4123f02")
    });


    test("getNewAddress", async () => {
        const wallet = new BtcWallet();
        //1GhLyRg4zzFixW3ZY5ViFzT4W5zTT9h7Pc
        expect((await wallet.getNewAddress({privateKey:"KwTqEP5swztao5UdMWpxaAGtvmvQFjYGe1UDyrsZxjkLX9KVpN36"})).address).toEqual("1GhLyRg4zzFixW3ZY5ViFzT4W5zTT9h7Pc");
        //bc1q4s4n983qnlhppajgn8enmgn4dts7g3c74jnwpd
        expect((await wallet.getNewAddress({privateKey:"KwTqEP5swztao5UdMWpxaAGtvmvQFjYGe1UDyrsZxjkLX9KVpN36",addressType:'segwit_native'})).address).toEqual("bc1q4s4n983qnlhppajgn8enmgn4dts7g3c74jnwpd");
        //3FAS9ewd56NoQkZCccAJonDyTkubU87qrt
        expect((await wallet.getNewAddress({privateKey:"KwTqEP5swztao5UdMWpxaAGtvmvQFjYGe1UDyrsZxjkLX9KVpN36",addressType:'segwit_nested'})).address).toEqual("3FAS9ewd56NoQkZCccAJonDyTkubU87qrt");
        //bc1ptdyzxxmr4qm6cvgdug5u9n0ns8fdjr3m294y7ec5nffhuz3pnk3s6upms2
        expect((await wallet.getNewAddress({privateKey:"KwTqEP5swztao5UdMWpxaAGtvmvQFjYGe1UDyrsZxjkLX9KVpN36",addressType:'segwit_taproot'})).address).toEqual("bc1ptdyzxxmr4qm6cvgdug5u9n0ns8fdjr3m294y7ec5nffhuz3pnk3s6upms2");
    });

    const ps: any[] = [];
    ps.push("");
    ps.push("0x");
    ps.push("124699");
    ps.push("1dfi付");
    ps.push("9000 12");
    ps.push("548yT115QRHH7Mpchg9JJ8YPX9RTKuan=548yT115QRHH7Mpchg9JJ8YPX9RTKuan ");
    ps.push("L1vSc9DuBDeVkbiS79mJ441FNAYArL1vSc9DuBDeVkbiS79mJ441FNAYArL1vSc9DuBDeVkbiS79mJ441FNAYArL1vSc9DuBDeVkbiS79mJ441FNAYAr");
    ps.push("L1v");
    ps.push("0x31342f041c5b54358074b4579231c8a300be65e687dff020bc7779598b428 97a");
    ps.push("0x31342f041c5b54358074b457。、。9231c8a300be65e687dff020bc7779598b428 97a");
    test("edge test", async () => {
        const wallet = new BtcWallet();
        let j = 1;
        for (let i = 0; i < ps.length; i++) {
            try {
                await wallet.getNewAddress({privateKey: ps[i]});
            } catch (e) {
                j = j + 1
            }
        }
        expect(j).toEqual(ps.length+1);
    });

    test("private key", async () => {
        let wallet = new BtcWallet()
        let key = await wallet.getRandomPrivateKey()
        console.log(key)
    })

    test("sigops", async () => {
        // let tx1 = Transaction.fromHex('02000000000101a83e02f4c0d7593cf99a231bdce9217b177f3d95bb856cd0047d2b08bacf8d8b1100000000fdffffff041603000000000000225120560101ab4b000a3ea5ad1831da7fe22dab3d2ef940be9baa71caeba9a4e0317016030000000000006951210369a50ef8d7670d8450bd9391679f7a38816fec8218df4e4269fbe9dfd2a08c002102ca8c22d6d197d969c0c2464a889da4530725b41b92339fac7efc15c10b2be4002102020202020202020202020202020202020202020202020202020202020202020253ae160300000000000069512103c824f43a3b4be0e135b3c6b4bebd8ad85e053deeafe2411febc84ed195a9a10021029a81479cc5c3df9dd2518f6202d24e616b9ddd2e105f38899526769c11c1ed002102020202020202020202020202020202020202020202020202020202020202020253aecf4331000000000022512024ed31a6d9fa2ba61da9a54eea898751e26ca1f80fdcb56eb43115ae338148f60140512bea3e6dd68deece714e4942ab03f0976244fa159f48f3d7e34d40265d30f3ce0aa5cf55765aacc95a9a5a594c932a5f332df6f8d321a96ddddb577d6886e400000000')
        // let sigops = countAdjustedVsize(tx1, ['bc1pynknrfkelg46v8df548w4zv8283xeg0cplwt2m45xy26uvupfrmqaae4rh'], bitcoin.networks.bitcoin)
        // console.log(sigops)
        // expect(sigops).toEqual(800)
        let tx2 = Transaction.fromHex('010000000001014be5c783c573d4ce0f8f752627c667283ec39ff2bf7769d850374d078ffaab063d00000000fdffffff16d84a010000000000225120f26a8986239f71485ac3dbcd39b18fd0fc15f1ef22a8067a64a577c4f3cc42c8d84a01000000000022512077141f949a62c03719dec82d54389305c44c3c3b1ebc42623bb04b7b5a6e349bd84a010000000000225120a2a2ebf35ad94f09e13492c031123c4ae534a21e520b86c05cb12b85e37ad0b6d84a0100000000002251206b7b045a0ae58a60facc9799f25f4a0b5b1acb9ede679426532ec930aa9994a2d84a01000000000022512027c1b38d1973db28de23b0251966a26e697aac6d09a13a15a668c03f9624088ed84a010000000000225120a9fbc2fe8b94740a2cde443c97e0cf936f5900b0f469fc5f4f481ef74724f434d84a0100000000002251201aa60c421f9dbe3b9025d152a960d3ffc6bca4fbd6e274331a1e9a533e12e964d84a010000000000225120f4905783806158031824ec43320c3ce9250fc04c86513f178fd4e00e13065990d84a010000000000225120d6bd55f3a70e8d54c901f5fb28e5940affe26a337a385a93daa9705a370939cdd84a0100000000002251203672ff9144b06725bf92e8bb33ad9345054d0295e648e27bfa733a8b9393c3407d3a0000000000002251209b57783ff38333b575f35634ba9795d28dddbe75b0e5fd582974df3b4f0fc37c9065000000000000225120d338e783109dae186a14e79742293157082123a00f7a0c4a276851259563ae6d9065000000000000225120d338e783109dae186a14e79742293157082123a00f7a0c4a276851259563ae6d9065000000000000225120d338e783109dae186a14e79742293157082123a00f7a0c4a276851259563ae6d9065000000000000225120d338e783109dae186a14e79742293157082123a00f7a0c4a276851259563ae6d9065000000000000225120d338e783109dae186a14e79742293157082123a00f7a0c4a276851259563ae6d9065000000000000225120d338e783109dae186a14e79742293157082123a00f7a0c4a276851259563ae6d9065000000000000225120d338e783109dae186a14e79742293157082123a00f7a0c4a276851259563ae6d9065000000000000225120d338e783109dae186a14e79742293157082123a00f7a0c4a276851259563ae6d9065000000000000225120d338e783109dae186a14e79742293157082123a00f7a0c4a276851259563ae6d9065000000000000225120d338e783109dae186a14e79742293157082123a00f7a0c4a276851259563ae6d4ffc1f0000000000225120d1b44e843c8506bca89545eab8966f4b8d1df0598da5cd7a96e87dbded49d1870140bbea286737b78ce41c9297f67f169b11c99ae2a080d97c6b83ae8554c476f1717ae01b4ddc5548bde092244a554d5d36001c72be2020b09c8aff9e068d06b18200000000')
        let sigops2 = countAdjustedVsize(tx2, ['bc1p6x6yappus5rte2y4gh4t39n0fwx3muze3kju675kap7mmm2f6xrs04fd6s'], bitcoin.networks.bitcoin)
        console.log(sigops2)
        expect(sigops2).toEqual(1014)
    })



    test("bitcoin address", async () => {
        let privateKey = "cNtoPYke9Dhqoa463AujyLzeas8pa6S15BG1xDSRnVmcwbS9w7rS"

        let btcWallet = new TBtcWallet();
        let param = {
            privateKey: privateKey,
            addressType: "Legacy"
        }
        let address = await btcWallet.getNewAddress(param);
        console.info("Legacy address: ", address)

        param = {
            privateKey: privateKey,
            addressType: "segwit_native"
        }
        address = await btcWallet.getNewAddress(param);
        console.info("segwit_native address: ", address)

        param = {
            privateKey: privateKey,
            addressType: "segwit_nested"
        }
        address = await btcWallet.getNewAddress(param);
        console.info("segwit_nested address: ", address)

        param = {
            privateKey: privateKey,
            addressType: "segwit_taproot"
        }
        address = await btcWallet.getNewAddress(param);
        console.info("segwit_taproot address: ", address)
    });

    test("decode psbt inputs", async () => {
        let wallet = new BtcWallet()
        let signParams: SignTxParams = {
            privateKey: '',
            data: {
                type: 104,
                psbt: '70736274ff0100fd2a0102000000042abff6e837b2e3ea6d13964118da432095207bd9e178d57dbbc84e5765c1338a0200000000ffffffffcdc840d9b23927a13c596d1c94630aeb8da32498f4f4c56065209557f11dd8780000000000ffffffffcdc840d9b23927a13c596d1c94630aeb8da32498f4f4c56065209557f11dd8780100000000ffffffffcdc840d9b23927a13c596d1c94630aeb8da32498f4f4c56065209557f11dd8780400000000ffffffff04d0070000000000001600145c005c5532ce810ddf20f9d1d939631b47089ecdd0070000000000001600145c005c5532ce810ddf20f9d1d939631b47089ecd204e0000000000001600145c005c5532ce810ddf20f9d1d939631b47089ecd204e0000000000001600145c005c5532ce810ddf20f9d1d939631b47089ecd0000000000010120e23505000000000017a914ef05515a0595d15eaf90d9f62fb85873a6d8c0b48701041600145c005c5532ce810ddf20f9d1d939631b47089ecd2206023f25a35d20804305e70f4223ed6b3aeb268b6781b95b6e5f7c84465f283c242518a22e8e3231000080000000800000008000000000000000000001011f400d0300000000001600145c005c5532ce810ddf20f9d1d939631b47089ecd2206023f25a35d20804305e70f4223ed6b3aeb268b6781b95b6e5f7c84465f283c242518a22e8e323100008000000080000000800000000000000000000100fd300302000000000104870fa29a7da1acff1cd4fb274fd15904ff1c867ad41d309577d4c8268ad0b9250000000000ffffffff1558fd0c79199219e27ce50e07a84c4b01d7563e5c53f9e6550d7c4450aa596d000000006b483045022100bd9b8c17d68efed18f0882bdb77db303a0a547864305e32ed7a9a951b650caa90220131c361e5c27652a3a05603306a87d8f6e117b78fdb1082db23d8960eb6214bf01210357bbb2d4a9cb8a2357633f201b9c518c2795ded682b7913c6beef3fe23bd6d2fffffffff06424462f9b8179b1cdc6229a4e213ff3628060b2a0a7680dae6740405cee3460000000000ffffffffa21ba51db540d68c0feaf3fb958058e1f2f123194f9238d9b2c86e04106c69d100000000171600145c005c5532ce810ddf20f9d1d939631b47089ecdffffffff06400d0300000000001600145c005c5532ce810ddf20f9d1d939631b47089ecd400d0300000000001976a9145c005c5532ce810ddf20f9d1d939631b47089ecd88aca08601000000000017a914ef05515a0595d15eaf90d9f62fb85873a6d8c0b487e4c2030000000000225120b7ee7f83a6a7fdb513040856c56778aa3abea9a451e0c9bb012f22a77ed99b21e803000000000000225120b7ee7f83a6a7fdb513040856c56778aa3abea9a451e0c9bb012f22a77ed99b21e803000000000000225120b7ee7f83a6a7fdb513040856c56778aa3abea9a451e0c9bb012f22a77ed99b2102483045022100a1d12dee8d87d2f8a12ff43f656a6b52183fa5ce4ffd1ab349b978d4dc5e68620220060d8c6d20ea34d3b2f744624d9f027c9020cb80cfb9babe015ebd70db0a927a01210357bbb2d4a9cb8a2357633f201b9c518c2795ded682b7913c6beef3fe23bd6d2f000141f24c018bc95e051c33e4659cacad365db8f3afbaf61ee163e3e1bf1d419baaeb681f681c75a545a19d4ade0b972e226448015d9cbdaee121f4148b5bee9d27068302483045022100bb251cc4a4db4eab3352d54541a03d20d5067e8261b6f7ba8a20a7d955dfafde022078be1dd187ff61934177a9245872f4a90beef32ec40b69f75d9c50c32053d97101210357bbb2d4a9cb8a2357633f201b9c518c2795ded682b7913c6beef3fe23bd6d2f00000000010122400d0300000000001976a9145c005c5532ce810ddf20f9d1d939631b47089ecd88ac2206023f25a35d20804305e70f4223ed6b3aeb268b6781b95b6e5f7c84465f283c242518a22e8e3231000080000000800000008000000000000000000001012be803000000000000225120b7ee7f83a6a7fdb513040856c56778aa3abea9a451e0c9bb012f22a77ed99b2121163f25a35d20804305e70f4223ed6b3aeb268b6781b95b6e5f7c84465f283c2425390157bbb2d4a9cb8a2357633f201b9c518c2795ded682b7913c6beef3fe23bd6d2fa22e8e32310000800000008000000080000000000000000001172057bbb2d4a9cb8a2357633f201b9c518c2795ded682b7913c6beef3fe23bd6d2f0000000000',
            },
        };
        let tx = await wallet.signTransaction(signParams);
        console.log(tx)
        expect(tx.length).toEqual(4)
        expect(tx[0].txId).toEqual('8a33c165574ec8bb7dd578e1d97b20952043da184196136deae3b237e8f6bf2a')
    })

    test("legacy tx sign", async () => {
        let wallet = new TBtcWallet()
        let btcTxParams = {
            inputs: [
                {
                    txId: "a7881146cc7671ad89dcd1d99015ed7c5e17cfae69eedd01f73f5ab60a6c1318",
                    vOut: 0,
                    amount: 100000
                },
            ],
            outputs: [
                {
                    address: "mtgeXXEDSKDBJoaWgmSv51tPceEQBihgCz",
                    amount: 50000
                }
            ],
            address: "mtgeXXEDSKDBJoaWgmSv51tPceEQBihgCz",
            feePerB: 2
        };

        let signParams: SignTxParams = {
            privateKey: "cNtoPYke9Dhqoa463AujyLzeas8pa6S15BG1xDSRnVmcwbS9w7rS",
            data: btcTxParams
        };
        let tx = await wallet.signTransaction(signParams);
        console.info(tx);
    })

    test("calculateTxSize", async () => {
        const inputs = [
            {
                txId: 'a7881146cc7671ad89dcd1d99015ed7c5e17cfae69eedd01f73f5ab60a6c1318',
                vOut: 0,
                amount: 50000,
                address: 'tb1qjph0dpexkz6wg36sz5xygj2qjehm4yc3628yst'
            }
        ]
        const outputs =
            [
                {
                    address: 'tb1qjph0dpexkz6wg36sz5xygj2qjehm4yc3628yst',
                    amount: 10000
                }
            ]
        // @ts-ignore
        const res = calculateTxSize(inputs, outputs, 'tb1qjph0dpexkz6wg36sz5xygj2qjehm4yc3628yst', 'cNtoPYke9Dhqoa463AujyLzeas8pa6S15BG1xDSRnVmcwbS9w7rS', networks.testnet, 546, false)
        console.log('res', res)
        console.log('virtualSize', res.virtualSize)
    })
    test("segwit_native tx sign", async () => {
        let wallet = new TBtcWallet()
        let btcTxParams = {
            inputs: [
                {
                    txId: "a7881146cc7671ad89dcd1d99015ed7c5e17cfae69eedd01f73f5ab60a6c1318",
                    vOut: 0,
                    amount: 100000,
                    address: "tb1qjph0dpexkz6wg36sz5xygj2qjehm4yc3628yst"
                },
            ],
            outputs: [
                {
                    address: "tb1qjph0dpexkz6wg36sz5xygj2qjehm4yc3628yst",
                    amount: 9500
                }
            ],
            address: "tb1qjph0dpexkz6wg36sz5xygj2qjehm4yc3628yst",
            feePerB: 402.8
        };

        let signParams: SignTxParams = {
            privateKey: "cNtoPYke9Dhqoa463AujyLzeas8pa6S15BG1xDSRnVmcwbS9w7rS",
            data: btcTxParams
        };
      let txfee = await wallet.estimateFee(signParams);
      console.info(txfee);
        let tx = await wallet.signTransaction(signParams);
        console.info(tx);
    })

    test("segwit_nested tx sign", async () => {
        let wallet = new TBtcWallet()
        let btcTxParams = {
            inputs: [
                {
                    txId: "a7881146cc7671ad89dcd1d99015ed7c5e17cfae69eedd01f73f5ab60a6c1318",
                    vOut: 0,
                    amount: 50000,
                    address: "2NEkMqRMsL31jVY5Hu7D4AGKphQDDChrW4q"
                },
            ],
            outputs: [
                {
                    address: "2NEkMqRMsL31jVY5Hu7D4AGKphQDDChrW4q",
                    amount: 1000
                }
            ],
            address: "2NEkMqRMsL31jVY5Hu7D4AGKphQDDChrW4q",
            feePerB: 2
        };

        let signParams: SignTxParams = {
            privateKey: "cNtoPYke9Dhqoa463AujyLzeas8pa6S15BG1xDSRnVmcwbS9w7rS",
            data: btcTxParams
        };
        let tx = await wallet.signTransaction(signParams);
        console.info(tx);
    })

    test("segwit_taproot tx sign", async () => {
        let wallet = new TBtcWallet()
        let btcTxParams = {
            inputs: [
                {
                    txId: "a7881146cc7671ad89dcd1d99015ed7c5e17cfae69eedd01f73f5ab60a6c1318",
                    vOut: 0,
                    amount: 50000,
                    address: "tb1pnxu8mvv63dujgydwt0l5s0ly8lmgmef3355x4t7s2n568k5cryxqfk78kq"
                },
            ],
            outputs: [
                {
                    address: "tb1pnxu8mvv63dujgydwt0l5s0ly8lmgmef3355x4t7s2n568k5cryxqfk78kq",
                    amount: 1000
                }
            ],
            address: "tb1pnxu8mvv63dujgydwt0l5s0ly8lmgmef3355x4t7s2n568k5cryxqfk78kq",
            feePerB: 2
        };

        let signParams: SignTxParams = {
            privateKey: "cNtoPYke9Dhqoa463AujyLzeas8pa6S15BG1xDSRnVmcwbS9w7rS",
            data: btcTxParams
        };
        let tx = await wallet.signTransaction(signParams);
        console.info(tx);
    })

    test("tx sign", async () => {
        let wallet = new TBtcWallet()
        let btcTxParams = {
            inputs: [
                {
                    txId: "a7edebed3f2e51a2ed99a3625fb408bd9db2ce61b1794880b3f214b26bf7a023",
                    vOut: 0,
                    amount: 250000
                },
            ],
            memo: "=:e:0x8b94c64ff7d39caaaac24450eb665e4edf6af0e9::t:30",
            outputs: [
                {
                    address: "tb1qtsq9c4fje6qsmheql8gajwtrrdrs38kdzeersc",
                    amount: 150000
                }
            ],
            memoPos: -1,
            address: "2NF33rckfiQTiE5Guk5ufUdwms8PgmtnEdc",
            feePerB: 2.11
        };

        let signParams: SignTxParams = {
            privateKey: "cPnvkvUYyHcSSS26iD1dkrJdV7k1RoUqJLhn3CYxpo398PdLVE22",
            data: btcTxParams
        };
        let tx = await wallet.signTransaction(signParams);
        console.info(tx);
        expect(tx).toEqual('0200000000010123a0f76bb214f2b3804879b161ceb29dbd08b45f62a399eda2512e3fedebeda700000000171600145c005c5532ce810ddf20f9d1d939631b47089ecdffffffff03f0490200000000001600145c005c5532ce810ddf20f9d1d939631b47089ecdbe8401000000000017a914ef05515a0595d15eaf90d9f62fb85873a6d8c0b4870000000000000000366a343d3a653a3078386239346336346666376433396361616161633234343530656236363565346564663661663065393a3a743a333002483045022100e63f5a4a0f1dd93c4c33e5f14ee60d5bc8c69e8d36c0c842a7aaf3a65a843128022047730c5cc4051f8401aacfab333788de07024d3e8ec4e05aba0193c530b0815501210357bbb2d4a9cb8a2357633f201b9c518c2795ded682b7913c6beef3fe23bd6d2f00000000')
    });

    test("message sign", async () => {
        const wif = private2Wif(base.fromHex("adce25dc25ef89f06a722abdc4b601d706c9efc6bc84075355e6b96ca3871621"), networks.testnet)
        const s = bitcoin.message.sign(wif, "hello world", networks.testnet)
        console.log(s);

        const publicKey = bitcoin.wif2Public(wif, networks.testnet);
        const address = bitcoin.payments.p2wpkh({pubkey: publicKey, network: networks.testnet}).address;
        const s2 = await bitcoin.bip0322.signSimple("hello world", address!, wif, networks.testnet)
        console.log(s2);

        const taprootAddress = bitcoin.payments.p2tr({
            internalPubkey: publicKey.slice(1),
            network: networks.testnet
        }).address;
        const s3 = await bitcoin.bip0322.signSimple("hello world", taprootAddress!, wif, networks.testnet)
        console.log(s3);
    });
})
;

describe("bitcash", () => {
    test("address", async () => {
        let network = bitcoin.networks.bitcoin;
        let privateKey = "L1vSc9DuBDeVkbiS79mJ441FNAYArcYp9A1c5ZJC5qVhLiuiopmK";
        const pk = bitcoin.wif2Public(privateKey, network);
        const address = bitcoin.GetBitcashP2PkHAddressByPublicKey(pk)
        console.info(address)

        let ret = isCashAddress(address)
        console.info(address, ret)

        const address2 = address.replace("bitcoincash:", "")
        const b = ValidateBitcashP2PkHAddress(address2);
        console.info(b)

        ret = isCashAddress(address2)
        console.info(address2, ret)

        const address3 = convert2LegacyAddress(address2, bitcoin.networks.bitcoin);
        console.info(address3)

        ret = isCashAddress(address3!)
        console.info(address3, ret)

    });
});

describe("Doge wallet", () => {
    test("signMessage", async () => {
        let wallet = new DogeWallet()
        let signParams: SignTxParams = {
            privateKey: "QUKYRpo8QXbXNwKJGtAy8HX71XkejfE8Xs4kvN8s2ksvRMK72W4Y",
            data: {
                "address": "D9jYpWwNkcwifh9GR2BUPE4uMPPWtNZrLn",
                message: "hello world!",
            }
        };
        let res = await wallet.signMessage(signParams)
        console.log(res)
        expect(res).toEqual('H9zEVPRcS4hW2ZE/tCdxe0itAKtD/cn8GHcaQDobI5X0O3XwRY7ViBEG3EbkVA3lizaYwrQxvbWWpk1VSePPCs0=')
        let veryParams: VerifyMessageParams = {
            signature: res,
            data: {
                message: "hello world!",
                publicKey: '020834928459fa93692af94c290d2a6c9e8ac0f63ddda8cdf982efa1483e9bcebd',
            }
        };
        let veryfied = await wallet.verifyMessage(veryParams)
        console.log(veryfied)
        expect(veryfied).toBe(true)
    })
})

describe("Ltc wallet", () => {
    test("signMessage", async () => {
        let wallet = new LtcWallet()
        let signParams: SignTxParams = {
            privateKey: "T5hYkW3UzvxDNRmkp4sjLaCpkKwASgJLAEwzPLAxWpuHqBKfpirB",
            data: {
                "address": "LaB7HeTLsyQ6kxM5RsEx9tk8XHQs3GkWDr",
                message: "hello world!",
            }
        };
        let res = await wallet.signMessage(signParams)
        console.log(res)
        expect(res).toEqual('IHd+MKPXIAR5iyrU+66gYY6f9y2vbKoNAJXA8UDiJItbQ2l2xJ18AjtyjfMcFMQezGoH/D3sPHQSvwyd1S1Gejk=')
        let veryParams: VerifyMessageParams = {
            signature: res,
            data: {
                message: "hello world!",
                publicKey: '03314664db7b06040c0be46a2c7bd3a197e3c55aa4ad95ae1684e3f8bf3abfa3d6',
            }
        };
        let veryfied = await wallet.verifyMessage(veryParams)
        console.log(veryfied)
        expect(veryfied).toBe(true)
    })
})

describe("ValidSignedTransaction tx", () => {

    test("ValidSignedTransaction", () => {
        const signedTx = "020000000206235d30b73ef6cd693a5061ac3e782ffb51b591d6c5ef5eb74af30e72920f1e000000006b483045022100dd7570bef61fb89f6233250d1c0a90a251878b2861a9063dcc71863983333ce1022044dcba863cf992ea1d497fd62e9ccf4f6f410b47c413319d5423616adb7ba8fb012103052b16e71e4413f24f8504c3b188b7edebf97b424582877e4993ef9b23d0f045ffffffff1f40a09f098f554e85e3a221cfc24b53aefabcd57720310408823bd2bc87816a010000006a47304402205c344adbc76d88d413108b006e68f3ec6c4137cc9336e0ef307d950c6051574302203775b20bc9ec90b877cc5555f6a68e07659fbdfb0a2358281e4dd878f4593d51012103052b16e71e4413f24f8504c3b188b7edebf97b424582877e4993ef9b23d0f045ffffffff02a0252600000000001976a914ac2b329e209fee10f64899f33da2756ae1e4471e88ac7dcd1e00000000001976a914ac2b329e209fee10f64899f33da2756ae1e4471e88ac00000000"
        const inputs = []
        inputs.push({
            address: "1GhLyRg4zzFixW3ZY5ViFzT4W5zTT9h7Pc",
            value: 2500000
        })
        inputs.push({
            address: "1GhLyRg4zzFixW3ZY5ViFzT4W5zTT9h7Pc",
            value: 2019431
        })
        // "03052b16e71e4413f24f8504c3b188b7edebf97b424582877e4993ef9b23d0f045"
        const ret = ValidSignedTransaction(signedTx, inputs as []);
        console.info(ret)
    });

    test("ValidSignedTransaction for native", () => {
        const signedTx = "0200000000010206235d30b73ef6cd693a5061ac3e782ffb51b591d6c5ef5eb74af30e72920f1e0000000000ffffffff1f40a09f098f554e85e3a221cfc24b53aefabcd57720310408823bd2bc87816a0100000000ffffffff02a025260000000000160014ac2b329e209fee10f64899f33da2756ae1e4471e81cd1e0000000000160014ac2b329e209fee10f64899f33da2756ae1e4471e02473044022100ba638879ad9a86b26b1f0278231c2a46a013a2181d95664a7317396632777367021f17595121b3831c8285af0940c24538a21a79789262d3af6641911263bd3797012103052b16e71e4413f24f8504c3b188b7edebf97b424582877e4993ef9b23d0f0450247304402202fafbde9bd8b852a568310023bb32a8dca5d569fc755ff15673034838b057c6f02201dc90300759f12cedd1decce3eae34492a3d90734a24d4ad19cad939afd513d0012103052b16e71e4413f24f8504c3b188b7edebf97b424582877e4993ef9b23d0f04500000000"
        const inputs = []
        inputs.push({
            address: "bc1q4s4n983qnlhppajgn8enmgn4dts7g3c74jnwpd",
            value: 2500000
        })
        inputs.push({
            address: "bc1q4s4n983qnlhppajgn8enmgn4dts7g3c74jnwpd",
            value: 2019431
        })
        // "03052b16e71e4413f24f8504c3b188b7edebf97b424582877e4993ef9b23d0f045"
        const ret = ValidSignedTransaction(signedTx, inputs as []);
        console.info(ret)
    });

    test("ValidSignedTransaction for nest", () => {
        const signedTx = "020000000001015d095d1782dae1437d061c1d7c4f9cfa6bd5b98fa06a892c5536d861797f8a7d0100000017160014c2cae8bae32260d75076b01a0b72c167908d9f88ffffffff02e80300000000000017a9145e5b9fb69808cbfec8724f20c9f4f8c1cb19667c879d7804000000000017a91425f4eba49c3d86397a71ec5158304e0d6a67dfb78702473044022008334369a490d1320a9d7046ce3c5cd6e016199f074397925283954da1e4f17502203e15add094386c11fe2d123d7f6ff194f5d2407f8a1fa8280e76d4722b05055301210252dab4b2433a2d14dd242af8de23ffbe9552db2567072b59cfd0c3ba855bfcf100000000"
        const inputs = []
        inputs.push({
            address: "359iL1p3BuRhj2Sgx7FtNHbfwumguCR4js",
            value: 295757
        })
        // "03052b16e71e4413f24f8504c3b188b7edebf97b424582877e4993ef9b23d0f045"
        const ret = ValidSignedTransaction(signedTx, inputs as []);
        console.info(ret)
    });

    test("ValidSignedTransaction for taproot", () => {
        const signedTx = "02000000000101110d0b153f3060700c20e3bf704b5a97d52012c8256963c543b41239ccbb6bac00000000000000000002502d190000000000225120b7ee7f83a6a7fdb513040856c56778aa3abea9a451e0c9bb012f22a77ed99b216419000000000000225120b7ee7f83a6a7fdb513040856c56778aa3abea9a451e0c9bb012f22a77ed99b21014009facd3db6fe07a0373200ec3543ade8f09acbe96933e6dfe8443b5eec52f6a92c135d7686700b276b8412ad66bb5318d5e30a1b3f47587dd0acac36fcd2b8b700000000"
        const inputs = []
        inputs.push({
            address: "tb1pklh8lqax5l7m2ycypptv2emc4gata2dy28svnwcp9u32wlkenvsspcvhsr",
            value: 1657000,
            publicKey: "0357bbb2d4a9cb8a2357633f201b9c518c2795ded682b7913c6beef3fe23bd6d2f",
        })
        const ret = ValidSignedTransaction(signedTx, inputs as [], networks.testnet);
        console.info(ret)
    });

    test("ValidSignedTransaction for taproot 2", () => {
        const signedTx = "02000000000101110d0b153f3060700c20e3bf704b5a97d52012c8256963c543b41239ccbb6bac00000000000000000002502d190000000000225120b7ee7f83a6a7fdb513040856c56778aa3abea9a451e0c9bb012f22a77ed99b216419000000000000225120b7ee7f83a6a7fdb513040856c56778aa3abea9a451e0c9bb012f22a77ed99b21014009facd3db6fe07a0373200ec3543ade8f09acbe96933e6dfe8443b5eec52f6a92c135d7686700b276b8412ad66bb5318d5e30a1b3f47587dd0acac36fcd2b8b700000000"
        const ret = ValidSignedTransaction(signedTx, undefined, undefined);
        console.info(ret)
    });
})


describe('hardware wallet test', () => {

    test("onekey", async () => {
        const txData = {
            inputs: [{
                txId: "78d81df15795206560c5f4f49824a38deb0a63941c6d593ca12739b2d940c8cd",
                vOut: 1,
                amount: 200000,
                address: "mouQtmBWDS7JnT65Grj2tPzdSmGKJgRMhE",
                privateKey: "cPnvkvUYyHcSSS26iD1dkrJdV7k1RoUqJLhn3CYxpo398PdLVE22",
                nonWitnessUtxo: "02000000000104870fa29a7da1acff1cd4fb274fd15904ff1c867ad41d309577d4c8268ad0b9250000000000ffffffff1558fd0c79199219e27ce50e07a84c4b01d7563e5c53f9e6550d7c4450aa596d000000006b483045022100bd9b8c17d68efed18f0882bdb77db303a0a547864305e32ed7a9a951b650caa90220131c361e5c27652a3a05603306a87d8f6e117b78fdb1082db23d8960eb6214bf01210357bbb2d4a9cb8a2357633f201b9c518c2795ded682b7913c6beef3fe23bd6d2fffffffff06424462f9b8179b1cdc6229a4e213ff3628060b2a0a7680dae6740405cee3460000000000ffffffffa21ba51db540d68c0feaf3fb958058e1f2f123194f9238d9b2c86e04106c69d100000000171600145c005c5532ce810ddf20f9d1d939631b47089ecdffffffff06400d0300000000001600145c005c5532ce810ddf20f9d1d939631b47089ecd400d0300000000001976a9145c005c5532ce810ddf20f9d1d939631b47089ecd88aca08601000000000017a914ef05515a0595d15eaf90d9f62fb85873a6d8c0b487e4c2030000000000225120b7ee7f83a6a7fdb513040856c56778aa3abea9a451e0c9bb012f22a77ed99b21e803000000000000225120b7ee7f83a6a7fdb513040856c56778aa3abea9a451e0c9bb012f22a77ed99b21e803000000000000225120b7ee7f83a6a7fdb513040856c56778aa3abea9a451e0c9bb012f22a77ed99b2102483045022100a1d12dee8d87d2f8a12ff43f656a6b52183fa5ce4ffd1ab349b978d4dc5e68620220060d8c6d20ea34d3b2f744624d9f027c9020cb80cfb9babe015ebd70db0a927a01210357bbb2d4a9cb8a2357633f201b9c518c2795ded682b7913c6beef3fe23bd6d2f000141f24c018bc95e051c33e4659cacad365db8f3afbaf61ee163e3e1bf1d419baaeb681f681c75a545a19d4ade0b972e226448015d9cbdaee121f4148b5bee9d27068302483045022100bb251cc4a4db4eab3352d54541a03d20d5067e8261b6f7ba8a20a7d955dfafde022078be1dd187ff61934177a9245872f4a90beef32ec40b69f75d9c50c32053d97101210357bbb2d4a9cb8a2357633f201b9c518c2795ded682b7913c6beef3fe23bd6d2f00000000",
                derivationPath: "m/44'/0'/0'/0/0",
            }],
            outputs: [{
                address: "tb1qtsq9c4fje6qsmheql8gajwtrrdrs38kdzeersc",
                amount: 199000,
            }],
            address: 'mouQtmBWDS7JnT65Grj2tPzdSmGKJgRMhE',
            derivationPath: "m/44'/0'/0'/0/0",
            feePerB: 10,
            omni: {
                amount: 100,
            },
        };

        const unsignedTx = await oneKeyBuildBtcTx(txData as utxoTx, networks.testnet);
        console.log(JSON.stringify(unsignedTx));
    });

    test("enum", async () => {
        let type = 1;
        if (type === bitcoin.BtcXrcTypes.INSCRIBE) {
            console.log(1);
        }
        console.log(bitcoin.BtcXrcTypes.PSBT_KEY_SCRIPT_PATH_BATCH)
    });
})

test("signMessage", () => {
    const signedTx = "020000000001015d095d1782dae1437d061c1d7c4f9cfa6bd5b98fa06a892c5536d861797f8a7d0100000017160014c2cae8bae32260d75076b01a0b72c167908d9f88ffffffff02e80300000000000017a9145e5b9fb69808cbfec8724f20c9f4f8c1cb19667c879d7804000000000017a91425f4eba49c3d86397a71ec5158304e0d6a67dfb78702473044022008334369a490d1320a9d7046ce3c5cd6e016199f074397925283954da1e4f17502203e15add094386c11fe2d123d7f6ff194f5d2407f8a1fa8280e76d4722b05055301210252dab4b2433a2d14dd242af8de23ffbe9552db2567072b59cfd0c3ba855bfcf100000000"
    const inputs = []
    inputs.push({
        address: "359iL1p3BuRhj2Sgx7FtNHbfwumguCR4js",
        value: 295757
    })
    // "03052b16e71e4413f24f8504c3b188b7edebf97b424582877e4993ef9b23d0f045"
    const ret = ValidSignedTransaction(signedTx, inputs as []);
    console.info(ret)
});


test("verifyMessageWithAddressBtc", async () => {
    const msg = "Hello World";
    const sig = "IDZqQayIajlTRxsnBtPhhFFnRdDlTah/Pp2yvo6aXFIwV+NkSNxVh/Wm9aBVpdnhzj7PeNhOiu6iXHbj+MoRQhg=";
    const addr1 = "1Hgc1DnWHwfXFxruej4H5g3ThsCzUEwLdD";
    const addr3 = "3LgZ6FNwTGobjyCWQek51p51SnQwaGNyCc";
    const addrbc1q = "bc1qkmlhg65578kjxzhhezgmc69gmnz9hh60eh229d";

    let valid = message.verifyWithAddress(addr1, msg, sig);
    console.log(valid)

    valid = message.verifyWithAddress(addr3, msg, sig);
    console.log(valid)

    valid = message.verifyWithAddress(addrbc1q, msg, sig);
    console.log(valid)
});

test("verifyMessageWithAddressDoge", async () => {
    const msg = "Hello World";
    const sig = "H1cyL8YDwaMrVJHNaH89GpKGJujZJAgbzonye72NQ4fmaPXUgR30bkPF4Q7F+nE5qjrCXon6TP07ZDLO6edyTtI=";
    const addr = "DTqrsRTF5LwLqMZkdTGRaKCUh94KQCgSSA";

    const valid = message.verifyWithAddress(addr, msg, sig, 'Dogecoin Signed Message:\n');
    console.log(valid)
});

test("verifyMessageWithAddressLtc", async () => {
    const msg = "Hello World";
    const sig = "H7+lu8OniP8X0bv0Hdc3pyrB2kXsPE5I51aVpMB8iRJILAZL/9mbQstUuQxUeGQhFb48vmg0gd43cqUlj4Zsg44=";
    const addr = "MSthQ8nuQPf2YUUQWXjQqTKQmV1PYkS6UR";

    const valid = message.verifyWithAddress(addr, msg, sig, 'Litecoin Signed Message:\n');
    console.log(valid)
});
