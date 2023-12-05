import { KaspaWallet } from "../src";

const wallet = new KaspaWallet();

describe("kaspa", () => {
    test("derive privateKey", async () => {
        const privateKey = await wallet.getDerivedPrivateKey({
            mnemonic: "reopen vivid parent want raw main filter rotate earth true fossil dream",
            hdPath: "m/44'/111111'/0'/0/0",
        });
        expect(privateKey).toBe("0xd636a23d4f49fe4e0d59fcf7a6c2ab3846ff2d3a54007b3817a11dff770d06ff");
    });

    test("new address", async () => {
        const address = await wallet.getNewAddress({ privateKey: "d636a23d4f49fe4e0d59fcf7a6c2ab3846ff2d3a54007b3817a11dff770d06ff" });
        expect(address.address).toBe("kaspa:qqpet37fwqlql7q4jczr7zj7qp5ylps2r2c0ynz6jjf368sdjnztufeghvc9x");
        expect(address.publicKey).toBe("0395c7c9703e0ff81596043f0a5e00684f860a1ab0f24c5a94931d1e0d94c4be");
    });

    test("validate address", async () => {
        expect((await wallet.validAddress({ address: "kaspa:qrcnkrtrjptghtrntvyqkqafj06f9tamn0pnqvelmt2vmz68yp4gqj5lnal2h" })).isValid).toBe(true);
        expect((await wallet.validAddress({ address: "kaspa:qrcnkrtrjptghtrntvyqkqafj06f9tamn0pnqvelmt2vmz68yp4gqj5lnal2a" })).isValid).toBe(false);
        expect((await wallet.validAddress({ address: "kaspa:prcnkrtrjptghtrntvyqkqafj06f9tamn0pnqvelmt2vmz68yp4gqj5lnal2h" })).isValid).toBe(false);
        expect((await wallet.validAddress({ address: "kaspa1:qrcnkrtrjptghtrntvyqkqafj06f9tamn0pnqvelmt2vmz68yp4gqj5lnal2h" })).isValid).toBe(false);
        expect((await wallet.validAddress({ address: "kaspa:1prcnkrtrjptghtrntvyqkqafj06f9tamn0pnqvelmt2vmz68yp4gqj5lnal2h" })).isValid).toBe(false);
        expect((await wallet.validAddress({ address: "kaspa:rcnkrtrjptghtrntvyqkqafj06f9tamn0pnqvelmt2vmz68yp4gqj5lnal2h" })).isValid).toBe(false);
    });

    test("transfer", async () => {
        const param = {
            data: {
                inputs: [
                    {
                        txId: "ec62c785badb0ee693435841d35bd05da9c8a40aa2d568dddb0dd47410e7e78a",
                        vOut: 1,
                        address: "kaspa:qqpet37fwqlql7q4jczr7zj7qp5ylps2r2c0ynz6jjf368sdjnztufeghvc9x",
                        amount: 597700,
                    },
                ],
                outputs: [
                    {
                        address: "kaspa:qqpet37fwqlql7q4jczr7zj7qp5ylps2r2c0ynz6jjf368sdjnztufeghvc9x",
                        amount: 587700,
                    },
                ],
                address: "kaspa:qqpet37fwqlql7q4jczr7zj7qp5ylps2r2c0ynz6jjf368sdjnztufeghvc9x",
                fee: 10000,
            },
            privateKey: "d636a23d4f49fe4e0d59fcf7a6c2ab3846ff2d3a54007b3817a11dff770d06ff",
        };

        const tx = await wallet.signTransaction(param);
        console.log(tx);
    });
});
