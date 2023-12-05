# @okxweb3/coin-bitcoin
Bitcoin SDK is used to interact with the Bitcoin Mainnet or Testnet, it contains various functions can be used to web3 wallet.
The SDK not only support Bitcoin, it also supports following chains:

- BTC
- BSV
- DOGE
- LTC
- TBTC

## Getting Started
**Installing BitCoin SDK**
```shell
npm install @okxweb3/coin-bitcoin
```

## What Can BitCoin SDK Do
```typescript
- getMnemonic
- getRandomPrivateKey
- getDerivedPrivateKey 
- getNewAddress
- getAddressByPublicKey
- validAddress
- calcTxHash
- signTransaction
- validSignedTransaction 
- signMessage
- verifyMessage
```

## Using BitCoin SDK

### Get Private Key
get random private key
```typescript
import { BtcWallet } from "@okxweb3/coin-bitcoin";

let wallet = new BtcWallet()
let privateKey = await wallet.getRandomPrivateKey();
```
get derived private key
```typescript
import { BtcWallet } from "@okxweb3/coin-bitcoin";

let wallet = new BtcWallet()
let mnemonic = await getMnemonic(128);
let param = {
  mnemonic: mnemonic,
  hdPath: "m/44'/0'/0'/0/0"
};
let privateKey = await wallet.getDerivedPrivateKey(param);
```

### Get New Address
get new address from private key
```typescript
import { BtcWallet } from "@okxweb3/coin-bitcoin";

let wallet = new BtcWallet()

// legacy address
let params: NewAddressParams = {
  privateKey: "L22jGDH5pKE4WHb2m9r2MdiWTtGarDhTYRqMrntsjD5uCq5z9ahY"
};
let address = await wallet.getNewAddress(params);

// native segwit address
let params2: NewAddressParams = {
  privateKey: "L22jGDH5pKE4WHb2m9r2MdiWTtGarDhTYRqMrntsjD5uCq5z9ahY",
  addressType: "segwit_native",
};
let address2 = await wallet.getNewAddress(params2);

// nested segwit address
let params3: NewAddressParams = {
  privateKey: "L22jGDH5pKE4WHb2m9r2MdiWTtGarDhTYRqMrntsjD5uCq5z9ahY",
  addressType: "segwit_nested",
};
let address3 = await wallet.getNewAddress(params3);

// taproot segwit address
let params4: NewAddressParams = {
  privateKey: "L22jGDH5pKE4WHb2m9r2MdiWTtGarDhTYRqMrntsjD5uCq5z9ahY",
  addressType: "segwit_taproot",
};
let address4 = await wallet.getNewAddress(params4);
```

get new address from public key
```typescript
import { BtcWallet } from "@okxweb3/coin-bitcoin";

let wallet = new BtcWallet()
let params5 = {
  privateKey: "L22jGDH5pKE4WHb2m9r2MdiWTtGarDhTYRqMrntsjD5uCq5z9ahY",
  addressType: "segwit_taproot",
}
let address5 = await wallet.getAddressByPublicKey(params5);
```

### Sign Transaction
sign transaction
```typescript
import { BtcWallet } from "@okxweb3/coin-bitcoin";

let wallet = new BtcWallet()
let btcTxParams = {
  inputs: [
    {
      txId: "a7edebed3f2e51a2ed99a3625fb408bd9db2ce61b1794880b3f214b26bf7a023",
      vOut: 0,
      amount: 250000
    },
  ],
  outputs: [
    {
      address: "tb1qtsq9c4fje6qsmheql8gajwtrrdrs38kdzeersc",
      amount: 150000
    },
    {
      address: "mouQtmBWDS7JnT65Grj2tPzdSmGKJgRMhE",
      amount: 50000
    },
  ],
  address: "2NF33rckfiQTiE5Guk5ufUdwms8PgmtnEdc",
  feePerB: 2
};

let signParams: SignTxParams = {
  privateKey: "L22jGDH5pKE4WHb2m9r2MdiWTtGarDhTYRqMrntsjD5uCq5z9ahY",
  data: btcTxParams
};
let tx = await wallet.signTransaction(signParams);
```

sign legacy transaction
```typescript
import { BtcWallet } from "@okxweb3/coin-bitcoin";

let wallet = new BtcWallet()
let btcTxParams = {
  inputs: [
    {
      txId: "1e0f92720ef34ab75eefc5d691b551fb2f783eac61503a69cdf63eb7305d2306",
      vOut: 0,
      amount: 2500000,
      address: "1GhLyRg4zzFixW3ZY5ViFzT4W5zTT9h7Pc",
    },
    {
      txId: "6a8187bcd23b820804312077d5bcfaae534bc2cf21a2e3854e558f099fa0401f",
      vOut: 1,
      amount: 2019431,
      address: "1GhLyRg4zzFixW3ZY5ViFzT4W5zTT9h7Pc",
    }
  ],
  outputs: [
    {
      address: "1GhLyRg4zzFixW3ZY5ViFzT4W5zTT9h7Pc",
      amount: 2500000
    }
  ],
  address: "1GhLyRg4zzFixW3ZY5ViFzT4W5zTT9h7Pc",
  feePerB: 2
};

let signParams: SignTxParams = {
  privateKey: "L22jGDH5pKE4WHb2m9r2MdiWTtGarDhTYRqMrntsjD5uCq5z9ahY",
  data: btcTxParams
};
let tx = await wallet.signTransaction(signParams);
```
sign drc 20
```typescript
import { DogeWallet } from "@okxweb3/coin-bitcoin";
let wallet = new DogeWallet()
        let privateKey = "QRJx7uvj55L3oVRADWJfFjJ31H9Beg75xZ2GcmR8rKFNHA4ZacKJ"

        const commitTxPrevOutputList: PrevOutput[] = [];
        commitTxPrevOutputList.push({
            txId: "3cb1d8da082b2146b8f4c09b06e38eb37f0263ecefb8a52600accc75ccef4c90",
            vOut: 1,
            amount: 793850000,
            address: "DJu5mMUKprfnyBhot2fqCsW9sZCsfdfcrZ",
            privateKey: privateKey,
        });
        const inscriptionDataList: DrcInscriptionData[] = [];
        inscriptionDataList.push({
            contentType: "text/plain;charset=utf-8",
            body: `{"p":"drc-20","op":"mint","tick":"MARS","amt":"210000000000"}`,
            revealAddr: "DFuDR3Vn22KMnrnVCxh6YavMAJP8TCPeA2",
            repeat: 2,
        });

        const request = {
            commitTxPrevOutputList,
            commitFeeRate: 50000,
            revealFeeRate: 50000,
            inscriptionDataList,
            changeAddress: "DFuDR3Vn22KMnrnVCxh6YavMAJP8TCPeA2",
        };
        let res= await wallet.signTransaction({privateKey:privateKey,data:{type:1,data:request}})
        console.log(JSON.stringify(res))
```



## License: MIT
