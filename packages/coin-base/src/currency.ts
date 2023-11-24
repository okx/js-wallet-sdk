// https://github.com/satoshilabs/slips/blob/master/slip-0044.md

export enum Currency {
    NULL = -1,  // unknown coin type
    BTC = 0,
    TBTC = 1,
    ETH = 60,
    LTC = 2,
    DOGE = 3,
    BCH = 145,
    BSV = 236,
    TRX = 195,
    SOL = 501,
    APTOS = 637,
    OMNI_USDT = 20001,
    OMNI_USDT_TEST = 20002,
    SUI = 784,

    // cosmos
    ATOM = 118,
    OSMO = 1000,
    EVMOS = 1001,
    AXL = 1002,
    CRO = 1003,
    Iris = 1004,
    Juno = 1005,
    Kava = 1006,
    Kujira = 1007,
    SCRT = 1008,
    Stargaze = 1009,
    Terra = 1010,
    ZKSPACE = 1011,
    ZKSYNC = 804,
    Stx = 5757,
    SEI = 2837,
    WAX = 14001,
    Starknet = 9004,
    ADA = 1815,
    INJ = 2892,
    Celestia = 2854,
    DYDX = 2897,
    Kaspa = 111111,
    Venom = 1000000,
}

export enum segwitType {
    SEGWIT_NESTED = 1,
    SEGWIT_NESTED_49 = 2,
    SEGWIT_NATIVE = 3,
    SEGWIT_TAPROOT = 4,
}

export const MultiAddressCoins: Currency[] = [
    Currency.BTC, Currency.TBTC, Currency.LTC, Currency.DOGE, Currency.BSV, Currency.OMNI_USDT, Currency.OMNI_USDT_TEST
]

const secp256k1 = "secp256k1";
const ed25519 = "ed25519";
export const CoinCurveMap = new Map<Currency, string>([
    // secp256k1
    [Currency.BTC, secp256k1],
    [Currency.TBTC, secp256k1],
    [Currency.ETH, secp256k1],
    [Currency.LTC, secp256k1],
    [Currency.DOGE, secp256k1],
    [Currency.BCH, secp256k1],
    [Currency.BSV, secp256k1],
    [Currency.TRX, secp256k1],
    [Currency.OMNI_USDT, secp256k1],
    [Currency.OMNI_USDT_TEST, secp256k1],
    // cosmos: secp256k1
    [Currency.ATOM, secp256k1],
    [Currency.OSMO, secp256k1],
    [Currency.EVMOS, secp256k1],
    [Currency.AXL, secp256k1],
    [Currency.CRO, secp256k1],
    [Currency.Iris, secp256k1],
    [Currency.Juno, secp256k1],
    [Currency.Kava, secp256k1],
    [Currency.Kujira, secp256k1],
    [Currency.SCRT, secp256k1],
    [Currency.Stargaze, secp256k1],
    [Currency.Terra, secp256k1],
    [Currency.SEI, secp256k1],
    [Currency.INJ, secp256k1],
    [Currency.Celestia, secp256k1],
    [Currency.DYDX, secp256k1],


    // [Currency.ZKSPACE, secp256k1],
    // [Currency.ZKSYNC, secp256k1],

    // ed25519 non-support type
    [Currency.SOL, ed25519],
    [Currency.APTOS, ed25519],
    [Currency.SUI, ed25519],
]);
