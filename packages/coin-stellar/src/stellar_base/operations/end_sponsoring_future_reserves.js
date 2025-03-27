import xdr from '../xdr';

/**
 * Create an "end sponsoring future reserves" operation.
 * @function
 * @alias Operation.endSponsoringFutureReserves
 * @param {object} opts Options object
 * @param {string} [opts.source] - The source account for the operation. Defaults to the transaction's source account.
 * @returns {xdr.Operation} xdr operation
 *
 * @example
 * const op = Operation.endSponsoringFutureReserves();
 *
 */
export function endSponsoringFutureReserves(opts = {}) {
  const opAttributes = {};
  opAttributes.body = xdr.OperationBody.endSponsoringFutureReserves();
  this.setSourceAccount(opAttributes, opts);

  return new xdr.Operation(opAttributes);
}
