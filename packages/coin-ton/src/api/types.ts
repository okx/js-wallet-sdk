import {Cell} from "../ton-core";

export type AnyPayload = string | Cell | Uint8Array;

export interface TonTransferParams {
    toAddress: string;
    amount: bigint;
    payload?: AnyPayload;
    stateInit?: Cell;
    isBase64Payload?: boolean;
}