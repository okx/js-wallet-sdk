import {base, bip32, bip39} from '@okxweb3/crypto-lib'
import {
    DerivePriKeyParams,
    GetDerivedPathParam,
    GetRawTransactionParams,
    NewAddressData,
    NewAddressParams,
    SignTxParams,
    TypedMessage,
    ValidAddressData,
    ValidAddressParams,
    VerifyMessageParams,
    BaseWallet,
    secp256k1SignTest,
    GenPrivateKeyError,
    GetPayLoadError,
    NewAddressError,
    SignMsgError,
    SignTxError, ValidPrivateKeyParams, ValidPrivateKeyData, SignCommonMsgParams, buildCommonSignMsg, SignType
} from "@okxweb3/coin-base";
import {
    createStacksPrivateKey,
    getPublicKey,
    getAddressFromPublicKey,
    validateStacksAddress,
    TransactionVersion,
    transfer,
    tokenTransfer,
    allowContractCaller,
    delegateStx,
    revokeDelegateStx,
    getTransferPayload,
    getTokenTransferPayload,
    getAllowContractCallerPayload,
    getDelegateStxPayload,
    getRevokeDelegateStxPayload,
    signMessageHashRsv,
    verifyMessageSignatureRsv,
    GenerateUnsignedContractCallTxArgs,
    makeContractCallTx,
    getContractCallPayload,
    hashMessage,
    publicKeyToString,
    bytesToHex,
    ClarityValue,
    signStructuredData,
    GenerateUnsignedContractDeployTxArgs,
    ContractDeployTx,
    getDeployPayload
} from './index'


export type StxTransactionType =
    "transfer"
    | "stack"
    | "tokenTransfer"
    | "allowContractCaller"
    | "delegateStx"
    | "revokeDelegateStx"
    | "contractCall"
    | "deployContract"

export type StxSignData = {
    type: StxTransactionType
    data: TokenTransfer | StxTransfer | AllowContractCaller | DelegateStx | RevokeDelegateStx
        | GenerateUnsignedContractCallTxArgs | contractCallPayload | GenerateUnsignedContractDeployTxArgs | deployPayload
}

export interface DelegateStx {
    contract: string;
    contractName: string;
    functionName: string;
    delegateTo: string;
    untilBurnBlockHeight: number;
    amountMicroStx: number;
    poxAddress: string;
    cycles: number;
    burnBlockHeight: number;
    fee: number;
    nonce: number;
}

export interface RevokeDelegateStx {
    contract: string;
    contractName: string;
    functionName: string;
    fee: number;
    nonce: number;
}

export interface contractCallPayload {
    contract: string;
    contractName: string;
    functionName: string;
    functionArgs: string[];
}

export interface deployPayload {
    contractName: string;
    codeBody: string;
}

export interface StxTransfer {
    to: string;
    amount: number;
    memo: string;
    nonce: number;
    fee: number;
    anchorMode?: number;
}

export interface TokenTransfer {
    from: string;
    to: string;
    memo: string;
    amount: number;
    contract: string;
    contractName: string;
    tokenName: string;
    functionName: string;
    nonce: number;
    fee: number;
}

export interface AllowContractCaller {
    contract: string;
    contractName: string,
    functionName: string,
    caller: string,
    untilBurnBlockHeight: number,
    nonce: number;
    fee: number;
}

export type signTransactionResult = {
    txId: string;
    txSerializedHexString: string;
}

export class StxWallet extends BaseWallet {
    async getDerivedPath(param: GetDerivedPathParam): Promise<any> {
        return `m/44'/5757'/0'/0/${param.index}`;
    }

    getDerivedPrivateKey(param: DerivePriKeyParams): Promise<any> {
        return bip39.mnemonicToSeed(param.mnemonic)
            .then(masterSeed => {
                let childKey = bip32.fromSeed(masterSeed).derivePath(param.hdPath);
                if (!childKey.privateKey) {
                    return Promise.reject(GenPrivateKeyError);
                }
                return Promise.resolve(base.toHex(childKey.privateKey) + "01");
            }).catch((e) => {
                return Promise.reject(GenPrivateKeyError);
            });
    }

