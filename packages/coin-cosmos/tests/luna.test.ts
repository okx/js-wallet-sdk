import {base} from '@okxweb3/crypto-lib';
import {
    amount2Coin,
    amount2Coins,
    amount2StdFee,
    CommonCosmosWallet,
    OsmosisAminoConverters,
    OsmosisRegistry,
    getNewAddress,
    InjectiveWallet,
    OsmoWallet,
    SeiWallet,
    sendAminoMessage,
    sendIBCToken,
    sendMessages,
    sendToken,
    SignMessageData,
    validateAddress,
    KavaWallet,
    AtomWallet,
    EvmosWallet,
    AxelarWallet,
    CronosWallet,
    IrisWallet,
    JunoWallet,
    KujiraWallet, SecretWallet, StargazeWallet, TerraWallet, DydxWallet, CelestiaWallet, CosmosWallet
} from '../src';
import {SignTxParams} from "@okxweb3/coin-base";

describe("luna", () => {
    test("address", async () => {
        const prefix = "cosmos"
        const privateKey = base.randomBytes(32)
        console.log(privateKey.toString('hex'))
        const address = getNewAddress(privateKey, prefix)
        console.info(address)

        const v = validateAddress(address, prefix)
        console.info(v)
    });

    test("getNewAddress common2", async () => {
        //sei137augvuewy625ns8a2age4sztl09hs7pk0ulte
        const privateKey = "ebc42dae1245fad403bd18f59f7283dc18724d2fc843b61e01224b9789057347"
        const wallet = new SeiWallet();
        let expectedAddress = "sei137augvuewy625ns8a2age4sztl09hs7pk0ulte";
        expect((await wallet.getNewAddress({privateKey:privateKey})).address).toEqual(expectedAddress);
        expect((await wallet.getNewAddress({privateKey:'0x'+privateKey})).address).toEqual(expectedAddress)
        expect((await wallet.getNewAddress({privateKey:'0X'+privateKey})).address).toEqual(expectedAddress)
        expect((await wallet.getNewAddress({privateKey:'0X'+privateKey.toUpperCase()})).address).toEqual(expectedAddress)
    });

    const ps: any[] = [];
    ps.push("");
    ps.push("0x");
    ps.push("0X");
    ps.push("124699");
    ps.push("1dfi付");
    ps.push("9000 12");
    ps.push("548yT115QRHH7Mpchg9JJ8YPX9RTKuan=548yT115QRHH7Mpchg9JJ8YPX9RTKuan ");
    ps.push("L1vSc9DuBDeVkbiS79mJ441FNAYArL1vSc9DuBDeVkbiS79mJ441FNAYArL1vSc9DuBDeVkbiS79mJ441FNAYArL1vSc9DuBDeVkbiS79mJ441FNAYAr");
    ps.push("L1v");
    ps.push("0x31342f041c5b54358074b4579231c8a300be65e687dff020bc7779598b428 97a");
    ps.push("0x31342f041c5b54358074b457。、。9231c8a300be65e687dff020bc7779598b428 97a");
    ps.push("0000000000000000000000000000000000000000000000000000000000000000");
    test("edge test", async () => {
        const wallet = new SeiWallet();
        let j = 1;
        for (let i = 0; i < ps.length; i++) {
            let  param = {privateKey: ps[i]}
            try {
                await wallet.getNewAddress(param);
            } catch (e) {
                j = j + 1
                expect(param.privateKey).toEqual(ps[i])
                expect((await wallet.validPrivateKey({privateKey:ps[i]})).isValid).toEqual(false);
            }
        }
        expect(j).toEqual(ps.length+1);
    });

    test("validPrivateKey2", async () => {
        const wallet = new CommonCosmosWallet();
        const privateKey = (await wallet.getRandomPrivateKey()).slice(2);
        const res = await wallet.validPrivateKey({privateKey:privateKey});
        expect(res.isValid).toEqual(true);
        expect((await wallet.validPrivateKey({privateKey:'0x'+privateKey})).isValid).toEqual(true);
        expect((await wallet.validPrivateKey({privateKey:'0X'+privateKey})).isValid).toEqual(true);
        expect((await wallet.validPrivateKey({privateKey:'0X'+privateKey.toLowerCase()})).isValid).toEqual(true);
    });

    test("sendToken", async () => {
        const demon = "uluna"
        const privateKey = "ebc42dae1245fad403bd18f59f7283dc18724d2fc843b61e01224b9789057347"
        const pk = base.fromHex(privateKey)
        const v = await sendToken(pk,
          "bombay-12",
          4,
          588053,
          "terra1xmkczk59xgjhzgwhfg8l5tgs2uftpuj9cgazr4",
          "terra1vm9pfph4syf9g3hfz29636cfw5wp9n6xwut8xu",
          amount2Coins(demon, 10000),
          amount2StdFee(demon, 2000, 100000),
          0,
          "test",
        )
        console.info(v)
        expect(v).toStrictEqual("CpUBCowBChwvY29zbW9zLmJhbmsudjFiZXRhMS5Nc2dTZW5kEmwKLHRlcnJhMXhta2N6azU5eGdqaHpnd2hmZzhsNXRnczJ1ZnRwdWo5Y2dhenI0Eix0ZXJyYTF2bTlwZnBoNHN5ZjlnM2hmejI5NjM2Y2Z3NXdwOW42eHd1dDh4dRoOCgV1bHVuYRIFMTAwMDASBHRlc3QSZwpQCkYKHy9jb3Ntb3MuY3J5cHRvLnNlY3AyNTZrMS5QdWJLZXkSIwohA/ed1wKaWQXlV5BhQrDFfsIfR0XxKbjAV67M9C4nULpuEgQKAggBGAQSEwoNCgV1bHVuYRIEMjAwMBCgjQYaQJHtpCP8lR0lyC+S97GrMJSnjmHCfomESW//iLEr8HVXKsekP5TM4rG2lPPjckZeZ+wAFgUgSDxj1ZzdVTzwtsA=")
    });

    test("sendIBCTransfer", async () => {
        const demon = "uosmo"
        const privateKey = "ebc42dae1245fad403bd18f59f7283dc18724d2fc843b61e01224b9789057347"
        const pk = base.fromHex(privateKey)
        const v = await sendIBCToken(
          pk,
          "osmosis-1",
          2,
          584406,
          "osmo1lyjxk4t835yj6u8l2mg6a6t2v9x3nj7ulaljz2",
          "cosmos1rvs5xph4l3px2efynqsthus8p6r4exyr7ckyxv",
          amount2Coin(demon, 100000),
          "transfer",
          "channel-0",
          amount2StdFee(demon, 0, 100000),
          0,
          undefined,
          Math.ceil(Date.now() / 1000) + 300,
        )
        console.info(v)
    });

    test("sendMessage", async () => {
        const demon = "uosmo"
        const privateKey = "ebc42dae1245fad403bd18f59f7283dc18724d2fc843b61e01224b9789057347"
        const pk = base.fromHex(privateKey)
        const v = await sendMessages(
          pk,
          "osmosis-1",
          2,
          584406,
          [],
          amount2StdFee(demon, 0, 100000),
        )
        console.info(v)
    });

    test("osmosis-json", async () => {
        const data = "{\n  \"chain_id\": \"osmosis-1\",\n  \"account_number\": \"584406\",\n  \"sequence\": \"1\",\n  \"fee\": {\n    \"gas\": \"250000\",\n    \"amount\": [\n      {\n        \"denom\": \"uosmo\",\n        \"amount\": \"0\"\n      }\n    ]\n  },\n  \"msgs\": [\n    {\n      \"type\": \"osmosis/gamm/swap-exact-amount-in\",\n      \"value\": {\n        \"sender\": \"osmo1lyjxk4t835yj6u8l2mg6a6t2v9x3nj7ulaljz2\",\n        \"routes\": [\n          {\n            \"poolId\": \"722\",\n            \"tokenOutDenom\": \"ibc/6AE98883D4D5D5FF9E50D7130F1305DA2FFA0C652D1DD9C123657C6B4EB2DF8A\"\n          }\n        ],\n        \"tokenIn\": {\n          \"denom\": \"uosmo\",\n          \"amount\": \"10000\"\n        },\n        \"tokenOutMinAmount\": \"3854154180813018\"\n      }\n    }\n  ],\n  \"memo\": \"\"\n}"
        const privateKey = base.fromHex("ebc42dae1245fad403bd18f59f7283dc18724d2fc843b61e01224b9789057347")
        const prefix = "osmo"
        const  tt = await sendAminoMessage(privateKey, prefix, data, OsmosisAminoConverters, OsmosisRegistry)
        console.info(tt)
    });
});

