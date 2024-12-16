import {BaseWallet, buildCommonSignMsg, SignType, SimpleWallet} from "../src";
import assert from "assert";

describe("crypto", () => {
    test("magicHash", async () => {
        let wallet = new SimpleWallet();
        let data = buildCommonSignMsg("0x067aec3603bdca82e52a172ec69b2505a979f1d935a59409bacae5c7f268fc26", "123456789")
        let param = {
            privateKey: "aa2b47a2d76ddce0a9d2d11d03baa1d60c90aa97e0e7064287c2268e85637e80",
            signType: SignType.Secp256k1,
            message: data
        }
        if (false) {
            //aptos
            param.signType = SignType.ED25519
            param.privateKey="4a6d287353203941768551f66446d5d4a85ab685b5b444041801014ae39419b5"
            data = buildCommonSignMsg("067aec3603bdca82e52a172ec69b2505a979f1d935a59409bacae5c7f268fc26", "123456789")
            param.message = data;
            let sig = await wallet.signCommonMsg(param)
            assert.strictEqual(sig, "fb2e769833b0f4d7e33f8fdea12f542337522701af82e06e272640945b9e71e024b0acf1089aaf3930a5c58f89c1dd034d417f5e04e4c4f42b67a4f29dcabf07")
            console.log("aptos ed25519 sig:",sig)
            console.log("publickey:","067aec3603bdca82e52a172ec69b2505a979f1d935a59409bacae5c7f268fc26")
            return
        }
        if(false){
            //bitcoin
            param.privateKey="0743bf0e3864122edff9f143006f0a0d61b16df3f676c8070dac1d0f42d78353"
            data = buildCommonSignMsg("03052b16e71e4413f24f8504c3b188b7edebf97b424582877e4993ef9b23d0f045", "123456789")
            param.message = data;
            param.signType = SignType.Secp256k1
            //87feb2cc194b8d41a9c6ff0dc0ddba952c7ba73936d3f0361d498341716c2b34426876ef21ad4f5f94482bafe72a418729737b9461303be9da2be849a4123f021b
            let sig = await wallet.signCommonMsg(param)
            console.log("bitcoin Secp256k1 sig:",sig)
            console.log("publickey:","03052b16e71e4413f24f8504c3b188b7edebf97b424582877e4993ef9b23d0f045")
            console.log("address:","1GhLyRg4zzFixW3ZY5ViFzT4W5zTT9h7Pc")
            return
        }
        if(false){
            //ada
            //30db52f355dc57e92944cbc93e2d30c9352a096fa2bbe92f1db377d3fdc2714aa3d22e03781d5a8ffef084aa608b486454b34c68e6e402d4ad15462ee1df5b8860e14a0177329777e9eb572aa8c64c6e760a1239fd85d69ad317d57b02c3714aeb6e22ea54b3364c8aaa0dd8ee5f9cea06fa6ce22c3827b740827dd3d01fe8f3
            //60e14a0177329777e9eb572aa8c64c6e760a1239fd85d69ad317d57b02c3714aeb6e22ea54b3364c8aaa0dd8ee5f9cea06fa6ce22c3827b740827dd3d01fe8f3

            param.privateKey="30db52f355dc57e92944cbc93e2d30c9352a096fa2bbe92f1db377d3fdc2714aa3d22e03781d5a8ffef084aa608b486454b34c68e6e402d4ad15462ee1df5b8860e14a0177329777e9eb572aa8c64c6e760a1239fd85d69ad317d57b02c3714aeb6e22ea54b3364c8aaa0dd8ee5f9cea06fa6ce22c3827b740827dd3d01fe8f3"
            let publicKey = "f78d9bc8ca867c04f75fd86f2457c1ba35ce6b25e7cbc90356eea4b1503e2f537d3d86598bc62e0481f803603bc7f33cbddb1f185417e9386fce43d871c270b0";
            data = buildCommonSignMsg(publicKey, "123456789")
            param.message = data;
            param.signType = SignType.ED25519
            let sig = await wallet.signCommonMsg(param)
            let addr = "addr1q95y9uu3ekfwmlu3mthnjeuptu95th8m0qzqw2kexej6xgpttfhlqgwy5vavd7ggzneerhd80456j736e085zcys9y9q5frsx7";
            let chainIndex = 70000029;
            let coinName = "ada";
            console.log(`{"coin_name":"${coinName}","data":"{\"pubKey\":\"${publicKey}\",\"name\":\"Account 01\",\"walletType\":1,\"accountId\":\"123456789\",\"addresses\":[{\"address\":\"${addr}\",\"chainPubKey\":\"${publicKey}\",\"chainSign\":\"${sig}\",\"chainIndexList\":[${chainIndex}]}]}\","func_name":"verify_web_data"}`)
            return
        }
        if(false){
            //cosmos sei
            param.privateKey="ebc42dae1245fad403bd18f59f7283dc18724d2fc843b61e01224b9789057347"
            let publicKey = "03f79dd7029a5905e557906142b0c57ec21f4745f129b8c057aeccf42e2750ba6e";
            data = buildCommonSignMsg(publicKey, "123456789")
            param.message = data;
            param.signType = SignType.Secp256k1
            let sig = await wallet.signCommonMsg(param)
            let addr = "sei137augvuewy625ns8a2age4sztl09hs7pk0ulte";
            let chainIndex = 70000029;
            let coinName = "sei";
            console.log(`{"coin_name":"${coinName}","data":"{\"pubKey\":\"${publicKey}\",\"name\":\"Account 01\",\"walletType\":1,\"accountId\":\"123456789\",\"addresses\":[{\"address\":\"${addr}\",\"chainPubKey\":\"${publicKey}\",\"chainSign\":\"${sig}\",\"chainIndexList\":[${chainIndex}]}]}","func_name":"verify_web_data"}`)

            return
            //axelarWallet
            publicKey = "03f79dd7029a5905e557906142b0c57ec21f4745f129b8c057aeccf42e2750ba6e";
            data = buildCommonSignMsg(publicKey, "123456789")
            param.message = data;
            param.signType = SignType.Secp256k1
            sig = await wallet.signCommonMsg(param)
            addr = "axelar137augvuewy625ns8a2age4sztl09hs7pldmpxe";
            chainIndex = 718;
            coinName = "axelar";
            console.log(`{"coin_name":"${coinName}","data":"{\"pubKey\":\"${publicKey}\",\"name\":\"Account 01\",\"walletType\":1,\"accountId\":\"123456789\",\"addresses\":[{\"address\":\"${addr}\",\"chainPubKey\":\"${publicKey}\",\"chainSign\":\"${sig}\",\"chainIndexList\":[${chainIndex}]}]}","func_name":"verify_web_data"}`)

            return
            //OsmoWallet
            publicKey = "03f79dd7029a5905e557906142b0c57ec21f4745f129b8c057aeccf42e2750ba6e";
            data = buildCommonSignMsg(publicKey, "123456789")
            param.message = data;
            param.signType = SignType.Secp256k1
            sig = await wallet.signCommonMsg(param)
            addr = "osmo137augvuewy625ns8a2age4sztl09hs7pnc7em2";
            chainIndex = 706;
            coinName = "osmo";
            console.log(`{"coin_name":"${coinName}","data":"{\"pubKey\":\"${publicKey}\",\"name\":\"Account 01\",\"walletType\":1,\"accountId\":\"123456789\",\"addresses\":[{\"address\":\"${addr}\",\"chainPubKey\":\"${publicKey}\",\"chainSign\":\"${sig}\",\"chainIndexList\":[${chainIndex}]}]}","func_name":"verify_web_data"}`)

            return
            //atom
            publicKey = "03f79dd7029a5905e557906142b0c57ec21f4745f129b8c057aeccf42e2750ba6e";
            data = buildCommonSignMsg(publicKey, "123456789")
            param.message = data;
            param.signType = SignType.Secp256k1
            sig = await wallet.signCommonMsg(param)
            addr = "cosmos137augvuewy625ns8a2age4sztl09hs7pmrdfdc";
            chainIndex = 118;
            coinName = "atom";
            console.log(`{"coin_name":"${coinName}","data":"{\"pubKey\":\"${publicKey}\",\"name\":\"Account 01\",\"walletType\":1,\"accountId\":\"123456789\",\"addresses\":[{\"address\":\"${addr}\",\"chainPubKey\":\"${publicKey}\",\"chainSign\":\"${sig}\",\"chainIndexList\":[${chainIndex}]}]}","func_name":"verify_web_data"}`)


            //evmos
            publicKey = "04f79dd7029a5905e557906142b0c57ec21f4745f129b8c057aeccf42e2750ba6e5a3cd57da2dbff48776f6d57d2353f1fff89f59ff04074984d9b46f243c5d50d";
            data = buildCommonSignMsg(publicKey, "123456789")
            param.message = data;
            param.signType = SignType.Secp256k1
            sig = await wallet.signCommonMsg(param)
            addr = "evmos1mfl9drwvnh32ruecnzv48d05dwy4jc0nvz95sx";
            chainIndex = 710;
            coinName = "evmos";
            console.log(`{"coin_name":"${coinName}","data":"{\"pubKey\":\"${publicKey}\",\"name\":\"Account 01\",\"walletType\":1,\"accountId\":\"123456789\",\"addresses\":[{\"address\":\"${addr}\",\"chainPubKey\":\"${publicKey}\",\"chainSign\":\"${sig}\",\"chainIndexList\":[${chainIndex}]}]}","func_name":"verify_web_data"}`)


            return
        }
        //wax eos
        if(false){
            //wax
            param.privateKey="e0c98a7a7506c7790ea2fd62a7df5f5e0be419d0787b29b00dee3131b9f985a9"
            let publicKey = "EOS5uHXgWKzQExL2Lhu9y8716B4dkYL4T6oUq8J9FrY6EDB79naYF";
            data = buildCommonSignMsg(publicKey, "123456789")
            param.message = data;
            param.signType = SignType.Secp256k1
            let sig = await wallet.signCommonMsg(param)
            let addr = "";
            let chainIndex = 14001;
            let coinName = "wax"
            let actual = `{"coin_name":"${coinName}","data":"{\"pubKey\":\"${publicKey}\",\"name\":\"Account 01\",\"walletType\":1,\"accountId\":\"123456789\",\"addresses\":[{\"address\":\"${addr}\",\"chainPubKey\":\"${publicKey}\",\"chainSign\":\"${sig}\",\"chainIndexList\":[${chainIndex}]}]}","func_name":"verify_web_data"}`
            let expected = `{"coin_name":"wax","data":"{"pubKey":"EOS5uHXgWKzQExL2Lhu9y8716B4dkYL4T6oUq8J9FrY6EDB79naYF","name":"Account 01","walletType":1,"accountId":"123456789","addresses":[{"address":"","chainPubKey":"EOS5uHXgWKzQExL2Lhu9y8716B4dkYL4T6oUq8J9FrY6EDB79naYF","chainSign":"1ba9905fbbca00750512cca3ae80d8db9d7145e726840e0a1a7affffc8d1b1fd0449f938124b700a38cdd776542a85bb0428718f0ae5db0edd536c0fb5cc296933","chainIndexList":[14001]}]}","func_name":"verify_web_data"}`;
            assert.strictEqual(actual, expected);
            return
        }
        if(false){
            //eos
            param.privateKey="579aa3f585cce7d0ba58e37a03be7b7eb7415d2bc3d92dfe9a23a5df0c7a48cc"
            let publicKey = "EOS6Dy7412h4XWxombV8fAqzDmE3EH9Yq2G6rP18Y7Anii2F7hhi6";
            data = buildCommonSignMsg(publicKey, "123456789")
            param.message = data;
            param.signType = SignType.Secp256k1
            let sig = await wallet.signCommonMsg(param)
            let addr = "";
            let chainIndex = 194;
            let coinName = "eos"
            let actual = `{"coin_name":"${coinName}","data":"{\"pubKey\":\"${publicKey}\",\"name\":\"Account 01\",\"walletType\":1,\"accountId\":\"123456789\",\"addresses\":[{\"address\":\"${addr}\",\"chainPubKey\":\"${publicKey}\",\"chainSign\":\"${sig}\",\"chainIndexList\":[${chainIndex}]}]}","func_name":"verify_web_data"}`
            let expected = `{"coin_name":"eos","data":"{"pubKey":"EOS6Dy7412h4XWxombV8fAqzDmE3EH9Yq2G6rP18Y7Anii2F7hhi6","name":"Account 01","walletType":1,"accountId":"123456789","addresses":[{"address":"","chainPubKey":"EOS6Dy7412h4XWxombV8fAqzDmE3EH9Yq2G6rP18Y7Anii2F7hhi6","chainSign":"1b6bd88a148fbcf1bda468d0913b78bbf9b13365dda6ebb476fa0392b80b1b1da132f48968a3f13abbf1dc0c6e73328417a80e484c3e3ee45b86f1e54b9cd99f03","chainIndexList":[194]}]}","func_name":"verify_web_data"}`;
            assert.strictEqual(actual, expected);
            return
        }
        if(false){
            //ethereum
            param.privateKey="0743bf0e3864122edff9f143006f0a0d61b16df3f676c8070dac1d0f42d78353"
            let publicKey = "04052b16e71e4413f24f8504c3b188b7edebf97b424582877e4993ef9b23d0f0452c8b0c821e01cb6d1f57f882f748fef7146f06c7c96e0d03ec73cf97bf01959f";
            data = buildCommonSignMsg(publicKey, "123456789")
            param.message = data;
            param.signType = SignType.Secp256k1
            let sig = await wallet.signCommonMsg(param)
            let addr = "0xc643772dd8e6c1a975ff91422a91ad3461869d6f";
            let chainIndex = 1;
            let coinName = "eth"
            let actual = `{"coin_name":"${coinName}","data":"{\"pubKey\":\"${publicKey}\",\"name\":\"Account 01\",\"walletType\":1,\"accountId\":\"123456789\",\"addresses\":[{\"address\":\"${addr}\",\"chainPubKey\":\"${publicKey}\",\"chainSign\":\"${sig}\",\"chainIndexList\":[${chainIndex}]}]}","func_name":"verify_web_data"}`
            let expected = `{"coin_name":"eth","data":"{"pubKey":"052b16e71e4413f24f8504c3b188b7edebf97b424582877e4993ef9b23d0f0452c8b0c821e01cb6d1f57f882f748fef7146f06c7c96e0d03ec73cf97bf01959f","name":"Account 01","walletType":1,"accountId":"123456789","addresses":[{"address":"","chainPubKey":"052b16e71e4413f24f8504c3b188b7edebf97b424582877e4993ef9b23d0f0452c8b0c821e01cb6d1f57f882f748fef7146f06c7c96e0d03ec73cf97bf01959f","chainSign":"1b54ccccdc9d961f15b2db5a8c8b9ccf7f02b2c0510eaa8ac3bca57832922b97025be87f7322c0d35bf802bffef7b52599e1fe3c3c1f842914cb37819025367625","chainIndexList":[1]}]}","func_name":"verify_web_data"}`;
            console.log(actual)
            // assert.strictEqual(actual, expected);
            return
        }
        if(false){
            //kaspa
            param.privateKey="d636a23d4f49fe4e0d59fcf7a6c2ab3846ff2d3a54007b3817a11dff770d06ff"
            let publicKey = "0395c7c9703e0ff81596043f0a5e00684f860a1ab0f24c5a94931d1e0d94c4be";
            data = buildCommonSignMsg(publicKey, "123456789")
            param.message = data;
            param.signType = SignType.Secp256k1
            let sig = await wallet.signCommonMsg(param);
            let addr = "kaspa:qqpet37fwqlql7q4jczr7zj7qp5ylps2r2c0ynz6jjf368sdjnztufeghvc9x";
            let chainIndex = 111111;
            let coinName = "kaspa"
            let actual = `{"coin_name":"${coinName}","data":"{\"pubKey\":\"${publicKey}\",\"name\":\"Account 01\",\"walletType\":1,\"accountId\":\"123456789\",\"addresses\":[{\"address\":\"${addr}\",\"chainPubKey\":\"${publicKey}\",\"chainSign\":\"${sig}\",\"chainIndexList\":[${chainIndex}]}]}","func_name":"verify_web_data"}`
            let expected = `{"coin_name":"kaspa","data":"{"pubKey":"0395c7c9703e0ff81596043f0a5e00684f860a1ab0f24c5a94931d1e0d94c4be","name":"Account 01","walletType":1,"accountId":"123456789","addresses":[{"address":"kaspa:qqpet37fwqlql7q4jczr7zj7qp5ylps2r2c0ynz6jjf368sdjnztufeghvc9x","chainPubKey":"0395c7c9703e0ff81596043f0a5e00684f860a1ab0f24c5a94931d1e0d94c4be","chainSign":"1ca64e53306b181d26888429d9cdaa22cebd4b4fd84f5d0aaa0699df7d996299587fea8ba53890ebe09f55a9ac4ae867059b496bd8feabb97f8a4e20a34b73bc21","chainIndexList":[111111]}]}","func_name":"verify_web_data"}`;
            assert.strictEqual(actual, expected);
            return
        }
        if(false){
            //near
            param.privateKey="ebc42dae1245fad403bd18f59f7283dc18724d2fc843b61e01224b9789057347"
            let publicKey = "ed25519:1eZPzUUUAtHcrQzCtbsA1feL82pVgHAwkXLEjt5U3T1";
            data = buildCommonSignMsg(publicKey, "123456789")
            param.message = data;
            param.signType = SignType.ED25519
            let sig = await wallet.signCommonMsg(param)
            let addr = "002a77b478bf1ed25a6e00d5a458c800541313c3d8502c5d7f8249f912f55f84";
            let chainIndex = 397;
            let coinName = "near"
            let actual = `{"coin_name":"${coinName}","data":"{\"pubKey\":\"${publicKey}\",\"name\":\"Account 01\",\"walletType\":1,\"accountId\":\"123456789\",\"addresses\":[{\"address\":\"${addr}\",\"chainPubKey\":\"${publicKey}\",\"chainSign\":\"${sig}\",\"chainIndexList\":[${chainIndex}]}]}","func_name":"verify_web_data"}`
            let expected = `{"coin_name":"near","data":"{"pubKey":"ed25519:1eZPzUUUAtHcrQzCtbsA1feL82pVgHAwkXLEjt5U3T1","name":"Account 01","walletType":1,"accountId":"123456789","addresses":[{"address":"002a77b478bf1ed25a6e00d5a458c800541313c3d8502c5d7f8249f912f55f84","chainPubKey":"ed25519:1eZPzUUUAtHcrQzCtbsA1feL82pVgHAwkXLEjt5U3T1","chainSign":"9cd25548cbd7af813b239a0aa0be329a3d1b053d6b84a63d1d7027d5459e864871b6eb259e9f74c752371f0348804be86e01ab26760a77eb071a7c9945e9b00a","chainIndexList":[397]}]}","func_name":"verify_web_data"}`;
            assert.strictEqual(actual, expected);
            return
        }

        if(false){
            //nostrassets
            param.privateKey="bb1c93508b962c7efb0a340848538b2c5f7ba6c44e55f52389aa132a2fd3521a"
            let publicKey = "14ccbe1d4a55fe23628576a7f04637f647fd6b86d362f983f4ebd7b95d47796f";
            data = buildCommonSignMsg(publicKey, "123456789")
            param.message = data;
            param.signType = SignType.Secp256k1
            let sig = await wallet.signCommonMsg(param);
            let addr = "npub1znxtu8222hlzxc59w6nlq33h7erl66ux6d30nql5a0tmjh2809hstw0d22";
            let chainIndex = 1237;
            let coinName = "nostrassets"
            let actual = `{"coin_name":"${coinName}","data":"{\"pubKey\":\"${publicKey}\",\"name\":\"Account 01\",\"walletType\":1,\"accountId\":\"123456789\",\"addresses\":[{\"address\":\"${addr}\",\"chainPubKey\":\"${publicKey}\",\"chainSign\":\"${sig}\",\"chainIndexList\":[${chainIndex}]}]}","func_name":"verify_web_data"}`;
            let expect = `{"coin_name":"nostrassets","data":"{"pubKey":"14ccbe1d4a55fe23628576a7f04637f647fd6b86d362f983f4ebd7b95d47796f","name":"Account 01","walletType":1,"accountId":"123456789","addresses":[{"address":"npub1znxtu8222hlzxc59w6nlq33h7erl66ux6d30nql5a0tmjh2809hstw0d22","chainPubKey":"14ccbe1d4a55fe23628576a7f04637f647fd6b86d362f983f4ebd7b95d47796f","chainSign":"1c4fe0c27c944b99630468c06fb9d37435c6f14e1537b1c8a725ff11c3fb35bfb6286ec3297553f45791d63fa828a957f752d357c8d58122862d5ba123dd5ee3cf","chainIndexList":[1237]}]}","func_name":"verify_web_data"}`
            assert.strictEqual(actual, expect);
            return
        }
    })

    test("magicHash2", async () => {
        let wallet = new SimpleWallet();
        let data = buildCommonSignMsg("0x067aec3603bdca82e52a172ec69b2505a979f1d935a59409bacae5c7f268fc26", "123456789")
        let param = {
            privateKey: "aa2b47a2d76ddce0a9d2d11d03baa1d60c90aa97e0e7064287c2268e85637e80",
            signType: SignType.Secp256k1,
            message: data
        }
        if (false) {
            //solana
            param.signType = SignType.ED25519
            param.privateKey="037f00373589c700a411382ae702e258b01f30a509a32be2b2c84fb54de4c1e5fd5fd86d7d7b8355492b1517a96a2fbb17e1a374b80a21559bdfee0dfbaa0b32"
            let publicKey = "fd5fd86d7d7b8355492b1517a96a2fbb17e1a374b80a21559bdfee0dfbaa0b32"
            data = buildCommonSignMsg(publicKey, "123456789")
            param.message = data;
            let sig = await wallet.signCommonMsg(param)
            let addr = "J44uzihE3Ty2YBdMsLwCE3hV5uf2q2hRJQMnW2NGqPfo";
            let chainIndex = 1237;
            let coinName = "solana"
            let actual = `{"coin_name":"${coinName}","data":"{\"pubKey\":\"${publicKey}\",\"name\":\"Account 01\",\"walletType\":1,\"accountId\":\"123456789\",\"addresses\":[{\"address\":\"${addr}\",\"chainPubKey\":\"${publicKey}\",\"chainSign\":\"${sig}\",\"chainIndexList\":[${chainIndex}]}]}","func_name":"verify_web_data"}`;
            let expect = `{"coin_name":"solana","data":"{"pubKey":"fd5fd86d7d7b8355492b1517a96a2fbb17e1a374b80a21559bdfee0dfbaa0b32","name":"Account 01","walletType":1,"accountId":"123456789","addresses":[{"address":"J44uzihE3Ty2YBdMsLwCE3hV5uf2q2hRJQMnW2NGqPfo","chainPubKey":"fd5fd86d7d7b8355492b1517a96a2fbb17e1a374b80a21559bdfee0dfbaa0b32","chainSign":"10a3e37d8d1eb5aea9b3936c7f99fe6997d5f8b575dd3b200cd273e2a72e19072e2f2312e3cdbead467307dbafb5f7aac29bb445454b9b497d6c4e385ffe5205","chainIndexList":[1237]}]}","func_name":"verify_web_data"}`
            assert.strictEqual(actual, expect);
            return
        }
        if(false){
            //stack
            param.privateKey="33c4ad314d494632a36c27f9ac819e8d2986c0e26ad63052879f631a417c8adf"
            let publicKey = "040f7d0377754e1865740fb42460ac55fcc8a4d6aac611b697f88cfc2091f318d8a0385810e607f0704388628d7275bd16c09bcccb71dd2048e778a9ac13fbb41c"
            data = buildCommonSignMsg(publicKey, "123456789")
            param.message = data;
            param.signType = SignType.Secp256k1
            //87feb2cc194b8d41a9c6ff0dc0ddba952c7ba73936d3f0361d498341716c2b34426876ef21ad4f5f94482bafe72a418729737b9461303be9da2be849a4123f021b
            let sig = await wallet.signCommonMsg(param)
            let addr = "SP2XYBM8MD5T50WAMQ86E8HKR85BAEKBECNE1HHVY";
            let chainIndex = 5757;
            let coinName = "solana"
            let actual = `{"coin_name":"${coinName}","data":"{\"pubKey\":\"${publicKey}\",\"name\":\"Account 01\",\"walletType\":1,\"accountId\":\"123456789\",\"addresses\":[{\"address\":\"${addr}\",\"chainPubKey\":\"${publicKey}\",\"chainSign\":\"${sig}\",\"chainIndexList\":[${chainIndex}]}]}","func_name":"verify_web_data"}`;
            let expect = `{"coin_name":"solana","data":"{"pubKey":"040f7d0377754e1865740fb42460ac55fcc8a4d6aac611b697f88cfc2091f318d8a0385810e607f0704388628d7275bd16c09bcccb71dd2048e778a9ac13fbb41c","name":"Account 01","walletType":1,"accountId":"123456789","addresses":[{"address":"SP2XYBM8MD5T50WAMQ86E8HKR85BAEKBECNE1HHVY","chainPubKey":"040f7d0377754e1865740fb42460ac55fcc8a4d6aac611b697f88cfc2091f318d8a0385810e607f0704388628d7275bd16c09bcccb71dd2048e778a9ac13fbb41c","chainSign":"1b523031d0c4a2de1a88fb02015a0d1bd3c6ef6e6834f7a4ba72020b192f3a92291868a9838eccfacce84125ed97eec9255da9cf7137be02cb863fe6436dbdb5e3","chainIndexList":[5757]}]}","func_name":"verify_web_data"}`
            assert.strictEqual(actual, expect);
            return
        }
        if(false){
            //sui
            param.privateKey="31342f041c5b54358074b4579231c8a300be65e687dff020bc7779598b42897a"
            let publicKey = "vMXD8hZaXuMOg2h41CBf0QIyJaF2l30ahNakIunifS0=";
            data = buildCommonSignMsg(publicKey, "123456789")
            param.message = data;
            param.signType = SignType.ED25519
            let sig = await wallet.signCommonMsg(param)
            let addr = "1e7fa5fd46bdf8ec1291ca52084bdbeeabde6b3bab3a5d9e6cf83d78061de619";
            let chainIndex = 784;
            let coinName = "sui"
            let actual = `{"coin_name":"${coinName}","data":"{\"pubKey\":\"${publicKey}\",\"name\":\"Account 01\",\"walletType\":1,\"accountId\":\"123456789\",\"addresses\":[{\"address\":\"${addr}\",\"chainPubKey\":\"${publicKey}\",\"chainSign\":\"${sig}\",\"chainIndexList\":[${chainIndex}]}]}","func_name":"verify_web_data"}`;
            let expect = `{"coin_name":"sui","data":"{"pubKey":"vMXD8hZaXuMOg2h41CBf0QIyJaF2l30ahNakIunifS0=","name":"Account 01","walletType":1,"accountId":"123456789","addresses":[{"address":"1e7fa5fd46bdf8ec1291ca52084bdbeeabde6b3bab3a5d9e6cf83d78061de619","chainPubKey":"vMXD8hZaXuMOg2h41CBf0QIyJaF2l30ahNakIunifS0=","chainSign":"c08a2f98a1aa88a301b6cb96a52567daf5af440735c00e2c5c7d1c303edab15b6fcc364fcde9e875ab029909036c6b02030ee81b53c7625ecf8f236d38ca6f08","chainIndexList":[784]}]}","func_name":"verify_web_data"}`
            assert.strictEqual(actual, expect);
            return
        }
        if(false){
            //ton
            param.privateKey="fc81e6f42150458f53d8c42551a8ab91978a55d0e22b1fd890b85139086b93f8"
            let publicKey = "484bbda1d1ab3e89b83b423685a9d4cbe7a28b8b96bbbee51d0553b47e4db42f";
            data = buildCommonSignMsg(publicKey, "123456789")
            param.message = data;
            param.signType = SignType.ED25519
            let sig = await wallet.signCommonMsg(param)
            let addr = "UQC6QJ31Bv_hjmsoaUjRmpZYqj9NXbBbvufCNycnc0gjReqR";
            let chainIndex = 607;
            let coinName = "ton"
            let actual = `{"coin_name":"${coinName}","data":"{\"pubKey\":\"${publicKey}\",\"name\":\"Account 01\",\"walletType\":1,\"accountId\":\"123456789\",\"addresses\":[{\"address\":\"${addr}\",\"chainPubKey\":\"${publicKey}\",\"chainSign\":\"${sig}\",\"chainIndexList\":[${chainIndex}]}]}","func_name":"verify_web_data"}`;
            console.log(actual)
            let expect = `{"coin_name":"ton","data":"{"pubKey":"484bbda1d1ab3e89b83b423685a9d4cbe7a28b8b96bbbee51d0553b47e4db42f","name":"Account 01","walletType":1,"accountId":"123456789","addresses":[{"address":"UQC6QJ31Bv_hjmsoaUjRmpZYqj9NXbBbvufCNycnc0gjReqR","chainPubKey":"484bbda1d1ab3e89b83b423685a9d4cbe7a28b8b96bbbee51d0553b47e4db42f","chainSign":"cc40d1fe95d67c7cd7e994a49fe8576f6958767084247cdc0b47fb8d62feef3578de28ce230f55eaec6396dc5d3b6720c0bbd53579f532b645eeb15055e30801","chainIndexList":[607]}]}","func_name":"verify_web_data"}`
            assert.strictEqual(actual, expect);
            return
        }

        if(false){
            //tron
            param.privateKey="bdd80f4421968142b3a4a6c27a1d84a3623384d085a04a895f109fd8d49cef0a"
            let publicKey = "04fde2eacd2fcbdeeeba4cd53af8e3aea60a5bddba2c129de4b325eede06ca7cea2d4a60079ccddc7e110c2cdd665fa302789793d9fc40054812e210cd5bab5367";
            data = buildCommonSignMsg(publicKey, "123456789")
            param.message = data;
            param.signType = SignType.Secp256k1
            let sig = await wallet.signCommonMsg(param)
            let addr = "TJUYRk7odiK3fvPRCGNu4cWGg7tCGHf7Jm";
            let chainIndex = 195;
            let coinName = "tron"
            let actual = `{"coin_name":"${coinName}","data":"{\"pubKey\":\"${publicKey}\",\"name\":\"Account 01\",\"walletType\":1,\"accountId\":\"123456789\",\"addresses\":[{\"address\":\"${addr}\",\"chainPubKey\":\"${publicKey}\",\"chainSign\":\"${sig}\",\"chainIndexList\":[${chainIndex}]}]}","func_name":"verify_web_data"}`;
            let expect = `{"coin_name":"tron","data":"{"pubKey":"04fde2eacd2fcbdeeeba4cd53af8e3aea60a5bddba2c129de4b325eede06ca7cea2d4a60079ccddc7e110c2cdd665fa302789793d9fc40054812e210cd5bab5367","name":"Account 01","walletType":1,"accountId":"123456789","addresses":[{"address":"TJUYRk7odiK3fvPRCGNu4cWGg7tCGHf7Jm","chainPubKey":"04fde2eacd2fcbdeeeba4cd53af8e3aea60a5bddba2c129de4b325eede06ca7cea2d4a60079ccddc7e110c2cdd665fa302789793d9fc40054812e210cd5bab5367","chainSign":"1b5662ca72b121ddd4abd1f39b2e22fd86b0a3e274761abbf182e955f073efd47b1139781a288af743683535258f4bd6ab3ea2ffe43404cb8c948e5bad23bbbdd7","chainIndexList":[195]}]}","func_name":"verify_web_data"}`
            assert.strictEqual(actual, expect);
            return
        }

        if(true){
            //zkspace
            param.privateKey="bdd80f4421968142b3a4a6c27a1d84a3623384d085a04a895f109fd8d49cef0a"
            let publicKey = "04fde2eacd2fcbdeeeba4cd53af8e3aea60a5bddba2c129de4b325eede06ca7cea2d4a60079ccddc7e110c2cdd665fa302789793d9fc40054812e210cd5bab5367";
            data = buildCommonSignMsg(publicKey, "123456789")
            param.message = data;
            param.signType = SignType.Secp256k1
            let sig = await wallet.signCommonMsg(param)
            let addr = "TJUYRk7odiK3fvPRCGNu4cWGg7tCGHf7Jm";
            let chainIndex = 99999999;
            let coinName = "tron"
            let actual = `{"coin_name":"${coinName}","data":"{\"pubKey\":\"${publicKey}\",\"name\":\"Account 01\",\"walletType\":1,\"accountId\":\"123456789\",\"addresses\":[{\"address\":\"${addr}\",\"chainPubKey\":\"${publicKey}\",\"chainSign\":\"${sig}\",\"chainIndexList\":[${chainIndex}]}]}","func_name":"verify_web_data"}`;
            let expect = `{"coin_name":"tron","data":"{"pubKey":"04fde2eacd2fcbdeeeba4cd53af8e3aea60a5bddba2c129de4b325eede06ca7cea2d4a60079ccddc7e110c2cdd665fa302789793d9fc40054812e210cd5bab5367","name":"Account 01","walletType":1,"accountId":"123456789","addresses":[{"address":"TJUYRk7odiK3fvPRCGNu4cWGg7tCGHf7Jm","chainPubKey":"04fde2eacd2fcbdeeeba4cd53af8e3aea60a5bddba2c129de4b325eede06ca7cea2d4a60079ccddc7e110c2cdd665fa302789793d9fc40054812e210cd5bab5367","chainSign":"1b5662ca72b121ddd4abd1f39b2e22fd86b0a3e274761abbf182e955f073efd47b1139781a288af743683535258f4bd6ab3ea2ffe43404cb8c948e5bad23bbbdd7","chainIndexList":[99999999]}]}","func_name":"verify_web_data"}`
            assert.strictEqual(actual, expect);
            return
        }
    })
})