    getRandomPrivateKey(): Promise<any> {
        try {
            while (true) {
                const privateKey = base.randomBytes(32)
                if (secp256k1SignTest(privateKey)) {
                    return Promise.resolve(base.toHex(privateKey, true) + "01");
                }
            }

        } catch (e) {
        }
        return Promise.reject(GenPrivateKeyError);
    }

    getNewAddress(param: NewAddressParams): Promise<any> {
        try {
            let key = param.privateKey.toLowerCase().startsWith("0x")? param.privateKey.substring(2):param.privateKey
            const privateKey = createStacksPrivateKey(key.toLowerCase());
            const publicKey = base.toHex(getPublicKey(privateKey).data);
            let address;
            if (param.version && param.version === 'Testnet') {
                address = getAddressFromPublicKey(publicKey, TransactionVersion.Testnet);
            } else {
                address = getAddressFromPublicKey(publicKey);
            }
            const data: NewAddressData = {
                address: address,
                publicKey: publicKey
            };
            return Promise.resolve(data);
        } catch (e) {
            return Promise.reject(NewAddressError);
        }
    }

    checkPrivateKey(privateKeyHex: string) {
        if (privateKeyHex.toLowerCase().startsWith("0x")) {
            privateKeyHex = privateKeyHex.substring(2);
        }
        createStacksPrivateKey(privateKeyHex);
        return true
    }

    async validPrivateKey(param: ValidPrivateKeyParams): Promise<any> {
        let isValid = this.checkPrivateKey(param.privateKey)
        const data: ValidPrivateKeyData = {
            isValid: isValid,
            privateKey: param.privateKey
        };
        return Promise.resolve(data);
    }

    async signTransaction(param: SignTxParams): Promise<any> {
        try {
            if (param.privateKey.startsWith("0x")) {
                param.privateKey = param.privateKey.substring(2);
            }
            const data: StxSignData = param.data
            if (data.type == 'transfer') {
                const transferParam = data.data as StxTransfer;
                if (transferParam.to == null || transferParam.amount == null || transferParam.nonce == null || transferParam.fee == null) {
                    return Promise.reject(SignTxError);
                }
                const tx: signTransactionResult = transfer(param.privateKey, transferParam.to, transferParam.amount,
                    transferParam.memo, transferParam.nonce, transferParam.fee, transferParam.anchorMode)
                return Promise.resolve(tx);
            } else if (data.type == 'tokenTransfer') {
                const contractCallParam = data.data as TokenTransfer;
                if (contractCallParam.from == null || contractCallParam.to == null || contractCallParam.amount == null || contractCallParam.contract == null
                    || contractCallParam.contractName == null || contractCallParam.functionName == null) {
                    return Promise.reject(SignTxError);
                }
                const tx: signTransactionResult = await tokenTransfer(param.privateKey, contractCallParam.from,
                    contractCallParam.to, contractCallParam.memo, contractCallParam.amount, contractCallParam.contract,
                    contractCallParam.contractName, contractCallParam.tokenName, contractCallParam.functionName,
                    contractCallParam.nonce, contractCallParam.fee)
                return Promise.resolve(tx);
            } else if (data.type == 'allowContractCaller') {
                const contractCallParam = data.data as AllowContractCaller;
                if (contractCallParam.caller == null || contractCallParam.contract == null || contractCallParam.contractName == null
                    || contractCallParam.functionName == null) {
                    return Promise.reject(SignTxError);
                }
                const tx: signTransactionResult = await allowContractCaller(param.privateKey, contractCallParam.caller,
                    contractCallParam.contract, contractCallParam.contractName, contractCallParam.functionName,
                    contractCallParam.untilBurnBlockHeight, contractCallParam.nonce, contractCallParam.fee)
                return Promise.resolve(tx);
            } else if (data.type == 'delegateStx') {
                const delegateStxParam = data.data as DelegateStx;
                if (delegateStxParam.contract == null || delegateStxParam.contractName == null || delegateStxParam.functionName == null
                    || delegateStxParam.amountMicroStx == null || delegateStxParam.delegateTo == null) {
                    return Promise.reject(SignTxError);
                }
                const tx: signTransactionResult = await delegateStx(param.privateKey, delegateStxParam.contract,
                    delegateStxParam.contractName, delegateStxParam.functionName, delegateStxParam.delegateTo,
                    delegateStxParam.poxAddress, delegateStxParam.amountMicroStx, delegateStxParam.untilBurnBlockHeight,
                    delegateStxParam.nonce, delegateStxParam.fee)
                return Promise.resolve(tx);
            } else if (data.type == 'revokeDelegateStx') {
                const revokeDelegateStxParam = data.data as RevokeDelegateStx;
                if (revokeDelegateStxParam.contract == null || revokeDelegateStxParam.contractName == null || revokeDelegateStxParam.functionName == null) {
                    return Promise.reject(SignTxError);
                }
                const tx: signTransactionResult = await revokeDelegateStx(param.privateKey, revokeDelegateStxParam.contract,
                    revokeDelegateStxParam.contractName, revokeDelegateStxParam.functionName, revokeDelegateStxParam.nonce, revokeDelegateStxParam.fee)
                return Promise.resolve(tx);
            } else if (data.type == 'contractCall') {
                const contractCallParam = data.data as GenerateUnsignedContractCallTxArgs;
                const tx = await makeContractCallTx(contractCallParam, param.privateKey);
                return Promise.resolve(tx)
            } else if (data.type == 'deployContract') {
                const contractCallParam = data.data as GenerateUnsignedContractDeployTxArgs;
                const tx = await ContractDeployTx(contractCallParam, param.privateKey);
                return Promise.resolve(tx)
            }
            return Promise.reject(SignTxError);
        } catch (e) {
            return Promise.reject(e);
        }
    }


