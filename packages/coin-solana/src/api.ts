import {signUtil, base} from "@okxweb3/crypto-lib";
import {spl, web3} from "./sdk";
import {
    VersionedTransaction,
    TransactionMessage,
    PublicKey,
    Signer,
    TransactionInstruction,
    Keypair,
    Transaction, CompiledInstruction,
} from './sdk/web3';
import {TokenStandard, transferNftBuilder, getSignedTransaction, getSerializedTransaction} from "./sdk/metaplex";
import {TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID} from "./sdk/spl";
import {
    COMPUTE_BUDGET_INSTRUCTION_LAYOUTS,
    ComputeBudgetProgram
} from "./sdk/web3/programs/compute-budget";

import {decodeData} from "./sdk/web3/instruction";

export function getNewAddress(privateKey: string): string {
    if (!privateKey) {
        throw new Error("invalid key");
    }
    const buf = base.fromBase58(privateKey)
    if (buf.length != 64) {
        throw new Error("invalid key length");
    }
    const publicKey = signUtil.ed25519.publicKeyCreate(buf)
    return base.toBase58(publicKey)
}

export function validAddress(address: string): boolean {
    try {
        const array = base.fromBase58(address)
        return array.length == 32;
    } catch (e) {
        return false;
    }
}

export function createRawTransaction(payer: string, blockHash: string): web3.Transaction {
    return new web3.Transaction({feePayer: new web3.PublicKey(payer), blockhash: blockHash, lastValidBlockHeight: 0})
}

export async function appendInstruction(transaction: web3.Transaction, ...instructions: web3.TransactionInstruction[]) {
    transaction.add(...instructions)
}

export async function signTransaction(rawTransaction: web3.Transaction, ...privateKey: string[]): Promise<string> {
    const signers: web3.Signer[] = []
    privateKey.forEach(key => {
        signers.push(web3.Keypair.fromSecretKey(base.fromBase58(key)))
    })
    rawTransaction.sign(...signers);
    if (!rawTransaction.signature) {
        return Promise.reject("sign error")
    }
    return Promise.resolve(base.toBase58(rawTransaction.serialize()))
}

export async function appendTransferInstruction(transaction: web3.Transaction, fromAddress: string, toAddress: string, amount: number) {
    transaction.add(
        web3.SystemProgram.transfer({
            fromPubkey: new web3.PublicKey(fromAddress),
            toPubkey: new web3.PublicKey(toAddress),
            lamports: amount,
        }))
}

export async function appendTokenTransferInstruction(transaction: web3.Transaction, fromAddress: string, toAddress: string, mintAddress: string, amount: number, createAssociatedAddress: boolean, token2022?: boolean, decimal?: number) {
    const tokenProgramId = token2022 === true ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID;
    const fromAssociatedAddress = await spl.getAssociatedTokenAddress(new web3.PublicKey(mintAddress), new web3.PublicKey(fromAddress), false, tokenProgramId);
    // Allow the owner account to be a PDA (Program Derived Address)
    const toAssociatedAddress = await spl.getAssociatedTokenAddress(new web3.PublicKey(mintAddress), new web3.PublicKey(toAddress), true, tokenProgramId);
    if (createAssociatedAddress) {
        transaction.add(
            spl.createAssociatedTokenAccountInstruction(
                new web3.PublicKey(fromAddress),
                new web3.PublicKey(toAssociatedAddress),
                new web3.PublicKey(toAddress),
                new web3.PublicKey(mintAddress),
                new web3.PublicKey(tokenProgramId)),
        )
    }

    if (token2022) {
        if (!decimal) {
            throw new Error(`invalid decimal for token 2022`);
            // console.log("decimal :", decimal);
        }
        transaction.add(
            spl.createTransferCheckedInstruction(
                new web3.PublicKey(fromAssociatedAddress),
                new web3.PublicKey(mintAddress),
                new web3.PublicKey(toAssociatedAddress),
                new web3.PublicKey(fromAddress),
                amount,
                decimal,
                [],
                new web3.PublicKey(tokenProgramId))
        )
    } else {
        transaction.add(
            spl.createTransferInstruction(
                new web3.PublicKey(fromAssociatedAddress),
                new web3.PublicKey(toAssociatedAddress),
                new web3.PublicKey(fromAddress),
                amount,
                [],
                new web3.PublicKey(tokenProgramId))
        )
    }

}

