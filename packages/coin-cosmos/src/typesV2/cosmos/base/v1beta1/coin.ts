import { BinaryReader, BinaryWriter } from "../../../../binary";
/**
 * Coin defines a token with a denomination and an amount.
 *
 * NOTE: The amount field is an Int which implements the custom method
 * signatures required by gogoproto.
 */
export interface Coin {
    denom: string;
    amount: string;
}
export interface CoinProtoMsg {
    typeUrl: "/cosmos.base.v1beta1.Coin";
    value: Uint8Array;
}
/**
 * Coin defines a token with a denomination and an amount.
 *
 * NOTE: The amount field is an Int which implements the custom method
 * signatures required by gogoproto.
 */
export interface CoinAmino {
    denom?: string;
    amount: string;
}
export interface CoinAminoMsg {
    type: "cosmos-sdk/Coin";
    value: CoinAmino;
}
/**
 * Coin defines a token with a denomination and an amount.
 *
 * NOTE: The amount field is an Int which implements the custom method
 * signatures required by gogoproto.
 */
export interface CoinSDKType {
    denom: string;
    amount: string;
}
/**
 * DecCoin defines a token with a denomination and a decimal amount.
 *
 * NOTE: The amount field is an Dec which implements the custom method
 * signatures required by gogoproto.
 */
export interface DecCoin {
    denom: string;
    amount: string;
}
export interface DecCoinProtoMsg {
    typeUrl: "/cosmos.base.v1beta1.DecCoin";
    value: Uint8Array;
}
/**
 * DecCoin defines a token with a denomination and a decimal amount.
 *
 * NOTE: The amount field is an Dec which implements the custom method
 * signatures required by gogoproto.
 */
export interface DecCoinAmino {
    denom?: string;
    amount?: string;
}
export interface DecCoinAminoMsg {
    type: "cosmos-sdk/DecCoin";
    value: DecCoinAmino;
}
/**
 * DecCoin defines a token with a denomination and a decimal amount.
 *
 * NOTE: The amount field is an Dec which implements the custom method
 * signatures required by gogoproto.
 */
