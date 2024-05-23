//@ts-nocheck
import { Coin, CoinAmino, CoinSDKType } from "../../../typesV2/cosmos/base/v1beta1/coin";
import { Metadata, MetadataAmino, MetadataSDKType } from "../../../typesV2/cosmos/bank/v1beta1/bank";
import { BinaryReader, BinaryWriter } from "../../../binary";
/**
 * MsgCreateDenom defines the message structure for the CreateDenom gRPC service
 * method. It allows an account to create a new denom. It requires a sender
 * address and a sub denomination. The (sender_address, sub_denomination) tuple
 * must be unique and cannot be re-used.
 *
 * The resulting denom created is defined as
 * <factory/{creatorAddress}/{subdenom}>. The resulting denom's admin is
 * originally set to be the creator, but this can be changed later. The token
 * denom does not indicate the current admin.
 */
export interface MsgCreateDenom {
    sender: string;
    /** subdenom can be up to 44 "alphanumeric" characters long. */
    subdenom: string;
}
export interface MsgCreateDenomProtoMsg {
    typeUrl: "/osmosis.tokenfactory.v1beta1.MsgCreateDenom";
    value: Uint8Array;
}
/**
 * MsgCreateDenom defines the message structure for the CreateDenom gRPC service
 * method. It allows an account to create a new denom. It requires a sender
 * address and a sub denomination. The (sender_address, sub_denomination) tuple
 * must be unique and cannot be re-used.
 *
 * The resulting denom created is defined as
 * <factory/{creatorAddress}/{subdenom}>. The resulting denom's admin is
 * originally set to be the creator, but this can be changed later. The token
 * denom does not indicate the current admin.
 */
export interface MsgCreateDenomAmino {
    sender?: string;
    /** subdenom can be up to 44 "alphanumeric" characters long. */
    subdenom?: string;
}
export interface MsgCreateDenomAminoMsg {
    type: "osmosis/tokenfactory/create-denom";
    value: MsgCreateDenomAmino;
}
/**
 * MsgCreateDenom defines the message structure for the CreateDenom gRPC service
 * method. It allows an account to create a new denom. It requires a sender
 * address and a sub denomination. The (sender_address, sub_denomination) tuple
 * must be unique and cannot be re-used.
 *
 * The resulting denom created is defined as
 * <factory/{creatorAddress}/{subdenom}>. The resulting denom's admin is
 * originally set to be the creator, but this can be changed later. The token
 * denom does not indicate the current admin.
 */
export interface MsgCreateDenomSDKType {
    sender: string;
    subdenom: string;
}
/**
 * MsgCreateDenomResponse is the return value of MsgCreateDenom
 * It returns the full string of the newly created denom
 */
export interface MsgCreateDenomResponse {
    newTokenDenom: string;
}
export interface MsgCreateDenomResponseProtoMsg {
    typeUrl: "/osmosis.tokenfactory.v1beta1.MsgCreateDenomResponse";
    value: Uint8Array;
}
/**
 * MsgCreateDenomResponse is the return value of MsgCreateDenom
 * It returns the full string of the newly created denom
 */
export interface MsgCreateDenomResponseAmino {
    new_token_denom?: string;
}
export interface MsgCreateDenomResponseAminoMsg {
    type: "osmosis/tokenfactory/create-denom-response";
    value: MsgCreateDenomResponseAmino;
}
/**
 * MsgCreateDenomResponse is the return value of MsgCreateDenom
 * It returns the full string of the newly created denom
 */
export interface MsgCreateDenomResponseSDKType {
    new_token_denom: string;
}
/**
 * MsgMint is the sdk.Msg type for allowing an admin account to mint
 * more of a token.
 * Only the admin of the token factory denom has permission to mint unless
 * the denom does not have any admin.
 */
export interface MsgMint {
    sender: string;
    amount: Coin;
    mintToAddress: string;
}
export interface MsgMintProtoMsg {
    typeUrl: "/osmosis.tokenfactory.v1beta1.MsgMint";
    value: Uint8Array;
}
/**
 * MsgMint is the sdk.Msg type for allowing an admin account to mint
 * more of a token.
 * Only the admin of the token factory denom has permission to mint unless
 * the denom does not have any admin.
 */
export interface MsgMintAmino {
    sender?: string;
    amount?: CoinAmino;
    mintToAddress: string;
}
export interface MsgMintAminoMsg {
    type: "osmosis/tokenfactory/mint";
    value: MsgMintAmino;
}
/**
 * MsgMint is the sdk.Msg type for allowing an admin account to mint
 * more of a token.
 * Only the admin of the token factory denom has permission to mint unless
 * the denom does not have any admin.
 */
export interface MsgMintSDKType {
    sender: string;
    amount: CoinSDKType;
    mintToAddress: string;
}
export interface MsgMintResponse {}
export interface MsgMintResponseProtoMsg {
    typeUrl: "/osmosis.tokenfactory.v1beta1.MsgMintResponse";
    value: Uint8Array;
}
export interface MsgMintResponseAmino {}
export interface MsgMintResponseAminoMsg {
    type: "osmosis/tokenfactory/mint-response";
    value: MsgMintResponseAmino;
}
export interface MsgMintResponseSDKType {}
/**
 * MsgBurn is the sdk.Msg type for allowing an admin account to burn
 * a token.
 * Only the admin of the token factory denom has permission to burn unless
 * the denom does not have any admin.
 */
export interface MsgBurn {
    sender: string;
    amount: Coin;
    burnFromAddress: string;
}
export interface MsgBurnProtoMsg {
    typeUrl: "/osmosis.tokenfactory.v1beta1.MsgBurn";
    value: Uint8Array;
}
/**
 * MsgBurn is the sdk.Msg type for allowing an admin account to burn
 * a token.
 * Only the admin of the token factory denom has permission to burn unless
 * the denom does not have any admin.
 */
export interface MsgBurnAmino {
    sender?: string;
    amount?: CoinAmino;
    burnFromAddress: string;
}
export interface MsgBurnAminoMsg {
    type: "osmosis/tokenfactory/burn";
    value: MsgBurnAmino;
}
/**
 * MsgBurn is the sdk.Msg type for allowing an admin account to burn
 * a token.
 * Only the admin of the token factory denom has permission to burn unless
 * the denom does not have any admin.
 */
export interface MsgBurnSDKType {
    sender: string;
    amount: CoinSDKType;
    burnFromAddress: string;
}
export interface MsgBurnResponse {}
export interface MsgBurnResponseProtoMsg {
    typeUrl: "/osmosis.tokenfactory.v1beta1.MsgBurnResponse";
    value: Uint8Array;
}
export interface MsgBurnResponseAmino {}
export interface MsgBurnResponseAminoMsg {
    type: "osmosis/tokenfactory/burn-response";
    value: MsgBurnResponseAmino;
}
export interface MsgBurnResponseSDKType {}
/**
 * MsgChangeAdmin is the sdk.Msg type for allowing an admin account to reassign
 * adminship of a denom to a new account
 */
export interface MsgChangeAdmin {
    sender: string;
    denom: string;
    newAdmin: string;
}
export interface MsgChangeAdminProtoMsg {
    typeUrl: "/osmosis.tokenfactory.v1beta1.MsgChangeAdmin";
    value: Uint8Array;
}
/**
 * MsgChangeAdmin is the sdk.Msg type for allowing an admin account to reassign
 * adminship of a denom to a new account
 */
