import {
  ProgressCallback,
  decryptKeystoreJson,
  decryptKeystoreJsonSync,
  getAddress,
} from "ethers6";
import _ from "lodash";

import { isKIP3Json, splitKeystoreKIP3 } from "@kaiachain/js-ext-core";

// Decrypted keystore private keys.
export interface KeystoreAccountList {
  address: string;
  // The first private key in the privateKeyList. For backward compatilibilty with KeystoreAccount.
  privateKey: string;
  privateKeyList: string[];
}

function decryptKIP3(
  json: string,
  password: Uint8Array | string,
  progressCallback?: ProgressCallback
): Promise<KeystoreAccountList> {
  const obj = JSON.parse(json);
  const jsonList = splitKeystoreKIP3(json);
  const count = jsonList.length;

  const accounts = _.map(jsonList, (json, index) => {
    const result = decryptKeystoreJsonSync(json, password);
    if (progressCallback) {
      progressCallback((index + 1) / count);
    }
    return result;
  });

  return Promise.resolve({
    address: getAddress(obj.address), // the address may not coincide with private keys, get directly from the json.
    privateKey: accounts[0].privateKey,
    privateKeyList: _.map(accounts, (account) => account.privateKey),
  });
}

function decryptKIP3Sync(
  json: string,
  password: Uint8Array | string
): KeystoreAccountList {
  const obj = JSON.parse(json);
  const jsonList = splitKeystoreKIP3(json);

  const accounts = _.map(jsonList, (json) => {
    return decryptKeystoreJsonSync(json, password);
  });

  return {
    address: getAddress(obj.address), // the address may not coincide with private keys, get directly from the json.
    privateKey: accounts[0].privateKey,
    privateKeyList: _.map(accounts, (account) => account.privateKey),
  };
}

export function decryptKeystoreList(
  json: string,
  password: Uint8Array | string,
  progressCallback?: ProgressCallback
): Promise<KeystoreAccountList> {
  if (isKIP3Json(json)) {
    return decryptKIP3(json, password, progressCallback);
  } else {
    // Because ethers decryptJsonWallet is not an async function,
    // decryptJsonWalletList is not an async function either, hence using 'then'.
    return decryptKeystoreJson(json, password, progressCallback).then(
      (account) => {
        return {
          address: account.address,
          privateKey: account.privateKey,
          privateKeyList: [account.privateKey],
        };
      }
    );
  }
}

export function decryptKeystoreListSync(
  json: string,
  password: Uint8Array | string
): KeystoreAccountList {
  if (isKIP3Json(json)) {
    return decryptKIP3Sync(json, password);
  } else {
    const account = decryptKeystoreJsonSync(json, password);
    return {
      address: account.address,
      privateKey: account.privateKey,
      privateKeyList: [account.privateKey],
    };
  }
}
