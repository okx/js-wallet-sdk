# @okxweb3/coin-ethereum
Ethereum SDK is used to interact with the Ethereum blockchain or Evm blockchains, it contains various functions can be used to web3 wallet.

## Installation

### Npm

To obtain the latest version, simply require the project using npm :

```shell
npm install @okxweb3/coin-ethereum
```

## Usage

### Generate Private Key

```typescript
import { EthWallet } from "@okxweb3/coin-ethereum"

let wallet = new EthWallet();
// get random key
let randomPrivateKey = await wallet.getRandomPrivateKey();

// get derived key
let params = {
    mnemonic: "stool trumpet fame umbrella bench provide battle toward story fruit lock view",
    chainPath: "m/44'/60'/0'/0/1"
}
let derivePrivateKey = await wallet.getDerivedPrivateKey(params);
```

### Private Key Derivation

```typescript
import { EthWallet } from "@okxweb3/coin-ethereum"

let wallet = new EthWallet();
let mnemonic = "stool trumpet fame umbrella bench provide battle toward story fruit lock view"
let param = {
  mnemonic: mnemonic,
  hdPath: "m/44'/60'/0'/0/0"
};

let privateKey = await wallet.getDerivedPrivateKey(param)
```

### Generate Address

```typescript
import { EthWallet } from "@okxweb3/coin-ethereum"

let wallet = new EthWallet();
let params = {
    privateKey: '0x9fe340274262b4a3bec88e107b09f784d5f8c27bfe6ff178019ed25130a750e1'
}
let newAddress = await wallet.getNewAddress(params);
```

### Verify Address

```typescript
import { EthWallet } from "@okxweb3/coin-ethereum"

let wallet = new EthWallet();
let params = {
    address: "0x01560cd3bac62cc6d7e6380600d9317363400896"
};
let valid = await wallet.validAddress(60, params);
```

### Sending a Transaction
Use the signTransaction function to get the signed hex to broadcast
#### Example

```javascript
import { EthWallet } from "@okxweb3/coin-ethereum"

let wallet = new EthWallet();
let signParams = {
    privateKey: '0x49c0722d56d6bac802bdf5c480a17c870d1d18bc4355d8344aa05390eb778280',
    data: {
        to: "0xee7c7f76795cd0cab3885fee6f2c50def89f48a3",
        value: new BigNumber(0),
        nonce: 5,
        gasPrice: new BigNumber(100 * 1000000000),
        gasLimit: new BigNumber(21000),
        chainId: 42
    }
}
let tx = await wallet.signTransaction(60, signParams)
```

#### Input Params

```typescript
export type EthTxParams ={
  from?: string,
  to?: string,
  value: BigNumber,
  nonce: number,

  contractAddress?: string   // contract address
  gasPrice?: BigNumber,
  gasLimit: BigNumber,

  data?: string;
  chainId?: number;  // default: 1

  // Typed-Transaction features
  // null, 1:legacy transaction, 2:eip1559 transaction
  type?: number | null;

  // EIP-2930; Type 1 & EIP-1559; Type 2
  //   accessList?: AccessListish;

  // EIP-1559; Type 2
  maxPriorityFeePerGas?: BigNumber;
  maxFeePerGas?: BigNumber;
}
```

#### Support Transaction Types Params

##### Native Coin Transfer

```json
{
  "to": "0xee7c7f76795cd0cab3885fee6f2c50def89f48a3",
  "value": "0x1",
  "nonce": "0x1",
  "gasPrice": "0x1",
  "gasLimit": "0x5208",
  "chainId": "0x2a"
}
```

| Name               | Type                | Description                                                        |
|:-------------------|:--------------------|:-------------------------------------------------------------------|
| `gasLimit`         | `string`            | The transaction's gas limit.                                       |
| `gasPrice`         | `string`            | The transaction's gas price.                                       |
| `nonce`            | `string`            | The transaction's nonce.                                           |
| `to`               | `string`            | The transaction's the address is sent to.                          |
| `value`            | `string`            | The amount of Ether sent.                                          |
| `chainId`          | `string`            | The id number of the chain, default value is 1, means eth mainnet. |