export interface MsgChangeAdminAmino {
    sender?: string;
    denom?: string;
    new_admin?: string;
}
export interface MsgChangeAdminAminoMsg {
    type: "osmosis/tokenfactory/change-admin";
    value: MsgChangeAdminAmino;
}
/**
 * MsgChangeAdmin is the sdk.Msg type for allowing an admin account to reassign
 * adminship of a denom to a new account
 */
export interface MsgChangeAdminSDKType {
    sender: string;
    denom: string;
    new_admin: string;
}
/**
 * MsgChangeAdminResponse defines the response structure for an executed
 * MsgChangeAdmin message.
 */
export interface MsgChangeAdminResponse {}
export interface MsgChangeAdminResponseProtoMsg {
    typeUrl: "/osmosis.tokenfactory.v1beta1.MsgChangeAdminResponse";
    value: Uint8Array;
}
/**
 * MsgChangeAdminResponse defines the response structure for an executed
 * MsgChangeAdmin message.
 */
export interface MsgChangeAdminResponseAmino {}
export interface MsgChangeAdminResponseAminoMsg {
    type: "osmosis/tokenfactory/change-admin-response";
    value: MsgChangeAdminResponseAmino;
}
/**
 * MsgChangeAdminResponse defines the response structure for an executed
 * MsgChangeAdmin message.
 */
export interface MsgChangeAdminResponseSDKType {}
/**
 * MsgSetBeforeSendHook is the sdk.Msg type for allowing an admin account to
 * assign a CosmWasm contract to call with a BeforeSend hook
 */
export interface MsgSetBeforeSendHook {
    sender: string;
    denom: string;
    cosmwasmAddress: string;
}
export interface MsgSetBeforeSendHookProtoMsg {
    typeUrl: "/osmosis.tokenfactory.v1beta1.MsgSetBeforeSendHook";
    value: Uint8Array;
}
/**
 * MsgSetBeforeSendHook is the sdk.Msg type for allowing an admin account to
 * assign a CosmWasm contract to call with a BeforeSend hook
 */
export interface MsgSetBeforeSendHookAmino {
    sender?: string;
    denom?: string;
    cosmwasm_address: string;
}
export interface MsgSetBeforeSendHookAminoMsg {
    type: "osmosis/tokenfactory/set-bef-send-hook";
    value: MsgSetBeforeSendHookAmino;
}
/**
 * MsgSetBeforeSendHook is the sdk.Msg type for allowing an admin account to
 * assign a CosmWasm contract to call with a BeforeSend hook
 */
export interface MsgSetBeforeSendHookSDKType {
    sender: string;
    denom: string;
    cosmwasm_address: string;
}
/**
 * MsgSetBeforeSendHookResponse defines the response structure for an executed
 * MsgSetBeforeSendHook message.
 */
export interface MsgSetBeforeSendHookResponse {}
export interface MsgSetBeforeSendHookResponseProtoMsg {
    typeUrl: "/osmosis.tokenfactory.v1beta1.MsgSetBeforeSendHookResponse";
    value: Uint8Array;
}
/**
 * MsgSetBeforeSendHookResponse defines the response structure for an executed
 * MsgSetBeforeSendHook message.
 */
export interface MsgSetBeforeSendHookResponseAmino {}
export interface MsgSetBeforeSendHookResponseAminoMsg {
    type: "osmosis/tokenfactory/set-before-send-hook-response";
    value: MsgSetBeforeSendHookResponseAmino;
}
/**
 * MsgSetBeforeSendHookResponse defines the response structure for an executed
 * MsgSetBeforeSendHook message.
 */
export interface MsgSetBeforeSendHookResponseSDKType {}
/**
 * MsgSetDenomMetadata is the sdk.Msg type for allowing an admin account to set
 * the denom's bank metadata
 */
export interface MsgSetDenomMetadata {
    sender: string;
    metadata: Metadata;
}
export interface MsgSetDenomMetadataProtoMsg {
    typeUrl: "/osmosis.tokenfactory.v1beta1.MsgSetDenomMetadata";
    value: Uint8Array;
}
/**
 * MsgSetDenomMetadata is the sdk.Msg type for allowing an admin account to set
 * the denom's bank metadata
 */
export interface MsgSetDenomMetadataAmino {
    sender?: string;
    metadata?: MetadataAmino;
}
export interface MsgSetDenomMetadataAminoMsg {
    type: "osmosis/tokenfactory/set-denom-metadata";
    value: MsgSetDenomMetadataAmino;
}
/**
 * MsgSetDenomMetadata is the sdk.Msg type for allowing an admin account to set
 * the denom's bank metadata
 */
export interface MsgSetDenomMetadataSDKType {
    sender: string;
    metadata: MetadataSDKType;
}
/**
 * MsgSetDenomMetadataResponse defines the response structure for an executed
 * MsgSetDenomMetadata message.
 */
export interface MsgSetDenomMetadataResponse {}
export interface MsgSetDenomMetadataResponseProtoMsg {
    typeUrl: "/osmosis.tokenfactory.v1beta1.MsgSetDenomMetadataResponse";
    value: Uint8Array;
}
/**
 * MsgSetDenomMetadataResponse defines the response structure for an executed
 * MsgSetDenomMetadata message.
 */
export interface MsgSetDenomMetadataResponseAmino {}
export interface MsgSetDenomMetadataResponseAminoMsg {
    type: "osmosis/tokenfactory/set-denom-metadata-response";
    value: MsgSetDenomMetadataResponseAmino;
}
/**
 * MsgSetDenomMetadataResponse defines the response structure for an executed
 * MsgSetDenomMetadata message.
 */
