# @okxweb3/coin-solana
Solana SDK is used to interact with the Solana Chain, it contains the main functions you need when interact with Solana Ecosystem.

## Getting Started
**Installing Solana SDK**
```shell
npm install @okxweb3/coin-solana
```

## What Can Solana SDK Do

```typescript
- getRandomPrivateKey
- getNewAddress
- validAddress
- caclTxHash
- signTransaction
- signMessage
- validSignedTransaction
```

## Using Solana SDK
### Get Private Key

random private key
```typescript
import {SolWallet} from "@okxweb3/coin-solana";

let wallet = new SolWallet()
let privateKey = await wallet.getRandomPrivateKey();
```
derived private key
```typescript
import {SolWallet} from "@okxweb3/coin-solana";

let wallet = new SolWallet()
let param = {
    mnemonic: 'stool trumpet fame umbrella bench provide battle toward story fruit lock view',
    hdPath: "m/44'/501'/0'/0'"
};
let privateKey = await wallet.getDerivedPrivateKey(param);
```

### Get Address / Validate Address
```typescript
import {SolWallet} from "@okxweb3/coin-solana";

let wallet = new SolWallet()
let params = {
    privateKey: "548yT115QRHH7Mpchg9JJ8YPX9RTKuan7oeB9ruMULDGhdqBmG18RBSv54Fpv2BvrC1yVpGdjzAPKHNYUwPBePKc"
};
let addr = await wallet.getNewAddress(params);
// validate
let addrParam{
    address: addr
};
let valid = await wallet.validAddress(addrParam);
```

### Transaction
transfer
```typescript
import {SolWallet} from "@okxweb3/coin-solana";

let wallet = new SolWallet()
let params = {
    privateKey: '548yT115QRHH7Mpchg9JJ8YPX9RTKuan7oeB9ruMULDGhdqBmG18RBSv54Fpv2BvrC1yVpGdjzAPKHNYUwPBePKc',
    data: {
        type: "transfer",
        payer: "FZNZLT5diWHooSBjcng9qitykwcL9v3RiNrpC3fp9PU1",
        blockHash: "6t1qEvLH5uC9NMmMTPhaE9tAaWdk1qvBjqsKsKNPB7sX",
        from: "FZNZLT5diWHooSBjcng9qitykwcL9v3RiNrpC3fp9PU1",
        to: "7NRmECq1R4tCtXNvmvDAuXmii3vN1J9DRZWhMCuuUnkM",
        amount: 100000000,
        computeUnitLimit: 140000,
        computeUnitPrice: 10
    }
}
let tx = await wallet.signTransaction(params);

// validate signature
const checkParam = {
    tx: tx,
}
const ok = await wallet.validSignedTransaction(checkParam);
```

token transfer
```typescript
import {SolWallet} from "@okxweb3/coin-solana";

let wallet = new SolWallet()
let param = {
    privateKey: '548yT115QRHH7Mpchg9JJ8YPX9RTKuan7oeB9ruMULDGhdqBmG18RBSv54Fpv2BvrC1yVpGdjzAPKHNYUwPBePKc',
    data: {
        type: "tokenTransfer",
        payer: "FZNZLT5diWHooSBjcng9qitykwcL9v3RiNrpC3fp9PU1",
        blockHash: "HwN3QorABLpYftu9FeE1FGrwrBK1aAhhz3cirEVrN3Fn",
        from: "FZNZLT5diWHooSBjcng9qitykwcL9v3RiNrpC3fp9PU1",
        to: "7NRmECq1R4tCtXNvmvDAuXmii3vN1J9DRZWhMCuuUnkM",
        amount: 100000,
        mint: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
        createAssociatedAddress: false,
        token2022: false,
        decimal: 9,
        computeUnitLimit: 140000,
        computeUnitPrice: 10
    }
}
let tx = await wallet.signTransaction(param);

const checkParam = {
    tx: tx,
}
const v = await wallet.validSignedTransaction(checkParam);
```

pNft transfer
```typescript
import {SolWallet} from "@okxweb3/coin-solana";

let wallet = new SolWallet()
let param = {
    privateKey: '548yT115QRHH7Mpchg9JJ8YPX9RTKuan7oeB9ruMULDGhdqBmG18RBSv54Fpv2BvrC1yVpGdjzAPKHNYUwPBePKc', 
    data: {
        type: "mplTransfer",
        payer: "CS8ifB68oddKXdW87RAyrxFSoz1DMMcX9WsWeAgbYDCC",
        blockHash: "8MnQifmv14ELwdkK5NJso9cofN8iNpHy6n6Nnxy7pn8v",
        from: "CS8ifB68oddKXdW87RAyrxFSoz1DMMcX9WsWeAgbYDCC",
        to: "9qinWp4oc3TvBocbwAvYZAZWfSswub2qM49Pn6rkCQ9q",
        mint: "DberpiNB1sttkWdd66amQV5hrnMGacBeDeMbcEFMVBiR",
        computeUnitLimit: 140000,
        computeUnitPrice: 10
    }
}
let tx = await wallet.signTransaction(param);
```

sign message
```typescript
import {SolWallet} from "@okxweb3/coin-solana";
import {base} from "@okxweb3/crypto-lib";

let wallet = new SolWallet()
let param = {
    privateKey: "548yT115QRHH7Mpchg9JJ8YPX9RTKuan7oeB9ruMULDGhdqBmG18RBSv54Fpv2BvrC1yVpGdjzAPKHNYUwPBePKc", 
    data: base.base58.encode(new TextEncoder().encode('your message to sign'))
}
let tx = await wallet.signMessage(param);
```

deserialize message
```typescript
import {SolWallet} from "@okxweb3/coin-solana";

let wallet = new SolWallet()
let param = {
    //privateKey: "548yT115QRHH7Mpchg9JJ8YPX9RTKuan7oeB9ruMULDGhdqBmG18RBSv54Fpv2BvrC1yVpGdjzAPKHNYUwPBePKc", 
    data: ['your message to deserialize']
}
let res = await wallet.deserializeMessages(param);
```


calculate tx hash
```typescript
import {SolWallet} from "@okxweb3/coin-solana";

let wallet = new SolWallet()
let param = {
    data: "your data to sign",
};
const tx = await wallet.calcTxHash(param);
```

## License: MIT
