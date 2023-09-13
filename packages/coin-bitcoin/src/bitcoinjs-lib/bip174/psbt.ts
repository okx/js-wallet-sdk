/**
 * The following methods are based on `bitcoinjs`, thanks for their work
 * https://github.com/bitcoinjs/bitcoinjs-lib
 */
import { combine } from './combiner';
import {
  KeyValue,
  PsbtGlobal,
  PsbtGlobalUpdate,
  PsbtInput,
  PsbtInputExtended,
  PsbtInputUpdate,
  PsbtOutput,
  PsbtOutputExtended,
  PsbtOutputUpdate,
  Transaction,
  TransactionFromBuffer,
} from './interfaces';
import { psbtFromBuffer, psbtToBuffer } from './parser';
import { GlobalTypes, InputTypes, OutputTypes } from './typeFields';
import {
  addInputAttributes,
  addOutputAttributes,
  checkForInput,
  checkForOutput,
  checkHasKey,
  getEnumLength,
  inputCheckUncleanFinalized,
  updateGlobal,
  updateInput,
  updateOutput,
} from './utils';

export class Psbt {
  static fromBase64<T extends typeof Psbt>(
    this: T,
    data: string,
    txFromBuffer: TransactionFromBuffer,
  ): InstanceType<T> {
    const buffer = Buffer.from(data, 'base64');
    return this.fromBuffer(buffer, txFromBuffer);
  }
  static fromHex<T extends typeof Psbt>(
    this: T,
    data: string,
    txFromBuffer: TransactionFromBuffer,
  ): InstanceType<T> {
    const buffer = Buffer.from(data, 'hex');
    return this.fromBuffer(buffer, txFromBuffer);
  }
  static fromBuffer<T extends typeof Psbt>(
    this: T,
    buffer: Buffer,
    txFromBuffer: TransactionFromBuffer,
  ): InstanceType<T> {
    const results = psbtFromBuffer(buffer, txFromBuffer);
    const psbt = new this(results.globalMap.unsignedTx) as InstanceType<T>;
    Object.assign(psbt, results);
    return psbt;
  }

  readonly inputs: PsbtInput[] = [];
  readonly outputs: PsbtOutput[] = [];
  readonly globalMap: PsbtGlobal;

  constructor(tx: Transaction) {
    this.globalMap = {
      unsignedTx: tx,
    };
  }

  toBase64(): string {
    const buffer = this.toBuffer();
    return buffer.toString('base64');
  }

  toHex(): string {
    const buffer = this.toBuffer();
    return buffer.toString('hex');
  }

  toBuffer(): Buffer {
    return psbtToBuffer(this);
  }

  updateGlobal(updateData: PsbtGlobalUpdate): this {
    updateGlobal(updateData, this.globalMap);
    return this;
  }

  updateInput(inputIndex: number, updateData: PsbtInputUpdate): this {
    const input = checkForInput(this.inputs, inputIndex);
    updateInput(updateData, input);
    return this;
  }

  updateOutput(outputIndex: number, updateData: PsbtOutputUpdate): this {
    const output = checkForOutput(this.outputs, outputIndex);
    updateOutput(updateData, output);
    return this;
  }

  addUnknownKeyValToGlobal(keyVal: KeyValue): this {
    checkHasKey(
      keyVal,
      this.globalMap.unknownKeyVals,
      getEnumLength(GlobalTypes),
    );
    if (!this.globalMap.unknownKeyVals) this.globalMap.unknownKeyVals = [];
    this.globalMap.unknownKeyVals.push(keyVal);
    return this;
  }

  addUnknownKeyValToInput(inputIndex: number, keyVal: KeyValue): this {
    const input = checkForInput(this.inputs, inputIndex);
    checkHasKey(keyVal, input.unknownKeyVals, getEnumLength(InputTypes));
    if (!input.unknownKeyVals) input.unknownKeyVals = [];
    input.unknownKeyVals.push(keyVal);
    return this;
  }

  addUnknownKeyValToOutput(outputIndex: number, keyVal: KeyValue): this {
    const output = checkForOutput(this.outputs, outputIndex);
    checkHasKey(keyVal, output.unknownKeyVals, getEnumLength(OutputTypes));
    if (!output.unknownKeyVals) output.unknownKeyVals = [];
    output.unknownKeyVals.push(keyVal);
    return this;
  }

  addInput(inputData: PsbtInputExtended): this {
    this.globalMap.unsignedTx.addInput(inputData);
    this.inputs.push({
      unknownKeyVals: [],
    });
    const addKeyVals = inputData.unknownKeyVals || [];
    const inputIndex = this.inputs.length - 1;
    if (!Array.isArray(addKeyVals)) {
      throw new Error('unknownKeyVals must be an Array');
    }
    addKeyVals.forEach((keyVal: KeyValue) =>
      this.addUnknownKeyValToInput(inputIndex, keyVal),
    );
    addInputAttributes(this.inputs, inputData);
    return this;
  }

  addOutput(outputData: PsbtOutputExtended): this {
    this.globalMap.unsignedTx.addOutput(outputData);
    this.outputs.push({
      unknownKeyVals: [],
    });
    const addKeyVals = outputData.unknownKeyVals || [];
    const outputIndex = this.outputs.length - 1;
    if (!Array.isArray(addKeyVals)) {
      throw new Error('unknownKeyVals must be an Array');
    }
    addKeyVals.forEach((keyVal: KeyValue) =>
      this.addUnknownKeyValToInput(outputIndex, keyVal),
    );
    addOutputAttributes(this.outputs, outputData);
    return this;
  }

  clearFinalizedInput(inputIndex: number): this {
    const input = checkForInput(this.inputs, inputIndex);
    inputCheckUncleanFinalized(inputIndex, input);
    for (const key of Object.keys(input)) {
      if (
        ![
          'witnessUtxo',
          'nonWitnessUtxo',
          'finalScriptSig',
          'finalScriptWitness',
          'unknownKeyVals',
        ].includes(key)
      ) {
        // @ts-ignore
        delete input[key];
      }
    }
    return this;
  }

  combine(...those: this[]): this {
    // Combine this with those.
    // Return self for chaining.
    const result = combine([this].concat(those));
    Object.assign(this, result);
    return this;
  }

  getTransaction(): Buffer {
    return this.globalMap.unsignedTx.toBuffer();
  }
}
