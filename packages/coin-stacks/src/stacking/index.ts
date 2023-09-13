/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 Blockstack Inc.
 * https://github.com/hirosystems/stacks.js/blob/main/LICENSE
 * */

// @ts-ignore
import {bytesToHex, IntegerType, intToBigInt} from '../common';
import {StacksMainnet, StacksNetwork} from '../network';
import {
    AnchorMode,
    ContractCallOptions,
    makeContractCall,
    noneCV,
    principalCV,
    someCV,
    uintCV,
    validateStacksAddress,
    addHex
} from '../transactions';
import {PoxOperationPeriod, StackingErrors} from './constants';
import {
    ensureLegacyBtcAddressForPox1,
    poxAddressToTuple,
} from './utils';

export * from './utils';

/** @internal */
export interface BaseTxOptions {
    /** the fee for the transaction */
    fee?: IntegerType;
    /** the nonce for the transaction */
    nonce?: IntegerType;
    /** the private key (aka `senderkey`) for the transaction */
    privateKey: string;
}

export interface CycleInfo {
    id: number;
    min_threshold_ustx: number;
    stacked_ustx: number;
    is_pox_active: boolean;
}

export interface ContractVersion {
    contract_id: string;
    activation_burnchain_block_height: number;
    first_reward_cycle_id: number;
}

export interface PoxInfo {
    contract_id: string;
    contract_versions?: ContractVersion[];
    current_burnchain_block_height?: number;
    first_burnchain_block_height: number;
    min_amount_ustx: string;
    next_reward_cycle_in: number;
    prepare_cycle_length: number;
    prepare_phase_block_length: number;
    rejection_fraction: number;
    rejection_votes_left_required: number;
    reward_cycle_id: number;
    reward_cycle_length: number;
    reward_phase_block_length: number;
    reward_slots: number;
    current_cycle: CycleInfo;
    next_cycle: CycleInfo & {
        min_increment_ustx: number;
        prepare_phase_start_block_height: number;
        blocks_until_prepare_phase: number;
        reward_phase_start_block_height: number;
        blocks_until_reward_phase: number;
        ustx_until_pox_rejection: number;
    };
}

export type PoxOperationInfo =
    | {
    period: PoxOperationPeriod.Period1;
    pox1: { contract_id: string };
}
    | {
    period: PoxOperationPeriod;
    pox1: { contract_id: string };
    pox2: ContractVersion;
    current: ContractVersion;
}
    | {
    period: PoxOperationPeriod.Period3;
    pox1: { contract_id: string };
    pox2: ContractVersion;
    pox3: ContractVersion;
    current: ContractVersion;
};

export interface AccountExtendedBalances {
    stx: {
        balance: IntegerType;
        total_sent: IntegerType;
        total_received: IntegerType;
        locked: IntegerType;
        lock_height: number;
        burnchain_lock_height: number;
        burnchain_unlock_height: number;
    };
    fungible_tokens: any;
    non_fungible_tokens: any;
}

export type StackerInfo =
    | {
    stacked: false;
}
    | {
    stacked: true;
    details: {
        first_reward_cycle: number;
        lock_period: number;
        unlock_height: number;
        pox_address: {
            version: Uint8Array;
            hashbytes: Uint8Array;
        };
    };
};

export type DelegationInfo =
    | {
    delegated: false;
}
    | {
    delegated: true;
    details: {
        amount_micro_stx: bigint;
        delegated_to: string;
        pox_address:
            | {
            version: Uint8Array;
            hashbytes: Uint8Array;
        }
            | undefined;
        until_burn_ht: number | undefined;
    };
};

export interface BlockTimeInfo {
    mainnet: {
        target_block_time: number;
    };
    testnet: {
        target_block_time: number;
    };
}

export interface CoreInfo {
    burn_block_height: number;
    stable_pox_consensus: string;
}

export interface BalanceInfo {
    balance: string;
    nonce: number;
}

export interface PaginationOptions {
    limit: number;
    offset: number;
}

export interface RewardsError {
    error: string;
}

export interface RewardSetOptions {
    contractId: string;
    rewardCyleId: number;
    rewardSetIndex: number;
}

export interface RewardSetInfo {
    pox_address: {
        version: Uint8Array;
        hashbytes: Uint8Array;
    };
    total_ustx: bigint;
}

export interface StackingEligibility {
    eligible: boolean;
    reason?: string;
}

/**
 * Lock stx check options
 */
export interface CanLockStxOptions {
    /** the reward Bitcoin address */
    poxAddress: string;
    /** number of cycles to lock */
    cycles: number;
}

/**
 * Lock stx options
 */
export interface LockStxOptions {
    /** private key to sign transaction */
    privateKey: string;
    /** number of cycles to lock */
    cycles: number;
    /** the reward Bitcoin address */
    poxAddress: string;
    /** number of microstacks to lock */
    amountMicroStx: IntegerType;
    /** the burnchain block height to begin lock */
    burnBlockHeight: number;
    contract: string;
}

/**
 * Stack extend stx options
 */
export interface StackExtendOptions {
    /** private key to sign transaction */
    privateKey: string;
    /** number of cycles to extend by */
    extendCycles: number;
    /** the reward Bitcoin address */
    poxAddress: string;
}

