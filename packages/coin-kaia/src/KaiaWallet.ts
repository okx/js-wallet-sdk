import {
    assertBufferLength,
    CalcTxHashParams,
    GetAddressParams,
    GetHardwareRawTransactionError,
    GetHardwareSignedTransactionError,
    GetMpcRawTransactionError,
    GetMpcTransactionError,
    HardwareRawTransactionParam,
    MpcMessageParam,
    MpcRawTransactionParam,
    MpcTransactionParam,
    NewAddressError,
    NewAddressParams,
    SignTxError,
    SignTxParams,
    ValidAddressParams,
    ValidPrivateKeyData,
    ValidPrivateKeyParams,
    validSignedTransactionError,
    ValidSignedTransactionParams,
} from "@okxweb3/coin-base";
import {base, BigNumber} from "@okxweb3/crypto-lib";
import {EthWallet, keccak256} from "@okxweb3/coin-ethereum";
import {getAddress} from "@ethersproject/address";
import {computeAddress} from "@ethersproject/transactions";
import {validPrivateKey} from "./api";
import {Wallet} from "./v6";
import {KlaytnTxFactory} from "@kaiachain/js-ext-core";

export type KaiaTxParams = {
    kaiaTxType?: number;
    senderRawTx?: string;
    from?: string,

    to: string,
    value: string,
    useValue?: boolean,
    nonce: number,
    contractAddress?: string
    gasPrice: string,
    gasLimit: string,

    data?: string;
    humanReadable?: boolean,
    codeFormat?: any,
    key?: any,
    chainId: string;

    // Typed-Transaction features
    // 0: without chainId
    // 1：with chainId；
    // 2：EIP-1559 transaction
    type: number;
    feeRatio?: number;

    // EIP-2930; Type 1 & EIP-1559; Type 2
    //   accessList?: AccessListish;

    // EIP-1559; Type 2
    maxPriorityFeePerGas: string;
    maxFeePerGas: string;
}

export type EthTxParams = {
    from: string,
    to: string,
    value: string,
    useValue?: boolean,

    nonce: number,

    contractAddress?: string
    gasPrice: string,
    gasLimit: string,

    data?: string;
    humanReadable?: boolean,
    codeFormat?: any,
    key?: any,
    chainId: string;

    // Typed-Transaction features
    // 0: without chainId
    // 1：with chainId；
    // 2：EIP-1559 transaction
    type: number;
    feeRatio?: number;

    // EIP-2930; Type 1 & EIP-1559; Type 2
    //   accessList?: AccessListish;

    // EIP-1559; Type 2
    maxPriorityFeePerGas: string;
    maxFeePerGas: string;
}

export class KaiaWallet extends EthWallet {

    async getNewAddress(param: NewAddressParams): Promise<any> {
        let pri = param.privateKey;
        let ok = validPrivateKey(pri);
        if (!ok) {
            throw new Error('invalid key')
        }
        try {
            const privateKey = base.fromHex(pri.toLowerCase())
            assertBufferLength(privateKey, 32)
            let wallet = new Wallet(pri);
            return Promise.resolve({
                address: await wallet.getAddress(),
                publicKey: wallet.signingKey.publicKey,
            });
        } catch (e) {
        }
        return Promise.reject(NewAddressError)
    }

    async validPrivateKey(param: ValidPrivateKeyParams): Promise<any> {
        let isValid = validPrivateKey(param.privateKey);
        const data: ValidPrivateKeyData = {
            isValid: isValid,
            privateKey: param.privateKey
        };
        return Promise.resolve(data);
    }

    async validAddress(param: ValidAddressParams): Promise<any> {
        let isValid = false;
        let result;
        try {
            result = getAddress(param.address);
            isValid = true
        } catch (e) {
            isValid = false;
        }

        return Promise.resolve({
            isValid: isValid,
            address: result
        });
    }

    convert2HexString(data: any): string {
        let n: BigNumber
        if (BigNumber.isBigNumber(data)) {
            n = data
        } else {
            // number or string
            n = new BigNumber(data)
        }
        return base.toBigIntHex(n)
    }

