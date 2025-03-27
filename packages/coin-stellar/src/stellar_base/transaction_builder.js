import { UnsignedHyper } from '@stellar/js-xdr';
import BigNumber from './util/bignumber';

import xdr from './xdr';

import { Account } from './account';
import { MuxedAccount } from './muxed_account';
import { decodeAddressToMuxedAccount } from './util/decode_encode_muxed_account';

import { Transaction } from './transaction';
import { FeeBumpTransaction } from './fee_bump_transaction';
import { SorobanDataBuilder } from './sorobandata_builder';

import { StrKey } from './strkey';
import { SignerKey } from './signerkey';
import { Memo } from './memo';

/**
 * Minimum base fee for transactions. If this fee is below the network
 * minimum, the transaction will fail. The more operations in the
 * transaction, the greater the required fee. Use {@link
 * Server#fetchBaseFee} to get an accurate value of minimum transaction
 * fee on the network.
 *
 * @constant
 * @see [Fees](https://developers.stellar.org/docs/glossary/fees/)
 */
export const BASE_FEE = '100'; // Stroops

/**
 * @constant
 * @see {@link TransactionBuilder#setTimeout}
 * @see [Timeout](https://developers.stellar.org/api/resources/transactions/post/)
 */
export const TimeoutInfinite = 0;

/**
 * <p>Transaction builder helps constructs a new `{@link Transaction}` using the
 * given {@link Account} as the transaction's "source account". The transaction
 * will use the current sequence number of the given account as its sequence
 * number and increment the given account's sequence number by one. The given
 * source account must include a private key for signing the transaction or an
 * error will be thrown.</p>
 *
 * <p>Operations can be added to the transaction via their corresponding builder
 * methods, and each returns the TransactionBuilder object so they can be
 * chained together. After adding the desired operations, call the `build()`
 * method on the `TransactionBuilder` to return a fully constructed `{@link
 * Transaction}` that can be signed. The returned transaction will contain the
 * sequence number of the source account and include the signature from the
 * source account.</p>
 *
 * <p><strong>Be careful about unsubmitted transactions!</strong> When you build
 * a transaction, `stellar-sdk` automatically increments the source account's
 * sequence number. If you end up not submitting this transaction and submitting
 * another one instead, it'll fail due to the sequence number being wrong. So if
 * you decide not to use a built transaction, make sure to update the source
 * account's sequence number with
 * [Server.loadAccount](https://stellar.github.io/js-stellar-sdk/Server.html#loadAccount)
 * before creating another transaction.</p>
 *
 * <p>The following code example creates a new transaction with {@link
 * Operation.createAccount} and {@link Operation.payment} operations. The
 * Transaction's source account first funds `destinationA`, then sends a payment
 * to `destinationB`. The built transaction is then signed by
 * `sourceKeypair`.</p>
 *
 * ```
 * var transaction = new TransactionBuilder(source, { fee, networkPassphrase: Networks.TESTNET })
 * .addOperation(Operation.createAccount({
 *     destination: destinationA,
 *     startingBalance: "20"
 * })) // <- funds and creates destinationA
 * .addOperation(Operation.payment({
 *     destination: destinationB,
 *     amount: "100",
 *     asset: Asset.native()
 * })) // <- sends 100 XLM to destinationB
 * .setTimeout(30)
 * .build();
 *
 * transaction.sign(sourceKeypair);
 * ```
 *
 * @constructor
 *
 * @param {Account} sourceAccount - source account for this transaction
 * @param {object}  opts          - Options object
 * @param {string}  opts.fee      - max fee you're willing to pay per
 *     operation in this transaction (**in stroops**)
 *
 * @param {object}              [opts.timebounds] - timebounds for the
 *     validity of this transaction
 * @param {number|string|Date}  [opts.timebounds.minTime] - 64-bit UNIX
 *     timestamp or Date object
 * @param {number|string|Date}  [opts.timebounds.maxTime] - 64-bit UNIX
 *     timestamp or Date object
 * @param {object}              [opts.ledgerbounds] - ledger bounds for the
 *     validity of this transaction
 * @param {number}              [opts.ledgerbounds.minLedger] - number of the minimum
 *     ledger sequence
 * @param {number}              [opts.ledgerbounds.maxLedger] - number of the maximum
 *     ledger sequence
 * @param {string}              [opts.minAccountSequence] - number for
 *     the minimum account sequence
 * @param {number}              [opts.minAccountSequenceAge] - number of
 *     seconds for the minimum account sequence age
 * @param {number}              [opts.minAccountSequenceLedgerGap] - number of
 *     ledgers for the minimum account sequence ledger gap
 * @param {string[]}            [opts.extraSigners] - list of the extra signers
 *     required for this transaction
 * @param {Memo}                [opts.memo] - memo for the transaction
 * @param {string}              [opts.networkPassphrase] passphrase of the
 *     target Stellar network (e.g. "Public Global Stellar Network ; September
 *     2015" for the pubnet)
 * @param {xdr.SorobanTransactionData | string}  [opts.sorobanData] - an
 *     optional instance of {@link xdr.SorobanTransactionData} to be set as the
 *     internal `Transaction.Ext.SorobanData` field (either the xdr object or a
 *     base64 string). In the case of Soroban transactions, this can be obtained
 *     from a prior simulation of the transaction with a contract invocation and
 *     provides necessary resource estimations. You can also use
 *     {@link SorobanDataBuilder} to construct complicated combinations of
 *     parameters without mucking with XDR directly. **Note:** For
 *     non-contract(non-Soroban) transactions, this has no effect.
 */
