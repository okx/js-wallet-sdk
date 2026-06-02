import {
    WALLET_IDENTITY_PATH,
    generateWalletPublicKey,
    signWalletMessage,
    generateWalletPublicKeys,
    signWalletMessages,
    WalletPubKeyItem,
    WalletSignItem,
    PassphraseNotSupportedError,
} from '../src';
import { signUtil } from '@okxweb3/crypto-lib';
import * as fs from 'fs';
import * as path from 'path';

const BASE_MNEMONIC =
    'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
const ALT_MNEMONIC =
    'legal winner thank year wave sausage worth useful legal winner thank yellow';
// 15-word, reused from coin-xrp/tests/xrp.test.ts
const LEN15_MNEMONIC =
    'draw attack antique swing base employ blur above palace lucky glide clap pen use illegal';
// 24-word, reused from coin-stellar/tests/wallet.test.ts
const LEN24_MNEMONIC =
    'bench hurt jump file august wise shallow faculty impulse spring exact slush thunder author capable act festival slice deposit sauce coconut afford frown better';
const BASE_MESSAGE = 'Rename wallet to My Savings';
const TREZOR_PASSPHRASE = 'TREZOR';

// ---------- Local EIP-191 digest (mirror of internal helper, for verify-side tests only) ----------

function resolveMessageBytesLocal(message: string): Buffer {
    const isHexString = (v: string) => !!v.match(/^0x[0-9A-Fa-f]*$/);
    if (isHexString(message)) {
        let s = message.startsWith('0x') ? message.slice(2) : message;
        if (s.length % 2 !== 0) s = '0' + s;
        return Buffer.from(s, 'hex');
    }
    return Buffer.from(message, 'utf8');
}

function eip191DigestLocal(message: string): Buffer {
    const msgBytes = resolveMessageBytesLocal(message);
    // EIP-191: `\x19Ethereum Signed Message:\n<len>` || msgBytes -> keccak256
    const prefix = Buffer.from(
        `\x19Ethereum Signed Message:\n${msgBytes.length}`,
        'utf8'
    );
    const { keccak_256 } = require('@noble/hashes/sha3');
    return Buffer.from(keccak_256(Buffer.concat([prefix, msgBytes])));
}

function splitSignatureRSV(sig: string): {
    r: Buffer;
    s: Buffer;
    v: number;
    sig64: Buffer;
    recovery: number;
} {
    const hex = sig.startsWith('0x') ? sig.slice(2) : sig;
    const bytes = Buffer.from(hex, 'hex');
    const r = bytes.slice(0, 32);
    const s = bytes.slice(32, 64);
    const v = bytes[64];
    return {
        r,
        s,
        v,
        sig64: Buffer.concat([r, s]),
        recovery: v - 27,
    };
}

// ---------- Optional external-verifier gate (AC-9) ----------

let externalVerifier: {
    verifyMessage: (t: number, m: string, s: Buffer) => Buffer;
    PERSONAL_SIGN: number;
} | null = null;
try {
    // Tests may import other @okxweb3/coin-* packages; only src/ is constrained by AC-19.
    // coin-ethereum must be pre-built; if not, we gracefully skip group 6.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const ce = require('@okxweb3/coin-ethereum');
    if (
        ce &&
        typeof ce.verifyMessage === 'function' &&
        ce.MessageTypes &&
        typeof ce.MessageTypes.PERSONAL_SIGN === 'number'
    ) {
        externalVerifier = {
            verifyMessage: ce.verifyMessage,
            PERSONAL_SIGN: ce.MessageTypes.PERSONAL_SIGN,
        };
    }
} catch (_) {
    externalVerifier = null;
}

// =====================================================================
// Group 1 — path constant (AC-10)
// =====================================================================

describe('wallet-identity: path constant (AC-10)', () => {
    test('WALLET_IDENTITY_PATH is the exact PRD literal', () => {
        expect(WALLET_IDENTITY_PATH).toBe("m/2013'/5197400'/0'/0/0");
    });
});

