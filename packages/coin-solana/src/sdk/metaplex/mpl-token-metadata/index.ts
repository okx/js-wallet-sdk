/**
 * The following methods are based on `mpl-token-metadata`, thanks for their work
 * https://github.com/metaplex-foundation/mpl-token-metadata/tree/main/programs/token-metadata/js/src/generated
 */

import { PublicKey } from '../../web3';
export * from './instructions';
export * from './types';

/**
 * Program address
 *
 * @category constants
 * @category generated
 */
export const PROGRAM_ADDRESS = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s';

/**
 * Program public key
 *
 * @category constants
 * @category generated
 */
export const PROGRAM_ID = new PublicKey(PROGRAM_ADDRESS);
