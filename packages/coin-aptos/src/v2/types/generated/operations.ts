import * as Types from "./types";

export type TokenActivitiesFieldsFragment = {
  after_value?: string | null;
  before_value?: string | null;
  entry_function_id_str?: string | null;
  event_account_address: string;
  event_index: any;
  from_address?: string | null;
  is_fungible_v2?: boolean | null;
  property_version_v1: any;
  to_address?: string | null;
  token_amount: any;
  token_data_id: string;
  token_standard: string;
  transaction_timestamp: any;
  transaction_version: any;
  type: string;
};

export type AnsTokenFragmentFragment = {
  domain?: string | null;
  expiration_timestamp?: any | null;
  registered_address?: string | null;
  subdomain?: string | null;
  token_standard?: string | null;
  is_primary?: boolean | null;
  owner_address?: string | null;
};

export type CurrentTokenOwnershipFieldsFragment = {
  token_standard: string;
  token_properties_mutated_v1?: any | null;
  token_data_id: string;
  table_type_v1?: string | null;
  storage_id: string;
  property_version_v1: any;
  owner_address: string;
  last_transaction_version: any;
  last_transaction_timestamp: any;
  is_soulbound_v2?: boolean | null;
  is_fungible_v2?: boolean | null;
  amount: any;
  current_token_data?: {
    collection_id: string;
    description: string;
    is_fungible_v2?: boolean | null;
    largest_property_version_v1?: any | null;
    last_transaction_timestamp: any;
    last_transaction_version: any;
    maximum?: any | null;
    supply: any;
    token_data_id: string;
    token_name: string;
    token_properties: any;
    token_standard: string;
    token_uri: string;
    current_collection?: {
      collection_id: string;
      collection_name: string;
      creator_address: string;
      current_supply: any;
      description: string;
      last_transaction_timestamp: any;
      last_transaction_version: any;
      max_supply?: any | null;
      mutable_description?: boolean | null;
      mutable_uri?: boolean | null;
      table_handle_v1?: string | null;
      token_standard: string;
      total_minted_v2?: any | null;
      uri: string;
    } | null;
  } | null;
};

export type GetAccountCoinsCountQueryVariables = Types.Exact<{
  address?: Types.InputMaybe<Types.Scalars["String"]["input"]>;
}>;

export type GetAccountCoinsCountQuery = {
  current_fungible_asset_balances_aggregate: { aggregate?: { count: number } | null };
};

export type GetAccountCoinsDataQueryVariables = Types.Exact<{
  where_condition: Types.CurrentFungibleAssetBalancesBoolExp;
  offset?: Types.InputMaybe<Types.Scalars["Int"]["input"]>;
  limit?: Types.InputMaybe<Types.Scalars["Int"]["input"]>;
  order_by?: Types.InputMaybe<
    Array<Types.CurrentFungibleAssetBalancesOrderBy> | Types.CurrentFungibleAssetBalancesOrderBy
  >;
}>;

export type GetAccountCoinsDataQuery = {
  current_fungible_asset_balances: Array<{
    amount: any;
    asset_type: string;
    is_frozen: boolean;
    is_primary: boolean;
    last_transaction_timestamp: any;
    last_transaction_version: any;
    owner_address: string;
    storage_id: string;
    token_standard: string;
    metadata?: {
      token_standard: string;
      symbol: string;
      supply_aggregator_table_key_v1?: string | null;
      supply_aggregator_table_handle_v1?: string | null;
      project_uri?: string | null;
      name: string;
      last_transaction_version: any;
      last_transaction_timestamp: any;
      icon_uri?: string | null;
      decimals: number;
      creator_address: string;
      asset_type: string;
    } | null;
  }>;
};

export type GetAccountCollectionsWithOwnedTokensQueryVariables = Types.Exact<{
  where_condition: Types.CurrentCollectionOwnershipV2ViewBoolExp;
  offset?: Types.InputMaybe<Types.Scalars["Int"]["input"]>;
  limit?: Types.InputMaybe<Types.Scalars["Int"]["input"]>;
  order_by?: Types.InputMaybe<
    Array<Types.CurrentCollectionOwnershipV2ViewOrderBy> | Types.CurrentCollectionOwnershipV2ViewOrderBy
  >;
}>;

