import {Address, Builder, Cell} from "../ton-core";
import {NFT_TRANSFER_TONCOIN_FORWARD_AMOUNT, NOTCOIN_EXCHANGERS, NOTCOIN_FORWARD_TON_AMOUNT} from "./constant";
import {generateQueryId} from "./index";

export enum NftOpCode {
    TransferOwnership = 0x5fcc3d14,
    OwnershipAssigned = 0x05138d91,
}


export enum OpCode {
    Comment = 0,
    Encrypted = 0x2167da4b,
}


export function commentToBytes(comment: string): Uint8Array {
    const buffer = Buffer.from(comment);
    const bytes = new Uint8Array(buffer.length + 4);

    const startBuffer = Buffer.alloc(4);
    startBuffer.writeUInt32BE(OpCode.Comment);
    bytes.set(startBuffer, 0);
    bytes.set(buffer, 4);

    return bytes;
}

const TON_MAX_COMMENT_BYTES = 127;

export function packBytesAsSnake(bytes: Uint8Array, maxBytes = TON_MAX_COMMENT_BYTES): Uint8Array | Cell {
    const buffer = Buffer.from(bytes);
    if (buffer.length <= maxBytes) {
        return bytes;
    }

    const mainBuilder = new Builder();
    let prevBuilder: Builder | undefined;
    let currentBuilder = mainBuilder;

    for (const [i, byte] of buffer.entries()) {
        if (currentBuilder.availableBits < 8) {
            prevBuilder?.storeRef(currentBuilder);

            prevBuilder = currentBuilder;
            currentBuilder = new Builder();
        }

        currentBuilder = currentBuilder.storeUint(byte, 8);

        if (i === buffer.length - 1) {
            prevBuilder?.storeRef(currentBuilder);
        }
    }

    return mainBuilder.asCell();
}

export function buildNotcoinVoucherExchange(fromAddress: string, nftAddress: string, nftIndex: number) {
    // eslint-disable-next-line no-bitwise
    const first4Bits = Address.parse(nftAddress).hash.readUint8() >> 4;
    const toAddress = NOTCOIN_EXCHANGERS[first4Bits];

    const payload = new Builder()
        .storeUint(0x5fec6642, 32)
        .storeUint(nftIndex, 64)
        .endCell();

    return buildNftTransferPayload(fromAddress, toAddress, payload, NOTCOIN_FORWARD_TON_AMOUNT);
}

export function buildNftTransferPayload(
    fromAddress: string,
    toAddress: string,
    payload?: string | Cell,
    forwardAmount = NFT_TRANSFER_TONCOIN_FORWARD_AMOUNT,
) {
    let builder = new Builder()
        .storeUint(NftOpCode.TransferOwnership, 32)
        .storeUint(generateQueryId(), 64)
        .storeAddress(Address.parse(toAddress))
        .storeAddress(Address.parse(fromAddress))
        .storeBit(false) // null custom_payload
        .storeCoins(forwardAmount);

    let forwardPayload: Cell | Uint8Array | undefined;

    if (payload) {
        if (typeof payload === 'string') {
            const bytes = commentToBytes(payload);
            const freeBytes = Math.floor(builder.availableBits / 8);
            forwardPayload = packBytesAsSnake(bytes, freeBytes);
        } else {
            forwardPayload = payload;
        }
    }

    if (forwardPayload instanceof Uint8Array) {
        builder.storeBit(0);
        builder = builder.storeBuffer(Buffer.from(forwardPayload));
    } else {
        builder = builder.storeMaybeRef(forwardPayload);
    }

    return builder.endCell();
}