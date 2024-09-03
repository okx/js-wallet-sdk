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