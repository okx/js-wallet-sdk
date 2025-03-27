import { LargeInt } from '@stellar/js-xdr';

export class Uint128 extends LargeInt {
  /**
   * Construct an unsigned 128-bit integer that can be XDR-encoded.
   *
   * @param  {Array<number|bigint|string>}  args - one or more slices to encode
   *     in big-endian format (i.e. earlier elements are higher bits)
   */
  constructor(...args) {
    super(args);
  }

  get unsigned() {
    return true;
  }

  get size() {
    return 128;
  }
}

Uint128.defineIntBoundaries();
