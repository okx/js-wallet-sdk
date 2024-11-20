/**
 * Copyright (c) Whales Corp.
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
    Address,
    beginCell,
    Cell,
    contractAddress,
    external,
    MessageRelaxed,
    SendMode,
    storeMessage,
    storeMessageRelaxed,
} from "../../ton-core";
import { Maybe } from "../../ton-core/utils/maybe";
import { signUtil } from "@okxweb3/crypto-lib";

export class VenomWalletV3 {

    static create(args: { workchain: number, publicKey: Buffer, walletId?: Maybe<number> }) {
        return new VenomWalletV3(args.workchain, args.publicKey, args.walletId);
    }

    readonly workchain: number;
    readonly publicKey: Buffer;
    readonly address: Address;
    readonly walletId: number;
    readonly init: { data: Cell, code: Cell };

    private constructor(workchain: number, publicKey: Buffer, walletId?: Maybe<number>) {

        // Resolve parameters
        this.workchain = workchain;
        this.publicKey = publicKey;
        if (walletId !== null && walletId !== undefined) {
            this.walletId = walletId;
        } else {
            this.walletId = 1269378442 + workchain;
        }

        // Build initial code and data
        let code = Cell.fromBoc(Buffer.from('te6ccgEBAQEAcQAA3v8AIN0gggFMl7ohggEznLqxn3Gw7UTQ0x/THzHXC//jBOCk8mCDCNcYINMf0x/TH/gjE7vyY+1E0NMf0x/T/9FRMrryoVFEuvKiBPkBVBBV+RDyo/gAkyDXSpbTB9QC+wDo0QGkyMsfyx/L/8ntVA==', 'base64'))[0];
        let data = beginCell()
            .storeUint(0, 32) // Seqno
            .storeUint(this.walletId, 32)
            .storeBuffer(publicKey)
            .endCell();
        this.init = { code, data };
        this.address = contractAddress(workchain, { code, data });
    }

    createTransfer(args: { seqno: number, sendMode?: Maybe<SendMode>, secretKey: Buffer, messages: MessageRelaxed[], timeout?: Maybe<number>, globalId: number }) {
        let sendMode = SendMode.PAY_GAS_SEPARATELY + SendMode.IGNORE_ERRORS;
        if (args.sendMode !== null && args.sendMode !== undefined) {
            sendMode = args.sendMode;
        }
        const body = this.createWalletTransferV3Venom({
            seqno: args.seqno,
            sendMode,
            secretKey: args.secretKey,
            messages: args.messages,
            timeout: args.timeout,
            walletId: this.walletId,
            globalId: args.globalId,
        });

        const externalMessage = external({
            to: this.address,
            init: args.seqno === 0 ? { code: this.init.code, data: this.init.data } : undefined,
            body
        });

        return beginCell()
            .store(storeMessage(externalMessage))
            .endCell();
    }

    createWalletTransferV3Venom(args: {
        seqno: number,
        sendMode: number,
        walletId: number,
        globalId: number,
        messages: MessageRelaxed[],
        secretKey: Buffer,
        timeout?: Maybe<number>
    }) {

        // Check number of messages
        if (args.messages.length > 4) {
            throw Error("Maximum number of messages in a single transfer is 4");
        }

        // Create message to sign
        let signingMessage = beginCell()
          .storeUint(args.walletId, 32);
        if (args.seqno === 0) {
            for (let i = 0; i < 32; i++) {
                signingMessage.storeBit(1);
            }
        } else {
            signingMessage.storeUint(args.timeout || Math.floor(Date.now() / 1e3) + 600, 32); // Default timeout: 60 seconds
        }
        signingMessage.storeUint(args.seqno, 32);
        for (let m of args.messages) {
            signingMessage.storeUint(args.sendMode, 8);
            signingMessage.storeRef(beginCell().store(storeMessageRelaxed(m)));
        }

        const buf = Buffer.allocUnsafe(4);
        buf.writeInt32BE(args.globalId);
        const signHash = Buffer.concat([buf, signingMessage.endCell().hash()], 36);
        // Sign message
        let signature = signUtil.ed25519.sign(signHash, args.secretKey);

        // Body
        return  beginCell()
          .storeBuffer(Buffer.from(signature))
          .storeBuilder(signingMessage)
          .endCell();
    }
}
