import {base} from "@okxweb3/crypto-lib"

export function validPrivateKey(privateKeyHex: string): boolean {
    if (!base.validateHexString(privateKeyHex)) {
        return false;
    }
    const privateKey = base.fromHex(privateKeyHex.toLowerCase())
    if (privateKey.length != 32 || privateKey.every(byte => byte === 0)) {
        return false;
    }
    return true;
}