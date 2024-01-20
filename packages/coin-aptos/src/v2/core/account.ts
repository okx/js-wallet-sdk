// Copyright © Aptos Foundation
// SPDX-License-Identifier: Apache-2.0

import { AccountAddress } from "./accountAddress";
import { AuthenticationKey } from "./authenticationKey";
import { PrivateKey, PublicKey, Signature } from "./crypto/asymmetricCrypto";
import { Ed25519PrivateKey, Ed25519PublicKey } from "./crypto/ed25519";
import { MultiEd25519PublicKey } from "./crypto/multiEd25519";
import { Secp256k1PrivateKey, Secp256k1PublicKey } from "./crypto/secp256k1";
import { Hex } from "./hex";
import { GenerateAccount, HexInput, SigningScheme, SigningSchemeInput } from "../types";
import { AnyPublicKey } from "./crypto/anyPublicKey";

/**
 * Class for creating and managing account on Aptos network
 *
 * Use this class to create accounts, sign transactions, and more.
 * Note: Creating an account instance does not create the account on-chain.
 *
 * Since [AIP-55](https://github.com/aptos-foundation/AIPs/pull/263) Aptos supports
 * `Legacy` and `Unified` authentications.
 *
 * @Legacy includes `ED25519` and `MultiED25519`
 * @Unified includes `SingleSender` and `MultiSender`, where currently
 * `SingleSender` supports `ED25519` and `Secp256k1`, and `MultiSender` supports
 * `MultiED25519`.
 *
 * In TypeScript SDK, we support all of these options:
 *
 * @generate default to generate Legacy Ed25519 keys, with an optional `legacy` boolean argument
 * that lets you generate new keys conforming to the Unified authentication.
 *
 * @fromPrivateKey derives an account by a provided private key and address, with an optional
 * `legacy` boolean argument that lets you generate new keys conforming to the Unified authentication.
 *
 * @fromDerivationPath derives an account with bip44 path and mnemonics,
 *
 */
export class Account {
  /**
   * Public key associated with the account
   */
  readonly publicKey: PublicKey;

  /**
   * Private key associated with the account
   */
  readonly privateKey: PrivateKey;

  /**
   * Account address associated with the account
   */
  readonly accountAddress: AccountAddress;

  /**
   * Signing scheme used to sign transactions
   */
  readonly signingScheme: SigningScheme;

  /**
   * constructor for Account
   *
   * Need to update this to use the new crypto library if new schemes are added.
   *
   * @param args.privateKey PrivateKey - private key of the account
   * @param args.address AccountAddress - address of the account
   * @param args.legacy optional. If set to false, the keypair authentication keys will be derived with a unified scheme.
   * Defaults to deriving an authentication key with the legacy scheme.
   *
   * This method is private because it should only be called by the factory static methods.
   * @returns Account
   */
  private constructor(args: { privateKey: PrivateKey; address: AccountAddress; legacy?: boolean }) {
    const { privateKey, address, legacy } = args;
    const useLegacy = legacy ?? true;

    // Derive the public key from the private key
    this.publicKey = privateKey.publicKey();

    // Derive the signing scheme from the public key
    if (this.publicKey instanceof Ed25519PublicKey) {
      if (useLegacy) {
        this.signingScheme = SigningScheme.Ed25519;
      } else {
        this.publicKey = new AnyPublicKey(this.publicKey);
        this.signingScheme = SigningScheme.SingleKey;
      }
    } else if (this.publicKey instanceof MultiEd25519PublicKey) {
      this.signingScheme = SigningScheme.MultiEd25519;
    } else if (this.publicKey instanceof Secp256k1PublicKey) {
      this.publicKey = new AnyPublicKey(this.publicKey);
      this.signingScheme = SigningScheme.SingleKey;
    } else {
      throw new Error("Can not create new Account, unsupported public key type");
    }

    this.privateKey = privateKey;
    this.accountAddress = address;
  }

  /**
   * Derives an account with random private key and address.
   *
   * Default generation is using the Legacy ED25519 key
   *
   * @param args optional. Unify GenerateAccount type for Legacy and Unified keys
   *
   * Account input type to generate an account using Legacy
   * Ed25519 or MultiEd25519 keys or without a specified `scheme`.
   * ```
   * GenerateAccountWithLegacyKey = {
   *  scheme?: SigningSchemeInput.Ed25519 | SigningSchemeInput.MultiEd25519;
   *  legacy: true;
   * };
   * ```
   *
   * Account input type to generate an account using Unified
   * Secp256k1Ecdsa key
   * In this case `legacy` is always false
   * ```
   * GenerateAccountWithUnifiedKey = {
   *  scheme: SigningSchemeInput.Secp256k1Ecdsa;
   *  legacy?: false;
   * };
   * ```
   *
   * @returns Account with the given signing scheme
   */
  static generate(args?: GenerateAccount): Account {
    const useLegacy = args?.legacy ?? true;

    let privateKey: PrivateKey;
    let publicKey: PublicKey;

    switch (args?.scheme) {
      case SigningSchemeInput.Secp256k1Ecdsa:
        privateKey = Secp256k1PrivateKey.generate();
        publicKey = new AnyPublicKey(privateKey.publicKey());
        break;
      default:
        privateKey = Ed25519PrivateKey.generate();
        if (useLegacy === false) {
          publicKey = new AnyPublicKey(privateKey.publicKey());
        } else {
          publicKey = privateKey.publicKey();
        }
    }
    const authKey = AuthenticationKey.fromPublicKey({ publicKey });

    const address = authKey.derivedAddress();
    return new Account({ privateKey, address, legacy: args?.legacy });
  }

