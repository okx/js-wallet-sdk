import { Address } from "@kaspa/core-lib"
import { KaspaWallet } from "../src/KaspaWallet";

const wallet = new KaspaWallet();

describe("kaspa", () => {
    test("address", async () => {
        let isValid = await wallet.validAddress({ address: "kaspa:qrcnkrtrjptghtrntvyqkqafj06f9tamn0pnqvelmt2vmz68yp4gqj5lnal2h" });
        console.log(isValid);

        isValid = await wallet.validAddress({ address: "kaspa:prcnkrtrjptghtrntvyqkqafj06f9tamn0pnqvelmt2vmz68yp4gqj5lnal2h" });
        console.log(isValid);

        // @ts-ignore
        const address = new Address(Buffer.from("f13b0d6390568bac735b080b03a993f492afbb9bc330333fdad4cd8b47206a80", "hex"), "kaspa").toString();
        console.log(address);
    });
});
