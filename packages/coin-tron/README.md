# @okxweb3/coin-tron
TRX SDK is used to interact with the TRON blockchain, it contains various functions can be used to web3 wallet.

## Getting Started
**Installing TRX SDK**
```shell
npm install @okxweb3/coin-tron
```

## Using TRX SDK
### Supported Functions

```typescript
- getNewAddress
- getAddressByPublicKey
- validAddress
- signTransaction
- signMessage
- verifyMessage
- ecRecover
- calcTxHash
```

### Get New Address
get new address by private key

```typescript
import { TrxWallet } from "@okxweb3/coin-tron";

let wallet = new TrxWallet()
const params: NewAddressParams = {
  privateKey: 'your privateKey'
};
const addr = await wallet.getNewAddress(params);

// validate address
const ok = await wallet.validAddress({ address: addr });
```

get new address by public key
```typescript
import { TrxWallet } from "@okxweb3/coin-tron";

let wallet = new TrxWallet()
let param = { 
    publicKey: "04b1d67bb2ece28f87f0f8e310456b88b60a13f642ec31face7d8ed6268698eaba8403cffcd8fba39f4995eac50b4846ef49d738e06a7ca6d0ae87374b177dc080" 
}
let addr = await wallet.getAddressByPublicKey(param);

// validate address
const ok = await wallet.validAddress({ address: addr });
```

### Transaction
sign transaction

parameter
* `fromAddress` address， TRX token的转出地址
* `refBlockBytes` 引用的区块字节，指向相关的区块。
* `refBlockHash`
* `expiration`
* `timeStamp`
* `toAddress`
* `amount`

```typescript
import { TrxWallet } from "@okxweb3/coin-tron";

let wallet = new TrxWallet()
const latestBlockNumber = new BN(43380069)
const latestBlockHash = base.fromHex("000000000295ed65e60bbc947b30d97a9d89bd5ac030fccc9e227c428fd6ce09")
const refBlockBytes = latestBlockNumber.toBuffer('be', 8)

const timeStamp = Date.parse(new Date().toString())
const params: SignTxParams = {
    privateKey: 'your privateKey',
    data: {
        type: "transfer",
        data: {
            fromAddress: "TGXQHj3fXhEtCmooRgGemCZyHBEQAv6ct8",
            refBlockBytes: base.toHex(refBlockBytes.slice(6,8)),
            refBlockHash: base.toHex(latestBlockHash.slice(8,16)),
            expiration: timeStamp + 3600 * 1000,
            timeStamp: timeStamp,
            toAddress: "TTczxNWoJJ8mZjj9w2eegiSZqTCTfhjd4g",
            amount: "1000000", // 1 TRX = 1000000 sun
        }
    }
};
const signedTx = await wallet.signTransaction(params);

// verify transaction
const param1 = {
    tx: signedTx,
    data: {
        publicKey: "04b1d67bb2ece28f87f0f8e310456b88b60a13f642ec31face7d8ed6268698eaba8403cffcd8fba39f4995eac50b4846ef49d738e06a7ca6d0ae87374b177dc080",
    }
}
const v = await wallet.validSignedTransaction(param1)
```

sign message
```typescript
import { TrxWallet } from "@okxweb3/coin-tron";

let wallet = new TrxWallet()
let message = "hello world";
message = "0x" + Buffer.from(message, "utf8").toString("hex");

const params: SignTxParams = {
    privateKey: "privateKey",
    data: {
        type: "hex",
        message: message
    }
};
const result = await wallet.signMessage(params);
```

calculate tx hash
```typescript
import { TrxWallet } from "@okxweb3/coin-tron";

let wallet = new TrxWallet()
let calcTxHashParams = {
    data: "0a8a010a0221492208da198635d8a6878a40d8f5b6dcc3305a6c081f12680a31747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e54726967676572536d617274436f6e747261637412330a1541e0a8eda2daea867c1d783faf73c8a1ed66cf8150121541955abb8287358c929c7d371a8d034c51426743b81880ade20470bfb1b3dcc330124119365eb67e73485f41c9b29095d445c31948c1d06b95c13d36d5520e289a846b07bfa4b1edbc6845f8858321d595adc913f631b665a2b6ad0840ac14c80bb47300",
};

const txHash = await wallet.calcTxHash(calcTxHashParams);
```

## License: LGPL3
