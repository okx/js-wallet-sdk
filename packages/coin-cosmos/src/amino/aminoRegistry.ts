/**
 * The following methods are based on `cosmjs`, thanks for their work
 * https://github.com/cosmos/cosmjs
 */
import { AminoConverter, AminoConverters, AminoMsg } from './aminotypes';
import { Coin } from "./coins"
import { MsgTransfer } from '../types/ibc/applications/transfer/v1/tx';
import { base, Long } from '@okxweb3/crypto-lib';
import { MsgMultiSend, MsgSend } from '../types/cosmos/bank/v1beta1/tx';
import {
  MsgBeginRedelegate,
  MsgCreateValidator,
  MsgDelegate,
  MsgEditValidator,
  MsgUndelegate,
} from '../types/cosmos/staking/v1beta1/tx';
import { decodeBech32Pubkey, encodeBech32Pubkey } from './encoding';

export function assertDefinedAndNotNull<T>(value: T | undefined | null, msg?: string): asserts value is T {
  if (value === undefined || value === null) {
    throw new Error(msg ?? "value is undefined or null");
  }
}

export function createDefaultAminoConverters(prefix: string): AminoConverters {
  return {
    ...createBankAminoConverters(),
    ...createStakingAminoConverters(prefix),
    ...createIbcAminoConverters(),
  };
}

// https://github.com/cosmos/ibc-go/blob/07b6a97b67d17fd214a83764cbdb2c2c3daef445/modules/core/02-client/types/client.pb.go#L297-L312
interface AminoHeight {
  /** 0 values must be omitted (https://github.com/cosmos/cosmos-sdk/blob/v0.42.7/x/ibc/core/02-client/types/client.pb.go#L252). */
  readonly revision_number?: string;
  /** 0 values must be omitted (https://github.com/cosmos/cosmos-sdk/blob/v0.42.7/x/ibc/core/02-client/types/client.pb.go#L254). */
  readonly revision_height?: string;
}

// https://github.com/cosmos/ibc-go/blob/07b6a97b67d17fd214a83764cbdb2c2c3daef445/modules/apps/transfer/types/tx.pb.go#L33-L53
/** Transfers fungible tokens (i.e Coins) between ICS20 enabled chains */
export interface AminoMsgTransfer extends AminoMsg {
  readonly type: "cosmos-sdk/MsgTransfer";
  readonly value: {
    readonly source_port: string;
    readonly source_channel: string;
    readonly token?: Coin;
    /** Bech32 account address */
    readonly sender: string;
    /** Bech32 account address */
    readonly receiver: string;
    /**
     * The timeout as a (revision_number, revision_height) pair.
     *
     * This fied is is non-optional (https://github.com/cosmos/cosmos-sdk/blob/v0.42.7/x/ibc/applications/transfer/types/tx.pb.go#L49).
     * In order to not set the timeout height, set it to {}.
     */
    readonly timeout_height: AminoHeight;
    /**
     * Timeout timestamp in nanoseconds since Unix epoch. The timeout is disabled when set to 0.
     *
     * 0 values must be omitted (https://github.com/cosmos/cosmos-sdk/blob/v0.42.7/x/ibc/applications/transfer/types/tx.pb.go#L52).
     */
    readonly timeout_timestamp?: string;
  };
}

export function isAminoMsgTransfer(msg: AminoMsg): msg is AminoMsgTransfer {
  return msg.type === "cosmos-sdk/MsgTransfer";
}

function omitDefault<T extends string | number | Long>(input: T): T | undefined {
  if (typeof input === "string") {
    return input === "" ? undefined : input;
  }

  if (typeof input === "number") {
    return input === 0 ? undefined : input;
  }

  if (Long.isLong(input)) {
    return input.isZero() ? undefined : input;
  }

  throw new Error(`Got unsupported type '${typeof input}'`);
}

