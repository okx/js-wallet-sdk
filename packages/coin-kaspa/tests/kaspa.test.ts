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

    test("calculate txId", async () => {
        const txId = await wallet.calcTxHash({
            data: {"transaction":{"version":0,"inputs":[{"previousOutpoint":{"transactionId":"ec62c785badb0ee693435841d35bd05da9c8a40aa2d568dddb0dd47410e7e78a","index":1},"signatureScript":"411687d956de8e3cc53b9dbf20ede3922b422595abbad31ecf38ff90c0cf8ef7c3b5ae71628e041a3a0f1b9ad6e14bb6d49dd7c35f06c46316b67c10d477c29ac001","sequence":0,"sigOpCount":1}],"outputs":[{"scriptPublicKey":{"version":0,"scriptPublicKey":"200395c7c9703e0ff81596043f0a5e00684f860a1ab0f24c5a94931d1e0d94c4beac"},"amount":587700}],"lockTime":0,"subnetworkId":"0000000000000000000000000000000000000000"},"allowOrphan":false},
        });

        expect(txId).toBe("a1e32db317f2d843ad564d58e4348d24995a74ab3b6d205bf759747edeb127cf");
    });

    test("sign message", async () => {
        const signature = await wallet.signMessage({
            data: {
                message: "Hello Kaspa!",
            },
            privateKey: "d636a23d4f49fe4e0d59fcf7a6c2ab3846ff2d3a54007b3817a11dff770d06ff",
        });

        console.log(signature);
    });
});
