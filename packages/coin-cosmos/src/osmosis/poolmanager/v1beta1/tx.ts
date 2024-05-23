//@ts-nocheck
import { SwapAmountInRoute, SwapAmountInRouteAmino, SwapAmountInRouteSDKType, SwapAmountOutRoute, SwapAmountOutRouteAmino, SwapAmountOutRouteSDKType, SwapAmountInSplitRoute, SwapAmountInSplitRouteAmino, SwapAmountInSplitRouteSDKType, SwapAmountOutSplitRoute, SwapAmountOutSplitRouteAmino, SwapAmountOutSplitRouteSDKType } from "./swap_route";
import { Coin, CoinAmino, CoinSDKType } from "../../../typesV2/cosmos/base/v1beta1/coin";
import { BinaryReader, BinaryWriter } from "../../../binary";
import { Decimal } from "@cosmjs/math";
import {TelescopeGeneratedCodec} from "../../../types";
/** ===================== MsgSwapExactAmountIn */
export interface MsgSwapExactAmountIn {
  sender: string;
  routes: SwapAmountInRoute[];
  tokenIn: Coin;
  tokenOutMinAmount: string;
}
export interface MsgSwapExactAmountInProtoMsg {
  typeUrl: "/osmosis.poolmanager.v1beta1.MsgSwapExactAmountIn";
  value: Uint8Array;
}
/** ===================== MsgSwapExactAmountIn */
export interface MsgSwapExactAmountInAmino {
  sender?: string;
  routes?: SwapAmountInRouteAmino[];
  token_in?: CoinAmino;
  token_out_min_amount?: string;
}
export interface MsgSwapExactAmountInAminoMsg {
  type: "osmosis/poolmanager/swap-exact-amount-in";
  value: MsgSwapExactAmountInAmino;
}
/** ===================== MsgSwapExactAmountIn */
export interface MsgSwapExactAmountInSDKType {
  sender: string;
  routes: SwapAmountInRouteSDKType[];
  token_in: CoinSDKType;
  token_out_min_amount: string;
}
export interface MsgSwapExactAmountInResponse {
  tokenOutAmount: string;
}
export interface MsgSwapExactAmountInResponseProtoMsg {
  typeUrl: "/osmosis.poolmanager.v1beta1.MsgSwapExactAmountInResponse";
  value: Uint8Array;
}
export interface MsgSwapExactAmountInResponseAmino {
  token_out_amount?: string;
}
export interface MsgSwapExactAmountInResponseAminoMsg {
  type: "osmosis/poolmanager/swap-exact-amount-in-response";
  value: MsgSwapExactAmountInResponseAmino;
}
export interface MsgSwapExactAmountInResponseSDKType {
  token_out_amount: string;
}
/** ===================== MsgSplitRouteSwapExactAmountIn */
export interface MsgSplitRouteSwapExactAmountIn {
  sender: string;
  routes: SwapAmountInSplitRoute[];
  tokenInDenom: string;
  tokenOutMinAmount: string;
}
export interface MsgSplitRouteSwapExactAmountInProtoMsg {
  typeUrl: "/osmosis.poolmanager.v1beta1.MsgSplitRouteSwapExactAmountIn";
  value: Uint8Array;
}
/** ===================== MsgSplitRouteSwapExactAmountIn */
export interface MsgSplitRouteSwapExactAmountInAmino {
  sender?: string;
  routes?: SwapAmountInSplitRouteAmino[];
  token_in_denom?: string;
  token_out_min_amount?: string;
}
export interface MsgSplitRouteSwapExactAmountInAminoMsg {
  type: "osmosis/poolmanager/split-amount-in";
  value: MsgSplitRouteSwapExactAmountInAmino;
}
/** ===================== MsgSplitRouteSwapExactAmountIn */
export interface MsgSplitRouteSwapExactAmountInSDKType {
  sender: string;
  routes: SwapAmountInSplitRouteSDKType[];
  token_in_denom: string;
  token_out_min_amount: string;
}
export interface MsgSplitRouteSwapExactAmountInResponse {
  tokenOutAmount: string;
}
export interface MsgSplitRouteSwapExactAmountInResponseProtoMsg {
  typeUrl: "/osmosis.poolmanager.v1beta1.MsgSplitRouteSwapExactAmountInResponse";
  value: Uint8Array;
}
export interface MsgSplitRouteSwapExactAmountInResponseAmino {
  token_out_amount?: string;
}
export interface MsgSplitRouteSwapExactAmountInResponseAminoMsg {
  type: "osmosis/poolmanager/split-route-swap-exact-amount-in-response";
  value: MsgSplitRouteSwapExactAmountInResponseAmino;
}
export interface MsgSplitRouteSwapExactAmountInResponseSDKType {
  token_out_amount: string;
}
/** ===================== MsgSwapExactAmountOut */
export interface MsgSwapExactAmountOut {
  sender: string;
  routes: SwapAmountOutRoute[];
  tokenInMaxAmount: string;
  tokenOut: Coin;
}
export interface MsgSwapExactAmountOutProtoMsg {
  typeUrl: "/osmosis.poolmanager.v1beta1.MsgSwapExactAmountOut";
  value: Uint8Array;
}
/** ===================== MsgSwapExactAmountOut */
export interface MsgSwapExactAmountOutAmino {
  sender?: string;
  routes?: SwapAmountOutRouteAmino[];
  token_in_max_amount?: string;
  token_out?: CoinAmino;
}
export interface MsgSwapExactAmountOutAminoMsg {
  type: "osmosis/poolmanager/swap-exact-amount-out";
  value: MsgSwapExactAmountOutAmino;
}
/** ===================== MsgSwapExactAmountOut */
export interface MsgSwapExactAmountOutSDKType {
  sender: string;
  routes: SwapAmountOutRouteSDKType[];
  token_in_max_amount: string;
  token_out: CoinSDKType;
}
export interface MsgSwapExactAmountOutResponse {
  tokenInAmount: string;
}
export interface MsgSwapExactAmountOutResponseProtoMsg {
  typeUrl: "/osmosis.poolmanager.v1beta1.MsgSwapExactAmountOutResponse";
  value: Uint8Array;
}
export interface MsgSwapExactAmountOutResponseAmino {
  token_in_amount?: string;
}
export interface MsgSwapExactAmountOutResponseAminoMsg {
  type: "osmosis/poolmanager/swap-exact-amount-out-response";
  value: MsgSwapExactAmountOutResponseAmino;
}
export interface MsgSwapExactAmountOutResponseSDKType {
  token_in_amount: string;
}
/** ===================== MsgSplitRouteSwapExactAmountOut */
export interface MsgSplitRouteSwapExactAmountOut {
  sender: string;
  routes: SwapAmountOutSplitRoute[];
  tokenOutDenom: string;
  tokenInMaxAmount: string;
}
export interface MsgSplitRouteSwapExactAmountOutProtoMsg {
  typeUrl: "/osmosis.poolmanager.v1beta1.MsgSplitRouteSwapExactAmountOut";
  value: Uint8Array;
}
/** ===================== MsgSplitRouteSwapExactAmountOut */
export interface MsgSplitRouteSwapExactAmountOutAmino {
  sender?: string;
  routes?: SwapAmountOutSplitRouteAmino[];
  token_out_denom?: string;
  token_in_max_amount?: string;
}
export interface MsgSplitRouteSwapExactAmountOutAminoMsg {
  type: "osmosis/poolmanager/split-amount-out";
  value: MsgSplitRouteSwapExactAmountOutAmino;
}
/** ===================== MsgSplitRouteSwapExactAmountOut */
export interface MsgSplitRouteSwapExactAmountOutSDKType {
  sender: string;
  routes: SwapAmountOutSplitRouteSDKType[];
  token_out_denom: string;
  token_in_max_amount: string;
}
export interface MsgSplitRouteSwapExactAmountOutResponse {
  tokenInAmount: string;
}
export interface MsgSplitRouteSwapExactAmountOutResponseProtoMsg {
  typeUrl: "/osmosis.poolmanager.v1beta1.MsgSplitRouteSwapExactAmountOutResponse";
  value: Uint8Array;
}
export interface MsgSplitRouteSwapExactAmountOutResponseAmino {
  token_in_amount?: string;
}
export interface MsgSplitRouteSwapExactAmountOutResponseAminoMsg {
  type: "osmosis/poolmanager/split-route-swap-exact-amount-out-response";
  value: MsgSplitRouteSwapExactAmountOutResponseAmino;
}
export interface MsgSplitRouteSwapExactAmountOutResponseSDKType {
  token_in_amount: string;
}
/** ===================== MsgSetDenomPairTakerFee */
export interface MsgSetDenomPairTakerFee {
  sender: string;
  denomPairTakerFee: DenomPairTakerFee[];
}
export interface MsgSetDenomPairTakerFeeProtoMsg {
  typeUrl: "/osmosis.poolmanager.v1beta1.MsgSetDenomPairTakerFee";
  value: Uint8Array;
}
/** ===================== MsgSetDenomPairTakerFee */
export interface MsgSetDenomPairTakerFeeAmino {
  sender?: string;
  denom_pair_taker_fee?: DenomPairTakerFeeAmino[];
}
export interface MsgSetDenomPairTakerFeeAminoMsg {
  type: "osmosis/poolmanager/set-denom-pair-taker-fee";
  value: MsgSetDenomPairTakerFeeAmino;
}
/** ===================== MsgSetDenomPairTakerFee */
export interface MsgSetDenomPairTakerFeeSDKType {
  sender: string;
  denom_pair_taker_fee: DenomPairTakerFeeSDKType[];
}
export interface MsgSetDenomPairTakerFeeResponse {
  success: boolean;
}
export interface MsgSetDenomPairTakerFeeResponseProtoMsg {
  typeUrl: "/osmosis.poolmanager.v1beta1.MsgSetDenomPairTakerFeeResponse";
  value: Uint8Array;
}
export interface MsgSetDenomPairTakerFeeResponseAmino {
  success?: boolean;
}
export interface MsgSetDenomPairTakerFeeResponseAminoMsg {
  type: "osmosis/poolmanager/set-denom-pair-taker-fee-response";
  value: MsgSetDenomPairTakerFeeResponseAmino;
}
export interface MsgSetDenomPairTakerFeeResponseSDKType {
  success: boolean;
}
export interface DenomPairTakerFee {
  /**
   * denom0 and denom1 get automatically lexigographically sorted
   * when being stored, so the order of input here does not matter.
   */
  denom0: string;
  denom1: string;
  takerFee: string;
}
export interface DenomPairTakerFeeProtoMsg {
  typeUrl: "/osmosis.poolmanager.v1beta1.DenomPairTakerFee";
  value: Uint8Array;
}
export interface DenomPairTakerFeeAmino {
  /**
   * denom0 and denom1 get automatically lexigographically sorted
   * when being stored, so the order of input here does not matter.
   */
  denom0?: string;
  denom1?: string;
  taker_fee?: string;
}
export interface DenomPairTakerFeeAminoMsg {
  type: "osmosis/poolmanager/denom-pair-taker-fee";
  value: DenomPairTakerFeeAmino;
}
export interface DenomPairTakerFeeSDKType {
  denom0: string;
  denom1: string;
  taker_fee: string;
}
function createBaseMsgSwapExactAmountIn(): MsgSwapExactAmountIn {
  return {
    sender: "",
    routes: [],
    tokenIn: Coin.fromPartial({}),
    tokenOutMinAmount: ""
  };
}
export const MsgSwapExactAmountIn = {
  typeUrl: "/osmosis.poolmanager.v1beta1.MsgSwapExactAmountIn",
  aminoType: "osmosis/poolmanager/swap-exact-amount-in",
  is(o: any): o is MsgSwapExactAmountIn {
    return o && (o.$typeUrl === MsgSwapExactAmountIn.typeUrl || typeof o.sender === "string" && Array.isArray(o.routes) && (!o.routes.length || SwapAmountInRoute.is(o.routes[0])) && Coin.is(o.tokenIn) && typeof o.tokenOutMinAmount === "string");
  },
  isSDK(o: any): o is MsgSwapExactAmountInSDKType {
    return o && (o.$typeUrl === MsgSwapExactAmountIn.typeUrl || typeof o.sender === "string" && Array.isArray(o.routes) && (!o.routes.length || SwapAmountInRoute.isSDK(o.routes[0])) && Coin.isSDK(o.token_in) && typeof o.token_out_min_amount === "string");
  },
  isAmino(o: any): o is MsgSwapExactAmountInAmino {
    return o && (o.$typeUrl === MsgSwapExactAmountIn.typeUrl || typeof o.sender === "string" && Array.isArray(o.routes) && (!o.routes.length || SwapAmountInRoute.isAmino(o.routes[0])) && Coin.isAmino(o.token_in) && typeof o.token_out_min_amount === "string");
  },
  encode(message: MsgSwapExactAmountIn, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
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
  decode(input: BinaryReader | Uint8Array, length?: number): MsgSwapExactAmountIn {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSwapExactAmountIn();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.sender = reader.string();
          break;
        case 2:
          message.routes.push(SwapAmountInRoute.decode(reader, reader.uint32()));
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
  fromPartial(object: Partial<MsgSwapExactAmountIn>): MsgSwapExactAmountIn {
    const message = createBaseMsgSwapExactAmountIn();
    message.sender = object.sender ?? "";
    message.routes = object.routes?.map(e => SwapAmountInRoute.fromPartial(e)) || [];
    message.tokenIn = object.tokenIn !== undefined && object.tokenIn !== null ? Coin.fromPartial(object.tokenIn) : undefined;
    message.tokenOutMinAmount = object.tokenOutMinAmount ?? "";
    return message;
  },
  fromAmino(object: MsgSwapExactAmountInAmino): MsgSwapExactAmountIn {
    const message = createBaseMsgSwapExactAmountIn();
    if (object.sender !== undefined && object.sender !== null) {
      message.sender = object.sender;
    }
    message.routes = object.routes?.map(e => SwapAmountInRoute.fromAmino(e)) || [];
    if (object.token_in !== undefined && object.token_in !== null) {
      message.tokenIn = Coin.fromAmino(object.token_in);
    }
    if (object.token_out_min_amount !== undefined && object.token_out_min_amount !== null) {
      message.tokenOutMinAmount = object.token_out_min_amount;
    }
    return message;
  },
  toAmino(message: MsgSwapExactAmountIn): MsgSwapExactAmountInAmino {
    const obj: any = {};
    obj.sender = message.sender === "" ? undefined : message.sender;
    if (message.routes) {
      obj.routes = message.routes.map(e => e ? SwapAmountInRoute.toAmino(e) : undefined);
    } else {
      obj.routes = message.routes;
    }
    obj.token_in = message.tokenIn ? Coin.toAmino(message.tokenIn) : undefined;
    obj.token_out_min_amount = message.tokenOutMinAmount === "" ? undefined : message.tokenOutMinAmount;
    return obj;
  },
  fromAminoMsg(object: MsgSwapExactAmountInAminoMsg): MsgSwapExactAmountIn {
    return MsgSwapExactAmountIn.fromAmino(object.value);
  },
  toAminoMsg(message: MsgSwapExactAmountIn): MsgSwapExactAmountInAminoMsg {
    return {
      type: "osmosis/poolmanager/swap-exact-amount-in",
      value: MsgSwapExactAmountIn.toAmino(message)
    };
  },
  fromProtoMsg(message: MsgSwapExactAmountInProtoMsg): MsgSwapExactAmountIn {
    return MsgSwapExactAmountIn.decode(message.value);
  },
  toProto(message: MsgSwapExactAmountIn): Uint8Array {
    return MsgSwapExactAmountIn.encode(message).finish();
  },
  toProtoMsg(message: MsgSwapExactAmountIn): MsgSwapExactAmountInProtoMsg {
    return {
      typeUrl: "/osmosis.poolmanager.v1beta1.MsgSwapExactAmountIn",
      value: MsgSwapExactAmountIn.encode(message).finish()
    };
  }
};
function createBaseMsgSwapExactAmountInResponse(): MsgSwapExactAmountInResponse {
  return {
    tokenOutAmount: ""
  };
}
export const MsgSwapExactAmountInResponse = {
  typeUrl: "/osmosis.poolmanager.v1beta1.MsgSwapExactAmountInResponse",
  aminoType: "osmosis/poolmanager/swap-exact-amount-in-response",
  is(o: any): o is MsgSwapExactAmountInResponse {
    return o && (o.$typeUrl === MsgSwapExactAmountInResponse.typeUrl || typeof o.tokenOutAmount === "string");
  },
  isSDK(o: any): o is MsgSwapExactAmountInResponseSDKType {
    return o && (o.$typeUrl === MsgSwapExactAmountInResponse.typeUrl || typeof o.token_out_amount === "string");
  },
  isAmino(o: any): o is MsgSwapExactAmountInResponseAmino {
    return o && (o.$typeUrl === MsgSwapExactAmountInResponse.typeUrl || typeof o.token_out_amount === "string");
  },
  encode(message: MsgSwapExactAmountInResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.tokenOutAmount !== "") {
      writer.uint32(10).string(message.tokenOutAmount);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgSwapExactAmountInResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
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
  fromPartial(object: Partial<MsgSwapExactAmountInResponse>): MsgSwapExactAmountInResponse {
    const message = createBaseMsgSwapExactAmountInResponse();
    message.tokenOutAmount = object.tokenOutAmount ?? "";
    return message;
  },
  fromAmino(object: MsgSwapExactAmountInResponseAmino): MsgSwapExactAmountInResponse {
    const message = createBaseMsgSwapExactAmountInResponse();
    if (object.token_out_amount !== undefined && object.token_out_amount !== null) {
      message.tokenOutAmount = object.token_out_amount;
    }
    return message;
  },
  toAmino(message: MsgSwapExactAmountInResponse): MsgSwapExactAmountInResponseAmino {
    const obj: any = {};
    obj.token_out_amount = message.tokenOutAmount === "" ? undefined : message.tokenOutAmount;
    return obj;
  },
  fromAminoMsg(object: MsgSwapExactAmountInResponseAminoMsg): MsgSwapExactAmountInResponse {
    return MsgSwapExactAmountInResponse.fromAmino(object.value);
  },
  toAminoMsg(message: MsgSwapExactAmountInResponse): MsgSwapExactAmountInResponseAminoMsg {
    return {
      type: "osmosis/poolmanager/swap-exact-amount-in-response",
      value: MsgSwapExactAmountInResponse.toAmino(message)
    };
  },
  fromProtoMsg(message: MsgSwapExactAmountInResponseProtoMsg): MsgSwapExactAmountInResponse {
    return MsgSwapExactAmountInResponse.decode(message.value);
  },
  toProto(message: MsgSwapExactAmountInResponse): Uint8Array {
    return MsgSwapExactAmountInResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgSwapExactAmountInResponse): MsgSwapExactAmountInResponseProtoMsg {
    return {
      typeUrl: "/osmosis.poolmanager.v1beta1.MsgSwapExactAmountInResponse",
      value: MsgSwapExactAmountInResponse.encode(message).finish()
    };
  }
};
function createBaseMsgSplitRouteSwapExactAmountIn(): MsgSplitRouteSwapExactAmountIn {
  return {
    sender: "",
    routes: [],
    tokenInDenom: "",
    tokenOutMinAmount: ""
  };
}
export const MsgSplitRouteSwapExactAmountIn = {
  typeUrl: "/osmosis.poolmanager.v1beta1.MsgSplitRouteSwapExactAmountIn",
  aminoType: "osmosis/poolmanager/split-amount-in",
  is(o: any): o is MsgSplitRouteSwapExactAmountIn {
    return o && (o.$typeUrl === MsgSplitRouteSwapExactAmountIn.typeUrl || typeof o.sender === "string" && Array.isArray(o.routes) && (!o.routes.length || SwapAmountInSplitRoute.is(o.routes[0])) && typeof o.tokenInDenom === "string" && typeof o.tokenOutMinAmount === "string");
  },
  isSDK(o: any): o is MsgSplitRouteSwapExactAmountInSDKType {
    return o && (o.$typeUrl === MsgSplitRouteSwapExactAmountIn.typeUrl || typeof o.sender === "string" && Array.isArray(o.routes) && (!o.routes.length || SwapAmountInSplitRoute.isSDK(o.routes[0])) && typeof o.token_in_denom === "string" && typeof o.token_out_min_amount === "string");
  },
  isAmino(o: any): o is MsgSplitRouteSwapExactAmountInAmino {
    return o && (o.$typeUrl === MsgSplitRouteSwapExactAmountIn.typeUrl || typeof o.sender === "string" && Array.isArray(o.routes) && (!o.routes.length || SwapAmountInSplitRoute.isAmino(o.routes[0])) && typeof o.token_in_denom === "string" && typeof o.token_out_min_amount === "string");
  },
  encode(message: MsgSplitRouteSwapExactAmountIn, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.sender !== "") {
      writer.uint32(10).string(message.sender);
    }
    for (const v of message.routes) {
      SwapAmountInSplitRoute.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    if (message.tokenInDenom !== "") {
      writer.uint32(26).string(message.tokenInDenom);
    }
    if (message.tokenOutMinAmount !== "") {
      writer.uint32(34).string(message.tokenOutMinAmount);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgSplitRouteSwapExactAmountIn {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSplitRouteSwapExactAmountIn();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.sender = reader.string();
          break;
        case 2:
          message.routes.push(SwapAmountInSplitRoute.decode(reader, reader.uint32()));
          break;
        case 3:
          message.tokenInDenom = reader.string();
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
  fromPartial(object: Partial<MsgSplitRouteSwapExactAmountIn>): MsgSplitRouteSwapExactAmountIn {
    const message = createBaseMsgSplitRouteSwapExactAmountIn();
    message.sender = object.sender ?? "";
    message.routes = object.routes?.map(e => SwapAmountInSplitRoute.fromPartial(e)) || [];
    message.tokenInDenom = object.tokenInDenom ?? "";
    message.tokenOutMinAmount = object.tokenOutMinAmount ?? "";
    return message;
  },
  fromAmino(object: MsgSplitRouteSwapExactAmountInAmino): MsgSplitRouteSwapExactAmountIn {
    const message = createBaseMsgSplitRouteSwapExactAmountIn();
    if (object.sender !== undefined && object.sender !== null) {
      message.sender = object.sender;
    }
    message.routes = object.routes?.map(e => SwapAmountInSplitRoute.fromAmino(e)) || [];
    if (object.token_in_denom !== undefined && object.token_in_denom !== null) {
      message.tokenInDenom = object.token_in_denom;
    }
    if (object.token_out_min_amount !== undefined && object.token_out_min_amount !== null) {
      message.tokenOutMinAmount = object.token_out_min_amount;
    }
    return message;
  },
  toAmino(message: MsgSplitRouteSwapExactAmountIn): MsgSplitRouteSwapExactAmountInAmino {
    const obj: any = {};
    obj.sender = message.sender === "" ? undefined : message.sender;
    if (message.routes) {
      obj.routes = message.routes.map(e => e ? SwapAmountInSplitRoute.toAmino(e) : undefined);
    } else {
      obj.routes = message.routes;
    }
    obj.token_in_denom = message.tokenInDenom === "" ? undefined : message.tokenInDenom;
    obj.token_out_min_amount = message.tokenOutMinAmount === "" ? undefined : message.tokenOutMinAmount;
    return obj;
  },
  fromAminoMsg(object: MsgSplitRouteSwapExactAmountInAminoMsg): MsgSplitRouteSwapExactAmountIn {
    return MsgSplitRouteSwapExactAmountIn.fromAmino(object.value);
  },
  toAminoMsg(message: MsgSplitRouteSwapExactAmountIn): MsgSplitRouteSwapExactAmountInAminoMsg {
    return {
      type: "osmosis/poolmanager/split-amount-in",
      value: MsgSplitRouteSwapExactAmountIn.toAmino(message)
    };
  },
  fromProtoMsg(message: MsgSplitRouteSwapExactAmountInProtoMsg): MsgSplitRouteSwapExactAmountIn {
    return MsgSplitRouteSwapExactAmountIn.decode(message.value);
  },
  toProto(message: MsgSplitRouteSwapExactAmountIn): Uint8Array {
    return MsgSplitRouteSwapExactAmountIn.encode(message).finish();
  },
  toProtoMsg(message: MsgSplitRouteSwapExactAmountIn): MsgSplitRouteSwapExactAmountInProtoMsg {
    return {
      typeUrl: "/osmosis.poolmanager.v1beta1.MsgSplitRouteSwapExactAmountIn",
      value: MsgSplitRouteSwapExactAmountIn.encode(message).finish()
    };
  }
};
function createBaseMsgSplitRouteSwapExactAmountInResponse(): MsgSplitRouteSwapExactAmountInResponse {
  return {
    tokenOutAmount: ""
  };
}
export const MsgSplitRouteSwapExactAmountInResponse = {
  typeUrl: "/osmosis.poolmanager.v1beta1.MsgSplitRouteSwapExactAmountInResponse",
  aminoType: "osmosis/poolmanager/split-route-swap-exact-amount-in-response",
  is(o: any): o is MsgSplitRouteSwapExactAmountInResponse {
    return o && (o.$typeUrl === MsgSplitRouteSwapExactAmountInResponse.typeUrl || typeof o.tokenOutAmount === "string");
  },
  isSDK(o: any): o is MsgSplitRouteSwapExactAmountInResponseSDKType {
    return o && (o.$typeUrl === MsgSplitRouteSwapExactAmountInResponse.typeUrl || typeof o.token_out_amount === "string");
  },
  isAmino(o: any): o is MsgSplitRouteSwapExactAmountInResponseAmino {
    return o && (o.$typeUrl === MsgSplitRouteSwapExactAmountInResponse.typeUrl || typeof o.token_out_amount === "string");
  },
  encode(message: MsgSplitRouteSwapExactAmountInResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.tokenOutAmount !== "") {
      writer.uint32(10).string(message.tokenOutAmount);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgSplitRouteSwapExactAmountInResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSplitRouteSwapExactAmountInResponse();
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
  fromPartial(object: Partial<MsgSplitRouteSwapExactAmountInResponse>): MsgSplitRouteSwapExactAmountInResponse {
    const message = createBaseMsgSplitRouteSwapExactAmountInResponse();
    message.tokenOutAmount = object.tokenOutAmount ?? "";
    return message;
  },
  fromAmino(object: MsgSplitRouteSwapExactAmountInResponseAmino): MsgSplitRouteSwapExactAmountInResponse {
    const message = createBaseMsgSplitRouteSwapExactAmountInResponse();
    if (object.token_out_amount !== undefined && object.token_out_amount !== null) {
      message.tokenOutAmount = object.token_out_amount;
    }
    return message;
  },
  toAmino(message: MsgSplitRouteSwapExactAmountInResponse): MsgSplitRouteSwapExactAmountInResponseAmino {
    const obj: any = {};
    obj.token_out_amount = message.tokenOutAmount === "" ? undefined : message.tokenOutAmount;
    return obj;
  },
  fromAminoMsg(object: MsgSplitRouteSwapExactAmountInResponseAminoMsg): MsgSplitRouteSwapExactAmountInResponse {
    return MsgSplitRouteSwapExactAmountInResponse.fromAmino(object.value);
  },
  toAminoMsg(message: MsgSplitRouteSwapExactAmountInResponse): MsgSplitRouteSwapExactAmountInResponseAminoMsg {
    return {
      type: "osmosis/poolmanager/split-route-swap-exact-amount-in-response",
      value: MsgSplitRouteSwapExactAmountInResponse.toAmino(message)
    };
  },
  fromProtoMsg(message: MsgSplitRouteSwapExactAmountInResponseProtoMsg): MsgSplitRouteSwapExactAmountInResponse {
    return MsgSplitRouteSwapExactAmountInResponse.decode(message.value);
  },
  toProto(message: MsgSplitRouteSwapExactAmountInResponse): Uint8Array {
    return MsgSplitRouteSwapExactAmountInResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgSplitRouteSwapExactAmountInResponse): MsgSplitRouteSwapExactAmountInResponseProtoMsg {
    return {
      typeUrl: "/osmosis.poolmanager.v1beta1.MsgSplitRouteSwapExactAmountInResponse",
      value: MsgSplitRouteSwapExactAmountInResponse.encode(message).finish()
    };
  }
};
function createBaseMsgSwapExactAmountOut(): MsgSwapExactAmountOut {
  return {
    sender: "",
    routes: [],
    tokenInMaxAmount: "",
    tokenOut: Coin.fromPartial({})
  };
}
export const MsgSwapExactAmountOut = {
  typeUrl: "/osmosis.poolmanager.v1beta1.MsgSwapExactAmountOut",
  aminoType: "osmosis/poolmanager/swap-exact-amount-out",
  is(o: any): o is MsgSwapExactAmountOut {
    return o && (o.$typeUrl === MsgSwapExactAmountOut.typeUrl || typeof o.sender === "string" && Array.isArray(o.routes) && (!o.routes.length || SwapAmountOutRoute.is(o.routes[0])) && typeof o.tokenInMaxAmount === "string" && Coin.is(o.tokenOut));
  },
  isSDK(o: any): o is MsgSwapExactAmountOutSDKType {
    return o && (o.$typeUrl === MsgSwapExactAmountOut.typeUrl || typeof o.sender === "string" && Array.isArray(o.routes) && (!o.routes.length || SwapAmountOutRoute.isSDK(o.routes[0])) && typeof o.token_in_max_amount === "string" && Coin.isSDK(o.token_out));
  },
  isAmino(o: any): o is MsgSwapExactAmountOutAmino {
    return o && (o.$typeUrl === MsgSwapExactAmountOut.typeUrl || typeof o.sender === "string" && Array.isArray(o.routes) && (!o.routes.length || SwapAmountOutRoute.isAmino(o.routes[0])) && typeof o.token_in_max_amount === "string" && Coin.isAmino(o.token_out));
  },
  encode(message: MsgSwapExactAmountOut, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
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
  decode(input: BinaryReader | Uint8Array, length?: number): MsgSwapExactAmountOut {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSwapExactAmountOut();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.sender = reader.string();
          break;
        case 2:
          message.routes.push(SwapAmountOutRoute.decode(reader, reader.uint32()));
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
  fromPartial(object: Partial<MsgSwapExactAmountOut>): MsgSwapExactAmountOut {
    const message = createBaseMsgSwapExactAmountOut();
    message.sender = object.sender ?? "";
    message.routes = object.routes?.map(e => SwapAmountOutRoute.fromPartial(e)) || [];
    message.tokenInMaxAmount = object.tokenInMaxAmount ?? "";
    message.tokenOut = object.tokenOut !== undefined && object.tokenOut !== null ? Coin.fromPartial(object.tokenOut) : undefined;
    return message;
  },
  fromAmino(object: MsgSwapExactAmountOutAmino): MsgSwapExactAmountOut {
    const message = createBaseMsgSwapExactAmountOut();
    if (object.sender !== undefined && object.sender !== null) {
      message.sender = object.sender;
    }
    message.routes = object.routes?.map(e => SwapAmountOutRoute.fromAmino(e)) || [];
    if (object.token_in_max_amount !== undefined && object.token_in_max_amount !== null) {
      message.tokenInMaxAmount = object.token_in_max_amount;
    }
    if (object.token_out !== undefined && object.token_out !== null) {
      message.tokenOut = Coin.fromAmino(object.token_out);
    }
    return message;
  },
  toAmino(message: MsgSwapExactAmountOut): MsgSwapExactAmountOutAmino {
    const obj: any = {};
    obj.sender = message.sender === "" ? undefined : message.sender;
    if (message.routes) {
      obj.routes = message.routes.map(e => e ? SwapAmountOutRoute.toAmino(e) : undefined);
    } else {
      obj.routes = message.routes;
    }
    obj.token_in_max_amount = message.tokenInMaxAmount === "" ? undefined : message.tokenInMaxAmount;
    obj.token_out = message.tokenOut ? Coin.toAmino(message.tokenOut) : undefined;
    return obj;
  },
  fromAminoMsg(object: MsgSwapExactAmountOutAminoMsg): MsgSwapExactAmountOut {
    return MsgSwapExactAmountOut.fromAmino(object.value);
  },
  toAminoMsg(message: MsgSwapExactAmountOut): MsgSwapExactAmountOutAminoMsg {
    return {
      type: "osmosis/poolmanager/swap-exact-amount-out",
      value: MsgSwapExactAmountOut.toAmino(message)
    };
  },
  fromProtoMsg(message: MsgSwapExactAmountOutProtoMsg): MsgSwapExactAmountOut {
    return MsgSwapExactAmountOut.decode(message.value);
  },
  toProto(message: MsgSwapExactAmountOut): Uint8Array {
    return MsgSwapExactAmountOut.encode(message).finish();
  },
  toProtoMsg(message: MsgSwapExactAmountOut): MsgSwapExactAmountOutProtoMsg {
    return {
      typeUrl: "/osmosis.poolmanager.v1beta1.MsgSwapExactAmountOut",
      value: MsgSwapExactAmountOut.encode(message).finish()
    };
  }
};
function createBaseMsgSwapExactAmountOutResponse(): MsgSwapExactAmountOutResponse {
  return {
    tokenInAmount: ""
  };
}
export const MsgSwapExactAmountOutResponse = {
  typeUrl: "/osmosis.poolmanager.v1beta1.MsgSwapExactAmountOutResponse",
  aminoType: "osmosis/poolmanager/swap-exact-amount-out-response",
  is(o: any): o is MsgSwapExactAmountOutResponse {
    return o && (o.$typeUrl === MsgSwapExactAmountOutResponse.typeUrl || typeof o.tokenInAmount === "string");
  },
  isSDK(o: any): o is MsgSwapExactAmountOutResponseSDKType {
    return o && (o.$typeUrl === MsgSwapExactAmountOutResponse.typeUrl || typeof o.token_in_amount === "string");
  },
  isAmino(o: any): o is MsgSwapExactAmountOutResponseAmino {
    return o && (o.$typeUrl === MsgSwapExactAmountOutResponse.typeUrl || typeof o.token_in_amount === "string");
  },
  encode(message: MsgSwapExactAmountOutResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.tokenInAmount !== "") {
      writer.uint32(10).string(message.tokenInAmount);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgSwapExactAmountOutResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
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
  fromPartial(object: Partial<MsgSwapExactAmountOutResponse>): MsgSwapExactAmountOutResponse {
    const message = createBaseMsgSwapExactAmountOutResponse();
    message.tokenInAmount = object.tokenInAmount ?? "";
    return message;
  },
  fromAmino(object: MsgSwapExactAmountOutResponseAmino): MsgSwapExactAmountOutResponse {
    const message = createBaseMsgSwapExactAmountOutResponse();
    if (object.token_in_amount !== undefined && object.token_in_amount !== null) {
      message.tokenInAmount = object.token_in_amount;
    }
    return message;
  },
  toAmino(message: MsgSwapExactAmountOutResponse): MsgSwapExactAmountOutResponseAmino {
    const obj: any = {};
    obj.token_in_amount = message.tokenInAmount === "" ? undefined : message.tokenInAmount;
    return obj;
  },
  fromAminoMsg(object: MsgSwapExactAmountOutResponseAminoMsg): MsgSwapExactAmountOutResponse {
    return MsgSwapExactAmountOutResponse.fromAmino(object.value);
  },
  toAminoMsg(message: MsgSwapExactAmountOutResponse): MsgSwapExactAmountOutResponseAminoMsg {
    return {
      type: "osmosis/poolmanager/swap-exact-amount-out-response",
      value: MsgSwapExactAmountOutResponse.toAmino(message)
    };
  },
  fromProtoMsg(message: MsgSwapExactAmountOutResponseProtoMsg): MsgSwapExactAmountOutResponse {
    return MsgSwapExactAmountOutResponse.decode(message.value);
  },
  toProto(message: MsgSwapExactAmountOutResponse): Uint8Array {
    return MsgSwapExactAmountOutResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgSwapExactAmountOutResponse): MsgSwapExactAmountOutResponseProtoMsg {
    return {
      typeUrl: "/osmosis.poolmanager.v1beta1.MsgSwapExactAmountOutResponse",
      value: MsgSwapExactAmountOutResponse.encode(message).finish()
    };
  }
};
function createBaseMsgSplitRouteSwapExactAmountOut(): MsgSplitRouteSwapExactAmountOut {
  return {
    sender: "",
    routes: [],
    tokenOutDenom: "",
    tokenInMaxAmount: ""
  };
}
export const MsgSplitRouteSwapExactAmountOut = {
  typeUrl: "/osmosis.poolmanager.v1beta1.MsgSplitRouteSwapExactAmountOut",
  aminoType: "osmosis/poolmanager/split-amount-out",
  is(o: any): o is MsgSplitRouteSwapExactAmountOut {
    return o && (o.$typeUrl === MsgSplitRouteSwapExactAmountOut.typeUrl || typeof o.sender === "string" && Array.isArray(o.routes) && (!o.routes.length || SwapAmountOutSplitRoute.is(o.routes[0])) && typeof o.tokenOutDenom === "string" && typeof o.tokenInMaxAmount === "string");
  },
  isSDK(o: any): o is MsgSplitRouteSwapExactAmountOutSDKType {
    return o && (o.$typeUrl === MsgSplitRouteSwapExactAmountOut.typeUrl || typeof o.sender === "string" && Array.isArray(o.routes) && (!o.routes.length || SwapAmountOutSplitRoute.isSDK(o.routes[0])) && typeof o.token_out_denom === "string" && typeof o.token_in_max_amount === "string");
  },
  isAmino(o: any): o is MsgSplitRouteSwapExactAmountOutAmino {
    return o && (o.$typeUrl === MsgSplitRouteSwapExactAmountOut.typeUrl || typeof o.sender === "string" && Array.isArray(o.routes) && (!o.routes.length || SwapAmountOutSplitRoute.isAmino(o.routes[0])) && typeof o.token_out_denom === "string" && typeof o.token_in_max_amount === "string");
  },
  encode(message: MsgSplitRouteSwapExactAmountOut, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.sender !== "") {
      writer.uint32(10).string(message.sender);
    }
    for (const v of message.routes) {
      SwapAmountOutSplitRoute.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    if (message.tokenOutDenom !== "") {
      writer.uint32(26).string(message.tokenOutDenom);
    }
    if (message.tokenInMaxAmount !== "") {
      writer.uint32(34).string(message.tokenInMaxAmount);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgSplitRouteSwapExactAmountOut {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSplitRouteSwapExactAmountOut();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.sender = reader.string();
          break;
        case 2:
          message.routes.push(SwapAmountOutSplitRoute.decode(reader, reader.uint32()));
          break;
        case 3:
          message.tokenOutDenom = reader.string();
          break;
        case 4:
          message.tokenInMaxAmount = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<MsgSplitRouteSwapExactAmountOut>): MsgSplitRouteSwapExactAmountOut {
    const message = createBaseMsgSplitRouteSwapExactAmountOut();
    message.sender = object.sender ?? "";
    message.routes = object.routes?.map(e => SwapAmountOutSplitRoute.fromPartial(e)) || [];
    message.tokenOutDenom = object.tokenOutDenom ?? "";
    message.tokenInMaxAmount = object.tokenInMaxAmount ?? "";
    return message;
  },
  fromAmino(object: MsgSplitRouteSwapExactAmountOutAmino): MsgSplitRouteSwapExactAmountOut {
    const message = createBaseMsgSplitRouteSwapExactAmountOut();
    if (object.sender !== undefined && object.sender !== null) {
      message.sender = object.sender;
    }
    message.routes = object.routes?.map(e => SwapAmountOutSplitRoute.fromAmino(e)) || [];
    if (object.token_out_denom !== undefined && object.token_out_denom !== null) {
      message.tokenOutDenom = object.token_out_denom;
    }
    if (object.token_in_max_amount !== undefined && object.token_in_max_amount !== null) {
      message.tokenInMaxAmount = object.token_in_max_amount;
    }
    return message;
  },
  toAmino(message: MsgSplitRouteSwapExactAmountOut): MsgSplitRouteSwapExactAmountOutAmino {
    const obj: any = {};
    obj.sender = message.sender === "" ? undefined : message.sender;
    if (message.routes) {
      obj.routes = message.routes.map(e => e ? SwapAmountOutSplitRoute.toAmino(e) : undefined);
    } else {
      obj.routes = message.routes;
    }
    obj.token_out_denom = message.tokenOutDenom === "" ? undefined : message.tokenOutDenom;
    obj.token_in_max_amount = message.tokenInMaxAmount === "" ? undefined : message.tokenInMaxAmount;
    return obj;
  },
  fromAminoMsg(object: MsgSplitRouteSwapExactAmountOutAminoMsg): MsgSplitRouteSwapExactAmountOut {
    return MsgSplitRouteSwapExactAmountOut.fromAmino(object.value);
  },
  toAminoMsg(message: MsgSplitRouteSwapExactAmountOut): MsgSplitRouteSwapExactAmountOutAminoMsg {
    return {
      type: "osmosis/poolmanager/split-amount-out",
      value: MsgSplitRouteSwapExactAmountOut.toAmino(message)
    };
  },
  fromProtoMsg(message: MsgSplitRouteSwapExactAmountOutProtoMsg): MsgSplitRouteSwapExactAmountOut {
    return MsgSplitRouteSwapExactAmountOut.decode(message.value);
  },
  toProto(message: MsgSplitRouteSwapExactAmountOut): Uint8Array {
    return MsgSplitRouteSwapExactAmountOut.encode(message).finish();
  },
  toProtoMsg(message: MsgSplitRouteSwapExactAmountOut): MsgSplitRouteSwapExactAmountOutProtoMsg {
    return {
      typeUrl: "/osmosis.poolmanager.v1beta1.MsgSplitRouteSwapExactAmountOut",
      value: MsgSplitRouteSwapExactAmountOut.encode(message).finish()
    };
  }
};
function createBaseMsgSplitRouteSwapExactAmountOutResponse(): MsgSplitRouteSwapExactAmountOutResponse {
  return {
    tokenInAmount: ""
  };
}
export const MsgSplitRouteSwapExactAmountOutResponse = {
  typeUrl: "/osmosis.poolmanager.v1beta1.MsgSplitRouteSwapExactAmountOutResponse",
  aminoType: "osmosis/poolmanager/split-route-swap-exact-amount-out-response",
  is(o: any): o is MsgSplitRouteSwapExactAmountOutResponse {
    return o && (o.$typeUrl === MsgSplitRouteSwapExactAmountOutResponse.typeUrl || typeof o.tokenInAmount === "string");
  },
  isSDK(o: any): o is MsgSplitRouteSwapExactAmountOutResponseSDKType {
    return o && (o.$typeUrl === MsgSplitRouteSwapExactAmountOutResponse.typeUrl || typeof o.token_in_amount === "string");
  },
  isAmino(o: any): o is MsgSplitRouteSwapExactAmountOutResponseAmino {
    return o && (o.$typeUrl === MsgSplitRouteSwapExactAmountOutResponse.typeUrl || typeof o.token_in_amount === "string");
  },
  encode(message: MsgSplitRouteSwapExactAmountOutResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.tokenInAmount !== "") {
      writer.uint32(10).string(message.tokenInAmount);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgSplitRouteSwapExactAmountOutResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSplitRouteSwapExactAmountOutResponse();
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
  fromPartial(object: Partial<MsgSplitRouteSwapExactAmountOutResponse>): MsgSplitRouteSwapExactAmountOutResponse {
    const message = createBaseMsgSplitRouteSwapExactAmountOutResponse();
    message.tokenInAmount = object.tokenInAmount ?? "";
    return message;
  },
  fromAmino(object: MsgSplitRouteSwapExactAmountOutResponseAmino): MsgSplitRouteSwapExactAmountOutResponse {
    const message = createBaseMsgSplitRouteSwapExactAmountOutResponse();
    if (object.token_in_amount !== undefined && object.token_in_amount !== null) {
      message.tokenInAmount = object.token_in_amount;
    }
    return message;
  },
  toAmino(message: MsgSplitRouteSwapExactAmountOutResponse): MsgSplitRouteSwapExactAmountOutResponseAmino {
    const obj: any = {};
    obj.token_in_amount = message.tokenInAmount === "" ? undefined : message.tokenInAmount;
    return obj;
  },
  fromAminoMsg(object: MsgSplitRouteSwapExactAmountOutResponseAminoMsg): MsgSplitRouteSwapExactAmountOutResponse {
    return MsgSplitRouteSwapExactAmountOutResponse.fromAmino(object.value);
  },
  toAminoMsg(message: MsgSplitRouteSwapExactAmountOutResponse): MsgSplitRouteSwapExactAmountOutResponseAminoMsg {
    return {
      type: "osmosis/poolmanager/split-route-swap-exact-amount-out-response",
      value: MsgSplitRouteSwapExactAmountOutResponse.toAmino(message)
    };
  },
  fromProtoMsg(message: MsgSplitRouteSwapExactAmountOutResponseProtoMsg): MsgSplitRouteSwapExactAmountOutResponse {
    return MsgSplitRouteSwapExactAmountOutResponse.decode(message.value);
  },
  toProto(message: MsgSplitRouteSwapExactAmountOutResponse): Uint8Array {
    return MsgSplitRouteSwapExactAmountOutResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgSplitRouteSwapExactAmountOutResponse): MsgSplitRouteSwapExactAmountOutResponseProtoMsg {
    return {
      typeUrl: "/osmosis.poolmanager.v1beta1.MsgSplitRouteSwapExactAmountOutResponse",
      value: MsgSplitRouteSwapExactAmountOutResponse.encode(message).finish()
    };
  }
};
function createBaseMsgSetDenomPairTakerFee(): MsgSetDenomPairTakerFee {
  return {
    sender: "",
    denomPairTakerFee: []
  };
}
export const MsgSetDenomPairTakerFee = {
  typeUrl: "/osmosis.poolmanager.v1beta1.MsgSetDenomPairTakerFee",
  aminoType: "osmosis/poolmanager/set-denom-pair-taker-fee",
  is(o: any): o is MsgSetDenomPairTakerFee {
    return o && (o.$typeUrl === MsgSetDenomPairTakerFee.typeUrl || typeof o.sender === "string" && Array.isArray(o.denomPairTakerFee) && (!o.denomPairTakerFee.length || DenomPairTakerFee.is(o.denomPairTakerFee[0])));
  },
  isSDK(o: any): o is MsgSetDenomPairTakerFeeSDKType {
    return o && (o.$typeUrl === MsgSetDenomPairTakerFee.typeUrl || typeof o.sender === "string" && Array.isArray(o.denom_pair_taker_fee) && (!o.denom_pair_taker_fee.length || DenomPairTakerFee.isSDK(o.denom_pair_taker_fee[0])));
  },
  isAmino(o: any): o is MsgSetDenomPairTakerFeeAmino {
    return o && (o.$typeUrl === MsgSetDenomPairTakerFee.typeUrl || typeof o.sender === "string" && Array.isArray(o.denom_pair_taker_fee) && (!o.denom_pair_taker_fee.length || DenomPairTakerFee.isAmino(o.denom_pair_taker_fee[0])));
  },
  encode(message: MsgSetDenomPairTakerFee, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.sender !== "") {
      writer.uint32(10).string(message.sender);
    }
    for (const v of message.denomPairTakerFee) {
      DenomPairTakerFee.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgSetDenomPairTakerFee {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSetDenomPairTakerFee();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.sender = reader.string();
          break;
        case 2:
          message.denomPairTakerFee.push(DenomPairTakerFee.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<MsgSetDenomPairTakerFee>): MsgSetDenomPairTakerFee {
    const message = createBaseMsgSetDenomPairTakerFee();
    message.sender = object.sender ?? "";
    message.denomPairTakerFee = object.denomPairTakerFee?.map(e => DenomPairTakerFee.fromPartial(e)) || [];
    return message;
  },
  fromAmino(object: MsgSetDenomPairTakerFeeAmino): MsgSetDenomPairTakerFee {
    const message = createBaseMsgSetDenomPairTakerFee();
    if (object.sender !== undefined && object.sender !== null) {
      message.sender = object.sender;
    }
    message.denomPairTakerFee = object.denom_pair_taker_fee?.map(e => DenomPairTakerFee.fromAmino(e)) || [];
    return message;
  },
  toAmino(message: MsgSetDenomPairTakerFee): MsgSetDenomPairTakerFeeAmino {
    const obj: any = {};
    obj.sender = message.sender === "" ? undefined : message.sender;
    if (message.denomPairTakerFee) {
      obj.denom_pair_taker_fee = message.denomPairTakerFee.map(e => e ? DenomPairTakerFee.toAmino(e) : undefined);
    } else {
      obj.denom_pair_taker_fee = message.denomPairTakerFee;
    }
    return obj;
  },
  fromAminoMsg(object: MsgSetDenomPairTakerFeeAminoMsg): MsgSetDenomPairTakerFee {
    return MsgSetDenomPairTakerFee.fromAmino(object.value);
  },
  toAminoMsg(message: MsgSetDenomPairTakerFee): MsgSetDenomPairTakerFeeAminoMsg {
    return {
      type: "osmosis/poolmanager/set-denom-pair-taker-fee",
      value: MsgSetDenomPairTakerFee.toAmino(message)
    };
  },
  fromProtoMsg(message: MsgSetDenomPairTakerFeeProtoMsg): MsgSetDenomPairTakerFee {
    return MsgSetDenomPairTakerFee.decode(message.value);
  },
  toProto(message: MsgSetDenomPairTakerFee): Uint8Array {
    return MsgSetDenomPairTakerFee.encode(message).finish();
  },
  toProtoMsg(message: MsgSetDenomPairTakerFee): MsgSetDenomPairTakerFeeProtoMsg {
    return {
      typeUrl: "/osmosis.poolmanager.v1beta1.MsgSetDenomPairTakerFee",
      value: MsgSetDenomPairTakerFee.encode(message).finish()
    };
  }
};
function createBaseMsgSetDenomPairTakerFeeResponse(): MsgSetDenomPairTakerFeeResponse {
  return {
    success: false
  };
}
export const MsgSetDenomPairTakerFeeResponse = {
  typeUrl: "/osmosis.poolmanager.v1beta1.MsgSetDenomPairTakerFeeResponse",
  aminoType: "osmosis/poolmanager/set-denom-pair-taker-fee-response",
  is(o: any): o is MsgSetDenomPairTakerFeeResponse {
    return o && (o.$typeUrl === MsgSetDenomPairTakerFeeResponse.typeUrl || typeof o.success === "boolean");
  },
  isSDK(o: any): o is MsgSetDenomPairTakerFeeResponseSDKType {
    return o && (o.$typeUrl === MsgSetDenomPairTakerFeeResponse.typeUrl || typeof o.success === "boolean");
  },
  isAmino(o: any): o is MsgSetDenomPairTakerFeeResponseAmino {
    return o && (o.$typeUrl === MsgSetDenomPairTakerFeeResponse.typeUrl || typeof o.success === "boolean");
  },
  encode(message: MsgSetDenomPairTakerFeeResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.success === true) {
      writer.uint32(8).bool(message.success);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgSetDenomPairTakerFeeResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSetDenomPairTakerFeeResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.success = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<MsgSetDenomPairTakerFeeResponse>): MsgSetDenomPairTakerFeeResponse {
    const message = createBaseMsgSetDenomPairTakerFeeResponse();
    message.success = object.success ?? false;
    return message;
  },
  fromAmino(object: MsgSetDenomPairTakerFeeResponseAmino): MsgSetDenomPairTakerFeeResponse {
    const message = createBaseMsgSetDenomPairTakerFeeResponse();
    if (object.success !== undefined && object.success !== null) {
      message.success = object.success;
    }
    return message;
  },
  toAmino(message: MsgSetDenomPairTakerFeeResponse): MsgSetDenomPairTakerFeeResponseAmino {
    const obj: any = {};
    obj.success = message.success === false ? undefined : message.success;
    return obj;
  },
  fromAminoMsg(object: MsgSetDenomPairTakerFeeResponseAminoMsg): MsgSetDenomPairTakerFeeResponse {
    return MsgSetDenomPairTakerFeeResponse.fromAmino(object.value);
  },
  toAminoMsg(message: MsgSetDenomPairTakerFeeResponse): MsgSetDenomPairTakerFeeResponseAminoMsg {
    return {
      type: "osmosis/poolmanager/set-denom-pair-taker-fee-response",
      value: MsgSetDenomPairTakerFeeResponse.toAmino(message)
    };
  },
  fromProtoMsg(message: MsgSetDenomPairTakerFeeResponseProtoMsg): MsgSetDenomPairTakerFeeResponse {
    return MsgSetDenomPairTakerFeeResponse.decode(message.value);
  },
  toProto(message: MsgSetDenomPairTakerFeeResponse): Uint8Array {
    return MsgSetDenomPairTakerFeeResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgSetDenomPairTakerFeeResponse): MsgSetDenomPairTakerFeeResponseProtoMsg {
    return {
      typeUrl: "/osmosis.poolmanager.v1beta1.MsgSetDenomPairTakerFeeResponse",
      value: MsgSetDenomPairTakerFeeResponse.encode(message).finish()
    };
  }
};
function createBaseDenomPairTakerFee(): DenomPairTakerFee {
  return {
    denom0: "",
    denom1: "",
    takerFee: ""
  };
}
export const DenomPairTakerFee = {
  typeUrl: "/osmosis.poolmanager.v1beta1.DenomPairTakerFee",
  aminoType: "osmosis/poolmanager/denom-pair-taker-fee",
  is(o: any): o is DenomPairTakerFee {
    return o && (o.$typeUrl === DenomPairTakerFee.typeUrl || typeof o.denom0 === "string" && typeof o.denom1 === "string" && typeof o.takerFee === "string");
  },
  isSDK(o: any): o is DenomPairTakerFeeSDKType {
    return o && (o.$typeUrl === DenomPairTakerFee.typeUrl || typeof o.denom0 === "string" && typeof o.denom1 === "string" && typeof o.taker_fee === "string");
  },
  isAmino(o: any): o is DenomPairTakerFeeAmino {
    return o && (o.$typeUrl === DenomPairTakerFee.typeUrl || typeof o.denom0 === "string" && typeof o.denom1 === "string" && typeof o.taker_fee === "string");
  },
  encode(message: DenomPairTakerFee, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.denom0 !== "") {
      writer.uint32(10).string(message.denom0);
    }
    if (message.denom1 !== "") {
      writer.uint32(18).string(message.denom1);
    }
    if (message.takerFee !== "") {
      writer.uint32(26).string(Decimal.fromUserInput(message.takerFee, 18).atomics);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): DenomPairTakerFee {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDenomPairTakerFee();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.denom0 = reader.string();
          break;
        case 2:
          message.denom1 = reader.string();
          break;
        case 3:
          message.takerFee = Decimal.fromAtomics(reader.string(), 18).toString();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<DenomPairTakerFee>): DenomPairTakerFee {
    const message = createBaseDenomPairTakerFee();
    message.denom0 = object.denom0 ?? "";
    message.denom1 = object.denom1 ?? "";
    message.takerFee = object.takerFee ?? "";
    return message;
  },
  fromAmino(object: DenomPairTakerFeeAmino): DenomPairTakerFee {
    const message = createBaseDenomPairTakerFee();
    if (object.denom0 !== undefined && object.denom0 !== null) {
      message.denom0 = object.denom0;
    }
    if (object.denom1 !== undefined && object.denom1 !== null) {
      message.denom1 = object.denom1;
    }
    if (object.taker_fee !== undefined && object.taker_fee !== null) {
      message.takerFee = object.taker_fee;
    }
    return message;
  },
  toAmino(message: DenomPairTakerFee): DenomPairTakerFeeAmino {
    const obj: any = {};
    obj.denom0 = message.denom0 === "" ? undefined : message.denom0;
    obj.denom1 = message.denom1 === "" ? undefined : message.denom1;
    obj.taker_fee = message.takerFee === "" ? undefined : message.takerFee;
    return obj;
  },
  fromAminoMsg(object: DenomPairTakerFeeAminoMsg): DenomPairTakerFee {
    return DenomPairTakerFee.fromAmino(object.value);
  },
  toAminoMsg(message: DenomPairTakerFee): DenomPairTakerFeeAminoMsg {
    return {
      type: "osmosis/poolmanager/denom-pair-taker-fee",
      value: DenomPairTakerFee.toAmino(message)
    };
  },
  fromProtoMsg(message: DenomPairTakerFeeProtoMsg): DenomPairTakerFee {
    return DenomPairTakerFee.decode(message.value);
  },
  toProto(message: DenomPairTakerFee): Uint8Array {
    return DenomPairTakerFee.encode(message).finish();
  },
  toProtoMsg(message: DenomPairTakerFee): DenomPairTakerFeeProtoMsg {
    return {
      typeUrl: "/osmosis.poolmanager.v1beta1.DenomPairTakerFee",
      value: DenomPairTakerFee.encode(message).finish()
    };
  }
};