// =====================================================================
// Group 2 — FR-1 generateWalletPublicKey (AC-1, AC-2, AC-3)
// =====================================================================

describe('wallet-identity: FR-1 generateWalletPublicKey (AC-1, AC-2, AC-3)', () => {
    test('shape: 0x-prefixed 130-char lowercase hex (uncompressed)', async () => {
        const pub = await generateWalletPublicKey(BASE_MNEMONIC);
        expect(pub).toMatch(/^0x[0-9a-f]{130}$/);
        expect(pub.startsWith('0x04')).toBe(true);
    });

    test('determinism: two calls return byte-equal strings', async () => {
        const a = await generateWalletPublicKey(BASE_MNEMONIC);
        const b = await generateWalletPublicKey(BASE_MNEMONIC);
        expect(a).toBe(b);
    });

    test('different mnemonics produce different pubkeys', async () => {
        const a = await generateWalletPublicKey(BASE_MNEMONIC);
        const b = await generateWalletPublicKey(ALT_MNEMONIC);
        expect(a).not.toBe(b);
    });

    test('empty passphrase yields same pubkey as no passphrase', async () => {
        const noPass = await generateWalletPublicKey(BASE_MNEMONIC);
        const emptyPass = await generateWalletPublicKey(BASE_MNEMONIC, '');
        expect(emptyPass).toBe(noPass);
    });

    test('non-empty passphrase rejects with PassphraseNotSupportedError', async () => {
        await expect(
            generateWalletPublicKey(BASE_MNEMONIC, TREZOR_PASSPHRASE)
        ).rejects.toBe(PassphraseNotSupportedError);
    });
});

// =====================================================================
// Group 3 — FR-2 signature shape (AC-4)
// =====================================================================

describe('wallet-identity: FR-2 signature shape (AC-4)', () => {
    // secp256k1 n/2 (low-S bound).
    const SECP256K1_N_OVER_2 = BigInt(
        '0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0'
    );

    test('0x + 130 hex chars, V ∈ {0x1b, 0x1c}, low-S', async () => {
        const sig = await signWalletMessage(BASE_MNEMONIC, BASE_MESSAGE);
        expect(sig).toMatch(/^0x[0-9a-f]{130}$/);

        const { s, v } = splitSignatureRSV(sig);
        expect([0x1b, 0x1c]).toContain(v);

        const sBN = BigInt('0x' + s.toString('hex'));
        expect(sBN <= SECP256K1_N_OVER_2).toBe(true);
    });

    test('empty passphrase yields same signature as no passphrase', async () => {
        const noPass = await signWalletMessage(BASE_MNEMONIC, BASE_MESSAGE);
        const emptyPass = await signWalletMessage(
            BASE_MNEMONIC,
            BASE_MESSAGE,
            ''
        );
        expect(emptyPass).toBe(noPass);
    });

    test('non-empty passphrase rejects with PassphraseNotSupportedError', async () => {
        await expect(
            signWalletMessage(BASE_MNEMONIC, BASE_MESSAGE, TREZOR_PASSPHRASE)
        ).rejects.toBe(PassphraseNotSupportedError);
    });
});

// =====================================================================
// Group 4 — FR-2 round-trip (AC-5)
// =====================================================================

describe('wallet-identity: FR-2 round-trip (AC-5)', () => {
    test('secp256k1.verify recovers the same pubkey', async () => {
        const pub = await generateWalletPublicKey(BASE_MNEMONIC);
        const sig = await signWalletMessage(BASE_MNEMONIC, BASE_MESSAGE);
        const { sig64, recovery } = splitSignatureRSV(sig);

        const pubBytes = Buffer.from(pub.slice(2), 'hex');
        const digest = eip191DigestLocal(BASE_MESSAGE);

        expect(
            signUtil.secp256k1.verify(digest, sig64, recovery, pubBytes)
        ).toBe(true);
    });

    test('secp256k1.verifyWithNoRecovery returns true', async () => {
        const pub = await generateWalletPublicKey(BASE_MNEMONIC);
        const sig = await signWalletMessage(BASE_MNEMONIC, BASE_MESSAGE);
        const { sig64 } = splitSignatureRSV(sig);

        const pubBytes = Buffer.from(pub.slice(2), 'hex');
        const digest = eip191DigestLocal(BASE_MESSAGE);

        expect(
            signUtil.secp256k1.verifyWithNoRecovery(digest, sig64, pubBytes)
        ).toBe(true);
    });
});

