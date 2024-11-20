# @okxweb3/coin-sui
SUI SDK is used to interact with the SUI blockchain, it contains various functions can be used to web3 wallet.

## Installation

### Npm

To obtain the latest version, simply require the project using npm :

```shell
npm install @okxweb3/coin-sui
```

## Usage

### Generate private key

```typescript
import {SuiWallet} from "@okxweb3/coin-sui";

let wallet = new SuiWallet()
let privateKey = await wallet.getRandomPrivateKey();
```

### Private key derivation

```typescript
import {SuiWallet} from "@okxweb3/coin-sui";

let wallet = new SuiWallet()
let param = {
    mnemonic: "street media penalty witness hollow cook nose uniform fury lazy mystery stone ",
    hdPath: "m/44'/784'/0'/0'/0'"
};
let privateKey = await wallet.getDerivedPrivateKey(param);
```


### Generate address

```typescript
import {SuiWallet} from "@okxweb3/coin-sui";

let wallet = new SuiWallet()
let params: NewAddressParams = {
    privateKey: "MQ/Fsgp+UkzF4ITMwDkhVUl9XrEsP/BUseLw9BEVFz4dkFEGZOAzm1y+JdQcUxvzF4yRRJSng5oa+uOMdozpUg=="
};
let address = await wallet.getNewAddress(params);
```

### Verify address
```typescript
import {SuiWallet} from "@okxweb3/coin-sui";

let wallet = new SuiWallet()
let param: ValidAddressParams = {
    address: "0x936accb491f0facaac668baaedcf4d0cfc6da1120b66f77fa6a43af718669973"
};
let valid = await wallet.validAddress(param);
```

### Sign transaction
```typescript
import {SuiWallet} from "@okxweb3/coin-sui";

let wallet = new SuiWallet()
let param = {
    privateKey: base.toBase64(secretKey), 
    data: {
        type:'raw',
        data: base.toBase64("data bytes")
    }
}
 let data = await wallet.signTransaction(param)
```


### Transfer SUI
Input coins with 3 fields objectId,version,digest
```typescript
import {base, signUtil} from '@okxweb3/crypto-lib';
import {SuiWallet} from "@okxweb3/coin-sui";

let wallet = new SuiWallet()
var coins = [{
    digest: "EjsrAaitTHoCxAWuCH5zuEzReSkvPPWst19WA8fxSpyp",
    objectId: "0x359f24668c02f1a1d25abe38e9b01e7c2f05ca86dcefb82ef32938dab2a4214e",
    version: 12
}]
const b64Key = "MQ/Fsgp+UkzF4ITMwDkhVUl9XrEsP/BUseLw9BEVFz4="
const { secretKey } = signUtil.ed25519.fromSeed(base.fromBase64(b64Key))
const d: PaySuiTransaction = { 
    inputCoins: coins,
    recipient: '0x215d3a67d951ebd5b453b440497917b5fac2890fc7f18358322d372e2f13045d',
    amount: 10, 
    gasBudget: 1046,
    gasPrice: 1
}
let param = {
    privateKey: base.toBase64(secretKey), 
    data: {
        type:'paySUI',
        data:d
    }
}
let data = await wallet.signTransaction(param)
```

### Sign the message
note that the message is a string, not the txBytes of the transaction. Do not sign the transaction with this method!!
```typescript
import {SuiWallet} from "@okxweb3/coin-sui";

let wallet = new SuiWallet()
let param = {
    privateKey: base.toBase64(secretKey), 
    data: "im okxer"
}
let data = await wallet.signMessage(param);
```


## License

Current package is [MIT](<https://github.com/okx/js-wallet-sdk/blob/main/LICENSE>) licensed.
