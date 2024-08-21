import { Slice } from '../../boc/Slice';

export function readUnaryLength(slice: Slice) {
    let res = 0;
    while (slice.loadBit()) {
        res++;
    }
    return res;
}