describe("evmos", () => {
    test("address", async () => {
        const prefix = "evmos"
        const privateKey = base.fromHex("ebc42dae1245fad403bd18f59f7283dc18724d2fc843b61e01224b9789057347")
        const address = getNewAddress(privateKey, prefix, true)
        console.info(address)

        const v = validateAddress(address, prefix)
        console.info(v)
    });

    test("sendToken", async () => {
        const demon = "aevmos"
        const privateKey = "ebc42dae1245fad403bd18f59f7283dc18724d2fc843b61e01224b9789057347"
        const pk = base.fromHex(privateKey)
        const v = await sendToken(pk,
            "evmos_9001-2",
            5,
            2091572,
            "evmos1yc4q6svsl9xy9g2gplgnlpxwhnzr3y73wfs0xh",
            "evmos1yc4q6svsl9xy9g2gplgnlpxwhnzr3y73wfs0xh",
            amount2Coins(demon, 10000000000000000),
            amount2StdFee(demon, 3500000000000000, 140000),
            0,
            "",
            true,
        )
        console.info(v)
    });

    test("sendIBCTransfer", async () => {
        const demon = "aevmos"
        const privateKey = "ebc42dae1245fad403bd18f59f7283dc18724d2fc843b61e01224b9789057347"
        const pk = base.fromHex(privateKey)
        const v = await sendIBCToken(
            pk,
            "evmos_9001-2",
            4,
            2091572,
            "evmos1yc4q6svsl9xy9g2gplgnlpxwhnzr3y73wfs0xh",
            "cosmos1rvs5xph4l3px2efynqsthus8p6r4exyr7ckyxv",
            amount2Coin(demon, 10000000000000000),
            "transfer",
            "channel-3",
            amount2StdFee(demon, 5000000000000000, 200000),
            0,
            undefined,
            Math.ceil(Date.now() / 1000) + 300,
            "",
            true
        )
        // curl -X POST -d '{"tx_bytes":"CpwBCpkBChwvY29zbW9zLmJhbmsudjFiZXRhMS5Nc2dTZW5kEnkKLGV2bW9zMXljNHE2c3ZzbDl4eTlnMmdwbGdubHB4d2huenIzeTczd2ZzMHhoEixldm1vczF5YzRxNnN2c2w5eHk5ZzJncGxnbmxweHdobnpyM3k3M3dmczB4aBobCgZhZXZtb3MSETEwMDAwMDAwMDAwMDAwMDAwEn0KWQpPCigvZXRoZXJtaW50LmNyeXB0by52MS5ldGhzZWNwMjU2azEuUHViS2V5EiMKIQOcJMA96W11QpNEacdGblBLXYYIw5nd27SBSxlh+Pc6UxIECgIIARgFEiAKGgoGYWV2bW9zEhAzNTAwMDAwMDAwMDAwMDAwEODFCBpBybt+ODmw1NzqBrFEKeBtwicmBLZBD/nTJY86vqT2LjRfs2ebbO+oSk8tlle6e0jHlheujkP38qTzpFa9lNnORQE=","mode":"BROADCAST_MODE_SYNC"}' https://lcd-evmos.whispernode.com/cosmos/tx/v1beta1/txs
        console.info(v)
    });
});

