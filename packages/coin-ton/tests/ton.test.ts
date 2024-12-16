import {ApiTonConnectProof, TonWallet, VenomWallet} from "../src";
import {
    generateMnemonic,
    isPasswordNeeded,
    mnemonicToKeyPair,
    mnemonicToSeed,
    validateMnemonic
} from "tonweb-mnemonic";
import {base} from "@okxweb3/crypto-lib";
import {test} from "@jest/globals";
import assert from "assert";

const tonWallet = new TonWallet();
const venomWallet = new VenomWallet();

describe("ton", () => {
    const timeoutAtSeconds = Math.floor(Date.now() / 1e3) + 600;
    // const timeoutAtSeconds = 1718863283n;

    test("signCommonMsg", async () => {
        let wallet = new TonWallet();
        let sig = await wallet.signCommonMsg({privateKey:"fc81e6f42150458f53d8c42551a8ab91978a55d0e22b1fd890b85139086b93f8", message:{walletId:"123456789"}});
        assert.strictEqual(sig,"cc40d1fe95d67c7cd7e994a49fe8576f6958767084247cdc0b47fb8d62feef3578de28ce230f55eaec6396dc5d3b6720c0bbd53579f532b645eeb15055e30801")
    });


    test("derive seed", async () => {
        const seed = await tonWallet.getDerivedPrivateKey({
            // bip39 mnemoric
            // mnemonic: "ensure net noodle crystal estate arrange then actor symbol menu term eyebrow",
            // ton official mnemoric
            mnemonic: "dutch capable garlic drink camera foot wrestle quiz hidden bench deny world aware morning confirm pottery rail prize sorry mom dance parrot flavor deputy",
            // mnemonic: "margin twelve physical buffalo tone cancel winner globe nature embody twelve ahead",
            // hdPath: "m/44'/607'/0'/0'/1'", // for bip39 mnemoric
            hdPath: "", // for ton official mnemoric
        });
        expect(seed).toBe("85d3685f33418ef815d7476755cdde923d77a7a8cf3e66adadf40c761c2836de");
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
        let k = 1;
        for (let i = 0; i < ps.length; i++) {
            let param = {privateKey: ps[i]};
            try {
                await wallet.getNewAddress(param);
            } catch (e) {
                j = j + 1
            }

            try {
                await wallet.validPrivateKey({privateKey:ps[i]});
            } catch (e) {
                k++;
            }

            expect(ps[i]).toEqual(param.privateKey)
        }
        expect(j).toEqual(ps.length + 1);
        expect(k).toEqual(ps.length + 1);
    });

    test("validPrivateKey", async () => {
        const wallet = new TonWallet();
        const privateKey = await wallet.getRandomPrivateKey();
        const res = await wallet.validPrivateKey({privateKey: privateKey});
        expect(res.isValid).toEqual(true);
    });

    test("validateMnemonicOfTon", async () => {
        const validateMnemonicOfTon = await tonWallet.validateMnemonicOfTon({
            mnemonicArray: "ensure net noodle crystal estate arrange then actor symbol menu term eyebrow".split(' '),
            password: ''
        });
        expect(validateMnemonicOfTon).toBe(false);
    });

    test("ton getNewAddress", async () => {
        const seed = "fc81e6f42150458f53d8c42551a8ab91978a55d0e22b1fd890b85139086b93f8";
        let result = await tonWallet.getNewAddress({privateKey: seed});
        expect(result.address).toBe("UQC6QJ31Bv_hjmsoaUjRmpZYqj9NXbBbvufCNycnc0gjReqR");
        result = await tonWallet.getNewAddress({privateKey: "0xfc81e6f42150458f53d8c42551a8ab91978a55d0e22b1fd890b85139086b93f8"});
        expect(result.address).toBe("UQC6QJ31Bv_hjmsoaUjRmpZYqj9NXbBbvufCNycnc0gjReqR");
        result = await tonWallet.getNewAddress({privateKey: "FC81E6F42150458F53D8C42551A8AB91978A55D0E22B1FD890B85139086B93F8"});
        expect(result.address).toBe("UQC6QJ31Bv_hjmsoaUjRmpZYqj9NXbBbvufCNycnc0gjReqR");
        result = await tonWallet.getNewAddress({privateKey: "0XFC81E6F42150458F53D8C42551A8AB91978A55D0E22B1FD890B85139086B93F8"});
        expect(result.address).toBe("UQC6QJ31Bv_hjmsoaUjRmpZYqj9NXbBbvufCNycnc0gjReqR");
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
            privateKey: "fc81e6f42150458f53d8c42551a8ab91978a55d0e22b1fd890b85139086b93f8",
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
            privateKey: "fc81e6f42150458f53d8c42551a8ab91978a55d0e22b1fd890b85139086b93f8",
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

    test("ton jetton mintless signTransaction", async () => {
        const param = {
            privateKey: "fc81e6f42150458f53d8c42551a8ab91978a55d0e22b1fd890b85139086b93f8",
            data: {
                type: "jettonTransfer", // type of jetton TOKEN transfer
                // jetton wallet address of from address
                fromJettonAccount: "EQAbjeYovCwu8rdK_BVD-K3G1RO9DwHDXAYQVjYX2oYq2nNs",
                to: "UQDXgyxgYKNSdTiJBqmNNfbD7xuRMl6skrBmsEtyXslFm5an",
                seqno: 2, // nonce or sequence of from address
                toIsInit: false, // destination address init or not
                memo: "", // comment for this tx
                decimal: 9, // decimal of jetton TOKEN on ton blockchain
                amount: "0", // decimal of TOKEN is 2 on ton blockchain, so that here real value is 1
                messageAttachedTons: "100000000", // message fee, default 0.05, here is 0.05 * 10^9
                invokeNotificationFee: "1", // notify fee, official recommend 0.000000001, here is 0.000000001 * 10^9
                expireAt: timeoutAtSeconds, // timeout at seconds eg, 1718863283n, default now + 60s
                customPayload: "te6ccgECMQEABD0AAQgN9gLWAQlGA6+1FWXC4ss/wvDOFwMk2bVM97AUEWqaUhh63uWfQ26nAB4CIgWBcAIDBCIBIAUGKEgBAfRz1Bc0mT2ncrMSGDzpgrCQTSHm8sfmADRmLiUnsNxaAB0iASAHCChIAQENfwBAdh4BtwI1FNpt1Hbn/aOwPSJoRdgU4zhuF90XqQAcIgEgCQooSAEBUi2VG6r6RjQj0FCr2Sx9GziTij+IViV1EBb8L/8WoM4AGyhIAQGxLvEY9WgzlAYqIwgEJVjCjPP2LL8POA5cPtDX/ICFaQAZIgEgCwwoSAEB6C5kMujM0MhhSLbqrUztWB5Kcfdecx8LZ6KRkOc5bDcAGCIBIA0OKEgBAbJ3XoghuVwSjFJGWOTC54k0ZFmCsOAOc0Wt15GI+gb6ABciASAPEChIAQFyOFgLXez90Sj/+GRRcPt/AJ/ObHVkwgjYcDhSx6fbsAAWIgEgERIiASATFChIAQEDtQVupKrXeJhjhyUKYd3OPf0GxwVV1IDy+iXMR/goewAVKEgBAQph4s1pC9y8MWknNPBHNJrSHdimhsjwJTKsTtzHBRlqABQiASAVFihIAQHp9WxWiNgvfUyhwWIaQ2z+uU0RwqxkbNxLSMEnZWzzQAASIgEgFxgoSAEBBkIlY9AlSY8GsPcFaJPchY7tWfKtKX0Awx0SEiJz3lAAEiIBIBkaKEgBAfdZX+TtPDalGNq7Md2id0vCHK8HKOR0+77eJzH8InXhABEiASAbHCIBIB0eKEgBATpKVSPw6KyxJiw0GmzuGCyNHlA5ogc24DODkte6fzy9AA8iASAfIChIAQE3+haceo/EslgK3xv0t2ZrKxRfLxDm0IkOkcnDyCeavwANKEgBATO8W3KDeWmmTIv23CQoiJhyidxgL6c3entEm7SheuCDAA0iASAhIiIBICMkKEgBARarfhq0MYyF8WkqTkqkIPAVBh7lU3reBlDc6wA/70b8AAsiASAlJihIAQFt+vYtnMIi7RH91EaU58Yvf+MiwNd7A40P1aoFhaD+IgAJKEgBAWxv6OupJReZmkRM5LIkpMupuGMKAGRnI4L0J6ZOw9s7AAkiASAnKChIAQE/XI2bRyyEWynQamQHJC2HjpgY4hauLSTGBuNFatZlSAAIIgEgKSooSAEB+Xjkf6ScDOWWGtDqcMQtUW65GhHphB4SHSQ14sx0VCYABiIBICssIgEgLS4oSAEBU4bYiAJBEK5qwy1eRIdLAOK8QELz0yTAPCTsYmZhPEUABCIBbi8wKEgBAerGQGO6mv6nukMVfDI/M+KNNRCBH8q+t4G6XRxqKAK/AAEoSAEBf4jiG+pY6Cml375ovmTBNuvf7QI6oiVsL8e/DGVfGE4AAABduf2NRRLK+qYONCLh6kHV9jpZw5nRQ26fwK2MmpB9IdzWUAAAAzcG7AAAAzeq1oQ=",
                stateInit: "te6ccgEBAwEAjwACATQBAghCAg7xnhv0Dyukkvyqw4buylm/aCejhQcI2fzZrbaDq8M2AMoAgAPeTn9jUUSyvqmDjQi4epB1fY6WcOZ0UNun8CtjJqQfUAPpn0MdzkzH7w8jwjgGMZfR3Y2FqlpEArXYKCy3B42gyr7UVZcLiyz/C8M4XAyTZtUz3sBQRappSGHre5Z9DbqcDA==",
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
                sendMode: 3,
                // queryId: "18446744073709551615" // string of uint64 number, eg 18446744073709551615 = 2^64 - 1
            },
        };
        const tx = await tonWallet.signTransaction(param);
        console.log(tx.boc);
    });

    test("getWalletInformation", async () => {
        const param = {
            workChain: 0, // mainnet
            privateKey: "fc81e6f42150458f53d8c42551a8ab91978a55d0e22b1fd890b85139086b93f8",
            publicKey: "",
            walletVersion: "v4r2" // version of wallet, default v4r2
        };
        const walletInfo = await tonWallet.getWalletInformation(param);
        const expected = {
            initCode: 'te6cckECFAEAAtQAART/APSkE/S88sgLAQIBIAIPAgFIAwYC5tAB0NMDIXGwkl8E4CLXScEgkl8E4ALTHyGCEHBsdWe9IoIQZHN0cr2wkl8F4AP6QDAg+kQByMoHy//J0O1E0IEBQNch9AQwXIEBCPQKb6Exs5JfB+AF0z/IJYIQcGx1Z7qSODDjDQOCEGRzdHK6kl8G4w0EBQB4AfoA9AQw+CdvIjBQCqEhvvLgUIIQcGx1Z4MesXCAGFAEywUmzxZY+gIZ9ADLaRfLH1Jgyz8gyYBA+wAGAIpQBIEBCPRZMO1E0IEBQNcgyAHPFvQAye1UAXKwjiOCEGRzdHKDHrFwgBhQBcsFUAPPFiP6AhPLassfyz/JgED7AJJfA+ICASAHDgIBIAgNAgFYCQoAPbKd+1E0IEBQNch9AQwAsjKB8v/ydABgQEI9ApvoTGACASALDAAZrc52omhAIGuQ64X/wAAZrx32omhAEGuQ64WPwAARuMl+1E0NcLH4AFm9JCtvaiaECAoGuQ+gIYRw1AgIR6STfSmRDOaQPp/5g3gSgBt4EBSJhxWfMYQE+PKDCNcYINMf0x/THwL4I7vyZO1E0NMf0x/T//QE0VFDuvKhUVG68qIF+QFUEGT5EPKj+AAkpMjLH1JAyx9SMMv/UhD0AMntVPgPAdMHIcAAn2xRkyDXSpbTB9QC+wDoMOAhwAHjACHAAuMAAcADkTDjDQOkyMsfEssfy/8QERITAG7SB/oA1NQi+QAFyMoHFcv/ydB3dIAYyMsFywIizxZQBfoCFMtrEszMyXP7AMhAFIEBCPRR8qcCAHCBAQjXGPoA0z/IVCBHgQEI9FHyp4IQbm90ZXB0gBjIywXLAlAGzxZQBPoCFMtqEssfyz/Jc/sAAgBsgQEI1xj6ANM/MFIkgQEI9Fnyp4IQZHN0cnB0gBjIywXLAlAFzxZQA/oCE8tqyx8Syz/Jc/sAAAr0AMntVAj45Sg=',
            initData: 'te6cckEBAQEAKwAAUQAAAAApqaMXSEu9odGrPom4O0I2hanUy+eii4uWu77lHQVTtH5NtC9As9YYUg==',
            walletStateInit: 'te6cckECFgEAAwQAAgE0ARUBFP8A9KQT9LzyyAsCAgEgAxACAUgEBwLm0AHQ0wMhcbCSXwTgItdJwSCSXwTgAtMfIYIQcGx1Z70ighBkc3RyvbCSXwXgA/pAMCD6RAHIygfL/8nQ7UTQgQFA1yH0BDBcgQEI9ApvoTGzkl8H4AXTP8glghBwbHVnupI4MOMNA4IQZHN0crqSXwbjDQUGAHgB+gD0BDD4J28iMFAKoSG+8uBQghBwbHVngx6xcIAYUATLBSbPFlj6Ahn0AMtpF8sfUmDLPyDJgED7AAYAilAEgQEI9Fkw7UTQgQFA1yDIAc8W9ADJ7VQBcrCOI4IQZHN0coMesXCAGFAFywVQA88WI/oCE8tqyx/LP8mAQPsAkl8D4gIBIAgPAgEgCQ4CAVgKCwA9sp37UTQgQFA1yH0BDACyMoHy//J0AGBAQj0Cm+hMYAIBIAwNABmtznaiaEAga5Drhf/AABmvHfaiaEAQa5DrhY/AABG4yX7UTQ1wsfgAWb0kK29qJoQICga5D6AhhHDUCAhHpJN9KZEM5pA+n/mDeBKAG3gQFImHFZ8xhAT48oMI1xgg0x/TH9MfAvgju/Jk7UTQ0x/TH9P/9ATRUUO68qFRUbryogX5AVQQZPkQ8qP4ACSkyMsfUkDLH1Iwy/9SEPQAye1U+A8B0wchwACfbFGTINdKltMH1AL7AOgw4CHAAeMAIcAC4wABwAORMOMNA6TIyx8Syx/L/xESExQAbtIH+gDU1CL5AAXIygcVy//J0Hd0gBjIywXLAiLPFlAF+gIUy2sSzMzJc/sAyEAUgQEI9FHypwIAcIEBCNcY+gDTP8hUIEeBAQj0UfKnghBub3RlcHSAGMjLBcsCUAbPFlAE+gIUy2oSyx/LP8lz+wACAGyBAQjXGPoA0z8wUiSBAQj0WfKnghBkc3RycHSAGMjLBcsCUAXPFlAD+gITy2rLHxLLP8lz+wAACvQAye1UAFEAAAAAKamjF0hLvaHRqz6JuDtCNoWp1MvnoouLlru+5R0FU7R+TbQvQHEIMAk=',
            walletAddress: 'UQC6QJ31Bv_hjmsoaUjRmpZYqj9NXbBbvufCNycnc0gjReqR'
        }
        expect(walletInfo).toEqual(expected);
    });

    test("getTransactionBodyForSimulate", async () => {
        const param = {
            privateKey: "fc81e6f42150458f53d8c42551a8ab91978a55d0e22b1fd890b85139086b93f8",
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
                publicKey: "484bbda1d1ab3e89b83b423685a9d4cbe7a28b8b96bbbee51d0553b47e4db42f", // public key needed if no private key
            },
        };
        const body = await tonWallet.getTransactionBodyForSimulate(param);
        const expected = "te6cckEBAgEAkgABnGGGiWsDbhR1aWGsKNzV6pUGgf1WiTneQJcxyGb5rjLgVQkc4ATUyXsUar0oa6zJjIrxFhMZJlmbjWGICV5+AQQpqaMXZnPFswAAAA4AAQEAfkIAG/5JBJQYWlTVwagiD2xUaEesReCCNtYiImcz4eLYRWGcxLQAAAAAAAAAAAAAAAAAAAAAAAB0b24gdGVzdBTnQls=";
        expect(body).toBe(expected);
    });

    test("signTonProof", async () => {
        const param = {
            privateKey: "fc81e6f42150458f53d8c42551a8ab91978a55d0e22b1fd890b85139086b93f8",
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
        expect(messageHash).toBe("tkrepSlC/7RMdGmtqNQ/OKRkxtdzvwF6GYBP6sgKWI/9mP0KcqyUwpFHAEGF6xeNOrwwoxIce8KJuEHLxuIgDw==");
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
            privateKey: "fc81e6f42150458f53d8c42551a8ab91978a55d0e22b1fd890b85139086b93f8",
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
                valid_until: "1829924412000", // timeout at milliseconds eg, 1718869081781n or seconds 1718869081n
                network: "mainnet", // default mainnet 0, other 1
            },
        };
        const {transaction} = await tonWallet.signMultiTransaction(param);
        const expected = "te6cckECGwEABH4AA+WIAXSBO+oN/8Mc1lDSkaM1LLFUfpq7YLd9z4RuTk7mkEaKAW3aeS/BUgyDQtzjcqivjrItSkNXvXnybugzE9Ua0xsw8/oZjHYf0kTWUb2RSItwam7TcA+ot/vQbMalAjOMcGFNTRi7aJNx4AAAAKAAGBgcARcYAnFiABv+SQSUGFpU1cGoIg9sVGhHrEXggjbWIiJnM+Hi2EVhoC+vCAAAAAAAAAAAAAAAAAACMAAAAAICFgEU/wD0pBP0vPLICwMCASAEEQIBSAUIAubQAdDTAyFxsJJfBOAi10nBIJJfBOAC0x8hghBwbHVnvSKCEGRzdHK9sJJfBeAD+kAwIPpEAcjKB8v/ydDtRNCBAUDXIfQEMFyBAQj0Cm+hMbOSXwfgBdM/yCWCEHBsdWe6kjgw4w0DghBkc3RyupJfBuMNBgcAeAH6APQEMPgnbyIwUAqhIb7y4FCCEHBsdWeDHrFwgBhQBMsFJs8WWPoCGfQAy2kXyx9SYMs/IMmAQPsABgCKUASBAQj0WTDtRNCBAUDXIMgBzxb0AMntVAFysI4jghBkc3Rygx6xcIAYUAXLBVADzxYj+gITy2rLH8s/yYBA+wCSXwPiAgEgCRACASAKDwIBWAsMAD2ynftRNCBAUDXIfQEMALIygfL/8nQAYEBCPQKb6ExgAgEgDQ4AGa3OdqJoQCBrkOuF/8AAGa8d9qJoQBBrkOuFj8AAEbjJftRNDXCx+ABZvSQrb2omhAgKBrkPoCGEcNQICEekk30pkQzmkD6f+YN4EoAbeBAUiYcVnzGEBPjygwjXGCDTH9Mf0x8C+CO78mTtRNDTH9Mf0//0BNFRQ7ryoVFRuvKiBfkBVBBk+RDyo/gAJKTIyx9SQMsfUjDL/1IQ9ADJ7VT4DwHTByHAAJ9sUZMg10qW0wfUAvsA6DDgIcAB4wAhwALjAAHAA5Ew4w0DpMjLHxLLH8v/EhMUFQBu0gf6ANTUIvkABcjKBxXL/8nQd3SAGMjLBcsCIs8WUAX6AhTLaxLMzMlz+wDIQBSBAQj0UfKnAgBwgQEI1xj6ANM/yFQgR4EBCPRR8qeCEG5vdGVwdIAYyMsFywJQBs8WUAT6AhTLahLLH8s/yXP7AAIAbIEBCNcY+gDTPzBSJIEBCPRZ8qeCEGRzdHJwdIAYyMsFywJQBc8WUAP6AhPLassfEss/yXP7AAAK9ADJ7VQAUQAAAAApqaMXE+FtBzvkf8UnyzPV97TrLNOsxB+sT1/EpL+3Vqd4H2hAAIxiABv+SQSUGFpU1cGoIg9sVGhHrEXggjbWIiJnM+Hi2EVhoC+vCAAAAAAAAAAAAAAAAAAAAAAAAHRoaXMgaXMgYSBtZW1vAZliAGLo4qIrh7r2eyqbaU7kExHFlQ8QQOFPAl2G1b8faGW4IBfXhAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAABAL68ICBkBQ4AYlhKogJET0rm+rLlfY0aczCGg5/zakLEHs5hkk2pIbVAaABZteV9uZnQuanNvbnhHt9s=";
        expect(transaction).toBe(expected);
    });

    test("simulateMultiTransaction", async () => {
        const param = {
            privateKey: "fc81e6f42150458f53d8c42551a8ab91978a55d0e22b1fd890b85139086b93f8",
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
                valid_until: "1829924412000", // timeout at milliseconds eg, 1718869081781n or seconds 1718869081n
                network: "mainnet", // default mainnet 0, other 1
                publicKey: "484bbda1d1ab3e89b83b423685a9d4cbe7a28b8b96bbbee51d0553b47e4db42f", // public key needed if no private key
            },
        };
        const {transaction} = await tonWallet.simulateMultiTransaction(param);
        const expected = "te6cckECGwEABFsAA6DvxnPzoU0Ashsgz218uhIVU2+JPrnC2f+fyBVdHaY9aZAJxexTi1QjFFc8llH+qOtQLXTSHb+K3QILVpEobBwKKamjF20SbjwAAAAQAAMDAwEXGAJxYgAb/kkElBhaVNXBqCIPbFRoR6xF4II21iIiZzPh4thFYaAvrwgAAAAAAAAAAAAAAAAAAjAAAAACAhYBFP8A9KQT9LzyyAsDAgEgBBECAUgFCALm0AHQ0wMhcbCSXwTgItdJwSCSXwTgAtMfIYIQcGx1Z70ighBkc3RyvbCSXwXgA/pAMCD6RAHIygfL/8nQ7UTQgQFA1yH0BDBcgQEI9ApvoTGzkl8H4AXTP8glghBwbHVnupI4MOMNA4IQZHN0crqSXwbjDQYHAHgB+gD0BDD4J28iMFAKoSG+8uBQghBwbHVngx6xcIAYUATLBSbPFlj6Ahn0AMtpF8sfUmDLPyDJgED7AAYAilAEgQEI9Fkw7UTQgQFA1yDIAc8W9ADJ7VQBcrCOI4IQZHN0coMesXCAGFAFywVQA88WI/oCE8tqyx/LP8mAQPsAkl8D4gIBIAkQAgEgCg8CAVgLDAA9sp37UTQgQFA1yH0BDACyMoHy//J0AGBAQj0Cm+hMYAIBIA0OABmtznaiaEAga5Drhf/AABmvHfaiaEAQa5DrhY/AABG4yX7UTQ1wsfgAWb0kK29qJoQICga5D6AhhHDUCAhHpJN9KZEM5pA+n/mDeBKAG3gQFImHFZ8xhAT48oMI1xgg0x/TH9MfAvgju/Jk7UTQ0x/TH9P/9ATRUUO68qFRUbryogX5AVQQZPkQ8qP4ACSkyMsfUkDLH1Iwy/9SEPQAye1U+A8B0wchwACfbFGTINdKltMH1AL7AOgw4CHAAeMAIcAC4wABwAORMOMNA6TIyx8Syx/L/xITFBUAbtIH+gDU1CL5AAXIygcVy//J0Hd0gBjIywXLAiLPFlAF+gIUy2sSzMzJc/sAyEAUgQEI9FHypwIAcIEBCNcY+gDTP8hUIEeBAQj0UfKnghBub3RlcHSAGMjLBcsCUAbPFlAE+gIUy2oSyx/LP8lz+wACAGyBAQjXGPoA0z8wUiSBAQj0WfKnghBkc3RycHSAGMjLBcsCUAXPFlAD+gITy2rLHxLLP8lz+wAACvQAye1UAFEAAAAAKamjFxPhbQc75H/FJ8sz1fe06yzTrMQfrE9fxKS/t1aneB9oQACMYgAb/kkElBhaVNXBqCIPbFRoR6xF4II21iIiZzPh4thFYaAvrwgAAAAAAAAAAAAAAAAAAAAAAAB0aGlzIGlzIGEgbWVtbwGZYgBi6OKiK4e69nsqm2lO5BMRxZUPEEDhTwJdhtW/H2hluCAX14QAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAQC+vCAgZAUOAGJYSqICRE9K5vqy5X2NGnMwhoOf82pCxB7OYZJNqSG1QGgAWbXlfbmZ0Lmpzb266LA27";
        expect(transaction).toBe(expected);
    });
});

