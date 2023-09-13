/**
 * The following methods are based on `types`, thanks for their work
 * https://github.com/metaplex-foundation/js/tree/main/packages/js/src/types
 */
import { PublicKey, PublicKeyInitData } from '../../web3';

export { PublicKey } from '../../web3';
export type PublicKeyString = string;
export type PublicKeyValues =
  | PublicKeyInitData
  | { publicKey: PublicKey }
  | { address: PublicKey };

export const toPublicKey = (value: PublicKeyValues): PublicKey => {
  if (typeof value === 'object' && 'publicKey' in value) {
    return value.publicKey;
  }

  if (typeof value === 'object' && 'address' in value) {
    return (value as { address: PublicKey }).address;
  }

  return new PublicKey(value);
};
