import {
    BaseWallet,
    CalcTxHashError,
    CalcTxHashParams,
    DerivePriKeyParams,
    ed25519_getDerivedPrivateKey,
    ed25519_getRandomPrivateKey,
    GenPrivateKeyError,
    GetDerivedPathParam,
    NewAddressData,
    NewAddressError,
    NewAddressParams,
    SignTxError,
    SignTxParams,
    ValidAddressParams, ValidPrivateKeyData, ValidPrivateKeyParams,
} from "@okxweb3/coin-base";
import {
    checkSeed,
    convertAddress,
    getAddressBySeed,
    getPubKeyBySeed,
    getVenomAddressBySeed,
    parseAddress,
} from "./api/address";
import {jettonTransfer, JettonTxData, signMultiTransaction, transfer, TxData, venomTransfer} from "./api/transaction";
// import {mnemonicToSeed, validateMnemonic} from "./tonweb-mnemonic/src";
import {mnemonicToSeed, validateMnemonic} from "tonweb-mnemonic";
import {base, signUtil} from "@okxweb3/crypto-lib";
import {WalletContractV4} from "./ton/wallets/WalletContractV4";
import {Address, beginCell, Cell, Contract, storeStateInit} from "./ton-core";
import nacl from "tweetnacl";
import {buildNftTransferPayload, buildNotcoinVoucherExchange} from "./api";
import {NFT_TRANSFER_TONCOIN_AMOUNT, NOTCOIN_VOUCHERS_ADDRESS} from "./api/constant";

export type ValidateMnemonicParams = {
    mnemonicArray: string[],
    password: string
}

export type SignTonProofParams = {
    privateKey: string,
    walletAddress: string,
    tonProofItem: string,
    messageAction: string,
    messageSalt: string,
    proof: ApiTonConnectProof,
}

export type GetWalletInformationParams = {
    workChain: number,
    publicKey?: string,
    privateKey?: string,
    walletVersion?: string
}

export interface ApiTonConnectProof {
    timestamp: number;
    domain: string;
    payload: string;
}

export type TonTransferParam = {
    toAddress: string;
    amount: string;
    payload?: string;
    stateInit?: string; //base64
    isBase64Payload?: boolean;
}

export type SignMultiTransactionParams = {
    messages: TonTransferParam[],
    seqno: number,
    expireAt?: number,
    workchain?: number
}

export interface TransactionPayloadMessage {
    address: string;
    amount: string;
    payload?: string;
    stateInit?: string;
    isBase64Payload?: boolean;
}

export interface TransactionPayload {
    valid_until?: number;
    messages: TransactionPayloadMessage[];
    seqno: number,
    network?: string;
    from?: string;
    publicKey?: string;
}

export interface ApiNft {
    index: number;
    name?: string;
    address: string;
    thumbnail: string;
    image: string;
    description?: string;
    collectionName?: string;
    collectionAddress?: string;
    isOnSale: boolean;
    isHidden?: boolean;
    isOnFragment?: boolean;
    isScam?: boolean;
}

export type SignMultiTransactionForNFTParams = {
    fromNFTAddress: string;
    nftAddresses: string[];
    toAddress: string;
    comment?: string;
    nfts?: ApiNft[];
    seqno: number,
    expireAt?: number,
    workchain?: number
}

export type BuildNotcoinVoucherExchangeParams = {
    fromNFTAddress: string,
    nftAddress: string,
    nftIndex: number,
}

export type BuildNftTransferPayloadParams = {
    fromNFTAddress: string,
    nftAddress: string,
    comment: string,
}


function checkPrivateKey(privateKeyHex: string):boolean{
    var privateKey = privateKeyHex.startsWith('0x')? privateKeyHex:'0x'+privateKeyHex;
    if (!base.isHexString(privateKey)) {
        return false;
    }
    return true
}

export class TonWallet extends BaseWallet {
    async getRandomPrivateKey(): Promise<any> {
        try {
            return Promise.resolve(ed25519_getRandomPrivateKey(false, "hex"));
        } catch (e) {
            return Promise.reject(GenPrivateKeyError);
        }
    }

    // derive path of okx
    async getDerivedPath(param: GetDerivedPathParam): Promise<any> {
        return `m/44'/607'/${param.index}'`;
    }

    async getDerivedPrivateKey(param: DerivePriKeyParams): Promise<any> {
        try {
            if (param.hdPath) {
                return Promise.resolve(ed25519_getDerivedPrivateKey(param, false, "hex"));
            } else { // ton official derived path is null
                const seedBytes = await mnemonicToSeed(param.mnemonic.split(` `));
                const seed = base.toHex(seedBytes);
                return Promise.resolve(seed);
            }
        } catch (e) {
            return Promise.reject(GenPrivateKeyError);
        }
    }

    async getNewAddress(param: NewAddressParams): Promise<any> {
        try {
            let key = param.privateKey;
            if (!key.toLowerCase().startsWith("0x")) {
                key = '0x' + param.privateKey;
            }
            if (!base.isHexString(key.toLowerCase())) {
                return Promise.reject(NewAddressError);
            }
            const data: NewAddressData = {
                address: getAddressBySeed(key.toLowerCase()),
                publicKey: getPubKeyBySeed(key.toLowerCase()),
            };
            return Promise.resolve(data);
        } catch (e) {
            return Promise.reject(NewAddressError);
        }
    }