export class TransactionBuilder {
  constructor(sourceAccount, opts = {}) {
    if (!sourceAccount) {
      throw new Error('must specify source account for the transaction');
    }

    if (opts.fee === undefined) {
      throw new Error('must specify fee for the transaction (in stroops)');
    }

    this.source = sourceAccount;
    this.operations = [];

    this.baseFee = opts.fee;
    this.timebounds = opts.timebounds ? { ...opts.timebounds } : null;
    this.ledgerbounds = opts.ledgerbounds ? { ...opts.ledgerbounds } : null;
    this.minAccountSequence = opts.minAccountSequence || null;
    this.minAccountSequenceAge = opts.minAccountSequenceAge || null;
    this.minAccountSequenceLedgerGap = opts.minAccountSequenceLedgerGap || null;
    this.extraSigners = opts.extraSigners ? [...opts.extraSigners] : null;
    this.memo = opts.memo || Memo.none();
    this.networkPassphrase = opts.networkPassphrase || null;

    this.sorobanData = opts.sorobanData
      ? new SorobanDataBuilder(opts.sorobanData).build()
      : null;
  }

  /**
   * Creates a builder instance using an existing {@link Transaction} as a
   * template, ignoring any existing envelope signatures.
   *
   * Note that the sequence number WILL be cloned, so EITHER this transaction or
   * the one it was cloned from will be valid. This is useful in situations
   * where you are constructing a transaction in pieces and need to make
   * adjustments as you go (for example, when filling out Soroban resource
   * information).
   *
   * @param {Transaction} tx  a "template" transaction to clone exactly
   * @param {object} [opts]   additional options to override the clone, e.g.
   *    {fee: '1000'} will override the existing base fee derived from `tx` (see
   *    the {@link TransactionBuilder} constructor for detailed options)
   *
   * @returns {TransactionBuilder} a "prepared" builder instance with the same
   *    configuration and operations as the given transaction
   *
   * @warning This does not clone the transaction's
   *    {@link xdr.SorobanTransactionData} (if applicable), use
   *    {@link SorobanDataBuilder} and {@link TransactionBuilder.setSorobanData}
   *    as needed, instead..
   *
   * @todo This cannot clone {@link FeeBumpTransaction}s, yet.
   */
  static cloneFrom(tx, opts = {}) {
    if (!(tx instanceof Transaction)) {
      throw new TypeError(`expected a 'Transaction', got: ${tx}`);
    }

    const sequenceNum = (BigInt(tx.sequence) - 1n).toString();

    let source;
    // rebuild the source account based on the strkey
    if (StrKey.isValidMed25519PublicKey(tx.source)) {
      source = MuxedAccount.fromAddress(tx.source, sequenceNum);
    } else if (StrKey.isValidEd25519PublicKey(tx.source)) {
      source = new Account(tx.source, sequenceNum);
    } else {
      throw new TypeError(`unsupported tx source account: ${tx.source}`);
    }

    // the initial fee passed to the builder gets scaled up based on the number
    // of operations at the end, so we have to down-scale first
    const unscaledFee = parseInt(tx.fee, 10) / tx.operations.length;

    const builder = new TransactionBuilder(source, {
      fee: (unscaledFee || BASE_FEE).toString(),
      memo: tx.memo,
      networkPassphrase: tx.networkPassphrase,
      timebounds: tx.timeBounds,
      ledgerbounds: tx.ledgerBounds,
      minAccountSequence: tx.minAccountSequence,
      minAccountSequenceAge: tx.minAccountSequenceAge,
      minAccountSequenceLedgerGap: tx.minAccountSequenceLedgerGap,
      extraSigners: tx.extraSigners,
      ...opts
    });

    tx._tx.operations().forEach((op) => builder.addOperation(op));

    return builder;
  }