export interface DecCoinSDKType {
    denom: string;
    amount: string;
}
/** IntProto defines a Protobuf wrapper around an Int object. */
export interface IntProto {
    int: string;
}
export interface IntProtoProtoMsg {
    typeUrl: "/cosmos.base.v1beta1.IntProto";
    value: Uint8Array;
}
/** IntProto defines a Protobuf wrapper around an Int object. */
export interface IntProtoAmino {
    int?: string;
}
export interface IntProtoAminoMsg {
    type: "cosmos-sdk/IntProto";
    value: IntProtoAmino;
}
/** IntProto defines a Protobuf wrapper around an Int object. */
export interface IntProtoSDKType {
    int: string;
}
/** DecProto defines a Protobuf wrapper around a Dec object. */
export interface DecProto {
    dec: string;
}
export interface DecProtoProtoMsg {
    typeUrl: "/cosmos.base.v1beta1.DecProto";
    value: Uint8Array;
}
/** DecProto defines a Protobuf wrapper around a Dec object. */
export interface DecProtoAmino {
    dec?: string;
}
export interface DecProtoAminoMsg {
    type: "cosmos-sdk/DecProto";
    value: DecProtoAmino;
}
/** DecProto defines a Protobuf wrapper around a Dec object. */
export interface DecProtoSDKType {
    dec: string;
}
function createBaseCoin(): Coin {
    return {
        denom: "",
        amount: ""
    };
}
export const Coin = {
    typeUrl: "/cosmos.base.v1beta1.Coin",
    aminoType: "cosmos-sdk/Coin",
    is(o: any): o is Coin {
        return o && (o.$typeUrl === Coin.typeUrl || typeof o.denom === "string" && typeof o.amount === "string");
    },
    isSDK(o: any): o is CoinSDKType {
        return o && (o.$typeUrl === Coin.typeUrl || typeof o.denom === "string" && typeof o.amount === "string");
    },
    isAmino(o: any): o is CoinAmino {
        return o && (o.$typeUrl === Coin.typeUrl || typeof o.denom === "string" && typeof o.amount === "string");
    },
    encode(message: Coin, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        if (message.denom !== "") {
            writer.uint32(10).string(message.denom);
        }
        if (message.amount !== "") {
            writer.uint32(18).string(message.amount);
        }
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): Coin {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseCoin();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.denom = reader.string();
                    break;
                case 2:
                    message.amount = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromPartial(object: Partial<Coin>): Coin {
        const message = createBaseCoin();
        message.denom = object.denom ?? "";
        message.amount = object.amount ?? "";
        return message;
    },
    fromAmino(object: CoinAmino): Coin {
        const message = createBaseCoin();
        if (object.denom !== undefined && object.denom !== null) {
            message.denom = object.denom;
        }
        if (object.amount !== undefined && object.amount !== null) {
            message.amount = object.amount;
        }
        return message;
    },
    toAmino(message: Coin): CoinAmino {
        const obj: any = {};
        obj.denom = message.denom === "" ? undefined : message.denom;
        obj.amount = message.amount ?? "";
        return obj;
    },
    fromAminoMsg(object: CoinAminoMsg): Coin {
        return Coin.fromAmino(object.value);
    },
    toAminoMsg(message: Coin): CoinAminoMsg {
        return {
            type: "cosmos-sdk/Coin",
            value: Coin.toAmino(message)
        };
    },
    fromProtoMsg(message: CoinProtoMsg): Coin {
        return Coin.decode(message.value);
    },
    toProto(message: Coin): Uint8Array {
        return Coin.encode(message).finish();
    },
    toProtoMsg(message: Coin): CoinProtoMsg {
        return {
            typeUrl: "/cosmos.base.v1beta1.Coin",
            value: Coin.encode(message).finish()
        };
    }
};
function createBaseDecCoin(): DecCoin {
    return {
        denom: "",
        amount: ""
    };
}
export const DecCoin = {
    typeUrl: "/cosmos.base.v1beta1.DecCoin",
    aminoType: "cosmos-sdk/DecCoin",
    is(o: any): o is DecCoin {
        return o && (o.$typeUrl === DecCoin.typeUrl || typeof o.denom === "string" && typeof o.amount === "string");
    },
    isSDK(o: any): o is DecCoinSDKType {
        return o && (o.$typeUrl === DecCoin.typeUrl || typeof o.denom === "string" && typeof o.amount === "string");
    },
    isAmino(o: any): o is DecCoinAmino {
        return o && (o.$typeUrl === DecCoin.typeUrl || typeof o.denom === "string" && typeof o.amount === "string");
    },
    encode(message: DecCoin, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        if (message.denom !== "") {
            writer.uint32(10).string(message.denom);
        }
        if (message.amount !== "") {
            writer.uint32(18).string(message.amount);
        }
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): DecCoin {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseDecCoin();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.denom = reader.string();
                    break;
                case 2:
                    message.amount = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromPartial(object: Partial<DecCoin>): DecCoin {
        const message = createBaseDecCoin();
        message.denom = object.denom ?? "";
        message.amount = object.amount ?? "";
        return message;
    },
    fromAmino(object: DecCoinAmino): DecCoin {
        const message = createBaseDecCoin();
        if (object.denom !== undefined && object.denom !== null) {
            message.denom = object.denom;
        }
        if (object.amount !== undefined && object.amount !== null) {
            message.amount = object.amount;
        }
        return message;
    },
    toAmino(message: DecCoin): DecCoinAmino {
        const obj: any = {};
        obj.denom = message.denom === "" ? undefined : message.denom;
        obj.amount = message.amount === "" ? undefined : message.amount;
        return obj;
    },
    fromAminoMsg(object: DecCoinAminoMsg): DecCoin {
        return DecCoin.fromAmino(object.value);
    },
    toAminoMsg(message: DecCoin): DecCoinAminoMsg {
        return {
            type: "cosmos-sdk/DecCoin",
            value: DecCoin.toAmino(message)
        };
    },
    fromProtoMsg(message: DecCoinProtoMsg): DecCoin {
        return DecCoin.decode(message.value);
    },
    toProto(message: DecCoin): Uint8Array {
        return DecCoin.encode(message).finish();
    },
    toProtoMsg(message: DecCoin): DecCoinProtoMsg {
        return {
            typeUrl: "/cosmos.base.v1beta1.DecCoin",
            value: DecCoin.encode(message).finish()
        };
    }
};
function createBaseIntProto(): IntProto {
    return {
        int: ""
    };
}
export const IntProto = {
    typeUrl: "/cosmos.base.v1beta1.IntProto",
    aminoType: "cosmos-sdk/IntProto",
    is(o: any): o is IntProto {
        return o && (o.$typeUrl === IntProto.typeUrl || typeof o.int === "string");
    },
    isSDK(o: any): o is IntProtoSDKType {
        return o && (o.$typeUrl === IntProto.typeUrl || typeof o.int === "string");
    },
    isAmino(o: any): o is IntProtoAmino {
        return o && (o.$typeUrl === IntProto.typeUrl || typeof o.int === "string");
    },
    encode(message: IntProto, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        if (message.int !== "") {
            writer.uint32(10).string(message.int);
        }
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): IntProto {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseIntProto();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.int = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromPartial(object: Partial<IntProto>): IntProto {
        const message = createBaseIntProto();
        message.int = object.int ?? "";
        return message;
    },
    fromAmino(object: IntProtoAmino): IntProto {
        const message = createBaseIntProto();
        if (object.int !== undefined && object.int !== null) {
            message.int = object.int;
        }
        return message;
    },
    toAmino(message: IntProto): IntProtoAmino {
        const obj: any = {};
        obj.int = message.int === "" ? undefined : message.int;
        return obj;
    },
    fromAminoMsg(object: IntProtoAminoMsg): IntProto {
        return IntProto.fromAmino(object.value);
    },
    toAminoMsg(message: IntProto): IntProtoAminoMsg {
        return {
            type: "cosmos-sdk/IntProto",
            value: IntProto.toAmino(message)
        };
    },
    fromProtoMsg(message: IntProtoProtoMsg): IntProto {
        return IntProto.decode(message.value);
    },
    toProto(message: IntProto): Uint8Array {
        return IntProto.encode(message).finish();
    },
    toProtoMsg(message: IntProto): IntProtoProtoMsg {
        return {
            typeUrl: "/cosmos.base.v1beta1.IntProto",
            value: IntProto.encode(message).finish()
        };
    }
};
function createBaseDecProto(): DecProto {
    return {
        dec: ""
    };
}
export const DecProto = {
    typeUrl: "/cosmos.base.v1beta1.DecProto",
    aminoType: "cosmos-sdk/DecProto",
    is(o: any): o is DecProto {
        return o && (o.$typeUrl === DecProto.typeUrl || typeof o.dec === "string");
    },
    isSDK(o: any): o is DecProtoSDKType {
        return o && (o.$typeUrl === DecProto.typeUrl || typeof o.dec === "string");
    },
    isAmino(o: any): o is DecProtoAmino {
        return o && (o.$typeUrl === DecProto.typeUrl || typeof o.dec === "string");
    },
    encode(message: DecProto, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        if (message.dec !== "") {
            writer.uint32(10).string(message.dec);
        }
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): DecProto {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseDecProto();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.dec = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromPartial(object: Partial<DecProto>): DecProto {
        const message = createBaseDecProto();
        message.dec = object.dec ?? "";
        return message;
    },
    fromAmino(object: DecProtoAmino): DecProto {
        const message = createBaseDecProto();
        if (object.dec !== undefined && object.dec !== null) {
            message.dec = object.dec;
        }
        return message;
    },
    toAmino(message: DecProto): DecProtoAmino {
        const obj: any = {};
        obj.dec = message.dec === "" ? undefined : message.dec;
        return obj;
    },
    fromAminoMsg(object: DecProtoAminoMsg): DecProto {
        return DecProto.fromAmino(object.value);
    },
    toAminoMsg(message: DecProto): DecProtoAminoMsg {
        return {
            type: "cosmos-sdk/DecProto",
            value: DecProto.toAmino(message)
        };
    },
    fromProtoMsg(message: DecProtoProtoMsg): DecProto {
        return DecProto.decode(message.value);
    },
    toProto(message: DecProto): Uint8Array {
        return DecProto.encode(message).finish();
    },
    toProtoMsg(message: DecProto): DecProtoProtoMsg {
        return {
            typeUrl: "/cosmos.base.v1beta1.DecProto",
            value: DecProto.encode(message).finish()
        };
    }
};
