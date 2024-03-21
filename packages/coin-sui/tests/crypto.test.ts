import * as sui from '../src';
import {base, signUtil} from '@okxweb3/crypto-lib';
import {encodeSuiPrivateKey, tryDecodeSuiPrivateKey} from "../src";

declare const TextEncoder: any;

describe("cryptography", () => {
    test("tryDecodeSuiPrivateKey", async () => {
        const k = '0x31342f041c5b54358074b4579231c8a300be65e687dff020bc7779598b42897a'
        const r1 = tryDecodeSuiPrivateKey(k)
        expect(r1).toEqual(k)
        const b = encodeSuiPrivateKey(k)
        const r2 = tryDecodeSuiPrivateKey(b)
        expect(r2).toEqual(k)
        let wallet = new sui.SuiWallet()
        let addr1 = await wallet.getNewAddress({privateKey: k})
        let addr2 = await wallet.getNewAddress({privateKey: b})
        expect(addr1.address).toEqual(addr2.address)
    })

    test("signMessage", async () => {
        const message = base.toUtf8('ok')
        let wallet = new sui.SuiWallet()
        let sign1 = await wallet.signMessage({
            privateKey: '0x31342f041c5b54358074b4579231c8a300be65e687dff020bc7779598b42897a',
            data: message
        })
        let sign2 = await wallet.signMessage({
            privateKey: 'suiprivkey1qqcngtcyr3d4gdvqwj690y33ez3sp0n9u6ralupqh3mhjkvtg2yh5ky0e6g',
            data: message
        })
        console.log(sign2)
        expect(sign1).toEqual(sign2)
    })

    test("getDerivedPrivateKey", async () => {
        let wallet = new sui.SuiWallet()

        let mnemonic = "swift choose erupt agree fragile spider glare spawn suit they solid bus";
        let param = {
            mnemonic: mnemonic,
            hdPath: await wallet.getDerivedPath({index: 0})
        };
        let privateKey = await wallet.getDerivedPrivateKey(param);
        console.info(privateKey);
        expect(privateKey).toEqual("suiprivkey1qqu6kvcrcywahj0rq25h96u8qxx3642rs6huffgmz5juu88wd22ps4m90rl")
        let addr = await wallet.getNewAddress({privateKey: privateKey})
        console.info(addr);
        expect(addr.address).toEqual("0x22d681f6ea985220d0cc19b5a59b94368cc87341cd2f01e379ec4c0a7a6851e7")
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
        const sign = await signer.signMessage({message: Buffer.from('Hello world', "utf-8")})
        console.log('sign', sign)
        expect(sign).toEqual('ANN54RqE1vVDFQ/6hRFX+XcfwUzA2+XgQfRAAmYZbFQetk/3BMsim5FSTw3pD6p0K81n2MD/ZtngplbQBSrNqA0yrCj8SB1j5ijH8p/QbdjLv9bKPXc0KyHCsFTFZsMhNw==')
    })
})