// =====================================================================
// Group 5 — FR-2 tampered negatives (AC-6)
// =====================================================================

describe('wallet-identity: FR-2 tampered negatives (AC-6)', () => {
    test('signature of msg A fails to verify under msg B', async () => {
        const pub = await generateWalletPublicKey(BASE_MNEMONIC);
        const sig = await signWalletMessage(BASE_MNEMONIC, BASE_MESSAGE);
        const { sig64, recovery } = splitSignatureRSV(sig);

        const pubBytes = Buffer.from(pub.slice(2), 'hex');
        const tamperedDigest = eip191DigestLocal(BASE_MESSAGE + ' (tampered)');

        expect(
            signUtil.secp256k1.verify(tamperedDigest, sig64, recovery, pubBytes)
        ).toBe(false);
    });

    test('signature from mnemonic X fails to verify under mnemonic Y pubkey', async () => {
        const pubY = await generateWalletPublicKey(ALT_MNEMONIC);
        const sigX = await signWalletMessage(BASE_MNEMONIC, BASE_MESSAGE);
        const { sig64 } = splitSignatureRSV(sigX);

        const pubYBytes = Buffer.from(pubY.slice(2), 'hex');
        const digest = eip191DigestLocal(BASE_MESSAGE);

        expect(
            signUtil.secp256k1.verifyWithNoRecovery(digest, sig64, pubYBytes)
        ).toBe(false);
    });
});

// =====================================================================
// Group 6 — AC-9 external EIP-191 interop (via @okxweb3/coin-ethereum)
// =====================================================================

const describeExternal = externalVerifier ? describe : describe.skip;
describeExternal('wallet-identity: AC-9 external EIP-191 interop', () => {
    test('coin-ethereum.verifyMessage(PERSONAL_SIGN) recovers the wallet pubkey', async () => {
        const pub = await generateWalletPublicKey(BASE_MNEMONIC);
        const sig = await signWalletMessage(BASE_MNEMONIC, BASE_MESSAGE);
        const sigBytes = Buffer.from(sig.slice(2), 'hex');

        const recovered = externalVerifier!.verifyMessage(
            externalVerifier!.PERSONAL_SIGN,
            BASE_MESSAGE,
            sigBytes
        );

        // Normalize both pubkeys to compressed (33B: 02/03 ‖ X) before
        // comparing. Our wallet pubkey is uncompressed (65B: 04 ‖ X ‖ Y);
        // coin-ethereum.verifyMessage may return compressed (33B), uncompressed
        // (65B), or raw (64B: X ‖ Y without the 0x04 prefix).
        const toCompressedHex = (hex: string): string => {
            if (hex.length === 66) return hex;
            if (hex.length === 130 && hex.startsWith('04')) {
                const x = hex.slice(2, 66);
                const yLast = parseInt(hex.slice(-2), 16);
                return (yLast & 1 ? '03' : '02') + x;
            }
            if (hex.length === 128) {
                const x = hex.slice(0, 64);
                const yLast = parseInt(hex.slice(-2), 16);
                return (yLast & 1 ? '03' : '02') + x;
            }
            throw new Error(
                `unexpected pubkey length: ${hex.length / 2} bytes`
            );
        };

        const ourPubHex = pub.slice(2);
        const recoveredHex = Buffer.from(recovered).toString('hex');
        expect(toCompressedHex(recoveredHex)).toBe(toCompressedHex(ourPubHex));
    });
});

