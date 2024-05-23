import { MsgDeposit, MsgWithdraw, MsgSwapExactForTokens, MsgSwapForExactTokens } from "./tx";
export const SwapAminoConverter = {
  "/kava.swap.v1beta1.MsgDeposit": {
    aminoType: "swap/MsgDeposit",
    toAmino: MsgDeposit.toAmino,
    fromAmino: MsgDeposit.fromAmino
  },
  "/kava.swap.v1beta1.MsgWithdraw": {
    aminoType: "swap/MsgWithdraw",
    toAmino: MsgWithdraw.toAmino,
    fromAmino: MsgWithdraw.fromAmino
  },
  "/kava.swap.v1beta1.MsgSwapExactForTokens": {
    aminoType: "swap/MsgSwapExactForTokens",
    toAmino: MsgSwapExactForTokens.toAmino,
    fromAmino: MsgSwapExactForTokens.fromAmino
  },
  "/kava.swap.v1beta1.MsgSwapForExactTokens": {
    aminoType: "swap/MsgSwapForExactTokens",
    toAmino: MsgSwapForExactTokens.toAmino,
    fromAmino: MsgSwapForExactTokens.fromAmino
  }
};