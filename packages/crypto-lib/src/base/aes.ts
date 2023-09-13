import * as cryptoJS from 'crypto-js';

export function encrypt(origin: string, key: string): string {
  const sKey = cryptoJS.enc.Utf8.parse(key);
  const encrypted = cryptoJS.AES.encrypt(origin, sKey, {
    iv: sKey,
    mode: cryptoJS.mode.CBC,
    padding: cryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
}

export function decrypt(cipher: string, key: string): string {
  const sKey = cryptoJS.enc.Utf8.parse(key);
  const decrypted = cryptoJS.AES.decrypt(cipher, sKey, {
    iv: sKey,
    mode: cryptoJS.mode.CBC,
    padding: cryptoJS.pad.Pkcs7,
  });
  return decrypted.toString(cryptoJS.enc.Utf8);
}
