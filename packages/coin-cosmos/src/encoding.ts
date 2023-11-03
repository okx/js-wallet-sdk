import { base, Long } from '@okxweb3/crypto-lib';
import { Any } from './types/google/protobuf/any';
import { Coin } from './types/cosmos/base/v1beta1/coin';
import { PubKey } from './types/cosmos/crypto/secp256k1/keys';

export interface EncodeObject {
  typeUrl: string;
  value: any;
}

export interface DecodeObject {
  readonly typeUrl: string;
  readonly value: Uint8Array;
}

export interface TxBodyValue {
  readonly messages: readonly EncodeObject[];
  readonly memo?: string;
  readonly timeoutHeight?: Long;
  readonly extensionOptions?: Any[];
  readonly nonCriticalExtensionOptions?: Any[];
}

export interface TxBodyEncodeObject extends EncodeObject {
  readonly typeUrl: "/cosmos.tx.v1beta1.TxBody";
  readonly value: TxBodyValue;
}

export interface Pubkey {
  // type is one of the strings defined in pubkeyType
  // I don't use a string literal union here as that makes trouble with json test data:
  // https://github.com/cosmos/cosmjs/pull/44#pullrequestreview-353280504
  readonly type: string;
  readonly value: any;
}

export interface SinglePubkey extends Pubkey {
  // type is one of the strings defined in pubkeyType
  // I don't use a string literal union here as that makes trouble with json test data:
  // https://github.com/cosmos/cosmjs/pull/44#pullrequestreview-353280504
  readonly type: string;
  /**
   * The base64 encoding of the Amino binary encoded pubkey.
   *
   * Note: if type is Secp256k1, this must contain a 33 bytes compressed pubkey.
   */
  readonly value: string;
}

export interface Secp256k1Pubkey extends SinglePubkey {
  readonly type: string;
  readonly value: string;
}

export const pubkeyType = {
  /** @see https://github.com/tendermint/tendermint/blob/v0.33.0/crypto/ed25519/ed25519.go#L22 */
  secp256k1: "tendermint/PubKeySecp256k1" as const,
  /** @see https://github.com/tendermint/tendermint/blob/v0.33.0/crypto/secp256k1/secp256k1.go#L23 */
  ed25519: "tendermint/PubKeyEd25519" as const,
  /** @see https://github.com/tendermint/tendermint/blob/v0.33.0/crypto/sr25519/codec.go#L12 */
  sr25519: "tendermint/PubKeySr25519" as const,
  multisigThreshold: "tendermint/PubKeyMultisigThreshold" as const,
};

export interface StdFee {
  readonly amount: readonly Coin[];
  readonly gas: string;
}

export interface StdSignature {
  readonly pub_key: Pubkey;
  readonly signature: string;
}

export function encodePubkey(pubkey: string, useEthSecp256k1: boolean, pubKeyUrl?: string): Any {
  const pubkeyProto = PubKey.fromPartial({
    key: base.fromBase64(pubkey),
  });

  let typeUrl;
  if(pubKeyUrl) {
    typeUrl = pubKeyUrl;
  } else {
    typeUrl = useEthSecp256k1 ? "/ethermint.crypto.v1.ethsecp256k1.PubKey" : "/cosmos.crypto.secp256k1.PubKey"
  }

  return Any.fromPartial({
    typeUrl: typeUrl,
    value: Uint8Array.from(PubKey.encode(pubkeyProto).finish()),
  });
}

export function encodeSecp256k1Pubkey(pubkey: Uint8Array): string {
  if (pubkey.length !== 33 || (pubkey[0] !== 0x02 && pubkey[0] !== 0x03)) {
    throw new Error("Public key must be compressed secp256k1, i.e. 33 bytes starting with 0x02 or 0x03");
  }
  return base.toBase64(pubkey)
}

export function encodeSecp256k1Signature(pubkey: Uint8Array, signature: Uint8Array, useEthSecp256k1: boolean): string {
  if (signature.length !== 64 && !useEthSecp256k1) {
    throw new Error(
      "Signature must be 64 bytes long. Cosmos SDK uses a 2x32 byte fixed length encoding for the secp256k1 signature integers r and s.",
    );
  }

  if (signature.length !== 65 && useEthSecp256k1) {
    throw new Error(
      "Signature must be 65 bytes long. Cosmos SDK uses a 2x32 byte fixed length encoding for the secp256k1 signature integers r and s.",
    );
  }
  return base.toBase64(signature)
}
