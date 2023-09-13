// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { Keypair } from '../cryptography/keypair';
import {
  SerializedSignature,
  toSerializedSignature,
} from '../cryptography/signature';
import { SuiAddress } from '../types';
import {SignerWithProvider} from "./signer-with-provider";
import {base} from "@okxweb3/crypto-lib";

export class RawSigner extends SignerWithProvider {
  private readonly keypair: Keypair;

  constructor(keypair: Keypair) {
    super();
    this.keypair = keypair;
  }

  async getAddress(): Promise<SuiAddress> {
    return this.keypair.getPublicKey().toSuiAddress();
  }

  async signData(data: Uint8Array): Promise<SerializedSignature> {
    const pubkey = this.keypair.getPublicKey();
    const digest = base.blake2b(data, { dkLen: 32 });
    const signature = this.keypair.signData(digest);
    const signatureScheme = this.keypair.getKeyScheme();

    return toSerializedSignature({
      signatureScheme,
      signature,
      pubKey: pubkey,
    });
  }
}
