//@ts-nocheck
import { Coin, CoinAmino, CoinSDKType } from "../../../typesV2/cosmos/base/v1beta1/coin";
import { BinaryReader, BinaryWriter } from "../../../binary";
import { Decimal } from "@cosmjs/math";
/** MsgDeposit represents a message for depositing liquidity into a pool */
export interface MsgDeposit {
  /** depositor represents the address to deposit funds from */
  depositor: string;
  /** token_a represents one token of deposit pair */
  tokenA: Coin;
  /** token_b represents one token of deposit pair */
  tokenB: Coin;
  /** slippage represents the max decimal percentage price change */
  slippage: string;
  /** deadline represents the unix timestamp to complete the deposit by */
  deadline: bigint;
}
export interface MsgDepositProtoMsg {
  typeUrl: "/kava.swap.v1beta1.MsgDeposit";
  value: Uint8Array;
}
/** MsgDeposit represents a message for depositing liquidity into a pool */
export interface MsgDepositAmino {
  /** depositor represents the address to deposit funds from */
  depositor?: string;
  /** token_a represents one token of deposit pair */
  token_a?: CoinAmino;
  /** token_b represents one token of deposit pair */
  token_b?: CoinAmino;
  /** slippage represents the max decimal percentage price change */
  slippage?: string;
  /** deadline represents the unix timestamp to complete the deposit by */
  deadline?: string;
}
export interface MsgDepositAminoMsg {
  type: "/kava.swap.v1beta1.MsgDeposit";
  value: MsgDepositAmino;
}
/** MsgDeposit represents a message for depositing liquidity into a pool */
export interface MsgDepositSDKType {
  depositor: string;
  token_a: CoinSDKType;
  token_b: CoinSDKType;
  slippage: string;
  deadline: bigint;
}
/** MsgDepositResponse defines the Msg/Deposit response type. */
export interface MsgDepositResponse {}
export interface MsgDepositResponseProtoMsg {
  typeUrl: "/kava.swap.v1beta1.MsgDepositResponse";
  value: Uint8Array;
}
/** MsgDepositResponse defines the Msg/Deposit response type. */
export interface MsgDepositResponseAmino {}
export interface MsgDepositResponseAminoMsg {
  type: "/kava.swap.v1beta1.MsgDepositResponse";
  value: MsgDepositResponseAmino;
}
/** MsgDepositResponse defines the Msg/Deposit response type. */
export interface MsgDepositResponseSDKType {}
/** MsgWithdraw represents a message for withdrawing liquidity from a pool */
export interface MsgWithdraw {
  /** from represents the address we are withdrawing for */
  from: string;
  /** shares represents the amount of shares to withdraw */
  shares: string;
  /** min_token_a represents the minimum a token to withdraw */
  minTokenA: Coin;
  /** min_token_a represents the minimum a token to withdraw */
  minTokenB: Coin;
  /** deadline represents the unix timestamp to complete the withdraw by */
  deadline: bigint;
}
export interface MsgWithdrawProtoMsg {
  typeUrl: "/kava.swap.v1beta1.MsgWithdraw";
  value: Uint8Array;
}
/** MsgWithdraw represents a message for withdrawing liquidity from a pool */
export interface MsgWithdrawAmino {
  /** from represents the address we are withdrawing for */
  from?: string;
  /** shares represents the amount of shares to withdraw */
  shares?: string;
  /** min_token_a represents the minimum a token to withdraw */
  min_token_a?: CoinAmino;
  /** min_token_a represents the minimum a token to withdraw */
  min_token_b?: CoinAmino;
  /** deadline represents the unix timestamp to complete the withdraw by */
  deadline?: string;
}
export interface MsgWithdrawAminoMsg {
  type: "/kava.swap.v1beta1.MsgWithdraw";
  value: MsgWithdrawAmino;
}
/** MsgWithdraw represents a message for withdrawing liquidity from a pool */
export interface MsgWithdrawSDKType {
  from: string;
  shares: string;
  min_token_a: CoinSDKType;
  min_token_b: CoinSDKType;
  deadline: bigint;
}
/** MsgWithdrawResponse defines the Msg/Withdraw response type. */
export interface MsgWithdrawResponse {}
export interface MsgWithdrawResponseProtoMsg {
  typeUrl: "/kava.swap.v1beta1.MsgWithdrawResponse";
  value: Uint8Array;
}
/** MsgWithdrawResponse defines the Msg/Withdraw response type. */
export interface MsgWithdrawResponseAmino {}
export interface MsgWithdrawResponseAminoMsg {
  type: "/kava.swap.v1beta1.MsgWithdrawResponse";
  value: MsgWithdrawResponseAmino;
}
/** MsgWithdrawResponse defines the Msg/Withdraw response type. */
export interface MsgWithdrawResponseSDKType {}
/** MsgSwapExactForTokens represents a message for trading exact coinA for coinB */
export interface MsgSwapExactForTokens {
  /** represents the address swaping the tokens */
  requester: string;
  /** exact_token_a represents the exact amount to swap for token_b */
  exactTokenA: Coin;
  /** token_b represents the desired token_b to swap for */
  tokenB: Coin;
  /** slippage represents the maximum change in token_b allowed */
  slippage: string;
  /** deadline represents the unix timestamp to complete the swap by */
  deadline: bigint;
}
export interface MsgSwapExactForTokensProtoMsg {
  typeUrl: "/kava.swap.v1beta1.MsgSwapExactForTokens";
  value: Uint8Array;
}
/** MsgSwapExactForTokens represents a message for trading exact coinA for coinB */
export interface MsgSwapExactForTokensAmino {
  /** represents the address swaping the tokens */
  requester?: string;
  /** exact_token_a represents the exact amount to swap for token_b */
  exact_token_a?: CoinAmino;
  /** token_b represents the desired token_b to swap for */
  token_b?: CoinAmino;
  /** slippage represents the maximum change in token_b allowed */
  slippage?: string;
  /** deadline represents the unix timestamp to complete the swap by */
  deadline?: string;
}
export interface MsgSwapExactForTokensAminoMsg {
  type: "/kava.swap.v1beta1.MsgSwapExactForTokens";
  value: MsgSwapExactForTokensAmino;
}
/** MsgSwapExactForTokens represents a message for trading exact coinA for coinB */
export interface MsgSwapExactForTokensSDKType {
  requester: string;
  exact_token_a: CoinSDKType;
  token_b: CoinSDKType;
  slippage: string;
  deadline: bigint;
}
/**
 * MsgSwapExactForTokensResponse defines the Msg/SwapExactForTokens response
 * type.
 */
