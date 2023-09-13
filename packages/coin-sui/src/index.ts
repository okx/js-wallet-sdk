import {Ed25519Keypair} from "./cryptography/ed25519-keypair";

export * from './cryptography/ed25519-keypair';
export * from './cryptography/keypair';
export * from './cryptography/ed25519-publickey';
export * from './cryptography/publickey';
export * from './cryptography/signature';


export * from './signers/txn-data-serializers/type-tag-serializer';

export * from './signers/signer';
export * from './signers/raw-signer';
export * from './signers/types';

export * from './types';
export * from './utils/format';
export * from './utils/intent';

export * from './framework';

export * from './builder';

export {fromB64, toB64} from './bcs';

export {is, assert} from 'superstruct';



import {base} from '@okxweb3/crypto-lib';
import {Ed25519PublicKey} from "./cryptography/ed25519-publickey";

export * from "./signers/raw-signer"
export * from "./signers/signer-with-provider"
export * from "./types"
export * from "./SuiWallet"

export function getAddressFromPrivate(privateKey: string) {
    const pk = base.fromHex(privateKey)
    const kp = Ed25519Keypair.fromSeed(pk)
    return {address:  kp.getPublicKey().toSuiAddress(), publicKey: base.toBase64(kp.getPublicKey().toBytes())}
}

export function getAddressFromPublic(publicKey: string) {
    const pk = base.fromBase64(publicKey)
    const p = new Ed25519PublicKey(pk)
    return p.toSuiAddress()
}
