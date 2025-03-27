/* eslint-disable no-bitwise */

import { Hyper } from '@stellar/js-xdr';
import BigNumber from './util/bignumber';
import { trimEnd } from './util/util';
import { best_r } from './util/continued_fraction';
import { Asset } from './asset';
import { LiquidityPoolAsset } from './liquidity_pool_asset';
import { Claimant } from './claimant';
import { StrKey } from './strkey';
import { LiquidityPoolId } from './liquidity_pool_id';
import xdr from './xdr';
import * as ops from './operations';
import {
  decodeAddressToMuxedAccount,
  encodeMuxedAccountToAddress
} from './util/decode_encode_muxed_account';

const ONE = 10000000;
const MAX_INT64 = '9223372036854775807';

/**
 * When set using `{@link Operation.setOptions}` option, requires the issuing
 * account to give other accounts permission before they can hold the issuing
 * account’s credit.
 *
 * @constant
 * @see [Account flags](https://developers.stellar.org/docs/glossary/accounts/#flags)
 */
export const AuthRequiredFlag = 1 << 0;
/**
 * When set using `{@link Operation.setOptions}` option, allows the issuing
 * account to revoke its credit held by other accounts.
 *
 * @constant
 * @see [Account flags](https://developers.stellar.org/docs/glossary/accounts/#flags)
 */
export const AuthRevocableFlag = 1 << 1;
/**
 * When set using `{@link Operation.setOptions}` option, then none of the
 * authorization flags can be set and the account can never be deleted.
 *
 * @constant
 * @see [Account flags](https://developers.stellar.org/docs/glossary/accounts/#flags)
 */
export const AuthImmutableFlag = 1 << 2;

/**
 * When set using `{@link Operation.setOptions}` option, then any trustlines
 * created by this account can have a ClawbackOp operation submitted for the
 * corresponding asset.
 *
 * @constant
 * @see [Account flags](https://developers.stellar.org/docs/glossary/accounts/#flags)
 */
export const AuthClawbackEnabledFlag = 1 << 3;

/**
 * `Operation` class represents
 * [operations](https://developers.stellar.org/docs/glossary/operations/) in
 * Stellar network.
 *
 * Use one of static methods to create operations:
 * * `{@link Operation.createAccount}`
 * * `{@link Operation.payment}`
 * * `{@link Operation.pathPaymentStrictReceive}`
 * * `{@link Operation.pathPaymentStrictSend}`
 * * `{@link Operation.manageSellOffer}`
 * * `{@link Operation.manageBuyOffer}`
 * * `{@link Operation.createPassiveSellOffer}`
 * * `{@link Operation.setOptions}`
 * * `{@link Operation.changeTrust}`
 * * `{@link Operation.allowTrust}`
 * * `{@link Operation.accountMerge}`
 * * `{@link Operation.inflation}`
 * * `{@link Operation.manageData}`
 * * `{@link Operation.bumpSequence}`
 * * `{@link Operation.createClaimableBalance}`
 * * `{@link Operation.claimClaimableBalance}`
 * * `{@link Operation.beginSponsoringFutureReserves}`
 * * `{@link Operation.endSponsoringFutureReserves}`
 * * `{@link Operation.revokeAccountSponsorship}`
 * * `{@link Operation.revokeTrustlineSponsorship}`
 * * `{@link Operation.revokeOfferSponsorship}`
 * * `{@link Operation.revokeDataSponsorship}`
 * * `{@link Operation.revokeClaimableBalanceSponsorship}`
 * * `{@link Operation.revokeLiquidityPoolSponsorship}`
 * * `{@link Operation.revokeSignerSponsorship}`
 * * `{@link Operation.clawback}`
 * * `{@link Operation.clawbackClaimableBalance}`
 * * `{@link Operation.setTrustLineFlags}`
 * * `{@link Operation.liquidityPoolDeposit}`
 * * `{@link Operation.liquidityPoolWithdraw}`
 * * `{@link Operation.invokeHostFunction}`
 * * `{@link Operation.extendFootprintTtlOp}`
 * * `{@link Operation.restoreFootprint}`
 *
 * @class Operation
 */
