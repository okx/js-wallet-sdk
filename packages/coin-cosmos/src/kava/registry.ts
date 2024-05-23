import {GeneratedType} from "../registry";
import {TelescopeGeneratedCodec} from "../types";
import * as auction from "./auction/v1beta1/tx"
import * as hard from "./hard/v1beta1/tx"
import * as swap from "./swap/v1beta1/tx"


export const KavaRegistry: ReadonlyArray<[string, GeneratedType]> = [
    ["/kava.auction.v1beta1.MsgPlaceBid", auction.MsgPlaceBid as TelescopeGeneratedCodec],
    ["/kava.hard.v1beta1.MsgDeposit", hard.MsgDeposit as TelescopeGeneratedCodec],
    ["/kava.hard.v1beta1.MsgWithdraw", hard.MsgWithdraw as TelescopeGeneratedCodec],
    ["/kava.hard.v1beta1.MsgBorrow", hard.MsgBorrow as TelescopeGeneratedCodec],
    ["/kava.hard.v1beta1.MsgRepay", hard.MsgRepay as TelescopeGeneratedCodec],
    ["/kava.hard.v1beta1.MsgLiquidate", hard.MsgLiquidate as TelescopeGeneratedCodec],
    ["/kava.swap.v1beta1.MsgDeposit", swap.MsgDeposit as TelescopeGeneratedCodec],
    ["/kava.swap.v1beta1.MsgWithdraw", swap.MsgWithdraw as TelescopeGeneratedCodec],
    ["/kava.swap.v1beta1.MsgSwapExactForTokens", swap.MsgSwapExactForTokens as TelescopeGeneratedCodec],
    ["/kava.swap.v1beta1.MsgSwapForExactTokens", swap.MsgSwapForExactTokens as TelescopeGeneratedCodec]
];
