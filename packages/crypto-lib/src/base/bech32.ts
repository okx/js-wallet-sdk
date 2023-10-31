import {bech32} from "@scure/base";

export function toBech32(prefix: string, data: Buffer | Uint8Array | Number[]): string {
    const a = Buffer.from(data)
    const bit5 = bech32.toWords(Uint8Array.from(a))
    return bech32.encode(prefix, bit5)
}

export function fromBech32(data: string, limit?: number | false): [string, Buffer] {
    const d = bech32.decode(data, limit)
    const bit8 = bech32.fromWords(d.words)
    return [d.prefix, Buffer.from(bit8)]
}