export class Operation {
  static setSourceAccount(opAttributes, opts) {
    if (opts.source) {
      try {
        opAttributes.sourceAccount = decodeAddressToMuxedAccount(opts.source);
      } catch (e) {
        throw new Error('Source address is invalid');
      }
    }
  }

  /**
   * Deconstructs the raw XDR operation object into the structured object that
   * was used to create the operation (i.e. the `opts` parameter to most ops).
   *
   * @param {xdr.Operation}   operation - An XDR Operation.
   * @return {Operation}
   */
  static fromXDRObject(operation) {
    const result = {};
    if (operation.sourceAccount()) {
      result.source = encodeMuxedAccountToAddress(operation.sourceAccount());
    }

    const attrs = operation.body().value();
    const operationName = operation.body().switch().name;

    switch (operationName) {
      case 'createAccount': {
        result.type = 'createAccount';
        result.destination = accountIdtoAddress(attrs.destination());
        result.startingBalance = this._fromXDRAmount(attrs.startingBalance());
        break;
      }
      case 'payment': {
        result.type = 'payment';
        result.destination = encodeMuxedAccountToAddress(attrs.destination());
        result.asset = Asset.fromOperation(attrs.asset());
        result.amount = this._fromXDRAmount(attrs.amount());
        break;
      }
      case 'pathPaymentStrictReceive': {
        result.type = 'pathPaymentStrictReceive';
        result.sendAsset = Asset.fromOperation(attrs.sendAsset());
        result.sendMax = this._fromXDRAmount(attrs.sendMax());
        result.destination = encodeMuxedAccountToAddress(attrs.destination());
        result.destAsset = Asset.fromOperation(attrs.destAsset());
        result.destAmount = this._fromXDRAmount(attrs.destAmount());
        result.path = [];

        const path = attrs.path();

        // note that Object.values isn't supported by node 6!
        Object.keys(path).forEach((pathKey) => {
          result.path.push(Asset.fromOperation(path[pathKey]));
        });
        break;
      }
      case 'pathPaymentStrictSend': {
        result.type = 'pathPaymentStrictSend';
        result.sendAsset = Asset.fromOperation(attrs.sendAsset());
        result.sendAmount = this._fromXDRAmount(attrs.sendAmount());
        result.destination = encodeMuxedAccountToAddress(attrs.destination());
        result.destAsset = Asset.fromOperation(attrs.destAsset());
        result.destMin = this._fromXDRAmount(attrs.destMin());
        result.path = [];

        const path = attrs.path();

        // note that Object.values isn't supported by node 6!
        Object.keys(path).forEach((pathKey) => {
          result.path.push(Asset.fromOperation(path[pathKey]));
        });
        break;
      }
      case 'changeTrust': {
        result.type = 'changeTrust';
        switch (attrs.line().switch()) {
          case xdr.AssetType.assetTypePoolShare():
            result.line = LiquidityPoolAsset.fromOperation(attrs.line());
            break;
          default:
            result.line = Asset.fromOperation(attrs.line());
            break;
        }
        result.limit = this._fromXDRAmount(attrs.limit());
        break;
      }
      case 'allowTrust': {
        result.type = 'allowTrust';
        result.trustor = accountIdtoAddress(attrs.trustor());
        result.assetCode = attrs.asset().value().toString();
        result.assetCode = trimEnd(result.assetCode, '\0');
        result.authorize = attrs.authorize();
        break;
      }
      case 'setOptions': {
        result.type = 'setOptions';
        if (attrs.inflationDest()) {
          result.inflationDest = accountIdtoAddress(attrs.inflationDest());
        }

        result.clearFlags = attrs.clearFlags();
        result.setFlags = attrs.setFlags();
        result.masterWeight = attrs.masterWeight();
        result.lowThreshold = attrs.lowThreshold();
        result.medThreshold = attrs.medThreshold();
        result.highThreshold = attrs.highThreshold();
        // home_domain is checked by iscntrl in stellar-core
        result.homeDomain =
          attrs.homeDomain() !== undefined
            ? attrs.homeDomain().toString('ascii')
            : undefined;

        if (attrs.signer()) {
          const signer = {};
          const arm = attrs.signer().key().arm();
          if (arm === 'ed25519') {
            signer.ed25519PublicKey = accountIdtoAddress(attrs.signer().key());
          } else if (arm === 'preAuthTx') {
            signer.preAuthTx = attrs.signer().key().preAuthTx();
          } else if (arm === 'hashX') {
            signer.sha256Hash = attrs.signer().key().hashX();
          } else if (arm === 'ed25519SignedPayload') {
            const signedPayload = attrs.signer().key().ed25519SignedPayload();
            signer.ed25519SignedPayload = StrKey.encodeSignedPayload(
              signedPayload.toXDR()
            );
          }

          signer.weight = attrs.signer().weight();
          result.signer = signer;
        }
        break;
      }
      // the next case intentionally falls through!
      case 'manageOffer':
      case 'manageSellOffer': {
        result.type = 'manageSellOffer';
        result.selling = Asset.fromOperation(attrs.selling());
        result.buying = Asset.fromOperation(attrs.buying());
        result.amount = this._fromXDRAmount(attrs.amount());
        result.price = this._fromXDRPrice(attrs.price());
        result.offerId = attrs.offerId().toString();
        break;
      }
      case 'manageBuyOffer': {
        result.type = 'manageBuyOffer';
        result.selling = Asset.fromOperation(attrs.selling());
        result.buying = Asset.fromOperation(attrs.buying());
        result.buyAmount = this._fromXDRAmount(attrs.buyAmount());
        result.price = this._fromXDRPrice(attrs.price());
        result.offerId = attrs.offerId().toString();
        break;
      }
      // the next case intentionally falls through!
      case 'createPassiveOffer':
      case 'createPassiveSellOffer': {
        result.type = 'createPassiveSellOffer';
        result.selling = Asset.fromOperation(attrs.selling());
        result.buying = Asset.fromOperation(attrs.buying());
        result.amount = this._fromXDRAmount(attrs.amount());
        result.price = this._fromXDRPrice(attrs.price());
        break;
      }
      case 'accountMerge': {
        result.type = 'accountMerge';
        result.destination = encodeMuxedAccountToAddress(attrs);
        break;
      }
      case 'manageData': {
        result.type = 'manageData';
        // manage_data.name is checked by iscntrl in stellar-core
        result.name = attrs.dataName().toString('ascii');
        result.value = attrs.dataValue();
        break;
      }
      case 'inflation': {
        result.type = 'inflation';
        break;
      }
      case 'bumpSequence': {
        result.type = 'bumpSequence';
        result.bumpTo = attrs.bumpTo().toString();
        break;
      }
      case 'createClaimableBalance': {
        result.type = 'createClaimableBalance';
        result.asset = Asset.fromOperation(attrs.asset());
        result.amount = this._fromXDRAmount(attrs.amount());
        result.claimants = [];
        attrs.claimants().forEach((claimant) => {
          result.claimants.push(Claimant.fromXDR(claimant));
        });
        break;
      }
      case 'claimClaimableBalance': {
        result.type = 'claimClaimableBalance';
        result.balanceId = attrs.toXDR('hex');
        break;
      }
      case 'beginSponsoringFutureReserves': {
        result.type = 'beginSponsoringFutureReserves';
        result.sponsoredId = accountIdtoAddress(attrs.sponsoredId());
        break;
      }
      case 'endSponsoringFutureReserves': {
        result.type = 'endSponsoringFutureReserves';
        break;
      }
      case 'revokeSponsorship': {
        extractRevokeSponshipDetails(attrs, result);
        break;
      }
      case 'clawback': {
        result.type = 'clawback';
        result.amount = this._fromXDRAmount(attrs.amount());
        result.from = encodeMuxedAccountToAddress(attrs.from());
        result.asset = Asset.fromOperation(attrs.asset());
        break;
      }
      case 'clawbackClaimableBalance': {
        result.type = 'clawbackClaimableBalance';
        result.balanceId = attrs.toXDR('hex');
        break;
      }
      case 'setTrustLineFlags': {
        result.type = 'setTrustLineFlags';
        result.asset = Asset.fromOperation(attrs.asset());
        result.trustor = accountIdtoAddress(attrs.trustor());

        // Convert from the integer-bitwised flag into a sensible object that
        // indicates true/false for each flag that's on/off.
        const clears = attrs.clearFlags();
        const sets = attrs.setFlags();

        const mapping = {
          authorized: xdr.TrustLineFlags.authorizedFlag(),
          authorizedToMaintainLiabilities:
            xdr.TrustLineFlags.authorizedToMaintainLiabilitiesFlag(),
          clawbackEnabled: xdr.TrustLineFlags.trustlineClawbackEnabledFlag()
        };

        const getFlagValue = (key) => {
          const bit = mapping[key].value;
          if (sets & bit) {
            return true;
          }
          if (clears & bit) {
            return false;
          }
          return undefined;
        };

        result.flags = {};
        Object.keys(mapping).forEach((flagName) => {
          result.flags[flagName] = getFlagValue(flagName);
        });

        break;
      }
      case 'liquidityPoolDeposit': {
        result.type = 'liquidityPoolDeposit';
        result.liquidityPoolId = attrs.liquidityPoolId().toString('hex');
        result.maxAmountA = this._fromXDRAmount(attrs.maxAmountA());
        result.maxAmountB = this._fromXDRAmount(attrs.maxAmountB());
        result.minPrice = this._fromXDRPrice(attrs.minPrice());
        result.maxPrice = this._fromXDRPrice(attrs.maxPrice());
        break;
      }
      case 'liquidityPoolWithdraw': {
        result.type = 'liquidityPoolWithdraw';
        result.liquidityPoolId = attrs.liquidityPoolId().toString('hex');
        result.amount = this._fromXDRAmount(attrs.amount());
        result.minAmountA = this._fromXDRAmount(attrs.minAmountA());
        result.minAmountB = this._fromXDRAmount(attrs.minAmountB());
        break;
      }
      case 'invokeHostFunction': {
        result.type = 'invokeHostFunction';
        result.func = attrs.hostFunction();
        result.auth = attrs.auth() ?? [];
        break;
      }
      case 'extendFootprintTtl': {
        result.type = 'extendFootprintTtl';
        result.extendTo = attrs.extendTo();
        break;
      }
      case 'restoreFootprint': {
        result.type = 'restoreFootprint';
        break;
      }
      default: {
        throw new Error(`Unknown operation: ${operationName}`);
      }
    }
    return result;
  }

