import { MsgDeposit, MsgWithdraw, MsgBorrow, MsgRepay, MsgLiquidate } from "./tx";
export const HardAminoConverter = {
  "/kava.hard.v1beta1.MsgDeposit": {
    aminoType: "hard/MsgDeposit",
    toAmino: MsgDeposit.toAmino,
    fromAmino: MsgDeposit.fromAmino
  },
  "/kava.hard.v1beta1.MsgWithdraw": {
    aminoType: "hard/MsgWithdraw",
    toAmino: MsgWithdraw.toAmino,
    fromAmino: MsgWithdraw.fromAmino
  },
  "/kava.hard.v1beta1.MsgBorrow": {
    aminoType: "hard/MsgBorrow",
    toAmino: MsgBorrow.toAmino,
    fromAmino: MsgBorrow.fromAmino
  },
  "/kava.hard.v1beta1.MsgRepay": {
    aminoType: "hard/MsgRepay",
    toAmino: MsgRepay.toAmino,
    fromAmino: MsgRepay.fromAmino
  },
  "/kava.hard.v1beta1.MsgLiquidate": {
    aminoType: "hard/MsgLiquidate",
    toAmino: MsgLiquidate.toAmino,
    fromAmino: MsgLiquidate.fromAmino
  }
};