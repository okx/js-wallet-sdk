import xdr from './xdr';

/**
 * LiquidityPoolId class represents the asset referenced by a trustline to a
 * liquidity pool.
 *
 * @constructor
 * @param {string} liquidityPoolId - The ID of the liquidity pool in string 'hex'.
 */
export class LiquidityPoolId {
  constructor(liquidityPoolId) {
    if (!liquidityPoolId) {
      throw new Error('liquidityPoolId cannot be empty');
    }
    if (!/^[a-f0-9]{64}$/.test(liquidityPoolId)) {
      throw new Error('Liquidity pool ID is not a valid hash');
    }

    this.liquidityPoolId = liquidityPoolId;
  }

  /**
   * Returns a liquidity pool ID object from its xdr.TrustLineAsset representation.
   * @param {xdr.TrustLineAsset} tlAssetXdr - The asset XDR object.
   * @returns {LiquidityPoolId}
   */
  static fromOperation(tlAssetXdr) {
    const assetType = tlAssetXdr.switch();
    if (assetType === xdr.AssetType.assetTypePoolShare()) {
      const liquidityPoolId = tlAssetXdr.liquidityPoolId().toString('hex');
      return new this(liquidityPoolId);
    }

    throw new Error(`Invalid asset type: ${assetType.name}`);
  }

  /**
   * Returns the `xdr.TrustLineAsset` object for this liquidity pool ID.
   *
   * Note: To convert from {@link Asset `Asset`} to `xdr.TrustLineAsset` please
   * refer to the
   * {@link Asset.toTrustLineXDRObject `Asset.toTrustLineXDRObject`} method.
   *
   * @returns {xdr.TrustLineAsset} XDR LiquidityPoolId object
   */
  toXDRObject() {
    const xdrPoolId = xdr.PoolId.fromXDR(this.liquidityPoolId, 'hex');
    return new xdr.TrustLineAsset('assetTypePoolShare', xdrPoolId);
  }

  /**
   * @returns {string} Liquidity pool ID.
   */
  getLiquidityPoolId() {
    return String(this.liquidityPoolId);
  }

  /**
   * @see [Assets concept](https://developers.stellar.org/docs/glossary/assets/)
   * @returns {AssetType.liquidityPoolShares} asset type. Can only be `liquidity_pool_shares`.
   */
  getAssetType() {
    return 'liquidity_pool_shares';
  }

  /**
   * @param {LiquidityPoolId} asset LiquidityPoolId to compare.
   * @returns {boolean} `true` if this asset equals the given asset.
   */
  equals(asset) {
    return this.liquidityPoolId === asset.getLiquidityPoolId();
  }

  toString() {
    return `liquidity_pool:${this.liquidityPoolId}`;
  }
}
