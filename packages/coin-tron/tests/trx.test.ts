import {base, BN} from '@okxweb3/crypto-lib';
import {
    addressFromPrivate,
    assetTransfer,
    signMessage,
    signMessage2,
    toHexAddress,
    tokenTransfer,
    transfer,
    TrxWallet,
    validateAddress,
    verifySignatureV2,
} from '../src';
import {NewAddressParams, SignTxParams, VerifyMessageParams} from "@okxweb3/coin-base";

describe("address", () => {

    test("validPrivateKey", async () => {
        const wallet = new TrxWallet();
        const privateKey = await wallet.getRandomPrivateKey();
        const res = await wallet.validPrivateKey({privateKey: privateKey});
        expect(res.isValid).toEqual(true);
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
    ps.push("bdd80f4421968142b3a4a6c27a1d84a3623384d085a04a895f109fd8d49cef0a\n");
    // ps.push("0Xbdd80f4421968142b3a4a6c27a1d84a3623384d085a04a895f109fd8d49cef0a");
    test("edge test", async () => {
        const wallet = new TrxWallet();
        let j = 1;
        for (let i = 0; i < ps.length; i++) {
            try {
                await wallet.getNewAddress({privateKey: ps[i]});
            } catch (e) {
                j = j + 1
            }
        }
        expect(j).toEqual(ps.length + 1);
    });

    test("getNewAddress", async () => {
        let wallet = new TrxWallet()
        let result = await wallet.getNewAddress({privateKey: "bdd80f4421968142b3a4a6c27a1d84a3623384d085a04a895f109fd8d49cef0a"});
        expect(result.address).toBe("TJUYRk7odiK3fvPRCGNu4cWGg7tCGHf7Jm");
        result = await wallet.getNewAddress({privateKey: "BDD80F4421968142B3A4A6C27A1D84A3623384D085A04A895F109FD8D49CEF0A"});
        expect(result.address).toBe("TJUYRk7odiK3fvPRCGNu4cWGg7tCGHf7Jm");
        result = await wallet.getNewAddress({privateKey: "0xbdd80f4421968142b3a4a6c27a1d84a3623384d085a04a895f109fd8d49cef0a"});
        expect(result.address).toBe("TJUYRk7odiK3fvPRCGNu4cWGg7tCGHf7Jm");
        result = await wallet.getNewAddress({privateKey: "0XBDD80F4421968142B3A4A6C27A1D84A3623384D085A04A895F109FD8D49CEF0A"});
        expect(result.address).toBe("TJUYRk7odiK3fvPRCGNu4cWGg7tCGHf7Jm");
    });

    test("getNewAddress", async () => {
        let wallet = new TrxWallet()
        let privateKey = await wallet.getRandomPrivateKey();
        let params: NewAddressParams = {
            privateKey: privateKey
        };
        let address = await wallet.getNewAddress(params);
        // let address = await wallet.getNewAddress({privateKey: "bdd80f4421968142b3a4a6c27a1d84a3623384d085a04a895f109fd8d49cef0a"});
        // address = await wallet.getNewAddress({privateKey: ""});
        // address = await wallet.getNewAddress({privateKey: "0x"});
        // address = await wallet.getNewAddress({privateKey: "fix"});
        console.info("address", address)


        const p = addressFromPrivate("bdd80f4421968142b3a4a6c27a1d84a3623384d085a04a895f109fd8d49cef0a");
        console.info(p)

        const b = validateAddress("TNxaWGRRkXe2VV7NALbaaNvMU9CFnnyRJt")
        console.info(b)

        const hex = toHexAddress("TNxaWGRRkXe2VV7NALbaaNvMU9CFnnyRJt")
        console.info(hex)

        const b2 = validateAddress(hex)
        console.info(b2)
    });

    /*

    curl --request POST \
     --url https://api.trongrid.io/wallet/broadcasthex \
     --header 'Accept: application/json' \
     --header 'Content-Type: application/json' \
     --data '
{
     "transaction": "0ad7010a02ed652208e60bbc947b30d97a40d091f0d5aa305ab201081f12ad010a31747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e54726967676572536d617274436f6e747261637412780a154147e77cd95bfaa25f24c50b5c78558b3b6df04137121541a614f803b6fd780986a42c78ec9c7f77e6ded13c18002244a9059cbb000000000000000000000000c19fe39c19ec591bf1548298907a62dc23452fd400000000000000000000000000000000000000000000000000000000000f4240280070d0b494d4aa30900180ade20412418101f5399a60e8141bbb176c84d4a8863cfeb83d614b2dca59d76bc2a2b3596070a2e5b63ccbf3c1a9126e5109dc75d1053e350861f8891f4c0ceb4c55803b1b01"
}
'
    */
    test("transfer", async () => {
        const latestBlockNumber = new BN(43376730)
        const latestBlockHash = base.fromHex("000000000295e05aa866246a779650fe41d6c2a80b8a610c343ecaa2c43c2d1c")
        const refBlockBytes = latestBlockNumber.toBuffer('be', 8)

        const timeStamp = Date.parse(new Date().toString())
        const t = transfer({
            fromAddress: "TGXQHj3fXhEtCmooRgGemCZyHBEQAv6ct8",
            refBlockBytes: base.toHex(refBlockBytes.slice(6, 8)),
            refBlockHash: base.toHex(latestBlockHash.slice(8, 16)),
            expiration: timeStamp + 3600 * 1000,
            timeStamp: timeStamp,
            toAddress: "TTczxNWoJJ8mZjj9w2eegiSZqTCTfhjd4g",
            // 1 TRX = 1000000 sun
            amount: "1000000",
        }, "bdd80f4421968142b3a4a6c27a1d84a3623384d085a04a895f109fd8d49cef0a")
        console.info(t)
    });

    test("assetTransfer", async () => {
        const latestBlockNumber = new BN(43376730)
        const latestBlockHash = base.fromHex("000000000295e05aa866246a779650fe41d6c2a80b8a610c343ecaa2c43c2d1c")
        const refBlockBytes = latestBlockNumber.toBuffer('be', 8)

        const timeStamp = Date.parse(new Date().toString())
        const t = assetTransfer({
            fromAddress: "TGXQHj3fXhEtCmooRgGemCZyHBEQAv6ct8",
            refBlockBytes: base.toHex(refBlockBytes.slice(6, 8)),
            refBlockHash: base.toHex(latestBlockHash.slice(8, 16)),
            expiration: timeStamp + 3600 * 1000,
            timeStamp: timeStamp,
            feeLimit: 0,
            toAddress: "TTczxNWoJJ8mZjj9w2eegiSZqTCTfhjd4g",
            amount: "10000000",
            assetName: "TestToken"
        }, "bdd80f4421968142b3a4a6c27a1d84a3623384d085a04a895f109fd8d49cef0a")
        console.info(t)
    });

    test("tokenTransfer", async () => {
        const latestBlockNumber = new BN(43376730)
        const latestBlockHash = base.fromHex("000000000295e05aa866246a779650fe41d6c2a80b8a610c343ecaa2c43c2d1c")
        const refBlockBytes = latestBlockNumber.toBuffer('be', 8)

        const timeStamp = Date.parse(new Date().toString())
        const t = tokenTransfer({
            fromAddress: "TGXQHj3fXhEtCmooRgGemCZyHBEQAv6ct8",
            refBlockBytes: base.toHex(refBlockBytes.slice(6, 8)),
            refBlockHash: base.toHex(latestBlockHash.slice(8, 16)),
            expiration: timeStamp + 3600 * 1000,
            timeStamp: timeStamp,
            // This must be specified, otherwise the energy is not enough error
            feeLimit: 10000000,
            toAddress: "TTczxNWoJJ8mZjj9w2eegiSZqTCTfhjd4g",
            // usdt 6
            amount: "1000000",
            contractAddress: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"
        }, "bdd80f4421968142b3a4a6c27a1d84a3623384d085a04a895f109fd8d49cef0a")

        console.info(t)
    });

    test("signMessage", async () => {
        const message = base.toHex(Buffer.from("hello"))
        const priKey = "0x1a87e1d78640df26c31de50f92046b6d0e1f8b9c668f7faaf1e6b796d251cf89"
        const t = signMessage("hex", message, priKey)
        // 0x6bb2755a0ce2f0391dca00e45c9c9236835454318887255728e3358db2741f406ad289bd6f5bce3204e295cdec6da98811fb22d191c712d64e22824d5b24ae691b
        console.info(t)

        const message3 = base.toHex(Buffer.from("hello"), true)
        const t3 = signMessage("hex", message3, priKey)
        // 0x6bb2755a0ce2f0391dca00e45c9c9236835454318887255728e3358db2741f406ad289bd6f5bce3204e295cdec6da98811fb22d191c712d64e22824d5b24ae691b
        console.info(t3)

        const message2 = "{\n" +
            "    \"visible\": false,\n" +
            "    \"txID\": \"85382e27667e7ce5d0b193796df4309744ffed4c2d74ffef8c83002b1765bd67\",\n" +
            "    \"raw_data\": {\n" +
            "        \"contract\": [\n" +
            "            {\n" +
            "                \"parameter\": {\n" +
            "                    \"value\": {\n" +
            "                        \"owner_address\": \"41e0a8eda2daea867c1d783faf73c8a1ed66cf8150\",\n" +
            "                        \"contract_address\": \"41955abb8287358c929c7d371a8d034c51426743b8\",\n" +
            "                        \"call_value\": 10000000\n" +
            "                    },\n" +
            "                    \"type_url\": \"type.googleapis.com/protocol.TriggerSmartContract\"\n" +
            "                },\n" +
            "                \"type\": \"TriggerSmartContract\"\n" +
            "            }\n" +
            "        ],\n" +
            "        \"ref_block_bytes\": \"c5cf\",\n" +
            "        \"ref_block_hash\": \"3d4eff77c6899365\",\n" +
            "        \"expiration\": 1667376162000,\n" +
            "        \"timestamp\": 1667376104546\n" +
            "    },\n" +
            "    \"raw_data_hex\": \"0a02c5cf22083d4eff77c689936540d0c9f4bac3305a6c081f12680a31747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e54726967676572536d617274436f6e747261637412330a1541e0a8eda2daea867c1d783faf73c8a1ed66cf8150121541955abb8287358c929c7d371a8d034c51426743b81880ade20470e288f1bac330\"\n" +
            "}"
        const t2 = signMessage("legacy", message2, priKey)

        // {
        //     "visible": false,
        //   "txID": "85382e27667e7ce5d0b193796df4309744ffed4c2d74ffef8c83002b1765bd67",
        //   "raw_data": {
        //     "contract": [
        //         {
        //             "parameter": {
        //                 "value": {
        //                     "owner_address": "41e0a8eda2daea867c1d783faf73c8a1ed66cf8150",
        //                     "contract_address": "41955abb8287358c929c7d371a8d034c51426743b8",
        //                     "call_value": 10000000
        //                 },
        //                 "type_url": "type.googleapis.com/protocol.TriggerSmartContract"
        //             },
        //             "type": "TriggerSmartContract"
        //         }
        //     ],
        //       "ref_block_bytes": "c5cf",
        //       "ref_block_hash": "3d4eff77c6899365",
        //       "expiration": 1667376162000,
        //       "timestamp": 1667376104546
        // },
        //     "raw_data_hex": "0a02c5cf22083d4eff77c689936540d0c9f4bac3305a6c081f12680a31747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e54726967676572536d617274436f6e747261637412330a1541e0a8eda2daea867c1d783faf73c8a1ed66cf8150121541955abb8287358c929c7d371a8d034c51426743b81880ade20470e288f1bac330",
        //   "signature": [
        //     "962b6a916997b355d4df8d639563242ddd8f7dc94558922d394c78f31760938b6eb0bba59fa77ec1c715d24346a8cae80ee89aacf64d1ecea2f2c9145f5571f801"
        // ]
        // }
        console.info(t2)

        const t4 = signMessage2(message2, priKey)
        console.info(t4)
    });
})


describe("sign message", () => {

    test("sign hex message test ", async () => {
        let wallet = new TrxWallet()
        let privateKey = await wallet.getRandomPrivateKey();
        let params: NewAddressParams = {
            privateKey: privateKey
        };
        let address = await wallet.getNewAddress(params);

        let data = {
            type: "hex",
            message: "0x879a053d4800c6354e76c7985a865d2922c82fb5b3f4577b2fe08b998954f2e0"
        };
        let signParams: SignTxParams = {
            privateKey: privateKey,
            data: data
        };
        let result = await wallet.signMessage(signParams);
        console.info(result)

        let verifyMessageParams: VerifyMessageParams = {
            signature: result,
            data: data,
            address: address.address
        };
        let verify = await wallet.verifyMessage(verifyMessageParams);
        console.info(verify)
    })

    test('sign v2 message test', async () => {
        const message = "hello world"
        const priKey = "0000000000000000000000000000000000000000000000000000000000000001"
        const t = signMessage("v2", message, priKey)
        console.info(t)
        // 0x0dc0b53d525e0103a6013061cf18e60cf158809149f2b8994a545af65a7004cb1eeaff560e801ab51b28df5d42549aa024c2aa7e9d34de1e01294b9afb5e6c7e1c

        const address = verifySignatureV2(message, t);
        console.log(address)
        // TMVQGm1qAQYVdetCeGRRkTWYYrLXuHK2HC
    })
})