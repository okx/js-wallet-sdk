import { sha3_256 } from "@noble/hashes/sha3";
import { AccountAddress } from "../../accountAddress";
import { DeriveScheme } from "../../../types";

/**
 * Creates an object address from creator address and seed
 *
 * @param creatorAddress The object creator account address
 * @param seed The seed in either Uint8Array | string type
 *
 * @returns The object account address
 */
export const createObjectAddress = (creatorAddress: AccountAddress, seed: Uint8Array | string): AccountAddress => {
  const creatorBytes = creatorAddress.bcsToBytes();

  const seedBytes = typeof seed === "string" ? Buffer.from(seed, "utf8") : seed;

  const bytes = new Uint8Array([...creatorBytes, ...seedBytes, DeriveScheme.DeriveObjectAddressFromSeed]);

  return new AccountAddress(sha3_256(bytes));
};

/**
 * Creates an resource address from creator address and seed
 *
 * @param creatorAddress The creator account address
 * @param seed The seed in either Uint8Array | string type
 *
 * @returns The resource account address
 */
export const createResourceAddress = (creatorAddress: AccountAddress, seed: Uint8Array | string): AccountAddress => {
  const creatorBytes = creatorAddress.bcsToBytes();

  const seedBytes = typeof seed === "string" ? Buffer.from(seed, "utf8") : seed;

  const bytes = new Uint8Array([...creatorBytes, ...seedBytes, DeriveScheme.DeriveResourceAccountAddress]);

  return new AccountAddress(sha3_256(bytes));
};

/**
 * Creates a token object address from creator address, collection name and token name
 *
 * @param creatorAddress The token creator account address
 * @param collectionName The collection name
 * @param tokenName The token name
 *
 * @returns The token account address
 */
export const createTokenAddress = (
  creatorAddress: AccountAddress,
  collectionName: string,
  tokenName: string,
): AccountAddress => {
  const seed = `${collectionName}::${tokenName}`;
  return createObjectAddress(creatorAddress, seed);
};
