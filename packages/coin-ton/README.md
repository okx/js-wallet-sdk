# @okxweb3/coin-ton
TON SDK is used to interact with the TON/Venom blockchain, it contains various functions can be used to web3 wallet.

## Installation

### Npm

To obtain the latest version, simply require the project using npm :

```shell
npm install @okxweb3/coin-ton
```

## Usage

### TON

#### Generate address

```typescript
import { TonWallet } from "@okxweb3/coin-ton";

const wallet = new TonWallet();
const param = {
  privateKey: "fc81e6f42150458f53d8c42551a8ab91978a55d0e22b1fd890b85139086b93f8"
};
const address = await wallet.getNewAddress(param);
```

#### Verify address

```typescript
import { TonWallet } from "@okxweb3/coin-ton";

const wallet = new TonWallet();
const param = {
    address: "EQA3_JIJKDC0qauDUEQe2KjQj1iLwQRtrEREzmfDxbCKw9Kr"
};
const isValid = await wallet.validAddress(param);
```

#### Transfer TON

```typescript
import { TonWallet } from "@okxweb3/coin-ton";

const wallet = new TonWallet();
const param = {
  privateKey: "fc81e6f42150458f53d8c42551a8ab91978a55d0e22b1fd890b85139086b93f8",
  data: {
    to: "EQA3_JIJKDC0qauDUEQe2KjQj1iLwQRtrEREzmfDxbCKw9Kr",
    amount: "10000000",
    seqno: 2,
    memo: "",
  },
};
const tx = await wallet.signTransaction(param);
```

### Venom

#### Generate address

```typescript
import { VenomWallet } from "@okxweb3/coin-ton";

const wallet = new VenomWallet();
const param = {
  privateKey: "fc81e6f42150458f53d8c42551a8ab91978a55d0e22b1fd890b85139086b93f8"
};
const address = await wallet.getNewAddress(param);
```

#### Verify address

```typescript
import { VenomWallet } from "@okxweb3/coin-ton";

const wallet = new VenomWallet();
const param = {
    address: "0:6bef7d76e46fd1f308f0bf0b59f1ca6318aa6d950ea00aecc7d162218acaaa36"
};
const isValid = await wallet.validAddress(param);
```

#### Transfer TON

```typescript
import { VenomWallet } from "@okxweb3/coin-ton";

const wallet = new VenomWallet();
const param = {
  privateKey: "fc81e6f42150458f53d8c42551a8ab91978a55d0e22b1fd890b85139086b93f8",
  data: {
    to: "0:6bef7d76e46fd1f308f0bf0b59f1ca6318aa6d950ea00aecc7d162218acaaa36",
    amount: "10000000",
    seqno: 2,
    memo: "",
    globalId: 1000,
  },
};
const tx = await wallet.signTransaction(param);
```

## License
Most packages or folder are [MIT](<https://github.com/okx/js-wallet-sdk/blob/main/LICENSE>) licensed, see package or folder for the respective license.