    async signCommonMsg(params: SignCommonMsgParams): Promise<any> {
        let addr = await this.getNewAddress({privateKey:params.privateKey, version:params.version});
        if(addr.publicKey.startsWith("0x")) {
            addr.publicKey = addr.publicKey.substring(2);
        }
        let data = buildCommonSignMsg(addr.publicKey, params.message.walletId);
        return super.signCommonMsg({privateKey:params.privateKey, message:data, signType:SignType.Secp256k1})
    }

    async signMessage(param: SignTxParams): Promise<any> {
        try {
            if (param.privateKey.startsWith("0x")) {
                param.privateKey = param.privateKey.substring(2);
            }
            const privateKey = createStacksPrivateKey(param.privateKey);
            if (param.data.type == "signMessage") {
                const messageHash = hashMessage(param.data.message);
                const signature = signMessageHashRsv({
                    messageHash:bytesToHex(messageHash),
                    privateKey:privateKey
                });
                return Promise.resolve({signature: signature.data, publicKey: publicKeyToString(getPublicKey(privateKey))});
            } else if (param.data.type == "signStructuredData") {
                const message = param.data.message as ClarityValue;
                const domain = param.data.domain as ClarityValue;
                const signature = signStructuredData({message,domain,privateKey}).data;
                return Promise.resolve({
                    signature: signature,
                    publicKey: publicKeyToString(getPublicKey(privateKey))
                })
            }

        } catch (e) {
            return Promise.reject(SignMsgError);
        }
    }

    async verifyMessage(param: VerifyMessageParams): Promise<any> {
        try {
            const d = param.data as TypedMessage;
            if (d.publicKey === undefined) {
                return Promise.reject(SignMsgError);
            }
            const signature = param.signature;
            const message = hashMessage(param.data.message);
            const publicKey = d.publicKey;
            return Promise.resolve(verifyMessageSignatureRsv({signature,message,publicKey}));
        }catch (e) {
            return Promise.reject(e);
        }
    }

