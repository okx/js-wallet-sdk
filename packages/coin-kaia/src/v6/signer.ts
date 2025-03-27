import {
  SigningKey,
  TransactionLike,
  Provider,
  TransactionRequest,
  Wallet as EthersWallet,
  ProgressCallback,
  keccak256,
  assert,
} from "ethers6";
import _ from "lodash";

import {
  HexStr,
  KlaytnTxFactory,
  parseTransaction,
  isKlaytnTxType,
  isFeePayerSigTxType,
  parseTxType,
} from "@kaiachain/js-ext-core";

import { decryptKeystoreList, decryptKeystoreListSync } from "./keystore";
import {
  eip155sign,
  getTransactionRequest,
  populateFrom,
  populateTo,
  populateNonce,
  populateGasLimit,
  populateGasPrice,
  populateChainId,
  populateFeePayerAndSignatures,
} from "./txutil";

export class Wallet extends EthersWallet {
  // Override Wallet factories accepting keystores to support both v3 and v4 (KIP-3) formats
  static override async fromEncryptedJson(
    json: string,
    password: string | Uint8Array,
    progress?: ProgressCallback
  ): Promise<Wallet> {
    const { address, privateKey } = await decryptKeystoreList(
      json,
      password,
      progress
    );
    return new Wallet(address, privateKey);
  }

  static override fromEncryptedJsonSync(
    json: string,
    password: string | Uint8Array
  ): Wallet {
    const { address, privateKey } = decryptKeystoreListSync(json, password);
    return new Wallet(address, privateKey);
  }

  // New Wallet[] factories accepting keystores supporting v4 (KIP-3) format
  static async fromEncryptedJsonList(
    json: string,
    password: string | Uint8Array,
    progress?: ProgressCallback
  ): Promise<Wallet[]> {
    const { address, privateKeyList } = await decryptKeystoreList(
      json,
      password,
      progress
    );
    return _.map(
      privateKeyList,
      (privateKey) => new Wallet(address, privateKey)
    );
  }

  static fromEncryptedJsonListSync(
    json: string,
    password: string | Uint8Array
  ): Wallet[] {
    const { address, privateKeyList } = decryptKeystoreListSync(json, password);
    return _.map(
      privateKeyList,
      (privateKey) => new Wallet(address, privateKey)
    );
  }

  // Decoupled account address. Defined only if specified in constructor.
  private klaytnAddr: string | undefined;

  // new KlaytnWallet(privateKey, provider?) or
  // new KlaytnWallet(address, privateKey, provider?)
  constructor(
    addressOrPrivateKey: string | SigningKey,
    privateKeyOrProvider?: SigningKey | Provider | string,
  ) {
    if (HexStr.isHex(addressOrPrivateKey, 20)) {
      // First argument is an address. new KlaytnWallet(address, privateKey, provider?)
      const _address = HexStr.from(addressOrPrivateKey);
      const _privateKey = privateKeyOrProvider as SigningKey;
      super(_privateKey);
      this.klaytnAddr = _address;
    } else {
      // First argument is a private key. new KlaytnWallet(privateKey, provider?)
      const _privateKey = addressOrPrivateKey as SigningKey;

      super(_privateKey);
    }
  }

  // If the Wallet is created as a decoupled account, and `legacy` is false, returns the decoupled address.
  // Otherwise, returns the address derived from the private key.
  override getAddress(legacy?: boolean): Promise<string> {
    if (legacy || !this.klaytnAddr) {
      return super.getAddress();
    } else {
      return Promise.resolve(this.klaytnAddr);
    }
  }

  // @deprecated in favor of getAddress(true)
  getEtherAddress(): Promise<string> {
    return super.getAddress();
  }

  // @deprecated in favor of parseTransaction
  decodeTxFromRLP(rlp: string): any {
    return parseTransaction(rlp);
  }

  async isDecoupled(): Promise<boolean> {
    if (!this.klaytnAddr) {
      return false;
    } else {
      return (await this.getAddress(false)) == (await this.getAddress(true));
    }
  }

