import { Hyper } from '@stellar/js-xdr';
import BigNumber from '../util/bignumber';
import xdr from '../xdr';

/**
 * This operation bumps sequence number.
 * @function
 * @alias Operation.bumpSequence
 * @param {object} opts Options object
 * @param {string} opts.bumpTo - Sequence number to bump to.
 * @param {string} [opts.source] - The optional source account.
 * @returns {xdr.BumpSequenceOp} Operation
 */
export function bumpSequence(opts) {
  const attributes = {};

  if (typeof opts.bumpTo !== 'string') {
    throw new Error('bumpTo must be a string');
  }

  try {
    // eslint-disable-next-line no-new
    new BigNumber(opts.bumpTo);
  } catch (e) {
    throw new Error('bumpTo must be a stringified number');
  }

  attributes.bumpTo = Hyper.fromString(opts.bumpTo);

  const bumpSequenceOp = new xdr.BumpSequenceOp(attributes);

  const opAttributes = {};
  opAttributes.body = xdr.OperationBody.bumpSequence(bumpSequenceOp);
  this.setSourceAccount(opAttributes, opts);

  return new xdr.Operation(opAttributes);
}
