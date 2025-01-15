import {base, bip39, signUtil} from "@okxweb3/crypto-lib";
import {Bip32PrivateKey} from './cardano-sdk/crypto/Bip32'
import {Credential, CredentialType} from "./cardano-sdk/core/Cardano";
import {BaseAddress} from "./cardano-sdk/core/Cardano";
import {NetworkId} from "./cardano-sdk/core/Cardano";

export async function getNewAddress(privateKey: string) {
    await checkPrivateKey(privateKey)
    return await addressFromPubKey(await pubKeyFromPrivateKey(privateKey));
}

export async function checkPrivateKey(privateKey: string) {
    if (!base.validateHexString(privateKey)) {
        throw new Error('invalid key');
    }
    const keyBytes = base.fromHex(privateKey.toLowerCase())
    if(keyBytes.every(byte => byte===0)) {
        throw new Error("invalid key");
    }
    if (![32, 64, 96, 128].includes(keyBytes.length)) {
        throw new Error('invalid key');
    }
    return Promise.resolve(true);
}

export async function pubKeyFromPrivateKey(privateKey: string) {
    await checkPrivateKey(privateKey)

    const paymentPrivateKey = base.fromHex(privateKey.slice(0, 64))
    const stakePrivateKey = base.fromHex(privateKey.slice(128, 192))

    const paymentKey = signUtil.ed25519.ed25519MulBase(paymentPrivateKey)
    const stakeKey = signUtil.ed25519.ed25519MulBase(stakePrivateKey)

    return base.toHex(paymentKey) + base.toHex(stakeKey)
}

export async function addressFromPubKey(publicKey: string) {
    const paymentHash =base.blake2b(base.fromHex(publicKey.slice(0, 64)), {dkLen: 28, key: undefined})
    const stakeHash =base.blake2b(base.fromHex(publicKey.slice(64)), {dkLen: 28, key: undefined})

    const paymentCredential : Credential =  {type: CredentialType.KeyHash, hash: base.toHex(paymentHash)}
    const stakeCredential : Credential =  {type: CredentialType.KeyHash, hash: base.toHex(stakeHash)}

    const address = BaseAddress.fromCredentials(NetworkId.Mainnet, paymentCredential, stakeCredential)
    return address.toAddress().toBech32()
}


/** GetDerivedPrivateKey
 * the derivation path format is: m / purpose' / coin_type' / account' / role / index
 *
 * m: represents the root key in a HD wallet
 *
 * purpose: a constant set to 1852, which reference standards set by CIP1852
 *
 * coin_type: a constant set to 1815, which references the birth year of Ada Lovelace
 *
 * account: the account index. HD wallets support multiple accounts
 *
 * role: this indicates the role of the generated key based on the following:
 *
 * 0: external payment address
 *
 * 1: internal change address, which might be used in receiving change from transactions
 *
 * 2: staking key address
 *
 * index: the index of the key within the role
 */

export async function getDerivedPrivateKey(mnemonic: string, path: string) {
    const entropy = bip39.mnemonicToEntropy(mnemonic);
    const rootKey = await  Bip32PrivateKey.fromBip39Entropy(base.fromHex(entropy), '');

    const harden = (num: number): number => {
        return 0x80000000 + num;
    };
    const splitPath = path.split('/').slice(1);
    if (splitPath.length != 5) {
        throw new Error("invalid path")
    }
    const pathArray: number[] = [];
    splitPath.map((e, i) => {
        if (i < 3) {
            if (e.substring(e.length - 1, e.length) != "'") throw new Error("invalid path");
            pathArray.push(harden(parseInt(e.substring(0, e.length - 1), 10)))
        } else {
            pathArray.push(parseInt(e, 10))
        }
    });
    const accountKey = await rootKey.derive(pathArray.slice(0, 3))
    const keyToRawKeyHex = (key: Bip32PrivateKey) => Buffer.from(key.bytes().slice(0, 64)).toString("hex")

    const paymentKey = await accountKey.derive([0, pathArray[4]]).
        then(key => keyToRawKeyHex(key))
    const stakeKey = await accountKey.derive([2, pathArray[4]]).
        then(key => keyToRawKeyHex(key))

    return paymentKey + stakeKey
}
