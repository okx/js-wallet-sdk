import xdr from '../xdr';
import { decodeAddressToMuxedAccount } from '../util/decode_encode_muxed_account';

/**
 * Transfers native balance to destination account.
 *
 * @function
 * @alias Operation.accountMerge
 *
 * @param {object} opts - options object
 * @param {string} opts.destination - destination to merge the source account into
 * @param {string} [opts.source]    - operation source account (defaults to
 *     transaction source)
 *
 * @returns {xdr.Operation} an Account Merge operation (xdr.AccountMergeOp)
 */
export function accountMerge(opts) {
  const opAttributes = {};
  try {
    opAttributes.body = xdr.OperationBody.accountMerge(
      decodeAddressToMuxedAccount(opts.destination)
    );
  } catch (e) {
    throw new Error('destination is invalid');
  }
  this.setSourceAccount(opAttributes, opts);

  return new xdr.Operation(opAttributes);
}
