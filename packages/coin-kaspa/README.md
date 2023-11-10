# @okxweb3/coin-kaspa
Kaspa SDK is used to interact with the Kaspa blockchain, it contains various functions can be used to web3 wallet.

## Installation

### Npm

To obtain the latest version, simply require the project using npm :

```shell
npm install @okxweb3/coin-kaspa
```

## Usage

### Verify address

```typescript
import { KaspaWallet } from "@okxweb3/coin-kaspa";

let wallet = new KaspaWallet();
let p: ValidAddressParams = {
    address: "kaspa:qrcnkrtrjptghtrntvyqkqafj06f9tamn0pnqvelmt2vmz68yp4gqj5lnal2h"
};
let valid = await wallet.validAddress(p);
```

## License
Most packages or folder are [MIT](<https://github.com/okx/js-wallet-sdk/blob/main/LICENSE>) licensed, see package or folder for the respective license.