// =====================================================================
// Group 7 — pinned canonical vectors (Go SDK parity)
//
// Mirrors go-sdk/mobile-signature wallet-identity test constants. Values are
// uncompressed SEC1 pubkeys (65B) and EIP-191 personal_sign signatures (65B).
// Go side stores them without the "0x" prefix; JS API returns them with the
// prefix, so we prepend "0x" when comparing.
// =====================================================================

describe('wallet-identity: pinned canonical vectors (Go SDK parity)', () => {
    const wantPubKeyBase =
        '0478e2ec23999a2ea48977c236432021ffeb6587d68136f66dc31b795a15d9ffd921c41ea7f5e5671e2d0223c6b87da0ed7cc5482404bfd6a46494b38e35add4be';
    const wantPubKeySecond =
        '047337785a465daa52395a510ada463def37f25a32723a286bfcfcabcac03fb9ede8c9e4cec69c579f5aa35d781477e6b86a73cca337ed1cb8dfe1bd45d2ec5f75';
    const wantSignatureBase =
        '1142c51e61619d26bb3c4786d8b2b003be4e7d607542994493d2b39ab7225e8e07d981466891f00345a4d5ede033c2d2a8fb5b6d520e9af5b66eec336a8f9fee1b';

    test('generateWalletPublicKey(BASE_MNEMONIC) matches wantPubKeyBase', async () => {
        const got = await generateWalletPublicKey(BASE_MNEMONIC);
        expect(got).toBe('0x' + wantPubKeyBase);
    });

    test('generateWalletPublicKey(ALT_MNEMONIC) matches wantPubKeySecond', async () => {
        const got = await generateWalletPublicKey(ALT_MNEMONIC);
        expect(got).toBe('0x' + wantPubKeySecond);
    });

    test('signWalletMessage(BASE_MNEMONIC, BASE_MESSAGE) matches wantSignatureBase', async () => {
        const got = await signWalletMessage(BASE_MNEMONIC, BASE_MESSAGE);
        expect(got).toBe('0x' + wantSignatureBase);
    });
});

// =====================================================================
// Group 8 — AC-11 parity on supported inputs
// =====================================================================

describe('wallet-identity: AC-11 parity on supported inputs', () => {
    test('UTF-8 message round-trips via secp256k1.verify', async () => {
        const pub = await generateWalletPublicKey(BASE_MNEMONIC);
        const msg = 'hello world';
        const sig = await signWalletMessage(BASE_MNEMONIC, msg);
        const { sig64, recovery } = splitSignatureRSV(sig);
        const digest = eip191DigestLocal(msg);
        const pubBytes = Buffer.from(pub.slice(2), 'hex');
        expect(
            signUtil.secp256k1.verify(digest, sig64, recovery, pubBytes)
        ).toBe(true);
    });

    test('0x-prefixed hex message round-trips via secp256k1.verify', async () => {
        const pub = await generateWalletPublicKey(BASE_MNEMONIC);
        const msg = '0xdeadbeef';
        const sig = await signWalletMessage(BASE_MNEMONIC, msg);
        const { sig64, recovery } = splitSignatureRSV(sig);
        const digest = eip191DigestLocal(msg);
        const pubBytes = Buffer.from(pub.slice(2), 'hex');
        expect(
            signUtil.secp256k1.verify(digest, sig64, recovery, pubBytes)
        ).toBe(true);
    });

    test('UTF-8 and 0x-hex produce different signatures', async () => {
        const sigUtf8 = await signWalletMessage(BASE_MNEMONIC, 'hello world');
        const sigHex = await signWalletMessage(BASE_MNEMONIC, '0xdeadbeef');
        expect(sigUtf8).not.toBe(sigHex);
    });
});

// =====================================================================
// Group 9 — FR-3 batch pubkey (AC-12)
// =====================================================================

