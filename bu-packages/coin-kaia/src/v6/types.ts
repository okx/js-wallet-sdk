import { TransactionRequest as EthersTransactionRequest } from "ethers";

export interface TransactionRequest extends EthersTransactionRequest {
  txSignatures?: any[];
  feePayer?: string;
  feePayerSignatures?: any[];
}