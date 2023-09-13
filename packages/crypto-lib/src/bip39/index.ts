/**
 * Copyright (c) 2014, Wei Lu <luwei.here@gmail.com> and Daniel Cousens <email@dcousens.com>
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 **/


import {randomBytes, sha256} from "../base";
import {pbkdf2} from "@noble/hashes/pbkdf2"

import { _default as _DEFAULT_WORDLIST, wordlists } from './_wordlists';
import {sha512} from "@noble/hashes/sha512";

let DEFAULT_WORDLIST: string[] | undefined = _DEFAULT_WORDLIST;

const INVALID_MNEMONIC = 'Invalid mnemonic';
const INVALID_ENTROPY = 'Invalid entropy';
const INVALID_CHECKSUM = 'Invalid mnemonic checksum';
const WORDLIST_REQUIRED =
    'A wordlist is required but a default could not be found.\n' +
    'Please pass a 2048 word array explicitly.';

function pbkdf2Promise(
    password: string | Buffer,
    saltMixin: string | Buffer,
    iterations: number,
    keylen: number,
    digest: string,
): Promise<Buffer> {
  const derivedKey = pbkdf2(sha512, password, saltMixin, {c: iterations, dkLen: keylen});
  return Promise.resolve(Buffer.from(derivedKey));
}

function normalize(str?: string): string {
  return (str || '').normalize('NFKD');
}

function lpad(str: string, padString: string, length: number): string {
  while (str.length < length) {
    str = padString + str;
  }
  return str;
}

function binaryToByte(bin: string): number {
  return parseInt(bin, 2);
}

function bytesToBinary(bytes: number[]): string {
  return bytes.map((x: number): string => lpad(x.toString(2), '0', 8)).join('');
}

function deriveChecksumBits(entropyBuffer: Buffer): string {
  const ENT = entropyBuffer.length * 8;
  const CS = ENT / 32;
  const hash = sha256(entropyBuffer)

  return bytesToBinary(Array.from(hash)).slice(0, CS);
}

function salt(password?: string): string {
  return 'mnemonic' + (password || '');
}

export function mnemonicToSeedSync(
    mnemonic: string,
    password?: string,
): Buffer {
  const mnemonicBuffer = Buffer.from(normalize(mnemonic), 'utf8');
  const saltBuffer = Buffer.from(salt(normalize(password)), 'utf8');
  const n = pbkdf2(sha512, mnemonicBuffer, saltBuffer, {c: 2048, dkLen: 64});
  return Buffer.from(n)
}

export function mnemonicToSeed(
    mnemonic: string,
    password?: string,
): Promise<Buffer> {
  return Promise.resolve().then(
      (): Promise<Buffer> => {
        const mnemonicBuffer = Buffer.from(normalize(mnemonic), 'utf8');
        const saltBuffer = Buffer.from(salt(normalize(password)), 'utf8');
        return pbkdf2Promise(mnemonicBuffer, saltBuffer, 2048, 64, 'sha512');
      },
  );
}

export function mnemonicToEntropy(
    mnemonic: string,
    wordlist?: string[],
): string {
  wordlist = wordlist || DEFAULT_WORDLIST;
  if (!wordlist) {
    throw new Error(WORDLIST_REQUIRED);
  }

  const words = normalize(mnemonic).split(' ');
  if (words.length % 3 !== 0) {
    throw new Error(INVALID_MNEMONIC);
  }

  // convert word indices to 11 bit binary strings
  const bits = words
      .map(
          (word: string): string => {
            const index = wordlist!.indexOf(word);
            if (index === -1) {
              throw new Error(INVALID_MNEMONIC);
            }

            return lpad(index.toString(2), '0', 11);
          },
      )
      .join('');

  // split the binary string into ENT/CS
  const dividerIndex = Math.floor(bits.length / 33) * 32;
  const entropyBits = bits.slice(0, dividerIndex);
  const checksumBits = bits.slice(dividerIndex);

  // calculate the checksum and compare
  const entropyBytes = entropyBits.match(/(.{1,8})/g)!.map(binaryToByte);
  if (entropyBytes.length < 16) {
    throw new Error(INVALID_ENTROPY);
  }
  if (entropyBytes.length > 32) {
    throw new Error(INVALID_ENTROPY);
  }
  if (entropyBytes.length % 4 !== 0) {
    throw new Error(INVALID_ENTROPY);
  }

  const entropy = Buffer.from(entropyBytes);
  const newChecksum = deriveChecksumBits(entropy);
  if (newChecksum !== checksumBits) {
    throw new Error(INVALID_CHECKSUM);
  }

  return entropy.toString('hex');
}

export function entropyToMnemonic(
    entropy: Buffer | string,
    wordlist?: string[],
): string {
  if (!Buffer.isBuffer(entropy)) {
    entropy = Buffer.from(entropy, 'hex');
  }
  wordlist = wordlist || DEFAULT_WORDLIST;
  if (!wordlist) {
    throw new Error(WORDLIST_REQUIRED);
  }

  // 128 <= ENT <= 256
  if (entropy.length < 16) {
    throw new TypeError(INVALID_ENTROPY);
  }
  if (entropy.length > 32) {
    throw new TypeError(INVALID_ENTROPY);
  }
  if (entropy.length % 4 !== 0) {
    throw new TypeError(INVALID_ENTROPY);
  }

  const entropyBits = bytesToBinary(Array.from(entropy));
  const checksumBits = deriveChecksumBits(entropy);

  const bits = entropyBits + checksumBits;
  const chunks = bits.match(/(.{1,11})/g)!;
  const words = chunks.map(
      (binary: string): string => {
        const index = binaryToByte(binary);
        return wordlist![index];
      },
  );

  return wordlist[0] === '\u3042\u3044\u3053\u304f\u3057\u3093' // Japanese wordlist
      ? words.join('\u3000')
      : words.join(' ');
}

export function generateMnemonic(
    strength?: number,
    rng?: (size: number) => Buffer,
    wordlist?: string[],
): string {
  strength = strength || 128;
  if (strength % 32 !== 0) {
    throw new TypeError(INVALID_ENTROPY);
  }
  rng = rng || randomBytes;

  return entropyToMnemonic(rng(strength / 8), wordlist);
}

export function validateMnemonic(
    mnemonic: string,
    wordlist?: string[],
): boolean {
  try {
    mnemonicToEntropy(mnemonic, wordlist);
  } catch (e) {
    return false;
  }

  return true;
}

export function setDefaultWordlist(language: string): void {
  const result = wordlists[language];
  if (result) {
    DEFAULT_WORDLIST = result;
  } else {
    throw new Error('Could not find wordlist for language "' + language + '"');
  }
}

export function getDefaultWordlist(): string {
  if (!DEFAULT_WORDLIST) {
    throw new Error('No Default Wordlist set');
  }
  return Object.keys(wordlists).filter(
      (lang: string): boolean => {
        if (lang === 'JA' || lang === 'EN') {
          return false;
        }
        return wordlists[lang].every(
            (word: string, index: number): boolean =>
                word === DEFAULT_WORDLIST![index],
        );
      },
  )[0];
}

export { wordlists } from './_wordlists';