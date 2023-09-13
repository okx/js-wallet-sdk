/**
 * The following methods are based on `bitcoinjs`, thanks for their work
 * https://github.com/bitcoinjs/bitcoinjs-lib
 */
import { InputTypes, OutputTypes } from '../typeFields';

import * as globalXpub from './global/globalXpub';
import * as unsignedTx from './global/unsignedTx';

import * as finalScriptSig from './input/finalScriptSig';
import * as finalScriptWitness from './input/finalScriptWitness';
import * as nonWitnessUtxo from './input/nonWitnessUtxo';
import * as partialSig from './input/partialSig';
import * as porCommitment from './input/porCommitment';
import * as sighashType from './input/sighashType';
import * as tapKeySig from './input/tapKeySig';
import * as tapLeafScript from './input/tapLeafScript';
import * as tapMerkleRoot from './input/tapMerkleRoot';
import * as tapScriptSig from './input/tapScriptSig';
import * as witnessUtxo from './input/witnessUtxo';

import * as tapTree from './output/tapTree';

import * as bip32Derivation from './shared/bip32Derivation';
import * as checkPubkey from './shared/checkPubkey';
import * as redeemScript from './shared/redeemScript';
import * as tapBip32Derivation from './shared/tapBip32Derivation';
import * as tapInternalKey from './shared/tapInternalKey';
import * as witnessScript from './shared/witnessScript';

const globals = {
  unsignedTx,
  globalXpub,
  // pass an Array of key bytes that require pubkey beside the key
  checkPubkey: checkPubkey.makeChecker([]),
};

const inputs = {
  nonWitnessUtxo,
  partialSig,
  sighashType,
  finalScriptSig,
  finalScriptWitness,
  porCommitment,
  witnessUtxo,
  bip32Derivation: bip32Derivation.makeConverter(InputTypes.BIP32_DERIVATION),
  redeemScript: redeemScript.makeConverter(InputTypes.REDEEM_SCRIPT),
  witnessScript: witnessScript.makeConverter(InputTypes.WITNESS_SCRIPT),
  checkPubkey: checkPubkey.makeChecker([
    InputTypes.PARTIAL_SIG,
    InputTypes.BIP32_DERIVATION,
  ]),
  tapKeySig,
  tapScriptSig,
  tapLeafScript,
  tapBip32Derivation: tapBip32Derivation.makeConverter(
    InputTypes.TAP_BIP32_DERIVATION,
  ),
  tapInternalKey: tapInternalKey.makeConverter(InputTypes.TAP_INTERNAL_KEY),
  tapMerkleRoot,
};

const outputs = {
  bip32Derivation: bip32Derivation.makeConverter(OutputTypes.BIP32_DERIVATION),
  redeemScript: redeemScript.makeConverter(OutputTypes.REDEEM_SCRIPT),
  witnessScript: witnessScript.makeConverter(OutputTypes.WITNESS_SCRIPT),
  checkPubkey: checkPubkey.makeChecker([OutputTypes.BIP32_DERIVATION]),
  tapBip32Derivation: tapBip32Derivation.makeConverter(
    OutputTypes.TAP_BIP32_DERIVATION,
  ),
  tapTree,
  tapInternalKey: tapInternalKey.makeConverter(OutputTypes.TAP_INTERNAL_KEY),
};

export { globals, inputs, outputs };
