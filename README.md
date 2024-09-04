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
To build the SDK locally and run tests:

```shell
git clone https://github.com/okx/js-wallet-sdk.git
cd js-wallet-sdk
sh build.sh
```

## Supported Chains

| Package | Generate Address | Sign Transaction | Sign Message | Version |
|---------|:----------------:|:-----------------:|:------------:|:-------:|
| [@okxweb3/coin-bitcoin](https://www.npmjs.com/package/@okxweb3/coin-bitcoin) | ✅ | ✅ | ✅ | ![npm](https://img.shields.io/npm/v/@okxweb3/coin-bitcoin) |
| [@okxweb3/coin-ethereum](https://www.npmjs.com/package/@okxweb3/coin-ethereum) | ✅ | ✅ | ✅ | ![npm](https://img.shields.io/npm/v/@okxweb3/coin-ethereum) |
| [@okxweb3/coin-aptos](https://www.npmjs.com/package/@okxweb3/coin-aptos) | ✅ | ✅ | ✅ | ![npm](https://img.shields.io/npm/v/@okxweb3/coin-aptos) |
| [@okxweb3/coin-cosmos](https://www.npmjs.com/package/@okxweb3/coin-cosmos) | ✅ | ✅ | ✅ | ![npm](https://img.shields.io/npm/v/@okxweb3/coin-cosmos) |
| [@okxweb3/coin-eos](https://www.npmjs.com/package/@okxweb3/coin-eos) | ✅ | ✅ | ✅ | ![npm](https://img.shields.io/npm/v/@okxweb3/coin-eos) |
| [@okxweb3/coin-stacks](https://www.npmjs.com/package/@okxweb3/coin-stacks) | ✅ | ✅ | ✅ | ![npm](https://img.shields.io/npm/v/@okxweb3/coin-stacks) |
| [@okxweb3/coin-starknet](https://www.npmjs.com/package/@okxweb3/coin-starknet) | ✅ | ✅ | ✅ | ![npm](https://img.shields.io/npm/v/@okxweb3/coin-starknet) |
| [@okxweb3/coin-sui](https://www.npmjs.com/package/@okxweb3/coin-sui) | ✅ | ✅ | ✅ | ![npm](https://img.shields.io/npm/v/@okxweb3/coin-sui) |
| [@okxweb3/coin-near](https://www.npmjs.com/package/@okxweb3/coin-near) | ✅ | ✅ | ✅ | ![npm](https://img.shields.io/npm/v/@okxweb3/coin-near) |
| [@okxweb3/coin-tron](https://www.npmjs.com/package/@okxweb3/coin-tron) | ✅ | ✅ | ✅ | ![npm](https://img.shields.io/npm/v/@okxweb3/coin-tron) |
| [@okxweb3/coin-ton](https://www.npmjs.com/package/@okxweb3/coin-ton) | ✅ | ✅ | ✅ | ![npm](https://img.shields.io/npm/v/@okxweb3/coin-ton) |
| [@okxweb3/coin-cardano](https://www.npmjs.com/package/@okxweb3/coin-cardano) | ✅ | ✅ | ✅ | ![npm](https://img.shields.io/npm/v/@okxweb3/coin-cardano) |
| [@okxweb3/coin-solana](https://www.npmjs.com/package/@okxweb3/coin-solana) | ✅ | ✅ | ✅ | ![npm](https://img.shields.io/npm/v/@okxweb3/coin-solana) |
| [@okxweb3/coin-kaspa](https://www.npmjs.com/package/@okxweb3/coin-kaspa) | ✅ | ✅ | ✅ | ![npm](https://img.shields.io/npm/v/@okxweb3/coin-kaspa) |

*Note: Bitcoin support includes core functions for BRC20 ,Atomicals and Runes protocols, such as deployment, minting, transfer, and trading. This covers inscription creation, buying, selling, and other advanced operations across these Bitcoin-based token standards.

## Architecture

The OKX Web3 Wallet SDK is composed of three main modules:

1. **crypto-lib**: Handles general security and signature algorithms.
2. **coin-base**: Provides a common interface for all supported coins.
3. **coin-specific packages**: Implement transaction creation and signing for each supported blockchain.

## Usage

Here's a basic exampl of how to use the SDK with Ethereum:

```javascript
const { EthWallet } = require('@okxweb3/coin-ethereum');
const privateKey = "your_private_key_here";

async function run() {
    const wallet = new EthWallet();
    let params = {
        privateKey: privateKey
    };
    let address = await wallet.getNewAddress(params);
    console.log('Ethereum address:', address);

    let ethTxParams = {
        to: "0xee7c7f76795cd0cab3885fee6f2c50def89f48a3",
        value: 1,
        nonce: 5,
        gasPrice: "100000000000",
        gasLimit: 21000,
        chainId: 42,
    };
    let signParams = {
        privateKey: privateKey,
        data: ethTxParams
    };
    let tx = await wallet.signTransaction(signParams);
    console.log('Signed transaction:', tx);
}

run();
```

For more detailed examples and usage instructions for each supported blockchain, please refer to the documentation in the respective coin-specific package.


## Feedback and Support

We encourage everyone to use our [online demo](https://okx.github.io/wallet-sdk-demo/) and [documentation](https://okx.github.io/js-wallet-sdk/). If you encounter any issues or have suggestions, please submit them through [GitHub Issues](https://github.com/okx/js-wallet-sdk/issues).

## Security

If you find security risks, it is recommended to feedback through the following channels and get your reward!
submit on HackerOne platform https://hackerone.com/okg Or on our OKX feedback submission page > security bugs https://www.okx.com/feedback/submit


## License

The OKX Web3 Wallet SDK is open-sourced software licensed under the [MIT license](LICENSE).