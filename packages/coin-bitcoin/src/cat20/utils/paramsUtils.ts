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
    OpenMinterState,
    OpenMinterV2State,
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

export function minterParse(minterStr: string, metadata: TokenMetadata, rawTx: string): OpenMinterContract {
    const minter = JSON.parse(minterStr);
    const protocolState = ProtocolState.fromStateHashList(
        minter.txoStateHashes as ProtocolStateList,
    );

    const data = getOpenMinterState(
        metadata,
        minter.utxo.txId,
        minter.utxo.outputIndex,
        rawTx,
    );

    if (data === null) {
        throw new Error(
            `get open minter state failed, minter: ${metadata.minterAddr}, txId: ${minter.utxo.txId}`,
        );
    }

    if (typeof minter.utxo.satoshis === 'string') {
        minter.utxo.satoshis = parseInt(minter.utxo.satoshis);
    }

    return {
        utxo: minter.utxo,
        state: {
            protocolState,
            data,
        },
    } as OpenMinterContract;
}

const getOpenMinterState = function (
    metadata: TokenMetadata,
    txId: string,
    vout: number,
    txhex: string
): OpenMinterState | OpenMinterV2State | null {
    const minterP2TR = toP2tr(metadata.minterAddr);
    const tokenP2TR = toP2tr(metadata.tokenAddr);
    const info = metadata.info as OpenMinterTokenInfo;
    const scaledInfo = scaleConfig(info);

    // first mint
    if (txId === metadata.revealTxid) {
        if (metadata.info.minterMd5 == MinterType.OPEN_MINTER_V2) {
            return {
                isPremined: false,
                remainingSupplyCount:
                    (scaledInfo.max - scaledInfo.premine) / scaledInfo.limit,
                tokenScript: tokenP2TR,
            };
        }
        return {
            isPremined: false,
            remainingSupply: scaledInfo.max - scaledInfo.premine,
            tokenScript: tokenP2TR,
        };
    }

    const tx = new btc.Transaction(txhex);
    if (tx.id != txId) {
        throw new Error(`Invalid raw tx, \n${txId} \n${tx.id}`)
    }

    const REMAININGSUPPLY_WITNESS_INDEX = 16;

    for (let i = 0; i < tx.inputs.length; i++) {
        const witnesses = tx.inputs[i].getWitnesses();

        if (witnesses.length > 2) {
            const lockingScriptBuffer = witnesses[witnesses.length - 2];
            const { p2tr } = script2P2TR(lockingScriptBuffer);
            if (p2tr === minterP2TR) {
                if (metadata.info.minterMd5 == MinterType.OPEN_MINTER_V2) {
                    return {
                        tokenScript:
                            witnesses[REMAININGSUPPLY_WITNESS_INDEX - 2].toString('hex'),
                        isPremined: true,
                        remainingSupplyCount: byteString2Int(
                            witnesses[6 + vout].toString('hex'),
                        ),
                    };
                }
                return {
                    tokenScript:
                        witnesses[REMAININGSUPPLY_WITNESS_INDEX - 2].toString('hex'),
                    isPremined: true,
                    remainingSupply: byteString2Int(witnesses[6 + vout].toString('hex')),
                };
            }
        }
    }
    return null;
};

export function scaleConfig(config: OpenMinterTokenInfo): OpenMinterTokenInfo {
    const clone = Object.assign({}, config);

    clone.max = scaleByDecimals(config.max, config.decimals);
    clone.premine = scaleByDecimals(config.premine, config.decimals);
    clone.limit = scaleByDecimals(config.limit, config.decimals);

    return clone;
}
