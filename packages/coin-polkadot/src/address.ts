/**
 * The following methods are based on `polkadot-js`, thanks for their work
 * https://github.com/polkadot-js/common/tree/master/packages/util-crypto
 * https://github.com/polkadot-js/common/tree/master/packages/util
 */
import {base, signUtil} from "@okxweb3/crypto-lib";
import {stringToU8a} from "./string";
import {blake2AsU8a, u8aConcat, u8aToU8a} from "./u8a";
import {assert} from "./is";

const defaults = {
    allowedDecodedLengths: [1, 2, 4, 8, 32, 33],
    // publicKey has prefix + 2 checksum bytes, short only prefix + 1 checksum byte
    allowedEncodedLengths: [3, 4, 6, 10, 35, 36, 37, 38],
};

const SS58_PREFIX = stringToU8a('SS58PRE');
export function sshash (key: Uint8Array): Uint8Array {
    return blake2AsU8a(u8aConcat(SS58_PREFIX, key), 512);
}

// validate address
function checkAddressChecksum (decoded: Uint8Array): [boolean, number, number, number] {
    const ss58Length = (decoded[0] & 0b0100_0000) ? 2 : 1;
    const ss58Decoded = ss58Length === 1
        ? decoded[0]
        : ((decoded[0] & 0b0011_1111) << 2) | (decoded[1] >> 6) | ((decoded[1] & 0b0011_1111) << 8);

    // 32/33 bytes public + 2 bytes checksum + prefix
    const isPublicKey = [34 + ss58Length, 35 + ss58Length].includes(decoded.length);
    const length = decoded.length - (isPublicKey ? 2 : 1);

    // calculate the hash and do the checksum byte checks
    const hash = sshash(decoded.subarray(0, length));
    const isValid = (decoded[0] & 0b1000_0000) === 0 && ![46, 47].includes(decoded[0]) && (
        isPublicKey
            ? decoded[decoded.length - 2] === hash[0] && decoded[decoded.length - 1] === hash[1]
            : decoded[decoded.length - 1] === hash[0]
    );

    return [isValid, length, ss58Length, ss58Decoded];
}

// decode ss58 address
export function decodeAddress (encoded: string, ss58Format: number = -1): Uint8Array {
    try {
        const decoded = base.fromBase58(encoded);

        assert(defaults.allowedEncodedLengths.includes(decoded.length), 'Invalid decoded address length');

        const [isValid, endPos, ss58Length, ss58Decoded] = checkAddressChecksum(decoded);

        assert(isValid, 'Invalid decoded address checksum');
        assert([-1, ss58Decoded].includes(ss58Format), () => `Expected ss58Format ${ss58Format}, received ${ss58Decoded}`);

        return decoded.slice(ss58Length, endPos);
    } catch (error) {
        throw new Error(`Decoding ${encoded}: ${(error as Error).message}`);
    }
}

// encode ss58 address
export function encodeAddress (key: Uint8Array, ss58Format: number): string {
    const u8a = u8aToU8a(key);

    assert(ss58Format >= 0 && ss58Format <= 16383 && ![46, 47].includes(ss58Format), 'Out of range ss58Format specified');
    assert(defaults.allowedDecodedLengths.includes(u8a.length), () => `Expected a valid key to convert, with length ${defaults.allowedDecodedLengths.join(', ')}`);

    const input = u8aConcat(
        ss58Format < 64
            ? [ss58Format]
            : [
                ((ss58Format & 0b0000_0000_1111_1100) >> 2) | 0b0100_0000,
                (ss58Format >> 8) | ((ss58Format & 0b0000_0000_0000_0011) << 6)
            ],
        u8a
    );

    return base.toBase58(
        u8aConcat(
            input,
            sshash(input).subarray(0, [32, 33].includes(u8a.length) ? 2 : 1)
        )
    );
}

// get public key from address
export function address2Public(address: string): Uint8Array {
    return decodeAddress(address)
}

// get public key from private key
export function private2Public(privateKey: Uint8Array): Uint8Array {
    return signUtil.ed25519.publicKeyCreate(privateKey)
}