  /**
   * Validates that a given amount is possible for a Stellar asset.
   *
   * Specifically, this means that the amount is well, a valid number, but also
   * that it is within the int64 range and has no more than 7 decimal levels of
   * precision.
   *
   * Note that while smart contracts allow larger amounts, this is oriented
   * towards validating the standard Stellar operations.
   *
   * @param {string}  value       the amount to validate
   * @param {boolean} allowZero   optionally, whether or not zero is valid (default: no)
   *
   * @returns {boolean}
   */
  static isValidAmount(value, allowZero = false) {
    if (typeof value !== 'string') {
      return false;
    }

    let amount;
    try {
      amount = new BigNumber(value);
    } catch (e) {
      return false;
    }

    if (
      // == 0
      (!allowZero && amount.isZero()) ||
      // < 0
      amount.isNegative() ||
      // > Max value
      amount.times(ONE).gt(new BigNumber(MAX_INT64).toString()) ||
      // Decimal places (max 7)
      amount.decimalPlaces() > 7 ||
      // NaN or Infinity
      amount.isNaN() ||
      !amount.isFinite()
    ) {
      return false;
    }

    return true;
  }

  static constructAmountRequirementsError(arg) {
    return `${arg} argument must be of type String, represent a positive number and have at most 7 digits after the decimal`;
  }