  /**
   * Adds an operation to the transaction.
   *
   * @param {xdr.Operation} operation   The xdr operation object, use {@link
   *     Operation} static methods.
   *
   * @returns {TransactionBuilder}
   */
  addOperation(operation) {
    this.operations.push(operation);
    return this;
  }

  /**
   * Adds an operation to the transaction at a specific index.
   *
   * @param {xdr.Operation} operation - The xdr operation object to add, use {@link Operation} static methods.
   * @param {number} index - The index at which to insert the operation.
   *
   * @returns {TransactionBuilder} - The TransactionBuilder instance for method chaining.
   */
  addOperationAt(operation, index) {
    this.operations.splice(index, 0, operation);
    return this;
  }

  /**
   * Removes the operations from the builder (useful when cloning).
   * @returns {TransactionBuilder} this builder instance
   */
  clearOperations() {
    this.operations = [];
    return this;
  }

  /**
   * Removes the operation at the specified index from the transaction.
   *
   * @param {number} index - The index of the operation to remove.
   *
   * @returns {TransactionBuilder} The TransactionBuilder instance for method chaining.
   */
  clearOperationAt(index) {
    this.operations.splice(index, 1);
    return this;
  }

  /**
   * Adds a memo to the transaction.
   * @param {Memo} memo {@link Memo} object
   * @returns {TransactionBuilder}
   */
  addMemo(memo) {
    this.memo = memo;
    return this;
  }

  /**
   * Sets a timeout precondition on the transaction.
   *
   *  Because of the distributed nature of the Stellar network it is possible
   *  that the status of your transaction will be determined after a long time
   *  if the network is highly congested. If you want to be sure to receive the
   *  status of the transaction within a given period you should set the {@link
   *  TimeBounds} with `maxTime` on the transaction (this is what `setTimeout`
   *  does internally; if there's `minTime` set but no `maxTime` it will be
   *  added).
   *
   *  A call to `TransactionBuilder.setTimeout` is **required** if Transaction
   *  does not have `max_time` set. If you don't want to set timeout, use
   *  `{@link TimeoutInfinite}`. In general you should set `{@link
   *  TimeoutInfinite}` only in smart contracts.
   *
   *  Please note that Horizon may still return <code>504 Gateway Timeout</code>
   *  error, even for short timeouts. In such case you need to resubmit the same
   *  transaction again without making any changes to receive a status. This
   *  method is using the machine system time (UTC), make sure it is set
   *  correctly.
   *
   * @param {number} timeoutSeconds   Number of seconds the transaction is good.
   *     Can't be negative. If the value is {@link TimeoutInfinite}, the
   *     transaction is good indefinitely.
   *
   * @returns {TransactionBuilder}
   *
   * @see {@link TimeoutInfinite}
   * @see https://developers.stellar.org/docs/tutorials/handling-errors/
   */
  setTimeout(timeoutSeconds) {
    if (this.timebounds !== null && this.timebounds.maxTime > 0) {
      throw new Error(
        'TimeBounds.max_time has been already set - setting timeout would overwrite it.'
      );
    }

    if (timeoutSeconds < 0) {
      throw new Error('timeout cannot be negative');
    }

    if (timeoutSeconds > 0) {
      const timeoutTimestamp = Math.floor(Date.now() / 1000) + timeoutSeconds;
      if (this.timebounds === null) {
        this.timebounds = { minTime: 0, maxTime: timeoutTimestamp };
      } else {
        this.timebounds = {
          minTime: this.timebounds.minTime,
          maxTime: timeoutTimestamp
        };
      }
    } else {
      this.timebounds = {
        minTime: 0,
        maxTime: 0
      };
    }

    return this;
  }