export async function appendTokenMintToInstruction(transaction: web3.Transaction, payerAddress: string, toAddress: string, mintAddress: string, authorityAddress: string, amount: number, createAssociatedAddress: boolean, token2022?: boolean) {
    const tokenProgramId = token2022 === true ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID;
    const toAssociatedAddress = await spl.getAssociatedTokenAddress(new web3.PublicKey(mintAddress), new web3.PublicKey(toAddress), false, tokenProgramId);
    if (createAssociatedAddress) {
        transaction.add(
            spl.createAssociatedTokenAccountInstruction(
                new web3.PublicKey(payerAddress),
                new web3.PublicKey(toAssociatedAddress),
                new web3.PublicKey(toAddress),
                new web3.PublicKey(mintAddress),
                new web3.PublicKey(tokenProgramId)),
        )
    }

    transaction.add(
        spl.createMintToInstruction(
            new web3.PublicKey(mintAddress),
            new web3.PublicKey(toAssociatedAddress),
            new web3.PublicKey(authorityAddress),
            amount,
            [],
            new web3.PublicKey(tokenProgramId))
    )
}

export async function appendTokenBurnInstruction(transaction: web3.Transaction, ownerAddress: string, targetAddress: string, mintAddress: string, amount: number, token2022?: boolean) {
    const tokenProgramId = token2022 === true ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID;
    transaction.add(
        spl.createBurnInstruction(
            new web3.PublicKey(targetAddress),
            new web3.PublicKey(mintAddress),
            new web3.PublicKey(ownerAddress),
            amount,
            [],
            new web3.PublicKey(tokenProgramId))
    )
}

export async function signMessage(message: string, privateKey: string): Promise<string> {
    const signData = base.fromBase58(message)
    const signature = signUtil.ed25519.sign(signData, base.fromBase58(privateKey))
    return Promise.resolve(base.toBase58(signature))
}

export async function deserializeMessages(messages: string[]): Promise<any> {
    let res = [];
    for (let i = 0; i < messages.length; i++) {
        let deserialized = true;
        let computeUnitLimit = 0;
        let hasUnitLimit = false;
        let computeUnitPrice: number | bigint = 0;
        const message = messages[i];
        try {
            // legacy or v0
            const versionedTx = web3.VersionedTransaction.deserialize(base.fromBase58(message));
            const m = versionedTx.message;
            for (let j = 0; j < m.compiledInstructions.length; j++) {
                const compiledInstruction = m.compiledInstructions[j];
                if (m.staticAccountKeys[compiledInstruction.programIdIndex].toBase58() == ComputeBudgetProgram.programId.toBase58()) {
                    const data = Buffer.from(compiledInstruction.data);
                    try {
                        const {units} = decodeData(
                            COMPUTE_BUDGET_INSTRUCTION_LAYOUTS.SetComputeUnitLimit,
                            data,
                        );
                        computeUnitLimit = units;
                        hasUnitLimit = true;
                    } catch (e) {
                    }
                    try {
                        const {microLamports} = decodeData(
                            COMPUTE_BUDGET_INSTRUCTION_LAYOUTS.SetComputeUnitPrice,
                            data,
                        );
                        computeUnitPrice = microLamports;
                    } catch (e) {
                    }

                }
            }
            if (!hasUnitLimit) {
                computeUnitLimit = 0;
                if (m.compiledInstructions.length > 1) {
                    computeUnitLimit = (m.compiledInstructions.length - 1) * 200000;
                }
            }

            // legacy
            /* const tx = web3.Transaction.from(base.fromBase58(message));
             const m = tx.compileMessage();
             for (let j = 0; j < m.instructions.length; j++) {
                 const compiledInstruction = m.instructions[j];
                 if (m.accountKeys[compiledInstruction.programIdIndex].toBase58() == ComputeBudgetProgram.programId.toBase58()) {
                     const data = Buffer.from(base.fromBase58(compiledInstruction.data));
                     try {
                         const {units} = decodeData(
                             COMPUTE_BUDGET_INSTRUCTION_LAYOUTS.SetComputeUnitLimit,
                             data,
                         );
                         computeUnitLimit = units;
                         hasUnitLimit = true;
                     } catch (e) {
                     }
                     try {
                         const {microLamports} = decodeData(
                             COMPUTE_BUDGET_INSTRUCTION_LAYOUTS.SetComputeUnitPrice,
                             data,
                         );
                         computeUnitPrice = microLamports;
                     } catch (e) {
                     }

                 }
             }
             if (!hasUnitLimit) {
                 computeUnitLimit = 0;
                 if (m.instructions.length > 1) {
                     computeUnitLimit = (m.instructions.length - 1) * 200000;
                 }
             }*/
        } catch (e) {
            console.log(e);
            deserialized = false;
        }


        res.push({
            deserialized: deserialized,
            computeUnitLimit: computeUnitLimit.toString(),
            computeUnitPrice: computeUnitPrice.toString(),
        });
    }
    return Promise.resolve(res);
}

