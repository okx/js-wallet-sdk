import xdr from './xdr';
import { hash } from './hashing';

import { StrKey } from './strkey';
import { Operation } from './operation';
import { Memo } from './memo';
import { TransactionBase } from './transaction_base';
import {
  extractBaseAddress,
  encodeMuxedAccountToAddress
} from './util/decode_encode_muxed_account';

/**
 * Use {@link TransactionBuilder} to build a transaction object. If you have an
 * object or base64-encoded string of the transaction envelope XDR, use {@link
 * TransactionBuilder.fromXDR}.
 *
 * Once a Transaction has been created, its attributes and operations should not
 * be changed. You should only add signatures (using {@link Transaction#sign})
 * to a Transaction object before submitting to the network or forwarding on to
 * additional signers.
 *
 * @constructor
 *
 * @param {string|xdr.TransactionEnvelope} envelope - transaction envelope
 *     object or base64 encoded string
 * @param {string}  [networkPassphrase] - passphrase of the target stellar
 *     network (e.g. "Public Global Stellar Network ; September 2015")
 *
 * @extends TransactionBase
 */
export class Transaction extends TransactionBase {
  constructor(envelope, networkPassphrase) {
    if (typeof envelope === 'string') {
      const buffer = Buffer.from(envelope, 'base64');
      envelope = xdr.TransactionEnvelope.fromXDR(buffer);
    }

    const envelopeType = envelope.switch();
    if (
      !(
        envelopeType === xdr.EnvelopeType.envelopeTypeTxV0() ||
        envelopeType === xdr.EnvelopeType.envelopeTypeTx()
      )
    ) {
      throw new Error(
        `Invalid TransactionEnvelope: expected an envelopeTypeTxV0 or envelopeTypeTx but received an ${envelopeType.name}.`
      );
    }

    const txEnvelope = envelope.value();
    const tx = txEnvelope.tx();
    const fee = tx.fee().toString();
    const signatures = (txEnvelope.signatures() || []).slice();

    super(tx, signatures, fee, networkPassphrase);

    this._envelopeType = envelopeType;
    this._memo = tx.memo();
    this._sequence = tx.seqNum().toString();

    switch (this._envelopeType) {
      case xdr.EnvelopeType.envelopeTypeTxV0():
        this._source = StrKey.encodeEd25519PublicKey(
          this.tx.sourceAccountEd25519()
        );
        break;
      default:
        this._source = encodeMuxedAccountToAddress(this.tx.sourceAccount());
        break;
    }

    let cond = null;
    let timeBounds = null;
    switch (this._envelopeType) {
      case xdr.EnvelopeType.envelopeTypeTxV0():
        timeBounds = tx.timeBounds();
        break;

      case xdr.EnvelopeType.envelopeTypeTx():
        switch (tx.cond().switch()) {
          case xdr.PreconditionType.precondTime():
            timeBounds = tx.cond().timeBounds();
            break;

          case xdr.PreconditionType.precondV2():
            cond = tx.cond().v2();
            timeBounds = cond.timeBounds();
            break;

          default:
            break;
        }
        break;

      default:
        break;
    }

    if (timeBounds) {
      this._timeBounds = {
        minTime: timeBounds.minTime().toString(),
        maxTime: timeBounds.maxTime().toString()
      };
    }

    if (cond) {
      const ledgerBounds = cond.ledgerBounds();
      if (ledgerBounds) {
        this._ledgerBounds = {
          minLedger: ledgerBounds.minLedger(),
          maxLedger: ledgerBounds.maxLedger()
        };
      }

      const minSeq = cond.minSeqNum();
      if (minSeq) {
        this._minAccountSequence = minSeq.toString();
      }

      this._minAccountSequenceAge = cond.minSeqAge();
      this._minAccountSequenceLedgerGap = cond.minSeqLedgerGap();
      this._extraSigners = cond.extraSigners();
    }

    const operations = tx.operations() || [];
    this._operations = operations.map((op) => Operation.fromXDRObject(op));
  }

  /**
   * @type {object}
   * @property {string} 64 bit unix timestamp
   * @property {string} 64 bit unix timestamp
   * @readonly
   */
  get timeBounds() {
    return this._timeBounds;
  }
  set timeBounds(value) {
    throw new Error('Transaction is immutable');
  }

  /**
   * @type {object}
   * @property {number} minLedger - smallest ledger bound (uint32)
   * @property {number} maxLedger - largest ledger bound (or 0 for inf)
   * @readonly
   */
  get ledgerBounds() {
    return this._ledgerBounds;
  }
  set ledgerBounds(value) {
    throw new Error('Transaction is immutable');
  }

  /**
   * 64 bit account sequence
   * @readonly
   * @type {string}
   */
  get minAccountSequence() {
    return this._minAccountSequence;
  }
  set minAccountSequence(value) {
    throw new Error('Transaction is immutable');
  }

  /**
   * 64 bit number of seconds
   * @type {number}
   * @readonly
   */
  get minAccountSequenceAge() {
    return this._minAccountSequenceAge;
  }
  set minAccountSequenceAge(value) {
    throw new Error('Transaction is immutable');
  }

  /**
   * 32 bit number of ledgers
   * @type {number}
   * @readonly
   */
  get minAccountSequenceLedgerGap() {
    return this._minAccountSequenceLedgerGap;
  }
  set minAccountSequenceLedgerGap(value) {
    throw new Error('Transaction is immutable');
  }

