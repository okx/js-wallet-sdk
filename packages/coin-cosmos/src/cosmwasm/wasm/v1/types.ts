//@ts-nocheck
import { Any, AnyProtoMsg, AnyAmino, AnySDKType } from "../../../typesV2/google/protobuf/any";
import { isSet, bytesFromBase64, base64FromBytes } from "../../../helpers";
import { BinaryReader, BinaryWriter } from "../../../binary";
import { toUtf8, fromUtf8 } from "@cosmjs/encoding";
/** AccessType permission types */
export enum AccessType {
    /** ACCESS_TYPE_UNSPECIFIED - AccessTypeUnspecified placeholder for empty value */
    ACCESS_TYPE_UNSPECIFIED = 0,
    /** ACCESS_TYPE_NOBODY - AccessTypeNobody forbidden */
    ACCESS_TYPE_NOBODY = 1,
    /** ACCESS_TYPE_EVERYBODY - AccessTypeEverybody unrestricted */
    ACCESS_TYPE_EVERYBODY = 3,
    /** ACCESS_TYPE_ANY_OF_ADDRESSES - AccessTypeAnyOfAddresses allow any of the addresses */
    ACCESS_TYPE_ANY_OF_ADDRESSES = 4,
    UNRECOGNIZED = -1,
}
export const AccessTypeSDKType = AccessType;
export const AccessTypeAmino = AccessType;
export function accessTypeFromJSON(object: any): AccessType {
    switch (object) {
        case 0:
        case "ACCESS_TYPE_UNSPECIFIED":
            return AccessType.ACCESS_TYPE_UNSPECIFIED;
        case 1:
        case "ACCESS_TYPE_NOBODY":
            return AccessType.ACCESS_TYPE_NOBODY;
        case 3:
        case "ACCESS_TYPE_EVERYBODY":
            return AccessType.ACCESS_TYPE_EVERYBODY;
        case 4:
        case "ACCESS_TYPE_ANY_OF_ADDRESSES":
            return AccessType.ACCESS_TYPE_ANY_OF_ADDRESSES;
        case -1:
        case "UNRECOGNIZED":
        default:
            return AccessType.UNRECOGNIZED;
    }
}
export function accessTypeToJSON(object: AccessType): string {
    switch (object) {
        case AccessType.ACCESS_TYPE_UNSPECIFIED:
            return "ACCESS_TYPE_UNSPECIFIED";
        case AccessType.ACCESS_TYPE_NOBODY:
            return "ACCESS_TYPE_NOBODY";
        case AccessType.ACCESS_TYPE_EVERYBODY:
            return "ACCESS_TYPE_EVERYBODY";
        case AccessType.ACCESS_TYPE_ANY_OF_ADDRESSES:
            return "ACCESS_TYPE_ANY_OF_ADDRESSES";
        case AccessType.UNRECOGNIZED:
        default:
            return "UNRECOGNIZED";
    }
}
/** ContractCodeHistoryOperationType actions that caused a code change */
export enum ContractCodeHistoryOperationType {
    /** CONTRACT_CODE_HISTORY_OPERATION_TYPE_UNSPECIFIED - ContractCodeHistoryOperationTypeUnspecified placeholder for empty value */
    CONTRACT_CODE_HISTORY_OPERATION_TYPE_UNSPECIFIED = 0,
    /** CONTRACT_CODE_HISTORY_OPERATION_TYPE_INIT - ContractCodeHistoryOperationTypeInit on chain contract instantiation */
    CONTRACT_CODE_HISTORY_OPERATION_TYPE_INIT = 1,
    /** CONTRACT_CODE_HISTORY_OPERATION_TYPE_MIGRATE - ContractCodeHistoryOperationTypeMigrate code migration */
    CONTRACT_CODE_HISTORY_OPERATION_TYPE_MIGRATE = 2,
    /** CONTRACT_CODE_HISTORY_OPERATION_TYPE_GENESIS - ContractCodeHistoryOperationTypeGenesis based on genesis data */
    CONTRACT_CODE_HISTORY_OPERATION_TYPE_GENESIS = 3,
    UNRECOGNIZED = -1,
}
export const ContractCodeHistoryOperationTypeSDKType = ContractCodeHistoryOperationType;
export const ContractCodeHistoryOperationTypeAmino = ContractCodeHistoryOperationType;
export function contractCodeHistoryOperationTypeFromJSON(object: any): ContractCodeHistoryOperationType {
    switch (object) {
        case 0:
        case "CONTRACT_CODE_HISTORY_OPERATION_TYPE_UNSPECIFIED":
            return ContractCodeHistoryOperationType.CONTRACT_CODE_HISTORY_OPERATION_TYPE_UNSPECIFIED;
        case 1:
        case "CONTRACT_CODE_HISTORY_OPERATION_TYPE_INIT":
            return ContractCodeHistoryOperationType.CONTRACT_CODE_HISTORY_OPERATION_TYPE_INIT;
        case 2:
        case "CONTRACT_CODE_HISTORY_OPERATION_TYPE_MIGRATE":
            return ContractCodeHistoryOperationType.CONTRACT_CODE_HISTORY_OPERATION_TYPE_MIGRATE;
        case 3:
        case "CONTRACT_CODE_HISTORY_OPERATION_TYPE_GENESIS":
            return ContractCodeHistoryOperationType.CONTRACT_CODE_HISTORY_OPERATION_TYPE_GENESIS;
        case -1:
        case "UNRECOGNIZED":
        default:
            return ContractCodeHistoryOperationType.UNRECOGNIZED;
    }
}
export function contractCodeHistoryOperationTypeToJSON(object: ContractCodeHistoryOperationType): string {
    switch (object) {
        case ContractCodeHistoryOperationType.CONTRACT_CODE_HISTORY_OPERATION_TYPE_UNSPECIFIED:
            return "CONTRACT_CODE_HISTORY_OPERATION_TYPE_UNSPECIFIED";
        case ContractCodeHistoryOperationType.CONTRACT_CODE_HISTORY_OPERATION_TYPE_INIT:
            return "CONTRACT_CODE_HISTORY_OPERATION_TYPE_INIT";
        case ContractCodeHistoryOperationType.CONTRACT_CODE_HISTORY_OPERATION_TYPE_MIGRATE:
            return "CONTRACT_CODE_HISTORY_OPERATION_TYPE_MIGRATE";
        case ContractCodeHistoryOperationType.CONTRACT_CODE_HISTORY_OPERATION_TYPE_GENESIS:
            return "CONTRACT_CODE_HISTORY_OPERATION_TYPE_GENESIS";
        case ContractCodeHistoryOperationType.UNRECOGNIZED:
        default:
            return "UNRECOGNIZED";
    }
}
/** AccessTypeParam */
export interface AccessTypeParam {
    value: AccessType;
}
export interface AccessTypeParamProtoMsg {
    typeUrl: "/cosmwasm.wasm.v1.AccessTypeParam";
    value: Uint8Array;
}
/** AccessTypeParam */
export interface AccessTypeParamAmino {
    value?: AccessType;
}
export interface AccessTypeParamAminoMsg {
    type: "wasm/AccessTypeParam";
    value: AccessTypeParamAmino;
}
/** AccessTypeParam */
export interface AccessTypeParamSDKType {
    value: AccessType;
}
/** AccessConfig access control type. */
export interface AccessConfig {
    permission: AccessType;
    addresses: string[];
}
export interface AccessConfigProtoMsg {
    typeUrl: "/cosmwasm.wasm.v1.AccessConfig";
    value: Uint8Array;
}
/** AccessConfig access control type. */
export interface AccessConfigAmino {
    permission?: AccessType;
    addresses?: string[];
}
export interface AccessConfigAminoMsg {
    type: "wasm/AccessConfig";
    value: AccessConfigAmino;
}
/** AccessConfig access control type. */
export interface AccessConfigSDKType {
    permission: AccessType;
    addresses: string[];
}
/** Params defines the set of wasm parameters. */
export interface Params {
    codeUploadAccess: AccessConfig;
    instantiateDefaultPermission: AccessType;
}
export interface ParamsProtoMsg {
    typeUrl: "/cosmwasm.wasm.v1.Params";
    value: Uint8Array;
}
/** Params defines the set of wasm parameters. */
export interface ParamsAmino {
    code_upload_access: AccessConfigAmino;
    instantiate_default_permission?: AccessType;
}
export interface ParamsAminoMsg {
    type: "wasm/Params";
    value: ParamsAmino;
}
/** Params defines the set of wasm parameters. */
export interface ParamsSDKType {
    code_upload_access: AccessConfigSDKType;
    instantiate_default_permission: AccessType;
}
/** CodeInfo is data for the uploaded contract WASM code */
export interface CodeInfo {
    /** CodeHash is the unique identifier created by wasmvm */
    codeHash: Uint8Array;
    /** Creator address who initially stored the code */
    creator: string;
    /** InstantiateConfig access control to apply on contract creation, optional */
    instantiateConfig: AccessConfig;
}
export interface CodeInfoProtoMsg {
    typeUrl: "/cosmwasm.wasm.v1.CodeInfo";
    value: Uint8Array;
}
/** CodeInfo is data for the uploaded contract WASM code */
export interface CodeInfoAmino {
    /** CodeHash is the unique identifier created by wasmvm */
    code_hash?: string;
    /** Creator address who initially stored the code */
    creator?: string;
    /** InstantiateConfig access control to apply on contract creation, optional */
    instantiate_config: AccessConfigAmino;
}
export interface CodeInfoAminoMsg {
    type: "wasm/CodeInfo";
    value: CodeInfoAmino;
}
/** CodeInfo is data for the uploaded contract WASM code */
export interface CodeInfoSDKType {
    code_hash: Uint8Array;
    creator: string;
    instantiate_config: AccessConfigSDKType;
}
/** ContractInfo stores a WASM contract instance */
export interface ContractInfo {
    /** CodeID is the reference to the stored Wasm code */
    codeId: bigint;
    /** Creator address who initially instantiated the contract */
    creator: string;
    /** Admin is an optional address that can execute migrations */
    admin: string;
    /** Label is optional metadata to be stored with a contract instance. */
    label: string;
    /** Created Tx position when the contract was instantiated. */
    created?: AbsoluteTxPosition;
    ibcPortId: string;
    /**
     * Extension is an extension point to store custom metadata within the
     * persistence model.
     */
    extension?: Any | undefined;
}
export interface ContractInfoProtoMsg {
    typeUrl: "/cosmwasm.wasm.v1.ContractInfo";
    value: Uint8Array;
}
export type ContractInfoEncoded = Omit<ContractInfo, "extension"> & {
    /**
     * Extension is an extension point to store custom metadata within the
     * persistence model.
     */
    extension?: AnyProtoMsg | undefined;
};
/** ContractInfo stores a WASM contract instance */
export interface ContractInfoAmino {
    /** CodeID is the reference to the stored Wasm code */
    code_id?: string;
    /** Creator address who initially instantiated the contract */
    creator?: string;
    /** Admin is an optional address that can execute migrations */
    admin?: string;
    /** Label is optional metadata to be stored with a contract instance. */
    label?: string;
    /** Created Tx position when the contract was instantiated. */
    created?: AbsoluteTxPositionAmino;
    ibc_port_id?: string;
    /**
     * Extension is an extension point to store custom metadata within the
     * persistence model.
     */
    extension?: AnyAmino;
}
export interface ContractInfoAminoMsg {
    type: "wasm/ContractInfo";
    value: ContractInfoAmino;
}
/** ContractInfo stores a WASM contract instance */
export interface ContractInfoSDKType {
    code_id: bigint;
    creator: string;
    admin: string;
    label: string;
    created?: AbsoluteTxPositionSDKType;
    ibc_port_id: string;
    extension?: AnySDKType | undefined;
}
/** ContractCodeHistoryEntry metadata to a contract. */
export interface ContractCodeHistoryEntry {
    operation: ContractCodeHistoryOperationType;
    /** CodeID is the reference to the stored WASM code */
    codeId: bigint;
    /** Updated Tx position when the operation was executed. */
    updated?: AbsoluteTxPosition;
    msg: Uint8Array;
}
export interface ContractCodeHistoryEntryProtoMsg {
    typeUrl: "/cosmwasm.wasm.v1.ContractCodeHistoryEntry";
    value: Uint8Array;
}
/** ContractCodeHistoryEntry metadata to a contract. */
export interface ContractCodeHistoryEntryAmino {
    operation?: ContractCodeHistoryOperationType;
    /** CodeID is the reference to the stored WASM code */
    code_id?: string;
    /** Updated Tx position when the operation was executed. */
    updated?: AbsoluteTxPositionAmino;
    msg?: any;
}
export interface ContractCodeHistoryEntryAminoMsg {
    type: "wasm/ContractCodeHistoryEntry";
    value: ContractCodeHistoryEntryAmino;
}
/** ContractCodeHistoryEntry metadata to a contract. */
export interface ContractCodeHistoryEntrySDKType {
    operation: ContractCodeHistoryOperationType;
    code_id: bigint;
    updated?: AbsoluteTxPositionSDKType;
    msg: Uint8Array;
}
/**
 * AbsoluteTxPosition is a unique transaction position that allows for global
 * ordering of transactions.
 */