/**
 * Stack increase stx options
 */
export interface StackIncreaseOptions {
    /** private key to sign transaction */
    privateKey: string;
    /** number of ustx to increase by */
    increaseBy: IntegerType;
}

/**
 * Delegate stx options
 */
export interface DelegateStxOptions {
    /** number of microstacks to delegate */
    amountMicroStx: IntegerType;
    /** the STX address of the delegatee */
    delegateTo: string;
    /** the burnchain block height after which delegation is revoked */
    untilBurnBlockHeight?: number;
    /** the reward Bitcoin address of the delegator */
    poxAddress?: string;
    /** private key to sign transaction */
    privateKey: string;
}

/**
 * Delegate stack stx options
 */
export interface DelegateStackStxOptions {
    /** the STX address of the delegator */
    stacker: string;
    /** number of microstacks to lock */
    amountMicroStx: IntegerType;
    /** the reward Bitcoin address of the delegator */
    poxAddress: string;
    /** the burnchain block height to begin lock */
    burnBlockHeight: number;
    /** number of cycles to lock */
    cycles: number;
    /** private key to sign transaction */
    privateKey: string;
}

/**
 * Delegate stack extend options
 */
export interface DelegateStackExtendOptions {
    /** the STX address of the delegator */
    stacker: string;
    /** the reward Bitcoin address of the delegator */
    poxAddress: string;
    /** number of cycles to extend by */
    extendCount: number;
    /** private key to sign transaction */
    privateKey: string;
}

/**
 * Delegate stack increase options
 */
export interface DelegateStackIncreaseOptions {
    /** the STX address of the delegator */
    stacker: string;
    /** the reward Bitcoin address of the delegator */
    poxAddress: string;
    /** number of ustx to increase by */
    increaseBy: IntegerType;
    /** private key to sign transaction */
    privateKey: string;
    /** nonce for the transaction */
    nonce?: IntegerType;
}

export interface StackAggregationCommitOptions {
    poxAddress: string;
    rewardCycle: number;
    privateKey: string;
}

export interface StackAggregationIncreaseOptions {
    poxAddress: string;
    rewardCycle: number;
    rewardIndex: number;
    privateKey: string;
}

export async function stack(
    {
        contract,
        amountMicroStx,
        poxAddress,
        cycles,
        burnBlockHeight,
        ...txOptions
    }: LockStxOptions & BaseTxOptions): Promise<any> {
    ensureLegacyBtcAddressForPox1({contract, poxAddress});

    const callOptions = getStackOptions({
        amountMicroStx,
        cycles,
        poxAddress,
        contract,
        burnBlockHeight,
    });
    const tx = await makeContractCall({
        ...callOptions,
        ...renamePrivateKey(txOptions),
    });
    const txId = addHex(tx.txid());
    const txSerializedHexString = bytesToHex(tx.serialize());
    return {txId, txSerializedHexString};
}

function getStackOptions({amountMicroStx, poxAddress, cycles, contract, burnBlockHeight,}: {
    cycles: number;
    poxAddress: string;
    amountMicroStx: IntegerType;
    contract: string;
    burnBlockHeight: number;
}) {
    const address = poxAddressToTuple(poxAddress);
    const [contractAddress, contractName] = parseContractId(contract);
    const callOptions: ContractCallOptions = {
        contractAddress,
        contractName,
        functionName: 'stack-stx',
        // sum of uStx, address, burn_block_height, num_cycles
        functionArgs: [uintCV(amountMicroStx), address, uintCV(burnBlockHeight), uintCV(cycles)],
        validateWithAbi: true,
        network: new StacksMainnet(),
        anchorMode: AnchorMode.Any,
    };
    return callOptions;
}

function parseContractId(contract: string): string[] {
    const parts = contract.split('.');

    if (parts.length === 2 && validateStacksAddress(parts[0]) && parts[1].startsWith('pox')) {
        return parts;
    }

    throw new Error('Stacking contract ID is malformed');
}

/** Rename `privateKey` to `senderKey`, for backwards compatibility */
export function renamePrivateKey(txOptions: BaseTxOptions) {
    // @ts-ignore
    txOptions.senderKey = txOptions.privateKey;
    // @ts-ignore
    delete txOptions.privateKey;
    return txOptions as any as {
        fee?: IntegerType;
        nonce?: IntegerType;
        senderKey: string;
    };
}

export function getDelegateOptions(
    contractAddress: string,
    contractName: string,
    functionName: string,
    amountMicroStx: IntegerType,
    delegateTo: string,
    untilBurnBlockHeight?: number,
    poxAddress?: string,
) {
    const address = poxAddress ? someCV(poxAddressToTuple(poxAddress)) : noneCV();
    const callOptions: ContractCallOptions = {
        contractAddress,
        contractName,
        functionName,
        functionArgs: [
            uintCV(amountMicroStx),
            principalCV(delegateTo),
            untilBurnBlockHeight ? someCV(uintCV(untilBurnBlockHeight)) : noneCV(),
            address,
        ],
        validateWithAbi: true,
        network: new StacksMainnet(),
        anchorMode: AnchorMode.Any,
    };
    return callOptions;
}