import {
    BaseWallet, buildCommonSignMsg,
    CalcTxHashError,
    CalcTxHashParams,
    DerivePriKeyParams,
    GenPrivateKeyError,
    GetDerivedPathParam,
    NewAddressError,
    NewAddressParams, SignCommonMsgParams,
    SignMsgError,
    SignTxError,
    SignTxParams, SignType,
    ValidAddressData,
    ValidAddressParams, ValidPrivateKeyData, ValidPrivateKeyParams
} from '@okxweb3/coin-base';
import {base, BN, signUtil} from '@okxweb3/crypto-lib';
import {
    AccessKey,
    addKey, checkPrivateKey,
    createTransaction,
    deleteKey,
    functionCall,
    getAddress,
    getPubkey,
    publicKeyFromBase58,
    publicKeyFromSeed,
    SCHEMA,
    SignedTransaction,
    signTransaction,
    transfer,
    validateAddress
} from "./index";
import {MessagePayload, SignMessageParamsNEP} from "./nearlib";
import {serialize} from "borsh";

export enum NearTypes {
    TransferNear = 0,
    TransferToken = 1,
    DAppTx = 2,
    DAppTxs = 3,
    AddKey = 4,
    DelKey = 5,
}

export type ActionParams = {
    methodName: string
    deposit?: string
    args: any
    gas?: string
}

export type DAppTxParams = {
    from: string
    blockHash: string
    receiverId: string
    nonce: number
    actions: ActionParams[]
}

export type TransactionParams = {
    receiverId: string
    actions: ActionParams[]
}

export type DAppTxsParams = {
    from: string
    blockHash: string
    nonce: number
    transactions: TransactionParams[]
}

export type TransferParams = {
    from: string
    blockHash: string
    receiverId: string
    nonce: number
    amount: string
}

export type TransferTokenParams = {
    from: string
    blockHash: string
    receiverId: string
    contract: string
    nonce: number

    amount: string

    depositGas: string
    transferGas: string
    depositValue: string
    minTransferTokenValue: string
    shouldDeposit: boolean
}

export type TransferTokenArg = {
    amount: string
    receiver_id: string
}

export type AddKeyParams = {
    from: string
    blockHash: string
    nonce: number
    receiverId: string
    publicKey: string
    accessKey: AccessKey
}

export type DelKeyParams = {
    from: string
    blockHash: string
    nonce: number
    receiverId: string
    publicKey: string
}

export class NearWallet extends BaseWallet {
    async getDerivedPath(param: GetDerivedPathParam): Promise<any> {
        return `m/44'/397'/${param.index}'`;
    }

    async getRandomPrivateKey(): Promise<any> {
        try {
            const privateKeyHex = signUtil.ed25519.ed25519_getRandomPrivateKey(false, "hex")
            const publicKey = base.toHex(signUtil.ed25519.publicKeyCreate(base.fromHex(privateKeyHex)), false)
            return Promise.resolve('ed25519:' + base.toBase58(base.fromHex(privateKeyHex + publicKey)))
        } catch (e) {
            return Promise.reject(GenPrivateKeyError);
        }
    }

    async getDerivedPrivateKey(param: DerivePriKeyParams): Promise<any> {
        try {
            const privateKeyHex = await signUtil.ed25519.ed25519_getDerivedPrivateKey(param.mnemonic, param.hdPath, false, "hex")
            const publicKey = base.toHex(signUtil.ed25519.publicKeyCreate(base.fromHex(privateKeyHex)))
            return Promise.resolve('ed25519:' + base.toBase58(base.fromHex(privateKeyHex + publicKey)))
        } catch (e) {
            return Promise.reject(GenPrivateKeyError);
        }
    }


    async getNewAddress(param: NewAddressParams): Promise<any> {
        try {
            // if (param.privateKey == undefined || param.privateKey == null) {
            if (!param.privateKey) {
                throw NewAddressError
            }
            if (param.privateKey.startsWith("0x") || param.privateKey.startsWith("0X")) {
                let pri = param.privateKey.substring(2)
                if (base.isHexString("0x" + pri)) {
                    return Promise.resolve({
                        address: getAddress(param.privateKey),
                        publicKey: getPubkey(param.privateKey)
                    });
                }
            }
            if ((!param.privateKey.startsWith("0x")) && (!param.privateKey.startsWith("0X")) && base.isHexString('0x' + param.privateKey)) {
                return Promise.resolve({
                    address: getAddress(param.privateKey),
                    publicKey: getPubkey(param.privateKey)
                });
            }
            const parts = param.privateKey.split(':');
            if (parts.length != 2 || parts[0] != 'ed25519') {
                throw NewAddressError
            }
            const pk = base.fromBase58(parts[1])
            const seedHex = base.toHex(pk.slice(0, 32))
            const address = getAddress(seedHex)
            return Promise.resolve({
                address: address,
                publicKey: getPubkey(seedHex)
            });
        } catch (e) {
            return Promise.reject(NewAddressError);
        }
    }

