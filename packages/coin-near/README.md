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

### DApp transfer NEAR 
```typescript
let wallet = new NearWallet();
let param: SignTxParams = {
    privateKey: "ed25519:4yNHZKYxR4bk76CZ3MFQxpMeavbPTJVuGNrPZSBp5nzZTc64w35xmrGggbTWLHM1sUJCN5moESgsZKbDVDCj1234",
    data: {
        blockHash: "EekjoegUYx2iibbWDuUSQENYCvUGkxj2Et1hTonbwBuN",
        type: NearTypes.TransferNear,
        nonce: 1,
        "receiverId": "wrap.testnet",
        "amount": "1000000000000000000",
    }
}
let result = await wallet.signTransaction(param)
console.info(result)
```
### DApp transfer ft token
```typescript
let wallet = new NearWallet();
let param: SignTxParams = {
    privateKey: 'c6a8e5460421b18909798822a56629f0e984b539a06d6020ef7ee7e872d2b391',
    data: {
        blockHash: "EekjoegUYx2iibbWDuUSQENYCvUGkxj2Et1hTonbwBuN",
        type: NearTypes.TransferToken,
        nonce: 1,
        amount: "1000000000000000000",
        receiverId: '316e10e0e93bef0927f4b0bc48849759a42c218b0e81a39ccb8eb15f048b00e8',
        contract: "wrap.near",
        gas: '100000000000000',
        deposit: '1250000000000000000000',
    }
}
let result = await wallet.signTransaction(param)
console.info(result)
```

### Derive Private Key
```typescript
let wallet = new NearWallet()

let mnemonic = "swift choose erupt agree fragile spider glare spawn suit they solid bus";
let param = {
    mnemonic: mnemonic,
    hdPath: await wallet.getDerivedPath({index:0})
};
let privateKey = await wallet.getDerivedPrivateKey(param);
```

### DApp transaction sign
```typescript
  let wallet = new NearWallet();
let param: SignTxParams = {
    privateKey: "ed25519:4yNHZKYxR4bk76CZ3MFQxpMeavbPTJVuGNrPZSBp5nzZTc64w35xmrGggbTWLHM1sUJCN5moESgsZKbDVDCj1234",
    data: {
        blockHash: "EekjoegUYx2iibbWDuUSQENYCvUGkxj2Et1hTonbwBuN",
        type: NearTypes.DAppTx,
        nonce: 1,
        "receiverId": "wrap.testnet",
        "actions": [
            {
                "methodName": "near_deposit",
                "args": {},
                "deposit": "10000000000000000000000",
                "gas":"1",
            }
        ]
    }
}
let result = await wallet.signTransaction(param)
console.info(result)
```
### DApp transactions sign
```typescript
 let wallet = new NearWallet();
        let param: SignTxParams = {
            privateKey: "ed25519:4yNHZKYxR4bk76CZ3MFQxpMeavbPTJVuGNrPZSBp5nzZTc64w35xmrGggbTWLHM1sUJCN5moESgsZKbDVDCj1234",
            data: {
                blockHash: "EekjoegUYx2iibbWDuUSQENYCvUGkxj2Et1hTonbwBuN",
                type: NearTypes.DAppTxs,
                nonce: 1,
                transactions:[{
                    "receiverId": "wrap.testnet",
                    "actions": [
                        {
                            "methodName": "near_deposit",
                            "args": {},
                            "deposit": "10000000000000000000000"
                        }
                    ]
                }]
            }
        }
        let result = await wallet.signTransaction(param)
        console.info(result)
```

### signMessage

```typescript
const message = "log me in";
const nonce = Buffer.from(Array.from(Array(32).keys()));
const recipient = "http://localhost:3000";
const callbackUrl = "http://localhost:1234";

let wallet = new NearWallet()
let privateKey = "";
let res = await wallet.signMessage({
    privateKey: privateKey,
    data: {
        message,
        recipient,
        nonce,
        callbackUrl,
        state: ""
    }
});
```
## License: MIT
