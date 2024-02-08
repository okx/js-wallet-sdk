/**
 * The following methods are based on `osmojs-beta-testing`, thanks for their work
 * https://github.com/osmosis-labs/osmosis-frontend
 */

/**
 * ===================== MsgJoinPool
 * This is really MsgJoinPoolNoSwap
 */
import { _m0, Long } from "@okxweb3/crypto-lib";
import { Coin } from "../../../types/cosmos/base/v1beta1/coin";
import { isSet, DeepPartial } from "../../../types/cosmos/tx/v1beta1/tx";

export interface MsgJoinPool {
  sender: string;
  poolId: Long;
  shareOutAmount: string;
  tokenInMaxs: Coin[];
}
export interface MsgJoinPoolResponse {}

/** ===================== MsgExitPool */
export interface MsgExitPool {
  sender: string;
  poolId: Long;
  shareInAmount: string;
  tokenOutMins: Coin[];
}
export interface MsgExitPoolResponse {}

/** ===================== MsgSwapExactAmountIn */
export interface SwapAmountInRoute {
  poolId: Long;
  tokenOutDenom: string;
}
export interface MsgSwapExactAmountIn {
  sender: string;
  routes: SwapAmountInRoute[];
  tokenIn?: Coin;
  tokenOutMinAmount: string;
}
export interface MsgSwapExactAmountInResponse {
  tokenOutAmount: string;
}

/** ===================== MsgSwapExactAmountOut */
export interface SwapAmountOutRoute {
  poolId: Long;
  tokenInDenom: string;
}
export interface MsgSwapExactAmountOut {
  sender: string;
  routes: SwapAmountOutRoute[];
  tokenInMaxAmount: string;
  tokenOut?: Coin;
}
export interface MsgSwapExactAmountOutResponse {
  tokenInAmount: string;
}

/**
 * ===================== MsgJoinSwapExternAmountIn
 * TODO: Rename to MsgJoinSwapExactAmountIn
 */
export interface MsgJoinSwapExternAmountIn {
  sender: string;
  poolId: Long;
  tokenIn?: Coin;

  /**
   * reserved 3;
   * reserved "token_in";
   */
  shareOutMinAmount: string;
}
export interface MsgJoinSwapExternAmountInResponse {
  shareOutAmount: string;
}

/** ===================== MsgJoinSwapShareAmountOut */
export interface MsgJoinSwapShareAmountOut {
  sender: string;
  poolId: Long;
  tokenInDenom: string;
  shareOutAmount: string;
  tokenInMaxAmount: string;
}
export interface MsgJoinSwapShareAmountOutResponse {
  tokenInAmount: string;
}

/** ===================== MsgExitSwapShareAmountIn */
export interface MsgExitSwapShareAmountIn {
  sender: string;
  poolId: Long;
  tokenOutDenom: string;
  shareInAmount: string;
  tokenOutMinAmount: string;
}
export interface MsgExitSwapShareAmountInResponse {
  tokenOutAmount: string;
}

/** ===================== MsgExitSwapExternAmountOut */
export interface MsgExitSwapExternAmountOut {
  sender: string;
  poolId: Long;
  tokenOut?: Coin;
  shareInMaxAmount: string;
}
export interface MsgExitSwapExternAmountOutResponse {
  shareInAmount: string;
}

function createBaseMsgJoinPool(): MsgJoinPool {
  return {
    sender: "",
    poolId: Long.UZERO,
    shareOutAmount: "",
    tokenInMaxs: [],
  };
}