    async validPrivateKey(param: ValidPrivateKeyParams): Promise<any> {
        const key = param.privateKey.startsWith('0x') ? param.privateKey : '0x' + param.privateKey
        let isValid: boolean
        if (base.isHexString(key)) {
            isValid = checkPrivateKey(param.privateKey);
        } else {
            const parts = param.privateKey.split(':');
            if (parts.length != 2 || parts[0] != 'ed25519') {
                isValid = false
            } else {
                const pk = base.fromBase58(parts[1])
                const seedHex = base.toHex(pk.slice(0, 32))
                isValid = checkPrivateKey(seedHex)
            }
        }
        const data: ValidPrivateKeyData = {
            isValid: isValid,
            privateKey: param.privateKey
        };
        return Promise.resolve(data);
    }


    getBase58Address(privateKey: string) {
        const parts = privateKey.split(':');
        if (parts.length != 2 || parts[0] != 'ed25519') {
            throw NewAddressError
        }
        const pk = base.fromBase58(parts[1])
        const seedHex = base.toHex(pk.slice(0, 32))
        return getAddress(seedHex)
    }

    getPrvFromBase58(privateKey: string) {
        const parts = privateKey.split(':');
        if (parts.length != 2 || parts[0] != 'ed25519') {
            throw NewAddressError
        }
        const pk = base.fromBase58(parts[1])
        return base.toHex(pk)
    }

    getBase58Pubkey(privateKey: string) {
        const parts = privateKey.split(':');
        if (parts.length != 2 || parts[0] != 'ed25519') {
            throw NewAddressError
        }
        const pk = base.fromBase58(parts[1])
        const seedHex = base.toHex(pk.slice(0, 32))
        return publicKeyFromSeed(seedHex)
    }


    async signCommonMsg(params: SignCommonMsgParams): Promise<any> {
        let addr = await this.getNewAddress({privateKey:params.privateKey});
        if(addr.publicKey.startsWith("0x")) {
            addr.publicKey = addr.publicKey.substring(2);
        }
        let data = buildCommonSignMsg(addr.publicKey, params.message.walletId);
        let privateKey = params.privateKey.startsWith("0x") || params.privateKey.startsWith("0X") ?params.privateKey.substring(2):params.privateKey;
        if ((!params.privateKey.startsWith("0x")) && (!params.privateKey.startsWith("0X")) && !base.isHexString('0x' + params.privateKey)) {
            const parts = params.privateKey.split(':');
            if (parts.length != 2 || parts[0] != 'ed25519') {
                throw Error("invalid privateKey")
            }
            const pk = base.fromBase58(parts[1])
            privateKey = base.toHex(pk.slice(0, 32))
        }
        return super.signCommonMsg({privateKey:privateKey, message:data, signType:SignType.ED25519})
    }

    async signMessage(param: SignTxParams): Promise<string> {
        try {
            const data = param.data as SignMessageParamsNEP;
            const {message, nonce, recipient, callbackUrl, state} = data;
            const nonceArray = Buffer.from(nonce);
            if (nonceArray.length !== 32) {
                throw Error('Expected nonce to be a 32 bytes buffer')
            }
            const payload = new MessagePayload({
                message,
                nonce: nonceArray, recipient, callbackUrl
            });
            const encodedPayload = serialize(SCHEMA, payload);
            const hash = base.sha256(encodedPayload)
            const prvHex = this.getPrvFromBase58(param.privateKey)
            const privateKey = base.fromHex(prvHex)
            const s = signUtil.ed25519.sign(hash, privateKey);
            return Promise.resolve(Buffer.from(s).toString('base64'));
        } catch (e) {
            return Promise.reject(SignMsgError);
        }
    }