    validAddress(param: ValidAddressParams): Promise<any> {
        let isValid: boolean;
        try {
            isValid = validateStacksAddress(param.address)
        } catch (e) {
            isValid = false;
        }

        let data: ValidAddressData = {
            isValid: isValid,
            address: param.address,
        };
        return Promise.resolve(data);
    }

    getRawTransaction(param: GetRawTransactionParams): Promise<string> {
        try {
            const data: StxSignData = param.data
            if (data.type == 'transfer') {
                const transferParam = data.data as StxTransfer;
                if (transferParam.to == null || transferParam.amount == null) {
                    return Promise.reject(GetPayLoadError);
                }
                const serializePayload = getTransferPayload(transferParam.to, transferParam.amount, transferParam.memo)
                return Promise.resolve(serializePayload);
            } else if (data.type == 'tokenTransfer') {
                const contractCallParam = data.data as TokenTransfer;
                if (contractCallParam.from == null || contractCallParam.to == null || contractCallParam.amount == null || contractCallParam.contract == null
                    || contractCallParam.contractName == null || contractCallParam.functionName == null) {
                    return Promise.reject(GetPayLoadError);
                }
                const serializePayload = getTokenTransferPayload(contractCallParam.from,
                    contractCallParam.to, contractCallParam.memo, contractCallParam.amount, contractCallParam.contract,
                    contractCallParam.contractName, contractCallParam.functionName)
                return Promise.resolve(serializePayload);
            } else if (data.type == 'allowContractCaller') {
                const contractCallParam = data.data as AllowContractCaller;
                if (contractCallParam.caller == null || contractCallParam.contract == null || contractCallParam.contractName == null
                    || contractCallParam.functionName == null) {
                    return Promise.reject(GetPayLoadError);
                }
                const serializePayload = getAllowContractCallerPayload(contractCallParam.caller,
                    contractCallParam.contract, contractCallParam.contractName, contractCallParam.functionName, contractCallParam.untilBurnBlockHeight)
                return Promise.resolve(serializePayload);
            } else if (data.type == 'delegateStx') {
                const delegateStxParam = data.data as DelegateStx;
                if (delegateStxParam.contract == null || delegateStxParam.contractName == null || delegateStxParam.functionName == null
                || delegateStxParam.amountMicroStx == null || delegateStxParam.delegateTo == null) {
                    return Promise.reject(GetPayLoadError);
                }
                const serializePayload = getDelegateStxPayload(delegateStxParam.contract,
                    delegateStxParam.contractName, delegateStxParam.functionName, delegateStxParam.delegateTo,
                    delegateStxParam.poxAddress, delegateStxParam.amountMicroStx, delegateStxParam.untilBurnBlockHeight)
                return Promise.resolve(serializePayload);
            } else if (data.type == 'revokeDelegateStx') {
                const delegateStxParam = data.data as RevokeDelegateStx;
                if (delegateStxParam.contract == null || delegateStxParam.contractName == null || delegateStxParam.functionName == null) {
                    return Promise.reject(GetPayLoadError);
                }
                const serializePayload = getRevokeDelegateStxPayload(delegateStxParam.contract,
                    delegateStxParam.contractName, delegateStxParam.functionName)
                return Promise.resolve(serializePayload);
            } else if (data.type == 'contractCall') {
                const contractCallParam = data.data as contractCallPayload;
                const serializePayload = getContractCallPayload(contractCallParam.contract,contractCallParam.contractName,contractCallParam.functionName,contractCallParam.functionArgs)
                return Promise.resolve(serializePayload);
            } else if (data.type == 'deployContract') {
                const deployPayload = data.data as deployPayload;
                const serializePayload = getDeployPayload(deployPayload.contractName,deployPayload.codeBody)
                return Promise.resolve(serializePayload);
            }
            return Promise.reject(GetPayLoadError);
        } catch (e) {
            return Promise.reject(GetPayLoadError);
        }
    }
}
