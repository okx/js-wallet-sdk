import { TonWallet, VenomWallet } from "../src";

const tonWallet = new TonWallet();
const venomWallet = new VenomWallet();

describe("toncoin venom", () => {
    test("derive seed", async () => {
        const seed = await tonWallet.getDerivedPrivateKey({
            mnemonic: "",
            hdPath: "m/44'/607'/0'/0'/0'",
        });
        console.log(seed);
    });

    test("ton getNewAddress", async () => {
        const seed = "fc81e6f42150458f53d8c42551a8ab91978a55d0e22b1fd890b85139086b93f8";
        const result = await tonWallet.getNewAddress({ privateKey: seed });
        expect(result.address).toBe("EQA3_JIJKDC0qauDUEQe2KjQj1iLwQRtrEREzmfDxbCKw9Kr");
    });

    test("ton validateAddress", async () => {
        const result = await tonWallet.validAddress({ address: "EQA3_JIJKDC0qauDUEQe2KjQj1iLwQRtrEREzmfDxbCKw9Kr" });
        expect(result.isValid).toBe(true);
    });

    test("ton signTransaction", async () => {
        const param = {
            privateKey: "fc81e6f42150458f53d8c42551a8ab91978a55d0e22b1fd890b85139086b93f8",
            data: {
                to: "EQA3_JIJKDC0qauDUEQe2KjQj1iLwQRtrEREzmfDxbCKw9Kr",
                amount: "10000000",
                seqno: 2,
                toIsInit: true,
                memo: "",
            },
        };
        const tx = await tonWallet.signTransaction(param);
        console.log(tx);
    });

    test("venom getNewAddress", async () => {
        const seed = "fc81e6f42150458f53d8c42551a8ab91978a55d0e22b1fd890b85139086b93f8";
        const result = await venomWallet.getNewAddress({ privateKey: seed });
        expect(result.address).toBe("0:6bef7d76e46fd1f308f0bf0b59f1ca6318aa6d950ea00aecc7d162218acaaa36");
    });

    test("venom validateAddress", async () => {
        const result = await venomWallet.validAddress({ address: "0:6bef7d76e46fd1f308f0bf0b59f1ca6318aa6d950ea00aecc7d162218acaaa36" });
        expect(result.isValid).toBe(true);
    });

    test("venom signTransaction", async () => {
        const param = {
            privateKey: "fc81e6f42150458f53d8c42551a8ab91978a55d0e22b1fd890b85139086b93f8",
            data: {
                to: "0:b547ad1de927f0dcf95372cd766302e2c9351331d7673454017cc52c149727c0",
                amount: "100000000",
                seqno: 4,
                toIsInit: true,
                memo: "",
                globalId: 1000,
            },
        };
        const tx = await venomWallet.signTransaction(param);
        console.log(tx);
    });
});
