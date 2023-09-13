import { base, signUtil } from '@okxweb3/crypto-lib';
import { rightPaddedHexBuffer } from './enode';

export const TX_DOMAIN_TAG_HEX = rightPaddedHexBuffer(Buffer.from('FLOW-V0.0-transaction', 'utf-8').toString('hex'), 32).toString('hex');

export const transactionSignature = (msg: string, privateKey: Buffer): string => {
  const messageForHash = base.fromHex(TX_DOMAIN_TAG_HEX + msg);
  const digest = base.sha3_256(messageForHash);
  const sig = signUtil.p256.sign(Buffer.from(digest), privateKey);
  return base.toHex(sig.signature);
};