  /**
   * If you want to prepare a transaction which will become valid at some point
   * in the future, or be invalid after some time, you can set a timebounds
   * precondition. Internally this will set the `minTime`, and `maxTime`
   * preconditions. Conflicts with `setTimeout`, so use one or the other.
   *
   * @param {Date|number} minEpochOrDate  Either a JS Date object, or a number
   *     of UNIX epoch seconds. The transaction is valid after this timestamp.
   *     Can't be negative. If the value is `0`, the transaction is valid
   *     immediately.
   * @param {Date|number} maxEpochOrDate  Either a JS Date object, or a number
   *     of UNIX epoch seconds. The transaction is valid until this timestamp.
   *     Can't be negative. If the value is `0`, the transaction is valid
   *     indefinitely.
   *
   * @returns {TransactionBuilder}
   */
  setTimebounds(minEpochOrDate, maxEpochOrDate) {
    // Force it to a date type
    if (typeof minEpochOrDate === 'number') {
      minEpochOrDate = new Date(minEpochOrDate * 1000);
    }
    if (typeof maxEpochOrDate === 'number') {
      maxEpochOrDate = new Date(maxEpochOrDate * 1000);
    }

    if (this.timebounds !== null) {
      throw new Error(
        'TimeBounds has been already set - setting timebounds would overwrite it.'
      );
    }

    // Convert that date to the epoch seconds
    const minTime = Math.floor(minEpochOrDate.valueOf() / 1000);
    const maxTime = Math.floor(maxEpochOrDate.valueOf() / 1000);
    if (minTime < 0) {
      throw new Error('min_time cannot be negative');
    }
    if (maxTime < 0) {
      throw new Error('max_time cannot be negative');
    }
    if (maxTime > 0 && minTime > maxTime) {
      throw new Error('min_time cannot be greater than max_time');
    }

    this.timebounds = { minTime, maxTime };

    return this;
  }

  /**
   * If you want to prepare a transaction which will only be valid within some
   * range of ledgers, you can set a ledgerbounds precondition.
   * Internally this will set the `minLedger` and `maxLedger` preconditions.
   *
   * @param {number} minLedger  The minimum ledger this transaction is valid at
   *     or after. Cannot be negative. If the value is `0` (the default), the
   *     transaction is valid immediately.
   *
   * @param {number} maxLedger  The maximum ledger this transaction is valid
   *     before. Cannot be negative. If the value is `0`, the transaction is
   *     valid indefinitely.
   *
   * @returns {TransactionBuilder}
   */
  setLedgerbounds(minLedger, maxLedger) {
    if (this.ledgerbounds !== null) {
      throw new Error(
        'LedgerBounds has been already set - setting ledgerbounds would overwrite it.'
      );
    }

    if (minLedger < 0) {
      throw new Error('min_ledger cannot be negative');
    }
    if (maxLedger < 0) {
      throw new Error('max_ledger cannot be negative');
    }
    if (maxLedger > 0 && minLedger > maxLedger) {
      throw new Error('min_ledger cannot be greater than max_ledger');
    }

    this.ledgerbounds = { minLedger, maxLedger };

    return this;
  }

  /**
   * If you want to prepare a transaction which will be valid only while the
   * account sequence number is
   *
   *     minAccountSequence <= sourceAccountSequence < tx.seqNum
   *
   * Note that after execution the account's sequence number is always raised to
   * `tx.seqNum`. Internally this will set the `minAccountSequence`
   * precondition.
   *
   * @param {string} minAccountSequence   The minimum source account sequence
   *     number this transaction is valid for. If the value is `0` (the
   *     default), the transaction is valid when `sourceAccount's sequence
   *     number == tx.seqNum- 1`.
   *
   * @returns {TransactionBuilder}
   */
  setMinAccountSequence(minAccountSequence) {
    if (this.minAccountSequence !== null) {
      throw new Error(
        'min_account_sequence has been already set - setting min_account_sequence would overwrite it.'
      );
    }

    this.minAccountSequence = minAccountSequence;

    return this;
  }

