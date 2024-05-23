//@ts-nocheck
import { Coin, CoinAmino, CoinSDKType } from "../../typesV2/cosmos/base/v1beta1/coin";
import { Timestamp } from "../../typesV2/google/protobuf/timestamp";
import { BinaryReader, BinaryWriter } from "../../binary";
import { Decimal } from "@cosmjs/math";
import { toTimestamp, fromTimestamp } from "../../helpers";
export interface MsgSuperfluidDelegate {
    sender: string;
    lockId: bigint;
    valAddr: string;
}
export interface MsgSuperfluidDelegateProtoMsg {
    typeUrl: "/osmosis.superfluid.MsgSuperfluidDelegate";
    value: Uint8Array;
}
export interface MsgSuperfluidDelegateAmino {
    sender?: string;
    lock_id?: string;
    val_addr?: string;
}
export interface MsgSuperfluidDelegateAminoMsg {
    type: "osmosis/superfluid-delegate";
    value: MsgSuperfluidDelegateAmino;
}
export interface MsgSuperfluidDelegateSDKType {
    sender: string;
    lock_id: bigint;
    val_addr: string;
}
export interface MsgSuperfluidDelegateResponse {}
export interface MsgSuperfluidDelegateResponseProtoMsg {
    typeUrl: "/osmosis.superfluid.MsgSuperfluidDelegateResponse";
    value: Uint8Array;
}
export interface MsgSuperfluidDelegateResponseAmino {}
export interface MsgSuperfluidDelegateResponseAminoMsg {
    type: "osmosis/superfluid-delegate-response";
    value: MsgSuperfluidDelegateResponseAmino;
}
export interface MsgSuperfluidDelegateResponseSDKType {}
export interface MsgSuperfluidUndelegate {
    sender: string;
    lockId: bigint;
}
export interface MsgSuperfluidUndelegateProtoMsg {
    typeUrl: "/osmosis.superfluid.MsgSuperfluidUndelegate";
    value: Uint8Array;
}
export interface MsgSuperfluidUndelegateAmino {
    sender?: string;
    lock_id?: string;
}
export interface MsgSuperfluidUndelegateAminoMsg {
    type: "osmosis/superfluid-undelegate";
    value: MsgSuperfluidUndelegateAmino;
}
export interface MsgSuperfluidUndelegateSDKType {
    sender: string;
    lock_id: bigint;
}
export interface MsgSuperfluidUndelegateResponse {}
export interface MsgSuperfluidUndelegateResponseProtoMsg {
    typeUrl: "/osmosis.superfluid.MsgSuperfluidUndelegateResponse";
    value: Uint8Array;
}
export interface MsgSuperfluidUndelegateResponseAmino {}
export interface MsgSuperfluidUndelegateResponseAminoMsg {
    type: "osmosis/superfluid-undelegate-response";
    value: MsgSuperfluidUndelegateResponseAmino;
}
export interface MsgSuperfluidUndelegateResponseSDKType {}
export interface MsgSuperfluidUnbondLock {
    sender: string;
    lockId: bigint;
}
export interface MsgSuperfluidUnbondLockProtoMsg {
    typeUrl: "/osmosis.superfluid.MsgSuperfluidUnbondLock";
    value: Uint8Array;
}
export interface MsgSuperfluidUnbondLockAmino {
    sender?: string;
    lock_id?: string;
}
export interface MsgSuperfluidUnbondLockAminoMsg {
    type: "osmosis/superfluid-unbond-lock";
    value: MsgSuperfluidUnbondLockAmino;
}
export interface MsgSuperfluidUnbondLockSDKType {
    sender: string;
    lock_id: bigint;
}
export interface MsgSuperfluidUnbondLockResponse {}
export interface MsgSuperfluidUnbondLockResponseProtoMsg {
    typeUrl: "/osmosis.superfluid.MsgSuperfluidUnbondLockResponse";
    value: Uint8Array;
}
export interface MsgSuperfluidUnbondLockResponseAmino {}
export interface MsgSuperfluidUnbondLockResponseAminoMsg {
    type: "osmosis/superfluid-unbond-lock-response";
    value: MsgSuperfluidUnbondLockResponseAmino;
}
export interface MsgSuperfluidUnbondLockResponseSDKType {}
export interface MsgSuperfluidUndelegateAndUnbondLock {
    sender: string;
    lockId: bigint;
    /** Amount of unlocking coin. */
    coin: Coin;
}
export interface MsgSuperfluidUndelegateAndUnbondLockProtoMsg {
    typeUrl: "/osmosis.superfluid.MsgSuperfluidUndelegateAndUnbondLock";
    value: Uint8Array;
}
export interface MsgSuperfluidUndelegateAndUnbondLockAmino {
    sender?: string;
    lock_id?: string;
    /** Amount of unlocking coin. */
    coin?: CoinAmino;
}
export interface MsgSuperfluidUndelegateAndUnbondLockAminoMsg {
    type: "osmosis/superfluid-undelegate-and-unbond-lock";
    value: MsgSuperfluidUndelegateAndUnbondLockAmino;
}
export interface MsgSuperfluidUndelegateAndUnbondLockSDKType {
    sender: string;
    lock_id: bigint;
    coin: CoinSDKType;
}
export interface MsgSuperfluidUndelegateAndUnbondLockResponse {
    /**
     * lock id of the new lock created for the remaining amount.
     * returns the original lockid if the unlocked amount is equal to the
     * original lock's amount.
     */
    lockId: bigint;
}
export interface MsgSuperfluidUndelegateAndUnbondLockResponseProtoMsg {
    typeUrl: "/osmosis.superfluid.MsgSuperfluidUndelegateAndUnbondLockResponse";
    value: Uint8Array;
}
export interface MsgSuperfluidUndelegateAndUnbondLockResponseAmino {
    /**
     * lock id of the new lock created for the remaining amount.
     * returns the original lockid if the unlocked amount is equal to the
     * original lock's amount.
     */
    lock_id?: string;
}
export interface MsgSuperfluidUndelegateAndUnbondLockResponseAminoMsg {
    type: "osmosis/superfluid-undelegate-and-unbond-lock-response";
    value: MsgSuperfluidUndelegateAndUnbondLockResponseAmino;
}
export interface MsgSuperfluidUndelegateAndUnbondLockResponseSDKType {
    lock_id: bigint;
}
/**
 * MsgLockAndSuperfluidDelegate locks coins with the unbonding period duration,
 * and then does a superfluid lock from the newly created lockup, to the
 * specified validator addr.
 */
export interface MsgLockAndSuperfluidDelegate {
    sender: string;
    coins: Coin[];
    valAddr: string;
}
export interface MsgLockAndSuperfluidDelegateProtoMsg {
    typeUrl: "/osmosis.superfluid.MsgLockAndSuperfluidDelegate";
    value: Uint8Array;
}
/**
 * MsgLockAndSuperfluidDelegate locks coins with the unbonding period duration,
 * and then does a superfluid lock from the newly created lockup, to the
 * specified validator addr.
 */
export interface MsgLockAndSuperfluidDelegateAmino {
    sender?: string;
    coins?: CoinAmino[];
    val_addr?: string;
}
export interface MsgLockAndSuperfluidDelegateAminoMsg {
    type: "osmosis/lock-and-superfluid-delegate";
    value: MsgLockAndSuperfluidDelegateAmino;
}
/**
 * MsgLockAndSuperfluidDelegate locks coins with the unbonding period duration,
 * and then does a superfluid lock from the newly created lockup, to the
 * specified validator addr.
 */
export interface MsgLockAndSuperfluidDelegateSDKType {
    sender: string;
    coins: CoinSDKType[];
    val_addr: string;
}
export interface MsgLockAndSuperfluidDelegateResponse {
    ID: bigint;
}
export interface MsgLockAndSuperfluidDelegateResponseProtoMsg {
    typeUrl: "/osmosis.superfluid.MsgLockAndSuperfluidDelegateResponse";
    value: Uint8Array;
}
export interface MsgLockAndSuperfluidDelegateResponseAmino {
    ID?: string;
}
export interface MsgLockAndSuperfluidDelegateResponseAminoMsg {
    type: "osmosis/lock-and-superfluid-delegate-response";
    value: MsgLockAndSuperfluidDelegateResponseAmino;
}
export interface MsgLockAndSuperfluidDelegateResponseSDKType {
    ID: bigint;
}
/**
 * MsgCreateFullRangePositionAndSuperfluidDelegate creates a full range position
 * in a concentrated liquidity pool, then superfluid delegates.
 */
export interface MsgCreateFullRangePositionAndSuperfluidDelegate {
    sender: string;
    coins: Coin[];
    valAddr: string;
    poolId: bigint;
}
export interface MsgCreateFullRangePositionAndSuperfluidDelegateProtoMsg {
    typeUrl: "/osmosis.superfluid.MsgCreateFullRangePositionAndSuperfluidDelegate";
    value: Uint8Array;
}
/**
 * MsgCreateFullRangePositionAndSuperfluidDelegate creates a full range position
 * in a concentrated liquidity pool, then superfluid delegates.
 */
export interface MsgCreateFullRangePositionAndSuperfluidDelegateAmino {
    sender?: string;
    coins?: CoinAmino[];
    val_addr?: string;
    pool_id?: string;
}
export interface MsgCreateFullRangePositionAndSuperfluidDelegateAminoMsg {
    type: "osmosis/full-range-and-sf-delegate";
    value: MsgCreateFullRangePositionAndSuperfluidDelegateAmino;
}
/**
 * MsgCreateFullRangePositionAndSuperfluidDelegate creates a full range position
 * in a concentrated liquidity pool, then superfluid delegates.
 */
export interface MsgCreateFullRangePositionAndSuperfluidDelegateSDKType {
    sender: string;
    coins: CoinSDKType[];
    val_addr: string;
    pool_id: bigint;
}
export interface MsgCreateFullRangePositionAndSuperfluidDelegateResponse {
    lockID: bigint;
    positionID: bigint;
}
export interface MsgCreateFullRangePositionAndSuperfluidDelegateResponseProtoMsg {
    typeUrl: "/osmosis.superfluid.MsgCreateFullRangePositionAndSuperfluidDelegateResponse";
    value: Uint8Array;
}
export interface MsgCreateFullRangePositionAndSuperfluidDelegateResponseAmino {
    lockID?: string;
    positionID?: string;
}
export interface MsgCreateFullRangePositionAndSuperfluidDelegateResponseAminoMsg {
    type: "osmosis/create-full-range-position-and-superfluid-delegate-response";
    value: MsgCreateFullRangePositionAndSuperfluidDelegateResponseAmino;
}
export interface MsgCreateFullRangePositionAndSuperfluidDelegateResponseSDKType {
    lockID: bigint;
    positionID: bigint;
}
/**
 * MsgUnPoolWhitelistedPool Unpools every lock the sender has, that is
 * associated with pool pool_id. If pool_id is not approved for unpooling by
 * governance, this is a no-op. Unpooling takes the locked gamm shares, and runs
 * "ExitPool" on it, to get the constituent tokens. e.g. z gamm/pool/1 tokens
 * ExitPools into constituent tokens x uatom, y uosmo. Then it creates a new
 * lock for every constituent token, with the duration associated with the lock.
 * If the lock was unbonding, the new lockup durations should be the time left
 * until unbond completion.
 */
export interface MsgUnPoolWhitelistedPool {
    sender: string;
    poolId: bigint;
}
export interface MsgUnPoolWhitelistedPoolProtoMsg {
    typeUrl: "/osmosis.superfluid.MsgUnPoolWhitelistedPool";
    value: Uint8Array;
}
/**
 * MsgUnPoolWhitelistedPool Unpools every lock the sender has, that is
 * associated with pool pool_id. If pool_id is not approved for unpooling by
 * governance, this is a no-op. Unpooling takes the locked gamm shares, and runs
 * "ExitPool" on it, to get the constituent tokens. e.g. z gamm/pool/1 tokens
 * ExitPools into constituent tokens x uatom, y uosmo. Then it creates a new
 * lock for every constituent token, with the duration associated with the lock.
 * If the lock was unbonding, the new lockup durations should be the time left
 * until unbond completion.
 */
export interface MsgUnPoolWhitelistedPoolAmino {
    sender?: string;
    pool_id?: string;
}
export interface MsgUnPoolWhitelistedPoolAminoMsg {
    type: "osmosis/unpool-whitelisted-pool";
    value: MsgUnPoolWhitelistedPoolAmino;
}
/**
 * MsgUnPoolWhitelistedPool Unpools every lock the sender has, that is
 * associated with pool pool_id. If pool_id is not approved for unpooling by
 * governance, this is a no-op. Unpooling takes the locked gamm shares, and runs
 * "ExitPool" on it, to get the constituent tokens. e.g. z gamm/pool/1 tokens
 * ExitPools into constituent tokens x uatom, y uosmo. Then it creates a new
 * lock for every constituent token, with the duration associated with the lock.
 * If the lock was unbonding, the new lockup durations should be the time left
 * until unbond completion.
 */
export interface MsgUnPoolWhitelistedPoolSDKType {
    sender: string;
    pool_id: bigint;
}
export interface MsgUnPoolWhitelistedPoolResponse {
    exitedLockIds: bigint[];
}
export interface MsgUnPoolWhitelistedPoolResponseProtoMsg {
    typeUrl: "/osmosis.superfluid.MsgUnPoolWhitelistedPoolResponse";
    value: Uint8Array;
}
export interface MsgUnPoolWhitelistedPoolResponseAmino {
    exited_lock_ids?: string[];
}
export interface MsgUnPoolWhitelistedPoolResponseAminoMsg {
    type: "osmosis/un-pool-whitelisted-pool-response";
    value: MsgUnPoolWhitelistedPoolResponseAmino;
}
export interface MsgUnPoolWhitelistedPoolResponseSDKType {
    exited_lock_ids: bigint[];
}
/**
 * =====================
 * MsgUnlockAndMigrateSharesToFullRangeConcentratedPosition
 */
export interface MsgUnlockAndMigrateSharesToFullRangeConcentratedPosition {
    sender: string;
    lockId: bigint;
    sharesToMigrate: Coin;
    /** token_out_mins indicates minimum token to exit Balancer pool with. */
    tokenOutMins: Coin[];
}
export interface MsgUnlockAndMigrateSharesToFullRangeConcentratedPositionProtoMsg {
    typeUrl: "/osmosis.superfluid.MsgUnlockAndMigrateSharesToFullRangeConcentratedPosition";
    value: Uint8Array;
}
/**
 * =====================
 * MsgUnlockAndMigrateSharesToFullRangeConcentratedPosition
 */