export interface AbsoluteTxPosition {
    /** BlockHeight is the block the contract was created at */
    blockHeight: bigint;
    /**
     * TxIndex is a monotonic counter within the block (actual transaction index,
     * or gas consumed)
     */
    txIndex: bigint;
}
export interface AbsoluteTxPositionProtoMsg {
    typeUrl: "/cosmwasm.wasm.v1.AbsoluteTxPosition";
    value: Uint8Array;
}
/**
 * AbsoluteTxPosition is a unique transaction position that allows for global
 * ordering of transactions.
 */
export interface AbsoluteTxPositionAmino {
    /** BlockHeight is the block the contract was created at */
    block_height?: string;
    /**
     * TxIndex is a monotonic counter within the block (actual transaction index,
     * or gas consumed)
     */
    tx_index?: string;
}
export interface AbsoluteTxPositionAminoMsg {
    type: "wasm/AbsoluteTxPosition";
    value: AbsoluteTxPositionAmino;
}
/**
 * AbsoluteTxPosition is a unique transaction position that allows for global
 * ordering of transactions.
 */
export interface AbsoluteTxPositionSDKType {
    block_height: bigint;
    tx_index: bigint;
}
/** Model is a struct that holds a KV pair */
export interface Model {
    /** hex-encode key to read it better (this is often ascii) */
    key: Uint8Array;
    /** base64-encode raw value */
    value: Uint8Array;
}
export interface ModelProtoMsg {
    typeUrl: "/cosmwasm.wasm.v1.Model";
    value: Uint8Array;
}
/** Model is a struct that holds a KV pair */
export interface ModelAmino {
    /** hex-encode key to read it better (this is often ascii) */
    key?: string;
    /** base64-encode raw value */
    value?: string;
}
export interface ModelAminoMsg {
    type: "wasm/Model";
    value: ModelAmino;
}
/** Model is a struct that holds a KV pair */
export interface ModelSDKType {
    key: Uint8Array;
    value: Uint8Array;
}
function createBaseAccessTypeParam(): AccessTypeParam {
    return {
        value: 0
    };
}
export const AccessTypeParam = {
    typeUrl: "/cosmwasm.wasm.v1.AccessTypeParam",
    aminoType: "wasm/AccessTypeParam",
    is(o: any): o is AccessTypeParam {
        return o && (o.$typeUrl === AccessTypeParam.typeUrl || isSet(o.value));
    },
    isSDK(o: any): o is AccessTypeParamSDKType {
        return o && (o.$typeUrl === AccessTypeParam.typeUrl || isSet(o.value));
    },
    isAmino(o: any): o is AccessTypeParamAmino {
        return o && (o.$typeUrl === AccessTypeParam.typeUrl || isSet(o.value));
    },
    encode(message: AccessTypeParam, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        if (message.value !== 0) {
            writer.uint32(8).int32(message.value);
        }
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): AccessTypeParam {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseAccessTypeParam();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.value = (reader.int32() as any);
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromPartial(object: Partial<AccessTypeParam>): AccessTypeParam {
        const message = createBaseAccessTypeParam();
        message.value = object.value ?? 0;
        return message;
    },
    fromAmino(object: AccessTypeParamAmino): AccessTypeParam {
        const message = createBaseAccessTypeParam();
        if (object.value !== undefined && object.value !== null) {
            message.value = object.value;
        }
        return message;
    },
    toAmino(message: AccessTypeParam): AccessTypeParamAmino {
        const obj: any = {};
        obj.value = message.value === 0 ? undefined : message.value;
        return obj;
    },
    fromAminoMsg(object: AccessTypeParamAminoMsg): AccessTypeParam {
        return AccessTypeParam.fromAmino(object.value);
    },
    toAminoMsg(message: AccessTypeParam): AccessTypeParamAminoMsg {
        return {
            type: "wasm/AccessTypeParam",
            value: AccessTypeParam.toAmino(message)
        };
    },
    fromProtoMsg(message: AccessTypeParamProtoMsg): AccessTypeParam {
        return AccessTypeParam.decode(message.value);
    },
    toProto(message: AccessTypeParam): Uint8Array {
        return AccessTypeParam.encode(message).finish();
    },
    toProtoMsg(message: AccessTypeParam): AccessTypeParamProtoMsg {
        return {
            typeUrl: "/cosmwasm.wasm.v1.AccessTypeParam",
            value: AccessTypeParam.encode(message).finish()
        };
    }
};
function createBaseAccessConfig(): AccessConfig {
    return {
        permission: 0,
        addresses: []
    };
}
export const AccessConfig = {
    typeUrl: "/cosmwasm.wasm.v1.AccessConfig",
    aminoType: "wasm/AccessConfig",
    is(o: any): o is AccessConfig {
        return o && (o.$typeUrl === AccessConfig.typeUrl || isSet(o.permission) && Array.isArray(o.addresses) && (!o.addresses.length || typeof o.addresses[0] === "string"));
    },
    isSDK(o: any): o is AccessConfigSDKType {
        return o && (o.$typeUrl === AccessConfig.typeUrl || isSet(o.permission) && Array.isArray(o.addresses) && (!o.addresses.length || typeof o.addresses[0] === "string"));
    },
    isAmino(o: any): o is AccessConfigAmino {
        return o && (o.$typeUrl === AccessConfig.typeUrl || isSet(o.permission) && Array.isArray(o.addresses) && (!o.addresses.length || typeof o.addresses[0] === "string"));
    },
    encode(message: AccessConfig, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        if (message.permission !== 0) {
            writer.uint32(8).int32(message.permission);
        }
        for (const v of message.addresses) {
            writer.uint32(26).string(v!);
        }
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): AccessConfig {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseAccessConfig();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.permission = (reader.int32() as any);
                    break;
                case 3:
                    message.addresses.push(reader.string());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromPartial(object: Partial<AccessConfig>): AccessConfig {
        const message = createBaseAccessConfig();
        message.permission = object.permission ?? 0;
        message.addresses = object.addresses?.map(e => e) || [];
        return message;
    },
    fromAmino(object: AccessConfigAmino): AccessConfig {
        const message = createBaseAccessConfig();
        if (object.permission !== undefined && object.permission !== null) {
            message.permission = object.permission;
        }
        message.addresses = object.addresses?.map(e => e) || [];
        return message;
    },
    toAmino(message: AccessConfig): AccessConfigAmino {
        const obj: any = {};
        obj.permission = message.permission === 0 ? undefined : message.permission;
        if (message.addresses) {
            obj.addresses = message.addresses.map(e => e);
        } else {
            obj.addresses = message.addresses;
        }
        return obj;
    },
    fromAminoMsg(object: AccessConfigAminoMsg): AccessConfig {
        return AccessConfig.fromAmino(object.value);
    },
    toAminoMsg(message: AccessConfig): AccessConfigAminoMsg {
        return {
            type: "wasm/AccessConfig",
            value: AccessConfig.toAmino(message)
        };
    },
    fromProtoMsg(message: AccessConfigProtoMsg): AccessConfig {
        return AccessConfig.decode(message.value);
    },
    toProto(message: AccessConfig): Uint8Array {
        return AccessConfig.encode(message).finish();
    },
    toProtoMsg(message: AccessConfig): AccessConfigProtoMsg {
        return {
            typeUrl: "/cosmwasm.wasm.v1.AccessConfig",
            value: AccessConfig.encode(message).finish()
        };
    }
};
function createBaseParams(): Params {
    return {
        codeUploadAccess: AccessConfig.fromPartial({}),
        instantiateDefaultPermission: 0
    };
}
export const Params = {
    typeUrl: "/cosmwasm.wasm.v1.Params",
    aminoType: "wasm/Params",
    is(o: any): o is Params {
        return o && (o.$typeUrl === Params.typeUrl || AccessConfig.is(o.codeUploadAccess) && isSet(o.instantiateDefaultPermission));
    },
    isSDK(o: any): o is ParamsSDKType {
        return o && (o.$typeUrl === Params.typeUrl || AccessConfig.isSDK(o.code_upload_access) && isSet(o.instantiate_default_permission));
    },
    isAmino(o: any): o is ParamsAmino {
        return o && (o.$typeUrl === Params.typeUrl || AccessConfig.isAmino(o.code_upload_access) && isSet(o.instantiate_default_permission));
    },
    encode(message: Params, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        if (message.codeUploadAccess !== undefined) {
            AccessConfig.encode(message.codeUploadAccess, writer.uint32(10).fork()).ldelim();
        }
        if (message.instantiateDefaultPermission !== 0) {
            writer.uint32(16).int32(message.instantiateDefaultPermission);
        }
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): Params {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseParams();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.codeUploadAccess = AccessConfig.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.instantiateDefaultPermission = (reader.int32() as any);
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromPartial(object: Partial<Params>): Params {
        const message = createBaseParams();
        message.codeUploadAccess = object.codeUploadAccess !== undefined && object.codeUploadAccess !== null ? AccessConfig.fromPartial(object.codeUploadAccess) : undefined;
        message.instantiateDefaultPermission = object.instantiateDefaultPermission ?? 0;
        return message;
    },
    fromAmino(object: ParamsAmino): Params {
        const message = createBaseParams();
        if (object.code_upload_access !== undefined && object.code_upload_access !== null) {
            message.codeUploadAccess = AccessConfig.fromAmino(object.code_upload_access);
        }
        if (object.instantiate_default_permission !== undefined && object.instantiate_default_permission !== null) {
            message.instantiateDefaultPermission = object.instantiate_default_permission;
        }
        return message;
    },
    toAmino(message: Params): ParamsAmino {
        const obj: any = {};
        obj.code_upload_access = message.codeUploadAccess ? AccessConfig.toAmino(message.codeUploadAccess) : AccessConfig.toAmino(AccessConfig.fromPartial({}));
        obj.instantiate_default_permission = message.instantiateDefaultPermission === 0 ? undefined : message.instantiateDefaultPermission;
        return obj;
    },
    fromAminoMsg(object: ParamsAminoMsg): Params {
        return Params.fromAmino(object.value);
    },
    toAminoMsg(message: Params): ParamsAminoMsg {
        return {
            type: "wasm/Params",
            value: Params.toAmino(message)
        };
    },
    fromProtoMsg(message: ParamsProtoMsg): Params {
        return Params.decode(message.value);
    },
    toProto(message: Params): Uint8Array {
        return Params.encode(message).finish();
    },
    toProtoMsg(message: Params): ParamsProtoMsg {
        return {
            typeUrl: "/cosmwasm.wasm.v1.Params",
            value: Params.encode(message).finish()
        };
    }
};
function createBaseCodeInfo(): CodeInfo {
    return {
        codeHash: new Uint8Array(),
        creator: "",
        instantiateConfig: AccessConfig.fromPartial({})
    };
}
export const CodeInfo = {
    typeUrl: "/cosmwasm.wasm.v1.CodeInfo",
    aminoType: "wasm/CodeInfo",
    is(o: any): o is CodeInfo {
        return o && (o.$typeUrl === CodeInfo.typeUrl || (o.codeHash instanceof Uint8Array || typeof o.codeHash === "string") && typeof o.creator === "string" && AccessConfig.is(o.instantiateConfig));
    },
    isSDK(o: any): o is CodeInfoSDKType {
        return o && (o.$typeUrl === CodeInfo.typeUrl || (o.code_hash instanceof Uint8Array || typeof o.code_hash === "string") && typeof o.creator === "string" && AccessConfig.isSDK(o.instantiate_config));
    },
    isAmino(o: any): o is CodeInfoAmino {
        return o && (o.$typeUrl === CodeInfo.typeUrl || (o.code_hash instanceof Uint8Array || typeof o.code_hash === "string") && typeof o.creator === "string" && AccessConfig.isAmino(o.instantiate_config));
    },
    encode(message: CodeInfo, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        if (message.codeHash.length !== 0) {
            writer.uint32(10).bytes(message.codeHash);
        }
        if (message.creator !== "") {
            writer.uint32(18).string(message.creator);
        }
        if (message.instantiateConfig !== undefined) {
            AccessConfig.encode(message.instantiateConfig, writer.uint32(42).fork()).ldelim();
        }
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): CodeInfo {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseCodeInfo();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.codeHash = reader.bytes();
                    break;
                case 2:
                    message.creator = reader.string();
                    break;
                case 5:
                    message.instantiateConfig = AccessConfig.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromPartial(object: Partial<CodeInfo>): CodeInfo {
        const message = createBaseCodeInfo();
        message.codeHash = object.codeHash ?? new Uint8Array();
        message.creator = object.creator ?? "";
        message.instantiateConfig = object.instantiateConfig !== undefined && object.instantiateConfig !== null ? AccessConfig.fromPartial(object.instantiateConfig) : undefined;
        return message;
    },
    fromAmino(object: CodeInfoAmino): CodeInfo {
        const message = createBaseCodeInfo();
        if (object.code_hash !== undefined && object.code_hash !== null) {
            message.codeHash = bytesFromBase64(object.code_hash);
        }
        if (object.creator !== undefined && object.creator !== null) {
            message.creator = object.creator;
        }
        if (object.instantiate_config !== undefined && object.instantiate_config !== null) {
            message.instantiateConfig = AccessConfig.fromAmino(object.instantiate_config);
        }
        return message;
    },
    toAmino(message: CodeInfo): CodeInfoAmino {
        const obj: any = {};
        obj.code_hash = message.codeHash ? base64FromBytes(message.codeHash) : undefined;
        obj.creator = message.creator === "" ? undefined : message.creator;
        obj.instantiate_config = message.instantiateConfig ? AccessConfig.toAmino(message.instantiateConfig) : AccessConfig.toAmino(AccessConfig.fromPartial({}));
        return obj;
    },
    fromAminoMsg(object: CodeInfoAminoMsg): CodeInfo {
        return CodeInfo.fromAmino(object.value);
    },
    toAminoMsg(message: CodeInfo): CodeInfoAminoMsg {
        return {
            type: "wasm/CodeInfo",
            value: CodeInfo.toAmino(message)
        };
    },
    fromProtoMsg(message: CodeInfoProtoMsg): CodeInfo {
        return CodeInfo.decode(message.value);
    },
    toProto(message: CodeInfo): Uint8Array {
        return CodeInfo.encode(message).finish();
    },
    toProtoMsg(message: CodeInfo): CodeInfoProtoMsg {
        return {
            typeUrl: "/cosmwasm.wasm.v1.CodeInfo",
            value: CodeInfo.encode(message).finish()
        };
    }
};
function createBaseContractInfo(): ContractInfo {
    return {
        codeId: BigInt(0),
        creator: "",
        admin: "",
        label: "",
        created: undefined,
        ibcPortId: "",
        extension: undefined
    };
}
export const ContractInfo = {
    typeUrl: "/cosmwasm.wasm.v1.ContractInfo",
    aminoType: "wasm/ContractInfo",
    is(o: any): o is ContractInfo {
        return o && (o.$typeUrl === ContractInfo.typeUrl || typeof o.codeId === "bigint" && typeof o.creator === "string" && typeof o.admin === "string" && typeof o.label === "string" && typeof o.ibcPortId === "string");
    },
    isSDK(o: any): o is ContractInfoSDKType {
        return o && (o.$typeUrl === ContractInfo.typeUrl || typeof o.code_id === "bigint" && typeof o.creator === "string" && typeof o.admin === "string" && typeof o.label === "string" && typeof o.ibc_port_id === "string");
    },
    isAmino(o: any): o is ContractInfoAmino {
        return o && (o.$typeUrl === ContractInfo.typeUrl || typeof o.code_id === "bigint" && typeof o.creator === "string" && typeof o.admin === "string" && typeof o.label === "string" && typeof o.ibc_port_id === "string");
    },
    encode(message: ContractInfo, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        if (message.codeId !== BigInt(0)) {
            writer.uint32(8).uint64(message.codeId);
        }
        if (message.creator !== "") {
            writer.uint32(18).string(message.creator);
        }
        if (message.admin !== "") {
            writer.uint32(26).string(message.admin);
        }
        if (message.label !== "") {
            writer.uint32(34).string(message.label);
        }
        if (message.created !== undefined) {
            AbsoluteTxPosition.encode(message.created, writer.uint32(42).fork()).ldelim();
        }
        if (message.ibcPortId !== "") {
            writer.uint32(50).string(message.ibcPortId);
        }
        if (message.extension !== undefined) {
        }
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): ContractInfo {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseContractInfo();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.codeId = reader.uint64();
                    break;
                case 2:
                    message.creator = reader.string();
                    break;
                case 3:
                    message.admin = reader.string();
                    break;
                case 4:
                    message.label = reader.string();
                    break;
                case 5:
                    message.created = AbsoluteTxPosition.decode(reader, reader.uint32());
                    break;
                case 6:
                    message.ibcPortId = reader.string();
                    break;
                case 7:
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromPartial(object: Partial<ContractInfo>): ContractInfo {
        const message = createBaseContractInfo();
        message.codeId = object.codeId !== undefined && object.codeId !== null ? BigInt(object.codeId.toString()) : BigInt(0);
        message.creator = object.creator ?? "";
        message.admin = object.admin ?? "";
        message.label = object.label ?? "";
        message.created = object.created !== undefined && object.created !== null ? AbsoluteTxPosition.fromPartial(object.created) : undefined;
        message.ibcPortId = object.ibcPortId ?? "";
        return message;
    },
    fromAmino(object: ContractInfoAmino): ContractInfo {
        const message = createBaseContractInfo();
        if (object.code_id !== undefined && object.code_id !== null) {
            message.codeId = BigInt(object.code_id);
        }
        if (object.creator !== undefined && object.creator !== null) {
            message.creator = object.creator;
        }
        if (object.admin !== undefined && object.admin !== null) {
            message.admin = object.admin;
        }
        if (object.label !== undefined && object.label !== null) {
            message.label = object.label;
        }
        if (object.created !== undefined && object.created !== null) {
            message.created = AbsoluteTxPosition.fromAmino(object.created);
        }
        if (object.ibc_port_id !== undefined && object.ibc_port_id !== null) {
            message.ibcPortId = object.ibc_port_id;
        }
        if (object.extension !== undefined && object.extension !== null) {
        }
        return message;
    },
    toAmino(message: ContractInfo): ContractInfoAmino {
        const obj: any = {};
        obj.code_id = message.codeId !== BigInt(0) ? message.codeId.toString() : undefined;
        obj.creator = message.creator === "" ? undefined : message.creator;
        obj.admin = message.admin === "" ? undefined : message.admin;
        obj.label = message.label === "" ? undefined : message.label;
        obj.created = message.created ? AbsoluteTxPosition.toAmino(message.created) : undefined;
        obj.ibc_port_id = message.ibcPortId === "" ? undefined : message.ibcPortId;
        return obj;
    },
    fromAminoMsg(object: ContractInfoAminoMsg): ContractInfo {
        return ContractInfo.fromAmino(object.value);
    },
    toAminoMsg(message: ContractInfo): ContractInfoAminoMsg {
        return {
            type: "wasm/ContractInfo",
            value: ContractInfo.toAmino(message)
        };
    },
    fromProtoMsg(message: ContractInfoProtoMsg): ContractInfo {
        return ContractInfo.decode(message.value);
    },
    toProto(message: ContractInfo): Uint8Array {
        return ContractInfo.encode(message).finish();
    },
    toProtoMsg(message: ContractInfo): ContractInfoProtoMsg {
        return {
            typeUrl: "/cosmwasm.wasm.v1.ContractInfo",
            value: ContractInfo.encode(message).finish()
        };
    }
};
function createBaseContractCodeHistoryEntry(): ContractCodeHistoryEntry {
    return {
        operation: 0,
        codeId: BigInt(0),
        updated: undefined,
        msg: new Uint8Array()
    };
}
export const ContractCodeHistoryEntry = {
    typeUrl: "/cosmwasm.wasm.v1.ContractCodeHistoryEntry",
    aminoType: "wasm/ContractCodeHistoryEntry",
    is(o: any): o is ContractCodeHistoryEntry {
        return o && (o.$typeUrl === ContractCodeHistoryEntry.typeUrl || isSet(o.operation) && typeof o.codeId === "bigint" && (o.msg instanceof Uint8Array || typeof o.msg === "string"));
    },
    isSDK(o: any): o is ContractCodeHistoryEntrySDKType {
        return o && (o.$typeUrl === ContractCodeHistoryEntry.typeUrl || isSet(o.operation) && typeof o.code_id === "bigint" && (o.msg instanceof Uint8Array || typeof o.msg === "string"));
    },
    isAmino(o: any): o is ContractCodeHistoryEntryAmino {
        return o && (o.$typeUrl === ContractCodeHistoryEntry.typeUrl || isSet(o.operation) && typeof o.code_id === "bigint" && (o.msg instanceof Uint8Array || typeof o.msg === "string"));
    },
    encode(message: ContractCodeHistoryEntry, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        if (message.operation !== 0) {
            writer.uint32(8).int32(message.operation);
        }
        if (message.codeId !== BigInt(0)) {
            writer.uint32(16).uint64(message.codeId);
        }
        if (message.updated !== undefined) {
            AbsoluteTxPosition.encode(message.updated, writer.uint32(26).fork()).ldelim();
        }
        if (message.msg.length !== 0) {
            writer.uint32(34).bytes(message.msg);
        }
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): ContractCodeHistoryEntry {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseContractCodeHistoryEntry();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.operation = (reader.int32() as any);
                    break;
                case 2:
                    message.codeId = reader.uint64();
                    break;
                case 3:
                    message.updated = AbsoluteTxPosition.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.msg = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromPartial(object: Partial<ContractCodeHistoryEntry>): ContractCodeHistoryEntry {
        const message = createBaseContractCodeHistoryEntry();
        message.operation = object.operation ?? 0;
        message.codeId = object.codeId !== undefined && object.codeId !== null ? BigInt(object.codeId.toString()) : BigInt(0);
        message.updated = object.updated !== undefined && object.updated !== null ? AbsoluteTxPosition.fromPartial(object.updated) : undefined;
        message.msg = object.msg ?? new Uint8Array();
        return message;
    },
    fromAmino(object: ContractCodeHistoryEntryAmino): ContractCodeHistoryEntry {
        const message = createBaseContractCodeHistoryEntry();
        if (object.operation !== undefined && object.operation !== null) {
            message.operation = object.operation;
        }
        if (object.code_id !== undefined && object.code_id !== null) {
            message.codeId = BigInt(object.code_id);
        }
        if (object.updated !== undefined && object.updated !== null) {
            message.updated = AbsoluteTxPosition.fromAmino(object.updated);
        }
        if (object.msg !== undefined && object.msg !== null) {
            message.msg = toUtf8(JSON.stringify(object.msg));
        }
        return message;
    },
    toAmino(message: ContractCodeHistoryEntry): ContractCodeHistoryEntryAmino {
        const obj: any = {};
        obj.operation = message.operation === 0 ? undefined : message.operation;
        obj.code_id = message.codeId !== BigInt(0) ? message.codeId.toString() : undefined;
        obj.updated = message.updated ? AbsoluteTxPosition.toAmino(message.updated) : undefined;
        obj.msg = message.msg ? JSON.parse(fromUtf8(message.msg)) : undefined;
        return obj;
    },
    fromAminoMsg(object: ContractCodeHistoryEntryAminoMsg): ContractCodeHistoryEntry {
        return ContractCodeHistoryEntry.fromAmino(object.value);
    },
    toAminoMsg(message: ContractCodeHistoryEntry): ContractCodeHistoryEntryAminoMsg {
        return {
            type: "wasm/ContractCodeHistoryEntry",
            value: ContractCodeHistoryEntry.toAmino(message)
        };
    },
    fromProtoMsg(message: ContractCodeHistoryEntryProtoMsg): ContractCodeHistoryEntry {
        return ContractCodeHistoryEntry.decode(message.value);
    },
    toProto(message: ContractCodeHistoryEntry): Uint8Array {
        return ContractCodeHistoryEntry.encode(message).finish();
    },
    toProtoMsg(message: ContractCodeHistoryEntry): ContractCodeHistoryEntryProtoMsg {
        return {
            typeUrl: "/cosmwasm.wasm.v1.ContractCodeHistoryEntry",
            value: ContractCodeHistoryEntry.encode(message).finish()
        };
    }
};
function createBaseAbsoluteTxPosition(): AbsoluteTxPosition {
    return {
        blockHeight: BigInt(0),
        txIndex: BigInt(0)
    };
}
export const AbsoluteTxPosition = {
    typeUrl: "/cosmwasm.wasm.v1.AbsoluteTxPosition",
    aminoType: "wasm/AbsoluteTxPosition",
    is(o: any): o is AbsoluteTxPosition {
        return o && (o.$typeUrl === AbsoluteTxPosition.typeUrl || typeof o.blockHeight === "bigint" && typeof o.txIndex === "bigint");
    },
    isSDK(o: any): o is AbsoluteTxPositionSDKType {
        return o && (o.$typeUrl === AbsoluteTxPosition.typeUrl || typeof o.block_height === "bigint" && typeof o.tx_index === "bigint");
    },
    isAmino(o: any): o is AbsoluteTxPositionAmino {
        return o && (o.$typeUrl === AbsoluteTxPosition.typeUrl || typeof o.block_height === "bigint" && typeof o.tx_index === "bigint");
    },
    encode(message: AbsoluteTxPosition, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        if (message.blockHeight !== BigInt(0)) {
            writer.uint32(8).uint64(message.blockHeight);
        }
        if (message.txIndex !== BigInt(0)) {
            writer.uint32(16).uint64(message.txIndex);
        }
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): AbsoluteTxPosition {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseAbsoluteTxPosition();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.blockHeight = reader.uint64();
                    break;
                case 2:
                    message.txIndex = reader.uint64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromPartial(object: Partial<AbsoluteTxPosition>): AbsoluteTxPosition {
        const message = createBaseAbsoluteTxPosition();
        message.blockHeight = object.blockHeight !== undefined && object.blockHeight !== null ? BigInt(object.blockHeight.toString()) : BigInt(0);
        message.txIndex = object.txIndex !== undefined && object.txIndex !== null ? BigInt(object.txIndex.toString()) : BigInt(0);
        return message;
    },
    fromAmino(object: AbsoluteTxPositionAmino): AbsoluteTxPosition {
        const message = createBaseAbsoluteTxPosition();
        if (object.block_height !== undefined && object.block_height !== null) {
            message.blockHeight = BigInt(object.block_height);
        }
        if (object.tx_index !== undefined && object.tx_index !== null) {
            message.txIndex = BigInt(object.tx_index);
        }
        return message;
    },
    toAmino(message: AbsoluteTxPosition): AbsoluteTxPositionAmino {
        const obj: any = {};
        obj.block_height = message.blockHeight !== BigInt(0) ? message.blockHeight.toString() : undefined;
        obj.tx_index = message.txIndex !== BigInt(0) ? message.txIndex.toString() : undefined;
        return obj;
    },
    fromAminoMsg(object: AbsoluteTxPositionAminoMsg): AbsoluteTxPosition {
        return AbsoluteTxPosition.fromAmino(object.value);
    },
    toAminoMsg(message: AbsoluteTxPosition): AbsoluteTxPositionAminoMsg {
        return {
            type: "wasm/AbsoluteTxPosition",
            value: AbsoluteTxPosition.toAmino(message)
        };
    },
    fromProtoMsg(message: AbsoluteTxPositionProtoMsg): AbsoluteTxPosition {
        return AbsoluteTxPosition.decode(message.value);
    },
    toProto(message: AbsoluteTxPosition): Uint8Array {
        return AbsoluteTxPosition.encode(message).finish();
    },
    toProtoMsg(message: AbsoluteTxPosition): AbsoluteTxPositionProtoMsg {
        return {
            typeUrl: "/cosmwasm.wasm.v1.AbsoluteTxPosition",
            value: AbsoluteTxPosition.encode(message).finish()
        };
    }
};
function createBaseModel(): Model {
    return {
        key: new Uint8Array(),
        value: new Uint8Array()
    };
}
export const Model = {
    typeUrl: "/cosmwasm.wasm.v1.Model",
    aminoType: "wasm/Model",
    is(o: any): o is Model {
        return o && (o.$typeUrl === Model.typeUrl || (o.key instanceof Uint8Array || typeof o.key === "string") && (o.value instanceof Uint8Array || typeof o.value === "string"));
    },
    isSDK(o: any): o is ModelSDKType {
        return o && (o.$typeUrl === Model.typeUrl || (o.key instanceof Uint8Array || typeof o.key === "string") && (o.value instanceof Uint8Array || typeof o.value === "string"));
    },
    isAmino(o: any): o is ModelAmino {
        return o && (o.$typeUrl === Model.typeUrl || (o.key instanceof Uint8Array || typeof o.key === "string") && (o.value instanceof Uint8Array || typeof o.value === "string"));
    },
    encode(message: Model, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        if (message.key.length !== 0) {
            writer.uint32(10).bytes(message.key);
        }
        if (message.value.length !== 0) {
            writer.uint32(18).bytes(message.value);
        }
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): Model {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseModel();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.key = reader.bytes();
                    break;
                case 2:
                    message.value = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromPartial(object: Partial<Model>): Model {
        const message = createBaseModel();
        message.key = object.key ?? new Uint8Array();
        message.value = object.value ?? new Uint8Array();
        return message;
    },
    fromAmino(object: ModelAmino): Model {
        const message = createBaseModel();
        if (object.key !== undefined && object.key !== null) {
            message.key = bytesFromBase64(object.key);
        }
        if (object.value !== undefined && object.value !== null) {
            message.value = bytesFromBase64(object.value);
        }
        return message;
    },
    toAmino(message: Model): ModelAmino {
        const obj: any = {};
        obj.key = message.key ? base64FromBytes(message.key) : undefined;
        obj.value = message.value ? base64FromBytes(message.value) : undefined;
        return obj;
    },
    fromAminoMsg(object: ModelAminoMsg): Model {
        return Model.fromAmino(object.value);
    },
    toAminoMsg(message: Model): ModelAminoMsg {
        return {
            type: "wasm/Model",
            value: Model.toAmino(message)
        };
    },
    fromProtoMsg(message: ModelProtoMsg): Model {
        return Model.decode(message.value);
    },
    toProto(message: Model): Uint8Array {
        return Model.encode(message).finish();
    },
    toProtoMsg(message: Model): ModelProtoMsg {
        return {
            typeUrl: "/cosmwasm.wasm.v1.Model",
            value: Model.encode(message).finish()
        };
    }
};