##### Token Transfer

```json
{
  "contractAddress": "0x45Ef35936F0EB8F588Eb9C851C5B1C42B22e61EC",
  "to": "0xee7c7f76795cd0cab3885fee6f2c50def89f48a3",
  "value": "0x1",
  "nonce": "0x8",
  "gasPrice": "0x174876e800",
  "gasLimit": "0x5208",
  "chainId": "0x2a"
}
```

| Name               | Type        | Description                                                        |
|:-------------------|:------------|:-------------------------------------------------------------------|
| `contractAddress`  | `string`    | The address of a contract.                                         |
| `gasLimit`         | `string`    | The transaction's gas limit.                                       |
| `gasPrice`         | `string`    | The transaction's gas price.                                       |
| `nonce`            | `string`    | The transaction's nonce.                                           |
| `to`               | `string`    | The transaction's the address is sent to.                          |
| `value`            | `string`    | The amount of Ether sent.                                          |
| `chainId`          | `string`    | The id number of the chain, default value is 1, means eth mainnet. |

##### Data

```json
{
  "to": "0xee7c7f76795cd0cab3885fee6f2c50def89f48a3",
  "value": "0x0",
  "nonce": "0x5",
  "gasPrice": "0x174876e800",
  "gasLimit": "0x5208",
  "chainId": "0x2a",
  "data": "0xa9059cbb000000000000000000000000ee7c7f76795cd0cab3885fee6f2c50def89f48a30000000000000000000000000000000000000000000000000000000000002710"
}
```

| Name              | Type                 | Description                                                        |
|:------------------|:---------------------|:-------------------------------------------------------------------|
| `gasLimit`        | `string`             | The transaction's gas limit.                                       |
| `gasPrice`        | `string`             | The transaction's gas price.                                       |
| `nonce`           | `string`             | The transaction's nonce.                                           |
| `to`              | `string`             | The transaction's the address is sent to.                          |
| `value`           | `string`             | The amount of Ether sent.                                          |
| `chainId`         | `string`             | The id number of the chain, default value is 1, means eth mainnet. |
| `data`            | `string`             | The data of contract interface.                                    |


##### EIP-1559 Transaction

```json
{
    "gasPrice": "0xa5c681d00",
    "gasLimit": "0xa410",
    "to": "0x35b2438d33c7dc449ae9ffbda14f56dc39a4c6b8",
    "value": "0xde0b6b3a7640000",
    "nonce": "0xb",
    "maxFeePerGas": "0x826299e00",
    "maxPriorityFeePerGas": "0x77359400",
    "chainId": "0x1",
    "type": 2
}
```

| Name                   | Type     | Description                                                        |
|:-----------------------|:---------|:-------------------------------------------------------------------|
| `gasLimit`             | `string` | The transaction's gas limit.                                       |
| `gasPrice`             | `string` | The transaction's gas price.                                       |
| `nonce`                | `string` | The transaction's nonce.                                           |
| `to`                   | `string` | The transaction's the address is sent to.                          |
| `value`                | `string` | The amount of Ether sent.                                          |
| `chainId`              | `string` | The id number of the chain, default value is 1, means eth mainnet. |
| `data`                 | `string` | The data of contract interface.                                    |
| `maxFeePerGas`         | `string` | The transaction's maxFeePerGas.                                    |
| `maxPriorityFeePerGas` | `string` | The transaction's maxPriorityFeePerGas, means miner tips.          |
| `type`                 | `number` | must be 2, means eip1559 transaction fee                           |


#### Sign Message

**Different transaction types enum values**
```typescript
enum MessageTypes {
    ETH_SIGN = 0,
    PERSONAL_SIGN = 1,
    TYPE_DATA_V1 = 2,
    TYPE_DATA_V3 = 3,
    TYPE_DATA_V4 = 4,
}
```

##### ETH_SIGN
```typescript
let signParams: SignTxParams = {
  privateKey: privateKey,
  data:  {
    type: MessageTypes.ETH_SIGN,
    message: Buffer.from(ethUtil.stripHexPrefix("0x879a053d4800c6354e76c7985a865d2922c82fb5b3f4577b2fe08b998954f2e0"), "hex")
  }
}
```