describe('wallet-identity: FR-3 batch pubkey (AC-12)', () => {
    test('2-item batch preserves order and echoes labels', async () => {
        const items: WalletPubKeyItem[] = [
            { mnemonic: BASE_MNEMONIC, label: 'main' },
            { mnemonic: ALT_MNEMONIC, label: 'savings' },
        ];
        const out = await generateWalletPublicKeys(items);
        expect(out).toHaveLength(2);

        const expected0 = await generateWalletPublicKey(items[0].mnemonic);
        const expected1 = await generateWalletPublicKey(items[1].mnemonic);

        expect(out[0]).toEqual({ pubKey: expected0, label: 'main' });
        expect(out[1]).toEqual({ pubKey: expected1, label: 'savings' });
    });

    test('omits label when input has no label', async () => {
        const out = await generateWalletPublicKeys([
            { mnemonic: BASE_MNEMONIC },
        ]);
        expect(out).toHaveLength(1);
        expect(out[0]).not.toHaveProperty('label');
        expect(out[0].pubKey).toMatch(/^0x[0-9a-f]{130}$/);
    });

    test('empty items array returns empty array', async () => {
        const out = await generateWalletPublicKeys([]);
        expect(out).toEqual([]);
    });

    test('empty passphrase per item behaves like no passphrase', async () => {
        const out = await generateWalletPublicKeys([
            { mnemonic: BASE_MNEMONIC },
            { mnemonic: BASE_MNEMONIC, passphrase: '' },
        ]);
        expect(out[0].pubKey).toBe(out[1].pubKey);
    });

    test('non-empty passphrase in any item rejects with PassphraseNotSupportedError', async () => {
        await expect(
            generateWalletPublicKeys([
                { mnemonic: BASE_MNEMONIC },
                { mnemonic: BASE_MNEMONIC, passphrase: TREZOR_PASSPHRASE },
            ])
        ).rejects.toBe(PassphraseNotSupportedError);
    });
});

// =====================================================================
// Group 10 — FR-4 batch sign (AC-13)
// =====================================================================

describe('wallet-identity: FR-4 batch sign (AC-13)', () => {
    test('2-item batch preserves order and echoes labels', async () => {
        const items: WalletSignItem[] = [
            { mnemonic: BASE_MNEMONIC, message: 'msg A', label: 'main' },
            { mnemonic: ALT_MNEMONIC, message: 'msg B', label: 'trading' },
        ];
        const out = await signWalletMessages(items);
        expect(out).toHaveLength(2);

        const expected0 = await signWalletMessage(
            items[0].mnemonic,
            items[0].message
        );
        const expected1 = await signWalletMessage(
            items[1].mnemonic,
            items[1].message
        );

        expect(out[0]).toEqual({ signature: expected0, label: 'main' });
        expect(out[1]).toEqual({ signature: expected1, label: 'trading' });
    });

    test('omits label when input has no label', async () => {
        const out = await signWalletMessages([
            { mnemonic: BASE_MNEMONIC, message: BASE_MESSAGE },
        ]);
        expect(out).toHaveLength(1);
        expect(out[0]).not.toHaveProperty('label');
        expect(out[0].signature).toMatch(/^0x[0-9a-f]{130}$/);
    });

    test('empty items array returns empty array', async () => {
        const out = await signWalletMessages([]);
        expect(out).toEqual([]);
    });

    test('empty passphrase per item behaves like no passphrase', async () => {
        const out = await signWalletMessages([
            { mnemonic: BASE_MNEMONIC, message: BASE_MESSAGE },
            { mnemonic: BASE_MNEMONIC, message: BASE_MESSAGE, passphrase: '' },
        ]);
        expect(out[0].signature).toBe(out[1].signature);
    });

    test('non-empty passphrase in any item rejects with PassphraseNotSupportedError', async () => {
        await expect(
            signWalletMessages([
                { mnemonic: BASE_MNEMONIC, message: BASE_MESSAGE },
                {
                    mnemonic: BASE_MNEMONIC,
                    message: BASE_MESSAGE,
                    passphrase: TREZOR_PASSPHRASE,
                },
            ])
        ).rejects.toBe(PassphraseNotSupportedError);
    });
});

// =====================================================================
// Group 11 — batch fail-fast (AC-14)
// =====================================================================