export type GetAccountCollectionsWithOwnedTokensQuery = {
  current_collection_ownership_v2_view: Array<{
    collection_id?: string | null;
    collection_name?: string | null;
    collection_uri?: string | null;
    creator_address?: string | null;
    distinct_tokens?: any | null;
    last_transaction_version?: any | null;
    owner_address?: string | null;
    single_token_uri?: string | null;
    current_collection?: {
      collection_id: string;
      collection_name: string;
      creator_address: string;
      current_supply: any;
      description: string;
      last_transaction_timestamp: any;
      last_transaction_version: any;
      mutable_description?: boolean | null;
      max_supply?: any | null;
      mutable_uri?: boolean | null;
      table_handle_v1?: string | null;
      token_standard: string;
      total_minted_v2?: any | null;
      uri: string;
    } | null;
  }>;
};

export type GetAccountOwnedObjectsQueryVariables = Types.Exact<{
  where_condition?: Types.InputMaybe<Types.CurrentObjectsBoolExp>;
  offset?: Types.InputMaybe<Types.Scalars["Int"]["input"]>;
  limit?: Types.InputMaybe<Types.Scalars["Int"]["input"]>;
  order_by?: Types.InputMaybe<Array<Types.CurrentObjectsOrderBy> | Types.CurrentObjectsOrderBy>;
}>;

export type GetAccountOwnedObjectsQuery = {
  current_objects: Array<{
    allow_ungated_transfer: boolean;
    state_key_hash: string;
    owner_address: string;
    object_address: string;
    last_transaction_version: any;
    last_guid_creation_num: any;
    is_deleted: boolean;
  }>;
};

export type GetAccountOwnedTokensQueryVariables = Types.Exact<{
  where_condition: Types.CurrentTokenOwnershipsV2BoolExp;
  offset?: Types.InputMaybe<Types.Scalars["Int"]["input"]>;
  limit?: Types.InputMaybe<Types.Scalars["Int"]["input"]>;
  order_by?: Types.InputMaybe<Array<Types.CurrentTokenOwnershipsV2OrderBy> | Types.CurrentTokenOwnershipsV2OrderBy>;
}>;

export type GetAccountOwnedTokensQuery = {
  current_token_ownerships_v2: Array<{
    token_standard: string;
    token_properties_mutated_v1?: any | null;
    token_data_id: string;
    table_type_v1?: string | null;
    storage_id: string;
    property_version_v1: any;
    owner_address: string;
    last_transaction_version: any;
    last_transaction_timestamp: any;
    is_soulbound_v2?: boolean | null;
    is_fungible_v2?: boolean | null;
    amount: any;
    current_token_data?: {
      collection_id: string;
      description: string;
      is_fungible_v2?: boolean | null;
      largest_property_version_v1?: any | null;
      last_transaction_timestamp: any;
      last_transaction_version: any;
      maximum?: any | null;
      supply: any;
      token_data_id: string;
      token_name: string;
      token_properties: any;
      token_standard: string;
      token_uri: string;
      current_collection?: {
        collection_id: string;
        collection_name: string;
        creator_address: string;
        current_supply: any;
        description: string;
        last_transaction_timestamp: any;
        last_transaction_version: any;
        max_supply?: any | null;
        mutable_description?: boolean | null;
        mutable_uri?: boolean | null;
        table_handle_v1?: string | null;
        token_standard: string;
        total_minted_v2?: any | null;
        uri: string;
      } | null;
    } | null;
  }>;
};

export type GetAccountOwnedTokensByTokenDataQueryVariables = Types.Exact<{
  where_condition: Types.CurrentTokenOwnershipsV2BoolExp;
  offset?: Types.InputMaybe<Types.Scalars["Int"]["input"]>;
  limit?: Types.InputMaybe<Types.Scalars["Int"]["input"]>;
  order_by?: Types.InputMaybe<Array<Types.CurrentTokenOwnershipsV2OrderBy> | Types.CurrentTokenOwnershipsV2OrderBy>;
}>;

export type GetAccountOwnedTokensByTokenDataQuery = {
  current_token_ownerships_v2: Array<{
    token_standard: string;
    token_properties_mutated_v1?: any | null;
    token_data_id: string;
    table_type_v1?: string | null;
    storage_id: string;
    property_version_v1: any;
    owner_address: string;
    last_transaction_version: any;
    last_transaction_timestamp: any;
    is_soulbound_v2?: boolean | null;
    is_fungible_v2?: boolean | null;
    amount: any;
    current_token_data?: {
      collection_id: string;
      description: string;
      is_fungible_v2?: boolean | null;
      largest_property_version_v1?: any | null;
      last_transaction_timestamp: any;
      last_transaction_version: any;
      maximum?: any | null;
      supply: any;
      token_data_id: string;
      token_name: string;
      token_properties: any;
      token_standard: string;
      token_uri: string;
      current_collection?: {
        collection_id: string;
        collection_name: string;
        creator_address: string;
        current_supply: any;
        description: string;
        last_transaction_timestamp: any;
        last_transaction_version: any;
        max_supply?: any | null;
        mutable_description?: boolean | null;
        mutable_uri?: boolean | null;
        table_handle_v1?: string | null;
        token_standard: string;
        total_minted_v2?: any | null;
        uri: string;
      } | null;
    } | null;
  }>;
};

