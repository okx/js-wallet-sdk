import { SignTxParams } from "@okxweb3/coin-base";
import { CatTransferParams } from "../../cat20/common";
import { LocalProvider } from "../providers/LocalProvider";
import {
  addressToLocking,
  Cat20Metadata,
  Cat20TokenInfo,
  CAT20Utxo,
  isP2TR,
  isP2WPKH,
} from "@cat-protocol/cat-sdk-v2";
import {
  DefaultSigner,
  toByteString,
  uint8ArrayToHex,
} from "@scrypt-inc/scrypt-ts-btc";
import ECPairFactory from "@scrypt-inc/ecpair";
import * as bitcoinjs from "@scrypt-inc/bitcoinjs-lib";
import * as ecc from "@bitcoinerlab/secp256k1";
import { singleSendEstimate } from "./singleSendEstimate";
const ECPair = ECPairFactory(ecc);

export enum AddressType {
  P2WPKH = "p2wpkh",
  P2TR = "p2tr",
}

export async function cat20estimateFeeV2(param: SignTxParams) {
  bitcoinjs.initEccLib(ecc);
  const localProvider = new LocalProvider();
  const txParams: CatTransferParams = param.data;
  localProvider.setFeeRate(txParams.feeRate);
  localProvider.cacheTokenPrevTxs(txParams.tokenPrevTxs);
  localProvider.cacheUtxoInputs(txParams.feeInputs);
  const tokenMetadata: Cat20TokenInfo<Cat20Metadata> = JSON.parse(
    txParams.tokenMetadata
  );
  const cat20Utxos: CAT20Utxo[] = JSON.parse(txParams.tokens);
  cat20Utxos.forEach((value) => {
    value.state.amount = BigInt(value.state.amount);
    if (!value.state.ownerAddr) {
      // @ts-ignore
      value.state.ownerAddr = value.state.address;
    }
    // @ts-ignore
    Object.assign(value, value.utxo);
    const tx = localProvider.getTx(value.txId);
    if (tx) {
      value.txHashPreimage = uint8ArrayToHex(tx.toBuffer(undefined, 0, false));
    }
  });
  let addressType: AddressType;
  const address = txParams.feeInputs[0].address!;
  if (isP2TR(address)) {
    addressType = AddressType.P2TR;
  } else if (isP2WPKH(address)) {
    addressType = AddressType.P2WPKH;
  } else {
    throw new Error("Invalid addressType");
  }
  const signer = new DefaultSigner();
  const receiver = addressToLocking(txParams.toAddress);
  const amount = BigInt(txParams.tokenAmount);
  const sendEstimateInfo = await singleSendEstimate(
    signer,
    localProvider,
    localProvider,
    tokenMetadata.minterAddr,
    cat20Utxos,
    [
      {
        address: toByteString(receiver),
        amount: amount,
      },
    ],
    addressToLocking(address),
    txParams.feeRate
  );
  return {
    commitTx: Math.ceil(sendEstimateInfo.guardTx * txParams.feeRate),
    revealTx: Math.ceil(sendEstimateInfo.sendTx * txParams.feeRate),
  };
}
