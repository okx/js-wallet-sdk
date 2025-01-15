import {
    BaseWallet, buildCommonSignMsg,
    DerivePriKeyParams,
    GenPrivateKeyError,
    GetDerivedPathParam, jsonStringifyUniform,
    NewAddressData,
    NewAddressError,
    NewAddressParams, SignCommonMsgParams,
    SignTxError,
    SignTxParams,
    ValidAddressData,
    ValidAddressParams, ValidPrivateKeyData, ValidPrivateKeyParams,
    VerifyMessageParams
} from '@okxweb3/coin-base';
import {base, bip32, bip39} from '@okxweb3/crypto-lib';


import {
    CalculateContractAddressFromHash,
    Call, computeHashOnElements,
    constants,
    CreateContractCall,
    CreateMultiContractCall,
    CreateSignedDeployAccountTx,
    CreateTransferTx,
    DeployAccountContractPayload,
    ec, GetRandomPrivateKey,
    modPrivateKey,
    signMessage,
    signMessageWithTypeData,
    typedData,
    validateAndParseAddress,
    verifyMessage
} from "./index";
import {encodeShortString} from "./utils/shortString";
import {starkCurve} from "./utils/ec";
import {BigNumberish, hexToDecimalString} from "./utils/num";

export type StarknetTransactionType =
    "transfer"
    | "deploy_account"
    | "contract_call"
    | "multi_contract_call"

export type StarknetSignData = {
    type: StarknetTransactionType
    nonce: string;
    maxFee: string;
    chainId?: constants.StarknetChainId;
    transferData?: {
        contractAddress: string
        from: string
        to: string
        amount: string
    }
    deployAccountData?: DeployAccountContractPayload
    contractCallData?: {
        contractAddress: string
        from: string
        functionName: string
        callData: string[]
    }
    multiContractCallData?: {
        from: string
        calls: Call[]
    }
}

function validateHexString(value: string) {
    if (!value) {
        return false;
    }
    const hexStr = value.toLowerCase().startsWith("0x") ? value.substring(2).toLowerCase() : value.toLowerCase();
    if (hexStr.length === 0) {
        return false;
    }
    if (!hexStr.match(/^[0-9A-Fa-f]*$/)) {
        return false;
    }
    return true
}

function checkPrivateKey(privateKeyHex: string):boolean{
    if (!validateHexString(privateKeyHex)){
        return false;
    }
    const keyBytes = base.fromHex(privateKeyHex.toLowerCase());
    if (keyBytes.length < 25 || keyBytes.length > 33) {
        return false;
    }
    return true
}

export class StarknetWallet extends BaseWallet {

    getRandomPrivateKey(): Promise<any> {
        return GetRandomPrivateKey();
    }

    async getDerivedPath(param: GetDerivedPathParam): Promise<any> {
        return `m/44'/9004'/0'/0/${param.index}`;
    }

    async getDerivedPrivateKey(param: DerivePriKeyParams): Promise<any> {
        return bip39.mnemonicToSeed(param.mnemonic)
            .then((masterSeed: Buffer) => {
                // Derived ETH seed
                let ethKey = bip32.fromSeed(masterSeed).derivePath("m/44'/60'/0'/0/0");
                if (!ethKey.privateKey) {
                    return Promise.reject(GenPrivateKeyError);
                }
                let starkKey = Buffer.from(ethKey.privateKey);
                // Derived StarkNet seed
                let childKey = bip32.fromSeed(starkKey).derivePath(param.hdPath)
                if (childKey.privateKey) {
                    let hdKey = base.toHex(childKey.privateKey);
                    let privateKey = ec.starkCurve.grindKey(hdKey)
                    return Promise.resolve(`0x${privateKey}`);
                } else {
                    return Promise.reject(GenPrivateKeyError);
                }
            }).catch((e) => {
                return Promise.reject(GenPrivateKeyError + ":" + e);
            });
    }

    async getNewAddress(param: NewAddressParams): Promise<any> {
        if (!checkPrivateKey(param.privateKey)){
            throw new Error('invalid key');
        }
        try {
            const pri = modPrivateKey(param.privateKey);
            const pub = ec.starkCurve.getStarkKey(pri);
            const address = CalculateContractAddressFromHash(pub);
            let data: NewAddressData = {
                address: address,
                publicKey: pub
            };
            return Promise.resolve(data);
        } catch (e) {
            return Promise.reject(NewAddressError + ":" + e);
        }
    }
    async validPrivateKey(param: ValidPrivateKeyParams): Promise<any> {
        let isValid = checkPrivateKey(param.privateKey)
        const data: ValidPrivateKeyData = {
            isValid: isValid,
            privateKey: param.privateKey
        };
        return Promise.resolve(data);
    }