    async validPrivateKey(param: ValidPrivateKeyParams): Promise<any> {
        checkSeed(param.privateKey)
        const data: ValidPrivateKeyData = {
            isValid: true,
            privateKey: param.privateKey
        };
        return Promise.resolve(data);
    }

    async validAddress(param: ValidAddressParams): Promise<any> {
        // const data: ValidAddressData = {
        //     isValid: validateAddress(param.address),
        //     address: param.address,
        // };
        // return Promise.resolve(data);
        const res = parseAddress(param.address)
        return Promise.resolve(res);
    }

    async parseAddress(param: ValidAddressParams): Promise<any> {
        const res = parseAddress(param.address)
        return Promise.resolve(res);
    }

    async convertAddress(param: ValidAddressParams) {
        const res = convertAddress(param.address);
        return Promise.resolve(res);
    }

    async validateMnemonicOfTon(param: ValidateMnemonicParams): Promise<any> {
        return validateMnemonic(param.mnemonicArray, param.password);
    }

    async signTransaction(param: SignTxParams): Promise<any> {
        const data = param.data as TxData;
        try {
            if (data.type == "transfer") {
                return transfer(param.data as TxData, param.privateKey);
            } else if (data.type == "jettonTransfer") {
                return jettonTransfer(param.data as JettonTxData, param.privateKey);
            }
        } catch (e) {
            return Promise.reject(SignTxError);
        }
    }

    async signJettonTransaction(param: SignTxParams): Promise<any> {
        try {
            return jettonTransfer(param.data as JettonTxData, param.privateKey);
        } catch (e) {
            return Promise.reject(SignTxError);
        }
    }

    async getWalletInformation(params: GetWalletInformationParams) {
        const {workChain, publicKey, privateKey, walletVersion} = params;
        //const {secretKey, publicKey} = signUtil.ed25519.fromSeed(base.fromHex(seed));
        const chain = workChain == 1 ? 1 : 0;
        let pub: Buffer;
        if (publicKey) {
            pub = base.fromHex(publicKey);
        } else {
            const {publicKey} = signUtil.ed25519.fromSeed(base.fromHex(privateKey!));
            pub = Buffer.from(publicKey);
        }
        let wallet: Contract;
        if (!walletVersion || walletVersion == "v4r2" || walletVersion == "v4R2") {
            wallet = WalletContractV4.create({workchain: chain, publicKey: pub});
        } else {
            // todo
        }
        const initCode = wallet!.init?.code?.toBoc().toString('base64');
        const initData = wallet!.init?.data?.toBoc().toString('base64');
        const walletAddress = wallet!.address;
        const walletStateInit = beginCell()
            .storeWritable(storeStateInit(wallet!.init!))
            .endCell()
            .toBoc()
            .toString('base64');

        return {
            initCode: initCode,
            initData: initData,
            walletStateInit: walletStateInit,
            walletAddress: walletAddress.toString({bounceable: false}),
        };
    }

    async getTransactionBodyForSimulate(param: SignTxParams) {
        if (param.privateKey) {
            const {
                publicKey
            } = signUtil.ed25519.fromSeed(base.fromHex(param.privateKey));
            const publicKeyHex = base.toHex(publicKey);
            if (param.data.publicKey && param.data.publicKey != publicKeyHex) {
                throw new Error("public key not pair the private key");
            }
            if (!param.data.publicKey) {
                param.data.publicKey = publicKeyHex;
            }
            param.privateKey = '';
        } else {
            if (!param.data.publicKey) {
                throw new Error("both private key and public key are null");
            }
        }
        const res = await this.signTransaction(param);
        return Promise.resolve(res.boc);
    }

    async calcTxHash(param: CalcTxHashParams): Promise<any> {
        try {
            const message = Cell.fromBase64(param.data as string)
            const messageHash = message.hash().toString('hex');
            return Promise.resolve(messageHash);
        } catch (e) {
            return Promise.reject(CalcTxHashError);
        }
    }

