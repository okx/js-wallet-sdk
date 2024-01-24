import * as bitcoin from "../index";
import {SignMsgError, SignTxError, SignTxParams, TypedMessage, VerifyMessageParams} from "@okxweb3/coin-base";
import {BtcWallet} from "./BtcWallet";

export const dogeCoin: bitcoin.Network = {
    messagePrefix: 'Dogecoin Signed Message:\n',
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

    signMessage(param: SignTxParams): Promise<string> {
        try {
            const typedMessage = param.data as TypedMessage;
            let signature = bitcoin.message.sign(param.privateKey, typedMessage.message, this.network(), dogeCoin.messagePrefix);
            return Promise.resolve(signature);
        } catch (e) {
            return Promise.reject(SignMsgError);
        }
    }

    async verifyMessage(param: VerifyMessageParams): Promise<boolean> {
        try {
            const typedMessage = param.data as TypedMessage;
            const ret = bitcoin.message.verify(typedMessage.publicKey!, typedMessage.message, param.signature, dogeCoin.messagePrefix);
            return Promise.resolve(ret);
        } catch (e) {
            return Promise.reject(SignMsgError);
        }
    }

}


