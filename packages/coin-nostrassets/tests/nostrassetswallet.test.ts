import {NoStrAssetsWallet, addressFromPrvKey, CryptTextParams, verifySignature, nipOpType} from "../src";
import {SignTxParams} from "@okxweb3/coin-base";

const wallet = new NoStrAssetsWallet();
const prv = 'bb1c93508b962c7efb0a340848538b2c5f7ba6c44e55f52389aa132a2fd3521a'
describe("nostr", () => {
    test("address", async () => {
        let r = await wallet.getNewAddress({privateKey: prv})
        expect(r.address).toEqual('nsec1hvwfx5ytjck8a7c2xsyys5ut930hhfkyfe2l2guf4gfj5t7n2gdqxvh70y');
        expect(r.publicKey).toEqual('npub1znxtu8222hlzxc59w6nlq33h7erl66ux6d30nql5a0tmjh2809hstw0d22');
        const address = addressFromPrvKey(prv);
        expect(address).toBe("nsec1hvwfx5ytjck8a7c2xsyys5ut930hhfkyfe2l2guf4gfj5t7n2gdqxvh70y");
    });

    // event.id 385eb020a83cb7e547659922b6c092a55e88c5127d9448370d1e55221aaeb5dd
    // event.sig 86aceec7506ea3619826b97902f8d3dc89c137a3c8373c6e22b1d924134eaebcf7323467b0f9ebbd97aeeb1aaa973d602d8aa47e08cbc2b6d4a05919e6632240
    test("sign", async () => {
        let event = {
            kind: 1,
            created_at: Math.floor(1000),//unix
            tags: [],
            content: 'hello',
        }
        let r = await wallet.signTransaction({
            privateKey: prv,
            data: event
        })
        expect(verifySignature(r)).toBe(true)
    });

    //Received: "{\"kind\":1,\"created_at\":1000,\"tags\":[],\"content\":\"hello\",\"pubkey\":\"14ccbe1d4a55fe23628576a7f04637f647fd6b86d362f983f4ebd7b95d47796f\",\"id\":\"385eb020a83cb7e547659922b6c092a55e88c5127d9448370d1e55221aaeb5dd\",\"sig\":\"148d8ad0496af9049443a35c8a3034ac386bd30c1252311ce87a5b942d8322ab9468ba5e7a56a8e6cf82718522d7b86a4aa905100ef5423bd46de93a16032024\"}"

    test("encrypt", async () => {
        let text = 'hello'
        let privkey = '425824242e3038e026f7cbeb6fe289cb6ffcfad1fa955c318c116aa1f2f32bfc'
        const encrypted = await wallet.signTransaction({
            privateKey: privkey,
            data: new CryptTextParams(nipOpType.NIP04_Encrypt, '8a0523d045d09c30765029af9307d570cb0d969e4b9400c08887c23250626eea', text)
        });
        console.log('encrypted', encrypted)
        const decrypted = await wallet.signTransaction({
            privateKey: privkey,
            data: new CryptTextParams(nipOpType.NIP04_Decrypt, '8a0523d045d09c30765029af9307d570cb0d969e4b9400c08887c23250626eea', encrypted)
        });
        console.log('decrypted', decrypted)
        expect(decrypted).toBe(text);
    });

});