    async signTransaction(param: SignTxParams): Promise<any> {
        try {
            const data: StarknetSignData = param.data;
            if (data.nonce === undefined || data.maxFee === undefined) {
                return Promise.reject(SignTxError);
            }
            const nonce = data.nonce;
            const max_fee = data.maxFee;
            const chain_id = data.chainId || constants.StarknetChainId.SN_MAIN;
            const pri = modPrivateKey(param.privateKey);

            if (data.type == 'transfer' && data.transferData !== undefined) {
                const contractAddress = data.transferData.contractAddress;
                const from = data.transferData.from;
                const to = data.transferData.to;
                const amount = data.transferData.amount;
                const tx = await CreateTransferTx(contractAddress, from, to, amount, nonce, max_fee, chain_id, pri);
                return Promise.resolve(tx)
            } else if (data.type == 'deploy_account') {
                const tx = await CreateSignedDeployAccountTx(nonce, max_fee, chain_id, pri);
                return Promise.resolve(tx)
            } else if (data.type == 'contract_call' && data.contractCallData !== undefined) {
                const contractAddress = data.contractCallData.contractAddress;
                const from = data.contractCallData.from;
                const functionName = data.contractCallData.functionName;
                const callData = data.contractCallData.callData;
                const tx = await CreateContractCall(contractAddress, from, functionName, callData, nonce, max_fee, chain_id, pri);
                return Promise.resolve(tx)
            } else if (data.type == 'multi_contract_call' && data.multiContractCallData !== undefined) {
                const from = data.multiContractCallData.from;
                const calls = data.multiContractCallData.calls;
                const tx = CreateMultiContractCall(from, calls, nonce, max_fee, chain_id, pri);
                return Promise.resolve(tx)
            }
            return Promise.reject(SignTxError);
        } catch (e) {
            return Promise.reject(SignTxError + ":" + e);
        }
    }

    async validAddress(param: ValidAddressParams): Promise<any> {
        let isValid: boolean;
        try {
            validateAndParseAddress(param.address);
            isValid = (param.address.startsWith("0x") && param.address.length > 50);
        } catch (e) {
            isValid = false;
        }

        let data: ValidAddressData = {
            isValid: isValid,
            address: param.address,
        };
        return Promise.resolve(data);
    }

    async signMessage(param: SignTxParams): Promise<any> {
        try {
            const pri = modPrivateKey(param.privateKey);
            if (typeof param.data.message === "string") {
                const msg = param.data.message;
                if (msg.startsWith("0x")) {
                    const signature = signMessage(msg, pri);
                    return Promise.resolve(signature);
                }
            } else {
                const typedDataValidate: typedData.TypedData = param.data.message;
                const signature = await signMessageWithTypeData(typedDataValidate, pri);
                return Promise.resolve(signature);
            }
        } catch (e) {
            return Promise.reject(SignTxError + ":" + e);
        }
    }
    async signCommonMsg(params: SignCommonMsgParams): Promise<any> {
        let data;
        if(params.message.text){
            data=params.message.text;
        } else {
            let addr = await this.getNewAddress({privateKey:params.privateKey});
            if(addr.publicKey.startsWith("0x")) {
                addr.publicKey = addr.publicKey.substring(2);
            }
            data = buildCommonSignMsg(addr.publicKey, params.message.walletId);
        }
        let msgHash = base.magicHash(data);
        let msgHashFirst = msgHash.slice(0,16)
        let msgHashEnd = msgHash.slice(16);
        let hash = computeHashOnElements([hexToDecimalString(base.toHex(msgHashFirst)), hexToDecimalString(base.toHex(msgHashEnd))]);
        if(hash.startsWith("0x")) {
            hash = hash.substring(2)
        }
        let sig = starkCurve.sign(hash, params.privateKey);
        let point = starkCurve.ProjectivePoint.fromHex(base.toHex(starkCurve.getPublicKey(params.privateKey)));
        let res = {publicKey:point.x.toString(16),publicKeyY:point.y.toString(16),signedDataR:sig.r.toString(16),signedDataS:sig.s.toString(16)};
        return Promise.resolve(base.toHex(base.toUtf8(jsonStringifyUniform(res))));
    }

    verifyMessage(param: VerifyMessageParams): Promise<any> {
        try {
            const sig = param.data.signature;
            const hash = param.data.hash;
            const publicKey = param.data.publicKey;

            return Promise.resolve(verifyMessage(sig, hash, publicKey));
        } catch (e) {
            return Promise.reject(e);
        }
    }
}