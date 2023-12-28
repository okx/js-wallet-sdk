import {
    buildPsbt,
    dogeCoin,
    DogeWallet,
    dogInscribe,
    DogInscriptionRequest,
    extractPsbtTransaction,
    InscribeTxs,
    InscriptionData,
    PrevOutput,
    psbtSign,
    utxoInput,
    utxoOutput,
    utxoTx
} from "../src";
import {base} from "@okxweb3/crypto-lib";
import {SignTxParams} from "@okxweb3/coin-base";

describe("doginals test", () => {

    test("doginals deploy inscribe", async () => {
        let privateKey = "QV3XGHS28fExYMnEsoXrzRr7bjQbCH1qRPfPCMLBKhniWF4uFEcs"
        const commitTxPrevOutputList: PrevOutput[] = [];
        commitTxPrevOutputList.push({
            txId: "a250639994251d0b92ba8cc34f1766f4324c4f35bd863ab6c421347b4faa811c",
            vOut: 2,
            amount: 390050000,
            address: "DFuDR3Vn22KMnrnVCxh6YavMAJP8TCPeA2",
            privateKey: privateKey,
        });
        const inscriptionData: InscriptionData = {
            contentType: "text/plain;charset=utf8",
            // body: '{"p":"drc-20","op":"mint","tick":"lppl","amt":"1000"}',
            body: base.fromHex(base.toHex(Buffer.from('{"p":"drc-20","op":"deploy","tick":"isme","max":"210000000","lim":"10000"}'))),
            revealAddr: "DFuDR3Vn22KMnrnVCxh6YavMAJP8TCPeA2",
        };

        const request: DogInscriptionRequest = {
            commitTxPrevOutputList,
            commitFeeRate: 100000,
            revealFeeRate: 100000,
            revealOutValue: 100000,
            inscriptionData,
            changeAddress: "DFuDR3Vn22KMnrnVCxh6YavMAJP8TCPeA2",
        };
        const txs: InscribeTxs = dogInscribe(dogeCoin, request);
        console.log(txs);
        console.log(JSON.stringify(txs));
        expect(JSON.stringify(txs)).toEqual('{"commitTx":"02000000011c81aa4f7b3421c4b63a86bd354f4c32f466174fc38cba920b1d2594996350a2020000006a473044022026f0769ae4cbac769cc6e0ea518f26b9bd6fd8938ea6f53a6de46a8ea0fd83970220472172647ee56e34f9800abcaae0ebca6e9d483dbc2ee31d8db4b05fb8e73ea901210257a64f1536472326d5fe61b21df965659847e14d2e885fd156761087489f0088fdffffff03a08601000000000017a914acc066d108257a26b8f43ff202efac8f9db0d69e87e01a9803000000001976a91476094cb45e019a8942a4861c02f4fd766bb662e588ac107c7111000000001976a91476094cb45e019a8942a4861c02f4fd766bb662e588ac00000000","revealTxs":["0200000002e2c6038616bfeb5beb3ebac20d475152098c29388d5d4b9f2884918b7b54f6bb00000000db036f72645117746578742f706c61696e3b636861727365743d75746638004a7b2270223a226472632d3230222c226f70223a226465706c6f79222c227469636b223a2269736d65222c226d6178223a22323130303030303030222c226c696d223a223130303030227d47304402200a751c53c754f4b823e79da137a2f768bc753c57fe9f52a4d5bfce1f4dbc0e5602204a08ffc1a82b915cea039464bfb88aaf7dccb1e26f99949206af065d53331cd90129210257a64f1536472326d5fe61b21df965659847e14d2e885fd156761087489f0088ad757575757551fdffffffe2c6038616bfeb5beb3ebac20d475152098c29388d5d4b9f2884918b7b54f6bb010000006b4830450221008ac434e487df1213958855db383a821c3a0db266f55efbd6ab49db0e9b4ba28002206114a74c06e21d3d3301df988bb904c2fb67c7a748d0e38f560c53035675067201210257a64f1536472326d5fe61b21df965659847e14d2e885fd156761087489f0088fdffffff01a0860100000000001976a91476094cb45e019a8942a4861c02f4fd766bb662e588ac00000000"],"commitTxFee":37000000,"revealTxFees":[60200000],"commitAddrs":["A8BhNgdB1244Sgdfu7v1rFDUSUHHKc8BoQ"]}')
    })

    test("doginals mint inscribe", async () => {
        let privateKey = "QV3XGHS28fExYMnEsoXrzRr7bjQbCH1qRPfPCMLBKhniWF4uFEcs"
        const commitTxPrevOutputList: PrevOutput[] = [];
        commitTxPrevOutputList.push({
            txId: "adc5edd2a536c92fed35b3d75cbdbc9f11212fe3aa6b55c0ac88c289ba7c4fae",
            vOut: 2,
            amount: 317250000,
            address: "DFuDR3Vn22KMnrnVCxh6YavMAJP8TCPeA2",
            privateKey: privateKey,
        });
        const inscriptionData: InscriptionData = {
            contentType: "text/plain;charset=utf8",
            body: base.fromHex(base.toHex(Buffer.from('{"p":"drc-20","op":"mint","tick":"tril","amt":"100"}'))),
            revealAddr: "DFuDR3Vn22KMnrnVCxh6YavMAJP8TCPeA2",
        };

        const request: DogInscriptionRequest = {
            commitTxPrevOutputList,
            commitFeeRate: 100000,
            revealFeeRate: 100000,
            revealOutValue: 100000,
            inscriptionData,
            changeAddress: "DFuDR3Vn22KMnrnVCxh6YavMAJP8TCPeA2",
        };
        const txs: InscribeTxs = dogInscribe(dogeCoin, request);
        console.log(txs);
        expect(JSON.stringify(txs)).toEqual('{"commitTx":"0200000001ae4f7cba89c288acc0556baae32f21119fbcbd5cd7b335ed2fc936a5d2edc5ad020000006b483045022100c8fe8bc7b134c6d50f1007772f10c6b76927bfb99dc17411027419de66bc397c02207a4a8c6304c2ed26b050c037e87564b2e58ed26dd32b7742bd534a59e67493ba01210257a64f1536472326d5fe61b21df965659847e14d2e885fd156761087489f0088fdffffff03a08601000000000017a914acc066d108257a26b8f43ff202efac8f9db0d69e8720897603000000001976a91476094cb45e019a8942a4861c02f4fd766bb662e588acd0363c0d000000001976a91476094cb45e019a8942a4861c02f4fd766bb662e588ac00000000","revealTxs":["0200000002f8794002b628a2235a7d448d85aef6366fc9eb23a11bb5ddc37b7d811c5b7c3000000000c6036f72645117746578742f706c61696e3b636861727365743d7574663800347b2270223a226472632d3230222c226f70223a226d696e74222c227469636b223a227472696c222c22616d74223a22313030227d483045022100f25b0eeef35b7690ae6c7d765855cb849318a24d33aaa1e9af2ae09e07d6b76202204930701502fa535416ecf9c9ba43a07499ef0ded19dcc74996455e360ded6db30129210257a64f1536472326d5fe61b21df965659847e14d2e885fd156761087489f0088ad757575757551fdfffffff8794002b628a2235a7d448d85aef6366fc9eb23a11bb5ddc37b7d811c5b7c30010000006a47304402203248dec6e7ed6258665903647ec8b1ed3380841548db76182f2762c1451bccb00220144bdd3556fe5ac698ffd0eb9def42266ec49e9d80b0695a383cff344c290df701210257a64f1536472326d5fe61b21df965659847e14d2e885fd156761087489f0088fdffffff01a0860100000000001976a91476094cb45e019a8942a4861c02f4fd766bb662e588ac00000000"],"commitTxFee":37000000,"revealTxFees":[58000000],"commitAddrs":["A8BhNgdB1244Sgdfu7v1rFDUSUHHKc8BoQ"]}')
    });

    test("dowallet doginals mint inscribe", async () => {
        let wallet = new DogeWallet()
        let privateKey = "QV3XGHS28fExYMnEsoXrzRr7bjQbCH1qRPfPCMLBKhniWF4uFEcs"
        const commitTxPrevOutputList: PrevOutput[] = [];
        commitTxPrevOutputList.push({
            txId: "adc5edd2a536c92fed35b3d75cbdbc9f11212fe3aa6b55c0ac88c289ba7c4fae",
            vOut: 2,
            amount: 317250000,
            address: "DFuDR3Vn22KMnrnVCxh6YavMAJP8TCPeA2",
            privateKey: privateKey,
        });
        const inscriptionData: InscriptionData = {
            contentType: "text/plain;charset=utf8",
            body: base.fromHex(base.toHex(Buffer.from('{"p":"drc-20","op":"mint","tick":"tril","amt":"100"}'))),
            revealAddr: "DFuDR3Vn22KMnrnVCxh6YavMAJP8TCPeA2",
        };

        const request = {
            type: 1,
            commitTxPrevOutputList,
            commitFeeRate: 100000,
            revealFeeRate: 100000,
            revealOutValue: 100000,
            inscriptionData,
            changeAddress: "DFuDR3Vn22KMnrnVCxh6YavMAJP8TCPeA2",
        };
        let result = await wallet.signTransaction({privateKey: privateKey, data: request})
        console.log(result);
        expect(JSON.stringify(result)).toEqual('{"commitTx":"0200000001ae4f7cba89c288acc0556baae32f21119fbcbd5cd7b335ed2fc936a5d2edc5ad020000006b483045022100c8fe8bc7b134c6d50f1007772f10c6b76927bfb99dc17411027419de66bc397c02207a4a8c6304c2ed26b050c037e87564b2e58ed26dd32b7742bd534a59e67493ba01210257a64f1536472326d5fe61b21df965659847e14d2e885fd156761087489f0088fdffffff03a08601000000000017a914acc066d108257a26b8f43ff202efac8f9db0d69e8720897603000000001976a91476094cb45e019a8942a4861c02f4fd766bb662e588acd0363c0d000000001976a91476094cb45e019a8942a4861c02f4fd766bb662e588ac00000000","revealTxs":["0200000002f8794002b628a2235a7d448d85aef6366fc9eb23a11bb5ddc37b7d811c5b7c3000000000c6036f72645117746578742f706c61696e3b636861727365743d7574663800347b2270223a226472632d3230222c226f70223a226d696e74222c227469636b223a227472696c222c22616d74223a22313030227d483045022100f25b0eeef35b7690ae6c7d765855cb849318a24d33aaa1e9af2ae09e07d6b76202204930701502fa535416ecf9c9ba43a07499ef0ded19dcc74996455e360ded6db30129210257a64f1536472326d5fe61b21df965659847e14d2e885fd156761087489f0088ad757575757551fdfffffff8794002b628a2235a7d448d85aef6366fc9eb23a11bb5ddc37b7d811c5b7c30010000006a47304402203248dec6e7ed6258665903647ec8b1ed3380841548db76182f2762c1451bccb00220144bdd3556fe5ac698ffd0eb9def42266ec49e9d80b0695a383cff344c290df701210257a64f1536472326d5fe61b21df965659847e14d2e885fd156761087489f0088fdffffff01a0860100000000001976a91476094cb45e019a8942a4861c02f4fd766bb662e588ac00000000"],"commitTxFee":37000000,"revealTxFees":[58000000],"commitAddrs":["A8BhNgdB1244Sgdfu7v1rFDUSUHHKc8BoQ"]}')
    });

})

