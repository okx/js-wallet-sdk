import { XdrLargeInt } from './xdr_large_int';

/**
 * Provides an easier way to manipulate large numbers for Stellar operations.
 *
 * You can instantiate this "**s**mart **c**ontract integer" value either from
 * bigints, strings, or numbers (whole numbers, or this will throw).
 *
 * If you need to create a native BigInt from a list of integer "parts" (for
 * example, you have a series of encoded 32-bit integers that represent a larger
 * value), you can use the lower level abstraction {@link XdrLargeInt}. For
 * example, you could do `new XdrLargeInt('u128', bytes...).toBigInt()`.
 *
 * @example
 * import { xdr, ScInt, scValToBigInt } from "@stellar/stellar-base";
 *
 * // You have an ScVal from a contract and want to parse it into JS native.
 * const value = xdr.ScVal.fromXDR(someXdr, "base64");
 * const bigi = scValToBigInt(value); // grab it as a BigInt
 * let sci = new ScInt(bigi);
 *
 * sci.toNumber(); // gives native JS type (w/ size check)
 * sci.toBigInt(); // gives the native BigInt value
 * sci.toU64();    // gives ScValType-specific XDR constructs (with size checks)
 *
 * // You have a number and want to shove it into a contract.
 * sci = ScInt(0xdeadcafebabe);
 * sci.toBigInt() // returns 244838016400062n
 * sci.toNumber() // throws: too large
 *
 * // Pass any to e.g. a Contract.call(), conversion happens automatically
 * // regardless of the initial type.
 * const scValU128 = sci.toU128();
 * const scValI256 = sci.toI256();
 * const scValU64  = sci.toU64();
 *
 * // Lots of ways to initialize:
 * ScInt("123456789123456789")
 * ScInt(123456789123456789n);
 * ScInt(1n << 140n);
 * ScInt(-42);
 * ScInt(scValToBigInt(scValU128)); // from above
 *
 * // If you know the type ahead of time (accessing `.raw` is faster than
 * // conversions), you can specify the type directly (otherwise, it's
 * // interpreted from the numbers you pass in):
 * const i = ScInt(123456789n, { type: "u256" });
 *
 * // For example, you can use the underlying `sdk.U256` and convert it to an
 * // `xdr.ScVal` directly like so:
 * const scv = new xdr.ScVal.scvU256(i.raw);
 *
 * // Or reinterpret it as a different type (size permitting):
 * const scv = i.toI64();
 *
 * @param {number|bigint|string} value - a single, integer-like value which will
 *    be interpreted in the smallest appropriate XDR type supported by Stellar
 *    (64, 128, or 256 bit integer values). signed values are supported, though
 *    they are sanity-checked against `opts.type`. if you need 32-bit values,
 *    you can construct them directly without needing this wrapper, e.g.
 *    `xdr.ScVal.scvU32(1234)`.
 *
 * @param {object}  [opts] - an optional object controlling optional parameters
 * @param {string}  [opts.type] - force a specific data type. the type choices
 *    are: 'i64', 'u64', 'i128', 'u128', 'i256', and 'u256' (default: the
 *    smallest one that fits the `value`)
 *
 * @throws {RangeError} if the `value` is invalid (e.g. floating point), too
 *    large (i.e. exceeds a 256-bit value), or doesn't fit in the `opts.type`
 * @throws {TypeError} on missing parameters, or if the "signedness" of `opts`
 *    doesn't match input `value`, e.g. passing `{type: 'u64'}` yet passing -1n
 * @throws {SyntaxError} if a string `value` can't be parsed as a big integer
 */
export class ScInt extends XdrLargeInt {
  constructor(value, opts) {
    const signed = value < 0;
    let type = opts?.type ?? '';
    if (type.startsWith('u') && signed) {
      throw TypeError(`specified type ${opts.type} yet negative (${value})`);
    }

    // If unspecified, we make a best guess at the type based on the bit length
    // of the value, treating 64 as a minimum and 256 as a maximum.
    if (type === '') {
      type = signed ? 'i' : 'u';
      const bitlen = nearestBigIntSize(value);

      switch (bitlen) {
        case 64:
        case 128:
        case 256:
          type += bitlen.toString();
          break;

        default:
          throw RangeError(
            `expected 64/128/256 bits for input (${value}), got ${bitlen}`
          );
      }
    }

    super(type, value);
  }
}

function nearestBigIntSize(bigI) {
  // Note: Even though BigInt.toString(2) includes the negative sign for
  // negative values (???), the following is still accurate, because the
  // negative sign would be represented by a sign bit.
  const bitlen = bigI.toString(2).length;
  return [64, 128, 256].find((len) => bitlen <= len) ?? bitlen;
}