export type GetAccountOwnedTokensFromCollectionQueryVariables = Types.Exact<{
  where_condition: Types.CurrentTokenOwnershipsV2BoolExp;
  offset?: Types.InputMaybe<Types.Scalars["Int"]["input"]>;
  limit?: Types.InputMaybe<Types.Scalars["Int"]["input"]>;
  order_by?: Types.InputMaybe<Array<Types.CurrentTokenOwnershipsV2OrderBy> | Types.CurrentTokenOwnershipsV2OrderBy>;
}>;

export type GetAccountOwnedTokensFromCollectionQuery = {
  current_token_ownerships_v2: Array<{
    token_standard: string;
    token_properties_mutated_v1?: any | null;
    token_data_id: string;
    table_type_v1?: string | null;
    storage_id: string;
    property_version_v1: any;
    owner_address: string;
    last_transaction_version: any;
    last_transaction_timestamp: any;
    is_soulbound_v2?: boolean | null;
    is_fungible_v2?: boolean | null;
    amount: any;
    current_token_data?: {
      collection_id: string;
      description: string;
      is_fungible_v2?: boolean | null;
      largest_property_version_v1?: any | null;
      last_transaction_timestamp: any;
      last_transaction_version: any;
      maximum?: any | null;
      supply: any;
      token_data_id: string;
      token_name: string;
      token_properties: any;
      token_standard: string;
      token_uri: string;
      current_collection?: {
        collection_id: string;
        collection_name: string;
        creator_address: string;
        current_supply: any;
        description: string;
        last_transaction_timestamp: any;
        last_transaction_version: any;
        max_supply?: any | null;
        mutable_description?: boolean | null;
        mutable_uri?: boolean | null;
        table_handle_v1?: string | null;
        token_standard: string;
        total_minted_v2?: any | null;
        uri: string;
      } | null;
    } | null;
  }>;
};

export type GetAccountTokensCountQueryVariables = Types.Exact<{
  where_condition?: Types.InputMaybe<Types.CurrentTokenOwnershipsV2BoolExp>;
  offset?: Types.InputMaybe<Types.Scalars["Int"]["input"]>;
  limit?: Types.InputMaybe<Types.Scalars["Int"]["input"]>;
}>;

export type GetAccountTokensCountQuery = {
  current_token_ownerships_v2_aggregate: { aggregate?: { count: number } | null };
};

export type GetAccountTransactionsCountQueryVariables = Types.Exact<{
  address?: Types.InputMaybe<Types.Scalars["String"]["input"]>;
}>;

export type GetAccountTransactionsCountQuery = {
  account_transactions_aggregate: { aggregate?: { count: number } | null };
};

export type GetChainTopUserTransactionsQueryVariables = Types.Exact<{
  limit?: Types.InputMaybe<Types.Scalars["Int"]["input"]>;
}>;

export type GetChainTopUserTransactionsQuery = { user_transactions: Array<{ version: any }> };

export type GetCollectionDataQueryVariables = Types.Exact<{
  where_condition: Types.CurrentCollectionsV2BoolExp;
}>;

export type GetCollectionDataQuery = {
  current_collections_v2: Array<{
    collection_id: string;
    collection_name: string;
    creator_address: string;
    current_supply: any;
    description: string;
    last_transaction_timestamp: any;
    last_transaction_version: any;
    max_supply?: any | null;
    mutable_description?: boolean | null;
    mutable_uri?: boolean | null;
    table_handle_v1?: string | null;
    token_standard: string;
    total_minted_v2?: any | null;
    uri: string;
  }>;
};

export type GetCurrentFungibleAssetBalancesQueryVariables = Types.Exact<{
  where_condition?: Types.InputMaybe<Types.CurrentFungibleAssetBalancesBoolExp>;
  offset?: Types.InputMaybe<Types.Scalars["Int"]["input"]>;
  limit?: Types.InputMaybe<Types.Scalars["Int"]["input"]>;
}>;

