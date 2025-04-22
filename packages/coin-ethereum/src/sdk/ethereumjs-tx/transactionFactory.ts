/**
 * The following methods are based on `ethereumjs/tx`, thanks for their work
 * https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/tx
 * Distributed under the Mozilla Public License Version 2.0 software license, see the accompanying
 * file LICENSE or https://opensource.org/license/mpl-2-0/.
 */

import { toBuffer } from '../ethereumjs-util'
import { BN } from "@okxweb3/crypto-lib"

import {
  TypedTransaction,
  TxData,
  AccessListEIP2930TxData,
  FeeMarketEIP1559TxData,
  EOACodeEIP7702TxData,
} from './types'
import { Transaction, AccessListEIP2930Transaction, FeeMarketEIP1559Transaction, EOACodeEIP7702Transaction } from '.'

export default class TransactionFactory {
  /**
   * Create a transaction from a `txData` object
   *
   * @param txData - The transaction data. The `type` field will determine which transaction type is returned (if undefined, creates a legacy transaction)
   * @param txOptions - Options to pass on to the constructor of the transaction
   */
  public static fromTxData(txData: TxData | AccessListEIP2930TxData | FeeMarketEIP1559TxData): TypedTransaction {
    if (!('type' in txData) || txData.type === undefined) {
      // Assume legacy transaction
      return Transaction.fromTxData(<TxData>txData)
    } else {
      const txType = new BN(toBuffer(txData.type)).toNumber()
      if (txType === 0) {
        return Transaction.fromTxData(<TxData>txData)
      } else if (txType === 1) {
        return AccessListEIP2930Transaction.fromTxData(<AccessListEIP2930TxData>txData)
      } else if (txType === 2) {
        return FeeMarketEIP1559Transaction.fromTxData(<FeeMarketEIP1559TxData>txData)
      } else if (txType === 4) {
        return EOACodeEIP7702Transaction.fromTxData(<EOACodeEIP7702TxData>txData)
      } else {
        throw new Error(`Tx instantiation with type ${txType} not supported`)
      }
    }
  }

  /**
   * This method tries to decode serialized data.
   *
   * @param data - The data Buffer
   * @param chainId
   */
  public static fromSerializedData(data: Buffer, chainId?: number): TypedTransaction {
    if (data[0] <= 0x7f) {
      // Determine the type.
      let EIP: number
      switch (data[0]) {
        case 1:
          EIP = 2930
          break
        case 2:
          EIP = 1559
          break
        case 4:
          EIP = 7702
          break
        default:
          throw new Error(`TypedTransaction with ID ${data[0]} unknown`)
      }
      if (EIP === 1559) {
        return FeeMarketEIP1559Transaction.fromSerializedTx(data)
      } else if (EIP === 7702) {
        return EOACodeEIP7702Transaction.fromSerializedTx(data)
      } else {
        // EIP === 2930
        return AccessListEIP2930Transaction.fromSerializedTx(data)
      }
    } else {
      return Transaction.fromSerializedTx(data, chainId)
    }
  }
}
