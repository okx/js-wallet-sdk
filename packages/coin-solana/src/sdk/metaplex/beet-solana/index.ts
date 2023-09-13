/**
 * The following methods are based on `beet-solana`, thanks for their work
 * https://github.com/metaplex-foundation/beet/tree/master/beet-solana
 */
import { PublicKey } from '../../web3'
import {
  FixedSizeBeet,
  fixedSizeUint8Array,
} from '@metaplex-foundation/beet'

const uint8Array32 = fixedSizeUint8Array(32)

/**
 * De/Serializer for solana {@link PublicKey}s aka `publicKey`.
 *
 *
 * ## Using PublicKey Directly
 *
 * ```ts
 * import { publicKey } from '@metaplex-foundation/beet-solana'
 *
 * const generatedKey  = Keypair.generate().publicKey
 * const buf = Buffer.alloc(publicKey.byteSize)
 * beet.write(buf, 0, generatedKey)
 * beet.read(buf, 0) // same as generatedKey
 * ```
 *
 * ## PublicKey as part of a Struct Configuration
 *
 * ```ts
 * import { publicKey } from '@metaplex-foundation/beet-solana'
 *
 * type InstructionArgs = {
 *   authority: web3.PublicKey
 * }
 *
 * const createStruct = new beet.BeetArgsStruct<InstructionArgs>(
 *   [
 *     ['authority', publicKey]
 *   ],
 *   'InstructionArgs'
 * )
 * ```
 *
 * @category beet/solana
 */
export const publicKey: FixedSizeBeet<PublicKey> = {
  write: function (buf: Buffer, offset: number, value: PublicKey): void {
    const arr = value.toBytes()
    uint8Array32.write(buf, offset, arr)
  },
  read: function (buf: Buffer, offset: number): PublicKey {
    const bytes = uint8Array32.read(buf, offset)
    return new PublicKey(bytes)
  },

  byteSize: uint8Array32.byteSize,
  description: 'PublicKey',
}