describe("sei", () => {
    test("address", async () => {
        const prefix = "sei"
        const privateKey = base.fromHex("ebc42dae1245fad403bd18f59f7283dc18724d2fc843b61e01224b9789057347")
        const address = getNewAddress(privateKey, prefix)
        console.info(address)

        const v = validateAddress(address, prefix)
        console.info(v)
    });

    test("sendToken", async () => {
        const demon = "usei"
        const privateKey = "ebc42dae1245fad403bd18f59f7283dc18724d2fc843b61e01224b9789057347"
        const pk = base.fromHex(privateKey)
        const v = await sendToken(pk,
            "atlantic-2",
            1,
            4050874,
            "sei1s95zvpxwxcr0ykdkj3ymscrevdam7wvs24dk57",
            "sei1urdedeej0fd4kslzn3uq6s8mndh8wt7usk6a4z",
            amount2Coins(demon, 100000),
            amount2StdFee(demon, 1000, 100000),
            0,
            ""
        )
        expect(v).toStrictEqual("CosBCogBChwvY29zbW9zLmJhbmsudjFiZXRhMS5Nc2dTZW5kEmgKKnNlaTFzOTV6dnB4d3hjcjB5a2RrajN5bXNjcmV2ZGFtN3d2czI0ZGs1NxIqc2VpMXVyZGVkZWVqMGZkNGtzbHpuM3VxNnM4bW5kaDh3dDd1c2s2YTR6Gg4KBHVzZWkSBjEwMDAwMBJmClAKRgofL2Nvc21vcy5jcnlwdG8uc2VjcDI1NmsxLlB1YktleRIjCiED953XAppZBeVXkGFCsMV+wh9HRfEpuMBXrsz0LidQum4SBAoCCAEYARISCgwKBHVzZWkSBDEwMDAQoI0GGkBlZgZ/cEnlDfAcos8pXAv/qsawqIqaCOXovSEbYGq0QUdUmW0BiVHI8I4QR3CUBbQIMzFdP78TqhAvvF4zJAEg");
    });

    test("sendIBCTransfer", async () => {
        const demon = "usei"
        const privateKey = "ebc42dae1245fad403bd18f59f7283dc18724d2fc843b61e01224b9789057347"
        const pk = base.fromHex(privateKey)
        const v = await sendIBCToken(
            pk,
            "atlantic-2",
            10,
            4050874,
            "sei1s95zvpxwxcr0ykdkj3ymscrevdam7wvs24dk57",
            "osmo1lyjxk4t835yj6u8l2mg6a6t2v9x3nj7ulaljz2",
            amount2Coin(demon, 1000),
            "transfer",
            "channel-89",
            amount2StdFee(demon, 1000, 100000),
            0,
            undefined,
            1699006300,
            ""
        )
        // curl -X POST -d '{"tx_bytes":"CrkBCrYBCikvaWJjLmFwcGxpY2F0aW9ucy50cmFuc2Zlci52MS5Nc2dUcmFuc2ZlchKIAQoIdHJhbnNmZXISCWNoYW5uZWwtNxoMCgR1c2VpEgQxMDAwIipzZWkxczk1enZweHd4Y3IweWtka2ozeW1zY3JldmRhbTd3dnMyNGRrNTcqLWF4ZWxhcjFydnM1eHBoNGwzcHgyZWZ5bnFzdGh1czhwNnI0ZXh5cjZrcXZkZDiA9Ofjmd6ksRcSZgpQCkYKHy9jb3Ntb3MuY3J5cHRvLnNlY3AyNTZrMS5QdWJLZXkSIwohAls7OuE0y0N7Bj/PHgFLc16B7Rh1GGrg5mGVoAS8mFHrEgQKAggBGAYSEgoMCgR1c2VpEgQxMDAwEKCNBhpAoLCuHtNe5N1/awOucEB9ZGfxlC4JriSXBL9oNa0HKiId741gOW/52phhnQbstHx32z9/Zj5sd2BqnkShLR8tbg==","mode":"BROADCAST_MODE_SYNC"}' https://rest.atlantic-2.seinetwork.io/cosmos/tx/v1beta1/txs
        expect(v).toStrictEqual("CrgBCrUBCikvaWJjLmFwcGxpY2F0aW9ucy50cmFuc2Zlci52MS5Nc2dUcmFuc2ZlchKHAQoIdHJhbnNmZXISCmNoYW5uZWwtODkaDAoEdXNlaRIEMTAwMCIqc2VpMXM5NXp2cHh3eGNyMHlrZGtqM3ltc2NyZXZkYW03d3ZzMjRkazU3Kitvc21vMWx5anhrNHQ4MzV5ajZ1OGwybWc2YTZ0MnY5eDNuajd1bGFsanoyOICwmrWmp4XKFxJmClAKRgofL2Nvc21vcy5jcnlwdG8uc2VjcDI1NmsxLlB1YktleRIjCiED953XAppZBeVXkGFCsMV+wh9HRfEpuMBXrsz0LidQum4SBAoCCAEYChISCgwKBHVzZWkSBDEwMDAQoI0GGkCKTpQDTQJMsLUs2SPPuHpJA4i0/dI5Gl3hhMsJEgDdVS7flIA+VfARfyclJ7NSWT7RguGe1uNtSAzTEMkjUInK");
    });
});

