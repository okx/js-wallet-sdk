import { Transaction } from './model';
import { base } from '@okxweb3/crypto-lib';

const DefaultAccountIndex = 0
const ContractsParam = `{"type":"Dictionary","value":[]}`
const CreateAccountTpl = "import Crypto\n" +
  "\n" +
  "transaction(publicKeys: [Crypto.KeyListEntry], contracts: {String: String}) {\n" +
  "\tprepare(signer: AuthAccount) {\n" +
  "\t\tlet account = AuthAccount(payer: signer)\n" +
  "\n" +
  "\t\t// add all the keys to the account\n" +
  "\t\tfor key in publicKeys {\n" +
  "\t\t\taccount.keys.add(publicKey: key.publicKey, hashAlgorithm: key.hashAlgorithm, weight: key.weight)\n" +
  "\t\t}\n" +
  "\t\t\n" +
  "\t\t// add contracts if provided\n" +
  "\t\tfor contract in contracts.keys {\n" +
  "\t\t\taccount.contracts.add(name: contract, code: contracts[contract]!.decodeHex())\n" +
  "\t\t}\n" +
  "\t}\n" +
  "}\n" +
  " "
const TransferTpl = "import FungibleToken from 0x9a0766d93b6608b7\n" +
  "import FlowToken from 0x7e60df042a9c0868\n" +
  "\n" +
  "transaction(amount: UFix64, to: Address) {\n" +
  "\n" +
  "    let sentVault: @FungibleToken.Vault\n" +
  "\n" +
  "    prepare(signer: AuthAccount) {\n" +
  "\n" +
  "        let vaultRef = signer.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)\n" +
  "\t\t\t?? panic(\"Could not borrow reference to the owner's Vault!\")\n" +
  "\n" +
  "        self.sentVault <- vaultRef.withdraw(amount: amount)\n" +
  "    }\n" +
  "\n" +
  "    execute {\n" +
  "\n" +
  "        let receiverRef =  getAccount(to)\n" +
  "            .getCapability(/public/flowTokenReceiver)\n" +
  "            .borrow<&{FungibleToken.Receiver}>()\n" +
  "\t\t\t?? panic(\"Could not borrow receiver reference to the recipient's Vault\")\n" +
  "\n" +
  "        receiverRef.deposit(from: <-self.sentVault)\n" +
  "    }\n" +
  "}"


function publicKey2Param(key: Buffer): string {
  const vList: any = []
  key.forEach((value: number) => {
    vList.push({"type": "UInt8", "value": "" + value})
  })
  const p = JSON.stringify(vList)
  return `{"type":"Array","value":[{"type":"Struct","value":{"id":"I.Crypto.Crypto.KeyListEntry","fields":[{"name":"keyIndex","value":{"type":"Int","value":"1000"}},{"name":"publicKey","value":{"type":"Struct","value":{"id":"PublicKey","fields":[{"name":"publicKey","value":{"type":"Array","value":${p}}},{"name":"signatureAlgorithm","value":{"type":"Enum","value":{"id":"SignatureAlgorithm","fields":[{"name":"rawValue","value":{"type":"UInt8","value":"1"}}]}}}]}}},{"name":"hashAlgorithm","value":{"type":"Enum","value":{"id":"HashAlgorithm","fields":[{"name":"rawValue","value":{"type":"UInt8","value":"3"}}]}}},{"name":"weight","value":{"type":"UFix64","value":"1000.00000000"}},{"name":"isRevoked","value":{"type":"Bool","value":false}}]}}]}`
}

export function CreateNewAccountTx(publicKeyHex: string, payer: string, referenceBlockIDHex: string, payerSequenceNumber: number, gasLimit: number): Transaction {
  const payerAddress = base.fromHex(payer)
  const pubKeyBytes = base.fromHex(publicKeyHex)
  const pubKeyParam = publicKey2Param(pubKeyBytes)

  return {
    script:           Buffer.from(CreateAccountTpl),
    arguments:        [Buffer.from(pubKeyParam), Buffer.from(ContractsParam)],
    reference_block_id: base.fromHex(referenceBlockIDHex),
    gas_limit:         gasLimit,
    proposal_key: {
      address:         payerAddress,
      key_id:          DefaultAccountIndex,
      sequence_number: payerSequenceNumber,
    },
    payer:              payerAddress,
    authorizers:       [payerAddress],
    payload_signatures:  [],
    envelope_signatures: [],
  }
}

export function CreateTransferTx(amount: string, toAddr: string, payer: string, referenceBlockIDHex: string, payerSequenceNumber: number, gasLimit: number): Transaction {
  const payerAddress = base.fromHex(payer)

  const amountParam = `{"type":"UFix64","value":"${amount}"}`
  const addrParam = `{"type":"Address","value":"${toAddr}"}`

  return {
    script:           Buffer.from(TransferTpl),
    arguments:        [Buffer.from(amountParam), Buffer.from(addrParam)],
    reference_block_id: base.fromHex(referenceBlockIDHex),
    gas_limit:         gasLimit,
    proposal_key: {
      address:         payerAddress,
      key_id:          DefaultAccountIndex,
      sequence_number: payerSequenceNumber,
    },
    payer:              payerAddress,
    authorizers:       [payerAddress],
    payload_signatures:  [],
    envelope_signatures: [],
  }
}

export function CreateTx(script: Buffer, args: Buffer[], payer: string, referenceBlockIDHex: string, payerSequenceNumber: number, gasLimit: number): Transaction {
  const payerAddress = base.fromHex(payer)

  return {
    script:           script,
    arguments:        args,
    reference_block_id: base.fromHex(referenceBlockIDHex),
    gas_limit:         gasLimit,
    proposal_key: {
      address:         payerAddress,
      key_id:          DefaultAccountIndex,
      sequence_number: payerSequenceNumber,
    },
    payer:              payerAddress,
    authorizers:       [payerAddress],
    payload_signatures:  [],
    envelope_signatures: [],
  }
}