/**
 * The following methods are based on `ethereumjs/tx`, thanks for their work
 * https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/tx
 * Distributed under the Mozilla Public License Version 2.0 software license, see the accompanying
 * file LICENSE or https://opensource.org/license/mpl-2-0/.
 */

import {
    bnToHex,
    bnToUnpaddedBuffer,
    keccak256,
    MAX_INTEGER,
    rlp,
    toBuffer,
    toType,
    TypeOutput,
    validateNoLeadingZeroes,
} from '../ethereumjs-util'

import { BN } from "@okxweb3/crypto-lib"

import { BaseTransaction } from './baseTransaction'
import {
    AccessList,
    AccessListBuffer,
    EOACodeEIP7702TxData,
    JsonTx,
    AuthorizationListBytes,
    AuthorizationList,
    EOACode7702TxValuesArray,
} from './types'
import { AccessLists, AuthorizationLists } from './util'

const TRANSACTION_TYPE = 4
const TRANSACTION_TYPE_BUFFER = Buffer.from(TRANSACTION_TYPE.toString(16).padStart(2, '0'), 'hex')

/**
 * Typed transaction with the ability to set codes on EOA accounts
 *
 * - TransactionType: 4
 * - EIP: [EIP-7702](https://github.com/ethereum/EIPs/blob/62419ca3f45375db00b04a368ea37c0bfb05386a/EIPS/eip-7702.md)
 */
export default class EOACodeEIP7702Transaction extends BaseTransaction<EOACodeEIP7702Transaction> {
    public readonly chainId: BN
    public readonly accessList: AccessListBuffer
    public readonly AccessListJSON: AccessList
    public readonly maxPriorityFeePerGas: BN
    public readonly maxFeePerGas: BN

    // 7702
    public readonly authorizationList: AuthorizationListBytes
    public readonly AuthorizationListJSON: AuthorizationList

    /**
     * Instantiate a transaction from a data dictionary.
     */
    public static fromTxData(txData: EOACodeEIP7702TxData) {
        return new EOACodeEIP7702Transaction(txData)
    }

    /**
     * Instantiate a transaction from the serialized tx.
     *
     * Format: `0x04 || rlp([chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
     * accessList, authorizationList, signatureYParity, signatureR, signatureS])`
     */
    public static fromSerializedTx(serialized: Buffer) {
        if (!serialized.slice(0, 1).equals(TRANSACTION_TYPE_BUFFER)) {
            throw new Error(
                `Invalid serialized tx input: not an EIP-1559 transaction (wrong tx type, expected: ${TRANSACTION_TYPE}, received: ${serialized
                    .slice(0, 1)
                    .toString('hex')}`
            )
        }

        const values = rlp.decode(serialized.slice(1))

        if (!Array.isArray(values)) {
            throw new Error('Invalid serialized tx input: must be array')
        }

        return EOACodeEIP7702Transaction.fromValuesArray(values as any)
    }

