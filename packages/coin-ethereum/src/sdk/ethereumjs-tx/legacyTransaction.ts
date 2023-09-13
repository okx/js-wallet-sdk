/**
 * The following methods are based on `ethereumjs/tx`, thanks for their work
 * https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/tx
 * Distributed under the Mozilla Public License Version 2.0 software license, see the accompanying
 * file LICENSE or https://opensource.org/license/mpl-2-0/.
 */

import {
  bnToHex,
  bnToUnpaddedBuffer,
  MAX_INTEGER,
  rlp,
  rlphash,
  toBuffer,
  unpadBuffer,
  validateNoLeadingZeroes,
} from '../ethereumjs-util';
import { TxData, JsonTx, TxValuesArray } from './types';
import { BaseTransaction } from './baseTransaction'

import { BN } from "@okxweb3/crypto-lib"

const TRANSACTION_TYPE = 0

/**
 * An Ethereum non-typed (legacy) transaction
 */
export default class Transaction extends BaseTransaction<Transaction> {
  public readonly gasPrice: BN
  public readonly chainId: BN


  /**
   * Instantiate a transaction from a data dictionary.
   *
   * Format: { nonce, gasPrice, gasLimit, to, value, data, v, r, s }
   *
   * Notes:
   * - All parameters are optional and have some basic default values
   */
  public static fromTxData(txData: TxData) {
    return new Transaction(txData)
  }

  /**
   * Instantiate a transaction from the serialized tx.
   *
   * Format: `rlp([nonce, gasPrice, gasLimit, to, value, data, v, r, s])`
   */
  public static fromSerializedTx(serialized: Buffer, chainId?: number) {
    const values = rlp.decode(serialized)

    if (!Array.isArray(values)) {
      throw new Error('Invalid serialized tx input. Must be array')
    }

    return this.fromValuesArray(values, chainId)
  }

  /**
   * Create a transaction from a values array.
   *
   * Format: `[nonce, gasPrice, gasLimit, to, value, data, v, r, s]`
   */
  public static fromValuesArray(values: TxValuesArray, chainId?: number) {
    // If length is not 6, it has length 9. If v/r/s are empty Buffers, it is still an unsigned transaction
    // This happens if you get the RLP data from `raw()`
    if (values.length !== 6 && values.length !== 9) {
      throw new Error(
          'Invalid transaction. Only expecting 6 values (for unsigned tx) or 9 values (for signed tx).'
      )
    }

    const [nonce, gasPrice, gasLimit, to, value, data, v, r, s] = values

    validateNoLeadingZeroes({ nonce, gasPrice, gasLimit, value, v, r, s })

    return new Transaction(
        {
          nonce,
          gasPrice,
          gasLimit,
          to,
          value,
          data,
          v,
          r,
          s,
          chainId
        }
    )
  }

  /**
   * This constructor takes the values, validates them, assigns them and freezes the object.
   *
   * It is not recommended to use this constructor directly. Instead use
   * the static factory methods to assist in creating a Transaction object from
   * varying data types.
   */
  public constructor(txData: TxData) {
    super({ ...txData, type: TRANSACTION_TYPE })

    this.gasPrice = new BN(toBuffer(txData.gasPrice === '' ? '0x' : txData.gasPrice))
    this.chainId = new BN(toBuffer(txData.chainId === '' ? '0x' : txData.chainId))

    if (this.gasPrice.mul(this.gasLimit).gt(MAX_INTEGER)) {
      const msg = this._errorMsg('gas limit * gasPrice cannot exceed MAX_INTEGER (2^256-1)')
      throw new Error(msg)
    }
    this._validateCannotExceedMaxInteger({ gasPrice: this.gasPrice })
  }

  /**
   * Returns a Buffer Array of the raw Buffers of the legacy transaction, in order.
   *
   * Format: `[nonce, gasPrice, gasLimit, to, value, data, v, r, s]`
   *
   * For legacy txs this is also the correct format to add transactions
   * to a block with {@link Block.fromValuesArray} (use the `serialize()` method
   * for typed txs).
   *
   * For an unsigned tx this method returns the empty Buffer values
   * for the signature parameters `v`, `r` and `s`. For an EIP-155 compliant
   * representation have a look at {@link Transaction.getMessageToSign}.
   */
  raw(): TxValuesArray {
    return [
      bnToUnpaddedBuffer(this.nonce),
      bnToUnpaddedBuffer(this.gasPrice),
      bnToUnpaddedBuffer(this.gasLimit),
      this.to !== undefined ? this.to.buf : Buffer.from([]),
      bnToUnpaddedBuffer(this.value),
      this.data,
      this.v !== undefined ? bnToUnpaddedBuffer(this.v) : Buffer.from([]),
      this.r !== undefined ? bnToUnpaddedBuffer(this.r) : Buffer.from([]),
      this.s !== undefined ? bnToUnpaddedBuffer(this.s) : Buffer.from([]),
    ]
  }

