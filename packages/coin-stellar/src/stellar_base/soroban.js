/* Helper class to assist with formatting and parsing token amounts. */
export class Soroban {
  /**
   * Given a whole number smart contract amount of a token and an amount of
   * decimal places (if the token has any), it returns a "display" value.
   *
   * All arithmetic inside the contract is performed on integers to avoid
   * potential precision and consistency issues of floating-point.
   *
   * @param {string} amount   the token amount you want to display
   * @param {number} decimals specify how many decimal places a token has
   *
   * @returns {string} the display value
   * @throws {TypeError} if the given amount has a decimal point already
   * @example
   * formatTokenAmount("123000", 4) === "12.3";
   */
  static formatTokenAmount(amount, decimals) {
    if (amount.includes('.')) {
      throw new TypeError('No decimals are allowed');
    }

    let formatted = amount;
    if (decimals > 0) {
      if (decimals > formatted.length) {
        formatted = ['0', formatted.toString().padStart(decimals, '0')].join(
          '.'
        );
      } else {
        formatted = [
          formatted.slice(0, -decimals),
          formatted.slice(-decimals)
        ].join('.');
      }
    }

    // remove trailing zero if any
    return formatted.replace(/(\.\d*?)0+$/, '$1');
  }

  /**
   * Parse a token amount to use it on smart contract
   *
   * This function takes the display value and its decimals (if the token has
   * any) and returns a string that'll be used within the smart contract.
   *
   * @param {string} value      the token amount you want to use it on smart
   *    contract which you've been displaying in a UI
   * @param {number} decimals   the number of decimal places expected in the
   *    display value (different than the "actual" number, because suffix zeroes
   *    might not be present)
   *
   * @returns {string}  the whole number token amount represented by the display
   *    value with the decimal places shifted over
   *
   * @example
   * const displayValueAmount = "123.4560"
   * const parsedAmtForSmartContract = parseTokenAmount(displayValueAmount, 5);
   * parsedAmtForSmartContract === "12345600"
   */
  static parseTokenAmount(value, decimals) {
    const [whole, fraction, ...rest] = value.split('.').slice();

    if (rest.length) {
      throw new Error(`Invalid decimal value: ${value}`);
    }

    const shifted = BigInt(
      whole + (fraction?.padEnd(decimals, '0') ?? '0'.repeat(decimals))
    );

    return shifted.toString();
  }
}