export interface MsgSwapExactForTokensResponse {}
export interface MsgSwapExactForTokensResponseProtoMsg {
  typeUrl: "/kava.swap.v1beta1.MsgSwapExactForTokensResponse";
  value: Uint8Array;
}
/**
 * MsgSwapExactForTokensResponse defines the Msg/SwapExactForTokens response
 * type.
 */
export interface MsgSwapExactForTokensResponseAmino {}
export interface MsgSwapExactForTokensResponseAminoMsg {
  type: "/kava.swap.v1beta1.MsgSwapExactForTokensResponse";
  value: MsgSwapExactForTokensResponseAmino;
}
/**
 * MsgSwapExactForTokensResponse defines the Msg/SwapExactForTokens response
 * type.
 */
export interface MsgSwapExactForTokensResponseSDKType {}
/**
 * MsgSwapForExactTokens represents a message for trading coinA for an exact
 * coinB
 */
export interface MsgSwapForExactTokens {
  /** represents the address swaping the tokens */
  requester: string;
  /** token_a represents the desired token_a to swap for */
  tokenA: Coin;
  /** exact_token_b represents the exact token b amount to swap for token a */
  exactTokenB: Coin;
  /** slippage represents the maximum change in token_a allowed */
  slippage: string;
  /** deadline represents the unix timestamp to complete the swap by */
  deadline: bigint;
}
export interface MsgSwapForExactTokensProtoMsg {
  typeUrl: "/kava.swap.v1beta1.MsgSwapForExactTokens";
  value: Uint8Array;
}
/**
 * MsgSwapForExactTokens represents a message for trading coinA for an exact
 * coinB
 */
