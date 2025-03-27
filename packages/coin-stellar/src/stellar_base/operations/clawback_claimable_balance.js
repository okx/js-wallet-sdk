import xdr from '../xdr';
import { validateClaimableBalanceId } from './claim_claimable_balance';

/**
 * Creates a clawback operation for a claimable balance.
 *
 * @function
 * @alias Operation.clawbackClaimableBalance
 * @param {object} opts - Options object
 * @param {string} opts.balanceId - The claimable balance ID to be clawed back.
 * @param {string} [opts.source] - The source account for the operation. Defaults to the transaction's source account.
 *
 * @return {xdr.ClawbackClaimableBalanceOp}
 *
 * @example
 * const op = Operation.clawbackClaimableBalance({
 *   balanceId: '00000000da0d57da7d4850e7fc10d2a9d0ebc731f7afb40574c03395b17d49149b91f5be',
 * });
 *
 * @link https://github.com/stellar/stellar-protocol/blob/master/core/cap-0035.md#clawback-claimable-balance-operation
 */
export function clawbackClaimableBalance(opts = {}) {
  validateClaimableBalanceId(opts.balanceId);

  const attributes = {
    balanceId: xdr.ClaimableBalanceId.fromXDR(opts.balanceId, 'hex')
  };

  const opAttributes = {
    body: xdr.OperationBody.clawbackClaimableBalance(
      new xdr.ClawbackClaimableBalanceOp(attributes)
    )
  };
  this.setSourceAccount(opAttributes, opts);

  return new xdr.Operation(opAttributes);
}
