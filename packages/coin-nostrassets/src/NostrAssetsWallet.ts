import {
    BaseWallet,
    GetDerivedPathParam,
    NewAddressParams,
    ValidAddressParams,
    SignTxParams,
    NotImplementedError, ValidAddressData, secp256k1SignTest, GenPrivateKeyError, DerivePriKeyParams,
} from "@okxweb3/coin-base";
import {
    base, bip32, bip39
} from "@okxweb3/crypto-lib";
import {encrypt, decrypt, npubEncode, nsecFromPrvKey, decodeBytes, nsec, nostrHdp} from "./nostrassets";
import * as crypto from "crypto";
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

export class NostrAssetsWallet extends BaseWallet {
    async getDerivedPath(param: GetDerivedPathParam): Promise<any> {
        return `m/44'/1237'/${param.index}'/0/0`
    }

    getDerivedPrivateKey(param: DerivePriKeyParams): Promise<any> {
        return bip39.mnemonicToSeed(param.mnemonic)
            .then((masterSeed: Buffer) => {
                let childKey = bip32.fromSeed(masterSeed).derivePath(param.hdPath)
                if (childKey.privateKey) {
                    return Promise.resolve(nsecFromPrvKey(base.toHex(childKey.privateKey, false)));
                } else {
                    return Promise.reject(GenPrivateKeyError);
                }
            }).catch((e) => {
                return Promise.reject(GenPrivateKeyError);
            });
    }

    getRandomPrivateKey(): Promise<any> {
        try {
            while (true) {
                const privateKey = base.randomBytes(32)
                if (secp256k1SignTest(privateKey)) {
                    return Promise.resolve(nsecFromPrvKey(base.toHex(privateKey, false)));
                }
            }
        } catch (e) {
        }
        return Promise.reject(GenPrivateKeyError);
    }

    async getNewAddress(param: NewAddressParams): Promise<any> {
        try {
            const [c, d] = base.fromBech32(param.privateKey);
            let valid = nsec == c
            if (!valid) {
                return Promise.reject('invalid privateKey');
            }
            let pub = getPublicKey(base.toHex(d, false))
            const data: NewAddressData = {
                address: npubEncode(pub),
                publicKey: pub
            };
            return Promise.resolve(data)
        } catch (e) {
            return Promise.reject(e);
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
                let prv = decodeBytes(nsec, param.privateKey)
                let event = param.data as Event
                if (!event.pubkey) {
                    event.pubkey = getPublicKey(prv)
                }
                if (!event.id) {
                    event.id = getEventHash(event)
                }
                event.sig = getSignature(event, prv)
                return Promise.resolve(event)
            } catch (ex) {
                return Promise.reject(ex)
            }
        }
    }
}
