import xdr from './xdr';
import { hash } from './hashing';
import { Keypair } from './keypair';

/**
 * @ignore
 */
export class TransactionBase {
  constructor(tx, signatures, fee, networkPassphrase) {
    if (typeof networkPassphrase !== 'string') {
      throw new Error(
        `Invalid passphrase provided to Transaction: expected a string but got a ${typeof networkPassphrase}`
      );
    }

    this._networkPassphrase = networkPassphrase;
    this._tx = tx;
    this._signatures = signatures;
    this._fee = fee;
  }

  /**
   * @type {Array.<xdr.DecoratedSignature>}
   * @readonly
   */
  get signatures() {
    return this._signatures;
  }

  set signatures(value) {
    throw new Error('Transaction is immutable');
  }

  get tx() {
    return this._tx;
  }

  set tx(value) {
    throw new Error('Transaction is immutable');
  }

  /**
   * @type {string}
   * @readonly
   */
  get fee() {
    return this._fee;
  }

  set fee(value) {
    throw new Error('Transaction is immutable');
  }

  /**
   * @type {string}
   * @readonly
   */
  get networkPassphrase() {
    return this._networkPassphrase;
  }

  set networkPassphrase(networkPassphrase) {
    this._networkPassphrase = networkPassphrase;
  }

  /**
   * Signs the transaction with the given {@link Keypair}.
   * @param {...Keypair} keypairs Keypairs of signers
   * @returns {void}
   */
  sign(...keypairs) {
    const txHash = this.hash();
    keypairs.forEach((kp) => {
      const sig = kp.signDecorated(txHash);
      this.signatures.push(sig);
    });
  }

  /**
   * Signs a transaction with the given {@link Keypair}. Useful if someone sends
   * you a transaction XDR for you to sign and return (see
   * [addSignature](#addSignature) for more information).
   *
   * When you get a transaction XDR to sign....
   * - Instantiate a `Transaction` object with the XDR
   * - Use {@link Keypair} to generate a keypair object for your Stellar seed.
   * - Run `getKeypairSignature` with that keypair
   * - Send back the signature along with your publicKey (not your secret seed!)
   *
   * Example:
   * ```javascript
   * // `transactionXDR` is a string from the person generating the transaction
   * const transaction = new Transaction(transactionXDR, networkPassphrase);
   * const keypair = Keypair.fromSecret(myStellarSeed);
   * return transaction.getKeypairSignature(keypair);
   * ```
   *
   * @param {Keypair} keypair Keypair of signer
   * @returns {string} Signature string
   */
  getKeypairSignature(keypair) {
    return keypair.sign(this.hash()).toString('base64');
  }

  /**
   * Add a signature to the transaction. Useful when a party wants to pre-sign
   * a transaction but doesn't want to give access to their secret keys.
   * This will also verify whether the signature is valid.
   *
   * Here's how you would use this feature to solicit multiple signatures.
   * - Use `TransactionBuilder` to build a new transaction.
   * - Make sure to set a long enough timeout on that transaction to give your
   * signers enough time to sign!
   * - Once you build the transaction, use `transaction.toXDR()` to get the
   * base64-encoded XDR string.
   * - _Warning!_ Once you've built this transaction, don't submit any other
   * transactions onto your account! Doing so will invalidate this pre-compiled
   * transaction!
   * - Send this XDR string to your other parties. They can use the instructions
   * for [getKeypairSignature](#getKeypairSignature) to sign the transaction.
   * - They should send you back their `publicKey` and the `signature` string
   * from [getKeypairSignature](#getKeypairSignature), both of which you pass to
   * this function.
   *
   * @param {string} publicKey The public key of the signer
   * @param {string} signature The base64 value of the signature XDR
   * @returns {void}
   */
  addSignature(publicKey = '', signature = '') {
    if (!signature || typeof signature !== 'string') {
      throw new Error('Invalid signature');
    }

    if (!publicKey || typeof publicKey !== 'string') {
      throw new Error('Invalid publicKey');
    }

    let keypair;
    let hint;
    const signatureBuffer = Buffer.from(signature, 'base64');

    try {
      keypair = Keypair.fromPublicKey(publicKey);
      hint = keypair.signatureHint();
    } catch (e) {
      throw new Error('Invalid publicKey');
    }

    if (!keypair.verify(this.hash(), signatureBuffer)) {
      throw new Error('Invalid signature');
    }

    this.signatures.push(
      new xdr.DecoratedSignature({
        hint,
        signature: signatureBuffer
      })
    );
  }

  /**
   * Add a decorated signature directly to the transaction envelope.
   *
   * @param {xdr.DecoratedSignature} signature    raw signature to add
   * @returns {void}
   *
   * @see Keypair.signDecorated
   * @see Keypair.signPayloadDecorated
   */
  addDecoratedSignature(signature) {
    this.signatures.push(signature);
  }

  /**
   * Add `hashX` signer preimage as signature.
   * @param {Buffer|String} preimage Preimage of hash used as signer
   * @returns {void}
   */
  signHashX(preimage) {
    if (typeof preimage === 'string') {
      preimage = Buffer.from(preimage, 'hex');
    }

    if (preimage.length > 64) {
      throw new Error('preimage cannot be longer than 64 bytes');
    }

    const signature = preimage;
    const hashX = hash(preimage);
    const hint = hashX.slice(hashX.length - 4);
    this.signatures.push(new xdr.DecoratedSignature({ hint, signature }));
  }

  /**
   * Returns a hash for this transaction, suitable for signing.
   * @returns {Buffer}
   */
  hash() {
    return hash(this.signatureBase());
  }

  signatureBase() {
    throw new Error('Implement in subclass');
  }

  toEnvelope() {
    throw new Error('Implement in subclass');
  }

  /**
   * Get the transaction envelope as a base64-encoded string
   * @returns {string} XDR string
   */
  toXDR() {
    return this.toEnvelope().toXDR().toString('base64');
  }
}
