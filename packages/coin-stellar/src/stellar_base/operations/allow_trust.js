import xdr from '../xdr';
import { Keypair } from '../keypair';
import { StrKey } from '../strkey';

/**
 * @deprecated since v5.0
 *
 * Returns an XDR AllowTrustOp. An "allow trust" operation authorizes another
 * account to hold your account's credit for a given asset.
 *
 * @function
 * @alias Operation.allowTrust
 *
 * @param {object} opts Options object
 * @param {string} opts.trustor - The trusting account (the one being authorized)
 * @param {string} opts.assetCode - The asset code being authorized.
 * @param {(0|1|2)} opts.authorize - `1` to authorize, `2` to authorize to maintain liabilities, and `0` to deauthorize.
 * @param {string} [opts.source] - The source account (defaults to transaction source).
 *
 * @returns {xdr.AllowTrustOp} Allow Trust operation
 */
export function allowTrust(opts) {
  if (!StrKey.isValidEd25519PublicKey(opts.trustor)) {
    throw new Error('trustor is invalid');
  }
  const attributes = {};
  attributes.trustor = Keypair.fromPublicKey(opts.trustor).xdrAccountId();
  if (opts.assetCode.length <= 4) {
    const code = opts.assetCode.padEnd(4, '\0');
    attributes.asset = xdr.AssetCode.assetTypeCreditAlphanum4(code);
  } else if (opts.assetCode.length <= 12) {
    const code = opts.assetCode.padEnd(12, '\0');
    attributes.asset = xdr.AssetCode.assetTypeCreditAlphanum12(code);
  } else {
    throw new Error('Asset code must be 12 characters at max.');
  }

  if (typeof opts.authorize === 'boolean') {
    if (opts.authorize) {
      attributes.authorize = xdr.TrustLineFlags.authorizedFlag().value;
    } else {
      attributes.authorize = 0;
    }
  } else {
    attributes.authorize = opts.authorize;
  }

  const allowTrustOp = new xdr.AllowTrustOp(attributes);

  const opAttributes = {};
  opAttributes.body = xdr.OperationBody.allowTrust(allowTrustOp);
  this.setSourceAccount(opAttributes, opts);

  return new xdr.Operation(opAttributes);
}
