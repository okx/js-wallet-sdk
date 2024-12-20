import {signUtil} from "@okxweb3/crypto-lib";
import {
    Account,
    CalculateContractAddressFromHash,
    Call,
    CreateContractCall,
    CreateMultiContractCall,
    CreateSignedDeployAccountTx,
    CreateTransferTx,
    ec,
    GetRandomPrivateKey,
    hash,
    json,
    modPrivateKey,
    signMessageWithTypeData,
    StarknetWallet,
    typedData,
    verifyMessage
} from "../src"
import {TypedData} from '../src/utils/typedData';
import {ETH, ETHBridge, StarknetChainId} from '../src/constants';
import {encodeShortString} from "../src/utils/shortString";
import assert from "assert";


describe("tx", () => {

    const DEFAULT_TEST_ACCOUNT_ADDRESS =
        '0x7e00d496e324876bbc8531f2d9a82bf154d1a04a50218ee74cdd372f75a551a';
    const DEFAULT_TEST_ACCOUNT_PRIVATE_KEY = '0xe3e70682c2094cac629f6fbed82c07cd';

    const privateKey = "0x0603c85d20500520d4c653352ff6c524f358afeab7e41a511c73733e49c3075e";
    const address = "0x6c3c93eeb1643740a80a338b9346c0c9a06177bfcc098a6d86e353532090ae4";

    test('randomKey', async () => {
        const pri = await GetRandomPrivateKey();
        console.log(pri)
        const wallet = new StarknetWallet();
        const p = await wallet.getRandomPrivateKey();
        expect((await wallet.validPrivateKey({privateKey:p})).isValid).toEqual(true);
    })

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
        const wallet = new StarknetWallet();
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
        const wallet = new StarknetWallet();
        const privateKey = await wallet.getRandomPrivateKey();
        const res = await wallet.validPrivateKey({privateKey:privateKey});
        expect(res.isValid).toEqual(true);
    });

    test('getNewAddress', async () => {
        const privateKey = "49c0722d56d6bac802bdf5c480a17c870d1d18bc4355d8344aa05390eb778280";
        const wallet = new StarknetWallet();
        const expectedAddress = "0x05b0563ae63a7ba9929129f5117bcbcbe552b7cc8cf81c806d343e2de7f3d555";
        expect((await wallet.getNewAddress({privateKey: privateKey})).address).toEqual(expectedAddress);
        expect((await wallet.getNewAddress({privateKey: '0x'+privateKey})).address).toEqual(expectedAddress);
        expect((await wallet.getNewAddress({privateKey: '0X'+privateKey})).address).toEqual(expectedAddress);
        expect((await wallet.getNewAddress({privateKey: '0X'+privateKey.toUpperCase()})).address).toEqual(expectedAddress);

        expect((await wallet.validPrivateKey({privateKey:privateKey})).isValid).toEqual(true);
        expect((await wallet.validPrivateKey({privateKey: '0x'+privateKey})).isValid).toEqual(true);
        expect((await wallet.validPrivateKey({privateKey: '0X'+privateKey})).isValid).toEqual(true);
        expect((await wallet.validPrivateKey({privateKey: '0X'+privateKey.toUpperCase()})).isValid).toEqual(true);
    })

    test("signCommonMsg", async () => {
        const wallet = new StarknetWallet();
        let sig = await wallet.signCommonMsg({privateKey:"0x0028e2e382f4e68b24154142dece87d03b6214a34834aede41e100848826c16b",message:{walletId:"12345678901234567890"}});
        let address = await wallet.getNewAddress({privateKey:"0x0028e2e382f4e68b24154142dece87d03b6214a34834aede41e100848826c16b"});
        let addr = address.address;
        let publicKey = address.publicKey;
        let chainIndex = 9004;
        let coinName = "starknet"
        let actual = `{"coin_name":"${coinName}","data":"{\\"pubKey\\":\\"${publicKey}\\",\\"name\\":\\"Account 01\\",\\"walletType\\":1,\\"accountId\\":\\"123456789\\",\\"addresses\\":[{\\"address\\":\\"${addr}\\",\\"chainPubKey\\":\\"${publicKey}\\",\\"chainSign\\":\\"${sig}\\"}\\",\\"chainIndexList\\":[${chainIndex}]}]}","func_name":"verify_web_data"}`;
        let expect = `{"coin_name":"starknet","data":"{\\"pubKey\\":\\"0x1a78bff4c0b69619fe061f540c6fd89f8c33a0364970c77334aa558ed7fce55\\",\\"name\\":\\"Account 01\\",\\"walletType\\":1,\\"accountId\\":\\"123456789\\",\\"addresses\\":[{\\"address\\":\\"0x027854ed5aa9f534c7aa0165c89b3915bc461f70e64ce9d64f4e2549037ebcf2\\",\\"chainPubKey\\":\\"0x1a78bff4c0b69619fe061f540c6fd89f8c33a0364970c77334aa558ed7fce55\\",\\"chainSign\\":\\"7b227075626c69634b6579223a22316137386266663463306236393631396665303631663534306336666438396638633333613033363439373063373733333461613535386564376663653535222c227075626c69634b657959223a22373063663835626131376161363562346665633664643439613631333337633362313864383937363664376366663736636365623732653839383838636564222c227369676e65644461746152223a22333930643230663831313237353965393265323636346463613762616632663964396233653034356535613837663934613231656134633734613830343132222c227369676e65644461746153223a22356132383265343163643936306361313533393337336366646130373262616661356232333861356433623738663237373631383765643565336530316564227d\\"}\\",\\"chainIndexList\\":[9004]}]}","func_name":"verify_web_data"}`
        assert.strictEqual(actual, expect);

        sig = await wallet.signCommonMsg({privateKey:"0x0028e2e382f4e68b24154142dece87d03b6214a34834aede41e100848826c16b",message:{text:"12345678901234567890"}});
        expect="7b227075626c69634b6579223a22316137386266663463306236393631396665303631663534306336666438396638633333613033363439373063373733333461613535386564376663653535222c227075626c69634b657959223a22373063663835626131376161363562346665633664643439613631333337633362313864383937363664376366663736636365623732653839383838636564222c227369676e65644461746152223a22346232386562306535326661663063623734373736336362633765613533666166643863663035386366353834623462383239333335666666636362633366222c227369676e65644461746153223a22363763313665666439666564386630343337663035633033386262303833396136396333376630373834333938613233626466626266323337326637383237227d";
        assert.strictEqual(sig, expect);
    })

    test("signMessage", async () => {
        const typedDataValidate: TypedData = {
            types: {
                StarkNetDomain: [
                    {name: "name", type: "string"},
                    {name: "version", type: "felt"},
                    {name: "chainId", type: "felt"},
                ],
                Airdrop: [
                    {name: "address", type: "felt"},
                    {name: "amount", type: "felt"}
                ],
                Validate: [
                    {name: "id", type: "felt"},
                    {name: "from", type: "felt"},
                    {name: "amount", type: "felt"},
                    {name: "nameGamer", type: "string"},
                    {name: "endDate", type: "felt"},
                    {name: "itemsAuthorized", type: "felt*"}, // array of felt
                    {name: "chkFunction", type: "selector"}, // name of function
                    {name: "rootList", type: "merkletree", contains: "Airdrop"} // root of a merkle tree
                ]
            },
            primaryType: "Validate",
            domain: {
                name: "myDapp", // put the name of your dapp to ensure that the signatures will not be used by other DAPP
                version: "1",
                chainId: encodeShortString("SN_GOERLI"), // shortString of 'SN_GOERLI' (or 'SN_MAIN' or 'SN_GOERLI2'), to be sure that signature can't be used by other network.
            },
            message: {
                id: "0x0000004f000f",
                from: "0x2c94f628d125cd0e86eaefea735ba24c262b9a441728f63e5776661829a4066",
                amount: "400",
                nameGamer: "Hector26",
                endDate: "0x27d32a3033df4277caa9e9396100b7ca8c66a4ef8ea5f6765b91a7c17f0109c",
                itemsAuthorized: ["0x01", "0x03", "0x0a", "0x0e"],
                chkFunction: "check_authorization",
                rootList: [
                    {
                        address: "0x69b49c2cc8b16e80e86bfc5b0614a59aa8c9b601569c7b80dde04d3f3151b79",
                        amount: "1554785",
                    }, {
                        address: "0x7447084f620ba316a42c72ca5b8eefb3fe9a05ca5fe6430c65a69ecc4349b3b",
                        amount: "2578248",
                    }, {
                        address: "0x3cad9a072d3cf29729ab2fad2e08972b8cfde01d4979083fb6d15e8e66f8ab1",
                        amount: "4732581",
                    }, {
                        address: "0x7f14339f5d364946ae5e27eccbf60757a5c496bf45baf35ddf2ad30b583541a",
                        amount: "913548",
                    },
                ]
            },
        };

        let sig = await signMessageWithTypeData(typedDataValidate, privateKey);
        console.log(sig)
        const publicKey = signUtil.schnorr.stark.getPublicKey(privateKey);
        expect(verifyMessage(sig.signature, sig.hash, publicKey)).toEqual(true)
    });

    test("transfer", async () => {
        const from = "0x6c3c93eeb1643740a80a338b9346c0c9a06177bfcc098a6d86e353532090ae4";
        const to = "0x026e9E8c411056B64B2D044EBCb39FC810D652Cfbe694326651d796BB078320b";
        const amount = 1700000000000000n;
        const maxFee = 14000000000000n;
        const nonce = 1n;
        const chainId = StarknetChainId.SN_MAIN;

        const tx = await CreateTransferTx(ETH, from, to, amount, nonce, maxFee, chainId, privateKey);
        console.log(tx.signature)
        console.log(tx.txId)
        expect(tx.signature).toEqual("{\"type\":\"INVOKE_FUNCTION\",\"sender_address\":\"0x6c3c93eeb1643740a80a338b9346c0c9a06177bfcc098a6d86e353532090ae4\",\"calldata\":[\"1\",\"2087021424722619777119509474943472645767659996348769578120564519014510906823\",\"232670485425082704932579856502088130646006032362877466777181098476241604910\",\"0\",\"3\",\"3\",\"1100073131459501680801927467743186870973801404098697873181544877894944698891\",\"1700000000000000\",\"0\"],\"max_fee\":\"0xcbba106e000\",\"signature\":[\"2046726132177223766402968530695733227169557314964382677711945876686369864286\",\"1790217669415917429705589389033333595673730480755481198246314553747591090991\"],\"version\":\"0x1\",\"nonce\":\"0x1\"}")
    })

    test("deploy", async () => {
        const account = new Account(DEFAULT_TEST_ACCOUNT_ADDRESS, DEFAULT_TEST_ACCOUNT_PRIVATE_KEY);
        let test = await account.deploy({
            classHash: "0x54328a1075b8820eb43caf0caa233923148c983742402dcfc38541dd843d01a",
            constructorCalldata: [
                encodeShortString('Token'),
                encodeShortString('ERC20'),
                account.address,
            ],
            salt: '1',
        }, {
            nonce: 1n,
            chainId: StarknetChainId.SN_GOERLI,
            maxFee: 954500000000000n,
        });
        console.log(json.stringify(test))
    })

    test("deploy account", async () => {
        const nonce = 0n;
        const chainId = StarknetChainId.SN_MAIN;
        const maxFee = 124621882791072n;
        const tx = await CreateSignedDeployAccountTx(nonce, maxFee, chainId, privateKey);
        console.log(tx.txId)
        console.log(tx.signature)
        expect(tx.signature).toEqual("{\"type\":\"DEPLOY_ACCOUNT\",\"contract_address_salt\":\"0x2f4a65ecea5351f49f181841bdddcdf62f600d0e4864755699386d42dd17e37\",\"constructor_calldata\":[\"1374167106255892599010711965180388247554893597343032596700351269194389035468\",\"215307247182100370520050591091822763712463273430149262739280891880522753123\",\"2\",\"1336884626863307009745693974738944585680195300936188147148938838915943595575\",\"0\"],\"class_hash\":\"0x3530cc4759d78042f1b543bf797f5f3d647cde0388c33734cf91b7f7b9314a9\",\"max_fee\":\"0x7157cb0e14a0\",\"version\":\"0x1\",\"nonce\":\"0x0\",\"signature\":[\"1743576707672350586938093874140587768903567601625974071199004868774070770998\",\"2517494932084439140630351310818252639109372374885508507240315248980355503830\"]}")
    })

    test("contractCall", async () => {
        const from = "0x06c3c93eeb1643740a80a338b9346c0c9a06177bfcc098a6d86e353532090ae4";
        const functionName = "initiate_withdraw";
        const calldata = ["0x62e206b4ddd402056d881ded58c0bd87193d2913", "0x38d7ea4c68000", "0"];

        const maxFee = 1864315586779310;
        const nonce = 2n;
        const chainId = StarknetChainId.SN_MAIN;

        const tx = await CreateContractCall(ETHBridge, from, functionName, calldata, nonce, maxFee, chainId, privateKey);
        console.log(tx.txId)
        console.log(tx.signature)
        expect(tx.signature).toEqual("{\"type\":\"INVOKE_FUNCTION\",\"sender_address\":\"0x06c3c93eeb1643740a80a338b9346c0c9a06177bfcc098a6d86e353532090ae4\",\"calldata\":[\"1\",\"3256441166037631918262930812410838598500200462657642943867372734773841898370\",\"403823062618199777388530751713272716715733872218085068081490028803159187238\",\"0\",\"3\",\"3\",\"564521648175006025532572708057195208089056127251\",\"1000000000000000\",\"0\"],\"max_fee\":\"0x69f95cc4c98ae\",\"signature\":[\"847473586541842316388942211795213889856494548988837959760160024500693390782\",\"1348638286841361823893095410439312197628401195006599391371680622656774652575\"],\"version\":\"0x1\",\"nonce\":\"0x2\"}");
    })

    test("multiContractCall", async () => {
        const from = "0x04f46d2B784A75d85163364930c941116664f272c8b96D70491dB228B1d20daa";
        const maxFee = "1864315586779310";
        const nonce = "2";
        const chainId = StarknetChainId.SN_GOERLI;

        const calls: Call[] = [
            {
                calldata: ["0x026e9E8c411056B64B2D044EBCb39FC810D652Cfbe694326651d796BB078320b", "0x38d7ea4c68000", "0"],
                contractAddress: ETH,
                entrypoint: "0x83afd3f4caedc6eebf44246fe54e38c95e3179a5ec9ea81740eca5b482d12e"
            },
            {
                calldata: ["0x004eb36472e15019967568f5D09eAF985e4CaC8Cce3CD6c1930841442270A582", "0x38d7ea4c68000", "0"],
                contractAddress: ETH,
                entrypoint: "0x83afd3f4caedc6eebf44246fe54e38c95e3179a5ec9ea81740eca5b482d12e"
            },
        ]
        const tx = await CreateMultiContractCall(from, calls, nonce, maxFee, chainId, "0x0603c85d20500520d4c653352ff6c524f358afeab7e41a511c73733e49c3075e");
        console.log(tx.txId)
        console.log(tx.signature)
    })
})