    /**
     * Create a transaction from a values array.
     *
     * Format: `[chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
     * accessList, signatureYParity, signatureR, signatureS]`
     */
    public static fromValuesArray(values: EOACode7702TxValuesArray) {
        if (values.length !== 10 && values.length !== 13) {
            throw new Error(
                'Invalid EIP-7702 transaction. Only expecting 10 values (for unsigned tx) or 13 values (for signed tx).'
            )
        }

        const [
            chainId,
            nonce,
            maxPriorityFeePerGas,
            maxFeePerGas,
            gasLimit,
            to,
            value,
            data,
            accessList,
            authorityList,
            v,
            r,
            s,
        ] = values

        validateNoLeadingZeroes({ nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, value, v, r, s })

        return new EOACodeEIP7702Transaction(
            {
                chainId: new BN(chainId),
                nonce,
                maxPriorityFeePerGas,
                maxFeePerGas,
                gasLimit,
                to,
                value,
                data,
                accessList: accessList ?? [],
                authorizationList: authorityList ?? [],
                v: v !== undefined ? new BN(v) : undefined, // EIP2930 supports v's with value 0 (empty Buffer)
                r,
                s,
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
    public constructor(txData: EOACodeEIP7702TxData) {
        super({ ...txData, type: TRANSACTION_TYPE })
        const { chainId, accessList, authorizationList, maxFeePerGas, maxPriorityFeePerGas } = txData

        this.chainId = toType(chainId, TypeOutput.BN)

        this.activeCapabilities = this.activeCapabilities.concat([1559, 2718, 2930, 7702])

        // Populate the access list fields
        const accessListData = AccessLists.getAccessListData(accessList ?? [])
        this.accessList = accessListData.accessList
        this.AccessListJSON = accessListData.AccessListJSON
        // Verify the access list format.
        AccessLists.verifyAccessList(this.accessList)

        this.maxFeePerGas = new BN(toBuffer(maxFeePerGas === '' ? '0x' : maxFeePerGas))
        this.maxPriorityFeePerGas = new BN(
            toBuffer(maxPriorityFeePerGas === '' ? '0x' : maxPriorityFeePerGas)
        )

        this._validateCannotExceedMaxInteger({
            maxFeePerGas: this.maxFeePerGas,
            maxPriorityFeePerGas: this.maxPriorityFeePerGas,
        })

        if (this.gasLimit.mul(this.maxFeePerGas).gt(MAX_INTEGER)) {
            const msg = this._errorMsg('gasLimit * maxFeePerGas cannot exceed MAX_INTEGER (2^256-1)')
            throw new Error(msg)
        }

        if (this.maxFeePerGas.lt(this.maxPriorityFeePerGas)) {
            const msg = this._errorMsg(
                'maxFeePerGas cannot be less than maxPriorityFeePerGas (The total must be the larger of the two)'
            )
            throw new Error(msg)
        }

        if (this.v && !this.v.eqn(0) && !this.v.eqn(1)) {
            const msg = this._errorMsg('The y-parity of the transaction should either be 0 or 1')
            throw new Error(msg)
        }

        // Populate the authority list fields
        const authorizationListData = AuthorizationLists.getAuthorizationListData(
            authorizationList ?? [],
        )
        this.authorizationList = authorizationListData.authorizationList
        this.AuthorizationListJSON = authorizationListData.AuthorizationListJSON
        // Verify the authority list format.
        AuthorizationLists.verifyAuthorizationList(this.authorizationList)
    }


    /**
     * Returns a Buffer/Uint8Array Array of the raw Bytes of the EIP-7702 transaction, in order.
     *
     * Format: `[chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
     * accessList, authorizationList, signatureYParity, signatureR, signatureS]`
     *
     * Use {@link EOACode7702Transaction.serialize} to add a transaction to a block
     * with {@link createBlockFromBytesArray}.
     *
     * For an unsigned tx this method uses the empty Bytes values for the
     * signature parameters `v`, `r` and `s` for encoding. For an EIP-155 compliant
     * representation for external signing use {@link EOACode7702Transaction.getMessageToSign}.
     */
    raw(): EOACode7702TxValuesArray {
        return [
            bnToUnpaddedBuffer(this.chainId),
            bnToUnpaddedBuffer(this.nonce),
            bnToUnpaddedBuffer(this.maxPriorityFeePerGas),
            bnToUnpaddedBuffer(this.maxFeePerGas),
            bnToUnpaddedBuffer(this.gasLimit),
            this.to !== undefined ? this.to.buf : Buffer.from([]),
            bnToUnpaddedBuffer(this.value),
            this.data,
            this.accessList,
            this.authorizationList, // Uint8Array
            this.v !== undefined ? bnToUnpaddedBuffer(this.v) : Buffer.from([]),
            this.r !== undefined ? bnToUnpaddedBuffer(this.r) : Buffer.from([]),
            this.s !== undefined ? bnToUnpaddedBuffer(this.s) : Buffer.from([]),
        ]
    }

    /**
     * Returns the serialized encoding of the EIP-7702 transaction.
     *
     * Format: `0x04 || rlp([chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
     * accessList, authorizationList, signatureYParity, signatureR, signatureS])`
     *
     * Note that in contrast to the legacy tx serialization format this is not
     * valid RLP any more due to the raw tx type preceding and concatenated to
     * the RLP encoding of the values.
     */
    serialize(): Buffer {
        const base = this.raw()
        return Buffer.concat([TRANSACTION_TYPE_BUFFER, rlp.encode(base as any)])
    }

    /**
     * Returns the serialized unsigned tx (hashed or raw), which can be used
     * to sign the transaction (e.g. for sending to a hardware wallet).
     *
     * Note: in contrast to the legacy tx the raw message format is already
     * serialized and doesn't need to be RLP encoded any more.
     *
     * ```javascript
     * const serializedMessage = tx.getMessageToSign(false) // use this for the HW wallet input
     * ```
     *
     * @param hashMessage - Return hashed message if set to true (default: true)
     */
    getMessageToSign(hashMessage = true): Buffer {
        const base = this.raw().slice(0, 10)
        const message = Buffer.concat([TRANSACTION_TYPE_BUFFER, rlp.encode(base as any)])
        if (hashMessage) {
            return keccak256(message)
        } else {
            return message
        }
    }

    /**
     * Computes a sha3-256 hash of the serialized tx.
     *
     * This method can only be used for signed txs (it throws otherwise).
     * Use {@link FeeMarketEIP1559Transaction.getMessageToSign} to get a tx hash for the purpose of signing.
     */
    public hash(): Buffer {
        if (!this.isSigned()) {
            const msg = this._errorMsg('Cannot call hash method if transaction is not signed')
            throw new Error(msg)
        }
        return keccak256(this.serialize())
    }

    _processSignature(v: number, r: Buffer, s: Buffer) {
        return EOACodeEIP7702Transaction.fromTxData(
            {
                chainId: this.chainId,
                nonce: this.nonce,
                maxPriorityFeePerGas: this.maxPriorityFeePerGas,
                maxFeePerGas: this.maxFeePerGas,
                gasLimit: this.gasLimit,
                to: this.to,
                value: this.value,
                data: this.data,
                accessList: this.accessList,
                authorizationList: this.authorizationList,
                v: new BN(v - 27), // This looks extremely hacky: ethereumjs-util actually adds 27 to the value, the recovery bit is either 0 or 1.
                r: new BN(r),
                s: new BN(s),
            }
        )
    }

    _processSignatureWithRawV(v: number, r: Buffer, s: Buffer) {
        return EOACodeEIP7702Transaction.fromTxData(
            {
                chainId: this.chainId,
                nonce: this.nonce,
                maxPriorityFeePerGas: this.maxPriorityFeePerGas,
                maxFeePerGas: this.maxFeePerGas,
                gasLimit: this.gasLimit,
                to: this.to,
                value: this.value,
                data: this.data,
                accessList: this.accessList,
                v: new BN(v), // This looks extremely hacky: ethereumjs-util actually adds 27 to the value, the recovery bit is either 0 or 1.
                r: new BN(r),
                s: new BN(s),
            }
        )
    }

    /**
     * Returns an object with the JSON representation of the transaction
     */
    toJSON(): JsonTx {
        const accessListJSON = AccessLists.getAccessListJSON(this.accessList)

        return {
            chainId: bnToHex(this.chainId),
            nonce: bnToHex(this.nonce),
            maxPriorityFeePerGas: bnToHex(this.maxPriorityFeePerGas),
            maxFeePerGas: bnToHex(this.maxFeePerGas),
            gasLimit: bnToHex(this.gasLimit),
            to: this.to !== undefined ? this.to.toString() : undefined,
            value: bnToHex(this.value),
            data: '0x' + this.data.toString('hex'),
            accessList: accessListJSON,
            authorizationList: this.AuthorizationListJSON,
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
        errorStr += ` maxFeePerGas=${this.maxFeePerGas} maxPriorityFeePerGas=${this.maxPriorityFeePerGas}`
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
