import * as eth from "../src"
import {randomBytes} from "crypto";
import {abi, base, BigNumber} from "@okxweb3/crypto-lib";
import {ecdsaSign, makeSignature, MessageTypes,EthWallet} from "../src"
import { NewAddressParams, SignTxParams, ValidAddressParams, VerifyMessageParams } from "@okxweb3/coin-base";
import Assert from "assert";


const TOKEN_TRANSFER_FUNCTION_SIGNATURE = '0xa9059cbb';
const privateKey = "0x49c0722d56d6bac802bdf5c480a17c870d1d18bc4355d8344aa05390eb778280";
const address = "0xd74c65ad81aa8537327e9ba943011a8cec7a7b6b";

describe("eth api", () => {
    test("address", async () => {
        const privateKey = randomBytes(32)
        const address = eth.getNewAddress(base.toHex(privateKey))
        console.info(address)
        let p = base.toHex(privateKey);
        console.info(p)
        console.info(p.toUpperCase())
    });

    test("getNewAddress", async () => {
        const wallet = new EthWallet();
        const privateKey = "7322bdd5504180eab25053bf00ee3928e67e5c8a2c044894ea8397ed54661880";
        const expectedAddress = "0x483317c95fd01da74d75e817d6a8fd4898295a15";
        expect((await wallet.getNewAddress({privateKey:privateKey})).address).toEqual(expectedAddress);
        const privateKey2 = "0x7322bdd5504180eab25053bf00ee3928e67e5c8a2c044894ea8397ed54661880";
        expect((await wallet.getNewAddress({privateKey:privateKey2})).address).toEqual(expectedAddress);
        const privateKey3 = "0x7322BDD5504180EAB25053BF00EE3928E67E5C8A2C044894EA8397ED54661880";
        expect((await wallet.getNewAddress({privateKey:privateKey3})).address).toEqual(expectedAddress);
        const privateKey4 = "0X7322BDD5504180EAB25053BF00EE3928E67E5C8A2C044894EA8397ED54661880";
        expect((await wallet.getNewAddress({privateKey:privateKey4})).address).toEqual(expectedAddress);
    });

    const ps: any[] = [];
    ps.push("");
    ps.push("0x");
    ps.push("0X");
    ps.push("124699");
    ps.push("1dfi付");
    ps.push("9000 12");
    ps.push("548yT115QRHH7Mpchg9JJ8YPX9RTKuan=548yT115QRHH7Mpchg9JJ8YPX9RTKuan ");
    ps.push("L1vSc9DuBDeVkbiS79mJ441FNAYArL1vSc9DuBDeVkbiS79mJ441FNAYArL1vSc9DuBDeVkbiS79mJ441FNAYArL1vSc9DuBDeVkbiS79mJ441FNAYAr");
    ps.push("L1v");
    ps.push("0x31342f041c5b54358074b4579231c8a300be65e687dff020bc7779598b428 97a");
    ps.push("0x31342f041c5b54358074b457。、。9231c8a300be65e687dff020bc7779598b428 97a");
    test("edge test", async () => {
        const wallet = new EthWallet();
        let j = 1;
        for (let i = 0; i < ps.length; i++) {
            let  param = {privateKey: ps[i]}
            try {
                await wallet.getNewAddress(param);
            } catch (e) {
                j = j + 1
            }
            expect(ps[i]).toEqual(param.privateKey);
        }
        expect(j).toEqual(ps.length+1);
    });

    test("validPrivateKey", async () => {
        const wallet = new EthWallet();
        const privateKeyTemp = await wallet.getRandomPrivateKey();
        const privateKey= privateKeyTemp.slice(2);
        const res = await wallet.validPrivateKey({privateKey:privateKey});
        expect((await wallet.validPrivateKey({privateKey:privateKey})).isValid).toEqual(true);
        expect((await wallet.validPrivateKey({privateKey:'0x'+privateKey})).isValid).toEqual(true);
        expect((await wallet.validPrivateKey({privateKey:'0X'+privateKey})).isValid).toEqual(true);
        expect((await wallet.validPrivateKey({privateKey:'0X'+privateKey.toUpperCase()})).isValid).toEqual(true);
    });

    test("signMessage", async () => {
        const message = "0x17d98918020fc29660d9f381bad8d4bea8526e904403bd6f1d2de687c06dd634"
        const signature = eth.signMessage(eth.MessageTypes.ETH_SIGN, message, base.fromHex(privateKey))
        // 0xdbadadd89022dd233b1766338d0d77b73c34b38f0b3187b22e732ae3309479ce40186d1f14d19fccf41a0c0cb9637359ba7a79cdf79d8f068469b5171dd392f91b
        console.info(signature)

        const publicRecovered = eth.verifyMessage(eth.MessageTypes.ETH_SIGN, message, Buffer.from(base.fromHex(signature)));
        const address = eth.publicToAddress(publicRecovered)
        // 0xd74c65ad81aa8537327e9ba943011a8cec7a7b6b
        console.info(base.toHex(address, true))
    });


    test("signTransaction", async () => {
        let txParams = {
            to: "0xd74c65ad81aa8537327e9ba943011a8cec7a7b6b",
            value: new BigNumber(0),
            nonce: 5,
            gasPrice: new BigNumber(100 * 1000000000),
            gasLimit: new BigNumber(21000),
            chainId: 42,
            type: undefined,
            contractAddress: undefined,
            data: undefined,
            maxPriorityFeePerGas: undefined,
            maxFeePerGas: undefined
        };

        const chainId = base.toBigIntHex(new BigNumber(txParams.chainId || 1))  // If chainId is not sent, the default is 1 eth mainnet
        const nonce = base.toBigIntHex(new BigNumber(txParams.nonce))
        let txData = {};
        if (txParams.type == null || txParams.type === 1) {
            const tokenAddress = txParams.contractAddress;
            let toAddress = txParams.to;
            let value: string = base.toBigIntHex(txParams.value);
            let data: string | undefined;
            if (tokenAddress) {
                data = TOKEN_TRANSFER_FUNCTION_SIGNATURE + Array.prototype.map
                    .call(abi.RawEncode(['address', 'uint256'], [toAddress, value],),
                        (x) => `00${x.toString(16)}`.slice(-2),
                    ).join('');
                value = '0x0';
                toAddress = tokenAddress;
            } else {
                data = txParams.data;
            }
            txData = {
                nonce: nonce,
                gasPrice: base.toBigIntHex(txParams.gasPrice || new BigNumber(0)),
                gasLimit: base.toBigIntHex(txParams.gasLimit),
                to: toAddress,
                value: value,
                data: data,
                chainId: chainId,
                type: txParams.type || 1,

            };
        } else if (txParams.type === 2) {
            // EIP-1559 transaction fee
            const tokenAddress = txParams.contractAddress;
            let toAddress = txParams.to;
            let value: string = base.toBigIntHex(txParams.value);
            let data: string | undefined;
            if (tokenAddress) {
                data = TOKEN_TRANSFER_FUNCTION_SIGNATURE + Array.prototype.map
                    .call(abi.RawEncode(['address', 'uint256'], [toAddress, value],),
                        (x) => `00${x.toString(16)}`.slice(-2),
                    ).join('');
                value = '0x0';
                toAddress = tokenAddress;
            } else {
                data = txParams.data;
            }
            txData = {
                nonce: nonce,
                gasLimit: base.toBigIntHex(txParams.gasLimit),
                to: toAddress,
                value: value,
                data: data,
                chainId: chainId,
                type: txParams.type,
                maxPriorityFeePerGas: base.toBigIntHex(txParams.maxPriorityFeePerGas || new BigNumber(0)),
                maxFeePerGas: base.toBigIntHex(txParams.maxFeePerGas || new BigNumber(0)),
            };
        }

        // 0x01f8662a0585174876e80082520894d74c65ad81aa8537327e9ba943011a8cec7a7b6b8080c080a0428fa621a43bfab26cc6a45bc44bdc9c67fe192236565437e25be8d6ee90e46ba07667064b17906614eaa54ae3fa52973e4658f93f37c894d5baf8f00285154faf
        console.info(eth.signTransaction(privateKey, txData))
    });
});

