import { SignTxParams} from "@okxweb3/coin-base";
import { BtcWallet } from "./BtcWallet";
import {estimateFee, transfer, mint} from "../cat20"

export class CatWallet extends BtcWallet {

    async signTransaction(param: SignTxParams): Promise<any> {
        try {
            const tx = await transfer(param)
            return Promise.resolve(tx);
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async estimateFee(param: SignTxParams): Promise<any> {
        try {
            param.data.estimateFee = true
            const fees = await transfer(param)
            return Promise.resolve(fees);
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async mint(param: SignTxParams): Promise<any> {
        try {
            const tx = await mint(param)
            return Promise.resolve(tx);
        } catch (e) {
            return Promise.reject(e);
        }
    }
}
// fractal testnet uses same network info as bitcoin & fractal mainnet
// export class CatTestWallet extends CatWallet {
//     network() {
//         return bitcoin.networks.testnet;
//     }
// }
