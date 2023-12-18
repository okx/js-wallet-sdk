import { base, signUtil } from "@okxweb3/crypto-lib";
import { encodePubKeyAddress, decodeAddress } from "./lib/address";

export function pubKeyFromPrvKey(prvKey: string) {
    return base.toHex(signUtil.secp256k1.publicKeyCreate(base.fromHex(prvKey), true).slice(1));
}

export function addressFromPubKey(pubKey: string) {
    return encodePubKeyAddress(pubKey, "kaspa");
}

export function addressFromPrvKey(prvKey: string) {
    return addressFromPubKey(pubKeyFromPrvKey(prvKey));
}

export function validateAddress(address: string) {
    try {
        decodeAddress(address);
    } catch (e) {
        return false;
    }
    return true;
}