describe("injective", () => {
    test("address", async () => {
        const prefix = "inj"
        const privateKey = base.fromHex("ebc42dae1245fad403bd18f59f7283dc18724d2fc843b61e01224b9789057347")
        const address = getNewAddress(privateKey, prefix)
        console.info(address)

        const v = validateAddress(address, prefix)
        console.info(v)
    });

    test("sendToken", async () => {
        const demon = "inj"
        const privateKey = "ebc42dae1245fad403bd18f59f7283dc18724d2fc843b61e01224b9789057347"
        const pk = base.fromHex(privateKey)
        const v = await sendToken(pk,
            "injective-1",
            3,
            102711,
            "inj1ywqe8057srngat8rtz95tkx0ffl2urarkegcc8",
            "inj1ywqe8057srngat8rtz95tkx0ffl2urarkegcc8",
            amount2Coins(demon, 100000000000000000),
            amount2StdFee(demon, 200000000000000, 400000),
            0,
            "",
            true,
            undefined,
            "/injective.crypto.v1beta1.ethsecp256k1.PubKey",
        )
        expect(v).toStrictEqual("CpYBCpMBChwvY29zbW9zLmJhbmsudjFiZXRhMS5Nc2dTZW5kEnMKKmluajF5d3FlODA1N3NybmdhdDhydHo5NXRreDBmZmwydXJhcmtlZ2NjOBIqaW5qMXl3cWU4MDU3c3JuZ2F0OHJ0ejk1dGt4MGZmbDJ1cmFya2VnY2M4GhkKA2luahISMTAwMDAwMDAwMDAwMDAwMDAwEn4KXgpUCi0vaW5qZWN0aXZlLmNyeXB0by52MWJldGExLmV0aHNlY3AyNTZrMS5QdWJLZXkSIwohA/ed1wKaWQXlV5BhQrDFfsIfR0XxKbjAV67M9C4nULpuEgQKAggBGAMSHAoWCgNpbmoSDzIwMDAwMDAwMDAwMDAwMBCAtRgaQbpuj/SziuBDOtG/8q2NdcNgsZMdpCw17yDdnae/Gh+NFBl6YhIsYUGBEKrkbd3C9hkr5dwA14yke6Qm3qknl9MB");
    });

    test("sendIBCTransfer", async () => {
        const demon = "inj"
        const privateKey = "ebc42dae1245fad403bd18f59f7283dc18724d2fc843b61e01224b9789057347"
        const pk = base.fromHex(privateKey)
        const v = await sendIBCToken(
            pk,
            "injective-1",
            3,
            102711,
            "inj1ywqe8057srngat8rtz95tkx0ffl2urarkegcc8",
            "osmo18vu3jy77d0xvlg5gguud5h0kv2repg83ehwngf",
            amount2Coin(demon, 100000000000000000),
            "transfer",
            "channel-8",
            amount2StdFee(demon, 200000000000000, 400000),
            0,
            undefined,
            Math.ceil(Date.now() / 1000) + 300,
            "",
            true,
            undefined,
            "/injective.crypto.v1beta1.ethsecp256k1.PubKey",
        )
        console.info(v)
    });

    test("injective-getAddressByPublicKey", async () => {
        const wallet = new InjectiveWallet()
        let c = await wallet.getAddressByPublicKey({
            publicKey: "038bffbf6a298c27e338b4c9ab670ac4b35678250b9bf4eebea9f56a327f56af7c",
            hrp: "inj"
        })
        console.log(c)
        expect(c).toEqual('inj1u5m8vf5yw49gut3lrk3trje0zdvlnpduj2zudf')
    })

    test("injective-signmessage", async () => {
        const privateKey = "ebc42dae1245fad403bd18f59f7283dc18724d2fc843b61e01224b9789057347"
        const wallet = new InjectiveWallet()
        const message = "{\n" +
            "    \"accountNumber\": \"6666\",\n" +
            "    \"chainId\": \"injective-1\",\n" +
            "    \"body\": \"0a00\",\n" +
            "    \"authInfo\": \"0a0912040a02087f188a3412110a0f0a03696e6a12083433393939393939\"\n" +
            "}";
        const data: SignMessageData = {type: "signDoc", data: message}
        const v = await wallet.signMessage({privateKey, data})
        console.info(v)
    });

    test("injective-signmessage-2", async () => {
        const privateKey = "ebc42dae1245fad403bd18f59f7283dc18724d2fc843b61e01224b9789057347"
        const wallet = new InjectiveWallet()
        const message = "{\n" +
            "    \"account_number\": \"833360\",\n" +
            "    \"chain_id\": \"injective-1\",\n" +
            "    \"fee\": {\n" +
            "        \"amount\": [\n" +
            "            {\n" +
            "                \"amount\": \"100000000000000000\",\n" +
            "                \"denom\": \"inj\"\n" +
            "            }\n" +
            "        ],\n" +
            "        \"gas\": \"174651\"\n" +
            "    },\n" +
            "    \"memo\": \"\",\n" +
            "    \"msgs\": [\n" +
            "        {\n" +
            "            \"type\": \"sei/poolmanager/swap-exact-amount-in\",\n" +
            "            \"value\": {\n" +
            "                \"routes\": [\n" +
            "                    {\n" +
            "                        \"pool_id\": \"1\",\n" +
            "                        \"token_out_denom\": \"ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2\"\n" +
            "                    }\n" +
            "                ],\n" +
            "                \"sender\": \"inj1ywqe8057srngat8rtz95tkx0ffl2urarkegcc8\",\n" +
            "                \"token_in\": {\n" +
            "                    \"amount\": \"10000\",\n" +
            "                    \"denom\": \"inj\"\n" +
            "                },\n" +
            "                \"token_out_min_amount\": \"545\"\n" +
            "            }\n" +
            "        }\n" +
            "    ],\n" +
            "    \"sequence\": \"20\"\n" +
            "}";
        const data: SignMessageData = {type: "amino", data: message}
        const v = await wallet.signMessage({privateKey, data})
        console.info(v)
    });
});

