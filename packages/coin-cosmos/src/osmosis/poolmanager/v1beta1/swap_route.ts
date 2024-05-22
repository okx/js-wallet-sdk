import { BinaryReader, BinaryWriter } from "../../../binary";
export interface SwapAmountInRoute {
    poolId: bigint;
    tokenOutDenom: string;
}
export interface SwapAmountInRouteProtoMsg {
    typeUrl: "/osmosis.poolmanager.v1beta1.SwapAmountInRoute";
    value: Uint8Array;
}
export interface SwapAmountInRouteAmino {
    pool_id?: string;
    token_out_denom?: string;
}
export interface SwapAmountInRouteAminoMsg {
    type: "osmosis/poolmanager/swap-amount-in-route";
    value: SwapAmountInRouteAmino;
}
export interface SwapAmountInRouteSDKType {
    pool_id: bigint;
    token_out_denom: string;
}
export interface SwapAmountOutRoute {
    poolId: bigint;
    tokenInDenom: string;
}
export interface SwapAmountOutRouteProtoMsg {
    typeUrl: "/osmosis.poolmanager.v1beta1.SwapAmountOutRoute";
    value: Uint8Array;
}
export interface SwapAmountOutRouteAmino {
    pool_id?: string;
    token_in_denom?: string;
}
export interface SwapAmountOutRouteAminoMsg {
    type: "osmosis/poolmanager/swap-amount-out-route";
    value: SwapAmountOutRouteAmino;
}
export interface SwapAmountOutRouteSDKType {
    pool_id: bigint;
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
    pools?: SwapAmountInRouteAmino[];
    token_in_amount?: string;
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
    pools?: SwapAmountOutRouteAmino[];
    token_out_amount?: string;
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
        poolId: BigInt(0),
        tokenOutDenom: ""
    };
}
export const SwapAmountInRoute = {
    typeUrl: "/osmosis.poolmanager.v1beta1.SwapAmountInRoute",
    aminoType: "osmosis/poolmanager/swap-amount-in-route",
    is(o: any): o is SwapAmountInRoute {
        return o && (o.$typeUrl === SwapAmountInRoute.typeUrl || typeof o.poolId === "bigint" && typeof o.tokenOutDenom === "string");
    },
    isSDK(o: any): o is SwapAmountInRouteSDKType {
        return o && (o.$typeUrl === SwapAmountInRoute.typeUrl || typeof o.pool_id === "bigint" && typeof o.token_out_denom === "string");
    },
    isAmino(o: any): o is SwapAmountInRouteAmino {
        return o && (o.$typeUrl === SwapAmountInRoute.typeUrl || typeof o.pool_id === "bigint" && typeof o.token_out_denom === "string");
    },
    encode(message: SwapAmountInRoute, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        if (message.poolId !== BigInt(0)) {
            writer.uint32(8).uint64(message.poolId);
        }
        if (message.tokenOutDenom !== "") {
            writer.uint32(18).string(message.tokenOutDenom);
        }
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): SwapAmountInRoute {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseSwapAmountInRoute();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.poolId = reader.uint64();
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
        message.poolId = object.poolId !== undefined && object.poolId !== null ? BigInt(object.poolId.toString()) : BigInt(0);
        message.tokenOutDenom = object.tokenOutDenom ?? "";
        return message;
    },
    fromAmino(object: SwapAmountInRouteAmino): SwapAmountInRoute {
        const message = createBaseSwapAmountInRoute();
        if (object.pool_id !== undefined && object.pool_id !== null) {
            message.poolId = BigInt(object.pool_id);
        }
        if (object.token_out_denom !== undefined && object.token_out_denom !== null) {
            message.tokenOutDenom = object.token_out_denom;
        }
        return message;
    },
    toAmino(message: SwapAmountInRoute): SwapAmountInRouteAmino {
        const obj: any = {};
        obj.pool_id = message.poolId !== BigInt(0) ? message.poolId.toString() : undefined;
        obj.token_out_denom = message.tokenOutDenom === "" ? undefined : message.tokenOutDenom;
        return obj;
    },
    fromAminoMsg(object: SwapAmountInRouteAminoMsg): SwapAmountInRoute {
        return SwapAmountInRoute.fromAmino(object.value);
    },
    toAminoMsg(message: SwapAmountInRoute): SwapAmountInRouteAminoMsg {
        return {
            type: "osmosis/poolmanager/swap-amount-in-route",
            value: SwapAmountInRoute.toAmino(message)
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
            value: SwapAmountInRoute.encode(message).finish()
        };
    }
};
function createBaseSwapAmountOutRoute(): SwapAmountOutRoute {
    return {
        poolId: BigInt(0),
        tokenInDenom: ""
    };
}
export const SwapAmountOutRoute = {
    typeUrl: "/osmosis.poolmanager.v1beta1.SwapAmountOutRoute",
    aminoType: "osmosis/poolmanager/swap-amount-out-route",
    is(o: any): o is SwapAmountOutRoute {
        return o && (o.$typeUrl === SwapAmountOutRoute.typeUrl || typeof o.poolId === "bigint" && typeof o.tokenInDenom === "string");
    },
    isSDK(o: any): o is SwapAmountOutRouteSDKType {
        return o && (o.$typeUrl === SwapAmountOutRoute.typeUrl || typeof o.pool_id === "bigint" && typeof o.token_in_denom === "string");
    },
    isAmino(o: any): o is SwapAmountOutRouteAmino {
        return o && (o.$typeUrl === SwapAmountOutRoute.typeUrl || typeof o.pool_id === "bigint" && typeof o.token_in_denom === "string");
    },
    encode(message: SwapAmountOutRoute, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        if (message.poolId !== BigInt(0)) {
            writer.uint32(8).uint64(message.poolId);
        }
        if (message.tokenInDenom !== "") {
            writer.uint32(18).string(message.tokenInDenom);
        }
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): SwapAmountOutRoute {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseSwapAmountOutRoute();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.poolId = reader.uint64();
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
        message.poolId = object.poolId !== undefined && object.poolId !== null ? BigInt(object.poolId.toString()) : BigInt(0);
        message.tokenInDenom = object.tokenInDenom ?? "";
        return message;
    },
    fromAmino(object: SwapAmountOutRouteAmino): SwapAmountOutRoute {
        const message = createBaseSwapAmountOutRoute();
        if (object.pool_id !== undefined && object.pool_id !== null) {
            message.poolId = BigInt(object.pool_id);
        }
        if (object.token_in_denom !== undefined && object.token_in_denom !== null) {
            message.tokenInDenom = object.token_in_denom;
        }
        return message;
    },
    toAmino(message: SwapAmountOutRoute): SwapAmountOutRouteAmino {
        const obj: any = {};
        obj.pool_id = message.poolId !== BigInt(0) ? message.poolId.toString() : undefined;
        obj.token_in_denom = message.tokenInDenom === "" ? undefined : message.tokenInDenom;
        return obj;
    },
    fromAminoMsg(object: SwapAmountOutRouteAminoMsg): SwapAmountOutRoute {
        return SwapAmountOutRoute.fromAmino(object.value);
    },
    toAminoMsg(message: SwapAmountOutRoute): SwapAmountOutRouteAminoMsg {
        return {
            type: "osmosis/poolmanager/swap-amount-out-route",
            value: SwapAmountOutRoute.toAmino(message)
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
            value: SwapAmountOutRoute.encode(message).finish()
        };
    }
};
function createBaseSwapAmountInSplitRoute(): SwapAmountInSplitRoute {
    return {
        pools: [],
        tokenInAmount: ""
    };
}
export const SwapAmountInSplitRoute = {
    typeUrl: "/osmosis.poolmanager.v1beta1.SwapAmountInSplitRoute",
    aminoType: "osmosis/poolmanager/swap-amount-in-split-route",
    is(o: any): o is SwapAmountInSplitRoute {
        return o && (o.$typeUrl === SwapAmountInSplitRoute.typeUrl || Array.isArray(o.pools) && (!o.pools.length || SwapAmountInRoute.is(o.pools[0])) && typeof o.tokenInAmount === "string");
    },
    isSDK(o: any): o is SwapAmountInSplitRouteSDKType {
        return o && (o.$typeUrl === SwapAmountInSplitRoute.typeUrl || Array.isArray(o.pools) && (!o.pools.length || SwapAmountInRoute.isSDK(o.pools[0])) && typeof o.token_in_amount === "string");
    },
    isAmino(o: any): o is SwapAmountInSplitRouteAmino {
        return o && (o.$typeUrl === SwapAmountInSplitRoute.typeUrl || Array.isArray(o.pools) && (!o.pools.length || SwapAmountInRoute.isAmino(o.pools[0])) && typeof o.token_in_amount === "string");
    },
    encode(message: SwapAmountInSplitRoute, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        for (const v of message.pools) {
            SwapAmountInRoute.encode(v!, writer.uint32(10).fork()).ldelim();
        }
        if (message.tokenInAmount !== "") {
            writer.uint32(18).string(message.tokenInAmount);
        }
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): SwapAmountInSplitRoute {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
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
        message.pools = object.pools?.map(e => SwapAmountInRoute.fromPartial(e)) || [];
        message.tokenInAmount = object.tokenInAmount ?? "";
        return message;
    },
    fromAmino(object: SwapAmountInSplitRouteAmino): SwapAmountInSplitRoute {
        const message = createBaseSwapAmountInSplitRoute();
        message.pools = object.pools?.map(e => SwapAmountInRoute.fromAmino(e)) || [];
        if (object.token_in_amount !== undefined && object.token_in_amount !== null) {
            message.tokenInAmount = object.token_in_amount;
        }
        return message;
    },
    toAmino(message: SwapAmountInSplitRoute): SwapAmountInSplitRouteAmino {
        const obj: any = {};
        if (message.pools) {
            obj.pools = message.pools.map(e => e ? SwapAmountInRoute.toAmino(e) : undefined);
        } else {
            obj.pools = message.pools;
        }
        obj.token_in_amount = message.tokenInAmount === "" ? undefined : message.tokenInAmount;
        return obj;
    },
    fromAminoMsg(object: SwapAmountInSplitRouteAminoMsg): SwapAmountInSplitRoute {
        return SwapAmountInSplitRoute.fromAmino(object.value);
    },
    toAminoMsg(message: SwapAmountInSplitRoute): SwapAmountInSplitRouteAminoMsg {
        return {
            type: "osmosis/poolmanager/swap-amount-in-split-route",
            value: SwapAmountInSplitRoute.toAmino(message)
        };
    },
    fromProtoMsg(message: SwapAmountInSplitRouteProtoMsg): SwapAmountInSplitRoute {
        return SwapAmountInSplitRoute.decode(message.value);
    },
    toProto(message: SwapAmountInSplitRoute): Uint8Array {
        return SwapAmountInSplitRoute.encode(message).finish();
    },
    toProtoMsg(message: SwapAmountInSplitRoute): SwapAmountInSplitRouteProtoMsg {
        return {
            typeUrl: "/osmosis.poolmanager.v1beta1.SwapAmountInSplitRoute",
            value: SwapAmountInSplitRoute.encode(message).finish()
        };
    }
};
function createBaseSwapAmountOutSplitRoute(): SwapAmountOutSplitRoute {
    return {
        pools: [],
        tokenOutAmount: ""
    };
}
export const SwapAmountOutSplitRoute = {
    typeUrl: "/osmosis.poolmanager.v1beta1.SwapAmountOutSplitRoute",
    aminoType: "osmosis/poolmanager/swap-amount-out-split-route",
    is(o: any): o is SwapAmountOutSplitRoute {
        return o && (o.$typeUrl === SwapAmountOutSplitRoute.typeUrl || Array.isArray(o.pools) && (!o.pools.length || SwapAmountOutRoute.is(o.pools[0])) && typeof o.tokenOutAmount === "string");
    },
    isSDK(o: any): o is SwapAmountOutSplitRouteSDKType {
        return o && (o.$typeUrl === SwapAmountOutSplitRoute.typeUrl || Array.isArray(o.pools) && (!o.pools.length || SwapAmountOutRoute.isSDK(o.pools[0])) && typeof o.token_out_amount === "string");
    },
    isAmino(o: any): o is SwapAmountOutSplitRouteAmino {
        return o && (o.$typeUrl === SwapAmountOutSplitRoute.typeUrl || Array.isArray(o.pools) && (!o.pools.length || SwapAmountOutRoute.isAmino(o.pools[0])) && typeof o.token_out_amount === "string");
    },
    encode(message: SwapAmountOutSplitRoute, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        for (const v of message.pools) {
            SwapAmountOutRoute.encode(v!, writer.uint32(10).fork()).ldelim();
        }
        if (message.tokenOutAmount !== "") {
            writer.uint32(18).string(message.tokenOutAmount);
        }
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): SwapAmountOutSplitRoute {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseSwapAmountOutSplitRoute();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.pools.push(SwapAmountOutRoute.decode(reader, reader.uint32()));
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
    fromPartial(object: Partial<SwapAmountOutSplitRoute>): SwapAmountOutSplitRoute {
        const message = createBaseSwapAmountOutSplitRoute();
        message.pools = object.pools?.map(e => SwapAmountOutRoute.fromPartial(e)) || [];
        message.tokenOutAmount = object.tokenOutAmount ?? "";
        return message;
    },
    fromAmino(object: SwapAmountOutSplitRouteAmino): SwapAmountOutSplitRoute {
        const message = createBaseSwapAmountOutSplitRoute();
        message.pools = object.pools?.map(e => SwapAmountOutRoute.fromAmino(e)) || [];
        if (object.token_out_amount !== undefined && object.token_out_amount !== null) {
            message.tokenOutAmount = object.token_out_amount;
        }
        return message;
    },
    toAmino(message: SwapAmountOutSplitRoute): SwapAmountOutSplitRouteAmino {
        const obj: any = {};
        if (message.pools) {
            obj.pools = message.pools.map(e => e ? SwapAmountOutRoute.toAmino(e) : undefined);
        } else {
            obj.pools = message.pools;
        }
        obj.token_out_amount = message.tokenOutAmount === "" ? undefined : message.tokenOutAmount;
        return obj;
    },
    fromAminoMsg(object: SwapAmountOutSplitRouteAminoMsg): SwapAmountOutSplitRoute {
        return SwapAmountOutSplitRoute.fromAmino(object.value);
    },
    toAminoMsg(message: SwapAmountOutSplitRoute): SwapAmountOutSplitRouteAminoMsg {
        return {
            type: "osmosis/poolmanager/swap-amount-out-split-route",
            value: SwapAmountOutSplitRoute.toAmino(message)
        };
    },
    fromProtoMsg(message: SwapAmountOutSplitRouteProtoMsg): SwapAmountOutSplitRoute {
        return SwapAmountOutSplitRoute.decode(message.value);
    },
    toProto(message: SwapAmountOutSplitRoute): Uint8Array {
        return SwapAmountOutSplitRoute.encode(message).finish();
    },
    toProtoMsg(message: SwapAmountOutSplitRoute): SwapAmountOutSplitRouteProtoMsg {
        return {
            typeUrl: "/osmosis.poolmanager.v1beta1.SwapAmountOutSplitRoute",
            value: SwapAmountOutSplitRoute.encode(message).finish()
        };
    }
};