    async signTransaction(param: SignTxParams): Promise<any> {
        try {
            const type = param.data.type || 0;
            const addr = this.getBase58Address(param.privateKey)
            const publicKey = this.getBase58Pubkey(param.privateKey)
            const prvHex = this.getPrvFromBase58(param.privateKey)
            if (type === NearTypes.TransferNear) {
                let data = param.data as TransferParams
                const tx = createTransaction((data.from == undefined || null) || (data.from == '') ? addr : data.from, publicKey, data.receiverId, data.nonce, [], base.fromBase58(data.blockHash))
                tx.actions.push(transfer(new BN(data.amount)))
                const [_, signedTx] = await signTransaction(tx, prvHex)
                return Promise.resolve(base.toBase64(signedTx.encode()));
            } else if (type === NearTypes.AddKey) {
                let data = param.data as AddKeyParams
                if (data.publicKey == undefined || null || data.accessKey == undefined || null) {
                    return Promise.reject(SignTxError);
                }
                const tx = createTransaction((data.from == undefined || null) || (data.from == '') ? addr : data.from, publicKey, data.receiverId, data.nonce, [], base.fromBase58(data.blockHash))
                tx.actions.push(addKey(publicKeyFromBase58(data.publicKey), data.accessKey))
                const [_, signedTx] = await signTransaction(tx, prvHex)
                return Promise.resolve(base.toBase64(signedTx.encode()));
            } else if (type === NearTypes.DelKey) {
                let data = param.data as DelKeyParams
                if (data.publicKey == undefined || null) {
                    return Promise.reject(SignTxError);
                }
                const tx = createTransaction((data.from == undefined || null) || (data.from == '') ? addr : data.from, publicKey, data.receiverId, data.nonce, [], base.fromBase58(data.blockHash))
                tx.actions.push(deleteKey(publicKeyFromBase58(data.publicKey)))
                const [_, signedTx] = await signTransaction(tx, prvHex)
                return Promise.resolve(base.toBase64(signedTx.encode()));
            } else if (type === NearTypes.TransferToken) {
                let data = param.data as TransferTokenParams
                const tx = createTransaction((data.from == undefined || null) || (data.from == '') ? addr : data.from, publicKey, data.contract, data.nonce, [], base.fromBase58(data.blockHash))
                if (data.shouldDeposit) {
                    const args = {account_id: data.receiverId}
                    const action = functionCall("storage_deposit", args, new BN(data.depositGas), new BN(data.depositValue))
                    tx.actions.push(action)
                }
                const args: TransferTokenArg = {amount: data.amount, receiver_id: data.receiverId}
                const action = functionCall("ft_transfer", args, new BN(data.transferGas), new BN(data.minTransferTokenValue))
                tx.actions.push(action)
                const [_, signedTx] = await signTransaction(tx, prvHex)
                return Promise.resolve(base.toBase64(signedTx.encode()));
            } else if (type === NearTypes.DAppTx) {
                let data = param.data as DAppTxParams
                if (data.actions == undefined || data.actions == null || data.actions.length == 0) {
                    return Promise.reject(SignTxError);
                }
                // @ts-ignore
                let actions = data.actions.map(item => functionCall(item.methodName, item.args, new BN(item.gas!), new BN(item.deposit!)))
                const [_, signedTx] = await signTransaction(data.receiverId, data.nonce, actions, base.fromBase58(data.blockHash), prvHex, (data.from == undefined || null) || (data.from == '') ? addr : data.from)
                return Promise.resolve(base.toBase64(signedTx.encode()));
            } else if (type === NearTypes.DAppTxs) {
                let data = param.data as DAppTxsParams
                if (data.transactions == undefined || data.transactions == null || data.transactions.length == 0) {
                    return Promise.reject(SignTxError);
                }
                let txs = []
                for (let i = 0; i < data.transactions.length; i++) {
                    let tx = data.transactions[i]
                    // @ts-ignore
                    let actions = tx.actions.map(item => functionCall(item.methodName, item.args, new BN(item.gas!), new BN(item.deposit!)))
                    const [_, signedTx] = await signTransaction(tx.receiverId, new BN(data.nonce).add(new BN(i)).toNumber(), actions, base.fromBase58(data.blockHash), prvHex, (data.from == undefined || null) || (data.from == '') ? addr : data.from)
                    txs.push(base.toBase64(signedTx.encode()))
                }
                return Promise.resolve(txs);
            } else {
                return Promise.reject(SignTxError);
            }
        } catch (e) {
            return Promise.reject(SignTxError);
        }
    }

    async validAddress(param: ValidAddressParams): Promise<any> {
        let isValid = false;
        try {
            isValid = validateAddress(param.address);
        } catch (e) {
        }

        let data: ValidAddressData = {
            isValid: isValid,
            address: param.address,
        };
        return Promise.resolve(data);
    }

    async calcTxHash(param: CalcTxHashParams): Promise<string> {
        try {
            let tx = SignedTransaction.decode(Buffer.from(base.fromBase64(param.data)))
            let hash = base.toBase58(base.sha256(tx.transaction.encode()))
            return Promise.resolve(hash);
        } catch (e) {
            throw CalcTxHashError;
        }
    }
}