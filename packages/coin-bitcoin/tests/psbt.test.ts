import {
    buildPsbt,
    extractPsbtTransaction,
    generateSignedBuyingTx,
    generateSignedListingPsbt,
    networks,
    TBtcWallet,
    toSignInput,
    utxoInput,
    utxoOutput,
    utxoTx,
    BtcXrcTypes,
    psbtSign,
    BtcWallet,
    wif2Public,
    privateKeyFromWIF,
    taprootTweakPubkey
} from "../src";
import * as bitcoin from '../src/bitcoinjs-lib'
import {SignTxParams} from "@okxweb3/coin-base";
import { tweakKey, tapleafHash, LEAF_VERSION_TAPSCRIPT} from "../src/bitcoinjs-lib/payments/bip341";
import {signUtil} from "@okxweb3/crypto-lib";
import {Tapleaf} from "../src/bitcoinjs-lib/types";

describe("psbt test", () => {
    const network = networks.testnet;
    test("buildPsbt", () => {
        const txInputs: utxoInput[] = [];
        txInputs.push({
            txId: "8a33c165574ec8bb7dd578e1d97b20952043da184196136deae3b237e8f6bf2a",
            vOut: 2,
            amount: 341474,
            address: "2NF33rckfiQTiE5Guk5ufUdwms8PgmtnEdc",
            privateKey: "L1vSc9DuBDeVkbiS79mJ441FNAYArcYp9A1c5ZJC5qVhLiuiopmK",
            publicKey: "0357bbb2d4a9cb8a2357633f201b9c518c2795ded682b7913c6beef3fe23bd6d2f",
            bip32Derivation: [
                {
                    "masterFingerprint": "a22e8e32",
                    "pubkey": "023f25a35d20804305e70f4223ed6b3aeb268b6781b95b6e5f7c84465f283c2425",
                    "path": "m/49'/0'/0'/0/0",
                },
            ],
        });
        txInputs.push({
            txId: "78d81df15795206560c5f4f49824a38deb0a63941c6d593ca12739b2d940c8cd",
            vOut: 0,
            amount: 200000,
            address: "tb1qtsq9c4fje6qsmheql8gajwtrrdrs38kdzeersc",
            privateKey: "L1vSc9DuBDeVkbiS79mJ441FNAYArcYp9A1c5ZJC5qVhLiuiopmK",
            bip32Derivation: [
                {
                    "masterFingerprint": "a22e8e32",
                    "pubkey": "023f25a35d20804305e70f4223ed6b3aeb268b6781b95b6e5f7c84465f283c2425",
                    "path": "m/49'/0'/0'/0/0",
                },
            ],
        });
        txInputs.push({
            txId: "78d81df15795206560c5f4f49824a38deb0a63941c6d593ca12739b2d940c8cd",
            vOut: 1,
            amount: 200000,
            address: "mouQtmBWDS7JnT65Grj2tPzdSmGKJgRMhE",
            privateKey: "L1vSc9DuBDeVkbiS79mJ441FNAYArcYp9A1c5ZJC5qVhLiuiopmK",
            nonWitnessUtxo: "02000000000104870fa29a7da1acff1cd4fb274fd15904ff1c867ad41d309577d4c8268ad0b9250000000000ffffffff1558fd0c79199219e27ce50e07a84c4b01d7563e5c53f9e6550d7c4450aa596d000000006b483045022100bd9b8c17d68efed18f0882bdb77db303a0a547864305e32ed7a9a951b650caa90220131c361e5c27652a3a05603306a87d8f6e117b78fdb1082db23d8960eb6214bf01210357bbb2d4a9cb8a2357633f201b9c518c2795ded682b7913c6beef3fe23bd6d2fffffffff06424462f9b8179b1cdc6229a4e213ff3628060b2a0a7680dae6740405cee3460000000000ffffffffa21ba51db540d68c0feaf3fb958058e1f2f123194f9238d9b2c86e04106c69d100000000171600145c005c5532ce810ddf20f9d1d939631b47089ecdffffffff06400d0300000000001600145c005c5532ce810ddf20f9d1d939631b47089ecd400d0300000000001976a9145c005c5532ce810ddf20f9d1d939631b47089ecd88aca08601000000000017a914ef05515a0595d15eaf90d9f62fb85873a6d8c0b487e4c2030000000000225120b7ee7f83a6a7fdb513040856c56778aa3abea9a451e0c9bb012f22a77ed99b21e803000000000000225120b7ee7f83a6a7fdb513040856c56778aa3abea9a451e0c9bb012f22a77ed99b21e803000000000000225120b7ee7f83a6a7fdb513040856c56778aa3abea9a451e0c9bb012f22a77ed99b2102483045022100a1d12dee8d87d2f8a12ff43f656a6b52183fa5ce4ffd1ab349b978d4dc5e68620220060d8c6d20ea34d3b2f744624d9f027c9020cb80cfb9babe015ebd70db0a927a01210357bbb2d4a9cb8a2357633f201b9c518c2795ded682b7913c6beef3fe23bd6d2f000141f24c018bc95e051c33e4659cacad365db8f3afbaf61ee163e3e1bf1d419baaeb681f681c75a545a19d4ade0b972e226448015d9cbdaee121f4148b5bee9d27068302483045022100bb251cc4a4db4eab3352d54541a03d20d5067e8261b6f7ba8a20a7d955dfafde022078be1dd187ff61934177a9245872f4a90beef32ec40b69f75d9c50c32053d97101210357bbb2d4a9cb8a2357633f201b9c518c2795ded682b7913c6beef3fe23bd6d2f00000000",
            bip32Derivation: [
                {
                    "masterFingerprint": "a22e8e32",
                    "pubkey": "023f25a35d20804305e70f4223ed6b3aeb268b6781b95b6e5f7c84465f283c2425",
                    "path": "m/49'/0'/0'/0/0",
                },
            ],
        });
        txInputs.push({
            txId: "78d81df15795206560c5f4f49824a38deb0a63941c6d593ca12739b2d940c8cd",
            vOut: 4,
            amount: 1000,
            address: "tb1pklh8lqax5l7m2ycypptv2emc4gata2dy28svnwcp9u32wlkenvsspcvhsr",
            privateKey: "L1vSc9DuBDeVkbiS79mJ441FNAYArcYp9A1c5ZJC5qVhLiuiopmK",
            publicKey: "0357bbb2d4a9cb8a2357633f201b9c518c2795ded682b7913c6beef3fe23bd6d2f",
            bip32Derivation: [
                {
                    "masterFingerprint": "a22e8e32",
                    "pubkey": "023f25a35d20804305e70f4223ed6b3aeb268b6781b95b6e5f7c84465f283c2425",
                    "path": "m/49'/0'/0'/0/0",
                    "leafHashes": ["57bbb2d4a9cb8a2357633f201b9c518c2795ded682b7913c6beef3fe23bd6d2f"]
                },
            ],
        });

        const txOutputs: utxoOutput[] = [];
        txOutputs.push({
            address: "tb1qtsq9c4fje6qsmheql8gajwtrrdrs38kdzeersc",
            amount: 2000,
        });
        txOutputs.push({
            address: "tb1qtsq9c4fje6qsmheql8gajwtrrdrs38kdzeersc",
            amount: 2000,
        });
        txOutputs.push({
            address: "tb1qtsq9c4fje6qsmheql8gajwtrrdrs38kdzeersc",
            amount: 20000,
        });
        txOutputs.push({
            address: "tb1qtsq9c4fje6qsmheql8gajwtrrdrs38kdzeersc",
            amount: 20000,
        });

        const uxtoTx: utxoTx = {
            inputs: txInputs as any,
            outputs: txOutputs as any,
            address: 'tb1qtsq9c4fje6qsmheql8gajwtrrdrs38kdzeersc',
        }
        const unSignedTx = buildPsbt(uxtoTx, networks.testnet);
        console.log(unSignedTx);
    });

    test("extract psbt transaction", () => {
        const signedTx = extractPsbtTransaction("70736274ff01007c0200000002bf4c1b2a577d9a05b4e6de983f15d06e4049695d30cc40f96a785b6467c8806a0000000000ffffffff3c76eff76c2de230444149fab382621ca0b218681feb6364ad0f4868aba104830100000000ffffffff017aa401000000000017a914626771730d7eee802eb817d34bbb4a4b4e6cf81e870000000000010120a08601000000000017a91417acd79b72f853f559df7e16b22d83cedaa5d4e687010717160014b38081b4b6a2bb9f81a05caf8db6d67ba4708fa201086b024730440220521e52e62f610bd3f4f47608636661d95e5c33e93436142e8fd1197f3d8f589c02202d69f116675c0811069e796f821d4ab0fac4ae87c2eaa085df035eea4322a2130121023f25a35d20804305e70f4223ed6b3aeb268b6781b95b6e5f7c84465f283c242500010120d02700000000000017a91417acd79b72f853f559df7e16b22d83cedaa5d4e687010717160014b38081b4b6a2bb9f81a05caf8db6d67ba4708fa201086b024730440220651cbe46bbeeebafe962a1b6ac75745ddbc2b91d45ddf1ee10ef47bedf7d2b7302201f136a87716bb6e575137634b85ec9fa6c0811c7f34c747e7b59fe96ac185c970121023f25a35d20804305e70f4223ed6b3aeb268b6781b95b6e5f7c84465f283c24250000");
        console.info(signedTx)
    });

    test("listing nft", async () => {
        const listingData = {
            nftAddress: "tb1pklh8lqax5l7m2ycypptv2emc4gata2dy28svnwcp9u32wlkenvsspcvhsr",
            nftUtxo: {
                txHash: "97367099510f513bfef4c33bdaa26f781ec7eeeab5902c76bc4ab71515a4f2cf",
                vout: 0,
                coinAmount: 546,
                rawTransation: "020000000001014a1a81fd15e4292acf8d0d104ac63b35b139d5402df22dcfc0c58678c4a588b00000000000ffffffff012202000000000000225120b7ee7f83a6a7fdb513040856c56778aa3abea9a451e0c9bb012f22a77ed99b210140a66fcbd645dd9fbb26c6bd406c51db967129a5f5af92603c1972f44eda2f8b2d69830912a7ffac0575bffd339a4e700afc49327aad10a0ef1802334e8ba557ee00000000",
            },
            receiveBtcAddress: "tb1pklh8lqax5l7m2ycypptv2emc4gata2dy28svnwcp9u32wlkenvsspcvhsr",
            price: 1000,
        };
        const privateKey = "cPnvkvUYyHcSSS26iD1dkrJdV7k1RoUqJLhn3CYxpo398PdLVE22";

        const psbt = generateSignedListingPsbt(listingData, privateKey, networks.testnet);
        console.log(psbt);
    });

    test("buying nft", async () => {
        const buyingData = {
            dummyUtxos: [
                {
                    txHash: "db33e7c16ef287d2789518a52ef651d1a30b4626de7db43228244bb8b4409167",
                    vout: 0,
                    coinAmount: 600,
                    rawTransation: "0100000001f2ae9f2ef29d2db5b0b324a24f60437c802faa5e0edb267e6715b8810e1b46d2010000006a47304402204f40f658b85c7cd17014c53a840551684b5126a96fbab90ca90cd0c70d21cccf02207ee96d3ede74b38ad217d0842b425d1d4ecd947ca9f71a6530392934a74a05c201210357bbb2d4a9cb8a2357633f201b9c518c2795ded682b7913c6beef3fe23bd6d2fffffffff0458020000000000001976a9145c005c5532ce810ddf20f9d1d939631b47089ecd88ac58020000000000001976a9145c005c5532ce810ddf20f9d1d939631b47089ecd88ac58020000000000001976a9145c005c5532ce810ddf20f9d1d939631b47089ecd88ac04ff0200000000001976a9145c005c5532ce810ddf20f9d1d939631b47089ecd88ac00000000",
                },
                {
                    txHash: "db33e7c16ef287d2789518a52ef651d1a30b4626de7db43228244bb8b4409167",
                    vout: 1,
                    coinAmount: 600,
                    rawTransation: "0100000001f2ae9f2ef29d2db5b0b324a24f60437c802faa5e0edb267e6715b8810e1b46d2010000006a47304402204f40f658b85c7cd17014c53a840551684b5126a96fbab90ca90cd0c70d21cccf02207ee96d3ede74b38ad217d0842b425d1d4ecd947ca9f71a6530392934a74a05c201210357bbb2d4a9cb8a2357633f201b9c518c2795ded682b7913c6beef3fe23bd6d2fffffffff0458020000000000001976a9145c005c5532ce810ddf20f9d1d939631b47089ecd88ac58020000000000001976a9145c005c5532ce810ddf20f9d1d939631b47089ecd88ac58020000000000001976a9145c005c5532ce810ddf20f9d1d939631b47089ecd88ac04ff0200000000001976a9145c005c5532ce810ddf20f9d1d939631b47089ecd88ac00000000",
                },
                {
                    txHash: "db33e7c16ef287d2789518a52ef651d1a30b4626de7db43228244bb8b4409167",
                    vout: 2,
                    coinAmount: 600,
                    rawTransation: "0100000001f2ae9f2ef29d2db5b0b324a24f60437c802faa5e0edb267e6715b8810e1b46d2010000006a47304402204f40f658b85c7cd17014c53a840551684b5126a96fbab90ca90cd0c70d21cccf02207ee96d3ede74b38ad217d0842b425d1d4ecd947ca9f71a6530392934a74a05c201210357bbb2d4a9cb8a2357633f201b9c518c2795ded682b7913c6beef3fe23bd6d2fffffffff0458020000000000001976a9145c005c5532ce810ddf20f9d1d939631b47089ecd88ac58020000000000001976a9145c005c5532ce810ddf20f9d1d939631b47089ecd88ac58020000000000001976a9145c005c5532ce810ddf20f9d1d939631b47089ecd88ac04ff0200000000001976a9145c005c5532ce810ddf20f9d1d939631b47089ecd88ac00000000",
                },
            ],
            paymentUtxos: [
                {
                    txHash: "db33e7c16ef287d2789518a52ef651d1a30b4626de7db43228244bb8b4409167",
                    vout: 3,
                    coinAmount: 196356,
                    rawTransation: "0100000001f2ae9f2ef29d2db5b0b324a24f60437c802faa5e0edb267e6715b8810e1b46d2010000006a47304402204f40f658b85c7cd17014c53a840551684b5126a96fbab90ca90cd0c70d21cccf02207ee96d3ede74b38ad217d0842b425d1d4ecd947ca9f71a6530392934a74a05c201210357bbb2d4a9cb8a2357633f201b9c518c2795ded682b7913c6beef3fe23bd6d2fffffffff0458020000000000001976a9145c005c5532ce810ddf20f9d1d939631b47089ecd88ac58020000000000001976a9145c005c5532ce810ddf20f9d1d939631b47089ecd88ac58020000000000001976a9145c005c5532ce810ddf20f9d1d939631b47089ecd88ac04ff0200000000001976a9145c005c5532ce810ddf20f9d1d939631b47089ecd88ac00000000",
                },
            ],
            receiveNftAddress: "tb1qtsq9c4fje6qsmheql8gajwtrrdrs38kdzeersc",
            paymentAndChangeAddress: "mouQtmBWDS7JnT65Grj2tPzdSmGKJgRMhE",
            feeRate: 2,
            sellerPsbts: [
                "cHNidP8BAP0GAQIAAAADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAA/////yktzuy4Gz48eTR5tD2DPHgpY5co2lqi3WSMs0IXgnHmAAAAAAD/////AwAAAAAAAAAAIlEgwSVNrUCq6hIeU+DOwJmGNi9s1CInltGUjJR5GzUoHLUAAAAAAAAAACJRIMElTa1AquoSHlPgzsCZhjYvbNQiJ5bRlIyUeRs1KBy16AMAAAAAAAAiUSC37n+Dpqf9tRMECFbFZ3iqOr6ppFHgybsBLyKnftmbIQAAAAAAAQErAAAAAAAAAAAiUSDBJU2tQKrqEh5T4M7AmYY2L2zUIieW0ZSMlHkbNSgctQABASsAAAAAAAAAACJRIMElTa1AquoSHlPgzsCZhjYvbNQiJ5bRlIyUeRs1KBy1AAEBKyICAAAAAAAAIlEgt+5/g6an/bUTBAhWxWd4qjq+qaRR4Mm7AS8ip37ZmyEBAwSDAAAAARNByNGmmia8A8kdxaiytm1k3F7WScd9ovE+kr/UdU/48My3wrD0x6tpfU/GesAhY+/FGIBYjmW3eWxEoJtLdYp1RYMBFyBXu7LUqcuKI1djPyAbnFGMJ5Xe1oK3kTxr7vP+I71tLwAAAAA=",
                "cHNidP8BAP0GAQIAAAADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAA/////8/ypBUVt0q8diyQteruxx54b6LaO8P0/jtRD1GZcDaXAAAAAAD/////AwAAAAAAAAAAIlEgwSVNrUCq6hIeU+DOwJmGNi9s1CInltGUjJR5GzUoHLUAAAAAAAAAACJRIMElTa1AquoSHlPgzsCZhjYvbNQiJ5bRlIyUeRs1KBy16AMAAAAAAAAiUSC37n+Dpqf9tRMECFbFZ3iqOr6ppFHgybsBLyKnftmbIQAAAAAAAQErAAAAAAAAAAAiUSDBJU2tQKrqEh5T4M7AmYY2L2zUIieW0ZSMlHkbNSgctQABASsAAAAAAAAAACJRIMElTa1AquoSHlPgzsCZhjYvbNQiJ5bRlIyUeRs1KBy1AAEBKyICAAAAAAAAIlEgt+5/g6an/bUTBAhWxWd4qjq+qaRR4Mm7AS8ip37ZmyEBAwSDAAAAARNBa6RN4o5Mkh82QNkBayEorbJHM6ilYqJTEige2etPxCrfulIrxXT4QsOs9kPhPQrB99/2Gz5IBQq26l5n57HCXoMBFyBXu7LUqcuKI1djPyAbnFGMJ5Xe1oK3kTxr7vP+I71tLwAAAAA=",
            ],
        };
        const privateKey = "cPnvkvUYyHcSSS26iD1dkrJdV7k1RoUqJLhn3CYxpo398PdLVE22";

        const tx = generateSignedBuyingTx(buyingData, privateKey, networks.testnet);
        console.log(tx);
    });

    test("psbt sign", async () => {
        const psbtBase64 = "cHNidP8BAFMCAAAAAQZCRGL5uBebHNxiKaTiE/82KAYLKgp2gNrmdAQFzuNGAAAAAAD/////AaCGAQAAAAAAF6kU7wVRWgWV0V6vkNn2L7hYc6bYwLSHAAAAAAABASsiAgAAAAAAACJRILfuf4Omp/21EwQIVsVneKo6vqmkUeDJuwEvIqd+2ZshAQMEgwAAAAEXIFe7stSpy4ojV2M/IBucUYwnld7WgreRPGvu8/4jvW0vAAA=";
        const privateKey = "cPnvkvUYyHcSSS26iD1dkrJdV7k1RoUqJLhn3CYxpo398PdLVE22";
        const signedPsbt = psbtSign(psbtBase64, privateKey, networks.testnet);
        console.log(signedPsbt);
    });

    test("psbt sign none fail", async () => {
        const psbtBase64 ="cHNidP8BAFMCAAAAAQZCRGL5uBebHNxiKaTiE/82KAYLKgp2gNrmdAQFzuNGAAAAAAD/////AaCGAQAAAAAAF6kU7wVRWgWV0V6vkNn2L7hYc6bYwLSHAAAAAAABASsiAgAAAAAAACJRILfuf4Omp/21EwQIVsVneKo6vqmkUeDJuwEvIqd+2ZshAQMEAgAAAAEXIFe7stSpy4ojV2M/IBucUYwnld7WgreRPGvu8/4jvW0vAAA="
        const privateKey = "cPnvkvUYyHcSSS26iD1dkrJdV7k1RoUqJLhn3CYxpo398PdLVE22";
        const signedPsbt = psbtSign(psbtBase64, privateKey, networks.testnet);
        console.log(signedPsbt);
        expect(signedPsbt).toEqual(psbtBase64)
    });

    test("psbt sign single fail", async () => {
        const psbtBase64 = "cHNidP8BAFMCAAAAAQZCRGL5uBebHNxiKaTiE/82KAYLKgp2gNrmdAQFzuNGAAAAAAD/////AaCGAQAAAAAAF6kU7wVRWgWV0V6vkNn2L7hYc6bYwLSHAAAAAAABASsiAgAAAAAAACJRILfuf4Omp/21EwQIVsVneKo6vqmkUeDJuwEvIqd+2ZshAQMEAwAAAAEXIFe7stSpy4ojV2M/IBucUYwnld7WgreRPGvu8/4jvW0vAAA="
        const privateKey = "cPnvkvUYyHcSSS26iD1dkrJdV7k1RoUqJLhn3CYxpo398PdLVE22";
        const signedPsbt = psbtSign(psbtBase64, privateKey, networks.testnet);
        console.log(signedPsbt);
        expect(signedPsbt).toEqual(psbtBase64)
    });

    test("sign psbt with key path and script path", async () => {
        const network = networks.testnet;
        const psbtHex = "70736274ff0100740200000001258fedc4ea8a2945ef64bc4388ab79e8ab8a173894342c2449bfeb3c6bf5b7ea0000000000ffffffff02e8030000000000001976a9142c8826cd93b186b81c1926115e0287efbf23486a88ac401f000000000000160014505049839bc32f869590adc5650c584e17c917fc000000000001012b10270000000000002251203d558197d465de33a5fbc3c2a879e51d5c16a4ae90fcf6aa8f27fb483421f2284215c150929b74c1a04954b78b4b6035e97a5e078a5a0f28ec96d547bfee9ace803ac0571c2083eaabb20407f08f81edd91590dcf4e9c42d7d69bb82520a5d22a4c3eff120b4b25d72d2d813bee73c679473ddb5f47956ae93e41a3e16b60a7190bccb78afad20a37236e8875b30cad25a3c7df7d07fd09ef29331f8e270ad954f6ba9b42d5bd6ad2057349e985e742d5131e1e2b227b5170f6350ac2e2feb72254fcc25b3cee21a18ac2059d3532148a597a2d05c0395bf5f7176044b1cd312f37701a9b4d0aad70bc5a4ba20a5c60c2188e833d39d0fa798ab3f69aa12ed3dd2f3bad659effa252782de3c31ba20c8ccb03c379e452f10c81232b41a1ca8b63d0baf8387e57d302c987e5abb8527ba20ffeaec52a9b407b355ef6967a7ffc15fd6c3fe07de2844d61550475e7a5233e5ba53a2c001172050929b74c1a04954b78b4b6035e97a5e078a5a0f28ec96d547bfee9ace803ac0000000";
        const privateKey = "cPnvkvUYyHcSSS26iD1dkrJdV7k1RoUqJLhn3CYxpo398PdLVE22";
        const toSignInputs: toSignInput[] = [];
        toSignInputs.push({
            index: 2,
            address: "tb1pyrujq6htc7crmd3uejdkllhk0kctahkfxq75dflnqlg846kgl34qpawucx",
            sighashTypes: [0],
            disableTweakSigner: false,
        });
        let wallet = new TBtcWallet()
        let params = {
            type: 3,
            psbt: psbtHex,
            autoFinalized: false,
            toSignInputs: toSignInputs,
        };
        let signParams: SignTxParams = {
            privateKey: "cPnvkvUYyHcSSS26iD1dkrJdV7k1RoUqJLhn3CYxpo398PdLVE22",
            data: params,
        };
        let signedPsbtHex = await wallet.signTransaction(signParams);
        console.info(signedPsbtHex);
        const expected = "70736274ff0100740200000001258fedc4ea8a2945ef64bc4388ab79e8ab8a173894342c2449bfeb3c6bf5b7ea0000000000ffffffff02e8030000000000001976a9142c8826cd93b186b81c1926115e0287efbf23486a88ac401f000000000000160014505049839bc32f869590adc5650c584e17c917fc000000000001012b10270000000000002251203d558197d465de33a5fbc3c2a879e51d5c16a4ae90fcf6aa8f27fb483421f2284215c150929b74c1a04954b78b4b6035e97a5e078a5a0f28ec96d547bfee9ace803ac0571c2083eaabb20407f08f81edd91590dcf4e9c42d7d69bb82520a5d22a4c3eff120b4b25d72d2d813bee73c679473ddb5f47956ae93e41a3e16b60a7190bccb78afad20a37236e8875b30cad25a3c7df7d07fd09ef29331f8e270ad954f6ba9b42d5bd6ad2057349e985e742d5131e1e2b227b5170f6350ac2e2feb72254fcc25b3cee21a18ac2059d3532148a597a2d05c0395bf5f7176044b1cd312f37701a9b4d0aad70bc5a4ba20a5c60c2188e833d39d0fa798ab3f69aa12ed3dd2f3bad659effa252782de3c31ba20c8ccb03c379e452f10c81232b41a1ca8b63d0baf8387e57d302c987e5abb8527ba20ffeaec52a9b407b355ef6967a7ffc15fd6c3fe07de2844d61550475e7a5233e5ba53a2c001172050929b74c1a04954b78b4b6035e97a5e078a5a0f28ec96d547bfee9ace803ac0000000";
    });

    test("sign psbt with key path and script path for batch", async () => {
        const network = networks.testnet;
        const psbtHex = "70736274ff0100740200000001258fedc4ea8a2945ef64bc4388ab79e8ab8a173894342c2449bfeb3c6bf5b7ea0000000000ffffffff02e8030000000000001976a9142c8826cd93b186b81c1926115e0287efbf23486a88ac401f000000000000160014505049839bc32f869590adc5650c584e17c917fc000000000001012b10270000000000002251203d558197d465de33a5fbc3c2a879e51d5c16a4ae90fcf6aa8f27fb483421f2284215c150929b74c1a04954b78b4b6035e97a5e078a5a0f28ec96d547bfee9ace803ac0571c2083eaabb20407f08f81edd91590dcf4e9c42d7d69bb82520a5d22a4c3eff120b4b25d72d2d813bee73c679473ddb5f47956ae93e41a3e16b60a7190bccb78afad20a37236e8875b30cad25a3c7df7d07fd09ef29331f8e270ad954f6ba9b42d5bd6ad2057349e985e742d5131e1e2b227b5170f6350ac2e2feb72254fcc25b3cee21a18ac2059d3532148a597a2d05c0395bf5f7176044b1cd312f37701a9b4d0aad70bc5a4ba20a5c60c2188e833d39d0fa798ab3f69aa12ed3dd2f3bad659effa252782de3c31ba20c8ccb03c379e452f10c81232b41a1ca8b63d0baf8387e57d302c987e5abb8527ba20ffeaec52a9b407b355ef6967a7ffc15fd6c3fe07de2844d61550475e7a5233e5ba53a2c001172050929b74c1a04954b78b4b6035e97a5e078a5a0f28ec96d547bfee9ace803ac0000000";
        const privateKey = "cPnvkvUYyHcSSS26iD1dkrJdV7k1RoUqJLhn3CYxpo398PdLVE22";
        const toSignInputs: toSignInput[] = [];
        toSignInputs.push({
            index: 2,
            address: "tb1pyrujq6htc7crmd3uejdkllhk0kctahkfxq75dflnqlg846kgl34qpawucx",
            sighashTypes: [0],
            disableTweakSigner: false,
        });
        let wallet = new TBtcWallet()
        let params = {
            type: 4,
            psbtHexs: [psbtHex],
            options: [{
                autoFinalized: false,
                toSignInputs: toSignInputs,
            }],
        };
        let signParams: SignTxParams = {
            privateKey: "cPnvkvUYyHcSSS26iD1dkrJdV7k1RoUqJLhn3CYxpo398PdLVE22",
            data: params,
        };
        let signedPsbtHex = await wallet.signTransaction(signParams);
        console.info(signedPsbtHex);
        const expected = '70736274ff0100740200000001258fedc4ea8a2945ef64bc4388ab79e8ab8a173894342c2449bfeb3c6bf5b7ea0000000000ffffffff02e8030000000000001976a9142c8826cd93b186b81c1926115e0287efbf23486a88ac401f000000000000160014505049839bc32f869590adc5650c584e17c917fc000000000001012b10270000000000002251203d558197d465de33a5fbc3c2a879e51d5c16a4ae90fcf6aa8f27fb483421f2284215c150929b74c1a04954b78b4b6035e97a5e078a5a0f28ec96d547bfee9ace803ac0571c2083eaabb20407f08f81edd91590dcf4e9c42d7d69bb82520a5d22a4c3eff120b4b25d72d2d813bee73c679473ddb5f47956ae93e41a3e16b60a7190bccb78afad20a37236e8875b30cad25a3c7df7d07fd09ef29331f8e270ad954f6ba9b42d5bd6ad2057349e985e742d5131e1e2b227b5170f6350ac2e2feb72254fcc25b3cee21a18ac2059d3532148a597a2d05c0395bf5f7176044b1cd312f37701a9b4d0aad70bc5a4ba20a5c60c2188e833d39d0fa798ab3f69aa12ed3dd2f3bad659effa252782de3c31ba20c8ccb03c379e452f10c81232b41a1ca8b63d0baf8387e57d302c987e5abb8527ba20ffeaec52a9b407b355ef6967a7ffc15fd6c3fe07de2844d61550475e7a5233e5ba53a2c001172050929b74c1a04954b78b4b6035e97a5e078a5a0f28ec96d547bfee9ace803ac0000000';
    });

    test("build psbt raw tx", async () => {
        const txInputs: utxoInput[] = [];
        txInputs.push({
            txId: "b892ae38e36586e8aee1f4dee4614abd095f29c88c127ce51767847be402fa54",
            vOut: 5,
            amount: 1970000,
            address: "tb1pyrujq6htc7crmd3uejdkllhk0kctahkfxq75dflnqlg846kgl34qpawucx",
            privateKey: "cPnvkvUYyHcSSS26iD1dkrJdV7k1RoUqJLhn3CYxpo398PdLVE22",
            publicKey: "034687b85f378c8c2cee301220301677ab96c4da816fd93e1c7f85fe8df605d745",
        });
        const txOutputs: utxoOutput[] = [];
        txOutputs.push({
            address: "tb1qmfct8s72m70y9qu78k67q2synmc3dpdx04jvcs",
            amount: 1969500,
        });
        const uxtoTx: utxoTx = {
            inputs: txInputs as any,
            outputs: txOutputs as any,
            address: 'tb1qmfct8s72m70y9qu78k67q2synmc3dpdx04jvcs',
        }
        const raw = buildPsbt(uxtoTx, networks.testnet);
        console.log(raw);
    });
});
describe('psbt key and script path', () => {
    const wallet = new BtcWallet()
    async function signPsbt(privKey: string, psbt: string, toSignInputs?: toSignInput[], autoFinalized = false) {
        let signParams = {
            privateKey: privKey,
            data: {
                type: BtcXrcTypes.PSBT_KEY_SCRIPT_PATH,
                psbt,
                toSignInputs,
                autoFinalized,
            },
        };

        return await wallet.signTransaction(signParams)
    }

    function prettyLog(obj: any, name?: string) {
        const convertBuffers = (value: any): any => {
            if (Buffer.isBuffer(value)) {
                return value.toString('hex'); // Convert Buffer to hex string
            } else if (Array.isArray(value)) {
                return value.map(convertBuffers); // Recursively process arrays
            } else if (value && typeof value === 'object') {
                // @ts-ignore
                return Object.fromEntries(
                    Object.entries(value).map(([key, val]) => [key, convertBuffers(val)])
                ); // Recursively process objects
            }
            return value; // Return the value as-is if it's neither a Buffer, array, nor object
        };

        console.log(`${name ? name + ':' : ''}`, JSON.stringify(convertBuffers(obj), null, 2)); // Pretty print with 2-space indentation
    }

    function getPubKeys(privKey: string) {
        console.log('WIF:', privKey)
        console.log("Private Key:", privateKeyFromWIF(privKey));

        const pubKey = wif2Public(privKey)
        const pubKeyX = pubKey.slice(1, 33)
        console.log("Public Key:", pubKey.toString('hex'));

        const tweakPubKeyX = tweakKey(pubKeyX, undefined)?.x!
        console.log("Tweaked Public Key X:", tweakPubKeyX.toString('hex'));

        const pubKeyXHash = bitcoin.crypto.hash160(pubKeyX);
        console.log("PubKey Hash:", pubKeyXHash.toString('hex'));

        return {pubKey, pubKeyX, pubKeyXHash, tweakPubKeyX}
    }

    type getWitnessFn = (signature: Buffer) => Buffer[]

    async function testSignTapScript(
        privKey: string,
        tapScript: Buffer,
        pubKeyX: Buffer,
        getWitnessFn: getWitnessFn,
        txid: string,
        outputAmount = 1250,
        verifyPubKey = pubKeyX,
        useMerkleRoot = false,
        disableTweakSigner?: boolean,
        useTweakSigner?: boolean,
        useKeySig = false,
        network?: bitcoin.networks.Network
    ) {

        network = network || bitcoin.networks.testnet

        console.log('TapScript:', tapScript.toString('hex'))
        const tapLeaf: Tapleaf = {output: tapScript, version: LEAF_VERSION_TAPSCRIPT}
        const leafHash = tapleafHash(tapLeaf)

        const {
            address,
            output: inputScript,
            hash: merkleRoot,
        } = bitcoin.payments.p2tr({
            internalPubkey: pubKeyX,
            scriptTree: tapLeaf,
            network,
        });

        const [tpk1, parity] = taprootTweakPubkey(pubKeyX, merkleRoot!)
        const realTweakPubKeyX = Buffer.from(tpk1)
        const controlBlock = Buffer.concat([
            Buffer.from([LEAF_VERSION_TAPSCRIPT | parity]), // Tapleaf version
            pubKeyX, // X-only public key
        ]);

        console.log("Taproot Address:", address);
        console.log('Leaf Hash:', leafHash!.toString('hex'))
        console.log('Merkle Root:', merkleRoot!.toString('hex')) // should be = leafHash as only one leaf in tree
        console.log('Real Tweak Public Key X:', realTweakPubKeyX.toString('hex'))
        console.log('Input Script:', inputScript!.toString('hex')) // should be '0x5120' + realTweakPubKeyX
        console.log('Control Block:', controlBlock.toString('hex'))

        // Create a transaction to spend the Taproot output
        const psbt = new bitcoin.psbt.Psbt({network});

        // Input
        const vout = 0;
        const inputValue = 1500;

        // Output
        // const recipientAddress = "bc1pnyd20hgcmte5seggdj98cy62eqa7ur7fy9lvx3k38qj85ttwdxpqft47ex";
        const recipientAddress = "tb1qwdahu2zgp9t5768kececmrlssvk0vzk2rnr6ya";
        // const amountToSend = 1400;
        const amountToSend = outputAmount;
        psbt.addOutput({
            address: recipientAddress,
            value: amountToSend,
        });


        const inputData: any = {
            hash: txid,
            index: vout,
            witnessUtxo: {
                script: inputScript!,
                value: inputValue,
            },
            tapInternalKey: pubKeyX, // Required for spending from a Taproot output
            tapLeafScript: [
                {

                    leafVersion: LEAF_VERSION_TAPSCRIPT,
                    script: tapScript,
                    controlBlock: controlBlock,
                },
            ],
        }
        if (useMerkleRoot) {
            inputData.tapMerkleRoot = merkleRoot
        }
        psbt.addInput(inputData);

        const psbtHex = psbt.toHex();
        console.log("PSBT to be signed:", psbtHex);
        prettyLog(psbt.data, 'Unsigned Psbt')

        const inputIndex = 0
        const toSignInputs = [{
            index: inputIndex,
            address: address,
            disableTweakSigner,
            useTweakSigner,
        }]
        const signedPsbtHex = await signPsbt(privKey, psbtHex, toSignInputs,)
        const signedPsbt = bitcoin.psbt.Psbt.fromHex(signedPsbtHex)

        console.log("Signed PSBT:", signedPsbtHex);
        prettyLog(signedPsbt.data, 'Signed Psbt')

        // Extracting the signatures and tx from the signed psbt
        const tapKeySig = signedPsbt.data.inputs[0].tapKeySig
        const tapScriptSig = signedPsbt.data.inputs[0].tapScriptSig
        const tx = signedPsbt.finalizeAllInputs().extractTransaction();

        // Add the signatures to the tx input witness
        if (tapKeySig && useKeySig) {
            tx.ins[inputIndex].witness = [tapKeySig]
            console.log('TapKeySig added to witness')
        } else if (tapScriptSig) {
            tx.ins[inputIndex].witness = [
                ...getWitnessFn(tapScriptSig[0].signature),
                tapScript,
                controlBlock,
            ]
            console.log('TapScriptSig added to witness')
        } else {
            console.log('No signature found')
        }

        prettyLog(tx, 'Final Tx')

        console.log("Tx Id:", tx.getId());
        console.log("Final Tx Hex:", tx.toHex());
        console.log("Fee Rate:", signedPsbt.getFee() / tx.virtualSize())

        const h = tx.hashForWitnessV1(
            inputIndex,
            psbt.data.inputs.map(i => i.witnessUtxo?.script!),
            psbt.data.inputs.map(i => i.witnessUtxo?.value!),
            0,
            leafHash,
        )
        if (useMerkleRoot){
            verifyPubKey = realTweakPubKeyX
        }

        console.log(verifyPubKey.toString('hex'))

        const valid = signUtil.schnorr.secp256k1.schnorr.verify(tapScriptSig![0].signature, h, verifyPubKey)
        console.log("Is Valid Schnorr Signature:", valid)
        return valid
    }

    test('psbt script key path', async () => {
        const privKey = 'L3tMcMa65VSvZNtSRAE75W2HKzkhB3Mqj8FjP5ct4QUaHcznHhYh'
        const {pubKeyX} = getPubKeys(privKey)

        const tapScript = bitcoin.script.compile([
            pubKeyX,
            bitcoin.script.OPS.OP_CHECKSIG,
        ]);
        const prevOutTxId = '3ca3765b28b9c23b1b13b3d63a8f295d9dc2e631fb49f99514564a42ef86be0f'
        const valid = await testSignTapScript(
            privKey,
            tapScript,
            pubKeyX,
            (signature) => [signature],
            prevOutTxId,
            1250,
            pubKeyX,
            true, // Must use correct merkle root
        )
        expect(valid).toBeTruthy()

        const valid_unisat = await testSignTapScript(
          privKey,
          tapScript,
          pubKeyX,
          (signature) => [signature],
          prevOutTxId,
          1250,
          pubKeyX,
          true, // Must use correct merkle root
          true, // disableTweakSigner has no effect when useTweakSigner is set
          false // setting useTweakSigner to follow unisat behavior
      )
      expect(valid_unisat).toBeTruthy()
    });

    test('psbt script spend path pub key', async () => {
        const privKey = 'L3tMcMa65VSvZNtSRAE75W2HKzkhB3Mqj8FjP5ct4QUaHcznHhYh'
        const {pubKeyX} = getPubKeys(privKey)
        const tapScript = bitcoin.script.compile([
            pubKeyX,
            bitcoin.script.OPS.OP_CHECKSIG,
        ]);
        const prevOutTxId = 'f44a99bd7c8e4f0439a9fb5aedda4a1fa954088145c0397e906df318fc3b9c88'
        const valid = await testSignTapScript(
            privKey,
            tapScript,
            pubKeyX,
            (signature) => [signature],
            prevOutTxId,

        )
        expect(valid).toBeTruthy()
    });

    test('psbt script key path tweak pub key', async () => {
      const privKey = 'L3tMcMa65VSvZNtSRAE75W2HKzkhB3Mqj8FjP5ct4QUaHcznHhYh'
      const {pubKeyX, tweakPubKeyX} = getPubKeys(privKey)

      const tapScript = bitcoin.script.compile([
          tweakPubKeyX,
          bitcoin.script.OPS.OP_CHECKSIG,
      ]);
      const prevOutTxId = '3ca3765b28b9c23b1b13b3d63a8f295d9dc2e631fb49f99514564a42ef86be0f'
      const valid = await testSignTapScript(
          privKey,
          tapScript,
          tweakPubKeyX,
          (signature) => [signature],
          prevOutTxId,
          1250,
          tweakPubKeyX,
          true, // Must use correct merkle root
          false, // disableTweakSigner has no effect when useTweakSigner is set
          true // setting useTweakSigner to follow unisat behavior
      )
      expect(valid).toBeTruthy()
  });

    test('psbt script spend path tweak pub key', async () => {
        const privKey = 'L3tMcMa65VSvZNtSRAE75W2HKzkhB3Mqj8FjP5ct4QUaHcznHhYh'
        const {pubKeyX, tweakPubKeyX} = getPubKeys(privKey)

        const tapScript = bitcoin.script.compile([
            tweakPubKeyX,
            bitcoin.script.OPS.OP_CHECKSIG,
        ]);

        const prevOutTxId = '22c2ffa333f0838d593c58c758b59d8bfd5b7713347b194f8018f74f20db8d3d'
        const valid = await testSignTapScript(
            privKey,
            tapScript,
            pubKeyX,
            (signature) => [signature],
            prevOutTxId,
            1250,
            tweakPubKeyX,
            false,
            false,
            true
        )
        expect(valid).toBeTruthy()
    });

    test('psbt script spend path pub key hash', async () => {
        const privKey = 'L3tMcMa65VSvZNtSRAE75W2HKzkhB3Mqj8FjP5ct4QUaHcznHhYh'

        const {pubKeyX, pubKeyXHash} = getPubKeys(privKey)

        const tapScript = bitcoin.script.compile([
            bitcoin.script.OPS.OP_DUP,
            bitcoin.script.OPS.OP_HASH160,
            pubKeyXHash,
            bitcoin.script.OPS.OP_EQUALVERIFY,
            bitcoin.script.OPS.OP_CHECKSIG,
        ]);

        const prevOutTxId = '22c2ffa333f0838d593c58c758b59d8bfd5b7713347b194f8018f74f20db8d3d'
        const valid = await testSignTapScript(
            privKey,
            tapScript,
            pubKeyX,
            (signature) => [signature, pubKeyX],
            prevOutTxId,
        )
        expect(valid).toBeTruthy()
    });

});