test("doge psbt transfer", () => {
    const txInputs: utxoInput[] = [];
    txInputs.push({
        txId: "40b297cd9053fb8f74f7a32ff44faf53e60322ca82dddbd626b371b0c8b73c24",
        vOut: 0,
        amount: 100000000,
        address: "DFuDR3Vn22KMnrnVCxh6YavMAJP8TCPeA2",
        privateKey: "QV3XGHS28fExYMnEsoXrzRr7bjQbCH1qRPfPCMLBKhniWF4uFEcs",
        nonWitnessUtxo: "0100000001e6ceae98323464d5e4781d3f4aac26d26ebd3d947f42979636d36b0ff0bd5a9e000000006a473044022067fb7896818b4ce5f38b50ac1b0091b17739e3694ea4d824861b4672e839ff3c02201e55ffbd274544c8ffaf5d94401c801224997e4277aa02576f3ca312c2563ffb012102343c091801439d900ad515247d8d045d730bd350346cb23e9c3edb01710fbd5d010000800200e1f505000000001976a91476094cb45e019a8942a4861c02f4fd766bb662e588ace0df25a6000000001976a914ca1f4a2243a1d4898b02cfb021d29e6ba023564e88ac00000000",
    });

    const txOutputs: utxoOutput[] = [];
    txOutputs.push({
        address: "DFuDR3Vn22KMnrnVCxh6YavMAJP8TCPeA2",
        amount: 100000,
    });
    txOutputs.push({
        address: "DFuDR3Vn22KMnrnVCxh6YavMAJP8TCPeA2",
        amount: 78750000,
    });

    const uxtoTx: utxoTx = {
        inputs: txInputs as any,
        outputs: txOutputs as any,
        address: 'DFuDR3Vn22KMnrnVCxh6YavMAJP8TCPeA2',
    }
    const unSignedTx = buildPsbt(uxtoTx, dogeCoin, 100000);
    console.log(unSignedTx);
    console.log(base.toBase64(base.fromHex(unSignedTx)))
    const privateKey = "QV3XGHS28fExYMnEsoXrzRr7bjQbCH1qRPfPCMLBKhniWF4uFEcs";
    const signedPsbt = psbtSign(base.toBase64(base.fromHex(unSignedTx)), privateKey, dogeCoin, 100000);
    console.log(signedPsbt);
    const tx = extractPsbtTransaction(base.toHex(base.fromBase64(signedPsbt)), dogeCoin, 100000)
    console.log(tx)
    expect(tx).toEqual('0200000001243cb7c8b071b326d6dbdd82ca2203e653af4ff42fa3f7748ffb5390cd97b240000000006a47304402204ac61e00fcbf1bcf8bf93621a6742de01d31d236c23fb4898e05fc0bd217449802201403df88e23f9d497ac3a6606df14d63d966b75b81b54251cba22e52a77baf4c01210257a64f1536472326d5fe61b21df965659847e14d2e885fd156761087489f0088ffffffff02a0860100000000001976a91476094cb45e019a8942a4861c02f4fd766bb662e588ac30a1b104000000001976a91476094cb45e019a8942a4861c02f4fd766bb662e588ac00000000')
});


