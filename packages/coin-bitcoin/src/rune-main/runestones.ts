import {Rune} from "../type";
import {base26Encode} from "./base26";
import {base} from "@okxweb3/crypto-lib";
import {removeSpacers} from "./spacers";


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