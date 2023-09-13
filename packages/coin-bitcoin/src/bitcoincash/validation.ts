/**
 * The following methods are based on `Emilio Almansi`, thanks for their work
 * @license
 * https://github.com/ealmansi/cashaddrjs
 * Copyright (c) 2017-2020 Emilio Almansi
 * Distributed under the MIT software license, see the accompanying
 * file LICENSE or http://www.opensource.org/licenses/mit-license.php.
 */

'use strict';

/**
 * Validation utility.
 *
 * @module validation
 */

/**
 * Validates a given condition, throwing a {@link ValidationError} if
 * the given condition does not hold.
 *
 * @static
 * @param {boolean} condition Condition to validate.
 * @param {string} message Error message in case the condition does not hold.
 */
export function validate(condition: any, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}