  /**
   * Returns value converted to uint32 value or undefined.
   * If `value` is not `Number`, `String` or `Undefined` then throws an error.
   * Used in {@link Operation.setOptions}.
   * @private
   * @param {string} name Name of the property (used in error message only)
   * @param {*} value Value to check
   * @param {function(value, name)} isValidFunction Function to check other constraints (the argument will be a `Number`)
   * @returns {undefined|Number}
   */
  static _checkUnsignedIntValue(name, value, isValidFunction = null) {
    if (typeof value === 'undefined') {
      return undefined;
    }

    if (typeof value === 'string') {
      value = parseFloat(value);
    }

    switch (true) {
      case typeof value !== 'number' ||
        !Number.isFinite(value) ||
        value % 1 !== 0:
        throw new Error(`${name} value is invalid`);
      case value < 0:
        throw new Error(`${name} value must be unsigned`);
      case !isValidFunction ||
        (isValidFunction && isValidFunction(value, name)):
        return value;
      default:
        throw new Error(`${name} value is invalid`);
    }
  }
  /**
   * @private
   * @param {string|BigNumber} value Value
   * @returns {Hyper} XDR amount
   */
  static _toXDRAmount(value) {
    const amount = new BigNumber(value).times(ONE);
    return Hyper.fromString(amount.toString());
  }

