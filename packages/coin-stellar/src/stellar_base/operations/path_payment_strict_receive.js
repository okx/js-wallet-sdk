import xdr from '../xdr';
import { decodeAddressToMuxedAccount } from '../util/decode_encode_muxed_account';

/**
 * Creates a PathPaymentStrictReceive operation.
 *
 * A `PathPaymentStrictReceive` operation sends the specified amount to the
 * destination account. It credits the destination with `destAmount` of
 * `destAsset`, while debiting at most `sendMax` of `sendAsset` from the source.
 * The transfer optionally occurs through a path. XLM payments create the
 * destination account if it does not exist.
 *
 * @function
 * @alias Operation.pathPaymentStrictReceive
 * @see https://developers.stellar.org/docs/start/list-of-operations/#path-payment-strict-receive
 *
 * @param {object}  opts - Options object
 * @param {Asset}   opts.sendAsset    - asset to pay with
 * @param {string}  opts.sendMax      - maximum amount of sendAsset to send
 * @param {string}  opts.destination  - destination account to send to
 * @param {Asset}   opts.destAsset    - asset the destination will receive
 * @param {string}  opts.destAmount   - amount the destination receives
 * @param {Asset[]} opts.path         - array of Asset objects to use as the path
 *
 * @param {string}  [opts.source]     - The source account for the payment.
 *     Defaults to the transaction's source account.
 *
 * @returns {xdr.PathPaymentStrictReceiveOp} the resulting path payment op
 */
export function pathPaymentStrictReceive(opts) {
  switch (true) {
    case !opts.sendAsset:
      throw new Error('Must specify a send asset');
    case !this.isValidAmount(opts.sendMax):
      throw new TypeError(this.constructAmountRequirementsError('sendMax'));
    case !opts.destAsset:
      throw new Error('Must provide a destAsset for a payment operation');
    case !this.isValidAmount(opts.destAmount):
      throw new TypeError(this.constructAmountRequirementsError('destAmount'));
    default:
      break;
  }

  const attributes = {};
  attributes.sendAsset = opts.sendAsset.toXDRObject();
  attributes.sendMax = this._toXDRAmount(opts.sendMax);
  try {
    attributes.destination = decodeAddressToMuxedAccount(opts.destination);
  } catch (e) {
    throw new Error('destination is invalid');
  }

  attributes.destAsset = opts.destAsset.toXDRObject();
  attributes.destAmount = this._toXDRAmount(opts.destAmount);

  const path = opts.path ? opts.path : [];
  attributes.path = path.map((x) => x.toXDRObject());

  const payment = new xdr.PathPaymentStrictReceiveOp(attributes);

  const opAttributes = {};
  opAttributes.body = xdr.OperationBody.pathPaymentStrictReceive(payment);
  this.setSourceAccount(opAttributes, opts);

  return new xdr.Operation(opAttributes);
}
