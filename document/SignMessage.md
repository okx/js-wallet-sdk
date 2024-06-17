# How to sign message and verify signed message?

We currently support message signing and verifying for utxo and evm chains.

## chains list

|       | Chain Index | Chain Name | Coin/Short Name | Chain type | Prefix for UTXO | Remark  |
|-------|-------------|------------|-----------|------------|-----------------|---------|
|1 | 0 | BTC | btc | BTC        | "Bitcoin"                   |  |  
|2 | 1 | Ethereum | eth | EVM        |                 |  |  
|3 | 2 | Litecoin | LTC | BTC        | "Litecoin"      |  |  
|4 | 3 | Dogecoin | DOGE | BTC        | "Dogecoin"      |  |  
|6 | 10 | Optimism | Optimism | EVM        |                 |  |  
|7 | 14 | Flare | Flr | EVM        |                 |  |  
|8 | 25 | Cronos | Cronos | EVM        |                 |  |  
|9 | 56 | BNB Smart Chain | bsc | EVM        |                 |  |  
|10 | 61 | Ethereum Classic | ETC | EVM        |                 |  |  
|11 | 66 | OKTC | okt | EVM        |                 | Only evm addresses are supported  |
|12 | 100 | Gnosis | XDAI | EVM        |                 |  |  
|14 | 137 | Polygon | matic | EVM        |                 |  |  
|15 | 145 | Bitcoin Cash | BCH | BTC        | "Bitcoin"       |  |  
|16 | 169 | Manta Pacific | Manta | EVM        |                 |  |  
|17 | 204 | opBNB | op_bnb | EVM        |                 |  |  
|18 | 236 | BitcoinSV | BSV | BTC        | "Bitcoin"       |  |  
|19 | 250 | Fantom | ftm | EVM        |                 |  |  
|20 | 288 | Boba | BOBA | EVM        |                 |  |  
|21 | 314 | Filecoin | FIL | EVM        |                 |Only evm addresses are supported  |
|22 | 321 | KCC | KCC | EVM        |                 |  |  
|23 | 324 | zkSync Era | ZKSync2 | EVM        |                 |  |  
|24 | 369 | PulseChain | PLS |            |                 |   |
|25 | 408 | Omega Network | Omega | EVM        |                 |
|26 | 648 | Endurance | ACE | EVM        |                 |  |  
|27 | 1030 | Conflux | cfx | EVM        |                 |  |  
|28 | 1088 | Metis | METIS | EVM        |                 |  |  
|29 | 1101 | Polygon zkEVM | PolygonZK | EVM        |                 |  |  
|30 | 1111 | Wemix 3.0 | wemix | EVM        |                 |  |  
|31 | 1116 | Core | core | EVM        |                 |  |  
|32 | 2020 | Ronin | RONIN | EVM       |                 |   |  |  
|33 | 2222 | Kava EVM | EVM_KAVA | EVM        |                 |  |  
|34 | 42161 | Arbitrum One | Arbitrum | EVM        |                 |  |  
|35 | 42170 | Arbitrum Nova | Nova | EVM        |                 |  |  
|36 | 42220 | Celo | Celo | EVM        |                 |  |  
|37 | 43114 | Avalanche C | avax | EVM        |                 |  |  
|38 | 59144 | Linea | linea_eth | EVM        |                 |  |  
|39 | 7000 | ZetaChain Mainnet | ZETACHAIN_MAINNET | EVM        |                 |  |  
|40 | 8217 | Klaytn | Klay | EVM        |                 |  |  
|41 | 81457 | Blast | Blast | EVM        |                 |  |  
|42 | 10001 | EthereumPoW | ETHW | EVM        |                 |  |  
|43 | 4200 | Merlin Chain | Merlin_Chain | EVM        |                 |  |  
|44 | 534352 | Scroll | Scroll_eth | EVM        |                 |  |  
|45 | 11155111 | Sepolia | SEPOLIA_ETH | EVM        |                 |  |  
|46 | 13371 | Immutable zkEVM | Immutable_zkEVM | EVM        |                 |  |  
|51 | 1101 | Polygon zkEVM | PolygonZK | EVM        |                 |  |  
|52 | 1111 | Wemix 3.0 | wemix | EVM        |                 |  |  
|53 | 324 | zkSync Era | ZKSync2 | EVM        |                 |  |  
|54 | 13371 | Immutable zkEVM | Immutable_zkEVM | EVM        |                 |  |  
|47 | 1313161554 | Aurora | Aurora | EVM        |                 |  |  
|48 | 1284 | Moonbeam | GLMR | EVM        |                 |  |  
|49 | 1285 | Moonriver | MOVR | EVM        |                 |  |  
|50 | 1666600000 | Harmony | one | EVM        |                 |  |  
|51 | 513100 | DIS CHAIN | DIS | EVM        |                 |  |  
|52 | 5000 | Mantle | Mantle | EVM        |                 |  |  
|53 | 8453 | Base | base_eth | EVM        |                 |  |  
|54 | 11235 | HAQQ Network | HAQQ | EVM        |                 |  |  
|55 | 70000038 | BTC Testnet | TBTC | BTC        | "Bitcoin"       |        |        

