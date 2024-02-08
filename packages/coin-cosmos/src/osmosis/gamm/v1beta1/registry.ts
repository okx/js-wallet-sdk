/**
 * The following methods are based on `osmojs-beta-testing`, thanks for their work
 * https://github.com/osmosis-labs/osmosis-frontend
 */

import { GeneratedType } from "../../../registry";
import {
  MsgExitPool,
  MsgExitSwapExternAmountOut,
  MsgExitSwapShareAmountIn,
  MsgJoinPool,
  MsgJoinSwapExternAmountIn,
  MsgJoinSwapShareAmountOut,
  MsgSwapExactAmountIn,
  MsgSwapExactAmountOut,
} from "./tx";

export const GammRegistry: ReadonlyArray<[string, GeneratedType]> = [
  ["/osmosis.gamm.v1beta1.MsgJoinPool", MsgJoinPool],
  ["/osmosis.gamm.v1beta1.MsgExitPool", MsgExitPool],
  ["/osmosis.gamm.v1beta1.MsgSwapExactAmountIn", MsgSwapExactAmountIn],
  ["/osmosis.gamm.v1beta1.MsgSwapExactAmountOut", MsgSwapExactAmountOut],
  [
    "/osmosis.gamm.v1beta1.MsgJoinSwapExternAmountIn",
    MsgJoinSwapExternAmountIn,
  ],
  [
    "/osmosis.gamm.v1beta1.MsgJoinSwapShareAmountOut",
    MsgJoinSwapShareAmountOut,
  ],
  [
    "/osmosis.gamm.v1beta1.MsgExitSwapExternAmountOut",
    MsgExitSwapExternAmountOut,
  ],
  ["/osmosis.gamm.v1beta1.MsgExitSwapShareAmountIn", MsgExitSwapShareAmountIn],
];
