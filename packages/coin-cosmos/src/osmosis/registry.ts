import { GeneratedType } from '../registry';
import { TelescopeGeneratedCodec } from "../types";
import * as gamm from './gamm/v1beta1/tx';
import * as pm from "./poolmanager/v1beta1/tx";
import * as tf from "./tokenfactory/v1beta1/tx";
import * as lu from "./lockup/tx";
import * as sf from "./superfluid/tx";

export const OsmosisRegistry: ReadonlyArray<[string, GeneratedType]> = [
  ["/osmosis.gamm.v1beta1.MsgJoinPool", gamm.MsgJoinPool],
  ["/osmosis.gamm.v1beta1.MsgExitPool", gamm.MsgExitPool],
  ["/osmosis.gamm.v1beta1.MsgSwapExactAmountIn", gamm.MsgSwapExactAmountIn],
  ["/osmosis.gamm.v1beta1.MsgSwapExactAmountOut", gamm.MsgSwapExactAmountOut],
  ["/osmosis.gamm.v1beta1.MsgJoinSwapExternAmountIn", gamm.MsgJoinSwapExternAmountIn],
  ["/osmosis.gamm.v1beta1.MsgJoinSwapShareAmountOut", gamm.MsgJoinSwapShareAmountOut],
  ["/osmosis.gamm.v1beta1.MsgExitSwapExternAmountOut", gamm.MsgExitSwapExternAmountOut],
  ["/osmosis.gamm.v1beta1.MsgExitSwapShareAmountIn", gamm.MsgExitSwapShareAmountIn],
  ["/osmosis.poolmanager.v1beta1.MsgSwapExactAmountIn", pm.MsgSwapExactAmountIn as TelescopeGeneratedCodec],
  ["/osmosis.poolmanager.v1beta1.MsgSwapExactAmountOut", pm.MsgSwapExactAmountOut as TelescopeGeneratedCodec],
  ["/osmosis.poolmanager.v1beta1.MsgSplitRouteSwapExactAmountIn", pm.MsgSplitRouteSwapExactAmountIn as TelescopeGeneratedCodec],
  ["/osmosis.poolmanager.v1beta1.MsgSplitRouteSwapExactAmountOut", pm.MsgSplitRouteSwapExactAmountOut as TelescopeGeneratedCodec],
  ["/osmosis.poolmanager.v1beta1.MsgSetDenomPairTakerFee", pm.MsgSetDenomPairTakerFee as TelescopeGeneratedCodec],
  ["/osmosis.lockup.MsgLockTokens", lu.MsgLockTokens as TelescopeGeneratedCodec],
  ["/osmosis.lockup.MsgBeginUnlockingAll", lu.MsgBeginUnlockingAll as TelescopeGeneratedCodec],
  ["/osmosis.lockup.MsgBeginUnlocking", lu.MsgBeginUnlocking as TelescopeGeneratedCodec],
  ["/osmosis.lockup.MsgExtendLockup", lu.MsgExtendLockup as TelescopeGeneratedCodec],
  ["/osmosis.lockup.MsgForceUnlock", lu.MsgForceUnlock as TelescopeGeneratedCodec],
  ["/osmosis.lockup.MsgSetRewardReceiverAddress", lu.MsgSetRewardReceiverAddress as TelescopeGeneratedCodec],
  ["/osmosis.superfluid.MsgSuperfluidDelegate", sf.MsgSuperfluidDelegate as TelescopeGeneratedCodec],
  ["/osmosis.superfluid.MsgSuperfluidUndelegate", sf.MsgSuperfluidUndelegate as TelescopeGeneratedCodec],
  ["/osmosis.superfluid.MsgSuperfluidUnbondLock", sf.MsgSuperfluidUnbondLock as TelescopeGeneratedCodec],
  ["/osmosis.superfluid.MsgSuperfluidUndelegateAndUnbondLock", sf.MsgSuperfluidUndelegateAndUnbondLock as TelescopeGeneratedCodec],
  ["/osmosis.superfluid.MsgLockAndSuperfluidDelegate", sf.MsgLockAndSuperfluidDelegate as TelescopeGeneratedCodec],
  ["/osmosis.superfluid.MsgCreateFullRangePositionAndSuperfluidDelegate", sf.MsgCreateFullRangePositionAndSuperfluidDelegate as TelescopeGeneratedCodec],
  ["/osmosis.superfluid.MsgUnPoolWhitelistedPool", sf.MsgUnPoolWhitelistedPool as TelescopeGeneratedCodec],
  ["/osmosis.superfluid.MsgUnlockAndMigrateSharesToFullRangeConcentratedPosition", sf.MsgUnlockAndMigrateSharesToFullRangeConcentratedPosition as TelescopeGeneratedCodec],
  ["/osmosis.superfluid.MsgAddToConcentratedLiquiditySuperfluidPosition", sf.MsgAddToConcentratedLiquiditySuperfluidPosition as TelescopeGeneratedCodec],
  ["/osmosis.superfluid.MsgUnbondConvertAndStake", sf.MsgUnbondConvertAndStake as TelescopeGeneratedCodec],
  ["/osmosis.tokenfactory.v1beta1.MsgCreateDenom", tf.MsgCreateDenom as TelescopeGeneratedCodec],
  ["/osmosis.tokenfactory.v1beta1.MsgMint", tf.MsgMint as TelescopeGeneratedCodec],
  ["/osmosis.tokenfactory.v1beta1.MsgBurn", tf.MsgBurn as TelescopeGeneratedCodec],
  ["/osmosis.tokenfactory.v1beta1.MsgChangeAdmin", tf.MsgChangeAdmin as TelescopeGeneratedCodec],
  ["/osmosis.tokenfactory.v1beta1.MsgSetDenomMetadata", tf.MsgSetDenomMetadata as TelescopeGeneratedCodec],
  ["/osmosis.tokenfactory.v1beta1.MsgSetBeforeSendHook", tf.MsgSetBeforeSendHook as TelescopeGeneratedCodec],
  ["/osmosis.tokenfactory.v1beta1.MsgForceTransfer", tf.MsgForceTransfer as TelescopeGeneratedCodec]
];