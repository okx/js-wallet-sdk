import * as bitcoin from "../src";
import {
    extractPsbtTransaction,
    generateMPCSignedBuyingTx,
    generateMPCSignedListingPSBT, generateMPCSignedPSBT, generateMPCUnsignedBuyingPSBT,
    generateMPCUnsignedListingPSBT, generateMPCUnsignedPSBT,
    inscribe,
    InscribeTxs,
    InscriptionData,
    InscriptionRequest,
    networks,
    PrevOutput,
    psbtSign,
    TBtcWallet
} from "../src";
import * as bscript from "../src/bitcoinjs-lib/script";
import {base} from "@okxweb3/crypto-lib";
import {SignTxParams} from "@okxweb3/coin-base";
import {mergeSignedBuyingPsbt} from "@okxweb3/coin-bitcoin";


describe("brc20 test", () => {

    test("inscribe", async () => {
        let network = bitcoin.networks.testnet;
        let privateKey = "cPnvkvUYyHcSSS26iD1dkrJdV7k1RoUqJLhn3CYxpo398PdLVE22"

        const commitTxPrevOutputList: PrevOutput[] = [];
        commitTxPrevOutputList.push({
            txId: "36cdb491d2b02c1668d02e42edd80af339e1195df4d58927ab9db9e4893509a5",
            vOut: 4,
            amount: 1145068,
            address: "2NF33rckfiQTiE5Guk5ufUdwms8PgmtnEdc",
            privateKey: privateKey,
        });
        commitTxPrevOutputList.push({
            txId: "3d79592cd151427d2d3e55aaf09749c8417d24889c20edf68bd936adc427412a",
            vOut: 0,
            amount: 546,
            address: "tb1qtsq9c4fje6qsmheql8gajwtrrdrs38kdzeersc",
            privateKey: privateKey,
        });
        commitTxPrevOutputList.push({
            txId: "83f5768abfd8b95dbfd9191a94042a06a2c3639394fd50f40a00296cb551be8d",
            vOut: 0,
            amount: 546,
            address: "mouQtmBWDS7JnT65Grj2tPzdSmGKJgRMhE",
            privateKey: privateKey,
        });
        commitTxPrevOutputList.push({
            txId: "8583f92bfc087549f6f20eb2d1604b69d5625a9fe60df72e61e9138884f57c41",
            vOut: 0,
            amount: 546,
            address: "tb1pklh8lqax5l7m2ycypptv2emc4gata2dy28svnwcp9u32wlkenvsspcvhsr",
            privateKey: privateKey,
        });

        const inscriptionDataList: InscriptionData[] = [];
        inscriptionDataList.push({
            contentType: "text/plain;charset=utf-8",
            body: `{"p":"brc-20","op":"mint","tick":"xcvb","amt":"100"}`,
            revealAddr: "tb1pklh8lqax5l7m2ycypptv2emc4gata2dy28svnwcp9u32wlkenvsspcvhsr",
        });
        inscriptionDataList.push({
            contentType: "text/plain;charset=utf-8",
            body: `{"p":"brc-20","op":"mint","tick":"xcvb","amt":"10"}`,
            revealAddr: "mouQtmBWDS7JnT65Grj2tPzdSmGKJgRMhE",
        });
        inscriptionDataList.push({
            contentType: "text/plain;charset=utf-8",
            body: `{"p":"brc-20","op":"mint","tick":"xcvb","amt":"10000"}`,
            revealAddr: "tb1qtsq9c4fje6qsmheql8gajwtrrdrs38kdzeersc",
        });
        inscriptionDataList.push({
            contentType: "text/plain;charset=utf-8",
            body: `{"p":"brc-20","op":"mint","tick":"xcvb","amt":"1"}`,
            revealAddr: "2NF33rckfiQTiE5Guk5ufUdwms8PgmtnEdc",
        });

        const request: InscriptionRequest = {
            commitTxPrevOutputList,
            commitFeeRate: 2,
            revealFeeRate: 2,
            revealOutValue: 546,
            inscriptionDataList,
            changeAddress: "tb1pklh8lqax5l7m2ycypptv2emc4gata2dy28svnwcp9u32wlkenvsspcvhsr",
        };

        const txs: InscribeTxs = inscribe(network, request);
        console.log(txs);
    });

    test("inscribe", async () => {
        let a = bscript.decompile(base.fromHex('036f72645117746578742f706c61696e3b636861727365743d7574663800357b2270223a226472632d3230222c226f70223a226d696e74222c227469636b223a226c70706c222c22616d74223a2231303030227d47304402202dfe3062c0ed5ce2fb02534e4fecf3f554bea7185eaf4bd1761507201d02873c0220013a53e99b3bc973b25322db4b1a214a51d914ee8ef8b67a33cfa2f2a92357640129210257a64f1536472326d5fe61b21df965659847e14d2e885fd156761087489f0088ad757575757551'));
        console.log(a)
        let a2 = bscript.decompile(base.fromHex('036f72645117746578742f706c61696e3b636861727365743d7574663800357b2270223a226472632d3230222c226f70223a226d696e74222c227469636b223a226c70706c222c22616d74223a2231303030227d473044022079fab4fdae667244313971c933254e5102160ced7a7f70b879a969e5e7750ec802202a8b4394fd901a93ffaae3af26dc07028d7846a9d3dcde3f2e0deeed9d34ab5f0129210257a64f1536472326d5fe61b21df965659847e14d2e885fd156761087489f0088ad757575757551'));
        console.log(a2)
    })

    test("psbt sign", async () => {
        const psbtBase64 = "cHNidP8BAFMCAAAAAQZCRGL5uBebHNxiKaTiE/82KAYLKgp2gNrmdAQFzuNGAAAAAAD/////AaCGAQAAAAAAF6kU7wVRWgWV0V6vkNn2L7hYc6bYwLSHAAAAAAABASsiAgAAAAAAACJRILfuf4Omp/21EwQIVsVneKo6vqmkUeDJuwEvIqd+2ZshAQMEgwAAAAEXIFe7stSpy4ojV2M/IBucUYwnld7WgreRPGvu8/4jvW0vAAA=";
        const privateKey = "cPnvkvUYyHcSSS26iD1dkrJdV7k1RoUqJLhn3CYxpo398PdLVE22";
        const signedPsbt = psbtSign(psbtBase64, privateKey, networks.testnet);
        console.log(signedPsbt);
    });
});

