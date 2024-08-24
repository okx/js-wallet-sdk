// Copyright © Aptos Foundation
// SPDX-License-Identifier: Apache-2.0

import { Deserializer, Serializable } from "../bcs";

export type DeserializableClass<T extends Serializable> = {
  deserialize(deserializer: Deserializer): T;
};

/**
 * Utility function that serializes and deserialize an object back into the same bundle as the sdk.
 * This is a workaround to have the `instanceof` operator work when input objects come from a different
 * bundle.
 * @param cls The class of the object to normalize
 * @param value the instance to normalize
 */
export function normalizeBundle<T extends Serializable>(cls: DeserializableClass<T>, value: T) {
  const serializedBytes = value.bcsToBytes();
  const deserializer = new Deserializer(serializedBytes);
  return cls.deserialize(deserializer);
}