export const MsgJoinPool = {
  encode(
    message: MsgJoinPool,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.sender !== "") {
      writer.uint32(10).string(message.sender);
    }

    if (!message.poolId.isZero()) {
      writer.uint32(16).uint64(message.poolId);
    }

    if (message.shareOutAmount !== "") {
      writer.uint32(26).string(message.shareOutAmount);
    }

    for (const v of message.tokenInMaxs) {
      Coin.encode(v!, writer.uint32(34).fork()).ldelim();
    }

    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgJoinPool {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgJoinPool();

    while (reader.pos < end) {
      const tag = reader.uint32();

      switch (tag >>> 3) {
        case 1:
          message.sender = reader.string();
          break;

        case 2:
          message.poolId = reader.uint64() as Long;
          break;

        case 3:
          message.shareOutAmount = reader.string();
          break;

        case 4:
          message.tokenInMaxs.push(Coin.decode(reader, reader.uint32()));
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  },

  fromJSON(object: any): MsgJoinPool {
    return {
      sender: isSet(object.sender) ? String(object.sender) : "",
      poolId: isSet(object.poolId)
        ? Long.fromString(object.poolId)
        : Long.UZERO,
      shareOutAmount: isSet(object.shareOutAmount)
        ? String(object.shareOutAmount)
        : "",
      tokenInMaxs: Array.isArray(object?.tokenInMaxs)
        ? object.tokenInMaxs.map((e: any) => Coin.fromJSON(e))
        : [],
    };
  },

  toJSON(message: MsgJoinPool): unknown {
    const obj: any = {};
    message.sender !== undefined && (obj.sender = message.sender);
    message.poolId !== undefined &&
      (obj.poolId = (message.poolId || Long.UZERO).toString());
    message.shareOutAmount !== undefined &&
      (obj.shareOutAmount = message.shareOutAmount);

    if (message.tokenInMaxs) {
      obj.tokenInMaxs = message.tokenInMaxs.map((e) =>
        e ? Coin.toJSON(e) : undefined
      );
    } else {
      obj.tokenInMaxs = [];
    }

    return obj;
  },

  fromPartial(object: DeepPartial<MsgJoinPool>): MsgJoinPool {
    const message = createBaseMsgJoinPool();
    message.sender = object.sender ?? "";
    message.poolId =
      object.poolId !== undefined && object.poolId !== null
        ? Long.fromValue(object.poolId)
        : Long.UZERO;
    message.shareOutAmount = object.shareOutAmount ?? "";
    message.tokenInMaxs =
      object.tokenInMaxs?.map((e) => Coin.fromPartial(e)) || [];
    return message;
  },
};

function createBaseMsgJoinPoolResponse(): MsgJoinPoolResponse {
  return {};
}

export const MsgJoinPoolResponse = {
  encode(
    _: MsgJoinPoolResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgJoinPoolResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgJoinPoolResponse();

    while (reader.pos < end) {
      const tag = reader.uint32();

      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  },

  fromJSON(_: any): MsgJoinPoolResponse {
    return {};
  },

  toJSON(_: MsgJoinPoolResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(_: DeepPartial<MsgJoinPoolResponse>): MsgJoinPoolResponse {
    const message = createBaseMsgJoinPoolResponse();
    return message;
  },
};

function createBaseMsgExitPool(): MsgExitPool {
  return {
    sender: "",
    poolId: Long.UZERO,
    shareInAmount: "",
    tokenOutMins: [],
  };
}

export const MsgExitPool = {
  encode(
    message: MsgExitPool,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.sender !== "") {
      writer.uint32(10).string(message.sender);
    }

    if (!message.poolId.isZero()) {
      writer.uint32(16).uint64(message.poolId);
    }

    if (message.shareInAmount !== "") {
      writer.uint32(26).string(message.shareInAmount);
    }

    for (const v of message.tokenOutMins) {
      Coin.encode(v!, writer.uint32(34).fork()).ldelim();
    }

    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgExitPool {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgExitPool();

    while (reader.pos < end) {
      const tag = reader.uint32();

      switch (tag >>> 3) {
        case 1:
          message.sender = reader.string();
          break;

        case 2:
          message.poolId = reader.uint64() as Long;
          break;

        case 3:
          message.shareInAmount = reader.string();
          break;

        case 4:
          message.tokenOutMins.push(Coin.decode(reader, reader.uint32()));
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  },

  fromJSON(object: any): MsgExitPool {
    return {
      sender: isSet(object.sender) ? String(object.sender) : "",
      poolId: isSet(object.poolId)
        ? Long.fromString(object.poolId)
        : Long.UZERO,
      shareInAmount: isSet(object.shareInAmount)
        ? String(object.shareInAmount)
        : "",
      tokenOutMins: Array.isArray(object?.tokenOutMins)
        ? object.tokenOutMins.map((e: any) => Coin.fromJSON(e))
        : [],
    };
  },

  toJSON(message: MsgExitPool): unknown {
    const obj: any = {};
    message.sender !== undefined && (obj.sender = message.sender);
    message.poolId !== undefined &&
      (obj.poolId = (message.poolId || Long.UZERO).toString());
    message.shareInAmount !== undefined &&
      (obj.shareInAmount = message.shareInAmount);

    if (message.tokenOutMins) {
      obj.tokenOutMins = message.tokenOutMins.map((e) =>
        e ? Coin.toJSON(e) : undefined
      );
    } else {
      obj.tokenOutMins = [];
    }

    return obj;
  },

  fromPartial(object: DeepPartial<MsgExitPool>): MsgExitPool {
    const message = createBaseMsgExitPool();
    message.sender = object.sender ?? "";
    message.poolId =
      object.poolId !== undefined && object.poolId !== null
        ? Long.fromValue(object.poolId)
        : Long.UZERO;
    message.shareInAmount = object.shareInAmount ?? "";
    message.tokenOutMins =
      object.tokenOutMins?.map((e) => Coin.fromPartial(e)) || [];
    return message;
  },
};

function createBaseMsgExitPoolResponse(): MsgExitPoolResponse {
  return {};
}

export const MsgExitPoolResponse = {
  encode(
    _: MsgExitPoolResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgExitPoolResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgExitPoolResponse();

    while (reader.pos < end) {
      const tag = reader.uint32();

      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  },

  fromJSON(_: any): MsgExitPoolResponse {
    return {};
  },

  toJSON(_: MsgExitPoolResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(_: DeepPartial<MsgExitPoolResponse>): MsgExitPoolResponse {
    const message = createBaseMsgExitPoolResponse();
    return message;
  },
};

function createBaseSwapAmountInRoute(): SwapAmountInRoute {
  return {
    poolId: Long.UZERO,
    tokenOutDenom: "",
  };
}

export const SwapAmountInRoute = {
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
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSwapAmountInRoute();

    while (reader.pos < end) {
      const tag = reader.uint32();

      switch (tag >>> 3) {
        case 1:
          message.poolId = reader.uint64() as Long;
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

  fromJSON(object: any): SwapAmountInRoute {
    return {
      poolId: isSet(object.poolId)
        ? Long.fromString(object.poolId)
        : Long.UZERO,
      tokenOutDenom: isSet(object.tokenOutDenom)
        ? String(object.tokenOutDenom)
        : "",
    };
  },

  toJSON(message: SwapAmountInRoute): unknown {
    const obj: any = {};
    message.poolId !== undefined &&
      (obj.poolId = (message.poolId || Long.UZERO).toString());
    message.tokenOutDenom !== undefined &&
      (obj.tokenOutDenom = message.tokenOutDenom);
    return obj;
  },

  fromPartial(object: DeepPartial<SwapAmountInRoute>): SwapAmountInRoute {
    const message = createBaseSwapAmountInRoute();
    message.poolId =
      object.poolId !== undefined && object.poolId !== null
        ? Long.fromValue(object.poolId)
        : Long.UZERO;
    message.tokenOutDenom = object.tokenOutDenom ?? "";
    return message;
  },
};

function createBaseMsgSwapExactAmountIn(): MsgSwapExactAmountIn {
  return {
    sender: "",
    routes: [],
    tokenIn: undefined,
    tokenOutMinAmount: "",
  };
}

export const MsgSwapExactAmountIn = {
  encode(
    message: MsgSwapExactAmountIn,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.sender !== "") {
      writer.uint32(10).string(message.sender);
    }

    for (const v of message.routes) {
      SwapAmountInRoute.encode(v!, writer.uint32(18).fork()).ldelim();
    }

    if (message.tokenIn !== undefined) {
      Coin.encode(message.tokenIn, writer.uint32(26).fork()).ldelim();
    }

    if (message.tokenOutMinAmount !== "") {
      writer.uint32(34).string(message.tokenOutMinAmount);
    }

    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): MsgSwapExactAmountIn {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSwapExactAmountIn();

    while (reader.pos < end) {
      const tag = reader.uint32();

      switch (tag >>> 3) {
        case 1:
          message.sender = reader.string();
          break;

        case 2:
          message.routes.push(
            SwapAmountInRoute.decode(reader, reader.uint32())
          );
          break;

        case 3:
          message.tokenIn = Coin.decode(reader, reader.uint32());
          break;

        case 4:
          message.tokenOutMinAmount = reader.string();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  },

  fromJSON(object: any): MsgSwapExactAmountIn {
    return {
      sender: isSet(object.sender) ? String(object.sender) : "",
      routes: Array.isArray(object?.routes)
        ? object.routes.map((e: any) => SwapAmountInRoute.fromJSON(e))
        : [],
      tokenIn: isSet(object.tokenIn)
        ? Coin.fromJSON(object.tokenIn)
        : undefined,
      tokenOutMinAmount: isSet(object.tokenOutMinAmount)
        ? String(object.tokenOutMinAmount)
        : "",
    };
  },

  toJSON(message: MsgSwapExactAmountIn): unknown {
    const obj: any = {};
    message.sender !== undefined && (obj.sender = message.sender);

    if (message.routes) {
      obj.routes = message.routes.map((e) =>
        e ? SwapAmountInRoute.toJSON(e) : undefined
      );
    } else {
      obj.routes = [];
    }

    message.tokenIn !== undefined &&
      (obj.tokenIn = message.tokenIn
        ? Coin.toJSON(message.tokenIn)
        : undefined);
    message.tokenOutMinAmount !== undefined &&
      (obj.tokenOutMinAmount = message.tokenOutMinAmount);
    return obj;
  },

  fromPartial(object: DeepPartial<MsgSwapExactAmountIn>): MsgSwapExactAmountIn {
    const message = createBaseMsgSwapExactAmountIn();
    message.sender = object.sender ?? "";
    message.routes =
      object.routes?.map((e) => SwapAmountInRoute.fromPartial(e)) || [];
    message.tokenIn =
      object.tokenIn !== undefined && object.tokenIn !== null
        ? Coin.fromPartial(object.tokenIn)
        : undefined;
    message.tokenOutMinAmount = object.tokenOutMinAmount ?? "";
    return message;
  },
};

function createBaseMsgSwapExactAmountInResponse(): MsgSwapExactAmountInResponse {
  return {
    tokenOutAmount: "",
  };
}

export const MsgSwapExactAmountInResponse = {
  encode(
    message: MsgSwapExactAmountInResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.tokenOutAmount !== "") {
      writer.uint32(10).string(message.tokenOutAmount);
    }

    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): MsgSwapExactAmountInResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSwapExactAmountInResponse();

    while (reader.pos < end) {
      const tag = reader.uint32();

      switch (tag >>> 3) {
        case 1:
          message.tokenOutAmount = reader.string();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  },

  fromJSON(object: any): MsgSwapExactAmountInResponse {
    return {
      tokenOutAmount: isSet(object.tokenOutAmount)
        ? String(object.tokenOutAmount)
        : "",
    };
  },

  toJSON(message: MsgSwapExactAmountInResponse): unknown {
    const obj: any = {};
    message.tokenOutAmount !== undefined &&
      (obj.tokenOutAmount = message.tokenOutAmount);
    return obj;
  },

  fromPartial(
    object: DeepPartial<MsgSwapExactAmountInResponse>
  ): MsgSwapExactAmountInResponse {
    const message = createBaseMsgSwapExactAmountInResponse();
    message.tokenOutAmount = object.tokenOutAmount ?? "";
    return message;
  },
};

function createBaseSwapAmountOutRoute(): SwapAmountOutRoute {
  return {
    poolId: Long.UZERO,
    tokenInDenom: "",
  };
}

export const SwapAmountOutRoute = {
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

  decode(input: _m0.Reader | Uint8Array, length?: number): SwapAmountOutRoute {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSwapAmountOutRoute();

    while (reader.pos < end) {
      const tag = reader.uint32();

      switch (tag >>> 3) {
        case 1:
          message.poolId = reader.uint64() as Long;
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

  fromJSON(object: any): SwapAmountOutRoute {
    return {
      poolId: isSet(object.poolId)
        ? Long.fromString(object.poolId)
        : Long.UZERO,
      tokenInDenom: isSet(object.tokenInDenom)
        ? String(object.tokenInDenom)
        : "",
    };
  },

  toJSON(message: SwapAmountOutRoute): unknown {
    const obj: any = {};
    message.poolId !== undefined &&
      (obj.poolId = (message.poolId || Long.UZERO).toString());
    message.tokenInDenom !== undefined &&
      (obj.tokenInDenom = message.tokenInDenom);
    return obj;
  },

  fromPartial(object: DeepPartial<SwapAmountOutRoute>): SwapAmountOutRoute {
    const message = createBaseSwapAmountOutRoute();
    message.poolId =
      object.poolId !== undefined && object.poolId !== null
        ? Long.fromValue(object.poolId)
        : Long.UZERO;
    message.tokenInDenom = object.tokenInDenom ?? "";
    return message;
  },
};

function createBaseMsgSwapExactAmountOut(): MsgSwapExactAmountOut {
  return {
    sender: "",
    routes: [],
    tokenInMaxAmount: "",
    tokenOut: undefined,
  };
}

export const MsgSwapExactAmountOut = {
  encode(
    message: MsgSwapExactAmountOut,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.sender !== "") {
      writer.uint32(10).string(message.sender);
    }

    for (const v of message.routes) {
      SwapAmountOutRoute.encode(v!, writer.uint32(18).fork()).ldelim();
    }

    if (message.tokenInMaxAmount !== "") {
      writer.uint32(26).string(message.tokenInMaxAmount);
    }

    if (message.tokenOut !== undefined) {
      Coin.encode(message.tokenOut, writer.uint32(34).fork()).ldelim();
    }

    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): MsgSwapExactAmountOut {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSwapExactAmountOut();

    while (reader.pos < end) {
      const tag = reader.uint32();

      switch (tag >>> 3) {
        case 1:
          message.sender = reader.string();
          break;

        case 2:
          message.routes.push(
            SwapAmountOutRoute.decode(reader, reader.uint32())
          );
          break;

        case 3:
          message.tokenInMaxAmount = reader.string();
          break;

        case 4:
          message.tokenOut = Coin.decode(reader, reader.uint32());
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  },

  fromJSON(object: any): MsgSwapExactAmountOut {
    return {
      sender: isSet(object.sender) ? String(object.sender) : "",
      routes: Array.isArray(object?.routes)
        ? object.routes.map((e: any) => SwapAmountOutRoute.fromJSON(e))
        : [],
      tokenInMaxAmount: isSet(object.tokenInMaxAmount)
        ? String(object.tokenInMaxAmount)
        : "",
      tokenOut: isSet(object.tokenOut)
        ? Coin.fromJSON(object.tokenOut)
        : undefined,
    };
  },

  toJSON(message: MsgSwapExactAmountOut): unknown {
    const obj: any = {};
    message.sender !== undefined && (obj.sender = message.sender);

    if (message.routes) {
      obj.routes = message.routes.map((e) =>
        e ? SwapAmountOutRoute.toJSON(e) : undefined
      );
    } else {
      obj.routes = [];
    }

    message.tokenInMaxAmount !== undefined &&
      (obj.tokenInMaxAmount = message.tokenInMaxAmount);
    message.tokenOut !== undefined &&
      (obj.tokenOut = message.tokenOut
        ? Coin.toJSON(message.tokenOut)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<MsgSwapExactAmountOut>
  ): MsgSwapExactAmountOut {
    const message = createBaseMsgSwapExactAmountOut();
    message.sender = object.sender ?? "";
    message.routes =
      object.routes?.map((e) => SwapAmountOutRoute.fromPartial(e)) || [];
    message.tokenInMaxAmount = object.tokenInMaxAmount ?? "";
    message.tokenOut =
      object.tokenOut !== undefined && object.tokenOut !== null
        ? Coin.fromPartial(object.tokenOut)
        : undefined;
    return message;
  },
};

function createBaseMsgSwapExactAmountOutResponse(): MsgSwapExactAmountOutResponse {
  return {
    tokenInAmount: "",
  };
}

export const MsgSwapExactAmountOutResponse = {
  encode(
    message: MsgSwapExactAmountOutResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.tokenInAmount !== "") {
      writer.uint32(10).string(message.tokenInAmount);
    }

    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): MsgSwapExactAmountOutResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSwapExactAmountOutResponse();

    while (reader.pos < end) {
      const tag = reader.uint32();

      switch (tag >>> 3) {
        case 1:
          message.tokenInAmount = reader.string();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  },

  fromJSON(object: any): MsgSwapExactAmountOutResponse {
    return {
      tokenInAmount: isSet(object.tokenInAmount)
        ? String(object.tokenInAmount)
        : "",
    };
  },

  toJSON(message: MsgSwapExactAmountOutResponse): unknown {
    const obj: any = {};
    message.tokenInAmount !== undefined &&
      (obj.tokenInAmount = message.tokenInAmount);
    return obj;
  },

  fromPartial(
    object: DeepPartial<MsgSwapExactAmountOutResponse>
  ): MsgSwapExactAmountOutResponse {
    const message = createBaseMsgSwapExactAmountOutResponse();
    message.tokenInAmount = object.tokenInAmount ?? "";
    return message;
  },
};

function createBaseMsgJoinSwapExternAmountIn(): MsgJoinSwapExternAmountIn {
  return {
    sender: "",
    poolId: Long.UZERO,
    tokenIn: undefined,
    shareOutMinAmount: "",
  };
}

export const MsgJoinSwapExternAmountIn = {
  encode(
    message: MsgJoinSwapExternAmountIn,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.sender !== "") {
      writer.uint32(10).string(message.sender);
    }

    if (!message.poolId.isZero()) {
      writer.uint32(16).uint64(message.poolId);
    }

    if (message.tokenIn !== undefined) {
      Coin.encode(message.tokenIn, writer.uint32(26).fork()).ldelim();
    }

    if (message.shareOutMinAmount !== "") {
      writer.uint32(34).string(message.shareOutMinAmount);
    }

    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): MsgJoinSwapExternAmountIn {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgJoinSwapExternAmountIn();

    while (reader.pos < end) {
      const tag = reader.uint32();

      switch (tag >>> 3) {
        case 1:
          message.sender = reader.string();
          break;

        case 2:
          message.poolId = reader.uint64() as Long;
          break;

        case 3:
          message.tokenIn = Coin.decode(reader, reader.uint32());
          break;

        case 4:
          message.shareOutMinAmount = reader.string();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  },

  fromJSON(object: any): MsgJoinSwapExternAmountIn {
    return {
      sender: isSet(object.sender) ? String(object.sender) : "",
      poolId: isSet(object.poolId)
        ? Long.fromString(object.poolId)
        : Long.UZERO,
      tokenIn: isSet(object.tokenIn)
        ? Coin.fromJSON(object.tokenIn)
        : undefined,
      shareOutMinAmount: isSet(object.shareOutMinAmount)
        ? String(object.shareOutMinAmount)
        : "",
    };
  },

  toJSON(message: MsgJoinSwapExternAmountIn): unknown {
    const obj: any = {};
    message.sender !== undefined && (obj.sender = message.sender);
    message.poolId !== undefined &&
      (obj.poolId = (message.poolId || Long.UZERO).toString());
    message.tokenIn !== undefined &&
      (obj.tokenIn = message.tokenIn
        ? Coin.toJSON(message.tokenIn)
        : undefined);
    message.shareOutMinAmount !== undefined &&
      (obj.shareOutMinAmount = message.shareOutMinAmount);
    return obj;
  },

  fromPartial(
    object: DeepPartial<MsgJoinSwapExternAmountIn>
  ): MsgJoinSwapExternAmountIn {
    const message = createBaseMsgJoinSwapExternAmountIn();
    message.sender = object.sender ?? "";
    message.poolId =
      object.poolId !== undefined && object.poolId !== null
        ? Long.fromValue(object.poolId)
        : Long.UZERO;
    message.tokenIn =
      object.tokenIn !== undefined && object.tokenIn !== null
        ? Coin.fromPartial(object.tokenIn)
        : undefined;
    message.shareOutMinAmount = object.shareOutMinAmount ?? "";
    return message;
  },
};

function createBaseMsgJoinSwapExternAmountInResponse(): MsgJoinSwapExternAmountInResponse {
  return {
    shareOutAmount: "",
  };
}

export const MsgJoinSwapExternAmountInResponse = {
  encode(
    message: MsgJoinSwapExternAmountInResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.shareOutAmount !== "") {
      writer.uint32(10).string(message.shareOutAmount);
    }

    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): MsgJoinSwapExternAmountInResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgJoinSwapExternAmountInResponse();

    while (reader.pos < end) {
      const tag = reader.uint32();

      switch (tag >>> 3) {
        case 1:
          message.shareOutAmount = reader.string();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  },

  fromJSON(object: any): MsgJoinSwapExternAmountInResponse {
    return {
      shareOutAmount: isSet(object.shareOutAmount)
        ? String(object.shareOutAmount)
        : "",
    };
  },

  toJSON(message: MsgJoinSwapExternAmountInResponse): unknown {
    const obj: any = {};
    message.shareOutAmount !== undefined &&
      (obj.shareOutAmount = message.shareOutAmount);
    return obj;
  },

  fromPartial(
    object: DeepPartial<MsgJoinSwapExternAmountInResponse>
  ): MsgJoinSwapExternAmountInResponse {
    const message = createBaseMsgJoinSwapExternAmountInResponse();
    message.shareOutAmount = object.shareOutAmount ?? "";
    return message;
  },
};

function createBaseMsgJoinSwapShareAmountOut(): MsgJoinSwapShareAmountOut {
  return {
    sender: "",
    poolId: Long.UZERO,
    tokenInDenom: "",
    shareOutAmount: "",
    tokenInMaxAmount: "",
  };
}

export const MsgJoinSwapShareAmountOut = {
  encode(
    message: MsgJoinSwapShareAmountOut,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.sender !== "") {
      writer.uint32(10).string(message.sender);
    }

    if (!message.poolId.isZero()) {
      writer.uint32(16).uint64(message.poolId);
    }

    if (message.tokenInDenom !== "") {
      writer.uint32(26).string(message.tokenInDenom);
    }

    if (message.shareOutAmount !== "") {
      writer.uint32(34).string(message.shareOutAmount);
    }

    if (message.tokenInMaxAmount !== "") {
      writer.uint32(42).string(message.tokenInMaxAmount);
    }

    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): MsgJoinSwapShareAmountOut {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgJoinSwapShareAmountOut();

    while (reader.pos < end) {
      const tag = reader.uint32();

      switch (tag >>> 3) {
        case 1:
          message.sender = reader.string();
          break;

        case 2:
          message.poolId = reader.uint64() as Long;
          break;

        case 3:
          message.tokenInDenom = reader.string();
          break;

        case 4:
          message.shareOutAmount = reader.string();
          break;

        case 5:
          message.tokenInMaxAmount = reader.string();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  },

  fromJSON(object: any): MsgJoinSwapShareAmountOut {
    return {
      sender: isSet(object.sender) ? String(object.sender) : "",
      poolId: isSet(object.poolId)
        ? Long.fromString(object.poolId)
        : Long.UZERO,
      tokenInDenom: isSet(object.tokenInDenom)
        ? String(object.tokenInDenom)
        : "",
      shareOutAmount: isSet(object.shareOutAmount)
        ? String(object.shareOutAmount)
        : "",
      tokenInMaxAmount: isSet(object.tokenInMaxAmount)
        ? String(object.tokenInMaxAmount)
        : "",
    };
  },

  toJSON(message: MsgJoinSwapShareAmountOut): unknown {
    const obj: any = {};
    message.sender !== undefined && (obj.sender = message.sender);
    message.poolId !== undefined &&
      (obj.poolId = (message.poolId || Long.UZERO).toString());
    message.tokenInDenom !== undefined &&
      (obj.tokenInDenom = message.tokenInDenom);
    message.shareOutAmount !== undefined &&
      (obj.shareOutAmount = message.shareOutAmount);
    message.tokenInMaxAmount !== undefined &&
      (obj.tokenInMaxAmount = message.tokenInMaxAmount);
    return obj;
  },

  fromPartial(
    object: DeepPartial<MsgJoinSwapShareAmountOut>
  ): MsgJoinSwapShareAmountOut {
    const message = createBaseMsgJoinSwapShareAmountOut();
    message.sender = object.sender ?? "";
    message.poolId =
      object.poolId !== undefined && object.poolId !== null
        ? Long.fromValue(object.poolId)
        : Long.UZERO;
    message.tokenInDenom = object.tokenInDenom ?? "";
    message.shareOutAmount = object.shareOutAmount ?? "";
    message.tokenInMaxAmount = object.tokenInMaxAmount ?? "";
    return message;
  },
};

function createBaseMsgJoinSwapShareAmountOutResponse(): MsgJoinSwapShareAmountOutResponse {
  return {
    tokenInAmount: "",
  };
}

export const MsgJoinSwapShareAmountOutResponse = {
  encode(
    message: MsgJoinSwapShareAmountOutResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.tokenInAmount !== "") {
      writer.uint32(10).string(message.tokenInAmount);
    }

    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): MsgJoinSwapShareAmountOutResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgJoinSwapShareAmountOutResponse();

    while (reader.pos < end) {
      const tag = reader.uint32();

      switch (tag >>> 3) {
        case 1:
          message.tokenInAmount = reader.string();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  },

  fromJSON(object: any): MsgJoinSwapShareAmountOutResponse {
    return {
      tokenInAmount: isSet(object.tokenInAmount)
        ? String(object.tokenInAmount)
        : "",
    };
  },

  toJSON(message: MsgJoinSwapShareAmountOutResponse): unknown {
    const obj: any = {};
    message.tokenInAmount !== undefined &&
      (obj.tokenInAmount = message.tokenInAmount);
    return obj;
  },

  fromPartial(
    object: DeepPartial<MsgJoinSwapShareAmountOutResponse>
  ): MsgJoinSwapShareAmountOutResponse {
    const message = createBaseMsgJoinSwapShareAmountOutResponse();
    message.tokenInAmount = object.tokenInAmount ?? "";
    return message;
  },
};

function createBaseMsgExitSwapShareAmountIn(): MsgExitSwapShareAmountIn {
  return {
    sender: "",
    poolId: Long.UZERO,
    tokenOutDenom: "",
    shareInAmount: "",
    tokenOutMinAmount: "",
  };
}

export const MsgExitSwapShareAmountIn = {
  encode(
    message: MsgExitSwapShareAmountIn,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.sender !== "") {
      writer.uint32(10).string(message.sender);
    }

    if (!message.poolId.isZero()) {
      writer.uint32(16).uint64(message.poolId);
    }

    if (message.tokenOutDenom !== "") {
      writer.uint32(26).string(message.tokenOutDenom);
    }

    if (message.shareInAmount !== "") {
      writer.uint32(34).string(message.shareInAmount);
    }

    if (message.tokenOutMinAmount !== "") {
      writer.uint32(42).string(message.tokenOutMinAmount);
    }

    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): MsgExitSwapShareAmountIn {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgExitSwapShareAmountIn();

    while (reader.pos < end) {
      const tag = reader.uint32();

      switch (tag >>> 3) {
        case 1:
          message.sender = reader.string();
          break;

        case 2:
          message.poolId = reader.uint64() as Long;
          break;

        case 3:
          message.tokenOutDenom = reader.string();
          break;

        case 4:
          message.shareInAmount = reader.string();
          break;

        case 5:
          message.tokenOutMinAmount = reader.string();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  },

  fromJSON(object: any): MsgExitSwapShareAmountIn {
    return {
      sender: isSet(object.sender) ? String(object.sender) : "",
      poolId: isSet(object.poolId)
        ? Long.fromString(object.poolId)
        : Long.UZERO,
      tokenOutDenom: isSet(object.tokenOutDenom)
        ? String(object.tokenOutDenom)
        : "",
      shareInAmount: isSet(object.shareInAmount)
        ? String(object.shareInAmount)
        : "",
      tokenOutMinAmount: isSet(object.tokenOutMinAmount)
        ? String(object.tokenOutMinAmount)
        : "",
    };
  },

  toJSON(message: MsgExitSwapShareAmountIn): unknown {
    const obj: any = {};
    message.sender !== undefined && (obj.sender = message.sender);
    message.poolId !== undefined &&
      (obj.poolId = (message.poolId || Long.UZERO).toString());
    message.tokenOutDenom !== undefined &&
      (obj.tokenOutDenom = message.tokenOutDenom);
    message.shareInAmount !== undefined &&
      (obj.shareInAmount = message.shareInAmount);
    message.tokenOutMinAmount !== undefined &&
      (obj.tokenOutMinAmount = message.tokenOutMinAmount);
    return obj;
  },

  fromPartial(
    object: DeepPartial<MsgExitSwapShareAmountIn>
  ): MsgExitSwapShareAmountIn {
    const message = createBaseMsgExitSwapShareAmountIn();
    message.sender = object.sender ?? "";
    message.poolId =
      object.poolId !== undefined && object.poolId !== null
        ? Long.fromValue(object.poolId)
        : Long.UZERO;
    message.tokenOutDenom = object.tokenOutDenom ?? "";
    message.shareInAmount = object.shareInAmount ?? "";
    message.tokenOutMinAmount = object.tokenOutMinAmount ?? "";
    return message;
  },
};

function createBaseMsgExitSwapShareAmountInResponse(): MsgExitSwapShareAmountInResponse {
  return {
    tokenOutAmount: "",
  };
}

export const MsgExitSwapShareAmountInResponse = {
  encode(
    message: MsgExitSwapShareAmountInResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.tokenOutAmount !== "") {
      writer.uint32(10).string(message.tokenOutAmount);
    }

    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): MsgExitSwapShareAmountInResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgExitSwapShareAmountInResponse();

    while (reader.pos < end) {
      const tag = reader.uint32();

      switch (tag >>> 3) {
        case 1:
          message.tokenOutAmount = reader.string();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  },

  fromJSON(object: any): MsgExitSwapShareAmountInResponse {
    return {
      tokenOutAmount: isSet(object.tokenOutAmount)
        ? String(object.tokenOutAmount)
        : "",
    };
  },

  toJSON(message: MsgExitSwapShareAmountInResponse): unknown {
    const obj: any = {};
    message.tokenOutAmount !== undefined &&
      (obj.tokenOutAmount = message.tokenOutAmount);
    return obj;
  },

  fromPartial(
    object: DeepPartial<MsgExitSwapShareAmountInResponse>
  ): MsgExitSwapShareAmountInResponse {
    const message = createBaseMsgExitSwapShareAmountInResponse();
    message.tokenOutAmount = object.tokenOutAmount ?? "";
    return message;
  },
};

function createBaseMsgExitSwapExternAmountOut(): MsgExitSwapExternAmountOut {
  return {
    sender: "",
    poolId: Long.UZERO,
    tokenOut: undefined,
    shareInMaxAmount: "",
  };
}

export const MsgExitSwapExternAmountOut = {
  encode(
    message: MsgExitSwapExternAmountOut,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.sender !== "") {
      writer.uint32(10).string(message.sender);
    }

    if (!message.poolId.isZero()) {
      writer.uint32(16).uint64(message.poolId);
    }

    if (message.tokenOut !== undefined) {
      Coin.encode(message.tokenOut, writer.uint32(26).fork()).ldelim();
    }

    if (message.shareInMaxAmount !== "") {
      writer.uint32(34).string(message.shareInMaxAmount);
    }

    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): MsgExitSwapExternAmountOut {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgExitSwapExternAmountOut();

    while (reader.pos < end) {
      const tag = reader.uint32();

      switch (tag >>> 3) {
        case 1:
          message.sender = reader.string();
          break;

        case 2:
          message.poolId = reader.uint64() as Long;
          break;

        case 3:
          message.tokenOut = Coin.decode(reader, reader.uint32());
          break;

        case 4:
          message.shareInMaxAmount = reader.string();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  },

  fromJSON(object: any): MsgExitSwapExternAmountOut {
    return {
      sender: isSet(object.sender) ? String(object.sender) : "",
      poolId: isSet(object.poolId)
        ? Long.fromString(object.poolId)
        : Long.UZERO,
      tokenOut: isSet(object.tokenOut)
        ? Coin.fromJSON(object.tokenOut)
        : undefined,
      shareInMaxAmount: isSet(object.shareInMaxAmount)
        ? String(object.shareInMaxAmount)
        : "",
    };
  },

  toJSON(message: MsgExitSwapExternAmountOut): unknown {
    const obj: any = {};
    message.sender !== undefined && (obj.sender = message.sender);
    message.poolId !== undefined &&
      (obj.poolId = (message.poolId || Long.UZERO).toString());
    message.tokenOut !== undefined &&
      (obj.tokenOut = message.tokenOut
        ? Coin.toJSON(message.tokenOut)
        : undefined);
    message.shareInMaxAmount !== undefined &&
      (obj.shareInMaxAmount = message.shareInMaxAmount);
    return obj;
  },

  fromPartial(
    object: DeepPartial<MsgExitSwapExternAmountOut>
  ): MsgExitSwapExternAmountOut {
    const message = createBaseMsgExitSwapExternAmountOut();
    message.sender = object.sender ?? "";
    message.poolId =
      object.poolId !== undefined && object.poolId !== null
        ? Long.fromValue(object.poolId)
        : Long.UZERO;
    message.tokenOut =
      object.tokenOut !== undefined && object.tokenOut !== null
        ? Coin.fromPartial(object.tokenOut)
        : undefined;
    message.shareInMaxAmount = object.shareInMaxAmount ?? "";
    return message;
  },
};

function createBaseMsgExitSwapExternAmountOutResponse(): MsgExitSwapExternAmountOutResponse {
  return {
    shareInAmount: "",
  };
}

export const MsgExitSwapExternAmountOutResponse = {
  encode(
    message: MsgExitSwapExternAmountOutResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.shareInAmount !== "") {
      writer.uint32(10).string(message.shareInAmount);
    }

    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): MsgExitSwapExternAmountOutResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgExitSwapExternAmountOutResponse();

    while (reader.pos < end) {
      const tag = reader.uint32();

      switch (tag >>> 3) {
        case 1:
          message.shareInAmount = reader.string();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  },

  fromJSON(object: any): MsgExitSwapExternAmountOutResponse {
    return {
      shareInAmount: isSet(object.shareInAmount)
        ? String(object.shareInAmount)
        : "",
    };
  },

  toJSON(message: MsgExitSwapExternAmountOutResponse): unknown {
    const obj: any = {};
    message.shareInAmount !== undefined &&
      (obj.shareInAmount = message.shareInAmount);
    return obj;
  },

  fromPartial(
    object: DeepPartial<MsgExitSwapExternAmountOutResponse>
  ): MsgExitSwapExternAmountOutResponse {
    const message = createBaseMsgExitSwapExternAmountOutResponse();
    message.shareInAmount = object.shareInAmount ?? "";
    return message;
  },
};
