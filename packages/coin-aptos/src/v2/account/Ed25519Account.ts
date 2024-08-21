import { AccountAuthenticatorEd25519 } from "../transactions/authenticator/account";
import { HexInput, SigningScheme } from "../types";
import { AccountAddress, AccountAddressInput } from "../core/accountAddress";
import { Ed25519PrivateKey, Ed25519PublicKey, Ed25519Signature } from "../core/crypto";
import type { Account } from "./Account";
import { AnyRawTransaction } from "../transactions/types";
import { generateSigningMessageForTransaction } from "../transactions/transactionBuilder/signingMessage";

export interface Ed25519SignerConstructorArgs {
  privateKey: Ed25519PrivateKey;
  address?: AccountAddressInput;
}

export interface Ed25519SignerFromDerivationPathArgs {
  path: string;
  mnemonic: string;
}

export interface VerifyEd25519SignatureArgs {
  message: HexInput;
  signature: Ed25519Signature;
}

/**
 * Signer implementation for the Ed25519 authentication scheme.
 * This extends an {@link Ed25519Account} by adding signing capabilities through an {@link Ed25519PrivateKey}.
 *
 * Note: Generating a signer instance does not create the account on-chain.
 */
export class Ed25519Account implements Account {
  /**
   * Private key associated with the account
   */
  readonly privateKey: Ed25519PrivateKey;

  readonly publicKey: Ed25519PublicKey;

  readonly accountAddress: AccountAddress;

  readonly signingScheme = SigningScheme.Ed25519;

  // region Constructors

  constructor(args: Ed25519SignerConstructorArgs) {
    const { privateKey, address } = args;
    this.privateKey = privateKey;
    this.publicKey = privateKey.publicKey();
    this.accountAddress = address ? AccountAddress.from(address) : this.publicKey.authKey().derivedAddress();
  }

  /**
   * Derives a signer from a randomly generated private key
   */
  static generate() {
    const privateKey = Ed25519PrivateKey.generate();
    return new Ed25519Account({ privateKey });
  }

  /**
   * Derives an account with bip44 path and mnemonics
   *
   * @param args.path the BIP44 derive hardened path e.g. m/44'/637'/0'/0'/0'
   * Detailed description: {@link https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki}
   * @param args.mnemonic the mnemonic seed phrase of the account
   */
  static fromDerivationPath(args: Ed25519SignerFromDerivationPathArgs) {
    const { path, mnemonic } = args;
    const privateKey = Ed25519PrivateKey.fromDerivationPath(path, mnemonic);
    return new Ed25519Account({ privateKey });
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
  verifySignature(args: VerifyEd25519SignatureArgs): boolean {
    return this.publicKey.verifySignature(args);
  }

  /**
   * Sign a message using the account's Ed25519 private key.
   * @param message the signing message, as binary input
   * @return the AccountAuthenticator containing the signature, together with the account's public key
   */
  signWithAuthenticator(message: HexInput): AccountAuthenticatorEd25519 {
    return new AccountAuthenticatorEd25519(this.publicKey, this.privateKey.sign(message));
  }

  /**
   * Sign a transaction using the account's Ed25519 private key.
   * @param transaction the raw transaction
   * @return the AccountAuthenticator containing the signature of the transaction, together with the account's public key
   */
  signTransactionWithAuthenticator(transaction: AnyRawTransaction): AccountAuthenticatorEd25519 {
    return new AccountAuthenticatorEd25519(this.publicKey, this.signTransaction(transaction));
  }

  /**
   * Sign the given message using the account's Ed25519 private key.
   * @param message in HexInput format
   * @returns Signature
   */
  sign(message: HexInput): Ed25519Signature {
    return this.privateKey.sign(message);
  }

  /**
   * Sign the given transaction using the available signing capabilities.
   * @param transaction the transaction to be signed
   * @returns Signature
   */
  signTransaction(transaction: AnyRawTransaction): Ed25519Signature {
    return this.sign(generateSigningMessageForTransaction(transaction));
  }

  // endregion
}
