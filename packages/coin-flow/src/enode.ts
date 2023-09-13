import { TxEnvelope, TxPayload } from './model';
import { base } from '@okxweb3/crypto-lib';

export const leftPaddedHexBuffer = (value: string, pad: number): Buffer => Buffer.from(value.padStart(pad * 2, '0'), 'hex');
export const rightPaddedHexBuffer = (value: string, pad: number): Buffer => Buffer.from(value.padEnd(pad * 2, '0'), 'hex');

export const addressBuffer = (addr: string) => leftPaddedHexBuffer(addr, 8);

export const blockBuffer = (block: string) => leftPaddedHexBuffer(block, 32);

export const scriptBuffer = (script: string) => Buffer.from(script, 'utf8');

export const signatureBuffer = (signature: string) => Buffer.from(signature, 'hex');

export const preparePayload = (tx: TxPayload) => {
  return [
    scriptBuffer(tx.script),
    tx.arguments,
    blockBuffer(tx.refBlock),
    tx.gasLimit,
    addressBuffer(<string>tx.proposalKey.address.toString('hex')),
    tx.proposalKey.key_id,
    tx.proposalKey.sequence_number,
    addressBuffer(tx.payer),
    tx.authorizers.map(addressBuffer),
  ];
};

export const preparePayloadSignatures = (tx: TxEnvelope) => {
  const sigs: any[] = [];
  tx.authorizers.forEach((auth, i) => {
    tx.payload_signatures.forEach((sig) => {
      if (sig.address == auth) {
        sigs.push([
          i,
          sig.keyId,
          signatureBuffer(sig.sig),
        ]);
      }
    });
  });
  return sigs;
};

export const prepareEnvelope = (tx: TxEnvelope) => {
  return [preparePayload(tx), preparePayloadSignatures(tx)];
};

export const rlpEncode = (v: any): string => {
  return base.rlp.encode(v).toString('hex');
};
export const encodeTransactionPayload = (tx: TxPayload): string => rlpEncode(preparePayload(tx));
export const encodeTransactionEnvelope = (tx: TxEnvelope): string => rlpEncode(prepareEnvelope(tx));