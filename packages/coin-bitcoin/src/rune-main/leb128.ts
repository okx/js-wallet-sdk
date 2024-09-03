
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