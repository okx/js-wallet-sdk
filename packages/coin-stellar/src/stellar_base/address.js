import { StrKey } from './strkey';
import xdr from './xdr';

/**
 * Create a new Address object.
 *
 * `Address` represents a single address in the Stellar network. An address can
 * represent an account or a contract.
 *
 * @constructor
 *
 * @param {string} address - ID of the account (ex.
 *     `GB3KJPLFUYN5VL6R3GU3EGCGVCKFDSD7BEDX42HWG5BWFKB3KQGJJRMA`). If you
 *     provide a muxed account address, this will throw; use {@link
 *     MuxedAccount} instead.
 */
export class Address {
  constructor(address) {
    if (StrKey.isValidEd25519PublicKey(address)) {
      this._type = 'account';
      this._key = StrKey.decodeEd25519PublicKey(address);
    } else if (StrKey.isValidContract(address)) {
      this._type = 'contract';
      this._key = StrKey.decodeContract(address);
    } else {
      throw new Error(`Unsupported address type: ${address}`);
    }
  }

  /**
   * Parses a string and returns an Address object.
   *
   * @param {string} address - The address to parse. ex. `GB3KJPLFUYN5VL6R3GU3EGCGVCKFDSD7BEDX42HWG5BWFKB3KQGJJRMA`
   * @returns {Address}
   */
  static fromString(address) {
    return new Address(address);
  }

  /**
   * Creates a new account Address object from a buffer of raw bytes.
   *
   * @param {Buffer} buffer - The bytes of an address to parse.
   * @returns {Address}
   */
  static account(buffer) {
    return new Address(StrKey.encodeEd25519PublicKey(buffer));
  }

  /**
   * Creates a new contract Address object from a buffer of raw bytes.
   *
   * @param {Buffer} buffer - The bytes of an address to parse.
   * @returns {Address}
   */
  static contract(buffer) {
    return new Address(StrKey.encodeContract(buffer));
  }

  /**
   * Convert this from an xdr.ScVal type
   *
   * @param {xdr.ScVal} scVal - The xdr.ScVal type to parse
   * @returns {Address}
   */
  static fromScVal(scVal) {
    return Address.fromScAddress(scVal.address());
  }

  /**
   * Convert this from an xdr.ScAddress type
   *
   * @param {xdr.ScAddress} scAddress - The xdr.ScAddress type to parse
   * @returns {Address}
   */
  static fromScAddress(scAddress) {
    switch (scAddress.switch()) {
      case xdr.ScAddressType.scAddressTypeAccount():
        return Address.account(scAddress.accountId().ed25519());
      case xdr.ScAddressType.scAddressTypeContract():
        return Address.contract(scAddress.contractId());
      default:
        throw new Error('Unsupported address type');
    }
  }

  /**
   * Serialize an address to string.
   *
   * @returns {string}
   */
  toString() {
    switch (this._type) {
      case 'account':
        return StrKey.encodeEd25519PublicKey(this._key);
      case 'contract':
        return StrKey.encodeContract(this._key);
      default:
        throw new Error('Unsupported address type');
    }
  }

  /**
   * Convert this Address to an xdr.ScVal type.
   *
   * @returns {xdr.ScVal}
   */
  toScVal() {
    return xdr.ScVal.scvAddress(this.toScAddress());
  }

  /**
   * Convert this Address to an xdr.ScAddress type.
   *
   * @returns {xdr.ScAddress}
   */
  toScAddress() {
    switch (this._type) {
      case 'account':
        return xdr.ScAddress.scAddressTypeAccount(
          xdr.PublicKey.publicKeyTypeEd25519(this._key)
        );
      case 'contract':
        return xdr.ScAddress.scAddressTypeContract(this._key);
      default:
        throw new Error('Unsupported address type');
    }
  }

  /**
   * Return the raw public key bytes for this address.
   *
   * @returns {Buffer}
   */
  toBuffer() {
    return this._key;
  }
}