describe("common_wallet", () => {
    test("getNewAddress", async () => {
        //leap export 0xd7c51e968395a42dccef5c250f083c526a711d97e3723fff2bc6e250223a7815
        //sei sei1gygujuyk00uxachg33x3eadtwq5cxqhs87arec
        let privateHex = "d7c51e968395a42dccef5c250f083c526a711d97e3723fff2bc6e250223a7815";
        {
            const sei = new SeiWallet()
            const address = await sei.getNewAddress({
                privateKey: privateHex,
            });
            expect(address.address).toEqual("sei1gygujuyk00uxachg33x3eadtwq5cxqhs87arec");
        }
        {
            const wallet = new OsmoWallet()
            const address = await wallet.getNewAddress({
                privateKey: '0x'+privateHex,
            });
            expect(address.address).toEqual("osmo1gygujuyk00uxachg33x3eadtwq5cxqhszfl9ft");
        }
        {
            const wallet = new EvmosWallet()
            const address = await wallet.getNewAddress({
                privateKey: "0x6a469518df93deadecef1c1ef668f2d168e1f80c3f3d1f985832b765d2a80916",
            });
            expect(address.address).toEqual("evmos19w2knpdgz87cuqk83j4xw8zedz9dlauny80xfs");
        }
        {
            const wallet = new AxelarWallet()
            const address = await wallet.getNewAddress({
                privateKey: privateHex,
            });
            expect(address.address).toEqual("axelar1gygujuyk00uxachg33x3eadtwq5cxqhswu6a5c");
        }
        {
            const wallet = new CronosWallet()
            const address = await wallet.getNewAddress({
                privateKey: "0x6a469518df93deadecef1c1ef668f2d168e1f80c3f3d1f985832b765d2a80916",
            });
            expect(address.address).toEqual("cro1tmf35ysa2u5kuv0upv3xus8fc0h7nqlfaxzup0");
        }
        {
            const wallet = new IrisWallet()
            const address = await wallet.getNewAddress({
                privateKey: privateHex,
            });
            expect(address.address).toEqual("iaa1gygujuyk00uxachg33x3eadtwq5cxqhslsvyag");
        }
        {
            const wallet = new JunoWallet()
            const address = await wallet.getNewAddress({
                privateKey: privateHex,
            });
            expect(address.address).toEqual("juno1gygujuyk00uxachg33x3eadtwq5cxqhsuq0wc9");
        }
        {
            const wallet = new KavaWallet()
            const address = await wallet.getNewAddress({
                privateKey: "0xe3c18b78724b9ae3b2ed54231192373ed030b677d224bd1fdc3a8b0313e7bb33",
            });
            expect(address.address).toEqual("kava1xud79am45d55qkt8v00zf3raqeqcz4us3xp4vy");
        }
        {
            const wallet = new KujiraWallet()
            const address = await wallet.getNewAddress({
                privateKey: privateHex,
            });
            expect(address.address).toEqual("kujira1gygujuyk00uxachg33x3eadtwq5cxqhsm6wdjn");
        }
        {
            const wallet = new SecretWallet()
            const address = await wallet.getNewAddress({
                privateKey: "0x61ab4f114f9918dc182558caac097381f6ca08007581d23d102004a05fa2021b",
            });
            expect(address.address).toEqual("secret1zy6wlu8f0evmnjrek2me3ww5xfx07w7sc8k2ku");
        }
        {
            const wallet = new StargazeWallet()
            const address = await wallet.getNewAddress({
                privateKey: privateHex,
            });
            expect(address.address).toEqual("stars1gygujuyk00uxachg33x3eadtwq5cxqhs7wmg5g");
        }
        {
            const wallet = new TerraWallet()
            const address = await wallet.getNewAddress({
                privateKey: "0xead09cd31b8680199e5281256a090183d87217698fc98c4c7fbbddcc3bb1818f",
            });
            expect(address.address).toEqual("terra14psgu3ted0mxn3p353965geppt39r8aezfcp3c");
        }
        {
            const wallet = new DydxWallet()
            const address = await wallet.getNewAddress({
                privateKey: privateHex,
            });
            expect(address.address).toEqual("dydx1gygujuyk00uxachg33x3eadtwq5cxqhsrtz3lw");
        }
        {
            const wallet = new InjectiveWallet()
            const address = await wallet.getNewAddress({
                privateKey: "0x6a469518df93deadecef1c1ef668f2d168e1f80c3f3d1f985832b765d2a80916",
            });
            expect(address.address).toEqual("inj19w2knpdgz87cuqk83j4xw8zedz9dlaunv0fvpq");
        }
        {
            const wallet = new CelestiaWallet()
            const address = await wallet.getNewAddress({
                privateKey: privateHex,
            });
            expect(address.address).toEqual("celestia1gygujuyk00uxachg33x3eadtwq5cxqhsmca995");
        }
    })
    test("address", async () => {
        {
            const sei = new SeiWallet()
            const address = await sei.getNewAddress({
                privateKey: "ebc42dae1245fad403bd18f59f7283dc18724d2fc843b61e01224b9789057347",
            });
            console.info(address)
            console.info(await sei.validAddress({address: address.address}))

            console.info(await sei.getAddressByPublicKey({publicKey: "03f79dd7029a5905e557906142b0c57ec21f4745f129b8c057aeccf42e2750ba6e"}));
        }
        {
            const hrp = "sei";
            const sei = new CommonCosmosWallet()
            const address = await sei.getNewAddress({
                privateKey: "ebc42dae1245fad403bd18f59f7283dc18724d2fc843b61e01224b9789057347",
                hrp: hrp,
            });
            console.info(address)
            console.info(await sei.validAddress({address: address.address, hrp}))
            console.info(await sei.getAddressByPublicKey({
                publicKey: "03f79dd7029a5905e557906142b0c57ec21f4745f129b8c057aeccf42e2750ba6e",
                hrp
            }));
        }
    });
});

