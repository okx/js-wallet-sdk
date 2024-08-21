/* eslint-disable no-bitwise */
/* eslint-disable unicorn/number-literal-case */
import { add256bits, add28Mul8 } from './arithmetic';
import { base, signUtil } from "@okxweb3/crypto-lib";

/**
 * Check if the index is hardened.
 *
 * @param index The index to verify.
 * @returns true if hardened; otherwise; false.
 */
const isHardenedDerivation = (index: number) => index >= 0x80_00_00_00;

/**
 * Derives the private key with a hardened index.
 *
 * @param index The derivation index.
 * @param scalar Ed25519 curve scalar.
 * @param iv Ed25519 binary blob used as IV for signing.
 * @param chainCode The chain code.
 */
const deriveHardened = (
  index: number,
  scalar: Buffer,
  iv: Buffer,
  chainCode: Buffer
): { zMac: Uint8Array; ccMac: Uint8Array } => {
  const data = Buffer.allocUnsafe(1 + 64 + 4);
  data.writeUInt32LE(index, 1 + 64);
  scalar.copy(data, 1);
  iv.copy(data, 1 + 32);

  data[0] = 0x00;
  const zMac = base.hmacSHA512(chainCode, data);
  data[0] = 0x01;
  const ccMac = base.hmacSHA512(chainCode, data);

  return { ccMac, zMac };
};

/**
 * Derives the private key with a 'soft' index.
 *
 * @param index The derivation index.
 * @param scalar Ed25519 curve scalar.
 * @param chainCode The chain code.
 */
const deriveSoft = (index: number, scalar: Buffer, chainCode: Buffer): { zMac: Uint8Array; ccMac: Uint8Array } => {
  const data = Buffer.allocUnsafe(1 + 32 + 4);
  data.writeUInt32LE(index, 1 + 32);
  const vk = Buffer.from(signUtil.ed25519.ed25519MulBase(scalar))
  vk.copy(data, 1);

  data[0] = 0x02;
  const zMac = base.hmacSHA512(chainCode, data);
  data[0] = 0x03;
  const ccMac = base.hmacSHA512(chainCode, data);

  return { ccMac, zMac };
};

/**
 * Derive the given private key with the given index.
 *
 * # Security considerations
 *
 * hard derivation index cannot be soft derived with the public key.
 *
 * # Hard derivation vs Soft derivation
 *
 * If you pass an index below 0x80000000 then it is a soft derivation.
 * The advantage of soft derivation is that it is possible to derive the
 * public key too. I.e. derivation the private key with a soft derivation
 * index and then retrieving the associated public key is equivalent to
 * deriving the public key associated to the parent private key.
 *
 * Hard derivation index does not allow public key derivation.
 *
 * This is why deriving the private key should not fail while deriving
 * the public key may fail (if the derivation index is invalid).
 *
 * @param key The parent key to be derived.
 * @param index The derivation index.
 * @returns The child BIP32 key.
 */
export const derivePrivate = (key: Buffer, index: number): Buffer => {
  const kl = key.subarray(0, 32);
  const kr = key.subarray(32, 64);
  const cc = key.subarray(64, 96);

  const { ccMac, zMac } = isHardenedDerivation(index) ? deriveHardened(index, kl, kr, cc) : deriveSoft(index, kl, cc);

  const chainCode = ccMac.slice(32, 64);
  const zl = zMac.slice(0, 32);
  const zr = zMac.slice(32, 64);

  const left = add28Mul8(kl, zl);
  const right = add256bits(kr, zr);

  return Buffer.concat([Buffer.from(left), Buffer.from(right), Buffer.from(chainCode)]);
};
