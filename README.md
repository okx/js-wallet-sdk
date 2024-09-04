# OKX Web3 JS Wallet SDK

[![npm version](https://img.shields.io/npm/v/@okxweb3/coin-base.svg)](https://www.npmjs.com/package/@okxweb3/coin-base)
[![License](https://img.shields.io/npm/l/@okxweb3/coin-base.svg)](https://github.com/okx/js-wallet-sdk/blob/main/LICENSE)

OKX Web3 Wallet SDK is a comprehensive TypeScript/JavaScript solution for building wallet applications that support offline transactions across multiple blockchain networks. This SDK provides a unified interface for account management, transaction creation, and signing for various mainstream public blockchains.

## Features

- Multi-chain support
- Offline transaction signing
- Account generation and management
- Customizable transaction creation
- BRC20/Atomical/Runes.. support for Bitcoin
- Extensible architecture

## Documentation

For detailed documentation and API references, please visit our [online documentation](https://okx.github.io/js-wallet-sdk/).


## Online Demo

Try our [online signing demo](https://okx.github.io/wallet-sdk-demo/) to see the SDK in action.


## Installation

To use the OKX Web3 Wallet SDK, install the core packages and the specific coin packages you need:

```shell
# Core packages (required for all coins)
npm install @okxweb3/crypto-lib
npm install @okxweb3/coin-base

# coin-specific packages (install as needed)

npm install @okxweb3/coin-ethereum
npm install @okxweb3/coin-bitcoin

# ... other coin packages
```

## Build Locally
You can build the sdk locally ,and run test-code.

## Building from Source

To build the SDK locally and run tests:

```shell
git clone https://github.com/okx/js-wallet-sdk.git
cd js-wallet-sdk
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


*Note: Bitcoin support includes core functions for BRC20, Atomicals, and Runes protocols, such as deployment, minting, transfer, and trading. This covers inscription creation, buying, selling, and other advanced operations across these Bitcoin-based token standards.

## Architecture

The OKX Web3 Wallet SDK is composed of three main modules:

1. **crypto-lib**: Handles general security and signature algorithms.
2. **coin-base**: Provides a common interface for all supported coins.
3. **coin-specific packages**: Implement transaction creation and signing for each supported blockchain.

## Usage

Here's a basic exampl of how to use the SDK with Ethereum:

```javascript
    import { EthereumWallet } from '@okxweb3/coin-ethereum';
// Generate a new Ethereum wallet
const wallet = new EthereumWallet();
const address = wallet.getNewAddress();
console.log('New Ethereum address:', address);
// Create and sign a transaction
const transaction = {
    to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    value: '0.1',
    gasLimit: '21000',
    gasPrice: '20000000000'
};
const signedTx = wallet.signTransaction(transaction, 'your_private_key_here');
console.log('Signed transaction:', signedTx);
```

For more detailed examples and usage instructions for each supported blockchain, please refer to the documentation in the respective coin-specific package.


## Feedback and Support

We encourage everyone to use our [online demo](https://okx.github.io/wallet-sdk-demo/) and [documentation](https://okx.github.io/js-wallet-sdk/). If you encounter any issues or have suggestions, please submit them through [GitHub Issues](https://github.com/okx/js-wallet-sdk/issues).

## Security

If you have any usage problems, you can submit them through the issue method and we will help you troubleshoot the problem.
If you find security risks, it is recommended to feedback through the following channels and get your reward!
submit on HackerOne platform https://hackerone.com/okg?type=team Or on our OKX feedback submission page > security bugs https://www.okx.com/feedback/submit## License

## License

The OKX Web3 Wallet SDK is open-sourced software licensed under the [MIT license](LICENSE).
se our [online demo](https://okx.github.io/wallet-sdk-demo/) and [documentation](https://okx.github.io/js-wallet-sdk/). If you encounter any issues or have suggestions, please submit them through [GitHub Issues](https://github.com/okx/js-wallet-sdk/issues).