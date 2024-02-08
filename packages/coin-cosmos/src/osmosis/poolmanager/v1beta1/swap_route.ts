/**
 * The following methods are based on `osmojs-beta-testing`, thanks for their work
 * https://github.com/osmosis-labs/osmosis-frontend
 */

import { _m0, Long } from '@okxweb3/crypto-lib';

export interface SwapAmountInRoute {
  poolId: Long;
  tokenOutDenom: string;
}
export interface SwapAmountInRouteProtoMsg {
  typeUrl: "/osmosis.poolmanager.v1beta1.SwapAmountInRoute";
  value: Uint8Array;
}
export interface SwapAmountInRouteAmino {
  pool_id: string;
  token_out_denom: string;
}
export interface SwapAmountInRouteAminoMsg {
  type: "osmosis/poolmanager/swap-amount-in-route";
  value: SwapAmountInRouteAmino;
}
export interface SwapAmountInRouteSDKType {
  pool_id: Long;
  token_out_denom: string;
}
export interface SwapAmountOutRoute {
  poolId: Long;
  tokenInDenom: string;
}
export interface SwapAmountOutRouteProtoMsg {
  typeUrl: "/osmosis.poolmanager.v1beta1.SwapAmountOutRoute";
  value: Uint8Array;
}
export interface SwapAmountOutRouteAmino {
  pool_id: string;
  token_in_denom: string;
}
export interface SwapAmountOutRouteAminoMsg {
  type: "osmosis/poolmanager/swap-amount-out-route";
  value: SwapAmountOutRouteAmino;
}
export interface SwapAmountOutRouteSDKType {
  pool_id: Long;
  token_in_denom: string;
}
export interface SwapAmountInSplitRoute {
  pools: SwapAmountInRoute[];
  tokenInAmount: string;
}
export interface SwapAmountInSplitRouteProtoMsg {
  typeUrl: "/osmosis.poolmanager.v1beta1.SwapAmountInSplitRoute";
  value: Uint8Array;
}
export interface SwapAmountInSplitRouteAmino {
  pools: SwapAmountInRouteAmino[];
  token_in_amount: string;
}
export interface SwapAmountInSplitRouteAminoMsg {
  type: "osmosis/poolmanager/swap-amount-in-split-route";
  value: SwapAmountInSplitRouteAmino;
}
export interface SwapAmountInSplitRouteSDKType {
  pools: SwapAmountInRouteSDKType[];
  token_in_amount: string;
}
export interface SwapAmountOutSplitRoute {
  pools: SwapAmountOutRoute[];
  tokenOutAmount: string;
}
export interface SwapAmountOutSplitRouteProtoMsg {
  typeUrl: "/osmosis.poolmanager.v1beta1.SwapAmountOutSplitRoute";
  value: Uint8Array;
}
export interface SwapAmountOutSplitRouteAmino {
  pools: SwapAmountOutRouteAmino[];
  token_out_amount: string;
}
export interface SwapAmountOutSplitRouteAminoMsg {
  type: "osmosis/poolmanager/swap-amount-out-split-route";
  value: SwapAmountOutSplitRouteAmino;
}
export interface SwapAmountOutSplitRouteSDKType {
  pools: SwapAmountOutRouteSDKType[];
  token_out_amount: string;
}
function createBaseSwapAmountInRoute(): SwapAmountInRoute {
  return {
    poolId: Long.UZERO,
    tokenOutDenom: "",
  };
}
export const SwapAmountInRoute = {
  typeUrl: "/osmosis.poolmanager.v1beta1.SwapAmountInRoute",
  encode(
    message: SwapAmountInRoute,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (!message.poolId.isZero()) {
      writer.uint32(8).uint64(message.poolId);
    }
    if (message.tokenOutDenom !== "") {
      writer.uint32(18).string(message.tokenOutDenom);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): SwapAmountInRoute {
    const reader =
      input instanceof _m0.Reader ? input : new _m0.Reader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSwapAmountInRoute();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.poolId = (reader.uint64() as Long);
          break;
        case 2:
          message.tokenOutDenom = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<SwapAmountInRoute>): SwapAmountInRoute {
    const message = createBaseSwapAmountInRoute();
    message.poolId =
      object.poolId !== undefined && object.poolId !== null
        ? Long.fromValue(object.poolId.toString())
        : Long.UZERO;
    message.tokenOutDenom = object.tokenOutDenom ?? "";
    return message;
  },
  fromAmino(object: SwapAmountInRouteAmino): SwapAmountInRoute {
    return {
      poolId: Long.fromValue(object.pool_id),
      tokenOutDenom: object.token_out_denom,
    };
  },
  toAmino(message: SwapAmountInRoute): SwapAmountInRouteAmino {
    const obj: any = {};
    obj.pool_id = message.poolId ? message.poolId.toString() : undefined;
    obj.token_out_denom = message.tokenOutDenom;
    return obj;
  },
  fromAminoMsg(object: SwapAmountInRouteAminoMsg): SwapAmountInRoute {
    return SwapAmountInRoute.fromAmino(object.value);
  },
  toAminoMsg(message: SwapAmountInRoute): SwapAmountInRouteAminoMsg {
    return {
      type: "osmosis/poolmanager/swap-amount-in-route",
      value: SwapAmountInRoute.toAmino(message),
    };
  },
  fromProtoMsg(message: SwapAmountInRouteProtoMsg): SwapAmountInRoute {
    return SwapAmountInRoute.decode(message.value);
  },
  toProto(message: SwapAmountInRoute): Uint8Array {
    return SwapAmountInRoute.encode(message).finish();
  },
  toProtoMsg(message: SwapAmountInRoute): SwapAmountInRouteProtoMsg {
    return {
      typeUrl: "/osmosis.poolmanager.v1beta1.SwapAmountInRoute",
      value: SwapAmountInRoute.encode(message).finish(),
    };
  },
};
function createBaseSwapAmountOutRoute(): SwapAmountOutRoute {
  return {
    poolId: Long.UZERO,
    tokenInDenom: "",
  };
}
export const SwapAmountOutRoute = {
  typeUrl: "/osmosis.poolmanager.v1beta1.SwapAmountOutRoute",
  encode(
    message: SwapAmountOutRoute,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (!message.poolId.isZero()) {
      writer.uint32(8).uint64(message.poolId);
    }
    if (message.tokenInDenom !== "") {
      writer.uint32(18).string(message.tokenInDenom);
    }
    return writer;
  },
  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): SwapAmountOutRoute {
    const reader =
      input instanceof _m0.Reader ? input : new _m0.Reader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSwapAmountOutRoute();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.poolId = (reader.uint64() as Long);
          break;
        case 2:
          message.tokenInDenom = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<SwapAmountOutRoute>): SwapAmountOutRoute {
    const message = createBaseSwapAmountOutRoute();
    message.poolId =
      object.poolId !== undefined && object.poolId !== null
        ? Long.fromValue(object.poolId.toString())
        : Long.UZERO;
    message.tokenInDenom = object.tokenInDenom ?? "";
    return message;
  },
  fromAmino(object: SwapAmountOutRouteAmino): SwapAmountOutRoute {
    return {
      poolId: Long.fromValue(object.pool_id),
      tokenInDenom: object.token_in_denom,
    };
  },
  toAmino(message: SwapAmountOutRoute): SwapAmountOutRouteAmino {
    const obj: any = {};
    obj.pool_id = message.poolId ? message.poolId.toString() : undefined;
    obj.token_in_denom = message.tokenInDenom;
    return obj;
  },
  fromAminoMsg(object: SwapAmountOutRouteAminoMsg): SwapAmountOutRoute {
    return SwapAmountOutRoute.fromAmino(object.value);
  },
  toAminoMsg(message: SwapAmountOutRoute): SwapAmountOutRouteAminoMsg {
    return {
      type: "osmosis/poolmanager/swap-amount-out-route",
      value: SwapAmountOutRoute.toAmino(message),
    };
  },
  fromProtoMsg(message: SwapAmountOutRouteProtoMsg): SwapAmountOutRoute {
    return SwapAmountOutRoute.decode(message.value);
  },
  toProto(message: SwapAmountOutRoute): Uint8Array {
    return SwapAmountOutRoute.encode(message).finish();
  },
  toProtoMsg(message: SwapAmountOutRoute): SwapAmountOutRouteProtoMsg {
    return {
      typeUrl: "/osmosis.poolmanager.v1beta1.SwapAmountOutRoute",
      value: SwapAmountOutRoute.encode(message).finish(),
    };
  },
};
function createBaseSwapAmountInSplitRoute(): SwapAmountInSplitRoute {
  return {
    pools: [],
    tokenInAmount: "",
  };
}
export const SwapAmountInSplitRoute = {
  typeUrl: "/osmosis.poolmanager.v1beta1.SwapAmountInSplitRoute",
  encode(
    message: SwapAmountInSplitRoute,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    for (const v of message.pools) {
      SwapAmountInRoute.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.tokenInAmount !== "") {
      writer.uint32(18).string(message.tokenInAmount);
    }
    return writer;
  },
  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): SwapAmountInSplitRoute {
    const reader =
      input instanceof _m0.Reader ? input : new _m0.Reader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSwapAmountInSplitRoute();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.pools.push(SwapAmountInRoute.decode(reader, reader.uint32()));
          break;
        case 2:
          message.tokenInAmount = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<SwapAmountInSplitRoute>): SwapAmountInSplitRoute {
    const message = createBaseSwapAmountInSplitRoute();
    message.pools =
      object.pools?.map((e) => SwapAmountInRoute.fromPartial(e)) || [];
    message.tokenInAmount = object.tokenInAmount ?? "";
    return message;
  },
  fromAmino(object: SwapAmountInSplitRouteAmino): SwapAmountInSplitRoute {
    return {
      pools: Array.isArray(object?.pools)
        ? object.pools.map((e: any) => SwapAmountInRoute.fromAmino(e))
        : [],
      tokenInAmount: object.token_in_amount,
    };
  },
  toAmino(message: SwapAmountInSplitRoute): SwapAmountInSplitRouteAmino {
    const obj: any = {};
    if (message.pools) {
      obj.pools = message.pools.map((e) =>
        e ? SwapAmountInRoute.toAmino(e) : undefined
      );
    } else {
      obj.pools = [];
    }
    obj.token_in_amount = message.tokenInAmount;
    return obj;
  },
  fromAminoMsg(object: SwapAmountInSplitRouteAminoMsg): SwapAmountInSplitRoute {
    return SwapAmountInSplitRoute.fromAmino(object.value);
  },
  toAminoMsg(message: SwapAmountInSplitRoute): SwapAmountInSplitRouteAminoMsg {
    return {
      type: "osmosis/poolmanager/swap-amount-in-split-route",
      value: SwapAmountInSplitRoute.toAmino(message),
    };
  },
  fromProtoMsg(
    message: SwapAmountInSplitRouteProtoMsg
  ): SwapAmountInSplitRoute {
    return SwapAmountInSplitRoute.decode(message.value);
  },
  toProto(message: SwapAmountInSplitRoute): Uint8Array {
    return SwapAmountInSplitRoute.encode(message).finish();
  },
  toProtoMsg(message: SwapAmountInSplitRoute): SwapAmountInSplitRouteProtoMsg {
    return {
      typeUrl: "/osmosis.poolmanager.v1beta1.SwapAmountInSplitRoute",
      value: SwapAmountInSplitRoute.encode(message).finish(),
    };
  },
};
function createBaseSwapAmountOutSplitRoute(): SwapAmountOutSplitRoute {
  return {
    pools: [],
    tokenOutAmount: "",
  };
}
export const SwapAmountOutSplitRoute = {
  typeUrl: "/osmosis.poolmanager.v1beta1.SwapAmountOutSplitRoute",
  encode(
    message: SwapAmountOutSplitRoute,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    for (const v of message.pools) {
      SwapAmountOutRoute.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.tokenOutAmount !== "") {
      writer.uint32(18).string(message.tokenOutAmount);
    }
    return writer;
  },
  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): SwapAmountOutSplitRoute {
    const reader =
      input instanceof _m0.Reader ? input : new _m0.Reader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSwapAmountOutSplitRoute();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.pools.push(
            SwapAmountOutRoute.decode(reader, reader.uint32())
          );
          break;
        case 2:
          message.tokenOutAmount = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(
    object: Partial<SwapAmountOutSplitRoute>
  ): SwapAmountOutSplitRoute {
    const message = createBaseSwapAmountOutSplitRoute();
    message.pools =
      object.pools?.map((e) => SwapAmountOutRoute.fromPartial(e)) || [];
    message.tokenOutAmount = object.tokenOutAmount ?? "";
    return message;
  },
  fromAmino(object: SwapAmountOutSplitRouteAmino): SwapAmountOutSplitRoute {
    return {
      pools: Array.isArray(object?.pools)
        ? object.pools.map((e: any) => SwapAmountOutRoute.fromAmino(e))
        : [],
      tokenOutAmount: object.token_out_amount,
    };
  },
  toAmino(message: SwapAmountOutSplitRoute): SwapAmountOutSplitRouteAmino {
    const obj: any = {};
    if (message.pools) {
      obj.pools = message.pools.map((e) =>
        e ? SwapAmountOutRoute.toAmino(e) : undefined
      );
    } else {
      obj.pools = [];
    }
    obj.token_out_amount = message.tokenOutAmount;
    return obj;
  },
  fromAminoMsg(
    object: SwapAmountOutSplitRouteAminoMsg
  ): SwapAmountOutSplitRoute {
    return SwapAmountOutSplitRoute.fromAmino(object.value);
  },
  toAminoMsg(
    message: SwapAmountOutSplitRoute
  ): SwapAmountOutSplitRouteAminoMsg {
    return {
      type: "osmosis/poolmanager/swap-amount-out-split-route",
      value: SwapAmountOutSplitRoute.toAmino(message),
    };
  },
  fromProtoMsg(
    message: SwapAmountOutSplitRouteProtoMsg
  ): SwapAmountOutSplitRoute {
    return SwapAmountOutSplitRoute.decode(message.value);
  },
  toProto(message: SwapAmountOutSplitRoute): Uint8Array {
    return SwapAmountOutSplitRoute.encode(message).finish();
  },
  toProtoMsg(
    message: SwapAmountOutSplitRoute
  ): SwapAmountOutSplitRouteProtoMsg {
    return {
      typeUrl: "/osmosis.poolmanager.v1beta1.SwapAmountOutSplitRoute",
      value: SwapAmountOutSplitRoute.encode(message).finish(),
    };
  },
};
