import {web3, spl, api, SolWallet} from "../src"
import {PublicKey, ComputeBudgetProgram} from "../src/sdk/web3";
import {TokenStandard, transferNftBuilder, getSignedTransaction} from "../src/sdk/metaplex";
import {base} from "@okxweb3/crypto-lib";
import {ed25519_getRandomPrivateKey} from "@okxweb3/coin-base";
import {TOKEN_2022_PROGRAM_ID} from "../src/sdk/spl";
import {deserializeMessages} from "../src/api";
const privateKey = "037f00373589c700a411382ae702e258b01f30a509a32be2b2c84fb54de4c1e5fd5fd86d7d7b8355492b1517a96a2fbb17e1a374b80a21559bdfee0dfbaa0b32";
const privateKeyBase58 = base.toBase58(base.fromHex(privateKey))
describe("address", () => {
    test('private key', () => {
        let key = ed25519_getRandomPrivateKey(true, 'hex')
        let key1 = ed25519_getRandomPrivateKey(true, 'base58')
        console.log(key)
        console.log(key1)
    })

    test("getNewAddress", async () => {
        const address = api.getNewAddress(privateKeyBase58);
        console.info(address);

        const valid = api.validAddress(address);
        console.info(valid);
    });

    test("transfer", async () => {
        const fromAddress = api.getNewAddress(privateKeyBase58);
        const toAddress = "7NRmECq1R4tCtXNvmvDAuXmii3vN1J9DRZWhMCuuUnkM"
        const amount = 1000000000
        const blockHash = "BHgsBbx9VQWsWdASiNC2wLq8aWFhuzJvpuwyKp2Jukk5";
        const rawTransaction = api.createRawTransaction(fromAddress, blockHash)

        // set priority fee
        const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
            units: 1400000 // default: 200000 =0.2 * 10^6
        });

        const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
            microLamports: 10 // 1 = 1*10-6 lamport default: 0
        });
        rawTransaction.add(modifyComputeUnits).add(addPriorityFee);

        await api.appendTransferInstruction(rawTransaction, fromAddress, toAddress, amount)
        const data = await api.signTransaction(rawTransaction, privateKeyBase58)
        console.info(data);
    });

    test("associatedTokenAddress", async () => {
        const wallet = "9F3m9cPLjN4abNCoKPY9MKSc8zbzcoUoFSEiZ9hyU9Hb"
        const mint = "EE5L8cMU4itTsCSuor7NLK6RZx6JhsBe8GGV3oaAHm3P"
        const associatedAddress = await spl.getAssociatedTokenAddress(new web3.PublicKey(mint), new web3.PublicKey(wallet))
        console.info(new web3.PublicKey(associatedAddress).toString());
    });

    test("associatedToken2022Address", async () => {
        const wallet = "9F3m9cPLjN4abNCoKPY9MKSc8zbzcoUoFSEiZ9hyU9Hb"
        const mint = "EE5L8cMU4itTsCSuor7NLK6RZx6JhsBe8GGV3oaAHm3P"
        const associatedAddressToken2022 = await spl.getAssociatedTokenAddress(new web3.PublicKey(mint), new web3.PublicKey(wallet), false, TOKEN_2022_PROGRAM_ID);
        console.info(new web3.PublicKey(associatedAddressToken2022).toString());
    });


    test("tokenTransfer", async () => {
        const fromAddress = api.getNewAddress(privateKeyBase58);
        const toAddress = "8DDy3CyJ8e3aGfAVn8PQPZ1jC5mAuNxNF9XbhbyPaFN4"
        const amount = 1000000
        const blockHash = "G6WMViEhWA2TM8AwFwG5FfcVow2WrfqVN7HsnTEcKgYz";
        const mint = "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"
        const rawTransaction = api.createRawTransaction(fromAddress, blockHash)
        await api.appendTokenTransferInstruction(rawTransaction, fromAddress, toAddress, mint, amount, true)
        const data = await api.signTransaction(rawTransaction, privateKeyBase58)
        console.info(data);
    });

    test("token2022Transfer", async () => {
        const fromAddress = api.getNewAddress(privateKeyBase58);
        const toAddress = "GbDq1KMiTmSys7SPwNTJVF3oSvnpirihdZyqpNTBnf3R";
        const amount = 1000000000;
        const blockHash = "C7pe2gPQir87kwGGwAV9DunqLn2bMrQshWVxe3f262Vt";
        const mint = "FTDMffVuqMpPPTdfaDTNgMTx7A8xe2jpPQBzMq3D85yi";
        const decimal = 9;
        const rawTransaction = api.createRawTransaction(fromAddress, blockHash);
        // set priority fee
        const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
            units: 1400000 // default: 200000 =0.2 * 10^6
        });

        const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
            microLamports: 10 // 1 = 1*10-6 lamport default: 0
        });
        rawTransaction.add(modifyComputeUnits).add(addPriorityFee);
        await api.appendTokenTransferInstruction(rawTransaction, fromAddress, toAddress, mint, amount, false, true, decimal);
        const data = await api.signTransaction(rawTransaction, privateKeyBase58);
        console.info(data);
    });

    test("token2022MintTo", async () => {
        const feePayerPrivateKey = "548yT115QRHH7Mpchg9JJ8YPX9RTKuan7oeB9ruMULDGhdqBmG18RBSv54Fpv2BvrC1yVpGdjzAPKHNYUwPBePK";
        const mintAuthorityPrivateKey = "548yT115QRHH7Mpchg9JJ8YPX9RTKuan7oeB9ruMULDGhdqBmG18RBSv54Fpv2BvrC1yVpGdjzAPKHNYUwPBePK";
        const payerAddress = api.getNewAddress(feePayerPrivateKey);
        const toAddress = "GbDq1KMiTmSys7SPwNTJVF3oSvnpirihdZyqpNTBnf3R";
        const amount = 10000000000;
        const blockHash = "EceWisnSkrDKzboD7mrs1hNBNKSx6LovpcpNuggbreYc";
        const mint = "FTDMffVuqMpPPTdfaDTNgMTx7A8xe2jpPQBzMq3D85yi";
        // const mintAuthorityAddress = "5Js8oiMNBPeaPXSqzZpSCKpQjN41S9W9WQBR9vVbdS8k";
        const mintAuthorityAddress = "J44uzihE3Ty2YBdMsLwCE3hV5uf2q2hRJQMnW2NGqPfo";
        const rawTransaction = api.createRawTransaction(payerAddress, blockHash);
        await api.appendTokenMintToInstruction(rawTransaction, payerAddress, toAddress, mint, mintAuthorityAddress, amount, false, true);
        const data = await api.signTransaction(rawTransaction, feePayerPrivateKey, mintAuthorityPrivateKey);
        console.info(data);
    });

    test("token2022Burn", async () => {
        const feePayerPrivateKey = "548yT115QRHH7Mpchg9JJ8YPX9RTKuan7oeB9ruMULDGhdqBmG18RBSv54Fpv2BvrC1yVpGdjzAPKHNYUwPBePK";
        const tokenAccountOwnerPrivateKey = "548yT115QRHH7Mpchg9JJ8YPX9RTKuan7oeB9ruMULDGhdqBmG18RBSv54Fpv2BvrC1yVpGdjzAPKHNYUwPBePK";
        const feePayerAddress = api.getNewAddress(feePayerPrivateKey);
        const targetTokenAccountAddress = "A8rUSaopsdtH7cDRc6JatsVuJv6PWwKsYrgcAD3kmgYG";
        const tokenAccountOwnerAddress = api.getNewAddress(tokenAccountOwnerPrivateKey);
        const amount = 1000000000;
        const blockHash = "asY4EYLXn1fTLkVvJ5X3SvbjQD6jTKEqdA3b6aFHxsm";
        const mint = "FTDMffVuqMpPPTdfaDTNgMTx7A8xe2jpPQBzMq3D85yi";
        const rawTransaction = api.createRawTransaction(feePayerAddress, blockHash);
        await api.appendTokenBurnInstruction(rawTransaction, tokenAccountOwnerAddress, targetTokenAccountAddress, mint, amount, true);
        const data = await api.signTransaction(rawTransaction, feePayerPrivateKey, tokenAccountOwnerPrivateKey);
        console.info(data);
    });

    test("message", async () => {
        const fromAddress = api.getNewAddress(privateKeyBase58);
        const toAddress = "8DDy3CyJ8e3aGfAVn8PQPZ1jC5mAuNxNF9XbhbyPaFN4"
        const amount = 1000000
        const blockHash = "G6WMViEhWA2TM8AwFwG5FfcVow2WrfqVN7HsnTEcKgYz";
        const mint = "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"

        const t = api.createRawTransaction(fromAddress, blockHash)
        await api.appendTokenTransferInstruction(t, fromAddress, toAddress, mint, amount, true)

        const message = t.serialize({requireAllSignatures: false, verifySignatures: false})
        const data = await api.signMessage(base.toBase58(message), privateKeyBase58)

        console.info(data);
    });

    test("deserializeMessages", async () => {
        const messages = ["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"];
        let wallet = new SolWallet()
        let param = {
            data: messages
        }
        let res = await wallet.deserializeMessages(param);
        console.log(res);
    });

    test("pNftTransfer", async () => {
        const privateKey = "548yT115QRHH7Mpchg9JJ8YPX9RTKuan7oeB9ruMULDGhdqBmG18RBSv54Fpv2BvrC1yVpGdjzAPKHNYUwPBePKc";
        const from = api.getNewAddress(privateKey);
        const to = "9qinWp4oc3TvBocbwAvYZAZWfSswub2qM49Pn6rkCQ9q";

        const nft = {
            tokenStandard: TokenStandard.ProgrammableNonFungible,
            address: new PublicKey("DberpiNB1sttkWdd66amQV5hrnMGacBeDeMbcEFMVBiR"),
        };

        const authority = {
            publicKey: new PublicKey(from),
            secretKey: base.fromBase58(privateKey),
        };

        // set priority fee
        const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
            units: 1400000 // default: 200000 =0.2 * 10^6
        });

        const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
            microLamports: 10 // 1 = 1*10-6 lamport default: 0
        });

        const builder = transferNftBuilder({
            nftOrSft: nft,
            authority,
            fromOwner: new PublicKey(from),
            toOwner: new PublicKey(to),
        }, authority);


        builder.add({instruction: modifyComputeUnits, signers: []});
        builder.add({instruction: addPriorityFee, signers: []});

        const signedTx = getSignedTransaction(builder, undefined, {
            blockhash: "8MnQifmv14ELwdkK5NJso9cofN8iNpHy6n6Nnxy7pn8v",
            lastValidBlockHeight: 181854107,
        });
        console.log(signedTx);
    });
})
