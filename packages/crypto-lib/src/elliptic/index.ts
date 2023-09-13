/**
 * LICENSE
 * This software is licensed under the MIT License.
 *
 * Copyright Fedor Indutny, 2014.
 * */

'use strict';

const curve = require('./curve');
const curves = require('./curves');

// Protocols
const ec = require('./ec');
const eddsa = require('./eddsa');

export {ec, eddsa, curve, curves}