import {base, signUtil} from "@okxweb3/crypto-lib";
import {encodePubKeyAddress, decodeAddress} from "./lib/address";

export function pubKeyFromPrvKey(prvKey: string) {
    if(!checkPrvKey(prvKey)){
        throw new Error("invalid key");
    }
    // todo check this rule
    return base.toHex(signUtil.secp256k1.publicKeyCreate(base.fromHex(prvKey.toLowerCase()), true).slice(1));
}

export function checkPrvKey(prvKey: string) {
    if (!base.validateHexString(prvKey)) {
        return false;
    }
    const buf = base.fromHex(prvKey.toLowerCase());
    return buf.length == 32 && !buf.every(byte=>byte===0)
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
