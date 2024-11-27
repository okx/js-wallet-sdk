import {
    CAT20State,
    GuardConstState,
    OpenMinterState,
    OpenMinterV2State,
    ProtocolState
} from '@cat-protocol/cat-smartcontracts';
import {UTXO} from 'scrypt-ts';

export interface ContractState<T> {
    protocolState: ProtocolState;

    data: T;
}

export interface Contract<T> {
    utxo: UTXO;
    state: ContractState<T>;
}

export type OpenMinterContract = Contract<OpenMinterState | OpenMinterV2State>;

export type TokenContract = Contract<CAT20State>;

export type GuardContract = Contract<GuardConstState>;
