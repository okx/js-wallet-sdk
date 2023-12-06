# @okxweb3/coin-kaspa
Kaspa SDK is used to interact with the Kaspa blockchain, it contains various functions can be used to web3 wallet.

## Installation

### Npm

To obtain the latest version, simply require the project using npm :

```shell
npm install @okxweb3/coin-kaspa
```

## Usage

### Derive privateKey

```typescript
import { KaspaWallet } from "@okxweb3/coin-kaspa";

let wallet = new KaspaWallet();
let p: DerivePriKeyParams = {
    mnemonic: "reopen vivid parent want raw main filter rotate earth true fossil dream",
    hdPath: "m/44'/111111'/0'/0/0",
};
let privateKey = await wallet.getDerivedPrivateKey(p);
```

### New address

```typescript
import { KaspaWallet } from "@okxweb3/coin-kaspa";

let wallet = new KaspaWallet();
let p: NewAddressParams = {
    privateKey: "d636a23d4f49fe4e0d59fcf7a6c2ab3846ff2d3a54007b3817a11dff770d06ff"
};
let address = await wallet.getNewAddress(p);
```

### Verify address

```typescript
import { KaspaWallet } from "@okxweb3/coin-kaspa";

let wallet = new KaspaWallet();
let p: ValidAddressParams = {
    address: "kaspa:qrcnkrtrjptghtrntvyqkqafj06f9tamn0pnqvelmt2vmz68yp4gqj5lnal2h"
};
let valid = await wallet.validAddress(p);
```

### Transfer

```typescript
import { KaspaWallet } from "@okxweb3/coin-kaspa";

let wallet = new KaspaWallet();
let p: SignTxParams = {
    data: {
        inputs: [
            {
                txId: "ec62c785badb0ee693435841d35bd05da9c8a40aa2d568dddb0dd47410e7e78a",
                vOut: 1,
                address: "kaspa:qqpet37fwqlql7q4jczr7zj7qp5ylps2r2c0ynz6jjf368sdjnztufeghvc9x",
                amount: 597700,
            },
        ],
        outputs: [
            {
                address: "kaspa:qqpet37fwqlql7q4jczr7zj7qp5ylps2r2c0ynz6jjf368sdjnztufeghvc9x",
                amount: 587700,
            },
        ],
        address: "kaspa:qqpet37fwqlql7q4jczr7zj7qp5ylps2r2c0ynz6jjf368sdjnztufeghvc9x",
        fee: 10000,
    },
    privateKey: "d636a23d4f49fe4e0d59fcf7a6c2ab3846ff2d3a54007b3817a11dff770d06ff",
};
let tx = await wallet.signTransaction(p);
```

### Calculate txId

```typescript
import { KaspaWallet } from "@okxweb3/coin-kaspa";

let wallet = new KaspaWallet();
let p: CalcTxHashParams = {
    data: {"transaction":{"version":0,"inputs":[{"previousOutpoint":{"transactionId":"ec62c785badb0ee693435841d35bd05da9c8a40aa2d568dddb0dd47410e7e78a","index":1},"signatureScript":"411687d956de8e3cc53b9dbf20ede3922b422595abbad31ecf38ff90c0cf8ef7c3b5ae71628e041a3a0f1b9ad6e14bb6d49dd7c35f06c46316b67c10d477c29ac001","sequence":0,"sigOpCount":1}],"outputs":[{"scriptPublicKey":{"version":0,"scriptPublicKey":"200395c7c9703e0ff81596043f0a5e00684f860a1ab0f24c5a94931d1e0d94c4beac"},"amount":587700}],"lockTime":0,"subnetworkId":"0000000000000000000000000000000000000000"},"allowOrphan":false},
};
let txId = await wallet.calcTxHash(p);
```

### Sign message

```typescript
import { KaspaWallet } from "@okxweb3/coin-kaspa";

let wallet = new KaspaWallet();
let p: SignTxParams = {
    data: {
        message: "Hello Kaspa!",
    },
    privateKey: "d636a23d4f49fe4e0d59fcf7a6c2ab3846ff2d3a54007b3817a11dff770d06ff",
};
let sig = await wallet.signMessage(p);
```

## License
Most packages or folder are [MIT](<https://github.com/okx/js-wallet-sdk/blob/main/LICENSE>) licensed, see package or folder for the respective license.
