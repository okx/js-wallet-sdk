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

`signTransaction` 参数定义如下
* `type`  trsanction type, support "transfer" | "tokenTransfer" | "mplTransfer"
    * `transfer` 表示转账SOL token
    * `tokenTransfer` 表示转账 spl token类似于 ERC20协议的token
    * `mplTransfer` 表示nft token的转账
* `payer` address, 表示交易手续费的支付地址
* `blockHash`, 长度为32的字节数组，表示最近的区块hash
* `from` address, 表示SOL token的转出地址
* `to` address,表示SOL token的转入地址
* `amount` number, 表示要转账的SOL token的数量，SOL token精度是8
* `mint` address, 表示token地址
* `createAssociatedAddress` boolean, 表示是否需要创建ata地址，
* `version` number， 交易version
* `tokenStandard` TokenStandard,表示交易的标准，有以下五种取值
    * NonFungible, 
    * FungibleAsset, 
    * Fungible, 
    * NonFungibleEdition, 
    * ProgrammableNonFungible,
* `token2022` boolean, true表示 token2022标准的spl token, false表示spl token标准的token
* `decimal` number, 表示token2022标准的spl token的精度，当转账该标准的token的时候需要该字段。
* `computeUnitLimit` 表示交易中每个指令可以消耗的计算单位的数量
* `computeUnitPrice` 表示每个计算单元的价格
* `needPriorityFee` boolean，和`computeUnitLimit`，`computeUnitPrice`一起使用，手动设置交易的手续费参数。


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

let wallet = new SolWallet()
let param = {
    privateKey: "548yT115QRHH7Mpchg9JJ8YPX9RTKuan7oeB9ruMULDGhdqBmG18RBSv54Fpv2BvrC1yVpGdjzAPKHNYUwPBePKc", 
    data: 'your message to sign'
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