  /**
   * Returns the serialized encoding of the legacy transaction.
   *
   * Format: `rlp([nonce, gasPrice, gasLimit, to, value, data, v, r, s])`
   *
   * For an unsigned tx this method uses the empty Buffer values for the
   * signature parameters `v`, `r` and `s` for encoding. For an EIP-155 compliant
   * representation for external signing use {@link Transaction.getMessageToSign}.
   */
  serialize(): Buffer {
    return rlp.encode(this.raw())
  }

  private _getMessageToSign() {
    const values = [
      bnToUnpaddedBuffer(this.nonce),
      bnToUnpaddedBuffer(this.gasPrice),
      bnToUnpaddedBuffer(this.gasLimit),
      this.to !== undefined ? this.to.buf : Buffer.from([]),
      bnToUnpaddedBuffer(this.value),
      this.data,
      toBuffer(this.chainId),
      unpadBuffer(toBuffer(0)),
      unpadBuffer(toBuffer(0)),
    ]
    return values
  }

  /**
   * Returns the unsigned tx (hashed or raw), which can be used
   * to sign the transaction (e.g. for sending to a hardware wallet).
   *
   * Note: the raw message message format for the legacy tx is not RLP encoded
   * and you might need to do yourself with:
   *
   * ```javascript
   * import { rlp } from 'ethereumjs-util'
   * const message = tx.getMessageToSign(false)
   * const serializedMessage = rlp.encode(message) // use this for the HW wallet input
   * ```
   *
   * @param hashMessage - Return hashed message if set to true (default: true)
   */
  getMessageToSign(hashMessage: false): Buffer[]
  getMessageToSign(hashMessage?: true): Buffer
  getMessageToSign(hashMessage = true) {
    const message = this._getMessageToSign()
    if (hashMessage) {
      return rlphash(message)
    } else {
      return message
    }
  }


  /**
   * Computes a sha3-256 hash of the serialized tx.
   *
   * This method can only be used for signed txs (it throws otherwise).
   * Use {@link Transaction.getMessageToSign} to get a tx hash for the purpose of signing.
   */
  hash(): Buffer {
    // In contrast to the tx type transaction implementations the `hash()` function
    // for the legacy tx does not throw if the tx is not signed.
    // This has been considered for inclusion but lead to unexpected backwards
    // compatibility problems (no concrete reference found, needs validation).
    //
    // For context see also https://github.com/ethereumjs/ethereumjs-monorepo/pull/1445,
    // September, 2021 as well as work done before.
    //
    // This should be updated along the next major version release by adding:
    //
    //if (!this.isSigned()) {
    //  const msg = this._errorMsg('Cannot call hash method if transaction is not signed')
    //  throw new Error(msg)
    //}
    return rlphash(this.raw())
  }

  /**
   * Process the v, r, s values from the `sign` method of the base transaction.
   */
  protected _processSignature(v: number, r: Buffer, s: Buffer) {
    const vBN = new BN(2 * this.chainId.toNumber() + v + 8)
    return Transaction.fromTxData(
      {
        nonce: this.nonce,
        gasPrice: this.gasPrice,
        gasLimit: this.gasLimit,
        to: this.to,
        value: this.value,
        data: this.data,
        chainId: this.chainId,
        v: vBN,
        r: new BN(r),
        s: new BN(s),
      }
    )
  }

  protected _processSignatureWithRawV(v: number, r: Buffer, s: Buffer) {
    return Transaction.fromTxData(
      {
        nonce: this.nonce,
        gasPrice: this.gasPrice,
        gasLimit: this.gasLimit,
        to: this.to,
        value: this.value,
        data: this.data,
        chainId: this.chainId,
        v: new BN(v),
        r: new BN(r),
        s: new BN(s),
      }
    )
  }

  /**
   * Returns an object with the JSON representation of the transaction.
   */
  toJSON(): JsonTx {
    return {
      nonce: bnToHex(this.nonce),
      gasPrice: bnToHex(this.gasPrice),
      gasLimit: bnToHex(this.gasLimit),
      to: this.to !== undefined ? this.to.toString() : undefined,
      value: bnToHex(this.value),
      data: '0x' + this.data.toString('hex'),
      v: this.v !== undefined ? bnToHex(this.v) : undefined,
      r: this.r !== undefined ? bnToHex(this.r) : undefined,
      s: this.s !== undefined ? bnToHex(this.s) : undefined,
    }
  }

  /**
   * Return a compact error string representation of the object
   */
  public errorStr() {
    let errorStr = this._getSharedErrorPostfix()
    errorStr += ` gasPrice=${this.gasPrice}`
    return errorStr
  }

  /**
   * Internal helper function to create an annotated error message
   *
   * @param msg Base error message
   * @hidden
   */
  protected _errorMsg(msg: string) {
    return `${msg} (${this.errorStr()})`
  }
}