  /**
   * @private
   * @param {string|BigNumber} value XDR amount
   * @returns {BigNumber} Number
   */
  static _fromXDRAmount(value) {
    return new BigNumber(value).div(ONE).toFixed(7);
  }

  /**
   * @private
   * @param {object} price Price object
   * @param {function} price.n numerator function that returns a value
   * @param {function} price.d denominator function that returns a value
   * @returns {BigNumber} Big string
   */
  static _fromXDRPrice(price) {
    const n = new BigNumber(price.n());
    return n.div(new BigNumber(price.d())).toString();
  }

  /**
   * @private
   * @param {object} price Price object
   * @param {function} price.n numerator function that returns a value
   * @param {function} price.d denominator function that returns a value
   * @returns {object} XDR price object
   */
  static _toXDRPrice(price) {
    let xdrObject;
    if (price.n && price.d) {
      xdrObject = new xdr.Price(price);
    } else {
      const approx = best_r(price);
      xdrObject = new xdr.Price({
        n: parseInt(approx[0], 10),
        d: parseInt(approx[1], 10)
      });
    }

    if (xdrObject.n() < 0 || xdrObject.d() < 0) {
      throw new Error('price must be positive');
    }

    return xdrObject;
  }
}

function extractRevokeSponshipDetails(attrs, result) {
  switch (attrs.switch().name) {
    case 'revokeSponsorshipLedgerEntry': {
      const ledgerKey = attrs.ledgerKey();
      switch (ledgerKey.switch().name) {
        case xdr.LedgerEntryType.account().name: {
          result.type = 'revokeAccountSponsorship';
          result.account = accountIdtoAddress(ledgerKey.account().accountId());
          break;
        }
        case xdr.LedgerEntryType.trustline().name: {
          result.type = 'revokeTrustlineSponsorship';
          result.account = accountIdtoAddress(
            ledgerKey.trustLine().accountId()
          );
          const xdrAsset = ledgerKey.trustLine().asset();
          switch (xdrAsset.switch()) {
            case xdr.AssetType.assetTypePoolShare():
              result.asset = LiquidityPoolId.fromOperation(xdrAsset);
              break;
            default:
              result.asset = Asset.fromOperation(xdrAsset);
              break;
          }
          break;
        }
        case xdr.LedgerEntryType.offer().name: {
          result.type = 'revokeOfferSponsorship';
          result.seller = accountIdtoAddress(ledgerKey.offer().sellerId());
          result.offerId = ledgerKey.offer().offerId().toString();
          break;
        }
        case xdr.LedgerEntryType.data().name: {
          result.type = 'revokeDataSponsorship';
          result.account = accountIdtoAddress(ledgerKey.data().accountId());
          result.name = ledgerKey.data().dataName().toString('ascii');
          break;
        }
        case xdr.LedgerEntryType.claimableBalance().name: {
          result.type = 'revokeClaimableBalanceSponsorship';
          result.balanceId = ledgerKey
            .claimableBalance()
            .balanceId()
            .toXDR('hex');
          break;
        }
        case xdr.LedgerEntryType.liquidityPool().name: {
          result.type = 'revokeLiquidityPoolSponsorship';
          result.liquidityPoolId = ledgerKey
            .liquidityPool()
            .liquidityPoolId()
            .toString('hex');
          break;
        }
        default: {
          throw new Error(`Unknown ledgerKey: ${attrs.switch().name}`);
        }
      }
      break;
    }
    case 'revokeSponsorshipSigner': {
      result.type = 'revokeSignerSponsorship';
      result.account = accountIdtoAddress(attrs.signer().accountId());
      result.signer = convertXDRSignerKeyToObject(attrs.signer().signerKey());
      break;
    }
    default: {
      throw new Error(`Unknown revokeSponsorship: ${attrs.switch().name}`);
    }
  }
}

