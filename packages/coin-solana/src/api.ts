import {signUtil, base} from "@okxweb3/crypto-lib";
import {spl, web3} from "./sdk";
import {
    VersionedTransaction,
    TransactionMessage,
    PublicKey,
    Signer,
    TransactionInstruction,
    Keypair,
    Transaction,
} from './sdk/web3';
import {TokenStandard, transferNftBuilder, getSignedTransaction} from "./sdk/metaplex";
import {base58} from "@okxweb3/crypto-lib/dist/base";

export function getNewAddress(privateKey: string): string {
    const publicKey = signUtil.ed25519.publicKeyCreate(base.fromBase58(privateKey))
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

export async function appendTokenTransferInstruction(transaction: web3.Transaction, fromAddress: string, toAddress: string, mintAddress: string, amount: number, createAssociatedAddress: boolean) {
    const fromAssociatedAddress = await spl.getAssociatedTokenAddress(new web3.PublicKey(mintAddress), new web3.PublicKey(fromAddress))
    const toAssociatedAddress = await spl.getAssociatedTokenAddress(new web3.PublicKey(mintAddress), new web3.PublicKey(toAddress))

    if (createAssociatedAddress) {
        transaction.add(
            spl.createAssociatedTokenAccountInstruction(
                new web3.PublicKey(fromAddress),
                new web3.PublicKey(toAssociatedAddress),
                new web3.PublicKey(toAddress),
                new web3.PublicKey(mintAddress))
        )
    }

    transaction.add(
        spl.createTransferInstruction(
            new web3.PublicKey(fromAssociatedAddress),
            new web3.PublicKey(toAssociatedAddress),
            new web3.PublicKey(fromAddress),
            amount)
    )
}

export async function signMessage(message: string, privateKey: string): Promise<string> {
    const signData = base.fromBase58(message)
    const signature = signUtil.ed25519.sign(signData, base.fromBase58(privateKey))
    return Promise.resolve(base.toBase58(signature))
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
}

export async function signTransferVersionedTransaction(txData: TxData, ...privateKey: string[]) {
    const instructions = [
        web3.SystemProgram.transfer({
            fromPubkey: new web3.PublicKey(txData.from),
            toPubkey: new web3.PublicKey(txData.to),
            lamports: txData.amount,
        }),
    ];

    return createAndSignVersionedTransaction(txData.payer, txData.blockHash, instructions, privateKey);
}

export async function signTokenTransferVersionedTransaction(txData: TxData, ...privateKey: string[]) {
    const fromAssociatedAddress = await spl.getAssociatedTokenAddress(new web3.PublicKey(txData.mint!), new web3.PublicKey(txData.from));
    const toAssociatedAddress = await spl.getAssociatedTokenAddress(new web3.PublicKey(txData.mint!), new web3.PublicKey(txData.to));

    const instructions = [];
    if (txData.createAssociatedAddress) {
        instructions.push(
            spl.createAssociatedTokenAccountInstruction(
                new web3.PublicKey(txData.from),
                new web3.PublicKey(toAssociatedAddress),
                new web3.PublicKey(txData.to),
                new web3.PublicKey(txData.mint!),
            )
        );
    }

    instructions.push(
        spl.createTransferInstruction(
            new web3.PublicKey(fromAssociatedAddress),
            new web3.PublicKey(toAssociatedAddress),
            new web3.PublicKey(txData.from),
            txData.amount,
        )
    );

    return createAndSignVersionedTransaction(txData.payer, txData.blockHash, instructions, privateKey);
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

export async function signMplTransaction(payer: string, from: string, to: string, mint: string, blockHash: string, privateKey: string, tokenStandard: TokenStandard = TokenStandard.ProgrammableNonFungible) {
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

    return getSignedTransaction(builder, undefined, {
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

export function getMPCTransaction(raw: string, sig: string, publicKey: string): Promise<string> {
    if (base.isHexString("0x" + publicKey)) {
        publicKey = base58.encode(base.fromHex(publicKey));
    }
    let tx = web3.Transaction.from(base.fromHex(raw))
    tx.addSignature(new PublicKey(publicKey), base.fromHex(sig))
    return Promise.resolve(base.toBase58(tx.serialize()))
}