export function createIbcAminoConverters(): AminoConverters {
  return {
    "/ibc.applications.transfer.v1.MsgTransfer": {
      aminoType: "cosmos-sdk/MsgTransfer",
      toAmino: ({
                  sourcePort,
                  sourceChannel,
                  token,
                  sender,
                  receiver,
                  timeoutHeight,
                  timeoutTimestamp,
                }: MsgTransfer): AminoMsgTransfer["value"] => ({
        source_port: sourcePort,
        source_channel: sourceChannel,
        token: token,
        sender: sender,
        receiver: receiver,
        timeout_height: timeoutHeight
          ? {
            revision_height: omitDefault(timeoutHeight.revisionHeight)?.toString(),
            revision_number: omitDefault(timeoutHeight.revisionNumber)?.toString(),
          }
          : {},
        timeout_timestamp: omitDefault(timeoutTimestamp)?.toString(),
      }),
      fromAmino: ({
                    source_port,
                    source_channel,
                    token,
                    sender,
                    receiver,
                    timeout_height,
                    timeout_timestamp,
                  }: AminoMsgTransfer["value"]): MsgTransfer => ({
        sourcePort: source_port,
        sourceChannel: source_channel,
        token: token,
        sender: sender,
        receiver: receiver,
        timeoutHeight: timeout_height
          ? {
            revisionHeight: Long.fromString(timeout_height.revision_height || "0", true),
            revisionNumber: Long.fromString(timeout_height.revision_number || "0", true),
          }
          : undefined,
        timeoutTimestamp: Long.fromString(timeout_timestamp || "0", true),
      }),
    },
  };
}


/** A high level transaction of the coin module */
export interface AminoMsgSend extends AminoMsg {
  readonly type: "cosmos-sdk/MsgSend";
  readonly value: {
    /** Bech32 account address */
    readonly from_address: string;
    /** Bech32 account address */
    readonly to_address: string;
    readonly amount: readonly Coin[];
  };
}

export function isAminoMsgSend(msg: AminoMsg): msg is AminoMsgSend {
  return msg.type === "cosmos-sdk/MsgSend";
}

interface Input {
  /** Bech32 account address */
  readonly address: string;
  readonly coins: readonly Coin[];
}

interface Output {
  /** Bech32 account address */
  readonly address: string;
  readonly coins: readonly Coin[];
}

/** A high level transaction of the coin module */
export interface AminoMsgMultiSend extends AminoMsg {
  readonly type: "cosmos-sdk/MsgMultiSend";
  readonly value: {
    readonly inputs: readonly Input[];
    readonly outputs: readonly Output[];
  };
}

export function isAminoMsgMultiSend(msg: AminoMsg): msg is AminoMsgMultiSend {
  return msg.type === "cosmos-sdk/MsgMultiSend";
}

export function createBankAminoConverters(): AminoConverters {
  return {
    "/cosmos.bank.v1beta1.MsgSend": {
      aminoType: "cosmos-sdk/MsgSend",
      toAmino: ({ fromAddress, toAddress, amount }: MsgSend): AminoMsgSend["value"] => ({
        from_address: fromAddress,
        to_address: toAddress,
        amount: [...amount],
      }),
      fromAmino: ({ from_address, to_address, amount }: AminoMsgSend["value"]): MsgSend => ({
        fromAddress: from_address,
        toAddress: to_address,
        amount: [...amount],
      }),
    },
    "/cosmos.bank.v1beta1.MsgMultiSend": {
      aminoType: "cosmos-sdk/MsgMultiSend",
      toAmino: ({ inputs, outputs }: MsgMultiSend): AminoMsgMultiSend["value"] => ({
        inputs: inputs.map((input) => ({
          address: input.address,
          coins: [...input.coins],
        })),
        outputs: outputs.map((output) => ({
          address: output.address,
          coins: [...output.coins],
        })),
      }),
      fromAmino: ({ inputs, outputs }: AminoMsgMultiSend["value"]): MsgMultiSend => ({
        inputs: inputs.map((input) => ({
          address: input.address,
          coins: [...input.coins],
        })),
        outputs: outputs.map((output) => ({
          address: output.address,
          coins: [...output.coins],
        })),
      }),
    },
  };
}


/** The initial commission rates to be used for creating a validator */
interface CommissionRates {
  readonly rate: string;
  readonly max_rate: string;
  readonly max_change_rate: string;
}

/** A validator description. */
interface Description {
  readonly moniker: string;
  readonly identity: string;
  readonly website: string;
  readonly security_contact: string;
  readonly details: string;
}

/** Creates a new validator. */
export interface AminoMsgCreateValidator extends AminoMsg {
  readonly type: "cosmos-sdk/MsgCreateValidator";
  readonly value: {
    readonly description: Description;
    readonly commission: CommissionRates;
    readonly min_self_delegation: string;
    /** Bech32 encoded delegator address */
    readonly delegator_address: string;
    /** Bech32 encoded validator address */
    readonly validator_address: string;
    /** Bech32 encoded public key */
    readonly pubkey: string;
    readonly value: Coin;
  };
}

