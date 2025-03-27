/* eslint no-bitwise: ["error", {"allow": [">>"]}] */
import { Hyper, UnsignedHyper } from '@stellar/js-xdr';

import { Uint128 } from './uint128';
import { Uint256 } from './uint256';
import { Int128 } from './int128';
import { Int256 } from './int256';

import xdr from '../xdr';

/**
 * A wrapper class to represent large XDR-encodable integers.
 *
 * This operates at a lower level than {@link ScInt} by forcing you to specify
 * the type / width / size in bits of the integer you're targeting, regardless
 * of the input value(s) you provide.
 *
 * @param {string}  type - force a specific data type. the type choices are:
 *    'i64', 'u64', 'i128', 'u128', 'i256', and 'u256' (default: the smallest
 *    one that fits the `value`) (see {@link XdrLargeInt.isType})
 * @param {number|bigint|string|Array<number|bigint|string>} values   a list of
 *    integer-like values interpreted in big-endian order
 */
export class XdrLargeInt {
  /** @type {xdr.LargeInt} */
  int; // child class of a jsXdr.LargeInt

  /** @type {string} */
  type;

  constructor(type, values) {
    if (!(values instanceof Array)) {
      values = [values];
    }

    // normalize values to one type
    values = values.map((i) => {
      // micro-optimization to no-op on the likeliest input value:
      if (typeof i === 'bigint') {
        return i;
      }
      if (i instanceof XdrLargeInt) {
        return i.toBigInt();
      }
      return BigInt(i);
    });

    switch (type) {
      case 'i64':
        this.int = new Hyper(values);
        break;
      case 'i128':
        this.int = new Int128(values);
        break;
      case 'i256':
        this.int = new Int256(values);
        break;
      case 'u64':
        this.int = new UnsignedHyper(values);
        break;
      case 'u128':
        this.int = new Uint128(values);
        break;
      case 'u256':
        this.int = new Uint256(values);
        break;
      default:
        throw TypeError(`invalid type: ${type}`);
    }

    this.type = type;
  }

  /**
   * @returns {number}
   * @throws {RangeError} if the value can't fit into a Number
   */
  toNumber() {
    const bi = this.int.toBigInt();
    if (bi > Number.MAX_SAFE_INTEGER || bi < Number.MIN_SAFE_INTEGER) {
      throw RangeError(
        `value ${bi} not in range for Number ` +
          `[${Number.MAX_SAFE_INTEGER}, ${Number.MIN_SAFE_INTEGER}]`
      );
    }

    return Number(bi);
  }

  /** @returns {bigint} */
  toBigInt() {
    return this.int.toBigInt();
  }

  /** @returns {xdr.ScVal} the integer encoded with `ScValType = I64` */
  toI64() {
    this._sizeCheck(64);
    const v = this.toBigInt();
    if (BigInt.asIntN(64, v) !== v) {
      throw RangeError(`value too large for i64: ${v}`);
    }

    return xdr.ScVal.scvI64(new xdr.Int64(v));
  }

  /** @returns {xdr.ScVal} the integer encoded with `ScValType = U64` */
  toU64() {
    this._sizeCheck(64);
    return xdr.ScVal.scvU64(
      new xdr.Uint64(BigInt.asUintN(64, this.toBigInt())) // reiterpret as unsigned
    );
  }

  /**
   * @returns {xdr.ScVal} the integer encoded with `ScValType = I128`
   * @throws {RangeError} if the value cannot fit in 128 bits
   */
  toI128() {
    this._sizeCheck(128);

    const v = this.int.toBigInt();
    const hi64 = BigInt.asIntN(64, v >> 64n); // encode top 64 w/ sign bit
    const lo64 = BigInt.asUintN(64, v); // grab btm 64, encode sign

    return xdr.ScVal.scvI128(
      new xdr.Int128Parts({
        hi: new xdr.Int64(hi64),
        lo: new xdr.Uint64(lo64)
      })
    );
  }

  /**
   * @returns {xdr.ScVal} the integer encoded with `ScValType = U128`
   * @throws {RangeError} if the value cannot fit in 128 bits
   */
  toU128() {
    this._sizeCheck(128);
    const v = this.int.toBigInt();

    return xdr.ScVal.scvU128(
      new xdr.UInt128Parts({
        hi: new xdr.Uint64(BigInt.asUintN(64, v >> 64n)),
        lo: new xdr.Uint64(BigInt.asUintN(64, v))
      })
    );
  }

  /** @returns {xdr.ScVal} the integer encoded with `ScValType = I256` */
  toI256() {
    const v = this.int.toBigInt();
    const hiHi64 = BigInt.asIntN(64, v >> 192n); // keep sign bit
    const hiLo64 = BigInt.asUintN(64, v >> 128n);
    const loHi64 = BigInt.asUintN(64, v >> 64n);
    const loLo64 = BigInt.asUintN(64, v);

    return xdr.ScVal.scvI256(
      new xdr.Int256Parts({
        hiHi: new xdr.Int64(hiHi64),
        hiLo: new xdr.Uint64(hiLo64),
        loHi: new xdr.Uint64(loHi64),
        loLo: new xdr.Uint64(loLo64)
      })
    );
  }

  /** @returns {xdr.ScVal} the integer encoded with `ScValType = U256` */
  toU256() {
    const v = this.int.toBigInt();
    const hiHi64 = BigInt.asUintN(64, v >> 192n); // encode sign bit
    const hiLo64 = BigInt.asUintN(64, v >> 128n);
    const loHi64 = BigInt.asUintN(64, v >> 64n);
    const loLo64 = BigInt.asUintN(64, v);

    return xdr.ScVal.scvU256(
      new xdr.UInt256Parts({
        hiHi: new xdr.Uint64(hiHi64),
        hiLo: new xdr.Uint64(hiLo64),
        loHi: new xdr.Uint64(loHi64),
        loLo: new xdr.Uint64(loLo64)
      })
    );
  }

  /** @returns {xdr.ScVal} the smallest interpretation of the stored value */
  toScVal() {
    switch (this.type) {
      case 'i64':
        return this.toI64();
      case 'i128':
        return this.toI128();
      case 'i256':
        return this.toI256();
      case 'u64':
        return this.toU64();
      case 'u128':
        return this.toU128();
      case 'u256':
        return this.toU256();
      default:
        throw TypeError(`invalid type: ${this.type}`);
    }
  }

  valueOf() {
    return this.int.valueOf();
  }

  toString() {
    return this.int.toString();
  }

  toJSON() {
    return {
      value: this.toBigInt().toString(),
      type: this.type
    };
  }

  _sizeCheck(bits) {
    if (this.int.size > bits) {
      throw RangeError(`value too large for ${bits} bits (${this.type})`);
    }
  }

  static isType(type) {
    switch (type) {
      case 'i64':
      case 'i128':
      case 'i256':
      case 'u64':
      case 'u128':
      case 'u256':
        return true;
      default:
        return false;
    }
  }

  /**
   * Convert the raw `ScValType` string (e.g. 'scvI128', generated by the XDR)
   * to a type description for {@link XdrLargeInt} construction (e.g. 'i128')
   *
   * @param {string} scvType  the `xdr.ScValType` as a string
   * @returns {string} a suitable equivalent type to construct this object
   */
  static getType(scvType) {
    return scvType.slice(3).toLowerCase();
  }
}
