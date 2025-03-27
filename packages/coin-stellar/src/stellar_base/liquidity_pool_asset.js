import xdr from './xdr';
import { Asset } from './asset';
import {
  LiquidityPoolFeeV18,
  getLiquidityPoolId
} from './get_liquidity_pool_id';

/**
 * LiquidityPoolAsset class represents a liquidity pool trustline change.
 *
 * @constructor
 * @param {Asset} assetA – The first asset in the Pool, it must respect the rule assetA < assetB. See {@link Asset.compare} for more details on how assets are sorted.
 * @param {Asset} assetB – The second asset in the Pool, it must respect the rule assetA < assetB. See {@link Asset.compare} for more details on how assets are sorted.
 * @param {number} fee – The liquidity pool fee. For now the only fee supported is `30`.
 */
export class LiquidityPoolAsset {
  constructor(assetA, assetB, fee) {
    if (!assetA || !(assetA instanceof Asset)) {
      throw new Error('assetA is invalid');
    }
    if (!assetB || !(assetB instanceof Asset)) {
      throw new Error('assetB is invalid');
    }
    if (Asset.compare(assetA, assetB) !== -1) {
      throw new Error('Assets are not in lexicographic order');
    }
    if (!fee || fee !== LiquidityPoolFeeV18) {
      throw new Error('fee is invalid');
    }

    this.assetA = assetA;
    this.assetB = assetB;
    this.fee = fee;
  }

  /**
   * Returns a liquidity pool asset object from its XDR ChangeTrustAsset object
   * representation.
   * @param {xdr.ChangeTrustAsset} ctAssetXdr - The asset XDR object.
   * @returns {LiquidityPoolAsset}
   */
  static fromOperation(ctAssetXdr) {
    const assetType = ctAssetXdr.switch();
    if (assetType === xdr.AssetType.assetTypePoolShare()) {
      const liquidityPoolParameters = ctAssetXdr
        .liquidityPool()
        .constantProduct();
      return new this(
        Asset.fromOperation(liquidityPoolParameters.assetA()),
        Asset.fromOperation(liquidityPoolParameters.assetB()),
        liquidityPoolParameters.fee()
      );
    }

    throw new Error(`Invalid asset type: ${assetType.name}`);
  }

  /**
   * Returns the `xdr.ChangeTrustAsset` object for this liquidity pool asset.
   *
   * Note: To convert from an {@link Asset `Asset`} to `xdr.ChangeTrustAsset`
   * please refer to the
   * {@link Asset.toChangeTrustXDRObject `Asset.toChangeTrustXDRObject`} method.
   *
   * @returns {xdr.ChangeTrustAsset} XDR ChangeTrustAsset object.
   */
  toXDRObject() {
    const lpConstantProductParamsXdr =
      new xdr.LiquidityPoolConstantProductParameters({
        assetA: this.assetA.toXDRObject(),
        assetB: this.assetB.toXDRObject(),
        fee: this.fee
      });
    const lpParamsXdr = new xdr.LiquidityPoolParameters(
      'liquidityPoolConstantProduct',
      lpConstantProductParamsXdr
    );
    return new xdr.ChangeTrustAsset('assetTypePoolShare', lpParamsXdr);
  }

  /**
   * @returns {LiquidityPoolParameters} Liquidity pool parameters.
   */
  getLiquidityPoolParameters() {
    return {
      ...this,
      assetA: this.assetA,
      assetB: this.assetB,
      fee: this.fee
    };
  }

  /**
   * @see [Assets concept](https://developers.stellar.org/docs/glossary/assets/)
   * @returns {AssetType.liquidityPoolShares} asset type. Can only be `liquidity_pool_shares`.
   */
  getAssetType() {
    return 'liquidity_pool_shares';
  }

  /**
   * @param {LiquidityPoolAsset} other the LiquidityPoolAsset to compare
   * @returns {boolean} `true` if this asset equals the given asset.
   */
  equals(other) {
    return (
      this.assetA.equals(other.assetA) &&
      this.assetB.equals(other.assetB) &&
      this.fee === other.fee
    );
  }

  toString() {
    const poolId = getLiquidityPoolId(
      'constant_product',
      this.getLiquidityPoolParameters()
    ).toString('hex');
    return `liquidity_pool:${poolId}`;
  }
}
