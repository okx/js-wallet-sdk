// Copyright © Aptos Foundation
// SPDX-License-Identifier: Apache-2.0

/**
 * This file contains the underlying implementations for exposed API surface in
 * the {@link api/fungible_asset}. By moving the methods out into a separate file,
 * other namespaces and processes can access these methods without depending on the entire
 * fungible_asset namespace and without having a dependency cycle error.
 */

import { AptosConfig } from "../api/aptosConfig";
import {
  AnyNumber,
  GetCurrentFungibleAssetBalancesResponse,
  GetFungibleAssetActivitiesResponse,
  GetFungibleAssetMetadataResponse,
  PaginationArgs,
  WhereArg,
} from "../types";
// import { queryIndexer } from "./general";
import {
  GetCurrentFungibleAssetBalances,
  GetFungibleAssetActivities,
  GetFungibleAssetMetadata,
} from "../types/generated/queries";
import {
  GetCurrentFungibleAssetBalancesQuery,
  GetFungibleAssetActivitiesQuery,
  GetFungibleAssetMetadataQuery,
} from "../types/generated/operations";
import {
  CurrentFungibleAssetBalancesBoolExp,
  FungibleAssetActivitiesBoolExp,
  FungibleAssetMetadataBoolExp,
} from "../types/generated/types";
import { AccountAddressInput } from "../core";
import { Account } from "../account";
import {
  EntryFunctionABI,
  InputGenerateTransactionOptions,
  parseTypeTag,
  TypeTagAddress,
  TypeTagU64,
} from "../transactions";
import { generateTransaction } from "./transactionSubmission";
import { SimpleTransaction } from "../transactions/instances/simpleTransaction";

/*export async function getFungibleAssetMetadata(args: {
  aptosConfig: AptosConfig;
  options?: PaginationArgs & WhereArg<FungibleAssetMetadataBoolExp>;
}): Promise<GetFungibleAssetMetadataResponse> {
  const { aptosConfig, options } = args;

  const graphqlQuery = {
    query: GetFungibleAssetMetadata,
    variables: {
      where_condition: options?.where,
      limit: options?.limit,
      offset: options?.offset,
    },
  };

  const data = await queryIndexer<GetFungibleAssetMetadataQuery>({
    aptosConfig,
    query: graphqlQuery,
    originMethod: "getFungibleAssetMetadata",
  });

  return data.fungible_asset_metadata;
}*/

/*export async function getFungibleAssetActivities(args: {
  aptosConfig: AptosConfig;
  options?: PaginationArgs & WhereArg<FungibleAssetActivitiesBoolExp>;
}): Promise<GetFungibleAssetActivitiesResponse> {
  const { aptosConfig, options } = args;

  const graphqlQuery = {
    query: GetFungibleAssetActivities,
    variables: {
      where_condition: options?.where,
      limit: options?.limit,
      offset: options?.offset,
    },
  };

  const data = await queryIndexer<GetFungibleAssetActivitiesQuery>({
    aptosConfig,
    query: graphqlQuery,
    originMethod: "getFungibleAssetActivities",
  });

  return data.fungible_asset_activities;
}*/

/*export async function getCurrentFungibleAssetBalances(args: {
  aptosConfig: AptosConfig;
  options?: PaginationArgs & WhereArg<CurrentFungibleAssetBalancesBoolExp>;
}): Promise<GetCurrentFungibleAssetBalancesResponse> {
  const { aptosConfig, options } = args;

  const graphqlQuery = {
    query: GetCurrentFungibleAssetBalances,
    variables: {
      where_condition: options?.where,
      limit: options?.limit,
      offset: options?.offset,
    },
  };

  const data = await queryIndexer<GetCurrentFungibleAssetBalancesQuery>({
    aptosConfig,
    query: graphqlQuery,
    originMethod: "getCurrentFungibleAssetBalances",
  });

  return data.current_fungible_asset_balances;
}*/

const faTransferAbi: EntryFunctionABI = {
  typeParameters: [{ constraints: [] }],
  parameters: [parseTypeTag("0x1::object::Object"), new TypeTagAddress(), new TypeTagU64()],
};

export async function transferFungibleAsset(args: {
  aptosConfig: AptosConfig;
  sender: Account;
  fungibleAssetMetadataAddress: AccountAddressInput;
  recipient: AccountAddressInput;
  amount: AnyNumber;
  options?: InputGenerateTransactionOptions;
}): Promise<SimpleTransaction> {
  const { aptosConfig, sender, fungibleAssetMetadataAddress, recipient, amount, options } = args;
  return generateTransaction({
    aptosConfig,
    sender: sender.accountAddress,
    data: {
      function: "0x1::primary_fungible_store::transfer",
      typeArguments: ["0x1::fungible_asset::Metadata"],
      functionArguments: [fungibleAssetMetadataAddress, recipient, amount],
      abi: faTransferAbi,
    },
    options,
  });
}
