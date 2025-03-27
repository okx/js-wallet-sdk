/* eslint no-bitwise: ["error", {"allow": ["^"]}] */

import { sign, verify, generate } from './signing';
import { StrKey } from './strkey';
import { hash } from './hashing';

import xdr from './xdr';
import {base} from "@okxweb3/crypto-lib";

/**
 * `Keypair` represents public (and secret) keys of the account.
 *
 * Currently `Keypair` only supports ed25519 but in a future this class can be abstraction layer for other
 * public-key signature systems.
 *
 * Use more convenient methods to create `Keypair` object:
 * * `{@link Keypair.fromPublicKey}`
 * * `{@link Keypair.fromSecret}`
 * * `{@link Keypair.random}`
 *
 * @constructor
 * @param {object} keys At least one of keys must be provided.
 * @param {string} keys.type Public-key signature system name. (currently only `ed25519` keys are supported)
 * @param {Buffer} [keys.publicKey] Raw public key
 * @param {Buffer} [keys.secretKey] Raw secret key (32-byte secret seed in ed25519`)
 */
export class Keypair {
  constructor(keys) {
    if (keys.type !== 'ed25519') {
      throw new Error('Invalid keys type');
    }

    this.type = keys.type;

    if (keys.secretKey) {
      keys.secretKey = Buffer.from(keys.secretKey);

      if (keys.secretKey.length !== 32) {
        throw new Error('secretKey length is invalid');
      }

      this._secretSeed = keys.secretKey;
      this._publicKey = generate(keys.secretKey);
      this._secretKey = Buffer.concat([keys.secretKey, this._publicKey]);

      if (
        keys.publicKey &&
        !this._publicKey.equals(Buffer.from(keys.publicKey))
      ) {
        throw new Error('secretKey does not match publicKey');
      }
    } else {
      this._publicKey = Buffer.from(keys.publicKey);

      if (this._publicKey.length !== 32) {
        throw new Error('publicKey length is invalid');
      }
    }
  }

  /**
   * Creates a new `Keypair` instance from secret. This can either be secret key or secret seed depending
   * on underlying public-key signature system. Currently `Keypair` only supports ed25519.
   * @param {string} secret secret key (ex. `SDAKFNYEIAORZKKCYRILFQKLLOCNPL5SWJ3YY5NM3ZH6GJSZGXHZEPQS`)
   * @returns {Keypair}
   */
  static fromSecret(secret) {
    const rawSecret = StrKey.decodeEd25519SecretSeed(secret);
    return this.fromRawEd25519Seed(rawSecret);
  }

  /**
   * Creates a new `Keypair` object from ed25519 secret key seed raw bytes.
   *
   * @param {Buffer} rawSeed Raw 32-byte ed25519 secret key seed
   * @returns {Keypair}
   */
  static fromRawEd25519Seed(rawSeed) {
    return new this({ type: 'ed25519', secretKey: rawSeed });
  }

  /**
   * Returns `Keypair` object representing network master key.
   * @param {string} networkPassphrase passphrase of the target stellar network (e.g. "Public Global Stellar Network ; September 2015").
   * @returns {Keypair}
   */
  static master(networkPassphrase) {
    if (!networkPassphrase) {
      throw new Error(
        'No network selected. Please pass a network argument, e.g. `Keypair.master(Networks.PUBLIC)`.'
      );
    }

    return this.fromRawEd25519Seed(hash(networkPassphrase));
  }

  /**
   * Creates a new `Keypair` object from public key.
   * @param {string} publicKey public key (ex. `GB3KJPLFUYN5VL6R3GU3EGCGVCKFDSD7BEDX42HWG5BWFKB3KQGJJRMA`)
   * @returns {Keypair}
   */
  static fromPublicKey(publicKey) {
    publicKey = StrKey.decodeEd25519PublicKey(publicKey);
    if (publicKey.length !== 32) {
      throw new Error('Invalid Stellar public key');
    }
    return new this({ type: 'ed25519', publicKey });
  }

  /**
   * Create a random `Keypair` object.
   * @returns {Keypair}
   */
  static random() {
    const secret = base.randomBytes(32);
    return this.fromRawEd25519Seed(secret);
  }

