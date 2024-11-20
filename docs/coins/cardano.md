# @okxweb3/coin-cardano
Cardano SDK is used to interact with the Cardano blockchain, it contains various functions can be used to web3 wallet.
The SDK only runs in the browser environment.

## Installation

### Npm

To obtain the latest version, simply require the project using npm :

```shell
npm install @okxweb3/coin-cardano
```

## Usage

### Set wasm path

```typescript
import { Loader } from "@okxweb3/coin-cardano";

Loader.setCardanoUrl("http://localhost:63344/ada-test/node_modules/@okxweb3/coin-cardano/dist/cardano_multiplatform_lib_bg.wasm");
Loader.setMessageUrl("http://localhost:63344/ada-test/node_modules/@okxweb3/coin-cardano/dist/cardano_message_signing_bg.wasm");
```

### Private key derivation

```typescript
import { AdaWallet } from "@okxweb3/coin-cardano";

let wallet = new AdaWallet();
let mnemonic = "bean mountain minute enemy state always weekend accuse flag wait island tortoise";
let param = {
    mnemonic: mnemonic,
    hdPath: "m/1852'/1815'/0'/0/0"
};
let privateKey = await wallet.getDerivedPrivateKey(param);
```

### Generate address

```typescript
import { AdaWallet } from "@okxweb3/coin-cardano";

let wallet = new AdaWallet();
let params: NewAddressParams = {
    privateKey: "30db52f355dc57e92944cbc93e2d30c9352a096fa2bbe92f1db377d3fdc2714aa3d22e03781d5a8ffef084aa608b486454b34c68e6e402d4ad15462ee1df5b8860e14a0177329777e9eb572aa8c64c6e760a1239fd85d69ad317d57b02c3714aeb6e22ea54b3364c8aaa0dd8ee5f9cea06fa6ce22c3827b740827dd3d01fe8f3",
};
let address = await wallet.getNewAddress(params);
```

### Verify address

```typescript
import { AdaWallet } from "@okxweb3/coin-cardano";

let wallet = new AdaWallet();
let p: ValidAddressParams = {
    address: "addr1q95y9uu3ekfwmlu3mthnjeuptu95th8m0qzqw2kexej6xgpttfhlqgwy5vavd7ggzneerhd80456j736e085zcys9y9q5frsx7"
};
let valid = await wallet.validAddress(p);
```

### Transfer ADA/MultiAsset

```typescript
import { AdaWallet } from "@okxweb3/coin-cardano";

let wallet = new AdaWallet();
const param: AdaParam =  {
    data: {
        type: "transfer",
        inputs: [
            {
                txId: "44570e25067f84428165faecdeff5833654988a3bb86e62ebcadccf992f7cec3",
                index: 1,
                address: "addr1q95y9uu3ekfwmlu3mthnjeuptu95th8m0qzqw2kexej6xgpttfhlqgwy5vavd7ggzneerhd80456j736e085zcys9y9q5frsx7",
                amount: "2861874",
                multiAsset: [
                    {
                        policyId: "29d222ce763455e3d7a09a665ce554f00ac89d2e99a1a83d267170c6",
                        assets: [
                            {
                                assetName: "4d494e",
                                amount: "1651110"
                            }
                        ]
                    }
                ],
                privateKey: "30db52f355dc57e92944cbc93e2d30c9352a096fa2bbe92f1db377d3fdc2714aa3d22e03781d5a8ffef084aa608b486454b34c68e6e402d4ad15462ee1df5b8860e14a0177329777e9eb572aa8c64c6e760a1239fd85d69ad317d57b02c3714aeb6e22ea54b3364c8aaa0dd8ee5f9cea06fa6ce22c3827b740827dd3d01fe8f3"
            }
        ],
        address: "addr1q8tx7q99lgd3upff0rtjxu437z6ddvzdjj4wr7e2s3c3zx5ryzpxwtxglcpnttjnpaar9x8mkv5etwzvfyglgzs6xg9qzrwylf",
        amount: "1150770",
        multiAsset: [
            {
                policyId: "29d222ce763455e3d7a09a665ce554f00ac89d2e99a1a83d267170c6",
                assets: [
                    {
                        amount: "1000000",
                        assetName: "4d494e"
                    }
                ]
            }
        ],
        changeAddress: "addr1q95y9uu3ekfwmlu3mthnjeuptu95th8m0qzqw2kexej6xgpttfhlqgwy5vavd7ggzneerhd80456j736e085zcys9y9q5frsx7",
        ttl: "999999999"
    }
}
let signParams: SignTxParams = {
    data: param
};
let tx = await wallet.signTransaction(signParams);
```

### Calculate min ADA

```typescript
import { AdaWallet } from "@okxweb3/coin-cardano";

let minAda = await AdaWallet.minAda("addr1q8tx7q99lgd3upff0rtjxu437z6ddvzdjj4wr7e2s3c3zx5ryzpxwtxglcpnttjnpaar9x8mkv5etwzvfyglgzs6xg9qzrwylf", [
    {
        policyId: "29d222ce763455e3d7a09a665ce554f00ac89d2e99a1a83d267170c6",
        assets: [
            {
                assetName: "4d494e",
                amount: "1000000"
            }
        ]
    }
])
```

### Calculate min fee

