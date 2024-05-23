//@ts-nocheck
import { AccessConfig, AccessConfigAmino, AccessConfigSDKType, Params, ParamsAmino, ParamsSDKType } from "./types";
import { Coin, CoinAmino, CoinSDKType } from "../../../typesV2/cosmos/base/v1beta1/coin";
import { BinaryReader, BinaryWriter } from "../../../binary";
import { fromBase64, toBase64, toUtf8, fromUtf8 } from "@cosmjs/encoding";
import { bytesFromBase64, base64FromBytes } from "../../../helpers";
/** MsgStoreCode submit Wasm code to the system */
export interface MsgStoreCode {
    /** Sender is the actor that signed the messages */
    sender: string;
    /** WASMByteCode can be raw or gzip compressed */
    wasmByteCode: Uint8Array;
    /**
     * InstantiatePermission access control to apply on contract creation,
     * optional
     */
    instantiatePermission?: AccessConfig;
}
export interface MsgStoreCodeProtoMsg {
    typeUrl: "/cosmwasm.wasm.v1.MsgStoreCode";
    value: Uint8Array;
}
/** MsgStoreCode submit Wasm code to the system */
export interface MsgStoreCodeAmino {
    /** Sender is the actor that signed the messages */
    sender?: string;
    /** WASMByteCode can be raw or gzip compressed */
    wasm_byte_code?: string;
    /**
     * InstantiatePermission access control to apply on contract creation,
     * optional
     */
    instantiate_permission?: AccessConfigAmino;
}
export interface MsgStoreCodeAminoMsg {
    type: "wasm/MsgStoreCode";
    value: MsgStoreCodeAmino;
}
/** MsgStoreCode submit Wasm code to the system */
export interface MsgStoreCodeSDKType {
    sender: string;
    wasm_byte_code: Uint8Array;
    instantiate_permission?: AccessConfigSDKType;
}
/** MsgStoreCodeResponse returns store result data. */
export interface MsgStoreCodeResponse {
    /** CodeID is the reference to the stored WASM code */
    codeId: bigint;
    /** Checksum is the sha256 hash of the stored code */
    checksum: Uint8Array;
}
export interface MsgStoreCodeResponseProtoMsg {
    typeUrl: "/cosmwasm.wasm.v1.MsgStoreCodeResponse";
    value: Uint8Array;
}
/** MsgStoreCodeResponse returns store result data. */
export interface MsgStoreCodeResponseAmino {
    /** CodeID is the reference to the stored WASM code */
    code_id?: string;
    /** Checksum is the sha256 hash of the stored code */
    checksum?: string;
}
export interface MsgStoreCodeResponseAminoMsg {
    type: "wasm/MsgStoreCodeResponse";
    value: MsgStoreCodeResponseAmino;
}
/** MsgStoreCodeResponse returns store result data. */
export interface MsgStoreCodeResponseSDKType {
    code_id: bigint;
    checksum: Uint8Array;
}
/**
 * MsgInstantiateContract create a new smart contract instance for the given
 * code id.
 */
export interface MsgInstantiateContract {
    /** Sender is the that actor that signed the messages */
    sender: string;
    /** Admin is an optional address that can execute migrations */
    admin: string;
    /** CodeID is the reference to the stored WASM code */
    codeId: bigint;
    /** Label is optional metadata to be stored with a contract instance. */
    label: string;
    /** Msg json encoded message to be passed to the contract on instantiation */
    msg: Uint8Array;
    /** Funds coins that are transferred to the contract on instantiation */
    funds: Coin[];
}
export interface MsgInstantiateContractProtoMsg {
    typeUrl: "/cosmwasm.wasm.v1.MsgInstantiateContract";
    value: Uint8Array;
}
/**
 * MsgInstantiateContract create a new smart contract instance for the given
 * code id.
 */
export interface MsgInstantiateContractAmino {
    /** Sender is the that actor that signed the messages */
    sender?: string;
    /** Admin is an optional address that can execute migrations */
    admin?: string;
    /** CodeID is the reference to the stored WASM code */
    code_id?: string;
    /** Label is optional metadata to be stored with a contract instance. */
    label?: string;
    /** Msg json encoded message to be passed to the contract on instantiation */
    msg?: any;
    /** Funds coins that are transferred to the contract on instantiation */
    funds: CoinAmino[];
}
export interface MsgInstantiateContractAminoMsg {
    type: "wasm/MsgInstantiateContract";
    value: MsgInstantiateContractAmino;
}
/**
 * MsgInstantiateContract create a new smart contract instance for the given
 * code id.
 */
export interface MsgInstantiateContractSDKType {
    sender: string;
    admin: string;
    code_id: bigint;
    label: string;
    msg: Uint8Array;
    funds: CoinSDKType[];
}
/** MsgInstantiateContractResponse return instantiation result data */
export interface MsgInstantiateContractResponse {
    /** Address is the bech32 address of the new contract instance. */
    address: string;
    /** Data contains bytes to returned from the contract */
    data: Uint8Array;
}
export interface MsgInstantiateContractResponseProtoMsg {
    typeUrl: "/cosmwasm.wasm.v1.MsgInstantiateContractResponse";
    value: Uint8Array;
}
/** MsgInstantiateContractResponse return instantiation result data */
export interface MsgInstantiateContractResponseAmino {
    /** Address is the bech32 address of the new contract instance. */
    address?: string;
    /** Data contains bytes to returned from the contract */
    data?: string;
}
export interface MsgInstantiateContractResponseAminoMsg {
    type: "wasm/MsgInstantiateContractResponse";
    value: MsgInstantiateContractResponseAmino;
}
/** MsgInstantiateContractResponse return instantiation result data */
export interface MsgInstantiateContractResponseSDKType {
    address: string;
    data: Uint8Array;
}
/**
 * MsgInstantiateContract2 create a new smart contract instance for the given
 * code id with a predicable address.
 */
export interface MsgInstantiateContract2 {
    /** Sender is the that actor that signed the messages */
    sender: string;
    /** Admin is an optional address that can execute migrations */
    admin: string;
    /** CodeID is the reference to the stored WASM code */
    codeId: bigint;
    /** Label is optional metadata to be stored with a contract instance. */
    label: string;
    /** Msg json encoded message to be passed to the contract on instantiation */
    msg: Uint8Array;
    /** Funds coins that are transferred to the contract on instantiation */
    funds: Coin[];
    /** Salt is an arbitrary value provided by the sender. Size can be 1 to 64. */
    salt: Uint8Array;
    /**
     * FixMsg include the msg value into the hash for the predictable address.
     * Default is false
     */
    fixMsg: boolean;
}
export interface MsgInstantiateContract2ProtoMsg {
    typeUrl: "/cosmwasm.wasm.v1.MsgInstantiateContract2";
    value: Uint8Array;
}
/**
 * MsgInstantiateContract2 create a new smart contract instance for the given
 * code id with a predicable address.
 */
export interface MsgInstantiateContract2Amino {
    /** Sender is the that actor that signed the messages */
    sender?: string;
    /** Admin is an optional address that can execute migrations */
    admin?: string;
    /** CodeID is the reference to the stored WASM code */
    code_id?: string;
    /** Label is optional metadata to be stored with a contract instance. */
    label?: string;
    /** Msg json encoded message to be passed to the contract on instantiation */
    msg?: any;
    /** Funds coins that are transferred to the contract on instantiation */
    funds: CoinAmino[];
    /** Salt is an arbitrary value provided by the sender. Size can be 1 to 64. */
    salt?: string;
    /**
     * FixMsg include the msg value into the hash for the predictable address.
     * Default is false
     */
    fix_msg?: boolean;
}
export interface MsgInstantiateContract2AminoMsg {
    type: "wasm/MsgInstantiateContract2";
    value: MsgInstantiateContract2Amino;
}
/**
 * MsgInstantiateContract2 create a new smart contract instance for the given
 * code id with a predicable address.
 */
export interface MsgInstantiateContract2SDKType {
    sender: string;
    admin: string;
    code_id: bigint;
    label: string;
    msg: Uint8Array;
    funds: CoinSDKType[];
    salt: Uint8Array;
    fix_msg: boolean;
}
/** MsgInstantiateContract2Response return instantiation result data */
export interface MsgInstantiateContract2Response {
    /** Address is the bech32 address of the new contract instance. */
    address: string;
    /** Data contains bytes to returned from the contract */
    data: Uint8Array;
}
export interface MsgInstantiateContract2ResponseProtoMsg {
    typeUrl: "/cosmwasm.wasm.v1.MsgInstantiateContract2Response";
    value: Uint8Array;
}
/** MsgInstantiateContract2Response return instantiation result data */
export interface MsgInstantiateContract2ResponseAmino {
    /** Address is the bech32 address of the new contract instance. */
    address?: string;
    /** Data contains bytes to returned from the contract */
    data?: string;
}
export interface MsgInstantiateContract2ResponseAminoMsg {
    type: "wasm/MsgInstantiateContract2Response";
    value: MsgInstantiateContract2ResponseAmino;
}
/** MsgInstantiateContract2Response return instantiation result data */
export interface MsgInstantiateContract2ResponseSDKType {
    address: string;
    data: Uint8Array;
}
/** MsgExecuteContract submits the given message data to a smart contract */
export interface MsgExecuteContract {
    /** Sender is the that actor that signed the messages */
    sender: string;
    /** Contract is the address of the smart contract */
    contract: string;
    /** Msg json encoded message to be passed to the contract */
    msg: Uint8Array;
    /** Funds coins that are transferred to the contract on execution */
    funds: Coin[];
}
export interface MsgExecuteContractProtoMsg {
    typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract";
    value: Uint8Array;
}
/** MsgExecuteContract submits the given message data to a smart contract */
export interface MsgExecuteContractAmino {
    /** Sender is the that actor that signed the messages */
    sender?: string;
    /** Contract is the address of the smart contract */
    contract?: string;
    /** Msg json encoded message to be passed to the contract */
    msg?: any;
    /** Funds coins that are transferred to the contract on execution */
    funds: CoinAmino[];
}
export interface MsgExecuteContractAminoMsg {
    type: "wasm/MsgExecuteContract";
    value: MsgExecuteContractAmino;
}
/** MsgExecuteContract submits the given message data to a smart contract */
export interface MsgExecuteContractSDKType {
    sender: string;
    contract: string;
    msg: Uint8Array;
    funds: CoinSDKType[];
}
/** MsgExecuteContractResponse returns execution result data. */
export interface MsgExecuteContractResponse {
    /** Data contains bytes to returned from the contract */
    data: Uint8Array;
}
export interface MsgExecuteContractResponseProtoMsg {
    typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContractResponse";
    value: Uint8Array;
}
/** MsgExecuteContractResponse returns execution result data. */
export interface MsgExecuteContractResponseAmino {
    /** Data contains bytes to returned from the contract */
    data?: string;
}
export interface MsgExecuteContractResponseAminoMsg {
    type: "wasm/MsgExecuteContractResponse";
    value: MsgExecuteContractResponseAmino;
}
/** MsgExecuteContractResponse returns execution result data. */
export interface MsgExecuteContractResponseSDKType {
    data: Uint8Array;
}
/** MsgMigrateContract runs a code upgrade/ downgrade for a smart contract */
export interface MsgMigrateContract {
    /** Sender is the that actor that signed the messages */
    sender: string;
    /** Contract is the address of the smart contract */
    contract: string;
    /** CodeID references the new WASM code */
    codeId: bigint;
    /** Msg json encoded message to be passed to the contract on migration */
    msg: Uint8Array;
}
export interface MsgMigrateContractProtoMsg {
    typeUrl: "/cosmwasm.wasm.v1.MsgMigrateContract";
    value: Uint8Array;
}
/** MsgMigrateContract runs a code upgrade/ downgrade for a smart contract */
export interface MsgMigrateContractAmino {
    /** Sender is the that actor that signed the messages */
    sender?: string;
    /** Contract is the address of the smart contract */
    contract?: string;
    /** CodeID references the new WASM code */
    code_id?: string;
    /** Msg json encoded message to be passed to the contract on migration */
    msg?: any;
}
export interface MsgMigrateContractAminoMsg {
    type: "wasm/MsgMigrateContract";
    value: MsgMigrateContractAmino;
}
/** MsgMigrateContract runs a code upgrade/ downgrade for a smart contract */
export interface MsgMigrateContractSDKType {
    sender: string;
    contract: string;
    code_id: bigint;
    msg: Uint8Array;
}
/** MsgMigrateContractResponse returns contract migration result data. */
export interface MsgMigrateContractResponse {
    /**
     * Data contains same raw bytes returned as data from the wasm contract.
     * (May be empty)
     */
    data: Uint8Array;
}
export interface MsgMigrateContractResponseProtoMsg {
    typeUrl: "/cosmwasm.wasm.v1.MsgMigrateContractResponse";
    value: Uint8Array;
}
/** MsgMigrateContractResponse returns contract migration result data. */
export interface MsgMigrateContractResponseAmino {
    /**
     * Data contains same raw bytes returned as data from the wasm contract.
     * (May be empty)
     */
    data?: string;
}
export interface MsgMigrateContractResponseAminoMsg {
    type: "wasm/MsgMigrateContractResponse";
    value: MsgMigrateContractResponseAmino;
}
/** MsgMigrateContractResponse returns contract migration result data. */
export interface MsgMigrateContractResponseSDKType {
    data: Uint8Array;
}
/** MsgUpdateAdmin sets a new admin for a smart contract */
export interface MsgUpdateAdmin {
    /** Sender is the that actor that signed the messages */
    sender: string;
    /** NewAdmin address to be set */
    newAdmin: string;
    /** Contract is the address of the smart contract */
    contract: string;
}
export interface MsgUpdateAdminProtoMsg {
    typeUrl: "/cosmwasm.wasm.v1.MsgUpdateAdmin";
    value: Uint8Array;
}
/** MsgUpdateAdmin sets a new admin for a smart contract */
export interface MsgUpdateAdminAmino {
    /** Sender is the that actor that signed the messages */
    sender?: string;
    /** NewAdmin address to be set */
    new_admin?: string;
    /** Contract is the address of the smart contract */
    contract?: string;
}
export interface MsgUpdateAdminAminoMsg {
    type: "wasm/MsgUpdateAdmin";
    value: MsgUpdateAdminAmino;
}
/** MsgUpdateAdmin sets a new admin for a smart contract */
export interface MsgUpdateAdminSDKType {
    sender: string;
    new_admin: string;
    contract: string;
}
/** MsgUpdateAdminResponse returns empty data */
export interface MsgUpdateAdminResponse {}
export interface MsgUpdateAdminResponseProtoMsg {
    typeUrl: "/cosmwasm.wasm.v1.MsgUpdateAdminResponse";
    value: Uint8Array;
}
/** MsgUpdateAdminResponse returns empty data */
export interface MsgUpdateAdminResponseAmino {}
export interface MsgUpdateAdminResponseAminoMsg {
    type: "wasm/MsgUpdateAdminResponse";
    value: MsgUpdateAdminResponseAmino;
}
/** MsgUpdateAdminResponse returns empty data */
export interface MsgUpdateAdminResponseSDKType {}
/** MsgClearAdmin removes any admin stored for a smart contract */
export interface MsgClearAdmin {
    /** Sender is the actor that signed the messages */
    sender: string;
    /** Contract is the address of the smart contract */
    contract: string;
}
export interface MsgClearAdminProtoMsg {
    typeUrl: "/cosmwasm.wasm.v1.MsgClearAdmin";
    value: Uint8Array;
}
/** MsgClearAdmin removes any admin stored for a smart contract */
export interface MsgClearAdminAmino {
    /** Sender is the actor that signed the messages */
    sender?: string;
    /** Contract is the address of the smart contract */
    contract?: string;
}
export interface MsgClearAdminAminoMsg {
    type: "wasm/MsgClearAdmin";
    value: MsgClearAdminAmino;
}
/** MsgClearAdmin removes any admin stored for a smart contract */
export interface MsgClearAdminSDKType {
    sender: string;
    contract: string;
}
/** MsgClearAdminResponse returns empty data */
export interface MsgClearAdminResponse {}
export interface MsgClearAdminResponseProtoMsg {
    typeUrl: "/cosmwasm.wasm.v1.MsgClearAdminResponse";
    value: Uint8Array;
}
/** MsgClearAdminResponse returns empty data */
export interface MsgClearAdminResponseAmino {}
export interface MsgClearAdminResponseAminoMsg {
    type: "wasm/MsgClearAdminResponse";
    value: MsgClearAdminResponseAmino;
}
/** MsgClearAdminResponse returns empty data */
export interface MsgClearAdminResponseSDKType {}
/** MsgUpdateInstantiateConfig updates instantiate config for a smart contract */
export interface MsgUpdateInstantiateConfig {
    /** Sender is the that actor that signed the messages */
    sender: string;
    /** CodeID references the stored WASM code */
    codeId: bigint;
    /** NewInstantiatePermission is the new access control */
    newInstantiatePermission?: AccessConfig;
}
export interface MsgUpdateInstantiateConfigProtoMsg {
    typeUrl: "/cosmwasm.wasm.v1.MsgUpdateInstantiateConfig";
    value: Uint8Array;
}
/** MsgUpdateInstantiateConfig updates instantiate config for a smart contract */
export interface MsgUpdateInstantiateConfigAmino {
    /** Sender is the that actor that signed the messages */
    sender?: string;
    /** CodeID references the stored WASM code */
    code_id?: string;
    /** NewInstantiatePermission is the new access control */
    new_instantiate_permission?: AccessConfigAmino;
}
export interface MsgUpdateInstantiateConfigAminoMsg {
    type: "wasm/MsgUpdateInstantiateConfig";
    value: MsgUpdateInstantiateConfigAmino;
}
/** MsgUpdateInstantiateConfig updates instantiate config for a smart contract */
export interface MsgUpdateInstantiateConfigSDKType {
    sender: string;
    code_id: bigint;
    new_instantiate_permission?: AccessConfigSDKType;
}
/** MsgUpdateInstantiateConfigResponse returns empty data */
export interface MsgUpdateInstantiateConfigResponse {}
export interface MsgUpdateInstantiateConfigResponseProtoMsg {
    typeUrl: "/cosmwasm.wasm.v1.MsgUpdateInstantiateConfigResponse";
    value: Uint8Array;
}
/** MsgUpdateInstantiateConfigResponse returns empty data */
export interface MsgUpdateInstantiateConfigResponseAmino {}
export interface MsgUpdateInstantiateConfigResponseAminoMsg {
    type: "wasm/MsgUpdateInstantiateConfigResponse";
    value: MsgUpdateInstantiateConfigResponseAmino;
}
/** MsgUpdateInstantiateConfigResponse returns empty data */
export interface MsgUpdateInstantiateConfigResponseSDKType {}
/**
 * MsgUpdateParams is the MsgUpdateParams request type.
 *
 * Since: 0.40
 */
export interface MsgUpdateParams {
    /** Authority is the address of the governance account. */
    authority: string;
    /**
     * params defines the x/wasm parameters to update.
     *
     * NOTE: All parameters must be supplied.
     */
    params: Params;
}
export interface MsgUpdateParamsProtoMsg {
    typeUrl: "/cosmwasm.wasm.v1.MsgUpdateParams";
    value: Uint8Array;
}
/**
 * MsgUpdateParams is the MsgUpdateParams request type.
 *
 * Since: 0.40
 */
export interface MsgUpdateParamsAmino {
    /** Authority is the address of the governance account. */
    authority?: string;
    /**
     * params defines the x/wasm parameters to update.
     *
     * NOTE: All parameters must be supplied.
     */
    params: ParamsAmino;
}
export interface MsgUpdateParamsAminoMsg {
    type: "wasm/MsgUpdateParams";
    value: MsgUpdateParamsAmino;
}
/**
 * MsgUpdateParams is the MsgUpdateParams request type.
 *
 * Since: 0.40
 */
export interface MsgUpdateParamsSDKType {
    authority: string;
    params: ParamsSDKType;
}
/**
 * MsgUpdateParamsResponse defines the response structure for executing a
 * MsgUpdateParams message.
 *
 * Since: 0.40
 */
export interface MsgUpdateParamsResponse {}
export interface MsgUpdateParamsResponseProtoMsg {
    typeUrl: "/cosmwasm.wasm.v1.MsgUpdateParamsResponse";
    value: Uint8Array;
}
/**
 * MsgUpdateParamsResponse defines the response structure for executing a
 * MsgUpdateParams message.
 *
 * Since: 0.40
 */
export interface MsgUpdateParamsResponseAmino {}
export interface MsgUpdateParamsResponseAminoMsg {
    type: "wasm/MsgUpdateParamsResponse";
    value: MsgUpdateParamsResponseAmino;
}
/**
 * MsgUpdateParamsResponse defines the response structure for executing a
 * MsgUpdateParams message.
 *
 * Since: 0.40
 */
export interface MsgUpdateParamsResponseSDKType {}
/**
 * MsgSudoContract is the MsgSudoContract request type.
 *
 * Since: 0.40
 */
export interface MsgSudoContract {
    /** Authority is the address of the governance account. */
    authority: string;
    /** Contract is the address of the smart contract */
    contract: string;
    /** Msg json encoded message to be passed to the contract as sudo */
    msg: Uint8Array;
}
export interface MsgSudoContractProtoMsg {
    typeUrl: "/cosmwasm.wasm.v1.MsgSudoContract";
    value: Uint8Array;
}
/**
 * MsgSudoContract is the MsgSudoContract request type.
 *
 * Since: 0.40
 */