export type GetCurrentFungibleAssetBalancesQuery = {
  current_fungible_asset_balances: Array<{
    amount: any;
    asset_type: string;
    is_frozen: boolean;
    is_primary: boolean;
    last_transaction_timestamp: any;
    last_transaction_version: any;
    owner_address: string;
    storage_id: string;
    token_standard: string;
  }>;
};

export type GetDelegatedStakingActivitiesQueryVariables = Types.Exact<{
  delegatorAddress?: Types.InputMaybe<Types.Scalars["String"]["input"]>;
  poolAddress?: Types.InputMaybe<Types.Scalars["String"]["input"]>;
}>;

export type GetDelegatedStakingActivitiesQuery = {
  delegated_staking_activities: Array<{
    amount: any;
    delegator_address: string;
    event_index: any;
    event_type: string;
    pool_address: string;
    transaction_version: any;
  }>;
};

export type GetEventsQueryVariables = Types.Exact<{
  where_condition?: Types.InputMaybe<Types.EventsBoolExp>;
  offset?: Types.InputMaybe<Types.Scalars["Int"]["input"]>;
  limit?: Types.InputMaybe<Types.Scalars["Int"]["input"]>;
  order_by?: Types.InputMaybe<Array<Types.EventsOrderBy> | Types.EventsOrderBy>;
}>;

export type GetEventsQuery = {
  events: Array<{
    account_address: string;
    creation_number: any;
    data: any;
    event_index: any;
    sequence_number: any;
    transaction_block_height: any;
    transaction_version: any;
    type: string;
    indexed_type: string;
  }>;
};

export type GetFungibleAssetActivitiesQueryVariables = Types.Exact<{
  where_condition?: Types.InputMaybe<Types.FungibleAssetActivitiesBoolExp>;
  offset?: Types.InputMaybe<Types.Scalars["Int"]["input"]>;
  limit?: Types.InputMaybe<Types.Scalars["Int"]["input"]>;
}>;

export type GetFungibleAssetActivitiesQuery = {
  fungible_asset_activities: Array<{
    amount?: any | null;
    asset_type: string;
    block_height: any;
    entry_function_id_str?: string | null;
    event_index: any;
    gas_fee_payer_address?: string | null;
    is_frozen?: boolean | null;
    is_gas_fee: boolean;
    is_transaction_success: boolean;
    owner_address: string;
    storage_id: string;
    storage_refund_amount: any;
    token_standard: string;
    transaction_timestamp: any;
    transaction_version: any;
    type: string;
  }>;
};

export type GetFungibleAssetMetadataQueryVariables = Types.Exact<{
  where_condition?: Types.InputMaybe<Types.FungibleAssetMetadataBoolExp>;
  offset?: Types.InputMaybe<Types.Scalars["Int"]["input"]>;
  limit?: Types.InputMaybe<Types.Scalars["Int"]["input"]>;
}>;

export type GetFungibleAssetMetadataQuery = {
  fungible_asset_metadata: Array<{
    icon_uri?: string | null;
    project_uri?: string | null;
    supply_aggregator_table_handle_v1?: string | null;
    supply_aggregator_table_key_v1?: string | null;
    creator_address: string;
    asset_type: string;
    decimals: number;
    last_transaction_timestamp: any;
    last_transaction_version: any;
    name: string;
    symbol: string;
    token_standard: string;
  }>;
};

export type GetNamesQueryVariables = Types.Exact<{
  offset?: Types.InputMaybe<Types.Scalars["Int"]["input"]>;
  limit?: Types.InputMaybe<Types.Scalars["Int"]["input"]>;
  where_condition?: Types.InputMaybe<Types.CurrentAptosNamesBoolExp>;
  order_by?: Types.InputMaybe<Array<Types.CurrentAptosNamesOrderBy> | Types.CurrentAptosNamesOrderBy>;
}>;

export type GetNamesQuery = {
  current_aptos_names: Array<{
    domain?: string | null;
    expiration_timestamp?: any | null;
    registered_address?: string | null;
    subdomain?: string | null;
    token_standard?: string | null;
    is_primary?: boolean | null;
    owner_address?: string | null;
  }>;
};

export type GetNumberOfDelegatorsQueryVariables = Types.Exact<{
  where_condition?: Types.InputMaybe<Types.NumActiveDelegatorPerPoolBoolExp>;
  order_by?: Types.InputMaybe<Array<Types.NumActiveDelegatorPerPoolOrderBy> | Types.NumActiveDelegatorPerPoolOrderBy>;
}>;

export type GetNumberOfDelegatorsQuery = {
  num_active_delegator_per_pool: Array<{ num_active_delegator?: any | null; pool_address?: string | null }>;
};