  /**
   * array of extra signers ({@link StrKey}s)
   * @type {string[]}
   * @readonly
   */
  get extraSigners() {
    return this._extraSigners;
  }
  set extraSigners(value) {
    throw new Error('Transaction is immutable');
  }

  /**
   * @type {string}
   * @readonly
   */
  get sequence() {
    return this._sequence;
  }
  set sequence(value) {
    throw new Error('Transaction is immutable');
  }

  /**
   * @type {string}
   * @readonly
   */
  get source() {
    return this._source;
  }
  set source(value) {
    throw new Error('Transaction is immutable');
  }

  /**
   * @type {Array.<xdr.Operation>}
   * @readonly
   */
  get operations() {
    return this._operations;
  }
  set operations(value) {
    throw new Error('Transaction is immutable');
  }

  /**
   * @type {string}
   * @readonly
   */
  get memo() {
    return Memo.fromXDRObject(this._memo);
  }
  set memo(value) {
    throw new Error('Transaction is immutable');
  }

  /**
   * Returns the "signature base" of this transaction, which is the value
   * that, when hashed, should be signed to create a signature that
   * validators on the Stellar Network will accept.
   *
   * It is composed of a 4 prefix bytes followed by the xdr-encoded form
   * of this transaction.
   * @returns {Buffer}
   */
  signatureBase() {
    let tx = this.tx;

    // Backwards Compatibility: Use ENVELOPE_TYPE_TX to sign ENVELOPE_TYPE_TX_V0
    // we need a Transaction to generate the signature base
    if (this._envelopeType === xdr.EnvelopeType.envelopeTypeTxV0()) {
      tx = xdr.Transaction.fromXDR(
        Buffer.concat([
          // TransactionV0 is a transaction with the AccountID discriminant
          // stripped off, we need to put it back to build a valid transaction
          // which we can use to build a TransactionSignaturePayloadTaggedTransaction
          xdr.PublicKeyType.publicKeyTypeEd25519().toXDR(),
          tx.toXDR()
        ])
      );
    }

    const taggedTransaction =
      new xdr.TransactionSignaturePayloadTaggedTransaction.envelopeTypeTx(tx);

    const txSignature = new xdr.TransactionSignaturePayload({
      networkId: xdr.Hash.fromXDR(hash(this.networkPassphrase)),
      taggedTransaction
    });

    return txSignature.toXDR();
  }

  /**
   * To envelope returns a xdr.TransactionEnvelope which can be submitted to the network.
   * @returns {xdr.TransactionEnvelope}
   */
  toEnvelope() {
    const rawTx = this.tx.toXDR();
    const signatures = this.signatures.slice(); // make a copy of the signatures

    let envelope;
    switch (this._envelopeType) {
      case xdr.EnvelopeType.envelopeTypeTxV0():
        envelope = new xdr.TransactionEnvelope.envelopeTypeTxV0(
          new xdr.TransactionV0Envelope({
            tx: xdr.TransactionV0.fromXDR(rawTx), // make a copy of tx
            signatures
          })
        );
        break;
      case xdr.EnvelopeType.envelopeTypeTx():
        envelope = new xdr.TransactionEnvelope.envelopeTypeTx(
          new xdr.TransactionV1Envelope({
            tx: xdr.Transaction.fromXDR(rawTx), // make a copy of tx
            signatures
          })
        );
        break;
      default:
        throw new Error(
          `Invalid TransactionEnvelope: expected an envelopeTypeTxV0 or envelopeTypeTx but received an ${this._envelopeType.name}.`
        );
    }

    return envelope;
  }

  /**
   * Calculate the claimable balance ID for an operation within the transaction.
   *
   * @param   {integer}  opIndex   the index of the CreateClaimableBalance op
   * @returns {string}   a hex string representing the claimable balance ID
   *
   * @throws {RangeError}   for invalid `opIndex` value
   * @throws {TypeError}    if op at `opIndex` is not `CreateClaimableBalance`
   * @throws for general XDR un/marshalling failures
   *
   * @see https://github.com/stellar/go/blob/d712346e61e288d450b0c08038c158f8848cc3e4/txnbuild/transaction.go#L392-L435
   *
   */
  getClaimableBalanceId(opIndex) {
    // Validate and then extract the operation from the transaction.
    if (
      !Number.isInteger(opIndex) ||
      opIndex < 0 ||
      opIndex >= this.operations.length
    ) {
      throw new RangeError('invalid operation index');
    }

    let op = this.operations[opIndex];
    try {
      op = Operation.createClaimableBalance(op);
    } catch (err) {
      throw new TypeError(
        `expected createClaimableBalance, got ${op.type}: ${err}`
      );
    }

    // Always use the transaction's *unmuxed* source.
    const account = StrKey.decodeEd25519PublicKey(
      extractBaseAddress(this.source)
    );
    const operationId = xdr.HashIdPreimage.envelopeTypeOpId(
      new xdr.HashIdPreimageOperationId({
        sourceAccount: xdr.AccountId.publicKeyTypeEd25519(account),
        seqNum: xdr.SequenceNumber.fromString(this.sequence),
        opNum: opIndex
      })
    );

    const opIdHash = hash(operationId.toXDR('raw'));
    const balanceId = xdr.ClaimableBalanceId.claimableBalanceIdTypeV0(opIdHash);
    return balanceId.toXDR('hex');
  }
}
