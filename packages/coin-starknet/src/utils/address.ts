import { MASK_251, ZERO } from '../constants';
import { addHexPrefix, removeHexPrefix } from './encode';
import { keccakBn } from './hash';
import { BigNumberish, assertInRange, toHex } from './num';

export function addAddressPadding(address: BigNumberish): string {
  return addHexPrefix(removeHexPrefix(toHex(address)).padStart(64, '0'));
}

export function validateAndParseAddress(address: BigNumberish): string {
  assertInRange(address, ZERO, MASK_251, 'Starknet Address');

  const result = addAddressPadding(address);

  if (!result.match(/^(0x)?[0-9a-fA-F]{64}$/)) {
    throw new Error('Invalid Address Format');
  }

  return result;
}