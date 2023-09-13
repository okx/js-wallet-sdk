/**
 * The following methods are based on `bitcoinjs`, thanks for their work
 * https://github.com/bitcoinjs/bitcoinjs-lib
 */
import { PsbtGlobal, PsbtInput, PsbtOutput } from '../interfaces';

export * from './fromBuffer';
export * from './toBuffer';

export interface PsbtAttributes {
  globalMap: PsbtGlobal;
  inputs: PsbtInput[];
  outputs: PsbtOutput[];
}
