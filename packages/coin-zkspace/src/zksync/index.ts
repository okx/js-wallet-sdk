import { BigNumber } from '@ethersproject/bignumber';

import {
  MessageTypes,
  signMessage,
  privateToAddress,
} from '@okxweb3/coin-ethereum';
import { base } from '@okxweb3/crypto-lib';
import { formatUnits } from '../Units';

const zksync = require('../zksync-crypto/zksync-crypto-web.js');
const initPromise = zksync.loadZkSyncCrypto();

export async function zksyncChangePubkey(
  l1PrivateKey: string,
  from: string,
  nonce: number,
  accountId: number,
  fee: string,
  tokenId: number,
) {
  await initPromise;
  // get l2 private key
  const msg =
    'Access zkSync account.\n\nOnly sign this message for a trusted client!';
  const signature = signMessage(
    MessageTypes.PERSONAL_SIGN,
    msg,
    base.fromHex(l1PrivateKey),
  );
  const seed = base.fromHex(signature);
  // Get private key
  const l2PrivateKey = zksync.privateKeyFromSeed(seed);
  // l2 pubkey hash
  const pubKeyHash = `sync:${base.toHex(
    zksync.private_key_to_pubkey_hash(l2PrivateKey),
  )}`;
  const feeString = BigNumber.from(fee);
  const packedFee = packAmount(feeString, 11, 5, 10);
  const address = base.toHex(
    privateToAddress(base.fromHex(l1PrivateKey)),
    true,
  );
  const type = new Uint8Array([255 - 7]);
  const version = new Uint8Array([1]);
  const accountIdBytes = base.fromHex(numberToBytes(accountId, 4));
  const accountBytes = base.fromHex(address);
  const pubKeyHashBytes = base.fromHex('0x' + pubKeyHash.slice(5));
  const tokenIdBytes = base.fromHex(numberToBytes(tokenId, 4));

  const feeBytes = base.fromHex(packedFee.toHexString());
  const nonceBytes = base.fromHex(numberToBytes(nonce, 4));
  const validFromBytes = base.fromHex(numberToBytes(0, 8));
  const validUntilBytes = base.fromHex(numberToBytes(4294967295, 8));
  const msgBytes = Buffer.concat([
    type,
    version,
    accountIdBytes,
    accountBytes,
    pubKeyHashBytes,
    tokenIdBytes,
    feeBytes,
    nonceBytes,
    validFromBytes,
    validUntilBytes,
  ]);
  const txHash = base.toHex(base.sha256(msgBytes), true);

  const signaturePacked = zksync.sign_musig(l2PrivateKey, msgBytes);
  const pubKey = base.toHex(signaturePacked.slice(0, 32)); // ignore 0x
  const pubKey_signature = base.toHex(signaturePacked.slice(32)); // ignore 0x

  const msgBatchHash = new Uint8Array(32).fill(0);
  const msgBatchHash_HEX = base.toHex(msgBatchHash);
  let messageBytes = Buffer.concat([
    pubKeyHashBytes,
    nonceBytes,
    accountIdBytes,
    base.fromHex(msgBatchHash_HEX),
  ]);
  const ethSignature = signMessage(
    MessageTypes.PERSONAL_SIGN,
    base.toHex(messageBytes, true),
    base.fromHex(l1PrivateKey),
  );

  const tx = {
    tx: {
      type: 'ChangePubKey',
      accountId: accountId,
      account: address,
      newPkHash: pubKeyHash,
      nonce: nonce,
      validFrom: 0,
      validUntil: 4294967295,
      fee: fee,
      feeToken: tokenId,
      signature: {
        pubKey: pubKey,
        signature: pubKey_signature,
      },
      ethAuthData: {
        type: 'ECDSA',
        batchHash: '0x' + msgBatchHash_HEX,
        ethSignature: ethSignature,
      },
      txHash: txHash,
    },
  };
  return tx;
}

function PrefixInteger(num:string, length:number) {
  for(var len = (num + "").length; len < length; len = num.length) {
    num = "0" + num;
  }
  return num;
}