    convert2KaiaTxParam(data: any): KaiaTxParams {
        if (!data.gasPrice || !data.gasLimit) {
            throw new Error("invalid parameter")
        }
        const param = {
            kaiaTxType: data.kaiaTxType,
            feePayer: data.feePayer,
            senderRawTx: data.senderRawTx,
            from: data.from,
            to: data.to,
            // default: value = 0
            value: this.convert2HexString(data.value || 0),
            nonce: data.nonce,
            contractAddress: data.contractAddress,
            gasPrice: this.convert2HexString(data.gasPrice || 0),
            gasLimit: this.convert2HexString(data.gasLimit || 0),
            data: data.data,
            humanReadable: data.humanReadable,
            codeFormat: data.codeFormat,
            key: data.key,
            // default chainId: eth mainnet
            chainId: this.convert2HexString(data.chainId || 1),
            type: data.type || 0,
            maxPriorityFeePerGas: this.convert2HexString(data.maxPriorityFeePerGas || 0),
            maxFeePerGas: this.convert2HexString(data.maxFeePerGas || 0),
            feeRatio: data.feeRatio
        }
        return param as KaiaTxParams
    }

    async signTransaction(param: SignTxParams): Promise<any> {
        try {
            const privateKey = param.privateKey;
            if (privateKey) {
                assertBufferLength(base.fromHex(privateKey), 32)
            }

            if (param.data.senderRawTx) {
                const w = new Wallet(param.privateKey);
                return w.signTransactionAsFeePayer(param.data.senderRawTx)
            } else if (param.data.kaiaTxType) {
                const w = new Wallet(param.privateKey);
                const txParams = this.convert2KaiaTxParam(param.data);
                let tx = {
                    type: txParams.kaiaTxType, // fee delegated smart contract execution
                    chainId: txParams.chainId,
                    from: txParams.from,
                    nonce: txParams.nonce,
                    to: txParams.to,
                    data: txParams.data,
                    humanReadable: txParams.humanReadable,
                    codeFormat: txParams.codeFormat,
                    key: txParams.key,
                    value: txParams.value,
                    gasLimit: txParams.gasLimit,
                    gasPrice: txParams.gasPrice,
                    maxFeePerGas: txParams.maxFeePerGas,
                    maxPriorityFeePerGas: txParams.maxPriorityFeePerGas,
                    feeRatio: txParams.feeRatio,
                }
                let pTx = await w.populateTransaction(tx);
                return Promise.resolve(w.signTransaction(pTx));
            } else {
                return super.signTransaction(param)
            }
        } catch (e) {
            return Promise.reject(SignTxError)
        }
    }

    getAddressByPublicKey(param: GetAddressParams): Promise<string> {
        return Promise.resolve(computeAddress(base.fromHex(param.publicKey)));
    }

    async getMPCRawTransaction(param: MpcRawTransactionParam): Promise<any> {
        return Promise.reject(GetMpcRawTransactionError);
    }

    async getMPCTransaction(param: MpcTransactionParam): Promise<any> {
        return Promise.reject(GetMpcTransactionError);
    }

    async getMPCRawMessage(param: MpcRawTransactionParam): Promise<any> {
        return Promise.reject(GetMpcRawTransactionError);
    }

    async getMPCSignedMessage(param: MpcMessageParam): Promise<any> {
        return Promise.reject(GetMpcTransactionError);
    }

    async getHardWareRawTransaction(param: SignTxParams): Promise<any> {
        // try {
        //     const rawTx = await this.signTransaction(param as SignTxParams);
        //     return Promise.resolve(rawTx.serializeRaw);
        // } catch (e) {
        //     return Promise.reject(GetHardwareRawTransactionError);
        // }
        return Promise.reject(GetHardwareRawTransactionError);
    }

    // BTC does not need to implement this interface. Hardware wallets can directly generate and broadcast transactions.
    async getHardWareSignedTransaction(param: HardwareRawTransactionParam): Promise<any> {
        // try {
        //     let klaytnTx = KlaytnTxFactory.fromRLP(param.raw)
        //     klaytnTx.addSenderSig([param.v!, param.r!, param.s!])
        //     return Promise.resolve(klaytnTx.txHashRLP());
        // } catch (e) {
        //     return Promise.reject(GetHardwareSignedTransactionError);
        // }
        return Promise.reject(GetHardwareSignedTransactionError);
    }

    async calcTxHash(param: CalcTxHashParams): Promise<string> {
        const signedTx = KlaytnTxFactory.fromRLP(param.data);
        let txHex = signedTx.txHashRLP();
        return Promise.resolve(base.toHex(keccak256(base.fromHex(txHex)), true));
    }

    async validSignedTransaction(param: ValidSignedTransactionParams): Promise<any> {
        return Promise.reject(validSignedTransactionError);
    }
}
