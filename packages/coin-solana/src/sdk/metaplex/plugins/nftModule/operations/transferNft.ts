/**
 * The following methods are based on `nftModule`, thanks for their work
 * https://github.com/metaplex-foundation/js/tree/main/packages/js/src/plugins/nftModule
 */
import { createTransferInstruction, TokenStandard } from '../../../mpl-token-metadata';
import { PublicKey, SYSVAR_INSTRUCTIONS_PUBKEY } from '../../../../web3';
import {
  tokenMetadataProgram,
  tokenProgram,
  associatedTokenProgram,
  systemProgram,
  Signer,
  SplTokenAmount,
  token, Program
} from "../../../types";
import {
  getMetadata,
  getMasterEdition,
  getTokenRecord,
  getAssociatedTokenAccount,
} from '../pdas'
import {
  getSignerFromTokenMetadataAuthority,
  parseTokenMetadataAuthorization,
  TokenMetadataAuthorityHolder,
  TokenMetadataAuthorityTokenDelegate,
  TokenMetadataAuthorizationDetails,
} from '../Authorization';
import { TransactionBuilder, TransactionBuilderOptions, Option } from '../../../utils';
import { isNonFungible, isProgrammable } from '../models';

const TOKEN_AUTH_RULES_ID = new PublicKey(
  'auth9SigNpDKz4sJJ1DfCTuZrZNSAgh9sFD3rboVmgg'
);

/**
 * @group Operations
 * @category Inputs
 */
export type TransferNftInput = {
  /**
   * The NFT or SFT to transfer.
   * We only need its address and token standard.
   */
  nftOrSft: {
    /**
     * This enum indicates which type of asset we are dealing with.
     * It can be an NFT, a limited edition of an original NFT,
     * a fungible asset (i.e. it has zero decimals)
     * or a fungible token (i.e. it has more than zero decimals).
     */
    readonly tokenStandard: Option<TokenStandard>;

    /** The mint address of the SFT. */
    readonly address: PublicKey;
  };

  /**
   * An authority allowed to transfer the asset.
   *
   * Note that Metadata authorities are
   * not supported for this instruction.
   *
   * If a `Signer` is provided directly,
   * it will be used as an Holder authority.
   *
   * @see {@link TokenMetadataAuthority}
   * @defaultValue `metaplex.identity()`
   */
  authority:
    | Signer
    | TokenMetadataAuthorityTokenDelegate
    | TokenMetadataAuthorityHolder;

  /**
   * The authorization rules and data to use for the transfer.
   *
   * @see {@link TokenMetadataAuthorizationDetails}
   * @defaultValue Defaults to not using auth rules.
   */
  authorizationDetails?: TokenMetadataAuthorizationDetails;

  /**
   * The wallet to get the tokens from.
   *
   * @defaultValue The public key of the provided authority.
   */
  fromOwner?: PublicKey;

  /**
   * The token account to be debited.
   *
   * @defaultValue Defaults to the associated token account of `fromOwner`.
   */
  fromToken?: PublicKey;

  /**
   * The wallet to send the tokens to.
   */
  toOwner: PublicKey;

  /**
   * The token account to be credited.
   *
   * @defaultValue Defaults to the associated token account of `toOwner`.
   */
  toToken?: PublicKey;

  /**
   * The amount of tokens to transfer.
   *
   * @defaultValue `token(1)`
   */
  amount?: SplTokenAmount;

  /**
   * The compression data needed for transfer.
   */
  // compression?: TransferNftCompressionParam;
};

// -----------------
// Builder
// -----------------

/**
 * @group Transaction Builders
 * @category Inputs
 */
export type TransferNftBuilderParams = Omit<
  TransferNftInput,
  'confirmOptions'
> & {
  /** A key to distinguish the instruction that uses the NFT. */
  instructionKey?: string;
};

/**
 * Transfers an NFT or SFT from one account to another.
 *
 * ```ts
 * const transactionBuilder = metaplex
 *   .nfts()
 *   .builders()
 *   .transfer({
 *     nftOrSft,
 *     toOwner,
 *     amount: token(5),
 *   });
 * ```
 *
 * @group Transaction Builders
 * @category Constructors
 */
export const transferNftBuilder = (
  params: TransferNftBuilderParams,
  payer: Signer,
  programs?: Program[],
): TransactionBuilder => {
  const {
    nftOrSft,
    authority,
    toOwner,
    amount = token(1),
    authorizationDetails,
  } = params;

  // From owner.
  const fromOwner =
    params.fromOwner ??
    getSignerFromTokenMetadataAuthority(authority).publicKey;

  // Programs.

  // PDAs.
  const metadata = getMetadata(nftOrSft.address);
  const edition = getMasterEdition(nftOrSft.address);
  const fromToken =
    params.fromToken ??
    getAssociatedTokenAccount({
      mint: nftOrSft.address,
      owner: fromOwner,
    });
  const toToken =
    params.toToken ??
    getAssociatedTokenAccount({
      mint: nftOrSft.address,
      owner: toOwner,
    });
  const ownerTokenRecord = getTokenRecord({
    mint: nftOrSft.address,
    token: fromToken,
  });
  const destinationTokenRecord = getTokenRecord({
    mint: nftOrSft.address,
    token: toToken,
  });

    // Auth.
  const auth = parseTokenMetadataAuthorization({
    mint: nftOrSft.address,
    authority:
      '__kind' in authority
        ? authority
        : { __kind: 'holder', owner: authority, token: fromToken },
    authorizationDetails,
    programs,
  });

  return (
    TransactionBuilder.make()
      .setFeePayer(payer)

      // Update the metadata account.
      .add({
        instruction: createTransferInstruction(
          {
            token: fromToken,
            tokenOwner: fromOwner,
            destination: toToken,
            destinationOwner: toOwner,
            mint: nftOrSft.address,
            metadata,
            edition: isNonFungible(nftOrSft) ? edition : undefined,
            ownerTokenRecord: isProgrammable(nftOrSft)
              ? ownerTokenRecord
              : undefined,
            destinationTokenRecord: isProgrammable(nftOrSft)
              ? destinationTokenRecord
              : undefined,
            authority: auth.accounts.authority,
            payer: payer.publicKey,
            systemProgram: systemProgram.address,
            sysvarInstructions: SYSVAR_INSTRUCTIONS_PUBKEY,
            splTokenProgram: tokenProgram.address,
            splAtaProgram: associatedTokenProgram.address,
            authorizationRules: auth.accounts.authorizationRules,
            authorizationRulesProgram: TOKEN_AUTH_RULES_ID,
          },
          {
            transferArgs: {
              __kind: 'V1',
              amount: amount.basisPoints,
              ...auth.data,
            },
          },
          tokenMetadataProgram.address
        ),
        signers: [payer, ...auth.signers],
        key: params.instructionKey ?? 'transferNft',
      })
  );
};