  xdrAccountId() {
    return new xdr.AccountId.publicKeyTypeEd25519(this._publicKey);
  }

  xdrPublicKey() {
    return new xdr.PublicKey.publicKeyTypeEd25519(this._publicKey);
  }

  /**
   * Creates a {@link xdr.MuxedAccount} object from the public key.
   *
   * You will get a different type of muxed account depending on whether or not
   * you pass an ID.
   *
   * @param  {string} [id] - stringified integer indicating the underlying muxed
   *     ID of the new account object
   *
   * @return {xdr.MuxedAccount}
   */
  xdrMuxedAccount(id) {
    if (typeof id !== 'undefined') {
      if (typeof id !== 'string') {
        throw new TypeError(`expected string for ID, got ${typeof id}`);
      }

      return xdr.MuxedAccount.keyTypeMuxedEd25519(
        new xdr.MuxedAccountMed25519({
          id: xdr.Uint64.fromString(id),
          ed25519: this._publicKey
        })
      );
    }

    return new xdr.MuxedAccount.keyTypeEd25519(this._publicKey);
  }

  /**
   * Returns raw public key
   * @returns {Buffer}
   */
  rawPublicKey() {
    return this._publicKey;
  }

  signatureHint() {
    const a = this.xdrAccountId().toXDR();

    return a.slice(a.length - 4);
  }

  /**
   * Returns public key associated with this `Keypair` object.
   * @returns {string}
   */
  publicKey() {
    return StrKey.encodeEd25519PublicKey(this._publicKey);
  }

  /**
   * Returns secret key associated with this `Keypair` object
   * @returns {string}
   */
  secret() {
    if (!this._secretSeed) {
      throw new Error('no secret key available');
    }

    if (this.type === 'ed25519') {
      return StrKey.encodeEd25519SecretSeed(this._secretSeed);
    }

    throw new Error('Invalid Keypair type');
  }

  /**
   * Returns raw secret key.
   * @returns {Buffer}
   */
  rawSecretKey() {
    return this._secretSeed;
  }

  /**
   * Returns `true` if this `Keypair` object contains secret key and can sign.
   * @returns {boolean}
   */
  canSign() {
    return !!this._secretKey;
  }

  /**
   * Signs data.
   * @param {Buffer} data Data to sign
   * @returns {Buffer}
   */
  sign(data) {
    if (!this.canSign()) {
      throw new Error('cannot sign: no secret key available');
    }

    return sign(data, this._secretKey);
  }

  /**
   * Verifies if `signature` for `data` is valid.
   * @param {Buffer} data Signed data
   * @param {Buffer} signature Signature
   * @returns {boolean}
   */
  verify(data, signature) {
    return verify(data, signature, this._publicKey);
  }

  /**
   * Returns the decorated signature (hint+sig) for arbitrary data.
   *
   * @param  {Buffer} data  arbitrary data to sign
   * @return {xdr.DecoratedSignature}   the raw signature structure which can be
   *     added directly to a transaction envelope
   *
   * @see TransactionBase.addDecoratedSignature
   */
  signDecorated(data) {
    const signature = this.sign(data);
    const hint = this.signatureHint();

    return new xdr.DecoratedSignature({ hint, signature });
  }

  /**
   * Returns the raw decorated signature (hint+sig) for a signed payload signer.
   *
   *  The hint is defined as the last 4 bytes of the signer key XORed with last
   *  4 bytes of the payload (zero-left-padded if necessary).
   *
   * @param  {Buffer} data    data to both sign and treat as the payload
   * @return {xdr.DecoratedSignature}
   *
   * @see https://github.com/stellar/stellar-protocol/blob/master/core/cap-0040.md#signature-hint
   * @see TransactionBase.addDecoratedSignature
   */
  signPayloadDecorated(data) {
    const signature = this.sign(data);
    const keyHint = this.signatureHint();

    let hint = Buffer.from(data.slice(-4));
    if (hint.length < 4) {
      // append zeroes as needed
      hint = Buffer.concat([hint, Buffer.alloc(4 - data.length, 0)]);
    }

    return new xdr.DecoratedSignature({
      hint: hint.map((byte, i) => byte ^ keyHint[i]),
      signature
    });
  }
}
