import {
    BtcWallet,
    BtcXrcTypes, dogeCoin,
    extractPsbtTransaction,
    networks, PrevOutput, private2Wif, psbtDecode,
    psbtSign,
    psbtSignImpl,
    RuneTestWallet,
    TBtcWallet
} from "../src"
import {buildRuneMainMintData, fromVarInt, toVarInt, toVarIntV2} from "../src/rune"
import {SignTxParams} from "@okxweb3/coin-base";
import {base, signUtil} from '@okxweb3/crypto-lib';
import {
    buildRuneMainDeployData,
    checkEtching,
    MAX_SPACERS,
    RunesMainInscriptionRequest,
    uint128Max,
    uint64Max
} from "../src/runesMain";
import {testnet} from "../src/bitcoinjs-lib/networks";
import {base26Decode, base26Encode, getSpacersVal, removeSpacers} from "../src/runestones";
import {btc} from "@cat-protocol/cat-smartcontracts";
describe('rune test', () => {

    test("test buildRuneMainDeployData", async () => {
        let etching = {
            divisibility: 1, //u8
            premine: uint128Max, //u128, decimal 8
            rune: {value: "AAA"}, //u128
            symbol: "X",//char
            terms: {
                amount: uint128Max,//u128
                cap: uint128Max,//u128 How many times can mint?
                height: {start: uint64Max, end: uint64Max},
                offset: {start: uint64Max, end: uint64Max},//
            },
            turbo: false,
            contentType: "", //"img/png" or "image/jpeg" or "text/plain"  or "audio/mpeg" ...
            body: ""
        };
        let res = buildRuneMainDeployData(etching, false, 0);
        console.log(res.toString("hex"));
        let expected = "6a5d4c71020304be050101055806ffffffffffffffffffffffffffffffffffff030affffffffffffffffffffffffffffffffffff0308ffffffffffffffffffffffffffffffffffff030cffffffffffffffffff010effffffffffffffffff0110ffffffffffffffffff0112ffffffffffffffffff01";
        expect(res.toString('hex')).toEqual(expected);

        etching.rune.value = "AAAAAAAAAAAAAAAAAAAAAAAAAA";
        res = buildRuneMainDeployData(etching, false, 0);
        console.log(res.toString("hex"));
        expected = "6a5d4c80020304d6c7c28b80def3ce89fedea1f1c3b3b62f0101055806ffffffffffffffffffffffffffffffffffff030affffffffffffffffffffffffffffffffffff0308ffffffffffffffffffffffffffffffffffff030cffffffffffffffffff010effffffffffffffffff0110ffffffffffffffffff0112ffffffffffffffffff01";
        expect(res.toString('hex')).toEqual(expected);

        etching.rune.value = "AAAAA•AAAAAA•AAA•AAAA•AAAAA•A•AA";
        res = buildRuneMainDeployData(etching, false, 0);
        console.log(res.toString("hex"));
        expected = "6a5d4c85020304d6c7c28b80def3ce89fedea1f1c3b3b62f01010390c88806055806ffffffffffffffffffffffffffffffffffff030affffffffffffffffffffffffffffffffffff0308ffffffffffffffffffffffffffffffffffff030cffffffffffffffffff010effffffffffffffffff0110ffffffffffffffffff0112ffffffffffffffffff01";
        expect(res.toString('hex')).toEqual(expected);

        etching.rune.value = "AAAAA•BBBB•DTGSUHD•AAAA•ZZZZ•A";
        etching.divisibility = 38;
        etching.premine = BigInt(1);
        etching.terms.amount = BigInt(uint64Max)
        etching.terms.cap = BigInt(uint64Max)
        res = buildRuneMainDeployData(etching, false, 0);
        console.log(res.toString("hex"));
        expected = "6a5d4c61020304dcf2b48cc7feaff2aca4c9c8ed87bde9010126039082a204055806010affffffffffffffffff0108ffffffffffffffffff010cffffffffffffffffff010effffffffffffffffff0110ffffffffffffffffff0112ffffffffffffffffff01";
        expect(res.toString('hex')).toEqual(expected);
    })
    test("test spacer", async () => {
        let rune = base26Decode(uint128Max)
        console.log(rune);
        expect(rune).toEqual("BCGDENLQRQWDSLRUGSNLBTMFIJAV");
        let res = rune.split('').join('•');
        expect(getSpacersVal(res.trimEnd())).toEqual(MAX_SPACERS);
        expect(base26Encode("AAAAAAAAAAAAAAAAAAAAAAAAAAA")).toEqual(BigInt("6402364363415443603228541259936211926"));
        let data = base26Encode(removeSpacers("AAAAA•BBBB•DTGSUHD•AAAA•ZZZZ•A•SDHCY"));
        expect(data).toBeGreaterThan(uint128Max)
        let e = {
            premine: BigInt(1000000),
            rune: {value: "ABCDEFG•ABC•PPPM•OPOETAB"},
            symbol: "X",
            terms: {
                amount: BigInt(1000),
                cap: BigInt(20000)
            },
            turbo: false,//todo
            contentType: "img/png",
            body: ""
        }
        expect(checkEtching(e)).toEqual(true);
        e.rune.value="ABCDEFG•ABC•PPPM•OPOETAB•MSNDKFPFJSYYJSJFHUDID" //to long
        expect(checkEtching(e)).toEqual(false);
        e.rune.value="ABCDEFG•ABC•PPPM•OPOETAB"
        e.premine=BigInt(uint128Max)+BigInt(1)//to bigger
        expect(checkEtching(e)).toEqual(false);

        e.premine=BigInt(uint128Max)+BigInt(1)//to bigger
        expect(checkEtching(e)).toEqual(false);
        e.premine=BigInt(-1)//to bigger
        expect(checkEtching(e)).toEqual(false);
        e.premine=BigInt(0)//to bigger
        e.terms.amount=BigInt(-1)//to bigger
        expect(checkEtching(e)).toEqual(false);
        e.terms.amount=BigInt(uint128Max)//to bigger
        expect(checkEtching(e)).toEqual(false);
        e.terms.amount=BigInt(uint128Max)+BigInt(1)//to bigger
        expect(checkEtching(e)).toEqual(false);
    })

    test("inscribe runes", async () => {
        let network = testnet;
        let privateKeyTestnet = "cNMaTDJid2zx35iVJyhNoku3Aja4EuAZ1bp9Qix7jkAcrMzk3VSU" //testnet
        let btcWallet = new TBtcWallet();
        let addressData = await btcWallet.getNewAddress({privateKey: privateKeyTestnet, addressType: "segwit_taproot"})
        let address = addressData.address;
        //tb1p9yvdxe5mudhffs9pzlvexefclrrrv3f5rg0zxuw87x9vxfafskuq0ruwy3
        console.log("address:", address);
        const commitTxPrevOutputList: PrevOutput[] = [];
        commitTxPrevOutputList.push({
            txId: "61850f94abe913a23bdc77a5d8e5e89e02d2aae36afaef0a8068656deeca5fb7",
            vOut: 1,
            amount: 270356,
            address: "tb1p9yvdxe5mudhffs9pzlvexefclrrrv3f5rg0zxuw87x9vxfafskuq0ruwy3",
            privateKey: privateKeyTestnet,
        });
        let logoData = base.fromHex("89504e470d0a1a0a0000000d494844520000001a0000001a0806000000a94a4cce000000017352474200aece1ce90000000467414d410000b18f0bfc6105000000097048597300000ec400000ec401952b0e1b0000008e49444154484bed96010a80200c456797a95b56c7ec34ab8181e8ac6d9642f64012a93da61fc9e13c225460f0cfd7f94566be2762e3edd6cdcfae39bef5b37b121149a40534ef761406da96f8acb83529ed3b424cef5a6e4d4abea3654a13c5ad0969bf754fa31259134764456794c3613d1f222ba2a2f128417da986424d97aa9f93b8b046d479bc4ba82402d8011ca1446416a08a910000000049454e44ae426082")
        let logoDataStr = "hello world";
        const request: RunesMainInscriptionRequest = {
            type: BtcXrcTypes.RUNEMAIN,
            commitTxPrevOutputList,
            commitFeeRate: 5,
            revealFeeRate: 5,
            revealOutValue: 1000,
            runeData: {
                revealAddr: "tb1p9yvdxe5mudhffs9pzlvexefclrrrv3f5rg0zxuw87x9vxfafskuq0ruwy3",
                etching: {
                    premine: BigInt(1000000),
                    rune: {value: "ABCDEFG•ABC•PPPM•OPOETAB"},
                    symbol: "X",
                    terms: {
                        amount: BigInt(1000),
                        cap: BigInt(20000)
                    },
                    turbo: false,//todo
                    contentType: "image/png",
                    body: logoData
                }
            },
            changeAddress: "tb1p9yvdxe5mudhffs9pzlvexefclrrrv3f5rg0zxuw87x9vxfafskuq0ruwy3",
        };

        let res = await btcWallet.signTransaction({
            privateKey: privateKeyTestnet,
            data: request
        });
        // let res = runesMainInscribe(btcWallet.network(), request);
        expect(res.revealTxs.length).toEqual(1)
        expect(res.commitTxFee).toEqual(770)
        let partial = /^02000000000101b75fcaee6d6568800aeffa6ae3aad2029ee8e5d8a577dc3ba213e9ab940f85610100000000fdffffff02b10800000000000022512097178b3579f761f3b7dc5617fcd74995b2af7472dc58f724cc685984e9585cbc61140400000000002251202918d3669be36e94c0a117d9936538f8c63645341a1e2371c7f18ac327a985b80140.*/
        expect(res.commitTx).toMatch(partial)
        partial = /^020000000001018af7dc8359e9abab33a5302fd6fb7252ea7ad576d29ac8c6db97dec323b398390000000000fdffffff020000000000000000246a5d21020304e398a2f3cb95e98680a0a6aada0803c044055806c0843d0ae80708a09c01e8030000000000002251202918d3669be36e94c0a117d9936538f8c63645341a1e2371c7f18ac327a985b80340.*/
        expect(res.revealTxs[0]).toMatch(partial)
        // console.log(res)
    })

    test("inscribe runes with decimals", async () => {
        let network = testnet;
        let privateKeyTestnet = "cNMaTDJid2zx35iVJyhNoku3Aja4EuAZ1bp9Qix7jkAcrMzk3VSU" //testnet, tb1plmnan0g987gpe07pvzstv4svv9ag8e9kjha7hkhywkpq5stqykgq6t32y8
        privateKeyTestnet = "cVeDtBFC49sCRwMixSKkqtFeimqvqT7CMhrttea6nbjPZvqXXvgn" //tb1p9yvdxe5mudhffs9pzlvexefclrrrv3f5rg0zxuw87x9vxfafskuq0ruwy3
        let btcWallet = new TBtcWallet();
        let p =  private2Wif(base.fromHex("f082ba529ed6fc705a65a2cb9377d5d528238d39c390bbfbf5a95e4f300cfc80"), btcWallet.network())
        console.log(p)
        console.log(await btcWallet.getNewAddress({privateKey:p, addressType:"segwit_taproot"}))
        let addressData = await btcWallet.getNewAddress({privateKey: privateKeyTestnet, addressType: "segwit_taproot"})
        let address = addressData.address;
        //tb1p9yvdxe5mudhffs9pzlvexefclrrrv3f5rg0zxuw87x9vxfafskuq0ruwy3
        console.log("address:", address);
        const commitTxPrevOutputList: PrevOutput[] = [];
        commitTxPrevOutputList.push({
            txId: "a0e23f42d48612ce9ad606489ef7ee56c7e78f657285c7f5e4b79e706338ee03",
            vOut: 1,
            amount: 7485,
            address: "tb1p9yvdxe5mudhffs9pzlvexefclrrrv3f5rg0zxuw87x9vxfafskuq0ruwy3",
            privateKey: privateKeyTestnet,
        });
        let logoData = base.fromHex("89504e470d0a1a0a0000000d494844520000001a0000001a0806000000a94a4cce000000017352474200aece1ce90000000467414d410000b18f0bfc6105000000097048597300000ec400000ec401952b0e1b0000008e49444154484bed96010a80200c456797a95b56c7ec34ab8181e8ac6d9642f64012a93da61fc9e13c225460f0cfd7f94566be2762e3edd6cdcfae39bef5b37b121149a40534ef761406da96f8acb83529ed3b424cef5a6e4d4abea3654a13c5ad0969bf754fa31259134764456794c3613d1f222ba2a2f128417da986424d97aa9f93b8b046d479bc4ba82402d8011ca1446416a08a910000000049454e44ae426082")
        let logoDataStr = "hello world";
        const request: RunesMainInscriptionRequest = {
            type: BtcXrcTypes.RUNEMAIN,
            commitTxPrevOutputList,
            commitFeeRate: 8.123,
            revealFeeRate: 8.123,
            revealOutValue: 1000,
            runeData: {
                revealAddr: "tb1p9yvdxe5mudhffs9pzlvexefclrrrv3f5rg0zxuw87x9vxfafskuq0ruwy3",
                etching: {
                    premine: BigInt(1000000),
                    rune: {value: "ABCDEFG•ABC•PPPM•OPOETABC"},
                    symbol: "X",
                    terms: {
                        amount: BigInt(1000),
                        cap: BigInt(20000)
                    },
                    turbo: false,//todo
                    contentType: "image/png",
                    body: logoData
                }
            },
            changeAddress: "tb1p9yvdxe5mudhffs9pzlvexefclrrrv3f5rg0zxuw87x9vxfafskuq0ruwy3",
        };

        let res = await btcWallet.signTransaction({
            privateKey: privateKeyTestnet,
            data: request
        });
        console.log(res)
        expect(res.revealTxs.length).toEqual(1)
        expect(res.commitTxFee).toEqual(1250)
        let partial = /^0200000000010103ee3863709eb7e4f5c78572658fe7c756eef79e4806d69ace1286d4423fe2a00100000000fdffffff02be0b00000000000022512011844cb3cf6199083cc899b927c459c965b33731bf0d90a140a1ae598f8f12399d0c0000000000002251202918d3669be36e94c0a117d9936538f8c63645341a1e2371c7f18ac327a985b80140.*/
        expect(res.commitTx).toMatch(partial)
        partial = /^020000000001019abeac236afd607e894d1222031ee1098e5d463cf7fe72e20cf24d9d697834170000000000fdffffff020000000000000000256a5d22020304aa84f9b4b5b1aeb181c0e2cbace20103c044055806c0843d0ae80708a09c01e8030000000000002251202918d3669be36e94c0a117d9936538f8c63645341a1e2371c7f18ac327a985b80340.*/
        expect(res.revealTxs[0]).toMatch(partial)
    })
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

    test("segwit_taproot mint rune with decimals", async () => {
        let wallet = new TBtcWallet()
        // let wallet = new TBtcWallet()
       let  privateKeyTestnet = "cVeDtBFC49sCRwMixSKkqtFeimqvqT7CMhrttea6nbjPZvqXXvgn" //tb1p9yvdxe5mudhffs9pzlvexefclrrrv3f5rg0zxuw87x9vxfafskuq0ruwy3

        let runeTxParams= {
            type: BtcXrcTypes.RUNEMAIN,
            inputs: [
                {
                    txId: "ef613985a468646207bb4a529edad7b682da2dd783dd15aeb8789016ac6309d5",
                    vOut: 1,
                    amount: 67585,
                    address: "tb1p9yvdxe5mudhffs9pzlvexefclrrrv3f5rg0zxuw87x9vxfafskuq0ruwy3",
                    data: [{"id": "229016:142", "amount": "299.999"}]
                }
            ],
            outputs: [
                { // rune send output
                    address: "tb1p9yvdxe5mudhffs9pzlvexefclrrrv3f5rg0zxuw87x9vxfafskuq0ruwy3",
                    amount: 546,
                    data:{"id": "229016:142", "amount": "299.999"}
                },
            ],
            address: "tb1p9yvdxe5mudhffs9pzlvexefclrrrv3f5rg0zxuw87x9vxfafskuq0ruwy3",
            feePerB: 8.123,
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
            privateKey: privateKeyTestnet,
            data: runeTxParams
        };
        let fee = await wallet.estimateFee(signParams)
        expect(fee).toEqual(1471)
        let tx = await wallet.signTransaction(signParams);
        const partial = /^02000000000101d50963ac169078b8ae15dd83d72dda82b6d7da9e524abb07626468a4853961ef0100000000ffffffff0322020000000000002251202918d3669be36e94c0a117d9936538f8c63645341a1e2371c7f18ac327a985b80000000000000000126a5d0f1498fd0d148e010098fd0d8e01010020000100000000002251202918d3669be36e94c0a117d9936538f8c63645341a1e2371c7f18ac327a985b8014.*/
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