describe("brc20 psbt for mpc", () => {
    const network = networks.testnet;
    let wallet = new TBtcWallet()
    test("generateMPCUnsignedListingPSBT", async () => {
        const listPsbtB64 = "cHNidP8BAPoCAAAAAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAP////9nkHnScgaQYFvJqaARFDqF/nH80fHeC+3Lq/UPu7ZHNgAAAAAA/////wMAAAAAAAAAACJRIMElTa1AquoSHlPgzsCZhjYvbNQiJ5bRlIyUeRs1KBy1AAAAAAAAAAAiUSDBJU2tQKrqEh5T4M7AmYY2L2zUIieW0ZSMlHkbNSgctRwlAAAAAAAAFgAUgM1LaK0qus4mqXWye0aJ+RzSxfkAAAAAAAEBKwAAAAAAAAAAIlEgwSVNrUCq6hIeU+DOwJmGNi9s1CInltGUjJR5GzUoHLUAAQErAAAAAAAAAAAiUSDBJU2tQKrqEh5T4M7AmYY2L2zUIieW0ZSMlHkbNSgctQABAR8QJwAAAAAAABYAFIDNS2itKrrOJql1sntGifkc0sX5AQMEgwAAAAAAAAA=";
        const pubKey = "031cf908e7712d7a1c4cee9d18c41309fbc750ca47fde5e26a52704ea7fa196a50";
        const res = generateMPCUnsignedListingPSBT(listPsbtB64, pubKey, network);
        console.log(res);

        let params = {
            type: 21,
            psbt: listPsbtB64,
            publicKey: pubKey,
        };
        let signParams: SignTxParams = {
            privateKey: "",
            data: params,
        };
        let unsignedListingPSBT = await wallet.signTransaction(signParams);
        console.info(unsignedListingPSBT);
    });

    test("generateMPCSignedListingPSBT", async () => {
        const listPsbtB64 = "cHNidP8BAPoCAAAAAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAP////9nkHnScgaQYFvJqaARFDqF/nH80fHeC+3Lq/UPu7ZHNgAAAAAA/////wMAAAAAAAAAACJRIMElTa1AquoSHlPgzsCZhjYvbNQiJ5bRlIyUeRs1KBy1AAAAAAAAAAAiUSDBJU2tQKrqEh5T4M7AmYY2L2zUIieW0ZSMlHkbNSgctRwlAAAAAAAAFgAUgM1LaK0qus4mqXWye0aJ+RzSxfkAAAAAAAEBKwAAAAAAAAAAIlEgwSVNrUCq6hIeU+DOwJmGNi9s1CInltGUjJR5GzUoHLUAAQErAAAAAAAAAAAiUSDBJU2tQKrqEh5T4M7AmYY2L2zUIieW0ZSMlHkbNSgctQABAR8QJwAAAAAAABYAFIDNS2itKrrOJql1sntGifkc0sX5AQMEgwAAAAAAAAA=";
        const pubKey = "031cf908e7712d7a1c4cee9d18c41309fbc750ca47fde5e26a52704ea7fa196a50";
        const signature = "fe1457b72163fd89189161c2e8b5543d5fbd9e0db431830f5801e58c5acbe170702c9143598c6b637c0e91c2e953cf6ad21d4d4f07dc967c90cf78e93bfe223a";
        const res = generateMPCSignedListingPSBT(listPsbtB64, pubKey, signature, network);
        console.log(res);

        let params = {
            type: 22,
            psbt: listPsbtB64,
            publicKey: pubKey,
            signature: signature
        };
        let signParams: SignTxParams = {
            privateKey: "",
            data: params,
        };
        let signedListingPSBT = await wallet.signTransaction(signParams);
        console.info(signedListingPSBT);
    });

    test("generateMPCUnsignedBuyingPSBT", async () => {
        const buyingPsbtB64 = "cHNidP8BAPoCAAAAA7ouJZmXXTg3kmzK3BFWdAxkRu6DFaniiIDzjqzcuRvNAwAAAAD/////ui4lmZddODeSbMrcEVZ0DGRG7oMVqeKIgPOOrNy5G80CAAAAAP////9nkHnScgaQYFvJqaARFDqF/nH80fHeC+3Lq/UPu7ZHNgEAAAAA/////wP0AQAAAAAAACJRICD5IGrrx7A9tjzMm2/+9n2wvt7JMD1Gp/MH0HrqyPxqIgIAAAAAAAAiUSAg+SBq68ewPbY8zJtv/vZ9sL7eyTA9RqfzB9B66sj8atwFAAAAAAAAFgAUgM1LaK0qus4mqXWye0aJ+RzSxfkAAAAAAAEBH1gCAAAAAAAAFgAUgM1LaK0qus4mqXWye0aJ+RzSxfkBAwQBAAAAAAEBHyICAAAAAAAAFgAUgM1LaK0qus4mqXWye0aJ+RzSxfkBAwQBAAAAAAEBH9AHAAAAAAAAFgAUgM1LaK0qus4mqXWye0aJ+RzSxfkiAgMc+QjncS16HEzunRjEEwn7x1DKR/3l4mpScE6n+hlqUEcwRAIgGByM9KNQWC6TUAhqP27YpyUCk1wBV4N2Jd2xhDEw82UCIC5OViBv/40P0z0OKaD9kEWwaM2qcKskUiG3y7AIvOCugwEDBIMAAAAAAAAA";
        const pubKey = "031cf908e7712d7a1c4cee9d18c41309fbc750ca47fde5e26a52704ea7fa196a50";
        const res = generateMPCUnsignedBuyingPSBT(buyingPsbtB64, pubKey, network, 1);
        console.log(res);

        let params = {
            type: 23,
            psbt: buyingPsbtB64,
            publicKey: pubKey,
            batchSize: 1,
        };
        let signParams: SignTxParams = {
            privateKey: "",
            data: params,
        };
        let unsignedBuyingPSBT = await wallet.signTransaction(signParams);
        console.info(unsignedBuyingPSBT);
    });

    test("generateMPCSignedBuyingTx", async () => {
        const buyingPsbtB64 = "cHNidP8BAPoCAAAAA7ouJZmXXTg3kmzK3BFWdAxkRu6DFaniiIDzjqzcuRvNAwAAAAD/////ui4lmZddODeSbMrcEVZ0DGRG7oMVqeKIgPOOrNy5G80CAAAAAP////9nkHnScgaQYFvJqaARFDqF/nH80fHeC+3Lq/UPu7ZHNgEAAAAA/////wP0AQAAAAAAACJRICD5IGrrx7A9tjzMm2/+9n2wvt7JMD1Gp/MH0HrqyPxqIgIAAAAAAAAiUSAg+SBq68ewPbY8zJtv/vZ9sL7eyTA9RqfzB9B66sj8atwFAAAAAAAAFgAUgM1LaK0qus4mqXWye0aJ+RzSxfkAAAAAAAEBH1gCAAAAAAAAFgAUgM1LaK0qus4mqXWye0aJ+RzSxfkBAwQBAAAAAAEBHyICAAAAAAAAFgAUgM1LaK0qus4mqXWye0aJ+RzSxfkBAwQBAAAAAAEBH9AHAAAAAAAAFgAUgM1LaK0qus4mqXWye0aJ+RzSxfkiAgMc+QjncS16HEzunRjEEwn7x1DKR/3l4mpScE6n+hlqUEcwRAIgGByM9KNQWC6TUAhqP27YpyUCk1wBV4N2Jd2xhDEw82UCIC5OViBv/40P0z0OKaD9kEWwaM2qcKskUiG3y7AIvOCugwEDBIMAAAAAAAAA";
        const pubKey = "031cf908e7712d7a1c4cee9d18c41309fbc750ca47fde5e26a52704ea7fa196a50";
        const signatureList = [
            "5f01d5e8337c9b077a4a4044d9984179ca51719d8be2d0d10282ced645d446e53a21ec53569763a1ad7cbd0462f677158c906ec439c212c68ea95c807d03a874",
            "e7c39ee67acd81125bf9b618fce0aa5ad32c68a43f09ce56d9d1837c352fa04b5ca73d01becdfa1b0e65c467755ae73b3db734e48256c14217506efcc4fd28c7"
        ];
        const res = generateMPCSignedBuyingTx(buyingPsbtB64, pubKey, signatureList, network, 1);
        console.log(res);

        let params = {
            type: 24,
            psbt: buyingPsbtB64,
            publicKey: pubKey,
            batchSize: 1,
            signatureList: signatureList
        };
        let signParams: SignTxParams = {
            privateKey: "",
            data: params,
        };
        let signedBuyingPSBT = await wallet.signTransaction(signParams);
        console.info(signedBuyingPSBT);
    });

    test("generateMPCUnsignedPSBT", async () => {
        const publicKey = "029f2359b5f47ef228f6d7a46dde9e40b8d59b62fc14d4d62b40e66e07157f796f";
        const listPsbtB64 = "cHNidP8BAP3SAQIAAAAGl330hK2842fWXNFlcA5kCDq1pkLSN6Pg2w0qhbeKNmIEAAAAAP////+XffSErbzjZ9Zc0WVwDmQIOrWmQtI3o+DbDSqFt4o2YgUAAAAA//////ra1p1xpTe1WHIq9e7fR4ETAJUrJeb5ERz5jNTHDD36AAAAAAD/////QrjrbHZ7WY3/NfjJd1XMqTsieqOHm3kbPfO9DQeNZP4BAAAAAP////8h7S9DGeID0NLGv+Vvz0Vyi39BjehJ7nTRwmPKBmts6QMAAAAA/////5d99IStvONn1lzRZXAOZAg6taZC0jej4NsNKoW3ijZiAAAAAAD/////BlgCAAAAAAAAFgAULiX0Onf0bil2KFUCL25iC1OKK1IiAgAAAAAAACJRIDgSPZm/2SY3+1zijs/ARusdyTs+byDxnIVdxzDT6E30mDoAAAAAAAAWABT/xDt7cQzh4eTW3s/Gd4nLywpMyldZFwAAAAAAIlEgOBI9mb/ZJjf7XOKOz8BG6x3JOz5vIPGchV3HMNPoTfQsAQAAAAAAABYAFC4l9Dp39G4pdihVAi9uYgtTiitSLAEAAAAAAAAWABQuJfQ6d/RuKXYoVQIvbmILU4orUgAAAAAAAQEfLAEAAAAAAAAWABQuJfQ6d/RuKXYoVQIvbmILU4orUgABAR8sAQAAAAAAABYAFC4l9Dp39G4pdihVAi9uYgtTiitSAAEBHyICAAAAAAAAFgAU/8Q7e3EM4eHk1t7PxneJy8sKTMoBAwSDAAAAAAEBK8yQAAAAAAAAIlEgOBI9mb/ZJjf7XOKOz8BG6x3JOz5vIPGchV3HMNPoTfQBFyAS9X3nci+tK2PUmB4pU5bVqBDmlX+oWpEROlg507Nr7AABASuBmhcAAAAAACJRIDgSPZm/2SY3+1zijs/ARusdyTs+byDxnIVdxzDT6E30ARcgEvV953IvrStj1JgeKVOW1agQ5pV/qFqRETpYOdOza+wAAQEfWAIAAAAAAAAWABQuJfQ6d/RuKXYoVQIvbmILU4orUgAAAAAAAAA=";
        let unsignedListPsbt = generateMPCUnsignedPSBT(listPsbtB64, publicKey, network)
        console.log(unsignedListPsbt)

        // const buyingPsbtB64 = "cHNidP8BAOICAAAAA7ouJZmXXTg3kmzK3BFWdAxkRu6DFaniiIDzjqzcuRvNAAAAAAD/////ui4lmZddODeSbMrcEVZ0DGRG7oMVqeKIgPOOrNy5G80BAAAAAP////9IZNf+MyT21UzZ+a05hvwd9GP2OvH13Ej6Wr1RPjxAEgAAAAAA/////wPoAwAAAAAAABYAFIDNS2itKrrOJql1sntGifkc0sX5hAMAAAAAAAAWABSAzUtorSq6ziapdbJ7Ron5HNLF+dwFAAAAAAAAFgAUgM1LaK0qus4mqXWye0aJ+RzSxfkAAAAAAAEBH+gDAAAAAAAAFgAUgM1LaK0qus4mqXWye0aJ+RzSxfkBAwQBAAAAAAEBH+gDAAAAAAAAFgAUgM1LaK0qus4mqXWye0aJ+RzSxfkBAwQBAAAAAAEBH9AHAAAAAAAAFgAUgM1LaK0qus4mqXWye0aJ+RzSxfkiAgMc+QjncS16HEzunRjEEwn7x1DKR/3l4mpScE6n+hlqUEcwRAIgbbGWflByJHPCJ5ZLn9nmVGqw3U/HI0mEjsMCcQAFfWECIGazOhQ19xVL3b+A+CwRlrU4p4OikGNY048K6a6L+JAogwEDBIMAAAAAAAAA";
        // const unsignedBuyingPsbt = generateMPCUnsignedPSBT(buyingPsbtB64, publicKey, network)
        // console.log(unsignedBuyingPsbt)
    });

    test("generateMPCSignedPSBT", async () => {
        const publicKey = "031cf908e7712d7a1c4cee9d18c41309fbc750ca47fde5e26a52704ea7fa196a50";
        const listPsbtB64 = "cHNidP8BAPoCAAAAAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAP////9IZNf+MyT21UzZ+a05hvwd9GP2OvH13Ej6Wr1RPjxAEgAAAAAA/////wMAAAAAAAAAACJRIMElTa1AquoSHlPgzsCZhjYvbNQiJ5bRlIyUeRs1KBy1AAAAAAAAAAAiUSDBJU2tQKrqEh5T4M7AmYY2L2zUIieW0ZSMlHkbNSgctdwFAAAAAAAAFgAUgM1LaK0qus4mqXWye0aJ+RzSxfkAAAAAAAEBKwAAAAAAAAAAIlEgwSVNrUCq6hIeU+DOwJmGNi9s1CInltGUjJR5GzUoHLUAAQErAAAAAAAAAAAiUSDBJU2tQKrqEh5T4M7AmYY2L2zUIieW0ZSMlHkbNSgctQABAR/QBwAAAAAAABYAFIDNS2itKrrOJql1sntGifkc0sX5AQMEgwAAAAAAAAA=";
        const signatureList = [
            "6db1967e50722473c227964b9fd9e6546ab0dd4fc72349848ec3027100057d6166b33a1435f7154bddbf80f82c1196b538a783a2906358d38f0ae9ae8bf89028",
            "6db1967e50722473c227964b9fd9e6546ab0dd4fc72349848ec3027100057d6166b33a1435f7154bddbf80f82c1196b538a783a2906358d38f0ae9ae8bf89028",
            "6db1967e50722473c227964b9fd9e6546ab0dd4fc72349848ec3027100057d6166b33a1435f7154bddbf80f82c1196b538a783a2906358d38f0ae9ae8bf89028"
        ];
        const signedListPsbt = generateMPCSignedPSBT(listPsbtB64, publicKey, signatureList, network)
        console.log(signedListPsbt)

        const buyingPsbtB64 = "cHNidP8BAOICAAAAA7ouJZmXXTg3kmzK3BFWdAxkRu6DFaniiIDzjqzcuRvNAAAAAAD/////ui4lmZddODeSbMrcEVZ0DGRG7oMVqeKIgPOOrNy5G80BAAAAAP////9IZNf+MyT21UzZ+a05hvwd9GP2OvH13Ej6Wr1RPjxAEgAAAAAA/////wPoAwAAAAAAABYAFIDNS2itKrrOJql1sntGifkc0sX5hAMAAAAAAAAWABSAzUtorSq6ziapdbJ7Ron5HNLF+dwFAAAAAAAAFgAUgM1LaK0qus4mqXWye0aJ+RzSxfkAAAAAAAEBH+gDAAAAAAAAFgAUgM1LaK0qus4mqXWye0aJ+RzSxfkBAwQBAAAAAAEBH+gDAAAAAAAAFgAUgM1LaK0qus4mqXWye0aJ+RzSxfkBAwQBAAAAAAEBH9AHAAAAAAAAFgAUgM1LaK0qus4mqXWye0aJ+RzSxfkiAgMc+QjncS16HEzunRjEEwn7x1DKR/3l4mpScE6n+hlqUEcwRAIgbbGWflByJHPCJ5ZLn9nmVGqw3U/HI0mEjsMCcQAFfWECIGazOhQ19xVL3b+A+CwRlrU4p4OikGNY048K6a6L+JAogwEDBIMAAAAAAAAA";
        const signatureListOfBuyer = [
            "4d2b37eac3dc24f33487b9d70a09840f561a3c2b98fcb07ed05e7c6977e2ceae2b8f4eaf6024fa5d932ed3d0b6b805c8e8be07c85906afc83fb2e805c19c0bc3",
            "7f4e3032ed8dc3dcd9cbd7b72633476f8f7890d587b0ab6eb32008118348043e4f4b32e5c7a259bc7758cd100b92214d3e4fa218822f8efeaf9b4a32483711a4",
            "cd23282fd22d953e17aa41855b7b109f5caf8558683ca5ed1c9b559c1ee4e83337aeaf1353bdd6fb2c1319b2b67dca96b5a4b32540439ca9d6c36dd02aef964b"
        ];
        const signedBuyingPsbt = generateMPCSignedPSBT(buyingPsbtB64, publicKey, signatureListOfBuyer, network)
        console.log(signedBuyingPsbt)

        const signedTx = extractPsbtTransaction(mergeSignedBuyingPsbt(signedBuyingPsbt, [signedListPsbt]).toHex(), network);
        console.log(signedTx);
    });
});
