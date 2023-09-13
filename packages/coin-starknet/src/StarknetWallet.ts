import {
    DerivePriKeyParams,
    GetDerivedPathParam,
    NewAddressData,
    NewAddressParams,
    SignTxParams,
    ValidAddressData,
    ValidAddressParams,
    VerifyMessageParams,
    BaseWallet,
    GenPrivateKeyError,
    NewAddressError,
    SignTxError
} from '@okxweb3/coin-base';
import {base, bip32, bip39} from '@okxweb3/crypto-lib';


import {
    DeployAccountContractPayload,
    validateAndParseAddress,
    ec,
    constants,
    CreateTransferTx,
    CreateSignedDeployAccountTx,
    CalculateContractAddressFromHash,
    CreateContractCall,
    typedData,
    signMessage,
    signMessageWithTypeData,
    verifyMessage,
    Call,
    CreateMultiContractCall,
    modPrivateKey
} from "./index";

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

export class StarknetWallet extends BaseWallet {

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