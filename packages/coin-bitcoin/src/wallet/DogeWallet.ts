import * as bitcoin from "../index";
import {SignTxError, SignTxParams} from "@okxweb3/coin-base";
import {BtcWallet} from "./BtcWallet";

export const dogeCoin: bitcoin.Network = {
    messagePrefix: '\x18Dogecoin Signed Message:\n',
    // doge not support native segwit
    bech32: 'bc',
    bip32: {
        public: 49990397,
        private: 49988504,
    },
    pubKeyHash: 30,
    scriptHash: 22,
    wif: 158,
};

export class DogeWallet extends BtcWallet {
    network() {
        return dogeCoin
    }

    async signTransaction(param: SignTxParams): Promise<any> {
        const type = param.data.type || 0;
        if (type === 1) { // inscribe
            try {
                return Promise.resolve(bitcoin.dogInscribe(dogeCoin, param.data));
            } catch (e) {
                return Promise.reject(SignTxError);
            }
        } else if (type === 2) { // psbt
            try {
                return Promise.resolve(bitcoin.psbtSign(param.data.psbt, param.privateKey, this.network(), param.data.maximumFeeRate ? param.data.maximumFeeRate : 100000));
            } catch (e) {
                return Promise.reject(SignTxError);
            }
        } else {
            return super.signTransaction(param)
        }
    }
}