# Evm sign message and verify signed message

### Install dependency

```shell

npm install @okxweb3/coin-ethereum

```

### Evm  code sample

```js

import eth from "@okxweb3/coin-ethereum";

const privateKey = "0x49c0722d56d6bac802bdf5c480a17c870d1d18bc4355d8344aa05390eb778280";

const account = eth.getNewAddress(privateKey)
console.log('address', account.address)
let data = {
    type: eth.MessageTypes.ETH_SIGN,
    message: "0x879a053d4800c6354e76c7985a865d2922c82fb5b3f4577b2fe08b998954f2e0"
};
let wallet = new eth.EthWallet()
let signParams = {
    privateKey: privateKey,
    data: data
};

let result = await wallet.signMessage(signParams);
console.info('signed result', result)

let verifyMessageParams = {
    signature: result,
    data: data,
    address: account.address
};
console.log("verifying message params", verifyMessageParams)
const verified = await wallet.verifyMessage(verifyMessageParams)
console.info("verified", verified)


```

### output

>
> address 0xd74c65ad81aa8537327e9ba943011a8cec7a7b6b
> signed result
>
0xa4a11b0526c248576756292f420f3cf4c5bb744a8491f8c1a33838b95f401aed7afe88e296edf246291e3f9fcd125a7fe795c76ab118d5abb97421e1f03fa36f1b
> verifying message params {
> signature: '
>
0xa4a11b0526c248576756292f420f3cf4c5bb744a8491f8c1a33838b95f401aed7afe88e296edf246291e3f9fcd125a7fe795c76ab118d5abb97421e1f03fa36f1b',
> data: {
> type: 0,
> message: '0x879a053d4800c6354e76c7985a865d2922c82fb5b3f4577b2fe08b998954f2e0'
> },
> address: '0xd74c65ad81aa8537327e9ba943011a8cec7a7b6b'
> }
> verified true
>
>
>

## UTXO sign message and verify signed message

### Install dependency

```shell

npm install @okxweb3/coin-bitcoin

```

### Btc code sample

```js
import bitcoin from "@okxweb3/coin-bitcoin";

var msg = '' + Date.parse(new Date());
console.log('msg', msg)

let wallet = new bitcoin.BtcWallet()
const privateKey = 'KwTqEP5swztao5UdMWpxaAGtvmvQFjYGe1UDyrsZxjkLX9KVpN36'
let account = await wallet.getNewAddress({privateKey: privateKey})
console.log('account', account)

let signParams = {
    privateKey: privateKey,
    data: {
        type: 0,
        address: account.address,
        message: msg,
    }
};

let result = await wallet.signMessage(signParams)
console.info('signed result', result)


let verifyMessageParams = {
    signature: result,
    data: {
        message: msg,
        type: 0,
        publicKey: account.publicKey,
    }
};

const verified = await wallet.verifyMessage(verifyMessageParams)
console.info("verified", verified)

```

### output

>
> msg 1718618813000
> account {
> address: '1GhLyRg4zzFixW3ZY5ViFzT4W5zTT9h7Pc',
> publicKey: '03052b16e71e4413f24f8504c3b188b7edebf97b424582877e4993ef9b23d0f045',
> compressedPublicKey: '03052b16e71e4413f24f8504c3b188b7edebf97b424582877e4993ef9b23d0f045'
> }
> signed result H6VOSqdfKpVNTAI1L5OQFrjQBT13D4C1T7/DAAdFYLGxc95szQFUkqVNLQo5Fc+9k4fu2tgsT1H2taiVlrFJ4yw=
> verified true
>
> 

### New different utxo wallets 

```js
import bitcoin from "@okxweb3/coin-bitcoin";

let dogeWallet = new bitcoin.DogeWallet()
let tBtcWallet= new bitcoin.TBtcWallet()
let bchWallet = new bitcoin.BchWallet()
let bsvWallet = new bitcoin.BsvWallet()



```

### Doge code sample
``` js

import bitcoin from "@okxweb3/coin-bitcoin";


var msg = '' + Date.parse(new Date());
console.log('msg', msg)
let wallet = new bitcoin.DogeWallet()
let signParams = {
    privateKey: "QUKYRpo8QXbXNwKJGtAy8HX71XkejfE8Xs4kvN8s2ksvRMK72W4Y",
    data: {
        "address": "D9jYpWwNkcwifh9GR2BUPE4uMPPWtNZrLn",
        message: msg,
    }
};
let res = await wallet.signMessage(signParams)
console.log(res)
let veryParams = {
    signature: res,
    data: {
        message: msg,
        publicKey: '020834928459fa93692af94c290d2a6c9e8ac0f63ddda8cdf982efa1483e9bcebd',
    }
};
let veryfied = await wallet.verifyMessage(veryParams)
console.log(veryfied)


```