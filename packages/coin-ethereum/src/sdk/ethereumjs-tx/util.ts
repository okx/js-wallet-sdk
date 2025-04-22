/**
 * The following methods are based on `ethereumjs/tx`, thanks for their work
 * https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/tx
 * Distributed under the Mozilla Public License Version 2.0 software license, see the accompanying
 * file LICENSE or https://opensource.org/license/mpl-2-0/.
 */

import { bufferToHex, setLengthLeft, toBuffer, hexToBytes, bytesToHex, validateNoLeadingZeroes, bytesToBigInt, MAX_INTEGER_BI as MAX_INTEGER, MAX_UINT64_BI as MAX_UINT64 } from '../ethereumjs-util'
import { AccessList, AccessListBuffer, AccessListItem, isAccessList, AuthorizationListBytes, AuthorizationList, AuthorizationListItem, isAuthorizationList } from './types'


export class AccessLists {
  public static getAccessListData(accessList: AccessListBuffer | AccessList) {
    let AccessListJSON
    let bufferAccessList
    if (accessList && isAccessList(accessList)) {
      AccessListJSON = accessList
      const newAccessList: AccessListBuffer = []

      for (let i = 0; i < accessList.length; i++) {
        const item: AccessListItem = accessList[i]
        const addressBuffer = toBuffer(item.address)
        const storageItems: Buffer[] = []
        for (let index = 0; index < item.storageKeys.length; index++) {
          storageItems.push(toBuffer(item.storageKeys[index]))
        }
        newAccessList.push([addressBuffer, storageItems])
      }
      bufferAccessList = newAccessList
    } else {
      bufferAccessList = accessList ?? []
      // build the JSON
      const json: AccessList = []
      for (let i = 0; i < bufferAccessList.length; i++) {
        const data = bufferAccessList[i]
        const address = bufferToHex(data[0])
        const storageKeys: string[] = []
        for (let item = 0; item < data[1].length; item++) {
          storageKeys.push(bufferToHex(data[1][item]))
        }
        const jsonItem: AccessListItem = {
          address,
          storageKeys,
        }
        json.push(jsonItem)
      }
      AccessListJSON = json
    }

    return {
      AccessListJSON,
      accessList: bufferAccessList,
    }
  }

  public static verifyAccessList(accessList: AccessListBuffer) {
    for (let key = 0; key < accessList.length; key++) {
      const accessListItem = accessList[key]
      const address = <Buffer>accessListItem[0]
      const storageSlots = <Buffer[]>accessListItem[1]
      if ((<any>accessListItem)[2] !== undefined) {
        throw new Error(
          'Access list item cannot have 3 elements. It can only have an address, and an array of storage slots.'
        )
      }
      if (address.length != 20) {
        throw new Error('Invalid EIP-2930 transaction: address length should be 20 bytes')
      }
      for (let storageSlot = 0; storageSlot < storageSlots.length; storageSlot++) {
        if (storageSlots[storageSlot].length != 32) {
          throw new Error('Invalid EIP-2930 transaction: storage slot length should be 32 bytes')
        }
      }
    }
  }

  public static getAccessListJSON(accessList: AccessListBuffer) {
    const accessListJSON = []
    for (let index = 0; index < accessList.length; index++) {
      const item: any = accessList[index]
      const JSONItem: any = {
        address: '0x' + setLengthLeft(<Buffer>item[0], 20).toString('hex'),
        storageKeys: [],
      }
      const storageSlots: Buffer[] = item[1]
      for (let slot = 0; slot < storageSlots.length; slot++) {
        const storageSlot = storageSlots[slot]
        JSONItem.storageKeys.push('0x' + setLengthLeft(storageSlot, 32).toString('hex'))
      }
      accessListJSON.push(JSONItem)
    }
    return accessListJSON
  }
}

export class AuthorizationLists {
  public static getAuthorizationListData(
      authorizationList: AuthorizationListBytes | AuthorizationList,
  ) {
    let AuthorizationListJSON
    let bufferAuthorizationList
    if (isAuthorizationList(authorizationList)) {
      AuthorizationListJSON = authorizationList
      const newAuthorizationList: AuthorizationListBytes = []
      const jsonItems = ['chainId', 'address', 'nonce', 'yParity', 'r', 's']
      for (let i = 0; i < authorizationList.length; i++) {
        const item: AuthorizationListItem = authorizationList[i]
        for (const key of jsonItems) {
          if (item[key as keyof typeof item] === undefined) {
            throw new Error(`EIP-7702 authorization list invalid: ${key} is not defined`)
          }
        }
        const chainId = hexToBytes(item.chainId)
        const addressBytes = hexToBytes(item.address)
        const nonce = hexToBytes(item.nonce)
        const yParity = hexToBytes(item.yParity)
        const r = hexToBytes(item.r)
        const s = hexToBytes(item.s)

        newAuthorizationList.push([chainId, addressBytes, nonce, yParity, r, s])
      }
      bufferAuthorizationList = newAuthorizationList
    } else {
      bufferAuthorizationList = authorizationList ?? []
      // build the JSON
      const json: AuthorizationList = []
      for (let i = 0; i < bufferAuthorizationList.length; i++) {
        const data = bufferAuthorizationList[i]
        const chainId = bytesToHex(data[0])
        const address = bytesToHex(data[1])
        const nonce = bytesToHex(data[2])
        const yParity = bytesToHex(data[3])
        const r = bytesToHex(data[4])
        const s = bytesToHex(data[5])
        const jsonItem: AuthorizationListItem = {
          chainId,
          address,
          nonce,
          yParity,
          r,
          s,
        }
        json.push(jsonItem)
      }
      AuthorizationListJSON = json
    }

    return {
      AuthorizationListJSON,
      authorizationList: bufferAuthorizationList,
    }
  }

  public static verifyAuthorizationList(authorizationList: AuthorizationListBytes) {
    if (authorizationList.length === 0) {
      throw new Error('Invalid EIP-7702 transaction: authorization list is empty')
    }
    for (let key = 0; key < authorizationList.length; key++) {
      const authorizationListItem = authorizationList[key]
      const chainId = authorizationListItem[0]
      const address = authorizationListItem[1]
      const nonce = authorizationListItem[2]
      const yParity = authorizationListItem[3]
      const r = authorizationListItem[4]
      const s = authorizationListItem[5]
      validateNoLeadingZeroes({ yParity, r, s, nonce, chainId })
      if (address.length !== 20) {
        throw new Error('Invalid EIP-7702 transaction: address length should be 20 bytes')
      }
      if (bytesToBigInt(chainId) > MAX_INTEGER) {
        throw new Error('Invalid EIP-7702 transaction: chainId exceeds 2^256 - 1')
      }
      if (bytesToBigInt(nonce) > MAX_UINT64) {
        throw new Error('Invalid EIP-7702 transaction: nonce exceeds 2^64 - 1')
      }
      const yParityBigInt = bytesToBigInt(yParity)
      if (yParityBigInt >= BigInt(2 ** 8)) {
        throw new Error(
            'Invalid EIP-7702 transaction: yParity should be fit within 1 byte (0 - 255)',
        )
      }
      if (bytesToBigInt(r) > MAX_INTEGER) {
        throw new Error('Invalid EIP-7702 transaction: r exceeds 2^256 - 1')
      }
      if (bytesToBigInt(s) > MAX_INTEGER) {
        throw new Error('Invalid EIP-7702 transaction: s exceeds 2^256 - 1')
      }
    }
  }
}