##### PERSONAL_SIGN
```typescript
let signParams: SignTxParams = {
  privateKey: privateKey,
  data: {
    type: MessageTypes.PERSONAL_SIGN,
    message: "Example `personal_sign` message"
  }
};
```

##### TYPE_DATA_V1
```typescript
let param = {
  privateKey: '0x49c0722d56d6bac802bdf5c480a17c870d1d18bc4355d8344aa05390eb778280',
  data: {
    type: 2,
    message: '[{"type":"string","name":"Message","value":"Hi, Alice!"},{"type":"uint32","name":"A number","value":"1337"}]'
  }
}
```

##### TYPE_DATA_V3
```typescript
let param = {
  privateKey: '0x49c0722d56d6bac802bdf5c480a17c870d1d18bc4355d8344aa05390eb778280',
  data: {
    type: 3,
    message: '{"types":{"EIP712Domain":[{"name":"name","type":"string"},{"name":"version","type":"string"},{"name":"chainId","type":"uint256"},{"name":"verifyingContract","type":"address"}],"Person":[{"name":"name","type":"string"},{"name":"wallet","type":"address"}],"Mail":[{"name":"from","type":"Person"},{"name":"to","type":"Person"},{"name":"contents","type":"string"}]},"primaryType":"Mail","domain":{"name":"Ether Mail","version":"1","chainId":42,"verifyingContract":"0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC"},"message":{"from":{"name":"Cow","wallet":"0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826"},"to":{"name":"Bob","wallet":"0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB"},"contents":"Hello, Bob!"}}'
  }
}
```

##### TYPE_DATA_V4
```typescript
let param = {
  privateKey: '0x49c0722d56d6bac802bdf5c480a17c870d1d18bc4355d8344aa05390eb778280',
  data: {
    type: 4,
    message: '{"domain":{"chainId":"42","name":"Ether Mail","verifyingContract":"0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC","version":"1"},"message":{"contents":"Hello, Bob!","from":{"name":"Cow","wallets":["0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826","0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF"]},"to":[{"name":"Bob","wallets":["0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB","0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57","0xB0B0b0b0b0b0B000000000000000000000000000"]}]},"primaryType":"Mail","types":{"EIP712Domain":[{"name":"name","type":"string"},{"name":"version","type":"string"},{"name":"chainId","type":"uint256"},{"name":"verifyingContract","type":"address"}],"Group":[{"name":"name","type":"string"},{"name":"members","type":"Person[]"}],"Mail":[{"name":"from","type":"Person"},{"name":"to","type":"Person[]"},{"name":"contents","type":"string"}],"Person":[{"name":"name","type":"string"},{"name":"wallets","type":"address[]"}]}}'
  }
}
```

#### Signing with a hardware wallet

##### Build raw transaction
```typescript
import { EthWallet } from "@okxweb3/coin-ethereum"

let wallet = new EthWallet();
let ethTxParams = {
    to: "0xee7c7f76795cd0cab3885fee6f2c50def89f48a3",
    value: 1,
    nonce: 5,
    gasPrice: "100000000000",
    gasLimit: 21000,
    chainId: 42,
};

let signParams = {
    data: ethTxParams
};
const rawTx = await wallet.getHardWareRawTransaction(signParams);
console.info(rawTx);
```

**input param**

```typescript
let param = {
    data: {
        to: "0xee7c7f76795cd0cab3885fee6f2c50def89f48a3",
        value: 1,
        nonce: 5,
        gasPrice: "100000000000",
        gasLimit: 21000,
        chainId: 42,
    }
}
```


##### Build signed transaction

```typescript
import { EthWallet } from "@okxweb3/coin-ethereum"

let wallet = new EthWallet();
const hardwareRawTransactionParam = {
    raw: rawTx,
    r: r,
    s: s,
    v: v,
}
const signedTx = await wallet.getHardWareSignedTransaction(hardwareRawTransactionParam);
```

## License

[MPL-2.0](<https://tldrlegal.com/license/mozilla-public-license-2.0-(mpl-2)>)