describe('wallet-identity: batch fail-fast (AC-14)', () => {
    test('generateWalletPublicKeys rejects if any item is malformed', async () => {
        const items: WalletPubKeyItem[] = [
            { mnemonic: BASE_MNEMONIC },
            { mnemonic: 'not a real mnemonic' },
            { mnemonic: ALT_MNEMONIC },
        ];
        await expect(generateWalletPublicKeys(items)).rejects.toThrow();
    });

    test('signWalletMessages rejects if any item is malformed', async () => {
        const items: WalletSignItem[] = [
            { mnemonic: BASE_MNEMONIC, message: 'a' },
            { mnemonic: 'not a real mnemonic', message: 'b' },
            { mnemonic: ALT_MNEMONIC, message: 'c' },
        ];
        await expect(signWalletMessages(items)).rejects.toThrow();
    });
});

// =====================================================================
// Group 12 — mnemonic length variants (12 / 15 / 24)
// =====================================================================

describe('wallet-identity: mnemonic length variants', () => {
    const variants: Array<{ words: number; mnemonic: string }> = [
        { words: 12, mnemonic: BASE_MNEMONIC },
        { words: 12, mnemonic: ALT_MNEMONIC },
        { words: 15, mnemonic: LEN15_MNEMONIC },
        { words: 24, mnemonic: LEN24_MNEMONIC },
    ];

    test.each(variants)(
        '$words-word: pubkey shape + sign/verify round-trip',
        async ({ mnemonic }) => {
            const pub = await generateWalletPublicKey(mnemonic);
            expect(pub).toMatch(/^0x04[0-9a-f]{128}$/);

            const sig = await signWalletMessage(mnemonic, BASE_MESSAGE);
            expect(sig).toMatch(/^0x[0-9a-f]{130}$/);

            const { sig64, recovery } = splitSignatureRSV(sig);
            const pubBytes = Buffer.from(pub.slice(2), 'hex');
            const digest = eip191DigestLocal(BASE_MESSAGE);
            expect(
                signUtil.secp256k1.verify(digest, sig64, recovery, pubBytes)
            ).toBe(true);
        }
    );

    test('all variants produce distinct pubkeys', async () => {
        const pubs = await Promise.all(
            variants.map((v) => generateWalletPublicKey(v.mnemonic))
        );
        expect(new Set(pubs).size).toBe(variants.length);
    });
});

// =====================================================================
// Group 13 — AC-19 package-graph independence
// =====================================================================

describe('wallet-identity: AC-19 package-graph independence', () => {
    const COIN_BASE_DIR = path.resolve(__dirname, '..');
    const SRC_DIR = path.join(COIN_BASE_DIR, 'src');
    const ILLEGAL_IMPORT = /from ['"]@ok\/coin-(?!base)/;
    const ILLEGAL_DEP_KEY = /^@ok\/coin-(?!base)/;

    function walkTsFiles(dir: string): string[] {
        const out: string[] = [];
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                out.push(...walkTsFiles(full));
            } else if (entry.isFile() && entry.name.endsWith('.ts')) {
                out.push(full);
            }
        }
        return out;
    }

    test('no @okxweb3/coin-<non-base> imports in src/', () => {
        const files = walkTsFiles(SRC_DIR);
        const offenders: string[] = [];
        for (const f of files) {
            const content = fs.readFileSync(f, 'utf8');
            if (ILLEGAL_IMPORT.test(content)) {
                offenders.push(path.relative(COIN_BASE_DIR, f));
            }
        }
        expect(offenders).toEqual([]);
    });

    test('no @okxweb3/coin-<non-base> in package.json dependencies or peerDependencies', () => {
        const pkgPath = path.join(COIN_BASE_DIR, 'package.json');
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        const allDeps = {
            ...(pkg.dependencies || {}),
            ...(pkg.peerDependencies || {}),
        };
        const offenders = Object.keys(allDeps).filter((k) =>
            ILLEGAL_DEP_KEY.test(k)
        );
        expect(offenders).toEqual([]);
    });
});