  /**
   * For the transaction to be valid, the current ledger time must be at least
   * `minAccountSequenceAge` greater than sourceAccount's `sequenceTime`.
   * Internally this will set the `minAccountSequenceAge` precondition.
   *
   * @param {number} durationInSeconds  The minimum amount of time between
   *     source account sequence time and the ledger time when this transaction
   *     will become valid. If the value is `0`, the transaction is unrestricted
   *     by the account sequence age. Cannot be negative.
   *
   * @returns {TransactionBuilder}
   */
  setMinAccountSequenceAge(durationInSeconds) {
    if (typeof durationInSeconds !== 'number') {
      throw new Error('min_account_sequence_age must be a number');
    }
    if (this.minAccountSequenceAge !== null) {
      throw new Error(
        'min_account_sequence_age has been already set - setting min_account_sequence_age would overwrite it.'
      );
    }

    if (durationInSeconds < 0) {
      throw new Error('min_account_sequence_age cannot be negative');
    }

    this.minAccountSequenceAge = durationInSeconds;

    return this;
  }

  /**
   * For the transaction to be valid, the current ledger number must be at least
   * `minAccountSequenceLedgerGap` greater than sourceAccount's ledger sequence.
   * Internally this will set the `minAccountSequenceLedgerGap` precondition.
   *
   * @param {number} gap  The minimum number of ledgers between source account
   *     sequence and the ledger number when this transaction will become valid.
   *     If the value is `0`, the transaction is unrestricted by the account
   *     sequence ledger. Cannot be negative.
   *
   * @returns {TransactionBuilder}
   */
  setMinAccountSequenceLedgerGap(gap) {
    if (this.minAccountSequenceLedgerGap !== null) {
      throw new Error(
        'min_account_sequence_ledger_gap has been already set - setting min_account_sequence_ledger_gap would overwrite it.'
      );
    }

    if (gap < 0) {
      throw new Error('min_account_sequence_ledger_gap cannot be negative');
    }

    this.minAccountSequenceLedgerGap = gap;

    return this;
  }

  /**
   * For the transaction to be valid, there must be a signature corresponding to
   * every Signer in this array, even if the signature is not otherwise required
   * by the sourceAccount or operations. Internally this will set the
   * `extraSigners` precondition.
   *
   * @param {string[]} extraSigners   required extra signers (as {@link StrKey}s)
   *
   * @returns {TransactionBuilder}
   */
  setExtraSigners(extraSigners) {
    if (!Array.isArray(extraSigners)) {
      throw new Error('extra_signers must be an array of strings.');
    }

    if (this.extraSigners !== null) {
      throw new Error(
        'extra_signers has been already set - setting extra_signers would overwrite it.'
      );
    }

    if (extraSigners.length > 2) {
      throw new Error('extra_signers cannot be longer than 2 elements.');
    }

    this.extraSigners = [...extraSigners];

    return this;
  }

  /**
   * Set network nassphrase for the Transaction that will be built.
   *
   * @param {string} networkPassphrase    passphrase of the target Stellar
   *     network (e.g. "Public Global Stellar Network ; September 2015").
   *
   * @returns {TransactionBuilder}
   */
  setNetworkPassphrase(networkPassphrase) {
    this.networkPassphrase = networkPassphrase;
    return this;
  }

  /**
   * Sets the transaction's internal Soroban transaction data (resources,
   * footprint, etc.).
   *
   * For non-contract(non-Soroban) transactions, this setting has no effect. In
   * the case of Soroban transactions, this is either an instance of
   * {@link xdr.SorobanTransactionData} or a base64-encoded string of said
   * structure. This is usually obtained from the simulation response based on a
   * transaction with a Soroban operation (e.g.
   * {@link Operation.invokeHostFunction}, providing necessary resource
   * and storage footprint estimations for contract invocation.
   *
   * @param {xdr.SorobanTransactionData | string} sorobanData    the
   *    {@link xdr.SorobanTransactionData} as a raw xdr object or a base64
   *    string to be decoded
   *
   * @returns {TransactionBuilder}
   * @see {SorobanDataBuilder}
   */
  setSorobanData(sorobanData) {
    this.sorobanData = new SorobanDataBuilder(sorobanData).build();
    return this;
  }

