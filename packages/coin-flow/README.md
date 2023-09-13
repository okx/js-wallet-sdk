# @okxweb3/coin-flow
Flow SDK is used to interact with the Flow blockchain, it contains various functions can be used to web3 wallet.

## Installation

### Npm

To obtain the latest version, simply require the project using `npm`:

```shell
npm install @okxweb3/coin-flow
```

## Usage


### Verify address
```typescript
const b = validateAddress("0x95da9cfb6eb92daf")
console.info(b)
```

### Create new account transaction
```typescript
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
console.info(httpTx)
```

### Sign transaction
```typescript
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
console.info(httpTx)
```

## License

Current package is [MIT](<https://github.com/okx/js-wallet-sdk/blob/main/LICENSE>) licensed.