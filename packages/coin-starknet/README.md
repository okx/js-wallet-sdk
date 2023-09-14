# @okxweb3/coin-starknet
Starknet SDK is used to interact with the Starknet blockchain, it contains various functions can be used to web3 wallet.

## Installation

### Npm

To obtain the latest version, simply require the project using npm :

```shell
npm install @okxweb3/coin-starknet
```

## Usage

### Generate private key

```typescript
import {StarknetWallet} from "@okxweb3/coin-starknet";

let wallet = new StarknetWallet()
let privateKey = await wallet.getRandomPrivateKey();

```


### Private key derivation

```typescript
import {StarknetWallet} from "@okxweb3/coin-starknet";

let wallet = new StarknetWallet()
let param = {
    mnemonic: `gaze supreme human audit aisle entry galaxy shy lock time such auto`,
    hdPath: `m/44'/9004'/0'/0/0`
}
let privateKey = await wallet.getDerivedPrivateKey(param);
```

### Generate address

```typescript
import {StarknetWallet} from "@okxweb3/coin-starknet";

let wallet = new StarknetWallet()
let param: NewAddressParams = {
    privateKey: '603c85d20500520d4c653352ff6c524f358afeab7e41a511c73733e49c3075e',
}
let data = await wallet.getNewAddress(param)
```

### Verify address
```typescript
import {StarknetWallet} from "@okxweb3/coin-starknet";

let wallet = new StarknetWallet()
let param1: ValidAddressParams = {
    address: "0x06c3c93eeb1643740a80a338b9346c0c9a06177bfcc098a6d86e353532090ae4"
};
let valid = await wallet.validAddress(param1); // true

let param2: ValidAddressParams = {
    address: "1895a6a77ae14e7987b9cb51329a5adfb17bd8e7c638f92d6892d76e51cebcf"
}
let valid2 = await wallet.validAddress(param2); // false
```

### Transfer STARKNET-ETH
```typescript
import {StarknetWallet} from "@okxweb3/coin-starknet";

let wallet = new StarknetWallet()
let param: SignTxParams = {
    privateKey: '0x0603c85d20500520d4c653352ff6c524f358afeab7e41a511c73733e49c3075e',
    data: {
        type: "transfer",
        transferData: {
            contractAddress: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
            from: "0x6c3c93eeb1643740a80a338b9346c0c9a06177bfcc098a6d86e353532090ae4",
            to: "0x026e9E8c411056B64B2D044EBCb39FC810D652Cfbe694326651d796BB078320b",
            amount: "1700000000000000"
        },
        nonce: "1",
        maxFee: "14000000000000",
        }
}
let data = await wallet.signTransaction(param)
```

### Contract call
```typescript
import {StarknetWallet} from "@okxweb3/coin-starknet";

let wallet = new StarknetWallet()
let param: SignTxParams = {
    privateKey: '0x0603c85d20500520d4c653352ff6c524f358afeab7e41a511c73733e49c3075e',
    data: {
        type: "contract_call",
        contractCallData: {
            contractAddress: "0x073314940630fd6dcda0d772d4c972c4e0a9946bef9dabf4ef84eda8ef542b82",
            from: "0x06c3c93eeb1643740a80a338b9346c0c9a06177bfcc098a6d86e353532090ae4",
            functionName: "initiate_withdraw",
            callData: ["0x62e206b4ddd402056d881ded58c0bd87193d2913", "0x38d7ea4c68000", "0"]
        },
        nonce: "2",
        maxFee: "1864315586779310",
    }
}
let data = await wallet.signTransaction(param)
```


### Sign the message
note that the message is a string, not the txBytes of the transaction. Do not sign the transaction with this method!
```typescript
import {StarknetWallet} from "@okxweb3/coin-starknet";

let wallet = new StarknetWallet()
const privateKey = "0x0603c85d20500520d4c653352ff6c524f358afeab7e41a511c73733e49c3075e";
let param: SignTxParams = {
    privateKey: privateKey,
    data: {
        message: "0xec04138ec537328244f24236a84bb72d0fe428f6d4955ca20a5f6420066b5"
    }
}
const sig = await signMessage(Currency.Starknet, param);
console.log(sig)

const param2: VerifyMessageParams = {
    signature: "",
    data: {
        signature: sig.signature,
        hash: sig.hash,
        publicKey: sig.publicKey,
    }
}
const v = await verifyMessage(Currency.Starknet, param2);
console.log(v)
```


## License
Current package is [MIT](<https://github.com/okx/js-wallet-sdk/blob/main/LICENSE>) licensed.
