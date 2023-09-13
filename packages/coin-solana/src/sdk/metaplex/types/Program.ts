/**
 * The following methods are based on `types`, thanks for their work
 * https://github.com/metaplex-foundation/js/tree/main/packages/js/src/types
 */
import {PublicKey, SystemProgram} from '../../web3';
import { PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID } from "../mpl-token-metadata";
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from "../../spl";

export type Program = {
  name: string;
  address: PublicKey;
};

export const tokenMetadataProgram: Program = {
  name: 'TokenMetadataProgram',
  address: TOKEN_METADATA_PROGRAM_ID,
};

export const tokenProgram: Program = {
  name: 'TokenProgram',
  address: TOKEN_PROGRAM_ID,
};

export const associatedTokenProgram: Program = {
  name: 'AssociatedTokenProgram',
  address: ASSOCIATED_TOKEN_PROGRAM_ID,
};

export const systemProgram: Program = {
  name: 'SystemProgram',
  address: SystemProgram.programId,
};
