import xdr from './xdr';
import { Keypair } from './keypair';
import { StrKey } from './strkey';

/**
 * Claimant class represents an xdr.Claimant
 *
 * The claim predicate is optional, it defaults to unconditional if none is specified.
 *
 * @constructor
 * @param {string} destination - The destination account ID.
 * @param {xdr.ClaimPredicate} [predicate] - The claim predicate.
 */
export class Claimant {
  constructor(destination, predicate) {
    if (destination && !StrKey.isValidEd25519PublicKey(destination)) {
      throw new Error('Destination is invalid');
    }
    this._destination = destination;

    if (!predicate) {
      this._predicate = xdr.ClaimPredicate.claimPredicateUnconditional();
    } else if (predicate instanceof xdr.ClaimPredicate) {
      this._predicate = predicate;
    } else {
      throw new Error('Predicate should be an xdr.ClaimPredicate');
    }
  }

  /**
   * Returns an unconditional claim predicate
   * @Return {xdr.ClaimPredicate}
   */
  static predicateUnconditional() {
    return xdr.ClaimPredicate.claimPredicateUnconditional();
  }

  /**
   * Returns an `and` claim predicate
   * @param {xdr.ClaimPredicate} left an xdr.ClaimPredicate
   * @param {xdr.ClaimPredicate} right an xdr.ClaimPredicate
   * @Return {xdr.ClaimPredicate}
   */
  static predicateAnd(left, right) {
    if (!(left instanceof xdr.ClaimPredicate)) {
      throw new Error('left Predicate should be an xdr.ClaimPredicate');
    }
    if (!(right instanceof xdr.ClaimPredicate)) {
      throw new Error('right Predicate should be an xdr.ClaimPredicate');
    }

    return xdr.ClaimPredicate.claimPredicateAnd([left, right]);
  }

  /**
   * Returns an `or` claim predicate
   * @param {xdr.ClaimPredicate} left an xdr.ClaimPredicate
   * @param {xdr.ClaimPredicate} right an xdr.ClaimPredicate
   * @Return {xdr.ClaimPredicate}
   */
  static predicateOr(left, right) {
    if (!(left instanceof xdr.ClaimPredicate)) {
      throw new Error('left Predicate should be an xdr.ClaimPredicate');
    }
    if (!(right instanceof xdr.ClaimPredicate)) {
      throw new Error('right Predicate should be an xdr.ClaimPredicate');
    }

    return xdr.ClaimPredicate.claimPredicateOr([left, right]);
  }

  /**
   * Returns a `not` claim predicate
   * @param {xdr.ClaimPredicate} predicate an xdr.ClaimPredicate
   * @Return {xdr.ClaimPredicate}
   */
  static predicateNot(predicate) {
    if (!(predicate instanceof xdr.ClaimPredicate)) {
      throw new Error('right Predicate should be an xdr.ClaimPredicate');
    }

    return xdr.ClaimPredicate.claimPredicateNot(predicate);
  }

  /**
   * Returns a `BeforeAbsoluteTime` claim predicate
   *
   * This predicate will be fulfilled if the closing time of the ledger that
   * includes the CreateClaimableBalance operation is less than this (absolute)
   * Unix timestamp (expressed in seconds).
   *
   * @param {string} absBefore Unix epoch (in seconds) as a string
   * @Return {xdr.ClaimPredicate}
   */
  static predicateBeforeAbsoluteTime(absBefore) {
    return xdr.ClaimPredicate.claimPredicateBeforeAbsoluteTime(
      xdr.Int64.fromString(absBefore)
    );
  }

  /**
   * Returns a `BeforeRelativeTime` claim predicate
   *
   * This predicate will be fulfilled if the closing time of the ledger that
   * includes the CreateClaimableBalance operation plus this relative time delta
   * (in seconds) is less than the current time.
   *
   * @param {strings} seconds seconds since closeTime of the ledger in which the ClaimableBalanceEntry was created (as string)
   * @Return {xdr.ClaimPredicate}
   */
  static predicateBeforeRelativeTime(seconds) {
    return xdr.ClaimPredicate.claimPredicateBeforeRelativeTime(
      xdr.Int64.fromString(seconds)
    );
  }

  /**
   * Returns a claimant object from its XDR object representation.
   * @param {xdr.Claimant} claimantXdr - The claimant xdr object.
   * @returns {Claimant}
   */
  static fromXDR(claimantXdr) {
    let value;
    switch (claimantXdr.switch()) {
      case xdr.ClaimantType.claimantTypeV0():
        value = claimantXdr.v0();
        return new this(
          StrKey.encodeEd25519PublicKey(value.destination().ed25519()),
          value.predicate()
        );
      default:
        throw new Error(`Invalid claimant type: ${claimantXdr.switch().name}`);
    }
  }

  /**
   * Returns the xdr object for this claimant.
   * @returns {xdr.Claimant} XDR Claimant object
   */
  toXDRObject() {
    const claimant = new xdr.ClaimantV0({
      destination: Keypair.fromPublicKey(this._destination).xdrAccountId(),
      predicate: this._predicate
    });

    return xdr.Claimant.claimantTypeV0(claimant);
  }

  /**
   * @type {string}
   * @readonly
   */
  get destination() {
    return this._destination;
  }

  set destination(value) {
    throw new Error('Claimant is immutable');
  }

  /**
   * @type {xdr.ClaimPredicate}
   * @readonly
   */
  get predicate() {
    return this._predicate;
  }

  set predicate(value) {
    throw new Error('Claimant is immutable');
  }
}
