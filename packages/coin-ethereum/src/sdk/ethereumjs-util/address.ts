/**
 * The following methods are based on `ethereumjs/util`, thanks for their work
 * https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/util
 * Distributed under the Mozilla Public License Version 2.0 software license, see the accompanying
 * file LICENSE or https://opensource.org/license/mpl-2-0/.
 */

const assert = require('assert')
import {BN} from '@okxweb3/crypto-lib'
import { toBuffer, zeros } from './bytes'
import {
  isValidAddress,
  pubToAddress,
  privateToAddress
} from './account'

export class Address {
  public readonly buf: Buffer

  constructor(buf: Buffer) {
    assert(buf.length === 20, 'Invalid address length')
    this.buf = buf
  }

  /**
   * Returns the zero address.
   */
  static zero(): Address {
    return new Address(zeros(20))
  }

  /**
   * Returns an Address object from a hex-encoded string.
   * @param str - Hex-encoded address
   */
  static fromString(str: string): Address {
    assert(isValidAddress(str), 'Invalid address')
    return new Address(toBuffer(str))
  }

  /**
   * Returns an address for a given public key.
   * @param pubKey The two points of an uncompressed key
   */
  static fromPublicKey(pubKey: Buffer): Address {
    assert(Buffer.isBuffer(pubKey), 'Public key should be Buffer')
    const buf = pubToAddress(pubKey)
    return new Address(buf)
  }

  /**
   * Returns an address for a given private key.
   * @param privateKey A private key must be 256 bits wide
   */
  static fromPrivateKey(privateKey: Buffer): Address {
    assert(Buffer.isBuffer(privateKey), 'Private key should be Buffer')
    const buf = privateToAddress(privateKey)
    return new Address(buf)
  }

  /**
   * Is address equal to another.
   */
  equals(address: Address): boolean {
    return this.buf.equals(address.buf)
  }

  /**
   * Is address zero.
   */
  isZero(): boolean {
    return this.equals(Address.zero())
  }

  /**
   * Returns hex encoding of address.
   */
  toString(): string {
    return '0x' + this.buf.toString('hex')
  }

  /**
   * Returns Buffer representation of address.
   */
  toBuffer(): Buffer {
    return Buffer.from(this.buf)
  }
}
