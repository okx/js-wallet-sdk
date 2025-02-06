import {
    btc,
    MinterType,
    OpenMinterContract,
    OpenMinterTokenInfo,
    SupportedNetwork,
    TokenContract,
    TokenMetadata,
    UtxoInput,
} from "../common";
import {
    ProtocolState,
    ProtocolStateList
} from "@cat-protocol/cat-smartcontracts";
import {byteString2Int, UTXO} from "scrypt-ts";
import {
    getTokenContractP2TR,
    p2tr2Address,
    scaleByDecimals,
    script2P2TR,
    toP2tr,
    toTokenAddress,
} from "./utils";
import {EcKeyService} from "./eckey";

export function tokenInfoParse(tokenStr: string, network: SupportedNetwork): TokenMetadata {
    const token: TokenMetadata = JSON.parse(tokenStr);

    const tokenInfo: OpenMinterTokenInfo = JSON.parse(JSON.stringify(token.info));

    if (tokenInfo.max) {
        // convert string to  bigint
        tokenInfo.max = BigInt(tokenInfo.max);
        tokenInfo.premine = BigInt(tokenInfo.premine);
        tokenInfo.limit = BigInt(tokenInfo.limit);
    }

    token.info = tokenInfo

    if (!token.tokenAddr) {
        const minterP2TR = toP2tr(token.minterAddr);
        token.tokenAddr = p2tr2Address(
            getTokenContractP2TR(minterP2TR).p2tr,
            network,
        );
    }

    return token
}

export function feeUtxoParse(ecKey: EcKeyService, utxos: UtxoInput[]): UTXO[] {
    return utxos.map((utxo: any) => {
        // let scriptPk = btc.Script.fromAddress(utxo.address).toHex();
        let scriptPk = btc.Script.fromAddress(ecKey.getAddress()).toHex()
        return {
            txId: utxo.txId,
            outputIndex: utxo.vOut,
            script: scriptPk,
            satoshis: utxo.amount,
        };
    });
}

export function tokenUtxoParse(tokenUtxos: string): Array<TokenContract> {
    let utxos = JSON.parse(tokenUtxos);

    if (!Array.isArray(utxos)) {
        utxos = [utxos]
    }

    return utxos.map((c: any) => {
        const protocolState = ProtocolState.fromStateHashList(
            c.txoStateHashes as ProtocolStateList,
        );

        if (typeof c.utxo.satoshis === 'string') {
            c.utxo.satoshis = parseInt(c.utxo.satoshis);
        }

        let ownerAddr = c.state.address

        try {
            ownerAddr = toTokenAddress(c.state.address)
        } catch {
            // if fail just use the original address (assume its already the hashed token address)
        }

        const r: TokenContract = {
            utxo: c.utxo,
            state: {
                protocolState,
                data: {
                    ownerAddr: ownerAddr,
                    amount: BigInt(c.state.amount),
                },
            },
        };

        return r;
    })
}


export function scaleConfig(config: OpenMinterTokenInfo): OpenMinterTokenInfo {
    const clone = Object.assign({}, config);

    clone.max = scaleByDecimals(config.max, config.decimals);
    clone.premine = scaleByDecimals(config.premine, config.decimals);
    clone.limit = scaleByDecimals(config.limit, config.decimals);

    return clone;
}