export interface MsgSwapForExactTokensAmino {
  /** represents the address swaping the tokens */
  requester?: string;
  /** token_a represents the desired token_a to swap for */
  token_a?: CoinAmino;
  /** exact_token_b represents the exact token b amount to swap for token a */
  exact_token_b?: CoinAmino;
  /** slippage represents the maximum change in token_a allowed */
  slippage?: string;
  /** deadline represents the unix timestamp to complete the swap by */
  deadline?: string;
}
export interface MsgSwapForExactTokensAminoMsg {
  type: "/kava.swap.v1beta1.MsgSwapForExactTokens";
  value: MsgSwapForExactTokensAmino;
}
/**
 * MsgSwapForExactTokens represents a message for trading coinA for an exact
 * coinB
 */
export interface MsgSwapForExactTokensSDKType {
  requester: string;
  token_a: CoinSDKType;
  exact_token_b: CoinSDKType;
  slippage: string;
  deadline: bigint;
}
/**
 * MsgSwapForExactTokensResponse defines the Msg/SwapForExactTokensResponse
 * response type.
 */
export interface MsgSwapForExactTokensResponse {}
export interface MsgSwapForExactTokensResponseProtoMsg {
  typeUrl: "/kava.swap.v1beta1.MsgSwapForExactTokensResponse";
  value: Uint8Array;
}
/**
 * MsgSwapForExactTokensResponse defines the Msg/SwapForExactTokensResponse
 * response type.
 */
export interface MsgSwapForExactTokensResponseAmino {}
export interface MsgSwapForExactTokensResponseAminoMsg {
  type: "/kava.swap.v1beta1.MsgSwapForExactTokensResponse";
  value: MsgSwapForExactTokensResponseAmino;
}
/**
 * MsgSwapForExactTokensResponse defines the Msg/SwapForExactTokensResponse
 * response type.
 */
