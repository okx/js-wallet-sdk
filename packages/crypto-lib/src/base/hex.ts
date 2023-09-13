export function toHex(data: Uint8Array | Buffer | number[], addPrefix: boolean = false): string {
    const buffer = Buffer.from(data)
    return addPrefix? "0x" + buffer.toString("hex") : buffer.toString("hex")
}

export function fromHex(data: string): Buffer {
    if(data.startsWith("0x")) {
        data = data.substring(2)
    }
    return Buffer.from(data, "hex")
}

export function stripHexPrefix(hex: string) : string {
    if(hex.startsWith("0x")) {
        return hex.substring(2)
    }
    return hex
}

export function isHexPrefixed(hex: string) : boolean {
    return hex.startsWith("0x")
}