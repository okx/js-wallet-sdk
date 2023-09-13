import { base64 } from "@scure/base"

export function toBase64(data: Uint8Array | Buffer | Number[]): string {
    const a = Buffer.from(data)
    return base64.encode(Uint8Array.from(a))
}

export function fromBase64(data: string): Uint8Array {
    return base64.decode(data)
}