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
    publicKey: "03052b16e71e4413f24f8504c3b188b7edebf97b424582877e4993ef9b23d0f045",
    addressType: "segwit_taproot",
}
let address5 = await wallet.getAddressByPublicKey(params5);
```


### Sign Transaction

[rune mint doc](./doc/rune.md)

[atomical token doc](./doc/atomical.md)

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

Doginals inscribe
```typescript
import { DogeWallet } from "@okxweb3/coin-bitcoin";

let wallet = new DogeWallet()
let privateKey = "QV3XGHS28fExYMnEsoXrzRr7bjQbCH1qRPfPCMLBKhniWF4uFEcs"
const commitTxPrevOutputList: PrevOutput[] = [];
commitTxPrevOutputList.push({
    txId: "adc5edd2a536c92fed35b3d75cbdbc9f11212fe3aa6b55c0ac88c289ba7c4fae",
    vOut: 2,
    amount: 317250000,
    address: "DFuDR3Vn22KMnrnVCxh6YavMAJP8TCPeA2",
    privateKey: privateKey,
});
const inscriptionData: InscriptionData = {
    contentType: "text/plain;charset=utf8",
    body: base.fromHex(base.toHex(Buffer.from('{"p":"drc-20","op":"mint","tick":"tril","amt":"100"}'))),
    revealAddr: "DFuDR3Vn22KMnrnVCxh6YavMAJP8TCPeA2",
};

const request = {
    type: 1,
    commitTxPrevOutputList,
    commitFeeRate: 100000,
    revealFeeRate: 100000,
    revealOutValue: 100000,
    inscriptionData,
    changeAddress: "DFuDR3Vn22KMnrnVCxh6YavMAJP8TCPeA2",
};
let result = await wallet.signTransaction({privateKey: privateKey, data: request})
console.log(result);
```

SRC20 inscribe

    you need replace TBtcWallet with BtcWallet when you run on mainnet not testnet.
```typescript
import { TBtcWallet } from "@okxweb3/coin-bitcoin";
 let wallet = new TBtcWallet()

        let network = bitcoin.networks.testnet;
        let privateKey = "cPnvkvUYyHcSSS26iD1dkrJdV7k1RoUqJLhn3CYxpo398PdLVE22"

        const commitTxPrevOutputList: PrevOutput[] = [];
        commitTxPrevOutputList.push({
            txId: "c865cd4dc206ccdaf1cff0fad4f0272f2075af5c975c670debbf8d56045391ad",
            vOut: 3,
            amount: 202000,
            address: "2NF33rckfiQTiE5Guk5ufUdwms8PgmtnEdc",
            privateKey: privateKey,
        });
        const inscriptionData: InscriptionData = {
            contentType: "stamp:",
            body: '{"p":"src-20","op":"deploy","tick":"coder","max":"21000000","lim":"1000","dec":"8"}',
            revealAddr: "2NF33rckfiQTiE5Guk5ufUdwms8PgmtnEdc",
        }

        const request = {
            commitTxPrevOutputList,
            commitFeeRate: 100,
            revealOutValue: 790,
            inscriptionData,
            changeAddress: "2NF33rckfiQTiE5Guk5ufUdwms8PgmtnEdc",
            type: 101,
        };

        const txs: InscribeTxs =await wallet.signTransaction({privateKey: privateKey, data: request});
        console.log(JSON.stringify(txs));