    async signTonProof(param: SignTonProofParams): Promise<any> {
        const {timestamp, domain, payload} = param.proof;

        const timestampBuffer = Buffer.allocUnsafe(8);
        timestampBuffer.writeBigInt64LE(BigInt(timestamp));

        const domainBuffer = Buffer.from(domain);
        const domainLengthBuffer = Buffer.allocUnsafe(4);
        domainLengthBuffer.writeInt32LE(domainBuffer.byteLength);

        const address = Address.parse(param.walletAddress);

        const addressWorkchainBuffer = Buffer.allocUnsafe(4);
        addressWorkchainBuffer.writeInt32BE(address.workChain);

        const addressBuffer = Buffer.concat([
            addressWorkchainBuffer,
            address.hash,
        ]);

        const messageBuffer = Buffer.concat([
            // Buffer.from('ton-proof-item-v2/', 'utf8'),
            Buffer.from(param.tonProofItem, 'utf8'),
            addressBuffer,
            domainLengthBuffer,
            domainBuffer,
            timestampBuffer,
            Buffer.from(payload),
        ]);

        const bufferToSign = Buffer.concat([
            // Buffer.from('ffff', 'hex'),
            Buffer.from(param.messageSalt, 'hex'),
            // Buffer.from('ton-connect', 'utf8'),
            Buffer.from(param.messageAction, 'utf8'),
            Buffer.from(await base.sha256(messageBuffer)),
        ]);

        const {secretKey} = signUtil.ed25519.fromSeed(base.fromHex(param.privateKey!));
        const signature = nacl.sign.detached(
            Buffer.from(await base.sha256(bufferToSign)),
            Buffer.from(secretKey),
        );

        // todo do test, following code should work too
        // const signature = signUtil.ed25519.sign(
        //     Buffer.from(await base.sha256(bufferToSign)),
        //     Buffer.from(secretKey),
        // );
        return Promise.resolve(Buffer.from(signature).toString('base64'));
    }

    async signMultiTransaction(param: SignTxParams) {
        const txPayload = param.data as TransactionPayload;
        if (txPayload.messages.length > 4) {
            throw new Error('Payload contains more than 4 messages, which exceeds limit');
        }
        let validUntil = txPayload.valid_until;
        if (validUntil && validUntil > 10 ** 10) {
            // If milliseconds were passed instead of seconds
            validUntil = Math.round(validUntil / 1000);
        }
        if (validUntil && validUntil < (Date.now() / 1000)) {
            throw new Error('the confirmation timeout has expired');
        }
        const tonTransferParams: any = []
        txPayload.messages.map(m => {
            tonTransferParams.push({
                toAddress: m.address,
                amount: BigInt(m.amount),
                payload: m.payload,
                stateInit: m.stateInit ? Cell.fromBase64(m.stateInit!) : undefined,
                isBase64Payload: m.isBase64Payload,
            });
        });
        const network = txPayload.network === "1" || txPayload.network === "testnet" ? 1 : 0
        return await signMultiTransaction(param.privateKey, tonTransferParams, txPayload.seqno, validUntil, network, txPayload.publicKey);
    }

    async simulateMultiTransaction(param: SignTxParams) {
        if (param.privateKey) {
            const {
                publicKey
            } = signUtil.ed25519.fromSeed(base.fromHex(param.privateKey));
            const publicKeyHex = base.toHex(publicKey);
            if (param.data.publicKey && param.data.publicKey != publicKeyHex) {
                throw new Error("public key not pair the private key");
            }
            if (!param.data.publicKey) {
                param.data.publicKey = publicKeyHex;
            }
            param.privateKey = '';
        } else {
            if (!param.data.publicKey) {
                throw new Error("both private key and public key are null");
            }
        }
        return this.signMultiTransaction(param);
    }

    // todo do test
    async signMultiTransactionForNFT(param: SignTxParams) {
        const data = param.data as SignMultiTransactionForNFTParams;
        const nftAddresses = data.nftAddresses;
        const messages = nftAddresses.map((nftAddress, index) => {
            const nft = data.nfts?.[index];
            const isNotcoinBurn = nft?.collectionAddress === NOTCOIN_VOUCHERS_ADDRESS;
            const payload = isNotcoinBurn
                ? buildNotcoinVoucherExchange(data.fromNFTAddress, nftAddress, nft!.index)
                : buildNftTransferPayload(data.fromNFTAddress, data.toAddress, data.comment);

            return {
                payload,
                amount: NFT_TRANSFER_TONCOIN_AMOUNT,
                toAddress: nftAddress,
            };
        });
        return await signMultiTransaction(param.privateKey, messages, data.seqno, data.expireAt, data.workchain);
    }

    // todo do test
    async buildNotcoinVoucherExchange(params: BuildNotcoinVoucherExchangeParams) {
        const payload = buildNotcoinVoucherExchange(params.fromNFTAddress, params.nftAddress, params.nftIndex)
        return Promise.resolve(payload.toBoc().toString('base64'));
    }

    // todo do test
    async buildNftTransferPayload(params: BuildNftTransferPayloadParams) {
        const payload = buildNftTransferPayload(params.fromNFTAddress, params.nftAddress, params.comment)
        return Promise.resolve(payload.toBoc().toString('base64'));
    }
}

export class VenomWallet extends TonWallet {
    async getNewAddress(param: NewAddressParams): Promise<any> {
        try {
            const data: NewAddressData = {
                address: getVenomAddressBySeed(param.privateKey),
                publicKey: getPubKeyBySeed(param.privateKey),
            };
            return Promise.resolve(data);
        } catch (e) {
            return Promise.reject(NewAddressError);
        }
    }

    // todo do test
    async signTransaction(param: SignTxParams): Promise<any> {
        try {
            return venomTransfer(param.data as TxData, param.privateKey);
        } catch (e) {
            return Promise.reject(SignTxError);
        }
    }
}

export class JettonWallet extends TonWallet {

}
