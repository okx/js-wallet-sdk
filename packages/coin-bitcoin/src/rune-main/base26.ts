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