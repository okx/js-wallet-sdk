/**
 * The following methods are based on `ethereumjs/tx`, thanks for their work
 * https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/tx
 * Distributed under the Mozilla Public License Version 2.0 software license, see the accompanying
 * file LICENSE or https://opensource.org/license/mpl-2-0/.
 */

import { AddressLike, BNLike, BufferLike, PrefixedHexString } from '../ethereumjs-util'
import { default as Transaction } from './legacyTransaction'
import { default as AccessListEIP2930Transaction } from './eip2930Transaction'
import { default as FeeMarketEIP1559Transaction } from './eip1559Transaction'


/*
 * Access List types
 */

export type AccessListItem = {
  address: PrefixedHexString
  storageKeys: PrefixedHexString[]
}

/*
 * An Access List as a tuple of [address: Buffer, storageKeys: Buffer[]]
 */
export type AccessListBufferItem = [Buffer, Buffer[]]
export type AccessListBuffer = AccessListBufferItem[]
export type AccessList = AccessListItem[]

export function isAccessListBuffer(
  input: AccessListBuffer | AccessList
): input is AccessListBuffer {
  if (input.length === 0) {
    return true
  }
  const firstItem = input[0]
  if (Array.isArray(firstItem)) {
    return true
  }
  return false
}

export function isAccessList(input: AccessListBuffer | AccessList): input is AccessList {
  return !isAccessListBuffer(input) // This is exactly the same method, except the output is negated.
}

/**
 * Encompassing type for all transaction types.
 *
 * Note that this also includes legacy txs which are
 * referenced as {@link Transaction} for compatibility reasons.
 */
export type TypedTransaction =
  | Transaction
  | AccessListEIP2930Transaction
  | FeeMarketEIP1559Transaction

/**
 * Legacy {@link Transaction} Data
 */
export type TxData = {
  /**
   * The transaction's nonce.
   */
  nonce?: BNLike

  /**
   * The transaction's gas price.
   */
  gasPrice?: BNLike

  /**
   * The transaction's gas limit.
   */
  gasLimit?: BNLike

  /**
   * The transaction's the address is sent to.
   */
  to?: AddressLike

  /**
   * The amount of Ether sent.
   */
  value?: BNLike

  /**
   * This will contain the data of the message or the init of a contract.
   */
  data?: BufferLike

  /**
   * EC recovery ID.
   */
  v?: BNLike

  /**
   * EC signature parameter.
   */
  r?: BNLike

  /**
   * EC signature parameter.
   */
  s?: BNLike

  /**
   * The transaction type
   */

  type?: BNLike

  /**
   * The transaction's chain ID
   */
  chainId?: BNLike
}

/**
 * {@link AccessListEIP2930Transaction} data.
 */
export interface AccessListEIP2930TxData extends TxData {
  /**
   * The transaction's chain ID
   */
  chainId?: BNLike

  /**
   * The access list which contains the addresses/storage slots which the transaction wishes to access
   */
  accessList?: AccessListBuffer | AccessList
}

/**
 * {@link FeeMarketEIP1559Transaction} data.
 */
export interface FeeMarketEIP1559TxData extends AccessListEIP2930TxData {
  /**
   * The transaction's gas price, inherited from {@link Transaction}.  This property is not used for EIP1559
   * transactions and should always be undefined for this specific transaction type.
   */
  gasPrice?: never
  /**
   * The maximum inclusion fee per gas (this fee is given to the miner)
   */
  maxPriorityFeePerGas?: BNLike
  /**
   * The maximum total fee
   */
  maxFeePerGas?: BNLike
}

/**
 * Buffer values array for a legacy {@link Transaction}
 */
export type TxValuesArray = Buffer[]

/**
 * Buffer values array for an {@link AccessListEIP2930Transaction}
 */
export type AccessListEIP2930ValuesArray = [
  Buffer,
  Buffer,
  Buffer,
  Buffer,
  Buffer,
  Buffer,
  Buffer,
  AccessListBuffer,
  Buffer?,
  Buffer?,
  Buffer?
]

/**
 * Buffer values array for a {@link FeeMarketEIP1559Transaction}
 */
export type FeeMarketEIP1559ValuesArray = [
  Buffer,
  Buffer,
  Buffer,
  Buffer,
  Buffer,
  Buffer,
  Buffer,
  Buffer,
  AccessListBuffer,
  Buffer?,
  Buffer?,
  Buffer?
]

type JsonAccessListItem = { address: string; storageKeys: string[] }

/**
 * Generic interface for all tx types with a
 * JSON representation of a transaction.
 *
 * Note that all values are marked as optional
 * and not all the values are present on all tx types
 * (an EIP1559 tx e.g. lacks a `gasPrice`).
 */
export interface JsonTx {
  nonce?: string
  gasPrice?: string
  gasLimit?: string
  to?: string
  data?: string
  v?: string
  r?: string
  s?: string
  value?: string
  chainId?: string
  accessList?: JsonAccessListItem[]
  type?: string
  maxPriorityFeePerGas?: string
  maxFeePerGas?: string
}