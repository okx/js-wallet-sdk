// Copyright © Aptos Foundation
// SPDX-License-Identifier: Apache-2.0

/**
 * GENERATED QUERY TYPES FROM GRAPHQL SCHEMA
 *
 * generated types we generate from graphql schema that match the structure of the
 * response type when querying from Hasura schema.
 *
 * These types are used as the return type when making the actual request (usually
 * under the /internal/ folder)
 */

import {
  GetAccountCoinsDataQuery,
  GetAccountOwnedObjectsQuery,
  GetAccountOwnedTokensQuery,
  GetAccountOwnedTokensFromCollectionQuery,
  GetAccountCollectionsWithOwnedTokensQuery,
  GetDelegatedStakingActivitiesQuery,
  GetNumberOfDelegatorsQuery,
  GetCollectionDataQuery,
  GetChainTopUserTransactionsQuery,
  GetEventsQuery,
  GetTokenDataQuery,
  GetProcessorStatusQuery,
  GetFungibleAssetMetadataQuery,
  GetFungibleAssetActivitiesQuery,
  GetCurrentFungibleAssetBalancesQuery,
  GetTokenActivityQuery,
  GetCurrentTokenOwnershipQuery,
  GetNamesQuery,
} from "./generated/operations";

/**
 * CUSTOM RESPONSE TYPES FOR THE END USER
 *
 * To provide a good dev exp, we build custom types derived from the
 * query types to be the response type the end developer/user will
 * work with.
 *
 * These types are used as the return type when calling a sdk api function
 * that calls the function that queries the server (usually under the /api/ folder)
 */
export type GetAccountOwnedObjectsResponse = GetAccountOwnedObjectsQuery["current_objects"];

export type GetAccountOwnedTokensQueryResponse = GetAccountOwnedTokensQuery["current_token_ownerships_v2"];

export type GetAccountOwnedTokensFromCollectionResponse =
  GetAccountOwnedTokensFromCollectionQuery["current_token_ownerships_v2"];
export type GetAccountCollectionsWithOwnedTokenResponse =
  GetAccountCollectionsWithOwnedTokensQuery["current_collection_ownership_v2_view"];
export type GetAccountCoinsDataResponse = GetAccountCoinsDataQuery["current_fungible_asset_balances"];
export type GetChainTopUserTransactionsResponse = GetChainTopUserTransactionsQuery["user_transactions"];
export type GetEventsResponse = GetEventsQuery["events"];

export type GetNumberOfDelegatorsResponse = GetNumberOfDelegatorsQuery["num_active_delegator_per_pool"];
export type GetDelegatedStakingActivitiesResponse = GetDelegatedStakingActivitiesQuery["delegated_staking_activities"];
export type GetCollectionDataResponse = GetCollectionDataQuery["current_collections_v2"][0];
export type GetTokenDataResponse = GetTokenDataQuery["current_token_datas_v2"][0];
export type GetProcessorStatusResponse = GetProcessorStatusQuery["processor_status"];
export type GetFungibleAssetMetadataResponse = GetFungibleAssetMetadataQuery["fungible_asset_metadata"];
export type GetFungibleAssetActivitiesResponse = GetFungibleAssetActivitiesQuery["fungible_asset_activities"];
export type GetCurrentFungibleAssetBalancesResponse =
  GetCurrentFungibleAssetBalancesQuery["current_fungible_asset_balances"];
export type GetTokenActivityResponse = GetTokenActivityQuery["token_activities_v2"];
export type GetCurrentTokenOwnershipResponse = GetCurrentTokenOwnershipQuery["current_token_ownerships_v2"][0];
export type GetOwnedTokensResponse = GetCurrentTokenOwnershipQuery["current_token_ownerships_v2"];

export type GetANSNameResponse = GetNamesQuery["current_aptos_names"];

/**
 * A generic type that being passed by each function and holds an
 * array of properties we can sort the query by
 */
export type OrderBy<T> = Array<{ [K in keyof T]?: OrderByValue }>;
export type OrderByValue =
  | "asc"
  | "asc_nulls_first"
  | "asc_nulls_last"
  | "desc"
  | "desc_nulls_first"
  | "desc_nulls_last";

/**
 * Refers to the token standard we want to query for
 */
export type TokenStandard = "v1" | "v2";

/**
 * The graphql query type to pass into the `queryIndexer` function
 */
export type GraphqlQuery = {
  query: string;
  variables?: {};
};
