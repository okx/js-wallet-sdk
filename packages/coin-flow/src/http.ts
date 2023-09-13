import { Transaction, TransactionSignature } from './model';
import { base } from '@okxweb3/crypto-lib';

export interface HttpTransaction {
  // Base64 encoded content of the Cadence script.
  script: string
  // An array containing arguments each encoded as Base64 passed in the [JSON-Cadence interchange format](https://docs.onflow.org/cadence/json-cadence-spec/).
  arguments: string[]
  reference_block_id: string
  // The limit on the amount of computation a transaction is allowed to preform.
  gas_limit: string
  payer: string
  proposal_key:       HttpProposalKey
  authorizers:        string[]
  payload_signatures: HttpTransactionSignature[]
  envelope_signatures: HttpTransactionSignature[]
}

export interface HttpProposalKey {
  address:        string
  key_index:      string
  sequence_number: string
}

export interface HttpTransactionSignature {
  address:   string
  key_index:  string
  signature: string
}

export function transactionToHTTP(tx: Transaction): string {
  const args: string[] = []
  tx.arguments.forEach((value: Buffer)=>{
    args.push(base.toBase64(value))
  })

  const reference_block_id = base.toHex(tx.reference_block_id)
  const gas_limit = tx.gas_limit.toString()
  const payer = base.toHex(tx.payer)
  const proposal_key: HttpProposalKey = {
    address: base.toHex(tx.proposal_key.address),
    key_index: tx.proposal_key.key_id.toString(),
    sequence_number: tx.proposal_key.sequence_number.toString(),
  }

  const authorizers: string[] = []
  tx.authorizers.forEach((value: Buffer)=>{
    authorizers.push(base.toHex(value))
  })

  const payload_signatures: HttpTransactionSignature[] = []
  tx.payload_signatures.forEach((value: TransactionSignature)=>{
    const httpTransactionSignature: HttpTransactionSignature = {
      address: base.toHex(value.address),
      key_index: value.key_id.toString(),
      signature: base.toBase64(value.signature),
    }
    payload_signatures.push(httpTransactionSignature)
  })

  const envelope_signatures: HttpTransactionSignature[] = []
  tx.envelope_signatures.forEach((value: TransactionSignature)=>{
    const httpTransactionSignature: HttpTransactionSignature = {
      address: base.toHex(value.address),
      key_index: value.key_id.toString(),
      signature: base.toBase64(value.signature),
    }
    envelope_signatures.push(httpTransactionSignature)
  })

  const httpTransaction: HttpTransaction = {
      script:           base.toBase64(tx.script),
      arguments:        args,
      reference_block_id: reference_block_id,
      gas_limit:         gas_limit,
      payer:             payer,
      proposal_key:      proposal_key,
      authorizers:        authorizers,
      payload_signatures:  payload_signatures,
      envelope_signatures: envelope_signatures,
  }
  return JSON.stringify(httpTransaction)
}