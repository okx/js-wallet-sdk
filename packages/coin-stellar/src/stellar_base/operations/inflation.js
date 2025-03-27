import xdr from '../xdr';

/**
 * This operation generates the inflation.
 * @function
 * @alias Operation.inflation
 * @param {object} [opts] Options object
 * @param {string} [opts.source] - The optional source account.
 * @returns {xdr.InflationOp} Inflation operation
 */
export function inflation(opts = {}) {
  const opAttributes = {};
  opAttributes.body = xdr.OperationBody.inflation();
  this.setSourceAccount(opAttributes, opts);
  return new xdr.Operation(opAttributes);
}
