/**
 * The following methods are based on `polkadot-js`, thanks for their work
 * https://github.com/polkadot-js/common/tree/master/packages/util
 */
/**
 * Prefix for ss58-encoded addresses on Polkadot, Kusama, and Westend. Note:
 * 42, the Westend prefix, is also the default for Substrate-based chains.
 */
import {BN} from "@okxweb3/crypto-lib";

export enum NetWork {
    polkadot = 0,
    kusama = 2,
    westend = 42,
    substrate = 42,
}

/**
 * @name BN_ZERO
 * @summary BN constant for 0.
 */
export const BN_ZERO: BN = new BN(0);

/**
 * @name BN_ONE
 * @summary BN constant for 1.
 */
export const BN_ONE: BN = new BN(1);

/**
 * @name BN_TWO
 * @summary BN constant for 2.
 */
export const BN_TWO: BN = new BN(2);


export const MAX_U8 = BN_TWO.pow(new BN(8 - 2)).isub(BN_ONE);
export const MAX_U16 = BN_TWO.pow(new BN(16 - 2)).isub(BN_ONE);
export const MAX_U32 = BN_TWO.pow(new BN(32 - 2)).isub(BN_ONE);
export const BL_16 = { bitLength: 16 };
export const BL_32 = { bitLength: 32 };