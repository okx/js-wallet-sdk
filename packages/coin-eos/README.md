# @okxweb3/coin-eos
EOS SDK is used to interact with the EOS blockchain, it contains various functions can be used to web3 wallet.
The SDK not only support EOS, it also supports WAX.

## Getting Started
**Installing EOS SDK**
```shell
npm install @okxweb3/coin-eos 
```

## Using EOS SDK
### Supported Functions

```typescript
- getRandomPrivateKey
- getDerivedPrivateKey
- getNewAddress
- validAddress
- signTransaction
- calcTxHash
```

### Get Private Key
get random private key

```typescript
import { WaxWallet } from "@okxweb3/coin-eos";

let wallet = new WaxWallet()
let privateKey = await wallet.getRandomPrivateKey();
```

get derived private key
```typescript
import { WaxWallet } from "@okxweb3/coin-eos";

let wallet = new WaxWallet()
let mnemonic = "stool trumpet fame umbrella bench provide battle toward story fruit lock view";
let params = {
    mnemonic: mnemonic,
    hdPath: "m/44'/14001'/0'/0/0"
};
let privateKey = await wallet.getDerivedPrivateKey(params);
```

### Get New Address
get new address by private key
```typescript
import { WaxWallet } from "@okxweb3/coin-eos";

let wallet = new WaxWallet()
let params = {
    privateKey: "5KXHUFNZGMsNEFzzrCis1RJdtg5wjL941a1vAwAjmgHEektrZBj",
};
let address = await wallet.getNewAddress(params);
```

### Sign Transaction
create account
```typescript
import { WaxWallet } from "@okxweb3/coin-eos";

let wallet = new WaxWallet()
const txParams = {
    privateKey: "5KXHUFNZGMsNEFzzrCis1RJdtg5wjL941a1vAwAjmgHEektrZBj",
    data: {
        type: 1, // create account
        creator: 'account1',
        newAccount: 'account2',
        pubKey: 'EOS6BwnQcbjLG2eKxjWTzFHkFvmRqo89SBwLa6fRDBoV7zvrS5JhV',
        buyRam: {
            payer: account1,
            receiver: account2,
            quantity: 100000000,
        },
        delegate: {
            from: 'account1',
            receiver: 'account2',
            stakeNet: 100000000,
            stakeCPU: 100000000,
            transfer: false,
        },
        common: {
            chainId: "f16b1833c747c43682f4386fca9cbb327929334a762755ebec17f6f23c9b8a12",
            compression: true,
            refBlockNumber: 161086853,
            refBlockId: "0999fd853cc7e589c975e2555f4245de6bdf6ca5c9edba265ca2d599139b04c4",
            refBlockTimestamp: "2022-06-28T13:40:34.000",
            expireSeconds: 600,
        },
    },
};
const tx = await wallet.signTransaction(txParams);
```

transfer token
```typescript
import { WaxWallet } from "@okxweb3/coin-eos";

let wallet = new WaxWallet()
const txParams = {
    privateKey: "5KXHUFNZGMsNEFzzrCis1RJdtg5wjL941a1vAwAjmgHEektrZBj",
    data: {
        type: 0,
        from: "zhangqi12345",
        to: "zhangqi11111",
        amount: 500000000,
        precision: 8,
        symbol: "WAX",
        memo: "",
        common: {
            chainId: "f16b1833c747c43682f4386fca9cbb327929334a762755ebec17f6f23c9b8a12",
            compression: true,
            refBlockNumber: 228018259,
            refBlockId: "0d9748537bf819372d2d8ea7776b8cbba8ec3ac05224b53183aa736603ef149f",
            refBlockTimestamp: "2023-07-21T00:07:12.500",
            expireSeconds: 600
        },
    },
};
const tx = await wallet.signTransaction(txParams);
```

calc tx hash
```typescript
import { WaxWallet } from "@okxweb3/coin-eos";

let wallet = new WaxWallet()
const calcTxHashParams = {
    data: `{"signatures":["SIG_K1_JwRt4jC3VNUyuaQ968a1djvWciSSuK4yaEHxYphXmrSBjVgXZHk2GYPtpCdN91kikatp4dmEG3Rg3WutxF18xeuYPFpfsc"],"compression":true,"packed_context_free_data":"78DA030000000001","packed_trx":"78DAEB3CB73325D84357B76F39031030322C6B32617E65100A6487EBDA9C3DCB187042E060A499EF6F90EC8AB746468A300101270E8844EA5959902447B86304031800006F59189C"}`,
};

const txId = await wallet.calcTxHash(calcTxHashParams);
```

## License: MIT

