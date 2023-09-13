/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 Blockstack Inc.
 * https://github.com/hirosystems/stacks.js/blob/main/LICENSE
 * */

import { TransactionVersion, ChainID } from '../common';

export const HIRO_MAINNET_DEFAULT = 'https://stacks-node-api.mainnet.stacks.co';
export const HIRO_TESTNET_DEFAULT = 'https://stacks-node-api.testnet.stacks.co';
export const HIRO_MOCKNET_DEFAULT = 'http://localhost:3999';

export interface NetworkConfig {
  url: string;
}

export const StacksNetworks = ['mainnet', 'testnet', 'devnet', 'mocknet'] as const;
export type StacksNetworkName = (typeof StacksNetworks)[number];

/**
 * @related {@link StacksMainnet}, {@link StacksTestnet}, {@link StacksDevnet}, {@link StacksMocknet}
 */
export class StacksNetwork {
  version = TransactionVersion.Mainnet;
  chainId = ChainID.Mainnet;
  bnsLookupUrl = 'https://stacks-node-api.mainnet.stacks.co';
  broadcastEndpoint = '/v2/transactions';
  transferFeeEstimateEndpoint = '/v2/fees/transfer';
  transactionFeeEstimateEndpoint = '/v2/fees/transaction';
  accountEndpoint = '/v2/accounts';
  contractAbiEndpoint = '/v2/contracts/interface';
  readOnlyFunctionCallEndpoint = '/v2/contracts/call-read';

  readonly coreApiUrl: string;


  constructor(networkConfig: NetworkConfig) {
    this.coreApiUrl = networkConfig.url;
  }

  static fromName = (networkName: StacksNetworkName): StacksNetwork => {
    switch (networkName) {
      case 'mainnet':
        return new StacksMainnet();
      case 'testnet':
        return new StacksTestnet();
      case 'devnet':
        return new StacksDevnet();
      case 'mocknet':
        return new StacksMocknet();
      default:
        throw new Error(
          `Invalid network name provided. Must be one of the following: ${StacksNetworks.join(
            ', '
          )}`
        );
    }
  };

  static fromNameOrNetwork = (network: StacksNetworkName | StacksNetwork) => {
    if (typeof network !== 'string' && 'version' in network) {
      return network;
    }

    return StacksNetwork.fromName(network);
  };

  isMainnet = () => this.version === TransactionVersion.Mainnet;
  getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`;
  getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`;
  getTransactionFeeEstimateApiUrl = () =>
    `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`;
  getAccountApiUrl = (address: string) =>
    `${this.coreApiUrl}${this.accountEndpoint}/${address}?proof=0`;
  getAccountExtendedBalancesApiUrl = (address: string) =>
    `${this.coreApiUrl}/extended/v1/address/${address}/balances`;
  getAbiApiUrl = (address: string, contract: string) =>
    `${this.coreApiUrl}${this.contractAbiEndpoint}/${address}/${contract}`;
  getReadOnlyFunctionCallApiUrl = (
    contractAddress: string,
    contractName: string,
    functionName: string
  ) =>
    `${this.coreApiUrl}${
      this.readOnlyFunctionCallEndpoint
    }/${contractAddress}/${contractName}/${encodeURIComponent(functionName)}`;
  getInfoUrl = () => `${this.coreApiUrl}/v2/info`;
  getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`;
  getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`;
  getRewardsUrl = (address: string, options?: any) => {
    let url = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${address}`;
    if (options) {
      url = `${url}?limit=${options.limit}&offset=${options.offset}`;
    }
    return url;
  };
  getRewardsTotalUrl = (address: string) =>
    `${this.coreApiUrl}/extended/v1/burnchain/rewards/${address}/total`;
  getRewardHoldersUrl = (address: string, options?: any) => {
    let url = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${address}`;
    if (options) {
      url = `${url}?limit=${options.limit}&offset=${options.offset}`;
    }
    return url;
  };
  getStackerInfoUrl = (contractAddress: string, contractName: string) =>
    `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${contractAddress}/${contractName}/get-stacker-info`;
  getDataVarUrl = (contractAddress: string, contractName: string, dataVarName: string) =>
    `${this.coreApiUrl}/v2/data_var/${contractAddress}/${contractName}/${dataVarName}?proof=0`;
  getMapEntryUrl = (contractAddress: string, contractName: string, mapName: string) =>
    `${this.coreApiUrl}/v2/map_entry/${contractAddress}/${contractName}/${mapName}?proof=0`;
}

/**
 * A {@link StacksNetwork} with the parameters for the Stacks mainnet.
 * Pass a `url` option to override the default Hiro hosted Stacks node API.
 * Pass a `fetchFn` option to customize the default networking functions.
 * @example
 * ```
 * const network = new StacksMainnet();
 * const network = new StacksMainnet({ url: "https://stacks-node-api.mainnet.stacks.co" });
 * const network = new StacksMainnet({ fetch: createFetchFn() });
 * ```
 * @related {@link createFetchFn}, {@link createApiKeyMiddleware}
 */
export class StacksMainnet extends StacksNetwork {
  version = TransactionVersion.Mainnet;
  chainId = ChainID.Mainnet;

  constructor(opts?: Partial<NetworkConfig>) {
    super({
      url: opts?.url ?? HIRO_MAINNET_DEFAULT,
    });
  }
}

/**
 * A {@link StacksNetwork} with the parameters for the Stacks testnet.
 * Pass a `url` option to override the default Hiro hosted Stacks node API.
 * Pass a `fetchFn` option to customize the default networking functions.
 * @example
 * ```
 * const network = new StacksTestnet();
 * const network = new StacksTestnet({ url: "https://stacks-node-api.testnet.stacks.co" });
 * const network = new StacksTestnet({ fetch: createFetchFn() });
 * ```
 * @related {@link createFetchFn}, {@link createApiKeyMiddleware}
 */
export class StacksTestnet extends StacksNetwork {
  version = TransactionVersion.Testnet;
  chainId = ChainID.Testnet;

  constructor(opts?: Partial<NetworkConfig>) {
    super({
      url: opts?.url ?? HIRO_TESTNET_DEFAULT,
    });
  }
}

/**
 * A {@link StacksNetwork} using the testnet parameters, but `localhost:3999` as the API URL.
 */
export class StacksMocknet extends StacksNetwork {
  version = TransactionVersion.Testnet;
  chainId = ChainID.Testnet;

  constructor(opts?: Partial<NetworkConfig>) {
    super({
      url: opts?.url ?? HIRO_MOCKNET_DEFAULT,
    });
  }
}

/** Alias for {@link StacksMocknet} */
export const StacksDevnet = StacksMocknet;