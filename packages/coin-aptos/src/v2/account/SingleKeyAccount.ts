import { AccountAuthenticatorSingleKey } from "../transactions/authenticator/account";
import { type HexInput, SigningScheme, SigningSchemeInput } from "../types";
import { AccountAddress, AccountAddressInput } from "../core/accountAddress";
import { AnyPublicKey, AnySignature, Ed25519PrivateKey, PrivateKey, Secp256k1PrivateKey } from "../core/crypto";
import type { Account } from "./Account";
import { generateSigningMessageForTransaction } from "../transactions/transactionBuilder/signingMessage";
import { AnyRawTransaction } from "../transactions/types";

export interface SingleKeySignerConstructorArgs {
  privateKey: PrivateKey;
  address?: AccountAddressInput;
}

export interface SingleKeySignerGenerateArgs {
  scheme?: SigningSchemeInput;
}

export type SingleKeySignerFromDerivationPathArgs = SingleKeySignerGenerateArgs & {
  path: string;
  mnemonic: string;
};

export interface VerifySingleKeySignatureArgs {
  message: HexInput;
  signature: AnySignature;
}

/**
 * Signer implementation for the SingleKey authentication scheme.
 * This extends a SingleKeyAccount by adding signing capabilities through a valid private key.
 * Currently, the only supported signature schemes are Ed25519 and Secp256k1.
 *
 * Note: Generating a signer instance does not create the account on-chain.
 */
export class SingleKeyAccount implements Account {
  /**
   * Private key associated with the account
   */
  readonly privateKey: PrivateKey;

  readonly publicKey: AnyPublicKey;

  readonly accountAddress: AccountAddress;

  readonly signingScheme = SigningScheme.SingleKey;

  // region Constructors

  constructor(args: SingleKeySignerConstructorArgs) {
    const { privateKey, address } = args;
    this.privateKey = privateKey;
    this.publicKey = new AnyPublicKey(privateKey.publicKey());
    this.accountAddress = address ? AccountAddress.from(address) : this.publicKey.authKey().derivedAddress();
  }

  /**
   * Derives an account from a randomly generated private key.
   * Default generation is using an Ed25519 key
   * @returns Account with the given signature scheme
   */
  static generate(args: SingleKeySignerGenerateArgs = {}) {
    const { scheme = SigningSchemeInput.Ed25519 } = args;
    let privateKey: PrivateKey;
    switch (scheme) {
      case SigningSchemeInput.Ed25519:
        privateKey = Ed25519PrivateKey.generate();
        break;
      case SigningSchemeInput.Secp256k1Ecdsa:
        privateKey = Secp256k1PrivateKey.generate();
        break;
      default:
        throw new Error(`Unsupported signature scheme ${scheme}`);
    }
    return new SingleKeyAccount({ privateKey });
  }

  /**
   * Derives an account with bip44 path and mnemonics,
   * Default to using an Ed25519 signature scheme.
   *
   * @param args.scheme The signature scheme to derive the private key with
   * @param args.path the BIP44 derive hardened path (e.g. m/44'/637'/0'/0'/0') for Ed25519,
   * or non-hardened path (e.g. m/44'/637'/0'/0/0) for secp256k1
   * Detailed description: {@link https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki}
   * @param args.mnemonic the mnemonic seed phrase of the account
   */
  static fromDerivationPath(args: SingleKeySignerFromDerivationPathArgs) {
    const { scheme = SigningSchemeInput.Ed25519, path, mnemonic } = args;
    let privateKey: PrivateKey;
    switch (scheme) {
      case SigningSchemeInput.Ed25519:
        privateKey = Ed25519PrivateKey.fromDerivationPath(path, mnemonic);
        break;
      case SigningSchemeInput.Secp256k1Ecdsa:
        privateKey = Secp256k1PrivateKey.fromDerivationPath(path, mnemonic);
        break;
      default:
        throw new Error(`Unsupported signature scheme ${scheme}`);
    }
    return new SingleKeyAccount({ privateKey });
  }

  // endregion

  // region Account

  /**
   * Verify the given message and signature with the public key.
   *
   * @param args.message raw message data in HexInput format
   * @param args.signature signed message Signature
   * @returns
   */
  verifySignature(args: VerifySingleKeySignatureArgs): boolean {
    return this.publicKey.verifySignature(args);
  }

  /**
   * Sign a message using the account's private key.
   * @param message the signing message, as binary input
   * @return the AccountAuthenticator containing the signature, together with the account's public key
   */
  signWithAuthenticator(message: HexInput): AccountAuthenticatorSingleKey {
    return new AccountAuthenticatorSingleKey(this.publicKey, this.sign(message));
  }

  /**
   * Sign a transaction using the account's private key.
   * @param transaction the raw transaction
   * @return the AccountAuthenticator containing the signature of the transaction, together with the account's public key
   */
  signTransactionWithAuthenticator(transaction: AnyRawTransaction): AccountAuthenticatorSingleKey {
    return new AccountAuthenticatorSingleKey(this.publicKey, this.signTransaction(transaction));
  }

  /**
   * Sign the given message using the account's private key.
   * @param message in HexInput format
   * @returns Signature
   */
  sign(message: HexInput): AnySignature {
    return new AnySignature(this.privateKey.sign(message));
  }

  /**
   * Sign the given transaction using the account's private key.
   * @param transaction the transaction to be signed
   * @returns Signature
   */
  signTransaction(transaction: AnyRawTransaction): AnySignature {
    return this.sign(generateSigningMessageForTransaction(transaction));
  }

  // endregion
}
