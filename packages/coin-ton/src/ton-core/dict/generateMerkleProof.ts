import { beginCell } from '../boc/Builder';
import { Cell } from '../boc/Cell';
import { Slice } from '../boc/Slice';
import { DictionaryKeyTypes, Dictionary, DictionaryKey } from './Dictionary';
import { readUnaryLength } from './utils/readUnaryLength';

function convertToPrunedBranch(c: Cell): Cell {
    return new Cell({
        exotic: true,
        bits: beginCell()
            .storeUint(1, 8)
            .storeUint(1, 8)
            .storeBuffer(c.hash(0))
            .storeUint(c.depth(0), 16)
            .endCell()
            .beginParse()
            .loadBits(288),
    });
}

function convertToMerkleProof(c: Cell): Cell {
    return new Cell({
        exotic: true,
        bits: beginCell()
            .storeUint(3, 8)
            .storeBuffer(c.hash(0))
            .storeUint(c.depth(0), 16)
            .endCell()
            .beginParse()
            .loadBits(280),
        refs: [c],
    });
}

function doGenerateMerkleProof(
    prefix: string,
    slice: Slice,
    n: number,
    key: string
): Cell {
    // Reading label
    const originalCell = slice.asCell();

    let lb0 = slice.loadBit() ? 1 : 0;
    let prefixLength = 0;
    let pp = prefix;

    if (lb0 === 0) {
        // Short label detected

        // Read
        prefixLength = readUnaryLength(slice);

        // Read prefix
        for (let i = 0; i < prefixLength; i++) {
            pp += slice.loadBit() ? '1' : '0';
        }
    } else {
        let lb1 = slice.loadBit() ? 1 : 0;
        if (lb1 === 0) {
            // Long label detected
            prefixLength = slice.loadUint(Math.ceil(Math.log2(n + 1)));
            for (let i = 0; i < prefixLength; i++) {
                pp += slice.loadBit() ? '1' : '0';
            }
        } else {
            // Same label detected
            let bit = slice.loadBit() ? '1' : '0';
            prefixLength = slice.loadUint(Math.ceil(Math.log2(n + 1)));
            for (let i = 0; i < prefixLength; i++) {
                pp += bit;
            }
        }
    }

    if (n - prefixLength === 0) {
        return originalCell;
    } else {
        let sl = originalCell.beginParse();
        let left = sl.loadRef();
        let right = sl.loadRef();
        // NOTE: Left and right branches are implicitly contain prefixes '0' and '1'
        if (!left.isExotic) {
            if (pp + '0' === key.slice(0, pp.length + 1)) {
                left = doGenerateMerkleProof(
                    pp + '0',
                    left.beginParse(),
                    n - prefixLength - 1,
                    key
                );
            } else {
                left = convertToPrunedBranch(left);
            }
        }
        if (!right.isExotic) {
            if (pp + '1' === key.slice(0, pp.length + 1)) {
                right = doGenerateMerkleProof(
                    pp + '1',
                    right.beginParse(),
                    n - prefixLength - 1,
                    key
                );
            } else {
                right = convertToPrunedBranch(right);
            }
        }

        return beginCell()
            .storeSlice(sl)
            .storeRef(left)
            .storeRef(right)
            .endCell();
    }
}

export function generateMerkleProof<K extends DictionaryKeyTypes, V>(
    dict: Dictionary<K, V>,
    key: K,
    keyObject: DictionaryKey<K>
): Cell {
    const s = beginCell().storeDictDirect(dict).endCell().beginParse();
    return convertToMerkleProof(
        doGenerateMerkleProof(
            '',
            s,
            keyObject.bits,
            keyObject.serialize(key).toString(2).padStart(keyObject.bits, '0')
        )
    );
}
