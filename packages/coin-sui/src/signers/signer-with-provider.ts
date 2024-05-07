// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import {toB64} from '../bcs';
import {TransactionBlock} from '../builder';
import {SerializedSignature} from '../cryptography/signature';
import {
    bcs,
    SuiAddress,
} from '../types';
import {IntentScope, messageWithIntent} from '../utils/intent';
import {Signer} from './signer';
import {SignedTransaction} from './types';
import {TransactionBlockDataBuilder} from "../builder/TransactionBlockData";

///////////////////////////////
// Exported Abstracts
export abstract class SignerWithProvider implements Signer {

    ///////////////////
    // Sub-classes MUST implement these

    // Returns the checksum address
    abstract getAddress(): Promise<SuiAddress>;

    /**
     * Returns the signature for the data and the public key of the signer
     */
    abstract signData(data: Uint8Array): Promise<SerializedSignature>;

    ///////////////////
    // Sub-classes MAY override these

    constructor() {
    }

    /**
     * Sign a message using the keypair, with the `PersonalMessage` intent.
     */
    async signMessage(input: { message: Uint8Array }): Promise<string> {
        let r = bcs.ser('vector<u8>', input.message).toBytes();
        const signature = await this.signData(
            messageWithIntent(IntentScope.PersonalMessage, r),
        );

        return signature
    }

    /**
     * Sign a transaction.
     */
    async signTransactionBlock(input: {
        transactionBlock: Uint8Array | TransactionBlock;
    }): Promise<SignedTransaction> {
        let transactionBlockBytes;

        if (TransactionBlock.is(input.transactionBlock)) {
            // If the sender has not yet been set on the transaction, then set it.
            // NOTE: This allows for signing transactions with mis-matched senders, which is important for sponsored transactions.
            input.transactionBlock.setSenderIfNotSet(await this.getAddress());
            transactionBlockBytes = await input.transactionBlock.build({});
        } else if (input.transactionBlock instanceof Uint8Array) {
            transactionBlockBytes = input.transactionBlock;
        } else {
            throw new Error('Unknown transaction format');
        }

        const intentMessage = messageWithIntent(
            IntentScope.TransactionData,
            transactionBlockBytes,
        );
        const signature = await this.signData(intentMessage);

        return {
            transactionBlockBytes: toB64(transactionBlockBytes),
            hash: TransactionBlockDataBuilder.getDigestFromBytes(transactionBlockBytes),
            signature,
        };
    }


}
