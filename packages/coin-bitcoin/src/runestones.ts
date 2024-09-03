import {Rune} from "./type";
import {base} from "@okxweb3/crypto-lib";

export function base26Encode(input: string): bigint {
    let result = 0n
    for (let i = 0; i < input.length; i++) {
        const charCode = BigInt(input.charCodeAt(i) - 'A'.charCodeAt(0))

        const iInv = BigInt(input.length) - 1n - BigInt(i)

        if (iInv == 0n) {
            result += charCode
        } else {
            const base = 26n ** iInv
            result += base * (charCode + 1n)
        }
    }
    return result
}

export function base26Decode(s: bigint): string {
    if (s === 340282366920938463463374607431768211455n) {
        return "BCGDENLQRQWDSLRUGSNLBTMFIJAV";
    }

    s += 1n;
    let symbol = [];
    while (s > 0) {
        const i = (s - 1n) % 26n;
        symbol.push("ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(Number(i)))
        s = (s - 1n) / 26n;
    }
    return symbol.reverse().join('')
}


export function encodeLEB128(value: bigint): number[] {
    const bytes = [];
    let more = true;

    while (more) {
        let byte = Number(value & BigInt(0x7F)); // Get the lowest 7 bits
        value >>= BigInt(7);
        if (value === BigInt(0)) { // No more data to encode
            more = false;
        } else { // More bytes to come
            byte |= 0x80; // Set the continuation bit
        }
        bytes.push(byte);
    }

    // Convert array to Buffer
    return bytes;
}

export function decodeLEB128(buf: number[]): {
    n: bigint,
    len: number
} {

    let n = BigInt(0);
    for (let i = 0; i < buf.length; i++) {
        const byte = BigInt(buf[i]);

        if (i > 18) {
            throw new Error("Overlong");
        }

        let value = byte & BigInt(0b0111_1111);


        if ((i == 18) && ((value & BigInt(0b0111_1100)) != BigInt(0))){
            throw new Error("Overflow");
        }


        n |= value << (BigInt(7) * BigInt(i));

        if ((byte & BigInt(0b1000_0000)) == BigInt(0)) {
            return {
                n,
                len: i + 1
            }
        }
    }

    throw new Error("Unterminated");

}

export function applySpacers(str: string, spacers: number): string {
    let res = ''
    for (let i = 0; i < str.length; i++) {
        res += str.charAt(i)
        if (spacers > 0) {
            // Get the least significant bit
            let bit = spacers & 1;

            if (bit === 1) {
                res += '•'
            }

            // Right shift the number to process the next bit
            spacers >>= 1;
        }
    }

    return res
}

export function getSpacersVal(str: string): number {
    let res = 0
    let spacersCnt = 0
    for (let i = 0; i < str.length; i++) {
        const char = str.charAt(i)
        if (char === '•' || char=='.') {
            res += 1 << (i - 1 - spacersCnt)
            spacersCnt++
        }
    }
    return res
}

export function removeSpacers(rune: string): string {
    return  rune.replace(/[.•]+/g, "")
}


export enum Flag {
    /** The Etching flag marks this transaction as containing an etching. */
    Etching = 0,
    /** The Terms flag marks this transaction's etching as having open mint terms. */
    Terms = 1,
    /** The Turbo flag marks this transaction's etching as opting into future protocol changes. These protocol changes may increase light client validation costs, or just be highly degenerate. */
    Turbo = 2,
    /** The Cenotaph flag is unrecognized. */
    Cenotaph = 127,
}
export enum Tag {
    /** The Body tag marks the end of the runestone's fields, causing all following integers to be interpreted as edicts. */
    Body = 0,
    /** The Flag field contains a bitmap of flags, whose position is 1 << FLAG_VALUE: */
    Flags = 2,
    /** The Rune field contains the name of the rune being etched. If the Etching flag is set but the Rune field is omitted, a reserved rune name is allocated. */
    Rune = 4,
    /** The Premine field contains the amount of premined runes. */
    Premine = 6,
    /** The Cap field contains the allowed number of mints. */
    Cap = 8,
    /** The Amount field contains the amount of runes each mint transaction receives. */
    Amount = 10,
    /** The HeightStart and HeightEnd fields contain the mint's starting and ending absolute block heights, respectively. The mint is open starting in the block with height HeightStart, and closes in the block with height HeightEnd. */
    HeightStart = 12,
    HeightEnd = 14,
    /** The OffsetStart and OffsetEnd fields contain the mint's starting and ending block heights, relative to the block in which the etching is mined. The mint is open starting in the block with height OffsetStart + ETCHING_HEIGHT, and closes in the block with height OffsetEnd + ETCHING_HEIGHT. */
    OffsetStart = 16,
    OffsetEnd = 18,
    /** The Mint field contains the Rune ID of the rune to be minted in this transaction. */
    Mint = 20,
    /** The Pointer field contains the index of the output to which runes unallocated by edicts should be transferred. If the Pointer field is absent, unallocated runes are transferred to the first non-OP_RETURN output. */
    Pointer = 22,
    /** The Cenotaph field is unrecognized. */
    Cenotaph = 126,

    /** The Divisibility field, raised to the power of ten, is the number of subunits in a super unit of runes. */
    Divisibility = 1,

    /** The Spacers field is a bitfield of • spacers that should be displayed between the letters of the rune's name. Trailing spacers are ignored. */
    Spacers = 3,
    /** The Symbol field is the Unicode codepoint of the Rune's currency symbol,
     * which should be displayed after amounts of that rune. If a rune does not have a currency symbol,
     * the generic currency character ¤ should be used.
     * For example, if the Symbol is # and the divisibility is 2,
     * the amount of 1234 units should be displayed as 12.34 #.
     */
    Symbol = 5,
    /** The Nop field is unrecognized. */
    Nop = 127,
}


export function commitment(rune:Rune) {
    let runeValue :bigint;
    if (typeof rune.value === 'string'){
        let val = removeSpacers(rune.value);
        if(!isUpper(val)){
            throw new Error("invalid rune")
        }
        runeValue = base26Encode(val);
    } else {
        runeValue = rune.value
    }
    let nstr = runeValue.toString(16);
    if (nstr.length % 2 === 1) {
        nstr = '0' + nstr;
    }
    return base.fromHex(nstr).reverse()
}

export function isUpper(data:string) :boolean {
    return /^[A-Z]+$/.test(data);
}