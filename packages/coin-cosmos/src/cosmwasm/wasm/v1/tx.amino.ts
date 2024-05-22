import { MsgStoreCode, MsgInstantiateContract, MsgInstantiateContract2, MsgExecuteContract, MsgMigrateContract, MsgUpdateAdmin, MsgClearAdmin, MsgUpdateInstantiateConfig, MsgUpdateParams, MsgSudoContract, MsgPinCodes, MsgUnpinCodes, MsgStoreAndInstantiateContract, MsgRemoveCodeUploadParamsAddresses, MsgAddCodeUploadParamsAddresses, MsgStoreAndMigrateContract, MsgUpdateContractLabel } from "./tx";
export const CosmWasmAminoConverter = {
    "/cosmwasm.wasm.v1.MsgStoreCode": {
        aminoType: "wasm/MsgStoreCode",
        toAmino: MsgStoreCode.toAmino,
        fromAmino: MsgStoreCode.fromAmino
    },
    "/cosmwasm.wasm.v1.MsgInstantiateContract": {
        aminoType: "wasm/MsgInstantiateContract",
        toAmino: MsgInstantiateContract.toAmino,
        fromAmino: MsgInstantiateContract.fromAmino
    },
    "/cosmwasm.wasm.v1.MsgInstantiateContract2": {
        aminoType: "wasm/MsgInstantiateContract2",
        toAmino: MsgInstantiateContract2.toAmino,
        fromAmino: MsgInstantiateContract2.fromAmino
    },
    "/cosmwasm.wasm.v1.MsgExecuteContract": {
        aminoType: "wasm/MsgExecuteContract",
        toAmino: MsgExecuteContract.toAmino,
        fromAmino: MsgExecuteContract.fromAmino
    },
    "/cosmwasm.wasm.v1.MsgMigrateContract": {
        aminoType: "wasm/MsgMigrateContract",
        toAmino: MsgMigrateContract.toAmino,
        fromAmino: MsgMigrateContract.fromAmino
    },
    "/cosmwasm.wasm.v1.MsgUpdateAdmin": {
        aminoType: "wasm/MsgUpdateAdmin",
        toAmino: MsgUpdateAdmin.toAmino,
        fromAmino: MsgUpdateAdmin.fromAmino
    },
    "/cosmwasm.wasm.v1.MsgClearAdmin": {
        aminoType: "wasm/MsgClearAdmin",
        toAmino: MsgClearAdmin.toAmino,
        fromAmino: MsgClearAdmin.fromAmino
    },
    "/cosmwasm.wasm.v1.MsgUpdateInstantiateConfig": {
        aminoType: "wasm/MsgUpdateInstantiateConfig",
        toAmino: MsgUpdateInstantiateConfig.toAmino,
        fromAmino: MsgUpdateInstantiateConfig.fromAmino
    },
    "/cosmwasm.wasm.v1.MsgUpdateParams": {
        aminoType: "wasm/MsgUpdateParams",
        toAmino: MsgUpdateParams.toAmino,
        fromAmino: MsgUpdateParams.fromAmino
    },
    "/cosmwasm.wasm.v1.MsgSudoContract": {
        aminoType: "wasm/MsgSudoContract",
        toAmino: MsgSudoContract.toAmino,
        fromAmino: MsgSudoContract.fromAmino
    },
    "/cosmwasm.wasm.v1.MsgPinCodes": {
        aminoType: "wasm/MsgPinCodes",
        toAmino: MsgPinCodes.toAmino,
        fromAmino: MsgPinCodes.fromAmino
    },
    "/cosmwasm.wasm.v1.MsgUnpinCodes": {
        aminoType: "wasm/MsgUnpinCodes",
        toAmino: MsgUnpinCodes.toAmino,
        fromAmino: MsgUnpinCodes.fromAmino
    },
    "/cosmwasm.wasm.v1.MsgStoreAndInstantiateContract": {
        aminoType: "wasm/MsgStoreAndInstantiateContract",
        toAmino: MsgStoreAndInstantiateContract.toAmino,
        fromAmino: MsgStoreAndInstantiateContract.fromAmino
    },
    "/cosmwasm.wasm.v1.MsgRemoveCodeUploadParamsAddresses": {
        aminoType: "wasm/MsgRemoveCodeUploadParamsAddresses",
        toAmino: MsgRemoveCodeUploadParamsAddresses.toAmino,
        fromAmino: MsgRemoveCodeUploadParamsAddresses.fromAmino
    },
    "/cosmwasm.wasm.v1.MsgAddCodeUploadParamsAddresses": {
        aminoType: "wasm/MsgAddCodeUploadParamsAddresses",
        toAmino: MsgAddCodeUploadParamsAddresses.toAmino,
        fromAmino: MsgAddCodeUploadParamsAddresses.fromAmino
    },
    "/cosmwasm.wasm.v1.MsgStoreAndMigrateContract": {
        aminoType: "wasm/MsgStoreAndMigrateContract",
        toAmino: MsgStoreAndMigrateContract.toAmino,
        fromAmino: MsgStoreAndMigrateContract.fromAmino
    },
    "/cosmwasm.wasm.v1.MsgUpdateContractLabel": {
        aminoType: "wasm/MsgUpdateContractLabel",
        toAmino: MsgUpdateContractLabel.toAmino,
        fromAmino: MsgUpdateContractLabel.fromAmino
    }
};
