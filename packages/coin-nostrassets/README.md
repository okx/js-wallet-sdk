# @okxweb3/coin-nostrassets
NostrAssets SDK is used to interact with the protocol NoStrAssets , it contains various functions can be used to web3 wallet.

## Installation

### Npm

To obtain the latest version, simply require the project using npm :

```shell
npm install @okxweb3/coin-nostrassets
```

## Usage

### New address and public key

```typescript
import { NostrAssetsWallet } from "@okxweb3/coin-nostrassets";

const prv = 'bb1c93508b962c7efb0a340848538b2c5f7ba6c44e55f52389aa132a2fd3521a'
let wallet = new NostrAssetsWallet();
let r =await wallet.getNewAddress({privateKey: prv})
console.log(r)
```

### Sign Event

```typescript
import { NostrAssetsWallet } from "@okxweb3/coin-nostrassets";

const prv = 'bb1c93508b962c7efb0a340848538b2c5f7ba6c44e55f52389aa132a2fd3521a'
let wallet = new NostrAssetsWallet();
let event = {
    kind: 1,
    created_at: Math.floor(Date.now() / 1000),//unix
    tags: [],
    content: 'hello',
}
let e = await wallet.signTransaction({
    privateKey: prv,
    data: event
})
console.log(e)
```


### Encrypt and decrypt for nip04

```typescript
import { NostrAssetsWallet } from "@okxweb3/coin-nostrassets";

let wallet = new NostrAssetsWallet();
let text = 'hello'
let privkey = '425824242e3038e026f7cbeb6fe289cb6ffcfad1fa955c318c116aa1f2f32bfc'
const encrypted = await wallet.signTransaction({
    privateKey: privkey,
    data: new CryptTextParams('nip04encrypt', '8a0523d045d09c30765029af9307d570cb0d969e4b9400c08887c23250626eea', text)
});
console.log('encrypted', encrypted)
const decrypted = await wallet.signTransaction({
    privateKey: privkey,
    data: new CryptTextParams('nip04decrypt', '8a0523d045d09c30765029af9307d570cb0d969e4b9400c08887c23250626eea', encrypted)
});
console.log('decrypted', decrypted)
console.log(e)
```

## License
Most packages or folder are [MIT](<https://github.com/okx/js-wallet-sdk/blob/main/LICENSE>) licensed, see package or folder for the respective license.