// transfer
export async function zksyncTransfer(
  l1PrivateKey: string,
  from: string,
  to: string,
  accountId: number,
  tokenId: number,
  tokenSymbol: string,
  amounts: string,
  fees: string,
  decimals: number,
  nonce: number,
) {
  await initPromise;
  to = to.toLowerCase();
  const msg =
    'Access zkSync account.\n\nOnly sign this message for a trusted client!';
  const signature_pri = signMessage(
    MessageTypes.PERSONAL_SIGN,
    msg,
    base.fromHex(l1PrivateKey),
  );
  const seed = base.fromHex(signature_pri);
  const l2PrivateKey = zksync.privateKeyFromSeed(seed);

  const amount = BigNumber.from(amounts);
  const packedAmount = packAmount(amount, 35, 5, 10);
  const closestAmount = unpackAmount(packedAmount, 35, 5);
  const readableAmount = formatUnits(closestAmount, decimals);
  // calculate fee
  // fee is 2 bytes, first 11 bits for base, last 5 bits for exponent.
  // @ts-ignore
  const fee = BigNumber.from(fees);
  const packedFee = packAmount(fee, 11, 5, 10); // the BigNumber of ethers not support decimal
  const closestFee = unpackAmount(packedFee, 11, 5);
  const readableFee = formatUnits(closestFee, decimals);

  const message = `Transfer ${readableAmount} ${tokenSymbol} to: ${to}
Fee: ${readableFee} ${tokenSymbol}
Nonce: ${nonce}`;

  const ethSignature = signMessage(
    MessageTypes.PERSONAL_SIGN,
    message,
    base.fromHex(l1PrivateKey),
  );

  const ethereumSignature = {
    type: 'EthereumSignature',
    signature: ethSignature,
  };
  const type = new Uint8Array([255 - 5]);
  const version = new Uint8Array([1]);
  const accountIdBytes = base.fromHex(numberToBytes(accountId, 4));
  const fromBytes = base.fromHex(from);
  const toBytes = base.fromHex(to);
  const tokenIdBytes = base.fromHex(numberToBytes(tokenId, 4));
  const amountbytes = base.fromHex(PrefixInteger(packedAmount.toHexString().replace('0x', ''),10));
  const feeBytes = base.fromHex(packedFee.toHexString());
  const nonceBytes = base.fromHex(numberToBytes(nonce, 4));
  const validFromBytes = base.fromHex(numberToBytes(0, 8));
  const validUntilBytes = base.fromHex(numberToBytes(4294967295, 8));
  const msgBytes = Buffer.concat([
    type,
    version,
    accountIdBytes,
    fromBytes,
    toBytes,
    tokenIdBytes,
    amountbytes,
    feeBytes,
    nonceBytes,
    validFromBytes,
    validUntilBytes,
  ]);
  const signaturePacked = zksync.sign_musig(l2PrivateKey, msgBytes);
  const pubKey = base.toHex(signaturePacked.slice(0, 32)); // ignore 0x
  const pubKey_signature = base.toHex(signaturePacked.slice(32)); // ignore 0x

  const txHash = base.toHex(base.sha256(msgBytes), true);

  const tx = {
    tx: {
      accountId: accountId,
      amount: amounts,
      fee: fees,
      from: from,
      nonce: nonce,
      signature: {
        pubKey: pubKey,
        signature: pubKey_signature,
      },
      to: to,
      token: 0,
      type: 'Transfer',
      validFrom: 0,
      validUntil: 4294967295,
      txHash: txHash,
    },
    signature: {
      signature: ethSignature,
      type: 'EthereumSignature',
    },
  };
  return tx;
}

// Transfer 0.0175 ETH to: 0xad06a98cac85448cb33495ca68b0837e3b65abe6
// Fee: 0.0009 ETH
function hexZeroPad(value: string, length: number) {
  while (value.length < 2 * length + 2) {
    value = '0x0' + value.substring(2);
  }
  return value;
}

function numberToBytes(number: number, length: number) {
  return hexZeroPad(BigNumber.from(number).toHexString(), length);
}

// @ts-ignore
function packAmount(amount, mantissaBits, expBits, expBase) {
  const expBaseBN = BigNumber.from(expBase);
  const expBitsBN = BigNumber.from(expBits);
  const mantissaBitsBN = BigNumber.from(mantissaBits);
  const mantissaMaskBN = BigNumber.from(2).pow(mantissaBitsBN).sub(1);
  const expMaskBN = BigNumber.from(2).pow(expBitsBN).sub(1);

  let exp = BigNumber.from(0);
  let mantissa = BigNumber.from(amount);

  while (mantissa.gt(mantissaMaskBN)) {
    mantissa = mantissa.div(expBaseBN);
    exp = exp.add(1);
  }

  if (exp.gt(expMaskBN)) {
    throw new Error('Amount is too big');
  }

  return mantissa.shl(expBits).or(exp);
}

// @ts-ignore
function unpackAmount(amount, mantissaBits, expBits) {
  const expBaseBN = BigNumber.from(10);
  const expBitsBN = BigNumber.from(expBits);
  const mantissaBitsBN = BigNumber.from(mantissaBits);
  const mantissaMaskBN = BigNumber.from(2).pow(mantissaBitsBN).sub(1);
  const expMaskBN = BigNumber.from(2).pow(expBitsBN).sub(1);

  const exp = amount.and(expMaskBN);
  const mantissa = amount.shr(expBits).and(mantissaMaskBN);

  return mantissa.mul(expBaseBN.pow(exp));
}
