import { MsgCreateDenom, MsgMint, MsgBurn, MsgChangeAdmin, MsgSetDenomMetadata, MsgSetBeforeSendHook, MsgForceTransfer } from "./tx";
export const TokenFactoryAminoConverter = {
    "/osmosis.tokenfactory.v1beta1.MsgCreateDenom": {
        aminoType: "osmosis/tokenfactory/create-denom",
        toAmino: MsgCreateDenom.toAmino,
        fromAmino: MsgCreateDenom.fromAmino
    },
    "/osmosis.tokenfactory.v1beta1.MsgMint": {
        aminoType: "osmosis/tokenfactory/mint",
        toAmino: MsgMint.toAmino,
        fromAmino: MsgMint.fromAmino
    },
    "/osmosis.tokenfactory.v1beta1.MsgBurn": {
        aminoType: "osmosis/tokenfactory/burn",
        toAmino: MsgBurn.toAmino,
        fromAmino: MsgBurn.fromAmino
    },
    "/osmosis.tokenfactory.v1beta1.MsgChangeAdmin": {
        aminoType: "osmosis/tokenfactory/change-admin",
        toAmino: MsgChangeAdmin.toAmino,
        fromAmino: MsgChangeAdmin.fromAmino
    },
    "/osmosis.tokenfactory.v1beta1.MsgSetDenomMetadata": {
        aminoType: "osmosis/tokenfactory/set-denom-metadata",
        toAmino: MsgSetDenomMetadata.toAmino,
        fromAmino: MsgSetDenomMetadata.fromAmino
    },
    "/osmosis.tokenfactory.v1beta1.MsgSetBeforeSendHook": {
        aminoType: "osmosis/tokenfactory/set-bef-send-hook",
        toAmino: MsgSetBeforeSendHook.toAmino,
        fromAmino: MsgSetBeforeSendHook.fromAmino
    },
    "/osmosis.tokenfactory.v1beta1.MsgForceTransfer": {
        aminoType: "osmosis/tokenfactory/force-transfer",
        toAmino: MsgForceTransfer.toAmino,
        fromAmino: MsgForceTransfer.fromAmino
    }
};
