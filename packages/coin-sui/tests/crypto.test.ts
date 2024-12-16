import * as sui from '../src';
import {base, signUtil} from '@okxweb3/crypto-lib';
import {encodeSuiPrivateKey, SuiWallet, tryDecodeSuiPrivateKey} from "../src";
import {test} from "@jest/globals";
import assert from "assert";

declare const TextEncoder: any;
const suiWallet = new sui.SuiWallet()

describe("cryptography", () => {

    test("signCommonMsg", async () => {
        let wallet = new SuiWallet();
        let sig = await wallet.signCommonMsg({privateKey:"31342f041c5b54358074b4579231c8a300be65e687dff020bc7779598b42897a", message:{walletId:"123456789"}});
        assert.strictEqual(sig,"c08a2f98a1aa88a301b6cb96a52567daf5af440735c00e2c5c7d1c303edab15b6fcc364fcde9e875ab029909036c6b02030ee81b53c7625ecf8f236d38ca6f08")
    });

    test("tryDecodeSuiPrivateKey", async () => {
        const k = '0x31342f041c5b54358074b4579231c8a300be65e687dff020bc7779598b42897a'
        const r1 = tryDecodeSuiPrivateKey(k)
        expect(r1).toEqual(k)
        const b = encodeSuiPrivateKey(k)
        const r2 = tryDecodeSuiPrivateKey(b)
        expect(r2).toEqual(k)
        let addr1 = await suiWallet.getNewAddress({privateKey: k})
        let addr2 = await suiWallet.getNewAddress({privateKey: b})
        expect(addr1.address).toEqual(addr2.address)
    })

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
    test("edge test", async () => {
        const wallet = new SuiWallet();
        let j = 1;
        for (let i = 0; i < ps.length; i++) {
            try {
                await wallet.getNewAddress({privateKey: ps[i]});
            } catch (e) {
                j = j + 1
            }
        }
        expect(j).toEqual(ps.length+1);
    });

    test("validPrivateKey", async () => {
        const wallet = new SuiWallet();
        const privateKey = await wallet.getRandomPrivateKey();
        const res = await wallet.validPrivateKey({privateKey:privateKey});
        expect(res.isValid).toEqual(true);
    });

    test("decoder or encoder SuiPrivateKey exception", async () => {
        let k = 'suiprivkey1qqcngtcyr3d4gdvqwj690y33ez3sp0n9u6ralupqh3mhjkvtg2yh5ky0e6gbbbb'
        expect(() => encodeSuiPrivateKey(k)).toThrowError("Unknown letter: \"b\"")
        k = '0x31342f041c5b54358074b4579231c8a300be65e687dff020bc7779598b42897axx'
        expect(() => encodeSuiPrivateKey(k)).toThrowError("invalid key")
        k = '0x31342f041c5b54358074b4579231c8a300be65e687dff020bc7779598b42897affee'
        expect(() => encodeSuiPrivateKey(k)).toThrowError("invalid key")
        k = 'suiprivkey1qqcngtcyr3d4gdvqwj690y33ez3sp0n9u6ralupqh3mhjkvtg2yh4llwnhvjm3'
        expect(() => encodeSuiPrivateKey(k)).toThrowError("invalid key")
        k = '0X31342F041C5B54358074B4579231C8A300BE65E687DFF020BC7779598B42897A'
        expect(tryDecodeSuiPrivateKey(k)).toEqual(k)
        k = '0X31342F041C5B54358074B4579231C8A300BE65E687DFF020BC7779598B42897A31342F041C5B54358074B4579231C8A300BE65E687DFF020BC7779598B42897A'
        expect(() => tryDecodeSuiPrivateKey(k)).toThrowError("invalid key")
        k = '0x31342f041c5b54358074b4579231c8a300be65e687dff020bc7779598b42897a31342f041c5b5435807'
        expect(() => tryDecodeSuiPrivateKey(k)).toThrowError("invalid key")
        k = 'suiprivkey1qqcngtcyr3d4gdvqwj690y33ez3sp0n9u6ralupqh3mhjkvtg2yh5ky0e6g22222'
        expect(() => tryDecodeSuiPrivateKey(k)).toThrowError("Invalid checksum in")
        k = ''
        expect(() => tryDecodeSuiPrivateKey(k)).toThrowError("invalid private key prefix")
        k = ''
        expect(() => encodeSuiPrivateKey(k)).toThrowError("Invalid bytes length")
    })

    test("signMessage", async () => {
        const message = base.toUtf8('ok')
        let sign1 = await suiWallet.signMessage({
            privateKey: '0x31342f041c5b54358074b4579231c8a300be65e687dff020bc7779598b42897a',
            data: message
        })
        let sign2 = await suiWallet.signMessage({
            privateKey: 'suiprivkey1qqcngtcyr3d4gdvqwj690y33ez3sp0n9u6ralupqh3mhjkvtg2yh5ky0e6g',
            data: message
        })
        console.log(sign2)
        expect(sign1).toEqual(sign2)
        expect('AGkeJ/OA1foA5BUWpJwa3dxopk/34qC0b3MwVAm38nngneS9mtHs8wSTzCN0ZFukHJ5V8VkGEeEIHuKGIi8DnAi8xcPyFlpe4w6DaHjUIF/RAjIloXaXfRqE1qQi6eJ9LQ==').toEqual(sign2)
    })

    test("getDerivedPrivateKey", async () => {

        let mnemonic = "tumble hood curious hidden harvest palace elevator crisp manual anxiety recipe occur";
        let param = {
            mnemonic: mnemonic,
            hdPath: await suiWallet.getDerivedPath({index: 0})
        };
        let privateKey = await suiWallet.getDerivedPrivateKey(param);
        console.info(privateKey);
        expect(privateKey).toEqual('suiprivkey1qrjadfrsrmcrz2gt8qm7lv37h5jm6pre3was8aajvx4dvy6faytw7ff90jc')
        let addr = await suiWallet.getNewAddress({privateKey: privateKey})
        console.info(addr);
        expect(addr.address).toEqual('0x215d3a67d951ebd5b453b440497917b5fac2890fc7f18358322d372e2f13045d')
    });

    test("ed25519", async () => {
        const b64Key = "vdgPRCGWgUKzpKbCeh2Eo2IzhNCFoEqJXxCf2NSc7wo="
        const kp = sui.Ed25519Keypair.fromSeed(base.fromBase64(b64Key));
        expect(kp.getPublicKey().toBase64()).toEqual(
            'Mqwo/EgdY+Yox/Kf0G3Yy7/Wyj13NCshwrBUxWbDITc='
        );
        const address3 = sui.getAddressFromPublic("aFstb5h4TddjJJryHJL1iMob6AxAqYxVv3yRt05aweI=")
        expect(address3).toEqual(
            '0x936accb491f0facaac668baaedcf4d0cfc6da1120b66f77fa6a43af718669973'
        );

        const signData = new TextEncoder().encode('hello world')
        const signature = kp.signData(signData);
        const isValid = signUtil.ed25519.verify(signData, signature, kp.getPublicKey().toBytes());
        expect(isValid).toBeTruthy();

        const randomBytes = base.randomBytes(32);
        const kp2 = sui.Ed25519Keypair.fromSeed(randomBytes);
        console.info(base.toBase64(randomBytes))
        console.info(kp2.getPublicKey().toSuiAddress())
    })

    test("sign", async () => {
        const b64Key = "vdgPRCGWgUKzpKbCeh2Eo2IzhNCFoEqJXxCf2NSc7wo="
        const kp = sui.Ed25519Keypair.fromSeed(base.fromBase64(b64Key));
        expect(kp.getPublicKey().toSuiAddress()).toEqual(
            '0x1f1bfbf2d571d4f15bf7803f81e43f10bcf78ef9473ba69ff3e4664477b54c40'
        );

        // 0x2::coin::Coin<0x2::sui::SUI>
        const signer = new sui.RawSigner(kp);
        const signedTransaction = await signer.signTransactionBlock({transactionBlock: base.fromBase64("AAACAAighgEAAAAAAAAgIV06Z9lR69W0U7RASXkXtfrCiQ/H8YNYMi03Li8TBF0CAgABAQAAAQECAAABAQAR4MaBQEZz3bFskpqFKzUrk4anRFX5Y41MafTFfX9fGgHN4+fOaLYvXARGuBlG7rRD9iIoqxIQYa/vv6w/wjG/7gQAAAAAAAAAICG5uOsw6cY6in+2K/hch8ArgZKhBGB2iSfCszfYYDC1EeDGgUBGc92xbJKahSs1K5OGp0RV+WONTGn0xX1/XxoBAAAAAAAAAG4AAAAAAAAAAWQAAAAAAAAA")})
        console.log('signedTransaction', signedTransaction)
        expect(signedTransaction.signature).toEqual('APx82P4ipiA95G3ee8QIb1qU49y8ae2dhwXceHgBYb6XTDiw8hhHPXjF7gg/XTpvpRxivQEczl5oqL8Bmzdekg4yrCj8SB1j5ijH8p/QbdjLv9bKPXc0KyHCsFTFZsMhNw==')
        expect(signedTransaction.hash).toEqual('2tcKwnWBHb2LTK32p1HWHdb5WYPvjC3K9TZFFUhtBfBg')
    })

    test("signmsg", async () => {
        const b64Key = "vdgPRCGWgUKzpKbCeh2Eo2IzhNCFoEqJXxCf2NSc7wo="
        const kp = sui.Ed25519Keypair.fromSeed(base.fromBase64(b64Key))
        console.log('kp.getPublicKey().toSuiAddress()', kp.getPublicKey().toSuiAddress())
        expect(kp.getPublicKey().toSuiAddress()).toEqual(
            '0x1f1bfbf2d571d4f15bf7803f81e43f10bcf78ef9473ba69ff3e4664477b54c40'
        );
        // 0x2::coin::Coin<0x2::sui::SUI>
        const signer = new sui.RawSigner(kp);
        const sign = await signer.signMessage({message: Buffer.from('ok', "utf-8")})
        console.log('sign', sign)
        expect("AKjEhbXaV0LysntwUXPm4AeB+0ncPg+4kf4y0qXpHCQi0ppkdSMFpS7tDWMF6TafOeixO0utkLAqVyHcfJoqSg0yrCj8SB1j5ijH8p/QbdjLv9bKPXc0KyHCsFTFZsMhNw==").toEqual(sign)
    })
})