/**
 * The following methods are based on `ethereumjs/tx`, thanks for their work
 * https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/tx
 * Distributed under the Mozilla Public License Version 2.0 software license, see the accompanying
 * file LICENSE or https://opensource.org/license/mpl-2-0/.
 */

import {
  toBuffer,
  MAX_INTEGER,
  MAX_UINT64,
  Address, ecdsaSign, bufferToHex,
} from '../ethereumjs-util'

import { base, BN } from '@okxweb3/crypto-lib';

import {
  TxData,
  JsonTx,
  AccessListEIP2930ValuesArray,
  AccessListEIP2930TxData,
  FeeMarketEIP1559ValuesArray,
  FeeMarketEIP1559TxData,
  TxValuesArray,
} from './types'
import {Buffer} from "buffer";

export enum Chain {
  Mainnet = 1,
  Ropsten = 3,
  Rinkeby = 4,
  Kovan = 42,
  Goerli = 5,
  Sepolia = 11155111,
}

/**
 * This base class will likely be subject to further
 * refactoring along the introduction of additional tx types
 * on the Ethereum network.
 *
 * It is therefore not recommended to use directly.
 */
export abstract class BaseTransaction<TransactionObject> {
  private readonly _type: number

  public readonly nonce: BN
  public readonly gasLimit: BN
  public readonly to?: Address
  public readonly value: BN
  public readonly data: Buffer

  public readonly v?: BN
  public readonly r?: BN
  public readonly s?: BN

  /**
   * List of tx type defining EIPs,
   * e.g. 1559 (fee market) and 2930 (access lists)
   * for FeeMarketEIP1559Transaction objects
   */
  protected activeCapabilities: number[] = []

  /**
   * The default chain the tx falls back to if no Common
   * is provided and if the chain can't be derived from
   * a passed in chainId (only EIP-2718 typed txs) or
   * EIP-155 signature (legacy txs).
   *
   * @hidden
   */
  protected DEFAULT_CHAIN = Chain.Mainnet

  protected constructor(txData: TxData | AccessListEIP2930TxData | FeeMarketEIP1559TxData) {
    const {nonce, gasLimit, to, value, data, v, r, s, type} = txData
    this._type = new BN(toBuffer(type)).toNumber()

    const toB = toBuffer(to === '' ? '0x' : to)
    const vB = toBuffer(v === '' ? '0x' : v)
    const rB = toBuffer(r === '' ? '0x' : r)
    const sB = toBuffer(s === '' ? '0x' : s)

    this.nonce = new BN(toBuffer(nonce === '' ? '0x' : nonce))
    this.gasLimit = new BN(toBuffer(gasLimit === '' ? '0x' : gasLimit))
    this.to = toB.length > 0 ? new Address(toB) : undefined
    this.value = new BN(toBuffer(value === '' ? '0x' : value))
    this.data = toBuffer(data === '' ? '0x' : data)

    this.v = vB.length > 0 ? new BN(vB) : undefined
    this.r = rB.length > 0 ? new BN(rB) : undefined
    this.s = sB.length > 0 ? new BN(sB) : undefined

    this._validateCannotExceedMaxInteger({value: this.value, r: this.r, s: this.s})

    // geth limits gasLimit to 2^64-1
    this._validateCannotExceedMaxInteger({gasLimit: this.gasLimit}, 64)

    // EIP-2681 limits nonce to 2^64-1 (cannot equal 2^64-1)
    this._validateCannotExceedMaxInteger({nonce: this.nonce}, 64, true)
  }

  /**
   * Alias for {@link BaseTransaction.type}
   *
   * @deprecated Use `type` instead
   */
  get transactionType(): number {
    return this.type
  }

  /**
   * Returns the transaction type.
   *
   * Note: legacy txs will return tx type `0`.
   */
  get type() {
    return this._type
  }


  /**
   * Returns a Buffer Array of the raw Buffers of this transaction, in order.
   *
   * Use {@link BaseTransaction.serialize} to add a transaction to a block
   * with {@link Block.fromValuesArray}.
   *
   * For an unsigned tx this method uses the empty Buffer values for the
   * signature parameters `v`, `r` and `s` for encoding. For an EIP-155 compliant
   * representation for external signing use {@link BaseTransaction.getMessageToSign}.
   */
  abstract raw(): TxValuesArray | AccessListEIP2930ValuesArray | FeeMarketEIP1559ValuesArray

  /**
   * Returns the encoding of the transaction.
   */
  abstract serialize(): Buffer

