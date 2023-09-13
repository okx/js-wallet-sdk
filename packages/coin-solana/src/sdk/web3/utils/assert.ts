/**
 * The following methods are based on `solana-web3.js`, thanks for their work
 * https://github.com/solana-labs/solana-web3.js/tree/master/packages/library-legacy/src/utils
 */

export default function (
  condition: unknown,
  message?: string,
): asserts condition {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}