export async function getHardwareTransaction(raw: string, pubKey: string, sig: string): Promise<string> {
    const rawTransaction = web3.Transaction.from(base.fromHex(raw));
    rawTransaction.addSignature(new PublicKey(pubKey), base.fromHex(sig))
    if (!rawTransaction.signature) {
        return Promise.reject("getHardwareTransaction error")
    }
    return Promise.resolve(base.toBase58(rawTransaction.serialize()))
}

export type TxData = {
    payer: string
    blockHash: string
    from: string
    to: string
    amount: number
    mint?: string
    createAssociatedAddress?: boolean
    token2022?: boolean
    computeUnitLimit?: number
    computeUnitPrice?: number
    needPriorityFee?: boolean
}

export async function getSerializedTransferVersionedTransaction(txData: TxData, ...privateKey: string[]) {
    const instructions = [];
    if (txData.needPriorityFee && txData.computeUnitLimit && txData.computeUnitPrice) {
        const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
            units: txData.computeUnitLimit // default: 200000 =0.2 * 10^6
        });

        const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
            microLamports: txData.computeUnitPrice // 1 = 1*10-6 lamport default: 0
        });
        instructions.push(modifyComputeUnits);
        instructions.push(addPriorityFee);
    }
    instructions.push(web3.SystemProgram.transfer({
        fromPubkey: new web3.PublicKey(txData.from),
        toPubkey: new web3.PublicKey(txData.to),
        lamports: txData.amount,
    }));

    // const instructions = [
    //     web3.SystemProgram.transfer({
    //         fromPubkey: new web3.PublicKey(txData.from),
    //         toPubkey: new web3.PublicKey(txData.to),
    //         lamports: txData.amount,
    //     }),
    // ];
    return getSerializedVersionedTransaction(txData.payer, txData.blockHash, instructions, privateKey);
}

export async function signTransferVersionedTransaction(txData: TxData, ...privateKey: string[]) {
    const instructions = [];
    if (txData.computeUnitLimit && txData.computeUnitPrice) {
        const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
            units: txData.computeUnitLimit // default: 200000 =0.2 * 10^6
        });

        const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
            microLamports: txData.computeUnitPrice // 1 = 1*10-6 lamport default: 0
        });
        instructions.push(modifyComputeUnits);
        instructions.push(addPriorityFee);
    }
    instructions.push(web3.SystemProgram.transfer({
        fromPubkey: new web3.PublicKey(txData.from),
        toPubkey: new web3.PublicKey(txData.to),
        lamports: txData.amount,
    }));

    // const instructions = [
    //     web3.SystemProgram.transfer({
    //         fromPubkey: new web3.PublicKey(txData.from),
    //         toPubkey: new web3.PublicKey(txData.to),
    //         lamports: txData.amount,
    //     }),
    // ];
    return createAndSignVersionedTransaction(txData.payer, txData.blockHash, instructions, privateKey);
}

