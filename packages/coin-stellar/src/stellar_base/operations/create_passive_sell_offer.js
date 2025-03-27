import xdr from '../xdr';

/**
 * Returns a XDR CreatePasiveSellOfferOp. A "create passive offer" operation creates an
 * offer that won't consume a counter offer that exactly matches this offer. This is
 * useful for offers just used as 1:1 exchanges for path payments. Use manage offer
 * to manage this offer after using this operation to create it.
 * @function
 * @alias Operation.createPassiveSellOffer
 * @param {object} opts Options object
 * @param {Asset} opts.selling - What you're selling.
 * @param {Asset} opts.buying - What you're buying.
 * @param {string} opts.amount - The total amount you're selling. If 0, deletes the offer.
 * @param {number|string|BigNumber|Object} opts.price - Price of 1 unit of `selling` in terms of `buying`.
 * @param {number} opts.price.n - If `opts.price` is an object: the price numerator
 * @param {number} opts.price.d - If `opts.price` is an object: the price denominator
 * @param {string} [opts.source] - The source account (defaults to transaction source).
 * @throws {Error} Throws `Error` when the best rational approximation of `price` cannot be found.
 * @returns {xdr.CreatePassiveSellOfferOp} Create Passive Sell Offer operation
 */
export function createPassiveSellOffer(opts) {
  const attributes = {};
  attributes.selling = opts.selling.toXDRObject();
  attributes.buying = opts.buying.toXDRObject();
  if (!this.isValidAmount(opts.amount)) {
    throw new TypeError(this.constructAmountRequirementsError('amount'));
  }
  attributes.amount = this._toXDRAmount(opts.amount);
  if (opts.price === undefined) {
    throw new TypeError('price argument is required');
  }
  attributes.price = this._toXDRPrice(opts.price);
  const createPassiveSellOfferOp = new xdr.CreatePassiveSellOfferOp(attributes);

  const opAttributes = {};
  opAttributes.body = xdr.OperationBody.createPassiveSellOffer(
    createPassiveSellOfferOp
  );
  this.setSourceAccount(opAttributes, opts);

  return new xdr.Operation(opAttributes);
}
