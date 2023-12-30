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
    ValidSignedTransaction
} from '../src';

import {base} from "@okxweb3/crypto-lib";
import {SignTxParams} from "@okxweb3/coin-base";

describe("bitcoin", () => {

    test("private key", async () => {
        let wallet = new BtcWallet()
        let key = await wallet.getRandomPrivateKey()
        console.log(key)
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

    test("legacy tx sign", async () => {
        let wallet = new TBtcWallet()
        let btcTxParams = {
            inputs: [
                {
                    txId: "3e0268753ed06317e60c51c244fe05a4db472bd3ca4641067a3795a56cc41246",
                    vOut: 0,
                    amount: 100000
                },
            ],
            outputs: [
                {
                    address: "ms7j2BVUaAoXff5JgKLyHQhqAfpyExuXfd",
                    amount: 50000
                }
            ],
            address: "ms7j2BVUaAoXff5JgKLyHQhqAfpyExuXfd",
            feePerB: 2
        };

        let signParams: SignTxParams = {
            privateKey: "cSNaeMCaB5KTYUgMp895E3FyaPHHhECPfDVocraQoH6jmrLgiFUs",
            data: btcTxParams
        };
        let tx = await wallet.signTransaction(signParams);
        console.info(tx);
    })

    test("segwit_native tx sign", async () => {
        let wallet = new TBtcWallet()
        let btcTxParams = {
            inputs: [
                {
                    txId: "17814e41d2eee3b61c1dc80818fa9e9012317a5f7624d318cc9a8747c8292d11",
                    vOut: 0,
                    amount: 50000,
                    address: "tb1q0u7de2mz7pawxhhll8j5dtmk68v48fq2kdly4m"
                },
            ],
            outputs: [
                {
                    address: "tb1q0u7de2mz7pawxhhll8j5dtmk68v48fq2kdly4m",
                    amount: 10000
                }
            ],
            address: "tb1q0u7de2mz7pawxhhll8j5dtmk68v48fq2kdly4m",
            feePerB: 2
        };

        let signParams: SignTxParams = {
            privateKey: "cSNaeMCaB5KTYUgMp895E3FyaPHHhECPfDVocraQoH6jmrLgiFUs",
            data: btcTxParams
        };
        let tx = await wallet.signTransaction(signParams);
        console.info(tx);
    })

    test("segwit_nested tx sign", async () => {
        let wallet = new TBtcWallet()
        let btcTxParams = {
            inputs: [
                {
                    txId: "5214fe65530d36ec35a3391f3b5262f8d3149a14a3b870e688d485bed96159a8",
                    vOut: 0,
                    amount: 50000,
                    address: "2NF22uz9DnyXQ9CSsewWoufxDD7fFTS7JBj"
                },
            ],
            outputs: [
                {
                    address: "2NF22uz9DnyXQ9CSsewWoufxDD7fFTS7JBj",
                    amount: 1000
                }
            ],
            address: "2NF22uz9DnyXQ9CSsewWoufxDD7fFTS7JBj",
            feePerB: 2
        };

        let signParams: SignTxParams = {
            privateKey: "cSNaeMCaB5KTYUgMp895E3FyaPHHhECPfDVocraQoH6jmrLgiFUs",
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
                    txId: "a73cbbc67173451a4828e469376dce4a82c8fb7b976b224995dd0af94406e559",
                    vOut: 0,
                    amount: 50000,
                    address: "tb1pvg07jhy2q72mtn9p2mnp4ccrasn4yl2yhfvasmleyymkf6c08enqad2n2d"
                },
            ],
            outputs: [
                {
                    address: "tb1pvg07jhy2q72mtn9p2mnp4ccrasn4yl2yhfvasmleyymkf6c08enqad2n2d",
                    amount: 1000
                }
            ],
            address: "tb1pvg07jhy2q72mtn9p2mnp4ccrasn4yl2yhfvasmleyymkf6c08enqad2n2d",
            feePerB: 2
        };

        let signParams: SignTxParams = {
            privateKey: "cSNaeMCaB5KTYUgMp895E3FyaPHHhECPfDVocraQoH6jmrLgiFUs",
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
            feePerB: 2
        };

        let signParams: SignTxParams = {
            privateKey: "cPnvkvUYyHcSSS26iD1dkrJdV7k1RoUqJLhn3CYxpo398PdLVE22",
            data: btcTxParams
        };
        let tx = await wallet.signTransaction(signParams);
        console.info(tx);
        expect(tx).toEqual('0200000000010123a0f76bb214f2b3804879b161ceb29dbd08b45f62a399eda2512e3fedebeda700000000171600145c005c5532ce810ddf20f9d1d939631b47089ecdffffffff03f0490200000000001600145c005c5532ce810ddf20f9d1d939631b47089ecdd88401000000000017a914ef05515a0595d15eaf90d9f62fb85873a6d8c0b4870000000000000000366a343d3a653a3078386239346336346666376433396361616161633234343530656236363565346564663661663065393a3a743a333002483045022100b897da3b077f27ff0752346adacf2654c354aac94768fe73a72824f8986ca51d02200ac592435dbc25855c080dd80a660614e390a6b2372a3a940e2821d296a2d50c01210357bbb2d4a9cb8a2357633f201b9c518c2795ded682b7913c6beef3fe23bd6d2f00000000')
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
});

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
})
