import xdr from '../xdr';
import { StrKey } from '../strkey';
import { Keypair } from '../keypair';

/**
 * Create a "begin sponsoring future reserves" operation.
 * @function
 * @alias Operation.beginSponsoringFutureReserves
 * @param {object} opts Options object
 * @param {string} opts.sponsoredId - The sponsored account id.
 * @param {string} [opts.source] - The source account for the operation. Defaults to the transaction's source account.
 * @returns {xdr.Operation} xdr operation
 *
 * @example
 * const op = Operation.beginSponsoringFutureReserves({
 *   sponsoredId: 'GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7'
 * });
 *
 */
export function beginSponsoringFutureReserves(opts = {}) {
  if (!StrKey.isValidEd25519PublicKey(opts.sponsoredId)) {
    throw new Error('sponsoredId is invalid');
  }
  const op = new xdr.BeginSponsoringFutureReservesOp({
    sponsoredId: Keypair.fromPublicKey(opts.sponsoredId).xdrAccountId()
  });

  const opAttributes = {};
  opAttributes.body = xdr.OperationBody.beginSponsoringFutureReserves(op);
  this.setSourceAccount(opAttributes, opts);

  return new xdr.Operation(opAttributes);
}
