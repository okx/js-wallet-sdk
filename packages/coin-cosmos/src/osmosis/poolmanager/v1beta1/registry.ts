/**
 * The following methods are based on `osmojs-beta-testing`, thanks for their work
 * https://github.com/osmosis-labs/osmosis-frontend
 */

import { GeneratedType } from '../../../registry';

import {
  MsgSetDenomPairTakerFee,
  MsgSplitRouteSwapExactAmountIn,
  MsgSplitRouteSwapExactAmountOut,
  MsgSwapExactAmountIn,
  MsgSwapExactAmountOut,
} from "./tx";

export const PoolRegistry: ReadonlyArray<[string, GeneratedType]> = [
  ["/osmosis.poolmanager.v1beta1.MsgSwapExactAmountIn", MsgSwapExactAmountIn],
  ["/osmosis.poolmanager.v1beta1.MsgSwapExactAmountOut", MsgSwapExactAmountOut],
  [
    "/osmosis.poolmanager.v1beta1.MsgSplitRouteSwapExactAmountIn",
    MsgSplitRouteSwapExactAmountIn,
  ],
  [
    "/osmosis.poolmanager.v1beta1.MsgSplitRouteSwapExactAmountOut",
    MsgSplitRouteSwapExactAmountOut,
  ],
  [
    "/osmosis.poolmanager.v1beta1.MsgSetDenomPairTakerFee",
    MsgSetDenomPairTakerFee,
  ],
];