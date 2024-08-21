import {
    addressFromPubKey,
    checkPrivateKey,
    getDerivedPrivateKey,
    getNewAddress,
    pubKeyFromPrivateKey
} from "../src/account";
import assert from "assert";
import {AdaWallet} from "../src";

// todo fix for jest
describe("cardano", () => {
    test("derive key", async () => {
        let mnemonic = "bean mountain minute enemy state always weekend accuse flag wait island tortoise";
        const hdPath = "m/1852'/1815'/0'/0/0"
        const privateKey = await getDerivedPrivateKey(mnemonic, hdPath)
        expect(privateKey).toEqual('30db52f355dc57e92944cbc93e2d30c9352a096fa2bbe92f1db377d3fdc2714aa3d22e03781d5a8ffef084aa608b486454b34c68e6e402d4ad15462ee1df5b8860e14a0177329777e9eb572aa8c64c6e760a1239fd85d69ad317d57b02c3714aeb6e22ea54b3364c8aaa0dd8ee5f9cea06fa6ce22c3827b740827dd3d01fe8f3')
    });

    test("addressFromPubKey", async () => {
        const privateKey = "30db52f355dc57e92944cbc93e2d30c9352a096fa2bbe92f1db377d3fdc2714aa3d22e03781d5a8ffef084aa608b486454b34c68e6e402d4ad15462ee1df5b8860e14a0177329777e9eb572aa8c64c6e760a1239fd85d69ad317d57b02c3714aeb6e22ea54b3364c8aaa0dd8ee5f9cea06fa6ce22c3827b740827dd3d01fe8f3"
        const expectedPublicKey = "f78d9bc8ca867c04f75fd86f2457c1ba35ce6b25e7cbc90356eea4b1503e2f537d3d86598bc62e0481f803603bc7f33cbddb1f185417e9386fce43d871c270b0";

        let publicKey = await pubKeyFromPrivateKey(privateKey);
        expect(await pubKeyFromPrivateKey(privateKey)).toEqual(expectedPublicKey);
        expect(await pubKeyFromPrivateKey('0x'+privateKey)).toEqual(expectedPublicKey);
        expect(await pubKeyFromPrivateKey('0X'+privateKey)).toEqual(expectedPublicKey);
        expect(await pubKeyFromPrivateKey('0X'+privateKey.toUpperCase())).toEqual(expectedPublicKey);

        const expectedAddress = "addr1q95y9uu3ekfwmlu3mthnjeuptu95th8m0qzqw2kexej6xgpttfhlqgwy5vavd7ggzneerhd80456j736e085zcys9y9q5frsx7";
        expect(await addressFromPubKey(publicKey)).toEqual(expectedAddress)
        expect(await addressFromPubKey('0x'+publicKey)).toEqual(expectedAddress)
        expect(await addressFromPubKey('0X'+publicKey)).toEqual(expectedAddress)
        expect(await addressFromPubKey('0X'+publicKey.toUpperCase())).toEqual(expectedAddress)
    });

    test("transaction", async() => {
        // const privateKey = "000421e2e06fc30f27211a21d17d9c4af029f7784b07a9cea0c39f87ba08a85110a7fed7099a047237a44746dfa530318aeacb4ccb9d7e25b130445443d0ecd1"
        // const data : TxData = {
        //     inputs: [
        //         {
        //             txId: "7f6a09b3eb7ea3942b788c7aa086a43124021136f9ea4afe9ac705bc28e0cf17",
        //             index: 2,
        //             amount: "1150770",
        //             address: "",
        //             privateKey: "000421e2e06fc30f27211a21d17d9c4af029f7784b07a9cea0c39f87ba08a85110a7fed7099a047237a44746dfa530318aeacb4ccb9d7e25b130445443d0ecd1",
        //             multiAsset: [
        //                 {
        //                     policyId: "29d222ce763455e3d7a09a665ce554f00ac89d2e99a1a83d267170c6",
        //                     assets: [
        //                         {
        //                             assetName: "4d494e",
        //                             amount: "11614448"
        //                         }
        //                     ]
        //
        //                 }
        //             ]
        //         },
        //         {
        //             txId: "f2b78093ca7be37d24a8f6462991745552f80f4610d1777c456a7ce24f2b3e02",
        //             index: 1,
        //             amount: "2000000",
        //             address: "",
        //             privateKey: "000421e2e06fc30f27211a21d17d9c4af029f7784b07a9cea0c39f87ba08a85110a7fed7099a047237a44746dfa530318aeacb4ccb9d7e25b130445443d0ecd1",
        //             multiAsset: [
        //                 {
        //                     policyId: "29d222ce763455e3d7a09a665ce554f00ac89d2e99a1a83d267170c6",
        //                     assets: [
        //                         {
        //                             assetName: "4d494e",
        //                             amount: "1741609"
        //                         }
        //                     ]
        //
        //                 }
        //             ]
        //         }
        //     ],
        //     address: "addr1qyxdgpwcqsrfsfv7gs3el47ym205hxaxnnpvs550czrjr8gr7z40zns2zm4kdd5jgxhawpstcgnyt4zdwzn4e9g6qmksvhsufu",
        //     amount: "1150770",
        //     multiAsset:  [
        //         {
        //             policyId: "29d222ce763455e3d7a09a665ce554f00ac89d2e99a1a83d267170c6",
        //             assets: [
        //                 {
        //                     assetName: "4d494e",
        //                     amount: "13356057"
        //                 }
        //             ]
        //
        //         }
        //     ],
        //     changeAddress: "addr1qyxdgpwcqsrfsfv7gs3el47ym205hxaxnnpvs550czrjr8gr7z40zns2zm4kdd5jgxhawpstcgnyt4zdwzn4e9g6qmksvhsufu",
        //     ttl: "999999999"
        // }
        //
        // let wallet = new AdaWallet();
        // const tx = await wallet.signTransaction({privateKey, data})
        // console.log(tx)
    })
});
