import { base, signUtil } from "@okxweb3/crypto-lib";
import { WalletContractV3R2, VenomWalletV3 } from "./ton";
import { Address } from "./ton-core";

export function getPubKeyBySeed(seed: string) {
    const { publicKey } = signUtil.ed25519.fromSeed(base.fromHex(seed));
    return base.toHex(publicKey);
}

export function getAddressBySeed(seed: string): string {
    const { publicKey } = signUtil.ed25519.fromSeed(base.fromHex(seed));
    const wallet = WalletContractV3R2.create({ workchain: 0, publicKey: Buffer.from(publicKey) });

    return wallet.address.toString();
}

export function getVenomAddressBySeed(seed: string): string {
    const { publicKey } = signUtil.ed25519.fromSeed(base.fromHex(seed));
    const wallet = VenomWalletV3.create({ workchain: 0, publicKey: Buffer.from(publicKey) });

    return wallet.address.toRawString();
}

export function validateAddress(address: string) {
    try {
        Address.parse(address);
    } catch (e) {
        return false;
    }
    return true;
}