```

BRC20 inscribe

```typescript
test("inscribe", async () => {
    let network = bitcoin.networks.testnet;
    let privateKey = "cPnvkvUYyHcSSS26iD1dkrJdV7k1RoUqJLhn3CYxpo398PdLVE22"

    const commitTxPrevOutputList: PrevOutput[] = [];
    commitTxPrevOutputList.push({
        txId: "36cdb491d2b02c1668d02e42edd80af339e1195df4d58927ab9db9e4893509a5",
        vOut: 4,
        amount: 1145068,
        address: "2NF33rckfiQTiE5Guk5ufUdwms8PgmtnEdc",
        privateKey: privateKey,
    });
    commitTxPrevOutputList.push({
        txId: "3d79592cd151427d2d3e55aaf09749c8417d24889c20edf68bd936adc427412a",
        vOut: 0,
        amount: 546,
        address: "tb1qtsq9c4fje6qsmheql8gajwtrrdrs38kdzeersc",
        privateKey: privateKey,
    });
    commitTxPrevOutputList.push({
        txId: "83f5768abfd8b95dbfd9191a94042a06a2c3639394fd50f40a00296cb551be8d",
        vOut: 0,
        amount: 546,
        address: "mouQtmBWDS7JnT65Grj2tPzdSmGKJgRMhE",
        privateKey: privateKey,
    });
    commitTxPrevOutputList.push({
        txId: "8583f92bfc087549f6f20eb2d1604b69d5625a9fe60df72e61e9138884f57c41",
        vOut: 0,
        amount: 546,
        address: "tb1pklh8lqax5l7m2ycypptv2emc4gata2dy28svnwcp9u32wlkenvsspcvhsr",
        privateKey: privateKey,
    });

    const inscriptionDataList: InscriptionData[] = [];
    inscriptionDataList.push({
        contentType: "text/plain;charset=utf-8",
        body: `{"p":"brc-20","op":"mint","tick":"xcvb","amt":"100"}`,
        revealAddr: "tb1pklh8lqax5l7m2ycypptv2emc4gata2dy28svnwcp9u32wlkenvsspcvhsr",
    });
    inscriptionDataList.push({
        contentType: "text/plain;charset=utf-8",
        body: `{"p":"brc-20","op":"mint","tick":"xcvb","amt":"10"}`,
        revealAddr: "mouQtmBWDS7JnT65Grj2tPzdSmGKJgRMhE",
    });
    inscriptionDataList.push({
        contentType: "text/plain;charset=utf-8",
        body: `{"p":"brc-20","op":"mint","tick":"xcvb","amt":"10000"}`,
        revealAddr: "tb1qtsq9c4fje6qsmheql8gajwtrrdrs38kdzeersc",
    });
    inscriptionDataList.push({
        contentType: "text/plain;charset=utf-8",
        body: `{"p":"brc-20","op":"mint","tick":"xcvb","amt":"1"}`,
        revealAddr: "2NF33rckfiQTiE5Guk5ufUdwms8PgmtnEdc",
    });

    const request: InscriptionRequest = {
        commitTxPrevOutputList,
        commitFeeRate: 2,
        revealFeeRate: 2,
        revealOutValue: 546,
        inscriptionDataList,
        changeAddress: "tb1pklh8lqax5l7m2ycypptv2emc4gata2dy28svnwcp9u32wlkenvsspcvhsr",
    };

    const txs: InscribeTxs = inscribe(network, request);
    console.log(txs);
    expect(txs.commitTxFee).toEqual(1180)
});
```

Runes deploy

```typescript
let network = testnet;
let privateKeyTestnet = "" //testnet
let btcWallet = new TBtcWallet();
let addressData = await btcWallet.getNewAddress({privateKey: privateKeyTestnet, addressType: "segwit_taproot"})
let address = addressData.address;
const commitTxPrevOutputList: PrevOutput[] = [];
commitTxPrevOutputList.push({
    txId: "61850f94abe913a23bdc77a5d8e5e89e02d2aae36afaef0a8068656deeca5fb7",
    vOut: 1,
    amount: 270356,
    address: "tb1p9yvdxe5mudhffs9pzlvexefclrrrv3f5rg0zxuw87x9vxfafskuq0ruwy3",
    privateKey: privateKeyTestnet,
});
let logoData = base.fromHex("89504e470d0a1a0a0000000d494844520000001a0000001a0806000000a94a4cce000000017352474200aece1ce90000000467414d410000b18f0bfc6105000000097048597300000ec400000ec401952b0e1b0000008e49444154484bed96010a80200c456797a95b56c7ec34ab8181e8ac6d9642f64012a93da61fc9e13c225460f0cfd7f94566be2762e3edd6cdcfae39bef5b37b121149a40534ef761406da96f8acb83529ed3b424cef5a6e4d4abea3654a13c5ad0969bf754fa31259134764456794c3613d1f222ba2a2f128417da986424d97aa9f93b8b046d479bc4ba82402d8011ca1446416a08a910000000049454e44ae426082")
let logoDataStr = "hello world";
const request: RunesMainInscriptionRequest = {
    type: BtcXrcTypes.RUNEMAIN,
    commitTxPrevOutputList,
    commitFeeRate: 5,
    revealFeeRate: 5,
    revealOutValue: 1000,
    runeData: {
        revealAddr: "tb1p9yvdxe5mudhffs9pzlvexefclrrrv3f5rg0zxuw87x9vxfafskuq0ruwy3",
        etching: {
            premine: BigInt(1000000),
            rune: {value: "ABCDEFG•ABC•PPPM•OPOETAB"},
            symbol: "X",
            terms: {
                amount: BigInt(1000),
                cap: BigInt(20000)
            },
            turbo: false,//todo
            contentType: "image/png", //optional
            body: logoData  //optional
        }
    },
    changeAddress: "tb1p9yvdxe5mudhffs9pzlvexefclrrrv3f5rg0zxuw87x9vxfafskuq0ruwy3",
};

let res = await btcWallet.signTransaction({
    privateKey: privateKeyTestnet,
    data: request
});
expect(res.revealTxs.length).toEqual(1)
expect(res.commitTxFee).toEqual(770)
```

* [commit example](https://www.oklink.com/zh-hans/btc/tx/7d25c2be38b45d2dc37496fd4884e6a80881b753e437f93e909b94bf3efe154c)
* [reveal example](https://www.oklink.com/zh-hans/btc/tx/7b5c77bdccad264b36d7bf1b0f8c38bc831eb921d9e77eba27855c5de9033569)


## License: MIT
