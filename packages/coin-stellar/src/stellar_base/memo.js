import { UnsignedHyper } from '@stellar/js-xdr';
import BigNumber from './util/bignumber';
import xdr from './xdr';

/**
 * Type of {@link Memo}.
 */
export const MemoNone = 'none';
/**
 * Type of {@link Memo}.
 */
export const MemoID = 'id';
/**
 * Type of {@link Memo}.
 */
export const MemoText = 'text';
/**
 * Type of {@link Memo}.
 */
export const MemoHash = 'hash';
/**
 * Type of {@link Memo}.
 */
export const MemoReturn = 'return';

/**
 * `Memo` represents memos attached to transactions.
 *
 * @param {string} type - `MemoNone`, `MemoID`, `MemoText`, `MemoHash` or `MemoReturn`
 * @param {*} value - `string` for `MemoID`, `MemoText`, buffer of hex string for `MemoHash` or `MemoReturn`
 * @see [Transactions concept](https://developers.stellar.org/docs/glossary/transactions/)
 * @class Memo
 */
export class Memo {
  constructor(type, value = null) {
    this._type = type;
    this._value = value;

    switch (this._type) {
      case MemoNone:
        break;
      case MemoID:
        Memo._validateIdValue(value);
        break;
      case MemoText:
        Memo._validateTextValue(value);
        break;
      case MemoHash:
      case MemoReturn:
        Memo._validateHashValue(value);
        // We want MemoHash and MemoReturn to have Buffer as a value
        if (typeof value === 'string') {
          this._value = Buffer.from(value, 'hex');
        }
        break;
      default:
        throw new Error('Invalid memo type');
    }
  }

  /**
   * Contains memo type: `MemoNone`, `MemoID`, `MemoText`, `MemoHash` or `MemoReturn`
   */
  get type() {
    return this._type;
  }

  set type(type) {
    throw new Error('Memo is immutable');
  }

  /**
   * Contains memo value:
   * * `null` for `MemoNone`,
   * * `string` for `MemoID`,
   * * `Buffer` for `MemoText` after decoding using `fromXDRObject`, original value otherwise,
   * * `Buffer` for `MemoHash`, `MemoReturn`.
   */
  get value() {
    switch (this._type) {
      case MemoNone:
        return null;
      case MemoID:
      case MemoText:
        return this._value;
      case MemoHash:
      case MemoReturn:
        return Buffer.from(this._value);
      default:
        throw new Error('Invalid memo type');
    }
  }

  set value(value) {
    throw new Error('Memo is immutable');
  }

  static _validateIdValue(value) {
    const error = new Error(`Expects a int64 as a string. Got ${value}`);

    if (typeof value !== 'string') {
      throw error;
    }

    let number;
    try {
      number = new BigNumber(value);
    } catch (e) {
      throw error;
    }

    // Infinity
    if (!number.isFinite()) {
      throw error;
    }

    // NaN
    if (number.isNaN()) {
      throw error;
    }
  }

  static _validateTextValue(value) {
    if (!xdr.Memo.armTypeForArm('text').isValid(value)) {
      throw new Error('Expects string, array or buffer, max 28 bytes');
    }
  }

  static _validateHashValue(value) {
    const error = new Error(
      `Expects a 32 byte hash value or hex encoded string. Got ${value}`
    );

    if (value === null || typeof value === 'undefined') {
      throw error;
    }

    let valueBuffer;
    if (typeof value === 'string') {
      if (!/^[0-9A-Fa-f]{64}$/g.test(value)) {
        throw error;
      }
      valueBuffer = Buffer.from(value, 'hex');
    } else if (Buffer.isBuffer(value)) {
      valueBuffer = Buffer.from(value);
    } else {
      throw error;
    }

    if (!valueBuffer.length || valueBuffer.length !== 32) {
      throw error;
    }
  }

  /**
   * Returns an empty memo (`MemoNone`).
   * @returns {Memo}
   */
  static none() {
    return new Memo(MemoNone);
  }

  /**
   * Creates and returns a `MemoText` memo.
   * @param {string} text - memo text
   * @returns {Memo}
   */
  static text(text) {
    return new Memo(MemoText, text);
  }

  /**
   * Creates and returns a `MemoID` memo.
   * @param {string} id - 64-bit number represented as a string
   * @returns {Memo}
   */
  static id(id) {
    return new Memo(MemoID, id);
  }

  /**
   * Creates and returns a `MemoHash` memo.
   * @param {array|string} hash - 32 byte hash or hex encoded string
   * @returns {Memo}
   */
  static hash(hash) {
    return new Memo(MemoHash, hash);
  }

  /**
   * Creates and returns a `MemoReturn` memo.
   * @param {array|string} hash - 32 byte hash or hex encoded string
   * @returns {Memo}
   */
  static return(hash) {
    return new Memo(MemoReturn, hash);
  }

  /**
   * Returns XDR memo object.
   * @returns {xdr.Memo}
   */
  toXDRObject() {
    switch (this._type) {
      case MemoNone:
        return xdr.Memo.memoNone();
      case MemoID:
        return xdr.Memo.memoId(UnsignedHyper.fromString(this._value));
      case MemoText:
        return xdr.Memo.memoText(this._value);
      case MemoHash:
        return xdr.Memo.memoHash(this._value);
      case MemoReturn:
        return xdr.Memo.memoReturn(this._value);
      default:
        return null;
    }
  }

  /**
   * Returns {@link Memo} from XDR memo object.
   * @param {xdr.Memo} object XDR memo object
   * @returns {Memo}
   */
  static fromXDRObject(object) {
    switch (object.arm()) {
      case 'id':
        return Memo.id(object.value().toString());
      case 'text':
        return Memo.text(object.value());
      case 'hash':
        return Memo.hash(object.value());
      case 'retHash':
        return Memo.return(object.value());
      default:
        break;
    }

    if (typeof object.value() === 'undefined') {
      return Memo.none();
    }

    throw new Error('Unknown type');
  }
}