export interface MsgUnlockAndMigrateSharesToFullRangeConcentratedPositionAmino {
    sender?: string;
    lock_id?: string;
    shares_to_migrate?: CoinAmino;
    /** token_out_mins indicates minimum token to exit Balancer pool with. */
    token_out_mins?: CoinAmino[];
}
export interface MsgUnlockAndMigrateSharesToFullRangeConcentratedPositionAminoMsg {
    type: "osmosis/unlock-and-migrate";
    value: MsgUnlockAndMigrateSharesToFullRangeConcentratedPositionAmino;
}
/**
 * =====================
 * MsgUnlockAndMigrateSharesToFullRangeConcentratedPosition
 */
export interface MsgUnlockAndMigrateSharesToFullRangeConcentratedPositionSDKType {
    sender: string;
    lock_id: bigint;
    shares_to_migrate: CoinSDKType;
    token_out_mins: CoinSDKType[];
}
export interface MsgUnlockAndMigrateSharesToFullRangeConcentratedPositionResponse {
    amount0: string;
    amount1: string;
    liquidityCreated: string;
    joinTime: Date;
}
export interface MsgUnlockAndMigrateSharesToFullRangeConcentratedPositionResponseProtoMsg {
    typeUrl: "/osmosis.superfluid.MsgUnlockAndMigrateSharesToFullRangeConcentratedPositionResponse";
    value: Uint8Array;
}
export interface MsgUnlockAndMigrateSharesToFullRangeConcentratedPositionResponseAmino {
    amount0?: string;
    amount1?: string;
    liquidity_created?: string;
    join_time?: string;
}
export interface MsgUnlockAndMigrateSharesToFullRangeConcentratedPositionResponseAminoMsg {
    type: "osmosis/unlock-and-migrate-shares-to-full-range-concentrated-position-response";
    value: MsgUnlockAndMigrateSharesToFullRangeConcentratedPositionResponseAmino;
}
export interface MsgUnlockAndMigrateSharesToFullRangeConcentratedPositionResponseSDKType {
    amount0: string;
    amount1: string;
    liquidity_created: string;
    join_time: Date;
}
/** ===================== MsgAddToConcentratedLiquiditySuperfluidPosition */
export interface MsgAddToConcentratedLiquiditySuperfluidPosition {
    positionId: bigint;
    sender: string;
    tokenDesired0: Coin;
    tokenDesired1: Coin;
}
export interface MsgAddToConcentratedLiquiditySuperfluidPositionProtoMsg {
    typeUrl: "/osmosis.superfluid.MsgAddToConcentratedLiquiditySuperfluidPosition";
    value: Uint8Array;
}
/** ===================== MsgAddToConcentratedLiquiditySuperfluidPosition */
export interface MsgAddToConcentratedLiquiditySuperfluidPositionAmino {
    position_id?: string;
    sender?: string;
    token_desired0?: CoinAmino;
    token_desired1?: CoinAmino;
}
export interface MsgAddToConcentratedLiquiditySuperfluidPositionAminoMsg {
    type: "osmosis/add-to-cl-superfluid-position";
    value: MsgAddToConcentratedLiquiditySuperfluidPositionAmino;
}
/** ===================== MsgAddToConcentratedLiquiditySuperfluidPosition */
export interface MsgAddToConcentratedLiquiditySuperfluidPositionSDKType {
    position_id: bigint;
    sender: string;
    token_desired0: CoinSDKType;
    token_desired1: CoinSDKType;
}
export interface MsgAddToConcentratedLiquiditySuperfluidPositionResponse {
    positionId: bigint;
    amount0: string;
    amount1: string;
    /**
     * new_liquidity is the final liquidity after the add.
     * It includes the liquidity that existed before in the position
     * and the new liquidity that was added to the position.
     */
    newLiquidity: string;
    lockId: bigint;
}
export interface MsgAddToConcentratedLiquiditySuperfluidPositionResponseProtoMsg {
    typeUrl: "/osmosis.superfluid.MsgAddToConcentratedLiquiditySuperfluidPositionResponse";
    value: Uint8Array;
}
export interface MsgAddToConcentratedLiquiditySuperfluidPositionResponseAmino {
    position_id?: string;
    amount0?: string;
    amount1?: string;
    /**
     * new_liquidity is the final liquidity after the add.
     * It includes the liquidity that existed before in the position
     * and the new liquidity that was added to the position.
     */
    new_liquidity?: string;
    lock_id?: string;
}
export interface MsgAddToConcentratedLiquiditySuperfluidPositionResponseAminoMsg {
    type: "osmosis/add-to-concentrated-liquidity-superfluid-position-response";
    value: MsgAddToConcentratedLiquiditySuperfluidPositionResponseAmino;
}
export interface MsgAddToConcentratedLiquiditySuperfluidPositionResponseSDKType {
    position_id: bigint;
    amount0: string;
    amount1: string;
    new_liquidity: string;
    lock_id: bigint;
}
/** ===================== MsgUnbondConvertAndStake */
export interface MsgUnbondConvertAndStake {
    /**
     * lock ID to convert and stake.
     * lock id with 0 should be provided if converting liquid gamm shares to stake
     */
    lockId: bigint;
    sender: string;
    /**
     * validator address to delegate to.
     * If provided empty string, we use the validators returned from
     * valset-preference module.
     */
    valAddr: string;
    /** min_amt_to_stake indicates the minimum amount to stake after conversion */
    minAmtToStake: string;
    /**
     * shares_to_convert indicates shares wanted to stake.
     * Note that this field is only used for liquid(unlocked) gamm shares.
     * For all other cases, this field would be disregarded.
     */
    sharesToConvert: Coin;
}
export interface MsgUnbondConvertAndStakeProtoMsg {
    typeUrl: "/osmosis.superfluid.MsgUnbondConvertAndStake";
    value: Uint8Array;
}
/** ===================== MsgUnbondConvertAndStake */
export interface MsgUnbondConvertAndStakeAmino {
    /**
     * lock ID to convert and stake.
     * lock id with 0 should be provided if converting liquid gamm shares to stake
     */
    lock_id?: string;
    sender?: string;
    /**
     * validator address to delegate to.
     * If provided empty string, we use the validators returned from
     * valset-preference module.
     */
    val_addr?: string;
    /** min_amt_to_stake indicates the minimum amount to stake after conversion */
    min_amt_to_stake?: string;
    /**
     * shares_to_convert indicates shares wanted to stake.
     * Note that this field is only used for liquid(unlocked) gamm shares.
     * For all other cases, this field would be disregarded.
     */
    shares_to_convert?: CoinAmino;
}
export interface MsgUnbondConvertAndStakeAminoMsg {
    type: "osmosis/unbond-convert-and-stake";
    value: MsgUnbondConvertAndStakeAmino;
}
/** ===================== MsgUnbondConvertAndStake */
export interface MsgUnbondConvertAndStakeSDKType {
    lock_id: bigint;
    sender: string;
    val_addr: string;
    min_amt_to_stake: string;
    shares_to_convert: CoinSDKType;
}
export interface MsgUnbondConvertAndStakeResponse {
    totalAmtStaked: string;
}
export interface MsgUnbondConvertAndStakeResponseProtoMsg {
    typeUrl: "/osmosis.superfluid.MsgUnbondConvertAndStakeResponse";
    value: Uint8Array;
}
export interface MsgUnbondConvertAndStakeResponseAmino {
    total_amt_staked?: string;
}
export interface MsgUnbondConvertAndStakeResponseAminoMsg {
    type: "osmosis/unbond-convert-and-stake-response";
    value: MsgUnbondConvertAndStakeResponseAmino;
}
export interface MsgUnbondConvertAndStakeResponseSDKType {
    total_amt_staked: string;
}
function createBaseMsgSuperfluidDelegate(): MsgSuperfluidDelegate {
    return {
        sender: "",
        lockId: BigInt(0),
        valAddr: ""
    };
}
export const MsgSuperfluidDelegate = {
    typeUrl: "/osmosis.superfluid.MsgSuperfluidDelegate",
    aminoType: "osmosis/superfluid-delegate",
    is(o: any): o is MsgSuperfluidDelegate {
        return o && (o.$typeUrl === MsgSuperfluidDelegate.typeUrl || typeof o.sender === "string" && typeof o.lockId === "bigint" && typeof o.valAddr === "string");
    },
    isSDK(o: any): o is MsgSuperfluidDelegateSDKType {
        return o && (o.$typeUrl === MsgSuperfluidDelegate.typeUrl || typeof o.sender === "string" && typeof o.lock_id === "bigint" && typeof o.val_addr === "string");
    },
    isAmino(o: any): o is MsgSuperfluidDelegateAmino {
        return o && (o.$typeUrl === MsgSuperfluidDelegate.typeUrl || typeof o.sender === "string" && typeof o.lock_id === "bigint" && typeof o.val_addr === "string");
    },
    encode(message: MsgSuperfluidDelegate, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        if (message.sender !== "") {
            writer.uint32(10).string(message.sender);
        }
        if (message.lockId !== BigInt(0)) {
            writer.uint32(16).uint64(message.lockId);
        }
        if (message.valAddr !== "") {
            writer.uint32(26).string(message.valAddr);
        }
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): MsgSuperfluidDelegate {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgSuperfluidDelegate();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.sender = reader.string();
                    break;
                case 2:
                    message.lockId = reader.uint64();
                    break;
                case 3:
                    message.valAddr = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromPartial(object: Partial<MsgSuperfluidDelegate>): MsgSuperfluidDelegate {
        const message = createBaseMsgSuperfluidDelegate();
        message.sender = object.sender ?? "";
        message.lockId = object.lockId !== undefined && object.lockId !== null ? BigInt(object.lockId.toString()) : BigInt(0);
        message.valAddr = object.valAddr ?? "";
        return message;
    },
    fromAmino(object: MsgSuperfluidDelegateAmino): MsgSuperfluidDelegate {
        const message = createBaseMsgSuperfluidDelegate();
        if (object.sender !== undefined && object.sender !== null) {
            message.sender = object.sender;
        }
        if (object.lock_id !== undefined && object.lock_id !== null) {
            message.lockId = BigInt(object.lock_id);
        }
        if (object.val_addr !== undefined && object.val_addr !== null) {
            message.valAddr = object.val_addr;
        }
        return message;
    },
    toAmino(message: MsgSuperfluidDelegate): MsgSuperfluidDelegateAmino {
        const obj: any = {};
        obj.sender = message.sender === "" ? undefined : message.sender;
        obj.lock_id = message.lockId !== BigInt(0) ? message.lockId.toString() : undefined;
        obj.val_addr = message.valAddr === "" ? undefined : message.valAddr;
        return obj;
    },
    fromAminoMsg(object: MsgSuperfluidDelegateAminoMsg): MsgSuperfluidDelegate {
        return MsgSuperfluidDelegate.fromAmino(object.value);
    },
    toAminoMsg(message: MsgSuperfluidDelegate): MsgSuperfluidDelegateAminoMsg {
        return {
            type: "osmosis/superfluid-delegate",
            value: MsgSuperfluidDelegate.toAmino(message)
        };
    },
    fromProtoMsg(message: MsgSuperfluidDelegateProtoMsg): MsgSuperfluidDelegate {
        return MsgSuperfluidDelegate.decode(message.value);
    },
    toProto(message: MsgSuperfluidDelegate): Uint8Array {
        return MsgSuperfluidDelegate.encode(message).finish();
    },
    toProtoMsg(message: MsgSuperfluidDelegate): MsgSuperfluidDelegateProtoMsg {
        return {
            typeUrl: "/osmosis.superfluid.MsgSuperfluidDelegate",
            value: MsgSuperfluidDelegate.encode(message).finish()
        };
    }
};
function createBaseMsgSuperfluidDelegateResponse(): MsgSuperfluidDelegateResponse {
    return {};
}
export const MsgSuperfluidDelegateResponse = {
    typeUrl: "/osmosis.superfluid.MsgSuperfluidDelegateResponse",
    aminoType: "osmosis/superfluid-delegate-response",
    is(o: any): o is MsgSuperfluidDelegateResponse {
        return o && o.$typeUrl === MsgSuperfluidDelegateResponse.typeUrl;
    },
    isSDK(o: any): o is MsgSuperfluidDelegateResponseSDKType {
        return o && o.$typeUrl === MsgSuperfluidDelegateResponse.typeUrl;
    },
    isAmino(o: any): o is MsgSuperfluidDelegateResponseAmino {
        return o && o.$typeUrl === MsgSuperfluidDelegateResponse.typeUrl;
    },
    encode(_: MsgSuperfluidDelegateResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): MsgSuperfluidDelegateResponse {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgSuperfluidDelegateResponse();
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
    fromPartial(_: Partial<MsgSuperfluidDelegateResponse>): MsgSuperfluidDelegateResponse {
        const message = createBaseMsgSuperfluidDelegateResponse();
        return message;
    },
    fromAmino(_: MsgSuperfluidDelegateResponseAmino): MsgSuperfluidDelegateResponse {
        const message = createBaseMsgSuperfluidDelegateResponse();
        return message;
    },
    toAmino(_: MsgSuperfluidDelegateResponse): MsgSuperfluidDelegateResponseAmino {
        const obj: any = {};
        return obj;
    },
    fromAminoMsg(object: MsgSuperfluidDelegateResponseAminoMsg): MsgSuperfluidDelegateResponse {
        return MsgSuperfluidDelegateResponse.fromAmino(object.value);
    },
    toAminoMsg(message: MsgSuperfluidDelegateResponse): MsgSuperfluidDelegateResponseAminoMsg {
        return {
            type: "osmosis/superfluid-delegate-response",
            value: MsgSuperfluidDelegateResponse.toAmino(message)
        };
    },
    fromProtoMsg(message: MsgSuperfluidDelegateResponseProtoMsg): MsgSuperfluidDelegateResponse {
        return MsgSuperfluidDelegateResponse.decode(message.value);
    },
    toProto(message: MsgSuperfluidDelegateResponse): Uint8Array {
        return MsgSuperfluidDelegateResponse.encode(message).finish();
    },
    toProtoMsg(message: MsgSuperfluidDelegateResponse): MsgSuperfluidDelegateResponseProtoMsg {
        return {
            typeUrl: "/osmosis.superfluid.MsgSuperfluidDelegateResponse",
            value: MsgSuperfluidDelegateResponse.encode(message).finish()
        };
    }
};
function createBaseMsgSuperfluidUndelegate(): MsgSuperfluidUndelegate {
    return {
        sender: "",
        lockId: BigInt(0)
    };
}
export const MsgSuperfluidUndelegate = {
    typeUrl: "/osmosis.superfluid.MsgSuperfluidUndelegate",
    aminoType: "osmosis/superfluid-undelegate",
    is(o: any): o is MsgSuperfluidUndelegate {
        return o && (o.$typeUrl === MsgSuperfluidUndelegate.typeUrl || typeof o.sender === "string" && typeof o.lockId === "bigint");
    },
    isSDK(o: any): o is MsgSuperfluidUndelegateSDKType {
        return o && (o.$typeUrl === MsgSuperfluidUndelegate.typeUrl || typeof o.sender === "string" && typeof o.lock_id === "bigint");
    },
    isAmino(o: any): o is MsgSuperfluidUndelegateAmino {
        return o && (o.$typeUrl === MsgSuperfluidUndelegate.typeUrl || typeof o.sender === "string" && typeof o.lock_id === "bigint");
    },
    encode(message: MsgSuperfluidUndelegate, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        if (message.sender !== "") {
            writer.uint32(10).string(message.sender);
        }
        if (message.lockId !== BigInt(0)) {
            writer.uint32(16).uint64(message.lockId);
        }
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): MsgSuperfluidUndelegate {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgSuperfluidUndelegate();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.sender = reader.string();
                    break;
                case 2:
                    message.lockId = reader.uint64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromPartial(object: Partial<MsgSuperfluidUndelegate>): MsgSuperfluidUndelegate {
        const message = createBaseMsgSuperfluidUndelegate();
        message.sender = object.sender ?? "";
        message.lockId = object.lockId !== undefined && object.lockId !== null ? BigInt(object.lockId.toString()) : BigInt(0);
        return message;
    },
    fromAmino(object: MsgSuperfluidUndelegateAmino): MsgSuperfluidUndelegate {
        const message = createBaseMsgSuperfluidUndelegate();
        if (object.sender !== undefined && object.sender !== null) {
            message.sender = object.sender;
        }
        if (object.lock_id !== undefined && object.lock_id !== null) {
            message.lockId = BigInt(object.lock_id);
        }
        return message;
    },
    toAmino(message: MsgSuperfluidUndelegate): MsgSuperfluidUndelegateAmino {
        const obj: any = {};
        obj.sender = message.sender === "" ? undefined : message.sender;
        obj.lock_id = message.lockId !== BigInt(0) ? message.lockId.toString() : undefined;
        return obj;
    },
    fromAminoMsg(object: MsgSuperfluidUndelegateAminoMsg): MsgSuperfluidUndelegate {
        return MsgSuperfluidUndelegate.fromAmino(object.value);
    },
    toAminoMsg(message: MsgSuperfluidUndelegate): MsgSuperfluidUndelegateAminoMsg {
        return {
            type: "osmosis/superfluid-undelegate",
            value: MsgSuperfluidUndelegate.toAmino(message)
        };
    },
    fromProtoMsg(message: MsgSuperfluidUndelegateProtoMsg): MsgSuperfluidUndelegate {
        return MsgSuperfluidUndelegate.decode(message.value);
    },
    toProto(message: MsgSuperfluidUndelegate): Uint8Array {
        return MsgSuperfluidUndelegate.encode(message).finish();
    },
    toProtoMsg(message: MsgSuperfluidUndelegate): MsgSuperfluidUndelegateProtoMsg {
        return {
            typeUrl: "/osmosis.superfluid.MsgSuperfluidUndelegate",
            value: MsgSuperfluidUndelegate.encode(message).finish()
        };
    }
};
function createBaseMsgSuperfluidUndelegateResponse(): MsgSuperfluidUndelegateResponse {
    return {};
}
export const MsgSuperfluidUndelegateResponse = {
    typeUrl: "/osmosis.superfluid.MsgSuperfluidUndelegateResponse",
    aminoType: "osmosis/superfluid-undelegate-response",
    is(o: any): o is MsgSuperfluidUndelegateResponse {
        return o && o.$typeUrl === MsgSuperfluidUndelegateResponse.typeUrl;
    },
    isSDK(o: any): o is MsgSuperfluidUndelegateResponseSDKType {
        return o && o.$typeUrl === MsgSuperfluidUndelegateResponse.typeUrl;
    },
    isAmino(o: any): o is MsgSuperfluidUndelegateResponseAmino {
        return o && o.$typeUrl === MsgSuperfluidUndelegateResponse.typeUrl;
    },
    encode(_: MsgSuperfluidUndelegateResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): MsgSuperfluidUndelegateResponse {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgSuperfluidUndelegateResponse();
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
    fromPartial(_: Partial<MsgSuperfluidUndelegateResponse>): MsgSuperfluidUndelegateResponse {
        const message = createBaseMsgSuperfluidUndelegateResponse();
        return message;
    },
    fromAmino(_: MsgSuperfluidUndelegateResponseAmino): MsgSuperfluidUndelegateResponse {
        const message = createBaseMsgSuperfluidUndelegateResponse();
        return message;
    },
    toAmino(_: MsgSuperfluidUndelegateResponse): MsgSuperfluidUndelegateResponseAmino {
        const obj: any = {};
        return obj;
    },
    fromAminoMsg(object: MsgSuperfluidUndelegateResponseAminoMsg): MsgSuperfluidUndelegateResponse {
        return MsgSuperfluidUndelegateResponse.fromAmino(object.value);
    },
    toAminoMsg(message: MsgSuperfluidUndelegateResponse): MsgSuperfluidUndelegateResponseAminoMsg {
        return {
            type: "osmosis/superfluid-undelegate-response",
            value: MsgSuperfluidUndelegateResponse.toAmino(message)
        };
    },
    fromProtoMsg(message: MsgSuperfluidUndelegateResponseProtoMsg): MsgSuperfluidUndelegateResponse {
        return MsgSuperfluidUndelegateResponse.decode(message.value);
    },
    toProto(message: MsgSuperfluidUndelegateResponse): Uint8Array {
        return MsgSuperfluidUndelegateResponse.encode(message).finish();
    },
    toProtoMsg(message: MsgSuperfluidUndelegateResponse): MsgSuperfluidUndelegateResponseProtoMsg {
        return {
            typeUrl: "/osmosis.superfluid.MsgSuperfluidUndelegateResponse",
            value: MsgSuperfluidUndelegateResponse.encode(message).finish()
        };
    }
};
function createBaseMsgSuperfluidUnbondLock(): MsgSuperfluidUnbondLock {
    return {
        sender: "",
        lockId: BigInt(0)
    };
}
export const MsgSuperfluidUnbondLock = {
    typeUrl: "/osmosis.superfluid.MsgSuperfluidUnbondLock",
    aminoType: "osmosis/superfluid-unbond-lock",
    is(o: any): o is MsgSuperfluidUnbondLock {
        return o && (o.$typeUrl === MsgSuperfluidUnbondLock.typeUrl || typeof o.sender === "string" && typeof o.lockId === "bigint");
    },
    isSDK(o: any): o is MsgSuperfluidUnbondLockSDKType {
        return o && (o.$typeUrl === MsgSuperfluidUnbondLock.typeUrl || typeof o.sender === "string" && typeof o.lock_id === "bigint");
    },
    isAmino(o: any): o is MsgSuperfluidUnbondLockAmino {
        return o && (o.$typeUrl === MsgSuperfluidUnbondLock.typeUrl || typeof o.sender === "string" && typeof o.lock_id === "bigint");
    },
    encode(message: MsgSuperfluidUnbondLock, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        if (message.sender !== "") {
            writer.uint32(10).string(message.sender);
        }
        if (message.lockId !== BigInt(0)) {
            writer.uint32(16).uint64(message.lockId);
        }
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): MsgSuperfluidUnbondLock {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgSuperfluidUnbondLock();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.sender = reader.string();
                    break;
                case 2:
                    message.lockId = reader.uint64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromPartial(object: Partial<MsgSuperfluidUnbondLock>): MsgSuperfluidUnbondLock {
        const message = createBaseMsgSuperfluidUnbondLock();
        message.sender = object.sender ?? "";
        message.lockId = object.lockId !== undefined && object.lockId !== null ? BigInt(object.lockId.toString()) : BigInt(0);
        return message;
    },
    fromAmino(object: MsgSuperfluidUnbondLockAmino): MsgSuperfluidUnbondLock {
        const message = createBaseMsgSuperfluidUnbondLock();
        if (object.sender !== undefined && object.sender !== null) {
            message.sender = object.sender;
        }
        if (object.lock_id !== undefined && object.lock_id !== null) {
            message.lockId = BigInt(object.lock_id);
        }
        return message;
    },
    toAmino(message: MsgSuperfluidUnbondLock): MsgSuperfluidUnbondLockAmino {
        const obj: any = {};
        obj.sender = message.sender === "" ? undefined : message.sender;
        obj.lock_id = message.lockId !== BigInt(0) ? message.lockId.toString() : undefined;
        return obj;
    },
    fromAminoMsg(object: MsgSuperfluidUnbondLockAminoMsg): MsgSuperfluidUnbondLock {
        return MsgSuperfluidUnbondLock.fromAmino(object.value);
    },
    toAminoMsg(message: MsgSuperfluidUnbondLock): MsgSuperfluidUnbondLockAminoMsg {
        return {
            type: "osmosis/superfluid-unbond-lock",
            value: MsgSuperfluidUnbondLock.toAmino(message)
        };
    },
    fromProtoMsg(message: MsgSuperfluidUnbondLockProtoMsg): MsgSuperfluidUnbondLock {
        return MsgSuperfluidUnbondLock.decode(message.value);
    },
    toProto(message: MsgSuperfluidUnbondLock): Uint8Array {
        return MsgSuperfluidUnbondLock.encode(message).finish();
    },
    toProtoMsg(message: MsgSuperfluidUnbondLock): MsgSuperfluidUnbondLockProtoMsg {
        return {
            typeUrl: "/osmosis.superfluid.MsgSuperfluidUnbondLock",
            value: MsgSuperfluidUnbondLock.encode(message).finish()
        };
    }
};
function createBaseMsgSuperfluidUnbondLockResponse(): MsgSuperfluidUnbondLockResponse {
    return {};
}
export const MsgSuperfluidUnbondLockResponse = {
    typeUrl: "/osmosis.superfluid.MsgSuperfluidUnbondLockResponse",
    aminoType: "osmosis/superfluid-unbond-lock-response",
    is(o: any): o is MsgSuperfluidUnbondLockResponse {
        return o && o.$typeUrl === MsgSuperfluidUnbondLockResponse.typeUrl;
    },
    isSDK(o: any): o is MsgSuperfluidUnbondLockResponseSDKType {
        return o && o.$typeUrl === MsgSuperfluidUnbondLockResponse.typeUrl;
    },
    isAmino(o: any): o is MsgSuperfluidUnbondLockResponseAmino {
        return o && o.$typeUrl === MsgSuperfluidUnbondLockResponse.typeUrl;
    },
    encode(_: MsgSuperfluidUnbondLockResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): MsgSuperfluidUnbondLockResponse {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgSuperfluidUnbondLockResponse();
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
    fromPartial(_: Partial<MsgSuperfluidUnbondLockResponse>): MsgSuperfluidUnbondLockResponse {
        const message = createBaseMsgSuperfluidUnbondLockResponse();
        return message;
    },
    fromAmino(_: MsgSuperfluidUnbondLockResponseAmino): MsgSuperfluidUnbondLockResponse {
        const message = createBaseMsgSuperfluidUnbondLockResponse();
        return message;
    },
    toAmino(_: MsgSuperfluidUnbondLockResponse): MsgSuperfluidUnbondLockResponseAmino {
        const obj: any = {};
        return obj;
    },
    fromAminoMsg(object: MsgSuperfluidUnbondLockResponseAminoMsg): MsgSuperfluidUnbondLockResponse {
        return MsgSuperfluidUnbondLockResponse.fromAmino(object.value);
    },
    toAminoMsg(message: MsgSuperfluidUnbondLockResponse): MsgSuperfluidUnbondLockResponseAminoMsg {
        return {
            type: "osmosis/superfluid-unbond-lock-response",
            value: MsgSuperfluidUnbondLockResponse.toAmino(message)
        };
    },
    fromProtoMsg(message: MsgSuperfluidUnbondLockResponseProtoMsg): MsgSuperfluidUnbondLockResponse {
        return MsgSuperfluidUnbondLockResponse.decode(message.value);
    },
    toProto(message: MsgSuperfluidUnbondLockResponse): Uint8Array {
        return MsgSuperfluidUnbondLockResponse.encode(message).finish();
    },
    toProtoMsg(message: MsgSuperfluidUnbondLockResponse): MsgSuperfluidUnbondLockResponseProtoMsg {
        return {
            typeUrl: "/osmosis.superfluid.MsgSuperfluidUnbondLockResponse",
            value: MsgSuperfluidUnbondLockResponse.encode(message).finish()
        };
    }
};
function createBaseMsgSuperfluidUndelegateAndUnbondLock(): MsgSuperfluidUndelegateAndUnbondLock {
    return {
        sender: "",
        lockId: BigInt(0),
        coin: Coin.fromPartial({})
    };
}
export const MsgSuperfluidUndelegateAndUnbondLock = {
    typeUrl: "/osmosis.superfluid.MsgSuperfluidUndelegateAndUnbondLock",
    aminoType: "osmosis/superfluid-undelegate-and-unbond-lock",
    is(o: any): o is MsgSuperfluidUndelegateAndUnbondLock {
        return o && (o.$typeUrl === MsgSuperfluidUndelegateAndUnbondLock.typeUrl || typeof o.sender === "string" && typeof o.lockId === "bigint" && Coin.is(o.coin));
    },
    isSDK(o: any): o is MsgSuperfluidUndelegateAndUnbondLockSDKType {
        return o && (o.$typeUrl === MsgSuperfluidUndelegateAndUnbondLock.typeUrl || typeof o.sender === "string" && typeof o.lock_id === "bigint" && Coin.isSDK(o.coin));
    },
    isAmino(o: any): o is MsgSuperfluidUndelegateAndUnbondLockAmino {
        return o && (o.$typeUrl === MsgSuperfluidUndelegateAndUnbondLock.typeUrl || typeof o.sender === "string" && typeof o.lock_id === "bigint" && Coin.isAmino(o.coin));
    },
    encode(message: MsgSuperfluidUndelegateAndUnbondLock, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        if (message.sender !== "") {
            writer.uint32(10).string(message.sender);
        }
        if (message.lockId !== BigInt(0)) {
            writer.uint32(16).uint64(message.lockId);
        }
        if (message.coin !== undefined) {
            Coin.encode(message.coin, writer.uint32(26).fork()).ldelim();
        }
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): MsgSuperfluidUndelegateAndUnbondLock {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgSuperfluidUndelegateAndUnbondLock();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.sender = reader.string();
                    break;
                case 2:
                    message.lockId = reader.uint64();
                    break;
                case 3:
                    message.coin = Coin.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromPartial(object: Partial<MsgSuperfluidUndelegateAndUnbondLock>): MsgSuperfluidUndelegateAndUnbondLock {
        const message = createBaseMsgSuperfluidUndelegateAndUnbondLock();
        message.sender = object.sender ?? "";
        message.lockId = object.lockId !== undefined && object.lockId !== null ? BigInt(object.lockId.toString()) : BigInt(0);
        message.coin = object.coin !== undefined && object.coin !== null ? Coin.fromPartial(object.coin) : undefined;
        return message;
    },
    fromAmino(object: MsgSuperfluidUndelegateAndUnbondLockAmino): MsgSuperfluidUndelegateAndUnbondLock {
        const message = createBaseMsgSuperfluidUndelegateAndUnbondLock();
        if (object.sender !== undefined && object.sender !== null) {
            message.sender = object.sender;
        }
        if (object.lock_id !== undefined && object.lock_id !== null) {
            message.lockId = BigInt(object.lock_id);
        }
        if (object.coin !== undefined && object.coin !== null) {
            message.coin = Coin.fromAmino(object.coin);
        }
        return message;
    },
    toAmino(message: MsgSuperfluidUndelegateAndUnbondLock): MsgSuperfluidUndelegateAndUnbondLockAmino {
        const obj: any = {};
        obj.sender = message.sender === "" ? undefined : message.sender;
        obj.lock_id = message.lockId !== BigInt(0) ? message.lockId.toString() : undefined;
        obj.coin = message.coin ? Coin.toAmino(message.coin) : undefined;
        return obj;
    },
    fromAminoMsg(object: MsgSuperfluidUndelegateAndUnbondLockAminoMsg): MsgSuperfluidUndelegateAndUnbondLock {
        return MsgSuperfluidUndelegateAndUnbondLock.fromAmino(object.value);
    },
    toAminoMsg(message: MsgSuperfluidUndelegateAndUnbondLock): MsgSuperfluidUndelegateAndUnbondLockAminoMsg {
        return {
            type: "osmosis/superfluid-undelegate-and-unbond-lock",
            value: MsgSuperfluidUndelegateAndUnbondLock.toAmino(message)
        };
    },
    fromProtoMsg(message: MsgSuperfluidUndelegateAndUnbondLockProtoMsg): MsgSuperfluidUndelegateAndUnbondLock {
        return MsgSuperfluidUndelegateAndUnbondLock.decode(message.value);
    },
    toProto(message: MsgSuperfluidUndelegateAndUnbondLock): Uint8Array {
        return MsgSuperfluidUndelegateAndUnbondLock.encode(message).finish();
    },
    toProtoMsg(message: MsgSuperfluidUndelegateAndUnbondLock): MsgSuperfluidUndelegateAndUnbondLockProtoMsg {
        return {
            typeUrl: "/osmosis.superfluid.MsgSuperfluidUndelegateAndUnbondLock",
            value: MsgSuperfluidUndelegateAndUnbondLock.encode(message).finish()
        };
    }
};
function createBaseMsgSuperfluidUndelegateAndUnbondLockResponse(): MsgSuperfluidUndelegateAndUnbondLockResponse {
    return {
        lockId: BigInt(0)
    };
}
export const MsgSuperfluidUndelegateAndUnbondLockResponse = {
    typeUrl: "/osmosis.superfluid.MsgSuperfluidUndelegateAndUnbondLockResponse",
    aminoType: "osmosis/superfluid-undelegate-and-unbond-lock-response",
    is(o: any): o is MsgSuperfluidUndelegateAndUnbondLockResponse {
        return o && (o.$typeUrl === MsgSuperfluidUndelegateAndUnbondLockResponse.typeUrl || typeof o.lockId === "bigint");
    },
    isSDK(o: any): o is MsgSuperfluidUndelegateAndUnbondLockResponseSDKType {
        return o && (o.$typeUrl === MsgSuperfluidUndelegateAndUnbondLockResponse.typeUrl || typeof o.lock_id === "bigint");
    },
    isAmino(o: any): o is MsgSuperfluidUndelegateAndUnbondLockResponseAmino {
        return o && (o.$typeUrl === MsgSuperfluidUndelegateAndUnbondLockResponse.typeUrl || typeof o.lock_id === "bigint");
    },
    encode(message: MsgSuperfluidUndelegateAndUnbondLockResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        if (message.lockId !== BigInt(0)) {
            writer.uint32(8).uint64(message.lockId);
        }
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): MsgSuperfluidUndelegateAndUnbondLockResponse {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgSuperfluidUndelegateAndUnbondLockResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.lockId = reader.uint64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromPartial(object: Partial<MsgSuperfluidUndelegateAndUnbondLockResponse>): MsgSuperfluidUndelegateAndUnbondLockResponse {
        const message = createBaseMsgSuperfluidUndelegateAndUnbondLockResponse();
        message.lockId = object.lockId !== undefined && object.lockId !== null ? BigInt(object.lockId.toString()) : BigInt(0);
        return message;
    },
    fromAmino(object: MsgSuperfluidUndelegateAndUnbondLockResponseAmino): MsgSuperfluidUndelegateAndUnbondLockResponse {
        const message = createBaseMsgSuperfluidUndelegateAndUnbondLockResponse();
        if (object.lock_id !== undefined && object.lock_id !== null) {
            message.lockId = BigInt(object.lock_id);
        }
        return message;
    },
    toAmino(message: MsgSuperfluidUndelegateAndUnbondLockResponse): MsgSuperfluidUndelegateAndUnbondLockResponseAmino {
        const obj: any = {};
        obj.lock_id = message.lockId !== BigInt(0) ? message.lockId.toString() : undefined;
        return obj;
    },
    fromAminoMsg(object: MsgSuperfluidUndelegateAndUnbondLockResponseAminoMsg): MsgSuperfluidUndelegateAndUnbondLockResponse {
        return MsgSuperfluidUndelegateAndUnbondLockResponse.fromAmino(object.value);
    },
    toAminoMsg(message: MsgSuperfluidUndelegateAndUnbondLockResponse): MsgSuperfluidUndelegateAndUnbondLockResponseAminoMsg {
        return {
            type: "osmosis/superfluid-undelegate-and-unbond-lock-response",
            value: MsgSuperfluidUndelegateAndUnbondLockResponse.toAmino(message)
        };
    },
    fromProtoMsg(message: MsgSuperfluidUndelegateAndUnbondLockResponseProtoMsg): MsgSuperfluidUndelegateAndUnbondLockResponse {
        return MsgSuperfluidUndelegateAndUnbondLockResponse.decode(message.value);
    },
    toProto(message: MsgSuperfluidUndelegateAndUnbondLockResponse): Uint8Array {
        return MsgSuperfluidUndelegateAndUnbondLockResponse.encode(message).finish();
    },
    toProtoMsg(message: MsgSuperfluidUndelegateAndUnbondLockResponse): MsgSuperfluidUndelegateAndUnbondLockResponseProtoMsg {
        return {
            typeUrl: "/osmosis.superfluid.MsgSuperfluidUndelegateAndUnbondLockResponse",
            value: MsgSuperfluidUndelegateAndUnbondLockResponse.encode(message).finish()
        };
    }
};
function createBaseMsgLockAndSuperfluidDelegate(): MsgLockAndSuperfluidDelegate {
    return {
        sender: "",
        coins: [],
        valAddr: ""
    };
}
export const MsgLockAndSuperfluidDelegate = {
    typeUrl: "/osmosis.superfluid.MsgLockAndSuperfluidDelegate",
    aminoType: "osmosis/lock-and-superfluid-delegate",
    is(o: any): o is MsgLockAndSuperfluidDelegate {
        return o && (o.$typeUrl === MsgLockAndSuperfluidDelegate.typeUrl || typeof o.sender === "string" && Array.isArray(o.coins) && (!o.coins.length || Coin.is(o.coins[0])) && typeof o.valAddr === "string");
    },
    isSDK(o: any): o is MsgLockAndSuperfluidDelegateSDKType {
        return o && (o.$typeUrl === MsgLockAndSuperfluidDelegate.typeUrl || typeof o.sender === "string" && Array.isArray(o.coins) && (!o.coins.length || Coin.isSDK(o.coins[0])) && typeof o.val_addr === "string");
    },
    isAmino(o: any): o is MsgLockAndSuperfluidDelegateAmino {
        return o && (o.$typeUrl === MsgLockAndSuperfluidDelegate.typeUrl || typeof o.sender === "string" && Array.isArray(o.coins) && (!o.coins.length || Coin.isAmino(o.coins[0])) && typeof o.val_addr === "string");
    },
    encode(message: MsgLockAndSuperfluidDelegate, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        if (message.sender !== "") {
            writer.uint32(10).string(message.sender);
        }
        for (const v of message.coins) {
            Coin.encode(v!, writer.uint32(18).fork()).ldelim();
        }
        if (message.valAddr !== "") {
            writer.uint32(26).string(message.valAddr);
        }
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): MsgLockAndSuperfluidDelegate {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgLockAndSuperfluidDelegate();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.sender = reader.string();
                    break;
                case 2:
                    message.coins.push(Coin.decode(reader, reader.uint32()));
                    break;
                case 3:
                    message.valAddr = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromPartial(object: Partial<MsgLockAndSuperfluidDelegate>): MsgLockAndSuperfluidDelegate {
        const message = createBaseMsgLockAndSuperfluidDelegate();
        message.sender = object.sender ?? "";
        message.coins = object.coins?.map(e => Coin.fromPartial(e)) || [];
        message.valAddr = object.valAddr ?? "";
        return message;
    },
    fromAmino(object: MsgLockAndSuperfluidDelegateAmino): MsgLockAndSuperfluidDelegate {
        const message = createBaseMsgLockAndSuperfluidDelegate();
        if (object.sender !== undefined && object.sender !== null) {
            message.sender = object.sender;
        }
        message.coins = object.coins?.map(e => Coin.fromAmino(e)) || [];
        if (object.val_addr !== undefined && object.val_addr !== null) {
            message.valAddr = object.val_addr;
        }
        return message;
    },
    toAmino(message: MsgLockAndSuperfluidDelegate): MsgLockAndSuperfluidDelegateAmino {
        const obj: any = {};
        obj.sender = message.sender === "" ? undefined : message.sender;
        if (message.coins) {
            obj.coins = message.coins.map(e => e ? Coin.toAmino(e) : undefined);
        } else {
            obj.coins = message.coins;
        }
        obj.val_addr = message.valAddr === "" ? undefined : message.valAddr;
        return obj;
    },
    fromAminoMsg(object: MsgLockAndSuperfluidDelegateAminoMsg): MsgLockAndSuperfluidDelegate {
        return MsgLockAndSuperfluidDelegate.fromAmino(object.value);
    },
    toAminoMsg(message: MsgLockAndSuperfluidDelegate): MsgLockAndSuperfluidDelegateAminoMsg {
        return {
            type: "osmosis/lock-and-superfluid-delegate",
            value: MsgLockAndSuperfluidDelegate.toAmino(message)
        };
    },
    fromProtoMsg(message: MsgLockAndSuperfluidDelegateProtoMsg): MsgLockAndSuperfluidDelegate {
        return MsgLockAndSuperfluidDelegate.decode(message.value);
    },
    toProto(message: MsgLockAndSuperfluidDelegate): Uint8Array {
        return MsgLockAndSuperfluidDelegate.encode(message).finish();
    },
    toProtoMsg(message: MsgLockAndSuperfluidDelegate): MsgLockAndSuperfluidDelegateProtoMsg {
        return {
            typeUrl: "/osmosis.superfluid.MsgLockAndSuperfluidDelegate",
            value: MsgLockAndSuperfluidDelegate.encode(message).finish()
        };
    }
};
function createBaseMsgLockAndSuperfluidDelegateResponse(): MsgLockAndSuperfluidDelegateResponse {
    return {
        ID: BigInt(0)
    };
}
export const MsgLockAndSuperfluidDelegateResponse = {
    typeUrl: "/osmosis.superfluid.MsgLockAndSuperfluidDelegateResponse",
    aminoType: "osmosis/lock-and-superfluid-delegate-response",
    is(o: any): o is MsgLockAndSuperfluidDelegateResponse {
        return o && (o.$typeUrl === MsgLockAndSuperfluidDelegateResponse.typeUrl || typeof o.ID === "bigint");
    },
    isSDK(o: any): o is MsgLockAndSuperfluidDelegateResponseSDKType {
        return o && (o.$typeUrl === MsgLockAndSuperfluidDelegateResponse.typeUrl || typeof o.ID === "bigint");
    },
    isAmino(o: any): o is MsgLockAndSuperfluidDelegateResponseAmino {
        return o && (o.$typeUrl === MsgLockAndSuperfluidDelegateResponse.typeUrl || typeof o.ID === "bigint");
    },
    encode(message: MsgLockAndSuperfluidDelegateResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        if (message.ID !== BigInt(0)) {
            writer.uint32(8).uint64(message.ID);
        }
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): MsgLockAndSuperfluidDelegateResponse {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgLockAndSuperfluidDelegateResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.ID = reader.uint64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromPartial(object: Partial<MsgLockAndSuperfluidDelegateResponse>): MsgLockAndSuperfluidDelegateResponse {
        const message = createBaseMsgLockAndSuperfluidDelegateResponse();
        message.ID = object.ID !== undefined && object.ID !== null ? BigInt(object.ID.toString()) : BigInt(0);
        return message;
    },
    fromAmino(object: MsgLockAndSuperfluidDelegateResponseAmino): MsgLockAndSuperfluidDelegateResponse {
        const message = createBaseMsgLockAndSuperfluidDelegateResponse();
        if (object.ID !== undefined && object.ID !== null) {
            message.ID = BigInt(object.ID);
        }
        return message;
    },
    toAmino(message: MsgLockAndSuperfluidDelegateResponse): MsgLockAndSuperfluidDelegateResponseAmino {
        const obj: any = {};
        obj.ID = message.ID !== BigInt(0) ? message.ID.toString() : undefined;
        return obj;
    },
    fromAminoMsg(object: MsgLockAndSuperfluidDelegateResponseAminoMsg): MsgLockAndSuperfluidDelegateResponse {
        return MsgLockAndSuperfluidDelegateResponse.fromAmino(object.value);
    },
    toAminoMsg(message: MsgLockAndSuperfluidDelegateResponse): MsgLockAndSuperfluidDelegateResponseAminoMsg {
        return {
            type: "osmosis/lock-and-superfluid-delegate-response",
            value: MsgLockAndSuperfluidDelegateResponse.toAmino(message)
        };
    },
    fromProtoMsg(message: MsgLockAndSuperfluidDelegateResponseProtoMsg): MsgLockAndSuperfluidDelegateResponse {
        return MsgLockAndSuperfluidDelegateResponse.decode(message.value);
    },
    toProto(message: MsgLockAndSuperfluidDelegateResponse): Uint8Array {
        return MsgLockAndSuperfluidDelegateResponse.encode(message).finish();
    },
    toProtoMsg(message: MsgLockAndSuperfluidDelegateResponse): MsgLockAndSuperfluidDelegateResponseProtoMsg {
        return {
            typeUrl: "/osmosis.superfluid.MsgLockAndSuperfluidDelegateResponse",
            value: MsgLockAndSuperfluidDelegateResponse.encode(message).finish()
        };
    }
};
function createBaseMsgCreateFullRangePositionAndSuperfluidDelegate(): MsgCreateFullRangePositionAndSuperfluidDelegate {
    return {
        sender: "",
        coins: [],
        valAddr: "",
        poolId: BigInt(0)
    };
}
export const MsgCreateFullRangePositionAndSuperfluidDelegate = {
    typeUrl: "/osmosis.superfluid.MsgCreateFullRangePositionAndSuperfluidDelegate",
    aminoType: "osmosis/full-range-and-sf-delegate",
    is(o: any): o is MsgCreateFullRangePositionAndSuperfluidDelegate {
        return o && (o.$typeUrl === MsgCreateFullRangePositionAndSuperfluidDelegate.typeUrl || typeof o.sender === "string" && Array.isArray(o.coins) && (!o.coins.length || Coin.is(o.coins[0])) && typeof o.valAddr === "string" && typeof o.poolId === "bigint");
    },
    isSDK(o: any): o is MsgCreateFullRangePositionAndSuperfluidDelegateSDKType {
        return o && (o.$typeUrl === MsgCreateFullRangePositionAndSuperfluidDelegate.typeUrl || typeof o.sender === "string" && Array.isArray(o.coins) && (!o.coins.length || Coin.isSDK(o.coins[0])) && typeof o.val_addr === "string" && typeof o.pool_id === "bigint");
    },
    isAmino(o: any): o is MsgCreateFullRangePositionAndSuperfluidDelegateAmino {
        return o && (o.$typeUrl === MsgCreateFullRangePositionAndSuperfluidDelegate.typeUrl || typeof o.sender === "string" && Array.isArray(o.coins) && (!o.coins.length || Coin.isAmino(o.coins[0])) && typeof o.val_addr === "string" && typeof o.pool_id === "bigint");
    },
    encode(message: MsgCreateFullRangePositionAndSuperfluidDelegate, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        if (message.sender !== "") {
            writer.uint32(10).string(message.sender);
        }
        for (const v of message.coins) {
            Coin.encode(v!, writer.uint32(18).fork()).ldelim();
        }
        if (message.valAddr !== "") {
            writer.uint32(26).string(message.valAddr);
        }
        if (message.poolId !== BigInt(0)) {
            writer.uint32(32).uint64(message.poolId);
        }
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): MsgCreateFullRangePositionAndSuperfluidDelegate {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgCreateFullRangePositionAndSuperfluidDelegate();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.sender = reader.string();
                    break;
                case 2:
                    message.coins.push(Coin.decode(reader, reader.uint32()));
                    break;
                case 3:
                    message.valAddr = reader.string();
                    break;
                case 4:
                    message.poolId = reader.uint64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromPartial(object: Partial<MsgCreateFullRangePositionAndSuperfluidDelegate>): MsgCreateFullRangePositionAndSuperfluidDelegate {
        const message = createBaseMsgCreateFullRangePositionAndSuperfluidDelegate();
        message.sender = object.sender ?? "";
        message.coins = object.coins?.map(e => Coin.fromPartial(e)) || [];
        message.valAddr = object.valAddr ?? "";
        message.poolId = object.poolId !== undefined && object.poolId !== null ? BigInt(object.poolId.toString()) : BigInt(0);
        return message;
    },
    fromAmino(object: MsgCreateFullRangePositionAndSuperfluidDelegateAmino): MsgCreateFullRangePositionAndSuperfluidDelegate {
        const message = createBaseMsgCreateFullRangePositionAndSuperfluidDelegate();
        if (object.sender !== undefined && object.sender !== null) {
            message.sender = object.sender;
        }
        message.coins = object.coins?.map(e => Coin.fromAmino(e)) || [];
        if (object.val_addr !== undefined && object.val_addr !== null) {
            message.valAddr = object.val_addr;
        }
        if (object.pool_id !== undefined && object.pool_id !== null) {
            message.poolId = BigInt(object.pool_id);
        }
        return message;
    },
    toAmino(message: MsgCreateFullRangePositionAndSuperfluidDelegate): MsgCreateFullRangePositionAndSuperfluidDelegateAmino {
        const obj: any = {};
        obj.sender = message.sender === "" ? undefined : message.sender;
        if (message.coins) {
            obj.coins = message.coins.map(e => e ? Coin.toAmino(e) : undefined);
        } else {
            obj.coins = message.coins;
        }
        obj.val_addr = message.valAddr === "" ? undefined : message.valAddr;
        obj.pool_id = message.poolId !== BigInt(0) ? message.poolId.toString() : undefined;
        return obj;
    },
    fromAminoMsg(object: MsgCreateFullRangePositionAndSuperfluidDelegateAminoMsg): MsgCreateFullRangePositionAndSuperfluidDelegate {
        return MsgCreateFullRangePositionAndSuperfluidDelegate.fromAmino(object.value);
    },
    toAminoMsg(message: MsgCreateFullRangePositionAndSuperfluidDelegate): MsgCreateFullRangePositionAndSuperfluidDelegateAminoMsg {
        return {
            type: "osmosis/full-range-and-sf-delegate",
            value: MsgCreateFullRangePositionAndSuperfluidDelegate.toAmino(message)
        };
    },
    fromProtoMsg(message: MsgCreateFullRangePositionAndSuperfluidDelegateProtoMsg): MsgCreateFullRangePositionAndSuperfluidDelegate {
        return MsgCreateFullRangePositionAndSuperfluidDelegate.decode(message.value);
    },
    toProto(message: MsgCreateFullRangePositionAndSuperfluidDelegate): Uint8Array {
        return MsgCreateFullRangePositionAndSuperfluidDelegate.encode(message).finish();
    },
    toProtoMsg(message: MsgCreateFullRangePositionAndSuperfluidDelegate): MsgCreateFullRangePositionAndSuperfluidDelegateProtoMsg {
        return {
            typeUrl: "/osmosis.superfluid.MsgCreateFullRangePositionAndSuperfluidDelegate",
            value: MsgCreateFullRangePositionAndSuperfluidDelegate.encode(message).finish()
        };
    }
};
function createBaseMsgCreateFullRangePositionAndSuperfluidDelegateResponse(): MsgCreateFullRangePositionAndSuperfluidDelegateResponse {
    return {
        lockID: BigInt(0),
        positionID: BigInt(0)
    };
}
export const MsgCreateFullRangePositionAndSuperfluidDelegateResponse = {
    typeUrl: "/osmosis.superfluid.MsgCreateFullRangePositionAndSuperfluidDelegateResponse",
    aminoType: "osmosis/create-full-range-position-and-superfluid-delegate-response",
    is(o: any): o is MsgCreateFullRangePositionAndSuperfluidDelegateResponse {
        return o && (o.$typeUrl === MsgCreateFullRangePositionAndSuperfluidDelegateResponse.typeUrl || typeof o.lockID === "bigint" && typeof o.positionID === "bigint");
    },
    isSDK(o: any): o is MsgCreateFullRangePositionAndSuperfluidDelegateResponseSDKType {
        return o && (o.$typeUrl === MsgCreateFullRangePositionAndSuperfluidDelegateResponse.typeUrl || typeof o.lockID === "bigint" && typeof o.positionID === "bigint");
    },
    isAmino(o: any): o is MsgCreateFullRangePositionAndSuperfluidDelegateResponseAmino {
        return o && (o.$typeUrl === MsgCreateFullRangePositionAndSuperfluidDelegateResponse.typeUrl || typeof o.lockID === "bigint" && typeof o.positionID === "bigint");
    },
    encode(message: MsgCreateFullRangePositionAndSuperfluidDelegateResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        if (message.lockID !== BigInt(0)) {
            writer.uint32(8).uint64(message.lockID);
        }
        if (message.positionID !== BigInt(0)) {
            writer.uint32(16).uint64(message.positionID);
        }
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): MsgCreateFullRangePositionAndSuperfluidDelegateResponse {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgCreateFullRangePositionAndSuperfluidDelegateResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.lockID = reader.uint64();
                    break;
                case 2:
                    message.positionID = reader.uint64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromPartial(object: Partial<MsgCreateFullRangePositionAndSuperfluidDelegateResponse>): MsgCreateFullRangePositionAndSuperfluidDelegateResponse {
        const message = createBaseMsgCreateFullRangePositionAndSuperfluidDelegateResponse();
        message.lockID = object.lockID !== undefined && object.lockID !== null ? BigInt(object.lockID.toString()) : BigInt(0);
        message.positionID = object.positionID !== undefined && object.positionID !== null ? BigInt(object.positionID.toString()) : BigInt(0);
        return message;
    },
    fromAmino(object: MsgCreateFullRangePositionAndSuperfluidDelegateResponseAmino): MsgCreateFullRangePositionAndSuperfluidDelegateResponse {
        const message = createBaseMsgCreateFullRangePositionAndSuperfluidDelegateResponse();
        if (object.lockID !== undefined && object.lockID !== null) {
            message.lockID = BigInt(object.lockID);
        }
        if (object.positionID !== undefined && object.positionID !== null) {
            message.positionID = BigInt(object.positionID);
        }
        return message;
    },
    toAmino(message: MsgCreateFullRangePositionAndSuperfluidDelegateResponse): MsgCreateFullRangePositionAndSuperfluidDelegateResponseAmino {
        const obj: any = {};
        obj.lockID = message.lockID !== BigInt(0) ? message.lockID.toString() : undefined;
        obj.positionID = message.positionID !== BigInt(0) ? message.positionID.toString() : undefined;
        return obj;
    },
    fromAminoMsg(object: MsgCreateFullRangePositionAndSuperfluidDelegateResponseAminoMsg): MsgCreateFullRangePositionAndSuperfluidDelegateResponse {
        return MsgCreateFullRangePositionAndSuperfluidDelegateResponse.fromAmino(object.value);
    },
    toAminoMsg(message: MsgCreateFullRangePositionAndSuperfluidDelegateResponse): MsgCreateFullRangePositionAndSuperfluidDelegateResponseAminoMsg {
        return {
            type: "osmosis/create-full-range-position-and-superfluid-delegate-response",
            value: MsgCreateFullRangePositionAndSuperfluidDelegateResponse.toAmino(message)
        };
    },
    fromProtoMsg(message: MsgCreateFullRangePositionAndSuperfluidDelegateResponseProtoMsg): MsgCreateFullRangePositionAndSuperfluidDelegateResponse {
        return MsgCreateFullRangePositionAndSuperfluidDelegateResponse.decode(message.value);
    },
    toProto(message: MsgCreateFullRangePositionAndSuperfluidDelegateResponse): Uint8Array {
        return MsgCreateFullRangePositionAndSuperfluidDelegateResponse.encode(message).finish();
    },
    toProtoMsg(message: MsgCreateFullRangePositionAndSuperfluidDelegateResponse): MsgCreateFullRangePositionAndSuperfluidDelegateResponseProtoMsg {
        return {
            typeUrl: "/osmosis.superfluid.MsgCreateFullRangePositionAndSuperfluidDelegateResponse",
            value: MsgCreateFullRangePositionAndSuperfluidDelegateResponse.encode(message).finish()
        };
    }
};
function createBaseMsgUnPoolWhitelistedPool(): MsgUnPoolWhitelistedPool {
    return {
        sender: "",
        poolId: BigInt(0)
    };
}
export const MsgUnPoolWhitelistedPool = {
    typeUrl: "/osmosis.superfluid.MsgUnPoolWhitelistedPool",
    aminoType: "osmosis/unpool-whitelisted-pool",
    is(o: any): o is MsgUnPoolWhitelistedPool {
        return o && (o.$typeUrl === MsgUnPoolWhitelistedPool.typeUrl || typeof o.sender === "string" && typeof o.poolId === "bigint");
    },
    isSDK(o: any): o is MsgUnPoolWhitelistedPoolSDKType {
        return o && (o.$typeUrl === MsgUnPoolWhitelistedPool.typeUrl || typeof o.sender === "string" && typeof o.pool_id === "bigint");
    },
    isAmino(o: any): o is MsgUnPoolWhitelistedPoolAmino {
        return o && (o.$typeUrl === MsgUnPoolWhitelistedPool.typeUrl || typeof o.sender === "string" && typeof o.pool_id === "bigint");
    },
    encode(message: MsgUnPoolWhitelistedPool, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        if (message.sender !== "") {
            writer.uint32(10).string(message.sender);
        }
        if (message.poolId !== BigInt(0)) {
            writer.uint32(16).uint64(message.poolId);
        }
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): MsgUnPoolWhitelistedPool {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgUnPoolWhitelistedPool();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.sender = reader.string();
                    break;
                case 2:
                    message.poolId = reader.uint64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromPartial(object: Partial<MsgUnPoolWhitelistedPool>): MsgUnPoolWhitelistedPool {
        const message = createBaseMsgUnPoolWhitelistedPool();
        message.sender = object.sender ?? "";
        message.poolId = object.poolId !== undefined && object.poolId !== null ? BigInt(object.poolId.toString()) : BigInt(0);
        return message;
    },
    fromAmino(object: MsgUnPoolWhitelistedPoolAmino): MsgUnPoolWhitelistedPool {
        const message = createBaseMsgUnPoolWhitelistedPool();
        if (object.sender !== undefined && object.sender !== null) {
            message.sender = object.sender;
        }
        if (object.pool_id !== undefined && object.pool_id !== null) {
            message.poolId = BigInt(object.pool_id);
        }
        return message;
    },
    toAmino(message: MsgUnPoolWhitelistedPool): MsgUnPoolWhitelistedPoolAmino {
        const obj: any = {};
        obj.sender = message.sender === "" ? undefined : message.sender;
        obj.pool_id = message.poolId !== BigInt(0) ? message.poolId.toString() : undefined;
        return obj;
    },
    fromAminoMsg(object: MsgUnPoolWhitelistedPoolAminoMsg): MsgUnPoolWhitelistedPool {
        return MsgUnPoolWhitelistedPool.fromAmino(object.value);
    },
    toAminoMsg(message: MsgUnPoolWhitelistedPool): MsgUnPoolWhitelistedPoolAminoMsg {
        return {
            type: "osmosis/unpool-whitelisted-pool",
            value: MsgUnPoolWhitelistedPool.toAmino(message)
        };
    },
    fromProtoMsg(message: MsgUnPoolWhitelistedPoolProtoMsg): MsgUnPoolWhitelistedPool {
        return MsgUnPoolWhitelistedPool.decode(message.value);
    },
    toProto(message: MsgUnPoolWhitelistedPool): Uint8Array {
        return MsgUnPoolWhitelistedPool.encode(message).finish();
    },
    toProtoMsg(message: MsgUnPoolWhitelistedPool): MsgUnPoolWhitelistedPoolProtoMsg {
        return {
            typeUrl: "/osmosis.superfluid.MsgUnPoolWhitelistedPool",
            value: MsgUnPoolWhitelistedPool.encode(message).finish()
        };
    }
};
function createBaseMsgUnPoolWhitelistedPoolResponse(): MsgUnPoolWhitelistedPoolResponse {
    return {
        exitedLockIds: []
    };
}
export const MsgUnPoolWhitelistedPoolResponse = {
    typeUrl: "/osmosis.superfluid.MsgUnPoolWhitelistedPoolResponse",
    aminoType: "osmosis/un-pool-whitelisted-pool-response",
    is(o: any): o is MsgUnPoolWhitelistedPoolResponse {
        return o && (o.$typeUrl === MsgUnPoolWhitelistedPoolResponse.typeUrl || Array.isArray(o.exitedLockIds) && (!o.exitedLockIds.length || typeof o.exitedLockIds[0] === "bigint"));
    },
    isSDK(o: any): o is MsgUnPoolWhitelistedPoolResponseSDKType {
        return o && (o.$typeUrl === MsgUnPoolWhitelistedPoolResponse.typeUrl || Array.isArray(o.exited_lock_ids) && (!o.exited_lock_ids.length || typeof o.exited_lock_ids[0] === "bigint"));
    },
    isAmino(o: any): o is MsgUnPoolWhitelistedPoolResponseAmino {
        return o && (o.$typeUrl === MsgUnPoolWhitelistedPoolResponse.typeUrl || Array.isArray(o.exited_lock_ids) && (!o.exited_lock_ids.length || typeof o.exited_lock_ids[0] === "bigint"));
    },
    encode(message: MsgUnPoolWhitelistedPoolResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        writer.uint32(10).fork();
        for (const v of message.exitedLockIds) {
            writer.uint64(v);
        }
        writer.ldelim();
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): MsgUnPoolWhitelistedPoolResponse {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgUnPoolWhitelistedPoolResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if ((tag & 7) === 2) {
                        const end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2) {
                            message.exitedLockIds.push(reader.uint64());
                        }
                    } else {
                        message.exitedLockIds.push(reader.uint64());
                    }
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromPartial(object: Partial<MsgUnPoolWhitelistedPoolResponse>): MsgUnPoolWhitelistedPoolResponse {
        const message = createBaseMsgUnPoolWhitelistedPoolResponse();
        message.exitedLockIds = object.exitedLockIds?.map(e => BigInt(e.toString())) || [];
        return message;
    },
    fromAmino(object: MsgUnPoolWhitelistedPoolResponseAmino): MsgUnPoolWhitelistedPoolResponse {
        const message = createBaseMsgUnPoolWhitelistedPoolResponse();
        message.exitedLockIds = object.exited_lock_ids?.map(e => BigInt(e)) || [];
        return message;
    },
    toAmino(message: MsgUnPoolWhitelistedPoolResponse): MsgUnPoolWhitelistedPoolResponseAmino {
        const obj: any = {};
        if (message.exitedLockIds) {
            obj.exited_lock_ids = message.exitedLockIds.map(e => e.toString());
        } else {
            obj.exited_lock_ids = message.exitedLockIds;
        }
        return obj;
    },
    fromAminoMsg(object: MsgUnPoolWhitelistedPoolResponseAminoMsg): MsgUnPoolWhitelistedPoolResponse {
        return MsgUnPoolWhitelistedPoolResponse.fromAmino(object.value);
    },
    toAminoMsg(message: MsgUnPoolWhitelistedPoolResponse): MsgUnPoolWhitelistedPoolResponseAminoMsg {
        return {
            type: "osmosis/un-pool-whitelisted-pool-response",
            value: MsgUnPoolWhitelistedPoolResponse.toAmino(message)
        };
    },
    fromProtoMsg(message: MsgUnPoolWhitelistedPoolResponseProtoMsg): MsgUnPoolWhitelistedPoolResponse {
        return MsgUnPoolWhitelistedPoolResponse.decode(message.value);
    },
    toProto(message: MsgUnPoolWhitelistedPoolResponse): Uint8Array {
        return MsgUnPoolWhitelistedPoolResponse.encode(message).finish();
    },
    toProtoMsg(message: MsgUnPoolWhitelistedPoolResponse): MsgUnPoolWhitelistedPoolResponseProtoMsg {
        return {
            typeUrl: "/osmosis.superfluid.MsgUnPoolWhitelistedPoolResponse",
            value: MsgUnPoolWhitelistedPoolResponse.encode(message).finish()
        };
    }
};
function createBaseMsgUnlockAndMigrateSharesToFullRangeConcentratedPosition(): MsgUnlockAndMigrateSharesToFullRangeConcentratedPosition {
    return {
        sender: "",
        lockId: BigInt(0),
        sharesToMigrate: Coin.fromPartial({}),
        tokenOutMins: []
    };
}
export const MsgUnlockAndMigrateSharesToFullRangeConcentratedPosition = {
    typeUrl: "/osmosis.superfluid.MsgUnlockAndMigrateSharesToFullRangeConcentratedPosition",
    aminoType: "osmosis/unlock-and-migrate",
    is(o: any): o is MsgUnlockAndMigrateSharesToFullRangeConcentratedPosition {
        return o && (o.$typeUrl === MsgUnlockAndMigrateSharesToFullRangeConcentratedPosition.typeUrl || typeof o.sender === "string" && typeof o.lockId === "bigint" && Coin.is(o.sharesToMigrate) && Array.isArray(o.tokenOutMins) && (!o.tokenOutMins.length || Coin.is(o.tokenOutMins[0])));
    },
    isSDK(o: any): o is MsgUnlockAndMigrateSharesToFullRangeConcentratedPositionSDKType {
        return o && (o.$typeUrl === MsgUnlockAndMigrateSharesToFullRangeConcentratedPosition.typeUrl || typeof o.sender === "string" && typeof o.lock_id === "bigint" && Coin.isSDK(o.shares_to_migrate) && Array.isArray(o.token_out_mins) && (!o.token_out_mins.length || Coin.isSDK(o.token_out_mins[0])));
    },
    isAmino(o: any): o is MsgUnlockAndMigrateSharesToFullRangeConcentratedPositionAmino {
        return o && (o.$typeUrl === MsgUnlockAndMigrateSharesToFullRangeConcentratedPosition.typeUrl || typeof o.sender === "string" && typeof o.lock_id === "bigint" && Coin.isAmino(o.shares_to_migrate) && Array.isArray(o.token_out_mins) && (!o.token_out_mins.length || Coin.isAmino(o.token_out_mins[0])));
    },
    encode(message: MsgUnlockAndMigrateSharesToFullRangeConcentratedPosition, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        if (message.sender !== "") {
            writer.uint32(10).string(message.sender);
        }
        if (message.lockId !== BigInt(0)) {
            writer.uint32(16).int64(message.lockId);
        }
        if (message.sharesToMigrate !== undefined) {
            Coin.encode(message.sharesToMigrate, writer.uint32(26).fork()).ldelim();
        }
        for (const v of message.tokenOutMins) {
            Coin.encode(v!, writer.uint32(34).fork()).ldelim();
        }
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): MsgUnlockAndMigrateSharesToFullRangeConcentratedPosition {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgUnlockAndMigrateSharesToFullRangeConcentratedPosition();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.sender = reader.string();
                    break;
                case 2:
                    message.lockId = reader.int64();
                    break;
                case 3:
                    message.sharesToMigrate = Coin.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.tokenOutMins.push(Coin.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromPartial(object: Partial<MsgUnlockAndMigrateSharesToFullRangeConcentratedPosition>): MsgUnlockAndMigrateSharesToFullRangeConcentratedPosition {
        const message = createBaseMsgUnlockAndMigrateSharesToFullRangeConcentratedPosition();
        message.sender = object.sender ?? "";
        message.lockId = object.lockId !== undefined && object.lockId !== null ? BigInt(object.lockId.toString()) : BigInt(0);
        message.sharesToMigrate = object.sharesToMigrate !== undefined && object.sharesToMigrate !== null ? Coin.fromPartial(object.sharesToMigrate) : undefined;
        message.tokenOutMins = object.tokenOutMins?.map(e => Coin.fromPartial(e)) || [];
        return message;
    },
    fromAmino(object: MsgUnlockAndMigrateSharesToFullRangeConcentratedPositionAmino): MsgUnlockAndMigrateSharesToFullRangeConcentratedPosition {
        const message = createBaseMsgUnlockAndMigrateSharesToFullRangeConcentratedPosition();
        if (object.sender !== undefined && object.sender !== null) {
            message.sender = object.sender;
        }
        if (object.lock_id !== undefined && object.lock_id !== null) {
            message.lockId = BigInt(object.lock_id);
        }
        if (object.shares_to_migrate !== undefined && object.shares_to_migrate !== null) {
            message.sharesToMigrate = Coin.fromAmino(object.shares_to_migrate);
        }
        message.tokenOutMins = object.token_out_mins?.map(e => Coin.fromAmino(e)) || [];
        return message;
    },
    toAmino(message: MsgUnlockAndMigrateSharesToFullRangeConcentratedPosition): MsgUnlockAndMigrateSharesToFullRangeConcentratedPositionAmino {
        const obj: any = {};
        obj.sender = message.sender === "" ? undefined : message.sender;
        obj.lock_id = message.lockId !== BigInt(0) ? message.lockId.toString() : undefined;
        obj.shares_to_migrate = message.sharesToMigrate ? Coin.toAmino(message.sharesToMigrate) : undefined;
        if (message.tokenOutMins) {
            obj.token_out_mins = message.tokenOutMins.map(e => e ? Coin.toAmino(e) : undefined);
        } else {
            obj.token_out_mins = message.tokenOutMins;
        }
        return obj;
    },
    fromAminoMsg(object: MsgUnlockAndMigrateSharesToFullRangeConcentratedPositionAminoMsg): MsgUnlockAndMigrateSharesToFullRangeConcentratedPosition {
        return MsgUnlockAndMigrateSharesToFullRangeConcentratedPosition.fromAmino(object.value);
    },
    toAminoMsg(message: MsgUnlockAndMigrateSharesToFullRangeConcentratedPosition): MsgUnlockAndMigrateSharesToFullRangeConcentratedPositionAminoMsg {
        return {
            type: "osmosis/unlock-and-migrate",
            value: MsgUnlockAndMigrateSharesToFullRangeConcentratedPosition.toAmino(message)
        };
    },
    fromProtoMsg(message: MsgUnlockAndMigrateSharesToFullRangeConcentratedPositionProtoMsg): MsgUnlockAndMigrateSharesToFullRangeConcentratedPosition {
        return MsgUnlockAndMigrateSharesToFullRangeConcentratedPosition.decode(message.value);
    },
    toProto(message: MsgUnlockAndMigrateSharesToFullRangeConcentratedPosition): Uint8Array {
        return MsgUnlockAndMigrateSharesToFullRangeConcentratedPosition.encode(message).finish();
    },
    toProtoMsg(message: MsgUnlockAndMigrateSharesToFullRangeConcentratedPosition): MsgUnlockAndMigrateSharesToFullRangeConcentratedPositionProtoMsg {
        return {
            typeUrl: "/osmosis.superfluid.MsgUnlockAndMigrateSharesToFullRangeConcentratedPosition",
            value: MsgUnlockAndMigrateSharesToFullRangeConcentratedPosition.encode(message).finish()
        };
    }
};
function createBaseMsgUnlockAndMigrateSharesToFullRangeConcentratedPositionResponse(): MsgUnlockAndMigrateSharesToFullRangeConcentratedPositionResponse {
    return {
        amount0: "",
        amount1: "",
        liquidityCreated: "",
        joinTime: new Date()
    };
}
export const MsgUnlockAndMigrateSharesToFullRangeConcentratedPositionResponse = {
    typeUrl: "/osmosis.superfluid.MsgUnlockAndMigrateSharesToFullRangeConcentratedPositionResponse",
    aminoType: "osmosis/unlock-and-migrate-shares-to-full-range-concentrated-position-response",
    is(o: any): o is MsgUnlockAndMigrateSharesToFullRangeConcentratedPositionResponse {
        return o && (o.$typeUrl === MsgUnlockAndMigrateSharesToFullRangeConcentratedPositionResponse.typeUrl || typeof o.amount0 === "string" && typeof o.amount1 === "string" && typeof o.liquidityCreated === "string" && Timestamp.is(o.joinTime));
    },
    isSDK(o: any): o is MsgUnlockAndMigrateSharesToFullRangeConcentratedPositionResponseSDKType {
        return o && (o.$typeUrl === MsgUnlockAndMigrateSharesToFullRangeConcentratedPositionResponse.typeUrl || typeof o.amount0 === "string" && typeof o.amount1 === "string" && typeof o.liquidity_created === "string" && Timestamp.isSDK(o.join_time));
    },
    isAmino(o: any): o is MsgUnlockAndMigrateSharesToFullRangeConcentratedPositionResponseAmino {
        return o && (o.$typeUrl === MsgUnlockAndMigrateSharesToFullRangeConcentratedPositionResponse.typeUrl || typeof o.amount0 === "string" && typeof o.amount1 === "string" && typeof o.liquidity_created === "string" && Timestamp.isAmino(o.join_time));
    },
    encode(message: MsgUnlockAndMigrateSharesToFullRangeConcentratedPositionResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        if (message.amount0 !== "") {
            writer.uint32(10).string(message.amount0);
        }
        if (message.amount1 !== "") {
            writer.uint32(18).string(message.amount1);
        }
        if (message.liquidityCreated !== "") {
            writer.uint32(26).string(Decimal.fromUserInput(message.liquidityCreated, 18).atomics);
        }
        if (message.joinTime !== undefined) {
            Timestamp.encode(toTimestamp(message.joinTime), writer.uint32(34).fork()).ldelim();
        }
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): MsgUnlockAndMigrateSharesToFullRangeConcentratedPositionResponse {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgUnlockAndMigrateSharesToFullRangeConcentratedPositionResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.amount0 = reader.string();
                    break;
                case 2:
                    message.amount1 = reader.string();
                    break;
                case 3:
                    message.liquidityCreated = Decimal.fromAtomics(reader.string(), 18).toString();
                    break;
                case 4:
                    message.joinTime = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromPartial(object: Partial<MsgUnlockAndMigrateSharesToFullRangeConcentratedPositionResponse>): MsgUnlockAndMigrateSharesToFullRangeConcentratedPositionResponse {
        const message = createBaseMsgUnlockAndMigrateSharesToFullRangeConcentratedPositionResponse();
        message.amount0 = object.amount0 ?? "";
        message.amount1 = object.amount1 ?? "";
        message.liquidityCreated = object.liquidityCreated ?? "";
        message.joinTime = object.joinTime ?? undefined;
        return message;
    },
    fromAmino(object: MsgUnlockAndMigrateSharesToFullRangeConcentratedPositionResponseAmino): MsgUnlockAndMigrateSharesToFullRangeConcentratedPositionResponse {
        const message = createBaseMsgUnlockAndMigrateSharesToFullRangeConcentratedPositionResponse();
        if (object.amount0 !== undefined && object.amount0 !== null) {
            message.amount0 = object.amount0;
        }
        if (object.amount1 !== undefined && object.amount1 !== null) {
            message.amount1 = object.amount1;
        }
        if (object.liquidity_created !== undefined && object.liquidity_created !== null) {
            message.liquidityCreated = object.liquidity_created;
        }
        if (object.join_time !== undefined && object.join_time !== null) {
            message.joinTime = fromTimestamp(Timestamp.fromAmino(object.join_time));
        }
        return message;
    },
    toAmino(message: MsgUnlockAndMigrateSharesToFullRangeConcentratedPositionResponse): MsgUnlockAndMigrateSharesToFullRangeConcentratedPositionResponseAmino {
        const obj: any = {};
        obj.amount0 = message.amount0 === "" ? undefined : message.amount0;
        obj.amount1 = message.amount1 === "" ? undefined : message.amount1;
        obj.liquidity_created = message.liquidityCreated === "" ? undefined : message.liquidityCreated;
        obj.join_time = message.joinTime ? Timestamp.toAmino(toTimestamp(message.joinTime)) : undefined;
        return obj;
    },
    fromAminoMsg(object: MsgUnlockAndMigrateSharesToFullRangeConcentratedPositionResponseAminoMsg): MsgUnlockAndMigrateSharesToFullRangeConcentratedPositionResponse {
        return MsgUnlockAndMigrateSharesToFullRangeConcentratedPositionResponse.fromAmino(object.value);
    },
    toAminoMsg(message: MsgUnlockAndMigrateSharesToFullRangeConcentratedPositionResponse): MsgUnlockAndMigrateSharesToFullRangeConcentratedPositionResponseAminoMsg {
        return {
            type: "osmosis/unlock-and-migrate-shares-to-full-range-concentrated-position-response",
            value: MsgUnlockAndMigrateSharesToFullRangeConcentratedPositionResponse.toAmino(message)
        };
    },
    fromProtoMsg(message: MsgUnlockAndMigrateSharesToFullRangeConcentratedPositionResponseProtoMsg): MsgUnlockAndMigrateSharesToFullRangeConcentratedPositionResponse {
        return MsgUnlockAndMigrateSharesToFullRangeConcentratedPositionResponse.decode(message.value);
    },
    toProto(message: MsgUnlockAndMigrateSharesToFullRangeConcentratedPositionResponse): Uint8Array {
        return MsgUnlockAndMigrateSharesToFullRangeConcentratedPositionResponse.encode(message).finish();
    },
    toProtoMsg(message: MsgUnlockAndMigrateSharesToFullRangeConcentratedPositionResponse): MsgUnlockAndMigrateSharesToFullRangeConcentratedPositionResponseProtoMsg {
        return {
            typeUrl: "/osmosis.superfluid.MsgUnlockAndMigrateSharesToFullRangeConcentratedPositionResponse",
            value: MsgUnlockAndMigrateSharesToFullRangeConcentratedPositionResponse.encode(message).finish()
        };
    }
};
function createBaseMsgAddToConcentratedLiquiditySuperfluidPosition(): MsgAddToConcentratedLiquiditySuperfluidPosition {
    return {
        positionId: BigInt(0),
        sender: "",
        tokenDesired0: Coin.fromPartial({}),
        tokenDesired1: Coin.fromPartial({})
    };
}
export const MsgAddToConcentratedLiquiditySuperfluidPosition = {
    typeUrl: "/osmosis.superfluid.MsgAddToConcentratedLiquiditySuperfluidPosition",
    aminoType: "osmosis/add-to-cl-superfluid-position",
    is(o: any): o is MsgAddToConcentratedLiquiditySuperfluidPosition {
        return o && (o.$typeUrl === MsgAddToConcentratedLiquiditySuperfluidPosition.typeUrl || typeof o.positionId === "bigint" && typeof o.sender === "string" && Coin.is(o.tokenDesired0) && Coin.is(o.tokenDesired1));
    },
    isSDK(o: any): o is MsgAddToConcentratedLiquiditySuperfluidPositionSDKType {
        return o && (o.$typeUrl === MsgAddToConcentratedLiquiditySuperfluidPosition.typeUrl || typeof o.position_id === "bigint" && typeof o.sender === "string" && Coin.isSDK(o.token_desired0) && Coin.isSDK(o.token_desired1));
    },
    isAmino(o: any): o is MsgAddToConcentratedLiquiditySuperfluidPositionAmino {
        return o && (o.$typeUrl === MsgAddToConcentratedLiquiditySuperfluidPosition.typeUrl || typeof o.position_id === "bigint" && typeof o.sender === "string" && Coin.isAmino(o.token_desired0) && Coin.isAmino(o.token_desired1));
    },
    encode(message: MsgAddToConcentratedLiquiditySuperfluidPosition, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        if (message.positionId !== BigInt(0)) {
            writer.uint32(8).uint64(message.positionId);
        }
        if (message.sender !== "") {
            writer.uint32(18).string(message.sender);
        }
        if (message.tokenDesired0 !== undefined) {
            Coin.encode(message.tokenDesired0, writer.uint32(26).fork()).ldelim();
        }
        if (message.tokenDesired1 !== undefined) {
            Coin.encode(message.tokenDesired1, writer.uint32(34).fork()).ldelim();
        }
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): MsgAddToConcentratedLiquiditySuperfluidPosition {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgAddToConcentratedLiquiditySuperfluidPosition();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.positionId = reader.uint64();
                    break;
                case 2:
                    message.sender = reader.string();
                    break;
                case 3:
                    message.tokenDesired0 = Coin.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.tokenDesired1 = Coin.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromPartial(object: Partial<MsgAddToConcentratedLiquiditySuperfluidPosition>): MsgAddToConcentratedLiquiditySuperfluidPosition {
        const message = createBaseMsgAddToConcentratedLiquiditySuperfluidPosition();
        message.positionId = object.positionId !== undefined && object.positionId !== null ? BigInt(object.positionId.toString()) : BigInt(0);
        message.sender = object.sender ?? "";
        message.tokenDesired0 = object.tokenDesired0 !== undefined && object.tokenDesired0 !== null ? Coin.fromPartial(object.tokenDesired0) : undefined;
        message.tokenDesired1 = object.tokenDesired1 !== undefined && object.tokenDesired1 !== null ? Coin.fromPartial(object.tokenDesired1) : undefined;
        return message;
    },
    fromAmino(object: MsgAddToConcentratedLiquiditySuperfluidPositionAmino): MsgAddToConcentratedLiquiditySuperfluidPosition {
        const message = createBaseMsgAddToConcentratedLiquiditySuperfluidPosition();
        if (object.position_id !== undefined && object.position_id !== null) {
            message.positionId = BigInt(object.position_id);
        }
        if (object.sender !== undefined && object.sender !== null) {
            message.sender = object.sender;
        }
        if (object.token_desired0 !== undefined && object.token_desired0 !== null) {
            message.tokenDesired0 = Coin.fromAmino(object.token_desired0);
        }
        if (object.token_desired1 !== undefined && object.token_desired1 !== null) {
            message.tokenDesired1 = Coin.fromAmino(object.token_desired1);
        }
        return message;
    },
    toAmino(message: MsgAddToConcentratedLiquiditySuperfluidPosition): MsgAddToConcentratedLiquiditySuperfluidPositionAmino {
        const obj: any = {};
        obj.position_id = message.positionId !== BigInt(0) ? message.positionId.toString() : undefined;
        obj.sender = message.sender === "" ? undefined : message.sender;
        obj.token_desired0 = message.tokenDesired0 ? Coin.toAmino(message.tokenDesired0) : undefined;
        obj.token_desired1 = message.tokenDesired1 ? Coin.toAmino(message.tokenDesired1) : undefined;
        return obj;
    },
    fromAminoMsg(object: MsgAddToConcentratedLiquiditySuperfluidPositionAminoMsg): MsgAddToConcentratedLiquiditySuperfluidPosition {
        return MsgAddToConcentratedLiquiditySuperfluidPosition.fromAmino(object.value);
    },
    toAminoMsg(message: MsgAddToConcentratedLiquiditySuperfluidPosition): MsgAddToConcentratedLiquiditySuperfluidPositionAminoMsg {
        return {
            type: "osmosis/add-to-cl-superfluid-position",
            value: MsgAddToConcentratedLiquiditySuperfluidPosition.toAmino(message)
        };
    },
    fromProtoMsg(message: MsgAddToConcentratedLiquiditySuperfluidPositionProtoMsg): MsgAddToConcentratedLiquiditySuperfluidPosition {
        return MsgAddToConcentratedLiquiditySuperfluidPosition.decode(message.value);
    },
    toProto(message: MsgAddToConcentratedLiquiditySuperfluidPosition): Uint8Array {
        return MsgAddToConcentratedLiquiditySuperfluidPosition.encode(message).finish();
    },
    toProtoMsg(message: MsgAddToConcentratedLiquiditySuperfluidPosition): MsgAddToConcentratedLiquiditySuperfluidPositionProtoMsg {
        return {
            typeUrl: "/osmosis.superfluid.MsgAddToConcentratedLiquiditySuperfluidPosition",
            value: MsgAddToConcentratedLiquiditySuperfluidPosition.encode(message).finish()
        };
    }
};
function createBaseMsgAddToConcentratedLiquiditySuperfluidPositionResponse(): MsgAddToConcentratedLiquiditySuperfluidPositionResponse {
    return {
        positionId: BigInt(0),
        amount0: "",
        amount1: "",
        newLiquidity: "",
        lockId: BigInt(0)
    };
}
export const MsgAddToConcentratedLiquiditySuperfluidPositionResponse = {
    typeUrl: "/osmosis.superfluid.MsgAddToConcentratedLiquiditySuperfluidPositionResponse",
    aminoType: "osmosis/add-to-concentrated-liquidity-superfluid-position-response",
    is(o: any): o is MsgAddToConcentratedLiquiditySuperfluidPositionResponse {
        return o && (o.$typeUrl === MsgAddToConcentratedLiquiditySuperfluidPositionResponse.typeUrl || typeof o.positionId === "bigint" && typeof o.amount0 === "string" && typeof o.amount1 === "string" && typeof o.newLiquidity === "string" && typeof o.lockId === "bigint");
    },
    isSDK(o: any): o is MsgAddToConcentratedLiquiditySuperfluidPositionResponseSDKType {
        return o && (o.$typeUrl === MsgAddToConcentratedLiquiditySuperfluidPositionResponse.typeUrl || typeof o.position_id === "bigint" && typeof o.amount0 === "string" && typeof o.amount1 === "string" && typeof o.new_liquidity === "string" && typeof o.lock_id === "bigint");
    },
    isAmino(o: any): o is MsgAddToConcentratedLiquiditySuperfluidPositionResponseAmino {
        return o && (o.$typeUrl === MsgAddToConcentratedLiquiditySuperfluidPositionResponse.typeUrl || typeof o.position_id === "bigint" && typeof o.amount0 === "string" && typeof o.amount1 === "string" && typeof o.new_liquidity === "string" && typeof o.lock_id === "bigint");
    },
    encode(message: MsgAddToConcentratedLiquiditySuperfluidPositionResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        if (message.positionId !== BigInt(0)) {
            writer.uint32(8).uint64(message.positionId);
        }
        if (message.amount0 !== "") {
            writer.uint32(18).string(message.amount0);
        }
        if (message.amount1 !== "") {
            writer.uint32(26).string(message.amount1);
        }
        if (message.newLiquidity !== "") {
            writer.uint32(42).string(Decimal.fromUserInput(message.newLiquidity, 18).atomics);
        }
        if (message.lockId !== BigInt(0)) {
            writer.uint32(32).uint64(message.lockId);
        }
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): MsgAddToConcentratedLiquiditySuperfluidPositionResponse {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgAddToConcentratedLiquiditySuperfluidPositionResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.positionId = reader.uint64();
                    break;
                case 2:
                    message.amount0 = reader.string();
                    break;
                case 3:
                    message.amount1 = reader.string();
                    break;
                case 5:
                    message.newLiquidity = Decimal.fromAtomics(reader.string(), 18).toString();
                    break;
                case 4:
                    message.lockId = reader.uint64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromPartial(object: Partial<MsgAddToConcentratedLiquiditySuperfluidPositionResponse>): MsgAddToConcentratedLiquiditySuperfluidPositionResponse {
        const message = createBaseMsgAddToConcentratedLiquiditySuperfluidPositionResponse();
        message.positionId = object.positionId !== undefined && object.positionId !== null ? BigInt(object.positionId.toString()) : BigInt(0);
        message.amount0 = object.amount0 ?? "";
        message.amount1 = object.amount1 ?? "";
        message.newLiquidity = object.newLiquidity ?? "";
        message.lockId = object.lockId !== undefined && object.lockId !== null ? BigInt(object.lockId.toString()) : BigInt(0);
        return message;
    },
    fromAmino(object: MsgAddToConcentratedLiquiditySuperfluidPositionResponseAmino): MsgAddToConcentratedLiquiditySuperfluidPositionResponse {
        const message = createBaseMsgAddToConcentratedLiquiditySuperfluidPositionResponse();
        if (object.position_id !== undefined && object.position_id !== null) {
            message.positionId = BigInt(object.position_id);
        }
        if (object.amount0 !== undefined && object.amount0 !== null) {
            message.amount0 = object.amount0;
        }
        if (object.amount1 !== undefined && object.amount1 !== null) {
            message.amount1 = object.amount1;
        }
        if (object.new_liquidity !== undefined && object.new_liquidity !== null) {
            message.newLiquidity = object.new_liquidity;
        }
        if (object.lock_id !== undefined && object.lock_id !== null) {
            message.lockId = BigInt(object.lock_id);
        }
        return message;
    },
    toAmino(message: MsgAddToConcentratedLiquiditySuperfluidPositionResponse): MsgAddToConcentratedLiquiditySuperfluidPositionResponseAmino {
        const obj: any = {};
        obj.position_id = message.positionId !== BigInt(0) ? message.positionId.toString() : undefined;
        obj.amount0 = message.amount0 === "" ? undefined : message.amount0;
        obj.amount1 = message.amount1 === "" ? undefined : message.amount1;
        obj.new_liquidity = message.newLiquidity === "" ? undefined : message.newLiquidity;
        obj.lock_id = message.lockId !== BigInt(0) ? message.lockId.toString() : undefined;
        return obj;
    },
    fromAminoMsg(object: MsgAddToConcentratedLiquiditySuperfluidPositionResponseAminoMsg): MsgAddToConcentratedLiquiditySuperfluidPositionResponse {
        return MsgAddToConcentratedLiquiditySuperfluidPositionResponse.fromAmino(object.value);
    },
    toAminoMsg(message: MsgAddToConcentratedLiquiditySuperfluidPositionResponse): MsgAddToConcentratedLiquiditySuperfluidPositionResponseAminoMsg {
        return {
            type: "osmosis/add-to-concentrated-liquidity-superfluid-position-response",
            value: MsgAddToConcentratedLiquiditySuperfluidPositionResponse.toAmino(message)
        };
    },
    fromProtoMsg(message: MsgAddToConcentratedLiquiditySuperfluidPositionResponseProtoMsg): MsgAddToConcentratedLiquiditySuperfluidPositionResponse {
        return MsgAddToConcentratedLiquiditySuperfluidPositionResponse.decode(message.value);
    },
    toProto(message: MsgAddToConcentratedLiquiditySuperfluidPositionResponse): Uint8Array {
        return MsgAddToConcentratedLiquiditySuperfluidPositionResponse.encode(message).finish();
    },
    toProtoMsg(message: MsgAddToConcentratedLiquiditySuperfluidPositionResponse): MsgAddToConcentratedLiquiditySuperfluidPositionResponseProtoMsg {
        return {
            typeUrl: "/osmosis.superfluid.MsgAddToConcentratedLiquiditySuperfluidPositionResponse",
            value: MsgAddToConcentratedLiquiditySuperfluidPositionResponse.encode(message).finish()
        };
    }
};
function createBaseMsgUnbondConvertAndStake(): MsgUnbondConvertAndStake {
    return {
        lockId: BigInt(0),
        sender: "",
        valAddr: "",
        minAmtToStake: "",
        sharesToConvert: Coin.fromPartial({})
    };
}
export const MsgUnbondConvertAndStake = {
    typeUrl: "/osmosis.superfluid.MsgUnbondConvertAndStake",
    aminoType: "osmosis/unbond-convert-and-stake",
    is(o: any): o is MsgUnbondConvertAndStake {
        return o && (o.$typeUrl === MsgUnbondConvertAndStake.typeUrl || typeof o.lockId === "bigint" && typeof o.sender === "string" && typeof o.valAddr === "string" && typeof o.minAmtToStake === "string" && Coin.is(o.sharesToConvert));
    },
    isSDK(o: any): o is MsgUnbondConvertAndStakeSDKType {
        return o && (o.$typeUrl === MsgUnbondConvertAndStake.typeUrl || typeof o.lock_id === "bigint" && typeof o.sender === "string" && typeof o.val_addr === "string" && typeof o.min_amt_to_stake === "string" && Coin.isSDK(o.shares_to_convert));
    },
    isAmino(o: any): o is MsgUnbondConvertAndStakeAmino {
        return o && (o.$typeUrl === MsgUnbondConvertAndStake.typeUrl || typeof o.lock_id === "bigint" && typeof o.sender === "string" && typeof o.val_addr === "string" && typeof o.min_amt_to_stake === "string" && Coin.isAmino(o.shares_to_convert));
    },
    encode(message: MsgUnbondConvertAndStake, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        if (message.lockId !== BigInt(0)) {
            writer.uint32(8).uint64(message.lockId);
        }
        if (message.sender !== "") {
            writer.uint32(18).string(message.sender);
        }
        if (message.valAddr !== "") {
            writer.uint32(26).string(message.valAddr);
        }
        if (message.minAmtToStake !== "") {
            writer.uint32(34).string(message.minAmtToStake);
        }
        if (message.sharesToConvert !== undefined) {
            Coin.encode(message.sharesToConvert, writer.uint32(42).fork()).ldelim();
        }
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): MsgUnbondConvertAndStake {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgUnbondConvertAndStake();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.lockId = reader.uint64();
                    break;
                case 2:
                    message.sender = reader.string();
                    break;
                case 3:
                    message.valAddr = reader.string();
                    break;
                case 4:
                    message.minAmtToStake = reader.string();
                    break;
                case 5:
                    message.sharesToConvert = Coin.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromPartial(object: Partial<MsgUnbondConvertAndStake>): MsgUnbondConvertAndStake {
        const message = createBaseMsgUnbondConvertAndStake();
        message.lockId = object.lockId !== undefined && object.lockId !== null ? BigInt(object.lockId.toString()) : BigInt(0);
        message.sender = object.sender ?? "";
        message.valAddr = object.valAddr ?? "";
        message.minAmtToStake = object.minAmtToStake ?? "";
        message.sharesToConvert = object.sharesToConvert !== undefined && object.sharesToConvert !== null ? Coin.fromPartial(object.sharesToConvert) : undefined;
        return message;
    },
    fromAmino(object: MsgUnbondConvertAndStakeAmino): MsgUnbondConvertAndStake {
        const message = createBaseMsgUnbondConvertAndStake();
        if (object.lock_id !== undefined && object.lock_id !== null) {
            message.lockId = BigInt(object.lock_id);
        }
        if (object.sender !== undefined && object.sender !== null) {
            message.sender = object.sender;
        }
        if (object.val_addr !== undefined && object.val_addr !== null) {
            message.valAddr = object.val_addr;
        }
        if (object.min_amt_to_stake !== undefined && object.min_amt_to_stake !== null) {
            message.minAmtToStake = object.min_amt_to_stake;
        }
        if (object.shares_to_convert !== undefined && object.shares_to_convert !== null) {
            message.sharesToConvert = Coin.fromAmino(object.shares_to_convert);
        }
        return message;
    },
    toAmino(message: MsgUnbondConvertAndStake): MsgUnbondConvertAndStakeAmino {
        const obj: any = {};
        obj.lock_id = message.lockId !== BigInt(0) ? message.lockId.toString() : undefined;
        obj.sender = message.sender === "" ? undefined : message.sender;
        obj.val_addr = message.valAddr === "" ? undefined : message.valAddr;
        obj.min_amt_to_stake = message.minAmtToStake === "" ? undefined : message.minAmtToStake;
        obj.shares_to_convert = message.sharesToConvert ? Coin.toAmino(message.sharesToConvert) : undefined;
        return obj;
    },
    fromAminoMsg(object: MsgUnbondConvertAndStakeAminoMsg): MsgUnbondConvertAndStake {
        return MsgUnbondConvertAndStake.fromAmino(object.value);
    },
    toAminoMsg(message: MsgUnbondConvertAndStake): MsgUnbondConvertAndStakeAminoMsg {
        return {
            type: "osmosis/unbond-convert-and-stake",
            value: MsgUnbondConvertAndStake.toAmino(message)
        };
    },
    fromProtoMsg(message: MsgUnbondConvertAndStakeProtoMsg): MsgUnbondConvertAndStake {
        return MsgUnbondConvertAndStake.decode(message.value);
    },
    toProto(message: MsgUnbondConvertAndStake): Uint8Array {
        return MsgUnbondConvertAndStake.encode(message).finish();
    },
    toProtoMsg(message: MsgUnbondConvertAndStake): MsgUnbondConvertAndStakeProtoMsg {
        return {
            typeUrl: "/osmosis.superfluid.MsgUnbondConvertAndStake",
            value: MsgUnbondConvertAndStake.encode(message).finish()
        };
    }
};
function createBaseMsgUnbondConvertAndStakeResponse(): MsgUnbondConvertAndStakeResponse {
    return {
        totalAmtStaked: ""
    };
}
export const MsgUnbondConvertAndStakeResponse = {
    typeUrl: "/osmosis.superfluid.MsgUnbondConvertAndStakeResponse",
    aminoType: "osmosis/unbond-convert-and-stake-response",
    is(o: any): o is MsgUnbondConvertAndStakeResponse {
        return o && (o.$typeUrl === MsgUnbondConvertAndStakeResponse.typeUrl || typeof o.totalAmtStaked === "string");
    },
    isSDK(o: any): o is MsgUnbondConvertAndStakeResponseSDKType {
        return o && (o.$typeUrl === MsgUnbondConvertAndStakeResponse.typeUrl || typeof o.total_amt_staked === "string");
    },
    isAmino(o: any): o is MsgUnbondConvertAndStakeResponseAmino {
        return o && (o.$typeUrl === MsgUnbondConvertAndStakeResponse.typeUrl || typeof o.total_amt_staked === "string");
    },
    encode(message: MsgUnbondConvertAndStakeResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
        if (message.totalAmtStaked !== "") {
            writer.uint32(10).string(message.totalAmtStaked);
        }
        return writer;
    },
    decode(input: BinaryReader | Uint8Array, length?: number): MsgUnbondConvertAndStakeResponse {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgUnbondConvertAndStakeResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.totalAmtStaked = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromPartial(object: Partial<MsgUnbondConvertAndStakeResponse>): MsgUnbondConvertAndStakeResponse {
        const message = createBaseMsgUnbondConvertAndStakeResponse();
        message.totalAmtStaked = object.totalAmtStaked ?? "";
        return message;
    },
    fromAmino(object: MsgUnbondConvertAndStakeResponseAmino): MsgUnbondConvertAndStakeResponse {
        const message = createBaseMsgUnbondConvertAndStakeResponse();
        if (object.total_amt_staked !== undefined && object.total_amt_staked !== null) {
            message.totalAmtStaked = object.total_amt_staked;
        }
        return message;
    },
    toAmino(message: MsgUnbondConvertAndStakeResponse): MsgUnbondConvertAndStakeResponseAmino {
        const obj: any = {};
        obj.total_amt_staked = message.totalAmtStaked === "" ? undefined : message.totalAmtStaked;
        return obj;
    },
    fromAminoMsg(object: MsgUnbondConvertAndStakeResponseAminoMsg): MsgUnbondConvertAndStakeResponse {
        return MsgUnbondConvertAndStakeResponse.fromAmino(object.value);
    },
    toAminoMsg(message: MsgUnbondConvertAndStakeResponse): MsgUnbondConvertAndStakeResponseAminoMsg {
        return {
            type: "osmosis/unbond-convert-and-stake-response",
            value: MsgUnbondConvertAndStakeResponse.toAmino(message)
        };
    },
    fromProtoMsg(message: MsgUnbondConvertAndStakeResponseProtoMsg): MsgUnbondConvertAndStakeResponse {
        return MsgUnbondConvertAndStakeResponse.decode(message.value);
    },
    toProto(message: MsgUnbondConvertAndStakeResponse): Uint8Array {
        return MsgUnbondConvertAndStakeResponse.encode(message).finish();
    },
    toProtoMsg(message: MsgUnbondConvertAndStakeResponse): MsgUnbondConvertAndStakeResponseProtoMsg {
        return {
            typeUrl: "/osmosis.superfluid.MsgUnbondConvertAndStakeResponse",
            value: MsgUnbondConvertAndStakeResponse.encode(message).finish()
        };
    }
};
