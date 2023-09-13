# @okxweb3/coin-cosmos
Cosmos SDK is used to interact with the Cosmos blockchain, it contains various functions can be used to web3 wallet.
The SDK not only support Atom, it also supports following chains:
- Atom
- Axelar
- Cronos
- Evmos
- Iris
- Juno
- Kava
- Kujira
- Osmos
- Secret
- Sei
- Stargaze
- Terra

## Getting Started
**Installing Cosmos SDK**
```shell
npm install @okxweb3/coin-cosmos
```

## Using Cosmos SDK

### Supported Functions

```typescript
- getDerivedPath
- getNewAddress
- getAddressByPublicKey
- validAddress
- caclTxHash
- signTransaction
- signMessage
- validSignedTransaction
```

### Get New Address
get new address
```typescript
import { AtomWallet } from "@okxweb3/coin-cosmos";

let wallet = new AtomWallet()
let path = await wallet.getDerivedPath({ index: 0 });
let mnemonic = "save latin you ill print flash dish begin radio fish canyon day";
let param = {
  mnemonic: mnemonic,
  hdPath: path
};

let privateKey = await wallet.getDerivedPrivateKey(param);
let params: NewAddressParams = {
  privateKey: privateKey
};
let address = await wallet.getNewAddress(params);
```
get address by public key
```typescript
import { AtomWallet } from "@okxweb3/coin-cosmos";

let wallet = new AtomWallet()
let param = {
    publicKey: "039c24c03de96d7542934469c7466e504b5d8608c399dddbb4814b1961f8f73a53" 
}
let addr = await wallet.getAddressByPublicKey(param);
```

validate address
```typescript
import {AtomWallet} from "@okxweb3/coin-cosmos";

let wallet = new OsmoWallet()
let prefix = "osmo"
let addr = "osmo1lyjxk4t835yj6u8l2mg6a6t2v9x3nj7ulaljz2"
let ok = wallet.validAddress(addr, prefix)
```

### Sign Transaction
transfer
```typescript
import { AtomWallet } from "@okxweb3/coin-cosmos";

let wallet = new AtomWallet()
const params: SignTxParams = {
  privateKey: "ebc42dae1245fad403bd18f59f7283dc18724d2fc843b61e01224b9789057347",
  data: {
    type: "transfer",
    chainId: "cosmoshub-4",
    sequence: 0,
    accountNumber: 623151,
    feeDemon: "uatom",
    feeAmount: 1000,
    gasLimit: 10000,
    memo: "memo",
    data: {
      fromAddress: "cosmos1jqyc3jw6hxr90hm575a8qvu2frwhe78ry0wmwc",
      toAddress: "cosmos1jun53r4ycc8g2v6tffp4cmxjjhv6y7ntat62wn",
      demon: "uatom",
      amount: 10000
    }
  }
}
let result = await wallet.signTransaction(params);

const validParam = {
  tx: result,
  data: {
    chainId: "cosmoshub-4",
    accountNumber: 623151,
  }
}
const ok = await wallet.validSignedTransaction(validParam);
```

ibc transfer
```typescript
import { AtomWallet } from "@okxweb3/coin-cosmos";

let wallet = new AtomWallet()
const params: SignTxParams = {
  privateKey: "ebc42dae1245fad403bd18f59f7283dc18724d2fc843b61e01224b9789057347",
  data: {
    type: "ibcTransfer",
    chainId: "osmosis-1",
    sequence: 2,
    accountNumber: 584406,
    feeDemon: "uosmo",
    feeAmount: 0,
    gasLimit: 100000,
    memo: "",
    data: {
      fromAddress: "osmo1lyjxk4t835yj6u8l2mg6a6t2v9x3nj7ulaljz2",
      toAddress: "cosmos1rvs5xph4l3px2efynqsthus8p6r4exyr7ckyxv",
      demon: "uosmo",
      amount: 100000,
      sourcePort: "transfer",
      sourceChannel: "channel-0",
      ibcTimeoutTimestamp: 1657611171,
    }
  }
}
let result = await wallet.signTransaction(params);
```

