/**
 * The following methods are based on `bitcoinjs`, thanks for their work
 * https://github.com/bitcoinjs/bitcoinjs-lib
 */
import { base } from "@okxweb3/crypto-lib"
import { toOutputScript } from './address';
import { Network } from './networks';
import { Transaction } from './transaction';
import { Psbt } from './psbt';
import { encode } from './varuint';
import { psbtSignImpl } from '../psbtSign';
import { wif2Public } from "../txBuild";
import { isP2TR } from "./psbt/psbtutils";

function bip0322_hash(message: string) {
  const tag = 'BIP0322-signed-message';
  const tagHash = base.sha256(Buffer.from(tag));
  const result = base.sha256(Buffer.concat([tagHash, tagHash, Buffer.from(message)]));
  return base.toHex(result)
}

export async function signSimple(message: string, address: string, privateKey: string, network?: Network) {
  const outputScript = toOutputScript(address, network);

  const prevoutHash = Buffer.from('0000000000000000000000000000000000000000000000000000000000000000', 'hex');
  const prevoutIndex = 0xffffffff;
  const sequence = 0;
  const scriptSig = Buffer.concat([Buffer.from('0020', 'hex'), Buffer.from(bip0322_hash(message), 'hex')]);

  const txToSpend = new Transaction();
  txToSpend.version = 0;
  txToSpend.addInput(prevoutHash, prevoutIndex, sequence, scriptSig);
  txToSpend.addOutput(outputScript, 0);

  const psbtToSign = new Psbt({ network });
  psbtToSign.setVersion(0);
  psbtToSign.addInput({
    hash: txToSpend.getHash(),
    index: 0,
    sequence: 0,
    witnessUtxo: {
      script: outputScript,
      value: 0
    },
  });
  if (isP2TR(outputScript)) {
    psbtToSign.updateInput(0, {
      tapInternalKey: wif2Public(privateKey, network).slice(1),
    });
  }
  psbtToSign.addOutput({ script: Buffer.from('6a', 'hex'), value: 0 });

  psbtSignImpl(psbtToSign, privateKey, network);
  psbtToSign.finalizeAllInputs()

  const txToSign = psbtToSign.extractTransaction();

  function encodeVarString(b: Buffer) {
    return Buffer.concat([encode(b.byteLength), b]);
  }

  const len = encode(txToSign.ins[0].witness.length);
  const result = Buffer.concat([len, ...txToSign.ins[0].witness.map((w) => encodeVarString(w))]);
  return base.toBase64(result);
}

export function verifySimple(message: string, address: string, witness: string, publicKey: string, network?: Network) : boolean {
  const outputScript = toOutputScript(address, network);

  const prevoutHash = Buffer.from('0000000000000000000000000000000000000000000000000000000000000000', 'hex');
  const prevoutIndex = 0xffffffff;
  const sequence = 0;
  const scriptSig = Buffer.concat([Buffer.from('0020', 'hex'), Buffer.from(bip0322_hash(message), 'hex')]);

  const txToSpend = new Transaction();
  txToSpend.version = 0;
  txToSpend.addInput(prevoutHash, prevoutIndex, sequence, scriptSig);
  txToSpend.addOutput(outputScript, 0);

  const psbtToSign = new Psbt();
  psbtToSign.setVersion(0);
  psbtToSign.addInput({
    hash: txToSpend.getHash(),
    index: 0,
    sequence: 0,
    witnessUtxo: {
      script: outputScript,
      value: 0
    },
  });

  const pubBuf = base.fromHex(publicKey)
  if (isP2TR(outputScript)) {
    psbtToSign.updateInput(0, {
      tapInternalKey: pubBuf.slice(1),
    });
  }
  psbtToSign.addOutput({ script: Buffer.from('6a', 'hex'), value: 0 });
  return psbtToSign.verify(pubBuf, Buffer.from(base.fromBase64(witness)))
}