  /**
   * This will build the transaction.
   * It will also increment the source account's sequence number by 1.
   * @returns {Transaction} This method will return the built {@link Transaction}.
   */
  build() {
    const sequenceNumber = new BigNumber(this.source.sequenceNumber()).plus(1);
    const fee = new BigNumber(this.baseFee)
      .times(this.operations.length)
      .toNumber();
    const attrs = {
      fee,
      seqNum: xdr.SequenceNumber.fromString(sequenceNumber.toString()),
      memo: this.memo ? this.memo.toXDRObject() : null
    };

    if (
      this.timebounds === null ||
      typeof this.timebounds.minTime === 'undefined' ||
      typeof this.timebounds.maxTime === 'undefined'
    ) {
      throw new Error(
        'TimeBounds has to be set or you must call setTimeout(TimeoutInfinite).'
      );
    }

    if (isValidDate(this.timebounds.minTime)) {
      this.timebounds.minTime = this.timebounds.minTime.getTime() / 1000;
    }
    if (isValidDate(this.timebounds.maxTime)) {
      this.timebounds.maxTime = this.timebounds.maxTime.getTime() / 1000;
    }

    this.timebounds.minTime = UnsignedHyper.fromString(
      this.timebounds.minTime.toString()
    );
    this.timebounds.maxTime = UnsignedHyper.fromString(
      this.timebounds.maxTime.toString()
    );

    const timeBounds = new xdr.TimeBounds(this.timebounds);

    if (this.hasV2Preconditions()) {
      let ledgerBounds = null;
      if (this.ledgerbounds !== null) {
        ledgerBounds = new xdr.LedgerBounds(this.ledgerbounds);
      }

      let minSeqNum = this.minAccountSequence || '0';
      minSeqNum = xdr.SequenceNumber.fromString(minSeqNum);

      const minSeqAge = UnsignedHyper.fromString(
        this.minAccountSequenceAge !== null
          ? this.minAccountSequenceAge.toString()
          : '0'
      );
      const minSeqLedgerGap = this.minAccountSequenceLedgerGap || 0;

      const extraSigners =
        this.extraSigners !== null
          ? this.extraSigners.map(SignerKey.decodeAddress)
          : [];

      attrs.cond = xdr.Preconditions.precondV2(
        new xdr.PreconditionsV2({
          timeBounds,
          ledgerBounds,
          minSeqNum,
          minSeqAge,
          minSeqLedgerGap,
          extraSigners
        })
      );
    } else {
      attrs.cond = xdr.Preconditions.precondTime(timeBounds);
    }

    attrs.sourceAccount = decodeAddressToMuxedAccount(this.source.accountId());

    // TODO - remove this workaround for TransactionExt ts constructor
    //       and use the typescript generated static factory method once fixed
    //       https://github.com/stellar/dts-xdr/issues/5
    if (this.sorobanData) {
      // @ts-ignore
      attrs.ext = new xdr.TransactionExt(1, this.sorobanData);
    } else {
      // @ts-ignore
      attrs.ext = new xdr.TransactionExt(0, xdr.Void);
    }

    const xtx = new xdr.Transaction(attrs);
    xtx.operations(this.operations);
    const txEnvelope = new xdr.TransactionEnvelope.envelopeTypeTx(
      new xdr.TransactionV1Envelope({ tx: xtx })
    );

    const tx = new Transaction(txEnvelope, this.networkPassphrase);

    this.source.incrementSequenceNumber();

    return tx;
  }

  hasV2Preconditions() {
    return (
      this.ledgerbounds !== null ||
      this.minAccountSequence !== null ||
      this.minAccountSequenceAge !== null ||
      this.minAccountSequenceLedgerGap !== null ||
      (this.extraSigners !== null && this.extraSigners.length > 0)
    );
  }

