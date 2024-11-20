import {KaspaWallet} from "../src";
const wallet = new KaspaWallet();

describe("kaspa", () => {
    test("derive privateKey", async () => {
        const privateKey = await wallet.getDerivedPrivateKey({
            mnemonic: "reopen vivid parent want raw main filter rotate earth true fossil dream",
            hdPath: "m/44'/111111'/0'/0/0",
        });
        expect(privateKey).toBe("0xd636a23d4f49fe4e0d59fcf7a6c2ab3846ff2d3a54007b3817a11dff770d06ff");
    });

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
        const wallet = new KaspaWallet();
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
        const wallet = new KaspaWallet();
        const privateKeyTemp = await wallet.getRandomPrivateKey();
        const privateKey = privateKeyTemp.slice(2);
        expect((await wallet.validPrivateKey({privateKey:privateKey})).isValid).toEqual(true);
        expect((await wallet.validPrivateKey({privateKey:'0x'+privateKey})).isValid).toEqual(true);
        expect((await wallet.validPrivateKey({privateKey:'0X'+privateKey})).isValid).toEqual(true);
        expect((await wallet.validPrivateKey({privateKey:'0X'+privateKey.toUpperCase()})).isValid).toEqual(true);
    });

    test("getNewAddress", async () => {
        let address = await wallet.getNewAddress({privateKey: "d636a23d4f49fe4e0d59fcf7a6c2ab3846ff2d3a54007b3817a11dff770d06ff"});
        expect(address.address).toBe("kaspa:qqpet37fwqlql7q4jczr7zj7qp5ylps2r2c0ynz6jjf368sdjnztufeghvc9x");
        expect(address.publicKey).toBe("0395c7c9703e0ff81596043f0a5e00684f860a1ab0f24c5a94931d1e0d94c4be");
        address = await wallet.getNewAddress({privateKey: "0xd636a23d4f49fe4e0d59fcf7a6c2ab3846ff2d3a54007b3817a11dff770d06ff"});
        expect(address.address).toBe("kaspa:qqpet37fwqlql7q4jczr7zj7qp5ylps2r2c0ynz6jjf368sdjnztufeghvc9x");
        address = await wallet.getNewAddress({privateKey: "D636A23D4F49FE4E0D59FCF7A6C2AB3846FF2D3A54007B3817A11DFF770D06FF"});
        expect(address.address).toBe("kaspa:qqpet37fwqlql7q4jczr7zj7qp5ylps2r2c0ynz6jjf368sdjnztufeghvc9x");
        address = await wallet.getNewAddress({privateKey: "0XD636A23D4F49FE4E0D59FCF7A6C2AB3846FF2D3A54007B3817A11DFF770D06FF"});
        expect(address.address).toBe("kaspa:qqpet37fwqlql7q4jczr7zj7qp5ylps2r2c0ynz6jjf368sdjnztufeghvc9x");
    });

    test("validate address", async () => {
        expect((await wallet.validAddress({address: "kaspa:qrcnkrtrjptghtrntvyqkqafj06f9tamn0pnqvelmt2vmz68yp4gqj5lnal2h"})).isValid).toBe(true);
        expect((await wallet.validAddress({address: "kaspa:qrcnkrtrjptghtrntvyqkqafj06f9tamn0pnqvelmt2vmz68yp4gqj5lnal2a"})).isValid).toBe(false);
        expect((await wallet.validAddress({address: "kaspa:prcnkrtrjptghtrntvyqkqafj06f9tamn0pnqvelmt2vmz68yp4gqj5lnal2h"})).isValid).toBe(false);
        expect((await wallet.validAddress({address: "kaspa1:qrcnkrtrjptghtrntvyqkqafj06f9tamn0pnqvelmt2vmz68yp4gqj5lnal2h"})).isValid).toBe(false);
        expect((await wallet.validAddress({address: "kaspa:1prcnkrtrjptghtrntvyqkqafj06f9tamn0pnqvelmt2vmz68yp4gqj5lnal2h"})).isValid).toBe(false);
        expect((await wallet.validAddress({address: "kaspa:rcnkrtrjptghtrntvyqkqafj06f9tamn0pnqvelmt2vmz68yp4gqj5lnal2h"})).isValid).toBe(false);
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
            data: {
                "transaction": {
                    "version": 0,
                    "inputs": [{
                        "previousOutpoint": {
                            "transactionId": "ec62c785badb0ee693435841d35bd05da9c8a40aa2d568dddb0dd47410e7e78a",
                            "index": 1
                        },
                        "signatureScript": "411687d956de8e3cc53b9dbf20ede3922b422595abbad31ecf38ff90c0cf8ef7c3b5ae71628e041a3a0f1b9ad6e14bb6d49dd7c35f06c46316b67c10d477c29ac001",
                        "sequence": 0,
                        "sigOpCount": 1
                    }],
                    "outputs": [{
                        "scriptPublicKey": {
                            "version": 0,
                            "scriptPublicKey": "200395c7c9703e0ff81596043f0a5e00684f860a1ab0f24c5a94931d1e0d94c4beac"
                        }, "amount": 587700
                    }],
                    "lockTime": 0,
                    "subnetworkId": "0000000000000000000000000000000000000000"
                }, "allowOrphan": false
            },
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
