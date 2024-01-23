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

    readonly moveModule?: string;

    constructor(settings?: AptosSettings) {
        this.network = settings?.network ?? DEFAULT_NETWORK;
        this.moveModule = settings?.moveModule;
    }
}
