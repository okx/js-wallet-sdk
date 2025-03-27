import xdr from './xdr';
import { Asset } from './asset';
import { hash } from './hashing';

// LiquidityPoolFeeV18 is the default liquidity pool fee in protocol v18. It defaults to 30 base points (0.3%).
export const LiquidityPoolFeeV18 = 30;

/**
 * getLiquidityPoolId computes the Pool ID for the given assets, fee and pool type.
 *
 * @see [stellar-core getPoolID](https://github.com/stellar/stellar-core/blob/9f3a48c6a8f1aa77b6043a055d0638661f718080/src/ledger/test/LedgerTxnTests.cpp#L3746-L3751)
 *
 * @export
 * @param {string} liquidityPoolType – A string representing the liquidity pool type.
 * @param {object} liquidityPoolParameters        – The liquidity pool parameters.
 * @param {Asset}  liquidityPoolParameters.assetA – The first asset in the Pool, it must respect the rule assetA < assetB.
 * @param {Asset}  liquidityPoolParameters.assetB – The second asset in the Pool, it must respect the rule assetA < assetB.
 * @param {number} liquidityPoolParameters.fee    – The liquidity pool fee. For now the only fee supported is `30`.
 *
 * @return {Buffer} the raw Pool ID buffer, which can be stringfied with `toString('hex')`
 */
export function getLiquidityPoolId(
  liquidityPoolType,
  liquidityPoolParameters = {}
) {
  if (liquidityPoolType !== 'constant_product') {
    throw new Error('liquidityPoolType is invalid');
  }

  const { assetA, assetB, fee } = liquidityPoolParameters;
  if (!assetA || !(assetA instanceof Asset)) {
    throw new Error('assetA is invalid');
  }
  if (!assetB || !(assetB instanceof Asset)) {
    throw new Error('assetB is invalid');
  }
  if (!fee || fee !== LiquidityPoolFeeV18) {
    throw new Error('fee is invalid');
  }

  if (Asset.compare(assetA, assetB) !== -1) {
    throw new Error('Assets are not in lexicographic order');
  }

  const lpTypeData =
    xdr.LiquidityPoolType.liquidityPoolConstantProduct().toXDR();
  const lpParamsData = new xdr.LiquidityPoolConstantProductParameters({
    assetA: assetA.toXDRObject(),
    assetB: assetB.toXDRObject(),
    fee
  }).toXDR();
  const payload = Buffer.concat([lpTypeData, lpParamsData]);
  return hash(payload);
}