export async function signTokenTransferVersionedTransaction(txData: TxData, ...privateKey: string[]) {
    const tokenProgramId = txData.token2022 === true ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID;
    const fromAssociatedAddress = await spl.getAssociatedTokenAddress(new web3.PublicKey(txData.mint!), new web3.PublicKey(txData.from), false, tokenProgramId);
    // Allow the owner account to be a PDA (Program Derived Address)
    const toAssociatedAddress = await spl.getAssociatedTokenAddress(new web3.PublicKey(txData.mint!), new web3.PublicKey(txData.to), true, tokenProgramId);

    const instructions = [];
    if (txData.computeUnitLimit && txData.computeUnitPrice) {
        const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
            units: txData.computeUnitLimit // default: 200000 =0.2 * 10^6
        });

        const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
            microLamports: txData.computeUnitPrice // 1 = 1*10-6 lamport default: 0
        });
        instructions.push(modifyComputeUnits);
        instructions.push(addPriorityFee);
    }

    if (txData.createAssociatedAddress) {
        instructions.push(
            spl.createAssociatedTokenAccountInstruction(
                new web3.PublicKey(txData.from),
                new web3.PublicKey(toAssociatedAddress),
                new web3.PublicKey(txData.to),
                new web3.PublicKey(txData.mint!),
                new web3.PublicKey(tokenProgramId),
            )
        );
    }

    instructions.push(
        spl.createTransferInstruction(
            new web3.PublicKey(fromAssociatedAddress),
            new web3.PublicKey(toAssociatedAddress),
            new web3.PublicKey(txData.from),
            txData.amount,
            [],
            new web3.PublicKey(tokenProgramId),
        )
    );

    return createAndSignVersionedTransaction(txData.payer, txData.blockHash, instructions, privateKey);
}

export async function getSerializedTokenTransferVersionedTransaction(txData: TxData, ...privateKey: string[]) {
    const tokenProgramId = txData.token2022 === true ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID;
    const fromAssociatedAddress = await spl.getAssociatedTokenAddress(new web3.PublicKey(txData.mint!), new web3.PublicKey(txData.from), false, tokenProgramId);
    const toAssociatedAddress = await spl.getAssociatedTokenAddress(new web3.PublicKey(txData.mint!), new web3.PublicKey(txData.to), false, tokenProgramId);

    const instructions = [];
    if (txData.needPriorityFee && txData.computeUnitLimit && txData.computeUnitPrice) {
        const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
            units: txData.computeUnitLimit // default: 200000 =0.2 * 10^6
        });

        const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
            microLamports: txData.computeUnitPrice // 1 = 1*10-6 lamport default: 0
        });
        instructions.push(modifyComputeUnits);
        instructions.push(addPriorityFee);
    }

    if (txData.createAssociatedAddress) {
        instructions.push(
            spl.createAssociatedTokenAccountInstruction(
                new web3.PublicKey(txData.from),
                new web3.PublicKey(toAssociatedAddress),
                new web3.PublicKey(txData.to),
                new web3.PublicKey(txData.mint!),
                new web3.PublicKey(tokenProgramId),
            )
        );
    }

    instructions.push(
        spl.createTransferInstruction(
            new web3.PublicKey(fromAssociatedAddress),
            new web3.PublicKey(toAssociatedAddress),
            new web3.PublicKey(txData.from),
            txData.amount,
            [],
            new web3.PublicKey(tokenProgramId),
        )
    );

    return getSerializedVersionedTransaction(txData.payer, txData.blockHash, instructions, privateKey);
}

export async function getSerializedVersionedTransaction(payer: string, blockHash: string, instructions: TransactionInstruction[], privateKey: string[]) {
    const messageV0 = new TransactionMessage({
        payerKey: new PublicKey(payer),
        recentBlockhash: blockHash,
        instructions,
    }).compileToV0Message();

    const transaction = new VersionedTransaction(messageV0);

    // const signers: Signer[] = [];
    // privateKey.forEach(key => {
    //     let keypair = Keypair.fromSecretKey(base.fromBase58(key));
    //     signers.push({
    //         publicKey: keypair.publicKey,
    //         secretKey: keypair.secretKey,
    //     });
    // });
    // transaction.sign(signers);
    //
    // if (!transaction.signature) {
    //     return Promise.reject("sign error");
    // }

    return Promise.resolve(base.toBase58(transaction.serialize()));
}