test("dogewallet psbt sign", async () => {
    const privateKey = "QV3XGHS28fExYMnEsoXrzRr7bjQbCH1qRPfPCMLBKhniWF4uFEcs";
    let wallet = new DogeWallet()
    let signParams: SignTxParams = {
        privateKey: privateKey,
        data: {
            type: 2,
            maximumFeeRate: 100000,
            psbt: 'cHNidP8BAHcCAAAAASQ8t8iwcbMm1tvdgsoiA+ZTr0/0L6P3dI/7U5DNl7JAAAAAAAD/////AqCGAQAAAAAAGXapFHYJTLReAZqJQqSGHAL0/XZrtmLliKwwobEEAAAAABl2qRR2CUy0XgGaiUKkhhwC9P12a7Zi5YisAAAAAAABAOEBAAAAAebOrpgyNGTV5HgdP0qsJtJuvT2Uf0KXljbTaw/wvVqeAAAAAGpHMEQCIGf7eJaBi0zl84tQrBsAkbF3OeNpTqTYJIYbRnLoOf88AiAeVf+9J0VEyP+vXZRAHIASJJl+QneqAldvPKMSwlY/+wEhAjQ8CRgBQ52QCtUVJH2NBF1zC9NQNGyyPpw+2wFxD71dAQAAgAIA4fUFAAAAABl2qRR2CUy0XgGaiUKkhhwC9P12a7Zi5Yis4N8lpgAAAAAZdqkUyh9KIkOh1ImLAs+wIdKea6AjVk6IrAAAAAABASIA4fUFAAAAABl2qRR2CUy0XgGaiUKkhhwC9P12a7Zi5YisAAAA'
        }
    }
    let tx = await wallet.signTransaction(signParams);
    console.info(tx)
    expect(tx).toEqual('cHNidP8BAHcCAAAAASQ8t8iwcbMm1tvdgsoiA+ZTr0/0L6P3dI/7U5DNl7JAAAAAAAD/////AqCGAQAAAAAAGXapFHYJTLReAZqJQqSGHAL0/XZrtmLliKwwobEEAAAAABl2qRR2CUy0XgGaiUKkhhwC9P12a7Zi5YisAAAAAAABAOEBAAAAAebOrpgyNGTV5HgdP0qsJtJuvT2Uf0KXljbTaw/wvVqeAAAAAGpHMEQCIGf7eJaBi0zl84tQrBsAkbF3OeNpTqTYJIYbRnLoOf88AiAeVf+9J0VEyP+vXZRAHIASJJl+QneqAldvPKMSwlY/+wEhAjQ8CRgBQ52QCtUVJH2NBF1zC9NQNGyyPpw+2wFxD71dAQAAgAIA4fUFAAAAABl2qRR2CUy0XgGaiUKkhhwC9P12a7Zi5Yis4N8lpgAAAAAZdqkUyh9KIkOh1ImLAs+wIdKea6AjVk6IrAAAAAABASIA4fUFAAAAABl2qRR2CUy0XgGaiUKkhhwC9P12a7Zi5YisIgICV6ZPFTZHIybV/mGyHfllZZhH4U0uiF/RVnYQh0ifAIhHMEQCIErGHgD8vxvPi/k2IaZ0LeAdMdI2wj+0iY4F/AvSF0SYAiAUA9+I4j+dSXrDpmBt8U1j2Wa3W4G1QlHLoi5Sp3uvTAEAAAA=')
});
