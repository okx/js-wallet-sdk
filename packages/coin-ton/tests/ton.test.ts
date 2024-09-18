import {ApiTonConnectProof, TonWallet, VenomWallet} from "../src";
import {
    generateMnemonic,
    isPasswordNeeded,
    mnemonicToKeyPair,
    mnemonicToSeed,
    validateMnemonic
} from "tonweb-mnemonic";
import {base} from "@okxweb3/crypto-lib";

const tonWallet = new TonWallet();
const venomWallet = new VenomWallet();

describe("ton", () => {
    const timeoutAtSeconds = Math.floor(Date.now() / 1e3) + 600;
    // const timeoutAtSeconds = 1718863283n;
    test("derive seed", async () => {
        const seed = await tonWallet.getDerivedPrivateKey({
            // bip39 mnemonic or ton official mnemonic
            mnemonic: "muscle chest cereal often muscle right melt depend deny insect taste hungry expire feel cream grow aerobic build all patrol cloud garden fly emerge",
            // hdPath: "m/44'/607'/0'", // for bip39 mnemonic
            hdPath: "", // for ton official mnemonic
        });
        expect(seed).toBe("4789815d45fcf0a79083b0adaec3b5f0d02e948056c1cfde174327c3ee93ed35");
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
        const wallet = new TonWallet();
        let j = 1;
        for (let i = 0; i < ps.length; i++) {
            let param = {privateKey: ps[i]};
            try {
                await wallet.getNewAddress(param);
            } catch (e) {
                j = j + 1
            }
            expect(ps[i]).toEqual(param.privateKey)
        }
        expect(j).toEqual(ps.length + 1);
    });

    test("validPrivateKey", async () => {
        const wallet = new TonWallet();
        const privateKey = await wallet.getRandomPrivateKey();
        const res = await wallet.validPrivateKey({privateKey: privateKey});
        expect(res.isValid).toEqual(true);
    });

    test("validateMnemonicOfTon", async () => {
        const validateMnemonicOfTon = await tonWallet.validateMnemonicOfTon({
            mnemonicArray: "blade diet curious room evil acoustic check perfect length slot cage waste".split(' '),
            password: ''
        });
        expect(validateMnemonicOfTon).toBe(false);
    });

    test("ton getNewAddress", async () => {
        const seed = "0x4789815d45fcf0a79083b0adaec3b5f0d02e948056c1cfde174327c3ee93ed35";
        let result = await tonWallet.getNewAddress({privateKey: seed});
        expect(result.address).toBe("UQDLXrWjVfOnob2tHvCchfh1XVw9rD8RhiCLgxJrlkBNoYS7");
    });

    test("ton validateAddress", async () => {
        let result = await tonWallet.validAddress({address: "0:a341adb1b38974d70bd09eb5a5e3a072f6f32ecbd706c9c2e873ba60b7cb32fb"});
        /*const expectedRaw = {
            address: "EQCjQa2xs4l01wvQnrWl46By9Muy9cGycLoc7pgt8sy-wUL",
            isRaw: true,
            isValid: true
        }*/
        expect(result.isValid).toEqual(true);
        result = await tonWallet.validAddress({address: "EQCjQa2xs4l01wvQnrWl46By9vMuy9cGycLoc7pgt8sy-wUL"});
        /*const expectedRaw = {
            isBounceable: true,
            isTestOnly: false,
            isUrlSafe: true,
            address: EQCjQa2xs4l01wvQnrWl46By9vMuy9cGycLoc7pgt8sy-wUL,
            isUserFriendly: true,
            isValid: true
        }*/
        expect(result.isValid).toEqual(true);
        expect(result.isUrlSafe).toEqual(true);
        result = await tonWallet.validAddress({address: "UQC6QJ31Bv/hjmsoaUjRmpZYqj9NXbBbvufCNycnc0gjReqR"});
        /*const expectedRaw = {
            isBounceable: true,
            isTestOnly: false,
            isUrlSafe: false,
            address: EQCjQa2xs4l01wvQnrWl46By9vMuy9cGycLoc7pgt8sy-wUL,
            isUserFriendly: true,
            isValid: true
        }*/
        expect(result.isValid).toEqual(true);
        expect(result.isUrlSafe).toEqual(false);
    });

    test("ton parseAddress", async () => {
        let result = await tonWallet.parseAddress({address: "UQC6QJ31Bv_hjmsoaUjRmpZYqj9NXbBbvufCNycnc0gjReqR"});
        expect(result.isValid).toBe(true);
        result = await tonWallet.parseAddress({address: "0:6bef7d76e46fd1f308f0bf0b59f1ca6318aa6d950ea00aecc7d162218acaaa36"});
        expect(result.isValid).toBe(true);
    });

    test("ton convertAddress", async () => {
        const expected = {
            raw: '0:ba409df506ffe18e6b286948d19a9658aa3f4d5db05bbee7c237272773482345',
            addrBounceable: {
                bounceable: true,
                urlSafe: true,
                userFriendlyBounceable: 'EQC6QJ31Bv_hjmsoaUjRmpZYqj9NXbBbvufCNycnc0gjRbdU'
            },
            addrUnounceable: {
                bounceable: false,
                urlSafe: true,
                userFriendlyUnbounceable: 'UQC6QJ31Bv_hjmsoaUjRmpZYqj9NXbBbvufCNycnc0gjReqR'
            }
        };
        let result = await tonWallet.convertAddress({address: "UQC6QJ31Bv_hjmsoaUjRmpZYqj9NXbBbvufCNycnc0gjReqR"});
        expect(result).toEqual(expected);
        result = await tonWallet.convertAddress({address: "EQC6QJ31Bv_hjmsoaUjRmpZYqj9NXbBbvufCNycnc0gjRbdU"});
        expect(result).toEqual(expected);
        result = await tonWallet.convertAddress({address: "0:ba409df506ffe18e6b286948d19a9658aa3f4d5db05bbee7c237272773482345"});
        expect(result).toEqual(expected);
    });

    test("ton signTransaction", async () => {
        const param = {
            privateKey: "4789815d45fcf0a79083b0adaec3b5f0d02e948056c1cfde174327c3ee93ed35",
            data: {
                type: "transfer", // type of TON transfer
                to: "EQA3_JIJKDC0qauDUEQe2KjQj1iLwQRtrEREzmfDxbCKw9Kr", // destination address
                decimal: 9, // decimal on ton blockchain
                amount: "10000000", // decimal of TON is 9 on ton blockchain, so that here real value is 0.01
                seqno: 14, // nonce or sequence of from address
                toIsInit: true, // destination address init or not
                memo: "ton test", // comment for this tx
                expireAt: timeoutAtSeconds, // timeout at seconds eg, 1718863283n, default now + 60s
                /**
                 * export enum SendMode {
                 *     CARRY_ALL_REMAINING_BALANCE = 128,
                 *     CARRY_ALL_REMAINING_INCOMING_VALUE = 64,
                 *     DESTROY_ACCOUNT_IF_ZERO = 32,
                 *     PAY_GAS_SEPARATELY = 1,
                 *     IGNORE_ERRORS = 2,
                 *     NONE = 0
                 * }
                 */
                sendMode: 1,
            },
        };
        const tx = await tonWallet.signTransaction(param);
        console.log(tx);
    });

    test("ton jetton signTransaction", async () => {
        const param = {
            privateKey: "4789815d45fcf0a79083b0adaec3b5f0d02e948056c1cfde174327c3ee93ed35",
            data: {
                type: "jettonTransfer", // type of jetton TOKEN transfer
                // jetton wallet address of from address
                fromJettonAccount: "kQDL9sseMzrh4vewfQgZKJzVwDFbDTpbs2f8BY6iCMgRTyOG",
                to: "UQDXgyxgYKNSdTiJBqmNNfbD7xuRMl6skrBmsEtyXslFm5an",
                seqno: 15, // nonce or sequence of from address
                toIsInit: false, // destination address init or not
                memo: "jetton test", // comment for this tx
                decimal: 2, // decimal of jetton TOKEN on ton blockchain
                amount: "100", // decimal of TOKEN is 2 on ton blockchain, so that here real value is 1
                messageAttachedTons: "50000000", // message fee, default 0.05, here is 0.05 * 10^9
                invokeNotificationFee: "1", // notify fee, official recommend 0.000000001, here is 0.000000001 * 10^9
                expireAt: timeoutAtSeconds, // timeout at seconds eg, 1718863283n, default now + 60s
                /**
                 * export enum SendMode {
                 *     CARRY_ALL_REMAINING_BALANCE = 128,
                 *     CARRY_ALL_REMAINING_INCOMING_VALUE = 64,
                 *     DESTROY_ACCOUNT_IF_ZERO = 32,
                 *     PAY_GAS_SEPARATELY = 1,
                 *     IGNORE_ERRORS = 2,
                 *     NONE = 0
                 * }
                 */
                sendMode: 1,
                queryId: "18446744073709551615" // string of uint64 number, eg 18446744073709551615 = 2^64 - 1
            },
        };
        const tx = await tonWallet.signTransaction(param);
        console.log(tx);
    });

    test("getWalletInformation", async () => {
        const param = {
            workChain: 0, // mainnet
            privateKey: "4789815d45fcf0a79083b0adaec3b5f0d02e948056c1cfde174327c3ee93ed35",
            publicKey: "",
            walletVersion: "v4r2" // version of wallet, default v4r2
        };
        const walletInfo = await tonWallet.getWalletInformation(param);
        const expected = {
            "initData": "te6cckEBAQEAKwAAUQAAAAApqaMXVPghZdNqsBolLipOppNSrl/0/yY+VopGvreUyr8MufRAc1cSdg==",
            "walletAddress": "UQDLXrWjVfOnob2tHvCchfh1XVw9rD8RhiCLgxJrlkBNoYS7",
            "initCode": "te6cckECFAEAAtQAART/APSkE/S88sgLAQIBIAIPAgFIAwYC5tAB0NMDIXGwkl8E4CLXScEgkl8E4ALTHyGCEHBsdWe9IoIQZHN0cr2wkl8F4AP6QDAg+kQByMoHy//J0O1E0IEBQNch9AQwXIEBCPQKb6Exs5JfB+AF0z/IJYIQcGx1Z7qSODDjDQOCEGRzdHK6kl8G4w0EBQB4AfoA9AQw+CdvIjBQCqEhvvLgUIIQcGx1Z4MesXCAGFAEywUmzxZY+gIZ9ADLaRfLH1Jgyz8gyYBA+wAGAIpQBIEBCPRZMO1E0IEBQNcgyAHPFvQAye1UAXKwjiOCEGRzdHKDHrFwgBhQBcsFUAPPFiP6AhPLassfyz/JgED7AJJfA+ICASAHDgIBIAgNAgFYCQoAPbKd+1E0IEBQNch9AQwAsjKB8v/ydABgQEI9ApvoTGACASALDAAZrc52omhAIGuQ64X/wAAZrx32omhAEGuQ64WPwAARuMl+1E0NcLH4AFm9JCtvaiaECAoGuQ+gIYRw1AgIR6STfSmRDOaQPp/5g3gSgBt4EBSJhxWfMYQE+PKDCNcYINMf0x/THwL4I7vyZO1E0NMf0x/T//QE0VFDuvKhUVG68qIF+QFUEGT5EPKj+AAkpMjLH1JAyx9SMMv/UhD0AMntVPgPAdMHIcAAn2xRkyDXSpbTB9QC+wDoMOAhwAHjACHAAuMAAcADkTDjDQOkyMsfEssfy/8QERITAG7SB/oA1NQi+QAFyMoHFcv/ydB3dIAYyMsFywIizxZQBfoCFMtrEszMyXP7AMhAFIEBCPRR8qcCAHCBAQjXGPoA0z/IVCBHgQEI9FHyp4IQbm90ZXB0gBjIywXLAlAGzxZQBPoCFMtqEssfyz/Jc/sAAgBsgQEI1xj6ANM/MFIkgQEI9Fnyp4IQZHN0cnB0gBjIywXLAlAFzxZQA/oCE8tqyx8Syz/Jc/sAAAr0AMntVAj45Sg=",
            "walletStateInit": "te6cckECFgEAAwQAAgE0ARUBFP8A9KQT9LzyyAsCAgEgAxACAUgEBwLm0AHQ0wMhcbCSXwTgItdJwSCSXwTgAtMfIYIQcGx1Z70ighBkc3RyvbCSXwXgA/pAMCD6RAHIygfL/8nQ7UTQgQFA1yH0BDBcgQEI9ApvoTGzkl8H4AXTP8glghBwbHVnupI4MOMNA4IQZHN0crqSXwbjDQUGAHgB+gD0BDD4J28iMFAKoSG+8uBQghBwbHVngx6xcIAYUATLBSbPFlj6Ahn0AMtpF8sfUmDLPyDJgED7AAYAilAEgQEI9Fkw7UTQgQFA1yDIAc8W9ADJ7VQBcrCOI4IQZHN0coMesXCAGFAFywVQA88WI/oCE8tqyx/LP8mAQPsAkl8D4gIBIAgPAgEgCQ4CAVgKCwA9sp37UTQgQFA1yH0BDACyMoHy//J0AGBAQj0Cm+hMYAIBIAwNABmtznaiaEAga5Drhf/AABmvHfaiaEAQa5DrhY/AABG4yX7UTQ1wsfgAWb0kK29qJoQICga5D6AhhHDUCAhHpJN9KZEM5pA+n/mDeBKAG3gQFImHFZ8xhAT48oMI1xgg0x/TH9MfAvgju/Jk7UTQ0x/TH9P/9ATRUUO68qFRUbryogX5AVQQZPkQ8qP4ACSkyMsfUkDLH1Iwy/9SEPQAye1U+A8B0wchwACfbFGTINdKltMH1AL7AOgw4CHAAeMAIcAC4wABwAORMOMNA6TIyx8Syx/L/xESExQAbtIH+gDU1CL5AAXIygcVy//J0Hd0gBjIywXLAiLPFlAF+gIUy2sSzMzJc/sAyEAUgQEI9FHypwIAcIEBCNcY+gDTP8hUIEeBAQj0UfKnghBub3RlcHSAGMjLBcsCUAbPFlAE+gIUy2oSyx/LP8lz+wACAGyBAQjXGPoA0z8wUiSBAQj0WfKnghBkc3RycHSAGMjLBcsCUAXPFlAD+gITy2rLHxLLP8lz+wAACvQAye1UAFEAAAAAKamjF1T4IWXTarAaJS4qTqaTUq5f9P8mPlaKRr63lMq/DLn0QLGJOi0=",
        }
        expect(walletInfo).toEqual(expected);
    });

    test("getTransactionBodyForSimulate", async () => {
        const param = {
            privateKey: "4789815d45fcf0a79083b0adaec3b5f0d02e948056c1cfde174327c3ee93ed35",
            data: {
                type: "transfer", // type of TON transfer
                to: "EQA3_JIJKDC0qauDUEQe2KjQj1iLwQRtrEREzmfDxbCKw9Kr", // destination address
                decimal: 9, // decimal on ton blockchain
                amount: "10000000",
                seqno: 14, // nonce or sequence of from address
                toIsInit: true, // destination address init or not
                memo: "ton test", // comment for this tx
                expireAt: 1718863283n/*timeoutAtSeconds*/, // timeout at seconds eg, 1718863283n, default now + 60s
                /**
                 * export enum SendMode {
                 *     CARRY_ALL_REMAINING_BALANCE = 128,
                 *     CARRY_ALL_REMAINING_INCOMING_VALUE = 64,
                 *     DESTROY_ACCOUNT_IF_ZERO = 32,
                 *     PAY_GAS_SEPARATELY = 1,
                 *     IGNORE_ERRORS = 2,
                 *     NONE = 0
                 * }
                 */
                sendMode: 1,
                publicKey: "54f82165d36ab01a252e2a4ea69352ae5ff4ff263e568a46beb794cabf0cb9f4", // public key needed if no private key
            },
        };
        const body = await tonWallet.getTransactionBodyForSimulate(param);
        const expected = "te6cckEBAgEAkgABnGGGiWsDbhR1aWGsKNzV6pUGgf1WiTneQJcxyGb5rjLgVQkc4ATUyXsUar0oa6zJjIrxFhMZJlmbjWGICV5+AQQpqaMXZnPFswAAAA4AAQEAfkIAG/5JBJQYWlTVwagiD2xUaEesReCCNtYiImcz4eLYRWGcxLQAAAAAAAAAAAAAAAAAAAAAAAB0b24gdGVzdBTnQls=";
        expect(body).toBe(expected);
    });

    test("signTonProof", async () => {
        const param = {
            privateKey: "4789815d45fcf0a79083b0adaec3b5f0d02e948056c1cfde174327c3ee93ed35",
            walletAddress: "EQA3_JIJKDC0qauDUEQe2KjQj1iLwQRtrEREzmfDxbCKw9Kr",
            tonProofItem: "ton-proof-item-v2/",
            messageAction: "ton-connect",
            messageSalt: "ffff",
            proof: {
                timestamp: 1719309177,
                domain: "ton.org.com",
                payload: "123",
            },
        }
        const messageHash = await tonWallet.signTonProof(param);
        expect(messageHash).toBe("V6b0wb2YyrCcYhbHGmfF1qHwFx1HgPxC4HF5dJ8wrYKUHoXPfvBc3EDJcsAv6on9FXi4oWfvWWjlRNYnhNbFDg==");
    });

    test("calcTxHash", async () => {
        const param = {
            data: "te6cckECBAEAARIAAeGIAYlhKogJET0rm+rLlfY0aczCGg5/zakLEHs5hkk2pIbUAShC3ZvFZPuxndFImUSjvgQR9L1RDS4ZeBioM66enEURWPqGElGG9bGj2cB5KiWeilKRIewkerr43RalHk7wOBFNTRi7M9OXWAAAAGAADAEBaEIAZftljxmdcPF72D6EDJROauAYrYadLdmz/gLHUQRkCKegF9eEAAAAAAAAAAAAAAAAAAECAaYPin6lAAAAAAAAAAAicQgBrwZYwMFGpOpxEg1TGmvth943ImS9WSVgzWCW5L2SizcAMSwlUQEiJ6VzfVlyvsaNOZhDQc/5tSFiD2cwySbUkNqCAwMAHgAAAABqZXR0b24gdGVzdBhpB+M=",
        }
        const messageHash = await tonWallet.calcTxHash(param);
        expect(messageHash).toBe("2270cac96399e182d3d31688cc0a2d3676631e31a79dd2247aa6a1162ff3db0b");
    });

    test("signMultiTransaction", async () => {
        const param = {
            privateKey: "4789815d45fcf0a79083b0adaec3b5f0d02e948056c1cfde174327c3ee93ed35",
            data: {
                messages: [{
                    address: "EQA3_JIJKDC0qauDUEQe2KjQj1iLwQRtrEREzmfDxbCKw9Kr",
                    amount: "100000000",
                    payload: "", // payload
                    stateInit: 'te6cckECFgEAAwQAAgE0ARUBFP8A9KQT9LzyyAsCAgEgAxACAUgEBwLm0AHQ0wMhcbCSXwTgItdJwSCSXwTgAtMfIYIQcGx1Z70ighBkc3RyvbCSXwXgA/pAMCD6RAHIygfL/8nQ7UTQgQFA1yH0BDBcgQEI9ApvoTGzkl8H4AXTP8glghBwbHVnupI4MOMNA4IQZHN0crqSXwbjDQUGAHgB+gD0BDD4J28iMFAKoSG+8uBQghBwbHVngx6xcIAYUATLBSbPFlj6Ahn0AMtpF8sfUmDLPyDJgED7AAYAilAEgQEI9Fkw7UTQgQFA1yDIAc8W9ADJ7VQBcrCOI4IQZHN0coMesXCAGFAFywVQA88WI/oCE8tqyx/LP8mAQPsAkl8D4gIBIAgPAgEgCQ4CAVgKCwA9sp37UTQgQFA1yH0BDACyMoHy//J0AGBAQj0Cm+hMYAIBIAwNABmtznaiaEAga5Drhf/AABmvHfaiaEAQa5DrhY/AABG4yX7UTQ1wsfgAWb0kK29qJoQICga5D6AhhHDUCAhHpJN9KZEM5pA+n/mDeBKAG3gQFImHFZ8xhAT48oMI1xgg0x/TH9MfAvgju/Jk7UTQ0x/TH9P/9ATRUUO68qFRUbryogX5AVQQZPkQ8qP4ACSkyMsfUkDLH1Iwy/9SEPQAye1U+A8B0wchwACfbFGTINdKltMH1AL7AOgw4CHAAeMAIcAC4wABwAORMOMNA6TIyx8Syx/L/xESExQAbtIH+gDU1CL5AAXIygcVy//J0Hd0gBjIywXLAiLPFlAF+gIUy2sSzMzJc/sAyEAUgQEI9FHypwIAcIEBCNcY+gDTP8hUIEeBAQj0UfKnghBub3RlcHSAGMjLBcsCUAbPFlAE+gIUy2oSyx/LP8lz+wACAGyBAQjXGPoA0z8wUiSBAQj0WfKnghBkc3RycHSAGMjLBcsCUAXPFlAD+gITy2rLHxLLP8lz+wAACvQAye1UAFEAAAAAKamjFxPhbQc75H/FJ8sz1fe06yzTrMQfrE9fxKS/t1aneB9oQMb69Ik=', //base64
                    isBase64Payload: false,
                }, {
                    address: "EQA3_JIJKDC0qauDUEQe2KjQj1iLwQRtrEREzmfDxbCKw9Kr",
                    amount: "100000000",
                    payload: "this is a memo",
                    stateInit: "", //base64
                    isBase64Payload: false,
                }, {// mint NFT item
                    address: "EQDF0cVEVw917PZVNtKdyCYjiyoeIIHCngS7Dat-PtDLcKQV",
                    amount: "50000000",
                    payload: "te6ccsEBAwEATgAAHEEBMQAAAAEAAAAAAAAAAAAAAAAAAAAAQC+vCAgBAUOAGJYSqICRE9K5vqy5X2NGnMwhoOf82pCxB7OYZJNqSG1QAgAWbXlfbmZ0Lmpzb25Yc7tj",
                    stateInit: "", //base64
                    isBase64Payload: true,
                }],
                seqno: 20, // nonce or sequence of from address
                valid_until: "1729924412000", // timeout at milliseconds eg, 1718869081781n or seconds 1718869081n
                network: "mainnet", // default mainnet 0, other 1
            },
        };
        const {transaction} = await tonWallet.signMultiTransaction(param);
        const expected = "te6cckECGwEABH4AA+WIAZa9a0ar509De1o94TkL8Oq6uHtYfiMMQRcGJNcsgJtCBXAaU/gBVFk8aKoE18uko3TwZRCiTwNv+OX/JggXp5EktlJgytb8MsT9G8pHhoZA48piD9UW9ruHAQMy01km6ClNTRi7OORp4AAAAKAAGBgcARcYAnFiABv+SQSUGFpU1cGoIg9sVGhHrEXggjbWIiJnM+Hi2EVhoC+vCAAAAAAAAAAAAAAAAAACMAAAAAICFgEU/wD0pBP0vPLICwMCASAEEQIBSAUIAubQAdDTAyFxsJJfBOAi10nBIJJfBOAC0x8hghBwbHVnvSKCEGRzdHK9sJJfBeAD+kAwIPpEAcjKB8v/ydDtRNCBAUDXIfQEMFyBAQj0Cm+hMbOSXwfgBdM/yCWCEHBsdWe6kjgw4w0DghBkc3RyupJfBuMNBgcAeAH6APQEMPgnbyIwUAqhIb7y4FCCEHBsdWeDHrFwgBhQBMsFJs8WWPoCGfQAy2kXyx9SYMs/IMmAQPsABgCKUASBAQj0WTDtRNCBAUDXIMgBzxb0AMntVAFysI4jghBkc3Rygx6xcIAYUAXLBVADzxYj+gITy2rLH8s/yYBA+wCSXwPiAgEgCRACASAKDwIBWAsMAD2ynftRNCBAUDXIfQEMALIygfL/8nQAYEBCPQKb6ExgAgEgDQ4AGa3OdqJoQCBrkOuF/8AAGa8d9qJoQBBrkOuFj8AAEbjJftRNDXCx+ABZvSQrb2omhAgKBrkPoCGEcNQICEekk30pkQzmkD6f+YN4EoAbeBAUiYcVnzGEBPjygwjXGCDTH9Mf0x8C+CO78mTtRNDTH9Mf0//0BNFRQ7ryoVFRuvKiBfkBVBBk+RDyo/gAJKTIyx9SQMsfUjDL/1IQ9ADJ7VT4DwHTByHAAJ9sUZMg10qW0wfUAvsA6DDgIcAB4wAhwALjAAHAA5Ew4w0DpMjLHxLLH8v/EhMUFQBu0gf6ANTUIvkABcjKBxXL/8nQd3SAGMjLBcsCIs8WUAX6AhTLaxLMzMlz+wDIQBSBAQj0UfKnAgBwgQEI1xj6ANM/yFQgR4EBCPRR8qeCEG5vdGVwdIAYyMsFywJQBs8WUAT6AhTLahLLH8s/yXP7AAIAbIEBCNcY+gDTPzBSJIEBCPRZ8qeCEGRzdHJwdIAYyMsFywJQBc8WUAP6AhPLassfEss/yXP7AAAK9ADJ7VQAUQAAAAApqaMXE+FtBzvkf8UnyzPV97TrLNOsxB+sT1/EpL+3Vqd4H2hAAIxiABv+SQSUGFpU1cGoIg9sVGhHrEXggjbWIiJnM+Hi2EVhoC+vCAAAAAAAAAAAAAAAAAAAAAAAAHRoaXMgaXMgYSBtZW1vAZliAGLo4qIrh7r2eyqbaU7kExHFlQ8QQOFPAl2G1b8faGW4IBfXhAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAABAL68ICBkBQ4AYlhKogJET0rm+rLlfY0aczCGg5/zakLEHs5hkk2pIbVAaABZteV9uZnQuanNvbouLMY0="
        expect(transaction).toBe(expected);
    });

    test("simulateMultiTransaction", async () => {
        const param = {
            privateKey: "4789815d45fcf0a79083b0adaec3b5f0d02e948056c1cfde174327c3ee93ed35",
            data: {
                messages: [{
                    address: "EQA3_JIJKDC0qauDUEQe2KjQj1iLwQRtrEREzmfDxbCKw9Kr",
                    amount: "100000000",
                    payload: "", // payload
                    stateInit: 'te6cckECFgEAAwQAAgE0ARUBFP8A9KQT9LzyyAsCAgEgAxACAUgEBwLm0AHQ0wMhcbCSXwTgItdJwSCSXwTgAtMfIYIQcGx1Z70ighBkc3RyvbCSXwXgA/pAMCD6RAHIygfL/8nQ7UTQgQFA1yH0BDBcgQEI9ApvoTGzkl8H4AXTP8glghBwbHVnupI4MOMNA4IQZHN0crqSXwbjDQUGAHgB+gD0BDD4J28iMFAKoSG+8uBQghBwbHVngx6xcIAYUATLBSbPFlj6Ahn0AMtpF8sfUmDLPyDJgED7AAYAilAEgQEI9Fkw7UTQgQFA1yDIAc8W9ADJ7VQBcrCOI4IQZHN0coMesXCAGFAFywVQA88WI/oCE8tqyx/LP8mAQPsAkl8D4gIBIAgPAgEgCQ4CAVgKCwA9sp37UTQgQFA1yH0BDACyMoHy//J0AGBAQj0Cm+hMYAIBIAwNABmtznaiaEAga5Drhf/AABmvHfaiaEAQa5DrhY/AABG4yX7UTQ1wsfgAWb0kK29qJoQICga5D6AhhHDUCAhHpJN9KZEM5pA+n/mDeBKAG3gQFImHFZ8xhAT48oMI1xgg0x/TH9MfAvgju/Jk7UTQ0x/TH9P/9ATRUUO68qFRUbryogX5AVQQZPkQ8qP4ACSkyMsfUkDLH1Iwy/9SEPQAye1U+A8B0wchwACfbFGTINdKltMH1AL7AOgw4CHAAeMAIcAC4wABwAORMOMNA6TIyx8Syx/L/xESExQAbtIH+gDU1CL5AAXIygcVy//J0Hd0gBjIywXLAiLPFlAF+gIUy2sSzMzJc/sAyEAUgQEI9FHypwIAcIEBCNcY+gDTP8hUIEeBAQj0UfKnghBub3RlcHSAGMjLBcsCUAbPFlAE+gIUy2oSyx/LP8lz+wACAGyBAQjXGPoA0z8wUiSBAQj0WfKnghBkc3RycHSAGMjLBcsCUAXPFlAD+gITy2rLHxLLP8lz+wAACvQAye1UAFEAAAAAKamjFxPhbQc75H/FJ8sz1fe06yzTrMQfrE9fxKS/t1aneB9oQMb69Ik=', //base64
                    isBase64Payload: false,
                }, {
                    address: "EQA3_JIJKDC0qauDUEQe2KjQj1iLwQRtrEREzmfDxbCKw9Kr",
                    amount: "100000000",
                    payload: "this is a memo",
                    stateInit: "", //base64
                    isBase64Payload: false,
                }, {// mint NFT item
                    address: "EQDF0cVEVw917PZVNtKdyCYjiyoeIIHCngS7Dat-PtDLcKQV",
                    amount: "50000000",
                    payload: "te6ccsEBAwEATgAAHEEBMQAAAAEAAAAAAAAAAAAAAAAAAAAAQC+vCAgBAUOAGJYSqICRE9K5vqy5X2NGnMwhoOf82pCxB7OYZJNqSG1QAgAWbXlfbmZ0Lmpzb25Yc7tj",
                    stateInit: "", //base64
                    isBase64Payload: true,
                }],
                seqno: 16, // nonce or sequence of from address
                valid_until: "1729924412000", // timeout at milliseconds eg, 1718869081781n or seconds 1718869081n
                network: "mainnet", // default mainnet 0, other 1
                publicKey: "54f82165d36ab01a252e2a4ea69352ae5ff4ff263e568a46beb794cabf0cb9f4", // public key needed if no private key
            },
        };
        const {transaction} = await tonWallet.simulateMultiTransaction(param);
        const expected = "te6cckECGwEABFsAA6CXR60crf6nl0Bd56euclOBGh2hCm3A5BHqFC+sbn5ZR3neVwmvvuAIgT33Md0sohY90J52K0ezymlVM8PuNE4PKamjF2ccjTwAAAAQAAMDAwEXGAJxYgAb/kkElBhaVNXBqCIPbFRoR6xF4II21iIiZzPh4thFYaAvrwgAAAAAAAAAAAAAAAAAAjAAAAACAhYBFP8A9KQT9LzyyAsDAgEgBBECAUgFCALm0AHQ0wMhcbCSXwTgItdJwSCSXwTgAtMfIYIQcGx1Z70ighBkc3RyvbCSXwXgA/pAMCD6RAHIygfL/8nQ7UTQgQFA1yH0BDBcgQEI9ApvoTGzkl8H4AXTP8glghBwbHVnupI4MOMNA4IQZHN0crqSXwbjDQYHAHgB+gD0BDD4J28iMFAKoSG+8uBQghBwbHVngx6xcIAYUATLBSbPFlj6Ahn0AMtpF8sfUmDLPyDJgED7AAYAilAEgQEI9Fkw7UTQgQFA1yDIAc8W9ADJ7VQBcrCOI4IQZHN0coMesXCAGFAFywVQA88WI/oCE8tqyx/LP8mAQPsAkl8D4gIBIAkQAgEgCg8CAVgLDAA9sp37UTQgQFA1yH0BDACyMoHy//J0AGBAQj0Cm+hMYAIBIA0OABmtznaiaEAga5Drhf/AABmvHfaiaEAQa5DrhY/AABG4yX7UTQ1wsfgAWb0kK29qJoQICga5D6AhhHDUCAhHpJN9KZEM5pA+n/mDeBKAG3gQFImHFZ8xhAT48oMI1xgg0x/TH9MfAvgju/Jk7UTQ0x/TH9P/9ATRUUO68qFRUbryogX5AVQQZPkQ8qP4ACSkyMsfUkDLH1Iwy/9SEPQAye1U+A8B0wchwACfbFGTINdKltMH1AL7AOgw4CHAAeMAIcAC4wABwAORMOMNA6TIyx8Syx/L/xITFBUAbtIH+gDU1CL5AAXIygcVy//J0Hd0gBjIywXLAiLPFlAF+gIUy2sSzMzJc/sAyEAUgQEI9FHypwIAcIEBCNcY+gDTP8hUIEeBAQj0UfKnghBub3RlcHSAGMjLBcsCUAbPFlAE+gIUy2oSyx/LP8lz+wACAGyBAQjXGPoA0z8wUiSBAQj0WfKnghBkc3RycHSAGMjLBcsCUAXPFlAD+gITy2rLHxLLP8lz+wAACvQAye1UAFEAAAAAKamjFxPhbQc75H/FJ8sz1fe06yzTrMQfrE9fxKS/t1aneB9oQACMYgAb/kkElBhaVNXBqCIPbFRoR6xF4II21iIiZzPh4thFYaAvrwgAAAAAAAAAAAAAAAAAAAAAAAB0aGlzIGlzIGEgbWVtbwGZYgBi6OKiK4e69nsqm2lO5BMRxZUPEEDhTwJdhtW/H2hluCAX14QAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAQC+vCAgZAUOAGJYSqICRE9K5vqy5X2NGnMwhoOf82pCxB7OYZJNqSG1QGgAWbXlfbmZ0Lmpzb24BRXcz";
        expect(transaction).toBe(expected);
    });
});

