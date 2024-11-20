// Copyright © Aptos Foundation
// SPDX-License-Identifier: Apache-2.0

import { Account } from "./Account";
import { MultiKey, MultiKeySignature, PublicKey } from "../core/crypto";
import { AccountAddress } from "../core/accountAddress";
import { HexInput, SigningScheme } from "../types";
import { AccountAuthenticatorMultiKey } from "../transactions/authenticator/account";
import { AnyRawTransaction } from "../transactions/types";

export interface VerifyMultiKeySignatureArgs {
  message: HexInput;
  signature: MultiKeySignature;
}

/**
 * Signer implementation for the MultiKey authentication scheme.
 *
 * This accounts to use a M of N signing scheme. M and N are specified in the {@link MultiKey}
 * It signs messages via the array of M number of Accounts that individually correspond to a public key in the {@link MultiKey}.
 *
 * Note: Generating a signer instance does not create the account on-chain.
 */
export class MultiKeyAccount implements Account {
  /**
   * Public key associated with the account
   */
  readonly publicKey: MultiKey;

  /**
   * Account address associated with the account
   */
  readonly accountAddress: AccountAddress;

  /**
   * Signing scheme used to sign transactions
   */
  readonly signingScheme: SigningScheme;

  /**
   * The signers used to sign messages.  These signers should correspond to public keys in the
   * MultiKeyAccount's public key.  The number of signers should be equal or greater
   * than this.publicKey.signaturesRequired
   */
  readonly signers: Account[];

  /**
   * An array of indicies where for signer[i], signerIndicies[i] is the index of the corresponding public key in
   * publicKey.publicKeys.  Used to derive the right public key to use for verification.
   */
  readonly signerIndicies: number[];

  readonly signaturesBitmap: Uint8Array;

  /**
   * constructor for MultiKeyAccount
   *
   * @param args.multiKey the multikey of the account which consists of N public keys and a number M which is
   * the number of required signatures.
   * @param args.signers an array of M signers that will be used to sign the transaction
   * @returns MultiKeyAccount
   */
  constructor(args: { multiKey: MultiKey; signers: Account[] }) {
    const { multiKey, signers } = args;

    this.publicKey = multiKey;
    this.signingScheme = SigningScheme.MultiKey;

    this.accountAddress = this.publicKey.authKey().derivedAddress();

    // Get the index of each respective signer in the bitmap
    const bitPositions: number[] = [];
    for (const signer of signers) {
      bitPositions.push(this.publicKey.getIndex(signer.publicKey));
    }
    // Zip signers and bit positions and sort signers by bit positions in order
    // to ensure the signature is signed in ascending order according to the bitmap.
    // Authentication on chain will fail otherwise.
    const signersAndBitPosition: [Account, number][] = signers.map((signer, index) => [signer, bitPositions[index]]);
    signersAndBitPosition.sort((a, b) => a[1] - b[1]);
    this.signers = signersAndBitPosition.map((value) => value[0]);
    this.signerIndicies = signersAndBitPosition.map((value) => value[1]);
    this.signaturesBitmap = this.publicKey.createBitmap({ bits: bitPositions });
  }

  /**
   * Static constructor for MultiKeyAccount
   *
   * @param args.publicKeys the N public keys of the MultiKeyAccount
   * @param args.signaturesRequired the number of signatures required
   * @param args.signers an array of M signers that will be used to sign the transaction
   * @returns MultiKeyAccount
   */
  static fromPublicKeysAndSigners(args: {
    publicKeys: PublicKey[];
    signaturesRequired: number;
    signers: Account[];
  }): MultiKeyAccount {
    const { publicKeys, signaturesRequired, signers } = args;
    const multiKey = new MultiKey({ publicKeys, signaturesRequired });
    return new MultiKeyAccount({ multiKey, signers });
  }

  static isMultiKeySigner(account: Account): account is MultiKeyAccount {
    return account instanceof MultiKeyAccount;
  }

  /**
   * Sign a message using the account's signers.
   * @param message the signing message, as binary input
   * @return the AccountAuthenticator containing the signature, together with the account's public key
   */
  signWithAuthenticator(message: HexInput): AccountAuthenticatorMultiKey {
    return new AccountAuthenticatorMultiKey(this.publicKey, this.sign(message));
  }

  /**
   * Sign a transaction using the account's signers.
   * @param transaction the raw transaction
   * @return the AccountAuthenticator containing the signature of the transaction, together with the account's public key
   */
  signTransactionWithAuthenticator(transaction: AnyRawTransaction): AccountAuthenticatorMultiKey {
    return new AccountAuthenticatorMultiKey(this.publicKey, this.signTransaction(transaction));
  }

  /**
   * Sign the given message using the MultiKeyAccount's signers
   * @param message in HexInput format
   * @returns MultiKeySignature
   */
  sign(data: HexInput): MultiKeySignature {
    const signatures = [];
    for (const signer of this.signers) {
      signatures.push(signer.sign(data));
    }
    return new MultiKeySignature({ signatures, bitmap: this.signaturesBitmap });
  }

  /**
   * Sign the given transaction using the MultiKeyAccount's signers
   * @param transaction the transaction to be signed
   * @returns MultiKeySignature
   */
  signTransaction(transaction: AnyRawTransaction): MultiKeySignature {
    const signatures = [];
    for (const signer of this.signers) {
      signatures.push(signer.signTransaction(transaction));
    }
    return new MultiKeySignature({ signatures, bitmap: this.signaturesBitmap });
  }

  /**
   * Verify the given message and signature with the public key.
   *
   * @param args.message raw message data in HexInput format
   * @param args.signatures signed message MultiKeySignature
   * @returns boolean
   */
  verifySignature(args: VerifyMultiKeySignatureArgs): boolean {
    const { message, signature } = args;
    const isSignerIndiciesSorted = this.signerIndicies.every(
      (value, i) => i === 0 || value >= this.signerIndicies[i - 1],
    );
    if (!isSignerIndiciesSorted) {
      return false;
    }
    for (let i = 0; i < signature.signatures.length; i += 1) {
      const singleSignature = signature.signatures[i];
      const publicKey = this.publicKey.publicKeys[this.signerIndicies[i]];
      if (!publicKey.verifySignature({ message, signature: singleSignature })) {
        return false;
      }
    }
    return true;
  }
}