export interface MsgSetDenomMetadataResponseSDKType {}
export interface MsgForceTransfer {
    sender: string;
    amount: Coin;
    transferFromAddress: string;
    transferToAddress: string;
}
export interface MsgForceTransferProtoMsg {
    typeUrl: "/osmosis.tokenfactory.v1beta1.MsgForceTransfer";
    value: Uint8Array;
}
export interface MsgForceTransferAmino {
    sender?: string;
    amount?: CoinAmino;
    transferFromAddress?: string;
    transferToAddress?: string;
}
export interface MsgForceTransferAminoMsg {
    type: "osmosis/tokenfactory/force-transfer";
    value: MsgForceTransferAmino;
}
export interface MsgForceTransferSDKType {
    sender: string;
    amount: CoinSDKType;
    transferFromAddress: string;
    transferToAddress: string;
}
export interface MsgForceTransferResponse {}
export interface MsgForceTransferResponseProtoMsg {
    typeUrl: "/osmosis.tokenfactory.v1beta1.MsgForceTransferResponse";
    value: Uint8Array;
}
export interface MsgForceTransferResponseAmino {}
export interface MsgForceTransferResponseAminoMsg {
    type: "osmosis/tokenfactory/force-transfer-response";
    value: MsgForceTransferResponseAmino;
}
export interface MsgForceTransferResponseSDKType {}
function createBaseMsgCreateDenom(): MsgCreateDenom {
    return {
        sender: "",
        subdenom: ""
    };
}
export const MsgCreateDenom = {
    typeUrl: "/osmosis.tokenfactory.v1beta1.MsgCreateDenom",
    aminoType: "osmosis/tokenfactory/create-denom",
    is(o: any): o is MsgCreateDenom {
        return o && (o.$typeUrl === MsgCreateDenom.typeUrl || typeof o.sender === "string" && typeof o.subdenom === "string");
    },
    isSDK(o: any): o is MsgCreateDenomSDKType {
        return o && (o.$typeUrl === MsgCreateDenom.typeUrl || typeof o.sender === "string" && typeof o.subdenom === "string");
    },
    isAmino(o: any): o is MsgCreateDenomAmino {
        return o && (o.$typeUrl === MsgCreateDenom.typeUrl || typeof o.sender === "string" && typeof o.subdenom === "string");
    },
    encode(message: MsgCreateDenom, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        if (message.sender !== "") {
            writer.uint32(10).string(message.sender);
        }
        if (message.subdenom !== "") {
            writer.uint32(18).string(message.subdenom);
        }
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): MsgCreateDenom {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgCreateDenom();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.sender = reader.string();
                    break;
                case 2:
                    message.subdenom = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromPartial(object: Partial<MsgCreateDenom>): MsgCreateDenom {
        const message = createBaseMsgCreateDenom();
        message.sender = object.sender ?? "";
        message.subdenom = object.subdenom ?? "";
        return message;
    },
    fromAmino(object: MsgCreateDenomAmino): MsgCreateDenom {
        const message = createBaseMsgCreateDenom();
        if (object.sender !== undefined && object.sender !== null) {
            message.sender = object.sender;
        }
        if (object.subdenom !== undefined && object.subdenom !== null) {
            message.subdenom = object.subdenom;
        }
        return message;
    },
    toAmino(message: MsgCreateDenom): MsgCreateDenomAmino {
        const obj: any = {};
        obj.sender = message.sender === "" ? undefined : message.sender;
        obj.subdenom = message.subdenom === "" ? undefined : message.subdenom;
        return obj;
    },
    fromAminoMsg(object: MsgCreateDenomAminoMsg): MsgCreateDenom {
        return MsgCreateDenom.fromAmino(object.value);
    },
    toAminoMsg(message: MsgCreateDenom): MsgCreateDenomAminoMsg {
        return {
            type: "osmosis/tokenfactory/create-denom",
            value: MsgCreateDenom.toAmino(message)
        };
    },
    fromProtoMsg(message: MsgCreateDenomProtoMsg): MsgCreateDenom {
        return MsgCreateDenom.decode(message.value);
    },
    toProto(message: MsgCreateDenom): Uint8Array {
        return MsgCreateDenom.encode(message).finish();
    },
    toProtoMsg(message: MsgCreateDenom): MsgCreateDenomProtoMsg {
        return {
            typeUrl: "/osmosis.tokenfactory.v1beta1.MsgCreateDenom",
            value: MsgCreateDenom.encode(message).finish()
        };
    }
};
function createBaseMsgCreateDenomResponse(): MsgCreateDenomResponse {
    return {
        newTokenDenom: ""
    };
}
export const MsgCreateDenomResponse = {
    typeUrl: "/osmosis.tokenfactory.v1beta1.MsgCreateDenomResponse",
    aminoType: "osmosis/tokenfactory/create-denom-response",
    is(o: any): o is MsgCreateDenomResponse {
        return o && (o.$typeUrl === MsgCreateDenomResponse.typeUrl || typeof o.newTokenDenom === "string");
    },
    isSDK(o: any): o is MsgCreateDenomResponseSDKType {
        return o && (o.$typeUrl === MsgCreateDenomResponse.typeUrl || typeof o.new_token_denom === "string");
    },
    isAmino(o: any): o is MsgCreateDenomResponseAmino {
        return o && (o.$typeUrl === MsgCreateDenomResponse.typeUrl || typeof o.new_token_denom === "string");
    },
    encode(message: MsgCreateDenomResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        if (message.newTokenDenom !== "") {
            writer.uint32(10).string(message.newTokenDenom);
        }
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): MsgCreateDenomResponse {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgCreateDenomResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.newTokenDenom = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromPartial(object: Partial<MsgCreateDenomResponse>): MsgCreateDenomResponse {
        const message = createBaseMsgCreateDenomResponse();
        message.newTokenDenom = object.newTokenDenom ?? "";
        return message;
    },
    fromAmino(object: MsgCreateDenomResponseAmino): MsgCreateDenomResponse {
        const message = createBaseMsgCreateDenomResponse();
        if (object.new_token_denom !== undefined && object.new_token_denom !== null) {
            message.newTokenDenom = object.new_token_denom;
        }
        return message;
    },
    toAmino(message: MsgCreateDenomResponse): MsgCreateDenomResponseAmino {
        const obj: any = {};
        obj.new_token_denom = message.newTokenDenom === "" ? undefined : message.newTokenDenom;
        return obj;
    },
    fromAminoMsg(object: MsgCreateDenomResponseAminoMsg): MsgCreateDenomResponse {
        return MsgCreateDenomResponse.fromAmino(object.value);
    },
    toAminoMsg(message: MsgCreateDenomResponse): MsgCreateDenomResponseAminoMsg {
        return {
            type: "osmosis/tokenfactory/create-denom-response",
            value: MsgCreateDenomResponse.toAmino(message)
        };
    },
    fromProtoMsg(message: MsgCreateDenomResponseProtoMsg): MsgCreateDenomResponse {
        return MsgCreateDenomResponse.decode(message.value);
    },
    toProto(message: MsgCreateDenomResponse): Uint8Array {
        return MsgCreateDenomResponse.encode(message).finish();
    },
    toProtoMsg(message: MsgCreateDenomResponse): MsgCreateDenomResponseProtoMsg {
        return {
            typeUrl: "/osmosis.tokenfactory.v1beta1.MsgCreateDenomResponse",
            value: MsgCreateDenomResponse.encode(message).finish()
        };
    }
};
function createBaseMsgMint(): MsgMint {
    return {
        sender: "",
        amount: Coin.fromPartial({}),
        mintToAddress: ""
    };
}
export const MsgMint = {
    typeUrl: "/osmosis.tokenfactory.v1beta1.MsgMint",
    aminoType: "osmosis/tokenfactory/mint",
    is(o: any): o is MsgMint {
        return o && (o.$typeUrl === MsgMint.typeUrl || typeof o.sender === "string" && Coin.is(o.amount) && typeof o.mintToAddress === "string");
    },
    isSDK(o: any): o is MsgMintSDKType {
        return o && (o.$typeUrl === MsgMint.typeUrl || typeof o.sender === "string" && Coin.isSDK(o.amount) && typeof o.mintToAddress === "string");
    },
    isAmino(o: any): o is MsgMintAmino {
        return o && (o.$typeUrl === MsgMint.typeUrl || typeof o.sender === "string" && Coin.isAmino(o.amount) && typeof o.mintToAddress === "string");
    },
    encode(message: MsgMint, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        if (message.sender !== "") {
            writer.uint32(10).string(message.sender);
        }
        if (message.amount !== undefined) {
            Coin.encode(message.amount, writer.uint32(18).fork()).ldelim();
        }
        if (message.mintToAddress !== "") {
            writer.uint32(26).string(message.mintToAddress);
        }
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): MsgMint {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgMint();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.sender = reader.string();
                    break;
                case 2:
                    message.amount = Coin.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.mintToAddress = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromPartial(object: Partial<MsgMint>): MsgMint {
        const message = createBaseMsgMint();
        message.sender = object.sender ?? "";
        message.amount = object.amount !== undefined && object.amount !== null ? Coin.fromPartial(object.amount) : undefined;
        message.mintToAddress = object.mintToAddress ?? "";
        return message;
    },
    fromAmino(object: MsgMintAmino): MsgMint {
        const message = createBaseMsgMint();
        if (object.sender !== undefined && object.sender !== null) {
            message.sender = object.sender;
        }
        if (object.amount !== undefined && object.amount !== null) {
            message.amount = Coin.fromAmino(object.amount);
        }
        if (object.mintToAddress !== undefined && object.mintToAddress !== null) {
            message.mintToAddress = object.mintToAddress;
        }
        return message;
    },
    toAmino(message: MsgMint): MsgMintAmino {
        const obj: any = {};
        obj.sender = message.sender === "" ? undefined : message.sender;
        obj.amount = message.amount ? Coin.toAmino(message.amount) : undefined;
        obj.mintToAddress = message.mintToAddress ?? "";
        return obj;
    },
    fromAminoMsg(object: MsgMintAminoMsg): MsgMint {
        return MsgMint.fromAmino(object.value);
    },
    toAminoMsg(message: MsgMint): MsgMintAminoMsg {
        return {
            type: "osmosis/tokenfactory/mint",
            value: MsgMint.toAmino(message)
        };
    },
    fromProtoMsg(message: MsgMintProtoMsg): MsgMint {
        return MsgMint.decode(message.value);
    },
    toProto(message: MsgMint): Uint8Array {
        return MsgMint.encode(message).finish();
    },
    toProtoMsg(message: MsgMint): MsgMintProtoMsg {
        return {
            typeUrl: "/osmosis.tokenfactory.v1beta1.MsgMint",
            value: MsgMint.encode(message).finish()
        };
    }
};
function createBaseMsgMintResponse(): MsgMintResponse {
    return {};
}
export const MsgMintResponse = {
    typeUrl: "/osmosis.tokenfactory.v1beta1.MsgMintResponse",
    aminoType: "osmosis/tokenfactory/mint-response",
    is(o: any): o is MsgMintResponse {
        return o && o.$typeUrl === MsgMintResponse.typeUrl;
    },
    isSDK(o: any): o is MsgMintResponseSDKType {
        return o && o.$typeUrl === MsgMintResponse.typeUrl;
    },
    isAmino(o: any): o is MsgMintResponseAmino {
        return o && o.$typeUrl === MsgMintResponse.typeUrl;
    },
    encode(_: MsgMintResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): MsgMintResponse {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgMintResponse();
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
    fromPartial(_: Partial<MsgMintResponse>): MsgMintResponse {
        const message = createBaseMsgMintResponse();
        return message;
    },
    fromAmino(_: MsgMintResponseAmino): MsgMintResponse {
        const message = createBaseMsgMintResponse();
        return message;
    },
    toAmino(_: MsgMintResponse): MsgMintResponseAmino {
        const obj: any = {};
        return obj;
    },
    fromAminoMsg(object: MsgMintResponseAminoMsg): MsgMintResponse {
        return MsgMintResponse.fromAmino(object.value);
    },
    toAminoMsg(message: MsgMintResponse): MsgMintResponseAminoMsg {
        return {
            type: "osmosis/tokenfactory/mint-response",
            value: MsgMintResponse.toAmino(message)
        };
    },
    fromProtoMsg(message: MsgMintResponseProtoMsg): MsgMintResponse {
        return MsgMintResponse.decode(message.value);
    },
    toProto(message: MsgMintResponse): Uint8Array {
        return MsgMintResponse.encode(message).finish();
    },
    toProtoMsg(message: MsgMintResponse): MsgMintResponseProtoMsg {
        return {
            typeUrl: "/osmosis.tokenfactory.v1beta1.MsgMintResponse",
            value: MsgMintResponse.encode(message).finish()
        };
    }
};
function createBaseMsgBurn(): MsgBurn {
    return {
        sender: "",
        amount: Coin.fromPartial({}),
        burnFromAddress: ""
    };
}
export const MsgBurn = {
    typeUrl: "/osmosis.tokenfactory.v1beta1.MsgBurn",
    aminoType: "osmosis/tokenfactory/burn",
    is(o: any): o is MsgBurn {
        return o && (o.$typeUrl === MsgBurn.typeUrl || typeof o.sender === "string" && Coin.is(o.amount) && typeof o.burnFromAddress === "string");
    },
    isSDK(o: any): o is MsgBurnSDKType {
        return o && (o.$typeUrl === MsgBurn.typeUrl || typeof o.sender === "string" && Coin.isSDK(o.amount) && typeof o.burnFromAddress === "string");
    },
    isAmino(o: any): o is MsgBurnAmino {
        return o && (o.$typeUrl === MsgBurn.typeUrl || typeof o.sender === "string" && Coin.isAmino(o.amount) && typeof o.burnFromAddress === "string");
    },
    encode(message: MsgBurn, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        if (message.sender !== "") {
            writer.uint32(10).string(message.sender);
        }
        if (message.amount !== undefined) {
            Coin.encode(message.amount, writer.uint32(18).fork()).ldelim();
        }
        if (message.burnFromAddress !== "") {
            writer.uint32(26).string(message.burnFromAddress);
        }
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): MsgBurn {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgBurn();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.sender = reader.string();
                    break;
                case 2:
                    message.amount = Coin.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.burnFromAddress = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromPartial(object: Partial<MsgBurn>): MsgBurn {
        const message = createBaseMsgBurn();
        message.sender = object.sender ?? "";
        message.amount = object.amount !== undefined && object.amount !== null ? Coin.fromPartial(object.amount) : undefined;
        message.burnFromAddress = object.burnFromAddress ?? "";
        return message;
    },
    fromAmino(object: MsgBurnAmino): MsgBurn {
        const message = createBaseMsgBurn();
        if (object.sender !== undefined && object.sender !== null) {
            message.sender = object.sender;
        }
        if (object.amount !== undefined && object.amount !== null) {
            message.amount = Coin.fromAmino(object.amount);
        }
        if (object.burnFromAddress !== undefined && object.burnFromAddress !== null) {
            message.burnFromAddress = object.burnFromAddress;
        }
        return message;
    },
    toAmino(message: MsgBurn): MsgBurnAmino {
        const obj: any = {};
        obj.sender = message.sender === "" ? undefined : message.sender;
        obj.amount = message.amount ? Coin.toAmino(message.amount) : undefined;
        obj.burnFromAddress = message.burnFromAddress ?? "";
        return obj;
    },
    fromAminoMsg(object: MsgBurnAminoMsg): MsgBurn {
        return MsgBurn.fromAmino(object.value);
    },
    toAminoMsg(message: MsgBurn): MsgBurnAminoMsg {
        return {
            type: "osmosis/tokenfactory/burn",
            value: MsgBurn.toAmino(message)
        };
    },
    fromProtoMsg(message: MsgBurnProtoMsg): MsgBurn {
        return MsgBurn.decode(message.value);
    },
    toProto(message: MsgBurn): Uint8Array {
        return MsgBurn.encode(message).finish();
    },
    toProtoMsg(message: MsgBurn): MsgBurnProtoMsg {
        return {
            typeUrl: "/osmosis.tokenfactory.v1beta1.MsgBurn",
            value: MsgBurn.encode(message).finish()
        };
    }
};
function createBaseMsgBurnResponse(): MsgBurnResponse {
    return {};
}
export const MsgBurnResponse = {
    typeUrl: "/osmosis.tokenfactory.v1beta1.MsgBurnResponse",
    aminoType: "osmosis/tokenfactory/burn-response",
    is(o: any): o is MsgBurnResponse {
        return o && o.$typeUrl === MsgBurnResponse.typeUrl;
    },
    isSDK(o: any): o is MsgBurnResponseSDKType {
        return o && o.$typeUrl === MsgBurnResponse.typeUrl;
    },
    isAmino(o: any): o is MsgBurnResponseAmino {
        return o && o.$typeUrl === MsgBurnResponse.typeUrl;
    },
    encode(_: MsgBurnResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): MsgBurnResponse {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgBurnResponse();
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
    fromPartial(_: Partial<MsgBurnResponse>): MsgBurnResponse {
        const message = createBaseMsgBurnResponse();
        return message;
    },
    fromAmino(_: MsgBurnResponseAmino): MsgBurnResponse {
        const message = createBaseMsgBurnResponse();
        return message;
    },
    toAmino(_: MsgBurnResponse): MsgBurnResponseAmino {
        const obj: any = {};
        return obj;
    },
    fromAminoMsg(object: MsgBurnResponseAminoMsg): MsgBurnResponse {
        return MsgBurnResponse.fromAmino(object.value);
    },
    toAminoMsg(message: MsgBurnResponse): MsgBurnResponseAminoMsg {
        return {
            type: "osmosis/tokenfactory/burn-response",
            value: MsgBurnResponse.toAmino(message)
        };
    },
    fromProtoMsg(message: MsgBurnResponseProtoMsg): MsgBurnResponse {
        return MsgBurnResponse.decode(message.value);
    },
    toProto(message: MsgBurnResponse): Uint8Array {
        return MsgBurnResponse.encode(message).finish();
    },
    toProtoMsg(message: MsgBurnResponse): MsgBurnResponseProtoMsg {
        return {
            typeUrl: "/osmosis.tokenfactory.v1beta1.MsgBurnResponse",
            value: MsgBurnResponse.encode(message).finish()
        };
    }
};
function createBaseMsgChangeAdmin(): MsgChangeAdmin {
    return {
        sender: "",
        denom: "",
        newAdmin: ""
    };
}
export const MsgChangeAdmin = {
    typeUrl: "/osmosis.tokenfactory.v1beta1.MsgChangeAdmin",
    aminoType: "osmosis/tokenfactory/change-admin",
    is(o: any): o is MsgChangeAdmin {
        return o && (o.$typeUrl === MsgChangeAdmin.typeUrl || typeof o.sender === "string" && typeof o.denom === "string" && typeof o.newAdmin === "string");
    },
    isSDK(o: any): o is MsgChangeAdminSDKType {
        return o && (o.$typeUrl === MsgChangeAdmin.typeUrl || typeof o.sender === "string" && typeof o.denom === "string" && typeof o.new_admin === "string");
    },
    isAmino(o: any): o is MsgChangeAdminAmino {
        return o && (o.$typeUrl === MsgChangeAdmin.typeUrl || typeof o.sender === "string" && typeof o.denom === "string" && typeof o.new_admin === "string");
    },
    encode(message: MsgChangeAdmin, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        if (message.sender !== "") {
            writer.uint32(10).string(message.sender);
        }
        if (message.denom !== "") {
            writer.uint32(18).string(message.denom);
        }
        if (message.newAdmin !== "") {
            writer.uint32(26).string(message.newAdmin);
        }
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): MsgChangeAdmin {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgChangeAdmin();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.sender = reader.string();
                    break;
                case 2:
                    message.denom = reader.string();
                    break;
                case 3:
                    message.newAdmin = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromPartial(object: Partial<MsgChangeAdmin>): MsgChangeAdmin {
        const message = createBaseMsgChangeAdmin();
        message.sender = object.sender ?? "";
        message.denom = object.denom ?? "";
        message.newAdmin = object.newAdmin ?? "";
        return message;
    },
    fromAmino(object: MsgChangeAdminAmino): MsgChangeAdmin {
        const message = createBaseMsgChangeAdmin();
        if (object.sender !== undefined && object.sender !== null) {
            message.sender = object.sender;
        }
        if (object.denom !== undefined && object.denom !== null) {
            message.denom = object.denom;
        }
        if (object.new_admin !== undefined && object.new_admin !== null) {
            message.newAdmin = object.new_admin;
        }
        return message;
    },
    toAmino(message: MsgChangeAdmin): MsgChangeAdminAmino {
        const obj: any = {};
        obj.sender = message.sender === "" ? undefined : message.sender;
        obj.denom = message.denom === "" ? undefined : message.denom;
        obj.new_admin = message.newAdmin === "" ? undefined : message.newAdmin;
        return obj;
    },
    fromAminoMsg(object: MsgChangeAdminAminoMsg): MsgChangeAdmin {
        return MsgChangeAdmin.fromAmino(object.value);
    },
    toAminoMsg(message: MsgChangeAdmin): MsgChangeAdminAminoMsg {
        return {
            type: "osmosis/tokenfactory/change-admin",
            value: MsgChangeAdmin.toAmino(message)
        };
    },
    fromProtoMsg(message: MsgChangeAdminProtoMsg): MsgChangeAdmin {
        return MsgChangeAdmin.decode(message.value);
    },
    toProto(message: MsgChangeAdmin): Uint8Array {
        return MsgChangeAdmin.encode(message).finish();
    },
    toProtoMsg(message: MsgChangeAdmin): MsgChangeAdminProtoMsg {
        return {
            typeUrl: "/osmosis.tokenfactory.v1beta1.MsgChangeAdmin",
            value: MsgChangeAdmin.encode(message).finish()
        };
    }
};
function createBaseMsgChangeAdminResponse(): MsgChangeAdminResponse {
    return {};
}
export const MsgChangeAdminResponse = {
    typeUrl: "/osmosis.tokenfactory.v1beta1.MsgChangeAdminResponse",
    aminoType: "osmosis/tokenfactory/change-admin-response",
    is(o: any): o is MsgChangeAdminResponse {
        return o && o.$typeUrl === MsgChangeAdminResponse.typeUrl;
    },
    isSDK(o: any): o is MsgChangeAdminResponseSDKType {
        return o && o.$typeUrl === MsgChangeAdminResponse.typeUrl;
    },
    isAmino(o: any): o is MsgChangeAdminResponseAmino {
        return o && o.$typeUrl === MsgChangeAdminResponse.typeUrl;
    },
    encode(_: MsgChangeAdminResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): MsgChangeAdminResponse {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgChangeAdminResponse();
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
    fromPartial(_: Partial<MsgChangeAdminResponse>): MsgChangeAdminResponse {
        const message = createBaseMsgChangeAdminResponse();
        return message;
    },
    fromAmino(_: MsgChangeAdminResponseAmino): MsgChangeAdminResponse {
        const message = createBaseMsgChangeAdminResponse();
        return message;
    },
    toAmino(_: MsgChangeAdminResponse): MsgChangeAdminResponseAmino {
        const obj: any = {};
        return obj;
    },
    fromAminoMsg(object: MsgChangeAdminResponseAminoMsg): MsgChangeAdminResponse {
        return MsgChangeAdminResponse.fromAmino(object.value);
    },
    toAminoMsg(message: MsgChangeAdminResponse): MsgChangeAdminResponseAminoMsg {
        return {
            type: "osmosis/tokenfactory/change-admin-response",
            value: MsgChangeAdminResponse.toAmino(message)
        };
    },
    fromProtoMsg(message: MsgChangeAdminResponseProtoMsg): MsgChangeAdminResponse {
        return MsgChangeAdminResponse.decode(message.value);
    },
    toProto(message: MsgChangeAdminResponse): Uint8Array {
        return MsgChangeAdminResponse.encode(message).finish();
    },
    toProtoMsg(message: MsgChangeAdminResponse): MsgChangeAdminResponseProtoMsg {
        return {
            typeUrl: "/osmosis.tokenfactory.v1beta1.MsgChangeAdminResponse",
            value: MsgChangeAdminResponse.encode(message).finish()
        };
    }
};
function createBaseMsgSetBeforeSendHook(): MsgSetBeforeSendHook {
    return {
        sender: "",
        denom: "",
        cosmwasmAddress: ""
    };
}
export const MsgSetBeforeSendHook = {
    typeUrl: "/osmosis.tokenfactory.v1beta1.MsgSetBeforeSendHook",
    aminoType: "osmosis/tokenfactory/set-bef-send-hook",
    is(o: any): o is MsgSetBeforeSendHook {
        return o && (o.$typeUrl === MsgSetBeforeSendHook.typeUrl || typeof o.sender === "string" && typeof o.denom === "string" && typeof o.cosmwasmAddress === "string");
    },
    isSDK(o: any): o is MsgSetBeforeSendHookSDKType {
        return o && (o.$typeUrl === MsgSetBeforeSendHook.typeUrl || typeof o.sender === "string" && typeof o.denom === "string" && typeof o.cosmwasm_address === "string");
    },
    isAmino(o: any): o is MsgSetBeforeSendHookAmino {
        return o && (o.$typeUrl === MsgSetBeforeSendHook.typeUrl || typeof o.sender === "string" && typeof o.denom === "string" && typeof o.cosmwasm_address === "string");
    },
    encode(message: MsgSetBeforeSendHook, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        if (message.sender !== "") {
            writer.uint32(10).string(message.sender);
        }
        if (message.denom !== "") {
            writer.uint32(18).string(message.denom);
        }
        if (message.cosmwasmAddress !== "") {
            writer.uint32(26).string(message.cosmwasmAddress);
        }
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): MsgSetBeforeSendHook {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgSetBeforeSendHook();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.sender = reader.string();
                    break;
                case 2:
                    message.denom = reader.string();
                    break;
                case 3:
                    message.cosmwasmAddress = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromPartial(object: Partial<MsgSetBeforeSendHook>): MsgSetBeforeSendHook {
        const message = createBaseMsgSetBeforeSendHook();
        message.sender = object.sender ?? "";
        message.denom = object.denom ?? "";
        message.cosmwasmAddress = object.cosmwasmAddress ?? "";
        return message;
    },
    fromAmino(object: MsgSetBeforeSendHookAmino): MsgSetBeforeSendHook {
        const message = createBaseMsgSetBeforeSendHook();
        if (object.sender !== undefined && object.sender !== null) {
            message.sender = object.sender;
        }
        if (object.denom !== undefined && object.denom !== null) {
            message.denom = object.denom;
        }
        if (object.cosmwasm_address !== undefined && object.cosmwasm_address !== null) {
            message.cosmwasmAddress = object.cosmwasm_address;
        }
        return message;
    },
    toAmino(message: MsgSetBeforeSendHook): MsgSetBeforeSendHookAmino {
        const obj: any = {};
        obj.sender = message.sender === "" ? undefined : message.sender;
        obj.denom = message.denom === "" ? undefined : message.denom;
        obj.cosmwasm_address = message.cosmwasmAddress ?? "";
        return obj;
    },
    fromAminoMsg(object: MsgSetBeforeSendHookAminoMsg): MsgSetBeforeSendHook {
        return MsgSetBeforeSendHook.fromAmino(object.value);
    },
    toAminoMsg(message: MsgSetBeforeSendHook): MsgSetBeforeSendHookAminoMsg {
        return {
            type: "osmosis/tokenfactory/set-bef-send-hook",
            value: MsgSetBeforeSendHook.toAmino(message)
        };
    },
    fromProtoMsg(message: MsgSetBeforeSendHookProtoMsg): MsgSetBeforeSendHook {
        return MsgSetBeforeSendHook.decode(message.value);
    },
    toProto(message: MsgSetBeforeSendHook): Uint8Array {
        return MsgSetBeforeSendHook.encode(message).finish();
    },
    toProtoMsg(message: MsgSetBeforeSendHook): MsgSetBeforeSendHookProtoMsg {
        return {
            typeUrl: "/osmosis.tokenfactory.v1beta1.MsgSetBeforeSendHook",
            value: MsgSetBeforeSendHook.encode(message).finish()
        };
    }
};
function createBaseMsgSetBeforeSendHookResponse(): MsgSetBeforeSendHookResponse {
    return {};
}
export const MsgSetBeforeSendHookResponse = {
    typeUrl: "/osmosis.tokenfactory.v1beta1.MsgSetBeforeSendHookResponse",
    aminoType: "osmosis/tokenfactory/set-before-send-hook-response",
    is(o: any): o is MsgSetBeforeSendHookResponse {
        return o && o.$typeUrl === MsgSetBeforeSendHookResponse.typeUrl;
    },
    isSDK(o: any): o is MsgSetBeforeSendHookResponseSDKType {
        return o && o.$typeUrl === MsgSetBeforeSendHookResponse.typeUrl;
    },
    isAmino(o: any): o is MsgSetBeforeSendHookResponseAmino {
        return o && o.$typeUrl === MsgSetBeforeSendHookResponse.typeUrl;
    },
    encode(_: MsgSetBeforeSendHookResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): MsgSetBeforeSendHookResponse {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgSetBeforeSendHookResponse();
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
    fromPartial(_: Partial<MsgSetBeforeSendHookResponse>): MsgSetBeforeSendHookResponse {
        const message = createBaseMsgSetBeforeSendHookResponse();
        return message;
    },
    fromAmino(_: MsgSetBeforeSendHookResponseAmino): MsgSetBeforeSendHookResponse {
        const message = createBaseMsgSetBeforeSendHookResponse();
        return message;
    },
    toAmino(_: MsgSetBeforeSendHookResponse): MsgSetBeforeSendHookResponseAmino {
        const obj: any = {};
        return obj;
    },
    fromAminoMsg(object: MsgSetBeforeSendHookResponseAminoMsg): MsgSetBeforeSendHookResponse {
        return MsgSetBeforeSendHookResponse.fromAmino(object.value);
    },
    toAminoMsg(message: MsgSetBeforeSendHookResponse): MsgSetBeforeSendHookResponseAminoMsg {
        return {
            type: "osmosis/tokenfactory/set-before-send-hook-response",
            value: MsgSetBeforeSendHookResponse.toAmino(message)
        };
    },
    fromProtoMsg(message: MsgSetBeforeSendHookResponseProtoMsg): MsgSetBeforeSendHookResponse {
        return MsgSetBeforeSendHookResponse.decode(message.value);
    },
    toProto(message: MsgSetBeforeSendHookResponse): Uint8Array {
        return MsgSetBeforeSendHookResponse.encode(message).finish();
    },
    toProtoMsg(message: MsgSetBeforeSendHookResponse): MsgSetBeforeSendHookResponseProtoMsg {
        return {
            typeUrl: "/osmosis.tokenfactory.v1beta1.MsgSetBeforeSendHookResponse",
            value: MsgSetBeforeSendHookResponse.encode(message).finish()
        };
    }
};
function createBaseMsgSetDenomMetadata(): MsgSetDenomMetadata {
    return {
        sender: "",
        metadata: Metadata.fromPartial({})
    };
}
export const MsgSetDenomMetadata = {
    typeUrl: "/osmosis.tokenfactory.v1beta1.MsgSetDenomMetadata",
    aminoType: "osmosis/tokenfactory/set-denom-metadata",
    is(o: any): o is MsgSetDenomMetadata {
        return o && (o.$typeUrl === MsgSetDenomMetadata.typeUrl || typeof o.sender === "string" && Metadata.is(o.metadata));
    },
    isSDK(o: any): o is MsgSetDenomMetadataSDKType {
        return o && (o.$typeUrl === MsgSetDenomMetadata.typeUrl || typeof o.sender === "string" && Metadata.isSDK(o.metadata));
    },
    isAmino(o: any): o is MsgSetDenomMetadataAmino {
        return o && (o.$typeUrl === MsgSetDenomMetadata.typeUrl || typeof o.sender === "string" && Metadata.isAmino(o.metadata));
    },
    encode(message: MsgSetDenomMetadata, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        if (message.sender !== "") {
            writer.uint32(10).string(message.sender);
        }
        if (message.metadata !== undefined) {
            Metadata.encode(message.metadata, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): MsgSetDenomMetadata {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgSetDenomMetadata();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.sender = reader.string();
                    break;
                case 2:
                    message.metadata = Metadata.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromPartial(object: Partial<MsgSetDenomMetadata>): MsgSetDenomMetadata {
        const message = createBaseMsgSetDenomMetadata();
        message.sender = object.sender ?? "";
        message.metadata = object.metadata !== undefined && object.metadata !== null ? Metadata.fromPartial(object.metadata) : undefined;
        return message;
    },
    fromAmino(object: MsgSetDenomMetadataAmino): MsgSetDenomMetadata {
        const message = createBaseMsgSetDenomMetadata();
        if (object.sender !== undefined && object.sender !== null) {
            message.sender = object.sender;
        }
        if (object.metadata !== undefined && object.metadata !== null) {
            message.metadata = Metadata.fromAmino(object.metadata);
        }
        return message;
    },
    toAmino(message: MsgSetDenomMetadata): MsgSetDenomMetadataAmino {
        const obj: any = {};
        obj.sender = message.sender === "" ? undefined : message.sender;
        obj.metadata = message.metadata ? Metadata.toAmino(message.metadata) : undefined;
        return obj;
    },
    fromAminoMsg(object: MsgSetDenomMetadataAminoMsg): MsgSetDenomMetadata {
        return MsgSetDenomMetadata.fromAmino(object.value);
    },
    toAminoMsg(message: MsgSetDenomMetadata): MsgSetDenomMetadataAminoMsg {
        return {
            type: "osmosis/tokenfactory/set-denom-metadata",
            value: MsgSetDenomMetadata.toAmino(message)
        };
    },
    fromProtoMsg(message: MsgSetDenomMetadataProtoMsg): MsgSetDenomMetadata {
        return MsgSetDenomMetadata.decode(message.value);
    },
    toProto(message: MsgSetDenomMetadata): Uint8Array {
        return MsgSetDenomMetadata.encode(message).finish();
    },
    toProtoMsg(message: MsgSetDenomMetadata): MsgSetDenomMetadataProtoMsg {
        return {
            typeUrl: "/osmosis.tokenfactory.v1beta1.MsgSetDenomMetadata",
            value: MsgSetDenomMetadata.encode(message).finish()
        };
    }
};
function createBaseMsgSetDenomMetadataResponse(): MsgSetDenomMetadataResponse {
    return {};
}
export const MsgSetDenomMetadataResponse = {
    typeUrl: "/osmosis.tokenfactory.v1beta1.MsgSetDenomMetadataResponse",
    aminoType: "osmosis/tokenfactory/set-denom-metadata-response",
    is(o: any): o is MsgSetDenomMetadataResponse {
        return o && o.$typeUrl === MsgSetDenomMetadataResponse.typeUrl;
    },
    isSDK(o: any): o is MsgSetDenomMetadataResponseSDKType {
        return o && o.$typeUrl === MsgSetDenomMetadataResponse.typeUrl;
    },
    isAmino(o: any): o is MsgSetDenomMetadataResponseAmino {
        return o && o.$typeUrl === MsgSetDenomMetadataResponse.typeUrl;
    },
    encode(_: MsgSetDenomMetadataResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): MsgSetDenomMetadataResponse {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgSetDenomMetadataResponse();
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
    fromPartial(_: Partial<MsgSetDenomMetadataResponse>): MsgSetDenomMetadataResponse {
        const message = createBaseMsgSetDenomMetadataResponse();
        return message;
    },
    fromAmino(_: MsgSetDenomMetadataResponseAmino): MsgSetDenomMetadataResponse {
        const message = createBaseMsgSetDenomMetadataResponse();
        return message;
    },
    toAmino(_: MsgSetDenomMetadataResponse): MsgSetDenomMetadataResponseAmino {
        const obj: any = {};
        return obj;
    },
    fromAminoMsg(object: MsgSetDenomMetadataResponseAminoMsg): MsgSetDenomMetadataResponse {
        return MsgSetDenomMetadataResponse.fromAmino(object.value);
    },
    toAminoMsg(message: MsgSetDenomMetadataResponse): MsgSetDenomMetadataResponseAminoMsg {
        return {
            type: "osmosis/tokenfactory/set-denom-metadata-response",
            value: MsgSetDenomMetadataResponse.toAmino(message)
        };
    },
    fromProtoMsg(message: MsgSetDenomMetadataResponseProtoMsg): MsgSetDenomMetadataResponse {
        return MsgSetDenomMetadataResponse.decode(message.value);
    },
    toProto(message: MsgSetDenomMetadataResponse): Uint8Array {
        return MsgSetDenomMetadataResponse.encode(message).finish();
    },
    toProtoMsg(message: MsgSetDenomMetadataResponse): MsgSetDenomMetadataResponseProtoMsg {
        return {
            typeUrl: "/osmosis.tokenfactory.v1beta1.MsgSetDenomMetadataResponse",
            value: MsgSetDenomMetadataResponse.encode(message).finish()
        };
    }
};
function createBaseMsgForceTransfer(): MsgForceTransfer {
    return {
        sender: "",
        amount: Coin.fromPartial({}),
        transferFromAddress: "",
        transferToAddress: ""
    };
}
export const MsgForceTransfer = {
    typeUrl: "/osmosis.tokenfactory.v1beta1.MsgForceTransfer",
    aminoType: "osmosis/tokenfactory/force-transfer",
    is(o: any): o is MsgForceTransfer {
        return o && (o.$typeUrl === MsgForceTransfer.typeUrl || typeof o.sender === "string" && Coin.is(o.amount) && typeof o.transferFromAddress === "string" && typeof o.transferToAddress === "string");
    },
    isSDK(o: any): o is MsgForceTransferSDKType {
        return o && (o.$typeUrl === MsgForceTransfer.typeUrl || typeof o.sender === "string" && Coin.isSDK(o.amount) && typeof o.transferFromAddress === "string" && typeof o.transferToAddress === "string");
    },
    isAmino(o: any): o is MsgForceTransferAmino {
        return o && (o.$typeUrl === MsgForceTransfer.typeUrl || typeof o.sender === "string" && Coin.isAmino(o.amount) && typeof o.transferFromAddress === "string" && typeof o.transferToAddress === "string");
    },
    encode(message: MsgForceTransfer, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        if (message.sender !== "") {
            writer.uint32(10).string(message.sender);
        }
        if (message.amount !== undefined) {
            Coin.encode(message.amount, writer.uint32(18).fork()).ldelim();
        }
        if (message.transferFromAddress !== "") {
            writer.uint32(26).string(message.transferFromAddress);
        }
        if (message.transferToAddress !== "") {
            writer.uint32(34).string(message.transferToAddress);
        }
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): MsgForceTransfer {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgForceTransfer();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.sender = reader.string();
                    break;
                case 2:
                    message.amount = Coin.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.transferFromAddress = reader.string();
                    break;
                case 4:
                    message.transferToAddress = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromPartial(object: Partial<MsgForceTransfer>): MsgForceTransfer {
        const message = createBaseMsgForceTransfer();
        message.sender = object.sender ?? "";
        message.amount = object.amount !== undefined && object.amount !== null ? Coin.fromPartial(object.amount) : undefined;
        message.transferFromAddress = object.transferFromAddress ?? "";
        message.transferToAddress = object.transferToAddress ?? "";
        return message;
    },
    fromAmino(object: MsgForceTransferAmino): MsgForceTransfer {
        const message = createBaseMsgForceTransfer();
        if (object.sender !== undefined && object.sender !== null) {
            message.sender = object.sender;
        }
        if (object.amount !== undefined && object.amount !== null) {
            message.amount = Coin.fromAmino(object.amount);
        }
        if (object.transferFromAddress !== undefined && object.transferFromAddress !== null) {
            message.transferFromAddress = object.transferFromAddress;
        }
        if (object.transferToAddress !== undefined && object.transferToAddress !== null) {
            message.transferToAddress = object.transferToAddress;
        }
        return message;
    },
    toAmino(message: MsgForceTransfer): MsgForceTransferAmino {
        const obj: any = {};
        obj.sender = message.sender === "" ? undefined : message.sender;
        obj.amount = message.amount ? Coin.toAmino(message.amount) : undefined;
        obj.transferFromAddress = message.transferFromAddress === "" ? undefined : message.transferFromAddress;
        obj.transferToAddress = message.transferToAddress === "" ? undefined : message.transferToAddress;
        return obj;
    },
    fromAminoMsg(object: MsgForceTransferAminoMsg): MsgForceTransfer {
        return MsgForceTransfer.fromAmino(object.value);
    },
    toAminoMsg(message: MsgForceTransfer): MsgForceTransferAminoMsg {
        return {
            type: "osmosis/tokenfactory/force-transfer",
            value: MsgForceTransfer.toAmino(message)
        };
    },
    fromProtoMsg(message: MsgForceTransferProtoMsg): MsgForceTransfer {
        return MsgForceTransfer.decode(message.value);
    },
    toProto(message: MsgForceTransfer): Uint8Array {
        return MsgForceTransfer.encode(message).finish();
    },
    toProtoMsg(message: MsgForceTransfer): MsgForceTransferProtoMsg {
        return {
            typeUrl: "/osmosis.tokenfactory.v1beta1.MsgForceTransfer",
            value: MsgForceTransfer.encode(message).finish()
        };
    }
};
function createBaseMsgForceTransferResponse(): MsgForceTransferResponse {
    return {};
}
export const MsgForceTransferResponse = {
    typeUrl: "/osmosis.tokenfactory.v1beta1.MsgForceTransferResponse",
    aminoType: "osmosis/tokenfactory/force-transfer-response",
    is(o: any): o is MsgForceTransferResponse {
        return o && o.$typeUrl === MsgForceTransferResponse.typeUrl;
    },
    isSDK(o: any): o is MsgForceTransferResponseSDKType {
        return o && o.$typeUrl === MsgForceTransferResponse.typeUrl;
    },
    isAmino(o: any): o is MsgForceTransferResponseAmino {
        return o && o.$typeUrl === MsgForceTransferResponse.typeUrl;
    },
    encode(_: MsgForceTransferResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): MsgForceTransferResponse {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgForceTransferResponse();
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
    fromPartial(_: Partial<MsgForceTransferResponse>): MsgForceTransferResponse {
        const message = createBaseMsgForceTransferResponse();
        return message;
    },
    fromAmino(_: MsgForceTransferResponseAmino): MsgForceTransferResponse {
        const message = createBaseMsgForceTransferResponse();
        return message;
    },
    toAmino(_: MsgForceTransferResponse): MsgForceTransferResponseAmino {
        const obj: any = {};
        return obj;
    },
    fromAminoMsg(object: MsgForceTransferResponseAminoMsg): MsgForceTransferResponse {
        return MsgForceTransferResponse.fromAmino(object.value);
    },
    toAminoMsg(message: MsgForceTransferResponse): MsgForceTransferResponseAminoMsg {
        return {
            type: "osmosis/tokenfactory/force-transfer-response",
            value: MsgForceTransferResponse.toAmino(message)
        };
    },
    fromProtoMsg(message: MsgForceTransferResponseProtoMsg): MsgForceTransferResponse {
        return MsgForceTransferResponse.decode(message.value);
    },
    toProto(message: MsgForceTransferResponse): Uint8Array {
        return MsgForceTransferResponse.encode(message).finish();
    },
    toProtoMsg(message: MsgForceTransferResponse): MsgForceTransferResponseProtoMsg {
        return {
            typeUrl: "/osmosis.tokenfactory.v1beta1.MsgForceTransferResponse",
            value: MsgForceTransferResponse.encode(message).finish()
        };
    }
};
