/**
 * The following methods are based on `solana-program-library`, thanks for their work
 * https://github.com/solana-labs/solana-program-library/tree/master/token/js/src/instructions
 */
import { AccountMeta, PublicKey, Signer } from '../../web3';

/** @internal */
/*export function addSigners(keys: AccountMeta[], ownerOrAuthority: PublicKey, multiSigners: Signer[]): AccountMeta[] {
    if (multiSigners.length) {
        keys.push({ pubkey: ownerOrAuthority, isSigner: false, isWritable: false });
        for (const signer of multiSigners) {
            keys.push({ pubkey: signer.publicKey, isSigner: true, isWritable: false });
        }
    } else {
        keys.push({ pubkey: ownerOrAuthority, isSigner: true, isWritable: false });
    }
    return keys;
}*/

/** @internal */
export function addSigners(
    keys: AccountMeta[],
    ownerOrAuthority: PublicKey,
    multiSigners: (Signer | PublicKey)[]
): AccountMeta[] {
    if (multiSigners.length) {
        keys.push({ pubkey: ownerOrAuthority, isSigner: false, isWritable: false });
        for (const signer of multiSigners) {
            keys.push({
                pubkey: signer instanceof PublicKey ? signer : signer.publicKey,
                isSigner: true,
                isWritable: false,
            });
        }
    } else {
        keys.push({ pubkey: ownerOrAuthority, isSigner: true, isWritable: false });
    }
    return keys;
}