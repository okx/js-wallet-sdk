import { base58 } from "@scure/base"
export function toBase58(data: Uint8Array | Buffer | Number[]): string {
    const a = Buffer.from(data)
    return base58.encode(Uint8Array.from(a))
}

export function fromBase58(data: string): Uint8Array {
    return base58.decode(data)
}

export {base58}