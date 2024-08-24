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

|             | Account Generation | Transaction Creation | Transaction Signing | SDK NPM Link                                                                         |
|-------------|-------------------|----------------------|---------------------|--------------------------------------------------------------------------------------|
| BTC         | ✅                 | ✅                    | ✅                   | [@okxweb3/coin-bitcoin](https://www.npmjs.com/package/@okxweb3/coin-bitcoin)         | 
| Ethereum    | ✅                 | ✅                    | ✅                   | [@okxweb3/coin-ethereum](https://www.npmjs.com/package/@okxweb3/coin-ethereum)       | 
| Aptos       | ✅                 | ✅                    | ✅                   | [@okxweb3/coin-aptos](https://www.npmjs.com/package/@okxweb3/coin-aptos)             | 
| Cosmos      | ✅                 | ✅                    | ✅                   | [@okxweb3/coin-cosmos](https://www.npmjs.com/package/@okxweb3/coin-cosmos)           | 
| Eos         | ✅                 | ✅                    | ✅                   | [@okxweb3/coin-eos](https://www.npmjs.com/package/@okxweb3/coin-eos)                 | 
| Flow        | ✅                 | ✅                    | ✅                   | [@okxweb3/coin-flow](https://www.npmjs.com/package/@okxweb3/coin-flow)               | 
| Stacks      | ✅                 | ✅                    | ✅                   | [@okxweb3/coin-stacks](https://www.npmjs.com/package/@okxweb3/coin-stacks)           | 
| Starknet    | ✅                 | ✅                    | ✅                   | [@okxweb3/coin-starknet](https://www.npmjs.com/package/@okxweb3/coin-starknet)       | 
| Sui         | ✅                 | ✅                    | ✅                   | [@okxweb3/coin-sui](https://www.npmjs.com/package/@okxweb3/coin-sui)                 | 
| Near        | ✅                 | ✅                    | ✅                   | [@okxweb3/coin-near](https://www.npmjs.com/package/@okxweb3/coin-near)               | 
| Tron        | ✅                 | ✅                    | ✅                   | [@okxweb3/coin-tron](https://www.npmjs.com/package/@okxweb3/coin-tron)               | 
| Ton         | ✅                 | ✅                    | ✅                   | [@okxweb3/coin-ton](https://www.npmjs.com/package/@okxweb3/coin-ton)                 | 
| Osmosis     | ✅                 | ✅                    | ✅                   | [@okxweb3/coin-cosmos](https://www.npmjs.com/package/@okxweb3/coin-cosmos)           | 
| Cardano     | ✅                 | ✅                    | ✅                   | [@okxweb3/coin-cardano](https://www.npmjs.com/package/@okxweb3/coin-cardano)         | 
| Solana      | ✅                 | ✅                    | ✅                   | [@okxweb3/coin-solana](https://www.npmjs.com/package/@okxweb3/coin-solana)           | 
| Zkspace     | ✅                 | ✅                    | ✅                   | [@okxweb3/coin-zkspace](https://www.npmjs.com/package/@okxweb3/coin-zkspace)         | 
| Polkadot    | ✅                 | ✅                    | ✅                   | [@okxweb3/coin-polkadot](https://www.npmjs.com/package/@okxweb3/coin-polkadot)       | 
| Nostrassets | ✅                 | ✅                    | ✅                   | [@okxweb3/coin-nostrassets](https://www.npmjs.com/package/@okxweb3/coin-nostrassets) | 
| Kaspa       | ✅                 | ✅                    | ✅                   | [@okxweb3/coin-kaspa](https://www.npmjs.com/package/@okxweb3/coin-kaspa)             | 


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
