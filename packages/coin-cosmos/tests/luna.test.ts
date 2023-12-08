import {base} from '@okxweb3/crypto-lib';
import {
    amount2Coin,
    amount2Coins,
    amount2StdFee,
    CommonCosmosWallet,
    GammAminoConverters,
    GammRegistry,
    getNewAddress,
    InjectiveWallet,
    SeiWallet,
    sendAminoMessage,
    sendIBCToken,
    sendMessages,
    sendToken,
    SignMessageData,
    validateAddress
} from '../src';

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
        const  tt = await sendAminoMessage(privateKey, prefix, data, GammAminoConverters, GammRegistry)
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

