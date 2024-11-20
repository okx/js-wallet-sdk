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
    derivationPath?: string,
    sighashType?: number,
    data?: any  // xrc20 token info
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
    data?: any // xrc20 token info
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
    memoPos?: number
    runeData?: RuneData
}

// rune
type RuneData = {
    edicts?: Edict[]
    etching?: Etching
    useDefaultOutput?:boolean
    defaultOutput?:number
    burn?: boolean
    mint?: boolean
    mintNum?: number
    serialMint?:boolean
    revealAddr?: string
}


type Etching = {
    divisibility?: number //u8
    premine?: bigint //u128, decimal 8
    rune: Rune //u128
    spacers?: number//u32
    symbol?: string//char
    terms?: Terms
    turbo?: boolean
    contentType?: string //"image/png" or "image/jpeg" or "text/plain"  or "audio/mpeg" ...
    body?: string | Buffer  //
}

type Terms = {
    amount?: bigint//u128
    cap?: bigint,//u128 How many times can mint?
    height?: Range
    offset?: Range//
}

type Range = {
    start?: bigint //u64
    end?: bigint //u64
}

type Rune = {
    value: bigint|string
}

type Edict = {
    block?:number
    id: number
    amount: bigint | string
    output: number
}

type ListingData = {
    nftAddress: string
    nftUtxo: {
        txHash: string
        vout: number
        coinAmount: number
        rawTransation: string
    }
    receiveBtcAddress: string
    price: number
};

type BuyingData = {
    dummyUtxos: {
        txHash: string
        vout: number
        coinAmount: number
        rawTransation: string
    }[]
    paymentUtxos: {
        txHash: string
        vout: number
        coinAmount: number
        rawTransation: string
    }[]
    receiveNftAddress: string
    paymentAndChangeAddress: string
    feeRate: number
    sellerPsbts: string[]
}

type toSignInputs = {
    index: number,
    address: string,
    publicKey: string,
    sighashTypes: number[],
    disableTweakSigner: boolean
}


type toSignInput = {
    index: number,
    address: string,
    publicKey?: string,
    sighashTypes?: number[],
    disableTweakSigner?: boolean
}

type signPsbtOptions = {
    autoFinalized?: boolean,
    toSignInputs?: toSignInput[]
}

export {
    utxoInput, utxoOutput, omniOutput, utxoTx, ListingData, BuyingData, RuneData, Edict,Etching,Terms,
    Range,Rune,toSignInput, signPsbtOptions
};
