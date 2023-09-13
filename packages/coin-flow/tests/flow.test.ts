import {
  CreateNewAccountTx,
  signTransaction,
  transactionToHTTP,
  CreateTransferTx,
  validateAddress,
  private2Public,
} from '../src';

/*
// send transaction
curl -X POST -H "Content-Type: application/json" -d '{"script":"aW1wb3J0IEZ1bmdpYmxlVG9rZW4gZnJvbSAweDlhMDc2NmQ5M2I2NjA4YjcKaW1wb3J0IEZsb3dUb2tlbiBmcm9tIDB4N2U2MGRmMDQyYTljMDg2OAoKdHJhbnNhY3Rpb24oYW1vdW50OiBVRml4NjQsIHRvOiBBZGRyZXNzKSB7CgogICAgbGV0IHNlbnRWYXVsdDogQEZ1bmdpYmxlVG9rZW4uVmF1bHQKCiAgICBwcmVwYXJlKHNpZ25lcjogQXV0aEFjY291bnQpIHsKCiAgICAgICAgbGV0IHZhdWx0UmVmID0gc2lnbmVyLmJvcnJvdzwmRmxvd1Rva2VuLlZhdWx0Pihmcm9tOiAvc3RvcmFnZS9mbG93VG9rZW5WYXVsdCkKCQkJPz8gcGFuaWMoIkNvdWxkIG5vdCBib3Jyb3cgcmVmZXJlbmNlIHRvIHRoZSBvd25lcidzIFZhdWx0ISIpCgogICAgICAgIHNlbGYuc2VudFZhdWx0IDwtIHZhdWx0UmVmLndpdGhkcmF3KGFtb3VudDogYW1vdW50KQogICAgfQoKICAgIGV4ZWN1dGUgewoKICAgICAgICBsZXQgcmVjZWl2ZXJSZWYgPSAgZ2V0QWNjb3VudCh0bykKICAgICAgICAgICAgLmdldENhcGFiaWxpdHkoL3B1YmxpYy9mbG93VG9rZW5SZWNlaXZlcikKICAgICAgICAgICAgLmJvcnJvdzwme0Z1bmdpYmxlVG9rZW4uUmVjZWl2ZXJ9PigpCgkJCT8/IHBhbmljKCJDb3VsZCBub3QgYm9ycm93IHJlY2VpdmVyIHJlZmVyZW5jZSB0byB0aGUgcmVjaXBpZW50J3MgVmF1bHQiKQoKICAgICAgICByZWNlaXZlclJlZi5kZXBvc2l0KGZyb206IDwtc2VsZi5zZW50VmF1bHQpCiAgICB9Cn0=","arguments":["eyJ0eXBlIjoiVUZpeDY0IiwidmFsdWUiOiIxLjAwMDAwMCJ9","eyJ0eXBlIjoiQWRkcmVzcyIsInZhbHVlIjoiMHg5NWRhOWNmYjZlYjkyZGFmIn0="],"reference_block_id":"5cf95880b48e6cbe5a7f9ec60daa0942910b6b93f45022fbbc1e08a0e1999b38","gas_limit":"9999","payer":"67e94015e6472711","proposal_key":{"address":"67e94015e6472711","key_index":"0","sequence_number":"2"},"authorizers":["67e94015e6472711"],"payload_signatures":[],"envelope_signatures":[{"address":"67e94015e6472711","key_index":"0","signature":"Q7SqQrit2YA1uZtO5GScRijUdFTyzkFrCSyK1uDsXBkWgvRzUwYqS6/FEZBF53u4jn2oE1Z4wRTdYcaQE0wzRw=="}]}' https://rest-testnet.onflow.org/v1/transactions

// get account info
https://rest-testnet.onflow.org/v1/accounts/{address}

// get block info
https://rest-testnet.onflow.org/v1/blocks?height=72603498
 */
describe("flow", () => {
  test('account', async () => {
    const publicKeyHex = 'eb9c46556b51ba101be8392a16fb9a33e78d268c21269b9cdd7091246e16c3200fc74e4a75539ff5f265bd9af84dcc5001615a1a91757df103fcdfdcb0a1c4bc';
    const payer = '0x67e94015e6472711';
    const refBlockId = '5b16b81239e950261b54583ef3cfd3837977ab85a3149d6b75e297b3b7c0ebf2';
    const payerSequenceNumber = 0;
    const gasLimit = 9999;
    const tx = CreateNewAccountTx(publicKeyHex, payer, refBlockId, payerSequenceNumber, gasLimit);

    const signPrivKeyHex = "bdd80f4421968142b3a4a6c27a1d84a3623384d085a04a895f109fd8d49cef0a"
    const signAddr = "0x67e94015e6472711"
    const signed = signTransaction(tx, [], [{id: 0, address: signAddr, private_key: signPrivKeyHex}])
    const httpTx = transactionToHTTP(signed)
    // https://testnet.flowscan.org/transaction/34c06463d99fa00c9b5052dca98716acc27ab39c5947949cf7ae4abe4bb30955/events
    console.info(httpTx)
  });

  test('transfer', async () => {
    const payer = '0x67e94015e6472711';
    const refBlockId = '5cf95880b48e6cbe5a7f9ec60daa0942910b6b93f45022fbbc1e08a0e1999b38';
    const payerSequenceNumber = 2;
    const gasLimit = 9999;
    const amount = "1.000000"
    const toAddr = "0x95da9cfb6eb92daf"

    const tx = CreateTransferTx(amount, toAddr, payer, refBlockId, payerSequenceNumber, gasLimit);

    const signPrivKeyHex = "bdd80f4421968142b3a4a6c27a1d84a3623384d085a04a895f109fd8d49cef0a"
    const signAddr = "0x67e94015e6472711"
    const signed = signTransaction(tx, [], [{id: 0, address: signAddr, private_key: signPrivKeyHex}])
    console.info(signed)

    const httpTx = transactionToHTTP(signed)
    // https://testnet.flowscan.org/transaction/41145cb1b84b2a548a78d417ee0478e5e44cbb040103d2c6da836935a2e6d005/events
    console.info(httpTx)
  });

  test('address', async () => {
    const b = validateAddress("0x95da9cfb6eb92daf")
    console.info(b)

    const b2 = validateAddress("0x95da9cfb6eb92d")
    console.info(b2)

    const b3 = validateAddress("0x95da9cfb6eb92h")
    console.info(b3)

    const b4 = validateAddress("0x95da9cfb6eb92daf454647")
    console.info(b4)

    const pk = private2Public("bdd80f4421968142b3a4a6c27a1d84a3623384d085a04a895f109fd8d49cef0a")
    console.info(pk)
  })
});
