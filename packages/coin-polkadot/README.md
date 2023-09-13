# @okxweb3/coin-polkadot
Polkadot SDK is used to interact with the Polkadot blockchain, it contains the main functions you need when interact with Polkadot Ecosystem.

# Getting Started
**Installing Polkadot SDK**
```shell
npm install @okxweb3/coin-polkadot
```

# What Can Polkadot SDK Do

```typescript
- getAddress
- validateAddress
- SignTx
```

# Using Polkadot SDK
### Get Address / Validate Address
```typescript
const seed = "e7cfd179d6537a676cb94bac3b5c5c9cb1550e846ac4541040d077dfbac2e7fd"
const address = getNewAddress(seed, NetWork.polkadot)
// validate
const ok = validateAddress(address, NetWork.polkadot)
```
### Transfer
```typescript
const from = "12VS5aVsZp3qywuC6wjkhAJdkfNp2SC1WPNfoMFevpovCsxr"
const to = "12VS5aVsZp3qywuC6wjkhAJdkfNp2SC1WPNfoMFevpovCsxr"
const tx = {
    From:         from,
    To:           to,
    Amount:       new BN(10000000000),
    Nonce:        new BN(18),
    Tip:          new BN(0),
    BlockHeight:  new BN(10672081),
    BlockHash:    "569e9705bdcd3cf15edb1378433148d437f585a21ad0e2691f0d8c0083021580",
    GenesisHash:  "91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3",
    SpecVersion:  9220,
    TxVersion:    12,
    ModuleMethod: "0500",
    Version:      "84",
}

const privateKey = "e7cfd179d6537a676cb94bac3b5c5c9cb1550e846ac4541040d077dfbac2e7fd"
const b = SignTx(tx, TxType.Transfer, privateKey)
```

# License: MIT