  /**
   * Instantiates an account given a private key.
   *
   * This is used as a local calculation and therefore is used to instantiate an `Account`
   * that has not had its authentication key rotated.
   *
   * @param privateKey PrivateKey - private key of the account
   * @param args.legacy optional. If set to false, the keypair generated is a Unified keypair. Defaults
   * to generating a Legacy Ed25519 keypair
   *
   * @returns Account
   */
  static fromPrivateKey(args: { privateKey: PrivateKey; legacy?: boolean }): Account {
    const { privateKey, legacy } = args;
    const useLegacy = legacy ?? true;

    let publicKey;
    if (privateKey instanceof Secp256k1PrivateKey) {
      // Secp256k1 single sender
      publicKey = new AnyPublicKey(privateKey.publicKey());
    } else if (privateKey instanceof Ed25519PrivateKey) {
      // legacy Ed25519
      if (useLegacy) {
        publicKey = privateKey.publicKey();
      } else {
        // Ed25519 single sender
        publicKey = new AnyPublicKey(privateKey.publicKey());
      }
    } else {
      throw new Error(`Unsupported private key ${privateKey}`);
    }

    const authKey = AuthenticationKey.fromPublicKey({ publicKey });
    const address = authKey.derivedAddress();
    return new Account({ privateKey, address, legacy: useLegacy });
  }

  /**
   * Instantiates an account given a private key and a specified account address.
   * This is primarily used to instantiate an `Account` that has had its authentication key rotated.
   *
   * @param args.privateKey PrivateKey - the underlying private key for the account
   * @param args.address AccountAddress - The account address the `Account` will sign for
   * @param args.legacy optional. If set to false, the keypair generated is a Unified keypair. Defaults
   * to generating a Legacy Ed25519 keypair
   *
   * @returns Account
   */
  static fromPrivateKeyAndAddress(args: {
    privateKey: PrivateKey;
    address: AccountAddress;
    legacy?: boolean;
  }): Account {
    const { privateKey, address, legacy } = args;
    return new Account({ privateKey, address, legacy });
  }

  /**
   * Derives an account with bip44 path and mnemonics,
   *
   * @param args.scheme The signing scheme to derive with
   * @param args.path the BIP44 derive hardened path (e.g. m/44'/637'/0'/0'/0') for Ed25519,
   * or non-hardened path (e.g. m/44'/637'/0'/0/0) for secp256k1
   * Detailed description: {@link https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki}
   * @param args.mnemonic the mnemonic seed phrase of the account
   * @param args.legacy optional. If set to false, the keypair generated is a Unified keypair. Defaults
   * to generating a Legacy Ed25519 keypair
   *
   * @returns Account
   */
  static fromDerivationPath(args: {
    scheme: SigningSchemeInput;
    path: string;
    mnemonic: string;
    legacy?: boolean;
  }): Account {
    const { path, mnemonic, scheme, legacy } = args;
    let privateKey: PrivateKey;
    switch (scheme) {
      case SigningSchemeInput.Secp256k1Ecdsa:
        privateKey = Secp256k1PrivateKey.fromDerivationPath(path, mnemonic);
        break;
      case SigningSchemeInput.Ed25519:
        privateKey = Ed25519PrivateKey.fromDerivationPath(path, mnemonic);
        break;
      default:
        throw new Error(`Unsupported scheme ${scheme}`);
    }
    return Account.fromPrivateKey({ privateKey, legacy });
  }

  /**
   * This key enables account owners to rotate their private key(s)
   * associated with the account without changing the address that hosts their account.
   * See here for more info: {@link https://aptos.dev/concepts/accounts#single-signer-authentication}
   *
   * @param args.publicKey PublicKey - public key of the account
   * @returns The authentication key for the associated account
   */
  static authKey(args: { publicKey: PublicKey }): AuthenticationKey {
    const { publicKey } = args;
    return AuthenticationKey.fromPublicKey({ publicKey });
  }

  /**
   * Sign the given message with the private key.
   *
   * TODO: Add sign transaction or specific types
   *
   * @param data in HexInput format
   * @returns Signature
   */
  sign(data: HexInput): Signature {
    return this.privateKey.sign(data);
  }

  /**
   * Verify the given message and signature with the public key.
   *
   * @param args.message raw message data in HexInput format
   * @param args.signature signed message Signature
   * @returns
   */
  verifySignature(args: { message: HexInput; signature: Signature }): boolean {
    const { message, signature } = args;
    const rawMessage = Hex.fromHexInput(message).toUint8Array();
    return this.publicKey.verifySignature({ message: rawMessage, signature });
  }
}