sign message
```typescript
import { AtomWallet } from "@okxweb3/coin-cosmos";

let wallet = new AtomWallet()

// amino
const msg1 = "{\n  \"chain_id\": \"osmosis-1\",\n  \"account_number\": \"584406\",\n  \"sequence\": \"1\",\n  \"fee\": {\n    \"gas\": \"250000\",\n    \"amount\": [\n      {\n        \"denom\": \"uosmo\",\n        \"amount\": \"0\"\n      }\n    ]\n  },\n  \"msgs\": [\n    {\n      \"type\": \"osmosis/gamm/swap-exact-amount-in\",\n      \"value\": {\n        \"sender\": \"osmo1lyjxk4t835yj6u8l2mg6a6t2v9x3nj7ulaljz2\",\n        \"routes\": [\n          {\n            \"poolId\": \"722\",\n            \"tokenOutDenom\": \"ibc/6AE98883D4D5D5FF9E50D7130F1305DA2FFA0C652D1DD9C123657C6B4EB2DF8A\"\n          }\n        ],\n        \"tokenIn\": {\n          \"denom\": \"uosmo\",\n          \"amount\": \"10000\"\n        },\n        \"tokenOutMinAmount\": \"3854154180813018\"\n      }\n    }\n  ],\n  \"memo\": \"\"\n}"
const param1: SignTxParams = {
    privateKey: "ebc42dae1245fad403bd18f59f7283dc18724d2fc843b61e01224b9789057347",
    data: {
        type: "amino",
        data: msg1,
    },
}
let res1 = await wallet.signMessage(param1);

// signDoc
const msg2 = "{\n" +
    "    \"body\":\"0a8c010a1c2f636f736d6f732e62616e6b2e763162657461312e4d736753656e64126c0a2c746572726131786d6b637a6b353978676a687a6777686667386c357467733275667470756a396367617a7234122c746572726131766d39706670683473796639673368667a3239363336636677357770396e36787775743878751a0e0a05756c756e6112053130303030120474657374\",\n" +
    "    \"authInfo\":\"0a500a460a1f2f636f736d6f732e63727970746f2e736563703235366b312e5075624b657912230a210273b82eca7f32a817b97130792f92c0f55faec2ff8a6101296fc49c6b16c61a6112040a020801180412130a0d0a05756c756e6112043230303010a08d06\",\n" +
    "    \"chainId\":\"bombay-12\",\n" +
    "    \"accountNumber\":\"588053\"\n" +
    "}"
const param2: SignTxParams = {
    privateKey: "ebc42dae1245fad403bd18f59f7283dc18724d2fc843b61e01224b9789057347",
    data: {
        type: "signDoc",
        data: msg2,
    },
}
let res2 = await wallet.signMessage(param2);
```

calc tx hash
```typescript
import { AtomWallet } from "@okxweb3/coin-cosmos";

let wallet = new AtomWallet()
let calcTxHashParams = {
  data: "CroBCqwBCiEvY29zbW9zLmJhbmsudjFiZXRhMS5Nc2dNdWx0aVNlbmQShgEKQQotY29zbW9zMTQ0ZnpwZXB1dmRmdHY0dTRyOWtxOHQzNWFwMmNycnV2NHUzdWR6EhAKBXVhdG9tEgcyMDUyODU1EkEKLWNvc21vczFqOHBwN3p2Y3U5ejh2ZDg4Mm0yODRqMjlmbjJkc3poMDVjcXZmORIQCgV1YXRvbRIHMjA1Mjg1NRIJMTAxODkxNjMwEmkKUgpGCh8vY29zbW9zLmNyeXB0by5zZWNwMjU2azEuUHViS2V5EiMKIQMR/Pg4sU7FYEvodBskuXDWdETvNt+tfNgUmDxggoLl/BIECgIIARiezAcSEwoNCgV1YXRvbRIEMTAwMBDAmgwaQK8PXeXVBBf1KPV3zXYHJc/+YcxM1MI5WBQGdGwE8qTnaoQmTnnU/wYetrxBGfulcvYhiFbZ19qlrupUwFkXeRo=",
};

const txHash = await wallet.calcTxHash(calcTxHashParams);
```

## License: Apache-2.0
