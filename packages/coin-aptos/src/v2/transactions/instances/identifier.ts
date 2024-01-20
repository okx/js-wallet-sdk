// Copyright © Aptos Foundation
// SPDX-License-Identifier: Apache-2.0

import { Deserializer } from "../../bcs/deserializer";
import { Serializable, Serializer } from "../../bcs/serializer";

/**
 * Representation of an Identifier that can serialized and deserialized.
 * We use Identifier to represent the module "name" in "ModuleId" and
 * the "function name" in "EntryFunction"
 */
export class Identifier extends Serializable {
  public identifier: string;

  constructor(identifier: string) {
    super();
    this.identifier = identifier;
  }

  public serialize(serializer: Serializer): void {
    serializer.serializeStr(this.identifier);
  }

  static deserialize(deserializer: Deserializer): Identifier {
    const identifier = deserializer.deserializeStr();
    return new Identifier(identifier);
  }
}