```typescript
import { AdaWallet } from "@okxweb3/coin-cardano";

const param: AdaParam = {
    data: {
        type: "transfer",
        inputs: [
            {
                txId: "44570e25067f84428165faecdeff5833654988a3bb86e62ebcadccf992f7cec3",
                index: 1,
                address: "addr1q95y9uu3ekfwmlu3mthnjeuptu95th8m0qzqw2kexej6xgpttfhlqgwy5vavd7ggzneerhd80456j736e085zcys9y9q5frsx7",
                amount: "2861874",
                multiAsset: [
                    {
                        policyId: "29d222ce763455e3d7a09a665ce554f00ac89d2e99a1a83d267170c6",
                        assets: [
                            {
                                assetName: "4d494e",
                                amount: "1651110"
                            }
                        ]
                    }
                ]
            }
        ],
        address: "addr1q8tx7q99lgd3upff0rtjxu437z6ddvzdjj4wr7e2s3c3zx5ryzpxwtxglcpnttjnpaar9x8mkv5etwzvfyglgzs6xg9qzrwylf",
        amount: "1150770",
        multiAsset: [
            {
                policyId: "29d222ce763455e3d7a09a665ce554f00ac89d2e99a1a83d267170c6",
                assets: [
                    {
                        amount: "1000000",
                        assetName: "4d494e"
                    }
                ]
            }
        ],
        changeAddress: "addr1q95y9uu3ekfwmlu3mthnjeuptu95th8m0qzqw2kexej6xgpttfhlqgwy5vavd7ggzneerhd80456j736e085zcys9y9q5frsx7",
        ttl: "999999999"
    }
}
let signParams: SignTxParams = {
    data: param
};

let minFee = await AdaWallet.minFee(signParams);
```

### Sign rawTx

```typescript
import { AdaWallet } from "@okxweb3/coin-cardano";

let wallet = new AdaWallet();
const param: AdaParam = {
    data: {
        type: "rawTx",
        tx: "84a600838258206704a5f781298f997625603a9eccdcafa529c1261eda5c94c37e3460e57312230182582079952d5f5eb4f2b8637823890cf704c4b1bc5e67c8d552f4e6b03be1e6ec3a92018258207d29ba4ee7d0255f08da2e198dcc869cac1cd071ef3e2354f84d7ff538eb12ca00018383581d7186ae9eebd8b97944a45201e4aec1330a72291af2d071644bba0159591a003e8fa058206a6418247d5a7c4e6bce53aad1be5ebc2f0322398f1fbca4979ee209c18de74a825839010cd405d8040698259e44239fd7c4da9f4b9ba69cc2c8528fc087219d03f0aaf14e0a16eb66b69241afd7060bc22645d44d70a75c951a06ed1a001de58a825839010cd405d8040698259e44239fd7c4da9f4b9ba69cc2c8528fc087219d03f0aaf14e0a16eb66b69241afd7060bc22645d44d70a75c951a06ed821a00118f32a1581c29d222ce763455e3d7a09a665ce554f00ac89d2e99a1a83d267170c6a1434d494e1a01836075021a0002e34d031a06742d2b081a06741f1b0b58206f0ccb1af32e800cba0a854b4c5263cf7b406a2f9d2f5f52f04ea39e01588017a10481d8799fd8799fd8799fd8799f581c0cd405d8040698259e44239fd7c4da9f4b9ba69cc2c8528fc087219dffd8799fd8799fd8799f581c03f0aaf14e0a16eb66b69241afd7060bc22645d44d70a75c951a06edffffffff581c0cd405d8040698259e44239fd7c4da9f4b9ba69cc2c8528fc087219d1b0000018bc7aa860fd8799fd8799f4040ffd8799f581c29d222ce763455e3d7a09a665ce554f00ac89d2e99a1a83d267170c6434d494effffffd8799fd879801a0019a50dfffff5f6" 
    }
}
let signParams: SignTxParams = {
    privateKey: "30db52f355dc57e92944cbc93e2d30c9352a096fa2bbe92f1db377d3fdc2714aa3d22e03781d5a8ffef084aa608b486454b34c68e6e402d4ad15462ee1df5b8860e14a0177329777e9eb572aa8c64c6e760a1239fd85d69ad317d57b02c3714aeb6e22ea54b3364c8aaa0dd8ee5f9cea06fa6ce22c3827b740827dd3d01fe8f3",
    data: param
};

let signature = await wallet.signTransaction(signParams);
```

### Sign Message

```typescript
import { AdaWallet } from "@okxweb3/coin-cardano";

let wallet = new AdaWallet();
const param: AdaParam = {
    data: {
        address: "addr1q95y9uu3ekfwmlu3mthnjeuptu95th8m0qzqw2kexej6xgpttfhlqgwy5vavd7ggzneerhd80456j736e085zcys9y9q5frsx7", 
        message: "1234"
    }
}
let signParams: SignTxParams = {
    privateKey: "30db52f355dc57e92944cbc93e2d30c9352a096fa2bbe92f1db377d3fdc2714aa3d22e03781d5a8ffef084aa608b486454b34c68e6e402d4ad15462ee1df5b8860e14a0177329777e9eb572aa8c64c6e760a1239fd85d69ad317d57b02c3714aeb6e22ea54b3364c8aaa0dd8ee5f9cea06fa6ce22c3827b740827dd3d01fe8f3",
    data: param
};

let signature = await wallet.signMessage(signParams);
```

## License
Most packages or folder are [MIT](<https://github.com/okx/js-wallet-sdk/blob/main/LICENSE>) licensed, see package or folder for the respective license.
