// Copyright © Aptos Foundation
// SPDX-License-Identifier: Apache-2.0
import {Network} from "../utils/apiEndpoints";
import {AptosSettings, MoveModuleBytecode} from "../types";

/**
 * This class holds the config information for the SDK client instance.
 */
export class AptosConfig {
    /** The Network that this SDK is associated with. Defaults to DEVNET */
    readonly network: Network;

    readonly moveModule?: string;
    readonly module?:MoveModuleBytecode;

    constructor(settings?: AptosSettings) {
        this.network = settings?.network ?? Network.DEVNET;
        this.moveModule = settings?.moveModule;
    }
}