import { TransactionRequest as EthersTransactionRequest } from "ethers6";

export interface TransactionRequest extends EthersTransactionRequest {
  txSignatures?: any[];
  feePayer?: string;
  feePayerSignatures?: any[];
}