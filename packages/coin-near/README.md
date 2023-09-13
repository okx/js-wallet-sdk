# @okxweb3/coin-near
Near SDK is used to interact with the Near protocol, it contains the main functions you need when interact with Near Ecosystem.

## Getting Started
**Installing Near SDK**
```shell
npm install @okxweb3/coin-near
```

## What Can Near SDK Do

```typescript
- getAddress
- validateAddress
- publicKeyFromSeed
- createTransaction
- transfer
- signTransaction
- fullAccessKey
```

## Using Near SDK

### Get Address / Validate Address
```typescript
const seedHex = 'seed hex'
const addr = getAddress(seedHex)

// validate address
const ok = validateAddress(addr)
```

### Transfer
```typescript
// from, to is account id, not public key
const from = "your_account_id_from.testnet"
const to = "your_account_id_to.testnet"
const seedHex = 'seed hex'
const nonce = 100
// blockHash is from valid blocks within 24 hours
const blockHash = "EekjoegUYx2iibbWDuUSQENYCvUGkxj2Et1hTonbwBuN"

const publicKey = publicKeyFromSeed(seedHex)
const tx = createTransaction(from, publicKey, to, nonce, [], base.fromBase58(blockHash))

const action = transfer(new BN(10).pow(new BN(24)))
tx.actions.push(action)

const [_, signedTx] = await signTransaction(tx, seedHex)
const result = base.toBase64(signedTx.encode())
```

### Create Account
```typescript
// from, to is account id, not public key
const from = "your_account_id_from.testnet"
const to = "your_account_id_to.testnet"
const seedHex = 'seed hex'
const nonce = 100
// blockHash is from valid blocks within 24 hours
const blockHash = "EekjoegUYx2iibbWDuUSQENYCvUGkxj2Et1hTonbwBuN"

const publicKey = publicKeyFromSeed(seedHex)
const tx = createTransaction(from, publicKey, to, nonce, [], base.fromBase58(blockHash))

const seedHex2 = 'seed hex 2'
const publicKey2 = publicKeyFromSeed(seedHex2)

const action = createAccount()
tx.actions.push(action)
const action2 = addKey(publicKey2, fullAccessKey())
tx.actions.push(action2)

const [_, signedTx] = await signTransaction(tx, seedHex)
const result = base.toBase64(signedTx.encode())
```

## License: MIT