describe("eth walLet", () => {

    let wallet = new eth.EthWallet()

    test("getNewAddress222", async () => {
        let path = await wallet.getDerivedPath({index: 0});
        Assert.strictEqual(path, "m/44'/60'/0'/0/0")
    });

    test("getRandomPrivateKey", async () => {
        let privateKey = await wallet.getRandomPrivateKey();
        console.info(privateKey);
    });

    test("getDerivedPrivateKey", async () => {
        let mnemonic = "swift choose erupt agree fragile spider glare spawn suit they solid bus";
        let param = {
            mnemonic: mnemonic,
            hdPath: "m/44'/60'/0'/0/0"
        };

        let privateKey = await wallet.getDerivedPrivateKey(param);
        console.info(privateKey);
    });

    test("getNewAddress", async () => {
        let params: NewAddressParams = {
            privateKey: privateKey
        };
        let address = await wallet.getNewAddress(params);
        console.info(address);
        let addr = await wallet.getAddressByPublicKey({publicKey: "0xc847f6dd9e4fd3ce75c61614c838d9a54a5482b46e439b99aec5ebe26f9681510eab4e8116df5cb889d48194010633e83dd9ccbbffa6942a6768412293a70f41"});
        console.log(addr);
    });

    test("validAddress", async () => {
        let p2: ValidAddressParams = {
            address: "0xb6a2cd80ace5e876530b0b71307608105c7d0fe8"
        };
        let valid = await wallet.validAddress(p2);
        console.info(valid);
    });

    test("ETH_SIGN", async () => {
        let data = {
            type: eth.MessageTypes.ETH_SIGN,
            message: "0x879a053d4800c6354e76c7985a865d2922c82fb5b3f4577b2fe08b998954f2e0"
        };
        let signParams: SignTxParams = {
            privateKey: privateKey,
            data: data
        };
        let result = "0xa4a11b0526c248576756292f420f3cf4c5bb744a8491f8c1a33838b95f401aed7afe88e296edf246291e3f9fcd125a7fe795c76ab118d5abb97421e1f03fa36f1b";
        console.info(await wallet.signMessage(signParams))

        let verifyMessageParams: VerifyMessageParams = {
            signature: result,
            data: data,
            address: address
        };
        console.info(await wallet.verifyMessage(verifyMessageParams))
    });

    test("PERSONAL_SIGN", async () => {
        const data = {
            type: eth.MessageTypes.PERSONAL_SIGN,
            message: "0x4578616d706c652060706572736f6e616c5f7369676e60206d657373616765"
        };
        let signParams: SignTxParams = {
            privateKey: privateKey,
            data: data
        };
        const result = await wallet.signMessage(signParams);
        Assert.strictEqual(result, "0xcbbd3c5a99ff60cde35f36e54be1fe677bf24e9688dbe224b63cc5e5505cc096225aa5a40e7b1ba02a907b206be81de481bb4e33e6db05adee506baf6f9fd72b1b");
    });

    test("TYPE_DATA_V1_Address", async () => {
        const msgParams = [
            {
                type: "address",
                name: "data of type address",
                value: address
            },
        ];

        const data = {
            type: eth.MessageTypes.TYPE_DATA_V1,
            message: JSON.stringify(msgParams)
        };
        let signParams: SignTxParams = {
            privateKey: privateKey,
            data: data
        };
        let result = await wallet.signMessage(signParams)
        console.info(result)

        let verifyMessageParams: VerifyMessageParams = {
            signature: result,
            data: data,
            address: address
        };
        console.info(await wallet.verifyMessage(verifyMessageParams))
    });

    test("TYPE_DATA_V1_bytes32", async () => {
        const data = {
            type: eth.MessageTypes.TYPE_DATA_V1,
            message: "[{\"type\":\"bytes32\",\"name\":\"data of type bytes32\",\"value\":\"0x75b8002e38ea47e6ce4c38772002e8ba93d7b0dc34367e988b2930ec2482a167\"}]"
        };
        let signParams: SignTxParams = {
            privateKey: privateKey,
            data: data
        };
        let result = await wallet.signMessage(signParams)
        console.info(result)

        let verifyMessageParams: VerifyMessageParams = {
            signature: result,
            data: data,
            address: address
        };
        console.info(await wallet.verifyMessage(verifyMessageParams))
    });

    test("TYPE_DATA_V1", async () => {
        const msgParams = [
            {
                type: "string",
                name: "Message",
                value: "Hi, Alice!"
            },
            {
                type: "uint32",
                name: "A number",
                value: "1337"
            }
        ];

        const data = {
            type: eth.MessageTypes.TYPE_DATA_V1,
            message: JSON.stringify(msgParams)
        };
        let signParams: SignTxParams = {
            privateKey: privateKey,
            data: data
        };
        let result = "0x8596be6aeea3cdaba2685e430ad9db7f0425cea9a9c793f3fc8bf7f3fd11ddf31b953c7858731f7dca649ec3014903520e40e57103d52b80a054c4c44fe1c2521c";
        console.info(await wallet.signMessage(signParams))

        let verifyMessageParams: VerifyMessageParams = {
            signature: result,
            data: data,
            address: address
        };
        console.info(await wallet.verifyMessage(verifyMessageParams))
    });

    test("TYPE_DATA_V3", async () => {
        const chainId = 42;
        const msgParams = {
            types: {
                EIP712Domain: [
                    { name: "name", type: "string" },
                    { name: "version", type: "string" },
                    { name: "chainId", type: "uint256" },
                    { name: "verifyingContract", type: "address" }
                ],
                Person: [
                    { name: "name", type: "string" },
                    { name: "wallet", type: "address" }
                ],
                Mail: [
                    { name: "from", type: "Person" },
                    { name: "to", type: "Person" },
                    { name: "contents", type: "string" }
                ]
            },
            primaryType: "Mail",
            domain: {
                name: "Ether Mail",
                version: "1",
                chainId,
                verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC"
            },
            message: {
                from: {
                    name: "Cow",
                    wallet: "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826"
                },
                to: {
                    name: "Bob",
                    wallet: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB"
                },
                contents: "Hello, Bob!"
            }
        };

        const data = {
            type: eth.MessageTypes.TYPE_DATA_V3,
            message: JSON.stringify(msgParams)
        };
        let signParams: SignTxParams = {
            privateKey: privateKey,
            data: data
        };
        let result = "0x337e69d931591a9bae20b2d4c541804bb1b6fa32c8468a9007041b7ba63cb8a401cba4a7eb71f48e9eb586c8d80896e803275f979a530313fd647c72a806bc511c";
        console.info(await wallet.signMessage(signParams))

        let verifyMessageParams: VerifyMessageParams = {
            signature: result,
            data: data,
            address: address
        };
        console.info(await wallet.verifyMessage(verifyMessageParams))
    });

    test("TYPE_DATA_V4", async () => {
        const chainId = 42;
        const msgParams = "{\n" +
            "    \"domain\":{\n" +
            "        \"chainId\":\"66\",\n" +
            "        \"name\":\"OKX_NFT\",\n" +
            "        \"version\":\"1.1\",\n" +
            "        \"verifyingContract\":\"0x34DF5c035e31c0edfd104f3EA83d9548F108Df56\"\n" +
            "    },\n" +
            "    \"message\":{\n" +
            "        \"startTime\":1667184663,\n" +
            "        \"endTime\":1667443863,\n" +
            "        \"orderType\":2,\n" +
            "        \"zone\":\"0xa472fAd4B6cAdFDEd63f7aE5BFEe6eCf4F08Ae95\",\n" +
            "        \"zoneHash\":\"0x0000000000000000000000000000000000000000000000000000000000000000\",\n" +
            "        \"salt\":\"52760315571824630\",\n" +
            "        \"conduitKey\":\"0x618Cf13c76c1FFC2168fC47c98453dCc6134F5c8888888888888888888888888\",\n" +
            "        \"counter\":\"0\",\n" +
            "        \"offerer\":\"0x12910188b68a7817a0592406f1ffe0c31676b417\",\n" +
            "        \"offer\":[\n" +
            "            {\n" +
            "                \"itemType\":1,\n" +
            "                \"token\":\"0x382bb369d343125bfb2117af9c149795c6c65c50\",\n" +
            "                \"identifierOrCriteria\":\"0\",\n" +
            "                \"startAmount\":\"1000000000000000\",\n" +
            "                \"endAmount\":\"1000000000000000\"\n" +
            "            }\n" +
            "        ],\n" +
            "        \"consideration\":[\n" +
            "            {\n" +
            "                \"itemType\":2,\n" +
            "                \"token\":\"0xf8b973fdf2e6f700a775aa94ff72180688b5a044\",\n" +
            "                \"identifierOrCriteria\":\"46201\",\n" +
            "                \"startAmount\":\"1\",\n" +
            "                \"endAmount\":\"1\",\n" +
            "                \"recipient\":\"0x12910188b68a7817a0592406f1ffe0c31676b417\"\n" +
            "            }\n" +
            "        ],\n" +
            "        \"totalOriginalConsiderationItems\":1\n" +
            "    },\n" +
            "    \"primaryType\":\"OrderComponents\",\n" +
            "    \"types\":{\n" +
            "        \"EIP712Domain\":[\n" +
            "            {\n" +
            "                \"name\":\"name\",\n" +
            "                \"type\":\"string\"\n" +
            "            },\n" +
            "            {\n" +
            "                \"name\":\"version\",\n" +
            "                \"type\":\"string\"\n" +
            "            },\n" +
            "            {\n" +
            "                \"name\":\"chainId\",\n" +
            "                \"type\":\"uint256\"\n" +
            "            },\n" +
            "            {\n" +
            "                \"name\":\"verifyingContract\",\n" +
            "                \"type\":\"address\"\n" +
            "            }\n" +
            "        ],\n" +
            "        \"OrderComponents\":[\n" +
            "            {\n" +
            "                \"name\":\"offerer\",\n" +
            "                \"type\":\"address\"\n" +
            "            },\n" +
            "            {\n" +
            "                \"name\":\"zone\",\n" +
            "                \"type\":\"address\"\n" +
            "            },\n" +
            "            {\n" +
            "                \"name\":\"offer\",\n" +
            "                \"type\":\"OfferItem[]\"\n" +
            "            },\n" +
            "            {\n" +
            "                \"name\":\"consideration\",\n" +
            "                \"type\":\"ConsiderationItem[]\"\n" +
            "            },\n" +
            "            {\n" +
            "                \"name\":\"orderType\",\n" +
            "                \"type\":\"uint8\"\n" +
            "            },\n" +
            "            {\n" +
            "                \"name\":\"startTime\",\n" +
            "                \"type\":\"uint256\"\n" +
            "            },\n" +
            "            {\n" +
            "                \"name\":\"endTime\",\n" +
            "                \"type\":\"uint256\"\n" +
            "            },\n" +
            "            {\n" +
            "                \"name\":\"zoneHash\",\n" +
            "                \"type\":\"bytes32\"\n" +
            "            },\n" +
            "            {\n" +
            "                \"name\":\"salt\",\n" +
            "                \"type\":\"uint256\"\n" +
            "            },\n" +
            "            {\n" +
            "                \"name\":\"conduitKey\",\n" +
            "                \"type\":\"bytes32\"\n" +
            "            },\n" +
            "            {\n" +
            "                \"name\":\"counter\",\n" +
            "                \"type\":\"uint256\"\n" +
            "            }\n" +
            "        ],\n" +
            "        \"OfferItem\":[\n" +
            "            {\n" +
            "                \"name\":\"itemType\",\n" +
            "                \"type\":\"uint8\"\n" +
            "            },\n" +
            "            {\n" +
            "                \"name\":\"token\",\n" +
            "                \"type\":\"address\"\n" +
            "            },\n" +
            "            {\n" +
            "                \"name\":\"identifierOrCriteria\",\n" +
            "                \"type\":\"uint256\"\n" +
            "            },\n" +
            "            {\n" +
            "                \"name\":\"startAmount\",\n" +
            "                \"type\":\"uint256\"\n" +
            "            },\n" +
            "            {\n" +
            "                \"name\":\"endAmount\",\n" +
            "                \"type\":\"uint256\"\n" +
            "            }\n" +
            "        ],\n" +
            "        \"ConsiderationItem\":[\n" +
            "            {\n" +
            "                \"name\":\"itemType\",\n" +
            "                \"type\":\"uint8\"\n" +
            "            },\n" +
            "            {\n" +
            "                \"name\":\"token\",\n" +
            "                \"type\":\"address\"\n" +
            "            },\n" +
            "            {\n" +
            "                \"name\":\"identifierOrCriteria\",\n" +
            "                \"type\":\"uint256\"\n" +
            "            },\n" +
            "            {\n" +
            "                \"name\":\"startAmount\",\n" +
            "                \"type\":\"uint256\"\n" +
            "            },\n" +
            "            {\n" +
            "                \"name\":\"endAmount\",\n" +
            "                \"type\":\"uint256\"\n" +
            "            },\n" +
            "            {\n" +
            "                \"name\":\"recipient\",\n" +
            "                \"type\":\"address\"\n" +
            "            }\n" +
            "        ]\n" +
            "    }\n" +
            "}";

        const data = {
            type: eth.MessageTypes.TYPE_DATA_V4,
            message: msgParams
        };
        let signParams: SignTxParams = {
            privateKey: privateKey,
            data: data
        };

        let signature = await wallet.signMessage(signParams)
        console.info(signature)

        let verifyMessageParams: VerifyMessageParams = {
            signature: signature,
            data: data,
            address: address
        };
        console.info(await wallet.verifyMessage(verifyMessageParams))
    });

    test("legacy deploy contract", async () => {
        let ethTxParams = {
            value: base.toBigIntHex(new BigNumber(0)),
            nonce: base.toBigIntHex(new BigNumber(7)),
            gasPrice: base.toBigIntHex(new BigNumber(10 * 1000000000)),
            gasLimit: base.toBigIntHex(new BigNumber(2100000)),
            chainId: base.toBigIntHex(new BigNumber(42)),
            data: "0x608060405234801561001057600080fd5b5033600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506000808190555061023b806100686000396000f300608060405260043610610057576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680632e1a7d4d1461005c5780638da5cb5b1461009d578063d0e30db0146100f4575b600080fd5b34801561006857600080fd5b5061008760048036038101908080359060200190929190505050610112565b6040518082815260200191505060405180910390f35b3480156100a957600080fd5b506100b26101d0565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6100fc6101f6565b6040518082815260200191505060405180910390f35b6000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561017057600080fd5b8160008082825403925050819055503373ffffffffffffffffffffffffffffffffffffffff166108fc839081150290604051600060405180830381858888f193505050501580156101c5573d6000803e3d6000fd5b506000549050919050565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60003460008082825401925050819055506000549050905600a165627a7a72305820f237db3ec816a52589d82512117bc85bc08d3537683ffeff9059108caf3e5d400029"
        };

        let signParams: SignTxParams = {
            privateKey: privateKey,
            data: ethTxParams
        };
        let tx = await wallet.signTransaction(signParams);
        console.info(tx);
    });

    test("legacy transfer", async () => {
        let ethTxParams = {
            to: "0xee7c7f76795cd0cab3885fee6f2c50def89f48a3",
            value: 1,
            nonce: 5,
            gasPrice: "100000000000",
            gasLimit: 21000,
            chainId: 42,
        };

        let signParams: SignTxParams = {
            privateKey: privateKey,
            data: ethTxParams
        };
        let tx = await wallet.signTransaction(signParams);
        Assert.strictEqual(tx, "0xf8640585174876e80082520894ee7c7f76795cd0cab3885fee6f2c50def89f48a3018077a0d24110fbe8086aa13cce1b602d5fe97fc15a54d146a36cc0f0218828b227984aa02ae221391acb4462be0b3d2f7f7dfd89c5fa543e22a055c3f626fb8523788e84")

        const k = {
            tx: tx,
            data: {
                publicKey: "0x046ab431c7aea69882e8479fbdd4d2f8fc343c7ae04ce2b45647296c3a7b78df3aa977701e0af4127665bcc6a07dd81aa3ad78b29d00d6670c70b4fee55970ee5f",
                chainId: 42,
            }
        }
        const v = await wallet.validSignedTransaction(k);
        console.info(v)
    });

    test("legacy data", async () => {
        let ethTxParams = {
            to: "0xee7c7f76795cd0cab3885fee6f2c50def89f48a3",
            value: base.toBigIntHex(new BigNumber(0)),
            nonce: base.toBigIntHex(new BigNumber(5)),
            gasPrice: base.toBigIntHex(new BigNumber(100000000000)),
            gasLimit: base.toBigIntHex(new BigNumber(21000)),
            chainId: base.toBigIntHex(new BigNumber(42)),
            data: "0xa9059cbb000000000000000000000000ee7c7f76795cd0cab3885fee6f2c50def89f48a30000000000000000000000000000000000000000000000000000000000002710"
        };

        let signParams: SignTxParams = {
            privateKey: privateKey,
            data: ethTxParams
        };
        let tx = await wallet.signTransaction(signParams);
        Assert.strictEqual(tx, "0xf8a90585174876e80082520894ee7c7f76795cd0cab3885fee6f2c50def89f48a380b844a9059cbb000000000000000000000000ee7c7f76795cd0cab3885fee6f2c50def89f48a3000000000000000000000000000000000000000000000000000000000000271077a0fecc29621529a04357dd077b3fbaf68ac4ecc718398cbca98f39afa3b806de63a07efa8676efa71402af38e27ebdc1cc1eb5b8902203d2c2327f1f799df05585e5")

        const k = {
            tx: tx,
            data: {
                publicKey: "0x046ab431c7aea69882e8479fbdd4d2f8fc343c7ae04ce2b45647296c3a7b78df3aa977701e0af4127665bcc6a07dd81aa3ad78b29d00d6670c70b4fee55970ee5f",
                chainId: 42,
            }
        }
        const v = await wallet.validSignedTransaction(k);
        console.info(v)
    });

    test("legacy token transfer", async () => {
        let ethTxParams = {
            contractAddress: "0x45Ef35936F0EB8F588Eb9C851C5B1C42B22e61EC",
            to: "0xee7c7f76795cd0cab3885fee6f2c50def89f48a3",
            value: base.toBigIntHex(new BigNumber(1)),
            nonce: base.toBigIntHex(new BigNumber(8)),
            gasPrice: base.toBigIntHex(new BigNumber(100000000000)),
            gasLimit: base.toBigIntHex(new BigNumber(21000)),
            chainId: base.toBigIntHex(new BigNumber(42))
        };

        let signParams: SignTxParams = {
            privateKey: privateKey,
            data: ethTxParams
        };
        let tx = await wallet.signTransaction(signParams);
        Assert.strictEqual(tx, "0xf8a80885174876e8008252089445ef35936f0eb8f588eb9c851c5b1c42b22e61ec80b844a9059cbb000000000000000000000000ee7c7f76795cd0cab3885fee6f2c50def89f48a3000000000000000000000000000000000000000000000000000000000000000177a0bfe74a4eabdbda9273dacd0dc52a5b51d4be1b4458827eea15ab0492bcf922539fecad8d621639e0deeb1f1e12268a0fcbf9ca3ccd7611f45457900ffa6233f8")

        const k = {
            tx: tx,
            data: {
                publicKey: "0x046ab431c7aea69882e8479fbdd4d2f8fc343c7ae04ce2b45647296c3a7b78df3aa977701e0af4127665bcc6a07dd81aa3ad78b29d00d6670c70b4fee55970ee5f",
                chainId: 42,
            }
        }
        const v = await wallet.validSignedTransaction(k);
        console.info(v)
    });


    test("1559 transfer", async () => {
        let ethTxParams = {
            gasPrice: base.toBigIntHex(new BigNumber(44500000000)),
            gasLimit: base.toBigIntHex(new BigNumber(42000)),
            to: "0x35b2438d33c7dc449ae9ffbda14f56dc39a4c6b8",
            value: base.toBigIntHex(new BigNumber(1000000000000000000)),
            nonce: base.toBigIntHex(new BigNumber(11)),
            maxFeePerGas: base.toBigIntHex(new BigNumber(35000000000)),
            maxPriorityFeePerGas: base.toBigIntHex(new BigNumber(2000000000)),
            chainId: base.toBigIntHex(new BigNumber(1)),
            type: 2
        };

        let signParams: SignTxParams = {
            privateKey: privateKey,
            data: ethTxParams
        };
        let tx = await wallet.signTransaction(signParams);
        Assert.strictEqual(tx, "0x02f873010b8477359400850826299e0082a4109435b2438d33c7dc449ae9ffbda14f56dc39a4c6b8880de0b6b3a764000080c080a0217cb7a42b633dc4d077e08e03b248a2e2b34b12a2775870f6e76148a1a18d9aa050d0603c786975c8f6e93e588570f0846c5e2242822aa13e0cb949dc8754b574")

        const k = {
            tx: tx,
            data: {
                publicKey: "0x046ab431c7aea69882e8479fbdd4d2f8fc343c7ae04ce2b45647296c3a7b78df3aa977701e0af4127665bcc6a07dd81aa3ad78b29d00d6670c70b4fee55970ee5f",
            }
        }
        const v = await wallet.validSignedTransaction(k);
        console.info(v)
    });

    test("1559 token transfer", async () => {
        let ethTxParams = {
            contractAddress: "0xf4d2888d29d722226fafa5d9b24f9164c092421e",
            gasPrice: base.toBigIntHex(new BigNumber(44500000000)),
            gasLimit: base.toBigIntHex(new BigNumber(42000)),
            to: "0x35b2438d33c7dc449ae9ffbda14f56dc39a4c6b8",
            value: base.toBigIntHex(new BigNumber(1000000000000000000)),
            nonce: base.toBigIntHex(new BigNumber(11)),
            maxFeePerGas: base.toBigIntHex(new BigNumber(35000000000)),
            maxPriorityFeePerGas: base.toBigIntHex(new BigNumber(2000000000)),
            chainId: base.toBigIntHex(new BigNumber(1)),
            type: 2,
            data: "0x",
        };

        let signParams: SignTxParams = {
            privateKey: privateKey,
            data: ethTxParams
        };
        let tx = await wallet.signTransaction(signParams);
        Assert.strictEqual(tx, "0x02f8b0010b8477359400850826299e0082a41094f4d2888d29d722226fafa5d9b24f9164c092421e80b844a9059cbb00000000000000000000000035b2438d33c7dc449ae9ffbda14f56dc39a4c6b80000000000000000000000000000000000000000000000000de0b6b3a7640000c001a0c264e921b88346c7f528c041c5a1fe8fcc34e55d66f87b0547463d01762d8c87a004904f0db5839dce9799ed7be303e802f3a780e8353df1423991453861ebeb29")

        const k = {
            tx: tx,
            data: {
                publicKey: "0x046ab431c7aea69882e8479fbdd4d2f8fc343c7ae04ce2b45647296c3a7b78df3aa977701e0af4127665bcc6a07dd81aa3ad78b29d00d6670c70b4fee55970ee5f",
            }
        }
        const v = await wallet.validSignedTransaction(k);
        console.info(v)
    });

    test("decrypt", async () => {
        const wallet = new eth.EthWallet()
        const publicKey = await wallet.getEncryptionPublicKey("808e50dd63f3749405dfb0ac9a965804a33919fb82c4676bb00ac435ead6b4e8");
        const d = "hello world";
        const data = await wallet.encrypt(publicKey, d, "x25519-xsalsa20-poly1305")
        console.info(data);

        const data2 = await wallet.decrypt(data, "808e50dd63f3749405dfb0ac9a965804a33919fb82c4676bb00ac435ead6b4e8");
        Assert.strictEqual(data2, d)
    });


    test("TYPE_DATA_V4", async () => {
        const privateKey = "0x808e50dd63f3749405dfb0ac9a965804a33919fb82c4676bb00ac435ead6b4e8";
        const msg = "{\"types\":{\"EIP712Domain\":[{\"name\":\"name\",\"type\":\"string\"},{\"name\":\"version\",\"type\":\"string\"},{\"name\":\"chainId\",\"type\":\"uint256\"},{\"name\":\"verifyingContract\",\"type\":\"address\"}],\"ChangePubKey\":[{\"name\":\"pubKeyHash\",\"type\":\"bytes20\"},{\"name\":\"nonce\",\"type\":\"uint32\"},{\"name\":\"accountId\",\"type\":\"uint32\"}]},\"domain\":{\"name\":\"ZkLink\",\"version\":\"1\",\"chainId\":56,\"verifyingContract\":\"0xb86934fa6e53e15320911485c775d4ba4020fa5a\"},\"primaryType\":\"ChangePubKey\",\"message\":{\"pubKeyHash\":\"0x54c7620448d2df78dece4eededa3bd7b9f8badba\",\"nonce\":0,\"accountId\":80666}}";
        let signature = eth.signMessage(MessageTypes.TYPE_DATA_V4, msg, base.fromHex(privateKey))
        console.info(signature)
    });

    test("TYPE_DATA_V4_2", async () => {
        const privateKey = "0x808e50dd63f3749405dfb0ac9a965804a33919fb82c4676bb00ac435ead6b4e8";
        const msg = "{\n" +
            "    \"domain\":{\n" +
            "        \"chainId\":\"66\",\n" +
            "        \"name\":\"OKX_NFT\",\n" +
            "        \"version\":\"1.1\",\n" +
            "        \"verifyingContract\":\"0x34DF5c035e31c0edfd104f3EA83d9548F108Df56\"\n" +
            "    },\n" +
            "    \"message\":{\n" +
            "        \"startTime\":1667184663,\n" +
            "        \"endTime\":1667443863,\n" +
            "        \"orderType\":2,\n" +
            "        \"zone\":\"0xa472fAd4B6cAdFDEd63f7aE5BFEe6eCf4F08Ae95\",\n" +
            "        \"zoneHash\":\"0x0000000000000000000000000000000000000000000000000000000000000000\",\n" +
            "        \"salt\":\"52760315571824630\",\n" +
            "        \"conduitKey\":\"0x618Cf13c76c1FFC2168fC47c98453dCc6134F5c8888888888888888888888888\",\n" +
            "        \"counter\":\"0\",\n" +
            "        \"offerer\":\"0x12910188b68a7817a0592406f1ffe0c31676b417\",\n" +
            "        \"offer\":[\n" +
            "            {\n" +
            "                \"itemType\":1,\n" +
            "                \"token\":\"0x382bb369d343125bfb2117af9c149795c6c65c50\",\n" +
            "                \"identifierOrCriteria\":\"0\",\n" +
            "                \"startAmount\":\"1000000000000000\",\n" +
            "                \"endAmount\":\"1000000000000000\"\n" +
            "            }\n" +
            "        ],\n" +
            "        \"consideration\":[\n" +
            "            {\n" +
            "                \"itemType\":2,\n" +
            "                \"token\":\"0xf8b973fdf2e6f700a775aa94ff72180688b5a044\",\n" +
            "                \"identifierOrCriteria\":\"46201\",\n" +
            "                \"startAmount\":\"1\",\n" +
            "                \"endAmount\":\"1\",\n" +
            "                \"recipient\":\"0x12910188b68a7817a0592406f1ffe0c31676b417\"\n" +
            "            }\n" +
            "        ],\n" +
            "        \"totalOriginalConsiderationItems\":1\n" +
            "    },\n" +
            "    \"primaryType\":\"OrderComponents\",\n" +
            "    \"types\":{\n" +
            "        \"EIP712Domain\":[\n" +
            "            {\n" +
            "                \"name\":\"name\",\n" +
            "                \"type\":\"string\"\n" +
            "            },\n" +
            "            {\n" +
            "                \"name\":\"version\",\n" +
            "                \"type\":\"string\"\n" +
            "            },\n" +
            "            {\n" +
            "                \"name\":\"chainId\",\n" +
            "                \"type\":\"uint256\"\n" +
            "            },\n" +
            "            {\n" +
            "                \"name\":\"verifyingContract\",\n" +
            "                \"type\":\"address\"\n" +
            "            }\n" +
            "        ],\n" +
            "        \"OrderComponents\":[\n" +
            "            {\n" +
            "                \"name\":\"offerer\",\n" +
            "                \"type\":\"address\"\n" +
            "            },\n" +
            "            {\n" +
            "                \"name\":\"zone\",\n" +
            "                \"type\":\"address\"\n" +
            "            },\n" +
            "            {\n" +
            "                \"name\":\"offer\",\n" +
            "                \"type\":\"OfferItem[]\"\n" +
            "            },\n" +
            "            {\n" +
            "                \"name\":\"consideration\",\n" +
            "                \"type\":\"ConsiderationItem[]\"\n" +
            "            },\n" +
            "            {\n" +
            "                \"name\":\"orderType\",\n" +
            "                \"type\":\"uint8\"\n" +
            "            },\n" +
            "            {\n" +
            "                \"name\":\"startTime\",\n" +
            "                \"type\":\"uint256\"\n" +
            "            },\n" +
            "            {\n" +
            "                \"name\":\"endTime\",\n" +
            "                \"type\":\"uint256\"\n" +
            "            },\n" +
            "            {\n" +
            "                \"name\":\"zoneHash\",\n" +
            "                \"type\":\"bytes32\"\n" +
            "            },\n" +
            "            {\n" +
            "                \"name\":\"salt\",\n" +
            "                \"type\":\"uint256\"\n" +
            "            },\n" +
            "            {\n" +
            "                \"name\":\"conduitKey\",\n" +
            "                \"type\":\"bytes32\"\n" +
            "            },\n" +
            "            {\n" +
            "                \"name\":\"counter\",\n" +
            "                \"type\":\"uint256\"\n" +
            "            }\n" +
            "        ],\n" +
            "        \"OfferItem\":[\n" +
            "            {\n" +
            "                \"name\":\"itemType\",\n" +
            "                \"type\":\"uint8\"\n" +
            "            },\n" +
            "            {\n" +
            "                \"name\":\"token\",\n" +
            "                \"type\":\"address\"\n" +
            "            },\n" +
            "            {\n" +
            "                \"name\":\"identifierOrCriteria\",\n" +
            "                \"type\":\"uint256\"\n" +
            "            },\n" +
            "            {\n" +
            "                \"name\":\"startAmount\",\n" +
            "                \"type\":\"uint256\"\n" +
            "            },\n" +
            "            {\n" +
            "                \"name\":\"endAmount\",\n" +
            "                \"type\":\"uint256\"\n" +
            "            }\n" +
            "        ],\n" +
            "        \"ConsiderationItem\":[\n" +
            "            {\n" +
            "                \"name\":\"itemType\",\n" +
            "                \"type\":\"uint8\"\n" +
            "            },\n" +
            "            {\n" +
            "                \"name\":\"token\",\n" +
            "                \"type\":\"address\"\n" +
            "            },\n" +
            "            {\n" +
            "                \"name\":\"identifierOrCriteria\",\n" +
            "                \"type\":\"uint256\"\n" +
            "            },\n" +
            "            {\n" +
            "                \"name\":\"startAmount\",\n" +
            "                \"type\":\"uint256\"\n" +
            "            },\n" +
            "            {\n" +
            "                \"name\":\"endAmount\",\n" +
            "                \"type\":\"uint256\"\n" +
            "            },\n" +
            "            {\n" +
            "                \"name\":\"recipient\",\n" +
            "                \"type\":\"address\"\n" +
            "            }\n" +
            "        ]\n" +
            "    }\n" +
            "}";
        let signature = eth.signMessage(MessageTypes.TYPE_DATA_V4, msg, base.fromHex(privateKey))
        Assert.strictEqual(signature, "0x66cc18bf698319d578566b8ed26bf5d59f7d2f880c4fae85e26e04c52203899c2f1bc4410bcd796d5c9398477e6cf44842d2ef0df77555a77a30cd93e274b6671b");
    });

    test("TYPE_DATA_V4_3", async () => {
        const privateKey = "a375a510fc9599102c1f4697581162ea4d431cd6c45877e55fc4a1c091ab378a";
        const msg = "{\"domain\":{\"name\":\"EtchMarket\",\"version\":\"1\",\"chainId\":1,\"verifyingContract\":\"0x57b8792c775d34aa96092400983c3e112fcbc296\"},\"primaryType\":\"EthscriptionOrder\",\"types\":{\"EIP712Domain\":[{\"name\":\"name\",\"type\":\"string\"},{\"name\":\"version\",\"type\":\"string\"},{\"name\":\"chainId\",\"type\":\"uint256\"},{\"name\":\"verifyingContract\",\"type\":\"address\"}],\"EthscriptionOrder\":[{\"name\":\"signer\",\"type\":\"address\"},{\"name\":\"creator\",\"type\":\"address\"},{\"name\":\"ethscriptionId\",\"type\":\"bytes32\"},{\"name\":\"quantity\",\"type\":\"uint256\"},{\"name\":\"currency\",\"type\":\"address\"},{\"name\":\"price\",\"type\":\"uint256\"},{\"name\":\"nonce\",\"type\":\"uint256\"},{\"name\":\"startTime\",\"type\":\"uint64\"},{\"name\":\"endTime\",\"type\":\"uint64\"},{\"name\":\"protocolFeeDiscounted\",\"type\":\"uint16\"},{\"name\":\"creatorFee\",\"type\":\"uint16\"},{\"name\":\"params\",\"type\":\"bytes\"}]},\"message\":{\"signer\":\"0x7bbc6cf96b7faa0c1f8acc9a5ab383fe8dc507bc\",\"creator\":\"0x57b8792c775d34aa96092400983c3e112fcbc296\",\"quantity\":\"1000\",\"ethscriptionId\":\"0x78e7b34c766c6a174340ef2687732b68649d2bd722351d2ef10de0ea23182ec5\",\"currency\":\"0x0000000000000000000000000000000000000000\",\"price\":\"1890000000000000\",\"nonce\":\"1\",\"startTime\":1696786756,\"endTime\":1699378756,\"protocolFeeDiscounted\":200,\"creatorFee\":0,\"params\":\"0x\"}}";
        let signature = eth.signMessage(MessageTypes.TYPE_DATA_V4, msg, base.fromHex(privateKey))
        Assert.strictEqual(signature, "0x3cc3098f5c463365c4308a087587cf51a4db71e52e32a14e61f6f7ac8f37876d70137a56da703421e036f9c7a5db089d3dc9d8787be339ad77ac3170bd00b51f1c");
    });

    test("TYPE_DATA_V1", async () => {
        const msgParams = [
            {
                type: "string",
                name: "Message",
                value: "Hi, Alice!"
            },
            {
                type: "uint32",
                name: "A number",
                value: "1337"
            }
        ];

        let signature = eth.signMessage(MessageTypes.TYPE_DATA_V1, JSON.stringify(msgParams), base.fromHex(privateKey))
        Assert.strictEqual(signature, "0x8596be6aeea3cdaba2685e430ad9db7f0425cea9a9c793f3fc8bf7f3fd11ddf31b953c7858731f7dca649ec3014903520e40e57103d52b80a054c4c44fe1c2521c");
    });

    test("TYPE_DATA_V3", async () => {
        const chainId = 42;
        const msgParams = {
            types: {
                EIP712Domain: [
                    { name: "name", type: "string" },
                    { name: "version", type: "string" },
                    { name: "chainId", type: "uint256" },
                    { name: "verifyingContract", type: "address" }
                ],
                Person: [
                    { name: "name", type: "string" },
                    { name: "wallet", type: "address" }
                ],
                Mail: [
                    { name: "from", type: "Person" },
                    { name: "to", type: "Person" },
                    { name: "contents", type: "string" }
                ]
            },
            primaryType: "Mail",
            domain: {
                name: "Ether Mail",
                version: "1",
                chainId,
                verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC"
            },
            message: {
                from: {
                    name: "Cow",
                    wallet: "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826"
                },
                to: {
                    name: "Bob",
                    wallet: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB"
                },
                contents: "Hello, Bob!"
            }
        };

        let signature = eth.signMessage(MessageTypes.TYPE_DATA_V3, JSON.stringify(msgParams), base.fromHex(privateKey))
        Assert.strictEqual(signature, "0x337e69d931591a9bae20b2d4c541804bb1b6fa32c8468a9007041b7ba63cb8a401cba4a7eb71f48e9eb586c8d80896e803275f979a530313fd647c72a806bc511c");
    });

    test("TYPE_DATA_V4_2", async () => {
        const privateKey = "0x808e50dd63f3749405dfb0ac9a965804a33919fb82c4676bb00ac435ead6b4e8";
        const msg = "{\n" +
            "    \"domain\":{\n" +
            "        \"chainId\":\"66\",\n" +
            "        \"name\":\"OKX_NFT\",\n" +
            "        \"version\":\"1.1\",\n" +
            "        \"verifyingContract\":\"0x34DF5c035e31c0edfd104f3EA83d9548F108Df56\"\n" +
            "    },\n" +
            "    \"message\":{\n" +
            "        \"startTime\":1667184663,\n" +
            "        \"endTime\":1667443863,\n" +
            "        \"orderType\":2,\n" +
            "        \"zone\":\"0xa472fAd4B6cAdFDEd63f7aE5BFEe6eCf4F08Ae95\",\n" +
            "        \"zoneHash\":\"0x0000000000000000000000000000000000000000000000000000000000000000\",\n" +
            "        \"salt\":\"52760315571824630\",\n" +
            "        \"conduitKey\":\"0x618Cf13c76c1FFC2168fC47c98453dCc6134F5c8888888888888888888888888\",\n" +
            "        \"counter\":\"0\",\n" +
            "        \"offerer\":\"0x12910188b68a7817a0592406f1ffe0c31676b417\",\n" +
            "        \"offer\":[\n" +
            "            {\n" +
            "                \"itemType\":1,\n" +
            "                \"token\":\"0x382bb369d343125bfb2117af9c149795c6c65c50\",\n" +
            "                \"identifierOrCriteria\":\"0\",\n" +
            "                \"startAmount\":\"1000000000000000\",\n" +
            "                \"endAmount\":\"1000000000000000\"\n" +
            "            }\n" +
            "        ],\n" +
            "        \"consideration\":[\n" +
            "            {\n" +
            "                \"itemType\":2,\n" +
            "                \"token\":\"0xf8b973fdf2e6f700a775aa94ff72180688b5a044\",\n" +
            "                \"identifierOrCriteria\":\"46201\",\n" +
            "                \"startAmount\":\"1\",\n" +
            "                \"endAmount\":\"1\",\n" +
            "                \"recipient\":\"0x12910188b68a7817a0592406f1ffe0c31676b417\"\n" +
            "            }\n" +
            "        ],\n" +
            "        \"totalOriginalConsiderationItems\":1\n" +
            "    },\n" +
            "    \"primaryType\":\"OrderComponents\",\n" +
            "    \"types\":{\n" +
            "        \"EIP712Domain\":[\n" +
            "            {\n" +
            "                \"name\":\"name\",\n" +
            "                \"type\":\"string\"\n" +
            "            },\n" +
            "            {\n" +
            "                \"name\":\"version\",\n" +
            "                \"type\":\"string\"\n" +
            "            },\n" +
            "            {\n" +
            "                \"name\":\"chainId\",\n" +
            "                \"type\":\"uint256\"\n" +
            "            },\n" +
            "            {\n" +
            "                \"name\":\"verifyingContract\",\n" +
            "                \"type\":\"address\"\n" +
            "            }\n" +
            "        ],\n" +
            "        \"OrderComponents\":[\n" +
            "            {\n" +
            "                \"name\":\"offerer\",\n" +
            "                \"type\":\"address\"\n" +
            "            },\n" +
            "            {\n" +
            "                \"name\":\"zone\",\n" +
            "                \"type\":\"address\"\n" +
            "            },\n" +
            "            {\n" +
            "                \"name\":\"offer\",\n" +
            "                \"type\":\"OfferItem[]\"\n" +
            "            },\n" +
            "            {\n" +
            "                \"name\":\"consideration\",\n" +
            "                \"type\":\"ConsiderationItem[]\"\n" +
            "            },\n" +
            "            {\n" +
            "                \"name\":\"orderType\",\n" +
            "                \"type\":\"uint8\"\n" +
            "            },\n" +
            "            {\n" +
            "                \"name\":\"startTime\",\n" +
            "                \"type\":\"uint256\"\n" +
            "            },\n" +
            "            {\n" +
            "                \"name\":\"endTime\",\n" +
            "                \"type\":\"uint256\"\n" +
            "            },\n" +
            "            {\n" +
            "                \"name\":\"zoneHash\",\n" +
            "                \"type\":\"bytes32\"\n" +
            "            },\n" +
            "            {\n" +
            "                \"name\":\"salt\",\n" +
            "                \"type\":\"uint256\"\n" +
            "            },\n" +
            "            {\n" +
            "                \"name\":\"conduitKey\",\n" +
            "                \"type\":\"bytes32\"\n" +
            "            },\n" +
            "            {\n" +
            "                \"name\":\"counter\",\n" +
            "                \"type\":\"uint256\"\n" +
            "            }\n" +
            "        ],\n" +
            "        \"OfferItem\":[\n" +
            "            {\n" +
            "                \"name\":\"itemType\",\n" +
            "                \"type\":\"uint8\"\n" +
            "            },\n" +
            "            {\n" +
            "                \"name\":\"token\",\n" +
            "                \"type\":\"address\"\n" +
            "            },\n" +
            "            {\n" +
            "                \"name\":\"identifierOrCriteria\",\n" +
            "                \"type\":\"uint256\"\n" +
            "            },\n" +
            "            {\n" +
            "                \"name\":\"startAmount\",\n" +
            "                \"type\":\"uint256\"\n" +
            "            },\n" +
            "            {\n" +
            "                \"name\":\"endAmount\",\n" +
            "                \"type\":\"uint256\"\n" +
            "            }\n" +
            "        ],\n" +
            "        \"ConsiderationItem\":[\n" +
            "            {\n" +
            "                \"name\":\"itemType\",\n" +
            "                \"type\":\"uint8\"\n" +
            "            },\n" +
            "            {\n" +
            "                \"name\":\"token\",\n" +
            "                \"type\":\"address\"\n" +
            "            },\n" +
            "            {\n" +
            "                \"name\":\"identifierOrCriteria\",\n" +
            "                \"type\":\"uint256\"\n" +
            "            },\n" +
            "            {\n" +
            "                \"name\":\"startAmount\",\n" +
            "                \"type\":\"uint256\"\n" +
            "            },\n" +
            "            {\n" +
            "                \"name\":\"endAmount\",\n" +
            "                \"type\":\"uint256\"\n" +
            "            },\n" +
            "            {\n" +
            "                \"name\":\"recipient\",\n" +
            "                \"type\":\"address\"\n" +
            "            }\n" +
            "        ]\n" +
            "    }\n" +
            "}";
        let signature = eth.signMessage(MessageTypes.TYPE_DATA_V4, msg, base.fromHex(privateKey))
        Assert.strictEqual(signature, "0x66cc18bf698319d578566b8ed26bf5d59f7d2f880c4fae85e26e04c52203899c2f1bc4410bcd796d5c9398477e6cf44842d2ef0df77555a77a30cd93e274b6671b");
    });

    test("TYPE_DATA_V4_3", async () => {
        const privateKey = "a375a510fc9599102c1f4697581162ea4d431cd6c45877e55fc4a1c091ab378a";
        const msg = "{\"domain\":{\"name\":\"EtchMarket\",\"version\":\"1\",\"chainId\":1,\"verifyingContract\":\"0x57b8792c775d34aa96092400983c3e112fcbc296\"},\"primaryType\":\"EthscriptionOrder\",\"types\":{\"EIP712Domain\":[{\"name\":\"name\",\"type\":\"string\"},{\"name\":\"version\",\"type\":\"string\"},{\"name\":\"chainId\",\"type\":\"uint256\"},{\"name\":\"verifyingContract\",\"type\":\"address\"}],\"EthscriptionOrder\":[{\"name\":\"signer\",\"type\":\"address\"},{\"name\":\"creator\",\"type\":\"address\"},{\"name\":\"ethscriptionId\",\"type\":\"bytes32\"},{\"name\":\"quantity\",\"type\":\"uint256\"},{\"name\":\"currency\",\"type\":\"address\"},{\"name\":\"price\",\"type\":\"uint256\"},{\"name\":\"nonce\",\"type\":\"uint256\"},{\"name\":\"startTime\",\"type\":\"uint64\"},{\"name\":\"endTime\",\"type\":\"uint64\"},{\"name\":\"protocolFeeDiscounted\",\"type\":\"uint16\"},{\"name\":\"creatorFee\",\"type\":\"uint16\"},{\"name\":\"params\",\"type\":\"bytes\"}]},\"message\":{\"signer\":\"0x7bbc6cf96b7faa0c1f8acc9a5ab383fe8dc507bc\",\"creator\":\"0x57b8792c775d34aa96092400983c3e112fcbc296\",\"quantity\":\"1000\",\"ethscriptionId\":\"0x78e7b34c766c6a174340ef2687732b68649d2bd722351d2ef10de0ea23182ec5\",\"currency\":\"0x0000000000000000000000000000000000000000\",\"price\":\"1890000000000000\",\"nonce\":\"1\",\"startTime\":1696786756,\"endTime\":1699378756,\"protocolFeeDiscounted\":200,\"creatorFee\":0,\"params\":\"0x\"}}";
        let signature = eth.signMessage(MessageTypes.TYPE_DATA_V4, msg, base.fromHex(privateKey))
        Assert.strictEqual(signature, "0x3cc3098f5c463365c4308a087587cf51a4db71e52e32a14e61f6f7ac8f37876d70137a56da703421e036f9c7a5db089d3dc9d8787be339ad77ac3170bd00b51f1c");
    });

    test("TYPE_DATA_V1", async () => {
        const msgParams = [
            {
                type: "string",
                name: "Message",
                value: "Hi, Alice!"
            },
            {
                type: "uint32",
                name: "A number",
                value: "1337"
            }
        ];

        let signature = eth.signMessage(MessageTypes.TYPE_DATA_V1, JSON.stringify(msgParams), base.fromHex(privateKey))
        Assert.strictEqual(signature, "0x8596be6aeea3cdaba2685e430ad9db7f0425cea9a9c793f3fc8bf7f3fd11ddf31b953c7858731f7dca649ec3014903520e40e57103d52b80a054c4c44fe1c2521c");
    });

    test("TYPE_DATA_V3_MPC", async () => {
        const chainId = 42;
        const msgParams = {
            types: {
                EIP712Domain: [
                    { name: "name", type: "string" },
                    { name: "version", type: "string" },
                    { name: "chainId", type: "uint256" },
                    { name: "verifyingContract", type: "address" }
                ],
                Person: [
                    { name: "name", type: "string" },
                    { name: "wallet", type: "address" }
                ],
                Mail: [
                    { name: "from", type: "Person" },
                    { name: "to", type: "Person" },
                    { name: "contents", type: "string" }
                ]
            },
            primaryType: "Mail",
            domain: {
                name: "Ether Mail",
                version: "1",
                chainId,
                verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC"
            },
            message: {
                from: {
                    name: "Cow",
                    wallet: "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826"
                },
                to: {
                    name: "Bob",
                    wallet: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB"
                },
                contents: "Hello, Bob!"
            }
        };

        let msgHash = eth.signMessage(MessageTypes.TYPE_DATA_V3, JSON.stringify(msgParams), undefined)
        const {v, r, s} = ecdsaSign(base.fromHex(msgHash), base.fromHex(privateKey))
        const result = makeSignature(v, r, s)
        Assert.strictEqual(result, "0x337e69d931591a9bae20b2d4c541804bb1b6fa32c8468a9007041b7ba63cb8a401cba4a7eb71f48e9eb586c8d80896e803275f979a530313fd647c72a806bc511c");
    });

    test("TYPE_DATA_V4_3_MPC", async () => {
        const privateKey = "a375a510fc9599102c1f4697581162ea4d431cd6c45877e55fc4a1c091ab378a";
        const msg = "{\"domain\":{\"name\":\"EtchMarket\",\"version\":\"1\",\"chainId\":1,\"verifyingContract\":\"0x57b8792c775d34aa96092400983c3e112fcbc296\"},\"primaryType\":\"EthscriptionOrder\",\"types\":{\"EIP712Domain\":[{\"name\":\"name\",\"type\":\"string\"},{\"name\":\"version\",\"type\":\"string\"},{\"name\":\"chainId\",\"type\":\"uint256\"},{\"name\":\"verifyingContract\",\"type\":\"address\"}],\"EthscriptionOrder\":[{\"name\":\"signer\",\"type\":\"address\"},{\"name\":\"creator\",\"type\":\"address\"},{\"name\":\"ethscriptionId\",\"type\":\"bytes32\"},{\"name\":\"quantity\",\"type\":\"uint256\"},{\"name\":\"currency\",\"type\":\"address\"},{\"name\":\"price\",\"type\":\"uint256\"},{\"name\":\"nonce\",\"type\":\"uint256\"},{\"name\":\"startTime\",\"type\":\"uint64\"},{\"name\":\"endTime\",\"type\":\"uint64\"},{\"name\":\"protocolFeeDiscounted\",\"type\":\"uint16\"},{\"name\":\"creatorFee\",\"type\":\"uint16\"},{\"name\":\"params\",\"type\":\"bytes\"}]},\"message\":{\"signer\":\"0x7bbc6cf96b7faa0c1f8acc9a5ab383fe8dc507bc\",\"creator\":\"0x57b8792c775d34aa96092400983c3e112fcbc296\",\"quantity\":\"1000\",\"ethscriptionId\":\"0x78e7b34c766c6a174340ef2687732b68649d2bd722351d2ef10de0ea23182ec5\",\"currency\":\"0x0000000000000000000000000000000000000000\",\"price\":\"1890000000000000\",\"nonce\":\"1\",\"startTime\":1696786756,\"endTime\":1699378756,\"protocolFeeDiscounted\":200,\"creatorFee\":0,\"params\":\"0x\"}}";
        let msgHash = eth.signMessage(MessageTypes.TYPE_DATA_V4, msg, undefined)
        const {v, r, s} = ecdsaSign(base.fromHex(msgHash), base.fromHex(privateKey))
        const result = makeSignature(v, r, s)
        Assert.strictEqual(result, "0x3cc3098f5c463365c4308a087587cf51a4db71e52e32a14e61f6f7ac8f37876d70137a56da703421e036f9c7a5db089d3dc9d8787be339ad77ac3170bd00b51f1c");
    });

    test("TYPE_DATA_V1_MPC", async () => {
        const msgParams = [
            {
                type: "string",
                name: "Message",
                value: "Hi, Alice!"
            },
            {
                type: "uint32",
                name: "A number",
                value: "1337"
            }
        ];

        let msgHash = eth.signMessage(MessageTypes.TYPE_DATA_V1, JSON.stringify(msgParams), undefined)
        const {v, r, s} = ecdsaSign(base.fromHex(msgHash), base.fromHex(privateKey))
        const result = makeSignature(v, r, s)
        Assert.strictEqual(result, "0x8596be6aeea3cdaba2685e430ad9db7f0425cea9a9c793f3fc8bf7f3fd11ddf31b953c7858731f7dca649ec3014903520e40e57103d52b80a054c4c44fe1c2521c");
    });

    test("ETH_SIGN_MPC", async () => {
        let expected = "0xa4a11b0526c248576756292f420f3cf4c5bb744a8491f8c1a33838b95f401aed7afe88e296edf246291e3f9fcd125a7fe795c76ab118d5abb97421e1f03fa36f1b";
        const msgHash = eth.signMessage(MessageTypes.ETH_SIGN, "0x879a053d4800c6354e76c7985a865d2922c82fb5b3f4577b2fe08b998954f2e0")
        const {v, r, s} = ecdsaSign(base.fromHex(msgHash), base.fromHex(privateKey))
        const result = makeSignature(v, r, s)
        Assert.strictEqual(result, expected);
    });

    test("PERSONAL_SIGN", async () => {
        let expected = "0xbf0c8d5f1a1519a24fe3d717c54d3a69265e1afe8935808d7f79fc8eded79c095ab3d54a9df224331da76ffd5db3a1393dfc805ba9bbcfecf8eaeabdfa2e1f3d1b";
        const msgHash = eth.signMessage(MessageTypes.PERSONAL_SIGN, "0x4578616d706c652060706572736f6e616c5f7369676e60206d657373616765")
        const {v, r, s} = ecdsaSign(base.fromHex(msgHash), base.fromHex("0x5127a0b292a7fbe02c382e373f113102931c2b514e93360e60c574d340e7f390"))
        const result = makeSignature(v, r, s)
        Assert.strictEqual(result, expected);
    });
});