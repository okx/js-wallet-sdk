/***
 *   Copyright © Aptos Foundation
 *SPDX-License-Identifier: Apache-2.0
 *
 * https://raw.githubusercontent.com/aptos-labs/aptos-core/097ea73b4a78c0166f22a269f27e514dc895afb4/ecosystem/typescript/sdk/LICENSE
 *
 * */

import { Deserializer, Serializer } from "../bcs";

export class Identifier {
  constructor(public value: string) {}

  public serialize(serializer: Serializer): void {
    serializer.serializeStr(this.value);
  }

  static deserialize(deserializer: Deserializer): Identifier {
    const value = deserializer.deserializeStr();
    return new Identifier(value);
  }
}
