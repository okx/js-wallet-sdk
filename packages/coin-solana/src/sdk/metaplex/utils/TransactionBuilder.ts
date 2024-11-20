/**
 * The following methods are based on `utils`, thanks for their work
 * https://github.com/metaplex-foundation/js/tree/main/packages/js/src/utils
 */
import {
    SignaturePubkeyPair,
    Transaction,
    TransactionInstruction,
    TransactionSignature,
} from '../../web3';
import {Signer, Program, getSignerHistogram} from '../types';
import {base} from '@okxweb3/crypto-lib';

export type BlockhashWithExpiryBlockHeight = Readonly<{
    blockhash: string;
    lastValidBlockHeight: number;
}>;

export type InstructionWithSigners = {
    instruction: TransactionInstruction;
    signers: Signer[];
    key?: string;
};

type TransactionOptions = {
    /** Additional signatures. */
    signatures?: Array<SignaturePubkeyPair>;
};

export type TransactionBuilderOptions = {
    /**
     * The wallet that should pay for transaction fees and,
     * potentially, rent-exempt fees to create accounts.
     *
     * Defaults to the default fee payer of the RPC module which,
     * itself, defaults to the current identity.
     *
     * You may set this option globally by calling
     * `metaplex.rpc.setDefaultFeePayer(payer)`.
     *
     * @defaultValue `metaplex.rpc().getDefaultFeePayer()`
     */
    payer?: Signer;

    /**
     * An optional set of programs that override the registered ones.
     *
     * You may set this option globally by calling
     * `metaplex.programs().register(programs)`.
     *
     * @defaultValue `[]`
     */
    programs?: Program[];
};

export class TransactionBuilder<C extends object = object> {
    /** The list of all instructions and their respective signers. */
    protected records: InstructionWithSigners[] = [];

    /** Options used when building the transaction. */
    protected transactionOptions: TransactionOptions;

    /** The signer to use to pay for transaction fees. */
    protected feePayer: Signer | undefined = undefined;

    /** Any additional context gathered when creating the transaction builder. */
    protected context: C = {} as C;

    constructor(transactionOptions: TransactionOptions = {}) {
        this.transactionOptions = transactionOptions;
    }

    static make<C extends object = object>(
        transactionOptions?: TransactionOptions
    ): TransactionBuilder<C> {
        return new TransactionBuilder<C>(transactionOptions);
    }

    prepend(
        ...txs: (InstructionWithSigners | TransactionBuilder)[]
    ): TransactionBuilder<C> {
        const newRecords = txs.flatMap((tx) =>
            tx instanceof TransactionBuilder ? tx.getInstructionsWithSigners() : [tx]
        );
        this.records = [...newRecords, ...this.records];

        return this;
    }

    append(
        ...txs: (InstructionWithSigners | TransactionBuilder)[]
    ): TransactionBuilder<C> {
        const newRecords = txs.flatMap((tx) =>
            tx instanceof TransactionBuilder ? tx.getInstructionsWithSigners() : [tx]
        );
        this.records = [...this.records, ...newRecords];

        return this;
    }

    add(
        ...txs: (InstructionWithSigners | TransactionBuilder)[]
    ): TransactionBuilder<C> {
        return this.append(...txs);
    }

    splitUsingKey(
        key: string,
        include = true
    ): [TransactionBuilder, TransactionBuilder] {
        const firstBuilder = new TransactionBuilder(this.transactionOptions);
        const secondBuilder = new TransactionBuilder(this.transactionOptions);
        let keyPosition = this.records.findIndex((record) => record.key === key);

        if (keyPosition > -1) {
            keyPosition += include ? 1 : 0;
            firstBuilder.add(...this.records.slice(0, keyPosition));
            secondBuilder.add(...this.records.slice(keyPosition));
        } else {
            firstBuilder.add(this);
        }

        return [firstBuilder, secondBuilder];
    }

    splitBeforeKey(key: string): [TransactionBuilder, TransactionBuilder] {
        return this.splitUsingKey(key, false);
    }

    splitAfterKey(key: string): [TransactionBuilder, TransactionBuilder] {
        return this.splitUsingKey(key, true);
    }

    getInstructionsWithSigners(): InstructionWithSigners[] {
        return this.records;
    }

