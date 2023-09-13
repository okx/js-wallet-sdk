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

export async function changePubkey(
  l1PrivateKey: string,
  from: string,
  nonce: number,
  accountId: number,
) {
  await initPromise;
  // get l2 private key
  const msg =
    'Access ZKSwap account.\n\nOnly sign this message for a trusted client!';
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

  const message = `Register ZKSwap pubkey:

${pubKeyHash.replace('sync:', '')}
nonce: ${numberToBytes(nonce, 4)}
account id: ${numberToBytes(accountId, 4)}

Only sign this message for a trusted client!`;

  const ethSignature = signMessage(
    MessageTypes.PERSONAL_SIGN,
    message,
    base.fromHex(l1PrivateKey),
  );

  const address = base.toHex(
    privateToAddress(base.fromHex(l1PrivateKey)),
    true,
  );
  const msgBytes = Buffer.concat([
    base.fromHex('0x07'),
    base.fromHex(numberToBytes(accountId, 4)),
    base.fromHex(address),
    base.fromHex('0x' + pubKeyHash.slice(5)),
    base.fromHex(numberToBytes(nonce, 4)),
    base.fromHex(ethSignature),
  ]);

  const txHash = base.toHex(base.sha256(msgBytes), true);
  const data = {
    type: 'ChangePubKey',
    accountId: accountId,
    account: address,
    newPkHash: pubKeyHash,
    nonce: nonce,
    ethSignature: ethSignature,
    txHash: txHash,
  };
  return data;
}

function hexZeroPad(value: string, length: number) {
  while (value.length < 2 * length + 2) {
    value = '0x0' + value.substring(2);
  }
  return value;
}

function numberToBytes(number: number, length: number) {
  return hexZeroPad(BigNumber.from(number).toHexString(), length);
}

export async function transfer(
  l1PrivateKey: string,
  from: string,
  nonce: number,
  accountId: number,
  chainId: number,
  to: string,
  tokenId: number,
  tokenSymbol: string,
  decimals: number,
  feeTokenId: number,
  feeTokenSymbol: string,
  feeDecimals: number,
  amounts: string,
  fees: string,
) {
  await initPromise;
  // get l2 private key
  // this is not the same as zkSync
  const msg =
    'Access ZKSwap account.\n\nOnly sign this message for a trusted client!';
  const signature_pri = signMessage(
    MessageTypes.PERSONAL_SIGN,
    msg,
    base.fromHex(l1PrivateKey),
  );
  const seed = base.fromHex(signature_pri);
  const l2PrivateKey = zksync.privateKeyFromSeed(seed);

  const amount = BigNumber.from(amounts); //BigNumber.from(amounts).mul(BigNumber.from(10).pow(decimals));
  const packedAmount = packAmount(amount, 35, 5, 10);
  const closestAmount = unpackAmount(packedAmount, 35, 5);
  const readableAmount = formatUnits(closestAmount, decimals);

  // calculate fee
  // fee is 2 bytes, first 11 bits for base, last 5 bits for exponent.
  const fee = BigNumber.from(fees);
  const packedFee = packAmount(fee, 11, 5, 10); // the BigNumber of ethers not support decimal
  const closestFee = unpackAmount(packedFee, 11, 5);
  const readableFee = formatUnits(closestFee, feeDecimals);

  // prepare for l1 signature
  const message = `Transfer ${readableAmount} ${tokenSymbol}
To: ${to}
Chain Id: ${chainId}
Nonce: ${nonce}
Fee: ${readableFee} ${feeTokenSymbol}
Account Id: ${accountId}`;

  const ethSignature = signMessage(
    MessageTypes.PERSONAL_SIGN,
    message,
    base.fromHex(l1PrivateKey),
  );

  const ethereumSignature = {
    type: 'EthereumSignature',
    signature: ethSignature,
  };

  const address = base.toHex(
    privateToAddress(base.fromHex(l1PrivateKey)),
    true,
  );

  const msgBytes = Buffer.concat([
    base.fromHex('0x05'), // type hard coded
    base.fromHex(numberToBytes(accountId, 4)), // accountId
    base.fromHex(address), // from
    base.fromHex(to), // to
    base.fromHex(numberToBytes(tokenId, 2)), // token
    base.fromHex(
      PrefixInteger(packedAmount.toHexString().replace('0x', ''), 10),
    ), // amount
    base.fromHex(numberToBytes(feeTokenId, 1)), // feeToken
    base.fromHex(packedFee.toHexString()), // fee
    base.fromHex(numberToBytes(chainId, 1)), // chainId
    base.fromHex(numberToBytes(nonce, 4)), // nonce
  ]);
  const txHash = base.toHex(base.sha256(msgBytes), true);

  const signaturePacked = zksync.sign_musig(l2PrivateKey, msgBytes);
  const pubKey = base.toHex(signaturePacked.slice(0, 32)); // ignore 0x
  const signature = base.toHex(signaturePacked.slice(32)); // ignore 0x

  const tx = {
    type: 'Transfer',
    accountId,
    from: address,
    to: to,
    token: tokenId,
    amount: closestAmount.toString(),
    feeToken: feeTokenId,
    fee: closestFee.toString(),
    chainId,
    nonce,
    signature: {
      pubKey,
      signature,
    },
    txHash: txHash,
  };
  return { tx, signature: ethereumSignature };
}

// This is essentially a scientific notation for amount
// the base must be no more than mantissaBits to the power of 2
// The exponent must be no more than 2 times expBits.
// Just concatenate the mantissa and exponent
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

function PrefixInteger(num: string, length: number) {
  for (var len = (num + '').length; len < length; len = num.length) {
    num = '0' + num;
  }
  return num;
}