export function isAminoMsgCreateValidator(msg: AminoMsg): msg is AminoMsgCreateValidator {
  return msg.type === "cosmos-sdk/MsgCreateValidator";
}

/** Edits an existing validator. */
export interface AminoMsgEditValidator extends AminoMsg {
  readonly type: "cosmos-sdk/MsgEditValidator";
  readonly value: {
    readonly description: Description;
    /** Bech32 encoded validator address */
    readonly validator_address: string;
    readonly commission_rate: string;
    readonly min_self_delegation: string;
  };
}

export function isAminoMsgEditValidator(msg: AminoMsg): msg is AminoMsgEditValidator {
  return msg.type === "cosmos-sdk/MsgEditValidator";
}

/**
 * Performs a delegation from a delegate to a validator.
 *
 * @see https://docs.cosmos.network/master/modules/staking/03_messages.html#msgdelegate
 */
export interface AminoMsgDelegate extends AminoMsg {
  readonly type: "cosmos-sdk/MsgDelegate";
  readonly value: {
    /** Bech32 encoded delegator address */
    readonly delegator_address: string;
    /** Bech32 encoded validator address */
    readonly validator_address: string;
    readonly amount: Coin;
  };
}

export function isAminoMsgDelegate(msg: AminoMsg): msg is AminoMsgDelegate {
  return msg.type === "cosmos-sdk/MsgDelegate";
}

/** Performs a redelegation from a delegate and source validator to a destination validator */
export interface AminoMsgBeginRedelegate extends AminoMsg {
  readonly type: "cosmos-sdk/MsgBeginRedelegate";
  readonly value: {
    /** Bech32 encoded delegator address */
    readonly delegator_address: string;
    /** Bech32 encoded source validator address */
    readonly validator_src_address: string;
    /** Bech32 encoded destination validator address */
    readonly validator_dst_address: string;
    readonly amount: Coin;
  };
}

export function isAminoMsgBeginRedelegate(msg: AminoMsg): msg is AminoMsgBeginRedelegate {
  return msg.type === "cosmos-sdk/MsgBeginRedelegate";
}

/** Performs an undelegation from a delegate and a validator */
export interface AminoMsgUndelegate extends AminoMsg {
  readonly type: "cosmos-sdk/MsgUndelegate";
  readonly value: {
    /** Bech32 encoded delegator address */
    readonly delegator_address: string;
    /** Bech32 encoded validator address */
    readonly validator_address: string;
    readonly amount: Coin;
  };
}

export function isAminoMsgUndelegate(msg: AminoMsg): msg is AminoMsgUndelegate {
  return msg.type === "cosmos-sdk/MsgUndelegate";
}

