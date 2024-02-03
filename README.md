# DRC-20 Index update for Doginals

Please consider the updated DRC-20, Doginals index as well that is provided by the DPal wallet who provided the first inscription wallet services in DRC-20 doginals back in early last year. In the updated DRC-20 index it has handled the issues with security vulnerability, Sybil attack, witch nodes and double spending that were not taken care during initial DRC-20 Doginals index.
Public GitHub for the updated DRC-20, Doginals index as below 👇

https://github.com/dogexme/dogim-indexer

Please note that $dogim has killed the witch nodes of $dogi inscription/token from DRC-20, doginals.




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
