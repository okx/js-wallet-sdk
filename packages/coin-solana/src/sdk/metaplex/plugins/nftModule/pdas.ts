/**
 * The following methods are based on `nftModule`, thanks for their work
 * https://github.com/metaplex-foundation/js/tree/main/packages/js/src/plugins/nftModule
 */
import { Buffer } from 'buffer';
import { PROGRAM_ID } from '../../mpl-token-metadata';
import {
  Pda,
  PublicKey,
  Program,
  tokenProgram,
  associatedTokenProgram,
} from "../../types";
import { MetadataDelegateType, getMetadataDelegateRoleSeed } from './DelegateType';

/** Finds the Metadata PDA of a given mint address. */
export const getMetadata = (mint: PublicKey): Pda => {
  const programId = PROGRAM_ID;
  return Pda.find(programId, [
    Buffer.from('metadata', 'utf8'),
    programId.toBuffer(),
    mint.toBuffer(),
  ]);
}

/** Finds the Master Edition PDA of a given mint address. */
export const getMasterEdition = (mint: PublicKey): Pda => {
  const programId = PROGRAM_ID;
  return Pda.find(programId, [
    Buffer.from('metadata', 'utf8'),
    programId.toBuffer(),
    mint.toBuffer(),
    Buffer.from('edition', 'utf8'),
  ]);
}

/** Finds the address of the Associated Token Account. */
export const getAssociatedTokenAccount = (input: {
  /** The address of the mint account. */
  mint: PublicKey;
  /** The address of the owner account. */
  owner: PublicKey;
  /** An optional set of programs that override the registered ones. */
  programs?: Program[];
}): Pda => {
  return Pda.find(associatedTokenProgram.address, [
    input.owner.toBuffer(),
    tokenProgram.address.toBuffer(),
    input.mint.toBuffer(),
  ]);
}

/** Finds the record PDA for a given NFT and delegate authority. */
export const getTokenRecord = (input: {
  /** The address of the NFT's mint account. */
  mint: PublicKey;
  /** The address of the token account */
  token: PublicKey;
  /** An optional set of programs that override the registered ones. */
  programs?: Program[];
}): Pda => {
  const programId = PROGRAM_ID;
  return Pda.find(programId, [
    Buffer.from('metadata', 'utf8'),
    programId.toBuffer(),
    input.mint.toBuffer(),
    Buffer.from('token_record', 'utf8'),
    input.token.toBuffer(),
  ]);
}

/** Finds the record PDA for a given NFT and delegate authority. */
export const getMetadataDelegateRecord = (input: {
  /** The address of the NFT's mint account. */
  mint: PublicKey;
  /** The role of the delegate authority. */
  type: MetadataDelegateType;
  /** The address of the metadata's update authority. */
  updateAuthority: PublicKey;
  /** The address of delegate authority. */
  delegate: PublicKey;
  /** An optional set of programs that override the registered ones. */
  programs?: Program[];
}): Pda => {
  const programId = PROGRAM_ID;
  return Pda.find(programId, [
    Buffer.from('metadata', 'utf8'),
    programId.toBuffer(),
    input.mint.toBuffer(),
    Buffer.from(getMetadataDelegateRoleSeed(input.type), 'utf8'),
    input.updateAuthority.toBuffer(),
    input.delegate.toBuffer(),
  ]);
}
