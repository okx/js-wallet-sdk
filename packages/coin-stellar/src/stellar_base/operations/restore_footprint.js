import xdr from '../xdr';

/**
 * Builds an operation to restore the archived ledger entries specified
 * by the ledger keys.
 *
 * The ledger keys to restore are specified separately from the operation
 * in read-write footprint of the transaction.
 *
 * It takes no parameters because the relevant footprint is derived from the
 * transaction itself. See {@link TransactionBuilder}'s `opts.sorobanData`
 * parameter (or {@link TransactionBuilder.setSorobanData} /
 * {@link TransactionBuilder.setLedgerKeys}), which is a
 * {@link xdr.SorobanTransactionData} instance that contains fee data & resource
 * usage as part of {@link xdr.SorobanTransactionData}.
 *
 * @function
 * @alias Operation.restoreFootprint
 *
 * @param {object} [opts] - an optional set of parameters
 * @param {string} [opts.source] - an optional source account
 *
 * @returns {xdr.Operation} a Bump Footprint Expiration operation
 *    (xdr.RestoreFootprintOp)
 */
export function restoreFootprint(opts = {}) {
  const op = new xdr.RestoreFootprintOp({ ext: new xdr.ExtensionPoint(0) });
  const opAttributes = {
    body: xdr.OperationBody.restoreFootprint(op)
  };
  this.setSourceAccount(opAttributes, opts ?? {});
  return new xdr.Operation(opAttributes);
}
