// Copyright © Aptos Foundation
// SPDX-License-Identifier: Apache-2.0
export enum Network {
    MAINNET = "mainnet",
    TESTNET = "testnet",
    DEVNET = "devnet",
    LOCAL = "local",
    CUSTOM = "custom",
}

export const NetworkToChainId: Record<string, number> = {
    mainnet: 1,
    testnet: 2,
};

export const NetworkToNetworkName: Record<string, Network> = {
    mainnet: Network.MAINNET,
    testnet: Network.TESTNET,
    devnet: Network.DEVNET,
    local: Network.LOCAL,
    custom: Network.CUSTOM,
};