describe('utils()', () => {

    // This test just show how to use calculateContractAddressFromHash for new devs
    test('calculated contract address should match the snapshot', () => {
        const ethAddress = '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7';

        const daiAddress = '0x03e85bfbb8e2a42b7bead9e88e9a1b19dbccf661471061807292120462396ec9';
        const factoryAddress = '0x249827618A01858A72B7D04339C47195A324D20D6037033DFE2829F98AFF4FC';
        const classHash = '0x55187E68C60664A947048E0C9E5322F9BF55F7D435ECDCF17ED75724E77368F';

        // Any type of salt can be used. It depends on the dApp what kind of salt it wants to use.
        const salt = ec.starkCurve.pedersen(ethAddress, daiAddress);

        const res = hash.calculateContractAddressFromHash(
            salt,
            classHash,
            [ethAddress, daiAddress, factoryAddress],
            factoryAddress
        );

        expect(res).toMatchInlineSnapshot(
            `"0x36dc8dcb3440596472ddde11facacc45d0cd250df764ae7c3d1a360c853c324"`
        );
    });

    test("calculateContractAddressFromHash", async () => {
        const privateKey = "0x0603c85d20500520d4c653352ff6c524f358afeab7e41a511c73733e49c3075e";
        const starkPub = ec.starkCurve.getStarkKey(privateKey);

        const contractAddress = CalculateContractAddressFromHash(starkPub)
        console.log(contractAddress)
        expect(contractAddress).toEqual("0x06c3c93eeb1643740a80a338b9346c0c9a06177bfcc098a6d86e353532090ae4")
    })

    test("hashMessage", async () => {
        const data = {
            "types": {
                "StarkNetDomain": [
                    {"name": "name", "type": "felt"},
                    {"name": "version", "type": "felt"},
                    {"name": "chainId", "type": "felt"}
                ],
                "Person": [
                    {"name": "name", "type": "felt"},
                    {"name": "wallet", "type": "felt"}
                ],
                "Mail": [
                    {"name": "from", "type": "Person"},
                    {"name": "to", "type": "Person"},
                    {"name": "contents", "type": "felt"}
                ]
            },
            "primaryType": "Mail",
            "domain": {
                "name": "StarkNet Mail",
                "version": "1",
                "chainId": "1"
            },
            "message": {
                "contents": "Hello, Bob!",
                "from": {
                    "name": "Cow",
                    "wallet": "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826"
                },
                "to": {
                    "name": "Bob",
                    "wallet": "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB"
                }

            }
        };
        const hash = typedData.getMessageHash(data, "0x0603c85d20500520d4c653352ff6c524f358afeab7e41a511c73733e49c3075e");
        console.log(hash)
        expect(hash).toEqual("0x113fceee9332ec6033c52ec5203629edd345120fd5f8bcacb68df848fe8f51e")
    })

    test('modPrivateKey', () => {
        const pri = "0x800000000000010ffffffffffffffffb781126dcae7b2321e66a241adc64d2f";
        const res1 = modPrivateKey(pri);
        console.log(res1);
        expect(res1).toEqual("0x0");

        const pri2 = "0x800000000000010ffffffffffffffffb781126dcae7b2321e66a241adc64d3f";
        const res2 = modPrivateKey(pri2);
        console.log(res2)
        expect(res2).toEqual("0x10")

        const pri3 = "0x800000000000010ffffffffffffffffb781126dcae7b2321e66a241adc64d2e";
        const res3 = modPrivateKey(pri3);
        console.log(res3)
        expect(res3).toEqual("0x800000000000010ffffffffffffffffb781126dcae7b2321e66a241adc64d2e")

        const pri4 = "800000000000010ffffffffffffffffb781126dcae7b2321e66a241adc64d2e";
        const res4 = modPrivateKey(pri3);
        console.log(res4)
        expect(res4).toEqual("0x800000000000010ffffffffffffffffb781126dcae7b2321e66a241adc64d2e")
    })
});