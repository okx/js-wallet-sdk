import * as sui from '../src';
import {base, signUtil} from '@okxweb3/crypto-lib';

declare const TextEncoder: any;

describe("cryptography", () => {
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
        console.log('kp.getPublicKey().toSuiAddress()',kp.getPublicKey().toSuiAddress())
        expect(kp.getPublicKey().toSuiAddress()).toEqual(
            '0x1f1bfbf2d571d4f15bf7803f81e43f10bcf78ef9473ba69ff3e4664477b54c40'
        );
        // 0x2::coin::Coin<0x2::sui::SUI>
        const signer = new sui.RawSigner(kp);
        const sign = await signer.signMessage({message:Buffer.from('Hello world', "utf-8")})
        console.log('sign', sign)
        expect(sign).toEqual('ANN54RqE1vVDFQ/6hRFX+XcfwUzA2+XgQfRAAmYZbFQetk/3BMsim5FSTw3pD6p0K81n2MD/ZtngplbQBSrNqA0yrCj8SB1j5ijH8p/QbdjLv9bKPXc0KyHCsFTFZsMhNw==')
    })
})