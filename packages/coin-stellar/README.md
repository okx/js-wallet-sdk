# @okxweb3/coin-stellar

Stellar SDK is used to interact with the Stellar blockchain and PI blockchains, it contains various functions can be used to web3 wallet.

## Installation

### Npm

To obtain the latest version, simply require the project using npm :

```shell
npm install @okxweb3/coin-stellar
```

## Usage

### Generate Private Key

```typescript
import { StellarWallet } from "@okxweb3/coin-stellar"

let wallet = new StellarWallet();
// get random key
let randomPrivateKey = await wallet.getRandomPrivateKey();
```

### Private Key Derivation

```typescript
import { StellarWallet } from "@okxweb3/coin-stellar"

let wallet = new StellarWallet();
let mnemonic = "stool trumpet fame umbrella bench provide battle toward story fruit lock view"
let param = {
  mnemonic: mnemonic,
  hdPath: "m/44'/148'/0'" //stellar，if PI, please use m/44'/314159'/0' and PIWallet
};

let privateKey = await wallet.getDerivedPrivateKey(param)
```

### Generate Address

```typescript
import { StellarWallet } from "@okxweb3/coin-stellar"

let wallet = new StellarWallet();
let params = {
    privateKey: 'SAGYHCI53Z3QG2TGYUIF24BJEKTZSPSQPQ7OW2WULSSTZXJ426THA4GW'
}
let newAddress = await wallet.getNewAddress(params);
```

### Verify Address

```typescript
import { StellarWallet } from "@okxweb3/coin-stellar"

let wallet = new StellarWallet();
let params = {
    address: "GBL7IXVKK7UKX6YZB5AA3QB5H47SFNM6RNSXT6WNWH6R36NFYHDR5OBA"
};
let valid = await wallet.validAddress({address:addr.address});
```

### Sending a Transaction
Use the signTransaction function to get the signed tx to broadcast
#### Example
1. `createAccount`
```javascript
 let sourceSecret ="SCPVS2UMH4EPBAZPEQXGSC7OMNJTTS5STD7EIDL4OEJW2HYHES7DNUJ4";
let sourceAddress = await wallet.getNewAddress({privateKey:sourceSecret});
console.log(sourceAddress)

let addr = await wallet.getNewAddress({privateKey:"SAGYHCI53Z3QG2TGYUIF24BJEKTZSPSQPQ7OW2WULSSTZXJ426THA4GW"});
addr = await wallet.getNewAddress({privateKey:"SACXX2WZKGFELPK6ZFXUYMWSABVVTPBDUFUB44FEBNG32J45HBSJ5JPW"});
console.log(addr)

let sourceAccount = new Account(sourceAddress.address,"2077119198789642");
let op = Operation.createAccount({
    destination: addr.address,
    startingBalance: "1",
});
let tx = await wallet.signTransaction({
    privateKey:sourceSecret,
    data:{
        source: sourceAccount,
        fee: "100",
        networkPassphrase: Networks.TESTNET,
        operations:[op]
    },
});
console.log(tx)
```

2. `transfer native asset`

```typescript
let wallet = new StellarWallet();
let sourceSecret ="SCPVS2UMH4EPBAZPEQXGSC7OMNJTTS5STD7EIDL4OEJW2HYHES7DNUJ4";
let sourceAddress = await wallet.getNewAddress({privateKey:sourceSecret});
console.log(sourceAddress)

let addr = await wallet.getNewAddress({privateKey:"SAGYHCI53Z3QG2TGYUIF24BJEKTZSPSQPQ7OW2WULSSTZXJ426THA4GW"});
console.log(addr)

let sourceAccount = new Account(sourceAddress.address,"2077119198789635");
let op = Operation.payment({
    destination: addr.address,
    asset: Asset.native(),
    amount: "1",
});
let tx = await wallet.signTransaction({
    privateKey:sourceSecret,
    data:{
        source: sourceAccount,
        fee: "100",
        networkPassphrase: Networks.TESTNET,
        operations:[op],
    },
});
```
3. `create trusline`
```typescript
let wallet = new StellarWallet();
let sourceSecret ="SCPVS2UMH4EPBAZPEQXGSC7OMNJTTS5STD7EIDL4OEJW2HYHES7DNUJ4";
let sourceAddress = await wallet.getNewAddress({privateKey:sourceSecret});
//GBABZSCZ4NRIXUXDPQLLX5PUOEUUTHT5KFF4DS447GRJXDBWA32ZOJFW
console.log("sourceAddress:",sourceAddress)

let userSecret = "SAGYHCI53Z3QG2TGYUIF24BJEKTZSPSQPQ7OW2WULSSTZXJ426THA4GW";
let addr = await wallet.getNewAddress({privateKey:userSecret});
//GBL7IXVKK7UKX6YZB5AA3QB5H47SFNM6RNSXT6WNWH6R36NFYHDR5OBA
console.log("addr:",addr)
let userAccount = new Account(addr.address,"2085700543447040");

let sourceAccount = new Account(sourceAddress.address,"2077119198789637");
const asset = new Asset('USD', sourceAddress.address);

//创建trustline
let op = Operation.changeTrust({
    asset: asset,
    limit: "1000",
});
let tx = await wallet.signTransaction({
    privateKey:userSecret,
    data:{
        source: userAccount,
        fee: "100",
        networkPassphrase: Networks.TESTNET,
        operations:[op],
        memo:Memo.id("1"),
    },
});
console.log("tx:", tx);
```

4. `transfer non-native asset`

```typescript
let wallet = new StellarWallet();
let sourceSecret ="SCPVS2UMH4EPBAZPEQXGSC7OMNJTTS5STD7EIDL4OEJW2HYHES7DNUJ4";
let sourceAddress = await wallet.getNewAddress({privateKey:sourceSecret});

let userSecret = "SAGYHCI53Z3QG2TGYUIF24BJEKTZSPSQPQ7OW2WULSSTZXJ426THA4GW";
let addr = await wallet.getNewAddress({privateKey:userSecret});
let userAccount = new Account(addr.address,"2085700543447040");

let sourceAccount = new Account(sourceAddress.address,"2077119198789637");
const asset = new Asset('USD', sourceAddress.address);

let op = Operation.payment({
    destination:addr.address,
    asset: asset,
    amount: "100",
});
let tx = await wallet.signTransaction({
    privateKey:sourceSecret,
    data:{
        source: sourceAccount,
        fee: "100",
        networkPassphrase: Networks.TESTNET,
        operations:[op],
        memo:Memo.id("1"),
    },
});
```

#### Input Params

```typescript
export type StellarTxParam = {
    source: string, // sourceAccount address
    operations: [], // createAccount, Payment, PathPayment...
    fee: string; //basefee,1000000
    memo?: Memo; 
    networkPassphrase?: string;
    timebounds?: { //time limit,  
        minTime?: Date | number | string; 
        maxTime?: Date | number | string;
    };
    ledgerbounds?: {
        minLedger?: number;
        maxLedger?: number;
    };
    minAccountSequence?: string;
    minAccountSequenceAge?: number;
    minAccountSequenceLedgerGap?: number;
    extraSigners?: string[];
}
```

## License

[MPL-2.0](<https://tldrlegal.com/license/mozilla-public-license-2.0-(mpl-2)>)