describe("ton mnemonic", () => {
    const mWords = [
        "muscle", "chest", "cereal", "often", "muscle", "right", "melt", "depend", "deny", "insect", "taste", "hungry", "expire", "feel", "cream", "grow", "aerobic", "build", "all", "patrol", "cloud", "garden", "fly", "emerge"
    ];

    const expectedSeed = "4789815d45fcf0a79083b0adaec3b5f0d02e948056c1cfde174327c3ee93ed35";

    test("generate mnemonic", async () => {
        const words = await generateMnemonic();
        expect(words.length).toBe(24);
        const needPassword = await isPasswordNeeded(words);
        expect(needPassword).toBe(false)
    });

    test("validate mnemonic", async () => {
        const valid = await validateMnemonic(mWords);
        expect(valid).toBe(true);
    });

    test("mnemonic to seed", async () => {
        const seedBytes = await mnemonicToSeed(mWords);
        const seed = base.toHex(seedBytes);
        expect(seed).toBe(expectedSeed);
    });

    test("mnemonic to key pair", async () => {
        const keyPair = await mnemonicToKeyPair(mWords);
        const privateKey = base.toHex(keyPair.secretKey);
        const publicKey = base.toHex(keyPair.publicKey);
        expect(privateKey.slice(0, 64)).toBe(expectedSeed);
        expect(publicKey).toBe("54f82165d36ab01a252e2a4ea69352ae5ff4ff263e568a46beb794cabf0cb9f4");
    });
});

