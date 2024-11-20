import {randomBytes} from "crypto";

export {signMultiTransaction} from './transaction'
export {buildNftTransferPayload, buildNotcoinVoucherExchange} from './nfts'

export function generateQueryId() {
    return bigintRandom(8);
}

export function bigintRandom(bytes: number) {
    let value = BigInt(0);
    for (const randomNumber of randomBytes(bytes)) {
        const randomBigInt = BigInt(randomNumber);
        // eslint-disable-next-line no-bitwise
        value = (value << BigInt(8)) + randomBigInt;
    }
    return value;
}