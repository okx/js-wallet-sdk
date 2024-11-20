/* eslint-disable no-bitwise */
/* eslint-disable unicorn/number-literal-case */
/**
 * Adds two 256-bit numbers represented as byte arrays. For the first 28 bytes,
 * it multiplies the second number by 8 before adding.
 *
 * @param x The first 256-bit number as a byte array.
 * @param y The second 256-bit number as a byte array.
 * @returns The result of the addition as a byte array.
 */
export const add28Mul8 = (x: Uint8Array, y: Uint8Array): Uint8Array => {
  let carry = 0;
  const out: Uint8Array = new Uint8Array(32);

  for (let i = 0; i < 28; i++) {
    const r: number = x[i] + (y[i] << 3) + carry;
    out[i] = r & 0xff;
    carry = r >> 8;
  }
  for (let i = 28; i < 32; i++) {
    const r: number = x[i] + carry;
    out[i] = r & 0xff;
    carry = r >> 8;
  }
  return out;
};

/**
 * Adds two 256-bit numbers represented as byte arrays.
 *
 * @param x The first 256-bit number as a byte array.
 * @param y The second 256-bit number as a byte array.
 * @returns The result of the addition as a byte array.
 */
export const add256bits = (x: Uint8Array, y: Uint8Array): Uint8Array => {
  let carry = 0;
  const out: Uint8Array = new Uint8Array(32);

  for (let i = 0; i < 32; i++) {
    const r: number = x[i] + y[i] + carry;
    out[i] = r;
    carry = r >> 8;
  }

  return out;
};

/**
 * Converts a 32-bit number into a little-endian byte array.
 *
 * @param i A 32-bit number.
 * @returns A 4-byte little-endian representation of the input.
 */
export const le32 = (i: number): Uint8Array =>
  new Uint8Array([i & 0xff, (i >> 8) & 0xff, (i >> 16) & 0xff, (i >> 24) & 0xff]);
