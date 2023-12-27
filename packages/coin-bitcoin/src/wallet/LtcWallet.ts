import {DerivePathError, GetDerivedPathParam, segwitType} from "@okxweb3/coin-base";
import {BtcWallet} from "./BtcWallet";
import * as bitcoin from "../index"


export const litecoin: bitcoin.Network = {
    messagePrefix: '\x19Litecoin Signed Message:\n',
    bech32: 'ltc',
    bip32: {
        public: 0x019da462,
        private: 0x019d9cfe,
    },
    pubKeyHash: 0x30,
    scriptHash: 0x32,
    wif: 0xb0,
};

export class LtcWallet extends BtcWallet {
    network() {
        return litecoin;
    }

    async getDerivedPath(param: GetDerivedPathParam): Promise<any> {
        if (!param.segwitType) {
            // normal address
            return `m/44'/2'/0'/0/${param.index}`;
        }

        if (param.segwitType == segwitType.SEGWIT_NESTED) {
            return `m/84'/2'/0'/0/${param.index}`;
        } else if (param.segwitType == segwitType.SEGWIT_NESTED_49) {
            return `m/49'/2'/0'/0/${param.index}`;
        } else if (param.segwitType == segwitType.SEGWIT_NATIVE) {
            return `m/84'/2'/0'/0/${param.index}`;
        } else {
            return Promise.reject(DerivePathError);
        }
    }
}
