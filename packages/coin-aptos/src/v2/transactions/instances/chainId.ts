// Copyright © Aptos Foundation
// SPDX-License-Identifier: Apache-2.0

import { Serializer, Serializable } from "../../bcs/serializer";
import { Deserializer } from "../../bcs/deserializer";

/**
 * Representation of a ChainId that can serialized and deserialized
 */
export class ChainId extends Serializable {
  public readonly chainId: number;

  constructor(chainId: number) {
    super();
    this.chainId = chainId;
  }

  serialize(serializer: Serializer): void {
    serializer.serializeU8(this.chainId);
  }

  static deserialize(deserializer: Deserializer): ChainId {
    const chainId = deserializer.deserializeU8();
    return new ChainId(chainId);
  }
}