export interface MsgSwapForExactTokensResponseSDKType {}
function createBaseMsgDeposit(): MsgDeposit {
  return {
    depositor: "",
    tokenA: Coin.fromPartial({}),
    tokenB: Coin.fromPartial({}),
    slippage: "",
    deadline: BigInt(0)
  };
}
export const MsgDeposit = {
  typeUrl: "/kava.swap.v1beta1.MsgDeposit",
  encode(message: MsgDeposit, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.depositor !== "") {
      writer.uint32(10).string(message.depositor);
    }
    if (message.tokenA !== undefined) {
      Coin.encode(message.tokenA, writer.uint32(18).fork()).ldelim();
    }
    if (message.tokenB !== undefined) {
      Coin.encode(message.tokenB, writer.uint32(26).fork()).ldelim();
    }
    if (message.slippage !== "") {
      writer.uint32(34).string(Decimal.fromUserInput(message.slippage, 18).atomics);
    }
    if (message.deadline !== BigInt(0)) {
      writer.uint32(40).int64(message.deadline);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgDeposit {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgDeposit();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.depositor = reader.string();
          break;
        case 2:
          message.tokenA = Coin.decode(reader, reader.uint32());
          break;
        case 3:
          message.tokenB = Coin.decode(reader, reader.uint32());
          break;
        case 4:
          message.slippage = Decimal.fromAtomics(reader.string(), 18).toString();
          break;
        case 5:
          message.deadline = reader.int64();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<MsgDeposit>): MsgDeposit {
    const message = createBaseMsgDeposit();
    message.depositor = object.depositor ?? "";
    message.tokenA = object.tokenA !== undefined && object.tokenA !== null ? Coin.fromPartial(object.tokenA) : undefined;
    message.tokenB = object.tokenB !== undefined && object.tokenB !== null ? Coin.fromPartial(object.tokenB) : undefined;
    message.slippage = object.slippage ?? "";
    message.deadline = object.deadline !== undefined && object.deadline !== null ? BigInt(object.deadline.toString()) : BigInt(0);
    return message;
  },
  fromAmino(object: MsgDepositAmino): MsgDeposit {
    const message = createBaseMsgDeposit();
    if (object.depositor !== undefined && object.depositor !== null) {
      message.depositor = object.depositor;
    }
    if (object.token_a !== undefined && object.token_a !== null) {
      message.tokenA = Coin.fromAmino(object.token_a);
    }
    if (object.token_b !== undefined && object.token_b !== null) {
      message.tokenB = Coin.fromAmino(object.token_b);
    }
    if (object.slippage !== undefined && object.slippage !== null) {
      message.slippage = object.slippage;
    }
    if (object.deadline !== undefined && object.deadline !== null) {
      message.deadline = BigInt(object.deadline);
    }
    return message;
  },
  toAmino(message: MsgDeposit): MsgDepositAmino {
    const obj: any = {};
    obj.depositor = message.depositor === "" ? undefined : message.depositor;
    obj.token_a = message.tokenA ? Coin.toAmino(message.tokenA) : undefined;
    obj.token_b = message.tokenB ? Coin.toAmino(message.tokenB) : undefined;
    obj.slippage = message.slippage === "" ? undefined : message.slippage;
    obj.deadline = message.deadline !== BigInt(0) ? message.deadline.toString() : undefined;
    return obj;
  },
  fromAminoMsg(object: MsgDepositAminoMsg): MsgDeposit {
    return MsgDeposit.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgDepositProtoMsg): MsgDeposit {
    return MsgDeposit.decode(message.value);
  },
  toProto(message: MsgDeposit): Uint8Array {
    return MsgDeposit.encode(message).finish();
  },
  toProtoMsg(message: MsgDeposit): MsgDepositProtoMsg {
    return {
      typeUrl: "/kava.swap.v1beta1.MsgDeposit",
      value: MsgDeposit.encode(message).finish()
    };
  }
};
function createBaseMsgDepositResponse(): MsgDepositResponse {
  return {};
}
export const MsgDepositResponse = {
  typeUrl: "/kava.swap.v1beta1.MsgDepositResponse",
  encode(_: MsgDepositResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgDepositResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgDepositResponse();
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
  fromPartial(_: Partial<MsgDepositResponse>): MsgDepositResponse {
    const message = createBaseMsgDepositResponse();
    return message;
  },
  fromAmino(_: MsgDepositResponseAmino): MsgDepositResponse {
    const message = createBaseMsgDepositResponse();
    return message;
  },
  toAmino(_: MsgDepositResponse): MsgDepositResponseAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: MsgDepositResponseAminoMsg): MsgDepositResponse {
    return MsgDepositResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgDepositResponseProtoMsg): MsgDepositResponse {
    return MsgDepositResponse.decode(message.value);
  },
  toProto(message: MsgDepositResponse): Uint8Array {
    return MsgDepositResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgDepositResponse): MsgDepositResponseProtoMsg {
    return {
      typeUrl: "/kava.swap.v1beta1.MsgDepositResponse",
      value: MsgDepositResponse.encode(message).finish()
    };
  }
};
function createBaseMsgWithdraw(): MsgWithdraw {
  return {
    from: "",
    shares: "",
    minTokenA: Coin.fromPartial({}),
    minTokenB: Coin.fromPartial({}),
    deadline: BigInt(0)
  };
}
export const MsgWithdraw = {
  typeUrl: "/kava.swap.v1beta1.MsgWithdraw",
  encode(message: MsgWithdraw, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.from !== "") {
      writer.uint32(10).string(message.from);
    }
    if (message.shares !== "") {
      writer.uint32(18).string(message.shares);
    }
    if (message.minTokenA !== undefined) {
      Coin.encode(message.minTokenA, writer.uint32(26).fork()).ldelim();
    }
    if (message.minTokenB !== undefined) {
      Coin.encode(message.minTokenB, writer.uint32(34).fork()).ldelim();
    }
    if (message.deadline !== BigInt(0)) {
      writer.uint32(40).int64(message.deadline);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgWithdraw {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgWithdraw();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.from = reader.string();
          break;
        case 2:
          message.shares = reader.string();
          break;
        case 3:
          message.minTokenA = Coin.decode(reader, reader.uint32());
          break;
        case 4:
          message.minTokenB = Coin.decode(reader, reader.uint32());
          break;
        case 5:
          message.deadline = reader.int64();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<MsgWithdraw>): MsgWithdraw {
    const message = createBaseMsgWithdraw();
    message.from = object.from ?? "";
    message.shares = object.shares ?? "";
    message.minTokenA = object.minTokenA !== undefined && object.minTokenA !== null ? Coin.fromPartial(object.minTokenA) : undefined;
    message.minTokenB = object.minTokenB !== undefined && object.minTokenB !== null ? Coin.fromPartial(object.minTokenB) : undefined;
    message.deadline = object.deadline !== undefined && object.deadline !== null ? BigInt(object.deadline.toString()) : BigInt(0);
    return message;
  },
  fromAmino(object: MsgWithdrawAmino): MsgWithdraw {
    const message = createBaseMsgWithdraw();
    if (object.from !== undefined && object.from !== null) {
      message.from = object.from;
    }
    if (object.shares !== undefined && object.shares !== null) {
      message.shares = object.shares;
    }
    if (object.min_token_a !== undefined && object.min_token_a !== null) {
      message.minTokenA = Coin.fromAmino(object.min_token_a);
    }
    if (object.min_token_b !== undefined && object.min_token_b !== null) {
      message.minTokenB = Coin.fromAmino(object.min_token_b);
    }
    if (object.deadline !== undefined && object.deadline !== null) {
      message.deadline = BigInt(object.deadline);
    }
    return message;
  },
  toAmino(message: MsgWithdraw): MsgWithdrawAmino {
    const obj: any = {};
    obj.from = message.from === "" ? undefined : message.from;
    obj.shares = message.shares === "" ? undefined : message.shares;
    obj.min_token_a = message.minTokenA ? Coin.toAmino(message.minTokenA) : undefined;
    obj.min_token_b = message.minTokenB ? Coin.toAmino(message.minTokenB) : undefined;
    obj.deadline = message.deadline !== BigInt(0) ? message.deadline.toString() : undefined;
    return obj;
  },
  fromAminoMsg(object: MsgWithdrawAminoMsg): MsgWithdraw {
    return MsgWithdraw.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgWithdrawProtoMsg): MsgWithdraw {
    return MsgWithdraw.decode(message.value);
  },
  toProto(message: MsgWithdraw): Uint8Array {
    return MsgWithdraw.encode(message).finish();
  },
  toProtoMsg(message: MsgWithdraw): MsgWithdrawProtoMsg {
    return {
      typeUrl: "/kava.swap.v1beta1.MsgWithdraw",
      value: MsgWithdraw.encode(message).finish()
    };
  }
};
function createBaseMsgWithdrawResponse(): MsgWithdrawResponse {
  return {};
}
export const MsgWithdrawResponse = {
  typeUrl: "/kava.swap.v1beta1.MsgWithdrawResponse",
  encode(_: MsgWithdrawResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgWithdrawResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgWithdrawResponse();
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
  fromPartial(_: Partial<MsgWithdrawResponse>): MsgWithdrawResponse {
    const message = createBaseMsgWithdrawResponse();
    return message;
  },
  fromAmino(_: MsgWithdrawResponseAmino): MsgWithdrawResponse {
    const message = createBaseMsgWithdrawResponse();
    return message;
  },
  toAmino(_: MsgWithdrawResponse): MsgWithdrawResponseAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: MsgWithdrawResponseAminoMsg): MsgWithdrawResponse {
    return MsgWithdrawResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgWithdrawResponseProtoMsg): MsgWithdrawResponse {
    return MsgWithdrawResponse.decode(message.value);
  },
  toProto(message: MsgWithdrawResponse): Uint8Array {
    return MsgWithdrawResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgWithdrawResponse): MsgWithdrawResponseProtoMsg {
    return {
      typeUrl: "/kava.swap.v1beta1.MsgWithdrawResponse",
      value: MsgWithdrawResponse.encode(message).finish()
    };
  }
};
function createBaseMsgSwapExactForTokens(): MsgSwapExactForTokens {
  return {
    requester: "",
    exactTokenA: Coin.fromPartial({}),
    tokenB: Coin.fromPartial({}),
    slippage: "",
    deadline: BigInt(0)
  };
}
export const MsgSwapExactForTokens = {
  typeUrl: "/kava.swap.v1beta1.MsgSwapExactForTokens",
  encode(message: MsgSwapExactForTokens, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.requester !== "") {
      writer.uint32(10).string(message.requester);
    }
    if (message.exactTokenA !== undefined) {
      Coin.encode(message.exactTokenA, writer.uint32(18).fork()).ldelim();
    }
    if (message.tokenB !== undefined) {
      Coin.encode(message.tokenB, writer.uint32(26).fork()).ldelim();
    }
    if (message.slippage !== "") {
      writer.uint32(34).string(Decimal.fromUserInput(message.slippage, 18).atomics);
    }
    if (message.deadline !== BigInt(0)) {
      writer.uint32(40).int64(message.deadline);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgSwapExactForTokens {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSwapExactForTokens();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.requester = reader.string();
          break;
        case 2:
          message.exactTokenA = Coin.decode(reader, reader.uint32());
          break;
        case 3:
          message.tokenB = Coin.decode(reader, reader.uint32());
          break;
        case 4:
          message.slippage = Decimal.fromAtomics(reader.string(), 18).toString();
          break;
        case 5:
          message.deadline = reader.int64();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<MsgSwapExactForTokens>): MsgSwapExactForTokens {
    const message = createBaseMsgSwapExactForTokens();
    message.requester = object.requester ?? "";
    message.exactTokenA = object.exactTokenA !== undefined && object.exactTokenA !== null ? Coin.fromPartial(object.exactTokenA) : undefined;
    message.tokenB = object.tokenB !== undefined && object.tokenB !== null ? Coin.fromPartial(object.tokenB) : undefined;
    message.slippage = object.slippage ?? "";
    message.deadline = object.deadline !== undefined && object.deadline !== null ? BigInt(object.deadline.toString()) : BigInt(0);
    return message;
  },
  fromAmino(object: MsgSwapExactForTokensAmino): MsgSwapExactForTokens {
    const message = createBaseMsgSwapExactForTokens();
    if (object.requester !== undefined && object.requester !== null) {
      message.requester = object.requester;
    }
    if (object.exact_token_a !== undefined && object.exact_token_a !== null) {
      message.exactTokenA = Coin.fromAmino(object.exact_token_a);
    }
    if (object.token_b !== undefined && object.token_b !== null) {
      message.tokenB = Coin.fromAmino(object.token_b);
    }
    if (object.slippage !== undefined && object.slippage !== null) {
      message.slippage = object.slippage;
    }
    if (object.deadline !== undefined && object.deadline !== null) {
      message.deadline = BigInt(object.deadline);
    }
    return message;
  },
  toAmino(message: MsgSwapExactForTokens): MsgSwapExactForTokensAmino {
    const obj: any = {};
    obj.requester = message.requester === "" ? undefined : message.requester;
    obj.exact_token_a = message.exactTokenA ? Coin.toAmino(message.exactTokenA) : undefined;
    obj.token_b = message.tokenB ? Coin.toAmino(message.tokenB) : undefined;
    obj.slippage = message.slippage === "" ? undefined : message.slippage;
    obj.deadline = message.deadline !== BigInt(0) ? message.deadline.toString() : undefined;
    return obj;
  },
  fromAminoMsg(object: MsgSwapExactForTokensAminoMsg): MsgSwapExactForTokens {
    return MsgSwapExactForTokens.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgSwapExactForTokensProtoMsg): MsgSwapExactForTokens {
    return MsgSwapExactForTokens.decode(message.value);
  },
  toProto(message: MsgSwapExactForTokens): Uint8Array {
    return MsgSwapExactForTokens.encode(message).finish();
  },
  toProtoMsg(message: MsgSwapExactForTokens): MsgSwapExactForTokensProtoMsg {
    return {
      typeUrl: "/kava.swap.v1beta1.MsgSwapExactForTokens",
      value: MsgSwapExactForTokens.encode(message).finish()
    };
  }
};
function createBaseMsgSwapExactForTokensResponse(): MsgSwapExactForTokensResponse {
  return {};
}
export const MsgSwapExactForTokensResponse = {
  typeUrl: "/kava.swap.v1beta1.MsgSwapExactForTokensResponse",
  encode(_: MsgSwapExactForTokensResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgSwapExactForTokensResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSwapExactForTokensResponse();
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
  fromPartial(_: Partial<MsgSwapExactForTokensResponse>): MsgSwapExactForTokensResponse {
    const message = createBaseMsgSwapExactForTokensResponse();
    return message;
  },
  fromAmino(_: MsgSwapExactForTokensResponseAmino): MsgSwapExactForTokensResponse {
    const message = createBaseMsgSwapExactForTokensResponse();
    return message;
  },
  toAmino(_: MsgSwapExactForTokensResponse): MsgSwapExactForTokensResponseAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: MsgSwapExactForTokensResponseAminoMsg): MsgSwapExactForTokensResponse {
    return MsgSwapExactForTokensResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgSwapExactForTokensResponseProtoMsg): MsgSwapExactForTokensResponse {
    return MsgSwapExactForTokensResponse.decode(message.value);
  },
  toProto(message: MsgSwapExactForTokensResponse): Uint8Array {
    return MsgSwapExactForTokensResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgSwapExactForTokensResponse): MsgSwapExactForTokensResponseProtoMsg {
    return {
      typeUrl: "/kava.swap.v1beta1.MsgSwapExactForTokensResponse",
      value: MsgSwapExactForTokensResponse.encode(message).finish()
    };
  }
};
function createBaseMsgSwapForExactTokens(): MsgSwapForExactTokens {
  return {
    requester: "",
    tokenA: Coin.fromPartial({}),
    exactTokenB: Coin.fromPartial({}),
    slippage: "",
    deadline: BigInt(0)
  };
}
export const MsgSwapForExactTokens = {
  typeUrl: "/kava.swap.v1beta1.MsgSwapForExactTokens",
  encode(message: MsgSwapForExactTokens, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.requester !== "") {
      writer.uint32(10).string(message.requester);
    }
    if (message.tokenA !== undefined) {
      Coin.encode(message.tokenA, writer.uint32(18).fork()).ldelim();
    }
    if (message.exactTokenB !== undefined) {
      Coin.encode(message.exactTokenB, writer.uint32(26).fork()).ldelim();
    }
    if (message.slippage !== "") {
      writer.uint32(34).string(Decimal.fromUserInput(message.slippage, 18).atomics);
    }
    if (message.deadline !== BigInt(0)) {
      writer.uint32(40).int64(message.deadline);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgSwapForExactTokens {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSwapForExactTokens();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.requester = reader.string();
          break;
        case 2:
          message.tokenA = Coin.decode(reader, reader.uint32());
          break;
        case 3:
          message.exactTokenB = Coin.decode(reader, reader.uint32());
          break;
        case 4:
          message.slippage = Decimal.fromAtomics(reader.string(), 18).toString();
          break;
        case 5:
          message.deadline = reader.int64();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<MsgSwapForExactTokens>): MsgSwapForExactTokens {
    const message = createBaseMsgSwapForExactTokens();
    message.requester = object.requester ?? "";
    message.tokenA = object.tokenA !== undefined && object.tokenA !== null ? Coin.fromPartial(object.tokenA) : undefined;
    message.exactTokenB = object.exactTokenB !== undefined && object.exactTokenB !== null ? Coin.fromPartial(object.exactTokenB) : undefined;
    message.slippage = object.slippage ?? "";
    message.deadline = object.deadline !== undefined && object.deadline !== null ? BigInt(object.deadline.toString()) : BigInt(0);
    return message;
  },
  fromAmino(object: MsgSwapForExactTokensAmino): MsgSwapForExactTokens {
    const message = createBaseMsgSwapForExactTokens();
    if (object.requester !== undefined && object.requester !== null) {
      message.requester = object.requester;
    }
    if (object.token_a !== undefined && object.token_a !== null) {
      message.tokenA = Coin.fromAmino(object.token_a);
    }
    if (object.exact_token_b !== undefined && object.exact_token_b !== null) {
      message.exactTokenB = Coin.fromAmino(object.exact_token_b);
    }
    if (object.slippage !== undefined && object.slippage !== null) {
      message.slippage = object.slippage;
    }
    if (object.deadline !== undefined && object.deadline !== null) {
      message.deadline = BigInt(object.deadline);
    }
    return message;
  },
  toAmino(message: MsgSwapForExactTokens): MsgSwapForExactTokensAmino {
    const obj: any = {};
    obj.requester = message.requester === "" ? undefined : message.requester;
    obj.token_a = message.tokenA ? Coin.toAmino(message.tokenA) : undefined;
    obj.exact_token_b = message.exactTokenB ? Coin.toAmino(message.exactTokenB) : undefined;
    obj.slippage = message.slippage === "" ? undefined : message.slippage;
    obj.deadline = message.deadline !== BigInt(0) ? message.deadline.toString() : undefined;
    return obj;
  },
  fromAminoMsg(object: MsgSwapForExactTokensAminoMsg): MsgSwapForExactTokens {
    return MsgSwapForExactTokens.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgSwapForExactTokensProtoMsg): MsgSwapForExactTokens {
    return MsgSwapForExactTokens.decode(message.value);
  },
  toProto(message: MsgSwapForExactTokens): Uint8Array {
    return MsgSwapForExactTokens.encode(message).finish();
  },
  toProtoMsg(message: MsgSwapForExactTokens): MsgSwapForExactTokensProtoMsg {
    return {
      typeUrl: "/kava.swap.v1beta1.MsgSwapForExactTokens",
      value: MsgSwapForExactTokens.encode(message).finish()
    };
  }
};
function createBaseMsgSwapForExactTokensResponse(): MsgSwapForExactTokensResponse {
  return {};
}
export const MsgSwapForExactTokensResponse = {
  typeUrl: "/kava.swap.v1beta1.MsgSwapForExactTokensResponse",
  encode(_: MsgSwapForExactTokensResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgSwapForExactTokensResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSwapForExactTokensResponse();
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
  fromPartial(_: Partial<MsgSwapForExactTokensResponse>): MsgSwapForExactTokensResponse {
    const message = createBaseMsgSwapForExactTokensResponse();
    return message;
  },
  fromAmino(_: MsgSwapForExactTokensResponseAmino): MsgSwapForExactTokensResponse {
    const message = createBaseMsgSwapForExactTokensResponse();
    return message;
  },
  toAmino(_: MsgSwapForExactTokensResponse): MsgSwapForExactTokensResponseAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: MsgSwapForExactTokensResponseAminoMsg): MsgSwapForExactTokensResponse {
    return MsgSwapForExactTokensResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgSwapForExactTokensResponseProtoMsg): MsgSwapForExactTokensResponse {
    return MsgSwapForExactTokensResponse.decode(message.value);
  },
  toProto(message: MsgSwapForExactTokensResponse): Uint8Array {
    return MsgSwapForExactTokensResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgSwapForExactTokensResponse): MsgSwapForExactTokensResponseProtoMsg {
    return {
      typeUrl: "/kava.swap.v1beta1.MsgSwapForExactTokensResponse",
      value: MsgSwapForExactTokensResponse.encode(message).finish()
    };
  }
};