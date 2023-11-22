type utxoInput = {
  txId: string
  vOut: number
  amount: number  // min unit: satoshi
  address?: string
  reedScript?: string
  privateKey?: string
  publicKey?: string
  sequence?: number,
  nonWitnessUtxo?: string,
  bip32Derivation?: Bip32Derivation[],
  derivationPath?: string
}

type Bip32Derivation = {
  masterFingerprint: string,
  pubkey: string,
  path: string,
  leafHashes?: string[]
}

type utxoOutput = {
  address: string
  amount: number // min unit: satoshi
  omniScript?: string
  bip32Derivation?: Bip32Derivation[]
  derivationPath?: string
  isChange?: boolean
}

type omniOutput = {
  coinType?: number // usdt 31
  amount: number    // need to multiply 10^8
}

type utxoTx = {
  inputs: []
  outputs: []
  address: string   // change address
  feePerB?: number  //  Sat/b
  decimal?: number  // precision: 8 bit
  fee?: number      // fixed fee  eg: 0.001 AVAX
  omni?: omniOutput
  dustSize?: number
  bip32Derivation?: Bip32Derivation[] // derivation info
  derivationPath?: string
  memo?: string
}

export {
  utxoInput, utxoOutput, omniOutput, utxoTx
};
