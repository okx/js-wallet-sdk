/**
 * The following methods are based on `nftModule`, thanks for their work
 * https://github.com/metaplex-foundation/js/tree/main/packages/js/src/plugins/nftModule
 */
import {
  DelegateArgs,
  TokenDelegateRole,
  MetadataDelegateRole,
} from '../../mpl-token-metadata';

export type TokenDelegateType =
  | 'StandardV1'
  | 'TransferV1'
  | 'LockedTransferV1'
  | 'SaleV1'
  | 'UtilityV1'
  | 'StakingV1';
export type MetadataDelegateType =
  // | 'AuthorityItemV1'
  | 'CollectionV1'
  // | 'UseV1'
  | 'DataV1'
  | 'ProgrammableConfigV1';

const tokenDelegateRoleMap: Record<TokenDelegateType, TokenDelegateRole> = {
  StandardV1: TokenDelegateRole.Standard,
  TransferV1: TokenDelegateRole.Transfer,
  LockedTransferV1: TokenDelegateRole.LockedTransfer,
  SaleV1: TokenDelegateRole.Sale,
  UtilityV1: TokenDelegateRole.Utility,
  StakingV1: TokenDelegateRole.Staking,
};

const metadataDelegateRoleMap: Record<
  MetadataDelegateType,
  MetadataDelegateRole
> = {
  // AuthorityItemV1: MetadataDelegateRole.AuthorityItem,
  CollectionV1: MetadataDelegateRole.Collection,
  // UseV1: MetadataDelegateRole.Use,
  DataV1: MetadataDelegateRole.Data,
  ProgrammableConfigV1: MetadataDelegateRole.ProgrammableConfig,
};

const metadataDelegateSeedMap: Record<MetadataDelegateRole, string> = {
  [MetadataDelegateRole.AuthorityItem]: 'authority_item_delegate',
  [MetadataDelegateRole.Collection]: 'collection_delegate',
  [MetadataDelegateRole.Use]: 'use_delegate',
  [MetadataDelegateRole.Data]: 'data_delegate',
  [MetadataDelegateRole.ProgrammableConfig]: 'programmable_config_delegate',
  [MetadataDelegateRole.DataItem]: 'data_item_delegate',
  [MetadataDelegateRole.CollectionItem]: 'collection_item_delegate',
  [MetadataDelegateRole.ProgrammableConfigItem]: 'prog_config_item_delegate',
};

const delegateCustomDataMap: Record<
  TokenDelegateType | MetadataDelegateType,
  boolean
> = {
  // Metadata.
  // AuthorityItemV1: false,
  CollectionV1: false,
  // UseV1: false,
  DataV1: false,
  ProgrammableConfigV1: false,
  // Token
  StandardV1: true,
  TransferV1: true,
  SaleV1: true,
  UtilityV1: true,
  StakingV1: true,
  LockedTransferV1: true,
};

export const getTokenDelegateRole = (
  type: TokenDelegateType
): TokenDelegateRole => {
  const role = tokenDelegateRoleMap[type];
  if (!role) throw new Error(`UnreachableCaseError: ${type}`);
  return role;
};

export const getMetadataDelegateRole = (
  type: MetadataDelegateType
): MetadataDelegateRole => {
  const role = metadataDelegateRoleMap[type];
  if (!role) throw new Error(`UnreachableCaseError: ${type}`);
  return role;
};

export const getMetadataDelegateRoleSeed = (
  type: MetadataDelegateType
): string => {
  return metadataDelegateSeedMap[getMetadataDelegateRole(type)];
};

export const getDefaultDelegateArgs = (
  type: TokenDelegateType | MetadataDelegateType
): Omit<DelegateArgs, 'authorizationData'> => {
  const hasCustomData = delegateCustomDataMap[type];
  if (hasCustomData === undefined)
    throw new Error(`UnreachableCaseError: ${type}`);
  if (hasCustomData) throw new Error(`DelegateRoleRequiredDataError: ${type}`);
  return { __kind: type } as DelegateArgs;
};
