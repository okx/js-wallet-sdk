import { AccountKey, ProposalKey, Signature, Transaction, TxEnvelope, TxPayload } from './model';
import { transactionSignature } from './signature';
import { encodeTransactionEnvelope, encodeTransactionPayload } from './enode';
import { base } from '@okxweb3/crypto-lib';

export const argParse = (arg: any): Object => {
  switch (typeof arg) {
    case 'string':
      // handle string
      return {
        type: 'String',
        value: arg,
      };
    case 'boolean':
      // handle boolean
      return {
        type: 'Bool',
        value: arg,
      };
    case 'bigint':
      // handle bigint
      return {
        type: 'Int64',
        value: arg.toString(),
      };
    case 'number':
      // handle number
      if (Number.isInteger(arg)) {
        return {
          type: 'Int',
          value: arg.toString(),
        };
      } else {
        return {
          type: 'Fix64',
          value: arg.toString(),
        };
      }

    default:
      // argument is not supported, convert to string
      return {
        type: 'String',
        value: arg.toString(),
      };
  }
};

export const argBuilder = (args: any[]): Buffer[] => {
  const bufs: Array<Buffer> = [];
  args.forEach((a) => {
    // handle map<any, any>
    if (a instanceof Map) {
      const mapEntries: any[] = [];
      a.forEach((v, k) => {
        mapEntries.push({
          key: argParse(k),
          value: argParse(v),
        });
      });
      bufs.push(Buffer.from(JSON.stringify({
        type: 'Dictionary',
        value: mapEntries,
      }), 'utf-8'));
      // assume its string : string
    } else if (Array.isArray(a)) {
      const arrEntries: any[] = [];
      a.forEach((e) => {
        arrEntries.push(argParse(e));
      });
      bufs.push(Buffer.from(JSON.stringify({
        type: 'Array',
        value: arrEntries,
      }), 'utf-8'));
      // handle array
    } else {
      bufs.push(Buffer.from(JSON.stringify(argParse(a))));
    }
  });
  return bufs;
};

export function signTransaction(transaction: Transaction, payloadSignatures: AccountKey[], envelopeSignatures: AccountKey[]): Transaction {
  const tr = transaction;
  const payloadSigs: Signature[] = [];
  payloadSignatures.forEach((ps) => {
    const payloadMsg = encodeTransactionPayload({
      script: tr.script.toString('utf-8'),
      arguments: tr.arguments,
      refBlock: tr.reference_block_id.toString('hex'),
      gasLimit: tr.gas_limit,
      proposalKey: {
        address: tr.proposal_key.address,
        key_id: tr.proposal_key.key_id,
        sequence_number: tr.proposal_key.sequence_number,
      },
      payer: tr.payer.toString('hex'),
      authorizers: tr.authorizers.map((x) => x.toString('hex')),
    });
    const thisSig = transactionSignature(payloadMsg, base.fromHex(ps.private_key));
    tr.payload_signatures.push({ address: Buffer.from(<string>ps.address, 'hex'), key_id: <number>ps.id, signature: Buffer.from(thisSig, 'hex') });
    payloadSigs.push({ address: <string>ps.address, keyId: <number>ps.id, sig: thisSig });
  });
  envelopeSignatures.forEach((es) => {
    const envelopeMsg = encodeTransactionEnvelope({
      script: tr.script.toString('utf-8'),
      arguments: tr.arguments,
      refBlock: tr.reference_block_id.toString('hex'),
      gasLimit: tr.gas_limit,
      proposalKey: {
        address: tr.proposal_key.address,
        key_id: tr.proposal_key.key_id,
        sequence_number: tr.proposal_key.sequence_number,
      },
      payer: tr.payer.toString('hex'),
      payload_signatures: payloadSigs,
      authorizers: tr.authorizers.map((x) => x.toString('hex')),
    });
    const thisSig = transactionSignature(envelopeMsg, base.fromHex(es.private_key));
    tr.envelope_signatures.push({ address: base.fromHex(es.address), key_id: es.id, signature: base.fromHex(thisSig) });
  });
  return tr;
};