export async function createAndSignVersionedTransaction(payer: string, blockHash: string, instructions: TransactionInstruction[], privateKey: string[]) {
    const messageV0 = new TransactionMessage({
        payerKey: new PublicKey(payer),
        recentBlockhash: blockHash,
        instructions,
    }).compileToV0Message();

    const transaction = new VersionedTransaction(messageV0);

    const signers: Signer[] = [];
    privateKey.forEach(key => {
        let keypair = Keypair.fromSecretKey(base.fromBase58(key));
        signers.push({
            publicKey: keypair.publicKey,
            secretKey: keypair.secretKey,
        });
    });
    transaction.sign(signers);

    if (!transaction.signature) {
        return Promise.reject("sign error");
    }

    return Promise.resolve(base.toBase58(transaction.serialize()));
}

export async function signMplTransaction(payer: string, from: string, to: string, mint: string, blockHash: string, privateKey: string, tokenStandard: TokenStandard = TokenStandard.ProgrammableNonFungible, computeUnitLimit?: number, computeUnitPrice?: number) {
    const nft = {
        tokenStandard,
        address: new PublicKey(mint),
    };

    const authority = {
        publicKey: new PublicKey(from),
        secretKey: base.fromBase58(privateKey),
    };

    const builder = transferNftBuilder({
        nftOrSft: nft,
        authority,
        fromOwner: new PublicKey(from),
        toOwner: new PublicKey(to),
    }, authority);

    if (computeUnitLimit && computeUnitPrice) {
        // set priority fee
        const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
            units: computeUnitLimit // default: 200000 =0.2 * 10^6
        });

        const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
            microLamports: computeUnitPrice // 1 = 1*10-6 lamport default: 0
        });
        // todo solana mainnet
        builder.add({instruction: modifyComputeUnits, signers: []});
        builder.add({instruction: addPriorityFee, signers: []});
    }
    return getSignedTransaction(builder, undefined, {
        blockhash: blockHash,
        lastValidBlockHeight: 0,
    });
}

export async function getSerializedMplTransaction(payer: string, from: string, to: string, mint: string, blockHash: string, privateKey: string, tokenStandard: TokenStandard = TokenStandard.ProgrammableNonFungible, computeUnitLimit?: number, computeUnitPrice?: number) {
    const nft = {
        tokenStandard,
        address: new PublicKey(mint),
    };

    const authority = {
        publicKey: new PublicKey(from),
        secretKey: base.fromBase58(privateKey),
    };

    const builder = transferNftBuilder({
        nftOrSft: nft,
        authority,
        fromOwner: new PublicKey(from),
        toOwner: new PublicKey(to),
    }, authority);

    if (computeUnitLimit && computeUnitPrice) {
        // set priority fee
        const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
            units: computeUnitLimit // default: 200000 =0.2 * 10^6
        });

        const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
            microLamports: computeUnitPrice // 1 = 1*10-6 lamport default: 0
        });
        // todo solana mainnet
        builder.add({instruction: modifyComputeUnits, signers: []});
        builder.add({instruction: addPriorityFee, signers: []});
    }
    return getSerializedTransaction(builder, undefined, {
        blockhash: blockHash,
        lastValidBlockHeight: 0,
    });
}


export function validSignedTransaction(tx: string, version: boolean, skipCheckSig: boolean) {
    if (version) {
        const transaction = VersionedTransaction.deserialize(base.fromBase58(tx))
        const signature = transaction.signature!
        const hash = transaction.message.serialize()
        const publicKey = transaction.message.getAccountKeys().get(0)?.toBytes()!
        if (!skipCheckSig && !signUtil.ed25519.verify(hash, signature, publicKey)) {
            throw Error("signature error")
        }
        return transaction;
    }

    const transaction = Transaction.from(base.fromBase58(tx))
    const signature = transaction.signature!
    const hash = transaction.serializeMessage()
    const publicKey = transaction.feePayer!.toBytes()
    if (!skipCheckSig && !signUtil.ed25519.verify(hash, signature, publicKey)) {
        throw Error("signature error")
    }
    return transaction;
}
