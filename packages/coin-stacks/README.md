# @okxweb3/coin-stacks
Stacks SDK is used to interact with the Stacks blockchain, it contains various functions can be used to web3 wallet.

## Installation

### Npm

To obtain the latest version, simply require the project using npm :

```shell
npm install @okxweb3/coin-stacks
```

## Usage

### Generate private key

```typescript
import {StxWallet} from "@okxweb3/coin-stacks";

let wallet = new StxWallet()
// private key
let privateKey = await wallet.getRandomPrivateKey();

// address
let params: NewAddressParams = {
    privateKey: privateKey
};
let address = await wallet.getNewAddress(params);
```

### Private key derivation

```typescript
import {StxWallet} from "@okxweb3/coin-stacks";

let wallet = new StxWallet()
let param = {
    mnemonic: `gaze supreme human audit aisle entry galaxy shy lock time such auto`,
    hdPath: "m/44'/5757'/0'/0/0"
};
let privateKey = await wallet.getDerivedPrivateKey(param);
```

### Generate address

```typescript
import {StxWallet} from "@okxweb3/coin-stacks";

let wallet = new StxWallet()
let params: NewAddressParams = {
     privateKey: "33c4ad314d494632a36c27f9ac819e8d2986c0e26ad63052879f631a417c8adf"
};
let address = await wallet.getNewAddress(params);
```

### Verify address
```typescript
import {StxWallet} from "@okxweb3/coin-stacks";

let wallet = new StxWallet()
let param = {
    address: "SP1BJMEXW9J908SGBCNWQXKCHRGC4H4YYAE0EAVDW"
} 
const ok = await wallet.validAddress(param)
```

### Transfer Stx
```typescript
import {StxWallet} from "@okxweb3/coin-stacks";

let wallet = new StxWallet()
const secretKey = '//your private key';
const to = 'SP2P58SJY1XH6GX4W3YGEPZ2058DD3JHBPJ8W843Q';
const amount = 3000;
const memo = '20';
const nonce = 56;
const fee = 300;
let params: SignTxParams = {
    privateKey: secretKey,
    data: {
        type: 'transfer',
        data: {
            to: to,
            amount: amount,
            memo: memo,
            nonce: nonce,
            fee: fee,
        }
    },
}
const tx = await wallet.signTransaction(params);
```

### Transfer token
```typescript
import {StxWallet} from "@okxweb3/coin-stacks";

let wallet = new StxWallet()
const key = "33c4ad314d494632a36c27f9ac819e8d2986c0e26ad63052879f631a417c8adf";
const from = "SP2XYBM8MD5T50WAMQ86E8HKR85BAEKBECNE1HHVY";
const to = "SP3HXJJMJQ06GNAZ8XWDN1QM48JEDC6PP6W3YZPZJ";
const memo = "110317";
const contract = "SP466FNC0P7JWTNM2R9T199QRZN1MYEDTAR0KP27";
const contract_name = "miamicoin-token";
const function_name = "transfer";
const token_name = "miamicoin";

const amount = 21;
const nonce = 21;
const fee = 200000;
let params: SignTxParams = {
    privateKey: key,
    data: {
        type: 'tokenTransfer',
        data: {
            from: from,
            to: to,
            memo: memo,
            contract: contract,
            contractName: contract_name,
            functionName: function_name,
            tokenName: token_name,
            amount: amount,
            nonce: nonce,
            fee: fee
        }
    }
}
const tx = await wallet.signTransaction(, params);
```

### Sign message
```typescript
import {StxWallet} from "@okxweb3/coin-stacks";

let wallet = new StxWallet()
const privateKey = "bcf62fdd286f9b30b2c289cce3189dbf3b502dcd955b2dc4f67d18d77f3e73c7"
const param: SignTxParams = {
    privateKey: privateKey,
    data: {
        type: "signMessage",
        message: "Hello World"
    }
}
const sig = await wallet.signMessage(param);
```


## License
Current package is [MIT](<https://github.com/okx/js-wallet-sdk/blob/main/LICENSE>) licensed.