  async populateTransaction(
    transaction: TransactionRequest
  ): Promise<TransactionLike<string>> {
    return this._populateTransaction(transaction, false);
  }

  // If asFeePayer is true, skip the 'from' address check.
  private async _populateTransaction(
    transaction: TransactionRequest,
    asFeePayer: boolean
  ): Promise<TransactionLike<string>> {
    const tx = await getTransactionRequest(transaction);

    // Not a Klaytn TxType; fallback to ethers.Signer.populateTransaction()
    if (!isKlaytnTxType(parseTxType(tx.type))) {
      return super.populateTransaction(tx);
    }
    // If the current Wallet acts as feePayer, then tx.from is unrelated to this.getAddress().
    // Skip the check, and does not fill up here. If tx.from was empty, then an error is generated
    // at signTransaction(), not here.
    if (!asFeePayer) {
      await populateFrom(tx, await this.getAddress());
    }
    await populateTo(tx);
    if (tx.nonce == undefined) {
      throw new Error("invalid nonce")
    }
    if (tx.gasLimit == undefined) {
      throw new Error("invalid gasLimit")
    }
    await populateGasLimit(tx);
    if (tx.gasPrice == undefined) {
      throw new Error("invalid gasPrice")
    }
    await populateGasPrice(tx);
    if (tx.chainId == undefined) {
      throw new Error("invalid chainId")
    }
    await populateChainId(tx);
    return tx;
  }

  // Sign as a sender
  // tx.sigs += Sign(tx.sigRLP(), wallet.privateKey)
  // return tx.txHashRLP() or tx.senderTxHashRLP();
  override async signTransaction(
    transaction: TransactionRequest
  ): Promise<string> {
    const tx = await getTransactionRequest(transaction);

    // Not a Klaytn TxType; fallback to ethers.Wallet.signTransaction()
    if (!isKlaytnTxType(parseTxType(tx.type))) {
      return super.signTransaction(tx);
    }

    // Because RLP-encoded tx may not contain chainId, fill up here.
    await populateChainId(tx);
    const chainId = tx.chainId!; // chainId should have been determined in populateChainId.

    const klaytnTx = KlaytnTxFactory.fromObject(tx);
    const sigHash = keccak256(klaytnTx.sigRLP());
    const sig = eip155sign(
      this.signingKey,
      sigHash,
      Number(chainId.toString())
    );
    klaytnTx.addSenderSig(sig);

    if (isFeePayerSigTxType(klaytnTx.type)) {
      return klaytnTx.senderTxHashRLP();
    } else {
      return klaytnTx.txHashRLP();
    }
  }

  // Sign as a fee payer
  // tx.feepayerSigs += Sign(tx.sigFeePayerRLP(), wallet.privateKey)
  // return tx.txHashRLP();
  async signTransactionAsFeePayer(
    transactionOrRLP: TransactionRequest | string
  ): Promise<string> {
    const tx = await getTransactionRequest(transactionOrRLP);
    // Not a Klaytn FeePayerSig TxType; not supported
    assert(
      isFeePayerSigTxType(parseTxType(tx.type)),
      `signTransactionAsFeePayer not supported for tx type ${tx.type}`,
      "UNSUPPORTED_OPERATION",
      {
        operation: "signTransactionAsFeePayer",
      }
    );
    // Because RLP-encoded tx may contain dummy fee payer fields, fix here.
    await populateFeePayerAndSignatures(tx, await this.getAddress());
    // Because RLP-encoded tx may not contain chainId, fill up here.
    await populateChainId(tx);
    const chainId = tx.chainId!; // chainId should have been determined in populateChainId.

    const klaytnTx = KlaytnTxFactory.fromObject(tx);

    const sigFeePayerHash = keccak256(klaytnTx.sigFeePayerRLP());
    const sig = eip155sign(this.signingKey, sigFeePayerHash, Number(chainId));
    klaytnTx.addFeePayerSig(sig);

    return klaytnTx.txHashRLP();
  }
}