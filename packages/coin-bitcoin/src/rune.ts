import * as bscript from './bitcoinjs-lib/script';
import {OPS} from './bitcoinjs-lib/ops';
import {Edict} from "./type";
import {ErrCodeLessRunesMainAmt, ErrCodeOpreturnExceeds} from "./wallet";
import {base} from "@okxweb3/crypto-lib";
import * as buffer from "buffer";
import {number} from "./bitcoinjs-lib/script";

export {encode as toVarInt, encodeToVec, decode as fromVarInt};
export {encodeV2 as toVarIntV2, encodeToVecV2};

const TAG_BODY = BigInt(0)
const TAG_Flags= BigInt(2);
const TAG_Rune= BigInt(4);
const TAG_Premine= BigInt(6);
const TAG_Cap= BigInt(8);
const TAG_Amount= BigInt(10);
const TAG_HeightStart= BigInt(12);
const TAG_HeightEnd= BigInt(14);
const TAG_OffsetStart= BigInt(16);
const TAG_OffsetEnd= BigInt(118);
const TAG_Mint= BigInt(20);
const TAG_Pointer= BigInt(22);
const TAG_Cenotaph= BigInt(126);
const TAG_Divisibility= BigInt(1);
const TAG_Spacers= BigInt(3);
const TAG_Symbol= BigInt(5);
const TAG_Nop= BigInt(127);

function encode(n: bigint): Uint8Array {
    let payload: number[] = [];
    encodeToVec(n, payload);
    return new Uint8Array(payload);
}

function encodeToVec(n: bigint, payload: number[]): void {
    let i = 18;
    const out = new Array(19).fill(0);

    out[i] = Number(n & BigInt(0x7F));

    while (n > BigInt(0x7F)) {
        n = n / BigInt(128) - BigInt(1);
        i--;
        out[i] = Number(n & BigInt(0xFF)) | 0x80;
    }

    payload.push(...out.slice(i));
}

function encodeV2(n: bigint): Uint8Array {
    let payload: number[] = [];
    encodeToVecV2(n, payload);
    return new Uint8Array(payload);
}
function encodeToVecV2(n: bigint, payload: number[]): number[] {
    while (n >> 7n > 0n) {
        payload.push(Number((n & 0x7Fn) | 0x80n));
        n >>= 7n;
    }
    payload.push(Number(n & 0x7Fn));
    return payload;
}

function decode(buffer: Uint8Array): [bigint, number] {
    let n = BigInt(0);
    let i = 0;

    while (true) {
        const b = BigInt(buffer[i]);

        if (b < BigInt(128)) {
            return [n + b, i + 1];
        }

        n += b - BigInt(127);
        n = n * BigInt(128);
        i++;

        if (i >= buffer.length) {
            throw new Error("Varint decoding error: buffer overflow");
        }
    }
}


export function buildRuneData(isMainnet: boolean, edicts: Edict[]): Buffer {
    let payload: number[] = []
    for(let edict of edicts) {
        if(typeof edict.amount === "string") {
            edict.amount = BigInt(edict.amount);
        }
    }

    if (edicts.length > 0) {
        encodeToVec(TAG_BODY, payload)

        edicts.sort((a, b) => a.id - b.id)

        let id = 0
        for (const edict of edicts) {
            encodeToVec(BigInt(edict.id - id), payload)
            encodeToVec(BigInt(edict.amount), payload)
            encodeToVec(BigInt(edict.output), payload)
            id = edict.id
        }
    }

    // return payload
    let prefix
    if (isMainnet) {
        prefix = 'R'
    } else {
        prefix = 'RUNE_TEST'
    }
    const opReturnScript = bscript.compile([OPS.OP_RETURN, Buffer.from(prefix), Buffer.from(payload)])

    return opReturnScript
}

export function buildRuneMainMintData(isMainnet: boolean, edicts: Edict[],useDefaultOutput :boolean,defaultOutput :number, mint: boolean,mintNum :number): Buffer {
    let payload: number[] = []
    for(let edict of edicts) {
        if(typeof edict.amount === "string") {
            edict.amount = BigInt(edict.amount);
        }
    }

    if ((mint != undefined) && mint && edicts[0].block != undefined){
        encodeToVecV2(TAG_Mint, payload);
        encodeToVecV2(BigInt(edicts[0].block), payload); // only mint edicts[0].id
        encodeToVecV2(TAG_Mint, payload);
        encodeToVecV2(BigInt(edicts[0].id), payload); // only mint edicts[0].id
    }

    if (useDefaultOutput){
        encodeToVecV2(TAG_Pointer, payload);
        encodeToVecV2(BigInt(defaultOutput), payload);
    }

    if (edicts.length > 0) {
        encodeToVecV2(TAG_BODY, payload)

        // edicts.sort((a, b) => a.id - b.id)
        edicts.sort((a, b) => {
            if (a.block === b.block) {
                if (a.id < b.id) {
                    return -1;
                }
                if (a.id> b.id) {
                    return 1;
                }
                return 0;
            }
            // @ts-ignore
            return a.block - b.block;
        });

        let id = 0
        let block = 0
        for (const edict of edicts) {
            // @ts-ignore
            encodeToVecV2(BigInt(edict.block - block), payload)
            encodeToVecV2(BigInt(edict.id - id), payload)
            encodeToVecV2(BigInt(edict.amount), payload)
            encodeToVecV2(BigInt(edict.output), payload)
            id = edict.id
            // @ts-ignore
            block = edict.block
        }
    }

    if (payload.length > 80){
        throw new Error(JSON.stringify({
            errCode:ErrCodeOpreturnExceeds,
            date:{
                payloadLenth:payload.length
            }
        }))
    }

    const opReturnScript = bscript.compile([OPS.OP_RETURN, OPS.OP_13, Buffer.from(payload)])

    return opReturnScript
}

export function buildRuneMainMintOp(id: string,useDefaultOutput :boolean,defaultOutput :number, mint: boolean) {
    let payload: number[] = []

    let block = parseInt(id.split(":")[0])
    let txindex=parseInt(id.split(":")[1])

    if ((mint != undefined) && mint && txindex != undefined ){
        encodeToVecV2(TAG_Mint, payload);
        encodeToVecV2(BigInt(block), payload); // only mint edicts[0].id
        encodeToVecV2(TAG_Mint, payload);
        encodeToVecV2(BigInt(txindex), payload); // only mint edicts[0].id
    }

    if (useDefaultOutput){
        encodeToVecV2(TAG_Pointer, payload);
        encodeToVecV2(BigInt(defaultOutput), payload);
    }

    if (payload.length > 80){
        throw new Error(JSON.stringify({
            errCode:ErrCodeOpreturnExceeds,
            date:{
                payloadLenth:payload.length
            }
        }))
    }

    const opReturnScript = bscript.compile([OPS.OP_RETURN, OPS.OP_13, Buffer.from(payload)])
    return {address: '', amount: 0, omniScript: base.toHex(opReturnScript)}
}