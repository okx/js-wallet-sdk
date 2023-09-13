/**
 * The following methods are based on `solana-program-library`, thanks for their work
 * https://github.com/solana-labs/solana-program-library/tree/master/token/js/src
 */
import { PublicKey } from '../web3';

/** Address of the SPL Token program */
export const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

/** Address of the SPL Associated Token Account program */
export const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');

/** Address of the special mint for wrapped native SOL */
export const NATIVE_MINT = new PublicKey('So11111111111111111111111111111111111111112');
