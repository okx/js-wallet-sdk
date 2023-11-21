import {
    BaseWallet,
    GetDerivedPathParam,
    NewAddressParams,
    ValidAddressParams,
    SignTxParams,
    NotImplementedError, ValidAddressData,
} from "@okxweb3/coin-base";
import {
    base
} from "@okxweb3/crypto-lib";
import {addressFromPrvKey, encrypt, decrypt, npubEncode} from "./nostrassets";
import * as crypto from "crypto";
import * as Events from "events";
import {Event, getEventHash, getSignature} from "./event";
import {getPublicKey} from "./keys";

export enum nipOpType {
    NIP04_Encrypt = 1,
    NIP04_Decrypt = 2,
}


export class CryptTextParams {
    /**
     * Constructs a CryptTextParams instance.
     * @param type
     * @param pubkey
     * @param text
     */
    public constructor(
        public readonly type: nipOpType,
        public readonly pubkey: string,
        public readonly text: string,
    ) {
        // this.type = type;
        // this.pubkey = pubkey;
        // this.text = text;
    }
};

// @ts-ignore
if (typeof crypto !== 'undefined' && !crypto.subtle && crypto.webcrypto) {
    // @ts-ignore
    crypto.subtle = crypto.webcrypto.subtle
}
export const NewAddressError = "generate address error"
export type NewAddressData = {
    address: string;
    publicKey?: string;
};
export const nostrHdp = 'nsec';

export class NostrAssetsWallet extends BaseWallet {
    async getDerivedPath(param: GetDerivedPathParam): Promise<any> {
        return `m/86'/0'/0'/0/${param.index}`
    }

    checkPrivateKey(privateKey: string) {
        const keyBytes = base.fromHex(privateKey)
        return keyBytes.length == 32;
    }

    async getNewAddress(param: NewAddressParams): Promise<any> {
        try {
            if (!this.checkPrivateKey(param.privateKey)) {
                return Promise.reject(NewAddressError);
            }
            const data: NewAddressData = {
                address: addressFromPrvKey(param.privateKey),
                publicKey: npubEncode(getPublicKey(param.privateKey))
            };
            return Promise.resolve(data)
        } catch (e) {
            return Promise.reject(NewAddressError);
        }
    }

    async validAddress(param: ValidAddressParams): Promise<any> {
        var valid = false
        try {
            const [c, d] = base.fromBech32(param.address);
            valid = nostrHdp == c
        } catch (e) {
            console.log(e)
        }
        const data: ValidAddressData = {
            isValid: valid,
            address: param.address
        };
        return Promise.resolve(data);
    }

    async signTransaction(param: SignTxParams): Promise<any> {
        if (param.data instanceof CryptTextParams) {
            const textParams = param.data as CryptTextParams;
            switch (textParams.type) {
                case nipOpType.NIP04_Decrypt:
                    return decrypt(param.privateKey, textParams.pubkey, textParams.text)
                case nipOpType.NIP04_Encrypt:
                    return encrypt(param.privateKey, textParams.pubkey, textParams.text)
                default:
                    return Promise.reject(NotImplementedError)
            }
        } else {
            try {
                let event = param.data as Event
                event.pubkey = getPublicKey(param.privateKey)
                event.id = getEventHash(event)
                event.sig = getSignature(event, param.privateKey)
                return Promise.resolve(event)
            } catch (ex) {
                return Promise.reject(NotImplementedError)
            }
        }
    }
}