export interface MsgSudoContractAmino {
    /** Authority is the address of the governance account. */
    authority?: string;
    /** Contract is the address of the smart contract */
    contract?: string;
    /** Msg json encoded message to be passed to the contract as sudo */
    msg?: any;
}
export interface MsgSudoContractAminoMsg {
    type: "wasm/MsgSudoContract";
    value: MsgSudoContractAmino;
}
/**
 * MsgSudoContract is the MsgSudoContract request type.
 *
 * Since: 0.40
 */
export interface MsgSudoContractSDKType {
    authority: string;
    contract: string;
    msg: Uint8Array;
}
/**
 * MsgSudoContractResponse defines the response structure for executing a
 * MsgSudoContract message.
 *
 * Since: 0.40
 */
export interface MsgSudoContractResponse {
    /** Data contains bytes to returned from the contract */
    data: Uint8Array;
}
export interface MsgSudoContractResponseProtoMsg {
    typeUrl: "/cosmwasm.wasm.v1.MsgSudoContractResponse";
    value: Uint8Array;
}
/**
 * MsgSudoContractResponse defines the response structure for executing a
 * MsgSudoContract message.
 *
 * Since: 0.40
 */
export interface MsgSudoContractResponseAmino {
    /** Data contains bytes to returned from the contract */
    data?: string;
}
export interface MsgSudoContractResponseAminoMsg {
    type: "wasm/MsgSudoContractResponse";
    value: MsgSudoContractResponseAmino;
}
/**
 * MsgSudoContractResponse defines the response structure for executing a
 * MsgSudoContract message.
 *
 * Since: 0.40
 */
export interface MsgSudoContractResponseSDKType {
    data: Uint8Array;
}
/**
 * MsgPinCodes is the MsgPinCodes request type.
 *
 * Since: 0.40
 */
export interface MsgPinCodes {
    /** Authority is the address of the governance account. */
    authority: string;
    /** CodeIDs references the new WASM codes */
    codeIds: bigint[];
}
export interface MsgPinCodesProtoMsg {
    typeUrl: "/cosmwasm.wasm.v1.MsgPinCodes";
    value: Uint8Array;
}
/**
 * MsgPinCodes is the MsgPinCodes request type.
 *
 * Since: 0.40
 */
export interface MsgPinCodesAmino {
    /** Authority is the address of the governance account. */
    authority?: string;
    /** CodeIDs references the new WASM codes */
    code_ids?: string[];
}
export interface MsgPinCodesAminoMsg {
    type: "wasm/MsgPinCodes";
    value: MsgPinCodesAmino;
}
/**
 * MsgPinCodes is the MsgPinCodes request type.
 *
 * Since: 0.40
 */
export interface MsgPinCodesSDKType {
    authority: string;
    code_ids: bigint[];
}
/**
 * MsgPinCodesResponse defines the response structure for executing a
 * MsgPinCodes message.
 *
 * Since: 0.40
 */
export interface MsgPinCodesResponse {}
export interface MsgPinCodesResponseProtoMsg {
    typeUrl: "/cosmwasm.wasm.v1.MsgPinCodesResponse";
    value: Uint8Array;
}
/**
 * MsgPinCodesResponse defines the response structure for executing a
 * MsgPinCodes message.
 *
 * Since: 0.40
 */
export interface MsgPinCodesResponseAmino {}
export interface MsgPinCodesResponseAminoMsg {
    type: "wasm/MsgPinCodesResponse";
    value: MsgPinCodesResponseAmino;
}
/**
 * MsgPinCodesResponse defines the response structure for executing a
 * MsgPinCodes message.
 *
 * Since: 0.40
 */
export interface MsgPinCodesResponseSDKType {}
/**
 * MsgUnpinCodes is the MsgUnpinCodes request type.
 *
 * Since: 0.40
 */
export interface MsgUnpinCodes {
    /** Authority is the address of the governance account. */
    authority: string;
    /** CodeIDs references the WASM codes */
    codeIds: bigint[];
}
export interface MsgUnpinCodesProtoMsg {
    typeUrl: "/cosmwasm.wasm.v1.MsgUnpinCodes";
    value: Uint8Array;
}
/**
 * MsgUnpinCodes is the MsgUnpinCodes request type.
 *
 * Since: 0.40
 */
export interface MsgUnpinCodesAmino {
    /** Authority is the address of the governance account. */
    authority?: string;
    /** CodeIDs references the WASM codes */
    code_ids?: string[];
}
export interface MsgUnpinCodesAminoMsg {
    type: "wasm/MsgUnpinCodes";
    value: MsgUnpinCodesAmino;
}
/**
 * MsgUnpinCodes is the MsgUnpinCodes request type.
 *
 * Since: 0.40
 */
export interface MsgUnpinCodesSDKType {
    authority: string;
    code_ids: bigint[];
}
/**
 * MsgUnpinCodesResponse defines the response structure for executing a
 * MsgUnpinCodes message.
 *
 * Since: 0.40
 */
export interface MsgUnpinCodesResponse {}
export interface MsgUnpinCodesResponseProtoMsg {
    typeUrl: "/cosmwasm.wasm.v1.MsgUnpinCodesResponse";
    value: Uint8Array;
}
/**
 * MsgUnpinCodesResponse defines the response structure for executing a
 * MsgUnpinCodes message.
 *
 * Since: 0.40
 */
export interface MsgUnpinCodesResponseAmino {}
export interface MsgUnpinCodesResponseAminoMsg {
    type: "wasm/MsgUnpinCodesResponse";
    value: MsgUnpinCodesResponseAmino;
}
/**
 * MsgUnpinCodesResponse defines the response structure for executing a
 * MsgUnpinCodes message.
 *
 * Since: 0.40
 */
export interface MsgUnpinCodesResponseSDKType {}
/**
 * MsgStoreAndInstantiateContract is the MsgStoreAndInstantiateContract
 * request type.
 *
 * Since: 0.40
 */
export interface MsgStoreAndInstantiateContract {
    /** Authority is the address of the governance account. */
    authority: string;
    /** WASMByteCode can be raw or gzip compressed */
    wasmByteCode: Uint8Array;
    /** InstantiatePermission to apply on contract creation, optional */
    instantiatePermission?: AccessConfig;
    /**
     * UnpinCode code on upload, optional. As default the uploaded contract is
     * pinned to cache.
     */
    unpinCode: boolean;
    /** Admin is an optional address that can execute migrations */
    admin: string;
    /** Label is optional metadata to be stored with a constract instance. */
    label: string;
    /** Msg json encoded message to be passed to the contract on instantiation */
    msg: Uint8Array;
    /**
     * Funds coins that are transferred from the authority account to the contract
     * on instantiation
     */
    funds: Coin[];
    /** Source is the URL where the code is hosted */
    source: string;
    /**
     * Builder is the docker image used to build the code deterministically, used
     * for smart contract verification
     */
    builder: string;
    /**
     * CodeHash is the SHA256 sum of the code outputted by builder, used for smart
     * contract verification
     */
    codeHash: Uint8Array;
}
export interface MsgStoreAndInstantiateContractProtoMsg {
    typeUrl: "/cosmwasm.wasm.v1.MsgStoreAndInstantiateContract";
    value: Uint8Array;
}
/**
 * MsgStoreAndInstantiateContract is the MsgStoreAndInstantiateContract
 * request type.
 *
 * Since: 0.40
 */
export interface MsgStoreAndInstantiateContractAmino {
    /** Authority is the address of the governance account. */
    authority?: string;
    /** WASMByteCode can be raw or gzip compressed */
    wasm_byte_code?: string;
    /** InstantiatePermission to apply on contract creation, optional */
    instantiate_permission?: AccessConfigAmino;
    /**
     * UnpinCode code on upload, optional. As default the uploaded contract is
     * pinned to cache.
     */
    unpin_code?: boolean;
    /** Admin is an optional address that can execute migrations */
    admin?: string;
    /** Label is optional metadata to be stored with a constract instance. */
    label?: string;
    /** Msg json encoded message to be passed to the contract on instantiation */
    msg?: any;
    /**
     * Funds coins that are transferred from the authority account to the contract
     * on instantiation
     */
    funds: CoinAmino[];
    /** Source is the URL where the code is hosted */
    source?: string;
    /**
     * Builder is the docker image used to build the code deterministically, used
     * for smart contract verification
     */
    builder?: string;
    /**
     * CodeHash is the SHA256 sum of the code outputted by builder, used for smart
     * contract verification
     */
    code_hash?: string;
}
export interface MsgStoreAndInstantiateContractAminoMsg {
    type: "wasm/MsgStoreAndInstantiateContract";
    value: MsgStoreAndInstantiateContractAmino;
}
/**
 * MsgStoreAndInstantiateContract is the MsgStoreAndInstantiateContract
 * request type.
 *
 * Since: 0.40
 */
export interface MsgStoreAndInstantiateContractSDKType {
    authority: string;
    wasm_byte_code: Uint8Array;
    instantiate_permission?: AccessConfigSDKType;
    unpin_code: boolean;
    admin: string;
    label: string;
    msg: Uint8Array;
    funds: CoinSDKType[];
    source: string;
    builder: string;
    code_hash: Uint8Array;
}
/**
 * MsgStoreAndInstantiateContractResponse defines the response structure
 * for executing a MsgStoreAndInstantiateContract message.
 *
 * Since: 0.40
 */
export interface MsgStoreAndInstantiateContractResponse {
    /** Address is the bech32 address of the new contract instance. */
    address: string;
    /** Data contains bytes to returned from the contract */
    data: Uint8Array;
}
export interface MsgStoreAndInstantiateContractResponseProtoMsg {
    typeUrl: "/cosmwasm.wasm.v1.MsgStoreAndInstantiateContractResponse";
    value: Uint8Array;
}
/**
 * MsgStoreAndInstantiateContractResponse defines the response structure
 * for executing a MsgStoreAndInstantiateContract message.
 *
 * Since: 0.40
 */
export interface MsgStoreAndInstantiateContractResponseAmino {
    /** Address is the bech32 address of the new contract instance. */
    address?: string;
    /** Data contains bytes to returned from the contract */
    data?: string;
}
export interface MsgStoreAndInstantiateContractResponseAminoMsg {
    type: "wasm/MsgStoreAndInstantiateContractResponse";
    value: MsgStoreAndInstantiateContractResponseAmino;
}
/**
 * MsgStoreAndInstantiateContractResponse defines the response structure
 * for executing a MsgStoreAndInstantiateContract message.
 *
 * Since: 0.40
 */
export interface MsgStoreAndInstantiateContractResponseSDKType {
    address: string;
    data: Uint8Array;
}
/**
 * MsgAddCodeUploadParamsAddresses is the
 * MsgAddCodeUploadParamsAddresses request type.
 */
export interface MsgAddCodeUploadParamsAddresses {
    /** Authority is the address of the governance account. */
    authority: string;
    addresses: string[];
}
export interface MsgAddCodeUploadParamsAddressesProtoMsg {
    typeUrl: "/cosmwasm.wasm.v1.MsgAddCodeUploadParamsAddresses";
    value: Uint8Array;
}
/**
 * MsgAddCodeUploadParamsAddresses is the
 * MsgAddCodeUploadParamsAddresses request type.
 */
export interface MsgAddCodeUploadParamsAddressesAmino {
    /** Authority is the address of the governance account. */
    authority?: string;
    addresses?: string[];
}
export interface MsgAddCodeUploadParamsAddressesAminoMsg {
    type: "wasm/MsgAddCodeUploadParamsAddresses";
    value: MsgAddCodeUploadParamsAddressesAmino;
}
/**
 * MsgAddCodeUploadParamsAddresses is the
 * MsgAddCodeUploadParamsAddresses request type.
 */
export interface MsgAddCodeUploadParamsAddressesSDKType {
    authority: string;
    addresses: string[];
}
/**
 * MsgAddCodeUploadParamsAddressesResponse defines the response
 * structure for executing a MsgAddCodeUploadParamsAddresses message.
 */
export interface MsgAddCodeUploadParamsAddressesResponse {}
export interface MsgAddCodeUploadParamsAddressesResponseProtoMsg {
    typeUrl: "/cosmwasm.wasm.v1.MsgAddCodeUploadParamsAddressesResponse";
    value: Uint8Array;
}
/**
 * MsgAddCodeUploadParamsAddressesResponse defines the response
 * structure for executing a MsgAddCodeUploadParamsAddresses message.
 */
export interface MsgAddCodeUploadParamsAddressesResponseAmino {}
export interface MsgAddCodeUploadParamsAddressesResponseAminoMsg {
    type: "wasm/MsgAddCodeUploadParamsAddressesResponse";
    value: MsgAddCodeUploadParamsAddressesResponseAmino;
}
/**
 * MsgAddCodeUploadParamsAddressesResponse defines the response
 * structure for executing a MsgAddCodeUploadParamsAddresses message.
 */
export interface MsgAddCodeUploadParamsAddressesResponseSDKType {}
/**
 * MsgRemoveCodeUploadParamsAddresses is the
 * MsgRemoveCodeUploadParamsAddresses request type.
 */
export interface MsgRemoveCodeUploadParamsAddresses {
    /** Authority is the address of the governance account. */
    authority: string;
    addresses: string[];
}
export interface MsgRemoveCodeUploadParamsAddressesProtoMsg {
    typeUrl: "/cosmwasm.wasm.v1.MsgRemoveCodeUploadParamsAddresses";
    value: Uint8Array;
}
/**
 * MsgRemoveCodeUploadParamsAddresses is the
 * MsgRemoveCodeUploadParamsAddresses request type.
 */
export interface MsgRemoveCodeUploadParamsAddressesAmino {
    /** Authority is the address of the governance account. */
    authority?: string;
    addresses?: string[];
}
export interface MsgRemoveCodeUploadParamsAddressesAminoMsg {
    type: "wasm/MsgRemoveCodeUploadParamsAddresses";
    value: MsgRemoveCodeUploadParamsAddressesAmino;
}
/**
 * MsgRemoveCodeUploadParamsAddresses is the
 * MsgRemoveCodeUploadParamsAddresses request type.
 */
export interface MsgRemoveCodeUploadParamsAddressesSDKType {
    authority: string;
    addresses: string[];
}
/**
 * MsgRemoveCodeUploadParamsAddressesResponse defines the response
 * structure for executing a MsgRemoveCodeUploadParamsAddresses message.
 */
export interface MsgRemoveCodeUploadParamsAddressesResponse {}
export interface MsgRemoveCodeUploadParamsAddressesResponseProtoMsg {
    typeUrl: "/cosmwasm.wasm.v1.MsgRemoveCodeUploadParamsAddressesResponse";
    value: Uint8Array;
}
/**
 * MsgRemoveCodeUploadParamsAddressesResponse defines the response
 * structure for executing a MsgRemoveCodeUploadParamsAddresses message.
 */
export interface MsgRemoveCodeUploadParamsAddressesResponseAmino {}
export interface MsgRemoveCodeUploadParamsAddressesResponseAminoMsg {
    type: "wasm/MsgRemoveCodeUploadParamsAddressesResponse";
    value: MsgRemoveCodeUploadParamsAddressesResponseAmino;
}
/**
 * MsgRemoveCodeUploadParamsAddressesResponse defines the response
 * structure for executing a MsgRemoveCodeUploadParamsAddresses message.
 */
export interface MsgRemoveCodeUploadParamsAddressesResponseSDKType {}
/**
 * MsgStoreAndMigrateContract is the MsgStoreAndMigrateContract
 * request type.
 *
 * Since: 0.42
 */
export interface MsgStoreAndMigrateContract {
    /** Authority is the address of the governance account. */
    authority: string;
    /** WASMByteCode can be raw or gzip compressed */
    wasmByteCode: Uint8Array;
    /** InstantiatePermission to apply on contract creation, optional */
    instantiatePermission?: AccessConfig;
    /** Contract is the address of the smart contract */
    contract: string;
    /** Msg json encoded message to be passed to the contract on migration */
    msg: Uint8Array;
}
export interface MsgStoreAndMigrateContractProtoMsg {
    typeUrl: "/cosmwasm.wasm.v1.MsgStoreAndMigrateContract";
    value: Uint8Array;
}
/**
 * MsgStoreAndMigrateContract is the MsgStoreAndMigrateContract
 * request type.
 *
 * Since: 0.42
 */
export interface MsgStoreAndMigrateContractAmino {
    /** Authority is the address of the governance account. */
    authority?: string;
    /** WASMByteCode can be raw or gzip compressed */
    wasm_byte_code?: string;
    /** InstantiatePermission to apply on contract creation, optional */
    instantiate_permission?: AccessConfigAmino;
    /** Contract is the address of the smart contract */
    contract?: string;
    /** Msg json encoded message to be passed to the contract on migration */
    msg?: any;
}
export interface MsgStoreAndMigrateContractAminoMsg {
    type: "wasm/MsgStoreAndMigrateContract";
    value: MsgStoreAndMigrateContractAmino;
}
/**
 * MsgStoreAndMigrateContract is the MsgStoreAndMigrateContract
 * request type.
 *
 * Since: 0.42
 */
export interface MsgStoreAndMigrateContractSDKType {
    authority: string;
    wasm_byte_code: Uint8Array;
    instantiate_permission?: AccessConfigSDKType;
    contract: string;
    msg: Uint8Array;
}
/**
 * MsgStoreAndMigrateContractResponse defines the response structure
 * for executing a MsgStoreAndMigrateContract message.
 *
 * Since: 0.42
 */
export interface MsgStoreAndMigrateContractResponse {
    /** CodeID is the reference to the stored WASM code */
    codeId: bigint;
    /** Checksum is the sha256 hash of the stored code */
    checksum: Uint8Array;
    /** Data contains bytes to returned from the contract */
    data: Uint8Array;
}
export interface MsgStoreAndMigrateContractResponseProtoMsg {
    typeUrl: "/cosmwasm.wasm.v1.MsgStoreAndMigrateContractResponse";
    value: Uint8Array;
}
/**
 * MsgStoreAndMigrateContractResponse defines the response structure
 * for executing a MsgStoreAndMigrateContract message.
 *
 * Since: 0.42
 */
export interface MsgStoreAndMigrateContractResponseAmino {
    /** CodeID is the reference to the stored WASM code */
    code_id?: string;
    /** Checksum is the sha256 hash of the stored code */
    checksum?: string;
    /** Data contains bytes to returned from the contract */
    data?: string;
}
export interface MsgStoreAndMigrateContractResponseAminoMsg {
    type: "wasm/MsgStoreAndMigrateContractResponse";
    value: MsgStoreAndMigrateContractResponseAmino;
}
/**
 * MsgStoreAndMigrateContractResponse defines the response structure
 * for executing a MsgStoreAndMigrateContract message.
 *
 * Since: 0.42
 */
