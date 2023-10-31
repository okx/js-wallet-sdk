# js-wallet-sdk

This is a typescript/javascript language wallet solution that supports offline transactions. We currently support various mainstream public
blockchains, and will gradually release the source codes for each blockchain.

## Npm Install
To obtain the latest version, simply require the project using npm:

```shell
# needed for all coins
npm install @okxweb3/crypto-lib
npm install @okxweb3/coin-base

# for eth
npm install @okxweb3/coin-ethereum

# for bitcoin
npm install @okxweb3/coin-bitcoin
```

## Build Locally
You can build the sdk locally ,and run test-code.
```shell
sh build.sh
```

## Supported chains

|          | Account Generation | Transaction Creation | Transaction Signing |
|----------|-------------------|----------------------|---------------------|
| BTC      | ✅                 | ✅                    | ✅                   | 
| Ethereum | ✅                 | ✅                    | ✅                   |
| Aptos    | ✅                 | ✅                    | ✅                   |
| Cosmos   | ✅                 | ✅                    | ✅                   |
| Eos      | ✅                 | ✅                    | ✅                   |
| Flow     | ✅                 | ✅                    | ✅                   |
| Stacks   | ✅                 | ✅                    | ✅                   |
| Starknet | ✅                 | ✅                    | ✅                   |
| Sui      | ✅                 | ✅                    | ✅                   |
| Tron     | ✅                 | ✅                    | ✅                   |
| Osmosis  | ✅                 | ✅                    | ✅                   |
| Cardano  | ✅                 | ✅                    | ✅                   |


*BTC: Supports Supports BRC20-related functions, including inscription creation, BRC20 buying and selling.

## Main modules

- crypto-lib: Handles general security and signature algorithms.
- coin-base: Provides  coin common interface.
- coin-*: Implements transaction creation and signature in each coin type.


## Example

For specific usage examples of each coin type, please refer to the corresponding test files. Remember to replace the
placeholder private key with your own private key, which is generally in hex format.

## Feedback

You can provide feedback directly in GitHub Issues, and we will respond promptly.

## License
Most packages or folders are MIT licensed, see package or folder for the respective license.
