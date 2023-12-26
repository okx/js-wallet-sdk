import * as bitcoin from "../src";
import {inscribe, InscribeTxs, InscriptionData, InscriptionRequest, networks, PrevOutput, psbtSign} from "../src";
import * as bscript from "../src/bitcoinjs-lib/script";
import {base} from "@okxweb3/crypto-lib";


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
