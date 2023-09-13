/**
 * The following methods are based on `bitcoinjs`, thanks for their work
 * https://github.com/bitcoinjs/bitcoinjs-lib
 */
import * as converter from './converter';
import {
  KeyValue,
  PsbtGlobal,
  PsbtGlobalUpdate,
  PsbtInput,
  PsbtInputUpdate,
  PsbtOutput,
  PsbtOutputUpdate,
} from './interfaces';

export function checkForInput(
  inputs: PsbtInput[],
  inputIndex: number,
): PsbtInput {
  const input = inputs[inputIndex];
  if (input === undefined) throw new Error(`No input #${inputIndex}`);
  return input;
}

export function checkForOutput(
  outputs: PsbtOutput[],
  outputIndex: number,
): PsbtOutput {
  const output = outputs[outputIndex];
  if (output === undefined) throw new Error(`No output #${outputIndex}`);
  return output;
}

export function checkHasKey(
  checkKeyVal: KeyValue,
  keyVals: KeyValue[] | undefined,
  enumLength: number,
): void {
  if (checkKeyVal.key[0] < enumLength) {
    throw new Error(
      `Use the method for your specific key instead of addUnknownKeyVal*`,
    );
  }
  if (
    keyVals &&
    keyVals.filter(kv => kv.key.equals(checkKeyVal.key)).length !== 0
  ) {
    throw new Error(`Duplicate Key: ${checkKeyVal.key.toString('hex')}`);
  }
}

export function getEnumLength(myenum: any): number {
  let count = 0;
  Object.keys(myenum).forEach(val => {
    if (Number(isNaN(Number(val)))) {
      count++;
    }
  });
  return count;
}

export function inputCheckUncleanFinalized(
  inputIndex: number,
  input: PsbtInput,
): void {
  let result = false;
  if (input.nonWitnessUtxo || input.witnessUtxo) {
    const needScriptSig = !!input.redeemScript;
    const needWitnessScript = !!input.witnessScript;
    const scriptSigOK = !needScriptSig || !!input.finalScriptSig;
    const witnessScriptOK = !needWitnessScript || !!input.finalScriptWitness;
    const hasOneFinal = !!input.finalScriptSig || !!input.finalScriptWitness;
    result = scriptSigOK && witnessScriptOK && hasOneFinal;
  }
  if (result === false) {
    throw new Error(
      `Input #${inputIndex} has too much or too little data to clean`,
    );
  }
}

function throwForUpdateMaker(
  typeName: string,
  name: string,
  expected: string,
  data: any,
): void {
  throw new Error(
    `Data for ${typeName} key ${name} is incorrect: Expected ` +
      `${expected} and got ${JSON.stringify(data)}`,
  );
}

function updateMaker<T, Y>(
  typeName: string,
): (updateData: T, mainData: Y) => void {
  return (updateData: T, mainData: Y): void => {
    // @ts-ignore
    for (const name of Object.keys(updateData)) {
      // @ts-ignore
      const data = updateData[name];
      // @ts-ignore
      const { canAdd, canAddToArray, check, expected } =
        // @ts-ignore
        converter[typeName + 's'][name] || {};
      const isArray = !!canAddToArray;
      // If unknown data. ignore and do not add
      if (check) {
        if (isArray) {
          if (
            !Array.isArray(data) ||
            // @ts-ignore
            (mainData[name] && !Array.isArray(mainData[name]))
          ) {
            throw new Error(`Key type ${name} must be an array`);
          }
          if (!data.every(check)) {
            throwForUpdateMaker(typeName, name, expected, data);
          }
          // @ts-ignore
          const arr = mainData[name] || [];
          const dupeCheckSet: Set<string> = new Set();
          if (!data.every(v => canAddToArray(arr, v, dupeCheckSet))) {
            throw new Error('Can not add duplicate data to array');
          }
          // @ts-ignore
          mainData[name] = arr.concat(data);
        } else {
          if (!check(data)) {
            throwForUpdateMaker(typeName, name, expected, data);
          }
          if (!canAdd(mainData, data)) {
            throw new Error(`Can not add duplicate data to ${typeName}`);
          }
          // @ts-ignore
          mainData[name] = data;
        }
      }
    }
  };
}
export const updateGlobal = updateMaker<PsbtGlobalUpdate, PsbtGlobal>('global');
export const updateInput = updateMaker<PsbtInputUpdate, PsbtInput>('input');
export const updateOutput = updateMaker<PsbtOutputUpdate, PsbtOutput>('output');

export function addInputAttributes(inputs: PsbtInput[], data: any): void {
  const index = inputs.length - 1;
  const input = checkForInput(inputs, index);
  updateInput(data, input);
}

export function addOutputAttributes(outputs: PsbtOutput[], data: any): void {
  const index = outputs.length - 1;
  const output = checkForOutput(outputs, index);
  updateOutput(data, output);
}

export function defaultVersionSetter(version: number, txBuf: Buffer): Buffer {
  if (!Buffer.isBuffer(txBuf) || txBuf.length < 4) {
    throw new Error('Set Version: Invalid Transaction');
  }
  txBuf.writeUInt32LE(version, 0);
  return txBuf;
}

export function defaultLocktimeSetter(locktime: number, txBuf: Buffer): Buffer {
  if (!Buffer.isBuffer(txBuf) || txBuf.length < 4) {
    throw new Error('Set Locktime: Invalid Transaction');
  }
  txBuf.writeUInt32LE(locktime, txBuf.length - 4);
  return txBuf;
}