export interface MsgStoreAndMigrateContractResponseSDKType {
    code_id: bigint;
    checksum: Uint8Array;
    data: Uint8Array;
}
/** MsgUpdateContractLabel sets a new label for a smart contract */
export interface MsgUpdateContractLabel {
    /** Sender is the that actor that signed the messages */
    sender: string;
    /** NewLabel string to be set */
    newLabel: string;
    /** Contract is the address of the smart contract */
    contract: string;
}
export interface MsgUpdateContractLabelProtoMsg {
    typeUrl: "/cosmwasm.wasm.v1.MsgUpdateContractLabel";
    value: Uint8Array;
}
/** MsgUpdateContractLabel sets a new label for a smart contract */
export interface MsgUpdateContractLabelAmino {
    /** Sender is the that actor that signed the messages */
    sender?: string;
    /** NewLabel string to be set */
    new_label?: string;
    /** Contract is the address of the smart contract */
    contract?: string;
}
export interface MsgUpdateContractLabelAminoMsg {
    type: "wasm/MsgUpdateContractLabel";
    value: MsgUpdateContractLabelAmino;
}
/** MsgUpdateContractLabel sets a new label for a smart contract */
export interface MsgUpdateContractLabelSDKType {
    sender: string;
    new_label: string;
    contract: string;
}
/** MsgUpdateContractLabelResponse returns empty data */
export interface MsgUpdateContractLabelResponse {}
export interface MsgUpdateContractLabelResponseProtoMsg {
    typeUrl: "/cosmwasm.wasm.v1.MsgUpdateContractLabelResponse";
    value: Uint8Array;
}
/** MsgUpdateContractLabelResponse returns empty data */
export interface MsgUpdateContractLabelResponseAmino {}
export interface MsgUpdateContractLabelResponseAminoMsg {
    type: "wasm/MsgUpdateContractLabelResponse";
    value: MsgUpdateContractLabelResponseAmino;
}
/** MsgUpdateContractLabelResponse returns empty data */
export interface MsgUpdateContractLabelResponseSDKType {}
function createBaseMsgStoreCode(): MsgStoreCode {
    return {
        sender: "",
        wasmByteCode: new Uint8Array(),
        instantiatePermission: undefined
    };
}
export const MsgStoreCode = {
    typeUrl: "/cosmwasm.wasm.v1.MsgStoreCode",
    aminoType: "wasm/MsgStoreCode",
    is(o: any): o is MsgStoreCode {
        return o && (o.$typeUrl === MsgStoreCode.typeUrl || typeof o.sender === "string" && (o.wasmByteCode instanceof Uint8Array || typeof o.wasmByteCode === "string"));
    },
    isSDK(o: any): o is MsgStoreCodeSDKType {
        return o && (o.$typeUrl === MsgStoreCode.typeUrl || typeof o.sender === "string" && (o.wasm_byte_code instanceof Uint8Array || typeof o.wasm_byte_code === "string"));
    },
    isAmino(o: any): o is MsgStoreCodeAmino {
        return o && (o.$typeUrl === MsgStoreCode.typeUrl || typeof o.sender === "string" && (o.wasm_byte_code instanceof Uint8Array || typeof o.wasm_byte_code === "string"));
    },
    encode(message: MsgStoreCode, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        if (message.sender !== "") {
            writer.uint32(10).string(message.sender);
        }
        if (message.wasmByteCode.length !== 0) {
            writer.uint32(18).bytes(message.wasmByteCode);
        }
        if (message.instantiatePermission !== undefined) {
            AccessConfig.encode(message.instantiatePermission, writer.uint32(42).fork()).ldelim();
        }
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): MsgStoreCode {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgStoreCode();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.sender = reader.string();
                    break;
                case 2:
                    message.wasmByteCode = reader.bytes();
                    break;
                case 5:
                    message.instantiatePermission = AccessConfig.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromPartial(object: Partial<MsgStoreCode>): MsgStoreCode {
        const message = createBaseMsgStoreCode();
        message.sender = object.sender ?? "";
        message.wasmByteCode = object.wasmByteCode ?? new Uint8Array();
        message.instantiatePermission = object.instantiatePermission !== undefined && object.instantiatePermission !== null ? AccessConfig.fromPartial(object.instantiatePermission) : undefined;
        return message;
    },
    fromAmino(object: MsgStoreCodeAmino): MsgStoreCode {
        const message = createBaseMsgStoreCode();
        if (object.sender !== undefined && object.sender !== null) {
            message.sender = object.sender;
        }
        if (object.wasm_byte_code !== undefined && object.wasm_byte_code !== null) {
            message.wasmByteCode = fromBase64(object.wasm_byte_code);
        }
        if (object.instantiate_permission !== undefined && object.instantiate_permission !== null) {
            message.instantiatePermission = AccessConfig.fromAmino(object.instantiate_permission);
        }
        return message;
    },
    toAmino(message: MsgStoreCode): MsgStoreCodeAmino {
        const obj: any = {};
        obj.sender = message.sender === "" ? undefined : message.sender;
        obj.wasm_byte_code = message.wasmByteCode ? toBase64(message.wasmByteCode) : undefined;
        obj.instantiate_permission = message.instantiatePermission ? AccessConfig.toAmino(message.instantiatePermission) : undefined;
        return obj;
    },
    fromAminoMsg(object: MsgStoreCodeAminoMsg): MsgStoreCode {
        return MsgStoreCode.fromAmino(object.value);
    },
    toAminoMsg(message: MsgStoreCode): MsgStoreCodeAminoMsg {
        return {
            type: "wasm/MsgStoreCode",
            value: MsgStoreCode.toAmino(message)
        };
    },
    fromProtoMsg(message: MsgStoreCodeProtoMsg): MsgStoreCode {
        return MsgStoreCode.decode(message.value);
    },
    toProto(message: MsgStoreCode): Uint8Array {
        return MsgStoreCode.encode(message).finish();
    },
    toProtoMsg(message: MsgStoreCode): MsgStoreCodeProtoMsg {
        return {
            typeUrl: "/cosmwasm.wasm.v1.MsgStoreCode",
            value: MsgStoreCode.encode(message).finish()
        };
    }
};
function createBaseMsgStoreCodeResponse(): MsgStoreCodeResponse {
    return {
        codeId: BigInt(0),
        checksum: new Uint8Array()
    };
}
export const MsgStoreCodeResponse = {
    typeUrl: "/cosmwasm.wasm.v1.MsgStoreCodeResponse",
    aminoType: "wasm/MsgStoreCodeResponse",
    is(o: any): o is MsgStoreCodeResponse {
        return o && (o.$typeUrl === MsgStoreCodeResponse.typeUrl || typeof o.codeId === "bigint" && (o.checksum instanceof Uint8Array || typeof o.checksum === "string"));
    },
    isSDK(o: any): o is MsgStoreCodeResponseSDKType {
        return o && (o.$typeUrl === MsgStoreCodeResponse.typeUrl || typeof o.code_id === "bigint" && (o.checksum instanceof Uint8Array || typeof o.checksum === "string"));
    },
    isAmino(o: any): o is MsgStoreCodeResponseAmino {
        return o && (o.$typeUrl === MsgStoreCodeResponse.typeUrl || typeof o.code_id === "bigint" && (o.checksum instanceof Uint8Array || typeof o.checksum === "string"));
    },
    encode(message: MsgStoreCodeResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        if (message.codeId !== BigInt(0)) {
            writer.uint32(8).uint64(message.codeId);
        }
        if (message.checksum.length !== 0) {
            writer.uint32(18).bytes(message.checksum);
        }
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): MsgStoreCodeResponse {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgStoreCodeResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.codeId = reader.uint64();
                    break;
                case 2:
                    message.checksum = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromPartial(object: Partial<MsgStoreCodeResponse>): MsgStoreCodeResponse {
        const message = createBaseMsgStoreCodeResponse();
        message.codeId = object.codeId !== undefined && object.codeId !== null ? BigInt(object.codeId.toString()) : BigInt(0);
        message.checksum = object.checksum ?? new Uint8Array();
        return message;
    },
    fromAmino(object: MsgStoreCodeResponseAmino): MsgStoreCodeResponse {
        const message = createBaseMsgStoreCodeResponse();
        if (object.code_id !== undefined && object.code_id !== null) {
            message.codeId = BigInt(object.code_id);
        }
        if (object.checksum !== undefined && object.checksum !== null) {
            message.checksum = bytesFromBase64(object.checksum);
        }
        return message;
    },
    toAmino(message: MsgStoreCodeResponse): MsgStoreCodeResponseAmino {
        const obj: any = {};
        obj.code_id = message.codeId !== BigInt(0) ? message.codeId.toString() : undefined;
        obj.checksum = message.checksum ? base64FromBytes(message.checksum) : undefined;
        return obj;
    },
    fromAminoMsg(object: MsgStoreCodeResponseAminoMsg): MsgStoreCodeResponse {
        return MsgStoreCodeResponse.fromAmino(object.value);
    },
    toAminoMsg(message: MsgStoreCodeResponse): MsgStoreCodeResponseAminoMsg {
        return {
            type: "wasm/MsgStoreCodeResponse",
            value: MsgStoreCodeResponse.toAmino(message)
        };
    },
    fromProtoMsg(message: MsgStoreCodeResponseProtoMsg): MsgStoreCodeResponse {
        return MsgStoreCodeResponse.decode(message.value);
    },
    toProto(message: MsgStoreCodeResponse): Uint8Array {
        return MsgStoreCodeResponse.encode(message).finish();
    },
    toProtoMsg(message: MsgStoreCodeResponse): MsgStoreCodeResponseProtoMsg {
        return {
            typeUrl: "/cosmwasm.wasm.v1.MsgStoreCodeResponse",
            value: MsgStoreCodeResponse.encode(message).finish()
        };
    }
};
function createBaseMsgInstantiateContract(): MsgInstantiateContract {
    return {
        sender: "",
        admin: "",
        codeId: BigInt(0),
        label: "",
        msg: new Uint8Array(),
        funds: []
    };
}
export const MsgInstantiateContract = {
    typeUrl: "/cosmwasm.wasm.v1.MsgInstantiateContract",
    aminoType: "wasm/MsgInstantiateContract",
    is(o: any): o is MsgInstantiateContract {
        return o && (o.$typeUrl === MsgInstantiateContract.typeUrl || typeof o.sender === "string" && typeof o.admin === "string" && typeof o.codeId === "bigint" && typeof o.label === "string" && (o.msg instanceof Uint8Array || typeof o.msg === "string") && Array.isArray(o.funds) && (!o.funds.length || Coin.is(o.funds[0])));
    },
    isSDK(o: any): o is MsgInstantiateContractSDKType {
        return o && (o.$typeUrl === MsgInstantiateContract.typeUrl || typeof o.sender === "string" && typeof o.admin === "string" && typeof o.code_id === "bigint" && typeof o.label === "string" && (o.msg instanceof Uint8Array || typeof o.msg === "string") && Array.isArray(o.funds) && (!o.funds.length || Coin.isSDK(o.funds[0])));
    },
    isAmino(o: any): o is MsgInstantiateContractAmino {
        return o && (o.$typeUrl === MsgInstantiateContract.typeUrl || typeof o.sender === "string" && typeof o.admin === "string" && typeof o.code_id === "bigint" && typeof o.label === "string" && (o.msg instanceof Uint8Array || typeof o.msg === "string") && Array.isArray(o.funds) && (!o.funds.length || Coin.isAmino(o.funds[0])));
    },
    encode(message: MsgInstantiateContract, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        if (message.sender !== "") {
            writer.uint32(10).string(message.sender);
        }
        if (message.admin !== "") {
            writer.uint32(18).string(message.admin);
        }
        if (message.codeId !== BigInt(0)) {
            writer.uint32(24).uint64(message.codeId);
        }
        if (message.label !== "") {
            writer.uint32(34).string(message.label);
        }
        if (message.msg.length !== 0) {
            writer.uint32(42).bytes(message.msg);
        }
        for (const v of message.funds) {
            Coin.encode(v!, writer.uint32(50).fork()).ldelim();
        }
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): MsgInstantiateContract {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgInstantiateContract();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.sender = reader.string();
                    break;
                case 2:
                    message.admin = reader.string();
                    break;
                case 3:
                    message.codeId = reader.uint64();
                    break;
                case 4:
                    message.label = reader.string();
                    break;
                case 5:
                    message.msg = reader.bytes();
                    break;
                case 6:
                    message.funds.push(Coin.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromPartial(object: Partial<MsgInstantiateContract>): MsgInstantiateContract {
        const message = createBaseMsgInstantiateContract();
        message.sender = object.sender ?? "";
        message.admin = object.admin ?? "";
        message.codeId = object.codeId !== undefined && object.codeId !== null ? BigInt(object.codeId.toString()) : BigInt(0);
        message.label = object.label ?? "";
        message.msg = object.msg ?? new Uint8Array();
        message.funds = object.funds?.map(e => Coin.fromPartial(e)) || [];
        return message;
    },
    fromAmino(object: MsgInstantiateContractAmino): MsgInstantiateContract {
        const message = createBaseMsgInstantiateContract();
        if (object.sender !== undefined && object.sender !== null) {
            message.sender = object.sender;
        }
        if (object.admin !== undefined && object.admin !== null) {
            message.admin = object.admin;
        }
        if (object.code_id !== undefined && object.code_id !== null) {
            message.codeId = BigInt(object.code_id);
        }
        if (object.label !== undefined && object.label !== null) {
            message.label = object.label;
        }
        if (object.msg !== undefined && object.msg !== null) {
            message.msg = toUtf8(JSON.stringify(object.msg));
        }
        message.funds = object.funds?.map(e => Coin.fromAmino(e)) || [];
        return message;
    },
    toAmino(message: MsgInstantiateContract): MsgInstantiateContractAmino {
        const obj: any = {};
        obj.sender = message.sender === "" ? undefined : message.sender;
        obj.admin = message.admin === "" ? undefined : message.admin;
        obj.code_id = message.codeId !== BigInt(0) ? message.codeId.toString() : undefined;
        obj.label = message.label === "" ? undefined : message.label;
        obj.msg = message.msg ? JSON.parse(fromUtf8(message.msg)) : undefined;
        if (message.funds) {
            obj.funds = message.funds.map(e => e ? Coin.toAmino(e) : undefined);
        } else {
            obj.funds = message.funds;
        }
        return obj;
    },
    fromAminoMsg(object: MsgInstantiateContractAminoMsg): MsgInstantiateContract {
        return MsgInstantiateContract.fromAmino(object.value);
    },
    toAminoMsg(message: MsgInstantiateContract): MsgInstantiateContractAminoMsg {
        return {
            type: "wasm/MsgInstantiateContract",
            value: MsgInstantiateContract.toAmino(message)
        };
    },
    fromProtoMsg(message: MsgInstantiateContractProtoMsg): MsgInstantiateContract {
        return MsgInstantiateContract.decode(message.value);
    },
    toProto(message: MsgInstantiateContract): Uint8Array {
        return MsgInstantiateContract.encode(message).finish();
    },
    toProtoMsg(message: MsgInstantiateContract): MsgInstantiateContractProtoMsg {
        return {
            typeUrl: "/cosmwasm.wasm.v1.MsgInstantiateContract",
            value: MsgInstantiateContract.encode(message).finish()
        };
    }
};
function createBaseMsgInstantiateContractResponse(): MsgInstantiateContractResponse {
    return {
        address: "",
        data: new Uint8Array()
    };
}
export const MsgInstantiateContractResponse = {
    typeUrl: "/cosmwasm.wasm.v1.MsgInstantiateContractResponse",
    aminoType: "wasm/MsgInstantiateContractResponse",
    is(o: any): o is MsgInstantiateContractResponse {
        return o && (o.$typeUrl === MsgInstantiateContractResponse.typeUrl || typeof o.address === "string" && (o.data instanceof Uint8Array || typeof o.data === "string"));
    },
    isSDK(o: any): o is MsgInstantiateContractResponseSDKType {
        return o && (o.$typeUrl === MsgInstantiateContractResponse.typeUrl || typeof o.address === "string" && (o.data instanceof Uint8Array || typeof o.data === "string"));
    },
    isAmino(o: any): o is MsgInstantiateContractResponseAmino {
        return o && (o.$typeUrl === MsgInstantiateContractResponse.typeUrl || typeof o.address === "string" && (o.data instanceof Uint8Array || typeof o.data === "string"));
    },
    encode(message: MsgInstantiateContractResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        if (message.address !== "") {
            writer.uint32(10).string(message.address);
        }
        if (message.data.length !== 0) {
            writer.uint32(18).bytes(message.data);
        }
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): MsgInstantiateContractResponse {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgInstantiateContractResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.address = reader.string();
                    break;
                case 2:
                    message.data = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromPartial(object: Partial<MsgInstantiateContractResponse>): MsgInstantiateContractResponse {
        const message = createBaseMsgInstantiateContractResponse();
        message.address = object.address ?? "";
        message.data = object.data ?? new Uint8Array();
        return message;
    },
    fromAmino(object: MsgInstantiateContractResponseAmino): MsgInstantiateContractResponse {
        const message = createBaseMsgInstantiateContractResponse();
        if (object.address !== undefined && object.address !== null) {
            message.address = object.address;
        }
        if (object.data !== undefined && object.data !== null) {
            message.data = bytesFromBase64(object.data);
        }
        return message;
    },
    toAmino(message: MsgInstantiateContractResponse): MsgInstantiateContractResponseAmino {
        const obj: any = {};
        obj.address = message.address === "" ? undefined : message.address;
        obj.data = message.data ? base64FromBytes(message.data) : undefined;
        return obj;
    },
    fromAminoMsg(object: MsgInstantiateContractResponseAminoMsg): MsgInstantiateContractResponse {
        return MsgInstantiateContractResponse.fromAmino(object.value);
    },
    toAminoMsg(message: MsgInstantiateContractResponse): MsgInstantiateContractResponseAminoMsg {
        return {
            type: "wasm/MsgInstantiateContractResponse",
            value: MsgInstantiateContractResponse.toAmino(message)
        };
    },
    fromProtoMsg(message: MsgInstantiateContractResponseProtoMsg): MsgInstantiateContractResponse {
        return MsgInstantiateContractResponse.decode(message.value);
    },
    toProto(message: MsgInstantiateContractResponse): Uint8Array {
        return MsgInstantiateContractResponse.encode(message).finish();
    },
    toProtoMsg(message: MsgInstantiateContractResponse): MsgInstantiateContractResponseProtoMsg {
        return {
            typeUrl: "/cosmwasm.wasm.v1.MsgInstantiateContractResponse",
            value: MsgInstantiateContractResponse.encode(message).finish()
        };
    }
};
function createBaseMsgInstantiateContract2(): MsgInstantiateContract2 {
    return {
        sender: "",
        admin: "",
        codeId: BigInt(0),
        label: "",
        msg: new Uint8Array(),
        funds: [],
        salt: new Uint8Array(),
        fixMsg: false
    };
}
export const MsgInstantiateContract2 = {
    typeUrl: "/cosmwasm.wasm.v1.MsgInstantiateContract2",
    aminoType: "wasm/MsgInstantiateContract2",
    is(o: any): o is MsgInstantiateContract2 {
        return o && (o.$typeUrl === MsgInstantiateContract2.typeUrl || typeof o.sender === "string" && typeof o.admin === "string" && typeof o.codeId === "bigint" && typeof o.label === "string" && (o.msg instanceof Uint8Array || typeof o.msg === "string") && Array.isArray(o.funds) && (!o.funds.length || Coin.is(o.funds[0])) && (o.salt instanceof Uint8Array || typeof o.salt === "string") && typeof o.fixMsg === "boolean");
    },
    isSDK(o: any): o is MsgInstantiateContract2SDKType {
        return o && (o.$typeUrl === MsgInstantiateContract2.typeUrl || typeof o.sender === "string" && typeof o.admin === "string" && typeof o.code_id === "bigint" && typeof o.label === "string" && (o.msg instanceof Uint8Array || typeof o.msg === "string") && Array.isArray(o.funds) && (!o.funds.length || Coin.isSDK(o.funds[0])) && (o.salt instanceof Uint8Array || typeof o.salt === "string") && typeof o.fix_msg === "boolean");
    },
    isAmino(o: any): o is MsgInstantiateContract2Amino {
        return o && (o.$typeUrl === MsgInstantiateContract2.typeUrl || typeof o.sender === "string" && typeof o.admin === "string" && typeof o.code_id === "bigint" && typeof o.label === "string" && (o.msg instanceof Uint8Array || typeof o.msg === "string") && Array.isArray(o.funds) && (!o.funds.length || Coin.isAmino(o.funds[0])) && (o.salt instanceof Uint8Array || typeof o.salt === "string") && typeof o.fix_msg === "boolean");
    },
    encode(message: MsgInstantiateContract2, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        if (message.sender !== "") {
            writer.uint32(10).string(message.sender);
        }
        if (message.admin !== "") {
            writer.uint32(18).string(message.admin);
        }
        if (message.codeId !== BigInt(0)) {
            writer.uint32(24).uint64(message.codeId);
        }
        if (message.label !== "") {
            writer.uint32(34).string(message.label);
        }
        if (message.msg.length !== 0) {
            writer.uint32(42).bytes(message.msg);
        }
        for (const v of message.funds) {
            Coin.encode(v!, writer.uint32(50).fork()).ldelim();
        }
        if (message.salt.length !== 0) {
            writer.uint32(58).bytes(message.salt);
        }
        if (message.fixMsg === true) {
            writer.uint32(64).bool(message.fixMsg);
        }
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): MsgInstantiateContract2 {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgInstantiateContract2();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.sender = reader.string();
                    break;
                case 2:
                    message.admin = reader.string();
                    break;
                case 3:
                    message.codeId = reader.uint64();
                    break;
                case 4:
                    message.label = reader.string();
                    break;
                case 5:
                    message.msg = reader.bytes();
                    break;
                case 6:
                    message.funds.push(Coin.decode(reader, reader.uint32()));
                    break;
                case 7:
                    message.salt = reader.bytes();
                    break;
                case 8:
                    message.fixMsg = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromPartial(object: Partial<MsgInstantiateContract2>): MsgInstantiateContract2 {
        const message = createBaseMsgInstantiateContract2();
        message.sender = object.sender ?? "";
        message.admin = object.admin ?? "";
        message.codeId = object.codeId !== undefined && object.codeId !== null ? BigInt(object.codeId.toString()) : BigInt(0);
        message.label = object.label ?? "";
        message.msg = object.msg ?? new Uint8Array();
        message.funds = object.funds?.map(e => Coin.fromPartial(e)) || [];
        message.salt = object.salt ?? new Uint8Array();
        message.fixMsg = object.fixMsg ?? false;
        return message;
    },
    fromAmino(object: MsgInstantiateContract2Amino): MsgInstantiateContract2 {
        const message = createBaseMsgInstantiateContract2();
        if (object.sender !== undefined && object.sender !== null) {
            message.sender = object.sender;
        }
        if (object.admin !== undefined && object.admin !== null) {
            message.admin = object.admin;
        }
        if (object.code_id !== undefined && object.code_id !== null) {
            message.codeId = BigInt(object.code_id);
        }
        if (object.label !== undefined && object.label !== null) {
            message.label = object.label;
        }
        if (object.msg !== undefined && object.msg !== null) {
            message.msg = toUtf8(JSON.stringify(object.msg));
        }
        message.funds = object.funds?.map(e => Coin.fromAmino(e)) || [];
        if (object.salt !== undefined && object.salt !== null) {
            message.salt = bytesFromBase64(object.salt);
        }
        if (object.fix_msg !== undefined && object.fix_msg !== null) {
            message.fixMsg = object.fix_msg;
        }
        return message;
    },
    toAmino(message: MsgInstantiateContract2): MsgInstantiateContract2Amino {
        const obj: any = {};
        obj.sender = message.sender === "" ? undefined : message.sender;
        obj.admin = message.admin === "" ? undefined : message.admin;
        obj.code_id = message.codeId !== BigInt(0) ? message.codeId.toString() : undefined;
        obj.label = message.label === "" ? undefined : message.label;
        obj.msg = message.msg ? JSON.parse(fromUtf8(message.msg)) : undefined;
        if (message.funds) {
            obj.funds = message.funds.map(e => e ? Coin.toAmino(e) : undefined);
        } else {
            obj.funds = message.funds;
        }
        obj.salt = message.salt ? base64FromBytes(message.salt) : undefined;
        obj.fix_msg = message.fixMsg === false ? undefined : message.fixMsg;
        return obj;
    },
    fromAminoMsg(object: MsgInstantiateContract2AminoMsg): MsgInstantiateContract2 {
        return MsgInstantiateContract2.fromAmino(object.value);
    },
    toAminoMsg(message: MsgInstantiateContract2): MsgInstantiateContract2AminoMsg {
        return {
            type: "wasm/MsgInstantiateContract2",
            value: MsgInstantiateContract2.toAmino(message)
        };
    },
    fromProtoMsg(message: MsgInstantiateContract2ProtoMsg): MsgInstantiateContract2 {
        return MsgInstantiateContract2.decode(message.value);
    },
    toProto(message: MsgInstantiateContract2): Uint8Array {
        return MsgInstantiateContract2.encode(message).finish();
    },
    toProtoMsg(message: MsgInstantiateContract2): MsgInstantiateContract2ProtoMsg {
        return {
            typeUrl: "/cosmwasm.wasm.v1.MsgInstantiateContract2",
            value: MsgInstantiateContract2.encode(message).finish()
        };
    }
};
function createBaseMsgInstantiateContract2Response(): MsgInstantiateContract2Response {
    return {
        address: "",
        data: new Uint8Array()
    };
}
export const MsgInstantiateContract2Response = {
    typeUrl: "/cosmwasm.wasm.v1.MsgInstantiateContract2Response",
    aminoType: "wasm/MsgInstantiateContract2Response",
    is(o: any): o is MsgInstantiateContract2Response {
        return o && (o.$typeUrl === MsgInstantiateContract2Response.typeUrl || typeof o.address === "string" && (o.data instanceof Uint8Array || typeof o.data === "string"));
    },
    isSDK(o: any): o is MsgInstantiateContract2ResponseSDKType {
        return o && (o.$typeUrl === MsgInstantiateContract2Response.typeUrl || typeof o.address === "string" && (o.data instanceof Uint8Array || typeof o.data === "string"));
    },
    isAmino(o: any): o is MsgInstantiateContract2ResponseAmino {
        return o && (o.$typeUrl === MsgInstantiateContract2Response.typeUrl || typeof o.address === "string" && (o.data instanceof Uint8Array || typeof o.data === "string"));
    },
    encode(message: MsgInstantiateContract2Response, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        if (message.address !== "") {
            writer.uint32(10).string(message.address);
        }
        if (message.data.length !== 0) {
            writer.uint32(18).bytes(message.data);
        }
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): MsgInstantiateContract2Response {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgInstantiateContract2Response();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.address = reader.string();
                    break;
                case 2:
                    message.data = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromPartial(object: Partial<MsgInstantiateContract2Response>): MsgInstantiateContract2Response {
        const message = createBaseMsgInstantiateContract2Response();
        message.address = object.address ?? "";
        message.data = object.data ?? new Uint8Array();
        return message;
    },
    fromAmino(object: MsgInstantiateContract2ResponseAmino): MsgInstantiateContract2Response {
        const message = createBaseMsgInstantiateContract2Response();
        if (object.address !== undefined && object.address !== null) {
            message.address = object.address;
        }
        if (object.data !== undefined && object.data !== null) {
            message.data = bytesFromBase64(object.data);
        }
        return message;
    },
    toAmino(message: MsgInstantiateContract2Response): MsgInstantiateContract2ResponseAmino {
        const obj: any = {};
        obj.address = message.address === "" ? undefined : message.address;
        obj.data = message.data ? base64FromBytes(message.data) : undefined;
        return obj;
    },
    fromAminoMsg(object: MsgInstantiateContract2ResponseAminoMsg): MsgInstantiateContract2Response {
        return MsgInstantiateContract2Response.fromAmino(object.value);
    },
    toAminoMsg(message: MsgInstantiateContract2Response): MsgInstantiateContract2ResponseAminoMsg {
        return {
            type: "wasm/MsgInstantiateContract2Response",
            value: MsgInstantiateContract2Response.toAmino(message)
        };
    },
    fromProtoMsg(message: MsgInstantiateContract2ResponseProtoMsg): MsgInstantiateContract2Response {
        return MsgInstantiateContract2Response.decode(message.value);
    },
    toProto(message: MsgInstantiateContract2Response): Uint8Array {
        return MsgInstantiateContract2Response.encode(message).finish();
    },
    toProtoMsg(message: MsgInstantiateContract2Response): MsgInstantiateContract2ResponseProtoMsg {
        return {
            typeUrl: "/cosmwasm.wasm.v1.MsgInstantiateContract2Response",
            value: MsgInstantiateContract2Response.encode(message).finish()
        };
    }
};
function createBaseMsgExecuteContract(): MsgExecuteContract {
    return {
        sender: "",
        contract: "",
        msg: new Uint8Array(),
        funds: []
    };
}
export const MsgExecuteContract = {
    typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
    aminoType: "wasm/MsgExecuteContract",
    is(o: any): o is MsgExecuteContract {
        return o && (o.$typeUrl === MsgExecuteContract.typeUrl || typeof o.sender === "string" && typeof o.contract === "string" && (o.msg instanceof Uint8Array || typeof o.msg === "string") && Array.isArray(o.funds) && (!o.funds.length || Coin.is(o.funds[0])));
    },
    isSDK(o: any): o is MsgExecuteContractSDKType {
        return o && (o.$typeUrl === MsgExecuteContract.typeUrl || typeof o.sender === "string" && typeof o.contract === "string" && (o.msg instanceof Uint8Array || typeof o.msg === "string") && Array.isArray(o.funds) && (!o.funds.length || Coin.isSDK(o.funds[0])));
    },
    isAmino(o: any): o is MsgExecuteContractAmino {
        return o && (o.$typeUrl === MsgExecuteContract.typeUrl || typeof o.sender === "string" && typeof o.contract === "string" && (o.msg instanceof Uint8Array || typeof o.msg === "string") && Array.isArray(o.funds) && (!o.funds.length || Coin.isAmino(o.funds[0])));
    },
    encode(message: MsgExecuteContract, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        if (message.sender !== "") {
            writer.uint32(10).string(message.sender);
        }
        if (message.contract !== "") {
            writer.uint32(18).string(message.contract);
        }
        if (message.msg.length !== 0) {
            writer.uint32(26).bytes(message.msg);
        }
        for (const v of message.funds) {
            Coin.encode(v!, writer.uint32(42).fork()).ldelim();
        }
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): MsgExecuteContract {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgExecuteContract();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.sender = reader.string();
                    break;
                case 2:
                    message.contract = reader.string();
                    break;
                case 3:
                    message.msg = reader.bytes();
                    break;
                case 5:
                    message.funds.push(Coin.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromPartial(object: Partial<MsgExecuteContract>): MsgExecuteContract {
        const message = createBaseMsgExecuteContract();
        message.sender = object.sender ?? "";
        message.contract = object.contract ?? "";
        message.msg = object.msg ?? new Uint8Array();
        message.funds = object.funds?.map(e => Coin.fromPartial(e)) || [];
        return message;
    },
    fromAmino(object: MsgExecuteContractAmino): MsgExecuteContract {
        const message = createBaseMsgExecuteContract();
        if (object.sender !== undefined && object.sender !== null) {
            message.sender = object.sender;
        }
        if (object.contract !== undefined && object.contract !== null) {
            message.contract = object.contract;
        }
        if (object.msg !== undefined && object.msg !== null) {
            message.msg = toUtf8(JSON.stringify(object.msg));
        }
        message.funds = object.funds?.map(e => Coin.fromAmino(e)) || [];
        return message;
    },
    toAmino(message: MsgExecuteContract): MsgExecuteContractAmino {
        const obj: any = {};
        obj.sender = message.sender === "" ? undefined : message.sender;
        obj.contract = message.contract === "" ? undefined : message.contract;
        obj.msg = message.msg ? JSON.parse(fromUtf8(message.msg)) : undefined;
        if (message.funds) {
            obj.funds = message.funds.map(e => e ? Coin.toAmino(e) : undefined);
        } else {
            obj.funds = message.funds;
        }
        return obj;
    },
    fromAminoMsg(object: MsgExecuteContractAminoMsg): MsgExecuteContract {
        return MsgExecuteContract.fromAmino(object.value);
    },
    toAminoMsg(message: MsgExecuteContract): MsgExecuteContractAminoMsg {
        return {
            type: "wasm/MsgExecuteContract",
            value: MsgExecuteContract.toAmino(message)
        };
    },
    fromProtoMsg(message: MsgExecuteContractProtoMsg): MsgExecuteContract {
        return MsgExecuteContract.decode(message.value);
    },
    toProto(message: MsgExecuteContract): Uint8Array {
        return MsgExecuteContract.encode(message).finish();
    },
    toProtoMsg(message: MsgExecuteContract): MsgExecuteContractProtoMsg {
        return {
            typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
            value: MsgExecuteContract.encode(message).finish()
        };
    }
};
function createBaseMsgExecuteContractResponse(): MsgExecuteContractResponse {
    return {
        data: new Uint8Array()
    };
}
export const MsgExecuteContractResponse = {
    typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContractResponse",
    aminoType: "wasm/MsgExecuteContractResponse",
    is(o: any): o is MsgExecuteContractResponse {
        return o && (o.$typeUrl === MsgExecuteContractResponse.typeUrl || o.data instanceof Uint8Array || typeof o.data === "string");
    },
    isSDK(o: any): o is MsgExecuteContractResponseSDKType {
        return o && (o.$typeUrl === MsgExecuteContractResponse.typeUrl || o.data instanceof Uint8Array || typeof o.data === "string");
    },
    isAmino(o: any): o is MsgExecuteContractResponseAmino {
        return o && (o.$typeUrl === MsgExecuteContractResponse.typeUrl || o.data instanceof Uint8Array || typeof o.data === "string");
    },
    encode(message: MsgExecuteContractResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        if (message.data.length !== 0) {
            writer.uint32(10).bytes(message.data);
        }
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): MsgExecuteContractResponse {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgExecuteContractResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.data = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromPartial(object: Partial<MsgExecuteContractResponse>): MsgExecuteContractResponse {
        const message = createBaseMsgExecuteContractResponse();
        message.data = object.data ?? new Uint8Array();
        return message;
    },
    fromAmino(object: MsgExecuteContractResponseAmino): MsgExecuteContractResponse {
        const message = createBaseMsgExecuteContractResponse();
        if (object.data !== undefined && object.data !== null) {
            message.data = bytesFromBase64(object.data);
        }
        return message;
    },
    toAmino(message: MsgExecuteContractResponse): MsgExecuteContractResponseAmino {
        const obj: any = {};
        obj.data = message.data ? base64FromBytes(message.data) : undefined;
        return obj;
    },
    fromAminoMsg(object: MsgExecuteContractResponseAminoMsg): MsgExecuteContractResponse {
        return MsgExecuteContractResponse.fromAmino(object.value);
    },
    toAminoMsg(message: MsgExecuteContractResponse): MsgExecuteContractResponseAminoMsg {
        return {
            type: "wasm/MsgExecuteContractResponse",
            value: MsgExecuteContractResponse.toAmino(message)
        };
    },
    fromProtoMsg(message: MsgExecuteContractResponseProtoMsg): MsgExecuteContractResponse {
        return MsgExecuteContractResponse.decode(message.value);
    },
    toProto(message: MsgExecuteContractResponse): Uint8Array {
        return MsgExecuteContractResponse.encode(message).finish();
    },
    toProtoMsg(message: MsgExecuteContractResponse): MsgExecuteContractResponseProtoMsg {
        return {
            typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContractResponse",
            value: MsgExecuteContractResponse.encode(message).finish()
        };
    }
};
function createBaseMsgMigrateContract(): MsgMigrateContract {
    return {
        sender: "",
        contract: "",
        codeId: BigInt(0),
        msg: new Uint8Array()
    };
}
export const MsgMigrateContract = {
    typeUrl: "/cosmwasm.wasm.v1.MsgMigrateContract",
    aminoType: "wasm/MsgMigrateContract",
    is(o: any): o is MsgMigrateContract {
        return o && (o.$typeUrl === MsgMigrateContract.typeUrl || typeof o.sender === "string" && typeof o.contract === "string" && typeof o.codeId === "bigint" && (o.msg instanceof Uint8Array || typeof o.msg === "string"));
    },
    isSDK(o: any): o is MsgMigrateContractSDKType {
        return o && (o.$typeUrl === MsgMigrateContract.typeUrl || typeof o.sender === "string" && typeof o.contract === "string" && typeof o.code_id === "bigint" && (o.msg instanceof Uint8Array || typeof o.msg === "string"));
    },
    isAmino(o: any): o is MsgMigrateContractAmino {
        return o && (o.$typeUrl === MsgMigrateContract.typeUrl || typeof o.sender === "string" && typeof o.contract === "string" && typeof o.code_id === "bigint" && (o.msg instanceof Uint8Array || typeof o.msg === "string"));
    },
    encode(message: MsgMigrateContract, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        if (message.sender !== "") {
            writer.uint32(10).string(message.sender);
        }
        if (message.contract !== "") {
            writer.uint32(18).string(message.contract);
        }
        if (message.codeId !== BigInt(0)) {
            writer.uint32(24).uint64(message.codeId);
        }
        if (message.msg.length !== 0) {
            writer.uint32(34).bytes(message.msg);
        }
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): MsgMigrateContract {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgMigrateContract();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.sender = reader.string();
                    break;
                case 2:
                    message.contract = reader.string();
                    break;
                case 3:
                    message.codeId = reader.uint64();
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
    fromPartial(object: Partial<MsgMigrateContract>): MsgMigrateContract {
        const message = createBaseMsgMigrateContract();
        message.sender = object.sender ?? "";
        message.contract = object.contract ?? "";
        message.codeId = object.codeId !== undefined && object.codeId !== null ? BigInt(object.codeId.toString()) : BigInt(0);
        message.msg = object.msg ?? new Uint8Array();
        return message;
    },
    fromAmino(object: MsgMigrateContractAmino): MsgMigrateContract {
        const message = createBaseMsgMigrateContract();
        if (object.sender !== undefined && object.sender !== null) {
            message.sender = object.sender;
        }
        if (object.contract !== undefined && object.contract !== null) {
            message.contract = object.contract;
        }
        if (object.code_id !== undefined && object.code_id !== null) {
            message.codeId = BigInt(object.code_id);
        }
        if (object.msg !== undefined && object.msg !== null) {
            message.msg = toUtf8(JSON.stringify(object.msg));
        }
        return message;
    },
    toAmino(message: MsgMigrateContract): MsgMigrateContractAmino {
        const obj: any = {};
        obj.sender = message.sender === "" ? undefined : message.sender;
        obj.contract = message.contract === "" ? undefined : message.contract;
        obj.code_id = message.codeId !== BigInt(0) ? message.codeId.toString() : undefined;
        obj.msg = message.msg ? JSON.parse(fromUtf8(message.msg)) : undefined;
        return obj;
    },
    fromAminoMsg(object: MsgMigrateContractAminoMsg): MsgMigrateContract {
        return MsgMigrateContract.fromAmino(object.value);
    },
    toAminoMsg(message: MsgMigrateContract): MsgMigrateContractAminoMsg {
        return {
            type: "wasm/MsgMigrateContract",
            value: MsgMigrateContract.toAmino(message)
        };
    },
    fromProtoMsg(message: MsgMigrateContractProtoMsg): MsgMigrateContract {
        return MsgMigrateContract.decode(message.value);
    },
    toProto(message: MsgMigrateContract): Uint8Array {
        return MsgMigrateContract.encode(message).finish();
    },
    toProtoMsg(message: MsgMigrateContract): MsgMigrateContractProtoMsg {
        return {
            typeUrl: "/cosmwasm.wasm.v1.MsgMigrateContract",
            value: MsgMigrateContract.encode(message).finish()
        };
    }
};
function createBaseMsgMigrateContractResponse(): MsgMigrateContractResponse {
    return {
        data: new Uint8Array()
    };
}
export const MsgMigrateContractResponse = {
    typeUrl: "/cosmwasm.wasm.v1.MsgMigrateContractResponse",
    aminoType: "wasm/MsgMigrateContractResponse",
    is(o: any): o is MsgMigrateContractResponse {
        return o && (o.$typeUrl === MsgMigrateContractResponse.typeUrl || o.data instanceof Uint8Array || typeof o.data === "string");
    },
    isSDK(o: any): o is MsgMigrateContractResponseSDKType {
        return o && (o.$typeUrl === MsgMigrateContractResponse.typeUrl || o.data instanceof Uint8Array || typeof o.data === "string");
    },
    isAmino(o: any): o is MsgMigrateContractResponseAmino {
        return o && (o.$typeUrl === MsgMigrateContractResponse.typeUrl || o.data instanceof Uint8Array || typeof o.data === "string");
    },
    encode(message: MsgMigrateContractResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        if (message.data.length !== 0) {
            writer.uint32(10).bytes(message.data);
        }
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): MsgMigrateContractResponse {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgMigrateContractResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.data = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromPartial(object: Partial<MsgMigrateContractResponse>): MsgMigrateContractResponse {
        const message = createBaseMsgMigrateContractResponse();
        message.data = object.data ?? new Uint8Array();
        return message;
    },
    fromAmino(object: MsgMigrateContractResponseAmino): MsgMigrateContractResponse {
        const message = createBaseMsgMigrateContractResponse();
        if (object.data !== undefined && object.data !== null) {
            message.data = bytesFromBase64(object.data);
        }
        return message;
    },
    toAmino(message: MsgMigrateContractResponse): MsgMigrateContractResponseAmino {
        const obj: any = {};
        obj.data = message.data ? base64FromBytes(message.data) : undefined;
        return obj;
    },
    fromAminoMsg(object: MsgMigrateContractResponseAminoMsg): MsgMigrateContractResponse {
        return MsgMigrateContractResponse.fromAmino(object.value);
    },
    toAminoMsg(message: MsgMigrateContractResponse): MsgMigrateContractResponseAminoMsg {
        return {
            type: "wasm/MsgMigrateContractResponse",
            value: MsgMigrateContractResponse.toAmino(message)
        };
    },
    fromProtoMsg(message: MsgMigrateContractResponseProtoMsg): MsgMigrateContractResponse {
        return MsgMigrateContractResponse.decode(message.value);
    },
    toProto(message: MsgMigrateContractResponse): Uint8Array {
        return MsgMigrateContractResponse.encode(message).finish();
    },
    toProtoMsg(message: MsgMigrateContractResponse): MsgMigrateContractResponseProtoMsg {
        return {
            typeUrl: "/cosmwasm.wasm.v1.MsgMigrateContractResponse",
            value: MsgMigrateContractResponse.encode(message).finish()
        };
    }
};
function createBaseMsgUpdateAdmin(): MsgUpdateAdmin {
    return {
        sender: "",
        newAdmin: "",
        contract: ""
    };
}
export const MsgUpdateAdmin = {
    typeUrl: "/cosmwasm.wasm.v1.MsgUpdateAdmin",
    aminoType: "wasm/MsgUpdateAdmin",
    is(o: any): o is MsgUpdateAdmin {
        return o && (o.$typeUrl === MsgUpdateAdmin.typeUrl || typeof o.sender === "string" && typeof o.newAdmin === "string" && typeof o.contract === "string");
    },
    isSDK(o: any): o is MsgUpdateAdminSDKType {
        return o && (o.$typeUrl === MsgUpdateAdmin.typeUrl || typeof o.sender === "string" && typeof o.new_admin === "string" && typeof o.contract === "string");
    },
    isAmino(o: any): o is MsgUpdateAdminAmino {
        return o && (o.$typeUrl === MsgUpdateAdmin.typeUrl || typeof o.sender === "string" && typeof o.new_admin === "string" && typeof o.contract === "string");
    },
    encode(message: MsgUpdateAdmin, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        if (message.sender !== "") {
            writer.uint32(10).string(message.sender);
        }
        if (message.newAdmin !== "") {
            writer.uint32(18).string(message.newAdmin);
        }
        if (message.contract !== "") {
            writer.uint32(26).string(message.contract);
        }
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): MsgUpdateAdmin {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgUpdateAdmin();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.sender = reader.string();
                    break;
                case 2:
                    message.newAdmin = reader.string();
                    break;
                case 3:
                    message.contract = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromPartial(object: Partial<MsgUpdateAdmin>): MsgUpdateAdmin {
        const message = createBaseMsgUpdateAdmin();
        message.sender = object.sender ?? "";
        message.newAdmin = object.newAdmin ?? "";
        message.contract = object.contract ?? "";
        return message;
    },
    fromAmino(object: MsgUpdateAdminAmino): MsgUpdateAdmin {
        const message = createBaseMsgUpdateAdmin();
        if (object.sender !== undefined && object.sender !== null) {
            message.sender = object.sender;
        }
        if (object.new_admin !== undefined && object.new_admin !== null) {
            message.newAdmin = object.new_admin;
        }
        if (object.contract !== undefined && object.contract !== null) {
            message.contract = object.contract;
        }
        return message;
    },
    toAmino(message: MsgUpdateAdmin): MsgUpdateAdminAmino {
        const obj: any = {};
        obj.sender = message.sender === "" ? undefined : message.sender;
        obj.new_admin = message.newAdmin === "" ? undefined : message.newAdmin;
        obj.contract = message.contract === "" ? undefined : message.contract;
        return obj;
    },
    fromAminoMsg(object: MsgUpdateAdminAminoMsg): MsgUpdateAdmin {
        return MsgUpdateAdmin.fromAmino(object.value);
    },
    toAminoMsg(message: MsgUpdateAdmin): MsgUpdateAdminAminoMsg {
        return {
            type: "wasm/MsgUpdateAdmin",
            value: MsgUpdateAdmin.toAmino(message)
        };
    },
    fromProtoMsg(message: MsgUpdateAdminProtoMsg): MsgUpdateAdmin {
        return MsgUpdateAdmin.decode(message.value);
    },
    toProto(message: MsgUpdateAdmin): Uint8Array {
        return MsgUpdateAdmin.encode(message).finish();
    },
    toProtoMsg(message: MsgUpdateAdmin): MsgUpdateAdminProtoMsg {
        return {
            typeUrl: "/cosmwasm.wasm.v1.MsgUpdateAdmin",
            value: MsgUpdateAdmin.encode(message).finish()
        };
    }
};
function createBaseMsgUpdateAdminResponse(): MsgUpdateAdminResponse {
    return {};
}
export const MsgUpdateAdminResponse = {
    typeUrl: "/cosmwasm.wasm.v1.MsgUpdateAdminResponse",
    aminoType: "wasm/MsgUpdateAdminResponse",
    is(o: any): o is MsgUpdateAdminResponse {
        return o && o.$typeUrl === MsgUpdateAdminResponse.typeUrl;
    },
    isSDK(o: any): o is MsgUpdateAdminResponseSDKType {
        return o && o.$typeUrl === MsgUpdateAdminResponse.typeUrl;
    },
    isAmino(o: any): o is MsgUpdateAdminResponseAmino {
        return o && o.$typeUrl === MsgUpdateAdminResponse.typeUrl;
    },
    encode(_: MsgUpdateAdminResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): MsgUpdateAdminResponse {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgUpdateAdminResponse();
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
    fromPartial(_: Partial<MsgUpdateAdminResponse>): MsgUpdateAdminResponse {
        const message = createBaseMsgUpdateAdminResponse();
        return message;
    },
    fromAmino(_: MsgUpdateAdminResponseAmino): MsgUpdateAdminResponse {
        const message = createBaseMsgUpdateAdminResponse();
        return message;
    },
    toAmino(_: MsgUpdateAdminResponse): MsgUpdateAdminResponseAmino {
        const obj: any = {};
        return obj;
    },
    fromAminoMsg(object: MsgUpdateAdminResponseAminoMsg): MsgUpdateAdminResponse {
        return MsgUpdateAdminResponse.fromAmino(object.value);
    },
    toAminoMsg(message: MsgUpdateAdminResponse): MsgUpdateAdminResponseAminoMsg {
        return {
            type: "wasm/MsgUpdateAdminResponse",
            value: MsgUpdateAdminResponse.toAmino(message)
        };
    },
    fromProtoMsg(message: MsgUpdateAdminResponseProtoMsg): MsgUpdateAdminResponse {
        return MsgUpdateAdminResponse.decode(message.value);
    },
    toProto(message: MsgUpdateAdminResponse): Uint8Array {
        return MsgUpdateAdminResponse.encode(message).finish();
    },
    toProtoMsg(message: MsgUpdateAdminResponse): MsgUpdateAdminResponseProtoMsg {
        return {
            typeUrl: "/cosmwasm.wasm.v1.MsgUpdateAdminResponse",
            value: MsgUpdateAdminResponse.encode(message).finish()
        };
    }
};
function createBaseMsgClearAdmin(): MsgClearAdmin {
    return {
        sender: "",
        contract: ""
    };
}
export const MsgClearAdmin = {
    typeUrl: "/cosmwasm.wasm.v1.MsgClearAdmin",
    aminoType: "wasm/MsgClearAdmin",
    is(o: any): o is MsgClearAdmin {
        return o && (o.$typeUrl === MsgClearAdmin.typeUrl || typeof o.sender === "string" && typeof o.contract === "string");
    },
    isSDK(o: any): o is MsgClearAdminSDKType {
        return o && (o.$typeUrl === MsgClearAdmin.typeUrl || typeof o.sender === "string" && typeof o.contract === "string");
    },
    isAmino(o: any): o is MsgClearAdminAmino {
        return o && (o.$typeUrl === MsgClearAdmin.typeUrl || typeof o.sender === "string" && typeof o.contract === "string");
    },
    encode(message: MsgClearAdmin, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        if (message.sender !== "") {
            writer.uint32(10).string(message.sender);
        }
        if (message.contract !== "") {
            writer.uint32(26).string(message.contract);
        }
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): MsgClearAdmin {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgClearAdmin();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.sender = reader.string();
                    break;
                case 3:
                    message.contract = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromPartial(object: Partial<MsgClearAdmin>): MsgClearAdmin {
        const message = createBaseMsgClearAdmin();
        message.sender = object.sender ?? "";
        message.contract = object.contract ?? "";
        return message;
    },
    fromAmino(object: MsgClearAdminAmino): MsgClearAdmin {
        const message = createBaseMsgClearAdmin();
        if (object.sender !== undefined && object.sender !== null) {
            message.sender = object.sender;
        }
        if (object.contract !== undefined && object.contract !== null) {
            message.contract = object.contract;
        }
        return message;
    },
    toAmino(message: MsgClearAdmin): MsgClearAdminAmino {
        const obj: any = {};
        obj.sender = message.sender === "" ? undefined : message.sender;
        obj.contract = message.contract === "" ? undefined : message.contract;
        return obj;
    },
    fromAminoMsg(object: MsgClearAdminAminoMsg): MsgClearAdmin {
        return MsgClearAdmin.fromAmino(object.value);
    },
    toAminoMsg(message: MsgClearAdmin): MsgClearAdminAminoMsg {
        return {
            type: "wasm/MsgClearAdmin",
            value: MsgClearAdmin.toAmino(message)
        };
    },
    fromProtoMsg(message: MsgClearAdminProtoMsg): MsgClearAdmin {
        return MsgClearAdmin.decode(message.value);
    },
    toProto(message: MsgClearAdmin): Uint8Array {
        return MsgClearAdmin.encode(message).finish();
    },
    toProtoMsg(message: MsgClearAdmin): MsgClearAdminProtoMsg {
        return {
            typeUrl: "/cosmwasm.wasm.v1.MsgClearAdmin",
            value: MsgClearAdmin.encode(message).finish()
        };
    }
};
function createBaseMsgClearAdminResponse(): MsgClearAdminResponse {
    return {};
}
export const MsgClearAdminResponse = {
    typeUrl: "/cosmwasm.wasm.v1.MsgClearAdminResponse",
    aminoType: "wasm/MsgClearAdminResponse",
    is(o: any): o is MsgClearAdminResponse {
        return o && o.$typeUrl === MsgClearAdminResponse.typeUrl;
    },
    isSDK(o: any): o is MsgClearAdminResponseSDKType {
        return o && o.$typeUrl === MsgClearAdminResponse.typeUrl;
    },
    isAmino(o: any): o is MsgClearAdminResponseAmino {
        return o && o.$typeUrl === MsgClearAdminResponse.typeUrl;
    },
    encode(_: MsgClearAdminResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): MsgClearAdminResponse {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgClearAdminResponse();
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
    fromPartial(_: Partial<MsgClearAdminResponse>): MsgClearAdminResponse {
        const message = createBaseMsgClearAdminResponse();
        return message;
    },
    fromAmino(_: MsgClearAdminResponseAmino): MsgClearAdminResponse {
        const message = createBaseMsgClearAdminResponse();
        return message;
    },
    toAmino(_: MsgClearAdminResponse): MsgClearAdminResponseAmino {
        const obj: any = {};
        return obj;
    },
    fromAminoMsg(object: MsgClearAdminResponseAminoMsg): MsgClearAdminResponse {
        return MsgClearAdminResponse.fromAmino(object.value);
    },
    toAminoMsg(message: MsgClearAdminResponse): MsgClearAdminResponseAminoMsg {
        return {
            type: "wasm/MsgClearAdminResponse",
            value: MsgClearAdminResponse.toAmino(message)
        };
    },
    fromProtoMsg(message: MsgClearAdminResponseProtoMsg): MsgClearAdminResponse {
        return MsgClearAdminResponse.decode(message.value);
    },
    toProto(message: MsgClearAdminResponse): Uint8Array {
        return MsgClearAdminResponse.encode(message).finish();
    },
    toProtoMsg(message: MsgClearAdminResponse): MsgClearAdminResponseProtoMsg {
        return {
            typeUrl: "/cosmwasm.wasm.v1.MsgClearAdminResponse",
            value: MsgClearAdminResponse.encode(message).finish()
        };
    }
};
function createBaseMsgUpdateInstantiateConfig(): MsgUpdateInstantiateConfig {
    return {
        sender: "",
        codeId: BigInt(0),
        newInstantiatePermission: undefined
    };
}
export const MsgUpdateInstantiateConfig = {
    typeUrl: "/cosmwasm.wasm.v1.MsgUpdateInstantiateConfig",
    aminoType: "wasm/MsgUpdateInstantiateConfig",
    is(o: any): o is MsgUpdateInstantiateConfig {
        return o && (o.$typeUrl === MsgUpdateInstantiateConfig.typeUrl || typeof o.sender === "string" && typeof o.codeId === "bigint");
    },
    isSDK(o: any): o is MsgUpdateInstantiateConfigSDKType {
        return o && (o.$typeUrl === MsgUpdateInstantiateConfig.typeUrl || typeof o.sender === "string" && typeof o.code_id === "bigint");
    },
    isAmino(o: any): o is MsgUpdateInstantiateConfigAmino {
        return o && (o.$typeUrl === MsgUpdateInstantiateConfig.typeUrl || typeof o.sender === "string" && typeof o.code_id === "bigint");
    },
    encode(message: MsgUpdateInstantiateConfig, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        if (message.sender !== "") {
            writer.uint32(10).string(message.sender);
        }
        if (message.codeId !== BigInt(0)) {
            writer.uint32(16).uint64(message.codeId);
        }
        if (message.newInstantiatePermission !== undefined) {
            AccessConfig.encode(message.newInstantiatePermission, writer.uint32(26).fork()).ldelim();
        }
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): MsgUpdateInstantiateConfig {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgUpdateInstantiateConfig();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.sender = reader.string();
                    break;
                case 2:
                    message.codeId = reader.uint64();
                    break;
                case 3:
                    message.newInstantiatePermission = AccessConfig.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromPartial(object: Partial<MsgUpdateInstantiateConfig>): MsgUpdateInstantiateConfig {
        const message = createBaseMsgUpdateInstantiateConfig();
        message.sender = object.sender ?? "";
        message.codeId = object.codeId !== undefined && object.codeId !== null ? BigInt(object.codeId.toString()) : BigInt(0);
        message.newInstantiatePermission = object.newInstantiatePermission !== undefined && object.newInstantiatePermission !== null ? AccessConfig.fromPartial(object.newInstantiatePermission) : undefined;
        return message;
    },
    fromAmino(object: MsgUpdateInstantiateConfigAmino): MsgUpdateInstantiateConfig {
        const message = createBaseMsgUpdateInstantiateConfig();
        if (object.sender !== undefined && object.sender !== null) {
            message.sender = object.sender;
        }
        if (object.code_id !== undefined && object.code_id !== null) {
            message.codeId = BigInt(object.code_id);
        }
        if (object.new_instantiate_permission !== undefined && object.new_instantiate_permission !== null) {
            message.newInstantiatePermission = AccessConfig.fromAmino(object.new_instantiate_permission);
        }
        return message;
    },
    toAmino(message: MsgUpdateInstantiateConfig): MsgUpdateInstantiateConfigAmino {
        const obj: any = {};
        obj.sender = message.sender === "" ? undefined : message.sender;
        obj.code_id = message.codeId !== BigInt(0) ? message.codeId.toString() : undefined;
        obj.new_instantiate_permission = message.newInstantiatePermission ? AccessConfig.toAmino(message.newInstantiatePermission) : undefined;
        return obj;
    },
    fromAminoMsg(object: MsgUpdateInstantiateConfigAminoMsg): MsgUpdateInstantiateConfig {
        return MsgUpdateInstantiateConfig.fromAmino(object.value);
    },
    toAminoMsg(message: MsgUpdateInstantiateConfig): MsgUpdateInstantiateConfigAminoMsg {
        return {
            type: "wasm/MsgUpdateInstantiateConfig",
            value: MsgUpdateInstantiateConfig.toAmino(message)
        };
    },
    fromProtoMsg(message: MsgUpdateInstantiateConfigProtoMsg): MsgUpdateInstantiateConfig {
        return MsgUpdateInstantiateConfig.decode(message.value);
    },
    toProto(message: MsgUpdateInstantiateConfig): Uint8Array {
        return MsgUpdateInstantiateConfig.encode(message).finish();
    },
    toProtoMsg(message: MsgUpdateInstantiateConfig): MsgUpdateInstantiateConfigProtoMsg {
        return {
            typeUrl: "/cosmwasm.wasm.v1.MsgUpdateInstantiateConfig",
            value: MsgUpdateInstantiateConfig.encode(message).finish()
        };
    }
};
function createBaseMsgUpdateInstantiateConfigResponse(): MsgUpdateInstantiateConfigResponse {
    return {};
}
export const MsgUpdateInstantiateConfigResponse = {
    typeUrl: "/cosmwasm.wasm.v1.MsgUpdateInstantiateConfigResponse",
    aminoType: "wasm/MsgUpdateInstantiateConfigResponse",
    is(o: any): o is MsgUpdateInstantiateConfigResponse {
        return o && o.$typeUrl === MsgUpdateInstantiateConfigResponse.typeUrl;
    },
    isSDK(o: any): o is MsgUpdateInstantiateConfigResponseSDKType {
        return o && o.$typeUrl === MsgUpdateInstantiateConfigResponse.typeUrl;
    },
    isAmino(o: any): o is MsgUpdateInstantiateConfigResponseAmino {
        return o && o.$typeUrl === MsgUpdateInstantiateConfigResponse.typeUrl;
    },
    encode(_: MsgUpdateInstantiateConfigResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): MsgUpdateInstantiateConfigResponse {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgUpdateInstantiateConfigResponse();
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
    fromPartial(_: Partial<MsgUpdateInstantiateConfigResponse>): MsgUpdateInstantiateConfigResponse {
        const message = createBaseMsgUpdateInstantiateConfigResponse();
        return message;
    },
    fromAmino(_: MsgUpdateInstantiateConfigResponseAmino): MsgUpdateInstantiateConfigResponse {
        const message = createBaseMsgUpdateInstantiateConfigResponse();
        return message;
    },
    toAmino(_: MsgUpdateInstantiateConfigResponse): MsgUpdateInstantiateConfigResponseAmino {
        const obj: any = {};
        return obj;
    },
    fromAminoMsg(object: MsgUpdateInstantiateConfigResponseAminoMsg): MsgUpdateInstantiateConfigResponse {
        return MsgUpdateInstantiateConfigResponse.fromAmino(object.value);
    },
    toAminoMsg(message: MsgUpdateInstantiateConfigResponse): MsgUpdateInstantiateConfigResponseAminoMsg {
        return {
            type: "wasm/MsgUpdateInstantiateConfigResponse",
            value: MsgUpdateInstantiateConfigResponse.toAmino(message)
        };
    },
    fromProtoMsg(message: MsgUpdateInstantiateConfigResponseProtoMsg): MsgUpdateInstantiateConfigResponse {
        return MsgUpdateInstantiateConfigResponse.decode(message.value);
    },
    toProto(message: MsgUpdateInstantiateConfigResponse): Uint8Array {
        return MsgUpdateInstantiateConfigResponse.encode(message).finish();
    },
    toProtoMsg(message: MsgUpdateInstantiateConfigResponse): MsgUpdateInstantiateConfigResponseProtoMsg {
        return {
            typeUrl: "/cosmwasm.wasm.v1.MsgUpdateInstantiateConfigResponse",
            value: MsgUpdateInstantiateConfigResponse.encode(message).finish()
        };
    }
};
function createBaseMsgUpdateParams(): MsgUpdateParams {
    return {
        authority: "",
        params: Params.fromPartial({})
    };
}
export const MsgUpdateParams = {
    typeUrl: "/cosmwasm.wasm.v1.MsgUpdateParams",
    aminoType: "wasm/MsgUpdateParams",
    is(o: any): o is MsgUpdateParams {
        return o && (o.$typeUrl === MsgUpdateParams.typeUrl || typeof o.authority === "string" && Params.is(o.params));
    },
    isSDK(o: any): o is MsgUpdateParamsSDKType {
        return o && (o.$typeUrl === MsgUpdateParams.typeUrl || typeof o.authority === "string" && Params.isSDK(o.params));
    },
    isAmino(o: any): o is MsgUpdateParamsAmino {
        return o && (o.$typeUrl === MsgUpdateParams.typeUrl || typeof o.authority === "string" && Params.isAmino(o.params));
    },
    encode(message: MsgUpdateParams, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        if (message.authority !== "") {
            writer.uint32(10).string(message.authority);
        }
        if (message.params !== undefined) {
            Params.encode(message.params, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): MsgUpdateParams {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgUpdateParams();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.authority = reader.string();
                    break;
                case 2:
                    message.params = Params.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromPartial(object: Partial<MsgUpdateParams>): MsgUpdateParams {
        const message = createBaseMsgUpdateParams();
        message.authority = object.authority ?? "";
        message.params = object.params !== undefined && object.params !== null ? Params.fromPartial(object.params) : undefined;
        return message;
    },
    fromAmino(object: MsgUpdateParamsAmino): MsgUpdateParams {
        const message = createBaseMsgUpdateParams();
        if (object.authority !== undefined && object.authority !== null) {
            message.authority = object.authority;
        }
        if (object.params !== undefined && object.params !== null) {
            message.params = Params.fromAmino(object.params);
        }
        return message;
    },
    toAmino(message: MsgUpdateParams): MsgUpdateParamsAmino {
        const obj: any = {};
        obj.authority = message.authority === "" ? undefined : message.authority;
        obj.params = message.params ? Params.toAmino(message.params) : Params.toAmino(Params.fromPartial({}));
        return obj;
    },
    fromAminoMsg(object: MsgUpdateParamsAminoMsg): MsgUpdateParams {
        return MsgUpdateParams.fromAmino(object.value);
    },
    toAminoMsg(message: MsgUpdateParams): MsgUpdateParamsAminoMsg {
        return {
            type: "wasm/MsgUpdateParams",
            value: MsgUpdateParams.toAmino(message)
        };
    },
    fromProtoMsg(message: MsgUpdateParamsProtoMsg): MsgUpdateParams {
        return MsgUpdateParams.decode(message.value);
    },
    toProto(message: MsgUpdateParams): Uint8Array {
        return MsgUpdateParams.encode(message).finish();
    },
    toProtoMsg(message: MsgUpdateParams): MsgUpdateParamsProtoMsg {
        return {
            typeUrl: "/cosmwasm.wasm.v1.MsgUpdateParams",
            value: MsgUpdateParams.encode(message).finish()
        };
    }
};
function createBaseMsgUpdateParamsResponse(): MsgUpdateParamsResponse {
    return {};
}
export const MsgUpdateParamsResponse = {
    typeUrl: "/cosmwasm.wasm.v1.MsgUpdateParamsResponse",
    aminoType: "wasm/MsgUpdateParamsResponse",
    is(o: any): o is MsgUpdateParamsResponse {
        return o && o.$typeUrl === MsgUpdateParamsResponse.typeUrl;
    },
    isSDK(o: any): o is MsgUpdateParamsResponseSDKType {
        return o && o.$typeUrl === MsgUpdateParamsResponse.typeUrl;
    },
    isAmino(o: any): o is MsgUpdateParamsResponseAmino {
        return o && o.$typeUrl === MsgUpdateParamsResponse.typeUrl;
    },
    encode(_: MsgUpdateParamsResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): MsgUpdateParamsResponse {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgUpdateParamsResponse();
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
    fromPartial(_: Partial<MsgUpdateParamsResponse>): MsgUpdateParamsResponse {
        const message = createBaseMsgUpdateParamsResponse();
        return message;
    },
    fromAmino(_: MsgUpdateParamsResponseAmino): MsgUpdateParamsResponse {
        const message = createBaseMsgUpdateParamsResponse();
        return message;
    },
    toAmino(_: MsgUpdateParamsResponse): MsgUpdateParamsResponseAmino {
        const obj: any = {};
        return obj;
    },
    fromAminoMsg(object: MsgUpdateParamsResponseAminoMsg): MsgUpdateParamsResponse {
        return MsgUpdateParamsResponse.fromAmino(object.value);
    },
    toAminoMsg(message: MsgUpdateParamsResponse): MsgUpdateParamsResponseAminoMsg {
        return {
            type: "wasm/MsgUpdateParamsResponse",
            value: MsgUpdateParamsResponse.toAmino(message)
        };
    },
    fromProtoMsg(message: MsgUpdateParamsResponseProtoMsg): MsgUpdateParamsResponse {
        return MsgUpdateParamsResponse.decode(message.value);
    },
    toProto(message: MsgUpdateParamsResponse): Uint8Array {
        return MsgUpdateParamsResponse.encode(message).finish();
    },
    toProtoMsg(message: MsgUpdateParamsResponse): MsgUpdateParamsResponseProtoMsg {
        return {
            typeUrl: "/cosmwasm.wasm.v1.MsgUpdateParamsResponse",
            value: MsgUpdateParamsResponse.encode(message).finish()
        };
    }
};
function createBaseMsgSudoContract(): MsgSudoContract {
    return {
        authority: "",
        contract: "",
        msg: new Uint8Array()
    };
}
export const MsgSudoContract = {
    typeUrl: "/cosmwasm.wasm.v1.MsgSudoContract",
    aminoType: "wasm/MsgSudoContract",
    is(o: any): o is MsgSudoContract {
        return o && (o.$typeUrl === MsgSudoContract.typeUrl || typeof o.authority === "string" && typeof o.contract === "string" && (o.msg instanceof Uint8Array || typeof o.msg === "string"));
    },
    isSDK(o: any): o is MsgSudoContractSDKType {
        return o && (o.$typeUrl === MsgSudoContract.typeUrl || typeof o.authority === "string" && typeof o.contract === "string" && (o.msg instanceof Uint8Array || typeof o.msg === "string"));
    },
    isAmino(o: any): o is MsgSudoContractAmino {
        return o && (o.$typeUrl === MsgSudoContract.typeUrl || typeof o.authority === "string" && typeof o.contract === "string" && (o.msg instanceof Uint8Array || typeof o.msg === "string"));
    },
    encode(message: MsgSudoContract, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        if (message.authority !== "") {
            writer.uint32(10).string(message.authority);
        }
        if (message.contract !== "") {
            writer.uint32(18).string(message.contract);
        }
        if (message.msg.length !== 0) {
            writer.uint32(26).bytes(message.msg);
        }
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): MsgSudoContract {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgSudoContract();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.authority = reader.string();
                    break;
                case 2:
                    message.contract = reader.string();
                    break;
                case 3:
                    message.msg = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromPartial(object: Partial<MsgSudoContract>): MsgSudoContract {
        const message = createBaseMsgSudoContract();
        message.authority = object.authority ?? "";
        message.contract = object.contract ?? "";
        message.msg = object.msg ?? new Uint8Array();
        return message;
    },
    fromAmino(object: MsgSudoContractAmino): MsgSudoContract {
        const message = createBaseMsgSudoContract();
        if (object.authority !== undefined && object.authority !== null) {
            message.authority = object.authority;
        }
        if (object.contract !== undefined && object.contract !== null) {
            message.contract = object.contract;
        }
        if (object.msg !== undefined && object.msg !== null) {
            message.msg = toUtf8(JSON.stringify(object.msg));
        }
        return message;
    },
    toAmino(message: MsgSudoContract): MsgSudoContractAmino {
        const obj: any = {};
        obj.authority = message.authority === "" ? undefined : message.authority;
        obj.contract = message.contract === "" ? undefined : message.contract;
        obj.msg = message.msg ? JSON.parse(fromUtf8(message.msg)) : undefined;
        return obj;
    },
    fromAminoMsg(object: MsgSudoContractAminoMsg): MsgSudoContract {
        return MsgSudoContract.fromAmino(object.value);
    },
    toAminoMsg(message: MsgSudoContract): MsgSudoContractAminoMsg {
        return {
            type: "wasm/MsgSudoContract",
            value: MsgSudoContract.toAmino(message)
        };
    },
    fromProtoMsg(message: MsgSudoContractProtoMsg): MsgSudoContract {
        return MsgSudoContract.decode(message.value);
    },
    toProto(message: MsgSudoContract): Uint8Array {
        return MsgSudoContract.encode(message).finish();
    },
    toProtoMsg(message: MsgSudoContract): MsgSudoContractProtoMsg {
        return {
            typeUrl: "/cosmwasm.wasm.v1.MsgSudoContract",
            value: MsgSudoContract.encode(message).finish()
        };
    }
};
function createBaseMsgSudoContractResponse(): MsgSudoContractResponse {
    return {
        data: new Uint8Array()
    };
}
export const MsgSudoContractResponse = {
    typeUrl: "/cosmwasm.wasm.v1.MsgSudoContractResponse",
    aminoType: "wasm/MsgSudoContractResponse",
    is(o: any): o is MsgSudoContractResponse {
        return o && (o.$typeUrl === MsgSudoContractResponse.typeUrl || o.data instanceof Uint8Array || typeof o.data === "string");
    },
    isSDK(o: any): o is MsgSudoContractResponseSDKType {
        return o && (o.$typeUrl === MsgSudoContractResponse.typeUrl || o.data instanceof Uint8Array || typeof o.data === "string");
    },
    isAmino(o: any): o is MsgSudoContractResponseAmino {
        return o && (o.$typeUrl === MsgSudoContractResponse.typeUrl || o.data instanceof Uint8Array || typeof o.data === "string");
    },
    encode(message: MsgSudoContractResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        if (message.data.length !== 0) {
            writer.uint32(10).bytes(message.data);
        }
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): MsgSudoContractResponse {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgSudoContractResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.data = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromPartial(object: Partial<MsgSudoContractResponse>): MsgSudoContractResponse {
        const message = createBaseMsgSudoContractResponse();
        message.data = object.data ?? new Uint8Array();
        return message;
    },
    fromAmino(object: MsgSudoContractResponseAmino): MsgSudoContractResponse {
        const message = createBaseMsgSudoContractResponse();
        if (object.data !== undefined && object.data !== null) {
            message.data = bytesFromBase64(object.data);
        }
        return message;
    },
    toAmino(message: MsgSudoContractResponse): MsgSudoContractResponseAmino {
        const obj: any = {};
        obj.data = message.data ? base64FromBytes(message.data) : undefined;
        return obj;
    },
    fromAminoMsg(object: MsgSudoContractResponseAminoMsg): MsgSudoContractResponse {
        return MsgSudoContractResponse.fromAmino(object.value);
    },
    toAminoMsg(message: MsgSudoContractResponse): MsgSudoContractResponseAminoMsg {
        return {
            type: "wasm/MsgSudoContractResponse",
            value: MsgSudoContractResponse.toAmino(message)
        };
    },
    fromProtoMsg(message: MsgSudoContractResponseProtoMsg): MsgSudoContractResponse {
        return MsgSudoContractResponse.decode(message.value);
    },
    toProto(message: MsgSudoContractResponse): Uint8Array {
        return MsgSudoContractResponse.encode(message).finish();
    },
    toProtoMsg(message: MsgSudoContractResponse): MsgSudoContractResponseProtoMsg {
        return {
            typeUrl: "/cosmwasm.wasm.v1.MsgSudoContractResponse",
            value: MsgSudoContractResponse.encode(message).finish()
        };
    }
};
function createBaseMsgPinCodes(): MsgPinCodes {
    return {
        authority: "",
        codeIds: []
    };
}
export const MsgPinCodes = {
    typeUrl: "/cosmwasm.wasm.v1.MsgPinCodes",
    aminoType: "wasm/MsgPinCodes",
    is(o: any): o is MsgPinCodes {
        return o && (o.$typeUrl === MsgPinCodes.typeUrl || typeof o.authority === "string" && Array.isArray(o.codeIds) && (!o.codeIds.length || typeof o.codeIds[0] === "bigint"));
    },
    isSDK(o: any): o is MsgPinCodesSDKType {
        return o && (o.$typeUrl === MsgPinCodes.typeUrl || typeof o.authority === "string" && Array.isArray(o.code_ids) && (!o.code_ids.length || typeof o.code_ids[0] === "bigint"));
    },
    isAmino(o: any): o is MsgPinCodesAmino {
        return o && (o.$typeUrl === MsgPinCodes.typeUrl || typeof o.authority === "string" && Array.isArray(o.code_ids) && (!o.code_ids.length || typeof o.code_ids[0] === "bigint"));
    },
    encode(message: MsgPinCodes, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        if (message.authority !== "") {
            writer.uint32(10).string(message.authority);
        }
        writer.uint32(18).fork();
        for (const v of message.codeIds) {
            writer.uint64(v);
        }
        writer.ldelim();
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): MsgPinCodes {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgPinCodes();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.authority = reader.string();
                    break;
                case 2:
                    if ((tag & 7) === 2) {
                        const end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2) {
                            message.codeIds.push(reader.uint64());
                        }
                    } else {
                        message.codeIds.push(reader.uint64());
                    }
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromPartial(object: Partial<MsgPinCodes>): MsgPinCodes {
        const message = createBaseMsgPinCodes();
        message.authority = object.authority ?? "";
        message.codeIds = object.codeIds?.map(e => BigInt(e.toString())) || [];
        return message;
    },
    fromAmino(object: MsgPinCodesAmino): MsgPinCodes {
        const message = createBaseMsgPinCodes();
        if (object.authority !== undefined && object.authority !== null) {
            message.authority = object.authority;
        }
        message.codeIds = object.code_ids?.map(e => BigInt(e)) || [];
        return message;
    },
    toAmino(message: MsgPinCodes): MsgPinCodesAmino {
        const obj: any = {};
        obj.authority = message.authority === "" ? undefined : message.authority;
        if (message.codeIds) {
            obj.code_ids = message.codeIds.map(e => e.toString());
        } else {
            obj.code_ids = message.codeIds;
        }
        return obj;
    },
    fromAminoMsg(object: MsgPinCodesAminoMsg): MsgPinCodes {
        return MsgPinCodes.fromAmino(object.value);
    },
    toAminoMsg(message: MsgPinCodes): MsgPinCodesAminoMsg {
        return {
            type: "wasm/MsgPinCodes",
            value: MsgPinCodes.toAmino(message)
        };
    },
    fromProtoMsg(message: MsgPinCodesProtoMsg): MsgPinCodes {
        return MsgPinCodes.decode(message.value);
    },
    toProto(message: MsgPinCodes): Uint8Array {
        return MsgPinCodes.encode(message).finish();
    },
    toProtoMsg(message: MsgPinCodes): MsgPinCodesProtoMsg {
        return {
            typeUrl: "/cosmwasm.wasm.v1.MsgPinCodes",
            value: MsgPinCodes.encode(message).finish()
        };
    }
};
function createBaseMsgPinCodesResponse(): MsgPinCodesResponse {
    return {};
}
export const MsgPinCodesResponse = {
    typeUrl: "/cosmwasm.wasm.v1.MsgPinCodesResponse",
    aminoType: "wasm/MsgPinCodesResponse",
    is(o: any): o is MsgPinCodesResponse {
        return o && o.$typeUrl === MsgPinCodesResponse.typeUrl;
    },
    isSDK(o: any): o is MsgPinCodesResponseSDKType {
        return o && o.$typeUrl === MsgPinCodesResponse.typeUrl;
    },
    isAmino(o: any): o is MsgPinCodesResponseAmino {
        return o && o.$typeUrl === MsgPinCodesResponse.typeUrl;
    },
    encode(_: MsgPinCodesResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): MsgPinCodesResponse {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgPinCodesResponse();
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
    fromPartial(_: Partial<MsgPinCodesResponse>): MsgPinCodesResponse {
        const message = createBaseMsgPinCodesResponse();
        return message;
    },
    fromAmino(_: MsgPinCodesResponseAmino): MsgPinCodesResponse {
        const message = createBaseMsgPinCodesResponse();
        return message;
    },
    toAmino(_: MsgPinCodesResponse): MsgPinCodesResponseAmino {
        const obj: any = {};
        return obj;
    },
    fromAminoMsg(object: MsgPinCodesResponseAminoMsg): MsgPinCodesResponse {
        return MsgPinCodesResponse.fromAmino(object.value);
    },
    toAminoMsg(message: MsgPinCodesResponse): MsgPinCodesResponseAminoMsg {
        return {
            type: "wasm/MsgPinCodesResponse",
            value: MsgPinCodesResponse.toAmino(message)
        };
    },
    fromProtoMsg(message: MsgPinCodesResponseProtoMsg): MsgPinCodesResponse {
        return MsgPinCodesResponse.decode(message.value);
    },
    toProto(message: MsgPinCodesResponse): Uint8Array {
        return MsgPinCodesResponse.encode(message).finish();
    },
    toProtoMsg(message: MsgPinCodesResponse): MsgPinCodesResponseProtoMsg {
        return {
            typeUrl: "/cosmwasm.wasm.v1.MsgPinCodesResponse",
            value: MsgPinCodesResponse.encode(message).finish()
        };
    }
};
function createBaseMsgUnpinCodes(): MsgUnpinCodes {
    return {
        authority: "",
        codeIds: []
    };
}
export const MsgUnpinCodes = {
    typeUrl: "/cosmwasm.wasm.v1.MsgUnpinCodes",
    aminoType: "wasm/MsgUnpinCodes",
    is(o: any): o is MsgUnpinCodes {
        return o && (o.$typeUrl === MsgUnpinCodes.typeUrl || typeof o.authority === "string" && Array.isArray(o.codeIds) && (!o.codeIds.length || typeof o.codeIds[0] === "bigint"));
    },
    isSDK(o: any): o is MsgUnpinCodesSDKType {
        return o && (o.$typeUrl === MsgUnpinCodes.typeUrl || typeof o.authority === "string" && Array.isArray(o.code_ids) && (!o.code_ids.length || typeof o.code_ids[0] === "bigint"));
    },
    isAmino(o: any): o is MsgUnpinCodesAmino {
        return o && (o.$typeUrl === MsgUnpinCodes.typeUrl || typeof o.authority === "string" && Array.isArray(o.code_ids) && (!o.code_ids.length || typeof o.code_ids[0] === "bigint"));
    },
    encode(message: MsgUnpinCodes, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        if (message.authority !== "") {
            writer.uint32(10).string(message.authority);
        }
        writer.uint32(18).fork();
        for (const v of message.codeIds) {
            writer.uint64(v);
        }
        writer.ldelim();
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): MsgUnpinCodes {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgUnpinCodes();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.authority = reader.string();
                    break;
                case 2:
                    if ((tag & 7) === 2) {
                        const end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2) {
                            message.codeIds.push(reader.uint64());
                        }
                    } else {
                        message.codeIds.push(reader.uint64());
                    }
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromPartial(object: Partial<MsgUnpinCodes>): MsgUnpinCodes {
        const message = createBaseMsgUnpinCodes();
        message.authority = object.authority ?? "";
        message.codeIds = object.codeIds?.map(e => BigInt(e.toString())) || [];
        return message;
    },
    fromAmino(object: MsgUnpinCodesAmino): MsgUnpinCodes {
        const message = createBaseMsgUnpinCodes();
        if (object.authority !== undefined && object.authority !== null) {
            message.authority = object.authority;
        }
        message.codeIds = object.code_ids?.map(e => BigInt(e)) || [];
        return message;
    },
    toAmino(message: MsgUnpinCodes): MsgUnpinCodesAmino {
        const obj: any = {};
        obj.authority = message.authority === "" ? undefined : message.authority;
        if (message.codeIds) {
            obj.code_ids = message.codeIds.map(e => e.toString());
        } else {
            obj.code_ids = message.codeIds;
        }
        return obj;
    },
    fromAminoMsg(object: MsgUnpinCodesAminoMsg): MsgUnpinCodes {
        return MsgUnpinCodes.fromAmino(object.value);
    },
    toAminoMsg(message: MsgUnpinCodes): MsgUnpinCodesAminoMsg {
        return {
            type: "wasm/MsgUnpinCodes",
            value: MsgUnpinCodes.toAmino(message)
        };
    },
    fromProtoMsg(message: MsgUnpinCodesProtoMsg): MsgUnpinCodes {
        return MsgUnpinCodes.decode(message.value);
    },
    toProto(message: MsgUnpinCodes): Uint8Array {
        return MsgUnpinCodes.encode(message).finish();
    },
    toProtoMsg(message: MsgUnpinCodes): MsgUnpinCodesProtoMsg {
        return {
            typeUrl: "/cosmwasm.wasm.v1.MsgUnpinCodes",
            value: MsgUnpinCodes.encode(message).finish()
        };
    }
};
function createBaseMsgUnpinCodesResponse(): MsgUnpinCodesResponse {
    return {};
}
export const MsgUnpinCodesResponse = {
    typeUrl: "/cosmwasm.wasm.v1.MsgUnpinCodesResponse",
    aminoType: "wasm/MsgUnpinCodesResponse",
    is(o: any): o is MsgUnpinCodesResponse {
        return o && o.$typeUrl === MsgUnpinCodesResponse.typeUrl;
    },
    isSDK(o: any): o is MsgUnpinCodesResponseSDKType {
        return o && o.$typeUrl === MsgUnpinCodesResponse.typeUrl;
    },
    isAmino(o: any): o is MsgUnpinCodesResponseAmino {
        return o && o.$typeUrl === MsgUnpinCodesResponse.typeUrl;
    },
    encode(_: MsgUnpinCodesResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): MsgUnpinCodesResponse {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgUnpinCodesResponse();
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
    fromPartial(_: Partial<MsgUnpinCodesResponse>): MsgUnpinCodesResponse {
        const message = createBaseMsgUnpinCodesResponse();
        return message;
    },
    fromAmino(_: MsgUnpinCodesResponseAmino): MsgUnpinCodesResponse {
        const message = createBaseMsgUnpinCodesResponse();
        return message;
    },
    toAmino(_: MsgUnpinCodesResponse): MsgUnpinCodesResponseAmino {
        const obj: any = {};
        return obj;
    },
    fromAminoMsg(object: MsgUnpinCodesResponseAminoMsg): MsgUnpinCodesResponse {
        return MsgUnpinCodesResponse.fromAmino(object.value);
    },
    toAminoMsg(message: MsgUnpinCodesResponse): MsgUnpinCodesResponseAminoMsg {
        return {
            type: "wasm/MsgUnpinCodesResponse",
            value: MsgUnpinCodesResponse.toAmino(message)
        };
    },
    fromProtoMsg(message: MsgUnpinCodesResponseProtoMsg): MsgUnpinCodesResponse {
        return MsgUnpinCodesResponse.decode(message.value);
    },
    toProto(message: MsgUnpinCodesResponse): Uint8Array {
        return MsgUnpinCodesResponse.encode(message).finish();
    },
    toProtoMsg(message: MsgUnpinCodesResponse): MsgUnpinCodesResponseProtoMsg {
        return {
            typeUrl: "/cosmwasm.wasm.v1.MsgUnpinCodesResponse",
            value: MsgUnpinCodesResponse.encode(message).finish()
        };
    }
};
function createBaseMsgStoreAndInstantiateContract(): MsgStoreAndInstantiateContract {
    return {
        authority: "",
        wasmByteCode: new Uint8Array(),
        instantiatePermission: undefined,
        unpinCode: false,
        admin: "",
        label: "",
        msg: new Uint8Array(),
        funds: [],
        source: "",
        builder: "",
        codeHash: new Uint8Array()
    };
}
export const MsgStoreAndInstantiateContract = {
    typeUrl: "/cosmwasm.wasm.v1.MsgStoreAndInstantiateContract",
    aminoType: "wasm/MsgStoreAndInstantiateContract",
    is(o: any): o is MsgStoreAndInstantiateContract {
        return o && (o.$typeUrl === MsgStoreAndInstantiateContract.typeUrl || typeof o.authority === "string" && (o.wasmByteCode instanceof Uint8Array || typeof o.wasmByteCode === "string") && typeof o.unpinCode === "boolean" && typeof o.admin === "string" && typeof o.label === "string" && (o.msg instanceof Uint8Array || typeof o.msg === "string") && Array.isArray(o.funds) && (!o.funds.length || Coin.is(o.funds[0])) && typeof o.source === "string" && typeof o.builder === "string" && (o.codeHash instanceof Uint8Array || typeof o.codeHash === "string"));
    },
    isSDK(o: any): o is MsgStoreAndInstantiateContractSDKType {
        return o && (o.$typeUrl === MsgStoreAndInstantiateContract.typeUrl || typeof o.authority === "string" && (o.wasm_byte_code instanceof Uint8Array || typeof o.wasm_byte_code === "string") && typeof o.unpin_code === "boolean" && typeof o.admin === "string" && typeof o.label === "string" && (o.msg instanceof Uint8Array || typeof o.msg === "string") && Array.isArray(o.funds) && (!o.funds.length || Coin.isSDK(o.funds[0])) && typeof o.source === "string" && typeof o.builder === "string" && (o.code_hash instanceof Uint8Array || typeof o.code_hash === "string"));
    },
    isAmino(o: any): o is MsgStoreAndInstantiateContractAmino {
        return o && (o.$typeUrl === MsgStoreAndInstantiateContract.typeUrl || typeof o.authority === "string" && (o.wasm_byte_code instanceof Uint8Array || typeof o.wasm_byte_code === "string") && typeof o.unpin_code === "boolean" && typeof o.admin === "string" && typeof o.label === "string" && (o.msg instanceof Uint8Array || typeof o.msg === "string") && Array.isArray(o.funds) && (!o.funds.length || Coin.isAmino(o.funds[0])) && typeof o.source === "string" && typeof o.builder === "string" && (o.code_hash instanceof Uint8Array || typeof o.code_hash === "string"));
    },
    encode(message: MsgStoreAndInstantiateContract, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        if (message.authority !== "") {
            writer.uint32(10).string(message.authority);
        }
        if (message.wasmByteCode.length !== 0) {
            writer.uint32(26).bytes(message.wasmByteCode);
        }
        if (message.instantiatePermission !== undefined) {
            AccessConfig.encode(message.instantiatePermission, writer.uint32(34).fork()).ldelim();
        }
        if (message.unpinCode === true) {
            writer.uint32(40).bool(message.unpinCode);
        }
        if (message.admin !== "") {
            writer.uint32(50).string(message.admin);
        }
        if (message.label !== "") {
            writer.uint32(58).string(message.label);
        }
        if (message.msg.length !== 0) {
            writer.uint32(66).bytes(message.msg);
        }
        for (const v of message.funds) {
            Coin.encode(v!, writer.uint32(74).fork()).ldelim();
        }
        if (message.source !== "") {
            writer.uint32(82).string(message.source);
        }
        if (message.builder !== "") {
            writer.uint32(90).string(message.builder);
        }
        if (message.codeHash.length !== 0) {
            writer.uint32(98).bytes(message.codeHash);
        }
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): MsgStoreAndInstantiateContract {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgStoreAndInstantiateContract();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.authority = reader.string();
                    break;
                case 3:
                    message.wasmByteCode = reader.bytes();
                    break;
                case 4:
                    message.instantiatePermission = AccessConfig.decode(reader, reader.uint32());
                    break;
                case 5:
                    message.unpinCode = reader.bool();
                    break;
                case 6:
                    message.admin = reader.string();
                    break;
                case 7:
                    message.label = reader.string();
                    break;
                case 8:
                    message.msg = reader.bytes();
                    break;
                case 9:
                    message.funds.push(Coin.decode(reader, reader.uint32()));
                    break;
                case 10:
                    message.source = reader.string();
                    break;
                case 11:
                    message.builder = reader.string();
                    break;
                case 12:
                    message.codeHash = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromPartial(object: Partial<MsgStoreAndInstantiateContract>): MsgStoreAndInstantiateContract {
        const message = createBaseMsgStoreAndInstantiateContract();
        message.authority = object.authority ?? "";
        message.wasmByteCode = object.wasmByteCode ?? new Uint8Array();
        message.instantiatePermission = object.instantiatePermission !== undefined && object.instantiatePermission !== null ? AccessConfig.fromPartial(object.instantiatePermission) : undefined;
        message.unpinCode = object.unpinCode ?? false;
        message.admin = object.admin ?? "";
        message.label = object.label ?? "";
        message.msg = object.msg ?? new Uint8Array();
        message.funds = object.funds?.map(e => Coin.fromPartial(e)) || [];
        message.source = object.source ?? "";
        message.builder = object.builder ?? "";
        message.codeHash = object.codeHash ?? new Uint8Array();
        return message;
    },
    fromAmino(object: MsgStoreAndInstantiateContractAmino): MsgStoreAndInstantiateContract {
        const message = createBaseMsgStoreAndInstantiateContract();
        if (object.authority !== undefined && object.authority !== null) {
            message.authority = object.authority;
        }
        if (object.wasm_byte_code !== undefined && object.wasm_byte_code !== null) {
            message.wasmByteCode = fromBase64(object.wasm_byte_code);
        }
        if (object.instantiate_permission !== undefined && object.instantiate_permission !== null) {
            message.instantiatePermission = AccessConfig.fromAmino(object.instantiate_permission);
        }
        if (object.unpin_code !== undefined && object.unpin_code !== null) {
            message.unpinCode = object.unpin_code;
        }
        if (object.admin !== undefined && object.admin !== null) {
            message.admin = object.admin;
        }
        if (object.label !== undefined && object.label !== null) {
            message.label = object.label;
        }
        if (object.msg !== undefined && object.msg !== null) {
            message.msg = toUtf8(JSON.stringify(object.msg));
        }
        message.funds = object.funds?.map(e => Coin.fromAmino(e)) || [];
        if (object.source !== undefined && object.source !== null) {
            message.source = object.source;
        }
        if (object.builder !== undefined && object.builder !== null) {
            message.builder = object.builder;
        }
        if (object.code_hash !== undefined && object.code_hash !== null) {
            message.codeHash = bytesFromBase64(object.code_hash);
        }
        return message;
    },
    toAmino(message: MsgStoreAndInstantiateContract): MsgStoreAndInstantiateContractAmino {
        const obj: any = {};
        obj.authority = message.authority === "" ? undefined : message.authority;
        obj.wasm_byte_code = message.wasmByteCode ? toBase64(message.wasmByteCode) : undefined;
        obj.instantiate_permission = message.instantiatePermission ? AccessConfig.toAmino(message.instantiatePermission) : undefined;
        obj.unpin_code = message.unpinCode === false ? undefined : message.unpinCode;
        obj.admin = message.admin === "" ? undefined : message.admin;
        obj.label = message.label === "" ? undefined : message.label;
        obj.msg = message.msg ? JSON.parse(fromUtf8(message.msg)) : undefined;
        if (message.funds) {
            obj.funds = message.funds.map(e => e ? Coin.toAmino(e) : undefined);
        } else {
            obj.funds = message.funds;
        }
        obj.source = message.source === "" ? undefined : message.source;
        obj.builder = message.builder === "" ? undefined : message.builder;
        obj.code_hash = message.codeHash ? base64FromBytes(message.codeHash) : undefined;
        return obj;
    },
    fromAminoMsg(object: MsgStoreAndInstantiateContractAminoMsg): MsgStoreAndInstantiateContract {
        return MsgStoreAndInstantiateContract.fromAmino(object.value);
    },
    toAminoMsg(message: MsgStoreAndInstantiateContract): MsgStoreAndInstantiateContractAminoMsg {
        return {
            type: "wasm/MsgStoreAndInstantiateContract",
            value: MsgStoreAndInstantiateContract.toAmino(message)
        };
    },
    fromProtoMsg(message: MsgStoreAndInstantiateContractProtoMsg): MsgStoreAndInstantiateContract {
        return MsgStoreAndInstantiateContract.decode(message.value);
    },
    toProto(message: MsgStoreAndInstantiateContract): Uint8Array {
        return MsgStoreAndInstantiateContract.encode(message).finish();
    },
    toProtoMsg(message: MsgStoreAndInstantiateContract): MsgStoreAndInstantiateContractProtoMsg {
        return {
            typeUrl: "/cosmwasm.wasm.v1.MsgStoreAndInstantiateContract",
            value: MsgStoreAndInstantiateContract.encode(message).finish()
        };
    }
};
function createBaseMsgStoreAndInstantiateContractResponse(): MsgStoreAndInstantiateContractResponse {
    return {
        address: "",
        data: new Uint8Array()
    };
}
export const MsgStoreAndInstantiateContractResponse = {
    typeUrl: "/cosmwasm.wasm.v1.MsgStoreAndInstantiateContractResponse",
    aminoType: "wasm/MsgStoreAndInstantiateContractResponse",
    is(o: any): o is MsgStoreAndInstantiateContractResponse {
        return o && (o.$typeUrl === MsgStoreAndInstantiateContractResponse.typeUrl || typeof o.address === "string" && (o.data instanceof Uint8Array || typeof o.data === "string"));
    },
    isSDK(o: any): o is MsgStoreAndInstantiateContractResponseSDKType {
        return o && (o.$typeUrl === MsgStoreAndInstantiateContractResponse.typeUrl || typeof o.address === "string" && (o.data instanceof Uint8Array || typeof o.data === "string"));
    },
    isAmino(o: any): o is MsgStoreAndInstantiateContractResponseAmino {
        return o && (o.$typeUrl === MsgStoreAndInstantiateContractResponse.typeUrl || typeof o.address === "string" && (o.data instanceof Uint8Array || typeof o.data === "string"));
    },
    encode(message: MsgStoreAndInstantiateContractResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        if (message.address !== "") {
            writer.uint32(10).string(message.address);
        }
        if (message.data.length !== 0) {
            writer.uint32(18).bytes(message.data);
        }
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): MsgStoreAndInstantiateContractResponse {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgStoreAndInstantiateContractResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.address = reader.string();
                    break;
                case 2:
                    message.data = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromPartial(object: Partial<MsgStoreAndInstantiateContractResponse>): MsgStoreAndInstantiateContractResponse {
        const message = createBaseMsgStoreAndInstantiateContractResponse();
        message.address = object.address ?? "";
        message.data = object.data ?? new Uint8Array();
        return message;
    },
    fromAmino(object: MsgStoreAndInstantiateContractResponseAmino): MsgStoreAndInstantiateContractResponse {
        const message = createBaseMsgStoreAndInstantiateContractResponse();
        if (object.address !== undefined && object.address !== null) {
            message.address = object.address;
        }
        if (object.data !== undefined && object.data !== null) {
            message.data = bytesFromBase64(object.data);
        }
        return message;
    },
    toAmino(message: MsgStoreAndInstantiateContractResponse): MsgStoreAndInstantiateContractResponseAmino {
        const obj: any = {};
        obj.address = message.address === "" ? undefined : message.address;
        obj.data = message.data ? base64FromBytes(message.data) : undefined;
        return obj;
    },
    fromAminoMsg(object: MsgStoreAndInstantiateContractResponseAminoMsg): MsgStoreAndInstantiateContractResponse {
        return MsgStoreAndInstantiateContractResponse.fromAmino(object.value);
    },
    toAminoMsg(message: MsgStoreAndInstantiateContractResponse): MsgStoreAndInstantiateContractResponseAminoMsg {
        return {
            type: "wasm/MsgStoreAndInstantiateContractResponse",
            value: MsgStoreAndInstantiateContractResponse.toAmino(message)
        };
    },
    fromProtoMsg(message: MsgStoreAndInstantiateContractResponseProtoMsg): MsgStoreAndInstantiateContractResponse {
        return MsgStoreAndInstantiateContractResponse.decode(message.value);
    },
    toProto(message: MsgStoreAndInstantiateContractResponse): Uint8Array {
        return MsgStoreAndInstantiateContractResponse.encode(message).finish();
    },
    toProtoMsg(message: MsgStoreAndInstantiateContractResponse): MsgStoreAndInstantiateContractResponseProtoMsg {
        return {
            typeUrl: "/cosmwasm.wasm.v1.MsgStoreAndInstantiateContractResponse",
            value: MsgStoreAndInstantiateContractResponse.encode(message).finish()
        };
    }
};
function createBaseMsgAddCodeUploadParamsAddresses(): MsgAddCodeUploadParamsAddresses {
    return {
        authority: "",
        addresses: []
    };
}
export const MsgAddCodeUploadParamsAddresses = {
    typeUrl: "/cosmwasm.wasm.v1.MsgAddCodeUploadParamsAddresses",
    aminoType: "wasm/MsgAddCodeUploadParamsAddresses",
    is(o: any): o is MsgAddCodeUploadParamsAddresses {
        return o && (o.$typeUrl === MsgAddCodeUploadParamsAddresses.typeUrl || typeof o.authority === "string" && Array.isArray(o.addresses) && (!o.addresses.length || typeof o.addresses[0] === "string"));
    },
    isSDK(o: any): o is MsgAddCodeUploadParamsAddressesSDKType {
        return o && (o.$typeUrl === MsgAddCodeUploadParamsAddresses.typeUrl || typeof o.authority === "string" && Array.isArray(o.addresses) && (!o.addresses.length || typeof o.addresses[0] === "string"));
    },
    isAmino(o: any): o is MsgAddCodeUploadParamsAddressesAmino {
        return o && (o.$typeUrl === MsgAddCodeUploadParamsAddresses.typeUrl || typeof o.authority === "string" && Array.isArray(o.addresses) && (!o.addresses.length || typeof o.addresses[0] === "string"));
    },
    encode(message: MsgAddCodeUploadParamsAddresses, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        if (message.authority !== "") {
            writer.uint32(10).string(message.authority);
        }
        for (const v of message.addresses) {
            writer.uint32(18).string(v!);
        }
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): MsgAddCodeUploadParamsAddresses {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgAddCodeUploadParamsAddresses();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.authority = reader.string();
                    break;
                case 2:
                    message.addresses.push(reader.string());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromPartial(object: Partial<MsgAddCodeUploadParamsAddresses>): MsgAddCodeUploadParamsAddresses {
        const message = createBaseMsgAddCodeUploadParamsAddresses();
        message.authority = object.authority ?? "";
        message.addresses = object.addresses?.map(e => e) || [];
        return message;
    },
    fromAmino(object: MsgAddCodeUploadParamsAddressesAmino): MsgAddCodeUploadParamsAddresses {
        const message = createBaseMsgAddCodeUploadParamsAddresses();
        if (object.authority !== undefined && object.authority !== null) {
            message.authority = object.authority;
        }
        message.addresses = object.addresses?.map(e => e) || [];
        return message;
    },
    toAmino(message: MsgAddCodeUploadParamsAddresses): MsgAddCodeUploadParamsAddressesAmino {
        const obj: any = {};
        obj.authority = message.authority === "" ? undefined : message.authority;
        if (message.addresses) {
            obj.addresses = message.addresses.map(e => e);
        } else {
            obj.addresses = message.addresses;
        }
        return obj;
    },
    fromAminoMsg(object: MsgAddCodeUploadParamsAddressesAminoMsg): MsgAddCodeUploadParamsAddresses {
        return MsgAddCodeUploadParamsAddresses.fromAmino(object.value);
    },
    toAminoMsg(message: MsgAddCodeUploadParamsAddresses): MsgAddCodeUploadParamsAddressesAminoMsg {
        return {
            type: "wasm/MsgAddCodeUploadParamsAddresses",
            value: MsgAddCodeUploadParamsAddresses.toAmino(message)
        };
    },
    fromProtoMsg(message: MsgAddCodeUploadParamsAddressesProtoMsg): MsgAddCodeUploadParamsAddresses {
        return MsgAddCodeUploadParamsAddresses.decode(message.value);
    },
    toProto(message: MsgAddCodeUploadParamsAddresses): Uint8Array {
        return MsgAddCodeUploadParamsAddresses.encode(message).finish();
    },
    toProtoMsg(message: MsgAddCodeUploadParamsAddresses): MsgAddCodeUploadParamsAddressesProtoMsg {
        return {
            typeUrl: "/cosmwasm.wasm.v1.MsgAddCodeUploadParamsAddresses",
            value: MsgAddCodeUploadParamsAddresses.encode(message).finish()
        };
    }
};
function createBaseMsgAddCodeUploadParamsAddressesResponse(): MsgAddCodeUploadParamsAddressesResponse {
    return {};
}
export const MsgAddCodeUploadParamsAddressesResponse = {
    typeUrl: "/cosmwasm.wasm.v1.MsgAddCodeUploadParamsAddressesResponse",
    aminoType: "wasm/MsgAddCodeUploadParamsAddressesResponse",
    is(o: any): o is MsgAddCodeUploadParamsAddressesResponse {
        return o && o.$typeUrl === MsgAddCodeUploadParamsAddressesResponse.typeUrl;
    },
    isSDK(o: any): o is MsgAddCodeUploadParamsAddressesResponseSDKType {
        return o && o.$typeUrl === MsgAddCodeUploadParamsAddressesResponse.typeUrl;
    },
    isAmino(o: any): o is MsgAddCodeUploadParamsAddressesResponseAmino {
        return o && o.$typeUrl === MsgAddCodeUploadParamsAddressesResponse.typeUrl;
    },
    encode(_: MsgAddCodeUploadParamsAddressesResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): MsgAddCodeUploadParamsAddressesResponse {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgAddCodeUploadParamsAddressesResponse();
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
    fromPartial(_: Partial<MsgAddCodeUploadParamsAddressesResponse>): MsgAddCodeUploadParamsAddressesResponse {
        const message = createBaseMsgAddCodeUploadParamsAddressesResponse();
        return message;
    },
    fromAmino(_: MsgAddCodeUploadParamsAddressesResponseAmino): MsgAddCodeUploadParamsAddressesResponse {
        const message = createBaseMsgAddCodeUploadParamsAddressesResponse();
        return message;
    },
    toAmino(_: MsgAddCodeUploadParamsAddressesResponse): MsgAddCodeUploadParamsAddressesResponseAmino {
        const obj: any = {};
        return obj;
    },
    fromAminoMsg(object: MsgAddCodeUploadParamsAddressesResponseAminoMsg): MsgAddCodeUploadParamsAddressesResponse {
        return MsgAddCodeUploadParamsAddressesResponse.fromAmino(object.value);
    },
    toAminoMsg(message: MsgAddCodeUploadParamsAddressesResponse): MsgAddCodeUploadParamsAddressesResponseAminoMsg {
        return {
            type: "wasm/MsgAddCodeUploadParamsAddressesResponse",
            value: MsgAddCodeUploadParamsAddressesResponse.toAmino(message)
        };
    },
    fromProtoMsg(message: MsgAddCodeUploadParamsAddressesResponseProtoMsg): MsgAddCodeUploadParamsAddressesResponse {
        return MsgAddCodeUploadParamsAddressesResponse.decode(message.value);
    },
    toProto(message: MsgAddCodeUploadParamsAddressesResponse): Uint8Array {
        return MsgAddCodeUploadParamsAddressesResponse.encode(message).finish();
    },
    toProtoMsg(message: MsgAddCodeUploadParamsAddressesResponse): MsgAddCodeUploadParamsAddressesResponseProtoMsg {
        return {
            typeUrl: "/cosmwasm.wasm.v1.MsgAddCodeUploadParamsAddressesResponse",
            value: MsgAddCodeUploadParamsAddressesResponse.encode(message).finish()
        };
    }
};
function createBaseMsgRemoveCodeUploadParamsAddresses(): MsgRemoveCodeUploadParamsAddresses {
    return {
        authority: "",
        addresses: []
    };
}
export const MsgRemoveCodeUploadParamsAddresses = {
    typeUrl: "/cosmwasm.wasm.v1.MsgRemoveCodeUploadParamsAddresses",
    aminoType: "wasm/MsgRemoveCodeUploadParamsAddresses",
    is(o: any): o is MsgRemoveCodeUploadParamsAddresses {
        return o && (o.$typeUrl === MsgRemoveCodeUploadParamsAddresses.typeUrl || typeof o.authority === "string" && Array.isArray(o.addresses) && (!o.addresses.length || typeof o.addresses[0] === "string"));
    },
    isSDK(o: any): o is MsgRemoveCodeUploadParamsAddressesSDKType {
        return o && (o.$typeUrl === MsgRemoveCodeUploadParamsAddresses.typeUrl || typeof o.authority === "string" && Array.isArray(o.addresses) && (!o.addresses.length || typeof o.addresses[0] === "string"));
    },
    isAmino(o: any): o is MsgRemoveCodeUploadParamsAddressesAmino {
        return o && (o.$typeUrl === MsgRemoveCodeUploadParamsAddresses.typeUrl || typeof o.authority === "string" && Array.isArray(o.addresses) && (!o.addresses.length || typeof o.addresses[0] === "string"));
    },
    encode(message: MsgRemoveCodeUploadParamsAddresses, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        if (message.authority !== "") {
            writer.uint32(10).string(message.authority);
        }
        for (const v of message.addresses) {
            writer.uint32(18).string(v!);
        }
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): MsgRemoveCodeUploadParamsAddresses {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgRemoveCodeUploadParamsAddresses();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.authority = reader.string();
                    break;
                case 2:
                    message.addresses.push(reader.string());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromPartial(object: Partial<MsgRemoveCodeUploadParamsAddresses>): MsgRemoveCodeUploadParamsAddresses {
        const message = createBaseMsgRemoveCodeUploadParamsAddresses();
        message.authority = object.authority ?? "";
        message.addresses = object.addresses?.map(e => e) || [];
        return message;
    },
    fromAmino(object: MsgRemoveCodeUploadParamsAddressesAmino): MsgRemoveCodeUploadParamsAddresses {
        const message = createBaseMsgRemoveCodeUploadParamsAddresses();
        if (object.authority !== undefined && object.authority !== null) {
            message.authority = object.authority;
        }
        message.addresses = object.addresses?.map(e => e) || [];
        return message;
    },
    toAmino(message: MsgRemoveCodeUploadParamsAddresses): MsgRemoveCodeUploadParamsAddressesAmino {
        const obj: any = {};
        obj.authority = message.authority === "" ? undefined : message.authority;
        if (message.addresses) {
            obj.addresses = message.addresses.map(e => e);
        } else {
            obj.addresses = message.addresses;
        }
        return obj;
    },
    fromAminoMsg(object: MsgRemoveCodeUploadParamsAddressesAminoMsg): MsgRemoveCodeUploadParamsAddresses {
        return MsgRemoveCodeUploadParamsAddresses.fromAmino(object.value);
    },
    toAminoMsg(message: MsgRemoveCodeUploadParamsAddresses): MsgRemoveCodeUploadParamsAddressesAminoMsg {
        return {
            type: "wasm/MsgRemoveCodeUploadParamsAddresses",
            value: MsgRemoveCodeUploadParamsAddresses.toAmino(message)
        };
    },
    fromProtoMsg(message: MsgRemoveCodeUploadParamsAddressesProtoMsg): MsgRemoveCodeUploadParamsAddresses {
        return MsgRemoveCodeUploadParamsAddresses.decode(message.value);
    },
    toProto(message: MsgRemoveCodeUploadParamsAddresses): Uint8Array {
        return MsgRemoveCodeUploadParamsAddresses.encode(message).finish();
    },
    toProtoMsg(message: MsgRemoveCodeUploadParamsAddresses): MsgRemoveCodeUploadParamsAddressesProtoMsg {
        return {
            typeUrl: "/cosmwasm.wasm.v1.MsgRemoveCodeUploadParamsAddresses",
            value: MsgRemoveCodeUploadParamsAddresses.encode(message).finish()
        };
    }
};
function createBaseMsgRemoveCodeUploadParamsAddressesResponse(): MsgRemoveCodeUploadParamsAddressesResponse {
    return {};
}
export const MsgRemoveCodeUploadParamsAddressesResponse = {
    typeUrl: "/cosmwasm.wasm.v1.MsgRemoveCodeUploadParamsAddressesResponse",
    aminoType: "wasm/MsgRemoveCodeUploadParamsAddressesResponse",
    is(o: any): o is MsgRemoveCodeUploadParamsAddressesResponse {
        return o && o.$typeUrl === MsgRemoveCodeUploadParamsAddressesResponse.typeUrl;
    },
    isSDK(o: any): o is MsgRemoveCodeUploadParamsAddressesResponseSDKType {
        return o && o.$typeUrl === MsgRemoveCodeUploadParamsAddressesResponse.typeUrl;
    },
    isAmino(o: any): o is MsgRemoveCodeUploadParamsAddressesResponseAmino {
        return o && o.$typeUrl === MsgRemoveCodeUploadParamsAddressesResponse.typeUrl;
    },
    encode(_: MsgRemoveCodeUploadParamsAddressesResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): MsgRemoveCodeUploadParamsAddressesResponse {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgRemoveCodeUploadParamsAddressesResponse();
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
    fromPartial(_: Partial<MsgRemoveCodeUploadParamsAddressesResponse>): MsgRemoveCodeUploadParamsAddressesResponse {
        const message = createBaseMsgRemoveCodeUploadParamsAddressesResponse();
        return message;
    },
    fromAmino(_: MsgRemoveCodeUploadParamsAddressesResponseAmino): MsgRemoveCodeUploadParamsAddressesResponse {
        const message = createBaseMsgRemoveCodeUploadParamsAddressesResponse();
        return message;
    },
    toAmino(_: MsgRemoveCodeUploadParamsAddressesResponse): MsgRemoveCodeUploadParamsAddressesResponseAmino {
        const obj: any = {};
        return obj;
    },
    fromAminoMsg(object: MsgRemoveCodeUploadParamsAddressesResponseAminoMsg): MsgRemoveCodeUploadParamsAddressesResponse {
        return MsgRemoveCodeUploadParamsAddressesResponse.fromAmino(object.value);
    },
    toAminoMsg(message: MsgRemoveCodeUploadParamsAddressesResponse): MsgRemoveCodeUploadParamsAddressesResponseAminoMsg {
        return {
            type: "wasm/MsgRemoveCodeUploadParamsAddressesResponse",
            value: MsgRemoveCodeUploadParamsAddressesResponse.toAmino(message)
        };
    },
    fromProtoMsg(message: MsgRemoveCodeUploadParamsAddressesResponseProtoMsg): MsgRemoveCodeUploadParamsAddressesResponse {
        return MsgRemoveCodeUploadParamsAddressesResponse.decode(message.value);
    },
    toProto(message: MsgRemoveCodeUploadParamsAddressesResponse): Uint8Array {
        return MsgRemoveCodeUploadParamsAddressesResponse.encode(message).finish();
    },
    toProtoMsg(message: MsgRemoveCodeUploadParamsAddressesResponse): MsgRemoveCodeUploadParamsAddressesResponseProtoMsg {
        return {
            typeUrl: "/cosmwasm.wasm.v1.MsgRemoveCodeUploadParamsAddressesResponse",
            value: MsgRemoveCodeUploadParamsAddressesResponse.encode(message).finish()
        };
    }
};
function createBaseMsgStoreAndMigrateContract(): MsgStoreAndMigrateContract {
    return {
        authority: "",
        wasmByteCode: new Uint8Array(),
        instantiatePermission: undefined,
        contract: "",
        msg: new Uint8Array()
    };
}
export const MsgStoreAndMigrateContract = {
    typeUrl: "/cosmwasm.wasm.v1.MsgStoreAndMigrateContract",
    aminoType: "wasm/MsgStoreAndMigrateContract",
    is(o: any): o is MsgStoreAndMigrateContract {
        return o && (o.$typeUrl === MsgStoreAndMigrateContract.typeUrl || typeof o.authority === "string" && (o.wasmByteCode instanceof Uint8Array || typeof o.wasmByteCode === "string") && typeof o.contract === "string" && (o.msg instanceof Uint8Array || typeof o.msg === "string"));
    },
    isSDK(o: any): o is MsgStoreAndMigrateContractSDKType {
        return o && (o.$typeUrl === MsgStoreAndMigrateContract.typeUrl || typeof o.authority === "string" && (o.wasm_byte_code instanceof Uint8Array || typeof o.wasm_byte_code === "string") && typeof o.contract === "string" && (o.msg instanceof Uint8Array || typeof o.msg === "string"));
    },
    isAmino(o: any): o is MsgStoreAndMigrateContractAmino {
        return o && (o.$typeUrl === MsgStoreAndMigrateContract.typeUrl || typeof o.authority === "string" && (o.wasm_byte_code instanceof Uint8Array || typeof o.wasm_byte_code === "string") && typeof o.contract === "string" && (o.msg instanceof Uint8Array || typeof o.msg === "string"));
    },
    encode(message: MsgStoreAndMigrateContract, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        if (message.authority !== "") {
            writer.uint32(10).string(message.authority);
        }
        if (message.wasmByteCode.length !== 0) {
            writer.uint32(18).bytes(message.wasmByteCode);
        }
        if (message.instantiatePermission !== undefined) {
            AccessConfig.encode(message.instantiatePermission, writer.uint32(26).fork()).ldelim();
        }
        if (message.contract !== "") {
            writer.uint32(34).string(message.contract);
        }
        if (message.msg.length !== 0) {
            writer.uint32(42).bytes(message.msg);
        }
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): MsgStoreAndMigrateContract {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgStoreAndMigrateContract();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.authority = reader.string();
                    break;
                case 2:
                    message.wasmByteCode = reader.bytes();
                    break;
                case 3:
                    message.instantiatePermission = AccessConfig.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.contract = reader.string();
                    break;
                case 5:
                    message.msg = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromPartial(object: Partial<MsgStoreAndMigrateContract>): MsgStoreAndMigrateContract {
        const message = createBaseMsgStoreAndMigrateContract();
        message.authority = object.authority ?? "";
        message.wasmByteCode = object.wasmByteCode ?? new Uint8Array();
        message.instantiatePermission = object.instantiatePermission !== undefined && object.instantiatePermission !== null ? AccessConfig.fromPartial(object.instantiatePermission) : undefined;
        message.contract = object.contract ?? "";
        message.msg = object.msg ?? new Uint8Array();
        return message;
    },
    fromAmino(object: MsgStoreAndMigrateContractAmino): MsgStoreAndMigrateContract {
        const message = createBaseMsgStoreAndMigrateContract();
        if (object.authority !== undefined && object.authority !== null) {
            message.authority = object.authority;
        }
        if (object.wasm_byte_code !== undefined && object.wasm_byte_code !== null) {
            message.wasmByteCode = fromBase64(object.wasm_byte_code);
        }
        if (object.instantiate_permission !== undefined && object.instantiate_permission !== null) {
            message.instantiatePermission = AccessConfig.fromAmino(object.instantiate_permission);
        }
        if (object.contract !== undefined && object.contract !== null) {
            message.contract = object.contract;
        }
        if (object.msg !== undefined && object.msg !== null) {
            message.msg = toUtf8(JSON.stringify(object.msg));
        }
        return message;
    },
    toAmino(message: MsgStoreAndMigrateContract): MsgStoreAndMigrateContractAmino {
        const obj: any = {};
        obj.authority = message.authority === "" ? undefined : message.authority;
        obj.wasm_byte_code = message.wasmByteCode ? toBase64(message.wasmByteCode) : undefined;
        obj.instantiate_permission = message.instantiatePermission ? AccessConfig.toAmino(message.instantiatePermission) : undefined;
        obj.contract = message.contract === "" ? undefined : message.contract;
        obj.msg = message.msg ? JSON.parse(fromUtf8(message.msg)) : undefined;
        return obj;
    },
    fromAminoMsg(object: MsgStoreAndMigrateContractAminoMsg): MsgStoreAndMigrateContract {
        return MsgStoreAndMigrateContract.fromAmino(object.value);
    },
    toAminoMsg(message: MsgStoreAndMigrateContract): MsgStoreAndMigrateContractAminoMsg {
        return {
            type: "wasm/MsgStoreAndMigrateContract",
            value: MsgStoreAndMigrateContract.toAmino(message)
        };
    },
    fromProtoMsg(message: MsgStoreAndMigrateContractProtoMsg): MsgStoreAndMigrateContract {
        return MsgStoreAndMigrateContract.decode(message.value);
    },
    toProto(message: MsgStoreAndMigrateContract): Uint8Array {
        return MsgStoreAndMigrateContract.encode(message).finish();
    },
    toProtoMsg(message: MsgStoreAndMigrateContract): MsgStoreAndMigrateContractProtoMsg {
        return {
            typeUrl: "/cosmwasm.wasm.v1.MsgStoreAndMigrateContract",
            value: MsgStoreAndMigrateContract.encode(message).finish()
        };
    }
};
function createBaseMsgStoreAndMigrateContractResponse(): MsgStoreAndMigrateContractResponse {
    return {
        codeId: BigInt(0),
        checksum: new Uint8Array(),
        data: new Uint8Array()
    };
}
export const MsgStoreAndMigrateContractResponse = {
    typeUrl: "/cosmwasm.wasm.v1.MsgStoreAndMigrateContractResponse",
    aminoType: "wasm/MsgStoreAndMigrateContractResponse",
    is(o: any): o is MsgStoreAndMigrateContractResponse {
        return o && (o.$typeUrl === MsgStoreAndMigrateContractResponse.typeUrl || typeof o.codeId === "bigint" && (o.checksum instanceof Uint8Array || typeof o.checksum === "string") && (o.data instanceof Uint8Array || typeof o.data === "string"));
    },
    isSDK(o: any): o is MsgStoreAndMigrateContractResponseSDKType {
        return o && (o.$typeUrl === MsgStoreAndMigrateContractResponse.typeUrl || typeof o.code_id === "bigint" && (o.checksum instanceof Uint8Array || typeof o.checksum === "string") && (o.data instanceof Uint8Array || typeof o.data === "string"));
    },
    isAmino(o: any): o is MsgStoreAndMigrateContractResponseAmino {
        return o && (o.$typeUrl === MsgStoreAndMigrateContractResponse.typeUrl || typeof o.code_id === "bigint" && (o.checksum instanceof Uint8Array || typeof o.checksum === "string") && (o.data instanceof Uint8Array || typeof o.data === "string"));
    },
    encode(message: MsgStoreAndMigrateContractResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        if (message.codeId !== BigInt(0)) {
            writer.uint32(8).uint64(message.codeId);
        }
        if (message.checksum.length !== 0) {
            writer.uint32(18).bytes(message.checksum);
        }
        if (message.data.length !== 0) {
            writer.uint32(26).bytes(message.data);
        }
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): MsgStoreAndMigrateContractResponse {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgStoreAndMigrateContractResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.codeId = reader.uint64();
                    break;
                case 2:
                    message.checksum = reader.bytes();
                    break;
                case 3:
                    message.data = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromPartial(object: Partial<MsgStoreAndMigrateContractResponse>): MsgStoreAndMigrateContractResponse {
        const message = createBaseMsgStoreAndMigrateContractResponse();
        message.codeId = object.codeId !== undefined && object.codeId !== null ? BigInt(object.codeId.toString()) : BigInt(0);
        message.checksum = object.checksum ?? new Uint8Array();
        message.data = object.data ?? new Uint8Array();
        return message;
    },
    fromAmino(object: MsgStoreAndMigrateContractResponseAmino): MsgStoreAndMigrateContractResponse {
        const message = createBaseMsgStoreAndMigrateContractResponse();
        if (object.code_id !== undefined && object.code_id !== null) {
            message.codeId = BigInt(object.code_id);
        }
        if (object.checksum !== undefined && object.checksum !== null) {
            message.checksum = bytesFromBase64(object.checksum);
        }
        if (object.data !== undefined && object.data !== null) {
            message.data = bytesFromBase64(object.data);
        }
        return message;
    },
    toAmino(message: MsgStoreAndMigrateContractResponse): MsgStoreAndMigrateContractResponseAmino {
        const obj: any = {};
        obj.code_id = message.codeId !== BigInt(0) ? message.codeId.toString() : undefined;
        obj.checksum = message.checksum ? base64FromBytes(message.checksum) : undefined;
        obj.data = message.data ? base64FromBytes(message.data) : undefined;
        return obj;
    },
    fromAminoMsg(object: MsgStoreAndMigrateContractResponseAminoMsg): MsgStoreAndMigrateContractResponse {
        return MsgStoreAndMigrateContractResponse.fromAmino(object.value);
    },
    toAminoMsg(message: MsgStoreAndMigrateContractResponse): MsgStoreAndMigrateContractResponseAminoMsg {
        return {
            type: "wasm/MsgStoreAndMigrateContractResponse",
            value: MsgStoreAndMigrateContractResponse.toAmino(message)
        };
    },
    fromProtoMsg(message: MsgStoreAndMigrateContractResponseProtoMsg): MsgStoreAndMigrateContractResponse {
        return MsgStoreAndMigrateContractResponse.decode(message.value);
    },
    toProto(message: MsgStoreAndMigrateContractResponse): Uint8Array {
        return MsgStoreAndMigrateContractResponse.encode(message).finish();
    },
    toProtoMsg(message: MsgStoreAndMigrateContractResponse): MsgStoreAndMigrateContractResponseProtoMsg {
        return {
            typeUrl: "/cosmwasm.wasm.v1.MsgStoreAndMigrateContractResponse",
            value: MsgStoreAndMigrateContractResponse.encode(message).finish()
        };
    }
};
function createBaseMsgUpdateContractLabel(): MsgUpdateContractLabel {
    return {
        sender: "",
        newLabel: "",
        contract: ""
    };
}
export const MsgUpdateContractLabel = {
    typeUrl: "/cosmwasm.wasm.v1.MsgUpdateContractLabel",
    aminoType: "wasm/MsgUpdateContractLabel",
    is(o: any): o is MsgUpdateContractLabel {
        return o && (o.$typeUrl === MsgUpdateContractLabel.typeUrl || typeof o.sender === "string" && typeof o.newLabel === "string" && typeof o.contract === "string");
    },
    isSDK(o: any): o is MsgUpdateContractLabelSDKType {
        return o && (o.$typeUrl === MsgUpdateContractLabel.typeUrl || typeof o.sender === "string" && typeof o.new_label === "string" && typeof o.contract === "string");
    },
    isAmino(o: any): o is MsgUpdateContractLabelAmino {
        return o && (o.$typeUrl === MsgUpdateContractLabel.typeUrl || typeof o.sender === "string" && typeof o.new_label === "string" && typeof o.contract === "string");
    },
    encode(message: MsgUpdateContractLabel, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        if (message.sender !== "") {
            writer.uint32(10).string(message.sender);
        }
        if (message.newLabel !== "") {
            writer.uint32(18).string(message.newLabel);
        }
        if (message.contract !== "") {
            writer.uint32(26).string(message.contract);
        }
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): MsgUpdateContractLabel {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgUpdateContractLabel();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.sender = reader.string();
                    break;
                case 2:
                    message.newLabel = reader.string();
                    break;
                case 3:
                    message.contract = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromPartial(object: Partial<MsgUpdateContractLabel>): MsgUpdateContractLabel {
        const message = createBaseMsgUpdateContractLabel();
        message.sender = object.sender ?? "";
        message.newLabel = object.newLabel ?? "";
        message.contract = object.contract ?? "";
        return message;
    },
    fromAmino(object: MsgUpdateContractLabelAmino): MsgUpdateContractLabel {
        const message = createBaseMsgUpdateContractLabel();
        if (object.sender !== undefined && object.sender !== null) {
            message.sender = object.sender;
        }
        if (object.new_label !== undefined && object.new_label !== null) {
            message.newLabel = object.new_label;
        }
        if (object.contract !== undefined && object.contract !== null) {
            message.contract = object.contract;
        }
        return message;
    },
    toAmino(message: MsgUpdateContractLabel): MsgUpdateContractLabelAmino {
        const obj: any = {};
        obj.sender = message.sender === "" ? undefined : message.sender;
        obj.new_label = message.newLabel === "" ? undefined : message.newLabel;
        obj.contract = message.contract === "" ? undefined : message.contract;
        return obj;
    },
    fromAminoMsg(object: MsgUpdateContractLabelAminoMsg): MsgUpdateContractLabel {
        return MsgUpdateContractLabel.fromAmino(object.value);
    },
    toAminoMsg(message: MsgUpdateContractLabel): MsgUpdateContractLabelAminoMsg {
        return {
            type: "wasm/MsgUpdateContractLabel",
            value: MsgUpdateContractLabel.toAmino(message)
        };
    },
    fromProtoMsg(message: MsgUpdateContractLabelProtoMsg): MsgUpdateContractLabel {
        return MsgUpdateContractLabel.decode(message.value);
    },
    toProto(message: MsgUpdateContractLabel): Uint8Array {
        return MsgUpdateContractLabel.encode(message).finish();
    },
    toProtoMsg(message: MsgUpdateContractLabel): MsgUpdateContractLabelProtoMsg {
        return {
            typeUrl: "/cosmwasm.wasm.v1.MsgUpdateContractLabel",
            value: MsgUpdateContractLabel.encode(message).finish()
        };
    }
};
function createBaseMsgUpdateContractLabelResponse(): MsgUpdateContractLabelResponse {
    return {};
}
export const MsgUpdateContractLabelResponse = {
    typeUrl: "/cosmwasm.wasm.v1.MsgUpdateContractLabelResponse",
    aminoType: "wasm/MsgUpdateContractLabelResponse",
    is(o: any): o is MsgUpdateContractLabelResponse {
        return o && o.$typeUrl === MsgUpdateContractLabelResponse.typeUrl;
    },
    isSDK(o: any): o is MsgUpdateContractLabelResponseSDKType {
        return o && o.$typeUrl === MsgUpdateContractLabelResponse.typeUrl;
    },
    isAmino(o: any): o is MsgUpdateContractLabelResponseAmino {
        return o && o.$typeUrl === MsgUpdateContractLabelResponse.typeUrl;
    },
    encode(_: MsgUpdateContractLabelResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): MsgUpdateContractLabelResponse {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgUpdateContractLabelResponse();
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
    fromPartial(_: Partial<MsgUpdateContractLabelResponse>): MsgUpdateContractLabelResponse {
        const message = createBaseMsgUpdateContractLabelResponse();
        return message;
    },
    fromAmino(_: MsgUpdateContractLabelResponseAmino): MsgUpdateContractLabelResponse {
        const message = createBaseMsgUpdateContractLabelResponse();
        return message;
    },
    toAmino(_: MsgUpdateContractLabelResponse): MsgUpdateContractLabelResponseAmino {
        const obj: any = {};
        return obj;
    },
    fromAminoMsg(object: MsgUpdateContractLabelResponseAminoMsg): MsgUpdateContractLabelResponse {
        return MsgUpdateContractLabelResponse.fromAmino(object.value);
    },
    toAminoMsg(message: MsgUpdateContractLabelResponse): MsgUpdateContractLabelResponseAminoMsg {
        return {
            type: "wasm/MsgUpdateContractLabelResponse",
            value: MsgUpdateContractLabelResponse.toAmino(message)
        };
    },
    fromProtoMsg(message: MsgUpdateContractLabelResponseProtoMsg): MsgUpdateContractLabelResponse {
        return MsgUpdateContractLabelResponse.decode(message.value);
    },
    toProto(message: MsgUpdateContractLabelResponse): Uint8Array {
        return MsgUpdateContractLabelResponse.encode(message).finish();
    },
    toProtoMsg(message: MsgUpdateContractLabelResponse): MsgUpdateContractLabelResponseProtoMsg {
        return {
            typeUrl: "/cosmwasm.wasm.v1.MsgUpdateContractLabelResponse",
            value: MsgUpdateContractLabelResponse.encode(message).finish()
        };
    }
};
