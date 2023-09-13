/**
 * The following methods are based on `nftModule`, thanks for their work
 * https://github.com/metaplex-foundation/js/tree/main/packages/js/src/plugins/nftModule
 */

import {
  TokenStandard,
} from '../../../mpl-token-metadata';
import { Option } from '../../../utils';

export const isNonFungible = (nftOrSft: {
  tokenStandard: Option<TokenStandard>;
}): boolean =>
  nftOrSft.tokenStandard === null ||
  nftOrSft.tokenStandard === TokenStandard.NonFungible ||
  nftOrSft.tokenStandard === TokenStandard.NonFungibleEdition ||
  nftOrSft.tokenStandard === TokenStandard.ProgrammableNonFungible;

export const isProgrammable = (nftOrSft: {
  tokenStandard: Option<TokenStandard>;
}): boolean => nftOrSft.tokenStandard === TokenStandard.ProgrammableNonFungible;