export type GetProcessorStatusQueryVariables = Types.Exact<{
  where_condition?: Types.InputMaybe<Types.ProcessorStatusBoolExp>;
}>;

export type GetProcessorStatusQuery = {
  processor_status: Array<{ last_success_version: any; processor: string; last_updated: any }>;
};

export type GetTokenActivityQueryVariables = Types.Exact<{
  where_condition: Types.TokenActivitiesV2BoolExp;
  offset?: Types.InputMaybe<Types.Scalars["Int"]["input"]>;
  limit?: Types.InputMaybe<Types.Scalars["Int"]["input"]>;
  order_by?: Types.InputMaybe<Array<Types.TokenActivitiesV2OrderBy> | Types.TokenActivitiesV2OrderBy>;
}>;

export type GetTokenActivityQuery = {
  token_activities_v2: Array<{
    after_value?: string | null;
    before_value?: string | null;
    entry_function_id_str?: string | null;
    event_account_address: string;
    event_index: any;
    from_address?: string | null;
    is_fungible_v2?: boolean | null;
    property_version_v1: any;
    to_address?: string | null;
    token_amount: any;
    token_data_id: string;
    token_standard: string;
    transaction_timestamp: any;
    transaction_version: any;
    type: string;
  }>;
};

export type GetCurrentTokenOwnershipQueryVariables = Types.Exact<{
  where_condition: Types.CurrentTokenOwnershipsV2BoolExp;
  offset?: Types.InputMaybe<Types.Scalars["Int"]["input"]>;
  limit?: Types.InputMaybe<Types.Scalars["Int"]["input"]>;
  order_by?: Types.InputMaybe<Array<Types.CurrentTokenOwnershipsV2OrderBy> | Types.CurrentTokenOwnershipsV2OrderBy>;
}>;

export type GetCurrentTokenOwnershipQuery = {
  current_token_ownerships_v2: Array<{
    token_standard: string;
    token_properties_mutated_v1?: any | null;
    token_data_id: string;
    table_type_v1?: string | null;
    storage_id: string;
    property_version_v1: any;
    owner_address: string;
    last_transaction_version: any;
    last_transaction_timestamp: any;
    is_soulbound_v2?: boolean | null;
    is_fungible_v2?: boolean | null;
    amount: any;
    current_token_data?: {
      collection_id: string;
      description: string;
      is_fungible_v2?: boolean | null;
      largest_property_version_v1?: any | null;
      last_transaction_timestamp: any;
      last_transaction_version: any;
      maximum?: any | null;
      supply: any;
      token_data_id: string;
      token_name: string;
      token_properties: any;
      token_standard: string;
      token_uri: string;
      current_collection?: {
        collection_id: string;
        collection_name: string;
        creator_address: string;
        current_supply: any;
        description: string;
        last_transaction_timestamp: any;
        last_transaction_version: any;
        max_supply?: any | null;
        mutable_description?: boolean | null;
        mutable_uri?: boolean | null;
        table_handle_v1?: string | null;
        token_standard: string;
        total_minted_v2?: any | null;
        uri: string;
      } | null;
    } | null;
  }>;
};

export type GetTokenDataQueryVariables = Types.Exact<{
  where_condition?: Types.InputMaybe<Types.CurrentTokenDatasV2BoolExp>;
  offset?: Types.InputMaybe<Types.Scalars["Int"]["input"]>;
  limit?: Types.InputMaybe<Types.Scalars["Int"]["input"]>;
  order_by?: Types.InputMaybe<Array<Types.CurrentTokenDatasV2OrderBy> | Types.CurrentTokenDatasV2OrderBy>;
}>;

export type GetTokenDataQuery = {
  current_token_datas_v2: Array<{
    collection_id: string;
    description: string;
    is_fungible_v2?: boolean | null;
    largest_property_version_v1?: any | null;
    last_transaction_timestamp: any;
    last_transaction_version: any;
    maximum?: any | null;
    supply: any;
    token_data_id: string;
    token_name: string;
    token_properties: any;
    token_standard: string;
    token_uri: string;
    current_collection?: {
      collection_id: string;
      collection_name: string;
      creator_address: string;
      current_supply: any;
      description: string;
      last_transaction_timestamp: any;
      last_transaction_version: any;
      max_supply?: any | null;
      mutable_description?: boolean | null;
      mutable_uri?: boolean | null;
      table_handle_v1?: string | null;
      token_standard: string;
      total_minted_v2?: any | null;
      uri: string;
    } | null;
  }>;
};
