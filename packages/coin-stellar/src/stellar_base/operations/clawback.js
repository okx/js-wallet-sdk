import xdr from '../xdr';
import { decodeAddressToMuxedAccount } from '../util/decode_encode_muxed_account';

/**
 * Creates a clawback operation.
 *
 * @function
 * @alias Operation.clawback
 *
 * @param {object} opts - Options object
 * @param {Asset}  opts.asset   - The asset being clawed back.
 * @param {string} opts.amount  - The amount of the asset to claw back.
 * @param {string} opts.from    - The public key of the (optionally-muxed)
 *     account to claw back from.
 *
 * @param {string} [opts.source] - The source account for the operation.
 *     Defaults to the transaction's source account.
 *
 * @return {xdr.ClawbackOp}
 *
 * @see https://github.com/stellar/stellar-protocol/blob/master/core/cap-0035.md#clawback-operation
 */
export function clawback(opts) {
  const attributes = {};
  if (!this.isValidAmount(opts.amount)) {
    throw new TypeError(this.constructAmountRequirementsError('amount'));
  }
  attributes.amount = this._toXDRAmount(opts.amount);
  attributes.asset = opts.asset.toXDRObject();
  try {
    attributes.from = decodeAddressToMuxedAccount(opts.from);
  } catch (e) {
    throw new Error('from address is invalid');
  }

  const opAttributes = {
    body: xdr.OperationBody.clawback(new xdr.ClawbackOp(attributes))
  };
  this.setSourceAccount(opAttributes, opts);

  return new xdr.Operation(opAttributes);
}
