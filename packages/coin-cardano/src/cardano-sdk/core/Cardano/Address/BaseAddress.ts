/* eslint-disable no-bitwise */
import { Address, AddressProps, AddressType, Credential, CredentialType } from './Address';
import { NetworkId } from '../ChainId';

/**
 * A base address directly specifies the stake key that should control the stake for that address. The staking rights
 * associated with funds held in this address may be exercised by the owner of the stake key. Base addresses can be
 * used in transactions without registering the stake key in advance.
 *
 * The stake rights can only be exercised by registering the stake key and delegating to a stake pool. Once the stake
 * key is registered, the stake rights can be exercised for base addresses used in transactions before or after the key
 * registration.
 */
export class BaseAddress {
  readonly #type: AddressType;
  readonly #networkId: NetworkId;
  readonly #paymentPart: Credential;
  readonly #delegationPart: Credential;

  /**
   * Initializes a new instance of the BaseAddress class.
   *
   * @param props The address properties.
   * @private
   */
  private constructor(props: AddressProps) {
    this.#networkId = props.networkId!;
    this.#paymentPart = props.paymentPart!;
    this.#delegationPart = props.delegationPart!;
    this.#type = props.type;
  }

  /**
   * Creates a new instance of the BaseAddress from its credentials.
   *
   * @param networkId The Network identifier.
   * @param payment The payment credential.
   * @param stake The stake credential.
   */
  static fromCredentials(networkId: NetworkId, payment: Credential, stake: Credential): BaseAddress {
    let type = AddressType.BasePaymentKeyStakeKey;

    if (payment.type === CredentialType.ScriptHash) type |= 0b0001;

    if (stake.type === CredentialType.ScriptHash) type |= 0b0010;

    return new BaseAddress({
      delegationPart: stake,
      networkId,
      paymentPart: payment,
      type
    });
  }

  /** Gets the payment credential part of the base address. */
  getPaymentCredential(): Credential {
    return this.#paymentPart;
  }

  /** Gets the stake credential part of the base address. */
  getStakeCredential(): Credential {
    return this.#delegationPart;
  }

  /** Converts from BaseAddress instance to Address. */
  toAddress(): Address {
    return new Address({
      delegationPart: this.#delegationPart,
      networkId: this.#networkId,
      paymentPart: this.#paymentPart,
      type: this.#type
    });
  }

  /**
   * Creates a BaseAddress address from an Address instance.
   *
   * @param addr The address instance to be converted.
   * @returns The BaseAddress instance or undefined if Address is not a valid BaseAddress.
   */
  static fromAddress(addr: Address): BaseAddress | undefined {
    let address;

    switch (addr.getProps().type) {
      case AddressType.BasePaymentKeyStakeKey:
      case AddressType.BasePaymentScriptStakeKey:
      case AddressType.BasePaymentKeyStakeScript:
      case AddressType.BasePaymentScriptStakeScript:
        address = new BaseAddress(addr.getProps());
        break;
      default:
    }

    return address;
  }

  /**
   * Packs the base address into its raw binary format.
   *
   * @param props The address properties.
   */
  static packParts(props: AddressProps): Buffer {
    return Buffer.concat([
      Buffer.from([(props.type << 4) | props.networkId!]),
      Buffer.from(props.paymentPart!.hash, 'hex'),
      Buffer.from(props.delegationPart!.hash, 'hex')
    ]);
  }

  /**
   * There are currently 4 types of Shelley Base addresses, summarized below:
   *
   * - 0000 PaymentKeyHash StakeKeyHash
   * - 0001 ScriptHash     StakeKeyHash
   * - 0010 PaymentKeyHash ScriptHash
   * - 0011 ScriptHash     ScriptHash
   *
   * @param type The address type.
   * @param data The serialized address data.
   */
  static unpackParts(type: number, data: Uint8Array): Address {
    if (data.length !== 57) throw new Error('Base address data length should be 57 bytes long.');

    const network = data[0] & 0b0000_1111;
    const paymentCredential = Buffer.from(data.slice(1, 29)).toString('hex');
    const stakeCredential = Buffer.from(data.slice(29, 57)).toString('hex');

    const delegationCredType =
      type === AddressType.BasePaymentKeyStakeScript || type === AddressType.BasePaymentScriptStakeScript
        ? CredentialType.ScriptHash
        : CredentialType.KeyHash;

    const paymentCredType =
      type === AddressType.BasePaymentScriptStakeKey || type === AddressType.BasePaymentScriptStakeScript
        ? CredentialType.ScriptHash
        : CredentialType.KeyHash;

    return new Address({
      delegationPart: {
        hash: stakeCredential,
        type: delegationCredType
      },
      networkId: network,
      paymentPart: {
        hash: paymentCredential,
        type: paymentCredType
      },
      type
    });
  }
}
