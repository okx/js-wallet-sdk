import { base, Long, math, signUtil } from '@okxweb3/crypto-lib';
import { AuthInfo, SignDoc, SignerInfo, TxRaw } from './types/cosmos/tx/v1beta1/tx';
import { Any } from './types/google/protobuf/any';
import { SignMode } from './types/cosmos/tx/signing/v1beta1/signing';
import { Coin } from './types/cosmos/base/v1beta1/coin';
import { registry } from './registry';
import {
    EncodeObject,
    encodePubkey,
    encodeSecp256k1Pubkey,
    encodeSecp256k1Signature,
    StdFee,
    TxBodyEncodeObject,
} from './encoding';
import { private2Public } from './index';

export interface SignerData {
    readonly accountNumber: number;
    readonly sequence: number;
    readonly chainId: string;
    readonly privateKey: Uint8Array
    readonly useEthSecp256k1: boolean
    readonly publicKey?: string
    readonly pubKeyUrl?: string
}

/**
 * Create signer infos from the provided signers.
 *
 * This implementation does not support different signing modes for the different signers.
 */
function makeSignerInfos(
  signers: ReadonlyArray<{ readonly pubkey?: Any; readonly sequence: number }>,
  signMode: SignMode,
): SignerInfo[] {
    return signers.map(
      ({ pubkey, sequence }): SignerInfo => ({
          publicKey: pubkey || undefined,
          modeInfo: {
              single: { mode: signMode },
          },
          sequence: Long.fromNumber(sequence),
      }),
    );
}

/**
 * Creates and serializes an AuthInfo document.
 *
 * This implementation does not support different signing modes for the different signers.
 */
export function makeAuthInfoBytes(
  signers: ReadonlyArray<{ readonly pubkey?: Any; readonly sequence: number }>,
  feeAmount: readonly Coin[],
  gasLimit: number,
  signMode = SignMode.SIGN_MODE_DIRECT,
): Uint8Array {
    const authInfo = {
        signerInfos: makeSignerInfos(signers, signMode),
        fee: {
            amount: [...feeAmount],
            gasLimit: Long.fromNumber(gasLimit),
        },
    };
    return AuthInfo.encode(AuthInfo.fromPartial(authInfo)).finish();
}

export function makeSignDoc(
  bodyBytes: Uint8Array,
  authInfoBytes: Uint8Array,
  chainId: string,
  accountNumber: number,
): SignDoc {
    return {
        bodyBytes: bodyBytes,
        authInfoBytes: authInfoBytes,
        chainId: chainId,
        accountNumber: Long.fromNumber(accountNumber),
    };
}

export function makeSignBytes({ accountNumber, authInfoBytes, bodyBytes, chainId }: SignDoc): Uint8Array {
    const signDoc = SignDoc.fromPartial({
        accountNumber: accountNumber,
        authInfoBytes: authInfoBytes,
        bodyBytes: bodyBytes,
        chainId: chainId,
    });
    return SignDoc.encode(signDoc).finish();
}

export async function signSimulateTx(
    messages: EncodeObject[],
    fee: StdFee,
    memo = "",
    timeoutHeight: Long = Long.fromNumber(0),
    { accountNumber, sequence, chainId }: Omit<SignerData, 'privateKey'>,
  ): Promise<any> {
    const txBodyEncodeObject: TxBodyEncodeObject = {
        typeUrl: "/cosmos.tx.v1beta1.TxBody",
        value: {
            messages: messages,
            memo: memo,
            timeoutHeight: timeoutHeight,
        },
    };
    const txBodyBytes = registry.encode(txBodyEncodeObject);
    const gasLimit = math.Int53.fromString(fee.gas).toNumber();
    const authInfoBytes = makeAuthInfoBytes([{pubkey: undefined, sequence}], fee.amount, gasLimit, SignMode.SIGN_MODE_LEGACY_AMINO_JSON);
    const signDoc = makeSignDoc(txBodyBytes, authInfoBytes, chainId, accountNumber);
    return base.toBase64(TxRaw.encode(TxRaw.fromPartial({
        bodyBytes: signDoc.bodyBytes,
        authInfoBytes: signDoc.authInfoBytes,
        signatures: [new Uint8Array(64)],
    })).finish())
  }

export async function signTx(
  messages: EncodeObject[],
  fee: StdFee,
  memo = "",
  timeoutHeight: Long,
  signerData: SignerData
): Promise<any> {
    const txRaw = await signDirect(messages, fee, memo, timeoutHeight, signerData)
    if (!signerData.privateKey) {
        return txRaw;
    }
    return TxRaw.encode(txRaw).finish();
}

export async function signDirect(
  messages: readonly EncodeObject[],
  fee: StdFee,
  memo: string,
  timeoutHeight: Long,
  {accountNumber, sequence, chainId, privateKey, useEthSecp256k1, publicKey, pubKeyUrl}: SignerData,
): Promise<any> {
    const calcPublicKey = privateKey ? private2Public(privateKey, true) : base.fromHex(publicKey!);
    const pubkey = encodePubkey(encodeSecp256k1Pubkey(calcPublicKey), useEthSecp256k1, pubKeyUrl);
    const txBodyEncodeObject: TxBodyEncodeObject = {
        typeUrl: "/cosmos.tx.v1beta1.TxBody",
        value: {
            messages: messages,
            memo: memo,
            timeoutHeight: timeoutHeight,
        },
    };
    const txBodyBytes = registry.encode(txBodyEncodeObject);
    const gasLimit = math.Int53.fromString(fee.gas).toNumber();
    const authInfoBytes = makeAuthInfoBytes([{pubkey, sequence}], fee.amount, gasLimit);
    const signDoc = makeSignDoc(txBodyBytes, authInfoBytes, chainId, accountNumber);
    if (!privateKey) {
        const signDocBytes = makeSignBytes(signDoc);
        const messageHash = useEthSecp256k1 ? base.keccak256(signDocBytes) : base.sha256(signDocBytes);
        return {
            raw: base.toHex(TxRaw.encode(TxRaw.fromPartial({
                bodyBytes: signDoc.bodyBytes,
                authInfoBytes: signDoc.authInfoBytes,
                signatures: [],
            })).finish()),
            hash: base.toHex(messageHash),
            doc: base.toHex(SignDoc.encode(signDoc).finish()),
        }
    }
    const signature = await doSign(signDoc, calcPublicKey, privateKey, useEthSecp256k1);
    return TxRaw.fromPartial({
        bodyBytes: signDoc.bodyBytes,
        authInfoBytes: signDoc.authInfoBytes,
        signatures: [base.fromBase64(signature)],
    });
}

export async function doSign(signDoc: SignDoc, publicKey: Uint8Array, privateKey: Uint8Array, useEthSecp256k1: boolean): Promise<string> {
    const signDocBytes = makeSignBytes(signDoc);
    const messageHash = useEthSecp256k1 ? base.keccak256(signDocBytes) : base.sha256(signDocBytes);
    const { signature, recovery } = signUtil.secp256k1.sign(Buffer.from(messageHash), privateKey)
    if(useEthSecp256k1) {
        const l = [Uint8Array.from(signature), Uint8Array.of(recovery)]
        const signatureR1 = Buffer.concat(l);
        return Promise.resolve(encodeSecp256k1Signature(publicKey, signatureR1, true))
    } else {
        return Promise.resolve(encodeSecp256k1Signature(publicKey, signature, false))
    }
}
