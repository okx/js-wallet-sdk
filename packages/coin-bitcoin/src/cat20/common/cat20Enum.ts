export enum CatAddressType {
    P2WPKH = 'p2wpkh',
    P2TR = 'p2tr',
}

export enum SupportedNetwork {
    btcSignet = 'btc-signet',
    fractalMainnet = 'fractal-mainnet',
    fractalTestnet = 'fractal-testnet'
}


export enum Postage {
    METADATA_POSTAGE = 546,
    GUARD_POSTAGE = 332,
    MINTER_POSTAGE = 331,
    TOKEN_POSTAGE = 330,
}

export const CHANGE_MIN_POSTAGE = 546;

export enum MinterType {
    OPEN_MINTER_V1 = '21cbd2e538f2b6cc40ee180e174f1e25',
    OPEN_MINTER_V2 = 'a6c2e92d74a23c07bb6220b676c6cb9b',
    UNKOWN_MINTER = 'unkown_minter',
}
