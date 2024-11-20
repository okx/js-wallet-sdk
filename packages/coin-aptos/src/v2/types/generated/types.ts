export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  bigint: { input: any; output: any };
  jsonb: { input: any; output: any };
  numeric: { input: any; output: any };
  timestamp: { input: any; output: any };
  timestamptz: { input: any; output: any };
};

/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
export type BooleanComparisonExp = {
  _eq?: InputMaybe<Scalars["Boolean"]["input"]>;
  _gt?: InputMaybe<Scalars["Boolean"]["input"]>;
  _gte?: InputMaybe<Scalars["Boolean"]["input"]>;
  _in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lte?: InputMaybe<Scalars["Boolean"]["input"]>;
  _neq?: InputMaybe<Scalars["Boolean"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
};

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type IntComparisonExp = {
  _eq?: InputMaybe<Scalars["Int"]["input"]>;
  _gt?: InputMaybe<Scalars["Int"]["input"]>;
  _gte?: InputMaybe<Scalars["Int"]["input"]>;
  _in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["Int"]["input"]>;
  _lte?: InputMaybe<Scalars["Int"]["input"]>;
  _neq?: InputMaybe<Scalars["Int"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["Int"]["input"]>>;
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type StringComparisonExp = {
  _eq?: InputMaybe<Scalars["String"]["input"]>;
  _gt?: InputMaybe<Scalars["String"]["input"]>;
  _gte?: InputMaybe<Scalars["String"]["input"]>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars["String"]["input"]>;
  _in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars["String"]["input"]>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars["String"]["input"]>;
  _lt?: InputMaybe<Scalars["String"]["input"]>;
  _lte?: InputMaybe<Scalars["String"]["input"]>;
  _neq?: InputMaybe<Scalars["String"]["input"]>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars["String"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["String"]["input"]>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars["String"]["input"]>;
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars["String"]["input"]>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars["String"]["input"]>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars["String"]["input"]>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars["String"]["input"]>;
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "account_transactions" */
export type AccountTransactions = {
  account_address: Scalars["String"]["output"];
  /** An array relationship */
  coin_activities: Array<CoinActivities>;
  /** An aggregate relationship */
  coin_activities_aggregate: CoinActivitiesAggregate;
  /** An array relationship */
  delegated_staking_activities: Array<DelegatedStakingActivities>;
  /** An array relationship */
  fungible_asset_activities: Array<FungibleAssetActivities>;
  /** An array relationship */
  token_activities: Array<TokenActivities>;
  /** An aggregate relationship */
  token_activities_aggregate: TokenActivitiesAggregate;
  /** An array relationship */
  token_activities_v2: Array<TokenActivitiesV2>;
  /** An aggregate relationship */
  token_activities_v2_aggregate: TokenActivitiesV2Aggregate;
  transaction_version: Scalars["bigint"]["output"];
};

/** columns and relationships of "account_transactions" */
export type AccountTransactionsCoinActivitiesArgs = {
  distinct_on?: InputMaybe<Array<CoinActivitiesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CoinActivitiesOrderBy>>;
  where?: InputMaybe<CoinActivitiesBoolExp>;
};

/** columns and relationships of "account_transactions" */
export type AccountTransactionsCoinActivitiesAggregateArgs = {
  distinct_on?: InputMaybe<Array<CoinActivitiesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CoinActivitiesOrderBy>>;
  where?: InputMaybe<CoinActivitiesBoolExp>;
};

/** columns and relationships of "account_transactions" */
export type AccountTransactionsDelegatedStakingActivitiesArgs = {
  distinct_on?: InputMaybe<Array<DelegatedStakingActivitiesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<DelegatedStakingActivitiesOrderBy>>;
  where?: InputMaybe<DelegatedStakingActivitiesBoolExp>;
};

/** columns and relationships of "account_transactions" */
export type AccountTransactionsFungibleAssetActivitiesArgs = {
  distinct_on?: InputMaybe<Array<FungibleAssetActivitiesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<FungibleAssetActivitiesOrderBy>>;
  where?: InputMaybe<FungibleAssetActivitiesBoolExp>;
};

/** columns and relationships of "account_transactions" */
export type AccountTransactionsTokenActivitiesArgs = {
  distinct_on?: InputMaybe<Array<TokenActivitiesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<TokenActivitiesOrderBy>>;
  where?: InputMaybe<TokenActivitiesBoolExp>;
};

/** columns and relationships of "account_transactions" */
export type AccountTransactionsTokenActivitiesAggregateArgs = {
  distinct_on?: InputMaybe<Array<TokenActivitiesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<TokenActivitiesOrderBy>>;
  where?: InputMaybe<TokenActivitiesBoolExp>;
};

/** columns and relationships of "account_transactions" */
export type AccountTransactionsTokenActivitiesV2Args = {
  distinct_on?: InputMaybe<Array<TokenActivitiesV2SelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<TokenActivitiesV2OrderBy>>;
  where?: InputMaybe<TokenActivitiesV2BoolExp>;
};

/** columns and relationships of "account_transactions" */
export type AccountTransactionsTokenActivitiesV2AggregateArgs = {
  distinct_on?: InputMaybe<Array<TokenActivitiesV2SelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<TokenActivitiesV2OrderBy>>;
  where?: InputMaybe<TokenActivitiesV2BoolExp>;
};

/** aggregated selection of "account_transactions" */
export type AccountTransactionsAggregate = {
  aggregate?: Maybe<AccountTransactionsAggregateFields>;
  nodes: Array<AccountTransactions>;
};

/** aggregate fields of "account_transactions" */
export type AccountTransactionsAggregateFields = {
  avg?: Maybe<AccountTransactionsAvgFields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<AccountTransactionsMaxFields>;
  min?: Maybe<AccountTransactionsMinFields>;
  stddev?: Maybe<AccountTransactionsStddevFields>;
  stddev_pop?: Maybe<AccountTransactionsStddevPopFields>;
  stddev_samp?: Maybe<AccountTransactionsStddevSampFields>;
  sum?: Maybe<AccountTransactionsSumFields>;
  var_pop?: Maybe<AccountTransactionsVarPopFields>;
  var_samp?: Maybe<AccountTransactionsVarSampFields>;
  variance?: Maybe<AccountTransactionsVarianceFields>;
};

/** aggregate fields of "account_transactions" */
export type AccountTransactionsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<AccountTransactionsSelectColumn>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** aggregate avg on columns */
export type AccountTransactionsAvgFields = {
  transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** Boolean expression to filter rows from the table "account_transactions". All fields are combined with a logical 'AND'. */
export type AccountTransactionsBoolExp = {
  _and?: InputMaybe<Array<AccountTransactionsBoolExp>>;
  _not?: InputMaybe<AccountTransactionsBoolExp>;
  _or?: InputMaybe<Array<AccountTransactionsBoolExp>>;
  account_address?: InputMaybe<StringComparisonExp>;
  coin_activities?: InputMaybe<CoinActivitiesBoolExp>;
  delegated_staking_activities?: InputMaybe<DelegatedStakingActivitiesBoolExp>;
  fungible_asset_activities?: InputMaybe<FungibleAssetActivitiesBoolExp>;
  token_activities?: InputMaybe<TokenActivitiesBoolExp>;
  token_activities_v2?: InputMaybe<TokenActivitiesV2BoolExp>;
  transaction_version?: InputMaybe<BigintComparisonExp>;
};

/** aggregate max on columns */
export type AccountTransactionsMaxFields = {
  account_address?: Maybe<Scalars["String"]["output"]>;
  transaction_version?: Maybe<Scalars["bigint"]["output"]>;
};

/** aggregate min on columns */
export type AccountTransactionsMinFields = {
  account_address?: Maybe<Scalars["String"]["output"]>;
  transaction_version?: Maybe<Scalars["bigint"]["output"]>;
};

/** Ordering options when selecting data from "account_transactions". */
export type AccountTransactionsOrderBy = {
  account_address?: InputMaybe<OrderBy>;
  coin_activities_aggregate?: InputMaybe<CoinActivitiesAggregateOrderBy>;
  delegated_staking_activities_aggregate?: InputMaybe<DelegatedStakingActivitiesAggregateOrderBy>;
  fungible_asset_activities_aggregate?: InputMaybe<FungibleAssetActivitiesAggregateOrderBy>;
  token_activities_aggregate?: InputMaybe<TokenActivitiesAggregateOrderBy>;
  token_activities_v2_aggregate?: InputMaybe<TokenActivitiesV2AggregateOrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
};

/** select columns of table "account_transactions" */
export enum AccountTransactionsSelectColumn {
  /** column name */
  AccountAddress = "account_address",
  /** column name */
  TransactionVersion = "transaction_version",
}

/** aggregate stddev on columns */
export type AccountTransactionsStddevFields = {
  transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_pop on columns */
export type AccountTransactionsStddevPopFields = {
  transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_samp on columns */
export type AccountTransactionsStddevSampFields = {
  transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** Streaming cursor of the table "account_transactions" */
export type AccountTransactionsStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: AccountTransactionsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type AccountTransactionsStreamCursorValueInput = {
  account_address?: InputMaybe<Scalars["String"]["input"]>;
  transaction_version?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** aggregate sum on columns */
export type AccountTransactionsSumFields = {
  transaction_version?: Maybe<Scalars["bigint"]["output"]>;
};

/** aggregate var_pop on columns */
export type AccountTransactionsVarPopFields = {
  transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate var_samp on columns */
export type AccountTransactionsVarSampFields = {
  transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate variance on columns */
export type AccountTransactionsVarianceFields = {
  transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** columns and relationships of "address_events_summary" */
export type AddressEventsSummary = {
  account_address?: Maybe<Scalars["String"]["output"]>;
  /** An object relationship */
  block_metadata?: Maybe<BlockMetadataTransactions>;
  min_block_height?: Maybe<Scalars["bigint"]["output"]>;
  num_distinct_versions?: Maybe<Scalars["bigint"]["output"]>;
};

/** Boolean expression to filter rows from the table "address_events_summary". All fields are combined with a logical 'AND'. */
export type AddressEventsSummaryBoolExp = {
  _and?: InputMaybe<Array<AddressEventsSummaryBoolExp>>;
  _not?: InputMaybe<AddressEventsSummaryBoolExp>;
  _or?: InputMaybe<Array<AddressEventsSummaryBoolExp>>;
  account_address?: InputMaybe<StringComparisonExp>;
  block_metadata?: InputMaybe<BlockMetadataTransactionsBoolExp>;
  min_block_height?: InputMaybe<BigintComparisonExp>;
  num_distinct_versions?: InputMaybe<BigintComparisonExp>;
};

/** Ordering options when selecting data from "address_events_summary". */
export type AddressEventsSummaryOrderBy = {
  account_address?: InputMaybe<OrderBy>;
  block_metadata?: InputMaybe<BlockMetadataTransactionsOrderBy>;
  min_block_height?: InputMaybe<OrderBy>;
  num_distinct_versions?: InputMaybe<OrderBy>;
};

/** select columns of table "address_events_summary" */
export enum AddressEventsSummarySelectColumn {
  /** column name */
  AccountAddress = "account_address",
  /** column name */
  MinBlockHeight = "min_block_height",
  /** column name */
  NumDistinctVersions = "num_distinct_versions",
}

/** Streaming cursor of the table "address_events_summary" */
export type AddressEventsSummaryStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: AddressEventsSummaryStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type AddressEventsSummaryStreamCursorValueInput = {
  account_address?: InputMaybe<Scalars["String"]["input"]>;
  min_block_height?: InputMaybe<Scalars["bigint"]["input"]>;
  num_distinct_versions?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** columns and relationships of "address_version_from_events" */
export type AddressVersionFromEvents = {
  account_address?: Maybe<Scalars["String"]["output"]>;
  /** An array relationship */
  coin_activities: Array<CoinActivities>;
  /** An aggregate relationship */
  coin_activities_aggregate: CoinActivitiesAggregate;
  /** An array relationship */
  delegated_staking_activities: Array<DelegatedStakingActivities>;
  /** An array relationship */
  token_activities: Array<TokenActivities>;
  /** An aggregate relationship */
  token_activities_aggregate: TokenActivitiesAggregate;
  /** An array relationship */
  token_activities_v2: Array<TokenActivitiesV2>;
  /** An aggregate relationship */
  token_activities_v2_aggregate: TokenActivitiesV2Aggregate;
  transaction_version?: Maybe<Scalars["bigint"]["output"]>;
};

/** columns and relationships of "address_version_from_events" */
export type AddressVersionFromEventsCoinActivitiesArgs = {
  distinct_on?: InputMaybe<Array<CoinActivitiesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CoinActivitiesOrderBy>>;
  where?: InputMaybe<CoinActivitiesBoolExp>;
};

/** columns and relationships of "address_version_from_events" */
export type AddressVersionFromEventsCoinActivitiesAggregateArgs = {
  distinct_on?: InputMaybe<Array<CoinActivitiesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CoinActivitiesOrderBy>>;
  where?: InputMaybe<CoinActivitiesBoolExp>;
};

/** columns and relationships of "address_version_from_events" */
export type AddressVersionFromEventsDelegatedStakingActivitiesArgs = {
  distinct_on?: InputMaybe<Array<DelegatedStakingActivitiesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<DelegatedStakingActivitiesOrderBy>>;
  where?: InputMaybe<DelegatedStakingActivitiesBoolExp>;
};

/** columns and relationships of "address_version_from_events" */
export type AddressVersionFromEventsTokenActivitiesArgs = {
  distinct_on?: InputMaybe<Array<TokenActivitiesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<TokenActivitiesOrderBy>>;
  where?: InputMaybe<TokenActivitiesBoolExp>;
};

/** columns and relationships of "address_version_from_events" */
export type AddressVersionFromEventsTokenActivitiesAggregateArgs = {
  distinct_on?: InputMaybe<Array<TokenActivitiesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<TokenActivitiesOrderBy>>;
  where?: InputMaybe<TokenActivitiesBoolExp>;
};

/** columns and relationships of "address_version_from_events" */
export type AddressVersionFromEventsTokenActivitiesV2Args = {
  distinct_on?: InputMaybe<Array<TokenActivitiesV2SelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<TokenActivitiesV2OrderBy>>;
  where?: InputMaybe<TokenActivitiesV2BoolExp>;
};

/** columns and relationships of "address_version_from_events" */
export type AddressVersionFromEventsTokenActivitiesV2AggregateArgs = {
  distinct_on?: InputMaybe<Array<TokenActivitiesV2SelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<TokenActivitiesV2OrderBy>>;
  where?: InputMaybe<TokenActivitiesV2BoolExp>;
};

/** aggregated selection of "address_version_from_events" */
export type AddressVersionFromEventsAggregate = {
  aggregate?: Maybe<AddressVersionFromEventsAggregateFields>;
  nodes: Array<AddressVersionFromEvents>;
};

/** aggregate fields of "address_version_from_events" */
export type AddressVersionFromEventsAggregateFields = {
  avg?: Maybe<AddressVersionFromEventsAvgFields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<AddressVersionFromEventsMaxFields>;
  min?: Maybe<AddressVersionFromEventsMinFields>;
  stddev?: Maybe<AddressVersionFromEventsStddevFields>;
  stddev_pop?: Maybe<AddressVersionFromEventsStddevPopFields>;
  stddev_samp?: Maybe<AddressVersionFromEventsStddevSampFields>;
  sum?: Maybe<AddressVersionFromEventsSumFields>;
  var_pop?: Maybe<AddressVersionFromEventsVarPopFields>;
  var_samp?: Maybe<AddressVersionFromEventsVarSampFields>;
  variance?: Maybe<AddressVersionFromEventsVarianceFields>;
};

/** aggregate fields of "address_version_from_events" */
export type AddressVersionFromEventsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<AddressVersionFromEventsSelectColumn>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** aggregate avg on columns */
export type AddressVersionFromEventsAvgFields = {
  transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** Boolean expression to filter rows from the table "address_version_from_events". All fields are combined with a logical 'AND'. */
export type AddressVersionFromEventsBoolExp = {
  _and?: InputMaybe<Array<AddressVersionFromEventsBoolExp>>;
  _not?: InputMaybe<AddressVersionFromEventsBoolExp>;
  _or?: InputMaybe<Array<AddressVersionFromEventsBoolExp>>;
  account_address?: InputMaybe<StringComparisonExp>;
  coin_activities?: InputMaybe<CoinActivitiesBoolExp>;
  delegated_staking_activities?: InputMaybe<DelegatedStakingActivitiesBoolExp>;
  token_activities?: InputMaybe<TokenActivitiesBoolExp>;
  token_activities_v2?: InputMaybe<TokenActivitiesV2BoolExp>;
  transaction_version?: InputMaybe<BigintComparisonExp>;
};

/** aggregate max on columns */
export type AddressVersionFromEventsMaxFields = {
  account_address?: Maybe<Scalars["String"]["output"]>;
  transaction_version?: Maybe<Scalars["bigint"]["output"]>;
};

/** aggregate min on columns */
export type AddressVersionFromEventsMinFields = {
  account_address?: Maybe<Scalars["String"]["output"]>;
  transaction_version?: Maybe<Scalars["bigint"]["output"]>;
};

/** Ordering options when selecting data from "address_version_from_events". */
export type AddressVersionFromEventsOrderBy = {
  account_address?: InputMaybe<OrderBy>;
  coin_activities_aggregate?: InputMaybe<CoinActivitiesAggregateOrderBy>;
  delegated_staking_activities_aggregate?: InputMaybe<DelegatedStakingActivitiesAggregateOrderBy>;
  token_activities_aggregate?: InputMaybe<TokenActivitiesAggregateOrderBy>;
  token_activities_v2_aggregate?: InputMaybe<TokenActivitiesV2AggregateOrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
};

/** select columns of table "address_version_from_events" */
export enum AddressVersionFromEventsSelectColumn {
  /** column name */
  AccountAddress = "account_address",
  /** column name */
  TransactionVersion = "transaction_version",
}

/** aggregate stddev on columns */
export type AddressVersionFromEventsStddevFields = {
  transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_pop on columns */
export type AddressVersionFromEventsStddevPopFields = {
  transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_samp on columns */
export type AddressVersionFromEventsStddevSampFields = {
  transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** Streaming cursor of the table "address_version_from_events" */
export type AddressVersionFromEventsStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: AddressVersionFromEventsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type AddressVersionFromEventsStreamCursorValueInput = {
  account_address?: InputMaybe<Scalars["String"]["input"]>;
  transaction_version?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** aggregate sum on columns */
export type AddressVersionFromEventsSumFields = {
  transaction_version?: Maybe<Scalars["bigint"]["output"]>;
};

/** aggregate var_pop on columns */
export type AddressVersionFromEventsVarPopFields = {
  transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate var_samp on columns */
export type AddressVersionFromEventsVarSampFields = {
  transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate variance on columns */
export type AddressVersionFromEventsVarianceFields = {
  transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** columns and relationships of "address_version_from_move_resources" */
export type AddressVersionFromMoveResources = {
  address?: Maybe<Scalars["String"]["output"]>;
  /** An array relationship */
  coin_activities: Array<CoinActivities>;
  /** An aggregate relationship */
  coin_activities_aggregate: CoinActivitiesAggregate;
  /** An array relationship */
  delegated_staking_activities: Array<DelegatedStakingActivities>;
  /** An array relationship */
  token_activities: Array<TokenActivities>;
  /** An aggregate relationship */
  token_activities_aggregate: TokenActivitiesAggregate;
  /** An array relationship */
  token_activities_v2: Array<TokenActivitiesV2>;
  /** An aggregate relationship */
  token_activities_v2_aggregate: TokenActivitiesV2Aggregate;
  transaction_version?: Maybe<Scalars["bigint"]["output"]>;
};

/** columns and relationships of "address_version_from_move_resources" */
export type AddressVersionFromMoveResourcesCoinActivitiesArgs = {
  distinct_on?: InputMaybe<Array<CoinActivitiesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CoinActivitiesOrderBy>>;
  where?: InputMaybe<CoinActivitiesBoolExp>;
};

/** columns and relationships of "address_version_from_move_resources" */
export type AddressVersionFromMoveResourcesCoinActivitiesAggregateArgs = {
  distinct_on?: InputMaybe<Array<CoinActivitiesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CoinActivitiesOrderBy>>;
  where?: InputMaybe<CoinActivitiesBoolExp>;
};

/** columns and relationships of "address_version_from_move_resources" */
export type AddressVersionFromMoveResourcesDelegatedStakingActivitiesArgs = {
  distinct_on?: InputMaybe<Array<DelegatedStakingActivitiesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<DelegatedStakingActivitiesOrderBy>>;
  where?: InputMaybe<DelegatedStakingActivitiesBoolExp>;
};

/** columns and relationships of "address_version_from_move_resources" */
export type AddressVersionFromMoveResourcesTokenActivitiesArgs = {
  distinct_on?: InputMaybe<Array<TokenActivitiesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<TokenActivitiesOrderBy>>;
  where?: InputMaybe<TokenActivitiesBoolExp>;
};

/** columns and relationships of "address_version_from_move_resources" */
export type AddressVersionFromMoveResourcesTokenActivitiesAggregateArgs = {
  distinct_on?: InputMaybe<Array<TokenActivitiesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<TokenActivitiesOrderBy>>;
  where?: InputMaybe<TokenActivitiesBoolExp>;
};

/** columns and relationships of "address_version_from_move_resources" */
export type AddressVersionFromMoveResourcesTokenActivitiesV2Args = {
  distinct_on?: InputMaybe<Array<TokenActivitiesV2SelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<TokenActivitiesV2OrderBy>>;
  where?: InputMaybe<TokenActivitiesV2BoolExp>;
};

/** columns and relationships of "address_version_from_move_resources" */
export type AddressVersionFromMoveResourcesTokenActivitiesV2AggregateArgs = {
  distinct_on?: InputMaybe<Array<TokenActivitiesV2SelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<TokenActivitiesV2OrderBy>>;
  where?: InputMaybe<TokenActivitiesV2BoolExp>;
};

/** aggregated selection of "address_version_from_move_resources" */
export type AddressVersionFromMoveResourcesAggregate = {
  aggregate?: Maybe<AddressVersionFromMoveResourcesAggregateFields>;
  nodes: Array<AddressVersionFromMoveResources>;
};

/** aggregate fields of "address_version_from_move_resources" */
export type AddressVersionFromMoveResourcesAggregateFields = {
  avg?: Maybe<AddressVersionFromMoveResourcesAvgFields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<AddressVersionFromMoveResourcesMaxFields>;
  min?: Maybe<AddressVersionFromMoveResourcesMinFields>;
  stddev?: Maybe<AddressVersionFromMoveResourcesStddevFields>;
  stddev_pop?: Maybe<AddressVersionFromMoveResourcesStddevPopFields>;
  stddev_samp?: Maybe<AddressVersionFromMoveResourcesStddevSampFields>;
  sum?: Maybe<AddressVersionFromMoveResourcesSumFields>;
  var_pop?: Maybe<AddressVersionFromMoveResourcesVarPopFields>;
  var_samp?: Maybe<AddressVersionFromMoveResourcesVarSampFields>;
  variance?: Maybe<AddressVersionFromMoveResourcesVarianceFields>;
};

/** aggregate fields of "address_version_from_move_resources" */
export type AddressVersionFromMoveResourcesAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<AddressVersionFromMoveResourcesSelectColumn>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** aggregate avg on columns */
export type AddressVersionFromMoveResourcesAvgFields = {
  transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** Boolean expression to filter rows from the table "address_version_from_move_resources". All fields are combined with a logical 'AND'. */
export type AddressVersionFromMoveResourcesBoolExp = {
  _and?: InputMaybe<Array<AddressVersionFromMoveResourcesBoolExp>>;
  _not?: InputMaybe<AddressVersionFromMoveResourcesBoolExp>;
  _or?: InputMaybe<Array<AddressVersionFromMoveResourcesBoolExp>>;
  address?: InputMaybe<StringComparisonExp>;
  coin_activities?: InputMaybe<CoinActivitiesBoolExp>;
  delegated_staking_activities?: InputMaybe<DelegatedStakingActivitiesBoolExp>;
  token_activities?: InputMaybe<TokenActivitiesBoolExp>;
  token_activities_v2?: InputMaybe<TokenActivitiesV2BoolExp>;
  transaction_version?: InputMaybe<BigintComparisonExp>;
};

/** aggregate max on columns */
export type AddressVersionFromMoveResourcesMaxFields = {
  address?: Maybe<Scalars["String"]["output"]>;
  transaction_version?: Maybe<Scalars["bigint"]["output"]>;
};

/** aggregate min on columns */
export type AddressVersionFromMoveResourcesMinFields = {
  address?: Maybe<Scalars["String"]["output"]>;
  transaction_version?: Maybe<Scalars["bigint"]["output"]>;
};

/** Ordering options when selecting data from "address_version_from_move_resources". */
export type AddressVersionFromMoveResourcesOrderBy = {
  address?: InputMaybe<OrderBy>;
  coin_activities_aggregate?: InputMaybe<CoinActivitiesAggregateOrderBy>;
  delegated_staking_activities_aggregate?: InputMaybe<DelegatedStakingActivitiesAggregateOrderBy>;
  token_activities_aggregate?: InputMaybe<TokenActivitiesAggregateOrderBy>;
  token_activities_v2_aggregate?: InputMaybe<TokenActivitiesV2AggregateOrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
};

/** select columns of table "address_version_from_move_resources" */
export enum AddressVersionFromMoveResourcesSelectColumn {
  /** column name */
  Address = "address",
  /** column name */
  TransactionVersion = "transaction_version",
}

/** aggregate stddev on columns */
export type AddressVersionFromMoveResourcesStddevFields = {
  transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_pop on columns */
export type AddressVersionFromMoveResourcesStddevPopFields = {
  transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_samp on columns */
export type AddressVersionFromMoveResourcesStddevSampFields = {
  transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** Streaming cursor of the table "address_version_from_move_resources" */
export type AddressVersionFromMoveResourcesStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: AddressVersionFromMoveResourcesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type AddressVersionFromMoveResourcesStreamCursorValueInput = {
  address?: InputMaybe<Scalars["String"]["input"]>;
  transaction_version?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** aggregate sum on columns */
export type AddressVersionFromMoveResourcesSumFields = {
  transaction_version?: Maybe<Scalars["bigint"]["output"]>;
};

/** aggregate var_pop on columns */
export type AddressVersionFromMoveResourcesVarPopFields = {
  transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate var_samp on columns */
export type AddressVersionFromMoveResourcesVarSampFields = {
  transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate variance on columns */
export type AddressVersionFromMoveResourcesVarianceFields = {
  transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** Boolean expression to compare columns of type "bigint". All fields are combined with logical 'AND'. */
export type BigintComparisonExp = {
  _eq?: InputMaybe<Scalars["bigint"]["input"]>;
  _gt?: InputMaybe<Scalars["bigint"]["input"]>;
  _gte?: InputMaybe<Scalars["bigint"]["input"]>;
  _in?: InputMaybe<Array<Scalars["bigint"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["bigint"]["input"]>;
  _lte?: InputMaybe<Scalars["bigint"]["input"]>;
  _neq?: InputMaybe<Scalars["bigint"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["bigint"]["input"]>>;
};

/** columns and relationships of "block_metadata_transactions" */
export type BlockMetadataTransactions = {
  block_height: Scalars["bigint"]["output"];
  epoch: Scalars["bigint"]["output"];
  failed_proposer_indices: Scalars["jsonb"]["output"];
  id: Scalars["String"]["output"];
  previous_block_votes_bitvec: Scalars["jsonb"]["output"];
  proposer: Scalars["String"]["output"];
  round: Scalars["bigint"]["output"];
  timestamp: Scalars["timestamp"]["output"];
  version: Scalars["bigint"]["output"];
};

/** columns and relationships of "block_metadata_transactions" */
export type BlockMetadataTransactionsFailedProposerIndicesArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "block_metadata_transactions" */
export type BlockMetadataTransactionsPreviousBlockVotesBitvecArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** Boolean expression to filter rows from the table "block_metadata_transactions". All fields are combined with a logical 'AND'. */
export type BlockMetadataTransactionsBoolExp = {
  _and?: InputMaybe<Array<BlockMetadataTransactionsBoolExp>>;
  _not?: InputMaybe<BlockMetadataTransactionsBoolExp>;
  _or?: InputMaybe<Array<BlockMetadataTransactionsBoolExp>>;
  block_height?: InputMaybe<BigintComparisonExp>;
  epoch?: InputMaybe<BigintComparisonExp>;
  failed_proposer_indices?: InputMaybe<JsonbComparisonExp>;
  id?: InputMaybe<StringComparisonExp>;
  previous_block_votes_bitvec?: InputMaybe<JsonbComparisonExp>;
  proposer?: InputMaybe<StringComparisonExp>;
  round?: InputMaybe<BigintComparisonExp>;
  timestamp?: InputMaybe<TimestampComparisonExp>;
  version?: InputMaybe<BigintComparisonExp>;
};

/** Ordering options when selecting data from "block_metadata_transactions". */
export type BlockMetadataTransactionsOrderBy = {
  block_height?: InputMaybe<OrderBy>;
  epoch?: InputMaybe<OrderBy>;
  failed_proposer_indices?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  previous_block_votes_bitvec?: InputMaybe<OrderBy>;
  proposer?: InputMaybe<OrderBy>;
  round?: InputMaybe<OrderBy>;
  timestamp?: InputMaybe<OrderBy>;
  version?: InputMaybe<OrderBy>;
};

/** select columns of table "block_metadata_transactions" */
export enum BlockMetadataTransactionsSelectColumn {
  /** column name */
  BlockHeight = "block_height",
  /** column name */
  Epoch = "epoch",
  /** column name */
  FailedProposerIndices = "failed_proposer_indices",
  /** column name */
  Id = "id",
  /** column name */
  PreviousBlockVotesBitvec = "previous_block_votes_bitvec",
  /** column name */
  Proposer = "proposer",
  /** column name */
  Round = "round",
  /** column name */
  Timestamp = "timestamp",
  /** column name */
  Version = "version",
}

/** Streaming cursor of the table "block_metadata_transactions" */
export type BlockMetadataTransactionsStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: BlockMetadataTransactionsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type BlockMetadataTransactionsStreamCursorValueInput = {
  block_height?: InputMaybe<Scalars["bigint"]["input"]>;
  epoch?: InputMaybe<Scalars["bigint"]["input"]>;
  failed_proposer_indices?: InputMaybe<Scalars["jsonb"]["input"]>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  previous_block_votes_bitvec?: InputMaybe<Scalars["jsonb"]["input"]>;
  proposer?: InputMaybe<Scalars["String"]["input"]>;
  round?: InputMaybe<Scalars["bigint"]["input"]>;
  timestamp?: InputMaybe<Scalars["timestamp"]["input"]>;
  version?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** columns and relationships of "coin_activities" */
export type CoinActivities = {
  activity_type: Scalars["String"]["output"];
  amount: Scalars["numeric"]["output"];
  /** An array relationship */
  aptos_names: Array<CurrentAptosNames>;
  /** An aggregate relationship */
  aptos_names_aggregate: CurrentAptosNamesAggregate;
  block_height: Scalars["bigint"]["output"];
  /** An object relationship */
  coin_info?: Maybe<CoinInfos>;
  coin_type: Scalars["String"]["output"];
  entry_function_id_str?: Maybe<Scalars["String"]["output"]>;
  event_account_address: Scalars["String"]["output"];
  event_creation_number: Scalars["bigint"]["output"];
  event_index?: Maybe<Scalars["bigint"]["output"]>;
  event_sequence_number: Scalars["bigint"]["output"];
  is_gas_fee: Scalars["Boolean"]["output"];
  is_transaction_success: Scalars["Boolean"]["output"];
  owner_address: Scalars["String"]["output"];
  storage_refund_amount: Scalars["numeric"]["output"];
  transaction_timestamp: Scalars["timestamp"]["output"];
  transaction_version: Scalars["bigint"]["output"];
};

/** columns and relationships of "coin_activities" */
export type CoinActivitiesAptosNamesArgs = {
  distinct_on?: InputMaybe<Array<CurrentAptosNamesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentAptosNamesOrderBy>>;
  where?: InputMaybe<CurrentAptosNamesBoolExp>;
};

/** columns and relationships of "coin_activities" */
export type CoinActivitiesAptosNamesAggregateArgs = {
  distinct_on?: InputMaybe<Array<CurrentAptosNamesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentAptosNamesOrderBy>>;
  where?: InputMaybe<CurrentAptosNamesBoolExp>;
};

/** aggregated selection of "coin_activities" */
export type CoinActivitiesAggregate = {
  aggregate?: Maybe<CoinActivitiesAggregateFields>;
  nodes: Array<CoinActivities>;
};

/** aggregate fields of "coin_activities" */
export type CoinActivitiesAggregateFields = {
  avg?: Maybe<CoinActivitiesAvgFields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<CoinActivitiesMaxFields>;
  min?: Maybe<CoinActivitiesMinFields>;
  stddev?: Maybe<CoinActivitiesStddevFields>;
  stddev_pop?: Maybe<CoinActivitiesStddevPopFields>;
  stddev_samp?: Maybe<CoinActivitiesStddevSampFields>;
  sum?: Maybe<CoinActivitiesSumFields>;
  var_pop?: Maybe<CoinActivitiesVarPopFields>;
  var_samp?: Maybe<CoinActivitiesVarSampFields>;
  variance?: Maybe<CoinActivitiesVarianceFields>;
};

/** aggregate fields of "coin_activities" */
export type CoinActivitiesAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<CoinActivitiesSelectColumn>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "coin_activities" */
export type CoinActivitiesAggregateOrderBy = {
  avg?: InputMaybe<CoinActivitiesAvgOrderBy>;
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<CoinActivitiesMaxOrderBy>;
  min?: InputMaybe<CoinActivitiesMinOrderBy>;
  stddev?: InputMaybe<CoinActivitiesStddevOrderBy>;
  stddev_pop?: InputMaybe<CoinActivitiesStddevPopOrderBy>;
  stddev_samp?: InputMaybe<CoinActivitiesStddevSampOrderBy>;
  sum?: InputMaybe<CoinActivitiesSumOrderBy>;
  var_pop?: InputMaybe<CoinActivitiesVarPopOrderBy>;
  var_samp?: InputMaybe<CoinActivitiesVarSampOrderBy>;
  variance?: InputMaybe<CoinActivitiesVarianceOrderBy>;
};

/** aggregate avg on columns */
export type CoinActivitiesAvgFields = {
  amount?: Maybe<Scalars["Float"]["output"]>;
  block_height?: Maybe<Scalars["Float"]["output"]>;
  event_creation_number?: Maybe<Scalars["Float"]["output"]>;
  event_index?: Maybe<Scalars["Float"]["output"]>;
  event_sequence_number?: Maybe<Scalars["Float"]["output"]>;
  storage_refund_amount?: Maybe<Scalars["Float"]["output"]>;
  transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** order by avg() on columns of table "coin_activities" */
export type CoinActivitiesAvgOrderBy = {
  amount?: InputMaybe<OrderBy>;
  block_height?: InputMaybe<OrderBy>;
  event_creation_number?: InputMaybe<OrderBy>;
  event_index?: InputMaybe<OrderBy>;
  event_sequence_number?: InputMaybe<OrderBy>;
  storage_refund_amount?: InputMaybe<OrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "coin_activities". All fields are combined with a logical 'AND'. */
export type CoinActivitiesBoolExp = {
  _and?: InputMaybe<Array<CoinActivitiesBoolExp>>;
  _not?: InputMaybe<CoinActivitiesBoolExp>;
  _or?: InputMaybe<Array<CoinActivitiesBoolExp>>;
  activity_type?: InputMaybe<StringComparisonExp>;
  amount?: InputMaybe<NumericComparisonExp>;
  aptos_names?: InputMaybe<CurrentAptosNamesBoolExp>;
  block_height?: InputMaybe<BigintComparisonExp>;
  coin_info?: InputMaybe<CoinInfosBoolExp>;
  coin_type?: InputMaybe<StringComparisonExp>;
  entry_function_id_str?: InputMaybe<StringComparisonExp>;
  event_account_address?: InputMaybe<StringComparisonExp>;
  event_creation_number?: InputMaybe<BigintComparisonExp>;
  event_index?: InputMaybe<BigintComparisonExp>;
  event_sequence_number?: InputMaybe<BigintComparisonExp>;
  is_gas_fee?: InputMaybe<BooleanComparisonExp>;
  is_transaction_success?: InputMaybe<BooleanComparisonExp>;
  owner_address?: InputMaybe<StringComparisonExp>;
  storage_refund_amount?: InputMaybe<NumericComparisonExp>;
  transaction_timestamp?: InputMaybe<TimestampComparisonExp>;
  transaction_version?: InputMaybe<BigintComparisonExp>;
};

/** aggregate max on columns */
export type CoinActivitiesMaxFields = {
  activity_type?: Maybe<Scalars["String"]["output"]>;
  amount?: Maybe<Scalars["numeric"]["output"]>;
  block_height?: Maybe<Scalars["bigint"]["output"]>;
  coin_type?: Maybe<Scalars["String"]["output"]>;
  entry_function_id_str?: Maybe<Scalars["String"]["output"]>;
  event_account_address?: Maybe<Scalars["String"]["output"]>;
  event_creation_number?: Maybe<Scalars["bigint"]["output"]>;
  event_index?: Maybe<Scalars["bigint"]["output"]>;
  event_sequence_number?: Maybe<Scalars["bigint"]["output"]>;
  owner_address?: Maybe<Scalars["String"]["output"]>;
  storage_refund_amount?: Maybe<Scalars["numeric"]["output"]>;
  transaction_timestamp?: Maybe<Scalars["timestamp"]["output"]>;
  transaction_version?: Maybe<Scalars["bigint"]["output"]>;
};

/** order by max() on columns of table "coin_activities" */
export type CoinActivitiesMaxOrderBy = {
  activity_type?: InputMaybe<OrderBy>;
  amount?: InputMaybe<OrderBy>;
  block_height?: InputMaybe<OrderBy>;
  coin_type?: InputMaybe<OrderBy>;
  entry_function_id_str?: InputMaybe<OrderBy>;
  event_account_address?: InputMaybe<OrderBy>;
  event_creation_number?: InputMaybe<OrderBy>;
  event_index?: InputMaybe<OrderBy>;
  event_sequence_number?: InputMaybe<OrderBy>;
  owner_address?: InputMaybe<OrderBy>;
  storage_refund_amount?: InputMaybe<OrderBy>;
  transaction_timestamp?: InputMaybe<OrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type CoinActivitiesMinFields = {
  activity_type?: Maybe<Scalars["String"]["output"]>;
  amount?: Maybe<Scalars["numeric"]["output"]>;
  block_height?: Maybe<Scalars["bigint"]["output"]>;
  coin_type?: Maybe<Scalars["String"]["output"]>;
  entry_function_id_str?: Maybe<Scalars["String"]["output"]>;
  event_account_address?: Maybe<Scalars["String"]["output"]>;
  event_creation_number?: Maybe<Scalars["bigint"]["output"]>;
  event_index?: Maybe<Scalars["bigint"]["output"]>;
  event_sequence_number?: Maybe<Scalars["bigint"]["output"]>;
  owner_address?: Maybe<Scalars["String"]["output"]>;
  storage_refund_amount?: Maybe<Scalars["numeric"]["output"]>;
  transaction_timestamp?: Maybe<Scalars["timestamp"]["output"]>;
  transaction_version?: Maybe<Scalars["bigint"]["output"]>;
};

/** order by min() on columns of table "coin_activities" */
export type CoinActivitiesMinOrderBy = {
  activity_type?: InputMaybe<OrderBy>;
  amount?: InputMaybe<OrderBy>;
  block_height?: InputMaybe<OrderBy>;
  coin_type?: InputMaybe<OrderBy>;
  entry_function_id_str?: InputMaybe<OrderBy>;
  event_account_address?: InputMaybe<OrderBy>;
  event_creation_number?: InputMaybe<OrderBy>;
  event_index?: InputMaybe<OrderBy>;
  event_sequence_number?: InputMaybe<OrderBy>;
  owner_address?: InputMaybe<OrderBy>;
  storage_refund_amount?: InputMaybe<OrderBy>;
  transaction_timestamp?: InputMaybe<OrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
};

/** Ordering options when selecting data from "coin_activities". */
export type CoinActivitiesOrderBy = {
  activity_type?: InputMaybe<OrderBy>;
  amount?: InputMaybe<OrderBy>;
  aptos_names_aggregate?: InputMaybe<CurrentAptosNamesAggregateOrderBy>;
  block_height?: InputMaybe<OrderBy>;
  coin_info?: InputMaybe<CoinInfosOrderBy>;
  coin_type?: InputMaybe<OrderBy>;
  entry_function_id_str?: InputMaybe<OrderBy>;
  event_account_address?: InputMaybe<OrderBy>;
  event_creation_number?: InputMaybe<OrderBy>;
  event_index?: InputMaybe<OrderBy>;
  event_sequence_number?: InputMaybe<OrderBy>;
  is_gas_fee?: InputMaybe<OrderBy>;
  is_transaction_success?: InputMaybe<OrderBy>;
  owner_address?: InputMaybe<OrderBy>;
  storage_refund_amount?: InputMaybe<OrderBy>;
  transaction_timestamp?: InputMaybe<OrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
};

/** select columns of table "coin_activities" */
export enum CoinActivitiesSelectColumn {
  /** column name */
  ActivityType = "activity_type",
  /** column name */
  Amount = "amount",
  /** column name */
  BlockHeight = "block_height",
  /** column name */
  CoinType = "coin_type",
  /** column name */
  EntryFunctionIdStr = "entry_function_id_str",
  /** column name */
  EventAccountAddress = "event_account_address",
  /** column name */
  EventCreationNumber = "event_creation_number",
  /** column name */
  EventIndex = "event_index",
  /** column name */
  EventSequenceNumber = "event_sequence_number",
  /** column name */
  IsGasFee = "is_gas_fee",
  /** column name */
  IsTransactionSuccess = "is_transaction_success",
  /** column name */
  OwnerAddress = "owner_address",
  /** column name */
  StorageRefundAmount = "storage_refund_amount",
  /** column name */
  TransactionTimestamp = "transaction_timestamp",
  /** column name */
  TransactionVersion = "transaction_version",
}

/** aggregate stddev on columns */
export type CoinActivitiesStddevFields = {
  amount?: Maybe<Scalars["Float"]["output"]>;
  block_height?: Maybe<Scalars["Float"]["output"]>;
  event_creation_number?: Maybe<Scalars["Float"]["output"]>;
  event_index?: Maybe<Scalars["Float"]["output"]>;
  event_sequence_number?: Maybe<Scalars["Float"]["output"]>;
  storage_refund_amount?: Maybe<Scalars["Float"]["output"]>;
  transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev() on columns of table "coin_activities" */
export type CoinActivitiesStddevOrderBy = {
  amount?: InputMaybe<OrderBy>;
  block_height?: InputMaybe<OrderBy>;
  event_creation_number?: InputMaybe<OrderBy>;
  event_index?: InputMaybe<OrderBy>;
  event_sequence_number?: InputMaybe<OrderBy>;
  storage_refund_amount?: InputMaybe<OrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
};

/** aggregate stddev_pop on columns */
export type CoinActivitiesStddevPopFields = {
  amount?: Maybe<Scalars["Float"]["output"]>;
  block_height?: Maybe<Scalars["Float"]["output"]>;
  event_creation_number?: Maybe<Scalars["Float"]["output"]>;
  event_index?: Maybe<Scalars["Float"]["output"]>;
  event_sequence_number?: Maybe<Scalars["Float"]["output"]>;
  storage_refund_amount?: Maybe<Scalars["Float"]["output"]>;
  transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_pop() on columns of table "coin_activities" */
export type CoinActivitiesStddevPopOrderBy = {
  amount?: InputMaybe<OrderBy>;
  block_height?: InputMaybe<OrderBy>;
  event_creation_number?: InputMaybe<OrderBy>;
  event_index?: InputMaybe<OrderBy>;
  event_sequence_number?: InputMaybe<OrderBy>;
  storage_refund_amount?: InputMaybe<OrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
};

/** aggregate stddev_samp on columns */
export type CoinActivitiesStddevSampFields = {
  amount?: Maybe<Scalars["Float"]["output"]>;
  block_height?: Maybe<Scalars["Float"]["output"]>;
  event_creation_number?: Maybe<Scalars["Float"]["output"]>;
  event_index?: Maybe<Scalars["Float"]["output"]>;
  event_sequence_number?: Maybe<Scalars["Float"]["output"]>;
  storage_refund_amount?: Maybe<Scalars["Float"]["output"]>;
  transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_samp() on columns of table "coin_activities" */
export type CoinActivitiesStddevSampOrderBy = {
  amount?: InputMaybe<OrderBy>;
  block_height?: InputMaybe<OrderBy>;
  event_creation_number?: InputMaybe<OrderBy>;
  event_index?: InputMaybe<OrderBy>;
  event_sequence_number?: InputMaybe<OrderBy>;
  storage_refund_amount?: InputMaybe<OrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
};

/** Streaming cursor of the table "coin_activities" */
export type CoinActivitiesStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: CoinActivitiesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type CoinActivitiesStreamCursorValueInput = {
  activity_type?: InputMaybe<Scalars["String"]["input"]>;
  amount?: InputMaybe<Scalars["numeric"]["input"]>;
  block_height?: InputMaybe<Scalars["bigint"]["input"]>;
  coin_type?: InputMaybe<Scalars["String"]["input"]>;
  entry_function_id_str?: InputMaybe<Scalars["String"]["input"]>;
  event_account_address?: InputMaybe<Scalars["String"]["input"]>;
  event_creation_number?: InputMaybe<Scalars["bigint"]["input"]>;
  event_index?: InputMaybe<Scalars["bigint"]["input"]>;
  event_sequence_number?: InputMaybe<Scalars["bigint"]["input"]>;
  is_gas_fee?: InputMaybe<Scalars["Boolean"]["input"]>;
  is_transaction_success?: InputMaybe<Scalars["Boolean"]["input"]>;
  owner_address?: InputMaybe<Scalars["String"]["input"]>;
  storage_refund_amount?: InputMaybe<Scalars["numeric"]["input"]>;
  transaction_timestamp?: InputMaybe<Scalars["timestamp"]["input"]>;
  transaction_version?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** aggregate sum on columns */
export type CoinActivitiesSumFields = {
  amount?: Maybe<Scalars["numeric"]["output"]>;
  block_height?: Maybe<Scalars["bigint"]["output"]>;
  event_creation_number?: Maybe<Scalars["bigint"]["output"]>;
  event_index?: Maybe<Scalars["bigint"]["output"]>;
  event_sequence_number?: Maybe<Scalars["bigint"]["output"]>;
  storage_refund_amount?: Maybe<Scalars["numeric"]["output"]>;
  transaction_version?: Maybe<Scalars["bigint"]["output"]>;
};

/** order by sum() on columns of table "coin_activities" */
export type CoinActivitiesSumOrderBy = {
  amount?: InputMaybe<OrderBy>;
  block_height?: InputMaybe<OrderBy>;
  event_creation_number?: InputMaybe<OrderBy>;
  event_index?: InputMaybe<OrderBy>;
  event_sequence_number?: InputMaybe<OrderBy>;
  storage_refund_amount?: InputMaybe<OrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
};

/** aggregate var_pop on columns */
export type CoinActivitiesVarPopFields = {
  amount?: Maybe<Scalars["Float"]["output"]>;
  block_height?: Maybe<Scalars["Float"]["output"]>;
  event_creation_number?: Maybe<Scalars["Float"]["output"]>;
  event_index?: Maybe<Scalars["Float"]["output"]>;
  event_sequence_number?: Maybe<Scalars["Float"]["output"]>;
  storage_refund_amount?: Maybe<Scalars["Float"]["output"]>;
  transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_pop() on columns of table "coin_activities" */
export type CoinActivitiesVarPopOrderBy = {
  amount?: InputMaybe<OrderBy>;
  block_height?: InputMaybe<OrderBy>;
  event_creation_number?: InputMaybe<OrderBy>;
  event_index?: InputMaybe<OrderBy>;
  event_sequence_number?: InputMaybe<OrderBy>;
  storage_refund_amount?: InputMaybe<OrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
};

/** aggregate var_samp on columns */
export type CoinActivitiesVarSampFields = {
  amount?: Maybe<Scalars["Float"]["output"]>;
  block_height?: Maybe<Scalars["Float"]["output"]>;
  event_creation_number?: Maybe<Scalars["Float"]["output"]>;
  event_index?: Maybe<Scalars["Float"]["output"]>;
  event_sequence_number?: Maybe<Scalars["Float"]["output"]>;
  storage_refund_amount?: Maybe<Scalars["Float"]["output"]>;
  transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_samp() on columns of table "coin_activities" */
export type CoinActivitiesVarSampOrderBy = {
  amount?: InputMaybe<OrderBy>;
  block_height?: InputMaybe<OrderBy>;
  event_creation_number?: InputMaybe<OrderBy>;
  event_index?: InputMaybe<OrderBy>;
  event_sequence_number?: InputMaybe<OrderBy>;
  storage_refund_amount?: InputMaybe<OrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
};

/** aggregate variance on columns */
export type CoinActivitiesVarianceFields = {
  amount?: Maybe<Scalars["Float"]["output"]>;
  block_height?: Maybe<Scalars["Float"]["output"]>;
  event_creation_number?: Maybe<Scalars["Float"]["output"]>;
  event_index?: Maybe<Scalars["Float"]["output"]>;
  event_sequence_number?: Maybe<Scalars["Float"]["output"]>;
  storage_refund_amount?: Maybe<Scalars["Float"]["output"]>;
  transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** order by variance() on columns of table "coin_activities" */
export type CoinActivitiesVarianceOrderBy = {
  amount?: InputMaybe<OrderBy>;
  block_height?: InputMaybe<OrderBy>;
  event_creation_number?: InputMaybe<OrderBy>;
  event_index?: InputMaybe<OrderBy>;
  event_sequence_number?: InputMaybe<OrderBy>;
  storage_refund_amount?: InputMaybe<OrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
};

/** columns and relationships of "coin_balances" */
export type CoinBalances = {
  amount: Scalars["numeric"]["output"];
  coin_type: Scalars["String"]["output"];
  coin_type_hash: Scalars["String"]["output"];
  owner_address: Scalars["String"]["output"];
  transaction_timestamp: Scalars["timestamp"]["output"];
  transaction_version: Scalars["bigint"]["output"];
};

/** Boolean expression to filter rows from the table "coin_balances". All fields are combined with a logical 'AND'. */
export type CoinBalancesBoolExp = {
  _and?: InputMaybe<Array<CoinBalancesBoolExp>>;
  _not?: InputMaybe<CoinBalancesBoolExp>;
  _or?: InputMaybe<Array<CoinBalancesBoolExp>>;
  amount?: InputMaybe<NumericComparisonExp>;
  coin_type?: InputMaybe<StringComparisonExp>;
  coin_type_hash?: InputMaybe<StringComparisonExp>;
  owner_address?: InputMaybe<StringComparisonExp>;
  transaction_timestamp?: InputMaybe<TimestampComparisonExp>;
  transaction_version?: InputMaybe<BigintComparisonExp>;
};

/** Ordering options when selecting data from "coin_balances". */
export type CoinBalancesOrderBy = {
  amount?: InputMaybe<OrderBy>;
  coin_type?: InputMaybe<OrderBy>;
  coin_type_hash?: InputMaybe<OrderBy>;
  owner_address?: InputMaybe<OrderBy>;
  transaction_timestamp?: InputMaybe<OrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
};

/** select columns of table "coin_balances" */
export enum CoinBalancesSelectColumn {
  /** column name */
  Amount = "amount",
  /** column name */
  CoinType = "coin_type",
  /** column name */
  CoinTypeHash = "coin_type_hash",
  /** column name */
  OwnerAddress = "owner_address",
  /** column name */
  TransactionTimestamp = "transaction_timestamp",
  /** column name */
  TransactionVersion = "transaction_version",
}

/** Streaming cursor of the table "coin_balances" */
export type CoinBalancesStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: CoinBalancesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type CoinBalancesStreamCursorValueInput = {
  amount?: InputMaybe<Scalars["numeric"]["input"]>;
  coin_type?: InputMaybe<Scalars["String"]["input"]>;
  coin_type_hash?: InputMaybe<Scalars["String"]["input"]>;
  owner_address?: InputMaybe<Scalars["String"]["input"]>;
  transaction_timestamp?: InputMaybe<Scalars["timestamp"]["input"]>;
  transaction_version?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** columns and relationships of "coin_infos" */
export type CoinInfos = {
  coin_type: Scalars["String"]["output"];
  coin_type_hash: Scalars["String"]["output"];
  creator_address: Scalars["String"]["output"];
  decimals: Scalars["Int"]["output"];
  name: Scalars["String"]["output"];
  supply_aggregator_table_handle?: Maybe<Scalars["String"]["output"]>;
  supply_aggregator_table_key?: Maybe<Scalars["String"]["output"]>;
  symbol: Scalars["String"]["output"];
  transaction_created_timestamp: Scalars["timestamp"]["output"];
  transaction_version_created: Scalars["bigint"]["output"];
};

/** Boolean expression to filter rows from the table "coin_infos". All fields are combined with a logical 'AND'. */
export type CoinInfosBoolExp = {
  _and?: InputMaybe<Array<CoinInfosBoolExp>>;
  _not?: InputMaybe<CoinInfosBoolExp>;
  _or?: InputMaybe<Array<CoinInfosBoolExp>>;
  coin_type?: InputMaybe<StringComparisonExp>;
  coin_type_hash?: InputMaybe<StringComparisonExp>;
  creator_address?: InputMaybe<StringComparisonExp>;
  decimals?: InputMaybe<IntComparisonExp>;
  name?: InputMaybe<StringComparisonExp>;
  supply_aggregator_table_handle?: InputMaybe<StringComparisonExp>;
  supply_aggregator_table_key?: InputMaybe<StringComparisonExp>;
  symbol?: InputMaybe<StringComparisonExp>;
  transaction_created_timestamp?: InputMaybe<TimestampComparisonExp>;
  transaction_version_created?: InputMaybe<BigintComparisonExp>;
};

/** Ordering options when selecting data from "coin_infos". */
export type CoinInfosOrderBy = {
  coin_type?: InputMaybe<OrderBy>;
  coin_type_hash?: InputMaybe<OrderBy>;
  creator_address?: InputMaybe<OrderBy>;
  decimals?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  supply_aggregator_table_handle?: InputMaybe<OrderBy>;
  supply_aggregator_table_key?: InputMaybe<OrderBy>;
  symbol?: InputMaybe<OrderBy>;
  transaction_created_timestamp?: InputMaybe<OrderBy>;
  transaction_version_created?: InputMaybe<OrderBy>;
};

/** select columns of table "coin_infos" */
export enum CoinInfosSelectColumn {
  /** column name */
  CoinType = "coin_type",
  /** column name */
  CoinTypeHash = "coin_type_hash",
  /** column name */
  CreatorAddress = "creator_address",
  /** column name */
  Decimals = "decimals",
  /** column name */
  Name = "name",
  /** column name */
  SupplyAggregatorTableHandle = "supply_aggregator_table_handle",
  /** column name */
  SupplyAggregatorTableKey = "supply_aggregator_table_key",
  /** column name */
  Symbol = "symbol",
  /** column name */
  TransactionCreatedTimestamp = "transaction_created_timestamp",
  /** column name */
  TransactionVersionCreated = "transaction_version_created",
}

/** Streaming cursor of the table "coin_infos" */
export type CoinInfosStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: CoinInfosStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type CoinInfosStreamCursorValueInput = {
  coin_type?: InputMaybe<Scalars["String"]["input"]>;
  coin_type_hash?: InputMaybe<Scalars["String"]["input"]>;
  creator_address?: InputMaybe<Scalars["String"]["input"]>;
  decimals?: InputMaybe<Scalars["Int"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  supply_aggregator_table_handle?: InputMaybe<Scalars["String"]["input"]>;
  supply_aggregator_table_key?: InputMaybe<Scalars["String"]["input"]>;
  symbol?: InputMaybe<Scalars["String"]["input"]>;
  transaction_created_timestamp?: InputMaybe<Scalars["timestamp"]["input"]>;
  transaction_version_created?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** columns and relationships of "coin_supply" */
export type CoinSupply = {
  coin_type: Scalars["String"]["output"];
  coin_type_hash: Scalars["String"]["output"];
  supply: Scalars["numeric"]["output"];
  transaction_epoch: Scalars["bigint"]["output"];
  transaction_timestamp: Scalars["timestamp"]["output"];
  transaction_version: Scalars["bigint"]["output"];
};

/** Boolean expression to filter rows from the table "coin_supply". All fields are combined with a logical 'AND'. */
export type CoinSupplyBoolExp = {
  _and?: InputMaybe<Array<CoinSupplyBoolExp>>;
  _not?: InputMaybe<CoinSupplyBoolExp>;
  _or?: InputMaybe<Array<CoinSupplyBoolExp>>;
  coin_type?: InputMaybe<StringComparisonExp>;
  coin_type_hash?: InputMaybe<StringComparisonExp>;
  supply?: InputMaybe<NumericComparisonExp>;
  transaction_epoch?: InputMaybe<BigintComparisonExp>;
  transaction_timestamp?: InputMaybe<TimestampComparisonExp>;
  transaction_version?: InputMaybe<BigintComparisonExp>;
};

/** Ordering options when selecting data from "coin_supply". */
export type CoinSupplyOrderBy = {
  coin_type?: InputMaybe<OrderBy>;
  coin_type_hash?: InputMaybe<OrderBy>;
  supply?: InputMaybe<OrderBy>;
  transaction_epoch?: InputMaybe<OrderBy>;
  transaction_timestamp?: InputMaybe<OrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
};

/** select columns of table "coin_supply" */
export enum CoinSupplySelectColumn {
  /** column name */
  CoinType = "coin_type",
  /** column name */
  CoinTypeHash = "coin_type_hash",
  /** column name */
  Supply = "supply",
  /** column name */
  TransactionEpoch = "transaction_epoch",
  /** column name */
  TransactionTimestamp = "transaction_timestamp",
  /** column name */
  TransactionVersion = "transaction_version",
}

/** Streaming cursor of the table "coin_supply" */
export type CoinSupplyStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: CoinSupplyStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type CoinSupplyStreamCursorValueInput = {
  coin_type?: InputMaybe<Scalars["String"]["input"]>;
  coin_type_hash?: InputMaybe<Scalars["String"]["input"]>;
  supply?: InputMaybe<Scalars["numeric"]["input"]>;
  transaction_epoch?: InputMaybe<Scalars["bigint"]["input"]>;
  transaction_timestamp?: InputMaybe<Scalars["timestamp"]["input"]>;
  transaction_version?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** columns and relationships of "collection_datas" */
export type CollectionDatas = {
  collection_data_id_hash: Scalars["String"]["output"];
  collection_name: Scalars["String"]["output"];
  creator_address: Scalars["String"]["output"];
  description: Scalars["String"]["output"];
  description_mutable: Scalars["Boolean"]["output"];
  maximum: Scalars["numeric"]["output"];
  maximum_mutable: Scalars["Boolean"]["output"];
  metadata_uri: Scalars["String"]["output"];
  supply: Scalars["numeric"]["output"];
  table_handle: Scalars["String"]["output"];
  transaction_timestamp: Scalars["timestamp"]["output"];
  transaction_version: Scalars["bigint"]["output"];
  uri_mutable: Scalars["Boolean"]["output"];
};

/** Boolean expression to filter rows from the table "collection_datas". All fields are combined with a logical 'AND'. */
export type CollectionDatasBoolExp = {
  _and?: InputMaybe<Array<CollectionDatasBoolExp>>;
  _not?: InputMaybe<CollectionDatasBoolExp>;
  _or?: InputMaybe<Array<CollectionDatasBoolExp>>;
  collection_data_id_hash?: InputMaybe<StringComparisonExp>;
  collection_name?: InputMaybe<StringComparisonExp>;
  creator_address?: InputMaybe<StringComparisonExp>;
  description?: InputMaybe<StringComparisonExp>;
  description_mutable?: InputMaybe<BooleanComparisonExp>;
  maximum?: InputMaybe<NumericComparisonExp>;
  maximum_mutable?: InputMaybe<BooleanComparisonExp>;
  metadata_uri?: InputMaybe<StringComparisonExp>;
  supply?: InputMaybe<NumericComparisonExp>;
  table_handle?: InputMaybe<StringComparisonExp>;
  transaction_timestamp?: InputMaybe<TimestampComparisonExp>;
  transaction_version?: InputMaybe<BigintComparisonExp>;
  uri_mutable?: InputMaybe<BooleanComparisonExp>;
};

/** Ordering options when selecting data from "collection_datas". */
export type CollectionDatasOrderBy = {
  collection_data_id_hash?: InputMaybe<OrderBy>;
  collection_name?: InputMaybe<OrderBy>;
  creator_address?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  description_mutable?: InputMaybe<OrderBy>;
  maximum?: InputMaybe<OrderBy>;
  maximum_mutable?: InputMaybe<OrderBy>;
  metadata_uri?: InputMaybe<OrderBy>;
  supply?: InputMaybe<OrderBy>;
  table_handle?: InputMaybe<OrderBy>;
  transaction_timestamp?: InputMaybe<OrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
  uri_mutable?: InputMaybe<OrderBy>;
};

/** select columns of table "collection_datas" */
export enum CollectionDatasSelectColumn {
  /** column name */
  CollectionDataIdHash = "collection_data_id_hash",
  /** column name */
  CollectionName = "collection_name",
  /** column name */
  CreatorAddress = "creator_address",
  /** column name */
  Description = "description",
  /** column name */
  DescriptionMutable = "description_mutable",
  /** column name */
  Maximum = "maximum",
  /** column name */
  MaximumMutable = "maximum_mutable",
  /** column name */
  MetadataUri = "metadata_uri",
  /** column name */
  Supply = "supply",
  /** column name */
  TableHandle = "table_handle",
  /** column name */
  TransactionTimestamp = "transaction_timestamp",
  /** column name */
  TransactionVersion = "transaction_version",
  /** column name */
  UriMutable = "uri_mutable",
}

/** Streaming cursor of the table "collection_datas" */
export type CollectionDatasStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: CollectionDatasStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type CollectionDatasStreamCursorValueInput = {
  collection_data_id_hash?: InputMaybe<Scalars["String"]["input"]>;
  collection_name?: InputMaybe<Scalars["String"]["input"]>;
  creator_address?: InputMaybe<Scalars["String"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  description_mutable?: InputMaybe<Scalars["Boolean"]["input"]>;
  maximum?: InputMaybe<Scalars["numeric"]["input"]>;
  maximum_mutable?: InputMaybe<Scalars["Boolean"]["input"]>;
  metadata_uri?: InputMaybe<Scalars["String"]["input"]>;
  supply?: InputMaybe<Scalars["numeric"]["input"]>;
  table_handle?: InputMaybe<Scalars["String"]["input"]>;
  transaction_timestamp?: InputMaybe<Scalars["timestamp"]["input"]>;
  transaction_version?: InputMaybe<Scalars["bigint"]["input"]>;
  uri_mutable?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** columns and relationships of "current_ans_lookup" */
export type CurrentAnsLookup = {
  /** An array relationship */
  all_token_ownerships: Array<CurrentTokenOwnerships>;
  /** An aggregate relationship */
  all_token_ownerships_aggregate: CurrentTokenOwnershipsAggregate;
  domain: Scalars["String"]["output"];
  expiration_timestamp: Scalars["timestamp"]["output"];
  is_deleted: Scalars["Boolean"]["output"];
  last_transaction_version: Scalars["bigint"]["output"];
  registered_address?: Maybe<Scalars["String"]["output"]>;
  subdomain: Scalars["String"]["output"];
  token_name: Scalars["String"]["output"];
};

/** columns and relationships of "current_ans_lookup" */
export type CurrentAnsLookupAllTokenOwnershipsArgs = {
  distinct_on?: InputMaybe<Array<CurrentTokenOwnershipsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentTokenOwnershipsOrderBy>>;
  where?: InputMaybe<CurrentTokenOwnershipsBoolExp>;
};

/** columns and relationships of "current_ans_lookup" */
export type CurrentAnsLookupAllTokenOwnershipsAggregateArgs = {
  distinct_on?: InputMaybe<Array<CurrentTokenOwnershipsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentTokenOwnershipsOrderBy>>;
  where?: InputMaybe<CurrentTokenOwnershipsBoolExp>;
};

/** Boolean expression to filter rows from the table "current_ans_lookup". All fields are combined with a logical 'AND'. */
export type CurrentAnsLookupBoolExp = {
  _and?: InputMaybe<Array<CurrentAnsLookupBoolExp>>;
  _not?: InputMaybe<CurrentAnsLookupBoolExp>;
  _or?: InputMaybe<Array<CurrentAnsLookupBoolExp>>;
  all_token_ownerships?: InputMaybe<CurrentTokenOwnershipsBoolExp>;
  domain?: InputMaybe<StringComparisonExp>;
  expiration_timestamp?: InputMaybe<TimestampComparisonExp>;
  is_deleted?: InputMaybe<BooleanComparisonExp>;
  last_transaction_version?: InputMaybe<BigintComparisonExp>;
  registered_address?: InputMaybe<StringComparisonExp>;
  subdomain?: InputMaybe<StringComparisonExp>;
  token_name?: InputMaybe<StringComparisonExp>;
};

/** Ordering options when selecting data from "current_ans_lookup". */
export type CurrentAnsLookupOrderBy = {
  all_token_ownerships_aggregate?: InputMaybe<CurrentTokenOwnershipsAggregateOrderBy>;
  domain?: InputMaybe<OrderBy>;
  expiration_timestamp?: InputMaybe<OrderBy>;
  is_deleted?: InputMaybe<OrderBy>;
  last_transaction_version?: InputMaybe<OrderBy>;
  registered_address?: InputMaybe<OrderBy>;
  subdomain?: InputMaybe<OrderBy>;
  token_name?: InputMaybe<OrderBy>;
};

/** select columns of table "current_ans_lookup" */
export enum CurrentAnsLookupSelectColumn {
  /** column name */
  Domain = "domain",
  /** column name */
  ExpirationTimestamp = "expiration_timestamp",
  /** column name */
  IsDeleted = "is_deleted",
  /** column name */
  LastTransactionVersion = "last_transaction_version",
  /** column name */
  RegisteredAddress = "registered_address",
  /** column name */
  Subdomain = "subdomain",
  /** column name */
  TokenName = "token_name",
}

/** Streaming cursor of the table "current_ans_lookup" */
export type CurrentAnsLookupStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: CurrentAnsLookupStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type CurrentAnsLookupStreamCursorValueInput = {
  domain?: InputMaybe<Scalars["String"]["input"]>;
  expiration_timestamp?: InputMaybe<Scalars["timestamp"]["input"]>;
  is_deleted?: InputMaybe<Scalars["Boolean"]["input"]>;
  last_transaction_version?: InputMaybe<Scalars["bigint"]["input"]>;
  registered_address?: InputMaybe<Scalars["String"]["input"]>;
  subdomain?: InputMaybe<Scalars["String"]["input"]>;
  token_name?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "current_ans_lookup_v2" */
export type CurrentAnsLookupV2 = {
  domain: Scalars["String"]["output"];
  expiration_timestamp: Scalars["timestamp"]["output"];
  is_deleted: Scalars["Boolean"]["output"];
  last_transaction_version: Scalars["bigint"]["output"];
  registered_address?: Maybe<Scalars["String"]["output"]>;
  subdomain: Scalars["String"]["output"];
  token_name?: Maybe<Scalars["String"]["output"]>;
  token_standard: Scalars["String"]["output"];
};

/** Boolean expression to filter rows from the table "current_ans_lookup_v2". All fields are combined with a logical 'AND'. */
export type CurrentAnsLookupV2BoolExp = {
  _and?: InputMaybe<Array<CurrentAnsLookupV2BoolExp>>;
  _not?: InputMaybe<CurrentAnsLookupV2BoolExp>;
  _or?: InputMaybe<Array<CurrentAnsLookupV2BoolExp>>;
  domain?: InputMaybe<StringComparisonExp>;
  expiration_timestamp?: InputMaybe<TimestampComparisonExp>;
  is_deleted?: InputMaybe<BooleanComparisonExp>;
  last_transaction_version?: InputMaybe<BigintComparisonExp>;
  registered_address?: InputMaybe<StringComparisonExp>;
  subdomain?: InputMaybe<StringComparisonExp>;
  token_name?: InputMaybe<StringComparisonExp>;
  token_standard?: InputMaybe<StringComparisonExp>;
};

/** Ordering options when selecting data from "current_ans_lookup_v2". */
export type CurrentAnsLookupV2OrderBy = {
  domain?: InputMaybe<OrderBy>;
  expiration_timestamp?: InputMaybe<OrderBy>;
  is_deleted?: InputMaybe<OrderBy>;
  last_transaction_version?: InputMaybe<OrderBy>;
  registered_address?: InputMaybe<OrderBy>;
  subdomain?: InputMaybe<OrderBy>;
  token_name?: InputMaybe<OrderBy>;
  token_standard?: InputMaybe<OrderBy>;
};

/** select columns of table "current_ans_lookup_v2" */
export enum CurrentAnsLookupV2SelectColumn {
  /** column name */
  Domain = "domain",
  /** column name */
  ExpirationTimestamp = "expiration_timestamp",
  /** column name */
  IsDeleted = "is_deleted",
  /** column name */
  LastTransactionVersion = "last_transaction_version",
  /** column name */
  RegisteredAddress = "registered_address",
  /** column name */
  Subdomain = "subdomain",
  /** column name */
  TokenName = "token_name",
  /** column name */
  TokenStandard = "token_standard",
}

/** Streaming cursor of the table "current_ans_lookup_v2" */
export type CurrentAnsLookupV2StreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: CurrentAnsLookupV2StreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type CurrentAnsLookupV2StreamCursorValueInput = {
  domain?: InputMaybe<Scalars["String"]["input"]>;
  expiration_timestamp?: InputMaybe<Scalars["timestamp"]["input"]>;
  is_deleted?: InputMaybe<Scalars["Boolean"]["input"]>;
  last_transaction_version?: InputMaybe<Scalars["bigint"]["input"]>;
  registered_address?: InputMaybe<Scalars["String"]["input"]>;
  subdomain?: InputMaybe<Scalars["String"]["input"]>;
  token_name?: InputMaybe<Scalars["String"]["input"]>;
  token_standard?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "current_aptos_names" */
export type CurrentAptosNames = {
  domain?: Maybe<Scalars["String"]["output"]>;
  domain_with_suffix?: Maybe<Scalars["String"]["output"]>;
  expiration_timestamp?: Maybe<Scalars["timestamp"]["output"]>;
  is_active?: Maybe<Scalars["Boolean"]["output"]>;
  /** An object relationship */
  is_domain_owner?: Maybe<CurrentAptosNames>;
  is_primary?: Maybe<Scalars["Boolean"]["output"]>;
  last_transaction_version?: Maybe<Scalars["bigint"]["output"]>;
  owner_address?: Maybe<Scalars["String"]["output"]>;
  registered_address?: Maybe<Scalars["String"]["output"]>;
  subdomain?: Maybe<Scalars["String"]["output"]>;
  token_name?: Maybe<Scalars["String"]["output"]>;
  token_standard?: Maybe<Scalars["String"]["output"]>;
};

/** aggregated selection of "current_aptos_names" */
export type CurrentAptosNamesAggregate = {
  aggregate?: Maybe<CurrentAptosNamesAggregateFields>;
  nodes: Array<CurrentAptosNames>;
};

/** aggregate fields of "current_aptos_names" */
export type CurrentAptosNamesAggregateFields = {
  avg?: Maybe<CurrentAptosNamesAvgFields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<CurrentAptosNamesMaxFields>;
  min?: Maybe<CurrentAptosNamesMinFields>;
  stddev?: Maybe<CurrentAptosNamesStddevFields>;
  stddev_pop?: Maybe<CurrentAptosNamesStddevPopFields>;
  stddev_samp?: Maybe<CurrentAptosNamesStddevSampFields>;
  sum?: Maybe<CurrentAptosNamesSumFields>;
  var_pop?: Maybe<CurrentAptosNamesVarPopFields>;
  var_samp?: Maybe<CurrentAptosNamesVarSampFields>;
  variance?: Maybe<CurrentAptosNamesVarianceFields>;
};

/** aggregate fields of "current_aptos_names" */
export type CurrentAptosNamesAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<CurrentAptosNamesSelectColumn>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "current_aptos_names" */
export type CurrentAptosNamesAggregateOrderBy = {
  avg?: InputMaybe<CurrentAptosNamesAvgOrderBy>;
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<CurrentAptosNamesMaxOrderBy>;
  min?: InputMaybe<CurrentAptosNamesMinOrderBy>;
  stddev?: InputMaybe<CurrentAptosNamesStddevOrderBy>;
  stddev_pop?: InputMaybe<CurrentAptosNamesStddevPopOrderBy>;
  stddev_samp?: InputMaybe<CurrentAptosNamesStddevSampOrderBy>;
  sum?: InputMaybe<CurrentAptosNamesSumOrderBy>;
  var_pop?: InputMaybe<CurrentAptosNamesVarPopOrderBy>;
  var_samp?: InputMaybe<CurrentAptosNamesVarSampOrderBy>;
  variance?: InputMaybe<CurrentAptosNamesVarianceOrderBy>;
};

/** aggregate avg on columns */
export type CurrentAptosNamesAvgFields = {
  last_transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** order by avg() on columns of table "current_aptos_names" */
export type CurrentAptosNamesAvgOrderBy = {
  last_transaction_version?: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "current_aptos_names". All fields are combined with a logical 'AND'. */
export type CurrentAptosNamesBoolExp = {
  _and?: InputMaybe<Array<CurrentAptosNamesBoolExp>>;
  _not?: InputMaybe<CurrentAptosNamesBoolExp>;
  _or?: InputMaybe<Array<CurrentAptosNamesBoolExp>>;
  domain?: InputMaybe<StringComparisonExp>;
  domain_with_suffix?: InputMaybe<StringComparisonExp>;
  expiration_timestamp?: InputMaybe<TimestampComparisonExp>;
  is_active?: InputMaybe<BooleanComparisonExp>;
  is_domain_owner?: InputMaybe<CurrentAptosNamesBoolExp>;
  is_primary?: InputMaybe<BooleanComparisonExp>;
  last_transaction_version?: InputMaybe<BigintComparisonExp>;
  owner_address?: InputMaybe<StringComparisonExp>;
  registered_address?: InputMaybe<StringComparisonExp>;
  subdomain?: InputMaybe<StringComparisonExp>;
  token_name?: InputMaybe<StringComparisonExp>;
  token_standard?: InputMaybe<StringComparisonExp>;
};

/** aggregate max on columns */
export type CurrentAptosNamesMaxFields = {
  domain?: Maybe<Scalars["String"]["output"]>;
  domain_with_suffix?: Maybe<Scalars["String"]["output"]>;
  expiration_timestamp?: Maybe<Scalars["timestamp"]["output"]>;
  last_transaction_version?: Maybe<Scalars["bigint"]["output"]>;
  owner_address?: Maybe<Scalars["String"]["output"]>;
  registered_address?: Maybe<Scalars["String"]["output"]>;
  subdomain?: Maybe<Scalars["String"]["output"]>;
  token_name?: Maybe<Scalars["String"]["output"]>;
  token_standard?: Maybe<Scalars["String"]["output"]>;
};

/** order by max() on columns of table "current_aptos_names" */
export type CurrentAptosNamesMaxOrderBy = {
  domain?: InputMaybe<OrderBy>;
  domain_with_suffix?: InputMaybe<OrderBy>;
  expiration_timestamp?: InputMaybe<OrderBy>;
  last_transaction_version?: InputMaybe<OrderBy>;
  owner_address?: InputMaybe<OrderBy>;
  registered_address?: InputMaybe<OrderBy>;
  subdomain?: InputMaybe<OrderBy>;
  token_name?: InputMaybe<OrderBy>;
  token_standard?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type CurrentAptosNamesMinFields = {
  domain?: Maybe<Scalars["String"]["output"]>;
  domain_with_suffix?: Maybe<Scalars["String"]["output"]>;
  expiration_timestamp?: Maybe<Scalars["timestamp"]["output"]>;
  last_transaction_version?: Maybe<Scalars["bigint"]["output"]>;
  owner_address?: Maybe<Scalars["String"]["output"]>;
  registered_address?: Maybe<Scalars["String"]["output"]>;
  subdomain?: Maybe<Scalars["String"]["output"]>;
  token_name?: Maybe<Scalars["String"]["output"]>;
  token_standard?: Maybe<Scalars["String"]["output"]>;
};

/** order by min() on columns of table "current_aptos_names" */
export type CurrentAptosNamesMinOrderBy = {
  domain?: InputMaybe<OrderBy>;
  domain_with_suffix?: InputMaybe<OrderBy>;
  expiration_timestamp?: InputMaybe<OrderBy>;
  last_transaction_version?: InputMaybe<OrderBy>;
  owner_address?: InputMaybe<OrderBy>;
  registered_address?: InputMaybe<OrderBy>;
  subdomain?: InputMaybe<OrderBy>;
  token_name?: InputMaybe<OrderBy>;
  token_standard?: InputMaybe<OrderBy>;
};

/** Ordering options when selecting data from "current_aptos_names". */
export type CurrentAptosNamesOrderBy = {
  domain?: InputMaybe<OrderBy>;
  domain_with_suffix?: InputMaybe<OrderBy>;
  expiration_timestamp?: InputMaybe<OrderBy>;
  is_active?: InputMaybe<OrderBy>;
  is_domain_owner?: InputMaybe<CurrentAptosNamesOrderBy>;
  is_primary?: InputMaybe<OrderBy>;
  last_transaction_version?: InputMaybe<OrderBy>;
  owner_address?: InputMaybe<OrderBy>;
  registered_address?: InputMaybe<OrderBy>;
  subdomain?: InputMaybe<OrderBy>;
  token_name?: InputMaybe<OrderBy>;
  token_standard?: InputMaybe<OrderBy>;
};

/** select columns of table "current_aptos_names" */
export enum CurrentAptosNamesSelectColumn {
  /** column name */
  Domain = "domain",
  /** column name */
  DomainWithSuffix = "domain_with_suffix",
  /** column name */
  ExpirationTimestamp = "expiration_timestamp",
  /** column name */
  IsActive = "is_active",
  /** column name */
  IsPrimary = "is_primary",
  /** column name */
  LastTransactionVersion = "last_transaction_version",
  /** column name */
  OwnerAddress = "owner_address",
  /** column name */
  RegisteredAddress = "registered_address",
  /** column name */
  Subdomain = "subdomain",
  /** column name */
  TokenName = "token_name",
  /** column name */
  TokenStandard = "token_standard",
}

/** aggregate stddev on columns */
export type CurrentAptosNamesStddevFields = {
  last_transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev() on columns of table "current_aptos_names" */
export type CurrentAptosNamesStddevOrderBy = {
  last_transaction_version?: InputMaybe<OrderBy>;
};

/** aggregate stddev_pop on columns */
export type CurrentAptosNamesStddevPopFields = {
  last_transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_pop() on columns of table "current_aptos_names" */
export type CurrentAptosNamesStddevPopOrderBy = {
  last_transaction_version?: InputMaybe<OrderBy>;
};

/** aggregate stddev_samp on columns */
export type CurrentAptosNamesStddevSampFields = {
  last_transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_samp() on columns of table "current_aptos_names" */
export type CurrentAptosNamesStddevSampOrderBy = {
  last_transaction_version?: InputMaybe<OrderBy>;
};

/** Streaming cursor of the table "current_aptos_names" */
export type CurrentAptosNamesStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: CurrentAptosNamesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type CurrentAptosNamesStreamCursorValueInput = {
  domain?: InputMaybe<Scalars["String"]["input"]>;
  domain_with_suffix?: InputMaybe<Scalars["String"]["input"]>;
  expiration_timestamp?: InputMaybe<Scalars["timestamp"]["input"]>;
  is_active?: InputMaybe<Scalars["Boolean"]["input"]>;
  is_primary?: InputMaybe<Scalars["Boolean"]["input"]>;
  last_transaction_version?: InputMaybe<Scalars["bigint"]["input"]>;
  owner_address?: InputMaybe<Scalars["String"]["input"]>;
  registered_address?: InputMaybe<Scalars["String"]["input"]>;
  subdomain?: InputMaybe<Scalars["String"]["input"]>;
  token_name?: InputMaybe<Scalars["String"]["input"]>;
  token_standard?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregate sum on columns */
export type CurrentAptosNamesSumFields = {
  last_transaction_version?: Maybe<Scalars["bigint"]["output"]>;
};

/** order by sum() on columns of table "current_aptos_names" */
export type CurrentAptosNamesSumOrderBy = {
  last_transaction_version?: InputMaybe<OrderBy>;
};

/** aggregate var_pop on columns */
export type CurrentAptosNamesVarPopFields = {
  last_transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_pop() on columns of table "current_aptos_names" */
export type CurrentAptosNamesVarPopOrderBy = {
  last_transaction_version?: InputMaybe<OrderBy>;
};

/** aggregate var_samp on columns */
export type CurrentAptosNamesVarSampFields = {
  last_transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_samp() on columns of table "current_aptos_names" */
export type CurrentAptosNamesVarSampOrderBy = {
  last_transaction_version?: InputMaybe<OrderBy>;
};

/** aggregate variance on columns */
export type CurrentAptosNamesVarianceFields = {
  last_transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** order by variance() on columns of table "current_aptos_names" */
export type CurrentAptosNamesVarianceOrderBy = {
  last_transaction_version?: InputMaybe<OrderBy>;
};

/** columns and relationships of "current_coin_balances" */
export type CurrentCoinBalances = {
  amount: Scalars["numeric"]["output"];
  /** An object relationship */
  coin_info?: Maybe<CoinInfos>;
  coin_type: Scalars["String"]["output"];
  coin_type_hash: Scalars["String"]["output"];
  last_transaction_timestamp: Scalars["timestamp"]["output"];
  last_transaction_version: Scalars["bigint"]["output"];
  owner_address: Scalars["String"]["output"];
};

/** Boolean expression to filter rows from the table "current_coin_balances". All fields are combined with a logical 'AND'. */
export type CurrentCoinBalancesBoolExp = {
  _and?: InputMaybe<Array<CurrentCoinBalancesBoolExp>>;
  _not?: InputMaybe<CurrentCoinBalancesBoolExp>;
  _or?: InputMaybe<Array<CurrentCoinBalancesBoolExp>>;
  amount?: InputMaybe<NumericComparisonExp>;
  coin_info?: InputMaybe<CoinInfosBoolExp>;
  coin_type?: InputMaybe<StringComparisonExp>;
  coin_type_hash?: InputMaybe<StringComparisonExp>;
  last_transaction_timestamp?: InputMaybe<TimestampComparisonExp>;
  last_transaction_version?: InputMaybe<BigintComparisonExp>;
  owner_address?: InputMaybe<StringComparisonExp>;
};

/** Ordering options when selecting data from "current_coin_balances". */
export type CurrentCoinBalancesOrderBy = {
  amount?: InputMaybe<OrderBy>;
  coin_info?: InputMaybe<CoinInfosOrderBy>;
  coin_type?: InputMaybe<OrderBy>;
  coin_type_hash?: InputMaybe<OrderBy>;
  last_transaction_timestamp?: InputMaybe<OrderBy>;
  last_transaction_version?: InputMaybe<OrderBy>;
  owner_address?: InputMaybe<OrderBy>;
};

/** select columns of table "current_coin_balances" */
export enum CurrentCoinBalancesSelectColumn {
  /** column name */
  Amount = "amount",
  /** column name */
  CoinType = "coin_type",
  /** column name */
  CoinTypeHash = "coin_type_hash",
  /** column name */
  LastTransactionTimestamp = "last_transaction_timestamp",
  /** column name */
  LastTransactionVersion = "last_transaction_version",
  /** column name */
  OwnerAddress = "owner_address",
}

/** Streaming cursor of the table "current_coin_balances" */
export type CurrentCoinBalancesStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: CurrentCoinBalancesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type CurrentCoinBalancesStreamCursorValueInput = {
  amount?: InputMaybe<Scalars["numeric"]["input"]>;
  coin_type?: InputMaybe<Scalars["String"]["input"]>;
  coin_type_hash?: InputMaybe<Scalars["String"]["input"]>;
  last_transaction_timestamp?: InputMaybe<Scalars["timestamp"]["input"]>;
  last_transaction_version?: InputMaybe<Scalars["bigint"]["input"]>;
  owner_address?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "current_collection_datas" */
export type CurrentCollectionDatas = {
  collection_data_id_hash: Scalars["String"]["output"];
  collection_name: Scalars["String"]["output"];
  creator_address: Scalars["String"]["output"];
  description: Scalars["String"]["output"];
  description_mutable: Scalars["Boolean"]["output"];
  last_transaction_timestamp: Scalars["timestamp"]["output"];
  last_transaction_version: Scalars["bigint"]["output"];
  maximum: Scalars["numeric"]["output"];
  maximum_mutable: Scalars["Boolean"]["output"];
  metadata_uri: Scalars["String"]["output"];
  supply: Scalars["numeric"]["output"];
  table_handle: Scalars["String"]["output"];
  uri_mutable: Scalars["Boolean"]["output"];
};

/** Boolean expression to filter rows from the table "current_collection_datas". All fields are combined with a logical 'AND'. */
export type CurrentCollectionDatasBoolExp = {
  _and?: InputMaybe<Array<CurrentCollectionDatasBoolExp>>;
  _not?: InputMaybe<CurrentCollectionDatasBoolExp>;
  _or?: InputMaybe<Array<CurrentCollectionDatasBoolExp>>;
  collection_data_id_hash?: InputMaybe<StringComparisonExp>;
  collection_name?: InputMaybe<StringComparisonExp>;
  creator_address?: InputMaybe<StringComparisonExp>;
  description?: InputMaybe<StringComparisonExp>;
  description_mutable?: InputMaybe<BooleanComparisonExp>;
  last_transaction_timestamp?: InputMaybe<TimestampComparisonExp>;
  last_transaction_version?: InputMaybe<BigintComparisonExp>;
  maximum?: InputMaybe<NumericComparisonExp>;
  maximum_mutable?: InputMaybe<BooleanComparisonExp>;
  metadata_uri?: InputMaybe<StringComparisonExp>;
  supply?: InputMaybe<NumericComparisonExp>;
  table_handle?: InputMaybe<StringComparisonExp>;
  uri_mutable?: InputMaybe<BooleanComparisonExp>;
};

/** Ordering options when selecting data from "current_collection_datas". */
export type CurrentCollectionDatasOrderBy = {
  collection_data_id_hash?: InputMaybe<OrderBy>;
  collection_name?: InputMaybe<OrderBy>;
  creator_address?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  description_mutable?: InputMaybe<OrderBy>;
  last_transaction_timestamp?: InputMaybe<OrderBy>;
  last_transaction_version?: InputMaybe<OrderBy>;
  maximum?: InputMaybe<OrderBy>;
  maximum_mutable?: InputMaybe<OrderBy>;
  metadata_uri?: InputMaybe<OrderBy>;
  supply?: InputMaybe<OrderBy>;
  table_handle?: InputMaybe<OrderBy>;
  uri_mutable?: InputMaybe<OrderBy>;
};

/** select columns of table "current_collection_datas" */
export enum CurrentCollectionDatasSelectColumn {
  /** column name */
  CollectionDataIdHash = "collection_data_id_hash",
  /** column name */
  CollectionName = "collection_name",
  /** column name */
  CreatorAddress = "creator_address",
  /** column name */
  Description = "description",
  /** column name */
  DescriptionMutable = "description_mutable",
  /** column name */
  LastTransactionTimestamp = "last_transaction_timestamp",
  /** column name */
  LastTransactionVersion = "last_transaction_version",
  /** column name */
  Maximum = "maximum",
  /** column name */
  MaximumMutable = "maximum_mutable",
  /** column name */
  MetadataUri = "metadata_uri",
  /** column name */
  Supply = "supply",
  /** column name */
  TableHandle = "table_handle",
  /** column name */
  UriMutable = "uri_mutable",
}

/** Streaming cursor of the table "current_collection_datas" */
export type CurrentCollectionDatasStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: CurrentCollectionDatasStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type CurrentCollectionDatasStreamCursorValueInput = {
  collection_data_id_hash?: InputMaybe<Scalars["String"]["input"]>;
  collection_name?: InputMaybe<Scalars["String"]["input"]>;
  creator_address?: InputMaybe<Scalars["String"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  description_mutable?: InputMaybe<Scalars["Boolean"]["input"]>;
  last_transaction_timestamp?: InputMaybe<Scalars["timestamp"]["input"]>;
  last_transaction_version?: InputMaybe<Scalars["bigint"]["input"]>;
  maximum?: InputMaybe<Scalars["numeric"]["input"]>;
  maximum_mutable?: InputMaybe<Scalars["Boolean"]["input"]>;
  metadata_uri?: InputMaybe<Scalars["String"]["input"]>;
  supply?: InputMaybe<Scalars["numeric"]["input"]>;
  table_handle?: InputMaybe<Scalars["String"]["input"]>;
  uri_mutable?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** columns and relationships of "current_collection_ownership_v2_view" */
export type CurrentCollectionOwnershipV2View = {
  collection_id?: Maybe<Scalars["String"]["output"]>;
  collection_name?: Maybe<Scalars["String"]["output"]>;
  collection_uri?: Maybe<Scalars["String"]["output"]>;
  creator_address?: Maybe<Scalars["String"]["output"]>;
  /** An object relationship */
  current_collection?: Maybe<CurrentCollectionsV2>;
  distinct_tokens?: Maybe<Scalars["bigint"]["output"]>;
  last_transaction_version?: Maybe<Scalars["bigint"]["output"]>;
  owner_address?: Maybe<Scalars["String"]["output"]>;
  single_token_uri?: Maybe<Scalars["String"]["output"]>;
};

/** aggregated selection of "current_collection_ownership_v2_view" */
export type CurrentCollectionOwnershipV2ViewAggregate = {
  aggregate?: Maybe<CurrentCollectionOwnershipV2ViewAggregateFields>;
  nodes: Array<CurrentCollectionOwnershipV2View>;
};

/** aggregate fields of "current_collection_ownership_v2_view" */
export type CurrentCollectionOwnershipV2ViewAggregateFields = {
  avg?: Maybe<CurrentCollectionOwnershipV2ViewAvgFields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<CurrentCollectionOwnershipV2ViewMaxFields>;
  min?: Maybe<CurrentCollectionOwnershipV2ViewMinFields>;
  stddev?: Maybe<CurrentCollectionOwnershipV2ViewStddevFields>;
  stddev_pop?: Maybe<CurrentCollectionOwnershipV2ViewStddevPopFields>;
  stddev_samp?: Maybe<CurrentCollectionOwnershipV2ViewStddevSampFields>;
  sum?: Maybe<CurrentCollectionOwnershipV2ViewSumFields>;
  var_pop?: Maybe<CurrentCollectionOwnershipV2ViewVarPopFields>;
  var_samp?: Maybe<CurrentCollectionOwnershipV2ViewVarSampFields>;
  variance?: Maybe<CurrentCollectionOwnershipV2ViewVarianceFields>;
};

/** aggregate fields of "current_collection_ownership_v2_view" */
export type CurrentCollectionOwnershipV2ViewAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<CurrentCollectionOwnershipV2ViewSelectColumn>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** aggregate avg on columns */
export type CurrentCollectionOwnershipV2ViewAvgFields = {
  distinct_tokens?: Maybe<Scalars["Float"]["output"]>;
  last_transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** Boolean expression to filter rows from the table "current_collection_ownership_v2_view". All fields are combined with a logical 'AND'. */
export type CurrentCollectionOwnershipV2ViewBoolExp = {
  _and?: InputMaybe<Array<CurrentCollectionOwnershipV2ViewBoolExp>>;
  _not?: InputMaybe<CurrentCollectionOwnershipV2ViewBoolExp>;
  _or?: InputMaybe<Array<CurrentCollectionOwnershipV2ViewBoolExp>>;
  collection_id?: InputMaybe<StringComparisonExp>;
  collection_name?: InputMaybe<StringComparisonExp>;
  collection_uri?: InputMaybe<StringComparisonExp>;
  creator_address?: InputMaybe<StringComparisonExp>;
  current_collection?: InputMaybe<CurrentCollectionsV2BoolExp>;
  distinct_tokens?: InputMaybe<BigintComparisonExp>;
  last_transaction_version?: InputMaybe<BigintComparisonExp>;
  owner_address?: InputMaybe<StringComparisonExp>;
  single_token_uri?: InputMaybe<StringComparisonExp>;
};

/** aggregate max on columns */
export type CurrentCollectionOwnershipV2ViewMaxFields = {
  collection_id?: Maybe<Scalars["String"]["output"]>;
  collection_name?: Maybe<Scalars["String"]["output"]>;
  collection_uri?: Maybe<Scalars["String"]["output"]>;
  creator_address?: Maybe<Scalars["String"]["output"]>;
  distinct_tokens?: Maybe<Scalars["bigint"]["output"]>;
  last_transaction_version?: Maybe<Scalars["bigint"]["output"]>;
  owner_address?: Maybe<Scalars["String"]["output"]>;
  single_token_uri?: Maybe<Scalars["String"]["output"]>;
};

/** aggregate min on columns */
export type CurrentCollectionOwnershipV2ViewMinFields = {
  collection_id?: Maybe<Scalars["String"]["output"]>;
  collection_name?: Maybe<Scalars["String"]["output"]>;
  collection_uri?: Maybe<Scalars["String"]["output"]>;
  creator_address?: Maybe<Scalars["String"]["output"]>;
  distinct_tokens?: Maybe<Scalars["bigint"]["output"]>;
  last_transaction_version?: Maybe<Scalars["bigint"]["output"]>;
  owner_address?: Maybe<Scalars["String"]["output"]>;
  single_token_uri?: Maybe<Scalars["String"]["output"]>;
};

/** Ordering options when selecting data from "current_collection_ownership_v2_view". */
export type CurrentCollectionOwnershipV2ViewOrderBy = {
  collection_id?: InputMaybe<OrderBy>;
  collection_name?: InputMaybe<OrderBy>;
  collection_uri?: InputMaybe<OrderBy>;
  creator_address?: InputMaybe<OrderBy>;
  current_collection?: InputMaybe<CurrentCollectionsV2OrderBy>;
  distinct_tokens?: InputMaybe<OrderBy>;
  last_transaction_version?: InputMaybe<OrderBy>;
  owner_address?: InputMaybe<OrderBy>;
  single_token_uri?: InputMaybe<OrderBy>;
};

/** select columns of table "current_collection_ownership_v2_view" */
export enum CurrentCollectionOwnershipV2ViewSelectColumn {
  /** column name */
  CollectionId = "collection_id",
  /** column name */
  CollectionName = "collection_name",
  /** column name */
  CollectionUri = "collection_uri",
  /** column name */
  CreatorAddress = "creator_address",
  /** column name */
  DistinctTokens = "distinct_tokens",
  /** column name */
  LastTransactionVersion = "last_transaction_version",
  /** column name */
  OwnerAddress = "owner_address",
  /** column name */
  SingleTokenUri = "single_token_uri",
}

/** aggregate stddev on columns */
export type CurrentCollectionOwnershipV2ViewStddevFields = {
  distinct_tokens?: Maybe<Scalars["Float"]["output"]>;
  last_transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_pop on columns */
export type CurrentCollectionOwnershipV2ViewStddevPopFields = {
  distinct_tokens?: Maybe<Scalars["Float"]["output"]>;
  last_transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_samp on columns */
export type CurrentCollectionOwnershipV2ViewStddevSampFields = {
  distinct_tokens?: Maybe<Scalars["Float"]["output"]>;
  last_transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** Streaming cursor of the table "current_collection_ownership_v2_view" */
export type CurrentCollectionOwnershipV2ViewStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: CurrentCollectionOwnershipV2ViewStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type CurrentCollectionOwnershipV2ViewStreamCursorValueInput = {
  collection_id?: InputMaybe<Scalars["String"]["input"]>;
  collection_name?: InputMaybe<Scalars["String"]["input"]>;
  collection_uri?: InputMaybe<Scalars["String"]["input"]>;
  creator_address?: InputMaybe<Scalars["String"]["input"]>;
  distinct_tokens?: InputMaybe<Scalars["bigint"]["input"]>;
  last_transaction_version?: InputMaybe<Scalars["bigint"]["input"]>;
  owner_address?: InputMaybe<Scalars["String"]["input"]>;
  single_token_uri?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregate sum on columns */
export type CurrentCollectionOwnershipV2ViewSumFields = {
  distinct_tokens?: Maybe<Scalars["bigint"]["output"]>;
  last_transaction_version?: Maybe<Scalars["bigint"]["output"]>;
};

/** aggregate var_pop on columns */
export type CurrentCollectionOwnershipV2ViewVarPopFields = {
  distinct_tokens?: Maybe<Scalars["Float"]["output"]>;
  last_transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate var_samp on columns */
export type CurrentCollectionOwnershipV2ViewVarSampFields = {
  distinct_tokens?: Maybe<Scalars["Float"]["output"]>;
  last_transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate variance on columns */
export type CurrentCollectionOwnershipV2ViewVarianceFields = {
  distinct_tokens?: Maybe<Scalars["Float"]["output"]>;
  last_transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** columns and relationships of "current_collections_v2" */
export type CurrentCollectionsV2 = {
  /** An object relationship */
  cdn_asset_uris?: Maybe<NftMetadataCrawlerParsedAssetUris>;
  collection_id: Scalars["String"]["output"];
  collection_name: Scalars["String"]["output"];
  creator_address: Scalars["String"]["output"];
  current_supply: Scalars["numeric"]["output"];
  description: Scalars["String"]["output"];
  last_transaction_timestamp: Scalars["timestamp"]["output"];
  last_transaction_version: Scalars["bigint"]["output"];
  max_supply?: Maybe<Scalars["numeric"]["output"]>;
  mutable_description?: Maybe<Scalars["Boolean"]["output"]>;
  mutable_uri?: Maybe<Scalars["Boolean"]["output"]>;
  table_handle_v1?: Maybe<Scalars["String"]["output"]>;
  token_standard: Scalars["String"]["output"];
  total_minted_v2?: Maybe<Scalars["numeric"]["output"]>;
  uri: Scalars["String"]["output"];
};

/** Boolean expression to filter rows from the table "current_collections_v2". All fields are combined with a logical 'AND'. */
export type CurrentCollectionsV2BoolExp = {
  _and?: InputMaybe<Array<CurrentCollectionsV2BoolExp>>;
  _not?: InputMaybe<CurrentCollectionsV2BoolExp>;
  _or?: InputMaybe<Array<CurrentCollectionsV2BoolExp>>;
  cdn_asset_uris?: InputMaybe<NftMetadataCrawlerParsedAssetUrisBoolExp>;
  collection_id?: InputMaybe<StringComparisonExp>;
  collection_name?: InputMaybe<StringComparisonExp>;
  creator_address?: InputMaybe<StringComparisonExp>;
  current_supply?: InputMaybe<NumericComparisonExp>;
  description?: InputMaybe<StringComparisonExp>;
  last_transaction_timestamp?: InputMaybe<TimestampComparisonExp>;
  last_transaction_version?: InputMaybe<BigintComparisonExp>;
  max_supply?: InputMaybe<NumericComparisonExp>;
  mutable_description?: InputMaybe<BooleanComparisonExp>;
  mutable_uri?: InputMaybe<BooleanComparisonExp>;
  table_handle_v1?: InputMaybe<StringComparisonExp>;
  token_standard?: InputMaybe<StringComparisonExp>;
  total_minted_v2?: InputMaybe<NumericComparisonExp>;
  uri?: InputMaybe<StringComparisonExp>;
};

/** Ordering options when selecting data from "current_collections_v2". */
export type CurrentCollectionsV2OrderBy = {
  cdn_asset_uris?: InputMaybe<NftMetadataCrawlerParsedAssetUrisOrderBy>;
  collection_id?: InputMaybe<OrderBy>;
  collection_name?: InputMaybe<OrderBy>;
  creator_address?: InputMaybe<OrderBy>;
  current_supply?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  last_transaction_timestamp?: InputMaybe<OrderBy>;
  last_transaction_version?: InputMaybe<OrderBy>;
  max_supply?: InputMaybe<OrderBy>;
  mutable_description?: InputMaybe<OrderBy>;
  mutable_uri?: InputMaybe<OrderBy>;
  table_handle_v1?: InputMaybe<OrderBy>;
  token_standard?: InputMaybe<OrderBy>;
  total_minted_v2?: InputMaybe<OrderBy>;
  uri?: InputMaybe<OrderBy>;
};

/** select columns of table "current_collections_v2" */
export enum CurrentCollectionsV2SelectColumn {
  /** column name */
  CollectionId = "collection_id",
  /** column name */
  CollectionName = "collection_name",
  /** column name */
  CreatorAddress = "creator_address",
  /** column name */
  CurrentSupply = "current_supply",
  /** column name */
  Description = "description",
  /** column name */
  LastTransactionTimestamp = "last_transaction_timestamp",
  /** column name */
  LastTransactionVersion = "last_transaction_version",
  /** column name */
  MaxSupply = "max_supply",
  /** column name */
  MutableDescription = "mutable_description",
  /** column name */
  MutableUri = "mutable_uri",
  /** column name */
  TableHandleV1 = "table_handle_v1",
  /** column name */
  TokenStandard = "token_standard",
  /** column name */
  TotalMintedV2 = "total_minted_v2",
  /** column name */
  Uri = "uri",
}

/** Streaming cursor of the table "current_collections_v2" */
export type CurrentCollectionsV2StreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: CurrentCollectionsV2StreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type CurrentCollectionsV2StreamCursorValueInput = {
  collection_id?: InputMaybe<Scalars["String"]["input"]>;
  collection_name?: InputMaybe<Scalars["String"]["input"]>;
  creator_address?: InputMaybe<Scalars["String"]["input"]>;
  current_supply?: InputMaybe<Scalars["numeric"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  last_transaction_timestamp?: InputMaybe<Scalars["timestamp"]["input"]>;
  last_transaction_version?: InputMaybe<Scalars["bigint"]["input"]>;
  max_supply?: InputMaybe<Scalars["numeric"]["input"]>;
  mutable_description?: InputMaybe<Scalars["Boolean"]["input"]>;
  mutable_uri?: InputMaybe<Scalars["Boolean"]["input"]>;
  table_handle_v1?: InputMaybe<Scalars["String"]["input"]>;
  token_standard?: InputMaybe<Scalars["String"]["input"]>;
  total_minted_v2?: InputMaybe<Scalars["numeric"]["input"]>;
  uri?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "current_delegated_staking_pool_balances" */
export type CurrentDelegatedStakingPoolBalances = {
  active_table_handle: Scalars["String"]["output"];
  inactive_table_handle: Scalars["String"]["output"];
  last_transaction_version: Scalars["bigint"]["output"];
  operator_commission_percentage: Scalars["numeric"]["output"];
  staking_pool_address: Scalars["String"]["output"];
  total_coins: Scalars["numeric"]["output"];
  total_shares: Scalars["numeric"]["output"];
};

/** Boolean expression to filter rows from the table "current_delegated_staking_pool_balances". All fields are combined with a logical 'AND'. */
export type CurrentDelegatedStakingPoolBalancesBoolExp = {
  _and?: InputMaybe<Array<CurrentDelegatedStakingPoolBalancesBoolExp>>;
  _not?: InputMaybe<CurrentDelegatedStakingPoolBalancesBoolExp>;
  _or?: InputMaybe<Array<CurrentDelegatedStakingPoolBalancesBoolExp>>;
  active_table_handle?: InputMaybe<StringComparisonExp>;
  inactive_table_handle?: InputMaybe<StringComparisonExp>;
  last_transaction_version?: InputMaybe<BigintComparisonExp>;
  operator_commission_percentage?: InputMaybe<NumericComparisonExp>;
  staking_pool_address?: InputMaybe<StringComparisonExp>;
  total_coins?: InputMaybe<NumericComparisonExp>;
  total_shares?: InputMaybe<NumericComparisonExp>;
};

/** Ordering options when selecting data from "current_delegated_staking_pool_balances". */
export type CurrentDelegatedStakingPoolBalancesOrderBy = {
  active_table_handle?: InputMaybe<OrderBy>;
  inactive_table_handle?: InputMaybe<OrderBy>;
  last_transaction_version?: InputMaybe<OrderBy>;
  operator_commission_percentage?: InputMaybe<OrderBy>;
  staking_pool_address?: InputMaybe<OrderBy>;
  total_coins?: InputMaybe<OrderBy>;
  total_shares?: InputMaybe<OrderBy>;
};

/** select columns of table "current_delegated_staking_pool_balances" */
export enum CurrentDelegatedStakingPoolBalancesSelectColumn {
  /** column name */
  ActiveTableHandle = "active_table_handle",
  /** column name */
  InactiveTableHandle = "inactive_table_handle",
  /** column name */
  LastTransactionVersion = "last_transaction_version",
  /** column name */
  OperatorCommissionPercentage = "operator_commission_percentage",
  /** column name */
  StakingPoolAddress = "staking_pool_address",
  /** column name */
  TotalCoins = "total_coins",
  /** column name */
  TotalShares = "total_shares",
}

/** Streaming cursor of the table "current_delegated_staking_pool_balances" */
export type CurrentDelegatedStakingPoolBalancesStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: CurrentDelegatedStakingPoolBalancesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type CurrentDelegatedStakingPoolBalancesStreamCursorValueInput = {
  active_table_handle?: InputMaybe<Scalars["String"]["input"]>;
  inactive_table_handle?: InputMaybe<Scalars["String"]["input"]>;
  last_transaction_version?: InputMaybe<Scalars["bigint"]["input"]>;
  operator_commission_percentage?: InputMaybe<Scalars["numeric"]["input"]>;
  staking_pool_address?: InputMaybe<Scalars["String"]["input"]>;
  total_coins?: InputMaybe<Scalars["numeric"]["input"]>;
  total_shares?: InputMaybe<Scalars["numeric"]["input"]>;
};

/** columns and relationships of "current_delegated_voter" */
export type CurrentDelegatedVoter = {
  delegation_pool_address: Scalars["String"]["output"];
  delegator_address: Scalars["String"]["output"];
  last_transaction_timestamp: Scalars["timestamp"]["output"];
  last_transaction_version: Scalars["bigint"]["output"];
  pending_voter?: Maybe<Scalars["String"]["output"]>;
  table_handle?: Maybe<Scalars["String"]["output"]>;
  voter?: Maybe<Scalars["String"]["output"]>;
};

/** Boolean expression to filter rows from the table "current_delegated_voter". All fields are combined with a logical 'AND'. */
export type CurrentDelegatedVoterBoolExp = {
  _and?: InputMaybe<Array<CurrentDelegatedVoterBoolExp>>;
  _not?: InputMaybe<CurrentDelegatedVoterBoolExp>;
  _or?: InputMaybe<Array<CurrentDelegatedVoterBoolExp>>;
  delegation_pool_address?: InputMaybe<StringComparisonExp>;
  delegator_address?: InputMaybe<StringComparisonExp>;
  last_transaction_timestamp?: InputMaybe<TimestampComparisonExp>;
  last_transaction_version?: InputMaybe<BigintComparisonExp>;
  pending_voter?: InputMaybe<StringComparisonExp>;
  table_handle?: InputMaybe<StringComparisonExp>;
  voter?: InputMaybe<StringComparisonExp>;
};

/** Ordering options when selecting data from "current_delegated_voter". */
export type CurrentDelegatedVoterOrderBy = {
  delegation_pool_address?: InputMaybe<OrderBy>;
  delegator_address?: InputMaybe<OrderBy>;
  last_transaction_timestamp?: InputMaybe<OrderBy>;
  last_transaction_version?: InputMaybe<OrderBy>;
  pending_voter?: InputMaybe<OrderBy>;
  table_handle?: InputMaybe<OrderBy>;
  voter?: InputMaybe<OrderBy>;
};

/** select columns of table "current_delegated_voter" */
export enum CurrentDelegatedVoterSelectColumn {
  /** column name */
  DelegationPoolAddress = "delegation_pool_address",
  /** column name */
  DelegatorAddress = "delegator_address",
  /** column name */
  LastTransactionTimestamp = "last_transaction_timestamp",
  /** column name */
  LastTransactionVersion = "last_transaction_version",
  /** column name */
  PendingVoter = "pending_voter",
  /** column name */
  TableHandle = "table_handle",
  /** column name */
  Voter = "voter",
}

/** Streaming cursor of the table "current_delegated_voter" */
export type CurrentDelegatedVoterStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: CurrentDelegatedVoterStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type CurrentDelegatedVoterStreamCursorValueInput = {
  delegation_pool_address?: InputMaybe<Scalars["String"]["input"]>;
  delegator_address?: InputMaybe<Scalars["String"]["input"]>;
  last_transaction_timestamp?: InputMaybe<Scalars["timestamp"]["input"]>;
  last_transaction_version?: InputMaybe<Scalars["bigint"]["input"]>;
  pending_voter?: InputMaybe<Scalars["String"]["input"]>;
  table_handle?: InputMaybe<Scalars["String"]["input"]>;
  voter?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "current_delegator_balances" */
export type CurrentDelegatorBalances = {
  /** An object relationship */
  current_pool_balance?: Maybe<CurrentDelegatedStakingPoolBalances>;
  delegator_address: Scalars["String"]["output"];
  last_transaction_version: Scalars["bigint"]["output"];
  parent_table_handle: Scalars["String"]["output"];
  pool_address: Scalars["String"]["output"];
  pool_type: Scalars["String"]["output"];
  shares: Scalars["numeric"]["output"];
  /** An object relationship */
  staking_pool_metadata?: Maybe<CurrentStakingPoolVoter>;
  table_handle: Scalars["String"]["output"];
};

/** Boolean expression to filter rows from the table "current_delegator_balances". All fields are combined with a logical 'AND'. */
export type CurrentDelegatorBalancesBoolExp = {
  _and?: InputMaybe<Array<CurrentDelegatorBalancesBoolExp>>;
  _not?: InputMaybe<CurrentDelegatorBalancesBoolExp>;
  _or?: InputMaybe<Array<CurrentDelegatorBalancesBoolExp>>;
  current_pool_balance?: InputMaybe<CurrentDelegatedStakingPoolBalancesBoolExp>;
  delegator_address?: InputMaybe<StringComparisonExp>;
  last_transaction_version?: InputMaybe<BigintComparisonExp>;
  parent_table_handle?: InputMaybe<StringComparisonExp>;
  pool_address?: InputMaybe<StringComparisonExp>;
  pool_type?: InputMaybe<StringComparisonExp>;
  shares?: InputMaybe<NumericComparisonExp>;
  staking_pool_metadata?: InputMaybe<CurrentStakingPoolVoterBoolExp>;
  table_handle?: InputMaybe<StringComparisonExp>;
};

/** Ordering options when selecting data from "current_delegator_balances". */
export type CurrentDelegatorBalancesOrderBy = {
  current_pool_balance?: InputMaybe<CurrentDelegatedStakingPoolBalancesOrderBy>;
  delegator_address?: InputMaybe<OrderBy>;
  last_transaction_version?: InputMaybe<OrderBy>;
  parent_table_handle?: InputMaybe<OrderBy>;
  pool_address?: InputMaybe<OrderBy>;
  pool_type?: InputMaybe<OrderBy>;
  shares?: InputMaybe<OrderBy>;
  staking_pool_metadata?: InputMaybe<CurrentStakingPoolVoterOrderBy>;
  table_handle?: InputMaybe<OrderBy>;
};

/** select columns of table "current_delegator_balances" */
export enum CurrentDelegatorBalancesSelectColumn {
  /** column name */
  DelegatorAddress = "delegator_address",
  /** column name */
  LastTransactionVersion = "last_transaction_version",
  /** column name */
  ParentTableHandle = "parent_table_handle",
  /** column name */
  PoolAddress = "pool_address",
  /** column name */
  PoolType = "pool_type",
  /** column name */
  Shares = "shares",
  /** column name */
  TableHandle = "table_handle",
}

/** Streaming cursor of the table "current_delegator_balances" */
export type CurrentDelegatorBalancesStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: CurrentDelegatorBalancesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type CurrentDelegatorBalancesStreamCursorValueInput = {
  delegator_address?: InputMaybe<Scalars["String"]["input"]>;
  last_transaction_version?: InputMaybe<Scalars["bigint"]["input"]>;
  parent_table_handle?: InputMaybe<Scalars["String"]["input"]>;
  pool_address?: InputMaybe<Scalars["String"]["input"]>;
  pool_type?: InputMaybe<Scalars["String"]["input"]>;
  shares?: InputMaybe<Scalars["numeric"]["input"]>;
  table_handle?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "current_fungible_asset_balances" */
export type CurrentFungibleAssetBalances = {
  amount: Scalars["numeric"]["output"];
  asset_type: Scalars["String"]["output"];
  is_frozen: Scalars["Boolean"]["output"];
  is_primary: Scalars["Boolean"]["output"];
  last_transaction_timestamp: Scalars["timestamp"]["output"];
  last_transaction_version: Scalars["bigint"]["output"];
  /** An object relationship */
  metadata?: Maybe<FungibleAssetMetadata>;
  owner_address: Scalars["String"]["output"];
  storage_id: Scalars["String"]["output"];
  token_standard: Scalars["String"]["output"];
};

/** aggregated selection of "current_fungible_asset_balances" */
export type CurrentFungibleAssetBalancesAggregate = {
  aggregate?: Maybe<CurrentFungibleAssetBalancesAggregateFields>;
  nodes: Array<CurrentFungibleAssetBalances>;
};

/** aggregate fields of "current_fungible_asset_balances" */
export type CurrentFungibleAssetBalancesAggregateFields = {
  avg?: Maybe<CurrentFungibleAssetBalancesAvgFields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<CurrentFungibleAssetBalancesMaxFields>;
  min?: Maybe<CurrentFungibleAssetBalancesMinFields>;
  stddev?: Maybe<CurrentFungibleAssetBalancesStddevFields>;
  stddev_pop?: Maybe<CurrentFungibleAssetBalancesStddevPopFields>;
  stddev_samp?: Maybe<CurrentFungibleAssetBalancesStddevSampFields>;
  sum?: Maybe<CurrentFungibleAssetBalancesSumFields>;
  var_pop?: Maybe<CurrentFungibleAssetBalancesVarPopFields>;
  var_samp?: Maybe<CurrentFungibleAssetBalancesVarSampFields>;
  variance?: Maybe<CurrentFungibleAssetBalancesVarianceFields>;
};

/** aggregate fields of "current_fungible_asset_balances" */
export type CurrentFungibleAssetBalancesAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<CurrentFungibleAssetBalancesSelectColumn>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** aggregate avg on columns */
export type CurrentFungibleAssetBalancesAvgFields = {
  amount?: Maybe<Scalars["Float"]["output"]>;
  last_transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** Boolean expression to filter rows from the table "current_fungible_asset_balances". All fields are combined with a logical 'AND'. */
export type CurrentFungibleAssetBalancesBoolExp = {
  _and?: InputMaybe<Array<CurrentFungibleAssetBalancesBoolExp>>;
  _not?: InputMaybe<CurrentFungibleAssetBalancesBoolExp>;
  _or?: InputMaybe<Array<CurrentFungibleAssetBalancesBoolExp>>;
  amount?: InputMaybe<NumericComparisonExp>;
  asset_type?: InputMaybe<StringComparisonExp>;
  is_frozen?: InputMaybe<BooleanComparisonExp>;
  is_primary?: InputMaybe<BooleanComparisonExp>;
  last_transaction_timestamp?: InputMaybe<TimestampComparisonExp>;
  last_transaction_version?: InputMaybe<BigintComparisonExp>;
  metadata?: InputMaybe<FungibleAssetMetadataBoolExp>;
  owner_address?: InputMaybe<StringComparisonExp>;
  storage_id?: InputMaybe<StringComparisonExp>;
  token_standard?: InputMaybe<StringComparisonExp>;
};

/** aggregate max on columns */
export type CurrentFungibleAssetBalancesMaxFields = {
  amount?: Maybe<Scalars["numeric"]["output"]>;
  asset_type?: Maybe<Scalars["String"]["output"]>;
  last_transaction_timestamp?: Maybe<Scalars["timestamp"]["output"]>;
  last_transaction_version?: Maybe<Scalars["bigint"]["output"]>;
  owner_address?: Maybe<Scalars["String"]["output"]>;
  storage_id?: Maybe<Scalars["String"]["output"]>;
  token_standard?: Maybe<Scalars["String"]["output"]>;
};

/** aggregate min on columns */
export type CurrentFungibleAssetBalancesMinFields = {
  amount?: Maybe<Scalars["numeric"]["output"]>;
  asset_type?: Maybe<Scalars["String"]["output"]>;
  last_transaction_timestamp?: Maybe<Scalars["timestamp"]["output"]>;
  last_transaction_version?: Maybe<Scalars["bigint"]["output"]>;
  owner_address?: Maybe<Scalars["String"]["output"]>;
  storage_id?: Maybe<Scalars["String"]["output"]>;
  token_standard?: Maybe<Scalars["String"]["output"]>;
};

/** Ordering options when selecting data from "current_fungible_asset_balances". */
export type CurrentFungibleAssetBalancesOrderBy = {
  amount?: InputMaybe<OrderBy>;
  asset_type?: InputMaybe<OrderBy>;
  is_frozen?: InputMaybe<OrderBy>;
  is_primary?: InputMaybe<OrderBy>;
  last_transaction_timestamp?: InputMaybe<OrderBy>;
  last_transaction_version?: InputMaybe<OrderBy>;
  metadata?: InputMaybe<FungibleAssetMetadataOrderBy>;
  owner_address?: InputMaybe<OrderBy>;
  storage_id?: InputMaybe<OrderBy>;
  token_standard?: InputMaybe<OrderBy>;
};

/** select columns of table "current_fungible_asset_balances" */
export enum CurrentFungibleAssetBalancesSelectColumn {
  /** column name */
  Amount = "amount",
  /** column name */
  AssetType = "asset_type",
  /** column name */
  IsFrozen = "is_frozen",
  /** column name */
  IsPrimary = "is_primary",
  /** column name */
  LastTransactionTimestamp = "last_transaction_timestamp",
  /** column name */
  LastTransactionVersion = "last_transaction_version",
  /** column name */
  OwnerAddress = "owner_address",
  /** column name */
  StorageId = "storage_id",
  /** column name */
  TokenStandard = "token_standard",
}

/** aggregate stddev on columns */
export type CurrentFungibleAssetBalancesStddevFields = {
  amount?: Maybe<Scalars["Float"]["output"]>;
  last_transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_pop on columns */
export type CurrentFungibleAssetBalancesStddevPopFields = {
  amount?: Maybe<Scalars["Float"]["output"]>;
  last_transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_samp on columns */
export type CurrentFungibleAssetBalancesStddevSampFields = {
  amount?: Maybe<Scalars["Float"]["output"]>;
  last_transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** Streaming cursor of the table "current_fungible_asset_balances" */
export type CurrentFungibleAssetBalancesStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: CurrentFungibleAssetBalancesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type CurrentFungibleAssetBalancesStreamCursorValueInput = {
  amount?: InputMaybe<Scalars["numeric"]["input"]>;
  asset_type?: InputMaybe<Scalars["String"]["input"]>;
  is_frozen?: InputMaybe<Scalars["Boolean"]["input"]>;
  is_primary?: InputMaybe<Scalars["Boolean"]["input"]>;
  last_transaction_timestamp?: InputMaybe<Scalars["timestamp"]["input"]>;
  last_transaction_version?: InputMaybe<Scalars["bigint"]["input"]>;
  owner_address?: InputMaybe<Scalars["String"]["input"]>;
  storage_id?: InputMaybe<Scalars["String"]["input"]>;
  token_standard?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregate sum on columns */
export type CurrentFungibleAssetBalancesSumFields = {
  amount?: Maybe<Scalars["numeric"]["output"]>;
  last_transaction_version?: Maybe<Scalars["bigint"]["output"]>;
};

/** aggregate var_pop on columns */
export type CurrentFungibleAssetBalancesVarPopFields = {
  amount?: Maybe<Scalars["Float"]["output"]>;
  last_transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate var_samp on columns */
export type CurrentFungibleAssetBalancesVarSampFields = {
  amount?: Maybe<Scalars["Float"]["output"]>;
  last_transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate variance on columns */
export type CurrentFungibleAssetBalancesVarianceFields = {
  amount?: Maybe<Scalars["Float"]["output"]>;
  last_transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** columns and relationships of "current_objects" */
export type CurrentObjects = {
  allow_ungated_transfer: Scalars["Boolean"]["output"];
  is_deleted: Scalars["Boolean"]["output"];
  last_guid_creation_num: Scalars["numeric"]["output"];
  last_transaction_version: Scalars["bigint"]["output"];
  object_address: Scalars["String"]["output"];
  owner_address: Scalars["String"]["output"];
  state_key_hash: Scalars["String"]["output"];
};

/** Boolean expression to filter rows from the table "current_objects". All fields are combined with a logical 'AND'. */
export type CurrentObjectsBoolExp = {
  _and?: InputMaybe<Array<CurrentObjectsBoolExp>>;
  _not?: InputMaybe<CurrentObjectsBoolExp>;
  _or?: InputMaybe<Array<CurrentObjectsBoolExp>>;
  allow_ungated_transfer?: InputMaybe<BooleanComparisonExp>;
  is_deleted?: InputMaybe<BooleanComparisonExp>;
  last_guid_creation_num?: InputMaybe<NumericComparisonExp>;
  last_transaction_version?: InputMaybe<BigintComparisonExp>;
  object_address?: InputMaybe<StringComparisonExp>;
  owner_address?: InputMaybe<StringComparisonExp>;
  state_key_hash?: InputMaybe<StringComparisonExp>;
};

/** Ordering options when selecting data from "current_objects". */
export type CurrentObjectsOrderBy = {
  allow_ungated_transfer?: InputMaybe<OrderBy>;
  is_deleted?: InputMaybe<OrderBy>;
  last_guid_creation_num?: InputMaybe<OrderBy>;
  last_transaction_version?: InputMaybe<OrderBy>;
  object_address?: InputMaybe<OrderBy>;
  owner_address?: InputMaybe<OrderBy>;
  state_key_hash?: InputMaybe<OrderBy>;
};

/** select columns of table "current_objects" */
export enum CurrentObjectsSelectColumn {
  /** column name */
  AllowUngatedTransfer = "allow_ungated_transfer",
  /** column name */
  IsDeleted = "is_deleted",
  /** column name */
  LastGuidCreationNum = "last_guid_creation_num",
  /** column name */
  LastTransactionVersion = "last_transaction_version",
  /** column name */
  ObjectAddress = "object_address",
  /** column name */
  OwnerAddress = "owner_address",
  /** column name */
  StateKeyHash = "state_key_hash",
}

/** Streaming cursor of the table "current_objects" */
export type CurrentObjectsStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: CurrentObjectsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type CurrentObjectsStreamCursorValueInput = {
  allow_ungated_transfer?: InputMaybe<Scalars["Boolean"]["input"]>;
  is_deleted?: InputMaybe<Scalars["Boolean"]["input"]>;
  last_guid_creation_num?: InputMaybe<Scalars["numeric"]["input"]>;
  last_transaction_version?: InputMaybe<Scalars["bigint"]["input"]>;
  object_address?: InputMaybe<Scalars["String"]["input"]>;
  owner_address?: InputMaybe<Scalars["String"]["input"]>;
  state_key_hash?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "current_staking_pool_voter" */
export type CurrentStakingPoolVoter = {
  last_transaction_version: Scalars["bigint"]["output"];
  operator_address: Scalars["String"]["output"];
  /** An array relationship */
  operator_aptos_name: Array<CurrentAptosNames>;
  /** An aggregate relationship */
  operator_aptos_name_aggregate: CurrentAptosNamesAggregate;
  staking_pool_address: Scalars["String"]["output"];
  voter_address: Scalars["String"]["output"];
};

/** columns and relationships of "current_staking_pool_voter" */
export type CurrentStakingPoolVoterOperatorAptosNameArgs = {
  distinct_on?: InputMaybe<Array<CurrentAptosNamesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentAptosNamesOrderBy>>;
  where?: InputMaybe<CurrentAptosNamesBoolExp>;
};

/** columns and relationships of "current_staking_pool_voter" */
export type CurrentStakingPoolVoterOperatorAptosNameAggregateArgs = {
  distinct_on?: InputMaybe<Array<CurrentAptosNamesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentAptosNamesOrderBy>>;
  where?: InputMaybe<CurrentAptosNamesBoolExp>;
};

/** Boolean expression to filter rows from the table "current_staking_pool_voter". All fields are combined with a logical 'AND'. */
export type CurrentStakingPoolVoterBoolExp = {
  _and?: InputMaybe<Array<CurrentStakingPoolVoterBoolExp>>;
  _not?: InputMaybe<CurrentStakingPoolVoterBoolExp>;
  _or?: InputMaybe<Array<CurrentStakingPoolVoterBoolExp>>;
  last_transaction_version?: InputMaybe<BigintComparisonExp>;
  operator_address?: InputMaybe<StringComparisonExp>;
  operator_aptos_name?: InputMaybe<CurrentAptosNamesBoolExp>;
  staking_pool_address?: InputMaybe<StringComparisonExp>;
  voter_address?: InputMaybe<StringComparisonExp>;
};

/** Ordering options when selecting data from "current_staking_pool_voter". */
export type CurrentStakingPoolVoterOrderBy = {
  last_transaction_version?: InputMaybe<OrderBy>;
  operator_address?: InputMaybe<OrderBy>;
  operator_aptos_name_aggregate?: InputMaybe<CurrentAptosNamesAggregateOrderBy>;
  staking_pool_address?: InputMaybe<OrderBy>;
  voter_address?: InputMaybe<OrderBy>;
};

/** select columns of table "current_staking_pool_voter" */
export enum CurrentStakingPoolVoterSelectColumn {
  /** column name */
  LastTransactionVersion = "last_transaction_version",
  /** column name */
  OperatorAddress = "operator_address",
  /** column name */
  StakingPoolAddress = "staking_pool_address",
  /** column name */
  VoterAddress = "voter_address",
}

/** Streaming cursor of the table "current_staking_pool_voter" */
export type CurrentStakingPoolVoterStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: CurrentStakingPoolVoterStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type CurrentStakingPoolVoterStreamCursorValueInput = {
  last_transaction_version?: InputMaybe<Scalars["bigint"]["input"]>;
  operator_address?: InputMaybe<Scalars["String"]["input"]>;
  staking_pool_address?: InputMaybe<Scalars["String"]["input"]>;
  voter_address?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "current_table_items" */
export type CurrentTableItems = {
  decoded_key: Scalars["jsonb"]["output"];
  decoded_value?: Maybe<Scalars["jsonb"]["output"]>;
  is_deleted: Scalars["Boolean"]["output"];
  key: Scalars["String"]["output"];
  key_hash: Scalars["String"]["output"];
  last_transaction_version: Scalars["bigint"]["output"];
  table_handle: Scalars["String"]["output"];
};

/** columns and relationships of "current_table_items" */
export type CurrentTableItemsDecodedKeyArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "current_table_items" */
export type CurrentTableItemsDecodedValueArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** Boolean expression to filter rows from the table "current_table_items". All fields are combined with a logical 'AND'. */
export type CurrentTableItemsBoolExp = {
  _and?: InputMaybe<Array<CurrentTableItemsBoolExp>>;
  _not?: InputMaybe<CurrentTableItemsBoolExp>;
  _or?: InputMaybe<Array<CurrentTableItemsBoolExp>>;
  decoded_key?: InputMaybe<JsonbComparisonExp>;
  decoded_value?: InputMaybe<JsonbComparisonExp>;
  is_deleted?: InputMaybe<BooleanComparisonExp>;
  key?: InputMaybe<StringComparisonExp>;
  key_hash?: InputMaybe<StringComparisonExp>;
  last_transaction_version?: InputMaybe<BigintComparisonExp>;
  table_handle?: InputMaybe<StringComparisonExp>;
};

/** Ordering options when selecting data from "current_table_items". */
export type CurrentTableItemsOrderBy = {
  decoded_key?: InputMaybe<OrderBy>;
  decoded_value?: InputMaybe<OrderBy>;
  is_deleted?: InputMaybe<OrderBy>;
  key?: InputMaybe<OrderBy>;
  key_hash?: InputMaybe<OrderBy>;
  last_transaction_version?: InputMaybe<OrderBy>;
  table_handle?: InputMaybe<OrderBy>;
};

/** select columns of table "current_table_items" */
export enum CurrentTableItemsSelectColumn {
  /** column name */
  DecodedKey = "decoded_key",
  /** column name */
  DecodedValue = "decoded_value",
  /** column name */
  IsDeleted = "is_deleted",
  /** column name */
  Key = "key",
  /** column name */
  KeyHash = "key_hash",
  /** column name */
  LastTransactionVersion = "last_transaction_version",
  /** column name */
  TableHandle = "table_handle",
}

/** Streaming cursor of the table "current_table_items" */
export type CurrentTableItemsStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: CurrentTableItemsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type CurrentTableItemsStreamCursorValueInput = {
  decoded_key?: InputMaybe<Scalars["jsonb"]["input"]>;
  decoded_value?: InputMaybe<Scalars["jsonb"]["input"]>;
  is_deleted?: InputMaybe<Scalars["Boolean"]["input"]>;
  key?: InputMaybe<Scalars["String"]["input"]>;
  key_hash?: InputMaybe<Scalars["String"]["input"]>;
  last_transaction_version?: InputMaybe<Scalars["bigint"]["input"]>;
  table_handle?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "current_token_datas" */
export type CurrentTokenDatas = {
  collection_data_id_hash: Scalars["String"]["output"];
  collection_name: Scalars["String"]["output"];
  creator_address: Scalars["String"]["output"];
  /** An object relationship */
  current_collection_data?: Maybe<CurrentCollectionDatas>;
  default_properties: Scalars["jsonb"]["output"];
  description: Scalars["String"]["output"];
  description_mutable: Scalars["Boolean"]["output"];
  largest_property_version: Scalars["numeric"]["output"];
  last_transaction_timestamp: Scalars["timestamp"]["output"];
  last_transaction_version: Scalars["bigint"]["output"];
  maximum: Scalars["numeric"]["output"];
  maximum_mutable: Scalars["Boolean"]["output"];
  metadata_uri: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
  payee_address: Scalars["String"]["output"];
  properties_mutable: Scalars["Boolean"]["output"];
  royalty_mutable: Scalars["Boolean"]["output"];
  royalty_points_denominator: Scalars["numeric"]["output"];
  royalty_points_numerator: Scalars["numeric"]["output"];
  supply: Scalars["numeric"]["output"];
  token_data_id_hash: Scalars["String"]["output"];
  uri_mutable: Scalars["Boolean"]["output"];
};

/** columns and relationships of "current_token_datas" */
export type CurrentTokenDatasDefaultPropertiesArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** Boolean expression to filter rows from the table "current_token_datas". All fields are combined with a logical 'AND'. */
export type CurrentTokenDatasBoolExp = {
  _and?: InputMaybe<Array<CurrentTokenDatasBoolExp>>;
  _not?: InputMaybe<CurrentTokenDatasBoolExp>;
  _or?: InputMaybe<Array<CurrentTokenDatasBoolExp>>;
  collection_data_id_hash?: InputMaybe<StringComparisonExp>;
  collection_name?: InputMaybe<StringComparisonExp>;
  creator_address?: InputMaybe<StringComparisonExp>;
  current_collection_data?: InputMaybe<CurrentCollectionDatasBoolExp>;
  default_properties?: InputMaybe<JsonbComparisonExp>;
  description?: InputMaybe<StringComparisonExp>;
  description_mutable?: InputMaybe<BooleanComparisonExp>;
  largest_property_version?: InputMaybe<NumericComparisonExp>;
  last_transaction_timestamp?: InputMaybe<TimestampComparisonExp>;
  last_transaction_version?: InputMaybe<BigintComparisonExp>;
  maximum?: InputMaybe<NumericComparisonExp>;
  maximum_mutable?: InputMaybe<BooleanComparisonExp>;
  metadata_uri?: InputMaybe<StringComparisonExp>;
  name?: InputMaybe<StringComparisonExp>;
  payee_address?: InputMaybe<StringComparisonExp>;
  properties_mutable?: InputMaybe<BooleanComparisonExp>;
  royalty_mutable?: InputMaybe<BooleanComparisonExp>;
  royalty_points_denominator?: InputMaybe<NumericComparisonExp>;
  royalty_points_numerator?: InputMaybe<NumericComparisonExp>;
  supply?: InputMaybe<NumericComparisonExp>;
  token_data_id_hash?: InputMaybe<StringComparisonExp>;
  uri_mutable?: InputMaybe<BooleanComparisonExp>;
};

/** Ordering options when selecting data from "current_token_datas". */
export type CurrentTokenDatasOrderBy = {
  collection_data_id_hash?: InputMaybe<OrderBy>;
  collection_name?: InputMaybe<OrderBy>;
  creator_address?: InputMaybe<OrderBy>;
  current_collection_data?: InputMaybe<CurrentCollectionDatasOrderBy>;
  default_properties?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  description_mutable?: InputMaybe<OrderBy>;
  largest_property_version?: InputMaybe<OrderBy>;
  last_transaction_timestamp?: InputMaybe<OrderBy>;
  last_transaction_version?: InputMaybe<OrderBy>;
  maximum?: InputMaybe<OrderBy>;
  maximum_mutable?: InputMaybe<OrderBy>;
  metadata_uri?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  payee_address?: InputMaybe<OrderBy>;
  properties_mutable?: InputMaybe<OrderBy>;
  royalty_mutable?: InputMaybe<OrderBy>;
  royalty_points_denominator?: InputMaybe<OrderBy>;
  royalty_points_numerator?: InputMaybe<OrderBy>;
  supply?: InputMaybe<OrderBy>;
  token_data_id_hash?: InputMaybe<OrderBy>;
  uri_mutable?: InputMaybe<OrderBy>;
};

/** select columns of table "current_token_datas" */
export enum CurrentTokenDatasSelectColumn {
  /** column name */
  CollectionDataIdHash = "collection_data_id_hash",
  /** column name */
  CollectionName = "collection_name",
  /** column name */
  CreatorAddress = "creator_address",
  /** column name */
  DefaultProperties = "default_properties",
  /** column name */
  Description = "description",
  /** column name */
  DescriptionMutable = "description_mutable",
  /** column name */
  LargestPropertyVersion = "largest_property_version",
  /** column name */
  LastTransactionTimestamp = "last_transaction_timestamp",
  /** column name */
  LastTransactionVersion = "last_transaction_version",
  /** column name */
  Maximum = "maximum",
  /** column name */
  MaximumMutable = "maximum_mutable",
  /** column name */
  MetadataUri = "metadata_uri",
  /** column name */
  Name = "name",
  /** column name */
  PayeeAddress = "payee_address",
  /** column name */
  PropertiesMutable = "properties_mutable",
  /** column name */
  RoyaltyMutable = "royalty_mutable",
  /** column name */
  RoyaltyPointsDenominator = "royalty_points_denominator",
  /** column name */
  RoyaltyPointsNumerator = "royalty_points_numerator",
  /** column name */
  Supply = "supply",
  /** column name */
  TokenDataIdHash = "token_data_id_hash",
  /** column name */
  UriMutable = "uri_mutable",
}

/** Streaming cursor of the table "current_token_datas" */
export type CurrentTokenDatasStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: CurrentTokenDatasStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type CurrentTokenDatasStreamCursorValueInput = {
  collection_data_id_hash?: InputMaybe<Scalars["String"]["input"]>;
  collection_name?: InputMaybe<Scalars["String"]["input"]>;
  creator_address?: InputMaybe<Scalars["String"]["input"]>;
  default_properties?: InputMaybe<Scalars["jsonb"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  description_mutable?: InputMaybe<Scalars["Boolean"]["input"]>;
  largest_property_version?: InputMaybe<Scalars["numeric"]["input"]>;
  last_transaction_timestamp?: InputMaybe<Scalars["timestamp"]["input"]>;
  last_transaction_version?: InputMaybe<Scalars["bigint"]["input"]>;
  maximum?: InputMaybe<Scalars["numeric"]["input"]>;
  maximum_mutable?: InputMaybe<Scalars["Boolean"]["input"]>;
  metadata_uri?: InputMaybe<Scalars["String"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  payee_address?: InputMaybe<Scalars["String"]["input"]>;
  properties_mutable?: InputMaybe<Scalars["Boolean"]["input"]>;
  royalty_mutable?: InputMaybe<Scalars["Boolean"]["input"]>;
  royalty_points_denominator?: InputMaybe<Scalars["numeric"]["input"]>;
  royalty_points_numerator?: InputMaybe<Scalars["numeric"]["input"]>;
  supply?: InputMaybe<Scalars["numeric"]["input"]>;
  token_data_id_hash?: InputMaybe<Scalars["String"]["input"]>;
  uri_mutable?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** columns and relationships of "current_token_datas_v2" */
export type CurrentTokenDatasV2 = {
  /** An object relationship */
  aptos_name?: Maybe<CurrentAptosNames>;
  /** An object relationship */
  cdn_asset_uris?: Maybe<NftMetadataCrawlerParsedAssetUris>;
  collection_id: Scalars["String"]["output"];
  /** An object relationship */
  current_collection?: Maybe<CurrentCollectionsV2>;
  /** An object relationship */
  current_token_ownership?: Maybe<CurrentTokenOwnershipsV2>;
  description: Scalars["String"]["output"];
  is_fungible_v2?: Maybe<Scalars["Boolean"]["output"]>;
  largest_property_version_v1?: Maybe<Scalars["numeric"]["output"]>;
  last_transaction_timestamp: Scalars["timestamp"]["output"];
  last_transaction_version: Scalars["bigint"]["output"];
  maximum?: Maybe<Scalars["numeric"]["output"]>;
  supply: Scalars["numeric"]["output"];
  token_data_id: Scalars["String"]["output"];
  token_name: Scalars["String"]["output"];
  token_properties: Scalars["jsonb"]["output"];
  token_standard: Scalars["String"]["output"];
  token_uri: Scalars["String"]["output"];
};

/** columns and relationships of "current_token_datas_v2" */
export type CurrentTokenDatasV2TokenPropertiesArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** Boolean expression to filter rows from the table "current_token_datas_v2". All fields are combined with a logical 'AND'. */
export type CurrentTokenDatasV2BoolExp = {
  _and?: InputMaybe<Array<CurrentTokenDatasV2BoolExp>>;
  _not?: InputMaybe<CurrentTokenDatasV2BoolExp>;
  _or?: InputMaybe<Array<CurrentTokenDatasV2BoolExp>>;
  aptos_name?: InputMaybe<CurrentAptosNamesBoolExp>;
  cdn_asset_uris?: InputMaybe<NftMetadataCrawlerParsedAssetUrisBoolExp>;
  collection_id?: InputMaybe<StringComparisonExp>;
  current_collection?: InputMaybe<CurrentCollectionsV2BoolExp>;
  current_token_ownership?: InputMaybe<CurrentTokenOwnershipsV2BoolExp>;
  description?: InputMaybe<StringComparisonExp>;
  is_fungible_v2?: InputMaybe<BooleanComparisonExp>;
  largest_property_version_v1?: InputMaybe<NumericComparisonExp>;
  last_transaction_timestamp?: InputMaybe<TimestampComparisonExp>;
  last_transaction_version?: InputMaybe<BigintComparisonExp>;
  maximum?: InputMaybe<NumericComparisonExp>;
  supply?: InputMaybe<NumericComparisonExp>;
  token_data_id?: InputMaybe<StringComparisonExp>;
  token_name?: InputMaybe<StringComparisonExp>;
  token_properties?: InputMaybe<JsonbComparisonExp>;
  token_standard?: InputMaybe<StringComparisonExp>;
  token_uri?: InputMaybe<StringComparisonExp>;
};

/** Ordering options when selecting data from "current_token_datas_v2". */
export type CurrentTokenDatasV2OrderBy = {
  aptos_name?: InputMaybe<CurrentAptosNamesOrderBy>;
  cdn_asset_uris?: InputMaybe<NftMetadataCrawlerParsedAssetUrisOrderBy>;
  collection_id?: InputMaybe<OrderBy>;
  current_collection?: InputMaybe<CurrentCollectionsV2OrderBy>;
  current_token_ownership?: InputMaybe<CurrentTokenOwnershipsV2OrderBy>;
  description?: InputMaybe<OrderBy>;
  is_fungible_v2?: InputMaybe<OrderBy>;
  largest_property_version_v1?: InputMaybe<OrderBy>;
  last_transaction_timestamp?: InputMaybe<OrderBy>;
  last_transaction_version?: InputMaybe<OrderBy>;
  maximum?: InputMaybe<OrderBy>;
  supply?: InputMaybe<OrderBy>;
  token_data_id?: InputMaybe<OrderBy>;
  token_name?: InputMaybe<OrderBy>;
  token_properties?: InputMaybe<OrderBy>;
  token_standard?: InputMaybe<OrderBy>;
  token_uri?: InputMaybe<OrderBy>;
};

/** select columns of table "current_token_datas_v2" */
export enum CurrentTokenDatasV2SelectColumn {
  /** column name */
  CollectionId = "collection_id",
  /** column name */
  Description = "description",
  /** column name */
  IsFungibleV2 = "is_fungible_v2",
  /** column name */
  LargestPropertyVersionV1 = "largest_property_version_v1",
  /** column name */
  LastTransactionTimestamp = "last_transaction_timestamp",
  /** column name */
  LastTransactionVersion = "last_transaction_version",
  /** column name */
  Maximum = "maximum",
  /** column name */
  Supply = "supply",
  /** column name */
  TokenDataId = "token_data_id",
  /** column name */
  TokenName = "token_name",
  /** column name */
  TokenProperties = "token_properties",
  /** column name */
  TokenStandard = "token_standard",
  /** column name */
  TokenUri = "token_uri",
}

/** Streaming cursor of the table "current_token_datas_v2" */
export type CurrentTokenDatasV2StreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: CurrentTokenDatasV2StreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type CurrentTokenDatasV2StreamCursorValueInput = {
  collection_id?: InputMaybe<Scalars["String"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  is_fungible_v2?: InputMaybe<Scalars["Boolean"]["input"]>;
  largest_property_version_v1?: InputMaybe<Scalars["numeric"]["input"]>;
  last_transaction_timestamp?: InputMaybe<Scalars["timestamp"]["input"]>;
  last_transaction_version?: InputMaybe<Scalars["bigint"]["input"]>;
  maximum?: InputMaybe<Scalars["numeric"]["input"]>;
  supply?: InputMaybe<Scalars["numeric"]["input"]>;
  token_data_id?: InputMaybe<Scalars["String"]["input"]>;
  token_name?: InputMaybe<Scalars["String"]["input"]>;
  token_properties?: InputMaybe<Scalars["jsonb"]["input"]>;
  token_standard?: InputMaybe<Scalars["String"]["input"]>;
  token_uri?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "current_token_ownerships" */
export type CurrentTokenOwnerships = {
  amount: Scalars["numeric"]["output"];
  /** An object relationship */
  aptos_name?: Maybe<CurrentAptosNames>;
  collection_data_id_hash: Scalars["String"]["output"];
  collection_name: Scalars["String"]["output"];
  creator_address: Scalars["String"]["output"];
  /** An object relationship */
  current_collection_data?: Maybe<CurrentCollectionDatas>;
  /** An object relationship */
  current_token_data?: Maybe<CurrentTokenDatas>;
  last_transaction_timestamp: Scalars["timestamp"]["output"];
  last_transaction_version: Scalars["bigint"]["output"];
  name: Scalars["String"]["output"];
  owner_address: Scalars["String"]["output"];
  property_version: Scalars["numeric"]["output"];
  table_type: Scalars["String"]["output"];
  token_data_id_hash: Scalars["String"]["output"];
  token_properties: Scalars["jsonb"]["output"];
};

/** columns and relationships of "current_token_ownerships" */
export type CurrentTokenOwnershipsTokenPropertiesArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregated selection of "current_token_ownerships" */
export type CurrentTokenOwnershipsAggregate = {
  aggregate?: Maybe<CurrentTokenOwnershipsAggregateFields>;
  nodes: Array<CurrentTokenOwnerships>;
};

/** aggregate fields of "current_token_ownerships" */
export type CurrentTokenOwnershipsAggregateFields = {
  avg?: Maybe<CurrentTokenOwnershipsAvgFields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<CurrentTokenOwnershipsMaxFields>;
  min?: Maybe<CurrentTokenOwnershipsMinFields>;
  stddev?: Maybe<CurrentTokenOwnershipsStddevFields>;
  stddev_pop?: Maybe<CurrentTokenOwnershipsStddevPopFields>;
  stddev_samp?: Maybe<CurrentTokenOwnershipsStddevSampFields>;
  sum?: Maybe<CurrentTokenOwnershipsSumFields>;
  var_pop?: Maybe<CurrentTokenOwnershipsVarPopFields>;
  var_samp?: Maybe<CurrentTokenOwnershipsVarSampFields>;
  variance?: Maybe<CurrentTokenOwnershipsVarianceFields>;
};

/** aggregate fields of "current_token_ownerships" */
export type CurrentTokenOwnershipsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<CurrentTokenOwnershipsSelectColumn>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "current_token_ownerships" */
export type CurrentTokenOwnershipsAggregateOrderBy = {
  avg?: InputMaybe<CurrentTokenOwnershipsAvgOrderBy>;
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<CurrentTokenOwnershipsMaxOrderBy>;
  min?: InputMaybe<CurrentTokenOwnershipsMinOrderBy>;
  stddev?: InputMaybe<CurrentTokenOwnershipsStddevOrderBy>;
  stddev_pop?: InputMaybe<CurrentTokenOwnershipsStddevPopOrderBy>;
  stddev_samp?: InputMaybe<CurrentTokenOwnershipsStddevSampOrderBy>;
  sum?: InputMaybe<CurrentTokenOwnershipsSumOrderBy>;
  var_pop?: InputMaybe<CurrentTokenOwnershipsVarPopOrderBy>;
  var_samp?: InputMaybe<CurrentTokenOwnershipsVarSampOrderBy>;
  variance?: InputMaybe<CurrentTokenOwnershipsVarianceOrderBy>;
};

/** aggregate avg on columns */
export type CurrentTokenOwnershipsAvgFields = {
  amount?: Maybe<Scalars["Float"]["output"]>;
  last_transaction_version?: Maybe<Scalars["Float"]["output"]>;
  property_version?: Maybe<Scalars["Float"]["output"]>;
};

/** order by avg() on columns of table "current_token_ownerships" */
export type CurrentTokenOwnershipsAvgOrderBy = {
  amount?: InputMaybe<OrderBy>;
  last_transaction_version?: InputMaybe<OrderBy>;
  property_version?: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "current_token_ownerships". All fields are combined with a logical 'AND'. */
export type CurrentTokenOwnershipsBoolExp = {
  _and?: InputMaybe<Array<CurrentTokenOwnershipsBoolExp>>;
  _not?: InputMaybe<CurrentTokenOwnershipsBoolExp>;
  _or?: InputMaybe<Array<CurrentTokenOwnershipsBoolExp>>;
  amount?: InputMaybe<NumericComparisonExp>;
  aptos_name?: InputMaybe<CurrentAptosNamesBoolExp>;
  collection_data_id_hash?: InputMaybe<StringComparisonExp>;
  collection_name?: InputMaybe<StringComparisonExp>;
  creator_address?: InputMaybe<StringComparisonExp>;
  current_collection_data?: InputMaybe<CurrentCollectionDatasBoolExp>;
  current_token_data?: InputMaybe<CurrentTokenDatasBoolExp>;
  last_transaction_timestamp?: InputMaybe<TimestampComparisonExp>;
  last_transaction_version?: InputMaybe<BigintComparisonExp>;
  name?: InputMaybe<StringComparisonExp>;
  owner_address?: InputMaybe<StringComparisonExp>;
  property_version?: InputMaybe<NumericComparisonExp>;
  table_type?: InputMaybe<StringComparisonExp>;
  token_data_id_hash?: InputMaybe<StringComparisonExp>;
  token_properties?: InputMaybe<JsonbComparisonExp>;
};

/** aggregate max on columns */
export type CurrentTokenOwnershipsMaxFields = {
  amount?: Maybe<Scalars["numeric"]["output"]>;
  collection_data_id_hash?: Maybe<Scalars["String"]["output"]>;
  collection_name?: Maybe<Scalars["String"]["output"]>;
  creator_address?: Maybe<Scalars["String"]["output"]>;
  last_transaction_timestamp?: Maybe<Scalars["timestamp"]["output"]>;
  last_transaction_version?: Maybe<Scalars["bigint"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
  owner_address?: Maybe<Scalars["String"]["output"]>;
  property_version?: Maybe<Scalars["numeric"]["output"]>;
  table_type?: Maybe<Scalars["String"]["output"]>;
  token_data_id_hash?: Maybe<Scalars["String"]["output"]>;
};

/** order by max() on columns of table "current_token_ownerships" */
export type CurrentTokenOwnershipsMaxOrderBy = {
  amount?: InputMaybe<OrderBy>;
  collection_data_id_hash?: InputMaybe<OrderBy>;
  collection_name?: InputMaybe<OrderBy>;
  creator_address?: InputMaybe<OrderBy>;
  last_transaction_timestamp?: InputMaybe<OrderBy>;
  last_transaction_version?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  owner_address?: InputMaybe<OrderBy>;
  property_version?: InputMaybe<OrderBy>;
  table_type?: InputMaybe<OrderBy>;
  token_data_id_hash?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type CurrentTokenOwnershipsMinFields = {
  amount?: Maybe<Scalars["numeric"]["output"]>;
  collection_data_id_hash?: Maybe<Scalars["String"]["output"]>;
  collection_name?: Maybe<Scalars["String"]["output"]>;
  creator_address?: Maybe<Scalars["String"]["output"]>;
  last_transaction_timestamp?: Maybe<Scalars["timestamp"]["output"]>;
  last_transaction_version?: Maybe<Scalars["bigint"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
  owner_address?: Maybe<Scalars["String"]["output"]>;
  property_version?: Maybe<Scalars["numeric"]["output"]>;
  table_type?: Maybe<Scalars["String"]["output"]>;
  token_data_id_hash?: Maybe<Scalars["String"]["output"]>;
};

/** order by min() on columns of table "current_token_ownerships" */
export type CurrentTokenOwnershipsMinOrderBy = {
  amount?: InputMaybe<OrderBy>;
  collection_data_id_hash?: InputMaybe<OrderBy>;
  collection_name?: InputMaybe<OrderBy>;
  creator_address?: InputMaybe<OrderBy>;
  last_transaction_timestamp?: InputMaybe<OrderBy>;
  last_transaction_version?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  owner_address?: InputMaybe<OrderBy>;
  property_version?: InputMaybe<OrderBy>;
  table_type?: InputMaybe<OrderBy>;
  token_data_id_hash?: InputMaybe<OrderBy>;
};

/** Ordering options when selecting data from "current_token_ownerships". */
export type CurrentTokenOwnershipsOrderBy = {
  amount?: InputMaybe<OrderBy>;
  aptos_name?: InputMaybe<CurrentAptosNamesOrderBy>;
  collection_data_id_hash?: InputMaybe<OrderBy>;
  collection_name?: InputMaybe<OrderBy>;
  creator_address?: InputMaybe<OrderBy>;
  current_collection_data?: InputMaybe<CurrentCollectionDatasOrderBy>;
  current_token_data?: InputMaybe<CurrentTokenDatasOrderBy>;
  last_transaction_timestamp?: InputMaybe<OrderBy>;
  last_transaction_version?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  owner_address?: InputMaybe<OrderBy>;
  property_version?: InputMaybe<OrderBy>;
  table_type?: InputMaybe<OrderBy>;
  token_data_id_hash?: InputMaybe<OrderBy>;
  token_properties?: InputMaybe<OrderBy>;
};

/** select columns of table "current_token_ownerships" */
export enum CurrentTokenOwnershipsSelectColumn {
  /** column name */
  Amount = "amount",
  /** column name */
  CollectionDataIdHash = "collection_data_id_hash",
  /** column name */
  CollectionName = "collection_name",
  /** column name */
  CreatorAddress = "creator_address",
  /** column name */
  LastTransactionTimestamp = "last_transaction_timestamp",
  /** column name */
  LastTransactionVersion = "last_transaction_version",
  /** column name */
  Name = "name",
  /** column name */
  OwnerAddress = "owner_address",
  /** column name */
  PropertyVersion = "property_version",
  /** column name */
  TableType = "table_type",
  /** column name */
  TokenDataIdHash = "token_data_id_hash",
  /** column name */
  TokenProperties = "token_properties",
}

/** aggregate stddev on columns */
export type CurrentTokenOwnershipsStddevFields = {
  amount?: Maybe<Scalars["Float"]["output"]>;
  last_transaction_version?: Maybe<Scalars["Float"]["output"]>;
  property_version?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev() on columns of table "current_token_ownerships" */
export type CurrentTokenOwnershipsStddevOrderBy = {
  amount?: InputMaybe<OrderBy>;
  last_transaction_version?: InputMaybe<OrderBy>;
  property_version?: InputMaybe<OrderBy>;
};

/** aggregate stddev_pop on columns */
export type CurrentTokenOwnershipsStddevPopFields = {
  amount?: Maybe<Scalars["Float"]["output"]>;
  last_transaction_version?: Maybe<Scalars["Float"]["output"]>;
  property_version?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_pop() on columns of table "current_token_ownerships" */
export type CurrentTokenOwnershipsStddevPopOrderBy = {
  amount?: InputMaybe<OrderBy>;
  last_transaction_version?: InputMaybe<OrderBy>;
  property_version?: InputMaybe<OrderBy>;
};

/** aggregate stddev_samp on columns */
export type CurrentTokenOwnershipsStddevSampFields = {
  amount?: Maybe<Scalars["Float"]["output"]>;
  last_transaction_version?: Maybe<Scalars["Float"]["output"]>;
  property_version?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_samp() on columns of table "current_token_ownerships" */
export type CurrentTokenOwnershipsStddevSampOrderBy = {
  amount?: InputMaybe<OrderBy>;
  last_transaction_version?: InputMaybe<OrderBy>;
  property_version?: InputMaybe<OrderBy>;
};

/** Streaming cursor of the table "current_token_ownerships" */
export type CurrentTokenOwnershipsStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: CurrentTokenOwnershipsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type CurrentTokenOwnershipsStreamCursorValueInput = {
  amount?: InputMaybe<Scalars["numeric"]["input"]>;
  collection_data_id_hash?: InputMaybe<Scalars["String"]["input"]>;
  collection_name?: InputMaybe<Scalars["String"]["input"]>;
  creator_address?: InputMaybe<Scalars["String"]["input"]>;
  last_transaction_timestamp?: InputMaybe<Scalars["timestamp"]["input"]>;
  last_transaction_version?: InputMaybe<Scalars["bigint"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  owner_address?: InputMaybe<Scalars["String"]["input"]>;
  property_version?: InputMaybe<Scalars["numeric"]["input"]>;
  table_type?: InputMaybe<Scalars["String"]["input"]>;
  token_data_id_hash?: InputMaybe<Scalars["String"]["input"]>;
  token_properties?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** aggregate sum on columns */
export type CurrentTokenOwnershipsSumFields = {
  amount?: Maybe<Scalars["numeric"]["output"]>;
  last_transaction_version?: Maybe<Scalars["bigint"]["output"]>;
  property_version?: Maybe<Scalars["numeric"]["output"]>;
};

/** order by sum() on columns of table "current_token_ownerships" */
export type CurrentTokenOwnershipsSumOrderBy = {
  amount?: InputMaybe<OrderBy>;
  last_transaction_version?: InputMaybe<OrderBy>;
  property_version?: InputMaybe<OrderBy>;
};

/** columns and relationships of "current_token_ownerships_v2" */
export type CurrentTokenOwnershipsV2 = {
  amount: Scalars["numeric"]["output"];
  /** An array relationship */
  composed_nfts: Array<CurrentTokenOwnershipsV2>;
  /** An aggregate relationship */
  composed_nfts_aggregate: CurrentTokenOwnershipsV2Aggregate;
  /** An object relationship */
  current_token_data?: Maybe<CurrentTokenDatasV2>;
  is_fungible_v2?: Maybe<Scalars["Boolean"]["output"]>;
  is_soulbound_v2?: Maybe<Scalars["Boolean"]["output"]>;
  last_transaction_timestamp: Scalars["timestamp"]["output"];
  last_transaction_version: Scalars["bigint"]["output"];
  owner_address: Scalars["String"]["output"];
  property_version_v1: Scalars["numeric"]["output"];
  storage_id: Scalars["String"]["output"];
  table_type_v1?: Maybe<Scalars["String"]["output"]>;
  token_data_id: Scalars["String"]["output"];
  token_properties_mutated_v1?: Maybe<Scalars["jsonb"]["output"]>;
  token_standard: Scalars["String"]["output"];
};

/** columns and relationships of "current_token_ownerships_v2" */
export type CurrentTokenOwnershipsV2ComposedNftsArgs = {
  distinct_on?: InputMaybe<Array<CurrentTokenOwnershipsV2SelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentTokenOwnershipsV2OrderBy>>;
  where?: InputMaybe<CurrentTokenOwnershipsV2BoolExp>;
};

/** columns and relationships of "current_token_ownerships_v2" */
export type CurrentTokenOwnershipsV2ComposedNftsAggregateArgs = {
  distinct_on?: InputMaybe<Array<CurrentTokenOwnershipsV2SelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentTokenOwnershipsV2OrderBy>>;
  where?: InputMaybe<CurrentTokenOwnershipsV2BoolExp>;
};

/** columns and relationships of "current_token_ownerships_v2" */
export type CurrentTokenOwnershipsV2TokenPropertiesMutatedV1Args = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregated selection of "current_token_ownerships_v2" */
export type CurrentTokenOwnershipsV2Aggregate = {
  aggregate?: Maybe<CurrentTokenOwnershipsV2AggregateFields>;
  nodes: Array<CurrentTokenOwnershipsV2>;
};

/** aggregate fields of "current_token_ownerships_v2" */
export type CurrentTokenOwnershipsV2AggregateFields = {
  avg?: Maybe<CurrentTokenOwnershipsV2AvgFields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<CurrentTokenOwnershipsV2MaxFields>;
  min?: Maybe<CurrentTokenOwnershipsV2MinFields>;
  stddev?: Maybe<CurrentTokenOwnershipsV2StddevFields>;
  stddev_pop?: Maybe<CurrentTokenOwnershipsV2StddevPopFields>;
  stddev_samp?: Maybe<CurrentTokenOwnershipsV2StddevSampFields>;
  sum?: Maybe<CurrentTokenOwnershipsV2SumFields>;
  var_pop?: Maybe<CurrentTokenOwnershipsV2VarPopFields>;
  var_samp?: Maybe<CurrentTokenOwnershipsV2VarSampFields>;
  variance?: Maybe<CurrentTokenOwnershipsV2VarianceFields>;
};

/** aggregate fields of "current_token_ownerships_v2" */
export type CurrentTokenOwnershipsV2AggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<CurrentTokenOwnershipsV2SelectColumn>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "current_token_ownerships_v2" */
export type CurrentTokenOwnershipsV2AggregateOrderBy = {
  avg?: InputMaybe<CurrentTokenOwnershipsV2AvgOrderBy>;
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<CurrentTokenOwnershipsV2MaxOrderBy>;
  min?: InputMaybe<CurrentTokenOwnershipsV2MinOrderBy>;
  stddev?: InputMaybe<CurrentTokenOwnershipsV2StddevOrderBy>;
  stddev_pop?: InputMaybe<CurrentTokenOwnershipsV2StddevPopOrderBy>;
  stddev_samp?: InputMaybe<CurrentTokenOwnershipsV2StddevSampOrderBy>;
  sum?: InputMaybe<CurrentTokenOwnershipsV2SumOrderBy>;
  var_pop?: InputMaybe<CurrentTokenOwnershipsV2VarPopOrderBy>;
  var_samp?: InputMaybe<CurrentTokenOwnershipsV2VarSampOrderBy>;
  variance?: InputMaybe<CurrentTokenOwnershipsV2VarianceOrderBy>;
};

/** aggregate avg on columns */
export type CurrentTokenOwnershipsV2AvgFields = {
  amount?: Maybe<Scalars["Float"]["output"]>;
  last_transaction_version?: Maybe<Scalars["Float"]["output"]>;
  property_version_v1?: Maybe<Scalars["Float"]["output"]>;
};

/** order by avg() on columns of table "current_token_ownerships_v2" */
export type CurrentTokenOwnershipsV2AvgOrderBy = {
  amount?: InputMaybe<OrderBy>;
  last_transaction_version?: InputMaybe<OrderBy>;
  property_version_v1?: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "current_token_ownerships_v2". All fields are combined with a logical 'AND'. */
export type CurrentTokenOwnershipsV2BoolExp = {
  _and?: InputMaybe<Array<CurrentTokenOwnershipsV2BoolExp>>;
  _not?: InputMaybe<CurrentTokenOwnershipsV2BoolExp>;
  _or?: InputMaybe<Array<CurrentTokenOwnershipsV2BoolExp>>;
  amount?: InputMaybe<NumericComparisonExp>;
  composed_nfts?: InputMaybe<CurrentTokenOwnershipsV2BoolExp>;
  current_token_data?: InputMaybe<CurrentTokenDatasV2BoolExp>;
  is_fungible_v2?: InputMaybe<BooleanComparisonExp>;
  is_soulbound_v2?: InputMaybe<BooleanComparisonExp>;
  last_transaction_timestamp?: InputMaybe<TimestampComparisonExp>;
  last_transaction_version?: InputMaybe<BigintComparisonExp>;
  owner_address?: InputMaybe<StringComparisonExp>;
  property_version_v1?: InputMaybe<NumericComparisonExp>;
  storage_id?: InputMaybe<StringComparisonExp>;
  table_type_v1?: InputMaybe<StringComparisonExp>;
  token_data_id?: InputMaybe<StringComparisonExp>;
  token_properties_mutated_v1?: InputMaybe<JsonbComparisonExp>;
  token_standard?: InputMaybe<StringComparisonExp>;
};

/** aggregate max on columns */
export type CurrentTokenOwnershipsV2MaxFields = {
  amount?: Maybe<Scalars["numeric"]["output"]>;
  last_transaction_timestamp?: Maybe<Scalars["timestamp"]["output"]>;
  last_transaction_version?: Maybe<Scalars["bigint"]["output"]>;
  owner_address?: Maybe<Scalars["String"]["output"]>;
  property_version_v1?: Maybe<Scalars["numeric"]["output"]>;
  storage_id?: Maybe<Scalars["String"]["output"]>;
  table_type_v1?: Maybe<Scalars["String"]["output"]>;
  token_data_id?: Maybe<Scalars["String"]["output"]>;
  token_standard?: Maybe<Scalars["String"]["output"]>;
};

/** order by max() on columns of table "current_token_ownerships_v2" */
export type CurrentTokenOwnershipsV2MaxOrderBy = {
  amount?: InputMaybe<OrderBy>;
  last_transaction_timestamp?: InputMaybe<OrderBy>;
  last_transaction_version?: InputMaybe<OrderBy>;
  owner_address?: InputMaybe<OrderBy>;
  property_version_v1?: InputMaybe<OrderBy>;
  storage_id?: InputMaybe<OrderBy>;
  table_type_v1?: InputMaybe<OrderBy>;
  token_data_id?: InputMaybe<OrderBy>;
  token_standard?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type CurrentTokenOwnershipsV2MinFields = {
  amount?: Maybe<Scalars["numeric"]["output"]>;
  last_transaction_timestamp?: Maybe<Scalars["timestamp"]["output"]>;
  last_transaction_version?: Maybe<Scalars["bigint"]["output"]>;
  owner_address?: Maybe<Scalars["String"]["output"]>;
  property_version_v1?: Maybe<Scalars["numeric"]["output"]>;
  storage_id?: Maybe<Scalars["String"]["output"]>;
  table_type_v1?: Maybe<Scalars["String"]["output"]>;
  token_data_id?: Maybe<Scalars["String"]["output"]>;
  token_standard?: Maybe<Scalars["String"]["output"]>;
};

/** order by min() on columns of table "current_token_ownerships_v2" */
export type CurrentTokenOwnershipsV2MinOrderBy = {
  amount?: InputMaybe<OrderBy>;
  last_transaction_timestamp?: InputMaybe<OrderBy>;
  last_transaction_version?: InputMaybe<OrderBy>;
  owner_address?: InputMaybe<OrderBy>;
  property_version_v1?: InputMaybe<OrderBy>;
  storage_id?: InputMaybe<OrderBy>;
  table_type_v1?: InputMaybe<OrderBy>;
  token_data_id?: InputMaybe<OrderBy>;
  token_standard?: InputMaybe<OrderBy>;
};

/** Ordering options when selecting data from "current_token_ownerships_v2". */
export type CurrentTokenOwnershipsV2OrderBy = {
  amount?: InputMaybe<OrderBy>;
  composed_nfts_aggregate?: InputMaybe<CurrentTokenOwnershipsV2AggregateOrderBy>;
  current_token_data?: InputMaybe<CurrentTokenDatasV2OrderBy>;
  is_fungible_v2?: InputMaybe<OrderBy>;
  is_soulbound_v2?: InputMaybe<OrderBy>;
  last_transaction_timestamp?: InputMaybe<OrderBy>;
  last_transaction_version?: InputMaybe<OrderBy>;
  owner_address?: InputMaybe<OrderBy>;
  property_version_v1?: InputMaybe<OrderBy>;
  storage_id?: InputMaybe<OrderBy>;
  table_type_v1?: InputMaybe<OrderBy>;
  token_data_id?: InputMaybe<OrderBy>;
  token_properties_mutated_v1?: InputMaybe<OrderBy>;
  token_standard?: InputMaybe<OrderBy>;
};

/** select columns of table "current_token_ownerships_v2" */
export enum CurrentTokenOwnershipsV2SelectColumn {
  /** column name */
  Amount = "amount",
  /** column name */
  IsFungibleV2 = "is_fungible_v2",
  /** column name */
  IsSoulboundV2 = "is_soulbound_v2",
  /** column name */
  LastTransactionTimestamp = "last_transaction_timestamp",
  /** column name */
  LastTransactionVersion = "last_transaction_version",
  /** column name */
  OwnerAddress = "owner_address",
  /** column name */
  PropertyVersionV1 = "property_version_v1",
  /** column name */
  StorageId = "storage_id",
  /** column name */
  TableTypeV1 = "table_type_v1",
  /** column name */
  TokenDataId = "token_data_id",
  /** column name */
  TokenPropertiesMutatedV1 = "token_properties_mutated_v1",
  /** column name */
  TokenStandard = "token_standard",
}

/** aggregate stddev on columns */
export type CurrentTokenOwnershipsV2StddevFields = {
  amount?: Maybe<Scalars["Float"]["output"]>;
  last_transaction_version?: Maybe<Scalars["Float"]["output"]>;
  property_version_v1?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev() on columns of table "current_token_ownerships_v2" */
export type CurrentTokenOwnershipsV2StddevOrderBy = {
  amount?: InputMaybe<OrderBy>;
  last_transaction_version?: InputMaybe<OrderBy>;
  property_version_v1?: InputMaybe<OrderBy>;
};

/** aggregate stddev_pop on columns */
export type CurrentTokenOwnershipsV2StddevPopFields = {
  amount?: Maybe<Scalars["Float"]["output"]>;
  last_transaction_version?: Maybe<Scalars["Float"]["output"]>;
  property_version_v1?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_pop() on columns of table "current_token_ownerships_v2" */
export type CurrentTokenOwnershipsV2StddevPopOrderBy = {
  amount?: InputMaybe<OrderBy>;
  last_transaction_version?: InputMaybe<OrderBy>;
  property_version_v1?: InputMaybe<OrderBy>;
};

/** aggregate stddev_samp on columns */
export type CurrentTokenOwnershipsV2StddevSampFields = {
  amount?: Maybe<Scalars["Float"]["output"]>;
  last_transaction_version?: Maybe<Scalars["Float"]["output"]>;
  property_version_v1?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_samp() on columns of table "current_token_ownerships_v2" */
export type CurrentTokenOwnershipsV2StddevSampOrderBy = {
  amount?: InputMaybe<OrderBy>;
  last_transaction_version?: InputMaybe<OrderBy>;
  property_version_v1?: InputMaybe<OrderBy>;
};

/** Streaming cursor of the table "current_token_ownerships_v2" */
export type CurrentTokenOwnershipsV2StreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: CurrentTokenOwnershipsV2StreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type CurrentTokenOwnershipsV2StreamCursorValueInput = {
  amount?: InputMaybe<Scalars["numeric"]["input"]>;
  is_fungible_v2?: InputMaybe<Scalars["Boolean"]["input"]>;
  is_soulbound_v2?: InputMaybe<Scalars["Boolean"]["input"]>;
  last_transaction_timestamp?: InputMaybe<Scalars["timestamp"]["input"]>;
  last_transaction_version?: InputMaybe<Scalars["bigint"]["input"]>;
  owner_address?: InputMaybe<Scalars["String"]["input"]>;
  property_version_v1?: InputMaybe<Scalars["numeric"]["input"]>;
  storage_id?: InputMaybe<Scalars["String"]["input"]>;
  table_type_v1?: InputMaybe<Scalars["String"]["input"]>;
  token_data_id?: InputMaybe<Scalars["String"]["input"]>;
  token_properties_mutated_v1?: InputMaybe<Scalars["jsonb"]["input"]>;
  token_standard?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregate sum on columns */
export type CurrentTokenOwnershipsV2SumFields = {
  amount?: Maybe<Scalars["numeric"]["output"]>;
  last_transaction_version?: Maybe<Scalars["bigint"]["output"]>;
  property_version_v1?: Maybe<Scalars["numeric"]["output"]>;
};

/** order by sum() on columns of table "current_token_ownerships_v2" */
export type CurrentTokenOwnershipsV2SumOrderBy = {
  amount?: InputMaybe<OrderBy>;
  last_transaction_version?: InputMaybe<OrderBy>;
  property_version_v1?: InputMaybe<OrderBy>;
};

/** aggregate var_pop on columns */
export type CurrentTokenOwnershipsV2VarPopFields = {
  amount?: Maybe<Scalars["Float"]["output"]>;
  last_transaction_version?: Maybe<Scalars["Float"]["output"]>;
  property_version_v1?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_pop() on columns of table "current_token_ownerships_v2" */
export type CurrentTokenOwnershipsV2VarPopOrderBy = {
  amount?: InputMaybe<OrderBy>;
  last_transaction_version?: InputMaybe<OrderBy>;
  property_version_v1?: InputMaybe<OrderBy>;
};

/** aggregate var_samp on columns */
export type CurrentTokenOwnershipsV2VarSampFields = {
  amount?: Maybe<Scalars["Float"]["output"]>;
  last_transaction_version?: Maybe<Scalars["Float"]["output"]>;
  property_version_v1?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_samp() on columns of table "current_token_ownerships_v2" */
export type CurrentTokenOwnershipsV2VarSampOrderBy = {
  amount?: InputMaybe<OrderBy>;
  last_transaction_version?: InputMaybe<OrderBy>;
  property_version_v1?: InputMaybe<OrderBy>;
};

/** aggregate variance on columns */
export type CurrentTokenOwnershipsV2VarianceFields = {
  amount?: Maybe<Scalars["Float"]["output"]>;
  last_transaction_version?: Maybe<Scalars["Float"]["output"]>;
  property_version_v1?: Maybe<Scalars["Float"]["output"]>;
};

/** order by variance() on columns of table "current_token_ownerships_v2" */
export type CurrentTokenOwnershipsV2VarianceOrderBy = {
  amount?: InputMaybe<OrderBy>;
  last_transaction_version?: InputMaybe<OrderBy>;
  property_version_v1?: InputMaybe<OrderBy>;
};

/** aggregate var_pop on columns */
export type CurrentTokenOwnershipsVarPopFields = {
  amount?: Maybe<Scalars["Float"]["output"]>;
  last_transaction_version?: Maybe<Scalars["Float"]["output"]>;
  property_version?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_pop() on columns of table "current_token_ownerships" */
export type CurrentTokenOwnershipsVarPopOrderBy = {
  amount?: InputMaybe<OrderBy>;
  last_transaction_version?: InputMaybe<OrderBy>;
  property_version?: InputMaybe<OrderBy>;
};

/** aggregate var_samp on columns */
export type CurrentTokenOwnershipsVarSampFields = {
  amount?: Maybe<Scalars["Float"]["output"]>;
  last_transaction_version?: Maybe<Scalars["Float"]["output"]>;
  property_version?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_samp() on columns of table "current_token_ownerships" */
export type CurrentTokenOwnershipsVarSampOrderBy = {
  amount?: InputMaybe<OrderBy>;
  last_transaction_version?: InputMaybe<OrderBy>;
  property_version?: InputMaybe<OrderBy>;
};

/** aggregate variance on columns */
export type CurrentTokenOwnershipsVarianceFields = {
  amount?: Maybe<Scalars["Float"]["output"]>;
  last_transaction_version?: Maybe<Scalars["Float"]["output"]>;
  property_version?: Maybe<Scalars["Float"]["output"]>;
};

/** order by variance() on columns of table "current_token_ownerships" */
export type CurrentTokenOwnershipsVarianceOrderBy = {
  amount?: InputMaybe<OrderBy>;
  last_transaction_version?: InputMaybe<OrderBy>;
  property_version?: InputMaybe<OrderBy>;
};

/** columns and relationships of "current_token_pending_claims" */
export type CurrentTokenPendingClaims = {
  amount: Scalars["numeric"]["output"];
  collection_data_id_hash: Scalars["String"]["output"];
  collection_id: Scalars["String"]["output"];
  collection_name: Scalars["String"]["output"];
  creator_address: Scalars["String"]["output"];
  /** An object relationship */
  current_collection_data?: Maybe<CurrentCollectionDatas>;
  /** An object relationship */
  current_collection_v2?: Maybe<CurrentCollectionsV2>;
  /** An object relationship */
  current_token_data?: Maybe<CurrentTokenDatas>;
  /** An object relationship */
  current_token_data_v2?: Maybe<CurrentTokenDatasV2>;
  from_address: Scalars["String"]["output"];
  last_transaction_timestamp: Scalars["timestamp"]["output"];
  last_transaction_version: Scalars["bigint"]["output"];
  name: Scalars["String"]["output"];
  property_version: Scalars["numeric"]["output"];
  table_handle: Scalars["String"]["output"];
  to_address: Scalars["String"]["output"];
  /** An object relationship */
  token?: Maybe<Tokens>;
  token_data_id: Scalars["String"]["output"];
  token_data_id_hash: Scalars["String"]["output"];
};

/** Boolean expression to filter rows from the table "current_token_pending_claims". All fields are combined with a logical 'AND'. */
export type CurrentTokenPendingClaimsBoolExp = {
  _and?: InputMaybe<Array<CurrentTokenPendingClaimsBoolExp>>;
  _not?: InputMaybe<CurrentTokenPendingClaimsBoolExp>;
  _or?: InputMaybe<Array<CurrentTokenPendingClaimsBoolExp>>;
  amount?: InputMaybe<NumericComparisonExp>;
  collection_data_id_hash?: InputMaybe<StringComparisonExp>;
  collection_id?: InputMaybe<StringComparisonExp>;
  collection_name?: InputMaybe<StringComparisonExp>;
  creator_address?: InputMaybe<StringComparisonExp>;
  current_collection_data?: InputMaybe<CurrentCollectionDatasBoolExp>;
  current_collection_v2?: InputMaybe<CurrentCollectionsV2BoolExp>;
  current_token_data?: InputMaybe<CurrentTokenDatasBoolExp>;
  current_token_data_v2?: InputMaybe<CurrentTokenDatasV2BoolExp>;
  from_address?: InputMaybe<StringComparisonExp>;
  last_transaction_timestamp?: InputMaybe<TimestampComparisonExp>;
  last_transaction_version?: InputMaybe<BigintComparisonExp>;
  name?: InputMaybe<StringComparisonExp>;
  property_version?: InputMaybe<NumericComparisonExp>;
  table_handle?: InputMaybe<StringComparisonExp>;
  to_address?: InputMaybe<StringComparisonExp>;
  token?: InputMaybe<TokensBoolExp>;
  token_data_id?: InputMaybe<StringComparisonExp>;
  token_data_id_hash?: InputMaybe<StringComparisonExp>;
};

/** Ordering options when selecting data from "current_token_pending_claims". */
export type CurrentTokenPendingClaimsOrderBy = {
  amount?: InputMaybe<OrderBy>;
  collection_data_id_hash?: InputMaybe<OrderBy>;
  collection_id?: InputMaybe<OrderBy>;
  collection_name?: InputMaybe<OrderBy>;
  creator_address?: InputMaybe<OrderBy>;
  current_collection_data?: InputMaybe<CurrentCollectionDatasOrderBy>;
  current_collection_v2?: InputMaybe<CurrentCollectionsV2OrderBy>;
  current_token_data?: InputMaybe<CurrentTokenDatasOrderBy>;
  current_token_data_v2?: InputMaybe<CurrentTokenDatasV2OrderBy>;
  from_address?: InputMaybe<OrderBy>;
  last_transaction_timestamp?: InputMaybe<OrderBy>;
  last_transaction_version?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  property_version?: InputMaybe<OrderBy>;
  table_handle?: InputMaybe<OrderBy>;
  to_address?: InputMaybe<OrderBy>;
  token?: InputMaybe<TokensOrderBy>;
  token_data_id?: InputMaybe<OrderBy>;
  token_data_id_hash?: InputMaybe<OrderBy>;
};

/** select columns of table "current_token_pending_claims" */
export enum CurrentTokenPendingClaimsSelectColumn {
  /** column name */
  Amount = "amount",
  /** column name */
  CollectionDataIdHash = "collection_data_id_hash",
  /** column name */
  CollectionId = "collection_id",
  /** column name */
  CollectionName = "collection_name",
  /** column name */
  CreatorAddress = "creator_address",
  /** column name */
  FromAddress = "from_address",
  /** column name */
  LastTransactionTimestamp = "last_transaction_timestamp",
  /** column name */
  LastTransactionVersion = "last_transaction_version",
  /** column name */
  Name = "name",
  /** column name */
  PropertyVersion = "property_version",
  /** column name */
  TableHandle = "table_handle",
  /** column name */
  ToAddress = "to_address",
  /** column name */
  TokenDataId = "token_data_id",
  /** column name */
  TokenDataIdHash = "token_data_id_hash",
}

/** Streaming cursor of the table "current_token_pending_claims" */
export type CurrentTokenPendingClaimsStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: CurrentTokenPendingClaimsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type CurrentTokenPendingClaimsStreamCursorValueInput = {
  amount?: InputMaybe<Scalars["numeric"]["input"]>;
  collection_data_id_hash?: InputMaybe<Scalars["String"]["input"]>;
  collection_id?: InputMaybe<Scalars["String"]["input"]>;
  collection_name?: InputMaybe<Scalars["String"]["input"]>;
  creator_address?: InputMaybe<Scalars["String"]["input"]>;
  from_address?: InputMaybe<Scalars["String"]["input"]>;
  last_transaction_timestamp?: InputMaybe<Scalars["timestamp"]["input"]>;
  last_transaction_version?: InputMaybe<Scalars["bigint"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  property_version?: InputMaybe<Scalars["numeric"]["input"]>;
  table_handle?: InputMaybe<Scalars["String"]["input"]>;
  to_address?: InputMaybe<Scalars["String"]["input"]>;
  token_data_id?: InputMaybe<Scalars["String"]["input"]>;
  token_data_id_hash?: InputMaybe<Scalars["String"]["input"]>;
};

/** ordering argument of a cursor */
export enum CursorOrdering {
  /** ascending ordering of the cursor */
  Asc = "ASC",
  /** descending ordering of the cursor */
  Desc = "DESC",
}

/** columns and relationships of "delegated_staking_activities" */
export type DelegatedStakingActivities = {
  amount: Scalars["numeric"]["output"];
  delegator_address: Scalars["String"]["output"];
  event_index: Scalars["bigint"]["output"];
  event_type: Scalars["String"]["output"];
  pool_address: Scalars["String"]["output"];
  transaction_version: Scalars["bigint"]["output"];
};

/** order by aggregate values of table "delegated_staking_activities" */
export type DelegatedStakingActivitiesAggregateOrderBy = {
  avg?: InputMaybe<DelegatedStakingActivitiesAvgOrderBy>;
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<DelegatedStakingActivitiesMaxOrderBy>;
  min?: InputMaybe<DelegatedStakingActivitiesMinOrderBy>;
  stddev?: InputMaybe<DelegatedStakingActivitiesStddevOrderBy>;
  stddev_pop?: InputMaybe<DelegatedStakingActivitiesStddevPopOrderBy>;
  stddev_samp?: InputMaybe<DelegatedStakingActivitiesStddevSampOrderBy>;
  sum?: InputMaybe<DelegatedStakingActivitiesSumOrderBy>;
  var_pop?: InputMaybe<DelegatedStakingActivitiesVarPopOrderBy>;
  var_samp?: InputMaybe<DelegatedStakingActivitiesVarSampOrderBy>;
  variance?: InputMaybe<DelegatedStakingActivitiesVarianceOrderBy>;
};

/** order by avg() on columns of table "delegated_staking_activities" */
export type DelegatedStakingActivitiesAvgOrderBy = {
  amount?: InputMaybe<OrderBy>;
  event_index?: InputMaybe<OrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "delegated_staking_activities". All fields are combined with a logical 'AND'. */
export type DelegatedStakingActivitiesBoolExp = {
  _and?: InputMaybe<Array<DelegatedStakingActivitiesBoolExp>>;
  _not?: InputMaybe<DelegatedStakingActivitiesBoolExp>;
  _or?: InputMaybe<Array<DelegatedStakingActivitiesBoolExp>>;
  amount?: InputMaybe<NumericComparisonExp>;
  delegator_address?: InputMaybe<StringComparisonExp>;
  event_index?: InputMaybe<BigintComparisonExp>;
  event_type?: InputMaybe<StringComparisonExp>;
  pool_address?: InputMaybe<StringComparisonExp>;
  transaction_version?: InputMaybe<BigintComparisonExp>;
};

/** order by max() on columns of table "delegated_staking_activities" */
export type DelegatedStakingActivitiesMaxOrderBy = {
  amount?: InputMaybe<OrderBy>;
  delegator_address?: InputMaybe<OrderBy>;
  event_index?: InputMaybe<OrderBy>;
  event_type?: InputMaybe<OrderBy>;
  pool_address?: InputMaybe<OrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
};

/** order by min() on columns of table "delegated_staking_activities" */
export type DelegatedStakingActivitiesMinOrderBy = {
  amount?: InputMaybe<OrderBy>;
  delegator_address?: InputMaybe<OrderBy>;
  event_index?: InputMaybe<OrderBy>;
  event_type?: InputMaybe<OrderBy>;
  pool_address?: InputMaybe<OrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
};

/** Ordering options when selecting data from "delegated_staking_activities". */
export type DelegatedStakingActivitiesOrderBy = {
  amount?: InputMaybe<OrderBy>;
  delegator_address?: InputMaybe<OrderBy>;
  event_index?: InputMaybe<OrderBy>;
  event_type?: InputMaybe<OrderBy>;
  pool_address?: InputMaybe<OrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
};

/** select columns of table "delegated_staking_activities" */
export enum DelegatedStakingActivitiesSelectColumn {
  /** column name */
  Amount = "amount",
  /** column name */
  DelegatorAddress = "delegator_address",
  /** column name */
  EventIndex = "event_index",
  /** column name */
  EventType = "event_type",
  /** column name */
  PoolAddress = "pool_address",
  /** column name */
  TransactionVersion = "transaction_version",
}

/** order by stddev() on columns of table "delegated_staking_activities" */
export type DelegatedStakingActivitiesStddevOrderBy = {
  amount?: InputMaybe<OrderBy>;
  event_index?: InputMaybe<OrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
};

/** order by stddev_pop() on columns of table "delegated_staking_activities" */
export type DelegatedStakingActivitiesStddevPopOrderBy = {
  amount?: InputMaybe<OrderBy>;
  event_index?: InputMaybe<OrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
};

/** order by stddev_samp() on columns of table "delegated_staking_activities" */
export type DelegatedStakingActivitiesStddevSampOrderBy = {
  amount?: InputMaybe<OrderBy>;
  event_index?: InputMaybe<OrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
};

/** Streaming cursor of the table "delegated_staking_activities" */
export type DelegatedStakingActivitiesStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: DelegatedStakingActivitiesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type DelegatedStakingActivitiesStreamCursorValueInput = {
  amount?: InputMaybe<Scalars["numeric"]["input"]>;
  delegator_address?: InputMaybe<Scalars["String"]["input"]>;
  event_index?: InputMaybe<Scalars["bigint"]["input"]>;
  event_type?: InputMaybe<Scalars["String"]["input"]>;
  pool_address?: InputMaybe<Scalars["String"]["input"]>;
  transaction_version?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** order by sum() on columns of table "delegated_staking_activities" */
export type DelegatedStakingActivitiesSumOrderBy = {
  amount?: InputMaybe<OrderBy>;
  event_index?: InputMaybe<OrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
};

/** order by var_pop() on columns of table "delegated_staking_activities" */
export type DelegatedStakingActivitiesVarPopOrderBy = {
  amount?: InputMaybe<OrderBy>;
  event_index?: InputMaybe<OrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
};

/** order by var_samp() on columns of table "delegated_staking_activities" */
export type DelegatedStakingActivitiesVarSampOrderBy = {
  amount?: InputMaybe<OrderBy>;
  event_index?: InputMaybe<OrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
};

/** order by variance() on columns of table "delegated_staking_activities" */
export type DelegatedStakingActivitiesVarianceOrderBy = {
  amount?: InputMaybe<OrderBy>;
  event_index?: InputMaybe<OrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
};

/** columns and relationships of "delegated_staking_pools" */
export type DelegatedStakingPools = {
  /** An object relationship */
  current_staking_pool?: Maybe<CurrentStakingPoolVoter>;
  first_transaction_version: Scalars["bigint"]["output"];
  staking_pool_address: Scalars["String"]["output"];
};

/** Boolean expression to filter rows from the table "delegated_staking_pools". All fields are combined with a logical 'AND'. */
export type DelegatedStakingPoolsBoolExp = {
  _and?: InputMaybe<Array<DelegatedStakingPoolsBoolExp>>;
  _not?: InputMaybe<DelegatedStakingPoolsBoolExp>;
  _or?: InputMaybe<Array<DelegatedStakingPoolsBoolExp>>;
  current_staking_pool?: InputMaybe<CurrentStakingPoolVoterBoolExp>;
  first_transaction_version?: InputMaybe<BigintComparisonExp>;
  staking_pool_address?: InputMaybe<StringComparisonExp>;
};

/** Ordering options when selecting data from "delegated_staking_pools". */
export type DelegatedStakingPoolsOrderBy = {
  current_staking_pool?: InputMaybe<CurrentStakingPoolVoterOrderBy>;
  first_transaction_version?: InputMaybe<OrderBy>;
  staking_pool_address?: InputMaybe<OrderBy>;
};

/** select columns of table "delegated_staking_pools" */
export enum DelegatedStakingPoolsSelectColumn {
  /** column name */
  FirstTransactionVersion = "first_transaction_version",
  /** column name */
  StakingPoolAddress = "staking_pool_address",
}

/** Streaming cursor of the table "delegated_staking_pools" */
export type DelegatedStakingPoolsStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: DelegatedStakingPoolsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type DelegatedStakingPoolsStreamCursorValueInput = {
  first_transaction_version?: InputMaybe<Scalars["bigint"]["input"]>;
  staking_pool_address?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "delegator_distinct_pool" */
export type DelegatorDistinctPool = {
  /** An object relationship */
  current_pool_balance?: Maybe<CurrentDelegatedStakingPoolBalances>;
  delegator_address?: Maybe<Scalars["String"]["output"]>;
  pool_address?: Maybe<Scalars["String"]["output"]>;
  /** An object relationship */
  staking_pool_metadata?: Maybe<CurrentStakingPoolVoter>;
};

/** aggregated selection of "delegator_distinct_pool" */
export type DelegatorDistinctPoolAggregate = {
  aggregate?: Maybe<DelegatorDistinctPoolAggregateFields>;
  nodes: Array<DelegatorDistinctPool>;
};

/** aggregate fields of "delegator_distinct_pool" */
export type DelegatorDistinctPoolAggregateFields = {
  count: Scalars["Int"]["output"];
  max?: Maybe<DelegatorDistinctPoolMaxFields>;
  min?: Maybe<DelegatorDistinctPoolMinFields>;
};

/** aggregate fields of "delegator_distinct_pool" */
export type DelegatorDistinctPoolAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<DelegatorDistinctPoolSelectColumn>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** Boolean expression to filter rows from the table "delegator_distinct_pool". All fields are combined with a logical 'AND'. */
export type DelegatorDistinctPoolBoolExp = {
  _and?: InputMaybe<Array<DelegatorDistinctPoolBoolExp>>;
  _not?: InputMaybe<DelegatorDistinctPoolBoolExp>;
  _or?: InputMaybe<Array<DelegatorDistinctPoolBoolExp>>;
  current_pool_balance?: InputMaybe<CurrentDelegatedStakingPoolBalancesBoolExp>;
  delegator_address?: InputMaybe<StringComparisonExp>;
  pool_address?: InputMaybe<StringComparisonExp>;
  staking_pool_metadata?: InputMaybe<CurrentStakingPoolVoterBoolExp>;
};

/** aggregate max on columns */
export type DelegatorDistinctPoolMaxFields = {
  delegator_address?: Maybe<Scalars["String"]["output"]>;
  pool_address?: Maybe<Scalars["String"]["output"]>;
};

/** aggregate min on columns */
export type DelegatorDistinctPoolMinFields = {
  delegator_address?: Maybe<Scalars["String"]["output"]>;
  pool_address?: Maybe<Scalars["String"]["output"]>;
};

/** Ordering options when selecting data from "delegator_distinct_pool". */
export type DelegatorDistinctPoolOrderBy = {
  current_pool_balance?: InputMaybe<CurrentDelegatedStakingPoolBalancesOrderBy>;
  delegator_address?: InputMaybe<OrderBy>;
  pool_address?: InputMaybe<OrderBy>;
  staking_pool_metadata?: InputMaybe<CurrentStakingPoolVoterOrderBy>;
};

/** select columns of table "delegator_distinct_pool" */
export enum DelegatorDistinctPoolSelectColumn {
  /** column name */
  DelegatorAddress = "delegator_address",
  /** column name */
  PoolAddress = "pool_address",
}

/** Streaming cursor of the table "delegator_distinct_pool" */
export type DelegatorDistinctPoolStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: DelegatorDistinctPoolStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type DelegatorDistinctPoolStreamCursorValueInput = {
  delegator_address?: InputMaybe<Scalars["String"]["input"]>;
  pool_address?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "events" */
export type Events = {
  account_address: Scalars["String"]["output"];
  creation_number: Scalars["bigint"]["output"];
  data: Scalars["jsonb"]["output"];
  event_index: Scalars["bigint"]["output"];
  indexed_type: Scalars["String"]["output"];
  sequence_number: Scalars["bigint"]["output"];
  transaction_block_height: Scalars["bigint"]["output"];
  transaction_version: Scalars["bigint"]["output"];
  type: Scalars["String"]["output"];
};

/** columns and relationships of "events" */
export type EventsDataArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** Boolean expression to filter rows from the table "events". All fields are combined with a logical 'AND'. */
export type EventsBoolExp = {
  _and?: InputMaybe<Array<EventsBoolExp>>;
  _not?: InputMaybe<EventsBoolExp>;
  _or?: InputMaybe<Array<EventsBoolExp>>;
  account_address?: InputMaybe<StringComparisonExp>;
  creation_number?: InputMaybe<BigintComparisonExp>;
  data?: InputMaybe<JsonbComparisonExp>;
  event_index?: InputMaybe<BigintComparisonExp>;
  indexed_type?: InputMaybe<StringComparisonExp>;
  sequence_number?: InputMaybe<BigintComparisonExp>;
  transaction_block_height?: InputMaybe<BigintComparisonExp>;
  transaction_version?: InputMaybe<BigintComparisonExp>;
  type?: InputMaybe<StringComparisonExp>;
};

/** Ordering options when selecting data from "events". */
export type EventsOrderBy = {
  account_address?: InputMaybe<OrderBy>;
  creation_number?: InputMaybe<OrderBy>;
  data?: InputMaybe<OrderBy>;
  event_index?: InputMaybe<OrderBy>;
  indexed_type?: InputMaybe<OrderBy>;
  sequence_number?: InputMaybe<OrderBy>;
  transaction_block_height?: InputMaybe<OrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
  type?: InputMaybe<OrderBy>;
};

/** select columns of table "events" */
export enum EventsSelectColumn {
  /** column name */
  AccountAddress = "account_address",
  /** column name */
  CreationNumber = "creation_number",
  /** column name */
  Data = "data",
  /** column name */
  EventIndex = "event_index",
  /** column name */
  IndexedType = "indexed_type",
  /** column name */
  SequenceNumber = "sequence_number",
  /** column name */
  TransactionBlockHeight = "transaction_block_height",
  /** column name */
  TransactionVersion = "transaction_version",
  /** column name */
  Type = "type",
}

/** Streaming cursor of the table "events" */
export type EventsStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: EventsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type EventsStreamCursorValueInput = {
  account_address?: InputMaybe<Scalars["String"]["input"]>;
  creation_number?: InputMaybe<Scalars["bigint"]["input"]>;
  data?: InputMaybe<Scalars["jsonb"]["input"]>;
  event_index?: InputMaybe<Scalars["bigint"]["input"]>;
  indexed_type?: InputMaybe<Scalars["String"]["input"]>;
  sequence_number?: InputMaybe<Scalars["bigint"]["input"]>;
  transaction_block_height?: InputMaybe<Scalars["bigint"]["input"]>;
  transaction_version?: InputMaybe<Scalars["bigint"]["input"]>;
  type?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "fungible_asset_activities" */
export type FungibleAssetActivities = {
  amount?: Maybe<Scalars["numeric"]["output"]>;
  asset_type: Scalars["String"]["output"];
  block_height: Scalars["bigint"]["output"];
  entry_function_id_str?: Maybe<Scalars["String"]["output"]>;
  event_index: Scalars["bigint"]["output"];
  gas_fee_payer_address?: Maybe<Scalars["String"]["output"]>;
  is_frozen?: Maybe<Scalars["Boolean"]["output"]>;
  is_gas_fee: Scalars["Boolean"]["output"];
  is_transaction_success: Scalars["Boolean"]["output"];
  /** An object relationship */
  metadata?: Maybe<FungibleAssetMetadata>;
  owner_address: Scalars["String"]["output"];
  /** An array relationship */
  owner_aptos_names: Array<CurrentAptosNames>;
  /** An aggregate relationship */
  owner_aptos_names_aggregate: CurrentAptosNamesAggregate;
  storage_id: Scalars["String"]["output"];
  storage_refund_amount: Scalars["numeric"]["output"];
  token_standard: Scalars["String"]["output"];
  transaction_timestamp: Scalars["timestamp"]["output"];
  transaction_version: Scalars["bigint"]["output"];
  type: Scalars["String"]["output"];
};

/** columns and relationships of "fungible_asset_activities" */
export type FungibleAssetActivitiesOwnerAptosNamesArgs = {
  distinct_on?: InputMaybe<Array<CurrentAptosNamesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentAptosNamesOrderBy>>;
  where?: InputMaybe<CurrentAptosNamesBoolExp>;
};

/** columns and relationships of "fungible_asset_activities" */
export type FungibleAssetActivitiesOwnerAptosNamesAggregateArgs = {
  distinct_on?: InputMaybe<Array<CurrentAptosNamesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentAptosNamesOrderBy>>;
  where?: InputMaybe<CurrentAptosNamesBoolExp>;
};

/** order by aggregate values of table "fungible_asset_activities" */
export type FungibleAssetActivitiesAggregateOrderBy = {
  avg?: InputMaybe<FungibleAssetActivitiesAvgOrderBy>;
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<FungibleAssetActivitiesMaxOrderBy>;
  min?: InputMaybe<FungibleAssetActivitiesMinOrderBy>;
  stddev?: InputMaybe<FungibleAssetActivitiesStddevOrderBy>;
  stddev_pop?: InputMaybe<FungibleAssetActivitiesStddevPopOrderBy>;
  stddev_samp?: InputMaybe<FungibleAssetActivitiesStddevSampOrderBy>;
  sum?: InputMaybe<FungibleAssetActivitiesSumOrderBy>;
  var_pop?: InputMaybe<FungibleAssetActivitiesVarPopOrderBy>;
  var_samp?: InputMaybe<FungibleAssetActivitiesVarSampOrderBy>;
  variance?: InputMaybe<FungibleAssetActivitiesVarianceOrderBy>;
};

/** order by avg() on columns of table "fungible_asset_activities" */
export type FungibleAssetActivitiesAvgOrderBy = {
  amount?: InputMaybe<OrderBy>;
  block_height?: InputMaybe<OrderBy>;
  event_index?: InputMaybe<OrderBy>;
  storage_refund_amount?: InputMaybe<OrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "fungible_asset_activities". All fields are combined with a logical 'AND'. */
export type FungibleAssetActivitiesBoolExp = {
  _and?: InputMaybe<Array<FungibleAssetActivitiesBoolExp>>;
  _not?: InputMaybe<FungibleAssetActivitiesBoolExp>;
  _or?: InputMaybe<Array<FungibleAssetActivitiesBoolExp>>;
  amount?: InputMaybe<NumericComparisonExp>;
  asset_type?: InputMaybe<StringComparisonExp>;
  block_height?: InputMaybe<BigintComparisonExp>;
  entry_function_id_str?: InputMaybe<StringComparisonExp>;
  event_index?: InputMaybe<BigintComparisonExp>;
  gas_fee_payer_address?: InputMaybe<StringComparisonExp>;
  is_frozen?: InputMaybe<BooleanComparisonExp>;
  is_gas_fee?: InputMaybe<BooleanComparisonExp>;
  is_transaction_success?: InputMaybe<BooleanComparisonExp>;
  metadata?: InputMaybe<FungibleAssetMetadataBoolExp>;
  owner_address?: InputMaybe<StringComparisonExp>;
  owner_aptos_names?: InputMaybe<CurrentAptosNamesBoolExp>;
  storage_id?: InputMaybe<StringComparisonExp>;
  storage_refund_amount?: InputMaybe<NumericComparisonExp>;
  token_standard?: InputMaybe<StringComparisonExp>;
  transaction_timestamp?: InputMaybe<TimestampComparisonExp>;
  transaction_version?: InputMaybe<BigintComparisonExp>;
  type?: InputMaybe<StringComparisonExp>;
};

/** order by max() on columns of table "fungible_asset_activities" */
export type FungibleAssetActivitiesMaxOrderBy = {
  amount?: InputMaybe<OrderBy>;
  asset_type?: InputMaybe<OrderBy>;
  block_height?: InputMaybe<OrderBy>;
  entry_function_id_str?: InputMaybe<OrderBy>;
  event_index?: InputMaybe<OrderBy>;
  gas_fee_payer_address?: InputMaybe<OrderBy>;
  owner_address?: InputMaybe<OrderBy>;
  storage_id?: InputMaybe<OrderBy>;
  storage_refund_amount?: InputMaybe<OrderBy>;
  token_standard?: InputMaybe<OrderBy>;
  transaction_timestamp?: InputMaybe<OrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
  type?: InputMaybe<OrderBy>;
};

/** order by min() on columns of table "fungible_asset_activities" */
export type FungibleAssetActivitiesMinOrderBy = {
  amount?: InputMaybe<OrderBy>;
  asset_type?: InputMaybe<OrderBy>;
  block_height?: InputMaybe<OrderBy>;
  entry_function_id_str?: InputMaybe<OrderBy>;
  event_index?: InputMaybe<OrderBy>;
  gas_fee_payer_address?: InputMaybe<OrderBy>;
  owner_address?: InputMaybe<OrderBy>;
  storage_id?: InputMaybe<OrderBy>;
  storage_refund_amount?: InputMaybe<OrderBy>;
  token_standard?: InputMaybe<OrderBy>;
  transaction_timestamp?: InputMaybe<OrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
  type?: InputMaybe<OrderBy>;
};

/** Ordering options when selecting data from "fungible_asset_activities". */
export type FungibleAssetActivitiesOrderBy = {
  amount?: InputMaybe<OrderBy>;
  asset_type?: InputMaybe<OrderBy>;
  block_height?: InputMaybe<OrderBy>;
  entry_function_id_str?: InputMaybe<OrderBy>;
  event_index?: InputMaybe<OrderBy>;
  gas_fee_payer_address?: InputMaybe<OrderBy>;
  is_frozen?: InputMaybe<OrderBy>;
  is_gas_fee?: InputMaybe<OrderBy>;
  is_transaction_success?: InputMaybe<OrderBy>;
  metadata?: InputMaybe<FungibleAssetMetadataOrderBy>;
  owner_address?: InputMaybe<OrderBy>;
  owner_aptos_names_aggregate?: InputMaybe<CurrentAptosNamesAggregateOrderBy>;
  storage_id?: InputMaybe<OrderBy>;
  storage_refund_amount?: InputMaybe<OrderBy>;
  token_standard?: InputMaybe<OrderBy>;
  transaction_timestamp?: InputMaybe<OrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
  type?: InputMaybe<OrderBy>;
};

/** select columns of table "fungible_asset_activities" */
export enum FungibleAssetActivitiesSelectColumn {
  /** column name */
  Amount = "amount",
  /** column name */
  AssetType = "asset_type",
  /** column name */
  BlockHeight = "block_height",
  /** column name */
  EntryFunctionIdStr = "entry_function_id_str",
  /** column name */
  EventIndex = "event_index",
  /** column name */
  GasFeePayerAddress = "gas_fee_payer_address",
  /** column name */
  IsFrozen = "is_frozen",
  /** column name */
  IsGasFee = "is_gas_fee",
  /** column name */
  IsTransactionSuccess = "is_transaction_success",
  /** column name */
  OwnerAddress = "owner_address",
  /** column name */
  StorageId = "storage_id",
  /** column name */
  StorageRefundAmount = "storage_refund_amount",
  /** column name */
  TokenStandard = "token_standard",
  /** column name */
  TransactionTimestamp = "transaction_timestamp",
  /** column name */
  TransactionVersion = "transaction_version",
  /** column name */
  Type = "type",
}

/** order by stddev() on columns of table "fungible_asset_activities" */
export type FungibleAssetActivitiesStddevOrderBy = {
  amount?: InputMaybe<OrderBy>;
  block_height?: InputMaybe<OrderBy>;
  event_index?: InputMaybe<OrderBy>;
  storage_refund_amount?: InputMaybe<OrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
};

/** order by stddev_pop() on columns of table "fungible_asset_activities" */
export type FungibleAssetActivitiesStddevPopOrderBy = {
  amount?: InputMaybe<OrderBy>;
  block_height?: InputMaybe<OrderBy>;
  event_index?: InputMaybe<OrderBy>;
  storage_refund_amount?: InputMaybe<OrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
};

/** order by stddev_samp() on columns of table "fungible_asset_activities" */
export type FungibleAssetActivitiesStddevSampOrderBy = {
  amount?: InputMaybe<OrderBy>;
  block_height?: InputMaybe<OrderBy>;
  event_index?: InputMaybe<OrderBy>;
  storage_refund_amount?: InputMaybe<OrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
};

/** Streaming cursor of the table "fungible_asset_activities" */
export type FungibleAssetActivitiesStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: FungibleAssetActivitiesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type FungibleAssetActivitiesStreamCursorValueInput = {
  amount?: InputMaybe<Scalars["numeric"]["input"]>;
  asset_type?: InputMaybe<Scalars["String"]["input"]>;
  block_height?: InputMaybe<Scalars["bigint"]["input"]>;
  entry_function_id_str?: InputMaybe<Scalars["String"]["input"]>;
  event_index?: InputMaybe<Scalars["bigint"]["input"]>;
  gas_fee_payer_address?: InputMaybe<Scalars["String"]["input"]>;
  is_frozen?: InputMaybe<Scalars["Boolean"]["input"]>;
  is_gas_fee?: InputMaybe<Scalars["Boolean"]["input"]>;
  is_transaction_success?: InputMaybe<Scalars["Boolean"]["input"]>;
  owner_address?: InputMaybe<Scalars["String"]["input"]>;
  storage_id?: InputMaybe<Scalars["String"]["input"]>;
  storage_refund_amount?: InputMaybe<Scalars["numeric"]["input"]>;
  token_standard?: InputMaybe<Scalars["String"]["input"]>;
  transaction_timestamp?: InputMaybe<Scalars["timestamp"]["input"]>;
  transaction_version?: InputMaybe<Scalars["bigint"]["input"]>;
  type?: InputMaybe<Scalars["String"]["input"]>;
};

/** order by sum() on columns of table "fungible_asset_activities" */
export type FungibleAssetActivitiesSumOrderBy = {
  amount?: InputMaybe<OrderBy>;
  block_height?: InputMaybe<OrderBy>;
  event_index?: InputMaybe<OrderBy>;
  storage_refund_amount?: InputMaybe<OrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
};

/** order by var_pop() on columns of table "fungible_asset_activities" */
export type FungibleAssetActivitiesVarPopOrderBy = {
  amount?: InputMaybe<OrderBy>;
  block_height?: InputMaybe<OrderBy>;
  event_index?: InputMaybe<OrderBy>;
  storage_refund_amount?: InputMaybe<OrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
};

/** order by var_samp() on columns of table "fungible_asset_activities" */
export type FungibleAssetActivitiesVarSampOrderBy = {
  amount?: InputMaybe<OrderBy>;
  block_height?: InputMaybe<OrderBy>;
  event_index?: InputMaybe<OrderBy>;
  storage_refund_amount?: InputMaybe<OrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
};

/** order by variance() on columns of table "fungible_asset_activities" */
export type FungibleAssetActivitiesVarianceOrderBy = {
  amount?: InputMaybe<OrderBy>;
  block_height?: InputMaybe<OrderBy>;
  event_index?: InputMaybe<OrderBy>;
  storage_refund_amount?: InputMaybe<OrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
};

/** columns and relationships of "fungible_asset_metadata" */
export type FungibleAssetMetadata = {
  asset_type: Scalars["String"]["output"];
  creator_address: Scalars["String"]["output"];
  decimals: Scalars["Int"]["output"];
  icon_uri?: Maybe<Scalars["String"]["output"]>;
  last_transaction_timestamp: Scalars["timestamp"]["output"];
  last_transaction_version: Scalars["bigint"]["output"];
  name: Scalars["String"]["output"];
  project_uri?: Maybe<Scalars["String"]["output"]>;
  supply_aggregator_table_handle_v1?: Maybe<Scalars["String"]["output"]>;
  supply_aggregator_table_key_v1?: Maybe<Scalars["String"]["output"]>;
  symbol: Scalars["String"]["output"];
  token_standard: Scalars["String"]["output"];
};

/** Boolean expression to filter rows from the table "fungible_asset_metadata". All fields are combined with a logical 'AND'. */
export type FungibleAssetMetadataBoolExp = {
  _and?: InputMaybe<Array<FungibleAssetMetadataBoolExp>>;
  _not?: InputMaybe<FungibleAssetMetadataBoolExp>;
  _or?: InputMaybe<Array<FungibleAssetMetadataBoolExp>>;
  asset_type?: InputMaybe<StringComparisonExp>;
  creator_address?: InputMaybe<StringComparisonExp>;
  decimals?: InputMaybe<IntComparisonExp>;
  icon_uri?: InputMaybe<StringComparisonExp>;
  last_transaction_timestamp?: InputMaybe<TimestampComparisonExp>;
  last_transaction_version?: InputMaybe<BigintComparisonExp>;
  name?: InputMaybe<StringComparisonExp>;
  project_uri?: InputMaybe<StringComparisonExp>;
  supply_aggregator_table_handle_v1?: InputMaybe<StringComparisonExp>;
  supply_aggregator_table_key_v1?: InputMaybe<StringComparisonExp>;
  symbol?: InputMaybe<StringComparisonExp>;
  token_standard?: InputMaybe<StringComparisonExp>;
};

/** Ordering options when selecting data from "fungible_asset_metadata". */
export type FungibleAssetMetadataOrderBy = {
  asset_type?: InputMaybe<OrderBy>;
  creator_address?: InputMaybe<OrderBy>;
  decimals?: InputMaybe<OrderBy>;
  icon_uri?: InputMaybe<OrderBy>;
  last_transaction_timestamp?: InputMaybe<OrderBy>;
  last_transaction_version?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  project_uri?: InputMaybe<OrderBy>;
  supply_aggregator_table_handle_v1?: InputMaybe<OrderBy>;
  supply_aggregator_table_key_v1?: InputMaybe<OrderBy>;
  symbol?: InputMaybe<OrderBy>;
  token_standard?: InputMaybe<OrderBy>;
};

/** select columns of table "fungible_asset_metadata" */
export enum FungibleAssetMetadataSelectColumn {
  /** column name */
  AssetType = "asset_type",
  /** column name */
  CreatorAddress = "creator_address",
  /** column name */
  Decimals = "decimals",
  /** column name */
  IconUri = "icon_uri",
  /** column name */
  LastTransactionTimestamp = "last_transaction_timestamp",
  /** column name */
  LastTransactionVersion = "last_transaction_version",
  /** column name */
  Name = "name",
  /** column name */
  ProjectUri = "project_uri",
  /** column name */
  SupplyAggregatorTableHandleV1 = "supply_aggregator_table_handle_v1",
  /** column name */
  SupplyAggregatorTableKeyV1 = "supply_aggregator_table_key_v1",
  /** column name */
  Symbol = "symbol",
  /** column name */
  TokenStandard = "token_standard",
}

/** Streaming cursor of the table "fungible_asset_metadata" */
export type FungibleAssetMetadataStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: FungibleAssetMetadataStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type FungibleAssetMetadataStreamCursorValueInput = {
  asset_type?: InputMaybe<Scalars["String"]["input"]>;
  creator_address?: InputMaybe<Scalars["String"]["input"]>;
  decimals?: InputMaybe<Scalars["Int"]["input"]>;
  icon_uri?: InputMaybe<Scalars["String"]["input"]>;
  last_transaction_timestamp?: InputMaybe<Scalars["timestamp"]["input"]>;
  last_transaction_version?: InputMaybe<Scalars["bigint"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  project_uri?: InputMaybe<Scalars["String"]["input"]>;
  supply_aggregator_table_handle_v1?: InputMaybe<Scalars["String"]["input"]>;
  supply_aggregator_table_key_v1?: InputMaybe<Scalars["String"]["input"]>;
  symbol?: InputMaybe<Scalars["String"]["input"]>;
  token_standard?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "indexer_status" */
export type IndexerStatus = {
  db: Scalars["String"]["output"];
  is_indexer_up: Scalars["Boolean"]["output"];
};

/** Boolean expression to filter rows from the table "indexer_status". All fields are combined with a logical 'AND'. */
export type IndexerStatusBoolExp = {
  _and?: InputMaybe<Array<IndexerStatusBoolExp>>;
  _not?: InputMaybe<IndexerStatusBoolExp>;
  _or?: InputMaybe<Array<IndexerStatusBoolExp>>;
  db?: InputMaybe<StringComparisonExp>;
  is_indexer_up?: InputMaybe<BooleanComparisonExp>;
};

/** Ordering options when selecting data from "indexer_status". */
export type IndexerStatusOrderBy = {
  db?: InputMaybe<OrderBy>;
  is_indexer_up?: InputMaybe<OrderBy>;
};

/** select columns of table "indexer_status" */
export enum IndexerStatusSelectColumn {
  /** column name */
  Db = "db",
  /** column name */
  IsIndexerUp = "is_indexer_up",
}

/** Streaming cursor of the table "indexer_status" */
export type IndexerStatusStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: IndexerStatusStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type IndexerStatusStreamCursorValueInput = {
  db?: InputMaybe<Scalars["String"]["input"]>;
  is_indexer_up?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type JsonbCastExp = {
  String?: InputMaybe<StringComparisonExp>;
};

/** Boolean expression to compare columns of type "jsonb". All fields are combined with logical 'AND'. */
export type JsonbComparisonExp = {
  _cast?: InputMaybe<JsonbCastExp>;
  /** is the column contained in the given json value */
  _contained_in?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** does the column contain the given json value at the top level */
  _contains?: InputMaybe<Scalars["jsonb"]["input"]>;
  _eq?: InputMaybe<Scalars["jsonb"]["input"]>;
  _gt?: InputMaybe<Scalars["jsonb"]["input"]>;
  _gte?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** does the string exist as a top-level key in the column */
  _has_key?: InputMaybe<Scalars["String"]["input"]>;
  /** do all of these strings exist as top-level keys in the column */
  _has_keys_all?: InputMaybe<Array<Scalars["String"]["input"]>>;
  /** do any of these strings exist as top-level keys in the column */
  _has_keys_any?: InputMaybe<Array<Scalars["String"]["input"]>>;
  _in?: InputMaybe<Array<Scalars["jsonb"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["jsonb"]["input"]>;
  _lte?: InputMaybe<Scalars["jsonb"]["input"]>;
  _neq?: InputMaybe<Scalars["jsonb"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["jsonb"]["input"]>>;
};

/** columns and relationships of "ledger_infos" */
export type LedgerInfos = {
  chain_id: Scalars["bigint"]["output"];
};

/** Boolean expression to filter rows from the table "ledger_infos". All fields are combined with a logical 'AND'. */
export type LedgerInfosBoolExp = {
  _and?: InputMaybe<Array<LedgerInfosBoolExp>>;
  _not?: InputMaybe<LedgerInfosBoolExp>;
  _or?: InputMaybe<Array<LedgerInfosBoolExp>>;
  chain_id?: InputMaybe<BigintComparisonExp>;
};

/** Ordering options when selecting data from "ledger_infos". */
export type LedgerInfosOrderBy = {
  chain_id?: InputMaybe<OrderBy>;
};

/** select columns of table "ledger_infos" */
export enum LedgerInfosSelectColumn {
  /** column name */
  ChainId = "chain_id",
}

/** Streaming cursor of the table "ledger_infos" */
export type LedgerInfosStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: LedgerInfosStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type LedgerInfosStreamCursorValueInput = {
  chain_id?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** columns and relationships of "move_resources" */
export type MoveResources = {
  address: Scalars["String"]["output"];
  transaction_version: Scalars["bigint"]["output"];
};

/** aggregated selection of "move_resources" */
export type MoveResourcesAggregate = {
  aggregate?: Maybe<MoveResourcesAggregateFields>;
  nodes: Array<MoveResources>;
};

/** aggregate fields of "move_resources" */
export type MoveResourcesAggregateFields = {
  avg?: Maybe<MoveResourcesAvgFields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<MoveResourcesMaxFields>;
  min?: Maybe<MoveResourcesMinFields>;
  stddev?: Maybe<MoveResourcesStddevFields>;
  stddev_pop?: Maybe<MoveResourcesStddevPopFields>;
  stddev_samp?: Maybe<MoveResourcesStddevSampFields>;
  sum?: Maybe<MoveResourcesSumFields>;
  var_pop?: Maybe<MoveResourcesVarPopFields>;
  var_samp?: Maybe<MoveResourcesVarSampFields>;
  variance?: Maybe<MoveResourcesVarianceFields>;
};

/** aggregate fields of "move_resources" */
export type MoveResourcesAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<MoveResourcesSelectColumn>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** aggregate avg on columns */
export type MoveResourcesAvgFields = {
  transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** Boolean expression to filter rows from the table "move_resources". All fields are combined with a logical 'AND'. */
export type MoveResourcesBoolExp = {
  _and?: InputMaybe<Array<MoveResourcesBoolExp>>;
  _not?: InputMaybe<MoveResourcesBoolExp>;
  _or?: InputMaybe<Array<MoveResourcesBoolExp>>;
  address?: InputMaybe<StringComparisonExp>;
  transaction_version?: InputMaybe<BigintComparisonExp>;
};

/** aggregate max on columns */
export type MoveResourcesMaxFields = {
  address?: Maybe<Scalars["String"]["output"]>;
  transaction_version?: Maybe<Scalars["bigint"]["output"]>;
};

/** aggregate min on columns */
export type MoveResourcesMinFields = {
  address?: Maybe<Scalars["String"]["output"]>;
  transaction_version?: Maybe<Scalars["bigint"]["output"]>;
};

/** Ordering options when selecting data from "move_resources". */
export type MoveResourcesOrderBy = {
  address?: InputMaybe<OrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
};

/** select columns of table "move_resources" */
export enum MoveResourcesSelectColumn {
  /** column name */
  Address = "address",
  /** column name */
  TransactionVersion = "transaction_version",
}

/** aggregate stddev on columns */
export type MoveResourcesStddevFields = {
  transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_pop on columns */
export type MoveResourcesStddevPopFields = {
  transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_samp on columns */
export type MoveResourcesStddevSampFields = {
  transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** Streaming cursor of the table "move_resources" */
export type MoveResourcesStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: MoveResourcesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type MoveResourcesStreamCursorValueInput = {
  address?: InputMaybe<Scalars["String"]["input"]>;
  transaction_version?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** aggregate sum on columns */
export type MoveResourcesSumFields = {
  transaction_version?: Maybe<Scalars["bigint"]["output"]>;
};

/** aggregate var_pop on columns */
export type MoveResourcesVarPopFields = {
  transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate var_samp on columns */
export type MoveResourcesVarSampFields = {
  transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate variance on columns */
export type MoveResourcesVarianceFields = {
  transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** columns and relationships of "nft_marketplace_v2.current_nft_marketplace_auctions" */
export type NftMarketplaceV2CurrentNftMarketplaceAuctions = {
  buy_it_now_price?: Maybe<Scalars["numeric"]["output"]>;
  coin_type?: Maybe<Scalars["String"]["output"]>;
  collection_id: Scalars["String"]["output"];
  contract_address: Scalars["String"]["output"];
  current_bid_price?: Maybe<Scalars["numeric"]["output"]>;
  current_bidder?: Maybe<Scalars["String"]["output"]>;
  /** An object relationship */
  current_token_data?: Maybe<CurrentTokenDatasV2>;
  entry_function_id_str: Scalars["String"]["output"];
  expiration_time: Scalars["numeric"]["output"];
  fee_schedule_id: Scalars["String"]["output"];
  is_deleted: Scalars["Boolean"]["output"];
  last_transaction_timestamp: Scalars["timestamptz"]["output"];
  last_transaction_version: Scalars["bigint"]["output"];
  listing_id: Scalars["String"]["output"];
  marketplace: Scalars["String"]["output"];
  seller: Scalars["String"]["output"];
  starting_bid_price: Scalars["numeric"]["output"];
  token_amount: Scalars["numeric"]["output"];
  token_data_id: Scalars["String"]["output"];
  token_standard: Scalars["String"]["output"];
};

/** Boolean expression to filter rows from the table "nft_marketplace_v2.current_nft_marketplace_auctions". All fields are combined with a logical 'AND'. */
export type NftMarketplaceV2CurrentNftMarketplaceAuctionsBoolExp = {
  _and?: InputMaybe<Array<NftMarketplaceV2CurrentNftMarketplaceAuctionsBoolExp>>;
  _not?: InputMaybe<NftMarketplaceV2CurrentNftMarketplaceAuctionsBoolExp>;
  _or?: InputMaybe<Array<NftMarketplaceV2CurrentNftMarketplaceAuctionsBoolExp>>;
  buy_it_now_price?: InputMaybe<NumericComparisonExp>;
  coin_type?: InputMaybe<StringComparisonExp>;
  collection_id?: InputMaybe<StringComparisonExp>;
  contract_address?: InputMaybe<StringComparisonExp>;
  current_bid_price?: InputMaybe<NumericComparisonExp>;
  current_bidder?: InputMaybe<StringComparisonExp>;
  current_token_data?: InputMaybe<CurrentTokenDatasV2BoolExp>;
  entry_function_id_str?: InputMaybe<StringComparisonExp>;
  expiration_time?: InputMaybe<NumericComparisonExp>;
  fee_schedule_id?: InputMaybe<StringComparisonExp>;
  is_deleted?: InputMaybe<BooleanComparisonExp>;
  last_transaction_timestamp?: InputMaybe<TimestamptzComparisonExp>;
  last_transaction_version?: InputMaybe<BigintComparisonExp>;
  listing_id?: InputMaybe<StringComparisonExp>;
  marketplace?: InputMaybe<StringComparisonExp>;
  seller?: InputMaybe<StringComparisonExp>;
  starting_bid_price?: InputMaybe<NumericComparisonExp>;
  token_amount?: InputMaybe<NumericComparisonExp>;
  token_data_id?: InputMaybe<StringComparisonExp>;
  token_standard?: InputMaybe<StringComparisonExp>;
};

/** Ordering options when selecting data from "nft_marketplace_v2.current_nft_marketplace_auctions". */
export type NftMarketplaceV2CurrentNftMarketplaceAuctionsOrderBy = {
  buy_it_now_price?: InputMaybe<OrderBy>;
  coin_type?: InputMaybe<OrderBy>;
  collection_id?: InputMaybe<OrderBy>;
  contract_address?: InputMaybe<OrderBy>;
  current_bid_price?: InputMaybe<OrderBy>;
  current_bidder?: InputMaybe<OrderBy>;
  current_token_data?: InputMaybe<CurrentTokenDatasV2OrderBy>;
  entry_function_id_str?: InputMaybe<OrderBy>;
  expiration_time?: InputMaybe<OrderBy>;
  fee_schedule_id?: InputMaybe<OrderBy>;
  is_deleted?: InputMaybe<OrderBy>;
  last_transaction_timestamp?: InputMaybe<OrderBy>;
  last_transaction_version?: InputMaybe<OrderBy>;
  listing_id?: InputMaybe<OrderBy>;
  marketplace?: InputMaybe<OrderBy>;
  seller?: InputMaybe<OrderBy>;
  starting_bid_price?: InputMaybe<OrderBy>;
  token_amount?: InputMaybe<OrderBy>;
  token_data_id?: InputMaybe<OrderBy>;
  token_standard?: InputMaybe<OrderBy>;
};

/** select columns of table "nft_marketplace_v2.current_nft_marketplace_auctions" */
export enum NftMarketplaceV2CurrentNftMarketplaceAuctionsSelectColumn {
  /** column name */
  BuyItNowPrice = "buy_it_now_price",
  /** column name */
  CoinType = "coin_type",
  /** column name */
  CollectionId = "collection_id",
  /** column name */
  ContractAddress = "contract_address",
  /** column name */
  CurrentBidPrice = "current_bid_price",
  /** column name */
  CurrentBidder = "current_bidder",
  /** column name */
  EntryFunctionIdStr = "entry_function_id_str",
  /** column name */
  ExpirationTime = "expiration_time",
  /** column name */
  FeeScheduleId = "fee_schedule_id",
  /** column name */
  IsDeleted = "is_deleted",
  /** column name */
  LastTransactionTimestamp = "last_transaction_timestamp",
  /** column name */
  LastTransactionVersion = "last_transaction_version",
  /** column name */
  ListingId = "listing_id",
  /** column name */
  Marketplace = "marketplace",
  /** column name */
  Seller = "seller",
  /** column name */
  StartingBidPrice = "starting_bid_price",
  /** column name */
  TokenAmount = "token_amount",
  /** column name */
  TokenDataId = "token_data_id",
  /** column name */
  TokenStandard = "token_standard",
}

/** Streaming cursor of the table "nft_marketplace_v2_current_nft_marketplace_auctions" */
export type NftMarketplaceV2CurrentNftMarketplaceAuctionsStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: NftMarketplaceV2CurrentNftMarketplaceAuctionsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type NftMarketplaceV2CurrentNftMarketplaceAuctionsStreamCursorValueInput = {
  buy_it_now_price?: InputMaybe<Scalars["numeric"]["input"]>;
  coin_type?: InputMaybe<Scalars["String"]["input"]>;
  collection_id?: InputMaybe<Scalars["String"]["input"]>;
  contract_address?: InputMaybe<Scalars["String"]["input"]>;
  current_bid_price?: InputMaybe<Scalars["numeric"]["input"]>;
  current_bidder?: InputMaybe<Scalars["String"]["input"]>;
  entry_function_id_str?: InputMaybe<Scalars["String"]["input"]>;
  expiration_time?: InputMaybe<Scalars["numeric"]["input"]>;
  fee_schedule_id?: InputMaybe<Scalars["String"]["input"]>;
  is_deleted?: InputMaybe<Scalars["Boolean"]["input"]>;
  last_transaction_timestamp?: InputMaybe<Scalars["timestamptz"]["input"]>;
  last_transaction_version?: InputMaybe<Scalars["bigint"]["input"]>;
  listing_id?: InputMaybe<Scalars["String"]["input"]>;
  marketplace?: InputMaybe<Scalars["String"]["input"]>;
  seller?: InputMaybe<Scalars["String"]["input"]>;
  starting_bid_price?: InputMaybe<Scalars["numeric"]["input"]>;
  token_amount?: InputMaybe<Scalars["numeric"]["input"]>;
  token_data_id?: InputMaybe<Scalars["String"]["input"]>;
  token_standard?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "nft_marketplace_v2.current_nft_marketplace_collection_offers" */
export type NftMarketplaceV2CurrentNftMarketplaceCollectionOffers = {
  buyer: Scalars["String"]["output"];
  coin_type?: Maybe<Scalars["String"]["output"]>;
  collection_id: Scalars["String"]["output"];
  collection_offer_id: Scalars["String"]["output"];
  contract_address: Scalars["String"]["output"];
  /** An object relationship */
  current_collection_v2?: Maybe<CurrentCollectionsV2>;
  entry_function_id_str: Scalars["String"]["output"];
  expiration_time: Scalars["numeric"]["output"];
  fee_schedule_id: Scalars["String"]["output"];
  is_deleted: Scalars["Boolean"]["output"];
  item_price: Scalars["numeric"]["output"];
  last_transaction_timestamp: Scalars["timestamptz"]["output"];
  last_transaction_version: Scalars["bigint"]["output"];
  marketplace: Scalars["String"]["output"];
  remaining_token_amount: Scalars["numeric"]["output"];
  token_standard: Scalars["String"]["output"];
};

/** Boolean expression to filter rows from the table "nft_marketplace_v2.current_nft_marketplace_collection_offers". All fields are combined with a logical 'AND'. */
export type NftMarketplaceV2CurrentNftMarketplaceCollectionOffersBoolExp = {
  _and?: InputMaybe<Array<NftMarketplaceV2CurrentNftMarketplaceCollectionOffersBoolExp>>;
  _not?: InputMaybe<NftMarketplaceV2CurrentNftMarketplaceCollectionOffersBoolExp>;
  _or?: InputMaybe<Array<NftMarketplaceV2CurrentNftMarketplaceCollectionOffersBoolExp>>;
  buyer?: InputMaybe<StringComparisonExp>;
  coin_type?: InputMaybe<StringComparisonExp>;
  collection_id?: InputMaybe<StringComparisonExp>;
  collection_offer_id?: InputMaybe<StringComparisonExp>;
  contract_address?: InputMaybe<StringComparisonExp>;
  current_collection_v2?: InputMaybe<CurrentCollectionsV2BoolExp>;
  entry_function_id_str?: InputMaybe<StringComparisonExp>;
  expiration_time?: InputMaybe<NumericComparisonExp>;
  fee_schedule_id?: InputMaybe<StringComparisonExp>;
  is_deleted?: InputMaybe<BooleanComparisonExp>;
  item_price?: InputMaybe<NumericComparisonExp>;
  last_transaction_timestamp?: InputMaybe<TimestamptzComparisonExp>;
  last_transaction_version?: InputMaybe<BigintComparisonExp>;
  marketplace?: InputMaybe<StringComparisonExp>;
  remaining_token_amount?: InputMaybe<NumericComparisonExp>;
  token_standard?: InputMaybe<StringComparisonExp>;
};

/** Ordering options when selecting data from "nft_marketplace_v2.current_nft_marketplace_collection_offers". */
export type NftMarketplaceV2CurrentNftMarketplaceCollectionOffersOrderBy = {
  buyer?: InputMaybe<OrderBy>;
  coin_type?: InputMaybe<OrderBy>;
  collection_id?: InputMaybe<OrderBy>;
  collection_offer_id?: InputMaybe<OrderBy>;
  contract_address?: InputMaybe<OrderBy>;
  current_collection_v2?: InputMaybe<CurrentCollectionsV2OrderBy>;
  entry_function_id_str?: InputMaybe<OrderBy>;
  expiration_time?: InputMaybe<OrderBy>;
  fee_schedule_id?: InputMaybe<OrderBy>;
  is_deleted?: InputMaybe<OrderBy>;
  item_price?: InputMaybe<OrderBy>;
  last_transaction_timestamp?: InputMaybe<OrderBy>;
  last_transaction_version?: InputMaybe<OrderBy>;
  marketplace?: InputMaybe<OrderBy>;
  remaining_token_amount?: InputMaybe<OrderBy>;
  token_standard?: InputMaybe<OrderBy>;
};

/** select columns of table "nft_marketplace_v2.current_nft_marketplace_collection_offers" */
export enum NftMarketplaceV2CurrentNftMarketplaceCollectionOffersSelectColumn {
  /** column name */
  Buyer = "buyer",
  /** column name */
  CoinType = "coin_type",
  /** column name */
  CollectionId = "collection_id",
  /** column name */
  CollectionOfferId = "collection_offer_id",
  /** column name */
  ContractAddress = "contract_address",
  /** column name */
  EntryFunctionIdStr = "entry_function_id_str",
  /** column name */
  ExpirationTime = "expiration_time",
  /** column name */
  FeeScheduleId = "fee_schedule_id",
  /** column name */
  IsDeleted = "is_deleted",
  /** column name */
  ItemPrice = "item_price",
  /** column name */
  LastTransactionTimestamp = "last_transaction_timestamp",
  /** column name */
  LastTransactionVersion = "last_transaction_version",
  /** column name */
  Marketplace = "marketplace",
  /** column name */
  RemainingTokenAmount = "remaining_token_amount",
  /** column name */
  TokenStandard = "token_standard",
}

/** Streaming cursor of the table "nft_marketplace_v2_current_nft_marketplace_collection_offers" */
export type NftMarketplaceV2CurrentNftMarketplaceCollectionOffersStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: NftMarketplaceV2CurrentNftMarketplaceCollectionOffersStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type NftMarketplaceV2CurrentNftMarketplaceCollectionOffersStreamCursorValueInput = {
  buyer?: InputMaybe<Scalars["String"]["input"]>;
  coin_type?: InputMaybe<Scalars["String"]["input"]>;
  collection_id?: InputMaybe<Scalars["String"]["input"]>;
  collection_offer_id?: InputMaybe<Scalars["String"]["input"]>;
  contract_address?: InputMaybe<Scalars["String"]["input"]>;
  entry_function_id_str?: InputMaybe<Scalars["String"]["input"]>;
  expiration_time?: InputMaybe<Scalars["numeric"]["input"]>;
  fee_schedule_id?: InputMaybe<Scalars["String"]["input"]>;
  is_deleted?: InputMaybe<Scalars["Boolean"]["input"]>;
  item_price?: InputMaybe<Scalars["numeric"]["input"]>;
  last_transaction_timestamp?: InputMaybe<Scalars["timestamptz"]["input"]>;
  last_transaction_version?: InputMaybe<Scalars["bigint"]["input"]>;
  marketplace?: InputMaybe<Scalars["String"]["input"]>;
  remaining_token_amount?: InputMaybe<Scalars["numeric"]["input"]>;
  token_standard?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "nft_marketplace_v2.current_nft_marketplace_listings" */
export type NftMarketplaceV2CurrentNftMarketplaceListings = {
  coin_type?: Maybe<Scalars["String"]["output"]>;
  collection_id: Scalars["String"]["output"];
  contract_address: Scalars["String"]["output"];
  /** An object relationship */
  current_token_data?: Maybe<CurrentTokenDatasV2>;
  entry_function_id_str: Scalars["String"]["output"];
  fee_schedule_id: Scalars["String"]["output"];
  is_deleted: Scalars["Boolean"]["output"];
  last_transaction_timestamp: Scalars["timestamptz"]["output"];
  last_transaction_version: Scalars["bigint"]["output"];
  listing_id: Scalars["String"]["output"];
  marketplace: Scalars["String"]["output"];
  price: Scalars["numeric"]["output"];
  seller: Scalars["String"]["output"];
  token_amount: Scalars["numeric"]["output"];
  token_data_id: Scalars["String"]["output"];
  token_standard: Scalars["String"]["output"];
};

/** Boolean expression to filter rows from the table "nft_marketplace_v2.current_nft_marketplace_listings". All fields are combined with a logical 'AND'. */
export type NftMarketplaceV2CurrentNftMarketplaceListingsBoolExp = {
  _and?: InputMaybe<Array<NftMarketplaceV2CurrentNftMarketplaceListingsBoolExp>>;
  _not?: InputMaybe<NftMarketplaceV2CurrentNftMarketplaceListingsBoolExp>;
  _or?: InputMaybe<Array<NftMarketplaceV2CurrentNftMarketplaceListingsBoolExp>>;
  coin_type?: InputMaybe<StringComparisonExp>;
  collection_id?: InputMaybe<StringComparisonExp>;
  contract_address?: InputMaybe<StringComparisonExp>;
  current_token_data?: InputMaybe<CurrentTokenDatasV2BoolExp>;
  entry_function_id_str?: InputMaybe<StringComparisonExp>;
  fee_schedule_id?: InputMaybe<StringComparisonExp>;
  is_deleted?: InputMaybe<BooleanComparisonExp>;
  last_transaction_timestamp?: InputMaybe<TimestamptzComparisonExp>;
  last_transaction_version?: InputMaybe<BigintComparisonExp>;
  listing_id?: InputMaybe<StringComparisonExp>;
  marketplace?: InputMaybe<StringComparisonExp>;
  price?: InputMaybe<NumericComparisonExp>;
  seller?: InputMaybe<StringComparisonExp>;
  token_amount?: InputMaybe<NumericComparisonExp>;
  token_data_id?: InputMaybe<StringComparisonExp>;
  token_standard?: InputMaybe<StringComparisonExp>;
};

/** Ordering options when selecting data from "nft_marketplace_v2.current_nft_marketplace_listings". */
export type NftMarketplaceV2CurrentNftMarketplaceListingsOrderBy = {
  coin_type?: InputMaybe<OrderBy>;
  collection_id?: InputMaybe<OrderBy>;
  contract_address?: InputMaybe<OrderBy>;
  current_token_data?: InputMaybe<CurrentTokenDatasV2OrderBy>;
  entry_function_id_str?: InputMaybe<OrderBy>;
  fee_schedule_id?: InputMaybe<OrderBy>;
  is_deleted?: InputMaybe<OrderBy>;
  last_transaction_timestamp?: InputMaybe<OrderBy>;
  last_transaction_version?: InputMaybe<OrderBy>;
  listing_id?: InputMaybe<OrderBy>;
  marketplace?: InputMaybe<OrderBy>;
  price?: InputMaybe<OrderBy>;
  seller?: InputMaybe<OrderBy>;
  token_amount?: InputMaybe<OrderBy>;
  token_data_id?: InputMaybe<OrderBy>;
  token_standard?: InputMaybe<OrderBy>;
};

/** select columns of table "nft_marketplace_v2.current_nft_marketplace_listings" */
export enum NftMarketplaceV2CurrentNftMarketplaceListingsSelectColumn {
  /** column name */
  CoinType = "coin_type",
  /** column name */
  CollectionId = "collection_id",
  /** column name */
  ContractAddress = "contract_address",
  /** column name */
  EntryFunctionIdStr = "entry_function_id_str",
  /** column name */
  FeeScheduleId = "fee_schedule_id",
  /** column name */
  IsDeleted = "is_deleted",
  /** column name */
  LastTransactionTimestamp = "last_transaction_timestamp",
  /** column name */
  LastTransactionVersion = "last_transaction_version",
  /** column name */
  ListingId = "listing_id",
  /** column name */
  Marketplace = "marketplace",
  /** column name */
  Price = "price",
  /** column name */
  Seller = "seller",
  /** column name */
  TokenAmount = "token_amount",
  /** column name */
  TokenDataId = "token_data_id",
  /** column name */
  TokenStandard = "token_standard",
}

/** Streaming cursor of the table "nft_marketplace_v2_current_nft_marketplace_listings" */
export type NftMarketplaceV2CurrentNftMarketplaceListingsStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: NftMarketplaceV2CurrentNftMarketplaceListingsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type NftMarketplaceV2CurrentNftMarketplaceListingsStreamCursorValueInput = {
  coin_type?: InputMaybe<Scalars["String"]["input"]>;
  collection_id?: InputMaybe<Scalars["String"]["input"]>;
  contract_address?: InputMaybe<Scalars["String"]["input"]>;
  entry_function_id_str?: InputMaybe<Scalars["String"]["input"]>;
  fee_schedule_id?: InputMaybe<Scalars["String"]["input"]>;
  is_deleted?: InputMaybe<Scalars["Boolean"]["input"]>;
  last_transaction_timestamp?: InputMaybe<Scalars["timestamptz"]["input"]>;
  last_transaction_version?: InputMaybe<Scalars["bigint"]["input"]>;
  listing_id?: InputMaybe<Scalars["String"]["input"]>;
  marketplace?: InputMaybe<Scalars["String"]["input"]>;
  price?: InputMaybe<Scalars["numeric"]["input"]>;
  seller?: InputMaybe<Scalars["String"]["input"]>;
  token_amount?: InputMaybe<Scalars["numeric"]["input"]>;
  token_data_id?: InputMaybe<Scalars["String"]["input"]>;
  token_standard?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "nft_marketplace_v2.current_nft_marketplace_token_offers" */
export type NftMarketplaceV2CurrentNftMarketplaceTokenOffers = {
  buyer: Scalars["String"]["output"];
  coin_type?: Maybe<Scalars["String"]["output"]>;
  collection_id: Scalars["String"]["output"];
  contract_address: Scalars["String"]["output"];
  /** An object relationship */
  current_token_data?: Maybe<CurrentTokenDatasV2>;
  entry_function_id_str: Scalars["String"]["output"];
  expiration_time: Scalars["numeric"]["output"];
  fee_schedule_id: Scalars["String"]["output"];
  is_deleted: Scalars["Boolean"]["output"];
  last_transaction_timestamp: Scalars["timestamptz"]["output"];
  last_transaction_version: Scalars["bigint"]["output"];
  marketplace: Scalars["String"]["output"];
  offer_id: Scalars["String"]["output"];
  price: Scalars["numeric"]["output"];
  token_amount: Scalars["numeric"]["output"];
  token_data_id: Scalars["String"]["output"];
  token_standard: Scalars["String"]["output"];
};

/** Boolean expression to filter rows from the table "nft_marketplace_v2.current_nft_marketplace_token_offers". All fields are combined with a logical 'AND'. */
export type NftMarketplaceV2CurrentNftMarketplaceTokenOffersBoolExp = {
  _and?: InputMaybe<Array<NftMarketplaceV2CurrentNftMarketplaceTokenOffersBoolExp>>;
  _not?: InputMaybe<NftMarketplaceV2CurrentNftMarketplaceTokenOffersBoolExp>;
  _or?: InputMaybe<Array<NftMarketplaceV2CurrentNftMarketplaceTokenOffersBoolExp>>;
  buyer?: InputMaybe<StringComparisonExp>;
  coin_type?: InputMaybe<StringComparisonExp>;
  collection_id?: InputMaybe<StringComparisonExp>;
  contract_address?: InputMaybe<StringComparisonExp>;
  current_token_data?: InputMaybe<CurrentTokenDatasV2BoolExp>;
  entry_function_id_str?: InputMaybe<StringComparisonExp>;
  expiration_time?: InputMaybe<NumericComparisonExp>;
  fee_schedule_id?: InputMaybe<StringComparisonExp>;
  is_deleted?: InputMaybe<BooleanComparisonExp>;
  last_transaction_timestamp?: InputMaybe<TimestamptzComparisonExp>;
  last_transaction_version?: InputMaybe<BigintComparisonExp>;
  marketplace?: InputMaybe<StringComparisonExp>;
  offer_id?: InputMaybe<StringComparisonExp>;
  price?: InputMaybe<NumericComparisonExp>;
  token_amount?: InputMaybe<NumericComparisonExp>;
  token_data_id?: InputMaybe<StringComparisonExp>;
  token_standard?: InputMaybe<StringComparisonExp>;
};

/** Ordering options when selecting data from "nft_marketplace_v2.current_nft_marketplace_token_offers". */
export type NftMarketplaceV2CurrentNftMarketplaceTokenOffersOrderBy = {
  buyer?: InputMaybe<OrderBy>;
  coin_type?: InputMaybe<OrderBy>;
  collection_id?: InputMaybe<OrderBy>;
  contract_address?: InputMaybe<OrderBy>;
  current_token_data?: InputMaybe<CurrentTokenDatasV2OrderBy>;
  entry_function_id_str?: InputMaybe<OrderBy>;
  expiration_time?: InputMaybe<OrderBy>;
  fee_schedule_id?: InputMaybe<OrderBy>;
  is_deleted?: InputMaybe<OrderBy>;
  last_transaction_timestamp?: InputMaybe<OrderBy>;
  last_transaction_version?: InputMaybe<OrderBy>;
  marketplace?: InputMaybe<OrderBy>;
  offer_id?: InputMaybe<OrderBy>;
  price?: InputMaybe<OrderBy>;
  token_amount?: InputMaybe<OrderBy>;
  token_data_id?: InputMaybe<OrderBy>;
  token_standard?: InputMaybe<OrderBy>;
};

/** select columns of table "nft_marketplace_v2.current_nft_marketplace_token_offers" */
export enum NftMarketplaceV2CurrentNftMarketplaceTokenOffersSelectColumn {
  /** column name */
  Buyer = "buyer",
  /** column name */
  CoinType = "coin_type",
  /** column name */
  CollectionId = "collection_id",
  /** column name */
  ContractAddress = "contract_address",
  /** column name */
  EntryFunctionIdStr = "entry_function_id_str",
  /** column name */
  ExpirationTime = "expiration_time",
  /** column name */
  FeeScheduleId = "fee_schedule_id",
  /** column name */
  IsDeleted = "is_deleted",
  /** column name */
  LastTransactionTimestamp = "last_transaction_timestamp",
  /** column name */
  LastTransactionVersion = "last_transaction_version",
  /** column name */
  Marketplace = "marketplace",
  /** column name */
  OfferId = "offer_id",
  /** column name */
  Price = "price",
  /** column name */
  TokenAmount = "token_amount",
  /** column name */
  TokenDataId = "token_data_id",
  /** column name */
  TokenStandard = "token_standard",
}

/** Streaming cursor of the table "nft_marketplace_v2_current_nft_marketplace_token_offers" */
export type NftMarketplaceV2CurrentNftMarketplaceTokenOffersStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: NftMarketplaceV2CurrentNftMarketplaceTokenOffersStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type NftMarketplaceV2CurrentNftMarketplaceTokenOffersStreamCursorValueInput = {
  buyer?: InputMaybe<Scalars["String"]["input"]>;
  coin_type?: InputMaybe<Scalars["String"]["input"]>;
  collection_id?: InputMaybe<Scalars["String"]["input"]>;
  contract_address?: InputMaybe<Scalars["String"]["input"]>;
  entry_function_id_str?: InputMaybe<Scalars["String"]["input"]>;
  expiration_time?: InputMaybe<Scalars["numeric"]["input"]>;
  fee_schedule_id?: InputMaybe<Scalars["String"]["input"]>;
  is_deleted?: InputMaybe<Scalars["Boolean"]["input"]>;
  last_transaction_timestamp?: InputMaybe<Scalars["timestamptz"]["input"]>;
  last_transaction_version?: InputMaybe<Scalars["bigint"]["input"]>;
  marketplace?: InputMaybe<Scalars["String"]["input"]>;
  offer_id?: InputMaybe<Scalars["String"]["input"]>;
  price?: InputMaybe<Scalars["numeric"]["input"]>;
  token_amount?: InputMaybe<Scalars["numeric"]["input"]>;
  token_data_id?: InputMaybe<Scalars["String"]["input"]>;
  token_standard?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "nft_marketplace_v2.nft_marketplace_activities" */
export type NftMarketplaceV2NftMarketplaceActivities = {
  buyer?: Maybe<Scalars["String"]["output"]>;
  coin_type?: Maybe<Scalars["String"]["output"]>;
  collection_id: Scalars["String"]["output"];
  collection_name: Scalars["String"]["output"];
  contract_address: Scalars["String"]["output"];
  creator_address: Scalars["String"]["output"];
  /** An object relationship */
  current_token_data?: Maybe<CurrentTokenDatasV2>;
  entry_function_id_str: Scalars["String"]["output"];
  event_index: Scalars["bigint"]["output"];
  event_type: Scalars["String"]["output"];
  fee_schedule_id: Scalars["String"]["output"];
  marketplace: Scalars["String"]["output"];
  offer_or_listing_id: Scalars["String"]["output"];
  price: Scalars["numeric"]["output"];
  property_version?: Maybe<Scalars["String"]["output"]>;
  seller?: Maybe<Scalars["String"]["output"]>;
  token_amount: Scalars["numeric"]["output"];
  token_data_id?: Maybe<Scalars["String"]["output"]>;
  token_name?: Maybe<Scalars["String"]["output"]>;
  token_standard: Scalars["String"]["output"];
  transaction_timestamp: Scalars["timestamptz"]["output"];
  transaction_version: Scalars["bigint"]["output"];
};

/** Boolean expression to filter rows from the table "nft_marketplace_v2.nft_marketplace_activities". All fields are combined with a logical 'AND'. */
export type NftMarketplaceV2NftMarketplaceActivitiesBoolExp = {
  _and?: InputMaybe<Array<NftMarketplaceV2NftMarketplaceActivitiesBoolExp>>;
  _not?: InputMaybe<NftMarketplaceV2NftMarketplaceActivitiesBoolExp>;
  _or?: InputMaybe<Array<NftMarketplaceV2NftMarketplaceActivitiesBoolExp>>;
  buyer?: InputMaybe<StringComparisonExp>;
  coin_type?: InputMaybe<StringComparisonExp>;
  collection_id?: InputMaybe<StringComparisonExp>;
  collection_name?: InputMaybe<StringComparisonExp>;
  contract_address?: InputMaybe<StringComparisonExp>;
  creator_address?: InputMaybe<StringComparisonExp>;
  current_token_data?: InputMaybe<CurrentTokenDatasV2BoolExp>;
  entry_function_id_str?: InputMaybe<StringComparisonExp>;
  event_index?: InputMaybe<BigintComparisonExp>;
  event_type?: InputMaybe<StringComparisonExp>;
  fee_schedule_id?: InputMaybe<StringComparisonExp>;
  marketplace?: InputMaybe<StringComparisonExp>;
  offer_or_listing_id?: InputMaybe<StringComparisonExp>;
  price?: InputMaybe<NumericComparisonExp>;
  property_version?: InputMaybe<StringComparisonExp>;
  seller?: InputMaybe<StringComparisonExp>;
  token_amount?: InputMaybe<NumericComparisonExp>;
  token_data_id?: InputMaybe<StringComparisonExp>;
  token_name?: InputMaybe<StringComparisonExp>;
  token_standard?: InputMaybe<StringComparisonExp>;
  transaction_timestamp?: InputMaybe<TimestamptzComparisonExp>;
  transaction_version?: InputMaybe<BigintComparisonExp>;
};

/** Ordering options when selecting data from "nft_marketplace_v2.nft_marketplace_activities". */
export type NftMarketplaceV2NftMarketplaceActivitiesOrderBy = {
  buyer?: InputMaybe<OrderBy>;
  coin_type?: InputMaybe<OrderBy>;
  collection_id?: InputMaybe<OrderBy>;
  collection_name?: InputMaybe<OrderBy>;
  contract_address?: InputMaybe<OrderBy>;
  creator_address?: InputMaybe<OrderBy>;
  current_token_data?: InputMaybe<CurrentTokenDatasV2OrderBy>;
  entry_function_id_str?: InputMaybe<OrderBy>;
  event_index?: InputMaybe<OrderBy>;
  event_type?: InputMaybe<OrderBy>;
  fee_schedule_id?: InputMaybe<OrderBy>;
  marketplace?: InputMaybe<OrderBy>;
  offer_or_listing_id?: InputMaybe<OrderBy>;
  price?: InputMaybe<OrderBy>;
  property_version?: InputMaybe<OrderBy>;
  seller?: InputMaybe<OrderBy>;
  token_amount?: InputMaybe<OrderBy>;
  token_data_id?: InputMaybe<OrderBy>;
  token_name?: InputMaybe<OrderBy>;
  token_standard?: InputMaybe<OrderBy>;
  transaction_timestamp?: InputMaybe<OrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
};

/** select columns of table "nft_marketplace_v2.nft_marketplace_activities" */
export enum NftMarketplaceV2NftMarketplaceActivitiesSelectColumn {
  /** column name */
  Buyer = "buyer",
  /** column name */
  CoinType = "coin_type",
  /** column name */
  CollectionId = "collection_id",
  /** column name */
  CollectionName = "collection_name",
  /** column name */
  ContractAddress = "contract_address",
  /** column name */
  CreatorAddress = "creator_address",
  /** column name */
  EntryFunctionIdStr = "entry_function_id_str",
  /** column name */
  EventIndex = "event_index",
  /** column name */
  EventType = "event_type",
  /** column name */
  FeeScheduleId = "fee_schedule_id",
  /** column name */
  Marketplace = "marketplace",
  /** column name */
  OfferOrListingId = "offer_or_listing_id",
  /** column name */
  Price = "price",
  /** column name */
  PropertyVersion = "property_version",
  /** column name */
  Seller = "seller",
  /** column name */
  TokenAmount = "token_amount",
  /** column name */
  TokenDataId = "token_data_id",
  /** column name */
  TokenName = "token_name",
  /** column name */
  TokenStandard = "token_standard",
  /** column name */
  TransactionTimestamp = "transaction_timestamp",
  /** column name */
  TransactionVersion = "transaction_version",
}

/** Streaming cursor of the table "nft_marketplace_v2_nft_marketplace_activities" */
export type NftMarketplaceV2NftMarketplaceActivitiesStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: NftMarketplaceV2NftMarketplaceActivitiesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type NftMarketplaceV2NftMarketplaceActivitiesStreamCursorValueInput = {
  buyer?: InputMaybe<Scalars["String"]["input"]>;
  coin_type?: InputMaybe<Scalars["String"]["input"]>;
  collection_id?: InputMaybe<Scalars["String"]["input"]>;
  collection_name?: InputMaybe<Scalars["String"]["input"]>;
  contract_address?: InputMaybe<Scalars["String"]["input"]>;
  creator_address?: InputMaybe<Scalars["String"]["input"]>;
  entry_function_id_str?: InputMaybe<Scalars["String"]["input"]>;
  event_index?: InputMaybe<Scalars["bigint"]["input"]>;
  event_type?: InputMaybe<Scalars["String"]["input"]>;
  fee_schedule_id?: InputMaybe<Scalars["String"]["input"]>;
  marketplace?: InputMaybe<Scalars["String"]["input"]>;
  offer_or_listing_id?: InputMaybe<Scalars["String"]["input"]>;
  price?: InputMaybe<Scalars["numeric"]["input"]>;
  property_version?: InputMaybe<Scalars["String"]["input"]>;
  seller?: InputMaybe<Scalars["String"]["input"]>;
  token_amount?: InputMaybe<Scalars["numeric"]["input"]>;
  token_data_id?: InputMaybe<Scalars["String"]["input"]>;
  token_name?: InputMaybe<Scalars["String"]["input"]>;
  token_standard?: InputMaybe<Scalars["String"]["input"]>;
  transaction_timestamp?: InputMaybe<Scalars["timestamptz"]["input"]>;
  transaction_version?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** columns and relationships of "nft_metadata_crawler.parsed_asset_uris" */
export type NftMetadataCrawlerParsedAssetUris = {
  animation_optimizer_retry_count: Scalars["Int"]["output"];
  asset_uri: Scalars["String"]["output"];
  cdn_animation_uri?: Maybe<Scalars["String"]["output"]>;
  cdn_image_uri?: Maybe<Scalars["String"]["output"]>;
  cdn_json_uri?: Maybe<Scalars["String"]["output"]>;
  image_optimizer_retry_count: Scalars["Int"]["output"];
  json_parser_retry_count: Scalars["Int"]["output"];
  raw_animation_uri?: Maybe<Scalars["String"]["output"]>;
  raw_image_uri?: Maybe<Scalars["String"]["output"]>;
};

/** Boolean expression to filter rows from the table "nft_metadata_crawler.parsed_asset_uris". All fields are combined with a logical 'AND'. */
export type NftMetadataCrawlerParsedAssetUrisBoolExp = {
  _and?: InputMaybe<Array<NftMetadataCrawlerParsedAssetUrisBoolExp>>;
  _not?: InputMaybe<NftMetadataCrawlerParsedAssetUrisBoolExp>;
  _or?: InputMaybe<Array<NftMetadataCrawlerParsedAssetUrisBoolExp>>;
  animation_optimizer_retry_count?: InputMaybe<IntComparisonExp>;
  asset_uri?: InputMaybe<StringComparisonExp>;
  cdn_animation_uri?: InputMaybe<StringComparisonExp>;
  cdn_image_uri?: InputMaybe<StringComparisonExp>;
  cdn_json_uri?: InputMaybe<StringComparisonExp>;
  image_optimizer_retry_count?: InputMaybe<IntComparisonExp>;
  json_parser_retry_count?: InputMaybe<IntComparisonExp>;
  raw_animation_uri?: InputMaybe<StringComparisonExp>;
  raw_image_uri?: InputMaybe<StringComparisonExp>;
};

/** Ordering options when selecting data from "nft_metadata_crawler.parsed_asset_uris". */
export type NftMetadataCrawlerParsedAssetUrisOrderBy = {
  animation_optimizer_retry_count?: InputMaybe<OrderBy>;
  asset_uri?: InputMaybe<OrderBy>;
  cdn_animation_uri?: InputMaybe<OrderBy>;
  cdn_image_uri?: InputMaybe<OrderBy>;
  cdn_json_uri?: InputMaybe<OrderBy>;
  image_optimizer_retry_count?: InputMaybe<OrderBy>;
  json_parser_retry_count?: InputMaybe<OrderBy>;
  raw_animation_uri?: InputMaybe<OrderBy>;
  raw_image_uri?: InputMaybe<OrderBy>;
};

/** select columns of table "nft_metadata_crawler.parsed_asset_uris" */
export enum NftMetadataCrawlerParsedAssetUrisSelectColumn {
  /** column name */
  AnimationOptimizerRetryCount = "animation_optimizer_retry_count",
  /** column name */
  AssetUri = "asset_uri",
  /** column name */
  CdnAnimationUri = "cdn_animation_uri",
  /** column name */
  CdnImageUri = "cdn_image_uri",
  /** column name */
  CdnJsonUri = "cdn_json_uri",
  /** column name */
  ImageOptimizerRetryCount = "image_optimizer_retry_count",
  /** column name */
  JsonParserRetryCount = "json_parser_retry_count",
  /** column name */
  RawAnimationUri = "raw_animation_uri",
  /** column name */
  RawImageUri = "raw_image_uri",
}

/** Streaming cursor of the table "nft_metadata_crawler_parsed_asset_uris" */
export type NftMetadataCrawlerParsedAssetUrisStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: NftMetadataCrawlerParsedAssetUrisStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type NftMetadataCrawlerParsedAssetUrisStreamCursorValueInput = {
  animation_optimizer_retry_count?: InputMaybe<Scalars["Int"]["input"]>;
  asset_uri?: InputMaybe<Scalars["String"]["input"]>;
  cdn_animation_uri?: InputMaybe<Scalars["String"]["input"]>;
  cdn_image_uri?: InputMaybe<Scalars["String"]["input"]>;
  cdn_json_uri?: InputMaybe<Scalars["String"]["input"]>;
  image_optimizer_retry_count?: InputMaybe<Scalars["Int"]["input"]>;
  json_parser_retry_count?: InputMaybe<Scalars["Int"]["input"]>;
  raw_animation_uri?: InputMaybe<Scalars["String"]["input"]>;
  raw_image_uri?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "num_active_delegator_per_pool" */
export type NumActiveDelegatorPerPool = {
  num_active_delegator?: Maybe<Scalars["bigint"]["output"]>;
  pool_address?: Maybe<Scalars["String"]["output"]>;
};

/** Boolean expression to filter rows from the table "num_active_delegator_per_pool". All fields are combined with a logical 'AND'. */
export type NumActiveDelegatorPerPoolBoolExp = {
  _and?: InputMaybe<Array<NumActiveDelegatorPerPoolBoolExp>>;
  _not?: InputMaybe<NumActiveDelegatorPerPoolBoolExp>;
  _or?: InputMaybe<Array<NumActiveDelegatorPerPoolBoolExp>>;
  num_active_delegator?: InputMaybe<BigintComparisonExp>;
  pool_address?: InputMaybe<StringComparisonExp>;
};

/** Ordering options when selecting data from "num_active_delegator_per_pool". */
export type NumActiveDelegatorPerPoolOrderBy = {
  num_active_delegator?: InputMaybe<OrderBy>;
  pool_address?: InputMaybe<OrderBy>;
};

/** select columns of table "num_active_delegator_per_pool" */
export enum NumActiveDelegatorPerPoolSelectColumn {
  /** column name */
  NumActiveDelegator = "num_active_delegator",
  /** column name */
  PoolAddress = "pool_address",
}

/** Streaming cursor of the table "num_active_delegator_per_pool" */
export type NumActiveDelegatorPerPoolStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: NumActiveDelegatorPerPoolStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type NumActiveDelegatorPerPoolStreamCursorValueInput = {
  num_active_delegator?: InputMaybe<Scalars["bigint"]["input"]>;
  pool_address?: InputMaybe<Scalars["String"]["input"]>;
};

/** Boolean expression to compare columns of type "numeric". All fields are combined with logical 'AND'. */
export type NumericComparisonExp = {
  _eq?: InputMaybe<Scalars["numeric"]["input"]>;
  _gt?: InputMaybe<Scalars["numeric"]["input"]>;
  _gte?: InputMaybe<Scalars["numeric"]["input"]>;
  _in?: InputMaybe<Array<Scalars["numeric"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["numeric"]["input"]>;
  _lte?: InputMaybe<Scalars["numeric"]["input"]>;
  _neq?: InputMaybe<Scalars["numeric"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["numeric"]["input"]>>;
};

/** column ordering options */
export enum OrderBy {
  /** in ascending order, nulls last */
  Asc = "asc",
  /** in ascending order, nulls first */
  AscNullsFirst = "asc_nulls_first",
  /** in ascending order, nulls last */
  AscNullsLast = "asc_nulls_last",
  /** in descending order, nulls first */
  Desc = "desc",
  /** in descending order, nulls first */
  DescNullsFirst = "desc_nulls_first",
  /** in descending order, nulls last */
  DescNullsLast = "desc_nulls_last",
}

/** columns and relationships of "processor_status" */
export type ProcessorStatus = {
  last_success_version: Scalars["bigint"]["output"];
  last_updated: Scalars["timestamp"]["output"];
  processor: Scalars["String"]["output"];
};

/** Boolean expression to filter rows from the table "processor_status". All fields are combined with a logical 'AND'. */
export type ProcessorStatusBoolExp = {
  _and?: InputMaybe<Array<ProcessorStatusBoolExp>>;
  _not?: InputMaybe<ProcessorStatusBoolExp>;
  _or?: InputMaybe<Array<ProcessorStatusBoolExp>>;
  last_success_version?: InputMaybe<BigintComparisonExp>;
  last_updated?: InputMaybe<TimestampComparisonExp>;
  processor?: InputMaybe<StringComparisonExp>;
};

/** Ordering options when selecting data from "processor_status". */
export type ProcessorStatusOrderBy = {
  last_success_version?: InputMaybe<OrderBy>;
  last_updated?: InputMaybe<OrderBy>;
  processor?: InputMaybe<OrderBy>;
};

/** select columns of table "processor_status" */
export enum ProcessorStatusSelectColumn {
  /** column name */
  LastSuccessVersion = "last_success_version",
  /** column name */
  LastUpdated = "last_updated",
  /** column name */
  Processor = "processor",
}

/** Streaming cursor of the table "processor_status" */
export type ProcessorStatusStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: ProcessorStatusStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type ProcessorStatusStreamCursorValueInput = {
  last_success_version?: InputMaybe<Scalars["bigint"]["input"]>;
  last_updated?: InputMaybe<Scalars["timestamp"]["input"]>;
  processor?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "proposal_votes" */
export type ProposalVotes = {
  num_votes: Scalars["numeric"]["output"];
  proposal_id: Scalars["bigint"]["output"];
  should_pass: Scalars["Boolean"]["output"];
  staking_pool_address: Scalars["String"]["output"];
  transaction_timestamp: Scalars["timestamp"]["output"];
  transaction_version: Scalars["bigint"]["output"];
  voter_address: Scalars["String"]["output"];
};

/** aggregated selection of "proposal_votes" */
export type ProposalVotesAggregate = {
  aggregate?: Maybe<ProposalVotesAggregateFields>;
  nodes: Array<ProposalVotes>;
};

/** aggregate fields of "proposal_votes" */
export type ProposalVotesAggregateFields = {
  avg?: Maybe<ProposalVotesAvgFields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<ProposalVotesMaxFields>;
  min?: Maybe<ProposalVotesMinFields>;
  stddev?: Maybe<ProposalVotesStddevFields>;
  stddev_pop?: Maybe<ProposalVotesStddevPopFields>;
  stddev_samp?: Maybe<ProposalVotesStddevSampFields>;
  sum?: Maybe<ProposalVotesSumFields>;
  var_pop?: Maybe<ProposalVotesVarPopFields>;
  var_samp?: Maybe<ProposalVotesVarSampFields>;
  variance?: Maybe<ProposalVotesVarianceFields>;
};

/** aggregate fields of "proposal_votes" */
export type ProposalVotesAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<ProposalVotesSelectColumn>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** aggregate avg on columns */
export type ProposalVotesAvgFields = {
  num_votes?: Maybe<Scalars["Float"]["output"]>;
  proposal_id?: Maybe<Scalars["Float"]["output"]>;
  transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** Boolean expression to filter rows from the table "proposal_votes". All fields are combined with a logical 'AND'. */
export type ProposalVotesBoolExp = {
  _and?: InputMaybe<Array<ProposalVotesBoolExp>>;
  _not?: InputMaybe<ProposalVotesBoolExp>;
  _or?: InputMaybe<Array<ProposalVotesBoolExp>>;
  num_votes?: InputMaybe<NumericComparisonExp>;
  proposal_id?: InputMaybe<BigintComparisonExp>;
  should_pass?: InputMaybe<BooleanComparisonExp>;
  staking_pool_address?: InputMaybe<StringComparisonExp>;
  transaction_timestamp?: InputMaybe<TimestampComparisonExp>;
  transaction_version?: InputMaybe<BigintComparisonExp>;
  voter_address?: InputMaybe<StringComparisonExp>;
};

/** aggregate max on columns */
export type ProposalVotesMaxFields = {
  num_votes?: Maybe<Scalars["numeric"]["output"]>;
  proposal_id?: Maybe<Scalars["bigint"]["output"]>;
  staking_pool_address?: Maybe<Scalars["String"]["output"]>;
  transaction_timestamp?: Maybe<Scalars["timestamp"]["output"]>;
  transaction_version?: Maybe<Scalars["bigint"]["output"]>;
  voter_address?: Maybe<Scalars["String"]["output"]>;
};

/** aggregate min on columns */
export type ProposalVotesMinFields = {
  num_votes?: Maybe<Scalars["numeric"]["output"]>;
  proposal_id?: Maybe<Scalars["bigint"]["output"]>;
  staking_pool_address?: Maybe<Scalars["String"]["output"]>;
  transaction_timestamp?: Maybe<Scalars["timestamp"]["output"]>;
  transaction_version?: Maybe<Scalars["bigint"]["output"]>;
  voter_address?: Maybe<Scalars["String"]["output"]>;
};

/** Ordering options when selecting data from "proposal_votes". */
export type ProposalVotesOrderBy = {
  num_votes?: InputMaybe<OrderBy>;
  proposal_id?: InputMaybe<OrderBy>;
  should_pass?: InputMaybe<OrderBy>;
  staking_pool_address?: InputMaybe<OrderBy>;
  transaction_timestamp?: InputMaybe<OrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
  voter_address?: InputMaybe<OrderBy>;
};

/** select columns of table "proposal_votes" */
export enum ProposalVotesSelectColumn {
  /** column name */
  NumVotes = "num_votes",
  /** column name */
  ProposalId = "proposal_id",
  /** column name */
  ShouldPass = "should_pass",
  /** column name */
  StakingPoolAddress = "staking_pool_address",
  /** column name */
  TransactionTimestamp = "transaction_timestamp",
  /** column name */
  TransactionVersion = "transaction_version",
  /** column name */
  VoterAddress = "voter_address",
}

/** aggregate stddev on columns */
export type ProposalVotesStddevFields = {
  num_votes?: Maybe<Scalars["Float"]["output"]>;
  proposal_id?: Maybe<Scalars["Float"]["output"]>;
  transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_pop on columns */
export type ProposalVotesStddevPopFields = {
  num_votes?: Maybe<Scalars["Float"]["output"]>;
  proposal_id?: Maybe<Scalars["Float"]["output"]>;
  transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_samp on columns */
export type ProposalVotesStddevSampFields = {
  num_votes?: Maybe<Scalars["Float"]["output"]>;
  proposal_id?: Maybe<Scalars["Float"]["output"]>;
  transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** Streaming cursor of the table "proposal_votes" */
export type ProposalVotesStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: ProposalVotesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type ProposalVotesStreamCursorValueInput = {
  num_votes?: InputMaybe<Scalars["numeric"]["input"]>;
  proposal_id?: InputMaybe<Scalars["bigint"]["input"]>;
  should_pass?: InputMaybe<Scalars["Boolean"]["input"]>;
  staking_pool_address?: InputMaybe<Scalars["String"]["input"]>;
  transaction_timestamp?: InputMaybe<Scalars["timestamp"]["input"]>;
  transaction_version?: InputMaybe<Scalars["bigint"]["input"]>;
  voter_address?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregate sum on columns */
export type ProposalVotesSumFields = {
  num_votes?: Maybe<Scalars["numeric"]["output"]>;
  proposal_id?: Maybe<Scalars["bigint"]["output"]>;
  transaction_version?: Maybe<Scalars["bigint"]["output"]>;
};

/** aggregate var_pop on columns */
export type ProposalVotesVarPopFields = {
  num_votes?: Maybe<Scalars["Float"]["output"]>;
  proposal_id?: Maybe<Scalars["Float"]["output"]>;
  transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate var_samp on columns */
export type ProposalVotesVarSampFields = {
  num_votes?: Maybe<Scalars["Float"]["output"]>;
  proposal_id?: Maybe<Scalars["Float"]["output"]>;
  transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate variance on columns */
export type ProposalVotesVarianceFields = {
  num_votes?: Maybe<Scalars["Float"]["output"]>;
  proposal_id?: Maybe<Scalars["Float"]["output"]>;
  transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

export type QueryRoot = {
  /** fetch data from the table: "account_transactions" */
  account_transactions: Array<AccountTransactions>;
  /** fetch aggregated fields from the table: "account_transactions" */
  account_transactions_aggregate: AccountTransactionsAggregate;
  /** fetch data from the table: "account_transactions" using primary key columns */
  account_transactions_by_pk?: Maybe<AccountTransactions>;
  /** fetch data from the table: "address_events_summary" */
  address_events_summary: Array<AddressEventsSummary>;
  /** fetch data from the table: "address_version_from_events" */
  address_version_from_events: Array<AddressVersionFromEvents>;
  /** fetch aggregated fields from the table: "address_version_from_events" */
  address_version_from_events_aggregate: AddressVersionFromEventsAggregate;
  /** fetch data from the table: "address_version_from_move_resources" */
  address_version_from_move_resources: Array<AddressVersionFromMoveResources>;
  /** fetch aggregated fields from the table: "address_version_from_move_resources" */
  address_version_from_move_resources_aggregate: AddressVersionFromMoveResourcesAggregate;
  /** fetch data from the table: "block_metadata_transactions" */
  block_metadata_transactions: Array<BlockMetadataTransactions>;
  /** fetch data from the table: "block_metadata_transactions" using primary key columns */
  block_metadata_transactions_by_pk?: Maybe<BlockMetadataTransactions>;
  /** An array relationship */
  coin_activities: Array<CoinActivities>;
  /** An aggregate relationship */
  coin_activities_aggregate: CoinActivitiesAggregate;
  /** fetch data from the table: "coin_activities" using primary key columns */
  coin_activities_by_pk?: Maybe<CoinActivities>;
  /** fetch data from the table: "coin_balances" */
  coin_balances: Array<CoinBalances>;
  /** fetch data from the table: "coin_balances" using primary key columns */
  coin_balances_by_pk?: Maybe<CoinBalances>;
  /** fetch data from the table: "coin_infos" */
  coin_infos: Array<CoinInfos>;
  /** fetch data from the table: "coin_infos" using primary key columns */
  coin_infos_by_pk?: Maybe<CoinInfos>;
  /** fetch data from the table: "coin_supply" */
  coin_supply: Array<CoinSupply>;
  /** fetch data from the table: "coin_supply" using primary key columns */
  coin_supply_by_pk?: Maybe<CoinSupply>;
  /** fetch data from the table: "collection_datas" */
  collection_datas: Array<CollectionDatas>;
  /** fetch data from the table: "collection_datas" using primary key columns */
  collection_datas_by_pk?: Maybe<CollectionDatas>;
  /** fetch data from the table: "current_ans_lookup" */
  current_ans_lookup: Array<CurrentAnsLookup>;
  /** fetch data from the table: "current_ans_lookup" using primary key columns */
  current_ans_lookup_by_pk?: Maybe<CurrentAnsLookup>;
  /** fetch data from the table: "current_ans_lookup_v2" */
  current_ans_lookup_v2: Array<CurrentAnsLookupV2>;
  /** fetch data from the table: "current_ans_lookup_v2" using primary key columns */
  current_ans_lookup_v2_by_pk?: Maybe<CurrentAnsLookupV2>;
  /** fetch data from the table: "current_aptos_names" */
  current_aptos_names: Array<CurrentAptosNames>;
  /** fetch aggregated fields from the table: "current_aptos_names" */
  current_aptos_names_aggregate: CurrentAptosNamesAggregate;
  /** fetch data from the table: "current_coin_balances" */
  current_coin_balances: Array<CurrentCoinBalances>;
  /** fetch data from the table: "current_coin_balances" using primary key columns */
  current_coin_balances_by_pk?: Maybe<CurrentCoinBalances>;
  /** fetch data from the table: "current_collection_datas" */
  current_collection_datas: Array<CurrentCollectionDatas>;
  /** fetch data from the table: "current_collection_datas" using primary key columns */
  current_collection_datas_by_pk?: Maybe<CurrentCollectionDatas>;
  /** fetch data from the table: "current_collection_ownership_v2_view" */
  current_collection_ownership_v2_view: Array<CurrentCollectionOwnershipV2View>;
  /** fetch aggregated fields from the table: "current_collection_ownership_v2_view" */
  current_collection_ownership_v2_view_aggregate: CurrentCollectionOwnershipV2ViewAggregate;
  /** fetch data from the table: "current_collections_v2" */
  current_collections_v2: Array<CurrentCollectionsV2>;
  /** fetch data from the table: "current_collections_v2" using primary key columns */
  current_collections_v2_by_pk?: Maybe<CurrentCollectionsV2>;
  /** fetch data from the table: "current_delegated_staking_pool_balances" */
  current_delegated_staking_pool_balances: Array<CurrentDelegatedStakingPoolBalances>;
  /** fetch data from the table: "current_delegated_staking_pool_balances" using primary key columns */
  current_delegated_staking_pool_balances_by_pk?: Maybe<CurrentDelegatedStakingPoolBalances>;
  /** fetch data from the table: "current_delegated_voter" */
  current_delegated_voter: Array<CurrentDelegatedVoter>;
  /** fetch data from the table: "current_delegated_voter" using primary key columns */
  current_delegated_voter_by_pk?: Maybe<CurrentDelegatedVoter>;
  /** fetch data from the table: "current_delegator_balances" */
  current_delegator_balances: Array<CurrentDelegatorBalances>;
  /** fetch data from the table: "current_delegator_balances" using primary key columns */
  current_delegator_balances_by_pk?: Maybe<CurrentDelegatorBalances>;
  /** fetch data from the table: "current_fungible_asset_balances" */
  current_fungible_asset_balances: Array<CurrentFungibleAssetBalances>;
  /** fetch aggregated fields from the table: "current_fungible_asset_balances" */
  current_fungible_asset_balances_aggregate: CurrentFungibleAssetBalancesAggregate;
  /** fetch data from the table: "current_fungible_asset_balances" using primary key columns */
  current_fungible_asset_balances_by_pk?: Maybe<CurrentFungibleAssetBalances>;
  /** fetch data from the table: "current_objects" */
  current_objects: Array<CurrentObjects>;
  /** fetch data from the table: "current_objects" using primary key columns */
  current_objects_by_pk?: Maybe<CurrentObjects>;
  /** fetch data from the table: "current_staking_pool_voter" */
  current_staking_pool_voter: Array<CurrentStakingPoolVoter>;
  /** fetch data from the table: "current_staking_pool_voter" using primary key columns */
  current_staking_pool_voter_by_pk?: Maybe<CurrentStakingPoolVoter>;
  /** fetch data from the table: "current_table_items" */
  current_table_items: Array<CurrentTableItems>;
  /** fetch data from the table: "current_table_items" using primary key columns */
  current_table_items_by_pk?: Maybe<CurrentTableItems>;
  /** fetch data from the table: "current_token_datas" */
  current_token_datas: Array<CurrentTokenDatas>;
  /** fetch data from the table: "current_token_datas" using primary key columns */
  current_token_datas_by_pk?: Maybe<CurrentTokenDatas>;
  /** fetch data from the table: "current_token_datas_v2" */
  current_token_datas_v2: Array<CurrentTokenDatasV2>;
  /** fetch data from the table: "current_token_datas_v2" using primary key columns */
  current_token_datas_v2_by_pk?: Maybe<CurrentTokenDatasV2>;
  /** fetch data from the table: "current_token_ownerships" */
  current_token_ownerships: Array<CurrentTokenOwnerships>;
  /** fetch aggregated fields from the table: "current_token_ownerships" */
  current_token_ownerships_aggregate: CurrentTokenOwnershipsAggregate;
  /** fetch data from the table: "current_token_ownerships" using primary key columns */
  current_token_ownerships_by_pk?: Maybe<CurrentTokenOwnerships>;
  /** fetch data from the table: "current_token_ownerships_v2" */
  current_token_ownerships_v2: Array<CurrentTokenOwnershipsV2>;
  /** fetch aggregated fields from the table: "current_token_ownerships_v2" */
  current_token_ownerships_v2_aggregate: CurrentTokenOwnershipsV2Aggregate;
  /** fetch data from the table: "current_token_ownerships_v2" using primary key columns */
  current_token_ownerships_v2_by_pk?: Maybe<CurrentTokenOwnershipsV2>;
  /** fetch data from the table: "current_token_pending_claims" */
  current_token_pending_claims: Array<CurrentTokenPendingClaims>;
  /** fetch data from the table: "current_token_pending_claims" using primary key columns */
  current_token_pending_claims_by_pk?: Maybe<CurrentTokenPendingClaims>;
  /** An array relationship */
  delegated_staking_activities: Array<DelegatedStakingActivities>;
  /** fetch data from the table: "delegated_staking_activities" using primary key columns */
  delegated_staking_activities_by_pk?: Maybe<DelegatedStakingActivities>;
  /** fetch data from the table: "delegated_staking_pools" */
  delegated_staking_pools: Array<DelegatedStakingPools>;
  /** fetch data from the table: "delegated_staking_pools" using primary key columns */
  delegated_staking_pools_by_pk?: Maybe<DelegatedStakingPools>;
  /** fetch data from the table: "delegator_distinct_pool" */
  delegator_distinct_pool: Array<DelegatorDistinctPool>;
  /** fetch aggregated fields from the table: "delegator_distinct_pool" */
  delegator_distinct_pool_aggregate: DelegatorDistinctPoolAggregate;
  /** fetch data from the table: "events" */
  events: Array<Events>;
  /** fetch data from the table: "events" using primary key columns */
  events_by_pk?: Maybe<Events>;
  /** An array relationship */
  fungible_asset_activities: Array<FungibleAssetActivities>;
  /** fetch data from the table: "fungible_asset_activities" using primary key columns */
  fungible_asset_activities_by_pk?: Maybe<FungibleAssetActivities>;
  /** fetch data from the table: "fungible_asset_metadata" */
  fungible_asset_metadata: Array<FungibleAssetMetadata>;
  /** fetch data from the table: "fungible_asset_metadata" using primary key columns */
  fungible_asset_metadata_by_pk?: Maybe<FungibleAssetMetadata>;
  /** fetch data from the table: "indexer_status" */
  indexer_status: Array<IndexerStatus>;
  /** fetch data from the table: "indexer_status" using primary key columns */
  indexer_status_by_pk?: Maybe<IndexerStatus>;
  /** fetch data from the table: "ledger_infos" */
  ledger_infos: Array<LedgerInfos>;
  /** fetch data from the table: "ledger_infos" using primary key columns */
  ledger_infos_by_pk?: Maybe<LedgerInfos>;
  /** fetch data from the table: "move_resources" */
  move_resources: Array<MoveResources>;
  /** fetch aggregated fields from the table: "move_resources" */
  move_resources_aggregate: MoveResourcesAggregate;
  /** fetch data from the table: "nft_marketplace_v2.current_nft_marketplace_auctions" */
  nft_marketplace_v2_current_nft_marketplace_auctions: Array<NftMarketplaceV2CurrentNftMarketplaceAuctions>;
  /** fetch data from the table: "nft_marketplace_v2.current_nft_marketplace_auctions" using primary key columns */
  nft_marketplace_v2_current_nft_marketplace_auctions_by_pk?: Maybe<NftMarketplaceV2CurrentNftMarketplaceAuctions>;
  /** fetch data from the table: "nft_marketplace_v2.current_nft_marketplace_collection_offers" */
  nft_marketplace_v2_current_nft_marketplace_collection_offers: Array<NftMarketplaceV2CurrentNftMarketplaceCollectionOffers>;
  /** fetch data from the table: "nft_marketplace_v2.current_nft_marketplace_collection_offers" using primary key columns */
  nft_marketplace_v2_current_nft_marketplace_collection_offers_by_pk?: Maybe<NftMarketplaceV2CurrentNftMarketplaceCollectionOffers>;
  /** fetch data from the table: "nft_marketplace_v2.current_nft_marketplace_listings" */
  nft_marketplace_v2_current_nft_marketplace_listings: Array<NftMarketplaceV2CurrentNftMarketplaceListings>;
  /** fetch data from the table: "nft_marketplace_v2.current_nft_marketplace_listings" using primary key columns */
  nft_marketplace_v2_current_nft_marketplace_listings_by_pk?: Maybe<NftMarketplaceV2CurrentNftMarketplaceListings>;
  /** fetch data from the table: "nft_marketplace_v2.current_nft_marketplace_token_offers" */
  nft_marketplace_v2_current_nft_marketplace_token_offers: Array<NftMarketplaceV2CurrentNftMarketplaceTokenOffers>;
  /** fetch data from the table: "nft_marketplace_v2.current_nft_marketplace_token_offers" using primary key columns */
  nft_marketplace_v2_current_nft_marketplace_token_offers_by_pk?: Maybe<NftMarketplaceV2CurrentNftMarketplaceTokenOffers>;
  /** fetch data from the table: "nft_marketplace_v2.nft_marketplace_activities" */
  nft_marketplace_v2_nft_marketplace_activities: Array<NftMarketplaceV2NftMarketplaceActivities>;
  /** fetch data from the table: "nft_marketplace_v2.nft_marketplace_activities" using primary key columns */
  nft_marketplace_v2_nft_marketplace_activities_by_pk?: Maybe<NftMarketplaceV2NftMarketplaceActivities>;
  /** fetch data from the table: "nft_metadata_crawler.parsed_asset_uris" */
  nft_metadata_crawler_parsed_asset_uris: Array<NftMetadataCrawlerParsedAssetUris>;
  /** fetch data from the table: "nft_metadata_crawler.parsed_asset_uris" using primary key columns */
  nft_metadata_crawler_parsed_asset_uris_by_pk?: Maybe<NftMetadataCrawlerParsedAssetUris>;
  /** fetch data from the table: "num_active_delegator_per_pool" */
  num_active_delegator_per_pool: Array<NumActiveDelegatorPerPool>;
  /** fetch data from the table: "processor_status" */
  processor_status: Array<ProcessorStatus>;
  /** fetch data from the table: "processor_status" using primary key columns */
  processor_status_by_pk?: Maybe<ProcessorStatus>;
  /** fetch data from the table: "proposal_votes" */
  proposal_votes: Array<ProposalVotes>;
  /** fetch aggregated fields from the table: "proposal_votes" */
  proposal_votes_aggregate: ProposalVotesAggregate;
  /** fetch data from the table: "proposal_votes" using primary key columns */
  proposal_votes_by_pk?: Maybe<ProposalVotes>;
  /** fetch data from the table: "table_items" */
  table_items: Array<TableItems>;
  /** fetch data from the table: "table_items" using primary key columns */
  table_items_by_pk?: Maybe<TableItems>;
  /** fetch data from the table: "table_metadatas" */
  table_metadatas: Array<TableMetadatas>;
  /** fetch data from the table: "table_metadatas" using primary key columns */
  table_metadatas_by_pk?: Maybe<TableMetadatas>;
  /** An array relationship */
  token_activities: Array<TokenActivities>;
  /** An aggregate relationship */
  token_activities_aggregate: TokenActivitiesAggregate;
  /** fetch data from the table: "token_activities" using primary key columns */
  token_activities_by_pk?: Maybe<TokenActivities>;
  /** An array relationship */
  token_activities_v2: Array<TokenActivitiesV2>;
  /** An aggregate relationship */
  token_activities_v2_aggregate: TokenActivitiesV2Aggregate;
  /** fetch data from the table: "token_activities_v2" using primary key columns */
  token_activities_v2_by_pk?: Maybe<TokenActivitiesV2>;
  /** fetch data from the table: "token_datas" */
  token_datas: Array<TokenDatas>;
  /** fetch data from the table: "token_datas" using primary key columns */
  token_datas_by_pk?: Maybe<TokenDatas>;
  /** fetch data from the table: "token_ownerships" */
  token_ownerships: Array<TokenOwnerships>;
  /** fetch data from the table: "token_ownerships" using primary key columns */
  token_ownerships_by_pk?: Maybe<TokenOwnerships>;
  /** fetch data from the table: "tokens" */
  tokens: Array<Tokens>;
  /** fetch data from the table: "tokens" using primary key columns */
  tokens_by_pk?: Maybe<Tokens>;
  /** fetch data from the table: "user_transactions" */
  user_transactions: Array<UserTransactions>;
  /** fetch data from the table: "user_transactions" using primary key columns */
  user_transactions_by_pk?: Maybe<UserTransactions>;
};

export type QueryRootAccountTransactionsArgs = {
  distinct_on?: InputMaybe<Array<AccountTransactionsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<AccountTransactionsOrderBy>>;
  where?: InputMaybe<AccountTransactionsBoolExp>;
};

export type QueryRootAccountTransactionsAggregateArgs = {
  distinct_on?: InputMaybe<Array<AccountTransactionsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<AccountTransactionsOrderBy>>;
  where?: InputMaybe<AccountTransactionsBoolExp>;
};

export type QueryRootAccountTransactionsByPkArgs = {
  account_address: Scalars["String"]["input"];
  transaction_version: Scalars["bigint"]["input"];
};

export type QueryRootAddressEventsSummaryArgs = {
  distinct_on?: InputMaybe<Array<AddressEventsSummarySelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<AddressEventsSummaryOrderBy>>;
  where?: InputMaybe<AddressEventsSummaryBoolExp>;
};

export type QueryRootAddressVersionFromEventsArgs = {
  distinct_on?: InputMaybe<Array<AddressVersionFromEventsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<AddressVersionFromEventsOrderBy>>;
  where?: InputMaybe<AddressVersionFromEventsBoolExp>;
};

export type QueryRootAddressVersionFromEventsAggregateArgs = {
  distinct_on?: InputMaybe<Array<AddressVersionFromEventsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<AddressVersionFromEventsOrderBy>>;
  where?: InputMaybe<AddressVersionFromEventsBoolExp>;
};

export type QueryRootAddressVersionFromMoveResourcesArgs = {
  distinct_on?: InputMaybe<Array<AddressVersionFromMoveResourcesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<AddressVersionFromMoveResourcesOrderBy>>;
  where?: InputMaybe<AddressVersionFromMoveResourcesBoolExp>;
};

export type QueryRootAddressVersionFromMoveResourcesAggregateArgs = {
  distinct_on?: InputMaybe<Array<AddressVersionFromMoveResourcesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<AddressVersionFromMoveResourcesOrderBy>>;
  where?: InputMaybe<AddressVersionFromMoveResourcesBoolExp>;
};

export type QueryRootBlockMetadataTransactionsArgs = {
  distinct_on?: InputMaybe<Array<BlockMetadataTransactionsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<BlockMetadataTransactionsOrderBy>>;
  where?: InputMaybe<BlockMetadataTransactionsBoolExp>;
};

export type QueryRootBlockMetadataTransactionsByPkArgs = {
  version: Scalars["bigint"]["input"];
};

export type QueryRootCoinActivitiesArgs = {
  distinct_on?: InputMaybe<Array<CoinActivitiesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CoinActivitiesOrderBy>>;
  where?: InputMaybe<CoinActivitiesBoolExp>;
};

export type QueryRootCoinActivitiesAggregateArgs = {
  distinct_on?: InputMaybe<Array<CoinActivitiesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CoinActivitiesOrderBy>>;
  where?: InputMaybe<CoinActivitiesBoolExp>;
};

export type QueryRootCoinActivitiesByPkArgs = {
  event_account_address: Scalars["String"]["input"];
  event_creation_number: Scalars["bigint"]["input"];
  event_sequence_number: Scalars["bigint"]["input"];
  transaction_version: Scalars["bigint"]["input"];
};

export type QueryRootCoinBalancesArgs = {
  distinct_on?: InputMaybe<Array<CoinBalancesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CoinBalancesOrderBy>>;
  where?: InputMaybe<CoinBalancesBoolExp>;
};

export type QueryRootCoinBalancesByPkArgs = {
  coin_type_hash: Scalars["String"]["input"];
  owner_address: Scalars["String"]["input"];
  transaction_version: Scalars["bigint"]["input"];
};

export type QueryRootCoinInfosArgs = {
  distinct_on?: InputMaybe<Array<CoinInfosSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CoinInfosOrderBy>>;
  where?: InputMaybe<CoinInfosBoolExp>;
};

export type QueryRootCoinInfosByPkArgs = {
  coin_type_hash: Scalars["String"]["input"];
};

export type QueryRootCoinSupplyArgs = {
  distinct_on?: InputMaybe<Array<CoinSupplySelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CoinSupplyOrderBy>>;
  where?: InputMaybe<CoinSupplyBoolExp>;
};

export type QueryRootCoinSupplyByPkArgs = {
  coin_type_hash: Scalars["String"]["input"];
  transaction_version: Scalars["bigint"]["input"];
};

export type QueryRootCollectionDatasArgs = {
  distinct_on?: InputMaybe<Array<CollectionDatasSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CollectionDatasOrderBy>>;
  where?: InputMaybe<CollectionDatasBoolExp>;
};

export type QueryRootCollectionDatasByPkArgs = {
  collection_data_id_hash: Scalars["String"]["input"];
  transaction_version: Scalars["bigint"]["input"];
};

export type QueryRootCurrentAnsLookupArgs = {
  distinct_on?: InputMaybe<Array<CurrentAnsLookupSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentAnsLookupOrderBy>>;
  where?: InputMaybe<CurrentAnsLookupBoolExp>;
};

export type QueryRootCurrentAnsLookupByPkArgs = {
  domain: Scalars["String"]["input"];
  subdomain: Scalars["String"]["input"];
};

export type QueryRootCurrentAnsLookupV2Args = {
  distinct_on?: InputMaybe<Array<CurrentAnsLookupV2SelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentAnsLookupV2OrderBy>>;
  where?: InputMaybe<CurrentAnsLookupV2BoolExp>;
};

export type QueryRootCurrentAnsLookupV2ByPkArgs = {
  domain: Scalars["String"]["input"];
  subdomain: Scalars["String"]["input"];
  token_standard: Scalars["String"]["input"];
};

export type QueryRootCurrentAptosNamesArgs = {
  distinct_on?: InputMaybe<Array<CurrentAptosNamesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentAptosNamesOrderBy>>;
  where?: InputMaybe<CurrentAptosNamesBoolExp>;
};

export type QueryRootCurrentAptosNamesAggregateArgs = {
  distinct_on?: InputMaybe<Array<CurrentAptosNamesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentAptosNamesOrderBy>>;
  where?: InputMaybe<CurrentAptosNamesBoolExp>;
};

export type QueryRootCurrentCoinBalancesArgs = {
  distinct_on?: InputMaybe<Array<CurrentCoinBalancesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentCoinBalancesOrderBy>>;
  where?: InputMaybe<CurrentCoinBalancesBoolExp>;
};

export type QueryRootCurrentCoinBalancesByPkArgs = {
  coin_type_hash: Scalars["String"]["input"];
  owner_address: Scalars["String"]["input"];
};

export type QueryRootCurrentCollectionDatasArgs = {
  distinct_on?: InputMaybe<Array<CurrentCollectionDatasSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentCollectionDatasOrderBy>>;
  where?: InputMaybe<CurrentCollectionDatasBoolExp>;
};

export type QueryRootCurrentCollectionDatasByPkArgs = {
  collection_data_id_hash: Scalars["String"]["input"];
};

export type QueryRootCurrentCollectionOwnershipV2ViewArgs = {
  distinct_on?: InputMaybe<Array<CurrentCollectionOwnershipV2ViewSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentCollectionOwnershipV2ViewOrderBy>>;
  where?: InputMaybe<CurrentCollectionOwnershipV2ViewBoolExp>;
};

export type QueryRootCurrentCollectionOwnershipV2ViewAggregateArgs = {
  distinct_on?: InputMaybe<Array<CurrentCollectionOwnershipV2ViewSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentCollectionOwnershipV2ViewOrderBy>>;
  where?: InputMaybe<CurrentCollectionOwnershipV2ViewBoolExp>;
};

export type QueryRootCurrentCollectionsV2Args = {
  distinct_on?: InputMaybe<Array<CurrentCollectionsV2SelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentCollectionsV2OrderBy>>;
  where?: InputMaybe<CurrentCollectionsV2BoolExp>;
};

export type QueryRootCurrentCollectionsV2ByPkArgs = {
  collection_id: Scalars["String"]["input"];
};

export type QueryRootCurrentDelegatedStakingPoolBalancesArgs = {
  distinct_on?: InputMaybe<Array<CurrentDelegatedStakingPoolBalancesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentDelegatedStakingPoolBalancesOrderBy>>;
  where?: InputMaybe<CurrentDelegatedStakingPoolBalancesBoolExp>;
};

export type QueryRootCurrentDelegatedStakingPoolBalancesByPkArgs = {
  staking_pool_address: Scalars["String"]["input"];
};

export type QueryRootCurrentDelegatedVoterArgs = {
  distinct_on?: InputMaybe<Array<CurrentDelegatedVoterSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentDelegatedVoterOrderBy>>;
  where?: InputMaybe<CurrentDelegatedVoterBoolExp>;
};

export type QueryRootCurrentDelegatedVoterByPkArgs = {
  delegation_pool_address: Scalars["String"]["input"];
  delegator_address: Scalars["String"]["input"];
};

export type QueryRootCurrentDelegatorBalancesArgs = {
  distinct_on?: InputMaybe<Array<CurrentDelegatorBalancesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentDelegatorBalancesOrderBy>>;
  where?: InputMaybe<CurrentDelegatorBalancesBoolExp>;
};

export type QueryRootCurrentDelegatorBalancesByPkArgs = {
  delegator_address: Scalars["String"]["input"];
  pool_address: Scalars["String"]["input"];
  pool_type: Scalars["String"]["input"];
  table_handle: Scalars["String"]["input"];
};

export type QueryRootCurrentFungibleAssetBalancesArgs = {
  distinct_on?: InputMaybe<Array<CurrentFungibleAssetBalancesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentFungibleAssetBalancesOrderBy>>;
  where?: InputMaybe<CurrentFungibleAssetBalancesBoolExp>;
};

export type QueryRootCurrentFungibleAssetBalancesAggregateArgs = {
  distinct_on?: InputMaybe<Array<CurrentFungibleAssetBalancesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentFungibleAssetBalancesOrderBy>>;
  where?: InputMaybe<CurrentFungibleAssetBalancesBoolExp>;
};

export type QueryRootCurrentFungibleAssetBalancesByPkArgs = {
  storage_id: Scalars["String"]["input"];
};

export type QueryRootCurrentObjectsArgs = {
  distinct_on?: InputMaybe<Array<CurrentObjectsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentObjectsOrderBy>>;
  where?: InputMaybe<CurrentObjectsBoolExp>;
};

export type QueryRootCurrentObjectsByPkArgs = {
  object_address: Scalars["String"]["input"];
};

export type QueryRootCurrentStakingPoolVoterArgs = {
  distinct_on?: InputMaybe<Array<CurrentStakingPoolVoterSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentStakingPoolVoterOrderBy>>;
  where?: InputMaybe<CurrentStakingPoolVoterBoolExp>;
};

export type QueryRootCurrentStakingPoolVoterByPkArgs = {
  staking_pool_address: Scalars["String"]["input"];
};

export type QueryRootCurrentTableItemsArgs = {
  distinct_on?: InputMaybe<Array<CurrentTableItemsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentTableItemsOrderBy>>;
  where?: InputMaybe<CurrentTableItemsBoolExp>;
};

export type QueryRootCurrentTableItemsByPkArgs = {
  key_hash: Scalars["String"]["input"];
  table_handle: Scalars["String"]["input"];
};

export type QueryRootCurrentTokenDatasArgs = {
  distinct_on?: InputMaybe<Array<CurrentTokenDatasSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentTokenDatasOrderBy>>;
  where?: InputMaybe<CurrentTokenDatasBoolExp>;
};

export type QueryRootCurrentTokenDatasByPkArgs = {
  token_data_id_hash: Scalars["String"]["input"];
};

export type QueryRootCurrentTokenDatasV2Args = {
  distinct_on?: InputMaybe<Array<CurrentTokenDatasV2SelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentTokenDatasV2OrderBy>>;
  where?: InputMaybe<CurrentTokenDatasV2BoolExp>;
};

export type QueryRootCurrentTokenDatasV2ByPkArgs = {
  token_data_id: Scalars["String"]["input"];
};

export type QueryRootCurrentTokenOwnershipsArgs = {
  distinct_on?: InputMaybe<Array<CurrentTokenOwnershipsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentTokenOwnershipsOrderBy>>;
  where?: InputMaybe<CurrentTokenOwnershipsBoolExp>;
};

export type QueryRootCurrentTokenOwnershipsAggregateArgs = {
  distinct_on?: InputMaybe<Array<CurrentTokenOwnershipsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentTokenOwnershipsOrderBy>>;
  where?: InputMaybe<CurrentTokenOwnershipsBoolExp>;
};

export type QueryRootCurrentTokenOwnershipsByPkArgs = {
  owner_address: Scalars["String"]["input"];
  property_version: Scalars["numeric"]["input"];
  token_data_id_hash: Scalars["String"]["input"];
};

export type QueryRootCurrentTokenOwnershipsV2Args = {
  distinct_on?: InputMaybe<Array<CurrentTokenOwnershipsV2SelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentTokenOwnershipsV2OrderBy>>;
  where?: InputMaybe<CurrentTokenOwnershipsV2BoolExp>;
};

export type QueryRootCurrentTokenOwnershipsV2AggregateArgs = {
  distinct_on?: InputMaybe<Array<CurrentTokenOwnershipsV2SelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentTokenOwnershipsV2OrderBy>>;
  where?: InputMaybe<CurrentTokenOwnershipsV2BoolExp>;
};

export type QueryRootCurrentTokenOwnershipsV2ByPkArgs = {
  owner_address: Scalars["String"]["input"];
  property_version_v1: Scalars["numeric"]["input"];
  storage_id: Scalars["String"]["input"];
  token_data_id: Scalars["String"]["input"];
};

export type QueryRootCurrentTokenPendingClaimsArgs = {
  distinct_on?: InputMaybe<Array<CurrentTokenPendingClaimsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentTokenPendingClaimsOrderBy>>;
  where?: InputMaybe<CurrentTokenPendingClaimsBoolExp>;
};

export type QueryRootCurrentTokenPendingClaimsByPkArgs = {
  from_address: Scalars["String"]["input"];
  property_version: Scalars["numeric"]["input"];
  to_address: Scalars["String"]["input"];
  token_data_id_hash: Scalars["String"]["input"];
};

export type QueryRootDelegatedStakingActivitiesArgs = {
  distinct_on?: InputMaybe<Array<DelegatedStakingActivitiesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<DelegatedStakingActivitiesOrderBy>>;
  where?: InputMaybe<DelegatedStakingActivitiesBoolExp>;
};

export type QueryRootDelegatedStakingActivitiesByPkArgs = {
  event_index: Scalars["bigint"]["input"];
  transaction_version: Scalars["bigint"]["input"];
};

export type QueryRootDelegatedStakingPoolsArgs = {
  distinct_on?: InputMaybe<Array<DelegatedStakingPoolsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<DelegatedStakingPoolsOrderBy>>;
  where?: InputMaybe<DelegatedStakingPoolsBoolExp>;
};

export type QueryRootDelegatedStakingPoolsByPkArgs = {
  staking_pool_address: Scalars["String"]["input"];
};

export type QueryRootDelegatorDistinctPoolArgs = {
  distinct_on?: InputMaybe<Array<DelegatorDistinctPoolSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<DelegatorDistinctPoolOrderBy>>;
  where?: InputMaybe<DelegatorDistinctPoolBoolExp>;
};

export type QueryRootDelegatorDistinctPoolAggregateArgs = {
  distinct_on?: InputMaybe<Array<DelegatorDistinctPoolSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<DelegatorDistinctPoolOrderBy>>;
  where?: InputMaybe<DelegatorDistinctPoolBoolExp>;
};

export type QueryRootEventsArgs = {
  distinct_on?: InputMaybe<Array<EventsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<EventsOrderBy>>;
  where?: InputMaybe<EventsBoolExp>;
};

export type QueryRootEventsByPkArgs = {
  event_index: Scalars["bigint"]["input"];
  transaction_version: Scalars["bigint"]["input"];
};

export type QueryRootFungibleAssetActivitiesArgs = {
  distinct_on?: InputMaybe<Array<FungibleAssetActivitiesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<FungibleAssetActivitiesOrderBy>>;
  where?: InputMaybe<FungibleAssetActivitiesBoolExp>;
};

export type QueryRootFungibleAssetActivitiesByPkArgs = {
  event_index: Scalars["bigint"]["input"];
  transaction_version: Scalars["bigint"]["input"];
};

export type QueryRootFungibleAssetMetadataArgs = {
  distinct_on?: InputMaybe<Array<FungibleAssetMetadataSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<FungibleAssetMetadataOrderBy>>;
  where?: InputMaybe<FungibleAssetMetadataBoolExp>;
};

export type QueryRootFungibleAssetMetadataByPkArgs = {
  asset_type: Scalars["String"]["input"];
};

export type QueryRootIndexerStatusArgs = {
  distinct_on?: InputMaybe<Array<IndexerStatusSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<IndexerStatusOrderBy>>;
  where?: InputMaybe<IndexerStatusBoolExp>;
};

export type QueryRootIndexerStatusByPkArgs = {
  db: Scalars["String"]["input"];
};

export type QueryRootLedgerInfosArgs = {
  distinct_on?: InputMaybe<Array<LedgerInfosSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<LedgerInfosOrderBy>>;
  where?: InputMaybe<LedgerInfosBoolExp>;
};

export type QueryRootLedgerInfosByPkArgs = {
  chain_id: Scalars["bigint"]["input"];
};

export type QueryRootMoveResourcesArgs = {
  distinct_on?: InputMaybe<Array<MoveResourcesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<MoveResourcesOrderBy>>;
  where?: InputMaybe<MoveResourcesBoolExp>;
};

export type QueryRootMoveResourcesAggregateArgs = {
  distinct_on?: InputMaybe<Array<MoveResourcesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<MoveResourcesOrderBy>>;
  where?: InputMaybe<MoveResourcesBoolExp>;
};

export type QueryRootNftMarketplaceV2CurrentNftMarketplaceAuctionsArgs = {
  distinct_on?: InputMaybe<Array<NftMarketplaceV2CurrentNftMarketplaceAuctionsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<NftMarketplaceV2CurrentNftMarketplaceAuctionsOrderBy>>;
  where?: InputMaybe<NftMarketplaceV2CurrentNftMarketplaceAuctionsBoolExp>;
};

export type QueryRootNftMarketplaceV2CurrentNftMarketplaceAuctionsByPkArgs = {
  listing_id: Scalars["String"]["input"];
  token_data_id: Scalars["String"]["input"];
};

export type QueryRootNftMarketplaceV2CurrentNftMarketplaceCollectionOffersArgs = {
  distinct_on?: InputMaybe<Array<NftMarketplaceV2CurrentNftMarketplaceCollectionOffersSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<NftMarketplaceV2CurrentNftMarketplaceCollectionOffersOrderBy>>;
  where?: InputMaybe<NftMarketplaceV2CurrentNftMarketplaceCollectionOffersBoolExp>;
};

export type QueryRootNftMarketplaceV2CurrentNftMarketplaceCollectionOffersByPkArgs = {
  collection_id: Scalars["String"]["input"];
  collection_offer_id: Scalars["String"]["input"];
};

export type QueryRootNftMarketplaceV2CurrentNftMarketplaceListingsArgs = {
  distinct_on?: InputMaybe<Array<NftMarketplaceV2CurrentNftMarketplaceListingsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<NftMarketplaceV2CurrentNftMarketplaceListingsOrderBy>>;
  where?: InputMaybe<NftMarketplaceV2CurrentNftMarketplaceListingsBoolExp>;
};

export type QueryRootNftMarketplaceV2CurrentNftMarketplaceListingsByPkArgs = {
  listing_id: Scalars["String"]["input"];
  token_data_id: Scalars["String"]["input"];
};

export type QueryRootNftMarketplaceV2CurrentNftMarketplaceTokenOffersArgs = {
  distinct_on?: InputMaybe<Array<NftMarketplaceV2CurrentNftMarketplaceTokenOffersSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<NftMarketplaceV2CurrentNftMarketplaceTokenOffersOrderBy>>;
  where?: InputMaybe<NftMarketplaceV2CurrentNftMarketplaceTokenOffersBoolExp>;
};

export type QueryRootNftMarketplaceV2CurrentNftMarketplaceTokenOffersByPkArgs = {
  offer_id: Scalars["String"]["input"];
  token_data_id: Scalars["String"]["input"];
};

export type QueryRootNftMarketplaceV2NftMarketplaceActivitiesArgs = {
  distinct_on?: InputMaybe<Array<NftMarketplaceV2NftMarketplaceActivitiesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<NftMarketplaceV2NftMarketplaceActivitiesOrderBy>>;
  where?: InputMaybe<NftMarketplaceV2NftMarketplaceActivitiesBoolExp>;
};

export type QueryRootNftMarketplaceV2NftMarketplaceActivitiesByPkArgs = {
  event_index: Scalars["bigint"]["input"];
  transaction_version: Scalars["bigint"]["input"];
};

export type QueryRootNftMetadataCrawlerParsedAssetUrisArgs = {
  distinct_on?: InputMaybe<Array<NftMetadataCrawlerParsedAssetUrisSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<NftMetadataCrawlerParsedAssetUrisOrderBy>>;
  where?: InputMaybe<NftMetadataCrawlerParsedAssetUrisBoolExp>;
};

export type QueryRootNftMetadataCrawlerParsedAssetUrisByPkArgs = {
  asset_uri: Scalars["String"]["input"];
};

export type QueryRootNumActiveDelegatorPerPoolArgs = {
  distinct_on?: InputMaybe<Array<NumActiveDelegatorPerPoolSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<NumActiveDelegatorPerPoolOrderBy>>;
  where?: InputMaybe<NumActiveDelegatorPerPoolBoolExp>;
};

export type QueryRootProcessorStatusArgs = {
  distinct_on?: InputMaybe<Array<ProcessorStatusSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<ProcessorStatusOrderBy>>;
  where?: InputMaybe<ProcessorStatusBoolExp>;
};

export type QueryRootProcessorStatusByPkArgs = {
  processor: Scalars["String"]["input"];
};

export type QueryRootProposalVotesArgs = {
  distinct_on?: InputMaybe<Array<ProposalVotesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<ProposalVotesOrderBy>>;
  where?: InputMaybe<ProposalVotesBoolExp>;
};

export type QueryRootProposalVotesAggregateArgs = {
  distinct_on?: InputMaybe<Array<ProposalVotesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<ProposalVotesOrderBy>>;
  where?: InputMaybe<ProposalVotesBoolExp>;
};

export type QueryRootProposalVotesByPkArgs = {
  proposal_id: Scalars["bigint"]["input"];
  transaction_version: Scalars["bigint"]["input"];
  voter_address: Scalars["String"]["input"];
};

export type QueryRootTableItemsArgs = {
  distinct_on?: InputMaybe<Array<TableItemsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<TableItemsOrderBy>>;
  where?: InputMaybe<TableItemsBoolExp>;
};

export type QueryRootTableItemsByPkArgs = {
  transaction_version: Scalars["bigint"]["input"];
  write_set_change_index: Scalars["bigint"]["input"];
};

export type QueryRootTableMetadatasArgs = {
  distinct_on?: InputMaybe<Array<TableMetadatasSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<TableMetadatasOrderBy>>;
  where?: InputMaybe<TableMetadatasBoolExp>;
};

export type QueryRootTableMetadatasByPkArgs = {
  handle: Scalars["String"]["input"];
};

export type QueryRootTokenActivitiesArgs = {
  distinct_on?: InputMaybe<Array<TokenActivitiesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<TokenActivitiesOrderBy>>;
  where?: InputMaybe<TokenActivitiesBoolExp>;
};

export type QueryRootTokenActivitiesAggregateArgs = {
  distinct_on?: InputMaybe<Array<TokenActivitiesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<TokenActivitiesOrderBy>>;
  where?: InputMaybe<TokenActivitiesBoolExp>;
};

export type QueryRootTokenActivitiesByPkArgs = {
  event_account_address: Scalars["String"]["input"];
  event_creation_number: Scalars["bigint"]["input"];
  event_sequence_number: Scalars["bigint"]["input"];
  transaction_version: Scalars["bigint"]["input"];
};

export type QueryRootTokenActivitiesV2Args = {
  distinct_on?: InputMaybe<Array<TokenActivitiesV2SelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<TokenActivitiesV2OrderBy>>;
  where?: InputMaybe<TokenActivitiesV2BoolExp>;
};

export type QueryRootTokenActivitiesV2AggregateArgs = {
  distinct_on?: InputMaybe<Array<TokenActivitiesV2SelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<TokenActivitiesV2OrderBy>>;
  where?: InputMaybe<TokenActivitiesV2BoolExp>;
};

export type QueryRootTokenActivitiesV2ByPkArgs = {
  event_index: Scalars["bigint"]["input"];
  transaction_version: Scalars["bigint"]["input"];
};

export type QueryRootTokenDatasArgs = {
  distinct_on?: InputMaybe<Array<TokenDatasSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<TokenDatasOrderBy>>;
  where?: InputMaybe<TokenDatasBoolExp>;
};

export type QueryRootTokenDatasByPkArgs = {
  token_data_id_hash: Scalars["String"]["input"];
  transaction_version: Scalars["bigint"]["input"];
};

export type QueryRootTokenOwnershipsArgs = {
  distinct_on?: InputMaybe<Array<TokenOwnershipsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<TokenOwnershipsOrderBy>>;
  where?: InputMaybe<TokenOwnershipsBoolExp>;
};

export type QueryRootTokenOwnershipsByPkArgs = {
  property_version: Scalars["numeric"]["input"];
  table_handle: Scalars["String"]["input"];
  token_data_id_hash: Scalars["String"]["input"];
  transaction_version: Scalars["bigint"]["input"];
};

export type QueryRootTokensArgs = {
  distinct_on?: InputMaybe<Array<TokensSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<TokensOrderBy>>;
  where?: InputMaybe<TokensBoolExp>;
};

export type QueryRootTokensByPkArgs = {
  property_version: Scalars["numeric"]["input"];
  token_data_id_hash: Scalars["String"]["input"];
  transaction_version: Scalars["bigint"]["input"];
};

export type QueryRootUserTransactionsArgs = {
  distinct_on?: InputMaybe<Array<UserTransactionsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<UserTransactionsOrderBy>>;
  where?: InputMaybe<UserTransactionsBoolExp>;
};

export type QueryRootUserTransactionsByPkArgs = {
  version: Scalars["bigint"]["input"];
};

export type SubscriptionRoot = {
  /** fetch data from the table: "account_transactions" */
  account_transactions: Array<AccountTransactions>;
  /** fetch aggregated fields from the table: "account_transactions" */
  account_transactions_aggregate: AccountTransactionsAggregate;
  /** fetch data from the table: "account_transactions" using primary key columns */
  account_transactions_by_pk?: Maybe<AccountTransactions>;
  /** fetch data from the table in a streaming manner : "account_transactions" */
  account_transactions_stream: Array<AccountTransactions>;
  /** fetch data from the table: "address_events_summary" */
  address_events_summary: Array<AddressEventsSummary>;
  /** fetch data from the table in a streaming manner : "address_events_summary" */
  address_events_summary_stream: Array<AddressEventsSummary>;
  /** fetch data from the table: "address_version_from_events" */
  address_version_from_events: Array<AddressVersionFromEvents>;
  /** fetch aggregated fields from the table: "address_version_from_events" */
  address_version_from_events_aggregate: AddressVersionFromEventsAggregate;
  /** fetch data from the table in a streaming manner : "address_version_from_events" */
  address_version_from_events_stream: Array<AddressVersionFromEvents>;
  /** fetch data from the table: "address_version_from_move_resources" */
  address_version_from_move_resources: Array<AddressVersionFromMoveResources>;
  /** fetch aggregated fields from the table: "address_version_from_move_resources" */
  address_version_from_move_resources_aggregate: AddressVersionFromMoveResourcesAggregate;
  /** fetch data from the table in a streaming manner : "address_version_from_move_resources" */
  address_version_from_move_resources_stream: Array<AddressVersionFromMoveResources>;
  /** fetch data from the table: "block_metadata_transactions" */
  block_metadata_transactions: Array<BlockMetadataTransactions>;
  /** fetch data from the table: "block_metadata_transactions" using primary key columns */
  block_metadata_transactions_by_pk?: Maybe<BlockMetadataTransactions>;
  /** fetch data from the table in a streaming manner : "block_metadata_transactions" */
  block_metadata_transactions_stream: Array<BlockMetadataTransactions>;
  /** An array relationship */
  coin_activities: Array<CoinActivities>;
  /** An aggregate relationship */
  coin_activities_aggregate: CoinActivitiesAggregate;
  /** fetch data from the table: "coin_activities" using primary key columns */
  coin_activities_by_pk?: Maybe<CoinActivities>;
  /** fetch data from the table in a streaming manner : "coin_activities" */
  coin_activities_stream: Array<CoinActivities>;
  /** fetch data from the table: "coin_balances" */
  coin_balances: Array<CoinBalances>;
  /** fetch data from the table: "coin_balances" using primary key columns */
  coin_balances_by_pk?: Maybe<CoinBalances>;
  /** fetch data from the table in a streaming manner : "coin_balances" */
  coin_balances_stream: Array<CoinBalances>;
  /** fetch data from the table: "coin_infos" */
  coin_infos: Array<CoinInfos>;
  /** fetch data from the table: "coin_infos" using primary key columns */
  coin_infos_by_pk?: Maybe<CoinInfos>;
  /** fetch data from the table in a streaming manner : "coin_infos" */
  coin_infos_stream: Array<CoinInfos>;
  /** fetch data from the table: "coin_supply" */
  coin_supply: Array<CoinSupply>;
  /** fetch data from the table: "coin_supply" using primary key columns */
  coin_supply_by_pk?: Maybe<CoinSupply>;
  /** fetch data from the table in a streaming manner : "coin_supply" */
  coin_supply_stream: Array<CoinSupply>;
  /** fetch data from the table: "collection_datas" */
  collection_datas: Array<CollectionDatas>;
  /** fetch data from the table: "collection_datas" using primary key columns */
  collection_datas_by_pk?: Maybe<CollectionDatas>;
  /** fetch data from the table in a streaming manner : "collection_datas" */
  collection_datas_stream: Array<CollectionDatas>;
  /** fetch data from the table: "current_ans_lookup" */
  current_ans_lookup: Array<CurrentAnsLookup>;
  /** fetch data from the table: "current_ans_lookup" using primary key columns */
  current_ans_lookup_by_pk?: Maybe<CurrentAnsLookup>;
  /** fetch data from the table in a streaming manner : "current_ans_lookup" */
  current_ans_lookup_stream: Array<CurrentAnsLookup>;
  /** fetch data from the table: "current_ans_lookup_v2" */
  current_ans_lookup_v2: Array<CurrentAnsLookupV2>;
  /** fetch data from the table: "current_ans_lookup_v2" using primary key columns */
  current_ans_lookup_v2_by_pk?: Maybe<CurrentAnsLookupV2>;
  /** fetch data from the table in a streaming manner : "current_ans_lookup_v2" */
  current_ans_lookup_v2_stream: Array<CurrentAnsLookupV2>;
  /** fetch data from the table: "current_aptos_names" */
  current_aptos_names: Array<CurrentAptosNames>;
  /** fetch aggregated fields from the table: "current_aptos_names" */
  current_aptos_names_aggregate: CurrentAptosNamesAggregate;
  /** fetch data from the table in a streaming manner : "current_aptos_names" */
  current_aptos_names_stream: Array<CurrentAptosNames>;
  /** fetch data from the table: "current_coin_balances" */
  current_coin_balances: Array<CurrentCoinBalances>;
  /** fetch data from the table: "current_coin_balances" using primary key columns */
  current_coin_balances_by_pk?: Maybe<CurrentCoinBalances>;
  /** fetch data from the table in a streaming manner : "current_coin_balances" */
  current_coin_balances_stream: Array<CurrentCoinBalances>;
  /** fetch data from the table: "current_collection_datas" */
  current_collection_datas: Array<CurrentCollectionDatas>;
  /** fetch data from the table: "current_collection_datas" using primary key columns */
  current_collection_datas_by_pk?: Maybe<CurrentCollectionDatas>;
  /** fetch data from the table in a streaming manner : "current_collection_datas" */
  current_collection_datas_stream: Array<CurrentCollectionDatas>;
  /** fetch data from the table: "current_collection_ownership_v2_view" */
  current_collection_ownership_v2_view: Array<CurrentCollectionOwnershipV2View>;
  /** fetch aggregated fields from the table: "current_collection_ownership_v2_view" */
  current_collection_ownership_v2_view_aggregate: CurrentCollectionOwnershipV2ViewAggregate;
  /** fetch data from the table in a streaming manner : "current_collection_ownership_v2_view" */
  current_collection_ownership_v2_view_stream: Array<CurrentCollectionOwnershipV2View>;
  /** fetch data from the table: "current_collections_v2" */
  current_collections_v2: Array<CurrentCollectionsV2>;
  /** fetch data from the table: "current_collections_v2" using primary key columns */
  current_collections_v2_by_pk?: Maybe<CurrentCollectionsV2>;
  /** fetch data from the table in a streaming manner : "current_collections_v2" */
  current_collections_v2_stream: Array<CurrentCollectionsV2>;
  /** fetch data from the table: "current_delegated_staking_pool_balances" */
  current_delegated_staking_pool_balances: Array<CurrentDelegatedStakingPoolBalances>;
  /** fetch data from the table: "current_delegated_staking_pool_balances" using primary key columns */
  current_delegated_staking_pool_balances_by_pk?: Maybe<CurrentDelegatedStakingPoolBalances>;
  /** fetch data from the table in a streaming manner : "current_delegated_staking_pool_balances" */
  current_delegated_staking_pool_balances_stream: Array<CurrentDelegatedStakingPoolBalances>;
  /** fetch data from the table: "current_delegated_voter" */
  current_delegated_voter: Array<CurrentDelegatedVoter>;
  /** fetch data from the table: "current_delegated_voter" using primary key columns */
  current_delegated_voter_by_pk?: Maybe<CurrentDelegatedVoter>;
  /** fetch data from the table in a streaming manner : "current_delegated_voter" */
  current_delegated_voter_stream: Array<CurrentDelegatedVoter>;
  /** fetch data from the table: "current_delegator_balances" */
  current_delegator_balances: Array<CurrentDelegatorBalances>;
  /** fetch data from the table: "current_delegator_balances" using primary key columns */
  current_delegator_balances_by_pk?: Maybe<CurrentDelegatorBalances>;
  /** fetch data from the table in a streaming manner : "current_delegator_balances" */
  current_delegator_balances_stream: Array<CurrentDelegatorBalances>;
  /** fetch data from the table: "current_fungible_asset_balances" */
  current_fungible_asset_balances: Array<CurrentFungibleAssetBalances>;
  /** fetch aggregated fields from the table: "current_fungible_asset_balances" */
  current_fungible_asset_balances_aggregate: CurrentFungibleAssetBalancesAggregate;
  /** fetch data from the table: "current_fungible_asset_balances" using primary key columns */
  current_fungible_asset_balances_by_pk?: Maybe<CurrentFungibleAssetBalances>;
  /** fetch data from the table in a streaming manner : "current_fungible_asset_balances" */
  current_fungible_asset_balances_stream: Array<CurrentFungibleAssetBalances>;
  /** fetch data from the table: "current_objects" */
  current_objects: Array<CurrentObjects>;
  /** fetch data from the table: "current_objects" using primary key columns */
  current_objects_by_pk?: Maybe<CurrentObjects>;
  /** fetch data from the table in a streaming manner : "current_objects" */
  current_objects_stream: Array<CurrentObjects>;
  /** fetch data from the table: "current_staking_pool_voter" */
  current_staking_pool_voter: Array<CurrentStakingPoolVoter>;
  /** fetch data from the table: "current_staking_pool_voter" using primary key columns */
  current_staking_pool_voter_by_pk?: Maybe<CurrentStakingPoolVoter>;
  /** fetch data from the table in a streaming manner : "current_staking_pool_voter" */
  current_staking_pool_voter_stream: Array<CurrentStakingPoolVoter>;
  /** fetch data from the table: "current_table_items" */
  current_table_items: Array<CurrentTableItems>;
  /** fetch data from the table: "current_table_items" using primary key columns */
  current_table_items_by_pk?: Maybe<CurrentTableItems>;
  /** fetch data from the table in a streaming manner : "current_table_items" */
  current_table_items_stream: Array<CurrentTableItems>;
  /** fetch data from the table: "current_token_datas" */
  current_token_datas: Array<CurrentTokenDatas>;
  /** fetch data from the table: "current_token_datas" using primary key columns */
  current_token_datas_by_pk?: Maybe<CurrentTokenDatas>;
  /** fetch data from the table in a streaming manner : "current_token_datas" */
  current_token_datas_stream: Array<CurrentTokenDatas>;
  /** fetch data from the table: "current_token_datas_v2" */
  current_token_datas_v2: Array<CurrentTokenDatasV2>;
  /** fetch data from the table: "current_token_datas_v2" using primary key columns */
  current_token_datas_v2_by_pk?: Maybe<CurrentTokenDatasV2>;
  /** fetch data from the table in a streaming manner : "current_token_datas_v2" */
  current_token_datas_v2_stream: Array<CurrentTokenDatasV2>;
  /** fetch data from the table: "current_token_ownerships" */
  current_token_ownerships: Array<CurrentTokenOwnerships>;
  /** fetch aggregated fields from the table: "current_token_ownerships" */
  current_token_ownerships_aggregate: CurrentTokenOwnershipsAggregate;
  /** fetch data from the table: "current_token_ownerships" using primary key columns */
  current_token_ownerships_by_pk?: Maybe<CurrentTokenOwnerships>;
  /** fetch data from the table in a streaming manner : "current_token_ownerships" */
  current_token_ownerships_stream: Array<CurrentTokenOwnerships>;
  /** fetch data from the table: "current_token_ownerships_v2" */
  current_token_ownerships_v2: Array<CurrentTokenOwnershipsV2>;
  /** fetch aggregated fields from the table: "current_token_ownerships_v2" */
  current_token_ownerships_v2_aggregate: CurrentTokenOwnershipsV2Aggregate;
  /** fetch data from the table: "current_token_ownerships_v2" using primary key columns */
  current_token_ownerships_v2_by_pk?: Maybe<CurrentTokenOwnershipsV2>;
  /** fetch data from the table in a streaming manner : "current_token_ownerships_v2" */
  current_token_ownerships_v2_stream: Array<CurrentTokenOwnershipsV2>;
  /** fetch data from the table: "current_token_pending_claims" */
  current_token_pending_claims: Array<CurrentTokenPendingClaims>;
  /** fetch data from the table: "current_token_pending_claims" using primary key columns */
  current_token_pending_claims_by_pk?: Maybe<CurrentTokenPendingClaims>;
  /** fetch data from the table in a streaming manner : "current_token_pending_claims" */
  current_token_pending_claims_stream: Array<CurrentTokenPendingClaims>;
  /** An array relationship */
  delegated_staking_activities: Array<DelegatedStakingActivities>;
  /** fetch data from the table: "delegated_staking_activities" using primary key columns */
  delegated_staking_activities_by_pk?: Maybe<DelegatedStakingActivities>;
  /** fetch data from the table in a streaming manner : "delegated_staking_activities" */
  delegated_staking_activities_stream: Array<DelegatedStakingActivities>;
  /** fetch data from the table: "delegated_staking_pools" */
  delegated_staking_pools: Array<DelegatedStakingPools>;
  /** fetch data from the table: "delegated_staking_pools" using primary key columns */
  delegated_staking_pools_by_pk?: Maybe<DelegatedStakingPools>;
  /** fetch data from the table in a streaming manner : "delegated_staking_pools" */
  delegated_staking_pools_stream: Array<DelegatedStakingPools>;
  /** fetch data from the table: "delegator_distinct_pool" */
  delegator_distinct_pool: Array<DelegatorDistinctPool>;
  /** fetch aggregated fields from the table: "delegator_distinct_pool" */
  delegator_distinct_pool_aggregate: DelegatorDistinctPoolAggregate;
  /** fetch data from the table in a streaming manner : "delegator_distinct_pool" */
  delegator_distinct_pool_stream: Array<DelegatorDistinctPool>;
  /** fetch data from the table: "events" */
  events: Array<Events>;
  /** fetch data from the table: "events" using primary key columns */
  events_by_pk?: Maybe<Events>;
  /** fetch data from the table in a streaming manner : "events" */
  events_stream: Array<Events>;
  /** An array relationship */
  fungible_asset_activities: Array<FungibleAssetActivities>;
  /** fetch data from the table: "fungible_asset_activities" using primary key columns */
  fungible_asset_activities_by_pk?: Maybe<FungibleAssetActivities>;
  /** fetch data from the table in a streaming manner : "fungible_asset_activities" */
  fungible_asset_activities_stream: Array<FungibleAssetActivities>;
  /** fetch data from the table: "fungible_asset_metadata" */
  fungible_asset_metadata: Array<FungibleAssetMetadata>;
  /** fetch data from the table: "fungible_asset_metadata" using primary key columns */
  fungible_asset_metadata_by_pk?: Maybe<FungibleAssetMetadata>;
  /** fetch data from the table in a streaming manner : "fungible_asset_metadata" */
  fungible_asset_metadata_stream: Array<FungibleAssetMetadata>;
  /** fetch data from the table: "indexer_status" */
  indexer_status: Array<IndexerStatus>;
  /** fetch data from the table: "indexer_status" using primary key columns */
  indexer_status_by_pk?: Maybe<IndexerStatus>;
  /** fetch data from the table in a streaming manner : "indexer_status" */
  indexer_status_stream: Array<IndexerStatus>;
  /** fetch data from the table: "ledger_infos" */
  ledger_infos: Array<LedgerInfos>;
  /** fetch data from the table: "ledger_infos" using primary key columns */
  ledger_infos_by_pk?: Maybe<LedgerInfos>;
  /** fetch data from the table in a streaming manner : "ledger_infos" */
  ledger_infos_stream: Array<LedgerInfos>;
  /** fetch data from the table: "move_resources" */
  move_resources: Array<MoveResources>;
  /** fetch aggregated fields from the table: "move_resources" */
  move_resources_aggregate: MoveResourcesAggregate;
  /** fetch data from the table in a streaming manner : "move_resources" */
  move_resources_stream: Array<MoveResources>;
  /** fetch data from the table: "nft_marketplace_v2.current_nft_marketplace_auctions" */
  nft_marketplace_v2_current_nft_marketplace_auctions: Array<NftMarketplaceV2CurrentNftMarketplaceAuctions>;
  /** fetch data from the table: "nft_marketplace_v2.current_nft_marketplace_auctions" using primary key columns */
  nft_marketplace_v2_current_nft_marketplace_auctions_by_pk?: Maybe<NftMarketplaceV2CurrentNftMarketplaceAuctions>;
  /** fetch data from the table in a streaming manner : "nft_marketplace_v2.current_nft_marketplace_auctions" */
  nft_marketplace_v2_current_nft_marketplace_auctions_stream: Array<NftMarketplaceV2CurrentNftMarketplaceAuctions>;
  /** fetch data from the table: "nft_marketplace_v2.current_nft_marketplace_collection_offers" */
  nft_marketplace_v2_current_nft_marketplace_collection_offers: Array<NftMarketplaceV2CurrentNftMarketplaceCollectionOffers>;
  /** fetch data from the table: "nft_marketplace_v2.current_nft_marketplace_collection_offers" using primary key columns */
  nft_marketplace_v2_current_nft_marketplace_collection_offers_by_pk?: Maybe<NftMarketplaceV2CurrentNftMarketplaceCollectionOffers>;
  /** fetch data from the table in a streaming manner : "nft_marketplace_v2.current_nft_marketplace_collection_offers" */
  nft_marketplace_v2_current_nft_marketplace_collection_offers_stream: Array<NftMarketplaceV2CurrentNftMarketplaceCollectionOffers>;
  /** fetch data from the table: "nft_marketplace_v2.current_nft_marketplace_listings" */
  nft_marketplace_v2_current_nft_marketplace_listings: Array<NftMarketplaceV2CurrentNftMarketplaceListings>;
  /** fetch data from the table: "nft_marketplace_v2.current_nft_marketplace_listings" using primary key columns */
  nft_marketplace_v2_current_nft_marketplace_listings_by_pk?: Maybe<NftMarketplaceV2CurrentNftMarketplaceListings>;
  /** fetch data from the table in a streaming manner : "nft_marketplace_v2.current_nft_marketplace_listings" */
  nft_marketplace_v2_current_nft_marketplace_listings_stream: Array<NftMarketplaceV2CurrentNftMarketplaceListings>;
  /** fetch data from the table: "nft_marketplace_v2.current_nft_marketplace_token_offers" */
  nft_marketplace_v2_current_nft_marketplace_token_offers: Array<NftMarketplaceV2CurrentNftMarketplaceTokenOffers>;
  /** fetch data from the table: "nft_marketplace_v2.current_nft_marketplace_token_offers" using primary key columns */
  nft_marketplace_v2_current_nft_marketplace_token_offers_by_pk?: Maybe<NftMarketplaceV2CurrentNftMarketplaceTokenOffers>;
  /** fetch data from the table in a streaming manner : "nft_marketplace_v2.current_nft_marketplace_token_offers" */
  nft_marketplace_v2_current_nft_marketplace_token_offers_stream: Array<NftMarketplaceV2CurrentNftMarketplaceTokenOffers>;
  /** fetch data from the table: "nft_marketplace_v2.nft_marketplace_activities" */
  nft_marketplace_v2_nft_marketplace_activities: Array<NftMarketplaceV2NftMarketplaceActivities>;
  /** fetch data from the table: "nft_marketplace_v2.nft_marketplace_activities" using primary key columns */
  nft_marketplace_v2_nft_marketplace_activities_by_pk?: Maybe<NftMarketplaceV2NftMarketplaceActivities>;
  /** fetch data from the table in a streaming manner : "nft_marketplace_v2.nft_marketplace_activities" */
  nft_marketplace_v2_nft_marketplace_activities_stream: Array<NftMarketplaceV2NftMarketplaceActivities>;
  /** fetch data from the table: "nft_metadata_crawler.parsed_asset_uris" */
  nft_metadata_crawler_parsed_asset_uris: Array<NftMetadataCrawlerParsedAssetUris>;
  /** fetch data from the table: "nft_metadata_crawler.parsed_asset_uris" using primary key columns */
  nft_metadata_crawler_parsed_asset_uris_by_pk?: Maybe<NftMetadataCrawlerParsedAssetUris>;
  /** fetch data from the table in a streaming manner : "nft_metadata_crawler.parsed_asset_uris" */
  nft_metadata_crawler_parsed_asset_uris_stream: Array<NftMetadataCrawlerParsedAssetUris>;
  /** fetch data from the table: "num_active_delegator_per_pool" */
  num_active_delegator_per_pool: Array<NumActiveDelegatorPerPool>;
  /** fetch data from the table in a streaming manner : "num_active_delegator_per_pool" */
  num_active_delegator_per_pool_stream: Array<NumActiveDelegatorPerPool>;
  /** fetch data from the table: "processor_status" */
  processor_status: Array<ProcessorStatus>;
  /** fetch data from the table: "processor_status" using primary key columns */
  processor_status_by_pk?: Maybe<ProcessorStatus>;
  /** fetch data from the table in a streaming manner : "processor_status" */
  processor_status_stream: Array<ProcessorStatus>;
  /** fetch data from the table: "proposal_votes" */
  proposal_votes: Array<ProposalVotes>;
  /** fetch aggregated fields from the table: "proposal_votes" */
  proposal_votes_aggregate: ProposalVotesAggregate;
  /** fetch data from the table: "proposal_votes" using primary key columns */
  proposal_votes_by_pk?: Maybe<ProposalVotes>;
  /** fetch data from the table in a streaming manner : "proposal_votes" */
  proposal_votes_stream: Array<ProposalVotes>;
  /** fetch data from the table: "table_items" */
  table_items: Array<TableItems>;
  /** fetch data from the table: "table_items" using primary key columns */
  table_items_by_pk?: Maybe<TableItems>;
  /** fetch data from the table in a streaming manner : "table_items" */
  table_items_stream: Array<TableItems>;
  /** fetch data from the table: "table_metadatas" */
  table_metadatas: Array<TableMetadatas>;
  /** fetch data from the table: "table_metadatas" using primary key columns */
  table_metadatas_by_pk?: Maybe<TableMetadatas>;
  /** fetch data from the table in a streaming manner : "table_metadatas" */
  table_metadatas_stream: Array<TableMetadatas>;
  /** An array relationship */
  token_activities: Array<TokenActivities>;
  /** An aggregate relationship */
  token_activities_aggregate: TokenActivitiesAggregate;
  /** fetch data from the table: "token_activities" using primary key columns */
  token_activities_by_pk?: Maybe<TokenActivities>;
  /** fetch data from the table in a streaming manner : "token_activities" */
  token_activities_stream: Array<TokenActivities>;
  /** An array relationship */
  token_activities_v2: Array<TokenActivitiesV2>;
  /** An aggregate relationship */
  token_activities_v2_aggregate: TokenActivitiesV2Aggregate;
  /** fetch data from the table: "token_activities_v2" using primary key columns */
  token_activities_v2_by_pk?: Maybe<TokenActivitiesV2>;
  /** fetch data from the table in a streaming manner : "token_activities_v2" */
  token_activities_v2_stream: Array<TokenActivitiesV2>;
  /** fetch data from the table: "token_datas" */
  token_datas: Array<TokenDatas>;
  /** fetch data from the table: "token_datas" using primary key columns */
  token_datas_by_pk?: Maybe<TokenDatas>;
  /** fetch data from the table in a streaming manner : "token_datas" */
  token_datas_stream: Array<TokenDatas>;
  /** fetch data from the table: "token_ownerships" */
  token_ownerships: Array<TokenOwnerships>;
  /** fetch data from the table: "token_ownerships" using primary key columns */
  token_ownerships_by_pk?: Maybe<TokenOwnerships>;
  /** fetch data from the table in a streaming manner : "token_ownerships" */
  token_ownerships_stream: Array<TokenOwnerships>;
  /** fetch data from the table: "tokens" */
  tokens: Array<Tokens>;
  /** fetch data from the table: "tokens" using primary key columns */
  tokens_by_pk?: Maybe<Tokens>;
  /** fetch data from the table in a streaming manner : "tokens" */
  tokens_stream: Array<Tokens>;
  /** fetch data from the table: "user_transactions" */
  user_transactions: Array<UserTransactions>;
  /** fetch data from the table: "user_transactions" using primary key columns */
  user_transactions_by_pk?: Maybe<UserTransactions>;
  /** fetch data from the table in a streaming manner : "user_transactions" */
  user_transactions_stream: Array<UserTransactions>;
};

export type SubscriptionRootAccountTransactionsArgs = {
  distinct_on?: InputMaybe<Array<AccountTransactionsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<AccountTransactionsOrderBy>>;
  where?: InputMaybe<AccountTransactionsBoolExp>;
};

export type SubscriptionRootAccountTransactionsAggregateArgs = {
  distinct_on?: InputMaybe<Array<AccountTransactionsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<AccountTransactionsOrderBy>>;
  where?: InputMaybe<AccountTransactionsBoolExp>;
};

export type SubscriptionRootAccountTransactionsByPkArgs = {
  account_address: Scalars["String"]["input"];
  transaction_version: Scalars["bigint"]["input"];
};

export type SubscriptionRootAccountTransactionsStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<AccountTransactionsStreamCursorInput>>;
  where?: InputMaybe<AccountTransactionsBoolExp>;
};

export type SubscriptionRootAddressEventsSummaryArgs = {
  distinct_on?: InputMaybe<Array<AddressEventsSummarySelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<AddressEventsSummaryOrderBy>>;
  where?: InputMaybe<AddressEventsSummaryBoolExp>;
};

export type SubscriptionRootAddressEventsSummaryStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<AddressEventsSummaryStreamCursorInput>>;
  where?: InputMaybe<AddressEventsSummaryBoolExp>;
};

export type SubscriptionRootAddressVersionFromEventsArgs = {
  distinct_on?: InputMaybe<Array<AddressVersionFromEventsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<AddressVersionFromEventsOrderBy>>;
  where?: InputMaybe<AddressVersionFromEventsBoolExp>;
};

export type SubscriptionRootAddressVersionFromEventsAggregateArgs = {
  distinct_on?: InputMaybe<Array<AddressVersionFromEventsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<AddressVersionFromEventsOrderBy>>;
  where?: InputMaybe<AddressVersionFromEventsBoolExp>;
};

export type SubscriptionRootAddressVersionFromEventsStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<AddressVersionFromEventsStreamCursorInput>>;
  where?: InputMaybe<AddressVersionFromEventsBoolExp>;
};

export type SubscriptionRootAddressVersionFromMoveResourcesArgs = {
  distinct_on?: InputMaybe<Array<AddressVersionFromMoveResourcesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<AddressVersionFromMoveResourcesOrderBy>>;
  where?: InputMaybe<AddressVersionFromMoveResourcesBoolExp>;
};

export type SubscriptionRootAddressVersionFromMoveResourcesAggregateArgs = {
  distinct_on?: InputMaybe<Array<AddressVersionFromMoveResourcesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<AddressVersionFromMoveResourcesOrderBy>>;
  where?: InputMaybe<AddressVersionFromMoveResourcesBoolExp>;
};

export type SubscriptionRootAddressVersionFromMoveResourcesStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<AddressVersionFromMoveResourcesStreamCursorInput>>;
  where?: InputMaybe<AddressVersionFromMoveResourcesBoolExp>;
};

export type SubscriptionRootBlockMetadataTransactionsArgs = {
  distinct_on?: InputMaybe<Array<BlockMetadataTransactionsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<BlockMetadataTransactionsOrderBy>>;
  where?: InputMaybe<BlockMetadataTransactionsBoolExp>;
};

export type SubscriptionRootBlockMetadataTransactionsByPkArgs = {
  version: Scalars["bigint"]["input"];
};

export type SubscriptionRootBlockMetadataTransactionsStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<BlockMetadataTransactionsStreamCursorInput>>;
  where?: InputMaybe<BlockMetadataTransactionsBoolExp>;
};

export type SubscriptionRootCoinActivitiesArgs = {
  distinct_on?: InputMaybe<Array<CoinActivitiesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CoinActivitiesOrderBy>>;
  where?: InputMaybe<CoinActivitiesBoolExp>;
};

export type SubscriptionRootCoinActivitiesAggregateArgs = {
  distinct_on?: InputMaybe<Array<CoinActivitiesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CoinActivitiesOrderBy>>;
  where?: InputMaybe<CoinActivitiesBoolExp>;
};

export type SubscriptionRootCoinActivitiesByPkArgs = {
  event_account_address: Scalars["String"]["input"];
  event_creation_number: Scalars["bigint"]["input"];
  event_sequence_number: Scalars["bigint"]["input"];
  transaction_version: Scalars["bigint"]["input"];
};

export type SubscriptionRootCoinActivitiesStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<CoinActivitiesStreamCursorInput>>;
  where?: InputMaybe<CoinActivitiesBoolExp>;
};

export type SubscriptionRootCoinBalancesArgs = {
  distinct_on?: InputMaybe<Array<CoinBalancesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CoinBalancesOrderBy>>;
  where?: InputMaybe<CoinBalancesBoolExp>;
};

export type SubscriptionRootCoinBalancesByPkArgs = {
  coin_type_hash: Scalars["String"]["input"];
  owner_address: Scalars["String"]["input"];
  transaction_version: Scalars["bigint"]["input"];
};

export type SubscriptionRootCoinBalancesStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<CoinBalancesStreamCursorInput>>;
  where?: InputMaybe<CoinBalancesBoolExp>;
};

export type SubscriptionRootCoinInfosArgs = {
  distinct_on?: InputMaybe<Array<CoinInfosSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CoinInfosOrderBy>>;
  where?: InputMaybe<CoinInfosBoolExp>;
};

export type SubscriptionRootCoinInfosByPkArgs = {
  coin_type_hash: Scalars["String"]["input"];
};

export type SubscriptionRootCoinInfosStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<CoinInfosStreamCursorInput>>;
  where?: InputMaybe<CoinInfosBoolExp>;
};

export type SubscriptionRootCoinSupplyArgs = {
  distinct_on?: InputMaybe<Array<CoinSupplySelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CoinSupplyOrderBy>>;
  where?: InputMaybe<CoinSupplyBoolExp>;
};

export type SubscriptionRootCoinSupplyByPkArgs = {
  coin_type_hash: Scalars["String"]["input"];
  transaction_version: Scalars["bigint"]["input"];
};

export type SubscriptionRootCoinSupplyStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<CoinSupplyStreamCursorInput>>;
  where?: InputMaybe<CoinSupplyBoolExp>;
};

export type SubscriptionRootCollectionDatasArgs = {
  distinct_on?: InputMaybe<Array<CollectionDatasSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CollectionDatasOrderBy>>;
  where?: InputMaybe<CollectionDatasBoolExp>;
};

export type SubscriptionRootCollectionDatasByPkArgs = {
  collection_data_id_hash: Scalars["String"]["input"];
  transaction_version: Scalars["bigint"]["input"];
};

export type SubscriptionRootCollectionDatasStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<CollectionDatasStreamCursorInput>>;
  where?: InputMaybe<CollectionDatasBoolExp>;
};

export type SubscriptionRootCurrentAnsLookupArgs = {
  distinct_on?: InputMaybe<Array<CurrentAnsLookupSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentAnsLookupOrderBy>>;
  where?: InputMaybe<CurrentAnsLookupBoolExp>;
};

export type SubscriptionRootCurrentAnsLookupByPkArgs = {
  domain: Scalars["String"]["input"];
  subdomain: Scalars["String"]["input"];
};

export type SubscriptionRootCurrentAnsLookupStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<CurrentAnsLookupStreamCursorInput>>;
  where?: InputMaybe<CurrentAnsLookupBoolExp>;
};

export type SubscriptionRootCurrentAnsLookupV2Args = {
  distinct_on?: InputMaybe<Array<CurrentAnsLookupV2SelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentAnsLookupV2OrderBy>>;
  where?: InputMaybe<CurrentAnsLookupV2BoolExp>;
};

export type SubscriptionRootCurrentAnsLookupV2ByPkArgs = {
  domain: Scalars["String"]["input"];
  subdomain: Scalars["String"]["input"];
  token_standard: Scalars["String"]["input"];
};

export type SubscriptionRootCurrentAnsLookupV2StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<CurrentAnsLookupV2StreamCursorInput>>;
  where?: InputMaybe<CurrentAnsLookupV2BoolExp>;
};

export type SubscriptionRootCurrentAptosNamesArgs = {
  distinct_on?: InputMaybe<Array<CurrentAptosNamesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentAptosNamesOrderBy>>;
  where?: InputMaybe<CurrentAptosNamesBoolExp>;
};

export type SubscriptionRootCurrentAptosNamesAggregateArgs = {
  distinct_on?: InputMaybe<Array<CurrentAptosNamesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentAptosNamesOrderBy>>;
  where?: InputMaybe<CurrentAptosNamesBoolExp>;
};

export type SubscriptionRootCurrentAptosNamesStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<CurrentAptosNamesStreamCursorInput>>;
  where?: InputMaybe<CurrentAptosNamesBoolExp>;
};

export type SubscriptionRootCurrentCoinBalancesArgs = {
  distinct_on?: InputMaybe<Array<CurrentCoinBalancesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentCoinBalancesOrderBy>>;
  where?: InputMaybe<CurrentCoinBalancesBoolExp>;
};

export type SubscriptionRootCurrentCoinBalancesByPkArgs = {
  coin_type_hash: Scalars["String"]["input"];
  owner_address: Scalars["String"]["input"];
};

export type SubscriptionRootCurrentCoinBalancesStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<CurrentCoinBalancesStreamCursorInput>>;
  where?: InputMaybe<CurrentCoinBalancesBoolExp>;
};

export type SubscriptionRootCurrentCollectionDatasArgs = {
  distinct_on?: InputMaybe<Array<CurrentCollectionDatasSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentCollectionDatasOrderBy>>;
  where?: InputMaybe<CurrentCollectionDatasBoolExp>;
};

export type SubscriptionRootCurrentCollectionDatasByPkArgs = {
  collection_data_id_hash: Scalars["String"]["input"];
};

export type SubscriptionRootCurrentCollectionDatasStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<CurrentCollectionDatasStreamCursorInput>>;
  where?: InputMaybe<CurrentCollectionDatasBoolExp>;
};

export type SubscriptionRootCurrentCollectionOwnershipV2ViewArgs = {
  distinct_on?: InputMaybe<Array<CurrentCollectionOwnershipV2ViewSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentCollectionOwnershipV2ViewOrderBy>>;
  where?: InputMaybe<CurrentCollectionOwnershipV2ViewBoolExp>;
};

export type SubscriptionRootCurrentCollectionOwnershipV2ViewAggregateArgs = {
  distinct_on?: InputMaybe<Array<CurrentCollectionOwnershipV2ViewSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentCollectionOwnershipV2ViewOrderBy>>;
  where?: InputMaybe<CurrentCollectionOwnershipV2ViewBoolExp>;
};

export type SubscriptionRootCurrentCollectionOwnershipV2ViewStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<CurrentCollectionOwnershipV2ViewStreamCursorInput>>;
  where?: InputMaybe<CurrentCollectionOwnershipV2ViewBoolExp>;
};

export type SubscriptionRootCurrentCollectionsV2Args = {
  distinct_on?: InputMaybe<Array<CurrentCollectionsV2SelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentCollectionsV2OrderBy>>;
  where?: InputMaybe<CurrentCollectionsV2BoolExp>;
};

export type SubscriptionRootCurrentCollectionsV2ByPkArgs = {
  collection_id: Scalars["String"]["input"];
};

export type SubscriptionRootCurrentCollectionsV2StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<CurrentCollectionsV2StreamCursorInput>>;
  where?: InputMaybe<CurrentCollectionsV2BoolExp>;
};

export type SubscriptionRootCurrentDelegatedStakingPoolBalancesArgs = {
  distinct_on?: InputMaybe<Array<CurrentDelegatedStakingPoolBalancesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentDelegatedStakingPoolBalancesOrderBy>>;
  where?: InputMaybe<CurrentDelegatedStakingPoolBalancesBoolExp>;
};

export type SubscriptionRootCurrentDelegatedStakingPoolBalancesByPkArgs = {
  staking_pool_address: Scalars["String"]["input"];
};

export type SubscriptionRootCurrentDelegatedStakingPoolBalancesStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<CurrentDelegatedStakingPoolBalancesStreamCursorInput>>;
  where?: InputMaybe<CurrentDelegatedStakingPoolBalancesBoolExp>;
};

export type SubscriptionRootCurrentDelegatedVoterArgs = {
  distinct_on?: InputMaybe<Array<CurrentDelegatedVoterSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentDelegatedVoterOrderBy>>;
  where?: InputMaybe<CurrentDelegatedVoterBoolExp>;
};

export type SubscriptionRootCurrentDelegatedVoterByPkArgs = {
  delegation_pool_address: Scalars["String"]["input"];
  delegator_address: Scalars["String"]["input"];
};

export type SubscriptionRootCurrentDelegatedVoterStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<CurrentDelegatedVoterStreamCursorInput>>;
  where?: InputMaybe<CurrentDelegatedVoterBoolExp>;
};

export type SubscriptionRootCurrentDelegatorBalancesArgs = {
  distinct_on?: InputMaybe<Array<CurrentDelegatorBalancesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentDelegatorBalancesOrderBy>>;
  where?: InputMaybe<CurrentDelegatorBalancesBoolExp>;
};

export type SubscriptionRootCurrentDelegatorBalancesByPkArgs = {
  delegator_address: Scalars["String"]["input"];
  pool_address: Scalars["String"]["input"];
  pool_type: Scalars["String"]["input"];
  table_handle: Scalars["String"]["input"];
};

export type SubscriptionRootCurrentDelegatorBalancesStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<CurrentDelegatorBalancesStreamCursorInput>>;
  where?: InputMaybe<CurrentDelegatorBalancesBoolExp>;
};

export type SubscriptionRootCurrentFungibleAssetBalancesArgs = {
  distinct_on?: InputMaybe<Array<CurrentFungibleAssetBalancesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentFungibleAssetBalancesOrderBy>>;
  where?: InputMaybe<CurrentFungibleAssetBalancesBoolExp>;
};

export type SubscriptionRootCurrentFungibleAssetBalancesAggregateArgs = {
  distinct_on?: InputMaybe<Array<CurrentFungibleAssetBalancesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentFungibleAssetBalancesOrderBy>>;
  where?: InputMaybe<CurrentFungibleAssetBalancesBoolExp>;
};

export type SubscriptionRootCurrentFungibleAssetBalancesByPkArgs = {
  storage_id: Scalars["String"]["input"];
};

export type SubscriptionRootCurrentFungibleAssetBalancesStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<CurrentFungibleAssetBalancesStreamCursorInput>>;
  where?: InputMaybe<CurrentFungibleAssetBalancesBoolExp>;
};

export type SubscriptionRootCurrentObjectsArgs = {
  distinct_on?: InputMaybe<Array<CurrentObjectsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentObjectsOrderBy>>;
  where?: InputMaybe<CurrentObjectsBoolExp>;
};

export type SubscriptionRootCurrentObjectsByPkArgs = {
  object_address: Scalars["String"]["input"];
};

export type SubscriptionRootCurrentObjectsStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<CurrentObjectsStreamCursorInput>>;
  where?: InputMaybe<CurrentObjectsBoolExp>;
};

export type SubscriptionRootCurrentStakingPoolVoterArgs = {
  distinct_on?: InputMaybe<Array<CurrentStakingPoolVoterSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentStakingPoolVoterOrderBy>>;
  where?: InputMaybe<CurrentStakingPoolVoterBoolExp>;
};

export type SubscriptionRootCurrentStakingPoolVoterByPkArgs = {
  staking_pool_address: Scalars["String"]["input"];
};

export type SubscriptionRootCurrentStakingPoolVoterStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<CurrentStakingPoolVoterStreamCursorInput>>;
  where?: InputMaybe<CurrentStakingPoolVoterBoolExp>;
};

export type SubscriptionRootCurrentTableItemsArgs = {
  distinct_on?: InputMaybe<Array<CurrentTableItemsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentTableItemsOrderBy>>;
  where?: InputMaybe<CurrentTableItemsBoolExp>;
};

export type SubscriptionRootCurrentTableItemsByPkArgs = {
  key_hash: Scalars["String"]["input"];
  table_handle: Scalars["String"]["input"];
};

export type SubscriptionRootCurrentTableItemsStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<CurrentTableItemsStreamCursorInput>>;
  where?: InputMaybe<CurrentTableItemsBoolExp>;
};

export type SubscriptionRootCurrentTokenDatasArgs = {
  distinct_on?: InputMaybe<Array<CurrentTokenDatasSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentTokenDatasOrderBy>>;
  where?: InputMaybe<CurrentTokenDatasBoolExp>;
};

export type SubscriptionRootCurrentTokenDatasByPkArgs = {
  token_data_id_hash: Scalars["String"]["input"];
};

export type SubscriptionRootCurrentTokenDatasStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<CurrentTokenDatasStreamCursorInput>>;
  where?: InputMaybe<CurrentTokenDatasBoolExp>;
};

export type SubscriptionRootCurrentTokenDatasV2Args = {
  distinct_on?: InputMaybe<Array<CurrentTokenDatasV2SelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentTokenDatasV2OrderBy>>;
  where?: InputMaybe<CurrentTokenDatasV2BoolExp>;
};

export type SubscriptionRootCurrentTokenDatasV2ByPkArgs = {
  token_data_id: Scalars["String"]["input"];
};

export type SubscriptionRootCurrentTokenDatasV2StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<CurrentTokenDatasV2StreamCursorInput>>;
  where?: InputMaybe<CurrentTokenDatasV2BoolExp>;
};

export type SubscriptionRootCurrentTokenOwnershipsArgs = {
  distinct_on?: InputMaybe<Array<CurrentTokenOwnershipsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentTokenOwnershipsOrderBy>>;
  where?: InputMaybe<CurrentTokenOwnershipsBoolExp>;
};

export type SubscriptionRootCurrentTokenOwnershipsAggregateArgs = {
  distinct_on?: InputMaybe<Array<CurrentTokenOwnershipsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentTokenOwnershipsOrderBy>>;
  where?: InputMaybe<CurrentTokenOwnershipsBoolExp>;
};

export type SubscriptionRootCurrentTokenOwnershipsByPkArgs = {
  owner_address: Scalars["String"]["input"];
  property_version: Scalars["numeric"]["input"];
  token_data_id_hash: Scalars["String"]["input"];
};

export type SubscriptionRootCurrentTokenOwnershipsStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<CurrentTokenOwnershipsStreamCursorInput>>;
  where?: InputMaybe<CurrentTokenOwnershipsBoolExp>;
};

export type SubscriptionRootCurrentTokenOwnershipsV2Args = {
  distinct_on?: InputMaybe<Array<CurrentTokenOwnershipsV2SelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentTokenOwnershipsV2OrderBy>>;
  where?: InputMaybe<CurrentTokenOwnershipsV2BoolExp>;
};

export type SubscriptionRootCurrentTokenOwnershipsV2AggregateArgs = {
  distinct_on?: InputMaybe<Array<CurrentTokenOwnershipsV2SelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentTokenOwnershipsV2OrderBy>>;
  where?: InputMaybe<CurrentTokenOwnershipsV2BoolExp>;
};

export type SubscriptionRootCurrentTokenOwnershipsV2ByPkArgs = {
  owner_address: Scalars["String"]["input"];
  property_version_v1: Scalars["numeric"]["input"];
  storage_id: Scalars["String"]["input"];
  token_data_id: Scalars["String"]["input"];
};

export type SubscriptionRootCurrentTokenOwnershipsV2StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<CurrentTokenOwnershipsV2StreamCursorInput>>;
  where?: InputMaybe<CurrentTokenOwnershipsV2BoolExp>;
};

export type SubscriptionRootCurrentTokenPendingClaimsArgs = {
  distinct_on?: InputMaybe<Array<CurrentTokenPendingClaimsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentTokenPendingClaimsOrderBy>>;
  where?: InputMaybe<CurrentTokenPendingClaimsBoolExp>;
};

export type SubscriptionRootCurrentTokenPendingClaimsByPkArgs = {
  from_address: Scalars["String"]["input"];
  property_version: Scalars["numeric"]["input"];
  to_address: Scalars["String"]["input"];
  token_data_id_hash: Scalars["String"]["input"];
};

export type SubscriptionRootCurrentTokenPendingClaimsStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<CurrentTokenPendingClaimsStreamCursorInput>>;
  where?: InputMaybe<CurrentTokenPendingClaimsBoolExp>;
};

export type SubscriptionRootDelegatedStakingActivitiesArgs = {
  distinct_on?: InputMaybe<Array<DelegatedStakingActivitiesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<DelegatedStakingActivitiesOrderBy>>;
  where?: InputMaybe<DelegatedStakingActivitiesBoolExp>;
};

export type SubscriptionRootDelegatedStakingActivitiesByPkArgs = {
  event_index: Scalars["bigint"]["input"];
  transaction_version: Scalars["bigint"]["input"];
};

export type SubscriptionRootDelegatedStakingActivitiesStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<DelegatedStakingActivitiesStreamCursorInput>>;
  where?: InputMaybe<DelegatedStakingActivitiesBoolExp>;
};

export type SubscriptionRootDelegatedStakingPoolsArgs = {
  distinct_on?: InputMaybe<Array<DelegatedStakingPoolsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<DelegatedStakingPoolsOrderBy>>;
  where?: InputMaybe<DelegatedStakingPoolsBoolExp>;
};

export type SubscriptionRootDelegatedStakingPoolsByPkArgs = {
  staking_pool_address: Scalars["String"]["input"];
};

export type SubscriptionRootDelegatedStakingPoolsStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<DelegatedStakingPoolsStreamCursorInput>>;
  where?: InputMaybe<DelegatedStakingPoolsBoolExp>;
};

export type SubscriptionRootDelegatorDistinctPoolArgs = {
  distinct_on?: InputMaybe<Array<DelegatorDistinctPoolSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<DelegatorDistinctPoolOrderBy>>;
  where?: InputMaybe<DelegatorDistinctPoolBoolExp>;
};

export type SubscriptionRootDelegatorDistinctPoolAggregateArgs = {
  distinct_on?: InputMaybe<Array<DelegatorDistinctPoolSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<DelegatorDistinctPoolOrderBy>>;
  where?: InputMaybe<DelegatorDistinctPoolBoolExp>;
};

export type SubscriptionRootDelegatorDistinctPoolStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<DelegatorDistinctPoolStreamCursorInput>>;
  where?: InputMaybe<DelegatorDistinctPoolBoolExp>;
};

export type SubscriptionRootEventsArgs = {
  distinct_on?: InputMaybe<Array<EventsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<EventsOrderBy>>;
  where?: InputMaybe<EventsBoolExp>;
};

export type SubscriptionRootEventsByPkArgs = {
  event_index: Scalars["bigint"]["input"];
  transaction_version: Scalars["bigint"]["input"];
};

export type SubscriptionRootEventsStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<EventsStreamCursorInput>>;
  where?: InputMaybe<EventsBoolExp>;
};

export type SubscriptionRootFungibleAssetActivitiesArgs = {
  distinct_on?: InputMaybe<Array<FungibleAssetActivitiesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<FungibleAssetActivitiesOrderBy>>;
  where?: InputMaybe<FungibleAssetActivitiesBoolExp>;
};

export type SubscriptionRootFungibleAssetActivitiesByPkArgs = {
  event_index: Scalars["bigint"]["input"];
  transaction_version: Scalars["bigint"]["input"];
};

export type SubscriptionRootFungibleAssetActivitiesStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<FungibleAssetActivitiesStreamCursorInput>>;
  where?: InputMaybe<FungibleAssetActivitiesBoolExp>;
};

export type SubscriptionRootFungibleAssetMetadataArgs = {
  distinct_on?: InputMaybe<Array<FungibleAssetMetadataSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<FungibleAssetMetadataOrderBy>>;
  where?: InputMaybe<FungibleAssetMetadataBoolExp>;
};

export type SubscriptionRootFungibleAssetMetadataByPkArgs = {
  asset_type: Scalars["String"]["input"];
};

export type SubscriptionRootFungibleAssetMetadataStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<FungibleAssetMetadataStreamCursorInput>>;
  where?: InputMaybe<FungibleAssetMetadataBoolExp>;
};

export type SubscriptionRootIndexerStatusArgs = {
  distinct_on?: InputMaybe<Array<IndexerStatusSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<IndexerStatusOrderBy>>;
  where?: InputMaybe<IndexerStatusBoolExp>;
};

export type SubscriptionRootIndexerStatusByPkArgs = {
  db: Scalars["String"]["input"];
};

export type SubscriptionRootIndexerStatusStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<IndexerStatusStreamCursorInput>>;
  where?: InputMaybe<IndexerStatusBoolExp>;
};

export type SubscriptionRootLedgerInfosArgs = {
  distinct_on?: InputMaybe<Array<LedgerInfosSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<LedgerInfosOrderBy>>;
  where?: InputMaybe<LedgerInfosBoolExp>;
};

export type SubscriptionRootLedgerInfosByPkArgs = {
  chain_id: Scalars["bigint"]["input"];
};

export type SubscriptionRootLedgerInfosStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<LedgerInfosStreamCursorInput>>;
  where?: InputMaybe<LedgerInfosBoolExp>;
};

export type SubscriptionRootMoveResourcesArgs = {
  distinct_on?: InputMaybe<Array<MoveResourcesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<MoveResourcesOrderBy>>;
  where?: InputMaybe<MoveResourcesBoolExp>;
};

export type SubscriptionRootMoveResourcesAggregateArgs = {
  distinct_on?: InputMaybe<Array<MoveResourcesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<MoveResourcesOrderBy>>;
  where?: InputMaybe<MoveResourcesBoolExp>;
};

export type SubscriptionRootMoveResourcesStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<MoveResourcesStreamCursorInput>>;
  where?: InputMaybe<MoveResourcesBoolExp>;
};

export type SubscriptionRootNftMarketplaceV2CurrentNftMarketplaceAuctionsArgs = {
  distinct_on?: InputMaybe<Array<NftMarketplaceV2CurrentNftMarketplaceAuctionsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<NftMarketplaceV2CurrentNftMarketplaceAuctionsOrderBy>>;
  where?: InputMaybe<NftMarketplaceV2CurrentNftMarketplaceAuctionsBoolExp>;
};

export type SubscriptionRootNftMarketplaceV2CurrentNftMarketplaceAuctionsByPkArgs = {
  listing_id: Scalars["String"]["input"];
  token_data_id: Scalars["String"]["input"];
};

export type SubscriptionRootNftMarketplaceV2CurrentNftMarketplaceAuctionsStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<NftMarketplaceV2CurrentNftMarketplaceAuctionsStreamCursorInput>>;
  where?: InputMaybe<NftMarketplaceV2CurrentNftMarketplaceAuctionsBoolExp>;
};

export type SubscriptionRootNftMarketplaceV2CurrentNftMarketplaceCollectionOffersArgs = {
  distinct_on?: InputMaybe<Array<NftMarketplaceV2CurrentNftMarketplaceCollectionOffersSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<NftMarketplaceV2CurrentNftMarketplaceCollectionOffersOrderBy>>;
  where?: InputMaybe<NftMarketplaceV2CurrentNftMarketplaceCollectionOffersBoolExp>;
};

export type SubscriptionRootNftMarketplaceV2CurrentNftMarketplaceCollectionOffersByPkArgs = {
  collection_id: Scalars["String"]["input"];
  collection_offer_id: Scalars["String"]["input"];
};

export type SubscriptionRootNftMarketplaceV2CurrentNftMarketplaceCollectionOffersStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<NftMarketplaceV2CurrentNftMarketplaceCollectionOffersStreamCursorInput>>;
  where?: InputMaybe<NftMarketplaceV2CurrentNftMarketplaceCollectionOffersBoolExp>;
};

export type SubscriptionRootNftMarketplaceV2CurrentNftMarketplaceListingsArgs = {
  distinct_on?: InputMaybe<Array<NftMarketplaceV2CurrentNftMarketplaceListingsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<NftMarketplaceV2CurrentNftMarketplaceListingsOrderBy>>;
  where?: InputMaybe<NftMarketplaceV2CurrentNftMarketplaceListingsBoolExp>;
};

export type SubscriptionRootNftMarketplaceV2CurrentNftMarketplaceListingsByPkArgs = {
  listing_id: Scalars["String"]["input"];
  token_data_id: Scalars["String"]["input"];
};

export type SubscriptionRootNftMarketplaceV2CurrentNftMarketplaceListingsStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<NftMarketplaceV2CurrentNftMarketplaceListingsStreamCursorInput>>;
  where?: InputMaybe<NftMarketplaceV2CurrentNftMarketplaceListingsBoolExp>;
};

export type SubscriptionRootNftMarketplaceV2CurrentNftMarketplaceTokenOffersArgs = {
  distinct_on?: InputMaybe<Array<NftMarketplaceV2CurrentNftMarketplaceTokenOffersSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<NftMarketplaceV2CurrentNftMarketplaceTokenOffersOrderBy>>;
  where?: InputMaybe<NftMarketplaceV2CurrentNftMarketplaceTokenOffersBoolExp>;
};

export type SubscriptionRootNftMarketplaceV2CurrentNftMarketplaceTokenOffersByPkArgs = {
  offer_id: Scalars["String"]["input"];
  token_data_id: Scalars["String"]["input"];
};

export type SubscriptionRootNftMarketplaceV2CurrentNftMarketplaceTokenOffersStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<NftMarketplaceV2CurrentNftMarketplaceTokenOffersStreamCursorInput>>;
  where?: InputMaybe<NftMarketplaceV2CurrentNftMarketplaceTokenOffersBoolExp>;
};

export type SubscriptionRootNftMarketplaceV2NftMarketplaceActivitiesArgs = {
  distinct_on?: InputMaybe<Array<NftMarketplaceV2NftMarketplaceActivitiesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<NftMarketplaceV2NftMarketplaceActivitiesOrderBy>>;
  where?: InputMaybe<NftMarketplaceV2NftMarketplaceActivitiesBoolExp>;
};

export type SubscriptionRootNftMarketplaceV2NftMarketplaceActivitiesByPkArgs = {
  event_index: Scalars["bigint"]["input"];
  transaction_version: Scalars["bigint"]["input"];
};

export type SubscriptionRootNftMarketplaceV2NftMarketplaceActivitiesStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<NftMarketplaceV2NftMarketplaceActivitiesStreamCursorInput>>;
  where?: InputMaybe<NftMarketplaceV2NftMarketplaceActivitiesBoolExp>;
};

export type SubscriptionRootNftMetadataCrawlerParsedAssetUrisArgs = {
  distinct_on?: InputMaybe<Array<NftMetadataCrawlerParsedAssetUrisSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<NftMetadataCrawlerParsedAssetUrisOrderBy>>;
  where?: InputMaybe<NftMetadataCrawlerParsedAssetUrisBoolExp>;
};

export type SubscriptionRootNftMetadataCrawlerParsedAssetUrisByPkArgs = {
  asset_uri: Scalars["String"]["input"];
};

export type SubscriptionRootNftMetadataCrawlerParsedAssetUrisStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<NftMetadataCrawlerParsedAssetUrisStreamCursorInput>>;
  where?: InputMaybe<NftMetadataCrawlerParsedAssetUrisBoolExp>;
};

export type SubscriptionRootNumActiveDelegatorPerPoolArgs = {
  distinct_on?: InputMaybe<Array<NumActiveDelegatorPerPoolSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<NumActiveDelegatorPerPoolOrderBy>>;
  where?: InputMaybe<NumActiveDelegatorPerPoolBoolExp>;
};

export type SubscriptionRootNumActiveDelegatorPerPoolStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<NumActiveDelegatorPerPoolStreamCursorInput>>;
  where?: InputMaybe<NumActiveDelegatorPerPoolBoolExp>;
};

export type SubscriptionRootProcessorStatusArgs = {
  distinct_on?: InputMaybe<Array<ProcessorStatusSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<ProcessorStatusOrderBy>>;
  where?: InputMaybe<ProcessorStatusBoolExp>;
};

export type SubscriptionRootProcessorStatusByPkArgs = {
  processor: Scalars["String"]["input"];
};

export type SubscriptionRootProcessorStatusStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<ProcessorStatusStreamCursorInput>>;
  where?: InputMaybe<ProcessorStatusBoolExp>;
};

export type SubscriptionRootProposalVotesArgs = {
  distinct_on?: InputMaybe<Array<ProposalVotesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<ProposalVotesOrderBy>>;
  where?: InputMaybe<ProposalVotesBoolExp>;
};

export type SubscriptionRootProposalVotesAggregateArgs = {
  distinct_on?: InputMaybe<Array<ProposalVotesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<ProposalVotesOrderBy>>;
  where?: InputMaybe<ProposalVotesBoolExp>;
};

export type SubscriptionRootProposalVotesByPkArgs = {
  proposal_id: Scalars["bigint"]["input"];
  transaction_version: Scalars["bigint"]["input"];
  voter_address: Scalars["String"]["input"];
};

export type SubscriptionRootProposalVotesStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<ProposalVotesStreamCursorInput>>;
  where?: InputMaybe<ProposalVotesBoolExp>;
};

export type SubscriptionRootTableItemsArgs = {
  distinct_on?: InputMaybe<Array<TableItemsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<TableItemsOrderBy>>;
  where?: InputMaybe<TableItemsBoolExp>;
};

export type SubscriptionRootTableItemsByPkArgs = {
  transaction_version: Scalars["bigint"]["input"];
  write_set_change_index: Scalars["bigint"]["input"];
};

export type SubscriptionRootTableItemsStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<TableItemsStreamCursorInput>>;
  where?: InputMaybe<TableItemsBoolExp>;
};

export type SubscriptionRootTableMetadatasArgs = {
  distinct_on?: InputMaybe<Array<TableMetadatasSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<TableMetadatasOrderBy>>;
  where?: InputMaybe<TableMetadatasBoolExp>;
};

export type SubscriptionRootTableMetadatasByPkArgs = {
  handle: Scalars["String"]["input"];
};

export type SubscriptionRootTableMetadatasStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<TableMetadatasStreamCursorInput>>;
  where?: InputMaybe<TableMetadatasBoolExp>;
};

export type SubscriptionRootTokenActivitiesArgs = {
  distinct_on?: InputMaybe<Array<TokenActivitiesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<TokenActivitiesOrderBy>>;
  where?: InputMaybe<TokenActivitiesBoolExp>;
};

export type SubscriptionRootTokenActivitiesAggregateArgs = {
  distinct_on?: InputMaybe<Array<TokenActivitiesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<TokenActivitiesOrderBy>>;
  where?: InputMaybe<TokenActivitiesBoolExp>;
};

export type SubscriptionRootTokenActivitiesByPkArgs = {
  event_account_address: Scalars["String"]["input"];
  event_creation_number: Scalars["bigint"]["input"];
  event_sequence_number: Scalars["bigint"]["input"];
  transaction_version: Scalars["bigint"]["input"];
};

export type SubscriptionRootTokenActivitiesStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<TokenActivitiesStreamCursorInput>>;
  where?: InputMaybe<TokenActivitiesBoolExp>;
};

export type SubscriptionRootTokenActivitiesV2Args = {
  distinct_on?: InputMaybe<Array<TokenActivitiesV2SelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<TokenActivitiesV2OrderBy>>;
  where?: InputMaybe<TokenActivitiesV2BoolExp>;
};

export type SubscriptionRootTokenActivitiesV2AggregateArgs = {
  distinct_on?: InputMaybe<Array<TokenActivitiesV2SelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<TokenActivitiesV2OrderBy>>;
  where?: InputMaybe<TokenActivitiesV2BoolExp>;
};

export type SubscriptionRootTokenActivitiesV2ByPkArgs = {
  event_index: Scalars["bigint"]["input"];
  transaction_version: Scalars["bigint"]["input"];
};

export type SubscriptionRootTokenActivitiesV2StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<TokenActivitiesV2StreamCursorInput>>;
  where?: InputMaybe<TokenActivitiesV2BoolExp>;
};

export type SubscriptionRootTokenDatasArgs = {
  distinct_on?: InputMaybe<Array<TokenDatasSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<TokenDatasOrderBy>>;
  where?: InputMaybe<TokenDatasBoolExp>;
};

export type SubscriptionRootTokenDatasByPkArgs = {
  token_data_id_hash: Scalars["String"]["input"];
  transaction_version: Scalars["bigint"]["input"];
};

export type SubscriptionRootTokenDatasStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<TokenDatasStreamCursorInput>>;
  where?: InputMaybe<TokenDatasBoolExp>;
};

export type SubscriptionRootTokenOwnershipsArgs = {
  distinct_on?: InputMaybe<Array<TokenOwnershipsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<TokenOwnershipsOrderBy>>;
  where?: InputMaybe<TokenOwnershipsBoolExp>;
};

export type SubscriptionRootTokenOwnershipsByPkArgs = {
  property_version: Scalars["numeric"]["input"];
  table_handle: Scalars["String"]["input"];
  token_data_id_hash: Scalars["String"]["input"];
  transaction_version: Scalars["bigint"]["input"];
};

export type SubscriptionRootTokenOwnershipsStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<TokenOwnershipsStreamCursorInput>>;
  where?: InputMaybe<TokenOwnershipsBoolExp>;
};

export type SubscriptionRootTokensArgs = {
  distinct_on?: InputMaybe<Array<TokensSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<TokensOrderBy>>;
  where?: InputMaybe<TokensBoolExp>;
};

export type SubscriptionRootTokensByPkArgs = {
  property_version: Scalars["numeric"]["input"];
  token_data_id_hash: Scalars["String"]["input"];
  transaction_version: Scalars["bigint"]["input"];
};

export type SubscriptionRootTokensStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<TokensStreamCursorInput>>;
  where?: InputMaybe<TokensBoolExp>;
};

export type SubscriptionRootUserTransactionsArgs = {
  distinct_on?: InputMaybe<Array<UserTransactionsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<UserTransactionsOrderBy>>;
  where?: InputMaybe<UserTransactionsBoolExp>;
};

export type SubscriptionRootUserTransactionsByPkArgs = {
  version: Scalars["bigint"]["input"];
};

export type SubscriptionRootUserTransactionsStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<UserTransactionsStreamCursorInput>>;
  where?: InputMaybe<UserTransactionsBoolExp>;
};

/** columns and relationships of "table_items" */
export type TableItems = {
  decoded_key: Scalars["jsonb"]["output"];
  decoded_value?: Maybe<Scalars["jsonb"]["output"]>;
  key: Scalars["String"]["output"];
  table_handle: Scalars["String"]["output"];
  transaction_version: Scalars["bigint"]["output"];
  write_set_change_index: Scalars["bigint"]["output"];
};

/** columns and relationships of "table_items" */
export type TableItemsDecodedKeyArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "table_items" */
export type TableItemsDecodedValueArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** Boolean expression to filter rows from the table "table_items". All fields are combined with a logical 'AND'. */
export type TableItemsBoolExp = {
  _and?: InputMaybe<Array<TableItemsBoolExp>>;
  _not?: InputMaybe<TableItemsBoolExp>;
  _or?: InputMaybe<Array<TableItemsBoolExp>>;
  decoded_key?: InputMaybe<JsonbComparisonExp>;
  decoded_value?: InputMaybe<JsonbComparisonExp>;
  key?: InputMaybe<StringComparisonExp>;
  table_handle?: InputMaybe<StringComparisonExp>;
  transaction_version?: InputMaybe<BigintComparisonExp>;
  write_set_change_index?: InputMaybe<BigintComparisonExp>;
};

/** Ordering options when selecting data from "table_items". */
export type TableItemsOrderBy = {
  decoded_key?: InputMaybe<OrderBy>;
  decoded_value?: InputMaybe<OrderBy>;
  key?: InputMaybe<OrderBy>;
  table_handle?: InputMaybe<OrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
  write_set_change_index?: InputMaybe<OrderBy>;
};

/** select columns of table "table_items" */
export enum TableItemsSelectColumn {
  /** column name */
  DecodedKey = "decoded_key",
  /** column name */
  DecodedValue = "decoded_value",
  /** column name */
  Key = "key",
  /** column name */
  TableHandle = "table_handle",
  /** column name */
  TransactionVersion = "transaction_version",
  /** column name */
  WriteSetChangeIndex = "write_set_change_index",
}

/** Streaming cursor of the table "table_items" */
export type TableItemsStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: TableItemsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type TableItemsStreamCursorValueInput = {
  decoded_key?: InputMaybe<Scalars["jsonb"]["input"]>;
  decoded_value?: InputMaybe<Scalars["jsonb"]["input"]>;
  key?: InputMaybe<Scalars["String"]["input"]>;
  table_handle?: InputMaybe<Scalars["String"]["input"]>;
  transaction_version?: InputMaybe<Scalars["bigint"]["input"]>;
  write_set_change_index?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** columns and relationships of "table_metadatas" */
export type TableMetadatas = {
  handle: Scalars["String"]["output"];
  key_type: Scalars["String"]["output"];
  value_type: Scalars["String"]["output"];
};

/** Boolean expression to filter rows from the table "table_metadatas". All fields are combined with a logical 'AND'. */
export type TableMetadatasBoolExp = {
  _and?: InputMaybe<Array<TableMetadatasBoolExp>>;
  _not?: InputMaybe<TableMetadatasBoolExp>;
  _or?: InputMaybe<Array<TableMetadatasBoolExp>>;
  handle?: InputMaybe<StringComparisonExp>;
  key_type?: InputMaybe<StringComparisonExp>;
  value_type?: InputMaybe<StringComparisonExp>;
};

/** Ordering options when selecting data from "table_metadatas". */
export type TableMetadatasOrderBy = {
  handle?: InputMaybe<OrderBy>;
  key_type?: InputMaybe<OrderBy>;
  value_type?: InputMaybe<OrderBy>;
};

/** select columns of table "table_metadatas" */
export enum TableMetadatasSelectColumn {
  /** column name */
  Handle = "handle",
  /** column name */
  KeyType = "key_type",
  /** column name */
  ValueType = "value_type",
}

/** Streaming cursor of the table "table_metadatas" */
export type TableMetadatasStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: TableMetadatasStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type TableMetadatasStreamCursorValueInput = {
  handle?: InputMaybe<Scalars["String"]["input"]>;
  key_type?: InputMaybe<Scalars["String"]["input"]>;
  value_type?: InputMaybe<Scalars["String"]["input"]>;
};

/** Boolean expression to compare columns of type "timestamp". All fields are combined with logical 'AND'. */
export type TimestampComparisonExp = {
  _eq?: InputMaybe<Scalars["timestamp"]["input"]>;
  _gt?: InputMaybe<Scalars["timestamp"]["input"]>;
  _gte?: InputMaybe<Scalars["timestamp"]["input"]>;
  _in?: InputMaybe<Array<Scalars["timestamp"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["timestamp"]["input"]>;
  _lte?: InputMaybe<Scalars["timestamp"]["input"]>;
  _neq?: InputMaybe<Scalars["timestamp"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["timestamp"]["input"]>>;
};

/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export type TimestamptzComparisonExp = {
  _eq?: InputMaybe<Scalars["timestamptz"]["input"]>;
  _gt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  _gte?: InputMaybe<Scalars["timestamptz"]["input"]>;
  _in?: InputMaybe<Array<Scalars["timestamptz"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  _lte?: InputMaybe<Scalars["timestamptz"]["input"]>;
  _neq?: InputMaybe<Scalars["timestamptz"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["timestamptz"]["input"]>>;
};

/** columns and relationships of "token_activities" */
export type TokenActivities = {
  /** An array relationship */
  aptos_names_owner: Array<CurrentAptosNames>;
  /** An aggregate relationship */
  aptos_names_owner_aggregate: CurrentAptosNamesAggregate;
  /** An array relationship */
  aptos_names_to: Array<CurrentAptosNames>;
  /** An aggregate relationship */
  aptos_names_to_aggregate: CurrentAptosNamesAggregate;
  coin_amount?: Maybe<Scalars["numeric"]["output"]>;
  coin_type?: Maybe<Scalars["String"]["output"]>;
  collection_data_id_hash: Scalars["String"]["output"];
  collection_name: Scalars["String"]["output"];
  creator_address: Scalars["String"]["output"];
  /** An object relationship */
  current_token_data?: Maybe<CurrentTokenDatas>;
  event_account_address: Scalars["String"]["output"];
  event_creation_number: Scalars["bigint"]["output"];
  event_index?: Maybe<Scalars["bigint"]["output"]>;
  event_sequence_number: Scalars["bigint"]["output"];
  from_address?: Maybe<Scalars["String"]["output"]>;
  name: Scalars["String"]["output"];
  property_version: Scalars["numeric"]["output"];
  to_address?: Maybe<Scalars["String"]["output"]>;
  token_amount: Scalars["numeric"]["output"];
  token_data_id_hash: Scalars["String"]["output"];
  transaction_timestamp: Scalars["timestamp"]["output"];
  transaction_version: Scalars["bigint"]["output"];
  transfer_type: Scalars["String"]["output"];
};

/** columns and relationships of "token_activities" */
export type TokenActivitiesAptosNamesOwnerArgs = {
  distinct_on?: InputMaybe<Array<CurrentAptosNamesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentAptosNamesOrderBy>>;
  where?: InputMaybe<CurrentAptosNamesBoolExp>;
};

/** columns and relationships of "token_activities" */
export type TokenActivitiesAptosNamesOwnerAggregateArgs = {
  distinct_on?: InputMaybe<Array<CurrentAptosNamesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentAptosNamesOrderBy>>;
  where?: InputMaybe<CurrentAptosNamesBoolExp>;
};

/** columns and relationships of "token_activities" */
export type TokenActivitiesAptosNamesToArgs = {
  distinct_on?: InputMaybe<Array<CurrentAptosNamesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentAptosNamesOrderBy>>;
  where?: InputMaybe<CurrentAptosNamesBoolExp>;
};

/** columns and relationships of "token_activities" */
export type TokenActivitiesAptosNamesToAggregateArgs = {
  distinct_on?: InputMaybe<Array<CurrentAptosNamesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentAptosNamesOrderBy>>;
  where?: InputMaybe<CurrentAptosNamesBoolExp>;
};

/** aggregated selection of "token_activities" */
export type TokenActivitiesAggregate = {
  aggregate?: Maybe<TokenActivitiesAggregateFields>;
  nodes: Array<TokenActivities>;
};

/** aggregate fields of "token_activities" */
export type TokenActivitiesAggregateFields = {
  avg?: Maybe<TokenActivitiesAvgFields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<TokenActivitiesMaxFields>;
  min?: Maybe<TokenActivitiesMinFields>;
  stddev?: Maybe<TokenActivitiesStddevFields>;
  stddev_pop?: Maybe<TokenActivitiesStddevPopFields>;
  stddev_samp?: Maybe<TokenActivitiesStddevSampFields>;
  sum?: Maybe<TokenActivitiesSumFields>;
  var_pop?: Maybe<TokenActivitiesVarPopFields>;
  var_samp?: Maybe<TokenActivitiesVarSampFields>;
  variance?: Maybe<TokenActivitiesVarianceFields>;
};

/** aggregate fields of "token_activities" */
export type TokenActivitiesAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<TokenActivitiesSelectColumn>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "token_activities" */
export type TokenActivitiesAggregateOrderBy = {
  avg?: InputMaybe<TokenActivitiesAvgOrderBy>;
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<TokenActivitiesMaxOrderBy>;
  min?: InputMaybe<TokenActivitiesMinOrderBy>;
  stddev?: InputMaybe<TokenActivitiesStddevOrderBy>;
  stddev_pop?: InputMaybe<TokenActivitiesStddevPopOrderBy>;
  stddev_samp?: InputMaybe<TokenActivitiesStddevSampOrderBy>;
  sum?: InputMaybe<TokenActivitiesSumOrderBy>;
  var_pop?: InputMaybe<TokenActivitiesVarPopOrderBy>;
  var_samp?: InputMaybe<TokenActivitiesVarSampOrderBy>;
  variance?: InputMaybe<TokenActivitiesVarianceOrderBy>;
};

/** aggregate avg on columns */
export type TokenActivitiesAvgFields = {
  coin_amount?: Maybe<Scalars["Float"]["output"]>;
  event_creation_number?: Maybe<Scalars["Float"]["output"]>;
  event_index?: Maybe<Scalars["Float"]["output"]>;
  event_sequence_number?: Maybe<Scalars["Float"]["output"]>;
  property_version?: Maybe<Scalars["Float"]["output"]>;
  token_amount?: Maybe<Scalars["Float"]["output"]>;
  transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** order by avg() on columns of table "token_activities" */
export type TokenActivitiesAvgOrderBy = {
  coin_amount?: InputMaybe<OrderBy>;
  event_creation_number?: InputMaybe<OrderBy>;
  event_index?: InputMaybe<OrderBy>;
  event_sequence_number?: InputMaybe<OrderBy>;
  property_version?: InputMaybe<OrderBy>;
  token_amount?: InputMaybe<OrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "token_activities". All fields are combined with a logical 'AND'. */
export type TokenActivitiesBoolExp = {
  _and?: InputMaybe<Array<TokenActivitiesBoolExp>>;
  _not?: InputMaybe<TokenActivitiesBoolExp>;
  _or?: InputMaybe<Array<TokenActivitiesBoolExp>>;
  aptos_names_owner?: InputMaybe<CurrentAptosNamesBoolExp>;
  aptos_names_to?: InputMaybe<CurrentAptosNamesBoolExp>;
  coin_amount?: InputMaybe<NumericComparisonExp>;
  coin_type?: InputMaybe<StringComparisonExp>;
  collection_data_id_hash?: InputMaybe<StringComparisonExp>;
  collection_name?: InputMaybe<StringComparisonExp>;
  creator_address?: InputMaybe<StringComparisonExp>;
  current_token_data?: InputMaybe<CurrentTokenDatasBoolExp>;
  event_account_address?: InputMaybe<StringComparisonExp>;
  event_creation_number?: InputMaybe<BigintComparisonExp>;
  event_index?: InputMaybe<BigintComparisonExp>;
  event_sequence_number?: InputMaybe<BigintComparisonExp>;
  from_address?: InputMaybe<StringComparisonExp>;
  name?: InputMaybe<StringComparisonExp>;
  property_version?: InputMaybe<NumericComparisonExp>;
  to_address?: InputMaybe<StringComparisonExp>;
  token_amount?: InputMaybe<NumericComparisonExp>;
  token_data_id_hash?: InputMaybe<StringComparisonExp>;
  transaction_timestamp?: InputMaybe<TimestampComparisonExp>;
  transaction_version?: InputMaybe<BigintComparisonExp>;
  transfer_type?: InputMaybe<StringComparisonExp>;
};

/** aggregate max on columns */
export type TokenActivitiesMaxFields = {
  coin_amount?: Maybe<Scalars["numeric"]["output"]>;
  coin_type?: Maybe<Scalars["String"]["output"]>;
  collection_data_id_hash?: Maybe<Scalars["String"]["output"]>;
  collection_name?: Maybe<Scalars["String"]["output"]>;
  creator_address?: Maybe<Scalars["String"]["output"]>;
  event_account_address?: Maybe<Scalars["String"]["output"]>;
  event_creation_number?: Maybe<Scalars["bigint"]["output"]>;
  event_index?: Maybe<Scalars["bigint"]["output"]>;
  event_sequence_number?: Maybe<Scalars["bigint"]["output"]>;
  from_address?: Maybe<Scalars["String"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
  property_version?: Maybe<Scalars["numeric"]["output"]>;
  to_address?: Maybe<Scalars["String"]["output"]>;
  token_amount?: Maybe<Scalars["numeric"]["output"]>;
  token_data_id_hash?: Maybe<Scalars["String"]["output"]>;
  transaction_timestamp?: Maybe<Scalars["timestamp"]["output"]>;
  transaction_version?: Maybe<Scalars["bigint"]["output"]>;
  transfer_type?: Maybe<Scalars["String"]["output"]>;
};

/** order by max() on columns of table "token_activities" */
export type TokenActivitiesMaxOrderBy = {
  coin_amount?: InputMaybe<OrderBy>;
  coin_type?: InputMaybe<OrderBy>;
  collection_data_id_hash?: InputMaybe<OrderBy>;
  collection_name?: InputMaybe<OrderBy>;
  creator_address?: InputMaybe<OrderBy>;
  event_account_address?: InputMaybe<OrderBy>;
  event_creation_number?: InputMaybe<OrderBy>;
  event_index?: InputMaybe<OrderBy>;
  event_sequence_number?: InputMaybe<OrderBy>;
  from_address?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  property_version?: InputMaybe<OrderBy>;
  to_address?: InputMaybe<OrderBy>;
  token_amount?: InputMaybe<OrderBy>;
  token_data_id_hash?: InputMaybe<OrderBy>;
  transaction_timestamp?: InputMaybe<OrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
  transfer_type?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type TokenActivitiesMinFields = {
  coin_amount?: Maybe<Scalars["numeric"]["output"]>;
  coin_type?: Maybe<Scalars["String"]["output"]>;
  collection_data_id_hash?: Maybe<Scalars["String"]["output"]>;
  collection_name?: Maybe<Scalars["String"]["output"]>;
  creator_address?: Maybe<Scalars["String"]["output"]>;
  event_account_address?: Maybe<Scalars["String"]["output"]>;
  event_creation_number?: Maybe<Scalars["bigint"]["output"]>;
  event_index?: Maybe<Scalars["bigint"]["output"]>;
  event_sequence_number?: Maybe<Scalars["bigint"]["output"]>;
  from_address?: Maybe<Scalars["String"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
  property_version?: Maybe<Scalars["numeric"]["output"]>;
  to_address?: Maybe<Scalars["String"]["output"]>;
  token_amount?: Maybe<Scalars["numeric"]["output"]>;
  token_data_id_hash?: Maybe<Scalars["String"]["output"]>;
  transaction_timestamp?: Maybe<Scalars["timestamp"]["output"]>;
  transaction_version?: Maybe<Scalars["bigint"]["output"]>;
  transfer_type?: Maybe<Scalars["String"]["output"]>;
};

/** order by min() on columns of table "token_activities" */
export type TokenActivitiesMinOrderBy = {
  coin_amount?: InputMaybe<OrderBy>;
  coin_type?: InputMaybe<OrderBy>;
  collection_data_id_hash?: InputMaybe<OrderBy>;
  collection_name?: InputMaybe<OrderBy>;
  creator_address?: InputMaybe<OrderBy>;
  event_account_address?: InputMaybe<OrderBy>;
  event_creation_number?: InputMaybe<OrderBy>;
  event_index?: InputMaybe<OrderBy>;
  event_sequence_number?: InputMaybe<OrderBy>;
  from_address?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  property_version?: InputMaybe<OrderBy>;
  to_address?: InputMaybe<OrderBy>;
  token_amount?: InputMaybe<OrderBy>;
  token_data_id_hash?: InputMaybe<OrderBy>;
  transaction_timestamp?: InputMaybe<OrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
  transfer_type?: InputMaybe<OrderBy>;
};

/** Ordering options when selecting data from "token_activities". */
export type TokenActivitiesOrderBy = {
  aptos_names_owner_aggregate?: InputMaybe<CurrentAptosNamesAggregateOrderBy>;
  aptos_names_to_aggregate?: InputMaybe<CurrentAptosNamesAggregateOrderBy>;
  coin_amount?: InputMaybe<OrderBy>;
  coin_type?: InputMaybe<OrderBy>;
  collection_data_id_hash?: InputMaybe<OrderBy>;
  collection_name?: InputMaybe<OrderBy>;
  creator_address?: InputMaybe<OrderBy>;
  current_token_data?: InputMaybe<CurrentTokenDatasOrderBy>;
  event_account_address?: InputMaybe<OrderBy>;
  event_creation_number?: InputMaybe<OrderBy>;
  event_index?: InputMaybe<OrderBy>;
  event_sequence_number?: InputMaybe<OrderBy>;
  from_address?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  property_version?: InputMaybe<OrderBy>;
  to_address?: InputMaybe<OrderBy>;
  token_amount?: InputMaybe<OrderBy>;
  token_data_id_hash?: InputMaybe<OrderBy>;
  transaction_timestamp?: InputMaybe<OrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
  transfer_type?: InputMaybe<OrderBy>;
};

/** select columns of table "token_activities" */
export enum TokenActivitiesSelectColumn {
  /** column name */
  CoinAmount = "coin_amount",
  /** column name */
  CoinType = "coin_type",
  /** column name */
  CollectionDataIdHash = "collection_data_id_hash",
  /** column name */
  CollectionName = "collection_name",
  /** column name */
  CreatorAddress = "creator_address",
  /** column name */
  EventAccountAddress = "event_account_address",
  /** column name */
  EventCreationNumber = "event_creation_number",
  /** column name */
  EventIndex = "event_index",
  /** column name */
  EventSequenceNumber = "event_sequence_number",
  /** column name */
  FromAddress = "from_address",
  /** column name */
  Name = "name",
  /** column name */
  PropertyVersion = "property_version",
  /** column name */
  ToAddress = "to_address",
  /** column name */
  TokenAmount = "token_amount",
  /** column name */
  TokenDataIdHash = "token_data_id_hash",
  /** column name */
  TransactionTimestamp = "transaction_timestamp",
  /** column name */
  TransactionVersion = "transaction_version",
  /** column name */
  TransferType = "transfer_type",
}

/** aggregate stddev on columns */
export type TokenActivitiesStddevFields = {
  coin_amount?: Maybe<Scalars["Float"]["output"]>;
  event_creation_number?: Maybe<Scalars["Float"]["output"]>;
  event_index?: Maybe<Scalars["Float"]["output"]>;
  event_sequence_number?: Maybe<Scalars["Float"]["output"]>;
  property_version?: Maybe<Scalars["Float"]["output"]>;
  token_amount?: Maybe<Scalars["Float"]["output"]>;
  transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev() on columns of table "token_activities" */
export type TokenActivitiesStddevOrderBy = {
  coin_amount?: InputMaybe<OrderBy>;
  event_creation_number?: InputMaybe<OrderBy>;
  event_index?: InputMaybe<OrderBy>;
  event_sequence_number?: InputMaybe<OrderBy>;
  property_version?: InputMaybe<OrderBy>;
  token_amount?: InputMaybe<OrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
};

/** aggregate stddev_pop on columns */
export type TokenActivitiesStddevPopFields = {
  coin_amount?: Maybe<Scalars["Float"]["output"]>;
  event_creation_number?: Maybe<Scalars["Float"]["output"]>;
  event_index?: Maybe<Scalars["Float"]["output"]>;
  event_sequence_number?: Maybe<Scalars["Float"]["output"]>;
  property_version?: Maybe<Scalars["Float"]["output"]>;
  token_amount?: Maybe<Scalars["Float"]["output"]>;
  transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_pop() on columns of table "token_activities" */
export type TokenActivitiesStddevPopOrderBy = {
  coin_amount?: InputMaybe<OrderBy>;
  event_creation_number?: InputMaybe<OrderBy>;
  event_index?: InputMaybe<OrderBy>;
  event_sequence_number?: InputMaybe<OrderBy>;
  property_version?: InputMaybe<OrderBy>;
  token_amount?: InputMaybe<OrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
};

/** aggregate stddev_samp on columns */
export type TokenActivitiesStddevSampFields = {
  coin_amount?: Maybe<Scalars["Float"]["output"]>;
  event_creation_number?: Maybe<Scalars["Float"]["output"]>;
  event_index?: Maybe<Scalars["Float"]["output"]>;
  event_sequence_number?: Maybe<Scalars["Float"]["output"]>;
  property_version?: Maybe<Scalars["Float"]["output"]>;
  token_amount?: Maybe<Scalars["Float"]["output"]>;
  transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_samp() on columns of table "token_activities" */
export type TokenActivitiesStddevSampOrderBy = {
  coin_amount?: InputMaybe<OrderBy>;
  event_creation_number?: InputMaybe<OrderBy>;
  event_index?: InputMaybe<OrderBy>;
  event_sequence_number?: InputMaybe<OrderBy>;
  property_version?: InputMaybe<OrderBy>;
  token_amount?: InputMaybe<OrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
};

/** Streaming cursor of the table "token_activities" */
export type TokenActivitiesStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: TokenActivitiesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type TokenActivitiesStreamCursorValueInput = {
  coin_amount?: InputMaybe<Scalars["numeric"]["input"]>;
  coin_type?: InputMaybe<Scalars["String"]["input"]>;
  collection_data_id_hash?: InputMaybe<Scalars["String"]["input"]>;
  collection_name?: InputMaybe<Scalars["String"]["input"]>;
  creator_address?: InputMaybe<Scalars["String"]["input"]>;
  event_account_address?: InputMaybe<Scalars["String"]["input"]>;
  event_creation_number?: InputMaybe<Scalars["bigint"]["input"]>;
  event_index?: InputMaybe<Scalars["bigint"]["input"]>;
  event_sequence_number?: InputMaybe<Scalars["bigint"]["input"]>;
  from_address?: InputMaybe<Scalars["String"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  property_version?: InputMaybe<Scalars["numeric"]["input"]>;
  to_address?: InputMaybe<Scalars["String"]["input"]>;
  token_amount?: InputMaybe<Scalars["numeric"]["input"]>;
  token_data_id_hash?: InputMaybe<Scalars["String"]["input"]>;
  transaction_timestamp?: InputMaybe<Scalars["timestamp"]["input"]>;
  transaction_version?: InputMaybe<Scalars["bigint"]["input"]>;
  transfer_type?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregate sum on columns */
export type TokenActivitiesSumFields = {
  coin_amount?: Maybe<Scalars["numeric"]["output"]>;
  event_creation_number?: Maybe<Scalars["bigint"]["output"]>;
  event_index?: Maybe<Scalars["bigint"]["output"]>;
  event_sequence_number?: Maybe<Scalars["bigint"]["output"]>;
  property_version?: Maybe<Scalars["numeric"]["output"]>;
  token_amount?: Maybe<Scalars["numeric"]["output"]>;
  transaction_version?: Maybe<Scalars["bigint"]["output"]>;
};

/** order by sum() on columns of table "token_activities" */
export type TokenActivitiesSumOrderBy = {
  coin_amount?: InputMaybe<OrderBy>;
  event_creation_number?: InputMaybe<OrderBy>;
  event_index?: InputMaybe<OrderBy>;
  event_sequence_number?: InputMaybe<OrderBy>;
  property_version?: InputMaybe<OrderBy>;
  token_amount?: InputMaybe<OrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
};

/** columns and relationships of "token_activities_v2" */
export type TokenActivitiesV2 = {
  after_value?: Maybe<Scalars["String"]["output"]>;
  /** An array relationship */
  aptos_names_from: Array<CurrentAptosNames>;
  /** An aggregate relationship */
  aptos_names_from_aggregate: CurrentAptosNamesAggregate;
  /** An array relationship */
  aptos_names_to: Array<CurrentAptosNames>;
  /** An aggregate relationship */
  aptos_names_to_aggregate: CurrentAptosNamesAggregate;
  before_value?: Maybe<Scalars["String"]["output"]>;
  /** An object relationship */
  current_token_data?: Maybe<CurrentTokenDatasV2>;
  entry_function_id_str?: Maybe<Scalars["String"]["output"]>;
  event_account_address: Scalars["String"]["output"];
  event_index: Scalars["bigint"]["output"];
  from_address?: Maybe<Scalars["String"]["output"]>;
  is_fungible_v2?: Maybe<Scalars["Boolean"]["output"]>;
  property_version_v1: Scalars["numeric"]["output"];
  to_address?: Maybe<Scalars["String"]["output"]>;
  token_amount: Scalars["numeric"]["output"];
  token_data_id: Scalars["String"]["output"];
  token_standard: Scalars["String"]["output"];
  transaction_timestamp: Scalars["timestamp"]["output"];
  transaction_version: Scalars["bigint"]["output"];
  type: Scalars["String"]["output"];
};

/** columns and relationships of "token_activities_v2" */
export type TokenActivitiesV2AptosNamesFromArgs = {
  distinct_on?: InputMaybe<Array<CurrentAptosNamesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentAptosNamesOrderBy>>;
  where?: InputMaybe<CurrentAptosNamesBoolExp>;
};

/** columns and relationships of "token_activities_v2" */
export type TokenActivitiesV2AptosNamesFromAggregateArgs = {
  distinct_on?: InputMaybe<Array<CurrentAptosNamesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentAptosNamesOrderBy>>;
  where?: InputMaybe<CurrentAptosNamesBoolExp>;
};

/** columns and relationships of "token_activities_v2" */
export type TokenActivitiesV2AptosNamesToArgs = {
  distinct_on?: InputMaybe<Array<CurrentAptosNamesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentAptosNamesOrderBy>>;
  where?: InputMaybe<CurrentAptosNamesBoolExp>;
};

/** columns and relationships of "token_activities_v2" */
export type TokenActivitiesV2AptosNamesToAggregateArgs = {
  distinct_on?: InputMaybe<Array<CurrentAptosNamesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentAptosNamesOrderBy>>;
  where?: InputMaybe<CurrentAptosNamesBoolExp>;
};

/** aggregated selection of "token_activities_v2" */
export type TokenActivitiesV2Aggregate = {
  aggregate?: Maybe<TokenActivitiesV2AggregateFields>;
  nodes: Array<TokenActivitiesV2>;
};

/** aggregate fields of "token_activities_v2" */
export type TokenActivitiesV2AggregateFields = {
  avg?: Maybe<TokenActivitiesV2AvgFields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<TokenActivitiesV2MaxFields>;
  min?: Maybe<TokenActivitiesV2MinFields>;
  stddev?: Maybe<TokenActivitiesV2StddevFields>;
  stddev_pop?: Maybe<TokenActivitiesV2StddevPopFields>;
  stddev_samp?: Maybe<TokenActivitiesV2StddevSampFields>;
  sum?: Maybe<TokenActivitiesV2SumFields>;
  var_pop?: Maybe<TokenActivitiesV2VarPopFields>;
  var_samp?: Maybe<TokenActivitiesV2VarSampFields>;
  variance?: Maybe<TokenActivitiesV2VarianceFields>;
};

/** aggregate fields of "token_activities_v2" */
export type TokenActivitiesV2AggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<TokenActivitiesV2SelectColumn>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "token_activities_v2" */
export type TokenActivitiesV2AggregateOrderBy = {
  avg?: InputMaybe<TokenActivitiesV2AvgOrderBy>;
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<TokenActivitiesV2MaxOrderBy>;
  min?: InputMaybe<TokenActivitiesV2MinOrderBy>;
  stddev?: InputMaybe<TokenActivitiesV2StddevOrderBy>;
  stddev_pop?: InputMaybe<TokenActivitiesV2StddevPopOrderBy>;
  stddev_samp?: InputMaybe<TokenActivitiesV2StddevSampOrderBy>;
  sum?: InputMaybe<TokenActivitiesV2SumOrderBy>;
  var_pop?: InputMaybe<TokenActivitiesV2VarPopOrderBy>;
  var_samp?: InputMaybe<TokenActivitiesV2VarSampOrderBy>;
  variance?: InputMaybe<TokenActivitiesV2VarianceOrderBy>;
};

/** aggregate avg on columns */
export type TokenActivitiesV2AvgFields = {
  event_index?: Maybe<Scalars["Float"]["output"]>;
  property_version_v1?: Maybe<Scalars["Float"]["output"]>;
  token_amount?: Maybe<Scalars["Float"]["output"]>;
  transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** order by avg() on columns of table "token_activities_v2" */
export type TokenActivitiesV2AvgOrderBy = {
  event_index?: InputMaybe<OrderBy>;
  property_version_v1?: InputMaybe<OrderBy>;
  token_amount?: InputMaybe<OrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "token_activities_v2". All fields are combined with a logical 'AND'. */
export type TokenActivitiesV2BoolExp = {
  _and?: InputMaybe<Array<TokenActivitiesV2BoolExp>>;
  _not?: InputMaybe<TokenActivitiesV2BoolExp>;
  _or?: InputMaybe<Array<TokenActivitiesV2BoolExp>>;
  after_value?: InputMaybe<StringComparisonExp>;
  aptos_names_from?: InputMaybe<CurrentAptosNamesBoolExp>;
  aptos_names_to?: InputMaybe<CurrentAptosNamesBoolExp>;
  before_value?: InputMaybe<StringComparisonExp>;
  current_token_data?: InputMaybe<CurrentTokenDatasV2BoolExp>;
  entry_function_id_str?: InputMaybe<StringComparisonExp>;
  event_account_address?: InputMaybe<StringComparisonExp>;
  event_index?: InputMaybe<BigintComparisonExp>;
  from_address?: InputMaybe<StringComparisonExp>;
  is_fungible_v2?: InputMaybe<BooleanComparisonExp>;
  property_version_v1?: InputMaybe<NumericComparisonExp>;
  to_address?: InputMaybe<StringComparisonExp>;
  token_amount?: InputMaybe<NumericComparisonExp>;
  token_data_id?: InputMaybe<StringComparisonExp>;
  token_standard?: InputMaybe<StringComparisonExp>;
  transaction_timestamp?: InputMaybe<TimestampComparisonExp>;
  transaction_version?: InputMaybe<BigintComparisonExp>;
  type?: InputMaybe<StringComparisonExp>;
};

/** aggregate max on columns */
export type TokenActivitiesV2MaxFields = {
  after_value?: Maybe<Scalars["String"]["output"]>;
  before_value?: Maybe<Scalars["String"]["output"]>;
  entry_function_id_str?: Maybe<Scalars["String"]["output"]>;
  event_account_address?: Maybe<Scalars["String"]["output"]>;
  event_index?: Maybe<Scalars["bigint"]["output"]>;
  from_address?: Maybe<Scalars["String"]["output"]>;
  property_version_v1?: Maybe<Scalars["numeric"]["output"]>;
  to_address?: Maybe<Scalars["String"]["output"]>;
  token_amount?: Maybe<Scalars["numeric"]["output"]>;
  token_data_id?: Maybe<Scalars["String"]["output"]>;
  token_standard?: Maybe<Scalars["String"]["output"]>;
  transaction_timestamp?: Maybe<Scalars["timestamp"]["output"]>;
  transaction_version?: Maybe<Scalars["bigint"]["output"]>;
  type?: Maybe<Scalars["String"]["output"]>;
};

/** order by max() on columns of table "token_activities_v2" */
export type TokenActivitiesV2MaxOrderBy = {
  after_value?: InputMaybe<OrderBy>;
  before_value?: InputMaybe<OrderBy>;
  entry_function_id_str?: InputMaybe<OrderBy>;
  event_account_address?: InputMaybe<OrderBy>;
  event_index?: InputMaybe<OrderBy>;
  from_address?: InputMaybe<OrderBy>;
  property_version_v1?: InputMaybe<OrderBy>;
  to_address?: InputMaybe<OrderBy>;
  token_amount?: InputMaybe<OrderBy>;
  token_data_id?: InputMaybe<OrderBy>;
  token_standard?: InputMaybe<OrderBy>;
  transaction_timestamp?: InputMaybe<OrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
  type?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type TokenActivitiesV2MinFields = {
  after_value?: Maybe<Scalars["String"]["output"]>;
  before_value?: Maybe<Scalars["String"]["output"]>;
  entry_function_id_str?: Maybe<Scalars["String"]["output"]>;
  event_account_address?: Maybe<Scalars["String"]["output"]>;
  event_index?: Maybe<Scalars["bigint"]["output"]>;
  from_address?: Maybe<Scalars["String"]["output"]>;
  property_version_v1?: Maybe<Scalars["numeric"]["output"]>;
  to_address?: Maybe<Scalars["String"]["output"]>;
  token_amount?: Maybe<Scalars["numeric"]["output"]>;
  token_data_id?: Maybe<Scalars["String"]["output"]>;
  token_standard?: Maybe<Scalars["String"]["output"]>;
  transaction_timestamp?: Maybe<Scalars["timestamp"]["output"]>;
  transaction_version?: Maybe<Scalars["bigint"]["output"]>;
  type?: Maybe<Scalars["String"]["output"]>;
};

/** order by min() on columns of table "token_activities_v2" */
export type TokenActivitiesV2MinOrderBy = {
  after_value?: InputMaybe<OrderBy>;
  before_value?: InputMaybe<OrderBy>;
  entry_function_id_str?: InputMaybe<OrderBy>;
  event_account_address?: InputMaybe<OrderBy>;
  event_index?: InputMaybe<OrderBy>;
  from_address?: InputMaybe<OrderBy>;
  property_version_v1?: InputMaybe<OrderBy>;
  to_address?: InputMaybe<OrderBy>;
  token_amount?: InputMaybe<OrderBy>;
  token_data_id?: InputMaybe<OrderBy>;
  token_standard?: InputMaybe<OrderBy>;
  transaction_timestamp?: InputMaybe<OrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
  type?: InputMaybe<OrderBy>;
};

/** Ordering options when selecting data from "token_activities_v2". */
export type TokenActivitiesV2OrderBy = {
  after_value?: InputMaybe<OrderBy>;
  aptos_names_from_aggregate?: InputMaybe<CurrentAptosNamesAggregateOrderBy>;
  aptos_names_to_aggregate?: InputMaybe<CurrentAptosNamesAggregateOrderBy>;
  before_value?: InputMaybe<OrderBy>;
  current_token_data?: InputMaybe<CurrentTokenDatasV2OrderBy>;
  entry_function_id_str?: InputMaybe<OrderBy>;
  event_account_address?: InputMaybe<OrderBy>;
  event_index?: InputMaybe<OrderBy>;
  from_address?: InputMaybe<OrderBy>;
  is_fungible_v2?: InputMaybe<OrderBy>;
  property_version_v1?: InputMaybe<OrderBy>;
  to_address?: InputMaybe<OrderBy>;
  token_amount?: InputMaybe<OrderBy>;
  token_data_id?: InputMaybe<OrderBy>;
  token_standard?: InputMaybe<OrderBy>;
  transaction_timestamp?: InputMaybe<OrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
  type?: InputMaybe<OrderBy>;
};

/** select columns of table "token_activities_v2" */
export enum TokenActivitiesV2SelectColumn {
  /** column name */
  AfterValue = "after_value",
  /** column name */
  BeforeValue = "before_value",
  /** column name */
  EntryFunctionIdStr = "entry_function_id_str",
  /** column name */
  EventAccountAddress = "event_account_address",
  /** column name */
  EventIndex = "event_index",
  /** column name */
  FromAddress = "from_address",
  /** column name */
  IsFungibleV2 = "is_fungible_v2",
  /** column name */
  PropertyVersionV1 = "property_version_v1",
  /** column name */
  ToAddress = "to_address",
  /** column name */
  TokenAmount = "token_amount",
  /** column name */
  TokenDataId = "token_data_id",
  /** column name */
  TokenStandard = "token_standard",
  /** column name */
  TransactionTimestamp = "transaction_timestamp",
  /** column name */
  TransactionVersion = "transaction_version",
  /** column name */
  Type = "type",
}

/** aggregate stddev on columns */
export type TokenActivitiesV2StddevFields = {
  event_index?: Maybe<Scalars["Float"]["output"]>;
  property_version_v1?: Maybe<Scalars["Float"]["output"]>;
  token_amount?: Maybe<Scalars["Float"]["output"]>;
  transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev() on columns of table "token_activities_v2" */
export type TokenActivitiesV2StddevOrderBy = {
  event_index?: InputMaybe<OrderBy>;
  property_version_v1?: InputMaybe<OrderBy>;
  token_amount?: InputMaybe<OrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
};

/** aggregate stddev_pop on columns */
export type TokenActivitiesV2StddevPopFields = {
  event_index?: Maybe<Scalars["Float"]["output"]>;
  property_version_v1?: Maybe<Scalars["Float"]["output"]>;
  token_amount?: Maybe<Scalars["Float"]["output"]>;
  transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_pop() on columns of table "token_activities_v2" */
export type TokenActivitiesV2StddevPopOrderBy = {
  event_index?: InputMaybe<OrderBy>;
  property_version_v1?: InputMaybe<OrderBy>;
  token_amount?: InputMaybe<OrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
};

/** aggregate stddev_samp on columns */
export type TokenActivitiesV2StddevSampFields = {
  event_index?: Maybe<Scalars["Float"]["output"]>;
  property_version_v1?: Maybe<Scalars["Float"]["output"]>;
  token_amount?: Maybe<Scalars["Float"]["output"]>;
  transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_samp() on columns of table "token_activities_v2" */
export type TokenActivitiesV2StddevSampOrderBy = {
  event_index?: InputMaybe<OrderBy>;
  property_version_v1?: InputMaybe<OrderBy>;
  token_amount?: InputMaybe<OrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
};

/** Streaming cursor of the table "token_activities_v2" */
export type TokenActivitiesV2StreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: TokenActivitiesV2StreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type TokenActivitiesV2StreamCursorValueInput = {
  after_value?: InputMaybe<Scalars["String"]["input"]>;
  before_value?: InputMaybe<Scalars["String"]["input"]>;
  entry_function_id_str?: InputMaybe<Scalars["String"]["input"]>;
  event_account_address?: InputMaybe<Scalars["String"]["input"]>;
  event_index?: InputMaybe<Scalars["bigint"]["input"]>;
  from_address?: InputMaybe<Scalars["String"]["input"]>;
  is_fungible_v2?: InputMaybe<Scalars["Boolean"]["input"]>;
  property_version_v1?: InputMaybe<Scalars["numeric"]["input"]>;
  to_address?: InputMaybe<Scalars["String"]["input"]>;
  token_amount?: InputMaybe<Scalars["numeric"]["input"]>;
  token_data_id?: InputMaybe<Scalars["String"]["input"]>;
  token_standard?: InputMaybe<Scalars["String"]["input"]>;
  transaction_timestamp?: InputMaybe<Scalars["timestamp"]["input"]>;
  transaction_version?: InputMaybe<Scalars["bigint"]["input"]>;
  type?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregate sum on columns */
export type TokenActivitiesV2SumFields = {
  event_index?: Maybe<Scalars["bigint"]["output"]>;
  property_version_v1?: Maybe<Scalars["numeric"]["output"]>;
  token_amount?: Maybe<Scalars["numeric"]["output"]>;
  transaction_version?: Maybe<Scalars["bigint"]["output"]>;
};

/** order by sum() on columns of table "token_activities_v2" */
export type TokenActivitiesV2SumOrderBy = {
  event_index?: InputMaybe<OrderBy>;
  property_version_v1?: InputMaybe<OrderBy>;
  token_amount?: InputMaybe<OrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
};

/** aggregate var_pop on columns */
export type TokenActivitiesV2VarPopFields = {
  event_index?: Maybe<Scalars["Float"]["output"]>;
  property_version_v1?: Maybe<Scalars["Float"]["output"]>;
  token_amount?: Maybe<Scalars["Float"]["output"]>;
  transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_pop() on columns of table "token_activities_v2" */
export type TokenActivitiesV2VarPopOrderBy = {
  event_index?: InputMaybe<OrderBy>;
  property_version_v1?: InputMaybe<OrderBy>;
  token_amount?: InputMaybe<OrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
};

/** aggregate var_samp on columns */
export type TokenActivitiesV2VarSampFields = {
  event_index?: Maybe<Scalars["Float"]["output"]>;
  property_version_v1?: Maybe<Scalars["Float"]["output"]>;
  token_amount?: Maybe<Scalars["Float"]["output"]>;
  transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_samp() on columns of table "token_activities_v2" */
export type TokenActivitiesV2VarSampOrderBy = {
  event_index?: InputMaybe<OrderBy>;
  property_version_v1?: InputMaybe<OrderBy>;
  token_amount?: InputMaybe<OrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
};

/** aggregate variance on columns */
export type TokenActivitiesV2VarianceFields = {
  event_index?: Maybe<Scalars["Float"]["output"]>;
  property_version_v1?: Maybe<Scalars["Float"]["output"]>;
  token_amount?: Maybe<Scalars["Float"]["output"]>;
  transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** order by variance() on columns of table "token_activities_v2" */
export type TokenActivitiesV2VarianceOrderBy = {
  event_index?: InputMaybe<OrderBy>;
  property_version_v1?: InputMaybe<OrderBy>;
  token_amount?: InputMaybe<OrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
};

/** aggregate var_pop on columns */
export type TokenActivitiesVarPopFields = {
  coin_amount?: Maybe<Scalars["Float"]["output"]>;
  event_creation_number?: Maybe<Scalars["Float"]["output"]>;
  event_index?: Maybe<Scalars["Float"]["output"]>;
  event_sequence_number?: Maybe<Scalars["Float"]["output"]>;
  property_version?: Maybe<Scalars["Float"]["output"]>;
  token_amount?: Maybe<Scalars["Float"]["output"]>;
  transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_pop() on columns of table "token_activities" */
export type TokenActivitiesVarPopOrderBy = {
  coin_amount?: InputMaybe<OrderBy>;
  event_creation_number?: InputMaybe<OrderBy>;
  event_index?: InputMaybe<OrderBy>;
  event_sequence_number?: InputMaybe<OrderBy>;
  property_version?: InputMaybe<OrderBy>;
  token_amount?: InputMaybe<OrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
};

/** aggregate var_samp on columns */
export type TokenActivitiesVarSampFields = {
  coin_amount?: Maybe<Scalars["Float"]["output"]>;
  event_creation_number?: Maybe<Scalars["Float"]["output"]>;
  event_index?: Maybe<Scalars["Float"]["output"]>;
  event_sequence_number?: Maybe<Scalars["Float"]["output"]>;
  property_version?: Maybe<Scalars["Float"]["output"]>;
  token_amount?: Maybe<Scalars["Float"]["output"]>;
  transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_samp() on columns of table "token_activities" */
export type TokenActivitiesVarSampOrderBy = {
  coin_amount?: InputMaybe<OrderBy>;
  event_creation_number?: InputMaybe<OrderBy>;
  event_index?: InputMaybe<OrderBy>;
  event_sequence_number?: InputMaybe<OrderBy>;
  property_version?: InputMaybe<OrderBy>;
  token_amount?: InputMaybe<OrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
};

/** aggregate variance on columns */
export type TokenActivitiesVarianceFields = {
  coin_amount?: Maybe<Scalars["Float"]["output"]>;
  event_creation_number?: Maybe<Scalars["Float"]["output"]>;
  event_index?: Maybe<Scalars["Float"]["output"]>;
  event_sequence_number?: Maybe<Scalars["Float"]["output"]>;
  property_version?: Maybe<Scalars["Float"]["output"]>;
  token_amount?: Maybe<Scalars["Float"]["output"]>;
  transaction_version?: Maybe<Scalars["Float"]["output"]>;
};

/** order by variance() on columns of table "token_activities" */
export type TokenActivitiesVarianceOrderBy = {
  coin_amount?: InputMaybe<OrderBy>;
  event_creation_number?: InputMaybe<OrderBy>;
  event_index?: InputMaybe<OrderBy>;
  event_sequence_number?: InputMaybe<OrderBy>;
  property_version?: InputMaybe<OrderBy>;
  token_amount?: InputMaybe<OrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
};

/** columns and relationships of "token_datas" */
export type TokenDatas = {
  collection_data_id_hash: Scalars["String"]["output"];
  collection_name: Scalars["String"]["output"];
  creator_address: Scalars["String"]["output"];
  default_properties: Scalars["jsonb"]["output"];
  description: Scalars["String"]["output"];
  description_mutable: Scalars["Boolean"]["output"];
  largest_property_version: Scalars["numeric"]["output"];
  maximum: Scalars["numeric"]["output"];
  maximum_mutable: Scalars["Boolean"]["output"];
  metadata_uri: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
  payee_address: Scalars["String"]["output"];
  properties_mutable: Scalars["Boolean"]["output"];
  royalty_mutable: Scalars["Boolean"]["output"];
  royalty_points_denominator: Scalars["numeric"]["output"];
  royalty_points_numerator: Scalars["numeric"]["output"];
  supply: Scalars["numeric"]["output"];
  token_data_id_hash: Scalars["String"]["output"];
  transaction_timestamp: Scalars["timestamp"]["output"];
  transaction_version: Scalars["bigint"]["output"];
  uri_mutable: Scalars["Boolean"]["output"];
};

/** columns and relationships of "token_datas" */
export type TokenDatasDefaultPropertiesArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** Boolean expression to filter rows from the table "token_datas". All fields are combined with a logical 'AND'. */
export type TokenDatasBoolExp = {
  _and?: InputMaybe<Array<TokenDatasBoolExp>>;
  _not?: InputMaybe<TokenDatasBoolExp>;
  _or?: InputMaybe<Array<TokenDatasBoolExp>>;
  collection_data_id_hash?: InputMaybe<StringComparisonExp>;
  collection_name?: InputMaybe<StringComparisonExp>;
  creator_address?: InputMaybe<StringComparisonExp>;
  default_properties?: InputMaybe<JsonbComparisonExp>;
  description?: InputMaybe<StringComparisonExp>;
  description_mutable?: InputMaybe<BooleanComparisonExp>;
  largest_property_version?: InputMaybe<NumericComparisonExp>;
  maximum?: InputMaybe<NumericComparisonExp>;
  maximum_mutable?: InputMaybe<BooleanComparisonExp>;
  metadata_uri?: InputMaybe<StringComparisonExp>;
  name?: InputMaybe<StringComparisonExp>;
  payee_address?: InputMaybe<StringComparisonExp>;
  properties_mutable?: InputMaybe<BooleanComparisonExp>;
  royalty_mutable?: InputMaybe<BooleanComparisonExp>;
  royalty_points_denominator?: InputMaybe<NumericComparisonExp>;
  royalty_points_numerator?: InputMaybe<NumericComparisonExp>;
  supply?: InputMaybe<NumericComparisonExp>;
  token_data_id_hash?: InputMaybe<StringComparisonExp>;
  transaction_timestamp?: InputMaybe<TimestampComparisonExp>;
  transaction_version?: InputMaybe<BigintComparisonExp>;
  uri_mutable?: InputMaybe<BooleanComparisonExp>;
};

/** Ordering options when selecting data from "token_datas". */
export type TokenDatasOrderBy = {
  collection_data_id_hash?: InputMaybe<OrderBy>;
  collection_name?: InputMaybe<OrderBy>;
  creator_address?: InputMaybe<OrderBy>;
  default_properties?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  description_mutable?: InputMaybe<OrderBy>;
  largest_property_version?: InputMaybe<OrderBy>;
  maximum?: InputMaybe<OrderBy>;
  maximum_mutable?: InputMaybe<OrderBy>;
  metadata_uri?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  payee_address?: InputMaybe<OrderBy>;
  properties_mutable?: InputMaybe<OrderBy>;
  royalty_mutable?: InputMaybe<OrderBy>;
  royalty_points_denominator?: InputMaybe<OrderBy>;
  royalty_points_numerator?: InputMaybe<OrderBy>;
  supply?: InputMaybe<OrderBy>;
  token_data_id_hash?: InputMaybe<OrderBy>;
  transaction_timestamp?: InputMaybe<OrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
  uri_mutable?: InputMaybe<OrderBy>;
};

/** select columns of table "token_datas" */
export enum TokenDatasSelectColumn {
  /** column name */
  CollectionDataIdHash = "collection_data_id_hash",
  /** column name */
  CollectionName = "collection_name",
  /** column name */
  CreatorAddress = "creator_address",
  /** column name */
  DefaultProperties = "default_properties",
  /** column name */
  Description = "description",
  /** column name */
  DescriptionMutable = "description_mutable",
  /** column name */
  LargestPropertyVersion = "largest_property_version",
  /** column name */
  Maximum = "maximum",
  /** column name */
  MaximumMutable = "maximum_mutable",
  /** column name */
  MetadataUri = "metadata_uri",
  /** column name */
  Name = "name",
  /** column name */
  PayeeAddress = "payee_address",
  /** column name */
  PropertiesMutable = "properties_mutable",
  /** column name */
  RoyaltyMutable = "royalty_mutable",
  /** column name */
  RoyaltyPointsDenominator = "royalty_points_denominator",
  /** column name */
  RoyaltyPointsNumerator = "royalty_points_numerator",
  /** column name */
  Supply = "supply",
  /** column name */
  TokenDataIdHash = "token_data_id_hash",
  /** column name */
  TransactionTimestamp = "transaction_timestamp",
  /** column name */
  TransactionVersion = "transaction_version",
  /** column name */
  UriMutable = "uri_mutable",
}

/** Streaming cursor of the table "token_datas" */
export type TokenDatasStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: TokenDatasStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type TokenDatasStreamCursorValueInput = {
  collection_data_id_hash?: InputMaybe<Scalars["String"]["input"]>;
  collection_name?: InputMaybe<Scalars["String"]["input"]>;
  creator_address?: InputMaybe<Scalars["String"]["input"]>;
  default_properties?: InputMaybe<Scalars["jsonb"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  description_mutable?: InputMaybe<Scalars["Boolean"]["input"]>;
  largest_property_version?: InputMaybe<Scalars["numeric"]["input"]>;
  maximum?: InputMaybe<Scalars["numeric"]["input"]>;
  maximum_mutable?: InputMaybe<Scalars["Boolean"]["input"]>;
  metadata_uri?: InputMaybe<Scalars["String"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  payee_address?: InputMaybe<Scalars["String"]["input"]>;
  properties_mutable?: InputMaybe<Scalars["Boolean"]["input"]>;
  royalty_mutable?: InputMaybe<Scalars["Boolean"]["input"]>;
  royalty_points_denominator?: InputMaybe<Scalars["numeric"]["input"]>;
  royalty_points_numerator?: InputMaybe<Scalars["numeric"]["input"]>;
  supply?: InputMaybe<Scalars["numeric"]["input"]>;
  token_data_id_hash?: InputMaybe<Scalars["String"]["input"]>;
  transaction_timestamp?: InputMaybe<Scalars["timestamp"]["input"]>;
  transaction_version?: InputMaybe<Scalars["bigint"]["input"]>;
  uri_mutable?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** columns and relationships of "token_ownerships" */
export type TokenOwnerships = {
  amount: Scalars["numeric"]["output"];
  collection_data_id_hash: Scalars["String"]["output"];
  collection_name: Scalars["String"]["output"];
  creator_address: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
  owner_address?: Maybe<Scalars["String"]["output"]>;
  property_version: Scalars["numeric"]["output"];
  table_handle: Scalars["String"]["output"];
  table_type?: Maybe<Scalars["String"]["output"]>;
  token_data_id_hash: Scalars["String"]["output"];
  transaction_timestamp: Scalars["timestamp"]["output"];
  transaction_version: Scalars["bigint"]["output"];
};

/** Boolean expression to filter rows from the table "token_ownerships". All fields are combined with a logical 'AND'. */
export type TokenOwnershipsBoolExp = {
  _and?: InputMaybe<Array<TokenOwnershipsBoolExp>>;
  _not?: InputMaybe<TokenOwnershipsBoolExp>;
  _or?: InputMaybe<Array<TokenOwnershipsBoolExp>>;
  amount?: InputMaybe<NumericComparisonExp>;
  collection_data_id_hash?: InputMaybe<StringComparisonExp>;
  collection_name?: InputMaybe<StringComparisonExp>;
  creator_address?: InputMaybe<StringComparisonExp>;
  name?: InputMaybe<StringComparisonExp>;
  owner_address?: InputMaybe<StringComparisonExp>;
  property_version?: InputMaybe<NumericComparisonExp>;
  table_handle?: InputMaybe<StringComparisonExp>;
  table_type?: InputMaybe<StringComparisonExp>;
  token_data_id_hash?: InputMaybe<StringComparisonExp>;
  transaction_timestamp?: InputMaybe<TimestampComparisonExp>;
  transaction_version?: InputMaybe<BigintComparisonExp>;
};

/** Ordering options when selecting data from "token_ownerships". */
export type TokenOwnershipsOrderBy = {
  amount?: InputMaybe<OrderBy>;
  collection_data_id_hash?: InputMaybe<OrderBy>;
  collection_name?: InputMaybe<OrderBy>;
  creator_address?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  owner_address?: InputMaybe<OrderBy>;
  property_version?: InputMaybe<OrderBy>;
  table_handle?: InputMaybe<OrderBy>;
  table_type?: InputMaybe<OrderBy>;
  token_data_id_hash?: InputMaybe<OrderBy>;
  transaction_timestamp?: InputMaybe<OrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
};

/** select columns of table "token_ownerships" */
export enum TokenOwnershipsSelectColumn {
  /** column name */
  Amount = "amount",
  /** column name */
  CollectionDataIdHash = "collection_data_id_hash",
  /** column name */
  CollectionName = "collection_name",
  /** column name */
  CreatorAddress = "creator_address",
  /** column name */
  Name = "name",
  /** column name */
  OwnerAddress = "owner_address",
  /** column name */
  PropertyVersion = "property_version",
  /** column name */
  TableHandle = "table_handle",
  /** column name */
  TableType = "table_type",
  /** column name */
  TokenDataIdHash = "token_data_id_hash",
  /** column name */
  TransactionTimestamp = "transaction_timestamp",
  /** column name */
  TransactionVersion = "transaction_version",
}

/** Streaming cursor of the table "token_ownerships" */
export type TokenOwnershipsStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: TokenOwnershipsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type TokenOwnershipsStreamCursorValueInput = {
  amount?: InputMaybe<Scalars["numeric"]["input"]>;
  collection_data_id_hash?: InputMaybe<Scalars["String"]["input"]>;
  collection_name?: InputMaybe<Scalars["String"]["input"]>;
  creator_address?: InputMaybe<Scalars["String"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  owner_address?: InputMaybe<Scalars["String"]["input"]>;
  property_version?: InputMaybe<Scalars["numeric"]["input"]>;
  table_handle?: InputMaybe<Scalars["String"]["input"]>;
  table_type?: InputMaybe<Scalars["String"]["input"]>;
  token_data_id_hash?: InputMaybe<Scalars["String"]["input"]>;
  transaction_timestamp?: InputMaybe<Scalars["timestamp"]["input"]>;
  transaction_version?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** columns and relationships of "tokens" */
export type Tokens = {
  collection_data_id_hash: Scalars["String"]["output"];
  collection_name: Scalars["String"]["output"];
  creator_address: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
  property_version: Scalars["numeric"]["output"];
  token_data_id_hash: Scalars["String"]["output"];
  token_properties: Scalars["jsonb"]["output"];
  transaction_timestamp: Scalars["timestamp"]["output"];
  transaction_version: Scalars["bigint"]["output"];
};

/** columns and relationships of "tokens" */
export type TokensTokenPropertiesArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** Boolean expression to filter rows from the table "tokens". All fields are combined with a logical 'AND'. */
export type TokensBoolExp = {
  _and?: InputMaybe<Array<TokensBoolExp>>;
  _not?: InputMaybe<TokensBoolExp>;
  _or?: InputMaybe<Array<TokensBoolExp>>;
  collection_data_id_hash?: InputMaybe<StringComparisonExp>;
  collection_name?: InputMaybe<StringComparisonExp>;
  creator_address?: InputMaybe<StringComparisonExp>;
  name?: InputMaybe<StringComparisonExp>;
  property_version?: InputMaybe<NumericComparisonExp>;
  token_data_id_hash?: InputMaybe<StringComparisonExp>;
  token_properties?: InputMaybe<JsonbComparisonExp>;
  transaction_timestamp?: InputMaybe<TimestampComparisonExp>;
  transaction_version?: InputMaybe<BigintComparisonExp>;
};

/** Ordering options when selecting data from "tokens". */
export type TokensOrderBy = {
  collection_data_id_hash?: InputMaybe<OrderBy>;
  collection_name?: InputMaybe<OrderBy>;
  creator_address?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  property_version?: InputMaybe<OrderBy>;
  token_data_id_hash?: InputMaybe<OrderBy>;
  token_properties?: InputMaybe<OrderBy>;
  transaction_timestamp?: InputMaybe<OrderBy>;
  transaction_version?: InputMaybe<OrderBy>;
};

/** select columns of table "tokens" */
export enum TokensSelectColumn {
  /** column name */
  CollectionDataIdHash = "collection_data_id_hash",
  /** column name */
  CollectionName = "collection_name",
  /** column name */
  CreatorAddress = "creator_address",
  /** column name */
  Name = "name",
  /** column name */
  PropertyVersion = "property_version",
  /** column name */
  TokenDataIdHash = "token_data_id_hash",
  /** column name */
  TokenProperties = "token_properties",
  /** column name */
  TransactionTimestamp = "transaction_timestamp",
  /** column name */
  TransactionVersion = "transaction_version",
}

/** Streaming cursor of the table "tokens" */
export type TokensStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: TokensStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type TokensStreamCursorValueInput = {
  collection_data_id_hash?: InputMaybe<Scalars["String"]["input"]>;
  collection_name?: InputMaybe<Scalars["String"]["input"]>;
  creator_address?: InputMaybe<Scalars["String"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  property_version?: InputMaybe<Scalars["numeric"]["input"]>;
  token_data_id_hash?: InputMaybe<Scalars["String"]["input"]>;
  token_properties?: InputMaybe<Scalars["jsonb"]["input"]>;
  transaction_timestamp?: InputMaybe<Scalars["timestamp"]["input"]>;
  transaction_version?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** columns and relationships of "user_transactions" */
export type UserTransactions = {
  block_height: Scalars["bigint"]["output"];
  entry_function_id_str: Scalars["String"]["output"];
  epoch: Scalars["bigint"]["output"];
  expiration_timestamp_secs: Scalars["timestamp"]["output"];
  gas_unit_price: Scalars["numeric"]["output"];
  max_gas_amount: Scalars["numeric"]["output"];
  parent_signature_type: Scalars["String"]["output"];
  sender: Scalars["String"]["output"];
  sequence_number: Scalars["bigint"]["output"];
  timestamp: Scalars["timestamp"]["output"];
  version: Scalars["bigint"]["output"];
};

/** Boolean expression to filter rows from the table "user_transactions". All fields are combined with a logical 'AND'. */
export type UserTransactionsBoolExp = {
  _and?: InputMaybe<Array<UserTransactionsBoolExp>>;
  _not?: InputMaybe<UserTransactionsBoolExp>;
  _or?: InputMaybe<Array<UserTransactionsBoolExp>>;
  block_height?: InputMaybe<BigintComparisonExp>;
  entry_function_id_str?: InputMaybe<StringComparisonExp>;
  epoch?: InputMaybe<BigintComparisonExp>;
  expiration_timestamp_secs?: InputMaybe<TimestampComparisonExp>;
  gas_unit_price?: InputMaybe<NumericComparisonExp>;
  max_gas_amount?: InputMaybe<NumericComparisonExp>;
  parent_signature_type?: InputMaybe<StringComparisonExp>;
  sender?: InputMaybe<StringComparisonExp>;
  sequence_number?: InputMaybe<BigintComparisonExp>;
  timestamp?: InputMaybe<TimestampComparisonExp>;
  version?: InputMaybe<BigintComparisonExp>;
};

/** Ordering options when selecting data from "user_transactions". */
export type UserTransactionsOrderBy = {
  block_height?: InputMaybe<OrderBy>;
  entry_function_id_str?: InputMaybe<OrderBy>;
  epoch?: InputMaybe<OrderBy>;
  expiration_timestamp_secs?: InputMaybe<OrderBy>;
  gas_unit_price?: InputMaybe<OrderBy>;
  max_gas_amount?: InputMaybe<OrderBy>;
  parent_signature_type?: InputMaybe<OrderBy>;
  sender?: InputMaybe<OrderBy>;
  sequence_number?: InputMaybe<OrderBy>;
  timestamp?: InputMaybe<OrderBy>;
  version?: InputMaybe<OrderBy>;
};

/** select columns of table "user_transactions" */
export enum UserTransactionsSelectColumn {
  /** column name */
  BlockHeight = "block_height",
  /** column name */
  EntryFunctionIdStr = "entry_function_id_str",
  /** column name */
  Epoch = "epoch",
  /** column name */
  ExpirationTimestampSecs = "expiration_timestamp_secs",
  /** column name */
  GasUnitPrice = "gas_unit_price",
  /** column name */
  MaxGasAmount = "max_gas_amount",
  /** column name */
  ParentSignatureType = "parent_signature_type",
  /** column name */
  Sender = "sender",
  /** column name */
  SequenceNumber = "sequence_number",
  /** column name */
  Timestamp = "timestamp",
  /** column name */
  Version = "version",
}

/** Streaming cursor of the table "user_transactions" */
export type UserTransactionsStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: UserTransactionsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type UserTransactionsStreamCursorValueInput = {
  block_height?: InputMaybe<Scalars["bigint"]["input"]>;
  entry_function_id_str?: InputMaybe<Scalars["String"]["input"]>;
  epoch?: InputMaybe<Scalars["bigint"]["input"]>;
  expiration_timestamp_secs?: InputMaybe<Scalars["timestamp"]["input"]>;
  gas_unit_price?: InputMaybe<Scalars["numeric"]["input"]>;
  max_gas_amount?: InputMaybe<Scalars["numeric"]["input"]>;
  parent_signature_type?: InputMaybe<Scalars["String"]["input"]>;
  sender?: InputMaybe<Scalars["String"]["input"]>;
  sequence_number?: InputMaybe<Scalars["bigint"]["input"]>;
  timestamp?: InputMaybe<Scalars["timestamp"]["input"]>;
  version?: InputMaybe<Scalars["bigint"]["input"]>;
};
