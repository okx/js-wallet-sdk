import { SignTxParams } from "@okxweb3/coin-base";
import { BtcWallet } from "./BtcWallet";
import { cat20estimateFeeV2, cat20transferV2 } from "../cat20V2";

export class CatWalletV2 extends BtcWallet {
  async signTransaction(param: SignTxParams): Promise<any> {
    try {
      const tx = await cat20transferV2(param);
      return Promise.resolve(tx);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async estimateFee(param: SignTxParams): Promise<any> {
    try {
      param.data.estimateFee = true;
      const fees = await cat20estimateFeeV2(param);
      return Promise.resolve(fees);
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
