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

## License
Most packages or folder are [MIT](<https://github.com/okx/js-wallet-sdk/blob/main/LICENSE>) licensed, see package or folder for the respective license.
