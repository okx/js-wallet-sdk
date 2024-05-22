import {GeneratedType} from "../registry";
import {TelescopeGeneratedCodec} from "../types";
import * as wasm from "./wasm/v1/tx"

export const CosmWasmRegistry: ReadonlyArray<[string, GeneratedType]> = [
    ["/cosmwasm.wasm.v1.MsgStoreCode", wasm.MsgStoreCode as TelescopeGeneratedCodec],
    ["/cosmwasm.wasm.v1.MsgInstantiateContract", wasm.MsgInstantiateContract as TelescopeGeneratedCodec],
    ["/cosmwasm.wasm.v1.MsgInstantiateContract2", wasm.MsgInstantiateContract2 as TelescopeGeneratedCodec],
    ["/cosmwasm.wasm.v1.MsgExecuteContract", wasm.MsgExecuteContract as TelescopeGeneratedCodec],
    ["/cosmwasm.wasm.v1.MsgMigrateContract", wasm.MsgMigrateContract as TelescopeGeneratedCodec],
    ["/cosmwasm.wasm.v1.MsgUpdateAdmin", wasm.MsgUpdateAdmin as TelescopeGeneratedCodec],
    ["/cosmwasm.wasm.v1.MsgClearAdmin", wasm.MsgClearAdmin as TelescopeGeneratedCodec],
    ["/cosmwasm.wasm.v1.MsgUpdateInstantiateConfig", wasm.MsgUpdateInstantiateConfig as TelescopeGeneratedCodec],
    ["/cosmwasm.wasm.v1.MsgUpdateParams", wasm.MsgUpdateParams as TelescopeGeneratedCodec],
    ["/cosmwasm.wasm.v1.MsgSudoContract", wasm.MsgSudoContract as TelescopeGeneratedCodec],
    ["/cosmwasm.wasm.v1.MsgPinCodes", wasm.MsgPinCodes as TelescopeGeneratedCodec],
    ["/cosmwasm.wasm.v1.MsgUnpinCodes", wasm.MsgUnpinCodes as TelescopeGeneratedCodec],
    ["/cosmwasm.wasm.v1.MsgStoreAndInstantiateContract", wasm.MsgStoreAndInstantiateContract as TelescopeGeneratedCodec],
    ["/cosmwasm.wasm.v1.MsgRemoveCodeUploadParamsAddresses", wasm.MsgRemoveCodeUploadParamsAddresses as TelescopeGeneratedCodec],
    ["/cosmwasm.wasm.v1.MsgAddCodeUploadParamsAddresses", wasm.MsgAddCodeUploadParamsAddresses as TelescopeGeneratedCodec],
    ["/cosmwasm.wasm.v1.MsgStoreAndMigrateContract", wasm.MsgStoreAndMigrateContract as TelescopeGeneratedCodec],
    ["/cosmwasm.wasm.v1.MsgUpdateContractLabel", wasm.MsgUpdateContractLabel as TelescopeGeneratedCodec]
];
