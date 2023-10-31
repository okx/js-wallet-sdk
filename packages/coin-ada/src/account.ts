import { base, bip39 } from "@okxweb3/crypto-lib";
import Loader from "./libs/loader";

export async function getNewAddress(privateKey: string) {
    return await addressFromPubKey(await pubKeyFromPrivateKey(privateKey));
}

export async function pubKeyFromPrivateKey(privateKey: string) {
    await Loader.load();
    // @ts-ignore
    const { PrivateKey } = Loader.Cardano;

    const paymentKey = PrivateKey.from_extended_bytes(base.fromHex(privateKey.slice(0, 128)));
    const stakeKey = PrivateKey.from_extended_bytes(base.fromHex(privateKey.slice(128)));

    return base.toHex(paymentKey.to_public().as_bytes()) + base.toHex(stakeKey.to_public().as_bytes());
}

export async function addressFromPubKey(publicKey: string) {
    await Loader.load();
    // @ts-ignore
    const { BaseAddress, NetworkInfo, StakeCredential, PublicKey } = Loader.Cardano;

    const paymentKeyHash = PublicKey.from_bytes(base.fromHex(publicKey.slice(0, 64))).hash();
    const stakeKeyHash = PublicKey.from_bytes(base.fromHex(publicKey.slice(64))).hash();

    return BaseAddress.new(
        NetworkInfo.mainnet().network_id(),
        StakeCredential.from_keyhash(paymentKeyHash),
        StakeCredential.from_keyhash(stakeKeyHash),
    )
        .to_address()
        .to_bech32(undefined);
}

export async function getDerivedPrivateKey(mnemonic: string, path: string) {
    await Loader.load();
    // @ts-ignore
    const { Bip32PrivateKey } = Loader.Cardano;

    const entropy = bip39.mnemonicToEntropy(mnemonic);
    const rootKey = Bip32PrivateKey.from_bip39_entropy(base.fromHex(entropy), new Uint8Array());

    const harden = (num: number): number => {
        return 0x80000000 + num;
    };
    const splitPath = path.split('/').slice(1);
    const accountKey = rootKey
        .derive(harden(1852))
        .derive(harden(1815))
        .derive(harden(parseInt(splitPath[2].slice(0, 1), 10)));

    const paymentKey = accountKey
        .derive(0)
        .derive(0)
        .to_raw_key();
    const stakeKey = accountKey
        .derive(2)
        .derive(0)
        .to_raw_key();

    return base.toHex(paymentKey.as_bytes()) + base.toHex(stakeKey.as_bytes());
}
