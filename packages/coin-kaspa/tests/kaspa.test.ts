import { KaspaWallet, addressFromPubKey } from "../src";

const wallet = new KaspaWallet();

describe("kaspa", () => {
    test("address", async () => {
        expect(await wallet.validAddress({ address: "kaspa:qrcnkrtrjptghtrntvyqkqafj06f9tamn0pnqvelmt2vmz68yp4gqj5lnal2h" })).toBe(true);
        expect(await wallet.validAddress({ address: "kaspa:qrcnkrtrjptghtrntvyqkqafj06f9tamn0pnqvelmt2vmz68yp4gqj5lnal2a" })).toBe(false);
        expect(await wallet.validAddress({ address: "kaspa:prcnkrtrjptghtrntvyqkqafj06f9tamn0pnqvelmt2vmz68yp4gqj5lnal2h" })).toBe(false);
        expect(await wallet.validAddress({ address: "kaspa1:qrcnkrtrjptghtrntvyqkqafj06f9tamn0pnqvelmt2vmz68yp4gqj5lnal2h" })).toBe(false);
        expect(await wallet.validAddress({ address: "kaspa:1prcnkrtrjptghtrntvyqkqafj06f9tamn0pnqvelmt2vmz68yp4gqj5lnal2h" })).toBe(false);
        expect(await wallet.validAddress({ address: "kaspa:rcnkrtrjptghtrntvyqkqafj06f9tamn0pnqvelmt2vmz68yp4gqj5lnal2h" })).toBe(false);

        const address = addressFromPubKey("f13b0d6390568bac735b080b03a993f492afbb9bc330333fdad4cd8b47206a80");
        expect(address).toBe("kaspa:qrcnkrtrjptghtrntvyqkqafj06f9tamn0pnqvelmt2vmz68yp4gqj5lnal2h");
    });
});
