// Copyright © Aptos Foundation
// SPDX-License-Identifier: Apache-2.0
import {Network} from "../utils/apiEndpoints";
import {AptosSettings, ClientConfig, Client} from "../types";
import {DEFAULT_NETWORK} from "../utils";

/**
 * This class holds the config information for the SDK client instance.
 */
export class AptosConfig {
    /** The Network that this SDK is associated with. Defaults to DEVNET */
    readonly network: Network;
    /**
     * The optional hardcoded fullnode URL to send requests to instead of using the network
     */
    readonly fullnode?: string;

    /**
     * The optional hardcoded faucet URL to send requests to instead of using the network
     */
    readonly faucet?: string;

    /**
     * The optional hardcoded indexer URL to send requests to instead of using the network
     */
    readonly indexer?: string;

    readonly clientConfig?: ClientConfig;

    constructor(settings?: AptosSettings) {
        this.network = settings?.network ?? DEFAULT_NETWORK;
        this.fullnode = settings?.fullnode;
        this.faucet = settings?.faucet;
        this.indexer = settings?.indexer;
        this.clientConfig = settings?.clientConfig ?? {};
    }
}