export function createStakingAminoConverters(
  prefix: string,
): Record<string, AminoConverter | "not_supported_by_chain"> {
  return {
    "/cosmos.staking.v1beta1.MsgBeginRedelegate": {
      aminoType: "cosmos-sdk/MsgBeginRedelegate",
      toAmino: ({
                  delegatorAddress,
                  validatorSrcAddress,
                  validatorDstAddress,
                  amount,
                }: MsgBeginRedelegate): AminoMsgBeginRedelegate["value"] => {
        assertDefinedAndNotNull(amount, "missing amount");
        return {
          delegator_address: delegatorAddress,
          validator_src_address: validatorSrcAddress,
          validator_dst_address: validatorDstAddress,
          amount: amount,
        };
      },
      fromAmino: ({
                    delegator_address,
                    validator_src_address,
                    validator_dst_address,
                    amount,
                  }: AminoMsgBeginRedelegate["value"]): MsgBeginRedelegate => ({
        delegatorAddress: delegator_address,
        validatorSrcAddress: validator_src_address,
        validatorDstAddress: validator_dst_address,
        amount: amount,
      }),
    },
    "/cosmos.staking.v1beta1.MsgCreateValidator": {
      aminoType: "cosmos-sdk/MsgCreateValidator",
      toAmino: ({
                  description,
                  commission,
                  minSelfDelegation,
                  delegatorAddress,
                  validatorAddress,
                  pubkey,
                  value,
                }: MsgCreateValidator): AminoMsgCreateValidator["value"] => {
        assertDefinedAndNotNull(description, "missing description");
        assertDefinedAndNotNull(commission, "missing commission");
        assertDefinedAndNotNull(pubkey, "missing pubkey");
        assertDefinedAndNotNull(value, "missing value");
        return {
          description: {
            moniker: description.moniker,
            identity: description.identity,
            website: description.website,
            security_contact: description.securityContact,
            details: description.details,
          },
          commission: {
            rate: commission.rate,
            max_rate: commission.maxRate,
            max_change_rate: commission.maxChangeRate,
          },
          min_self_delegation: minSelfDelegation,
          delegator_address: delegatorAddress,
          validator_address: validatorAddress,
          pubkey: encodeBech32Pubkey(
            {
              type: "tendermint/PubKeySecp256k1",
              value: base.toBase64(pubkey.value),
            },
            prefix,
          ),
          value: value,
        };
      },
      fromAmino: ({
                    description,
                    commission,
                    min_self_delegation,
                    delegator_address,
                    validator_address,
                    pubkey,
                    value,
                  }: AminoMsgCreateValidator["value"]): MsgCreateValidator => {
        const decodedPubkey = decodeBech32Pubkey(pubkey);
        if (decodedPubkey.type !== "tendermint/PubKeySecp256k1") {
          throw new Error("Only Secp256k1 public keys are supported");
        }
        return {
          description: {
            moniker: description.moniker,
            identity: description.identity,
            website: description.website,
            securityContact: description.security_contact,
            details: description.details,
          },
          commission: {
            rate: commission.rate,
            maxRate: commission.max_rate,
            maxChangeRate: commission.max_change_rate,
          },
          minSelfDelegation: min_self_delegation,
          delegatorAddress: delegator_address,
          validatorAddress: validator_address,
          pubkey: {
            typeUrl: "/cosmos.crypto.secp256k1.PubKey",
            value: base.fromBase64(decodedPubkey.value),
          },
          value: value,
        };
      },
    },
    "/cosmos.staking.v1beta1.MsgDelegate": {
      aminoType: "cosmos-sdk/MsgDelegate",
      toAmino: ({ delegatorAddress, validatorAddress, amount }: MsgDelegate): AminoMsgDelegate["value"] => {
        assertDefinedAndNotNull(amount, "missing amount");
        return {
          delegator_address: delegatorAddress,
          validator_address: validatorAddress,
          amount: amount,
        };
      },
      fromAmino: ({
                    delegator_address,
                    validator_address,
                    amount,
                  }: AminoMsgDelegate["value"]): MsgDelegate => ({
        delegatorAddress: delegator_address,
        validatorAddress: validator_address,
        amount: amount,
      }),
    },
    "/cosmos.staking.v1beta1.MsgEditValidator": {
      aminoType: "cosmos-sdk/MsgEditValidator",
      toAmino: ({
                  description,
                  commissionRate,
                  minSelfDelegation,
                  validatorAddress,
                }: MsgEditValidator): AminoMsgEditValidator["value"] => {
        assertDefinedAndNotNull(description, "missing description");
        return {
          description: {
            moniker: description.moniker,
            identity: description.identity,
            website: description.website,
            security_contact: description.securityContact,
            details: description.details,
          },
          commission_rate: commissionRate,
          min_self_delegation: minSelfDelegation,
          validator_address: validatorAddress,
        };
      },
      fromAmino: ({
                    description,
                    commission_rate,
                    min_self_delegation,
                    validator_address,
                  }: AminoMsgEditValidator["value"]): MsgEditValidator => ({
        description: {
          moniker: description.moniker,
          identity: description.identity,
          website: description.website,
          securityContact: description.security_contact,
          details: description.details,
        },
        commissionRate: commission_rate,
        minSelfDelegation: min_self_delegation,
        validatorAddress: validator_address,
      }),
    },
    "/cosmos.staking.v1beta1.MsgUndelegate": {
      aminoType: "cosmos-sdk/MsgUndelegate",
      toAmino: ({
                  delegatorAddress,
                  validatorAddress,
                  amount,
                }: MsgUndelegate): AminoMsgUndelegate["value"] => {
        assertDefinedAndNotNull(amount, "missing amount");
        return {
          delegator_address: delegatorAddress,
          validator_address: validatorAddress,
          amount: amount,
        };
      },
      fromAmino: ({
                    delegator_address,
                    validator_address,
                    amount,
                  }: AminoMsgUndelegate["value"]): MsgUndelegate => ({
        delegatorAddress: delegator_address,
        validatorAddress: validator_address,
        amount: amount,
      }),
    },
  };
}