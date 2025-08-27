import { address, Transaction } from "@scrypt-inc/bitcoinjs-lib";
import {
  ChainProvider,
  getUtxoKey,
  uint8ArrayToHex,
  UTXO,
  UtxoProvider,
  UtxoQueryOptions,
} from "@scrypt-inc/scrypt-ts-btc";
import { ExtUtxo } from "@scrypt-inc/scrypt-ts-btc/dist/types/covenant";
import { TokenPrevTx, UtxoInput } from "../../cat20/common";

export class LocalProvider implements ChainProvider, UtxoProvider {
  private spentUTXOs = new Set<string>();
  private newUTXOs = new Map<string, UTXO>();
  private broadcastedTxs: Map<string, string> = new Map();
  private cacheTxs: Map<string, Transaction> = new Map();
  private feeRate: number;

  constructor() {
    this.feeRate = 1;
  }

  setFeeRate(feeRate: number) {
    this.feeRate = feeRate;
  }

  cacheUtxoInputs(utxoInputs: UtxoInput[]) {
    for (const utxoInput of utxoInputs) {
      this.addNewUTXO({
        address: utxoInput.address,
        txId: utxoInput.txId,
        outputIndex: utxoInput.vOut,
        script: uint8ArrayToHex(address.toOutputScript(utxoInput.address!)),
        satoshis: utxoInput.amount,
      });
    }
  }

  cacheTokenPrevTxs(tokenPrevTxs: TokenPrevTx[]) {
    for (let index = 0; index < tokenPrevTxs.length; index++) {
      const tokenPrevTx = tokenPrevTxs[index];
      this.cacheTx(Transaction.fromHex(tokenPrevTx.prevTx));
      this.cacheTx(Transaction.fromHex(tokenPrevTx.prevPrevTx));
    }
  }

  cacheTx(tx: Transaction) {
    const txId = tx.getId();
    this.cacheTxs.set(txId, tx);
  }

  broadcast(txHex: string): Promise<string> {
    const txid = Transaction.fromHex(txHex).getId();
    this.broadcastedTxs.set(txid, txHex);
    return Promise.resolve(txid);
  }

  getTx(txid: string): Transaction | undefined {
    return this.cacheTxs.get(txid);
  }

  getRawTransaction(txId: string): Promise<string> {
    const tx = this.cacheTxs.get(txId);
    let hex = "";
    if (tx) {
      hex = tx.toHex();
    }
    if (!hex) {
      hex = this.broadcastedTxs.get(txId) || "";
    }
    return Promise.resolve(hex);
  }

  getConfirmations(txId: string): Promise<number> {
    throw new Error("Method not implemented.");
  }

  getFeeRate(): Promise<number> {
    return Promise.resolve(this.feeRate);
  }

  async getUtxos(
    address: string,
    options?: UtxoQueryOptions
  ): Promise<ExtUtxo[]> {
    return Array.from(this.newUTXOs.values())
      .filter((utxo) => this.isUnSpent(utxo.txId, utxo.outputIndex))
      .sort((a, b) => a.satoshis - b.satoshis);
  }

  private isUnSpent(txId: string, vout: number) {
    const key = `${txId}:${vout}`;
    return !this.spentUTXOs.has(key);
  }

  markSpent(txId: string, vout: number) {
    const key = `${txId}:${vout}`;
    if (this.newUTXOs.has(key)) {
      this.newUTXOs.delete(key);
    }
    this.spentUTXOs.add(key);
  }

  addNewUTXO(utxo: UTXO): void {
    this.newUTXOs.set(getUtxoKey(utxo), utxo);
  }
}
