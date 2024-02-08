/**
 * The following methods are based on `osmojs-beta-testing`, thanks for their work
 * https://github.com/pyramation/osmojs-beta-testing
 */
import { AminoMsg } from "../amino/aminotypes";
import {
  MsgExitPool,
  MsgExitSwapExternAmountOut,
  MsgExitSwapShareAmountIn,
  MsgJoinPool,
  MsgJoinSwapExternAmountIn,
  MsgJoinSwapShareAmountOut,
  MsgSwapExactAmountIn,
  MsgSwapExactAmountOut,
} from "./gamm/v1beta1/tx";
import { Long } from "@okxweb3/crypto-lib";

export interface AminoMsgJoinPool extends AminoMsg {
  type: "osmosis/gamm/join-pool";
  value: {
    sender: string;
    pool_id: string;
    share_out_amount: string;
    token_in_maxs: {
      denom: string;
      amount: string;
    }[];
  };
}
export interface AminoMsgExitPool extends AminoMsg {
  type: "osmosis/gamm/exit-pool";
  value: {
    sender: string;
    pool_id: string;
    share_in_amount: string;
    token_out_mins: {
      denom: string;
      amount: string;
    }[];
  };
}
export interface AminoMsgSwapExactAmountIn extends AminoMsg {
  type: "osmosis/gamm/swap-exact-amount-in";
  value: {
    sender: string;
    routes: {
      pool_id: string;
      token_out_denom: string;
    }[];
    token_in: {
      denom: string;
      amount: string;
    };
    token_out_min_amount: string;
  };
}
export interface AminoMsgSwapExactAmountOut extends AminoMsg {
  type: "osmosis/gamm/swap-exact-amount-out";
  value: {
    sender: string;
    routes: {
      pool_id: string;
      token_in_denom: string;
    }[];
    token_in_max_amount: string;
    token_out: {
      denom: string;
      amount: string;
    };
  };
}
export interface AminoMsgJoinSwapExternAmountIn extends AminoMsg {
  type: "osmosis/gamm/join-swap-extern-amount-in";
  value: {
    sender: string;
    pool_id: string;
    token_in: {
      denom: string;
      amount: string;
    };
    share_out_min_amount: string;
  };
}
export interface AminoMsgJoinSwapShareAmountOut extends AminoMsg {
  type: "osmosis/gamm/join-swap-share-amount-out";
  value: {
    sender: string;
    pool_id: string;
    token_in_denom: string;
    share_out_amount: string;
    token_in_max_amount: string;
  };
}
export interface AminoMsgExitSwapExternAmountOut extends AminoMsg {
  type: "osmosis/gamm/exit-swap-extern-amount-out";
  value: {
    sender: string;
    pool_id: string;
    token_out: {
      denom: string;
      amount: string;
    };
    share_in_max_amount: string;
  };
}
export interface AminoMsgExitSwapShareAmountIn extends AminoMsg {
  type: "osmosis/gamm/exit-swap-share-amount-in";
  value: {
    sender: string;
    pool_id: string;
    token_out_denom: string;
    share_in_amount: string;
    token_out_min_amount: string;
  };
}
export const GammAminoConverters = {
  "/osmosis.gamm.v1beta1.MsgJoinPool": {
    aminoType: "osmosis/gamm/join-pool",
    toAmino: ({
      sender,
      poolId,
      shareOutAmount,
      tokenInMaxs,
    }: MsgJoinPool): AminoMsgJoinPool["value"] => {
      return {
        sender,
        pool_id: poolId.toString(),
        share_out_amount: shareOutAmount,
        token_in_maxs: tokenInMaxs.map((el0) => ({
          denom: el0.denom,
          amount: el0.amount,
        })),
      };
    },
    fromAmino: ({
      sender,
      pool_id,
      share_out_amount,
      token_in_maxs,
    }: AminoMsgJoinPool["value"]): MsgJoinPool => {
      return {
        sender,
        poolId: Long.fromString(pool_id),
        shareOutAmount: share_out_amount,
        tokenInMaxs: token_in_maxs.map((el0) => ({
          denom: el0.denom,
          amount: el0.amount,
        })),
      };
    },
  },
  "/osmosis.gamm.v1beta1.MsgExitPool": {
    aminoType: "osmosis/gamm/exit-pool",
    toAmino: ({
      sender,
      poolId,
      shareInAmount,
      tokenOutMins,
    }: MsgExitPool): AminoMsgExitPool["value"] => {
      return {
        sender,
        pool_id: poolId.toString(),
        share_in_amount: shareInAmount,
        token_out_mins: tokenOutMins.map((el0) => ({
          denom: el0.denom,
          amount: el0.amount,
        })),
      };
    },
    fromAmino: ({
      sender,
      pool_id,
      share_in_amount,
      token_out_mins,
    }: AminoMsgExitPool["value"]): MsgExitPool => {
      return {
        sender,
        poolId: Long.fromString(pool_id),
        shareInAmount: share_in_amount,
        tokenOutMins: token_out_mins.map((el0) => ({
          denom: el0.denom,
          amount: el0.amount,
        })),
      };
    },
  },
  "/osmosis.gamm.v1beta1.MsgSwapExactAmountIn": {
    aminoType: "osmosis/gamm/swap-exact-amount-in",
    toAmino: ({
      sender,
      routes,
      tokenIn,
      tokenOutMinAmount,
    }: MsgSwapExactAmountIn): AminoMsgSwapExactAmountIn["value"] => {
      return {
        sender,
        routes: routes.map((el0) => ({
          pool_id: el0.poolId.toString(),
          token_out_denom: el0.tokenOutDenom,
        })),
        token_in: {
          denom: tokenIn!.denom,
          amount: tokenIn!.amount,
        },
        token_out_min_amount: tokenOutMinAmount,
      };
    },
    fromAmino: ({
      sender,
      routes,
      token_in,
      token_out_min_amount,
    }: AminoMsgSwapExactAmountIn["value"]): MsgSwapExactAmountIn => {
      return {
        sender,
        routes: routes.map((el0) => ({
          poolId: Long.fromString(el0.pool_id),
          tokenOutDenom: el0.token_out_denom,
        })),
        tokenIn: {
          denom: token_in.denom,
          amount: token_in.amount,
        },
        tokenOutMinAmount: token_out_min_amount,
      };
    },
  },
  "/osmosis.gamm.v1beta1.MsgSwapExactAmountOut": {
    aminoType: "osmosis/gamm/swap-exact-amount-out",
    toAmino: ({
      sender,
      routes,
      tokenInMaxAmount,
      tokenOut,
    }: MsgSwapExactAmountOut): AminoMsgSwapExactAmountOut["value"] => {
      return {
        sender,
        routes: routes.map((el0) => ({
          pool_id: el0.poolId.toString(),
          token_in_denom: el0.tokenInDenom,
        })),
        token_in_max_amount: tokenInMaxAmount,
        token_out: {
          denom: tokenOut!.denom,
          amount: tokenOut!.amount,
        },
      };
    },
    fromAmino: ({
      sender,
      routes,
      token_in_max_amount,
      token_out,
    }: AminoMsgSwapExactAmountOut["value"]): MsgSwapExactAmountOut => {
      return {
        sender,
        routes: routes.map((el0) => ({
          poolId: Long.fromString(el0.pool_id),
          tokenInDenom: el0.token_in_denom,
        })),
        tokenInMaxAmount: token_in_max_amount,
        tokenOut: {
          denom: token_out.denom,
          amount: token_out.amount,
        },
      };
    },
  },
  "/osmosis.gamm.v1beta1.MsgJoinSwapExternAmountIn": {
    aminoType: "osmosis/gamm/join-swap-extern-amount-in",
    toAmino: ({
      sender,
      poolId,
      tokenIn,
      shareOutMinAmount,
    }: MsgJoinSwapExternAmountIn): AminoMsgJoinSwapExternAmountIn["value"] => {
      return {
        sender,
        pool_id: poolId.toString(),
        token_in: {
          denom: tokenIn!.denom,
          amount: tokenIn!.amount,
        },
        share_out_min_amount: shareOutMinAmount,
      };
    },
    fromAmino: ({
      sender,
      pool_id,
      token_in,
      share_out_min_amount,
    }: AminoMsgJoinSwapExternAmountIn["value"]): MsgJoinSwapExternAmountIn => {
      return {
        sender,
        poolId: Long.fromString(pool_id),
        tokenIn: {
          denom: token_in.denom,
          amount: token_in.amount,
        },
        shareOutMinAmount: share_out_min_amount,
      };
    },
  },
  "/osmosis.gamm.v1beta1.MsgJoinSwapShareAmountOut": {
    aminoType: "osmosis/gamm/join-swap-share-amount-out",
    toAmino: ({
      sender,
      poolId,
      tokenInDenom,
      shareOutAmount,
      tokenInMaxAmount,
    }: MsgJoinSwapShareAmountOut): AminoMsgJoinSwapShareAmountOut["value"] => {
      return {
        sender,
        pool_id: poolId.toString(),
        token_in_denom: tokenInDenom,
        share_out_amount: shareOutAmount,
        token_in_max_amount: tokenInMaxAmount,
      };
    },
    fromAmino: ({
      sender,
      pool_id,
      token_in_denom,
      share_out_amount,
      token_in_max_amount,
    }: AminoMsgJoinSwapShareAmountOut["value"]): MsgJoinSwapShareAmountOut => {
      return {
        sender,
        poolId: Long.fromString(pool_id),
        tokenInDenom: token_in_denom,
        shareOutAmount: share_out_amount,
        tokenInMaxAmount: token_in_max_amount,
      };
    },
  },
  "/osmosis.gamm.v1beta1.MsgExitSwapExternAmountOut": {
    aminoType: "osmosis/gamm/exit-swap-extern-amount-out",
    toAmino: ({
      sender,
      poolId,
      tokenOut,
      shareInMaxAmount,
    }: MsgExitSwapExternAmountOut): AminoMsgExitSwapExternAmountOut["value"] => {
      return {
        sender,
        pool_id: poolId.toString(),
        token_out: {
          denom: tokenOut!.denom,
          amount: tokenOut!.amount,
        },
        share_in_max_amount: shareInMaxAmount,
      };
    },
    fromAmino: ({
      sender,
      pool_id,
      token_out,
      share_in_max_amount,
    }: AminoMsgExitSwapExternAmountOut["value"]): MsgExitSwapExternAmountOut => {
      return {
        sender,
        poolId: Long.fromString(pool_id),
        tokenOut: {
          denom: token_out.denom,
          amount: token_out.amount,
        },
        shareInMaxAmount: share_in_max_amount,
      };
    },
  },
  "/osmosis.gamm.v1beta1.MsgExitSwapShareAmountIn": {
    aminoType: "osmosis/gamm/exit-swap-share-amount-in",
    toAmino: ({
      sender,
      poolId,
      tokenOutDenom,
      shareInAmount,
      tokenOutMinAmount,
    }: MsgExitSwapShareAmountIn): AminoMsgExitSwapShareAmountIn["value"] => {
      return {
        sender,
        pool_id: poolId.toString(),
        token_out_denom: tokenOutDenom,
        share_in_amount: shareInAmount,
        token_out_min_amount: tokenOutMinAmount,
      };
    },
    fromAmino: ({
      sender,
      pool_id,
      token_out_denom,
      share_in_amount,
      token_out_min_amount,
    }: AminoMsgExitSwapShareAmountIn["value"]): MsgExitSwapShareAmountIn => {
      return {
        sender,
        poolId: Long.fromString(pool_id),
        tokenOutDenom: token_out_denom,
        shareInAmount: share_in_amount,
        tokenOutMinAmount: token_out_min_amount,
      };
    },
  },
};
