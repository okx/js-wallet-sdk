import { encodePubKeyAddress, decodeAddress } from "./lib/address";

export function addressFromPubKey(pubKey: string) {
  return encodePubKeyAddress(pubKey, "kaspa");
}

export function validateAddress(address: string) {
  try {
    decodeAddress(address);
  } catch (e) {
    return false;
  }
  return true;
}