  // Returns the unsigned tx (hashed or raw), which is used to sign the transaction.
  //
  // Note: do not use code docs here since VS Studio is then not able to detect the
  // comments from the inherited methods
  abstract getMessageToSign(hashMessage: false): Buffer | Buffer[]
  abstract getMessageToSign(hashMessage?: true): Buffer

  abstract hash(): Buffer

  public isSigned(): boolean {
    const {v, r, s} = this
    if (this.type === 0) {
      if (!v || !r || !s) {
        return false
      } else {
        return true
      }
    } else {
      if (v === undefined || !r || !s) {
        return false
      } else {
        return true
      }
    }
  }

  /**
   * Returns an object with the JSON representation of the transaction
   */
  abstract toJSON(): JsonTx

  /**
   * Signs a transaction.
   *
   * Note that the signed tx is returned as a new object,
   * use as follows:
   * ```javascript
   * const signedTx = tx.sign(privateKey)
   * ```
   */
  sign(privateKey: Buffer): TransactionObject {
    if (privateKey.length !== 32) {
      const msg = this._errorMsg('Private key must be 32 bytes in length.')
      throw new Error(msg)
    }

    const msgHash = this.getMessageToSign(true)
    const {v, r, s} = ecdsaSign(msgHash, privateKey)

    return this._processSignature(v, r, s)
  }

  // Accept the v,r,s values from the `sign` method, and convert this into a TransactionObject
  protected abstract _processSignature(v: number, r: Buffer, s: Buffer): TransactionObject

  protected abstract _processSignatureWithRawV(v: number, r: Buffer, s: Buffer): TransactionObject


  /**
   * Validates that an object with BN values cannot exceed the specified bit limit.
   * @param values Object containing string keys and BN values
   * @param bits Number of bits to check (64 or 256)
   * @param cannotEqual Pass true if the number also cannot equal one less the maximum value
   */
  protected _validateCannotExceedMaxInteger(
      values: { [key: string]: BN | undefined },
      bits = 256,
      cannotEqual = false
  ) {
    for (const [key, value] of Object.entries(values)) {
      switch (bits) {
        case 64:
          if (cannotEqual) {
            if (value?.gte(MAX_UINT64)) {
              const msg = this._errorMsg(
                  `${key} cannot equal or exceed MAX_UINT64 (2^64-1), given ${value}`
              )
              throw new Error(msg)
            }
          } else {
            if (value?.gt(MAX_UINT64)) {
              const msg = this._errorMsg(`${key} cannot exceed MAX_UINT64 (2^64-1), given ${value}`)
              throw new Error(msg)
            }
          }
          break
        case 256:
          if (cannotEqual) {
            if (value?.gte(MAX_INTEGER)) {
              const msg = this._errorMsg(
                  `${key} cannot equal or exceed MAX_INTEGER (2^256-1), given ${value}`
              )
              throw new Error(msg)
            }
          } else {
            if (value?.gt(MAX_INTEGER)) {
              const msg = this._errorMsg(
                  `${key} cannot exceed MAX_INTEGER (2^256-1), given ${value}`
              )
              throw new Error(msg)
            }
          }
          break
        default: {
          const msg = this._errorMsg('unimplemented bits value')
          throw new Error(msg)
        }
      }
    }
  }

  /**
   * Returns the shared error postfix part for _error() method
   * tx type implementations.
   */
  protected _getSharedErrorPostfix() {
    let hash = ''
    try {
      hash = this.isSigned() ? bufferToHex(this.hash()) : 'not available (unsigned)'
    } catch (e: any) {
      hash = 'error'
    }
    let isSigned = ''
    try {
      isSigned = this.isSigned().toString()
    } catch (e: any) {
      hash = 'error'
    }

    let postfix = `tx type=${this.type} hash=${hash} nonce=${this.nonce} value=${this.value} `
    postfix += `signed=${isSigned}`

    return postfix
  }

  /**
   * Return a compact error string representation of the object
   */
  public abstract errorStr(): string

  /**
   * Internal helper function to create an annotated error message
   *
   * @param msg Base error message
   * @hidden
   */
  protected abstract _errorMsg(msg: string): string

  /**
   * Accept the v,r,s values from the `sign` method, and convert this into a TransactionObject
   *
   * @param v
   * @param r
   * @param s
   */
  processSignature(v: number, r: Buffer, s: Buffer): TransactionObject {
    return this._processSignature(v, r, s)
  }

  // v - It has already been transformed based on the chainId and txType.
  processSignatureWithRawV(v: number, r: Buffer, s: Buffer): TransactionObject {
    return this._processSignatureWithRawV(v, r, s)
  }
}

