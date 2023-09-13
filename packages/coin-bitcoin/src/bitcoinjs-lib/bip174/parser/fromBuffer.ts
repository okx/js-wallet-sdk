/**
 * The following methods are based on `bitcoinjs`, thanks for their work
 * https://github.com/bitcoinjs/bitcoinjs-lib
 */
import * as convert from '../converter';
import { range } from '../converter/tools';
import * as varuint from '../converter/varint';
import {
  KeyValue,
  PsbtGlobal,
  PsbtInput,
  PsbtOutput,
  Transaction,
  TransactionFromBuffer,
} from '../interfaces';
import { GlobalTypes, InputTypes, OutputTypes } from '../typeFields';
import { PsbtAttributes } from './index';

export function psbtFromBuffer(
  buffer: Buffer,
  txGetter: TransactionFromBuffer,
): PsbtAttributes {
  let offset = 0;

  function varSlice(): Buffer {
    const keyLen = varuint.decode(buffer, offset);
    offset += varuint.encodingLength(keyLen);
    const key = buffer.slice(offset, offset + keyLen);
    offset += keyLen;
    return key;
  }

  function readUInt32BE(): number {
    const num = buffer.readUInt32BE(offset);
    offset += 4;
    return num;
  }

  function readUInt8(): number {
    const num = buffer.readUInt8(offset);
    offset += 1;
    return num;
  }

  function getKeyValue(): KeyValue {
    const key = varSlice();
    const value = varSlice();
    return {
      key,
      value,
    };
  }

  function checkEndOfKeyValPairs(): boolean {
    if (offset >= buffer.length) {
      throw new Error('Format Error: Unexpected End of PSBT');
    }
    const isEnd = buffer.readUInt8(offset) === 0;
    if (isEnd) {
      offset++;
    }
    return isEnd;
  }

  if (readUInt32BE() !== 0x70736274) {
    throw new Error('Format Error: Invalid Magic Number');
  }
  if (readUInt8() !== 0xff) {
    throw new Error(
      'Format Error: Magic Number must be followed by 0xff separator',
    );
  }

  const globalMapKeyVals: KeyValue[] = [];
  const globalKeyIndex: { [index: string]: number } = {};
  while (!checkEndOfKeyValPairs()) {
    const keyVal = getKeyValue();
    const hexKey = keyVal.key.toString('hex');
    if (globalKeyIndex[hexKey]) {
      throw new Error(
        'Format Error: Keys must be unique for global keymap: key ' + hexKey,
      );
    }
    globalKeyIndex[hexKey] = 1;
    globalMapKeyVals.push(keyVal);
  }

  const unsignedTxMaps = globalMapKeyVals.filter(
    keyVal => keyVal.key[0] === GlobalTypes.UNSIGNED_TX,
  );

  if (unsignedTxMaps.length !== 1) {
    throw new Error('Format Error: Only one UNSIGNED_TX allowed');
  }

  const unsignedTx = txGetter(unsignedTxMaps[0].value);

  // Get input and output counts to loop the respective fields
  const { inputCount, outputCount } = unsignedTx.getInputOutputCounts();
  const inputKeyVals: KeyValue[][] = [];
  const outputKeyVals: KeyValue[][] = [];

  // Get input fields
  for (const index of range(inputCount)) {
    const inputKeyIndex: { [index: string]: number } = {};
    const input = [] as KeyValue[];
    while (!checkEndOfKeyValPairs()) {
      const keyVal = getKeyValue();
      const hexKey = keyVal.key.toString('hex');
      if (inputKeyIndex[hexKey]) {
        throw new Error(
          'Format Error: Keys must be unique for each input: ' +
            'input index ' +
            index +
            ' key ' +
            hexKey,
        );
      }
      inputKeyIndex[hexKey] = 1;
      input.push(keyVal);
    }
    inputKeyVals.push(input);
  }

  for (const index of range(outputCount)) {
    const outputKeyIndex: { [index: string]: number } = {};
    const output = [] as KeyValue[];
    while (!checkEndOfKeyValPairs()) {
      const keyVal = getKeyValue();
      const hexKey = keyVal.key.toString('hex');
      if (outputKeyIndex[hexKey]) {
        throw new Error(
          'Format Error: Keys must be unique for each output: ' +
            'output index ' +
            index +
            ' key ' +
            hexKey,
        );
      }
      outputKeyIndex[hexKey] = 1;
      output.push(keyVal);
    }
    outputKeyVals.push(output);
  }

  return psbtFromKeyVals(unsignedTx, {
    globalMapKeyVals,
    inputKeyVals,
    outputKeyVals,
  });
}

interface PsbtFromKeyValsArg {
  globalMapKeyVals: KeyValue[];
  inputKeyVals: KeyValue[][];
  outputKeyVals: KeyValue[][];
}