function convertXDRSignerKeyToObject(signerKey) {
  const attrs = {};
  switch (signerKey.switch().name) {
    case xdr.SignerKeyType.signerKeyTypeEd25519().name: {
      attrs.ed25519PublicKey = StrKey.encodeEd25519PublicKey(
        signerKey.ed25519()
      );
      break;
    }
    case xdr.SignerKeyType.signerKeyTypePreAuthTx().name: {
      attrs.preAuthTx = signerKey.preAuthTx().toString('hex');
      break;
    }
    case xdr.SignerKeyType.signerKeyTypeHashX().name: {
      attrs.sha256Hash = signerKey.hashX().toString('hex');
      break;
    }
    default: {
      throw new Error(`Unknown signerKey: ${signerKey.switch().name}`);
    }
  }

  return attrs;
}

function accountIdtoAddress(accountId) {
  return StrKey.encodeEd25519PublicKey(accountId.ed25519());
}

// Attach all imported operations as static methods on the Operation class
Operation.accountMerge = ops.accountMerge;
Operation.allowTrust = ops.allowTrust;
Operation.bumpSequence = ops.bumpSequence;
Operation.changeTrust = ops.changeTrust;
Operation.createAccount = ops.createAccount;
Operation.createClaimableBalance = ops.createClaimableBalance;
Operation.claimClaimableBalance = ops.claimClaimableBalance;
Operation.clawbackClaimableBalance = ops.clawbackClaimableBalance;
Operation.createPassiveSellOffer = ops.createPassiveSellOffer;
Operation.inflation = ops.inflation;
Operation.manageData = ops.manageData;
Operation.manageSellOffer = ops.manageSellOffer;
Operation.manageBuyOffer = ops.manageBuyOffer;
Operation.pathPaymentStrictReceive = ops.pathPaymentStrictReceive;
Operation.pathPaymentStrictSend = ops.pathPaymentStrictSend;
Operation.payment = ops.payment;
Operation.setOptions = ops.setOptions;
Operation.beginSponsoringFutureReserves = ops.beginSponsoringFutureReserves;
Operation.endSponsoringFutureReserves = ops.endSponsoringFutureReserves;
Operation.revokeAccountSponsorship = ops.revokeAccountSponsorship;
Operation.revokeTrustlineSponsorship = ops.revokeTrustlineSponsorship;
Operation.revokeOfferSponsorship = ops.revokeOfferSponsorship;
Operation.revokeDataSponsorship = ops.revokeDataSponsorship;
Operation.revokeClaimableBalanceSponsorship =
  ops.revokeClaimableBalanceSponsorship;
Operation.revokeLiquidityPoolSponsorship = ops.revokeLiquidityPoolSponsorship;
Operation.revokeSignerSponsorship = ops.revokeSignerSponsorship;
Operation.clawback = ops.clawback;
Operation.setTrustLineFlags = ops.setTrustLineFlags;
Operation.liquidityPoolDeposit = ops.liquidityPoolDeposit;
Operation.liquidityPoolWithdraw = ops.liquidityPoolWithdraw;
Operation.invokeHostFunction = ops.invokeHostFunction;
Operation.extendFootprintTtl = ops.extendFootprintTtl;
Operation.restoreFootprint = ops.restoreFootprint;

// these are not `xdr.Operation`s directly, but are proxies for complex but
// common versions of `Operation.invokeHostFunction`
Operation.createStellarAssetContract = ops.createStellarAssetContract;
Operation.invokeContractFunction = ops.invokeContractFunction;
Operation.createCustomContract = ops.createCustomContract;
Operation.uploadContractWasm = ops.uploadContractWasm;
