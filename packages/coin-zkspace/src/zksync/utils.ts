/**
 * The following methods are based on `matter-labs`, thanks for their work
 * https://github.com/matter-labs/zksync/tree/82cfd3ff19d3bfa071c0a5061390b8f3d91f47ee/sdk/zksync.js
 */
import { BigNumber } from '@ethersproject/bignumber';

const AMOUNT_EXPONENT_BIT_WIDTH = 5;
const AMOUNT_MANTISSA_BIT_WIDTH = 35;
const FEE_EXPONENT_BIT_WIDTH = 5;
const FEE_MANTISSA_BIT_WIDTH = 11;

// @ts-ignore
export function closestPackableTransactionAmount(amount): BigNumber {
  const packedAmount = packAmount(BigNumber.from(amount));
  return floatToInteger(packedAmount, AMOUNT_EXPONENT_BIT_WIDTH, AMOUNT_MANTISSA_BIT_WIDTH, 10);
}

// @ts-ignore
export function closestPackableTransactionFee(fee): BigNumber {
  const packedFee = packFee(BigNumber.from(fee));
  return floatToInteger(packedFee, FEE_EXPONENT_BIT_WIDTH, FEE_MANTISSA_BIT_WIDTH, 10);
}

function packFee(amount: BigNumber): Uint8Array {
  return reverseBits(integerToFloat(amount, FEE_EXPONENT_BIT_WIDTH, FEE_MANTISSA_BIT_WIDTH, 10));
}
export function floatToInteger(
  floatBytes: Uint8Array,
  expBits: number,
  mantissaBits: number,
  expBaseNumber: number
): BigNumber {
  if (floatBytes.length * 8 !== mantissaBits + expBits) {
    throw new Error('Float unpacking, incorrect input length');
  }

  const bits = buffer2bitsBE(floatBytes).reverse();
  let exponent = BigNumber.from(0);
  let expPow2 = BigNumber.from(1);
  for (let i = 0; i < expBits; i++) {
    if (bits[i] === 1) {
      exponent = exponent.add(expPow2);
    }
    expPow2 = expPow2.mul(2);
  }
  exponent = BigNumber.from(expBaseNumber).pow(exponent);

  let mantissa = BigNumber.from(0);
  let mantissaPow2 = BigNumber.from(1);
  for (let i = expBits; i < expBits + mantissaBits; i++) {
    if (bits[i] === 1) {
      mantissa = mantissa.add(mantissaPow2);
    }
    mantissaPow2 = mantissaPow2.mul(2);
  }
  return exponent.mul(mantissa);
}

// @ts-ignore
export function buffer2bitsBE(buff) {
  const res = new Array(buff.length * 8);
  for (let i = 0; i < buff.length; i++) {
    const b = buff[i];
    res[i * 8] = (b & 0x80) !== 0 ? 1 : 0;
    res[i * 8 + 1] = (b & 0x40) !== 0 ? 1 : 0;
    res[i * 8 + 2] = (b & 0x20) !== 0 ? 1 : 0;
    res[i * 8 + 3] = (b & 0x10) !== 0 ? 1 : 0;
    res[i * 8 + 4] = (b & 0x08) !== 0 ? 1 : 0;
    res[i * 8 + 5] = (b & 0x04) !== 0 ? 1 : 0;
    res[i * 8 + 6] = (b & 0x02) !== 0 ? 1 : 0;
    res[i * 8 + 7] = (b & 0x01) !== 0 ? 1 : 0;
  }
  return res;
}

function packAmount(amount: BigNumber): Uint8Array {
  return reverseBits(integerToFloat(amount, AMOUNT_EXPONENT_BIT_WIDTH, AMOUNT_MANTISSA_BIT_WIDTH, 10));
}

export function reverseBits(buffer: Uint8Array): Uint8Array {
  const reversed = buffer.reverse();
  reversed.map((b) => {
    // reverse bits in byte
    b = ((b & 0xf0) >> 4) | ((b & 0x0f) << 4);
    b = ((b & 0xcc) >> 2) | ((b & 0x33) << 2);
    b = ((b & 0xaa) >> 1) | ((b & 0x55) << 1);
    return b;
  });
  return reversed;
}

export function integerToFloat(integer: BigNumber, expBits: number, mantissaBits: number, expBase: number): Uint8Array {
  const maxExponentPower = BigNumber.from(2).pow(expBits).sub(1);
  const maxExponent = BigNumber.from(expBase).pow(maxExponentPower);
  const maxMantissa = BigNumber.from(2).pow(mantissaBits).sub(1);

  if (integer.gt(maxMantissa.mul(maxExponent))) {
    throw new Error('Integer is too big');
  }

  // The algortihm is as follows: calculate minimal exponent
  // such that integer <= max_mantissa * exponent_base ^ exponent,
  // then if this minimal exponent is 0 we can choose mantissa equals integer and exponent equals 0
  // else we need to check two variants:
  // 1) with that minimal exponent
  // 2) with that minimal exponent minus 1
  let exponent = 0;
  let exponentTemp = BigNumber.from(1);
  while (integer.gt(maxMantissa.mul(exponentTemp))) {
    exponentTemp = exponentTemp.mul(expBase);
    exponent += 1;
  }
  let mantissa = integer.div(exponentTemp);
  if (exponent !== 0) {
    const variant1 = exponentTemp.mul(mantissa);
    const variant2 = exponentTemp.div(expBase).mul(maxMantissa);
    const diff1 = integer.sub(variant1);
    const diff2 = integer.sub(variant2);
    if (diff2.lt(diff1)) {
      mantissa = maxMantissa;
      exponent -= 1;
    }
  }

  // encode into bits. First bits of mantissa in LE order
  const encoding = [];

  encoding.push(...numberToBits(exponent, expBits));
  const mantissaNumber = mantissa.toNumber();
  encoding.push(...numberToBits(mantissaNumber, mantissaBits));

  return bitsIntoBytesInBEOrder(encoding.reverse()).reverse();
}

function numberToBits(integer: number, bits: number): number[] {
  const result = [];
  for (let i = 0; i < bits; i++) {
    result.push(integer & 1);
    integer /= 2;
  }
  return result;
}

export function bitsIntoBytesInBEOrder(bits: number[]): Uint8Array {
  if (bits.length % 8 !== 0) {
    throw new Error('wrong number of bits to pack');
  }
  const nBytes = bits.length / 8;
  const resultBytes = new Uint8Array(nBytes);

  for (let byte = 0; byte < nBytes; ++byte) {
    let value = 0;
    if (bits[byte * 8] === 1) {
      value |= 0x80;
    }
    if (bits[byte * 8 + 1] === 1) {
      value |= 0x40;
    }
    if (bits[byte * 8 + 2] === 1) {
      value |= 0x20;
    }
    if (bits[byte * 8 + 3] === 1) {
      value |= 0x10;
    }
    if (bits[byte * 8 + 4] === 1) {
      value |= 0x08;
    }
    if (bits[byte * 8 + 5] === 1) {
      value |= 0x04;
    }
    if (bits[byte * 8 + 6] === 1) {
      value |= 0x02;
    }
    if (bits[byte * 8 + 7] === 1) {
      value |= 0x01;
    }

    resultBytes[byte] = value;
  }

  return resultBytes;
}