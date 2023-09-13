/**
 * MIT License
 *
 * Copyright (c) 2021 Sean James Han
 * https://raw.githubusercontent.com/0xs34n/starknet.js/develop/LICENSE
 * */
import { SignerInterface } from '../signer';
import {
  Abi,
  AllowArray,
  Call,
  CairoVersion,
  DeclareContractPayload,
  DeployAccountContractPayload,
  InvocationsDetails,
  Signature
} from '../types';
import { TypedData } from '../utils/typedData/types';

export abstract class AccountInterface {
  public abstract address: string;

  public abstract signer: SignerInterface;

  public abstract cairoVersion: CairoVersion;


  /**
   * Sign an JSON object for off-chain usage with the starknet private key and return the signature
   * This adds a message prefix so it cant be interchanged with transactions
   *
   * @param json - JSON object to be signed
   * @returns the signature of the JSON object
   * @throws {Error} if the JSON object is not a valid JSON
   */
  public abstract signMessage(typedData: TypedData): Promise<Signature>;

  /**
   * Invoke execute function in account contract
   *
   * @param transactions the invocation object or an array of them, containing:
   * - contractAddress - the address of the contract
   * - entrypoint - the entrypoint of the contract
   * - calldata - (defaults to []) the calldata
   * - signature - (defaults to []) the signature
   * @param abi (optional) the abi of the contract for better displaying
   *
   * @returns response from addTransaction
   */
  public abstract execute(
    transactions: AllowArray<Call>,
    abis?: Abi[],
    transactionsDetail?: InvocationsDetails
  ): Promise<any>;

  /**
   * Declares a given compiled contract (json) to starknet
   * 
   * @param contractPayload transaction payload to be deployed containing:
  - contract: compiled contract code
  - (optional) classHash: computed class hash of compiled contract. Pre-compute it for faster execution.
  - (required for Cairo1 without compiledClassHash) casm: CompiledContract | string;
  - (optional for Cairo1 with casm) compiledClassHash: compiled class hash from casm. Pre-compute it for faster execution.
   * @param transactionsDetail Invocation Details containing:
  - optional nonce
  - optional version
  - optional maxFee
   * @returns a confirmation of sending a transaction on the starknet contract
   */
  public abstract declare(
    contractPayload: DeclareContractPayload,
    transactionsDetail?: InvocationsDetails
  ): Promise<any>;

  /**
   * Deploy the account on Starknet
   *
   * @param contractPayload transaction payload to be deployed containing:
  - classHash: computed class hash of compiled contract
  - optional constructor calldata
  - optional address salt
  - optional contractAddress
   * @param transactionsDetail? Invocation Details containing:
  - constant nonce = 0
  - optional version
  - optional maxFee
   * @returns a confirmation of sending a transaction on the starknet contract
   */
  public abstract deployAccount(
      contractPayload: DeployAccountContractPayload,
      transactionsDetail?: InvocationsDetails
  ): Promise<any>;

}