describe("ton mnemonic", () => {
    const mWords = [
        'parent', 'manual', 'come',
        'hello', 'way', 'shed',
        'example', 'photo', 'rocket',
        'rescue', 'keen', 'galaxy',
        'lift', 'treat', 'guess',
        'garment', 'zebra', 'secret',
        'credit', 'cloth', 'drip',
        'mad', 'obvious', 'buffalo'
    ];

    const expectedSeed = "8502f462b26de9b5e4b9369ee771c26b6176a60471a0047fdba77eb3036b2353";

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
        expect(publicKey).toBe("b4ca47eb85ea32a93899bdfe05fbc3511e43a34667f521238151191b4a72b94b");
    });
});

describe("venom", () => {
    test("venom getNewAddress", async () => {
        const seed = "fc81e6f42150458f53d8c42551a8ab91978a55d0e22b1fd890b85139086b93f8";
        const result = await venomWallet.getNewAddress({privateKey: seed});
        expect(result.address).toBe("0:6bef7d76e46fd1f308f0bf0b59f1ca6318aa6d950ea00aecc7d162218acaaa36");
    });

    test("venom validateAddress", async () => {
        const result = await venomWallet.validAddress({address: "0:6bef7d76e46fd1f308f0bf0b59f1ca6318aa6d950ea00aecc7d162218acaaa36"});
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
                expireAt: 1718863283n
            },
        };
        const tx = await venomWallet.signTransaction(param);
        const expected = {
            id: '36nIKSE6TW1nXCo7f3eXi4Db05YbWWE/359RdMVI2OI=',
            body: 'te6cckEBAgEArQAB34gA19767cjfo+YR4X4Ws+OUxjFU2yodQBXZj6LEQxWVVGwDEkiOl9C+/61RNiWRBtzYr+fzZ0gETOmvTCDLvRyasj8zPpbEDv4z1GgqgYYvPQlfvnYehdtg1h74Wb1LgVRgcl1JbFMzni2YAAAAIBwBAHBiAFqj1o70k/hufKm5ZrsxgXFkmomY67OaKgC+YpYKS5PgIC+vCAAAAAAAAAAAAAAAAAAAAAAAAP/2clI='
        };
        expect(tx).toEqual(expected);
    });
});
