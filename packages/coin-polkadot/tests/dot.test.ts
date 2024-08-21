import {BN} from "@okxweb3/crypto-lib"
import {getNewAddress, NetWork, SignTx, TxType, validateAddress} from "../src";

const privateKey = "e7cfd179d6537a676cb94bac3b5c5c9cb1550e846ac4541040d077dfbac2e7fd"

describe("dot", () => {
    test("tx", async () => {
        const tx = {
            From:         "12VS5aVsZp3qywuC6wjkhAJdkfNp2SC1WPNfoMFevpovCsxr",
            To:           "12VS5aVsZp3qywuC6wjkhAJdkfNp2SC1WPNfoMFevpovCsxr",
            Amount:       new BN(10000000000),
            Nonce:        new BN(18),
            Tip:          new BN(0),
            BlockHeight:  new BN(10672081),
            BlockHash:    "569e9705bdcd3cf15edb1378433148d437f585a21ad0e2691f0d8c0083021580",
            GenesisHash:  "91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3",
            SpecVersion:  9220,
            TxVersion:    12,
            ModuleMethod: "0500",
            Version:      "84",
        }
        // 0x4102840041eb872825006874a009724c7a2f36cd73e676afd0f7703a06d0edbcb27197ab00186a60179608f8b412144feeb02271830a45b1561b855508a2432d220b3f9a4949c11bc0536c60d47d011cfb7182835668949740732180cca8ec2dbefe536c091501480005000041eb872825006874a009724c7a2f36cd73e676afd0f7703a06d0edbcb27197ab0700e40b5402
        const b = SignTx(tx, TxType.Transfer, privateKey)
        console.info(b)
    });

    test("address", async () => {
        const address = getNewAddress(privateKey, NetWork.polkadot)
        console.info(address)

        // const address99 = getNewAddress("xss", NetWork.polkadot)
        // console.info(address99)

        const v = validateAddress(address, NetWork.polkadot)
        console.info(v)

        const address2 = getNewAddress(privateKey, NetWork.westend)
        console.info(address2)

        const v2 = validateAddress(address2, NetWork.westend)
        console.info(v2)
    });
});
