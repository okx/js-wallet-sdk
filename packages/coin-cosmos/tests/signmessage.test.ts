import {
    CommonCosmosWallet,
    InjectiveWallet,
    KavaWallet,
    OsmoWallet,
    SeiWallet,
    SignMessageData
} from "../src";
import {SignTxParams} from "@okxweb3/coin-base";
import {test} from "@jest/globals";
import assert from "assert";

describe("sign message with tx", ()=> {

    test("signCommonMsg", async () => {
        let wallet = new CommonCosmosWallet();
        let sig = await wallet.signCommonMsg({privateKey:"ebc42dae1245fad403bd18f59f7283dc18724d2fc843b61e01224b9789057347", message:{walletId:"123456789"}, hrp:"sei"});
        assert.strictEqual(sig,"1ca38adcea509ddd27018907ca6e10995230993ddd7e03d6c98cdca9e99c42b9bb74a6e57147bc066884d1bef0f997d4bc8ba9dd1de5e90e4f9c8c3f79ec7adb18")
    });

    test("osmo amino osmosis/gamm/swap-exact-amount-in with timeout_height", async () => {
        const message = `{
          "chain_id": "osmosis-1",
          "account_number": "584406",
          "sequence": "1",
          "fee": {
            "gas": "250000",
            "amount": [
              {
                "denom": "uosmo",
                "amount": "1000"
              }
            ]
          },
          "msgs": [
            {
              "type": "osmosis/gamm/swap-exact-amount-in",
              "value": {
                "sender": "osmo1lyjxk4t835yj6u8l2mg6a6t2v9x3nj7ulaljz2",
                "routes": [
                  {
                    "poolId": "722",
                    "tokenOutDenom": "ibc/6AE98883D4D5D5FF9E50D7130F1305DA2FFA0C652D1DD9C123657C6B4EB2DF8A"
                  }
                ],
                "tokenIn": {
                  "denom": "uosmo",
                  "amount": "10000"
                },
                "tokenOutMinAmount": "3854154180813018"
              }
            }
          ],
          "memo": "",
          "timeout_height": "100000000000"
        }`

        const privateKey: string = "ebc42dae1245fad403bd18f59f7283dc18724d2fc843b61e01224b978905734e"
        const wallet = new CommonCosmosWallet()

        const data : SignMessageData = {type: "amino", data: message, prefix:"osmo", withTx: true}
        const signTxParams: SignTxParams = {privateKey, data}
        const result = await wallet.signMessage(signTxParams)
        const res = JSON.parse(result)

        const sigData: SignMessageData = {type: "amino", data: message}
        const sigSignTxParams: SignTxParams = {privateKey, data: sigData}
        const sig = await wallet.signMessage(sigSignTxParams)

        expect(res.signature).toStrictEqual(sig)
        expect(res.tx).toStrictEqual("CtMBCskBCiovb3Ntb3Npcy5nYW1tLnYxYmV0YTEuTXNnU3dhcEV4YWN0QW1vdW50SW4SmgEKK29zbW8xbHlqeGs0dDgzNXlqNnU4bDJtZzZhNnQydjl4M25qN3VsYWxqejISSQjSBRJEaWJjLzZBRTk4ODgzRDRENUQ1RkY5RTUwRDcxMzBGMTMwNURBMkZGQTBDNjUyRDFERDlDMTIzNjU3QzZCNEVCMkRGOEEaDgoFdW9zbW8SBTEwMDAwIhAzODU0MTU0MTgwODEzMDE4GIDQ28P0AhJnClAKRgofL2Nvc21vcy5jcnlwdG8uc2VjcDI1NmsxLlB1YktleRIjCiECBySq0F3pvHNeHCaqON+oAx/wp4D10ax3ZSk6oSsseAYSBAoCCAEYARITCg0KBXVvc21vEgQxMDAwEJChDxpARLWs3uzblewAQuAdMg9HhnLqmzFRTpTFA/F7oSHM3W58kImQ+8g+te85EUtJV4isTtT9B8p8OtDz8D/Df3tepg==")
    });

    test("inj amino msgSend", async () => {
        const message = `{
          "sequence": "3",
          "fee": {
            "gas": "400000",
            "amount": [
              {
                "denom": "inj",
                "amount": "200000000000000"
              }
            ]
          },
          "msgs": [
            {
              "type": "cosmos-sdk/MsgSend",
              "value": {
                "from_address": "inj1ywqe8057srngat8rtz95tkx0ffl2urarkegcc8",
                "to_address": "inj1ywqe8057srngat8rtz95tkx0ffl2urarkegcc8",
                "amount": [
                  {
                    "denom": "inj",
                    "amount": "100000000000000000"
                  }
                ]
              }
            }
          ],
          "account_number": "102711",
          "chain_id": "injective-1"
        }`
        const privateKey: string = "ebc42dae1245fad403bd18f59f7283dc18724d2fc843b61e01224b978905734e"
        const wallet = new InjectiveWallet()

        const data: SignMessageData = {type: "amino", data: message, withTx: true}
        const signTxParams: SignTxParams = {privateKey, data}
        const result = await wallet.signMessage(signTxParams)
        const res = JSON.parse(result)

        const sigData: SignMessageData = {type: "amino", data: message}
        const sigSignTxParams: SignTxParams = {privateKey, data: sigData}
        const sig = await wallet.signMessage(sigSignTxParams)

        expect(res.signature).toStrictEqual(sig)
        expect(res.tx).toStrictEqual("CpYBCpMBChwvY29zbW9zLmJhbmsudjFiZXRhMS5Nc2dTZW5kEnMKKmluajF5d3FlODA1N3NybmdhdDhydHo5NXRreDBmZmwydXJhcmtlZ2NjOBIqaW5qMXl3cWU4MDU3c3JuZ2F0OHJ0ejk1dGt4MGZmbDJ1cmFya2VnY2M4GhkKA2luahISMTAwMDAwMDAwMDAwMDAwMDAwEn4KXgpUCi0vaW5qZWN0aXZlLmNyeXB0by52MWJldGExLmV0aHNlY3AyNTZrMS5QdWJLZXkSIwohAgckqtBd6bxzXhwmqjjfqAMf8KeA9dGsd2UpOqErLHgGEgQKAggBGAMSHAoWCgNpbmoSDzIwMDAwMDAwMDAwMDAwMBCAtRgaQUqpLoaJkMjvhUXT29CWOZE+0s2vi86y/WgQWdyQ6VkSSeYRAMcEkCjBR1dtz/eph4B1vkwLFyZGag2+MQHTLOkB")
    });

    test("inj signdoc", async () => {
        const privateKey = "ebc42dae1245fad403bd18f59f7283dc18724d2fc843b61e01224b978905734e"
        const wallet = new InjectiveWallet()
        const message: string = `{
            "accountNumber": "6666",
            "chainId": "injective-1",
            "body": "0a00",
            "authInfo": "0a0912040a02087f188a3412110a0f0a03696e6a12083433393939393939"
        }`;
        const data: SignMessageData = {type: "signDoc", data: message, withTx: true}
        const signTxParams: SignTxParams = {privateKey, data}
        const result = await wallet.signMessage(signTxParams)
        const res = JSON.parse(result)

        const sigData: SignMessageData = {type: "signDoc", data: message}
        const sigSignTxParams: SignTxParams = {privateKey, data: sigData}
        const sig = await wallet.signMessage(sigSignTxParams)

        expect(res.signature).toStrictEqual(sig)
        expect(res.tx).toStrictEqual("CgIKABIeCgkSBAoCCH8YijQSEQoPCgNpbmoSCDQzOTk5OTk5GkElPEByavX2NXiP4nI5BSnDcNN13xcprEol6/g2AY4Nj0SLvbbItn8ChSSO1in+WX52aPUWVc47BVMlkkPQiq8LAA==")
    });

    test("osmo signdoc", async () => {
        const message: string = `{
            "accountNumber": "799205",
            "chainId": "osmosis-1",
            "body": "0x0a96040a242f636f736d7761736d2e7761736d2e76312e4d736745786563757465436f6e747261637412ed030a2b6f736d6f313935797372386e73763833716d7673326474636c617735656634646c637861676d3430653233123f6f736d6f31616a3261717a3034796674737365687433376d686775787874717161637330743376743333327536677472397a3472326c787971356836397a671aea027b22657865637574655f737761705f6f7065726174696f6e73223a7b226d696e696d756d5f72656365697665223a223239333734303537222c22726f75746573223a5b7b226f666665725f616d6f756e74223a2231303030303030222c226f7065726174696f6e73223a5b7b22745f665f6d5f73776170223a7b22706f6f6c5f6964223a3537332c226f666665725f61737365745f696e666f223a7b226e61746976655f746f6b656e223a7b2264656e6f6d223a22756f736d6f227d7d2c2261736b5f61737365745f696e666f223a7b226e61746976655f746f6b656e223a7b2264656e6f6d223a226962632f34453534343443333536313043433736464339344537463738383642393331323131373543323832363244444644444536463834453832424632343235343532227d7d7d7d5d7d5d2c22746f223a226f736d6f313935797372386e73763833716d7673326474636c617735656634646c637861676d3430653233227d7d2a100a05756f736d6f120731303030303030",
             "authInfo": "0x0a500a460a1f2f636f736d6f732e63727970746f2e736563703235366b312e5075624b657912230a21023201511a7aba3b0c8c31b8db13f85f1fc91dda848c3e262917d61551aa1cc61312040a020801180d12130a0d0a05756f736d6f12043632353010aa931b"
        }`;
        const privateKey = "ebc42dae1245fad403bd18f59f7283dc18724d2fc843b61e01224b978905734e"
        const wallet = new CommonCosmosWallet()

        const data : SignMessageData = {type: "signDoc", data: message, prefix:"osmo", withTx: true}
        const signTxParams: SignTxParams = {privateKey, data}
        const result = await wallet.signMessage(signTxParams)
        const res = JSON.parse(result)

        const sigData: SignMessageData = {type: "signDoc", data: message}
        const sigSignTxParams: SignTxParams = {privateKey, data: sigData}
        const sig = await wallet.signMessage(sigSignTxParams)

        expect(res.signature).toStrictEqual(sig)
        expect(res.tx).toStrictEqual("CpkECpYECiQvY29zbXdhc20ud2FzbS52MS5Nc2dFeGVjdXRlQ29udHJhY3QS7QMKK29zbW8xOTV5c3I4bnN2ODNxbXZzMmR0Y2xhdzVlZjRkbGN4YWdtNDBlMjMSP29zbW8xYWoyYXF6MDR5ZnRzc2VodDM3bWhndXh4dHFxYWNzMHQzdnQzMzJ1Nmd0cjl6NHIybHh5cTVoNjl6ZxrqAnsiZXhlY3V0ZV9zd2FwX29wZXJhdGlvbnMiOnsibWluaW11bV9yZWNlaXZlIjoiMjkzNzQwNTciLCJyb3V0ZXMiOlt7Im9mZmVyX2Ftb3VudCI6IjEwMDAwMDAiLCJvcGVyYXRpb25zIjpbeyJ0X2ZfbV9zd2FwIjp7InBvb2xfaWQiOjU3Mywib2ZmZXJfYXNzZXRfaW5mbyI6eyJuYXRpdmVfdG9rZW4iOnsiZGVub20iOiJ1b3NtbyJ9fSwiYXNrX2Fzc2V0X2luZm8iOnsibmF0aXZlX3Rva2VuIjp7ImRlbm9tIjoiaWJjLzRFNTQ0NEMzNTYxMENDNzZGQzk0RTdGNzg4NkI5MzEyMTE3NUMyODI2MkRERkRERTZGODRFODJCRjI0MjU0NTIifX19fV19XSwidG8iOiJvc21vMTk1eXNyOG5zdjgzcW12czJkdGNsYXc1ZWY0ZGxjeGFnbTQwZTIzIn19KhAKBXVvc21vEgcxMDAwMDAwEmcKUApGCh8vY29zbW9zLmNyeXB0by5zZWNwMjU2azEuUHViS2V5EiMKIQIyAVEaero7DIwxuNsT+F8fyR3ahIw+JikX1hVRqhzGExIECgIIARgNEhMKDQoFdW9zbW8SBDYyNTAQqpMbGkB9wkba/2TN8eEHa5lXniAVN+rn1oKKiBICcdK3M8rH2RwqImS1rDJwK8rnkR3MoyM9mqf6DQiZ2FATnv+3Yukz")
    })

    test("osmo signdoc 2", async () => {
        const privateKey = "ebc42dae1245fad403bd18f59f7283dc18724d2fc843b61e01224b978905734e"
        const wallet = new OsmoWallet()
        const message: string = `{
            "chainId": "osmosis-1",
            "accountNumber": "833360",
            "authInfo": "0a9e080a242f636f736d7761736d2e7761736d2e76312e4d736745786563757465436f6e747261637412f5070a2b6f736d6f31326e717a3230647a6e653732357079396a366e3777747833733935373963376d6d7a63777834123f6f736d6f31756372387a73727975686c7579686a323268396b736e7578723638716374356171336a75766e79796b777672333339663432767130707364686b1af4067b22657865637574655f737761705f6f7065726174696f6e73223a7b226d696e696d756d5f72656365697665223a223232343034222c22726f75746573223a5b7b226f666665725f616d6f756e74223a223230303030222c226f7065726174696f6e73223a5b7b22745f665f6d5f73776170223a7b22706f6f6c5f6964223a3732322c226f666665725f61737365745f696e666f223a7b226e61746976655f746f6b656e223a7b2264656e6f6d223a22756f736d6f227d7d2c2261736b5f61737365745f696e666f223a7b226e61746976655f746f6b656e223a7b2264656e6f6d223a226962632f36414539383838334434443544354646394535304437313330463133303544413246464130433635324431444439433132333635374336423445423244463841227d7d7d7d2c7b22745f665f6d5f73776170223a7b22706f6f6c5f6964223a3734332c226f666665725f61737365745f696e666f223a7b226e61746976655f746f6b656e223a7b2264656e6f6d223a226962632f36414539383838334434443544354646394535304437313330463133303544413246464130433635324431444439433132333635374336423445423244463841227d7d2c2261736b5f61737365745f696e666f223a7b226e61746976655f746f6b656e223a7b2264656e6f6d223a226962632f44313839333335433645344136384235313343313041423232374246314331443338433734363736363237384241334545423446423134313234463144383538227d7d7d7d2c7b22745f665f6d5f73776170223a7b22706f6f6c5f6964223a313031302c226f666665725f61737365745f696e666f223a7b226e61746976655f746f6b656e223a7b2264656e6f6d223a226962632f44313839333335433645344136384235313343313041423232374246314331443338433734363736363237384241334545423446423134313234463144383538227d7d2c2261736b5f61737365745f696e666f223a7b226e61746976655f746f6b656e223a7b2264656e6f6d223a226962632f32373339344642303932443245434344353631323343373446333645344331463932363030314345414441394341393745413632324232354634314535454232227d7d7d7d5d7d5d2c22746f223a226f736d6f31326e717a3230647a6e653732357079396a366e3777747833733935373963376d6d7a63777834227d7d2a0e0a05756f736d6f12053230303030",
            "body": "0a500a460a1f2f636f736d6f732e63727970746f2e736563703235366b312e5075624b657912230a2103b267a09d75751ef57f4cebcc91427938e84642093ba2fccc2fabf747baa6262d12040a020801181b12140a0e0a05756f736d6f1205323530303010cdaf38"
        }`;

        const data: SignMessageData = {type: "signDoc", data: message, withTx: true}
        const signTxParams: SignTxParams = {privateKey, data}
        const result = await wallet.signMessage(signTxParams)
        const res = JSON.parse(result)
        console.log(res.tx)

        const sigData: SignMessageData = {type: "signDoc", data: message}
        const sigSignTxParams: SignTxParams = {privateKey, data: sigData}
        const sig = await wallet.signMessage(sigSignTxParams)

        expect(res.signature).toStrictEqual(sig)
    });

})
describe("new amino types", () => {
    test("osmo poolmanager", async () => {
        const message = `{
            "chain_id": "osmosis-1",
            "account_number": "630104",
            "sequence": "440",
            "fee": {
                "gas": "227493",
                "amount": [
                    {
                        "denom": "uosmo",
                        "amount": "1000"
                    }
                ]
            },
            "msgs": [
                {
                    "type": "osmosis/poolmanager/swap-exact-amount-in",
                    "value": {"sender":"osmo1wysmvm84c44qmz6res5z6af4sl3nezks8whq8d","routes":[{"pool_id":"1","token_out_denom":"uosmo"},{"pool_id":"2","token_out_denom":"uatom"}],"token_in":{"denom":"test","amount":"100"},"token_out_min_amount":"200"}
                },{
                    "type": "osmosis/poolmanager/swap-exact-amount-out",
                    "value":{"sender":"osmo1l5gtldh29yg2qpvw594tayeutkfa3qp6cuf5qu","routes":[{"token_in_denom":"test"},{"pool_id":"1","token_in_denom":"test2"}],"token_in_max_amount":"200","token_out":{"denom":"test","amount":"100"}} 
                },{
                    "type": "osmosis/poolmanager/split-amount-in",
                    "value": {"sender":"osmo1tj42acq52fauwtwp6ru8eue68ptjvxd7xaa0t4","routes":[{"pools":[{"pool_id":"1","token_out_denom":"uosmo"},{"pool_id":"2","token_out_denom":"uatom"}],"token_in_amount":"1"},{"pools":[{"pool_id":"3","token_out_denom":"uatom"}],"token_in_amount":"1"}],"token_in_denom":"udai","token_out_min_amount":"1"}
                },{
                    "type": "osmosis/poolmanager/split-amount-out",
                    "value":{"sender":"osmo1jfgpqy3zks00cp3h0kv52fysl0ypfm7sd3ga7q","routes":[{"pools":[{"pool_id":"1","token_in_denom":"uatom"},{"pool_id":"2","token_in_denom":"uosmo"}],"token_out_amount":"1"},{"pools":[{"pool_id":"3","token_in_denom":"uatom"}],"token_out_amount":"1"}],"token_out_denom":"udai","token_in_max_amount":"1"} 
                }
            ],
            "memo": "FE"
        }`

        const privateKey : string = "ebc42dae1245fad403bd18f59f7283dc18724d2fc843b61e01224b978905734e"
        const wallet = new CommonCosmosWallet()

        const data : SignMessageData = {type: "amino", data: message, prefix:"osmo", withTx: true}
        const signTxParams : SignTxParams = {privateKey, data}
        const result = await wallet.signMessage(signTxParams)
        const res = JSON.parse(result)
        console.log(res)

        const sigData :SignMessageData = {type: "amino", data: message}
        const sigSignTxParams : SignTxParams = {privateKey, data: sigData}
        const sig = await wallet.signMessage(sigSignTxParams)
        console.log(sig)

        expect(res.signature).toStrictEqual(sig)
        expect(res.tx).toStrictEqual("CuMECooBCjEvb3Ntb3Npcy5wb29sbWFuYWdlci52MWJldGExLk1zZ1N3YXBFeGFjdEFtb3VudEluElUKK29zbW8xd3lzbXZtODRjNDRxbXo2cmVzNXo2YWY0c2wzbmV6a3M4d2hxOGQSCQgBEgV1b3NtbxIJCAISBXVhdG9tGgsKBHRlc3QSAzEwMCIDMjAwCogBCjIvb3Ntb3Npcy5wb29sbWFuYWdlci52MWJldGExLk1zZ1N3YXBFeGFjdEFtb3VudE91dBJSCitvc21vMWw1Z3RsZGgyOXlnMnFwdnc1OTR0YXlldXRrZmEzcXA2Y3VmNXF1EgYSBHRlc3QSCQgBEgV0ZXN0MhoDMjAwIgsKBHRlc3QSAzEwMAqgAQo7L29zbW9zaXMucG9vbG1hbmFnZXIudjFiZXRhMS5Nc2dTcGxpdFJvdXRlU3dhcEV4YWN0QW1vdW50SW4SYQorb3NtbzF0ajQyYWNxNTJmYXV3dHdwNnJ1OGV1ZTY4cHRqdnhkN3hhYTB0NBIZCgkIARIFdW9zbW8KCQgCEgV1YXRvbRIBMRIOCgkIAxIFdWF0b20SATEaBHVkYWkiATEKoQEKPC9vc21vc2lzLnBvb2xtYW5hZ2VyLnYxYmV0YTEuTXNnU3BsaXRSb3V0ZVN3YXBFeGFjdEFtb3VudE91dBJhCitvc21vMWpmZ3BxeTN6a3MwMGNwM2gwa3Y1MmZ5c2wweXBmbTdzZDNnYTdxEhkKCQgBEgV1YXRvbQoJCAISBXVvc21vEgExEg4KCQgDEgV1YXRvbRIBMRoEdWRhaSIBMRICRkUSaApRCkYKHy9jb3Ntb3MuY3J5cHRvLnNlY3AyNTZrMS5QdWJLZXkSIwohAgckqtBd6bxzXhwmqjjfqAMf8KeA9dGsd2UpOqErLHgGEgQKAggBGLgDEhMKDQoFdW9zbW8SBDEwMDAQpfENGkAcWpxPKGCis+ewdeWYy5wdpLfbLgM0dTPmJRb5oY19Klu7N1o+51NppWqWmKjNW8kyV7x56ERHdLV1WFoqFRwL")
    });
    test("osmo lockup", async () => {
        const message = `{
            "chain_id": "osmosis-1",
            "account_number": "630104",
            "sequence": "440",
            "fee": {
                "gas": "227493",
                "amount": [
                    {
                        "denom": "uosmo",
                        "amount": "1000"
                    }
                ]
            },
            "msgs": [
                {
                    "type": "osmosis/lockup/lock-tokens",
                    "value":{"owner":"osmo1w97jz9peqhpdjzup2jcr0zzrx58cdgwtns476k","duration":3600000000000,"coins":[{"denom":"test","amount":"100"}]} 
                },{
                    "type": "osmosis/lockup/begin-unlock-tokens",
                    "value":{"owner":"osmo15mm2t8u6ruk38sm6fv56elgva4hwmmtwvlu5s9"} 
                },{
                    "type": "osmosis/lockup/begin-unlock-period-lock",
                    "value":{"owner":"osmo1sk9yxf784z3ew37c679pe4jfpj4d8zjfz5c5k7","ID":1,"coins":[{"denom":"test","amount":"100"}]} 
                }            
            ],
            "memo": "FE"
        }`

        const privateKey : string = "ebc42dae1245fad403bd18f59f7283dc18724d2fc843b61e01224b978905734e"
        const wallet = new CommonCosmosWallet()

        const data : SignMessageData = {type: "amino", data: message, prefix:"osmo", withTx: true}
        const signTxParams : SignTxParams = {privateKey, data}
        const result = await wallet.signMessage(signTxParams)
        const res = JSON.parse(result)
        console.log(res)

        const sigData :SignMessageData = {type: "amino", data: message}
        const sigSignTxParams : SignTxParams = {privateKey, data: sigData}
        const sig = await wallet.signMessage(sigSignTxParams)
        console.log(sig)

        expect(res.signature).toStrictEqual(sig)
        expect(res.tx).toStrictEqual("CqACCmAKHS9vc21vc2lzLmxvY2t1cC5Nc2dMb2NrVG9rZW5zEj8KK29zbW8xdzk3ano5cGVxaHBkanp1cDJqY3IwenpyeDU4Y2Rnd3RuczQ3NmsSAwiQHBoLCgR0ZXN0EgMxMDAKVQokL29zbW9zaXMubG9ja3VwLk1zZ0JlZ2luVW5sb2NraW5nQWxsEi0KK29zbW8xNW1tMnQ4dTZydWszOHNtNmZ2NTZlbGd2YTRod21tdHd2bHU1czkKYQohL29zbW9zaXMubG9ja3VwLk1zZ0JlZ2luVW5sb2NraW5nEjwKK29zbW8xc2s5eXhmNzg0ejNldzM3YzY3OXBlNGpmcGo0ZDh6amZ6NWM1azcQARoLCgR0ZXN0EgMxMDASAkZFEmgKUQpGCh8vY29zbW9zLmNyeXB0by5zZWNwMjU2azEuUHViS2V5EiMKIQIHJKrQXem8c14cJqo436gDH/CngPXRrHdlKTqhKyx4BhIECgIIARi4AxITCg0KBXVvc21vEgQxMDAwEKXxDRpAAl8iwMWh1s2DcXTUMG8kSDvYWAX7zCtF5x3BC/9IFaJ+JsM8SPcJDjsoEr1xVDpJjKslbbqBqq/s5Za+vswBRg==")
    });

    test("osmo superfluid", async () => {
        const message = `{
            "chain_id": "osmosis-1",
            "account_number": "630104",
            "sequence": "440",
            "fee": {
                "gas": "227493",
                "amount": [
                    {
                        "denom": "uosmo",
                        "amount": "1000"
                    }
                ]
            },
            "msgs": [
                {
                    "type": "osmosis/superfluid-delegate",
                    "value":{"sender":"osmo1raxsfasvnldfan6v3n9kvgf208m7x642d2tl0n","lock_id":1,"val_addr":"valoper1xyz"} 
                },{
                    "type": "osmosis/superfluid-undelegate",
                    "value":{"sender":"osmo18mq00k24z3kra2zfxvjv6ny8h9teg53xlndmjw","pool_id":1} 
                },{
                    "type": "osmosis/lock-and-superfluid-delegate",
                    "value":{"sender":"osmo1raxsfasvnldfan6v3n9kvgf208m7x642d2tl0n","coins":[{"denom":"stake","amount":"1"}],"val_addr":"valoper1xyz"} 
                },{
                    "type": "osmosis/superfluid-unbond-lock",
                    "value": {"sender":"osmo1raxsfasvnldfan6v3n9kvgf208m7x642d2tl0n","lock_id":1}
                },{
                    "type": "osmosis/unpool-whitelisted-pool",
                    "value":{"sender":"osmo1raxsfasvnldfan6v3n9kvgf208m7x642d2tl0n","pool_id":1} 
                }
            ],
            "memo": "FE"
        }`

        const privateKey : string = "ebc42dae1245fad403bd18f59f7283dc18724d2fc843b61e01224b978905734e"
        const wallet = new CommonCosmosWallet()

        const data : SignMessageData = {type: "amino", data: message, prefix:"osmo", withTx: true}
        const signTxParams : SignTxParams = {privateKey, data}
        const result = await wallet.signMessage(signTxParams)
        const res = JSON.parse(result)
        console.log(res)

        const sigData :SignMessageData = {type: "amino", data: message}
        const sigSignTxParams : SignTxParams = {privateKey, data: sigData}
        const sig = await wallet.signMessage(sigSignTxParams)
        console.log(sig)

        expect(res.signature).toStrictEqual(sig)
        expect(res.tx).toStrictEqual("CooECmkKKS9vc21vc2lzLnN1cGVyZmx1aWQuTXNnU3VwZXJmbHVpZERlbGVnYXRlEjwKK29zbW8xcmF4c2Zhc3ZubGRmYW42djNuOWt2Z2YyMDhtN3g2NDJkMnRsMG4QARoLdmFsb3BlcjF4eXoKXAorL29zbW9zaXMuc3VwZXJmbHVpZC5Nc2dTdXBlcmZsdWlkVW5kZWxlZ2F0ZRItCitvc21vMThtcTAwazI0ejNrcmEyemZ4dmp2Nm55OGg5dGVnNTN4bG5kbWp3CnoKMC9vc21vc2lzLnN1cGVyZmx1aWQuTXNnTG9ja0FuZFN1cGVyZmx1aWREZWxlZ2F0ZRJGCitvc21vMXJheHNmYXN2bmxkZmFuNnYzbjlrdmdmMjA4bTd4NjQyZDJ0bDBuEgoKBXN0YWtlEgExGgt2YWxvcGVyMXh5egpeCisvb3Ntb3Npcy5zdXBlcmZsdWlkLk1zZ1N1cGVyZmx1aWRVbmJvbmRMb2NrEi8KK29zbW8xcmF4c2Zhc3ZubGRmYW42djNuOWt2Z2YyMDhtN3g2NDJkMnRsMG4QAQpfCiwvb3Ntb3Npcy5zdXBlcmZsdWlkLk1zZ1VuUG9vbFdoaXRlbGlzdGVkUG9vbBIvCitvc21vMXJheHNmYXN2bmxkZmFuNnYzbjlrdmdmMjA4bTd4NjQyZDJ0bDBuEAESAkZFEmgKUQpGCh8vY29zbW9zLmNyeXB0by5zZWNwMjU2azEuUHViS2V5EiMKIQIHJKrQXem8c14cJqo436gDH/CngPXRrHdlKTqhKyx4BhIECgIIARi4AxITCg0KBXVvc21vEgQxMDAwEKXxDRpAPOrnZ2BhN2PIIxWcVIfPLY5/csNX2ZPdMt38JLQ27LtF+2NthEPHu5sMuhHuFbwkUA1r9iV19nTuSKjSUoxN5w==")
    });
    test("osmo tokenfactory", async () => {
        const message = `{
            "chain_id": "osmosis-1",
            "account_number": "630104",
            "sequence": "440",
            "fee": {
                "gas": "227493",
                "amount": [
                    {
                        "denom": "uosmo",
                        "amount": "1000"
                    }
                ]
            },
            "msgs": [
            {
                "type": "osmosis/tokenfactory/create-denom",
                "value":{"sender":"osmo1z37dx9huszdglv3v6xt4rs6uduutytleu72zp6","subdenom":"valoper1xyz"}
            },{
                "type": "osmosis/tokenfactory/mint",
                "value":{"sender":"osmo1z37dx9huszdglv3v6xt4rs6uduutytleu72zp6","amount":{"denom":"denom","amount":"1"}}
            },{
                "type": "osmosis/tokenfactory/burn",
                "value":{"sender":"osmo1z37dx9huszdglv3v6xt4rs6uduutytleu72zp6","amount":{"denom":"denom","amount":"1"}}
            },{
                "type": "osmosis/tokenfactory/change-admin",
                "value":{"sender":"osmo1z37dx9huszdglv3v6xt4rs6uduutytleu72zp6","denom":"denom","new_admin":"osmo1q8tq5qhrhw6t970egemuuwywhlhpnmdmts6xnu"}
            }

            ],
            "memo": "FE"
        }`

        const privateKey : string = "ebc42dae1245fad403bd18f59f7283dc18724d2fc843b61e01224b978905734e"
        const wallet = new OsmoWallet()

        const data : SignMessageData = {type: "amino", data: message, withTx: true}
        const signTxParams : SignTxParams = {privateKey, data}
        const result = await wallet.signMessage(signTxParams)
        const res = JSON.parse(result)
        console.log(res)

        const sigData :SignMessageData = {type: "amino", data: message}
        const sigSignTxParams : SignTxParams = {privateKey, data: sigData}
        const sig = await wallet.signMessage(sigSignTxParams)
        console.log(sig)

        expect(res.signature).toStrictEqual(sig)
        expect(res.tx).toStrictEqual("CswDCmoKLC9vc21vc2lzLnRva2VuZmFjdG9yeS52MWJldGExLk1zZ0NyZWF0ZURlbm9tEjoKK29zbW8xejM3ZHg5aHVzemRnbHYzdjZ4dDRyczZ1ZHV1dHl0bGV1NzJ6cDYSC3ZhbG9wZXIxeHl6CmIKJS9vc21vc2lzLnRva2VuZmFjdG9yeS52MWJldGExLk1zZ01pbnQSOQorb3NtbzF6MzdkeDlodXN6ZGdsdjN2Nnh0NHJzNnVkdXV0eXRsZXU3MnpwNhIKCgVkZW5vbRIBMQpiCiUvb3Ntb3Npcy50b2tlbmZhY3RvcnkudjFiZXRhMS5Nc2dCdXJuEjkKK29zbW8xejM3ZHg5aHVzemRnbHYzdjZ4dDRyczZ1ZHV1dHl0bGV1NzJ6cDYSCgoFZGVub20SATEKkQEKLC9vc21vc2lzLnRva2VuZmFjdG9yeS52MWJldGExLk1zZ0NoYW5nZUFkbWluEmEKK29zbW8xejM3ZHg5aHVzemRnbHYzdjZ4dDRyczZ1ZHV1dHl0bGV1NzJ6cDYSBWRlbm9tGitvc21vMXE4dHE1cWhyaHc2dDk3MGVnZW11dXd5d2hsaHBubWRtdHM2eG51EgJGRRJoClEKRgofL2Nvc21vcy5jcnlwdG8uc2VjcDI1NmsxLlB1YktleRIjCiECBySq0F3pvHNeHCaqON+oAx/wp4D10ax3ZSk6oSsseAYSBAoCCAEYuAMSEwoNCgV1b3NtbxIEMTAwMBCl8Q0aQINN2qMVLp1/GcsavfRJKu7hzG9N8rV5csAgU8TywQRgasT/uP4xdar7mXjNHtzEKuy0JU1TheWGfnbkqjjCNZA=")
    });
    test("sei cosmwasm", async () => {
        const message = `{
            "chain_id": "atlantic-2",
            "account_number": "4050874",
            "sequence": "1",
            "fee": {
                "gas": "100000",
                "amount": [
                    {
                        "denom": "usei",
                        "amount": "1000"
                    }
                ]
            },
            "msgs": [
                {
                    "type": "wasm/MsgStoreCode",
                    "value":{"sender":"sei1s95zvpxwxcr0ykdkj3ymscrevdam7wvs24dk57","wasm_byte_code":"Zm9v"}
                },{
                    "type": "wasm/MsgInstantiateContract",
                    "value":{"sender":"sei1s95zvpxwxcr0ykdkj3ymscrevdam7wvs24dk57","code_id":1,"label":"foo","msg":{"some":"data"},"funds":[{"denom":"usei","amount":"200"}]}
                },{
                    "type": "wasm/MsgExecuteContract",
                    "value":{"sender":"sei1s95zvpxwxcr0ykdkj3ymscrevdam7wvs24dk57","contract":"sei165l5nch309rcgv765jyddwf35tane3t209ef355zf753k26s764sqkn6q9","msg":{"some":"data"},"funds":[{"denom":"usei","amount":"200"}]}
                },{
                    "type": "wasm/MsgMigrateContract",
                    "value":{"sender":"sei1s95zvpxwxcr0ykdkj3ymscrevdam7wvs24dk57","contract":"sei165l5nch309rcgv765jyddwf35tane3t209ef355zf753k26s764sqkn6q9","code_id":1,"msg":{"some":"data"}}
                },{
                    "type": "wasm/MsgUpdateAdmin",
                    "value":{"sender":"sei1s95zvpxwxcr0ykdkj3ymscrevdam7wvs24dk57","new_admin":"sei1urdedeej0fd4kslzn3uq6s8mndh8wt7usk6a4z","contract":"sei165l5nch309rcgv765jyddwf35tane3t209ef355zf753k26s764sqkn6q9"}
                },{
                    "type": "wasm/MsgClearAdmin",
                    "value":{"sender":"sei1s95zvpxwxcr0ykdkj3ymscrevdam7wvs24dk57","contract":"sei165l5nch309rcgv765jyddwf35tane3t209ef355zf753k26s764sqkn6q9"}
                }
            ],
            "memo": "FE"
        }`

        const privateKey = "ebc42dae1245fad403bd18f59f7283dc18724d2fc843b61e01224b9789057347"
        const wallet = new CommonCosmosWallet()

        const data : SignMessageData = {type: "amino", data: message, prefix: "sei", withTx: true}
        const signTxParams : SignTxParams = {privateKey, data}
        const result = await wallet.signMessage(signTxParams)
        const res = JSON.parse(result)
        console.log(res)

        const sigData :SignMessageData = {type: "amino", data: message}
        const sigSignTxParams : SignTxParams = {privateKey, data: sigData}
        const sig = await wallet.signMessage(sigSignTxParams)
        console.log(sig)

        expect(res.signature).toStrictEqual(sig)
        expect(res.tx).toStrictEqual("CooHClMKHi9jb3Ntd2FzbS53YXNtLnYxLk1zZ1N0b3JlQ29kZRIxCipzZWkxczk1enZweHd4Y3IweWtka2ozeW1zY3JldmRhbTd3dnMyNGRrNTcSA2Zvbwp9CigvY29zbXdhc20ud2FzbS52MS5Nc2dJbnN0YW50aWF0ZUNvbnRyYWN0ElEKKnNlaTFzOTV6dnB4d3hjcjB5a2RrajN5bXNjcmV2ZGFtN3d2czI0ZGs1NxgBIgNmb28qD3sic29tZSI6ImRhdGEifTILCgR1c2VpEgMyMDAKswEKJC9jb3Ntd2FzbS53YXNtLnYxLk1zZ0V4ZWN1dGVDb250cmFjdBKKAQoqc2VpMXM5NXp2cHh3eGNyMHlrZGtqM3ltc2NyZXZkYW03d3ZzMjRkazU3Ej5zZWkxNjVsNW5jaDMwOXJjZ3Y3NjVqeWRkd2YzNXRhbmUzdDIwOWVmMzU1emY3NTNrMjZzNzY0c3FrbjZxORoPeyJzb21lIjoiZGF0YSJ9KgsKBHVzZWkSAzIwMAqnAQokL2Nvc213YXNtLndhc20udjEuTXNnTWlncmF0ZUNvbnRyYWN0En8KKnNlaTFzOTV6dnB4d3hjcjB5a2RrajN5bXNjcmV2ZGFtN3d2czI0ZGs1NxI+c2VpMTY1bDVuY2gzMDlyY2d2NzY1anlkZHdmMzV0YW5lM3QyMDllZjM1NXpmNzUzazI2czc2NHNxa242cTkYASIPeyJzb21lIjoiZGF0YSJ9Cr0BCiAvY29zbXdhc20ud2FzbS52MS5Nc2dVcGRhdGVBZG1pbhKYAQoqc2VpMXM5NXp2cHh3eGNyMHlrZGtqM3ltc2NyZXZkYW03d3ZzMjRkazU3EipzZWkxdXJkZWRlZWowZmQ0a3Nsem4zdXE2czhtbmRoOHd0N3VzazZhNHoaPnNlaTE2NWw1bmNoMzA5cmNndjc2NWp5ZGR3ZjM1dGFuZTN0MjA5ZWYzNTV6Zjc1M2syNnM3NjRzcWtuNnE5Co8BCh8vY29zbXdhc20ud2FzbS52MS5Nc2dDbGVhckFkbWluEmwKKnNlaTFzOTV6dnB4d3hjcjB5a2RrajN5bXNjcmV2ZGFtN3d2czI0ZGs1Nxo+c2VpMTY1bDVuY2gzMDlyY2d2NzY1anlkZHdmMzV0YW5lM3QyMDllZjM1NXpmNzUzazI2czc2NHNxa242cTkSAkZFEmYKUApGCh8vY29zbW9zLmNyeXB0by5zZWNwMjU2azEuUHViS2V5EiMKIQP3ndcCmlkF5VeQYUKwxX7CH0dF8Sm4wFeuzPQuJ1C6bhIECgIIARgBEhIKDAoEdXNlaRIEMTAwMBCgjQYaQKL3Rh1oaR36ADgljmHeT+WOPYd1ajv2vgD0MjgcuSJtMRS71HLb7eDv1RBovUEr2+i7lXiHqcr6DiNZEo+sF9s=")
    });

    test("kava auction", async () => {
        const message = `{
            "chain_id": "kava_2222-10",
            "account_number": "2211629",
            "sequence": "0",
            "fee": {
                "gas": "100000",
                "amount": [
                    {
                        "denom": "ukava",
                        "amount": "1000"
                    }
                ]
            },
            "msgs": [
                {
                    "type": "auction/MsgPlaceBid",
                    "value":{"auction_id":1,"bidder":"kava1qcfdf69js922qrdr4yaww3ax7gjml6pd39p8lj","amount":{"denom":"ukava","amount":"10"}}
                }
            ],
            "memo": "FE"
        }`

        const privateKey = "ebc42dae1245fad403bd18f59f7283dc18724d2fc843b61e01224b9789057347"
        const wallet = new KavaWallet()

        const data : SignMessageData = {type: "amino", data: message, withTx: true}
        const signTxParams : SignTxParams = {privateKey, data}
        const result = await wallet.signMessage(signTxParams)
        const res = JSON.parse(result)
        console.log(res)

        const sigData :SignMessageData = {type: "amino", data: message}
        const sigSignTxParams : SignTxParams = {privateKey, data: sigData}
        const sig = await wallet.signMessage(sigSignTxParams)
        console.log(sig)

        expect(res.signature).toStrictEqual(sig)
        expect(res.tx).toStrictEqual("CmcKYQohL2thdmEuYXVjdGlvbi52MWJldGExLk1zZ1BsYWNlQmlkEjwIARIra2F2YTFxY2ZkZjY5anM5MjJxcmRyNHlhd3czYXg3Z2ptbDZwZDM5cDhsahoLCgV1a2F2YRICMTASAkZFEmUKTgpGCh8vY29zbW9zLmNyeXB0by5zZWNwMjU2azEuUHViS2V5EiMKIQP3ndcCmlkF5VeQYUKwxX7CH0dF8Sm4wFeuzPQuJ1C6bhIECgIIARITCg0KBXVrYXZhEgQxMDAwEKCNBhpAAHNrAt8Cr+HxvhyApdJ103DwBxeQATujmelm8TjgYWYGAWf1jnNBHwL3Pi6PhSd/eGgzauSmzX/7eU1WdbwTSQ==")

    })
    test("kava hard", async () => {
        const message = `{
            "chain_id": "kava_2222-10",
            "account_number": "2211629",
            "sequence": "0",
            "fee": {
                "gas": "100000",
                "amount": [
                    {
                        "denom": "ukava",
                        "amount": "1000"
                    }
                ]
            },
            "msgs": [
                {
                    "type": "hard/MsgDeposit",
                    "value":{"depositor":"kava1qcfdf69js922qrdr4yaww3ax7gjml6pd39p8lj","amount":[{"denom":"ukava","amount":"10000000"}]}
                },{
                    "type": "hard/MsgWithdraw",
                    "value":{"depositor":"kava1qcfdf69js922qrdr4yaww3ax7gjml6pd39p8lj","amount":[{"denom":"ukava","amount":"10000000"}]}
                },{
                    "type": "hard/MsgBorrow",
                    "value":{"borrower":"kava1qcfdf69js922qrdr4yaww3ax7gjml6pd39p8lj","amount":[{"denom":"ukava","amount":"10000000"}]}
                },{
                    "type": "hard/MsgLiquidate",
                    "value":{"keeper":"kava1qcfdf69js922qrdr4yaww3ax7gjml6pd39p8lj","borrower":"kava1qcfdf69js922qrdr4yaww3ax7gjml6pd39p8lj"}
                },{
                    "type": "hard/MsgRepay",
                    "value":{"sender":"kava1qcfdf69js922qrdr4yaww3ax7gjml6pd39p8lj","owner":"kava1qcfdf69js922qrdr4yaww3ax7gjml6pd39p8lj","amount":[{"denom":"ukava","amount":"1000000"}]}
                }
            ],
            "memo": "FE"
        }`

        const privateKey = "ebc42dae1245fad403bd18f59f7283dc18724d2fc843b61e01224b9789057347"
        const wallet = new KavaWallet()

        const data : SignMessageData = {type: "amino", data: message, withTx: true}
        const signTxParams : SignTxParams = {privateKey, data}
        const result = await wallet.signMessage(signTxParams)
        const res = JSON.parse(result)
        console.log(res)

        const sigData :SignMessageData = {type: "amino", data: message}
        const sigSignTxParams : SignTxParams = {privateKey, data: sigData}
        const sig = await wallet.signMessage(sigSignTxParams)
        console.log(sig)

        expect(res.signature).toStrictEqual(sig)
        expect(res.tx).toStrictEqual("CroECmEKHS9rYXZhLmhhcmQudjFiZXRhMS5Nc2dEZXBvc2l0EkAKK2thdmExcWNmZGY2OWpzOTIycXJkcjR5YXd3M2F4N2dqbWw2cGQzOXA4bGoSEQoFdWthdmESCDEwMDAwMDAwCmIKHi9rYXZhLmhhcmQudjFiZXRhMS5Nc2dXaXRoZHJhdxJACitrYXZhMXFjZmRmNjlqczkyMnFyZHI0eWF3dzNheDdnam1sNnBkMzlwOGxqEhEKBXVrYXZhEggxMDAwMDAwMApgChwva2F2YS5oYXJkLnYxYmV0YTEuTXNnQm9ycm93EkAKK2thdmExcWNmZGY2OWpzOTIycXJkcjR5YXd3M2F4N2dqbWw2cGQzOXA4bGoSEQoFdWthdmESCDEwMDAwMDAwCn0KHy9rYXZhLmhhcmQudjFiZXRhMS5Nc2dMaXF1aWRhdGUSWgora2F2YTFxY2ZkZjY5anM5MjJxcmRyNHlhd3czYXg3Z2ptbDZwZDM5cDhsahIra2F2YTFxY2ZkZjY5anM5MjJxcmRyNHlhd3czYXg3Z2ptbDZwZDM5cDhsagqLAQobL2thdmEuaGFyZC52MWJldGExLk1zZ1JlcGF5EmwKK2thdmExcWNmZGY2OWpzOTIycXJkcjR5YXd3M2F4N2dqbWw2cGQzOXA4bGoSK2thdmExcWNmZGY2OWpzOTIycXJkcjR5YXd3M2F4N2dqbWw2cGQzOXA4bGoaEAoFdWthdmESBzEwMDAwMDASAkZFEmUKTgpGCh8vY29zbW9zLmNyeXB0by5zZWNwMjU2azEuUHViS2V5EiMKIQP3ndcCmlkF5VeQYUKwxX7CH0dF8Sm4wFeuzPQuJ1C6bhIECgIIARITCg0KBXVrYXZhEgQxMDAwEKCNBhpAXxHOx6IxzUT3tITv0ODAy37mZAmanmeI+5rk7hZ8pDNOMe4gl7nDo8gMnCzNqBI/u+GOD6SJpj9DskX/fTFnpQ==")

    })
    test("kava swap", async () => {
        const message = `{
            "chain_id": "kava_2222-10",
            "account_number": "2211629",
            "sequence": "0",
            "fee": {
                "gas": "100000",
                "amount": [
                    {
                        "denom": "ukava",
                        "amount": "1000"
                    }
                ]
            },
            "msgs": [
                {
                    "type": "swap/MsgDeposit",
                    "value":{"depositor":"kava1gepm4nwzz40gtpur93alv9f9wm5ht4l0hzzw9d","token_a":{"denom":"ukava","amount":"1000000"},"token_b":{"denom":"usdx","amount":"5000000"},"slippage":"0.010000000000000000","deadline":1623606299}
                },{
                    "type": "swap/MsgWithdraw",
                    "value":{"from":"kava1w3jhxap3fs3yn3","shares":"1500000","min_token_a":{"denom":"ukava","amount":"1000000"},"min_token_b":{"denom":"usdx","amount":"2000000"},"deadline":1623606299}
                },{
                    "type": "swap/MsgSwapExactForTokens",
                    "value":{"requester":"kava1w3jhxap3fs3yn3","exact_token_a":{"denom":"ukava","amount":"1000000"},"token_b":{"denom":"usdx","amount":"5000000"},"slippage":"0.010000000000000000","deadline":1623606299}
                },{
                    "type": "swap/MsgSwapForExactTokens",
                    "value":{"requester":"kava1w3jhxap3fs3yn3","token_a":{"denom":"ukava","amount":"1000000"},"exact_token_b":{"denom":"usdx","amount":"5000000"},"slippage":"0.010000000000000000","deadline":1623606299}
                }
            ],
            "memo": "FE"
        }`;

        const privateKey = "ebc42dae1245fad403bd18f59f7283dc18724d2fc843b61e01224b9789057347"
        const wallet = new KavaWallet()

        const data : SignMessageData = {type: "amino", data: message, withTx: true}
        const signTxParams : SignTxParams = {privateKey, data}
        const result = await wallet.signMessage(signTxParams)
        const res = JSON.parse(result)
        console.log(res)

        const sigData :SignMessageData = {type: "amino", data: message}
        const sigSignTxParams : SignTxParams = {privateKey, data: sigData}
        const sig = await wallet.signMessage(sigSignTxParams)
        console.log(sig)

        expect(res.signature).toStrictEqual(sig)
        expect(res.tx).toStrictEqual("CvoDCooBCh0va2F2YS5zd2FwLnYxYmV0YTEuTXNnRGVwb3NpdBJpCitrYXZhMWdlcG00bnd6ejQwZ3RwdXI5M2FsdjlmOXdtNWh0NGwwaHp6dzlkEhAKBXVrYXZhEgcxMDAwMDAwGg8KBHVzZHgSBzUwMDAwMDAiETEwMDAwMDAwMDAwMDAwMDAwKJuImYYGCmkKHi9rYXZhLnN3YXAudjFiZXRhMS5Nc2dXaXRoZHJhdxJHChNrYXZhMXczamh4YXAzZnMzeW4zEgcxNTAwMDAwGhAKBXVrYXZhEgcxMDAwMDAwIg8KBHVzZHgSBzIwMDAwMDAom4iZhgYKfQooL2thdmEuc3dhcC52MWJldGExLk1zZ1N3YXBFeGFjdEZvclRva2VucxJRChNrYXZhMXczamh4YXAzZnMzeW4zEhAKBXVrYXZhEgcxMDAwMDAwGg8KBHVzZHgSBzUwMDAwMDAiETEwMDAwMDAwMDAwMDAwMDAwKJuImYYGCn0KKC9rYXZhLnN3YXAudjFiZXRhMS5Nc2dTd2FwRm9yRXhhY3RUb2tlbnMSUQoTa2F2YTF3M2poeGFwM2ZzM3luMxIQCgV1a2F2YRIHMTAwMDAwMBoPCgR1c2R4Egc1MDAwMDAwIhExMDAwMDAwMDAwMDAwMDAwMCibiJmGBhICRkUSZQpOCkYKHy9jb3Ntb3MuY3J5cHRvLnNlY3AyNTZrMS5QdWJLZXkSIwohA/ed1wKaWQXlV5BhQrDFfsIfR0XxKbjAV67M9C4nULpuEgQKAggBEhMKDQoFdWthdmESBDEwMDAQoI0GGkBEVhIqCJPPGQIKG0SClM7MspOOo0YgmT/BUYgfb+GlAEo0977GzaewxPMOsTQ0AI7V7C3Iabv5Oee5d86OJBUS")
    })
})

