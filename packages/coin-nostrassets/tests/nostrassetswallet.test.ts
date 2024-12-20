import {NostrAssetsWallet, nsecFromPrvKey, CryptTextParams, verifySignature, nipOpType, decodeBytes} from "../src";
import {bip39} from "@okxweb3/crypto-lib";
import {base58} from "@scure/base";
import {test} from "@jest/globals";
import assert from "assert";

const wallet = new NostrAssetsWallet();
const prv = 'nsec1hvwfx5ytjck8a7c2xsyys5ut930hhfkyfe2l2guf4gfj5t7n2gdqxvh70y'

describe("nostr", () => {

    test("signCommonMsg", async () => {
        let wallet = new NostrAssetsWallet();
        let sig = await wallet.signCommonMsg({privateKey:"nsec1hvwfx5ytjck8a7c2xsyys5ut930hhfkyfe2l2guf4gfj5t7n2gdqxvh70y", message:{walletId:"123456789"}});
        assert.strictEqual(sig,"1c4fe0c27c944b99630468c06fb9d37435c6f14e1537b1c8a725ff11c3fb35bfb6286ec3297553f45791d63fa828a957f752d357c8d58122862d5ba123dd5ee3cf")
        sig = await wallet.signCommonMsg({privateKey:"nsec1hvwfx5ytjck8a7c2xsyys5ut930hhfkyfe2l2guf4gfj5t7n2gdqxvh70y", message:{text:"123456789"}});
        assert.strictEqual(sig,"1c543e650db66566470f2e1588a4a7e00c1c0de445c3cf900d380f02747a8bb8d32c6f5265b332e0a825083c0abee38d3e0a0515fafd191c149905f4a92750ee98")
    });

    test("random", async () => {
        let prv = await wallet.getRandomPrivateKey();
        console.log(prv)
        expect(prv.startsWith('nsec')).toBe(true)
    })

    test("getNewAddress common2", async () => {
        //sei137augvuewy625ns8a2age4sztl09hs7pk0ulte
        const privateKey = "nsec1hvwfx5ytjck8a7c2xsyys5ut930hhfkyfe2l2guf4gfj5t7n2gdqxvh70y"
        const wallet = new NostrAssetsWallet();
        let expectedAddress = "npub1znxtu8222hlzxc59w6nlq33h7erl66ux6d30nql5a0tmjh2809hstw0d22";
        expect((await wallet.getNewAddress({privateKey:privateKey})).address).toEqual(expectedAddress);
        expect((await wallet.validPrivateKey({privateKey:privateKey})).isValid).toEqual(true);
    });

    test("generate", async () => {
        let memo = await bip39.generateMnemonic();
        console.log("generate mnemonic:", memo);

        const hdPath = await wallet.getDerivedPath({index: 0});
        let derivePrivateKey = await wallet.getDerivedPrivateKey({mnemonic: memo, hdPath: hdPath});
        console.log("generate derived private key:", derivePrivateKey, ",derived path: ", hdPath);

        let newAddress = await wallet.getNewAddress({privateKey: derivePrivateKey});
        console.log("generate new address:", newAddress.address, "newAddress.publicKey", newAddress.publicKey);
    })

    test("validPrivateKey", async () => {
        const wallet = new NostrAssetsWallet();
        const privateKey = await wallet.getRandomPrivateKey();
        const res = await wallet.validPrivateKey({privateKey:privateKey});
        expect(res.isValid).toEqual(true);
    });


    test("address", async () => {
        let r = await wallet.getNewAddress({privateKey: 'nsec1hvwfx5ytjck8a7c2xsyys5ut930hhfkyfe2l2guf4gfj5t7n2gdqxvh70y'})
        expect(r.address).toEqual('npub1znxtu8222hlzxc59w6nlq33h7erl66ux6d30nql5a0tmjh2809hstw0d22');
        expect(r.publicKey).toEqual('14ccbe1d4a55fe23628576a7f04637f647fd6b86d362f983f4ebd7b95d47796f');
        const nsec = nsecFromPrvKey(decodeBytes('nsec', prv));
        expect(nsec).toBe("nsec1hvwfx5ytjck8a7c2xsyys5ut930hhfkyfe2l2guf4gfj5t7n2gdqxvh70y");

        let v = await wallet.validAddress({address: r.address})
        console.log(v)
        expect(v.isValid).toBe(true)
        let v2 = await wallet.validAddress({address: r.address + '2'})
        console.log(v2)
        expect(v2.isValid).toBe(false)
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
        let rr = JSON.parse(JSON.stringify(r))
        console.log("event.pubkey", rr['pubkey'])
        expect(rr['pubkey']).toEqual('14ccbe1d4a55fe23628576a7f04637f647fd6b86d362f983f4ebd7b95d47796f')
        expect(rr['id']).toEqual('385eb020a83cb7e547659922b6c092a55e88c5127d9448370d1e55221aaeb5dd')
        expect(verifySignature(rr)).toBe(true)
    });


    test("encrypt", async () => {
        try {
            let text = 'hello'
            let privkey = nsecFromPrvKey('0x425824242e3038e026f7cbeb6fe289cb6ffcfad1fa955c318c116aa1f2f32bfc')
            const encrypted = await wallet.signTransaction({
                privateKey: privkey,
                data: new CryptTextParams(nipOpType.NIP04_Encrypt, '0x8a0523d045d09c30765029af9307d570cb0d969e4b9400c08887c23250626eea', text)
            });
            console.log('encrypted', encrypted)
            const decrypted = await wallet.signTransaction({
                privateKey: privkey,
                data: new CryptTextParams(nipOpType.NIP04_Decrypt, '8a0523d045d09c30765029af9307d570cb0d969e4b9400c08887c23250626eea', encrypted)
            });
            console.log('decrypted', decrypted)
            expect(decrypted).toBe(text);
        } catch (e) {
            let err = e as Error
            if (err.message === 'crypto is not defined') {
                console.log(err.message)
            }
        }
    });

});
