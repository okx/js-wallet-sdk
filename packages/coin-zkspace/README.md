# @okxweb3/coin-zkspace
ZKSpace SDK is used to interact with the ZK contract, it contains various functions can be used to web3 wallet. 
The SDK not only support ZKSpace, it also supports ZKSync.

## Getting Started
**Installing ZKSpace SDK**
```shell
npm install @okxweb3/coin-zkspace
```

## What Can ZKSpace SDK Do
```typescript
- getDerivedPrivateKey
- getNewAddress
- validAddress
- signTransaction
```

## Using ZKSpace SDK

### Get Private Key

```typescript
import {ZkspaceWallet} from "@okxweb3/coin-zkspace";

let wallet = new ZkspaceWallet()
let mnemonic = "dolphin pave series garden verb legend senior come symptom north fossil balcony";
let param = {
    mnemonic: mnemonic,
    hdPath: "m/44'/60'/0'/0/0"
};
let privateKey = await wallet.getDerivedPrivateKey(param);
```

### Get New Address / Validate Address
```typescript
import {ZkspaceWallet} from "@okxweb3/coin-zkspace";

let wallet = new ZkspaceWallet()
let params: NewAddressParams = {
  privateKey: 'your privateKey'
};
let addr = await wallet.getNewAddress(params);

let param2: ValidAddressParams = {
    address: addr
};
let valid = await wallet.validAddress(param2);
```

### Sign Transaction
sign change pubkey
```typescript
import {ZkspaceWallet} from "@okxweb3/coin-zkspace";

let wallet = new ZkspaceWallet()
let param: SignTxParams = {
  privateKey: "your private key",
  data: {
      type: 'changePubkey',
      accountId: 2,
      nonce: 1,
      from: '0xad06a98cAC85448Cb33495ca68b0837e3b65ABe6',
      to:'0xad06a98cAC85448Cb33495ca68b0837e3b65ABe6'
  }
};
let tx = await wallet.signTransaction(param);
```

sign transfer
```typescript
import {ZkspaceWallet} from "@okxweb3/coin-zkspace";

let wallet = new ZkspaceWallet()
let param = {
  privateKey: "your private key",
  data: {
      type: 'transfer',
      accountId: 11573,
      nonce: 4,
      from: 0xad06a98cAC85448Cb33495ca68b0837e3b65ABe6,
      chainId: 13,
      to: 0x21dceed765c30b2abea933a161479aea4702e433,
      tokenId: 1,
      tokenSymbol: 'ZKS',
      decimals: 18,
      feeTokenId: 1,
      feeTokenSymbol: 'ZKS',
      feeDecimals: 18,
      amounts: '5000000000000',
      fee: '10000000000000',
  }
};
let tx = await wallet.signTransaction(param);
```

## License: MIT