  /**
   * Builds a {@link FeeBumpTransaction}, enabling you to resubmit an existing
   * transaction with a higher fee.
   *
   * @param {Keypair|string}  feeSource - account paying for the transaction,
   *     in the form of either a Keypair (only the public key is used) or
   *     an account ID (in G... or M... form, but refer to `withMuxing`)
   * @param {string}          baseFee   - max fee willing to pay per operation
   *     in inner transaction (**in stroops**)
   * @param {Transaction}     innerTx   - {@link Transaction} to be bumped by
   *     the fee bump transaction
   * @param {string}          networkPassphrase - passphrase of the target
   *     Stellar network (e.g. "Public Global Stellar Network ; September 2015",
   *     see {@link Networks})
   *
   * @todo Alongside the next major version bump, this type signature can be
   *       changed to be less awkward: accept a MuxedAccount as the `feeSource`
   *       rather than a keypair or string.
   *
   * @note Your fee-bump amount should be >= 10x the original fee.
   * @see  https://developers.stellar.org/docs/glossary/fee-bumps/#replace-by-fee
   *
   * @returns {FeeBumpTransaction}
   */
  static buildFeeBumpTransaction(
    feeSource,
    baseFee,
    innerTx,
    networkPassphrase
  ) {
    const innerOps = innerTx.operations.length;
    const innerBaseFeeRate = new BigNumber(innerTx.fee).div(innerOps);
    const base = new BigNumber(baseFee);

    // The fee rate for fee bump is at least the fee rate of the inner transaction
    if (base.lt(innerBaseFeeRate)) {
      throw new Error(
        `Invalid baseFee, it should be at least ${innerBaseFeeRate} stroops.`
      );
    }

    const minBaseFee = new BigNumber(BASE_FEE);

    // The fee rate is at least the minimum fee
    if (base.lt(minBaseFee)) {
      throw new Error(
        `Invalid baseFee, it should be at least ${minBaseFee} stroops.`
      );
    }

    let innerTxEnvelope = innerTx.toEnvelope();
    if (innerTxEnvelope.switch() === xdr.EnvelopeType.envelopeTypeTxV0()) {
      const v0Tx = innerTxEnvelope.v0().tx();
      const v1Tx = new xdr.Transaction({
        sourceAccount: new xdr.MuxedAccount.keyTypeEd25519(
          v0Tx.sourceAccountEd25519()
        ),
        fee: v0Tx.fee(),
        seqNum: v0Tx.seqNum(),
        cond: xdr.Preconditions.precondTime(v0Tx.timeBounds()),
        memo: v0Tx.memo(),
        operations: v0Tx.operations(),
        ext: new xdr.TransactionExt(0)
      });
      innerTxEnvelope = new xdr.TransactionEnvelope.envelopeTypeTx(
        new xdr.TransactionV1Envelope({
          tx: v1Tx,
          signatures: innerTxEnvelope.v0().signatures()
        })
      );
    }

    let feeSourceAccount;
    if (typeof feeSource === 'string') {
      feeSourceAccount = decodeAddressToMuxedAccount(feeSource);
    } else {
      feeSourceAccount = feeSource.xdrMuxedAccount();
    }

    const tx = new xdr.FeeBumpTransaction({
      feeSource: feeSourceAccount,
      fee: xdr.Int64.fromString(base.times(innerOps + 1).toString()),
      innerTx: xdr.FeeBumpTransactionInnerTx.envelopeTypeTx(
        innerTxEnvelope.v1()
      ),
      ext: new xdr.FeeBumpTransactionExt(0)
    });
    const feeBumpTxEnvelope = new xdr.FeeBumpTransactionEnvelope({
      tx,
      signatures: []
    });
    const envelope = new xdr.TransactionEnvelope.envelopeTypeTxFeeBump(
      feeBumpTxEnvelope
    );

    return new FeeBumpTransaction(envelope, networkPassphrase);
  }

  /**
   * Build a {@link Transaction} or {@link FeeBumpTransaction} from an
   * xdr.TransactionEnvelope.
   *
   * @param {string|xdr.TransactionEnvelope} envelope - The transaction envelope
   *     object or base64 encoded string.
   * @param {string} networkPassphrase - The network passphrase of the target
   *     Stellar network (e.g. "Public Global Stellar Network ; September
   *     2015"), see {@link Networks}.
   *
   * @returns {Transaction|FeeBumpTransaction}
   */
  static fromXDR(envelope, networkPassphrase) {
    if (typeof envelope === 'string') {
      envelope = xdr.TransactionEnvelope.fromXDR(envelope, 'base64');
    }

    if (envelope.switch() === xdr.EnvelopeType.envelopeTypeTxFeeBump()) {
      return new FeeBumpTransaction(envelope, networkPassphrase);
    }

    return new Transaction(envelope, networkPassphrase);
  }
}

/**
 * Checks whether a provided object is a valid Date.
 * @argument {Date} d date object
 * @returns {boolean}
 */
export function isValidDate(d) {
  // isnan is okay here because it correctly checks for invalid date objects
  // eslint-disable-next-line no-restricted-globals
  return d instanceof Date && !isNaN(d);
}