export function checkKeyBuffer(
  type: string,
  keyBuf: Buffer,
  keyNum: number,
): void {
  if (!keyBuf.equals(Buffer.from([keyNum]))) {
    throw new Error(
      `Format Error: Invalid ${type} key: ${keyBuf.toString('hex')}`,
    );
  }
}

export function psbtFromKeyVals(
  unsignedTx: Transaction,
  { globalMapKeyVals, inputKeyVals, outputKeyVals }: PsbtFromKeyValsArg,
): PsbtAttributes {
  // That was easy :-)
  const globalMap: PsbtGlobal = {
    unsignedTx,
  };
  let txCount = 0;
  for (const keyVal of globalMapKeyVals) {
    // If a globalMap item needs pubkey, uncomment
    // const pubkey = convert.globals.checkPubkey(keyVal);

    switch (keyVal.key[0]) {
      case GlobalTypes.UNSIGNED_TX:
        checkKeyBuffer('global', keyVal.key, GlobalTypes.UNSIGNED_TX);
        if (txCount > 0) {
          throw new Error('Format Error: GlobalMap has multiple UNSIGNED_TX');
        }
        txCount++;
        break;
      case GlobalTypes.GLOBAL_XPUB:
        if (globalMap.globalXpub === undefined) {
          globalMap.globalXpub = [];
        }
        globalMap.globalXpub.push(convert.globals.globalXpub.decode(keyVal));
        break;
      default:
        // This will allow inclusion during serialization.
        if (!globalMap.unknownKeyVals) globalMap.unknownKeyVals = [];
        globalMap.unknownKeyVals.push(keyVal);
    }
  }

  // Get input and output counts to loop the respective fields
  const inputCount = inputKeyVals.length;
  const outputCount = outputKeyVals.length;
  const inputs: PsbtInput[] = [];
  const outputs: PsbtOutput[] = [];

  // Get input fields
  for (const index of range(inputCount)) {
    const input: PsbtInput = {};
    for (const keyVal of inputKeyVals[index]) {
      convert.inputs.checkPubkey(keyVal);

      switch (keyVal.key[0]) {
        case InputTypes.NON_WITNESS_UTXO:
          checkKeyBuffer('input', keyVal.key, InputTypes.NON_WITNESS_UTXO);
          if (input.nonWitnessUtxo !== undefined) {
            throw new Error(
              'Format Error: Input has multiple NON_WITNESS_UTXO',
            );
          }
          input.nonWitnessUtxo = convert.inputs.nonWitnessUtxo.decode(keyVal);
          break;
        case InputTypes.WITNESS_UTXO:
          checkKeyBuffer('input', keyVal.key, InputTypes.WITNESS_UTXO);
          if (input.witnessUtxo !== undefined) {
            throw new Error('Format Error: Input has multiple WITNESS_UTXO');
          }
          input.witnessUtxo = convert.inputs.witnessUtxo.decode(keyVal);
          break;
        case InputTypes.PARTIAL_SIG:
          if (input.partialSig === undefined) {
            input.partialSig = [];
          }
          input.partialSig.push(convert.inputs.partialSig.decode(keyVal));
          break;
        case InputTypes.SIGHASH_TYPE:
          checkKeyBuffer('input', keyVal.key, InputTypes.SIGHASH_TYPE);
          if (input.sighashType !== undefined) {
            throw new Error('Format Error: Input has multiple SIGHASH_TYPE');
          }
          input.sighashType = convert.inputs.sighashType.decode(keyVal);
          break;
        case InputTypes.REDEEM_SCRIPT:
          checkKeyBuffer('input', keyVal.key, InputTypes.REDEEM_SCRIPT);
          if (input.redeemScript !== undefined) {
            throw new Error('Format Error: Input has multiple REDEEM_SCRIPT');
          }
          input.redeemScript = convert.inputs.redeemScript.decode(keyVal);
          break;
        case InputTypes.WITNESS_SCRIPT:
          checkKeyBuffer('input', keyVal.key, InputTypes.WITNESS_SCRIPT);
          if (input.witnessScript !== undefined) {
            throw new Error('Format Error: Input has multiple WITNESS_SCRIPT');
          }
          input.witnessScript = convert.inputs.witnessScript.decode(keyVal);
          break;
        case InputTypes.BIP32_DERIVATION:
          if (input.bip32Derivation === undefined) {
            input.bip32Derivation = [];
          }
          input.bip32Derivation.push(
            convert.inputs.bip32Derivation.decode(keyVal),
          );
          break;
        case InputTypes.FINAL_SCRIPTSIG:
          checkKeyBuffer('input', keyVal.key, InputTypes.FINAL_SCRIPTSIG);
          input.finalScriptSig = convert.inputs.finalScriptSig.decode(keyVal);
          break;
        case InputTypes.FINAL_SCRIPTWITNESS:
          checkKeyBuffer('input', keyVal.key, InputTypes.FINAL_SCRIPTWITNESS);
          input.finalScriptWitness = convert.inputs.finalScriptWitness.decode(
            keyVal,
          );
          break;
        case InputTypes.POR_COMMITMENT:
          checkKeyBuffer('input', keyVal.key, InputTypes.POR_COMMITMENT);
          input.porCommitment = convert.inputs.porCommitment.decode(keyVal);
          break;
        case InputTypes.TAP_KEY_SIG:
          checkKeyBuffer('input', keyVal.key, InputTypes.TAP_KEY_SIG);
          input.tapKeySig = convert.inputs.tapKeySig.decode(keyVal);
          break;
        case InputTypes.TAP_SCRIPT_SIG:
          if (input.tapScriptSig === undefined) {
            input.tapScriptSig = [];
          }
          input.tapScriptSig.push(convert.inputs.tapScriptSig.decode(keyVal));
          break;
        case InputTypes.TAP_LEAF_SCRIPT:
          if (input.tapLeafScript === undefined) {
            input.tapLeafScript = [];
          }
          input.tapLeafScript.push(convert.inputs.tapLeafScript.decode(keyVal));
          break;
        case InputTypes.TAP_BIP32_DERIVATION:
          if (input.tapBip32Derivation === undefined) {
            input.tapBip32Derivation = [];
          }
          input.tapBip32Derivation.push(
            convert.inputs.tapBip32Derivation.decode(keyVal),
          );
          break;
        case InputTypes.TAP_INTERNAL_KEY:
          checkKeyBuffer('input', keyVal.key, InputTypes.TAP_INTERNAL_KEY);
          input.tapInternalKey = convert.inputs.tapInternalKey.decode(keyVal);
          break;
        case InputTypes.TAP_MERKLE_ROOT:
          checkKeyBuffer('input', keyVal.key, InputTypes.TAP_MERKLE_ROOT);
          input.tapMerkleRoot = convert.inputs.tapMerkleRoot.decode(keyVal);
          break;
        default:
          // This will allow inclusion during serialization.
          if (!input.unknownKeyVals) input.unknownKeyVals = [];
          input.unknownKeyVals.push(keyVal);
      }
    }
    inputs.push(input);
  }

  for (const index of range(outputCount)) {
    const output: PsbtOutput = {};
    for (const keyVal of outputKeyVals[index]) {
      convert.outputs.checkPubkey(keyVal);

      switch (keyVal.key[0]) {
        case OutputTypes.REDEEM_SCRIPT:
          checkKeyBuffer('output', keyVal.key, OutputTypes.REDEEM_SCRIPT);
          if (output.redeemScript !== undefined) {
            throw new Error('Format Error: Output has multiple REDEEM_SCRIPT');
          }
          output.redeemScript = convert.outputs.redeemScript.decode(keyVal);
          break;
        case OutputTypes.WITNESS_SCRIPT:
          checkKeyBuffer('output', keyVal.key, OutputTypes.WITNESS_SCRIPT);
          if (output.witnessScript !== undefined) {
            throw new Error('Format Error: Output has multiple WITNESS_SCRIPT');
          }
          output.witnessScript = convert.outputs.witnessScript.decode(keyVal);
          break;
        case OutputTypes.BIP32_DERIVATION:
          if (output.bip32Derivation === undefined) {
            output.bip32Derivation = [];
          }
          output.bip32Derivation.push(
            convert.outputs.bip32Derivation.decode(keyVal),
          );
          break;
        case OutputTypes.TAP_INTERNAL_KEY:
          checkKeyBuffer('output', keyVal.key, OutputTypes.TAP_INTERNAL_KEY);
          output.tapInternalKey = convert.outputs.tapInternalKey.decode(keyVal);
          break;
        case OutputTypes.TAP_TREE:
          checkKeyBuffer('output', keyVal.key, OutputTypes.TAP_TREE);
          output.tapTree = convert.outputs.tapTree.decode(keyVal);
          break;
        case OutputTypes.TAP_BIP32_DERIVATION:
          if (output.tapBip32Derivation === undefined) {
            output.tapBip32Derivation = [];
          }
          output.tapBip32Derivation.push(
            convert.outputs.tapBip32Derivation.decode(keyVal),
          );
          break;
        default:
          if (!output.unknownKeyVals) output.unknownKeyVals = [];
          output.unknownKeyVals.push(keyVal);
      }
    }
    outputs.push(output);
  }

  return { globalMap, inputs, outputs };
}