    getInstructions(): TransactionInstruction[] {
        return this.records.map((record) => record.instruction);
    }

    getInstructionCount(): number {
        return this.records.length;
    }

    isEmpty(): boolean {
        return this.getInstructionCount() === 0;
    }

    getSigners(): Signer[] {
        const feePayer = this.feePayer == null ? [] : [this.feePayer];
        const signers = this.records.flatMap((record) => record.signers);

        return [...feePayer, ...signers];
    }

    setTransactionOptions(
        transactionOptions: TransactionOptions
    ): TransactionBuilder<C> {
        this.transactionOptions = transactionOptions;

        return this;
    }

    getTransactionOptions(): TransactionOptions | undefined {
        return this.transactionOptions;
    }

    setFeePayer(feePayer: Signer): TransactionBuilder<C> {
        this.feePayer = feePayer;

        return this;
    }

    getFeePayer(): Signer | undefined {
        return this.feePayer;
    }

    setContext(context: C): TransactionBuilder<C> {
        this.context = context;

        return this;
    }

    getContext(): C {
        return this.context;
    }

    when(
        condition: boolean,
        callback: (tx: TransactionBuilder<C>) => TransactionBuilder<C>
    ) {
        return condition ? callback(this) : this;
    }

    unless(
        condition: boolean,
        callback: (tx: TransactionBuilder<C>) => TransactionBuilder<C>
    ) {
        return this.when(!condition, callback);
    }

    toTransaction(
        blockhashWithExpiryBlockHeight: BlockhashWithExpiryBlockHeight,
        options: TransactionOptions = {}
    ): Transaction {
        options = {...this.getTransactionOptions(), ...options};

        const transaction = new Transaction({
            feePayer: this.getFeePayer()?.publicKey,
            signatures: options.signatures,
            blockhash: blockhashWithExpiryBlockHeight.blockhash,
            lastValidBlockHeight: blockhashWithExpiryBlockHeight.lastValidBlockHeight,
        });

        transaction.add(...this.getInstructions());

        return transaction;
    }
}

function prepareTransaction(
    transaction: Transaction | TransactionBuilder,
    signers: Signer[],
    blockhashWithExpiryBlockHeight: BlockhashWithExpiryBlockHeight
): {
    transaction: Transaction;
    signers: Signer[];
    blockhashWithExpiryBlockHeight: BlockhashWithExpiryBlockHeight;
} {
    if (
        !('records' in transaction) &&
        transaction.recentBlockhash &&
        transaction.lastValidBlockHeight
    ) {
        blockhashWithExpiryBlockHeight = {
            blockhash: transaction.recentBlockhash,
            lastValidBlockHeight: transaction.lastValidBlockHeight,
        };
    }

    if ('records' in transaction) {
        signers = [...transaction.getSigners(), ...signers];
        transaction = transaction.toTransaction(blockhashWithExpiryBlockHeight);
    }

    return {transaction, signers, blockhashWithExpiryBlockHeight};
}

function signTransaction(
    transaction: Transaction,
    signers: Signer[]
): Transaction {
    const {keypairs} = getSignerHistogram(signers);
    // Keypair signers.
    if (keypairs.length > 0) {
        transaction.partialSign(...keypairs);
    }

    return transaction;
}

export function getSignedTransaction(
    transaction: Transaction | TransactionBuilder,
    signers: Signer[] = [],
    blockhashWithExpiryBlockHeight: BlockhashWithExpiryBlockHeight
): TransactionSignature {
    const prepared = prepareTransaction(transaction, signers, blockhashWithExpiryBlockHeight);
    transaction = prepared.transaction;
    signers = prepared.signers;

    transaction = signTransaction(transaction, signers);
    return base.toBase58(transaction.serialize());
}

export function getSerializedTransaction(
    transaction: Transaction | TransactionBuilder,
    signers: Signer[] = [],
    blockhashWithExpiryBlockHeight: BlockhashWithExpiryBlockHeight
): TransactionSignature {
    const prepared = prepareTransaction(transaction, signers, blockhashWithExpiryBlockHeight);
    transaction = prepared.transaction;
    // signers = prepared.signers;
    // transaction = signTransaction(transaction, signers);
    return base.toBase58(transaction.serialize({requireAllSignatures: false, verifySignatures: false}));
}
