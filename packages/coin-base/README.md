# Installation
This is a base library on which all currencies depend. You need to install this library.
```shell
npm install @okxweb3/coin-base
```

## Provides
We provide common functionality for these chains or coins so that access to these chains is very simple.

### Supporting chains
It supports Bitcoins, Ethereum, Aptos, Near, Starknet, Sui, Zkspace, Cosmos, Eos, Flow, Polkadot, Solana, Stacks and Tron.

### Supporting functions

**1.generate a random private key**

secp256k1 curve uses the default implementation, ed25519 curve, you need to use the basic/ed25519 implementation.
```typescript
getRandomPrivateKey()
```

**2.generate private key from DerivePriKeyParams**
 ```typescript
getDerivedPrivateKey(param: DerivePriKeyParams)
```

**3. get new address by private key**
 ```typescript
getNewAddress(param: NewAddressParams)
```

**4. validate address**
 ```typescript
validAddress(param: ValidAddressParams)
```

**5.sign transaction**
```typescript
signTransaction(param: SignTxParams)
```

**6.get bip44 path**
```typescript
getDerivedPath(param: GetDerivedPathParam)
```

**7.validate private key**
```typescript
validPrivateKey(param: ValidPrivateKeyParams)
```

**8.sign message**
```typescript
signMessage(param: SignTxParams)
```

**9.verify message**
```typescript
verifyMessage(param: VerifyMessageParams)
```

**10.recover signature to public key**
```typescript
ecRecover(message: TypedMessage, signature: string)
```

**11.get address by public key**
```typescript
getAddressByPublicKey(param: GetAddressParams)
```

**12.get raw transaction for mpc**
```typescript
getMPCRawTransaction(param: MpcRawTransactionParam)
```

**13.get signed transaction for mpc**
```typescript
getMPCTransaction(param: MpcTransactionParam)
```

**14.get raw message for mpc**
```typescript
getMPCRawMessage(param: MpcRawTransactionParam)
```

**15.get signed message for mpc**
```typescript
getMPCSignedMessage(param: MpcMessageParam)
```

**16.get raw transaction for hardware**
```typescript
getHardWareRawTransaction(param: SignTxParams)
```

**17.get signed transaction for hardware**
```typescript
getHardWareSignedTransaction(param: HardwareRawTransactionParam)
```

**18.get message hash for hardware**
```typescript
getHardWareMessageHash(param: SignTxParams)
```

**19.get tx hash by raw transaction**
```typescript
calcTxHash(param: CalcTxHashParams)
```

**20.generate raw transaction data**
```typescript
getRawTransaction(param: GetRawTransactionParams)
```

**21.check signed transaction**
```typescript
validSignedTransaction(param: ValidSignedTransactionParams)
```

**22.estimate gas fee**
```typescript
estimateFee(param: SignTxParams)
```


## License

Current package is [MIT](<https://github.com/okx/js-wallet-sdk/blob/main/LICENSE>) licensed.