describe("venom", () => {
    test("venom getNewAddress", async () => {
        const seed = "4789815d45fcf0a79083b0adaec3b5f0d02e948056c1cfde174327c3ee93ed35";
        const result = await venomWallet.getNewAddress({privateKey: seed});
        expect(result.address).toBe("0:5bb45f69159464574c80d7d4be3d85e4c05018a5d719a73f05f8782be5a159cc");
    });

    test("venom validateAddress", async () => {
        const result = await venomWallet.validAddress({address: "0:6bef7d76e46fd1f308f0bf0b59f1ca6318aa6d950ea00aecc7d162218acaaa36"});
        expect(result.isValid).toBe(true);
    });

    test("venom signTransaction", async () => {
        const param = {
            privateKey: "4789815d45fcf0a79083b0adaec3b5f0d02e948056c1cfde174327c3ee93ed35",
            data: {
                to: "0:b547ad1de927f0dcf95372cd766302e2c9351331d7673454017cc52c149727c0",
                amount: "100000000",
                seqno: 4,
                toIsInit: true,
                memo: "",
                globalId: 1000,
                expireAt: 1718863283n
            },
        };
        const tx = await venomWallet.signTransaction(param);
        const expected = {
            id: "B4E2/5iNzYXt1Qefw7z+58GZdlbG+lL/xv2EztdxvvI=",
            body: "te6cckEBAgEArQAB34gAt2i+0isoyK6ZAa+pfHsLyYCgMUuuM05+C/DwV8tCs5gA4qQeqimEdqelcVdxmxKMBt6/mS5Uemjt6gtY5jLegTm/i2nuNGjmcmXbtHfzAocbU7IMttbzjZ7uxryy2LeQCl1JbFMzni2YAAAAIBwBAHBiAFqj1o70k/hufKm5ZrsxgXFkmomY67OaKgC+YpYKS5PgIC+vCAAAAAAAAAAAAAAAAAAAAAAAAHV//hw=",
        };
        expect(tx).toEqual(expected);
    });
});
